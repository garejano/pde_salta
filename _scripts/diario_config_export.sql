-- =============================================================================
-- diario_config_export.sql
-- Exporta DiarioClasseConfiguracao do banco PostgreSQL (documentacao-pedagogica)
-- para um CSV que será processado por csv_to_sql_diario_config.py
--
-- Como usar (DBeaver):
--   Execute o SELECT abaixo normalmente e exporte o resultado via
--   botão direito no grid → Export Data → CSV (com cabeçalho ativado).
--   Salve o arquivo como: diario_config_export.csv
--
-- Como usar (psql):
--   Substitua \COPY por COPY ... TO '/caminho/diario_config_export.csv'
--   e execute com um usuário que tenha permissão de escrita no servidor.
-- =============================================================================

SELECT
    dc."Hash"::text                                             AS hash,
    CASE WHEN dc."Ativo" THEN 1 ELSE 0 END                    AS ativo,
    TO_CHAR(dc."DataInclusao",       'YYYY-MM-DD HH24:MI:SS') AS data_inclusao,
    TO_CHAR(dc."DataUltimaAlteracao",'YYYY-MM-DD HH24:MI:SS') AS data_ultima_alteracao,
    dc."CaracterParaIndicarPresenca"                           AS caract_presenca,
    dc."CaracterParaIndicarFalta"                              AS caract_falta,
    dc."CaracterParaIndicarTransferencia"                      AS caract_transferencia,
    dc."CaracterParaIndicarNEE"                                AS caract_nee,
    COALESCE(dc."CaracterParaIndicarPendencia", '')            AS caract_pendencia,
    CASE WHEN dc."ExibirFrequencia"         THEN 1 ELSE 0 END AS exibir_freq,
    CASE WHEN dc."ExibirConteudoMinistrado" THEN 1 ELSE 0 END AS exibir_conteudo,
    CASE WHEN dc."ExibirRelatorioRendimento"THEN 1 ELSE 0 END AS exibir_rendimento,
    r."HashOrigem"::text                                       AS rede_hash_origem
FROM "DiarioClasseConfiguracao" dc
INNER JOIN "Rede" r ON r."Id" = dc."Rede"
WHERE dc."Ativo"         = TRUE
  AND r."HashOrigem"     IS NOT NULL
ORDER BY dc."DataInclusao";
