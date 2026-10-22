# Planejar Implementação

Quando o usuário invocar este comando com uma chave de card Jira (ex.: `EFC-1234`), siga este processo para montar o plano técnico de implementação em fases.

**Este comando substitui o `/refinar-tech`.** Os arquivos de planejamento (plano técnico e critérios de aceite) **nunca são gravados no repositório de destino** — ficam sempre em `cards/{TICKET}/` dentro do `pde_salta`, junto com o card e o refinamento. O repositório de destino é usado apenas para leitura (exploração de código e convenções), nunca para escrita por este comando.

Como o `pde_salta` lida com cards de múltiplos repositórios, este comando sempre anuncia explicitamente qual repositório está sendo tratado na sessão atual (ver Passo 2) — nunca prossiga silenciosamente sem essa confirmação.

A pesquisa de contexto é delegada a um subagente para não poluir a conversa principal.

---

## Uso

```
/planejar-implementacao EFC-1234
```

---

## Processo

### 1. Verificar pré-requisitos locais

Verificar se existe `cards/EFC-{NUMERO}/EFC-{NUMERO}.md` — card principal (obrigatório). Se não existir, sugerir `/jira_sync EFC-{NUMERO}` e encerrar sem prosseguir.

Ler o arquivo integralmente e avaliar a seção "Critérios de Aceitação":

- **CAs já numerados** (ex.: CA-01, CA-02...) presentes diretamente no card — o spec já está completo. Não é necessário refinamento adicional.
- **CAs ausentes ou genéricos** ("não especificado no card" ou equivalente) — verificar se existe `cards/EFC-{NUMERO}/EFC-{NUMERO}.refinamento.md`. Se não existir, sugerir `/refinar-feature EFC-{NUMERO}` e encerrar sem prosseguir. Se existir, lê-lo integralmente.

Ler também `EFC-{NUMERO}.bug-report.md` se existir.

Definir `{CONTEUDO_REFINAMENTO}` como o conteúdo do arquivo de refinamento (ou bug-report) quando lido, ou vazio quando os CAs já vieram prontos do card principal (nesse caso, usar a Seção 2 do card principal como `{CONTEUDO_REFINAMENTO}` no prompt do subagente).

---

### 2. Identificar o repositório e anunciar a sessão

Ler `repository_map.md` na raiz do `pde_salta` e confirmar o repositório indicado no refinamento ou pelas palavras-chave do card, da mesma forma que `/jira_sync` e `/refinar-feature` já fazem.

Se nenhuma palavra-chave combinar com confiança, ou duas combinarem igualmente, **parar e perguntar ao usuário** qual repositório usar — não adivinhar.

**Assim que o repositório for confirmado, informar ao usuário antes de qualquer outra saída desta execução:**

> 📁 **Repositório desta sessão (somente leitura):** `<nome-do-repo>` → `c:/projects/<nome-do-repo>`

Esta linha deve aparecer sempre — inclusive em reexecuções do comando para o mesmo ticket — já que o ponto de partida (`pde_salta`) não é o repositório onde a implementação acontece, e ambiguidade sobre "qual repo estamos tratando" é exatamente o problema que este anúncio existe para eliminar. O repositório é explorado apenas para leitura — nenhum arquivo é criado ou alterado nele por este comando.

---

### 3. Invocar o subagente — handoff de design (opcional)

Se o card ou o refinamento descrever uma tela ou fluxo de frontend, verificar se há um anexo `.zip` de handoff de design no card Jira:

1. Buscar o ticket via MCP Atlassian (`getJiraIssue`, campo `attachment`) para listar os anexos.
2. Se não houver `.zip`, pular este passo e definir `{HANDOFF_DESIGN}` como "não disponível".
3. Se houver `.zip`, baixar e extrair dentro de `cards/{TICKET}/` (no `pde_salta` — nunca no repositório de destino):

