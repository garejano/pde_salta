# Análise — Estrutura do `document-builder` e aderência mínima a SOLID

Repositório: `estrutura-pedagogica`, branch `projetos/MigracaoDocPed`
Pasta: `frontend/src/shared/document-builder/`

Escopo desta análise: o **motor de renderização** (`document-builder`), não o editor de blocos
genérico (`features/exemplos/*`), que é o objeto do restante do card EFC-7144. Pergunta respondida
aqui: antes de empilhar `BlocoTipo`/`DocumentoTipo`/`IDocumento` em cima do motor atual, o motor
em si precisa de ajuste estrutural? Resposta curta: **sim, um — `DocumentViewerComponent` — o resto
do módulo já está em bom estado.**

## Panorama (linhas por arquivo, maiores primeiro)

| Arquivo | Linhas | Situação |
|---|---:|---|
| `document-viewer.component.ts` | 659 | ⚠️ concentra 6 responsabilidades distintas |
| `print.service.ts` | 263 | OK — uma responsabilidade (estratégias de geração de imagem/PDF), bem segmentado |
| `document-log.service.ts` | 193 | OK — não lido a fundo, tamanho não é red flag por si só |
| `layout-engine.service.ts` | 197 | OK — só o algoritmo de distribuição em páginas |
| `document-config-panel.component.ts` | 180 | OK — boilerplate de formulário, uma responsabilidade |
| `pdf-api.service.ts` | 106 | OK |
| `page-optimizer.service.ts` | 122 | OK |
| `layout.models.ts` | 110 | **Bom exemplo de ISP** — interfaces pequenas e independentes (`Splittable`, `TextMeasurable`, `ColumnSplittable`, `CellPaddingConfigurable`), cada uma com seu type guard. Novo componente implementa só o que precisa; `LayoutEngineService` não conhece tipos concretos (duck typing via guard) — isso já é OCP/DIP bem aplicado e deve ser o padrão a preservar nos próximos blocos. |

Conclusão geral: o módulo **não tem um problema de SOLID disseminado** — é um problema concentrado
em um componente que cresceu organicamente a cada feature nova (EFC-666, Carômetro, PDF backend,
multi-documento/zip, debug). Isso é consistente com o próprio README, que já documenta bem a
superfície pública (`DocumentConfig`, `DocumentEntry`, `TextMeasurable`, `Splittable`) — o problema
é só do lado de dentro do orquestrador.

## O problema: `DocumentViewerComponent` (659 linhas, 6 responsabilidades)

1. **Orquestração do ciclo de vida** (`init`/`initSingle`/`initMultiple`/`reload`) — a razão de ser do componente.
2. **Resolução de header/footer** (`buildHeaderSets`/`buildFooterSets`/`resolveEntrySet`/`measureSet`) — lógica de negócio pura, sem nenhuma dependência de Angular além de medir.
3. **Medição e instanciação de componentes** (`measureEntries`, `measureBundle`, `injectEntries`, trecho inline em `distributeElements`) — **a mesma lógica de "criar `ComponentRef` + setar `data`/`contentWidth`/`fontSize`/`cellPadding`/`cellPaddingH` via `reflectComponentType`" está copiada 4 vezes** (linhas 428-437, 454-462, 518-526, 578-586).
4. **Geração de PDF / impressão** (`print`, `save`, `saveZip`, `prepareCapture`/`releaseCapture`) — a lógica `useBackend = pdfStrategy === 'backend' || maxPagesForFrontendPdf...` e o branch resultante estão **duplicados** entre `print()` e `save()` (linhas 135-154 vs 162-176).
5. **UI do overlay de loading** (`ensureLoadingStyles`, `createLoadingOverlay`, `updateLoadingText`) — manipulação de DOM direto (`document.createElement`, CSS injetado via string) que não tem nada a ver com "visualizar um documento"; é puramente feedback visual de uma operação assíncrona.
6. **Debug/telemetria de medição** (`logRenderMeasure`) — instrumentação que só roda quando `logService.enabled`.

