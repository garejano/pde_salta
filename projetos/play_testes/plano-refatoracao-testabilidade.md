repositório: estrutura-pedagogica
base: readme.md (checklist de boas práticas Playwright/Angular)

## Conclusão

**Sim, é necessário refatorar** — mas em fases de risco crescente, não como um big-bang. O
achado mais relevante é que **hoje não existe nenhum hook de teste estável**: zero componentes
shared usam `data-testid`. Qualquer teste Playwright escrito agora precisaria de seletor de
texto/CSS, exatamente o padrão frágil que o `readme.md` recomenda evitar. Isso por si só já
justifica a Fase 1 abaixo, independente de decisão sobre as fases seguintes (mais estruturais).

---

## Diagnóstico (auditoria de `shared/components`, `shared/dynamic-components`, `shared/filtro`)

- **`data-testid`**: 0 de 51 templates (32 em `shared/components`, 17 em `shared/dynamic-components`,
  2 em `shared/filtro`). Confirmado também em 3 modais de feature usados como amostra
  (`justificativa-modal`, `saida-antecipada-modal`, `modal-alteracao-carga`).
- **Serviços desacoplados**: já está bom — nenhum `.ts` em `components/`, `dynamic-components/` ou
  `filtro/` injeta `HttpClient` diretamente. Não precisa de trabalho aqui.
- **`<div>`/`<span>` fazendo de botão** (sem `role`/semântica): pelo menos 8 componentes —
  `select-field`, `multi-select-field`, `multi-select`, `mini-select`, `listbox-transfer`,
  `tab-navigator`, `toastr-eleva`, `datepicker` (dias do calendário), `check` (checkbox 100%
  visual sem `<input>` real).
- **Modais sem padrão comum**: `app-modal` (shared) não tem `role="dialog"`/`aria-modal`; os 3
  modais de feature amostrados usam 3 convenções de botão diferentes entre si
  (`btn-cancel`/`btn-save` · `app-button` sem id · `id="cancelar-button"`/`id="confirmar-button"`).
- **`@Input loading` morto**: em `app-modal` e em `FiltroComponent` (`shared/filtro`), `loading` é
  declarado mas nunca afeta o template — nem spinner, nem `*ngIf`. `search-field`/`salvar`/
  `paginacao` só usam `[disabled]="loading"`, sem elemento identificável para o teste esperar.
- **Bons precedentes já existem no código** (usar como referência nas fases 3-4, não reinventar):
  `checkmark-dropdown` (melhor exemplo de acessibilidade: `aria-haspopup`, `aria-expanded`,
  `role="option"`), `side-panel` (`role="dialog"`, `aria-modal`, `aria-label` no botão fechar),
  `view-toggle`/`turno-radio-select` (`<button>` real, `role="tablist"/"tab"`, `aria-selected`),
  `tag`/`tag-list` (`role="button"` + `tabindex="0"` + `(keydown.enter)` para ícone clicável).
- **Achado incidental** (fora do checklist, mas relevante): `paginacao.component.html` usa
  `<a (click)="onGoTo(page)">` sem `href` nos números de página — não focável por teclado. É gap
  de acessibilidade real, não só de teste; vale corrigir junto da Fase 4.

---

## Plano de execução, por fase

### Fase 1 — Convenção `data-testid` em todo o `shared/` (baixo risco, alto valor)

Adição pura de atributo — não muda comportamento, não muda lógica, seguro de revisar em lote.
Sem isso, nenhuma fase seguinte tem como se apoiar em seletor estável.

- Aplicar a convenção da seção 1 do `readme.md` (`btn-`, `input-`, `row-`, `modal-`, `toast-`...)
  em todos os 51 templates.
- Priorizar por uso real (dados de `_scripts/refat_shared_components/output/shared_usage.md`):
  `app-loading` (41), `app-button`/`app-modal` (39), `app-titulo-page` (36), `app-salvar` (23),
  `single-select`/select-field (20), `multi-select` (11).
- Pode ser feito componente por componente, sem depender das fases 2-4.

