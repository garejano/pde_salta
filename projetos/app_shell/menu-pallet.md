base:./readme.md

## atlas-menu — Menu Paleta

### Objetivo

Criar um segundo ponto de entrada para o menu de navegação que abre centralizado na tela (como o `atlas-command-palette`), em vez de um dropdown posicionado na top-bar.

---

### Componente criado

**`src/app/shells/atlas-shell/atlas-menu/`**

| Arquivo | Descrição |
|---|---|
| `atlas-menu.component.ts` | Lógica idêntica ao `app-menu` (signals, computed, navegação via `MenuFacadeService`). Emite `@Output() close` em vez de controlar `isOpen` internamente. Fecha no clique do scrim ou Escape. |
| `atlas-menu.component.html` | Scrim fixo + `.atlas-menu-container` centralizado. Estrutura interna: `menu-header` / `.atlas-menu-panel` (duas colunas: categorias + subitens) / `menu-footer`. |
| `atlas-menu.component.scss` | `.atlas-menu-scrim` fixo com fundo semitransparente. `.atlas-menu-container` com `border-radius: 16px` e `box-shadow`. `.atlas-menu-panel` com `border-top/bottom`. |

#### Estrutura do HTML

```
.atlas-menu-scrim          ← overlay fixo, fecha ao clicar fora do painel
  .atlas-menu-container    ← card centralizado (flex: center/center no scrim)
    .menu-header           ← placeholder — será implementado
    .atlas-menu-panel      ← duas colunas
      .atlas-menu-panel__categories   ← lista de grupos (esquerda)
        .recentes          ← placeholder — será implementado
      .atlas-menu-panel__subitems     ← itens da categoria ativa (direita)
    .menu-footer           ← placeholder — será implementado
```

#### Diferenças em relação ao `app-menu`

| | `app-menu` | `atlas-menu` |
|---|---|---|
| Abertura | Dropdown (`position: absolute`) | Overlay centralizado (scrim fixo) |
| Controle de estado | `isOpen` interno | Controlado pelo pai via `*ngIf` |
| Fechamento | `HostListener document:click` | Clique no scrim + Escape |
| Estrutura extra | — | `menu-header`, `menu-footer`, `recentes` (placeholders) |

---

### Alterações nos arquivos existentes

**`atlas-top-bar`**
- `.component.ts`: adicionado `@Output() openMenu = new EventEmitter<void>()`
- `.component.html`: botão `fa-border-all` inserido à direita do `<app-menu>`, emite `openMenu`

**`atlas-shell`**
- `.component.ts`: adicionado `menuOpen = false`
- `.component.html`: `(openMenu)="menuOpen = true"` na top-bar + `<atlas-menu *ngIf="menuOpen" (close)="menuOpen = false">`

**`shells.module.ts`**: `AtlasMenuComponent` declarado

---

### Próximos passos

- [ ] relever o atlas-menu.component.html (coloquei uns comentarios por la)
- [ ] Implementar `menu-header` — possível barra de busca ou título
- [ ] Implementar `menu-footer` — atalhos de teclado (como no `atlas-command-palette`) ou ações rápidas
- [ ] Implementar seção `recentes` na coluna de categorias — itens acessados recentemente
- [ ] Avaliar se o botão `fa-border-all` na top-bar é o ícone correto ou trocar por outro
- a coluna de subitem hj divide por um numero, mas deveria ser apenas css criando colunas para a direita conforme a altura da div que o subitems ta
- ordernar_alfabeticamente deve ficar na parte de baixo dessa div alinhado a direita, um togle pequeno
  - quando ativo, os os items de subitem sao exibidos desapados categirizando de (A-Z)

- navegacao via teclado enquanto atlas-menu esta aberto
- se nao coluna de "categorias"
  - up - sobe um item
  - down - desse um item
  - se down no ultimo item, highlith no primeiro da lista (e vice e versa)
  - right - passa o foco do teclado e selecao para a lista de subitems
  - quando de uma categoria para um submit, o primeiro item do subitem fica selecionado
- se estiver na coluna de subitems
  - cima/baixo/left/right navega entre os itens internos entendendo que podem estar dividdos em colunas
  - se 'seta esqueda' nos items da primeira coluna, volta a focar a coluna de categorias
  - se 'seta direita' na ultima coluna de subitems, nao faz nada.

qlqr letra digitaca enquanto o atlas-menu esta aberto deve focar o input de pesquisa 

esc - se tiver texto na pesquisa, limpa, se nao tiver, fecha o menu

o campo de pesquisa deve ser fuzzy, como o atlas-comand-pallet

priorizando as categrias e depois os subitems
se o texto fizer match com a pesquisa o items fica visialmente hablitado no menu
somente items habilitados sao usados na navegacao via teclado
 - se em cagorias tenho 10 items, o segundo e o ultimo habilitado, teclas (seta-cima, seta-baixo) so navegam entre esses items


apertar "enter" faz a navegacao para o link do item
- so valido para items habilitados

user as melhores praticas angular
refatore o componente para ficar estruturado com as novas features
documente o que for complexo

-refine esse documento

