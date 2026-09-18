# Documentação Pedagógica → Configurações — UI Atual (estrutura-pedagogica)

> **Observação de contexto:** esta aba reflete fielmente uma tela antiga do sistema legado
> `documentacao-pedagogica`, que era organizada como um accordion único com 6 seções de
> configuração de rede (Geral, Histórico Escolar, Ficha Individual, Ata de Resultados Finais,
> Livro de Matrícula, Certificado de Conclusão), mais telas separadas para configuração de
> Escola e de Fundamentações Legais. A migração para `estrutura-pedagogica` recriou essa
> estrutura com os componentes compartilhados atuais, mas manteve o mesmo modelo de interação
> (hub em modo leitura + accordion + telas de edição em rota separada por seção). Este documento
> descreve **o que existe hoje no código**, literalmente — não é uma proposta de redesenho. O
> objetivo é servir de insumo para uma ferramenta de design pensar uma versão visual moderna.

Código-fonte analisado:
`c:/projects/estrutura-pedagogica/frontend/src/app/features/documentacao-pedagogica/configuracoes/`

---

## Sumário das 9 telas

| # | Tela | Arquivo | Rota |
|---|------|---------|------|
| 1 | Hub de Configurações | `configuracao-documentacao-pedagogica.component.*` | `/documentacao-pedagogica/configuracoes` |
| 2 | Editar Configurações Gerais | `rede/editar-geral/editar-geral.component.*` | `/documentacao-pedagogica/configuracoes/rede/editar/geral` |
| 3 | Editar Histórico Escolar | `rede/editar-historico/editar-historico.component.*` | `/documentacao-pedagogica/configuracoes/rede/editar/historico` |
| 4 | Editar Ficha Individual | `rede/editar-ficha/editar-ficha.component.*` | `/documentacao-pedagogica/configuracoes/rede/editar/ficha` |
| 5 | Editar Ata de Resultados Finais | `rede/editar-ata/editar-ata.component.*` | `/documentacao-pedagogica/configuracoes/rede/editar/ata` |
| 6 | Editar Livro de Matrícula | `rede/editar-livro-matricula/editar-livro-matricula.component.*` | `/documentacao-pedagogica/configuracoes/rede/editar/livro-matricula` |
| 7 | Editar Certificado de Conclusão | `rede/editar-certificado-conclusao/editar-certificado-conclusao.component.*` | `/documentacao-pedagogica/configuracoes/rede/editar/certificado-conclusao` |
| 8 | Editar Escola | `escola/editar/editar.component.*` | `/documentacao-pedagogica/configuracoes/escola/:hashEscola/editar` |
| 9 | Editar Fundamentações Legais | `fundamentacao-legal/editar/editar.component.*` | `/documentacao-pedagogica/configuracoes/fundamentacao-legal/editar` |

---

## Contexto de navegação (fora da aba Configurações)

A tela de Configurações é uma das 3 abas do módulo "Documentação Pedagógica"
(`documentacao-pedagogica.component.html`):

- Cabeçalho: `app-titulo-page` com título **"Documentação Pedagógica"**.
- Logo abaixo, um `app-tab-navigator` (componente de abas roteadas) com 3 itens:
  - **Alunos**
  - **Turmas**
  - **Configurações** (rota ativa cobre qualquer sub-rota de `configuracoes`, via `activePrefix`)
- Abaixo das abas, um `<router-outlet>` renderiza o conteúdo da aba selecionada.

Todas as 9 telas de Configurações vivem dentro desse `router-outlet`. Note que a tela "hub"
não tem seu próprio botão de voltar (ela É o destino da aba), mas as 8 telas de edição têm um
botão de voltar no topo que retorna sempre para o hub (`/documentacao-pedagogica/configuracoes`).

---

## 1. Hub de Configurações

**Arquivo:** `configuracao-documentacao-pedagogica.component.html/.ts/.scss`

### Propósito
Tela principal (somente leitura) da aba Configurações. Permite selecionar uma rede de ensino e
visualizar, em formato de accordion, as configurações de documentos daquela rede, além de listar
as escolas da rede e as fundamentações legais cadastradas. Serve como ponto de entrada para todas
as 8 telas de edição.

### Layout estrutural
1. `app-titulo-page` — título **"Configurações"** no topo da página.
2. `app-loading` — exibido em tela cheia enquanto `loading` é `true` (ver seção Estados).
3. `<div class="cdp-page">` (container principal, `max-width: 900px`, `padding: 24px`), oculto
   (`[hidden]`) enquanto `loading = true`:
   - **Seletor de rede** (`cdp-select-rede`, `max-width: 360px`): componente `single-select`
     com label **"Selecione a rede"**.
   - Todo o restante do conteúdo abaixo só aparece se houver uma `redeSelecionada` (`*ngIf`):
     - Título de seção **"Configurações dos documentos da rede"** (`<p class="cdp-section-title">`,
       negrito).
     - **Accordion** (`cdp-accordion`, borda de 1px, cantos arredondados 8px) com 6 seções
       empilhadas verticalmente. Cada seção tem:
       - Um `<button class="cdp-accordion-header">` — largura total, `display:flex`,
         `justify-content: space-between`, fundo branco (fundo cinza claro `#F8F9FB` quando
         ativo/aberto), com o **rótulo da seção** à esquerda e um ícone Material
         (`expand_more`/`expand_less`) à direita que alterna conforme o estado aberto/fechado.
       - Um `<div class="cdp-accordion-body">` (fundo `#FBFBFC`) que só é renderizado quando a
         seção está aberta (`*ngIf="secaoAberta === '<id>'"`) — contém os campos em modo leitura
         e termina com um botão **"Editar"** (`app-button`, estilo `button-secundary`).
     - Apenas uma seção pode estar aberta por vez (`secaoAberta: SecaoRede | null`); clicar no
       header de uma seção fechada abre-a e fecha qualquer outra aberta (toggle).
     - Título de seção **"Escolas da rede"** seguido de uma lista de cards (`cdp-lista-cards`,
       `flex-direction: column`, `gap: 8px`) — um `cdp-card` por escola, com borda 1px e fundo
       branco, mostrando `<b>{{descricao}}</b> — {{cidade}}/{{uf}}` à esquerda e um botão
       **"Editar"** (`button-secundary`) à direita.
     - Título de seção **"Fundamentações legais da rede"** seguido de uma lista de cards
       (mesma classe `cdp-lista-cards`) — um `cdp-card cdp-card-fundamentacao` por fundamentação
       ativa, mostrando apenas `{{descricao}}` (sem botão individual), e ao final da lista um
       único botão **"Editar fundamentações legais"** (`button-secundary`).

### Campos exibidos por seção do accordion

#### Seção "Configurações gerais" (`secaoAberta === 'geral'`)

| Campo (label) | Tipo de exibição | Valor/Fallback | Condição |
|---|---|---|---|
| Alinhamento do título nos documentos | Texto derivado de boolean | `Centro` / `Esquerda` | — |
| Exibir notas com casas decimais? | Texto Sim/Não | `Sim` / `Não` | — |
| Nomenclatura por série nos documentos | Lista (uma linha por série) | `{{serie}} → {{nomenclatura}}` para cada item de `seriesNomenclatura` | `*ngFor` |
| Deve exibir status "Aprovado pelo conselho"? | Texto Sim/Não | `Sim` / `Não` | — |
| Deve mostrar transferência interna? | Texto Sim/Não | `Sim` / `Não` | — |

