# Identificar e Documentar um Bug

Quando o usuário invocar este comando com uma chave de card Jira (ex.: `EFC-1234`), siga este processo.

A pesquisa de contexto é delegada a um subagente para não poluir a conversa principal.

---

## Uso

```
/identificar-bug EFC-1234
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

> Você é um agente de pesquisa de bugs. Sua tarefa é reunir o contexto técnico necessário para que o agente principal possa redigir um bug report e testes E2E — sem redigir nada você mesmo.
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
> Com base nas **Palavras-chave de cards** de cada repositório, identifique qual repo é mais provável para o bug relatado.
> Se houver ambiguidade, liste os dois candidatos mais prováveis.
>
> ---
>
> **Passo 2 — Avaliar se há informação suficiente**
>
> Com base no conteúdo do card, verifique se é possível entender:
> - O que o usuário esperava que acontecesse
> - O que acontece de fato (comportamento incorreto)
> - Em que condições o bug se manifesta
>
> Se faltar informação que impeça a análise, encerre retornando:
> ```
> STATUS: duvidas
> TICKET: {TICKET}
> DUVIDAS:
> - <dúvida 1>
> - <dúvida 2>
> ```
>
> ---
>
> **Passo 3 — Explorar o código no repositório identificado**
>
> No repositório identificado (caminho base: `c:/projects/<nome-do-repo>/`):
> - Leia o `README.md` e o `CLAUDE.md` (se existir) para entender convenções do projeto.
> - Explore o fluxo completo onde o bug ocorre: controllers, serviços, repositórios e frontend relacionados.
> - Entenda o comportamento esperado versus o comportamento com problema.
> - Consulte pastas `Docs/` nas camadas quando existirem.
>
> Se o repositório tiver skills listadas no `repository_map.md`, mencione quais são relevantes para a correção.
>
> ---
>
> **Retorno esperado (quando há informação suficiente):**
>
> ```
> STATUS: contexto_pronto
>
> TICKET: {TICKET}
> REPOSITORIO: <nome do repo identificado>
> REPOSITORIO_PATH: c:/projects/<nome>
> SKILLS_RELEVANTES: <lista ou "nenhuma">
>
> RESUMO_DO_BUG:
> <o que o usuário experimenta vs o que era esperado, em linguagem clara>
>
> CONTEXTO_DO_REPOSITORIO:
> <fluxo afetado, entidades/serviços/repositórios envolvidos, comportamento esperado vs observado, com referências a arquivos/pastas relevantes>
> ```

---

### 3. Processar o retorno do subagente

- **`duvidas`** — apresente as dúvidas ao usuário em uma única rodada. Só prossiga após esclarecimento.
- **`contexto_pronto`** — prossiga para as etapas seguintes.

---

### 4. Relatório do Bug — proposta para aprovação

Gere a proposta de bug report e **apresente ao usuário para aprovação** antes de gravar qualquer arquivo.

**Estrutura do bug report:**

```markdown
# Bug Report — {TICKET}

> Gerado em: <data>

## Contexto

<Parágrafo curto descrevendo o fluxo ou funcionalidade afetada.>

## Descrição do Problema

**Comportamento observado:** <o que o usuário vê ou experimenta>  
**Comportamento esperado:** <o que deveria acontecer>

## Passos para Reprodução

1. <passo 1 em linguagem de negócio>
2. <passo 2>
3. ...

## Impacto

<Quais perfis de usuário são afetados. Em quais condições o bug se manifesta (ex.: apenas em determinada rede, série, etapa).>

## Repositório identificado

**Repo:** `<nome>`  
**Skills relevantes:** <lista ou "nenhuma">
```

> Sem termos técnicos: sem endpoints, nomes de classe, flags booleanas, campos de banco ou status HTTP.

---

### 5. Testes E2E — proposta para aprovação

Após aprovação do bug report, gere a proposta de testes E2E e **apresente ao usuário para aprovação** antes de gravar qualquer arquivo.

**Estrutura dos testes E2E:**

```gherkin
Feature: <nome da funcionalidade afetada>

  Background:
    Given <pré-condição comum>

  Scenario: Reprodução do bug (regressão)
    Given ...
    When ...
    Then ...

  Scenario: Caminho feliz após a correção
    ...

  Scenario: <variação de permissão ou caso de borda relacionado>
    ...
```

> Em linguagem de negócio — sem status HTTP, nomes de classe, flags booleanas, nomes de campo de banco.

---

### 6. Aguardar aprovação e gravar

Cada entrega (bug report e testes E2E) tem seu ciclo independente de aprovação.

**Após aprovação do bug report**, gravar em:
```
cards/{TICKET}/{TICKET}.bug-report.md
```

**Após aprovação dos testes E2E**, incluí-los no mesmo arquivo (seção adicional ao final) ou em arquivo separado conforme preferência do usuário.

Confirmar ao usuário o caminho do arquivo gerado.

---

## O que **não** fazer

- Não escrever de volta para o Jira — os cards locais são read-only.
- Não gravar arquivos antes da aprovação do usuário.
- Não usar linguagem técnica no bug report e nos testes E2E.
- Não especular sobre a causa raiz sem base na exploração do subagente.
- Não misturar a descrição do bug (linguagem de negócio) com análise técnica no mesmo documento.
- Não consolidar as aprovações do bug report e dos testes em uma única rodada — são entregas independentes.
