# Tarefas — EFC-6733 (Filtro "Visualizar apenas as suas turmas" no lançamento de frequência)

> Gerado a partir de `EFC-6733.tech.md`. Plano completo em `cards/EFC-6733/EFC-6733.tech.md`.

## Correções pós-review (2026-09-10, apontadas por code review externo)

1. **`indiceTurmaAtual` resolvido por `hashTurma` não é único (bug de T5):** `hashTurma` se repete em `eventosFiltrados` quando a mesma turma aparece mais de uma vez na listagem (ex.: chamada "Por Turno" com manhã e tarde no mesmo dia gera 2 entradas com o mesmo `hashTurma`, `hashAulaEvento` diferente). A comparação por `hashTurma` sempre resolvia para a primeira ocorrência — abrir a segunda linha abria a tela de lançamento na turma errada. **Correção:** `indiceTurmaAtual` volta a ser calculado por posição/referência (`this.eventosFiltrados.indexOf(evento)`), usando o array original **antes** do `recortarTemposAlocados` clonar os objetos — `turmas` é construído mapeando esse mesmo array na mesma ordem, então o índice é válido independentemente do clone. Corrigido em `listar.component.ts` (`abrirLancamento`) e no mirror `construirNavegacaoTurmas` de `listar.component.spec.ts`, com 2 novos testes de regressão (hashTurma duplicado, com e sem toggle ativo). `npx jest`: 210 passed (208 + 2 novos). `npx tsc --noEmit`: 0 erros.
2. **Toggle ficava preso quando o filtro esvaziava a lista (bug de T3):** o `<app-toggle>` estava dentro do bloco `*ngIf="eventosFiltrados.length > 0"` — se o usuário ativasse o toggle e a interseção com alocação/busca zerasse a lista (CA-12), o toolbar inteiro (incluindo o toggle) sumia, sem forma de desativá-lo. **Correção:** o `.tabela-toolbar` (contagem, view-toggle, toggle "Visualizar apenas as suas turmas" e badge) foi movido para fora do bloco condicionado a `eventosFiltrados`, guardado por `eventos.length > 0` (a lista bruta, não a filtrada) — assim ele permanece visível mesmo com a lista filtrada vazia, permitindo desativar o toggle. `estado-vazio`/`tabela-container` continuam condicionados a `eventosFiltrados`. Corrigido em `listar.component.html`.

---

## Template

```
## T<N> — <título>

**O que fazer:** <uma frase direta>

**Contexto:** <o que a IA precisa saber que não é óbvio — decisão, restrição, dependência>

**Pronto quando:** <critério objetivo>

**Status:** <pendente | em andamento | concluída>
```

---

## Tarefas

## T1 — Backend: flag de alocação sempre computada

**O que fazer:** Adicionar `PossuiAlocacao`/`PossuiAlocacaoProfessor` aos DTOs internos e projetá-los sempre (não só quando falta visão de coordenação) em `FilterLancamentoFrequenciaRepository.GetTurmasParaEventos` e `AulaEventoRepository.GetEventosParaFrequencia`.

**Contexto:** Fase 1 do plano técnico — infraestrutura, viabiliza CA-02/04/05/06. `TurmaParaEventosItem.cs` ganha `PossuiAlocacao` (nível turma, dia/turno); `AulaEventoListingRaw.cs` ganha `PossuiAlocacaoProfessor` (nível evento/disciplina, tempo de aula). **Crítico para CA-13:** os filtros condicionais já existentes (`if (!request.PossuiVisaoCoordenacao) { ... }` em ambos os arquivos) devem permanecer absolutamente inalterados — a nova flag é só uma projeção adicional na mesma query, nunca um novo filtro. `FiltrarPorAlocacao` e os demais usos (`GetSeries`, `GetTurmas`, `GetTurmasParaListaPresenca`, `GetTurmasPorHashParaListaPresenca`) não mudam.

**Pronto quando:** Os dois repositórios retornam a nova flag corretamente calculada para qualquer usuário (com ou sem visão de coordenação), sem alterar o resultado filtrado já existente para quem não tem visão de coordenação.

**Status:** concluída

**Notas de execução (2026-09-10):** `TurmaParaEventosItem.PossuiAlocacao` e `AulaEventoListingRaw.PossuiAlocacaoProfessor` adicionados. Projeção em `FilterLancamentoFrequenciaRepository.GetTurmasParaEventos` (mesmo predicado de `FiltrarPorAlocacao`, sempre computada) e em `AulaEventoRepository.GetEventosParaFrequencia` (mesmo predicado do `Where` condicional existente, sempre computada). Ambos os filtros condicionais (`if (!request.PossuiVisaoCoordenacao)`) permaneceram intocados. `dotnet build EstruturaPedagogica.Infra`: 0 erros.

