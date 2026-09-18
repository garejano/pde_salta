# Refatorar Angular — Módulo ou Componente

> **Skill de refatoração** — moderniza código Angular (componentes, módulos, services)
> para os padrões atuais descritos em `framework_skills/angular_skills/angular-developer/`.

Quando o usuário pedir para "Refatora", "Moderniza", "Migra" ou "Atualiza" um componente,
módulo ou service Angular, siga este processo.

---

## Inputs esperados

Antes de iniciar, confirme:

- **Arquivo(s) alvo** — caminho(s) do componente/módulo/service a refatorar; se não informado, derive a partir do repositório e do mapa de frontend
- **Versão do Angular** — se não informada, leia o `package.json` do projeto
- **Escopo** — o que deve (e o que não deve) ser refatorado; se não informado, aplique todas as regras cabíveis

---

## Processo

### 0. Localização do código

> Execute esta seção **apenas se o usuário não tiver apontado um arquivo concreto**.  
> Se um caminho foi fornecido, pule para a seção **0. Preparação**.

**0a.1 — Identificar o repositório-alvo**

Leia `_inbox/repository_map.md` e localize o repositório com base nas palavras-chave do card/funcionalidade.
Anote:
- `REPO_PATH` — caminho base (ex.: `c:/projects/estrutura-pedagogica`)
- `REPO_STACK` — stack do repositório (confirma que é Angular e a versão estimada)
- `FRONTEND_MAP` — entrada correspondente em `frontend-maps/<repo>-angular-map.md`

**0a.2 — Carregar o mapa de frontend**

Antes de explorar arquivos individuais:
1. Verifique se existe `frontend-maps/<repo>-angular-map.md`
2. Cheque `frontend-maps/changelog.md` — se o mapa tiver mais de 30 dias, avise o usuário e sugira `/bench-scan-front`
3. Carregue o mapa completo para entender a estrutura de features, components, services e rotas

**0a.3 — Localizar o artefato pelo mapa**

Com o mapa carregado, identifique o caminho do componente/módulo/service usando:
- Nome da feature ou funcionalidade mencionada pelo usuário
- Nome do componente (ex.: `listar`, `form`, `detalhe`) dentro da feature
- Tipo de artefato (component, service, pipe, guard)

Exemplo: se o usuário pede "refatora o componente de listagem de turmas":
- Buscar no mapa por feature `turmas` ou `turma`
- Localizar o componente `listar` dentro dessa feature
- Derivar o caminho: `{REPO_PATH}/frontend/src/app/features/turmas/listar/listar.component.ts`

**0a.4 — Confirmar o caminho com o usuário antes de prosseguir**

Apresente o(s) arquivo(s) identificado(s) e aguarde confirmação antes de ler o código.

---

### 0. Preparação

**0.1 — Ler a versão do Angular**

Leia `package.json` do projeto-alvo e anote a versão em `@angular/core`.
A versão define quais padrões são aplicáveis:
- v17+: controle de fluxo nativo (`@if`, `@for`, `@switch`) e standalone por padrão
- v19+: `input()`, `output()`, `model()` signals estáveis
- v21+: Signal Forms recomendado

**0.2 — Carregar as referências do framework**

Leia os arquivos relevantes de `framework_skills/angular_skills/angular-developer/references/`
conforme o que o código-alvo contém:

| Código detectado | Referência a carregar |
|-----------------|----------------------|
| `@Input()` / `@Output()` | `inputs.md`, `outputs.md` |
| `*ngIf`, `*ngFor`, `*ngSwitch` | `components.md` |
| `@HostBinding`, `@HostListener` | `host-elements.md` |
| `NgModule` | `migrations.md` |
| `FormControl`, `FormGroup` | `signal-forms.md`, `reactive-forms.md` |
| `@Injectable`, `constructor(private ...)` | `di-fundamentals.md`, `creating-services.md` |
| `BehaviorSubject`, `Subject` como state | `signals-overview.md`, `linked-signal.md`, `effects.md` |
| `@angular/animations` DSL | `angular-animations.md` |
| `subscribe()` para async data | `resource.md` |

**0.3 — Ler e analisar o código-alvo**

Leia o(s) arquivo(s) alvo e identifique:
- Padrões legados presentes
- Dependências externas que podem ser afetadas
- Componentes filhos ou pais que referenciam inputs/outputs sendo migrados

**0.4 — Apresentar plano de refatoração e aguardar confirmação**

Liste explicitamente:
- O que será migrado e por quê
- O que NÃO será migrado (e por quê, se relevante)
- Se houver breaking changes para consumidores do componente, sinalize

**Aguarde confirmação antes de alterar qualquer arquivo.**

---

### 1. Inputs — `@Input()` → `input()` signal

