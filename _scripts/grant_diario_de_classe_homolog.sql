-- Concede acesso ao Diário de Classe (FuncionalidadeId = 203) para o usuário 1097334
-- (gustavoarejano.impulso@parceiro.gruposaltaedu.com)
-- Copia as redes/escolas da funcionalidade 68 (LancamentoFrequencia_VisaoCoordenacao)
--
-- Rodar em: ElevaPortalHomolog (belerofonte.eleva.local)

BEGIN TRANSACTION;

INSERT INTO ModuloAuth.UsuarioAcesso
    (Hash, UsuarioId, HashProduto, FuncionalidadeId, HashRede, RedeId, HashEscola, EscolaId, Ativo)
SELECT
    NEWID()                                         AS Hash,
    src.UsuarioId,
    src.HashProduto,
    203                                             AS FuncionalidadeId,
    src.HashRede,
    src.RedeId,
    src.HashEscola,
    src.EscolaId,
    src.Ativo
FROM ModuloAuth.UsuarioAcesso src
WHERE src.UsuarioId    = 1097334
  AND src.HashProduto  = '221A0CB4-DB9E-4AEF-BB59-96DBE7186A4A'
  AND src.FuncionalidadeId = 68
  AND NOT EXISTS (
      SELECT 1
      FROM   ModuloAuth.UsuarioAcesso dup
      WHERE  dup.UsuarioId         = src.UsuarioId
        AND  dup.HashProduto       = src.HashProduto
        AND  dup.FuncionalidadeId  = 203
        AND  dup.HashEscola        = src.HashEscola
  );

-- Conferir antes de commitar:
SELECT COUNT(*) AS LinhasInseridas
FROM ModuloAuth.UsuarioAcesso
WHERE UsuarioId = 1097334
  AND HashProduto = '221A0CB4-DB9E-4AEF-BB59-96DBE7186A4A'
  AND FuncionalidadeId = 203;

-- COMMIT;   -- Descomentar após confirmar a contagem
-- ROLLBACK; -- Usar se algo estiver errado
