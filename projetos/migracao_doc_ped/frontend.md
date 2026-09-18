# Frontend — plano de migração

> Ver [`readme.md`](readme.md) para contexto geral, achados e estratégia. Este documento cobre
> só a parte de frontend: mapeamento de rotas, convenções do destino e estratégia de mock.

## Princípio geral: mock primeiro

Toda a feature (as 3 áreas dos cards ativos) deve ser modelada **com dados mockados** antes de existir
qualquer integração com backend novo. Isso já é o padrão usado em
`features/ficha-individual/mocks/` — seguir o mesmo formato: um arquivo `mocks/<feature>.mock.ts`
por feature, com dados realistas (não `any` vazio), e o service real já com a assinatura final,
retornando `of(MOCK_X)` no lugar da chamada HTTP, com o comentário:

```ts
// Método real — dados mockados enquanto integração com documentacao-pedagogica não é feita
```

Isso permite trocar por `HttpClient` depois sem tocar em componente/template.

## Convenções do destino (`estrutura-pedagogica/frontend`)

- Angular 20, **standalone components** (não usar módulo `NgModule` para features novas — ver
  `ficha-individual.component.ts` como referência de import direto).
- Uma pasta por feature em `src/app/features/<nome-kebab-case>/`, com `models/`, `services/`,
  `mocks/` quando aplicável.
- HTML sempre com shared/dynamic components — nunca `<button>`, `<input>`, `<select>` crus.
  Catálogo: `refat_components_estrutura_pedagogica.md` (raiz do `pde_salta`).
- Filtros de tela usam `FilterConfig` + `<app-filtro>` (`shared/filtro/`) — não recriar filtro
  próprio (o doc-ped tem `FiltroComponent`/`Filtro` service próprios; no destino, usar o padrão
  já existente).
- Geração/impressão de documento usa **sempre** `shared/document-builder/` — nunca portar
  `PageControlService`/`PrintService`/`gerador-documentos` do doc-ped. Ver `diario-de-classe` e
  `ficha-individual` como referências de uso real do `document-builder`.

## Mapeamento de rotas — origem → destino

### `documentacao-pedagogica/frontend` (14 rotas)

| Rota de origem | Componente de origem | Card de destino |
|---|---|---|
| `Configuracao.Listar` | `ConfiguracaoComponent` (hub) | 1 |
| `Configuracao.Rede` | `ConfiguracaoRedeComponent` (+ abas Geral/Ata/Certificado/Ficha/Histórico/Livro) | 1 |
| `Configuracao.Escola` | `ConfiguracaoEscolaComponent` | 1 |
| `Configuracao.FundamentacaoLegal` | `ConfiguracaoFundamentacaoLegalComponent` | 1 |
| `Historico.Alunos` | `AlunosComponent` (busca/lista) | 2 |
| `Historico.EditarInformacoes` | `EditarAlunoComponent` (hub) → `EditarInformacoesComponent` | 2 |
| `Historico.Fundamentacoes` | `EditarFundamentacaoAlunoComponent` | 2 |
| `Historico.Series` | `HistoricoSerieComponent` | 2 |
| `Historico.Observacoes` | `HistoricoObservacoesComponent` | 2 |
| `Historico.RegistroCertificado` | `EditarRegistroCertificadoComponent` | 2 |
| `Turma.Listar` | `TurmaComponent` | 3 |
| *(sem rota própria — aberto via Turma/Aluno)* | `FichaIndividualComponent`, `AtaResultadosFinaisComponent`, `CertificadoConclusaoComponent`, `LivroMatriculaComponent`, `HistoricoImpressaoComponent` (documentos) | 3 |
| `Home` / `Auth` / `**` | infraestrutura de shell (portal, login) | *(não migra — shell já existe em estrutura-pedagogica)* |

### `documentacao-pedagogica/frontend-diario-classe` (4 rotas)

**Descartado.** `features/diario-de-classe/` em `estrutura-pedagogica` já cobre este escopo
(confirmado — ver `readme.md` e `cards/04-diario-de-classe.md`). Nenhuma rota deste frontend
precisa ser migrada.

## Componentes de infraestrutura do doc-ped que **não** migram

Já existem equivalentes em `estrutura-pedagogica` (shell/portal, guards, interceptors,
notificação, grid, campos de formulário). Não recriar:

- `PortalModule` (header, menu lateral, auth, `IsLoggedGuard` etc.)
- `CoreModule` (grid, select fields, multi-select, date-range-picker)
- `ApiClient`, `HandleApiError`, `NotificationService`, `HttpTokenInterceptor`,
  `CachingInterceptor`
- `FiltroComponent`/`Filtro`/`FiltroStore`/`FiltroSync` próprios do doc-ped → usar
  `shared/filtro/` de `estrutura-pedagogica`
