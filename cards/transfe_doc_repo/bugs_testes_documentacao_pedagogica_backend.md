# Bugs encontrados ao criar testes automatizados — backend DocumentacaoPedagogica

**Data:** 2026-09-09
**Repositório:** `estrutura-pedagogica` (backend)
**Branch:** `projetos/MigracaoDocPed`
**Origem:** cobertura de testes de integração criada do zero para o backend novo da migração `documentacao-pedagogica` → `estrutura-pedagogica` (Configurações de Escola/Rede, Ano Letivo, Fundamentação Legal, Histórico do Aluno, Turma & Documentos). Nenhum teste existia antes desta rodada.

> **Status: implementado (2026-09-09).** As 4 correções abaixo foram aplicadas no código de produção e os testes que documentavam o comportamento com defeito foram atualizados para validar o comportamento correto. Suíte completa (`dotnet test EstruturaPedagogica.Test`) passando, 0 falhas, sem regressão nos testes pré-existentes. Ainda **não commitado/PR aberto** — ver seção "Plano de implementação".

---

## Resumo

| # | Serviço | Severidade | Sintoma | Status |
|---|---------|------------|---------|--------|
| 1 | `SalvarFundamentacaoLegalService` / `GetFundamentacaoLegalService` | Alta | Fundamentação legal inativada nunca pode ser reativada; `Ativo` sempre retorna `true` | ✅ Corrigido |
| 2 | `SalvarSeriesNomenclaturaService` | Média | Linha órfã de configuração persistida mesmo quando a operação falha | ✅ Corrigido |
| 3 | `SalvarHistoricoFundamentacaoService` | Alta | `NullReferenceException` sempre que o aluno já tem fundamentação salva | ✅ Corrigido |
| 4 | `SalvarHistoricoSerieService` | Média | Validação de "escola não encontrada" é código morto; `EscolaId = 0` é persistido silenciosamente | ✅ Corrigido |

---

## Bug 1 — Fundamentação Legal: inativação é definitiva, reativação nunca funciona

**Arquivos:**
- `backend/EstruturaPedagogica.Domain.Services/DocumentacaoPedagogica/FundamentacaoLegal/GetFundamentacaoLegalService.cs`
- `backend/EstruturaPedagogica.Domain.Services/DocumentacaoPedagogica/FundamentacaoLegal/SalvarFundamentacaoLegalService.cs`
- `backend/EstruturaPedagogica.Infra/Repositories/Stateful/FundamentacaoLegalRepository.cs`

### Causa raiz (duas falhas empilhadas)

1. Tanto `Get` quanto `Salvar` buscam os registros via `_fundamentacaoLegalRepository.Get(predicate)`, que é o método genérico de `Repository<T>` (`EstruturaPedagogica.Infra/Core/Repositories/Repository.cs`). Esse método usa `QueryableAtivos()` internamente, que sempre filtra `Ativo == true`. Consequências:
   - `FundamentacaoLegalGetResponse.Ativo` é sempre `true` — o campo existe no DTO mas nunca reflete um valor `false` real.
   - Em `Salvar`, a lista `existentes` nunca contém um item já inativado. Se o request vier com o `HashFundamentacaoLegal` de um item inativado (tentativa de reativar), `existentes.FirstOrDefault(...)` retorna `null` e o `continue` simplesmente ignora o item — sem erro, sem reativação.

2. Mesmo corrigindo (1), a lógica de `Salvar` tem uma segunda lacuna: no ramo de atualização, o código nunca atribui `existente.Ativo = item.Ativo`:
   ```csharp
   if (existente.Descricao != item.Descricao || existente.Ativo != item.Ativo)
   {
      existente.Descricao = item.Descricao;
      if (existente.Ativo && !item.Ativo) { await _fundamentacaoLegalRepository.Disable(existente); }
      else { paraAtualizar.Add(existente); }
   }
   ```
   Uma transição `Ativo: false → true` cai no `else` (`paraAtualizar.Add`), mas como `existente.Ativo` nunca foi setado para `true` em memória, o `Update` persiste a entidade com `Ativo` inalterado (`false`).

