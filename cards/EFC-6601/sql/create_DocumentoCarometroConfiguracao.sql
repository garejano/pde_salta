-- =============================================================================
-- create_DocumentoCarometroConfiguracao.sql
-- Cria a tabela DocumentoCarometroConfiguracao no SQL Server (ElevaPortalHomolog)
-- Padrão StatefulEntity do estrutura-pedagogica — 1 configuração ativa por usuário
-- Referência: EFC-6601 | Espelha o padrão de DiarioDeClasseConfiguracao
--   (ver migracao_diario_classe/sql/create_DiarioDeClasseConfiguracao.sql),
--   trocando o escopo de Rede para Usuario.
-- =============================================================================

IF NOT EXISTS (
    SELECT 1 FROM sys.tables WHERE name = 'DocumentoCarometroConfiguracao' AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
    CREATE TABLE [dbo].[DocumentoCarometroConfiguracao] (
        [Id]                            INT             NOT NULL IDENTITY(1,1),
        [Hash]                          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
        [Ativo]                         BIT             NOT NULL DEFAULT 1,
        [DataInclusao]                  DATETIME2       NOT NULL,
        [UsuarioInclusao]               INT             NOT NULL,
        [DataUltimaAlteracao]           DATETIME2       NULL,
        [UsuarioUltimaAlteracao]        INT             NULL,
        [DataInativacao]                DATETIME2       NULL,
        [UsuarioInativacao]             INT             NULL,
        [Usuario]                       INT             NOT NULL,
        [QuantidadeColunas]             INT             NOT NULL,
        [Espacamento]                   INT             NOT NULL,
        [AlturaCard]                    INT             NULL,
        [FormatoCard]                   INT             NOT NULL,
        [ExibirNomeAluno]               BIT             NOT NULL DEFAULT 1,
        [ExibirRA]                      BIT             NOT NULL DEFAULT 1,
        [ExibirResponsavel]             BIT             NOT NULL DEFAULT 1,
        [ExibirTelefone]                BIT             NOT NULL DEFAULT 1,
        [ExibirEmail]                   BIT             NOT NULL DEFAULT 1,

        CONSTRAINT [PK_DocumentoCarometroConfiguracao] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_DocumentoCarometroConfiguracao_Usuario] FOREIGN KEY ([Usuario]) REFERENCES [dbo].[Usuario]([Id])
    );

    CREATE UNIQUE INDEX [IX_DocumentoCarometroConfiguracao_Hash]
        ON [dbo].[DocumentoCarometroConfiguracao] ([Hash]);

    -- Índice único parcial: apenas uma configuração ativa por usuário
    CREATE UNIQUE INDEX [IX_DocumentoCarometroConfiguracao_Usuario]
        ON [dbo].[DocumentoCarometroConfiguracao] ([Usuario])
        WHERE [Ativo] = 1;

    PRINT 'Tabela DocumentoCarometroConfiguracao criada com sucesso.';
END
ELSE
    PRINT 'Tabela DocumentoCarometroConfiguracao já existe. Nenhuma alteração feita.';

-- NOTA: o registro correspondente na tabela Funcionalidade (necessário para
-- [RequiredAuthorization(Funcionalidade.DocumentoCarometroConfiguracao)]) não está
-- incluído aqui — depende de decisões de produto (Nome, Produto, PossuiMenu, etc.)
-- que devem ser definidas junto com a implementação do controller.
