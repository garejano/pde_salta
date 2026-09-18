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
        ('ZUMBI DOS PALMARES',       '3o SERIE REGULAR B - M',  'ZUMBI DOS PALMARES',       N'3ª Série Regular B - M'          ),
        -- --------------------------------------------------------
        -- Adicionado em jun/26 — nomes de escola com sufixo completo
        -- --------------------------------------------------------
        -- ALGACYR M MAEDER (escola_norm inclui sufixo da planilha)
        ('ALGACYR M MAEDER, C E PROF-EF M PROFIS', '2o SERIE',  'ALGACYR M MAEDER', N'2ª Série Regular A - I'  ),
        ('ALGACYR M MAEDER, C E PROF-EF M PROFIS', '2 SERIE',   'ALGACYR M MAEDER', N'2ª Série Regular A - I'  ),
        ('ALGACYR M MAEDER, C E PROF-EF M PROFIS', '3o SERIE',  'ALGACYR M MAEDER', N'3ª Série Regular A - I'  ),
        -- EDITHE (nome longo no Excel jun/26)
        ('EDITHE, C E PROFA-EF M',                 '3o SERIE A','EDITHE',            N'3ª Série Regular A - M'  ),
        -- GENESIO MORESCHI (nome longo no Excel jun/26)
        ('GENESIO MORESCHI, C E-EF M',             '3o SERIE A','GENESIO MORESCHI',  N'3ª Série Regular A - N'  ),
        ('EDITHE, C E PROFA-EF M',                 '3o SERIE C','EDITHE',            N'3ª Série Regular C - M'  ),
        -- ELEODORO (nome curto no Excel jun/26 → banco: ELEODORO E PEREIRA)
        ('ELEODORO',                               '3oB',       'ELEODORO E PEREIRA',N'3ª Série Regular B - M'  ),
        -- JARDIM EUROPA (nome longo no Excel jun/26)
        -- '2°SÉRIE A' → normaliza sem espaço: '2oSERIE A'
        ('JARDIM EUROPA, C E-EF M PROFIS',         '2oSERIE A', 'JARDIM EUROPA',     N'2ª Série Regular A - M'  ),
        ('JARDIM EUROPA, C E-EF M PROFIS',         '3o SERIE C','JARDIM EUROPA',     N'3ª Série Regular C - N'  ),
        -- JARDIM INTERLAGOS (nova escola jun/26)
        -- '3 SÉRIE C/D' sem ordinal → normaliza sem 'o': '3 SERIE C/D'
        ('JARDIM INTERLAGOS',                      '3 SERIE C', 'JARDIM INTERLAGOS', N'3ª Série Regular C - N'  ),
        ('JARDIM INTERLAGOS',                      '3 SERIE D', 'JARDIM INTERLAGOS', N'3ª Série Regular D - N'  ),
        -- MARILIS F PIROTELLI (nova escola jun/26)
        -- planilha mistura '3 SÉRIE B' (sem ordinal) e '3ª SÉRIE B' (com ordinal)
        ('MARILIS F PIROTELLI',                    '3 SERIE B', 'MARILIS F PIROTELLI',N'3ª Série Regular B - M'  ),
        ('MARILIS F PIROTELLI',                    '3o SERIE B','MARILIS F PIROTELLI',N'3ª Série Regular B - M'  ),
        ('MARILIS F PIROTELLI',                    '3o SERIE C','MARILIS F PIROTELLI',N'3ª Série Regular C - M'  ),
        -- OURO VERDE (nome longo no Excel jun/26) ⚠️ banco tem A-M e A-T — confirmar período
        ('OURO VERDE, C E DE-EF M PROFIS',         '3o SERIE A','OURO VERDE',        N'3ª Série Regular A - M'  ),
        -- SAO BRAZ (nome longo no Excel jun/26) ⚠️ planilha só diz '3ª SÉRIE' sem A/B/C — confirmar turma
        ('SAO BRAZ, C E-EF M',                     '3o SERIE',  'SAO BRAZ',          N'3ª Série Regular A - M'  ),
        -- TANCREDO NEVES (nome longo no Excel jun/26 — novas turmas 3ª série A e B)
        ('TANCREDO NEVES, C E-EF M PROFIS',        '3o SERIE A','TANCREDO NEVES',    N'3ª Série Regular A - M'  ),
        ('TANCREDO NEVES, C E-EF M PROFIS',        '3o SERIE B','TANCREDO NEVES',    N'3ª Série Regular B - M'  ),
        -- --------------------------------------------------------
        -- Adicionado em ago/26 — EFC-6732 (alta confiança via resolver_pendencias.py,
        -- cruzado com candidatos reais de produção — ver manual/EFC-6732/guide.md)
        -- --------------------------------------------------------
        ('ADAILE MARIA LEITE',                  '3oB',                        'ADAILE M LEITE',              N'3ª Série Regular B - M'      ),
        ('JD EUROPA',                            '2oA REGULAR',                'JARDIM EUROPA',               N'2ª Série Regular A - M'      ),
        ('JD EUROPA',                            '3oB TEC',                    'JARDIM EUROPA',               N'3ª Série Técnico B - N'      ),
        ('JD EUROPA',                            '3oA TEC',                    'JARDIM EUROPA',               N'3ª Série Técnico A - N'      ),
        ('JD EUROPA',                            '3oC REGULAR',                'JARDIM EUROPA',               N'3ª Série Regular C - N'      ),
        ('OLAVO BILAC',                          '3oB',                        'OLAVO BILAC',                 N'3ª Série Regular B - I'      ),
        ('OLAVO BILAC',                          '2oB',                        'OLAVO BILAC',                 N'2ª Série Regular B - I'      ),
        ('MARIA LUIZA F. PACHECO',               '3oB',                        'MARIA L F PACHECO',           N'3ª Série Regular B - M'      ),
        ('NOSSA SENHORA DA SALETE',              '3oA',                        'NOSSA SRA DA SALETE',         N'3ª Série Regular A - M'      ),
        ('ANCHIETA',                             '3o SERIE REGULAR A - M',     'ANCHIETA',                    N'3ª Série Regular A - M'      ),
        ('ANCHIETA',                             '2o SERIE REGULAR A - M',     'ANCHIETA',                    N'2ª Série Regular A - M'      ),
        ('IEDA BAGGIO MAYER',                    '3oB',                        'IEDA BAGGIO MAYER',           N'3ª Série Regular B - M'      ),
        ('ORIONE',                               '3o SERIE REGULAR A - M',     'ORIONE',                      N'3ª Série Regular A - M'      ),
        ('ORIONE',                               '3o SERIE REGULAR B - M',     'ORIONE',                      N'3ª Série Regular B - M'      ),
        ('GENESIO MORESCHI',                     '2oA',                        'GENESIO MORESCHI',            N'2ª Série Regular A - N'      ),
        ('GENESIO MORESCHI',                     '2oB',                        'GENESIO MORESCHI',            N'2ª Série Regular B - N'      ),
        ('GENESIO MORESCHI',                     '2oC',                        'GENESIO MORESCHI',            N'2ª Série Regular C - N'      ),
        ('GENESIO MORESCHI',                     '2oD',                        'GENESIO MORESCHI',            N'2ª Série Regular D - N'      ),
        ('GENESIO MORESCHI',                     '3oA',                        'GENESIO MORESCHI',            N'3ª Série Regular A - N'      ),
        ('GENESIO MORESCHI',                     '3oB',                        'GENESIO MORESCHI',            N'3ª Série Regular B - N'      ),
        ('GENESIO MORESCHI',                     '3oC',                        'GENESIO MORESCHI',            N'3ª Série Regular C - N'      ),
        ('GENESIO MORESCHI',                     '3oE',                        'GENESIO MORESCHI',            N'3ª Série Regular E - N'      ),
        ('CARMELO PERRONE',                      '3o SERIE REGULAR A - M',     'CARMELO PERRONE',             N'3ª Série Regular A - M'      ),
        ('PROTASIO DE CARVALHO',                 '3o SERIE REGULAR B - M',     'PROTASIO DE CARVALHO',        N'3ª Série Regular B - M'      ),
        ('PROTASIO DE CARVALHO',                 '3o SERIE REGULAR C - M',     'PROTASIO DE CARVALHO',        N'3ª Série Regular C - M'      ),
        ('PROTASIO DE CARVALHO',                 '3o SERIE REGULAR D - M',     'PROTASIO DE CARVALHO',        N'3ª Série Regular D - M'      ),
        ('QUIELSE CRISOSTOMO DA SILVA',          '3o SERIE REGULAR A - M',     'QUIELSE CRISOSTOMO DA SILVA', N'3ª Série Regular A - M'      ),
        ('QUIELSE CRISOSTOMO DA SILVA',          '3o SERIE REGULAR B - M',     'QUIELSE CRISOSTOMO DA SILVA', N'3ª Série Regular B - M'      ),
        ('QUIELSE CRISOSTOMO DA SILVA',          '3o SERIE REGULAR C - M',     'QUIELSE CRISOSTOMO DA SILVA', N'3ª Série Regular C - M'      ),
        ('QUIELSE CRISOSTOMO DA SILVA',          '3o SERIE REGULAR D - M',     'QUIELSE CRISOSTOMO DA SILVA', N'3ª Série Regular D - M'      ),
        ('ELEODORO EBANO PEREIRA',               '3o SERIE REGULAR A - M',     'ELEODORO E PEREIRA',          N'3ª Série Regular A - M'      ),
        ('ELEODORO EBANO PEREIRA',               '3o SERIE REGULAR D - M',     'ELEODORO E PEREIRA',          N'3ª Série Regular D - M'      ),
        ('ELEODORO EBANO PEREIRA',               '3o SERIE REGULAR B - M',     'ELEODORO E PEREIRA',          N'3ª Série Regular B - M'      ),
        ('ELEODORO EBANO PEREIRA',               '2o SERIE REGULAR A - M',     'ELEODORO E PEREIRA',          N'2ª Série Regular A - M'      ),
        ('ELEODORO EBANO PEREIRA',               '2o SERIE REGULAR B - M',     'ELEODORO E PEREIRA',          N'2ª Série Regular B - M'      ),
        ('ELEODORO EBANO PEREIRA',               '2o SERIE REGULAR C - M',     'ELEODORO E PEREIRA',          N'2ª Série Regular C - M'      ),
        ('ELEODORO EBANO PEREIRA',               '2o SERIE TECNINCO ADM A - M','ELEODORO E PEREIRA',          N'2ª Série Técnico ADM A - M'  ),
        ('ELEODORO EBANO PEREIRA',               '2o SERIE TECNINCO ADM B - M','ELEODORO E PEREIRA',          N'2ª Série Técnico ADM B - M'  ),
        ('ZUMBI DOS PALMARES',                   '2o SERIE REGULAR B - M',     'ZUMBI DOS PALMARES',          N'2ª Série Regular B - M'      ),
        ('JARDIM INTERLAGOS',                    '3o SERIE REGULAR A - M',     'JARDIM INTERLAGOS',           N'3ª Série Regular A - M'      ),
        ('JARDIM INTERLAGOS',                    '3o SERIE REGULAR D',         'JARDIM INTERLAGOS',           N'3ª Série Regular D - N'      ),
        ('JARDIM INTERLAGOS',                    '3o SERIE REGULAR B',         'JARDIM INTERLAGOS',           N'3ª Série Regular B - M'      ),
        ('JARDIM INTERLAGOS',                    '3o SERIE REGULAR A',         'JARDIM INTERLAGOS',           N'3ª Série Regular A - M'      ),
        ('TEOTONIO VILELA',                      '2oB',                        'TEOTONIO VILELA',             N'2ª Série Regular B - M'      ),
        ('TEOTONIO VILELA',                      '2oC',                        'TEOTONIO VILELA',             N'2ª Série Regular C - M'      ),
        ('IEDA BAGGIO',                          '3oB',                        'IEDA BAGGIO MAYER',           N'3ª Série Regular B - M'      ),
        ('MARILIS FARIA PIROTELLI',              '3o SERIE REGULAR A - M',     'MARILIS F PIROTELLI',         N'3ª Série Regular A - M'      ),
        ('TEOTONIO VILELA',                      '2o SERIE REGULAR A - M',     'TEOTONIO VILELA',             N'2ª Série Regular A - M'      ),
        -- --------------------------------------------------------
        -- Adicionado em ago/26 — EFC-6732, confirmado por Emanuela Hardt (PM) em 2026-08-20
        -- --------------------------------------------------------
        ('GASPAR DUTRA',                         '3o LGG',                     'GASPAR DUTRA',                N'3ª Série Regular A - T'      ),
        ('TEOTONIO VILELA',                      '3oA',                        'TEOTONIO VILELA',             N'3ª Série Regular A - M'      ),
        ('TEOTONIO VILELA',                      '2oALIMENTOS',                'TEOTONIO VILELA',             N'2ª Série Regular A - M'      ),
        ('ZUMBI DOS PALMARES',                   '2o SERIE REGULAR A - I',     'ZUMBI DOS PALMARES',          N'2ª Série Regular A - M'      ),
        ('JARDIM PANORAMA',                      '2C',                         'JARDIM PANORAMA',             N'2ª Série Regular C - M'      ),
        ('BRANCA DA MOTA FERNANDES',             '3A',                         'BRANCA DA MOTA FERNANDES',    N'3ª Série Regular A - M'      ),
        ('BRANCA DA MOTA FERNANDES',              '3B',                        'BRANCA DA MOTA FERNANDES',    N'3ª Série Regular B - M'      ),
        -- --------------------------------------------------------
        -- Adicionado em ago/26 — EFC-6750 (aba '2408', turmas em formato
        -- descritivo completo — confirmado via consulta direta a Turma/EscolaSerie)
        -- --------------------------------------------------------
        ('BRASILIO ITIBIRE',                     '3o SERIE REGULAR A - INTEGRAL', 'BRASILIO ITIBERE',         N'3ª Série Regular A - I'      ),
        ('BRASILIO ITIBIRE',                     '2o SERIE REGULAR A - INTEGRAL', 'BRASILIO ITIBERE',         N'2ª Série Regular A - I'      ),
        ('NOSSA SENHORA DA SALETE',               '2o SERIE REGULAR A - M',    'NOSSA SRA DA SALETE',         N'2ª Série Regular A - M'      ),
        ('ORIONE',                                '2o SERIE REGULAR A - M',    'ORIONE',                      N'2ª Série Regular A - M'      ),
        ('ORIONE',                                '2o SERIE REGULAR B - M',    'ORIONE',                      N'2ª Série Regular B - M'      ),
        ('ORIONE',                                '2o SERIE REGULAR C - M',    'ORIONE',                      N'2ª Série Regular C - M'      ),
        ('PROTASIO DE CARVALHO',                  '2o SERIE TECNICO ADM A - M','PROTASIO DE CARVALHO',        N'2ª Série Técnico ADM A - M'  ),
        ('MARILIS',                               '3o SERIE REGULAR A - M',    'MARILIS F PIROTELLI',         N'3ª Série Regular A - M'      ),
        ('MARILIS',                               '3o SERIE REGULAR D - M',    'MARILIS F PIROTELLI',         N'3ª Série Regular D - M'      ),
        ('IEDA BAGGIO MAYER',                     '3o SERIE REGULAR B',        'IEDA BAGGIO MAYER',           N'3ª Série Regular B - M'      ),
        ('ALGACYR M MAEDER',                      '3o SERIE REGULAR A - INTEGRAL', 'ALGACYR M MAEDER',        N'3ª Série Regular A - I'      ),
        ('ALGACYR M MAEDER',                      '2o SERIE REGULAR A - INTEGRAL', 'ALGACYR M MAEDER',        N'2ª Série Regular A - I'      ),
        ('EDITHE',                                '3o SERIE REGULAR B - M',    'EDITHE',                      N'3ª Série Regular B - M'      ),
        ('EDITHE',                                '3o SERIE REGULAR C - M',    'EDITHE',                      N'3ª Série Regular C - M'      ),
        -- --------------------------------------------------------
        -- Adicionado em ago/26 — EFC-6750, correção pós-pendência: turma
        -- corrigida em alunos_consolidado.csv depois de checar com a escola
        -- --------------------------------------------------------
        -- Beatriz Mazon Gziboski: planilha tinha "Técnico em ADM", corrigido para "Técnico" (única turma técnica de 2ª série na escola)
        ('NOSSA SENHORA DA SALETE',               '2o SERIE TECNICO - M',      'NOSSA SRA DA SALETE',         N'2ª Série Técnico A - M'      ),
        -- Tayna Dal' Pra Good / Isaque Amaral: planilha tinha "Regular B - Integral" (não existe), corrigido para "Regular A - I"
        ('ALGACYR M MAEDER',                      '2o SERIE REGULAR A - I',    'ALGACYR M MAEDER',            N'2ª Série Regular A - I'      ),
        -- --------------------------------------------------------
        -- Adicionado em set/26 — EFC-6799 (aba '0209')
        -- --------------------------------------------------------
        ('GENESIO MORESCHI',                      '2o SERIE REGULAR C',        'GENESIO MORESCHI',            N'2ª Série Regular C - N'      ),
        ('DIRCE DE AGUIAR MAIA',                  '2o SERIA INTEGRAL A',       'DIRCE DE A MAIA',             N'2ª Série Regular A - I'      ),
        -- Carlos Alfonzo Peres Toledo: planilha tinha "Regular C- Integral" (escola não tem turma Integral), corrigido para "Regular C - M"
        ('ELEODORO EBANO PEREIRA',                '3o SERIE REGULAR C- INTEGRAL', 'ELEODORO E PEREIRA',       N'3ª Série Regular C - M'      )
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
