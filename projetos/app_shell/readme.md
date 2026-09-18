# App Shell — Plano de Implementação

repositório: `estrutura-pedagogica`
repositorio worktree: C:\projects\estrutura-pedagogica-Frontend-AppShell

---

## Contexto atual

O app usa o `portal-modulo` (em `src/portal-modulo/`) como único layout de aplicação.
O `AppComponent` é o ponto de entrada e usa o módulo assim:

```html
<!-- app.component.html -->
<portal-modulo>
  <portal-header></portal-header>
  <portal-body>
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  </portal-body>
</portal-modulo>
```

### O que o portal-modulo oferece

| Componente | Responsabilidade |
|---|---|
| `PortalModuloComponent` | Wrapper raiz; controla visibilidade do shell e do menu lateral |
| `PortalHeaderComponent` | Barra do topo (logo, menu de acesso, avatar, notificações, ElevaID) |
| `PortalBodyComponent` | Área de conteúdo abaixo do header |
| `MenuLateralComponent` | Menu lateral (visível conforme permissão `MenuLateral`) |
| `PortalAuthComponent` | Tela de autenticação |
| `PortalGuiaComponent` | Guia/tour da aplicação |

### Problema atual

`PortalModuloComponent` já tem uma lógica de "ocultar shell" via `ocultarShell`:

```typescript
// portal-modulo.component.ts
private rotasSeShell = [path.SessionExpired];

private atualizarShell(url: string): void {
  this.ocultarShell = this.rotasSeShell.some(r => url.includes(r));
}
```

Essa abordagem esconde o header com base em URL, mas não escala:
- Acopla lógica de layout ao `PortalModuloComponent`
- Não permite shells com estrutura visual diferente (mobile, vazio)
- Toda rota nova que precisar de shell diferente exige alterar essa lista

---

## Dois conceitos de "App Shell"

> Importante distinguir antes de planejar.

