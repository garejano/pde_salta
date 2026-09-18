-- EFC-6515 — Modularização da Matriz Curricular
-- MenuItem: nova rota Angular /estrutura-pedagogica/matriz-curricular/listar
-- Gerado em: 2026-06-25
--
-- Contexto:
--   MenuItemPai = 343 (grupo Estrutura Pedagógica)
--   Funcionalidade = 49 (já existe — 'Cadastro de Matriz Curricular')
--   Ordem = 36 (próxima disponível após Id=787 'Itinerário Formativo' em Ordem=35)
--   TipoRota = 1 (Angular)
--   Ativo = 0 (ativar após validar em produção)
--
-- Nota: existe item legado Id=631 'Cadastro de Matriz Curricular' em Ordem=25
--   apontando para '/ped/#Cadastros/MatrizCurricular' — este script NÃO o altera.
--   Desativar o item legado quando a nova funcionalidade estiver homologada.
--
-- Verificar se a rota já existe antes de executar:
-- SELECT Id, Nome, Ativo FROM MenuItem WHERE Rota = '/estrutura-pedagogica/matriz-curricular/listar';

INSERT INTO MenuItem (
    Hash,
    Nome,
    Rota,
    RotaKO,
    ViewModel,
    MenuItemPai,
    Ordem,
    FuncionalidadeId,
    TipoRota,
    Desktop,
    Mobile,
    Fixo,
    Ativo,
    UsuarioInclusao,
    DataInclusao
)
VALUES (
    NEWID(),                                                    -- Hash
    'Matriz Curricular',                                        -- Nome
    '/estrutura-pedagogica/matriz-curricular/listar',           -- Rota
    NULL,                                                       -- RotaKO
    NULL,                                                       -- ViewModel
    343,                                                        -- MenuItemPai (Estrutura Pedagógica)
    36,                                                         -- Ordem
    49,                                                         -- FuncionalidadeId (Cadastro de Matriz Curricular)
    1,                                                          -- TipoRota (Angular)
    1,                                                          -- Desktop
    1,                                                          -- Mobile
    0,                                                          -- Fixo
    0,                                                          -- Ativo (ativar após validação)
    1097334,                                                    -- UsuarioInclusao
    GETDATE()                                                   -- DataInclusao
);

-- Após validar o Id gerado, ativar com:
-- UPDATE MenuItem SET Ativo = 1 WHERE Id = SCOPE_IDENTITY();

-- Após homologar a nova rota Angular, desativar o item legado:
-- UPDATE MenuItem SET Ativo = 0 WHERE Id = 631; -- 'Cadastro de Matriz Curricular' (/ped/#Cadastros/MatrizCurricular)
