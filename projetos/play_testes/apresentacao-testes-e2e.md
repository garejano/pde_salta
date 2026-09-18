repositório: estrutura-pedagogica
público: techlead, devs, QAs
fontes: readme.md, comandos_testes_dev.md, env_testes_automatizados.md, guia-testes-filtro.md,
        guia-testes-playwright-dia-letivo-extra.md, plano-refatoracao-testabilidade.md,
        setup-e2e-autenticacao.txt

# Testes E2E no `estrutura-pedagogica` — guia de apresentação

Documento único para apresentar ao time como os testes E2E (Playwright) funcionam hoje: o que já
existe, como rodar, convenções a seguir e o que ainda falta. Pensado para ser passado em uma
reunião, seção por seção.

---

## 1. Contexto — o que é E2E aqui e por que agora

- **E2E ("end-to-end")** abre um navegador real, clica/digita/navega como um usuário faria, e
  verifica o resultado na tela. Testa o fluxo completo (componente + serviço + HTTP + roteamento),
  diferente do teste unitário (Jest, `npm test`), que testa uma função isolada.
- Ferramenta: **Playwright**, já configurado no repo (`frontend/playwright.config.ts`,
  `package.json` → `test:e2e` / `test:e2e:auth`). Nada a instalar para rodar.
- **Motivação do investimento atual**: uma auditoria de testabilidade (`plano-refatoracao-testabilidade.md`)
  encontrou **zero `data-testid`** em qualquer componente shared (`shared/components`,
  `shared/dynamic-components`, `shared/filtro` — 51 templates). Sem isso, qualquer teste escrito
  dependeria de seletor de texto/CSS frágil. Esse ponto guiou a Fase 1 do trabalho (seção 8).

---

## 2. Estrutura do projeto de testes

```
frontend/
├── playwright.config.ts        # config central (baseURL, projects, storageState)
├── tests/
│   ├── setup/                  # auth.setup.ts — autentica 1x, salva sessão
│   │   └── .auth/user.json     # sessão salva (git-ignored)
│   ├── helpers/auth/           # salta-id-auth.ts — obtenção de token real
│   ├── config/                 # load-env.ts — 1º import, evita bug de baseURL
│   └── e2e/<feature>/*.spec.ts # um arquivo por tela/fluxo
```

**Dois projetos no `playwright.config.ts`:**

| Projeto | Papel | Depende de |
|---|---|---|
| `setup` | roda `auth.setup.ts`, autentica 1 vez, grava `storageState` | — |
| `e2e`   | roda os specs de teste de verdade | `setup` |

⚠️ **`baseURL` aponta para o build servido pelo backend .NET**
(`https://localhost/estrutura-pedagogica`), **não** para `ng serve` (porta 4200). Para rodar
testes é preciso ter `npm run dev` gerando o build e o backend local rodando.

---

## 3. Autenticação — fluxo real via SaltaId (Eleva ID)

O login de produção acontece num domínio externo (Eleva ID). Em vez de "fingir" a sessão no
navegador (frágil — o `authGuard` sempre valida o token com uma chamada HTTP real a cada
navegação), o fluxo obtém um **token real** para um usuário e2e dedicado e deixa o próprio app
validá-lo como em produção.

**Como funciona, em 3 passos:**

1. **Usuário e2e dedicado**, já provisionado: `e2e.pipeline@gruposaltaedu.com` (migration
   `insert-e2e-pipeline-user`, autenticação via API, sem MFA). Nunca reaproveitar conta pessoal.
2. **Helper de token** (`tests/helpers/auth/salta-id-auth.ts`) faz 2 chamadas HTTP puras
   (sem navegador): `client_credentials` → token da aplicação → `user/authenticate/{id}` → token
   do usuário e2e. Cacheado em memória até expirar.
