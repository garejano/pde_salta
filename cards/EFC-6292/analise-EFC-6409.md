# Análise de Bug — EFC-6409: Ficha do aluno sem nenhum registro

> Card: EFC-6409 | Subtarefa de: EFC-6292 | Data: 2026-05-26

---

## 1. Sintoma

Ao acessar a ficha individual de um aluno que **não possui nenhuma avaliação registrada**, o endpoint EP retorna erro em vez de um documento vazio.

**Comportamento esperado (Jira):**
> "O documento é exibido sem componentes curriculares, e as informações de frequência e resultado final refletem a ausência de registros."

**Dados do caso de teste:**

| Campo       | Valor                                          |
|-------------|------------------------------------------------|
| Rede        | Motivo                                         |
| Escola      | Caruaru                                        |
| Turma       | 2.2 AM                                         |
| AnoLetivo   | 2022                                           |
| Matrícula   | `22212724`                                     |
| HashTurma   | `96664705-833F-48CF-AF31-D75BF971779C`         |
| HashUsuario | `64920F3C-6621-4FD0-BAD1-A280141672A4`         |

> `HashUsuario` obtido via query: `PessoaEscolaAcesso(Id=3770088) → PessoaEscola → Pessoa → Usuario.Hash`

---

## 2. Validação com dados reais do banco

### 2.1 AlunoEscola — enturmação válida

```sql
SELECT ae.AlunoEscola_key, ae.Matricula, t.Hash AS HashTurma, t.Nome,
       es.Id AS EscolaSerieId, es.Serie AS SerieId, es.AnoLetivo AS AnoLetivoId,
       s.Nome AS NomeSerie
FROM AlunoEscola ae
JOIN Turma t ON t.Id = ae.Turma
LEFT JOIN EscolaSerie es ON es.Id = t.EscolaSerie
LEFT JOIN Serie s ON s.Id = es.Serie
WHERE t.Hash = '96664705-833F-48CF-AF31-D75BF971779C'
  AND ae.Matricula = '22212724'
```

**Resultado:**

| AlunoEscola_key | Matricula | NomeTurma | EscolaSerieId | SerieId | AnoLetivoId | NomeSerie       |
|-----------------|-----------|-----------|---------------|---------|-------------|-----------------|
| 3770088         | 22212724  | 2.2 AM    | 125512        | **6**   | **2022**    | 2ª Série Regular |

✅ `SerieId` = 6 (não null) — `GetParaFichaIndividual` retorna `FichaIndividualInternalGetRequest` válido.

**`FichaIndividualInternalGetRequest` confirmado:**

| Campo       | Valor                                        |
|-------------|----------------------------------------------|
| AnoLetivoId | 2022                                         |
| PessoaId    | 1966722                                      |
| RedeId      | 52                                           |
| SerieId     | 6                                            |
| TurmaId     | 172078                                       |
| HashUsuario | `64920F3C-6621-4FD0-BAD1-A280141672A4`       |

### 2.2 View `rel.RelatorioAlunoNota` — nenhuma linha

```sql
SELECT NomeDisciplinaParaDocumentosOficiais, EtapaDeBoletim, VisivelNoBoletim,
       HashEstruturaAvaliacao, NotaComPeso, IdSerie
FROM rel.RelatorioAlunoNota
WHERE IdAluno = 1966722   -- PessoaId do aluno
  AND IdAnoLetivo = 2022
```

**Resultado: 0 linhas.**

Query ampliada (sem filtro de ano) também retornou **0 linhas** — o aluno não possui nenhuma entrada na view em nenhum ano letivo.

### 2.3 `RedeSerieCiclo` — RedeId=52 ausente

`AplicarRemocaoDeNotasParciais` depende de `RedeSerieCicloRepository.GetParaFichaIndividual`, que filtra por `RedeId=52` e `SerieId=6`. A tabela `RedeSerieCiclo` possui 76 registros para `SerieId=6`, mas distribuídos entre redes 2, 3, 4, 5, 7, 9, 13, 14, 15, 16, 17, 23, 25, 26, 27, 39 e 41 — **RedeId=52 não está presente**.

Resultado: `redeSerieCiclo` retorna lista vazia → `etapasComResultadosParciais` = lista vazia → `RemoverNotasParciais` nunca chamado. `AplicarRemocaoDeNotasParciais` é no-op para esse caso — seguro passar ficha vazia.

---

## 3. Localização do bug

### 3.1 Fluxo no EP `FichaIndividualGetService.GetModeloCompleto`

