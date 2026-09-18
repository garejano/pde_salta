-- MenuItem: Lançamento de Frequência (Novo)
-- Gerado em: 2026-05-20
-- Rota Angular: /estrutura-pedagogica/lancamento-frequencia/listar
-- "(Novo)" no nome pois já existe "Lançamento de Frequência" em outro módulo (Id 337 → /frequencia/, Id 172 → /ped/#Frequencia)
-- MenuItemPai 329 = "Rotinas Acadêmicas" (TipoRota 0, grupo raiz)
-- Funcionalidade 422 = "Módulo Lançamento de Frequência" (mesma do item legado Id 337)

INSERT INTO MenuItem (
    MenuItemPai, Nome, IconeFontAwesome, Funcionalidade, Rota, TipoRota, Ordem,
    Desktop, Mobile, Hash, Ativo, UsuarioInclusao, DataInclusao,
    UsuarioUltimaAlteracao, DataUltimaAlteracao, UsuarioInativacao, DataInativacao,
    ViewModel, PrefixoDoModulo, RotaKO, PerfilAcesso, TipoRede, Fixo, NomeCurto
)
VALUES (
    329,                                                            -- MenuItemPai (Rotinas Acadêmicas)
    'Lançamento de Frequência (Novo)',                              -- Nome
    'fas fa-fw fa-tasks',                                           -- IconeFontAwesome (mesmo do item legado Id 337)
    422,                                                            -- Funcionalidade (Módulo Lançamento de Frequência)
    '/estrutura-pedagogica/lancamento-frequencia/listar',           -- Rota
    1,                                                              -- TipoRota (1 = Angular SPA)
    17,                                                             -- Ordem (próxima disponível sob 329)
    1,                                                              -- Desktop
    1,                                                              -- Mobile
    NEWID(),                                                        -- Hash
    1,                                                              -- Ativo (começa ativo)
    1097334,                                                        -- UsuarioInclusao (Gustavo)
    GETDATE(),                                                      -- DataInclusao
    NULL,                                                           -- UsuarioUltimaAlteracao
    NULL,                                                           -- DataUltimaAlteracao
    NULL,                                                           -- UsuarioInativacao
    NULL,                                                           -- DataInativacao
    NULL,                                                           -- ViewModel
    '/estrutura-pedagogica',                                        -- PrefixoDoModulo
    NULL,                                                           -- RotaKO
    NULL,                                                           -- PerfilAcesso
    NULL,                                                           -- TipoRede
    0,                                                              -- Fixo
    NULL                                                            -- NomeCurto
);



