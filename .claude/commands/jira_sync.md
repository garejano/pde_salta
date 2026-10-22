# Skill: jira_sync

## Descrição

Mantém os arquivos locais em `cards/` atualizados a partir do Jira. O fluxo é **sempre unidirecional: Jira → local**. O Jira é a fonte de verdade; esta skill nunca escreve nem altera dados no Jira. Alterações feitas localmente nos arquivos de cards não são propagadas de volta.

---

## Uso

```
/jira_sync              → sincroniza todos os cards abertos do usuário
/jira_sync <KEY>        → sincroniza (ou cria) um card específico (ex: /jira_sync EFC-6196)
/jira_sync --list       → lista cards abertos sem criar arquivos
/jira_sync backlog      → grava snapshot do backlog em cards/BACKLOG/backlog.md
```

---

## Parâmetros

| Parâmetro  | Descrição | Obrigatório |
|------------|-----------|-------------|
| `<KEY>`    | Chave do card Jira (ex: `EFC-6196`) | Não |
| `--list`   | Apenas lista, sem gravar arquivos | Não |
| `backlog`  | Grava snapshot do backlog do projeto em `cards/BACKLOG/backlog.md` | Não |

---

## Execução Passo a Passo

### 1. Descobrir instância e usuário

- Usar `getAccessibleAtlassianResources` para obter o `cloudId`.
- Usar `lookupJiraAccountId` com o e-mail do usuário para obter o `accountId` — **necessário apenas nos modos completo, `--list` e `backlog`; pular esta chamada no modo card único (`<KEY>`).**

### 2. Buscar cards

**Modo completo (sem parâmetros):**
```jql
assignee = "<accountId>" AND statusCategory != Done ORDER BY updated DESC
```
Campos: `summary`, `status`, `issuetype`, `priority`, `project`, `description`, `updated`, `subtasks`, `parent`

**Modo card único (`/jira_sync <KEY>`):**
```jql
key = "<KEY>"
```
Sem filtro de assignee — sincroniza o card independentemente de estar atribuído ao usuário ou de qual for seu status.

**Modo lista (`--list`):**  
Executar a mesma query do modo completo, mas imprimir tabela no terminal e encerrar sem gravar.

**Modo backlog (`backlog`):**
```jql
project = EFC AND statusCategory = "To Do" ORDER BY priority ASC, updated DESC
```
Gravar o resultado em `cards/BACKLOG/backlog.md` usando o template da **Seção "Template de Backlog"**. Criar o diretório se não existir. Sempre sobrescrever sem pedir confirmação (snapshot de ponto no tempo).

### 3. Para cada card — criar/atualizar arquivo local

#### 3a. Verificar se o diretório já existe

- Caminho: `cards/<KEY>/`
- Se existir `cards/<KEY>/<KEY>.md`, perguntar ao usuário se deseja sobrescrever antes de continuar.

#### 3b. Buscar detalhes completos do card

Usar `getJiraIssue` (ou `searchJiraIssuesUsingJql` com `maxResults=1`) para obter:
- `description` completa
- `subtasks` e seus statuses
- `parent` (Epic/Feature)
- `priority`, `labels`, `fixVersions`
- `comments` recentes (últimos 3)

#### 3c. Gravar `cards/<KEY>/<KEY>.md`

Usar o template da **Seção "Template de Saída"** abaixo, preenchendo com os dados reais do card.

### 4. Exibir resumo

Ao final, exibir tabela com os cards processados. Nos modos que sincronizam card(s) específico(s), cada linha inclui o próximo passo sugerido pela **Seção 5**:

```
✔ EFC-6196  →  cards/EFC-6196/EFC-6196.md  (criado)
   repo: estrutura-pedagogica · próximo passo: /planejar-implementacao EFC-6196
✔ EFC-5976  →  cards/EFC-5976/EFC-5976.md  (atualizado)
   repo: estrutura-pedagogica · próximo passo: /executar-plano EFC-5976 (3/5 fases concluídas)
✗ EFC-3301  →  ignorado (usuário negou sobrescrita)
```

---

### 5. Sugerir próximo comando do fluxo de dev

Aplica-se apenas aos modos que sincronizam card(s) específico(s) (`/jira_sync` e `/jira_sync <KEY>`) — **não** a `--list` nem `backlog`, que são apenas leitura/snapshot.

