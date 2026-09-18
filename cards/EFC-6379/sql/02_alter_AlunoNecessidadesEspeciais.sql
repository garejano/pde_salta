-- EFC-6381 / EFC-6382: Novos campos em AlunoNecessidadesEspeciais
-- Executar APÓS 01_create_TipoTranstorno.sql
-- Executar em: ElevaPortalHomolog
-- Rollback: ver seção ao final

ALTER TABLE [dbo].[AlunoNecessidadesEspeciais]
    ADD [PossuiLaudoStatus] INT          NULL,       -- 0=Nao, 1=Sim, 2=EmAvaliacao (EFC-6381)
        [TipoTranstorno]    INT          NULL,       -- FK TipoTranstorno.Id            (EFC-6381)
        [TipoTranstornoOutro] NVARCHAR(500) NULL,    -- texto livre para opção "Outros" (EFC-6381)
        [TipoMediacao]      INT          NULL,       -- 0=SemMediador, 1=Exclusiva, 2=Compartilhada (EFC-6382)
        [NomeMediador]      NVARCHAR(255) NULL;      -- nome do mediador (EFC-6382)

ALTER TABLE [dbo].[AlunoNecessidadesEspeciais]
    ADD CONSTRAINT [FK_AlunoNecessidadesEspeciais_TipoTranstorno]
        FOREIGN KEY ([TipoTranstorno]) REFERENCES [dbo].[TipoTranstorno]([Id]);

-- Rollback:
-- ALTER TABLE [dbo].[AlunoNecessidadesEspeciais]
--     DROP CONSTRAINT [FK_AlunoNecessidadesEspeciais_TipoTranstorno];
-- ALTER TABLE [dbo].[AlunoNecessidadesEspeciais]
--     DROP COLUMN [PossuiLaudoStatus], [TipoTranstorno], [TipoTranstornoOutro], [TipoMediacao], [NomeMediador];
