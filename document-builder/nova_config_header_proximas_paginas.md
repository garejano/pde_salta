# Feature: `pageHeader` — Cabeçalho Repetido nas Páginas Subsequentes

**Repositório:** `estrutura-pedagogica`  
**Área:** `src/shared/document-builder/`  
**Status:** Planejamento

---

## 1. Contexto e Motivação

O document-builder já suporta exibir o cabeçalho institucional (`DocHeaderComponent`) em todas as páginas via `header.onAllPages: true`. No entanto, não há como injetar um componente de **conteúdo** (ex.: linha com turma, tipo de documento ou período) como primeiro item das páginas 2+.

Caso de uso concreto em `lista-presenca.component.ts > buildCarometro` e nas variantes de lista de presença: quando o documento quebra em múltiplas páginas, o leitor perde o contexto de qual turma está vendo. Um componente compacto de identificação da turma/tipo repetido no topo de cada página subsequente resolve isso sem poluir a primeira página.

---

## 2. Arquitetura Atual — Resumo

```
DocumentViewer
  │
  ├─ measureBundle()          → cria instâncias, mede alturas → LayoutComponent[]
  │
  ├─ LayoutEngineService
  │    └─ distribute()        → aloca LayoutComponent[] em Page[]
  │         └─ addComponent() → cabe? →add | splittable? →split | senão →nova página
  │
  ├─ distributeElements()     → move elementos DOM para os #content de cada DocumentPage
  │
  └─ DocumentPageComponent    → renderiza: header + #content + signature + footer
```

**`DocumentConfig` relevante hoje:**

```typescript
header?: {
  show: boolean;
  onAllPages?: boolean;   // controla o cabeçalho institucional
};
```

**`Page` (resultado do distribute):**

```typescript
interface Page {
  id: string;
  index: number;
  components: LayoutComponent[];   // entries distribuídos nesta página
  freeSpace: number;
  showHeader: boolean;
  showFooter: boolean;
  showSignature: boolean;
}
```

---

## 3. Problema Central

Para inserir um componente no topo de páginas 2+, precisamos de **duas coisas**:

1. **Reservar espaço** no layout engine para que as pages 2+ tenham menos espaço disponível (a altura do page header é subtraída de `otherEffective`).
2. **Injetar o DOM** do componente como primeiro filho do `#content` de cada página 2+.

---

## 4. Solução Proposta

### 4.1 Nova interface: `PageHeaderConfig`

```typescript
// document-config.ts
export interface PageHeaderConfig {
  componentType: Type<unknown>;
  data: unknown;
}
```

### 4.2 Adição em `DocumentConfig`

```typescript
export interface DocumentConfig {
  // ... campos existentes ...
  pageHeader?: PageHeaderConfig;   // componente injetado no topo das páginas 2+
}
```

Semântica: quando `pageHeader` está definido, o componente informado é instanciado e inserido como **primeiro elemento** do conteúdo de todas as páginas exceto a primeira.

---

## 5. Mudanças por Arquivo

### 5.1 `models/document-config.ts`

```diff
+ export interface PageHeaderConfig {
+   componentType: Type<unknown>;
+   data: unknown;
+ }

  export interface DocumentConfig {
    // ... campos existentes ...
+   pageHeader?: PageHeaderConfig;
  }
```

---

### 5.2 `services/layout-engine.service.ts`

Adicionar parâmetro `pageHeaderHeight` ao método `distribute()`. Ele é subtraído de `otherEffective` para que as páginas 2+ reservem o espaço correto.

```typescript
distribute(
  components: LayoutComponent[],
  firstPageHeight: number,
  otherPageHeight: number,
  signatureHeight: number = 0,
  signatureOnAllPages: boolean = false,
  headerOnAllPages: boolean = true,
  pageHeaderHeight: number = 0        // NOVO
): Page[] {
  const firstEffective = signatureOnAllPages
    ? firstPageHeight - signatureHeight
    : firstPageHeight;

  // pageHeaderHeight reduz o espaço útil apenas nas páginas 2+
  const otherEffective = signatureOnAllPages
    ? otherPageHeight - signatureHeight - pageHeaderHeight
    : otherPageHeight - pageHeaderHeight;

  // ... resto do método inalterado ...
}
```

**Sem outras mudanças no layout engine.** A lógica de alocação (`addComponent`, splits, nova página) permanece idêntica — ela só passa a operar com um `otherEffective` menor.

