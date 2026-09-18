# Massa de Testes — EFC-6244 / EFC-6401

> Banco: `ElevaPortalHomolog` · Ano letivo: `2026`  
> Dados coletados em: 2026-05-25  
> As datas de `AulaEvento` mudam — re-executar as queries para encontrar instâncias atualizadas.

---

## Cenário 1 — `ehPorAula = true`, 1 único tempo (valida fix do EFC-6401)

**O que valida:** turma PorAula com exatamente 1 AulaEvento com Tempo preenchido na data. Sem dropdown — deve mostrar texto estático "Nº tempo · HH:MM–HH:MM".

### Instância confirmada

| Campo | Valor |
|---|---|
| Rede | Nosso CEI |
| Escola | Roberto Freire |
| Turma | Dependência de 1ª série do EM - T |
| Data | 2026-05-26 |
| HashTurma | `97956A8A-5CAC-4C40-B2E3-088DF1AF13CC` |
| HashAulaEvento | `1E565B53-9DBE-4704-B8B3-1DC77D6CBFE2` |
| Tempo exibido | 2º tempo · 17:50–19:20 · Física 1 |

### Resultado esperado na tela

Label "Tempo de aula" visível + texto estático "2º tempo · 17:50–19:20" (sem dropdown).

### Query para encontrar instâncias

```sql
SELECT TOP 10
    e.Nome                        AS Escola,
    r.Nome                        AS Rede,
    s.Nome                        AS Serie,
    t.Nome                        AS Turma,
    t.Hash                        AS HashTurma,
    ae.Hash                       AS HashAulaEvento,
    ae.Tempo                      AS NumeroTempo,
    CONVERT(time(0), ae.DataInicio)  AS HorarioInicio,
    CONVERT(time(0), ae.DataTermino) AS HorarioTermino,
    d.Nome                        AS Disciplina,
    CONVERT(date, ae.DataInicio)  AS DataAula
FROM Turma t
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Rede r          ON r.Id  = e.Rede
JOIN Serie s         ON s.Id  = es.Serie
JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1 AND ae.Tempo IS NOT NULL
LEFT JOIN Disciplina d ON d.Id = ae.Disciplina
WHERE es.AnoLetivo = 2026
  AND cpl.TipoChamada = 3
  AND CONVERT(date, ae.DataInicio) BETWEEN DATEADD(day, -7, GETDATE()) AND DATEADD(day, 1, GETDATE())
  AND t.Hash IN (
      SELECT t2.Hash
      FROM Turma t2
      JOIN AulaEvento ae2 ON ae2.Turma = t2.Id AND ae2.Ativo = 1 AND ae2.Tempo IS NOT NULL
      WHERE CONVERT(date, ae2.DataInicio) = CONVERT(date, ae.DataInicio)
      GROUP BY t2.Hash, CONVERT(date, ae2.DataInicio)
      HAVING COUNT(*) = 1
  )
ORDER BY DataAula DESC;
```

---

## Cenário 2 — `ehPorAula = true`, múltiplos tempos (dropdown normal)

**O que valida:** seletor de tempos aparece e funciona normalmente quando há mais de 1 tempo na data.

### Instância confirmada

| Campo | Valor |
|---|---|
| Rede | Embraer |
| Escola | SJC |
| Turma | 2ª série B - I |
| Data | 2026-05-26 |
| HashTurma | `D54A67F4-04A2-4F21-867D-C6840E0642B6` |
| HashAulaEvento (1º tempo) | `06069ABC-32F0-4126-A084-FE37018B0266` |
| Tempos disponíveis | 21 tempos — do 1º (07:25) ao 9º |

### Resultado esperado na tela

Dropdown "Selecionar tempo" com 21 opções; ao selecionar, carrega a chamada do tempo escolhido.

### Query para encontrar instâncias

```sql
SELECT TOP 10
    e.Nome                        AS Escola,
    r.Nome                        AS Rede,
    s.Nome                        AS Serie,
    t.Nome                        AS Turma,
    t.Hash                        AS HashTurma,
    CONVERT(date, ae.DataInicio)  AS DataAula,
    COUNT(*)                      AS QtdTempos,
    MIN(ae.Tempo)                 AS PrimeiroTempo,
    MAX(ae.Tempo)                 AS UltimoTempo
FROM Turma t
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Rede r          ON r.Id  = e.Rede
JOIN Serie s         ON s.Id  = es.Serie
JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1 AND ae.Tempo IS NOT NULL
WHERE es.AnoLetivo = 2026
  AND cpl.TipoChamada = 3
  AND CONVERT(date, ae.DataInicio) BETWEEN DATEADD(day, -7, GETDATE()) AND DATEADD(day, 1, GETDATE())
GROUP BY e.Nome, r.Nome, s.Nome, t.Nome, t.Hash, CONVERT(date, ae.DataInicio)
HAVING COUNT(*) > 1
ORDER BY DataAula DESC, QtdTempos DESC;
```

