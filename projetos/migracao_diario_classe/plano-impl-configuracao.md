# Plano de Implementação — Tela de Configuração (Diário de Classe)

**Referência visual:** `migracao_diario_classe/clade_design_configuracoes/Configuração Diário de Classe.html`
**Componente alvo:** `estrutura-pedagogica/frontend/src/app/features/diario-de-classe/configuracao/`

---

## O que muda e o que é preservado

| Área | Status | Detalhe |
|---|---|---|
| Routing, permissões, serviços | **Preservado** | Sem mudança |
| `redeControl` (FormControl) + `app-select-field` | **Preservado** | Já refatorado |
| `app-loading`, `app-sem-conteudo`, `app-button` | **Substituído** | Ver seção 2 do `.html` |
| Props individuais `presenca`, `falta`… | **Substituído** | Vira `chars` record |
| Lógica de save, carregarConfig, carregarRedes | **Preservado** | Pequenas adaptações |
| Template da tabela de preview | **Refatorado** | Highlighting por `focusType` |

---

## 1. Alterações em `configuracao.component.ts`

### 1.1 — Novo array `TYPES` (constante da classe)

```typescript
readonly TYPES = [
  { key: 'presenca',      label: 'Presença',      sub: 'Aluno presente',                      accent: '#28975A' },
  { key: 'falta',         label: 'Falta',         sub: 'Aluno ausente',                       accent: '#E65637' },
  { key: 'pendencia',     label: 'Pendência',     sub: 'Frequência não lançada',              accent: '#65686E' },
  { key: 'transferencia', label: 'Transferência', sub: 'Aluno transferido',                   accent: '#774BB0' },
  { key: 'nee',           label: 'NEE',           sub: 'Necessidades educacionais especiais', accent: '#228085' },
];
```

### 1.2 — `chars` record em vez de propriedades individuais

```typescript
// ANTES (5 props soltas)
presenca = 'P'; falta = 'F'; pendencia = '-'; transferencia = 'T'; nee = 'N';

// DEPOIS (um objeto indexado pelo key do TYPES)
chars: Record<string, string> = { presenca: 'P', falta: 'F', pendencia: '-', transferencia: 'T', nee: 'N' };
```

Atualizar `aplicarConfig()` e `resetChars()` para escrever em `this.chars[key]`.

Atualizar `salvar()`:
- Ler de `this.chars`
- **Adicionar validação:** se algum `chars[key]` estiver vazio → atribuir `erro` com mensagem específica e retornar.

### 1.3 — `focusType` + `accentFor()`

```typescript
focusType: string | null = null;

setFocusType(key: string | null): void { this.focusType = key; }

accentFor(key: string): string {
  return this.TYPES.find(t => t.key === key)?.accent ?? '';
}
```

O método `charFor(key: CharKey)` pode ser simplificado:
```typescript
charFor(key: CharKey): string { return this.chars[key] || DEFAULTS[key]; }
```
(ou inline no template: `chars[key] || '·'`)

### 1.4 — Sem outras mudanças no `.ts`

`redeControl`, `ngOnInit`, `carregarRedes`, `carregarConfig`, `get configAtiva` e o ciclo de save/erro permanecem como estão.

---

## 2. Alterações em `configuracao.component.html`

### 2.1 — Estrutura geral (sem mudança)

```html
<div class="page-layout">
  <div class="form-col">   <!-- painel esquerdo -->
  <div class="preview-col"> <!-- painel direito -->
```

O grid de duas colunas já existe — não muda.

### 2.2 — Painel esquerdo: adicionar `panel-head`

Envolver o conteúdo do `div.card` superior (select de rede) num elemento com cabeçalho:

```html
<div class="panel">
  <div class="panel-head">
    <div class="ph-icon"><span class="material-symbols-outlined">tune</span></div>
    <div>
      <div class="ph-t">Caracteres do diário</div>
      <div class="ph-s">Defina os símbolos de frequência por rede</div>
    </div>
  </div>
  <div class="panel-body">
    <!-- select de rede -->
    <p class="ovl">Rede de ensino</p>
    <app-loading *ngIf="loadingRedes"></app-loading>
    <app-select-field ...></app-select-field>

    <div class="divider"></div>

    <!-- bloco de configuração -->
    <p class="ovl">Caracteres de frequência</p>
    ...
  </div>
</div>
```

