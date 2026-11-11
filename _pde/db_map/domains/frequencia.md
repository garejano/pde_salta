# Frequência

## Conceitos principais

- AulaEvento: registro de uma aula realizada em uma turma (possui Turma, DataInicio, PossuiFrequencia)
- AlunoFalta: ausência registrada por aluno em uma data (Pessoa + DataAula + TipoPresenca)
- AlunoFrequencia: frequência consolidada por aluno/escola/turno/data
- TipoPresenca: lookup de status de presença (Presenca, Atraso, Falta)
- ViewChamadaPorAula: view que cruza aula + aluno + status — ponto de entrada recomendado para queries

## Notas de schema

- A ligação AulaEvento -> aluno com status de presença existe em views encriptadas (ViewChamadaPorAula).
- AlunoFalta registra faltas por Pessoa.Id + DataAula, sem FK direta para AulaEvento.
- Para queries de frequência por turma: usar ViewChamadaPorAula (IdTurma, NomeAluno, DataAula, NomeTipoPresenca).

## Tabelas principais (hubs)

- **LancamentoNotasBusca** (PK: `Id`) — 8 FK(s) de negócio
- **ProtocoloLancamentoBusca** (PK: `Id`) — 8 FK(s) de negócio
- **HoraAulaPadrao** (PK: `Id`) — 7 FK(s) de negócio
- **HoraAulaSegmento** (PK: `Id`) — 7 FK(s) de negócio
- **AtualizacaoHoraAulaClasseItem** (PK: `Id`) — 6 FK(s) de negócio

## Todas as tabelas

