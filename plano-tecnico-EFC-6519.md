# Plano Técnico — EFC-6519

## Atividade

- **Chave:** EFC-6519
- **Título:** Cadastro de Tipo de Avaliação
- **Tipo:** Story
- **Status:** Backlog

## Critérios de Aceite

Consulte `Docs/criterios-aceite-EFC-6519.md`

## Contexto do Repositório

**Já existe:**
- `backend/EstruturaPedagogica.Domain/Entities/Stateful/TipoAvaliacao.cs` — entidade completa (RedeId, AnoLetivoId, Nome, Sigla, EhBolsao, Opcional, Media, Total, Situacao, BonusEtapa, BonusAnual, DescontoEtapa, DescontoAnual, FaltaEtapa, EstruturaAvaliacoes, Avaliacoes). Nenhum campo novo é necessário.
- `backend/EstruturaPedagogica.Infra/Repositories/Stateful/TipoAvaliacaoRepository.cs` e `ITipoAvaliacaoRepository.cs` — mínimos, apenas `IRepositoryInsert/Update/Disable/Get/GetByHash<TipoAvaliacao>` genéricos.
- `backend/EstruturaPedagogica.Test/Integration/Fixtures/Entities/TipoAvaliacaoFixture.cs` — já cobre todos os campos necessários.
- `backend/EstruturaPedagogica.Domain/Entities/Stateful/EstruturaAvaliacao.cs` — tem `TipoAvaliacaoId`, `AgrupamentoId`, `EstruturaAvaliacaoEscopoId`.
- `Agrupamento.cs` e `EstruturaAvaliacaoEscopo.cs` — ambos têm `Nome`.
- `StringExtensions.HigienizarTexto` confirmado como método de sanitização (remove quebras/tabs, normaliza espaços múltiplos, remove caracteres de controle, trim).
- `Funcionalidade.cs` — **não tem** `ConfiguradorAvaliacoes`; precisa adicionar `public const int ConfiguradorAvaliacoes = 250;`.
- `IUsuarioAcessoRepository.GetRedeIdByFuncionalidadeUsuarioAutenticado(int funcionalidade)` — usado no padrão de `ConfiguradorDisciplinas.ValidacaoService`.
- Precedente exato para a regra de Ano Letivo (CA-01): `FilterConfiguradorFrentesRepository.cs` linhas 17-18 (`anoMinimo = DateTime.Today.Month <= 3 ? anoAtual - 1 : anoAtual`).
- Precedente para "Continuar cadastrando" (CA-03/CA-04): `frontend/src/app/features/itinerario-formativo/editar-itinerario/editar-itinerario.component.ts` — modal único criar/editar com flag `edicao`, campo `continuarCadastrando`, `manterFormularioAberto()`/`close()` após salvar. **Não** o par incluir/editar do Configurador de Disciplinas.
- Padrão de ícones "Em Uso"/"Opcional" e badge: `listar-configurador-disciplinas.component.html`.
- Padrão de busca textual + paginação client-side: `frontend/src/app/features/dia-letivo-extra/listar/listar.component.ts`.
- Diretiva de tooltip: `frontend/src/shared/components/tooltip/tooltip.directive.ts`.
- Roteamento: `app-routing.module.ts` (`loadChildren`) + `pathing.service.ts` (bloco `ConfiguradorDisciplinas: { Base, Listar }` como modelo).
- Nenhuma pasta/rota/controller/DTO de `cadastro-tipos-avaliacao` existe ainda — feature 100% nova.

## Fases

### Fase 1 — Fundação de domínio: Funcionalidade, enum de filtro e DTOs _(infraestrutura)_

**Status:** concluída

- `backend/EstruturaPedagogica.Domain/Entities/Base/Funcionalidade.cs`: adicionar `public const int ConfiguradorAvaliacoes = 250;` na região `#region Enum`.
- `Domain/Enums/CadastroTiposAvaliacao/FilterCadastroTiposAvaliacaoEnum.cs`:
  ```csharp
  public enum FilterCadastroTiposAvaliacaoEnum { FilterAnoLetivo = 1, FilterRede = 2, GetLista = 3 }
  ```
