# Implementação: Variantes de Card do Carômetro

Repositório: `estrutura-pedagogica`

> Contexto: ver `doc-carometro.md` para o modelo de dados, componentes base e rota de exemplo.

---

## Visão geral

O objetivo é permitir que o usuário escolha, dentro do print-overlay, uma das 12 variantes
de card do aluno (A–L) antes de imprimir ou salvar o carômetro. A variante selecionada é
aplicada a todo o grid e o documento é re-renderizado sem fechar o overlay.

---

## Variantes disponíveis (mapeamento HTML → código)

| Tag | Nome exibido | CSS class no HTML | Características |
|---|---|---|---|
| A | Foto no topo, empilhada | `va` | Avatar topo + texto vertical. Padrão atual evoluído. |
| B | Foto lateral retrato (crachá) | `vb` | Avatar lateral + coluna de dados completa. |
| C | Foto herói (banner) | `vc` | Avatar full-width, nome/RA sobrepostos como label. |
| D | Foto máxima, dados mínimos | `vd` | Avatar circular grande, sem telefone/e-mail. |
| E | Híbrida com bloco de contato | `ve` | Avatar topo + bloco de contato com ícones. |
| F | Crachá institucional | `vf` | Foto ampla + rodapé com marca e responsável. |
| G | Catálogo | `vg` | Foto com pill do tipo de responsável, rodapé. |
| H | Ficha com chips | `vh` | Avatar lateral pequeno + chips de turma/tipo. |
| I | Crachá escuro | `vi` | Fundo escuro, RA na vertical, rodapé com badge. |
| J | Crachá claro | `vj` | Foto dominante + caption degradê + rodapé. |
| K | Foto lateral com rótulo | `vk` | Foto retrato lateral com nome/RA sobrepostos. |
| L | Crachá full-bleed | `vl` | Foto ocupa todo o card, overlays topo e base. |

Referência de design: `document-builder/variantes-card-carometro/Carometro.html`

---

## Arquivos a criar

```
src/shared/document-builder/components/
  doc-carometro-card/
    doc-carometro-card.component.ts
    doc-carometro-card.component.html
    doc-carometro-card.component.scss

  carometro-variant-picker/
    carometro-variant-picker.component.ts
    carometro-variant-picker.component.html
    carometro-variant-picker.component.scss
```

## Arquivos a modificar

```
src/shared/document-builder/components/doc-carometro-grid/
  doc-carometro-grid.component.ts   ← aceita variant e cardHeight como input
  doc-carometro-grid.component.html ← usa DocCarometroCardComponent
  doc-carometro-grid.component.scss ← remove estilos de card (migram para doc-carometro-card)

src/shared/document-builder/
  document-builder.module.ts        ← declara os 2 novos componentes

src/app/features/exemplos/carometro-exemplo/
  carometro-exemplo.component.ts    ← adiciona variant state, repassa ao bundle
```

---

## 1. Tipo `CarometroCardVariant`

Adicionar em `src/app/features/lancamento-frequencia/models.ts` (ao lado de `CarometroAlunoData`):

```typescript
export type CarometroCardVariant =
  'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export const CAROMETRO_VARIANTS: { tag: CarometroCardVariant; label: string }[] = [
  { tag: 'A', label: 'Foto no topo, empilhada' },
  { tag: 'B', label: 'Foto lateral retrato (crachá)' },
  { tag: 'C', label: 'Foto herói (banner)' },
  { tag: 'D', label: 'Foto máxima, dados mínimos' },
  { tag: 'E', label: 'Híbrida com bloco de contato' },
  { tag: 'F', label: 'Crachá institucional' },
  { tag: 'G', label: 'Catálogo' },
  { tag: 'H', label: 'Ficha com chips' },
  { tag: 'I', label: 'Crachá escuro' },
  { tag: 'J', label: 'Crachá claro' },
  { tag: 'K', label: 'Foto lateral com rótulo' },
  { tag: 'L', label: 'Crachá full-bleed' },
];
```

---

## 2. `DocCarometroCardData` — interface de dados do grid (atualizada)

Adicionar o campo `variant` e `cardHeight` em `DocCarometroGridData`:

```typescript
// doc-carometro-grid.component.ts
export interface DocCarometroGridData {
  alunos: CarometroAlunoData[];
  variant?: CarometroCardVariant;   // default 'A'
  cardHeight?: number;              // default 180 — permite override por variante
}
```

> Manter retrocompatível: `variant` e `cardHeight` são opcionais. Quando ausentes, o
> comportamento é idêntico ao atual.

---

## 3. `DocCarometroCardComponent` — card individual

### Contrato

