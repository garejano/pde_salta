# Ajuste — Filtro de data não é aplicado ao Relatório de Rendimento

contexto: [`./readme.md`](./readme.md)
base: `estrutura-pedagogica/backend/*`

> Segundo bug encontrado após a migração do Diário de Classe (o primeiro foi o de
> [`ajuste_CarregarFrequeciaAsync.md`](./ajuste_CarregarFrequeciaAsync.md)).

## Bug reportado

"Filtro de data não está sendo aplicado ao gerar o relatório, mesmo selecionando apenas 1º semestre,
aparecem avaliações do ano todo."

## Causa raiz

`GetDocumentoDiarioDeClasseService.CarregarRendimentoAsync` montava o `DiarioDeClasseRendimentoInternalRequest`
só com `AnoLetivoId, RedeId, SerieId, TurmaId, HashDisciplina` — o DTO nem tinha campo de data. E
`RelatorioAlunoNotaRepository.GetParaDiarioClasse` filtrava só por esses campos + `EhBoletim`/`VisivelNoBoletim`,
sem nenhuma restrição de etapa ou data. Resultado: sempre retornava **todas as etapas do ano letivo**
(1º Semestre, 2º Semestre, Resultados etc.), ignorando `request.DataInicio`/`DataTermino`.

Investiguei se dava pra filtrar comparando o range do filtro com `Etapa.DataInicio`/`DataTermino`
diretamente — mas **nenhuma `Etapa` no banco tem essas datas preenchidas** (0 de 639 etapas do ano
letivo 2026). A view `rel.RelatorioAlunoNota` (fonte do relatório) também não carrega nenhuma coluna de data.

## Como o legado resolvia isso

O TL (Rodrigo) lembrou que a resolução de etapa por data envolvia uma tabela de "RedeSerieCiclo" com datas
de início/fim por ciclo, e que a lógica original vivia no serviço de **notas** (`notas/backend`), chamado
pelo `documentacao-pedagogica` via barramento — não no próprio `documentacao-pedagogica`.

Confirmei o fluxo exato:

- `documentacao-pedagogica/backend` (`DiarioClasseGetService.cs`) só repassa `NomeEtapa` do request — não
  calcula nada; a montagem do relatório é feita por um microsserviço externo (endpoint
  `api/documentos/getrelatorioderendimento`).
- A resolução real está em `notas/backend`:
  - `Notas.Domain.Services\DiarioDeClasse\DiarioDeClasseGetService.cs:74` chama
    `_escolaSerieEtapaRepository.GetParaRelatorioDeRendimento(escolaSerie.Id, request.DataInicio, request.DataTermino)`
    e retorna **erro** se nenhuma etapa cair no período — confirma que `nomeEtapa` é derivado do range, não escolhido pelo usuário.
  - `Notas.Infra\Repositories\EscolaSerieEtapaRepository.cs:15-26`:
    ```csharp
    Queryable()
       .Where(x => x.EscolaSerieId == escolaSerieId
                && x.DataInicio  <= dataTermino
                && x.DataTermino >= dataInicio)
       .GroupBy(x => x.EtapaId)
       .Select(g => g.First())
    ```
    É um **teste de overlap de intervalos** (não igualdade exata) contra a entidade `EscolaSerieEtapa`
    (`EscolaSerieId, EtapaId, DataInicio, DataTermino`) — o "calendário" de bimestre/trimestre/semestre é
    configurado por combinação Escola+Série+Etapa, não numa tabela genérica.
  - As etapas resolvidas filtram as notas via `IRelatorioAlunoNotaRepository`.

**A boa notícia:** `EscolaSerieEtapa` já existe como entidade completa em `estrutura-pedagogica`
(feature "Configurador Escola/Etapa"), com dados reais no banco (5.023 de 20.093 linhas com datas
preenchidas) — não precisa criar nada novo, só reaproveitar.

## Correção implementada

1. **`TurmaRepository.GetParaDiarioClasse`** — passou a projetar `EscolaSerieId` (o DTO
   `TurmaInternalResponse` já tinha o campo, só não era preenchido).

2. **`IEscolaSerieEtapaRepository` / `EscolaSerieEtapaRepository`** — novo método:
   ```csharp
   Task<List<int>> GetEtapaIdsParaRelatorioDeRendimento(int escolaSerieId, DateTime dataInicio, DateTime dataTermino)
   // Where: EscolaSerieId == escolaSerieId && DataInicio <= dataTermino && DataTermino >= dataInicio
   ```
   Mesma lógica de overlap usada em `notas/backend`.

3. **`DiarioDeClasseRendimentoInternalRequest`** — novo campo `List<int> EtapaIds`.

4. **`RelatorioAlunoNotaRepository.GetParaDiarioClasse`** — adicionado `request.EtapaIds.Contains(x.EtapaId)` ao `Where`.

5. **`GetDocumentoDiarioDeClasseService`**:
   - `ContextoResolvido` ganhou `EscolaSerieId` (preenchido a partir de `turma.EscolaSerieId`).
   - `CarregarRendimentoAsync` resolve `etapaIds` via `_escolaSerieEtapaRepository` antes de consultar as
     notas; se nenhuma etapa cair no período, retorna sem popular `RelatorioRendimento` (mesmo padrão de
     guard já usado no método, sem lançar erro — diferente do `notas/backend`, que falha a request inteira;
     aqui o rendimento é só uma seção opcional do documento).

6. **Teste ajustado**: `GetDocumentoDiarioDeClasseServiceTests.Get_QuandoRendimentoComNotaNaView_...` agora
   semeia um `EscolaSerieEtapa` (`EtapaId = 1`, período cobrindo a data de teste) — sem isso, `etapaIds`
   viria vazio e o teste que espera rendimento populado quebraria.

## Validação no banco (ElevaPortalHomolog)

Rede **Elite RJ**, Escola **Bangu**, Turma **"1ª série A - M"** (`EscolaSerieId = 150976`), disciplina
**"Prática Textual e Leitura"** — EscolaSerie com "1º Semestre" (2026-02-09 a 2026-07-10) e "2º Semestre"
(2026-07-27 a 2026-12-07) bem distintos:

| Query | Resultado |
|---|---|
| Atual (sem filtro de etapa) | 726 (1º Sem.) + 792 (2º Sem.) + 198 (Resultados) = **1716 linhas**, sempre |
| Corrigida (`dataInicio=2026-02-09`, `dataTermino=2026-07-10`) | **726 linhas**, só "1º Semestre" |

```json
{
  "hashTurma":      "22D837CE-05D8-4E57-813A-8CD3E970FFE1",
  "hashEscola":     "0C3F51B3-0BAF-4A27-9394-3A52E6BBE89C",
  "hashRede":       "29FB62C7-9E0F-4AB4-8489-F35CCBF453C7",
  "hashSerie":      "7F803322-908F-4162-BABA-C8DE6469D904",
  "hashAnoLetivo":  "EA3695AB-F17B-4905-8034-B8C2A0495C06",
  "hashDisciplina": "0DBD50D4-435F-4B16-B096-024CDDB41288",
  "dataInicio":     "2026-02-09",
  "dataTermino":    "2026-07-10",
  "exibirRelatorioRendimento": true
}
```

> Bom caso de teste manual: rodar com `dataTermino = 2026-12-07` (ano todo) deve voltar a trazer as 1716
> linhas / 3 etapas — confirma que o filtro restringe sem quebrar o caso "ano inteiro".
