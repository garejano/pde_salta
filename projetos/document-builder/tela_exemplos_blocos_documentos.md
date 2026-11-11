# Tela de Exemplos — Blocos do Document-Builder

**Repo:** `estrutura-pedagogica`  
**Módulo alvo:** `src/app/features/exemplos/`  
**Componentes fonte:** `src/shared/document-builder/components/`

## Objetivo

Criar uma tela dentro do módulo `exemplos` que sirva de guia/catálogo para o desenvolvedor. Ela deve listar todos os blocos disponíveis no document-builder, com exemplo visual de cada um e status de documentação.

---

## Localização sugerida

```
src/app/features/exemplos/
  document-builder-blocks/          ← nova tela
    document-builder-blocks.component.ts
    document-builder-blocks.component.html
    document-builder-blocks.component.scss
    blocks/                          ← um sub-componente por bloco (ou por grupo)
      exemplo-doc-text/
      exemplo-doc-table/
      ...
```

Registrar rota em `exemplos-routing.module.ts`:
```ts
{ path: 'document-builder-blocks', component: DocumentBuilderBlocksComponent }
```

Adicionar card no `exemplos-dashboard` apontando para essa rota.

---

## Inventário de componentes

Legenda de status:
- `[ ]` — exemplo ainda não criado
- `[x]` — exemplo criado na tela

### Estrutura do documento (containers e layout)

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[ ]` | `app-document-viewer` | `document-viewer` | Renderizador principal; gerencia paginação e impressão |
| `[ ]` | `app-document-page` | `document-page` | Container de uma página |
| `[ ]` | `app-document-config-panel` | `document-config-panel` | Painel global: orientação, margens, fontes |
| `[ ]` | `app-document-debug` | `document-debug` | Overlay de debug com métricas de layout |
| `[ ]` | `app-document-carousel-overlay` | `document-carousel-overlay` | Visualização em carrossel com navegação |

### Cabeçalho, rodapé e moldura

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[x]` | `app-doc-header` | `doc-header` | Cabeçalho com nome da instituição, endereço, contato |
| `[x]` | `app-doc-footer` | `doc-footer` | Rodapé com numeração de página |
| `[ ]` | `app-doc-frame` | `doc-frame` | Borda/moldura decorativa |
| `[x]` | `app-doc-signature` | `doc-signature` | Linhas de assinatura com cargos e data |

### Texto e títulos

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[x]` | `app-doc-title` | `doc-title` | Título de seção (com borda opcional) |
| `[x]` | `app-doc-section` | `doc-section` | Cabeçalho de subseção |
| `[x]` | `app-doc-text` | `doc-text` | Bloco de texto simples |
| `[x]` | `app-doc-text-field` | `doc-text-field` | Campo de texto com borda (área de resposta/observação) |
| `[x]` | `app-doc-statement` | `doc-statement` | Bloco de declaração/citação com recuo |
| `[x]` | `app-doc-legend` | `doc-legend` | Legenda de símbolos/indicadores |

### Informações e metadados

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[x]` | `app-doc-info-grid` | `doc-info-grid` | Grid de chave-valor (dados do aluno/turma) |
| `[x]` | `app-doc-info-row` | `doc-info-row` | Linha única de campos de informação |
| `[ ]` | `app-doc-info-frequencia` | `doc-info-frequencia` | Painel de resumo de frequência |
| `[ ]` | `app-doc-presenca-info` | `doc-presenca-info` | Painel de informações de presença |

### Tabelas

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[ ]` | `app-doc-table` | `doc-table` | Tabela padrão com cabeçalho por linha/coluna; suporta quebra por linhas |
| `[ ]` | `app-doc-wide-table` | `doc-wide-table` | Tabela que quebra em linhas E colunas (ex: matriz de chamada) |

### Grids gerados por dados (ColumnSplittable)

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[ ]` | `app-doc-grid-conteudo` | `doc-grid-conteudo` | Grade de registro de aulas (Data, Conteúdo, Atividades) |
| `[ ]` | `app-doc-grid-diario` | `doc-grid-diario` | Grade de chamada/diário de classe (alunos × datas) |
| `[ ]` | `app-doc-grid-rendimento` | `doc-grid-rendimento` | Grade de boletim/rendimento escolar |

### Carômetro

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[ ]` | `app-doc-carometro-card` | `doc-carometro-card` | Card individual do aluno (foto/iniciais) |
| `[ ]` | `app-doc-carometro-grid` | `doc-carometro-grid` | Grid de cards do carômetro (splittable) |
| `[ ]` | `app-doc-carometro-info` | `doc-carometro-info` | Painel de metadados do carômetro |
| `[ ]` | `app-doc-carometro-variant-picker` | `doc-carometro-variant-picker` | Seletor de variante de layout do card (0, B, C, E, J, K, L) |
| `[ ]` | `app-doc-carometro-config-panel` | `doc-carometro-config-panel` | Painel de configuração (colunas, espaçamento, visibilidade) |

### Painéis de configuração

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[ ]` | `app-doc-diario-config-panel` | `doc-diario-config-panel` | Config do diário de classe (seções, códigos de presença) |

### Utilitários

| Status | Seletor | Componente | Descrição |
|--------|---------|------------|-----------|
| `[ ]` | `app-minimize-pages` | `minimize-pages` | Otimizador de número de páginas |
| `[ ]` | `app-print-overlay` | `print-overlay` | Dialog de impressão/salvar |

---

## Como atualizar o status

Quando um exemplo for criado, mudar `[ ]` para `[x]` na tabela correspondente.

**Resumo de progresso** (atualizar manualmente ou com grep):
```
Total de componentes: 32
Com exemplo: 9
Pendentes:   23
```

---

## Contexto existente no módulo exemplos

Já existe no módulo `exemplos`:
- `document-builder-tour` — tour guiado geral
- `document-builder-ia-guide` — guia de uso com IA
- `document-editor` — editor de blocos completo
- `carometro-exemplo` — exemplo de carômetro
- `diario-classe-exemplo` — exemplo de diário de classe
- Documentos completos: ata, boletim, certificado, comunicado, declaração, histórico, plano de aula, relatório pedagógico

A nova tela é diferente: foca nos **blocos individuais** (um por um, com props e variações), não em documentos completos montados.
