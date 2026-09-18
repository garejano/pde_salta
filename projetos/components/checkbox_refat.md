base:./readme.md

objetivo: refatorar visualmente o `app-checkbox` (`shared/dynamic-components/checkbox`) com base em `./checkbox_design`

accent azul padrao: #242CC2
accent verde (variante): #28975A
accent roxo (variante): #9D0364

o componente deve ser performatico, manter o funcionamento com o form do angular

---

Repositório alvo: **estrutura-pedagogica**
Componente: `shared/dynamic-components/checkbox` (`app-checkbox`, mesmo componente usado via `[control]` direto e via inject no `filtro`).

Referências visuais (protótipos `.dc.html` em `checkbox_design/`, não é código a portar 1:1 — servem de referência visual/comportamental):
- `Checkbox - Variantes.dc.html` — exploração de 6 estilos (Suave, Sólido, Contorno, Tinta, Pílula, Sombra) × 8 estados, com o checkbox atual do DS ao lado como referência (16px, cantos 4px, preenchimento indigo).
- `Checkbox Suave - Exemplos.dc.html` — estilo já escolhido para implementação (**Suave**) aplicado em 4 casos reais: lista com "selecionar todos", formulário com validação obrigatória, checklist de tarefas, painel lateral com accent independente da tela.

## 1. Decisão de estilo: Suave

Preenchimento sólido ao marcar, `border-radius: 6px`, tamanho base 20px, marca (check) desenhada com animação de traço. É o estilo validado no arquivo de exemplos — as outras 5 variantes do arquivo "Variantes" ficam descartadas, mantidas só como registro da exploração.

## 2. Estado atual (antes do refactor)

`app-checkbox` hoje é um `<input type="checkbox">` nativo, sem estilo customizado — a cor vem de `accent-color: $color-success-dark` (verde), definida globalmente em `global.scss:1415-1417`. O componente já segue o padrão dual-mode (template + inject) descrito na seção "Padrão arquitetural obrigatório" do `readme.md`:

```typescript
constructor(
  @Optional() @Inject(FormControl) injectedControl: FormControl | null,
  @Optional() @Inject("name") injectedName?: string,
  @Optional() @Inject("info") injectedInfo?: string,
) { ... }
```

**Preservar esse contrato** (`@Input() control`, `@Input() fieldName`, `@Input() checkboxInfo`) ao trocar o markup interno — é usado tanto via `[control]` direto (showcase, formulários) quanto injetado pelo `filtro`. Não confundir com `core/components/checkbox-field` (`app-checkbox-field`, `ControlValueAccessor` próprio, usado em `ocorrencia/listar`) — componente separado, fora do escopo deste refactor.

## 3. Novos `@Input()`s

- `@Input() accent: 'primary' | 'secondary' | 'positive' | ... = 'primary'` — cor de destaque quando marcado. Reaproveitar a paleta semântica já definida na spec de Tag (`readme.md`, seção 2) em vez de inventar uma paleta nova: Primary `#242CC2`, Secondary `#9D0364`, Positive `#28975A`, etc.
- `@Input() indeterminate = false` — estado "parcialmente selecionado" (caso "selecionar todos os alunos" do exemplo), ícone de traço central em vez de check.
- `@Input() loading = false` — substitui a marca por spinner; sem interação (`pointer-events: none`, `tabIndex="-1"` enquanto `true`).
- `@Input() invalid = false` — borda/marca em Error (`#E65637`) quando fora do estado obrigatório (caso "termo obrigatório" do exemplo de formulário).
- `disabled` continua vindo de `control.disabled`, sem `@Input()` próprio — já é assim hoje.

## 4. Estados a cobrir (ver `Checkbox - Variantes.dc.html`)

Padrão · Foco · Selecionado · Intermediário · Válido · Inválido · Carregando · Desabilitado · Desabilitado marcado.

- Hover: anel suave (`box-shadow` ~4px, ~10% opacidade da cor de accent).
- Foco: anel mais forte (~24-28% opacidade), via `:focus-visible` (não `:focus`) — não deve aparecer em clique de mouse, só em navegação por teclado.

## 5. Animação

- Check: `stroke-dasharray`/`stroke-dashoffset` desenhando o traço + `scale` leve (pop), ~240-260ms, `cubic-bezier(0.16,1,0.3,1)`.
- Indeterminado: traço central com `scaleX` 0→1, ~200ms.
- Loading: spinner com borda girando (cor de accent na borda superior), `700ms linear infinite`.
- Só CSS (`@keyframes`/`transition`) — sem JS rodando a cada frame, para não comprometer performance em listas grandes (ex.: "selecionar todos os alunos").

## 6. Performance / integração com o form

- Trocar o `<input type="checkbox">` visível por um elemento customizado, mas manter um `<input type="checkbox" [formControl]>` de acessibilidade por trás (visually-hidden, não `display:none`), preservando leitor de tela, Tab e submit nativos — a marcação visual reage a `:checked`/estado via CSS/`[class]`, sem reimplementar `ControlValueAccessor`.
- Evitar `*ngIf` para alternar ícones (check/indeterminado/spinner) — preferir `[class]`/`[style.display]`, para não recriar DOM a cada mudança de estado dentro de listas.
- `indeterminate` não existe como atributo HTML, só como propriedade JS do elemento — precisa ser setado via `ElementRef`/`Renderer2` (replicando o que o `<input>` nativo já expõe).

## 7. Exemplos na tela de exemplos

`componentes-showcase` já tem um grupo `app-checkbox` (`[control]`, `checkboxInfo` — ver `componentes-showcase.catalog.ts:107-112` e `tela-base.component.html:833-847`). Ampliar cobrindo: todos os estados da seção 4, os accents da seção 3, e pelo menos um exemplo de uso real (lista com "selecionar todos", como em `Checkbox Suave - Exemplos.dc.html`).

## 8. Objetivos, em ordem de execução

1. Refinar este documento com as mudanças propostas — ✅ feito.
2. Implementar o markup/SCSS do estilo Suave no `app-checkbox`, preservando o contrato dual-mode.
3. Adicionar os novos `@Input()`s (seção 3) e os estados derivados (seção 4).
4. Ampliar o grupo de exemplos em `tela-base.component.html` (seção 7).