---

## T2 — Backend: propagar a flag na resposta

**O que fazer:** Expor `PossuiAlocacao` em `LancamentoFrequenciaEventoResponse` e `LancamentoFrequenciaEventoTempoResponse`, setando os valores em `GetEventosService`.

**Contexto:** Fase 2 do plano técnico — CA-02, CA-04, CA-05, CA-06. Depende de T1. Em `FormatarResponsePorDiaOuTurno`, setar `PossuiAlocacao = turma.PossuiAlocacao`. Em `FormatarResponsePorAulaParaCoordenacao`, setar `PossuiAlocacao = t.Evento.PossuiAlocacaoProfessor` em cada tempo, e `PossuiAlocacao = tempos.Any(t => t.PossuiAlocacao)` no evento agregado. `FormatarResponseParaCoordenacao`/`FormatarResponseParaProfessor` chamam os mesmos métodos privados — não duplicar lógica. Nenhuma alteração em `LancamentoFrequenciaController` — sem novo endpoint.

**Pronto quando:** A resposta de `POST /api/lancamentofrequencia/get-eventos` inclui `PossuiAlocacao` corretamente nos dois níveis (turma e tempo), para os dois tipos de chamada.

**Status:** concluída

**Notas de execução (2026-09-10):** `PossuiAlocacao` adicionado a `LancamentoFrequenciaEventoResponse` e `LancamentoFrequenciaEventoTempoResponse`. Em `GetEventosService`: `FormatarResponsePorAulaParaCoordenacao` seta `PossuiAlocacao = t.Evento.PossuiAlocacaoProfessor` em cada tempo e `PossuiAlocacao = tempos.Any(t => t.PossuiAlocacao)` no evento agregado; `FormatarResponsePorDiaOuTurno` seta `PossuiAlocacao = turma.PossuiAlocacao`. Nenhuma alteração em `LancamentoFrequenciaController`. `dotnet build EstruturaPedagogica.Domain.Services`: 0 erros.

---

## T3 — Frontend: modelos e filtragem client-side na listagem

**O que fazer:** Adicionar `possuiAlocacao` aos modelos, criar o toggle "Visualizar apenas as suas turmas" em `ListarComponent` e o pipeline que combina o filtro de alocação com a busca textual já existente.

**Contexto:** Fase 3 do plano técnico — CA-01, CA-03, CA-04, CA-05, CA-08, CA-09, CA-10, CA-12. Depende de T2. O toggle é estado próprio do `ListarComponent` (`FormControl` isolado para o `<app-toggle>`), **fora** do `form` do `FiltroComponent`/`FilterConfig` — decisão já validada com o usuário (evita vazar o campo no payload da consulta e permite visibilidade condicionada ao resultado, que o sistema declarativo do filtro não suporta). Extrair método privado único (ex.: `aplicarFiltrosClientSide()`) que parte de `this.eventos`, aplica o filtro de alocação e depois o filtro textual, atribuindo a `eventosFiltrados` — garante a interseção de CA-09. Getter `possuiAlocacaoDisponivel = this.eventos.some(e => e.possuiAlocacao)` controla a exibição (CA-02, junto com `possuiVisaoCoordenacao`). `abrirLancamento()` e o getter `totalEventos` já derivam de `eventosFiltrados`, então CA-08/CA-10/CA-12 ficam automáticos se essa lista estiver correta. Usar `<app-toggle>` no HTML (nunca `<input type="checkbox">` cru).

**Pronto quando:** O toggle aparece só quando `possuiVisaoCoordenacao && possuiAlocacaoDisponivel`, filtra a listagem corretamente para os dois tipos de chamada, compõe com a busca textual, e a contagem/mensagem de vazio refletem a lista filtrada.

**Status:** concluída

