# Plano Técnico — EFC-6601: Persistir configuração do Carômetro por usuário

> **Status:** Backend e frontend implementados (ver seção "Implementação — status" no fim do documento). Pendente: INSERT na tabela `Funcionalidade`.

## Estado atual (investigação)

O carômetro já existe no frontend do `estrutura-pedagogica`, gerado via `document-builder`:

- Entrada: `frontend/src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts` → `buildCarometro()` monta um `DocumentBundle` com uma entry `DocCarometroGridComponent`, alimentada pelos campos do próprio componente pai: `varianteCarometro`, `colsCarometro`, `gapCarometro`, `cardHeightCarometro`, `visibilityCarometro`.
- Painel: `frontend/src/shared/document-builder/components/doc-carometro-config-panel/doc-carometro-config-panel.component.ts` — hoje **stateless**, cada campo é um par `@Input`/`@Output` simples (sem forms reativos, sem dirty-tracking, sem persistência). Footer tem só o botão "Restaurar padrões" (`(click)="restoreDefaults.emit()"`).
- Modelos: `frontend/src/app/features/lancamento-frequencia/models.ts` — `CarometroCardVariant` ('0'..'L', só `0,B,C,E,J,K,L` habilitados hoje), `CarometroVisibility { nome, ra, responsavel, telefone, email }`, `CAROMETRO_VISIBILITY_DEFAULT`, `VARIANT_DEFAULT_HEIGHT`.
- **Nada é persistido hoje** — nem backend, nem `localStorage`. Toda vez que `openCarometroOverlay()` roda, os campos voltam a valores hardcoded (`variant:'0', cols:3, gap:10, cardHeight:undefined, visibility:defaults`).
- **Achado à parte** (não pedido, mas vale corrigir na implementação): existe uma inconsistência entre o default usado em `openCarometroOverlay()` (`cols:3`) e o usado em `onCarometroRestoreDefaults()`/painel (`cols:4`) — alinhar os dois ao implementar.

Não existe, hoje, nenhuma configuração persistida **por usuário** em `estrutura-pedagogica` — todas as entidades `*Configuracao*` existentes (`DiarioDeClasseConfiguracao`, `EstruturaAvaliacaoConfiguracao`, `ConfiguracaoTempoPadrao`, `MacroTurmaConfiguracao`) são escopadas por **Rede/Turma/EscolaSerie**, nunca por `Usuario`. O template arquitetural mais próximo a copiar é `DiarioDeClasseConfiguracao`, só trocando o escopo de `RedeId` para `UsuarioId`.

## Decisões de design

- **FormatoCard**: enum C# (`CarometroFormatoCard`) mapeado para coluna `int` — não `varchar` com o código bruto da variante, não uma tabela de domínio à parte (conjunto fechado e específico desta feature, não reaproveitado em outro lugar do schema).
- **Restaurar padrões = soft-delete** (`Ativo = false` via `StatefulEntity.RegistrarInativacao`), não delete físico — consistente com o resto do sistema, que audita bem através de `Repository<T>.Disable()`. Não existe precedente de endpoint de "restore to default" no repo — este desenho é novo.
- **Visibilidade como colunas booleanas separadas** (`ExibirNomeAluno`, `ExibirRA`, ...) — não bitmask, não JSON — é o padrão observado em `DiarioDeClasseConfiguracao.ExibirFrequencia/ExibirConteudoMinistrado/ExibirRelatorioRendimento`.
- **Usuário sempre resolvido no backend** via `IUsuarioAutenticadoRepository.IdUsuarioAutenticado` (populado pelo pipeline de autenticação a cada request) — nunca recebido do corpo da requisição do cliente.

## Backend (`estrutura-pedagogica`, .NET 8 / EF Core, sem EF Migrations — schema via script SQL manual)

### Modelo de dados

