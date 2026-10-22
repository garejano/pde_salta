# Refinar Feature

Quando o usuário invocar este comando com uma chave de card Jira (ex.: `EFC-1234`), siga este processo.

A pesquisa de contexto é delegada a um subagente para não poluir a conversa principal.

---

## Uso

```
/refinar-feature EFC-1234
```

---

## Processo

### 1. Verificar se o card existe localmente

Verificar se existe a pasta `cards/EFC-{NUMERO}/` no repositório `salta_brain`.

- Se **não existir**: informar ao usuário que o card não foi sincronizado e sugerir rodar `/jira_sync` antes. Encerrar.
- Se **existir**: listar os arquivos presentes na pasta e ler o arquivo principal (o `.md` sem sufixo, ex.: `EFC-1234.md`).

---

### 2. Invocar o subagente de pesquisa

Dispare um subagente com o prompt abaixo, substituindo `{TICKET}` e `{CONTEUDO_CARD}` pelos valores obtidos.

---

**Prompt do subagente:**

> Você é um agente de pesquisa. Sua tarefa é reunir o contexto técnico necessário para que o agente principal possa redigir uma User Story refinada e testes E2E — sem redigir nada você mesmo.
>
> **Ticket:** `{TICKET}`
>
> **Conteúdo do card local:**
> ```
> {CONTEUDO_CARD}
> ```
>
> ---
>
> **Passo 1 — Identificar o repositório**
>
> Leia `repository_map.md` na raiz do `pde_salta`.
> Com base nas **Palavras-chave de cards** de cada repositório, identifique qual repo é mais provável para a implementação deste card.
> Se houver ambiguidade, liste os dois candidatos mais prováveis.
>
> ---
>
> **Passo 2 — Explorar o repositório identificado**
>
> No repositório identificado (caminho base: `c:/projects/<nome-do-repo>/`):
> - Leia o `README.md` e o `CLAUDE.md` (se existir) para entender convenções do projeto.
> - Explore 1–2 níveis de pastas para entender a estrutura geral.
> - Foque no que o sistema já faz na área relacionada ao card — não liste todos os arquivos.
>
> Se o repositório tiver skills listadas no `repository_map.md`, mencione quais são relevantes para esta implementação.
>
> ---
>
> **Retorno esperado:**
>
> ```
> STATUS: contexto_pronto
>
> TICKET: {TICKET}
> REPOSITORIO: <nome do repo identificado>
> REPOSITORIO_PATH: c:/projects/<nome>
> SKILLS_RELEVANTES: <lista ou "nenhuma">
>
> RESUMO_DO_CARD:
> <resumo do conteúdo do card local em linguagem clara>
>
> CONTEXTO_DO_REPOSITORIO:
> <o que o sistema já faz na área da atividade, com referências a arquivos/pastas relevantes>
> ```
>
> Se o conteúdo do card for vago demais para embasar uma User Story, retornar:
> ```
> STATUS: spec_insuficiente
> DUVIDAS:
> - <dúvida 1>
> - <dúvida 2>
> ```

---

### 3. Processar o retorno do subagente

- **`spec_insuficiente`** — apresente as dúvidas ao usuário em uma única rodada. Só prossiga após esclarecimento.
- **`contexto_pronto`** — prossiga para as etapas seguintes.

---

### 4. Redigir o refinamento

Com base no contexto retornado, gere a proposta de refinamento e **apresente ao usuário para aprovação** antes de gravar qualquer arquivo.

**Estrutura do documento de refinamento:**

```markdown
# Refinamento — {TICKET}

> Gerado em: <data>

## Contexto

<Parágrafo curto descrevendo o estado atual do sistema e a lacuna que o card preenche.>

## User Story

**Como** <perfil de usuário>,  
**quero** <o que deseja fazer>,  
**para que** <benefício ou objetivo>.

## Critérios de Aceite

- **CA-01:** <critério em linguagem de negócio>
- **CA-02:** <critério em linguagem de negócio>
- ...

> Sem termos técnicos (sem endpoints, DTOs, nomes de campo de banco, status HTTP).

## Regras de Negócio

| # | Condição | Comportamento |
|---|----------|---------------|
| RN-01 | <condição> | <comportamento esperado> |

*(Omitir se não houver variações de comportamento por estado/permissão)*

## Testes E2E (Gherkin)

```gherkin
Feature: <nome da funcionalidade>

  Background:
    Given <pré-condição comum>

  Scenario: <caminho feliz>
    Given ...
    When ...
    Then ...

  Scenario: <variação ou caso de borda>
    ...
```

## Repositório identificado

**Repo:** `<nome>`  
**Skills relevantes:** <lista ou "nenhuma">
```

---

### 5. Aguardar aprovação e gravar

Aguarde aprovação explícita do usuário. Se houver ajustes, revise e apresente novamente.

**Após aprovação**, gravar o arquivo em:

```
cards/{TICKET}/{TICKET}.refinamento.md
```

Confirmar ao usuário o caminho do arquivo gerado.

---

## O que **não** fazer

- Não escrever de volta para o Jira — os cards locais são read-only.
- Não criar o refinamento sem aprovação explícita do usuário.
- Não incluir linguagem técnica nos critérios de aceite ou testes E2E.
- Não criar plano de implementação técnico — isso é responsabilidade de outras skills.
- Não consolidar aprovação da User Story e dos testes E2E em uma única rodada — são entregas independentes.
