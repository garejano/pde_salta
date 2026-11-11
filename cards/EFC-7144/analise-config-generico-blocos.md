# Todo bloco precisa de um componente de configuração dedicado?

Refina o item 1 de `analise-solid-editor.md` (`IBlocoConfigEditor` + `configComponentType` em
`BlockDef`). Pergunta: **1 bloco = 1 componente Angular de config, sempre**, ou existe um padrão que
escala melhor conforme o catálogo cresce (hoje 7 tipos no editor, ~25 no motor, tendência de só
crescer)?

**Resposta curta: não precisa, e forçar isso seria repetir o mesmo erro que estamos corrigindo —
trocar "formulário hardcoded dentro do inspector" por "um arquivo `.ts` hardcoded por bloco", só
que espalhado em mais arquivos.** O padrão que evolui bem é híbrido: a maioria dos blocos ganha
configuração **declarativa** (um schema de campos, dado puro); só os blocos genuinamente complexos
ganham um componente bespoke — mas os dois caminhos implementam o mesmo contrato
(`IBlocoConfigEditor`), então o inspector nunca sabe (nem precisa saber) qual dos dois está usando.

## O que os 7 blocos de hoje realmente precisam

| Bloco | Forma do dado | Cabe em schema genérico? |
|---|---|---|
| `header` | campos de texto soltos (institutionName, address, city, state, phone, cnpj...) | ✅ sim |
| `section` | title, subtitle | ✅ sim |
| `statement` | text (textarea) + centered (toggle) | ✅ sim |
| `presenca-info` | turma (texto) + dateLabel (select) | ✅ sim |
| `info-row` | lista de `{label, value}` | ✅ sim, com 1 widget reusável "lista de pares" |
| `info-grid` | campos soltos + 2 grupos condicionais (`showLineage`/`showDigitalId` revelam outros campos) | ✅ sim, com 1 recurso "campo condicional" |
| `table` | columns: string[] + rows: string[][], onde mudar colunas afeta a forma das linhas | ⚠️ não — layout genuinamente de grade dinâmica |

Ou seja: com um schema que suporte **texto, textarea, toggle, select, lista de pares
label/valor e visibilidade condicional**, **6 dos 7 blocos de hoje não precisam de nenhum
componente Angular novo** — só de um objeto de configuração (dado, não código). Só `table` pede algo
mais encorpado (um editor de grade dinâmica) — que pode nascer como um **widget de schema
reutilizável** (`kind: 'grid'`) em vez de um componente exclusivo do bloco `table`, já que qualquer
bloco futuro em formato de tabela (ex. uma variação de `DocWideTable`) reaproveitaria o mesmo widget.

## O padrão: schema declarativo + escape hatch bespoke, mesmo contrato

```typescript
// shared/document-builder/models/block-config-schema.ts
export type BlockFieldSchema =
  | { kind: 'text'; path: string; label: string; placeholder?: string }
  | { kind: 'textarea'; path: string; label: string; rows?: number }
  | { kind: 'toggle'; path: string; label: string }
  | { kind: 'select'; path: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'list-kv'; path: string; label: string; keyLabel: string; valueLabel: string }
  | { kind: 'group'; label: string; fields: BlockFieldSchema[]; visibleIf?: (data: unknown) => boolean };

export interface IBlocoConfigEditor<T = unknown> {
  config: T;
  configChange: EventEmitter<T>;
}

export interface BlockDef<T = unknown> {
  type: BlockType;
  label: string;
  icon: string;
  category: 'identification' | 'content' | 'data';
  componentType: Type<{ data: T }>;     // renderização — sempre uma classe
  config:
    | { kind: 'schema'; schema: BlockFieldSchema[] }           // caminho comum
    | { kind: 'component'; componentType: Type<IBlocoConfigEditor<T>> }; // escape hatch
  defaultData: T;
}
```

`BlockInspectorComponent` (já proposto como shell genérico no item 1) resolve o `config` do bloco
selecionado: se `kind === 'schema'`, renderiza um único
`GenericBlockConfigFormComponent` (implementa `IBlocoConfigEditor`, interpreta o schema e aplica
`patchPath(data, path, value)` genérico); se `kind === 'component'`, usa `ngComponentOutlet` igual
já descrito. **O inspector não muda dependendo do caminho** — os dois lados do `config` implementam
o mesmo contrato mínimo.

## Por que isso evolui melhor que "1 bloco = 1 componente sempre"

