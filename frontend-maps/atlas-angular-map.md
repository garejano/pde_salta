# Angular Map — atlas
> Gerado em: 2026-07-30  
> Fonte: `C:\projects\atlas\frontend`

## Módulos

- **AppModule** · declara: [AppComponent] · importa: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HomeModule, GestaoModule, ... +4]
- **AppRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **ComponentModule** · declara: [DropdownComponent, SelectFieldComponent] · importa: [CommonModule, FormsModule] · exporta: [DropdownComponent, SelectFieldComponent]
- **CoreModule** · declara: [BreadcrumbComponent] · importa: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule] · exporta: [ReactiveFormsModule, FormsModule, BreadcrumbComponent]
- **FrequenciaModule** · declara: [FaltaAtrasoComponent] · importa: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, FrequenciaRoutingModule, ... +3]
- **FrequenciaRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **GestaoCommonModule** · importa: [CommonModule, PortalModule, GestaoUnidadeModule]
- **GestaoModule** · declara: [GestaoComponent] · importa: [CommonModule, RippleModule, TranslocoModule, GestaoRoutingModule, SharedModule, ... +6]
- **GestaoRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **GestaoUnidadeCadastroModule** · declara: [GestaoUnidadeCadastroComponent, DadosUnidadeFormComponent, EnderecoUnidadeFormComponent] · importa: [CommonModule, BreadcrumbModule, SelectModule, TextInputModule, ButtonModule, ... +7]
- **GestaoUnidadeModule** · declara: [GestaoUnidadeComponent, ButtonComponent, GestaoListaUnidadesComponent] · importa: [CommonModule, PaginationModule, BreadcrumbModule, SelectModule, TextInputModule, ... +4]
- **HomeAlunoModule** · declara: [HomeAlunoComponent, FuncionalidadesAcessadasAlunoComponent, EngajamentoComponent, NotasAvaliacaoComponent, EletivasInovacaoComponent, ... +8] · importa: [CommonModule, ButtonModule, RippleModule, TranslocoModule, SharedModule, ... +4]
- **HomeCommonModule** · declara: [FuncionalidadesAcessadasComponent, BannerCampanhaComponent, PaginationComponent] · importa: [CommonModule, PortalModule, CarouselModule] · exporta: [FuncionalidadesAcessadasComponent, BannerCampanhaComponent, PaginationComponent]
- **HomeEPadraoModule** · declara: [HomeEPadraoComponent, IndicadoresPedagogicosComponent] · importa: [CommonModule, ButtonModule, RippleModule, TranslocoModule, SharedModule, ... +3]
- **HomeModule** · declara: [HomeComponent] · importa: [CommonModule, ButtonModule, RippleModule, TranslocoModule, HomeRoutingModule, ... +10]
- **HomeProfessorModule** · declara: [HomeProfessorComponent, PoaProfessorComponent, PoaChartComponent, CalendarioProfessorComponent] · importa: [CommonModule, ButtonModule, RippleModule, TranslocoModule, SharedModule, ... +2]
- **HomeResponsavelModule** · declara: [HomeResponsavelComponent, CardAcessoRapidoComponent, CardComportamentoComponent, RematriculaComponent, ProgressoAlunoComponent, ... +1] · importa: [CommonModule, FormsModule, HomeCommonModule, AvatarModule, RouterModule, ... +5]
- **HomeRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **HomeSuporteModule** · declara: [HomeSuporteComponent] · importa: [CommonModule, ButtonModule, RippleModule, TranslocoModule, SharedModule, ... +2]
- **LandpageModule** · declara: [LandpageComponent, HeaderLandPageComponent, BannerLandpageComponent, SecaoAtlasComponent, SecaoServicosComponent, ... +6] · importa: [CommonModule, ButtonModule, RippleModule, TranslocoModule, SharedModule, ... +1]
- **LoadingModule** · declara: [LoadingComponent] · importa: [CommonModule] · exporta: [LoadingComponent]
- **PageNotFoundModule** · declara: [PageNotFoundComponent] · importa: [CommonModule, ButtonModule]
- **PortalModule** · declara: [PortalHeaderComponent, PortalHeaderDsComponent, PortalFooterDsComponent, PortalMenuComponent, PortalModalComponent, ... +19] · importa: [CommonModule, FormsModule, HttpClientModule, MenuAvatarModule, ButtonModule, ... +6] · exporta: [PortalAuthComponent, PortalHeaderComponent, PortalHeaderDsComponent, PortalFooterDsComponent, ... +5]
- **SharedModule** · declara: [ClampLinesDirective] · importa: [CommonModule] · exporta: [ComponentModule, ClampLinesDirective]

