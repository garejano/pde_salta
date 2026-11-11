-- EFC-7037: Remoção do código morto do "Painel do Aluno" e subfeatures descontinuadas.
--
-- Três itens de menu ativos apontam para viewmodels/controllers já removidos do código
-- (achado na revisão de PR #409 — análise "Claude Code"). O menu é montado a partir do
-- banco (tabela MenuItem), então quem tiver o perfil de acesso correspondente continua
-- vendo o item e a tela quebra ao abrir (Durandal não encontra o módulo).
--
-- Confirmado em homolog (ElevaPortalHomolog):
--
--   MenuItem.Id  Nome                                  Funcionalidade  Perfis com acesso
--   -----------  ------------------------------------  --------------  -----------------
--   35           Próximos Passos                       236             11  <- CRÍTICO, perfis reais
--   217          Alunos - Atendimentos e Comprometimento 41             0
--   230          Controle de Atendimento                225             0  (já identificado antes)
--
--   - Id 35 ("ProximosPassosAtendimento/index") é o mais urgente: 11 perfis de acesso têm
--     a Funcionalidade 236 habilitada, ou seja, usuários reais podem clicar no item hoje.
--     O viewmodel/controller correspondente (ProximosPassosAtendimentoManager e afins) foi
--     removido no passo 8 da remoção (limpeza de shell.js/Próximos Passos).
--   - Id 217 ("RelatoriosAtendimentos/ListagemRP") e Id 230 ("RelatorioControleAtendimento/index")
--     não têm nenhum perfil de acesso habilitado hoje — mas o MenuItem/Funcionalidade continuam
--     ativos no banco, então ficam "pendurados" sem necessidade.
--
-- Execução manual pelo responsável pelo banco (produção) — este script não deve ser
-- rodado via MCP/automação. Segue o padrão de soft-delete já usado nessas tabelas
-- (coluna Ativo + DataInativacao), não DELETE físico.
--
-- IMPORTANTE: os números de MenuItem/Funcionalidade acima são de HOMOLOGAÇÃO — conferir os
-- IDs equivalentes em produção antes de rodar (podem divergir).

UPDATE [dbo].[MenuItem]
SET [Ativo] = 0,
    [DataInativacao] = GETDATE()
WHERE [Id] IN (35, 217, 230);

UPDATE [dbo].[Funcionalidade]
SET [Ativo] = 0,
    [DataInativacao] = GETDATE()
WHERE [Id] IN (236, 41, 225);

-- Verificação pós-execução:
-- SELECT Id, Nome, Ativo, DataInativacao FROM MenuItem WHERE Id IN (35, 217, 230);
-- SELECT Id, Nome, Ativo, DataInativacao FROM Funcionalidade WHERE Id IN (236, 41, 225);

-- Rollback, se necessário:
-- UPDATE [dbo].[MenuItem] SET [Ativo] = 1, [DataInativacao] = NULL WHERE [Id] IN (35, 217, 230);
-- UPDATE [dbo].[Funcionalidade] SET [Ativo] = 1, [DataInativacao] = NULL WHERE [Id] IN (236, 41, 225);