**Notas de execução (2026-09-10):** `possuiAlocacao` adicionado a `LancamentoFrequenciaEventoResponse`/`LancamentoFrequenciaEventoTempoResponse` em `models.ts`. `ListarComponent`: `apenasMinhasTurmasControl` (FormControl próprio, fora do form do filtro), getter `possuiAlocacaoDisponivel`, método privado `aplicarFiltrosClientSide()` combinando alocação + busca textual (`termoBuscaAtual` armazenado para reaplicar ao alternar o toggle); `buscarEvento()` e `getEventos()` passaram a delegar para esse método. `<app-toggle>` (via `DynamicComponentsModule`, componente NgModule-based, não standalone — importado no array `imports` do componente standalone, mesmo padrão já usado em `agrupador-series/listar`) adicionado na `.tabela-toolbar` dentro de nova `.toolbar-direita`, com `*ngIf="possuiVisaoCoordenacao && possuiAlocacaoDisponivel"`. Ponto de atenção corrigido durante a execução: os helpers `makeEvento`/`makeTempo` em `tests/unit/lancamento-frequencia/{listar,lancamento}.component.spec.ts` não incluíam `possuiAlocacao` (agora campo obrigatório) — adicionado `possuiAlocacao: false` como default nos 2 arquivos para não quebrar o typecheck. `npx tsc --noEmit`: 0 erros relacionados a `lancamento-frequencia`.

---

## T4 — Frontend: persistência do estado do toggle

**O que fazer:** Persistir o estado do toggle usando o mesmo storage/TTL do filtro da tela, sem passar pelo form.

**Contexto:** Fase 4 do plano técnico — CA-11. Depende de T3. Usar `FiltroStorageService` diretamente em `ListarComponent`, reaproveitando o mesmo `id` (`filtro_lancamento_frequencia`, TTL 8h) usado pelo filtro da tela, mas como chamada independente ao serviço — não pelo pipeline `updateStorage()`/`value()` do `FiltroComponent`.

**Pronto quando:** Ao sair e retornar à listagem dentro do TTL, o toggle é restaurado no último estado utilizado.

**Status:** concluída

**Notas de execução (2026-09-10):** `FiltroStorageService` injetado em `ListarComponent`. No `ngOnInit`, valor persistido lido via `loadFieldData(filterConfig.id, 'apenasMinhasTurmas')` (sem depender do `ViewChild #filtro`, que só existe após `carregandoPermissoes` virar `false` — `filterConfig.id` já está disponível como campo de classe) e aplicado ao control com `{ emitEvent: false }`. Gravação a cada mudança via `filtroStorage.update(filterConfig.id, { formData: { apenasMinhasTurmas: valor } })` — `update()` faz merge de `formData` (spread), então convive com as chamadas de `updateStorage()` do próprio `FiltroComponent` (que também usa `update()`, nunca `save()` bruto) sem um sobrescrever o outro. Confirmado que `FiltroComponent.value()` usa `form.getRawValue()` sobre seu próprio `FormGroup`, que não inclui esse campo — não vaza no payload da consulta. `npx tsc --noEmit`: 0 erros relacionados a `lancamento-frequencia`.

---

## T5 — Frontend: restrição de tempos e propagação para a tela de lançamento

**O que fazer:** Recortar `evento.tempos` para conter apenas os tempos com `possuiAlocacao === true` antes de gravar no `ListaFrequenciaStore`, quando o toggle estiver ativo; confirmar que `temposDisponiveis` em `LancamentoFrequenciaComponent` já deriva de `temposRelacionados`.

**Contexto:** Fase 5 do plano técnico — CA-06, CA-07. Depende de T3. Evita propagar o booleano `apenasMinhasTurmas` para a tela de lançamento — mais simples, evita acoplar `LancamentoFrequenciaComponent` ao estado do toggle da listagem. Navegação entre turmas (CA-07) já é coberta por T3, pois `store.turmas` vem de `eventosFiltrados`. Se `temposRelacionados` não for de fato a fonte de `temposDisponiveis` (getter, linha ~706-710), ajustar o getter para considerar o recorte.

**Pronto quando:** Na tela de lançamento de uma turma com chamada por tempo de aula, com o toggle ativo, apenas os tempos da alocação do usuário aparecem disponíveis para seleção.

**Status:** concluída

**Notas de execução (2026-09-10):** Confirmado que `temposDisponiveis` em `LancamentoFrequenciaComponent` (linha ~706) já deriva de `this.temposRelacionados` — nenhuma alteração necessária nesse arquivo. Em `listar.component.ts`, `abrirLancamento()` passou a usar `recortarTemposAlocados(evento)` (novo método privado: com o toggle ativo, retorna uma cópia do evento com `tempos` filtrado por `possuiAlocacao`; sem efeito em eventos sem tempos ou com o toggle desativado) tanto para o evento aberto quanto para cada `TurmaNavegacaoResponse.evento` do array `turmas` — sem isso, `navegarTurma()` (em `lancamento.component.ts`, que reatribui `temposRelacionados = alvo.evento.tempos`) reintroduziria os tempos não alocados ao navegar entre turmas dentro da tela de lançamento. **Ajuste não previsto no plano técnico:** como `recortarTemposAlocados` retorna uma cópia (spread) do evento em vez do mesmo objeto, `indiceTurmaAtual` não podia mais ser resolvido por igualdade de referência (`t.evento === evento`, como no código original) — trocado por comparação via `hashTurma` (`t.evento.hashTurma === eventoRecortado.hashTurma`), mais robusto e correto independente do estado do toggle. `npx tsc --noEmit`: 0 erros relacionados a `lancamento-frequencia`.

