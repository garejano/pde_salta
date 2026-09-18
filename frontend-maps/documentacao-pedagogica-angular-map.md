# Angular Map — documentacao-pedagogica
> Gerado em: 2026-07-30  
> Fonte: `C:\projects\documentacao-pedagogica\frontend`

## Módulos

- **AppModule** · declara: [AppComponent, NavigationTabsComponent, HomeComponent, ConfiguracaoComponent, ConfiguracaoRedeComponent, ... +67] · importa: [AppRoutingModule, BrowserModule, CommonModule, HammerModule, ReactiveFormsModule, ... +14] · exporta: [AppRoutingModule]
- **AppRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **CoreModule** · declara: [GridComponent, ConfirmDialogComponent, MultiSelectFieldComponent, SelectFieldComponent, NgSelectFieldComponent, ... +13] · importa: [CommonModule, NgxPaginationModule, ReactiveFormsModule, NgSelectModule, FormsModule, ... +11] · exporta: [GridComponent, ConfirmDialogComponent, FontAwesomeModule, TranslateModule, ... +20]
- **FooterSalvarModule** · declara: [FooterSalvarComponent] · importa: [CommonModule] · exporta: [FooterSalvarComponent]
- **LoadingModule** · declara: [LoadingComponent] · importa: [CommonModule] · exporta: [LoadingComponent]
- **ModalElevaModule** · declara: [ModalElevaComponent] · importa: [CommonModule] · exporta: [ModalElevaComponent]
- **PortalModule** · declara: [PortalHeaderComponent, PortalMenuComponent, PortalModalComponent, LogarComoComponent, LogoEscolaComponent, ... +14] · importa: [CommonModule, FormsModule, HttpClientModule, RouterModule] · exporta: [PortalAuthComponent, PortalHeaderComponent, PortalModuloComponent, PortalBodyComponent, ... +3]
- **SemConteudoModule** · declara: [SemConteudoComponent] · importa: [CommonModule] · exporta: [SemConteudoComponent]
- **SharedModule** · declara: [SelectFieldComponent, MultiSelectComponent, ClickOutsideDirective] · importa: [CommonModule, FormsModule, ReactiveFormsModule] · exporta: [SelectFieldComponent, MultiSelectComponent, ClickOutsideDirective]

## Rotas

- `path.Configuracao.Listar` → ConfiguracaoComponent `[IsLoggedGuard]`
- `path.Configuracao.Rede` → ConfiguracaoRedeComponent `[IsLoggedGuard]`
- `path.Configuracao.Escola` → ConfiguracaoEscolaComponent `[IsLoggedGuard]`
- `path.Configuracao.FundamentacaoLegal` → ConfiguracaoFundamentacaoLegalComponent `[IsLoggedGuard]`
- `path.Historico.Alunos` → AlunosComponent `[IsLoggedGuard]`
- `path.Historico.Observacoes` → HistoricoObservacoesComponent `[IsLoggedGuard]`
- `path.Historico.EditarInformacoes` → EditarInformacoesComponent `[IsLoggedGuard]`
- `path.Historico.Fundamentacoes` → EditarFundamentacaoAlunoComponent `[IsLoggedGuard]`
- `path.Historico.Series` → HistoricoSerieComponent `[IsLoggedGuard]`
- `path.Turma.Listar` → TurmaComponent `[IsLoggedGuard]`
- `path.Historico.RegistroCertificado` → EditarRegistroCertificadoComponent `[IsLoggedGuard]`
- `path.Home` → HomeComponent
- `path.Auth` → PortalAuthComponent
- `**` → HomeComponent

## Componentes

### alunos
- **AlunosComponent** `app-alunos`
  - Injeta: AlunoService, EventTagService, FiltroSync, Router, SelecaoAlunoService

### app
- **AppComponent** `app-root`

### ata-resultados-finais
- **AtaResultadosFinaisComponent** `app-ata-resultados-finais`
  - @Input: dados: AtaResultadosFinaisDocumentoResponse | null, observacao: string
  - Injeta: ElementRef, PageControlService
- **DocGridAtaComponent** `app-doc-grid-ata`
  - @Input: index: number, alunos: Array<AlunoAtaResponse>, disciplinas: Array<DisciplinaAtaResponse>, resultados: Array<ResultadoAtaResponse>... +4
  - Injeta: ElementRef

### barra-busca
- **BarraBuscaComponent** `app-barra-busca`
  - @Output: changefilterStatus
  - Injeta: FiltroSync

### busca-texto
- **BuscaTextoComponent** `app-busca-texto`
  - @Output: submit
  - Injeta: FiltroStore, FiltroSync

### certificado-conclusao
- **CertificadoConclusaoComponent** `app-certificado-conclusao`
  - @Input: assinaturas: any[], localDataDocumento: string, infoCertificadoConclusao: CertificadoConclusaoDocumentoResponse, configuracaoRede: ConfiguracaoRedeResponse... +1
  - Injeta: ElementRef
- **DocCertificadoFrenteComponent** `app-doc-certificado-frente`
  - @Input: infoCertificadoConclusao: CertificadoConclusaoDocumentoResponse, configuracaoRede: ConfiguracaoRedeResponse, configuracoesSelecionadas: ConfiguracoesSelecionadas
  - Injeta: ElementRef
- **DocCertificadoVersoComponent** `app-doc-certificado-verso`
  - @Input: infoCertificadoConclusao: CertificadoConclusaoDocumentoResponse
  - Injeta: ElementRef

### checkbox-field
- **CheckboxFieldComponent** `app-checkbox-field`
  - @Output: eventChange
  - Injeta: NgControl

### components
- **AvatarComponent** `app-avatar`
  - @Input: userId: string, userName: string, photoUrl: string | null
  - Injeta: LetrasIniciaisPipe, PhotoService
- **ButtonComponent** `app-button`
  - @Input: label: string, classButton: string, disabled: boolean, title: string... +4
  - @Output: clickEvent
- **CardMensagemComponent** `app-card-mensagem`
  - @Input: title: string, message: string
- **CertificadoConclusaolListaAlunosComponent** `app-certificado-conclusao-lista-alunos`
  - @Input: dados: FichaIndividualAlunosGetResponse, loading: boolean
  - Injeta: CertificadoConclusaoService, ChangeDetectorRef, DatePipe, ImpressaoService, ToastrService
- **DocumentoInterativoComponent** `app-documento-interativo`
  - @Input: documento: DocumentoInterativoModel
