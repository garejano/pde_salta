# Tarefas — Dia Letivo Extra

**Base:** `readm.me`
**Componente alvo:** `formulario.component` em `estrutura-pedagogica`
**Rota de referência:** `/dia-letivo-extra/listar`

---

## Tarefa 1 — Refatoração (concluída)

Modernização do `formulario.component.ts + .html` para Angular 20:

- [x] `@Output() + EventEmitter` → `output()`
- [x] `constructor injection` → `inject()`
- [x] `*ngIf / *ngFor` → `@if / @for` com `track`
- [x] `CommonModule` → `NgClass` explícito
- [ ] `ng build` (pendente — build rejeitado durante execução; executar manualmente)

---

## Tarefa 2 — Redesign do formulário (pendente)

**Objetivo:** Substituir o layout atual (coluna única, scroll vertical) pelo design duas colunas do protótipo.

**Protótipo:** `form_design/Duas Colunas Interativo.html` → `interactive-twocol.jsx`
**Screenshots:** `form_design/screens/twocol.png`, `twocol2.png`

### O que muda visualmente

| Atual | Novo |
|---|---|
| Coluna única, scroll vertical | Duas colunas, altura fixa (~680px) |
| Escola e Data empilhados | Escola + Data na mesma linha |
| Filtro turno/série abaixo do form | Filtro no rodapé da coluna esquerda (scroll próprio) |
| Turmas abaixo do filtro | Turmas em coluna direita (scroll próprio, border) |
| Sem feedback de seleção | Barra resumo: "X turmas · Y disciplinas · Z turnos" |
| Checkboxes nativos | Checkboxes customizados (verde, estado `partial`) |
| Turmas ocultas sem escola | Área bloqueada com ícone de cadeado e mensagem |

### Comportamento das áreas bloqueadas

Quando **nenhuma escola** está selecionada:
- Coluna esquerda: abaixo da linha divisória, exibe `InfoPanel` com mensagem "Selecione uma escola para liberar o filtro por turno e série."
- Coluna direita: exibe `InfoPanel` grande com ícone de cadeado, título "Selecione uma escola" e mensagem explicativa.

Quando escola selecionada: ambas as colunas ficam interativas normalmente.

### Plano técnico → `plano.md`
