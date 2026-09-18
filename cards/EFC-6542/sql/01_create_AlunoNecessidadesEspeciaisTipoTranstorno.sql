-- EFC-6542: Nova tabela de relação N:N para suportar múltiplos diagnósticos por aluno NEE
-- Executar em: ElevaPortalHomolog
-- Rollback: ver seção ao final
--
-- Nota: AlunoNecessidadesEspeciais.TipoTranstorno / TipoTranstornoOutro (colunas já existentes)
-- permanecem intactas e passam a ser apenas leitura para registros legados (salvos antes desta
-- feature). Novos salvamentos passam a gravar exclusivamente nesta tabela nova.

CREATE TABLE [dbo].[AlunoNecessidadesEspeciaisTipoTranstorno] (
    [Id]                        INT IDENTITY(1,1) NOT NULL,
    [Hash]                      UNIQUEIDENTIFIER   NOT NULL,
    [Ativo]                     BIT                NOT NULL DEFAULT(1),
    [AlunoNecessidadesEspeciais] INT               NOT NULL,
    [TipoTranstorno]            INT                NOT NULL,
    [TipoTranstornoOutro]       NVARCHAR(500)      NULL,

    CONSTRAINT [PK_AlunoNecessidadesEspeciaisTipoTranstorno] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UQ_AlunoNecessidadesEspeciaisTipoTranstorno_Hash] UNIQUE ([Hash]),
    CONSTRAINT [FK_AlunoNeeTipoTranstorno_AlunoNecessidadesEspeciais]
        FOREIGN KEY ([AlunoNecessidadesEspeciais]) REFERENCES [dbo].[AlunoNecessidadesEspeciais]([Id]),
    CONSTRAINT [FK_AlunoNeeTipoTranstorno_TipoTranstorno]
        FOREIGN KEY ([TipoTranstorno]) REFERENCES [dbo].[TipoTranstorno]([Id])
);

CREATE INDEX [IX_AlunoNeeTipoTranstorno_AlunoNecessidadesEspeciais]
    ON [dbo].[AlunoNecessidadesEspeciaisTipoTranstorno] ([AlunoNecessidadesEspeciais]);

-- Rollback:
-- DROP TABLE [dbo].[AlunoNecessidadesEspeciaisTipoTranstorno];
