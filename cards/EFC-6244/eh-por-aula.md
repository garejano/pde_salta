# `ehPorAula` — análise técnica

> Contexto: tela `lancamento-frequencia`, componente `LancamentoFrequenciaComponent`.  
> Investigado em: 2026-05-25

---

## O getter (frontend)

**Arquivo:** `frontend/src/app/features/lancamento-frequencia/lancamento/lancamento.component.ts:521`

```typescript
get ehPorAula(): boolean {
  return !!(this.evento?.tempos?.length > 0 || this.tempoAtual);
}
```

Retorna `true` quando pelo menos uma das condições é verdadeira:
- `this.evento.tempos` — array recebido da API com os tempos de aula (não vazio)
- `this.tempoAtual` — usuário já selecionou um tempo no dropdown

---

## Origem no backend

### Cadeia de tabelas

```
Turma.EscolaSerie
  → EscolaSerie.Id
    → ConfiguracaoPeriodoLetivo.EscolaSerie   (config por série/escola)
      → ConfiguracaoPeriodoLetivo.TipoChamada
        → TipoChamada.Id
```

### Enum (`TipoChamada.cs`)

```csharp
public const int PorDia   = 1;
public const int PorTurno = 2;
public const int PorAula  = 3;  // único que popula tempos[]
```

### Lógica do service (`GetEventosService.cs:156`)

```
TipoChamadaId == 3 (PorAula)
    → monta Tempos[] com dados de AulaEvento
    → AulaEvento.Tempo (int) = número sequencial do tempo (1º, 2º, ...)
    → AulaEvento.DataInicio / DataTermino = horário
    → AulaEvento.Disciplina.Nome = nome da disciplina

TipoChamadaId == 1 ou 2 (PorDia / PorTurno)
    → Tempos = vazio/null
    → HashAulaEvento preenchido direto no evento
```

A coluna `TipoChamada` é configurada por `EscolaSerie` (série dentro da escola) na tabela `ConfiguracaoPeriodoLetivo` — ou seja, vale para todas as turmas da mesma série/escola.

---

## Efeitos no frontend

| Local no template | Condição | Efeito |
|---|---|---|
| linha 28 | `alunos.length > 0 || ehPorAula` | Exibe container mesmo sem alunos (para mostrar seletor) |
| linha 31 | `*ngIf="ehPorAula"` | Exibe label "Tempo de aula" |
| linha 39 | `*ngIf="ehPorAula"` | Exibe dropdown de seleção de tempo |
| linha 396 | `ehPorAula && !tempoAtual` | Estado vazio "Selecione um tempo para visualizar a chamada" |

**Restrição de horário (CA-03):** o campo `lancamentoDisponivelAPartirDe` — que bloqueia o lançamento fora da janela configurável — **só existe** nos itens de `tempos[]`. Chamadas `PorDia`/`PorTurno` não têm essa restrição.

**Nota:** há debug esquecido no template na linha 27:
```html
TempoAtual: {{tempoAtual | json}} ehPorAula:{{ehPorAula}}
```

---

## Relação com EFC-6401

Quando `evento.tempos.length === 1`, o getter `mostrarSeletorTempo` retorna `false` (exige `> 1`), ocultando o dropdown. Porém `ehPorAula` continua `true`. O `ngOnInit:120` tenta compensar setando `tempoAtual` automaticamente nesse caso:

```typescript
if (!this.tempoAtual && this.temposDisponiveis.length === 1) {
  this.tempoAtual = this.temposDisponiveis[0];
  this.controlTempo.setValue(this.tempoAtual.hash);
}
```

O problema relatado em EFC-6401 é que essa compensação não é suficiente — o campo de tempo não aparece visualmente quando há apenas um tempo de aula.

---

## Queries para testar

### Verificar TipoChamada por turma

```sql
SELECT
    t.Hash                        AS HashTurma,
    t.Nome                        AS NomeTurma,
    e.Nome                        AS NomeEscola,
    s.Nome                        AS NomeSerie,
    tc.Id                         AS TipoChamadaId,
    tc.Descricao                  AS TipoChamada,
    cpl.Id                        AS ConfiguracaoPeriodoLetivoId
FROM Turma t
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Serie s         ON s.Id  = es.Serie
LEFT JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
LEFT JOIN TipoChamada tc                ON tc.Id = cpl.TipoChamada
WHERE es.AnoLetivo = 2026
  AND e.Id = <ID_ESCOLA>
ORDER BY tc.Id, t.Nome;
```

### Massa para `ehPorAula = true` (TipoChamada = 3)

```sql
-- Turmas PorAula com AulaEvento recente
SELECT TOP 20
    e.Nome                       AS Escola,
    s.Nome                       AS Serie,
    t.Nome                       AS Turma,
    t.Hash                       AS HashTurma,
    ae.Hash                      AS HashAulaEvento,
    ae.Tempo                     AS NumeroTempo,
    ae.DataInicio                AS HorarioInicio,
    ae.DataTermino               AS HorarioTermino,
    d.Nome                       AS Disciplina,
    CONVERT(date, ae.DataInicio) AS DataAula
FROM Turma t
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Serie s         ON s.Id  = es.Serie
JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1 AND ae.Tempo IS NOT NULL
LEFT JOIN Disciplina d ON d.Id = ae.Disciplina
WHERE es.AnoLetivo = 2026
  AND cpl.TipoChamada = 3
  AND CONVERT(date, ae.DataInicio) >= CONVERT(date, GETDATE()) - 7
ORDER BY ae.DataInicio DESC;
```

### Massa para `ehPorAula = false` (TipoChamada = 1 ou 2)

```sql
-- Turmas PorDia/PorTurno com AulaEvento recente
SELECT TOP 10
    e.Nome                       AS Escola,
    t.Nome                       AS Turma,
    t.Hash                       AS HashTurma,
    ae.Hash                      AS HashAulaEvento,
    tc.Descricao                 AS TipoChamada,
    CONVERT(date, ae.DataInicio) AS DataAula
FROM Turma t
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
JOIN TipoChamada tc  ON tc.Id = cpl.TipoChamada
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1 AND ae.Tempo IS NULL
WHERE es.AnoLetivo = 2026
  AND cpl.TipoChamada IN (1, 2)
  AND CONVERT(date, ae.DataInicio) >= CONVERT(date, GETDATE()) - 7
ORDER BY ae.DataInicio DESC;
```

### Turmas com apenas 1 tempo (para reproduzir EFC-6401)

```sql
-- Turmas PorAula onde a turma tem exatamente 1 AulaEvento com Tempo preenchido em uma data
SELECT
    e.Nome   AS Escola,
    t.Nome   AS Turma,
    t.Hash   AS HashTurma,
    CONVERT(date, ae.DataInicio) AS DataAula,
    COUNT(*) AS QtdTempos
FROM Turma t
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1 AND ae.Tempo IS NOT NULL
WHERE es.AnoLetivo = 2026
  AND cpl.TipoChamada = 3
  AND CONVERT(date, ae.DataInicio) >= CONVERT(date, GETDATE()) - 7
GROUP BY e.Nome, t.Nome, t.Hash, CONVERT(date, ae.DataInicio)
HAVING COUNT(*) = 1
ORDER BY DataAula DESC;
```
