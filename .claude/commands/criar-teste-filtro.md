# Criar Teste de Filtro

Gera um teste Playwright (`.spec.ts`) para um filtro do `estrutura-pedagogica`, a partir da sua
`FilterConfig`. O módulo `shared/filtro` renderiza qualquer filtro de forma previsível a partir da
config — então o teste também pode ser derivado dela quase mecanicamente, sem precisar inspecionar
manualmente cada campo.

Base teórica completa: `projetos/play_testes/guia-testes-filtro.md` (mapeamento `FieldType` →
componente → testid, cascata, `sideEffects`, storage) e `projetos/play_testes/guia-testes-playwright-dia-letivo-extra.md`
(bypass de auth, convenção geral de seletor, comandos de execução). Leia os dois antes de gerar
qualquer teste — este comando assume que você já sabe o conteúdo deles.

Repositório alvo: `C:/projects/estrutura-pedagogica/frontend/`

---

## Input esperado

Peça ao usuário o que estiver faltando antes de gerar qualquer arquivo:

- **Config do filtro** — caminho do arquivo (ex.:
  `app/features/configurador-periodos-letivos/dia-letivo-extra/listar/filtro_dia_letivo_extra.ts`)
  ou o objeto `FilterConfig` colado diretamente.
- **Tela onde o filtro é usado** — caminho do componente de listagem (`.ts`/`.html`) que renderiza
  `<filtro [config]="...">`. Necessário para saber a rota real (`page.goto`) e o `service_name` →
  endpoint real de cada campo.
- **Dados de exemplo** *(opcional)* — se o usuário apontar um card em `cards/<EFC-xxx>/` com casos
  de uso/dados de teste, use-os para montar os mocks em vez de inventar valores genéricos.

---

## Processo

### 1. Ler a config

Leia o arquivo apontado (ou o objeto colado). Extraia:
- `id` do filtro (base dos testids `filtro-<id>-*`)
- `showSearchField`, `searchPlaceholder`
- Para cada item de `filters[]`: `key`, `field_type`, `type`, `required`, `service_name`/`url`,
  `autostart`, `selectFirst`, `watch_list`, `dependency_list`, `min`/`max` (se `Date`)

Ignore propriedades que não estão documentadas em `guia-testes-filtro.md` seção 1 (`id` duplicado
por campo, `store`, `disabledLabel`, etc. — resíduo legado sem efeito).

### 2. Ler a tela que usa o filtro

Leia o `.ts`/`.html` do componente informado. Extraia:
- A rota real (via o arquivo de rotas do módulo — não assuma, confirme lendo `*.routes.ts` ou o
  módulo de rotas).
- O nome do `[service]` passado pro `<filtro>`, e o arquivo desse serviço — para cada
  `service_name` de campo, ache o método correspondente e a URL/verbo HTTP reais (mesmo processo
  usado em `guia-testes-playwright-dia-letivo-extra.md` seção 5 — nunca invente endpoint).
- O nome do método ligado a `(submit)` — só para saber o que a tela faz com o resultado (não é
  necessário para o teste do filtro em si, que testa até o `submit` disparar).

### 3. Mapear cada campo para sua interação

Para cada `field_type`, use a tabela de `guia-testes-filtro.md` seção 2. Monte, por campo:
- Testid do trigger/input: sempre `<key>-trigger` (Select/MultiSelect/MiniSelect) ou
  `input-<key>` (Date/Text/Checkbox/Toggle/Number/Textarea/Time/Money/File) ou sem testid no host
  (CustomRadio/RadioField — só as opções têm, `<key>-<option.hash>`).
- Se `field_type` for `FieldType.TagToggle`: **não gere seletor por testid**. Marque esse campo
  como pendência no plano (seção 5) e sugira adicionar `data-testid` ao `TagToggleComponent`
  primeiro (mesmo padrão dos outros: `[attr.data-testid]="fieldId ? fieldId + '-trigger' : null"`
  no host, seguindo `plano-refatoracao-testabilidade.md`).

### 4. Montar a árvore de cascata