**Status — lote 1 concluído** (os 7 componentes mais usados, listados acima): cada componente
passou a expor um `@Input() testId` (ou `input('')` nos que já usam signal inputs) opcional, sem
valor default obrigatório — quem consome decide o id por instância. Elementos internos herdam o
prefixo (`testId + '-trigger'`, `'-clear'`, `'-option-' + hash`, `'-btn-fechar'`). Exceções com
default fixo por serem singulares na tela: `app-loading` (`'loading'`), `app-modal`/`app-titulo-page`
(fallback `'modal'`/`'titulo-page'` se `testId` não for informado). `app-salvar` deriva o id
automaticamente do label (`testIdFor(label)`, sem precisar de `@Input` novo).

**Importante — isso ainda não cobre os call sites**: os ~39 templates que usam `app-button`,
`app-modal` etc. continuam sem passar `[testId]="..."`, então hoje o atributo só aparece quando o
default existe (`loading`, `modal`, `titulo-page`) — nos demais (`button`, `salvar` exceto o auto-
derivado, `select-field`, `multi-select`) o `data-testid` só nasce quando a tela que consome o
componente for atualizada para passar um valor. Preencher os call sites deve ser feito conforme
cada tela for tocada (por feature/card), não em um segundo lote mecânico — os nomes dependem do
contexto de cada tela (ex.: `testId="btn-salvar-turma"` em vez de um valor genérico).

**Status — lote 2 concluído** (próximos 5 por uso real): `app-titulo-tela` (10, + testid no botão
voltar), `app-paginacao` (6, + testid em anterior/próximo/cada página, inclusive primeira/última
fora do range), `app-tab-navigator` (6, + testid por aba usando `route.path` como sufixo —
identificador natural e único), `app-listbox-transfer` (4, componente mais complexo do lote: testid
em selecionar/remover todos, busca e limpar busca de cada coluna, mover tudo em cada direção, e
cada item de lista usando `item.hash`), `date-field` standalone (4, testid deriva do `id` já
existente como `input-<id>` quando `testId` não é passado — não exige mudança nos ~4 call sites
atuais que já passam `[id]`).

Restam no `shared/components`, por ordem de uso: `view-toggle` (2), depois o grupo de uso único
(`side-panel`, `toggle-buttons`, `turno-radio-select`, `circle-icon-button`, `card-info`,
`card-message`) e os componentes sem uso detectado no scan (`dropdown-actions`, `icon-button`,
`search-field`, `sem-conteudo`, `skeleton-text`, `tooltip`, `datepicker`, `table-wrapper`,
`toastr-eleva` — via `<app-filtro>`/`filtro` também não aparecem no scan por limitação de detecção
de tag, ver nota em `shared_usage.md`). Depois disso, começar `shared/dynamic-components` (13
componentes, uso real provavelmente maior do que o scan capta, já que são consumidos majoritariamente
via injeção dinâmica do `filtro`, não por tag direta no template).

**Status — lote 3 concluído: todo o restante de `shared/components` + `shared/filtro`.**
`shared/components` está 100% coberto pela Fase 1. Destaques:
- `view-toggle`, `toggle-buttons`: testid no container + por opção (`opt.value`/`opt.action`).
- `side-panel`: testid no `<aside>` e no botão fechar — mesmo padrão do `app-modal`.
- `turno-radio-select`: testid por turno via `turno.hash`.
- `card-message`: só tinha 2 nós-raiz no template (sem wrapper único) — resolvido via
  `@HostBinding('attr.data-testid')` no próprio host `<app-card-message>`, em vez de forçar um
  `<div>` novo no template.
- `tooltip`: instância é criada imperativamente pela `TooltipDirective`
  (`vcr.createComponent(TooltipComponent)`, propriedades atribuídas direto na instância, sem
  `@Input`) — não fazia sentido adicionar um `@Input testId` que nada popularia; usei
  `data-testid="tooltip"` fixo, já que só uma instância existe por vez (mostra/esconde no hover).
- `toastr-eleva`: mesma lógica — instanciado pelo `ngx-toastr`, sem controle de template por
  chamada. `data-testid="toast"` / `"toast-btn-fechar"` fixos (múltiplos toasts empilhados
  compartilham o id; testes devem escopar por texto além do testid).
- `table-wrapper` (citado no `refat_components_estrutura_pedagogica.md`): **não existe mais no
  código** (`grep` por `TableWrapperComponent` não encontrou nada) — provavelmente removido após
  o catálogo ter sido escrito. Removido da lista, não é um pendente real.