3. **`auth.setup.ts`** abre um Chromium real e navega para
   `/auth/eleva-id?access_token=<token>` — a mesma rota que hoje só recebe SSO real, só trocando a
   origem do token. Espera a URL saltar de `/auth/`, confirma que o guard aceitou, e só então grava
   `storageState`. **Falha de autenticação é erro fatal** — nunca deixa a suíte rodar com sessão
   inválida mascarada de "flaky".

Com isso, **nenhum spec precisa mockar ou fazer bypass de autenticação** — a sessão já vem pronta.

**Variáveis de ambiente necessárias** (`.env`, nunca commitado):

```
SALTA_ID_BASE_URL / ELEVA_ID_URL   (alias aceito)
SALTA_ID_CLIENT_ID
SALTA_ID_CLIENT_SECRET
SALTA_ID_E2E_USER_ID
SALTA_ID_TOKEN_SCOPE                (opcional)
```

🔒 Credenciais **só por canal seguro** (cofre, DM direta) — nunca em texto puro em repositório,
nem privado. Se acabarem versionadas, tratar como comprometidas e rotacionar.

---

## 4. Convenção de testabilidade — `data-testid` primeiro, sempre

Regra mais importante do projeto — evita seletores que quebram com mudança de CSS/texto/posição.

**Ordem de preferência de seletor:**

1. `page.getByTestId('...')` — estável.
2. `page.getByRole('button', { name: '...' })` — bom para elementos nativos sem testid ainda.
3. `page.locator('input[formcontrolname="..."]')` — aceitável para form reativo cru.
4. ❌ **Nunca** cadeias de CSS "no chute" (`table.lista, .lista-resultado, [class*="lista"]`) — se
   você se pegar escrevendo isso, falta um `data-testid` no componente.

**Padrão de nomenclatura:**

| Padrão | Exemplo | Uso |
|---|---|---|
| `page-<nome>` | `page-alunos` | container raiz da página |
| `btn-<ação>` | `btn-novo-aluno` | botões |
| `input-<campo>` | `input-nome` | inputs |
| `table-<entidade>` | `table-alunos` | tabelas |
| `row-<entidade>-{id}` | `row-aluno-15` | linhas de lista/tabela |
| `modal-<ação>` | `modal-excluir` | modais |
| `toast-<tipo>` | `toast-sucesso` | toasts |

**Checklist de code review — "esse componente é testável?"**

- [ ] Elementos relevantes têm `data-testid` seguindo a convenção acima?
- [ ] HTML semântico (`button`, `input`, `label`) em vez de `div`/`span` genérico?
- [ ] Estado de loading/erro exposto via elemento com `data-testid` próprio?
- [ ] Visibilidade reflete estado real do componente, não só CSS (`display:none`)?
- [ ] Modal segue o padrão comum (wrapper + `btn-confirmar`/`btn-cancelar`/`btn-fechar`)?
- [ ] Chamada de API passa por um serviço mockável, não HTTP direto no componente?

---

## 5. Como rodar — comandos essenciais

Pré-requisito único: `.env` configurado (seção 3) + `npm run dev` + backend .NET local rodando.
Tudo abaixo assume `cd frontend`.

```powershell
# Suíte completa
npm run test:e2e

# Um arquivo específico
npx playwright test tests/e2e/dia-letivo-extra/listar.spec.ts --project=e2e

# UI Mode — abre o app desktop interativo do Playwright: lista todos os testes,
# roda um por um (ou todos), e mostra timeline, DOM, rede e console de cada passo.
# É o modo mais produtivo para quem está aprendendo ou apresentando a suíte ao time.
npx playwright test --project=e2e --ui

# Ver o navegador rodando
npx playwright test ... --project=e2e --headed

# Debug passo a passo (abre o Playwright Inspector)
npx playwright test ... --project=e2e --debug

# Relatório HTML da última execução
npx playwright show-report

# Trace de um teste que falhou (rede + console + DOM passo a passo)
npx playwright show-trace test-results/<pasta-do-teste>/trace.zip
```

