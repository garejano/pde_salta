# Tarefas de Refatoração — EFC-6515 (Matriz Curricular)

> Gerado a partir da validação de `revisao-pr.md` (revisão do PR `feature/EFC-6515` → `develop`, repositório `estrutura-pedagogica`). Todos os 30 achados do relatório (17 backend + 13 frontend) foram verificados linha a linha contra o código atual por agentes independentes — **nenhum é falso, nenhum já foi corrigido**. Esta lista organiza os achados em tarefas acionáveis, por prioridade.
>
> Repositório alvo: `estrutura-pedagogica`, branch `feature/EFC-6515`.

---

## 🔴 Bloqueantes

### R1 — Extrair modal de remoção para componente dedicado

**O que fazer:** Extrair o modal de confirmação de remoção, hoje embutido inline em `formulario-matriz.component.html:285-320`, para um componente Angular standalone dedicado, adaptável via `@Input()`.

**Contexto:** O próprio repositório já tem o padrão correto em `configurador-disciplinas/remover/remover-disciplina.component.ts` (componente standalone com `start()`/`close()`/`confirmar()` próprios, template e scss próprios). O `FormularioMatrizComponent` hoje controla o modal via propriedade `mostrarConfirmacaoRemocao` e métodos `remover()`/`fecharConfirmacaoRemocao()`/`confirmarRemocao()` (`formulario-matriz.component.ts:293-327`), fora do padrão arquitetural do projeto.

**Pronto quando:** O modal de remoção é um componente separado, seguindo a mesma estrutura de `remover-disciplina.component.ts`, e `formulario-matriz.component.html` apenas o referencia.

**Status:** concluída — extraído para `matriz-curricular/remover/remover-disciplina-matriz.component.{ts,html,scss}`; `FormularioMatrizComponent` passa a acioná-lo via `@ViewChild` + eventos `loadingChange`/`removido`.

---

### R2 — Corrigir texto do aviso de inclusão (CA-13)

**O que fazer:** Substituir o texto atual do aviso em `formulario-matriz.component.html:92` pelo texto exato exigido pelo CA-13.

**Contexto:** Texto atual: _"Disciplinas incluídas via Matriz não possuem avaliações regulares nem diversificadas."_ Texto exigido: _"Atenção: As disciplinas inclusas por aqui constarão como diversificadas, sem avaliações cadastradas. Caso esse não seja o cenário correto, favor informar seu Núcleo Pedagógico para que possam fazer a devida parametrização."_ Não é só uma questão de fidelidade ao spec — o texto atual **inverte o sentido** (diz "não possuem avaliações diversificadas" quando o correto é "constarão como diversificadas").

**Pronto quando:** O aviso exibido no painel de inclusão é idêntico, palavra por palavra, ao texto do CA-13.

**Status:** concluída — texto substituído em `formulario-matriz.component.html:92` pelo texto exato do CA-13 (com "Atenção:" em `<strong>`).

---

### R3 — Total da série: usar `Update` direto em vez de Disable+Insert

**O que fazer:** Alterar `SaveMatrizCurricularService.cs` (`SaveNew` linhas ~162-175, `Update` linhas ~352-365) e `RemoverMatrizCurricularService.cs` (linhas ~100-113) para que o registro de **total da série** (`CargaHoraria` sem disciplina associada, `TotalDaSerie = true`) seja atualizado via `Update` direto, e não pelo ciclo Disable+Insert usado para as cargas por disciplina.

**Contexto:** O complemento técnico do spec (`EFC-6515.md` seção 4, e `EFC-6515.tech.md` Fase 1) é explícito: _"O registro de total da série (sem disciplina associada) é atualizado diretamente, sem esse ciclo de inativação."_ O código atual aplica Disable+Insert também a esse registro, contrariando o spec e gerando histórico de registros desnecessário — risco de inconsistência de auditoria.

**Pronto quando:** O registro de total da série é sempre o mesmo (mesmo `Id`) entre alterações sucessivas, atualizado via `Update`; apenas os registros de carga por disciplina seguem Disable+Insert.