Botão: **"Editar"** → navega para tela "Editar Configurações Gerais".

#### Seção "Histórico Escolar" (`secaoAberta === 'historico'`)

| Campo (label) | Tipo de exibição | Valor/Fallback | Condição |
|---|---|---|---|
| Incluir brasão | Texto derivado (cascata de booleans) | `Não` / `Sim, da Unesco` / `Sim, do país` / `Sim, do estado` | — |
| Critérios de avaliação | Texto longo (pre-wrap) | conteúdo de `observacao`, ou **"Sem critérios de avaliação"** se `possuiObservacao` for falso | — |
| Certificado de conclusão | Texto derivado | `Incluso {{nomeTipoCertificadoConclusao}}` ou **"Não incluso"** | — |
| Resultados parciais do ano | Texto derivado | `Ocultar` / `Exibir` | — |
| Fundamentação legal | Texto derivado | `Exibir com certificado de conclusão` / `Exibir separadamente` | só aparece se `possuiCertificadoConclusao` for verdadeiro (`*ngIf`) |
| Modelo do Histórico Escolar | Texto derivado | `Documento separado por segmento` / `Documento único` | — |
| Realçar impressão | Texto Sim/Não | `Sim` / `Não` | — |
| Agrupar por área do conhecimento | Texto Sim/Não | `Sim` / `Não` | — |
| Imprimir linha "Mínimo para aprovação" | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir itinerário formativo separadamente | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir carga horária total para o Ensino Médio | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir registro de publicação do Ensino Médio | Texto Sim/Não | `Sim` / `Não` | — |

Botão: **"Editar"** → navega para tela "Editar Histórico Escolar".

#### Seção "Ficha Individual" (`secaoAberta === 'ficha'`)

| Campo (label) | Tipo de exibição | Valor/Fallback | Condição |
|---|---|---|---|
| Agrupar por área do conhecimento | Texto Sim/Não | `Sim` / `Não` | — |
| Modelo da Ficha Individual | Texto derivado | `Resumido` / `Detalhado` | — |
| Resultados parciais do ano | Texto derivado | `Ocultar` / `Exibir` | — |
| Exibir carga horária total | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir RA digital do aluno | Texto Sim/Não | `Sim` / `Não` | — |

Botão: **"Editar"** → navega para tela "Editar Ficha Individual".

#### Seção "Ata de Resultados Finais" (`secaoAberta === 'ata'`)

| Campo (label) | Tipo de exibição | Valor/Fallback | Condição |
|---|---|---|---|
| Agrupamento dos alunos | Texto derivado | `Por série` / `Por turma` | — |
| Número de matrícula | Texto calculado (`getTipoNumeroMatriculaASerExibido()`) | `Código INEP` (se `exibirCodigoINEPNaAtaDeResultadosFinais`), senão `RA Digital` (se `exibirRADigitalNaAtaDeResultadosFinais`), senão `Matrícula` | prioridade em cascata |
| Exibir carga horária por disciplina | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir transferidos como situação final | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir % de frequência | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir resultado final abreviado | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir apenas alunos ativos | Texto Sim/Não | `Sim` / `Não` | — |
| Complemento | Texto longo (pre-wrap) | `complemento` ou **"Não existem complementos para serem exibidos."** | — |

Botão: **"Editar"** → navega para tela "Editar Ata de Resultados Finais".

#### Seção "Livro de Matrícula" (`secaoAberta === 'livro'`)

| Campo (label) | Tipo de exibição | Valor/Fallback | Condição |
|---|---|---|---|
| Ordem do documento | Texto derivado | `Data de matrícula` / `Ordem alfabética` | — |
| Exibir RA do aluno | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir RA digital do aluno | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir código Inep do aluno | Texto Sim/Não | `Sim` / `Não` | — |

Botão: **"Editar"** → navega para tela "Editar Livro de Matrícula".

Nota: existe um campo de dados `agruparPorSegmentoLivroMatricula` no model que **não é exibido**
nesta tela nem editável (herdado do doc-ped como opção desabilitada até viabilizar).

#### Seção "Certificado de Conclusão" (`secaoAberta === 'certificado'`)

| Campo (label) | Tipo de exibição | Valor/Fallback | Condição |
|---|---|---|---|
| Brasão da rede | Texto calculado (`getPosicaoPorBrasao('rede')`) | `Esquerda` / `Centro` / `Direita` / `Não incluído` | — |
| Brasão do estado | idem, para `'estado'` | idem | — |
| Brasão do país | idem, para `'pais'` | idem | — |
| Brasão da Unesco | idem, para `'unesco'` | idem | — |
| Lei e/ou termos inclusos no certificado | Texto longo (pre-wrap) | `configuracaoCertificadoConclusao.leiTermo` ou **"Sem critérios de avaliação"** (mensagem de fallback reaproveitada, aparentemente incorreta/copiada de outro campo) | — |
| Incluir moldura | Texto calculado (`getMoldura()`) | `Linhas` / `Linear Cinza` / `Linear Dourado` / `Não incluído` | — |
| Agrupar por área do conhecimento | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir informações de registro do documento | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir carga horária com minutos | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir nome dos responsáveis | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir CPF ou RG | Texto derivado | `CPF` / `RG` | — |
| Exibir disciplinas em duas colunas | Texto Sim/Não | `Sim` / `Não` | — |
| Exibir assinatura do(a) secretário(a) escolar | Texto derivado | `Na frente e verso` / `No verso` | — |
| Complemento | Texto longo (pre-wrap) | `configuracaoCertificadoConclusao.complemento` ou **"Não existem complementos para serem exibidos."** | — |

Botão: **"Editar"** → navega para tela "Editar Certificado de Conclusão".

### Todo elemento interativo
- **`single-select` "Selecione a rede"** — dropdown com busca (campo de texto que filtra opções
  em uma lista virtualizada), opção de limpar seleção (`×`), placeholder "Selecione uma opção" se
  vazio; ao trocar a rede, dispara `selecionaRede()` que fecha qualquer seção aberta do accordion
  e recarrega toda a tela (escolas, fundamentações e a própria configuração de rede) para a rede
  escolhida.
- **6 botões de header do accordion** — cada um alterna (toggle) a seção correspondente aberta
  ou fechada; texto exato: "Configurações gerais", "Histórico Escolar", "Ficha Individual",
  "Ata de Resultados Finais", "Livro de Matrícula", "Certificado de Conclusão".
- **6 botões "Editar"** (um por seção do accordion) — cada um salva a rede selecionada em um
  `RouteStateService` (chave `ConfiguracaoDocumentacaoPedagogicaRede`) e navega para a rota de
  edição da respectiva seção.
- **N botões "Editar"** (um por escola listada) — salva a escola em `RouteStateService`
  (chave `ConfiguracaoDocumentacaoPedagogicaEscola`) e navega para
  `/documentacao-pedagogica/configuracoes/escola/{hashEscola}/editar`.
- **1 botão "Editar fundamentações legais"** — salva a rede selecionada em `RouteStateService`
  (chave `ConfiguracaoDocumentacaoPedagogicaFundamentacao`) e navega para
  `/documentacao-pedagogica/configuracoes/fundamentacao-legal/editar`.

