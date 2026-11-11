repositorio: estrutura-pedagogica
alvo: document-builder / lista-presenca

## Problema

Na rota `/lancamento-frequencia/lista-presenca` é possível selecionar múltiplas turmas e gerar múltiplos documentos. O `DocumentViewerComponent` já suporta o input `[documents]: DocumentBundle[]` e renderiza todos os documentos corretamente. Porém o painel de configuração (orientação, margens, fonte, cabeçalho/rodapé) não aparece na overlay de impressão.

### Causa raiz

`lista-presenca.component.html` usa `<app-print-overlay>` mas **não inclui** `<app-document-config-panel poPanel>` como filho. A overlay projeta o painel via `<ng-content select="[poPanel]">` — sem o filho, o slot fica vazio. Além disso, não há `(configChange)` handler nem propriedade `activeConfig` no componente.

---

## Solução

Seguir o padrão já implementado em:
- `src/app/features/exemplos/documents/documents.component.ts` — linhas 949–958 (`onMultiConfigChange`)
- `src/app/features/exemplos/documents/documents.component.html` — integração do painel no overlay

### Arquivos a alterar

**1. `lista-presenca.component.ts`**

- Adicionar propriedade `activeConfig: DocumentConfig = {}`
- Em `openOverlay()`, após `buildDocuments()`, inicializar:
  ```typescript
  this.activeConfig = { ...this.documents[0].config };
  ```
- Adicionar método:
  ```typescript
  onConfigChange(newConfig: DocumentConfig): void {
    this.activeConfig = newConfig;
    this.documents = this.documents.map(b => ({ ...b, config: { ...b.config, ...newConfig } }));
    setTimeout(() => this.viewer?.reload(), 0);
  }
  ```

**2. `lista-presenca.component.html`**

Dentro de `<app-print-overlay>`, adicionar antes do `<app-document-viewer>`:
```html
<app-document-config-panel
    poPanel
    [config]="activeConfig"
    [canOpenInEditor]="false"
    (configChange)="onConfigChange($event)">
</app-document-config-panel>
```

Alterar o viewer:
```diff
- [config]="documents[0]?.config"
+ [config]="activeConfig"
```

---

## Pronto quando

- Painel de configuração aparece na overlay ao gerar com 2+ turmas
- Alterar orientação/fonte/margens re-renderiza **todos** os documentos
- Comportamento com 1 turma não regride
