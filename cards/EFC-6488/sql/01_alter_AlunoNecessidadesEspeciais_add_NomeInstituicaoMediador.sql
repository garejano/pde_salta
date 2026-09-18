-- EFC-6488: Novo campo em AlunoNecessidadesEspeciais para o tipo de mediação "Mediador Particular"
-- Executar em: ElevaPortalHomolog
-- Rollback: ver seção ao final
--
-- Nota: o novo valor de TipoMediacao = 3 (Mediador Particular) não requer nenhuma alteração de schema,
-- pois o campo já é INT NULL sem enum/check constraint. NomeMediador (já existente) é reusado para o
-- nome do profissional particular. Este script adiciona apenas o campo novo de clínica/instituição de origem.

ALTER TABLE [dbo].[AlunoNecessidadesEspeciais]
    ADD [NomeInstituicaoMediador] NVARCHAR(255) NULL;  -- nome da clínica/instituição do mediador particular (EFC-6488)

-- Rollback:
-- ALTER TABLE [dbo].[AlunoNecessidadesEspeciais]
--     DROP COLUMN [NomeInstituicaoMediador];
