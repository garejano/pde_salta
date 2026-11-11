# Ajuste — `CarregarFrequenciaAsync` retorna vazio para turmas sem "chamada por aula"

contexto: [`./readme.md`](./readme.md)
base: `estrutura-pedagogica/backend/*`

> A migração do Diário de Classe já foi concluída (ver `readme.md`). Este documento trata de um
> **bug encontrado após a migração**, reportado pelo TL do time.

---

## Bug reportado

**Sintoma:** filtro aplicado com Turma + Disciplina + intervalo de datas que **certamente possuem aulas
lançadas** retorna `"O período selecionado não possui aulas registradas"`.

**Mensagens do TL:**

> Com certeza tem aula 😬.
> O que me parece: só está funcionando para tipo de chamada por aula.
> (tem o problema de aparecem 2 notificações também — **bug separado, fora do escopo deste ajuste**)
>
> Motivo: quando não é chamada por aula, `AulaEvento.Disciplina != null` tem `PossuiFrequencia == false`.

---

## Causa raiz

`AulaEvento` pode representar uma aula de duas formas, dependendo da configuração de chamada da turma/segmento:

1. **Chamada por aula** — um `AulaEvento` por Turma + Disciplina + Turno + Tempo. Esse mesmo evento tem
   `DisciplinaId` preenchido **e** `PossuiFrequencia = true`. É o caso coberto hoje.

2. **Chamada por dia/turno** (não por aula) — a frequência é lançada uma vez para o turno inteiro, não por
   disciplina. Nesse modo:
   - existe um `AulaEvento` com `DisciplinaId == null` representando o turno/dia, com `PossuiFrequencia = true`
     — é este que carrega a frequência dos alunos, **independente da disciplina**;
   - os `AulaEvento` com `DisciplinaId` preenchido nesse mesmo turno existem para outros fins (conteúdo
     ministrado, tempo de aula), mas têm `PossuiFrequencia = false`.

A query atual (`AulaEventoRepository.GetParaDiarioClasse`) exige as duas condições ao mesmo tempo:

```csharp
// AulaEventoRepository.cs:184-205
.Where(x => x.TurmaId      == turmaId
         && x.DisciplinaId == disciplinaId   // <- exclui o evento genérico (Disciplina == null)
         && x.DataInicio   >= dataInicio.Date
         && x.DataInicio   <= dataFim.Date
         && x.PossuiFrequencia)              // <- exclui o evento da disciplina (PossuiFrequencia == false)
```

Para turmas em modo "chamada por dia", nenhum `AulaEvento` satisfaz as duas condições simultaneamente →
lista vazia → `GetDocumentoDiarioDeClasseService.Get` interpreta como "sem aulas no período".

---

## O que é esperado (definição do TL)

Duas queries, em vez de uma:

1. **Buscar as datas com aula da disciplina no intervalo**, independente de `PossuiFrequencia` — identifica
   em quais dias a disciplina de fato teve aula.
2. **Com essas datas, buscar os `AulaEvento` com `PossuiFrequencia == true`** cujo `DisciplinaId` seja o da
   disciplina **ou** seja nulo (evento genérico do turno/dia) — restrito às datas da query 1.

> "Significa: sempre é um evento com lançamento de frequência, e ou ele é um evento da disciplina, ou é um
> evento sem disciplina específica (vale para todas do dia)."

### Assinaturas propostas

```csharp
// Query 1 — sem PossuiFrequencia, retorna datas distintas
Task<List<DateTime>> GetDatasParaDiarioClasse(int turmaId, int disciplinaId, DateTime dataInicio, DateTime dataFim);
// Where: TurmaId == turmaId && DisciplinaId == disciplinaId && DataInicio in [dataInicio, dataFim]
// Select: DataInicio.Date, Distinct

// Query 2 — troca o filtro de disciplina, adiciona PossuiFrequencia e datas.Contains
Task<List<AulaEventoParaDiarioClasseResponse>> GetParaDiarioClasse(int turmaId, List<DateTime> datas, int disciplinaId, ...);
// Where: TurmaId == turmaId
//     && (DisciplinaId == disciplinaId || DisciplinaId == null)
//     && PossuiFrequencia
//     && datas.Contains(DataInicio.Date)
```

O TL cogitou adicionar uma coluna calculada `DataAula` (= `DataInicio.Date`) em `AulaEvento` para evitar os
casts `.Date` espalhados pelos `Where`s, mas decidiu **adiar** — fica para quando o cadastro de horário for
migrado para o `estrutura-pedagogica`. Não fazer isso agora.

---

## Onde mexer

