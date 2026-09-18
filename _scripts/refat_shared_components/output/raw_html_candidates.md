# Candidatos à Refatoração — HTML Cru → Shared Components

Templates com HTML substituível: **71**

## Resumo por padrão

- `app-button`: 177 ocorrência(s)
- `app-table-wrapper`: 43 ocorrência(s)
- `app-checkbox`: 12 ocorrência(s)
- `app-textarea-field`: 9 ocorrência(s)
- `text-field`: 8 ocorrência(s)
- `app-number-field`: 7 ocorrência(s)
- `single-select (standalone) / app-select-field (reactive)`: 6 ocorrência(s)
- `date-field (standalone) / app-date-field (reactive)`: 6 ocorrência(s)

## Detalhe por template

### `app/features/boletim/processamento/processamento.component.html`

  - linha **19**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button (click)="selecionarTodos()">Selecionar todos {{items.length}} itens referente ao filtro.</button>
    ```
  - linha **23**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button (click)="removerTodos()">Limpar seleção</button>
    ```
  - linha **101**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **49**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox"
    ```
  - linha **27**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table *ngIf="!loadingList && items.length > 0" class="lista table-boletims">
    ```

### `app/features/cargas-iniciais/alocacao-professores/alocacao-professores.component.html`

  - linha **30**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table *ngIf="!loadingList && listaProcessamentos.length !== 0" class="lista table-processamentos">
    ```

### `app/features/diario-de-classe/configuracao/configuracao.component.html`

  - linha **69**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **45**: substituir por `<text-field>` (`shared/dynamic-components/text-field`)
    ```html
    <input class="char-input" type="text" maxlength="1" [(ngModel)]="presenca" />
    ```
  - linha **49**: substituir por `<text-field>` (`shared/dynamic-components/text-field`)
    ```html
    <input class="char-input" type="text" maxlength="1" [(ngModel)]="falta" />
    ```
  - linha **53**: substituir por `<text-field>` (`shared/dynamic-components/text-field`)
    ```html
    <input class="char-input" type="text" maxlength="1" [(ngModel)]="pendencia" />
    ```
  - linha **57**: substituir por `<text-field>` (`shared/dynamic-components/text-field`)
    ```html
    <input class="char-input" type="text" maxlength="1" [(ngModel)]="transferencia" />
    ```
  - linha **61**: substituir por `<text-field>` (`shared/dynamic-components/text-field`)
    ```html
    <input class="char-input" type="text" maxlength="1" [(ngModel)]="nee" />
    ```
  - linha **10**: substituir por `<single-select (standalone) / app-select-field (reactive)>` (`shared/components/select-field | shared/dynamic-components/select-field`)
    ```html
    <select
    ```
  - linha **87**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="preview-table">
    ```

### `app/features/diario-de-classe/listar/listar.component.html`

  - linha **16**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/dias-sem-aula/detalhe/detalhe.component.html`

  - linha **35**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-secundary no-borders" (click)="confirmDelete = false">Cancelar</button>
    ```
  - linha **36**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **46**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-secundary no-borders" (click)="confirmDelete = true">Remover</button>
    ```
  - linha **47**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-primary colored" (click)="editEvent.emit(item)">Editar</button>
    ```

### `app/features/dias-sem-aula/formulario/formulario.component.html`

  - linha **117**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **124**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **83**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea
    ```

### `app/features/dias-sem-aula/listar/listar.component.html`

  - linha **50**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="edit-btn" (click)="detalheSelecionado = item" [tooltip]="'Detalhes'">
    ```
  - linha **24**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `app/features/escolas-gerenciais/listar/listar-escola-gerencial.component.html`

  - linha **47**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **29**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/escolas-publicas/detalhes/detalhes.component.html`

  - linha **71**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **79**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **46**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/escolas-publicas/listar/listar.component.html`

  - linha **60**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **39**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/escolas-publicas/modals/cadastro-escola-publica/cadastro-escola-publica.component.html`

  - linha **65**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista lista-sticky">
    ```
  - linha **84**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista lista-sticky">
    ```

### `app/features/escolas-publicas/modals/cadastro-turma-servico/cadastro-turma-servico.component.html`

  - linha **68**: substituir por `<text-field>` (`shared/dynamic-components/text-field`)
    ```html
    <input id="sigla-urania" placeholder="Escreva aqui" formControlName="siglaUrania" class="form-control" type="text" minle
    ```
  - linha **46**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista lista-sticky">
    ```

