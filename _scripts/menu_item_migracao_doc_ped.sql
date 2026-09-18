INSERT INTO MenuItem (
    MenuItemPai, Nome, IconeFontAwesome, Funcionalidade, Rota, TipoRota, Ordem,
    Desktop, Mobile, Hash, Ativo, UsuarioInclusao, DataInclusao,
    UsuarioUltimaAlteracao, DataUltimaAlteracao, UsuarioInativacao, DataInativacao,
    ViewModel, PrefixoDoModulo, RotaKO, PerfilAcesso, TipoRede, Fixo, NomeCurto
)
VALUES (
    343,                                                            -- MenuItemPai (Rotinas Acadêmicas)
    'Documentação Pedagógica (Novo)',                               -- Nome
    'fas fa-fw fa-tasks',                                           -- IconeFontAwesome (mesmo do item legado Id 337)
    4,                                                            -- Funcionalidade (Módulo Lançamento de Frequência)
    '/estrutura-pedagogica/documentacao-pedagogica/configuracoes',           -- Rota
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

