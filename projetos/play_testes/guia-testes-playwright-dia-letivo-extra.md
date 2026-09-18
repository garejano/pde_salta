repositório: estrutura-pedagogica
base: readme.md (convenção de `data-testid`), plano-refatoracao-testabilidade.md

## Objetivo

Guia prático — não só teoria — de como criar testes automatizados (Playwright) no
`estrutura-pedagogica`, usando como exemplo real a tela **Configurador de Períodos Letivos →
Dia Letivo Extra → Listar**, cobrindo o fluxo de **filtro**, **criar** e **editar**.

Escrito para quem tem pouco ou nenhum conhecimento de Playwright — cada conceito é explicado na
primeira vez que aparece.

---

## 1. O que é um teste E2E (e o que já existe no projeto)

Um teste **E2E ("end-to-end")** abre um navegador de verdade, clica, digita e navega como um
usuário faria — e depois verifica ("assert") se o resultado esperado apareceu na tela. Diferente
de um teste unitário (que testa uma função isolada), o E2E testa o fluxo completo: componente +
serviço + chamada HTTP + roteamento.

O `estrutura-pedagogica` já usa dois tipos de teste, e ambos já estão configurados — não precisa
instalar nada:

| Tipo | Ferramenta | Onde ficam | Comando |
|---|---|---|---|
| Unitário | Jest | `frontend/tests/unit/<feature>/` | `npm test` |
| E2E | **Playwright** | `frontend/tests/e2e/<feature>/` | `npm run test:e2e` |

Este guia é sobre o segundo.

### Onde estão as peças do Playwright no projeto

- `frontend/package.json` — scripts `test:e2e` e `test:e2e:auth`, dependência `@playwright/test`.
- `frontend/playwright.config.ts` — configuração central:
  ```ts
  export default defineConfig({
    testDir: 'tests/e2e',
    projects: [
      { name: 'setup', testDir: 'tests/setup', testMatch: '*.setup.ts' },
      {
        name: 'e2e',
        testDir: 'tests/e2e',
        dependencies: ['setup'],
        use: {
          ...devices['Desktop Chrome'],
          baseURL: 'https://localhost/estrutura-pedagogica',
          ignoreHTTPSErrors: true,
          storageState: 'tests/setup/.auth/user.json',
        },
      },
    ],
  });
  ```
  Ponto importante: o `baseURL` aponta para **o build servido pelo backend .NET**
  (`https://localhost/estrutura-pedagogica`), não para o `ng serve` da porta 4200. Ou seja, para
  rodar os testes você precisa ter o build gerado (`npm run dev` grava em
  `../backend/EstruturaPedagogica.Api/wwwroot/`) e o backend rodando localmente.
- `frontend/tests/e2e/<feature>/*.spec.ts` — os arquivos de teste em si (um arquivo por tela/fluxo,
  convenção `*.spec.ts`).

---

## 2. Aviso importante — o que já existe para `dia-letivo-extra` está desatualizado

Já existem dois arquivos em `frontend/tests/e2e/dia-letivo-extra/`:
`listar.spec.ts` e `formulario.spec.ts`. **Não use eles como referência sem revisar** — na
auditoria para este guia encontrei três problemas reais:

1. **URL errada.** Os specs fazem `page.goto('/dia-letivo-extra/listar')`, mas a rota real é
   `/configurador-periodos-letivos/dia-letivo-extra/listar` (o módulo foi reorganizado, ver
   `plano-refatoracao-testabilidade.md`, achado do lote 2).
2. **`formulario.spec.ts` assume que o formulário abre como modal.** Não abre — `abrirFormulario()`
   e `editarItem()` fazem `router.navigate(['/configurador-periodos-letivos/dia-letivo-extra',
   'novo'|'editar', hash])`, ou seja, é **navegação de página inteira**, não um modal.
3. **Seletores "chutados" com várias alternativas separadas por vírgula**, tipo:
   ```ts
   page.locator('table.lista, .lista-resultado, [class*="lista"]')
   ```
   Esse padrão é um sintoma de "escrevi sem rodar contra a tela de verdade". Este guia usa os
   `data-testid` reais que já existem nos componentes (ver seção 4).

Também encontrei que **`tests/setup/auth.setup.ts` não corresponde ao login real** — ele tenta
preencher campos de e-mail/senha em `/auth/eleva-id`, mas essa rota só processa um SSO externo
(Eleva ID) via query string `access_token`; não existe formulário de login dentro do app Angular
para automatizar desse jeito. A seção 3 traz a receita **real e já validada** para corrigir isso
(veio de outro time que já resolveu o mesmo problema num app que usa o mesmo provedor de
identidade, SaltaId/Eleva ID) — atualiza a versão anterior deste guia, que propunha um bypass local
via `localStorage` como alternativa (funcional, mas mais frágil que autenticar de verdade).

**Recomendação:** quando for aplicar os testes deste guia de verdade no repositório, considere
substituir os dois arquivos antigos pelos novos (seção 6), em vez de manter os dois lados
divergentes.

---

## 3. Autenticação — fluxo real via SaltaId (Eleva ID)

O login de produção acontece num domínio externo (Eleva ID) fora do Angular — mas isso **não**
significa que o teste precisa fingir a sessão do lado do navegador. A receita abaixo (passada por
outro time que já resolveu exatamente esse problema, num app que usa o mesmo provedor de
identidade) obtém um **token real** para um usuário e2e dedicado e deixa o próprio app validá-lo
como faria em produção — sem mockar nada relacionado a autenticação.

### Por que isso é melhor que fingir a sessão

O guard de rota (`src/app/guards/auth.guard.ts`) **sempre faz uma chamada HTTP real** —
`GET {pedagogicoUrl}/Autenticacao/UsuarioAutenticadoModulo/?access_token=...` — pra validar o token
antes de liberar a navegação, mesmo que o `localStorage` já tenha uma "sessão" salva. Um bypass só
com `localStorage` exige também mockar essa chamada de validação — funciona, mas diverge do
comportamento real e precisa ser mantido em sincronia com o guard. Com um token de verdade, essa
chamada passa organicamente, sem mock nenhum.

