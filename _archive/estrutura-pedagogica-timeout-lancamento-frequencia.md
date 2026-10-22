# Investigação: timeouts em LancamentoFrequencia/GetEventos (estrutura-pedagogica)

**Origem:** investigação iniciada a partir de alertas de erro no Slack (`/aws/estrutura-pedagogica/syslog` → Lambda `CloudwatchLogsSlackSender`), que levou à identificação de um timeout de SQL recorrente no endpoint `LancamentoFrequencia/GetEventos`, em produção.

**Ambiente:** AWS conta `980106147241` (produção), banco SQL Server `ElevaPortalHomolog`/produção equivalente, tabela `AulaEvento` (~57 milhões de linhas).

---

## 1. Causas raiz identificadas e já corrigidas

### 1.1 Predicado não-sargable em `AulaEventoRepository.GetEventosParaFrequencia`

**Arquivo:** `backend/EstruturaPedagogica.Infra/Repositories/Stateful/AulaEventoRepository.cs`

Antes:
```csharp
var dataAula = request.Data.Date;
var query = QueryableAtivos()
      .Where(x => turmaIds.Contains(x.TurmaId)
               && x.DataInicio.Date == dataAula   // <-- não-sargable
               && x.PossuiFrequencia);
```

`x.DataInicio.Date == dataAula` é traduzido pelo EF Core para `CAST(DataInicio AS date) = @p`. Aplicar uma função sobre a coluna no `WHERE` impede o SQL Server de fazer index seek em `IX_AulaEvento.DataInicio` (índice existente, mas inutilizado por causa da função) — o resultado era um scan sobre boa parte das 57M linhas da tabela, estourando o `CommandTimeout` de 30s configurado em `Startup.cs`.

**Correção aplicada** — trocado por intervalo sargable:
```csharp
var dataAula = request.Data.Date;
var proximoDia = dataAula.AddDays(1);
var query = QueryableAtivos()
      .Where(x => turmaIds.Contains(x.TurmaId)
               && x.DataInicio >= dataAula && x.DataInicio < proximoDia
               && x.PossuiFrequencia);
```

**Status:** ✅ aplicado e em produção. Reduziu a frequência do timeout drasticamente (de recorrente para raro).

### 1.2 Subquery correlacionada redundante (mesmo método)

Na projeção (`Select`) do mesmo método, `PossuiAlocacaoProfessor` recomputava — por linha — exatamente o mesmo `Any()` já usado no `WHERE` para filtrar quando `!request.PossuiVisaoCoordenacao` (visão de professor):

```csharp
// WHERE (só quando !PossuiVisaoCoordenacao)
x.Turma.Professores.Any(p => p.Ativo && (...) && p.PessoaEscolaAcesso.PessoaEscola.Pessoa.Usuario.Id == idUsuario)

// SELECT — idêntico, reavaliado por linha, sempre
PossuiAlocacaoProfessor = x.Turma.Professores.Any(p => p.Ativo && (...) && ... == idUsuario)
```

Como o `WHERE` já garante que toda linha sobrevivente satisfaz essa condição, a reavaliação na projeção era 100% redundante — custo de subquery correlacionada (4 joins: `Turma → Professores → PessoaEscolaAcesso → PessoaEscola → Pessoa → Usuario`) por linha, sem mudar o resultado.

**Correção aplicada:**
```csharp
var possuiVisaoCoordenacao = request.PossuiVisaoCoordenacao;
...
PossuiAlocacaoProfessor = possuiVisaoCoordenacao
   ? x.Turma.Professores.Any(p => ...)   // só recalcula quando realmente necessário
   : true                                 // já garantido pelo WHERE
```

**Status:** ✅ aplicado e em produção.

### 1.3 Falha transiente de transação sem retry (`SaveChamada` e demais `Save*`)

Endpoint diferente (`LancamentoFrequencia/SaveChamada`), mas mesma investigação: erros `"An error occurred using a transaction."` + `"An exception has been raised that is likely due to a transient failure..."` no Slack, causados por conflitos de **Snapshot Isolation** sob concorrência (dois usuários lançando frequência/ocorrência ao mesmo tempo), sem política de retry configurada.

**Validado antes de corrigir:** telas de salvamento (`lancamento-frequencia`, `painel-aluno` → Ocorrências/Atendimento/Documentos) já possuem proteção robusta contra clique duplo (flag `salvando`/`salvandoInclusao` com guarda síncrona + botão oculto/desabilitado na UI) — **não é causa de clique duplo**, é concorrência real entre sessões distintas.