## Rotas

- `gestao` → gestao *(lazy)*
- `frequencia` → frequencia *(lazy)*
- `page-not-found` → PageNotFoundComponent
- `**` → ?
- `gestao` → GestaoComponent `[HomeGuard, PossuiPemissaoGuard]`
- `unidade` → GestaoUnidadeComponent `[HomeGuard, PossuiPemissaoGuard]`
- `unidade/criar` → GestaoUnidadeCadastroComponent `[HomeGuard, PendingChangesGuard, PossuiPemissaoGuard]`
- `home` → HomeComponent `[HomeGuard, PossuiPemissaoGuard, ResponsavelGuard]`
- `gestao/unidades` → UnidadesComponent

## Componentes

### app
- **AppComponent** `app-root`
  - Injeta: ActivatedRoute, AnalyticsService, Router, UsuarioService

### core
- **ButtonComponent** `app-button`
  - @Input: label: string, classButton: string, disabled: boolean, icon: string... +3
  - @Output: clickEvent
- **DsPaginacaoComponent** `app-dspaginacao`
  - @Input: current: number, total: number, paginacao: Paginacao
  - @Output: goTo
  - Injeta: FiltroSync

### dropdown
- **DropdownComponent** `app-dropdown`
  - @Input: options: IDropdown[], option: IDropdown
  - @Output: setOption

### lib
- **InputPesquisaHeaderComponent** `input-pesquisa-header`
  - Injeta: PortalConfig
- **LogarComoComponent** `logar-como`
  - Injeta: AlertService, ModalService, PortalConfig, UsuarioService
- **LogarComoDsComponent** `logar-como-ds`
  - @Output: isOpenChange, isLoading
  - Injeta: DsAlertService, PortalConfig, UsuarioService
- **LogoEscolaComponent** `logo-escola`
  - Injeta: PortalConfig, UsuarioService
- **MenuLateralComponent** `menu-lateral`
  - Injeta: MenuService, UsuarioService
- **PortalAlertComponent** `portal-alert`
  - Injeta: AlertService, ElementRef
- **PortalAlertDsComponent** `portal-alert-ds`
  - Injeta: DsAlertService, Subscription, ToastService
- **PortalAuthComponent** `atlas-modulo-auth`
  - Injeta: ActivatedRoute, AlertService, PortalConfig, UsuarioService
- **PortalBodyComponent** `portal-body`
- **PortalFooterDsComponent** `portal-footer-ds`
  - @Output: menuClick, perfilClick, homeClick
- **PortalGuiaComponent** `portal-guia`
  - Injeta: GuiaPortalService, PortalConfig, UsuarioService
- **PortalHeaderComponent** `portal-header`
  - @Output: onLateralMenuClick
  - Injeta: Boolean
- **PortalHeaderDsComponent** `portal-header-ds`
  - @Output: perfilClick
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
- **PortalMenuResponsavelComponent** `portal-menu-responsavel`
  - @Input: menu: MenuDTO
  - @Output: closeMenu
  - Injeta: MenuService
- **PortalModalComponent** `portal-modal`
  - @Input: modalId: string
  - Injeta: ElementRef, ModalService
- **PortalModuloComponent** `portal-modulo`
  - Injeta: CookieService, ElementRef, MenuPerfilService, MenuService, PortalConfig, ... +1
- **SkeletonBoxComponent** `skeleton-box`

### pages
- **AccordionComponent** `app-accordion`
  - @Input: accordionId: string
  - Injeta: Array
- **BannerCampanhaComponent** `app-banner-campanha`
  - @Output: hasBanner
  - Injeta: BannerCampanhaGetterService, PortalConfig, UsuarioService
- **BannerLandpageComponent** `app-banner-landpage`
  - Injeta: ActivatedRoute, FaqLandpageGetterService, Router, UsuarioService