- **Bloco estrutural novo (o caso comum):** registrar = adicionar uma entrada no registry com um
  `schema`. Zero arquivo `.ts`/`.html` novo. É o verdadeiro "open for extension without
  modification" do OCP — a alternativa (sempre criar um componente) ainda é "editar/criar código
  toda vez", só que num arquivo a mais em vez de um `*ngIf` a mais.
- **Vocabulário do schema cresce uma vez, beneficia todo mundo retroativamente.** Se amanhã
  precisarmos de um campo tipo "cor" ou "upload de imagem", todo bloco schema-driven ganha essa
  capacidade de graça. Com "1 componente por bloco", cada melhoria exigiria tocar N arquivos.
- **Blocos de negócio genuinamente complexos não ficam espremidos num molde genérico.** O escape
  hatch existe exatamente pra isso — não force o schema a cobrir um caso que não cabe nele (ver
  limite abaixo). O Carômetro já tem hoje um painel de config bespoke
  (`DocCarometroConfigPanelComponent`) fora desse fluxo — com o contrato formalizado, ele passa a
  implementar `IBlocoConfigEditor` e se encaixa no mesmo inspector, sem precisar forçar nada
  genérico nele.

## A distinção real não é "todo bloco", é "bloco estrutural vs. bloco de negócio"

Isso conecta direto com uma distinção que já existe em `resumo_documento_generico.md`: blocos
**estruturais** (`DocSectionComponent`, `DocStatementComponent`, `DocInfoRowComponent`,
`DocTableComponent`, `DocTitleComponent`, `DocLegendComponent`) já são genéricos também na
*renderização* — não sabem nada de "aluno" ou "escola", só recebem dado e desenham. Esses são os
candidatos naturais a configuração schema-driven. Blocos de **regra de negócio** (`DocInfoGrid` =
"Ficha do aluno" com campos específicos, `DocPresencaInfo`, `DocCarometroCard`, `DocGridDiario`, e o
futuro bloco de "Tabela de Notas do Histórico" já previsto no card) tendem a precisar de UX própria
na configuração também — não é coincidência, é o mesmo motivo pelo qual eles existem como
componentes de render dedicados em vez de reaproveitar um `DocTableComponent` genérico.

**Regra prática:** schema-driven é o caminho padrão; escape hatch (componente bespoke) é a exceção
justificada — não o contrário. Decidir pelo schema primeiro; só pular pra um componente dedicado
quando o schema genuinamente não representa o que o bloco precisa (ex.: grade dinâmica do `table`,
reordenação drag-and-drop, preview computado, validação cruzada entre campos).

## Risco a vigiar: inchaço do vocabulário do schema

O perigo do caminho genérico é o oposto do problema atual — em vez de um inspector monolítico por
tipo de bloco, vira um `GenericBlockConfigFormComponent` monolítico tentando cobrir casos demais
(`kind: 'date-picker-with-timezone-and-custom-validator'...`). Guia prático: se um novo tipo de
campo só serve pra UM bloco específico e não parece reaproveitável por outros blocos futuros, isso é
sinal de que aquele bloco deveria usar o escape hatch, não que o schema precisa crescer mais um
`kind`.

## Coerência com persistência futura (`BlocoTipo`)

`componentType` (renderização) nunca pode ser persistido — é uma classe TypeScript, resolvida só no
código (um registry string→classe sempre vai existir, isso não muda com banco de dados). O `schema`
de configuração, ao contrário, **é dado puro** (array de objetos JSON) — pode nascer no código hoje
e, quando `BlocoTipo` virar tabela (item já no roadmap do card), o `schema` migra para uma coluna
JSON no banco **sem nenhuma mudança de modelo**: o schema sempre foi dado, só mudou de onde mora.
Isso não é verdade pro caminho `kind: 'component'` (escape hatch) — esse sempre vai precisar de uma
classe resolvida no código, exatamente como `componentType`. Mais um motivo pra preferir schema
sempre que o bloco permitir: é o único dos dois caminhos que fica plug-and-play com a persistência
futura sem exigir deploy de código pra cada bloco novo.

## Resumo

Não, nem todo bloco precisa de um componente de configuração dedicado — e tratar isso como regra
obrigatória cria o mesmo tipo de duplicação linear que o item 1 de `analise-solid-editor.md` já
identificou como problema. O padrão que evolui bem é: **schema declarativo como caminho padrão**
(cobre hoje 6 dos 7 blocos existentes sem nenhum componente novo), **componente bespoke como escape
hatch** para os casos que o schema genuinamente não cobre, **mesmo contrato `IBlocoConfigEditor`**
nos dois caminhos para o inspector nunca precisar diferenciar, e **schema como dado** para já nascer
compatível com a persistência de `BlocoTipo` prevista no roadmap do card.