- **AlteracaoCargaLancamento** (PK: `Id`, 1 FK(s) negócio)
- **AlunoAvaliacaoPresenca** (PK: `Id`, 4 FK(s) negócio)
- **AlunoAvaliacaoPresenca_bkp** (PK: `—`, 0 FK(s) negócio)
- **AlunoAvaliacaoPresenca_bkp2** (PK: `—`, 0 FK(s) negócio)
- **AlunoFalta** (PK: `Id`, 2 FK(s) negócio)
- **AlunoFaltas** (PK: `Id`, 2 FK(s) negócio)
- **AlunoFrequencia** (PK: `Id`, 4 FK(s) negócio)
- **AlunoJustificativaFalta** (PK: `Id`, 1 FK(s) negócio)
- **AlunoPercentualFrequencia** (PK: `Id`, 3 FK(s) negócio)
- **AtualizacaoHoraAulaClasseItem** (PK: `Id`, 6 FK(s) negócio)
- **AtualizacaoHoraAulaLote** (PK: `Id`, 1 FK(s) negócio)
- **AtualizacaoHoraAulaSegmentoItem** (PK: `Id`, 6 FK(s) negócio)
- **AulaEvento** (PK: `Id`, 6 FK(s) negócio)
- **AulaEventoAnotacoes** (PK: `Id`, 1 FK(s) negócio)
- **AulaEventoConfiguracao** (PK: `Id`, 2 FK(s) negócio)
- **AulaEventoDeverDeCasa** (PK: `Id`, 1 FK(s) negócio)
- **AulaEventoPauta** (PK: `Id`, 1 FK(s) negócio)
- **AulaEventoPautaMensal** (PK: `Id`, 2 FK(s) negócio)
- **AulaEventoPautaSemanal** (PK: `Id`, 2 FK(s) negócio)
- **AulaEventoUltimaAlteracao** (PK: `Id`, 1 FK(s) negócio)
- **AulaOnline** (PK: `Id, Id`, 3 FK(s) negócio)
- **AulaOnlineAcesso** (PK: `Id`, 3 FK(s) negócio)
- **AulaOnlineAcessoPing** (PK: `Id`, 1 FK(s) negócio)
- **Aula_ComentarioComportamento** (PK: `Id`, 4 FK(s) negócio)
- **Aula_LancamentoComportamento** (PK: `Id`, 5 FK(s) negócio)
- **BaseDeLancamentoNotas** (PK: `Id`, 0 FK(s) negócio)
- **Chamada** (PK: `Id`, 0 FK(s) negócio)
- **DadosImportacaoFrequencia** (PK: `Id`, 0 FK(s) negócio)
- **DiaSemAula** (PK: `Id`, 1 FK(s) negócio)
- **DiaSemAulaMotivo** (PK: `Id`, 3 FK(s) negócio)
- **DiaSemAulaTipo** (PK: `Id`, 0 FK(s) negócio)
- **DiaSemAulaTurma** (PK: `Id`, 2 FK(s) negócio)
- **DuracaoTempoAula** (PK: `Id`, 1 FK(s) negócio)
- **FilaImportacaoFrequencia** (PK: `Id`, 0 FK(s) negócio)
- **FrequenciaProfessor** (PK: `Id`, 3 FK(s) negócio)
- **FrequenciaProfessorSubstituto** (PK: `Id`, 3 FK(s) negócio)
- **FuncionalidadeTipoPresenca** (PK: `Id`, 2 FK(s) negócio)
- **HistoricoHoraAulaPgto** (PK: `—`, 1 FK(s) negócio) — Histórico das alterações da tabela ClassificacaoClassePgto. Os dados são inseridos automáticamente por meio da trigger TrgSalvarHistorico
- **HistoricoHoraAulaSegmentoPgto** (PK: `—`, 1 FK(s) negócio)
- **HoraAulaEspecial** (PK: `Id`, 6 FK(s) negócio)
- **HoraAulaPadrao** (PK: `Id`, 7 FK(s) negócio)
- **HoraAulaPgto** (PK: `Id`, 3 FK(s) negócio) — Associação entre o fluxo de classificação e a sua classe de pagamento. Opcionalmente, são declaradas as variáveis para compor o cálculo da folha de pagamento
- **HoraAulaSegmento** (PK: `Id`, 7 FK(s) negócio)
- **HoraAulaSegmentoPgto** (PK: `Id`, 4 FK(s) negócio)
- **HoraAulaTabelada** (PK: `Id`, 6 FK(s) negócio)
- **ImportacaoFrequencia** (PK: `Id`, 0 FK(s) negócio)
- **JustificativaHoraAula** (PK: `Id`, 0 FK(s) negócio)
- **LIV_FeedbackAula** (PK: `Id`, 5 FK(s) negócio)
- **LIV_FeedbackAulaRespostas** (PK: `Id`, 2 FK(s) negócio)
- **LIV_FeedbackCadastroAulas** (PK: `Id`, 0 FK(s) negócio)
- **LIV_MaterialPlanoAula** (PK: `Id`, 0 FK(s) negócio)
- **LIV_StatusPlanoAula** (PK: `Id`, 2 FK(s) negócio)
- **LancamentoComportamento** (PK: `Id`, 4 FK(s) negócio)
- **LancamentoNotasBusca** (PK: `Id`, 8 FK(s) negócio)
- **LancamentoNotasStatusPorTurma** (PK: `Id`, 3 FK(s) negócio)
- **LogAulaOnlineAssistida** (PK: `Id`, 0 FK(s) negócio)
- **MonitoriaMonitorPresenca** (PK: `Id`, 4 FK(s) negócio)
- **MotivoAlteracaoHoraAula** (PK: `Id`, 1 FK(s) negócio)
- **MotivoFrequenciaProfessor** (PK: `Id`, 1 FK(s) negócio)
- **MotivoFrequenciaProfessorTipoPresenca** (PK: `Id`, 3 FK(s) negócio)
- **MovimentacaoHoraAula** (PK: `Id`, 2 FK(s) negócio)
- **MovimentacaoHoraAula_Backup_20260721113925** (PK: `—`, 0 FK(s) negócio)
- **MovimentacaoHoraAula_Backup_20260721114218** (PK: `—`, 0 FK(s) negócio)
- **MovimentacaoHoraAula_Backup_20260721114430** (PK: `—`, 0 FK(s) negócio)
- **MovimentacaoHoraAula_Backup_20260721114651** (PK: `—`, 0 FK(s) negócio)
- **MovimentacaoHoraAula_Backup_20260721114956** (PK: `—`, 0 FK(s) negócio)
- **MovimentacaoHoraAula_Backup_20260721120617** (PK: `—`, 0 FK(s) negócio)
- **POANaoPossuiAula** (PK: `Id`, 0 FK(s) negócio)
- **POANaoPossuiAula_Modulo** (PK: `—`, 0 FK(s) negócio)
- **PercentualFrequencia** (PK: `Id`, 3 FK(s) negócio)
- **PercentualFrequenciaLog** (PK: `Id`, 0 FK(s) negócio)
- **PeriodoLancamentoFrequenciaProfessor** (PK: `Id`, 1 FK(s) negócio)
- **ProdutoLancamentoNota** (PK: `Id`, 0 FK(s) negócio)
- **ProtocoloLancamento** (PK: `Id`, 4 FK(s) negócio)
- **ProtocoloLancamentoAluno** (PK: `Id`, 4 FK(s) negócio)
- **ProtocoloLancamentoBusca** (PK: `Id`, 8 FK(s) negócio)
- **ProtocoloLancamentoStatus** (PK: `Id`, 0 FK(s) negócio)
- **RelatorioLancamentoNotasEscolaEleva** (PK: `Id`, 0 FK(s) negócio)
- **RelatorioLancamentoPresencas** (PK: `Id`, 0 FK(s) negócio)
- **RelatorioPresencaEE** (PK: `Id`, 0 FK(s) negócio)
- **RelatorioPresencaEmSimulados** (PK: `Id`, 0 FK(s) negócio)
- **ReversaoHoraAulaLog** (PK: `Id`, 0 FK(s) negócio)
- **ReversaoHoraAulaLogAcaoImpactadaItem** (PK: `Id`, 1 FK(s) negócio)
- **StatusLancamentoFrequencia** (PK: `Id`, 0 FK(s) negócio)
- **TempoAula** (PK: `Id`, 1 FK(s) negócio)
- **TipoAbonoFalta** (PK: `Id`, 0 FK(s) negócio)
- **TipoAulaEvento** (PK: `Id`, 0 FK(s) negócio)
- **TipoAulaOnline** (PK: `Id`, 0 FK(s) negócio)
- **TipoAulaOnlineRede** (PK: `Id`, 2 FK(s) negócio)
- **TipoAulaOnlineRedeSerie** (PK: `Id`, 2 FK(s) negócio)
- **TipoChamada** (PK: `Id`, 0 FK(s) negócio)
- **TipoFrequencia** (PK: `Id`, 0 FK(s) negócio)
- **TipoHoraAula** (PK: `Id`, 0 FK(s) negócio)
- **TipoHoraAula_Excluir** (PK: `Id`, 0 FK(s) negócio) — Armazenamento dos fluxos para cálculo da folha do professor
- **TipoPresenca** (PK: `Id`, 0 FK(s) negócio)
- **TipoPresencaAprovacaoAutomatica** (PK: `Id`, 2 FK(s) negócio)