- `FiltroComponent`/`FilterFieldWrapperComponent` (`shared/filtro`): em vez de um novo `@Input
  testId`, reaproveitei identificadores que **já existem e já são únicos por instância**:
  `config.id` (id do filtro) e `config.key` (chave de cada campo). Toggle/busca/limpar/aplicar do
  filtro ganharam testid `filtro-<config.id>-btn-*`/`-busca`; cada `field-wrapper` ganhou
  `filtro-<filterName>-campo-<config.key>` no wrapper. O campo dinâmico em si (dentro do
  `fieldHost`) ainda não tem testid próprio — isso só é possível resolvendo via
  `DynamicInjectorService` quando `shared/dynamic-components` for atacado (próximo lote).

**`shared/components` fechado.**

**Status — lote 4 concluído: `shared/dynamic-components` (13 componentes + `mini-select`).**
Descoberta importante ao investigar antes de editar: **todo componente dessa pasta já calcula um
`fieldId` próprio** (`this.fieldId = this.fieldName ?? ''`, em `ngOnInit`), usado hoje só para o
atributo `id` nativo do elemento principal. Ou seja, já existe um identificador único por instância
de campo — não foi preciso criar nenhum `@Input testId` novo nem tocar em nenhum `.ts`: bastou
adicionar `[attr.data-testid]` reaproveitando `fieldId` em cada template (`input-<fieldId>` para
campos de valor único; `<fieldId>-trigger`/`-clear`/`-option-<hash>`/`-select-all` para os
dropdowns — `select-field`, `multi-select-field`, `mini-select`; `<fieldId>-<hash>` por opção em
`custom-radio`/`radio-field`; `<fieldId>-remover-<i>` em `files-field`). 14 componentes, 0 arquivos
`.ts` alterados.

**Achado incidental, não corrigido (fora do escopo desta fase):** a maioria dos componentes mais
antigos (`checkbox`, `custom-radio`, `date-field`, `files-field`, `money-field`,
`multi-select-field`, `number-field`, `radio-field`, `select-field`, `textarea-field`,
`text-field`, `time-field`, `toggle`) espera `@Inject("name")` no construtor para popular
`fieldName` em modo inject — mas `FilterItemConfig` (`filtro.models.ts`) só declara `key`, não
`name`. Já `mini-select` (mais recente) injeta corretamente `@Inject('key')`. Ou seja, em modo
`filtro` (inject), o `fieldId` desses 13 componentes mais antigos provavelmente fica vazio na
prática — o que faz o novo `data-testid` ser omitido nesse modo (comportamento seguro, não quebra
nada), mas também significa que **hoje, dentro de um filtro real, esses campos ainda não têm
testid** até esse mismatch `name`/`key` ser corrigido. Vale investigar/corrigir como item futuro,
separado desta auditoria de testabilidade.

**Fase 1 (convenção `data-testid`) está completa em `shared/components`, `shared/filtro` e
`shared/dynamic-components`.** Não ficaram componentes shared pendentes de instrumentação.

**Mismatch `name`/`key` corrigido.** Os 13 componentes que injetavam `@Optional() @Inject("name")`
passaram a injetar `@Optional() @Inject("key")` (renomeando o parâmetro para `injectedKey`),
alinhados ao que `mini-select` já fazia corretamente — `key` é a propriedade que
`FilterItemConfig` de fato tem (confirmado lendo configs reais de filtro em produção, ex.
`filtro-diario-de-classe.ts`: todo campo usa `key: "hashAnoLetivo"` etc., nunca `name`). Nenhuma
mudança em `DynamicInjectorService` foi necessária — ele já injeta qualquer propriedade do field
(exceto `type`/`value`) sob o próprio nome, então `key` já virava provider automaticamente; só
faltava os componentes pedirem o token certo. Efeito: dentro de um `filtro` real, `fieldName`
(e portanto `fieldId` e os `data-testid` do lote anterior) agora são preenchidos corretamente pela
`key` de cada campo — antes ficavam sempre vazios em modo inject.
Componentes corrigidos: `checkbox`, `custom-radio`, `date-field`, `files-field`, `money-field`,
`multi-select-field`, `number-field`, `radio-field`, `select-field`, `textarea-field`, `text-field`,
`time-field`, `toggle`. Mudança isolada ao construtor de cada um — modo template (uso direto via
`[fieldName]`) não foi alterado e continua funcionando como antes.