---

## T6 — Testes

**O que fazer:** Criar os cenários de teste de integração backend e os specs Jest do frontend cobrindo a feature.

**Contexto:** Fase 6 do plano técnico (última fase) — cobre CA-01 a CA-13. Depende de T1 a T5 concluídas.
- Backend (`GetEventosServiceTests.cs`, nova região `#region Testes de Flag de Alocação`): coordenação com alocação em alguma turma; coordenação sem nenhuma alocação (CA-13); Por Aula com alocação só em uma disciplina (tempo A `true`, tempo B `false`, evento agregado `true`); Por Dia/Turno com alocação na turma; usuário sem visão de coordenação (asserções já existentes na região `#region Testes de Professor` não podem quebrar, `PossuiAlocacao` deve ser `true`). Reaproveitar fixtures existentes (`GerarGrafoBase`, `GerarProfessor`, `ConfigurarValidacaoSucesso`, `GerarAlunoEscola`, `AlunoEscolaDisciplinaFixture`, `AulaEventoFixture`, `GerarStatuses`).
- Frontend (`tests/unit/lancamento-frequencia/`): `listar.component.spec.ts` cobrindo `aplicarFiltrosClientSide()` (toggle isolado, toggle + busca combinados, toggle sem resultado → CA-12) e `possuiAlocacaoDisponivel`; `lancamento.component.spec.ts` cobrindo `temposDisponiveis` recebendo `temposRelacionados` já recortado.

**Pronto quando:** Todos os testes novos passam, e os testes já existentes de `GetEventosServiceTests.cs` (região de Professor) continuam passando sem alteração.

**Status:** concluída

**Notas de execução (2026-09-10):**
- **Backend:** nova região `#region Testes de Flag de Alocação` em `GetEventosServiceTests.cs` com 4 cenários: coordenação alocada em 1 de 2 turmas (flag correta por turma, sem alterar a contagem — CA-13); coordenação sem nenhuma alocação (flag `false` em tudo); Por Aula com alocação só numa disciplina (flag correta por tempo + agregado via `Any`); professor sem visão de coordenação (flag sempre `true`, já que só vê as próprias turmas). `dotnet test --filter "FullyQualifiedName~GetEventosServiceTests"`: **41 passed, 0 failed** (37 pré-existentes + 4 novos, nenhuma quebra na região de Professor).
- **Frontend:** `listar.component.spec.ts` — `ListarLogic` ganhou `aplicarFiltrosClientSide()`, `possuiAlocacaoDisponivel` e `recortarTemposAlocados()` espelhando a implementação real; novos `describe` blocks cobrindo toggle isolado, busca isolada, interseção toggle+busca (CA-09), lista vazia com toggle ativo (CA-12), alternância on/off (CA-10), e o recorte de tempos (CA-06/07). `lancamento.component.spec.ts` — novo teste em `temposDisponiveis` confirmando que a tela reflete só os tempos já recortados recebidos via `temposRelacionados` (não tenta "recuperar" um tempo sem alocação que nunca chegou ao store).
- **Achado durante a escrita dos testes:** a mudança de T5 (comparação de `indiceTurmaAtual` por `hashTurma` em vez de igualdade de referência) quebraria silenciosamente 3 testes pré-existentes de `construirNavegacaoTurmas` que usavam `makeEvento()` sem `hashTurma` explícito (todas as turmas caindo no mesmo default `'ht1'`, colidindo). Corrigido adicionando `hashTurma` distinto a cada turma nesses testes — sem isso, os testes ficariam com falso positivo (sempre resolvendo para o índice 0).
- `npx jest tests/unit/lancamento-frequencia/listar.component.spec.ts tests/unit/lancamento-frequencia/lancamento.component.spec.ts`: **208 passed, 0 failed**. `npx tsc --noEmit`: 0 erros relacionados a `lancamento-frequencia`.
