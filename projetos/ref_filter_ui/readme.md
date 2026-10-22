repositorio: estrutura-pedagogica

alvo: módulo `shared/filtro` (`frontend/src/shared/filtro`)

# Análise — Template V2 para o módulo Filtro

## Objetivo

Hoje o módulo `shared/filtro` tem **um único template visual** para o botão de
toggle + painel de campos (ver `filtro.component.html`). A ideia é avaliar a
viabilidade de um **segundo template visual** ("Template V2") para o mesmo
componente — mesma config (`FilterConfig`/`FilterItemConfig`), mesma lógica de
cascata/sideEffects/storage, só muda a apresentação.

O protótipo em `filtro_v2_prototipo/` (gerado fora deste repo, em uma
ferramenta de design) explora variações dessa apresentação para desktop e
mobile. Este documento cruza o protótipo com a implementação atual e lista o
que precisaria ser adaptado.

---

## Como o filtro funciona hoje (resumo)

- Config declarativa (`FilterConfig.filters: FilterItemConfig[]`) renderizada
  dinamicamente via `FieldWrapperComponent` (um `ViewContainerRef` por campo).
- Visual atual (`filtro.component.html`):
  - Botão `app-button` "Filtro" com ícone + contador (`counter()`), que faz
    toggle de `visible`.
  - Quando `visible = false` e `showSelectTag: true` num campo, aparece uma
    **tag separada por campo** (`select-tags-field`) com ícone/label/valor —
    uma tag por campo, não um resumo único.
  - Quando `visible = true`, abre um painel (`filter`) com os campos em
    `.row` (grid Bootstrap, `colClass` por campo) e footer fixo com
    `Limpar`/`Aplicar`.
- Cascata: `watch_list` (recarrega opções) + `dependency_list` (habilita campo).
- `sideEffects`: um campo atualiza propriedades de outro (ex.: min/max de data).
- Persistência: `localStorage` por `config.id`, com TTL, desligável via
  `persistState: false`.
- Já existe infraestrutura de "tag resumida" por campo:
  `FieldWrapperComponent.getSelectedLabels()` / `getTagData()` — mas cada
  campo gera sua própria tag; não existe hoje um **breadcrumb único** que
  concatene os valores de vários campos numa linha só.

---

## O que o protótipo propõe

Escopo reduzido a `Tela completa.dc.html` (tela `6a`, "Painel do Aluno") — as
demais variações de `Filtro unificado.dc.html` (`1a`, `1c`, `2a`, `3a`) ficam
fora de consideração. O modelo de filtro usado em `6a` funde ícone + contador
+ resumo dos valores selecionados + chevron num **gatilho único**,
substituindo o botão "Filtro" simples + tags separadas de hoje. No
`renderVals()` do protótipo esse modelo corresponde às variáveis `G`
(desktop) e `H` (mobile):

**Desktop (`G`, bloco de 1200px):**
- Botão de 48px de altura, borda neutra (`#C3C8D1`, vira `#9D0364` quando
  aberto), ícone `filter_alt` magenta.
- Mesma linha: "Filtros" + badge com contador → divisor vertical → caminho
  completo truncado com ellipsis (`2026 / Alfa / Campinas / 5º Ano Regular`)
  → texto "Mostrar/Ocultar filtros" + chevron.
- Painel aberto: grid de **4 colunas** (`repeat(4, minmax(0,1fr))`), fundo
  `#F8F9FB`, um campo por coluna (label em cima, valor + `expand_more`
  embaixo). Footer com `Limpar`/`Aplicar` (botões de 32px) alinhado à direita,
  dentro do próprio painel.

**Mobile (`H`, bloco de 360px):**
- Botão com `min-height: 56px`, mesmo ícone magenta.
- Duas linhas dentro do botão: linha 1 = "Filtros" + badge (menor, 18px),
  linha 2 = caminho completo truncado — sem o texto "Mostrar/Ocultar
  filtros", só o chevron à direita.
- Painel aberto: campos empilhados em **coluna única** (não grid), cada um
  com altura 44px. Footer com `Limpar`/`Aplicar` (botões de 40px).