```typescript
// doc-carometro-card.component.ts
@Component({
  standalone: false,
  selector: 'app-doc-carometro-card',
  // ...
})
export class DocCarometroCardComponent {
  @Input() aluno!: CarometroAlunoData;
  @Input() variant: CarometroCardVariant = 'A';
  @Input() cardHeight = 180;   // px — usado para definir o host height via HostBinding
}
```

**`@HostBinding('style.height.px') get h() { return this.cardHeight; }`** — o card sempre
ocupa exatamente `cardHeight`px, garantindo que o cálculo de Splittable continue exato.

### Template

Usar `[ngSwitch]="variant"` na raiz. Cada `*ngSwitchCase` renderiza o HTML de uma variante
(portado diretamente do `Carometro.html`). As classes CSS de cada variante (`va`, `vb`, …)
são encapsuladas no SCSS deste componente.

Funções auxiliares compartilhadas entre variantes (já existem no grid atual, migrar para cá):
- `initials(nome)` — 2 iniciais da string
- `bgColor(nome)` / `fgColor(nome)` — paleta determinística por hash
- `onPhotoError(event, aluno)` — fallback para avatar
- `responsavelLabel(tipo)` — "Pedagógico" | "Financeiro" | "Nenhum"

Campos nulos: qualquer campo `null` deve renderizar `N/A` (string) com classe `.muted`,
ocupando o mesmo espaço que o valor preenchido.

### Alturas de card por variante

Algumas variantes têm alturas naturais diferentes. Definir um mapa de altura padrão por
variante para que o `CarometroVariantPickerComponent` e o `DocCarometroGridComponent`
usem como default quando não sobrescrito:

```typescript
// em doc-carometro-card.component.ts (constante exportada)
export const VARIANT_DEFAULT_HEIGHT: Record<CarometroCardVariant, number> = {
  A: 180,
  B: 160,
  C: 200,   // banner top ocupa mais altura
  D: 180,
  E: 200,   // bloco de contato extra
  F: 200,
  G: 200,
  H: 170,
  I: 220,
  J: 220,
  K: 180,
  L: 280,   // full-bleed — 3 linhas por página
};
```

---

## 4. `DocCarometroGridComponent` — refatorado

### Mudanças no TS

- Ler `variant` e `cardHeight` de `data`. Se `cardHeight` não informado, usar
  `VARIANT_DEFAULT_HEIGHT[variant ?? 'A']`.
- As constantes `CARD_HEIGHT`, `ROW_GAP`, `ROW_HEIGHT` tornam-se propriedades calculadas:
  ```typescript
  private get effectiveCardHeight(): number {
    return this.data.cardHeight ?? VARIANT_DEFAULT_HEIGHT[this.data.variant ?? 'A'];
  }
  private get rowHeight(): number { return this.effectiveCardHeight + ROW_GAP; }
  ```
- `getRowsThatFit` e `split` usam `this.rowHeight` em vez da constante fixa.

### Mudanças no HTML

Substituir o `<div class="card">` interno (remover — essa classe conflita com o global) por:

```html
<app-doc-carometro-card
  *ngFor="let aluno of displayAlunos"
  [aluno]="aluno"
  [variant]="data.variant ?? 'A'"
  [cardHeight]="effectiveCardHeight"
></app-doc-carometro-card>
```

---

## 5. `CarometroVariantPickerComponent` — seletor de variante

### Contrato

```typescript
@Component({
  standalone: false,
  selector: 'app-carometro-variant-picker',
  // ...
})
export class CarometroVariantPickerComponent {
  @Input()  selected: CarometroCardVariant = 'A';
  @Output() selectedChange = new EventEmitter<CarometroCardVariant>();

  readonly variants = CAROMETRO_VARIANTS;
  readonly mockAluno: CarometroAlunoData = { /* aluno de preview */ };
}
```

### Template

Lista vertical scrollável (`overflow-y: auto`), cada item:

```html
<div class="vp-list">
  <button
    *ngFor="let v of variants"
    class="vp-item"
    [class.vp-item--active]="v.tag === selected"
    (click)="selectedChange.emit(v.tag)"
  >
    <div class="vp-item__head">
      <span class="vp-item__tag">{{ v.tag }}</span>
      <span class="vp-item__label">{{ v.label }}</span>
    </div>
    <!-- preview compacto do card com dados de mock -->
    <div class="vp-item__preview">
      <app-doc-carometro-card
        [aluno]="mockAluno"
        [variant]="v.tag"
        [cardHeight]="VARIANT_DEFAULT_HEIGHT[v.tag]"
      ></app-doc-carometro-card>
    </div>
  </button>
</div>
```

O `mockAluno` de preview contém: 2–3 nomes reais (sem foto, com avatar de iniciais), RA
fictício `1234567890`, responsável mockado. Usar os mesmos dados do `Carometro.html`:
"Helena Marques Costa".

