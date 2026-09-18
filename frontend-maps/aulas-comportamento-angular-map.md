# Angular Map — aulas-comportamento
> Gerado em: 2026-07-30  
> Fonte: `C:\projects\aulas\frontend-comportamento`

## Módulos

- **AppModule** · declara: [AppComponent, ToastrElevaComponent, TituloTelaComponent, LoadingComponent, ModalComponent, ... +7] · importa: [BrowserModule, AppRoutingModule, CommonModule, HammerModule, ReactiveFormsModule, ... +12]
- **AppRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **CoreModule** · declara: [GridComponent, ConfirmDialogComponent, MultiSelectFieldComponent, SelectFieldComponent, NgSelectFieldComponent, ... +10] · importa: [CommonModule, NgxPaginationModule, ReactiveFormsModule, NgSelectModule, FormsModule, ... +10] · exporta: [GridComponent, ConfirmDialogComponent, FontAwesomeModule, TranslateModule, ... +16]
- **LoadingModule** · declara: [LoadingComponent] · importa: [CommonModule] · exporta: [LoadingComponent]
- **ModalElevaModule** · declara: [ModalElevaComponent] · importa: [CommonModule] · exporta: [ModalElevaComponent]
- **ModalElevaModule** · declara: [ModalElevaComponent] · importa: [CommonModule] · exporta: [ModalElevaComponent]
- **PageNotFoundModule** · declara: [PageNotFoundComponent] · importa: [CommonModule]
- **PortalModule** · declara: [PortalHeaderComponent, PortalMenuComponent, PortalModalComponent, LogarComoComponent, LogoEscolaComponent, ... +14] · importa: [CommonModule, FormsModule, HttpClientModule] · exporta: [PortalAuthComponent, PortalHeaderComponent, PortalModuloComponent, PortalBodyComponent, ... +3]
- **SemConteudoModule** · declara: [SemConteudoComponent] · importa: [CommonModule] · exporta: [SemConteudoComponent]
- **SharedModule** · declara: [ButtonComponent, IconButtonComponent, AvatarComponent] · importa: [CommonModule, LazyLoadImageModule] · exporta: [ButtonComponent, IconButtonComponent, AvatarComponent]

## Rotas

- `path.Comportamento.Lista` → ? `[IsLoggedGuard]`
- `path.Home` → HomeComponent
- `path.Auth` → PortalAuthComponent
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
  - @Input: label: string, classButton: string, disabled: boolean, icon: string... +3
  - @Output: clickEvent

### card-info
- **CardInfoComponent** `app-card-info`
  - @Input: title: string, message: string

### checkbox-field
- **CheckboxFieldComponent** `app-checkbox-field`
  - @Output: eventChange
  - Injeta: NgControl

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

### install-pwa
- **InstallPwaComponent** `app-install-pwa`

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

### modal
- **ModalComponent** `app-modal`
  - @Input: showModal: boolean, closeButton: boolean
  - @Output: closeModalEvent

### modal-eleva
- **ModalElevaComponent** `app-modal-eleva`
  - @Input: showModal: boolean, closeButton: boolean
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
- **ComportamentoListaAluno** `app-comportamento-lista-aluno`
  - Injeta: ComportamentoListaAlunoSelecao, ComportamentoService, EventTagService, NotificationService, Router, ... +1
- **ComportamentoListaTurma** `app-comportamento-lista-turma`
  - Injeta: ComportamentoListaAlunoSelecao, ComportamentoService, ConnectivityService, DatePipe, EventTagService, ... +1
- **HomeComponent** `app-home`
  - Injeta: AutenticacaoService, Router, TranslateService, UsuarioService
- **PageNotFoundComponent** `app-page-not-found`
  - Injeta: UsuarioService

### portal-alert
- **PortalAlertComponent** `portal-alert`
  - Injeta: AlertService, ElementRef

### portal-auth
- **PortalAuthComponent** `atlas-modulo-auth`
  - Injeta: ActivatedRoute, AlertService, MenuService, PortalConfig, Router, ... +1

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
  - Injeta: CookieService, Router, UsuarioService

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
  - @Input: titulo: string, voltarButton: boolean
  - @Output: emtVoltar

### toastr-eleva
- **ToastrElevaComponent** `app-toastr-eleva`

### user-validation
- **UserValidationComponent** `app-user-validation`
  - @Output: ExpirationEvent
  - Injeta: AutenticacaoService, UsuarioService

## Services

### confirm
- **ConfirmDialogService** (none)
  - Injeta: TranslateService
  - Métodos: confirmThis, if, if, getMessage

### daterangepicker-field
- **I18n** (none)
  - Injeta: I18n
  - Métodos: getWeekdayShortName, getMonthShortName, getMonthFullName, getWeekdayLabel, getDayAriaLabel

### interceptor
- **HttpRequestInterceptor** (none)
  - Injeta: ProgressService, UsuarioService
  - Métodos: intercept, if

### pages
- **ComportamentoListaAlunoSelecao** (root)
  - Métodos: guardaSelecao

### regional
- **RegionalService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPaises, getEstados, getMunicipios