## Views disponíveis

- **AulaEvento** — colunas: `Hash`, `HashTurma`, `HashDisciplina`, `HashTurno`, `Nome`, `DataInicio`, `DataTermino`, `Ativo`, `DataInclusao`, `DataUltimaAlteracao`, `DataInativacao`
- **AulaTurmaAlterada** — colunas: `HashTurma`, `DataInclusao`, `DataUltimaAlteracao`, `DataInativacao`
- **DiaSemAula** — colunas: `Hash`, `HashTurma`, `DataSemAula`, `Motivo`, `Ativo`
- **RelatorioLancamentoNotas** — colunas: `Id`, `IdRede`, `NomeRede`, `IdEscola`, `NomeEscola`, `IdSegmento`, `NomeSegmento`, `IdSerie`, `NomeSerie`, `IdAnoLetivo`, `IdTurma`, `NomeTurma`, `IdCiclo`, `NomeCiclo`, `IdDisciplina`, `NomeDisciplina`, `IdTipoAvaliacao`, `NomeTipoAvaliacao`, `SiglaTipoAvaliacao`, `IdProfessor`, `NomeProfessor`, `NomeProfessorPorFrente`, `IdAvaliacao`, `NomeAvaliacao`, `DataAplicacao`, `LancamentoDe`, `LancamentoAte`, `TotalAlunos`, `TotalLancamentos`, `TotalPendencias`
- **ViewAlunoFaltaETL** — colunas: `Ano`, `Mes`, `RedeId`, `Rede`, `EscolaId`, `Escola`, `SerieId`, `Serie`, `TurmaId`, `Turma`, `Matricula`, `Aluno`, `Faltas`
- **ViewAlunoFaltaJustificativa** — colunas: `Id`, `IdEscola`, `IdAnoLetivo`, `IdSerie`, `NomeSerie`, `OrdemSerie`, `IdSegmento`, `IdTurma`, `NomeTurma`, `IdAluno`, `HashAluno`, `NomeAluno`, `Matricula`, `StatusAluno`, `FotoAluno`, `DataAula`, `IdTipoPresenca`, `NomeTipoPresenca`, `IdGrupoDocumento`, `IdTipoDocumento`, `PossuiJustificativa`
- **ViewAulaOnline** — colunas: `Id`, `IdRede`, `HashRede`, `NomeRede`, `IdAnoLetivo`, `HashAnoLetivo`, `NomeAnoLetivo`, `IdAgrupamento`, `HashAgrupamento`, `NomeAgrupamento`, `IdTipoAulaOnline`, `HashTipoAulaOnline`, `NomeTipoAulaOnline`, `IdentificadorTipoAulaOnline`, `IdAulaOnline`, `HashAulaOnline`, `DescricaoAulaOnline`, `AoVivo`, `PossuiChat`, `AcessoExterno`, `CodigoVimeo`, `LinkVideo`, `LinkChat`, `DataAulaOnline`, `HoraAulaOnline`, `DataAulaOnlineParaExibicao`
- **ViewAulaOnlineAcesso** — colunas: `Id`, `IdAnoLetivo`, `NomeEscola`, `NomeTurma`, `IdRede`, `HashRede`, `NomeRede`, `IdAulaOnline`, `HashAulaOnline`, `AoVivo`, `NomeAula`, `DataAula`, `DataAulaParaExibicao`, `AlunosVisualizacao`, `AlunosTurma`
- **ViewAulaOnlineAssistida** — colunas: `Id`, `IdRede`, `NomeRede`, `HashRede`, `IdEscola`, `NomeEscola`, `HashEscola`, `IdAgrupamento`, `NomeAgrupamento`, `HashAgrupamento`, `Matricula`, `NomeAluno`, `AnoLetivo`, `NomeSerie`, `NomeTurma`, `Origem`, `TituloVideo`, `DuracaoVideo`, `AoVivo`, `DataVisualizacao`, `VideoExecutado`, `TaxaVisualizacao`
- **ViewChamadaPorAula** — colunas: `Id`, `Segmento`, `IdRede`, `NomeRede`, `IdEscola`, `NomeEscola`, `IdAnoLetivo`, `IdSerie`, `NomeSerie`, `IdTurma`, `NomeTurma`, `IdDisciplina`, `NomeDisciplina`, `IdAula`, `DataAula`, `NomeAula`, `ChamadaConfirmada`, `IdAluno`, `NomeAluno`, `MatriculaAluno`, `EmailAluno`, `StatusAluno`, `PossuiFoto`, `FotoAluno`, `IdTipoPresenca`, `NomeTipoPresenca`
- **ViewChamadaPorDia** — colunas: `Id`, `IdRede`, `NomeRede`, `IdEscola`, `NomeEscola`, `IdAnoLetivo`, `IdSerie`, `NomeSerie`, `IdTurma`, `NomeTurma`, `IdTurno`, `NomeTurno`, `IdAula`, `DataAula`, `NomeAula`, `HashAluno`, `IdAluno`, `NomeAluno`, `MatriculaAluno`, `StatusAluno`, `PossuiFoto`, `FotoAluno`, `IdTipoPresenca`, `NomeTipoPresenca`, `Justificada`, `DataLancamento`, `DiasEntreAulaELancamento`, `NomeUsuarioLancamento`, `Alerta`
- **ViewConselhoDeClasseFiltroLancamento** — colunas: `Id`, `IdRede`, `HashRede`, `NomeRede`, `IdEscola`, `HashEscola`, `NomeEscola`, `IdAnoLetivo`, `HashAnoLetivo`, `NomeAnoLetivo`, `IdAgrupamento`, `HashAgrupamento`, `NomeAgrupamento`, `IdSerie`, `HashSerie`, `NomeSerie`, `OrdemSerie`, `IdTurma`, `HashTurma`, `NomeTurma`, `IdCiclo`, `HashCiclo`, `NomeCiclo`, `OrdemCiclo`
- **ViewControleChamadaPorAula** — colunas: `IdRede`, `NomeRede`, `IdEscola`, `NomeEscola`, `IdAnoLetivo`, `IdSegmento`, `NomeSegmento`, `IdSerie`, `NomeSerie`, `IdTurma`, `NomeTurma`, `IdAula`, `DataAula`, `NomeAula`, `IdUsuarioPrimeiroLancamento`, `NomeUsuarioPrimeiroLancamento`, `DataPrimeiroLancamento`, `Presencas`, `Atrasados`, `Ausentes`, `SemMarcacao`
- **ViewDiaSemAula** — colunas: `Id`, `IdRede`, `NomeRede`, `IdEscola`, `NomeEscola`, `IdAnoLetivo`, `IdSegmento`, `NomeSegmento`, `IdSerie`, `NomeSerie`, `OrdemSerie`, `IdTurma`, `NomeTurma`, `IdTurno`, `NomeTurno`, `DataAula`, `NomeAula`, `NaoTeveAula`, `Justificativa`
- **ViewFaltasPorDiaEmChamadaPorAula** — colunas: `Id`, `IdRede`, `NomeRede`, `IdEscola`, `NomeEscola`, `IdAnoLetivo`, `IdSegmento`, `NomeSegmento`, `IdSerie`, `NomeSerie`, `IdTurma`, `NomeTurma`, `DataAula`, `IdPessoa`, `NomeALuno`, `FotoAluno`, `NomeMae`, `NomePai`, `DataNascimento`
- **ViewFrequenciaProfessor** — colunas: `Id`, `IdFrequenciaProfessor`, `IdRede`, `IdEscola`, `IdAnoLetivo`, `IdSegmento`, `NomeSegmento`, `IdSerie`, `NomeSerie`, `IdPessoaEscolaAcesso`, `IdPerfilAcesso`, `IdProfessor`, `NomeProfessor`, `IdPeriodoLancamento`, `DataEvento`, `InformacaoAdicional`, `IdTipoPresenca`, `NomeTipoPresenca`, `IndicaPresenca`, `IndicaAtraso`, `IndicaFalta`, `IdMotivoFrequenciaProfessorTipoPresenca`, `NomeMotivoFrequenciaProfessor`, `ExigeInformacaoAdicional`, `ImpactaEmFolhaPagamento`, `IdTurma`, `NomeTurma`, `TurnoTurma`, `Quantidade`, `IdFrequenciaProfessorSubstituto`, `IdPessoaEscolaAcessoSubstituto`, `SubstitutoInclusao`, `SubstitutoInativacao`, `SubstitutoCancelado`, `NomeProfessorSubstituto`, `Ativo`, `DataInclusao`, `DataInativacao`, `LancadoForaDoPrazo`, `Cancelado`, `DataCancelamento`, `UsuarioCancelamento`, `PossuiLancamentoEventos`, `ValorHoraAulaEspecial`, `Tempos`, `Valor`, `QuantidadeValor`, `IdSegmentoProfessor`, `Planejado`
- **ViewFrequenciaProfessorParaExtracao** — colunas: `Id`, `IdRede`, `NomeRede`, `IdEscola`, `NomeEscola`, `IdTipoPresenca`, `NomeTipoPresenca`, `DataEvento`, `NomeProfessor`, `CPF`, `IdTurma`, `NomeTurma`, `Tempo`, `NomeMotivoFrequenciaProfessor`, `TipoImpactaEmFolhaPagamento`, `InformacaoAdicional`, `Ativo`, `DataInclusao`, `UsuarioInclusao`, `DataInativacao`, `SubstitutoInclusao`, `SubstitutoInativacao`, `SubstitutoCancelado`, `DataCancelamentoSubstituto`, `IdPeriodo`, `LancadoForaDoPrazo`, `Cancelado`, `DataCancelamento`, `UsuarioCancelamento`, `NomeUsuarioCancelamento`, `DescricaoLinhaOrc`, `ValorHoraAulaEspecial`, `Tempos`, `GrupoTipoPresenca`, `IdSegmentoProfessor`, `NomeSegmentoProfessor`, `Valor`, `PessoaEscolaAcesso`, `QuantidadeValor`, `CodigoLinhaOrcamentaria`
- **ViewLancamentoDeNotasDetalhado** — colunas: `Id`, `AnoLetivo`, `HashSerie`, `HashSegmento`, `HashRede`, `HashEscola`, `HashCiclo`, `HashTurmaBase`, `NomeTurmaBase`, `NomeSerie`, `HashTurma`, `NomeTurma`, `IdProva`, `DataAplicacao`, `HashAvaliacao`, `Identificacao`, `HashDisciplina`, `NomeDisciplina`, `HashProfessor`, `NomeProfessor`, `HashAluno`, `NomeAluno`, `FotoAluno`, `IdTipoJustificativaNota`, `Detalhamento`, `Justificativa`, `SiglaJustificativa`, `Situacao`
- **ViewLancamentoNotaTransferencia** — colunas: `Id`, `IdRede`, `HashRede`, `NomeRede`, `IdEscola`, `HashEscola`, `NomeEscola`, `IdAnoLetivo`, `HashAnoLetivo`, `NomeAnoLetivo`, `IdTurma`, `HashTurma`, `NomeTurma`, `IdAluno`, `HashAluno`, `NomeAluno`, `Matricula`, `IdDisciplina`, `HashDisciplina`, `NomeDisciplina`, `IconeDisciplina`, `PossuiFoto`, `FotoAluno`, `TransferenciaInterna`, `IdNotaTransferencia`, `DataTransferencia`, `NotaAlcancada`, `NotaMaxima`
- **ViewLancamentoNotas** — colunas: `Id`, `HashAvaliacao`, `IdAvaliacao`, `IdDisciplina`, `IdDisciplinaMae`, `HashEscola`, `HashTurma`, `IdTurma`, `HashChamada`, `IdChamada`, `PossuiProva`, `NotaMaxima`, `DataAplicacao`, `DataCorrecaoInicio`, `DataCorrecaoTermino`, `LancamentoLiberadoProfessor`, `StatusLancamentoProfessor`, `LancamentoLiberadoCoordenacao`, `StatusLancamentoCoordenacao`, `ExibeChamada`, `ExibeEmail`, `ExibeDetalhamento`
- **ViewLancamentoNotasDetalhado** — colunas: `Id`, `RedeId`, `RedeNome`, `EscolaId`, `EscolaNome`, `SerieId`, `SerieNome`, `AnoLetivo`, `TurmaId`, `TurmaNome`, `DisciplinaId`, `DisciplinaNome`, `TipoAvaliacaoId`, `TipoAvaliacaoNome`, `TipoAvaliacaoSigla`, `AvaliacaoId`, `AvaliacaoIdentificacao`, `DataAplicacao`, `Nota`, `LancamentoData`, `Chamada`, `UsuarioLancamentoId`, `PessoaLancamento`, `AlunoId`, `AlunoNome`, `AlunoPAA`, `TipoJustificativa`
- **ViewLancamentoPresencas** — colunas: `SerieId`, `SerieNome`, `TurmaNome`, `EscolaId`, `EscolaNome`, `PessoaId`, `PessoaNome`, `Data`, `PossuiRegistro`
- **ViewLancamentosNotasPorAluno** — colunas: `NomeAluno`, `NomeDisciplina`, `IdEscola`, `NomeEscola`, `NomeProfessor`, `NomeSerie`, `NomeTurma`, `DataAplicacao`, `IdAnoLetivo`
- **ViewPOANaoPossuiAulaModulo** — colunas: `Id`, `POAAluno`, `POAProfessor`, `UsuarioInclusao`, `DataInclusao`, `UsuarioUltimaAlteracao`, `DataUltimaAlteracao`, `UsuarioInativacao`, `DataInativacao`, `Ativo`
- **ViewPeriodoLancamentoCarga** — colunas: `Id`, `Rede`, `DataInicial`, `DataFinal`, `DataLimiteLancamento`
- **ViewPresencaEmSimulados** — colunas: `SerieId`, `SerieNome`, `EscolaId`, `EscolaNome`, `TurmaId`, `TurmaNome`, `PessoaId`, `PessoaNome`, `ProvaId`, `ProvaNome`, `DataAplicacao`, `Faltou`, `AnoLetivo`
- **ViewRelatorioChamadaPorAula** — colunas: `Id`, `IdRede`, `NomeRede`, `IdEscola`, `NomeEscola`, `IdAnoLetivo`, `IdSegmento`, `NomeSegmento`, `IdSerie`, `NomeSerie`, `IdTurma`, `NomeTurma`, `DataInicio`, `DataTermino`, `NomeAula`, `IdDisciplina`, `NomeDisciplina`, `IdPessoa`, `Matricula`, `NomeAluno`, `Status`, `NomeProfessor`
- **ViewRelatorioChamadasDataAtual** — colunas: `IdAnoLetivo`, `HashEscola`, `HashSerie`, `NomeTurmaBase`, `NomeTurma`, `HashDisciplina`, `NomeDisciplina`, `ChamadaConfirmada`, `DataInicio`, `DataTermino`, `UsuarioChamadaConfirmada`, `Professores`
- **ViewRelatorioChamadasRealizadas** — colunas: `IdAnoLetivo`, `IdEscola`, `HashEscola`, `IdSerie`, `HashSerie`, `IdTurma`, `HashTurma`, `IdTurmaBase`, `HashTurmaBase`, `HashDisciplina`, `NomeDisciplina`, `DataAula`, `HoraAula`, `ChamadaNaoRealizada`, `ChamadaRealizada`
- **ViewSegundaChamadaSemFaltaMarcada** — colunas: `Id`, `Rede`, `Escola`, `Agrupamento`, `Avaliacao`, `Turma`, `Aluno`, `RA`, `PossuiCR`, `Nota`, `Lançada por`, `Lançada em`
- **ViewSituacaoChamadaTurma** — colunas: `Id`, `IdAnoLetivo`, `IdEscola`, `NomeEscola`, `IdAgrupamento`, `IdSegmento`, `NomeSegmento`, `IdSerie`, `NomeSerie`, `IdEscolaSerie`, `IdTurmaBase`, `NomeTurmaBase`, `IdTurma`, `NomeTurma`, `PossuiSelecaoDisciplina`, `IdDisciplina`, `NomeDisciplina`, `SiglaDisciplina`, `IdPessoaProfessor`, `NomeProfessor`, `IdAula`, `DataAula`, `NomeAula`, `DataInicio`, `DataTermino`, `ChamadaConfirmada`, `PendenciasChamada`
- **ViewTempoAulaTurma** — colunas: `Id`, `IdTempoAula`, `IdEscola`, `IdAnoLetivo`, `IdSegmento`, `IdSerie`, `IdEscolaSerie`, `IdTurma`, `NomeTempoAula`, `HoraInicio`, `HoraTermino`
- **ViewTurmasParaChamadaPorAula** — colunas: `Id`, `IdAnoLetivo`, `IdEscola`, `IdSerie`, `IdTurma`, `HashTurma`, `NomeTurma`, `BoletimLiberado`, `SituacaoLiberada`, `IdDisciplina`, `SiglaDisciplina`, `NomeDisciplina`, `IdAulaEvento`, `NomeAulaEvento`, `DataInicioAulaEvento`