O preview é renderizado em escala CSS (`transform: scale(0.55)`) para caber no painel
lateral sem comprimir os estilos do card.

---

## 6. Integração no `PrintOverlayComponent`

O print-overlay já possui:
- Botão de settings (engrenagem) que controla `panelOpen`
- Slot `[poPanel]` via `ng-content select="[poPanel]"` no `po-panel__body`

Não é necessário modificar o print-overlay. O componente pai (carometro-exemplo ou
lista-presenca) coloca o picker no slot `[poPanel]`:

```html
<app-print-overlay
  [viewer]="viewer"
  [showConfigButton]="true"
  (closeEvent)="fecharOverlay()"
  (printEvent)="imprimir()"
  (saveEvent)="salvarPdf()"
>
  <!-- conteúdo do painel lateral de personalização -->
  <div poPanel>
    <h3 class="po-panel__section-title">Estilo do card</h3>
    <app-carometro-variant-picker
      [selected]="varianteSelecionada"
      (selectedChange)="onVariantChange($event)"
    ></app-carometro-variant-picker>
  </div>

  <!-- documento -->
  <app-document-viewer #viewer [bundle]="bundle"></app-document-viewer>
</app-print-overlay>
```

### Fluxo de troca de variante

No componente pai (ex: `CarometroExemploComponent`):

```typescript
varianteSelecionada: CarometroCardVariant = 'A';

onVariantChange(v: CarometroCardVariant): void {
  this.varianteSelecionada = v;
  this.bundle = this.buildBundle(this.alunos, v);
  // viewer re-renderiza ao receber novo bundle via ngOnChanges
}

private buildBundle(alunos: CarometroAlunoData[], variant: CarometroCardVariant): DocumentBundle {
  return {
    config: { /* ... mesma config atual ... */ },
    headerData: { /* ... */ },
    label: '...',
    entries: [
      {
        name: 'Carômetro',
        componentType: DocCarometroGridComponent,
        data: { alunos, variant } as DocCarometroGridData,
      },
    ],
  };
}
```

> **Atenção:** verificar se `DocumentViewerComponent` usa `ngOnChanges` ou `reload()` ao
> receber novo bundle. Se precisar de `reload()` explícito, chamar via `@ViewChild`.

---

## 7. Módulo — declarações

Em `document-builder.module.ts`, adicionar às declarações e exports:

```typescript
DocCarometroCardComponent,
CarometroVariantPickerComponent,
```

---

## 8. Sequência de implementação sugerida

1. Criar `CarometroCardVariant` e `CAROMETRO_VARIANTS` em `models.ts`.
2. Criar `DocCarometroCardComponent` com variante A portada do HTML. Testar na rota
   `/exemplos/carometro` substituindo o card interno do grid.
3. Portar as demais 11 variantes (B–L) no `[ngSwitch]` do card.
4. Refatorar `DocCarometroGridComponent` para usar o novo card e aceitar `variant`/`cardHeight`.
5. Criar `CarometroVariantPickerComponent` com lista + preview.
6. Integrar o picker no `CarometroExemploComponent` via slot `[poPanel]`.
7. Replicar a integração em `ListaPresencaComponent.buildCarometro()`.

---

## Notas de implementação

- **Não usar a classe `.card` em nenhum CSS deste componente.** Existe uma classe global
  `.card` no projeto que conflita com as variantes. Usar o prefixo `cmc-` (carometro-card)
  em todas as classes do `DocCarometroCardComponent`:
  - host: `cmc-card`
  - variante A: `cmc-card--va`, `cmc-card__avatar`, `cmc-card__nome`, `cmc-card__ra`, etc.
  - variante B: `cmc-card--vb`, `cmc-card__body`, `cmc-card__sep`, `cmc-card__badge`, etc.
  - … e assim por diante para cada variante
  - O SCSS do grid atual usa `.card` — remover ao migrar para `DocCarometroCardComponent`.

- **Encapsulamento CSS:** os estilos de cada variante ficam **apenas** em
  `doc-carometro-card.component.scss`. Remover estilos de card do SCSS do grid.
- **Avatar vs. foto:** a lógica de `initials` / `bgColor` / `fgColor` / `onPhotoError`
  deve ficar no `DocCarometroCardComponent`, não no grid.
- **Altura fixa por host:** usar `@HostBinding('style.height.px')` no card para garantir
  que o Splittable sempre calcule corretamente, independente do conteúdo.
- **Variante L (full-bleed):** `cardHeight = 280` — implica ~3 linhas por página A4 em vez
  de 4. O cálculo de Splittable trata isso automaticamente via `ROW_HEIGHT`.
- **Preview no picker:** usar `transform: scale(0.55); transform-origin: top left` no
  wrapper do preview; o card interno permanece com sua dimensão real para não distorcer estilos.