### Evidência
Teste `Get_ComFundamentacoesAtivasEInativas_RetornaApenasAtivasOrdenadasPorDescricao` em
`backend/EstruturaPedagogica.Test/Integration/Scenarios/FundamentacaoLegal/GetFundamentacaoLegalServiceTests.cs` documenta o comportamento atual (item inativo não aparece).

### Correção proposta

**1. Repositório** — adicionar método que traz ativos e inativos (nome sinaliza explicitamente o desvio do padrão, conforme convenção do `README.md`):

```csharp
// IFundamentacaoLegalRepository.cs
Task<List<FundamentacaoLegal>> GetPorRedeIncluindoInativas(int redeId);

// FundamentacaoLegalRepository.cs
public Task<List<FundamentacaoLegal>> GetPorRedeIncluindoInativas(int redeId)
{
   return Queryable(stateless: true).Where(x => x.RedeId == redeId).ToListAsync();
}
```

**2. `GetFundamentacaoLegalService.Get`** — trocar `_fundamentacaoLegalRepository.Get(x => x.RedeId == redeId)` por `GetPorRedeIncluindoInativas(redeId)`.

**3. `SalvarFundamentacaoLegalService.Salvar`**:
- Trocar `_fundamentacaoLegalRepository.Get(x => x.RedeId == redeId)` por `GetPorRedeIncluindoInativas(redeId)`.
- Corrigir o ramo de atualização para propagar o toggle de `Ativo` antes de decidir entre `Disable` e `Update`:
  ```csharp
  if (existente.Descricao != item.Descricao || existente.Ativo != item.Ativo)
  {
     existente.Descricao = item.Descricao;
     var vaiInativar = existente.Ativo && !item.Ativo;
     existente.Ativo = item.Ativo;

     if (vaiInativar) { await _fundamentacaoLegalRepository.Disable(existente); }
     else { paraAtualizar.Add(existente); }
  }
  ```

### Testes a ajustar
- `Get_ComFundamentacoesAtivasEInativas_RetornaApenasAtivasOrdenadasPorDescricao` passa a esperar que a inativa também apareça no response (com `Ativo = false`).
- Adicionar teste novo em `SalvarFundamentacaoLegalServiceTests`: `Salvar_ItemInativoReceboAtivoTrue_Reativa`.

---

## Bug 2 — `SalvarSeriesNomenclaturaService`: linha órfã quando a validação falha

**Arquivo:** `backend/EstruturaPedagogica.Domain.Services/DocumentacaoPedagogica/ConfiguracaoRede/SalvarSeriesNomenclaturaService.cs`

### Causa raiz
A ordem atual é: (1) busca/cria `ConfiguracaoRedeDocumentacaoPedagogica` — `Insert` já dá `SaveChangesAsync` imediato, por convenção do repo — e só depois (2) valida se cada `HashSerie` do request existe. Se uma série for inválida, o método retorna erro em (2), mas o registro de configuração criado em (1) já está commitado no banco. Resultado: uma operação reportada como falha deixa um efeito colateral persistido (linha de configuração vazia, sem nenhuma nomenclatura associada).

### Evidência
Teste `Salvar_SerieNaoEncontrada_RetornaErro` em
`backend/EstruturaPedagogica.Test/Integration/Scenarios/ConfiguracaoRede/SalvarSeriesNomenclaturaServiceTests.cs` passa hoje sem checar a ausência da linha órfã (deliberado, para não embutir o bug como comportamento esperado).

### Correção proposta
Mover a resolução/validação de todos os `HashSerie` para **antes** de qualquer escrita — mesmo padrão já usado em `ConfiguradorAnoLetivo/SalvarConfiguracaoService.cs` (validar tudo, só então gravar):

```csharp
var redeId = await _redeRepository.GetIdByHash(request.HashRede);
if (redeId == default) { return result.WithError("Rede não encontrada."); }

// validação movida para cá, antes de qualquer Insert/Update
var hashesSerieSolicitadas = request.Itens.Select(x => x.HashSerie).ToList();
var serieIdsPorHash = new Dictionary<Guid, int>();
foreach (var hashSerie in hashesSerieSolicitadas)
{
   var serieId = await _serieRepository.GetIdByHash(hashSerie);
   if (serieId == default) { return result.WithError($"Série não encontrada: {hashSerie}."); }
   serieIdsPorHash[hashSerie] = serieId;
}

var config = await _configuracaoRedeRepository.GetFirst(x => x.RedeId == redeId);
if (config == null)
{
   config = new ConfiguracaoRedeDocPedEntity { RedeId = redeId };
   await _configuracaoRedeRepository.Insert(config);
}
// ... resto do método sem alteração de lógica, só de posição
```

