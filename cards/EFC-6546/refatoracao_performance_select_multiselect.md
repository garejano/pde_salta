# Refatoração de Performance — `single-select` / `multi-select`

> **Nota (atualização posterior):** o `MultiSelectCoordinatorService` citado neste
> documento foi removido — sua responsabilidade de exclusividade de abertura foi
> consolidada no `ClickOutsideService` (método `notifyOpened`). Ver
> `revisao_selects.md` para o plano e os motivos dessa consolidação. O restante
> deste documento é um registro histórico das correções de performance já
> aplicadas e permanece válido.

## Escopo analisado

Existem **4 implementações paralelas** do mesmo padrão de dropdown pesquisável, quase idênticas em lógica (copiadas/coladas entre si), mais um serviço singleton compartilhado:

| Componente | Seletor | Arquivo |
|---|---|---|
| Single-select (com virtual scroll) | `single-select` | `src/shared/components/select-field/select-field.component.ts` |
| Single-select (dynamic, sem virtual scroll) | `app-select-field` | `src/shared/dynamic-components/select-field/select-field.component.ts` |
| Multi-select "base" | `multi-select` | `src/shared/components/multi-select/multi-select.component.ts` |
| Multi-select (dynamic) | `app-multi-select-field` | `src/shared/dynamic-components/multi-select-field/multi-select-field.component.ts` |
| Coordenador singleton | — | `src/shared/components/multi-select/coordinator.service.ts` |

Essa duplicação (4x o mesmo `normalizeText`, mesma navegação por teclado, mesmo hover/scroll, mesmo registro no coordinator) é em si o maior problema estrutural: qualquer correção de performance abaixo precisa ser replicada 4 vezes, e o bundle carrega 4 cópias da mesma lógica.

> **Item 0 (consolidar em um único componente) descartado por decisão do time** — os 4 componentes continuam existindo separadamente. Todas as correções abaixo foram aplicadas 4 vezes (uma por componente).

---

## 1. Memory leak no `MultiSelectCoordinatorService` (crítico) — ✅ Resolvido

> **Correção aplicada.** Ao implementar, ficou claro que nem os 4 componentes citados no escopo registram-se no coordinator: só `app-select-field`, `app-multi-select-field` e **`mini-select`** (não listado no escopo original — também compartilha o mesmo serviço) chamam `coordinator.register()`. `single-select` e `multi-select` "base" nem injetam o serviço, então não vazavam por este caminho. Foi adicionado `unregister(instance)` ao `coordinator.service.ts` e uma chamada a ele no `ngOnDestroy` dos 3 componentes que de fato se registram.

**Arquivo:** `coordinator.service.ts`

```ts
register(instance: SelectUnion) {
  instance.idx = this.instance_counter;
  this.instances[`${this.instance_counter}`] = instance;
  this.instance_counter += 1;
}

open(instance: SelectUnion) {
  Object.values(this.instances).forEach((i) => {
    if (i.idx !== instance.idx) i.closeDropdown();
  })
}
```

Todo `single-select`/`multi-select` criado chama `register()` no `ngOnInit`, mas **nenhum dos 4 componentes chama algo equivalente a `unregister()` no `ngOnDestroy`** (o `multi-select.component.ts` nem implementa `OnDestroy`). Como o serviço é `providedIn: 'root'` (singleton para toda a sessão SPA), o dicionário `instances` só cresce:

- Toda instância destruída (modal fechado, linha de grid removida, filtro recriado, navegação entre telas) continua **referenciada para sempre** pelo serviço → o componente inteiro (e sua subtree/bindings) nunca é coletado pelo GC. Isso é um vazamento de memória clássico que se agrava com o tempo de uso da SPA.
- `open()` roda um `Object.values(...).forEach(...)` chamando `closeDropdown()` em **todas as instâncias já criadas na sessão inteira**, incluindo as já destruídas/fora do DOM. Ou seja, a cada clique para abrir *qualquer* select da tela, o custo desse loop cresce indefinidamente conforme a sessão do usuário avança — não é O(selects visíveis), é O(selects já criados desde o login).

**Correção:** adicionar `unregister(instance)` chamado em `ngOnDestroy` nos 4 componentes (todos precisam implementar `OnDestroy`), removendo a chave do dicionário. Preferir um `Map<number, SelectUnion>` a um objeto indexado por string.

---

