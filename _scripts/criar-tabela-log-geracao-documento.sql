-- estrutura-pedagogica: tabela de log de auditoria de geração de documento (document-builder)
-- Implementado em backend/Scripts/criar-tabela-log-geracao-documento.sql (repo estrutura-pedagogica)
-- Ao abrir card Jira, mover para cards/<EFC-xxx>/sql/ (branch feature/LogGeracaoDoc)
--
-- Reflete o estado final da tabela (já aplicado em ambientes existentes via os scripts
-- incrementais alterar-tabela-log-geracao-documento-anoletivo-aluno.sql e
-- alterar-tabela-log-geracao-documento-sucesso.sql). Este CREATE serve para
-- provisionar a tabela do zero em um ambiente novo, com todas as colunas já corretas.

CREATE TABLE [dbo].[LogGeracaoDocumento] (
    [Id]                     INT IDENTITY(1,1)   NOT NULL,
    [Hash]                   UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWID(),
    [Ativo]                  BIT                 NOT NULL DEFAULT 1,

    -- Auditoria StatefulEntity
    [DataInclusao]           DATETIME            NOT NULL,
    [UsuarioInclusao]        INT                 NULL,
    [DataUltimaAlteracao]    DATETIME            NULL,
    [UsuarioUltimaAlteracao] INT                 NULL,
    [DataInativacao]         DATETIME            NULL,
    [UsuarioInativacao]      INT                 NULL,

    -- Domínio
    [NomeDocumento]          VARCHAR(200)        NOT NULL,
    [TipoGeracao]            TINYINT             NOT NULL, -- 1 = Impressao, 2 = Pdf
    [Sucesso]                BIT                 NOT NULL DEFAULT 1, -- geração no backend concluiu com sucesso?
    [Metadados]              NVARCHAR(MAX)       NULL,     -- JSON livre (contexto extra, se necessário)

    -- FKs opcionais (nomes de coluna sem sufixo Id — convenção do projeto)
    [Escola]                 INT                 NULL,
    [Rede]                   INT                 NULL,
    [AnoLetivo]              INT                 NULL,
    [Pessoa]                 INT                 NULL, -- aluno

    CONSTRAINT [PK_LogGeracaoDocumento]
        PRIMARY KEY CLUSTERED ([Id] ASC),

    CONSTRAINT [UQ_LogGeracaoDocumento_Hash]
        UNIQUE ([Hash]),

    CONSTRAINT [FK_LogGeracaoDocumento_Escola]
        FOREIGN KEY ([Escola])
        REFERENCES [dbo].[Escola] ([Id]),

    CONSTRAINT [FK_LogGeracaoDocumento_Rede]
        FOREIGN KEY ([Rede])
        REFERENCES [dbo].[Rede] ([Id]),

    CONSTRAINT [FK_LogGeracaoDocumento_AnoLetivo]
        FOREIGN KEY ([AnoLetivo])
        REFERENCES [dbo].[AnoLetivo] ([Id]),

    CONSTRAINT [FK_LogGeracaoDocumento_Pessoa]
        FOREIGN KEY ([Pessoa])
        REFERENCES [dbo].[Pessoa] ([Id])
);

CREATE INDEX [IX_LogGeracaoDocumento_Escola_DataInclusao]
    ON [dbo].[LogGeracaoDocumento] ([Escola], [DataInclusao]);