**Correção proposta (aplicada e depois desfeita neste branch):**
- `UnitOfWork.cs`: a transação manual (`BeginTransactionAsync`) rodando dentro de `Database.CreateExecutionStrategy().ExecuteAsync(...)` — forma correta do EF Core de combinar transação explícita com retry (sem isso, habilitar retry quebra em runtime).
- `Startup.cs`: `.EnableRetryOnFailure(maxRetryCount: 3)` na configuração do `UseSqlServer`.

**Status:** ⚠️ Revertido neste branch — `UnitOfWork.cs` voltou ao original (sem execution strategy) e o `.EnableRetryOnFailure` foi removido do `Startup.cs`. Motivo do revert não investigado nesta sessão. Fica como pendente de decisão do time: reaplicar, ajustar a abordagem, ou descartar.

---

## 2. Achados adicionais

### 2.1 Mesma subquery redundante em `FilterLancamentoFrequenciaRepository.GetTurmasParaEventos`

**Arquivo:** `backend/EstruturaPedagogica.Infra/Repositories/Filters/FilterLancamentoFrequenciaRepository.cs` (linhas ~168-198)

Esse método roda **antes** do `GetEventosParaFrequencia` no mesmo fluxo (`GetEventosService.Get`), e tem exatamente o mesmo padrão do item 1.2:

```csharp
if (!request.PossuiVisaoCoordenacao)
{
   turmas = FiltrarPorAlocacao(turmas);   // já filtra por Professores.Any(p => p.Ativo && ... == idUsuario)
}

return (from t in turmas
        ...
        select new TurmaParaEventosItem
        {
           ...
           PossuiAlocacao = t.Professores
              .Any(p => p.Ativo && p.PessoaEscolaAcesso.PessoaEscola.Pessoa.Usuario.Id == idUsuario)
              // ^ idêntico ao filtro de FiltrarPorAlocacao — redundante quando !PossuiVisaoCoordenacao
        })
```

**Correção aplicada:** mesmo padrão do item 1.2 — `PossuiAlocacao` usa `true` direto quando `!request.PossuiVisaoCoordenacao`, em vez de recalcular o `Any()` já garantido por `FiltrarPorAlocacao`.

**Status:** ✅ aplicado e em produção. Impacto menor que o item 1.2 (essa query já é bem mais seletiva — filtra só turmas elegíveis do usuário, não a tabela de 57M linhas), mas elimina o mesmo anti-padrão se repetindo no mesmo fluxo.

### 2.2 Tabela de lookup estático recarregada a cada request

**Arquivo:** `backend/EstruturaPedagogica.Infra/Repositories/Base/StatusLancamentoFrequenciaRepository.cs`

```csharp
public Task<List<StatusLancamentoFrequenciaResponse>> GetResponse()
{
   return QueryableAtivos().Select(...).OrderBy(x => x.Ordem).ToListAsync();
}
```

`StatusLancamentoFrequencia` é uma tabela de domínio fixa (4 status: PendenteLancamento, PossuiPendencia, PendenteConfirmacao, LancadoPorCompleto) que praticamente nunca muda, mas é consultada no banco em **toda** chamada a `GetEventosParaFrequencia`/`GetEventosService.Get`.

**Correção aplicada:** cache em `IMemoryCache` (registrado via `services.AddMemoryCache()` em `Startup.cs`) com TTL de 1h — elimina o round-trip ao banco na maioria das chamadas, com invalidação automática por expiração (sem necessidade de endpoint manual, dado que os valores raramente mudam).

**Status:** ✅ aplicado e em produção.

### 2.3 Encadeamento sequencial de round-trips ao banco no fluxo completo

**Arquivo:** `backend/EstruturaPedagogica.Domain.Services/LancamentoFrequencia/GetEventosService.cs` + `ValidacaoService.cs`

Mapeando o fluxo completo de uma chamada a `GetEventos`, contei **~12 round-trips sequenciais ao banco** (3 dentro de `ValidacaoService.ValidarRequest` + ~9 dentro de `GetEventosService.Get`), vários dos quais são **independentes entre si** mas executados um depois do outro:

- `PossuiVisaoCoordenacao` e `PossuiJustificarFaltas` (em `ValidacaoService`) — mesma escola, nenhuma depende da outra.
- `GetAlunoTurmaPorTurmaDataAula` e `GetEventosParaFrequencia` — ambas dependem só de `turmaIdList` + data, não uma da outra.
- `GetAlunoDisciplinaPorTurmaDisciplinaPessoa`, `GetParaListagemEventos` (frequências) e `GetPessoaIdsComJustificativaPorData` — todas dependem de `pessoaIds`/`turmas`/`eventos` já resolvidos, mas não dependem entre si.
- `StatusLancamentoFrequenciaRepository.GetResponse()` — não depende de nada no request, poderia disparar no início de tudo.

**Por que isso importa:** mesmo com cada query individualmente rápida, 12 round-trips sequenciais somam latência de rede/banco que não precisa existir — e, sob carga ou com uma query momentaneamente mais lenta, aumenta a chance de a soma se aproximar do timeout configurado.

**Ressalva importante antes de implementar:** o `DbContext` do EF Core **não é thread-safe** — não dá para simplesmente envolver essas chamadas em `Task.WhenAll` enquanto todos os repositórios compartilham a mesma instância de `ApplicationContext` (injeção scoped padrão). Implementar esse paralelismo exigiria:
- usar `IDbContextFactory<ApplicationContext>` para criar contextos dedicados por ramo paralelo, **ou**
- aceitar que o paralelismo fica restrito a chamadas que já usam contextos diferentes.

**Classificação:** oportunidade real de redução de latência, mas de **maior esforço/risco** que os itens 1.x e 2.1/2.2 — requer refatoração de como os repositórios obtêm o `DbContext`, não é um ajuste pontual de query. Recomendo tratar como item de backlog separado, não como parte desta correção de timeout.

---

## 3. Índice composto — ação de infraestrutura (DBA), não de código

Confirmado em `ElevaPortalHomolog`: `AulaEvento` tem apenas índices de **coluna única** (`IX_AulaEvento.Turma`, `IX_AulaEvento.DataInicio`), nenhum composto. A query de `GetEventosParaFrequencia` filtra por `TurmaId` (igualdade) **e** `DataInicio` (intervalo) ao mesmo tempo — o otimizador só consegue usar um dos dois índices para seek, fazendo *key lookup* para aplicar o outro filtro.

**Recomendação para o DBA avaliar** (após validar no plano de execução real):
```sql
CREATE NONCLUSTERED INDEX IX_AulaEvento_Turma_DataInicio
ON AulaEvento (TurmaId, DataInicio)
INCLUDE (Hash, TurnoId, FrenteId, Semestre, Tempo, DataTermino, PossuiFrequencia, DiaLetivoExtraId)
```

Isso tornaria a query coberta (sem key lookup) e eliminaria a dependência do volume histórico acumulado na tabela — o ganho esperado é de 1-2 ordens de magnitude em leituras lógicas para essa query específica. Trade-off: custo de manutenção do índice em escritas (baixo, pois `AulaEvento` é majoritariamente lida) e espaço em disco; criação em tabela de 57M linhas pode exigir janela de manutenção ou `WITH (ONLINE = ON)` conforme a edição do SQL Server.

---

## 4. Resumo e priorização sugerida

| # | Item | Status | Esforço | Impacto |
|---|---|---|---|---|
| 1.1 | Predicado sargable em `GetEventosParaFrequencia` | ✅ Aplicado | Baixo | Alto (causa raiz principal) |
| 1.2 | Remover subquery redundante (`AulaEventoRepository`) | ✅ Aplicado | Baixo | Médio |
| 1.3 | Retry em falha transiente de transação (`UnitOfWork`) | ⚠️ Revertido neste branch | Médio | Médio-Alto (erros de `Save*`) |
| 2.1 | Mesma subquery redundante em `FilterLancamentoFrequenciaRepository` | ✅ Aplicado | Baixo | Baixo-Médio |
| 2.2 | Cache do lookup estático de status (`IMemoryCache`) | ✅ Aplicado | Baixo | Baixo (mas fácil) |
| 2.3 | Paralelizar round-trips independentes | Pendente | Alto (requer `IDbContextFactory`) | Médio-Alto |
| 3 | Índice composto `(TurmaId, DataInicio)` | Pendente (DBA) | Médio (infra) | Alto |

Itens 2.3 e 3 são de maior esforço/impacto e vale discutir em planejamento com o time antes de implementar.
