# Revisão: consolidação de ClickOutsideService x MultiSelectCoordinatorService

## Contexto

Atualmente existem dois serviços responsáveis por garantir que apenas 1 dropdown
fique aberto por vez entre os componentes de select/multiselect do projeto:

- `ClickOutsideService` (`src/shared/services/click-outside/click-outside.service.ts`)
- `MultiSelectCoordinatorService` (`src/shared/components/multi-select/coordinator.service.ts`)

O maior consumidor simultâneo desses componentes é o filtro (`filtro.component.ts` +
`field-wrapper.component.ts`), que instancia dinamicamente vários selects/multiselects
ao mesmo tempo por meio do `component.map.ts` + `DynamicInjectorService`. Mas o mesmo
padrão se repete em qualquer tela com múltiplos selects vivos (ex.: perguntas de
"norteador" em formulários com `FormArray`).

Objetivo: manter só o `ClickOutsideService`, com o mínimo de acoplamento e o máximo
de performance, garantindo exclusividade de abertura em qualquer tela.

## Como cada serviço funciona hoje

### `ClickOutsideService`

- Singleton (`providedIn: 'root'`), guarda um `Map<HTMLElement, Callback>`.
- Um único listener nativo de `click`/`touchstart` no `document`, em fase de
  **capture**, registrado uma vez no `constructor`.
- A cada clique real: `queueMicrotask` (evita fechar no mesmo tick em que abriu) →
  `ngZone.run` (garante detecção de mudanças mesmo se o clique original ocorreu fora
  da zone) → percorre todos os elementos registrados e chama o callback de quem não
  contém o `target` do clique.
- **Não implementa exclusividade por si só** — cada elemento só sabe fechar-se quando
  o clique é fora dele. Não há hoje nenhuma noção de "só um pode estar aberto".
- Usado por 5 componentes, mas de duas formas diferentes:
  - Injeção direta: `app-select-field`, `app-multi-select-field`, `app-mini-select`
    (dynamic components).
  - Indireta, via `ClickOutsideDirective` no template (`(clickOutside)="..."`.):
    `single-select` e `multi-select` (componentes "base").

### `MultiSelectCoordinatorService`

- Singleton, guarda `Record<string, SelectUnion>` indexado por `idx` numérico
  incremental atribuído em `register()`.
- `register(instance)` / `unregister(instance)`: chamados em `ngOnInit`/`ngOnDestroy`.
- `open(instance)`: percorre todas as instâncias registradas e chama `.closeDropdown()`
  em toda instância cujo `idx` seja diferente da que está abrindo. **É este método
  quem de fato garante "1 aberto por vez" hoje** — chamado de dentro de
  `openDropdown()`/`open()` de cada componente, de forma síncrona, já depois de a
  própria instância ter marcado `isDropdownOpen = true`.
- Só é usado pelos 3 componentes dynamic (`app-select-field`, `app-multi-select-field`,
  `app-mini-select`). O tipo `SelectUnion` também lista `SelectFieldComponent` e
  `MultiSelectComponent` (os componentes "base"), mas **nenhum dos dois injeta ou
  chama o serviço** — têm até uma propriedade `idx` solta, nunca atualizada.

## Motivos para a refatoração

1. **Dois mecanismos assíncronos resolvendo o mesmo problema por caminhos
   diferentes.** O fechamento por clique fora passa por `queueMicrotask` +
   `NgZone.run`; o fechamento "exclusivo" do coordinator é uma chamada síncrona
   dentro de `openDropdown()`. Ter dois relógios diferentes por baixo do mesmo
   comportamento visual é terreno fértil para race conditions.

2. **Bug real de reabertura indevida já suspeitado e documentado por specs de
   debug** (`select-field-coordinator-debug.spec.ts`,
   `select-field-norteador-debug.spec.ts`, `select-field-real-click-debug.spec.ts`,
   todos `??` no git, não commitados). Os três giram em torno da mesma hipótese:
   com 2+ `app-select-field` num `FormArray`, selecionar uma opção em A (fechando A)
   e depois interagir com B (clique, hover, ou até múltiplos ticks de detecção de
   mudanças) pode **reabrir A indevidamente**. O spec `real-click-debug` inclusive
   usa `flushMicrotasks()` (5 voltas de `Promise.resolve()`), sinal de que a
   suspeita recai exatamente sobre a interação entre o `queueMicrotask` do
   click-outside e o `coordinator.open()` síncrono.

3. **Cobertura inconsistente entre os componentes.** `single-select`/`multi-select`
   (base) nunca se registram no coordinator — hoje, se um `single-select` estiver
   aberto, abrir um `app-select-field` (dynamic) não o fecha, e vice-versa. Em
   qualquer tela que misture os dois tipos, a regra de "1 aberto por vez" já está
   quebrada.

4. **Acoplamento de tipos desnecessário.** O tipo `SelectUnion` do coordinator
   importa 5 componentes concretos só para tipar `idx`/`closeDropdown()`, incluindo
   2 que nunca o usam. Um serviço baseado em `HTMLElement` (como já é o
   `ClickOutsideService`) não precisa conhecer nenhum componente.

5. **Manutenção de dois serviços fazendo a mesma coisa (fechar dropdowns) é custo
   sem benefício** — um único serviço, com uma única fonte de verdade sobre "qual
   elemento está aberto agora", elimina a duplicidade e a superfície de bugs.

