# Document Builder — Registro de Alterações

Repositório: `estrutura-pedagogica`  
Área: `frontend/src/shared/document-builder/`

---

## 1. `margin` passa a ter dois eixos independentes

**Arquivo:** `models/document-config.ts`

```ts
// antes
margin?: number

// depois
margin?: { x: number; y: number }
// default implícito: { x: 10, y: 10 }
```

`x` controla a margem horizontal (esquerda/direita), `y` controla a vertical (topo/rodapé).

**Impacto:**
- `document-viewer` usa `margin.x` para calcular a largura disponível (`getContentWidthFor`)
- `document-viewer` usa `margin.y` para calcular a altura disponível (`getPageAvailableHeightFor`)
- `document-page.html` usa `paddingTop/Bottom/Left/Right` separados em vez de um único `padding`
- `document-config-panel` exibe **dois sliders** — "Margem horizontal" e "Margem vertical" — em vez de um
- `page-optimizer.service` otimiza ambos os eixos juntos durante a fase de margem

**Call-sites atualizados:** `carometro-exemplo.component.ts`, `document-editor-state.service.ts`, `page-optimizer.service.spec.ts`, `editor-canvas.component.ts`

---

## 2. Sistema de `headerEntries` / `nextHeaderEntries` / `footerEntries` / `nextFooterEntries`

**Arquivo principal:** `models/document-config.ts`, `components/document-viewer/document-viewer.component.ts`

### O que foi removido

- `pageHeader?: DocumentEntry` — entry único injetado em páginas 2+

### O que foi adicionado

```ts
headerEntries?: DocumentEntry[]      // header da página 1
nextHeaderEntries?: DocumentEntry[]  // header das páginas 2+
footerEntries?: DocumentEntry[]      // footer da página 1
nextFooterEntries?: DocumentEntry[]  // footer das páginas 2+
```

### Regras de resolução

**Header:**
- `headerEntries` não definido + `header.show = true` → `DocHeaderComponent` com `headerData` (default)
- `headerEntries: []` ou `header.show = false` → sem header na p.1
- `nextHeaderEntries` não definido → segue `header.onAllPages` (true = mesmos entries de p.1; false = nenhum)
- `nextHeaderEntries: []` → sem header nas p.2+

**Footer:**
- `footerEntries` não definido + `footer.show = true` → `DocFooterComponent` (default, com número de página dinâmico)
- `footerEntries: []` ou `footer.show = false` → sem footer na p.1
- `nextFooterEntries` não definido → mesmo que `footerEntries` (footer em todas as páginas por default)
- `nextFooterEntries: []` → sem footer nas p.2+

### Exemplos

```ts
// DocHeader na p.1, componente compacto nas p.2+
config: {
  header: { show: true, onAllPages: false },
  nextHeaderEntries: [{ componentType: CompactHeader, data: { turma: '9º Ano A' } }],
}

// Footer customizado na p.1; sem footer nas p.2+
config: {
  footer: { show: true },
  nextFooterEntries: [],
}

// Sem header em nenhuma página
config: { header: { show: false } }
// OU
config: { headerEntries: [] }
```

---

## 3. Migração de `DocHeader`, `DocFooter` e `DocSignature` para o viewer

### Antes

`DocHeaderComponent`, `DocFooterComponent` e `DocSignatureComponent` eram declarados diretamente no template `document-page.component.html` via binding Angular (`*ngIf`, `[data]`, etc.).

### Depois

Os três componentes são injetados **dinamicamente** pelo `DocumentViewerComponent` no `#content` de cada página:

```
document-page.component.html agora contém apenas:
  <app-doc-frame>   (permanece — controlado por config.frame)
  <div #content>    (container dos entries)
  (assinatura, header, footer, signature → injetados pelo viewer)
```

**Ordem de injeção por página (dentro de `#content`):**
```
1. headerEntries    (DocHeaderComponent default ou custom)
2. entries regulares (page.components)
3. spacer flex:1    (quando há signature ou footer — ancora ao fundo)
4. DocSignature     (quando page.showSignature && signatories.length)
5. footerEntries    (DocFooterComponent default ou custom)
```

### Métodos novos no viewer

