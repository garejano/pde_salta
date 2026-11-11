# Análise — SOLID mínimo no `document-editor`, em coerência com o `document-builder`

Repositório: `estrutura-pedagogica`, branch `projetos/MigracaoDocPed`
Base: `analise-solid-document-builder.md` (motor) + `dev_flow.md` (mapeamento do editor)

## Princípio orientador

`document-builder` (motor) e `document-editor` (protótipo de edição) **não são dois produtos
separados** — são as duas pontas do mesmo objetivo do card EFC-7144: um documento final tem que
poder nascer tanto de código escrito por dev (`IDocumento` — Certificado, Histórico, Diário) quanto
de um usuário montando blocos na tela (`IGenericDocument` — este editor). Qualquer correção de
SOLID feita só dentro do editor, sem olhar pro motor, corre o risco de criar uma segunda versão,
incompatível, da mesma lógica — que é exatamente o que já aconteceu uma vez (ver achado abaixo).

**Regra prática para todo item desta análise:** se uma abstração nova serve tanto para renderizar
um documento fixo quanto um documento genérico, ela entra em `shared/document-builder/`, nunca em
`features/exemplos/document-editor/`. O editor consome o motor; não deveria reimplementar pedaço
nenhum dele.

## Achado que motiva a prioridade #1: a mesma lógica já está duplicada **3 vezes**

A análise de SOLID do motor (item 1) já tinha corrigido 4 cópias da lógica "criar `ComponentRef` +
descobrir quais inputs opcionais o componente aceita via `reflectComponentType`" dentro do
`DocumentViewerComponent`, unificando em `createEntryComponent()`. O mapeamento do editor
(`dev_flow.md`) encontrou que **essa mesma lógica existe de novo**, independente, em
`EditorCanvasComponent.getBlockInputs()` — com seu próprio cache (`inputNameCache`), sem nenhuma
relação com o `createEntryComponent()` do motor. Ou seja: hoje existem **duas fontes de verdade**
sobre "quais inputs um componente de bloco aceita", uma no motor e uma no editor, que podem divergir
silenciosamente se uma for atualizada e a outra não.

Isso é o problema central a resolver — não é só um "SOLID por SOLID", é a garantia de que editor e
motor sempre concordam sobre como instanciar um bloco.

## Violações e correções mínimas, por alavancagem

### 1. OCP — o catálogo de blocos não é "add-only" (maior prioridade)

**Hoje:** `BlockRegistryService.REGISTRY` só sabe *renderizar* um bloco (`componentType` +
`defaultData`). Quem sabe *configurar* cada bloco é `BlockInspectorComponent`, com um
`*ngIf="selectedBlock.type === '...'"` + um método `patchXxx()` dedicado por tipo (170 linhas de
TS + ~400 de HTML hoje, para só 7 tipos). Registrar um bloco novo exige editar **dois** lugares
(registry + inspector), e o segundo não tem nada de genérico.

**Correção:** estender `BlockDef` (em `shared/document-builder/`, não no editor) com um segundo
`componentType` para configuração:

```typescript
export interface BlockDef<T = unknown> {
  type: BlockType
  label: string
  icon: string
  category: 'identification' | 'content' | 'data'
  componentType: Type<{ data: T }>            // já existe — renderização
  configComponentType: Type<IBlocoConfigEditor<T>>  // novo — formulário de configuração
  defaultData: T
}
```

Com um contrato mínimo, igual ao já proposto na análise do motor:

```typescript
export interface IBlocoConfigEditor<T = unknown> {
  config: T
  configChange: EventEmitter<T>
}
```

`BlockInspectorComponent` deixa de ter qualquer `*ngIf` por tipo — vira um shell genérico com
`ngComponentOutlet` (exatamente o padrão que `EditorCanvasComponent` já usa para a preview),
apontando pro `configComponentType` do bloco selecionado. Os 7 formulários hoje embutidos no
inspector viram 7 componentes pequenos (`HeaderConfigPanelComponent`,
`SectionConfigPanelComponent` etc.), cada um implementando `IBlocoConfigEditor` — migração mecânica,
sem mudar nenhum comportamento visual, um de cada vez.

**Por que isso importa para "fixo vs. genérico":** o Carômetro já tem hoje um painel de config
próprio (`DocCarometroConfigPanelComponent`), fora desse fluxo, construído à parte. Com
`IBlocoConfigEditor` formalizado em `shared/document-builder/`, esse painel (e qualquer config de
bloco escrito por dev para um documento fixo) passa a implementar o **mesmo contrato** que os
blocos do editor — um único jeito de "configurar um bloco", não um jeito pro editor e outro pra
documentos de dev.

**Prepara terreno para persistência sem reescrever nada:** quando `BlocoTipo` virar tabela (item já
no roadmap do card), o registry só precisa migrar de "objeto fixo" para "veio da API" — mas
`componentType`/`configComponentType` continuam sendo classes TypeScript resolvidas no código (não
dá pra guardar uma classe no banco). O que o banco guardaria é uma **chave string** (`type`) +
dado da instância; o mapeamento chave → classe continua sendo um registry no código, só que menor e
sem a parte de configuração hardcoded fora dele. Resolver o OCP agora não é trabalho perdido quando
a persistência chegar.

### 2. DRY/DIP — unificar a resolução de inputs num serviço compartilhado

**Correção:** extrair um `ComponentInputResolverService` em `shared/document-builder/services/`,
com cache por `componentType` (não por chamada):

