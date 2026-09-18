# Card 3 — Turma & Geração de Documentos

> Ver [`../readme.md`](../readme.md) e [`../frontend.md`](../frontend.md) para contexto geral.

## Status: frontend + backend implementados; listagem, Ata e Livro de Matrícula plugados; Certificado adiado; schema rodado

Tudo em `estrutura-pedagogica`, branch `projetos/MigracaoDocPed`.

- **Frontend**: `frontend/src/app/features/documentacao-pedagogica/turmas/` — listagem de
  turmas com filtro, Ata de Resultados Finais e Livro de Matrícula via `document-builder`
  (overlay, CSV, edição de observação na Ata), Certificado de Conclusão novo (frente/verso, só
  aluno único mockado, só tabela padrão de disciplinas — sem agrupamento por área). Ficha
  Individual **não foi recriada** — botão de ação navega para `features/ficha-individual/`
  existente.
  - **Plugado no backend real**: filtro completo (anos letivos/redes/escolas/séries),
    `getTurmas()` (listagem), `getAtaResultadosFinais()`/`updateObservacaoAta()` e
    `getLivroMatricula()` — `FiltroTurmasService`/`TurmasService`. `mocks/turmas.mock.ts` foi
    removido (sem uso depois da troca).
  - **Ainda mockado, por decisão do usuário** (fica pra um card à parte): Certificado de
    Conclusão — `certificado-conclusao.component.ts` chama `service.get("mock")` fixo; não há
    hoje nenhuma UI pra selecionar um aluno da turma antes de gerar o certificado (o botão na
    listagem só navega pra rota, sem hash de aluno). O endpoint real
    (`GET certificado-conclusao/{hashAluno}`) já existe e já foi corrigido (filiação) nesta
    sessão — falta decidir a UX de seleção de aluno (single vs. lote, ver `frontend.md`) antes de
    plugar.