Para cada card processado (inclusive os ignorados por recusa de sobrescrita, já que o card já tinha arquivo local):

#### 5a. Identificar o repositório provável

Usar `repository_map.md` (palavras-chave de `summary`/`description` do card) para apontar o repositório responsável, da mesma forma que a IA já usa esse arquivo para localizar onde implementar um card. Se mais de um repositório combinar com confiança semelhante, ou nenhum combinar, **não adivinhar** — marcar o card como `repo: não identificado` e pular as etapas seguintes para ele.

#### 5b. Verificar se o repositório tem o fluxo de comandos guiado

Checar a linha `Skills:` do repositório em `repository_map.md`. Se a linha não existir ou o mapa estiver desatualizado, verificar diretamente `c:/projects/<repo>/.claude/commands/` — a presença de `refinar-feature.md`, `planejar-implementacao.md` e `executar-plano.md` indica que o repositório segue o fluxo padrão. Sem esses três, **não sugerir comando** — apenas informar `repo: <nome> (sem skills de fluxo configuradas)`.

Hoje `estrutura-pedagogica` e `notas` têm esse fluxo; os demais repositórios do mapa, não.

#### 5c. Inspecionar o estado local (cards/ e repositório)

O `pde_salta` tem seu próprio fluxo local (`/refinar-feature`, `/identificar-bug`, `/planejar-implementacao`), que grava sempre em `cards/<KEY>/` — nunca no repositório de destino (ver [[planejar-implementacao]]). Alguns repositórios (`estrutura-pedagogica`, `notas`) também têm um fluxo **nativo** equivalente, usado quando o desenvolvedor trabalha direto no repositório, que grava em `Docs/` dentro dele. As duas fontes são independentes — verificar **ambas** e tratar como "existe" se encontrado em qualquer uma:

**a) Local (`cards/<KEY>/`, sempre verificar):**

1. `cards/<KEY>/<KEY>.refinamento.md` existe?
2. `cards/<KEY>/<KEY>.bug-report.md` existe?
3. `cards/<KEY>/<KEY>.tech.md` existe? Se existir, contar quantas fases estão `**Status:** pendente` vs. `concluída`.

**b) Repositório nativo (`c:/projects/<repo>/`, apenas se accessível e com o fluxo guiado confirmado em 5b):**

Verificar nesta ordem (usando `git -C c:/projects/<repo>` para comandos git, sem alterar o diretório de trabalho atual):

1. `Docs/user-story-<KEY>.md` existe?
2. `Docs/<KEY>-bug-report.md` existe?
3. `Docs/plano-tecnico-<KEY>.md` existe? Se existir, contar quantas fases estão `**Status:** pendente` vs. `concluída`.
4. Existe branch local ou remoto correspondente? `git -C c:/projects/<repo> branch -a --list "*<KEY>*"`

Se o repositório não existir localmente, ou os arquivos não puderem ser lidos, pular apenas a parte (b) e avisar `repo: <nome> (não foi possível inspecionar o estado no repositório — avaliado apenas cards/ local)` — a parte (a) sempre roda, independentemente de o repositório estar acessível.

Se um plano técnico existir nas duas fontes ao mesmo tempo (raro), priorizar o de `cards/<KEY>/<KEY>.tech.md` para a contagem de fases, por ser o mantido pelo fluxo atual via `pde_salta`, e mencionar a existência do outro como observação.

#### 5d. Decidir a sugestão

| Condição | Sugestão |
|---|---|
| Tipo `Bug`, sem `<KEY>.bug-report.md` (local ou `Docs/<KEY>-bug-report.md`) e sem plano técnico (local ou nativo) | `/identificar-bug <KEY>` |
| Sem refinamento/user-story nem bug-report (local ou nativo), sem CAs numerados na descrição do Jira, sem plano técnico (local ou nativo) | `/refinar-feature <KEY>` |
| Refinamento/user-story ou bug-report existe (local ou nativo, ou a descrição do Jira já tem CAs numerados), sem plano técnico (local ou nativo) | `/planejar-implementacao <KEY>` |
| `cards/<KEY>/<KEY>.tech.md` existe com fases pendentes | Informar "X de Y fases concluídas" — **não** sugerir `/executar-plano` (não há comando de execução equivalente para o plano local; acompanhamento é manual) |
| Apenas `Docs/plano-tecnico-<KEY>.md` (nativo) existe com fases pendentes | `/executar-plano <KEY>` — informar "X de Y fases concluídas" |
| Plano técnico (local ou nativo) existe e todas as fases estão concluídas, sem indício de PR aberto/mergeado | `/analisar-pr <branch-destino> <KEY>` — revisar antes de abrir ou aprovar o PR |
| Status do card no Jira já é `Done`/categoria `Done` | Não sugerir comando — informar `card já concluído` |