O que resta: (a) propagar `[testId]`/`[fieldName]` nos ~39+ call sites de cada tela, conforme forem
sendo tocadas (não é um lote mecânico — nomes dependem do contexto de cada tela); (b) Fases 2-5 do
plano (padronizar modais, refatorar combobox `<div>` sem ARIA, formalizar a convenção em doc).

---

## Propagação de `[testId]` nos call sites — progresso

Diferente da Fase 1 (mecânica, dentro do componente shared), aqui cada `[testId]` precisa refletir
o contexto da tela — por isso avançando em lotes por módulo de feature, e não por tipo de
componente.

**Convenção usada nos call sites:**
- Modal: `modal-<contexto>` no `app-modal`, e `modal-<contexto>-btn-cancelar`/`-btn-salvar`/
  `-btn-confirmar` nos botões internos.
- Botão de ação fora de modal: `btn-<ação>-<contexto>`.
- Campo de formulário (select/multi-select/turno-radio): `<contexto>-<campo>`.
- Item repetido em `*ngFor`: sufixo com o índice (`-<i>`) quando não há um id de negócio melhor
  disponível (ex. linhas novas ainda sem hash).
- `app-titulo-page`/`app-titulo-tela`: `titulo-page-<área>`/`titulo-tela-<tela>`.

**Lote 1 concluído — `escolas-publicas` + `escolas-gerenciais` (11 arquivos):**
`detalhes`, `listar`, `modals/cadastro-escola-publica`, `modals/cadastro-turma-servico`,
`modals/cadastro-turma`, `modals/editar-escola-publica`, `modals/editar-turma`,
`modals/remover-turma`, `escolas-gerenciais/cadastro`, `escolas-gerenciais/editar`,
`escolas-gerenciais/listar`.

**Fora de escopo — outros times mexem ativamente nesses módulos, não tocar (risco de conflito de
merge):**
- `folha/` (gestao-pagamento e previa-carga)
- `movimentacao-pedagogica/` (alteracao-carga, alteracao-carga-detalhes, lancamento-eventos,
  components/modal-alteracao-carga, tipo-evento-*, movimentacao-tab-navigator)

**Restam (por módulo, agrupados para os próximos lotes):**
- `lancamento-frequencia` (lancamento, justificativa-modal, saida-antecipada-modal,
  frequencia-tab-navigator, listar, lista-presenca, justificativas)
- `itinerario-formativo` (editar-itinerario, listar-itinerarios, selecao-itinerario)
- `cargas-iniciais` (alocacao-professores, importar-alocacao-professores, form-etapa-importacao,
  grade-horaria)
- `ocorrencia`, `etapas`, `periodo-letivo`, `boletim/processamento`, `relatorio/disciplinas`,
  `dias-sem-aula`, `diario-de-classe`, `exemplos` (telas de showcase, menor prioridade)

Cada lote deve ser pedido separadamente — os nomes de `testId` exigem ler o contexto de cada tela
antes de decidir, não é copy-paste entre lotes.

**Lote 2 concluído — grupo menor (`ocorrencia`, `etapas`, `periodo-letivo`, `boletim/processamento`,
`relatorio/disciplinas`, `dias-sem-aula`, `diario-de-classe`).**

**Achado importante:** `etapas`, `periodo-letivo` e `dias-sem-aula` foram reorganizados desde o
último scan do `frontend-maps` (2026-06-11, > 30 dias — exatamente o gatilho que o `CLAUDE.md`
avisa para rodar `/bench-scan-front` de novo). Os três agora vivem sob um módulo novo
`app/features/configurador-periodos-letivos/` (`ano-letivo/` = período letivo, `escola-etapa/` =
etapas, `dias-sem-aula/` mantido o nome), e existe um módulo novo que não estava no mapa:
`dia-letivo-extra/`. `dias-sem-aula` e `dia-letivo-extra` também trocaram o padrão de
modal-de-formulário por página dedicada (`formulario-page/`), então o antigo `app-listbox-transfer`
citado no plano original só apareceu em `dias-sem-aula`, não em `dia-letivo-extra`.

