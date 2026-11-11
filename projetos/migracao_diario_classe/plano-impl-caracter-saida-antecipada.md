# Plano: Carácter para Saída Antecipada no Diário de Classe

**Contexto:** O diário de classe migrado para o `estrutura-pedagogica` já possui 5 caracteres de frequência (Presença, Falta, Pendência, Transferência, NEE). Existe um novo processo de saída antecipada (`AlunoSaidaAntecipada`) que precisa ser representado no documento gerado, com seu próprio carácter configurável.

---

## Visão geral das mudanças

```
DB → Entity → Mapping → DTOs → Repository → Service → [documento gerado]
                                                     → [aba de configuração]
```

A saída antecipada é registrada em `AlunoSaidaAntecipada` (linked a `AulaEvento.Id`).
O documento resolve chamadas via `AlunoFrequenciaBulkResponse` (linked por `DataAula + TurnoId + Tempo`).
O plano conecta as duas tabelas via `AulaEvento.Id`, que já existe em `AulaEventoParaDiarioClasseResponse`.

---

## Lógica de prioridade no documento

```
freq == null                          → carácter Pendência
freq.EhFalta == true                  → carácter Falta
freq.EhFalta == false && saidaExiste  → carácter Saída Antecipada  ← novo
freq.EhFalta == false && !saidaExiste → carácter Presença
```

---

## Tarefas — Backend

### 1. SQL — Migration
**Arquivo:** `cards/EFC-6379/sql/add-caracter-saida-antecipada.sql` (criar)

```sql
ALTER TABLE "DiarioDeClasseConfiguracao"
  ADD "CaracterParaIndicarSaidaAntecipada" VARCHAR(10) NULL;
```

Nullable porque registros existentes não têm o valor. O backend faz fallback para `"S"` quando null.

---

### 2. Entity
**Arquivo:** `EstruturaPedagogica.Domain/Entities/Stateful/DiarioDeClasseConfiguracao.cs`

Adicionar após `CaracterParaIndicarNEE`:
```csharp
public virtual string CaracterParaIndicarSaidaAntecipada { get; set; }
```

---

### 3. EF Mapping
**Arquivo:** `EstruturaPedagogica.Infra/Mapping/Stateful/DiarioDeClasseConfiguracaoMap.cs`

Adicionar após o mapeamento de `CaracterParaIndicarPendencia`:
```csharp
builder.Property(x => x.CaracterParaIndicarSaidaAntecipada).IsRequired(false);
```

---

### 4. DTOs — adicionar o campo nos três contratos

**`DiarioDeClasseCaracterResponse.cs`** — resposta embutida no documento:
```csharp
public string CaracterParaIndicarSaidaAntecipada { get; set; }
```

**`DiarioDeClasseConfiguracaoResponse.cs`** — resposta da aba de configuração:
```csharp
public string CaracterParaIndicarSaidaAntecipada { get; set; }
```

**`DiarioDeClasseConfiguracaoSaveRequest.cs`** — request do save da configuração:
```csharp
public string CaracterParaIndicarSaidaAntecipada { get; set; }
```

---

### 5. Novo DTO bulk para saída antecipada
**Arquivo:** `EstruturaPedagogica.Domain/DTO/DiarioDeClasse/AlunoSaidaAntecipadaBulkResponse.cs` (novo)

```csharp
[ExcludeFromCodeCoverage]
public class AlunoSaidaAntecipadaBulkResponse
{
    public int PessoaId     { get; set; }
    public int AulaEventoId { get; set; }
}
```

---

### 6. Interface — novo método de bulk
**Arquivo:** `EstruturaPedagogica.Domain/Interfaces/Stateful/IAlunoSaidaAntecipadaRepository.cs`

Adicionar:
```csharp
Task<List<AlunoSaidaAntecipadaBulkResponse>> GetBulkParaDiarioClasse(
    List<int> aulaEventoIds, List<int> pessoaIds);
```

---

### 7. Repository — implementar o método bulk
**Arquivo:** `EstruturaPedagogica.Infra/Repositories/Stateful/AlunoSaidaAntecipadaRepository.cs`