### Estados
- **Loading (carregamento inicial ou troca de rede):** `app-loading` (spinner com 3 pontos
  animados + texto "Carregando..." — mensagem padrão do componente) ocupa a tela inteira; o
  restante do conteúdo (`.cdp-page`) fica com `[hidden]` (não removido do DOM, apenas oculto).
  Ocorre em: carregamento inicial (`ngOnInit`), troca de rede (`carregarConfiguracaoRede`) e
  carregamento de escolas/fundamentações (`carregarDadosRede`, via `forkJoin`).
- **Vazio (sem rede selecionada):** se `redeSelecionada` for `undefined` (ex.: nenhuma rede
  cadastrada, ou seleção limpa no `single-select`), todo o bloco do accordion + escolas +
  fundamentações some (`*ngIf="redeSelecionada"` no `ng-container`) — não há mensagem de
  "nenhuma rede encontrada" explícita no HTML.
- **Vazio (sem seção aberta):** ao carregar/trocar de rede, `secaoAberta` é resetado para `null`
  — todas as seções do accordion aparecem fechadas.
- **Vazio (sem escolas / sem fundamentações):** não há tratamento explícito de lista vazia no
  HTML — se `escolas` ou `fundamentacoesLegais` forem arrays vazios, a lista de cards
  simplesmente não renderiza nenhum item (sem placeholder de "nenhum resultado").
- **Erro:** não há tratamento de erro explícito no componente (sem bloco de erro na tela); uma
  falha na chamada HTTP não é capturada visualmente aqui.

### Componentes compartilhados usados
`app-titulo-page`, `app-loading`, `single-select` (select-field), `app-button` (múltiplas
instâncias, todas com `classButton="button-secundary"`).

### Navegação
- **Chegada:** aba "Configurações" do módulo Documentação Pedagógica, ou retorno (`voltar()`) de
  qualquer uma das 8 telas de edição.
- **Saída:** 8 botões "Editar" diferentes, cada um levando a uma das telas de edição listadas no
  sumário.

---

## 2. Editar Configurações Gerais

**Arquivo:** `rede/editar-geral/editar-geral.component.html/.ts/.scss`

### Propósito
Formulário de edição das configurações gerais de documentos da rede: alinhamento de título,
casas decimais em notas, nomenclatura de séries, status do conselho e transferência interna.

### Layout estrutural
1. Barra de navegação superior (`ef-nav`): botão de voltar (ícone `chevron_left`, sem texto) +
   título **"Editar configurações gerais | {{rede.descricao}}"** (nome da rede interpolado).
2. Formulário (`ef-form`, `max-width: 700px`, campos empilhados verticalmente com `gap: 20px`),
   renderizado somente quando `form` existe (`*ngIf="form"`):
   - Grupo de radio "Alinhamento do título nos documentos".
   - Checkbox "Exibir notas com casas decimais" (linha horizontal ícone+label).
   - Checkbox "Exibir status "Aprovado pelo conselho"".
   - Checkbox "Mostrar transferência interna".
   - Lista dinâmica (FormArray) "Nomenclatura por série nos documentos": uma linha por série,
     com o nome da série fixo à esquerda (`width: 220px`) e um campo de texto editável
     (`text-field`) à direita, para cada série existente na rede.
3. Rodapé fixo (`app-salvar` com `customContent="true"`): um `<div style="flex:1">` empurra os
   botões para a direita, seguido de **"Cancelar"** e **"Salvar"**.

### Todo campo/dado exibido (modo edição)

| Campo (label) | Componente | Tipo de controle | Opções / observações |
|---|---|---|---|
| Alinhamento do título nos documentos | `app-radio-field` | Radio group | `Centro` (`hash: "centro"`) / `Esquerda` (`hash: "esquerda"`) |
| Exibir notas com casas decimais | `app-checkbox` | Checkbox | boolean |
| Exibir status "Aprovado pelo conselho" | `app-checkbox` | Checkbox | boolean |
| Mostrar transferência interna | `app-checkbox` | Checkbox | boolean |
| Nomenclatura por série nos documentos | `text-field` (um por série, dentro de `FormArray`) | Texto livre | label da série é somente leitura (`<span>`); só o campo "nomenclatura" é editável |

### Todo elemento interativo
- **Botão de voltar** (ícone, `chevron_left`) — navega de volta para `/documentacao-pedagogica/configuracoes` sem salvar.
- **Radio "Alinhamento do título nos documentos"** — 2 opções, controla `exibirTituloCentralizadoNoDocumento`.
- **3 checkboxes** — `notasComUmaCasaDecimal`, `statusAprovadoPeloConselho`, `exibirAlunosApenasNaTurmaMaisRecente`.
- **N campos de texto** (um por série) — editam a `nomenclatura` de cada série; não há validação
  visível no template (sem `required`/tamanho explícitos no HTML).
- **Botão "Cancelar"** — navega de volta ao hub sem salvar; fica desabilitado durante `loading`.
- **Botão "Salvar"** — texto muda para **"Salvando..."** enquanto `loading = true`; fica
  desabilitado durante o salvamento; ao concluir, dispara notificação de sucesso
  ("Configurações gerais salvas com sucesso.") e navega de volta ao hub.

### Estados
- **Loading:** enquanto `!form` (dados ainda não carregados do `RouteStateService`), nada é
  renderizado no formulário — não há spinner explícito, a tela simplesmente aparece vazia até o
  form ser montado (o carregamento é síncrono a partir do estado já passado pela tela anterior,
  então isso é quase instantâneo).
- **Sem dados de origem:** se a tela for acessada diretamente sem uma rede em `RouteStateService`
  (ex.: navegação direta por URL), `ngOnInit` chama `voltar()` imediatamente, retornando ao hub.
- **Salvando:** botões "Cancelar" e "Salvar" ficam `disabled`; label do botão "Salvar" muda para
  "Salvando...".
- **Erro:** não há tratamento de erro no `subscribe()` da chamada de salvar — falha na API não
  reverte o estado `loading` nem exibe mensagem.

### Componentes compartilhados usados
`app-radio-field`, `app-checkbox`, `text-field`, `app-salvar` (customContent), `app-button`
(Cancelar `button-secundary no-borders`; Salvar `button-primary colored`).

### Navegação
- **Chegada:** botão "Editar" da seção "Configurações gerais" no hub.
- **Saída:** "Cancelar" ou "Salvar" (ambos voltam para `/documentacao-pedagogica/configuracoes`);
  botão de voltar no topo também retorna ao hub.

---

## 3. Editar Histórico Escolar

**Arquivo:** `rede/editar-historico/editar-historico.component.html/.ts/.scss`

### Propósito
Formulário de edição das configurações do documento "Histórico Escolar": brasão, critérios de
avaliação, certificado de conclusão vinculado, layout de resultados parciais, modelo do
documento e diversas opções de exibição.

