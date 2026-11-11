# Plano: `headerEntries` / `nextHeaderEntries` / `footerEntries` / `nextFooterEntries`

## Contexto

`doc-header` e `doc-footer` saem do template de `document-page` e passam a ser injetados dinamicamente. A nomenclatura é simétrica: `xxxEntries` controla a página 1, `nextXxxEntries` controla as páginas 2+. Todos seguem o mesmo fluxo lógico de resolução.

`pageHeader?: DocumentEntry` (anterior) é removido.

---

## API em `DocumentConfig` — 4 novas props

```ts
headerEntries?: DocumentEntry[]      // Página 1. Default: [DocHeaderComponent]. [] = sem header.
nextHeaderEntries?: DocumentEntry[]  // Páginas 2+. Default: deriva de header.onAllPages. [] = sem header em 2+.

footerEntries?: DocumentEntry[]      // Página 1. Default: [DocFooterComponent]. [] = sem footer.
nextFooterEntries?: DocumentEntry[]  // Páginas 2+. Default: mesmo que footerEntries. [] = sem footer em 2+.
```

**Regras de resolução:**
- `nextXxxEntries` definido (incluindo `[]`) → usa exatamente isso
- Não definido:
  - Header: usa `headerEntries` (ou default DocHeader) se `header.onAllPages ?? true`; senão `null`
  - Footer: usa `footerEntries` (ou default DocFooter)
- `header.show = false` / `footer.show = false` → suprime tudo

**Exemplos:**
```ts
// DocHeader na p.1, compacto nas p.2+
{ nextHeaderEntries: [{ componentType: CompactHeader, data: {...} }] }

// Sem footer em p.2+
{ nextFooterEntries: [] }

// DocHeader só na p.1
{ header: { show: true, onAllPages: false } }
```

---

## Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `models/document-config.ts` | Remove `pageHeader`, adiciona 4 novas props |
| `components/document-page/document-page.component.html` | Remove `app-doc-header` e `app-doc-footer` |
| `services/layout-engine.service.ts` | Reverte `pageHeaderHeight`/`pageOverheadHeight` |
| `components/document-viewer/document-viewer.component.ts` | Toda a lógica de resolução, medição e injeção |
| `carometro-exemplo.component.ts` | Usa `nextHeaderEntries` no lugar de `pageHeader` |

---

## Lógica central no viewer

### Tipo
```ts
type PageEntrySet = DocumentEntry[] | 'default-footer' | null;
// 'default-footer' = sentinel para DocFooterComponent com dados dinâmicos de paginação
```

### buildHeaderSets / buildFooterSets
Retornam `{ p1, pN, h1, hN }` — sets e alturas para página 1 e páginas 2+.

### measureSet
- `null` → 0px
- `'default-footer'` → DOC_FOOTER_HEIGHT (constante, sem criar instância)
- `DocumentEntry[]` → mede each entry + gap, retorna soma

### getPageAvailableHeightFor(config, overheadHeight)
Não subtrai mais header/footer internamente — recebe overhead pré-computado.

### initSingle / initMultiple
Calculam `firstPageHeight` e `otherPageHeight` com overhead correto antes de chamar `distribute()`.

### distributeElements — ordem por página
1. headerEntries (se aplicável)
2. entries regulares
3. footerEntries ou DocFooterComponent default
