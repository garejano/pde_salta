# Card 1 — Configurações

> Ver [`../readme.md`](../readme.md) e [`../frontend.md`](../frontend.md) para contexto geral.

## ⚠️ Refactor de schema concluído (2026-10-23) — descrição abaixo desatualizada

O schema descrito logo abaixo (`ConfiguracaoRedeDocumentacaoPedagogica` com colunas por documento +
`ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica` separada + `ConfiguracaoEscolaDocumentacaoPedagogica`
compartilhada) **foi substituído** por um modelo normalizado: tabela `TipoDocumentoDocPed` (lookup) +
tabelas cruzadas `RedeDocumentoConfiguracao` e `EscolaDocumentoConfiguracao` (Rede/Escola ×
TipoDocumento, config em JSON). Backend, frontend e testes já reescritos contra o novo desenho — ver
`../backend.md`, seção "Implementação (2026-10-23) — concluída", para o detalhe completo (arquivos
tocados, achados durante a implementação, scripts SQL ainda não executados). **O restante deste card,
abaixo, descreve o estado anterior ao refactor** (schema/endpoints/contrato antigos) — mantido como
histórico, não reflete mais o código atual.

## Status: frontend + backend implementados, plugado, schema + dado rodados

Tudo em `estrutura-pedagogica`, branch `projetos/MigracaoDocPed`.

- **Frontend**: `frontend/src/app/features/documentacao-pedagogica/configuracoes/` — hub
  read-only (seleção de rede, accordion Geral/Histórico/Ficha/Ata/Livro/Certificado, lista de
  escolas e fundamentações) + 6 telas de edição de rede + edição de escola + edição de
  fundamentação legal.
  - **Plugado no backend real**: `getRedes()`, `getConfiguracaoRede()` (hub), `getEscolasPorRede()`
    (lista "Escolas da rede"), `getEscolaPorHash()`, `getAnosLetivos()`, `updateConfiguracaoEscola()`,
    `updateConfiguracaoEscolaAnoLetivo()`, `getFundamentacoesLegais()`, `updateFundamentacoesLegais()`
    e, desde 2026-09-09, `updateHistorico/updateFicha/updateAta/updateLivroMatricula/
    updateCertificadoConclusao` (aba "Configurações da Rede" → grid de documentos) e
    `updateGeral()` + `updateSeriesNomenclatura()` (painel "Geral"). **Todas as telas de edição
    da feature agora fazem POST real — nada mais mockado, exceto o item abaixo.**
  - **Bug encontrado e corrigido junto (2026-09-09)**: usuário reportou "editar qualquer
    documento em Configurações da Rede, o save não dispara chamada" — na prática as 5 telas de
    documento estavam 100% mockadas (`ConfiguracaoRedeService.updateHistorico/Ficha/Ata/
    LivroMatricula/CertificadoConclusao` todos `of(true)`), sem request nenhuma. Wiring feito
    seguindo o mesmo padrão de escola/fundamentação. No processo, achado um segundo bug
    específico do Histórico: o campo "Tipo de certificado" é hash-driven no formulário
    (single-select), mas o backend **não tem tabela de lookup própria** — persiste pelo NOME
    (`NomeTipoCertificadoConclusao`, string), não pelo hash (`HashTipoCertificadoConclusao` do
    response vem sempre `null`, documentado assim no próprio DTO). O componente mandava o campo
    errado (`hashTipoCertificadoConclusao`, que o backend ignora silenciosamente) e nunca resolvia
    o hash de volta a partir do nome ao reabrir — ou seja, mesmo com o save funcionando, o tipo de
    certificado nunca persistia e o seletor sempre abria vazio. Corrigido dos dois lados
    (`construirFormularioHistorico`/`salvarHistorico` em `rede-documentos-tab.component.ts`,
    resolvendo hash↔nome contra `tiposCertificado`). Coberto pelo e2e já existente
    (`rede-documentos.spec.ts`, linha do `placeholder` do select) — só precisava do fix pra passar.
  - **`updateGeral()` plugado (2026-09-09)**: `geral.component.ts` agora salva com `forkJoin`
    de DUAS chamadas — `updateGeral()` (as 4 flags booleanas) e `updateSeriesNomenclatura()`
    (nomenclatura por série, endpoint próprio `POST rede/series-nomenclatura` /
    `SalvarSeriesNomenclaturaService`, já existia no backend, testado). Precisava das duas juntas
    porque `ConfiguracaoRedeGeralSaveRequest` não carrega `seriesNomenclatura` — plugar só
    `updateGeral()` faria a edição de nomenclatura parecer salva (toast de sucesso) mas continuar
    se perdendo silenciosamente, mesma classe do bug do tipo-certificado do Histórico. O
    `FormArray` de nomenclatura não guarda `hashSerie` (campo não editável) — o save zipa por
    índice com a lista original (`rede.seriesNomenclatura`), que tem mesmo tamanho/ordem (a tela
    não permite adicionar/remover série). Mock de rota (`rede/geral` e `rede/series-nomenclatura`)
    e assertion de payload adicionados em `geral.spec.ts`/`mocks.ts`.
  - **Ainda mockado** (não existe endpoint no backend): `getTiposCertificadoConclusao()` — sem
    tabela de lookup própria pra "tipos de certificado" ainda, mock legítimo, não é bug.