⚠️ **Nunca esquecer `--project=e2e`** — sem isso o Playwright tenta rodar `setup` + `e2e` juntos e
`e2e` falha por sessão inexistente se `setup` não rodou antes na mesma invocação.

**Onde estão as evidências de uma falha**: `test-results/<spec>-<hash>-<teste>-e2e/` contém
`error-context.md` (erro + snapshot de acessibilidade), `test-failed-1.png` e `trace.zip`.

---

## 6. Testes de filtro — padrão declarativo

O módulo `shared/filtro` renderiza qualquer filtro a partir de uma **config declarativa**
(`FilterConfig`) — nenhum HTML de filtro escrito à mão. Isso significa que o teste pode ser
**derivado quase mecanicamente da config**, sem precisar entender caso a caso (é a base da skill
`/criar-teste-filtro`).

**Pontos-chave:**

- Cada `field_type` mapeia para um componente e um padrão de testid fixo (`<key>-trigger`,
  `<key>-option-<hash>`, `input-<key>`, etc.) — tabela completa em `guia-testes-filtro.md`.
- Campos com `dependency_list` ficam **desabilitados** até as dependências serem preenchidas;
  campos com `watch_list` **recarregam via API** quando o campo observado muda.
- `sideEffects` permite um campo reescrever propriedades de outro (`min`/`max`/`value`) — testável
  verificando os atributos HTML resultantes.
- **Persistência em `localStorage`**: sempre `localStorage.clear()` no início de cada teste (ou
  contexto novo por teste), a menos que o teste seja especificamente sobre persistência —
  senão o segundo teste herda o filtro "aplicado" do anterior.
- ⚠️ `FieldType.TagToggle` **não tem `data-testid` hoje** — não inventar seletor CSS; sinalizar
  como pendência.

**Checklist de casos por filtro:** aplicar com obrigatórios preenchidos → lista aparece; bloquear
se `required` vazio; cascata (`dependency_list`/`watch_list`); `autostart`/`selectFirst`; busca
livre; tags; "Limpar" reseta tudo; `sideEffects` refletidos; reload mantém o filtro aplicado.

---

## 7. Gotchas conhecidos (se um teste travar, olhe aqui primeiro)

Descobertos depurando a suíte real (`dia-letivo-extra`) via screenshot + trace — em ordem de
diagnóstico mais provável:

| Sintoma | Causa | Correção |
|---|---|---|
| `page.goto` cai em 404 | `baseURL` tem path (`/estrutura-pedagogica`); `goto('/rota')` com barra inicial descarta esse path e resolve pela raiz do domínio | **nunca** usar barra inicial: `goto('rota/sem/barra')` |
| Primeiro `.click()` trava 30s, elemento existe mas não é "acionável" | Banner de cookies intercepta cliques na página inteira até ser fechado | fechar banner logo após todo `goto` (usar `waitFor`, não `isVisible` — este não espera/faz retry) |
| Tela presa em "Carregando..." pra sempre, elemento nunca existe no DOM | Shell da feature (componente-pai) espera um endpoint de permissões/config que não foi mockado | mockar também os endpoints do **componente-pai/shell**, não só os da tela em si |
| Elemento nunca encontrado mesmo com tela renderizada corretamente (confirmado por screenshot) | Build servido em `wwwroot/` desatualizado em relação ao source | reiniciar `npm run dev` (watch de build) |
| `getByText`/`getByRole` bate em "3 elementos" (strict mode) | Texto repetido em tag de filtro colapsado + opção de dropdown ainda no DOM + célula real | escopar a busca no container certo (`table tbody tr`) |
| Campo com 1 única opção mockada não abre dropdown | Componente usa `forceDisabled` quando só há 1 opção — comportamento real, não bug | não clicar, só confirmar que já veio selecionado/desabilitado |

**Regra de paralelismo:** `workers: 1` já está configurado — o `authGuard` faz uma chamada HTTP
real de validação de token em **toda navegação** (não só login), e rodar em paralelo sem mockar
essa chamada derruba testes de features não relacionadas entre si.