- `Domain/DTO/CadastroTiposAvaliacao/CadastroTiposAvaliacaoFilterRequest.cs`: `Guid HashAnoLetivo`, `Guid? HashRede`, `bool? EmUso`.
- `Domain/DTO/CadastroTiposAvaliacao/CadastroTiposAvaliacaoResponse.cs`: `Hash`, `Sigla`, `Nome`, `Opcional`, `EmUso` (bool via `EstruturaAvaliacoes.Count > 0`), campo `BonusOuDesconto` (string já resolvida: "Bônus anual"/"Bônus de etapa"/"Desconto anual"/"Desconto de etapa"/vazio), `EhAutomatico` (bool via `Media||Total||Situacao||FaltaEtapa`).
- `Domain/DTO/CadastroTiposAvaliacao/CadastroTiposAvaliacaoSaveRequest.cs`: `Guid? Hash` (null = criação), `Guid HashAnoLetivo`, `Guid HashRede`, `string Nome`, `string Sigla`, `bool Opcional`, `bool BonusEtapa`, `bool BonusAnual`, `bool DescontoEtapa`, `bool DescontoAnual`.
- `Domain/DTO/CadastroTiposAvaliacao/CadastroTiposAvaliacaoDisableRequest.cs`: `Guid Hash`.
- `Domain/DTO/CadastroTiposAvaliacao/CadastroTiposAvaliacaoUsoResponse.cs`: `string NomeAgrupamento`, `string NomeEscopo`.
- `Domain/DTO/CadastroTiposAvaliacao/CadastroTiposAvaliacaoExport.cs`: `Sigla`, `Nome`, `EmUso` (string "Sim"/"Não"), `Opcional` (string "Sim"/"Não"), `BonusOuDesconto` (string), com `[ExcludeFromCodeCoverage]`.

---

### Fase 2 — Filtro (Ano Letivo → Rede) _(CA-01; segue padrão `criar-filtro`)_

**Status:** concluída

- `Domain/Interfaces/Filters/IFilterCadastroTiposAvaliacaoRepository.cs`: `GetAnosLetivos(List<int> redesDoUsuario)`, `GetRedes(CadastroTiposAvaliacaoFilterRequest request, List<int> redesDoUsuario)`.
- `Infra/Repositories/Filters/FilterCadastroTiposAvaliacaoRepository.cs` : `Repository<TipoAvaliacao>`. `GetQueryable` privado reaproveita a regra de corte de mês de `FilterConfiguradorFrentesRepository` e filtra por `redesDoUsuario`/`AnoLetivoId >= anoMinimo`, aplicando os passos do enum incrementalmente (mesmo padrão de `FilterConfiguradorDisciplinasRepository`).
- `Domain.Services/CadastroTiposAvaliacao/Interfaces/IValidacaoService.cs` + `ValidacaoService.cs` (ler `.claude/commands/criar-service.md` antes de implementar): `ValidarRequest(request, passo)`, dependência `IUsuarioAcessoRepository`, obtém redes via `GetRedeIdByFuncionalidadeUsuarioAutenticado(Funcionalidade.ConfiguradorAvaliacoes)`.
- `Domain.Services/CadastroTiposAvaliacao/Interfaces/IFilterService.cs` + `FilterService.cs`: `Filter(request, passo)` delega por `switch`, aplica `DefaultMessages.FiltroVazio`.
- `Api/Controllers/CadastroTiposAvaliacaoController.cs` (novo): `[RequiredAuthorization(Funcionalidade.ConfiguradorAvaliacoes)]`, endpoints `filter-anoletivo` (GET) e `filter-rede` (POST).
- Frontend: `features/cadastro-tipos-avaliacao/listar/filtro-cadastro-tipos-avaliacao.ts` (Ano Letivo `required`+`selectFirst`, Rede `required` com `dependency_list: [FilterType.AnoLetivo]`, campo "Em Uso" opcional estático Sim/Não sem serviço); `features/cadastro-tipos-avaliacao/services/cadastro-tipos-avaliacao.service.ts` com `filterAnosLetivos()`/`filterRedes()`.