---

## Cenário 3 — `ehPorAula = false`, chamada PorDia

**O que valida:** tela sem seção de tempo (sem label, sem dropdown, sem estado vazio de tempo).

### Instância confirmada

| Campo | Valor |
|---|---|
| Rede | Nosso CEI |
| Escola | Romualdo Galvão |
| Turma | Infantil 3 B - M |
| Data | 2026-05-26 |
| HashTurma | `5CFEC942-6DB1-4811-84DB-62B764128D53` |
| HashAulaEvento | `8AB12E64-659B-4A9E-BF54-F04F2BF33161` |

### Resultado esperado na tela

Sem label "Tempo de aula", sem seletor, sem estado vazio de tempo. Alunos carregam direto.

### Query para encontrar instâncias

```sql
SELECT TOP 10
    e.Nome                        AS Escola,
    r.Nome                        AS Rede,
    s.Nome                        AS Serie,
    t.Nome                        AS Turma,
    t.Hash                        AS HashTurma,
    ae.Hash                       AS HashAulaEvento,
    CONVERT(date, ae.DataInicio)  AS DataAula
FROM Turma t
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Rede r          ON r.Id  = e.Rede
JOIN Serie s         ON s.Id  = es.Serie
JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1 AND ae.Tempo IS NULL
WHERE es.AnoLetivo = 2026
  AND cpl.TipoChamada = 1
  AND CONVERT(date, ae.DataInicio) BETWEEN DATEADD(day, -7, GETDATE()) AND DATEADD(day, 1, GETDATE())
ORDER BY DataAula DESC;
```

---

## Cenário 4 — `ehPorAula = false`, chamada PorTurno

**O que valida:** igual ao Cenário 3 — sem seção de tempo.

### Instância confirmada

| Campo | Valor |
|---|---|
| Rede | Colégio do Salvador |
| Escola | Aracaju |
| Turma | 2ª série B - M |
| Data | 2026-05-26 |
| HashTurma | `9B788FBE-2D5E-4C19-B192-B82FC488F29B` |
| HashAulaEvento | `24101693-CA0D-4FDE-A3CE-C432ED740EB4` |

### Resultado esperado na tela

Igual ao Cenário 3 — sem seção de tempo.

### Query para encontrar instâncias

```sql
SELECT TOP 10
    e.Nome                        AS Escola,
    r.Nome                        AS Rede,
    s.Nome                        AS Serie,
    t.Nome                        AS Turma,
    t.Hash                        AS HashTurma,
    ae.Hash                       AS HashAulaEvento,
    CONVERT(date, ae.DataInicio)  AS DataAula
FROM Turma t
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Rede r          ON r.Id  = e.Rede
JOIN Serie s         ON s.Id  = es.Serie
JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1 AND ae.Tempo IS NULL
WHERE es.AnoLetivo = 2026
  AND cpl.TipoChamada = 2
  AND CONVERT(date, ae.DataInicio) BETWEEN DATEADD(day, -7, GETDATE()) AND DATEADD(day, 1, GETDATE())
ORDER BY DataAula DESC;
```

---

## Cenário 5 — Aluno pendente (sem nenhum lançamento)

**O que valida:** botão "Marcar pendentes como presentes" deve aparecer; aluno sem botão selecionado.

### Instância confirmada

| Campo | Valor |
|---|---|
| Rede | Sigma |
| Escola | 910 Norte |
| Turma | 1ª série A - M |
| Data | hoje (consultar pelo query — dado sensível ao dia) |
| HashTurma | `F05140EB-5D1F-481D-8581-B96FE080C4E6` |
| HashAulaEvento | `323905AB-8BA8-45BA-9E6F-12C1258076A7` |

> Este cenário depende da data — a chamada precisa ser do dia corrente e os alunos ainda não podem ter lançamento. Re-executar a query para verificar se o evento está válido hoje.

### Resultado esperado na tela

Alunos sem botão selecionado; contador "N pendentes" visível; botão "Marcar pendentes como presentes" habilitado.

### Query para encontrar instâncias

