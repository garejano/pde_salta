# Componentes de Tag / Seleção — spec de implementação

Repositório alvo: **estrutura-pedagogica**

Referências visuais (protótipos `.dc.html`, não é código a portar 1:1 — servem de referência visual/comportamental):
- `claude_design_tag_select/Pill Tag Showcase.dc.html` — visão geral de todas as variantes
- `claude_design_tag_select/PillSelect.dc.html` — lógica do dropdown (mini-select)
- `claude_design_tag_select/PillToggle.dc.html` — lógica do toggle

---

## 1. Padrão arquitetural obrigatório (template + inject)

`dynamic-components`: `c:/projects/estrutura-pedagogica/frontend/src/shared/dynamic-components`

Os `dynamic-components` foram idealizados para funcionar em **dois modos**, e os 3 componentes
desta spec devem seguir exatamente o mesmo padrão (verificado em `select-field`, `toggle` e
`field-wrapper.component.ts`):

**Modo template** — uso direto via `@Input()`, como qualquer componente Angular comum:
```html
<app-tag [color]="'positive'" [size]="'md'">Cursando</app-tag>
```

**Modo inject** — instanciado dinamicamente pelo `filtro` (`shared/filtro`), via
`ViewContainerRef.createComponent(componentType, { injector })`. O `DynamicInjectorService`
(`shared/dynamic-components/dynamic-injector.service.ts`) transforma cada propriedade do
`FilterItemConfig` (exceto `type` e `value`) em um provider `{ provide: key, useValue }`, e
também injeta o `FormControl` sob o token `FormControl`. O componente recebe tudo isso no
construtor com `@Optional() @Inject(...)` e faz merge nos mesmos campos do `@Input()`:

```typescript
constructor(
  @Optional() @Inject(FormControl) injectedControl?: FormControl | null,
  @Optional() @Inject("options") injectedOptions?: SelectOption[],
  @Optional() @Inject("placeholder") injectedPlaceholder?: string,
) {
  if (injectedControl)     this.control = injectedControl;
  if (injectedOptions)     this.options = injectedOptions;
  if (injectedPlaceholder) this.placeholder = injectedPlaceholder;
}

ngOnInit() {
  if (!this.control) this.control = new FormControl();
  // defaults dos demais inputs aqui
}
```

Regras derivadas desse padrão, válidas para os 3 componentes novos:
- Sempre expor `@Input() control: FormControl | null` quando o componente participa de formulário
  (`tag-toggle` e `mini-select`; o `tag-component` puro de exibição não precisa).
- Todo `@Input()` que também deve funcionar via `filtro` precisa do par
  `@Optional() @Inject("nomeDaProp")` no construtor, com o mesmo nome de propriedade usado em
  `FilterItemConfig`/config do field.
- Defaults só são aplicados em `ngOnInit`, nunca no `@Input()` direto — assim o valor injetado
  (que chega depois da criação da instância, mas antes do `ngOnInit`) não é sobrescrito.
- Cada componente novo entra em `component.map.ts` (chave nova em `FieldType`, se for usado pelo
  `filtro`) e em `dynamic-components-module.module.ts` (`declarations` + `exports`).
- Pasta, seguindo a distinção do `shared/README.md`: componentes que participam de formulário
  (`tag-toggle`, `mini-select`) vão em `shared/dynamic-components/<nome>/`; o `tag-component`
  (puro de exibição, sem `FormControl`, sem modo inject) vai em `shared/components/tag/`.

O componente de filtro (`shared/filtro`) usa os `dynamic-components` em toda a sua construção —
qualquer componente novo criado aqui deve poder ser plugado no `filtro` sem alterações no próprio
`filtro`.

---

## 2. Paleta de cores semânticas

Não existe hoje um token único "Primary/Secondary/.../Neutral" no projeto — os hex abaixo já
existem em `src/styles/variables.scss`, mas com nomes ad-hoc. Ao implementar, criar aliases
semânticos em `variables.scss` (ou um mapa TS dedicado, ex. `tag-color.constant.ts`) em vez de
hardcodar hex nos componentes:

| Variante  | Hex       | Variável existente em `variables.scss`      |
|-----------|-----------|----------------------------------------------|
| Primary   | `#242CC2` | `$persian-blue`                               |
| Secondary | `#9D0364` | `$btn-counter` (dark: `$btn-counter-dark`)     |
| Tertiary  | `#30B7BE` | `$btn-focus`                                   |
| Inform    | `#774BB0` | `$studio2`                                     |
| Positive  | `#28975A` | `$success-dark` / `$color-success-dark`        |
| Warning   | `#FFAC30` | `$warning`                                     |
| Error     | `#E65637` | `$error` (== `$required`)                      |
| Neutral   | `#ADB2BA` | `$neutral` (borda vazia: `$neutral-light` `#C3C8D1`; texto ícone: `$btn-icon-fg` `#65686E`) |

### 2.1 Tons — `dark` / `base` / `light`

Cada variante da tabela acima passa a admitir 3 tons, via novo `@Input() tone: 'dark' | 'base' |
'light'` (default `'base'`) — eixo independente de `variant` (cor) e `outline`/`variant` de
preenchimento (sólido vs. outline). `base` é o hex já documentado na tabela (comportamento atual,
sem mudança visual quando `tone` não é informado).

Os tons `dark`/`light` **não são hex fixos**: são gerados em SCSS a partir da cor base de cada
variante, com `darken()`/`lighten()` — evita duplicar/inventar paletas e mantém as 8 variantes
consistentes entre si:

```scss
$tone-dark:  darken($base, 15%);
$tone-light: lighten($base, 30%);
```

- Aplica-se a **preenchido e outline**: em `dark`/`light`, tanto o fundo (modo sólido) quanto a
  borda/texto (modo outline) usam o tom calculado — o branco de fundo do outline não muda.
- **Contraste**: se o tom `light` resultante for claro o suficiente para quebrar o contraste do
  texto branco no modo sólido, usar texto escuro (`$baltic-sea`) — mesma regra já aplicada hoje ao
  `warning` sólido (linha 62-65 de `tag.component.scss`). Validar caso a caso ao implementar; não
  assumir que só `warning` precisa disso quando `tone: 'light'`.
- Vale para os 3 componentes desta spec (`app-tag`, `app-tag-toggle`, `app-mini-select`) — mesmo
  `@Input() tone`, mesmo par de funções SCSS, para não haver 3 implementações de rampa diferentes.

**Ícones**: o projeto carrega **dois** fontes de ícone via CDN em `index.html`: o pacote clássico
`material-icons` (classe `material-icons-outlined`, usado em `app-button`/`tab-navigator`/etc. —
prefira este para ícones comuns) e **Material Symbols Outlined** (classe
`material-symbols-outlined`), usado quando o ícone não existe no set clássico — ex.:
`progress_activity` (spinner de loading), como em `step-card.component.ts`. Ao usar um ícone
novo, checar primeiro se ele existe no set clássico; só cair para `material-symbols-outlined`
se não existir (foi o que aconteceu com o spinner de loading do `tag-toggle`/`mini-select`).

---

## 3. Objetivos, em ordem de execução

### 3.1 Refinar este documento — ✅ feito

### 3.2 Reorganizar a tela de exemplos

Tela: `c:/projects/estrutura-pedagogica/frontend/src/app/features/exemplos/tela-base`

Separar visualmente cada bloco de uso de componente, no padrão de seção usado em
`Pill Tag Showcase.dc.html` (cabeçalho da seção + subtítulo explicando os inputs + grid de
exemplos). O `tela-base.component.html` atual já usa uma convenção parecida
(`.showcase`, `.showcase__header`, `.showcase__group`, `.showcase__row`, `.showcase__item`) —
reaproveitar essas classes, não criar um sistema novo.

### 3.3 `app-tag` (tag-component)

