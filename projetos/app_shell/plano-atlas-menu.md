# Plano: atlas-menu — Refactor completo

## Context

O componente `atlas-menu` foi criado como ponto de entrada alternativo para o menu de navegação, abrindo centralizado (overlay) em vez de dropdown. A estrutura básica existe, mas a maior parte do comportamento ainda são placeholders. Este plano implementa as features restantes: search fuzzy, navegação por teclado bidirecional, toggle de ordenação A-Z, header/footer visuais, e layout de colunas automático por CSS grid.

---

## Arquivos alterados

Somente 3 arquivos (nenhuma alteração em `shells.module`, `atlas-shell` ou `atlas-top-bar` — já estão corretos):

```
src/app/shells/atlas-shell/atlas-menu/
  atlas-menu.component.ts   ← full rewrite
  atlas-menu.component.html ← full rewrite
  atlas-menu.component.scss ← atualizar internos (scrim/container preservados)
```

---

## TypeScript — atlas-menu.component.ts

### Interface nova

```typescript
interface FilteredGroup {
  group: MenuItem;
  /** Nome do grupo fez match fuzzy direto */
  selfMatch: boolean;
  /** Keys dos filhos que fizeram match fuzzy */
  matchedChildKeys: Set<string>;
}
```

### Constantes de layout (topo do arquivo, fora da classe)

```typescript
const GRID_HEIGHT_PX = 400;  // deve bater com a height CSS do .subitems-grid
const ITEM_HEIGHT_PX = 32;
```

### Signals (substituem _activeGroupId, removem useTwoColumns/rowCount)

| Signal | Tipo | Descrição |
|---|---|---|
| `query` | `signal('')` | Texto do input de busca |
| `sortAlpha` | `signal(false)` | Toggle ordenação A-Z |
| `focusZone` | `signal<'categories' \| 'subitems'>('categories')` | Zona com foco de teclado |
| `activeCatIdx` | `signal(0)` | Índice da categoria ativa em `enabledGroups()` |
| `activeSubIdx` | `signal(0)` | Índice do subitem ativo em `enabledSubitems()` |

### Computeds

```
allGroups        ← menu().Menu filtrado por SubMenu.length > 0
filteredGroups   ← allGroups.map(group → { group, selfMatch, matchedChildKeys })
enabledGroups    ← filteredGroups onde (!query || selfMatch || matchedChildKeys.size > 0)
activeGroupData  ← enabledGroups[clamp(activeCatIdx, 0, len-1)]  (fonte única de verdade)
displaySubitems  ← [{ item, enabled }] — todos subitens do grupo ativo, sorted se sortAlpha,
                   cada um anotado: enabled = !query || fg.selfMatch || matchedChildKeys.has(key)
enabledSubitems  ← displaySubitems filtrado por enabled === true  (array navegado pelo teclado)
activeSubKey     ← itemKey(enabledSubitems[activeSubIdx])  — ponte índice-kb ↔ template
itemsPerColumn   ← Math.floor(400 / 32) = 12  (constante)
columnCount      ← Math.ceil(enabledSubitems.length / 12)
```

**Nota crítica**: `activeCatIdx` indexa sempre em `enabledGroups()`. Mouse hover e teclado ambos atualizam este único índice. Não há `_mouseGroupId` separado.

**Nota crítica 2**: `activeSubIdx` indexa em `enabledSubitems` (somente enabled). O template usa `activeSubKey` para comparar por `itemKey` — nunca compare índices posicionais entre `displaySubitems` e `enabledSubitems`.

**`effect()` para resetar `activeSubIdx`** ao trocar de categoria (no constructor):
```typescript
effect(() => { this.activeCatIdx(); this.activeSubIdx.set(0); });
```

### ViewChild + AfterViewInit

```typescript
@ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

ngAfterViewInit(): void {
  this.searchInputRef.nativeElement.focus();
}
```

### Keyboard handler — substituir `@HostListener('document:keydown.escape')` por:

```typescript
@HostListener('document:keydown', ['$event'])
onKeydown(event: KeyboardEvent): void {
  const { key, ctrlKey, metaKey, altKey } = event;

  // Qualquer letra → foca input (deixa o char chegar no input)
  if (key.length === 1 && !ctrlKey && !metaKey && !altKey) {
    this.searchInputRef.nativeElement.focus();
    return;
  }

  switch (key) {
    case 'Escape':  this.query() ? this.clearSearch() : this.close.emit(); break;
    case 'Enter':   event.preventDefault(); this.activateSelected(); break;
    case 'ArrowDown': event.preventDefault();
      this.focusZone() === 'categories' ? this.moveCat(1) : this.moveSubVertical(1); break;
    case 'ArrowUp': event.preventDefault();
      this.focusZone() === 'categories' ? this.moveCat(-1) : this.moveSubVertical(-1); break;
    case 'ArrowRight': event.preventDefault();
      this.focusZone() === 'categories' ? this.focusFirstSubitem() : this.moveSubHorizontal(1); break;
    case 'ArrowLeft': event.preventDefault();
      if (this.focusZone() === 'subitems') {
        this.subitemColumn(this.activeSubIdx()) === 0
          ? this.focusZone.set('categories')
          : this.moveSubHorizontal(-1);
      }
      break;
  }
}
```