### 1. Angular PWA App Shell (link do readme)
[angular.dev/ecosystem/service-workers/app-shell](https://angular.dev/ecosystem/service-workers/app-shell)

Pre-renderiza uma rota estática no build. O service worker serve esse HTML instantaneamente enquanto o app carrega. Foco: **performance percebida (tempo até primeiro conteúdo visível)**.

Gerado com: `ng generate app-shell`

### 2. Layout Shell Pattern (o que o requisito descreve)

Múltiplos componentes de layout, cada um com seu `<router-outlet>`. Grupos de rotas são aninhados sob o shell correspondente. Foco: **estrutura visual diferente por contexto**.

**Este documento cobre o Layout Shell Pattern.** O PWA App Shell pode ser adicionado depois como camada de performance.

---

## Shells planejados

### Shell 1 — Default (com top bar)
- Barra do topo (portal-header)
- Menu lateral conforme permissões
- Body abaixo da barra, com scroll interno
- Cobre: todas as rotas autenticadas

### Shell 2 — Mobile
- Layout alternativo para mobile
- Navegação inferior (ou drawer) em vez de sidebar
- Body com scroll interno adaptado
- Cobre: rotas que terão versão mobile dedicada

### Shell 3 — Empty (sem top bar)
- Sem header, sem menu
- Conteúdo ocupa 100% da viewport
- Cobre: auth, session-expired, unauthorized, rotas públicas

---

## Plano de implementação

### Fase 1 — Criar os shell components

Criar um diretório `src/app/shells/` com um componente por shell:

```
src/app/shells/
  default-shell/
    default-shell.component.html   ← <portal-modulo> + <portal-header> + <portal-body>
    default-shell.component.ts
  mobile-shell/
    mobile-shell.component.html
    mobile-shell.component.ts
  empty-shell/
    empty-shell.component.html     ← apenas <router-outlet>
    empty-shell.component.ts
  shells.module.ts                 ← ou standalone components
```

`DefaultShellComponent` encapsula o que hoje está no `AppComponent`:

```html
<!-- default-shell.component.html -->
<portal-modulo>
  <portal-header></portal-header>
  <portal-body>
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  </portal-body>
</portal-modulo>
```

`EmptyShellComponent` é só um outlet:

```html
<!-- empty-shell.component.html -->
<router-outlet></router-outlet>
```

### Fase 2 — Reestruturar o routing

Agrupar rotas por shell em `app-routing.module.ts`:

```typescript
const routes: Routes = [
  // ── Shell vazio (auth / erros) ─────────────────────────────
  {
    path: '',
    component: EmptyShellComponent,
    children: [
      { path: path.Auth, component: PortalAuthComponent },
      { path: path.SessionExpired, component: SessionExpiredComponent },
      { path: path.Unauthorized, component: UnauthorizedComponent },
    ],
  },

  // ── Shell default (rotas autenticadas) ─────────────────────
  {
    path: '',
    component: DefaultShellComponent,
    canActivate: [AuthGuard],           // guard de autenticação
    children: [
      { path: path.Home, component: HomeComponent },
      { path: 'periodo-letivo', loadChildren: () => import('...') },
      { path: 'etapas',         loadChildren: () => import('...') },
      // ... demais rotas autenticadas
    ],
  },

  // ── Shell mobile ───────────────────────────────────────────
  {
    path: 'mobile',
    component: MobileShellComponent,
    children: [
      // rotas com layout mobile dedicado
    ],
  },

  { path: path.PageNotFound,    component: PageNotFoundComponent },
  { path: path.PageMaintenance, component: PageNotFoundComponent },
  { path: '**', redirectTo: path.PageNotFound },
];
```

### Fase 3 — Limpar o PortalModuloComponent

Com o routing controlando qual shell renderizar, a lógica de `ocultarShell` / `rotasSeShell` em `PortalModuloComponent` pode ser removida. O componente passa a ser responsável apenas pelo layout do shell default, não por decidir quando aparecer.

### Fase 4 — AppComponent vira um wrapper limpo

```html
<!-- app.component.html depois da migração -->
<router-outlet></router-outlet>
```

O `AppComponent` deixa de ter qualquer lógica de layout — o shell correto é injetado pelo router.

---

## Regra para vincular feature a shell

Toda feature nova deve declarer explicitamente em qual shell ela pertence, via agrupamento de rotas:

```typescript
// Dentro do grupo DefaultShell
{ path: 'nova-feature', loadChildren: () => import('./features/nova-feature/...') }

// Dentro do grupo EmptyShell
{ path: 'nova-rota-publica', component: NovaRotaPublicaComponent }
```

Não existe mais matching por URL string — o shell é determinado pela posição da rota na árvore.

---

## Próximos passos (ordem de execução)

- [ ] Criar `EmptyShellComponent` (mais simples, valida a abordagem)
- [ ] Migrar rotas de auth/erros para o `EmptyShellComponent`
- [ ] Criar `DefaultShellComponent` (mover lógica do `AppComponent`)
- [ ] Migrar todas as rotas autenticadas para o `DefaultShellComponent`
- [ ] Remover `ocultarShell` / `rotasSeShell` do `PortalModuloComponent`
- [ ] Limpar `AppComponent` para `<router-outlet>`
- [ ] Criar `MobileShellComponent` (quando houver rotas mobile definidas)
- [ ] (Opcional) Avaliar PWA App Shell para pré-renderizar o `DefaultShellComponent`

---

## Notas

- O `PortalModule` e seus componentes **não mudam** na Fase 1–3; apenas são usados dentro do `DefaultShellComponent` em vez de diretamente no `AppComponent`.
- A lógica de autenticação que hoje está em `PortalModuloComponent.ngOnInit()` (verificar ElevaID, redirecionar para session-expired) deve migrar para um `AuthGuard` no grupo de rotas do `DefaultShellComponent`.
- O `MenuLateralComponent` permanece dentro do `DefaultShellComponent` — o mobile shell terá sua própria navegação.
