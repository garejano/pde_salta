# Migração do Diário de Classe → estrutura-pedagogica

**Repositório fonte:** `documentacao-pedagogica` / `frontend-diario-classe`  
**Repositório alvo:** `estrutura-pedagogica` (frontend + backend)  
**Card:** [EFC-6443](https://gruposalta.atlassian.net/browse/EFC-6443)  
**Epic:** EFC-6240 — Lançamento de frequência e Justificativa

---

## O que existe hoje

### Frontend (`documentacao-pedagogica/frontend-diario-classe`)

O diário de classe é uma **aplicação Angular standalone** com duas rotas principais:

| Rota | Componente | Função |
|------|-----------|--------|
| `Configuracao.Listar` | `ConfiguracaoComponent` | Configura caracteres por rede (presença, falta, pendência, NEE, transferência) |
| `Relatorio.Listar` | `ListarRelatorioComponent` | Filtro + geração do documento |

**Componentes do documento** (renderizam as páginas impressas):
- `DiarioClasseComponent` — orquestra as seções (recebe `dados`, `configuracao`, `configuracaoFiltro`, `ready`)
- `DocGridDiarioClasseComponent` — grade de chamada (datas × alunos, com caracteres de frequência)
- `DocGridConteudosDiarioClasseComponent` — grade de conteúdo ministrado
- `DocGridRelatorioRendimentoComponent` — relatório de rendimento (notas por etapa)
- `DocHeaderComponent`, `DocFooterComponent`, `DocTextFieldComponent`, `DocAssinaturaComponent` — blocos estruturais

**Filtro atual** (componente próprio — NÃO usa o `FiltroComponent` do estrutura-pedagogica):
- Campos: Ano letivo, Rede, Escola, Série, Turma, Disciplina
- Campos adicionais no request: `dataInicio`, `dataTermino`, `nomeEtapa`
- Flags de exibição no request: `exibirNomeProfessor`, `exibirFrequencia`, `exibirConteudoMinistrado`, `exibirRelatorioRendimento`

**Services e endpoints chamados (backend `documentacao-pedagogica`):**

| Service | Método | Endpoint |
|---------|--------|----------|
| `RelatorioService` | `getDocumentoDiarioClasse` | `POST /diarioclasse/getdocumentodiarioclasse` |
| `ConfiguracaoService` | `getDiariosClasse` | `GET /diarioclasseconfiguracao/getall` |
| `ConfiguracaoService` | `getDiariosClasseByHash` | `GET /diarioclasseconfiguracao/getdocped/{hashRede}` |
| `ConfiguracaoService` | `updateConfiguracao` | `POST /diarioclasseconfiguracao/save` |
| `FiltroService` | `anosLetivos`, `redes`, `escolas`, `series`, `turmas`, `disciplinas` | filtro padrão |

**DTO da configuração por rede** (`DiarioClasseConfiguracao` entity):
- `Hash`, `Ativo`, `DataInclusao`, `DataUltimaAlteracao`
- `RedeId` (FK → Rede)
- `CaracterParaIndicarPresenca`, `CaracterParaIndicarFalta`, `CaracterParaIndicarPendencia`, `CaracterParaIndicarTransferencia`, `CaracterParaIndicarNEE`
- `ExibirFrequencia`, `ExibirConteudoMinistrado`, `ExibirRelatorioRendimento`

**DTO do response do documento** (`DiarioClasseGetResponse`):
- Cabeçalho: `NomeEscola`, `Cidade`, `UF`, `Endereco`, `CNPJ`, `Telefone`, `Logo`
- Infos da aula: `NomeProfessor`, `Disciplina`, `Turma`, `NomeEtapa`, `AulasPrevistas`, `AulasDadas`
- `ConfiguracaoDiario: DiarioClasseCaracterResponse` (os 5 caracteres)
- `Aulas: List<DataAulaResponse>` — hash + data de cada aula
- `Alunos: List<DiarioClasseAlunoResponse>` — nome, matrícula, `Chamadas: List<BaseResponse>`
- `Conteudos: List<DiarioClasseConteudoResponse>` — conteúdo + atividades por data
- `RelatorioDeRendimento: RelatorioDeRendimentoResponse` — notas por aluno/etapa/coluna

---

## O que precisa ser feito

### Backend — `estrutura-pedagogica`

Todos os dados vêm do banco do `estrutura-pedagogica` diretamente — sem agregação de backends externos. Criar tudo sob o namespace `DiarioDeClasse/` nos projetos correspondentes.

#### Novos controllers

```
EstruturaPedagogica.Api/Controllers/DiarioDeClasse/
  DiarioDeClasseController.cs              → dados do documento
  DiarioDeClasseConfiguracaoController.cs  → config por rede (caracteres + flags exibição)
  DiarioDeClasseFiltroController.cs        → endpoints de filtro específicos
                                             (disciplinas, etapas disponíveis)
```

**Endpoints mínimos a criar:**

| Rota | Método HTTP | Função |
|------|------------|--------|
| `api/diariodeclasse/get-documento` | POST | Retorna dados completos do documento |
| `api/diariodeclasse/configuracao` | GET | Lista configurações das redes acessíveis ao usuário |
| `api/diariodeclasse/configuracao/save` | POST | Salva configuração de uma rede |
| `api/diariodeclasse/filtro/disciplinas` | POST | Disciplinas disponíveis para a turma selecionada |

> **Permissão:** usar `Funcionalidade.DiarioDeClasse` (a criar no enum `Funcionalidade` do domínio, espelhando `Funcionalidade.DiarioDeClasse_Configuracao` do doc-ped).

#### Camadas de domínio

```
EstruturaPedagogica.Domain/
  DTO/DiarioDeClasse/
    DiarioDeClasseDocumentoRequest.cs       → equivalente a FiltroDiarioClasseRequest
    DiarioDeClasseDocumentoResponse.cs      → equivalente a DiarioClasseGetResponse
    DiarioDeClasseConfiguracaoResponse.cs
    DiarioDeClasseConfiguracaoSaveRequest.cs

EstruturaPedagogica.Domain/Entities/
  DiarioDeClasseConfiguracao.cs             → (ver db-migration.md para a tabela)

EstruturaPedagogica.Domain.Services/DiarioDeClasse/
  Interfaces/
    IGetDocumentoDiarioDeClasseService.cs
    IGetConfiguracaoDiarioDeClasseService.cs
    ISaveConfiguracaoDiarioDeClasseService.cs
  GetDocumentoDiarioDeClasseService.cs
  GetConfiguracaoDiarioDeClasseService.cs
  SaveConfiguracaoDiarioDeClasseService.cs

EstruturaPedagogica.Infra/
  Mapping/Stateful/DiarioDeClasseConfiguracaoMap.cs
  Repositories/DiarioDeClasse/DiarioDeClasseRepository.cs
```

---

### Frontend — `estrutura-pedagogica`

#### Estrutura de arquivos

```
frontend/src/app/features/diario-de-classe/
  diario-de-classe.module.ts
  diario-de-classe.routes.ts
  services/
    diario-de-classe.service.ts            → POST get-documento, GET/POST configuracao
    filtro-diario-de-classe.service.ts     → ano letivo, rede, escola, série, turma, disciplina
  filtro-diario-de-classe.ts               → FilterConfig declarativo
  listar/
    listar.component.ts                    → tela principal com filtro
  documento/
    documento.component.ts                 → monta DocumentBundle[] e abre overlay
  configuracao/
    configuracao.component.ts              → painel de edição de caracteres por rede
  doc-blocks/
    doc-grid-diario/                       → grade de chamada (datas × alunos)
    doc-grid-conteudo/                     → grade de conteúdo ministrado
    doc-grid-rendimento/                   → relatório de rendimento (notas)
```

#### Filtro

Usar `FiltroComponent` com `FilterConfig` declarativo — mesmo padrão de `filtro-lista-presenca.ts`.

Campos do filtro:
- Rede *(obrigatório, store: true)*
- Escola *(obrigatório, store: true, autoSelectWhenSingle)*
- Série *(store: true, autoSelectWhenSingle)*
- Turma *(store: true, autoSelectWhenSingle)*
- Disciplina *(obrigatório — depende de turma)*
- Data início + Data fim *(campos de data livres — mantém comportamento atual)*

O campo `nomeEtapa` não é um campo do filtro — é resolvido no backend com base no range de datas.

#### Documento (document-builder)

Seguir o padrão de `lista-presenca.component.ts` e `carometro-exemplo.component.ts`:

1. Montar `DocumentBundle[]` com `DocumentBuilderModule`
2. Usar `DocumentViewerComponent` com overlay de impressão
3. Usar `DocumentConfigPanelComponent` para o painel **"Personalizar documento"**

**Blocos do documento** (`DocumentEntry[]` por bundle):
- `DocPresencaInfoComponent` — cabeçalho da turma *(reutilizar o já existente)*
- `doc-grid-diario` — grade de chamada *(novo — migrar lógica de `DocGridDiarioClasseComponent`)*
- `doc-grid-conteudo` — conteúdo ministrado *(novo — migrar lógica de `DocGridConteudosDiarioClasseComponent`)*
- `doc-grid-rendimento` — relatório de rendimento *(novo — migrar lógica de `DocGridRelatorioRendimentoComponent`)*
- `DocSignatureComponent` — assinaturas *(reutilizar o já existente)*

Cada seção só entra no bundle se a flag `exibir*` da configuração da rede for `true`.

#### Painel "Personalizar documento" (substitui a tela de Configuração)

A tela `/configuracao` atual migra para um **painel lateral dentro da tela do documento** seguindo o padrão do carômetro. A configuração persiste no banco por rede — o save vai para `api/diariodeclasse/configuracao/save`. O acesso de escrita segue a permissão `DiarioDeClasse_Configuracao` (restrito a coordenação/gestão).

---

## Fatiamento sugerido (subtarefas)

| # | Escopo | Dependências |
|---|--------|-------------|
| 1 | **Backend — Entity + Migration SQL** (`DiarioDeClasseConfiguracao`) | ver `db-migration.md` |
| 2 | **Backend — DTOs e interfaces de domínio** | — |
| 3 | **Backend — Endpoint de dados do documento** (`get-documento`) | 1 + 2 |
| 4 | **Backend — Endpoint de configuração** (get + save) | 1 + 2 |
| 5 | **Frontend — FilterConfig** + `filtro-diario-de-classe.service.ts` | — |
| 6 | **Frontend — Tela principal** (`listar.component`) com filtro | 5 |
| 7 | **Frontend — Blocos do documento** (`doc-grid-diario`, `doc-grid-conteudo`, `doc-grid-rendimento`) | — |
| 8 | **Frontend — Documento** (monta `DocumentBundle[]` e abre overlay) | 3 + 6 + 7 |
| 9 | **Frontend — Painel de configuração** (caracteres por rede, persistido) | 4 |
| 10 | **Roteamento** — registrar `diario-de-classe` no `AppRoutingModule` | 6 |

---

## Referências de código

| O quê | Onde |
|-------|------|
| Padrão de filtro declarativo | `estrutura-pedagogica/frontend/.../lancamento-frequencia/lista-presenca/filtro-lista-presenca.ts` |
| Padrão de documento com overlay | `estrutura-pedagogica/frontend/.../lancamento-frequencia/lista-presenca/lista-presenca.component.ts` |
| Padrão de config panel (personalizar) | `estrutura-pedagogica/frontend/.../exemplos/carometro-exemplo/carometro-exemplo.component.ts` |
| Controller de referência (backend) | `estrutura-pedagogica/backend/.../Controllers/ListaPresencaController.cs` |
| Mapping de tabela de referência | `estrutura-pedagogica/backend/.../Infra/Mapping/Stateful/ConfiguracaoPeriodoLetivoMap.cs` |
| Componentes do documento atual | `documentacao-pedagogica/frontend-diario-classe/src/app/components/` |
| DTOs do documento atual | `documentacao-pedagogica/backend/DocumentacaoPedagogica.Domain/DTO/DiarioClasse/` |
| Entity de configuração atual | `documentacao-pedagogica/backend/DocumentacaoPedagogica.Domain/Entities/DiarioClasseConfiguracao.cs` |

---

## Documentos relacionados

- [`db-migration.md`](./db-migration.md) — criação da tabela e migração de dados
