# Refatorar Shared Components

Refatora um componente Angular do repositório `estrutura-pedagogica` para substituir elementos HTML crus pelos `shared/components` e `shared/dynamic-components` padronizados.

Repositório alvo: `C:/projects/estrutura-pedagogica/frontend/src/`

## Input esperado

- **Componente alvo** — caminho relativo ao `frontend/src/` do template a refatorar.
  Ex.: `app/features/ocorrencia/listar/listar.component.html` ou apenas `ocorrencia/listar`.

---

## Tabela de substituição

| HTML cru | Shared component | Seletor |
|---|---|---|
| `<button` | ButtonComponent | `<app-button>` |
| `<input type="date"` (standalone) | DateFieldComponent | `<date-field>` |
| `<input type="date"` (reactive) | DateFieldComponent (dynamic) | `<app-date-field>` |
| `<input type="text"` (reactive) | TextFieldComponent | `<text-field>` |
| `<input type="number"` | NumberFieldComponent | `<app-number-field>` |
| `<input type="time"` | TimeFieldComponent | `<app-time-field>` |
| `<input type="checkbox"` | CheckboxFieldComponent | `<app-checkbox>` |
| `<input type="radio"` | RadioFieldComponent | `<app-radio-field>` |
| `<textarea` | TextareaFieldComponent | `<app-textarea-field>` |
| `<select` (standalone) | SelectFieldComponent | `<single-select>` |
| `<select` (reactive/multiselect) | SelectFieldComponent (dynamic) | `<app-select-field>` ou `<app-multi-select-field>` |
| spinner / loading div | LoadingComponent | `<app-loading>` |
| estado vazio / sem registros | SemConteudoComponent | `<app-sem-conteudo>` |
| modal / dialog | ModalComponent | `<app-modal>` |
| abas de navegação | TabNavigatorComponent | `<app-tab-navigator>` |
| título de tela (`<h2>` etc.) | TituloTelaComponent | `<app-titulo-tela>` |
| título de página (com breadcrumb) | TituloPageComponent | `<app-titulo-page>` |
| paginação | PaginacaoComponent | `<app-paginacao>` |
| input de busca | SearchFieldComponent | `<app-search-field>` |
| botões salvar/cancelar | SalvarComponent | `<app-salvar>` |
| painel lateral deslizante | SidePanelComponent | `<app-side-panel>` |
| toggle switch | ToggleFieldComponent | `<app-toggle>` |
| grupo de botões toggle | ToggleButtonsComponent | `<app-toggle-buttons>` |

---

## Processo

### Passo 1 — Analisar

1. Verifique se `_scripts/refat_shared_components/output/catalog.json` existe.
   - Se não existir, rode o script antes de prosseguir:
     ```powershell
     cd C:/projects/pde_salta/_scripts/refat_shared_components
     python analyze_shared_usage.py
     ```

2. Leia `_scripts/refat_shared_components/output/catalog.json` para confirmar os seletores disponíveis.

3. Se `_scripts/refat_shared_components/output/raw_html_candidates.md` existir, verifique se o template alvo já aparece lá.

4. Leia o template `.html` alvo e o `.ts` correspondente em `C:/projects/estrutura-pedagogica/frontend/src/`.

5. Para cada elemento HTML cru encontrado:
   - Mapeie para o shared component usando a tabela acima.
   - Verifique os `@Input()` obrigatórios lendo o `.component.ts` do shared component em `C:/projects/estrutura-pedagogica/frontend/src/shared/`.
   - Registre o módulo exportador (`SharedModule` ou `DynamicComponentsModule`).

6. Crie o documento de planejamento em:
   `_scripts/refat_shared_components/plans/<nome>_refat_core_components.md`

   Estrutura do plano:
   ```markdown
   # Plano de Refatoração — <NomeComponente>

   ## Substituições planejadas
   | Linha | HTML atual | Seletor shared | Inputs obrigatórios |
   |---|---|---|---|

   ## Módulos a importar no .ts

   ## Pontos de atenção
   ```

7. Apresente o plano e **aguarde confirmação antes de prosseguir**.

---

### Passo 2 — Aplicar

Após confirmação:

1. Releia o `.html` e o `.ts`.
2. Aplique cada substituição do plano no template.
3. Adicione os módulos necessários ao array `imports` no `.ts`.
4. Confirme os arquivos modificados.

---

## O que **não** fazer

- Não substituir elementos de bibliotecas terceiras (PrimeNG, ng-select, tinymce, etc.)
- Não alterar lógica de negócio no `.ts` — somente adicionar imports
- Não substituir elementos que já usam shared components
- Não omitir `@Input()` obrigatórios dos shared components
