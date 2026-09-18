# Tarefas — EFC-6665 (Consulta de %Frequência de estrutura-pedagogica)

> Gerado a partir de `EFC-6665.tech.md`. Plano completo em `cards/EFC-6665/EFC-6665.tech.md`.

---

## T1 — DTO de resposta

**O que fazer:** Criar o DTO de resposta do novo endpoint em `estrutura-pedagogica`, espelhando 1:1 o contrato do endpoint legado de frequência.

**Contexto:** CAs cobertos: CA-01, CA-03. Criar `backend/EstruturaPedagogica.Domain/DTO/AlunoPercentualFrequencia/PercentualFrequenciaAlunoResponse.cs` com `HashOrigemAnoLetivo` (Guid), `HashOrigemSerie` (Guid), `PercentualFrequencia` (string). Não reaproveitar DTOs existentes de frequência — este é um contrato de integração externa, não de UI.

**Pronto quando:** Projeto compila sem erros após a criação do DTO.

**Status:** concluída

---

## T2 — Consulta no repositório

**O que fazer:** Adicionar a `IAlunoPercentualFrequenciaRepository`/`AlunoPercentualFrequenciaRepository` um método de consulta por hash de usuário de origem.

**Contexto:** CAs cobertos: CA-01, CA-02, CA-03, CA-04, CA-06, CA-07 / RN-01, RN-02, RN-03. Método `GetPorHashUsuarioOrigem(Guid hashUsuarioOrigem)`:
- Filtrar por `x.Pessoa.Usuario.Hash == hashUsuarioOrigem` (mesmo padrão de `AlunoEscolaRepository.GetParaFichaIndividual`).
- Usar `QueryableAtivos()` para garantir o valor mais atualizado (CA-04).
- Projetar via `.Select()` direto para o DTO da T1: `AnoLetivo.Hash`, `Serie.Hash`, `Percentual.ToString(...)` — sem `.Include()`.
- Hash sem correspondência → retorna lista vazia naturalmente, sem tratamento especial (RN-01/CA-07).
- Múltiplas séries no mesmo ano letivo → um item por combinação (RN-03), sem agregação.

**Pronto quando:** Projeto compila e o método retorna corretamente uma lista projetada, vazia quando o hash não corresponde a nenhum aluno.

**Status:** concluída

---

## T3 — Service de aplicação _(seguir command `criar-service`)_

**O que fazer:** Criar o service que orquestra a consulta de percentual de frequência, seguindo `.claude/commands/criar-service.md` do repositório `estrutura-pedagogica`.

**Contexto:** CAs cobertos: CA-02, CA-04, CA-05, CA-06, CA-07. Criar `IConsultaPercentualFrequenciaService`/`ConsultaPercentualFrequenciaService` em `backend/EstruturaPedagogica.Domain.Services/`:
- `ValidarRequest`: apenas garante que o hash foi informado (Guid não vazio) — não validar se o hash existe, isso é responsabilidade do repositório retornar vazio.
- Chama o repositório da T2 e retorna `ServiceResult<List<PercentualFrequenciaAlunoResponse>>`, com `IsSuccess = true` mesmo quando a lista vem vazia (CA-06/CA-07 — lista vazia nunca é erro).

**Pronto quando:** Service criado, compila e retorna `ServiceResult` de sucesso tanto com dados quanto com lista vazia.

**Status:** concluída

---

## T4 — Autenticação machine-to-machine por API-Key

**O que fazer:** Criar um filtro/atributo de ação que valida um header `x-api-key` em `estrutura-pedagogica`, para proteger endpoints chamados por outros sistemas sem sessão de usuário.

**Contexto:** Infraestrutura — sem CA associado diretamente, mas bloqueante para a T5. Criar `ApiKeyAuthorizationFilter` (ou nome equivalente) em `backend/EstruturaPedagogica.Api/`, validando o header `x-api-key` contra um valor configurado em `appsettings` (nova seção, ex.: `IntegracaoExterna:PercentualFrequencia:ApiKey`). Este é o primeiro uso desse padrão no repositório — documentar com comentário no filtro o motivo da exceção ao padrão `[RequiredAuthorization]` de sessão.

**Pronto quando:** O filtro rejeita requisições sem o header correto ou com chave inválida, e permite requisições com a chave correta.

**Status:** concluída

---

## T5 — Endpoint