### Testes a ajustar
- `Salvar_SerieNaoEncontrada_RetornaErro`: adicionar assert de que `ConfiguracaoRedeDocumentacaoPedagogica` não foi persistida quando a rede ainda não tinha configuração prévia.

---

## Bug 3 — `SalvarHistoricoFundamentacaoService`: `NullReferenceException` quando já existe fundamentação salva

**Arquivo:** `backend/EstruturaPedagogica.Domain.Services/DocumentacaoPedagogica/HistoricoAluno/SalvarHistoricoFundamentacaoService.cs:35`

### Causa raiz
```csharp
var existentes = await _historicoFundamentacaoRepository.Get(x => x.HistoricoId == historico.Id);
var hashesExistentes = existentes.Select(x => x.FundamentacaoLegal.Hash).ToList();
var paraInativar = existentes.Where(x => !hashesAtivos.Contains(x.FundamentacaoLegal.Hash)).ToList();
```
`Get(predicate)` não faz `.Include(x => x.FundamentacaoLegal)` e o projeto não usa proxies de lazy-loading — logo `x.FundamentacaoLegal` é sempre `null` em qualquer entidade vinda desse método. Qualquer aluno que já tenha ao menos uma fundamentação salva faz esse código lançar `NullReferenceException` na primeira chamada subsequente de `Save`.

### Evidência
Teste `Save_AlunoComFundamentacaoJaExistente_LancaExcecaoPorFundamentacaoLegalNaoCarregada` em
`backend/EstruturaPedagogica.Test/Integration/Scenarios/HistoricoAluno/SalvarHistoricoFundamentacaoServiceTests.cs`.

### Correção proposta
`HistoricoFundamentacao` já expõe `FundamentacaoLegalId` (int) diretamente na entidade — não é preciso carregar a navegação. Resolver os hashes do request para ids uma única vez e comparar por id, não por hash via navegação:

```csharp
var existentes = await _historicoFundamentacaoRepository.Get(x => x.HistoricoId == historico.Id);

var hashesAtivos = request.Data.Where(x => x.Ativo).Select(x => x.HashFundamentacaoLegal).Distinct().ToList();
var idsAtivos = new List<int>();
foreach (var hash in hashesAtivos)
{
   var id = await _fundamentacaoLegalRepository.GetIdByHash(hash);
   if (id != default) { idsAtivos.Add(id); }
}

var paraInativar = existentes.Where(x => !idsAtivos.Contains(x.FundamentacaoLegalId)).ToList();
if (paraInativar.Count > 0) { await _historicoFundamentacaoRepository.Disable(paraInativar); }

var idsExistentes = existentes.Select(x => x.FundamentacaoLegalId).ToList();
var novosIds = idsAtivos.Where(id => !idsExistentes.Contains(id)).ToList();

if (novosIds.Count > 0)
{
   var novasEntidades = novosIds
      .Select(id => new HistoricoFundamentacao { HistoricoId = historico.Id, FundamentacaoLegalId = id })
      .ToList();
   await _historicoFundamentacaoRepository.Insert(novasEntidades);
}
```
Isso elimina o loop duplicado que já existia depois (resolvendo hash→id de novo para os itens novos) — a resolução passa a acontecer uma única vez, no início.

### Testes a ajustar
- `Save_AlunoComFundamentacaoJaExistente_LancaExcecaoPorFundamentacaoLegalNaoCarregada` deixa de esperar exceção e passa a validar o comportamento correto (mantém ativas, inativa removidas, insere novas).

---

## Bug 4 — `SalvarHistoricoSerieService`: validação de escola é código morto

**Arquivo:** `backend/EstruturaPedagogica.Domain.Services/DocumentacaoPedagogica/HistoricoAluno/SalvarHistoricoSerieService.cs:35`