- **FichaIndividualListaAlunosComponent** `app-ficha-individual-lista-alunos`
  - @Input: dados: FichaIndividualAlunosGetResponse, loading: boolean
  - Injeta: DatePipe, FichaIndividualImpressaoService, ImpressaoService
- **FooterSalvarComponent** `app-footer-salvar`
  - @Input: label: string, disabled: boolean
  - @Output: submitted
- **HabilitarGuiaTransferenciaComponent** `app-habilitar-guia-transferencia`
  - @Input: loading: boolean, label: string, text: string
  - @Output: submit
  - Injeta: FormBuilder
- **HistoricoListaAlunosComponent** `app-historico-lista-alunos`
  - @Input: loading: boolean
  - @Output: seleciona, newItemEvent
  - Injeta: DatePipe
- **IconButtonComponent** `app-icon-button`
  - @Input: icon: string, class: string
  - @Output: clickEvent
- **ListaDisciplinasComponent** `app-lista-disciplinas`
  - @Input: resultados: ResultadoFinalResponse[], formularioAlterado: boolean, exibirBotaoAdicionarAoIniciar: boolean
  - @Output: eventChange, cargaHorariaChange, confirmModal
  - Injeta: HistoricoSerieSelecaoService, ListaDisciplinasService, ToastrService
- **ListaEscolasComponent** `app-lista-escolas`
  - @Input: escolas: any
  - Injeta: ConfiguracaoEscolaSelecaoService, Router
- **ListaFundamentacaoLegalComponent** `app-lista-fundamentacao-legal`
  - @Input: fundamentacoes: ResponseModel[], redeSelecionada: ConfiguracaoRedeResponse
  - Injeta: ConfiguracaoRedeSelecaoService, RotaSelecaoService, Router
- **LoadingComponent** `app-loading`
  - @Input: mensagem: string
- **ModalElevaComponent** `app-modal-eleva`
  - @Input: showModal: boolean, closeButton: boolean, modalDownload: boolean
  - @Output: closeModalEvent
- **NavigationTabsComponent** `app-navigation-tabs`
  - Injeta: Router, UsuarioService
- **ObservacoesAtaResultadosComponent** `app-observacoes-ata-resultados`
  - @Input: loading: boolean, observacao: string
  - @Output: submit
  - Injeta: FormBuilder
- **OverlayImpressaoComponent** `app-overlay-impressao`
  - @Input: showOverlay: boolean, closeButton: boolean, porSegmento: boolean, segundaVia: boolean... +2
  - @Output: closeEvent, printEvent, saveEvent, trocaTipoEvent, ... +2
  - Injeta: FormBuilder
- **PaginacaoComponent** `app-paginacao`
  - @Input: current: number, total: number, paginacao: Paginacao
  - @Output: goTo
  - Injeta: FiltroSync
- **PreviaDocCertificadoComponent** `app-previa-doc-certificado`
  - @Input: configuracaoRede: ConfiguracaoRedeResponse, configuracoesSelecionadas: ConfiguracoesSelecionadas
  - Injeta: ConfiguracaoPreviewService
- **SemConteudoComponent** `app-sem-conteudo`
  - @Input: mensagem: string
- **TituloTelaComponent** `app-titulo-tela`
  - @Input: titulo: string
  - @Output: emtVoltar
- **ToastrElevaComponent** `app-toastr-eleva`

### configuracao
- **ConfiguracaoComponent** `app-configuracao`
  - Injeta: ConfiguracaoRedeSelecaoService, EscolaService, FundamentacaoLegalService, RedeService, Router

### configuracao-escola
- **ConfiguracaoEscolaComponent** `app-configuracao-escola`
  - Injeta: ActivatedRoute, ConfiguracaoEscolaSelecaoService, EscolaAnoLetivoService, EscolaService, FormBuilder, ... +1

### configuracao-fundamentacao-legal
- **ConfiguracaoFundamentacaoLegalComponent** `app-configuracao-fundamentacao-legal`
  - Injeta: ActivatedRoute, ConfiguracaoRedeSelecaoService, FormBuilder, FundamentacaoLegalService, NgxHotjarService, ... +1

### configuracao-rede
- **ConfiguracaoRedeAtaComponent** `app-configuracao-rede-ata`
  - @Input: redeSelecionada: ConfiguracaoRede, certificado: any[]
  - Injeta: FormBuilder, RedeService, Router, ToastrService
- **ConfiguracaoRedeCertificadoConclusaoComponent** `app-configuracao-rede-certificado-conclusao`
  - @Input: redeSelecionada: ConfiguracaoRede, configuracaoRede: ConfiguracaoRedeResponse
  - Injeta: ConfiguracaoPreviewService, ConfiguracaoRedeCertificadoConclusaoService, FormBuilder, Router, ToastrService
- **ConfiguracaoRedeComponent** `app-configuracao-rede`
  - Injeta: ConfiguracaoRedeSelecaoService, RedeService, Router
- **ConfiguracaoRedeFichaComponent** `app-configuracao-rede-ficha`
  - @Input: redeSelecionada: ConfiguracaoRede
  - Injeta: FormBuilder, NgxHotjarService, RedeService, Router, ToastrService
- **ConfiguracaoRedeGeralComponent** `app-configuracao-rede-geral`
  - @Input: redeSelecionada: ConfiguracaoRede
  - Injeta: FormBuilder, NgxHotjarService, RedeService, Router, ToastrService
- **ConfiguracaoRedeHistoricoComponent** `app-configuracao-rede-historico`
  - @Input: redeSelecionada: ConfiguracaoRede, certificado: any[]
  - Injeta: ActivatedRoute, FormBuilder, NgxHotjarService, RedeService, Router, ... +1
- **ConfiguracaoRedeLivroMatriculasComponent** `app-configuracao-rede-livro-matriculas`
  - @Input: redeSelecionada: ConfiguracaoRede, certificado: any[]
  - Injeta: FormBuilder, NgxHotjarService, RedeService, Router, ToastrService

### confirm
- **ConfirmDialogComponent** `app-confirm-dialog`
  - Injeta: ConfirmDialogService

### date-field
- **DateFieldComponent** `app-date-field`
  - @Input: required: boolean, invalid: boolean
  - @Output: eventChange
  - Injeta: NgControl

### daterangepicker-field
- **DateRangePickerComponent** `app-daterange-picker`
  - @Input: label: string, required: boolean, nullable: boolean, initialYear: number... +3
  - @Output: eventDateChange
  - Injeta: ElementRef, NgbCalendar, NgbDateParserFormatter, Renderer2