Quando o tipo de card for `Bug` mas já existir plano técnico (local ou nativo), trate como qualquer outro card a partir da linha de planejamento (ignore a primeira condição da tabela).

Exibir a sugestão junto ao resumo do card (ver formato na Seção 4). Se nenhuma condição da tabela se aplicar com clareza, não forçar uma sugestão — registrar o estado observado e deixar a decisão para o usuário.

---

## Template de Saída — `cards/<KEY>/<KEY>.md`

```markdown
# <KEY> — <summary>

> **Fonte:** Jira (`gruposalta.atlassian.net`) — somente leitura. Não edite campos sincronizados diretamente aqui.  
> **Status:** <status> | **Tipo:** <issuetype> | **Prioridade:** <priority> | **Última sincronização:** <data e hora da execução da skill>

---

## 1. Contexto e Motivação

<description — reescrita em prosa clara se for ADF/JSON, preservando o conteúdo>

---

## 2. Critérios de Aceitação

<extrair da descrição ou listar "não especificado no card">

---

## 3. Subtarefas

| # | Key | Resumo | Status |
|---|-----|--------|--------|
<uma linha por subtarefa, ou "Nenhuma subtarefa" se vazio>

---

## 4. O Que Precisa Ser Feito

<síntese técnica do escopo de implementação com base na descrição>

---

## 5. Arquivos Prováveis a Modificar

<se possível inferir pelo contexto do card e do repositório, listar aqui>

---

## 6. Links

- Jira: https://gruposalta.atlassian.net/browse/<KEY>
<links extras encontrados na descrição>
```

---

## Template de Saída — `cards/BACKLOG/backlog.md`

```markdown
# Backlog — EFC

> Snapshot gerado em: <data e hora da execução>

---

| Key | Tipo | Prioridade | Resumo | Assignee |
|-----|------|------------|--------|----------|
<uma linha por card, ordenada por prioridade e depois por atualização>

---

_Total: <n> cards em backlog_
```

---

## Regras e Restrições

### Princípio fundamental

> **O Jira é a fonte de verdade. Esta skill é somente leitura em relação ao Jira.**  
> Nenhuma chamada de escrita (`createJiraIssue`, `editJiraIssue`, `addCommentToJiraIssue`, `transitionJiraIssue` etc.) deve ser feita em nenhuma circunstância.  
> Se o usuário pedir para atualizar algo no Jira, recusar e orientar a fazer diretamente pelo Jira.

### Regras de arquivo local

- **Não sobrescrever** `cards/<KEY>/<KEY>.md` sem confirmação explícita do usuário — o arquivo pode conter anotações manuais.
- **Não criar** arquivos para cards com status `Done` no modo completo, a menos que `--list` seja usado. No modo card único (`<KEY>`), criar/atualizar independentemente do status.
- Converter descrições em formato ADF (Atlassian Document Format) para Markdown legível antes de gravar.
- Preservar arquivos adicionais já existentes no diretório do card (ex: `*_QA.md`, `*_dev.md`).
- Usar o `cloudId` da instância `gruposalta.atlassian.net` sempre que disponível no contexto da sessão (evitar chamada redundante a `getAccessibleAtlassianResources`).

### Regras da sugestão de próximo comando (Seção 5)

- Nunca sugerir um comando de um repositório diferente do identificado para o card.
- Sempre verificar `cards/<KEY>/` local antes (ou junto) do repositório — é a fonte mais provável para quem segue o fluxo via `pde_salta`.
- Nunca sugerir `/executar-plano` sem antes confirmar que `Docs/plano-tecnico-<KEY>.md` existe **no repositório** (fluxo nativo). Se o plano existir apenas em `cards/<KEY>/<KEY>.tech.md`, não sugerir `/executar-plano` — informar o estado das fases sem comando associado.
- Não inventar números de fase ou status — se o arquivo de plano não puder ser lido, omitir a contagem de fases.
- Esta etapa é consultiva — nunca executa os comandos sugeridos nem abre branches/arquivos no repositório de destino, apenas lê o que já existe.

