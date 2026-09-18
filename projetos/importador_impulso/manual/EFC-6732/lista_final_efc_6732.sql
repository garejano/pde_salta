-- ============================================================
-- Lista final — alunos criados no ciclo EFC-6732
-- Faixa de RA: 90929602 -> 90929754 (153 alunos)
-- NÃO inclui 90929601 (pertence à EMILY GABRIELI..., ciclo EFC-6517 —
-- ver manual/EFC-6732/corrigir_ra_duplicado.sql)
-- ============================================================
SELECT
    e.Nome         AS Escola,
    p.Nome         AS Aluno,
    p.temp         AS RA,
    t.Nome         AS Turma
FROM Pessoa p
INNER JOIN PessoaEscola pe        ON pe.Pessoa = p.Id
INNER JOIN Escola e                ON e.Id = pe.Escola
INNER JOIN PessoaEscolaAcesso pea ON pea.PessoaEscola = pe.Id AND pea.temp = p.temp
INNER JOIN AlunoEscola ae          ON ae.AlunoEscola_key = pea.Id
INNER JOIN Turma t                 ON t.Id = ae.Turma
WHERE p.temp BETWEEN '90929602' AND '90929754'
  AND ae.AnoLetivo = 2026
ORDER BY e.Nome, p.Nome;

-- Checagem rápida: deve retornar exatamente 153 linhas
