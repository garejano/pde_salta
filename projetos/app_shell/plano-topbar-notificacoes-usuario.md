# Plano — Ações do Top Bar Atlas: Notificações e Menu do Usuário

## Contexto

O top bar do AtlasShell tem dois botões sem comportamento implementado:
- **Sino** → painel de notificações
- **Avatar** → menu do usuário

Os dados e serviços já existem no `portal-modulo`. O objetivo é reutilizá-los com design do novo DS (cores e tipografia do mega menu).

---

## Componente 1 — `AtlasNotificacoesComponent`

**Arquivo:** `src/app/shells/atlas-shell/atlas-notificacoes/`

### Estado (Signals)
| Signal | Tipo | Descrição |
|--------|------|-----------|
| `isOpen` | `signal<boolean>` | Controla visibilidade do painel |
| `notificacoes` | `signal<Notificacao[]>` | Lista carregada do service |
| `isLoading` | `signal<boolean>` | Skeleton durante fetch |
| `hasBadge` | `computed<boolean>` | `notificacoes().some(n => !n.Visualizada)` |
| `badgeCount` | `computed<number>` | `notificacoes().filter(n => !n.Visualizada).length` |

### Comportamento
- Carrega `NotificacaoService.get(true)` quando `$usuarioAutenticado` emite com usuário autenticado (mesmo padrão do portal-modulo).
- Abre/fecha com clique no botão sino.
- Fecha com `@HostListener('document:click')` fora do componente ou tecla `Esc`.

### Estrutura do painel
```
┌─────────────────────────────┐
│ Notificações          [×]   │  ← header com fechar
├─────────────────────────────┤
│  [•] [ícone] Nome           │  ← não lida (fundo #ECEDFF)
│       Descrição             │
├─────────────────────────────┤
│  [✓] [ícone] Nome           │  ← já lida (fundo branco)
│       Descrição             │
├─────────────────────────────┤
│       Nenhuma notificação   │  ← empty state
├─────────────────────────────┤
│  [ Ver todas ]              │  ← footer → config.pedagogicoUrl/#Notificacao
└─────────────────────────────┘
```

### Navegação de item
- Clique → `window.location.href = config.pedagogicoUrl + '/' + notificacao.Rota`

### Serviços reutilizados
- `NotificacaoService` — `portal-modulo/shared/services/notificacao.service`
- `UsuarioService` — para aguardar autenticação
- `PortalConfig` — para montar URL de navegação

---

## Componente 2 — `AtlasUserMenuComponent`

**Arquivo:** `src/app/shells/atlas-shell/atlas-user-menu/`

### Estado (Signals + propriedades)
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `isOpen` | `signal<boolean>` | Controla visibilidade do painel |
| `usuario` | `toSignal($usuarioAutenticado)` | Dados do usuário atual |
| `initials` | `computed<string>` | Duas iniciais do nome |
| `urlFoto` | `computed<string \| null>` | URL da foto ou null para fallback |
| `acessosUsuario` | campo local | Lista de perfis disponíveis |
| `permiteLogarComo` | campo local | Permissão "LogarComo" |
| `permiteEditarDados` | campo local | Permissão "Usuarios_MeusDados" |
| `permissaoElevaId` | campo local | Permissão "ElevaId" |

### Estrutura do painel
```
┌──────────────────────────────┐
│  [foto/avatar]               │  ← header do usuário
│  Nome Completo               │
│  email@salta.com             │
│  ✏ Editar seus dados         │  ← se permiteEditarDados
├──────────────────────────────┤
│  Perfil ativo                │  ← seção perfil (se acessos > 1)
│  [select estilizado          │
│   com opções de perfil]      │
├──────────────────────────────┤
│  🔓 Logar como...            │  ← se permiteLogarComo
│  ⧉  Salta ID                 │  ← se permissaoElevaId (nova aba)
│  🍪 Definições de cookies    │  ← OneTrust: btnConfigCookies.click()
├──────────────────────────────┤
│  ⏻  Sair do atlas            │  ← logoff()
└──────────────────────────────┘
```