- **Backend**: `backend/Scripts/documentacao-pedagogica-turma-documentos-schema.sql` (1 tabela
  nova: `TurmaObservacaoAtaResultadosFinais` — **rodado**). Livro de Matrícula/Ata/Certificado
  são leitura agregada: roster nativo de turma (`IAlunoEscolaRepository`, `Pessoa`) + config do
  Card 1 + histórico do Card 2 (`Historico`/`HistoricoSerie`/`ResultadoFinal`, via `PessoaId`).
  C# em `TurmaDocumentoController.cs` e `Domain.Services/DocumentacaoPedagogica/TurmaDocumento/`.
  Reaproveitou `IAlunoEscolaRepository.GetAlunosPorTurmaAtivos`,
  `IEscolaRepository.GetCabecalhoDocumento`, e usou `GetDocumentoDiarioDeClasseService` (Diário
  de Classe, feature real) como referência de resolução turma→roster→documento. Precisou
  adicionar `ITurmaRepository.GetParaDocumento` e
  `IAlunoEscolaRepository.GetAlunosPorTurmaParaLivroMatricula` (métodos novos em repositórios
  nativos já existentes). Depois, adicionado `IListarTurmasDocPedService` +
  `ITurmaRepository.GetParaListagemDocPed` + os 4 endpoints de filtro (não existia nenhum
  endpoint de listagem de turma antes — ver `backend.md`).
  - **Assinaturas da Ata/Livro de Matrícula** (adicionado ao plugar o frontend): nem
    `GetAtaResultadosFinaisService` nem `GetLivroMatriculaService` resolviam Diretor(a)/
    Secretário(a)/Prof(a). Inspetor(a) pro bloco de assinatura do documento — o
    `document-builder` já esperava esses dados (`buildAtaBundle`/`buildLivroBundle`), só não
    tinham fonte real. A fonte é `ConfiguracaoEscolaDocumentacaoPedagogica` (Card 1, aba "Escolas
    da Rede" → "Cabeçalho e assinaturas") — os dois services agora buscam essa config por
    `EscolaId` e montam `Assinaturas: List<AssinaturaDocumentoResponse>` (novo DTO compartilhado
    em `Domain/DTO/Documentos/CabecalhoDocumentoResponse.cs`), só incluindo os signatários com a
    flag `Possui...` ativa. **Coordenador(a) ficou de fora**: a config guarda um nome por
    segmento (`AssinaturaCoordenadorEnsinoFundamental`/`Medio`) sob uma única flag
    `PossuiAssinaturaCoordenador`, e a Ata/Livro não carregam uma distinção de segmento
    inequívoca pra escolher qual nome usar — decisão de negócio pendente.
- **Campos nativos não localizados** (ficaram `null`, documentado no código): RG, Nacionalidade,
  Naturalidade, SexoEnum, Endereço (existem na tabela SQL `Pessoa` mas não na entidade EF atual),
  RA Digital, Código Inep do aluno, data de conclusão do certificado.
- **Pendente**: decidir e implementar a seleção de aluno pro Certificado de Conclusão antes de
  plugar (fica mockado por ora); decidir critério de segmento pra assinatura de Coordenador(a);
  decidir se vale mapear os campos de `Pessoa` que faltam na entidade EF.

## Objetivo

Migrar a listagem de turmas (ponto de entrada) e os quatro documentos gerados a partir dela:
Ficha Individual, Ata de Resultados Finais, Certificado de Conclusão e Livro de Matrícula —
todos usando o motor `shared/document-builder` já existente em `estrutura-pedagogica`.

## Estado atual (não começar do zero)

`features/ficha-individual/` já existe em `estrutura-pedagogica`, montada sobre o
`document-builder`, com `mocks/ficha-individual.mock.ts` e comentário explícito indicando que é
um placeholder para esta migração. **Antes de codar**, comparar:

- Campos/escopos do `FichaIndividualGetResponse` de origem (`escopoRegular`,
  `escopoDiversificado`, `escopoItinerarioSemestral`, `escopoDependencia`,
  `percentualFrequencia`) contra o mock atual do destino — completar o que faltar.
- `DocGridFichaIndividualComponent`/`DocGridFichaIndividualResumidoComponent`/
  `DocFichaIndividualLegendaComponent` de origem vs. os componentes `Doc*` já usados no mock
  atual (`DocSectionComponent`, `DocWideTableComponent` etc.) — mapear equivalência, não duplicar
  componente de grid se o `document-builder` já cobre o layout.

## Telas de origem (`documentacao-pedagogica/frontend`)

- `TurmaComponent` (`app-turma`) — listagem de turmas (`TurmasService`), ponto de entrada para
  os documentos por turma.
- `FichaIndividualComponent` + grids (`ata-resultados-finais`/`ficha-individual` no map).
- `AtaResultadosFinaisComponent` + `DocGridAtaComponent` — resultado final por aluno/disciplina,
  observações da ata (`ObservacoesAtaResultadosComponent`).
- `CertificadoConclusaoComponent` + `DocCertificadoFrenteComponent`/`DocCertificadoVersoComponent`
  — frente e verso do certificado.
- `LivroMatriculaComponent` + `DocGridLivroMatriculaComponent`.
- `HistoricoImpressaoComponent` — impressão do histórico completo (usa `FichaIndividualImpressaoService`).

Todas essas telas de documento reaproveitam, no destino, o mesmo padrão já usado em
`diario-de-classe/listar` (ver `frontend.md`): filtro → `service.get...()` → monta
`DocumentBundle`/`DocumentConfig` → abre `DocumentViewerComponent` em overlay → imprime/salva PDF.

## Estratégia de mock

- Completar `ficha-individual.mock.ts` primeiro (menor esforço, já tem base).
- Criar `mocks/ata-resultados-finais.mock.ts`, `mocks/certificado-conclusao.mock.ts`,
  `mocks/livro-matricula.mock.ts` seguindo o mesmo formato.
- `TurmaComponent` (listagem) pode reaproveitar um service de turma já existente em
  `estrutura-pedagogica` (turma é entidade nativa, não precisa mock próprio se já há dado real).

## Dependências

- Card 1 (configuração de rede define quais seções aparecem em cada documento — brasão, ocultar
  resultados parciais, etc.)
- Card 2 (Ata/Ficha Individual dependem do histórico de série do aluno).

## Pontos de atenção

- `PageControlService`/`PrintService` do doc-ped **não migram** — o `document-builder` já
  resolve paginação e impressão (ver `diario-de-classe` como referência funcional completa).
- `RelatorioService.getDocumentoDiarioClasse` (doc-ped) parece nome trocado/reaproveitado de
  outro contexto no mapa gerado — confirmar no controller real qual endpoint alimenta Ficha
  Individual antes de desenhar o service novo.
