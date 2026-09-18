# Card 2 — Histórico do Aluno

> Ver [`../readme.md`](../readme.md) e [`../frontend.md`](../frontend.md) para contexto geral.

## Status: frontend + backend implementados, plugado (parcial), schema rodado, dado em andamento

Tudo em `estrutura-pedagogica`, branch `projetos/MigracaoDocPed`.

- **Frontend**: `frontend/src/app/features/documentacao-pedagogica/alunos/` — listagem com
  filtro/busca, hub do aluno (informações, histórico por série, fundamentações, observações,
  registro de certificado) + 5 telas de edição. "Visualizar Ficha Individual" e "Certificado de
  Conclusão" navegam para as features dos Cards 3/existente, sem duplicar.
  - **Plugado no backend real**: filtro completo (anos letivos/redes/escolas/séries),
    `getAlunos()` (busca/listagem), `getAlunoByHash()` (hub — já traz séries e fundamentações),
    `HistoricoFundamentacaoService` (get + save), `HistoricoObservacoesService` (get + save),
    `RegistroCertificadoService` (get + save).
  - **Ainda mockado**: Histórico de Série (visualização já vem populada no hub, mas a tela de
    edição em si continua mock — `disableHistoricoSerie`), Editar Informações
    (`updateInformacoes`).
- **Backend**: `backend/Scripts/documentacao-pedagogica-historico-aluno-schema.sql` (6 tabelas:
  `Historico`, `HistoricoSerie`, `HistoricoFundamentacao`, `ResultadoFinal`,
  `TipoResultadoFinal`, `TipoComponenteCurricular` — **rodado**) + C# completo em
  `HistoricoAlunoController.cs` e `Domain.Services/DocumentacaoPedagogica/HistoricoAluno/` +
  `IListarAlunosDocPedService`/`IGetAlunoDocPedService`/filtros (novos, listagem + hub —
  não existiam antes; ver `backend.md`).
- **Correção feita depois da implementação inicial**: `Historico` referenciava o aluno por
  `UsuarioId`/`Usuario` (copiado literalmente do doc-ped) — corrigido para `PessoaId`/`Pessoa`
  nativa, que é a convenção real usada em todo o resto do `estrutura-pedagogica` para "o aluno".
- **Bug real corrigido ao plugar o frontend**: os 3 `Save*Request` do frontend
  (observações/registro de certificado/fundamentação) mandavam `hash`/`hashHistorico`, mas o
  backend sempre esperou `hashAluno` (hash da `Pessoa`) — e `HistoricoFundamentacoesResponse`
  tinha os campos `hash`/`hashFundamentacaoLegal` invertidos. Ver `backend.md`.
- **Dado**: escala real medida — 341.467 `Historico`, 1.194.967 `HistoricoSerie`, 20.441
  `HistoricoFundamentacao`. CSVs exportados, resolvidos com 100% de match (zero órfãos), scripts
  gerados (staging + resolve). `TipoResultadoFinal` (10 linhas) **já rodado**. O resto **ainda não
  rodou** — ver seção "Migração de dado histórico" em `../readme.md` pro passo a passo completo.
  `ResultadoFinal` (15,1 milhões de linhas — notas por disciplina) **adiado deliberadamente**
  (somente leitura no frontend hoje, sem edição implementada).
- **Fora de escopo, não implementado**:
  - **Editar Informações** (dados pessoais — nome/CPF/RG/nacionalidade/filiação): tela existe
    mockada no frontend, mas sem backend. Os campos já existem na tabela nativa `Pessoa`; editar
    isso precisa reaproveitar o caminho de edição de Pessoa já existente no sistema, não uma
    tabela paralela — precisa de investigação própria antes de implementar.
  - **Escola externa em cascata** (país → estado → município → cadastro): simplificado para um
    único campo "Escola" (select). `HistoricoSerie` tem `EscolaId` (nativa, nullable) +
    `NomeEscolaExterna` (texto livre), sem a cascata completa do doc-ped original.
  - **Edição disciplina por disciplina** do histórico de série: `ResultadoFinal` só tem `GET`
    (leitura), sem `Save`. A tela mostra a grade somente leitura, botão "Adicionar disciplina"
    desabilitado. Card próprio no Jira: EFC-6785.
  - **Mapeamento Tipo de Resultado × Rede**: `TipoResultadoFinal` ficou global (sem
    `TipoResultadoFinalRede`).

## Objetivo

Migrar a busca de alunos e o hub de edição do histórico de cada aluno: informações gerais,
fundamentação legal aplicada, séries cursadas, observações e registro de certificado.

## Telas de origem (`documentacao-pedagogica/frontend`)

- `AlunosComponent` (`app-alunos`) — busca/lista de alunos (via `FiltroSync` + `AlunoService`).
- `EditarAlunoComponent` (`app-editar-aluno`) — hub de navegação entre as sub-telas abaixo,
  carrega o aluno selecionado uma vez e distribui via `*SelecaoService` (padrão
  guarda-seleção-em-serviço usado em todo o doc-ped: `EditarInformacoesSelecaoService`,
  `EditarFundamentacaoSelecaoService`, `HistoricoSerieSelecaoService`, etc.)
- `EditarInformacoesComponent` — dados cadastrais/edição de informações do aluno.
- `EditarFundamentacaoAlunoComponent` — quais `FundamentacaoLegal` (card 1) se aplicam ao aluno.
- `HistoricoSerieComponent` — séries cursadas, resultado final por disciplina
  (`ListaDisciplinasComponent`, `ListaDisciplinasService`), carga horária.
- `HistoricoObservacoesComponent` — observações livres por ano letivo (fundamental/médio).
- `EditarRegistroCertificadoComponent` — número/folha/livro de registro do certificado.

## Estratégia de mock

- `mocks/historico-aluno.mock.ts`: um aluno completo (`AlunoResponse`) com séries
  (`HistoricoSerieResponse[]`), fundamentações (`HistoricoFundamentacoesResponse[]`),
  observações e registro de certificado preenchidos — para validar todas as sub-telas com o
  mesmo aluno.
- Lista de busca (`AlunosComponent`) com 5-10 alunos mockados cobrindo situações diferentes
  (ativo, transferido, etc. — ver enum `Status` em `Aluno`).

## Dependências

- Card 1 (Fundamentação Legal por rede precisa existir antes de vincular ao aluno).
- Aluno em si é entidade espelhada (`ExternalEntity`, ver `backend.md`) — no destino, resolve
  pelo Hash nativo de `estrutura-pedagogica`, não recria o cadastro do aluno.

## Pontos de atenção

- O padrão `*SelecaoService` (guarda seleção em memória para navegar entre sub-telas sem
  recarregar) é específico do Angular antigo (módulos, injeção via `providedIn: 'root'`) — em
  standalone components, avaliar se um `@Input()`/resolver de rota substitui isso de forma mais
  simples, em vez de portar o padrão como está.
- `ListaDisciplinasComponent`/`ListaDisciplinasService` é compartilhado entre Histórico de Série
  e a Ata de Resultados Finais (card 3) — desenhar uma vez só.
