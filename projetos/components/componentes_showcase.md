repositorio: estrutura-pedagogica
base: ./readme.md
plano: ./plano-componentes-showcase.md

## Objetivo

Criar, no `ExemplosModule`, uma nova rota `exemplos/componentes` que funciona como **catálogo
navegável** dos componentes de `shared/components` e `shared/dynamic-components` — sidebar de
categorias à esquerda, painel de detalhe (descrição + exemplos ao vivo) à direita, uma categoria
selecionada por vez.

Design de referência: `./Showcase de Componentes (standalone).html` (protótipo React standalone,
não é código a portar 1:1 — referência visual/de interação, ver seção "Como o design foi lido").

## Como o design foi lido

O arquivo `.html` é um bundle (React sem JSX, `h()`/`createElement`, ~2.7MB por causa de fontes
embutidas em base64) — não abre de forma legível num editor comum nem é grepável direto. A
estrutura real do catálogo está no array `CATALOG` dentro da `<script>` no fim do arquivo. Resumo
extraído (4 grupos, 19 itens — `id` / nome exibido / ícone Material / grupo):

**Primitivos**
- `button` — Button (`smart_button`)
- `iconButton` — Icon button (`touch_app`)
- `input` — Input (`text_fields`)
- `tag` — Tag (`sell`)
- `avatar` — Avatar (`account_circle`)
- `alert` — Alert (`campaign`)
- `toast` — Toast (`notifications`)

**Formulários**
- `checkbox` — Checkbox (`check_box`)
- `radio` — Radio (`radio_button_checked`)
- `toggle` — Toggle (`toggle_on`)
- `datepicker` — Datepicker (`calendar_month`)
- `fileupload` — File upload (`upload_file`)
- `filterbar` — Filter bar (`filter_list`)

**Navegação**
- `tabs` — Tabs (`tab`)
- `breadcrumb` — Breadcrumb (`chevron_right`)
- `pagination` — Pagination (`format_list_numbered`)

**Estrutura**
- `modal` — Modal (`web_asset`)
- `table` — Table (`table_rows`)
- `studentCard` — Student card (`badge`)

Cada item no design tem, além do exibido acima: `desc` (parágrafo explicando o componente) e uma
lista de exemplos `{ label, code, el }` — `label` é o título da seção de exemplo (ex.: "Variantes",
"Com ícone e tamanho pequeno"), `code` é o JSX de referência mostrado num painel de código, `el` é
o preview renderizado ao vivo com dados mockados (aluno fictício "Wanderson Uchiha" etc.).

## Requisitos funcionais (do pedido original)

1. **Item do catálogo sem componente implementado → marcar como "ainda não implementado"** na UI,
   em vez de omitir ou quebrar. Ver seção "Mapeamento" abaixo para o que já existe.
2. **Lista de componentes do painel lateral em código TypeScript, não no template** — um array/config
   tipado no `.component.ts`, iterado no `.html`. Facilita adicionar/remover itens sem mexer em HTML.
3. **Template enxuto e performático** — a tela vai acumular muitos componentes complexos; evitar
   montar todos os exemplos de todas as categorias ao mesmo tempo (ver seção de performance no plano).

## Padrões já existentes no repo (usar como base, não inventar um terceiro estilo)

Existem **dois** precedentes de "tela de exemplos" no próprio `ExemplosModule`, cada um cobrindo
metade do que este catálogo precisa:

- **`tela-base`** (`app/features/exemplos/tela-base/`) — estilo "página longa": todas as seções
  empilhadas verticalmente, sem navegação lateral. Convenção de classes reaproveitável para o
  *conteúdo* de cada seção de exemplo: `.showcase`, `.showcase__header`, `.showcase__title`,
  `.showcase__subtitle` (com `<code>` inline citando os `@Input()`), `.showcase__group`,
  `.showcase__group-label`, `.showcase__row`, `.showcase__item`, `.showcase__item-label`. Também já
  demonstra `app-tag`, `app-tag-toggle` (via `TagToggle`/`FormControl`) e `app-mini-select` — os três
  componentes descritos no `readme.md` desta pasta, **todos já implementados** (o `readme.md` só
  marca "✅ feito" as seções 3.1 e 4, mas o código mostra 3.3/3.4/3.5 completas também — status do
  `readme.md` está desatualizado nesse ponto).
