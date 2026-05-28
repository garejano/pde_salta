-- ============================================================
-- VALIDAÇÃO: Turmas ambíguas — Alunos Impulso ENEM2
-- Executar em HOMOLOG e PRODUÇÃO antes de rodar o INSERT script
-- ============================================================
-- Objetivo: para cada escola com turma ambígua, identificar a
-- turma correta com base na contagem de alunos matriculados.
-- A lógica: turma com TotalAlunos > 0 é a turma ativa/correta.
-- ============================================================

SELECT
    'BLOCO_1__ANCHIETA__2a_Serie_Tecnico' AS Bloco,
    e.Id AS EscolaId,
    t.Id AS TurmaId,
    t.Nome AS TurmaNome,
    COUNT(ae.AlunoEscola_key) AS TotalAlunos,
    SUM(CASE WHEN pea.temp LIKE '909%' THEN 1 ELSE 0 END) AS AlunosImpulso
FROM Turma t
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
INNER JOIN Escola e ON e.Id = es.Escola
LEFT JOIN AlunoEscola ae ON ae.Turma = t.Id AND ae.AnoLetivo = 2026
LEFT JOIN PessoaEscolaAcesso pea ON pea.Id = ae.AlunoEscola_key
WHERE e.Id = 2368
  AND es.AnoLetivo = 2026
  AND t.Nome LIKE '2%rie T%'
GROUP BY e.Id, t.Id, t.Nome

UNION ALL

SELECT
    'BLOCO_2__EDITHE__3a_Serie' AS Bloco,
    e.Id,
    t.Id,
    t.Nome,
    COUNT(ae.AlunoEscola_key),
    SUM(CASE WHEN pea.temp LIKE '909%' THEN 1 ELSE 0 END)
FROM Turma t
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
INNER JOIN Escola e ON e.Id = es.Escola
LEFT JOIN AlunoEscola ae ON ae.Turma = t.Id AND ae.AnoLetivo = 2026
LEFT JOIN PessoaEscolaAcesso pea ON pea.Id = ae.AlunoEscola_key
WHERE e.Id = 2374
  AND es.AnoLetivo = 2026
  AND t.Nome LIKE '3%rie R%'
GROUP BY e.Id, t.Id, t.Nome

UNION ALL

SELECT
    'BLOCO_3__GASPAR_DUTRA__2a_Serie' AS Bloco,
    e.Id,
    t.Id,
    t.Nome,
    COUNT(ae.AlunoEscola_key),
    SUM(CASE WHEN pea.temp LIKE '909%' THEN 1 ELSE 0 END)
FROM Turma t
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
INNER JOIN Escola e ON e.Id = es.Escola
LEFT JOIN AlunoEscola ae ON ae.Turma = t.Id AND ae.AnoLetivo = 2026
LEFT JOIN PessoaEscolaAcesso pea ON pea.Id = ae.AlunoEscola_key
WHERE e.Id = 2376
  AND es.AnoLetivo = 2026
  AND t.Nome LIKE '2%rie%'
GROUP BY e.Id, t.Id, t.Nome

UNION ALL

SELECT
    'BLOCO_4__UNIDADE_POLO__2a_e_3a_Serie_Regular' AS Bloco,
    e.Id,
    t.Id,
    t.Nome,
    COUNT(ae.AlunoEscola_key),
    SUM(CASE WHEN pea.temp LIKE '909%' THEN 1 ELSE 0 END)
FROM Turma t
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
INNER JOIN Escola e ON e.Id = es.Escola
LEFT JOIN AlunoEscola ae ON ae.Turma = t.Id AND ae.AnoLetivo = 2026
LEFT JOIN PessoaEscolaAcesso pea ON pea.Id = ae.AlunoEscola_key
WHERE e.Id = 2397
  AND es.AnoLetivo = 2026
  AND t.Nome LIKE '%rie R%'
GROUP BY e.Id, t.Id, t.Nome

ORDER BY Bloco, TurmaNome;