```
GET /api/fichaindividual/getfichaindividual
  → Validate(request)                             ✅ HashUsuario + HashTurma presentes
  → AlunoEscolaRepository.GetParaFichaIndividual  ✅ retorna InternalRequest (SerieId=6, AnoLetivo=2022)
  → RelatorioAlunoNotaRepository.GetParaFichaIndividual
      WHERE IdAluno=1966722 AND IdAnoLetivo=2022 AND EtapaDeBoletim=1 AND VisivelNoBoletim=1
      AND SerieId=6 AND HashEstruturaAvaliacao != '00000000-...'
                                                  ❌ retorna lista vazia (0 linhas confirmado)
  → if (!fichaIndividual.Any())
      return result.WithError("Não existem avaliações para o filtro informado.")  ← BUG
```

### 3.2 Por que é um bug

`FormatarEscopo` já lida corretamente com lista vazia:

```csharp
// FichaIndividualGetService.cs
private static FichaIndividualEscopoGetResponse FormatarEscopo(List<FichaIndividualInternalGetResponse> request)
{
    if (request?.Any() != true) { return new(); }  // ← retorna escopo vazio
    ...
}
```

A guarda `if (!fichaIndividual.Any()) return WithError(...)` impede que `FormatarFicha` seja chamado com lista vazia, que produziria exatamente o comportamento correto: todos os escopos vazios.

O mesmo problema existe em `GetModeloResumido`:
```csharp
var fichaIndividual = await _relatorioAlunoNotaRepository.GetParaFichaIndividualResumida(...);
if (!fichaIndividual.Any())
{
    return result.WithError("Não existem avaliações para o filtro informado.");  // ← mesmo bug
}
```

### 3.3 Sobre "aluno sem AnoSerie"

A frase **não existe no código do EP** — o EP retorna apenas `"Os dados informados não são válidos."` (quando `internalRequest == null`) ou `"Não existem avaliações para o filtro informado."` (quando lista vazia). A menção a "AnoSerie" provavelmente vem de um tratamento de erro no frontend do `documentacao-pedagogica` ao exibir a resposta de erro do backend.

---

## 4. Correção

### 4.1 `GetModeloCompleto` — remover guarda de erro para lista vazia

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

### 4.2 `GetModeloResumido` — mesma correção

```csharp
// ANTES
var fichaIndividual = await _relatorioAlunoNotaRepository.GetParaFichaIndividualResumida(internalRequest, ciclos...);
if (!fichaIndividual.Any())
{
    return result.WithError("Não existem avaliações para o filtro informado.");
}
result.Data = FormatarFicha(fichaIndividual);

// DEPOIS
var fichaIndividual = await _relatorioAlunoNotaRepository.GetParaFichaIndividualResumida(internalRequest, ciclos...);
result.Data = FormatarFicha(fichaIndividual);
```

> **Nota:** A guarda `if (!ciclos.Any()) return WithError(...)` em `GetModeloResumido` pode permanecer — ciclos são estrutura do currículo, independentes de avaliações. Se ciclos não existem para a série, é um dado de configuração ausente, não o cenário "aluno sem avaliações".

### 4.3 Coerência da correção

| Ponto | Análise |
|---|---|
| `FormatarEscopo` retorna `new()` para lista vazia | ✅ já implementado — nenhuma alteração necessária |
| `FormatarFicha([])` produz todos os 4 escopos vazios | ✅ `requestRegular/Diversificado/Itinerario/Dependencia` são listas vazias filtradas de `[]` |
| `Legenda` só é gerada se `EscopoRegular.Etapas?.Any() == true` | ✅ lista vazia → sem legenda — correto |
| `AplicarRemocaoDeNotasParciais` com ficha vazia | ✅ verificações `?.Any() == true` antes de cada escopo protegem contra NullReference |
| Resposta HTTP não muda (200 OK) | ✅ `result.Data` preenchido com objeto válido |

### 4.4 Arquivo a modificar

`EstruturaPedagogica.Domain.Services/FichaIndividual/FichaIndividualGetService.cs`

---

## 5. Request para validação no Postman (após fix)

```json
POST /api/fichaindividual/getfichaindividual
{
  "hashUsuario": "64920F3C-6621-4FD0-BAD1-A280141672A4",
  "hashTurma": "96664705-833F-48CF-AF31-D75BF971779C",
  "retornarResultadosParciais": false
}
```

**Resultado esperado após o fix:**
```json
{
  "data": {
    "escopoRegular":        { "etapas": null, "disciplinas": null },
    "escopoDiversificado":  { "etapas": null, "disciplinas": null },
    "escopoItinerarioSemestral": { "etapas": null, "disciplinas": null },
    "escopoDependencia":    { "etapas": null, "disciplinas": null },
    "legenda": null
  },
  "errors": []
}
```