## 2. `ChangeDetectionStrategy` padrão (Default) nos 4 componentes — ✅ Resolvido

> **Correção aplicada.** Os 4 componentes agora usam `changeDetection: ChangeDetectionStrategy.OnPush`. Em vez de caçar manualmente cada `setTimeout`/`subscribe` que muda estado, `filteredOptions`, `selectedItem` (single) e `hoveredIndex` viraram getters/setters com campo privado — o setter chama `this.cdr.markForCheck()` sempre que o valor muda, então qualquer mutação (síncrona ou assíncrona) desses três campos já dispara CD corretamente. Os demais campos (`isDropdownOpen`, `searchTerm`, `smartPlaceholder`, `displayText`, `isAllSelected`) só mudam dentro de handlers ligados ao template/`@HostListener` (auto-dirty sob OnPush) ou tiveram `markForCheck()` adicionado explicitamente nos poucos pontos assíncronos restantes (`updateSmartPlaceholder`, `updateDisplayText`, `updateAllSelectedState`).

Nenhum dos 4 usa `OnPush`. Com CD padrão, **qualquer** evento de CD disparado em qualquer lugar da aplicação (clique, timer, XHR, resize) força o Angular a reavaliar todos os bindings de todas as instâncias de select presentes na tela — inclusive as que estão fechadas e sem nenhuma mudança de estado. Em telas com várias instâncias (formulário com vários `single-select`, grid com um select por linha, painel de filtros), isso multiplica o custo de cada CD tick pelo número de selects renderizados.

**Correção:** `changeDetection: ChangeDetectionStrategy.OnPush` + chamadas explícitas a `markForCheck()`/`detectChanges()` nos pontos em que o estado interno muda fora de eventos do template (dentro dos `setTimeout` de `updateSmartPlaceholder`, no `subscribe` de `control.valueChanges`, etc.).

---

## 3. Métodos e getters chamados diretamente no template, dentro de `*ngFor` — ✅ Resolvido

> **Correção aplicada.** Cada componente ganhou um view-model `rows: { option, selected, hovered }[]`, reconstruído em `rebuildRows()` sempre que `filteredOptions` muda (via o setter do item 2). `selected`/`hovered` passaram a ser flags simples lidos direto no template (`row.selected`, `row.hovered`), sem chamar método por opção a cada CD tick:
> - **Single-select:** `selectedItem` e `hoveredIndex` são getter/setter — o setter atualiza O(1) só as 1-2 linhas afetadas (a antiga e a nova), via `Map<hash, row>` para `selectedItem` e índice direto para `hoveredIndex`. Nenhum dos ~6 pontos que atribuíam esses campos precisou ser tocado.
> - **Multi-select:** `hoveredIndex` usa o mesmo truque O(1). `selectedItems` é mutado via `push`/`splice`/reatribuição em vários métodos (não dá para interceptar com um setter só) — adicionei uma chamada explícita a `syncSelectedRows()` (O(N) via `Set`) nos 6 pontos que mutam `selectedItems` (`addOption`, `removeOption`, `removeOptionByIndex`, `selectAll`, `clearAll`, `reset`), que já é o tamanho natural do trabalho (não corre em todo CD tick).
> - Os métodos `isOptionSelected`/`isOptionHovered` foram removidos das 4 templates (substituídos por `row.selected`/`row.hovered`); `isOptionSelected` foi mantido no `.ts` do multi-select só como helper de lógica interna (`toggleOption`/`addOption`), não mais chamado pelo template. `isSelectAllHovered()` continua como método (é 1 linha só, não O(N) por opção).
> Validado com `ng build` completo (sem erros nos 4 componentes).

Em todos os 4 componentes, cada linha de opção chama funções no binding, avaliadas a cada CD tick (não só quando o dado muda):

```html
<div class="option-item" *ngFor="let option of filteredOptions; let i = index"
     [class.option-selected]="isOptionSelected(option)"
     [class.option-hovered]="isOptionHovered(i)">
```

Um dropdown com 200 opções gera 400+ chamadas de método a cada tick de CD — e isso roda a cada `mouseenter` (hover), cada tecla, cada resize da janela (ver item 5), mesmo com o dropdown fechado (ver item 6, pois o `*ngFor` roda mesmo oculto).

**Correção:** combinada com `OnPush`, transformar `selected`/`hovered` em propriedades computadas e atribuídas imperativamente nas próprias opções (view-model), evitando reavaliação implícita a cada CD.

