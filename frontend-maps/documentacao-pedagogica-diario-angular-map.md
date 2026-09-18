# Angular Map — documentacao-pedagogica-diario
> Gerado em: 2026-07-30  
> Fonte: `C:\projects\documentacao-pedagogica\frontend-diario-classe`

## Módulos

- **AppModule** · declara: [ConfiguracaoComponent, AppComponent, NavigationTabsComponent, HomeComponent, ToastrElevaComponent, ... +22] · importa: [AppRoutingModule, BrowserModule, CommonModule, HammerModule, ReactiveFormsModule, ... +14] · exporta: [AppRoutingModule]
- **AppRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **CoreModule** · declara: [GridComponent, ConfirmDialogComponent, MultiSelectFieldComponent, SelectFieldComponent, NgSelectFieldComponent, ... +12] · importa: [CommonModule, NgxPaginationModule, ReactiveFormsModule, NgSelectModule, FormsModule, ... +10] · exporta: [GridComponent, ConfirmDialogComponent, FontAwesomeModule, TranslateModule, ... +18]
- **FooterSalvarModule** · declara: [FooterSalvarComponent] · importa: [CommonModule] · exporta: [FooterSalvarComponent]
- **LoadingModule** · declara: [LoadingComponent] · importa: [CommonModule] · exporta: [LoadingComponent]
- **ModalElevaModule** · declara: [ModalElevaComponent] · importa: [CommonModule] · exporta: [ModalElevaComponent]
- **PortalModule** · declara: [PortalHeaderComponent, PortalMenuComponent, PortalModalComponent, LogarComoComponent, LogoEscolaComponent, ... +14] · importa: [CommonModule, FormsModule, HttpClientModule, RouterModule] · exporta: [PortalAuthComponent, PortalHeaderComponent, PortalModuloComponent, PortalBodyComponent, ... +3]
- **SemConteudoModule** · declara: [SemConteudoComponent] · importa: [CommonModule] · exporta: [SemConteudoComponent]

## Rotas

- `path.Configuracao.Listar` → ConfiguracaoComponent `[IsLoggedGuard]`
- `path.Relatorio.Listar` → ListarRelatorioComponent `[IsLoggedGuard]`
- `path.Home` → HomeComponent
- `**` → HomeComponent

## Componentes

### app
- **AppComponent** `app-root`

### checkbox-field
- **CheckboxFieldComponent** `app-checkbox-field`
  - @Output: eventChange
  - Injeta: NgControl

### components
- **ButtonComponent** `app-button`
  - @Input: label: string, classButton: string, disabled: boolean, icon: string... +3
  - @Output: clickEvent
- **DiarioClasseComponent** `app-diario-classe`
  - @Input: dados: DiarioClasseResponse | null, configuracao: DiarioClasseConfiguracaoResponse | null, configuracaoFiltro: FilterRedeDiarioClasseResponse | null, ready: boolean
  - Injeta: ElementRef, PageControlService
- **DiarioClasseEdicaoDadosComponent** `app-diario-classe-edicao-dados`
  - @Input: dados: DiarioClasseEdicaoModel
  - @Output: saveEvent, atualizarObservacoes
- **DocAssinaturaComponent** `app-doc-assinatura`
  - @Input: assinaturas: any[], blocoAdicional: boolean, info: GridInfo, local: string... +1
  - Injeta: ElementRef
- **DocDiarioPrevistasDadasComponent** `app-doc-diario-previstas-dadas`
  - Injeta: ElementRef
- **DocFooterComponent** `app-doc-footer`
  - @Input: index: number, total: number
- **DocGridConteudosDiarioClasseComponent** `app-doc-grid-conteudos-diario-classe`
  - @Input: conteudos: any, info: GridInfo, index: number
  - Injeta: ElementRef
- **DocGridDiarioClasseComponent** `app-doc-grid-diario-classe`
  - @Input: datas: any[], alunos: any, minimoDeColunas: number | null, ultimaLista: boolean... +4
  - Injeta: ElementRef
- **DocGridInfoComponent** `app-doc-grid-info`
  - @Input: info: GridInfo
- **DocGridRelatorioRendimentoComponent** `app-doc-grid-relatorio-rendimento`
  - @Input: index: number, etapas: FichaIndividualColunaGetResponse[], alunos: RelatorioDeRendimentoAlunoResponse[], configuracaoDiario: DiarioClasseCaractereResponse... +4
  - Injeta: ElementRef
- **DocHeaderComponent** `app-doc-header`
  - @Input: info: DiarioDeClasseCabecalho
- **DocTextFieldComponent** `app-doc-text-field`
  - @Input: text: string, label: string
  - Injeta: ElementRef
- **DocTitleComponent** `app-doc-title`
  - @Input: title: string
- **DocumentLoadingComponent** `app-document-loading`
- **DocumentPageComponent** `app-document-page`
  - @Input: componentes: any[], fake: boolean, header: TemplateRef<any>, index: number... +3
  - Injeta: ElementRef
