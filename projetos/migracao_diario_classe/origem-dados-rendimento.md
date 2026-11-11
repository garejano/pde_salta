# Origem dos dados — Relatório de Rendimento (Diário de Classe)

Documento de referência: de onde vêm os dados que montam a tabela de Relatório de Rendimento no novo diário de classe (`estrutura-pedagogica`), com ênfase em **de onde vem o texto exibido nos preHeaders** (o cabeçalho agrupado por etapa/bimestre, ex. "1º Bimestre" acima de Av1/Av2/Trabalho/Média).

Contexto relacionado: [`mudanca_tabela_rendimento.md`](./mudanca_tabela_rendimento.md), [`readme.md`](./readme.md).

---

## Visão geral do fluxo

```
SQL Server view rel.RelatorioAlunoNota
        │  (RelatorioAlunoNotaRepository.GetParaDiarioClasse)
        ▼
DiarioDeClasseRendimentoInternalResponse (1 linha por aluno × avaliação)
        │  (GetDocumentoDiarioDeClasseService.MontarRelatorioRendimento)
        ▼
DiarioDeClasseRendimentoResponse { Colunas[], Alunos[] }
        │  (DiarioDeClasseController → POST api/DiarioDeClasse/get-documento)
        ▼
frontend: DiarioDeClasseDocumentoResponse.relatorioRendimento
        │  (listar.component.ts → buildBundle, sem transformação)
        ▼
DocGridRendimentoData { colunas[], alunos[] }
        │  (DocGridRendimentoComponent.splitColumns)
        ▼
DocWideTableData.preHeaders[]  →  DocTableComponent (renderiza o <th colspan>)
```

O aluno (nome/matrícula) segue um caminho **paralelo e independente** das notas — vem de outra tabela/repositório e é casado com as notas em memória, no backend, por `PessoaId`.

---

## 1. Backend — origem das notas e das etapas (view `rel.RelatorioAlunoNota`)

Tudo que vira coluna do relatório (incluindo o texto do preHeader) nasce numa **view do SQL Server**: `rel.RelatorioAlunoNota`.

| Peça | Arquivo |
|---|---|
| Entidade EF da view | `backend/EstruturaPedagogica.Domain/Entities/Views/RelatorioAlunoNota.cs` |
| Mapeamento (`ToView("RelatorioAlunoNota", schema: "rel")`) | `backend/EstruturaPedagogica.Infra/Mapping/Views/RelatorioAlunoNotaMap.cs` |
| Repositório / query | `backend/EstruturaPedagogica.Infra/Repositories/Views/RelatorioAlunoNotaRepository.cs` → método `GetParaDiarioClasse` |
| Request interno da query | `DiarioDeClasseRendimentoInternalRequest.cs` |
| Response interno (1 linha = 1 aluno × 1 avaliação) | `DiarioDeClasseRendimentoInternalResponse.cs` |

`GetParaDiarioClasse` filtra a view por:

```csharp
x.AnoLetivoId == request.AnoLetivoId
&& x.RedeId == request.RedeId
&& x.SerieId == request.SerieId
&& x.TurmaId == request.TurmaId
&& x.HashDisciplinaMae == request.HashDisciplina
&& x.EhBoletim
&& x.VisivelNoBoletim
&& x.HashEstruturaAvaliacao != Guid.Empty
```

e ordena por `OrderBy(Ordem).ThenBy(OrdemDisciplina).ThenBy(NomeDisciplina)`.

**`AnoLetivoId`/`SerieId` vêm de hashes do request** (resolvidos via `_anoLetivoRepository.GetIdByHash` / `_serieRepository.GetIdByHash`); `RedeId`/`TurmaId`/`HashDisciplina` vêm do contexto já resolvido em `ResolverContextoAsync` (turma, escola, disciplina informados no filtro da tela).

### De onde vem o texto do preHeader

O texto agrupado ("1º Bimestre", "2º Bimestre", "Final"...) é a coluna **`NomeEtapa`** da view, copiada sem nenhuma transformação:

```csharp
// GetDocumentoDiarioDeClasseService.MontarRelatorioRendimento
var colunas = dados
   .Select(x => new DiarioDeClasseRendimentoColunaResponse
   {
      HashEstruturaAvaliacao = x.HashEstruturaAvaliacao,
      HashEtapa              = x.HashEtapa,
      NomeEtapa              = x.NomeEtapa,              // ← texto do preHeader
      Nome                   = x.SiglaTipoAvaliacao,      // ← texto do header individual (Av1, Prova, Média...)
      NotaMaxima             = x.NotaMaximaEstruturaAvaliacao,
      Ordem                  = x.Ordem,
      EhResultado = x.EhResultadoEtapa || x.EhResultadoEtapaRecuperada
                  || x.EhResultadoAnual || x.EhResultadoFinal,
      EhSituacao = x.TipoResultadoId == TipoResultadoEntity.Situacao,
   })
   .DistinctBy(x => x.HashEstruturaAvaliacao)
   .OrderBy(x => x.Ordem)
   .ToList();
```