→ **Conclusão**: o "Template V2" a especificar é esse modelo único ("Campo de
resumo"), com duas variações de layout — mesma linha/grid 4 colunas no
desktop vs. duas linhas/coluna única no mobile — e não as demais variantes do
`Filtro unificado.dc.html`.

A parte de toolbar + lista/cards da `6a` (busca em massa, ordenação, alternar
cartões/lista) **não pertence ao módulo `shared/filtro`** — é UI do
consumidor (tela "Painel do Aluno"). Fica fora do escopo desta análise, só
foi usada no protótipo para dar contexto visual.

---

## Gaps entre protótipo e implementação atual

1. **Resumo em breadcrumb não existe.** Hoje cada campo com `showSelectTag`
   gera sua própria tag (`select-tags-field`), independentes. O protótipo
   exige uma string única concatenando o primeiro valor selecionado de cada
   campo, na ordem da cascata (`2026 / Alfa / Campinas / 5º Ano Regular`).
   Resolver com um método novo no `FiltroComponent`, reaproveitando o mesmo
   critério que já existe hoje (`config.showSelectTag: true` por campo) em
   vez de todos os `filters`:

   ```typescript
   resumoPath(): string {
     return this.componentsList()
       .filter(f => f.config.showSelectTag)
       .map(f => f.getSelectedLabels()[0])
       .filter(Boolean)
       .join(' / ');
   }
   ```

   Reaproveita `componentsList()` (já existe, retorna os
   `FieldWrapperComponent` na ordem de `config.filters`) e
   `getSelectedLabels()` (já existe no `FieldWrapperComponent`) — não precisa
   de estado novo nem de flag nova; os filtros já configurados com
   `showSelectTag: true` para as tags atuais entram automaticamente no
   breadcrumb do V2.

2. **Sem truncamento.** Decidido ir pela opção mais barata: nenhuma lógica de
   truncamento (nem "…" por nível, nem ellipsis, nem "+N" — isso só existia
   nas variantes descartadas). O `resumoPath()` do gap 1 é renderizado como
   texto simples; se estourar a largura, o próprio layout (flex-wrap ou
   quebra de linha) resolve — não precisa de CSS ou lógica dedicada para
   cortar o caminho.

3. **Manter `.row` + `colClass`.** Decidido ir pela opção mais barata: manter
   o layout atual em `.row` Bootstrap com `colClass` por campo (ex.:
   `col-md-3`), em vez de migrar para CSS grid fixo como no protótipo. Isso
   garante que os filtros já configurados com `colClass` continuem
   funcionando sem alteração — o Template V2 herda o mesmo sistema de grid,
   só muda o gatilho/painel ao redor.

4. **Footer dentro do painel.** Decidido: `Limpar`/`Aplicar` saem do
   `footer-filter` fixo (hoje sempre visível, mesmo com o painel fechado — ver
   `filtro.component.html` linhas 108–160) e passam a existir **só dentro do
   painel expandido**, alinhados à direita, como no protótipo. Altura:
   **40px em desktop e mobile** — mesma altura padrão do `app-button`
   (`%btn-base`), sem reduzir para 32px no desktop como no protótipo (ajuste
   feito após implementar: manter um único tamanho evita inconsistência
   visual entre os dois layouts).

5. **Dois sub-templates condicionais por breakpoint.** `G` (desktop) e `H`
   (mobile) têm marcação estruturalmente diferente (caminho na mesma linha
   vs. em duas linhas, alturas de botão diferentes — 48px vs. 56px mínimo),
   não dá pra resolver só com CSS num template único. O próprio
   `FiltroComponent` passa a decidir entre os dois sub-templates (`*ngIf`/
   `*ngIfElse`) via `BreakpointObserver` (`@angular/cdk/layout`) — a
   responsividade é automática e interna ao componente, o consumidor só usa
   `<filtro>` normalmente (confirmado: ver "Decisões" abaixo).

   Breakpoint sugerido: **`(max-width: 767px)`**, mesmo valor já usado em
   `listar.component.ts` (`lancamento-frequencia`), consumidor existente do
   `shared/filtro` que já injeta `BreakpointObserver` para decidir exibir o
   filtro expandido ou colapsado — manter o mesmo valor evita dois padrões de
   breakpoint convivendo no módulo.

6. **Campo de busca fora do escopo.** Decidido: o campo "Busque por nome ou
   RA" que aparece no protótipo abaixo do filtro **não será implementado**
   no Template V2 — é UI da toolbar/lista do consumidor, não do módulo
   `shared/filtro`. `showSearchField`/`searchPlaceholder` (busca interna já
   existente no módulo) seguem sem uso aqui, nada a reaproveitar ou duplicar.

7. **Nenhuma mudança necessária em `FilterConfig`/`FilterItemConfig` para
   cascata, sideEffects ou storage** — o V2 é puramente visual sobre os
   mesmos dados. Confirmado (ver "Decisões" abaixo): o V2 **convive** com o
   template atual como opção configurável, não substitui. Único campo novo
   necessário: um seletor de template em `FilterConfig`, ex.:
   `FilterConfig.template?: 'default' | 'resumo'` (nome a definir), para o
   `FiltroComponent` escolher entre o template atual
   (`filtro.component.html`) e o novo (com seus dois sub-templates
   desktop/mobile do gap 5). Configs existentes sem o campo continuam no
   comportamento atual por padrão (`default`).

---

## Decisões

- **Convivência**: o Template V2 convive com o atual como opção configurável
  na config do filtro (`FilterConfig.template`, ver gap 7) — não substitui o
  template existente.
- **Campos no breadcrumb**: usa os mesmos campos já marcados com
  `showSelectTag: true` (ver gap 1) — nenhuma flag nova.
- **Responsividade**: automática — o mesmo `<filtro>` se adapta a
  desktop/mobile internamente via CSS/JS (`BreakpointObserver`, ver gap 5);
  não são usos distintos do componente.
- **Toolbar de lista** (busca em massa, ordenação, card/list do `6a`): fora
  do escopo atual.

---

## Arquivos de referência

- Módulo atual: `c:/projects/estrutura-pedagogica/frontend/src/shared/filtro/`
  - `filtro.models.ts` — `FilterConfig`, `FilterItemConfig`
  - `filtro/filtro.component.ts` / `.html` — componente principal, template V1
  - `field-wrapper/field-wrapper.component.ts` — `getSelectedLabels()`,
    `getTagData()`
  - `README.md` — documentação de uso completa
- Protótipo V2: `./filtro_v2_prototipo/`
  - `Tela completa.dc.html` — tela `6a`, fonte do modelo `G`/`H` analisado aqui
  - `Filtro unificado.dc.html` — demais variações exploradas, fora do escopo
    desta análise