---

## 4. `*ngFor` sem `trackBy` em 2 dos 4 componentes — ✅ Resolvido

> **Correção aplicada.** `trackByHash` foi adicionado (operando em `row: SelectOptionRow`) nos dois componentes de single-select, e atualizado nos dois de multi-select para operar em `row` em vez de `option` diretamente (consequência do item 3). Os 4 `*ngFor` agora usam `trackBy: trackByHash`.

- `multi-select.component.html` e `multi-select-field.component.html` **usam** `trackBy: trackByHash`.
- `select-field.component.html` (single, com virtual scroll) e `select-field.component.html` (dynamic, `app-select-field`) **não usam** `trackBy` no `*ngFor`.

Como `updateFilteredOptions()` sempre cria um **array novo** (`[...this.options]` ou `.filter(...)`) a cada busca — ou seja, a cada tecla digitada — sem `trackBy` o Angular destrói e recria **todos** os nós DOM das opções a cada keystroke, em vez de reaproveitar os existentes. É uma das otimizações mais baratas do Angular e está inconsistente entre os componentes.

**Correção:** adicionar `trackBy: trackByHash` (já existe o método pronto nos outros dois) nos dois componentes de single-select.

---

## 5. Dropdown sempre montado no DOM, mesmo fechado — ✅ Resolvido

> **Correção aplicada.** `.options-list` (select-all/rows/mensagens de "sem opções") nos 3 componentes agora fica atrás de `*ngIf="isDropdownOpen"`; o shell externo (`.multi-select-dropdown`/`.dropdown-content`, que faz a transição de opacidade) continua sempre montado, só o conteúdo pesado passou a ser materializado apenas na primeira abertura. Implementado junto com o item 6 (a mesma edição de template resolve os dois).

Em `multi-select.component.html`, `multi-select-field.component.html` e `select-field.component.html` (dynamic), o dropdown fica sempre no DOM, só alternando `opacity`/`visibility` via classe:

```html
<div class="multi-select-dropdown" [class.dropdown-open]="isDropdownOpen" #dropdown>
  ...
  <div class="option-item" *ngFor="let option of filteredOptions ...">
```

Isso significa que **todas** as opções (com seus bindings de `isOptionSelected`, `isOptionHovered`, SVGs de checkbox etc.) existem como nós DOM reais e são reavaliadas em CD mesmo com o campo fechado e nunca aberto pelo usuário. Em uma tela com várias instâncias fechadas (ex.: grid de 30 linhas × 1 multi-select cada), isso multiplica DOM nodes e bindings "mortos" por um fator grande.

O único componente que já mitiga parcialmente isso é o `single-select` com `cdk-virtual-scroll-viewport *ngIf="isDropdownOpen"` — que só materializa a lista quando aberta — mas de forma inconsistente com os outros 3.

**Correção:** envolver o conteúdo do dropdown com `*ngIf="isDropdownOpen"` nos 3 componentes restantes, aceitando o pequeno custo de criação no primeiro `open()` em troca da economia de manter páginas com várias instâncias fechadas muito mais leves.

---

## 6. Nenhuma virtualização de lista fora do `single-select` "components" — ✅ Resolvido

> **Correção aplicada.** Os 3 componentes restantes (`multi-select`, `multi-select-field`, `app-select-field`) agora usam `cdk-virtual-scroll-viewport`/`*cdkVirtualFor` no lugar do `*ngFor` puro, com `itemSize` fixo (36-40px, `.option-item` ganhou altura fixa + `.option-text` com `text-overflow: ellipsis` dentro do escopo `.options-viewport`) e `getHeight()` (mesmo padrão do `single-select`: até 5 opções calcula altura exata, acima disso trava em 200px). A linha "Selecionar/Desmarcar Todos" (multi-select) e "Adicionar novo valor" (`app-select-field`) ficaram **fora** do viewport virtualizado, como itens fixos acima/abaixo dele.
>
> Como `app-select-field`/`app-multi-select-field` vivem no `DynamicComponentsModule` (usado pelo módulo de filtro), que não importava `ScrollingModule`, foi necessário adicioná-lo lá — `shared.module.ts` (onde estão `single-select`/`multi-select` "base") já o importava.
>
> Validado com `ng build` completo (sem erros). **Não verificado visualmente em navegador** — vale conferir no dev server que a truncagem de texto longo (ellipsis) e a altura fixa das linhas não introduziram nenhuma regressão visual perceptível, especialmente no multi-select com ícone de "locked".

