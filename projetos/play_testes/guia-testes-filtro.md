repositório: estrutura-pedagogica
base: guia-testes-playwright-dia-letivo-extra.md (autenticação real via SaltaId, convenção de testid, comandos de execução)
fonte de produto: cards/show_case_filtro/ (filtromodule_descricao_tecnica.md, filtro_bug_cascata_campo_data.md)

## Objetivo

O módulo `shared/filtro` do `estrutura-pedagogica` renderiza qualquer filtro de tela a partir de
uma **config declarativa** (`FilterConfig`), sem HTML de filtro escrito à mão. Isso significa que
**o comportamento de um filtro é 100% previsível a partir da sua config** — e portanto os testes
também podem ser derivados dela quase mecanicamente. Este guia ensina esse mapeamento
config → teste, e serve de base para a skill `/criar-teste-filtro`.

Este guia assume que você já leu `guia-testes-playwright-dia-letivo-extra.md` (autenticação real,
convenção de `data-testid`, como rodar). Aqui o foco é só o que é específico de `<filtro>`.

---

## 1. Anatomia da config

### `FilterConfig` (nível do filtro)

```typescript
interface FilterConfig {
  id: string;                 // chave única — usada no localStorage (filtro_<id>) e nos testids
  id_save: string;            // (legado — não usado pelo testid; o botão aplicar usa filtro-<id>-btn-aplicar)
  id_clear: string;
  id_toggle?: string;         // presença dele decide se o botão de fechar (X) é renderizado
  defaultValue: string;       // valor "vazio" para campos sem valor — normalmente ""
  filters: FilterItemConfig[];
  title?: string;
  showSearchField?: boolean;
  searchPlaceholder?: string;
  storageTTL?: number;        // horas até o storage expirar (default 240h = 10 dias)
  autoApply?: boolean;        // default true — reaplica sozinho 400ms após montar, se já aplicado antes
  sideEffects?: SideEffect[]; // ver seção 5
}
```

### `FilterItemConfig` (nível do campo)

```typescript
interface FilterItemConfig {
  key: string;                    // chave no FormGroup — também vira o fieldId usado nos testids
  type: FilterType;                // domínio de negócio (~48 valores) — só serve pro sistema de cascata
  field_type: FieldType;           // decide QUAL componente é injetado (ver seção 2)
  label: string;
  placeholder?: string;
  required: boolean;
  service_name?: string;           // método do [service] da tela
  url?: string;                    // alternativa: rota direta via FiltroApiService
  autostart?: boolean;             // carrega options no init, sem esperar dependência
  selectFirst?: boolean;           // seleciona a 1ª opção após carregar
  autoSelectWhenSingle?: boolean;  // seleciona automaticamente se só vier 1 opção
  watch_list?: FilterType[];       // recarrega este campo quando QUALQUER um destes mudar
  dependency_list?: FilterType[];  // bloqueia (desabilita) este campo até todos estes terem valor
  preventResetOnDependencyClear?: boolean; // não reseta o campo se uma dependência for limpa
  excludeParams?: string[];
  useStorage?: boolean;            // default true — Select/MultiSelect recupera do localStorage em vez de rechamar API
  showSelectTag?: boolean;         // mostra uma tag visual após aplicar
  tagOptions?: { icon?: string; label?: string };
  colClass?: string;               // largura Bootstrap
  value?: any;                     // valor inicial
  options?: any[];                 // opções fixas (obrigatório pra CustomRadio)
  info?: string;                   // texto ao lado (Checkbox/Toggle)
  min?: string; max?: string;      // só FieldType.Date — habilita validação dateMin/dateMax
}
```

Configs reais têm às vezes propriedades extras (`id`, `store`, `disabledLabel`, `multi_select`) que
**não fazem nada** no core do filtro — são resíduo de versões antigas. Ignore-as ao gerar testes;
não confie em nada que não esteja na lista acima.

---

## 2. `FieldType` → componente → como testar

9 valores no enum `FieldType` (`filtro.models.ts`). O `component.map.ts` tem mais 6 chaves
utilizáveis via string crua (`textarea`, `number`, `radio`, `time`, `money`, `file`) que não têm
membro correspondente no enum — funcionam, mas exigem `field_type: 'textarea' as FieldType` em vez
de uma constante.