- **BannerPOAComponent** `app-banner-poa`
  - Injeta: BannerPOAGetterService, MenuService
- **BarraProgressoComponent** `app-barra-progresso`
  - Injeta: ChangeDetectorRef, NgZone
- **BottomLandpageComponent** `app-bottom-landpage`
- **CalendarioProfessorComponent** `app-calendario-professor`
  - Injeta: CalendarioProfessorGetterService, CalendarioProfessorModel
- **CardAcessoRapidoComponent** `app-card-acesso-rapido`
  - @Output: public
  - Injeta: IconStyle
- **CardAvaliacaoComponent** `app-card-avaliacao`
  - @Input: avaliacoes: any[]
  - Injeta: ChangeDetectorRef, ElementRef
- **CardComportamentoComponent** `app-card-comportamento`
  - Injeta: CardComportamentoProps
- **ChartComponent** `app-chart-component`
  - @Input: hash: string, curso: CursoDTO
- **ComportamentoDetalheModalComponent** `app-comportamento-detalhe-modal`
  - @Input: modalId: string
  - Injeta: Array, ElementRef, ModalService, PaginationPagerService
- **ContainerEletivasComponent** `app-container-eletivas`
  - @Input: tiposEletiva: string[], titulo: string
  - Injeta: EletivasGetterService, UsuarioService
- **DadosUnidadeFormComponent** `app-dados-unidade-form`
  - Injeta: CustomserviceValidation, FormBuilder, ToastService
- **EletivasInovacaoComponent** `app-eletivas-inovacao`
  - Injeta: AlunoService, EletivasGetterService, UsuarioService
- **EnderecoUnidadeFormComponent** `app-endereco-unidade-form`
  - Injeta: CidadeService, EstadoService, FormBuilder
- **EngajamentoComponent** `app-engajamento`
  - Injeta: AlunoService, HomeEngajamentoGetterService, UsuarioService
- **FaltaAtrasoComponent** `app-falta-atraso`
  - Injeta: ChamadaDetailModel, FaltaAtrasoService, FormBuilder, IAlunoResponsavelModel, IFaltaAtrasoSummaryModel, ... +1
- **FaqAccordionComponent** `app-faq-accordion`
  - @Input: accordionId: string
  - Injeta: Array, UsuarioService
- **FaqLandpageComponent** `app-faq-landpage`
  - Injeta: FaqLandpageGetterService
- **FiltroUnidadeComponent** `app-filtro-unidade`
- **FuncionalidadesAcessadasAlunoComponent** `app-funcionalidades-acessadas-aluno`
  - Injeta: HomeFuncionalidadesAcessadasAlunoGetterService, MenuService
- **FuncionalidadesAcessadasComponent** `app-funcionalidades-acessadas`
  - Injeta: HomeFuncionalidadesAcessadasGetterService, MenuService
- **GestaoComponent** `app-gestao`
- **GestaoListaUnidadesComponent** `app-gestao-lista-unidades`
  - @Input: lista: any[], loading: boolean
  - @Output: seleciona, reinicairUnidades
  - Injeta: DatePipe
- **GestaoUnidadeCadastroComponent** `app-gestao-unidade-cadastro`
  - Injeta: AlertService, CadastroUnidadesService, FormBuilder, FormErrorHandlerService, RedeService, ... +1
- **GestaoUnidadeComponent** `app-gestao-unidade`
  - Injeta: FormBuilder, FormErrorHandlerService, GestaoUnidadeService, MarcaService, TipoNuService
- **GradeMarcasLandPageComponent** `app-grade-marcas-landpage`
  - Injeta: GradeMarcasLandPageGetterService
- **HeaderLandPageComponent** `app-header-landpage`
  - Injeta: ActivatedRoute, Router, UsuarioService
- **HomeAlunoComponent** `app-home-aluno`
  - Injeta: ChangeDetectorRef, DevolutivasGetterService, UsuarioService
- **HomeComponent** `app-home`
  - Injeta: ActivatedRoute, Router, TabBrowserService, TranslocoService, UsuarioService
- **HomeEPadraoComponent** `app-home-padrao`
  - Injeta: Router, UsuarioService
