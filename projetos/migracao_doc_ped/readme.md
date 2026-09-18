# Migração: documentacao-pedagogica → estrutura-pedagogica

> Documento de acompanhamento geral. Serve de pré-contexto para qualquer agente/dev que for
> codar uma parte específica desta migração — leia isto antes de abrir um card.

## Objetivo

Migrar as funcionalidades do repositório `documentacao-pedagogica` (dois frontends Angular +
um backend .NET/PostgreSQL) para dentro do `estrutura-pedagogica`, unificando os dois produtos
em um só.

## Status atual — 2026-09-09

**Migração de código (frontend + backend) dos Cards 1/2/3 está pronta.** O que falta agora é
principalmente **dado**: rodar os scripts de schema, plugar o restante do frontend, e terminar a
migração de dado histórico do Card 2 (em andamento — ver seção própria abaixo). Card 4 foi
descartado (ver abaixo). Todo o trabalho está no repositório `estrutura-pedagogica`, branch
**`projetos/MigracaoDocPed`** (local e já em `origin`) — **não** na `production`. Se for continuar
em uma sessão nova, confirmar que o checkout está nessa branch antes de tocar em qualquer arquivo
(ver [nota sobre branch](#nota-sobre-a-branch-de-trabalho) abaixo).

**Novidade 2026-09-09 — testes automatizados.** O backend inteiro da feature (Cards 1/2/3) não
tinha nenhum teste até agora: criados 147 testes de integração (`EstruturaPedagogica.Test`), que no
processo revelaram e permitiram corrigir 4 bugs reais de produção (detalhe em
[`cards/transfe_doc_repo/bugs_testes_documentacao_pedagogica_backend.md`](../../cards/transfe_doc_repo/bugs_testes_documentacao_pedagogica_backend.md)).
No frontend, 17 testes E2E Playwright foram criados para a aba de Configurações (Card 1) — ainda
não executados de fato, o setup de autenticação E2E local deu timeout; só a compilação dos specs
foi validada. Ver [`cards/01-configuracoes.md`](cards/01-configuracoes.md#testes-automatizados--2026-09-09)
para o detalhe completo, inclusive uma correção de status: a edição de Escola e de Fundamentação
Legal já estavam plugadas no backend real (o card antigo dizia que ainda eram mock) — só as 6
telas de edição de Rede continuam mockadas.

| Card | Frontend | Backend | Plugado (front→back real) |
|---|---|---|---|
| 1 — Configurações | ✅ mockado (maioria) | ✅ implementado | 🟡 parcial — ver detalhe abaixo |
| 2 — Histórico do Aluno (aba Alunos) | ✅ mockado (maioria) | ✅ implementado | 🟡 parcial — ver detalhe abaixo |
| 3 — Turma & Documentos (aba Turmas) | ✅ mockado (documentos) | ✅ implementado | 🟡 parcial — listagem plugada, documentos ainda mockados |
| 4 — Diário de Classe | — | — | descartado |

**Plugado de verdade (front→back real, testado em runtime) nesta sessão:**
- Card 1: `getRedes()`, `getConfiguracaoRede()`, listagem "Escolas da rede" (`GET
  configuracaodocumentacaopedagogica/escolas/{hashRede}`, com filtro fiel ao critério original do
  doc-ped — ver `backend.md`), `getEscolaPorHash()`, `getAnosLetivos()`,
  `updateConfiguracaoEscola()`, `updateConfiguracaoEscolaAnoLetivo()`, `getFundamentacoesLegais()`
  e `updateFundamentacoesLegais()` (confirmado por leitura do código em 2026-09-09 — o status
  anterior deste card estava desatualizado nesse ponto). Só as 6 telas de edição de Rede
  (Geral/Histórico/Ficha/Ata/Livro/Certificado) continuam mockadas.
- Card 3 (aba Turmas): filtro completo (anos letivos/redes/escolas/séries) + listagem
  (`POST turmadocumento/listar`). **Documentos da turma (Ata/Livro/Certificado) — combinado com o
  usuário que ficam para depois, em outro card — continuam mockados de propósito.**
- Card 2 (aba Alunos): filtro completo + busca/listagem (`POST historicoaluno/listar`) + hub do
  aluno (`GET historicoaluno/aluno/{hashAluno}`, já traz séries e fundamentações aplicadas) +
  fundamentação/observações/registro de certificado (get e save, todos reais). **Histórico de
  Série (edição) e Editar Informações continuam fora de escopo/mockados — cards próprios.**

Todos os scripts de **schema** (`documentacao-pedagogica-configuracoes-schema.sql`,
`-historico-aluno-schema.sql`, `-turma-documentos-schema.sql`) já foram executados contra o banco
pelo usuário. O **seed de dados do Card 1** (`documentacao-pedagogica-configuracoes-seed-dados.sql`,
gerado a partir de CSVs exportados do doc-ped) também já rodou com sucesso. O **seed de dados do
Card 2** está em andamento — ver [seção própria](#migração-de-dado-histórico-card-2--em-andamento)
mais abaixo. Nenhum commit foi feito — os arquivos ficaram como estavam no checkout (a branch já
tinha commits `WIP` de sessões anteriores; o que foi adicionado depois ficou untracked/modificado,
sem novo commit).

### Nota sobre a branch de trabalho

Durante a implementação, descobri que a branch `production` (onde eu estava) **não é onde este
trabalho deveria estar** — a branch correta é `projetos/MigracaoDocPed`, que já tinha commits
`WIP - Configuracoes`, `WIP - Aba de Turmas`, `WIP - Alunos`, `WIP - Configuracoes: Entidades ->
Repository` de trabalho anterior (aparentemente um auto-commit rodava em paralelo salvando
progresso nessa branch, independente de qual branch eu tinha efetivamente feito checkout). Troquei
para `projetos/MigracaoDocPed` e reconciliei duplicatas que haviam sido recriadas por engano
(ver `backend.md` para o detalhe técnico). **Antes de continuar, sempre confirmar
`git branch --show-current` no `estrutura-pedagogica` é `projetos/MigracaoDocPed`.**

## Estratégia de migração

1. **Frontend primeiro, com dados mockados.** O frontend é a parte com mais mudanças/melhorias
   planejadas, então a prioridade é modelar a feature inteira (telas, navegação, componentes)
   com mocks, sem esperar o backend novo ficar pronto.
2. Depois de validado visualmente, plugar nos endpoints reais (migrados/adaptados do backend do
   doc-ped, ou reaproveitando dados que o `estrutura-pedagogica` já possui).
3. Backend **não migra 1:1**. Boa parte das entidades do doc-ped são apenas espelhos de dados
   que já existem no banco principal (o mesmo banco que `estrutura-pedagogica` usa) — só as
   entidades próprias do doc-ped precisam ser recriadas. Detalhe completo em
   [`backend.md`](backend.md).

## Como este projeto está organizado

```
projetos/migracao_doc_ped/
  readme.md              — este arquivo: contexto geral, achados, estratégia, status de migração de dado
  frontend.md             — plano de migração do frontend (rotas de origem, mapeamento, mocks)
  backend.md               — plano de migração do backend (domínios, Hash/HashOrigem, o que migra e o que não)
  rascunho_cards.md         — descrições nível-produto dos cards do Jira (épico EFC-6781 e filhos EFC-6782..6787)
  cards/                      — divisão em blocos de contexto lógico para acompanhar o andamento
    01-configuracoes.md
    02-historico-do-aluno.md
    03-turma-e-documentos.md
    04-diario-de-classe.md
  scripts/                    — geradores Python dos seeds de dado (persistidos aqui, não em scratchpad)
    gen_seed.py                 — Card 1 (Configurações) — já rodado
    gen_historico_seed.py       — Card 2 (Histórico do Aluno) — em andamento
  base_doc_ped_csv/             — CSVs exportados do doc-ped/nativo + output/ com os CSVs já resolvidos
```

Os cards **não são 1:1 com as telas de origem** — foram agrupados por contexto lógico
(áreas que compartilham dados/fluxo), para não pulverizar o acompanhamento em dezenas de cards
pequenos.

## Origem — documentacao-pedagogica

Repositório com **dois frontends Angular independentes** e **um backend compartilhado**:

| Parte | Detalhe |
|---|---|
| `frontend/` | 14 rotas · 105 componentes · 71 services · 154 models. Histórico do Aluno, Configurações (Rede/Escola/Fundamentação Legal), Turma, Geração de Documentos (Ficha Individual, Ata de Resultados Finais, Certificado de Conclusão, Livro de Matrícula) |
| `frontend-diario-classe/` | 4 rotas · 62 componentes · 39 services · 52 models. Configuração e Relatório/Impressão do Diário de Classe |
| `backend/` | .NET 8, Clean Architecture (`Api` / `Application` / `Domain` / `Domain.Services` / `Infra` / `Extensions`), banco **PostgreSQL** próprio, separado do banco principal do portal |

Mapas Angular completos (gerados por `/bench-scan-front`, componentes/services/models linha a
linha): `frontend-maps/documentacao-pedagogica-angular-map.md` e
`frontend-maps/documentacao-pedagogica-diario-angular-map.md`. Consultar esses arquivos antes de
abrir os componentes de origem no repositório — evita gastar contexto explorando diretórios.

## Destino — estrutura-pedagogica

- Angular 20 (standalone), uma pasta por feature em `frontend/src/app/features/<nome>`,
  componentes compartilhados obrigatórios (`shared/`) — ver
  `refat_components_estrutura_pedagogica.md` na raiz deste repo antes de gerar HTML.
- Backend .NET 8, mesma arquitetura em camadas do doc-ped, banco **SQL Server** (o banco
  principal do portal, mesmo usado por `estrutura-pedagogica` e `atlas`).
- Já existe um motor de geração de documentos genérico e reutilizável:
  `frontend/src/shared/document-builder/` (`DocumentViewerComponent`, `DocumentConfig`,
  `DocSectionComponent`, `DocInfoRowComponent`, `DocWideTableComponent`, PDF/print, etc.).
  **Não portar** o motor próprio do doc-ped (`PageControlService`, `PrintService`,
  `DocumentViewerComponent` antigo, `gerador-documentos/*`) — usar o `document-builder` já
  existente, como já foi feito em `diario-de-classe` e `ficha-individual` (ver abaixo).

## Achados importantes: já existe scaffold no destino

Durante o levantamento, duas features de `estrutura-pedagogica` já tocam exatamente neste
escopo — **verificar antes de recriar qualquer coisa**:

- **`features/ficha-individual/`** — já existe, montada sobre o `document-builder`, com
  `mocks/ficha-individual.mock.ts` e um comentário explícito no service:
  `// Método real — dados mockados enquanto integração com documentacao-pedagogica não é feita`.
  Ou seja: **alguém já começou exatamente a abordagem "mock primeiro" descrita neste
  documento**, para esta tela especificamente. Antes de trabalhar no card 3, comparar o que já
  existe aí contra o `FichaIndividualComponent` de origem (campos, escopos —
  regular/diversificado/itinerário/dependência — e o grid por disciplina) e completar as
  lacunas, em vez de recriar a feature do zero.
- **`features/diario-de-classe/`** — **confirmado: já cobre o escopo do Diário de Classe do
  doc-ped.** Já é funcional de verdade (não é mock): rotas `listar`/`configurar`, filtro real,
  chamada a `DiarioDeClasseService` (backend real), painel de configuração de seções/caracteres,
  geração de documento via `document-builder`, exportação em PDF. **Card 4 descartado** — ver
  [`cards/04-diario-de-classe.md`](cards/04-diario-de-classe.md).

## Diferença de modelo de dados — Hash vs HashOrigem

- `documentacao-pedagogica` usa **PostgreSQL**, um banco próprio, separado do banco principal
  do portal (o mesmo SQL Server que `estrutura-pedagogica` usa).
- Toda entidade do doc-ped que espelha um dado do banco principal (Aluno, Turma, Escola, Rede,
  Série, Segmento, Ano Letivo, Área de Conhecimento, etc.) estende `ExternalEntity`, que define:
  - `Hash` (herdado de `BaseEntity`) — identificador local, dentro do banco do doc-ped.
  - `HashOrigem` — o Hash **original** da mesma entidade no banco principal.
- Confirmado por inspeção: os mesmos nomes de entidade (`Escola`, `EscolaAnoLetivo`,
  `AnoLetivo`, `AreaConhecimento`, `Estado`, `Disciplina`, `PerfilAcesso`, `Funcionalidade`)
  já existem nativamente em `EstruturaPedagogica.Domain/Entities/Base/`.
- **Consequência prática:** essas entidades "espelhadas" não precisam ser recriadas na migração
  — já existem em `estrutura-pedagogica` e são referenciáveis pelo mesmo Hash (`HashOrigem` do
  doc-ped = `Hash` em estrutura-pedagogica). Só migram as entidades **próprias** do doc-ped, sem
  equivalente no destino. Lista completa em [`backend.md`](backend.md).

## Cards (técnicos, deste documento) × Cards (Jira, produto)

Os 3 cards técnicos abaixo (`cards/*.md`) organizam o trabalho por **camada/domínio de dado**.
Em paralelo, existe uma quebra **por produto/tela**, criada no Jira como filhos do épico
[EFC-6781](https://gruposalta.atlassian.net/browse/EFC-6781) — ver `rascunho_cards.md` neste
mesmo diretório para as descrições completas:

| Jira | Título | Equivale a (card técnico) |
|---|---|---|
| EFC-6782 | Configurações (Rede, Fundamentação e Escola) | Card 1 |
| EFC-6783 | Aba de Turmas (filtro e listagem) | Card 3 — só a listagem |
| EFC-6784 | Aba de Alunos (dados, fundamentação e observações) | Card 2 — só a listagem/hub |
| EFC-6785 | Edição do Histórico do Aluno (séries e resultado final) | Card 2 — histórico de série (não implementado) |
| EFC-6786 | Documentos da Turma (Ata + Livro de Matrícula) | Card 3 — documentos (não implementado) |
| EFC-6787 | Documentos do Aluno (Ficha Individual + Certificado) | Card 3 — documentos (não implementado) |

Os cards técnicos continuam sendo a referência de implementação (contexto de banco/entidades não
se divide bem por tela); os cards do Jira são só a forma de reportar progresso pro time/produto.

## Cards

| # | Card | Escopo | Status |
|---|------|--------|--------|
| 1 | [Configurações](cards/01-configuracoes.md) | Configuração de Rede, Escola, Fundamentação Legal | frontend + backend implementados; **plugado**: redes, config de rede, escolas da rede; schema + seed de dados **rodados** |
| 2 | [Histórico do Aluno](cards/02-historico-do-aluno.md) | Busca de alunos + hub de edição (informações, fundamentação, séries/histórico, registro de certificado, observações) | frontend + backend implementados; **plugado**: busca/listagem, hub, fundamentação/observações/certificado; schema rodado, **migração de dado histórico em andamento** (ver seção própria); Editar Informações e edição de Histórico de Série fora de escopo |
| 3 | [Turma & Geração de Documentos](cards/03-turma-e-documentos.md) | Listagem de turma + Ficha Individual, Ata de Resultados Finais, Certificado de Conclusão, Livro de Matrícula | frontend + backend implementados; **plugado**: só a listagem (filtro + lista); documentos (Ata/Livro/Certificado/Ficha) **deliberadamente adiados** — schema rodado |
| 4 | ~~[Diário de Classe](cards/04-diario-de-classe.md)~~ | 2º frontend do doc-ped: configuração + relatório/impressão do diário | **descartado** — já coberto por `features/diario-de-classe` |

## Migração de dado histórico (Card 2) — em andamento

Card 1 já teve seu seed de dados gerado a partir de CSVs exportados do doc-ped e **executado com
sucesso** (rede, escola, certificado de conclusão, fundamentação legal, nomenclatura de série —
ver `cards/01-configuracoes.md`). Card 2 é uma escala completamente diferente — histórico escolar
de todos os alunos do doc-ped, não configuração — e está em andamento nesta pasta:
`base_doc_ped_csv/` (CSVs de origem) e `base_doc_ped_csv/output/` (CSVs já resolvidos, prontos
pra importar).

**Escala real (medida, não estimada):**

| Tabela | Linhas | Status |
|---|---|---|
| `Historico` | 341.467 | ✅ CSV resolvido gerado (`output/historico_import.csv`) |
| `HistoricoSerie` | 1.194.967 | ✅ CSV resolvido gerado (`output/historico_serie_staging.csv`) |
| `HistoricoFundamentacao` | 20.441 | ✅ CSV resolvido gerado (`output/historico_fundamentacao_staging.csv`) |
| `TipoResultadoFinal` | 10 | ✅ **script rodado** (seed pequeno, estilo Card 1) |
| `ResultadoFinal` (notas por disciplina) | 15.151.358 | ⏸️ **adiado por decisão do usuário** — a grade é somente leitura no frontend hoje; migrar quando a edição disciplina-a-disciplina for implementada |

Todos os CSVs resolvidos deram **100% de match, zero linhas órfãs** (Usuario→Pessoa, Escola,
Série, AnoLetivo, FundamentacaoLegal — todos resolveram integralmente contra os dados já
migrados do Card 1 e contra a base nativa).

**Por que não é `INSERT...VALUES` como o Card 1**: nessa escala (1,19M+ linhas), texto SQL
puro geraria dezenas de GB e travaria/demoraria horas no SSMS. A abordagem virou: CSV já
resolvido (IDs nativos traduzidos em Python) + import direto pelo DBeaver (*botão direito na
tabela → Import Data*) + tabelas de staging pra resolver `HistoricoId` (que só existe depois que
`Historico` for inserido, por ser `IDENTITY`) via `JOIN` em vez de pré-calcular.

**Scripts gerados** (`estrutura-pedagogica/backend/Scripts/`):
1. `documentacao-pedagogica-historico-aluno-seed-tiporesultadofinal.sql` — **✅ já rodado**
2. `documentacao-pedagogica-historico-aluno-seed-staging-create.sql` — cria as tabelas de
   staging (`HistoricoSerie_Staging`, `HistoricoFundamentacao_Staging`) — **gerado, não rodado**
3. `documentacao-pedagogica-historico-aluno-seed-resolve.sql` — resolve `HistoricoId` via `JOIN`
   e insere nas tabelas finais, depois derruba o staging — **gerado, não rodado**

**Próximos passos (nesta ordem):**
1. Rodar `documentacao-pedagogica-historico-aluno-seed-staging-create.sql`.
2. Importar via DBeaver (Import Data), deixando `Id`/`Hash` fora do mapeamento de colunas:
   - `base_doc_ped_csv/output/historico_import.csv` → `DocumentacaoPedagogica.Historico`
   - `base_doc_ped_csv/output/historico_serie_staging.csv` → `DocumentacaoPedagogica.HistoricoSerie_Staging`
   - `base_doc_ped_csv/output/historico_fundamentacao_staging.csv` → `DocumentacaoPedagogica.HistoricoFundamentacao_Staging`
3. Rodar `documentacao-pedagogica-historico-aluno-seed-resolve.sql`.
4. Conferir contagens (`SELECT COUNT(*)` — números esperados nos comentários do script, batendo
   com a tabela acima).

**Script gerador Python**: `projetos/migracao_doc_ped/scripts/gen_historico_seed.py` (persistido
neste repo — a versão anterior só existia num scratchpad de sessão, efêmero). Consome os CSVs de
`base_doc_ped_csv/` mais 3 mapeamentos nativos pré-calculados
(`rede_native.csv`/`escola_native.csv`/`serie_native.csv`, gerados na migração do Card 1 — se não
existirem mais no disco, precisam ser regerados via query MCP, ver `gen_seed.py`) e
`usuario_nativo.csv` (export feito pelo usuário via DBeaver: `SELECT Id, Hash, Pessoa FROM
dbo.Usuario` — 2,64 milhões de linhas, grande demais pra buscar via MCP em lotes). **Se os
caminhos hardcoded de scratchpad no topo do script não existirem mais (sessão antiga), ajustar
`SCRATCH`/`OUT_DIR`/`SCRIPTS_DIR` antes de rodar de novo.**

**CSVs de origem ainda não usados** (exportados pelo usuário, aguardando a decisão de escopo
acima): `resultado_final.csv` (2,8GB), `tipo_componente_curricular.csv`, `area_conhecimento.csv`
— todos só servem pra popular `ResultadoFinal`, que está adiado.

## Pendências / decisões em aberto

- **Rodar de verdade a suíte E2E do Card 1** — 17 testes criados (`frontend/tests/e2e/
  documentacao-pedagogica/configuracoes/`), só a compilação foi validada. Precisa do setup de
  autenticação E2E funcionando (`npm run test:e2e:auth`) antes de conseguir confirmar se passam.
- **Terminar a migração de dado do Card 2** (ver seção acima) — é o item mais concreto e
  imediato pendente agora.
- **Plugar o restante do frontend → backend real.** Documentos da Turma (Ata/Livro/Certificado),
  Ficha Individual, Histórico de Série (visualização — edição é card à parte) continuam mockados.
- ~~Executar os scripts SQL~~ **resolvido** — os 3 scripts de schema já rodaram contra o banco.
- ~~Coordenar `FuncionalidadeEnum` com o time~~ **resolvido** — trocado pelos 3 `Funcionalidade`
  reais já cadastrados no banco (produto 171, "Documentação Pedagógica"): `Configuracoes = 4`
  ("Configuração de Documento"), `HistoricoAluno = 438` ("Acesso"),
  `TurmaDocumentos = 412` ("Emitir Histórico"). Ver `backend.md`.
- **"Editar Informações" do aluno (Card 2) está fora de escopo.** Os campos (nome/CPF/RG/
  nacionalidade/filiação) já existem na tabela nativa `Pessoa` — editar isso deve reaproveitar o
  caminho de edição de Pessoa que já existe no `estrutura-pedagogica`, não uma tabela paralela.
  Precisa de investigação própria (qual service/endpoint já faz isso hoje) antes de implementar.
- **`ResultadoFinal` (15,1 milhões de linhas) adiado deliberadamente** — migrar quando a edição
  disciplina-a-disciplina do histórico de série for implementada (hoje é somente leitura).
- **Simplificações deliberadas que podem precisar de retrabalho** (ver "Pontos de atenção" em
  cada card): cascata país/estado/cidade de escola externa (Card 2) virou um único select; edição
  disciplina-por-disciplina do histórico de série (Card 2) ficou somente leitura; Certificado de
  Conclusão agrupado por área do conhecimento (Card 3) não foi implementado, só a tabela padrão.
- Confirmar se o fluxo de importação (`ImportacaoHistoricoSerie`, `ImportacaoResultadoFinal`) do
  doc-ped precisa de tela própria no destino ou se é caso de uso administrativo pontual (script).