### `app/features/escolas-publicas/modals/cadastro-turma/cadastro-turma.component.html`

  - linha **49**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista lista-sticky">
    ```
  - linha **65**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista lista-sticky">
    ```

### `app/features/escolas-publicas/modals/remover-turma/remover-turma.component.html`

  - linha **13**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input *ngIf="!!listaTurmas?.length" type="checkbox"
    ```
  - linha **9**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista overflow">
    ```

### `app/features/etapas/listar/listar.component.html`

  - linha **65**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **22**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `app/features/etapas/modals/editar-etapas/editar-etapas.component.html`

  - linha **38**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-seconday" (click)="close()">Não</button>
    ```
  - linha **39**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/exemplos/carometro-exemplo/carometro-exemplo.component.html`

  - linha **7**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/exemplos/diario-classe-exemplo/diario-classe-exemplo.component.html`

  - linha **7**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/exemplos/document-builder-ia-guide/document-builder-ia-guide.component.html`

  - linha **811**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="cta-btn" (click)="openTour()">
    ```
  - linha **1005**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="nav-btn" (click)="prev()" [disabled]="currentSlide === 0" title="Anterior (←)">
    ```
  - linha **1009**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="nav-btn" (click)="next()" [disabled]="currentSlide === totalSlides - 1" title="Próximo (→)">
    ```
  - linha **1016**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button *ngFor="let _ of [].constructor(totalSlides); let i = index"
    ```
  - linha **145**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="data-table">
    ```

### `app/features/exemplos/document-builder-tour/tour-assets/tour.html`

  - linha **1428**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-val="retrato"><span class="material-symbols-outlined">crop_portrait</span> Retrato</button>
    ```
  - linha **1429**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-val="paisagem" class="on"><span class="material-symbols-outlined">crop_landscape</span> Paisagem</button>
    ```
  - linha **1574**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-y="4" data-x="6">Compacto</button>
    ```
  - linha **1575**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-y="8" data-x="12" class="on">Padrão</button>
    ```
  - linha **1576**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-y="14" data-x="20">Confortável</button>
    ```
  - linha **1673**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="cbx on" id="hfHeader"><span class="material-symbols-outlined">check</span></button>
    ```
  - linha **1677**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="cbx sm on" id="hfHeaderAll"><span class="material-symbols-outlined">check</span></button>
    ```
  - linha **1683**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="cbx on" id="hfFooter"><span class="material-symbols-outlined">check</span></button>
    ```
  - linha **1764**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-val="left" aria-label="Esquerda"><span class="material-symbols-outlined">format_align_left</span></button>
    ```
  - linha **1765**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-val="center" class="on" aria-label="Centro"><span class="material-symbols-outlined">format_align_center</sp
    ```
  - linha **1766**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-val="right" aria-label="Direita"><span class="material-symbols-outlined">format_align_right</span></button>
    ```
  - linha **1772**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-val="left" aria-label="Esquerda"><span class="material-symbols-outlined">align_horizontal_left</span></butt
    ```
  - linha **1773**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-val="center" class="on" aria-label="Centro"><span class="material-symbols-outlined">align_horizontal_center
    ```
  - linha **1774**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button data-val="right" aria-label="Direita"><span class="material-symbols-outlined">align_horizontal_right</span></but
    ```
  - linha **1784**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="cbx on" id="sigRole"><span class="material-symbols-outlined">check</span></button>
    ```
  - linha **1844**: substituir por `<single-select (standalone) / app-select-field (reactive)>` (`shared/components/select-field | shared/dynamic-components/select-field`)
    ```html
    <select id="expQual">
    ```
  - linha **1855**: substituir por `<single-select (standalone) / app-select-field (reactive)>` (`shared/components/select-field | shared/dynamic-components/select-field`)
    ```html
    <select id="expStrat">
    ```
  - linha **1553**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table>
    ```

### `app/features/exemplos/document-editor/components/block-inspector/block-inspector.component.html`

  - linha **5**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **12**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **133**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **164**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="field-row__del" (click)="removeInfoField(i)" aria-label="Remover campo">
    ```
  - linha **169**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="rr-add-btn" (click)="addInfoField()">
    ```
  - linha **194**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="field-row__del" (click)="removeColumn(i)" aria-label="Remover coluna">
    ```
  - linha **199**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="rr-add-btn" (click)="addColumn()">
    ```
  - linha **223**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="field-row__del" (click)="removeRow(ri)" aria-label="Remover linha">
    ```
  - linha **241**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="rr-add-btn" (click)="addRow()">
    ```
  - linha **344**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="rr-toggle" [class.rr-toggle--on]="infoGridData.showLineage"
    ```
  - linha **371**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="rr-toggle" [class.rr-toggle--on]="infoGridData.showDigitalId"
    ```
  - linha **127**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea class="rr-input rr-input--textarea" rows="6" [value]="statementData.text"
    ```
  - linha **265**: substituir por `<single-select (standalone) / app-select-field (reactive)>` (`shared/components/select-field | shared/dynamic-components/select-field`)
    ```html
    <select class="rr-select"
    ```

