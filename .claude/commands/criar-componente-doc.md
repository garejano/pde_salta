# Criar Componente — document-builder

Quando o usuário pedir para criar um componente para uso no `document-builder` do repositório
`estrutura-pedagogica`, siga este processo.

---

## Contexto do document-builder

O `document-builder` é um sistema de geração de documentos paginados em Angular.
O `LayoutEngine` precisa conhecer a altura de cada componente **antes de renderizá-lo no DOM**
para decidir a paginação. Por isso, todos os componentes adicionados a um documento devem
implementar ao menos uma das interfaces de medição e/ou divisão.

**Caminho base dos componentes:**
`c:/projects/estrutura-pedagogica/frontend/src/shared/document-builder/components/`

**Modelos relevantes:**
- Interfaces de layout: `../../models/layout.models`
- Tipos de dados e constantes de página: `../../models/document-config`

---

## Passo 1 — Classificar o componente

Antes de criar qualquer arquivo, responda às perguntas abaixo (derive do contexto do usuário;
pergunte apenas se não for possível derivar):

| Pergunta | Resposta esperada |
|----------|-------------------|
| O componente exibe **dados tabulares** (linhas e colunas)? | Sim → base em `DocTableComponent` |
| As linhas podem **quebrar entre páginas**? | Sim → implementar `Splittable` |
| A tabela pode **ultrapassar a largura da página** (muitas colunas)? | Sim → implementar `ColumnSplittable` |
| A altura do componente é **fixa** (não depende de texto)? | Sim → `TextMeasurable` com `getTextSegments() = []` |
| O componente contém **texto que pode quebrar linha**? | Sim → `TextMeasurable` com segmentos reais |

---

## Passo 2 — Escolher a interface correta

### Caso A — Componente de altura fixa (info, header, footer, rodapé simples)

Use `TextMeasurable` com `getTextSegments()` retornando `[]`.
O `getVerticalPadding()` representa a altura **total** do componente.

```typescript
// Calcule e documente as parcelas da altura:
// header: font-size(12px) line-height(~16px) + padding-bottom(4px) = 20px
// tabela 1 linha: line-height(14) + padding(4+4) + border(1+1) = 24px
export const DOC_XXX_HEIGHT = N;

export class DocXxxComponent implements TextMeasurable {
  @Input() data: XxxData = { ... };
  @Input() contentWidth?: number;  // incluir se o componente é sensível à largura

  getTextSegments() { return []; }
  getMaxWidth(): number { return this.contentWidth ?? PAGE_CONTENT_WIDTH_PORTRAIT; }
  getLineHeight(): number { return 14; }        // px — font-size + leading
  getVerticalPadding(): number { return DOC_XXX_HEIGHT; }
}
```

**Quando usar:** `DocInfoFrequenciaComponent`, `DocFooterComponent`, `DocInfoRowComponent`,
`DocPresencaInfoComponent`, `DocCarometroInfoComponent` seguem este padrão.

---

### Caso B — Componente com texto que pode quebrar linha

Use `TextMeasurable` com `getTextSegments()` retornando os segmentos de texto com a fonte.
O `getVerticalPadding()` deve retornar **apenas o padding** (não inclui o texto).

```typescript
// DOC_XXX_PADDING_V = padding topo + base em px
export const DOC_XXX_PADDING_V = N;

export class DocXxxComponent implements TextMeasurable {
  @Input() data: XxxData = { ... };
  @Input() contentWidth?: number;
  @Input() fontSize?: number;

  get font(): string { return `${this.fontSize ?? 10}px Nunito`; }

  getTextSegments() {
    return [{ text: this.data.texto, font: this.font }];
  }
  getMaxWidth(): number { return this.contentWidth ?? PAGE_CONTENT_WIDTH_PORTRAIT; }
  getLineHeight(): number { return (this.fontSize ?? 10) + 4; }
  getVerticalPadding(): number { return DOC_XXX_PADDING_V; }
}
```

A fórmula que o `MeasurementService` aplica internamente:
```
altura = sum(Pretext.layout(segment.text, segment.font, maxWidth, lineHeight).height)
       + getVerticalPadding()
```

---

### Caso C — Tabela que quebra entre páginas (Splittable)

**Use `DocTableComponent` diretamente** via `DocumentEntry` em vez de criar um novo componente.
`DocTableComponent` já implementa `Splittable` com medição exata de células via Pretext.

Quando criar um componente que **envolve** uma tabela (ex.: tabela com header personalizado),
delegue a medição para `DocTableComponent` internamente e implemente `Splittable` redirecionando:

```typescript
export class DocXxxComponent implements Splittable {
  @Input() data: XxxData = { ... };

  // Referência ao DocTableComponent filho via @ViewChild para delegar Splittable
  @ViewChild(DocTableComponent) table!: DocTableComponent;

  getRowHeight(): number { return this.table.getRowHeight(); }
  getRowsThatFit(h: number): number { return this.table.getRowsThatFit(h); }
  split(n: number): SplitResult { return this.table.split(n); }
}
```

