-- ============================================================
-- Passo 1: Aplicar a alteração da coluna (rodar como owner/DBA)
-- ============================================================
ALTER TABLE "EscolaExterna"
    ALTER COLUMN "Nome" TYPE character varying(300);

-- ============================================================
-- Passo 2: Marcar a migration como concluída no EF Core
-- ============================================================
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260525123244_Alter_EscolaExterna_Noma_MaxLength', '8.0.25');

-- ============================================================
-- Validação: confirmar tamanho da coluna e registro da migration
-- ============================================================
SELECT table_name, column_name, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'EscolaExterna' AND column_name = 'Nome';

SELECT "MigrationId", "ProductVersion"
FROM "__EFMigrationsHistory"
WHERE "MigrationId" = '20260525123244_Alter_EscolaExterna_Noma_MaxLength';