- **Backend**: `backend/Scripts/documentacao-pedagogica-configuracoes-schema.sql` (5 tabelas:
  `ConfiguracaoRedeDocumentacaoPedagogica`, `ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica`,
  `ConfiguracaoRedeSerieNomenclatura`, `ConfiguracaoEscolaDocumentacaoPedagogica`,
  `FundamentacaoLegal` — **rodado**) + C# completo em
  `ConfiguracaoDocumentacaoPedagogicaController.cs` e
  `Domain.Services/DocumentacaoPedagogica/{ConfiguracaoRede,ConfiguracaoEscola,FundamentacaoLegal}/`
  + `IListarEscolasDocPedService` (novo, "Escolas da rede" — ver `backend.md` pro critério de
  filtro replicado do doc-ped e o bug de `AgrupamentoId` nulo corrigido).
- **Dado**: seed gerado a partir de CSVs do doc-ped (`gen_seed.py`) e **rodado com sucesso** —
  `documentacao-pedagogica-configuracoes-seed-dados.sql` (rede, certificado, série-nomenclatura,
  fundamentação legal) populado.
- **Pendente**: upload de brasão/imagem para o preview do Certificado (`ConfiguracaoPreviewService`
  do doc-ped original) não foi implementado — telas atuais assumem imagens já cadastradas;
  endpoint de "tipos de certificado de conclusão" (`getTiposCertificadoConclusao()`) não existe
  no backend, segue mockado.
- **UX: formulários bloqueados durante o save (2026-09-09)** — os 4 formulários de edição
  (Escola + Ano Letivo, Histórico/Ficha/Ata/Livro/Certificado, Geral, Fundamentação Legal)
  impedem o usuário de alterar campos com uma requisição em voo.
  - **1ª tentativa (revertida)**: `form.disable()`/`form.enable()` no início/fim do `salvar()`.
    Funcionava, mas deixava a tela "lagada" — desabilitar cada control individualmente (N campos
    de texto/select/radio) recalcula validade/estado do form inteiro de uma vez, perceptível
    como travamento momentâneo. Também exigia reaplicar toggles condicionais par-a-par depois de
    reabilitar (senão `enable()` reabilitava campos que um toggle desligado devia manter
    desabilitados — ex.: `cabecalho` com `possuiCabecalho` = false).
  - **Versão final**: bloqueio via CSS puro — classe `.cdp-form-bloqueado` (`pointer-events: none`
    + `opacity: 0.6`) no container do form, ligada por `[class.cdp-form-bloqueado]="salvando"`.
    Sem tocar no estado do `FormGroup`, então não recalcula nada — e não precisa de lógica de
    restauração de campos condicionais (removida). `pointer-events: none` só bloqueia mouse, não
    teclado — complementado com `(document.activeElement as HTMLElement)?.blur?.()` logo no
    início do `salvar()`, tirando o foco do campo atual. No editor de Fundamentação Legal, os
    botões de adicionar/remover linha continuam com `[disabled]="salvando"` à parte (mais barato
    que depender só do CSS pra 2 botões). O seletor de ano letivo em "Dados da unidade"
    (`app-checkmark-dropdown`) não precisou de tratamento especial — fica dentro do container que
    leva `.cdp-form-bloqueado`.

