# Angular Map — estrutura-pedagogica
> Gerado em: 2026-07-30  
> Fonte: `C:\projects\estrutura-pedagogica\frontend`

## Módulos

- **AppRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **BoletimModule** · declara: [BoletimComponent, ProcessamentoBoletimComponent] · importa: [CommonModule, BoletimRoutingModule, SharedModule, FiltroModule]
- **BoletimRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **CargasIniciaisModule** · declara: [CargasIniciaisTabnavComponent, AlocacaoProfessoresComponent, GradeHorariaComponent, ImportarAlocacaoProfessoresComponent, FormEtapaImportacaoComponent] · importa: [SharedModule, CommonModule, CoreModule, FormsModule, FiltroModule, ... +1]
- **CargasIniciaisRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **CoreModule** · declara: [OnlyNumberDirective] · importa: [CommonModule, NgxPaginationModule, ReactiveFormsModule, NgSelectModule, FormsModule, ... +6] · exporta: [FontAwesomeModule, NgxSpinnerModule, ReactiveFormsModule, FormsModule, ... +1]
- **DatadogErrorHandler** · declara: [AppComponent, ToastrElevaComponent, HomeComponent, PageNotFoundComponent, SessionExpiredComponent, ... +1] · importa: [SharedModule, BrowserModule, BrowserAnimationsModule, AppRoutingModule, CommonModule, ... +14]
- **DocumentBuilderModule** · importa: [CommonModule, SharedModule]
- **DocumentEditorModule** · declara: [DocumentEditorComponent, EditorCanvasComponent, BlockLibraryComponent, BlockInspectorComponent] · importa: [CommonModule, FormsModule, RouterModule, DragDropModule, DocumentBuilderModule] · exporta: [DocumentEditorComponent]
- **DynamicComponentsModule** · declara: [TextareaFieldComponent, TextFieldComponent, MultiSelectFieldComponent, SelectFieldComponent, NumberFieldComponent, ... +12] · importa: [CommonModule, ReactiveFormsModule, FormsModule] · exporta: [TextareaFieldComponent, TextFieldComponent, MultiSelectFieldComponent, SelectFieldComponent, ... +13]
- **EscolasGerenciaisModule** · declara: [CadastroEscolaGerencialComponent, ListarEscolaGerencialComponent, EditarEscolaGerencialComponent] · importa: [SharedModule, CommonModule, CoreModule, FormsModule, FiltroModule, ... +1]
- **EscolasGerenciaisRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **EscolasPublicasModule** · declara: [EscolasPublicasListarComponent, EscolasPublicasEditarComponent, EscolasPublicasDetalhesComponent, CadastroEscolaPublicaComponent, RemoverTurmaComponent, ... +4] · importa: [SharedModule, FormsModule, CommonModule, CoreModule, EscolasPublicasRoutingModule, ... +1]
- **EscolasPublicasRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **ExemplosModule** · declara: [FiltrosComponent, TelaBaseComponent, InfoBaseComponent, TableFilterComponent, DocumentsComponent, ... +5] · importa: [CommonModule, DynamicComponentsModule, ExemplosRoutingModule, FiltroModule, SharedModule, ... +9]
- **ExemplosRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **FichaIndividualModule** · declara: [FichaIndividualComponent] · importa: [CommonModule, DocumentBuilderModule, FichaIndividualRoutingModule]
- **FichaIndividualRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **FiltroModule** · declara: [FiltroComponent, FilterFieldWrapperComponent] · importa: [FormsModule, CommonModule, SharedModule, DynamicComponentsModule] · exporta: [FiltroComponent]
- **FolhaModule** · declara: [ListarChecklistComponent, CargasIndevidasComponent, ProfessoresSemScComponent, ProfessoresAcimaDoLimiteComponent, DisciplinasSemTitularComponent, ... +27] · importa: [CommonModule, FolhaRoutingModule, SharedModule, CoreModule, FormsModule, ... +1]
- **FolhaRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **GradeHorariaModule** · declara: [ConfiguradorTempoPadraoComponent] · importa: [SharedModule, FiltroModule, FormsModule, ReactiveFormsModule, CommonModule, ... +1]
- **GradeHorariaRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **ItinerarioFormativoModule** · declara: [ListarItinerariosComponent, EditarItinerarioComponent] · importa: [SharedModule, FiltroModule, FormsModule, CommonModule, CoreModule, ... +3]
- **ItinerarioFormativoRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **MenuModule** · declara: [AppMenuComponent, AppMenuItemComponent] · importa: [CommonModule] · exporta: [AppMenuComponent]
- **MovimentacaoPedagogicaModule** · declara: [AlteracaoCargaComponent, MovimentacaoTabNavigatorComponent, LancamentoEventosComponent, AlteracaoCargaDetalhesComponent, CentralMovimentacaoPedagogicaComponent, ... +12] · importa: [SharedModule, CommonModule, CoreModule, FormsModule, FiltroModule, ... +1]
- **MovimentacaoPedagogicaRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **NomeDoModuloModule** · declara: [NomeDoModuloComponent] · importa: [CommonModule, NomeDoModuloRoutingModule]
- **NomeDoModuloRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **OcorrenciaModule** · declara: [ListarOcorrenciaComponent, CadastroTipoOcorrenciaComponent] · importa: [SharedModule, CommonModule, FormsModule, CoreModule, OcorrenciaRoutingModule, ... +1]
- **OcorrenciaRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **PortalModule** · declara: [PortalHeaderComponent, PortalMenuComponent, PortalModalComponent, LogarComoComponent, LogoEscolaComponent, ... +14] · importa: [CommonModule, FormsModule, NgbDropdownModule] · exporta: [PortalAuthComponent, PortalHeaderComponent, PortalModuloComponent, PortalBodyComponent, ... +3]
- **RelatorioModule** · declara: [DisciplinasComponent] · importa: [FiltroModule, SharedModule, CommonModule, RelatorioRoutingModule]
- **RelatorioRoutingModule** · importa: [RouterModule] · exporta: [RouterModule]
- **SemConteudoModule** · declara: [SemConteudoComponent] · importa: [CommonModule] · exporta: [SemConteudoComponent]
- **SharedModule** · declara: [ButtonComponent, IconButtonComponent, CirleIconButtonComponent, TituloPageComponent, LoadingComponent, ... +23] · importa: [CommonModule, CoreModule, FormsModule, ScrollingModule, SidePanelComponent, ... +1] · exporta: [ButtonComponent, IconButtonComponent, CirleIconButtonComponent, TituloPageComponent, ... +28]
- **ShellsModule** · declara: [DefaultShellComponent, EmptyShellComponent, AtlasShellComponent, AtlasTopBarComponent, AtlasLeftPanelComponent, ... +5] · importa: [CommonModule, RouterModule, SharedModule, PortalModule, MenuModule] · exporta: [DefaultShellComponent, EmptyShellComponent, AtlasShellComponent]

## Rotas

- `**` → ?
- `listar` → ListarAgrupadorSeriesComponent `[IsLoggedGuard]`
- `path.Boletim.Processamento` → ProcessamentoBoletimComponent
- `path.ConfiguradorAgrupamentos.Listar` → listar *(lazy)*
- `path.ConfiguradorAgrupamentos.Editar` → editar *(lazy)*
- `editar` → EditarPeriodoLetivoComponent
- `listar` → DiaLetivoExtraListarComponent
- `novo` → FormularioDiaLetivoExtraPageComponent
- `editar/:hash` → FormularioDiaLetivoExtraPageComponent
- `listar` → DiasSemAulaListarComponent
- `novo` → FormularioDiasSemAulaPageComponent
- `editar/:hash` → FormularioDiasSemAulaPageComponent
- `listar` → ListarEtapasComponent
- `**` → ?
- `lancamento` → LancamentoFrequenciaComponent
- `listar` → LiberacaoBoletinsListarComponent `[CanDeactivateGuard]`
- `listar` → LiberacaoBoletinsListarV0Component `[CanDeactivateGuard]`

## Componentes

### agrupador-series
- **AtualizarAgrupamentosModalComponent** `app-atualizar-agrupamentos-modal`
  - @Input: linhasSelecionadas: AgrupadorSeriesListagemResponse[], agrupamentosAtivos: SelectOption[]
  - @Output: fechar, salvar
- **ListarAgrupadorSeriesComponent** `app-listar-agrupador-series`
  - Injeta: AgrupadorSeriesService, ChangeDetectorRef, FiltroAgrupadorSeriesService, NotificationService, StringUtilsService

### alert-card
- **AlertCardComponent** `app-alert-card`
  - @Input: variant: signal, title: signal, icon: signal, expandable: signal

### alocacao-professores-monitores
- **AlocacaoProfessoresMonitoresListarComponent** `app-listar`
  - Injeta: AlocacaoProfessoresMonitoresService, ChangeDetectorRef, FileService, FiltroAlocacaoProfessoresMonitoresService, StringUtilsService
- **AlocacaoProfessoresMonitoresPainelComponent** `app-painel`
  - @Input: show: boolean, turma: AlocacaoProfessoresMonitoresTurmaResponse | null, hashRede: string | null, profissionais: ProfissionalAtivoItem[]
  - @Output: fechar, contadoresAlterados
  - Injeta: AlocacaoProfessoresMonitoresService, StringUtilsService, Subscription

### app
- **AppComponent** `app-root`
  - Injeta: HelpHeroService, UsuarioService

### app-menu
- **AppMenuComponent** `app-menu`
  - Injeta: ChangeDetectorRef, ElementRef, MenuFacadeService

### app-menu-item
- **AppMenuItemComponent** `app-menu-item`
  - @Input: item: MenuItem
  - @Output: navigate, submenuToggle

### atlas-command-palette
- **AtlasCommandPaletteComponent** `atlas-command-palette`
  - @Output: close
  - Injeta: MenuFacadeService

### atlas-left-panel
- **AtlasLeftPanelComponent** `atlas-left-panel`

### atlas-menu
- **AtlasMenuComponent** `atlas-menu`
  - @Output: close
  - Injeta: ChangeDetectorRef, MenuFacadeService

### atlas-notificacoes
- **AtlasNotificacoesComponent** `atlas-notificacoes`
  - Injeta: ElementRef, NotificacaoService, PortalConfig, UsuarioService

### atlas-right-panel
- **AtlasRightPanelComponent** `atlas-right-panel`

### atlas-shell
- **AtlasShellComponent** `app-atlas-shell`
  - Injeta: ActivatedRoute, Router

### atlas-top-bar
- **AtlasTopBarComponent** `atlas-top-bar`
  - @Output: openPalette, openMenu

### atlas-user-menu
- **AtlasUserMenuComponent** `atlas-user-menu`
  - Injeta: ElementRef, MenuService, ModalService, PortalConfig, UsuarioService

### boletim
- **BoletimComponent** `app-boletim`
- **ProcessamentoBoletimComponent** `app-processamento`
  - Injeta: FiltroService, NotificationService, ProcessamentoService, Title

### bool-status
- **BoolStatusComponent** `app-bool-status`
  - @Input: value: signal

### button
- **ButtonComponent** `app-button`
  - @Input: label: signal, classButton: signal, disabled: signal, icon: signal... +4
  - @Output: clickEvent

### cadastro-ciclos
- **CadastroCicloModalComponent** `app-cadastro-ciclo-modal`
  - @Output: atualizarLista
  - Injeta: CadastroCiclosService, EtapaComEscopoOption, FormBuilder, NotificationService
- **ListarCadastroCiclosComponent** `app-listar-cadastro-ciclos`
  - Injeta: CadastroCiclosService, ChangeDetectorRef, DestroyRef, FileService, NotificationService
- **RemoverCicloComponent** `app-remover-ciclo`
  - @Output: atualizarLista
  - Injeta: CadastroCiclosService, NotificationService
- **UsosCicloComponent** `app-usos-ciclo`
  - Injeta: CadastroCiclosService

### cadastro-conceitos
- **CadastroConceitosListarComponent** `app-listar-cadastro-conceitos`
  - Injeta: CadastroConceitosService, ChangeDetectorRef, FileService, NotificationService, StringUtilsService
- **CadastroConceitosPainelComponent** `app-painel-cadastro-conceitos`
  - @Output: atualizarLista
  - Injeta: CadastroConceitosService, FormBuilder, NotificationService
- **ConfirmarArquivarRestaurarGrupoComponent** `app-confirmar-arquivar-restaurar-grupo`
  - @Output: atualizarLista
  - Injeta: CadastroConceitosService, NotificationService
- **ModalUsoGrupoComponent** `app-modal-uso-grupo`
  - Injeta: CadastroConceitosService

### cadastro-disciplinas-mae
- **CadastroDisciplinasMaeListarComponent** `app-listar-cadastro-disciplinas-mae`
  - Injeta: ChangeDetectorRef, FileService, FiltroCadastroDisciplinasMaeService, NotificationService, StringUtilsService
- **CadastroDisciplinasMaePainelComponent** `app-painel-cadastro-disciplinas-mae`
  - @Input: show: boolean, disciplinaHash: string | null, hashRede: string | null
  - @Output: fechar, salvo
  - Injeta: CadastroDisciplinasMaeService, FormBuilder, NotificationService, Subscription

### cadastro-etapas
- **ListarCadastroEtapasComponent** `app-listar-cadastro-etapas`
  - Injeta: ChangeDetectorRef, DestroyRef, FileService, FiltroCadastroEtapasService, NotificationService
- **PainelCadastroEtapasComponent** `app-painel-cadastro-etapas`
  - @Output: atualizarLista
  - Injeta: CadastroEtapasService, FormBuilder, NotificationService
- **RemoverCadastroEtapasComponent** `app-remover-cadastro-etapas`
  - @Output: atualizarLista
  - Injeta: CadastroEtapasService, NotificationService
- **UsosCadastroEtapasComponent** `app-usos-cadastro-etapas`
  - Injeta: CadastroEtapasService

### cadastro-tipos-avaliacao
- **CadastroTipoAvaliacaoModalComponent** `app-cadastro-tipo-avaliacao-modal`
  - @Output: atualizarLista
  - Injeta: CadastroTiposAvaliacaoService, FormBuilder, NotificationService
- **ListarCadastroTiposAvaliacaoComponent** `app-listar-cadastro-tipos-avaliacao`
  - Injeta: CadastroTiposAvaliacaoService, ChangeDetectorRef, DestroyRef, FileService, NotificationService
- **RemoverTipoAvaliacaoComponent** `app-remover-tipo-avaliacao`
  - @Output: atualizarLista
  - Injeta: CadastroTiposAvaliacaoService, NotificationService
- **UsosTipoAvaliacaoComponent** `app-usos-tipo-avaliacao`
  - Injeta: CadastroTiposAvaliacaoService

### card-info
- **CardInfoComponent** `app-card-info`
  - @Input: title: string, message: string

### card-message
- **CardMessageComponent** `app-card-message`
  - @Input: title: string, iconClass: string, icon: string

### carga-horaria-input
- **CargaHorariaInputComponent** `carga-horaria-input`
  - @Input: control: FormControl | null, fieldName: string, placeholder: string

### cargas-iniciais
- **AlocacaoProfessoresComponent** `app-alocacao-professores`
  - Injeta: FilterAlocacaoProfessorService, ImportacaoAlocacaoProfessoresService, RouteStateService, Router
- **CargasIniciaisTabnavComponent** `app-cargas-iniciais-navigator`
- **FormEtapaImportacaoComponent** `form-etapa-importacao`
  - @Input: etapa: Step<any>, loading: boolean
  - @Output: submitEvent
