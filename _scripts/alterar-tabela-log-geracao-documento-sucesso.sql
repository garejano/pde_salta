-- estrutura-pedagogica: adiciona coluna Sucesso em LogGeracaoDocumento
-- Implementado em backend/Scripts/alterar-tabela-log-geracao-documento-sucesso.sql no repo estrutura-pedagogica
-- Diferencia geração concluída com sucesso de falha (relevante no fluxo de geração no backend).

ALTER TABLE [dbo].[LogGeracaoDocumento] ADD [Sucesso] BIT NOT NULL CONSTRAINT [DF_LogGeracaoDocumento_Sucesso] DEFAULT 1;
