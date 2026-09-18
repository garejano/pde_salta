repositório: estrutura-pedagogica
base: ../components/readme.md

## Objetivo

Guia de boas práticas para tornar componentes Angular do `estrutura-pedagogica` fáceis de
testar com Playwright — tanto para quem escreve o teste manualmente quanto para uma IA/LLM
gerando testes a partir do código.

---

## 1. Convenção de `data-testid`

Prática mais importante da lista — evita seletores que quebram com mudança de CSS/texto/posição.

❌ Evitar:
```
page.locator('.btn-primary:nth-child(2)')
page.locator('text=Salvar')
```

✅ Preferir:
```html
<button data-testid="btn-salvar" (click)="salvar()">Salvar</button>
```
```typescript
await page.getByTestId('btn-salvar').click();
```

### Padrão de nomenclatura

| Padrão              | Exemplo                  | Uso                              |
|---------------------|---------------------------|-----------------------------------|
| `page-<nome>`        | `page-alunos`             | container raiz da página          |
| `btn-<ação>`         | `btn-novo-aluno`          | botões                            |
| `input-<campo>`      | `input-nome`              | inputs                            |
| `table-<entidade>`   | `table-alunos`            | tabelas                           |
| `row-<entidade>-{id}`| `row-aluno-15`            | linhas de lista/tabela            |
| `modal-<ação>`       | `modal-excluir`           | modais                            |
| `toast-<tipo>`       | `toast-sucesso`           | toasts/notificações               |

Toda a equipe deve seguir a mesma convenção — nomes ad-hoc quebram a reutilização de Page Objects.

---

## 2. Componentes pequenos e de responsabilidade única

Ao invés de um componente gigante concentrando tabela + filtro + modal + formulário + paginação,
dividir em subcomponentes (`AlunoFiltroComponent`, `AlunoTabelaComponent`,
`AlunoModalComponent`, `AlunoFormComponent`) sob uma página (`AlunoPage`).

Facilita localizar elementos, reutilizar Page Objects e testar fluxos isolados.

---

## 3. HTML semântico e acessível

Usar `button`, `input`, `label`, `role`, `aria-*` em vez de `div`s genéricas com classes CSS —
permite usar os seletores mais estáveis do Playwright:
```typescript
page.getByRole('button', { name: 'Salvar' });
page.getByRole('button', { name: 'Excluir aluno' }); // via aria-label
```

Prioridade de seletor: `getByRole` > `getByTestId` > seletor de texto > CSS/XPath (evitar os dois
últimos).

---

## 4. Estados explícitos, nunca implícitos por CSS

Visibilidade controlada por estado do componente (`*ngIf`, `aria-hidden`), não só por
`display: none` via CSS solto — garante que o Playwright consiga verificar o estado real.

---

## 5. Estados de carregamento previsíveis

Fluxo `loading → spinner → requisição → conteúdo` com `data-testid` no spinner:
```typescript
await expect(page.getByTestId('spinner')).toBeHidden();
```

Nunca usar `waitForTimeout` fixo — sempre esperar por estado (`expect(...).toBeVisible()`) ou
por resposta (`page.waitForResponse(...)`).

---

## 6. Modais consistentes

Padronizar wrapper e nomes de ação em todos os modais:
```html
<div data-testid="modal">
```
```
btn-confirmar / btn-cancelar / btn-fechar
```
Permite escrever um único Component Object reutilizável para modal.

---

## 7. Serviços desacoplados

Componente depende de um serviço bem definido, que fala com a API — nunca lógica de request
direto no componente. Permite mockar a chamada HTTP no teste:
```typescript
await page.route('**/api/alunos', route => route.fulfill({ json: alunosMock }));
```

---

## 8. Rotas e animações

- URLs previsíveis e com hierarquia clara (`/alunos`, `/alunos/15`, `/alunos/15/editar`) em vez
  de tudo via query string.
- Evitar animações/transições longas (>300ms) nos fluxos críticos de teste — durante os testes,
  considerar desabilitá-las.

---

## 9. Estrutura de projeto sugerida

```
src/
├── app/
│   ├── alunos/
│   ├── professores/
│   └── shared/
tests/
├── pages/        # Page Objects — uma classe por tela
├── components/   # Component Objects — dropdowns, tabelas, modais, date pickers reutilizáveis
├── fixtures/
├── utils/
└── specs/
```

- **Page Objects**: encapsulam interação com cada página, evitando duplicar seletores.
- **Component Objects**: para componentes reutilizáveis da shared (essencial aqui, dado o volume
  de `dynamic-components`/`shared/components` do projeto).

---

## 10. Checklist de code review — "esse componente é testável?"

- [ ] Elementos relevantes têm `data-testid` seguindo a convenção da seção 1?
- [ ] HTML semântico (`button`, `input`, `label`) em vez de `div`/`span` genérico?
- [ ] Estado de loading/erro exposto via elemento com `data-testid` próprio?
- [ ] Nenhuma lógica de visibilidade depende só de CSS (`display:none`) sem refletir estado real?
- [ ] Se é modal, segue o padrão da seção 6?
- [ ] Se depende de API, passa por um serviço mockável (não chamada HTTP direta no componente)?

---

## Referências

- [Playwright — Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright — Locators](https://playwright.dev/docs/locators)
- [Playwright — Example Tests (GitHub)](https://github.com/microsoft/playwright)
- [Martin Fowler — Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Google Testing Blog](https://testing.googleblog.com/)