### `app/features/exemplos/document-editor/components/block-library/block-library.component.html`

  - linha **18**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/exemplos/document-editor/components/editor-canvas/editor-canvas.component.html`

  - linha **23**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="insert-slot__btn" aria-label="Inserir bloco aqui">
    ```
  - linha **46**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btb" [disabled]="first" (click)="moveBlock.emit({ id: block.id, direction: 'up' }); $event.stopPropagatio
    ```
  - linha **49**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btb" [disabled]="last" (click)="moveBlock.emit({ id: block.id, direction: 'down' }); $event.stopPropagati
    ```
  - linha **53**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btb" (click)="duplicateBlock.emit(block.id); $event.stopPropagation()" aria-label="Duplicar">
    ```
  - linha **57**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btb btb--danger" (click)="removeBlock.emit(block.id); $event.stopPropagation()" aria-label="Remover">
    ```
  - linha **80**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="insert-slot__btn" aria-label="Inserir bloco no final">
    ```
  - linha **86**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/exemplos/document-editor/document-editor.component.html`

  - linha **6**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="topbar__back" (click)="goBack()" aria-label="Voltar">
    ```
  - linha **27**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="topbar__btn topbar__btn--ghost" (click)="printSilent()">
    ```
  - linha **31**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="topbar__btn topbar__btn--fill" (click)="saveSilent()">
    ```
  - linha **47**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="insert-hint__cancel" (click)="pendingInsertAt = null" aria-label="Cancelar">
    ```
  - linha **59**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="seg-mini-btn" [class.seg-mini-btn--active]="canvasMode === 'edit'" (click)="setMode('edit')">
    ```
  - linha **63**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="seg-mini-btn" [class.seg-mini-btn--active]="canvasMode === 'preview'" (click)="setMode('preview')">
    ```
  - linha **67**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="seg-mini-btn" [class.seg-mini-btn--active]="canvasMode === 'json'" (click)="setMode('json')">
    ```
  - linha **75**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **84**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button *ngIf="canvasMode === 'preview'" class="topbar__btn topbar__btn--fill" (click)="saveFromPreview()">
    ```

### `app/features/exemplos/documents/documents.component.html`

  - linha **12**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="banner__cta" routerLink="/exemplos/document-editor">
    ```
  - linha **25**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="tab" [class.on]="activeTab === 'all'" (click)="setTab('all')">
    ```
  - linha **28**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="tab" [class.on]="activeTab === 'tests'" (click)="setTab('tests')">
    ```
  - linha **31**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="tab" [class.on]="activeTab === 'models'" (click)="setTab('models')">
    ```
  - linha **78**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="actbtn" aria-label="Imprimir" (click)="openAndRun(s, 'print')">
    ```
  - linha **81**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="actbtn" aria-label="Salvar PDF" (click)="openAndRun(s, 'save')">
    ```
  - linha **84**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="openbtn" (click)="openDocument(s)">
    ```
  - linha **131**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="actbtn" aria-label="Imprimir" (click)="openAndRun(s, 'print')">
    ```
  - linha **134**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="openbtn" (click)="openDocument(s)">
    ```
  - linha **176**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="openbtn" (click)="openMultiDocument(s)">
    ```