Só `shared/components/select-field` usa `cdk-virtual-scroll-viewport`. Os outros 3 (`multi-select`, `multi-select-field`, `app-select-field`) renderizam **todas** as opções como nós DOM reais dentro de `.options-list`. Para listas grandes (escolas, alunos, turmas — facilmente centenas de itens), isso é caro tanto para o primeiro render quanto para memória, e piora com o item 5 (dropdown sempre montado).

**Correção:** estender `cdk-virtual-scroll-viewport` (já usado em um dos componentes, reaproveitar o padrão) para os outros 3.

---

## 7. `normalizeText` recalculado do zero a cada tecla digitada — ✅ Resolvido

> **Correção aplicada.** Cada componente ganhou um `normalizedByHash: Map<string, string>`, reconstruído (`rebuildNormalizedCache()`) toda vez que `options` muda — no `ngOnChanges`/`ngOnInit` dos 3 componentes com `options` como `@Input` simples, e dentro do próprio setter no `multi-select-field` (que já expunha `options` como getter/setter). `updateFilteredOptions()` agora lê `normalizedByHash.get(option.hash)` em vez de chamar `normalizeText(option.descricao)` por opção a cada tecla (com fallback para `normalizeText` inline se a opção não estiver no cache, defensivo).

Nos 4 componentes, o filtro de busca faz:

```ts
this.filteredOptions = this.options.filter((option) =>
  this.normalizeText(option.descricao).includes(normalizedSearchTerm),
);
```

`normalizeText` roda `.normalize("NFD")` + ~11 `.replace()` em regex **por opção, a cada tecla digitada** — ou seja, para 500 opções e uma busca de 10 caracteres, são 5.000 normalizações completas em vez de 500 (feitas uma única vez) + 10 (só o termo buscado).

**Correção:** normalizar `descricao` de cada opção **uma vez**, no momento em que `options` é atribuído (cachear em um campo tipo `_normalizedDescricao` junto com a opção), e normalizar apenas o termo de busca a cada tecla. Isso reduz o custo por tecla de O(opções × custo-normalização) para O(opções) (um `.includes` simples) + O(1) (normalizar o termo).

---

## 8. `JSON.stringify` para comparar arrays de hashes — ✅ Resolvido

> **Correção aplicada.** Adicionado `private hashesDiffer(value: unknown): boolean` (compara `Array.isArray` + tamanho + item a item) nos dois componentes, substituindo o `JSON.stringify(...) !== JSON.stringify(...)` dentro do `subscribe` de `control.valueChanges`.

Em `multi-select.component.ts` e `multi-select-field.component.ts`:

```ts
this.control?.valueChanges.subscribe((value) => {
  if (JSON.stringify(value) !== JSON.stringify(this.selectedItems.map((item) => item.hash))) {
    this.syncSelectedItems(value);
  }
});
```

Serializa dois arrays para string a cada emissão do `FormControl` — inclusive as emissões geradas pelo próprio componente (`updateFormControl()` chama `setValue`, que dispara de volta este mesmo `subscribe`). É overhead de alocação/serialização evitável para uma simples comparação de arrays de primitivos.

**Correção:** comparar por tamanho + `every()` (ou um `Set`), sem serialização:
```ts
const changed = value?.length !== this.selectedItems.length
  || !value.every((h, i) => h === this.selectedItems[i]?.hash);
```

---

## 9. Assinatura duplicada de `control.valueChanges` em `multi-select.component.ts` — ✅ Resolvido

> **Correção aplicada.** As duas assinaturas foram unificadas em uma só (mantendo a checagem via `JSON.stringify` já existente — a troca por uma comparação mais barata é o item 8, não alterado aqui), com `takeUntil(this.destroy$)` e `ngOnDestroy` implementado.

No `ngOnInit` (linhas 79 e 86), o componente assina `control.valueChanges` **duas vezes** — a primeira incondicional, a segunda com a checagem do item 8 — e nenhuma das duas é armazenada/desinscrita (não há `ngOnDestroy`). Cada emissão do controle roda `syncSelectedItems` (um `forEach` + `find` = O(n×m)) **duas vezes**, e a assinatura sobrevive ao componente indefinidamente caso o `FormControl`/`FormGroup` seja de escopo maior que o componente (ex.: um serviço, ou um form recriado por outro componente pai) — outra fonte de leak, somada à do item 1.

