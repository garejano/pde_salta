# Skill: spdd-refine

## Descrição

Pipeline completo SPDD para um card Jira local: executa o refinamento de negócio e o plano técnico (se ainda não existirem), depois gera o `spdd-story` e o `spdd-canvas` (REASONS Canvas) prontos para guiar a implementação.

Cada etapa exige aprovação explícita antes de gravar qualquer arquivo.

---

## Uso

```
/spdd-refine EFC-1234
```

---

## Fluxo Geral

```
[1] Verificar card
[2] Refinamento     → EFC-xxxx.refinamento.md   (pula se já existir)
[3] Plano técnico   → EFC-xxxx.tech.md           (pula se já existir)
[4] SPDD Story      → EFC-xxxx.spdd-story.md
[5] SPDD Canvas     → EFC-xxxx.spdd-canvas.md
```

---

## Processo

### 1. Verificar o card

Verificar se existe `cards/EFC-{NUMERO}/EFC-{NUMERO}.md`.

- **Não existe** → informar que o card não foi sincronizado, sugerir `/jira_sync` e encerrar.
- **Existe** → ler o arquivo e listar os demais arquivos presentes na pasta.

Registrar quais documentos já existem:
- `[ ] EFC-{N}.refinamento.md`
- `[ ] EFC-{N}.tech.md`
- `[ ] EFC-{N}.spdd-story.md`
- `[ ] EFC-{N}.spdd-canvas.md`

---

### 2. Refinamento de negócio

**Se `EFC-{N}.refinamento.md` já existir:** ler o arquivo e pular para o passo 3.

**Se não existir:** disparar um subagente de pesquisa com o prompt abaixo.

---

**Prompt do subagente de refinamento:**

> Você é um agente de pesquisa. Sua tarefa é reunir contexto técnico para que o agente principal redija um refinamento de negócio — sem redigir o documento você mesmo.
>
> **Ticket:** `{TICKET}`
>
> **Conteúdo do card:**
> ```
> {CONTEUDO_CARD}
> ```
>
> **Passo 1 — Identificar o repositório**
> Leia `repository_map.md` na raiz do `pde_salta`. Com base nas palavras-chave, identifique o repositório mais provável para este card.
>
> **Passo 2 — Explorar o repositório**
> No repositório identificado:
> - Leia `CLAUDE.md` e `README.md`.
> - Explore 1–2 níveis de pastas para entender a área relacionada ao card.
> - Foque no que o sistema já faz nessa área.
>
> **Retorno esperado:**
> ```
> STATUS: contexto_pronto
> TICKET: {TICKET}
> REPOSITORIO: <nome>
> RESUMO_DO_CARD: <resumo do card em linguagem clara>
> CONTEXTO_DO_REPOSITORIO: <o que o sistema já faz na área do card, com referências a arquivos>
> SKILLS_RELEVANTES: <lista ou "nenhuma">
> ```
> Se o card for vago demais, retornar `STATUS: spec_insuficiente` com a lista de dúvidas.

---

**Após retorno do subagente:**

- `spec_insuficiente` → apresentar dúvidas ao usuário e aguardar esclarecimento antes de prosseguir.
- `contexto_pronto` → redigir o refinamento no formato abaixo e **apresentar ao usuário para aprovação**.

**Formato do refinamento:**

```markdown
# Refinamento — {TICKET}

> Gerado em: <data>

## Contexto

<Parágrafo curto descrevendo o estado atual e a lacuna que o card preenche.>

## User Story

**Como** <perfil>,
**quero** <ação>,
**para que** <benefício>.

## Critérios de Aceite

- **CA-01:** <em linguagem de negócio — sem termos técnicos>
- **CA-02:** ...

## Regras de Negócio

| # | Condição | Comportamento |
|---|----------|---------------|
| RN-01 | ... | ... |

## Testes E2E (Gherkin)

```gherkin
Feature: <nome>

  Background:
    Given <pré-condição>

  Scenario: <caminho feliz>
    ...
```

## Repositório identificado

**Repo:** `<nome>`
**Skills relevantes:** <lista ou "nenhuma">
```

Aguardar aprovação. Após aprovação, gravar em `cards/{TICKET}/{TICKET}.refinamento.md`.

---

### 3. Plano técnico

**Se `EFC-{N}.tech.md` já existir:** ler o arquivo e pular para o passo 4.

**Se não existir:** disparar um subagente de pesquisa técnica com o prompt abaixo.

---

**Prompt do subagente técnico:**