### `app/features/exemplos/exemplos-dashboard/exemplos-dashboard.component.html`

  - linha **56**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="openbtn">
    ```
  - linha **107**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="openbtn">
    ```

### `app/features/exemplos/filtros-tour/filtros-tour.component.html`

  - linha **419**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="storage-inspector__btn" (click)="refreshStorageInspector()">
    ```
  - linha **422**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="storage-inspector__btn storage-inspector__btn--danger"
    ```
  - linha **533**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="ref-table">
    ```
  - linha **558**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="ref-table">
    ```

### `app/features/exemplos/side-panel-exemplo/side-panel-exemplo.component.html`

  - linha **56**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button type="button" class="btn btn--primary btn--lg" (click)="openPanel()">
    ```
  - linha **157**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button type="button" class="btn btn--outline" (click)="closePanel()">Fechar</button>
    ```
  - linha **158**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button type="button" class="btn btn--primary">Salvar</button>
    ```

### `app/features/exemplos/table-filter/table-filter.component.html`

  - linha **14**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <div><input type="checkbox" /></div>
    ```
  - linha **29**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <div class="checkbox-col"><input type="checkbox" /></div>
    ```

### `app/features/exemplos/tela-base/tela-base.component.html`

  - linha **26**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **191**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **236**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **243**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **284**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **292**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **334**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **342**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **216**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/ficha-individual/ficha-individual.component.html`

  - linha **17**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="fi-openbtn">
    ```
  - linha **35**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="fi-openbtn">
    ```
  - linha **60**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="fi-log-btn" (click)="copyLogJson()">
    ```
  - linha **64**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="fi-log-btn" (click)="logToConsole()">
    ```
  - linha **68**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="fi-log-btn" (click)="downloadLogJson()">
    ```

### `app/features/folha/gestao-pagamento/cadastro-cargo-pagamento/cadastro-cargo-pagamento.component.html`

  - linha **18**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button id="sair-button" [disabled]="loadingList" class="button-secundary no-borders" (click)="toggleModal()">
    ```
  - linha **21**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button (click)="save()" id="salvar-button" class="button-primary colored" type="submit" [disabled]="loadingList || dado
    ```

### `app/features/folha/gestao-pagamento/cadastro-classe/cadastro-classe.component.html`

  - linha **95**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **103**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/folha/gestao-pagamento/cadastro-evento/cadastro-evento.component.html`

  - linha **64**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **72**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/folha/gestao-pagamento/cadastro-segmento-pagamento/cadastro-segmento-pagamento.component.html`

  - linha **85**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **93**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/folha/gestao-pagamento/cadastro-segmento-sindical/cadastro-segmento-sindical.component.html`

  - linha **85**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **93**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/folha/gestao-pagamento/configuracao-chapa/configuracao-chapa.component.html`

  - linha **102**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **38**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/edicao-chapa/edicao-chapa.component.html`

  - linha **48**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/editar-turma-macroturmas/editar-turma-macroturmas.component.html`

  - linha **28**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **36**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/folha/gestao-pagamento/listar-cargos-pagamento/listar-cargos-pagamento.component.html`

  - linha **34**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **18**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/listar-classes/listar-classes.component.html`

  - linha **48**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **30**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/listar-escolas/listar.component.html`

  - linha **48**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **30**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/listar-eventos/listar-eventos.component.html`

  - linha **49**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **29**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/listar-macroturmas/listar-macroturmas.component.html`

  - linha **53**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **62**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **29**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/listar-segmentos-pagamento/listar-segmentos-pagamento.component.html`

  - linha **47**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **29**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/listar-segmentos-sindical/listar-segmentos-sindical.component.html`

  - linha **47**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **29**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/gestao-pagamento/listar-turmas-macroturmas/listar-turmas-macroturmas.component.html`

  - linha **69**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **38**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/folha/listar-checklist/cargas-indevidas/cargas-indevidas.component.html`

  - linha **2**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `app/features/folha/listar-checklist/disciplinas-sem-titular/disciplinas-sem-titular.component.html`

  - linha **2**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `app/features/folha/listar-checklist/professores-sem-sc/professores-sem-sc.component.html`

  - linha **2**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `app/features/folha/previa-carga/envio-previa/novo-envio-previa.component.html`

  - linha **89**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista overflow">
    ```

### `app/features/folha/previa-carga/informacoes-envio/informacoes-envio.component.html`

  - linha **16**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista-informacoes-envio lista">
    ```

