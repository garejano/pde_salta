-- ============================================================
-- PASSO 1: Resolução de IDs por nome — Alunos Impulso ENEM2
-- Rodar em HOMOLOG e PRODUÇÃO
-- Exportar resultado como CSV:
--   YYYY-MM-DD_to_ra_manual_homolog.csv
--   YYYY-MM-DD_to_ra_manual_producao.csv
-- ============================================================
WITH Combinacoes AS (
    SELECT *
    FROM (VALUES
        ('ADAILE M LEITE',           '3oBM',                    'ADAILE M LEITE',           N'3ª Série Regular B - M'          ),
        ('ANCHIETA',                 '2o SERIE REGULAR A',      'ANCHIETA',                 N'2ª Série Regular A - M'          ),
        ('ANCHIETA',                 '2o TEC. INTEGRAL',        'ANCHIETA',                 N'2ª Série Técnico A - I'          ),
        ('ANCHIETA',                 '3o SERIE REGULAR A',      'ANCHIETA',                 N'3ª Série Regular A - M'          ),
        ('BRANCA DA MOTA FERNANDES', '3o A',                    'BRANCA DA MOTA FERNANDES', N'3ª Série Regular A - M'          ),
        ('BRANCA DO N MIRANDA',      '3oA',                     'BRANCA DO N MIRANDA',      N'3ª Série Regular A - M'          ),
        ('BRANCA DO N MIRANDA',      '3oB',                     'BRANCA DO N MIRANDA',      N'3ª Série Regular B - M'          ),
        ('BRANCA DO N MIRANDA',      '3oC',                     'BRANCA DO N MIRANDA',      N'3ª Série Regular C - M'          ),
        ('BRANCA DO N MIRANDA',      '3oD',                     'BRANCA DO N MIRANDA',      N'3ª Série Regular D - M'          ),
        ('BRASILIO ITIBERE',         '3oA',                     'BRASILIO ITIBERE',         N'3ª Série Regular A - I'          ),
        ('DIRCE DE A MAIA',          '3oA',                     'DIRCE DE A MAIA',          N'3ª Série Regular A - I'          ),
        ('EDITHE',                   '3o A',                    'EDITHE',                   N'3ª Série Regular A - M'          ),
        ('EDITHE',                   '3o C',                    'EDITHE',                   N'3ª Série Regular C - M'          ),
        ('GASPAR DUTRA',             '2 A LGG',                 'GASPAR DUTRA',             N'2ª Série Técnico A - T'          ),
        ('GASPAR DUTRA',             '2 B ADM',                 'GASPAR DUTRA',             N'2ª Série Técnico ADM B - T'      ),
        ('GASPAR DUTRA',             '2 C AGRO',                'GASPAR DUTRA',             N'2ª Série Técnico AGRO C - T'     ),
        ('GENESIO MORESCHI',         '3oD',                     'GENESIO MORESCHI',         N'3ª Série Regular D - N'          ),
        ('IEDA BAGGIO MAYER',        '3o B',                    'IEDA BAGGIO MAYER',        N'3ª Série Regular B - M'          ),
        ('JARDIM EUROPA',            '2oA',                     'JARDIM EUROPA',            N'2ª Série Regular A - M'          ),
        ('JARDIM EUROPA',            '3oA',                     'JARDIM EUROPA',            N'3ª Série Regular A - M'          ),
        ('JARDIM PANORAMA',          '2A',                      'JARDIM PANORAMA',          N'2ª Série Regular A - M'          ),
        ('JARDIM PANORAMA',          '2B',                      'JARDIM PANORAMA',          N'2ª Série Regular B - M'          ),
        ('JARDIM PANORAMA',          '3A',                      'JARDIM PANORAMA',          N'3ª Série Regular A - M'          ),
        ('JARDIM PANORAMA',          '3B',                      'JARDIM PANORAMA',          N'3ª Série Regular B - M'          ),
        ('JARDIM PANORAMA',          '3C',                      'JARDIM PANORAMA',          N'3ª Série Regular C - M'          ),
        ('JD UNIVERSITARIO',         '3oA',                     'JARDIM UNIVERSITARIO',     N'3ª Série Regular A - M'          ),
        ('JD UNIVERSITARIO',         '3oC',                     'JARDIM UNIVERSITARIO',     N'3ª Série Regular C - M'          ),
        ('JOAO DE F PIOLI',          '2o B',                    'JOAO DE F PIOLI',          N'2ª Série Regular B - M'          ),
        ('JOAO DE F PIOLI',          '3o B',                    'JOAO DE F PIOLI',          N'3ª Série Regular B - M'          ),
        ('JOAO DE F PIOLI',          '3o C',                    'JOAO DE F PIOLI',          N'3ª Série Regular C - M'          ),
        ('JOAO DE F PIOLI',          '3oC',                     'JOAO DE F PIOLI',          N'3ª Série Regular C - M'          ),
        ('JOAO PAULO I',             '3o A',                    'JOAO PAULO I',             N'3ª Série Regular A - I'          ),
        ('MARIA MONTESSORI',         '2A',                      'MARIA MONTESSORI',         N'2ª Série Regular A - M'          ),
        ('MARIA MONTESSORI',         '2B',                      'MARIA MONTESSORI',         N'2ª Série Regular B - M'          ),
        ('MARIA MONTESSORI',         '3A',                      'MARIA MONTESSORI',         N'3ª Série Regular A - M'          ),
        ('OLAVO BILAC',              '2A',                      'OLAVO BILAC',              N'2ª Série Regular A - I'          ),
        ('OLAVO BILAC',              '2B',                      'OLAVO BILAC',              N'2ª Série Regular B - I'          ),
        ('PROTASIO DE CARVALHO',     '3B',                      'PROTASIO DE CARVALHO',     N'3ª Série Regular B - M'          ),
        ('PROTASIO DE CARVALHO',     '3C',                      'PROTASIO DE CARVALHO',     N'3ª Série Regular C - M'          ),
        ('RODRIGUES ALVES',          '3oA',                     'RODRIGUES ALVES',          N'3ª Série Regular A - I'          ),
        ('TANCREDO NEVES',           '2o SERIE REGULAR A - M',  'TANCREDO NEVES',           N'2ª Série Regular A - M'          ),
        ('TANCREDO NEVES',           '2o SERIE REGULAR C - M',  'TANCREDO NEVES',           N'2ª Série Regular C - M'          ),
        ('TEOTONIO VILELA',          '2oA',                     'TEOTONIO VILELA',          N'2ª Série Regular A - M'          ),
        ('TEOTONIO VILELA',          '2oD',                     'TEOTONIO VILELA',          N'2ª Série Regular D - M'          ),
        ('TEOTONIO VILELA',          '3oB',                     'TEOTONIO VILELA',          N'3ª Série Regular B - M'          ),
        ('TEOTONIO VILELA',          '3oC',                     'TEOTONIO VILELA',          N'3ª Série Regular C - M'          ),
        ('UNIDADE POLO',             '2o SERIE REGULAR',        'UNIDADE POLO',             N'2ª Série Regular L - I'          ),
        ('UNIDADE POLO',             '2o SERIE TECNICO',        'UNIDADE POLO',             N'2ª Série Técnico A - I'          ),
        ('UNIDADE POLO',             '3o SERIE REGULAR',        'UNIDADE POLO',             N'3ª Série Regular A - I'          ),
        ('ZUMBI DOS PALMARES',       '2o SERIE REGULAR A - M',  'ZUMBI DOS PALMARES',       N'2ª Série Regular A - M'          ),
        ('ZUMBI DOS PALMARES',       '3o SERIE REGULAR A - M',  'ZUMBI DOS PALMARES',       N'3ª Série Regular A - M'          ),
        ('ZUMBI DOS PALMARES',       '3o SERIE REGULAR B - M',  'ZUMBI DOS PALMARES',       N'3ª Série Regular B - M'          )
    ) AS t(escola_norm, turma_norm, escola_db, turma_db)
)
SELECT
    c.escola_norm,
    c.turma_norm,
    e.Id  AS escola_id,
    t.Id  AS turma_id,
    t.Nome AS turma_nome_banco
FROM Combinacoes c
INNER JOIN Escola e      ON e.Nome       = c.escola_db
INNER JOIN EscolaSerie es ON es.Escola   = e.Id  AND es.AnoLetivo = 2026
INNER JOIN Turma t        ON t.EscolaSerie = es.Id AND t.Nome     = c.turma_db
ORDER BY c.escola_norm, c.turma_norm;

-- ============================================================
-- PASSO 2: Próximo RA disponível (anotar antes de rodar o gerador)
-- ============================================================
SELECT
    MAX(CAST(temp AS BIGINT))     AS ultimo_ra,
    MAX(CAST(temp AS BIGINT)) + 1 AS proximo_ra
FROM Pessoa
WHERE temp LIKE '909%'
  AND ISNUMERIC(temp) = 1;