Ou seja: **uma "coluna" do relatório = uma "estrutura de avaliação"** (`HashEstruturaAvaliacao`) distinta na view — cada avaliação carrega consigo o nome da etapa a que pertence (`NomeEtapa`/`HashEtapa`). Não existe, no backend, uma estrutura já agrupada por etapa (tipo `etapas: [{ nome, colunas: [...] }]`) — isso é responsabilidade do frontend (seção 3).

**Importante — contiguidade depende de `Ordem`:** a view não é agrupada explicitamente por etapa (não há `GroupBy(HashEtapa)`/`ThenBy(HashEtapa)`); a suposição é que a coluna `Ordem` da view já vem pré-sequenciada por etapa (todas as avaliações do 1º Bimestre com `Ordem` menor que as do 2º Bimestre, etc.). O agrupamento visual do preHeader (seção 3) só funciona corretamente se essa suposição for verdadeira — se `Ordem` vier fora de sequência, o mesmo `NomeEtapa` pode aparecer em dois grupos separados e não-contíguos. Isso ainda não tem teste de regressão cobrindo múltiplas etapas (só testes de guard-clause em `GetDocumentoDiarioDeClasseServiceTests.cs`).

Coluna Final/Situação: não existe um flag especial de "é a etapa final" — é só mais uma linha da view com seu próprio `NomeEtapa` (ex. "Final") e `TipoResultadoId` = Situação (`EhSituacao = true`). O agrupamento trata ela exatamente igual às demais etapas.

---

## 2. Backend — origem do aluno (nome/matrícula)

Vem de uma consulta **separada**, não relacionada à view de notas:

| Peça | Arquivo |
|---|---|
| Repositório | `backend/EstruturaPedagogica.Infra/Repositories/Base/AlunoEscolaRepository.cs` → `GetAlunosPorTurmaParaDiario` |
| DTO | `backend/EstruturaPedagogica.Domain/DTO/AlunoEscola/AlunoTurmaComDadosInternalResponse.cs` |

```csharp
.Select(x => new AlunoTurmaComDadosInternalResponse
{
   TurmaId    = x.TurmaId,
   PessoaId   = x.AlunoEscola_key.PessoaEscola.PessoaId,
   HashPessoa = x.AlunoEscola_key.PessoaEscola.Pessoa.Hash,
   NomePessoa = x.AlunoEscola_key.PessoaEscola.Pessoa.NomeSocial ?? x.AlunoEscola_key.PessoaEscola.Pessoa.Nome,
   Matricula  = x.Matricula,               // ← direto da tabela AlunoEscola
   ...
})
```

Segue a mesma cadeia de hash documentada no `CLAUDE.md` do salta_brain: `AlunoEscola.AlunoEscola_key → PessoaEscolaAcesso.PessoaEscola → Pessoa`. A `Matricula` está na própria tabela `AlunoEscola`, não em `Pessoa`.

Essa lista de alunos (`alunos`) é **a mesma usada pela grade de chamada (Frequência)** — é buscada uma única vez em `CarregarFrequenciaAsync` e reaproveitada em `CarregarRendimentoAsync`.

### Como aluno e nota se casam

Em `MontarRelatorioRendimento`, para cada aluno da lista acima, o serviço filtra as linhas da view por `PessoaId` e monta uma nota por coluna (na mesma ordem de `colunas`):

```csharp
var alunosRendimento = alunos.Select(aluno =>
{
   var dadosPessoa = dados.Where(x => x.PessoaId == aluno.PessoaId).ToList();
   var notas = colunas.Select(col =>
   {
      var nota = dadosPessoa.FirstOrDefault(x => x.HashEstruturaAvaliacao == col.HashEstruturaAvaliacao);
      return new DiarioDeClasseRendimentoNotaResponse { NotaFormativa = nota?.NotaFormativa, NotaComPeso = nota?.NotaComPeso, Situacao = nota?.Situacao, ... };
   }).ToList();

   return new DiarioDeClasseRendimentoAlunoResponse
   {
      HashPessoa = aluno.HashPessoa,
      NomeAluno  = aluno.NomePessoa,
      Matricula  = aluno.Matricula,
      Notas      = notas,
   };
}).OrderBy(a => a.NomeAluno).ToList();
```

`alunos[i].notas` é um **array paralelo** a `colunas` (mesma ordem e contagem) — não é um dicionário por hash. Se um aluno não tem nota lançada para uma avaliação, a posição correspondente fica com campos nulos.

---

## 3. Backend → Frontend — resposta exposta pela API

| Endpoint | Arquivo |
|---|---|
| `POST api/DiarioDeClasse/get-documento` | `backend/EstruturaPedagogica.Api/Controllers/DiarioDeClasseController.cs` |

A resposta (`DiarioDeClasseDocumentoResponse.RelatorioRendimento`) chega ao Angular tipada em:

