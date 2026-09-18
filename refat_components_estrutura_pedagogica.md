# Refatoração — Uso de Shared Components (estrutura-pedagogica)

repositório: `estrutura-pedagogica`

## Objetivo

Padronizar o uso de componentes `shared/components` e `shared/dynamic-components` em todos os templates Angular do projeto, eliminando variações de CSS e comportamentos distintos causados por elementos HTML crus duplicados.

---

## Contexto

### Componentes disponíveis

#### `shared/components` — uso direto em template

| Seletor | Pasta | Uso principal |
|---|---|---|
| `<app-button>` | button | Botões de ação |
| `<app-card-info>` | card-info | Cards informativos |
| `<app-card-message>` | card-message | Mensagens em card |
| `<app-circle-icon-button>` | circle-icon-button | Botões circulares com ícone |
| `<date-field>` | date-field | Campo de data (standalone) |
| `<app-datepicker>` | datepicker | Seletor de data configurável |
| `<app-dropdown-actions>` | dropdown-actions | Menu de ações dropdown |
| `<app-filtro>` | filtro | Componente de filtro paginado |
| `<app-icon-button>` | icon-button | Botão apenas com ícone |
| `<app-listbox-transfer>` | listbox-transfer | Transferência de itens entre listas |
| `<app-loading>` | loading | Indicador de carregamento |
| `<app-modal>` | modal | Modal/dialog |
| `<multi-select>` | multi-select | Seleção múltipla (standalone) |
| `<app-paginacao>` | paginacao | Paginação de lista |
| `<app-salvar>` | salvar | Botões salvar/cancelar |
| `<app-search-field>` | search-field | Campo de busca |
| `<single-select>` | select-field | Select simples (standalone) |
| `<app-sem-conteudo>` | sem-conteudo | Estado vazio |
| `<app-side-panel>` | side-panel | Painel lateral deslizante |
| `<app-skeleton-text>` | skeleton-text | Placeholder de carregamento |
| `<app-table-loader>` | table-loader | Skeleton de tabela com animação de entrada nas linhas |
| `<app-tab-navigator>` | tab-navigator | Abas de navegação |
| `<app-titulo-page>` | titulo-page | Título de página (com breadcrumb) |
| `<app-titulo-tela>` | titulo-tela | Título de tela |
| `<app-toggle-buttons>` | toggle-buttons | Grupo de botões toggle |
| `<app-tooltip>` | tooltip | Tooltip |
| `<app-turno-radio-select>` | turno-radio-select | Seleção de turno por radio |
| `<app-view-toggle>` | view-toggle | Toggle de visualização |

#### `shared/dynamic-components` — campos de formulário reativos

| Seletor | Pasta |
|---|---|
| `<app-checkbox>` | checkbox |
| `<app-custom-radio>` | custom-radio |
| `<app-date-field>` | date-field |
| `<app-files-field>` | files-field |
| `<app-money-field>` | money-field |
| `<app-multi-select-field>` | multi-select-field |
| `<app-number-field>` | number-field |
| `<app-radio-field>` | radio-field |
| `<app-select-field>` | select-field |
| `<app-textarea-field>` | textarea-field |
| `<app-text-field>` / `<text-field>` | text-field |
| `<app-time-field>` | time-field |
| `<app-toggle>` | toggle |

> **Nota:** `dynamic-components` foram criados primariamente para injeção dinâmica, mas hoje podem ser usados diretamente em templates também.

---

## Artefatos

### 1. Script de análise

`_scripts/refat_shared_components/analyze_shared_usage.py`

Execução:
```powershell
cd C:\projects\pde_salta\_scripts\refat_shared_components
python analyze_shared_usage.py
```

Gera em `_scripts/refat_shared_components/output/`:
- `shared_usage.md` — quais telas usam cada componente shared
- `raw_html_candidates.md` — telas com HTML cru substituível + sugestões
- `catalog.json` — catálogo de seletores usado pela skill

### 2. Skill de refatoração

`estrutura-pedagogica/.claude/commands/refatorar-shared-components.md`

Invocada via `/refatorar-shared-components` no contexto do repo `estrutura-pedagogica`.

Fluxo em 2 passos:
1. **Analisar** — lê o template, identifica substituições, cria `_scripts/refat_shared_components/plans/<componente>_refat_core_components.md`
2. **Aplicar** — executa as substituições após confirmação do usuário

---

## Plano de execução

Execute cada passo na ordem. Cada um é independente e pode ser solicitado separadamente.

| # | Passo | Status |
|---|---|---|
| 1 | Rodar o script de análise para gerar os relatórios | pendente |
| 2 | Revisar `output/shared_usage.md` — entender cobertura atual | pendente |
| 3 | Revisar `output/raw_html_candidates.md` — priorizar telas com mais substituições | pendente |
| 4 | Para cada tela prioritária: invocar `/refatorar-shared-components <path>` | pendente |
| 5 | Verificar build após cada refatoração | pendente |

---

## Observações

- Ao gerar HTML em qualquer componente do `estrutura-pedagogica`, sempre priorizar os seletores da tabela acima.
- Nunca substituir elementos que fazem parte de bibliotecas terceiras (PrimeNG, ng-select, etc.).
- Preservar toda lógica TypeScript durante refatoração — alterações são apenas de template + imports.
