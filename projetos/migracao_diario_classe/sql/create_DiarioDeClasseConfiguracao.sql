-- =============================================================================
-- create_DiarioDeClasseConfiguracao.sql
-- Cria a tabela DiarioDeClasseConfiguracao no SQL Server (ElevaPortalHomolog)
-- Padrão StatefulEntity do estrutura-pedagogica
-- =============================================================================

IF NOT EXISTS (
    SELECT 1 FROM sys.tables WHERE name = 'DiarioDeClasseConfiguracao' AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
    CREATE TABLE [dbo].[DiarioDeClasseConfiguracao] (
        [Id]                            INT             NOT NULL IDENTITY(1,1),
        [Hash]                          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
        [Ativo]                         BIT             NOT NULL DEFAULT 1,
        [DataInclusao]                  DATETIME2       NOT NULL,
        [UsuarioInclusao]               INT             NOT NULL,
        [DataUltimaAlteracao]           DATETIME2       NULL,
        [UsuarioUltimaAlteracao]        INT             NULL,
        [DataInativacao]                DATETIME2       NULL,
        [UsuarioInativacao]             INT             NULL,
        [Rede]                          INT             NOT NULL,
        [CaracterParaIndicarPresenca]   VARCHAR(10)     NOT NULL,
        [CaracterParaIndicarFalta]      VARCHAR(10)     NOT NULL,
        [CaracterParaIndicarTransferencia] VARCHAR(10)  NOT NULL,
        [CaracterParaIndicarNEE]        VARCHAR(10)     NOT NULL,
        [CaracterParaIndicarPendencia]  VARCHAR(10)     NULL,
        [ExibirFrequencia]              BIT             NOT NULL DEFAULT 1,
        [ExibirConteudoMinistrado]      BIT             NOT NULL DEFAULT 1,
        [ExibirRelatorioRendimento]     BIT             NOT NULL DEFAULT 1,

        CONSTRAINT [PK_DiarioDeClasseConfiguracao] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_DiarioDeClasseConfiguracao_Rede] FOREIGN KEY ([Rede]) REFERENCES [dbo].[Rede]([Id])
    );

    CREATE UNIQUE INDEX [IX_DiarioDeClasseConfiguracao_Hash]
        ON [dbo].[DiarioDeClasseConfiguracao] ([Hash]);

    -- Índice único parcial: apenas uma configuração ativa por rede
    CREATE UNIQUE INDEX [IX_DiarioDeClasseConfiguracao_Rede]
        ON [dbo].[DiarioDeClasseConfiguracao] ([Rede])
        WHERE [Ativo] = 1;

    PRINT 'Tabela DiarioDeClasseConfiguracao criada com sucesso.';
END
ELSE
    PRINT 'Tabela DiarioDeClasseConfiguracao já existe. Nenhuma alteração feita.';
