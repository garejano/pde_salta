-- estrutura-pedagogica: ajusta LogGeracaoDocumento (já criada via criar-tabela-log-geracao-documento.sql)
-- Implementado em backend/Scripts/alterar-tabela-log-geracao-documento-anoletivo-aluno.sql no repo estrutura-pedagogica
-- Escola e Rede passam a permitir NULL; adiciona FKs opcionais para AnoLetivo e Pessoa (aluno).

ALTER TABLE [dbo].[LogGeracaoDocumento] ALTER COLUMN [Escola] INT NULL;
ALTER TABLE [dbo].[LogGeracaoDocumento] ALTER COLUMN [Rede] INT NULL;

ALTER TABLE [dbo].[LogGeracaoDocumento] ADD [AnoLetivo] INT NULL;
ALTER TABLE [dbo].[LogGeracaoDocumento] ADD [Pessoa] INT NULL;

ALTER TABLE [dbo].[LogGeracaoDocumento]
    ADD CONSTRAINT [FK_LogGeracaoDocumento_AnoLetivo] FOREIGN KEY ([AnoLetivo]) REFERENCES [dbo].[AnoLetivo] ([Id]);

ALTER TABLE [dbo].[LogGeracaoDocumento]
    ADD CONSTRAINT [FK_LogGeracaoDocumento_Pessoa] FOREIGN KEY ([Pessoa]) REFERENCES [dbo].[Pessoa] ([Id]);