A partir de `watch_list`/`dependency_list` de cada campo, monte a ordem de preenchimento (campos
sem `dependency_list` primeiro, depois os que dependem deles, etc.) e gere, para cada campo com
`dependency_list` não vazio:
- Um teste "fica desabilitado até a(s) dependência(s) serem preenchidas"
- Um teste "recarrega ao mudar o campo observado" (se também tiver `watch_list`)

Se houver `sideEffects` na config, gere um teste por efeito (seção 5 do guia).

### 5. Apresentar o plano e aguardar confirmação

Antes de escrever qualquer arquivo, mostre:
- A rota real que será usada no `page.goto`
- A lista de endpoints que serão mockados (método + URL) e de onde veio cada um
- A árvore de cascata montada (ordem de preenchimento, quais testes de dependência serão gerados)
- Campos `TagToggle` (ou qualquer outro sem testid confirmado) como pendência, se houver
- Onde o arquivo será salvo: `tests/e2e/<feature-kebab>/filtro.spec.ts` (ou nome combinado com o
  usuário se já existir um spec para essa tela)

**Aguarde confirmação do usuário antes de gerar o arquivo.**

### 6. Gerar o spec

Estrutura do arquivo (mesmo padrão de `guia-testes-playwright-dia-letivo-extra.md` seção 6):

```ts
import { test, expect, Page } from '@playwright/test';

// A sessão já vem autenticada via storageState (projeto "e2e", dependente do projeto "setup" —
// ver guia-testes-playwright-dia-letivo-extra.md seção 3, fluxo real via SaltaId/Eleva ID).
// Não gerar nenhum código de bypass de autenticação aqui.

// ── dados de mock — um por endpoint real identificado no passo 2 ──
const <CAMPO_1> = { hash: '...', descricao: '...' };
// ...

// ── mocks de API — um por endpoint real, nunca inventado ──
async function mockFiltro(page: Page) { /* page.route por endpoint */ }

async function irParaListagem(page: Page) {
  await mockFiltro(page);
  await page.goto('<rota real>');
}

test.describe('<Tela> › Filtro', () => {
  test('aplica o filtro com todos os campos obrigatórios', async ({ page }) => { /* ... */ });

  // um teste por nível de cascata (passo 4)
  // um teste por sideEffect (se houver)
  // teste de busca livre (se showSearchField)
  // teste de persistência (seção 6 do guia) — sempre limpar localStorage antes, exceto neste
});
```

Se o `.env`/usuário e2e ainda não estiverem provisionados no repositório-alvo quando esta skill for
usada, sinalize isso no plano (passo 5) como pré-requisito — não gerar um bypass local como
substituto silencioso; a receita real (guia base, seção 3) já existe e deve ser seguida.

### 7. Resumo final

Liste: arquivo gerado, quantos testes, quais endpoints foram mockados, e quaisquer pendências
(campos sem testid, endpoint que não foi possível confirmar lendo o serviço — nesse caso, marque
com um comentário `// TODO: confirmar endpoint real` em vez de inventar).

---

## O que **não** fazer

- Não gerar seletor `data-testid` para `FieldType.TagToggle` (ou qualquer campo sem testid
  confirmado) — sinalizar como pendência, nunca chutar.
- Não inventar endpoint de API — sempre ler o serviço real (`service_name`/`url` → arquivo de
  serviço → método → URL/verbo).
- Não escrever o arquivo de teste sem antes mostrar o plano (rota, endpoints, cascata) e obter
  confirmação.
- Não usar seletor CSS "no chute" (`.locator('table.lista, [class*="lista"]')`) — se um elemento
  não tiver testid nem role acessível, isso é sinal de que falta instrumentação no componente, não
  motivo para escrever um seletor frágil.
- Não usar `page.waitForTimeout` fixo para esperar cascata/debounce — usar `expect.poll` ou
  `expect(locator).toBeEnabled()`/`toHaveValue()` com retry automático.
- Não assumir que `useStorage`/persistência entre testes é inofensivo — sempre `localStorage.clear()`
  no início de cada teste que não seja especificamente sobre persistência.
- Não gerar código de bypass de autenticação (fake `localStorage` + mock do endpoint de validação)
  — isso foi superado pela receita real via SaltaId (guia base, seção 3). A sessão já vem pronta
  via `storageState`; se ela não estiver disponível no ambiente, sinalizar como pendência de
  infraestrutura, não contornar com um bypass local.