- **GradeHorariaComponent** `app-grade-horaria`
- **ImportarAlocacaoProfessoresComponent** `app-importacao`
  - Injeta: FormBuilder, ImportacaoAlocacaoProfessoresService, NotificationService, RouteStateService, Router

### check
- **CheckComponent** `app-check`
  - @Input: state: signal, label: signal, size: signal, disabled: signal... +1
  - @Output: toggle

### checkbox
- **CheckboxFieldComponent** `app-checkbox`
  - @Input: control: FormControl | null, fieldName: string, checkboxInfo: string, accent: TagVariant

### checkbox-field
- **CheckboxFieldComponent** `app-checkbox-field`
  - @Input: id: string
  - @Output: eventChange
  - Injeta: NgControl

### checkmark-dropdown
- **CheckmarkDropdownComponent** `app-checkmark-dropdown`
  - @Input: options: CheckmarkDropdownOption<T>[], value: T
  - @Output: valueChange
  - Injeta: ElementRef

### circle-icon-button
- **CirleIconButtonComponent** `app-circle-icon-button`
  - @Input: icon: string, disabled: boolean
  - @Output: clickEvent

### components
- **AvatarComponent** `app-avatar`
  - @Input: userId: string, userName: string, photoUrl: string | null
  - Injeta: PhotoService
- **TabConfiguradorPeriodosLetivosComponent** `app-tab-configurador-periodos-letivos`
  - Injeta: ConfiguradorPeriodosLetivosService

### configurador-agrupamentos
- **EditarConfiguradorAgrupamentosComponent** `app-editar-configurador-agrupamentos`
  - Injeta: ActivatedRoute, ConfiguradorAgrupamentosService, FormBuilder, NotificationService, RouteStateService, ... +1
- **ListarConfiguradorAgrupamentosComponent** `app-listar-configurador-agrupamentos`
  - Injeta: ChangeDetectorRef, ConfiguradorAgrupamentosService, FiltroConfiguradorAgrupamentosService, RouteStateService, Router, ... +1

### configurador-disciplinas
- **EditarDisciplinaComponent** `app-editar-disciplina`
  - @Output: atualizarLista
  - Injeta: ConfiguradorDisciplinasService, FormBuilder, NotificationService, Set
- **IncluirDisciplinaComponent** `app-incluir-disciplina`
  - @Output: atualizarLista
  - Injeta: ConfiguradorDisciplinasService, FormBuilder, NotificationService
- **ListarConfiguradorDisciplinasComponent** `app-listar-configurador-disciplinas`
  - Injeta: ChangeDetectorRef, ConfiguradorDisciplinasService, NotificationService
- **RemoverDisciplinaComponent** `app-remover-disciplina`
  - @Output: atualizarLista
  - Injeta: ConfiguradorDisciplinasService, NotificationService

### configurador-frentes
- **CargaInicialComponent** `app-carga-inicial`
  - Injeta: ChangeDetectorRef, ConfiguradorFrentesService, FiltroConfiguradorFrentesService
- **ConfiguradorFrentesComponent** `app-configurador-frentes`
  - Injeta: DestroyRef, FiltroConfiguradorFrentesService
- **ConfiguradorFrentesListarComponent** `app-configurador-frentes-listar`
  - Injeta: ChangeDetectorRef, ConfiguradorFrentesService, FileService, FiltroConfiguradorFrentesService, StringUtilsService
- **ConfiguradorFrentesPainelComponent** `app-configurador-frentes-painel`
  - @Input: escolaSerie: ConfiguradorFrentesItemResponse | null
  - @Output: fechar
  - Injeta: ConfiguradorFrentesService
- **ConfiguradorFrentesTabNavigatorComponent** `app-configurador-frentes-tab-navigator`
  - Injeta: FiltroConfiguradorFrentesService

### configurador-periodos-letivos
- **ConfiguradorPeriodosLetivosComponent** `app-configurador-periodos-letivos`
  - Injeta: ConfiguradorPeriodosLetivosService, DestroyRef, Router
- **DiaLetivoExtraListarComponent** `app-listar-dia-letivo-extra`
  - Injeta: ChangeDetectorRef, DestroyRef, DiaLetivoExtraService, FileService, FiltroDiaLetivoExtraService, ... +1
- **DiasSemAulaListarComponent** `app-listar-dias-sem-aula`
  - Injeta: ChangeDetectorRef, DestroyRef, DiasSemAulaService, FiltroDiasSemAulaService, NotificationService, ... +1
- **EditarEtapasComponent** `app-editar-etapas`
  - @Output: atualizarLista
  - Injeta: DateUtilsService, EtapasService, FormBuilder, NotificationService
- **EditarPeriodoLetivoComponent** `app-editar`
  - Injeta: ChangeDetectorRef, ConfiguradorAnoLetivoService, DateUtilsService, DestroyRef, FileService, ... +1
- **FormularioDiaLetivoExtraPageComponent** `app-formulario-dia-letivo-extra-page`
  - Injeta: ActivatedRoute, DiaLetivoExtraFilterRequest, DiaLetivoExtraService, FiltroDiaLetivoExtraService, FormBuilder, ... +1
- **FormularioDiasSemAulaPageComponent** `app-formulario-dias-sem-aula-page`
  - Injeta: ActivatedRoute, DestroyRef, DiaSemAulaTipoResponse, DiasSemAulaFilterRequest, DiasSemAulaService, ... +1
- **ListarComponent** `app-listar`
  - Injeta: ChangeDetectorRef, DestroyRef, EtapasService, FiltroEtapasService

### custom-radio
- **CustomRadioComponent** `app-custom-radio`
  - @Input: control: FormControl | null, options: RadioOptions[], fieldName: string, placeholder: string

### date-field
- **DateFieldComponent** `date-field`
  - @Input: control: FormControl | AbstractControl, min: string, max: string, disabled: boolean... +3
  - Injeta: DateUtilsService
- **DateFieldComponent** `app-date-field`
  - @Input: control: FormControl | null, fieldName: string, min: string, max: string... +2

### datepicker
- **DatepickerComponent** `app-datepicker`
  - @Input: config: CalendarConfig, min: Date, max: Date, start: Date... +3
  - @Output: change
  - Injeta: DateCalendar

### daterangepicker-field
- **DateRangePickerComponent** `app-daterange-picker`
  - @Input: label: string, required: boolean, nullable: boolean, initialYear: number... +3
  - @Output: eventDateChange
  - Injeta: ElementRef, NgbCalendar, NgbDateParserFormatter, Renderer2

### default-shell
- **DefaultShellComponent** `app-default-shell`

### diario-de-classe
- **DiarioConfiguracaoComponent** `app-diario-configuracao`
  - Injeta: DestroyRef, DiarioDeClasseService, FiltroDiarioDeClasseService, NotificationService, PreviewAluno
- **DiarioDeClasseComponent** `app-diario-de-classe`
  - Injeta: DestroyRef, FiltroDiarioDeClasseService
- **DiarioDeClasseTabNavigatorComponent** `app-diario-de-classe-tab-navigator`
  - Injeta: FiltroDiarioDeClasseService
- **ListarComponent** `app-diario-de-classe-listar`
  - Injeta: DiarioClasseCaracteres, DiarioDeClasseDocumentoResponse, DiarioDeClasseService, DiarioDocumentoStorageService, FiltroDiarioDeClasseService, ... +1

### doc-carometro-card
- **DocCarometroCardComponent** `app-doc-carometro-card`
  - @Input: aluno: CarometroAlunoData, variant: CarometroCardVariant, cardHeight: number, visibility: CarometroVisibility

### doc-carometro-config-panel
- **DocCarometroConfigPanelComponent** `app-doc-carometro-config-panel`
  - @Input: selected: CarometroCardVariant, cardHeight: number, visibility: CarometroVisibility
  - @Output: selectedChange, colsChange, gapChange, cardHeightChange, ... +2

### doc-carometro-grid
- **DocCarometroGridComponent** `app-doc-carometro-grid`
  - @Input: data: DocCarometroGridData

### doc-carometro-info
- **DocCarometroInfoComponent** `app-doc-carometro-info`
  - @Input: data: DocPresencaInfoData, contentWidth: number

### doc-carometro-variant-picker
- **DocCarometroVariantPickerComponent** `app-doc-carometro-variant-picker`
  - @Input: selected: CarometroCardVariant
  - @Output: selectedChange
  - Injeta: CarometroVariantInfo

### doc-diario-config-panel
- **DocDiarioConfigPanelComponent** `app-doc-diario-config-panel`
  - @Input: secoes: DiarioClasseSecoes, caracteres: DiarioClasseCaracteres
  - @Output: secoesChange, liveCaracteresChange, etapaChange

### doc-footer
- **DocFooterComponent** `app-doc-footer`
  - @Input: currentPage: number, totalPages: number

### doc-frame
- **DocFrameComponent** `app-doc-frame`
  - @Input: config: FrameConfig

### doc-grid-conteudo
- **DocGridConteudoComponent** `app-doc-grid-conteudo`
  - @Input: data: DocGridConteudoData, fontSize: number, contentWidth: number, cellPadding: number... +1

### doc-grid-diario
- **DocGridDiarioComponent** `app-doc-grid-diario`
  - @Input: data: DocGridDiarioData, fontSize: number, cellPadding: number, cellPaddingH: number... +1
  - Injeta: DocumentLogService

### doc-grid-rendimento
- **DocGridRendimentoComponent** `app-doc-grid-rendimento`
  - @Input: data: DocGridRendimentoData, fontSize: number, cellPadding: number, cellPaddingH: number
  - Injeta: DocumentLogService

### doc-header
- **DocHeaderComponent** `app-doc-header`
  - @Input: data: DocHeaderData

### doc-info-frequencia
- **DocInfoFrequenciaComponent** `app-doc-info-frequencia`
  - @Input: data: DocInfoRowData, contentWidth: number

### doc-info-grid
- **DocInfoGridComponent** `app-doc-info-grid`
  - @Input: data: DocGridData

### doc-info-row
- **DocInfoRowComponent** `app-doc-info-row`
  - @Input: data: DocInfoRowData, contentWidth: number

### doc-info-table
- **DocInfoTableComponent** `app-doc-info-table`

### doc-last-page-info
- **DocLastPageInfoComponent** `app-doc-last-page-info`
  - @Input: data: DocLastPageInfoData, contentWidth: number

### doc-legend
- **DocLegendComponent** `app-doc-legend`
  - @Input: label: string, items: LegendItem[], fontSize: number, contentWidth: number

### doc-mini-loader
- **DocMiniLoaderComponent** `app-doc-mini-loader`

### doc-presenca-info
- **DocPresencaInfoComponent** `app-doc-presenca-info`
  - @Input: data: DocPresencaInfoData, contentWidth: number

### doc-section
- **DocSectionComponent** `app-doc-section`
  - @Input: data: DocSectionData, fontSize: number, contentWidth: number

### doc-signature
- **DocSignatureComponent** `app-doc-signature`
  - @Input: signatories: SignatoryConfig[], city: string, highlight: boolean, signatoriesGap: number... +2

### doc-statement
- **DocStatementComponent** `app-doc-statement`
  - @Input: data: DocStatementData, fontSize: number, contentWidth: number

### doc-table
- **DocTableComponent** `app-doc-table`
  - @Input: data: DocTableData, fontSize: number, contentWidth: number, cellPadding: number... +1

### doc-text
- **DocTextComponent** `app-doc-text`
  - @Input: label: string, value: string, fontSize: number, contentWidth: number

### doc-text-field
- **DocTextFieldComponent** `app-doc-text-field`
  - @Input: label: string, value: string, fontSize: number, contentWidth: number

### doc-title
- **DocTitleComponent** `app-doc-title`
  - @Input: title: string, border: boolean, centered: boolean, fontSize: number... +1

### doc-wide-table
- **DocWideTableComponent** `app-doc-wide-table`
  - @Input: data: DocWideTableData, fontSize: number, contentWidth: number, cellPadding: number... +4
  - Injeta: DocumentLogService

### document-carousel-overlay
- **DocumentCarouselOverlayComponent** `app-document-carousel-overlay`
  - @Input: viewer: signal, silent: signal
  - @Output: closeEvent, printEvent, saveEvent

### document-config-panel
- **DocumentConfigPanelComponent** `app-document-config-panel`
  - @Input: canOpenInEditor: signal, showCellPadding: signal
  - @Output: configChange, openInEditor

### document-debug
- **DocumentDebugComponent** `app-document-debug`
  - @Input: pages: Page[], config: DocumentConfig

### document-page
- **DocumentPageComponent** `app-document-page`
  - @Input: index: signal, total: signal, headerData: signal

### document-viewer
- **DocumentViewerComponent** `app-document-viewer`
  - @Input: config: DocumentConfig, entries: DocumentEntry[], headerData: DocHeaderData, documents: DocumentBundle[]
  - @Output: imagesFailed
  - Injeta: ChangeDetectorRef, ComponentRef, DocumentLogService, LayoutEngineService, MeasurementService, ... +1

### dropdown-actions
- **DropdownActionsComponent** `app-dropdown-actions`
  - @Input: options: DropdownOption<any>[]
  - @Output: optionSelected
  - Injeta: ElementRef

### empty-shell
- **EmptyShellComponent** `app-empty-shell`

### escolas-gerenciais
- **CadastroEscolaGerencialComponent** `app-cadastro-escola-gerencial`
  - @Output: aplicarFiltroSeForMesmaRede
  - Injeta: EscolaGerencialService, FormBuilder, NotificationService
- **EditarEscolaGerencialComponent** `app-editar-escola-gerencial`
  - @Input: escolaParaEditar: EscolaGerencialResponse, escolas: ResponseModel[]
  - @Output: atualizarLista
  - Injeta: EscolaGerencialService, FormBuilder, NotificationService
- **ListarEscolaGerencialComponent** `app-listar-escola-gerencial`
  - Injeta: EscolaGerencialService

### escolas-publicas
- **CadastroEscolaPublicaComponent** `app-cadastro-escola-publica`
  - @Input: hashAnoLetivo: string, series: BaseResponse[], turnos: BaseResponse[]
  - @Output: closeModalEvent, atualizarLista
  - Injeta: EscolasPublicasService, FormBuilder, NotificationService
- **CadastroTurmaComponent** `app-cadastro-turma`
  - @Input: escola: EscolasPublicasGetResponse, series: ResponseModel[], turnos: ResponseModel[], filtro: CadastroEscolasPublicasFilterRequest
  - @Output: atualizarLista
  - Injeta: EscolasPublicasService, FormBuilder, NotificationService
- **CadastroTurmaServicoComponent** `app-cadastro-turma-servico`
  - @Input: escola: EscolasPublicasGetResponse, series: ResponseModel[], filtro: CadastroEscolasPublicasFilterRequest
  - @Output: atualizarLista
  - Injeta: EscolasPublicasService, FormBuilder, NotificationService
- **EditarEscolaPublicaComponent** `app-editar-escola-publica`
  - @Input: escola: EscolasPublicasGetResponse
  - @Output: closeModalEvent, atualizarLista
  - Injeta: EscolasPublicasService, FormBuilder, NotificationService
- **EditarTurmaComponent** `app-editar-turma`
  - @Input: turnos: ResponseModel[], escola: EscolasPublicasGetResponse
  - @Output: closeModalEvent, atualizarLista
  - Injeta: EscolasPublicasService, FormBuilder, NotificationService
- **EscolasPublicasDetalhesComponent** `app-detalhes`
  - Injeta: EscolasPublicasService, RouteStateService, Router