### Causa raiz
```csharp
int? escolaId = null;
if (request.HashEscola.HasValue)
{
   escolaId = await _escolaRepository.GetIdByHash(request.HashEscola.Value);
   if (escolaId == default) { return result.WithError("Escola não encontrada."); }
}
```
`IEscolaRepository.GetIdByHash` retorna `int` (não-nullable): `0` quando não encontra. `escolaId` é `int?`; nesse contexto `default` é inferido como `default(int?)` (`null`). Como `escolaId` acabou de receber um valor (mesmo que `0`), `escolaId.HasValue` é sempre `true` — a comparação `escolaId == default` (`== null`) nunca é verdadeira. A validação nunca dispara e um `HashEscola` inválido é persistido como `EscolaId = 0`.

### Evidência
Teste `Save_EscolaInformadaNaoEncontrada_NaoValidaEPersisteEscolaIdZero` em
`backend/EstruturaPedagogica.Test/Integration/Scenarios/HistoricoAluno/SalvarHistoricoSerieServiceTests.cs`.

### Correção proposta
Seguir a convenção do `README.md` ("não promover tipos não-nullable para nullable sem necessidade real; `int` de busca já retorna `0`, checar `== default`"):

```csharp
var escolaId = 0;
if (request.HashEscola.HasValue)
{
   escolaId = await _escolaRepository.GetIdByHash(request.HashEscola.Value);
   if (escolaId == default) { return result.WithError("Escola não encontrada."); }
}
// ...
entity.EscolaId = escolaId == default ? null : escolaId;
```

### Testes a ajustar
- `Save_EscolaInformadaNaoEncontrada_NaoValidaEPersisteEscolaIdZero` passa a esperar o erro `"Escola não encontrada."` e nenhuma persistência.

---

## Plano de implementação

1. ~~Corrigir os 4 serviços~~ — **feito**, ver diffs exatos aplicados em cada seção acima.
2. ~~Atualizar os testes que documentavam o bug~~ — **feito**:
   - `GetFundamentacaoLegalServiceTests.Get_ComFundamentacoesAtivasEInativas_RetornaApenasAtivasOrdenadasPorDescricao` → renomeado para `..._RetornaTodasOrdenadasPorDescricaoComAtivoCorreto`, agora espera as 3 fundamentações (incluindo a inativa, com `Ativo = false`).
   - `SalvarFundamentacaoLegalServiceTests` → novo teste `Salvar_ComItemInativoRecebendoAtivoTrue_ReativaERetornaTrue`.
   - `SalvarSeriesNomenclaturaServiceTests.Salvar_SerieNaoEncontrada_RetornaErro` → adicionado assert de que a `ConfiguracaoRedeDocumentacaoPedagogica` não fica órfã.
   - `SalvarHistoricoFundamentacaoServiceTests.Save_AlunoComFundamentacaoJaExistente_LancaExcecaoPorFundamentacaoLegalNaoCarregada` → renomeado para `..._MantemAtivaSemLancarExcecao`, não espera mais exceção.
   - `SalvarHistoricoSerieServiceTests.Save_EscolaInformadaNaoEncontrada_NaoValidaEPersisteEscolaIdZero` → renomeado para `..._RetornaErroENaoPersisteHistorico`, agora espera o erro e nenhuma persistência.
3. ~~Rodar a suíte completa~~ — **feito**: `dotnet test EstruturaPedagogica.Test` a partir de `backend/`, 0 falhas (148 testes da feature DocumentacaoPedagogica + suíte completa do repositório).
4. **Pendente:** revisar o diff e decidir se abre um PR isolado para essas 4 correções (recomendado, já que são bugs de produção genuínos, não relacionados à tarefa original de criar cobertura) ou se entram junto com o commit de testes. Nenhum commit/push foi feito por esta sessão.

## Rastreabilidade
Card Jira: nenhum encontrado em `cards/` cobrindo especificamente esta migração (branch `projetos/MigracaoDocPed`). Se existir um card no Jira para isso, linkar aqui e mover este documento para `cards/EFC-xxxx/` quando o número for confirmado.
