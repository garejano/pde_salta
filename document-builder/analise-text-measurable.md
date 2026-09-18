# Análise: implementação de TextMeasurable nos componentes do document-builder

## Contexto

`TextMeasurable` permite que o `MeasurementService` calcule a altura de um componente via
`@chenglou/pretext` (pré-render, sem DOM), em vez de renderizar o componente num host oculto
e medir com `getBoundingClientRect()`. Ganhos: layout mais rápido, sem flash de renderização
temporária, sem dependência de timing de CD.

```typescript
interface TextMeasurable {
  getTextSegments(): Array<{ text: string; font: string }>  // texto que pode quebrar linha
  getMaxWidth(): number                                      // largura máxima disponível
  getLineHeight(): number                                    // altura por linha
  getVerticalPadding(): number                              // padding + border + extras fixos
}
```

`measureWithPretext` retorna: `sum(altura de cada segmento) + getVerticalPadding()`.

Para componentes com altura **totalmente fixa** (texto `white-space: nowrap` ou sem texto),
`getTextSegments()` retorna `[]` e todo o valor vai em `getVerticalPadding()`.

---

## Já implementam (não precisam de ação)

| Componente | Tipo | Observação |
|---|---|---|
| `DocSectionComponent` | TextMeasurable | title pode quebrar linha |
| `DocTextComponent` | TextMeasurable | value wraps com pre-wrap |
| `DocTextFieldComponent` | TextMeasurable | value wraps, min-height 60px |
| `DocStatementComponent` | TextMeasurable | pre-wrap, text-align justify |
| `DocTitleComponent` | TextMeasurable | title pode quebrar linha |
| `DocLegendComponent` | TextMeasurable | items flex-wrap |
| `DocInfoFrequenciaComponent` | TextMeasurable | altura fixa 20px (implementado) |
| `DocTableComponent` | Splittable | quebra por linha de tabela |
| `DocCarometroGridComponent` | Splittable | quebra por linha de cards |
| `DocWideTableComponent` | ColumnSplittable + Splittable | quebra horizontal e vertical |
| `DocGridDiarioComponent` | ColumnSplittable | factory para DocWideTable |
| `DocGridRendimentoComponent` | ColumnSplittable | factory para DocWideTable |
| `DocGridConteudoComponent` | ColumnSplittable | factory que produz Splittable |

---

## Candidatos a implementar

### 1. `DocFooterComponent` — Prioridade: **alta**

**Por quê:** Altura completamente fixa definida em CSS (`height: 18px`). É um dos componentes
mais usados (aparece em toda página). A cada documento com N páginas, N renders temporários
são feitos desnecessariamente.

**Como implementar:**

```typescript
export const DOC_FOOTER_HEIGHT = 18;

export class DocFooterComponent implements TextMeasurable {
  getTextSegments() { return []; }
  getMaxWidth() { return PAGE_CONTENT_WIDTH_PORTRAIT; }
  getLineHeight() { return 12; }
  getVerticalPadding() { return DOC_FOOTER_HEIGHT; }
}
```

---

### 2. `DocInfoRowComponent` — Prioridade: **alta**

**Por quê:** Flex row com `white-space: nowrap` em labels e valores. Altura sempre fixa:
`line-height(14) + padding(6+6) + border(1+1) = 28px`. Aparece múltiplas vezes em documentos
de frequência e rendimento.

**SCSS relevante:** `font-size: 10px`, `line-height: 14px`, `padding: 6px 0`,
`border-top/bottom: 1px solid #ccc`.

**Como implementar:**

```typescript
export const DOC_INFO_ROW_HEIGHT = 28; // line-height(14) + padding(12) + border(2)

export class DocInfoRowComponent implements TextMeasurable {
  getTextSegments() { return []; }
  getMaxWidth() { return this.contentWidth ?? PAGE_CONTENT_WIDTH_PORTRAIT; }
  getLineHeight() { return 14; }
  getVerticalPadding() { return DOC_INFO_ROW_HEIGHT; }
}
```

Adicionar `@Input() contentWidth?: number` seguindo o padrão do módulo.

