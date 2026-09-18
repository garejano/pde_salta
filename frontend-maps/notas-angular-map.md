# Angular Map — notas
> Gerado em: 2026-07-30  
> Fonte: `C:\projects\notas\frontend`

## Módulos

- **AppModule** · declara: [AppComponent, ToastrElevaComponent, NavigationTabsComponent, ListarHistoricoComponent, ListarLancamentosComponent, ... +46] · importa: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, CommonModule, HammerModule, ... +12] · exporta: [FiltroHistoricoLancamentosComponent, FiltroNeeComponent]
- **AppRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **CoreModule** · declara: [GridComponent, ConfirmDialogComponent, MultiSelectFieldComponent, SelectFieldComponent, NgSelectFieldComponent, ... +10] · importa: [CommonModule, NgxPaginationModule, ReactiveFormsModule, NgSelectModule, FormsModule, ... +11] · exporta: [GridComponent, ConfirmDialogComponent, FontAwesomeModule, TranslateModule, ... +18]
- **DatepickerModule** · declara: [DatepickerComponent] · importa: [CommonModule, TooltipModule] · exporta: [DatepickerComponent]
- **GeradorDocumentosModule** · declara: [DocumentViewerComponent, DocumentTopbarComponent, DocumentPageComponent, DocFooterComponent, DocHeaderComponent, ... +7] · importa: [CommonModule, SharedModule] · exporta: [DocumentViewerComponent, DocumentTopbarComponent, DocumentPageComponent, DocFooterComponent, ... +8]
- **ModalElevaModule** · declara: [ModalElevaComponent] · importa: [CommonModule] · exporta: [ModalElevaComponent]
- **PageNotFoundModule** · declara: [PageNotFoundComponent] · importa: [CommonModule]
- **PortalModule** · declara: [PortalHeaderComponent, PortalMenuComponent, PortalModalComponent, LogarComoComponent, LogoEscolaComponent, ... +14] · importa: [CommonModule, FormsModule, NgbDropdownModule] · exporta: [PortalAuthComponent, PortalHeaderComponent, PortalModuloComponent, PortalBodyComponent, ... +3]
- **SemConteudoModule** · declara: [SemConteudoComponent] · importa: [CommonModule] · exporta: [SemConteudoComponent]
- **SharedModule** · declara: [ButtonComponent, IconButtonComponent, CirleIconButtonComponent, AvatarComponent] · importa: [CommonModule, LazyLoadImageModule] · exporta: [ButtonComponent, IconButtonComponent, CirleIconButtonComponent, AvatarComponent]
- **TooltipModule** · declara: [TooltipComponent, TooltipDirective] · importa: [CommonModule, BrowserModule] · exporta: [TooltipComponent, TooltipDirective]

## Rotas

- `path.HistoricoLancamento.Listar` → ListarHistoricoComponent `[isLoggedGuard]`
- `path.HistoricoLancamento.Detalhes` → DetalhesHistoricoComponent `[isLoggedGuard]`
- `path.Lancamento.Listar` → ListarLancamentosComponent `[isLoggedGuard]`
- `path.Lancamento.LancarNota` → LancarNotaComponent `[canDeactivateGuard, isLoggedGuard]`
- `path.Nee.Listar` → ListarAlunosNeeComponent `[isLoggedGuard]`
- `path.Nee.Detalhes` → DetalhesNeeComponent `[isLoggedGuard]`
- `path.Nee.Edicao` → EdicaoNeeComponent `[isLoggedGuard]`
- `path.RelatorioNee.Editor` → EditorRelatorioNEEComponent `[isLoggedGuard]`
- `path.MovimentacaoProfessores.Listar` → ListarMovimentacaoProfessoresComponent `[isLoggedGuard]`
- `path.MovimentacaoProfessores.Detalhes` → DetalheMovimentacaoProfessoresComponent `[isLoggedGuard]`
- `path.Alocacao.Turmas` → ListaTurmasComponent `[isLoggedGuard]`
- `path.ParametrosFolha.Listar` → ListarParametrosFolhaComponent `[isLoggedGuard]`
- `path.ParametrosFolha.Edicao` → AtualizarParametroComponent `[isLoggedGuard]`
- `path.GradeHoraria.Detalhes` → CadastroHorarioComponent `[isLoggedGuard]`
- `path.SelecaoEventos.Listar` → ListarSelecaoEventosComponent `[isLoggedGuard]`
- `path.SelecaoEventos.Edicao` → AtualizarEventosComponent `[isLoggedGuard]`
- `path.Auth` → PortalAuthComponent
- `path.PageNotFound` → PageNotFoundComponent
- `path.PageMaintenance` → PageMaintenanceComponent
- `**` → ?

## Componentes

### app
- **AppComponent** `app-root`

### avatar
- **AvatarComponent** `app-avatar`
  - @Input: userId: string, userName: string, photoUrl: string | null
  - Injeta: PhotoService

### button
- **ButtonComponent** `app-button`
  - @Input: label: string, classButton: string, disabled: boolean, icon: string... +4
  - @Output: clickEvent

### checkbox-field
- **CheckboxFieldComponent** `app-checkbox-field`
  - @Output: eventChange
  - Injeta: NgControl

### circle-icon-button
- **CirleIconButtonComponent** `app-circle-icon-button`
  - @Input: icon: string
  - @Output: clickEvent

### components
- **AvatarAlunoComponent** `app-avatar-aluno`
  - @Input: foto: any, nome: any
