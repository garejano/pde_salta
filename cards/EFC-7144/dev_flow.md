# Análise — `app-document-editor` (`/exemplos/document-editor`)

Repositório: `estrutura-pedagogica`, branch `projetos/MigracaoDocPed`
Pasta: `frontend/src/app/features/exemplos/document-editor/`

## O que é

Editor visual de blocos: monta um documento arrastando/configurando os **mesmos componentes reais
de produção** do `document-builder` (`DocHeaderComponent`, `DocSectionComponent`,
`DocTableComponent` etc.), sem escrever código. É o protótipo que valida a ideia central do card
EFC-7144 — mas hoje é só isso, um protótipo: **nada é persistido**, tudo vive em memória da sessão
do componente.

## Árvore de componentes

```
DocumentEditorComponent (orquestrador, providers: [DocumentEditorStateService])
├── app-block-library     (rail esquerda)  — catálogo de blocos disponíveis, com busca
├── app-editor-canvas     (centro)         — a "folha" do documento, drag & drop
└── app-block-inspector   (rail direita)   — formulário de config do doc ou do bloco selecionado
```

Três modos de visualização da área central (`canvasMode`): **edit** (canvas editável),
**preview** (`DocumentViewerComponent` real, paginado) e **json** (`DocumentDefinition` bruto,
útil para debug/cópia).

## Estado — `DocumentEditorStateService`

`@Injectable()` **sem `providedIn: 'root'`** — listado em `providers` do próprio
`DocumentEditorComponent`, ou seja, uma instância nova a cada vez que a rota é aberta. Estado é um
único `BehaviorSubject<EditorDocument>`, atualizado sempre por `_update(fn)` com spread imutável
(`addBlock`, `removeBlock`, `moveBlock`, `reorderBlocks`, `duplicateBlock`, `updateBlockData`,
`updateConfig`, `updateHeaderData`, `setName`). `EditorDocument` é só:

```typescript
interface EditorDocument {
  name: string
  config: DocumentConfig          // mesmo DocumentConfig do document-builder
  headerData: DocHeaderData
  blocks: EditorBlock[]           // { id, type: BlockType, label, data: unknown }
}
```

`toDocumentDefinition()` é a ponte para o motor real: mapeia cada `EditorBlock` para um
`DocumentEntry` (resolvendo `componentType` via `BlockRegistryService`) e devolve exatamente o
formato que `DocumentViewerComponent` consome (`{ config, headerData, entries }`) — é o que
alimenta o modo preview, o `viewer` de impressão/PDF e o modo JSON.

## Catálogo de blocos — `BlockRegistryService`

`providedIn: 'root'`, mas o catálogo (`REGISTRY`) é um **objeto fixo no código**, exatamente como o
`resumo_documento_generico.md` já diagnosticava. Hoje cobre **7 tipos de bloco**:

| Tipo | Componente real | Categoria |
|---|---|---|
| `header` | `DocHeaderComponent` | identification |
| `section` | `DocSectionComponent` | identification |
| `statement` | `DocStatementComponent` | content |
| `info-row` | `DocInfoRowComponent` | identification |
| `table` | `DocTableComponent` | data |
| `presenca-info` | `DocPresencaInfoComponent` | identification |
| `info-grid` | `DocInfoGridComponent` | identification |

Contra os ~25 blocos reais já existentes em produção (ver análise de produto) — confirma o gap já
mapeado: a maior parte do catálogo real do `document-builder` ainda não está disponível no editor.

`BlockRegistryService` também faz o caminho inverso: `fromEntries()` reconstrói um `EditorDocument`
a partir de um `DocumentEntry[]` real (usado pela galeria `/exemplos/documents` para abrir um
documento de exemplo no editor), mas só funciona se **todo** componente do documento estiver
registrado (`canImport()`) — é exatamente a regra "só pode nascer no editor se todos os blocos
forem de config fixa" do desenho do `IGenericDocument`, já implementada aqui de forma implícita.

## Preview ao vivo — `EditorCanvasComponent`

Cada bloco no canvas é renderizado com `*ngComponentOutlet` apontando pro `componentType` real do
registry, com inputs resolvidos dinamicamente por `getBlockInputs()` — mesma técnica de
`reflectComponentType()` + "quais inputs opcionais o componente aceita" que o
`DocumentViewerComponent.createEntryComponent()` usa no motor de renderização (ver
`analise-solid-document-builder.md`, item 1). É **a mesma lógica duplicada numa terceira cópia**,
fora do motor — um candidato natural a reaproveitar o mesmo helper quando esse código for
compartilhado entre editor e motor.