| `field_type` | Componente | Testid do input/trigger | Testid de opção | Como interagir no teste |
|---|---|---|---|---|
| `FieldType.Select` | `SelectFieldComponent` (dynamic) | `<key>-trigger` | `<key>-option-<hash>` | `.click()` no trigger, `.click()` na opção |
| `FieldType.MultiSelect` | `MultiSelectFieldComponent` | `<key>-trigger` | `<key>-option-<hash>` (+ `-select-all`, `-clear`) | mesmo padrão, dropdown fica aberto pra múltiplas seleções — `Escape` pra fechar |
| `FieldType.MiniSelect` | `MiniSelectComponent` | `<key>-trigger` | `<key>-option-<hash>` | igual ao Select (sem `-clear`) |
| `FieldType.Date` | `DateFieldComponent` | `input-<key>` | — | `.fill('yyyy-mm-dd')` |
| `FieldType.Text` | `TextFieldComponent` | `input-<key>` | — | `.fill('texto')` |
| `FieldType.Checkbox` | `CheckboxFieldComponent` | `input-<key>` | — | `.check()` / `.click()` |
| `FieldType.Toggle` | `ToggleFieldComponent` | `input-<key>` | — | `.click()` |
| `FieldType.CustomRadio` | `CustomRadioComponent` | (sem testid no host) | `<key>-<option.hash>` | `.click()` direto na opção |
| `FieldType.TagToggle` | `TagToggleComponent` | **nenhum `data-testid` hoje** | — | ver aviso abaixo |
| `'textarea'` (fora do enum) | `TextareaFieldComponent` | `input-<key>` | — | `.fill('texto')` |
| `'number'` (fora do enum) | `NumberFieldComponent` | `input-<key>` | — | `.fill('123')` |
| `'time'` (fora do enum) | `TimeFieldComponent` | `input-<key>` | — | `.fill('14:30')` |
| `'money'` (fora do enum) | `MoneyFieldComponent` | `input-<key>` | — | `.fill('1234')` (dígitos, formatação é automática) |
| `'file'` (fora do enum) | `FilesFieldComponent` | `input-<key>` (hidden) | — | `.setInputFiles(caminho)` |
| `'radio'` (fora do enum) | `RadioFieldComponent` | (sem testid no host) | `<key>-<option.hash>` | `.click()` direto na opção |

`<key>` acima é o `field.key` da config (ex.: `hashAnoLetivo`) — é o mesmo valor usado como
`fieldId` internamente, graças à injeção `@Inject('key')` (ver `plano-refatoracao-testabilidade.md`
pra contexto de por que isso importa: componentes mais antigos esperavam `@Inject("name")`, que
não existe em `FilterItemConfig` — se um teste seu não encontrar o testid esperado num filtro
antigo que nunca foi tocado, essa é a primeira coisa a checar).

**⚠️ Aviso — `FieldType.TagToggle` não tem `data-testid`.** Se a config que você for testar tiver
um campo desse tipo, não invente seletor CSS pra ele — ou (a) use `getByRole`/texto como fallback
documentado, ou (b) trate como pré-requisito adicionar o testid no `TagToggleComponent` primeiro
(mesmo padrão dos outros componentes, `[attr.data-testid]="fieldId ? fieldId + '-trigger' : null"`
no host). A skill `/criar-teste-filtro` sinaliza isso em vez de gerar um seletor que não existe.

---

## 3. Testids do próprio `<filtro>` (fora dos campos)

| Elemento | Testid |
|---|---|
| Botão "Filtro" (abre o painel) | `filtro-<config.id>-btn-toggle` |
| Botão fechar painel (X) — só existe se `id_toggle` estiver na config | `filtro-<config.id>-btn-fechar` |
| Campo de busca livre — só existe se `showSearchField: true` | `filtro-<config.id>-busca` |
| Botão "Limpar" | `filtro-<config.id>-btn-limpar` |
| Botão "Aplicar" | `filtro-<config.id>-btn-aplicar` |
| Wrapper de cada campo (útil pra escopar quando o `key` sozinho for ambíguo) | `filtro-<config.id>-campo-<key>` |

---

## 4. Testando cascata (`watch_list` / `dependency_list`)

Regra de comportamento (confirmada lendo `dependencyValidator`, `FilterFieldWrapperComponent` e os
getters `isDisabled` dos componentes de campo):

- Um campo com `dependency_list: [X, Y]` fica **visualmente desabilitado** (trigger com
  `[disabled]`) enquanto **qualquer** campo cujo `type` esteja em `[X, Y]` estiver vazio.
- Um campo com `watch_list: [X]` **recarrega suas opções via API** sempre que o campo de `type: X`
  mudar de valor — mas só dispara a chamada se as dependências (se houver) já estiverem
  satisfeitas.