**Correção:** manter uma única assinatura, guardada em `Subscription`/`takeUntil(this.destroy$)`, e implementar `OnDestroy`.

---

## 10. `updateSmartPlaceholder`: leitura de layout (`offsetWidth`) + `setTimeout(0)` em excesso — ✅ Resolvido

> **Correção aplicada.** O `@HostListener('window:resize')` foi removido dos 2 multi-select; no lugar, um `ResizeObserver` é criado em `ngAfterViewInit()` observando só `multiSelectInput.nativeElement`, e desconectado (`resizeObserver?.disconnect()`) no `ngOnDestroy`. Agora o recálculo só dispara quando aquele input específico muda de tamanho de verdade (painel abrindo/fechando, sidebar recolhendo), não a cada pixel de resize da janela inteira nem para instâncias fechadas/fora da tela. O corpo de `updateSmartPlaceholder()` (leitura de `offsetWidth` + `setTimeout`) não foi alterado — só o gatilho.

Presente em `multi-select.component.ts` e `multi-select-field.component.ts`. É chamado a cada seleção/remoção de item **e** a cada `window:resize` — e cada chamada agenda um `setTimeout(() => { ...offsetWidth... }, 0)` que força layout (reflow) e roda um loop O(itens selecionados) estimando largura de texto por número de caracteres.

Como o listener de resize é por **instância** (item 11), um resize de janela dispara esse cálculo de layout para **cada** select/multi-select vivo na página simultaneamente, inclusive fechados/fora da viewport, durante todo o arraste de redimensionamento (o evento `resize` dispara continuamente).

**Correção:**
- Trocar o `window:resize` global por `ResizeObserver` no próprio elemento do input — só recalcula quando *aquele* elemento realmente muda de tamanho (ex.: painel lateral abrindo/fechando), não a cada pixel de resize da janela inteira.
- Debounce/throttle do recálculo (ex.: `requestAnimationFrame` em vez de `setTimeout(0)`).
- Pular o recálculo quando o componente está fechado/fora da tela (`IntersectionObserver` ou checagem simples de `offsetParent`).

---

## 11. `@HostListener` por instância (`document:click`, `window:resize`) — ✅ Resolvido

> **Correção aplicada.** `document:click`: `app-select-field`, `app-multi-select-field` e `mini-select` (os 3 que usavam `@HostListener('document:click')` próprio) agora usam o `ClickOutsideService` já existente (o mesmo que `single-select`/`multi-select` "base" já usavam via diretiva `[clickOutside]`), com **um único** listener nativo no `document`. `window:resize`: resolvido junto com o item 10 — trocado por `ResizeObserver` por elemento, eliminando o outro listener global por instância.

Cada instância dos componentes registra seus próprios listeners globais (`document:click` para fechar ao clicar fora, `window:resize` para o smart placeholder). Em uma tela com N selects, um único clique em qualquer lugar do documento dispara N handlers, cada um fazendo `container.nativeElement.contains(event.target)` — quando, na prática, só a instância atualmente aberta (já rastreada pelo `MultiSelectCoordinatorService`) precisa reagir.

**Correção:** centralizar em um único listener a nível de serviço/coordinator, que mantém a referência da instância aberta e despacha só para ela — elimina o fan-out O(N) por clique/resize.

---

## 12. `scrollToHoveredItem` faz `querySelector` com seletor de string a cada tecla de navegação — ✅ Resolvido

> **Correção aplicada.** Nos 4 componentes (agora todos virtualizados via CDK, itens 5/6), `scrollToHoveredItem()` passou a usar `CdkVirtualScrollViewport.scrollToIndex(hoveredIndex, 'smooth')` em vez de `querySelector('.option-item:nth-child(N)')` dentro de um `setTimeout(0)`. Isso não é só mais barato — é uma correção real: com virtual scroll, nem todas as N opções existem como nós DOM o tempo todo (só as visíveis são renderizadas), então um `querySelector` por `nth-child` para um item fora da janela renderizada simplesmente não encontra nada e a navegação por teclado silenciosamente para de rolar a lista. `scrollToIndex` funciona por índice lógico independente do que está renderizado no momento. Nos 2 multi-select, `hoveredIndex === -1` (linha "Selecionar todos", agora fora do viewport) sai cedo sem chamar `scrollToIndex` — essa linha é estática e sempre visível.