Isso é o caso clássico de **violação de SRP por acréscimo incremental**: cada feature (EFC-666,
backend PDF, multi-documento, debug panel) adicionou responsabilidade nova ao mesmo arquivo em vez
de a um colaborador novo. Nenhuma dessas 6 responsabilidades é complexa isoladamente — o custo é
só de **estar todas juntas**, o que torna o arquivo difícil de ler, testar e estender sem
side-effects (ex.: mexer em "como o header é resolvido" exige entender PDF/print/overlay no mesmo
arquivo, mesmo sem tocar neles).

## Refatoração recomendada (mínima, sem redesenho de arquitetura)

Nenhum item abaixo muda a API pública (`DocumentConfig`, `DocumentEntry`, `Splittable`,
`TextMeasurable`) nem o comportamento — são extrações puras, baixo risco, altas em retorno de
legibilidade/testabilidade. Ordenados por relação custo/benefício:

### 1. Extrair o "magic input setter" (maior ganho, menor esforço)
Hoje, toda vez que um `DocumentEntry` vira `ComponentRef`, o mesmo bloco de 6 linhas decide quais
inputs opcionais existem no componente (`contentWidth`, `fontSize`, `cellPadding`, `cellPaddingH`)
via `reflectComponentType` e os seta condicionalmente — repetido em 4 lugares. Além de violar DRY,
é uma violação de **OCP**: adicionar um novo "input mágico" no futuro (ex.: um `cellBorderColor`)
exige lembrar de editar os 4 lugares — fácil esquecer um e introduzir uma inconsistência só
visível em produção.

**Proposta:** um método único, algo como:
```typescript
private createEntryComponent(
  entry: DocumentEntry, config: DocumentConfig, contentWidth: number,
): ComponentRef<unknown> {
  const ref = this.measureVcr.createComponent(entry.componentType as Type<{ data: unknown }>);
  const inputNames = new Set(reflectComponentType(entry.componentType as Parameters<typeof reflectComponentType>[0])?.inputs.map(i => i.propName) ?? []);
  ref.setInput('data', entry.data);
  if (inputNames.has('contentWidth')) ref.setInput('contentWidth', contentWidth);
  if (config.fontSize !== undefined && inputNames.has('fontSize')) ref.setInput('fontSize', config.fontSize);
  if (config.tableCellPadding !== undefined && inputNames.has('cellPadding')) ref.setInput('cellPadding', config.tableCellPadding);
  if (config.tableCellPaddingH !== undefined && inputNames.has('cellPaddingH')) ref.setInput('cellPaddingH', config.tableCellPaddingH);
  this.cdr.detectChanges();
  return ref;
}
```
reusado por `measureEntries`, `measureBundle`, `injectEntries` e o trecho inline de
`distributeElements`. Reduz ~40 linhas duplicadas para uma função só, e um input mágico novo passa
a exigir editar **um** lugar.

### 2. Unificar `print()`/`save()` em um único método interno
Ambos fazem exatamente a mesma decisão `useBackend` e o mesmo fluxo de captura/liberação —
diferem só no destino final (abrir em nova aba vs. baixar). Extrair:
```typescript
private async generatePdf(mode: 'open' | 'download', fileName?: string): Promise<void>
```
elimina a segunda cópia da lógica de decisão de estratégia — hoje, mudar a regra de
`useBackend` exige lembrar de editar os dois métodos.

### 3. Extrair o overlay de loading para fora do componente
`ensureLoadingStyles`/`createLoadingOverlay`/`updateLoadingText` (linhas 223-284, ~60 linhas) não
dependem de nenhum estado do `DocumentViewerComponent` — são `static`. Mover para um
`DocumentLoadingOverlayService` (ou um pequeno componente Angular próprio) remove uma
responsabilidade inteira do arquivo e deixa esse overlay reaproveitável/testável isoladamente —
hoje não há como testar o overlay sem instanciar o viewer inteiro.