| Arquivo | O que muda |
|---|---|
| `EstruturaPedagogica.Domain/Interfaces/Stateful/IAulaEventoRepository.cs:29` | Adicionar assinatura de `GetDatasParaDiarioClasse`; ajustar assinatura de `GetParaDiarioClasse` |
| `EstruturaPedagogica.Infra/Repositories/Stateful/AulaEventoRepository.cs:184-205` | Implementar as duas queries |
| `EstruturaPedagogica.Domain.Services/DiarioDeClasse/GetDocumentoDiarioDeClasseService.cs` → `CarregarFrequenciaAsync` (linhas 139-161) | Chamar as duas queries em sequência (mesmo `DbContext`, sem paralelismo — já é o padrão do método) |

`GetDocumentoDiarioDeClasseService.MontarGradeChamadas` (linhas 163-211) **não precisa mudar** — já casa
frequência por `DataAula.Date + TurnoId + Tempo`, não por disciplina, então funciona igual para eventos
genéricos (`DisciplinaId == null`) ou específicos.

`AulaEventoParaDiarioClasseResponse` (DTO) não precisa de campos novos — os dados retornados continuam os
mesmos (`Id`, `Hash`, `DataAula`, `EscolaId`, `TurnoId`, `Tempo`, `TeveLancamento`).

---

## Hipótese confirmada no banco (ElevaPortalHomolog)

Validado via `mcp__sqlserver__execute_query` (query construída a partir do db_map — `domains/academico.md` +
`schema/joins.yaml`; MCP usado só para executar).

**1. O padrão existe de fato.** Turmas em modo "chamada por dia" têm, na mesma Turma/Turno/Data, um
`AulaEvento` genérico (`Disciplina IS NULL`, `PossuiFrequencia = 1`, `TurmaTempo IS NULL`) coexistindo com
`AulaEvento`s de cada disciplina do dia (`Disciplina` preenchida, `PossuiFrequencia = 0`). Exemplo real:
Rede **ECSA**, Escola **Cuiabá**, turmas "7º ano A - M" e "8º ano A - M" (dezembro/2026), disciplinas como
Matemática 1, Física, LIV 1, Língua Portuguesa 1, História 1 etc. — todas com `PossuiFrequencia = 0` no
evento da disciplina, e um evento irmão com `Disciplina = NULL` e `PossuiFrequencia = 1` no mesmo dia.

**2. Caso de reprodução concreto** — Turma "7º ano A - M" (Cuiabá / ECSA) + Disciplina "Matemática 1",
`dataInicio = 2026-02-01`, `dataTermino = 2026-06-15`:

| Query | Resultado |
|---|---|
| Atual (`DisciplinaId == disciplina AND PossuiFrequencia`) | **0 linhas** ← reproduz o bug relatado |
| Proposta (datas com aula da disciplina + `PossuiFrequencia AND (Disciplina == disciplina OR Disciplina IS NULL)`) | **54 linhas** ← resolve |

```json
{
  "hashTurma":      "A36C3415-01FA-4530-8038-851326CBE08D",
  "hashEscola":     "EAA9CCE6-ECF9-452B-A0F5-F6DA1D9C5F92",
  "hashDisciplina": "C30E3694-221A-4A9B-84BF-18E426C0181F",
  "dataInicio":     "2026-02-01",
  "dataTermino":    "2026-06-15",
  "exibirFrequencia": true
}
```

> Rede ECSA / Escola Cuiabá (Hash rede: `F0B705EE-98A3-4F0A-8FFB-6FE4226902D7`). A disciplina "Matemática 1"
> tem aula em 157 dias distintos no ano letivo de 2026 — bom candidato para teste manual do endpoint
> `POST api/diariodeclasse/get-documento` antes e depois do ajuste.

---

## Passos sugeridos

1. ~~Confirmar a hipótese no banco~~ — **feito** (ver seção acima).
2. Implementar `GetDatasParaDiarioClasse` no `AulaEventoRepository` + interface.
3. Ajustar `GetParaDiarioClasse` para receber a lista de datas e o novo filtro `(DisciplinaId == disciplinaId || DisciplinaId == null)`.
4. Ajustar `CarregarFrequenciaAsync` no service para orquestrar as duas chamadas.
5. Validar manualmente com o cenário de reprodução acima (Cuiabá/ECSA — "chamada por dia") e com um cenário
   de "chamada por aula" já funcional (ver [`filtros-diario-com-frequencia.md`](./filtros-diario-com-frequencia.md)
   e [`query-dados-validos.md`](./query-dados-validos.md)), para garantir que não há regressão.
6. O bug das "2 notificações" mencionado pelo TL é **separado** — não tratar aqui; documentar/abrir card à parte se ainda não existir.