### editar-aluno
- **EditarAlunoComponent** `app-editar-aluno`
  - Injeta: AlunoService, CertificadoConclusaoService, ConfiguracaoRedeSelecaoService, EditarFundamentacaoSelecaoService, EditarInformacoesSelecaoService, ... +1

### editar-fundamentacao-aluno
- **EditarFundamentacaoAlunoComponent** `app-editar-fundamentacao-aluno`
  - Injeta: EditarFundamentacaoSelecaoService, HistoricoFundamentacaoService, Router, ToastrService

### editar-informacoes
- **EditarInformacoesComponent** `app-editar-informacoes`
  - Injeta: EditarInformacoesSelecaoService, EditarInformacoesService, FormBuilder, Router, ToastrService

### editar-registro-certificado
- **EditarRegistroCertificadoComponent** `app-editar-registro-certificado`
  - Injeta: EditarRegistroCertificadoSelecaoService, EditarRegistroCertificadoService, FormBuilder, Router, ToastrService

### ficha-individual
- **DocFichaIndividualFrequenciaComponent** `app-doc-ficha-individual-frequencia`
  - @Input: frequencia: string, cargaHoraria: string
  - Injeta: ElementRef
- **DocFichaIndividualLegendaComponent** `app-doc-ficha-individual-legenda`
  - @Input: legenda: Array<FichaIndividualLegendaGetResponse>
  - Injeta: ElementRef
- **DocGridConteudosFichaIndividualComponent** `app-doc-grid-conteudos-ficha-individual`
  - @Input: conteudos: any, info: GridInfo
  - Injeta: ElementRef
- **DocGridFichaIndividualComponent** `app-doc-grid-ficha-individual`
  - @Input: index: number, etapas: any[], disciplinas: any[], indexInit: number... +4
  - Injeta: ElementRef
- **DocGridFichaIndividualResumidoComponent** `app-doc-grid-ficha-individual-resumido`
  - Injeta: ElementRef
- **FichaIndividualComponent** `app-ficha-individual`
  - @Input: dados: FichaIndividualGetResponse | null, configuracaoRede: ConfiguracaoRedeResponse, configuracaoEscola: ConfiguracaoEscolaResponse, cabecalho: DadosCabecalho | null... +4
  - Injeta: ElementRef, PageControlService

### filtro
- **FiltroComponent** `app-filtro`
  - @Input: possuiSituacao: boolean
  - @Output: submit, changefilterStatus
  - Injeta: Filtro, FiltroStore, FiltroSync, ToastrService

### gerador-documentos
- **AnoSelectComponent** `app-ano-select`
  - @Output: trocaAnoSerieEvent
- **DocAssinaturaComponent** `app-doc-assinatura`
  - @Input: assinaturas: Assinatura[], local: string, realcarImpressao: boolean
  - Injeta: ElementRef
- **DocCleanTextComponent** `app-doc-clean-text`
  - @Input: text: string, label: string
  - Injeta: ElementRef
- **DocFooterComponent** `app-doc-footer`
  - @Input: index: number, total: number
- **DocGridInfoComponent** `app-doc-grid-info`
  - @Input: info: GridInfo
- **DocHeaderComponent** `app-doc-header`
  - @Input: info: DadosCabecalho
- **DocLegendaComponent** `app-doc-legenda`
  - @Input: text: string, label: string
  - Injeta: ElementRef
- **DocTextFieldComponent** `app-doc-text-field`
  - @Input: text: string, label: string
  - Injeta: ElementRef
- **DocTitleComponent** `app-doc-title`
  - @Input: title: string, borderTitle: boolean, center: boolean
- **DocumentLoadingComponent** `app-document-loading`
- **DocumentPageComponent** `app-document-page`
  - @Input: componentes: any[], fake: boolean, header: TemplateRef<any>, index: number... +4
  - Injeta: ElementRef
- **DocumentSettingsComponent** `app-document-settings`
  - @Output: updateConfig
- **DocumentTopbarComponent** `app-document-topbar`
  - @Output: closeEvent, saveEvent, printEvent
- **DocumentViewerComponent** `app-document-viewer`
  - @Input: controls: TemplateRef<any>, titulo: String, ajustarAssinatura: boolean
  - Injeta: EventTagService, PrintService, ToastrService
- **MolduraComponent** `app-moldura`
  - @Input: pageLayout: PageLayout, configuracaoMoldura: ConfiguracaoMoldura

### grid
- **GridComponent** `app-grid-component`
  - @Input: editUrl: string, rowData: IGridRowData<any>, columnDefs: IGridColumnDef[], rowActions: IGridRowActions... +4
  - @Output: eventPageChange, eventRemoveAll, eventCheckChange, eventDelete
  - Injeta: NgxSpinnerService

### historico-impressao
- **HistoricoImpressaoComponent** `app-historico-impressao`
  - @Input: historico: HistoricoImpressaoResponse, cabecalho: DadosCabecalho, resultadosFinalRede: any[]
  - Injeta: EventTagService, FiltroStore

### historico-observacoes
- **HistoricoObservacoesComponent** `app-historico-observacoes`
  - Injeta: FormBuilder, HistoricoObservacoesSelecaoService, HistoricoObservacoesService, Router, ToastrService

### historico-serie
- **HistoricoSerieComponent** `app-historico-serie`
  - Injeta: FormBuilder, HistoricoSerieSelecaoService, HistoricoSerieService, ListaDisciplinasService, ProgressService, ... +1

### home
- **HomeComponent** `app-home`
  - Injeta: HomeService, Router, TranslateService, UsuarioService

### livro-matricula
- **DocGridLivroMatriculaComponent** `app-doc-grid-livro-matricula`
  - @Input: alunos: Array<AlunoLivroMatriculaResponse>, indexInit: number, exibirRa: boolean, exibirCodigoInep: boolean... +3
  - Injeta: ElementRef
- **LivroMatriculaComponent** `app-livro-matricula`
  - @Input: dados: LivroMatriculaDocumentResponse | null
  - Injeta: ElementRef, PageControlService

### multi-select
- **MultiSelectComponent** `multi-select`
  - @Input: control: FormControl | AbstractControl, options: MultiSelectOption[], fieldName: string, placeholder: string... +4
  - @Output: eventChange
  - Injeta: MultiSelectOption

### multiselect-field
- **MultiSelectFieldComponent** `app-multi-select-field`
  - @Input: dataSource: IOptionField[], closeOnSelect: boolean, searchable: boolean, bindLabel: string... +4
  - @Output: eventChange
  - Injeta: NgControl