```sql
SELECT TOP 10
    e.Nome       AS Escola,
    r.Nome       AS Rede,
    t.Nome       AS Turma,
    t.Hash       AS HashTurma,
    ae.Hash      AS HashAulaEvento,
    CONVERT(date, ae.DataInicio) AS DataAula,
    p.Nome       AS NomeAluno,
    pea.Hash     AS HashPessoa
FROM AulaEvento ae
JOIN Turma t         ON t.Id  = ae.Turma AND ae.Ativo = 1
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Rede r          ON r.Id  = e.Rede
JOIN AlunoEscola ae2 ON ae2.Turma = t.Id AND ae2.AnoLetivo = 2026 AND ae2.Status = 'Matriculado'
JOIN PessoaEscolaAcesso pea ON pea.Id = ae2.AlunoEscola_key
JOIN PessoaEscola pe   ON pe.Id = pea.PessoaEscola
JOIN Pessoa p          ON p.Id = pe.Pessoa
WHERE es.AnoLetivo = 2026
  AND CONVERT(date, ae.DataInicio) = CONVERT(date, GETDATE())
  AND NOT EXISTS (
      SELECT 1 FROM AlunoFalta af
      WHERE af.Pessoa = p.Id
        AND CONVERT(date, af.DataAula) = CONVERT(date, ae.DataInicio)
        AND af.Ativo = 1
  )
ORDER BY e.Nome, t.Nome;
```

---

## Cenário 6 — Aluno com falta sem justificativa

**O que valida:** card com falta marcada (vermelho), botão "Justificar" visível, botão de remover falta habilitado.

### Dados em homolog

> **Sem dados disponíveis** — `AlunoFalta` não possui registros de 2026 no homolog.  
> **Reprodução manual:** abrir a chamada de qualquer turma, marcar um aluno como "Ausente" e sair sem justificar.

### Resultado esperado na tela

Card com borda vermelha, badge "Ausência não justificada", botão "Justificar" visível.

### Query de referência (usar quando houver dados)

```sql
SELECT TOP 10
    e.Nome       AS Escola,
    r.Nome       AS Rede,
    t.Nome       AS Turma,
    t.Hash       AS HashTurma,
    ae.Hash      AS HashAulaEvento,
    CONVERT(date, af.DataAula) AS DataAula,
    p.Nome       AS NomeAluno,
    pea.Hash     AS HashPessoa,
    tp.Nome      AS TipoFrequencia
FROM AlunoFalta af
JOIN Pessoa p        ON p.Id = af.Pessoa
JOIN PessoaEscola pe ON pe.Pessoa = p.Id
JOIN PessoaEscolaAcesso pea ON pea.PessoaEscola = pe.Id
JOIN AlunoEscola ae2 ON ae2.AlunoEscola_key = pea.Id AND ae2.AnoLetivo = 2026 AND ae2.Status = 'Matriculado'
JOIN Turma t         ON t.Id = ae2.Turma
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Rede r          ON r.Id  = e.Rede
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1
                     AND CONVERT(date, ae.DataInicio) = CONVERT(date, af.DataAula)
JOIN TipoPresenca tp ON tp.Id = af.TipoPresenca
WHERE es.AnoLetivo = 2026
  AND tp.Falta = 1
  AND af.Ativo = 1
  AND CONVERT(date, af.DataAula) BETWEEN DATEADD(day, -7, GETDATE()) AND GETDATE()
  AND NOT EXISTS (
      SELECT 1 FROM AlunoJustificativaFalta ajf
      WHERE ajf.Pessoa = p.Id
        AND CONVERT(date, af.DataAula) BETWEEN CONVERT(date, ajf.DataInicial) AND CONVERT(date, ajf.DataFinal)
        AND ajf.Ativo = 1
  )
ORDER BY DataAula DESC;
```

---

## Cenário 7 — Aluno com falta + justificativa ativa

**O que valida:** falta bloqueada — botões de alterar/remover desabilitados; botão "Ver justificativa" visível.

### Dados em homolog

> **Sem dados disponíveis** — `AlunoFalta` não possui registros de 2026 no homolog.  
> **Reprodução manual:** após marcar ausência (Cenário 6), abrir o form de justificativa e salvar.

### Resultado esperado na tela

Falta marcada visualmente bloqueada — botões de alterar/remover desabilitados ou ocultos; badge "Ausência justificada"; botão "Ver justificativa" visível.

### Query de referência (usar quando houver dados)

