# EFC-6451 — Tracker de Implementação

> Repositório: `estrutura-pedagogica` | Branch: `feature/EFC-6451`

---

## Status por Critério de Aceite

| CA | Descrição | Status |
|----|-----------|--------|
| CA-01 | Tooltip nos pills de status da listagem de turmas | ✅ Feito |
| CA-02 | Sinalização de saída antecipada nos tempos subsequentes | ✅ Feito |
| CA-03 | Campo de presença permanece em branco nos tempos subsequentes | ✅ Feito |
| CA-04 | Sinalização apenas informativa (não bloqueia marcação) | ✅ Feito |

---

## O Que Foi Feito (commit `70b3abd8f`)

**Backend:**
- Nova coluna `DescricaoTooltip` em `StatusLancamentoFrequencia` (entity, map, repository)
- `StatusLancamentoFrequenciaResponse`: expõe `DescricaoTooltip`
- `LancamentoFrequenciaEventoResponse` e `LancamentoFrequenciaEventoTempoResponse`: novo campo `StatusTooltip`
- `GetEventosService`: popula `StatusTooltip` nos formatadores PorAula e PorDia/Turno

**Frontend:**
- `models.ts`: `statusTooltip` em ambos os response interfaces
- `listar.component.html`: `[tooltip]="evento.statusTooltip"` nos badges de tabela e cards

**Arquivos tocados:**
```
backend/.../LancamentoFrequencia/GetEventosService.cs
backend/.../DTO/LancamentoFrequencia/LancamentoFrequenciaEventoResponse.cs
backend/.../DTO/LancamentoFrequencia/LancamentoFrequenciaEventoTempoResponse.cs
backend/.../DTO/LancamentoFrequencia/StatusLancamentoFrequenciaResponse.cs
backend/.../Entities/Base/StatusLancamentoFrequencia.cs
backend/.../Mapping/Base/StatusLancamentoFrequenciaMap.cs
backend/.../Repositories/Base/StatusLancamentoFrequenciaRepository.cs
frontend/.../lancamento-frequencia/models.ts
frontend/.../lancamento-frequencia/listar/listar.component.html
```

---

## O Que Falta (CA-02 / CA-03 / CA-04)

### Contexto do problema

O `GetChamadaService` atualmente chama:
```csharp
_alunoSaidaAntecipadaRepository.GetResponseParaChamada(evento.Id, pessoaIds)
```
Isso retorna saídas antecipadas **do tempo atual**. Não há informação sobre tempos anteriores do mesmo dia.

O CA-02 exige: ao abrir a chamada do tempo T, se o aluno teve saída antecipada em qualquer tempo T' < T no mesmo dia/turma, exibir sinalização visual no card. O campo de frequência deve permanecer em branco (CA-03) e a sinalização não bloqueia marcação (CA-04).

---

### Backend — o que fazer

**1. Novo método no `IAlunoSaidaAntecipadaRepository`**

```csharp
Task<HashSet<int>> GetPessoasComSaidaEmTempoAnterior(
    int turmaId, DateTime data, int tempo, List<int> pessoaIds);
```
Retorna o conjunto de `PessoaId` que tiveram saída antecipada em qualquer tempo < `tempo` para a turma/data informada.

Arquivo: `backend/.../Interfaces/Stateful/IAlunoSaidaAntecipadaRepository.cs`

**2. Implementação em `AlunoSaidaAntecipadaRepository`**

Query: join `AlunoSaidaAntecipada` → `AulaEvento` filtrando `AulaEvento.Tempo < tempo` e `AulaEvento.TurmaId = turmaId` e `AulaEvento.DataInicio.Date = data` e `AlunoSaidaAntecipada.Ativo = true`.

Arquivo: `backend/.../Repositories/Stateful/AlunoSaidaAntecipadaRepository.cs`

**3. Novo campo em `ChamadaResponse`**

```csharp
public bool PossuiSaidaAntecipadaEmTempoAnterior { get; set; }
```

Arquivo: `backend/.../DTO/LancamentoFrequencia/ChamadaResponse.cs`

**4. Atualizar `GetChamadaService.Get()`**

- O novo método só faz sentido quando `evento.Tempo != null` (modo PorAula).
- Adicionar `GetSaidasAntecipadasTemposAnteriores` análogo ao `GetSaidasAntecipadas` existente.
- Popular `PossuiSaidaAntecipadaEmTempoAnterior` no `Select`.

Arquivo: `backend/.../LancamentoFrequencia/GetChamadaService.cs`

**5. Testes**

Adicionar cenários em `GetChamadaServiceTests`:
- Aluno com saída antecipada em tempo anterior → `PossuiSaidaAntecipadaEmTempoAnterior = true`
- Aluno com saída no tempo atual mas não em anteriores → `false`
- Modo PorDia (Tempo = null) → campo sempre `false`

---

### Frontend — o que fazer

**1. Atualizar `models.ts`**

```ts
// ChamadaResponse (interface do aluno na chamada)
possuiSaidaAntecipadaEmTempoAnterior: boolean;
```

Arquivo: `frontend/.../lancamento-frequencia/models.ts`

**2. Adicionar badge informativo em `lancamento.component.html`**

Dentro do `.card-top` ou logo abaixo do `.senroll`, adicionar:

```html
<span
  *ngIf="aluno.possuiSaidaAntecipadaEmTempoAnterior && ehPorAula"
  class="tag-saida-anterior"
  [tooltip]="'Aluno registrou saída antecipada em um tempo anterior de hoje'"
>
  <span class="material-icons-outlined">logout</span>
  Saída antecipada (tempo anterior)
</span>
```

- **Não** preencher `hashTipoFrequencia` (CA-03 — campo permanece em branco)
- **Não** desabilitar os botões de frequência (CA-04 — apenas informativo)

Arquivo: `frontend/.../lancamento-frequencia/lancamento/lancamento.component.html`

**3. CSS**

Adicionar `.tag-saida-anterior` no SCSS do componente — estilo similar ao `.tag-herdado` já existente, com cor âmbar/laranja para indicar atenção sem urgência.

---

## Arquivos a Modificar (resumo)

```
backend/.../Interfaces/Stateful/IAlunoSaidaAntecipadaRepository.cs
backend/.../Repositories/Stateful/AlunoSaidaAntecipadaRepository.cs
backend/.../DTO/LancamentoFrequencia/ChamadaResponse.cs
backend/.../LancamentoFrequencia/GetChamadaService.cs
backend/.../Test/.../GetChamadaServiceTests.cs  (novo ou existente)

frontend/.../lancamento-frequencia/models.ts
frontend/.../lancamento-frequencia/lancamento/lancamento.component.html
frontend/.../lancamento-frequencia/lancamento/lancamento.component.scss
```
