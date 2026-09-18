# Dia Letivo Extra — Visão Geral da Tela

**Repositório:** `estrutura-pedagogica`
**Rota:** `/dia-letivo-extra/listar`
**Componente principal:** `DiaLetivoExtraListarComponent` (`app-listar-dia-letivo-extra`)

---

## Estrutura da tela

### Tab Navigator
`TabPeriodoLetivoComponent` no topo — permite navegar entre abas do período letivo (compartilhado com outras telas do módulo).

### Filtro
Usa `FiltroComponent` (genérico do projeto). Campos configurados em `filtro_dia_letivo_extra.ts`:
- **Ano Letivo** — autostart, obrigatório
- **Rede** — depende do ano letivo, obrigatório
- **Escola** — multi-select, opcional

O botão "Exportar" fica dentro do filtro e chama `FiltroDiaLetivoExtraService.export()` (gera Excel).

### Tabela
Exibida **somente após o filtro ser aplicado** e ter retornado dados.

Colunas: `Data` | `Escola` | `Título` | `Turmas` | Ações

Cada linha tem um botão **"Ver/Editar"** que abre o modal de formulário no modo edição.

A tabela tem paginação (`PaginacaoComponent`) — 30 itens por página.

### Barra de salvar
`SalvarComponent` fixo no rodapé. Tem o botão **"Novo Dia Letivo Extra"**, que fica **habilitado apenas após o filtro ser aplicado**. Abre o modal no modo criação.

---

## Formulário (modal)

**Componente:** `FormularioDiaLetivoExtraComponent` (`app-formulario-dia-letivo-extra`)
**Emite:** `updateList`, `deleteEvent`

O mesmo componente serve para **criar** e **editar** — o modo é determinado pela chamada ao método `start()` (criação) ou `startEdit(hash)` (edição).

### Campos do formulário

| Campo | Comportamento |
|---|---|
| Escola | Select (desabilitado no modo edição) |
| Data | Date picker com min/max validados pelo ano letivo da escola |
| Título | Text field |
| Descrição | Textarea |

### Seleção de Turmas e Frentes

Parte mais complexa do formulário:

1. Ao selecionar escola + data, o sistema carrega as turmas disponíveis via `DiaLetivoExtraService.getFormulario()`.
2. O usuário pode filtrar turmas por **Turno** e **Série**.
3. Para cada turma, as **frentes (disciplinas)** são listadas.
4. Frentes que já possuem aula agendada para aquela data ficam **bloqueadas** (não selecionáveis).
5. No modo edição, as frentes já salvas são pré-selecionadas; o sistema guarda esse estado para diferenciar itens bloqueados por outra aula vs. bloqueados pela própria edição atual.
6. Existe botão **"Selecionar todas as turmas visíveis"** (respeita os filtros de turno/série ativos).

### Salvar
Chama `DiaLetivoExtraService.save()` com payload `DiaLetivoExtraSaveRequest` contendo as turmas e frentes selecionadas.

### Excluir (inativar)
Abre diálogo de confirmação antes de chamar `DiaLetivoExtraService.inativar(hash)`. É um **soft delete**.

---

## Serviços

| Serviço | Método | Descrição |
|---|---|---|
| `DiaLetivoExtraService` | `get()` | Lista paginada com filtros |
| | `save()` | Criar ou atualizar |
| | `getFormulario(hash)` | Dados de edição (turmas, frentes, estado atual) |
| | `inativar(hash)` | Soft delete |
| `FiltroDiaLetivoExtraService` | `anosLetivos`, `redes`, `escolas` | Opções do filtro |
| | `export()` | Gera blob Excel |

---

## Fluxo principal

```
Usuário aplica filtro
  └─ getLista() → DiaLetivoExtraService.get() → renderiza tabela paginada

Clicar "Novo Dia Letivo Extra"
  └─ formulario.start() → modal abre vazio → usuário preenche → save()
       └─ emite updateList → lista é recarregada

Clicar "Ver/Editar" em uma linha
  └─ formulario.startEdit(hash)
       └─ DiaLetivoExtraService.getFormulario(hash) → modal abre pré-preenchido
       └─ save() ou inativar() → emite updateList / deleteEvent → lista é recarregada
```

---

## Observações para melhorias futuras

- A lógica de bloqueio de frentes (disciplinas já com aula) está encapsulada no componente de formulário — pode ser extraída para um helper/service se crescer.
- O `start()` e `startEdit()` controlam o estado modal via flags internas do componente — padrão comum no projeto, sem NgRx.
- O filtro usa o padrão genérico `FiltroComponent` + service de filtro dedicado, igual ao restante do projeto.
