# AppMenu — Novo Componente de Menu

base: [readme.md](./readme.md) · [nova_barra_superior.md](./nova_barra_superior.md)

---

## Contexto atual

O `portal-modulo` tem dois componentes de menu:

| Componente | Onde aparece | Como funciona |
|---|---|---|
| `PortalMenuComponent` | Top bar (desktop: dropdown, mobile: modal) | `ngbDropdown` + `PortalModalComponent` |
| `MenuLateralComponent` | Sidebar 250px | `ul/li` expandível com `toggleMenuExpanded()` |

Ambos consomem o mesmo `MenuService` via `$menuCache: BehaviorSubject<MenuDTO>` e chamam `doMenuClick(item)` para navegar.

### Estrutura de dados (backend → frontend)

```typescript
// MenuItem — o que vem do servidor
{
  Nome: string           // "Frequência", "Boletim", ...
  Rota: string           // "/lancamento-frequencia/listar" ou modal id
  Icone: string          // classe CSS FontAwesome: "fas fa-calendar-check"
  Tipo: MenuItemTipo     // REDIRECT_GET | REDIRECT_POST | BLANK_GET | BLANK_POST | MODAL | AGRUPADOR | ROTA_OCULTA
  SubMenu: MenuItem[]    // itens filhos (agrupador)
  IsDesktop: boolean
  IsMobile: boolean
  PermissaoNecessaria: string
  Hidden: boolean        // estado local de collapse (lateral)
}
```

**Caching:** `MenuService` já faz cache em `localStorage` com versioning — o novo componente não precisa mudar isso.

**Navegação:** `MenuService.doMenuClick(item)` já trata todos os tipos (redirect, post, blank, modal).

**Rastreamento:** `MenuService.$onMenuNavigation: Subject<MenuItem>` — emite em cada clique. Será o canal do command palette.

---

## Problemas do menu atual

1. **Dois componentes sem relação** — mesmos dados, lógica de filtragem duplicada
2. **`ngbDropdown` acoplado ao template** — difícil reutilizar em contexto de sidebar ou command palette
3. **Ícones via `<i [ngClass]="item.Icone">`** — funciona, mas sem type safety; depende de FA CSS global
4. **Sem acessibilidade** — falta `role`, `aria-expanded`, `aria-label`, navegação por teclado
5. **`*ngFor` sem `trackBy`** — re-render completo ao mudar usuário/perfil
6. **Dados não compartilhados com command palette** — precisarão ser o mesmo source

---

## Objetivo

Criar um **`AppMenuComponent`** reutilizável que:
- Substitui `PortalMenuComponent` e `MenuLateralComponent` como surface de exibição
- Mantém `MenuService` como única fonte de verdade (sem alterar backend)
- Expõe os itens de menu em formato plano para o **command palette** (C-k)
- Suporta dois modos de exibição: `horizontal` (top bar) e `vertical` (sidebar/panel)

---

## Arquitetura

```
src/app/menu/
  app-menu.component.ts        ← lê MenuService via toSignal(), expõe items achatados
  app-menu.component.html      ← switch entre modo horizontal e vertical
  app-menu.component.scss

  app-menu-item/
    app-menu-item.component.ts ← item individual + submenu dropdown/accordion
    app-menu-item.component.html
    app-menu-item.component.scss

  menu.service.facade.ts       ← facade: filtra, achata e expõe como Signal
                                  (reutilizado pelo command palette)
```

---

## MenuFacadeService

Camada fina sobre `MenuService` existente. Expõe Signals e a lista plana para o command palette.

```typescript
// menu.service.facade.ts
import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MenuService } from 'src/portal-modulo/shared/services/menu.service';
import { MenuItem, MenuItemTipo } from 'src/portal-modulo/shared/model/menu-item';

export interface FlatMenuItem {
  item:      MenuItem;
  breadcrumb: string[];   // ['Relatórios', 'Disciplinas']
}

@Injectable({ providedIn: 'root' })
export class MenuFacadeService {
  private menuService = inject(MenuService);

  readonly menu = toSignal(this.menuService.$menuCache, { requireSync: true });

  readonly flatItems = computed<FlatMenuItem[]>(() => {
    const groups = this.menu().Menu ?? [];
    const result: FlatMenuItem[] = [];

    for (const group of groups) {
      if (group.SubMenu?.length) {
        for (const child of group.SubMenu) {
          result.push({ item: child, breadcrumb: [group.Nome] });
        }
      } else if (group.Tipo !== MenuItemTipo.AGRUPADOR) {
        result.push({ item: group, breadcrumb: [] });
      }
    }

    return result;
  });

  navigate(item: MenuItem) {
    this.menuService.doMenuClick(item);
  }

  readonly onNavigation$ = this.menuService.$onMenuNavigation;
}
```

`flatItems` é o contrato com o command palette: lista plana, com breadcrumb, sem lógica de exibição.

---

## AppMenuComponent

```typescript
// app-menu.component.ts
@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMenuComponent {
  @Input() mode: 'horizontal' | 'vertical' = 'horizontal';

  facade = inject(MenuFacadeService);
  readonly menu = this.facade.menu;

  navigate(item: MenuItem) { this.facade.navigate(item); }
}
```

### Template

```html
<!-- app-menu.component.html -->
<nav class="app-menu" [class]="'app-menu--' + mode" role="navigation" aria-label="Menu principal">

  <ng-container *ngIf="menu().Menu?.length; else loading">
    <app-menu-item
      *ngFor="let item of menu().Menu; trackBy: trackByRota"
      [item]="item"
      [mode]="mode"
      (navigate)="navigate($event)">
    </app-menu-item>
  </ng-container>

  <ng-template #loading>
    <!-- skeleton idêntico ao atual — preservar comportamento -->
    <div class="app-menu__skeleton">
      <div class="skeleton-line" *ngFor="let n of [1,2,3,4,5]"></div>
    </div>
  </ng-template>

</nav>
```