---

### 5.3 `components/document-viewer/document-viewer.component.ts`

Três adições:

#### A) Medir o page header antes de distribuir

No início de `initSingle()` (e `initMulti()` se aplicável), medir o componente de page header para obter sua altura real:

```typescript
private measurePageHeader(config: DocumentConfig): { element: HTMLElement; height: number } | null {
  if (!config.pageHeader) { return null; }

  const { componentType, data } = config.pageHeader;
  const ref = this.measureVcr.createComponent(componentType as Type<unknown>);
  ref.setInput('data', data);

  const contentWidth = this.getContentWidthFor(config);
  if (inputNames(ref).has('contentWidth')) { ref.setInput('contentWidth', contentWidth); }
  if (inputNames(ref).has('fontSize'))     { ref.setInput('fontSize', config.fontSize ?? 10); }

  this.cdr.detectChanges();

  const element = ref.location.nativeElement as HTMLElement;
  const height = this.measurementService.measure(ref.instance, element);

  return { element, height };
}
```

#### B) Passar `pageHeaderHeight` para o distribute

```typescript
private async initSingle(): Promise<void> {
  // ... medição das entries existente ...

  const pageHeader = this.measurePageHeader(this.config);     // NOVO
  const pageHeaderHeight = pageHeader?.height ?? 0;           // NOVO

  this.pages = this.layoutEngine.distribute(
    layoutComponents,
    firstPageHeight,
    otherPageHeight,
    sigHeight,
    sigOnAll,
    headerOnAllPages,
    pageHeaderHeight,        // NOVO
  );

  this.pageHeaderElement = pageHeader?.element ?? null;        // NOVO: guarda referência

  // ... distributeElements() ...
}
```

#### C) Injetar o page header no topo das páginas 2+

No método `distributeElements()`, após distribuir os elementos regulares, injetar o page header:

```typescript
private distributeElements(): void {
  // ... código existente de distribuição de entries ...

  // NOVO: injetar page header nas páginas 2+
  if (this.pageHeaderElement && this.pageComponents.length > 1) {
    for (let i = 1; i < this.pageComponents.length; i++) {
      const contentEl = this.pageComponents[i].getContentEl();
      // cloneNode(true) porque o mesmo elemento não pode estar em múltiplos lugares
      const clone = this.pageHeaderElement.cloneNode(true) as HTMLElement;
      contentEl.prepend(clone);
    }
  }
}
```

**Por que `cloneNode`?** O layout engine gera as instâncias de componente em um container de medição. O elemento DOM pode ser movido para apenas um lugar via `appendChild`. `cloneNode(true)` copia a árvore DOM renderizada. Como o page header é **estático** (dados não mudam após a renderização inicial), não há perda de funcionalidade.

**Campo de controle:**

```typescript
private pageHeaderElement: HTMLElement | null = null;
```

Limpar em `fecharOverlay` / `reset()` (onde os demais campos são limpos).

---

### 5.4 `components/document-page/document-page.component.ts`

**Sem alterações.** O page header é injetado via DOM por `distributeElements()`, exatamente como os entries regulares. O `DocumentPageComponent` não precisa saber de sua existência.

---

## 6. Fluxo Completo Após a Feature

```
DocumentViewer.initSingle()
  │
  ├─ measureBundle(entries)         → LayoutComponent[] para entries normais
  │
  ├─ measurePageHeader(config)      → { element, height } | null
  │
  ├─ layoutEngine.distribute(
  │     components,
  │     firstPageHeight,
  │     otherPageHeight,
  │     ...,
  │     pageHeaderHeight            ← reduz otherEffective nas páginas 2+
  │   )                             → Page[]
  │
  └─ distributeElements()
       ├─ injeta entries nas páginas (comportamento existente)
       └─ para páginas 2+: prepend(cloneNode(pageHeaderElement))
```

---

## 7. Exemplo de Uso — `buildCarometro` e Variantes

### Antes (sem page header)

```typescript
private buildCarometro(item: CarometroDocumentoTurmaData): DocumentBundle {
  return {
    config: {
      orientation: 'portrait',
      header: { show: true, onAllPages: false },
      footer: { show: true },
      componentGap: 8,
    },
    headerData: this.buildHeaderData(item.cabecalho, item.turma.nomeEscola),
    label: `${item.turma.nomeSerie} — ${item.turma.nomeTurma}`,
    entries: [
      { name: 'Carômetro', componentType: DocCarometroGridComponent, data: { alunos: item.alunos } },
    ],
  };
}
```