- `dependency_list` não precisa ser só o nível imediatamente anterior — pode acumular a cadeia
  inteira (ex.: um campo no nível 4 pode listar `[Rede, Tipo, Segmento]`, não só `[Segmento]`).
  Isso não muda o teste (ainda é "desabilitado até todos preenchidos"), só a quantidade de campos
  que o teste precisa preencher antes de esperar o campo habilitar.
- `preventResetOnDependencyClear: true` faz o campo **não** ser resetado quando uma dependência
  muda — só desabilitado. Sem essa flag (padrão), o campo é limpo.

**Receita de teste para cada nível > 0 da cascata:**

```ts
// nível 2 depende do nível 1 (ex.: Rede depende de Ano Letivo)
test('Rede fica desabilitado até Ano Letivo ser selecionado', async ({ page }) => {
  await expect(page.getByTestId('hashRede-trigger')).toBeDisabled();

  await page.getByTestId('hashAnoLetivo-trigger').click();
  await page.getByTestId(`hashAnoLetivo-option-${ANO_LETIVO.hash}`).click();

  await expect(page.getByTestId('hashRede-trigger')).toBeEnabled();
});

test('trocar Ano Letivo dispara nova chamada de Rede', async ({ page }) => {
  let chamadas = 0;
  await page.route('**/filter-rede', route => { chamadas++; route.fulfill({ json: { isSuccess: true, data: [REDE] } }); });

  await page.getByTestId('hashAnoLetivo-trigger').click();
  await page.getByTestId(`hashAnoLetivo-option-${ANO_LETIVO.hash}`).click();
  expect(chamadas).toBe(1);

  await page.getByTestId('hashAnoLetivo-trigger').click();
  await page.getByTestId(`hashAnoLetivo-option-${ANO_LETIVO_2.hash}`).click();
  expect(chamadas).toBe(2); // recarregou de novo
});
```

---

## 5. Testando `sideEffects` (campos que se ajustam sozinhos)

`sideEffects` (documentado no `README.md` do módulo, usado em produção em
`filtro-diario-de-classe.ts`) deixa um campo reescrever propriedades de **outro** campo quando um
terceiro muda — não é `watch_list` (que só recarrega opções de Select/MultiSelect); funciona pra
qualquer `field_type` e qualquer propriedade (`min`, `max`, `value`, etc.):

```typescript
sideEffects: [{
  trigger: FilterType.AnoLetivo,
  target: 'dataInicio',   // key do campo alvo
  apply: ({ formValue, fieldOptions }) => ({ min: `${ano}-01-01`, max: `${ano}-12-31`, value: `${ano}-01-01` }),
}]
```

**Teste**: selecionar o Ano Letivo e verificar que o `<input type="date">` do campo `dataInicio`
teve seus atributos HTML `min`/`max` atualizados (e opcionalmente que o valor foi preenchido
automaticamente):

```ts
await page.getByTestId('hashAnoLetivo-trigger').click();
await page.getByTestId(`hashAnoLetivo-option-${ANO_LETIVO.hash}`).click();

const dataInicio = page.getByTestId('input-dataInicio');
await expect(dataInicio).toHaveAttribute('min', '2025-01-01');
await expect(dataInicio).toHaveAttribute('max', '2025-12-31');
await expect(dataInicio).toHaveValue('2025-01-01');
```

---

## 6. Testando persistência (localStorage)

`FiltroStorageService` salva em `localStorage['filtro_<config.id>']` (não confundir com as chaves
de sessão gravadas pelo `storageState` da autenticação — ver guia anterior, seção 3). Pontos que
importam pro teste:

- **Expira em 10 dias** (ou `storageTTL` horas, se a config definir) e **é invalidado se o hash do
  usuário logado mudar** — como todos os testes reaproveitam a mesma sessão (o mesmo usuário e2e
  dedicado, via `storageState`), isso não é problema entre execuções por causa de troca de usuário,
  mas **é** problema se você reusar a mesma `page`/contexto entre testes sem limpar o storage: o
  segundo teste herda o filtro "aplicado" do primeiro.
- **Regra prática: sempre `localStorage.clear()` no início de cada teste** (ou use um contexto novo
  por teste, que é o padrão do Playwright), a menos que o teste seja especificamente sobre
  persistência.