Componente de exibição (sem `FormControl`), pill de canto capsular (`border-radius: 999px`).

- **Tamanhos**: `sm` | `md` (default) | `lg`.
  - `sm`: fonte 12px, padding `2px 10px`, altura ~24px.
  - `md`: fonte 13px, padding `4px 12px`, altura ~28px.
  - `lg`: fonte 14px, padding `6px 16px`, altura ~32px.
- **Variantes de cor**: Primary, Secondary, Tertiary, Inform, Positive, Warning, Error, Neutral
  (seção 2). Cada uma com versão **sólida** (fundo colorido, texto branco) e **outline**
  (fundo branco, borda 1px e texto na cor).
- **Tom**: `@Input() tone: 'dark' | 'base' | 'light'` (default `'base'`) — ver seção 2.1.
  Combina com `variant` e `outline` (ex.: `variant="positive"` + `tone="dark"` + outline).
- **Ícone**: `@Input() icon?: string` + posição `@Input() iconPosition: 'left' | 'right' | 'none'`
  (default `'none'`). Renderiza `<span class="material-icons-outlined">{{icon}}</span>`.
- **Removível**: `@Input() removable = false` + `@Output() remove = new EventEmitter<void>()`.
  Quando `true`, exibe um `x` clicável à direita (mesmo em conjunto com `iconPosition`) que emite
  `remove` — a remoção da lista em si é responsabilidade de quem consome o componente (ver
  padrão `sc-for`/`onRemove` do mockup, adaptado para `(remove)="onRemove(item)"`).
- **Fundo tintado**: `@Input() tinted = false` — combinado com `outline`, troca o fundo branco
  padrão por um leve tingimento da cor da variante. Assim como o tom claro/escuro (seção 2.1),
  não é um hex fixo por variante: é gerado em SCSS via `mix($color, white, 13%)` a partir da
  mesma cor base de cada variante — mantém as 9 variantes consistentes entre si.

**Exemplos de referência** (screenshots em `projetos/components/`, cobertos pelas props do
`app-tag` — apenas combinações a incluir na tela de exemplos, ver 3.6):
- `nova_variante_tag_component_01.png` — outline · `tinted` · `variant="primary"` ·
  `size="sm"` · `icon="star"` · `iconPosition="right"`, labels de tamanho variável (lista de
  tags "com destaque").
- `nova_variante_tag_component_02.png` — outline · `size="sm"` · sem ícone · cor variando por
  item (`variant` diferente em cada tag, ex.: séries/anos escolares).

### 3.4 `app-tag-toggle` (selecionável)

Mesmo visual do `app-tag`, mas com estado (on/off) e `FormControl` — segue o padrão
dual-mode da seção 1 (comparável a `app-toggle`, mas com a aparência de tag).

- `@Input() control: FormControl | null` (boolean).
- `@Input() variant: 'plain' | 'check' | 'circle' | 'onoff'` (default `'plain'`):
  - `plain`: preenche com a cor ao ligar (fundo colorido + texto branco), outline quando off.
  - `check`: ícone `add`/`check` à esquerda do label, outline sempre, cor só no ícone/borda quando on.
  - `circle`: ícone `radio_button_unchecked`/`check_circle` à esquerda, outline sempre.
  - `onoff`: switch pill à direita do label (trilho + thumb), outline sempre.
- Estados: `disabled`, `loading` (spinner substitui o ícone/switch, sem interação),
  `required` (quando off + required, borda/texto em Error com asterisco).
- `@Input() tone: 'dark' | 'base' | 'light'` (default `'base'`) — ver seção 2.1. Aplica-se à cor
  de `variant` em qualquer estado (on/off, cada `variant` do item 138).
- Reaproveitar `@Input() label` (não `toggleInfo` — aqui o texto é o próprio conteúdo do pill,
  como em `app-toggle` porém sem o texto lateral).

### 3.5 `app-mini-select` (dropdown estilo tag)

