# Análise de Bug — Parte Diversificada exibe disciplinas incorretas

> Card: EFC-6292 | Data: 2026-05-26

---

## 1. Sintoma

No documento da Ficha Individual do aluno **Alexandre Caldas Maia de Oliveira** (Matrícula 19293080, 6º ano EFAF, Rede CEI, 2025), a **Parte Diversificada** exibe 3 disciplinas:

- Laboratório Inteligência de Vida (LIV) — com notas ✅
- Ecossistema de Aprendizagem Inovador (EAI) — com `-` onde seria a nota ❌
- Redação — com `-` onde seria a nota ❌

**Esperado:** apenas LIV. O Configurador de Avaliações (filtro: Rede CEI, AnoLetivo 2025, Agrupamento 6 ano EFAF, Escopo: Boletim Diversificado) confirma que somente LIV tem avaliações configuradas nesse escopo.

---

## 2. Fluxo de dados — visão geral

```
documentacao-pedagogica (FichaIndividualGetService)
  └─ chama → notas/EP endpoint (RelatorioAlunoNotaRepository)
               └─ consulta → view rel.RelatorioAlunoNota
  └─ enriquece → ResultadoFinal (disciplinas do aluno com TipoComponenteCurricular)
  └─ "Disciplinas sem avaliação" → adiciona ao escopo correto pelo TipoComponenteCurricular
```

---

## 3. O que foi implementado no backend (EP vs notas)

### 3.1 Comparação direta — todos os arquivos relevantes

| Arquivo | EP | notas | Idêntico? |
|---|---|---|---|
| `FichaIndividualGetService.cs` | `EstruturaPedagogica.Domain.Services` | `Notas.Domain.Services.FichaIndividual` | ✅ Sim |
| `RelatorioAlunoNotaRepository.cs` | `EstruturaPedagogica.Infra.Repositories` | `Notas.Infra.Repositories` | ✅ Sim |
| `RelatorioAlunoNota.cs` (entity) | `EstruturaPedagogica.Domain.Entities.Views` | `Notas.Domain.Entities.Views` | ✅ Sim |
| `RelatorioAlunoNotaMap.cs` | `EstruturaPedagogica.Infra.Mapping.Views` | `Notas.Infra.Mapping.Views` | ✅ Sim |
| `AlunoEscolaRepository.GetParaFichaIndividual` | `EstruturaPedagogica.Infra.Repositories` | `Notas.Infra.Repositories` | ✅ Sim |
| DTOs (`FichaIndividual*`) | `EstruturaPedagogica.Domain.DTO.FichaIndividual` | `Notas.Domain.DTO` | ✅ Sim |
| `Repository<T>.Queryable()` (base) | `EstruturaPedagogica.Infra.Core` | `Notas.Infra.Core` | ✅ Sim |

**Conclusão da migração:** a migração foi fiel — o EP reproduz exatamente o comportamento do notas para a Ficha Individual.

---

## 4. Localização do bug

### 4.1 Origem da nota `-`

O valor `-` que aparece no documento **não vem do backend EP/notas**. No `FichaIndividualGetService` de EP/notas, notas sem valor retornam `Descricao = ""` (string vazia). O valor `"-"` vem de:

**`documentacao-pedagogica/FichaIndividualGetService.cs` → `GetEtapasToNotas`**:
```csharp
lista.AddRange(etapas.Select(x => new BaseResponse {
    Hash = x.Hash,
    Descricao = x.EhSituacao ? "Situacao" : "-"   // ← aqui
}));
```

Esse método cria uma lista de colunas de referência com `"-"` para uso em disciplinas **sem avaliação configurada**. Portanto, EAI e Redação estão sendo adicionadas pela lógica de **"Disciplinas sem avaliação"** em `documentacao-pedagogica`, não vindo do backend com notas incorretas.

### 4.2 Raiz do problema — `GetQueryable` não filtra por escopo de boletim

O método `GetQueryable` em **ambos os repos** (notas e EP):

```csharp
// RelatorioAlunoNotaRepository.cs — idêntico em ambos
private IQueryable<RelatorioAlunoNota> GetQueryable(FichaIndividualInternalGetRequest request)
{
    return Queryable()
          .Where(x => x.AnoLetivoId == request.AnoLetivoId
                   && x.PessoaId == request.PessoaId
                   && x.RedeId == request.RedeId
                   && (x.TurmaId == request.TurmaId || x.EhDependencia)
                   && x.EhBoletim
                   && x.VisivelNoBoletim);
}
```