### `app/features/folha/previa-carga/listar/listar.component.html`

  - linha **32**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `app/features/grade-horaria/configurador-tempo-padrao/configurador-tempo-padrao.component.html`

  - linha **173**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **180**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **36**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox" [(ngModel)]="item.selecionado" />
    ```
  - linha **16**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista overflow">
    ```

### `app/features/itinerario-formativo/listar-itinerarios/listar-itinerarios.component.html`

  - linha **75**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```

### `app/features/itinerario-formativo/selecao-itinerario/selecao-itinerario.component.html`

  - linha **184**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **196**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **70**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table
    ```

### `app/features/lancamento-frequencia/justificativas/justificativas.component.html`

  - linha **59**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **122**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **174**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button type="button" class="btn-remover-arquivo" (click)="removerArquivo()" title="Remover arquivo">
    ```
  - linha **193**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **202**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-cancelar" type="button" [disabled]="salvarJustificativaLoading" (click)="fecharFormulario()">Cancelar
    ```
  - linha **203**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **221**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-secundary no-borders" (click)="confirmarRemocaoAberta = false">Cancelar</button>
    ```
  - linha **222**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-primary colored" (click)="removerJustificativa()">Remover</button>
    ```
  - linha **230**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-secundary no-borders" (click)="cancelarTroca()">Voltar</button>
    ```
  - linha **231**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-primary colored" (click)="confirmarTroca()">Descartar e continuar</button>
    ```
  - linha **149**: substituir por `<date-field (standalone) / app-date-field (reactive)>` (`shared/components/date-field | shared/dynamic-components/date-field`)
    ```html
    <input type="date" [(ngModel)]="justificativaDataInicio" (ngModelChange)="marcarSujo()" />
    ```
  - linha **153**: substituir por `<date-field (standalone) / app-date-field (reactive)>` (`shared/components/date-field | shared/dynamic-components/date-field`)
    ```html
    <input type="date" [(ngModel)]="justificativaDataFim" (ngModelChange)="marcarSujo()" />
    ```
  - linha **162**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea
    ```
  - linha **37**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="tabela-ausentes">
    ```

### `app/features/lancamento-frequencia/lancamento/justificativa-modal/justificativa-modal.component.html`

  - linha **48**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-remover-arquivo" (click)="removerArquivoSelecionado()">
    ```
  - linha **57**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-cancel" (click)="fecharModalJustificativa()" [disabled]="salvarJustificativaLoading">Cancelar</button
    ```
  - linha **58**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-save" (click)="salvarJustificativa()" [disabled]="salvarJustificativaLoading">
    ```
  - linha **101**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-danger" (click)="solicitarRemocao()" [disabled]="salvarJustificativaLoading">
    ```
  - linha **104**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-save" (click)="ativarEdicaoJustificativa()">
    ```
  - linha **118**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-cancel" (click)="confirmarRemocaoAberta = false" [disabled]="salvarJustificativaLoading">Cancelar</bu
    ```
  - linha **119**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-danger" (click)="removerJustificativa()" [disabled]="salvarJustificativaLoading">
    ```
  - linha **154**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-remover-arquivo" (click)="removerArquivoSelecionado()">
    ```
  - linha **163**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-cancel" (click)="modoEdicaoJustificativa = false" [disabled]="salvarJustificativaLoading">Cancelar</b
    ```
  - linha **164**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="btn-save" (click)="atualizarJustificativa()" [disabled]="salvarJustificativaLoading">
    ```
  - linha **28**: substituir por `<date-field (standalone) / app-date-field (reactive)>` (`shared/components/date-field | shared/dynamic-components/date-field`)
    ```html
    <input type="date" class="form-control" [(ngModel)]="justificativaDataInicio" [max]="dataAula" />
    ```
  - linha **32**: substituir por `<date-field (standalone) / app-date-field (reactive)>` (`shared/components/date-field | shared/dynamic-components/date-field`)
    ```html
    <input type="date" class="form-control" [(ngModel)]="justificativaDataFim" [min]="justificativaDataInicio" />
    ```
  - linha **135**: substituir por `<date-field (standalone) / app-date-field (reactive)>` (`shared/components/date-field | shared/dynamic-components/date-field`)
    ```html
    <input type="date" class="form-control" [(ngModel)]="justificativaDataInicio" [max]="dataAula" />
    ```
  - linha **139**: substituir por `<date-field (standalone) / app-date-field (reactive)>` (`shared/components/date-field | shared/dynamic-components/date-field`)
    ```html
    <input type="date" class="form-control" [(ngModel)]="justificativaDataFim" [min]="justificativaDataInicio" />
    ```
  - linha **17**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea
    ```
  - linha **130**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea class="form-control" rows="3" [(ngModel)]="justificativaTexto"></textarea>
    ```