**Componente shared que faltou no Fase 1 original:** `app-check` (`shared/components/check`) — usado
extensivamente no novo `dia-letivo-extra/formulario-page` (toggle de turno/série/turma/frente) não
tinha sido coberto em nenhum lote anterior (é um componente standalone, signal-based, provavelmente
adicionado/reescrito depois do lote de auditoria). Adicionado `testId = input('')` +
`[attr.data-testid]` no host `<label>` antes de propagar nos call sites.

Arquivos tocados neste lote: `ocorrencia/cadastro`, `ocorrencia/listar`,
`configurador-periodos-letivos/ano-letivo/editar`,
`configurador-periodos-letivos/escola-etapa/modals/editar-etapas`,
`configurador-periodos-letivos/dias-sem-aula/listar` (+ `formulario-page`),
`configurador-periodos-letivos/dia-letivo-extra/listar` (+ `formulario-page`),
`configurador-periodos-letivos/configurador-periodos-letivos` (shell), `boletim/processamento`,
`relatorio/disciplinas`, `diario-de-classe/configuracao`, `diario-de-classe-tab-navigator`,
`diario-de-classe` (shell). Sem alterações necessárias em
`configurador-periodos-letivos/escola-etapa/listar`, `diario-de-classe/listar` e
`boletim/boletim.component.html` (placeholder "boletim works!", sem componentes shared reais) —
só usam elementos que não instrumentamos (botões nativos, componentes de documento não cobertos
pela Fase 1).

**Recomendação registrada aqui:** dado que o mapa de frontend está desatualizado o suficiente para
já ter perdido uma reorganização de módulo inteira, rodar `/bench-scan-front` antes do próximo lote
de propagação evita repetir esse tipo de descoberta manual via `Glob`.

### Fase 2 — Padronizar `app-modal` e convenção de modais de feature

- `app-modal`: adicionar `role="dialog"`, `aria-modal="true"`, `aria-label` (replicar o padrão já
  correto do `side-panel`); expor `loading` no template (hoje é `@Input` morto).
- Definir e documentar convenção única de testid para botões de modal
  (`btn-confirmar`/`btn-cancelar`/`btn-fechar`, seção 6 do `readme.md`) e aplicar nos 3 modais de
  feature auditados como primeiro lote.

### Fase 3 — Combobox customizado (`select-field`, `multi-select-field`, `multi-select`, `mini-select`)

Maior risco e maior valor estrutural — os 3 primeiros compartilham o mesmo padrão copy-paste de
`<div (click)>` sem `role`/ARIA, e são campos de formulário usados em praticamente todo filtro da
aplicação. Já existe um componente correto no próprio repo para copiar o padrão de:
`checkmark-dropdown` (`aria-haspopup`, `aria-expanded`, `role="option"`).

- Não fazer como big-bang: refatorar oportunisticamente, um componente por vez, com QA visual e
  regressão manual em quem consome cada um (uso amplo em `filtro`).
- `mini-select` já tem o trigger correto (`<button>`) — falta só as opções (`role="option"`).

### Fase 4 — Componentes secundários com `<div>`/`<span>` clicável

Menor uso relativo — `tab-navigator`, `toastr-eleva`, `datepicker` (dias), `listbox-transfer`,
`check`. Mesmo padrão de referência das fases anteriores (`view-toggle` já resolve o caso
`tab-navigator` corretamente). Incluir a correção do `<a>` sem `href` em `paginacao` neste lote.

### Fase 5 — Formalizar a convenção

- Documentar a convenção de `data-testid` (seção 1 do `readme.md`) no `shared/README.md` do
  `estrutura-pedagogica`, para que componentes novos já nasçam aderentes.
- Incorporar o checklist da seção 10 do `readme.md` ("esse componente é testável?") na revisão de
  PR de componentes shared.

---

## Recomendação de priorização

- **Fase 1 é a única obrigatória de imediato** — custo baixo, risco zero, e é pré-requisito de
  qualquer teste Playwright que dependa de seletor estável.
- **Fase 3 é a de maior valor estrutural**, mas só compensa fazer sob demanda (quando uma feature
  ou teste real tocar um desses componentes), dado o risco de regressão em um combobox usado em
  quase todo formulário/filtro do sistema.
- Fases 2, 4 e 5 podem ser executadas em paralelo, conforme disponibilidade — nenhuma bloqueia a
  Fase 1.