---

## Exemplos

### Exemplo 1 — Listar sem gravar

```
/jira_sync --list
```

Saída esperada:

```
Cards abertos atribuídos a você (5):

| Key       | Tipo       | Status        | Resumo                                              |
|-----------|------------|---------------|-----------------------------------------------------|
| EFC-6196  | Story      | Aguardando QA | Data de alocação do professor na tela de alocação   |
| EFC-5976  | Story      | Aguardando QA | Autonomia de Avaliação e Cálculo para Itinerários   |
| EFC-5855  | Bug        | Aberta        | Front - EstruturaPedagogica - Loop sem acesso       |
| EFC-3301  | Story      | Aberta        | Gerar Certificado de Conclusão em 1 arquivo         |
| EFC-5967  | Technology | Aberta        | Front:Filtro - campo sem cache no primeiro loading  |
```

### Exemplo 2 — Sincronizar card específico

```
/jira_sync EFC-6196
```

Cria `cards/EFC-6196/EFC-6196.md` com o contexto completo do card e, na Seção 5, inspeciona `c:/projects/estrutura-pedagogica/Docs/` para sugerir o próximo comando:

```
✔ EFC-6196  →  cards/EFC-6196/EFC-6196.md  (criado)
   repo: estrutura-pedagogica · próximo passo: /refinar-feature EFC-6196
```

### Exemplo 3 — Sincronizar todos

```
/jira_sync
```

Cria/atualiza um arquivo por card aberto, confirmando antes de sobrescrever qualquer existente, com o próximo passo sugerido em cada linha do resumo.

### Exemplo 4 — Card em andamento, plano técnico via fluxo nativo do repositório

```
/jira_sync EFC-5976
```

`cards/EFC-5976/EFC-5976.md` é atualizado. Como `Docs/plano-tecnico-EFC-5976.md` já existe **no repositório** `estrutura-pedagogica` (fluxo nativo, não via `pde_salta`) com 3 de 5 fases concluídas:

```
✔ EFC-5976  →  cards/EFC-5976/EFC-5976.md  (atualizado)
   repo: estrutura-pedagogica · próximo passo: /executar-plano EFC-5976 (3/5 fases concluídas)
```

### Exemplo 5 — Card em andamento, plano técnico via fluxo local (`pde_salta`)

```
/jira_sync EFC-7061
```

`cards/EFC-7061/EFC-7061.md` é atualizado. Como `cards/EFC-7061/EFC-7061.tech.md` já existe (gerado por `/planejar-implementacao` — nunca gravado no repositório), com 2 de 4 fases concluídas, não há `/executar-plano` equivalente para sugerir:

```
✔ EFC-7061  →  cards/EFC-7061/EFC-7061.md  (atualizado)
   repo: estrutura-pedagogica · plano técnico local: 2/4 fases concluídas (acompanhamento manual, sem comando de execução)
```

---

## Dependências

- MCP `Atlassian` configurado e autenticado (`mcp__claude_ai_Atlassian__*`)
- Permissão de escrita no diretório `cards/`
- `repository_map.md` atualizado (campo `Skills:`) para identificar o repositório e o fluxo de comandos disponível (Seção 5)
- Acesso de leitura ao repositório identificado em `c:/projects/<repo>/` (arquivos `Docs/` e `git`) para inspecionar o estado do fluxo nativo — opcional, a sugestão degrada graciosamente se o repositório não estiver acessível
- A inspeção de `cards/<KEY>/` (fluxo local: `.refinamento.md`, `.bug-report.md`, `.tech.md`) sempre roda, independentemente do repositório estar acessível

---

## Erros Esperados e Como Tratar

| Erro | Causa | Ação |
|------|-------|------|
| `cloudId` não encontrado | MCP Atlassian não autenticado | Orientar o usuário a autenticar via `/mcp` |
| Card não encontrado | KEY inválida ou sem permissão | Informar e encerrar sem criar arquivo |
| Descrição vazia | Card sem texto no Jira | Gravar arquivo com seção de contexto marcada como "Não preenchida no Jira" |
| Diretório `cards/` inexistente | Primeira execução | Criar o diretório automaticamente |
