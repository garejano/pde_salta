# Plano Técnico — EFC-6417

## Atividade

- **Chave:** EFC-6417
- **Título:** [Backend] Endpoints lista-presenca/get-turmas e lista-presenca/get-alunos
- **Tipo:** Sub-task
- **Status:** Aberta

## Critérios de Aceite

Consulte `Docs/criterios-aceite-EFC-6417.md`

## Fases

### Fase 1 — DTOs de Contrato _(infraestrutura)_

**Status:** concluída

Criar em `EstruturaPedagogica.Domain/DTO/LancamentoFrequencia/`:

1. `ListaPresencaFilterRequest.cs` — request do `get-turmas`:
   - `HashRede` (Guid)
   - `HashEscola` (Guid)
   - `HashSeries` (List<Guid>)
   - `HashTurmas` (List<Guid>)
   - `[JsonIgnore] EscolasDoUsuario` (List<int>) — preenchido internamente pelo ValidacaoService
   - `[JsonIgnore] PossuiVisaoCoordenacao` (bool) — preenchido internamente pelo ValidacaoService

2. `ListaPresencaDocumentoRequest.cs` — request do `get-alunos`:
   - `HashTurmas` (List<Guid>)
   - `[JsonIgnore] EscolasDoUsuario` (List<int>)
   - `[JsonIgnore] PossuiVisaoCoordenacao` (bool)

3. `ListaPresencaTurmaItem.cs` — DTO interno entre repositório e serviço:
   - `Id` (int) — necessário para a busca de alunos por turmaId
   - `Hash` (Guid)
   - `Nome` (string)
   - `SerieHash` (Guid)
   - `SerieNome` (string)
   - `EscolaHash` (Guid)
   - `EscolaNome` (string)
   - `TurnoId` (int)
   - `TurnoNome` (string)
   - `TotalAlunos` (int)

4. `ListaPresencaTurmaResponse.cs` — DTO público de turma:
   - `HashTurma` (Guid)
   - `NomeTurma` (string)
   - `HashSerie` (Guid)
   - `NomeSerie` (string)
   - `NomeTurno` (string)
   - `TotalAlunos` (int)
   - `HashEscola` (Guid)
   - `NomeEscola` (string)
   - `EhManha` (bool)
   - `EhTarde` (bool)
   - `EhNoite` (bool)
   - `EhIntegral` (bool)

5. `ListaPresencaGetResponse.cs` — response do `get-turmas`:
   - `PossuiVisaoCoordenacao` (bool)
   - `Turmas` (List<ListaPresencaTurmaResponse>)

6. `ListaPresencaAlunoResponse.cs`:
   - `HashPessoa` (Guid)
   - `NomePessoa` (string)
   - `Matricula` (string)
   - `NumeroOrdem` (int)

7. `ListaPresencaDocumentoTurmaData.cs`:
   - `Turma` (ListaPresencaTurmaResponse)
   - `Alunos` (List<ListaPresencaAlunoResponse>)

Todos com `[ExcludeFromCodeCoverage]` seguindo o padrão existente.

---

### Fase 2 — Repositório: Turmas para Lista de Presença _(CA-01, CA-02, CA-03)_

**Status:** concluída

**Alterar** `EstruturaPedagogica.Domain/Interfaces/Filters/IFilterLancamentoFrequenciaRepository.cs`:
- Adicionar: `Task<List<ListaPresencaTurmaItem>> GetTurmasParaListaPresenca(ListaPresencaFilterRequest request);`

**Alterar** `EstruturaPedagogica.Infra/Repositories/Filters/FilterLancamentoFrequenciaRepository.cs`:
- Implementar `GetTurmasParaListaPresenca(ListaPresencaFilterRequest request)`:
  1. Parte de `QueryableAtivos()` filtrando por `EscolasDoUsuario`, `HashEscola` (obrigatório), `HashSeries[]` (opcional), `HashTurmas[]` (opcional)
  2. Se `!request.PossuiVisaoCoordenacao`, aplica `FiltrarPorAlocacao()` — reutilizando o método privado existente (CA-07)
  3. Projeta em `ListaPresencaTurmaItem` incluindo `TurnoId`, `TurnoNome` (via `Turma.Turno.Nome`), `EscolaNome` e `EscolaHash` (via `Turma.EscolaSerie.Escola`), e `TotalAlunos` como subquery correlacionada contando `AlunoEscola` sem `DataCancelamento`
  4. Ordena por `Serie.Ordem`, `Turma.Nome`

---

### Fase 3 — Domain.Services: GetTurmasListaPresencaService _(CA-01, CA-02, CA-03)_

**Status:** concluída

**Alterar** `EstruturaPedagogica.Domain.Services/LancamentoFrequencia/Interfaces/IValidacaoService.cs`:
- Adicionar overload: `Task ValidarRequestListaPresenca(ListaPresencaFilterRequest request);`

**Alterar** `EstruturaPedagogica.Domain.Services/LancamentoFrequencia/ValidacaoService.cs`:
- Implementar `ValidarRequestListaPresenca`: reutiliza `GetEscolasDoUsuario` e verificação de `PossuiVisaoCoordenacao` sem exigir o campo `Data`

**Criar** `EstruturaPedagogica.Domain.Services/LancamentoFrequencia/Interfaces/IGetTurmasListaPresencaService.cs`:
- `Task<ServiceResult<ListaPresencaGetResponse>> Get(ListaPresencaFilterRequest request);`