- **BarraBuscaComponent** `app-barra-busca`
  - @Input: btnBuscarDisabled: boolean, btnFiltroHide: boolean, filterCounter: number
  - @Output: changefilterStatus, atualizaBusca
- **BuscaNomeCpfComponent** `app-busca-nome-cpf`
  - @Input: invalid: boolean
  - @Output: resetBusca
  - Injeta: FiltroSync
- **BuscaNomeRaComponent** `app-busca-nome-ra`
  - @Input: invalid: boolean
  - @Output: resetBusca
  - Injeta: FiltroSync
- **BuscaProtocoloComponent** `app-busca-protocolo`
  - @Input: invalid: boolean
  - @Output: resetBusca
  - Injeta: FiltroSync
- **DetalhesAlunoComponent** `app-detalhes-aluno`
  - @Input: dados: any
- **EmptyMessageComponent** `app-empty-message`
  - @Input: message: string
- **FiltroComponent** `app-filtro`
  - @Input: ehAcessoCoordenador: boolean, config: FilterConfig, visible: boolean
  - @Output: submit, changefilterStatus, resetList
  - Injeta: NotificationService
- **FiltroHistoricoLancamentosComponent** `app-filtro-historico-lancamentos`
  - @Input: filterButtonActive: boolean, ehAcessoCoordenador: boolean
  - @Output: submit, changefilterStatus, resetList, filterCounter
  - Injeta: FiltroHistoricoLancamentos, FiltroSync, NotificationService, StateGuardService
- **FiltroNeeComponent** `app-filtro-nee`
  - @Input: filterButtonActive: boolean
  - @Output: submit, changefilterStatus, resetList, filterCounter
  - Injeta: FiltroNeeService, FiltroNeeSync, NotificationService, StateGuardService
- **ListaAnexosComponent** `app-lista-anexos`
  - @Input: hashPessoa: string, lista: AlunoLaudoMedicoGetResponse[]
  - @Output: atualizaListaAnexo
  - Injeta: AlunoNeeService, NotificationService
- **ListaPaginadaLancamentosComponent** `app-lista-paginada-lancamentos`
  - @Output: select
  - Injeta: DatePipe, LancamentosService, NotificationService, Router, StateGuardService
- **NavigationTabsComponent** `app-navigation-tabs`
  - Injeta: Router
- **SeuComponenteComponent** `app-editor`
- **TituloPageComponent** `app-titulo-page`
  - @Input: title: string
  - Injeta: Title
- **TooltipComponent** `app-tooltip`
  - @Input: position: string, icon: string
- **VisualizarComoSelectComponent** `app-visualizar-como-select`
  - @Input: loading: boolean, enabled: boolean
  - @Output: onSelect

### confirm
- **ConfirmDialogComponent** `app-confirm-dialog`
  - Injeta: ConfirmDialogService

### data-table
- **DataTableComponent** `app-data-table`
  - @Input: config: DataTableConfig, borderRadius: boolean, loading: boolean, overflow: boolean... +2
  - @Output: itemEscolhido

### date-field
- **DateFieldComponent** `app-date-field`
  - @Input: required: boolean, invalid: boolean
  - @Output: eventChange
  - Injeta: NgControl

### datepicker-module
- **DatepickerComponent** `app-datepicker`
  - @Input: config: CalendarConfig, min: Date, max: Date, start: Date... +3
  - @Output: change
  - Injeta: DateCalendar

### daterangepicker-field
- **DateRangePickerComponent** `app-daterange-picker`
  - @Input: label: string, required: boolean, nullable: boolean, initialYear: number... +3
  - @Output: eventDateChange
  - Injeta: ElementRef, NgbCalendar, NgbDateParserFormatter, Renderer2

### documentos
- **DocRelatorioNeeComponent** `app-doc-relatorio-nee`
  - @Input: textoRelatorio: string, tituloDocumento: string, cabecalho: DadosImpressaoDocumento, informacoesAluno: InformacoesAlunoRelatorioNEE
  - Injeta: ElementRef, PageControlService
- **DocTextoRelatorioNeeComponent** `app-doc-texto-relatorio-nee`
  - @Input: relatorio: string
  - Injeta: ElementRef

### gerador-documentos
- **AnoSelectComponent** `app-ano-select`
  - @Output: trocaAnoSerieEvent
  - Injeta: SelectService
- **DocAlunoNeeInfoComponent** `app-doc-aluno-nee-info`
  - @Input: info: InformacoesAlunoRelatorioNEE
  - Injeta: ElementRef
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
  - @Input: info: DadosImpressaoDocumento
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
  - @Input: controls: TemplateRef<any>, titulo: String
  - Injeta: EventTagService, PrintService

### grid
- **GridComponent** `app-grid-component`
  - @Input: editUrl: string, rowData: IGridRowData<any>, columnDefs: IGridColumnDef[], rowActions: IGridRowActions... +4
  - @Output: eventPageChange, eventRemoveAll, eventCheckChange, eventDelete
  - Injeta: NgxSpinnerService

### icon-button
- **IconButtonComponent** `app-icon-button`
  - @Input: icon: string, class: string
  - @Output: clickEvent

### input-pesquisa-header
- **InputPesquisaHeaderComponent** `input-pesquisa-header`
  - Injeta: PortalConfig

### lista
- **ListaComponent** `app-lista`
  - @Input: cabecalho: string[], lista: any[], loading: boolean, loadingEffect: boolean... +4
  - @Output: itemEscolhido

### loading
- **LoadingComponent** `app-loading`
  - @Input: mensagem: string