---

### Fase 3 — Listagem _(CA-02)_

**Status:** concluída

- Estender `IFilterCadastroTiposAvaliacaoRepository`/`FilterCadastroTiposAvaliacaoRepository` com `GetLista(request, redesDoUsuario)`: reaproveita `GetQueryable(..., GetLista)`, filtra `!x.EhBolsao`, aplica `x.EstruturaAvaliacoes.Count > 0 == request.EmUso` quando informado, projeta `CadastroTiposAvaliacaoResponse` (sempre `Count > 0`, nunca `Any()`).
- `Domain.Services/CadastroTiposAvaliacao/Interfaces/IGetTiposAvaliacaoService.cs` + `GetTiposAvaliacaoService.cs` (ler `criar-service.md`): `GetLista(request)` valida via `IValidacaoService` e chama o repositório de filtro.
- Controller: endpoint `get-lista` (POST).
- Frontend: `listar/listar-cadastro-tipos-avaliacao.component.ts/.html/.scss` — colunas Sigla/Nome/Em Uso/Opcional/Bônus ou Desconto/Ação; ícones de check (padrão Configurador de Disciplinas); badge para Bônus/Desconto; `[disabled]`+`[tooltip]` em editar/remover quando `EhAutomatico`; busca textual + paginação client-side seguindo `dia-letivo-extra/listar/listar.component.ts`.

---

### Fase 4 — Criação e edição _(CA-03, CA-04)_

**Status:** concluída

- `ITipoAvaliacaoRepository`/`TipoAvaliacaoRepository`: adicionar `ExisteNomeOuSiglaDuplicado(redeId, anoLetivoId, nome, sigla, idParaIgnorar)` — compara contra todos os tipos ativos do rede+ano, incluindo automáticos.
- `Domain.Services/CadastroTiposAvaliacao/Interfaces/ISaveService.cs` + `SaveService.cs` (ler `criar-service.md`), dependências `ITipoAvaliacaoRepository`, `IValidacaoService`:
  - Sanitiza `Nome`/`Sigla` com `.HigienizarTexto()`, checa `ExisteNomeOuSiglaDuplicado`.
  - `SaveNew`: resolve `RedeId`/`AnoLetivoId` pelos hashes, monta nova `TipoAvaliacao` (flags automáticas `false`) e `Insert`.
  - `Update`: carrega via `GetByHash`, verifica duplicidade excluindo o próprio Id, aplica alterações e chama `Update(entity)` diretamente — sem inativar/recriar.
- Controller: endpoints `savenew` e `update` (POST), via `IUnitOfWork.Execute`.
- Frontend: modal único `cadastro-tipo-avaliacao-modal.component.ts/.html/.scss` (side-panel), seguindo `editar-itinerario.component.ts`: flag `edicao`, campo `continuarCadastrando`, `shouldUpdate()` para desabilitar Salvar sem alteração, `save()` decide `manterFormularioAberto()`/`close()`.

---

### Fase 5 — Remoção _(CA-05)_

**Status:** concluída

- `Domain.Services/CadastroTiposAvaliacao/Interfaces/IDisableService.cs` + `DisableService.cs` (ler `criar-service.md`): valida hash, carrega entidade, verifica `EstruturaAvaliacoes.Count > 0` → erro; caso contrário `Disable(entity)`.
- Controller: endpoint `disable` (POST).
- Frontend: componente de confirmação (mirror de `remover-disciplina.component.ts/.html`), botão de remoção desabilitado com `[tooltip]` quando em uso; confirmação antes de remover quando não em uso.

