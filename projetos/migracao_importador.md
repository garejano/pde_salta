# Migração do Importador — salta-playground → estrutura-pedagogica

## Origem

- Repositório: `c:/projects/salta-playground`
- Rota de exemplo: `src/app/features/exemplos/importador`
- Documentação da ferramenta original: `README.md` no mesmo diretório.

## Objetivo

Migrar a ferramenta **Importador** (upload de planilha `.xls`/`.xlsx`, validação
coluna a coluna contra listas de referência, sugestão de correção por
proximidade textual, geração de payload) do playground para um módulo
reutilizável em `estrutura-pedagogica`, seguindo o mesmo padrão de
componente configurável já usado pelo `filtro`:

```html
<app-importador [config]="configImportacaoProfessores"></app-importador>
```

## Estrutura final

```
estrutura-pedagogica/frontend/src/
  shared/importador/
    importador.module.ts              — declara/exporta ImportadorComponent e ImportadorOverlayComponent
    importador.models.ts              — tipos (TableData, CellData, ColunaImportacao, ConfiguracaoImportacao, ...)
    importador.service.ts             — parsing xlsx, validação de arquivo, obtenção de refData, cálculo de proximidade
    importador-validacao.service.ts   — construção de erros por coluna, atribuição de hashes
    utils/normalize.ts
    click-outside.directive.ts
    _variables.scss                   — paleta/mixins de botão do módulo
    importador/                       — ImportadorComponent (selector: app-importador)
    importador-overlay/               — ImportadorOverlayComponent (selector: app-importador-overlay)
    import-table/                     — ImportTableComponent (selector: app-import-table)
    cell-inspect/                     — CellInspectComponent (selector: app-cell-inspect)
    scroll-container/                 — ScrollContainerComponent (selector: app-scroll-container)

  app/features/exemplos/importador/
    config-importacao-professores.ts  — ConfiguracaoImportacao de exemplo (escola/turma/disciplina/cpf/professor)
    mocks-importacao-professores.ts   — dados mockados de referência
    importador-exemplo.component.ts/html/scss — tela de exemplo, abre o importador via overlay
```

Wiring: `ImportadorModule` importado em `ExemplosModule`; rota `/exemplos/importador`
registrada em `exemplos-routing.module.ts`; card adicionado em `exemplos-dashboard.component.ts`.

## Decisões de adaptação (vs. o protótipo do playground)

1. **Config-driven, sem tela de seleção interna.** O protótipo tinha uma tela
   `SeletorImportacoes` para escolher entre múltiplos tipos de importação
   cadastrados internamente (`configPorTipo`). No módulo migrado isso não existe:
   `ImportadorComponent` recebe **uma única** `ConfiguracaoImportacao` via
   `@Input() config`, exatamente como o `<filtro [config]="...">`. Quem decide
   *qual* importação usar é a tela hospedeira (ex.: `config-importacao-professores.ts`
   fica ao lado da rota de exemplo, não dentro do módulo compartilhado).
2. **`gerador-config` (bootstrap de config a partir de planilha) não foi portado.**
   Era uma ferramenta de desenvolvimento para gerar código `ConfiguracaoImportacao`
   a partir de um arquivo de exemplo — não faz parte do componente de produção.
   Pode ser recriado depois como script/skill separado se for útil.
3. **`ImportadorService.obterRefData` tornou-se genérico.** Antes tinha um
   `switch` hardcoded devolvendo mocks fixos (`mocks.ts` do playground, específico
   da demo de cargas iniciais). Agora lê `config.refData[etapa.key].options`
   (com fallback para `etapa.options`) — mantém o mesmo ponto de extensão para
   troca futura por chamada HTTP real via `refData[etapa.key].url`, mas sem
   acoplar o serviço a dados de um cenário específico.
4. **Removido código morto identificado durante a migração:** `FormBuilder`/`fileForm`
   (formulário reativo criado mas nunca vinculado ao template), `errosAgrupados`
   e `linhasDoErroAtual` (nunca lidos), `isValidFile` e `abrirAjuda()` (stub vazio).
5. **Convenção de nomes alinhada ao `estrutura-pedagogica`:** todos os componentes
   usam sufixo `Component`, `standalone: false` (padrão do `FiltroModule`), e
   selectors prefixados com `app-` (`cell-inspect` → `app-cell-inspect`,
   `scroll-container` → `app-scroll-container`).
6. **`ImportadorOverlayComponent` é novo**, inspirado em
   `shared/document-builder/components/print-overlay/print-overlay.component.ts`,
   mas simplificado: mantém apenas a barra superior (título + fechar) e a área de
   conteúdo em tela cheia (bloqueia scroll do body enquanto aberto). Não reaproveita
   lógica de viewer/paginação/carrossel do print-overlay — isso é específico do
   document-builder e não se aplica a uma ferramenta de importação de dados.
7. **Dependência `xlsx` adicionada** ao `package.json` do `estrutura-pedagogica`
   (`^0.18.5`, mesma versão do playground) e instalada via `npm install`.

## Como usar

```ts
// alguma-tela.component.ts
import { configImportacaoProfessores } from './config-importacao-professores';

export class AlgumaTelaComponent {
  configImportacaoProfessores = configImportacaoProfessores;
  showOverlay = false;

  onImportar(payload: any[]) {
    // enviar payload para a API
  }
}
```

```html
<!-- embutido em uma tela comum -->
<app-importador [config]="configImportacaoProfessores" (importar)="onImportar($event)"></app-importador>

<!-- ou em tela cheia, via overlay -->
<button (click)="showOverlay = true">Exibir importador</button>
<app-importador-overlay *ngIf="showOverlay" label="Importador" (closeEvent)="showOverlay = false">
  <app-importador [config]="configImportacaoProfessores" (importar)="onImportar($event)"></app-importador>
</app-importador-overlay>
```

Exemplo funcional completo em `/exemplos/importador`
(`app/features/exemplos/importador/importador-exemplo.component.ts`).

## Pendências / próximos passos

- `ImportadorService.obterRefData` ainda não chama a API real — hoje só lê
  `config.refData[...].options` estáticos da config. Quando houver endpoint,
  trocar por `HttpClient.get(refData[etapa.key].url)`.
- `enviarParaImportacao()` apenas emite o evento `(importar)` com o payload —
  quem consome decide o que fazer (chamar API, etc.). Nenhuma chamada HTTP é
  feita dentro do módulo compartilhado.
- Avaliar se vale a pena portar o `gerador-config` como skill/script auxiliar
  para acelerar a criação de novas `ConfiguracaoImportacao`.