### logar-como
- **LogarComoComponent** `logar-como`
  - Injeta: AlertService, ModalService, PortalConfig, UsuarioService

### logo-escola
- **LogoEscolaComponent** `logo-escola`
  - Injeta: PortalConfig, UsuarioService

### menu-lateral
- **MenuLateralComponent** `menu-lateral`
  - Injeta: MenuService, UsuarioService

### modal-eleva
- **ModalElevaComponent** `app-modal-eleva`
  - @Input: showModal: boolean, closeButton: boolean, loading: boolean
  - @Output: closeModalEvent

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

### pages
- **AtualizarEventosComponent** `app-atualizar-eventos`
  - Injeta: FormBuilder, NotificationService, Router, SelecaoEventosService, StateGuardService
- **AtualizarParametroComponent** `app-atualizar-parametro`
  - Injeta: NotificationService, ParametrosFolhaService, Router, StateGuardService
- **CadastroHorarioComponent** `app-cadastro-horario`
  - Injeta: CadastroHorarioService, DatePipe, FiltroCadastroGradeService, FormBuilder, NotificationService
- **DetalheMovimentacaoProfessoresComponent** `app-detalhe-movimentacao-professores`
  - @Input: borderRadius: boolean, overflow: boolean
  - Injeta: AlocacaoProfessorService, DatePipe, FiltroAlocacaoProfessoresService, FormBuilder, MovimentacaoProfessorService, ... +1
- **DetalhesHistoricoComponent** `app-detalhes-historico`
  - Injeta: DatePipe, ProtocoloLancamentoService, Router, StateGuardService
- **DetalhesNeeComponent** `app-detalhes-nee`
  - @Input: lista: AlunoLaudoMedicoGetResponse[]
  - Injeta: AlunoNeeService, ImpressaoDocumentoService, Router
- **EdicaoNeeComponent** `app-edicao-nee`
  - @Input: lista: AlunoLaudoMedicoGetResponse[]
  - Injeta: AlunoNeeService, FormBuilder, NotificationService, Router, TipoTranstornoService
- **EditorRelatorioNEEComponent** `editor-relatorio-nee-component`
  - Injeta: AlunoNeeService, FormBuilder, NotificationService, Router
- **LancarNotaComponent** `app-lancar-nota`
  - Injeta: LancamentosService, NotificationService, Router, StateGuardService, TipoNotaFormativaService
- **ListaDisciplinasComponent** `app-lista-disciplinas`
  - Injeta: AlocacaoProfessorService, DatePipe, FormBuilder, NotificationService, RouteStateService, ... +1
- **ListaTurmasComponent** `app-lista-turmas`
  - Injeta: AlocacaoProfessorService, ChangeDetectorRef, FiltroAlocacaoProfessoresService, FormBuilder, RouteStateService, ... +1
- **ListarAlunosNeeComponent** `app-listar-alunos-nee`
  - Injeta: AlunoNeeService, ChangeDetectorRef, DatePipe, FiltroNeeService, NotificationService, ... +1
- **ListarHistoricoComponent** `app-listar-historico`
  - Injeta: AutenticacaoService, ChangeDetectorRef, DatePipe, FiltroHistoricoLancamentos, NotificationService, ... +1
- **ListarLancamentosComponent** `app-listar-lancamentos`
  - Injeta: AutenticacaoService, ChangeDetectorRef, DatePipe, FiltroHistoricoLancamentos, LancamentosService, ... +1
- **ListarMovimentacaoProfessoresComponent** `app-listar-movimentacao-professores`
  - Injeta: ChangeDetectorRef, DatePipe, FilterMovimentacaoProfessoresService, MovimentacaoProfessorService, NotificationService, ... +1
- **ListarParametrosFolhaComponent** `app-listar-parametros`
  - Injeta: ChangeDetectorRef, FiltroParametrosFolhaService, FormBuilder, NotificationService, ParametrosFolhaService, ... +1
- **ListarSelecaoEventosComponent** `app-listar-eventos`
  - Injeta: ChangeDetectorRef, FiltroSelecaoEventosService, FormBuilder, NotificationService, Router, ... +1
- **PageMaintenanceComponent** `app-page-maintenance`
- **PageNotFoundComponent** `app-page-not-found`
  - Injeta: PortalConfig
- **RegistrosAlocacaoComponent** `app-registros-alocacao`
  - Injeta: AlocacaoProfessorService, DatePipe, DateUtils, FormBuilder, NotificationService, ... +1
- **RegistrosAlocacaoSubstitutoComponent** `app-registros-alocacao-substituto`
  - Injeta: AlocacaoProfessorService, DateUtils, FormBuilder, NotificationService, RouteStateService, ... +1
- **RelatorioNeeAlunoComponent** `app-relatorio-nee-aluno`
  - @Input: textoRelatorio: string, dadosCabecalho: DadosImpressaoDocumento, infoAluno: InformacoesAlunoRelatorioNEE
- **UploadLaudoComponent** `app-upload-laudo`
  - @Input: hashEscola: string, hashPessoa: string, diagnostico: string, quantidadeLaudos: number
  - @Output: deveExibirFormAnexo, atualizaListaAnexo
  - Injeta: AlunoNeeService, FormBuilder, NotificationService

### paginacao
- **PaginacaoComponent** `app-paginacao`
  - @Input: loading: boolean, current: number, total: number, paginacao: Paginacao
  - @Output: goTo
  - Injeta: FiltroSync

### portal-alert
- **PortalAlertComponent** `portal-alert`
  - Injeta: AlertService, ElementRef