### 4. Extrair resolução de header/footer para um colaborador dedicado
`buildHeaderSets`/`buildFooterSets`/`resolveEntrySet`/`measureSet` (linhas 376-419) formam uma
unidade coesa e **sem dependência de ciclo de vida do componente** (só usa `measureEntries`, que
por sua vez só precisa do `measureVcr` e `cdr`). Um `HeaderFooterResolverService` (ou mesmo uma
classe pura, sem DI, se não precisar de Angular) tornaria essa lógica — hoje só coberta
indiretamente pelos specs do viewer — testável de forma unitária e isolada, sem precisar montar um
`DocumentViewerComponent` completo.

### 5. (Opcional, menor prioridade) Mover `logRenderMeasure` para `DocumentLogService`
Hoje `DocumentViewerComponent.logRenderMeasure` lê o DOM (`contentEl.getBoundingClientRect()`) e
monta o payload de log. Poderia virar um método do próprio `DocumentLogService` recebendo os dados
já coletados, deixando o viewer sem saber o formato do payload de log — ganho menor que os itens
acima, fazer só se for mexer nessa área de qualquer forma.

**Não recomendo** separar `initSingle`/`initMultiple` do viewer (item 1 da lista de
responsabilidades) — é literalmente a razão de existir do componente (orquestrar o ciclo de vida de
init), e `Page[]`/`pageConfigs`/etc. precisam viver como estado do componente para o template
funcionar. Extrair isso criaria indireção sem reduzir complexidade real.

## Por que fazer isso agora, antes do resto do card EFC-7144

O plano do card já prevê **mais um consumidor** de `DocumentViewer`/`measureBundle`/`distributeElements`
sendo escrito em cima deste motor: o `DocumentoRuntime` (que chamará `IDocumento`/`IGenericDocument`)
e o editor de blocos persistido. Dois motivos concretos para extrair os itens 1 e 2 antes:

- **Item 1 (magic input setter)** será tocado de qualquer forma se o `BlocoTipo` persistido vier a
  declarar inputs de config de forma mais genérica (schema-driven) — hoje a lista de inputs
  "mágicos" é um `if` por nome, hardcoded; não há como declarar um bloco novo com um input de config
  próprio sem editar este trecho em 4 lugares. Resolver isso agora evita que o problema se repita
  uma 5ª vez quando o catálogo genérico chegar.
- **Item 4 (header/footer resolver)** é exatamente a peça que o `IBlocoDefinicao`/`DocumentoRuntime`
  do desenho proposto no card vai precisar reusar/chamar — hoje está presa como método privado do
  viewer, inacessível a qualquer outro consumidor.

Itens 3 e 5 são limpeza de baixo risco, podem entrar em qualquer momento (inclusive depois, como
débito técnico à parte) sem bloquear o resto do card.

## Próximos passos sugeridos (ordem prática)

1. Refatorações 1 e 2 (extração pura, sem mudança de comportamento) — pré-requisito de baixo custo
   antes de abrir frente nova em cima do viewer.
2. Refatoração 4 (extrair resolver de header/footer) — feita em conjunto com o início da modelagem
   de `IBlocoDefinicao`, já que é o mesmo tipo de responsabilidade.
3. Seguir o roadmap já descrito na descrição do card (persistir `BlocoTipo`/`DocumentoTipo`, dar
   existência a `Documento`, formalizar `IDocumento`/`IGenericDocument`, validar com o bloco de
   Tabela de Notas do Histórico).
4. Refatorações 3 e 5 — quando conveniente, não bloqueantes.

## Referência

Descrição completa do escopo do card: Jira `EFC-7144`. Análise de produto original:
`document-builder/resumo_documento_generico.md` e `estrutura_documentos.md` (histórico git do
`pde_salta`, arquivos removidos do working tree em commit recente — recuperáveis via
`git show HEAD:document-builder/resumo_documento_generico.md`).