**Status:** concluída — `SaveMatrizCurricularService.cs` (`SaveNew` e `Update`) e `RemoverMatrizCurricularService.cs` agora chamam `_cargaHorariaRepository.Update(totalExistente)` quando o registro de total já existe, mantendo `Insert` apenas para a primeira criação do total da série. `ICargaHorariaRepository` já expunha `Update` via `IRepositoryUpdate<CargaHoraria>`, sem necessidade de novo método.

---

### R4 — Integrar `CargaHorariaParser` no backend (CA-20/CA-21)

**O que fazer:** Fazer `SaveMatrizCurricularService.cs` (`SaveNew` linhas ~140-149, `Update` linhas ~330-339) chamar `CargaHorariaParser` para parsear e validar o valor de carga horária recebido do cliente, tornando o backend a fonte de verdade sobre a consistência entre `CargaFormatada` e `CargaEmMinutos`.

**Contexto:** `backend/EstruturaPedagogica.Extensions/CargaHorariaParser.cs` foi criado especificamente para isso (parse dos 3 formatos: inteiro, hh:mm, decimal com `,`/`.`), mas nunca é referenciado em nenhum service — busca global confirma que o único uso do nome é a própria definição. Hoje o backend grava exatamente o que o cliente envia, sem validar. Decisão de design a confirmar: se optar por delegar 100% ao frontend, remover a extension; caso contrário (recomendado, conforme spec), integrá-la aqui.

**Pronto quando:** O backend deriva/valida `CargaEmMinutos` a partir de `CargaFormatada` (ou vice-versa) usando `CargaHorariaParser`, rejeitando ou normalizando valores inconsistentes antes de persistir.

**Status:** concluída — `SaveNew` e `Update` em `SaveMatrizCurricularService.cs` agora derivam `serie.CargaEmMinutos` a partir de `serie.CargaFormatada` via `CargaHorariaParser.ParseParaMinutos`, retornando erro ("Carga horária inválida: '...'") quando o formato não é reconhecível; o valor de `CargaEmMinutos` enviado pelo cliente passa a ser ignorado/sobrescrito. Fixtures de teste que usavam formato inválido (`"1h"`/`"2h"`, fora dos 3 formatos do CA-20) foram corrigidas para `"1:00"`/`"2:00"`. Adicionados 2 testes novos (`SaveNew_Retorna_Erro_Quando_Carga_Horaria_Invalida`, `SaveNew_Deriva_CargaEmMinutos_A_Partir_Da_CargaFormatada`). Suite completa de Matriz Curricular: 52/52 passando.

---

### R5 — CA-15: validar imutabilidade da disciplina no `Update` (backend)

**O que fazer:** Em `SaveMatrizCurricularService.Update` (linhas ~183-371), adicionar validação que rejeite a requisição caso o `HashDisciplina` informado seja diferente da disciplina já vinculada ao registro de `RedeSerieDisciplina` sendo editado.

**Contexto:** `MatrizCurricularUpdateRequest.HashDisciplina` é aceito livremente e usado apenas para localizar o registro via `GetByDisciplinaRedeSerie` — não há nenhuma comparação com a disciplina originalmente vinculada. Hoje a imutabilidade da disciplina na edição (CA-15) é garantida **apenas pela UI** (campo somente leitura); uma chamada direta à API pode trocar a disciplina do registro.

**Pronto quando:** Uma requisição de `Update` com `HashDisciplina` diferente do vinculado ao registro original retorna erro explícito, e existe teste cobrindo esse cenário (ver R18).

**Status:** concluída — adicionada validação em `SaveMatrizCurricularService.Update` logo após a resolução de `existentesPorSerie`: rejeita com "A disciplina informada não está cadastrada na Matriz Curricular." quando `request.HashDisciplina` não corresponde a nenhum `RedeSerieDisciplina` com `ParteDaMatrizCurricular = true` e `OcultarNaMatrizCurricular = false` no escopo (mesmo padrão já usado em `RemoverMatrizCurricularService`). Isso impede que `Update` seja usado como atalho para inserir uma disciplina nova na Matriz (papel do `SaveNew`) ou "sequestrar" uma `RedeSerieDisciplina` de outra disciplina configurada só no Configurador. Novo teste `Update_Retorna_Erro_Quando_Disciplina_Nao_Esta_Na_Matriz` adicionado. Suite completa: 53/53 passando.