- **HomeProfessorComponent** `app-home-professor`
  - Injeta: Router, UsuarioService
- **HomeResponsavelComponent** `app-home-responsavel`
  - Injeta: AcessoUsuarioModel, AlunoAgrupadoVM, AlunoService, ChamadaSummaryModel, ChangeDetectorRef, ... +1
- **HomeSuporteComponent** `app-home-suporte`
  - Injeta: Router, UsuarioService
- **IndicadoresPedagogicosComponent** `app-indicadores-pedagogicos`
  - Injeta: AlertService, ElementRef, IndicadoresPedagogicosGetterService, UsuarioService
- **LandpageComponent** `app-landpage`
  - Injeta: ActivatedRoute, CookieService, Router, TabBrowserService, TranslocoService, ... +1
- **LoadingComponent** `app-loading`
  - @Input: mensagem: string
- **MenuCardDevolutivasComponent** `app-menu-card-devolutivas`
  - Injeta: DevolutivasGetterService, UsuarioService
- **ModalDevolutivasComponent** `app-modal-devolutivas`
- **NotasAvaliacaoComponent** `app-notas-avaliacao`
  - Injeta: HomeNotasAvaliacaoGetterService, NotasAvaliacaoModel
- **PageNotFoundComponent** `app-page-not-found`
  - Injeta: Router
- **PagePortalGuiaComponent** `app-page-portal-guia`
- **PaginationComponent** `app-pagination`
  - @Output: paginate
  - Injeta: Array
- **PoaChartComponent** `app-poa-chart-component`
  - Injeta: PoaProfessorGetterService, UsuarioService
- **PoaProfessorComponent** `app-poa-professor`
- **ProgressoAlunoComponent** `app-progresso-aluno`
  - @Output: visibilityChange
  - Injeta: AlunoHashModel, AlunoService, ChangeDetectorRef, ProgressoAlunoModel, ProgressoAlunoService, ... +1
- **RematriculaComponent** `app-rematricula`
- **SecaoAcessoComponent** `app-secao-acesso`
  - Injeta: UsuarioService
- **SecaoAtlasComponent** `app-secao-atlas`
- **SecaoFuncionalidadesComponent** `app-secao-funcionalidades`
- **SecaoLandpageComponent** `app-secao-landpage`
- **SecaoServicosComponent** `app-secao-servicos`

### select-field
- **SelectFieldComponent** `app-select-field`
  - Injeta: MultiSelectCoordinatorService, SelectOption

## Services

### app
- **TranslocoHttpLoader** (root)
  - Injeta: HttpClient
  - Métodos: getTranslation

### core
- **ApiInterceptor** (none)
  - Métodos: intercept
- **FiltroSync** (root)

### data
- **httpOptions** (root)
  - Métodos: frequencia

### error
- **FormErrorHandlerService** (root)
  - Métodos: if
- **HandleApiError** (root)
  - Injeta: Router
  - Métodos: if, if

### guards
- **HomeGuard** (root)
  - Injeta: Router, UsuarioService
  - Métodos: canActivate, if
- **LandPageGuard** (root)
  - Injeta: Router
  - Métodos: canLoad, if, if, canActivate

### lib
- **Alert** (root)
  - Métodos: showSuccess, showAlert, showError
- **AlertService** (root)
  - Métodos: showSuccess, showAlert, showError, setAlertComponent, if
- **AnalyticsService** (root)
  - Injeta: Router
  - Métodos: initPageViewTracking, if, trackPageView, if, trackUserProfile, if, ... +2
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
  - Métodos: clear, get, getMenuResponsavel, if, if, registrarAcesso
- **ModalService** (root)
  - Injeta: IModal
  - Métodos: add, remove, open, close
- **NotificacaoService** (root)
  - Injeta: HttpClient, PortalConfig
  - Métodos: get
- **PhotoService** (root)
  - Injeta: UsuarioService
  - Métodos: getPhotoUrl, if, if, if, if, if, ... +1
- **ProgressService** (root)
  - Injeta: PortalHeaderProgressComponent
  - Métodos: complete, if, for, show, if, for, ... +1
