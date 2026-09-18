-- EFC-6515 — Modularização da Matriz Curricular
-- Funcionalidade Id=49 (MatrizCurricular)
-- Gerado em: 2026-06-25
--
-- ATENÇÃO: Funcionalidade Id=49 já existe em homologação com Nome='Cadastro de Matriz Curricular'
-- e Ativo=1. Verificar se o mesmo é verdade em produção antes de executar este script.
-- Se já existir, NÃO executar — apenas confirmar que o Nome e Ativo estão corretos.

-- Verificar antes de executar:
-- SELECT Id, Nome, Ativo FROM Funcionalidade WHERE Id = 49;

-- Executar apenas se Id=49 NÃO existir:
INSERT INTO Funcionalidade (Id, Nome)
VALUES (49, 'Cadastro de Matriz Curricular');
