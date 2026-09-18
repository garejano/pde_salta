# Plano de Refatoração — DiarioConfiguracaoComponent

**Arquivo alvo:** `app/features/diario-de-classe/configuracao/configuracao.component.html`

---

## Substituições planejadas

| Linha | HTML atual | Seletor shared | Inputs obrigatórios |
|---|---|---|---|
| 24–29 | `<div class="empty-msg">` com ícone + texto | `<app-sem-conteudo>` | `[mensagem]="'Selecione uma rede para editar a configuração de caracteres.'"` |
| 69–77 | `<button class="save-btn" ...>` | `<app-button>` | `[label]`, `[icon]`, `[classIcon]`, `[classButton]`, `[disabled]`, `(clickEvent)` |

---

## Módulos a importar no .ts

| Módulo | Motivo |
|---|---|
| `SemConteudoModule` | `<app-sem-conteudo>` não está no `SharedModule` — tem módulo próprio |
| *(nenhum novo para app-button)* | `ButtonComponent` já exportado pelo `SharedModule`, já importado |

---

## Elementos não substituíveis

| Elemento | Motivo |
|---|---|
| `<select [(ngModel)]="hashRede">` (linhas 10–18) | `single-select` exige `@Input() control: FormControl` obrigatório; mudar de `ngModel` para FormControl seria alterar lógica de negócio |
| `<input type="text" maxlength="1" [(ngModel)]>` (linhas 45–61, ×5) | `text-field` (dynamic-component) também exige FormControl; além disso, `maxlength="1"` é comportamento específico não suportado pelo componente |
| `<app-loading>` (linhas 9, 32) | Já usa o shared component |

---

## Como ficará o `<app-button>` (substituindo linhas 69–77)

```html
<app-button
    [classButton]="saved ? 'button-secundary save-btn save-btn--saved' : 'button-secundary save-btn'"
    [icon]="saved ? 'check' : 'save'"
    classIcon="material-icons-outlined"
    [label]="saved ? 'Salvo!' : (saving ? 'Salvando…' : 'Salvar configuração')"
    [disabled]="saving"
    (clickEvent)="salvar()"
></app-button>
```

## Como ficará o `<app-sem-conteudo>` (substituindo linhas 24–29)

```html
<app-sem-conteudo
    mensagem="Selecione uma rede para editar a configuração de caracteres."
></app-sem-conteudo>
```

---

## Pontos de atenção

- **Visual do empty-state:** `app-sem-conteudo` usa ícone FontAwesome (`fa-info-square`) fixo — o ícone atual (`tune` do Material Symbols) será substituído. A mensagem e a estrutura são preservadas.
- **Classes CSS do botão:** `save-btn` e `save-btn--saved` são definidas no SCSS do próprio componente, então continuam funcionando mesmo passadas via `[classButton]` (não há encapsulamento que bloqueie classes externas aplicadas ao elemento `<button>` interno).
- **Ícone no app-button:** o template do `app-button` renderiza o ícone como `<span class="{{ classIcon }}">{{ icon }}</span>`. Com `classIcon="material-icons-outlined"` e `[icon]="'save'"`, o comportamento visual é equivalente ao original.