```csharp
public Task<List<AlunoSaidaAntecipadaBulkResponse>> GetBulkParaDiarioClasse(
    List<int> aulaEventoIds, List<int> pessoaIds)
{
    return QueryableAtivos()
          .Where(x => aulaEventoIds.Contains(x.AulaEventoId)
                   && pessoaIds.Contains(x.PessoaId))
          .Select(x => new AlunoSaidaAntecipadaBulkResponse
          {
             PessoaId     = x.PessoaId,
             AulaEventoId = x.AulaEventoId,
          })
          .ToListAsync();
}
```

---

### 8. DiarioDeClasseConfiguracaoRepository — projeção
**Arquivo:** `EstruturaPedagogica.Infra/Repositories/Stateful/DiarioDeClasseConfiguracaoRepository.cs`

Em `GetPorRede`, adicionar ao `Select`:
```csharp
CaracterParaIndicarSaidaAntecipada = x.CaracterParaIndicarSaidaAntecipada,
```

---

### 9. SaveConfiguracaoDiarioDeClasseService — mapeamento no insert e no update
**Arquivo:** `EstruturaPedagogica.Domain.Services/DiarioDeClasse/SaveConfiguracaoDiarioDeClasseService.cs`

Nos dois blocos (`entidade = new ...` e `entidade.Caract... = ...`), adicionar:
```csharp
CaracterParaIndicarSaidaAntecipada = request.CaracterParaIndicarSaidaAntecipada,
```

---

### 10. GetDocumentoDiarioDeClasseService — conectar saída antecipada ao documento

**Arquivo:** `EstruturaPedagogica.Domain.Services/DiarioDeClasse/GetDocumentoDiarioDeClasseService.cs`

**10a.** Injetar `IAlunoSaidaAntecipadaRepository` no construtor.

**10b.** `MapearCaracteres` — adicionar o novo campo:
```csharp
CaracterParaIndicarSaidaAntecipada = configuracao.CaracterParaIndicarSaidaAntecipada,
```

**10c.** `CarregarFrequenciaAsync` — alterar assinatura e resultado para incluir saídas:

A tupla de retorno passa a ser:
```csharp
private async Task<(
    List<AulaEventoParaDiarioClasseResponse>  Aulas,
    List<AlunoTurmaComDadosInternalResponse>  Alunos,
    List<AlunoFrequenciaBulkResponse>         Frequencias,
    HashSet<(int PessoaId, int AulaEventoId)> SaidasAntecipadas)>
CarregarFrequenciaAsync(...)
```

Dentro do bloco `if (aulas.Any() && pessoaIds.Any())`, após carregar `frequencias`, adicionar:
```csharp
var aulaEventoIds = aulas.Select(a => a.Id).ToList();
var saidasLista   = await _saidaAntecipadaRepository.GetBulkParaDiarioClasse(aulaEventoIds, pessoaIds);
var saidasSet     = saidasLista.Select(s => (s.PessoaId, s.AulaEventoId)).ToHashSet();
```

Retornar `saidasSet` (HashSet vazio fora do `if`).

**10d.** `MontarGradeChamadas` — atualizar assinatura e lógica:

Adicionar parâmetro `HashSet<(int PessoaId, int AulaEventoId)> saidasAntecipadas`.

Adicionar variável de carácter:
```csharp
var caracterSaidaAntecipada = configuracao?.CaracterParaIndicarSaidaAntecipada ?? "S";
```

Substituir a expressão da chamada na lambda `aulas.Select(aula => ...)`:
```csharp
if (freq == null) return caracterPendencia;
if (!freq.EhPresenca) return caracterFalta;
if (saidasAntecipadas.Contains((aluno.PessoaId, aula.Id))) return caracterSaidaAntecipada;
return caracterPresenca;
```

Atualizar a chamada em `Get`:
```csharp
var (aulas, alunos, frequencias, saidasAntecipadas) = await CarregarFrequenciaAsync(request, ctx);
// ...
MontarGradeChamadas(aulas, alunos, frequencias, saidasAntecipadas, ctx.Configuracao, result.Data);
```

---

## Tarefas — Frontend

### 11. Model
**Arquivo:** `frontend/src/app/features/diario-de-classe/models/diario-de-classe.model.ts`

Adicionar `caracterParaIndicarSaidaAntecipada: string` nas três interfaces:
- `DiarioDeClasseCaracterResponse`
- `DiarioDeClasseConfiguracaoResponse`
- `DiarioDeClasseConfiguracaoSaveRequest`

