# Migração: `app-ng-select-field` → `single-select` / `multi-select`

## Visão Geral

O componente legado `<app-ng-select-field>` (baseado no `ng-select`) está sendo substituído por dois componentes internos:

| Caso de uso | Componente novo | Seletor |
|---|---|---|
| Seleção única | `SelectFieldComponent` | `<single-select>` |
| Seleção múltipla | `MultiSelectComponent` | `<multi-select>` |

**Caminhos:**
- `src/shared/components/select-field/select-field.component.ts`
- `src/shared/components/multi-select/multi-select.component.ts`

---

## Diferenças de API

### Inputs removidos / sem equivalente

| Input antigo (`app-ng-select-field`) | Motivo da remoção |
|---|---|
| `[id]` | Não utilizado pelos novos componentes |
| `[dataSource]` | Substituído por `[options]` |
| `[isMultiple]` | Implícito no seletor do componente |
| `[bindValue]` | Fixo em `hash` |
| `[bindLabel]` | Fixo em `descricao` |
| `[emptyValue]` | Não aplicável |
| `[searchable]` | Sempre habilitado nos novos componentes |
| `[selectedValue]` | Substituído pelo `[control]` (FormControl) |
| `[formControlName]` | Substituído pelo `[control]` |
| `[disabled]` | Desabilitar via `control.disable()` no TS |

### Mapeamento de inputs mantidos

| Input antigo | Equivalente novo |
|---|---|
| `[label]` | `[label]` (igual) |
| `[placeholder]` | `[placeholder]` (igual) |
| `[enabled]` | `[enabled]` (apenas `multi-select`) |

### Mapeamento de outputs

| Output antigo | `multi-select` | `single-select` |
|---|---|---|
| `(eventChange)` | `(eventChange)` — emite `string[]` (hashes) | `(onChange)` — emite `MultiSelectOption \| null` |

---

## Passo a Passo da Migração

### 1. Identificar o tipo de seleção

```html
<!-- Se [isMultiple]="true" → usar multi-select -->
<!-- Se [isMultiple]="false" ou ausente → usar single-select -->
```

### 2. Adicionar o FormControl correspondente

Os novos componentes recebem um `AbstractControl` diretamente via `[control]`.
Não use `[formControlName]` — passe o controle explicitamente.

```ts
// no FormGroup
this.form = this.fb.group({
  rede: [null, Validators.required],          // single-select
  redes: [null, Validators.required],          // multi-select
  mensagem: [{ value: null, disabled: true }], // single-select desabilitado
});
```

### 3. Substituir o HTML

**Antes (multi-select):**
```html
<app-ng-select-field
  #selectRedes
  [label]="'Rede(s)'"
  [id]="'select-rede'"
  [placeholder]="'Selecione'"
  [dataSource]="redes"
  [searchable]="true"
  [enabled]="!loading"
  [emptyValue]="''"
  [isMultiple]="true"
  [bindValue]="'hash'"
  [bindLabel]="'descricao'"
  [selectedValue]="redesSelecionadas"
  [formControlName]="'redes'"
  (eventChange)="onRedesChange($event)"
>
</app-ng-select-field>
```

**Depois:**
```html
<multi-select
  #selectRedes
  [label]="'Rede(s)'"
  [placeholder]="'Selecione'"
  [options]="redes"
  [enabled]="!loading"
  [control]="form.get('redes')"
  (eventChange)="onRedesChange($event)"
>
</multi-select>
```

---

**Antes (single-select):**
```html
<app-ng-select-field
  #selectMsgPrevia
  [label]="'Mensagem'"
  [id]="'select-mensagem'"
  [placeholder]="'Selecione'"
  [dataSource]="previas"
  [searchable]="false"
  [enabled]="!loading"
  [emptyValue]="''"
  [disabled]="true"
  [isMultiple]="false"
  (eventChange)="selecionaPrevia($event)"
>
</app-ng-select-field>
```

**Depois:**
```html
<single-select
  #selectMsgPrevia
  [label]="'Mensagem'"
  [placeholder]="'Selecione'"
  [options]="previas"
  [control]="form.get('mensagem')"
  (onChange)="selecionaPrevia($event)"
>
</single-select>
```

### 4. Atualizar o TypeScript

**Imports:**
```ts
// Remover
import { NgSelectFieldComponent } from '@core/components/ng-select-field/ng-select-field.component';

// Adicionar
import { MultiSelectComponent } from 'src/shared/components/multi-select/multi-select.component';
import { SelectFieldComponent } from 'src/shared/components/select-field/select-field.component';
```

**ViewChild:**
```ts
// Antes
@ViewChild('selectRedes') selectRedesComponent: NgSelectFieldComponent;
@ViewChild('selectMsgPrevia') selectMsgPrevia: NgSelectFieldComponent;

// Depois
@ViewChild('selectRedes') selectRedesComponent: MultiSelectComponent;
@ViewChild('selectMsgPrevia') selectMsgPrevia: SelectFieldComponent;
```

**Setar valor programaticamente:**

| Ação | Antes (ng-select) | Depois |
|---|---|---|
| Setar valor | `component.writeValue(value)` | `form.get('campo')?.setValue(value)` |
| Setar `selectedValue` | `component.selectedValue = value` | `form.get('campo')?.setValue(value)` |
| Limpar multi-select | `component.writeValue([])` | `form.get('campo')?.setValue([])` ou `component.reset()` |

**Campo desabilitado:**
```ts
// Antes: [disabled]="true" no template
// Depois: declarar no FormGroup
mensagem: [{ value: null, disabled: true }]

// Ou desabilitar programaticamente
this.form.get('mensagem')?.disable();
```

### 5. Remover referências a métodos do ng-select

Métodos como `writeValue()`, `selectedValue` são específicos do `NgSelectFieldComponent` via `ControlValueAccessor`.
Com os novos componentes, toda a sincronização de estado é feita via `FormControl`.

---

## Estrutura esperada de `options`

Ambos os componentes esperam um array de objetos com a interface:

```ts
interface Option {
  hash: string;
  descricao: string;
}
```

Certifique-se de que a propriedade da sua lista de dados usa exatamente esses nomes de campo.

---

## Comportamentos diferentes a notar

- **Busca**: O `single-select` sempre exibe um campo de busca (não há `[searchable]="false"`).
- **Desabilitar**: O componente é desabilitado automaticamente quando `options` está vazio, `control.disabled`, ou `control.pending`. Não há input `[disabled]`.
- **Output do `single-select`**: `(onChange)` emite o objeto `{ hash, descricao }` completo (ou `null`), não apenas o hash. Ajuste os handlers conforme necessário.
- **Output do `multi-select`**: `(eventChange)` emite `string[]` com os hashes selecionados, igual ao comportamento anterior.