### ng-select-field
- **NgSelectFieldComponent** `app-ng-select-field`
  - @Input: dataSource: INgOptionField[], closeOnSelect: boolean, searchable: boolean, bindLabel: string... +4
  - @Output: eventChange, eventSearch
  - Injeta: SelectService

### portal-modulo
- **InputPesquisaHeaderComponent** `input-pesquisa-header`
  - Injeta: PortalConfig
- **LogarComoComponent** `logar-como`
  - Injeta: AlertService, ModalService, PortalConfig, UsuarioService
- **LogoEscolaComponent** `logo-escola`
  - Injeta: PortalConfig, UsuarioService
- **MenuLateralComponent** `menu-lateral`
  - Injeta: MenuService, UsuarioService
- **PortalAlertComponent** `portal-alert`
  - Injeta: AlertService, ElementRef
- **PortalAuthComponent** `atlas-modulo-auth`
  - Injeta: ActivatedRoute, AlertService, PortalConfig, UsuarioService
- **PortalBodyComponent** `portal-body`
- **PortalGuiaComponent** `portal-guia`
  - Injeta: GuiaPortalService, PortalConfig, UsuarioService
- **PortalHeaderComponent** `portal-header`
  - @Output: onLateralMenuClick
  - Injeta: Boolean
- **PortalHeaderProgressComponent** `portal-header-progress`
  - Injeta: ProgressService
- **PortalMenuComponent** `portal-menu`
  - @Input: menuLateralVisibel: boolean
  - Injeta: ElementRef, MenuService, ModalService, UsuarioService
- **PortalMenuElevaIdComponent** `portal-menu-eleva-id`
  - Injeta: PortalConfig, UsuarioService
- **PortalMenuNotificacoesComponent** `portal-menu-notificacoes`
  - Injeta: NotificacaoService, PortalConfig, UsuarioService
- **PortalMenuPerfilComponent** `portal-menu-perfil`
  - Injeta: MenuPerfilService, MenuService, ModalService, PortalConfig, UsuarioService
- **PortalModalComponent** `portal-modal`
  - @Input: modalId: string
  - Injeta: ElementRef, ModalService
- **PortalModuloComponent** `portal-modulo`
  - Injeta: CookieService, UsuarioService
- **SkeletonBoxComponent** `skeleton-box`

### radio-field
- **RadioFieldComponent** `app-radio-field`
  - @Input: required: boolean, label: string, dataSource: IRadioOptionField[]
  - @Output: eventChange
  - Injeta: NgControl

### select-field
- **SelectFieldComponent** `app-select-field`
  - @Input: options: ISelectOptions[], closeOnSelect: boolean, label: string, searchable: boolean... +4
  - @Output: eventChange
- **SelectFieldComponent** `single-select`
  - @Input: control: FormControl | AbstractControl, options: SelectOption[], placeholder: string, required: boolean... +4
  - @Output: onChange, onSearch
  - Injeta: SelectOption

### text-field
- **TextFieldComponent** `app-text-field`
  - @Input: label: string, required: boolean, maxlength: number, mask: string
  - @Output: eventChange
  - Injeta: NgControl

### textarea-field
- **TextAreaFieldComponent** `app-textarea-field`
  - @Input: label: string, required: boolean, mask: string, rows: number... +2
  - Injeta: NgControl

### turma
- **TurmaComponent** `app-turma`
  - Injeta: EventTagService, FiltroSync, NotificationService, TurmasService

## Services

### alunos
- **AlunoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getAlunos, getAlunoByHash
- **FilterSelecaoService** (root)
  - Métodos: guardaFiltro, guardaFiltroSelecionado
- **SelecaoAlunoService** (root)
  - Métodos: guardaSelecao

### app
- **HttpTokenInterceptor** (none)
  - Injeta: UsuarioService
  - Métodos: intercept, if

### cache_service
- **CachingInterceptor** (none)
  - Injeta: HttpCacheService
  - Métodos: intercept, if, tap
- **HttpCacheService** (root)
  - Métodos: get, set, has, clear

### certificado-conclusao
- **CertificadoConclusaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get

### components
- **ComponenteCurricularService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTipoComponenteCurricular, getComponenteCurricular, save
- **ListaDisciplinasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTipoComponenteCurricular, getAreasConhecimento, getComponenteCurricular, save
- **PhotoService** (root)
  - Injeta: UsuarioService
  - Métodos: getPhotoUrl, if, if, if, if, if, ... +1
- **RegionalService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPaises, getEstados, getMunicipios

### configuracao
- **ConfiguracaoEscolaSelecaoService** (root)
  - Métodos: guardaSelecao
- **ConfiguracaoFundamentacaoLegalService** (root)
  - Métodos: guardaSelecao
- **ConfiguracaoPreviewService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: atualizarConfiguracao, getAtualizacaoConfiguracao, getCaminhosBrasoesByRede
- **ConfiguracaoRedeCertificadoConclusaoService** (root)
  - Injeta: ApiClient
  - Métodos: save
- **ConfiguracaoRedeSelecaoService** (root)
  - Métodos: guardaSelecao
- **EscolaAnoLetivoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: updateConfiguracaoEscolaAnoLetivo, getEnderecoAnosLetivos
- **EscolaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getConfiguracoesEscolas, getConfiguracao, updateConfiguracaoEscolas
- **FundamentacaoLegalService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getFundamentacaoLegal, updateFundamentacaoLegal, emUso
- **RedeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getConfiguracaoRede, getTiposCertificado, getConfiguracao, updateConfiguracaoRede, updateConfiguracaoRedeGeral, updateConfiguracaoRedeHistorico, ... +2
- **RotaSelecaoService** (root)
  - Métodos: guardaSelecao

### confirm
- **ConfirmDialogService** (none)
  - Injeta: TranslateService
  - Métodos: confirmThis, if, if, getMessage

### daterangepicker-field
- **I18n** (none)
  - Injeta: I18n
  - Métodos: getWeekdayShortName, getMonthShortName, getMonthFullName, getWeekdayLabel, getDayAriaLabel

### editar-fundamentacao-aluno
- **EditarFundamentacaoSelecaoService** (root)
  - Métodos: guardaSelecao
- **HistoricoFundamentacaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: update

### editar-informacoes
- **EditarInformacoesSelecaoService** (root)
  - Métodos: guardaSelecao
- **EditarInformacoesService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: update

### editar-registro-certificado
- **EditarRegistroCertificadoSelecaoService** (root)
  - Métodos: guardaSelecao
- **EditarRegistroCertificadoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get, update