**Criar** `EstruturaPedagogica.Domain.Services/LancamentoFrequencia/GetTurmasListaPresencaService.cs`:
- Primary constructor, injeta `IValidacaoService` e `IFilterLancamentoFrequenciaRepository`
- Lógica do `Get`:
  1. Validar `request != null`
  2. Chamar `ValidarRequestListaPresenca(request)` para preencher `EscolasDoUsuario` e `PossuiVisaoCoordenacao`
  3. Chamar `GetTurmasParaListaPresenca(request)` no repositório
  4. Mapear `List<ListaPresencaTurmaItem>` para `ListaPresencaGetResponse`, derivando `EhManha/Tarde/Noite/Integral` por comparação com `TurnoEnum`
  5. Retornar `ServiceResult<ListaPresencaGetResponse>`

---

### Fase 4 — Domain.Services: GetAlunosListaPresencaService _(CA-04, CA-05, CA-06)_

**Status:** concluída

**Alterar** `EstruturaPedagogica.Domain/Interfaces/Base/IAlunoEscolaRepository.cs`:
- Adicionar: `Task<List<AlunoTurmaComDadosInternalResponse>> GetAlunosPorTurmaAtivos(List<int> turmaIds);`

**Alterar** `EstruturaPedagogica.Infra/Repositories/Base/AlunoEscolaRepository.cs`:
- Implementar `GetAlunosPorTurmaAtivos`: filtra `turmaIds.Contains(x.TurmaId) && x.DataCancelamento == null`, projeta em `AlunoTurmaComDadosInternalResponse`, ordena por `NomePessoa`

**Criar** `EstruturaPedagogica.Domain.Services/LancamentoFrequencia/Interfaces/IGetAlunosListaPresencaService.cs`:
- `Task<ServiceResult<List<ListaPresencaDocumentoTurmaData>>> Get(ListaPresencaDocumentoRequest request);`

**Criar** `EstruturaPedagogica.Domain.Services/LancamentoFrequencia/GetAlunosListaPresencaService.cs`:
- Primary constructor, injeta `IValidacaoService`, `IFilterLancamentoFrequenciaRepository`, `IAlunoEscolaRepository`
- Lógica do `Get`:
  1. Validar `request != null` e `request.HashTurmas` não vazio
  2. Verificar turmas autorizadas via repositório com `FiltrarPorAlocacao` (CA-05)
  3. Buscar alunos com `GetAlunosPorTurmaAtivos` para as turmas autorizadas
  4. Atribuir `NumeroOrdem` sequencial (1, 2, 3...) por turma, ordenado por nome
  5. Agrupar em `List<ListaPresencaDocumentoTurmaData>`

---

### Fase 5 — Controller: Novos Endpoints _(CA-01, CA-04)_

**Status:** concluída

**Alterar** `EstruturaPedagogica.Api/Controllers/LancamentoFrequenciaController.cs`:
- Adicionar endpoint `get-turmas`:
  ```csharp
  [HttpPost("lista-presenca/get-turmas")]
  public async Task<IActionResult> GetTurmasListaPresenca(
    [FromServices] IGetTurmasListaPresencaService service,
    [FromBody] ListaPresencaFilterRequest request)
  {
    return Result(await service.Get(request));
  }
  ```
- Adicionar endpoint `get-alunos`:
  ```csharp
  [HttpPost("lista-presenca/get-alunos")]
  public async Task<IActionResult> GetAlunosListaPresenca(
    [FromServices] IGetAlunosListaPresencaService service,
    [FromBody] ListaPresencaDocumentoRequest request)
  {
    return Result(await service.Get(request));
  }
  ```
- Sem `[RequiredAuthorization]` adicional — autorização de classe já cobre (CA-07)
- Registrar os dois novos serviços no DI container (ServiceCollection)

---

### Fase 6 — Frontend: Desativar Mock _(infraestrutura)_

**Status:** concluída

**Alterar** `src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts`:
- Mudar `readonly useMock = true` para `readonly useMock = false`
- Nenhuma outra alteração necessária — service Angular e types já estão prontos

---

### Fase 7 — Testes de Integração _(CA-01 a CA-06)_

**Status:** concluída

Seguir o padrão de `GetAlunosAusentesServiceTests`: mock de `IValidacaoService`, uso de fixtures de entidades, `BaseTest` + `AddInMemoryDbContext()`.

**Criar** `EstruturaPedagogica.Test/Integration/Scenarios/LancamentoFrequencia/GetTurmasListaPresencaServiceTests.cs`:
- `Get_RequestNulo_RetornaErro`
- `Get_SemAcesso_RetornaErro`
- `Get_ProfessorSemAlocacao_RetornaListaVazia` (CA-02)
- `Get_ProfessorComAlocacao_RetornaApenasTurmasAlocadas` (CA-02)
- `Get_VisaoCoordenacao_RetornaTodasAsTurmas` (CA-02)
- `Get_PossuiVisaoCoordenacao_CampoTrue` (CA-03)
- `Get_SemVisaoCoordenacao_CampoFalse` (CA-03)

**Criar** `EstruturaPedagogica.Test/Integration/Scenarios/LancamentoFrequencia/GetAlunosListaPresencaServiceTests.cs`:
- `Get_RequestNulo_RetornaErro`
- `Get_HashTurmasVazio_RetornaListaVazia`
- `Get_TurmasSemPermissao_NaoRetornaTurmasFiltradas` (CA-05)
- `Get_AlunosCancelados_NaoSaoIncluidos` (CA-06)
- `Get_AlunosOrdenadosPorNome_NumeroOrdemSequencial` (CA-06)
- `Get_TurmasAutorizadas_RetornaAgrupamentoPorTurma` (CA-04)
