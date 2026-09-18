repositorio: estrutura-pedagogica
alvo: document-builder

---

## Objetivo 1 — Botão "Imprimir" abre o diálogo nativo do navegador com o PDF

**Problema:** `window.print()` com estratégia `'css'` imprime a tela inteira (menus, tabelas, etc.) + documento.

**Causa raiz:** A estratégia `'css'` chama `window.print()` direto. As regras `@media print` do `print-overlay` escondem elementos internos ao componente, mas o restante da aplicação (portal header, menu lateral, conteúdo da rota) continua visível para o navegador.

**Solução implementada:**
- `ACTIVE_PRINT_STRATEGY` em `print.service.ts` alterado de `'css'` para `'html2canvas'`
- Agora o botão "Imprimir" gera um PDF somente com as páginas do documento, cria um iframe oculto com o blob e chama `iframe.contentWindow.print()`
- O diálogo nativo do navegador exibe apenas o documento gerado

---

## Objetivo 2 — Modo de visualização não interfere na geração do PDF

**Problema:** Mudar para carousel e depois gerar PDF/impressão produz conteúdo reduzido na página.

**Causa raiz:** `document-page.component.scss` aplica `zoom: var(--page-scale, 1)` no `:host`. O carousel overlay define `--page-scale ≈ 0.7` no elemento ancestral; essa variável CSS é herdada pelo `app-document-page`. Com `zoom: 0.7` ativo:
- `offsetWidth` / `offsetHeight` retornam o tamanho reduzido → jsPDF usa dimensões erradas
- `html2canvas` captura o canvas no tamanho reduzido

**Solução implementada:**
- `DocumentViewerComponent` passou a usar `prepareCapture()` / `releaseCapture()`
- Antes de passar os elementos para o `PrintService`, força `--page-scale: 1` inline em cada `app-document-page` via `element.style.setProperty`
- O `releaseCapture()` no bloco `finally` remove o override após a geração
- O `zoom` volta ao valor herdado do overlay sem efeito colateral na visualização

---

## Objetivo 3 — Loading durante geração do PDF/impressão

**Problema:** A geração por `html2canvas` pode levar de 3 a 30 s dependendo do número de páginas. Sem feedback visual o usuário não sabe se o clique funcionou.

**Requisitos:**
- Indicar que a geração está em andamento
- Mostrar a etapa atual quando possível
- O próprio loading deve ser leve ao ponto de não adicionar latência perceptível

---

### Fases da geração

```
[fonts.ready]  →  [html2canvas pág 1…N]  →  [jsPDF.addImage pág 1…N]  →  [print / save]
  ~50 ms            ~1–3 s / página            ~200–800 ms / página
```

---

### Arquitetura proposta

#### Por que não usar Angular (signals / detectChanges) durante a geração

`html2canvas` cria um clone do DOM no momento da captura. Se o Angular rodar `detectChanges()` durante esse processo pode modificar o DOM clonado e corromper o canvas. Portanto: **nenhuma operação de Angular change detection deve ocorrer enquanto a geração está ativa**.

O loading é criado e atualizado inteiramente via DOM direto — sem zone, sem Angular.

---

#### Interface de progresso em `PrintService`

```typescript
export interface PrintProgress {
  phase: 'fonts' | 'rendering' | 'composing';
  page?: number;    // 1-based, presente em 'rendering' e 'composing'
  total?: number;
}

type ProgressFn = (p: PrintProgress) => void;
```

`print()` e `save()` recebem um parâmetro opcional `onProgress?: ProgressFn`.

Pontos de emissão internos ao `PrintService`:

| Fase | Quando emitir |
|---|---|
| `fonts` | antes de `await document.fonts.ready` |
| `rendering` | logo antes de cada `html2canvas(page)` |
| `composing` | logo antes de cada `pdf.addImage()` |

---

#### Overlay criado no `DocumentViewerComponent`

`prepareCapture()` (já modificado para Objetivo 2) passa a criar o overlay antes de iniciar a geração e o destrói no `releaseCapture()`.

```typescript
// em prepareCapture():
const overlay = DocumentViewerComponent.createLoadingOverlay();
const onProgress = (p: PrintProgress) =>
  DocumentViewerComponent.updateLoadingText(overlay, p);

// onProgress é passado para printService.print() / save()

// em releaseCapture():
overlay.remove();
```

Funções estáticas de DOM (zero Angular):

```typescript
private static createLoadingOverlay(): HTMLElement {
  DocumentViewerComponent.ensureLoadingStyles();
  const el = document.createElement('div');
  el.className = 'dvw-loading';
  el.innerHTML = `
    <div class="dvw-loading__spinner"></div>
    <span class="dvw-loading__text">Preparando…</span>
  `;
  document.body.appendChild(el);
  return el;
}

private static updateLoadingText(overlay: HTMLElement, p: PrintProgress): void {
  const textEl = overlay.querySelector('.dvw-loading__text') as HTMLElement;
  if (!textEl) return;
  if (p.phase === 'fonts')      textEl.textContent = 'Preparando…';
  if (p.phase === 'rendering')  textEl.textContent = `Renderizando página ${p.page} / ${p.total}…`;
  if (p.phase === 'composing')  textEl.textContent = `Montando PDF… ${p.page} / ${p.total}`;
}
```

---

#### CSS do overlay (injetado uma vez como `<style>` em `<head>`)

```scss
.dvw-loading {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(15, 15, 16, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  animation: dvw-fadein 120ms ease;
}

.dvw-loading__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: dvw-spin 0.75s linear infinite;
}

.dvw-loading__text {
  font-family: 'Archivo', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.01em;
}

@keyframes dvw-spin    { to { transform: rotate(360deg); } }
@keyframes dvw-fadein  { from { opacity: 0; } to { opacity: 1; } }
```

Spinner e fade são **GPU-only** (transform + opacity). Nenhum recalculo de layout durante a animação.

---

#### Overhead real adicionado pelo loading

| Operação | Custo |
|---|---|
| `document.createElement` + `appendChild` | ~0.1 ms |
| Cada `textEl.textContent = …` | ~0.02 ms |
| `overlay.remove()` | ~0.1 ms |
| Animação CSS (spin) | GPU — 0 ms no main thread |

O loading em si é indetectável na geração total.

---

### Checklist de implementação

- [ ] Adicionar `PrintProgress` e `ProgressFn` ao `print.service.ts`
- [ ] Adicionar parâmetro `onProgress?` em `print()` e `save()` do `PrintService`
- [ ] Emitir `onProgress` nos pontos certos dentro de `getImagesViaHtml2canvas()` e `buildPdf()`
- [ ] Criar `createLoadingOverlay()`, `updateLoadingText()` e `ensureLoadingStyles()` em `DocumentViewerComponent`
- [ ] Atualizar `prepareCapture()` para criar o overlay e passar `onProgress`
- [ ] Atualizar `releaseCapture()` para remover o overlay



## Objetivo 4 — Componente: app-document-config-panel precisa de um bloco que
explique o que cada configuracao da exportaca (qualidade do PDF e Estrategia)
faz, como se fosse uma parte de ajuda para o usuario, por ordem de "melhor performance" -> "melhor qualidade"

motivo: o usuario pode estar usando um computador fraco que para nao travar gerando muitas paginas precise de uma configuracao que garanta melhor perfoamnce msmo sacrificando qualidade do documento final


## Objetivo 5 - Botao "Restaurar padores" do app-document-config-panel deve funcionar corretamente
 o botao "Restaurar padroes" do painel de configuracao nao esta funcionando para o documento lista de presenca em  lancamento-frequencia/lista-presenca