### Lógica de troca de perfil
Reaproveitada integralmente do `PortalMenuPerfilComponent`:
```typescript
perfilAlterado(value: string): void {
  const partes = value.split(',');
  this.menuService.clear();
  if (parseInt(partes[0]) > 0)
    this.usuarioService.alternarPerfisDeAcessoDoUsuario(partes[0], partes[2]).subscribe(...)
  else if (parseInt(partes[1]) > 0)
    this.usuarioService.alternarPessoasEscolaAcesso(partes[1], partes[2]).subscribe(...)
}
```
Comportamento pós-troca: `config.userChangeBehavior` (Refresh | GoToHome | redirect).

### Lógica de logoff
Idêntica ao `PortalMenuPerfilComponent`:
- `forkJoin({ ped: logoff(), elevaId: logoffElevaId() })`
- Se AtlasMode ou LoginComElevaId → redireciona para `elevaIdUrl/logout`
- Caso contrário → redireciona para `pedagogicoUrl`

### Serviços reutilizados
| Serviço | Origem | Uso |
|---------|--------|-----|
| `UsuarioService` | portal-modulo | autenticação, logoff, dados do usuário |
| `MenuService` | portal-modulo | `clear()` ao trocar perfil |
| `ModalService` | portal-modulo | abrir modal "Logar como" |
| `PortalConfig` | portal-modulo | URLs, appName, mode, userChangeBehavior |

---

## Integração no AtlasTopBarComponent

Substituir os `atlas-top-bar__icon-btn` estáticos pelos dois componentes autônomos:

```html
<!-- antes (botões estáticos) -->
<button class="atlas-top-bar__icon-btn ...">
  <i class="fas fa-bell"></i>
  <span class="atlas-top-bar__badge"></span>
</button>
<div class="atlas-top-bar__avatar">{{ initials() }}</div>

<!-- depois -->
<atlas-notificacoes></atlas-notificacoes>
<atlas-user-menu></atlas-user-menu>
```

`initials()` e `userName()` saem do `AtlasTopBarComponent` (passam para `AtlasUserMenuComponent`).

---

## Design — tokens do DS Salta

| Token | Hex | Aplicação |
|-------|-----|-----------|
| Azul primário | `#242CC2` | botões, links ativos, badge hover |
| Azul claro | `#ECEDFF` | item ativo/hover, badge bg |
| Cinza fundo | `#F8F9FB` | hover de item, footer do painel |
| Borda | `#EBEDF1` | separadores, borda do painel |
| Texto principal | `#0F0F10` | nome do usuário |
| Texto item | `#3D3F42` | título de notificação |
| Texto secundário | `#65686E` | descrição, labels |
| Texto terciário | `#ADB2BA` | datas, placeholders |
| Vermelho badge | `#E65637` | badge de não lidas |
| Gradiente avatar | `#9D0364 → #BA4F93` | fallback foto |
| Font título | `'Archivo'` | nome do usuário, cabeçalhos |
| Font corpo | `'Nunito'` | itens, descrições |

### Painel (comum aos dois componentes)
```
position: absolute
top: calc(100% + 6px)
right: 0
min-width: 320px
background: #fff
border: 1px solid #EBEDF1
border-radius: 8px
box-shadow: 0 8px 16px rgba(0,23,31,0.15)
z-index: 1060
```

---

## Estrutura de arquivos

```
src/app/shells/atlas-shell/
  atlas-notificacoes/
    atlas-notificacoes.component.ts
    atlas-notificacoes.component.html
    atlas-notificacoes.component.scss
  atlas-user-menu/
    atlas-user-menu.component.ts
    atlas-user-menu.component.html
    atlas-user-menu.component.scss
```

Registrar ambos em `ShellsModule.declarations`.

---

## Ordem sugerida de implementação

1. `AtlasNotificacoesComponent` — mais simples, sem lógica de estado complexo
2. `AtlasUserMenuComponent` — mais dependências, inclui troca de perfil e logoff
3. Atualizar `AtlasTopBarComponent` para usar os dois (remover botões estáticos)