### portal-auth
- **PortalAuthComponent** `atlas-modulo-auth`
  - Injeta: ActivatedRoute, AlertService, PortalConfig, UsuarioService

### portal-body
- **PortalBodyComponent** `portal-body`

### portal-guia
- **PortalGuiaComponent** `portal-guia`
  - Injeta: GuiaPortalService, PortalConfig, UsuarioService

### portal-header
- **PortalHeaderComponent** `portal-header`
  - @Output: onLateralMenuClick
  - Injeta: Boolean

### portal-header-progress
- **PortalHeaderProgressComponent** `portal-header-progress`
  - Injeta: ProgressService

### portal-menu
- **PortalMenuComponent** `portal-menu`
  - @Input: menuLateralVisibel: boolean
  - Injeta: ElementRef, MenuService, ModalService, UsuarioService

### portal-menu-eleva-id
- **PortalMenuElevaIdComponent** `portal-menu-eleva-id`
  - Injeta: PortalConfig, UsuarioService

### portal-menu-notificacoes
- **PortalMenuNotificacoesComponent** `portal-menu-notificacoes`
  - Injeta: NotificacaoService, PortalConfig, UsuarioService

### portal-menu-perfil
- **PortalMenuPerfilComponent** `portal-menu-perfil`
  - Injeta: MenuPerfilService, MenuService, ModalService, PortalConfig, UsuarioService

### portal-modal
- **PortalModalComponent** `portal-modal`
  - @Input: modalId: string
  - Injeta: ElementRef, ModalService

### portal-modulo
- **PortalModuloComponent** `portal-modulo`
  - Injeta: CookieService, UsuarioService

### radio-field
- **RadioFieldComponent** `app-radio-field`
  - @Input: required: boolean, label: string, dataSource: IRadioOptionField[]
  - @Output: eventChange
  - Injeta: NgControl

### salvar
- **SalvarComponent** `app-salvar`
  - @Input: loading: boolean, disabled: boolean, label: string, mensagemAlerta: string... +1
  - @Output: saveEvent

### select-field
- **SelectFieldComponent** `app-select-field`
  - @Input: options: ISelectOptions[], closeOnSelect: boolean, label: string, searchable: boolean... +4
  - @Output: eventChange

### sem-conteudo
- **SemConteudoComponent** `app-sem-conteudo`
  - @Input: mensagem: string

### skeleton-box
- **SkeletonBoxComponent** `skeleton-box`

### table-filter
- **TableFilterComponent** `app-table-filter`
  - @Input: lista: [], toggleLabel: string, toggleAttributes: [], loading: boolean
  - @Output: filterEvent
  - Injeta: FormBuilder

### text-field
- **TextFieldComponent** `app-text-field`
  - @Input: label: string, required: boolean, maxlength: number, placeholder: string... +1
  - @Output: eventChange, requiredLabel
  - Injeta: NgControl

### textarea-field
- **TextAreaFieldComponent** `app-textarea-field`
  - @Input: label: string, required: boolean, mask: string, rows: number... +2
  - Injeta: NgControl

### titulo-tela
- **TituloTelaComponent** `app-titulo-tela`
  - @Input: titulo: string
  - @Output: emtVoltar

### toastr-eleva
- **ToastrElevaComponent** `app-toastr-eleva`

### tooltip-module
- **TooltipComponent** `app-tooltip`
  - @Input: text: string

### user-validation
- **UserValidationComponent** `app-user-validation`
  - @Output: ExpirationEvent
  - Injeta: AutenticacaoService, UsuarioService

## Services

### app.commons
- **RouteStateService** (root)
  - Métodos: hasData, clearData

### cache_service
- **CachingInterceptor** (none)
  - Injeta: HttpCacheService
  - Métodos: intercept, if, tap
- **HttpCacheService** (root)
  - Métodos: get, set, has, clear

### components
- **FiltroNeeSync** (root)
- **FiltroSync** (root)

### confirm
- **ConfirmDialogService** (none)
  - Injeta: TranslateService
  - Métodos: confirmThis, if, if, getMessage

### core
- **DateUtils** (root)
  - Injeta: DatePipe
  - Métodos: formatDateTime, formatDate, toISOString, addDays, parseDate, compareDates, ... +2

### datepicker-module
- **DateCalendar** (root)
  - Métodos: config, for, for, buildMonths, for, nextMonth, ... +2

### daterangepicker-field
- **I18n** (none)
  - Injeta: I18n
  - Métodos: getWeekdayShortName, getMonthShortName, getMonthFullName, getWeekdayLabel, getDayAriaLabel

### gerador-documentos
- **PageControlService** (root)
  - Métodos: init, initPages, adicionarNovaPagina, adicionarComponente, if, if, ... +2
- **PrintService** (root)
  - Métodos: setTimeout, for, if, reset

### interceptor
- **HttpRequestInterceptor** (none)
  - Injeta: ProgressService, UsuarioService
  - Métodos: intercept, if

### regional
- **RegionalService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPaises, getEstados, getMunicipios

### services
- **AlertService** (root)
  - Métodos: showSuccess, showAlert, showError, setAlertComponent, if
- **AlocacaoProfessorService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getQuantidadePaginas, getTurmas, getExportacaoTurmas, downloadFile, getMotivosAlocacoesVigentes, getAlocacoesVigentes, ... +2
- **AlunoNeeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getByNomeOuRaOuFiltro, getByAluno, save, disableNee, getPendentes, upload, ... +2
- **ApiClient** (root)
  - Injeta: HttpClient
  - Métodos: get, getBlob, post, put, getFilterBlob, delete
