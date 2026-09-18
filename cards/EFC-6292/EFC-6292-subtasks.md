# EFC-6292 — Tracking de Subtarefas

> Card pai: [EFC-6292](https://gruposalta.atlassian.net/browse/EFC-6292) — Migração de endpoint da Ficha Individual de notas para estrutura-pedagogica  
> Gerado em: 2026-05-26

---

## Subtarefas

### EFC-6406 — Configuração exibe só LIV e na ficha exibe além

- **Status Jira:** Aberta
- **Jira:** https://gruposalta.atlassian.net/browse/EFC-6406
- **Status local:** [x] Concluída

**Notas de implementação:**

Causa raiz: `GetQueryable` em `RelatorioAlunoNotaRepository` não filtrava por `SerieId` nem por `HashEstruturaAvaliacao`, retornando disciplinas classificadas como diversificadas na matriz curricular mas sem avaliação configurada no Configurador.

Fix aplicado nos dois repos (`estrutura-pedagogica` e `notas`):
```csharp
&& x.SerieId == request.SerieId
&& x.HashEstruturaAvaliacao != Guid.Empty
```

Arquivos alterados:
- `EstruturaPedagogica.Infra/Repositories/Views/RelatorioAlunoNotaRepository.cs`
- `Notas.Infra/Repositories/Views/RelatorioAlunoNotaRepository.cs`

Análise completa: `cards/EFC-6292/analise-bug-parte-diversificada.md`

---

### EFC-6408 — Observação não é exibida na ficha individual

- **Status Jira:** Aberta
- **Jira:** https://gruposalta.atlassian.net/browse/EFC-6408
- **Status local:** [ ] Em análise

**Dados de teste (Jira):**

| Campo      | Valor                                          |
|------------|------------------------------------------------|
| Rede       | Coleguium MG                                   |
| Escola     | Ouro Preto                                     |
| Turma      | 3ª série A - M                                 |
| HashRede   | `98CD62E1-0350-4DB8-9181-420BA0EEE1FC`         |
| HashTurma  | `49B57797-F302-4DA5-8ECA-84A003A1C245`         |
| Matrícula  | `80012508`                                     |
| HashAluno  | `9D01F492-A6DB-4189-BF24-D11D50B3F965`         |

Observação esperada: `"2020: Lei Federal nº 14.040 de 19/08/2020; Resolução CEE nº 474 de 08/05/2020. // 2021: ..."`

**Análise:**

`ObservacoesAluno` **não vem de EP nem de notas** — é preenchida pelo `documentacao-pedagogica` a partir de `HistoricoSerieRepository.GetToFichaIndividualGetRequest`, que consulta a DB local do docped usando:
```csharp
x.AnoLetivo.Hash == request.HashAnoLetivo
&& x.Escola.Rede.Hash == request.HashRede
&& x.Serie.Hash == request.HashSerie          // HashSerie = SeriePrincipal.Hash
&& x.Historico.Usuario.Hash == request.HashUsuario
```
→ `FichaIndividualGetService.cs:319` — `ficha.ObservacoesAluno = historicoSerie.ObservacoesAluno`

A ficha abre (não retorna "Não foram encontradas séries"), portanto o `HistoricoSerie` é encontrado. O problema é que `HistoricoSerie.ObservacoesAluno` está null para esse aluno/AnoLetivo no banco do docped.

**Investigação necessária:**

1. Confirmar que a observação existe na source de verdade (talvez na tabela `HistoricoSerie` do docped para AnoLetivo anterior, ex.: 2020/2021):
```sql
SELECT hs.AnoLetivoId, hs.ObservacoesAluno, s.Nome AS Serie
FROM HistoricoSerie hs
JOIN Historico h ON h.Id = hs.HistoricoId
JOIN Usuario u ON u.Id = h.UsuarioId
JOIN Serie s ON s.Id = hs.SerieId
WHERE u.Hash = '9D01F492-A6DB-4189-BF24-D11D50B3F965'
ORDER BY hs.AnoLetivoId DESC
-- (banco: documentacao-pedagogica)
```

2. Se o dado existe para anos anteriores mas não 2025: verificar se o processo de "carry-forward" de observações entre anos letivos existe e está funcionando.

3. Se nunca foi persistido: pode ser bug no endpoint de save (`HistoricoSerieUpdateService`), ou a observação vem de um import que não mapeou esse campo.

**Notas de implementação:**

> _(preencher após investigação)_

---

### EFC-6409 — Ficha do aluno sem nenhum registro

- **Status Jira:** Aberta
- **Jira:** https://gruposalta.atlassian.net/browse/EFC-6409
- **Status local:** [x] Concluída

**Contexto (QA — Mariana, 2026-05-22):**

No homolog, o único registro com `Status = 'Reprovado'` é do AnoLetivo 2022.

| Campo      | Valor                                        |
|------------|----------------------------------------------|
| Rede       | Motivo                                       |
| Escola     | Caruaru                                      |
| Turma      | 2.2 AM                                       |
| HashRede   | `4F79ADEC-4D7F-43E8-B4EF-B0172DC000DB`       |
| HashTurma  | `96664705-833F-48CF-AF31-D75BF971779C`       |
| Matrícula  | `22212724`                                   |
| HashAluno  | `CB5ACECC-15E6-4520-A1B0-686420F3AFD2`       |

Problema reportado: ficha não abriu — aluno sem AnoSerie.

**Comportamento esperado (Jira):**

> "O documento é exibido sem componentes curriculares, e as informações de frequência e resultado final refletem a ausência de registros."

**Análise:**

Dois pontos de falha identificados no EP:

**Ponto 1 — `GetParaFichaIndividual` retorna null:**
Se `AlunoEscola.Turma.EscolaSerie.SerieId` for null ou o aluno não tiver enturmação válida, `AlunoEscolaRepository.GetParaFichaIndividual` retorna null → EP devolve `"Os dados informados não são válidos."`. O contexto "aluno sem AnoSerie" aponta para esse cenário.

**Ponto 2 — lista de notas vazia retorna erro:**
No `FichaIndividualGetService.GetModeloCompleto` (EP):
```csharp
if (!fichaIndividual.Any())
{
    return result.WithError("Não existem avaliações para o filtro informado.");  // ← incorreto
}
```
O comportamento esperado é retornar um documento vazio, não um erro. `FormatarFicha` já lida com lista vazia corretamente (`FormatarEscopo` retorna `new()` quando `request?.Any() != true`).

**Fix proposto:**

```csharp
// ANTES
var fichaIndividual = await _relatorioAlunoNotaRepository.GetParaFichaIndividual(internalRequest);
if (!fichaIndividual.Any())
{
    return result.WithError("Não existem avaliações para o filtro informado.");
}
result.Data = FormatarFicha(fichaIndividual);

// DEPOIS
var fichaIndividual = await _relatorioAlunoNotaRepository.GetParaFichaIndividual(internalRequest);
result.Data = FormatarFicha(fichaIndividual);  // FormatarEscopo retorna new() para lista vazia
```

O mesmo ajuste deve ser feito em `GetModeloResumido`.

**Investigação necessária antes de implementar:**

Validar por que `GetParaFichaIndividual` retorna null para esse aluno. Rodar no banco EP:
```sql
SELECT ae.AlunoEscola_key, t.Hash AS HashTurma, es.SerieId, es.AnoLetivoId
FROM AlunoEscola ae
JOIN Turma t ON t.Id = ae.Turma
LEFT JOIN EscolaSerie es ON es.Id = t.EscolaSerie
WHERE t.Hash = '96664705-833F-48CF-AF31-D75BF971779C'
```
Se `SerieId` for null ou `EscolaSerie` não existir → bug na enturmação, não em EP. Documentar e tratar com mensagem adequada.

**Arquivo a modificar:**
- `EstruturaPedagogica.Domain.Services/FichaIndividual/FichaIndividualGetService.cs`

**Notas de implementação:**

Fix aplicado em `estrutura-pedagogica`:
- `EstruturaPedagogica.Domain.Services/FichaIndividual/FichaIndividualGetService.cs`
  - `GetModeloCompleto`: removida guarda `if (!fichaIndividual.Any()) return WithError(...)`
  - `GetModeloResumido`: mesma remoção

Dados confirmados no banco (`FichaIndividualInternalGetRequest`): `AnoLetivoId=2022, PessoaId=1966722, RedeId=52, SerieId=6, TurmaId=172078`. View retorna 0 linhas para esse aluno em qualquer ano. `RedeSerieCiclo` para RedeId=52 ausente — `AplicarRemocaoDeNotasParciais` é no-op.

Análise completa: `cards/EFC-6292/analise-EFC-6409.md`

---

## Progresso

| Key       | Resumo                                              | Status local       |
|-----------|-----------------------------------------------------|--------------------|
| EFC-6406  | Configuração exibe só LIV e na ficha exibe além     | [x] Concluída      |
| EFC-6408  | Observação não é exibida na ficha individual        | [ ] Em análise     |
| EFC-6409  | Ficha do aluno sem nenhum registro                  | [x] Concluída      |