---

## 🟠 Bugs funcionais

### R6 — CA-02: corrigir selo de "possui Carga Horária" na listagem

**O que fazer:** Em `listar-matriz-curricular.component.html:110-119`, trocar a condição `disciplina.series[0]?.temCargaHoraria` por uma que considere **todas** as séries da disciplina (ex.: `every`/`some`, conforme a regra de negócio desejada — confirmar com o time se o selo deve indicar "todas as séries têm carga" ou "pelo menos uma série tem carga").

**Contexto:** Hoje o selo usa exclusivamente o índice `[0]` do array `series`, produzindo resultado incorreto para disciplinas com múltiplas séries quando a primeira série diverge das demais.

**Pronto quando:** O selo reflete corretamente o estado de carga horária considerando todas as séries da disciplina.

**Status:** concluída — adicionado `possuiCargaHorariaCompleta(disciplina)` em `listar-matriz-curricular.component.ts` (`series.every(s => s.temCargaHoraria)`, com `series.length > 0` como guarda), usado no `.html` no lugar de `series[0]?.temCargaHoraria`. Regra adotada: "Completa" somente quando **todas** as séries têm carga horária preenchida; se qualquer uma estiver faltando, mostra "Pendente".

---

### R7 — CA-10: exibir e persistir Área do Conhecimento no modo de inclusão

**O que fazer:** Em `formulario-matriz.component.html`, mover o campo "Área do Conhecimento" (hoje só dentro de `*ngIf="edicao"`, linhas ~52-57) para também aparecer no bloco de inclusão (`*ngIf="!edicao"`, linhas ~28-44). Em `formulario-matriz.component.ts`, incluir `hashAreaConhecimento` no objeto `request` montado em `saveInclusao()` (linhas ~368-375).

**Contexto:** O campo já existe no `FormGroup` (`hashAreaConhecimento: [null]`) e na interface `MatrizCurricularSaveRequest` (`models.ts:49`), mas nunca é exibido nem enviado na inclusão — lacuna direta frente ao CA-10, que exige o campo (opcional) em ambos os fluxos.

**Pronto quando:** É possível selecionar Área do Conhecimento ao incluir uma nova disciplina, e o valor é enviado e persistido corretamente.

**Status:** concluída — campo "Área do Conhecimento" movido para fora do `*ngIf="edicao"`, agora visível em ambos os modos em `formulario-matriz.component.html`; `saveInclusao()` passa a enviar `hashAreaConhecimento` no `MatrizCurricularSaveRequest`; `startIncluir()` agora também busca `getAreasConhecimento()` (mesma chamada já feita em `startEditar`, populando as opções do select em ambos os fluxos — a duplicação de chamada HTTP será resolvida na R10). Backend (`SaveMatrizCurricularService.SaveNew`) já processava `HashAreaConhecimento` corretamente; não precisou de alteração.

---

### R8 — CA-22: exibir total na inclusão, corrigir zero-padding e formato `hh:MM`

**O que fazer:** Três correções relacionadas:
1. Em `formulario-matriz.component.html:199`, remover a condição `edicao &&` do `*ngIf` do bloco de total, para que também apareça no modo de inclusão.
2. Em `formulario-matriz.component.ts`, getter `totalFormatado` (linhas ~245-249), aplicar `padStart(2,'0')` também na hora (`Math.floor(m/60)`), não só nos minutos — hoje produz `"5:07"` em vez de `"05:07"`.
3. No backend, unificar e corrigir `FormatarMinutos` (duplicado em `SaveMatrizCurricularService.cs:373-379` e `RemoverMatrizCurricularService.cs:121-127`) para produzir o formato `hh:MM` exigido pelo CA-22, em vez do atual `"XhYY"`/`"Xh"`.