**Aplique quando:** versão ≥ v19 e o componente usa `@Input()`.
**Referência:** `framework_skills/angular_skills/angular-developer/references/inputs.md`

```typescript
// ANTES
@Input() value: string = '';
@Input({ required: true }) title!: string;
@Input({ alias: 'labelText' }) label = '';

// DEPOIS
value = input('');
title = input.required<string>();
label = input('', { alias: 'labelText' });
```

Regras:
- `input()` retorna um `Signal` — acessar com `this.value()` no .ts, `value()` no template
- Remover `Input` do `import` se não houver mais usos
- Verificar todos os templates que fazem binding `[value]="..."` — o binding externo NÃO muda
- Atualizar toda lógica interna que usava `this.value` (sem parênteses) → `this.value()`

---

### 2. Outputs — `@Output() + EventEmitter` → `output()`

**Aplique quando:** versão ≥ v19 e o componente usa `@Output()`.
**Referência:** `framework_skills/angular_skills/angular-developer/references/outputs.md`

```typescript
// ANTES
@Output() selected = new EventEmitter<string>();
this.selected.emit('value');

// DEPOIS
selected = output<string>();
this.selected.emit('value');  // mesma API de emit
```

Regras:
- `output()` NÃO é um Signal — não chamar com `()`
- Remover `Output`, `EventEmitter` dos imports se não houver mais usos
- Bindings externos `(selected)="handler($event)"` NÃO mudam

---

### 3. Model inputs (two-way binding) — `@Input() + @Output()` → `model()`

**Aplique quando:** existe par `@Input() x` + `@Output() xChange` (padrão banana-in-a-box).
**Referência:** `framework_skills/angular_skills/angular-developer/references/inputs.md`

```typescript
// ANTES
@Input() value = '';
@Output() valueChange = new EventEmitter<string>();

// DEPOIS
value = model('');
// this.value() para ler, this.value.set('x') para escrever
```

---

### 4. Host bindings — `@HostBinding` / `@HostListener` → `host` property

**Aplique quando:** o componente usa `@HostBinding` ou `@HostListener`.
**Referência:** `framework_skills/angular_skills/angular-developer/references/host-elements.md`

```typescript
// ANTES
@HostBinding('class.active') isActive = false;
@HostListener('click', ['$event']) onClick(e: Event) { ... }

// DEPOIS — no decorator @Component:
host: {
  '[class.active]': 'isActive',
  '(click)': 'onClick($event)'
}
```

---

### 5. Controle de fluxo — `*ngIf`, `*ngFor`, `*ngSwitch` → `@if`, `@for`, `@switch`

**Aplique quando:** versão ≥ v17 e o template usa diretivas estruturais legadas.
**Referência:** `framework_skills/angular_skills/angular-developer/references/components.md`

```html
<!-- ANTES -->
<div *ngIf="show">...</div>
<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
<div [ngSwitch]="status">
  <span *ngSwitchCase="'active'">Ativo</span>
  <span *ngSwitchDefault>Inativo</span>
</div>

<!-- DEPOIS -->
@if (show) { <div>...</div> }
@for (item of items; track item.id) { <li>{{ item.name }}</li> }
@switch (status) {
  @case ('active') { <span>Ativo</span> }
  @default { <span>Inativo</span> }
}
```

Regras:
- `@for` **exige** `track` — usar campo único (ex: `track item.id`) ou `track $index`
- Remover `NgIf`, `NgFor`, `NgSwitch` dos `imports` do componente se não houver mais usos
- Se o componente era parte de um NgModule, verificar se ainda precisa dessas diretivas via módulo

---

### 6. Injeção de dependências — constructor injection → `inject()`

**Aplique quando:** o service/componente usa `constructor(private ...)`.
**Referência:** `framework_skills/angular_skills/angular-developer/references/di-fundamentals.md`

```typescript
// ANTES
constructor(
  private router: Router,
  private service: MyService
) {}

// DEPOIS
private router = inject(Router);
private service = inject(MyService);
```

Regras:
- `inject()` deve estar em field initializer (fora do constructor)
- Remover o `constructor` se ficar vazio após migração
- `inject()` está disponível sem importação extra (reexportado de `@angular/core`)

---

### 7. State reativo — `BehaviorSubject + subscribe` → `signal()`

**Aplique quando:** o componente usa `BehaviorSubject`, `Subject` ou `ReplaySubject` apenas para state local (não para streams de eventos inter-componente).
**Referência:** `framework_skills/angular_skills/angular-developer/references/signals-overview.md`, `linked-signal.md`, `effects.md`