---

### 12. Componente de Configuração
**Arquivo:** `frontend/src/app/features/diario-de-classe/configuracao/configuracao.component.ts`

**12a.** Adicionar ao array `TYPES` (após `nee`):
```ts
{ key: 'saidaAntecipada', label: 'Saída Antecipada', sub: 'Aluno com saída antecipada registrada', accent: '#D97706' },
```

**12b.** Atualizar `type CharKey` para incluir `'saidaAntecipada'`.

**12c.** Adicionar default em `chars`:
```ts
chars: Record<string, string> = { presenca: 'P', falta: 'F', pendencia: '-', transferencia: 'T', nee: 'N', saidaAntecipada: 'S' };
```

**12d.** Em `aplicarConfig`, adicionar:
```ts
this.chars['saidaAntecipada'] = cfg.caracterParaIndicarSaidaAntecipada;
```

**12e.** Em `resetChars`, adicionar:
```ts
saidaAntecipada: 'S'
```

**12f.** Em `salvar`, adicionar ao objeto do request:
```ts
caracterParaIndicarSaidaAntecipada: this.chars['saidaAntecipada'],
```

O HTML do `configuracao.component.html` usa `*ngFor="let t of TYPES"` — não precisa mudar.

---

## Checklist de entrega

### Backend
- [x] SQL: arquivo `.sql` criado em `cards/EFC-6379/sql/`
- [x] Entity: `CaracterParaIndicarSaidaAntecipada` adicionada
- [x] Mapping: coluna mapeada como `IsRequired(false)`
- [x] DTOs (3): `CaracterResponse`, `ConfiguracaoResponse`, `ConfiguracaoSaveRequest`
- [x] Novo DTO: `AlunoSaidaAntecipadaBulkResponse`
- [x] Interface: `GetBulkParaDiarioClasse` adicionada
- [x] Repository: `GetBulkParaDiarioClasse` implementado
- [x] `DiarioDeClasseConfiguracaoRepository`: campo na projeção
- [x] `SaveConfiguracaoDiarioDeClasseService`: campo no insert e update
- [x] `GetDocumentoDiarioDeClasseService`: injeção + MapearCaracteres + CarregarFrequenciaAsync + MontarGradeChamadas
- [x] Build: 0 erros

### Frontend
- [x] Model: 3 interfaces atualizadas
- [x] `configuracao.component.ts`: TYPES + CharKey + chars + aplicarConfig + resetChars + salvar

### Banco
- [ ] Aplicar `ALTER TABLE` em homologação
- [ ] Validar que o campo aparece no documento para alunos com saída antecipada registrada

---

## Arquivos a tocar (resumo)

| Arquivo | Operação |
|---------|----------|
| `cards/EFC-6379/sql/add-caracter-saida-antecipada.sql` | criar |
| `.../Entities/Stateful/DiarioDeClasseConfiguracao.cs` | editar |
| `.../Mapping/Stateful/DiarioDeClasseConfiguracaoMap.cs` | editar |
| `.../DTO/DiarioDeClasse/DiarioDeClasseCaracterResponse.cs` | editar |
| `.../DTO/DiarioDeClasse/DiarioDeClasseConfiguracaoResponse.cs` | editar |
| `.../DTO/DiarioDeClasse/DiarioDeClasseConfiguracaoSaveRequest.cs` | editar |
| `.../DTO/DiarioDeClasse/AlunoSaidaAntecipadaBulkResponse.cs` | criar |
| `.../Interfaces/Stateful/IAlunoSaidaAntecipadaRepository.cs` | editar |
| `.../Repositories/Stateful/AlunoSaidaAntecipadaRepository.cs` | editar |
| `.../Repositories/Stateful/DiarioDeClasseConfiguracaoRepository.cs` | editar |
| `.../Services/DiarioDeClasse/SaveConfiguracaoDiarioDeClasseService.cs` | editar |
| `.../Services/DiarioDeClasse/GetDocumentoDiarioDeClasseService.cs` | editar |
| `frontend/.../models/diario-de-classe.model.ts` | editar |
| `frontend/.../configuracao/configuracao.component.ts` | editar |