## Plano de refatoração

### 1. Estender `ClickOutsideService` para cobrir exclusividade

Adicionar ao serviço a responsabilidade de "abrir um fecha os demais", usando a
mesma estrutura de dados que já existe (`Map<HTMLElement, Callback>`), sem precisar
de dicionário por `idx` nem de tipos concretos de componente:

- Novo método `notifyOpened(element: HTMLElement)`: percorre os elementos já
  registrados via `register()` e chama o callback de cada um que **não seja** o
  elemento recebido — reaproveitando o mesmo `Map` e os mesmos callbacks de
  "fechar" já cadastrados para o clique fora.
- `register`/`unregister` continuam com a mesma assinatura — nenhum componente
  precisa mudar como se registra para fechamento por clique fora.
- Resultado: **uma única fonte de verdade e um único fluxo síncrono** para abrir/
  fechar, eliminando a divergência entre o timing do click-outside (microtask) e o
  do coordinator (chamada direta).

### 2. Atualizar os 3 componentes dynamic (`app-select-field`, `app-multi-select-field`, `app-mini-select`)

- Remover a injeção de `MultiSelectCoordinatorService` e as chamadas
  `coordinator.register(this)` / `coordinator.unregister(this)`.
- Trocar `this.coordinator.open(this)` (dentro de `openDropdown()`/`open()`) por
  `this.clickOutside.notifyOpened(this.container.nativeElement)`.

### 3. Atualizar os 2 componentes base (`single-select`, `multi-select`)

- Hoje só usam `ClickOutsideService` indiretamente, via `ClickOutsideDirective` no
  template. Precisam injetar o serviço diretamente também, para poder chamar
  `notifyOpened()` ao abrir (a diretiva continua responsável só pelo
  `(clickOutside)` de fechamento por clique fora).
- Isso corrige a inconsistência do item 3 dos motivos: esses componentes passam a
  participar da mesma exclusividade dos demais.

### 4. Remover `MultiSelectCoordinatorService`

- Deletar `src/shared/components/multi-select/coordinator.service.ts` e o tipo
  `SelectUnion`.
- Remover a propriedade `idx` dos 5 componentes (só existia para uso do
  coordinator).

### 5. Validar com os specs de debug existentes

- Rodar `select-field-coordinator-debug.spec.ts`,
  `select-field-norteador-debug.spec.ts` e `select-field-real-click-debug.spec.ts`
  contra a nova implementação — eles já cobrem exatamente o cenário suspeito
  (múltiplas instâncias, seleção + hover/clique cruzado, clique fora real).
- Se o bug de reabertura indevida não se reproduzir mais, "promover" esses specs a
  testes de regressão definitivos: remover os `console.log`/spies de instrumentação
  e o prefixo `DEBUG` do `describe`, mantendo os cenários como cobertura permanente
  do comportamento de exclusividade.
- Adicionar um cenário equivalente cobrindo `app-multi-select-field` e
  `app-mini-select` juntos (hoje só há specs de debug para `app-select-field`).

### 6. Limpeza final

- Confirmar (grep) que não sobrou nenhuma referência a `MultiSelectCoordinatorService`
  no projeto antes de remover o arquivo.
- Atualizar `docs/refatoracao_performance_select_multiselect.md` se ele referenciar
  o coordinator como componente ainda existente.

## Bug relacionado encontrado durante a execução: `(focus)="openDropdown()"`

Durante a validação em `src/app/features/painel-aluno/ficha/tabs/atendimento-tab/`
(tela com muitos `app-select-field` no norteador), foi relatado que um select já
respondido às vezes reabre sozinho e a tela rola até ele. Investigação encontrou a
causa raiz — **anterior a esta refatoração, presente em 4 dos 5 componentes**:

O `<input class="search-input">` de busca fica sempre no DOM (mesmo com o dropdown
fechado e um valor já selecionado) e tinha `(focus)="openDropdown()"` — adicionado
porque o próprio input tem `(click)="$event.stopPropagation()"` (para não deixar o
clique chegar ao `onContainerClick` do container pai), então o único jeito de abrir
ao clicar diretamente no input era via evento de foco. O problema: **qualquer** foco
no input dispara isso — inclusive navegação por Tab/Shift+Tab entre campos, ou o
navegador restaurando o foco (ex.: trocar de aba e voltar) — sem nenhum clique real
do usuário. Como `openDropdown()` foca o input via `setTimeout`, o navegador rola a
página até ele, batendo com os dois sintomas relatados (abre + rola a tela).

**Correção aplicada:** trocado `(focus)="openDropdown()"` por
`(mousedown)="openDropdown()"` nos 4 componentes com busca (`mini-select` não tem
input de busca por padrão, não é afetado):
- `src/shared/dynamic-components/select-field/select-field.component.html`
- `src/shared/dynamic-components/multi-select-field/multi-select-field.component.html`
- `src/shared/components/select-field/select-field.component.html`
- `src/shared/components/multi-select/multi-select.component.html`

Um clique real sempre dispara `mousedown` antes de `focus`, então abrir ao clicar no
input continua funcionando; Tab (que nunca dispara `mousedown`) deixou de reabrir o
campo. Cobertura de regressão adicionada em
`tests/unit/shared/select-field-click-outside-real.spec.ts` (foco via Tab não abre;
clique/mousedown direto no input continua abrindo).