```typescript
@Injectable({ providedIn: 'root' })
export class ComponentInputResolverService {
  private cache = new Map<Type<unknown>, Set<string>>();

  getInputNames(componentType: Type<unknown>): Set<string> {
    let names = this.cache.get(componentType);
    if (!names) {
      names = new Set(reflectComponentType(componentType as Parameters<typeof reflectComponentType>[0])?.inputs.map(i => i.propName) ?? []);
      this.cache.set(componentType, names);
    }
    return names;
  }
}
```

Consumido por `DocumentViewerComponent.createEntryComponent()` (motor) **e** por
`EditorCanvasComponent.getBlockInputs()` (editor) — elimina a 3ª cópia, e os dois caminhos (fixo e
genérico) passam a concordar sempre sobre quais inputs um bloco aceita.

**Ganho de performance de brinde:** hoje `createEntryComponent()` do motor chama
`reflectComponentType()` a cada entry, em toda medição e toda injeção no DOM (reflection não é
gratuito); só o editor tem cache. Unificar num serviço com cache por `componentType` corrige isso
nos dois lados — reflection roda uma vez por tipo de componente, não uma vez por entry/por página.

### 3. SRP — resolvido como consequência do item 1

Depois de extrair os config panels, `BlockInspectorComponent` sobra só com a orquestração de tabs
(`doc` vs `block`) e delegação — sem lógica de formulário nenhuma. Não é um item à parte, é o
resultado natural do item 1.

### 4. ISP — manter o contrato de config deliberadamente pequeno

`IBlocoConfigEditor` só tem `config`/`configChange` — nenhum bloco é forçado a implementar método
que não usa. Mesma filosofia já validada em `layout.models.ts` do motor (`Splittable`,
`TextMeasurable`, `ColumnSplittable`, `CellPaddingConfigurable` como interfaces pequenas e
independentes, cada uma com seu type guard) — não criar uma interface "grande" tipo
`IBloco { render(); configure(); validate(); export() }` só porque parece mais "completa".

### 5. DIP estrutural — fora do escopo "mínimo", mas não pode ser contradito agora

`DocumentEditorComponent` hoje orquestra o ciclo de vida do documento sozinho: pega
`toDocumentDefinition()` do state service e chama `viewer.init()`/`.print()`/`.save()` via
`@ViewChild` diretamente. Quando `DocumentoRuntime`/`IGenericDocument` existirem de verdade (roadmap
maior do card), o natural é o editor passar a *consumir* esse runtime em vez de orquestrar o
`DocumentViewerComponent` por conta própria — ficando no mesmo trilho que um documento fixo
(`IDocumento`) vai seguir.

**Não fazer isso agora** — depende de peças do roadmap que ainda não existem (persistência de
`Documento`, o próprio `DocumentoRuntime`). Mas os itens 1 e 2 acima **não podem dificultar** essa
migração futura: por isso os novos contratos (`IBlocoConfigEditor`, `ComponentInputResolverService`)
vão para `shared/document-builder/`, não para dentro do editor — já nascem no lugar certo pra serem
reaproveitados pelo `DocumentoRuntime` quando ele existir.

## O que não fazer agora (explicitamente fora do escopo "mínimo")

- **Persistir `BlocoTipo`/`DocumentoTipo`** — ortogonal a estes fixes; eles só preparam o terreno
  (ver nota no item 1), não dependem um do outro pra entregar valor isoladamente.
- **`IBlocoDefinicao.montar(config, dado)`** — não se aplica ao editor. Um bloco do editor não tem
  "dado de runtime" separado de config (o que o usuário digitou já é o dado final) — é o caso
  degenerado de `IDocumento` já descrito em `resumo_documento_generico.md` e confirmado no
  `dev_flow.md`. Esse contrato só importa para documentos fixos com busca de dado (Histórico, etc.).
- **Tornar `BlockRegistryService` dinâmico/plugin em runtime** — manter `REGISTRY` fixo no código
  por ora. O problema real não é "onde o registry mora", é "o registry não sabe tudo sobre o bloco"
  (resolvido pelo item 1) — mexer nas duas coisas ao mesmo tempo é escopo maior que o necessário.

## Performance — resumo

- Nenhum item acima adiciona IO, HTTP, ou camada de abstração em runtime — são reorganizações
  internas (mover método de um arquivo pra outro, trocar `*ngIf` por `ngComponentOutlet`).
- O único ponto que precisa de atenção explícita é o cache do item 2 (`Map<Type, Set<string>>`,
  nunca recalcular por instância/por chamada) — sem isso, centralizar a lógica apenas moveria o
  custo de lugar sem eliminá-lo.
- `ngComponentOutlet` no inspector troca **1** componente por vez (ao trocar o bloco selecionado) —
  custo desprezível, menor que o que o canvas já paga hoje renderizando **N** blocos simultâneos
  com a mesma técnica.

## Ordem de execução recomendada

1. `IBlocoConfigEditor` (contrato) + `configComponentType` em `BlockDef` + migrar os 7 formulários
   existentes do inspector para componentes dedicados — volume de trabalho é mecânico (um form por
   vez, sem mudar visual), mas é o item que efetivamente resolve o OCP.
2. `ComponentInputResolverService` compartilhado, plugado em `DocumentViewerComponent` e
   `EditorCanvasComponent` — elimina a 3ª cópia da lógica de inputs mágicos.
3. (Mais adiante, junto do roadmap maior do card) revisitar o ciclo de vida do editor para consumir
   o `DocumentoRuntime` quando ele existir, em vez de orquestrar o `DocumentViewerComponent`
   diretamente.
