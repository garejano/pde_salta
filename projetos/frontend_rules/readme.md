repositorio: estrutura-pedagogica / frontend

## tela-base

Componente base de exemplo em `features/exemplos/tela-base/`.

Demonstra os padrões do projeto:
- `app-titulo-page` — cabeçalho padrão
- `filtro` — componente de filtro com config declarativa
- `app-button` — todas as variantes de estilo, estados e ícone
- `tooltip` — 4 posições, tema dark/light, uso em contexto com app-button
- **Abordagem 1:** `app-formulario` com `scheme` (dynamic-components, runtime)
- **Abordagem 2:** template direto com `[control]` por `@Input()` (design time)

### TODO (HTML ainda a preencher)

- [ ] Tab-navigator com router interno (ver `app-diario-de-classe-tab-navigator`)
- [ ] Seção com formulário usando dynamic-components (abordagens 1 e 2 já preparadas no TS)

---

## Componentes refatorados (Angular v20)

### `app-button` — `shared/components/button/`

Refatorado para padrões Angular v20:
- `@Input()` → `input()` signal (8 inputs)
- `@Output() + EventEmitter` → `output<void>()`
- `@HostListener` → `host` no decorator
- `constructor injection` → `inject()`
- Template: `*ngIf` → `@if`, classes nativas sem `ngClass`

CSS migrado para o próprio componente (antes dependia do `global.scss`):
- Todas as variantes definidas no `button.component.scss` com `@use variables`
- Classes estruturais renomeadas para BEM: `.app-btn`, `.app-btn__inner`, `.app-btn__icon`, `.app-btn__counter`

**Variantes disponíveis via `[classButton]`:**

| Valor | Visual |
|---|---|
| `button-primary` | Azul preenchido |
| `button-primary colored` | Azul preenchido (estado ativo fixo) |
| `button-secundary` | Borda azul, fundo branco |
| `button-secundary no-borders` | Igual, sem borda visível |
| `button-tertiary` | Fundo transparente |
| `button-print` | Teal preenchido |
| `button-print white` | Fundo branco, texto azul |
| `button-print blue` | Azul vivo |
| `counter-button` | Borda magenta, ativo ao `counter > 0` |
| `button-disabled` | Cinza preenchido (visual apenas) |
| `button-danger` | Vermelho preenchido — ação destrutiva |

**Inputs:**
- `[label]` — texto (default: `'label'`)
- `[classButton]` — variante visual (default: `'button-secundary'`)
- `[disabled]` — desabilita via atributo HTML
- `[isActive]` — força estado active
- `[counter]` — badge numérico (também ativa o estado active)
- `[icon]` + `[classIcon]` — ícone Material à esquerda do label
- `[idButton]` — id DOM (gerado automaticamente se omitido)

**Output:** `(clickEvent)`

---

### `tooltip` — `shared/components/tooltip/`

Directive `[tooltip]` que cria um `TooltipComponent` via `ViewContainerRef`.

Refatorado para padrões Angular v20:
- `@Input()` → `input()` signal
- `@HostListener` → `host` no decorator
- `constructor injection` → `inject()`
- Posicionamento recalculado no hover (`getBoundingClientRect()` no `show()`, não no `ngOnInit`)
- `position: fixed` no componente — escapa `overflow: hidden` de containers pais

**Inputs (na directive):**

| Input | Valores | Default |
|---|---|---|
| `tooltip` | string | `''` |
| `tooltipPosition` | `top` · `bottom` · `left` · `right` | `top` |
| `tooltipTheme` | `dark` · `light` | `dark` |

**Uso:**
```html
<button tooltip="Texto da dica">...</button>
<button tooltip="Abaixo" tooltipPosition="bottom">...</button>
<button tooltip="Fundo claro" tooltipTheme="light" tooltipPosition="top">...</button>
```

---

## variables.scss — blocos adicionados

`src/styles/variables.scss` recebeu dois blocos de variáveis de componente:

```scss
// ── app-button
$btn-primary-hover, $btn-primary-dark, $btn-focus, $btn-teal-dark,
$btn-print-blue, $btn-counter, $btn-counter-dark, $btn-danger-hover
```
