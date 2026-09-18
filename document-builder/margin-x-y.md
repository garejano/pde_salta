# Plano: `margin` passa a ter dois eixos — `{ x, y }`

## Contexto

`DocumentConfig.margin` é atualmente um `number` único aplicado igualmente a todos os lados da folha. A necessidade é separar margem horizontal (esquerda/direita) da vertical (topo/rodapé), permitindo definir `margin: { x: 12, y: 8 }` ao construir um documento e ajustar cada eixo independentemente no painel de configuração.

---

## Arquivos modificados (8)

### 1. `models/document-config.ts`
```ts
// antes
margin?: number

// depois
margin?: { x: number; y: number }
```

### 2. `components/document-viewer/document-viewer.component.ts`

**`getContentWidthFor()`** — usa margem horizontal:
```ts
const marginX = config?.margin?.x ?? 10;
return (landscape ? 1123 : 794) - marginX * 2;
```

**`getPageAvailableHeightFor()`** — usa margem vertical:
```ts
const marginY = config?.margin?.y ?? 10;
let available = (portrait ? PAGE_HEIGHT_PORTRAIT : PAGE_HEIGHT_LANDSCAPE) - marginY * 2;
```

### 3. `components/document-page/document-page.component.html`
```html
[style.paddingTop.px]="config.margin?.y ?? 10"
[style.paddingBottom.px]="config.margin?.y ?? 10"
[style.paddingLeft.px]="config.margin?.x ?? 10"
[style.paddingRight.px]="config.margin?.x ?? 10"
```

### 4. `components/document-config-panel/document-config-panel.component.ts`
- `get margin()` → `get marginX()` + `get marginY()`
- `setMargin()` → `setMarginX()` + `setMarginY()`

### 5. `components/document-config-panel/document-config-panel.component.html`
- 1 slider "Margem da folha" → 2 sliders lado a lado: "Margem horizontal" + "Margem vertical" (padrão `cp-pad-axis-row`)

### 6. `services/page-optimizer.service.ts`
Phase 2 otimiza `x` e `y` juntos em steps de -2px até mínimo 5.

### 7. `services/page-optimizer.service.spec.ts`
`margin: 10` → `margin: { x: 10, y: 10 }` (fixture BASE_CONFIG e "minimum" test)

### 8. Call-sites externos
- `carometro-exemplo.component.ts`: `margin: { x: 24, y: 24 }`
- `document-editor-state.service.ts`: `margin: { x: 10, y: 10 }`
