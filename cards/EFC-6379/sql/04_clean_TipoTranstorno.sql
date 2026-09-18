-- EFC-6381: Limpeza da tabela TipoTranstorno
-- Usar quando a tabela já foi criada e populada com dados anteriores (seed de CIDs)
--   e precisa ser zerada antes de aplicar o 03_seed_TipoTranstorno.sql revisado.
-- Executar em: ElevaPortalHomolog
-- ATENÇÃO: nulifica AlunoNecessidadesEspeciais.TipoTranstorno antes de deletar.

-- Passo 1: Nulificar referências em AlunoNecessidadesEspeciais
--   (evita violação do FK FK_AlunoNecessidadesEspeciais_TipoTranstorno)
UPDATE [dbo].[AlunoNecessidadesEspeciais]
   SET [TipoTranstorno]     = NULL,
       [TipoTranstornoOutro] = NULL
 WHERE [TipoTranstorno] IS NOT NULL;

-- Passo 2: Deletar subitens primeiro (ParentId NOT NULL)
--   (evita violação do FK self-referencing FK_TipoTranstorno_Parent)
DELETE FROM [dbo].[TipoTranstorno] WHERE [ParentId] IS NOT NULL;

-- Passo 3: Deletar itens raiz
DELETE FROM [dbo].[TipoTranstorno] WHERE [ParentId] IS NULL;

-- Passo 4: Resetar identidade
DBCC CHECKIDENT ('[dbo].[TipoTranstorno]', RESEED, 0);