- **`document-builder-blocks`** (`app/features/exemplos/document-builder-blocks/`) — estilo
  "catálogo com status": grupos com cabeçalho, cada item mostra `badge--selector` (nome do seletor,
  ex. `app-doc-header`) + um segundo badge de status (`badge--example` "com exemplo" /
  `badge--pending` "sem exemplo") + descrição + chips dos `@Input()` (`chip--input`) + preview ao
  vivo (ou um placeholder `.doc-preview--empty` quando não há exemplo). Tem também uma barra de
  progresso "9 / 32" no topo. **Este é o precedente mais próximo do que o design pede — mesma ideia
  de badge de status —, mas falta o terceiro estado que este catálogo precisa**: lá só existe
  "com exemplo" / "sem exemplo" (o componente sempre existe em código); aqui é preciso um estado
  adicional **"não implementado"** (o componente do design não existe em `shared/` ainda).
  Nenhum dos dois precedentes tem sidebar de navegação — isso vem do design (`Showcase de
  Componentes (standalone).html`), que é a referência para o *layout* (sidebar + painel único),
  enquanto `tela-base`/`document-builder-blocks` são a referência para as *convenções de classe e
  vocabulário de status* já em uso no repo.

## Mapeamento: item do design → componente real

Levantado direto de `shared/components/` e `shared/dynamic-components/` (não confiar no
`frontend-maps/estrutura-pedagogica-angular-map.md` para isso — está desatualizado: não lista
`app-tag`, `app-tag-toggle`, `app-mini-select` nem `app-alert-card`, todos já implementados).

| id design    | Selector real                              | Status              | Observação |
|--------------|---------------------------------------------|----------------------|------------|
| `button`     | `app-button`                                 | implementado         | variantes via `[classButton]`, ver `tela-base` |
| `iconButton` | `app-icon-button` / `app-circle-icon-button` | implementado         | |
| `input`      | `text-field` (dynamic-components) ou `app-search-field` | implementado | design usa `label`/`icon`/`helpText`/`error`; conferir paridade exata ao montar exemplo |
| `tag`        | `app-tag`                                    | implementado         | 9 variantes (inclui `monochrome`, além das 8 do design), `size`, `outline`, `tinted`, `tone` |
| `avatar`     | `app-avatar` (`app/components/avatar`, **fora** de `shared/`) | implementado | único componente do catálogo que mora fora de `shared/` — confirmar se é importável tal como está ou se precisa mover/expor |
| `alert`       | `app-alert-card` (dynamic-components)       | implementado parcial | tem `variant`/`title`/`icon`/`expandable`, mas **não tem slot de ações** (design mostra Alert com botões Cancelar/Excluir) — não é 1:1, documentar a diferença no exemplo em vez de forçar |
| `toast`      | `app-toastr-eleva` + `NotificationService`  | implementado (arquitetura diferente) | não é um componente standalone com `title`/`duration`/`onClose` como no design — é disparado via serviço (`showSuccess`/`showError`/...). Exemplo deve chamar o serviço, não `<app-toastr-eleva>` direto |
| `checkbox`   | `app-checkbox` / `app-checkbox-field`       | implementado         | |
| `radio`      | `app-custom-radio` / `app-radio-field`      | implementado         | |
| `toggle`     | `app-toggle` (form) — design também cobre `app-tag-toggle` (dynamic-components) | implementado | dois componentes de toggle no repo, mostrar os dois |
| `datepicker` | `app-datepicker`                             | implementado         | |
| `fileupload` | `app-files-field`                            | implementado         | |
| `filterbar`  | `app-filtro` / `filtro` (shared/filtro)     | implementado (arquitetura muito diferente) | orientado a `FilterConfig` + serviço de backend, não inputs diretos como no design — exemplo deve usar uma config mock (ver `filtro_exemplo_macroturmas` em `exemplos/filtros/`), não tentar replicar a API do design |
| `tabs`       | `app-tab-navigator`                          | implementado         | já suporta ícone + `count`, ver `tela-base.tabComCount` |
| `breadcrumb` | —                                             | **não implementado** | nenhum componente de breadcrumb em `shared/` |
| `pagination` | `app-paginacao`                               | implementado         | conferir paridade de API com `total`/`perPage`/`page` do design |
| `modal`      | `app-modal`                                   | implementado         | |
| `table`      | —                                             | **não implementado** | `app-table-wrapper` citado no `frontend-maps` **não existe mais** no código (map desatualizado) — checado direto no repo, nenhum resultado. Toda tela de listagem hoje monta `<table>`/grid na mão (ex.: `ocorrencia/listar`, `exemplos/table-filter`) + `app-paginacao` à parte; não há um componente de tabela genérico reutilizável |
| `studentCard`| —                                             | **não implementado** | não existe uma "ficha do aluno" para tela (o que existe — `ficha-individual`, `doc-carometro-*` — é para documento impresso, contexto diferente) |

Três itens confirmados **não implementados**: `breadcrumb`, `table` e `studentCard` — devem
aparecer no catálogo com o badge de "não implementado" (ver plano). Os demais existem, mas vários
com API ou arquitetura visivelmente diferente do design (`alert`, `toast`, `filterbar`) — para
esses, o exemplo deve refletir a API real do componente, não tentar imitar as props do mockup.

## Próximos passos

Plano de implementação detalhado (estrutura de arquivos, modelo de dados do catálogo, wiring de
rota, considerações de performance): `./plano-componentes-showcase.md`.