### UX: Cancelar volta pra lista (2026-09-09)

Em "Escolas da Rede" e "Configurações da Rede" (grid de documentos), `cancelarEdicao()` só
resetava os campos e continuava na mesma tela de detalhe/formulário — agora tem a mesma ação do
botão "Voltar às escolas"/"Voltar aos documentos": fecha a edição (descartando qualquer alteração
não salva) e volta pro grid. `escolas-tab.component.ts` chama `fecharEscola()`,
`rede-documentos-tab.component.ts` chama `fecharDocumento()`, em vez de remontar o formulário com
os valores originais. `geral.component.ts` e `fundamentacao-legal-editor.component.ts` já tinham
esse comportamento (Cancelar já volta pro modo leitura/lista neles), não precisaram de mudança.
Os dois testes e2e que verificavam o comportamento antigo ("cancelar restaura os valores e
continua na tela") foram reescritos pra verificar o novo (volta pro grid + reabrir confirma que a
edição não sobreviveu).

### Análise de performance geral — 2026-09-09

Usuário reportou que, mesmo depois do fix do save, a tela de Configurações em geral "parece
travada". Investigação (sem alterar nada que já funciona — só o que segue foi de fato aplicado):

**Causa raiz mais provável (não corrigida — decisão consciente, ver abaixo)**: os componentes
compartilhados de campo (`shared/dynamic-components/{text-field,textarea-field,checkbox,
radio-field,date-field}`, usados em TODOS os formulários desta feature) **não têm
`ChangeDetectionStrategy.OnPush`** — são todos `standalone: false` com estratégia padrão
(`Default`). Isso significa que qualquer evento em qualquer lugar da página (digitar em UM campo)
força o Angular a reavaliar TODOS os componentes desses tipos renderizados na tela, não só o que
está sendo editado — em telas com 7–13 campos abertos ao mesmo tempo (ex.: "Cabeçalho e
assinaturas" ou "Histórico"), digitar um caractere força recheck de todos os outros 6–12 campos
junto. É a explicação mais plausível pra sensação de "trava" ao digitar/interagir.
**Não corrigido nesta rodada**: são componentes `shared/`, usados em TODA a aplicação (não só
Configurações) — mudar a estratégia de CD deles tem raio de impacto muito maior do que consigo
validar sem rodar/testar todas as outras telas que os usam. Fica registrado como recomendação de
maior impacto, pendente de decisão/validação à parte (idealmente com teste manual amplo antes).

**Corrigido nesta rodada** (escopo 100% dentro dos arquivos desta feature, baixo risco):
- `escolas-tab.component.ts`: `anoLetivoOptions` era um **getter** que recriava um array novo
  (`.map(...)`) a cada change detection do componente — como esse array vai pro `[options]` do
  `app-checkmark-dropdown` (que reage a mudança de referência via `ngOnChanges`), cada digitação
  em QUALQUER campo da tela recriava o array e disparava o `ngOnChanges` do dropdown à toa, mesmo
  sem `escolaAnoLetivos` ter mudado de fato. Virou um campo comum (`anoLetivoOptions`), recalculado
  só nos 4 pontos onde `escolaAnoLetivos` realmente muda (via `definirEscolaAnoLetivos()`).
- `fundamentacao-legal-editor.component.ts`: mesmo padrão — `fundamentacoesAtivas` era um getter
  com `.filter(ativo)` recriando array a cada check, alimentando um `*ngFor` sem `trackBy`. Virou
  campo comum, recalculado só em `ngOnInit`/`adicionarLinha`/`removerLinha` (onde a lista de fato
  muda), e adicionado `trackBy: trackByHash` no `*ngFor` (evita o differ recriar linhas do DOM à
  toa mesmo quando a lista referencial muda mas os itens são os mesmos).
- Revisados os demais getters da feature (`redesOptions`, `seriesNomenclatura`, `podeSalvar`,
  `documentoAtual`) — nenhum recria array/objeto novo a cada chamada, não precisam do mesmo
  tratamento.

### Testes automatizados — 2026-09-09

- **Backend**: cobertura de integração criada do zero para toda a feature (nenhum teste existia
  antes) — 147 testes em `EstruturaPedagogica.Test/Integration/Scenarios/{ConfiguracaoEscola,
  ConfiguracaoRede,EscolaAnoLetivo,FundamentacaoLegal,HistoricoAluno,TurmaDocumento}/`. No processo,
  4 bugs reais de produção foram encontrados e **corrigidos** (reativação de Fundamentação Legal
  quebrada, linha órfã em `SalvarSeriesNomenclaturaService`, `NullReferenceException` em
  `SalvarHistoricoFundamentacaoService`, validação morta em `SalvarHistoricoSerieService`) — detalhe
  completo em [`cards/transfe_doc_repo/bugs_testes_documentacao_pedagogica_backend.md`](../../../cards/transfe_doc_repo/bugs_testes_documentacao_pedagogica_backend.md).
  Suíte completa do repositório (4398 testes) passando, sem regressão.
- **Frontend (E2E)**: 17 testes Playwright criados para a aba de Configurações em
  `frontend/tests/e2e/documentacao-pedagogica/configuracoes/` (`hub`, `geral`, `rede-documentos`,
  `escolas`, `fundamentacao-legal`). Cobrem seleção/troca de rede, os 3 fluxos de edição inline
  (Geral, os 6 documentos da Rede, Escola + Ano Letivo, Fundamentação Legal), estados vazios,
  cancelar e erro de backend (nos 3 pontos que já são chamada real: escola, ano-letivo,
  fundamentação legal). **Ainda não executados de fato** — o setup de autenticação E2E
  (`auth.setup.ts`) deu timeout no ambiente local; só a compilação/listagem dos specs foi validada
  (`npx playwright test --list`, 17/17 ok). Rodar `npm run test:e2e:auth` e depois
  `npx playwright test tests/e2e/documentacao-pedagogica` quando o ambiente estiver disponível.

### Análise de performance/memory leak — 2026-09-09

Auditoria dos 6 componentes do fluxo (hub, geral, rede-documentos-tab, escolas-tab,
fundamentacao-legal-tab/editor) — nenhum vazamento de RxJS encontrado (o padrão "Subject de
kill + `takeUntil` + `takeUntilDestroyed`" está aplicado de forma consistente), mas **achado um
bug real e severo, não relacionado a memória**: as duas assinaturas RxJS de longa duração do fluxo
(seletor de rede do hub, abertura de escola) usam `switchMap` sem `catchError` interno — um único
erro de rede transitório mata a assinatura para sempre, e selecionar outra rede/escola depois disso
não faz mais nada até recarregar a página (reproduzível hoje, já que os endpoints envolvidos são
reais). Detalhe completo, com o `catchError` já escrito pronto pra aplicar, em
[`cards/transfe_doc_repo/analise_performance_memory_configuracoes_frontend.md`](../../../cards/transfe_doc_repo/analise_performance_memory_configuracoes_frontend.md).
Ainda não corrigido — só analisado.

## Objetivo

Migrar as telas de configuração que servem de base para as demais áreas: seleção/config de
Rede, config de Escola e Fundamentação Legal. Sem essas telas, as demais (Histórico, Turma,
Documentos) não têm de onde ler as opções de rede/escola.

## Telas de origem (`documentacao-pedagogica/frontend`)

- `ConfiguracaoComponent` (`app-configuracao`) — hub que lista Redes/Escolas para selecionar.
- `ConfiguracaoRedeComponent` (`app-configuracao-rede`) — hub de abas por rede:
  - `ConfiguracaoRedeGeralComponent` — dados gerais (nomenclatura de séries, exibição de nota,
    status "aprovado pelo conselho" etc.)
  - `ConfiguracaoRedeHistoricoComponent` — config de impressão do Histórico
  - `ConfiguracaoRedeFichaComponent` — config de impressão da Ficha Individual
  - `ConfiguracaoRedeAtaComponent` — config de impressão da Ata de Resultados Finais
  - `ConfiguracaoRedeCertificadoConclusaoComponent` — config do Certificado de Conclusão (com
    preview via `ConfiguracaoPreviewService`)
  - `ConfiguracaoRedeLivroMatriculasComponent` — config do Livro de Matrícula
- `ConfiguracaoEscolaComponent` (`app-configuracao-escola`) — config por escola/ano letivo.
- `ConfiguracaoFundamentacaoLegalComponent` — lista/edição de fundamentações legais por rede
  (`ListaFundamentacaoLegalComponent`).

Modelos principais: `ConfiguracaoRede`, `ConfiguracaoRedeResponse`, `ConfiguracaoEscolaResponse`,
`ConfiguracaoFundamentacaoLegal`, `ConfiguracoesSelecionadas` (usado no preview de brasão/moldura
dos documentos).

## Estratégia de mock

- Um `mocks/configuracoes.mock.ts` com: lista de redes, uma `ConfiguracaoRedeResponse`completa
  (todas as abas), uma `ConfiguracaoEscolaResponse`, uma lista de `FundamentacaoLegal`.
- Services (`ConfiguracaoRedeService` novo, ou reaproveitar padrão de outro service já existente
  em `estrutura-pedagogica`) retornam `of(MOCK_X)`.

## Dependências

- Nenhuma — é o ponto de partida.
- Alimenta os filtros usados pelos cards 2 e 3 (rede/escola selecionada).

## Pontos de atenção

- `ConfiguracaoPreviewService` (preview de brasão/moldura ao configurar Certificado) usa upload
  de imagem (`getCaminhosBrasoesByRede`) — checar se há um padrão de upload de arquivo já usado
  em `estrutura-pedagogica` antes de recriar.
- Muitas dessas configs (histórico, ficha, ata, certificado, livro) são, na prática, "flags de
  exibição" que os documentos do card 3 consomem — vale desenhar o modelo de dados junto com o
  card 3 para não duplicar tipos.

## "Dados da unidade" (Escola) por Ano Letivo — IMPLEMENTADO (2026-09-09)

Feature completa: backend (tabela + services + endpoints), frontend (seletor de ano + save
por ano) e testes (unit backend + e2e). Ver plano original em
`C:\Users\gustavo.arejano\.claude\plans\memoized-juggling-sky.md` pro racional completo da
decisão de design (abaixo, resumido).

**Decisão de design (diferente do doc-ped original) — atualizada em 2026-09-09**: `Cidade`
**é editável**, mas ao contrário do doc-ped (que grava em `Escola.Cidade`, campo nativo
compartilhado, como side-effect do save), aqui ela vive **só na tabela nova**
`DocumentacaoPedagogica.EscolaAnoLetivoDocumentacaoPedagogica` — coluna própria, sem nenhum
efeito na `Escola` nativa. Resolve o motivo original da exclusão (não abrir o primeiro ponto de
escrita em `Escola.NomeCidade`) sem abrir mão do campo: a diferença de comportamento agora é
"Cidade também varia por ano letivo, de verdade" (mais correto que o doc-ped, que tratava como
"independe do ano" mas editava junto de qualquer forma). O cabeçalho da escola continua mostrando
`Escola.NomeCidade` (nativo, só-leitura) — os dois "cidade" agora coexistem com fontes diferentes,
o que é esperado.

### Comparação de campos com o doc-ped original (2026-09-09)

Fonte: `documentacao-pedagogica/backend/DocumentacaoPedagogica.Domain/Entities/EscolaAnoLetivo.cs`
+ `.../DTO/EscolaAnoLetivo/{EscolaAnoLetivoGetResponse,EscolaAnoLetivoUpdateRequest}.cs` +
`frontend/src/app/configuracao-escola/configuracao-escola.component.ts`.

| Campo | doc-ped | estrutura-pedagogica | Situação |
|---|---|---|---|
| `nomeOficial` | sim, `required` | sim | ok (falta `required`) |
| `endereco` | sim, `required` | sim | ok (falta `required`) |
| `bairro` | sim, `required` | sim | ok (falta `required`) |
| `cep` | sim, `required` | sim | ok (falta `required`) |
| `telefone` | sim, `required` | sim | ok (falta `required`) |
| `cnpj` | sim, `required` | sim | ok (falta `required`) |
| `dataConclusao` | sim, `required`, com min/max calculado por ano | sim, texto livre | ok, validação de data **não portada** (já registrado como fora de escopo) |
| `cidade` | sim, `required`, grava em `Escola.Cidade` como side-effect | **sim** (adicionado 2026-09-09), grava só na tabela nova, sem side-effect | ok — comportamento deliberadamente diferente (mais isolado que o original) |
| `nomeAlterado`/`cnpjAlterado`/`telefoneAlterado`/`enderecoAlterado`/`bairroAlterado`/`cepAlterado` | existem só na entidade (`EscolaAnoLetivo.cs`), **nunca expostos via API** (fora de `Get`/`UpdateRequest`) | não existem | não é gap — nem o doc-ped original expõe isso pra fora do backend |

**Todos os 8 campos editáveis do doc-ped original estão presentes em `estrutura-pedagogica`.**
Duas diferenças de comportamento encontradas, nenhuma bloqueante:

1. **Validação `required` não foi portada** — no doc-ped, os 8 campos do formulário (incluindo
   Cidade) são obrigatórios (`Validators.required`); hoje em `estrutura-pedagogica` nenhum campo
   de "Dados da unidade" tem validação (`escolaAnoLetivoForm` monta os controles sem
   `Validators`) — dá pra salvar com tudo em branco. Não foi decisão registrada em lugar nenhum,
   parece só ter ficado de fora. Considerar se vale adicionar.
2. **`dataConclusao` sem default nem min/max** — doc-ped calcula um default (`{ano}-12-30`)
   quando ainda não há valor salvo, e limita o date-picker entre 1º de janeiro do ano escolhido e
   o mesmo dia do ano seguinte (`defineDataConclusao()`). Em `estrutura-pedagogica` é campo de
   texto livre, sem default nem limite — já registrado abaixo como decisão deliberada ("fora de
   escopo"), mantém-se válido.

**Nota pra Card 3 (Turma e Documentos)**: o doc-ped consome esses mesmos 7 campos via
`EscolaAnoLetivoHistoricoResponse` pra montar o cabeçalho impresso do Histórico Escolar — quando
o Card 3 migrar essa tela, vai precisar ler da mesma tabela nova
(`DocumentacaoPedagogica.EscolaAnoLetivoDocumentacaoPedagogica`) em vez de duplicar o dado.

### Backend — completo e testado

- Tabela `DocumentacaoPedagogica.EscolaAnoLetivoDocumentacaoPedagogica` (script
  `backend/Scripts/documentacao-pedagogica-escola-ano-letivo-schema.sql`, **já rodado em
  homolog** — confirmado via `INFORMATION_SCHEMA.TABLES`) — 1 linha por `TOTVS.EscolaAnoLetivo`
  (via FK `EscolaAnoLetivoId UNIQUE`), find-or-create (só nasce no 1º save daquele ano; tabela
  está com **0 linhas** hoje, esperado — nenhum save real feito ainda). Coluna `Cidade` adicionada
  depois via `backend/Scripts/documentacao-pedagogica-escola-ano-letivo-adicionar-cidade.sql`
  (`ALTER TABLE`, **ainda não rodado em homolog** — precisa rodar antes do próximo deploy).
- Entidade + Map (`EscolaAnoLetivoDocumentacaoPedagogica.cs` / Map correspondente), repositório
  thin (`IEscolaAnoLetivoDocumentacaoPedagogicaRepository`), método novo no repositório nativo
  `IEscolaAnoLetivoRepository.GetParaListagemDocPed(escolaId)` (lista ordenada por ano desc).
- Services `ListarEscolaAnoLetivoDocPedService.Listar(hashEscola)` (native list + left-join dos
  dados extras) e `SalvarEscolaAnoLetivoDocPedService.Salvar(request)` (find-or-create). `Cidade`
  incluída nos dois — grava só nesta tabela, sem side-effect em `Escola.NomeCidade` (testado
  explicitamente: `Salvar_NovaConfiguracao_InsereERetornaTrue` agora também confirma que
  `Escola.NomeCidade` fica inalterado depois do save).
- Endpoints em `ConfiguracaoDocumentacaoPedagogicaController`: `GET
  escola/{hashEscola}/anos-letivos` e `POST escola/ano-letivo`.
- **Testes**: `EstruturaPedagogica.Test/Integration/Scenarios/EscolaAnoLetivo/` — 8 testes
  (`Listar`: escola não encontrada, sem anos letivos, com/sem configuração ordenado desc;
  `Salvar`: escola/ano-letivo não encontrado, combinação inválida, insert novo, update
  existente). Fazem parte dos 147 testes de integração da feature (ver seção de testes acima).
  Fixture (`EscolaAnoLetivoDocumentacaoPedagogicaFixture`) e os dois testes de sucesso
  atualizados pra cobrir `Cidade`.

### Frontend — completo e testado

- `configuracao-escola.model.ts`: `EscolaAnoLetivoGetResponse`/`EscolaAnoLetivoSaveRequest` com
  `cidade`. `configuracao-escola.service.ts`: `getAnosLetivos`/`updateConfiguracaoEscolaAnoLetivo`
  chamando os endpoints reais (mock `MOCK_ESCOLA_ANOS_LETIVOS` removido, arquivo de mock inteiro
  apagado — ficou sem uso).
- `escolas-tab.component.ts`: guarda a lista inteira (`escolaAnoLetivos`), `escolaAnoLetivo`
  aponta pro selecionado (default = mais recente, já vem ordenado do backend).
  `selecionarAnoLetivo()` reidrata o form a partir da lista já carregada, **sem nova chamada à
  API** (mesma UX do doc-ped original). `salvar()` faz `forkJoin` das duas partes (escola +
  ano-letivo) e atualiza a entrada certa dentro do array (não só uma referência solta) pra não
  perder o save ao trocar de ano e voltar. Tem tratamento de erro explícito no subscribe
  (`error`/`next`) e `catchError` no switchMap de abertura de escola (erro de rede transitório
  não mata mais a assinatura pro resto da sessão — bug que a análise de performance de
  2026-09-09 apontava como não corrigido; **já foi corrigido depois**, tanto aqui quanto no
  seletor de rede do hub — a nota "Ainda não corrigido" nessa seção acima está desatualizada).
- Template: `single-select` ao lado do título "Dados da unidade" só quando há mais de 1 ano
  (`escolaAnoLetivos.length > 1`); rótulo fixo quando só há 1. Campo Cidade de volta no grid
  (logo após Bairro, mesma ordem do doc-ped), gravando na tabela nova em vez de `Escola.Cidade`.
- **E2E**: `frontend/tests/e2e/documentacao-pedagogica/configuracoes/escolas.spec.ts` cobre
  especificamente ano letivo — abre pré-preenchido com o ano mais recente, troca de ano sem
  nova chamada de rede (`chamadas.gets['anos-letivos-...']` fica em 1), salva as duas partes
  juntas com os hashes certos, e o caso de escola com um único ano (sem seletor). Faz parte dos
  17 specs Playwright da aba — **ainda não executados de fato** (timeout no setup de auth E2E
  local), só validados por `--list`.

### Fora de escopo (decisão registrada, não é esquecimento)

- Dado histórico: tabela nasce vazia, sem import de anos anteriores — cada ano só ganha dado
  quando alguém salvar por essa tela.
- Flags `*Alterado` do doc-ped original (dependiam do Sync/Barramento, não migrado).
- Validação de `dataConclusao` com min/max por ano (`defineDataConclusao()` no doc-ped) — campo
  segue como texto simples.

### O que falta pra dar por 100% concluído

1. **Rodar `documentacao-pedagogica-escola-ano-letivo-adicionar-cidade.sql` em homolog** — a
   coluna `Cidade` só existe no código/EF hoje, a tabela real ainda não tem essa coluna.
2. **Rodar os 17 testes E2E de fato** (não só `--list`) — depende de destravar o timeout do
   `auth.setup.ts` no ambiente local.
3. Validação manual/QA em homolog: abrir uma escola com `TOTVS.EscolaAnoLetivo` de verdade em
   mais de um ano, confirmar o seletor e um save real (tabela tem 0 linhas — nunca foi exercitada
   contra dado real, só contra fixtures de teste).
