-- ============================================================
-- Descoberta de IDs para as pendencias de mapeamento do EFC-7017
-- Gerado a partir de alunos_consolidado.csv (aba "ENEM 4")
-- Rodar em HOMOLOG via MCP e exportar o resultado como CSV:
--   manual/EFC-7017/candidatos_turmas_homolog.csv
-- Depois rodar resolver_pendencias.py para cruzar com as pendencias.
-- ============================================================

SELECT N'CARMELO PERRONE' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%CARMELO%PERRONE%'
UNION ALL

SELECT N'OURO VERDE' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%OURO%VERDE%'
UNION ALL

SELECT N'RODRIGUES ALVES' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%RODRIGUES%ALVES%'
UNION ALL

SELECT N'Otalípio Pereira de Andrade' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%OTAL%PEREIRA%ANDRADE%'
UNION ALL

SELECT N'Jardim Universitário' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%UNIVERSIT%'
UNION ALL

SELECT N'Papa João Paulo I' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%PAULO%'
UNION ALL

SELECT N'São Braz' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%BRAZ%'
UNION ALL

SELECT N'Dona Branca do N. M.' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%BRANCA%'
UNION ALL

SELECT N'Maria Pacheco' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%PACHECO%'
UNION ALL

SELECT N'Olavo Bilac' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%OLAVO%BILAC%'
UNION ALL

SELECT N'jardm interlagos' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%INTERLAGOS%'
UNION ALL

SELECT N'Jardim Panorama' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%JARDIM%PANORAMA%'
UNION ALL

SELECT N'GENÉSIO MORESCHI' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE N'%GENESIO%MORESCHI%'
ORDER BY EscolaPlanilha, TurmaNome;
