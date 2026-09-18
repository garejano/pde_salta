# Angular Map — frequencia
> Gerado em: 2026-07-30  
> Fonte: `C:\projects\frequencia\frontend`

## Módulos

- **AppModule** · declara: [AppComponent, LancamentoComponent, ListaPresencaComponent, ConfiguracaoChamadaComponent, JustificativaComponent, ... +7] · importa: [AppRoutingModule, BrowserModule, HammerModule, ReactiveFormsModule, HttpClientModule, ... +10] · exporta: [AppRoutingModule]
- **AppRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **CoreModule** · declara: [GridComponent, ConfirmDialogComponent, MultiSelectFieldComponent, SelectFieldComponent, TextFieldComponent, ... +10] · importa: [CommonModule, NgxPaginationModule, ReactiveFormsModule, NgSelectModule, FormsModule, ... +9] · exporta: [GridComponent, ConfirmDialogComponent, FontAwesomeModule, TranslateModule, ... +16]
- **FooterSalvarModule** · declara: [FooterSalvarComponent] · importa: [CommonModule] · exporta: [FooterSalvarComponent]
- **LoadingModule** · declara: [LoadingComponent] · importa: [CommonModule] · exporta: [LoadingComponent]
- **ModalElevaModule** · declara: [ModalElevaComponent] · importa: [CommonModule] · exporta: [ModalElevaComponent]
- **PortalModule** · declara: [PortalHeaderComponent, PortalMenuComponent, PortalModalComponent, LogarComoComponent, LogoEscolaComponent, ... +14] · importa: [CommonModule, FormsModule, NgbDropdownModule] · exporta: [PortalAuthComponent, PortalHeaderComponent, PortalModuloComponent, PortalBodyComponent, ... +3]
- **SemConteudoModule** · declara: [SemConteudoComponent] · importa: [CommonModule] · exporta: [SemConteudoComponent]
- **SidebarFilterModule** · declara: [SidebarFilterComponent, FilterListComponent] · importa: [CoreModule, CommonModule, TranslateModule] · exporta: [SidebarFilterComponent]

## Rotas

- `path.Consulta_Falta_Atraso` → FaltaAtrasoComponent `[IsLoggedGuard]`
- `path.Lancamento` → LancamentoComponent `[IsLoggedGuard]`
- `path.Justificativa` → JustificativaComponent `[IsLoggedGuard]`
- `path.Dias_Sem_Aula` → DiasSemAulaComponent `[IsLoggedGuard]`
- `path.Lista_Presenca` → ListaPresencaComponent `[IsLoggedGuard]`
- `path.Configuracao_Chamada` → ConfiguracaoChamadaComponent `[IsLoggedGuard]`
- `path.Dias_Letivos_Especiais` → DiasLetivosExtraComponent `[IsLoggedGuard]`
- `path.Home` → HomeComponent
- `**` → HomeComponent

## Componentes

### app
- **AppComponent** `app-root`
  - Injeta: AnalyticsService, TranslateService

### components
- **AvatarComponent** `app-avatar`
  - @Input: userId: string, userName: string, photoUrl: string | null
  - Injeta: LetrasIniciaisPipe, PhotoService
- **FilterListComponent** `filter-list`
  - @Input: label: string, labelOfType: string, items: any[], selectedName: string... +4
  - @Output: onEdit
  - Injeta: NgControl
- **FooterSalvarComponent** `app-footer-salvar`
  - @Input: label: string, disabled: boolean
  - @Output: submit
- **LoadingComponent** `app-loading`
  - @Input: mensagem: string
- **ModalElevaComponent** `app-modal-eleva`
  - @Input: showModal: boolean, closeButton: boolean
  - @Output: closeModalEvent
- **NavigationTabsComponent** `navigation-tabs`
  - Injeta: Router, UsuarioService
- **SemConteudoComponent** `app-sem-conteudo`
  - @Input: mensagem: string
- **SidebarFilterComponent** `sidebar-filter`
  - @Output: onClear, filterResult
  - Injeta: NotificationService, SidebarFilter, TranslateService
- **UserValidationComponent** `app-user-validation`
  - @Output: ExpirationEvent
  - Injeta: AutenticacaoService, UsuarioService