- **UsuarioService** (root)
  - Injeta: AnalyticsService, HttpClient, PortalConfig
  - Métodos: logoff, logoffElevaId, logarComo, alternarPerfisDeAcessoDoUsuario, irParaLogin, if, ... +2

### pages
- **AlunoService** (root)
  - Injeta: UsuarioService
  - Métodos: getAlunoHash, if, if
- **AnoLetivoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get
- **AnoLetivoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get
- **ApiClient** (root)
  - Injeta: HttpClient
  - Métodos: get, getBlob, postBlob, post, put, deleteAll, ... +1
- **BannerCampanhaGetterService** (root)
  - Injeta: HttpClient
  - Métodos: get
- **BannerPOAGetterService** (root)
  - Injeta: HttpClient
  - Métodos: getTokenAtivo, authenticateAlunoToken, getBannerPOA
- **CadastroUnidadesService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: create
- **CalendarioProfessorGetterService** (root)
  - Injeta: HttpClient
  - Métodos: post, get
- **CidadeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get
- **CustomserviceValidation** (root)
  - Métodos: validateCNPJ, for, for, validatePhone, validateEmail
- **DevolutivasGetterService** (root)
  - Injeta: HttpClient
  - Métodos: getSimulados
- **EletivasGetterService** (root)
  - Injeta: HttpClient
  - Métodos: getEletivasModulo, getEletivasFromCache
- **EstadoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get
- **EventEmitterAccordionService** (root)
- **FaltaAtrasoService** (root)
  - Injeta: FrequenciaApiClient, HandleApiError
  - Métodos: getFaltaAtrasoAluno, getFaltaAtrasoDetalheAluno, getFaltaAtrasoAlunoPorResponsavel, getFaltaAtrasoDetalheAlunoPorResponsavel
- **FaqLandpageGetterService** (root)
  - Injeta: HttpClient
  - Métodos: get
- **FaqLandpageGetterService** (root)
  - Injeta: HttpClient
  - Métodos: get
- **FrequenciaApiClient** (root)
  - Injeta: HttpClient, UsuarioService
  - Métodos: get, getBlob, post, put, getFilterBlob, delete
- **GestaoUnidadeService** (root)
  - Injeta: ApiClient, HandleApiError, HttpClient
  - Métodos: get, getListaUnidades
- **GradeMarcasLandPageGetterService** (root)
  - Injeta: HttpClient
  - Métodos: get
- **HomeEngajamentoGetterService** (root)
  - Injeta: HttpClient
  - Métodos: getFrequencia, getFrequenciaFromCache, getComportamento, getComportamentoFromCache, getComportamentoDetalhe
- **HomeFuncionalidadesAcessadasAlunoGetterService** (root)
  - Injeta: HttpClient
  - Métodos: getFuncionalidadesAcessadas, updateCache, if
- **HomeFuncionalidadesAcessadasGetterService** (root)
  - Injeta: HttpClient
  - Métodos: get, set, if
- **HomeGuard** (root)
  - Injeta: Router, UsuarioService
  - Métodos: canActivate, if, if
- **HomeNotasAvaliacaoGetterService** (root)
  - Injeta: HttpClient
  - Métodos: post, postFromCache
- **IndicadoresPedagogicosGetterService** (root)
  - Injeta: HttpClient
  - Métodos: getReportPowerBi, getBuscarEscolaAutenticada
- **LandPageGuard** (root)
  - Injeta: Router, UsuarioService
  - Métodos: canLoad, if, if, canActivate, if
- **MarcaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getMarcas
- **PendingChangesGuard** (root)
  - Injeta: Router
  - Métodos: canDeactivate
- **PoaProfessorGetterService** (root)
  - Injeta: HttpClient
  - Métodos: get
- **PossuiPemissaoGuard** (root)
  - Injeta: Router, UsuarioService
  - Métodos: canLoad, canActivate
- **ProgressoAlunoService** (root)
  - Injeta: HttpClient
  - Métodos: getCursos
- **RedeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get
- **ResponsavelGuard** (root)
  - Injeta: Router, UsuarioService
  - Métodos: canActivate, canLoad
- **TipoNuService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTipoNu

### pagination-service
- **PaginationPagerService** (root)
  - Injeta: PaginationPagerService
  - Métodos: getPager, if, if, if, setPage