```ts
private scrollToHoveredItem(): void {
  setTimeout(() => {
    const hoveredElement = this.dropdown?.nativeElement?.querySelector(
      `.option-item:nth-child(${this.hoveredIndex + 1})`,
    );
    ...
  }, 0);
}
```

Roda uma busca DOM por seletor CSS a cada pressão de seta (inclusive repetição de tecla segurada, várias vezes por segundo), dentro de um `setTimeout(0)`.

**Correção:** manter uma lista de `ViewChildren`/refs indexadas pelas próprias opções (evita parsing de seletor CSS) e usar `requestAnimationFrame` em vez de macrotask arbitrário.

---

## 13. CSS duplicado / morto — ✅ Resolvido

> **Correção aplicada.** As duas declarações de `.option-item` em `select-field.component.scss` (single, com virtual scroll) foram mescladas em um único bloco, preservando o resultado final efetivo da cascata anterior (altura fixa de 36px + padding `0 10px` da segunda declaração, `margin`/`gap`/`border-radius`/estados `:hover`/`.option-selected`/`.option-hovered` da primeira, `.option-locked` da segunda).

`select-field.component.scss` (single, com virtual scroll) define a classe `.option-item` **duas vezes** (uma vez para o item "normal" e outra mais abaixo, já pensada para o virtual scroll, sobrescrevendo a primeira). Não é o maior ofensor de performance, mas é sintoma direto da duplicação estrutural (item 0): regras conflitantes/sobrescritas aumentam o custo de resolução de cascata e indicam manutenção feita por cópia-e-cola em vez de reutilização.

---

## Resumo priorizado

| # | Problema | Impacto | Esforço | Prioridade |
|---|---|---|---|---|
| 1 | Leak no `CoordinatorService` (sem `unregister`) | Alto — cresce com a sessão inteira | Baixo | ✅ Resolvido |
| 9 | Dupla assinatura de `valueChanges` sem unsubscribe | Alto — leak + trabalho duplicado | Baixo | ✅ Resolvido |
| 5 | Dropdown sempre montado (sem `*ngIf`) | Alto em telas com várias instâncias | Baixo | ✅ Resolvido |
| 4 | `trackBy` ausente em 2 componentes | Médio-Alto — recria DOM a cada tecla | Baixo | ✅ Resolvido |
| 7 | `normalizeText` recalculado por tecla | Médio-Alto em listas grandes | Médio | ✅ Resolvido |
| 6 | Sem virtual scroll em 3 de 4 | Alto para listas grandes | Médio | ✅ Resolvido |
| 11 | Listener global por instância | Médio, cresce com nº de selects na tela | Médio | ✅ Resolvido |
| 10 | `offsetWidth`/`setTimeout` em excesso no resize | Médio, picos durante resize | Médio | ✅ Resolvido |
| 2 | Sem `OnPush` | Médio, transversal | Médio-Alto | ✅ Resolvido |
| 3 | Métodos/getters em binding de `*ngFor` | Médio, depende de nº de opções | Médio | ✅ Resolvido |
| 8 | `JSON.stringify` para diff de arrays | Baixo | Baixo | ✅ Resolvido |
| 12 | `querySelector` a cada navegação por teclado | Baixo | Baixo | ✅ Resolvido |
| 13 | CSS duplicado | Baixo (qualidade) | Baixo | ✅ Resolvido |
| 0 | 4 implementações paralelas quase idênticas | Estrutural — multiplica esforço de qualquer fix acima | Alto | ❌ Descartado (decisão do time — não será consolidado) |

**Status final:** todos os itens de performance identificados (1 a 13) foram resolvidos e validados com `ng build` completo. O único item não implementado é o 0 (consolidação estrutural dos 4 componentes em um só), descartado por decisão do time — os 4 continuam existindo separadamente, então qualquer nova otimização futura precisa ser replicada nos 4.

**Pendência de verificação:** os itens 5/6 (virtual scroll + `*ngIf`) não foram conferidos visualmente em navegador — vale um teste manual no dev server (truncagem de texto, altura fixa das linhas, scroll por teclado) antes de considerar o trabalho fechado.