### configuracao-chamada
- **ConfiguracaoChamadaComponent** `app-configuracao`
  - Injeta: ConfiguracaoChamadaService, TranslateService

### confirm
- **ConfirmDialogComponent** `app-confirm-dialog`
  - Injeta: ConfirmDialogService

### date-field
- **DateFieldComponent** `date-field`
  - @Input: required: boolean, invalid: boolean
  - @Output: onChange
  - Injeta: NgControl

### daterangepicker-field
- **DateRangePickerComponent** `daterange-picker`
  - @Input: label: string, required: boolean, nullable: boolean, initialYear: number... +3
  - @Output: onDateChange
  - Injeta: ElementRef, NgbCalendar, NgbDateParserFormatter, Renderer2

### dias-letivos-extra
- **DiasLetivosExtraComponent** `app-dias-letivos-extra`
  - Injeta: DiasLetivosExtraService

### dias-sem-aula
- **DiasSemAulaComponent** `app-dias-sem-aula`
  - Injeta: ConfirmDialogService, DiaSemAulaService, DiasSemAulaValidator, NotificationService

### falta-atraso
- **FaltaAtrasoComponent** `app-falta-atraso`
  - Injeta: ChamadaDetailModel, FaltaAtrasoService, IAlunoResponsavelModel, IFaltaAtrasoSummaryModel, NotificationService, ... +1

### grid
- **GridComponent** `grid-component`
  - @Input: editUrl: string, rowData: IGridRowData<any>, columnDefs: IGridColumnDef[], rowActions: IGridRowActions... +4
  - @Output: onPageChange, onRemoveAll, onCheckChange, onDelete
  - Injeta: NgxSpinnerService

### home
- **HomeComponent** `home`
  - Injeta: HomeService, Router, TranslateService, UsuarioService

### justificativa
- **JustificativaComponent** `app-justificativa`
  - Injeta: JustificativaArquivoService, JustificativaService, NotificationService, PhotoService, PreferenciaService
- **JustificativaFormComponent** `justificativa-form`
  - @Input: dataAula: Date | null, visible: false, isSaving: boolean
  - @Output: onSubmit, onDismiss, onRemove
  - Injeta: JustificativaArquivoService, JustificativaFormValidator, NotificationService

### lancamento
- **LancamentoComponent** `lancamento`
  - Injeta: ConfirmDialogService, LancamentoService, NotificationService, PhotoService, PreferenciaService, ... +1

### lista-presenca
- **ListaPresencaComponent** `app-lista-presenca`
  - Injeta: ListaPresencaService, NgxSpinnerService, NotificationService, SidebarFilter, TranslateService

### multidisplay
- **MultiDisplayComponent** `multi-display`
  - @Output: changeClass

### multiselect-field
- **MultiSelectFieldComponent** `multi-select-field`
  - @Input: dataSource: IOptionField[], closeOnSelect: boolean, searchable: boolean, bindLabel: string... +4
  - @Output: onChange
  - Injeta: NgControl

### ng-select-field
- **NgSelectFieldComponent** `ng-select-field`
  - @Input: dataSource: ResponseModel[], disabled: boolean, closeOnSelect: boolean, searchable: boolean... +4
  - @Output: onChange

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
- **RadioFieldComponent** `radio-field`
  - @Input: required: boolean, label: string, dataSource: IRadioOptionField[]
  - @Output: onChange
  - Injeta: NgControl

### select-field
- **SelectFieldComponent** `app-select-field`
  - @Input: options: ISelectOptions[], closeOnSelect: boolean, label: string, searchable: boolean... +4
  - @Output: onChange

### text-field
- **TextFieldComponent** `text-field`
  - @Input: required: boolean, maxlength: number, mask: string
  - @Output: onChange
  - Injeta: NgControl

### textarea-field
- **TextAreaFieldComponent** `textarea-field`
  - @Input: required: boolean, maxlength: number, mask: string, rows: number
  - Injeta: NgControl

## Services

### app
- **HttpTokenInterceptor** (none)
  - Injeta: UsuarioService
  - Métodos: intercept, if

### components
- **PhotoService** (root)
  - Injeta: UsuarioService
  - Métodos: getPhotoUrl, if, if, if, if, if, ... +1