```
DocumentoCarometroConfiguracao
- Id                (PK)
- UsuarioId         (int, FK -> Usuario.Id, NOT NULL) — 1 registro ativo por usuário
- QuantidadeColunas (int, NOT NULL)
- Espacamento       (int, NOT NULL)
- AlturaCard        (int, NULL)     -- null = usa altura padrão da variante (resolvido no frontend)
- FormatoCard       (int, NOT NULL) -- enum CarometroFormatoCard, mapeando variantes '0','B','C','E','J','K','L'
- ExibirNomeAluno   (bit, NOT NULL)
- ExibirRA          (bit, NOT NULL)
- ExibirResponsavel (bit, NOT NULL)
- ExibirTelefone    (bit, NOT NULL)
- ExibirEmail       (bit, NOT NULL)
+ colunas padrão de StatefulEntity: Ativo, Hash, DataInclusao, UsuarioInclusaoId, DataUltimaAlteracao,
  UsuarioUltimaAlteracaoId, DataInativacao, UsuarioInativacaoId (todas FK para Usuario.Id, DeleteBehavior.Restrict)
```

### Arquivos a criar

| Camada | Arquivo |
|---|---|
| Script SQL (schema) | [`cards/EFC-6601/sql/create_DocumentoCarometroConfiguracao.sql`](./sql/create_DocumentoCarometroConfiguracao.sql) — já criado (`CREATE TABLE DocumentoCarometroConfiguracao`). O `INSERT` na tabela `Funcionalidade` fica para quando o controller for implementado (depende de decisões de produto: Nome, Produto, PossuiMenu etc.) |
| Entidade | `EstruturaPedagogica.Domain/Entities/Stateful/DocumentoCarometroConfiguracao.cs` (herda `StatefulEntity`) |
| Enum | `EstruturaPedagogica.Domain/Entities/Base/CarometroFormatoCard.cs` (ou junto à entidade) |
| Mapping | `EstruturaPedagogica.Infra/Mapping/Stateful/DocumentoCarometroConfiguracaoMap.cs` (`IEntityMap<T>`) — auto-descoberto via `ApplyConfigurationsFromAssembly`, sem registro manual |
| Interface repo | `EstruturaPedagogica.Domain/Interfaces/Stateful/IDocumentoCarometroConfiguracaoRepository.cs` |
| Repositório | `EstruturaPedagogica.Infra/Repositories/Stateful/DocumentoCarometroConfiguracaoRepository.cs` (herda `Repository<T>` + `GetPorUsuario(int usuarioId)`) |
| DTOs | `EstruturaPedagogica.Domain/DTO/DocumentoCarometroConfiguracao/{DocumentoCarometroConfiguracaoResponse.cs, DocumentoCarometroConfiguracaoSaveRequest.cs}` |
| Services | `EstruturaPedagogica.Domain.Services/DocumentoCarometroConfiguracao/{GetDocumentoCarometroConfiguracaoService, SaveDocumentoCarometroConfiguracaoService, RestaurarPadraoDocumentoCarometroConfiguracaoService}.cs` (+ interfaces `IBaseService`) |
| Controller | `EstruturaPedagogica.Api/Controllers/DocumentoCarometroConfiguracaoController.cs` |
| Funcionalidade | Nova constante em `EstruturaPedagogica.Domain/Entities/Base/Funcionalidade.cs` |

DI é automática por convenção (`AddImplementations` sobre `IBaseRepository`/`IBaseService` em `DependencyInjectionServicesExtensions.cs`) — nada a registrar manualmente em `Startup`.

### Endpoints

Todos sob `[RequiredAuthorization(Funcionalidade.DocumentoCarometroConfiguracao)]`, herdando `CustomController`, `[FromServices]` por método (padrão de `DiarioDeClasseController`):

- `GET api/DocumentoCarometroConfiguracao/get` — retorna a config ativa do usuário logado, ou vazio/null se não existir. Frontend, nesse caso, aplica os defaults hardcoded já existentes em `models.ts`.
- `POST api/DocumentoCarometroConfiguracao/save` — get-or-create: se não existir registro ativo para o usuário, insere; senão, atualiza campo a campo (mesmo padrão de `SaveConfiguracaoDiarioDeClasseService`).
- `POST api/DocumentoCarometroConfiguracao/restaurar-padrao` — inativa o registro do usuário (`Ativo = false`); próximo `get` retorna vazio.

## Frontend (`estrutura-pedagogica`, Angular 20)

