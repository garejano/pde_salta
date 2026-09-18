# Análise de performance/memory leak — frontend, aba Configurações (documentacao-pedagogica)

**Data:** 2026-09-09
**Repositório:** `estrutura-pedagogica` (frontend)
**Branch:** `projetos/MigracaoDocPed`
**Escopo:** os 6 componentes do fluxo — hub (`configuracao-documentacao-pedagogica.component.ts`),
`geral/`, `rede-documentos-tab/`, `escolas-tab/`, `fundamentacao-legal-tab/` +
`fundamentacao-legal-editor.component.ts`.

> **Status: implementado (2026-09-09).** Os 3 achados corrigíveis (1, 2 e 3) foram aplicados no
> código de produção. Achado 2 foi estendido, a pedido do usuário, para cobrir também os 5 saves
> de `rede-documentos-tab` (hoje mockados, mas já preparados pra quando forem plugados no backend
> real). Nenhum teste automatizado foi rodado após a correção (ver observação ao final).

---

## Resumo

| # | Achado | Severidade | Categoria | Status |
|---|--------|------------|-----------|--------|
| 1 | Duas assinaturas RxJS de longa duração morrem para sempre no primeiro erro de rede | **Alta** | Correção (não é leak) | ✅ Corrigido |
| 2 | `salvando`/`loading` nunca resetam em erro (em qualquer fluxo real de salvar/buscar) | Média | Correção (mesma raiz do #1) | ✅ Corrigido (nos 3 fluxos reais + preventivamente nos 5 mockados de rede) |
| 3 | `rede-documentos-tab` depende implicitamente do round-trip de `@Output` para re-renderizar sob `OnPush` | Baixa | Fragilidade, não é bug hoje | ✅ Corrigido |
| 4 | Vazamento de subscription (RxJS) | **Nenhum encontrado** | — | — |
| 5 | Performance (volume de dados, CD, virtualização) | **Nenhum problema encontrado** | — | — |

---

## Achado 1 — Assinaturas que morrem para sempre no primeiro erro

**Arquivos:**
- `configuracao-documentacao-pedagogica.component.ts` (seletor de rede do hub)
- `escolas-tab/escolas-tab.component.ts` (abertura de escola)

### Causa raiz

Os dois componentes usam o mesmo padrão: um `Subject` de longa duração (vive todo o ciclo de vida do componente), encadeado com `switchMap` para cancelar a busca anterior quando uma nova seleção chega, com **uma única inscrição feita em `ngOnInit()`**:

```typescript
// configuracao-documentacao-pedagogica.component.ts
private selecionarRede$ = new Subject<string>();

ngOnInit(): void {
   this.selecionarRede$.pipe(
      tap(() => { this.loading = true; }),
      switchMap((hashRede) => this.redeService.getConfiguracaoRede(hashRede).pipe(
         switchMap((rede) => forkJoin([this.escolaService.getEscolasPorRede(rede.hash), this.fundamentacaoService.getFundamentacoesLegais(rede.hash)])),
      )),
      takeUntilDestroyed(this.destroyRef),
   ).subscribe(([escolas, fundamentacoes]) => { /* só next, sem error */ });
}
```

```typescript
// escolas-tab.component.ts
private abrirEscola$ = new Subject<ListarEscolaDocPedResponse>();

ngOnInit(): void {
   this.abrirEscola$.pipe(
      tap(...),
      switchMap((escola) => this.escolaService.getEscolaPorHash(...).pipe(switchMap(...))),
      takeUntilDestroyed(this.destroyRef),
   ).subscribe((resultado) => { /* só next, sem error */ });
}
```

Em RxJS, **erro é um evento terminal**: se `getConfiguracaoRede`/`getEscolasPorRede`/`getFundamentacoesLegais`/`getEscolaPorHash`/`getAnosLetivos` falhar (o `catchError` de cada service — ver `handleApiError.service.ts` — mostra o toast e **relança** o erro com `throwError`, nunca absorve num valor de fallback), o erro atravessa o `switchMap` e mata a **assinatura inteira** feita em `ngOnInit`. O `Subject` (`selecionarRede$`/`abrirEscola$`) continua vivo e aceitando `.next()`, mas **não há mais ninguém ouvindo** — a partir daí, clicar em outra rede ou em outra escola não faz mais nada, silenciosamente, até a página ser recarregada.

Isso não é um vazamento de memória (é o oposto: a subscription morre corretamente) — é uma **quebra funcional definitiva de uma feature inteira a partir de um único erro de rede transitório** (timeout, backend fora do ar por um instante, sessão expirada). Como `getConfiguracaoRede`, `getEscolasPorRede`, `getFundamentacoesLegais`, `getEscolaPorHash` e `getAnosLetivos` já são chamadas reais hoje, isso é **reproduzível agora**, não é um problema latente.

### Como reproduzir
1. Abrir a aba Configurações, selecionar uma rede (funciona).
2. Forçar uma falha de rede na próxima chamada de `getConfiguracaoRede` (ex.: desligar o backend por um instante, ou um 500 pontual).
3. Selecionar outra rede.
4. Restaurar a rede/backend e tentar selecionar qualquer rede de novo → **nada acontece**. Só um reload da página recupera.

O mesmo vale para `escolas-tab`: uma falha ao abrir uma escola trava a abertura de **qualquer** escola depois, na mesma sessão de página.

### Correção proposta

Adicionar `catchError` **dentro** do pipe interno do `switchMap` (não no pipe externo), devolvendo um valor de fallback em vez de deixar o erro propagar até a assinatura externa — padrão clássico de RxJS para não matar um `Subject` de longa duração:

```typescript
// configuracao-documentacao-pedagogica.component.ts
switchMap((hashRede) => this.redeService.getConfiguracaoRede(hashRede).pipe(
   switchMap((rede) => {
      this.redeSelecionada = rede;
      return forkJoin([this.escolaService.getEscolasPorRede(rede.hash), this.fundamentacaoService.getFundamentacoesLegais(rede.hash)]);
   }),
   catchError(() => {
      this.loading = false;
      return of(null); // sentinela — a busca desta rede falhou, mas o Subject continua vivo
   }),
)),
...
.subscribe((resultado) => {
   if (!resultado) { return; } // erro já tratado (toast) e loading já resetado no catchError
   const [escolas, fundamentacoes] = resultado;
   ...
});
```

```typescript
// escolas-tab.component.ts
switchMap((escola) => this.escolaService.getEscolaPorHash(escola.hashEscola).pipe(
   switchMap((detalhe): Observable<EscolaCarregada> => { /* ... */ }),
   catchError(() => {
      this.loadingEscola = false;
      this.cdr.markForCheck();
      return of(null);
   }),
)),
...
.subscribe((resultado) => {
   if (!resultado) { return; }
   if (!resultado.detalhe) { this.fecharEscola(); this.cdr.markForCheck(); return; }
   ...
});
```

---

## Achado 2 — `salvando`/`loading` nunca resetam em erro (mesma raiz do #1)

Nenhum `.subscribe(...)` deste fluxo (busquei em todos os 6 arquivos) declara um segundo argumento (`error:`). Isso significa que em **qualquer** chamada real que falhe — `updateConfiguracaoEscola`/`updateConfiguracaoEscolaAnoLetivo` (escolas-tab), `updateFundamentacoesLegais` (editor de fundamentação), e futuramente os 6 saves de rede quando forem plugados — o toast de erro aparece (via `HandleApiError`), mas o `next` do `.subscribe()` nunca roda, então `salvando` **nunca volta para `false`**. O botão fica preso em "Salvando..." (desabilitado) até a página ser recarregada.

Isso já é reproduzível hoje nos 3 pontos que são chamada real (escola+ano-letivo, fundamentação legal) — documentado também nos testes E2E criados nesta sessão (`escolas.spec.ts`/`fundamentacao-legal.spec.ts`, cenário "erro ao salvar"), mas sem propor a correção até agora.

### Correção proposta

Mesma raiz do Achado 1: adicionar tratamento de erro no `.subscribe()` de cada `salvar()`, resetando `salvando` (e opcionalmente `loading` nos GETs). Exemplo para `escolas-tab.component.ts`:

```typescript
forkJoin([...]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
   next: () => { /* fluxo de sucesso atual, sem mudança */ },
   error: () => {
      this.salvando = false;
      this.cdr.markForCheck();
      // o toast de erro já foi disparado pelo HandleApiError dentro do service
   },
});
```

Mesmo padrão em `fundamentacao-legal-editor.component.ts` e, quando os 6 saves de `rede-documentos-tab.component.ts` forem plugados no backend real, também lá.

---

## Achado 3 — `rede-documentos-tab` sob `OnPush` sem `ChangeDetectorRef`

`geral.component.ts`, `escolas-tab.component.ts` e `fundamentacao-legal-editor.component.ts` injetam `ChangeDetectorRef` e chamam `markForCheck()` dentro dos `subscribe()` que atualizam a tela depois de uma chamada assíncrona — necessário porque são `OnPush`. `rede-documentos-tab.component.ts` é `OnPush` também, mas **não injeta `ChangeDetectorRef` em lugar nenhum**.

Hoje isso **não é um bug visível**: todo `salvar*()` desse componente termina emitindo `this.redeAtualizada.emit(...)`, e o hub (`onRedeAtualizada`) reatribui `redeSelecionada` a uma **nova referência**, que volta como `[rede]` — e uma mudança de referência em `@Input()` já força o Angular a re-checar o componente sob `OnPush`, mesmo sem `markForCheck()` explícito. Ou seja, funciona por um efeito colateral do fluxo de dados, não por uma garantia explícita.

**Risco:** é uma dependência implícita e frágil — se um dia esse `emit()` for removido, o hub deixar de reatribuir a referência (ex.: um `Object.assign` em vez de spread), ou um novo fluxo de salvar for adicionado sem esse round-trip, o botão "Salvar" ficaria visualmente preso em "Salvando..." sem nenhum sinal de que a causa é change detection, não lógica — o tipo de bug mais custoso de diagnosticar depois.

### Correção proposta
Injetar `ChangeDetectorRef` e chamar `markForCheck()` em `finalizarSalvar()`, por consistência e defesa, mesmo sem necessidade estrita hoje:

```typescript
private cdr = inject(ChangeDetectorRef);

private finalizarSalvar(mensagem: string, atualizacoes: Partial<ConfiguracaoRedeResponse>): void {
   this.salvando = false;
   this.form.markAsPristine();
   this.redeAtualizada.emit({ ...this.rede, ...atualizacoes });
   this.notification.showSuccess(mensagem);
   this.cdr.markForCheck();
}
```

---

## Achado 4 — Vazamento de subscription (RxJS): nenhum encontrado

Auditoria de toda assinatura dinâmica (recriada a cada abertura de card/escola/documento):

| Componente | Watchers dinâmicos | Guarda |
|---|---|---|
| `rede-documentos-tab` | `possuiObservacao`/`possuiCertificadoConclusao` (Histórico) | `destruirWatchersHistorico$.next()` chamado **antes de criar** os novos, e também no `fecharDocumento()` |
| `escolas-tab` | 6 toggles (cabeçalho/assinaturas) | `destruirWatchersEscolaForm$.next()` chamado **antes de criar** os novos, e também no `fecharEscola()` |

Todas as assinaturas (dinâmicas e de uma vez só) usam `takeUntilDestroyed(this.destroyRef)`. As de longa duração (`selecionarRede$`, `abrirEscola$`) são inscritas **uma única vez** em `ngOnInit`, nunca acumulam. `fundamentacao-legal-editor` é destruído/recriado pelo próprio `*ngIf="editando"` do pai a cada abertura/fechamento — `DestroyRef` dispara em toda fechada, garantindo limpeza total.

**Conclusão: nenhum vazamento de subscription neste fluxo.** O padrão "Subject de kill + takeUntil + takeUntilDestroyed" está aplicado de forma consistente e correta — só faltou o `catchError` interno (Achados 1/2), que é um problema de robustez a erro, não de memória.

---

## Achado 5 — Performance: nenhum problema encontrado

- `single-select` usa `cdk-virtual-scroll-viewport` no dropdown — listas grandes de opções não são um problema (não que este fluxo tenha listas grandes: redes/escolas/anos-letivos são tipicamente poucos itens).
- `OnPush` aplicado em todos os componentes de formulário (`geral`, `rede-documentos-tab`, `escolas-tab`, `fundamentacao-legal-tab`, `fundamentacao-legal-editor`).
- Sem padrão N+1: o hub busca escolas + fundamentações em paralelo (`forkJoin`), uma vez por rede selecionada, não por item da lista.
- `switchMap` cancela corretamente a busca anterior ao trocar de rede/escola rapidamente — sem race condition, sem chamada desperdiçada.
- `tiposCertificado` (Histórico) é buscado uma única vez e cacheado em memória (`if (this.tiposCertificado.length === 0)`), não a cada abertura do card.
- Volume de dados real do domínio (séries por rede, escolas por rede, campos por formulário) é pequeno — dezenas de itens no pior caso, não staremos falando de milhares de linhas em nenhum ponto deste fluxo.

---

## Correções aplicadas

| # | Arquivo(s) | O que mudou |
|---|---|---|
| 1 | `configuracao-documentacao-pedagogica.component.ts`, `escolas-tab.component.ts` | `catchError` adicionado dentro do `switchMap` de cada pipeline de longa duração (seletor de rede, abertura de escola) — erro de rede não mata mais a assinatura |
| 2 | `escolas-tab.component.ts` (save), `fundamentacao-legal-editor.component.ts` (save), `rede-documentos-tab.component.ts` (5 saves) | `.subscribe(fn)` trocado por `.subscribe({ next, error })` — em erro, `salvando`/`loadingEscola` voltam a `false` e `cdr.markForCheck()` é chamado; forms continuam `dirty` (edição do usuário preservada, sem `markAsPristine` no caminho de erro) |
| 3 | `rede-documentos-tab.component.ts` | `ChangeDetectorRef` injetado; `markForCheck()` chamado em `finalizarSalvar()` e em `erroAoSalvar()` |

### Observação — não executei os testes E2E após a correção

Os 17 testes E2E criados nesta sessão (`tests/e2e/documentacao-pedagogica/configuracoes/`) ainda
não puderam ser executados de fato neste ambiente (setup de autenticação com timeout — ver
`cards/01-configuracoes.md`). Como as correções mudam comportamento de erro que os testes
`escolas.spec.ts`/`fundamentacao-legal.spec.ts` já cobrem (cenário "erro ao salvar"), rodar essa
suíte é o próximo passo natural para confirmar as correções — precisa do ambiente de auth E2E
disponível primeiro.