- **AutenticacaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPerfil, possuiAcesso
- **CadastroHorarioService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getSemana, getDisciplinas, saveAula, deleteAula, saveTempo, disableTempo, ... +2
- **CookieService** (root)
  - Injeta: Document
  - Métodos: addToDOM
- **DateUtilsService** (root)
  - Injeta: DatePipe
  - Métodos: transformJsonToDate, transformDate
- **EventTagService** (root)
  - Métodos: click, if
- **FileService** (root)
  - Injeta: ApiClient
  - Métodos: downloadFile
- **FilterMovimentacaoProfessoresService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, perfil, status
- **FiltroAlocacaoProfessoresService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, escola, segmento, serie, turma, disciplina
- **FiltroCadastroGradeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, series, turmas
- **FiltroHistoricoLancamentos** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: agrupamentos, anosLetivos, redes, chamadas, escolas, disciplinas, ... +2
- **FiltroNeeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, escolas, turnos, series, turmas, tipos
- **FiltroParametrosFolhaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, parametros, getParametrosPorRede, getQuantidadePaginas
- **FiltroSelecaoEventosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, eventos, getSelecoesEventosPorRede, getQuantidadePaginas
- **FiltroSync** (root)
- **FotoPortalService** (root)
  - Injeta: ApiClient
  - Métodos: downloadFile
- **FuncionalidadeAcessadaService** (root)
  - Injeta: HttpClient
- **GuiaPortalService** (root)
  - Injeta: HttpClient, PortalConfig
  - Métodos: getGuia, updateUsuarioDispensouGuia, updateUsuarioVisualizouGuia
- **HandleApiError** (root)
  - Injeta: NotificationService, TranslateService, UsuarioService
  - Métodos: if, for, if, if, if, if
- **ImpressaoDocumentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getDadosCabecalhora
- **LancamentosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPrazoAbertoProfessor, getAlunosLancamento, getPendetesPaginado, get, save
- **MenuPerfilService** (root)
  - Injeta: UsuarioService
  - Métodos: update
- **MenuService** (root)
  - Injeta: FuncionalidadeAcessadaService, HttpClient, ModalService, PortalConfig, ... +1
  - Métodos: clear, get, if, if, if, if, ... +2
- **ModalService** (root)
  - Injeta: IModal
  - Métodos: add, remove, open, close
- **MovimentacaoProfessorService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTiposLicenca, getQuantidadePaginas, getProfessores, getMovimentacaoProfessor, substituir, getLicencas, ... +2
- **NotificacaoService** (root)
  - Injeta: HttpClient, PortalConfig
  - Métodos: get
- **NotificationService** (root)
  - Injeta: ToastrService
  - Métodos: showSuccess, showError, showInfo, showWarning, showLongTimeInfo
- **ParametrosFolhaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: update, getPendencias, add
- **PhotoService** (root)
  - Injeta: UsuarioService
  - Métodos: getPhotoUrl, if, if, if, if, if, ... +1
- **ProgressService** (root)
  - Injeta: PortalHeaderProgressComponent
  - Métodos: complete, if, for, show, if, for, ... +1
- **ProtocoloLancamentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getByFiltro, getByCodigo, getRecentesParaProfessor, getLancamentos
- **SelecaoEventosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: update, adiciona
- **SelectService** (root)
- **StateGuardService** (none)
  - Métodos: guardState
- **TipoNotaFormativaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPorRede
- **TipoTranstornoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getAll
- **User** (root)
  - Injeta: ApiClient
  - Métodos: getUserName
- **UsuarioService** (root)
  - Injeta: HttpClient, PortalConfig, Router
  - Métodos: logoff, logoffElevaId, logarComo, alternarPerfisDeAcessoDoUsuario, irParaLogin, alternarPessoasEscolaAcesso, ... +2

## Models