- **EscolasPublicasEditarComponent** `app-editar`
- **EscolasPublicasListarComponent** `app-listar`
  - Injeta: ChangeDetectorRef, EscolasPublicasService, FileService, FiltroEscolasPublicasService, RouteStateService, ... +1
- **RemoverTurmaComponent** `app-remover-turma`
  - @Output: atualizarLista
  - Injeta: EscolasPublicasService, NotificationService

### exemplos
- **AbaMockExemploComponent** `app-aba-mock-exemplo`
  - Injeta: ActivatedRoute
- **AbasPermissaoExemploComponent** `app-abas-permissao-exemplo`
  - Injeta: AbasPermissaoExemploService, DestroyRef, Router
- **AbasPermissaoPainelControleExemploComponent** `app-abas-permissao-painel-controle-exemplo`
  - @Output: recarregar
  - Injeta: AbasPermissaoExemploService
- **AbasPermissaoTabNavigatorExemploComponent** `app-abas-permissao-tab-navigator-exemplo`
  - Injeta: AbasPermissaoExemploService
- **BlockInspectorComponent** `app-block-inspector`
  - @Input: selectedBlock: EditorBlock | null, config: DocumentConfig
  - @Output: configChange, blockDataChange, blockLabelChange
  - Injeta: ChangeDetectorRef
- **BlockLibraryComponent** `app-block-library`
  - @Output: addBlock
  - Injeta: BlockRegistryService, CategoryGroup
- **CarometroExemploComponent** `app-carometro-exemplo`
- **CheckmarkDropdownExemploComponent** `app-checkmark-dropdown-exemplo`
- **ComponentesShowcaseComponent** `app-componentes-showcase`
  - Injeta: NotificationService
- **DiarioClasseExemploComponent** `app-diario-classe-exemplo`
- **DocumentBuilderBlocksComponent** `app-document-builder-blocks`
- **DocumentEditorComponent** `app-document-editor`
  - Injeta: BlockRegistryService, ChangeDetectorRef, DocumentEditorStateService, DocumentImportService, Router
- **DocumentsComponent** `app-documents`
  - Injeta: BlockRegistryService, DocumentImportService, DocumentSample, DocumentoModeloSample, MultiDocumentSample, ... +1
- **EditorCanvasComponent** `app-editor-canvas`
  - @Input: blocks: EditorBlock[], config: DocumentConfig, headerData: DocHeaderData, selectedId: string | null... +1
  - @Output: selectBlock, addBlockAt, moveBlock, duplicateBlock, ... +2
  - Injeta: BlockRegistryService, ChangeDetectorRef
- **ExemplosDashboardComponent** `app-exemplos-dashboard`
- **FiltrosComponent** `app-filtros`
  - Injeta: MockFiltroApiService
- **InfoBaseComponent** `app-info-base`
  - Injeta: RouteStateService, Router
- **SidePanelExemploComponent** `app-side-panel-exemplo`
- **TableFilterComponent** `app-table-filter`
  - Injeta: StringUtilsService
- **TelaBaseComponent** `app-tela-base`
  - Injeta: FormBuilder
- **TestDocBodyComponent** `app-test-doc-body`
  - @Input: data: TestDocBodyData

### ficha-individual
- **FichaIndividualComponent** `app-ficha-individual`
  - Injeta: ChangeDetectorRef, DocHeaderData, DocumentLogService, FichaIndividualService

### field-wrapper
- **FilterFieldWrapperComponent** `app-field-wrapper`
  - @Input: filterName: string, defaultValue: string, componentType: Type<any>, control: FormControl... +4
  - Injeta: DynamicInjectorService, FiltroApiService, FiltroStorageService, LogService, NotificationService

### files-field
- **FilesFieldComponent** `app-files-field`
  - @Input: control: FormControl | null, fieldName: string, placeholder: string, multiple: boolean

### filtro
- **FiltroComponent** `filtro`
  - @Input: service: any, config: FilterConfig, loading: boolean, visible: boolean... +4
  - @Output: submit, resetList, changeFilterStatus, fieldUpdateEvent, ... +1
  - Injeta: ChangeDetectorRef, DynamicInjectorService, FiltroFormService, FiltroStorageService, FormBuilder, ... +1

### folha
- **CadastroCargoPagamentoComponent** `app-cadastro-cargo-pagamento`
  - @Output: updateList
  - Injeta: CargosPagamentoService, NotificationService
- **CadastroClasseComponent** `app-cadastro-classe`
  - @Output: updateList
  - Injeta: ClassePagamentoService, FormBuilder, NotificationService
- **CadastroEscolaPagamentoComponent** `app-cadastro-escola-pagamento`
  - @Output: aplicarFiltroSeForMesmaRede
  - Injeta: FormBuilder, GestaoPagamentoService, NotificationService
- **CadastroEventoComponent** `app-cadastro-evento`
  - @Output: updateList
  - Injeta: FormBuilder, NotificationService, TipoEventoPagamentoService
- **CadastroHoraAulaComponent** `app-cadastro-hora-aula`
  - Injeta: CadastroHoraAulaService
- **CadastroSegmentoPagamentoComponent** `app-cadastro-segmento-pagamento`
  - @Output: updateList
  - Injeta: FormBuilder, NotificationService, SegmentoPagamentoService
- **CadastroSegmentoSindicalComponent** `app-cadastro-segmento-sindical`
  - @Output: updateList
  - Injeta: FormBuilder, NotificationService, SegmentoSindicalService
- **CargasIndevidasComponent** `app-cargas-indevidas`
  - @Input: lista: CargasIndevidasResponse[]
- **ConfiguracaoChapaComponent** `app-configuracao-chapa`
  - Injeta: ConfiguracaoChapaService, FileService, RouteStateService, Router, StringUtilsService
- **DisciplinasSemTitularComponent** `app-disciplinas-sem-titular`
  - @Input: lista: TurmaSemTitularResponse[]
- **EdicaoChapaComponent** `app-edicao-chapa`
  - Injeta: ConfiguracaoChapaService, FormBuilder, NotificationService, RouteStateService, Router
- **EditarEscolaPagamentoComponent** `app-editar-escola-pagamento`
  - @Input: escolaParaEditar: EscolaPagamento
  - @Output: atualizarLista
  - Injeta: FormBuilder, GestaoPagamentoService, NotificationService
- **EditarMacroturmasComponent** `app-editar-macroturmas`
  - @Output: submit, notifyFilter
  - Injeta: ClassePagamentoService, FormBuilder, MacroTurmaService, NotificationService, RouteStateService, ... +1
- **EditarTurmaMacroturmasComponent** `app-editar-turma-macroturmas`
  - @Input: turmasDisponiveis: BaseResponse[]
  - @Output: updateList
  - Injeta: NotificationService, TurmaMacroturmaService
- **EnvioPreviaComponent** `app-envio-previa`
  - Injeta: FolhaPreviaService, FormBuilder, NotificationService
- **EnvioTesteComponent** `app-envio-teste`
  - @Output: closeModalEvent
  - Injeta: FolhaPreviaService, NotificationService
- **FolhaPreviaListarComponent** `app-listar-folha-previa`
  - Injeta: FileService, FiltroPreviaCargaService, FolhaPreviaService, NotificationService, RouteStateService, ... +1
- **GestaoTabNavigatorComponent** `app-gestao-tab-navigator`
- **InformacoesEnvioComponent** `app-informacoes-envio`
  - Injeta: NotificationService, RouteStateService, Router
- **ListarCargosPagamentoComponent** `app-listar-cargos-pagamento`
  - Injeta: CargosPagamentoService
- **ListarChecklistComponent** `app-listar-checklist`
  - Injeta: FileService, FiltroChecklistFolhaService, StringUtilsService
- **ListarClassesComponent** `app-listar-classes`
  - Injeta: ClassePagamentoService
- **ListarEscolaPagamentoComponent** `app-lista-escola-pagamento`
  - Injeta: GestaoPagamentoService
- **ListarEventosComponent** `app-listar-eventos`
  - Injeta: TipoEventoPagamentoService
- **ListarMacroturmasComponent** `app-listar-macroturmas`
  - Injeta: MacroTurmaService, RouteStateService, Router
- **ListarSegmentosPagamentoComponent** `app-listar-segmentos-pagamento`
  - Injeta: SegmentoPagamentoService
- **ListarSegmentosSindicalComponent** `app-listar-segmentos-sindical`
  - Injeta: SegmentoSindicalService
- **ListarTurmasMacroturmasComponent** `app-listar-turmas-macroturmas`
  - Injeta: MacroTurmaService, RouteStateService, Router, TurmaMacroturmaService
- **NovoEnvioPreviaComponent** `app-novo-envio-previa`
  - @Output: closeModalEvent
  - Injeta: FolhaPreviaService, FormBuilder, NotificationService, RouteStateService, Router
- **ProfessoresAcimaDoLimiteComponent** `app-professores-acima-do-limite`
  - @Input: lista: ProfessorAcimaDoLimiteResponse[]
- **ProfessoresSemScComponent** `app-professores-sem-sc`
  - @Input: lista: ProfessorSemSCResponse[]
- **TabClasseComponent** `app-tab-classe`
  - @Input: request: CadastroHoraAulaFilterRequest | null, triggerBusca: number
  - Injeta: CadastroHoraAulaService
- **TabSegmentoComponent** `app-tab-segmento`
  - @Input: request: CadastroHoraAulaFilterRequest | null, triggerBusca: number
  - Injeta: CadastroHoraAulaService
- **TestarEnvioComponent** `app-testar-envio`
  - Injeta: FolhaPreviaService, FormBuilder, NotificationService

### grade-horaria
- **ConfiguradorTempoPadraoComponent** `app-configurador-tempo-padrao`
  - Injeta: ConfiguradorTempoPadraoService, FormBuilder, NotificationService

### home
- **HomeComponent** `app-home`

### icon-button
- **IconButtonComponent** `app-icon-button`
  - @Input: icon: string, class: string
  - @Output: clickEvent

### input-pesquisa-header
- **InputPesquisaHeaderComponent** `input-pesquisa-header`
  - Injeta: PortalConfig

### itinerario-formativo
- **EditarItinerarioComponent** `app-editar-itinerario`
  - @Output: submit
  - Injeta: ChangeDetectorRef, DestroyRef, FormBuilder, ItinerarioFormativoService, NotificationService
- **ListarItinerariosComponent** `app-listar-itinerarios`
  - Injeta: ChangeDetectorRef, FilterItinerarioService, ItinerarioFormativoService, NotificationService
- **SelecaoItinerarioComponent** `app-selecao-itinerario`
  - Injeta: FileService, FormBuilder, NotificationService, SelecaoItinerarioService, StringUtilsService

### lancamento-frequencia
- **FrequenciaComponent** `app-frequencia`
  - Injeta: DestroyRef, FiltroFrequenciaService
- **FrequenciaTabNavigatorComponent** `app-frequencia-tab-navigator`
  - Injeta: FiltroFrequenciaService
- **GerarListaDropdownComponent** `app-gerar-lista-dropdown`
  - @Output: gerar
- **JustificativaModalComponent** `app-justificativa-modal`
  - @Output: justificativaAlterada
  - Injeta: LancamentoFrequenciaService
- **JustificativasComponent** `app-justificativas`
  - Injeta: AlunoAusenteItem, BreakpointObserver, DestroyRef, FiltroFrequenciaService, LancamentoFrequenciaService, ... +1
- **LancamentoFrequenciaComponent** `app-lancamento`
  - Injeta: Array, CanvasRenderingContext2D, FiltroFrequenciaService, LancamentoFrequenciaService, ListaFrequenciaStore, ... +1
- **ListaPresencaComponent** `app-lista-presenca`
  - Injeta: CarometroConfigSnapshot, CarometroConfiguracaoService, CarometroDocumentoTurmaData, FiltroFrequenciaService, LancamentoFrequenciaService, ... +1
- **ListarComponent** `app-listar`
  - Injeta: BreakpointObserver, DestroyRef, FiltroFrequenciaService, LancamentoFrequenciaService, NotificationService, ... +1
- **SaidaAntecipadaModalComponent** `app-saida-antecipada-modal`
  - @Output: confirmar, fechar

### liberacao-boletins
- **ConfirmacaoMassaModalComponent** `app-confirmacao-massa-modal`
  - @Input: escolas: EscolaResumo[]
  - @Output: confirmar, cancelar
- **GradeLiberacaoComponent** `app-grade-liberacao`
  - @Input: request: LiberacaoBoletinsFilterRequest | null
  - @Output: alterado
  - Injeta: LiberacaoBoletinsService, NotificationService, Promise, ReturnType, TurmaViewModel, ... +1
- **HistoricoLiberacaoComponent** `app-historico-liberacao`
  - @Input: request: LiberacaoBoletinsFilterRequest | null
  - Injeta: HistoricoEventoResponse, LiberacaoBoletinsService
- **LiberacaoBoletinsListarComponent** `app-liberacao-boletins-listar`
  - Injeta: FiltroLiberacaoBoletinsService, NotificationService

### liberacao-boletins-v0
- **ConfirmacaoMassaModalV0Component** `app-confirmacao-massa-modal-v0`
  - @Output: confirmar, cancelar
- **GradeLiberacaoV0Component** `app-grade-liberacao-v0`
  - @Input: request: LiberacaoBoletinsFilterRequest | null
  - @Output: alterado
  - Injeta: LiberacaoBoletinsV0Service, NotificationService, Promise, ReturnType, TurmaViewModel, ... +1
- **HistoricoLiberacaoV0Component** `app-historico-liberacao-v0`
  - @Input: request: LiberacaoBoletinsFilterRequest | null
  - Injeta: HistoricoEventoResponse, LiberacaoBoletinsV0Service
- **LiberacaoBoletinsListarV0Component** `app-liberacao-boletins-listar-v0`
  - Injeta: FiltroLiberacaoBoletinsV0Service, NotificationService

### listbox-transfer
- **ListboxTransferComponent** `app-listbox-transfer`
  - @Input: rightLabel: string, leftLabel: string, listHeight: number, itemSize: number... +4
  - Injeta: ChangeDetectorRef, StringUtilsService

### loading
- **LoadingComponent** `app-loading`
  - @Input: mensagem: string

### logar-como
- **LogarComoComponent** `logar-como`
  - Injeta: AlertService, ModalService, PortalConfig, UsuarioService

### logo-escola
- **LogoEscolaComponent** `logo-escola`
  - Injeta: PortalConfig, UsuarioService

### matriz-curricular
- **FormularioMatrizComponent** `app-formulario-matriz`
  - @Output: atualizarLista
  - Injeta: FormBuilder, MatrizCurricularService, NotificationService
- **ListarMatrizCurricularComponent** `app-listar-matriz-curricular`
  - Injeta: ChangeDetectorRef, FileService, MatrizCurricularService
- **RemoverDisciplinaMatrizComponent** `app-remover-disciplina-matriz`
  - @Output: loadingChange, removido
  - Injeta: MatrizCurricularFilterRequest, MatrizCurricularService, NotificationService

### menu-lateral
- **MenuLateralComponent** `menu-lateral`
  - Injeta: MenuService, UsuarioService

### mini-select
- **MiniSelectComponent** `app-mini-select`
  - @Input: control: FormControl | null, options: MiniSelectOption[], placeholder: string, prefix: string... +4
  - Injeta: MiniSelectOption, MultiSelectCoordinatorService

### minimize-pages
- **MinimizePagesComponent** `app-minimize-pages`
  - @Output: pageCountChange
  - Injeta: ChangeDetectorRef, PageOptimizerService