Visual de `app-tag` com chevron à direita; funcionalmente equivalente a `app-select-field`
(seleção única) — deve poder substituir um `app-select-field` em qualquer filtro sem mudança de
contrato de dados (`FormControl` com `hash` da opção selecionada, `options: {hash, descricao}[]`).

- Dual-mode obrigatório (seção 1) — precisa funcionar dentro do `filtro` tal como
  `app-select-field` funciona hoje.
- `@Input() control`, `@Input() options: {hash, descricao}[]`, `@Input() placeholder?`,
  `@Input() prefix?` (ex.: "Ano: 2026"), `@Input() color` (variante da seção 2),
  `@Input() tone: 'dark' | 'base' | 'light'` (default `'base'`, ver seção 2.1).
- `@Input() showSearch = false` — quando `true`, exibe campo de busca dentro do dropdown
  (reaproveitar a normalização de texto já implementada em `select-field.component.ts`, método
  `normalizeText`, para não duplicar lógica de busca sem acento).
- `@Input() direction: 'auto' | 'down' | 'up'` (default `'auto'`) — em `'auto'`, calcular o
  espaço disponível abaixo do componente (`getBoundingClientRect`) e decidir a direção, como em
  `PillSelect.dc.html`.
- `@Input() maxVisible = 8` — acima disso, o menu ganha altura fixa e rola.
- Estados: `loading` (chevron vira spinner, não abre), `disabled`, `required` (vazio + required
  → borda/texto Error).
- Documentar cada `@Input()`/`@Output()` no topo do `.ts` (comentário curto) e no README do
  `dynamic-components` se fizer sentido consolidar ali.

### 3.6 Exemplos na tela de exemplos

Ao final de `tela-base.component.html`, adicionar uma seção `.showcase` para cada um dos 3
componentes novos, cobrindo pelo menos: todas as cores, os 3 tamanhos (`app-tag`), as 4 variantes
de toggle nos 4 estados (`app-tag-toggle`), o `app-mini-select` com/sem busca e nas 3 direções, e —
para os 3 componentes — os 3 tons (`dark`/`base`/`light`, seção 2.1) em pelo menos uma variante de
cor, para validar contraste visualmente.

---

## 4. `app-button` — variante ghost (✅ implementado)

Fora do escopo original desta spec (Tag/Toggle/MiniSelect), adicionado a pedido pontual: a
variante "ghost" vista no showcase (`Pill Tag Showcase.dc.html`, linha ~214,
`<x-import component-from-global-scope="Button" variant="ghost" ...>`), aplicada ao componente
`app-button` já existente (`shared/components/button`).

- **Não é um novo `@Input() variant`** — `app-button` já resolve variantes via
  `[classButton]` (string de classe CSS), então "ghost" entrou como mais três classes novas em
  `button.component.scss`, seguindo o mesmo padrão `@extend %btn-base` das demais:
  - `.button-primary-ghost` — cor `$persian-blue`.
  - `.button-secundary-ghost` — cor `$persian-blue` (mesma cor de `button-secundary`; a
    variante ghost só remove borda/fundo, não muda a cor semântica).
  - `.button-danger-ghost` — cor `$error`.
- **Visual**: fundo e borda transparentes por padrão; a cor do texto é a cor semântica da
  variante (mesma usada na versão sólida/outline já existente).
- **Hover**: preenche o fundo com uma tinta leve da cor (`mix($color, white, 13%)`) — mantém a
  cor do texto, sem inverter para preenchido (diferente do hover de `button-primary` /
  `button-secundary`, que preenchem sólido e trocam o texto para branco).
- **Disabled**: mantém fundo/borda transparentes; texto vai para `$neutral`.
- **Escopo**: não foram criadas versões ghost de `button-tertiary` (já é conceitualmente um
  "ghost", com borda branca) nem de `button-print` / `counter-button` / `button-icon*` (fora do
  pedido original).
- **Exemplos**: adicionados em `tela-base.component.html`, seção "Estilos" do showcase
  `app-button`, ao lado das demais variantes.
