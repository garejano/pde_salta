-- EFC-6381: Adiciona ParentId e Ordem na tabela TipoTranstorno já existente
-- Executar APÓS 04_clean_TipoTranstorno.sql (dados limpos)
-- Executar ANTES de 03_seed_TipoTranstorno.sql (novo seed)
-- Executar em: ElevaPortalHomolog
-- Rollback: ver seção ao final

-- Passo 1: Adicionar coluna ParentId (nullable, sem FK por enquanto)
ALTER TABLE [dbo].[TipoTranstorno]
    ADD [ParentId] INT NULL;

-- Passo 2: Adicionar coluna Ordem
ALTER TABLE [dbo].[TipoTranstorno]
    ADD [Ordem] INT NOT NULL DEFAULT 0;

-- Passo 3: Adicionar FK self-referencing
ALTER TABLE [dbo].[TipoTranstorno]
    ADD CONSTRAINT [FK_TipoTranstorno_Parent]
        FOREIGN KEY ([ParentId]) REFERENCES [dbo].[TipoTranstorno]([Id]);

-- Rollback:
-- ALTER TABLE [dbo].[TipoTranstorno] DROP CONSTRAINT [FK_TipoTranstorno_Parent];
-- ALTER TABLE [dbo].[TipoTranstorno] DROP COLUMN [ParentId], [Ordem];