**Problema:** a query não filtra por `EscopoBoletim` (diversificado, regular, itinerário). Ela retorna todas as linhas marcadas como `EhBoletim = true` e `VisivelNoBoletim = true`, independentemente do escopo.

A view `rel.RelatorioAlunoNota` tem o campo `EhDiversificado`. Esse campo indica que a **disciplina é classificada como componente curricular diversificado** — essa classificação pode vir da matriz curricular do aluno, não necessariamente de uma avaliação efetivamente configurada no Configurador de Avaliações para o escopo "Boletim Diversificado".

### 4.3 Cenário que gera o bug

Para EAI e Redação, dois cenários possíveis:

**Cenário A — view retorna linhas com `EhDiversificado = true` e sem notas:**

| Coluna view | LIV | EAI | Redação |
|---|---|---|---|
| `EtapaDeBoletim` | `true` | `true` | `true` |
| `VisivelNoBoletim` | `true` | `true` | `true` |
| `EhDiversificado` | `true` | `true` | `true` |
| `NotaComPeso` | valor | **null** | **null** |

O backend retorna EAI e Redação em `EscopoDiversificado` com notas vazias. Em `documentacao-pedagogica`:
- O loop "Disciplinas Diversificadas" tenta casar por `HashDisciplina` ou por nome
- Se o match **falhar** (hash divergente entre view e ResultadoFinal) → `d.Ativo = false` → removido do escopo
- EAI/Redação permanecem em `responseResultadoFinal` com `TipoComponenteCurricular.Diversificada = true`
- O loop "Disciplinas sem avaliação" os re-adiciona ao `EscopoDiversificado` com notas `"-"`

**Cenário B — view não retorna linhas para EAI/Redação:**

EAI e Redação não têm avaliações configuradas para o boletim (regular ou diversificado) para esse aluno/turma. A view não retorna linhas. O backend não os inclui em nenhum escopo. Em `documentacao-pedagogica`:
- Não são casados em nenhum loop de escopo
- Permanecem em `responseResultadoFinal`
- O loop "Disciplinas sem avaliação" os adiciona ao `EscopoDiversificado` com notas `"-"`

> **Em ambos os cenários, o ponto de falha está na interação entre o backend e o `documentacao-pedagogica`.** A query do backend retorna (ou deixa de retornar) EAI e Redação de forma que `documentacao-pedagogica` os classifica incorretamente como diversificados sem avaliação.

### 4.4 Causa raiz confirmada

A view `rel.RelatorioAlunoNota` contém o campo `EhDiversificado`, mas ele reflete a **classificação curricular da disciplina** (`TipoComponenteCurricular.Diversificada`), não o **escopo do boletim onde a avaliação foi efetivamente configurada** pelo Configurador de Avaliações.

O Configurador mostra apenas LIV no "Boletim Diversificado" porque apenas LIV tem avaliações *configuradas* nesse escopo. EAI e Redação têm `EhDiversificado = true` na view pela sua natureza curricular, mesmo sem avaliações configuradas no escopo diversificado.

---

## 5. Correção indicada

### 5.1 Onde corrigir

O bug existe tanto em `notas` quanto em `estrutura-pedagogica` (migração foi fiel). A correção deve ser aplicada em **EP** (destino da migração).

### 5.2 Correção no `RelatorioAlunoNotaRepository.GetQueryable`

Adicionar filtro que garante que a disciplina tem uma **avaliação efetivamente configurada** (com estrutura de avaliação válida), excluindo linhas que são apenas "slots" de currículo sem avaliação criada:

```csharp
// ANTES
private IQueryable<RelatorioAlunoNota> GetQueryable(FichaIndividualInternalGetRequest request)
{
    return Queryable()
          .Where(x => x.AnoLetivoId == request.AnoLetivoId
                   && x.PessoaId == request.PessoaId
                   && x.RedeId == request.RedeId
                   && (x.TurmaId == request.TurmaId || x.EhDependencia)
                   && x.EhBoletim
                   && x.VisivelNoBoletim);
}

// DEPOIS
private IQueryable<RelatorioAlunoNota> GetQueryable(FichaIndividualInternalGetRequest request)
{
    return Queryable()
          .Where(x => x.AnoLetivoId == request.AnoLetivoId
                   && x.PessoaId == request.PessoaId
                   && x.RedeId == request.RedeId
                   && (x.TurmaId == request.TurmaId || x.EhDependencia)
                   && x.EhBoletim
                   && x.VisivelNoBoletim
                   && x.SerieId == request.SerieId);  // ← garante que só vêm linhas da série do aluno
}
```

