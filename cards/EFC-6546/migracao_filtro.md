# Migração: `<app-filtro>` → `<filtro>`

## Visão Geral

O componente legado `<app-filtro>` (`src/shared/components/filtro/filtro.component`) está sendo substituído pelo novo `<filtro>` (`src/shared/filtro/filtro/filtro.component`).

O novo filtro é autossuficiente: gerencia seu próprio estado interno, persistência em storage e inicialização — sem necessidade de chamar métodos imperativos pelo componente pai.

---

## Diferenças de API

### Inputs

| Input antigo (`app-filtro`) | Input novo (`filtro`) | Observação |
|---|---|---|
| `[config]` | `[config]` | Igual |
| `[visible]` | `[visible]` | Igual |
| `[externalLoading]` | `[loading]` | Renomeado |
| *(não existia)* | `[service]` | Serviço de filtro que antes era passado via `filtro.init()` |
| *(não existia)* | `[iconClass]` | Classe do ícone do campo de busca (default: `"magnify-icon"`) |
| *(não existia)* | `[disabled]` | Desabilita o filtro inteiro |

### Outputs

| Output antigo | Output novo | Observação |
|---|---|---|
| `(submit)` | `(submit)` | Emite o valor do formulário diretamente |
| `(resetList)` | `(resetList)` | Igual — o filtro já se reinicia internamente antes de emitir |
| `(changefilterStatus)` | `(changeFilterStatus)` | Disponível mas geralmente desnecessário |
| *(não existia)* | `(searchSubmit)` | Emite o texto do campo de busca rápida |

### Métodos do componente pai

| Antes | Depois |
|---|---|
| `filtro.init(service)` | Removido — passe o serviço via `[service]="filterService"` |
| `filtro.mediator.getCompleteRequest()` | `filtro.value<TipoDoRequest>()` |
| `filtro.mediator.counter()` | `filtro.counter()` |
| `filtro.mediator.reset()` | Removido — o filtro se reinicia sozinho ao emitir `(resetList)` |
| `filtro.aplicado` | `filtro.aplicado` — igual |
| `filtro.updateStorage()` | `filtro.updateStorage()` — igual (usar antes de navegar) |
| `filtro.routeChange = true` | `filtro.routeChange = true` — igual (usar antes de navegar) |
| `filtro.getTagsData()` | `filtro.getTagsData()` — igual |

---

## Passo a Passo da Migração

### 1. Atualizar o import do `FiltroComponent`

```ts
// Remover
import { FiltroComponent } from 'src/shared/components/filtro/filtro.component';

// Adicionar
import { FiltroComponent } from 'src/shared/filtro/filtro/filtro.component';
```

### 2. Tornar o serviço de filtro público

O serviço precisa ser acessível no template via `[service]`:

```ts
// Antes
constructor(private filterService: MeuFiltroService, ...) {}

// Depois
constructor(public filterService: MeuFiltroService, ...) {}
```

### 3. Atualizar o tipo do `@ViewChild`

```ts
// Antes
@ViewChild('filtro') filtro: FiltroComponent;

// Depois
@ViewChild('filtro') filtro: FiltroComponent<any>;
```

### 4. Remover `checkFilter()` e `filtro.init()` do `ngOnInit`

O novo filtro se inicializa sozinho. Use `ngAfterViewInit` para reagir ao estado inicial:

```ts
// Antes
async ngOnInit(): Promise<void> {
  await this.checkFilter();   // ← remover
  this.filtro.init(this.filterService);  // ← remover
  // ... resto do ngOnInit
}

checkFilter(): Promise<void> { ... }  // ← remover o método inteiro

// Depois
ngOnInit(): void {
  // apenas o que não depende do filtro
  this.envioForm = new FormGroup({});
  this.getRedes();
}

ngAfterViewInit(): void {
  setTimeout(() => {
    this.showFilter = !this.filtro.aplicado;
    this.loadingList = this.filtro.aplicado;
    // Se o filtro já estava aplicado (storage), o próprio filtro
    // emitirá (submit) automaticamente após ~400ms
  });
}
```

> **Nota:** O novo filtro faz auto-submit quando `aplicado === true` (restaurado do storage). O `loadingList = this.filtro.aplicado` apenas garante que o loader apareça enquanto isso acontece.

### 5. Atualizar `aplicarFiltro()`

```ts
// Antes
aplicarFiltro() {
  const request = this.filtro.mediator.getCompleteRequest() as MeuRequest;
  // ...
}

// Depois
aplicarFiltro(_?: Event) {
  const request = this.filtro.value<MeuRequest>();
  // ...
}
```

### 6. Simplificar `reset()`

O novo filtro já se reinicia internamente antes de emitir `(resetList)`. O método no pai só precisa limpar o estado local:

```ts
// Antes
reset() {
  this.filtro.mediator.reset();   // ← remover
  this.filtro.init(this.filter);  // ← remover
  this.lista = [];
}

// Depois
reset() {
  this.lista = [];
}
```

### 7. Atualizar o counter no template

```html
<!-- Antes -->
[counter]="filtro?.mediator?.counter() || 0"

<!-- Depois -->
[counter]="filtro?.counter() || 0"
```

### 8. Substituir o HTML do filtro

```html
<!-- Antes -->
<app-filtro
  #filtro
  [visible]="showFilter"
  [config]="filterConfig"
  [externalLoading]="loading || loadingList"
  (submit)="aplicarFiltro()"
  (changefilterStatus)="changeFilterStatus()"
  (resetList)="reset()"
>
</app-filtro>

<!-- Depois -->
<filtro
  #filtro
  [service]="filterService"
  [visible]="showFilter"
  [config]="filterConfig"
  [loading]="loading || loadingList"
  (submit)="aplicarFiltro($event)"
  (resetList)="reset()"
>
</filtro>
```

---

## Navegação com estado (routeState)

Antes de navegar para outra rota mantendo o estado do filtro, use:

```ts
selecionarItem(item: any) {
  this.filtro.routeChange = true;
  this.filtro.updateStorage();

  const routeData = {
    filter: this.filtro.value(),
    tagData: this.filtro.getTagsData(),
    item,
  };
  this.routeState.set(MeuComponent.name, routeData);
  this.router.navigate([rota]);
}
```

---

## Busca rápida (campo de busca no filtro)

Se a `FilterConfig` tiver `showSearchField: true`, o novo filtro exibe um campo de busca embutido. Para reagir à digitação:

```html
<filtro
  ...
  (searchSubmit)="onSearch($event)"
>
```

```ts
search: string = null;

onSearch(term: string) {
  this.search = term;
}

get filtered() {
  if (!this.search) return this.lista;
  const termo = this.search.toLowerCase();
  return this.lista.filter(x => x.nome.toLowerCase().includes(termo));
}
```

---

## Adições necessárias ao `FilterConfig`

O novo filtro usa `config.id` para persistência em storage. Certifique-se de que a config tem:

```ts
export const meuFiltroConfig: FilterConfig = {
  id: 'identificador_unico_do_filtro',  // obrigatório
  storeConfig: {
    ativo: true,
    tempoDeValidade: 10,      // minutos
    filtroPorUsuario: true,
    storeName: 'identificador_unico_do_filtro',
  },
  // ...
};
```