- Quando `aplicado: true` está salvo, campos Select/MultiSelect com `useStorage !== false` (padrão)
  **recuperam do cache (`optionsData`) em vez de rechamar a API**. Se seu teste mocka
  `**/filter-rede` esperando que ela seja chamada, e o storage já tiver esse filtro "aplicado" de
  uma execução anterior, a chamada pode nunca acontecer — o teste trava ou dá falso negativo.

**Teste de "o filtro lembra a última busca":**

```ts
test('mantém o filtro aplicado após recarregar a página', async ({ page }) => {
  await irParaListagem(page);       // já limpa localStorage no início, ver guia anterior
  await aplicarFiltro(page);
  await expect(page.getByTestId('hashAnoLetivo-trigger')).toContainText(ANO_LETIVO.descricao);

  await page.reload();              // reload de página de verdade, não navegação SPA

  // não precisa reaplicar — o storage já recupera o valor
  await expect(page.getByTestId('hashAnoLetivo-trigger')).toContainText(ANO_LETIVO.descricao);
});
```

---

## 7. Caso de teste de regressão real — cascata com data inválida

Documentado em `cards/show_case_filtro/filtro_bug_cascata_campo_data.md`: um filtro com
`FieldType.Date` sem `min` configurado permite digitar uma data inválida e a cascata avança mesmo
assim (a API downstream é quem rejeita, tarde demais). Se o bug for corrigido (camadas descritas no
card: `min` na config + validators `dateMin`/`dateMax` em `buildFormControl` + checagem de
`control.valid` em `fieldUpdate`), este é o teste que comprova a correção — e que pega regressão
se alguém reintroduzir o bug:

```ts
test('não dispara cascata com data fora do range mínimo', async ({ page }) => {
  let chamouRede = false;
  await page.route('**/filter-rede', route => { chamouRede = true; route.fulfill({ json: { isSuccess: true, data: [] } }); });

  await page.getByTestId('input-data').fill('2017-01-01'); // antes do min configurado

  // dá tempo do valueChanges/fieldUpdate processarem, sem usar waitForTimeout fixo:
  await expect(page.getByTestId('input-data')).toHaveJSProperty('validity.valid', false).catch(() => {});
  await expect.poll(() => chamouRede).toBe(false);
});
```

---

## 8. Checklist de casos de teste por filtro

Ao testar QUALQUER filtro novo, deriving da config:

- [ ] Aplicar com todos os campos obrigatórios preenchidos → lista aparece
- [ ] Não deixa aplicar (ou aplica vazio) se um campo `required: true` estiver vazio
- [ ] Cada campo com `dependency_list` está desabilitado até a dependência ser satisfeita
- [ ] Cada campo com `watch_list` recarrega ao mudar o campo observado
- [ ] Campos com `autostart: true` já vêm com opções carregadas no load, sem interação
- [ ] Campos com `selectFirst: true` já vêm com a 1ª opção selecionada
- [ ] Se `showSearchField: true` — busca livre filtra a lista já carregada
- [ ] Se algum campo tem `showSelectTag: true` — tag aparece após aplicar, some ao limpar
- [ ] Botão "Limpar" reseta todos os campos e o storage
- [ ] Se houver `sideEffects` — o campo alvo reflete o `apply()` corretamente
- [ ] Reload da página mantém o filtro aplicado (storage) — a menos que o teste seja sobre estado
      limpo, sempre `localStorage.clear()` antes

---

## 9. Onde ver um exemplo com quase todos os `FieldType` de uma vez

`app/features/exemplos/filtros/filtro_exemplo_macroturmas.ts` (config `id: 'filtro_macroturma'`,
renderizada em `/exemplos/filtros` via `FiltrosComponent`) cobre Select, MultiSelect, Date, Text,
Toggle, Checkbox e CustomRadio numa única config, usando `MockFiltroApiService`
(`filtro_exemplo.api.ts`) — não precisa mockar `page.route`, os dados já são fixos internamente.
É o melhor lugar pra validar rapidamente se uma convenção de testid nova realmente funciona antes
de aplicar num filtro de produção.

---

## Referências

- `cards/show_case_filtro/filtromodule_descricao_tecnica.md` — descrição técnica completa do
  módulo (arquitetura, todos os inputs/outputs, métodos públicos).
- `cards/show_case_filtro/filtro_bug_cascata_campo_data.md` — bug real de cascata (seção 7).
- `shared/filtro/README.md` (no repositório) — documentação oficial, mas **desatualizada**: lista
  só 7 `FieldType` e não menciona `TagToggle`/`MiniSelect`. Confie na tabela da seção 2 deste guia,
  que foi conferida contra o enum e o `component.map.ts` reais.