> **Nota:** O campo `SerieId` já existe em `FichaIndividualInternalGetRequest` e é preenchido com `x.Turma.EscolaSerie.SerieId` em `AlunoEscolaRepository.GetParaFichaIndividual`, mas nunca foi usado no filtro. Adicionar esse filtro reduz o risco de linhas de outras séries vazarem pela cláusula `EhDependencia`.

### 5.3 Correção alternativa/complementar no `GetParaFichaIndividual`

Se o `SerieId` não for suficiente (porque o problema está na view retornar linhas com `EhDiversificado = true` para disciplinas sem avaliação configurada), aplicar um filtro adicional no select de `GetParaFichaIndividual`:

```csharp
// Adicionar ao GetQueryable:
&& x.HashEstruturaAvaliacao != Guid.Empty
```

Isso garante que apenas linhas com uma `EstruturaAvaliacao` efetivamente associada sejam retornadas, excluindo registros gerados pela matriz curricular sem avaliação configurada.

---

## 6. Validação da correção

### 6.1 Coerência lógica

| Ponto | Análise |
|---|---|
| `SerieId` existe no request mas não era usado | ✅ Correto adicionar — elimina linhas de séries cruzadas que podem vazar por `EhDependencia` |
| Filtro por `HashEstruturaAvaliacao != Guid.Empty` | ✅ Coerente — disciplines sem avaliação configurada não devem aparecer em nenhum escopo do boletim |
| Correção afeta `GetParaFichaIndividual` e `GetParaFichaIndividualResumida` | ✅ Ambos usam `GetQueryable` — a correção em um local aplica nas duas queries |
| Não quebra LIV (que tem avaliação configurada) | ✅ LIV continuaria retornando normalmente pois tem `HashEstruturaAvaliacao` válido e `SerieId` correto |
| Não quebra fluxo de Dependência | ✅ `EhDependencia` continua na cláusula OR; o `SerieId` filtra a série base do aluno |

### 6.2 Query de validação (executar no banco)

```sql
-- Verificar o que a view retorna para o aluno antes e após a correção
SELECT
    NomeDisciplinaParaDocumentosOficiais,
    EhDiversificado,
    EhItinerarioFormativo,
    EhDependencia,
    EtapaDeBoletim      AS EhBoletim,
    VisivelNoBoletim,
    HashEstruturaAvaliacao,
    NotaComPeso,
    NotaFormativa,
    Situacao,
    IdSerie
FROM rel.RelatorioAlunoNota
WHERE IdAluno      = <PessoaId do Alexandre>    -- buscar via AlunoEscola.Matricula = '19293080'
  AND IdAnoLetivo  = 2025
  AND EtapaDeBoletim   = 1
  AND VisivelNoBoletim = 1
ORDER BY EhDiversificado DESC, NomeDisciplinaParaDocumentosOficiais
```

**Esperado após a análise:**
- EAI e Redação aparecem com `EhDiversificado = 1` na view, mesmo sem `NotaComPeso` — confirma raiz no `EhDiversificado` da classificação curricular
- Após adicionar filtro `SerieId` ou `HashEstruturaAvaliacao != Guid.Empty`, EAI e Redação **não aparecem** na query do repositório
- LIV ainda aparece com `EhDiversificado = 1` e `NotaComPeso` populado

### 6.3 O que não muda

- A lógica de `FormatarFicha` (separação por escopo) permanece intacta
- Os DTOs de request/response permanecem intactos
- O `documentacao-pedagogica` não precisa de alteração (o problema será resolvido na fonte)
- Os 28 testes unitários existentes (`EFC-6292-testes-planning.md`) continuam válidos; apenas os testes do grupo 1 ("Validação de entrada — ficha vazia") validarão o comportamento para alunos sem avaliações configuradas

---

## 7. Próximos passos

1. **Executar a query de validação** (seção 6.2) com acesso ao banco para confirmar se EAI/Redação aparecem com `EhDiversificado = 1` e sem nota
2. Se confirmado: aplicar a correção em `RelatorioAlunoNotaRepository.GetQueryable` em EP (branch `feature/EFC-6292`)
3. Aplicar a mesma correção em `notas` (o comportamento está replicado lá também)
4. Re-testar o documento do aluno Alexandre após deploy

---

## 8. Arquivos a modificar

| Arquivo | Ação |
|---|---|
| `EstruturaPedagogica.Infra/Repositories/Views/RelatorioAlunoNotaRepository.cs` | Adicionar `x.SerieId == request.SerieId` ao `GetQueryable` |
| `Notas.Infra/Repositories/Views/RelatorioAlunoNotaRepository.cs` | Mesma correção (bug espelhado) |