### `app/features/lancamento-frequencia/lancamento/lancamento.component.html`

  - linha **3**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **161**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **181**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **194**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **210**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **260**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **268**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **275**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **361**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **389**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **397**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **404**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **429**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **446**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **464**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **244**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea
    ```
  - linha **328**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea
    ```

### `app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.html`

  - linha **136**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **42**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista lista-bottom">
    ```

### `app/features/lancamento-frequencia/listar/listar.component.html`

  - linha **67**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button [class]="getClassBotaoAcao(evento.hashStatus)" (click)="abrirLancamento(evento)">
    ```
  - linha **91**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button [class]="getClassBotaoAcao(evento.hashStatus)" (click)="abrirLancamento(evento)">
    ```
  - linha **41**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table *ngIf="viewMode === 'table'" class="tabela">
    ```

### `app/features/movimentacao-pedagogica/components/modal-alteracao-carga/modal-alteracao-carga.component.html`

  - linha **9**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `app/features/movimentacao-pedagogica/components/tipo-evento-atraso-edit/tipo-evento-atraso-edit.component.html`

  - linha **21**: substituir por `<app-number-field>` (`shared/dynamic-components/number-field`)
    ```html
    <input type="number" class="ae-input" placeholder="0 minutos" min="0" [formControl]="$any(form.get('tempos'))">
    ```
  - linha **41**: substituir por `<app-number-field>` (`shared/dynamic-components/number-field`)
    ```html
    <input type="number" class="ae-input" placeholder="0 minutos" min="0" formControlName="temposTurma">
    ```