**Contexto:** CA-22 exige o total recalculado automaticamente e exibido no formato `hh:MM`; hoje ele nem aparece na inclusão, e tanto o frontend quanto o backend produzem formatos incorretos.

**Pronto quando:** O total de carga horária aparece em ambos os modos (inclusão e edição), sempre no formato `hh:MM` com zero-padding, tanto no frontend quanto no valor persistido pelo backend.

**Status:** concluída — (1) `*ngIf` do bloco de total em `formulario-matriz.component.html` não depende mais de `edicao`, aparece sempre que houver série selecionada; (2) `totalFormatado` em `formulario-matriz.component.ts` agora aplica `padStart(2,'0')` também na hora (retorna `hh:MM`, ex. "00:00", "05:07"); (3) `CargaHorariaParser.FormatarComoHhMm` corrigido para zero-pad na hora (`{horas:D2}:{mins:D2}`, "00:00" quando zero) e passou a ser a única fonte desse formato — os métodos privados `FormatarMinutos` duplicados em `SaveMatrizCurricularService.cs` e `RemoverMatrizCurricularService.cs` (que produziam `"XhYY"`) foram removidos e substituídos por `CargaHorariaParser.FormatarComoHhMm(totalMinutos)`. Suite completa: 53/53 passando.

---

### R9 — CA-05: implementar paginação client-side na listagem

**O que fazer:** Adicionar paginação client-side em `listar-matriz-curricular.component.ts/.html`, sobre os dados já carregados e filtrados pela busca textual.

**Contexto:** Hoje só existe busca textual (`buscar()`, linhas ~119-130); não há paginação. O padrão já existe no projeto em `dia-letivo-extra/listar` (`paginaAtual`, `totalDePaginas`, `qtPorPagina`, método `aplicarBuscaEPaginar()`, componente `<app-paginacao>`) e deve ser replicado aqui.

**Pronto quando:** A listagem exibe os resultados paginados, com busca textual e paginação funcionando em conjunto, seguindo o mesmo padrão de `dia-letivo-extra/listar`.

**Status:** concluída — adicionados `disciplinasExibidas`, `paginaAtual`, `qtPorPagina` (30) e `totalDePaginas` em `listar-matriz-curricular.component.ts`, com método `aplicarPaginacao(pagina)` espelhando `aplicarBuscaEPaginar` de `dia-letivo-extra/listar`. `buscar()` e o sucesso de `aplicarFiltro()` agora chamam `aplicarPaginacao(1)`. No template, a tabela itera `disciplinasExibidas` (antes `disciplinasFiltradas`) e foi adicionado `<app-paginacao [paginacao]="{ pagina: paginaAtual, total: disciplinasFiltradas.length, pageSize: qtPorPagina }" (goTo)="aplicarPaginacao($event)">` logo após a tabela.

---

### R10 — CA-06: reaproveitar Áreas do Conhecimento no painel de edição

**O que fazer:** Mover a busca de `getAreasConhecimento()` para o `forkJoin` já executado na listagem (`listar-matriz-curricular.component.ts:78-95`), e passar o resultado como parâmetro ao abrir o painel de edição (`abrirEditar`, linhas ~137-139), em vez de disparar uma nova requisição HTTP dentro de `startEditar` (`formulario-matriz.component.ts:131-134`) a cada abertura.

**Contexto:** CA-06 exige que os dados auxiliares do filtro (áreas do conhecimento, séries, disciplinas mãe) sejam buscados uma vez e reutilizados nos painéis, sem nova chamada ao servidor. Hoje isso já é feito corretamente para `series`/`disciplinasDisponiveis`, mas não para áreas do conhecimento.

**Pronto quando:** Abrir o painel de edição não dispara nenhuma requisição HTTP para buscar áreas do conhecimento — o dado já vem do carregamento inicial da listagem.