- **SidebarFilter** (root)
  - Injeta: ApiClient
  - Métodos: anosLetivos, redes, escolas, datas, series, turmas, ... +2

### configuracao-chamada
- **ConfiguracaoChamadaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: tiposchamada, opcoesconfiguracao, configuracaoatual, update

### confirm
- **ConfirmDialogService** (none)
  - Injeta: TranslateService
  - Métodos: confirmThis, if, if, getMessage

### daterangepicker-field
- **I18n** (none)
  - Injeta: I18n
  - Métodos: getWeekdayShortName, getMonthShortName, getMonthFullName, getWeekdayLabel, getDayAriaLabel

### dias-letivos-extra
- **DiasLetivosExtraService** (root)
  - Injeta: ApiClient, HandleApiError, NotasApiClient
  - Métodos: getSeries, getTurnos, getTurmas, getDisciplinas, getDiaLetivoExtra, save, ... +2

### dias-sem-aula
- **DiaSemAulaService** (root)
  - Injeta: ApiClient, HandleApiError, NotasApiClient
  - Métodos: getTurmaEventoAula, getJustificativasNoPeriodo, update
- **DiasSemAulaValidator** (none)
  - Métodos: validarDataAteMenorOuIgualDataInicio, if, if

### falta-atraso
- **FaltaAtrasoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getFaltaAtrasoAluno, getFaltaAtrasoDetalheAluno, getFaltaAtrasoAlunoPorResponsavel, getFaltaAtrasoDetalheAlunoPorResponsavel

### home
- **HomeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: possuiAcesso

### justificativa
- **JustificativaArquivoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getAnexos, disable, save, for, fileToBase64
- **JustificativaFormValidator** (root)
  - Métodos: validarDatasDeVigencia, if, if, if
- **JustificativaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getAlunos, save, update, create, remove

### lancamento
- **LancamentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getAlunos, getTiposPresenca, save

### lista-presenca
- **ListaPresencaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTurmas, getAlunos

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
  - Métodos: init, if, if, if, if
- **ApiClient** (root)
  - Injeta: HttpClient
  - Métodos: get, getBlob, post, put, delete
- **AutenticacaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: possuiAcesso
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
- **NotasApiClient** (root)
  - Injeta: HttpClient
  - Métodos: get, getBlob, post, put, delete
- **NotificationService** (root)
  - Injeta: ToastrService
  - Métodos: showSuccess, showError, showInfo, showWarning, showMedianTimeInfo, showLongTimeInfo
- **PreferenciaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getCardsPorLinha, updateCardsPorLinha
- **SelectService** (root)
- **User** (root)
  - Injeta: ApiClient
  - Métodos: getUserName

## Models