- Motor de documento (`PageControlService`, `PrintService`, `DocumentViewerComponent` antigo,
  `OverlayImpressaoComponent`) → usar `shared/document-builder/`

O que de fato precisa ser portado/recriado é a **lógica e os dados de cada tela de domínio**
(inputs, regras de validação, agrupamento de disciplinas, cálculo de carga horária etc.), não a
infraestrutura ao redor.

## Ordem de execução (concluída)

Os 3 cards foram implementados nesta ordem — cada um está com frontend mockado completo:

1. **Card 1 — Configurações**: `features/documentacao-pedagogica/configuracoes/` — hub
   read-only (seleção de rede, accordion das 6 seções, lista de escolas/fundamentações) + 6 telas
   de edição de rede + edição de escola + edição de fundamentação legal.
2. **Card 3 — Turma & Geração de Documentos**: `features/documentacao-pedagogica/turmas/` —
   listagem de turmas + Ata de Resultados Finais + Livro de Matrícula (via `document-builder`) +
   Certificado de Conclusão novo. Ficha Individual **não foi recriada** — o botão de ação navega
   para a feature `features/ficha-individual/` já existente, sem duplicar.
3. **Card 2 — Histórico do Aluno**: `features/documentacao-pedagogica/alunos/` — listagem +
   hub do aluno + 5 telas de edição (informações, fundamentação, histórico de série, observações,
   registro de certificado).

Todo o hub `features/documentacao-pedagogica/` (abas Alunos/Turmas/Configurações via
`app-tab-navigator`, rotas aninhadas) está fechado e navegável — replica os 3 links de topo do
`NavigationTabsComponent` original do doc-ped.

Card 4 (Diário de Classe) foi descartado — já coberto por `features/diario-de-classe` nativa.

## Plugado no backend real (sessão 2026-09-03)

Os scripts de schema dos 3 cards já rodaram contra o banco. Parte do frontend já foi plugada de
verdade (deixou de retornar `of(MOCK_X)`) — detalhe técnico completo em `backend.md`:

- **Card 1 (Configurações)**: `ConfiguracaoRedeService.getRedes()`/`getConfiguracaoRede()` e
  `ConfiguracaoEscolaService.getEscolasPorRede()`/`getEscolaPorHash()` (a lista "Escolas da rede"
  do hub, e a tela de edição de escola — que passou a buscar o dado completo pelo hash em vez de
  confiar no objeto passado via `RouteStateService`, já que a listagem real só traz 4 campos).
- **Card 3, aba Turmas**: `FiltroTurmasService` (4 selects) e `TurmasService.getTurmas()` —
  filtro + listagem completos. **Documentos (Ata/Livro/Certificado) continuam mockados** — por
  decisão explícita do usuário, ficam pra um card à parte (EFC-6786/EFC-6787), depois dos outros
  cards de tela.
- **Card 2, aba Alunos**: `FiltroAlunosService` (4 selects), `AlunosService.getAlunos()`/
  `getAlunoByHash()`, `HistoricoFundamentacaoService` (reaproveita o endpoint de Fundamentação
  Legal do Card 1 pra `getFundamentacoesDisponiveis`), `HistoricoObservacoesService`,
  `RegistroCertificadoService` — filtro + busca + hub + as 3 sub-telas de edição (fundamentação,
  observações, registro de certificado). **Histórico de Série (edição) e Editar Informações
  continuam mockados** — cards à parte (EFC-6785 e investigação de `Pessoa`, respectivamente).

Ainda mockado, sem card aberto ainda: `features/ficha-individual/` (reaproveitada, não
modificada nesta migração).

### Achado ao plugar o Card 2: modelos TS desalinhados do contrato real do backend

`HistoricoObservacoesSaveRequest`, `RegistroCertificadoRequest` e
`HistoricoFundamentacaoSaveRequest` mandavam `hash`/`hashHistorico` — o backend sempre esperou
`hashAluno` (hash da `Pessoa`). E `HistoricoFundamentacoesResponse` tinha `hash`/
`hashHistoricoFundamentacao` **invertidos** em relação ao que a API retorna (`hash` = hash da
fundamentação, quando devia ser o hash do vínculo). Corrigido nos modelos e nos 3 componentes de
edição — ver `backend.md` para o detalhe do porquê.

## Escopo deliberadamente cortado no frontend (registro, não pendência ativa)

- **Card 2 — Histórico de Série**: campo "Escola" simplificado para um único `single-select`
  (sem cascata país/estado/município/cadastro de escola externa); grade de disciplinas/notas é
  somente leitura, botão "Adicionar disciplina" desabilitado.
- **Card 2 — Editar Informações**: tela existe mockada, mas não tem backend (ver `backend.md`).
- **Card 3 — Certificado de Conclusão**: só a variante de tabela padrão de disciplinas, sem a
  variante agrupada por área do conhecimento.