- **DocumentTopbarComponent** `app-document-topbar`
  - @Output: closeEvent, saveEvent, printEvent
- **DocumentViewerComponent** `app-document-viewer`
  - @Input: controls: TemplateRef<any>
  - Injeta: PrintService
- **DropdownActionsComponent** `app-dropdown-actions`
  - @Input: options: DropdownOption<any>[], buttonText: string, buttonIcon: string, showIcon: boolean... +1
  - @Output: optionSelected
  - Injeta: ElementRef
- **FilterDateComponent** `app-filter-date`
  - @Input: id: string, label: string, required: boolean, invalid: boolean... +3
  - @Output: eventChange
- **FooterSalvarComponent** `app-footer-salvar`
  - @Input: label: string, disabled: boolean
  - @Output: submitted
- **IconButtonComponent** `app-icon-button`
  - @Input: icon: string, class: string
  - @Output: clickEvent
- **LoadingComponent** `app-loading`
  - @Input: mensagem: string
- **ModalElevaComponent** `app-modal-eleva`
  - @Input: showModal: boolean, closeButton: boolean
  - @Output: closeModalEvent
- **NavigationTabsComponent** `app-navigation-tabs`
  - Injeta: Router, UsuarioService
- **SemConteudoComponent** `app-sem-conteudo`
  - @Input: mensagem: string
- **TituloTelaComponent** `app-titulo-tela`
  - @Input: titulo: string
  - @Output: emtVoltar
- **ToastrElevaComponent** `app-toastr-eleva`

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

### filters
- **BaseFilterComponent**
  - @Input: filterButtonActive: boolean, closeButtonActive: boolean
  - @Output: submit, changeFilterStatus, resetList, changeConfigByItem, ... +2
  - Injeta: FiltroService, FiltroSync, NotificationService
- **RelatorioFiltroComponent** `app-filtro-relatorio`
  - @Input: dataInicialChild: FilterDateComponent, dataFinalChild: FilterDateComponent
  - @Output: notifyRecovery
  - Injeta: FiltroService, FiltroSync, NotificationService, StateGuardService

### grid
- **GridComponent** `app-grid-component`
  - @Input: editUrl: string, rowData: IGridRowData<any>, columnDefs: IGridColumnDef[], rowActions: IGridRowActions... +4
  - @Output: eventPageChange, eventRemoveAll, eventCheckChange, eventDelete
  - Injeta: NgxSpinnerService

### home
- **HomeComponent** `app-home`
  - Injeta: HomeService, Router, TranslateService, UsuarioService

### multidisplay
- **MultiDisplayComponent** `multi-display`
  - @Output: changeClass

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
- **ConfiguracaoComponent** `app-configuracao`
  - Injeta: ConfiguracaoService, FormBuilder, ToastrService
- **ListarRelatorioComponent** `app-listar-relatorio`
  - Injeta: ChangeDetectorRef, ConfiguracaoService, RelatorioService, ToastrService

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

### text-field
- **TextFieldComponent** `app-text-field`
  - @Input: label: string, required: boolean, maxlength: number, mask: string
  - @Output: eventChange
  - Injeta: NgControl

### textarea-field
- **TextAreaFieldComponent** `app-textarea-field`
  - @Input: label: string, required: boolean, mask: string, rows: number... +1
  - Injeta: NgControl

## Services

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

### components
- **PageControlService** (root)
  - Métodos: init, addNewPage, addComponent, last, lastFreeParts, if, ... +2
- **PrintService** (root)
  - Métodos: if, setTimeout, if, for, if, reset

### confirm
- **ConfirmDialogService** (none)
  - Injeta: TranslateService
  - Métodos: confirmThis, if, if, getMessage

### daterangepicker-field
- **I18n** (none)
  - Injeta: I18n
  - Métodos: getWeekdayShortName, getMonthShortName, getMonthFullName, getWeekdayLabel, getDayAriaLabel

### filters
- **FiltroService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, series, turmas, disciplinas
- **FiltroSync** (root)

### home
- **HomeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: possuiAcesso

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
- **PortalConfig** (root)
- **ProgressService** (root)
  - Injeta: PortalHeaderProgressComponent
  - Métodos: complete, if, for, show, if, for, ... +1
- **UsuarioService** (root)
  - Injeta: HttpClient, PortalConfig
  - Métodos: logoff, logoffElevaId, logarComo, alternarPerfisDeAcessoDoUsuario, irParaLogin, if, ... +2

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
  - Métodos: get, getBlob, post, postBlob, put, delete
- **ConfiguracaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getDiariosClasse, getDiariosClasseByHash, updateConfiguracao
- **DateUtilsService** (root)
  - Injeta: DatePipe
  - Métodos: transformJsonToDate, transformDate
- **FileService** (root)
  - Injeta: ApiClient
  - Métodos: downloadFile
- **FotoPortalService** (root)
  - Injeta: ApiClient
  - Métodos: downloadFile
- **HandleApiError** (root)
  - Injeta: NotificationService, TranslateService, UsuarioService
  - Métodos: for, if, switch