---

## 8. Status atual e roadmap

**Refatoração de testabilidade (`shared/`) — fases:**

| Fase | O que | Status |
|---|---|---|
| 1 | Convenção `data-testid` em todos os componentes shared (`components`, `dynamic-components`, `filtro`) | ✅ Completa |
| — | Propagar `[testId]` nos call sites de cada tela (por módulo, conforme cada feature for tocada) | 🔄 Em andamento — lotes concluídos: `escolas-publicas`/`escolas-gerenciais`, `ocorrencia`/`etapas`/`periodo-letivo`/`boletim`/`relatorio`/`dias-sem-aula`/`diario-de-classe`. Pendente: `lancamento-frequencia`, `itinerario-formativo`, `cargas-iniciais`, `exemplos` |
| 2 | Padronizar `app-modal` (ARIA) e convenção de botões de modal | 📋 Planejada |
| 3 | Combobox customizado com ARIA correto (`select-field`, `multi-select`, etc.) | 📋 Planejada — maior risco/valor estrutural |
| 4 | Componentes secundários (`tab-navigator`, `datepicker`, `listbox-transfer`, `check`) | 📋 Planejada |
| 5 | Formalizar a convenção em doc + checklist de PR | 📋 Planejada |

⚠️ **Fora de escopo — não tocar sem alinhar**: `folha/` e `movimentacao-pedagogica/` — outros
times mexem ativamente nesses módulos (risco de conflito de merge).

**Suíte de exemplo (`dia-letivo-extra`) — piloto completo já escrito:**

- `tests/e2e/dia-letivo-extra/listar.spec.ts`: filtro, criar, editar, cancelar sem salvar,
  validação de turma obrigatória — sem nenhum bypass de autenticação.
- Todos os gotchas da seção 7 foram encontrados e corrigidos nesse piloto.
- **Pendente**: preencher `.env` local com credenciais reais (via canal seguro) para rodar a
  suíte completa; reexecutar os 5 testes após o último ajuste de seletor.

---

## 9. Checklist para quem for escrever um teste novo

1. Confirmar que a rota/tela já tem `data-testid` nos componentes shared usados (seção 4/8) — se
   não tiver, é sinal de pendência de instrumentação, não de escrever seletor frágil.
2. Mapear: rotas, campos do formulário/filtro e endpoints envolvidos **antes** de escrever
   qualquer `page.route`/`locator` (seguir o roteiro da seção 5 do
   `guia-testes-playwright-dia-letivo-extra.md`).
3. Verificar se a tela tem um componente-pai/shell com checagem própria de permissão/loading — se
   tiver, mockar o endpoint dele também.
4. Mockar API (`page.route`) em vez de depender do backend real — testes ficam determinísticos e
   rápidos.
5. Nunca `page.goto` direto em rota de formulário que depende de contexto (`novo`/`editar`) —
   navegar clicando nos botões reais, como o usuário faria.
6. `localStorage.clear()` no início do teste, a menos que o teste seja sobre persistência.
7. Rodar com `--headed` ou `--ui` antes de considerar pronto — não confiar só no texto do erro.

---

## 10. Referências para aprofundar

- `readme.md` — convenção de testabilidade completa + checklist de review.
- `comandos_testes_dev.md` — referência rápida de todos os comandos Playwright do dia a dia.
- `guia-testes-playwright-dia-letivo-extra.md` — tutorial completo (autenticação, gotchas, teste
  real ponta a ponta), escrito para quem nunca usou Playwright.
- `guia-testes-filtro.md` — mapeamento config → teste para qualquer filtro do sistema.
- `plano-refatoracao-testabilidade.md` — diagnóstico completo e plano de fases da refatoração.
- `setup-e2e-autenticacao.txt` — receita genérica de setup de autenticação real, reutilizável em
  outros repositórios que usem SaltaId/Eleva ID.
