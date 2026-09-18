-- EFC-6515: corrige nomes de colunas de auditoria em RedeSerieDisciplinaEscola
-- Causa: o script original de criação da tabela (Fase 2 do plano técnico) usou
-- sufixo "Id" nas colunas de auditoria, mas a convenção do EF Core no projeto
-- (MapperExtensions.HasState, aplicado via builder.IsStatefulEntity()) mapeia
-- UsuarioInclusaoId/UsuarioUltimaAlteracaoId/UsuarioInativacaoId para colunas
-- SEM o sufixo "Id" — mesmo padrão de RedeSerieDisciplina, CargaHoraria, etc.
-- Rodar contra o banco onde a tabela já foi criada com os nomes errados.

EXEC sp_rename 'RedeSerieDisciplinaEscola.UsuarioInclusaoId', 'UsuarioInclusao', 'COLUMN';
EXEC sp_rename 'RedeSerieDisciplinaEscola.UsuarioUltimaAlteracaoId', 'UsuarioUltimaAlteracao', 'COLUMN';
EXEC sp_rename 'RedeSerieDisciplinaEscola.UsuarioInativacaoId', 'UsuarioInativacao', 'COLUMN';
