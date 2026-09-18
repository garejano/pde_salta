# table-loader — Skeleton + Wrapper para Tabelas

**Repositório:** `estrutura-pedagogica`  
**Pasta:** `frontend/src/shared/components/table-loader/`  
**Seletor:** `<app-table-loader>`  
**Prototype de referência:** `table_loader/claude-design/Table Loader.html`

---

## Objetivo

Servir de casca para tabelas Angular com duas responsabilidades combinadas:

1. **Skeleton de loading** — imita a estrutura da tabela com shimmer enquanto os dados carregam, e anima a entrada das linhas reais quando o loading termina.
2. **Wrapper com scroll interno e header fixo** — quando `maxHeight` é definido, o componente cria um container com `overflow-y: auto` e aplica `position: sticky` no thead automaticamente.

---

## API do componente

| Input | Tipo | Padrão | Descrição |
|---|---|---|---|
| `loading` | `boolean` | `true` | `true` → exibe skeleton; `false` → projeta o conteúdo real |
| `qtLinhas` | `number` | `7` | Linhas de skeleton durante o loading |
| `qtColunas` | `number` | `4` | Colunas de skeleton (não inclui a coluna de ação) |
| `actionButton` | `boolean` | `false` | Coluna extra à direita — skeleton de botão no loading |
| `animacao` | `boolean` | `true` | Anima a entrada das linhas reais (`rowIn`, stagger de 45ms por linha) |
| `maxHeight` | `string` | `'none'` | Ativa scroll interno + header sticky. Ex: `'400px'`, `'60vh'` |

---

## Comportamento

### Estado loading (`loading = true`)
- Header: skeletons com shimmer por coluna
- Body: `qtLinhas` × `qtColunas` células skeleton
- Se `actionButton = true`: última célula exibe skeleton de botão (34px × 108px)
- Se `maxHeight` definido: skeleton já renderiza dentro do scroll container com header sticky

### Transição loading → loaded (`loading = false`)
- Header passa a exibir labels reais (do `ng-content`)
- Se `animacao = true`: cada linha recebe `rowIn 360ms cubic-bezier(0.16,1,0.3,1)` com delay de `i × 45ms`

### Scroll + header fixo (`maxHeight !== 'none'`)
- Ambas as tabelas (skeleton e content) ficam dentro de `<div class="tl-scroll">`
- `.tl-scroll` tem `overflow-y: auto; overflow-x: auto; max-height: [valor]`
- `thead tr` recebe `position: sticky; top: 0; z-index: 2` automaticamente
- Scrollbar customizada (padrão do projeto: 6px, thumb `#65686e`)

### Animações (CSS — definidas no componente)
```css
@keyframes tl-shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
@keyframes rowIn      { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
```

---

## Uso

### Básico (sem scroll)
```html
<app-table-loader [loading]="isLoading" [qtLinhas]="7" [qtColunas]="4" [actionButton]="true">
  <thead>
    <tr>
      <th>Turma</th><th>Série</th><th>Turno</th><th>Escola</th><th></th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let item of items; let i = index" [class.tl-odd]="i % 2 !== 0">
      <td>{{ item.turma }}</td>
      <td>{{ item.serie }}</td>
      <td>{{ item.turno }}</td>
      <td>{{ item.escola }}</td>
      <td><button>Ver/Editar</button></td>
    </tr>
  </tbody>
</app-table-loader>
```

### Com scroll interno e header fixo
```html
<app-table-loader
  [loading]="isLoading"
  [qtLinhas]="10"
  [qtColunas]="4"
  maxHeight="400px">
  <thead>...</thead>
  <tbody>...</tbody>
</app-table-loader>
```

### Classe auxiliar para linhas alternadas
O componente usa `ViewEncapsulation.None`. A classe `.tl-odd` estiliza a linha com fundo `#f8f9fb`:
```html
<tr *ngFor="let item of items; let i = index" [class.tl-odd]="i % 2 !== 0">
```

---

## Implementação

**Componente:** `standalone: false`, declarado e exportado no `SharedModule`  
**Encapsulamento:** `ViewEncapsulation.None` — estilos aplicam ao `ng-content` projetado  
**Animação:** aplicada via `ElementRef.querySelectorAll('tbody tr')` no `ngOnChanges` quando `loading` passa de `true` para `false`

---

## Onde está em uso

| Local | Uso |
|---|---|
| `/diario-de-classe/listar` | Substituiu `<app-loading>` — skeleton inicial antes do filtro ser aplicado |
| `/exemplos/table-loader` | Demo interativa com todos os inputs configuráveis (incluindo toggle de scroll) |

---

## Notas

- O componente **não estiliza** o thead/tbody real por padrão além do fundo do header (`.tl-content thead tr { background: #c3c8d1 }`). Padding, bordas e cores das células ficam a cargo do componente pai ou de estilos globais.
- `position: sticky` + `border-collapse: collapse` funciona no projeto (o mesmo padrão já está em `.lista-sticky` / `table.scss`).
- Para tabelas sem `ng-content` (ex: placeholder puro), o componente renderiza uma `<table>` vazia quando `loading = false` — sem impacto visual.