```sql
SELECT TOP 10
    e.Nome       AS Escola,
    r.Nome       AS Rede,
    t.Nome       AS Turma,
    t.Hash       AS HashTurma,
    ae.Hash      AS HashAulaEvento,
    CONVERT(date, af.DataAula) AS DataAula,
    p.Nome       AS NomeAluno,
    pea.Hash     AS HashPessoa,
    ajf.DataInicial AS JustificativaInicio,
    ajf.DataFinal   AS JustificativaFim
FROM AlunoFalta af
JOIN Pessoa p        ON p.Id = af.Pessoa
JOIN PessoaEscola pe ON pe.Pessoa = p.Id
JOIN PessoaEscolaAcesso pea ON pea.PessoaEscola = pe.Id
JOIN AlunoEscola ae2 ON ae2.AlunoEscola_key = pea.Id AND ae2.AnoLetivo = 2026 AND ae2.Status = 'Matriculado'
JOIN Turma t         ON t.Id = ae2.Turma
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Rede r          ON r.Id  = e.Rede
JOIN AulaEvento ae   ON ae.Turma = t.Id AND ae.Ativo = 1
                     AND CONVERT(date, ae.DataInicio) = CONVERT(date, af.DataAula)
JOIN TipoPresenca tp ON tp.Id = af.TipoPresenca AND tp.Falta = 1
JOIN AlunoJustificativaFalta ajf
                     ON ajf.Pessoa = p.Id AND ajf.Ativo = 1
                     AND CONVERT(date, af.DataAula) BETWEEN CONVERT(date, ajf.DataInicial)
                                                        AND CONVERT(date, ajf.DataFinal)
WHERE es.AnoLetivo = 2026
  AND af.Ativo = 1
  AND CONVERT(date, af.DataAula) BETWEEN DATEADD(day, -30, GETDATE()) AND GETDATE()
ORDER BY DataAula DESC;
```

---

## Cenário 8 — Aluno com lançamento herdado (não confirmado)

**O que valida:** badge "Lançamento herdado" e botão "Confirmar lançamentos" no rodapé.

### Reprodução manual

1. Abrir uma chamada PorAula de turma com múltiplos tempos (Cenário 2).
2. No 1º tempo, marcar presença para qualquer aluno.
3. Navegar para o 2º tempo do mesmo dia.
4. O aluno marcado no T1 deve aparecer com tag "Lançamento herdado" no T2.

### Resultado esperado na tela

Tag "Lançamento herdado" ao lado do RA; botão "Confirmar lançamentos" visível no rodapé.

---

## Cenário 9 — Turma sem alunos (estado vazio)

**O que valida:** grid de alunos vazia — sem botão "Marcar pendentes" (não há pendentes sem alunos).

### Instância confirmada

| Campo | Valor |
|---|---|
| Rede | Motivo |
| Escola | Petrolina |
| Turma | 2º ano bilíngue B - M |
| Data | 2026-05-26 |
| HashTurma | `6CF7F465-944D-47D5-A195-CE2A01B597CA` |
| HashAulaEvento | `6272480C-E88D-4FD4-8D4E-AC05998F3EEF` |

### Resultado esperado na tela

Grid de alunos vazia; botão "Marcar pendentes como presentes" desabilitado (sem pendentes).

### Query para encontrar instâncias

```sql
SELECT TOP 5
    e.Nome   AS Escola,
    r.Nome   AS Rede,
    t.Nome   AS Turma,
    t.Hash   AS HashTurma,
    ae.Hash  AS HashAulaEvento,
    CONVERT(date, ae.DataInicio) AS DataAula,
    COUNT(ae2.AlunoEscola_key) AS QtdAlunos
FROM AulaEvento ae
JOIN Turma t         ON t.Id  = ae.Turma AND ae.Ativo = 1
JOIN EscolaSerie es  ON es.Id = t.EscolaSerie
JOIN Escola e        ON e.Id  = es.Escola
JOIN Rede r          ON r.Id  = e.Rede
LEFT JOIN AlunoEscola ae2 ON ae2.Turma = t.Id AND ae2.AnoLetivo = 2026 AND ae2.Status = 'Matriculado'
WHERE es.AnoLetivo = 2026
  AND CONVERT(date, ae.DataInicio) BETWEEN DATEADD(day, -7, GETDATE()) AND DATEADD(day, 1, GETDATE())
GROUP BY e.Nome, r.Nome, t.Nome, t.Hash, ae.Hash, CONVERT(date, ae.DataInicio)
HAVING COUNT(ae2.AlunoEscola_key) = 0
ORDER BY DataAula DESC;
```

---

## Query utilitária — ver TipoChamada de todas as séries de uma escola

```sql
SELECT
    s.Nome                      AS Serie,
    tc.Id                       AS TipoChamadaId,
    tc.Nome                     AS TipoChamada,
    COUNT(DISTINCT t.Id)        AS QtdTurmas
FROM EscolaSerie es
JOIN Escola e   ON e.Id  = es.Escola
JOIN Serie s    ON s.Id  = es.Serie
LEFT JOIN ConfiguracaoPeriodoLetivo cpl ON cpl.EscolaSerie = es.Id
LEFT JOIN TipoChamada tc ON tc.Id = cpl.TipoChamada
LEFT JOIN Turma t ON t.EscolaSerie = es.Id
WHERE es.AnoLetivo = 2026
  AND e.Id = <ID_ESCOLA>   -- substituir
GROUP BY s.Nome, tc.Id, tc.Nome
ORDER BY s.Nome;
```