---

### Fase 6 — Consulta de usos _(CA-06)_

**Status:** concluída

- `IEstruturaAvaliacaoRepository`/`EstruturaAvaliacaoRepository`: `GetUsosPorTipoAvaliacao(tipoAvaliacaoId)` projetando `Agrupamento.Nome`/`EstruturaAvaliacaoEscopo.Nome` das `EstruturaAvaliacao` ativas vinculadas.
- Adicionar `GetUsos(hashTipoAvaliacao)` em `IGetTiposAvaliacaoService`/`GetTiposAvaliacaoService`.
- Controller: endpoint `get-usos`.
- Frontend: modal simples listando tags/badges (`Agrupamento.Nome` + `EstruturaAvaliacaoEscopo.Nome`), aberto ao clicar no indicador "Em Uso".

---

### Fase 7 — Exportação _(CA-07; segue padrão `criar-exportacao`)_

**Status:** concluída

- Adicionar `GetParaExport(request, redesDoUsuario)` em `IFilterCadastroTiposAvaliacaoRepository`/`FilterCadastroTiposAvaliacaoRepository` (reaproveita `GetQueryable`, mesmo filtro de `EmUso` e exclusão de Bolsão).
- `Domain.Services/CadastroTiposAvaliacao/Interfaces/IExportarCadastroTiposAvaliacaoService.cs` + `ExportarCadastroTiposAvaliacaoService.cs` (ler `criar-exportacao.md`): reaproveita `IValidacaoService`, usa `IUsuarioAcessoRepository`+`IExportExcelService`, monta `DataTable` com colunas Sigla/Nome/Em Uso/Opcional/Bônus ou Desconto, `ToExcel(dataTable, "Tipos de Avaliação", 5)`.
- Controller: endpoint `export` (POST), retorno `.xlsx`.
- Frontend: método `export()` no service (`getFilterBlob`) e botão "Exportar planilha" na listagem, `[disabled]` sem filtro aplicado.

---

### Fase 8 — Registro de rotas e navegação _(infraestrutura)_

**Status:** concluída

- `features/cadastro-tipos-avaliacao/cadastro-tipos-avaliacao.routes.ts` com rota `listar`.
- Registrar `loadChildren` em `app-routing.module.ts`.
- Adicionar bloco `CadastroTiposAvaliacao: { Base: 'cadastro-tipos-avaliacao', Listar: 'listar' }` em `pathing.service.ts`.

---

### Fase 9 — Testes de integração _(última fase; segue `criar-testes.md`)_

**Status:** concluída

- `Test/Integration/Scenarios/CadastroTiposAvaliacao/FilterServiceTests.cs` — validação (falha, filtro vazio) e sucesso por passo (Ano Letivo, Rede).
- `Test/Integration/Scenarios/CadastroTiposAvaliacao/GetTiposAvaliacaoServiceTests.cs` — `GetLista` (com/sem `EmUso`, exclusão de Bolsão, `EhAutomatico=true`) e `GetUsos` (com/sem uso).
- `Test/Integration/Scenarios/CadastroTiposAvaliacao/SaveServiceTests.cs` — criação, edição sem alteração (bloqueada), duplicidade de Nome/Sigla (incluindo automáticos), sanitização via `HigienizarTexto`.
- `Test/Integration/Scenarios/CadastroTiposAvaliacao/DisableServiceTests.cs` — remoção bem-sucedida vs. bloqueada por uso.
- `Test/Integration/Scenarios/CadastroTiposAvaliacao/ExportarServiceTests.cs` — request nulo, campo obrigatório vazio, sem acesso, sucesso.
- `TipoAvaliacaoFixture.cs` já suporta os campos necessários — sem alteração.
- Executar `dotnet build backend/EstruturaPedagogica.Test && dotnet test ... --filter "FullyQualifiedName~CadastroTiposAvaliacao"` até tudo passar.
