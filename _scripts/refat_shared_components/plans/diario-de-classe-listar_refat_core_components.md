# Plano de Refatoração — DiarioDeClasse/ListarComponent

## Substituições planejadas

| Linha(s) | HTML atual | Seletor shared | Inputs obrigatórios |
|---|---|---|---|
| 22–39 | `<div class="dg-empty">` (estado vazio com SVG + `<p>`) | `<app-sem-conteudo>` | `[mensagem]="'Aplique um filtro e clique em Aplicar para que o documento apareça aqui e possa ser gerado novamente.'"` |
| 150–165 | `<button class="dg-btn dg-btn--remover">` | `<app-button>` | `[label]="'Remover'"` `[classButton]="'dg-btn dg-btn--remover'"` `(clickEvent)="removerDocumento(doc.id)"` |
| 166–184 | `<button class="dg-btn dg-btn--visualizar">` | `<app-button>` | `[label]="'Visualizar'"` `[classButton]="'dg-btn dg-btn--visualizar'"` `(clickEvent)="visualizarDocumento(doc)"` |

## Módulos a importar no .ts

Nenhum — `SharedModule` já está no array `imports` (linha 50 do `.ts`). Ambos `app-sem-conteudo` e `app-button` fazem parte do `SharedModule`.

## Pontos de atenção

1. **Mensagem sem rich text**: `app-sem-conteudo` renderiza `{{mensagem}}` como texto simples. A versão original usa `<strong>Aplicar</strong>` para destacar a palavra. A substituição perde o negrito — o texto fica legível mas sem ênfase visual.

2. **Ícone dos botões**: `app-button` usa `[icon]` como string de classe (ex: Font Awesome), não aceita SVG inline. Os SVGs atuais (`trash`, `eye`) serão removidos. O estilo visual dos botões é mantido via `[classButton]` passando as classes `dg-btn dg-btn--remover` / `dg-btn dg-btn--visualizar`.

3. **Stop propagation**: O footer usa `(click)="$event.stopPropagation()"` para evitar que clicks nos botões ativem `visualizarDocumento(doc)` do card pai. Como `app-button` emite via `(clickEvent)` (Output Angular), o evento não propaga como evento DOM — a lógica de stop propagation continua funcionando normalmente.

4. **`app-loading` vs `app-doc-mini-loader`**: O catálogo lista `app-loading` como usado neste arquivo (registro antigo). O template atual usa `<app-doc-mini-loader>` para o skeleton — não é substituível pelo `app-loading` genérico (contexto diferente). Não será alterado.
