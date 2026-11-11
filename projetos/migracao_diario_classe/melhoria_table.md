repo: estrutura-pedagogica
tags: document-builder
referencias: ./readme.md
status: planejado

---

# Melhoria: Pre-header em tabelas do document-builder

## Objetivo

Permitir que tabelas (`DocTableComponent` e `DocWideTableComponent`) exibam uma linha extra de cabeçalho **acima** do header principal, agrupando colunas por categoria.

## Formato visual

```
|        DADOS         |         FREQUÊNCIA          |
| N | Matrícula | Aluno | 01/01 | 02/01 | 03/01 | ... |
| 0 | xxxxxxxxx | João  |   P   |   F   |   P   | ... |
```

## Comportamento em tabelas com quebra de colunas

Quando `DocWideTableComponent` divide a tabela em grupos de colunas para caber na página, os índices dos pre-headers são **re-traduzidos** por grupo:

- Um pre-header que cobre as colunas 4..null no original, em um grupo que começa na coluna 4, vira `start: 1, end: null` nesse grupo.
- Um pre-header que não tem nenhuma coluna no grupo é omitido.
- `end: null` preserva o comportamento de "vai até o fim do grupo atual".

---

## Configuração

```ts
export interface PreHeaderItem {
  label: string;
  uppercase?: boolean;  // default false — passar label direto
  start: number;        // 1-indexed: coluna onde o pre-header começa
  end: number | null;   // 1-indexed inclusivo; null = estender até o fim do grupo/tabela
}
```

Adicionado a `DocTableData` e `DocWideTableData`:

```ts
preHeaders?: PreHeaderItem[];
preHeaderHeight?: number;  // padrão: 24px (mesmo que headerHeight)
```

### Exemplo — Diário de Classe

```ts
const preHeadersDiarioClasse: PreHeaderItem[] = [
  { label: 'Dados',      start: 1, end: 3   },
  { label: 'Frequência', uppercase: true, start: 4, end: null },
];
```

---

## Impacto em altura

A linha de pre-header adiciona `preHeaderHeight` (padrão 24px) ao cabeçalho total quando presente.

Todos os pontos que calculam `headerHeight` precisam considerar o overhead total:

```
totalHeaderHeight = headerHeight + (preHeaders?.length ? preHeaderHeight : 0)
```

Isso afeta:
- `DocTableComponent.getRowsThatFit()` — espaço disponível para linhas de dados
- `DocTableComponent.split()` — `headHeight` do fragmento
- `DocWideTableComponent.splitColumns()` — log e altura do `LayoutComponent`
- `createGroupSplittable()` — cálculo de `available` e `headHeight`

---

# Plano de Implementação

## Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `models/document-config.ts` | Novo tipo `PreHeaderItem`; adicionar a `DocTableData` e `DocWideTableData` |
| `components/doc-table/doc-table.component.ts` | Getter `preHeaderCells`, `totalHeaderHeight`; atualizar `getRowsThatFit` e `split` |
| `components/doc-table/doc-table.component.html` | Renderizar `<tr>` de pre-header no `<thead>` |
| `components/doc-table/doc-table.component.scss` | Estilos do pre-header (borda, alinhamento) |
| `components/doc-wide-table/doc-wide-table.component.ts` | `translatePreHeaders(allIndices)`; propagar para `DocTableData`; usar `totalHeaderHeight` |

---

## Passo 1 — `document-config.ts`

```ts
export interface PreHeaderItem {
  label: string;
  uppercase?: boolean;
  start: number;
  end: number | null;
}

// Em DocTableData — adicionar:
preHeaders?: PreHeaderItem[];
preHeaderHeight?: number;

// Em DocWideTableData — adicionar:
preHeaders?: PreHeaderItem[];
preHeaderHeight?: number;
```

---

## Passo 2 — `doc-table.component.ts`

### Novos getters

```ts
get effectivePreHeaderHeight(): number {
  return this.data.preHeaderHeight ?? DOC_TABLE_HEADER_HEIGHT;
}

get totalHeaderHeight(): number {
  return (this.data.headerHeight ?? DOC_TABLE_HEADER_HEIGHT)
    + (this.data.preHeaders?.length ? this.effectivePreHeaderHeight : 0);
}

get preHeaderCells(): { label: string; span: number; empty: boolean }[] {
  if (!this.data.preHeaders?.length) return [];
  const n = this.data.columns.length;
  const cells: { label: string; span: number; empty: boolean }[] = [];
  let col = 1;
  const sorted = [...this.data.preHeaders].sort((a, b) => a.start - b.start);
  for (const ph of sorted) {
    if (ph.start > col) {
      cells.push({ label: '', span: ph.start - col, empty: true });
    }
    const end = Math.min(ph.end ?? n, n);
    if (end >= ph.start) {
      cells.push({
        label: ph.uppercase ? ph.label.toUpperCase() : ph.label,
        span: end - ph.start + 1,
        empty: false,
      });
      col = end + 1;
    }
  }
  if (col <= n) {
    cells.push({ label: '', span: n - col + 1, empty: true });
  }
  return cells;
}
```

