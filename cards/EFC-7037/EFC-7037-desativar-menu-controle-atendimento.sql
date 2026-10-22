-- EFC-7037: Remoção do código morto do "Painel do Aluno" e subfeatures descontinuadas.
--
-- O relatório "Controle de Atendimento" (ControleAtendimentoController +
-- Domain.PainelAluno.ControleAtendimentoManager) foi removido do código por depender
-- inteiramente de PainelAluno.RelatoriosService/ControleAtendimentoManager, já descontinuados.
--
-- Confirmado antes da remoção (homolog, ElevaPortalHomolog):
--   - MenuItem.Id = 230 ("Controle de Atendimento") está ativo e aponta para
--     Funcionalidade.Id = 225 ("Relatório Controle Atendimento").
--   - PerfilAcessoFuncionalidade não tem NENHUMA linha para Funcionalidade = 225 —
--     ou seja, nenhum perfil de acesso tem a tela habilitada hoje.
--   - Decisão do usuário: remover por completo (código + MenuItem + Funcionalidade),
--     já que a tela front-end também foi apagada (sem rota alcançável sem este MenuItem).
--
-- Execução manual pelo responsável pelo banco (produção) — este script não deve ser
-- rodado via MCP/automação. Segue o padrão de soft-delete já usado nessas tabelas
-- (coluna Ativo + DataInativacao), não DELETE físico.

UPDATE [dbo].[MenuItem]
SET [Ativo] = 0,
    [DataInativacao] = GETDATE()
WHERE [Id] = 230;

UPDATE [dbo].[Funcionalidade]
SET [Ativo] = 0,
    [DataInativacao] = GETDATE()
WHERE [Id] = 225;

-- Verificação pós-execução:
-- SELECT Id, Nome, Ativo, DataInativacao FROM MenuItem WHERE Id = 230;
-- SELECT Id, Nome, Ativo, DataInativacao FROM Funcionalidade WHERE Id = 225;

-- Rollback, se necessário:
-- UPDATE [dbo].[MenuItem] SET [Ativo] = 1, [DataInativacao] = NULL WHERE [Id] = 230;
-- UPDATE [dbo].[Funcionalidade] SET [Ativo] = 1, [DataInativacao] = NULL WHERE [Id] = 225;
