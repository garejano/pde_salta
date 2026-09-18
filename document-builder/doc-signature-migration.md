# Migração: DocSignature → viewer (injeção dinâmica)

## Contexto

`DocSignatureComponent` é o último elemento gerenciado diretamente pelo template de `document-page`. Com a migração de `DocHeader` e `DocFooter`, ele é o único que ainda usa binding declarativo. A migração segue o mesmo padrão dos outros.

**Regra de negócio:** a assinatura vai sempre na última página (ou em todas se `onAllPages: true`), no fundo da página — acima do footer, abaixo do conteúdo regular.

## O que muda

### 1. `components/document-page/document-page.component.html`
Remover o bloco `app-doc-signature` — já não está mais no template.

### 2. `components/document-viewer/document-viewer.component.ts`

#### Import adicional
```ts
import { DocSignatureComponent } from '../doc-signature/doc-signature.component';
```

#### Novo método `injectSignature(config, contentEl)`
```ts
private injectSignature(config: DocumentConfig, contentEl: HTMLElement): void {
  const sig = config.signature!;
  const ref = this.measureVcr.createComponent(DocSignatureComponent);
  ref.setInput('signatories',     sig.signatories!);
  ref.setInput('city',            sig.city ?? '');
  ref.setInput('cityDateAlign',   sig.cityDateAlign ?? 'center');
  ref.setInput('signatoriesAlign', sig.signatoriesAlign);
  ref.setInput('signatoriesGap',  sig.signatoriesGap ?? 16);
  ref.setInput('showRole',        sig.showRole ?? true);
  this.cdr.detectChanges();
  contentEl.appendChild((ref.location as ElementRef<HTMLElement>).nativeElement);
  this.componentRefs.push(ref);
}
```

#### `distributeElements()` — ordem de injeção atualizada

```
1. headerEntries
2. page.components (entries regulares)
3. spacer (flex:1) — quando há signature OU footer
4. DocSignature — quando page.showSignature && signatories?.length
5. footerEntries ou DocFooter default
```

#### Condição do spacer atualizada
```ts
const hasSignature = page.showSignature && !!cfg.signature?.signatories?.length;
const hasFooter = footerSet === 'default-footer' || (Array.isArray(footerSet) && footerSet.length > 0);
if (hasSignature || hasFooter) {
  const spacer = document.createElement('div');
  spacer.style.flex = '1';
  contentEl.appendChild(spacer);
}
if (hasSignature) this.injectSignature(cfg, contentEl);
// ... footer ...
```

### 3. `README.md`
Atualizar nota da tabela de componentes: `DocSignature` passa a ser gerenciado pelo viewer (como `DocHeader`/`DocFooter`).

## O que NÃO muda

- **`layout-engine.service.ts`:** `applySignature()` continua setando `page.showSignature` e reservando `DOC_SIGNATURE_HEIGHT`. O viewer apenas consome essa flag para decidir quando injetar.
- **`DocumentConfig.signature`:** inalterado — `SignatureConfig` continua como está.
- **`DOC_SIGNATURE_HEIGHT`:** continua sendo importado no viewer para o cálculo de overhead nas pages.