- **NotificationService** (root)
  - Injeta: ToastrService
  - Métodos: showSuccess, showError, showInfo, showWarning, showLongTimeInfo
- **PreferenciaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getCardsPorLinha, updateCardsPorLinha
- **RelatorioService** (root)
  - Injeta: ApiClient
  - Métodos: getDocumentoDiarioClasse
- **SelectService** (root)
- **StateGuardService** (none)
  - Métodos: guardState
- **User** (root)
  - Injeta: ApiClient
  - Métodos: getUserName

## Models

- **AcessoUsuarioModel** (interface): IdPerfilDeAcessoDoUsuario: number | null, IdPessoaEscolaAcesso: number | null, IdSegmento: number | null, Nome: string, EscolaHash: string | null, ... +3
- **Aluno** (type)
- **ArquivoModel** (interface): NomeGuia: string | null, LinkArquivo: string | null
- **AtualizarDadosDiario** (interface): nomeProfessor: string, aulasDadas: any, aulasPrevistas: any
- **Chamada** (type)
- **ConteudoDiarioDeClasse** (type): atividades: any
- **DiarioClasseCaractereResponse** (type): caracterParaIndicarPendencia: string, caracterParaIndicarPresenca: string, caracterParaIndicarFalta: string, caracterParaIndicarTransferencia: string, caracterParaIndicarNEE: string
- **DiarioClasseConfiguracaoResponse** (interface): hash: string, hashRede: string, nomeRede: string, caracterParaIndicarPendencia: string, caracterParaIndicarPresenca: string, ... +3
- **DiarioClasseConfiguracaoSaveRequest** (interface): hashRede: string, caracterParaIndicarPendencia: string, caracterParaIndicarPresenca: string, caracterParaIndicarFalta: string, caracterParaIndicarTransferencia: string, ... +3
- **DiarioClasseConteudoResponse** (type)
- **DiarioClasseResponse** (type): exibirNomeProfessor: boolean, exibirFrequencia: boolean, exibirConteudoMinistrado: boolean, exibirRelatorioRendimento: boolean, configuracaoDiario: DiarioClasseCaractereResponse
- **DiarioDeClasseCabecalho** (type): uf: string, cidade: string
- **DocToPrint** (type)
- **ElevaIdModel** (interface)
- **FichaIndividualColunaGetResponse** (interface): notaMaxima: number | null, ehResultado: boolean, ehSituacao: boolean
- **FichaIndividualColunasPorEtapa** (interface): hashEstruturaAvaliacao: string, hashEtapa: string, hash: string, descricao: string
- **FichaIndividualEtapaGetResponse** (interface): colunas: FichaIndividualColunaGetResponse[]
- **FilterGetRequest** (interface): hashAnosLetivos: string[], hashRedes: string[], hashEscolas: string[], hashSeries: string[], hashTurmas: string[], ... +2
- **FilterRedeDiarioClasseResponse** (interface): hash: string, descricao: string, caminhoArquivoLogo: string, exibirFrequencia: boolean, exibirConteudoMinistrado: boolean, ... +1
- **FilterRequestData** (interface): data: ResponseModel[], errors: any[], isSuccess: boolean, message: string
- **FilterSaveData** (interface): disciplinas: ResponseModel[], disciplinasSelected: string, disciplinasLoading: boolean, disciplinasEnabled: boolean, disciplinasEmpty: boolean, ... +3
- **FiltroConfig** (interface)
- **FiltroDiarioClassePortalResponse** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string, hashSerie: string, hashTurma: string, ... +3
- **FiltroRelatorioModelGetRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string, hashSerie: string, hashTurma: string, ... +3
- **FiltroRelatorioModelSaveData** (interface): disciplinas: ResponseModel[], disciplinasSelected: string, disciplinasLoading: boolean, disciplinasEnabled: boolean, disciplinasEmpty: boolean, ... +3
- **GridInfo** (type)
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
- **ListaDataAulaEvento** (type)
- **MultiDisplayService** (interface)
- **PageControlComponentModel** (type)
- **RedeDiarioClasseConfiguracaoModel** (interface): hash: string, descricao: string, caracterParaIndicarPendencia: string, caracterParaIndicarPresenca: string, caracterParaIndicarFalta: string, ... +3
- **RelatorioDeRendimentoAlunoResponse** (interface): hashAluno: string, nomeAluno: string, matricula: string, notas: FichaIndividualColunasPorEtapa[], visivelNoBoletim: boolean
- **RelatorioDeRendimentoRequest** (interface)
- **RelatorioDeRendimentoResponse** (interface): hashDisciplina: string, nomeDisciplina: string, hashTurma: string, nomeTurma: string, dataInicio: string, ... +3
- **UsuarioAutenticadoModel** (interface): CodColigada: number | null, CodFilial: number | null, HashTurmaAluno: string | null

## URLs de ambiente

- `api`
- `https://localhost/documentacao-pedagogica/api`

---
*62 componentes · 39 services · 8 módulos · 52 models · 4 rotas*