- **AcessoUsuarioModel** (interface): IdPerfilDeAcessoDoUsuario: number | null, IdPessoaEscolaAcesso: number | null, IdSegmento: number | null, Nome: string, EscolaHash: string | null, ... +3
- **ArquivoModel** (interface): NomeGuia: string | null, LinkArquivo: string | null
- **ConfiguracaoRequestModel** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string, hashOpcaoConfiguracao: string
- **ConfiguracaoResponseModel** (interface): hashTipoChamada: string, tiposChamada: IRadioOptionField[]
- **ConfiguracaoUpdateDataModel** (interface): hashEntidade: string, hashTipoChamada: string
- **ConfiguracaoUpdateModel** (interface): data: ConfiguracaoUpdateDataModel[]
- **ElevaIdModel** (interface)
- **FilterAulaModel** (interface): dataAula: Date, hashAnoLetivo: string, hashEscola: string, hashRede: string
- **FilterDiaSemAulaModel** (interface): DataAulaInicial: Date, HashTurma: string, HashRede: string, HashEscola: string, HashTurno: string
- **FilterParams** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string, dataAula: Date, hashSerie: string, ... +3
- **FilterRequestData** (interface): data: any[], errors: any[], isSuccess: boolean, message: string
- **GuiaPortalModel** (interface): isualizado: boolean, Dispensado: boolean
- **IAlunoResponsavelModel** (interface): hashUsuarioOrigem: string, nomeAluno: string
- **IConfirmModel** (interface): message: string, textOk: string, textCancel: string, title: string, description: string
- **IElevaIdToken** (interface): AccessToken: string, AccessTokenExpiration: Date
- **IExceptionCommonError** (interface): type: EnumValidationErrorType, message: string
- **IExceptionFormError** (interface): type: EnumValidationErrorType, messages: IExceptionFormErrorMessage[]
- **IExceptionFormErrorMessage** (interface): property: string, error: string
- **IExceptionImportError** (interface): type: EnumValidationErrorType, messages: IExceptionImportErrorMessage[]
- **IExceptionImportErrorMessage** (interface): linha: string, propriedade: string, valor: any, descricao: string
- **IFaltaAtrasoSummaryModel** (interface): hashUsuarioOrigem: string, totalFaltas: number, totalAtrasos: number, totalSaidasAntecipadas: number, anoLetivo: number
- **IGridCheckedItem** (interface): id: any, checked: boolean
- **IGridColumnDef** (interface): headerName: string, field: string, width: string, centralized: boolean
- **IGridRowActions** (interface): width: string, actions: IGridRowActionsItems[]
- **IGroupOptionField** (interface): groupLabel: string, groupOptions: IOptionField[] | IRadioOptionField[]
- **IOptionField** (interface): id: any, name: string
- **IPagingParams** (interface): page: number, limit: number
- **IRadioOptionField** (interface): value: any, label: string
- **ISelectOptions** (interface): value: string, label: string
- **ISideBarFilterModel** (interface): HashAnoLetivo: string, HashAnoLetivoOrigem: string, NomeAnoLetivo: string, HashRede: string, HashRedeOrigem: string, ... +3
- **ISidebarServiceInterface** (interface)
- **IUser** (interface): Nome: string, Matricula: string
- **IValidarFilterModel** (interface): HashAnoLetivo: string, HashRede: string, NomeRede: string, CaminhoArquivoLogo: string, HashEscola: string, ... +3
- **IValidarReturnModel** (interface)
- **JustificativaAlunoModel** (interface): informacaoPrincipal: string, informacaoSecundaria: string, hashJustificativa: string, hashUsuario: string, hashSerie: string, ... +3
- **JustificativaArquivoModel** (interface): index: number, hashJustificativaArquivo: string, nomeArquivo: string, caminhoArquivo: string, file: File
- **JustificativaModel** (interface): hashJustificativa: string, listaAnexos: JustificativaArquivoModel[]
- **JustificativaRemoveRequest** (interface): informacaoPrincipal: string, informacaoSecundaria: string, hashSerie: string, ordemSerie: number, nomeSerie: string, ... +3
- **LancamentoResponseModel** (interface): informacaoPrincipal: string, informacaoSecundaria: string, informacaoLogLancamento: string, possuiJustificativaLancada: boolean, hashTipoPresenca: string, ... +2
- **LancamentoSaveDataModel** (interface): hashAluno: string, hashTipoPresenca: string, possuiJustificativaLancada: boolean, informacaoPrincipal: string
- **LancamentoSaveModel** (interface): hashAulaEvento: string, data: LancamentoSaveDataModel[]
- **ListaPresencaAlunoModel** (interface): nomeAluno: string, matricula: string
- **ListaPresencaRequestModel** (interface): hashAnoLetivo: string, hashRede: string, caminhoArquivoLogo: string, hashEscola: string, hashSerie: string, ... +1
- **ListaPresencaSerieModel** (interface): nomeSerie: string, turmas: ListaPresencaSerieTurmaModel[]
- **ListaPresencaSerieTurmaModel** (interface): hash: string, descricao: string, selecionado: boolean
- **ListaPresencaTurmaModel** (interface): hashTurma: string, nomeTurma: string, selecionado: boolean, alunos: ListaPresencaAlunoModel[]
- **MultiDisplayService** (interface)
- **TipoPresencaDataModel** (interface): sigla: string, hash: string, descricao: string
- **UsuarioAutenticadoModel** (interface)

## URLs de ambiente

- `/frequencia/api`
- `api`
- `https://localhost/frequencia/api`

---
*47 componentes · 43 services · 9 módulos · 49 models · 9 rotas*