---

## AppMenuItemComponent

Componente folha — renderiza um item e, se tiver filhos, expande inline (vertical) ou abre dropdown (horizontal).

```typescript
@Component({
  selector: 'app-menu-item',
  templateUrl: './app-menu-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AppMenuItemComponent {
  @Input()  item!: MenuItem;
  @Input()  mode: 'horizontal' | 'vertical' = 'horizontal';
  @Output() navigate = new EventEmitter<MenuItem>();

  expanded = false;

  get hasChildren(): boolean {
    return this.item.SubMenu?.length > 0;
  }

  toggle() { this.expanded = !this.expanded; }

  click() {
    if (this.hasChildren) this.toggle();
    else this.navigate.emit(this.item);
  }
}
```

```html
<!-- app-menu-item.component.html -->

<!-- Item simples -->
<button
  *ngIf="!hasChildren"
  class="menu-item"
  [class.menu-item--active]="isActive"
  (click)="navigate.emit(item)"
  type="button">
  <i [ngClass]="item.Icone" class="menu-item__icon" aria-hidden="true"></i>
  <span class="menu-item__label">{{ item.Nome }}</span>
</button>

<!-- Item agrupador -->
<div *ngIf="hasChildren" class="menu-group">
  <button
    class="menu-item menu-item--group"
    [attr.aria-expanded]="expanded"
    (click)="toggle()"
    type="button">
    <i [ngClass]="item.Icone" class="menu-item__icon" aria-hidden="true"></i>
    <span class="menu-item__label">{{ item.Nome }}</span>
    <i class="menu-item__chevron fas"
       [class.fa-chevron-down]="!expanded"
       [class.fa-chevron-up]="expanded"
       aria-hidden="true"></i>
  </button>

  <ul *ngIf="expanded || mode === 'horizontal'" class="menu-group__children" role="menu">
    <li *ngFor="let child of item.SubMenu; trackBy: trackByRota" role="none">
      <button class="menu-item menu-item--child" (click)="navigate.emit(child)" type="button" role="menuitem">
        {{ child.Nome }}
      </button>
    </li>
  </ul>
</div>
```

> **Nota sobre ícones:** mantém `<i [ngClass]="item.Icone">` — os nomes vêm do backend como strings FA5 (`"fas fa-calendar-check"`). Migrar para `fa-icon` exigiria registrar todos os ícones no módulo ou mudar o contrato do backend. Pode ser feito em etapa separada.

---

## Exibição

O `AppMenuComponent` é um **dropdown** — mesmo UX do `PortalMenuComponent` atual, mas com código moderno.

Renderização: botão "Menu" → `ngbDropdown` → lista de itens → submenu inline se houver filhos.

O `atlas-left-panel` fica para uma etapa futura (menu vertical/sidebar será um componente diferente).

---

## Uso no DefaultShell (top bar)

```html
<!-- portal-header já tem <ng-content> no centro da nav -->
<portal-modulo>
  <portal-header>
    <app-menu></app-menu>
  </portal-header>
  <portal-body>
    <router-outlet></router-outlet>
  </portal-body>
</portal-modulo>
```

---

## Command Palette (C-k) — contrato de dados

O command palette consome `MenuFacadeService.flatItems` — Signal já disponível, sem nova requisição HTTP.

```typescript
// Exemplo de uso no CommandPaletteComponent (implementação futura)
export class CommandPaletteComponent {
  private facade = inject(MenuFacadeService);

  results = computed(() =>
    this.facade.flatItems().filter(({ item }) =>
      item.Nome.toLowerCase().includes(this.query().toLowerCase())
    )
  );

  execute({ item }: FlatMenuItem) {
    this.facade.navigate(item);
    this.close();
  }
}
```

`$onMenuNavigation` pode alimentar a lista de "acessados recentemente" do palette:
```typescript
this.facade.onNavigation$.subscribe(item => this.addToRecent(item));
```

---

## Registro no módulo

O `AppMenuComponent` e `AppMenuItemComponent` serão declarados em um `MenuModule` isolado:

```typescript
// src/app/menu/menu.module.ts
@NgModule({
  declarations: [AppMenuComponent, AppMenuItemComponent],
  imports: [CommonModule],
  exports: [AppMenuComponent],
})
export class MenuModule {}
```

- `ShellsModule` importa `MenuModule` (para usar `<app-menu>` nos shells)
- `AppModule` não precisa importar — vai via `ShellsModule`

---

## Próximos passos

- [ ] Criar `MenuFacadeService` (Signal + flatItems)
- [ ] Criar `AppMenuItemComponent` (item simples + agrupador)
- [ ] Criar `AppMenuComponent` (modo horizontal/vertical)
- [ ] Criar `MenuModule` e registrar
- [ ] Adicionar `MenuModule` ao `ShellsModule`
- [ ] Plugar `<app-menu mode="horizontal">` no `portal-header` (DefaultShell)
- [ ] Plugar `<app-menu mode="vertical">` no `atlas-left-panel` (AtlasShell)
- [ ] Remover `PortalMenuComponent` e `MenuLateralComponent` do uso (manter declarados por ora)
- [ ] (Futuro) Implementar `CommandPaletteComponent` consumindo `MenuFacadeService.flatItems`
- [ ] (Futuro) Redesign visual do `AppMenuItemComponent`