### Layout estrutural
Mesmo padrão das demais telas de edição: `ef-nav` (voltar + título **"Editar configurações do
histórico escolar | {{rede.descricao}}"**) → `ef-form` (campos empilhados, `gap: 20px`) →
`app-salvar` fixo com Cancelar/Salvar.

### Todo campo/dado exibido (modo edição)

| Campo (label) | Componente | Tipo de controle | Opções / observações |
|---|---|---|---|
| Incluir brasão | `app-radio-field` | Radio group | `Não incluir` / `Sim, da Unesco` / `Sim, do país` / `Sim, do estado` |
| Possui critérios de avaliação | `app-checkbox` | Checkbox | boolean; controla exibição do campo abaixo |
| (textarea de critérios) | `app-textarea-field` | Textarea | placeholder "Descreva os critérios de avaliação"; só aparece se "Possui critérios de avaliação" estiver marcado (`*ngIf`); controle desabilitado quando a checkbox está desmarcada |
| Possui certificado de conclusão | `app-checkbox` | Checkbox | boolean; controla exibição dos 2 campos abaixo |
| Tipo de certificado | `single-select` | Dropdown com busca | opções carregadas via `service.getTiposCertificadoConclusao()`; só aparece se "Possui certificado de conclusão" estiver marcado |
| Fundamentação legal | `app-radio-field` | Radio group | `Exibir com certificado de conclusão` / `Exibir separadamente`; só aparece se "Possui certificado de conclusão" estiver marcado |
| Resultados parciais do ano | `app-radio-field` | Radio group | `Ocultar` / `Exibir` |
| Modelo do histórico escolar | `app-radio-field` | Radio group | `Documento separado por segmento` / `Documento único` |
| Realçar impressão | `app-checkbox` | Checkbox | boolean |
| Agrupar por área do conhecimento | `app-checkbox` | Checkbox | boolean |
| Imprimir linha "Mínimo para aprovação" | `app-checkbox` | Checkbox | boolean |
| Exibir itinerário formativo separadamente | `app-checkbox` | Checkbox | boolean |
| Exibir carga horária total para o Ensino Médio | `app-checkbox` | Checkbox | boolean |
| Exibir registro de publicação do Ensino Médio | `app-checkbox` | Checkbox | boolean |

### Todo elemento interativo
- **Botão de voltar** — retorna ao hub sem salvar.
- **Radio "Incluir brasão"** — 4 opções mutuamente exclusivas.
- **Checkbox + textarea condicional "Possui critérios de avaliação"** — ao marcar/desmarcar,
  habilita/desabilita (não apenas mostra/oculta) o controle de texto via `valueChanges` subscribe
  (`toggle()`).
- **Checkbox + select condicional "Possui certificado de conclusão"** — mesmo padrão: habilita/
  desabilita o `single-select` de tipo de certificado.
- **`single-select` "Tipo de certificado"** — ao selecionar, atualiza o hash do tipo escolhido.
- **Radio "Fundamentação legal"** — só visível quando há certificado de conclusão.
- **Radio "Resultados parciais do ano"**, **"Modelo do histórico escolar"** — 2 opções cada.
- **6 checkboxes simples** (realçar impressão, agrupar por área, mínimo para aprovação,
  itinerário separado, carga horária total EM, registro de publicação EM).
- **Botões "Cancelar" / "Salvar"** — mesmo comportamento padrão (ver seção 2), mensagem de
  sucesso: "Configurações do histórico escolar salvas com sucesso."

### Estados
- Mesmo padrão das demais: sem form → tela vazia até montar; sem `rede` no state → volta
  automaticamente ao hub; salvando → botões desabilitados e label "Salvando...".
- Campos dependentes (`observacao`, `hashTipoCertificadoConclusao`) nascem com `disabled: true`
  quando a condição-mãe (`possuiObservacao`/`possuiCertificadoConclusao`) é falsa, e são
  habilitados dinamicamente via `valueChanges`.
- Lista de tipos de certificado é carregada de forma assíncrona (`getTiposCertificadoConclusao()`)
  — não há spinner/skeleton específico enquanto essa lista carrega; o `single-select` fica
  populado assim que a resposta chega.

### Componentes compartilhados usados
`app-radio-field`, `app-checkbox`, `app-textarea-field`, `single-select`, `app-salvar`,
`app-button`.

### Navegação
- **Chegada:** botão "Editar" da seção "Histórico Escolar" no hub.
- **Saída:** Cancelar/Salvar/voltar → `/documentacao-pedagogica/configuracoes`.

---

## 4. Editar Ficha Individual

**Arquivo:** `rede/editar-ficha/editar-ficha.component.html/.ts/.scss`

### Propósito
Formulário de edição das configurações do documento "Ficha Individual" do aluno.

### Layout estrutural
Mesmo padrão: `ef-nav` (voltar + título **"Editar configurações da Ficha Individual |
{{rede.descricao}}"**) → `ef-form` → `app-salvar` fixo.

### Todo campo/dado exibido (modo edição)

| Campo (label) | Componente | Tipo de controle | Opções |
|---|---|---|---|
| Agrupar por área do conhecimento | `app-checkbox` | Checkbox | boolean |
| Modelo da Ficha Individual | `app-radio-field` | Radio group | `Resumido` / `Detalhado` |
| Resultados parciais do ano | `app-radio-field` | Radio group | `Ocultar` / `Exibir` |
| Exibir carga horária total | `app-checkbox` | Checkbox | boolean |
| Exibir RA digital do aluno | `app-checkbox` | Checkbox | boolean |

### Todo elemento interativo
- Botão de voltar.
- 1 radio "Modelo da Ficha Individual" (2 opções).
- 1 radio "Resultados parciais do ano" (2 opções).
- 3 checkboxes simples.
- Botões "Cancelar" / "Salvar" (mensagem de sucesso: "Configurações da Ficha Individual salvas
  com sucesso.").

### Estados
Mesmo padrão das demais telas — sem tratamento de erro explícito; `voltar()` automático se não
houver `rede` carregada no `RouteStateService`.

### Componentes compartilhados usados
`app-checkbox`, `app-radio-field`, `app-salvar`, `app-button`.

### Navegação
- **Chegada:** botão "Editar" da seção "Ficha Individual" no hub.
- **Saída:** volta para `/documentacao-pedagogica/configuracoes`.

---

## 5. Editar Ata de Resultados Finais

**Arquivo:** `rede/editar-ata/editar-ata.component.html/.ts/.scss`

### Propósito
Formulário de edição das configurações do documento "Ata de Resultados Finais".

### Layout estrutural
Mesmo padrão: `ef-nav` (voltar + título **"Editar configurações da Ata de Resultados Finais |
{{rede.descricao}}"**) → `ef-form` → `app-salvar` fixo.

### Todo campo/dado exibido (modo edição)

| Campo (label) | Componente | Tipo de controle | Opções |
|---|---|---|---|
| Agrupamento dos alunos | `app-radio-field` | Radio group | `Por série` / `Por turma` |
| Número de matrícula | `app-radio-field` | Radio group (3 opções) | `Código INEP` / `RA Digital` / `Matrícula` |
| Exibir carga horária por disciplina | `app-checkbox` | Checkbox | boolean |
| Exibir transferidos como situação final | `app-checkbox` | Checkbox | boolean |
| Exibir % de frequência | `app-checkbox` | Checkbox | boolean |
| Exibir resultado final abreviado | `app-checkbox` | Checkbox | boolean |
| Exibir apenas alunos ativos | `app-checkbox` | Checkbox | boolean |
| (sem label visível — campo solto) | `app-textarea-field` | Textarea | placeholder "Complemento"; sem `<label>` próprio no HTML, apenas o placeholder identifica o campo |

### Todo elemento interativo
- Botão de voltar.
- Radio "Agrupamento dos alunos" (2 opções).
- Radio "Número de matrícula" (3 opções, controla campanha em cascata de 2 booleans na origem).
- 5 checkboxes simples.
- Textarea livre "Complemento" (sem contador de caracteres visível além do padrão do
  `app-textarea-field`, ver seção de padrões).
- Botões "Cancelar" / "Salvar" (mensagem de sucesso: "Configurações da Ata de Resultados Finais
  salvas com sucesso.").

### Estados
Mesmo padrão — sem loading explícito, sem tratamento de erro.

### Componentes compartilhados usados
`app-radio-field`, `app-checkbox`, `app-textarea-field`, `app-salvar`, `app-button`.

### Navegação
- **Chegada:** botão "Editar" da seção "Ata de Resultados Finais" no hub.
- **Saída:** volta para `/documentacao-pedagogica/configuracoes`.

---

## 6. Editar Livro de Matrícula

**Arquivo:** `rede/editar-livro-matricula/editar-livro-matricula.component.html/.ts/.scss`

### Propósito
Formulário de edição das configurações do documento "Livro de Matrícula".

### Layout estrutural
Mesmo padrão: `ef-nav` (voltar + título **"Editar configurações do Livro de Matrícula |
{{rede.descricao}}"**) → `ef-form` → `app-salvar` fixo. É a tela de edição mais curta (4 campos).

### Todo campo/dado exibido (modo edição)

| Campo (label) | Componente | Tipo de controle | Opções |
|---|---|---|---|
| Ordem do documento | `app-radio-field` | Radio group | `Data de matrícula` / `Ordem alfabética` |
| Exibir RA do aluno | `app-checkbox` | Checkbox | boolean |
| Exibir RA digital do aluno | `app-checkbox` | Checkbox | boolean |
| Exibir código Inep do aluno | `app-checkbox` | Checkbox | boolean |

Nota: o campo de dados `agruparPorSegmentoLivroMatricula` existe no modelo/serviço mas **não
tem controle no formulário** — é preservado no payload de salvar com o valor original vindo da
rede (comentário no `.ts`: "opção desabilitada até tornarmos a opção de segmento viável", herdado
do `*ngIf="false"` do doc-ped original).

### Todo elemento interativo
- Botão de voltar.
- Radio "Ordem do documento" (2 opções).
- 3 checkboxes simples.
- Botões "Cancelar" / "Salvar" (mensagem de sucesso: "Configurações do Livro de Matrícula salvas
  com sucesso.").

### Estados
Mesmo padrão das demais telas.

### Componentes compartilhados usados
`app-radio-field`, `app-checkbox`, `app-salvar`, `app-button`.

### Navegação
- **Chegada:** botão "Editar" da seção "Livro de Matrícula" no hub.
- **Saída:** volta para `/documentacao-pedagogica/configuracoes`.

---

## 7. Editar Certificado de Conclusão

**Arquivo:** `rede/editar-certificado-conclusao/editar-certificado-conclusao.component.html/.ts/.scss`

### Propósito
Formulário de edição das configurações do documento "Certificado de Conclusão" — o mais extenso
dos 6 formulários de rede, cobrindo posicionamento de até 4 brasões, moldura, texto legal,
layout de disciplinas/assinaturas e complemento.

### Layout estrutural
Mesmo padrão: `ef-nav` (voltar + título **"Editar configurações do Certificado de Conclusão |
{{rede.descricao}}"**) → `ef-form` (13 grupos de campo) → `app-salvar` fixo.

### Todo campo/dado exibido (modo edição)

| Campo (label) | Componente | Tipo de controle | Opções |
|---|---|---|---|
| Brasão da rede | `app-radio-field` | Radio group (4 opções) | `Esquerda` / `Centro` / `Direita` / `Não incluído` |
| Brasão do estado | `app-radio-field` | Radio group (4 opções) | idem |
| Brasão do país | `app-radio-field` | Radio group (4 opções) | idem |
| Brasão da Unesco | `app-radio-field` | Radio group (4 opções) | idem |
| (sem label — campo solto) | `app-textarea-field` | Textarea | placeholder "Lei e/ou termos inclusos no certificado" |
| Incluir moldura | `app-radio-field` | Radio group (4 opções) | `Não incluído` / `Linhas` / `Linear Cinza` / `Linear Dourado` |
| Agrupar por área do conhecimento | `app-checkbox` | Checkbox | boolean |
| Exibir informações de registro do documento | `app-checkbox` | Checkbox | boolean |
| Exibir carga horária com minutos | `app-checkbox` | Checkbox | boolean |
| Exibir nome dos responsáveis | `app-checkbox` | Checkbox | boolean |
| Exibir CPF ou RG | `app-radio-field` | Radio group | `CPF` / `RG` |
| Exibir disciplinas em duas colunas | `app-checkbox` | Checkbox | boolean |
| Exibir assinatura do(a) secretário(a) escolar | `app-radio-field` | Radio group | `Na frente e verso` / `No verso` |
| (sem label — campo solto) | `app-textarea-field` | Textarea | placeholder "Complemento" |

**Importante — regra de negócio implícita na UI:** os 4 campos de brasão (rede/estado/país/
Unesco) são 4 grupos de radio **independentes**, cada um com as mesmas 4 opções de posição
(Esquerda/Centro/Direita/Não incluído). Isso permite, na interface, selecionar a mesma posição
para mais de um brasão simultaneamente (ex.: dois brasões marcados como "Esquerda" ao mesmo
tempo) — não há validação visual impedindo conflito de posição entre os 4 campos. Ao salvar, a
lógica (`brasaoNaPosicao`) resolve qual tipo de brasão "vence" cada posição pegando o primeiro
match encontrado na ordem rede → estado → país → Unesco.

### Todo elemento interativo
- Botão de voltar.
- 4 grupos de radio para posição dos brasões (rede, estado, país, Unesco).
- Textarea "Lei e/ou termos inclusos no certificado".
- Radio "Incluir moldura" (4 opções).
- 4 checkboxes simples (agrupar por área, informações de registro, minutos em CH, nome dos
  responsáveis).
- Radio "Exibir CPF ou RG" (2 opções).
- Checkbox "Exibir disciplinas em duas colunas".
- Radio "Exibir assinatura do(a) secretário(a) escolar" (2 opções).
- Textarea "Complemento".
- Botões "Cancelar" / "Salvar" (mensagem de sucesso: "Configurações do Certificado de Conclusão
  salvas com sucesso.").

### Estados
Mesmo padrão das demais telas — sem loading/erro explícitos no template.

### Componentes compartilhados usados
`app-radio-field`, `app-checkbox`, `app-textarea-field`, `app-salvar`, `app-button`.

### Navegação
- **Chegada:** botão "Editar" da seção "Certificado de Conclusão" no hub.
- **Saída:** volta para `/documentacao-pedagogica/configuracoes`.

---

## 8. Editar Escola

**Arquivo:** `escola/editar/editar.component.html/.ts/.scss`

### Propósito
Única tela de edição fora do fluxo "rede" — edita as configurações de impressão específicas de
uma escola (cabeçalho, assinaturas, carga horária, filiação) e também os dados cadastrais básicos
da unidade escolar no ano letivo vigente (nome, endereço, contatos). É a tela mais complexa da
aba, pois combina **dois formulários independentes** em uma mesma página, um deles com um
sub-modo de edição inline.

### Layout estrutural
1. `ef-nav`: botão de voltar + título **"Editar configurações da escola | {{escola.nomeRede}} -
   {{escola.descricao}}"**.
2. `ef-form` (`max-width: 700px`, `gap: 24px` entre cards), renderizado quando `form` existe:
   - **Card 1 — "Dados da unidade — {{anoLetivo.nomeAnoLetivo}}"** (`ef-card`, borda + padding
     16px), só renderizado quando `anoLetivoForm` está pronto:
     - **Modo leitura** (`!editandoAnoLetivo`, padrão): mostra label "Nome e endereço da escola"
       com o texto `{{nomeOficial}} — {{endereco}}, {{bairro}} — {{cidade}}`, seguido de uma
       segunda linha `CEP: {{cep}} | Telefone: {{telefone}} | CNPJ: {{cnpj}}`; botão **"Editar
       dados"** abaixo.
     - **Modo edição** (`editandoAnoLetivo = true`, ativado pelo botão acima): revela 8 campos de
       texto (`text-field`) empilhados — Nome da escola, Endereço, Bairro, Cidade, CEP, Telefone,
       CNPJ, Data de fim do ano letivo — e, ao final, uma linha de ações inline
       (`ef-actions-inline`, alinhada à direita) com botões **"Cancelar"** e **"Salvar dados"**
       específicos deste card (independentes do rodapé fixo da página).
   - **Card 2 — sem título de card, mas com 2 sub-títulos internos** (`ef-card`):
     - Sub-título **"Cabeçalho"**:
       - Checkbox "Possui cabeçalho" (controla `mostrarCabecalho`).
       - Checkbox "Informações adicionais no cabeçalho" (controla `possuiCabecalho`) — só visível
         se "Possui cabeçalho" estiver marcado.
       - Textarea (placeholder "Texto adicional") — só visível se ambos os checkboxes acima
         estiverem marcados.
     - Sub-título **"Assinatura"**:
       - Checkbox "Assinatura do(a) secretário(a)" + textarea "Assinatura" (sempre visível, mas
         desabilitada quando o checkbox está desmarcado).
       - Checkbox "Assinatura do(a) diretor(a)" + textarea "Assinatura" (mesmo padrão).
       - Checkbox "Assinatura do(a) professor(a) inspetor(a) *(apenas na Ata de Resultados
         Finais)*" — o texto entre parênteses é um `<span class="ef-hint">` em cinza, tamanho
         menor — + textarea "Assinatura".
       - Checkbox "Assinatura do(a) coordenador(a) pedagógico(a) *(apenas na Ata de Resultados
         Finais)*" (mesmo padrão de hint) + **2 textareas**: "Assinatura | Ensino Fundamental" e
         "Assinatura | Ensino Médio" (ambas habilitadas/desabilitadas pelo mesmo checkbox).
       - Radio "Localização da assinatura": `Em todas as folhas` / `Apenas na última folha`.
       - Radio "Carga horária": `Por disciplina e série` / `Apenas por série`.
       - Radio "Exibir filiação no histórico escolar": `Exibir` / `Ocultar`.
3. Rodapé fixo (`app-salvar` customContent): "Cancelar" / "Salvar" — refere-se apenas ao **Card
   2** (as configurações de impressão); o Card 1 (dados da unidade) tem seu próprio par de
   botões dentro do card, salvo separadamente.

### Todo campo/dado exibido — Card 1 (Dados da unidade)

| Campo (label) | Modo leitura | Modo edição (componente) | Observações |
|---|---|---|---|
| Nome e endereço da escola | Texto composto: `{{nomeOficial}} — {{endereco}}, {{bairro}} — {{cidade}}` | — | só no modo leitura |
| (linha 2, sem label) | Texto composto: `CEP: {{cep}} \| Telefone: {{telefone}} \| CNPJ: {{cnpj}}` | — | só no modo leitura |
| Nome da escola | — | `text-field` (`nomeOficial`) | modo edição |
| Endereço | — | `text-field` (`endereco`) | modo edição |
| Bairro | — | `text-field` (`bairro`) | modo edição |
| Cidade | — | `text-field` (`cidade`) | modo edição |
| CEP | — | `text-field` (`cep`) | modo edição |
| Telefone | — | `text-field` (`telefone`) | modo edição |
| CNPJ | — | `text-field` (`cnpj`) | modo edição |
| Data de fim do ano letivo | — | `text-field` (`dataConclusao`, valor recortado para os 10 primeiros caracteres — formato `AAAA-MM-DD`) | modo edição; não é um date-picker, é `text-field` puro |

### Todo campo/dado exibido — Card 2 (Configurações de impressão)

| Campo (label) | Componente | Tipo | Condição / Observações |
|---|---|---|---|
| Possui cabeçalho | `app-checkbox` | Checkbox | controla `possuiCabecalho` |
| Informações adicionais no cabeçalho | `app-checkbox` | Checkbox | visível só se `mostrarCabecalho` marcado |
| (textarea sem label, placeholder "Texto adicional") | `app-textarea-field` | Textarea | visível só se `mostrarCabecalho` **e** `possuiCabecalho` marcados |
| Assinatura do(a) secretário(a) | `app-checkbox` | Checkbox | controla habilitação da textarea abaixo |
| (textarea "Assinatura", secretaria) | `app-textarea-field` | Textarea | sempre renderizada; desabilitada se checkbox desmarcado |
| Assinatura do(a) diretor(a) | `app-checkbox` | Checkbox | idem |
| (textarea "Assinatura", diretor) | `app-textarea-field` | Textarea | idem |
| Assinatura do(a) professor(a) inspetor(a) *(apenas na Ata de Resultados Finais)* | `app-checkbox` | Checkbox | hint em texto menor/cinza |
| (textarea "Assinatura", inspetor) | `app-textarea-field` | Textarea | idem padrão habilita/desabilita |
| Assinatura do(a) coordenador(a) pedagógico(a) *(apenas na Ata de Resultados Finais)* | `app-checkbox` | Checkbox | hint em texto menor/cinza; controla 2 textareas |
| (textarea "Assinatura \| Ensino Fundamental") | `app-textarea-field` | Textarea | — |
| (textarea "Assinatura \| Ensino Médio") | `app-textarea-field` | Textarea | — |
| Localização da assinatura | `app-radio-field` | Radio group | `Em todas as folhas` / `Apenas na última folha` |
| Carga horária | `app-radio-field` | Radio group | `Por disciplina e série` / `Apenas por série` |
| Exibir filiação no histórico escolar | `app-radio-field` | Radio group | `Exibir` / `Ocultar` |

### Todo elemento interativo
- Botão de voltar (topo).
- **Botão "Editar dados"** — ativa `editandoAnoLetivo = true`, habilita os 8 controles do
  `anoLetivoForm` (que nascem todos `disabled: true`).
- **Botão "Cancelar" (inline, Card 1)** — desativa modo edição e recarrega os valores originais
  do `anoLetivo` (descarta alterações não salvas).
- **Botão "Salvar dados" (inline, Card 1)** — salva apenas os dados da unidade
  (`updateConfiguracaoEscolaAnoLetivo`); ao concluir, sai do modo edição, atualiza o objeto local
  e mostra notificação "Informações da escola salvas com sucesso." — **não navega para fora da
  tela** (diferente de todos os outros formulários).
- 4 pares checkbox+textarea de assinatura (secretário, diretor, inspetor, coordenador) — os
  4 checkboxes habilitam/desabilitam as respectivas textareas via `valueChanges`; o checkbox do
  coordenador controla 2 textareas simultaneamente.
- Checkbox "Possui cabeçalho" + checkbox condicional "Informações adicionais" + textarea
  condicional — cadeia de 2 níveis de condição (`*ngIf` duplo).
- 3 grupos de radio (Localização da assinatura, Carga horária, Exibir filiação).
- **Botão "Cancelar" (rodapé fixo)** — volta ao hub sem salvar as configurações de impressão.
- **Botão "Salvar" (rodapé fixo)** — salva as configurações de impressão
  (`updateConfiguracaoEscola`); mostra notificação "Configurações da escola salvas com sucesso."
  e **navega de volta ao hub** (comportamento padrão, diferente do botão "Salvar dados" do Card 1).

### Estados
- **Loading:** `anoLetivo` é carregado de forma assíncrona (`getAnosLetivos`) depois do `form`
  principal já estar montado — por isso o Card 1 só aparece quando `anoLetivoForm` estiver
  pronto (`*ngIf="anoLetivoForm"`); pode haver um instante em que a tela mostra só o Card 2.
- **Sem dados de origem:** se não houver `escola` no `RouteStateService`, `voltar()` é chamado
  imediatamente.
- **Dois modos independentes de "salvando":** o `loading` é compartilhado entre os dois cards —
  usado tanto para desabilitar o botão "Salvar dados" do Card 1 quanto os botões do rodapé fixo.
- **Erro:** sem tratamento explícito nos `subscribe()`.

### Componentes compartilhados usados
`app-checkbox`, `app-textarea-field`, `app-radio-field`, `text-field`, `app-salvar`, `app-button`.

### Navegação
- **Chegada:** botão "Editar" em um card de escola específico, na lista "Escolas da rede" do hub.
- **Saída:** botão de voltar no topo, "Cancelar" do rodapé, ou "Salvar" do rodapé → todos levam
  a `/documentacao-pedagogica/configuracoes`. O par "Cancelar"/"Salvar dados" do Card 1 **não
  navega** — permanece na mesma tela.

---

## 9. Editar Fundamentações Legais

**Arquivo:** `fundamentacao-legal/editar/editar.component.html/.ts/.scss`

### Propósito
Tela de gerenciamento (CRUD simples em lista) das fundamentações legais textuais de uma rede —
frases/citações de leis usadas nos documentos oficiais. Permite adicionar, editar o texto e
remover (soft-delete) itens.

### Layout estrutural
1. `ef-nav`: botão de voltar + título **"Editar fundamentações legais da rede — {{rede.descricao}}"**.
2. `ef-form` (`gap: 12px`), renderizado quando `form` existe:
   - Rótulo fixo **"Lista de fundamentações legais"** (`<p class="control-label">`, não é label
     de campo, é um título de subseção).
   - Uma linha por fundamentação ativa (`ef-fundamentacao-row`, `*ngFor` sobre
     `fundamentacoesAtivas`): uma `app-textarea-field` (placeholder "Fundamentação legal") ocupando
     o espaço disponível, e um botão de ícone quadrado (`ef-icon-btn`, ícone `remove`) à direita
     para remover a linha.
   - Se não houver nenhuma fundamentação ativa, mensagem centralizada: **"Lista sem informação.
     Clique em Salvar para confirmar a operação."** (com "Salvar" em negrito).
   - Botão de ícone quadrado (`ef-icon-btn`, ícone `add`) abaixo da lista, para adicionar uma
     nova linha vazia.
3. Rodapé fixo (`app-salvar` customContent): "Cancelar" / "Salvar".

### Todo campo/dado exibido

| Campo (label) | Tipo de exibição | Valor/Fallback | Condição |
|---|---|---|---|
| Lista de fundamentações legais | Título de subseção (não é campo) | — | — |
| (uma textarea por item, placeholder "Fundamentação legal") | `app-textarea-field` | texto livre, valor inicial = `descricao` da fundamentação | `*ngFor` sobre `fundamentacoesAtivas` (só as com `ativo === true`) |
| Mensagem de lista vazia | Texto centralizado | "Lista sem informação. Clique em **Salvar** para confirmar a operação." | exibida quando `fundamentacoesAtivas.length === 0` |

### Todo elemento interativo
- Botão de voltar.
- **Botão de ícone "remove"** (um por linha) — não deleta de fato a linha da tela imediatamente;
  marca `fundamentacao.ativo = false` internamente, o que a remove da lista visível (`*ngFor`
  filtra por `ativo`) — a exclusão real só é persistida quando o usuário clica em "Salvar".
- **Botão de ícone "add"** — cria uma nova fundamentação em memória com hash temporário
  (`nova-{{contador}}`), `descricao` vazia, `ativo: true`, `novo: true`, e adiciona uma nova
  textarea vazia à lista.
- **Botão "Cancelar"** (rodapé) — volta ao hub sem persistir nenhuma alteração (inclusive
  remoções/adições feitas em memória).
- **Botão "Salvar"** (rodapé) — ao salvar, filtra fora as linhas novas com descrição vazia
  (`f.descricao.trim() !== "" || !f.novo`) antes de enviar ao backend; mostra notificação
  "Fundamentações legais salvas com sucesso." e volta ao hub.

### Estados
- **Sem dados de origem:** se não houver `rede` no `RouteStateService`, `voltar()` é chamado
  imediatamente.
- **Loading inicial:** o `form` (FormGroup vazio) é criado antes da chamada
  `getFundamentacoesLegais`; os controles dinâmicos (um `FormControl` por fundamentação) só são
  adicionados quando a resposta chega — não há indicador visual de loading nesse intervalo.
- **Vazio:** mensagem dedicada "Lista sem informação. Clique em Salvar para confirmar a operação."
  quando não há nenhuma fundamentação ativa (seja porque a rede não tem nenhuma, seja porque o
  usuário removeu todas em memória).
- **Salvando:** botões "Cancelar" e "Salvar" desabilitados; label do "Salvar" muda para
  "Salvando...".
- **Erro:** sem tratamento explícito.

### Componentes compartilhados usados
`app-textarea-field`, `app-salvar`, `app-button`. Não usa `app-checkbox` nem `app-radio-field`
(é a única tela de edição sem nenhum controle boolean/opção).

### Navegação
- **Chegada:** botão "Editar fundamentações legais" no hub (abaixo da lista de fundamentações).
- **Saída:** botão de voltar, "Cancelar" ou "Salvar" → `/documentacao-pedagogica/configuracoes`.

---

## Visão geral da navegação (árvore de rotas)

```
/documentacao-pedagogica                              (shell: título + abas Alunos/Turmas/Configurações)
└── /documentacao-pedagogica/configuracoes             ── Hub (tela 1) ──────────────────────┐
    ├── /rede/editar/geral                             ── Editar Config. Gerais (tela 2)      │
    ├── /rede/editar/historico                         ── Editar Histórico Escolar (tela 3)    │
    ├── /rede/editar/ficha                             ── Editar Ficha Individual (tela 4)     │
    ├── /rede/editar/ata                               ── Editar Ata de Resultados (tela 5)    │
    ├── /rede/editar/livro-matricula                   ── Editar Livro de Matrícula (tela 6)   │
    ├── /rede/editar/certificado-conclusao              ── Editar Certificado Conclusão (tela 7)│
    ├── /escola/:hashEscola/editar                      ── Editar Escola (tela 8)               │
    └── /fundamentacao-legal/editar                     ── Editar Fundamentações Legais (tela 9)│
                                                                                                  │
    (todas as 8 telas de edição voltam para o hub) ◄────────────────────────────────────────────┘
```

Todas as navegações entre hub → edição usam um `RouteStateService` (não query params nem
resolvers de rota) para transportar o objeto selecionado (rede, escola, ou rede+fundamentações)
de uma tela para a outra:
- `ConfiguracaoDocumentacaoPedagogicaRede` → usado pelas 6 telas de edição de rede.
- `ConfiguracaoDocumentacaoPedagogicaEscola` → usado pela tela de edição de escola.
- `ConfiguracaoDocumentacaoPedagogicaFundamentacao` → usado pela tela de edição de fundamentações.

Se uma tela de edição for aberta sem esse estado disponível (ex.: refresh da página, acesso
direto por URL), todas elas fazem `voltar()` automaticamente para o hub — não existe uma tela de
"não encontrado" ou carregamento próprio a partir da URL.

---

## Padrões visuais repetidos

1. **Estrutura de página de edição idêntica em todas as 8 telas:**
   - Barra `ef-nav` no topo: botão de voltar (ícone `chevron_left`, sem borda/fundo) + título no
     formato `"Editar {{o quê}} | {{descrição da rede/escola}}"` (ou `"—"` em vez de `"|"` nas
     telas de escola e fundamentação legal — pequena inconsistência de pontuação entre telas).
   - Corpo do formulário (`ef-form`) com `max-width: 700px` e campos empilhados verticalmente.
   - Rodapé **fixo** via `app-salvar[customContent=true]`, sempre com um `<div style="flex:1">`
     seguido de dois botões: **"Cancelar"** (`button-secundary no-borders`) e **"Salvar"**
     (`button-primary colored`, label vira "Salvando..." durante o loading). Esse rodapé é
     idêntico byte-a-byte nas 8 telas (mesma marcação, muda só o `testId`).

2. **Padrão de campo booleano simples:** `app-checkbox` + `<label>` de texto ao lado, dentro de
   um `<div class="ef-field-group ef-checkbox-row">` (linha horizontal). Usado dezenas de vezes
   em todas as telas de edição de rede/escola.

3. **Padrão de campo com 2 opções mutuamente exclusivas:** ao invés de reaproveitar o mesmo
   checkbox, o código usa `app-radio-field` com exatamente 2 opções (ex.: Sim/Não, Ocultar/
   Exibir, Centro/Esquerda) — sempre com um `<label class="control-label">` acima do grupo. Esse
   padrão se repete ~20 vezes ao longo das 8 telas de edição.

4. **Padrão de campo "principal + detalhe condicional":** um checkbox ou radio "mestre" que
   revela (via `*ngIf`) e frequentemente também habilita/desabilita (via `valueChanges` +
   `enable()/disable()`) um campo secundário — visto em: Histórico (critérios de avaliação,
   certificado de conclusão), Escola (cabeçalho em 2 níveis, cada uma das 4 assinaturas). Em
   alguns casos o campo secundário some da tela (`*ngIf`); em outros ele permanece visível mas
   fica com aparência de "desabilitado" (é o caso das 4 textareas de assinatura na tela de
   Escola, que nunca são removidas do DOM, só habilitadas/desabilitadas).

5. **Textareas sem label formal:** em pelo menos 4 lugares (Ata → Complemento, Certificado →
   Lei/termos, Certificado → Complemento, Histórico → critérios de avaliação tem label mas as
   outras não) o único texto identificador do campo é o `placeholder` da textarea — não há
   `<label>` visível acima.

6. **Hub (modo leitura) segue um padrão consistente de "label em negrito + valor em parágrafo
   normal"** (`<div class="cdp-field"><label>...</label><p>...</p></div>`), repetido para todos
   os ~50 campos somados nas 6 seções do accordion. Campos booleanos sempre viram texto "Sim" ou
   "Não"; campos com mais de 2 estados usam funções auxiliares (`getTipoNumeroMatriculaASerExibido`,
   `getPosicaoPorBrasao`, `getMoldura`) ou expressões ternárias encadeadas diretamente no template.

7. **Fallback textual para campos vazios/opcionais:** cada campo de texto longo tem sua própria
   frase de fallback, sem padronização entre si: "Sem critérios de avaliação" (histórico —
   também reaproveitada, aparentemente por engano, no campo de lei/termos do certificado),
   "Não existem complementos para serem exibidos." (ata e certificado).

8. **Accordion do hub é exclusivo** (só uma seção aberta por vez) e é resetado (fechado) sempre
   que a rede selecionada muda.

9. **Toda ação de "Salvar" bem-sucedida dispara uma notificação de sucesso via
   `NotificationService`** com uma frase no padrão "{{Nome da seção}} salvas/salvo com sucesso."
   e, em 7 das 8 telas, retorna automaticamente ao hub. A única exceção é o botão "Salvar dados"
   do card de Dados da Unidade na tela de Escola, que salva e permanece na mesma tela.

10. **Nenhuma tela (hub ou edição) implementa estados de erro visíveis.** Todas as chamadas HTTP
    usam `.subscribe(() => {...})` com apenas o callback de sucesso — uma falha de rede deixa o
    botão "Salvando..." travado ou simplesmente não reage.

11. **Nenhuma validação de formulário é declarada nos controles** (sem `Validators.required`,
    sem mensagens de erro) em nenhuma das 8 telas de edição — os botões "Salvar" nunca ficam
    desabilitados por causa de conteúdo inválido, só por causa do estado `loading`.

12. **Ícone de voltar sem rótulo textual** (`chevron_left`, sozinho, sem "Voltar" escrito) é
    idêntico nas 8 telas de edição — o único texto ao lado é o título da própria página.

---

## Componentes compartilhados — referência rápida (comportamento observado no código)

- **`app-titulo-page`** — cabeçalho de página com título simples (usado 1x no hub, 1x no shell
  do módulo).
- **`app-loading`** — bloco com 3 pontos animados + texto (mensagem configurável, default
  aparenta ser "Carregando..."); usado apenas no hub.
- **`single-select`** (seletor: `single-select`, componente `SelectFieldComponent`) — dropdown
  com campo de busca embutido, lista de opções com scroll virtualizado, botão de limpar seleção
  (`×`) quando algo está selecionado, placeholder customizável, estado de "pending" (loader),
  mensagens para "nenhuma opção encontrada"/"nenhuma opção disponível". Usado no hub (seleção de
  rede) e na tela de Histórico (seleção de tipo de certificado).
- **`app-radio-field`** — grupo de radio buttons simples renderizado a partir de uma lista de
  `{hash, descricao}`; sem estado de erro visível no template.
- **`app-checkbox`** — botão customizado (não é um `<input type=checkbox>` nativo) com estados
  visuais: ligado (marca de check), desligado, indeterminado (traço), loading (spinner), e
  desabilitado (`checkbox-container--disabled`).
- **`app-textarea-field`** — textarea com contador de caracteres no rodapé (`"N caracteres"` ou
  `"N/max caracteres"`), aviso quando perto do limite, e mensagem de erro condicional (não usada
  ativamente nestas telas, já que não há `Validators`).
- **`text-field`** — input de texto simples, com suporte a ícone opcional e texto de ajuda
  (`helperText`), nenhum dos quais é usado nestas telas.
- **`app-salvar`** — barra de rodapé fixa; quando usada com `[customContent]="true"`, apenas
  serve de container estilizado para o conteúdo projetado (`<ng-content>`), sem lógica própria de
  salvar — são os `app-button` internos que disparam `voltar()`/`salvar()` diretamente no
  componente da página.
- **`app-button`** — botão com variantes de classe combinadas via `classButton`, ex.:
  `button-secundary` (usado nos botões "Editar" do hub), `button-secundary no-borders`
  (Cancelar), `button-primary colored` (Salvar/ação principal). Os botões de ícone "add"/"remove"
  da tela de Fundamentações Legais **não** usam `app-button` — são `<button class="ef-icon-btn">`
  nativos, estilizados localmente naquele componente.