```powershell
$auth = "$env:JIRA_USER`:$env:JIRA_API_TOKEN"
curl.exe -s -L -u $auth -o "cards/{TICKET}/handoff-{TICKET}.zip" "{ZIP_URL}"
New-Item -ItemType Directory -Force -Path "cards/{TICKET}/handoff-{TICKET}" | Out-Null
Expand-Archive -Path "cards/{TICKET}/handoff-{TICKET}.zip" -DestinationPath "cards/{TICKET}/handoff-{TICKET}/" -Force
Remove-Item "cards/{TICKET}/handoff-{TICKET}.zip"
```

(requer `JIRA_USER`/`JIRA_API_TOKEN` na sessão — ver `_scripts/jira-env.ps1`; se ausentes, informar ao usuário e pular este passo sem interromper o restante do fluxo)

4. Ler os arquivos extraídos, priorizando `.html` (telas/fluxos) → `.json` (tokens/componentes) → `.txt`/`.md` (anotações). Ignorar binários.
5. Definir `{HANDOFF_DESIGN}` como um resumo estruturado (telas, componentes, interações, restrições visuais) — a pasta `cards/{TICKET}/handoff-{TICKET}/` não deve ser removida, fica disponível para referência durante a implementação.

---

### 4. Invocar o subagente de pesquisa técnica

Dispare um subagente com o prompt abaixo, substituindo os valores reais de `{TICKET}`, `{REPOSITORIO}`, `{REPOSITORIO_PATH}`, `{CONTEUDO_CARD}`, `{CONTEUDO_REFINAMENTO}` e `{HANDOFF_DESIGN}`.

---

**Prompt do subagente:**

> Você é um agente de pesquisa técnica. Sua tarefa é explorar o código do repositório afetado (**somente leitura** — não crie, altere ou remova nenhum arquivo nele) e retornar contexto estruturado para que o agente principal possa redigir um plano técnico de implementação em fases — sem redigir o plano você mesmo.
>
> **Ticket:** `{TICKET}`
> **Repositório:** `{REPOSITORIO}` (`{REPOSITORIO_PATH}`) — explore apenas para leitura.
>
> **Card principal:**
> ```
> {CONTEUDO_CARD}
> ```
>
> **Refinamento** _(vazio se os CAs já vêm prontos do card principal acima)_**:**
> ```
> {CONTEUDO_REFINAMENTO}
> ```
>
> **Handoff de design** _("não disponível" se não houver)_**:**
> ```
> {HANDOFF_DESIGN}
> ```
>
> ---
>
> **Passo 1 — Ler convenções do repositório**
>
> Em `{REPOSITORIO_PATH}`:
> - Leia `CLAUDE.md` (raiz e subpastas relevantes como `backend/`, `frontend/`).
> - Leia `README.md` para entender a estrutura geral de camadas.
> - Registre padrões importantes: nomenclatura, camadas, como criar/alterar entidades, como funciona o schema de banco, como rodar testes, restrições conhecidas.
>
> ---
>
> **Passo 2 — Ler documentações das camadas**
>
> Antes de analisar o código, localize pastas `Docs/` dentro das camadas do repositório (busque por `**/Docs/*.md` a partir da raiz) e leia as que existirem. Essas pastas, quando presentes, contêm guias de padrões que devem ser seguidos na implementação. Se o repositório não tiver pastas `Docs/` em subcamadas, prossiga sem elas.
>
> ---
>
> **Passo 3 — Localizar código afetado**
>
> Se o `CLAUDE.md` do repositório indicar um ponto de entrada recomendado para localizar entidades, controllers ou módulos (ex.: uma classe/arquivo base de onde partem as demais camadas), use-o como ponto de partida. Caso contrário, use Grep/Glob com palavras-chave do tema da atividade (nome da entidade, da tela, do domínio de negócio) para localizar controllers, serviços, repositórios, componentes de frontend e testes relacionados.
>
> Com base nos Critérios de Aceite e na User Story do card/refinamento (e no handoff de design, se disponível):
> - Localize os arquivos que precisam ser criados ou alterados (entidades, repositórios, serviços, controllers, DTOs, mappings, frontend, scripts SQL).
> - Para cada arquivo relevante: leia o trecho afetado e entenda o comportamento atual.
> - Identifique dependências entre os arquivos (ex.: entidade precisa existir antes do mapping; script SQL precisa rodar antes do serviço).
> - Registre qualquer restrição ou convenção do CLAUDE.md que impacte a implementação.
>
> ---
>
> **Passo 4 — Identificar commands de padrão relevantes**
>
> Se a implementação envolver criação ou alteração dos padrões abaixo, e o repositório tiver o command correspondente em `.claude/commands/`, leia-o (apenas leitura) como fonte de verdade — não replique de memória:
> - **Nova entidade** → `criar-entidade.md`
> - **Novo filtro** → `criar-filtro.md`
> - **Nova exportação** → `criar-exportacao.md`
> - **Novo service (que não seja filtro nem exportação)** → `criar-service.md`
> - **Novos testes de integração** → `criar-testes.md`
> - **Tela nova ou alterada (frontend)** → `criar-automacao.md`
> - **Tela com side-panel, modal ou navegação que dispare requisições** → `_padrao-leitura-escrita.md`
>
> Verifique também se o repositório tem `.claude/commands/revisar-comentarios.md` — se tiver, registre isso para que a última fase do plano o referencie.
>
> Para cada command lido, registre quais fases do plano devem seguir aquele padrão. Se o repositório não tiver algum desses commands, ignore o padrão correspondente sem inventar um equivalente.
>
> ---
>
> **Retorno esperado:**
>
> ```
> STATUS: contexto_pronto
>
> TICKET: {TICKET}
> REPOSITORIO: {REPOSITORIO}
> REPOSITORIO_PATH: {REPOSITORIO_PATH}
>
> CONVENCOES_RELEVANTES:
> <lista numerada de convenções do CLAUDE.md que impactam esta implementação>
>
> ARQUIVOS_AFETADOS:
> <lista agrupada por camada com path relativo, ação (criar/modificar/remover) e descrição do que muda>
>
> COMMANDS_DE_PADRAO_RELEVANTES:
> <lista de commands lidos e quais fases do plano devem seguir cada um — ou "nenhum">
>
> TEM_REVISAR_COMENTARIOS: <sim/não>
>
> SUGESTAO_DE_FASES:
> <sequência sugerida de fases, considerando:
>  - arquitetura em camadas: Domain → Domain.Services → Infra → API → Frontend
>  - agrupamento de alterações relacionadas na mesma fase
>  - testes de integração sempre na última fase quando houver backend
>  - toda fase de frontend implica automação E2E (se o repositório tiver criar-automacao.md)
>  - se a atividade for exclusivamente frontend, omitir fases de backend mas manter a de automação E2E
>  - cada fase com nome, CAs que endereça (ou "infraestrutura"), e descrição do que fazer>
>
> RESTRICOES_E_RISCOS:
> <breaking changes, dados em produção, dependências externas, pontos de atenção>
> ```

---

### 5. Redigir o plano técnico

Com base no retorno do subagente, gere a proposta de plano técnico e **apresente ao usuário para aprovação** antes de gravar qualquer arquivo. Reforce no topo da apresentação o repositório explorado (reaproveitando o anúncio do Passo 2).

**Estrutura do plano técnico:**

```markdown
# Plano Técnico — {TICKET}

> Gerado em: <data>
> Repositório (somente leitura): `{REPOSITORIO}`

## Contexto

<Parágrafo curto ligando o refinamento ao que precisa ser feito tecnicamente.>

## Convenções aplicáveis

<Lista das convenções do CLAUDE.md que guiam esta implementação.>

## Critérios de Aceite

Consulte `{TICKET}.refinamento.md` (ou a Seção 2 do card principal, quando os CAs já vierem prontos do Jira).

## Fases

### Fase 1 — <nome> _(<CAs que endereça, ex: CA-01, CA-02 — ou "infraestrutura">)_

**Status:** pendente

<Descrição detalhada: arquivos a criar/alterar, lógica principal, padrão a seguir.
Se esta fase seguir um command específico (criar-entidade, criar-service, etc.), indicar explicitamente.>

---

### Fase 2 — <nome> _(<CAs>)_

**Status:** pendente

<Descrição>

---

_(repetir para todas as fases — testes de integração sempre na última fase)_

---

### Fase {N} — Revisão de comentários _(infraestrutura)_

**Status:** pendente

_(incluir apenas se `TEM_REVISAR_COMENTARIOS: sim`)_ Passo final, após todo o desenvolvimento e teste: executar `revisar-comentarios` para a feature, seguindo `.claude/commands/revisar-comentarios.md` em `{REPOSITORIO_PATH}`. Alcança a feature como um todo, não apenas os comentários introduzidos por este plano.

## Restrições e riscos

- <risco ou ponto de atenção>
```

> Linguagem técnica é bem-vinda aqui — este documento é para desenvolvedores.

---

### 6. Aguardar aprovação e gravar

Aguarde aprovação explícita do usuário. Se houver ajustes, revise e apresente novamente.

**Após aprovação**, gravar **dentro de `pde_salta`, nunca no repositório de destino**:

```
cards/{TICKET}/{TICKET}.tech.md
```

Salvar também os critérios de aceite em arquivo separado, no mesmo card:

```markdown
# Critérios de Aceite — {TICKET}

{lista dos CAs, numerados conforme o card/refinamento original}
```

Caminho: `cards/{TICKET}/{TICKET}.criterios-aceite.md`

Confirmar ao usuário os dois caminhos gerados (ambos dentro de `cards/{TICKET}/`) e reafirmar que nenhum arquivo foi criado ou alterado em `{REPOSITORIO_PATH}`.

---

## O que **não** fazer

- Não gravar nenhum arquivo dentro do repositório de destino (`{REPOSITORIO_PATH}`) — ele é usado apenas para leitura. Plano técnico e critérios de aceite sempre em `cards/{TICKET}/` no `pde_salta`.
- Não gravar o arquivo antes da aprovação explícita do usuário.
- Não prosseguir se o repositório não puder ser identificado com confiança — perguntar ao usuário em vez de adivinhar.
- Não prosseguir se o arquivo de refinamento não existir quando os CAs não vierem prontos do card.
- Não escrever de volta para o Jira.
- Não inventar convenções — basear-se exclusivamente nos `CLAUDE.md` e `Docs/` lidos no repositório de destino.
- Não omitir arquivos de camadas menos visíveis (migrations, scripts SQL, mappings EF).
- Não criar fases sem identificar o CA correspondente — ou marcar explicitamente como _(infraestrutura)_ quando não houver CA associado.
- Não colocar testes de integração em fases intermediárias — sempre na última fase.
- Não assumir que o repositório tem um command de padrão (`criar-automacao.md`, `revisar-comentarios.md`, etc.) sem confirmar sua existência — omitir a referência quando ausente.