### 2.3 — Empty state (sem rede selecionada)

Substituir `<app-sem-conteudo>` pelo bloco `locked` do design (mais informativo):

```html
<ng-container *ngIf="!redeControl.value">
  <div class="locked">
    <div class="lk-ic"><span class="material-symbols-outlined">touch_app</span></div>
    <div class="lk-t">Selecione uma rede</div>
    <div class="lk-s">Escolha uma rede acima para visualizar e editar os caracteres de frequência.</div>
  </div>
</ng-container>
```

### 2.4 — Lista de caracteres: loop sobre `TYPES`

Substituir as 5 `div.char-row` estáticas por `*ngFor`:

```html
<div class="char-list">
  <div *ngFor="let t of TYPES"
       class="char-row"
       [class.active]="focusType === t.key"
       [style.--accent]="t.accent">
    <span class="char-dot"></span>
    <div class="char-meta">
      <div class="cm-label">{{ t.label }}</div>
      <div class="cm-sub">{{ t.sub }}</div>
    </div>
    <input
      class="char-badge"
      type="text"
      maxlength="1"
      [(ngModel)]="chars[t.key]"
      [attr.aria-label]="t.label"
      (focus)="setFocusType(t.key)"
      (blur)="setFocusType(null)"
      (mouseenter)="setFocusType(t.key)"
      (mouseleave)="setFocusType(null)"
    />
  </div>
</div>
```

### 2.5 — Botão de salvar

Manter `<app-button>` já refatorado. Adicionar `div.save-row` como wrapper.

**Adicionar banner de erro** abaixo do botão (substitui `div.dc-error`):

```html
<div class="err-banner" *ngIf="erro">
  <span class="material-symbols-outlined">error</span>
  {{ erro }}
</div>
```

### 2.6 — Preview: adicionar legend chips acima da tabela

```html
<div class="legend">
  <div *ngFor="let t of TYPES"
       class="legend-chip"
       [class.active]="focusType === t.key"
       [style.--accent]="t.accent"
       (mouseenter)="setFocusType(t.key)"
       (mouseleave)="setFocusType(null)">
    <span class="lc-dot"></span>
    <span class="lc-char">{{ chars[t.key] || '·' }}</span>
    <span class="lc-label">{{ t.label }}</span>
  </div>
</div>
```

### 2.7 — Preview: highlighting nas células da tabela

Adicionar `[class.hl]` e `[style.--accent]` nas células de frequência:

```html
<td *ngFor="let key of a.cells"
    class="ft"
    [class.hl]="focusType === key"
    [style.--accent]="accentFor(key)">
  {{ chars[key] || '·' }}
</td>
```

### 2.8 — Banner "sem configuração"

Mover do painel esquerdo para ABAIXO da tabela de preview (coluna direita):

```html
<div class="empty-alert" *ngIf="redeControl.value && !loadingConfig && semConfiguracao">
  <div class="ea-ic"><span class="material-symbols-outlined">info</span></div>
  <div>
    <div class="ea-t">Sem configuração salva</div>
    <div class="ea-s">Esta rede ainda não possui configuração. Os valores exibidos são os padrões — salve para criar a configuração.</div>
  </div>
</div>
```

---

## 3. Alterações em `configuracao.component.scss`

### Adicionar (novos blocos CSS, sem remover o existente):