> Você é um agente de pesquisa técnica. Explore o repositório afetado e retorne contexto estruturado para que o agente principal redija um plano técnico em fases — sem redigir o plano você mesmo.
>
> **Ticket:** `{TICKET}`
>
> **Card:**
> ```
> {CONTEUDO_CARD}
> ```
>
> **Refinamento:**
> ```
> {CONTEUDO_REFINAMENTO}
> ```
>
> **Passo 1 — Identificar o repositório**
> Confirme o repositório via `repository_map.md` na raiz do `pde_salta`.
>
> **Passo 2 — Ler convenções**
> No repositório: leia `CLAUDE.md` (raiz e subpastas relevantes) e `README.md`. Registre padrões: nomenclatura, camadas, schema de banco, restrições.
>
> **Passo 3 — Ler documentações de camada**
> Leia as pastas `Docs/` nas camadas do repositório (ex: `backend/*/Docs/`) — contêm guias de padrão que devem ser seguidos.
>
> **Passo 4 — Localizar código afetado**
> Com base nos CAs e na user story: localize arquivos a criar/alterar/remover por camada. Para cada arquivo relevante: leia o trecho afetado e entenda o comportamento atual. Identifique dependências entre arquivos.
>
> **Passo 5 — Commands de padrão relevantes**
> Se a implementação envolver os padrões abaixo, leia o command correspondente no repositório:
> - Nova entidade → `.claude/commands/criar-entidade.md`
> - Novo filtro → `.claude/commands/criar-filtro.md`
> - Nova exportação → `.claude/commands/criar-exportacao.md`
> - Novo service → `.claude/commands/criar-service.md`
> - Novos testes → `.claude/commands/criar-testes.md`
>
> **Retorno esperado:**
> ```
> STATUS: contexto_pronto
> TICKET: {TICKET}
> REPOSITORIO: <nome>
> REPOSITORIO_PATH: c:/projects/<nome>
> CONVENCOES_RELEVANTES: <lista numerada>
> ARQUIVOS_AFETADOS: <por camada: path, ação, descrição>
> COMMANDS_DE_PADRAO_RELEVANTES: <lista ou "nenhum">
> SUGESTAO_DE_FASES: <sequência de fases com nome, CAs e descrição>
> RESTRICOES_E_RISCOS: <breaking changes, dados em produção, dependências externas>
> ```

---

**Após retorno do subagente:**

Redigir o plano técnico no formato abaixo e **apresentar ao usuário para aprovação**.

**Formato do plano técnico:**

```markdown
# Plano Técnico — {TICKET}

> Gerado em: <data>

## Contexto

<Parágrafo ligando o refinamento ao que precisa ser feito tecnicamente.>

## Convenções aplicáveis

<Lista das convenções do CLAUDE.md relevantes para esta implementação.>

## Critérios de Aceite

<CAs do refinamento, numerados.>

## Fases

### Fase 1 — <nome> _(<CAs ou "infraestrutura">)_

**Status:** pendente

<Arquivos a criar/alterar, lógica principal, padrão a seguir. Indicar command de padrão quando aplicável.>

---

_(repetir para todas as fases — testes sempre na última fase)_

## Restrições e riscos

- <risco>

## Repositório identificado

**Repo:** `<nome>`
```

Aguardar aprovação. Após aprovação, gravar em `cards/{TICKET}/{TICKET}.tech.md`.

---

### 4. Gerar SPDD Story

Com base em `EFC-{N}.refinamento.md` e `EFC-{N}.tech.md` (já lidos), gerar o documento de stories no formato abaixo.

**Mapeamento das fontes:**

| Campo do spdd-story | Origem |
|---------------------|--------|
| Contexto / Motivação | `refinamento.md` → seção Contexto |
| User Story | `refinamento.md` → User Story |
| Critérios de aceite | `refinamento.md` → Critérios de Aceite |
| Regras de negócio | `refinamento.md` → Regras de Negócio |
| Fora de escopo | `tech.md` → seções marcadas como sem alteração esperada |
| Camadas impactadas | `tech.md` → Arquivos Afetados (deduzir quais camadas) |
| Riscos | `tech.md` → Restrições e riscos |
| Ordem de entrega | `tech.md` → Fases (com dependência entre elas) |

**Formato do spdd-story:**