### Passo a passo

**1. Variáveis de ambiente** (`.env`, nunca commitado — criar `.env.example` com os nomes, sem
valores):
```
SALTA_ID_BASE_URL=https://...
SALTA_ID_CLIENT_ID=...
SALTA_ID_CLIENT_SECRET=...
SALTA_ID_E2E_USER_ID=<uuid do usuário e2e dedicado>
SALTA_ID_TOKEN_SCOPE=            # opcional
```
Carregar essas variáveis via um `config/load-env.ts` que seja o **primeiro import** tanto de
`playwright.config.ts` quanto do arquivo de setup — evita bug de `baseURL` "congelada" em
localhost por diferença entre import-time e runtime. Use `process.loadEnvFile()` nativo (Node ≥
20.6) com um fallback manual de parse `KEY=VALUE` para Node mais antigo.

**2. Usuário e2e dedicado — nunca reaproveitar conta pessoal.** ✅ **Já provisionado**:
`e2e.pipeline@gruposaltaedu.com` (migration `insert-e2e-pipeline-user`, autenticação via API, sem
MFA). `SALTA_ID_E2E_USER_ID` é o `id` fixo desse usuário. Os valores reais (`SALTA_ID_CLIENT_ID`,
`SALTA_ID_CLIENT_SECRET`, `SALTA_ID_E2E_USER_ID`) devem ser obtidos por um canal seguro (cofre de
segredos, DM direta, etc.) — **nunca copiados de um arquivo em texto puro dentro de um
repositório**, nem mesmo um repositório privado. Se em algum momento esses valores acabarem
versionados (mesmo sem push), trate o `client_secret` como comprometido e peça rotação a quem
administra o SaltaId antes de reusar.

Além das quatro variáveis já citadas, o template de ambiente usado por outros times do SaltaId
também define `SALTA_ID_TOKEN_SCOPE` (opcional — só preencher se o ambiente exigir escopo explícito
no token do usuário e2e) e aceita `ELEVA_ID_URL` como nome alternativo para `SALTA_ID_BASE_URL`
(mesma URL, dois nomes usados por ferramentas diferentes — `tests/helpers/auth/salta-id-auth.ts`
já aceita os dois).

**3. Helper de token** (`tests/helpers/auth/salta-id-auth.ts`) — duas chamadas HTTP puras, sem
navegador, com cache em memória até expirar:
```ts
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getSaltaIdToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  // 1) token da aplicação (client_credentials)
  const appAuth = await fetch(`${process.env.SALTA_ID_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SALTA_ID_CLIENT_ID!,
      client_secret: process.env.SALTA_ID_CLIENT_SECRET!,
    }),
  }).then(r => r.json());

  // 2) token do usuário e2e, autenticado "como" ele usando o token da aplicação
  const userAuth = await fetch(
    `${process.env.SALTA_ID_BASE_URL}/user/authenticate/${process.env.SALTA_ID_E2E_USER_ID}?expiresInMinutes=60`,
    { method: 'POST', headers: { Authorization: `Bearer ${appAuth.access_token}` } },
  ).then(r => r.json());

  cachedToken = { value: userAuth.access_token, expiresAt: Date.now() + 55 * 60 * 1000 };
  return cachedToken.value;
}
```

**4. Reescrever `tests/setup/auth.setup.ts`** — abrir o navegador de verdade e navegar direto pra
rota que o app **já sabe processar** (`/auth/eleva-id?access_token=...`, a mesma que hoje só
funciona com SSO real — aqui só trocamos de onde vem o token):
```ts
import { test as setup, chromium } from '@playwright/test';
import path from 'path';
import { getSaltaIdToken } from '../helpers/auth/salta-id-auth';

const authFile = path.join(__dirname, '.auth/user.json');

setup('autenticar', async () => {
  const token = await getSaltaIdToken();

  const browser = await chromium.launch({
    headless: process.env.GLOBAL_SETUP_HEADED !== 'true',
    args: ['--disable-features=FedCm,FedCmWithoutThirdPartyCookies'],
  });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(
    `https://localhost/estrutura-pedagogica/auth/eleva-id?access_token=${encodeURIComponent(token)}`,
    { waitUntil: 'load', timeout: 30_000 },
  );

  // confirma que o guard aceitou o token e a navegação saiu de /auth/
  await page.waitForURL(url => !url.pathname.includes('/auth/'), { timeout: 15_000 });

  await context.storageState({ path: authFile });
  await browser.close();
});
```
Se `waitForURL` estourar o timeout, o setup lança exceção e **nenhum `storageState` é gravado** —
intencional: falha de autenticação vira erro fatal na suíte inteira, em vez de deixar testes
rodarem com sessão inválida mascarada de "flaky".

### O que muda nos specs

Com `auth.setup.ts` corrigido, **nenhum spec precisa mais fazer bypass de autenticação** — a
sessão já vem pronta via `storageState` (é o que `playwright.config.ts` já configura no projeto
`e2e`, dependente do projeto `setup`). O exemplo da seção 6 fica mais simples do que a versão
anterior deste guia: sem `test.use({ storageState: ... })`, sem `USUARIO_FAKE`, sem `mockAuth`. Cada
spec só mocka as chamadas de API específicas da tela que está testando.

### `workers` / paralelismo

**Correção em relação à primeira versão deste guia** — a análise anterior estava incompleta. Não
é só a autenticação inicial (`auth.setup.ts`) que toca o backend real: o `authGuard` da aplicação
(`src/app/guards/auth.guard.ts`) faz uma chamada HTTP real de validação de token
(`GET .../Autenticacao/UsuarioAutenticadoModulo/?access_token=...`) **em toda navegação**, não só
no login — e **nenhum spec mocka essa chamada** (nem os deste guia). Rodando em paralelo (padrão
do Playwright sem `workers` definido), isso vira uma rajada de chamadas concorrentes contra um
backend .NET local que normalmente não está preparado pra esse volume — na prática, isso derrubou
simultaneamente testes de features completamente não relacionadas entre si (todas presas na tela
de "Carregando..."/sessão expirada, não um bug de cada feature).

**`workers: 1` já está configurado no `playwright.config.ts`** por causa disso — mantenha assim até
essa chamada do guard ser mockada em cada spec (ou o backend local suportar concorrência real).

**Segunda correção, mais importante — essa era só parte do problema.** Depurando com screenshot +
trace (seção abaixo), a causa real de boa parte das 212 falhas da suíte completa (e das falhas do
`dia-letivo-extra` mesmo já com `workers: 1`) era outra, mais simples: **`page.goto('/rota')` com
barra inicial ignora o path do `baseURL`**. Ver seção "Gotcha: baseURL com path + barra inicial"
logo abaixo — `workers: 1` continua sendo boa prática (o guard genuinamente bate no backend real
em toda navegação), mas não era a causa do 404 observado.

### ⚠️ Gotcha: `baseURL` com path + barra inicial no `page.goto`

O `baseURL` deste projeto tem um path (`https://localhost/estrutura-pedagogica`), não é só a
origem. Resolução de URL relativa segue a regra padrão de `new URL(path, base)`:

- `page.goto('/configurador-periodos-letivos/dia-letivo-extra/listar')` (**com barra inicial**) —
  uma referência de path absoluto **descarta o path inteiro do `baseURL`** e resolve a partir da
  raiz do domínio → navega para `https://localhost/configurador-periodos-letivos/...` (sem
  `/estrutura-pedagogica`) → **404**.
- `page.goto('configurador-periodos-letivos/dia-letivo-extra/listar')` (**sem barra inicial**) —
  resolve relativo ao path do `baseURL` → `https://localhost/estrutura-pedagogica/configurador-periodos-letivos/...`
  → correto. Só funciona se o `baseURL` configurado também terminar com `/` (ver
  `playwright.config.ts` — `APP_BASE_URL.endsWith('/') ? APP_BASE_URL : \`${APP_BASE_URL}/\``).

Descoberto lendo o `trace.zip` de um teste que falhava sem nenhuma pista no texto do erro — a
aba de rede do trace mostrou o `404` na URL exata, o que o texto de erro sozinho não deixava claro
(a tela só ficava em branco, sem "Carregando..." nem mensagem nenhuma). **Todos os `page.goto` dos
specs (inclusive os pré-existentes de outras features, que usam o mesmo padrão de barra inicial)
provavelmente têm esse mesmo bug** — vale migrar aos poucos conforme cada arquivo for tocado.

**Regra prática para specs novos**: nunca escrever `page.goto('/algo')` neste projeto — sempre sem
barra inicial.

### ⚠️ Gotcha: banner de consentimento de cookies bloqueia cliques

Depois de corrigir o `baseURL`, a página passou a carregar de verdade (confirmado por
screenshot) — mas os testes continuaram travando no primeiro `.click()`. O screenshot mostrou a
tela certa, com os filtros até auto-preenchidos, só que com um **banner de "Privacidade"**
("Prosseguir" / "Rejeitar Todos" / "Definições de cookies") renderizado por cima. Mesmo não
cobrindo visualmente os elementos do topo da tela no screenshot, esse banner intercepta cliques na
página inteira até ser fechado — o Playwright fica esperando o elemento "ficar acionável"
(actionability check) e nunca considera, porque tecnicamente há outro elemento por cima
capturando o evento.

**Correção**: fechar o banner logo após o `page.goto`, antes de qualquer outra interação. Uma
primeira tentativa usando `locator.isVisible({ timeout })` não funcionou — `isVisible()` é uma
checagem **imediata**, sem espera/retry (o parâmetro `timeout` não faz o que parece); se o banner
monta um instante depois do load, `isVisible()` já retornou `false` antes dele existir. `waitFor`
faz o polling de verdade:

```ts
async function fecharBannerCookies(page: Page) {
  // waitFor (não isVisible, que não espera/faz retry — só checa o instante atual) porque o
  // banner pode montar um instante depois do load.
  const rejeitar = page.getByRole('button', { name: 'Rejeitar Todos' });
  try {
    await rejeitar.waitFor({ state: 'visible', timeout: 5000 });
    await rejeitar.click();
  } catch {
    // banner não apareceu dessa vez — segue o jogo
  }
}
```

Só é necessário logo após um `page.goto()` de página cheia — navegações internas via router (SPA,
ex.: abrir `/novo` clicando em "Novo dia letivo extra") não recarregam a página, então o banner não
reaparece nelas.

### ⚠️ Gotcha: a shell da feature trava em "Carregando..." se `permissoes-abas` não for mockado

Mesmo depois de corrigir `baseURL` e fechar o banner, os testes continuaram travando no primeiro
`.click()` de um campo do filtro (`hashAnoLetivo-trigger`), com o mesmo timeout de 30s — mas dessa
vez **sem nenhum elemento bloqueando**: o campo simplesmente não existe no DOM. Investigando o
trace (rede + snapshot DOM completo no momento da falha, não só o texto do erro), a página real
estava presa em `<app-loading>` dentro de `<app-configurador-periodos-letivos>` — o componente de
listagem (`app-listar-dia-letivo-extra`) **nunca chega a montar**.

Causa: `configurador-periodos-letivos.component.html` só renderiza o `<router-outlet>` (e portanto
qualquer tela filha, inclusive a de `dia-letivo-extra`) depois que
`ConfiguradorPeriodosLetivosService.permissoesAbasCarregado()` vira `true`. Esse signal só muda de
estado dentro do `subscribe` de `GET /configuradorperiodosletivos/permissoes-abas` — sucesso ou
erro, tanto faz, mas **precisa que a chamada complete**. Como esse endpoint nunca foi mockado (só os
`dialetivoextra/*`), ele ia para o backend real — e como não completava durante o teste, o signal
ficava `false` para sempre e a tela inteira nunca saía do "Carregando...".