- **Novo service** `carometro-configuracao.service.ts` com `get()/save()/restaurarPadrao()` batendo nos 3 endpoints acima.
- **`lista-presenca.component.ts`**:
  - Antes de `openCarometroOverlay()` aplicar defaults hardcoded, buscar a config persistida do usuário; se existir, seedar `varianteCarometro/colsCarometro/gapCarometro/cardHeightCarometro/visibilityCarometro`; guardar como baseline `savedCarometroConfig` para comparação de dirty.
  - `isCarometroConfigDirty()`: compara os 5 campos atuais contra `savedCarometroConfig`.
  - `onCarometroSave()`: chama `save()`; em sucesso, atualiza `savedCarometroConfig` (limpa dirty).
  - `onCarometroRestoreDefaults()`: chama `restaurarPadrao()` no backend antes de aplicar defaults localmente; atualiza `savedCarometroConfig` para os defaults (fica não-dirty).
  - Corrigir a inconsistência `cols:3` (abertura) vs `cols:4` (restore/painel) — alinhar para um único valor.
- **`doc-carometro-config-panel.component.ts/html`**:
  - `@Input() dirty = false`; `@Output() save = new EventEmitter<void>()`.
  - Footer: botão "Salvar" à direita de "Restaurar padrões", `[disabled]="!dirty"`.
  - Corpo do painel (após a seção "Tipo de card", antes do footer): `<app-card-message icon="info" iconClass="material-icons-outlined">As configurações deste painel são salvas para o seu usuário.</app-card-message>` — `app-card-message` (`shared/components/card-message/`) é o componente existente mais próximo de um "alerta"; não há `app-alert` genérico no catálogo de shared components.
- **`lista-presenca.component.html`**: adicionar `[dirty]="isCarometroConfigDirty()"` e `(save)="onCarometroSave()"` na tag `<app-doc-carometro-config-panel>`.

## Verificação (na implementação futura)

- Rodar backend (`dotnet run --project backend/EstruturaPedagogica.Api`) + frontend (`ng serve`); abrir lançamento de frequência → gerar carômetro → alterar colunas/visibilidade → confirmar que "Salvar" habilita → salvar → recarregar a tela → confirmar que a config volta a aplicar automaticamente.
- Testar "Restaurar padrões" → confirmar reflexo na tela e após reload.
- Confirmar isolamento entre usuários diferentes (configs não vazam entre contas).

---

## Implementação — status

### Backend: implementado

Todos os arquivos abaixo foram criados em `c:/projects/estrutura-pedagogica` seguindo exatamente o padrão de `DiarioDeClasseConfiguracao` (verificado arquivo a arquivo, incluindo consulta ao schema real via MCP SQL Server para confirmar tipos/constraints):

- `backend/EstruturaPedagogica.Domain/Enums/CarometroFormatoCardEnum.cs` — enum `Padrao=0, A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=10, K=11, L=12` (espelha `CarometroCardVariant` do frontend).
- `backend/EstruturaPedagogica.Domain/Entities/Stateful/DocumentoCarometroConfiguracao.cs`
- `backend/EstruturaPedagogica.Infra/Mapping/Stateful/DocumentoCarometroConfiguracaoMap.cs`
- `backend/EstruturaPedagogica.Domain/Interfaces/Stateful/IDocumentoCarometroConfiguracaoRepository.cs`
- `backend/EstruturaPedagogica.Infra/Repositories/Stateful/DocumentoCarometroConfiguracaoRepository.cs`
- `backend/EstruturaPedagogica.Domain/DTO/DocumentoCarometroConfiguracao/{DocumentoCarometroConfiguracaoResponse.cs, DocumentoCarometroConfiguracaoSaveRequest.cs}`
- `backend/EstruturaPedagogica.Domain.Services/DocumentoCarometroConfiguracao/{Get,Save,RestaurarPadrao}DocumentoCarometroConfiguracaoService.cs` + `Interfaces/`
- `backend/EstruturaPedagogica.Api/Controllers/DocumentoCarometroConfiguracaoController.cs` (`GET get`, `POST save`, `POST restaurar-padrao`)
- `backend/EstruturaPedagogica.Domain/Entities/Base/Funcionalidade.cs` — adicionada a constante `DocumentoCarometroConfiguracao = 1031` (ID livre confirmado via `SELECT MAX(Id) FROM Funcionalidade` no schema real — próximo ao maior ID já usado, 1030).

Build da solução (`dotnet build EstruturaPedagogica.sln`) passou com **0 erros**. DI é automática por convenção (`AddImplementations`), nada foi registrado manualmente.