**Status:** concluída — `getAreasConhecimento()` movido para o `forkJoin` de `aplicarFiltro()` em `listar-matriz-curricular.component.ts` (novo campo `areasConhecimento: SelectOption[]`, resetado em `onFiltroFieldUpdate`/`reset`). `abrirIncluir`/`abrirEditar` agora repassam `this.areasConhecimento` como 4º argumento. `startIncluir`/`startEditar` em `formulario-matriz.component.ts` passaram a receber `areasConhecimento: SelectOption[]` como parâmetro e atribuem direto a `this.areaOptions`, removendo as duas chamadas HTTP duplicadas introduzidas na R7. Nenhuma requisição de áreas do conhecimento é mais feita ao abrir o painel — só uma vez, junto ao filtro.

---

## 🟡 Duplicação / risco de manutenção

### R11 — Reduzir duplicação entre `SaveNew` e `Update`, reutilizar `ValidacaoMatrizCurricularService`

**O que fazer:** Extrair a lógica comum entre `SaveNew` e `Update` (validação → resolução de séries → checagem de nome duplicado → gravação) em `SaveMatrizCurricularService.cs` para um método privado compartilhado. Fazer ambos os métodos, além de `RemoverMatrizCurricularService.cs`, chamarem `ValidacaoMatrizCurricularService.ValidarRequest` para a validação de campos obrigatórios (ano/rede/segmento), em vez de cada um reimplementar essa validação de forma diferente (`.IsNullOrEmpty()` vs `== null || == Guid.Empty`).

**Contexto:** `ValidacaoMatrizCurricularService` existe e centraliza essa regra, mas hoje não é reutilizado por nenhum dos services de escrita — cada um duplica e diverge na forma de validar.

**Pronto quando:** Existe um único ponto de validação de campos obrigatórios, chamado pelos três services de escrita; a lógica comum entre `SaveNew`/`Update` está extraída para um método compartilhado.

**Status:** concluída — `SaveMatrizCurricularService.cs` (`SaveNew`/`Update`) e `RemoverMatrizCurricularService.cs` agora chamam `_validacaoService.ValidarRequest(filterRequest, FilterMatrizCurricularEnum.GetLista)` para validar ano/rede/segmento + obter redes do usuário em uma única chamada, eliminando os `if` manuais divergentes (`.IsNullOrEmpty()` vs `== null || == Guid.Empty`) e a chamada separada a `GetRedesDoUsuario()`. Em `SaveMatrizCurricularService.cs`, extraídos métodos privados compartilhados entre `SaveNew`/`Update`: `ValidarDisciplinaESeries`, `ResolverSeriesRequisitadas`, `NormalizarNomesEValidarObrigatorios`, `DerivarCargasHorarias`, `ValidarNomesDuplicadosAsync` e `RecalcularTotaisPorSerieAsync` (este último também substitui a duplicação do bloco de total introduzido nas R3/R8 dentro da própria classe). A ordem de validação mudou ligeiramente (disciplina/série antes de ano/rede/segmento) — verificado que nenhum teste depende da ordem antiga. Ajustados os testes que mockavam `GetRedesDoUsuario()` diretamente (`*_Sem_Acesso`, `*_Hash*_Vazio` em Save/Update/Remover) para mockar `ValidarRequest`, já que os services passaram a depender dela. Suite completa: 53/53 passando.

---

### R12 — Corrigir N+1 em loops de query e Insert/Disable

**O que fazer:**
1. Em `SaveMatrizCurricularService.cs` (`SaveNew` linhas ~88-97, `Update` linhas ~247-256), substituir a chamada de `GetNomeDocumentosOficiaisRepetido` dentro do loop por série por uma busca em lote antes do loop, usando as `redeSerieIds` afetadas.
2. Em `SaveMatrizCurricularService.cs` e `RemoverMatrizCurricularService.cs` (múltiplos trechos, `Insert`/`Disable` dentro de `foreach`), acumular as entidades numa lista e persistir em uma única chamada, usando os overloads em lote (`Insert(List<T>)`/`Disable(List<T>)`) já expostos pelos repositórios.