```markdown
# SPDD — Story | {TICKET}

> Etapa 1 do workflow SPDD.
> Template base: `templates/spdd-estrutura-pedagogica/story.md`

---

## Contexto

**Card Jira:** {TICKET}
**Título:** <título do card>
**Épico / Módulo:** <épico ou área>
**Repositório:** <nome do repo>
**Data:** <data atual>
**Tipo:** <Feature / Bug / Technology>

**Descrição do negócio:**
<parágrafo do refinamento>

**Motivação:**
<por que agora — do contexto do card>

---

## User Stories

### Story 1 — <título>

**Como** ...,
**quero** ...,
**para que** ...

**Critérios de aceite:**
- [ ] CA-01 — ...
- [ ] CA-02 — ...

**Fora de escopo:**
- ...

**Camadas impactadas:** `[x/] Domain` `[x/] Domain.Services` `[x/] Infra` `[x/] Api` `[x/] Frontend` `[x/] scripts-db-pedagogico`

---

## Regras de Negócio

| # | Condição | Comportamento |
|---|----------|---------------|

---

## Checklist INVEST

| Critério | Story 1 |
|----------|---------|
| Independent | ✅/⚠️ + justificativa |
| Negotiable | ✅/⚠️ |
| Valuable | ✅/⚠️ |
| Estimable | ✅/⚠️ |
| Small | ✅/⚠️ |
| Testable | ✅/⚠️ |

---

## Ordem de Entrega

<fases do tech.md com dependência explícita>

---

## Riscos Identificados

| Risco | Impacto | Mitigação |
|-------|---------|-----------|

---

## Próximo passo

Preencher `{TICKET}.spdd-canvas.md`.
```

**Apresentar ao usuário para aprovação.** Após aprovação, gravar em `cards/{TICKET}/{TICKET}.spdd-story.md`.

---

### 5. Gerar SPDD Canvas (REASONS Canvas)

Com base em todos os documentos já lidos, gerar o REASONS Canvas.

**Mapeamento das fontes:**

| Seção | Origem |
|-------|--------|
| **R — Requirements** | `refinamento.md` (problema, CAs, fora de escopo) + `spdd-story.md` (DoD) |
| **E — Entities** | `tech.md` (entidades e interfaces na fase Domain) |
| **A — Approach** | `tech.md` (contexto, convenções, decisões de design entre fases) |
| **S — Structure** | `tech.md` (Arquivos Afetados → tabela por camada) |
| **O — Operations** | `tech.md` (Fases → converter em operações atômicas com código de referência e critério de conclusão) |
| **N — Norms** | `templates/spdd-estrutura-pedagogica/reasons-canvas.md` (seção N pré-preenchida) + convenções do `tech.md` |
| **S — Safeguards** | `templates/spdd-estrutura-pedagogica/reasons-canvas.md` (seção S pré-preenchida) + riscos do `tech.md` |

**Regras para a seção O — Operations:**

- Cada fase do `tech.md` pode gerar uma ou mais operações — quebrar na menor unidade que seja compilável e testável de forma independente.
- Cada operação deve conter:
  - `**Arquivo(s):**` com path relativo
  - Trecho de código de referência (`// antes` / `// depois` quando aplicável)
  - `**Critério de conclusão:**` objetivo e verificável
- Operações de infraestrutura (script SQL, remoção de arquivo) vêm antes das operações de código.
- Testes sempre na(s) última(s) operação(ões).

**Formato do spdd-canvas:**

Seguir a estrutura de `templates/spdd-estrutura-pedagogica/reasons-canvas.md` integralmente, preenchendo todas as seções. As seções N e S devem conter as norms e safeguards do template base mais quaisquer restrições específicas do card presentes no `tech.md`.

**Apresentar ao usuário para aprovação.** Após aprovação, gravar em `cards/{TICKET}/{TICKET}.spdd-canvas.md`.

---

### 6. Resumo final

Ao concluir todas as etapas, exibir:

```
SPDD pipeline concluído para {TICKET}

Documentos gerados:
  ✔ cards/{TICKET}/{TICKET}.refinamento.md
  ✔ cards/{TICKET}/{TICKET}.tech.md
  ✔ cards/{TICKET}/{TICKET}.spdd-story.md
  ✔ cards/{TICKET}/{TICKET}.spdd-canvas.md

Próximo passo: usar {TICKET}.spdd-canvas.md como prompt de geração de código,
executando as Operations uma a uma.
```

Documentos que já existiam antes da execução devem aparecer com `(já existia)`.

---

## O que **não** fazer

- Não gravar nenhum arquivo antes da aprovação explícita do usuário na etapa correspondente.
- Não pular a etapa de refinamento se o `.refinamento.md` não existir — o Canvas depende dele.
- Não inventar convenções técnicas — basear-se exclusivamente nos `CLAUDE.md`, `Docs/` e `tech.md` lidos.
- Não escrever de volta para o Jira.
- Não consolidar aprovação de múltiplos documentos em uma única rodada — cada documento tem sua aprovação.
- Não omitir as seções N e S do Canvas — sempre incluir com o conteúdo do template base mesmo que o card não acrescente nada específico.