### ficha-individual
- **RelatorioService** (root)
  - Injeta: ApiClient, HttpClient
  - Métodos: getDocumentoDiarioClasse

### filtro
- **Filtro** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, series
- **FiltroStore** (root)
  - Métodos: set, get, if, reset, setPage
- **FiltroSync** (root)

### gerador-documentos
- **PageControlService** (root)
  - Métodos: updateAttr, if, for, adicionarNovaPagina, adicionarComponente, if, ... +2
- **PrintService** (root)
  - Métodos: setTimeout, for, if, reset

### historico-impressao
- **FichaIndividualImpressaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get
- **HistoricoImpressaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get

### historico-observacoes
- **HistoricoObservacoesSelecaoService** (root)
  - Métodos: guardaSelecao
- **HistoricoObservacoesService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: create, get, getByAluno, updateObservacoes

### historico-serie
- **HistoricoSerieSelecaoService** (root)
  - Métodos: guardaSelecao
- **HistoricoSerieService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTipoResultadoFinal, getSeries, getSeriesDisponiveis, getAnosLetivos, getEscolaExternas, updateEscolaSerie, ... +2

### home
- **HomeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: possuiAcesso

### multi-select
- **MultiSelectCoordinatorService** (root)
  - Métodos: register, open, if

### portal-modulo
- **AlertService** (root)
  - Métodos: showSuccess, showAlert, showError, setAlertComponent, if
- **CookieService** (root)
  - Injeta: Document
  - Métodos: addToDOM
- **FuncionalidadeAcessadaService** (root)
  - Injeta: HttpClient
- **GuiaPortalService** (root)
  - Injeta: HttpClient, PortalConfig
  - Métodos: getGuia, updateUsuarioDispensouGuia, updateUsuarioVisualizouGuia
- **HttpRequestInterceptor** (none)
  - Injeta: ProgressService
  - Métodos: intercept
- **MenuPerfilService** (root)
  - Injeta: UsuarioService
  - Métodos: update
- **MenuService** (root)
  - Injeta: HttpClient, ModalService, PortalConfig, UsuarioService
  - Métodos: clear, get, if, if, registrarAcesso
- **ModalService** (root)
  - Injeta: IModal
  - Métodos: add, remove, open, close
- **NotificacaoService** (root)
  - Injeta: HttpClient, PortalConfig
  - Métodos: get
- **ProgressService** (root)
  - Injeta: PortalHeaderProgressComponent
  - Métodos: complete, if, for, show, if, for, ... +1
- **UsuarioService** (root)
  - Injeta: HttpClient, PortalConfig
  - Métodos: logoff, logoffElevaId, logarComo, alternarPerfisDeAcessoDoUsuario, irParaLogin, alternarPessoasEscolaAcesso, ... +2

### route-guard
- **IsAllowed** (root)
  - Injeta: Router, UsuarioService
  - Métodos: canActivate, if
- **IsDesktopGuard** (root)
  - Injeta: Router
  - Métodos: canActivate, if
- **IsLoggedGuard** (root)
  - Injeta: UsuarioService
  - Métodos: canActivate
- **IsMobileGuard** (root)
  - Injeta: Router
  - Métodos: canActivate, if

### services
- **AnalyticsService** (root)
  - Injeta: Router
  - Métodos: init, if, if, if
- **ApiClient** (root)
  - Injeta: HttpClient
  - Métodos: get, getBlob, post, put, delete
- **DateUtilsService** (root)
  - Injeta: DatePipe
  - Métodos: transformJsonToDate, transformDate
- **EventTagService** (root)
  - Métodos: click, if
- **FileService** (root)
  - Injeta: ApiClient
  - Métodos: downloadFile
- **FotoPortalService** (root)
  - Injeta: ApiClient
  - Métodos: downloadFile
- **HandleApiError** (root)
  - Injeta: NotificationService, TranslateService, UsuarioService
  - Métodos: if, for, if, switch
- **ImpressaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get
- **NotificationService** (root)
  - Injeta: ToastrService
  - Métodos: showSuccess, showError, showInfo, showWarning, showLongTimeInfo
- **PreferenciaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getCardsPorLinha, updateCardsPorLinha
- **SelectService** (root)
- **User** (root)
  - Injeta: ApiClient
  - Métodos: getUserName

### turma
- **TurmasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTurma, getImpressao, getImpressaoLivroMatricula, getAlunosByHashTurma, save

## Models

