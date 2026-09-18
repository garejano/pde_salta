# EFC-6314 — Como a Lista de Turmas é Montada

> Repositório: `estrutura-pedagogica` (cópia do fluxo original de `frequencia`)

---

## Fluxo completo — do filtro ao banco

### 1. Frontend: filtro em cascata

**Arquivo de configuração do filtro:**
`frontend/src/app/features/lancamento-frequencia/lista-presenca/filtro-lista-presenca.ts`

| Campo | Tipo | Obrigatório | Depende de |
|-------|------|-------------|------------|
| Rede | Select | Sim | — |
| Escola | Select | Sim | Rede |
| Série | MultiSelect | Não | Escola |
| Turma | MultiSelect | Não | Escola + Série |

Service de filtro em cascata:
`frontend/src/app/features/lancamento-frequencia/services/filtro-frequencia.service.ts`
- `redes()` → `POST /api/lancamentofrequencia/filter-redes`
- `escolas()` → `POST /api/lancamentofrequencia/filter-escolas`
- `series()` → `POST /api/lancamentofrequencia/filter-series`
- `turmas()` → `POST /api/lancamentofrequencia/filter-turmas`

---

### 2. Frontend: busca das turmas da listagem

Componente:
`frontend/src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts`

Service:
`frontend/src/app/features/lancamento-frequencia/services/lancamento-frequencia.service.ts`

```typescript
getTurmasListaPresenca(request: ListaPresencaFilterRequest)
  → POST /api/lancamentofrequencia/lista-presenca/get-turmas
```

Request enviado:
```typescript
interface ListaPresencaFilterRequest {
  hashRede: string;
  hashEscola: string;
  hashSeries?: string[];  // opcional, multi-select
  hashTurmas?: string[];  // opcional, multi-select
}
```

O componente agrupa as turmas retornadas por escola (`buildGrupos()`) para exibição na tela.

---

### 3. Backend: Controller

`backend/EstruturaPedagogica.Api/Controllers/ListaPresencaController.cs`

```
[HttpPost("get-turmas")] → GetTurmasListaPresencaService.Get(request)
```

---

### 4. Backend: Service

`backend/EstruturaPedagogica.Domain.Services/LancamentoFrequencia/GetTurmasListaPresencaService.cs`

Fluxo:
1. Chama `ValidarRequestListaPresenca(request)` — valida Rede e Escola obrigatórios, preenche `EscolasDoUsuario` e `PossuiVisaoCoordenacao`
2. Chama `_filterRepository.GetTurmasParaListaPresenca(request)`
3. Projeta para `ListaPresencaTurmaResponse` com flags de turno

```csharp
EhManha   = t.TurnoId == (int)TurnoEnum.Manha   // 1
EhTarde   = t.TurnoId == (int)TurnoEnum.Tarde    // 2
EhNoite   = t.TurnoId == (int)TurnoEnum.Noite    // 3
EhIntegral = t.TurnoId == (int)TurnoEnum.Integral // 4
// TurnoEnum.NA = 5 (não é mapeado em nenhuma flag)
```

---

### 5. Backend: Repositório — query exata

`backend/EstruturaPedagogica.Infra/Repositories/Filters/FilterLancamentoFrequenciaRepository.cs`
método: `GetTurmasParaListaPresenca()` (linha 202)

```csharp
var anoLetivo = DateTime.Now.Year;

var query = QueryableAtivos()          // WHERE Turma.Ativo = true
   .Where(x => request.EscolasDoUsuario.Contains(x.EscolaSerie.EscolaId)
            && x.EscolaSerie.AnoLetivoId == anoLetivo
            && x.EscolaSerie.Escola.Hash == request.HashEscola);

// Filtros opcionais
if (request.HashSeries?.Count > 0)
   query = query.Where(x => request.HashSeries.Contains(x.EscolaSerie.Serie.Hash));

if (request.HashTurmas?.Count > 0)
   query = query.Where(x => request.HashTurmas.Contains(x.Hash));

// Controle de acesso por perfil
if (!request.PossuiVisaoCoordenacao)
   query = FiltrarPorAlocacao(query);  // só turmas onde o professor está alocado

// Só turmas com ao menos 1 aluno ativo
query = query.Where(x => x.Alunos.Any(a => a.DataCancelamento == null));
```