```
frontend/src/app/features/diario-de-classe/models/diario-de-classe.model.ts
  DiarioDeClasseRendimentoResponse       { colunas, alunos }
  DiarioDeClasseRendimentoColunaResponse { hashEstruturaAvaliacao, hashEtapa, nomeEtapa, nome, notaMaxima, ordem, ehResultado, ehSituacao }
  DiarioDeClasseRendimentoAlunoResponse  { hashPessoa, nomeAluno, matricula, notas }
  DiarioDeClasseRendimentoNotaResponse   { ... }
```

`listar.component.ts` (`buildBundle`) repassa `colunas`/`alunos` **sem nenhuma transformação** para o componente de grid:

```ts
// frontend/src/app/features/diario-de-classe/listar/listar.component.ts
if (this.secoes.exibirRelatorioRendimento && data.relatorioRendimento?.colunas?.length > 0) {
  entries.push({
    name: 'Relatório de Rendimento',
    componentType: DocGridRendimentoComponent,
    data: { colunas: data.relatorioRendimento.colunas, alunos: data.relatorioRendimento.alunos } as DocGridRendimentoData,
  });
}
```

Ou seja: até este ponto, `nomeEtapa` continua sendo exatamente o valor que saiu da view `rel.RelatorioAlunoNota.NomeEtapa`.

---

## 4. Frontend — onde o preHeader é efetivamente montado

Arquivo: `frontend/src/shared/document-builder/components/doc-grid-rendimento/doc-grid-rendimento.component.ts`

O array `colunas` chega **plano** (uma entrada por avaliação, sem agrupamento). É o `DocGridRendimentoComponent` quem reconstrói o agrupamento por etapa, no cliente:

1. **`etapaGroups()`** — varre `this.data.colunas` em ordem e agrupa **índices consecutivos que compartilham o mesmo `nomeEtapa`** (mesmo texto/string). Não usa `hashEtapa` para agrupar, só `nomeEtapa` — por isso a contiguidade do array (que depende do `Ordem` do backend, seção 1) é essencial.
2. **`widenForEtapaLabels()`** — mede a largura do texto de `nomeEtapa` (mesma função `measureColWidth` usada pelos headers normais) e, se as colunas do grupo forem estreitas demais para caber o label, distribui a diferença entre elas.
3. **`buildPreHeaders(groupIndices)`** — para cada fatia de colunas que cabe na largura da página, escaneia por trechos contíguos de `nomeEtapa` e gera um `PreHeaderItem`:
   ```ts
   preHeaders.push({ label: nomeEtapa, start: FIXED_COLS + runStart + 1, end: FIXED_COLS + k + 1 });
   ```
   `label` aqui **é o mesmo texto de `colunas[i].nomeEtapa`**, ou seja, em última instância, é o `NomeEtapa` da view do SQL Server, sem nenhuma tradução/formatação no caminho.
4. O array de `preHeaders` é colocado em `DocWideTableData.preHeaders` e passado para `DocWideTableComponent` → `DocTableComponent`, que renderiza a linha `<tr>` extra no `<thead>` com `<th colspan>` (getter `preHeaderCells` em `doc-table.component.ts`).

Modelos envolvidos: `PreHeaderItem`, `DocWideTableData`, `DocTableData`, `DocGridRendimentoData` — todos em `frontend/src/shared/document-builder/models/document-config.ts`.

---

## 5. Onde mexer, dependendo do que precisa mudar

| Quero mudar... | Onde mexer |
|---|---|
| O texto do preHeader (nome da etapa/bimestre) | Na origem: view `rel.RelatorioAlunoNota` (coluna `NomeEtapa`) — nenhum código do diário de classe transforma esse texto |
| O nome individual da coluna (Av1, Prova, Média...) | Coluna `SiglaTipoAvaliacao` da view |
| Quais colunas entram no relatório (filtro) | `RelatorioAlunoNotaRepository.GetParaDiarioClasse` (filtros `EhBoletim`, `VisivelNoBoletim`, etc.) |
| Como as colunas são agrupadas visualmente por etapa | `DocGridRendimentoComponent.etapaGroups()` / `buildPreHeaders()` — puramente client-side |
| Nome/matrícula do aluno | `AlunoEscolaRepository.GetAlunosPorTurmaParaDiario` (tabela `AlunoEscola`, não a view de notas) |
| Layout/renderização do cabeçalho agrupado (bordas, colspan) | `DocTableComponent` (getter `preHeaderCells`), reaproveitado também por `DocGridDiarioComponent` |

---

## Dados de exemplo / mock para teste visual

Rota `/exemplos/diario-classe` (`frontend/src/app/features/exemplos/diario-classe-exemplo/diario-classe-exemplo.component.ts`) tem mocks de `colunas`/`alunos` que simulam exatamente essa estrutura (3 bimestres + "Final"), usados para validar visualmente o preHeader sem precisar de dados reais do banco.
