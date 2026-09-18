-- ============================================================
-- Correção: RA duplicado no ciclo EFC-6732
-- --------------------------------------------------------------
-- O que aconteceu: gerar_ra_impulso.py foi rodado com --ra-start
-- 90929601, mas esse RA já pertencia a um aluno do ciclo anterior
-- (EFC-6517 — EMILY GABRIELI BUENO CORDEIRO DE PAULA). Como o script
-- verifica idempotência por (Nome + temp), não por temp isolado, ele
-- criou um SEGUNDO Pessoa com o mesmo RA '90929601' em vez de detectar
-- a colisão. O correto seria --ra-start 90929602 — só o primeiro aluno
-- da leva do EFC-6732 nasceu com o RA errado; os demais (90929602 em
-- diante) já são únicos e corretos, NÃO tocar neles.
--
-- Correção: mover só esse um aluno (o de EFC-6732, não a EMILY) para
-- o próximo RA livre real: 90929754 (90929601 + 153 alunos do ciclo).
-- ============================================================


-- ============================================================
-- PASSO 1 — Diagnóstico (SOMENTE LEITURA). Rodar primeiro e conferir
-- ============================================================

-- 1a. Confirmar que existem DUAS pessoas com esse RA hoje
SELECT p.Id AS PessoaId, p.Nome, p.temp, p.CriacaoData, p.CriacaoUsuario
FROM Pessoa p
WHERE p.temp = '90929601'
ORDER BY p.CriacaoData;
-- Esperado: 2 linhas — uma é EMILY GABRIELI BUENO CORDEIRO DE PAULA
-- (CriacaoData mais antiga, do EFC-6517) e a outra é o aluno do
-- EFC-6732 (CriacaoData mais recente, ~data em que você rodou o SQL
-- deste ciclo). ANOTAR o PessoaId e o Nome do aluno do EFC-6732 —
-- é esse (e só esse) que vamos corrigir no Passo 2.

-- 1b. Confirmar que 90929754 está realmente livre antes de usá-lo
SELECT COUNT(*) AS deve_ser_zero
FROM Pessoa
WHERE temp = '90929754';

-- 1c. Ver a cadeia completa do aluno errado (ajustar @PessoaId abaixo
-- com o valor encontrado no Passo 1a antes de rodar)
DECLARE @PessoaId INT = 0; -- <<< SUBSTITUIR pelo PessoaId do aluno do EFC-6732 (não o da EMILY)

SELECT
    pe.Id   AS PessoaId,   pe.Nome,             pe.temp AS PessoaTemp,
    pesc.Id AS PessoaEscolaId, pesc.Escola,     pesc.Matricula,
    pea.Id  AS PessoaEscolaAcessoId,            pea.temp AS AcessoTemp,
    ae.AlunoEscola_key,                          ae.Matricula AS AlunoEscolaMatricula, ae.Turma
FROM Pessoa pe
INNER JOIN PessoaEscola pesc        ON pesc.Pessoa = pe.Id
INNER JOIN PessoaEscolaAcesso pea   ON pea.PessoaEscola = pesc.Id
INNER JOIN AlunoEscola ae           ON ae.AlunoEscola_key = pea.Id
WHERE pe.Id = @PessoaId;
-- Esperado: exatamente 1 linha. Se vier vazio ou mais de 1, PARAR —
-- algo está diferente do esperado e o Passo 2 não deve ser rodado
-- sem entender por quê.


-- ============================================================
-- PASSO 2 — Correção (dentro de transação, só COMMIT após conferir)
-- Ajustar @PessoaId de novo aqui com o mesmo valor confirmado acima
-- ============================================================
BEGIN TRAN;

DECLARE @PessoaIdCorrigir INT = 0; -- <<< SUBSTITUIR (mesmo valor do Passo 1c)
DECLARE @RaNovo NVARCHAR(20) = '90929754';

UPDATE ae
SET ae.Matricula = @RaNovo
FROM AlunoEscola ae
INNER JOIN PessoaEscolaAcesso pea ON pea.Id = ae.AlunoEscola_key
INNER JOIN PessoaEscola pesc      ON pesc.Id = pea.PessoaEscola
WHERE pesc.Pessoa = @PessoaIdCorrigir;

UPDATE pea
SET pea.temp = @RaNovo
FROM PessoaEscolaAcesso pea
INNER JOIN PessoaEscola pesc ON pesc.Id = pea.PessoaEscola
WHERE pesc.Pessoa = @PessoaIdCorrigir;

UPDATE pesc
SET pesc.Matricula = @RaNovo
FROM PessoaEscola pesc
WHERE pesc.Pessoa = @PessoaIdCorrigir;

UPDATE pe
SET pe.temp = @RaNovo
FROM Pessoa pe
WHERE pe.Id = @PessoaIdCorrigir;

-- --------------------------------------------------------------
-- PASSO 3 — Verificar ANTES de decidir COMMIT ou ROLLBACK
-- --------------------------------------------------------------
SELECT p.Id, p.Nome, p.temp
FROM Pessoa p
WHERE p.temp IN ('90929601', '90929754')
ORDER BY p.temp;
-- Esperado agora: 1 linha com temp = '90929601' (EMILY, intocada) e
-- 1 linha com temp = '90929754' (o aluno do EFC-6732, corrigido).
-- Se bater exatamente com isso:
--   COMMIT;
-- Se qualquer coisa parecer errada (mais/menos linhas, nome errado):
--   ROLLBACK;

-- COMMIT;
-- ROLLBACK;


-- ============================================================
-- PASSO 4 — Confirmação pós-COMMIT (rodar numa aba/conexão nova,
-- sem transação — só leitura)
-- ============================================================

-- 4a. Checagem geral: nenhum RA (temp) duplicado entre pessoas distintas
SELECT p.temp, COUNT(*) AS Qtd
FROM Pessoa p
WHERE p.temp LIKE '909%' AND ISNUMERIC(p.temp) = 1
GROUP BY p.temp
HAVING COUNT(*) > 1;
-- Esperado: 0 linhas. Se vier alguma linha, ainda há RA duplicado
-- (pode ser este caso não totalmente corrigido, ou um outro
-- problema não relacionado).

-- 4b. Cadeia do aluno corrigido — tudo deve estar com o RA novo
SELECT
    pe.Id AS PessoaId, pe.Nome, pe.temp AS PessoaTemp,
    pesc.Id AS PessoaEscolaId, pesc.Matricula AS PessoaEscolaMatricula, pesc.Escola,
    pea.Id AS PessoaEscolaAcessoId, pea.temp AS AcessoTemp,
    ae.AlunoEscola_key, ae.Matricula AS AlunoEscolaMatricula, ae.Turma, ae.Status
FROM Pessoa pe
INNER JOIN PessoaEscola pesc      ON pesc.Pessoa = pe.Id
INNER JOIN PessoaEscolaAcesso pea ON pea.PessoaEscola = pesc.Id
INNER JOIN AlunoEscola ae         ON ae.AlunoEscola_key = pea.Id
WHERE pe.temp = '90929754';
-- Esperado: exatamente 1 linha, com PessoaTemp = PessoaEscolaMatricula
-- = AcessoTemp = AlunoEscolaMatricula = '90929754' (os 4 valores
-- batendo entre si — se algum ficou diferente, o UPDATE não
-- atualizou tudo corretamente).

-- 4c. Confirmar que a EMILY (RA original) ficou intocada
SELECT p.Id, p.Nome, p.temp
FROM Pessoa p
WHERE p.temp = '90929601';
-- Esperado: exatamente 1 linha, Nome = EMILY GABRIELI BUENO CORDEIRO DE PAULA
