# AtlasShell — TopBar + Painéis Laterais

base: [readme.md](./readme.md)

---

## Objetivo

Evoluir o `AtlasShellComponent` (hoje só um `<router-outlet>`) para um layout de três zonas com barra superior própria — independente do `portal-modulo`.

---

## Layout alvo

```
┌──────────────────────────────────────────────────────────┐
│  [☰]                                              [▷]   │  ← TopBar (60px fixo)
├──────────┬───────────────────────────────────┬───────────┤
│          │                                   │           │
│  Left    │        <router-outlet>            │  Right    │
│  Panel   │    (scroll interno, flex: 1)      │  Panel    │
│  200px   │                                   │  200px    │
│          │                                   │           │
└──────────┴───────────────────────────────────┴───────────┘
   ↑ toggle pelo ícone esquerdo da TopBar        ↑ toggle pelo ícone direito
```

- TopBar: altura fixa 60px, fundo branco, borda inferior — alinha visualmente com o header do `DefaultShell`
- LeftPanel: 200px de largura, visível/oculto via toggle; começa fechado
- RightPanel: 200px de largura, visível/oculto via toggle; começa fechado
- Área central: ocupa o espaço restante, scroll interno

---

## Estrutura de componentes

```
atlas-shell/
  atlas-shell.component.ts       ← estado dos painéis (leftOpen, rightOpen)
  atlas-shell.component.html     ← layout grid + slots de conteúdo
  atlas-shell.component.scss     ← CSS Grid responsivo

  atlas-top-bar/
    atlas-top-bar.component.ts   ← emite (toggleLeft) e (toggleRight)
    atlas-top-bar.component.html ← dois ícones + ng-content para itens extras
    atlas-top-bar.component.scss

  atlas-left-panel/
    atlas-left-panel.component.ts
    atlas-left-panel.component.html   ← <ng-content> para projeção futura
    atlas-left-panel.component.scss

  atlas-right-panel/
    atlas-right-panel.component.ts
    atlas-right-panel.component.html  ← <ng-content> para projeção futura
    atlas-right-panel.component.scss
```

---

## Implementação — AtlasShellComponent

### Template

```html
<!-- atlas-shell.component.html -->
<div class="atlas-shell" [class.left-open]="leftOpen" [class.right-open]="rightOpen">

  <atlas-top-bar
    class="atlas-shell__top"
    (toggleLeft)="leftOpen = !leftOpen"
    (toggleRight)="rightOpen = !rightOpen">
  </atlas-top-bar>

  <atlas-left-panel class="atlas-shell__left"></atlas-left-panel>

  <main class="atlas-shell__content">
    <router-outlet></router-outlet>
  </main>

  <atlas-right-panel class="atlas-shell__right"></atlas-right-panel>

</div>
```

### CSS (Grid)

```scss
// atlas-shell.component.scss
.atlas-shell {
  display: grid;
  grid-template-rows: 60px 1fr;
  grid-template-columns: 0 1fr 0;
  grid-template-areas:
    "top   top     top"
    "left  content right";
  height: 100vh;
  transition: grid-template-columns 0.25s ease;

  &.left-open  { grid-template-columns: 200px 1fr 0; }
  &.right-open { grid-template-columns: 0 1fr 200px; }
  &.left-open.right-open { grid-template-columns: 200px 1fr 200px; }
}

.atlas-shell__top     { grid-area: top; }
.atlas-shell__left    { grid-area: left; overflow: hidden; }
.atlas-shell__content { grid-area: content; overflow-y: auto; }
.atlas-shell__right   { grid-area: right; overflow: hidden; }
```

### Estado (TypeScript)

```typescript
// atlas-shell.component.ts
export class AtlasShellComponent {
  leftOpen  = false;
  rightOpen = false;
}
```

---

## Implementação — AtlasTopBarComponent

```html
<!-- atlas-top-bar.component.html -->
<nav class="atlas-top-bar">
  <button class="atlas-top-bar__btn" (click)="toggleLeft.emit()">
    <i class="fa fa-bars"></i>
  </button>

  <ng-content></ng-content>

  <button class="atlas-top-bar__btn atlas-top-bar__btn--right" (click)="toggleRight.emit()">
    <i class="fa fa-columns"></i>
  </button>
</nav>
```

```typescript
// atlas-top-bar.component.ts
@Component({ selector: 'atlas-top-bar', ... })
export class AtlasTopBarComponent {
  @Output() toggleLeft  = new EventEmitter<void>();
  @Output() toggleRight = new EventEmitter<void>();
}
```

```scss
// atlas-top-bar.component.scss
.atlas-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 1px 3px rgba(0,0,0,.08);

  &__btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: #555;
    &:hover { color: #000; }
  }
}
```

---

## Implementação — Painéis (Left e Right)

Por hora, `atlas-left-panel` e `atlas-right-panel` são apenas shells de `<ng-content>` com fundo e borda:

```html
<!-- atlas-left-panel.component.html -->
<div class="atlas-panel atlas-panel--left">
  <ng-content></ng-content>
</div>
```

```scss
.atlas-panel {
  height: 100%;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;

  &--right { border-right: none; border-left: 1px solid #e0e0e0; }
}
```

---

## Registro no ShellsModule

Todos os sub-componentes do shell são declarados e exportados apenas no `ShellsModule`:

```typescript
// shells.module.ts (adição)
declarations: [
  ...,
  AtlasShellComponent,
  AtlasTopBarComponent,
  AtlasLeftPanelComponent,
  AtlasRightPanelComponent,
],
```

Não é necessário exportar os sub-componentes — eles só são usados internamente pelo `AtlasShellComponent`.

---

## Próximos passos

- [X ] Criar `AtlasTopBarComponent` (ícones, @Output toggleLeft/toggleRight)
- [X ] Criar `AtlasLeftPanelComponent` (ng-content vazio)
- [X ] Criar `AtlasRightPanelComponent` (ng-content vazio)
- [X ] Atualizar `AtlasShellComponent` com o layout grid e estado dos painéis
- [X ] Registrar os 3 novos componentes no `ShellsModule`
- [X ] Futuramente: projetar conteúdo real nos painéis via `<ng-content>` ou slots nomeados


