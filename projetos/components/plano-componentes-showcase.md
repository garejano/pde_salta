# Plano de implementação — `exemplos/componentes`

> **Status: implementado.** Arquivos criados em
> `app/features/exemplos/componentes-showcase/` + wiring em `exemplos-routing.module.ts`,
> `exemplos.module.ts` e `exemplos-dashboard.component.ts`. Desvios em relação ao esboço
> original deste plano, decididos durante a implementação:
> - `table` e `studentCard` confirmados **não implementados** (breadcrumb já estava certo) —
>   `app-table-wrapper` citado no `frontend-maps` não existe mais no código.
> - Componente usa uma propriedade comum (`selectedId: string`) em vez de `signal()` e sem
>   `ChangeDetectionStrategy.OnPush` — mais simples e consistente com o estilo de `tela-base`
>   (que também usa propriedades comuns); o objetivo de performance ("só o componente ativo
>   monta") já é satisfeito pelo `*ngIf`/`[ngSwitch]` no template, sem precisar de OnPush.
> - `AvatarComponent` (`app/components/avatar`) precisou ser importado direto em
>   `exemplos.module.ts` (é `standalone: true`, não faz parte de `SharedModule`).
> - Não foi criado um `ShowcaseExample[]` por item no catálogo — os rótulos de cada seção de
>   exemplo (`showcase__group-label`) ficaram só no template, como já é o padrão em
>   `tela-base`; o catálogo tipado cobre nome/ícone/seletor/status/descrição, que é o que
>   precisa existir fora do template.
> - **Catálogo estendido para 29 itens** (26 implementados + 3 não implementados), a pedido
>   explícito para cobrir tudo que já existia em `tela-base` e não tinha item correspondente
>   no design original de 19 itens: `tooltip` (directive) e `app-bool-status` entraram em
>   Primitivos; `textarea`, `number`, `select`, `multiselect`, `time`, `money` (os demais campos
>   de `shared/dynamic-components`) e `app-mini-select` entraram em Formulários;
>   `app-navegacao-itens` entrou em Navegação. Cada exemplo também ficou tão exaustivo quanto
>   o correspondente em `tela-base` (todas as variantes/cores/estados/tons demonstrados lá),
>   não só uma amostra.


Contexto e levantamento completo: `./componentes_showcase.md`. Repositório alvo:
`c:/projects/estrutura-pedagogica/frontend`.

---

## 1. Estrutura de arquivos

Novo componente, não-standalone, seguindo o mesmo padrão de `tela-base` e
`document-builder-blocks` (ambos declarados em `ExemplosModule`, sem imports próprios de
`SharedModule`/`DynamicComponentsModule`):

```
app/features/exemplos/componentes-showcase/
  componentes-showcase.component.ts
  componentes-showcase.component.html
  componentes-showcase.component.scss
  componentes-showcase.catalog.ts       <- array TS do catálogo (requisito: lista fora do template)
```

Arquivo `.catalog.ts` separado (em vez de tudo dentro do `.component.ts`) porque a lista vai
crescer bastante (19+ itens, cada um com exemplos) — mantém o `.component.ts` focado em estado/lógica
e o catálogo isolado, fácil de escanear e editar.

## 2. Modelo de dados do catálogo

```typescript
// componentes-showcase.catalog.ts
export type ShowcaseStatus = 'implementado' | 'nao-implementado';

export interface ShowcaseExample {
  label: string;        // ex.: "Variantes", "Com ícone e tamanho pequeno"
  note?: string;        // observação livre (ex.: diferença em relação ao design — ver seção "alert"/"toast"/"filterbar")
}

export interface ShowcaseItem {
  id: string;            // mesmo id do design (button, tag, breadcrumb, ...)
  name: string;          // nome exibido na sidebar
  icon: string;           // ícone material (mesmo do design)
  selector?: string;      // seletor real (ex.: 'app-tag'); ausente quando status = 'nao-implementado'
  status: ShowcaseStatus;
  description: string;   // texto explicativo (adaptado do `desc` do design + notas de API real)
  examples: ShowcaseExample[]; // rótulos das seções de exemplo — o *render* de cada exemplo fica no template, ver seção 4
}

export interface ShowcaseGroup {
  label: string;          // Primitivos | Formulários | Navegação | Estrutura
  items: ShowcaseItem[];
}

export const COMPONENTES_SHOWCASE_CATALOG: ShowcaseGroup[] = [ /* ... */ ];
```

Preencher os 4 grupos / 19 itens listados em `componentes_showcase.md`, usando a coluna
"Selector real" / "Status" da tabela de mapeamento. `breadcrumb` e `studentCard` entram com
`status: 'nao-implementado'` e sem `selector`.

## 3. Componente principal

```typescript
@Component({
  selector: 'app-componentes-showcase',
  templateUrl: './componentes-showcase.component.html',
  styleUrls: ['./componentes-showcase.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentesShowcaseComponent {
  groups = COMPONENTES_SHOWCASE_CATALOG;
  selectedId = signal<string>(this.groups[0].items[0].id);

  select(id: string): void { this.selectedId.set(id); }

  get selectedItem(): ShowcaseItem {
    return this.groups.flatMap(g => g.items).find(i => i.id === this.selectedId())!;
  }
}
```

Dados mockados para os exemplos (aluno fictício, opções de select, etc.) ficam no
`.component.ts` como propriedades comuns — mesmo padrão do `tela-base.component.ts`
(`templateOpcoes`, `miniSelectEstados`, `tagYearList`, ...). Não precisam entrar no catálogo
tipado; o catálogo só descreve *o que existe*, não os dados de cada exemplo.

## 4. Template — layout sidebar + painel único

```html
<div class="cs-layout">
  <nav class="cs-sidebar">
    <ng-container *ngFor="let group of groups">
      <span class="cs-sidebar__group-label">{{ group.label }}</span>
      <button
        *ngFor="let item of group.items; trackBy: trackById"
        class="cs-sidebar__item"
        [class.cs-sidebar__item--active]="item.id === selectedId()"
        (click)="select(item.id)"
      >
        <span class="material-icons-outlined">{{ item.icon }}</span>
        {{ item.name }}
        <span *ngIf="item.status === 'nao-implementado'" class="cs-badge cs-badge--pending">não implementado</span>
      </button>
    </ng-container>
  </nav>

  <section class="cs-panel">
    <header class="cs-panel__header">
      <h3>{{ selectedItem.name }}</h3>
      <span class="cs-badge" [class.cs-badge--pending]="selectedItem.status === 'nao-implementado'">
        {{ selectedItem.selector || 'não implementado' }}
      </span>
      <p>{{ selectedItem.description }}</p>
    </header>

    <ng-container [ngSwitch]="selectedItem.id">
      <div *ngSwitchCase="'button'" class="showcase__group">
        <!-- exemplos reais de app-button aqui, reaproveitando .showcase__row/.showcase__item de tela-base -->
      </div>
      <div *ngSwitchCase="'breadcrumb'" class="cs-not-implemented">
        Componente ainda não implementado em <code>shared/</code>.
      </div>
      <!-- ...um ngSwitchCase por item... -->
    </ng-container>
  </section>
</div>
```

Pontos importantes:

- **`[ngSwitch]` no id selecionado, não `*ngFor` com `*ngIf` por item** — só o bloco do
  componente ativo entra no DOM. Evita montar 19 blocos de exemplos (vários com componentes
  pesados, ex. `app-filtro`, `app-modal`) de uma vez — é o requisito de "template enxuto e
  performático" do pedido original.
- Reaproveitar as classes `.showcase__group` / `.showcase__row` / `.showcase__item` /
  `.showcase__item-label` de `tela-base.component.scss` para o *conteúdo* de cada
  `ngSwitchCase` (import via `@use`/`@extend` ou duplicar a definição mínima — decidir ao
  implementar, mas não reinventar uma terceira convenção de classe para "grade de exemplos").
- Badge de status (`cs-badge--pending` = "não implementado") segue o vocabulário visual já
  criado em `document-builder-blocks.component.scss` (`.badge--pending`), adaptado com um
  terceiro estado — ver seção 5.
- Item com `status: 'nao-implementado'` ainda é clicável na sidebar (mostra a descrição do que
  o design pedia + aviso), só não tem `ngSwitchCase` com componente real.

## 5. Vocabulário visual (reaproveitar, não recriar)

Basear o SCSS novo nas classes já existentes em `document-builder-blocks.component.scss`:
`.badge`, `.badge--selector`, `.badge--example`, `.badge--pending`, `.chip`, `.chip--input`.
Adicionar apenas o que falta:

- Layout de sidebar + painel (não existe precedente no repo — vem do design HTML: largura fixa
  da sidebar, item ativo com fundo `#E3E5FB` / texto `#242CC2` conforme extraído do bundle).
- Um estado de badge a mais além de `--example`/`--pending`: **"não implementado"** (item do
  design sem componente em código — diferente de "sem exemplo" do `document-builder-blocks`,
  que é usado para componente que existe mas não tem preview). Sugestão: `.badge--missing` com
  cor neutra/cinza para não confundir com o `--pending` (amber) já usado para "sem exemplo".

## 6. Roteamento

`app/features/exemplos/exemplos-routing.module.ts` — adicionar dentro do bloco
`environment.useExempleModule`, junto dos demais:

```typescript
{
  path: 'componentes',
  component: ComponentesShowcaseComponent,
},
```

`app/features/exemplos/exemplos.module.ts` — adicionar `ComponentesShowcaseComponent` em
`declarations` (já tem `SharedModule`/`DynamicComponentsModule`/`FormsModule` nos `imports` do
módulo, cobre todos os componentes do catálogo sem import extra).

`app/features/exemplos/exemplos-dashboard/exemplos-dashboard.component.ts` — adicionar um
`ExemploCard` em `uiCards`, no mesmo formato dos existentes:

```typescript
{
  label: 'Showcase de Componentes',
  description: 'Catálogo navegável de todos os componentes de shared/, com status de implementação.',
  route: '/exemplos/componentes',
  icon: 'view_module',
  iconColor: 'indigo',
  chips: [{ label: 'catálogo' }, { label: 'shared' }],
},
```

## 7. Ordem de execução sugerida

1. Criar `componentes-showcase.catalog.ts` com os 19 itens + status (tabela de
   `componentes_showcase.md` já pronta pra copiar).
2. Criar o componente (ts/html/scss) só com sidebar + painel vazio (`ngSwitch` sem casos) e
   validar navegação/estado ativo.
3. Preencher `ngSwitchCase` a caso, grupo por grupo (Primitivos → Formulários → Navegação →
   Estrutura), reaproveitando dados mockados de `tela-base.component.ts` onde já existem
   (`templateOpcoes`, `tagYearList`, `miniSelectEstados`, etc.) em vez de recriar.
3.1. Para `alert`, `toast` e `filterbar`: seguir a API real do componente (ver tabela de
   mapeamento em `componentes_showcase.md`), documentando a diferença em relação ao design
   via `note` no catálogo — não gastar tempo tentando replicar a API do mockup.
4. Casos `breadcrumb` e `studentCard`: só o texto "não implementado" (sem `ngSwitchCase`
   correspondente — cai no `default` do `ngSwitch` mostrando a descrição do que falta).
5. Wiring final: rota + card no dashboard (seção 6).
6. Validar manualmente: cada item da sidebar troca o painel corretamente, nenhum exemplo de
   outra categoria fica montado no DOM (inspecionar via devtools), badges de status corretos.