**Contexto:** Ambos os padrões geram uma query por iteração ao invés de uma query em lote — impacto de performance que cresce com o número de séries.

**Pronto quando:** Nenhuma query de checagem de nome nem operação de Insert/Disable é executada dentro de um loop por série.

**Status:** concluída —
1. **Nome duplicado:** `IRedeSerieDisciplinaRepository.GetNomeDocumentosOficiaisRepetido` (1 query por série) substituído por `GetNomesDocumentosOficiaisExistentes(redeSerieIds, hashDisciplina)` — uma única query que traz todos os conflitos potenciais do lote, com o `Any` por série feito em memória em `ValidarNomesDuplicadosAsync`. Método antigo removido (interface + implementação), nenhum outro consumidor encontrado.
2. **Insert/Disable em lote:** extraídos `SalvarSeriesNaMatrizAsync` e `SalvarCargasPorSerieAsync` (compartilhados entre `SaveNew`/`Update`) que acumulam as entidades em listas dentro do loop e persistem com uma única chamada a `Disable(List<T>)`/`Insert(List<T>)` no final, em vez de uma chamada por iteração. Mesmo padrão aplicado ao loop de `seriesRemovidas` (`Update`) e ao loop de `naMatriz` em `RemoverMatrizCurricularService.cs`. Os `Disable` de cargas horárias existentes (`cargasDisciplinaExistentes`/`cargasDisciplina`) também passaram a ser uma chamada única em vez de loop.

Build completo do backend sem erros; suite de Matriz Curricular: 53/53 passando.

---

### R13 — Remover chamada redundante `GetRedeSerieId` após `GetRedeSeries`

**O que fazer:** Em `SaveMatrizCurricularService.cs` (linhas ~47-56 e ~206-215), eliminar a chamada a `GetRedeSerieId`, reaproveitando os IDs já retornados por `GetRedeSeries` (`redeSeries.Select(x => x.Id)`).

**Contexto:** `GetRedeSeries` já retorna os mesmos IDs em `BaseResponse.Id`; a segunda consulta é desnecessária.

**Pronto quando:** Apenas uma consulta é feita para resolver os IDs de série.

**Status:** concluída — `SaveNew` e `Update` não chamam mais `_filterRepository.GetRedeSerieId`; `redeSerieIds` agora é derivado de `redeSeries.Select(x => x.Id)` (confirmado que `GetRedeSeries`/`GetRedeSerieId` usam exatamente o mesmo `GetQueryable(...)` base em `FilterMatrizCurricularRepository.cs`, só com projeções diferentes — resultado idêntico). A checagem de "filtro inválido" passou a usar `redeSeries.Count == 0`. `RemoverMatrizCurricularService.cs` não tinha essa redundância (só chama `GetRedeSerieId`, nunca `GetRedeSeries`) — nenhuma alteração necessária lá. Suite: 53/53 passando.

---

### R14 — Remover código morto `CargaHorariaRepository.GetParaExport`

**O que fazer:** Remover o método `GetParaExport` de `CargaHorariaRepository.cs`/`ICargaHorariaRepository.cs` (linhas ~30-60).

**Contexto:** Método nunca chamado — a exportação real usa `IRedeSerieDisciplinaRepository.GetParaExport`, estruturalmente diferente e correto. Além de órfão, este método agrupa por nome de série (string), o que colidiria caso duas séries diferentes tenham o mesmo nome em segmentos distintos.

**Pronto quando:** O método é removido e o projeto continua compilando/testando normalmente.

**Status:** concluída — `GetParaExport` removido de `CargaHorariaRepository.cs` e `ICargaHorariaRepository.cs` (confirmado, via busca global, que não havia nenhum consumidor; a exportação real usa exclusivamente `IRedeSerieDisciplinaRepository.GetParaExport`). `using EstruturaPedagogica.Domain.DTO.MatrizCurricular;`, agora não utilizado nesses dois arquivos, também removido. Build completo do backend sem erros; suite: 53/53 passando.

---