### `app/features/movimentacao-pedagogica/components/tipo-evento-base-form/tipo-evento-base-form.component.html`

  - linha **36**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="ae-tooltip-close" (click)="mostrarTooltipDataEvento = false">✕</button>
    ```
  - linha **53**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="ae-tooltip-close" (click)="mostrarTooltipDataEvento = false">✕</button>
    ```
  - linha **401**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button type="button" class="ae-btn-back" (click)="voltarStepAdicionarEvento($event)" *ngIf="stepAtivoAdicionarEvento > 
    ```
  - linha **32**: substituir por `<text-field>` (`shared/dynamic-components/text-field`)
    ```html
    <input type="text" class="ae-input" [disabled]="true" placeholder="Não se aplica para o evento"
    ```
  - linha **68**: substituir por `<app-number-field>` (`shared/dynamic-components/number-field`)
    ```html
    <input type="number" class="ae-input" placeholder="Insira a quantidade" min="0" [formControl]="$any(form.get('quantidade
    ```
  - linha **73**: substituir por `<app-number-field>` (`shared/dynamic-components/number-field`)
    ```html
    <input type="number" class="ae-input" [placeholder]="isValorSimples ? 'Insira o valor' : 'Insira o valor unitário'" min=
    ```
  - linha **117**: substituir por `<app-number-field>` (`shared/dynamic-components/number-field`)
    ```html
    <input type="number" class="ae-input" placeholder="0 tempos" min="0" [formControl]="$any(form.get('tempos'))">
    ```
  - linha **256**: substituir por `<app-number-field>` (`shared/dynamic-components/number-field`)
    ```html
    <input type="number" class="ae-input" [placeholder]="this.tipoEventoSelecionado?.atraso === true? '0 minutos':'0 tempos'
    ```
  - linha **333**: substituir por `<app-number-field>` (`shared/dynamic-components/number-field`)
    ```html
    <input type="number" class="ae-input" placeholder="0" min="0" formControlName="quantidadeTurma" (blur)="calcularQuantida
    ```
  - linha **124**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox" class="ae-switch-input" [formControl]="$any(form.get('planejado'))">
    ```
  - linha **154**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox" class="ae-switch-input" [formControl]="$any(form.get('planejado'))">
    ```
  - linha **206**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox" class="ae-switch-input" [formControl]="$any(form.get('desconto'))">
    ```
  - linha **263**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox" formControlName="apenasEscola" (change)="onApenasEscolaChange(i, $any($event.target).checked)">
    ```
  - linha **280**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox" class="ae-switch-input" formControlName="geraPagamento">
    ```
  - linha **219**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea
    ```

### `app/features/ocorrencia/cadastro/cadastro.component.html`

  - linha **140**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **148**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **48**: substituir por `<app-textarea-field>` (`shared/dynamic-components/textarea-field`)
    ```html
    <textarea
    ```

### `app/features/ocorrencia/listar/listar.component.html`

  - linha **86**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="edit-btn" (click)="ocorrenciaInfo = ocorrencia" [tooltip]="'Detalhes'">
    ```
  - linha **89**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="edit-btn" (click)="novoTipoOcorrencia(ocorrencia)" [disabled]="!form.get('toggle_' + ocorrencia.hash).val
    ```
  - linha **45**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `app/features/page-not-found/page-not-found.component.html`

  - linha **10**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-primary" (click)="navigateToHome()">
    ```

### `app/features/periodo-letivo/editar/editar.component.html`

  - linha **30**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button
    ```
  - linha **206**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="button-primary" type="submit" [disabled]="!form.valid">
    ```
  - linha **56**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox" (change)="selectAll()" />
    ```
  - linha **68**: substituir por `<app-checkbox>` (`shared/dynamic-components/checkbox`)
    ```html
    <input type="checkbox" [(ngModel)]="periodo.selecionado" />
    ```
  - linha **197**: substituir por `<single-select (standalone) / app-select-field (reactive)>` (`shared/components/select-field | shared/dynamic-components/select-field`)
    ```html
    <select formControlName="hashTipoChamada" class="form-control">
    ```
  - linha **52**: substituir por `<app-table-wrapper>` (`shared/components/table-wrapper`)
    ```html
    <table class="lista">
    ```

### `portal-modulo/logar-como/logar-como.component.html`

  - linha **18**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button type="submit" class="btn btn-success btn-salvar">Entrar</button>
    ```
  - linha **10**: substituir por `<text-field>` (`shared/dynamic-components/text-field`)
    ```html
    <input type="text" class="form-control input-sm" [(ngModel)]="usuarioLogarComo" tabindex="1" [ngModelOptions]="{standalo
    ```

### `portal-modulo/portal-header/portal-header.component.html`

  - linha **3**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button *ngIf="menuLateralVisivel" type="button" class="sidebar-toggle" (click)="toggleSideBar()">
    ```
  - linha **14**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
    ```

### `portal-modulo/portal-menu-perfil/portal-menu-perfil.component.html`

  - linha **52**: substituir por `<app-button>` (`shared/components/button`)
    ```html
    <button id="ot-sdk-btn" #btnConfigCookies style="display: none;" class="ot-sdk-show-settings">Definições de cookies</but
    ```
  - linha **32**: substituir por `<single-select (standalone) / app-select-field (reactive)>` (`shared/components/select-field | shared/dynamic-components/select-field`)
    ```html
    <select style="max-width: 90%;width: 100%;" #user (change)="perfilAlterado(user.value, user)" class="selectPerfil">
    ```