- **AcessoUsuarioModel** (interface): IdPerfilDeAcessoDoUsuario: number | null, IdPessoaEscolaAcesso: number | null, IdSegmento: number | null, Nome: string, EscolaHash: string | null, ... +3
- **AlunoAtaResponse** (type): nomeAluno: string, cpf: string, dataNascimento: string, hashUsuario: string, ra: string, ... +3
- **AlunoFichaIndividualResponse** (interface): hash: string, alunoHash: string, nome: string, ra: string, raDigital: string, ... +3
- **AlunoHistoricoImpressaoResponse** (interface): anoLetivo: number, codigoInep: string, raDigital: string, cpf: string, dataNascimento: string, ... +3
- **AlunoLivroMatriculaResponse** (type): dataMatricula: string, dataNascimento: string, nomeAluno: string, filiacao: string, serie: string, ... +3
- **AlunoResponse** (interface): hash: string, nomeAluno: string, ra: string, rg: string, cpf: string, ... +3
- **AlunoResultadoResponse** (interface): series: HistoricoSerieResponse[], fundamentacoes: HistoricoFundamentacoesResponse[], hashEscola: string
- **AlunoSeriesModel** (interface): hashHistoricoSerie: string, hashAnoLetivo: string, nomeAnoLetivo: number, nomeRede: string, nomeSegmento: string, ... +3
- **AlunosFichaRequest** (type): hashSerie: string, hashTurma: string
- **AnoSerieFichaIndividual** (interface): hashAnoLetivo: string, nomeAnoLetivo: string, hashSerie: string, nomeSerie: string, fichasIndividuaisGetResponse: FichaIndividualGetResponse, ... +1
- **AreaConhecimentoModel** (interface): hash: string, descricao: string
- **AreaDoConhecimento** (interface): nome: string, nomeAbreviado: string, hash: string, resultados: ResultadoFinalModel[]
- **ArquivoModel** (interface): NomeGuia: string | null, LinkArquivo: string | null
- **Assinatura** (type): funcao: string, nome: string, exibir: boolean
- **AtaResultadoFinalImpressaoModel** (interface)
- **AtaResultadosFinaisDocumentoRequest** (type): hashAnoLetivo: string, hashRede: string, hashEscola: string, hashTurma: string, hashSerie: string
- **AtaResultadosFinaisDocumentoResponse** (type): alunos: Array<AlunoAtaResponse>, configuracaoRede: ConfiguracaoRedeResponse, configuracaoEscola: EscolaAtaResponse, configuracaoEscolaPorAnoLetivo: ConfiguracaoEscolaAnoLetivoResponse, turma: TurmaAtaResonse, ... +3
- **AtaResultadosFinaisObservacoesRequest** (interface): hashTurma: string, observacao: string
- **CabecalhoImpressaoRequest** (interface): hashEscola: string, hashRede: string, hashAnoLetivo: string
- **CargaHorariaPorDisciplinaSegmentoResponse** (interface): nomeDisciplina: string, nomeSegmento: string, cargaHorariaTotal: string, descricaoTipoComponenteCurricular: string
- **CargaHorariaPorSegmentoResponse** (interface): nomeSegmento: string, cargaHorariaTotal: string
- **CertificadoConclusaoAlunoResponse** (interface): nomeAluno: string, nacionalidade: string, rg: string, cpf: string, uf: string, ... +3
- **CertificadoConclusaoAreaDoConhecimentoResponse** (interface): areaConhecimento: string, disciplinas: CertificadoDisciplinaResponse[]
- **CertificadoConclusaoDisciplinasPorAreaResponse** (interface): cargaHorariaTotal: string, areas: CertificadoConclusaoAreaDoConhecimentoResponse[]
- **CertificadoConclusaoDisciplinasResponse** (interface): cargaHorariaTotal: string, disciplinas: CertificadoDisciplinaResponse[], disciplinasParteDiversificada: CertificadoDisciplinaResponse[]
- **CertificadoConclusaoDocumentoResponse** (interface): dadosAluno: CertificadoConclusaoAlunoResponse, escolas: CertificadoConclusaoEscolaPorSegmentoResponse[], dadosEscolaAtual: EscolaCertificadoConclusaoResponse, dataConclusao: string, localDataDocumento: string, ... +3
- **CertificadoConclusaoEscolaPorSegmentoResponse** (interface): curso: string, anoConclusao: number, nomeEscola: string, cidade: string, uf: string, ... +1
- **CertificadoConclusaoPorAlunoDocumento** (interface): ra: string, nomeDocumento: string, dadosFinalizado: boolean, salvo: boolean, dados: CertificadoConclusaoDocumentoResponse, ... +3
- **CertificadoDisciplinaResponse** (interface): nome: string, cargaHoraria: string
- **Certificados** (interface): ensinoMedio: string, ensinoFundamental: string
- **ComponenteCurricularModel** (interface): disciplina: String, tipo: String, nota: String, cargaHoraria: String, ehEnriquecimentoCurricular: boolean, ... +1
- **ConfigDocumento** (interface): assinaturaEmTodasAsFolhas: boolean, mostrarCabecalho: boolean
- **ConfiguracaoEscolaAnoLetivoResponse** (interface): hashAnoLetivo: string, nomeOficial: string, cnpj: string, telefone: string, endereco: string, ... +2
- **ConfiguracaoEscolaModel** (interface): hashEscola: string, nomeRede: string, cidade: string, uf: string, descricao: string, ... +3
- **ConfiguracaoEscolaPorAnoLetivo** (type)
- **ConfiguracaoEscolaRequest** (interface): hashRede: string
- **ConfiguracaoEscolaResponse** (interface): hashEscola: string, descricao: string, cidade: string, uf: string, telefone: string, ... +3
- **ConfiguracaoFundamentacaoLegal** (interface): descricao: string, hash: string, ativo: boolean, novo: boolean, foiEditado: boolean
- **ConfiguracaoRede** (interface): geral: boolean, historico: boolean, ficha: boolean, ata: boolean, livro: boolean, ... +1
- **ConfiguracaoRedeAtaResultadosFinaisRequest** (interface): hashRede: string, ataDeResultadosPorSerie: boolean, exibirCodigoINEPNaAtaDeResultadosFinais: boolean, exibirRADigitalNaAtaDeResultadosFinais: boolean, exibirCargaHorariaPorDisciplina: boolean, ... +3
- **ConfiguracaoRedeCertificadoConclusaoResponse** (interface): hashRede: string, tipoBrasaoEsquerda: string, tipoBrasaoCentro: string, tipoBrasaoDireita: string, leiTermo: string, ... +3
- **ConfiguracaoRedeCertificadoConclusaoUpdateRequest** (interface): hashRede: string, nomeBrasaoEsquerda: string, brasaoEsquerdaId: number, nomeBrasaoCentro: string, brasaoCentroId: number, ... +3
- **ConfiguracaoRedeEscolaRequest** (type): hashEscola: string, hashRede: string
- **ConfiguracaoRedeEscolaResponse** (type): escola: ConfiguracaoEscolaResponse, rede: ConfiguracaoRedeResponse
- **ConfiguracaoRedeFichaRequest** (interface): hashRede: string, fichaIndividualResumida: boolean, ocultarResultadosParciaisFichaIndividual: boolean, deveAgruparPorAreaDoConhecimento: boolean, exibirCargaHorariaFichaIndividual: boolean, ... +1
- **ConfiguracaoRedeGeralRequest** (interface): hashRede: string, exibirTituloCentralizadoNoDocumento: boolean, notasComUmaCasaDecimal: boolean, seriesNomenclatura: SerieNomenclaturaPorRedeResponse[], statusAprovadoPeloConselho: boolean, ... +1
- **ConfiguracaoRedeHistoricoRequest** (interface): hashRede: string, ocultarResultadosParciais: boolean, incluirBrasao: boolean, utilizaBrasaoDoPais: boolean, utilizaBrasaoUnesco: boolean, ... +3
- **ConfiguracaoRedeLivroMatriculaRequest** (interface): hashRede: string, ordemDataMatriculaLivroMatricula: boolean, agruparPorSegmentoLivroMatricula: boolean, exibirRaLivroMatricula: boolean, exibirRaDigitalLivroMatricula: boolean, ... +1
- **ConfiguracaoRedePreview** (interface): tipoBrasaoCentro: string, tipoBrasaoDireita: string, tipoBrasaoEsquerda: string
- **ConfiguracaoRedeResponse** (interface): hash: string, descricao: string, incluirBrasao: boolean, utilizaBrasaoDoPais: boolean, utilizaBrasaoUnesco: boolean, ... +3
- **ConfiguracaoRedeUpdateRequest** (interface): hashRede: string, incluirBrasao: boolean, utilizaBrasaoDoPais: boolean, utilizaBrasaoUnesco: boolean, possuiObservacao: boolean, ... +3
- **ConfiguracoesSelecionadas** (interface): tipoBrasaoRede: string, tipoBrasaoEstado: string, tipoBrasaoPais: string, tipoBrasaoUnesco: string, moldura: string, ... +3
- **DadosCabecalho** (interface): logo: string, escola: string, endereco: string, bairro: string, cep: string, ... +3
- **DadosEscola** (interface): nomeOficial: string, cidade: string
- **DisciplinaAtaResponse** (type): disciplina: string, cargaHoraria: string, ehEnriquecimentoCurricular: boolean, resultados: Array<ResultadoAtaResponse>
- **DocumentSettings** (type): fontSize: number, layout: PageLayout
- **DocumentoInterativoModel** (interface): tipoDocumento: string, brasao: boolean, observacao: boolean, mostrarCabecalho: boolean, cabecalho: boolean, ... +3
- **EditarInformacoesRequest** (interface)
- **EditarInformacoesResponse** (interface)
- **ElevaIdModel** (interface)
- **EscolaAnoLetivoGetResponse** (interface): hashEscolaAnoLetivo: string, hashEscola: string, hashAnoLetivo: string, nomeAnoLetivo: string, nomeOficial: string, ... +3
- **EscolaAtaResponse** (type): assinaturaEmTodasAsFolhas: boolean, mostrarCabecalho: boolean, possuiCabecalho: boolean, cabecalho: string, cidade: string, ... +3
- **EscolaCertificadoConclusaoResponse** (interface): nomeEscola: string, assinaturaSecretaria: string, endereco: string, telefone: string, bairro: string, ... +3
- **EscolaExternaFilterRequest** (interface): nome: string, hashPais: string, hashEstado: string, hashMunicipio: string
- **EscolaExternaRequest** (interface): nome: string, hashPais: string, hashEstado: string, hashMunicipio: string
- **EstadoResponse** (interface): hashEstado: string, siglaEstado: string, nomeEstado: string
- **FichaIndividualAlunosGetResponse** (interface): nomeRedeEscola: string, serie: string, nomeSegmento: string, turma: string, hashTurma: string, ... +3
- **FichaIndividualAreaDoConhecimento** (interface): nome: string, hash: string, disciplinas: Array<FichaIndividualDisciplinaGetResponse>
- **FichaIndividualCaractereResponse** (type): caracterParaIndicarPendencia: string, caracterParaIndicarPresenca: string, caracterParaIndicarFalta: string, caracterParaIndicarTransferencia: string
- **FichaIndividualColunaGetResponse** (interface): hash: string, descricao: string, notaMaxima: number, ehResultado: boolean
- **FichaIndividualConteudoResponse** (type): conteudo: string, dataAula: Date, atividades: string
- **FichaIndividualDisciplinaGetResponse** (interface): areaConhecimento: string, cargaHoraria: string, hashDisciplina: string, nomeDisciplina: string, ehEnriquecimentoCurricular: boolean, ... +1
- **FichaIndividualDivisaoPorPagina** (type): areas: Array<FichaIndividualAreaDoConhecimento>
- **FichaIndividualEscopoGetResponse** (interface): nomeComponente: string, etapas: Array<FichaIndividualEtapaGetResponse>, disciplinas: Array<FichaIndividualDisciplinaGetResponse>, areaDoConhecimento: Array<FichaIndividualAreaDoConhecimento>
- **FichaIndividualEtapaGetResponse** (interface): hash: string, descricao: string, colunas: Array<FichaIndividualColunaGetResponse>
- **FichaIndividualGetRequest** (interface): hashRede: string, hashUsuario: string, hashAnoLetivo: string, hashSerie: string
- **FichaIndividualGetResponse** (interface): escopoRegular: FichaIndividualEscopoGetResponse, escopoDiversificado: FichaIndividualEscopoGetResponse, escopoItinerarioSemestral: FichaIndividualEscopoGetResponse, escopoDependencia: FichaIndividualEscopoGetResponse, percentualFrequencia: string, ... +3
- **FichaIndividualGridPorEscopoModel** (type): agruparPorAreaConhecimento: boolean, areas: Array<FichaIndividualDivisaoPorPagina>, areasDoConhecimento: Array<FichaIndividualAreaDoConhecimento>, lista: FichaIndividualDisciplinaGetResponse[], etapas: FichaIndividualEtapaGetResponse[], ... +1
- **FichaIndividualLegendaGetResponse** (interface): sigla: string, descricao: string
- **FichaIndividualPorAlunoDocumento** (interface): ra: string, nomeDocumento: string, dadosFinalizado: boolean, salvo: boolean, dados: FichaIndividualGetResponse, ... +3
- **FilterParams** (interface): hashAnosLetivos: any[], hashRedes: any[], hashEscolas: any[], hashSeries: any[], situacoesAluno: any[], ... +2
- **FilterParamsSelected** (interface)
- **FilterRequestData** (interface): data: any[], errors: any[], isSuccess: boolean, message: string
- **FundamentacaoLegalDataSaveRequest** (interface): hashFundamentacaoLegal: string, descricao: string, ativo: boolean
- **FundamentacaoLegalSaveRequest** (interface): hashRede: string, data: FundamentacaoLegalDataSaveRequest[]
- **GridAlunosItem** (type): alunos: Array<AlunoAtaResponse>, init: number
- **GridAlunosLivroMatricula** (type): nomeComponente: string, lista: Array<AlunoLivroMatriculaResponse>, init: number
- **GridAlunosPorDisciplina** (type): nomeComponente: string, disciplinas: Array<DisciplinaAtaResponse>, lista: Array<AlunoAtaResponse>, init: number
- **GridInfo** (type): nomeAluno: string, matricula: string, serie: string, segmento: string, rg: string, ... +3
- **GuiaPortalModel** (interface): isualizado: boolean, Dispensado: boolean
- **HistoricoCreateRequest** (interface): hashAluno: string, anoLetivoId: number, anoLetivo: number
- **HistoricoFundamentacaoDataSaveRequest** (interface): hashHistoricoFundamentacao: string, hashFundamentacaoLegal: string, ativo: boolean
- **HistoricoFundamentacaoSaveRequest** (interface): hashRede: string, hashHistorico: string, data: HistoricoFundamentacaoDataSaveRequest[]
- **HistoricoFundamentacoesResponse** (interface): hash: string, hashHistoricoFundamentacao: string, descricao: string
- **HistoricoImpressaoResponse** (interface): aluno: AlunoHistoricoImpressaoResponse, configuracaoEscola: ConfiguracaoEscolaResponse, configuracaoEscolaPorAnoLetivo: ConfiguracaoEscolaAnoLetivoResponse[], configuracaoRede: ConfiguracaoRedeResponse, historicoSeries: AlunoSeriesModel[], ... +3
- **HistoricoObservacoesResponse** (interface): hash: string, hashAluno: string, anoLetivoId: number, anoLetivo: number, observacoesFundamental: string, ... +3
- **HistoricoRegistroCertificadoRequest** (interface): hash: string, numeroRegistroCertificado: string, folhaRegistroCertificado: string, livroRegistroCertificado: string
- **HistoricoRegistroCertificadoResponse** (interface): hash: string, hashAluno: string, numeroRegistroCertificado: string, folhaRegistroCertificado: string, livroRegistroCertificado: string
- **HistoricoSerie** (interface): ativo: true, dataInativacao: string, dataInclusao: string, escolaSeries: string, hash: string, ... +3
- **HistoricoSerieResponse** (interface): hashHistoricoSerie: string, cursadoNoEleva: boolean, hashAnoLetivo: string, hashSegmento: string, hashSerie: string, ... +3
- **HistoricoSerieSaveRequest** (interface): hashHistoricoSerie: string, hashAnoLetivo: string, hashSerie: string, hashHistorico: string, hashPais: string, ... +3
- **HistoricoSerieSelecao** (interface): serieSelecionada: HistoricoSerieResponse
- **IConfirmModel** (interface): message: string, textOk: string, textCancel: string, title: string, description: string
- **IElevaIdToken** (interface): AccessToken: string, AccessTokenExpiration: Date
- **IExceptionCommonError** (interface): type: EnumValidationErrorType, message: string
- **IExceptionFormError** (interface): type: EnumValidationErrorType, messages: IExceptionFormErrorMessage[]
- **IExceptionFormErrorMessage** (interface): property: string, error: string
- **IExceptionImportError** (interface): type: EnumValidationErrorType, messages: IExceptionImportErrorMessage[]
- **IExceptionImportErrorMessage** (interface): linha: string, propriedade: string, valor: any, descricao: string
- **IFilterModel** (interface): HashRede: string, NomeRede: string, HashEscola: string, NomeEscola: string, HashSerie: string, ... +3
- **IGridCheckedItem** (interface): id: any, checked: boolean
- **IGridColumnDef** (interface): headerName: string, field: string, width: string, centralized: boolean
- **IGridRowActions** (interface): width: string, actions: IGridRowActionsItems[]
- **IGroupOptionField** (interface): groupLabel: string, groupOptions: IOptionField[] | IRadioOptionField[]
- **INgOptionField** (interface): hash: string, descricao: string
- **IOptionField** (interface): id: any, name: string
- **IPagingParams** (interface): page: number, limit: number
- **IRadioOptionField** (interface): value: any, label: string, disabled: boolean
- **ISelectOptions** (interface): value: string, label: string
- **IUser** (interface): Nome: string, Matricula: string
- **LivroMatriculaDocumentResponse** (type): resultadosPorSegmento: boolean, tituloAgrupamento: string, configuracaoRede: ConfiguracaoRedeResponse, configuracaoEscola: ConfiguracaoEscolaResponse, configuracaoEscolaPorAnoLetivo: ConfiguracaoEscolaAnoLetivoResponse, ... +3
- **MunicipioResponse** (interface): hashEstado: string, siglaEstado: string, nomeEstado: string, hashMunicipio: string, nomeMunicipio: string, ... +1
- **ObservacoesRequest** (interface): hashHistoricoSerie: string, observacoesAluno: string
- **PageControlComponentModel** (type): name: string, group: any, index: number, height: number, lastComponent: boolean
- **Paginacao** (interface)
- **PaisResponse** (interface): hashPais: string, possuiEstados: boolean, nomePais: string
- **Rede** (interface): hash: string, nome: string, tipoRede: TipoRede, tipoRedeId: number, caminhoArquivoLogo: string, ... +3
- **ResultadoAtaResponse** (type): hashUsuario: string, nota: string, frequencia: string
- **ResultadoFinalModel** (interface): ativo: true, bncc: boolean, cargaHoraria: string, descricaoTipoComponenteCurricular: string, disciplina: string, ... +3
- **ResultadoFinalResponse** (interface): hashResultadoFinal: string, cargaHoraria: string, hashTipoResultadoFinal: string, hashTipoComponenteCurricular: string, hashAreaConhecimento: string, ... +3
- **ResultadoFinalSaveRequest** (interface): hashHistoricoSerie: String
- **ResultadosFinaisAtaResponse** (type): hashUsuario: string, nota: string, frequencia: string, nomeResultadoFinal: string
- **SerieNomenclaturaPorRedeResponse** (interface): serie: string, nomenclatura: string, novaNomenclatura: string, hashSerie: string, hashSerieNomenclatura: string, ... +2
- **SerieResponse** (interface): hashSegmento: string, nomeSegmento: string, hashSerie: string, nomeSerie: string, ordem: string
- **SexoEnum** (interface): hash: String, descricao: String
- **StatusDownloadEmMassa** (interface): id: number, concluido: boolean, concluidoComErro: boolean, qtDownloads: number, qtDadosComSucesso: number, ... +2
- **TipoCertificadoConclusao** (interface): hash: string, descricao: string
- **TipoComponenteModel** (interface)
- **TipoRede** (interface): nome: string
- **TipoResultadoFinalResponse** (interface): hashTipoResultadoFinal: string, nome: string, sigla: string, aprovado: boolean, reprovado: boolean, ... +1
- **TurmaAtaResonse** (type): nome: string, hash: string, nomeSerie: string, hashSerie: string, hashSegmento: string, ... +3
- **TurmaResponse** (interface): hashRede: string, nomeRede: string, nomeEscola: string, nomeSerie: string, nomeTurma: string, ... +3
- **UsuarioAutenticadoModel** (interface): PossuiUsuarioAutenticado: boolean, AcessosUsuario: AcessoUsuarioModel[], ElevaId: ElevaIdModel, Email: string, Id: number, ... +3

## URLs de ambiente

- `api`
- `https://localhost/documentacao-pedagogica/api`

---
*105 componentes · 71 services · 9 módulos · 154 models · 14 rotas*