### R15 — Mover `GetAreasConhecimento` do controller para um service

**O que fazer:** Extrair a lógica de `MatrizCurricularController.GetAreasConhecimento` (linhas ~154-162) — hoje injeta `IAreaConhecimentoRepository` diretamente e faz `OrderBy`/`Select` no controller — para um service dedicado (ex.: `IFilterMatrizCurricularService` ou serviço próprio), seguindo o padrão do restante do controller (controller apenas chama service e retorna `Result(...)`).

**Contexto:** Único endpoint do controller que injeta um repositório diretamente e monta lógica de negócio/projeção fora do padrão do projeto.

**Pronto quando:** O controller apenas delega a um service; nenhuma lógica de ordenação/projeção permanece no controller.

**Status:** concluída — `GetAreasConhecimento()` movido para `IFilterMatrizCurricularService`/`FilterMatrizCurricularService.cs`, que já concentra os demais endpoints de opções de filtro (`GetAnosLetivos`, `GetRedes`, `GetSegmentos`, `GetSeries`). Diferente dos outros, não chama `ValidarRequest` porque Área do Conhecimento é catálogo global, não filtrado por rede/segmento do usuário — documentado em comentário no método. `MatrizCurricularController.GetAreasConhecimento` agora só injeta o service e retorna `Result(...)`, removendo a dependência direta de `IAreaConhecimentoRepository` e os `using` que ficaram sem uso. Adicionados 2 testes cobrindo o novo método de service (ordenação por nome, independência de acesso a redes). Suite: 55/55 passando.

---

### R16 — `ResolverAreaConhecimentoId`: erro explícito quando hash não encontrado

**O que fazer:** Em `SaveMatrizCurricularService.cs` (linhas ~17-22), alterar `ResolverAreaConhecimentoId` para retornar um erro explícito ao usuário quando o `HashAreaConhecimento` informado não é encontrado, em vez de retornar `null` silenciosamente e salvar o registro sem área.

**Contexto:** Hoje um hash inválido é engolido silenciosamente, resultando em perda de dados sem qualquer aviso.

**Pronto quando:** Um `HashAreaConhecimento` inválido retorna erro explícito na resposta da API, em vez de salvar sem área silenciosamente.

**Status:** concluída — `ResolverAreaConhecimentoId` agora retorna `(int? AreaConhecimentoId, string Erro)`: continua retornando `(null, null)` quando o hash não foi informado (área opcional), mas retorna `(null, "A área do conhecimento informada não foi encontrada.")` quando um hash é informado e não corresponde a nenhum registro ativo. `SaveNew`/`Update` passaram a checar `erroArea` e abortar com esse erro antes de prosseguir. Adicionados 2 testes (`SaveNew_Retorna_Erro_Quando_HashAreaConhecimento_Nao_Encontrado`, `Update_Retorna_Erro_Quando_HashAreaConhecimento_Nao_Encontrado`). Suite: 57/57 passando.

---

## 🧪 Lacunas de teste

### R17 — Testes faltantes na Matriz Curricular

**O que fazer:** Adicionar os seguintes testes de integração em `backend/EstruturaPedagogica.Test/Integration/Scenarios/MatrizCurricular/`:
1. `Update_Retorna_Erro_Quando_Nome_Duplicado_Por_Serie` — equivalente ao já existente `SaveNew_Retorna_Erro_Quando_Nome_Duplicado_Por_Serie`, cobrindo CA-17 no fluxo de edição.
2. `ValidacaoMatrizCurricularServiceTests.cs` — teste próprio para `ValidarRequest`/`GetRedesDoUsuario`, hoje sempre mockado nos testes dos outros services e sem cobertura direta.
3. Teste de exportação com **múltiplas séries e múltiplas disciplinas**, verificando explicitamente a granularidade linha-a-linha (CA-23) — o teste atual (`Get_Retorna_Bytes_Quando_Existem_Dados_Na_Matriz`) usa apenas 1 disciplina/1 série e verifica somente `Assert.NotEmpty`.
4. Teste que tente trocar a disciplina vinculada num `Update` (`HashDisciplina` diferente do original) e verifique rejeição — depende da correção de R5.
5. Teste cobrindo o flag `NomeVariaPorSerie` na listagem (`GetDisciplinasService`).