### modal
- **ModalComponent** `app-modal`
  - @Input: showModal: boolean, closeButton: boolean, closeButtonInside: boolean, loading: boolean... +4
  - @Output: closeModalEvent
  - Injeta: Document

### money-field
- **MoneyFieldComponent** `app-money-field`
  - @Input: control: FormControl | null, fieldName: string, placeholder: string

### movimentacao-pedagogica
- **AlteracaoCargaComponent** `app-alteracao-carga`
  - Injeta: AlteracaoCargaService, FiltroAlteracaoCargaService, RouteStateService, Router, StringUtilsService
- **AlteracaoCargaDetalhesComponent** `app-alteracao-carga-detalhes`
  - Injeta: AlteracaoCargaService, DateUtilsService, FiltroStorageService, FormBuilder, NotificationService, ... +1
- **AprovacaoEventosComponent** `app-aprovacao-eventos`
  - Injeta: AprovacaoEventosService, FiltroAprovacaoEventosService, LancamentoEventosService, MovimentacaoCentralService, NotificationService, ... +1
- **CargaEditorComponent** `app-carga-editor`
  - @Input: fg: FormGroup, substitutos: BaseResponse[], modoSaida: ModoSaida, dataSaida: string... +2
  - Injeta: CtxAlteracaoCarga, DateUtilsService
- **CentralMovimentacaoPedagogicaComponent** `app-central-movimentacao-pedagogica`
- **HistoricoEventosComponent** `app-historico-eventos`
  - Injeta: FiltroComponent, FiltroHistoricoEventosService, FiltroStorageService, HistoricoEventosFilterRequest, HistoricoEventosGrupoResponse, ... +1
- **HomeComponent** `app-home`
- **InfoLancamentoEventoComponent** `app-info-lancamento-evento`
  - @Input: loading: boolean, lancamento: LancamentoEventosResponse
  - @Output: selecionarLancamento
  - Injeta: StringUtilsService
- **InfoProfessorComponent** `app-info-professor`
  - @Input: loading: boolean, professor: AlteracaoCargaProfessorResponse
- **LancamentoEventosComponent** `app-lancamento-eventos`
  - Injeta: FiltroLancamentoEventosService, LancamentoEventosService, RouteStateService, Router
- **LancamentoEventosDetalhesComponent** `app-lancamento-eventos-detalhes`
  - Injeta: LancamentoEventosService, MovimentacaoCentralService, NotificationService, RouteStateService, Router, ... +1
- **ModalAlteracaoCargaComponent** `app-modal-alteracao-carga`
  - @Input: show: boolean, turmasAfetadas: CargaTurmaResponse[], habilitarMsgInfoItensParciais: boolean
  - @Output: confirmaEvent, closeEvent
- **MovimentacaoTabNavigatorComponent** `app-movimentacao-tab-navigator`
  - Injeta: CentralMovimentacaoTabResponse, MovimentacaoCentralService, Record, Subscription
- **TipoEventoAtrasoViewComponent** `app-tipo-evento-atraso-view`
  - @Input: loading: boolean, frequencia: LancamentoFrequenciaViewModel, disableEvents: boolean, exibeGeraPagamento: boolean
  - @Output: cancelarEvento, cancelarSubstituto, editarEvento
  - Injeta: DateUtilsService, NotificationService, StringUtilsService
- **TipoEventoBaseFormComponent** `app-tipo-evento-base-form`
  - @Input: loading: boolean, frequencia: LancamentoEventoCreateRequest | null, isOnlyEdit: boolean, lancamento: LancamentoEventosResponse... +4
  - @Output: mostrarAdicionarEventoChange, eventoSalvo, eventoEditado, precisaConfirmarPeriodo
  - Injeta: AprovacaoEventosService, DateUtilsService, ElementRef, FormBuilder, LancamentoEventosService, ... +1
- **TipoEventoExtraViewComponent** `app-tipo-evento-extra-view`
  - @Input: loading: boolean, frequencia: LancamentoFrequenciaViewModel, disableEvents: boolean
  - @Output: cancelarEvento, cancelarSubstituto, editarEvento
  - Injeta: DateUtilsService, NotificationService
- **TipoEventoFaltaViewComponent** `app-tipo-evento-falta-view`
  - @Input: loading: boolean, frequencia: LancamentoFrequenciaViewModel, disableEvents: boolean, exibeGeraPagamento: boolean
  - @Output: cancelarEvento, cancelarSubstituto, editarEvento
  - Injeta: DateUtilsService, NotificationService, StringUtilsService
- **TipoEventoOutrosViewComponent** `app-tipo-evento-outros-view`
  - @Input: loading: boolean, frequencia: LancamentoFrequenciaViewModel, disableEvents: boolean
  - @Output: cancelarEvento, editarEvento
  - Injeta: DateUtilsService

### multi-select
- **MultiSelectComponent** `multi-select`
  - @Input: control: FormControl | AbstractControl, options: MultiSelectOption[], fieldName: string, placeholder: string... +4
  - @Output: eventChange
  - Injeta: MultiSelectOption

### multi-select-field
- **MultiSelectFieldComponent** `app-multi-select-field`
  - @Input: control: FormControl | null, fieldName: string, placeholder: string
  - Injeta: MultiSelectCoordinatorService, MultiSelectOption

### navegacao-itens
- **NavegacaoItensComponent** `app-navegacao-itens`
  - @Input: total: signal, indiceAtual: signal, desabilitado: signal, labelAnterior: signal... +4
  - @Output: anterior, proximo, irPara
  - Injeta: ElementRef

### nome-do-modulo
- **NomeDoModuloComponent** `app-nome-do-modulo`

### number-field
- **NumberFieldComponent** `app-number-field`
  - @Input: control: FormControl | null, fieldName: string, min: number, max: number... +1

### ocorrencia
- **CadastroTipoOcorrenciaComponent** `app-cadastro-ocorrencia`
  - @Output: updateList
  - Injeta: FiltroOcorrenciaService, FormBuilder, NotificationService, OcorrenciaService
- **ListarOcorrenciaComponent** `app-listar`
  - Injeta: FileService, FiltroOcorrenciaService, NotificationService, OcorrenciaService

### page-not-found
- **PageNotFoundComponent** `app-page-not-found`
  - Injeta: PortalConfig

### paginacao
- **PaginacaoComponent** `app-paginacao`
  - @Input: wrapper: boolean, loading: boolean, current: number, total: number... +1
  - @Output: goTo
  - Injeta: FiltroSync

### painel-aluno
- **AnamneseTabComponent** `app-anamnese-tab`
- **AtendimentoTabComponent** `app-atendimento-tab`
- **DocumentosTabComponent** `app-documentos-tab`
- **FichaMedicaEdicaoComponent** `app-ficha-medica-edicao`
  - @Input: request: DadosDoAlunoRequest | null, fichaMedica: FichaMedicaResponse | null
  - @Output: fechar, salvo
  - Injeta: PainelAlunoService
- **FichaPainelAlunoComponent** `app-ficha-painel-aluno`
  - Injeta: NotificationService, PainelAlunoService, PainelAlunoStateService, Router
- **ListarPainelAlunoComponent** `app-listar-painel-aluno`
  - Injeta: ChangeDetectorRef, CheckmarkDropdownOption, FiltroStorageService, NotificationService, PainelAlunoService, ... +1
- **OcorrenciasTabComponent** `app-ocorrencias-tab`
- **PedagogicoTabComponent** `app-pedagogico-tab`

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

### print-overlay
- **PrintOverlayComponent** `app-print-overlay`
  - @Input: viewer: DocumentViewerComponent, label: string, rightPanel: TemplateRef<any>, leftPanel: TemplateRef<any>... +1
  - @Output: closeEvent, printEvent, saveEvent

### radio-field
- **RadioFieldComponent** `app-radio-field`
  - @Input: control: FormControl | null, fieldName: string, options: RadioOption[], verticalField: boolean

### relatorio
- **DisciplinasComponent** `app-disciplinas`
  - Injeta: FileService, FiltroDisciplinasPorAlunoService, StringUtilsService

### salvar
- **SalvarComponent** `app-salvar`
  - @Input: loading: boolean, disabled: boolean, labels: string[], mensagemAlerta: string... +2
  - @Output: saveEvent

### search-field
- **SearchFieldComponent** `app-search-field`
  - @Input: loading: boolean, placeholder: string
  - @Output: change, search

### select-field
- **SelectFieldComponent** `single-select`
  - @Input: control: FormControl | AbstractControl, options: SelectOption[], placeholder: string, required: boolean... +4
  - @Output: onChange
  - Injeta: SelectOption
- **SelectFieldComponent** `app-select-field`
  - @Input: control: FormControl | null, options: SelectOption[], fieldName: string, placeholder: string... +2
  - Injeta: MultiSelectCoordinatorService, SelectOption

### sem-conteudo
- **SemConteudoComponent** `app-sem-conteudo`
  - @Input: mensagem: string

### session-expired
- **SessionExpiredComponent** `app-session-expired`
  - Injeta: UsuarioService

### side-panel
- **SidePanelComponent** `app-side-panel`
  - @Input: show: boolean, preventClose: boolean, title: string, topInfo: string... +3
  - @Output: closeEvent, closeAttempt
  - Injeta: Document

### skeleton-box
- **SkeletonBoxComponent** `skeleton-box`

### skeleton-text
- **SkeletonTextComponent** `app-skeleton-text`
  - Injeta: ChangeDetectorRef

### step-card
- **StepCardComponent** `app-step-card`
  - @Input: steps: Record<string, Step<any>>, key: string, etapaAtual: Step<any>, loading: boolean
  - @Output: selectEvent
  - Injeta: Record

### tab-navigator
- **TabNavigatorComponent** `app-tab-navigator`
  - @Input: routes: TabNavigatorItem[], useRouter: boolean, initialActive: string | null
  - @Output: routeEvent, disabledClick
  - Injeta: Router

### tag
- **TagComponent** `app-tag`
  - @Input: variant: signal, size: signal, outline: signal, tinted: signal... +4
  - @Output: remove

### tag-list
- **TagListComponent** `app-tag-list`
  - @Input: variant: signal, items: signal, tinted: signal, limit: signal... +4

### tag-toggle
- **TagToggleComponent** `app-tag-toggle`
  - @Input: control: FormControl | null, label: string, variant: TagToggleVariant, color: TagVariant... +1

### text-field
- **TextFieldComponent** `text-field`
  - @Input: control: FormControl | null, fieldName: string, placeholder: string, maxLength: number... +2

### textarea-field
- **TextareaFieldComponent** `app-textarea-field`
  - @Input: control: FormControl | null, fieldName: string, placeholder: string, maxLengthValue: number... +2

### time-field
- **TimeFieldComponent** `app-time-field`
  - @Input: control: FormControl | null, fieldName: string, min: string, max: string

### titulo-page
- **TituloPageComponent** `app-titulo-page`
  - @Input: title: string, subtitle: string
  - Injeta: Title

### titulo-tela
- **TituloTelaComponent** `app-titulo-tela`
  - @Input: titulo: string
  - @Output: emtVoltar

### toastr-eleva
- **ToastrElevaComponent** `app-toastr-eleva`

### toggle
- **ToggleFieldComponent** `app-toggle`
  - @Input: control: FormControl | null, fieldName: string, toggleInfo: string

### toggle-buttons
- **ToggleButtonsComponent** `app-toggle-buttons`
  - @Input: options: ToggleOption[], selected: string | null
  - @Output: change

### tooltip
- **TooltipComponent** `app-tooltip`

### turno-radio-select
- **TurnoRadioSelectComponent** `app-turno-radio-select`
  - @Input: selecionado: string, loading: boolean, turnos: ResponseModel[]
  - @Output: select

### unauthorized
- **UnauthorizedComponent** `app-unauthorized`
  - Injeta: UsuarioService

### user-validation
- **UserValidationComponent** `app-user-validation`
  - @Output: ExpirationEvent
  - Injeta: AutenticacaoService, UsuarioService

### view-toggle
- **ViewToggleComponent** `app-view-toggle`
  - @Input: options: ViewToggleOption[], value: string
  - @Output: valueChange

## Services

### agrupador-series
- **AgrupadorSeriesService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: listar, incluirAgrupamento, atualizarAgrupamento
- **FiltroAgrupadorSeriesService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, series, agrupamentos, agrupamentosAtivos, sanitize

### alocacao-professores-monitores
- **AlocacaoProfessoresMonitoresService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: listar, detalhe, toggleNaoPossuiAula, getProfissionais, salvarProfessor, salvarMonitor
- **FiltroAlocacaoProfessoresMonitoresService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, agrupamentos, turnos, export

### boletim
- **FiltroService** (root)
  - Injeta: HandleApiError, ProcessamentoBoletimApiClient
  - Métodos: anosLetivos, redes, escolas, agrupamentos
- **ProcessamentoService** (root)
  - Injeta: HandleApiError, ProcessamentoBoletimApiClient
  - Métodos: getProcessamento, enfileirar

### cache-service
- **CachingInterceptor** (none)
  - Injeta: HttpCacheService
  - Métodos: intercept, if, tap
- **HttpCacheService** (root)
  - Métodos: get, set, has, clear

### cadastro-ciclos
- **CadastroCiclosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: sanitize, filterAnoLetivo, filterRede, filterEscopo, filterEtapa, filterEmUso, ... +2

### cadastro-conceitos
- **CadastroConceitosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: filterRedes, emUsoOptions, statusOptions, listar, obterUso, salvar, ... +2

### cadastro-disciplinas-mae
- **CadastroDisciplinasMaeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: detalhe, save, arquivar, desarquivar
- **FiltroCadastroDisciplinasMaeService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: emUso, status, redes, listar, export

### cadastro-etapas
- **CadastroEtapasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: detalhe, save, remover, usos
- **FiltroCadastroEtapasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: sanitize, filterAnoLetivo, filterRede, filterEscopo, filterEmUso, getLista, ... +1

### cadastro-tipos-avaliacao
- **CadastroTiposAvaliacaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: sanitize, filterAnoLetivo, filterRede, filterEmUso, getLista, saveNew, ... +2

### cargas-iniciais
- **CargasIniciaisService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getStatusEscolasInvalidas
- **FilterAlocacaoProfessorService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes
- **ImportacaoAlocacaoProfessoresService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getImportacoes, upload, updateImportacao, getStatusImportacao

### click-outside
- **ClickOutsideService** (root)
  - Métodos: register, unregister

### components
- **PhotoService** (root)
  - Injeta: UsuarioService
  - Métodos: if, getDefaultPhotoUrl, if, if, if, if

### configurador-agrupamentos
- **ConfiguradorAgrupamentosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: listar, detalhe, escolasExcecao, getEscopos, getTiposCalculo, getTiposArredondamento, ... +2
- **FiltroConfiguradorAgrupamentosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, agrupamentos

### configurador-disciplinas
- **ConfiguradorDisciplinasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: filterAnosLetivos, filterRedes, filterAgrupamentos, getSeries, getDisciplinasConfiguradas, getDisciplinasDisponiveis, ... +2

### configurador-frentes
- **ConfiguradorFrentesService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: listar, detalhe, salvarFrente, salvarEmMassa
- **FiltroConfiguradorFrentesService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPermissoesAbas, setPermissoesAbas, anosLetivos, redes, escolas, series, ... +1