**Cobertura de testes (integração, `EstruturaPedagogica.Test`):** implementada seguindo `backend/EstruturaPedagogica.Test/Docs/Padrão para testes de Integração.md`, via skill `criar-testes`.

- `Integration/Fixtures/Entities/DocumentoCarometroConfiguracaoFixture.cs` (nova fixture)
- `Integration/Scenarios/DocumentoCarometroConfiguracao/GetDocumentoCarometroConfiguracaoServiceTests.cs` — 4 testes (sem config salva, com config salva, isolamento entre usuários, ignora registro inativo)
- `Integration/Scenarios/DocumentoCarometroConfiguracao/SaveDocumentoCarometroConfiguracaoServiceTests.cs` — 3 testes (cria quando não existe, atualiza quando existe, cria novo registro em vez de reativar um inativo)
- `Integration/Scenarios/DocumentoCarometroConfiguracao/RestaurarPadraoDocumentoCarometroConfiguracaoServiceTests.cs` — 3 testes (no-op sem config, inativa registro existente, isolamento entre usuários)

`dotnet build` + `dotnet test --filter "FullyQualifiedName~DocumentoCarometroConfiguracao"` → **10/10 testes passando**.

**Pendências do backend:**
- **INSERT na tabela `Funcionalidade`** (necessário para o `[RequiredAuthorization]` autorizar de fato) — não foi feito, pois depende de decisões de produto (`Nome`, `Produto`, `PossuiMenu`, `ConfiguravelPorRede/Escola`, etc. — ver colunas da tabela). Sem esse INSERT, os endpoints existem mas retornam "sem acesso" para qualquer usuário.

### Frontend: implementado

- `frontend/src/app/features/lancamento-frequencia/models.ts` — novas interfaces `DocumentoCarometroConfiguracaoResponse`/`SaveRequest` + helpers `carometroVariantToFormatoCard`/`carometroFormatoCardToVariant` (mapeiam `CarometroCardVariant` ↔ o enum `int` do backend).
- `frontend/src/app/features/lancamento-frequencia/services/carometro-configuracao.service.ts` (novo) — `get()`/`save()`/`restaurarPadrao()` via `ApiClient`/`HandleApiError`, mesmo padrão de `LancamentoFrequenciaService`.
- `frontend/src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts`:
  - `gerarCarometro()` agora busca a config persistida (`carregarConfiguracaoCarometro()`) antes de abrir o overlay; se falhar ou não existir, usa `CAROMETRO_DEFAULT_SNAPSHOT` (cols:4, gap:10, variant:'0', visibility padrão — unificado, corrigida a inconsistência cols:3 vs cols:4 que existia antes).
  - `savedCarometroConfig` guarda a baseline (config carregada, ou `null` se nada persistido) para comparação de dirty.
  - `isCarometroConfigDirty()` compara os 5 campos ao vivo contra a baseline.
  - `onCarometroSave()` chama `save()` e atualiza a baseline em caso de sucesso.
  - `onCarometroRestoreDefaults()` agora chama `restaurarPadrao()` no backend antes de resetar os campos locais e a baseline (`savedCarometroConfig = null`).
- `frontend/src/shared/document-builder/components/doc-carometro-config-panel/doc-carometro-config-panel.component.ts` — `@Input() dirty` + `@Output() save`.
- `.html` — botão "Salvar" no footer (`[disabled]="!dirty"`) ao lado de "Restaurar padrões"; `<app-card-message icon="info" title="Configuração por usuário">` no final do body avisando que a config é salva por usuário.
- `.scss` — `.panel-foot` virou `display:flex` (dois botões lado a lado), `.cp-btn:disabled` com opacidade reduzida, `.sec-aviso` para o espaçamento do aviso.
- `frontend/src/shared/document-builder/document-builder.module.ts` — passou a importar `SharedModule` (necessário para `app-card-message` resolver dentro do painel, que só tinha `CommonModule`).
- `frontend/.../lista-presenca.component.html` — `<app-doc-carometro-config-panel>` agora recebe `[dirty]="isCarometroConfigDirty()"` e emite `(save)="onCarometroSave()"`.

Build/lint do frontend não foi executado nesta etapa (preferência registrada do usuário: valida rodando `ng serve` por conta própria) — revisão feita estaticamente (imports, tipos, convenções).
