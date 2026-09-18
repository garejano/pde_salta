-- ============================================================
-- Descoberta de IDs para as pendencias de mapeamento do EFC-6732
-- Gerado a partir de pendencia_importacao_EFC-6732.md
-- Rodar em PRODUCAO (uma unica query) e exportar o resultado como CSV:
--   manual/EFC-6732/candidatos_turmas_producao.csv
-- Depois rodar resolver_pendencias.py para cruzar com as pendencias.
-- ============================================================

SELECT 'Adaile Maria Leite' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%ADAILE%LEITE%'
UNION ALL

SELECT 'JD EUROPA' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%EUROPA%'
UNION ALL

SELECT 'Gaspar Dutra' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%GASPAR%DUTRA%'
UNION ALL

SELECT 'Olavo Bilac' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%OLAVO%BILAC%'
UNION ALL

SELECT 'Maria Luiza F. Pacheco' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%MARIA%PACHECO%'
UNION ALL

SELECT 'Nossa Senhora da Salete' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%NOSSA%SALETE%'
UNION ALL

SELECT 'Teotonio Vilela' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%TEOTONIO%VILELA%'
UNION ALL

SELECT 'JARDIM PANORAMA' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%JARDIM%PANORAMA%'
UNION ALL

SELECT 'BRANCA DA MOTA FERNANDES' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%BRANCA%FERNANDES%'
UNION ALL

SELECT 'ANCHIETA' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%ANCHIETA%'
UNION ALL

SELECT 'IEDA BAGGIO MAYER' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%IEDA%MAYER%'
UNION ALL

SELECT 'ORIONE' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%ORIONE%'
UNION ALL

SELECT 'GENÉSIO MORESCHI' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%GENESIO%MORESCHI%'
UNION ALL

SELECT 'CARMELO PERRONE' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%CARMELO%PERRONE%'
UNION ALL

SELECT 'PROTÁSIO DE CARVALHO' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%PROTASIO%CARVALHO%'
UNION ALL

SELECT 'QUIELSE CRISÓSTOMO DA SILVA' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%QUIELSE%SILVA%'
UNION ALL

SELECT 'ELEODORO EBANO PEREIRA' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%ELEODORO%PEREIRA%'
UNION ALL

SELECT 'ZUMBI DOS PALMARES' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%ZUMBI%PALMARES%'
UNION ALL

SELECT 'JARDIM INTERLAGOS' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%JARDIM%INTERLAGOS%'
UNION ALL

SELECT 'IEDA BAGGIO' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%IEDA%BAGGIO%'
UNION ALL

SELECT 'Marilis Faria Pirotelli' AS EscolaPlanilha, e.Id AS EscolaId, e.Nome AS EscolaNome, t.Id AS TurmaId, t.Nome AS TurmaNome
FROM Escola e
INNER JOIN EscolaSerie es ON es.Escola = e.Id AND es.AnoLetivo = 2026
INNER JOIN Turma t ON t.EscolaSerie = es.Id
WHERE e.Nome LIKE '%MARILIS%PIROTELLI%'
ORDER BY EscolaPlanilha, TurmaNome;