### select-field
- **MultiSelectCoordinatorService** (root)
  - Métodos: registerOpen, if, unregister, if, isOpen

### tab-browser
- **TabBrowserService** (root)
  - Injeta: TranslocoService
  - Métodos: setTitle, if, setTitleWithTranslate, if, setIcon

## Models

- **AcessoUsuarioModel** (interface): IdPerfilDeAcessoDoUsuario: number | null, IdPessoaEscolaAcesso: number | null, IdSegmento: number | null, Nome: string, EscolaHash: string | null, ... +3
- **AlunoAgrupadoVM** (interface): idPessoa: number, nomeCompleto: string, foto: string | null, codPessoaTOTVS: number | null, fotoUrl: string, ... +1
- **AlunoHashModel** (interface): TurmaHash: string, HashAluno: string
- **ArquivoModel** (interface): NomeGuia: string | null, LinkArquivo: string | null
- **BannerPOAModel** (interface): DataHora: Date | null, POAUrl: string | null, TipoRede: number | null, BannerUrl: string | null, ExibirBanner: boolean
- **CalendarioProfessorModel** (interface): Dia: string | null, HoraInicio: string | null, HoraFim: string | null, NomeDisciplina: string | null, NomeTurma: string | null, ... +2
- **ChamadaSummaryModel** (interface): hashUsuarioOrigem: string, totalFaltas: number, totalAtrasos: number, anoLetivo: number
- **ComportamentoAlunoDetalheModel** (interface): IdAlunoEscola: number, HashAlunoEscola: string | null, DataComportamento: string, IdDisciplina: number, NomeDisciplina: string | null, ... +3
- **ComportamentoAlunoModel** (interface): totalPositivos: number, totalNegativos: number
- **CursoDTO** (interface): progresso: number, percentual: number, nome: string, hash: string, idCourseKanttum: number
- **EletivasEngajamentoChamadaApiResponse** (interface): Data: EletivasEngajamentoDTO[]
- **EletivasEngajamentoDTO** (interface): StatusPeriodo: string, TipoCurso: string, Cursos: CursoDTO[]
- **ElevaIdModel** (interface)
- **EmbedConfigDTO** (interface): Id: string, EmbedUrl: string, EmbedToken: EmbedTokenDTO, Hash: string, MinutesToExpiration: number, ... +3
- **EmbedTokenDTO** (interface): Token: string, TokenId: string
- **EscolaDTO** (interface): IdEscola: number, HashEscola: string, NomeEscola: string, Rua: string, Numero: string, ... +3
- **FiltroFrequenciaStore** (interface): hashUsuario: string, aplicado: boolean, rede: string, redes: ResponseModel[], escola: string, ... +2
- **FuncionalidadeAcessadaModel** (interface): IdUsuario: number, IdPerfilAcesso: number, Rota: string, Link: string, Icone: string, ... +3
- **GradeMarcaLandPageModel** (interface): nome: string, imagem: string
- **GuiaPortalModel** (interface): isualizado: boolean, Dispensado: boolean
- **IAlunoResponsavelModel** (interface): hashUsuarioOrigem: string, nomeAluno: string
- **IBannerCampanhaModel** (interface): hash: string, link: string, nome: string, nomeImagem: string
- **IElevaIdToken** (interface): AccessToken: string, AccessTokenExpiration: Date
- **IExceptionError** (interface): codeId: number, errors: IExceptionErrorDetail[], isSuccess: boolean, message: any
- **IExceptionErrorDetail** (interface): code: string, message: any, statusCode: number, details: any[]
- **IExceptionFormErrorMessage** (interface): propertyName: string, message: string
- **IFaltaAtrasoSummaryModel** (interface): hashUsuarioOrigem: string, totalFaltas: number, totalAtrasos: number, anoLetivo: number
- **IModalDevolutivasParametros** (interface): contagemFechamentos: number, relatorioAcessado: boolean, dataUltimaExibicaoModal: string
- **IUnidadeParamsFilterCacheRequest** (interface): hashRede: string[], hashMarca: string[] | null | undefined, hashTipoNu: string[], hashDataUnidade: string[]
- **IUnidadeParamsFilterRequest** (interface): hashRede: string[], hashMarca: string[] | null | undefined, hashTipoNu: string[], hashDataUnidade: string[]
- **IUnidadeParamsGetRequest** (interface): hashRede: string[], hashMarca: string[] | null | undefined, hashTipoNu: string[], hashDataUnidade: string[]
- **IUnidadeResponseFilterModel** (interface): redeHash: string[]| null | undefined, marcaHash: string[] | null | undefined, tipoNuHash: string[], dataUnidadeHash: string[]
- **IUnidadeResponseFormModel** (interface): hashRede: string[]| null | undefined, hashMarca: string[] | null | undefined, hashTipoNu: string[], hashDataUnidade: string[], redeHash: string[]| null | undefined, ... +3
- **IUnidadeResponseGridModel** (interface): hash: string, nome: string, rede: RedeResponse, tipoNU: TipoNUResponse, dataInclusao: string, ... +1
- **LancamentoFrequenciaFilterRequest** (interface): hashRede: string, hashEscola: string, dataAula: string | Date
- **LancamentoFrequenciaTurmaResponse** (interface): hash: string, descricao: string, possuiLancamento: boolean
- **ListaFrequenciaStore** (interface): turma: LancamentoFrequenciaTurmaResponse, filter: FiltroFrequenciaStore
- **MarcaResponse** (interface): hash: string, nome: string, tipoRede: number
- **NotasAvaliacaoModel** (interface): Nota: number, NotaMaxima: number, NomeProva: string | null, EhPM: boolean, Disciplina: string | null, ... +3
- **NotasPOADisciplinaDTO** (interface): idDisciplina: number, nomeDisciplina: string, siglaDisciplina: string, notaPoa: number
- **NotasPOAHistoricoDTO** (interface): idPeriodo: number, nomePeriodo: string, siglaPeriodo: string, mediaPeriodo: number
- **NotasPOASegmentoDTO** (interface): idSegmento: number, nomeSegmento: string, siglaSegmento: string, notaPoa: number
- **NotasPOASerieDTO** (interface): idSerie: number, nomeSerie: number, notaPoa: number
- **Paginacao** (interface)
- **PagingParametersRequest** (interface): itemCount: number, currentPage: number, pageSize: number, pesquisa: string
- **PerfilOption** (interface): value: string, label: string, selecionado: boolean
- **PoaComparativolDTO** (interface): notasDisciplina: NotasPOADisciplinaDTO[], notasSerie: NotasPOASerieDTO[], notasSegmento: NotasPOASegmentoDTO[], notasHistorico: NotasPOAHistoricoDTO[], mediaRede: number, ... +1
- **ProgressoAlunoModel** (interface): statusPeriodo: string, tipoCurso: string, cursos: ProgressoAlunoModelCurso[]
- **ProgressoAlunoModelCurso** (interface): progresso: number, percentual: number, nome: string, hash: string, idCourseKanttum: number
- **RedeResponse** (interface): hash: string, nome: string, marca: MarcaResponse
- **ResponseModel** (interface): hash: string, descricao: string
- **TipoNUResponse** (interface): hash: string, nome: string
- **TurmaAcessoVM** (interface): idPessoaEscolaAcesso: number | null, turmaHash: string | null, nomeTurma: string | null, nomeEscola: string | null, idSegmento: number | null
- **UnidadeCadastroModel** (interface): hash: string, hashRede: string, codColigada: string, codFilial: string, rematricula: boolean, ... +3
- **UnidadeEnderecoModel** (interface): hash: string, cep: string, endereco: string, numero: string, complemento: string, ... +3
- **UnidadeResponse** (interface): hash: string, nome: string, rede: RedeResponse, tipoNU: TipoNUResponse, dataInclusao: string, ... +1
- **UnidadeTelefoneModel** (interface): hash: string, telefone: string
- **UnidadesServiceModel** (interface): CurrentPage: number, PageSize: number, HasNextPage: boolean, TotalPages: number, TotalCount: number, ... +1
- **UsuarioAutenticadoModel** (interface): CodColigada: number | null, CodFilial: number | null, HashTurmaAluno: string | null, HashPessoaEscolaAcesso: string | null, EhResponsavel: boolean

---
*80 componentes · 60 services · 24 módulos · 60 models · 9 rotas*