### Métodos de navegação

**`moveCat(delta)`** — wrapping entre `enabledGroups()`:
```
activeCatIdx = (activeCatIdx + delta + len) % len
reset activeSubIdx = 0
```

**`focusFirstSubitem()`** — move foco de teclado para subitens:
```
if enabledSubitems().length > 0:
  focusZone = 'subitems', activeSubIdx = 0
```

**`moveSubVertical(delta)`** — up/down na mesma coluna CSS, somente entre itens habilitados, com wrap dentro da coluna:
```
currentItem = enabledSubitems()[activeSubIdx]
currentDisplayIdx = displaySubitems().indexOf(currentItem)  ← por referência de objeto
currentCol = Math.floor(currentDisplayIdx / itemsPerColumn)
colEnabled = displaySubitems() slice de currentCol, filtrado por enabled
next = (posInCol + delta + colEnabled.length) % colEnabled.length (wrap)
activeSubIdx = enabledSubitems().indexOf(colEnabled[next])
```

**`moveSubHorizontal(delta)`** — left/right entre colunas, mantendo posição relativa de linha:
```
targetCol = currentCol + delta
if targetCol < 0 → focusZone = 'categories'; return
if targetCol >= columnCount → return (sem ação)
colEnabled da targetCol filtrado por enabled
prefer mesmo rowInCol, senão mais próximo
activeSubIdx = enabledSubitems().indexOf(found)
```

**`activateSelected()`**:
```
if focusZone === 'categories' → focusFirstSubitem()
else → navigate(enabledSubitems()[activeSubIdx].item)
```

**`hoverGroup(fg)`** — sincroniza mouse com activeCatIdx:
```
if !isGroupEnabled(fg) return
idx = enabledGroups().indexOf(fg)
if idx >= 0: activeCatIdx.set(idx), activeSubIdx.set(0)
```

### Helpers de template

| Método | Retorno |
|---|---|
| `isGroupEnabled(fg)` | `!query() \|\| fg.selfMatch \|\| fg.matchedChildKeys.size > 0` |
| `isCatKbActive(fg)` | `focusZone() === 'categories' && activeGroupData() === fg` |
| `isSubKbActive(si)` | `focusZone() === 'subitems' && activeSubKey() === itemKey(si.item)` |
| `subitemColumn(enabledIdx)` | `Math.floor(displaySubitems().indexOf(enabledSubitems()[enabledIdx]) / itemsPerColumn())` |

### Fuzzy matching (copiar da command-palette, tornar private)

```typescript
private fold(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
private fuzzyMatches(query: string, label: string): boolean {
  const qf = this.fold(query).replace(/\s/g, '');
  const tf = [...label].map(c => this.fold(c));
  if (!qf) return true;
  let qi = 0;
  for (let i = 0; i < tf.length && qi < qf.length; i++) {
    if (tf[i] === qf[qi]) qi++;
  }
  return qi === qf.length;
}
```

### trackBy functions

```typescript
trackByFgKey = (_: number, fg: FilteredGroup): string => this.itemKey(fg.group);
trackByKey   = (_: number, si: { item: MenuItem; enabled: boolean }): string => this.itemKey(si.item);
```

---

## HTML — atlas-menu.component.html

```
atlas-menu-scrim (click=onScrimClick, role=dialog)
  atlas-menu-container
    .menu-header
      .menu-header__brand [aria-hidden]
        .menu-header__logo
          .menu-header__logo-bar--a   ← gradiente verde (idêntico ao top-bar)
          .menu-header__logo-bar--b   ← gradiente verde invertido
        span.menu-header__brand-name "atlas"
      .menu-header__search
        i.fas.fa-search
        input #searchInput (input)="setQuery($any($event.target).value)" autocomplete=off
        button.menu-header__clear *ngIf="query()" (click)="clearSearch()"
          i.fas.fa-times

    .atlas-menu-panel
      .atlas-menu-panel__categories
        [*ngFor fg of filteredGroups(); trackBy: trackByFgKey]
          button.atlas-menu-panel__cat-btn
            [class.--active]="activeGroupData() === fg"
            [class.--kb]="isCatKbActive(fg)"
            [class.--disabled]="!isGroupEnabled(fg)"
            (mouseenter)="hoverGroup(fg)"  (click)="hoverGroup(fg)"
        [ng-template #skeletonCats]  (fallback *ngIf !allGroups().length)
        <!-- recentes — a implementar -->

      .atlas-menu-panel__subitems [*ngIf="activeGroupData()"]
        .atlas-menu-panel__subitems-header
          span.subitems-title  activeGroupData()!.group.Nome
          button.sort-btn [class.--active]="sortAlpha()" (click)="toggleSort()"
            i.fas.fa-sort-alpha-down  "A–Z"
        .atlas-menu-panel__subitems-grid
          [style.grid-template-rows]="'repeat(' + itemsPerColumn() + ', auto)'"
          [*ngFor si of displaySubitems(); trackBy: trackByKey]
            button.subitem
              [class.--disabled]="!si.enabled"
              [class.--kb]="isSubKbActive(si)"
              [attr.tabindex]="si.enabled ? 0 : -1"
              (click)="si.enabled && navigate(si.item)"

    .menu-footer [aria-hidden]
      .menu-footer__hint  <kbd>↑↓</kbd> categorias
      .menu-footer__hint  <kbd>→</kbd> subitens
      .menu-footer__hint  <kbd>↵</kbd> abrir
      .menu-footer__hint  <kbd>esc</kbd> {{ query() ? 'limpar' : 'fechar' }}
```

