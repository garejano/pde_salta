# Plano Técnico — Redesign do Formulário (Duas Colunas)

**Componente:** `formulario.component` — `estrutura-pedagogica`
**Protótipo:** `interactive-twocol.jsx`

---

## 1. Estrutura do layout (HTML / CSS)

O `app-modal` atual renderiza o conteúdo em um contêiner simples. O novo layout exige controle fino de altura e colunas.

### Estrutura alvo

```
app-modal (width: 1060px, height: min(680px, 100vh - 88px))
└── .modal-formulario  (display:flex, flex-direction:column, height:100%)
    ├── .modal-header   (flex-shrink:0 — título + botão fechar — já no app-modal)
    ├── .modal-body     (flex:1, min-height:0, display:flex)
    │   ├── .col-left   (width:392px, flex-shrink:0, border-right, overflow:hidden, display:flex, flex-direction:column)
    │   │   ├── .form-fields   (flex-shrink:0 — escola+data, título, descrição, divisor, label "Filtrar por turno e série")
    │   │   └── .filter-scroll (flex:1, min-height:0, overflow-y:auto — checkboxes turno/série OU InfoPanel pequeno)
    │   └── .col-right  (flex:1, min-width:0, display:flex, flex-direction:column)
    │       ├── .turmas-header   (flex-shrink:0 — label + search + "selecionar todos")
    │       ├── .turmas-list     (flex:1, min-height:0, border, border-radius:8, overflow-y:auto — lista OU InfoPanel grande)
    │       └── .turmas-summary  (flex-shrink:0 — barra resumo OU oculta)
    └── .modal-footer   (flex-shrink:0 — botões — já no app-modal ou dentro do componente)
```

### Verificar: `app-modal` aceita largura customizada?

Checar se `ModalComponent` tem um `@Input` para `maxWidth` / `width`. Se não tiver, a solução mais simples é aplicar uma classe CSS host no próprio `formulario.component`:

```scss
// formulario.component.scss
:host {
  ::ng-deep .modal-container {   // ajustar ao seletor real do app-modal
    max-width: 1060px !important;
    width: 1060px;
  }
}
```

Alternativa: usar `ViewChild` para passar a largura via `@Input` ao `app-modal`.

---

## 2. Checkbox customizado com estado `partial`

O design usa um checkbox verde com 3 estados: `off | on | partial` (indeterminate).

### Diagnóstico dos componentes existentes

**`app-checkbox`** (`shared/dynamic-components/checkbox/`)
- `standalone: false` — declarado em `DynamicComponentsModule`
- Requer `FormControl` obrigatório — API orientada a Reactive Forms
- Sem estado `partial`
- Sem `@Output()` de clique — a interação ocorre via mutação do FormControl
- Visual: checkbox nativo do browser (sem estilo customizado)

**`app-checkbox-field`** (`core/components/checkbox-field/`)
- É um **toggle switch** (liga/desliga), não um checkbox — descartado

### Por que `app-checkbox` não pode ser aproveitado diretamente

O formulário gerencia seleção com `Set<string>` e arrays (`hashTurnosSelecionados`, `turmasSelecionadas`, etc.) — não com `FormControl`. Adaptar `app-checkbox` exigiria:
1. Tornar `control` opcional e adicionar uma API alternativa state-based
2. Adicionar estado `partial`
3. Adicionar `@Output() toggle`
4. Adicionar estilo visual customizado

Isso afetaria todos os usos existentes em `DynamicComponentsModule` (formulários dinâmicos do projeto inteiro) — risco alto de regressão.

### Solução: criar `app-check` standalone

Novo componente de propósito geral, sem dependência de `FormControl`, exportado pelo `SharedModule`.

**Arquivo:** `src/shared/components/check/check.component.ts`

**API:**

```typescript
@Component({
  selector: 'app-check',
  standalone: true,
  // ...
})
export class CheckComponent {
  state  = input<'on' | 'off' | 'partial'>('off');
  label  = input<string>('');
  size   = input<number>(18);
  disabled = input<boolean>(false);

  toggle = output<void>();
}
```

**Template (sem checkbox nativo — visual 100% CSS/SVG):**

```html
<label class="check-row" [class.check-disabled]="disabled()" (click)="!disabled() && toggle.emit()">
  <span class="check-box" [class.check-on]="state() === 'on'" [class.check-partial]="state() === 'partial'">
    @if (state() === 'on') {
      <!-- SVG checkmark -->
    }
    @if (state() === 'partial') {
      <span class="check-dash"></span>
    }
  </span>
  @if (label()) {
    <span class="check-label">{{ label() }}</span>
  }
</label>
```