- **AcessoUsuarioModel** (interface): IdPerfilDeAcessoDoUsuario: number | null, IdPessoaEscolaAcesso: number | null, IdSegmento: number | null, Nome: string, EscolaHash: string | null, ... +3
- **AlocacaoHistoricoResponse** (interface): nomeDisciplina: string, hashDisciplina: string, alocacoesHistorico: DetalheAlocacaoHistoricoResponse[]
- **AlocacaoHistoricoUpdateRequest** (interface): hashRede: string, hashDisciplinaFolha: string, hashTurma: string, hashAlocacaoFolha: string, hashProfessor: string, ... +3
- **AlocacaoProfessoreDisciplinaResponse** (interface): hash: string, nomeDisciplina: string, hashDisciplina: string, nomeProfessor: string, cpfProfessor: string, ... +3
- **AlocacaoProfessoresDisciplinasResponse** (interface): limiteAnoLetivo: string, alocacoes: AlocacaoProfessoreDisciplinaResponse[], motivosSaida: ResponseModel[]
- **AlocacaoSituacaoRequest** (interface): hashAlocacao: string, ehSubstituto: boolean
- **AlocacaoSubstituto** (interface): hash: string, hashRede: string, nomeRede: string, nomeEscola: string, nomeSegmento: string, ... +3
- **AlunoLaudoMedicoGetResponse** (interface): arquivo: File, urlArquivo: string, IdentificadorArquivo: string, Descricao: string, hashLaudoMedicoArquivo: string
- **AlunoNecessidadesEspeciaisGetRequest** (interface): hashEscola: string, hashPessoa: string
- **AlunoNecessidadesEspeciaisRelatorioResponse** (interface): hash: string, relatorio: string, hashEscola: string, hashAgrupamento: string, hashAnoLetivo: string
- **AlunoNecessidadesEspeciaisResponse** (interface): hash: string, diagnostico: string, laudos: AlunoLaudoMedicoGetResponse[], possuiEspecialista: boolean, detalhesEspecialista: string, ... +3
- **AlunoNee** (interface): hash: string, nomeAluno: string, matricula: string, hashEscola: string, nomeRede: string, ... +3
- **AlunoNeeDisableRelatorioRequest** (interface): hashRelatorio: string, hashEscola: string, hashPessoa: string
- **AlunoNeeDisableRequest** (interface)
- **AlunoNeeGetResponse** (interface): alunos: AlunoNeeResponse[], totalAlunosComNEE: number, totalDeAlunos: number
- **AlunoNeeRelatorioSaveRequest** (interface): hash: string, relatorio: string, hashAnoLetivo: string, hashAgrupamento: string, hashPessoa: string, ... +3
- **AlunoNeeResponse** (interface): hashPessoa: string, nomePessoa: string, matricula: string, hashEscola: string, nomeRede: string, ... +3
- **AlunoNeeSaveRequest** (interface): diagnostico: string, fazAcompanhamentoEspecialista: boolean, detalheEspecialista: string, possuiRelatorio: boolean, possuiBoletimRegular: boolean, ... +3
- **AlunoNeeUploadRequest** (interface): hashPessoa: string, hashEscola: string, emitidoEm: string, validoAte: string, descricao: string, ... +1
- **AlunosLancamentoGetRequest** (interface): hashAvaliacao: string, hashChamada: string, hashTurma: string
- **AlunosLancamentoGetResponse** (interface): hashPessoa: string, nomePessoa: string, fotoPessoa: string, matricula: string, codPessoaTOTVS: string, ... +3
- **ArquivoModel** (interface): NomeGuia: string | null, LinkArquivo: string | null
- **Assinatura** (type): funcao: string
- **AtualizarHistoricoRequest** (interface): hashRede: string, hashDisciplinaFolha: string, hashTurma: string, hashAlocacaoFolha: string, hashProfessor: string, ... +3
- **CadastroHorarioAulaResponse** (interface): hashAulaEvento: string, dataAula: string, tempo: number, nomeDisciplina: string, hashDisciplina: string, ... +3
- **CadastroHorarioAulaUpdateRequest** (interface): hashAnoLetivo: string, hashEscola: string, hashDisciplina: string, hashTurma: string, hashAula: string, ... +3
- **CadastroHorarioDataResponse** (interface): data: string, diaSemana: string
- **CadastroHorarioProfessorResponse** (interface): hashDisciplina: string, nomeProfessor: string
- **CadastroHorarioRequest** (interface): hashAnoLetivo: string, hashEscola: string, hashTurma: string, dataAula: Date
- **CadastroHorarioSemanaResponse** (interface): dataInicial: string, dataFinal: string, diasSemana: CadastroHorarioDataResponse[], tempos: CadastroHorarioTempoResponse[], periodoLetivo: PeriodoLetivo, ... +1
- **CadastroHorarioTempoResponse** (interface): tempo: number, horaInicioPadrao: string, horaTerminoPadrao: string, aulas: CadastroHorarioAulaResponse[]
- **CalendarConfig** (interface)
- **CalendarStruct** (interface)
- **ColumnConfig** (interface): header: string, avatar: boolean, highlight: boolean, key: string, multValues: boolean, ... +3
- **ColumnMultValues** (interface): key: string, highlight: boolean
- **ConfigDocumento** (interface): assinaturaEmTodasAsFolhas: boolean, mostrarCabecalho: boolean
- **DadosAlunoSelecionado** (interface): hashEscola: string, hashPessoa: string, nomePessoa: string, matricula: string, status: string, ... +3
- **DadosCabecalhoResponse** (interface): logo: string, escola: string, endereco: string, bairro: string, cep: string, ... +3
- **DadosImpressaoDocumento** (interface): logo: string, escola: string, rua: string, bairro: string, cep: string, ... +3
- **DadosPorFiltro** (interface)
- **DataTableConfig** (interface): customButtomLabel: boolean, buttonColumnLabel: string, columns: ColumnConfig[], textLimit: number, buttonLabel: string, ... +3
- **DataTableFilter** (interface): text: string, pending: boolean
- **DateSelect** (interface)
- **DayCustomColor** (interface)
- **DayStruct** (interface): day_label: string
- **DetalheAlocacaoHistoricoResponse** (interface): hashAlocacaoFolha: string, hashDisciplinaFolha: string, dataEntrada: string, nomeProfessor: string, hashProfessor: string, ... +3
- **DiaAulaInfo** (interface)
- **DisabledDay** (interface)
- **DocumentSettings** (type): fontSize: number, layout: PageLayout
- **ElevaIdModel** (interface)
- **EncerrarSituacaoResponse** (interface): hash: string, descricao: string, ehAtivo: boolean, ehDesligamento: boolean
- **EstadoResponse** (interface): hashEstado: string, siglaEstado: string, nomeEstado: string
- **FilterAlocacaoProfessoresRequest** (interface): hashRede: string, hashEscola: string[], hashSegmento: string[], hashSerie: string[], hashTurma: string[], ... +3
- **FilterConfig** (interface): id: string, id_toggle: string, id_save: string, id_clear: string, defaultValue: string, ... +3
- **FilterData** (interface)
- **FilterHistoricoGetRequest** (interface): hashAnoLetivo: string, hashTipoAvaliacao: string, hashAvaliacao: string, hashChamada: string, hashDisciplina: string, ... +3
- **FilterItemConfig** (interface): autostart: boolean, store: boolean, selectFirst: boolean, data: FilterData, required: boolean, ... +3
- **FilterMovimentacaoProfessoresGetRequest** (interface): hashRede: string, hashEscola: string[], hashSegmento: string[], hashPerfil: string[], hashSituacao: string[], ... +3
- **FilterNeeGetRequest** (interface): hashRede: string, hashEscola: string, hashTurno: string, hashSerie: string, hashTurma: string, ... +3
- **FilterNeeSaveData** (interface): redes: ResponseModel[], redesSelected: string, redesLoading: boolean, redesEnabled: boolean, redesEmpty: boolean, ... +3
- **FilterNotasSaveData** (interface): avaliacoes: ResponseModel[], avaliacoesSelected: string, avaliacoesLoading: boolean, avaliacoesEnabled: boolean, avaliacoesEmpty: boolean, ... +3
- **FilterParametrosFolhaRequest** (interface): hashRede: string[], hashParametroFolha: string[], pagina: number
- **FilterRequestData** (interface): data: ResponseModel[], errors: any[], isSuccess: boolean, message: string
- **FilterSelecaoEventosGetRequest** (interface): hashRede: string, hashOpcaoEvento: string, pagina: number
- **FilterSelecaoEventosRequest** (interface): hashRede: string, hashParametroFolha: string, pagina: number
- **FilterStoreData** (interface): usuario: string, dataCriacao: Date, validade: Date, filtroSelecionado: FilterHistoricoGetRequest, aplicado: boolean
- **GridInfo** (type): nomeAluno: string, matricula: string, serie: string, segmento: string, rg: string, ... +3
- **GuiaPortalModel** (interface): isualizado: boolean, Dispensado: boolean
- **IConfirmModel** (interface): message: string, textOk: string, textCancel: string, title: string, description: string
- **IElevaIdToken** (interface): AccessToken: string, AccessTokenExpiration: Date
- **IExceptionCommonError** (interface): type: EnumValidationErrorType, message: string
- **IExceptionFormError** (interface): type: EnumValidationErrorType, messages: IExceptionFormErrorMessage[]
- **IExceptionFormErrorMessage** (interface): property: string, error: string
- **IExceptionImportError** (interface): type: EnumValidationErrorType, messages: IExceptionImportErrorMessage[]
- **IExceptionImportErrorMessage** (interface): linha: string, propriedade: string, valor: any, descricao: string
- **IGridCheckedItem** (interface): id: any, checked: boolean
- **IGridColumnDef** (interface): headerName: string, field: string, width: string, centralized: boolean
- **IGridRowActions** (interface): width: string, actions: IGridRowActionsItems[]
- **IGroupOptionField** (interface): groupLabel: string, groupOptions: IOptionField[] | IRadioOptionField[]
- **INgOptionField** (interface): hash: string, descricao: string
- **IOptionField** (interface): id: any, name: string
- **IPagingParams** (interface): page: number, limit: number
- **IRadioOptionField** (interface): value: any, label: string
- **ISelectOptions** (interface): value: string, label: string
- **IUser** (interface): Nome: string, Matricula: string
- **IdStringResponse** (interface): id: number, texto: string
- **IncluirAlocacaoRequest** (interface): hashRede: string, hashTurma: string, hashDisciplina: string, nomeDisciplina: string, hashProfessor: string, ... +1
- **InformacoesAlunoRelatorioNEE** (type): nomeAluno: string, turma: string, matricula: string, serie: string, codPessoaTOTVS: string
- **LancamentoNotasSaveRequest** (interface)
- **LancamentosGetResponse** (interface): hash: string, hashAvaliacao: string, nomeAvaliacao: string, hashTurma: string, nomeTurma: string, ... +3
- **LancamentosGrid** (interface): hash: string, nomeAvaliacao: string, nomeChamada: string, nomeEscola: string, nomeTurma: string, ... +3
- **LastFilterRequest** (interface): ehProtocolo: boolean, ehFiltro: boolean, ehRecentes: boolean, protocolo: string, filterParams: FilterHistoricoGetRequest
- **MonthStruct** (interface): first_day: number, last_day: number, week_start: number, week_start_label: string, month: number, ... +2
- **MotivoFrequenciaDTO** (interface)
- **MovimentacaoProfessorDetalhesResponse** (interface): hashAlocacaoFolha: string, hashDisciplinaFolha: string, hashProfessor: string, hashRede: string, escola: string, ... +3
- **MovimentacaoProfessorLicencaAfastamentoDetalhesResponse** (interface): dataInicio: Date, dataFim: Date, situacao: string
- **MovimentacaoProfessoresResponse** (interface): hashPessoa: string, hashProfessor: string, hashRede: string, nomeRede: string, nomePessoa: string, ... +3
- **MunicipioResponse** (interface): hashEstado: string, siglaEstado: string, nomeEstado: string, hashMunicipio: string, nomeMunicipio: string, ... +1
- **NEEGetRelatorioResponse** (interface): hash: string, relatorio: string, criacaoData: Date, ultimaAlteracaoData: Date, nomeUsuarioCriacao: string, ... +3
- **PageControlComponentModel** (type): name: string, group: any, index: number, height: number, lastComponent: boolean
- **Paginacao** (interface)
- **PaisResponse** (interface): hashPais: string, possuiEstados: boolean, nomePais: string
- **ParametrosAusentesResponse** (interface)
- **ParametrosFolha** (interface): hash: string, parametro: string, id: number
- **ParametrosFolhaPorRede** (interface): hash: string, parametroFolha: number, idRede: number, valorParametroFolhaInteiro: number
- **ParametrosFolhaPorRedeAddRequest** (interface): hashParametro: string, hashRede: string, ValorParametroFolhaInteiro: number
- **ParametrosFolhaPorRedeUpdateRequest** (interface): hashParametroPorRede: string, hashRede: string, ValorParametroFolhaInteiro: number
- **ParametrosGetResponse** (interface): hash: string, descricao: string
- **ParametrosLancamentoGetResponse** (interface): hash: string, nomeRede: string, nomeParametro: string, ValorParametroFolhaInteiro: number
- **ParametrosOpcoesEventosRequest** (interface)
- **ParametrosPorRedeGetResponse** (interface): hash: string, hashRede: string, nomeRede: string, nomeParametro: string, valorParametroFolhaInteiro: number
- **PeriodDisabled** (interface)
- **PeriodoLetivo** (interface): dataInicioAno: string, dataInicioRecesso: string, dataFimRecesso: string, dataFimAno: string, periodoInformado: boolean, ... +1
- **ProfessorLicencaTempos** (interface): hash: string, hashSegmento: string, sigla: string, totalDeTempos: number
- **ProfessoresParaAlocacao** (interface): hash: string, descricao: string, cpf: string
- **ProfessoresParaRegistro** (interface): hash: string, descricao: string, nome: string, cpf: string, dataInativacao: Date
- **ProtocoloLancamento** (interface)
- **ProtocoloLancamentoAluno** (interface)
- **ProtocoloLancamentoAlunoGetResponse** (interface): nomePessoa: string, matricula: string, fotoPessoa: string, codPessoaTOTVS: string, alterado: boolean, ... +3
- **ProtocoloLancamentoGetResponse** (interface): hashProtocolo: string, codigoProtocolo: string, nomeAvaliacao: string, nomeChamada: string, nomeRede: string, ... +3
- **RelatorioAlunoNEE** (interface): hashAgrupamento: string, nomeAgrupamento: string, hashAnoLetivo: string, nomeAnoLetivo: string
- **RemoverAlocacaoRequest** (interface): hashRede: string, alocacoes: AlocacaoSituacaoRequest[], dataRemocao: Date, hashMotivo: string
- **ResultadoSaveRequest** (interface)
- **SalvarEncerramentoLicencaRequest** (interface): dataTermino: Date, HashPessoaEscolaAcesso: string
- **SalvarLicencaRequest** (interface): dataInicio: Date, HashSituacaoProfessor: string, HashPessoaEscolaAcesso: string
- **SalvarProfessorSubstitutoRequest** (interface): hashRede: string, hashTurma: string, hashDisciplina: string, nomeDisciplina: string, hashProfessor: string, ... +1
- **SalvarProfessoresSubstitutosRequest** (interface): hashAlocacoes: string[], hashPessoaEscolaAcesso: string, hashProfessorLicenca: string, dataInicio: Date
- **SelecaoEventosAddRequest** (interface): hashOpcaoEvento: string, hashRede: string, nomeMotivoFrequencia: string, impactaEmFolhaPagamento: boolean, exigeInformacaoAdicional: boolean
- **SelecaoEventosDTO** (interface): hash: string, hashRede: string, nomeRede: string, nomeOpcaoEvento: string, hashOpcaoEvento: string, ... +3
- **SelecaoEventosGetResponse** (interface): hash: string, hashRede: string, nomeRede: string, hashOpcaoEvento: string, nomeOpcaoEvento: string, ... +3
- **SelecaoEventosUpdateRequest** (interface): hashRede: string, hashMotivoFrequenciaProfessorTipoPresenca: string, hashOpcaoEventos: string, ativo: boolean, impactaEmFolhaPagamento: boolean, ... +1
- **StoreConfig** (interface): ativo: boolean, tempoDeValidade: number, filtroPorUsuario: boolean, storeName: string
- **SubstituirAlocacaoRequest** (interface): hashRede: string, hashAlocacao: string, dataSaida: Date, dataEntrada: Date, hashNovoProfessor: string, ... +2
- **SubstituirProfessorSubstitutoRequest** (interface): hashRede: string, hashTurma: string, hashDisciplina: string, nomeDisciplina: string, hashProfessor: string, ... +1
- **TemposPorSegmentoSaveRequest** (interface)
- **TemposPorSegmentoUpdateRequest** (interface)
- **TipoNotaFormativaRequest** (type): HashRede: string, HashAvaliacao: string, HashTurma: string
- **TipoTranstornoResponse** (interface): id: number, codigo: string, descricao: string, parentId: number, subitens: TipoTranstornoResponse[]
- **TurmaParaAlocacao** (interface): hash: string, hashRede: string, nomeRede: string, nomeEscola: string, nomeSegmento: string, ... +3
- **UsuarioAutenticadoModel** (interface): PossuiUsuarioAutenticado: boolean, AcessosUsuario: AcessoUsuarioModel[], ElevaId: ElevaIdModel, Email: string, Id: number, ... +3

## URLs de ambiente

- `api`
- `https://localhost/notas/api`

---
*102 componentes · 54 services · 11 módulos · 146 models · 20 rotas*