### configurador-periodos-letivos
- **ConfiguradorAnoLetivoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: tiposChamada, get, save, export
- **ConfiguradorPeriodosLetivosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPermissoesAbas, setPermissoesAbas, aguardarPermissoesAbas, liberarAposErroPermissoesAbas, abasPermitidas
- **DiaLetivoExtraService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get, save, getFormulario, inativar
- **DiasSemAulaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get, getTipos, filterTurmas, save, delete
- **EtapasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get, save
- **FiltroDiaLetivoExtraService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, formulario, export, sanitize
- **FiltroDiasSemAulaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, series, turnos, tipos, ... +1
- **FiltroEtapasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, series, etapas
- **FiltroPeriodoLetivoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, series

### datepicker
- **DateCalendar** (root)
  - Métodos: config, for, for, buildMonths, for, nextMonth, ... +2

### daterangepicker-field
- **I18n** (none)
  - Injeta: I18n
  - Métodos: getWeekdayShortName, getMonthShortName, getMonthFullName, getWeekdayLabel, getDayAriaLabel

### diario-de-classe
- **DiarioDeClasseService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getDocumento, getConfiguracao, saveConfiguracao
- **DiarioDocumentoStorageService** (root)
  - Métodos: save, getAll, findByRequest, remove, clearExpired
- **FiltroDiarioDeClasseService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPermissoesAbas, setPermissoesAbas, anosLetivos, redesConfiguracao, redes, escolas, ... +2

### dynamic-components
- **DynamicInjectorService** (root)
  - Injeta: Injector
  - Métodos: clearFilterCache

### escolas-gerenciais
- **EscolaGerencialService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, getEscolas, getEscolasGerencial, save, update

### escolas-publicas
- **EscolasPublicasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getEscolas, getSeries, getTurnos, getTurmas, disableTurmas, createTurmas, ... +2
- **FiltroEscolasPublicasService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, series

### exemplos
- **AbasPermissaoExemploService** (root)
  - Métodos: definirPermissaoConfigurada, buscarPermissoesAbas, iniciarCarregamento, setPermissoesAbas, aguardarPermissoesAbas, liberarAposErroPermissoesAbas, ... +1
- **BlockRegistryService** (root)
  - Métodos: get, getAll, getByCategory, getBlockTypeByComponent, if, canImport, ... +1
- **DocumentEditorStateService** (none)
  - Injeta: BlockRegistryService
  - Métodos: setName, addBlock, updateBlockData, updateBlockLabel, removeBlock, moveBlock, ... +2
- **DocumentImportService** (root)
  - Injeta: EditorDocument
  - Métodos: stage, takePending
- **MockFiltroApiService** (root)
  - Métodos: anosLetivos, redes, escolas, series, turmas, disciplinas, ... +2

### ficha-individual
- **FichaIndividualService** (root)
  - Métodos: get, getResumida

### filtro
- **FiltroApiService** (root)
  - Injeta: ApiClient, HandleApiError, NotificationService
  - Métodos: tap, fakeGet, getOptions
- **FiltroFormService** (root)
  - Injeta: Record
  - Métodos: hasForm, save, if, if, if, get, ... +2
- **FiltroStorageService** (root)
  - Métodos: register, if, loadFieldData, clear, hasLoggedUser, getLoggedUser

### folha
- **CadastroHoraAulaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anoLetivos, redes, escolas, segmentos, listarClasse, listarSegmento
- **CargosPagamentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getCargosPagamento, getCargosDisponiveis, save
- **ClassePagamentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, getClassesParaValidacao, getClassesPagamento, saveNovoclassePagamento, getPerfisTipoClasse
- **ConfiguracaoChapaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, meses, redes, professores, getProfessores, getQuantidadePaginas, ... +2
- **FiltroChecklistFolhaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, meses, tiposRede, redes, escolas, getPendencias, ... +1
- **FiltroPreviaCargaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, meses
- **FolhaPreviaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getRedes, getQuantidadePublico, enviar, getTextoPrevia, getCelularTeste, testarEnvio, ... +2
- **GestaoPagamentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, verificarNomeEscola, getEscolasDePagamento, getEscolas, getEscolasGerenciais, ... +2
- **MacroTurmaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: tipoEventosFilter, segmentosFilter, segmentosSindicalFilter, anoLetivos, redes, tipoEventos, ... +2
- **SegmentoPagamentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, getSegmentosParaValidacao, getSegmentosPagamento, saveNovoSegmentoPagamento
- **SegmentoSindicalService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, getSegmentosSindical, saveNovoSegmentoSindical, getSegmentosParaValidacao
- **TipoEventoPagamentoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: redes, getTipoEvento, getTiposDePagamento, save
- **TurmaMacroturmaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getTurmasParaMacroTurma, saveTurmaMacroTurma

### grade-horaria
- **ConfiguradorTempoPadraoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, series, turnos, get, ... +1

### interceptor
- **HttpRequestInterceptor** (none)
  - Injeta: ProgressService, UsuarioService
  - Métodos: intercept, if

### itinerario-formativo
- **FilterItinerarioService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, agrupamentos, ciclos
- **ItinerarioFormativoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getItinerarios, getDisciplinas, getCiclo, getTipos, getPeriodos, save, ... +1
- **SelecaoItinerarioService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, agrupamentos, turmas, periodos, ... +2

### lancamento-frequencia
- **CarometroConfiguracaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get, save, restaurarPadrao
- **FiltroFrequenciaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: setPossuiVisaoCoordenacao, getPermissoesAbas, setPermissoesAbas, aguardarPermissoesAbas, liberarAposErroPermissoesAbas, redes, ... +2
- **LancamentoFrequenciaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getEventos, getChamada, saveChamada, getJustificativa, createJustificativa, disableJustificativa, ... +2

### liberacao-boletins
- **FiltroLiberacaoBoletinsService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, agrupamentos, escolas, sanitize
- **LiberacaoBoletinsService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getGrade, saveBloqueios, saveBloqueiosFiltro, getHistorico

### liberacao-boletins-v0
- **FiltroLiberacaoBoletinsV0Service** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, agrupamentos, escolas, sanitize
- **LiberacaoBoletinsV0Service** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getGrade, saveBloqueios, saveBloqueiosFiltro, getHistorico

### matriz-curricular
- **MatrizCurricularService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: filterAnosLetivos, filterRedes, filterSegmentos, getSeries, filterEscolas, getDisciplinasConfiguradas, ... +2

### menu
- **MenuFacadeService** (root)
  - Injeta: MenuService, UsuarioService
  - Métodos: for, if, for, navigate

### movimentacao-pedagogica
- **AlteracaoCargaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get, getProfessoresSubstitutos, getMotivosSaida, getProfessorCarga, update
- **AprovacaoEventosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getFila, aprovar, reprovar, getSubstitutos
- **FiltroAlteracaoCargaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, periodos, series, professores
- **FiltroAprovacaoEventosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, periodos, series, perfis
- **FiltroHistoricoEventosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, meses, redes, escolas, tiposEvento, series
- **FiltroLancamentoEventosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, periodos, series, perfis
- **HistoricoEventosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getHistorico
- **IsAllowedAprovacaoEventosGuard** (root)
  - Injeta: MovimentacaoCentralService, Router
  - Métodos: canActivate
- **LancamentoEventosService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: get, getDetail, getDetailAprovador, getTiposEvento, getTiposEventoAprovador, getTiposSegmento, ... +2
- **MovimentacaoCentralService** (root)
  - Injeta: ApiClient, CentralMovimentacaoTabResponse, HandleApiError
  - Métodos: setAprovacaoCount, notifyTabsChange, if, getTabs, if, if, ... +2

### multi-select
- **MultiSelectCoordinatorService** (root)
  - Métodos: register, open, if

### ocorrencia
- **FiltroOcorrenciaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, series, getOcorrencias, export
- **OcorrenciaService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: save, saveStatus

### painel-aluno
- **PainelAlunoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: filterAno, filterRede, filterEscola, filterSerie, filterTurma, getAlunos, ... +2
- **PainelAlunoStateService** (root)
  - Injeta: PainelAlunoResponse
  - Métodos: setLista, getLista, limparLista, setSearch, getSearch, getItem, ... +2

### regional
- **RegionalService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPaises, getEstados, getMunicipios

### relatorio
- **FiltroDisciplinasPorAlunoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: anosLetivos, redes, escolas, segmentos, series, turmas, ... +2

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
- **IsMaintenance** (root)
  - Injeta: Router
  - Métodos: canActivate, if, if
- **IsMobileGuard** (root)
  - Injeta: Router
  - Métodos: canActivate, if

### route-state
- **RouteStateService** (root)
  - Injeta: Record
  - Métodos: if, set, if, isExpired, has, if, ... +1

### services
- **AlertService** (root)
  - Métodos: showSuccess, showAlert, showError, setAlertComponent, if
- **ApiClient** (root)
  - Injeta: HttpClient
  - Métodos: get, getBlob, post, put, getFilterBlob, delete
- **AutenticacaoService** (root)
  - Injeta: ApiClient, HandleApiError
  - Métodos: getPerfil, possuiAcesso
- **CookieService** (root)
  - Injeta: Document
  - Métodos: addToDOM
- **DateUtilsService** (root)
  - Injeta: DatePipe
  - Métodos: formatDateTime, formatDate, dateFromIso, toISOString, dateWithTime, addDays, ... +2
- **DocumentLogService** (root)
  - Injeta: DocLogEvent
  - Métodos: enable, disable, clear, logLayoutStart, logWideTableMeasure, logLayoutPlace, ... +2
- **EventTagService** (root)
  - Métodos: click, if
- **FileService** (root)
  - Injeta: ApiClient
  - Métodos: downloadFile, downloadSheet
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
  - Injeta: NotificationService, Router
  - Métodos: if, if, if, for, if, if, ... +2
- **HelpHeroService** (root)
  - Injeta: ReturnType
  - Métodos: initHelpHero, if
- **LayoutEngineService** (root)
  - Injeta: DocumentLogService
  - Métodos: distribute, for, if, if, if, if, ... +2
- **LogService** (root)
  - Injeta: LogLevel
  - Métodos: log, if, if, debug, info, warn, ... +1
- **MeasurementService** (root)
  - Métodos: measure, for
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
- **PageOptimizerService** (root)
  - Métodos: buildSteps, while, while, while, while, while, ... +2
- **PdfApiService** (root)
  - Métodos: gerar, gerarZip
- **PrintService** (root)
  - Métodos: if, if, for, if, if, for
- **ProcessamentoBoletimApiClient** (root)
- **ProgressService** (root)
  - Injeta: PortalHeaderProgressComponent
  - Métodos: complete, if, for, show, if, for, ... +1
- **SelectService** (root)
- **StateGuardService** (none)
  - Métodos: guardState
- **StringUtilsService** (root)
  - Métodos: normalize, isNumeric, onlyNumbers, formatCNPJ, formatFormCNPJ, if, ... +2
- **User** (root)
  - Injeta: ApiClient
  - Métodos: getUserName
- **UsuarioService** (root)
  - Injeta: HttpClient, PortalConfig, Router
  - Métodos: logoff, logoffElevaId, logarComo, alternarPerfisDeAcessoDoUsuario, irParaLogin, logout, ... +2

## Models