**Estilo (alinhado ao design):**
- Caixa: `18×18px`, `border-radius: 4px`
- `off`: borda `1.5px solid #C3C8D1`, fundo branco
- `on` / `partial`: fundo `#28975A` (verde), sem borda
- Checkmark: SVG branco
- Dash (`partial`): retângulo branco `9×2px`
- Transição `background 120ms, border-color 120ms`
- Label: `font-size: 14px`, cor `#0F0F10`

**Registrar em SharedModule:**

```typescript
// shared.module.ts — adicionar nas declarações e exportações
import { CheckComponent } from './components/check/check.component';

@NgModule({
  imports: [..., CheckComponent],
  exports: [..., CheckComponent],
})
```

### Uso no formulário

```html
<!-- turno (pode ser partial) -->
<app-check
  [state]="turnoState(turno)"
  [label]="turno.descricao"
  (toggle)="toggleTurno(turno.hash)"
/>

<!-- série (só on/off) -->
<app-check
  [state]="isSeriesSelecionada(serie.hash) ? 'on' : 'off'"
  [label]="serie.descricao"
  (toggle)="toggleSerie(serie.hash)"
/>
```

O getter `turnoState(hash): 'on' | 'off' | 'partial'` já existe no protótipo e precisa ser portado para o `.ts` do componente Angular.

### Implementação do `app-check`

- [x] `src/shared/components/check/check.component.ts`
- [x] `src/shared/components/check/check.component.html`
- [x] `src/shared/components/check/check.component.scss`
- [x] Registrado no `SharedModule` (imports + exports)
- [ ] Usar no formulário (substituir `<input type="checkbox">` nas listas de turno/série/turma/frente)
- [ ] Portar `turnoState()` para o `.ts` do formulário

---

## 3. Barra de resumo de seleção

Nova propriedade computada no `.ts`:

```typescript
get resumoSelecao() {
  const turmas = this.turmasSelecionadas.size;
  const disciplinas = Array.from(this.frentesSelecionadas.values())
    .reduce((acc, set) => acc + set.size, 0);
  const turnos = this.turnosDisponiveis
    .filter(t => this.hashTurnosSelecionados.includes(t.hash)).length;
  return { turmas, disciplinas, turnos };
}
```

Exibida no rodapé da coluna direita — visível apenas quando escola selecionada e há alguma seleção.

---

## 4. InfoPanel (estado bloqueado)

Dois tamanhos conforme o protótipo:

- **Pequeno** (coluna esquerda): borda dashed, ícone cadeado pequeno, texto inline
- **Grande** (coluna direita): borda dashed, cadeado centralizado, título + subtítulo

Pode ser implementado como template local `ng-template` dentro do componente (sem necessidade de componente separado), já que só é usado aqui.

---

## 5. Escola + Data na mesma linha

No layout atual Escola e Data estão empilhados. No novo ficam lado a lado:

```html
<div class="row-escola-data">
  <div class="field-escola">...</div>   <!-- flex: 1 -->
  <div class="field-data">...</div>     <!-- width: 150px, flex-shrink: 0 -->
</div>
```

---

## 6. Mudanças no `.ts` necessárias para o redesign

| Item | Mudança |
|---|---|
| Barra resumo | Adicionar getter `resumoSelecao` |
| Nenhuma outra lógica | Toda a lógica de estado, toggles e serviços permanece igual |

---

## 7. O que NÃO mudar

- Toda a lógica de estado (`turmasSelecionadas`, `frentesSelecionadas`, etc.)
- Serviços e chamadas de API
- Validação do form
- Outputs `updateList` e `deleteEvent`
- Comportamento de bloqueio de frentes já agendadas

---

## 8. Sequência de implementação sugerida

1. Verificar se `app-modal` aceita width via input → se não, definir estratégia CSS
2. Verificar `CheckboxFieldComponent` → decide entre adaptar ou criar
3. Aplicar novo layout CSS (duas colunas, heights, scrolls)
4. Migrar form-fields para coluna esquerda (Escola+Data side by side, Título, Descrição)
5. Migrar filtro turno/série para `.filter-scroll` na coluna esquerda
6. Migrar lista de turmas para coluna direita + container bordado + scroll
7. Substituir checkboxes nativos pelo componente customizado
8. Adicionar barra de resumo
9. Adicionar InfoPanels (bloqueado sem escola)
10. Ajustar CSS (cores, tipografia alinhadas ao `colors_and_type.css` do protótipo)
11. `ng build` + teste manual nos dois modos (criar / editar)