### route-guard
- **IsAllowed** (root)
  - Injeta: Router, UsuarioService
  - Métodos: canActivate, if
- **IsDesktopGuard** (root)
  - Injeta: Router
  - Métodos: canActivate, if
- **IsLoggedGuard** (root)
  - Injeta: Router, UsuarioService
  - Métodos: canActivate
- **IsMobileGuard** (root)
  - Injeta: Router
  - Métodos: canActivate, if

### services
- **AlertService** (root)
  - Métodos: showSuccess, showAlert, showError, setAlertComponent, if
- **ApiClient** (root)
  - Injeta: HttpClient
  - Métodos: get, getBlob, post, put, delete
- **AutenticacaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: possuiAcesso
- **ComportamentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTurmas, getAlunos, save
- **ConnectivityService** (root)
  - Injeta: NotificationService
  - Métodos: isOnline, getMsgOffLine
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
  - Métodos: if, for, if, switch
- **MenuPerfilService** (root)
  - Injeta: UsuarioService
  - Métodos: update
- **MenuService** (root)
  - Injeta: FuncionalidadeAcessadaService, HttpClient, ModalService, PortalConfig, ... +1
  - Métodos: clear, get, if, if, if, if, ... +2
- **ModalService** (root)
  - Injeta: IModal
  - Métodos: add, remove, open, close
- **NotificacaoService** (root)
  - Injeta: HttpClient, PortalConfig
  - Métodos: get
- **NotificationService** (root)
  - Injeta: ToastrService
  - Métodos: showSuccess, showError, showInfo, showWarning, showLongTimeInfo
- **PhotoService** (root)
  - Injeta: UsuarioService
  - Métodos: getPhotoUrl, if, if, if, if, if, ... +1
- **ProgressService** (root)
  - Injeta: PortalHeaderProgressComponent
  - Métodos: complete, if, for, show, if, for, ... +1
- **SelectService** (root)
- **StateGuardService** (none)
  - Métodos: guardState
- **User** (root)
  - Injeta: ApiClient
  - Métodos: getUserName
- **UsuarioService** (root)
  - Injeta: HttpClient, PortalConfig, Router
  - Métodos: navigateToHome, logoff, logoffElevaId, logarComo, alternarPerfisDeAcessoDoUsuario, irParaLogin, ... +2

## Models

- **AcessoUsuarioModel** (interface): IdPerfilDeAcessoDoUsuario: number | null, IdPessoaEscolaAcesso: number | null, IdSegmento: number | null, HashPessoaEscolaAcesso: string | null, Nome: string, ... +3
- **AlunoComportamento** (interface): nome: string, ra: string, comportamento: TipoComportamento[], comentario: string
- **AlunoComportamentoResponse** (interface): hashPessoa: string, nomePessoa: string, codPessoaTOTVS: string, arquivoGerado: boolean, nomeArquivoFoto: string, ... +3
- **ArquivoModel** (interface): NomeGuia: string | null, LinkArquivo: string | null
- **ComportamentoAlunoResponse** (interface): nomePessoa: string, matricula: string, hashPessoa: string, arquivoGerado: boolean, nomeArquivoFoto: string, ... +2
- **ComportamentoAlunoSaveRequest** (interface): hashPessoa: string, comportamentos: string[], comentario: string
- **ComportamentoAlunosRequest** (interface): dataAula: string, hashTurma: string, hashDisciplina: string
- **ComportamentoGetAlunoRequest** (interface): dataAula: string, hashTurma: string, hashDisciplina: string, nomeTurma: string, nomeDisciplina: string
- **ComportamentoGetTurmaRequest** (interface): dataAula: string
- **ComportamentoSaveRequest** (interface): hashTurma: string, hashDisciplina: string, dataAula: string, alunos: ComportamentoAlunoSaveRequest[]
- **ComportamentosAlunosResponse** (interface): tipoComportamentos: TipoComportamentoResponse[], alunos: AlunoComportamentoResponse[]
- **ElevaIdModel** (interface)
- **EstadoResponse** (interface): hashEstado: string, siglaEstado: string, nomeEstado: string
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
- **MunicipioResponse** (interface): hashEstado: string, siglaEstado: string, nomeEstado: string, hashMunicipio: string, nomeMunicipio: string, ... +1
- **PaisResponse** (interface): hashPais: string, possuiEstados: boolean, nomePais: string
- **ProfessorTurmaResponse** (interface): hashRede: string, nomeRede: string, hashEscola: string, nomeEscola: string, hashTurma: string, ... +3
- **TipoComportamento** (interface): descricao: string, ehPositivo: boolean, ehNegativo: boolean, ativo: boolean
- **TipoComportamentoResponse** (interface): hashTipo: string, descricao: string, ehPositivo: boolean, ehNegativo: boolean, ativo: boolean
- **UsuarioAutenticadoModel** (interface): PossuiUsuarioAutenticado: boolean, AcessosUsuario: AcessoUsuarioModel[], ElevaId: ElevaIdModel, Email: string, Id: number, ... +3

## URLs de ambiente

- `api`
- `https://localhost/aulas/api`

---
*46 componentes · 34 services · 10 módulos · 37 models · 4 rotas*