---

### Caso D — Tabela que pode ultrapassar a largura (ColumnSplittable)

Implemente `ColumnSplittable` quando o número de colunas for variável e pode exceder
`PAGE_CONTENT_WIDTH_PORTRAIT`. Cada chunk retornado por `splitColumns()` é um `LayoutComponent`
independente e pode ser ele mesmo `Splittable`.

```typescript
export class DocXxxComponent implements ColumnSplittable {
  splitColumns(pageContentWidth: number): LayoutComponent[] {
    // agrupa colunas em chunks que cabem na página
    // cada chunk gera um LayoutComponent com renderData para reconstrução
  }
}
```

---

## Passo 3 — Constantes de altura

Toda constante de altura deve ser:
1. Exportada do arquivo do componente (não de um arquivo separado)
2. Nomeada como `DOC_XXX_HEIGHT` (altura total) ou `DOC_XXX_PADDING_V` (só padding)
3. Acompanhada de comentário explicando as parcelas:

```typescript
// line-height(14) + padding(6+6) + border(1+1)
export const DOC_INFO_ROW_HEIGHT = 28;
```

---

## Passo 4 — Padrão de @Input

Todo componente do document-builder segue:

```typescript
@Input() data: XxxData = { /* valor padrão seguro */ };
@Input() contentWidth?: number;   // incluir se o componente usa largura para cálculo
@Input() fontSize?: number;       // incluir apenas se o componente tem texto mensurável
@Input() cellPadding?: number;    // incluir apenas em componentes do tipo tabela
```

Nunca usar `required: true` em `@Input()` — o `LayoutEngine` pode criar instâncias sem inputs.

---

## Passo 5 — Standalone vs módulo

- **Standalone (`standalone: true` ou sem a propriedade, padrão v17+):**
  Use `imports: [NgFor, NgIf, NgClass, ...]` no decorator.
  Exemplo: `DocInfoFrequenciaComponent`, `DocCarometroInfoComponent`.

- **Módulo (`standalone: false`):**
  Use apenas se o componente for declarado em um `NgModule`.
  Exemplo: `DocTableComponent`, `DocFooterComponent`, `DocInfoRowComponent`.

  Derive observando os componentes vizinhos na mesma pasta:
  - Se existir `doc-table.module.ts` ou o componente for declarado em `document-builder.module.ts`,
    use `standalone: false`.

---

## Passo 6 — Checklist antes de criar

- [ ] Classificou o componente (A, B, C ou D)?
- [ ] Calculou a altura com as parcelas documentadas?
- [ ] Definiu o nome da constante (`DOC_XXX_HEIGHT` ou `DOC_XXX_PADDING_V`)?
- [ ] Verificou se standalone ou módulo (olhando os vizinhos)?
- [ ] Definiu o tipo `XxxData` em `document-config.ts` (se ainda não existir)?

---

## Passo 7 — Criar os arquivos

### 7.1 — Tipo de dados (se necessário)

Se o tipo `XxxData` não existir em `document-config.ts`, adicioná-lo antes de criar o componente:

```
c:/projects/estrutura-pedagogica/frontend/src/shared/document-builder/models/document-config.ts
```

### 7.2 — Componente

Criar os 3 arquivos na pasta `components/doc-xxx/`:
- `doc-xxx.component.ts`
- `doc-xxx.component.html`
- `doc-xxx.component.scss`

### 7.3 — Declaração no módulo (se standalone: false)

Se o componente usa `standalone: false`, declará-lo no `NgModule` correspondente (normalmente
`document-builder.module.ts`). Não esquecer de exportar para que outros módulos possam usá-lo.

---

## Saída esperada

Ao final, liste:

```
Arquivos criados:
- components/doc-xxx/doc-xxx.component.ts      (TextMeasurable, constante DOC_XXX_HEIGHT)
- components/doc-xxx/doc-xxx.component.html
- components/doc-xxx/doc-xxx.component.scss

Arquivos modificados:
- models/document-config.ts                    (adicionado XxxData)
- document-builder.module.ts                   (declarado DocXxxComponent)  ← se standalone: false

Interface implementada: TextMeasurable (Caso A — altura fixa)
Altura calculada: 44px = header(20) + tabela 1 linha(24)
```

---

## O que **não** fazer

- Não criar uma nova tabela do zero quando `DocTableComponent` já atende — reusar via `DocumentEntry`
- Não omitir a constante de altura exportada — o caller pode precisar dela para cálculos externos
- Não colocar lógica de paginação dentro do componente — isso é responsabilidade do `LayoutEngine`
- Não usar `required: true` em `@Input()` — instâncias são criadas dinamicamente sem inputs
- Não implementar `ColumnSplittable` em tabelas que cabem na largura da página
- Não misturar `Splittable` e `TextMeasurable` no mesmo componente sem necessidade real
- Não usar o MCP `sqlserver` para explorar schema — se precisar de dados, use `_pde/db_map/`