**Correção**: mockar esse endpoint também, junto com os outros, antes do `page.goto`:
```ts
async function mockPermissoesAbas(page: Page) {
  await page.route('**/configuradorperiodosletivos/permissoes-abas', route =>
    route.fulfill({
      json: {
        isSuccess: true,
        data: {
          possuiConfiguradorAnoLetivo: true,
          possuiConfiguradorEscolaEtapa: true,
          possuiDiasSemAula: true,
          possuiDiaLetivoExtra: true,
        },
      },
    }));
}
```
**Lição geral**: quando uma tela mostra um "Carregando..." que nunca termina em teste E2E, não
assuma que é só a chamada "óbvia" da tela (a listagem, o filtro) que falta mockar — pode ser uma
chamada de um componente-pai/shell (permissões de aba, feature flag, contagem de menu) que a tela
em si nem referencia diretamente. O DOM snapshot do trace no momento da falha mostra exatamente qual
componente está preso em loading — mais confiável do que adivinhar pelo texto do erro.

### ⚠️ Gotcha: build servido (`wwwroot`) desatualizado em relação ao source

Depois de corrigir o mock de `permissoes-abas`, a tela passou a renderizar de verdade — painel do
filtro aberto, "Ano Letivo: 2025" e "Rede: Rede Principal" preenchidos (confirmado no snapshot de
acessibilidade do erro). Mesmo assim, `page.getByTestId('hashAnoLetivo-trigger').click()`
continuava estourando os 30s **sem encontrar nenhum elemento** (nem "elemento visível mas
bloqueado" — zero match o tempo todo).

Causa, achada extraindo o `trace.zip` e buscando literalmente `data-testid` no DOM completo: **o
atributo não existe em nenhum elemento da página**, apesar de existir no
`select-field.component.html` atual (`[attr.data-testid]="fieldId ? fieldId + '-trigger' : null"`).
Comparando datas: os arquivos-fonte do componente foram alterados recentemente, mas os chunks JS
servidos em `backend/EstruturaPedagogica.Api/wwwroot/*.js` (onde o `baseURL` do Playwright aponta —
ver seção 1) eram de **dias atrás**. Buscando o literal `-trigger` dentro desses chunks: não
aparece em nenhum — o binding de `data-testid` simplesmente não existia na versão compilada e
servida. Ou seja: **não era bug de teste nem de app — era o build (`wwwroot`) defasado em relação
ao source**.

**Correção**: rodar (ou reiniciar) `npm run dev` (`ng build --base-href /estrutura-pedagogica/
--watch`) no `frontend/` com o backend .NET local servindo esse `wwwroot` — isso recompila e
mantém sincronizado a cada mudança de source enquanto o watcher ficar rodando.

**Lição geral**: nesse projeto o Playwright **não** testa contra `ng serve` (porta 4200) — testa
contra o build estático servido pelo backend. Se um teste falha com "elemento nunca encontrado"
mesmo depois de confirmar visualmente (screenshot/snapshot) que a tela renderizou certo, **vale
comparar a data de modificação do source do componente com a data dos arquivos em `wwwroot/`**
antes de suspeitar de bug de lógica — pode ser só build velho.

### ⚠️ Gotcha: `getByText` sem escopo bate em texto repetido em 3 lugares (strict mode)

Com o build atualizado, os campos do filtro passaram a funcionar de verdade — mas
`await expect(page.getByText('Escola Alpha')).toBeVisible()` quebrou com **strict mode
violation: resolved to 3 elements**: a tag colapsada do filtro (`select-tags-field`, sempre no
DOM, só escondida via CSS quando o painel está aberto), a opção do dropdown de escola (também
sempre no DOM, só escondida quando o dropdown está fechado) e a célula real da tabela.
`getByText`/`getByRole` sem escopo busca a página inteira — qualquer texto que também apareça
num resumo de filtro ou numa opção de dropdown (ambos ficam no DOM mesmo escondidos) vira
ambiguidade. **Correção**: escopar no container certo antes de buscar o texto —
`page.locator('table.lista tbody tr').getByText('Escola Alpha')` em vez de
`page.getByText('Escola Alpha')` solto.

### ⚠️ Gotcha: campo com uma única opção mockada vem `forceDisabled`, não dá pra clicar

`preencherFormularioNovo()` tentava `getByTestId('formulario-dia-letivo-extra-escola-trigger').click()`
seguido do clique na opção — mas travava esperando a opção aparecer. Causa: o `single-select` de
escola do formulário usa `[forceDisabled]="edicao || escolas.length === 1 || ..."`
(`formulario-page.component.html`) — como só mockamos **uma** escola, o campo já vem
pré-selecionado e **desabilitado**, sem dropdown pra abrir. Mesma classe de problema do
`autoSelectWhenSingle` do filtro (seção 3): sempre que um campo depende de "quantas opções a API
devolveu" pra decidir se é interativo, mockar só 1 opção muda o comportamento do campo, não só o
conteúdo. **Correção**: não clicar — só confirmar que já veio certo:
```ts
await expect(page.getByRole('textbox', { name: ESCOLA.descricao })).toBeDisabled();
```
(o valor selecionado vira `placeholder` do input interno, não `value` nem texto — por isso
`getByRole('textbox', { name: ... })`, que resolve nome acessível via placeholder, e não
`toHaveValue`/`toContainText`, que não veriam nada).

### Bônus — impersonar outro perfil sem senha própria

Pra simular aluno/professor sem ter a senha da pessoa: a partir da sessão de gestão já logada,
chamar o endpoint de "autenticar como" via `page.evaluate` (fetch com `credentials: 'include'`),
gravar o usuário retornado no `localStorage` e recarregar a página. Nunca impersonificar o próprio
usuário da sessão atual (o backend rejeita). Não é necessário para o fluxo deste guia, mas vale
saber que existe caso outro teste precise.

---

## 4. Regra de ouro dos seletores: `data-testid` primeiro, sempre

Esse projeto tem uma convenção documentada em `readme.md` (`projetos/play_testes/readme.md`,
seção 1): elementos interativos dos componentes shared já expõem `data-testid`. Ordem de
preferência ao escolher um seletor:

1. `page.getByTestId('...')` — estável, não quebra se mudar texto/CSS.
2. `page.getByRole('button', { name: '...' })` — bom para elementos sem testid ainda (ex.: botões
   nativos escritos direto na tela, fora de um shared component).
3. `page.locator('input[formcontrolname="..."]')` — aceitável quando o campo é HTML cru de
   formulário reativo (Angular) e ainda não tem testid.
4. **Nunca** `page.locator('table.lista, .lista-resultado, [class*="lista"]')` — cadeia de
   alternativas de CSS "no chute". Se você se pegar escrevendo isso, é sinal de que falta um
   `data-testid` no componente — considere adicioná-lo (ver `plano-refatoracao-testabilidade.md`)
   em vez de contornar no teste.

---

## 5. Mapeando a tela que vamos testar

### Rotas

| Ação | URL |
|---|---|
| Listar | `/configurador-periodos-letivos/dia-letivo-extra/listar` |
| Criar novo | `/configurador-periodos-letivos/dia-letivo-extra/novo` |
| Editar | `/configurador-periodos-letivos/dia-letivo-extra/editar/:hash` |

`novo`/`editar` só funcionam se você **chegar neles clicando a partir da listagem** — o
componente de formulário lê um contexto (filtro aplicado, escolas, e o item no caso de edição)
salvo pelo `RouteStateService` quando você clica em "Novo dia letivo extra" ou "Editar". Se você
tentar um `page.goto()` direto nessas rotas, a página redireciona de volta para `/listar` por
falta de contexto. **Nos testes, sempre navegue clicando nos botões reais**, nunca com `goto`
direto no formulário — isso também deixa o teste mais parecido com o que um usuário faz.

### Filtro (`filtro_dia_letivo_extra.ts`)

`id` do filtro: `filtro_dia_letivo_extra`. Três campos:

| `key` | Tipo | Testid do trigger | Testid de cada opção |
|---|---|---|---|
| `hashAnoLetivo` | Select | `hashAnoLetivo-trigger` | `hashAnoLetivo-option-<hash>` |
| `hashRede` | Select | `hashRede-trigger` | `hashRede-option-<hash>` |
| `hashEscola` | MultiSelect | `hashEscola-trigger` | `hashEscola-option-<hash>` |

Botões do filtro (testid `filtro-<id>-*`, onde `<id>` = `filtro_dia_letivo_extra`):
`filtro-filtro_dia_letivo_extra-btn-toggle` (abre/fecha o painel — já vem aberto por padrão nessa
tela, `showFilter = true`), `filtro-filtro_dia_letivo_extra-btn-limpar`,
`filtro-filtro_dia_letivo_extra-btn-aplicar`.

### Listagem

- Botão "Exportar planilha": `btn-exportar-dia-letivo-extra`.
- Paginação: `paginacao-dia-letivo-extra` (+ sufixos `-anterior`/`-proximo`/`-pagina-N`).
- Cada linha tem botões nativos (sem testid ainda) com texto "Editar" e "Excluir" —
  `page.getByRole('button', { name: 'Editar' })`.
- Botão "Novo dia letivo extra": é um `app-salvar`, use `getByRole('button', { name: 'Novo dia
  letivo extra' })`. Fica desabilitado até o filtro ser aplicado com sucesso.
- Modal de exclusão: `modal-excluir-dia-letivo-extra`. Botões internos ("Cancelar", "Confirmar
  exclusão") são nativos, sem testid — use `getByRole`.

### Formulário (criar/editar)

Campos do `FormGroup` e como selecioná-los:

| Campo | Componente | Seletor |
|---|---|---|
| `hashEscola` | `single-select` | `formulario-dia-letivo-extra-escola-trigger` / `-option-<hash>` |
| `data` | `app-date-field` | `input-data-dia-letivo-extra` |
| `titulo` | `<input>` nativo | `input[formcontrolname="titulo"]` (sem testid ainda) |
| `descricao` | `app-textarea-field` | `input-descricao-dia-letivo-extra` |

Depois de escolher escola + data válida, o formulário busca as turmas disponíveis
(`POST /dialetivoextra/get-formulario`) e mostra checkboxes de turno/série/turma/disciplina
(`app-check`), com testids:
`dia-letivo-extra-turno-<hash>`, `dia-letivo-extra-serie-<turno>-<serie>`,
`dia-letivo-extra-turma-<hash>`, `dia-letivo-extra-frente-<turma>-<frente>`.

**Detalhe importante do fluxo:** marcar o checkbox de uma turma (`toggleTurma`) já seleciona
automaticamente todas as disciplinas dela — não precisa marcar disciplina por disciplina para o
caminho feliz do teste. É obrigatório marcar pelo menos uma turma para salvar (o formulário
recusa com "É obrigatório selecionar pelo menos uma turma.").

Botões: "Confirmar" (salva, nativo, `getByRole('button', {name:'Confirmar'})`), "Cancelar"
(volta sem salvar), "Remover" (só aparece editando).

### Endpoints envolvidos (para mockar com `page.route`)

| Chamada | Endpoint |
|---|---|
| Opções do filtro | `GET /dialetivoextra/filter-anoletivo`, `POST /dialetivoextra/filter-rede`, `POST /dialetivoextra/filter-escola` |
| Listar | `POST /dialetivoextra/get` |
| Turmas disponíveis (form) | `POST /dialetivoextra/get-formulario` |
| Detalhes para edição | `GET /dialetivoextra/get-formulario/:hash` |
| Salvar (criar/editar) | `POST /dialetivoextra/save` |
| Excluir | `GET /dialetivoextra/inativar/:hash` |
| Guard de autenticação | `GET .../Autenticacao/UsuarioAutenticadoModulo/` (ver seção 3) |
| Permissões de aba (shell da feature) | `GET /configuradorperiodosletivos/permissoes-abas` — **sem mock, a tela fica presa em "Carregando..." pra sempre** (ver gotcha na seção 3) |

Por que mockar em vez de usar o backend de verdade? Porque assim o teste não depende de dados
específicos existirem no banco — ele controla exatamente o que a API "responde", ficando
determinístico e rápido.

---

## 6. O teste completo

Salve como `frontend/tests/e2e/dia-letivo-extra/listar.spec.ts` (substituindo o arquivo antigo
desatualizado, ver seção 2):

```ts
import { test, expect, Page } from '@playwright/test';

// A sessão já vem autenticada via storageState (projeto "e2e" do playwright.config.ts,
// dependente do projeto "setup" — ver seção 3). Nenhum bypass de auth é necessário aqui.

// ── Dados de mock ──────────────────────────────────────────────────────────────

const ANO_LETIVO = { hash: 'ano-2025', descricao: '2025' };
const REDE       = { hash: 'rede-1',   descricao: 'Rede Principal' };
const ESCOLA     = { hash: 'escola-1', descricao: 'Escola Alpha' };

const TURMA = {
  hash: 'turma-1a', descricao: '1A Manhã',
  hashTurno: 'turno-manha', nomeTurno: 'Manhã', ordemTurno: 1,
  hashSerie: 'serie-1ano', nomeSerie: '1º ano', ordemSerie: 1,
  frentes: [{ hash: 'frente-mat', descricao: 'Matemática' }],
  hashDisciplinasBloqueadas: [],
};

const DIA_EXISTENTE = {
  hash: 'dia-1', hashEscola: 'escola-1', data: '2025-06-15',
  titulo: 'Reposição de aula', nomeEscola: 'Escola Alpha',
  turmas: [{ hash: 'turma-1a', nome: '1A Manhã', nomeSerie: '1º ano', nomeTurno: 'Manhã' }],
};

// ── Helpers de mock de API ──────────────────────────────────────────────────────

async function mockPermissoesAbas(page: Page) {
  // A shell da feature (configurador-periodos-letivos.component) fica presa num
  // <app-loading> até essa chamada resolver — sem mock, ela vai pro backend real e,
  // se não responder, o router-outlet (e portanto a página de listar) nunca renderiza.
  await page.route('**/configuradorperiodosletivos/permissoes-abas', route =>
    route.fulfill({
      json: {
        isSuccess: true,
        data: {
          possuiConfiguradorAnoLetivo: true,
          possuiConfiguradorEscolaEtapa: true,
          possuiDiasSemAula: true,
          possuiDiaLetivoExtra: true,
        },
      },
    }));
}

async function mockFiltro(page: Page) {
  await page.route('**/dialetivoextra/filter-anoletivo', route =>
    route.fulfill({ json: { isSuccess: true, data: [ANO_LETIVO] } }));
  await page.route('**/dialetivoextra/filter-rede', route =>
    route.fulfill({ json: { isSuccess: true, data: [REDE] } }));
  await page.route('**/dialetivoextra/filter-escola', route =>
    route.fulfill({ json: { isSuccess: true, data: [ESCOLA] } }));
}

async function mockLista(page: Page, dias = [DIA_EXISTENTE]) {
  await page.route('**/dialetivoextra/get', route =>
    route.fulfill({ json: { isSuccess: true, data: dias } }));
}

async function mockFormulario(page: Page) {
  // turmas disponíveis para a combinação escola + data escolhida no formulário
  await page.route('**/dialetivoextra/get-formulario', route =>
    route.fulfill({ json: { isSuccess: true, data: [TURMA] } }));
}

async function mockGetFormularioEdicao(page: Page, hash: string) {
  // dados completos (descrição + turmas/disciplinas já marcadas) ao entrar em modo edição
  await page.route(`**/dialetivoextra/get-formulario/${hash}`, route =>
    route.fulfill({
      json: {
        isSuccess: true,
        data: {
          hash,
          titulo: DIA_EXISTENTE.titulo,
          descricao: 'Descrição original',
          turmas: [{ hashTurma: TURMA.hash, hashDisciplinas: [TURMA.frentes[0].hash] }],
        },
      },
    }));
}

async function mockSalvar(page: Page) {
  await page.route('**/dialetivoextra/save', route =>
    route.fulfill({ json: { isSuccess: true, data: true } }));
}

async function fecharBannerCookies(page: Page) {
  // Banner de consentimento de cookies aparece em toda navegação fresca e bloqueia cliques
  // no resto da página (mesmo sem cobrir visualmente os elementos) até ser fechado. Usa
  // waitFor (não isVisible, que não espera/faz retry — só checa o instante atual) porque o
  // banner pode montar um instante depois do load.
  const rejeitar = page.getByRole('button', { name: 'Rejeitar Todos' });
  try {
    await rejeitar.waitFor({ state: 'visible', timeout: 5000 });
    await rejeitar.click();
  } catch {
    // banner não apareceu dessa vez — segue o jogo
  }
}

async function irParaListagem(page: Page) {
  await mockPermissoesAbas(page);
  await mockFiltro(page);
  await mockLista(page);
  // sem barra inicial — ver seção 3/8: baseURL tem path (/estrutura-pedagogica), barra
  // inicial faz a navegação ignorar esse path inteiro e resolver a partir da raiz do domínio
  await page.goto('configurador-periodos-letivos/dia-letivo-extra/listar');
  await fecharBannerCookies(page);
}

async function aplicarFiltro(page: Page) {
  await page.getByTestId('hashAnoLetivo-trigger').click();
  await page.getByTestId(`hashAnoLetivo-option-${ANO_LETIVO.hash}`).click();

  await page.getByTestId('hashRede-trigger').click();
  await page.getByTestId(`hashRede-option-${REDE.hash}`).click();

  await page.getByTestId('hashEscola-trigger').click();
  await page.getByTestId(`hashEscola-option-${ESCOLA.hash}`).click();
  await page.keyboard.press('Escape'); // fecha o dropdown de multi-select antes de continuar

  await page.getByTestId('filtro-filtro_dia_letivo_extra-btn-aplicar').click();
}

async function preencherFormularioNovo(page: Page) {
  // Escola já vem selecionada e desabilitada: só existe 1 opção mockada, e o campo usa
  // [forceDisabled]="escolas.length === 1 || ..." (formulario-page.component.html) — não há
  // dropdown pra abrir/clicar aqui. O valor selecionado aparece como placeholder do input
  // interno (searchTerm fica vazio), não como texto/valor — daí conferir via getByRole.
  await expect(page.getByRole('textbox', { name: ESCOLA.descricao })).toBeDisabled();

  await page.getByTestId('input-data-dia-letivo-extra').fill('2025-08-10');
  await page.locator('input[formcontrolname="titulo"]').fill('Passeio pedagógico');
  await page.getByTestId('input-descricao-dia-letivo-extra').fill('Visita ao museu da cidade.');
}

// ── Testes ──────────────────────────────────────────────────────────────────────

test.describe('Configurador de Períodos Letivos › Dia Letivo Extra', () => {

  test('aplica o filtro e exibe a lista', async ({ page }) => {
    await irParaListagem(page);
    await aplicarFiltro(page);

    // Escola Alpha/Reposição de aula também aparecem na tag colapsada do filtro e na opção
    // de dropdown ainda presente no DOM — sem escopar na linha da tabela, getByText bate em
    // 3 elementos (strict mode violation).
    const linha = page.locator('table.lista tbody tr');
    await expect(linha).toHaveCount(1);
    await expect(linha.getByText('Escola Alpha')).toBeVisible();
    await expect(linha.getByText('Reposição de aula')).toBeVisible();
  });

  test('cria um novo dia letivo extra', async ({ page }) => {
    await irParaListagem(page);
    await aplicarFiltro(page);
    await mockFormulario(page);
    await mockSalvar(page);

    await page.getByRole('button', { name: 'Novo dia letivo extra' }).click();
    await expect(page).toHaveURL(/dia-letivo-extra\/novo$/);

    await preencherFormularioNovo(page);

    // marcar a turma já seleciona automaticamente todas as disciplinas dela
    await page.getByTestId(`dia-letivo-extra-turma-${TURMA.hash}`).click();

    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByTestId('toast')).toContainText('Dia letivo extra criado com sucesso.');
    await expect(page).toHaveURL(/dia-letivo-extra\/listar$/);
  });

  test('edita um dia letivo extra existente', async ({ page }) => {
    await irParaListagem(page);
    await aplicarFiltro(page);
    await mockFormulario(page);
    await mockGetFormularioEdicao(page, DIA_EXISTENTE.hash);
    await mockSalvar(page);

    await page.getByRole('button', { name: 'Editar' }).click();
    await expect(page).toHaveURL(new RegExp(`dia-letivo-extra/editar/${DIA_EXISTENTE.hash}$`));

    // o formulário já vem pré-preenchido com os dados do item clicado
    await expect(page.locator('input[formcontrolname="titulo"]')).toHaveValue(DIA_EXISTENTE.titulo);

    await page.locator('input[formcontrolname="titulo"]').fill('Reposição de aula (remarcada)');
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByTestId('toast')).toContainText('Dia letivo extra editado com sucesso.');
    await expect(page).toHaveURL(/dia-letivo-extra\/listar$/);
  });

  test('cancelar no formulário não salva nem chama a API', async ({ page }) => {
    await irParaListagem(page);
    await aplicarFiltro(page);
    await mockFormulario(page);

    let chamouSalvar = false;
    await page.route('**/dialetivoextra/save', route => {
      chamouSalvar = true;
      return route.fulfill({ json: { isSuccess: true, data: true } });
    });

    await page.getByRole('button', { name: 'Novo dia letivo extra' }).click();
    await preencherFormularioNovo(page);
    await page.getByTestId(`dia-letivo-extra-turma-${TURMA.hash}`).click();

    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page).toHaveURL(/dia-letivo-extra\/listar$/);
    expect(chamouSalvar).toBe(false);
  });

  test('exige pelo menos uma turma selecionada para confirmar', async ({ page }) => {
    await irParaListagem(page);
    await aplicarFiltro(page);
    await mockFormulario(page);

    await page.getByRole('button', { name: 'Novo dia letivo extra' }).click();
    await preencherFormularioNovo(page);

    // nenhuma turma marcada
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByTestId('toast')).toContainText('obrigatório selecionar pelo menos uma turma');
    await expect(page).toHaveURL(/dia-letivo-extra\/novo$/); // não navegou — nada foi salvo
  });
});
```

### O que cada API do Playwright usada acima faz (glossário rápido)

- `test.describe(...)` — agrupa testes relacionados (aparece como pasta no relatório).
- `test('nome', async ({ page }) => {...})` — um teste individual; `page` é a aba do navegador.
- `page.goto(url)` — navega para uma URL (relativa ao `baseURL` do config).
- `page.getByTestId(id)` — encontra um elemento pelo atributo `data-testid`.
- `page.getByRole('button', { name: 'X' })` — encontra pelo papel semântico (acessibilidade) e
  texto visível — não quebra se a classe CSS mudar.
- `.click()` / `.fill('texto')` — simula clique / digitação.
- `page.route(pattern, handler)` — intercepta uma chamada de rede que bater com `pattern` e
  responde o que você quiser, sem tocar no backend de verdade.
- `expect(locator).toBeVisible()` / `.toHaveText(...)` / `.toHaveCount(n)` / `.toHaveValue(...)` —
  asserções: falham o teste se não forem verdade dentro de um tempo limite (retry automático).
- `page.waitForURL` / `expect(page).toHaveURL(...)` — espera/verifica a URL atual.

---

## 7. Como rodar

```powershell
# 0. Configurar o .env uma vez (ver seção 3) — SALTA_ID_BASE_URL, SALTA_ID_CLIENT_ID,
#    SALTA_ID_CLIENT_SECRET, SALTA_ID_E2E_USER_ID
cd c:/projects/estrutura-pedagogica/frontend

# 1. Gerar o build e ter o backend rodando (baseURL aponta pro build servido pelo backend)
npm run dev
# ... com o backend .NET local rodando em paralelo, servindo https://localhost/estrutura-pedagogica

# 2. Rodar — o projeto "e2e" depende do projeto "setup" (autentica e salva a sessão, seção 3),
#    então basta rodar normalmente, sem flags extras de auth
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e

# 3. Ver rodando com o navegador visível (ótimo pra aprender/debugar)
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e --headed

# 4. Modo UI — interface interativa, roda teste por teste, mostra cada passo e o DOM (recomendado
#    para quem está começando)
npx playwright test --project=e2e --ui

# 5. Depurar um teste específico passo a passo
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e --debug

# 6. Ver o relatório HTML da última execução
npx playwright show-report

# 7. Quando um teste falhar sem pista clara no texto do erro: o projeto "e2e" já grava
#    screenshot + trace em falha (playwright.config.ts: screenshot: 'only-on-failure',
#    trace: 'retain-on-failure'). Abrir o trace mostra rede, console e DOM passo a passo —
#    foi assim que se achou o gotcha de baseURL da seção 8.
npx playwright show-trace test-results/<pasta-do-teste-que-falhou>/trace.zip
```

**Se o `.env` ainda não estiver configurado** (usuário e2e não provisionado, credenciais SaltaId
não disponíveis localmente), o projeto `setup` vai falhar e travar toda a suíte — nesse caso,
`--no-deps` pula o `setup` e roda os specs direto, mas **só funciona se já existir um
`tests/setup/.auth/user.json` válido de uma execução anterior** (senão o `storageState` aponta pra
um arquivo inexistente e o Playwright erra). Trate isso como situação temporária, não como o modo
normal de rodar os testes.

---

## 8. Status

**✅ Feito no repositório** (`estrutura-pedagogica`, branch `projetos/TestesFrontend`):
- `tests/config/load-env.ts`, `tests/config/app.ts`, `tests/helpers/auth/salta-id-auth.ts` e
  `tests/setup/auth.setup.ts` reescritos conforme a receita da seção 3.
- `playwright.config.ts`, `.env.example`, `.gitignore` e `README.md` atualizados.
- `tests/e2e/dia-letivo-extra/listar.spec.ts` substituído pelos testes deste guia (filtro, criar,
  editar, cancelar sem salvar, validação de turma obrigatória) — sem nenhum código de bypass de
  auth.
- `tests/e2e/dia-letivo-extra/formulario.spec.ts` (assumia modal, componente e seletores errados)
  removido — coberto pelo arquivo acima.

**✅ Usuário e2e provisionado**: `e2e.pipeline@gruposaltaedu.com` (migration
`insert-e2e-pipeline-user`). `tests/helpers/auth/salta-id-auth.ts` também passou a aceitar
`ELEVA_ID_URL` como alias de `SALTA_ID_BASE_URL` e um `SALTA_ID_TOKEN_SCOPE` opcional, alinhado ao
template de ambiente usado por outros times do SaltaId.

**Pendente**: preencher o `.env` local (`SALTA_ID_CLIENT_ID`/`SALTA_ID_CLIENT_SECRET`/
`SALTA_ID_E2E_USER_ID`) com os valores reais, obtidos por canal seguro — nunca copiados de um
arquivo versionado. Um valor real desses três chegou a ser colado em texto puro em
`projetos/play_testes/env_testes_automatizados.md` (repositório `pde_salta`) antes de ser commitado
— já foi substituído por placeholder nesse arquivo. Se o valor real chegou a ser usado localmente,
não precisa rotacionar só por isso; rotacione apenas se o arquivo tiver sido commitado/pushado em
algum momento com o valor real.

**✅ Corrigido**: `page.route('**/configuradorperiodosletivos/permissoes-abas', ...)` adicionado em
`mockPermissoesAbas()` (chamado dentro de `irParaListagem()`, antes do `page.goto`) — sem esse mock
a tela ficava presa em "Carregando..." pra sempre (ver gotcha na seção 3). Aplicado tanto no spec
real quanto neste guia.

**✅ Corrigido**: build servido em `backend/EstruturaPedagogica.Api/wwwroot/` estava desatualizado
em relação ao source (chunks sem o `data-testid` do campo de filtro) — resolvido rodando `npm run
dev` de novo. Não foi uma mudança de código, só de ambiente (ver gotcha na seção 3).

**✅ Corrigido**: `getByText('Escola Alpha')`/`getByText('Reposição de aula')` sem escopo batiam em
3 elementos cada (tag do filtro colapsado + opção de dropdown ainda no DOM + célula real) — agora
escopados em `page.locator('table.lista tbody tr').getByText(...)`. E `preencherFormularioNovo()`
não tenta mais abrir o dropdown de escola do formulário (campo vem `forceDisabled` com só 1 opção
mockada, igual ao padrão de auto-seleção do filtro) — só confirma que já veio selecionado e
desabilitado. Ver gotchas na seção 3.

Depois dessas correções (build, mocks e escopo de seletor), 1 dos 5 testes já passava
("edita um dia letivo extra existente"); os outros 4 ainda não foram reexecutados após o ajuste de
`getByText`/`preencherFormularioNovo` — nenhum dos problemas encontrados até aqui era de lógica do
app, só de teste/ambiente.

Ao escrever testes para outras telas, seguir o mesmo roteiro da seção 5: mapear rotas, campos e
`data-testid` antes de escrever qualquer `page.route`/`locator`. A autenticação já vem pronta via
`storageState` — não precisa ser resolvida de novo por tela. **Atenção**: sempre verificar se a
tela tem um componente-pai/shell com sua própria checagem de permissão/loading (como
`configurador-periodos-letivos.component`) — se tiver, mockar o endpoint dela também, não só os da
tela em si.
