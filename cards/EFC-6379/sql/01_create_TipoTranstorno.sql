-- EFC-6381: Criação da tabela TipoTranstorno (lista de necessidades com subitens)
-- Revisado: 2026-06-08 — hierarquia pai/filho conforme PO (TEA e TEAp têm subitens)
-- Executar em: ElevaPortalHomolog
-- Rollback: ver seção ao final

CREATE TABLE [dbo].[TipoTranstorno] (
    [Id]        INT              NOT NULL IDENTITY(1,1),
    [Hash]      UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    [Ativo]     BIT              NOT NULL DEFAULT 1,
    [Codigo]    NVARCHAR(20)     NOT NULL,   -- sigla/código interno (ex: TEA, TEA-N1, TEAP-DIS)
    [Descricao] NVARCHAR(500)    NOT NULL,
    [ParentId]  INT              NULL,       -- NULL = item raiz; preenchido = subitem
    [Ordem]     INT              NOT NULL DEFAULT 0,
    CONSTRAINT [PK_TipoTranstorno] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_TipoTranstorno_Hash]   UNIQUE ([Hash]),
    CONSTRAINT [UQ_TipoTranstorno_Codigo] UNIQUE ([Codigo]),
    CONSTRAINT [FK_TipoTranstorno_Parent] FOREIGN KEY ([ParentId])
        REFERENCES [dbo].[TipoTranstorno]([Id])
);

-- Rollback:
-- DROP TABLE [dbo].[TipoTranstorno];
