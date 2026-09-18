-- EFC-6381: Carga inicial de TipoTranstorno — lista curada pela equipe pedagógica
-- Revisado: 2026-06-08 — lista definida pelo PO; subitens para TEA e TEAp
-- Executar APÓS 01_create_TipoTranstorno.sql
-- Executar em: ElevaPortalHomolog
-- Rollback: ver seção ao final

-- ============================================================
-- PASSO 1: Itens raiz (ParentId = NULL)
-- ============================================================
INSERT INTO [dbo].[TipoTranstorno] ([Hash], [Ativo], [Codigo], [Descricao], [ParentId], [Ordem]) VALUES
    (NEWID(), 1, 'TEA',    'TEA - Transtorno do Espectro Autista',                  NULL, 1),
    (NEWID(), 1, 'AHSD',   'AH/SD - Altas Habilidades/Superdotação',                NULL, 2),
    (NEWID(), 1, 'TDAH',   'TDAH - Transtorno do Déficit de Atenção com Hiperatividade', NULL, 3),
    (NEWID(), 1, 'TEAP',   'TEAp - Transtorno Específico da Aprendizagem',           NULL, 4),
    (NEWID(), 1, 'TAG',    'TAG - Transtorno de Ansiedade Generalizada',             NULL, 5),
    (NEWID(), 1, 'TOD',    'TOD - Transtorno Opositor Desafiador',                   NULL, 6),
    (NEWID(), 1, 'DI',     'DI - Deficiência Intelectual',                           NULL, 7),
    (NEWID(), 1, 'DF',     'DF - Deficiência Física',                                NULL, 8),
    (NEWID(), 1, 'DA',     'DA - Deficiência Auditiva',                              NULL, 9),
    (NEWID(), 1, 'DV',     'DV - Deficiência Visual',                                NULL, 10),
    (NEWID(), 1, 'DMU',    'DMu - Deficiência Múltipla',                             NULL, 11),
    (NEWID(), 1, 'TDL',    'TDL - Transtorno do Desenvolvimento da Linguagem',       NULL, 12),
    (NEWID(), 1, 'TPAC',   'TPAC - Transtorno do Processamento Auditivo Central',    NULL, 13),
    (NEWID(), 1, 'OUTROS', 'OUTROS',                                                 NULL, 14);

-- ============================================================
-- PASSO 2: Subitens de TEA
-- ============================================================
INSERT INTO [dbo].[TipoTranstorno] ([Hash], [Ativo], [Codigo], [Descricao], [ParentId], [Ordem])
SELECT NEWID(), 1, 'TEA-N1', 'TEA Nível 1', Id, 1 FROM [dbo].[TipoTranstorno] WHERE [Codigo] = 'TEA';

INSERT INTO [dbo].[TipoTranstorno] ([Hash], [Ativo], [Codigo], [Descricao], [ParentId], [Ordem])
SELECT NEWID(), 1, 'TEA-N2', 'TEA Nível 2', Id, 2 FROM [dbo].[TipoTranstorno] WHERE [Codigo] = 'TEA';

INSERT INTO [dbo].[TipoTranstorno] ([Hash], [Ativo], [Codigo], [Descricao], [ParentId], [Ordem])
SELECT NEWID(), 1, 'TEA-N3', 'TEA Nível 3', Id, 3 FROM [dbo].[TipoTranstorno] WHERE [Codigo] = 'TEA';

-- ============================================================
-- PASSO 3: Subitens de TEAp
-- ============================================================
INSERT INTO [dbo].[TipoTranstorno] ([Hash], [Ativo], [Codigo], [Descricao], [ParentId], [Ordem])
SELECT NEWID(), 1, 'TEAP-DIS', 'Dislexia',      Id, 1 FROM [dbo].[TipoTranstorno] WHERE [Codigo] = 'TEAP';

INSERT INTO [dbo].[TipoTranstorno] ([Hash], [Ativo], [Codigo], [Descricao], [ParentId], [Ordem])
SELECT NEWID(), 1, 'TEAP-DCA', 'Discalculia',   Id, 2 FROM [dbo].[TipoTranstorno] WHERE [Codigo] = 'TEAP';

INSERT INTO [dbo].[TipoTranstorno] ([Hash], [Ativo], [Codigo], [Descricao], [ParentId], [Ordem])
SELECT NEWID(), 1, 'TEAP-DGF', 'Disgrafia',     Id, 3 FROM [dbo].[TipoTranstorno] WHERE [Codigo] = 'TEAP';

INSERT INTO [dbo].[TipoTranstorno] ([Hash], [Ativo], [Codigo], [Descricao], [ParentId], [Ordem])
SELECT NEWID(), 1, 'TEAP-DOT', 'Disortografia', Id, 4 FROM [dbo].[TipoTranstorno] WHERE [Codigo] = 'TEAP';

-- Rollback:
-- DELETE FROM [dbo].[TipoTranstorno];
-- DBCC CHECKIDENT ('[dbo].[TipoTranstorno]', RESEED, 0);