| Método | Responsabilidade |
|---|---|
| `buildHeaderSets(config, headerData)` | Resolve `p1`/`pN` para header e mede alturas |
| `buildFooterSets(config)` | Resolve `p1`/`pN` para footer e mede alturas |
| `resolveEntrySet(explicit, default)` | Helper de resolução: explícito > default |
| `measureSet(set, config)` | Altura de um `PageEntrySet` (array → mede; 'default-footer' → constante; null → 0) |
| `measureEntries(entries, config)` | Mede array, retorna soma de (height + gap) |
| `injectEntries(entries, config, w, el)` | Instancia e appends cada entry |
| `injectDefaultFooter(page, total, el)` | Injeta `DocFooterComponent` com paginação dinâmica |
| `injectSignature(config, el)` | Injeta `DocSignatureComponent` com dados de `config.signature` |

### Tipo auxiliar

```ts
// 'default-footer' = sentinel para DocFooterComponent com dados dinâmicos por página
type PageEntrySet = DocumentEntry[] | 'default-footer' | null;
```

### Cálculo de alturas

`getPageAvailableHeightFor()` passou a receber `overheadHeight` explícito (antes subtraía header/footer internamente):

```ts
// antes
private getPageAvailableHeightFor(config, includeHeader: boolean): number

// depois
private getPageAvailableHeightFor(config, overheadHeight: number): number
```

O overhead é pré-computado em `initSingle()`/`initMultiple()` usando `buildHeaderSets` e `buildFooterSets`, e passado ao `layoutEngine.distribute()` via `firstPageHeight`/`otherPageHeight` já corrigidos.

### `layout-engine.service.ts`

O parâmetro `pageHeaderHeight` (adicionado temporariamente) foi **removido** — o layout engine volta à assinatura original:

```ts
distribute(components, firstPageHeight, otherPageHeight,
  signatureHeight = 0, signatureOnAllPages = false, headerOnAllPages = true): Page[]
```

`DocSignature` continua gerenciado pelo layout engine via `applySignature()` e `Page.showSignature` — apenas a renderização migrou para o viewer.

---

## 4. Footer ancorado ao fundo da página

Antes, os entries de footer apareciam logo após os entries regulares (sem preenchimento de espaço vazio). Agora, um `div` com `flex: 1` é injetado antes do bloco signature+footer, empurrando-os sempre para o fundo da área de conteúdo independentemente de quanto conteúdo existe acima.

```ts
// distributeElements — trecho da lógica
if (hasSignature || hasFooter) {
  const spacer = document.createElement('div');
  spacer.style.flex = '1';
  contentEl.appendChild(spacer);
}
```

---

## 5. Exemplo `exemplos/carometro`

**Arquivo:** `src/app/features/exemplos/carometro-exemplo/`

Nova rota `exemplos/carometro` no módulo de exemplos que demonstra o carômetro (grid de alunos com foto e responsável) com dados mockados e o documento já aberto ao entrar na rota.

Usa `nextHeaderEntries` com `DocCarometroInfoComponent` para exibir identificação compacta da turma nas páginas 2+.

---

## Arquivos impactados (resumo)

| Arquivo | Tipo de mudança |
|---|---|
| `models/document-config.ts` | `margin: {x,y}`, removeu `pageHeader`, adicionou 4 props de entries |
| `components/document-viewer/document-viewer.component.ts` | Rewrite da lógica de init/measure/inject; novos métodos |
| `components/document-page/document-page.component.html` | Removeu `app-doc-header`, `app-doc-footer`, `app-doc-signature` |
| `services/layout-engine.service.ts` | Reverteu `pageHeaderHeight`; signature inalterada |
| `components/document-config-panel/document-config-panel.component.ts` | Dois getters/setters de margin (x e y) |
| `components/document-config-panel/document-config-panel.component.html` | Dois sliders de margem |
| `services/page-optimizer.service.ts` | Margem otimizada em dois eixos |
| `services/page-optimizer.service.spec.ts` | Fixtures atualizadas para `margin: {x,y}` |
| `README.md` | Atualizado integralmente |
| `features/exemplos/carometro-exemplo/` | Novo componente de exemplo |
| `features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts` | `pageHeader` → `nextHeaderEntries` |
| `features/exemplos/document-editor/services/document-editor-state.service.ts` | `margin: {x,y}` |
| `features/exemplos/carometro-exemplo/carometro-exemplo.component.ts` | `nextHeaderEntries` |