---

## SCSS — atlas-menu.component.scss

Preservar `.atlas-menu-scrim` e `.atlas-menu-container` (já corretos).

**`.menu-header`**: flex row, padding 12px 16px, border-bottom, gap 12px
- `&__logo`: 20×20px, dois bars (copy do top-bar — gradiente verde)
- `&__brand-name`: Archivo 800, 15px, #191F88
- `&__search`: flex, background #f8f9fb, border 1px #ebedf1, border-radius 8, focus-within → border #242cc2
- `&__clear`: 20×20px, fa-times, sem borda, cursor pointer

**`.atlas-menu-panel`**: flex row, flex 1, overflow hidden

**`.atlas-menu-panel__categories`**: min-width 220px, flex column, border-right, overflow-y auto
- `__cat-btn--active`: background #f0f1ff
- `__cat-btn--kb`: background #ecedff + `outline: 2px solid #242cc2; outline-offset: -2px`
- `__cat-btn--disabled`: opacity 0.3, cursor default, sem hover

**`.atlas-menu-panel__subitems`**: flex column, overflow-x auto (acomoda colunas largas)
- `__subitems-header`: flex row, space-between, padding 8px 16px 4px
- `__subitems-title`: Archivo 600 13px uppercase #65686e
- `__sort-btn`: border 1px #ebedf1, border-radius 6, 11px, Nunito 600; `--active`: bg #ecedff, color #242cc2, border #a7abe6
- `__subitems-grid`: `display: grid; grid-auto-flow: column; gap: 1px 8px; height: 400px;`  
  _(grid-template-rows definido via `[style]` binding — não colocar no CSS)_
- `__subitem--disabled`: opacity 0.3, cursor default
- `__subitem--kb`: background #ecedff + `outline: 2px solid #242cc2; outline-offset: -2px`

**`.menu-footer`**: flex row, padding 8px 16px, background #f8f9fb, border-top
- `&__hint`: flex, gap 5, Nunito 11px; `kbd`: border 1px #c3c8d1, border-radius 4, padding 1px 5px

**Remover**: `.recentes`, `.--two-col` modifier

---

## Decisões de design

| Decisão | Escolha | Motivo |
|---|---|---|
| Layout colunas | `grid-auto-flow: column` + `grid-template-rows` binding | Sem quirks do CSS columns; `itemsPerColumn` constante (400/32=12) torna a nav por teclado determinística |
| Fonte da verdade ativo | `activeCatIdx` único (mouse + teclado ambos atualizam) | Elimina race condition entre `_mouseGroupId` e índice kb |
| `displaySubitems` como `{ item, enabled }[]` | Array anotado | Template itera UMA vez com todas as informações; evita chamadas de método por item no template |
| Fuzzy match | Copiar `fold` + subsequence da command-palette | Sem shared utility; algoritmo simples, melhor que extrair |
| Subitens disabled | Todos visíveis, dimmed (`opacity 0.3`) + `tabindex=-1` | UX: usuário vê o que existe; disabled não é focável por tab |
| Scroll subitems | `overflow-x: auto` no container dos subitems | Acomoda muitas colunas sem quebrar o layout do dialog |

---

## Verificação

1. Compilar: `cd c:\projects\estrutura-pedagogica\frontend && ng build` — sem erros TypeScript
2. Abrir a app, clicar no botão `fa-border-all` na top-bar → modal abre centralizado
3. Input recebe foco automaticamente
4. Digitar "cad" → grupos/subitens sem match ficam dimmed; com match ficam normais
5. `↑↓` navega categorias com wrap; `→` / `↵` move para subitens
6. `↓↑←→` navega subitens em colunas; `←` na coluna 0 volta para categorias
7. `Esc` com query → limpa; `Esc` sem query → fecha
8. Toggle A-Z → subitens reordenam
9. Clicar no scrim → fecha