**Pronto quando:** Todos os cinco cenários acima têm teste dedicado e passam com `dotnet test`.

**Status:** concluída — os 5 cenários cobertos:
1. `Update_Retorna_Erro_Quando_Nome_Duplicado_Por_Serie` adicionado em `SaveMatrizCurricularServiceTests.cs` (região "Update - Nome duplicado").
2. Criado `ValidacaoMatrizCurricularServiceTests.cs` (20 testes) cobrindo `ValidarRequest` nos 4 passos (`FilterAno`, `FilterRede`, `FilterSegmento`, `GetLista`) e `GetRedesDoUsuario`, espelhando o padrão já usado em `ConfiguradorDisciplinas/ValidacaoServiceTests.cs`.
3. `Get_Retorna_Uma_Linha_Por_Combinacao_Serie_Disciplina` adicionado em `ExportarMatrizCurricularServiceTests.cs`: 2 disciplinas × 2 séries, captura o `DataTable` real via `Callback` no mock de `IExportExcelService` e verifica 4 linhas com os nomes corretos.
4. Teste de rejeição de troca de disciplina no Update já havia sido coberto na R5 (`Update_Retorna_Erro_Quando_Disciplina_Nao_Esta_Na_Matriz`).
5. `GetConfiguradas_Marca_NomeVariaPorSerie_Quando_Nomes_Diferem_Entre_Series` e `GetConfiguradas_Nao_Marca_NomeVariaPorSerie_Quando_Nomes_Sao_Iguais_Entre_Series` adicionados em `GetDisciplinasMatrizCurricularServiceTests.cs`.

Suite completa de Matriz Curricular: 81/81 passando.

---

## ℹ️ Fora de escopo — confirmar antes do merge

### R18 — Confirmar mudanças fora do escopo de Matriz Curricular

**O que fazer:** Não é necessariamente uma correção — confirmar com o time se as seguintes mudanças, presentes no diff `develop...feature/EFC-6515`, devem estar neste PR ou em PR(s) separado(s):
1. `multi-select-field.component.ts:96` — remoção de `distinctUntilChanged()` do pipe de `valueChanges`, afetando todos os consumidores do componente compartilhado. Há uma guarda via `JSON.stringify` no `subscribe` que parece cobrir o caso, mas é uma mudança de comportamento em componente compartilhado sem justificativa aparente no escopo desta feature.
2. Alterações em `frontend/src/app/features/lancamento-frequencia/**` — `frequencia-tab-navigator`, `justificativas` (`.scss` + `.ts` com `BreakpointObserver`), `lista-presenca`, `listar.component.scss` (responsividade mobile) e `filtro-frequencia.service.ts:40` (`possuiVisaoCoordenacao` → `possuiLancamentoFrequencia`) — sem relação aparente com Matriz Curricular.

**Contexto:** Confirmado via `git diff develop...feature/EFC-6515` que essas mudanças estão de fato incluídas na branch da feature.

**Pronto quando:** Time confirma se as mudanças permanecem neste PR (e por quê) ou são movidas para PR(s) dedicado(s).

**Status:** parcialmente resolvida —
1. **`multi-select-field.component.ts`** — confirmado com o time: fica como está, sem alteração. A remoção de `distinctUntilChanged()` permanece no PR.
2. **`lancamento-frequencia/**`** — ainda pendente de confirmação com o time.

---

## Resumo por prioridade

| Prioridade | Tarefas | Qtd |
|---|---|---|
| 🔴 Bloqueante | R1–R5 | 5 |
| 🟠 Bug funcional | R6–R10 | 5 |
| 🟡 Duplicação/manutenção | R11–R16 | 6 |
| 🧪 Teste | R17 | 1 (5 cenários) |
| ℹ️ Confirmar escopo | R18 | 1 (2 itens) |
