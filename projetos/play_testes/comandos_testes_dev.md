repositório: estrutura-pedagogica
base: guia-testes-playwright-dia-letivo-extra.md, playwright.config.ts

## Objetivo

Referência rápida de comandos do Playwright para o dia a dia neste repositório. Não é tutorial —
para conceitos e explicações passo a passo, ver `guia-testes-playwright-dia-letivo-extra.md`.

Todos os comandos abaixo assumem `cd c:/projects/estrutura-pedagogica/frontend` e que o `.env`
já está configurado (ver seção 3 do guia principal). O `baseURL` aponta para o build servido pelo
backend .NET (`https://localhost/estrutura-pedagogica`), não para `ng serve` — precisa do build
gerado (`npm run dev`) e do backend rodando.

---

## 1. Rodar testes

```powershell
# Suíte completa (todos os specs em tests/e2e/), via script do package.json
npm run test:e2e

# Equivalente direto, sem passar pelo script
npx playwright test --project=e2e

# Só o setup de autenticação (gera tests/setup/.auth/user.json)
npm run test:e2e:auth
npx playwright test --project=setup

# Um arquivo específico
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e

# Uma pasta/feature inteira
npx playwright test tests/e2e/alocacao-professores-monitores --project=e2e

# Um teste específico por nome (regex sobre o título do test/describe)
npx playwright test --project=e2e -g "aplica o filtro e exibe a lista"

# Repetir um teste specífico N vezes seguidas (útil pra confirmar que um fix é estável)
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e --repeat-each=3
```

**Nunca esquecer `--project=e2e`** (ou `--project=setup`) — sem isso o Playwright tenta rodar
ambos os projetos e o `e2e` falha por não ter sessão (`storageState` inexistente) se o `setup`
não rodou antes na mesma invocação.

---

## 2. Ver o navegador rodando (debug visual)

```powershell
# Roda com o Chromium visível em vez de headless
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e --headed

# Modo debug: pausa no início, abre o Playwright Inspector (passo a passo, com "step over")
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e --debug

# Modo UI: interface interativa completa — roda teste por teste, mostra timeline, DOM,
# rede e console de cada passo. O mais produtivo pra quem está começando ou depurando algo novo.
npx playwright test --project=e2e --ui
```

---

## 3. Relatórios e evidências de falha

```powershell
# Abre o relatório HTML da última execução (lista de testes, tempos, screenshots/traces)
npx playwright show-report

# Abre o trace de um teste que falhou — mostra rede, console e DOM passo a passo.
# Pasta exata vem do nome do teste em test-results/ (ver abaixo como descobrir).
npx playwright show-trace test-results/<pasta-do-teste-que-falhou>/trace.zip

# Ver rapidamente quais testes falharam na última execução, sem abrir o relatório HTML
# (arquivo gerado automaticamente a cada `npx playwright test`)
cat test-results/.last-run.json
```

**Onde estão as evidências de uma falha**: cada teste que falha gera uma pasta em
`test-results/<nome-do-spec>-<hash>-<nome-do-teste>-e2e/` contendo:
- `error-context.md` — texto do erro + snapshot de acessibilidade da página no momento da falha
- `test-failed-1.png` — screenshot (só em falha, `screenshot: 'only-on-failure'`)
- `trace.zip` — trace completo (só em falha, `trace: 'retain-on-failure'`)

O projeto `setup` (autenticação) **não** tem `screenshot`/`trace` configurados — se `auth.setup.ts`
falhar, só existe `error-context.md`, geralmente com um timeout genérico e sem call log detalhado.

---

## 4. Listar testes sem rodar

```powershell
# Lista todos os testes que seriam executados, sem rodar nada (útil pra conferir se um -g
# ou um filtro de arquivo está pegando os testes certos antes de rodar de verdade)
npx playwright test --project=e2e --list

# Combinado com filtro de arquivo/nome
npx playwright test tests/e2e/lancamento-frequencia --project=e2e --list
```

---

## 5. Depuração de um teste que trava/falha sem pista clara

```powershell
# 1. Rodar de novo com trace forçado mesmo em teste que passa, pra comparar com uma falha
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e --trace=on

# 2. Rodar só 1 worker (evita que falhas de um teste "vazem" pra outro por concorrência —
#    já é o padrão configurado em playwright.config.ts por causa do authGuard, mas útil
#    lembrar ao investigar algo que só falha "às vezes")
npx playwright test tests/e2e/lancamento-frequencia --project=e2e --workers=1

# 3. Gerar um seletor testando ao vivo contra a página (abre o Inspector's element picker)
npx playwright codegen https://localhost/estrutura-pedagogica --ignore-https-errors
```

O `codegen` é útil pra descobrir o seletor certo de um elemento novo (clica na tela, ele gera o
`page.locator(...)`/`getByRole(...)` correspondente) — mas **sempre revisar o seletor gerado
contra a convenção do projeto** (`data-testid` primeiro, ver seção 4 do guia principal): o
`codegen` tende a gerar CSS/XPath cru, que é exatamente o que evitar.

---

## 6. Sincronizar Chromium / troubleshooting de ambiente

```powershell
# Instala/reinstala o Chromium usado pelo Playwright (resolve "Executable doesn't exist")
npx playwright install chromium

# Instala todos os browsers configurados no projeto (Chromium, Firefox, WebKit se usados)
npx playwright install

# Versão do Playwright instalada (conferir compatibilidade com @playwright/test do package.json)
npx playwright --version
```

---

## 7. Limpar resultados antigos

```powershell
# Remove pasta de resultados (screenshots/traces acumulados de execuções anteriores) —
# já está no .gitignore, seguro de apagar
Remove-Item -Recurse -Force test-results

# Remove a sessão de autenticação salva, forçando o projeto "setup" a rodar de novo na
# próxima execução (útil se o token expirou ou o usuário e2e mudou)
Remove-Item -Recurse -Force tests/setup/.auth
```

---

## Referência cruzada

- Conceitos, convenções de `data-testid` e receita de autenticação real (SaltaId/Eleva ID):
  `guia-testes-playwright-dia-letivo-extra.md`
- Gotchas conhecidos deste projeto (baseURL com path, banner de cookies, build desatualizado,
  campos com única opção auto-selecionada/desabilitados): mesmo guia, seção 3
- Boas práticas de testabilidade de componentes (convenção de `data-testid`, prioridade de
  seletor): `readme.md`