- **AbaConfiguradorPeriodosLetivos** (interface): segmento: string, path: string
- **AcessoUsuarioModel** (interface): IdPerfilDeAcessoDoUsuario: number | null, IdPessoaEscolaAcesso: number | null, IdSegmento: number | null, Nome: string, EscolaHash: string | null, ... +3
- **AgrupadorSeriesFilterRequest** (interface): hashAnoLetivo: string | null, hashRede: string[], hashSerie: string[], hashAgrupamento: string[]
- **AgrupadorSeriesListagemResponse** (interface): hash: string, rede: string, serie: string, hashAgrupamento: string, agrupamento: string, ... +2
- **AlocacaoProfessorProcessamentos** (interface): hash: string, dataEnvio: string, usuario: string, qtTurmasProfessoresDisciplinas: number, status: StatusEtapa
- **AlocacaoProfessorStatusRequest** (interface): hash: string, etapaParaAtualizar: number
- **AlocacaoProfessorUploadRequest** (interface): hashAnoLetivo: string, hashRede: string, file: File, fileName: string
- **AlocacaoProfessoresMonitoresFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string[], hashAgrupamento: string[], hashTurno: string[], ... +1
- **AlocacaoProfessoresMonitoresFrenteResponse** (interface): hash: string, descricao: string, naoPossuiAula: boolean, usuarioNaoPossuiAulaNome: string | null, dataNaoPossuiAula: string | null, ... +2
- **AlocacaoProfessoresMonitoresFrenteViewModel** (interface): savingState: SavingState, savingStateProfessor: SavingState, savingStateMonitor: SavingState, editandoProfessor: boolean, editandoAddMonitor: boolean, ... +1
- **AlocacaoProfessoresMonitoresTurmaResponse** (interface): turmaHash: string, turmaNome: string, escolaNome: string, totalFrentes: number, professoresAlocados: number, ... +1
- **AlocacaoProfissionalResponse** (interface): hash: string, descricao: string, cpf: string, perfilAtivo: boolean | null, usuarioRegistroNome: string, ... +1
- **AlteracaoCargaFormValue** (interface): motivoAlteracaoCarga: string, ehSaidaTemporaria: boolean, ehRetornoDeSaidaTemporaria: boolean, dataEntrada: string, dataNovoProfessor: string, ... +3
- **AlteracaoCargaProfessorResponse** (interface): hash: string, nome: string, cpf: string, hashRede: string, nomeRede: string, ... +3
- **AlteracaoCargaRouteData** (interface): filter: MovimentacaoPedagogicaFilterRequest, tagData: FieldTagOptions[], professor: AlteracaoCargaProfessorResponse, substitutos: BaseResponse[], motivos: MotivoSaidaResponse[]
- **AlunoAusenteItem** (interface): hashPessoa: string, nomePessoa: string, matricula: string, hashTurma: string, nomeTurma: string, ... +2
- **AlunoComponentResponse** (interface): obrigatorio: boolean, hashItinerario: string, hashPeriodo: string, descricao: string
- **AlunoSelecaoItinerarioResponse** (interface): hashAluno: string, nome: string, ra: string, turma: string, hashTurma: string, ... +3
- **AlunosAusentesResponse** (interface): turmas: TurmaAusentesResponse[], totalAlunos: number
- **AprovacaoEventoRequest** (interface): hashFrequenciaProfessor: string, novoStatus: number, justificativaRecusa: string
- **AprovacaoEventosFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string, hashPeriodo: string, hashSerie: string, ... +1
- **ArquivarRestaurarGrupoRequest** (interface): hash: string, hashRede: string
- **ArquivoModel** (interface): NomeGuia: string | null, LinkArquivo: string | null
- **AtualizarAgrupamentoRequest** (interface): hashesRedeSerie: string[], hashAgrupamento: string
- **BaseItemResponse** (interface): hash: string, descricao: string
- **BaseResponse** (interface)
- **BlockDef** (interface): type: BlockType, label: string, icon: string, componentType: Type<unknown>, defaultData: unknown
- **BloqueioAlteradoResponse** (interface): hashTurma: string, hashEstruturaAvaliacao: string, bloqueada: boolean, dataAcao: string
- **BloqueioItemRequest** (interface): hashTurma: string, hashEstruturaAvaliacao: string
- **CabecalhoDocumentoResponse** (interface): nomeRede: string | null, nomeEscola: string | null, logoUrl: string | null, brasaoUrl: string | null, endereco: string | null, ... +3
- **CadastroCiclosDisableRequest** (interface): hash: string
- **CadastroCiclosEtapaPorEscopoRequest** (interface): hashAnoLetivo: string, hashRede: string
- **CadastroCiclosFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscopo: string[], hashEtapa: string[], emUso: boolean
- **CadastroCiclosResponse** (interface): hash: string, escopo: string, etapa: string, sigla: string, nome: string, ... +3
- **CadastroCiclosSaveRequest** (interface): hash: string, hashEtapa: string, nome: string, sigla: string, possuiResultadoParcial: boolean
- **CadastroCiclosUsoResponse** (interface): nomeAgrupamento: string, nomeEscopo: string
- **CadastroConceitosFilterRequest** (interface): hashRede: string, emUso: boolean | null, arquivado: boolean | null
- **CadastroDisciplinasMaeArchivarRequest** (interface): hashDisciplina: string, hashRede: string
- **CadastroDisciplinasMaeDetalheResponse** (interface): hash: string, nome: string, ehLinguaEstrangeira: boolean, ehDiaLab: boolean, arquivada: boolean, ... +1
- **CadastroDisciplinasMaeFilterRequest** (interface): hashRede: string | null, emUso: boolean | null, arquivada: boolean | null
- **CadastroDisciplinasMaeFrenteDetalheItem** (interface): hash: string, nome: string, arquivada: boolean
- **CadastroDisciplinasMaeFrenteResponse** (interface): hash: string, nome: string, arquivada: boolean
- **CadastroDisciplinasMaeFrenteSaveItem** (interface): hash: string, nome: string, arquivada: boolean
- **CadastroDisciplinasMaeListagemResponse** (interface): hash: string, nome: string, frentes: CadastroDisciplinasMaeFrenteResponse[], ehLinguaEstrangeira: boolean, ehDiaLab: boolean, ... +2
- **CadastroDisciplinasMaeSaveRequest** (interface): hashDisciplina: string, hashRede: string, nome: string, ehLinguaEstrangeira: boolean, ehDiaLab: boolean, ... +1
- **CadastroEScolasPublicasTurmaResponse** (interface): hash: string, nomeTurma: string, nomeTurno: string, hashTurno: string, novoCadastro: boolean
- **CadastroEscolasPublicasDisableRequest** (interface): hashEscolaSerie: string, hashTurno: string
- **CadastroEscolasPublicasFilterRequest** (interface): hashRede: string, hashEscola: string[], hashAnoLetivo: string, hashSerie: string[], pagina: number, ... +3
- **CadastroEscolasPublicasRequest** (interface): hashAnoLetivo: string, hashEscola: string, nomeEscola: string, codigoInep: string, manterSequencia: boolean, ... +1
- **CadastroEscolasPublicasSerieResponse** (interface)
- **CadastroEscolasPublicasTurmaRequest** (interface): hashEscola: string, hashSerie: string, hashTurno: string, quantidadeTurmas: number, siglaUrania: string
- **CadastroEscolasPublicasUpdateRequest** (interface): hashEscola: string, nomeEscola: string, codigoInep: string
- **CadastroEscolasPublicasUpdateTurmasRequest** (interface)
- **CadastroEtapasDetalheResponse** (interface): hash: string, hashEscopo: string, escopoNome: string, sigla: string, nome: string, ... +2
- **CadastroEtapasFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscopo: string[], emUso: boolean
- **CadastroEtapasListagemResponse** (interface): hash: string, escopoNome: string, sigla: string, nome: string, ordem: number, ... +2
- **CadastroEtapasSaveRequest** (interface): hashEtapa: string, hashAnoLetivo: string, hashRede: string, hashEscopo: string, sigla: string, ... +2
- **CadastroEtapasUsoItem** (interface): agrupamentoNome: string, escopoNome: string
- **CadastroEtapasUsosResponse** (interface): usos: CadastroEtapasUsoItem[]
- **CadastroHoraAulaFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashsEscolasPagamento: string[], hashsSegmentosPagamento: string[]
- **CadastroOcorrenciasGetResponse** (interface): hash: string, hashRede: string, hashAnoLetivo: string, nomeRede: string, series: BaseResponse[], ... +3
- **CadastroTiposAvaliacaoDisableRequest** (interface): hash: string
- **CadastroTiposAvaliacaoFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, emUso: boolean
- **CadastroTiposAvaliacaoResponse** (interface): hash: string, sigla: string, nome: string, opcional: boolean, emUso: boolean, ... +2
- **CadastroTiposAvaliacaoSaveRequest** (interface): hash: string, hashAnoLetivo: string, hashRede: string, nome: string, sigla: string, ... +3
- **CadastroTiposAvaliacaoUsoResponse** (interface): nomeAgrupamento: string, nomeEscopo: string
- **CadastroTurmaForm** (interface)
- **CalendarConfig** (interface)
- **CalendarStruct** (interface)
- **CargaEscolaResponse** (interface): hashEscola: string, nome: string, tempos: ProfessorTotalTempos, dataEntrada: string, professoresSubstitutos: ProfessorSubstitutoResponse[], ... +3
- **CargaParaUpdate** (interface): HashCarga: string, HashProfessorSubstituto: string, DataEntrada: Date
- **CargaTurmaResponse** (interface): hashCarga: string, hashTurma: string, hashEscola: string, turma: string, escola: string, ... +3
- **CargasIndevidasResponse** (interface): rede: string, professor: string, cpf: string, situacao: string, qtdTemposRegulares: string
- **CargoPagamentoRequest** (interface): hash: string, cargos: BaseResponse[]
- **CargosPagamentoFilterRequest** (interface): hashRede: string[], pagina: number
- **CargosPagamentoResponse** (interface): hash: string, nome: string, cargos: BaseResponse[]
- **CarometroAlunoData** (interface): hashPessoa: string, nomePessoa: string, matricula: string, fotoUrl: string | null, responsavelNome: string | null, ... +2
- **CarometroDocumentoTurmaData** (interface): turma: ListaPresencaTurmaResponse, alunos: CarometroAlunoData[], cabecalho: CabecalhoDocumentoResponse | null
- **CarometroVariantInfo** (interface): tag: CarometroCardVariant, label: string
- **CarometroVisibility** (interface): nome: boolean, ra: boolean, responsavel: boolean, telefone: boolean, email: boolean
- **CellPaddingConfigurable** (interface)
- **CelulaGradeResponse** (interface): hashEstruturaAvaliacao: string, bloqueada: boolean, dataUltimaAcao: string | null, usuarioUltimaAcao: string | null, ultimaAcaoFoiBloqueio: boolean | null
- **ChamadaResponse** (interface): hashPessoa: string, nomePessoa: string, matricula: string, hashTipoFrequencia: string, confirmada: boolean, ... +3
- **ChapaFilterRequest** (interface): hashAnoLetivo: string, mes: number, hashRede: string[], hashPessoa: string, apenasPendente: boolean, ... +2
- **ChapaResponse** (interface): hash: string, hashChapa: string, numeroChapa: string, hashEscolaGerencial: string | null, hashTipo: string | null, ... +3
- **ChapasOutrosCargosResponse** (interface): numeroChapa: string, cargo: string
- **ChecklistFolhaFilterRequest** (interface): hashAnoLetivo: string, mes: number, hashTipoRede: string, hashRedes: string[], hashEscolas: string[], ... +1
- **ClassePagamentoFilterRequest** (interface): hashRede: string[], pagina: number
- **ClassePagamentoResponse** (interface): hash: string, hashRede: string, nomeRede: string, nomeClasse: string, padraoRedePagamento: boolean, ... +3
- **ClassePagamentoSaveRequest** (interface): hash: string, hashRede: string, nomeClasse: string, padraoRedePagamento: boolean, hashPerfilAcesso: string, ... +1
- **ClassesDePagamentoPorRedeResponse** (interface): hash: string, nome: string, hashRede: string
- **ColumnConfig** (interface): header: string, avatar: boolean, highlight: boolean, key: string, multValues: boolean, ... +3
- **ColumnMultValues** (interface): key: string, highlight: boolean
- **ColumnSplittable** (interface)
- **ConceitoSaveRequest** (interface): hash: string | null, descricao: string, detalhamento: string, ordem: number
- **ConfiguradorAgrupamentosAprovacaoResponse** (interface): hash: string, ehPrimeiraRecuperacao: boolean, ehSegundaRecuperacao: boolean, naoPossuiLimiteDeDisciplinas: boolean, maximoDeDisciplinas: number, ... +3
- **ConfiguradorAgrupamentosAprovacaoSaveItem** (interface): naoPossuiLimiteDeDisciplinas: boolean, maximoDeDisciplinas: number, minimoParaAprovacao: number, fazMediaComTotalCorrespondente: boolean, pesoRecuperacao: number, ... +3
- **ConfiguradorAgrupamentosCicloNomenclaturaResponse** (interface): hashCiclo: string, nomeCiclo: string, sigla: string
- **ConfiguradorAgrupamentosCicloSaveItem** (interface): hashCiclo: string, sigla: string
- **ConfiguradorAgrupamentosDetalheResponse** (interface): hashConfiguracao: string, possuiAvaliacoes: boolean, hashTipoCalculo: string, hashTipoArredondamento: string, hashGrupoNotaFormativa: string, ... +3
- **ConfiguradorAgrupamentosEscolaAprovacaoSaveItem** (interface): hashEscola: string, minimoParaAprovacao: number
- **ConfiguradorAgrupamentosEscopoNomenclaturaResponse** (interface): hashEscopo: string, nomeEscopo: string, textoCabecalho: string
- **ConfiguradorAgrupamentosEscopoSaveItem** (interface): hashEscopo: string, textoCabecalho: string
- **ConfiguradorAgrupamentosFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashAgrupamento: string[]
- **ConfiguradorAgrupamentosGetResponse** (interface): hashAgrupamento: string, nomeAgrupamento: string, possuiAvaliacoes: boolean, possuiComponenteFormativo: boolean, possuiItinerarioFormativoSeparadoNoBoletim: boolean, ... +3
- **ConfiguradorAgrupamentosSaveRequest** (interface): hashRede: string, hashAnoLetivo: string, hashAgrupamento: string, possuiAvaliacoes: boolean, possuiItinerarioFormativoSeparadoNoBoletim: boolean, ... +3
- **ConfiguradorAnoLetivoFilterRequest** (interface): hashRede: string, hashEscola: string[], hashAnoLetivo: string, hashSerie: string[], apenasPendentes: boolean
- **ConfiguradorAnoLetivoGetResponse** (interface): hashEscolaSerie: string, nomeEscola: string, nomeSerie: string, dataInicioAno: Date, dataFimAno: Date, ... +3
- **ConfiguradorDisciplinaSerieResponse** (interface): parteDaMatrizCurricular: boolean
- **ConfiguradorDisciplinasDisableRequest** (interface): hashDisciplina: string, hashAnoLetivo: string, hashRede: string, hashAgrupamento: string
- **ConfiguradorDisciplinasFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashAgrupamento: string
- **ConfiguradorDisciplinasGetResponse** (interface): hashDisciplina: string, nomeDisciplina: string, nomeExibicao: string, permiteClassroom: boolean, possuiAprovacaoAutomatica: boolean, ... +3
- **ConfiguradorDisciplinasSaveRequest** (interface): hashAnoLetivo: string, hashRede: string, hashAgrupamento: string, hashDisciplina: string, hashesRedeSerie: string[], ... +3
- **ConfiguradorEscolaEtapaFilterRequest** (interface): hashRede: string, hashEscola: string[], hashAnoLetivo: string, hashSerie: string[], apenasPendentes: boolean
- **ConfiguradorEscolaEtapaGetResponse** (interface)
- **ConfiguradorEscolaEtapaSaveRequest** (interface): hashEtapa: string, hashEscolaSerie: string
- **ConfiguradorFrentesDisciplinaResponse** (interface): disciplinaHash: string, disciplinaNome: string, frentes: ConfiguradorFrentesFrenteResponse[]
- **ConfiguradorFrentesFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string[], hashSerie: string[], apenasPendentes: boolean
- **ConfiguradorFrentesFrenteResponse** (interface): hash: string, descricao: string, ativa: boolean
- **ConfiguradorFrentesItemResponse** (interface): escolaSerieHash: string, hashRede: string, escolaNome: string, serieNome: string, totalDisciplinas: number, ... +2
- **ConfiguradorProfessorChapaEscolaRequest** (interface): hashAnoLetivo: string, mes: number, hashRede: string, hashPessoa: string
- **ConfiguradorTempoPadraoFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string[], hashSerie: string[], hashTurno: string, ... +1
- **ConfiguradorTempoPadraoGetResponse** (interface): hashEscolaSerie: string, hashTurno: string, nomeRede: string, nomeEscola: string, nomeSerie: string, ... +3
- **ConfiguradorTempoPadraoSaveRequest** (interface): hashEscolaSerie: string[], hashTurno: string, quantidadeTempos: number, duracaoTempoEmMinutos: string, horaInicioAula: string, ... +3
- **ConsultaProcessamentoBoletimRequest** (interface): HashAnoLetivo: string, HashRede: string[], HashEscola: string[], HashAgrupamento: string[], hashProcessamentoBoletim: string[]
- **ConsultaProcessamentoBoletimResponse** (interface): hash: string, nomeRede: string, nomeEscola: string, nomeAgrupamento: string, nomeSerie: string, ... +3
- **CtxAlteracaoCarga** (interface): modo: ModoSaida, temDataSaida: boolean, temMotivo: boolean, ehProfessorVago: boolean, podeSelecionarSubstituto: boolean, ... +1
- **DadosDoAlunoRequest** (interface): hashAlunoEscola: string, hashAnoLetivo: string, hashEscola: string, nomeSocial: string
- **DataTableConfig** (interface): customButtomLabel: boolean, buttonColumnLabel: string, columns: ColumnConfig[], textLimit: number, buttonLabel: string, ... +3
- **DataTableFilter** (interface): text: string, pending: boolean
- **DateSelect** (interface)
- **DayCustomColor** (interface)
- **DayStruct** (interface): day_label: string
- **DetalhesAlunoResponse** (interface): nomeSocial: string, nomeNascimento: string, dataNascimento: string | null, idade: number | null, email: string, ... +3
- **DiaAulaInfo** (interface)
- **DiaLetivoExtraEditFormularioResponse** (interface): hash: string, titulo: string, descricao: string
- **DiaLetivoExtraGetResponse** (interface): hash: string, hashEscola: string, data: string, titulo: string, nomeEscola: string, ... +1
- **DiaLetivoExtraSaveRequest** (interface): hash: string | null, hashAnoLetivo: string, hashEscola: string, data: string, titulo: string, ... +2
- **DiaLetivoExtraTurmaFrenteRequest** (interface): hashTurma: string, hashDisciplinas: string[]
- **DiaLetivoExtraTurmaResponse** (interface): hash: string, nome: string, nomeSerie: string, nomeTurno: string
- **DiaSemAulaTipoResponse** (interface): hash: string, descricao: string, feriadoNacional: boolean, feriadoRegional: boolean
- **DiarioDeClasseAlunoResponse** (interface): nomeAluno: string, matricula: string, chamadas: string[]
- **DiarioDeClasseAulaResponse** (interface): hash: string, dataAula: string
- **DiarioDeClasseCaracterResponse** (interface): caracterParaIndicarPresenca: string, caracterParaIndicarFalta: string, caracterParaIndicarPendencia: string, caracterParaIndicarTransferencia: string, caracterParaIndicarNEE: string, ... +3
- **DiarioDeClasseConfiguracaoResponse** (interface): hash: string, hashRede: string, nomeRede: string, caracterParaIndicarPresenca: string, caracterParaIndicarFalta: string, ... +3
- **DiarioDeClasseConfiguracaoSaveRequest** (interface): hashRede: string, caracterParaIndicarPresenca: string, caracterParaIndicarFalta: string, caracterParaIndicarPendencia: string, caracterParaIndicarTransferencia: string, ... +3
- **DiarioDeClasseConteudoResponse** (interface): dataAula: string, conteudo: string, atividades: string | null
- **DiarioDeClasseDocumentoRequest** (interface): hashAnoLetivo: string | null, hashRede: string | null, hashEscola: string | null, hashSerie: string | null, hashTurma: string | null, ... +3
- **DiarioDeClasseDocumentoResponse** (interface): cabecalho: CabecalhoDocumentoResponse | null, nomeProfessor: string | null, disciplina: string, turma: string, nomeEtapa: string | null, ... +3
- **DiarioDeClasseRendimentoAlunoResponse** (interface): hashPessoa: string, nomeAluno: string, matricula: string, visivelNoBoletim: boolean, notas: DiarioDeClasseRendimentoNotaResponse[]
- **DiarioDeClasseRendimentoColunaResponse** (interface): hashEstruturaAvaliacao: string, hashEtapa: string, nomeEtapa: string, nome: string, notaMaxima: number | null, ... +3
- **DiarioDeClasseRendimentoNotaResponse** (interface): hashEstruturaAvaliacao: string, hashEtapa: string, notaFormativa: string | null, notaComPeso: number | null, faltas: number | null, ... +1
- **DiarioDeClasseRendimentoResponse** (interface): colunas: DiarioDeClasseRendimentoColunaResponse[], alunos: DiarioDeClasseRendimentoAlunoResponse[]
- **DiasSemAulaGetResponse** (interface): hash: string, hashTipo: string, tipo: string, descricao: string, dataInicio: string, ... +1
- **DiasSemAulaSaveRequest** (interface): hash: string | null, hashAnoLetivo: string, hashEscola: string | null, hashTipo: string, descricao: string, ... +3
- **DisabledDay** (interface)
- **DisciplinasPorAlunoFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscolas: string[], hashSegmentos: string[], hashSeries: string[], ... +3
- **DocumentDefinition** (interface): config: DocumentConfig, headerData: DocHeaderData, entries: DocumentEntry[]
- **DocumentoCarometroConfiguracaoResponse** (interface): hash: string, quantidadeColunas: number, espacamento: number, alturaCard: number | null, formatoCard: number, ... +3
- **DocumentoCarometroConfiguracaoSaveRequest** (interface): quantidadeColunas: number, espacamento: number, alturaCard: number | null, formatoCard: number, exibirNomeAluno: boolean, ... +3
- **DocumentoModelo** (interface): label: string, description: string, fileName: string, config: DocumentConfig, headerData: typeof MOCK_ESCOLA_HEADER, ... +1
- **EditorBlock** (interface): id: string, type: BlockType, label: string, data: unknown
- **EditorDocument** (interface): name: string, config: DocumentConfig, headerData: DocHeaderData, blocks: EditorBlock[]
- **ElevaIdModel** (interface)
- **EnvioPreviaCargaFilterRequest** (interface): hashAnoLetivo: string, mes: number, hashStatus: string, hashRedes: string[], pagina: number
- **EnvioPreviaRelatorioRequest** (interface): hashEnvios: string[]
- **EscolaChapaResponse** (interface): quantidadeTempos: number
- **EscolaGerencialFilterRequest** (interface): hashAnoLetivo: string, hashRede: string[], pagina: number
- **EscolaGerencialResponse** (interface)
- **EscolaGerencialSaveRequest** (interface): hashRede: string, nomeEscolaGerencial: string, hashsEscolas: string[]
- **EscolaGerencialUpdateRequest** (interface): hashEscolaGerencial: string, nomeEscolaGerencial: string, hashsEscolas: string[]
- **EscolaPagamentoFilterRequest** (interface): hashAnoLetivo: string, hashRede: string[], pagina: number
- **EscolaPagamentoSaveRequest** (interface): HashRedePagamento: string, NomeEscolaPagamento: string, HashsEscolas: string[]
- **EscolaPagamentoUpdateRequest** (interface): hashEscolaPagamento: string, nomeEscolaPagamento: string, hashsEscolas: string[], hashEscolaGerencial: string | null
- **EscolasPublicasGetResponse** (interface)
- **EscopoOption** (interface): hash: string, descricao: string, ehBoletim: boolean, ehDiversificado: boolean, ehSimulado: boolean, ... +1
- **EscopoResponse** (interface): cabecalhoPadrao: string, ehBoletim: boolean, ehSimulado: boolean, ehDiversificado: boolean, ehItinerarioFormativo: boolean
- **EstadoResponse** (interface): hashEstado: string, siglaEstado: string, nomeEstado: string
- **EstruturaColunaResponse** (interface): hash: string, sigla: string, nomeTipoAvaliacao: string, ordem: number
- **EtapaGradeResponse** (interface): hashEtapa: string, nomeEtapa: string, estruturas: EstruturaColunaResponse[]
- **EtapaPorEscopoResponse** (interface): hash: string, descricao: string, hashEscopo: string
- **EventoAprovacaoPendenteDTO** (interface): hashFrequenciaProfessor: string, nomeTipoPresenca: string, nomeMotivoFrequenciaProfessor: string, solicitante: string, dataEvento: string, ... +3
- **FichaIndividualAlunoContexto** (interface)
- **FichaIndividualAreaDoConhecimento** (interface)
- **FichaIndividualColunaGetResponse** (interface)
- **FichaIndividualConfiguracaoEscola** (interface)
- **FichaIndividualConfiguracaoRede** (interface)
- **FichaIndividualDisciplinaGetResponse** (interface)
- **FichaIndividualEscopoGetResponse** (interface)
- **FichaIndividualEtapaGetResponse** (interface)
- **FichaIndividualGetRequest** (interface)
- **FichaIndividualGetResponse** (interface)
- **FichaIndividualLegendaGetResponse** (interface)
- **FichaIndividualNotaResponse** (interface)
- **FichaMedicaResponse** (interface): tipoSanguineo: string | null, possuiNecessidadeEspecial: boolean | null, detalheNecessidadeEspecial: string, possuiDoencaRespiratoria: boolean | null, detalheDoencaRespiratoria: string, ... +3
- **FieldTagOptions** (interface): label: string, icon: string, selectDescription: string[], selectString: string
- **FilaAprovacaoEventosResponse** (interface): hashPessoaEscolaAcesso: string, nomeProfessor: string, cpf: string, exibeCpf: boolean, nomeEscola: string, ... +3
- **FilterConfig** (interface): id: string, id_toggle: string, id_save: string, id_clear: string, defaultValue: string, ... +3
- **FilterData** (interface): hash: string, descricao: string
- **FilterEtapasResponseData** (interface): data: ResponseModel[], error: any[], isSuccess: boolean, message: string
- **FilterField** (interface): control: FormControl, options: any[]
- **FilterItemConfig** (interface): url: string, value: any, autostart: boolean, selectFirst: boolean, autoSelectWhenSingle: boolean, ... +3
- **FilterResponseData** (interface): data: ResponseModel[], error: any[], message: string
- **FolhaLimitesResponse** (interface): minutosAtrasoMinimo: number, minutosAtrasoMaximo: number, temposFaltaMinimo: number, temposFaltaMaximoTurno: number, temposFaltaMaximoDia: number, ... +3
- **GradeResponse** (interface): etapas: EtapaGradeResponse[], turmas: TurmaGradeResponse[]
- **GridPreviaMock** (interface)
- **GrupoNotaFormativaResponse** (interface): hash: string, nome: string, arquivado: boolean, emUso: boolean, conceitos: TipoNotaFormativaResponse[]
- **GuiaPortalModel** (interface): isualizado: boolean, Dispensado: boolean
- **HistoricoEventoDTO** (interface): hashFrequenciaProfessor: string, nomeTipoPresenca: string, dataEvento: string, dataInicio: string, dataFim: string, ... +3
- **HistoricoEventoResponse** (interface): dataHora: string, ehBloqueio: boolean, nomeEscola: string, nomeTurma: string, hashTurma: string, ... +3
- **HistoricoEventoSubstitutoDTO** (interface): hashTurma: string, nomeTurma: string, quantidade: string, hashFrequenciaProfessorSubstituto: string, hashSubstituto: string, ... +3
- **HistoricoEventosDadosProfessor** (interface): nomeProfessor: string, cpf: string, exibeCpf: boolean, nomePerfilAcesso: string, hashPerfilAcesso: string
- **HistoricoEventosFilterRequest** (interface): hashAnoLetivo: string, hashMes: string, hashRede: string, hashEscola: string, hashTipoEvento: string, ... +3
- **HistoricoEventosGrupoResponse** (interface): hashPessoaEscolaAcesso: string, nomeProfessor: string, cpf: string, exibeCPF: boolean, situacao: string, ... +3
- **HistoricoEventosRouteData** (interface)
- **HistoricoFilterRequest** (interface): ehBloqueio: boolean | null, hashEstruturaAvaliacao: string | null
- **HistoricoHoraAulaItemResponse** (interface): data: string, motivo: string
- **HoraAulaClasseItemResponse** (interface): anoLetivo: number, hashEscolaPagamento: string, nomeEscolaPagamento: string, hashSegmentoPagamento: string, nomeSegmentoPagamento: string, ... +3
- **HoraAulaSegmentoItemResponse** (interface): anoLetivo: number, hashEscolaPagamento: string, nomeEscolaPagamento: string, hashSegmentoPagamento: string, nomeSegmentoPagamento: string, ... +3
- **IConfirmModel** (interface): message: string, textOk: string, textCancel: string, title: string, description: string
- **IElevaIdToken** (interface): AccessToken: string, AccessTokenExpiration: Date
- **IExceptionCommonError** (interface): type: EnumValidationErrorType, message: string
- **IExceptionFormError** (interface): type: EnumValidationErrorType, messages: IExceptionFormErrorMessage[]
- **IExceptionFormErrorMessage** (interface): property: string, error: string
- **IExceptionImportError** (interface): type: EnumValidationErrorType, messages: IExceptionImportErrorMessage[]
- **IExceptionImportErrorMessage** (interface): linha: string, propriedade: string, valor: any, descricao: string
- **IGroupOptionField** (interface): groupLabel: string, groupOptions: IOptionField[] | IRadioOptionField[]
- **INgOptionField** (interface): hash: string, descricao: string
- **IOptionField** (interface): id: any, name: string
- **IPagingParams** (interface): page: number, limit: number
- **IRadioOptionField** (interface): value: any, label: string
- **ISelectOptions** (interface): value: string, label: string
- **IUser** (interface): Nome: string, Matricula: string
- **IdStringResponse** (interface): id: number, texto: string
- **ImportacaoAlocacaoProfessoresFilterRequest** (interface): hashAnoLetivo: string, hashRede: string[], pagina: number
- **ImportacaoAlocacaoProfessoresResponse** (interface): hash: string, dataInclusao: Date, usuarioInclusao: string, quantidadeLinhasEnviadas: number, status: string, ... +1
- **IncluirAgrupamentoRequest** (interface): nome: string, hashesRedeSerie: string[]
- **ItemValidacao** (interface): hash: string, descricaoInvalida: string, hashValido: string, ignorarLinhaImportacao: boolean
- **ItinerarioFormativoDisciplinaResponse** (interface): disciplinas: BaseResponse[], disciplinasFormacaoBasica: BaseResponse[], disciplinasBloqueadasPorCiclo: BaseResponse[]
- **ItinerarioFormativoFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashAgrupamento: string, hashCiclo: string, hashItinerario: string, ... +1
- **ItinerarioFormativoResponse** (interface): hash: string, descricao: string, nomeTipo: string, hashTipo: string, nomeCiclo: string, ... +3
- **ItinerarioFormativoSaveRequest** (interface): hashAnoLetivo: string, hashRede: string, hashAgrupamento: string, hash: string, nome: string, ... +3
- **ItinerarioFormativoSelecaoFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string, hashAgrupamento: string, hashTurma: string[], ... +3
- **JustificativaFaltaRequest** (interface): hashEscola: string, hashPessoa: string, dataAula: string
- **JustificativaFaltaResponse** (interface): hash: string, descricao: string, dataInicial: string, dataFinal: string, possuiAnexo: boolean, ... +1
- **JustificativaFaltaSaveRequest** (interface): descricao: string, dataFinal: string, possuiAnexo: boolean, nomeArquivoOriginal: string, arquivoBase64: string
- **JustificativaFaltaUpdateRequest** (interface): hash: string, arquivoAlterado: boolean
- **LancamentoEventoCreateRequest** (interface): tipoEventoHash: string, dataEvento: string | null, tipoHoraAula: string | null, segmento: string | null, hashSegmento: string | null, ... +3
- **LancamentoEventoDetalheFilterRequest** (interface): hashPessoaEscolaAcesso: string, hashAnoLetivo: string, hashRede: string, hashEscola: string, hashPeriodo: string, ... +1
- **LancamentoEventoDetalheResponse** (interface): hash: string, nome: string, cpf: string, exibeCpf: boolean, hashPerfilAcesso: string, ... +3
- **LancamentoEventoSaveRequest** (interface): hashPessoaEscolaAcesso: string, hashAnoLetivo: string, hashRede: string, hashEscola: string, hashPeriodo: string
- **LancamentoEventoSubstitutoViewModel** (interface): hashTurma: string, nomeTurma: string, quantidade: string, hashFrequenciaProfessorSubstituto: string, hashSubstituto: string, ... +3
- **LancamentoEventoUpdateRequest** (interface): hashFrequenciaProfessor: string, hashPessoaEscolaAcesso: string, hashRede: string, hashEscola: string, hashAnoLetivo: string, ... +3
- **LancamentoEventosFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string, hashPeriodo: string, hashProfessor: string, ... +3
- **LancamentoEventosResponse** (interface): hash: string, hashPessoaEscolaAcesso: string, nomeProfessor: string, cpf: string, exibeCpf: boolean, ... +3
- **LancamentoEventosRouteData** (interface): isOnlyEdit: boolean, filter: LancamentoEventosFilterRequest, tagData: FieldTagOptions[], dadosEvento: any, segmentos: any[], ... +3
- **LancamentoFrequenciaEventoResponse** (interface): hashTurma: string, nomeTurma: string, hashSerie: string, nomeSerie: string, nomeTurno: string, ... +3
- **LancamentoFrequenciaEventoTempoResponse** (interface): hash: string, tempo: number, horarioInicio: string, horarioTermino: string, nomeDisciplina: string, ... +3
- **LancamentoFrequenciaFilterRequest** (interface): data: string, hashRede: string, hashEscola: string, hashSeries: string[], hashTurmas: string[], ... +1
- **LancamentoFrequenciaGetResponse** (interface): possuiVisaoCoordenacao: boolean, eventos: LancamentoFrequenciaEventoResponse[]
- **LancamentoFrequenciaViewModel** (interface): hash: string, nomeEvento: string, nomeTipoEvento: string | null, falta: boolean, atraso: boolean, ... +3
- **LayoutComponent** (interface)
- **LayoutNewPageEvent** (interface): pageIndex: number
- **LayoutPlaceEvent** (interface): pageIndex: number, component: string, height_px: number, freeSpaceBefore_px: number, freeSpaceAfter_px: number
- **LayoutSignatureEvent** (interface): pageIndex: number, freeSpaceAvailable_px: number, signatureHeight_px: number
- **LayoutSplitEvent** (interface): pageIndex: number, component: string, freeSpaceAvailable_px: number, rowsThatFit: number, headHeight_px: number, ... +1
- **LayoutStartEvent** (interface): componentCount: number, firstPageHeight_px: number, otherPageHeight_px: number, signatureHeight_px: number, signatureOnAllPages: boolean
- **LiberacaoBoletinsFilterRequest** (interface): hashAnoLetivo: string | null, hashRede: string | null, hashAgrupamento: string | null, hashEscolas: string[]
- **ListaFrequenciaStore** (interface): hashAulaEvento: string, evento: LancamentoFrequenciaEventoResponse, nomeEscola: string, hashEscola: string, data: string, ... +3
- **ListaPresencaAlunoResponse** (interface): hashPessoa: string, nomePessoa: string, matricula: string, numeroOrdem: number
- **ListaPresencaDocumentoRequest** (interface): hashTurmas: string[]
- **ListaPresencaDocumentoTurmaData** (interface): turma: ListaPresencaTurmaResponse, alunos: ListaPresencaAlunoResponse[], cabecalho: CabecalhoDocumentoResponse | null
- **ListaPresencaFilterRequest** (interface): hashRede: string, hashEscola: string, hashSeries: string[], hashTurmas: string[]
- **ListaPresencaGetResponse** (interface): possuiVisaoCoordenacao: boolean, turmas: ListaPresencaTurmaResponse[]
- **ListaPresencaTurmaResponse** (interface): hashTurma: string, nomeTurma: string, hashSerie: string, nomeSerie: string, nomeTurno: string, ... +3
- **MacroTurmaConfiguracaoFilterRequest** (interface): hashAnoLetivo: string, hashRede: string[], hashTipoEvento: string[], hashSegmentoPagamento: string[], hashSegmentosindical: string[], ... +2
- **MacroTurmaConfiguracaoResponse** (interface): hash: string, hashRede: string, nomeRede: string, nomeMacroTurma: string, urania: string, ... +3
- **MacroTurmaConfiguracaoSaveRequest** (interface): hash: string, hashRedePagamento: string, hashSegmentoPagamento: string, hashSegmentoSindical: string, hashTipoEvento: string, ... +2
- **MatrizCurricularFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashSegmento: string
- **MatrizCurricularGetResponse** (interface): hashDisciplina: string, nomeDisciplina: string, nomeDocumentosOficiais: string, areaConhecimentoNome: string, hashAreaConhecimento: string, ... +3
- **MatrizCurricularRemoverRequest** (interface): hashAnoLetivo: string, hashRede: string, hashSegmento: string, hashDisciplina: string
- **MatrizCurricularSaveRequest** (interface): hashAnoLetivo: string, hashRede: string, hashSegmento: string, hashDisciplina: string, hashAreaConhecimento: string, ... +3
- **MatrizCurricularSerieItem** (interface): hashRedeSerie: string, nomeSerie: string, nomeNaMatriz: string, temCargaHoraria: boolean, cargaEmMinutos: number, ... +2
- **MatrizCurricularSerieSaveItem** (interface): hashRedeSerie: string, nomeDocumentosOficiais: string, cargaEmMinutos: number, cargaFormatada: string
- **MatrizCurricularUpdateRequest** (interface): hashAnoLetivo: string, hashRede: string, hashSegmento: string, hashDisciplina: string, hashAreaConhecimento: string, ... +3
- **MesResponse** (interface): mes: string, descricao: string
- **MonthStruct** (interface): first_day: number, last_day: number, week_start: number, week_start_label: string, month: number, ... +2
- **MotivoProfessorResponse** (interface): hash: string, descricao: string, hashFilho: string, descricaoFilho: string, possuiAlteracaoEmFolha: boolean
- **MotivoResponse** (interface)
- **MotivoSaidaResponse** (interface): hash: string, descricao: string, selecionavelPeloUsuario: boolean, todasAsRedes: boolean, ehSaidaTemporaria: boolean, ... +3
- **MovimentacaoPedagogicaFilterRequest** (interface): hashAnoLetivo: string, hashRede: string[], hashEscola: string, hashPeriodo: string, hashProfessor: string, ... +1
- **MunicipioResponse** (interface): hashEstado: string, siglaEstado: string, nomeEstado: string, hashMunicipio: string, nomeMunicipio: string, ... +1
- **NovaPreviaCargaRequest** (interface): hashRedes: string[], excecaoEscolas: string[]
- **OcorrenciaFilterRequest** (interface): hashAnoLetivo: string, hashRede: string[], hashSerie: string[], apenasOcorrenciasSemSerieAssociada: boolean, pagina: number
- **Page** (interface)
- **Paginacao** (interface)
- **PainelAlunoFilterRequest** (interface): hashAnoLetivo: string, hashRede: string, hashEscola: string, hashSeries: string[], hashTurmas: string[], ... +1
- **PainelAlunoResponse** (interface): hashPessoa: string, hashAlunoEscola: string, nome: string, ra: string, status: string, ... +3
- **PaisResponse** (interface): hashPais: string, possuiEstados: boolean, nomePais: string
- **PendenciasChecklistFolhaResponse** (interface): totalTurmasSemTitulares: number, totalProfessoresSemSC: number, totalProfessoresAcimaDoLimite: number, totalCargasIndevidas: number, turmasSemTitulares: TurmaSemTitularResponse[], ... +3
- **PeriodDisabled** (interface)
- **PeriodoCompetenciaResponse** (interface): hash: string, descricao: string, dataInicio: string, dataFim: string
- **PermissoesAbasConfiguradorFrentesResponse** (interface): possuiConfiguracaoIndividual: boolean, possuiCargaInicial: boolean
- **PermissoesAbasResponse** (interface): possuiConfiguradorAnoLetivo: boolean, possuiConfiguradorEscolaEtapa: boolean, possuiDiasSemAula: boolean, possuiDiaLetivoExtra: boolean
- **PreviaCargaPublicoPorRede** (interface): rede: string, publico: number, excecoes: string[]
- **ProfessorAcimaDoLimiteResponse** (interface): rede: string, professor: string, cpf: string, quantidadeTempos: number, quantidadeTemposPeriodoAnterior: number | null
- **ProfessorCargaEscolaTurmaResponse** (interface): dataMinimaSaidaTurma: string, dataMinimaSaidaEscola: string, dataInicioPeriodoCompetencia: string, dataFimPeriodoCompetencia: string, hashProfessorPerfilVigente: string, ... +3
- **ProfessorCargaRequest** (interface): hash: string, hashAnoLetivo: string, hashRede: string
- **ProfessorCargaUpdateRequest** (interface): HashProfessor: string, HashMotivoSaida: string, DataSaida: Date, CargaParaUpdates: CargaParaUpdate[]
- **ProfessorClassePagamentoSaveRequest** (interface): hashAnoLetivo: string, hashRede: string, hashPessoa: string, mes: number, hashClassePagamento: string
- **ProfessorSemSCResponse** (interface): rede: string, professor: string, cpf: string, mesInicial: string, chapa: boolean, ... +1
- **ProfessorSituacaoResponse** (interface): ehTerceiro: boolean, emAtividade: boolean, desligado: boolean
- **ProfessorSubstitutoRequest** (interface): hashRede: string, hashProfessorAtual: string
- **ProfessorSubstitutoResponse** (interface): hash: string, descricao: string, ehTitular: boolean
- **ProfessorTotalTempos** (interface): total: number, titular: number, licenca: number, substituto: number
- **ProfessoresChapaResponse** (interface): hashRede: string, nomeRede: string, hashPessoa: string, nomePessoa: string, hashClassePagamento: string, ... +3
- **ProfissionalAtivoItem** (interface): hash: string, nome: string, cpf: string, ehProfessor: boolean
- **RenderElementLog** (interface): name: string, calculated_px: number, actual_px: number, diff_px: number
- **RenderMeasureEvent** (interface): pageIndex: number, pageContentHeight_px: number, componentGap_px: number, elements: RenderElementLog[], totalCalculated_px: number, ... +2
- **ResponsavelCardResponse** (interface): hashPessoa: string, nome: string, ehFiliacao: boolean, ehRespFinanceiro: boolean, ehRespPedagogico: boolean, ... +2
- **ResumoProfessor** (interface): vago: boolean, nome: string, cpf: string, hash: string
- **SaidaAntecipadaRequest** (interface): hashAulaEvento: string, hashPessoa: string
- **SaidaAntecipadaResponse** (interface): hash: string, horaSaida: string, justificativa: string
- **SaidaAntecipadaSaveRequest** (interface): hashAulaEvento: string, hashPessoa: string, horaSaida: string, justificativa: string
- **SalvarEmMassaRequest** (interface): hashRede: string, hashEscolaSeries: string[], hashFrentes: string[]
- **SalvarEmMassaResponse** (interface): escolasAfetadas: number, configuracoesAdicionadas: number
- **SalvarFichaMedicaRequest** (interface): hashAlunoEscola: string, hashAnoLetivo: string, hashEscola: string, tipoSanguineo: string | null, possuiNecessidadeEspecial: boolean, ... +3
- **SalvarFrenteRequest** (interface): hashRede: string, hashEscolaSerie: string, hashDisciplina: string, habilitar: boolean
- **SalvarGrupoNotaFormativaRequest** (interface): hash: string | null, hashRede: string, nome: string, conceitos: ConceitoSaveRequest[]
- **SalvarMonitorRequest** (interface): hashRede: string, hashTurma: string, hashFrente: string, hashesPessoaEscolaAcesso: string[]
- **SalvarProfessorRequest** (interface): hashRede: string, hashTurma: string, hashFrente: string, hashPessoaEscolaAcesso: string | null
- **SaveBloqueioFiltroRequest** (interface): hashEstruturas: string[], bloquear: boolean
- **SaveBloqueioRequest** (interface): itens: BloqueioItemRequest[], bloquear: boolean
- **SaveBloqueioResponse** (interface): alterados: BloqueioAlteradoResponse[]
- **SaveChamadaRequest** (interface): hashAulaEvento: string, hashPessoa: string, hashTipoFrequencia: string
- **SegmentoPagamentoFilterRequest** (interface): hashRede: string[], pagina: number
- **SegmentoPagamentoResponse** (interface): hash: string, hashRede: string, nomeRede: string, nomeSegmento: string, sigla: string
- **SegmentoPagamentoSaveRequest** (interface): hash: string, hashRede: string, nomeSegmento: string, sigla: string, nomeRede: string
- **SegmentoSindicalFilterRequest** (interface): hashRede: string[], pagina: number
- **SegmentoSindicalResponse** (interface): hash: string, hashRede: string, nomeRede: string, nome: string, sigla: string
- **SegmentoSindicalSaveRequest** (interface): hash: string | null, hashRede: string, nome: string, sigla: string
- **SegmentosDePagamentoPorRedeResponse** (interface): hash: string, nome: string, sigla: string, hashRede: string
- **SegmentosSindicalPorRedeResponse** (interface): hash: string, nome: string, sigla: string, hashRede: string
- **SelecaoItinerarioSaveRequest** (interface): hashRede: string, hashTurma: string[], hashAluno: string, hashPeriodo: string, hashComponente: string[]
- **SerieResponse** (interface): hash: string, descricao: string, ordem: number
- **SideEffect** (interface): trigger: FilterType, target: string
- **SideEffectContext** (interface): formValue: Record<string, any>
- **SplitResult** (interface)
- **Splittable** (interface)
- **StatusImportacaoResponse** (interface): fileName: string, hash: string
- **StatusLancamentoFrequenciaResponse** (interface): hash: string, descricao: string, descricaoTooltip: string, ehPendenteLancamento: boolean, ehPossuiPendencia: boolean, ... +2
- **SubstitutoUpdateRequest** (interface): turmaHash: string, substitutoHash: string, quantidade: number, geraPagamento: boolean
- **TesteEnvioRequest** (interface): hashRede: string
- **TextMeasurable** (interface)
- **TipoCalculoResponse** (interface): somatorio: boolean, media: boolean, mediaSimples: boolean, mediaPonderada: boolean, mediaDesempenho: boolean
- **TipoDivisaoChapaResponse** (interface): selecaoUnica: boolean, permiteOutraChapaParaMesmaEscola: boolean
- **TipoEventoPagamentoFilterRequest** (interface): hashRede: string[], pagina: number
- **TipoEventoPagamentoResponse** (interface): hash: string, nomeTipoEvento: string, siglaTipoPagamento: string, hashTipoPagamento: string, hashEventoReserva: string, ... +3
- **TipoEventoPagamentoSaveRequest** (interface): hash: string, nome: string, hashTipoPagamento: string, hashEventoReserva: string
- **TipoEventoResponse** (interface): hash: string, nomeTipoEvento: string, grupoTipoEvento: number, extra: boolean, atraso: boolean, ... +3
- **TipoFrequenciaResponse** (interface): hash: string, descricao: string, ehPresenca: boolean, ehAtraso: boolean, ehFalta: boolean
- **TipoNotaFormativaResponse** (interface): hash: string, descricao: string, detalhamento: string, ordem: number
- **TipoOcorrenciaSaveRequest** (interface): hash: string, hashAnoLetivo: string, hashRede: string, descricao: string, pontos: number, ... +2
- **TipoOcorrenciaStatusRequest** (interface): hash: string, ativo: boolean
- **TipoPagamentoResponse** (interface): hash: string, nome: string, sigla: string, possuiReserva: boolean, podeSerReserva: boolean
- **TurmaAusentesResponse** (interface): hashTurma: string, nomeTurma: string, totalAusentes: number, totalJustificados: number, alunos: AlunoAusenteItem[]
- **TurmaFormularioResponse** (interface): hash: string, descricao: string, hashTurno: string, nomeTurno: string, ordemTurno: number, ... +3
- **TurmaGradeResponse** (interface): hash: string, nomeTurma: string, nomeEscola: string, celulas: CelulaGradeResponse[]
- **TurmaMacroTurmaConfiguracaoResponse** (interface): hashTurma: string, nomeRede: string, nomeEscola: string, nomeTurma: string
- **TurmaMacroTurmaSaveRequest** (interface): hashMacroTurmaConfiguracao: string, turmasParaAdicionar: string[], turmasParaRemover: string[]
- **TurmaNavegacaoResponse** (interface): evento: LancamentoFrequenciaEventoResponse, hashAulaEvento: string, lancamentoDisponivelAPartirDe: string
- **TurmaResponse** (interface): hash: string, descricao: string, hashTurno: string, hashSerie: string
- **TurmaSemTitularResponse** (interface): rede: string, escola: string, serie: string, turmaId: number, turma: string, ... +3
- **TurmaUpdate** (interface): segmentoDeServico: boolean, novoCadastro: boolean, hashTurno: string, hashTurma: string, nomeTurma: string, ... +1
- **TwilioFilaEnvioResponse** (interface): previaCargaHash: string, anoLetivo: number, mes: number, nomeRede: string, hashRede: string, ... +3
- **TwilioTemplateTextResponse** (interface): texto: string
- **UpdateImportacaoRequest** (interface): hash: string
- **UsoGrupoResponse** (interface): anosLetivos: string[], agrupamentos: string[]
- **UsuarioAutenticadoModel** (interface): PossuiUsuarioAutenticado: boolean, AcessosUsuario: AcessoUsuarioModel[], ElevaId: ElevaIdModel, Email: string, Id: number, ... +3
- **WideTableGroupLog** (interface): groupIndex: number
- **WideTableMeasureEvent** (interface): name: string, pageContentWidth_px: number, totalRows: number, columnGroupCount: number, rowHeights_px: number[], ... +2

## URLs de ambiente

- `/estrutura-pedagogica/api`
- `api`
- `https://localhost/estrutura-pedagogica/api`

---
*301 componentes · 134 services · 38 módulos · 419 models · 17 rotas*