**O que fazer:** Expor o endpoint de consulta de percentual de frequência em `estrutura-pedagogica`, replicando a rota do contrato legado.

**Contexto:** CAs cobertos: CA-01 a CA-07. Criar novo controller (ex.: `IntegracaoFrequenciaController`, rota `api/aluno`) ou estender `AlunoFrequenciaController` com a action `GET percentualfrequencia-aluno?hashUsuarioOrigem={guid}`, replicando exatamente a rota e o nome do parâmetro do contrato legado (exceção deliberada à convenção de "filtros no corpo" — comentar no código). Aplicar `[AllowAnonymous]` + filtro de API-Key da T4. Chamar o service da T3 e retornar o `ServiceResult` diretamente.

**Pronto quando:** É possível chamar `GET api/aluno/percentualfrequencia-aluno?hashUsuarioOrigem={guid}` com o header `x-api-key` correto e receber a lista de percentuais no formato do contrato legado.

**Status:** concluída

---

## T6 — Configuração e troca de URL em documentacao-pedagogica

**O que fazer:** Criar nova configuração dedicada em `documentacao-pedagogica` e apontar a chamada de percentual de frequência para o novo endpoint de `estrutura-pedagogica`.

**Contexto:** CA coberto: CA-05.
- Criar nova seção de configuração dedicada (ex.: `EstruturaPedagogicaIntegracao: { ApiUrl, ApiKey }`) em `backend/DocumentacaoPedagogica.Api/appsettings.json` e demais arquivos de ambiente existentes — **sem tocar** na seção `Frequencia` atual (compartilhada com `FrequenciaRepository`/`api/diariodeclasse/chamadas`, fora de escopo).
- Adicionar a propriedade correspondente em `AppSettings.cs`.
- Modificar `PercentualFrequenciaRepository.cs` para usar a nova seção de settings, mantendo a URL relativa (`api/aluno/percentualfrequencia-aluno?hashUsuarioOrigem=`) e o header `x-api-key` idênticos — nenhuma mudança em `IPercentualFrequenciaRepository`, `PercentualFrequenciaGetService`, `PercentualFrequenciaResponse` ou `SyncPercentualFrequenciaService`.

**Pronto quando:** `PercentualFrequenciaRepository` chama a nova URL configurada, sem nenhuma alteração no restante do fluxo de sincronização.

**Status:** concluída

---

## T7 — Testes de integração _(seguir command `criar-testes`)_

**O que fazer:** Criar os testes de integração do novo service, seguindo `.claude/commands/criar-testes.md` do repositório `estrutura-pedagogica`.

**Contexto:** Cobre todos os CAs. Criar `Test/Integration/Scenarios/{Namespace}/ConsultaPercentualFrequenciaServiceTests.cs` cobrindo:
- Aluno com percentual calculado em múltiplos anos letivos/séries → retorna um item por combinação (RN-03/CA-01/CA-03).
- Aluno sem nenhum percentual calculado → lista vazia, `IsSuccess = true` (CA-06).
- Hash de origem inexistente → lista vazia, sem exceção (RN-01/CA-07).
- Repositório real (`AddTransient`), demais dependências mockadas conforme padrão do repositório.

**Pronto quando:** Todos os testes passam com `dotnet build` + `dotnet test`.

**Status:** concluída (implementado; `dotnet build`/`dotnet test` não executados nesta sessão — validar antes de considerar definitivamente pronto)

---

## T8 — Validação manual end-to-end

**O que fazer:** Validar em homolog que a sincronização de `documentacao-pedagogica` funciona ponta a ponta com o novo endpoint de `estrutura-pedagogica`.

**Contexto:** Infraestrutura — CA-05. Apontar a nova config de `documentacao-pedagogica` (T6) para o novo endpoint de `estrutura-pedagogica` (T5) e confirmar que `SyncPercentualFrequenciaService` continua atualizando `HistoricoSerie.PercentualFrequencia` sem qualquer alteração de código no lado consumidor. Atenção ao formato do percentual como string (casas decimais, separador) — deve ser compatível com o que o módulo legado produzia.

**Pronto quando:** A sincronização roda em homolog e `HistoricoSerie.PercentualFrequencia` é atualizado corretamente a partir do novo endpoint.

**Status:** pendente (requer ação manual — deploy em homolog, geração/troca das chaves de API reais e execução da sincronização; não executável pelo agente)