```typescript
// ANTES
private _count = new BehaviorSubject(0);
count$ = this._count.asObservable();
increment() { this._count.next(this._count.value + 1); }

// DEPOIS
count = signal(0);
increment() { this.count.update(c => c + 1); }
```

Regras:
- State derivado: usar `computed()` em vez de `combineLatest + map`
- State writable derivado: usar `linkedSignal()` em vez de `effect()` para sync
- **NUNCA** usar `effect()` para sincronizar dois signals — causa loops e ExpressionChangedAfterChecked
- `async` pipe no template não é necessário para signals — usar diretamente: `{{ count() }}`
- **Manter como Observable** quando: stream de eventos push (WebSocket), interop com libs RxJS-first, ou `HttpClient`

---

### 8. Async data fetching — `subscribe` no ngOnInit → `resource()`

**Aplique quando:** o componente faz fetch de dados em `ngOnInit` com `subscribe`.
**Referência:** `framework_skills/angular_skills/angular-developer/references/resource.md`

```typescript
// ANTES
data: MyData[] = [];
ngOnInit() {
  this.service.getData(this.id).subscribe(d => this.data = d);
}

// DEPOIS
data = resource({
  params: () => ({ id: this.id() }),  // reativo se id for signal
  loader: ({ params, abortSignal }) =>
    fetch(`/api/data/${params.id}`, { signal: abortSignal }).then(r => r.json())
});
// no template: data.value(), data.isLoading(), data.error()
```

---

### 9. NgModules → Standalone

**Aplique quando:** o componente/módulo usa `NgModule` e a versão é ≥ v17.
**Referência:** `framework_skills/angular_skills/angular-developer/references/migrations.md`

Preferir a migração via CLI em vez de manual:
```bash
# Fase 1 — converter componentes para standalone
ng generate @angular/core:standalone

# Verificar build
ng build

# Fase 2 — remover NgModules
ng generate @angular/core:standalone

# Fase 3 — bootstrap standalone
ng generate @angular/core:standalone
```

Se a migração manual for necessária:
- Adicionar `standalone: true` ao decorator
- Mover imports do NgModule para o `imports` do componente
- Remover declaração do NgModule
- Verificar se outros componentes dependem do mesmo módulo

---

### 10. Formulários — Reactive/Template-driven → Signal Forms

**Aplique quando:** versão ≥ v21 e o usuário pede explicitamente migração de forms.
**Referência:** `framework_skills/angular_skills/angular-developer/references/signal-forms.md`

> ⚠️ Esta é a refatoração mais invasiva. **Só aplique com confirmação explícita do usuário.**

Regras críticas do Signal Forms:
- **NUNCA** usar `null` como valor inicial — usar `''`, `0`, `[]`
- Chamar field como função: `form.field()` (não `form.field`)
- Submit **DEVE** ser async: `submit(form, async () => {...})`
- **PROIBIDO** no template com `[formField]`: atributos `min`, `max`, `value`, `disabled`, `readonly`

---

### 11. Animações — Legacy DSL → Native Animate API

**Aplique quando:** versão ≥ v20.2 e o componente usa `@angular/animations` DSL.
**Referência:** `framework_skills/angular_skills/angular-developer/references/angular-animations.md`

> ⚠️ **NUNCA misturar** legacy e native no mesmo componente. Migrar completamente ou não migrar.

```html
<!-- DEPOIS: nativo v20.2+ -->
<div animate.enter="fade-in" animate.leave="fade-out">...</div>
```

---

## Verificação final

Após aplicar todas as refatorações selecionadas:

1. **`ng build`** — sem erros de compilação
2. Verificar se componentes consumidores do arquivo refatorado compilam
3. Se houver testes: rodar `ng test` e garantir que passam
4. Listar todos os arquivos modificados

---

## Saída esperada

```
Arquivos modificados:
- path/to/component.ts    (inputs, outputs, inject)
- path/to/component.html  (controle de fluxo)

Refatorações aplicadas:
- [x] @Input() → input() signal
- [x] @Output() → output()
- [x] *ngIf/*ngFor → @if/@for
- [x] constructor injection → inject()
- [ ] Signal Forms (não solicitado)
- [ ] NgModule → Standalone (não aplicável)

ng build: OK
```

---

## O que **não** fazer

- Não migrar Observables de streams de eventos para signals — só state local
- Não aplicar Signal Forms sem confirmação explícita do usuário
- Não misturar `@angular/animations` DSL com native animate API no mesmo componente
- Não alterar bindings externos de componentes pai — só o internals do componente-alvo
- Não remover `constructor` se ainda houver lógica além de injeção de dependências
- Não usar `effect()` para sincronizar dois signals
- Não esquecer `track` no `@for`
- Não rodar `ng build` antes de aplicar todas as refatorações planejadas — só ao final