`FiltrarPorAlocacao()` filtra por:
```csharp
x.Professores.Any(p => p.Ativo
   && p.PessoaEscolaAcesso.PessoaEscola.Pessoa.Usuario.Id == _usuarioAutenticadoRepository.IdUsuarioAutenticado)
```

**Ordenação:** `Serie.Ordem ASC`, depois `Turma.Nome ASC`

---

### 6. Response retornado

```csharp
public class ListaPresencaTurmaResponse
{
   public Guid HashTurma { get; set; }
   public string NomeTurma { get; set; }
   public Guid HashSerie { get; set; }
   public string NomeSerie { get; set; }
   public string NomeTurno { get; set; }
   public int TotalAlunos { get; set; }
   public Guid HashEscola { get; set; }
   public string NomeEscola { get; set; }
   public bool EhManha { get; set; }
   public bool EhTarde { get; set; }
   public bool EhNoite { get; set; }
   public bool EhIntegral { get; set; }
}
```

---

## Análise: quais tipos de turma são retornados

### O que é filtrado

| Critério | Aplicado em `GetTurmasParaListaPresenca`? |
|----------|------------------------------------------|
| `Turma.Ativo = true` | ✅ Sim (via `QueryableAtivos()`) |
| Escola do usuário | ✅ Sim (via `EscolasDoUsuario`) |
| Ano letivo corrente | ✅ Sim (`DateTime.Now.Year`) |
| Escola selecionada no filtro | ✅ Sim |
| Série(s) selecionada(s) | ✅ Sim (se informadas) |
| Turma(s) selecionada(s) | ✅ Sim (se informadas) |
| Turmas com aluno ativo | ✅ Sim (`DataCancelamento == null`) |
| Alocação do professor | ✅ Sim (quando sem visão coordenação) |
| `Segmento.PossuiAula = true` | ❌ **Não aplicado** |
| `Serie.PossuiAula = true` | ❌ **Não aplicado** |
| Tipo de turma (regular vs serviço) | ❌ **Não existe campo na entidade** |

### Gap em relação ao filtro de Lançamento de Frequência

O filtro de lançamento de frequência (`GetQueryable()`) aplica:
```csharp
&& x.EscolaSerie.Serie.Segmento.PossuiAula
```

**A lista de presença NÃO aplica esse filtro**, o que significa que retorna turmas de segmentos sem aula (ex.: turmas de serviço ou administrativas), desde que tenham alunos ativos. Essa é a diferença entre o comportamento original (frequencia) e o implementado aqui.

### Entidade Turma — sem campo TipoTurma

A entidade `Turma.cs` não possui campo de tipo/categoria. O tipo de turma é inferido pelo segmento da série:
- `Segmento.PossuiAula = true` → turma regular (possui chamada)
- `Segmento.PossuiAula = false` → segmento sem aula (ex.: serviço, administrativo)

Da mesma forma, `Serie.PossuiAula` existe na entidade mas também não é aplicado.

---

## Ajuste sugerido

Para alinhar a lista de presença com o comportamento do lançamento de frequência, adicionar o filtro:

```csharp
// em GetTurmasParaListaPresenca(), após a linha 209
&& x.EscolaSerie.Serie.Segmento.PossuiAula
```

Arquivos a modificar:
- `backend/EstruturaPedagogica.Infra/Repositories/Filters/FilterLancamentoFrequenciaRepository.cs` (linha ~209)

Verificar também se `Serie.PossuiAula` deve ser aplicado em conjunto.

---

## Outros endpoints do módulo

| Endpoint | Uso |
|----------|-----|
| `POST /api/lancamentofrequencia/lista-presenca/get-turmas` | Lista turmas para seleção |
| `POST /api/lancamentofrequencia/lista-presenca/get-alunos` | Alunos das turmas selecionadas (lista de presença) |
| `POST /api/lancamentofrequencia/lista-presenca/carometro/get-alunos` | Alunos com dados para carotômetro |