---

### 3. `DocCarometroInfoComponent` — Prioridade: **média**

**Por quê:** Estrutura fixa: header (12px uppercase + 4px padding-bottom) + tabela de 2 linhas
(`line-height: 14px`, `padding: 4px 6px`, `border: 1px`). Altura totalmente previsível.

**Cálculo:**
- Header: ~16px (`font-size: 12px` line-height ~14px + padding 4px bottom) 
- Tabela: 2 linhas × (14 + 8 + 2) = 48px
- Total: ~64px

**Como implementar:**

```typescript
export const DOC_CAROMETRO_INFO_HEIGHT = 64;

export class DocCarometroInfoComponent implements TextMeasurable {
  getTextSegments() { return []; }
  getMaxWidth() { return this.contentWidth ?? PAGE_CONTENT_WIDTH_PORTRAIT; }
  getLineHeight() { return 14; }
  getVerticalPadding() { return DOC_CAROMETRO_INFO_HEIGHT; }
}
```

Verificar altura no browser com `getBoundingClientRect()` antes de fixar o valor da constante.

---

### 4. `DocPresencaInfoComponent` — Prioridade: **média**

**Por quê:** Header fixo + tabela com número de colunas variável, mas **sempre 1 linha de dados**
(`white-space: nowrap` nos cells). Altura previsível.

**Cálculo:** mesmo padrão de `DocCarometroInfoComponent` — header + 1 linha de tabela.
- Header: ~18px
- Linha: 14 + 8 + 2 = 24px
- Total: ~42px

**Atenção:** Confirmar se o número de linhas da tabela é sempre 1. Se puder variar, a
implementação precisa calcular `data.cols.length` × altura_linha.

---

### 5. `DocInfoGridComponent` — Prioridade: **baixa**

**Por quê:** Flex column com 4 linhas fixas (`gap: 4px`), spans com `white-space: nowrap`.
Altura semi-previsível.

**Dificuldade:** As linhas têm `flex-wrap: wrap` e `min-width: 15%` — se o viewport for
estreito, podem quebrar. Mas no contexto do documento (largura fixa de 772px), o layout
é determinístico. Requer cálculo mais cuidadoso do número de linhas real.

**Estimativa atual:** 4 linhas × (9px font + ~12px height + 4px gap) − último gap = ~60px.

**Recomendação:** Implementar apenas se o profiler mostrar este componente como gargalo.
O custo do DOM measurement aqui é baixo (aparece tipicamente 1× por documento).

---

### 6. `DocHeaderComponent` — Prioridade: **baixa**

**Por quê:** Já possui `DOC_HEADER_HEIGHT = 80` definido no componente, sugerindo que a
intenção era ter altura fixa. Porém, o conteúdo (institutionName, address, additionalInfo)
pode variar em comprimento e potencialmente quebrar linha.

**Dificuldade:** Para ser preciso com Pretext, precisaria medir o segmento `institutionName`
(maior, `font-size: 12px`) com a largura disponível. Factível, mas requer cuidado com o
layout de 3 colunas (logo | texto | emblema) que reduz a largura efetiva para o texto central.

**Recomendação:** Manter DOM measurement por ora. Se o header for medido sempre errado
(cortando ou deixando espaço vazio), aí vale o esforço.

---

## Componentes que NÃO devem implementar

| Componente | Razão |
|---|---|
| `DocCarometroCardComponent` | Altura depende de variant + foto — não é computável via texto |
| `DocSignatureComponent` | Altura depende de número de signatários e layout multi-coluna |
| `DocTableComponent` | Já é `Splittable` — DOM measurement é necessário para per-row heights |
| Componentes de controle/config/debug | Não participam do layout do documento |

---

## Resumo de impacto esperado

Implementar os 4 candidatos prioritários (`DocFooter`, `DocInfoRow`, `DocCarometroInfo`,
`DocPresencaInfo`) elimina DOM render temporário para os blocos de cabeçalho e rodapé de
informações, que são os mais repetidos em documentos de frequência e presença.