```scss
// Panel header
.panel { border: 1px solid var(--color-neutral-light2); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-down-small); }
.panel-head { display: flex; align-items: center; gap: 12px; padding: 20px 24px; background: var(--color-neutral-light3); border-bottom: 1px solid var(--color-neutral-light2); }
.ph-icon { width: 36px; height: 36px; border-radius: 9px; display: grid; place-items: center; background: var(--color-primary-light3); color: var(--color-primary); }
.ph-t { font-weight: 600; font-size: 16px; color: var(--color-neutral-dark3); }
.ph-s { font-size: 12px; color: var(--fg-muted); margin-top: 1px; }
.panel-body { padding: 22px 24px 24px; }
.divider { height: 1px; background: var(--color-neutral-light2); margin: 22px -24px; }

// Section labels
.ovl { font-weight: 700; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-muted); margin: 0 0 10px; }

// Char list
.char-row { display: grid; grid-template-columns: 10px 1fr auto; align-items: center; gap: 12px; padding: 9px 12px; border-radius: 9px; border-left: 3px solid transparent; transition: background 150ms, border-color 150ms; }
.char-row.active { background: color-mix(in srgb, var(--accent) 9%, white); border-left-color: var(--accent); }
.char-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent); }
.cm-label { font-weight: 700; font-size: 14px; color: var(--color-neutral-dark3); }
.cm-sub { font-size: 11.5px; line-height: 15px; color: var(--fg-muted); margin-top: 1px; }
.char-badge { width: 46px; height: 46px; border-radius: 9px; border: 1px solid transparent; background: var(--color-primary-light3); color: var(--color-primary); font-weight: 700; font-size: 20px; text-align: center; padding: 0; outline: none; transition: border-color 150ms, box-shadow 150ms; }
.char-badge:hover { border-color: var(--color-primary-light2); }
.char-badge:focus { border-color: var(--color-primary); box-shadow: var(--shadow-focus); background: #fff; }

// Locked state
.locked { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 30px 16px 24px; }
.lk-ic { width: 56px; height: 56px; border-radius: 14px; display: grid; place-items: center; background: var(--color-neutral-light3); border: 1px solid var(--color-neutral-light2); color: var(--color-neutral); }
.lk-t { font-weight: 600; font-size: 15px; color: var(--color-neutral-dark2); }
.lk-s { font-size: 13px; line-height: 19px; color: var(--fg-muted); max-width: 240px; }

// Legend chips
.legend { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.legend-chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 13px 6px 11px; border-radius: 999px; border: 1px solid var(--color-neutral-light2); background: #fff; cursor: default; transition: border-color 150ms, background 150ms; }
.legend-chip.active { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, white); }
.lc-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.lc-char { font-weight: 700; font-size: 13px; color: var(--color-primary); min-width: 14px; text-align: center; }
.legend-chip.active .lc-char { color: var(--accent); }
.lc-label { font-size: 13px; color: var(--fg-secondary); }

// Table cell highlight
.ptable .ft { text-align: center; font-weight: 700; font-size: 14px; color: var(--color-primary); transition: background 150ms, color 150ms; }
.ptable .ft.hl { background: color-mix(in srgb, var(--accent) 16%, white); color: var(--accent); }

// Error banner
.err-banner { display: flex; align-items: center; gap: 10px; margin-top: 12px; padding: 11px 14px; border-radius: 8px; background: color-mix(in srgb, var(--color-error) 12%, white); border: 1px solid color-mix(in srgb, var(--color-error) 38%, white); color: var(--color-error-dark); font-size: 13px; font-weight: 600; }

// Empty-config alert (abaixo da tabela)
.empty-alert { display: flex; gap: 12px; padding: 14px 16px; border-radius: 10px; background: color-mix(in srgb, var(--color-warning) 14%, white); border: 1px solid color-mix(in srgb, var(--color-warning) 42%, white); margin-top: 16px; }
.ea-ic { width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0; display: grid; place-items: center; background: color-mix(in srgb, var(--color-warning) 26%, white); color: var(--color-warning-dark); }
.ea-t { font-weight: 700; font-size: 13.5px; color: var(--color-neutral-dark3); }
.ea-s { font-size: 12.5px; line-height: 18px; color: var(--color-neutral-dark2); margin-top: 2px; }
```

### Remover (obsoletos após refatoração):
- `.rede-select` (select nativo removido)
- `.save-btn`, `.save-btn--saved` (app-button agora usa classes do SharedModule)
- `.info-banner` (substituído por `.empty-alert` no preview-col)
- `.char-input` (substituído por `.char-badge`)
- `.dc-error` (substituído por `.err-banner`)
- `.empty-msg` (substituído por `.locked`)

---

## Ordem de execução sugerida

1. `.ts` — adicionar `TYPES`, `chars`, `focusType`, `setFocusType()`, `accentFor()`; atualizar `aplicarConfig()`, `resetChars()`, `salvar()`
2. `.html` — refatorar estrutura completa (panel-head, char-list loop, legend, highlighting)
3. `.scss` — adicionar novos blocos, remover obsoletos
4. Verificar `ng build` sem erros