### Depois (com page header compacto)

```typescript
private buildCarometro(item: CarometroDocumentoTurmaData): DocumentBundle {
  const turmaLabel = `${item.turma.nomeSerie} ${item.turma.nomeTurma} — ${item.turma.nomeTurno}`;

  return {
    config: {
      orientation: 'portrait',
      header: { show: true, onAllPages: false },
      footer: { show: true },
      componentGap: 8,
      pageHeader: {                                // NOVO
        componentType: DocPresencaInfoComponent,
        data: { tipo: 'Carômetro', turma: turmaLabel, dateLabel: '' } as DocPresencaInfoData,
      },
    },
    headerData: this.buildHeaderData(item.cabecalho, item.turma.nomeEscola),
    label: `${item.turma.nomeSerie} — ${item.turma.nomeTurma}`,
    entries: [
      { name: 'Carômetro', componentType: DocCarometroGridComponent, data: { alunos: item.alunos } },
    ],
  };
}
```

### Variante para lista diária (buildDiaria)

```typescript
config: {
  orientation: 'portrait',
  header: { show: true, onAllPages: false },
  footer: { show: true },
  componentGap: 8,
  pageHeader: {
    componentType: DocPresencaInfoComponent,
    data: { tipo: 'Diária', turma: turmaLabel, dateLabel: 'Data' } as DocPresencaInfoData,
  },
},
```

---

## 8. Casos Limite e Comportamento Esperado

| Cenário | Comportamento |
|---------|--------------|
| `pageHeader` ausente | Feature desligada, comportamento 100% igual ao atual |
| Documento com 1 página | `pageHeader` é medido mas nunca injetado (loop `for i = 1` não executa) |
| `pageHeader` maior que a página | Mesmo tratamento dos entries: força fit (overflow) |
| `header.onAllPages: true` + `pageHeader` | Os dois convivem: cabeçalho institucional no topo, page header logo abaixo na área de conteúdo |
| `reload()` | A medição acontece de novo no `initSingle()`; `pageHeaderElement` é recriado corretamente |
| Multi-documento (bundles) | Cada bundle tem seu próprio `config.pageHeader`; cada `initBundle()` mede independentemente |

---

## 9. Arquivos Impactados

| Arquivo | Tipo de mudança |
|---------|----------------|
| `models/document-config.ts` | Adição de interface `PageHeaderConfig` e prop em `DocumentConfig` |
| `services/layout-engine.service.ts` | Novo parâmetro `pageHeaderHeight` em `distribute()` |
| `components/document-viewer/document-viewer.component.ts` | Medição, armazenamento e injeção do page header |
| `components/document-viewer/document-viewer.component.html` | Sem alteração |
| `components/document-page/document-page.component.ts` | **Sem alteração** |
| `components/document-page/document-page.component.html` | **Sem alteração** |
| `features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts` | Uso da nova prop nos métodos `buildCarometro`, `buildDiaria`, etc. |

---

## 10. Critérios de Aceitação

- [ ] Navegar para `exemplos/carometro` e verificar que a segunda página (e seguintes) exibem o componente compacto de identificação da turma no topo
- [ ] Verificar que a primeira página **não** exibe o page header
- [ ] Verificar que o conteúdo não ultrapassa os limites da página (a reserva de espaço está correta)
- [ ] Verificar que `reload()` após mudança de config (ex.: orientação) re-renderiza corretamente
- [ ] Quando `pageHeader` é `undefined`, o comportamento é idêntico ao atual (regressão zero)
- [ ] Salvar PDF e imprimir: o page header aparece nas páginas corretas

---

## 11. Notas de Implementação

- **`cloneNode(true)` vs nova instância Angular:** A clonagem de DOM é intencional e consistente com o padrão existente (entries também são movidos via DOM). O page header é renderizado uma vez com os dados corretos; como esses dados são estáticos (não mudam durante a vida do documento), a ausência de binding Angular não é problema.
- **Ordem dos inputs no `measurePageHeader`:** Seguir exatamente a mesma ordem de `measureBundle` para garantir que a altura medida corresponde à altura real renderizada nas páginas.
- **Gap:** O `componentGap` da config NÃO é adicionado ao `pageHeaderHeight`, pois o page header é o primeiro item da página — não há elemento acima dele para separar.