### Atualizar `getRowsThatFit` e `split`

Substituir `DOC_TABLE_HEADER_HEIGHT` por `this.totalHeaderHeight`.

Em `createTableSplittable` (função local), `DOC_TABLE_HEADER_HEIGHT` também deve ser substituído — passar `totalHeaderHeight` como parâmetro.

---

## Passo 3 — `doc-table.component.html`

Adicionar linha de pre-header antes da linha de header existente:

```html
<thead>
  <tr *ngIf="preHeaderCells.length">
    <th *ngFor="let cell of preHeaderCells"
        [attr.colspan]="cell.span"
        [style.height.px]="effectivePreHeaderHeight"
        [class.pre-header-empty]="cell.empty"
        class="pre-header-cell">
      {{ cell.label }}
    </th>
  </tr>
  <tr>
    <!-- linha de header existente, sem alteração -->
    <th *ngFor="let col of data.columns; let i = index" ...>
```

---

## Passo 4 — `doc-table.component.scss`

```scss
.pre-header-cell {
  text-align: center;
  font-weight: 700;
  border-bottom: 1px solid #ccc;
  padding: 0 4px;

  &.pre-header-empty {
    background: transparent;
    border: none;
  }
}
```

---

## Passo 5 — `doc-wide-table.component.ts`

### Método `translatePreHeaders`

```ts
private translatePreHeaders(allIndices: number[]): PreHeaderItem[] {
  if (!this.data.preHeaders?.length) return [];
  const n = this.data.columns.length;
  const result: PreHeaderItem[] = [];

  for (const ph of this.data.preHeaders) {
    const origStart = ph.start - 1;                           // 0-indexed
    const origEnd   = ph.end != null ? ph.end - 1 : n - 1;   // 0-indexed inclusive

    const first = allIndices.findIndex(i => i >= origStart);
    if (first === -1 || allIndices[first] > origEnd) continue;

    let last = -1;
    for (let i = allIndices.length - 1; i >= 0; i--) {
      if (allIndices[i] <= origEnd) { last = i; break; }
    }
    if (last < first) continue;

    // Preservar end: null se o ph original tinha end null e o último índice do grupo está coberto
    const isOpenEnd = ph.end === null && allIndices[last] === allIndices[allIndices.length - 1];

    result.push({
      label: ph.label,
      uppercase: ph.uppercase,
      start: first + 1,                     // 1-indexed slice
      end: isOpenEnd ? null : last + 1,     // 1-indexed slice
    });
  }
  return result;
}
```

### Getter `totalHeaderHeight`

```ts
get effectivePreHeaderHeight(): number {
  return this.data.preHeaderHeight ?? DOC_WIDE_TABLE_HEADER_HEIGHT;
}

get totalHeaderHeight(): number {
  return this.effectiveHeaderHeight
    + (this.data.preHeaders?.length ? this.effectivePreHeaderHeight : 0);
}
```

### Em `buildGroupLayoutComponent`

```ts
const slicePreHeaders = this.translatePreHeaders(allIndices);
// ...
lc.height = totalDataHeight + this.totalHeaderHeight + 1;
lc.splittable = createGroupSplittable(
  ...,
  this.totalHeaderHeight,  // em vez de this.effectiveHeaderHeight
  slicePreHeaders,
  this.data.preHeaderHeight,
);
// Em renderData.data:
{
  columns: sliceCols, rows: sliceRows, columnWidths: sliceWidths,
  verticalHeadersFromColumn: verticalFromNormalized,
  headerHeight: this.effectiveHeaderHeight,
  fillWidth: this.fillWidth,
  preHeaders: slicePreHeaders,
  preHeaderHeight: this.data.preHeaderHeight,
} as DocTableData
```

### Em `createGroupSplittable`

Atualizar assinatura para receber `totalHeaderHeight`, `preHeaders` e `preHeaderHeight`. Substituir todas as ocorrências de `headerHeight` nos cálculos de `available` e `headHeight` por `totalHeaderHeight`.

---

## Ordem de execução

1. `document-config.ts` — adicionar `PreHeaderItem`, campos em `DocTableData` e `DocWideTableData`
2. `doc-table.component.ts` — getters + atualizar cálculos
3. `doc-table.component.html` — linha de pre-header
4. `doc-table.component.scss` — estilos
5. `doc-wide-table.component.ts` — `translatePreHeaders` + propagação + altura corrigida
6. Validação: testar com `DocGridDiarioComponent` passando `preHeaders` no `DocWideTableData`