Drag & drop é via `@angular/cdk/drag-drop` (`cdkDropList`/`cdkDrag`), emitindo a lista reordenada
pro state service — mesmo padrão já usado em `DocBlockReorderComponent` do `document-builder`
(ver README do document-builder).

## Formulário de configuração — `BlockInspectorComponent`

**Achado mais relevante para o roadmap do card:** o inspector não é genérico — é um
`*ngIf="selectedBlock.type === '...'"` por tipo de bloco, cada um com seu próprio método
`patchXxx()` e seu próprio markup no `.html` (`patchHeader`, `patchSection`, `patchStatement`,
`patchInfoField`/`addInfoField`/`removeInfoField`, `patchColumn`/`addColumn`/`addRow`/..., etc. —
170 linhas de TS + ~400 de HTML, cresce linearmente com o catálogo).

Isso significa que **registrar um bloco novo no editor hoje exige tocar 2 lugares**, não 1:
1. `BlockRegistryService` (registrar `componentType` + `defaultData`) — genérico, sem código extra.
2. `BlockInspectorComponent` (`.ts` + `.html`) — form **hardcoded** por tipo, sem genérico nenhum.

É a evidência concreta, no código, do motivo de existir a proposta `IBlocoConfigEditor` na análise
de SOLID do `document-builder` (contrato mínimo `config` + `configChange` plugável no inspector):
hoje o Carômetro já tem um painel de config próprio fora desse fluxo
(`DocCarometroConfigPanelComponent`), e o editor de blocos tem o seu outro, incompatível — cada
bloco novo de verdade (não um dos 7 já cobertos) precisaria escrever um terceiro.

## Persistência — não existe

- `DocumentEditorStateService`: escopo do componente, perdido a cada saída da rota.
- `DocumentImportService` (`providedIn: 'root'`): não é persistência, é só uma **caixa de
  transferência em memória** (`stage()`/`takePending()`, um valor por vez) — usada pela galeria
  `/exemplos/documents` para passar um `EditorDocument` pro editor via navegação
  (`documents.component.ts:895` → `ngOnInit()` do editor). Confirma, no código, o achado já
  registrado em `resumo_documento_generico.md`: "o loop Documento → Editor já existe, só falta
  persistir".
- Não há nenhuma chamada HTTP em todo o módulo — zero por design, é 100% front-end por enquanto.

## Impressão / PDF

Reaproveita o `DocumentViewerComponent` real, sem nenhuma lógica própria de paginação:
- **Preview** (`canvasMode === 'preview'`): `#inlineViewer`, inicializado sob demanda (`setTimeout`
  + `.init()`), com botão "Gerar PDF" chamando `saveFromPreview()` → `inlineViewer.save(doc.name)`.
- **Impressão/PDF "silenciosa"** (botões do topbar, sempre disponíveis): `printSilent()`/
  `saveSilent()` montam o `DocumentDefinition`, abrem um `<app-print-overlay silent>` com um
  `#viewer` dedicado dentro, chamam `.init()` + `.print()`/`.save()`, e fecham o overlay no
  `finally` — evita manter uma segunda instância cara do viewer sempre montada.

## Resumo do gap vs. o roadmap do card EFC-7144

| Peça do roadmap (ver descrição do card) | Estado neste protótipo |
|---|---|
| `BlocoTipo` persistido | Não — `REGISTRY` fixo no código, 7/~25 blocos |
| `DocumentoTipo` persistido | Não — não existe o conceito, só a lista de blocos do editor |
| `Documento` com existência própria | Não — `EditorDocument` só em `BehaviorSubject` de escopo de componente |
| `IGenericDocument` | Implícito — `toDocumentDefinition()` + regra `canImport()` já fazem exatamente isso, só não está formalizado como interface nomeada |
| `IBlocoConfigEditor` | Não — `BlockInspectorComponent` hardcoded por tipo; maior ponto de atrito pra crescer o catálogo |
| `IBlocoDefinicao` (`montar(config, dado)`) | Não — `getBlockInputs()` do `EditorCanvasComponent` é o embrião disso, mas vive só no editor, não reaproveitável pelo motor |

Conclusão prática: este protótipo já **prova** a viabilidade de `IGenericDocument` (o caminho
"editor → `DocumentEntry[]` → `DocumentViewer`" funciona de ponta a ponta). O próximo passo de
maior alavancagem, olhando só para este componente, não é a persistência em si — é resolver o
`IBlocoConfigEditor`, porque é o que hoje trava o catálogo em 7 blocos: sem ele, cada bloco novo
continua exigindo um `*ngIf` + método + markup a mais no inspector, não importa se o catálogo
subjacente (`BlocoTipo`) já estiver persistido ou não.
