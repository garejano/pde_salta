-- EFC-6738 — Identifica aulas afetadas pelo achado 2.2 (apagamento silencioso do Diário de Classe)
--
-- Padrão do bug: um "Salvar" chegou com payload vazio/nulo, inativando o registro ativo
-- (soft delete via ControleDeEstado) sem inserir nada no lugar. Resultado: a aula tem
-- histórico de conteúdo real, mas hoje não tem nenhum registro ativo — o professor vê
-- o campo em branco, mesmo já tendo preenchido antes.
--
-- Rodar em ElevaPortalHomolog (mcp.readonly) ou no SQL Server do portal-atlas correspondente.
-- Ajustar @DataInicio para a janela de interesse (o card cita "dias 26/06 até a presente data").

DECLARE @DataInicio DATETIME = '2026-06-01';

-- ==========================================================================
-- 1) Campo "Conteúdo" (AnotacoesParaAluno / tabela AulaEventoAnotacoes)
-- ==========================================================================
SELECT
    esc.Nome           AS Escola,
    ser.Nome           AS Serie,
    t.Nome             AS Turma,
    disc.Nome          AS Disciplina,
    ae.Id              AS IdAulaEvento,
    ae.DataInicio      AS DataAula,
    a.Anotacoes        AS UltimoConteudoAtivoAntesDoApagamento,
    a.DataInclusao     AS DataInclusaoUltimaVersao,
    a.DataInativacao   AS DataDoApagamento,
    a.UsuarioInativacao AS IdUsuarioQueApagou
FROM AulaEventoAnotacoes a
INNER JOIN AulaEvento ae ON ae.Id = a.AulaEvento
INNER JOIN Turma t ON t.Id = ae.Turma
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
INNER JOIN Escola esc ON esc.Id = es.Escola
INNER JOIN Serie ser ON ser.Id = es.Serie
INNER JOIN Disciplina disc ON disc.Id = ae.Disciplina
WHERE a.DataInativacao >= @DataInicio
  AND a.AulaEvento IN (
        -- aulas com histórico (mais de 1 versão) e ZERO registros ativos hoje
        SELECT AulaEvento
        FROM AulaEventoAnotacoes
        GROUP BY AulaEvento
        HAVING COUNT(*) > 1
           AND SUM(CASE WHEN Ativo = 1 THEN 1 ELSE 0 END) = 0
  )
  -- pega só a última versão (a que ficou "perdida") de cada aula:
  AND a.DataInativacao = (
        SELECT MAX(a2.DataInativacao)
        FROM AulaEventoAnotacoes a2
        WHERE a2.AulaEvento = a.AulaEvento
  )
ORDER BY a.DataInativacao DESC;

-- ==========================================================================
-- 2) Campo "Atividades/Observações" (DeverDeCasa / tabela AulaEventoDeverDeCasa)
--    Mesmo padrão, mesma correção aplicada em UpdateDeverDeCasa — vale checar também.
-- ==========================================================================
SELECT
    esc.Nome           AS Escola,
    ser.Nome           AS Serie,
    t.Nome             AS Turma,
    disc.Nome          AS Disciplina,
    ae.Id              AS IdAulaEvento,
    ae.DataInicio      AS DataAula,
    d.DeverDeCasa      AS UltimaAtividadeAtivaAntesDoApagamento,
    d.DataInclusao     AS DataInclusaoUltimaVersao,
    d.DataInativacao   AS DataDoApagamento,
    d.UsuarioInativacao AS IdUsuarioQueApagou
FROM AulaEventoDeverDeCasa d
INNER JOIN AulaEvento ae ON ae.Id = d.AulaEvento
INNER JOIN Turma t ON t.Id = ae.Turma
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
INNER JOIN Escola esc ON esc.Id = es.Escola
INNER JOIN Serie ser ON ser.Id = es.Serie
INNER JOIN Disciplina disc ON disc.Id = ae.Disciplina
WHERE d.DataInativacao >= @DataInicio
  AND d.AulaEvento IN (
        SELECT AulaEvento
        FROM AulaEventoDeverDeCasa
        GROUP BY AulaEvento
        HAVING COUNT(*) > 1
           AND SUM(CASE WHEN Ativo = 1 THEN 1 ELSE 0 END) = 0
  )
  AND d.DataInativacao = (
        SELECT MAX(d2.DataInativacao)
        FROM AulaEventoDeverDeCasa d2
        WHERE d2.AulaEvento = d.AulaEvento
  )
ORDER BY d.DataInativacao DESC;

-- ==========================================================================
-- 3) Filtro opcional para o caso específico citado no card
--    (Butantã / Matemática / 8º ano) — descomentar e ajustar se necessário.
-- ==========================================================================
-- AND esc.Nome LIKE '%Butant%'
-- AND disc.Nome LIKE '%Matem%'
-- AND ser.Nome LIKE '%8%'
