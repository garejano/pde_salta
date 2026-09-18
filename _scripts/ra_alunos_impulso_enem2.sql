-- ============================================================
-- Script gerado por gerar_ra_impulso_enem2.py
-- Ambiente: producao  |  CSV: 2026-06-25_to_ra_manual_producao.csv
-- AnoLetivo: 2026  |  RA inicial: 90929601
-- Queries idempotentes — podem ser reexecutadas com segurança
-- ============================================================


-- --------------------------------------------------------
-- Escola: GENESIO MORESCHI, C E-EF M  (Id=2377)
-- --------------------------------------------------------

-- EMILY GABRIELI BUENO CORDEIRO DE PAULA | RA: 90929601 | 3ª Série Regular A - N (Id=297935)
INSERT INTO Pessoa (Nome, temp, CriacaoUsuario, CriacaoData, Ativo) SELECT 'EMILY GABRIELI BUENO CORDEIRO DE PAULA', '90929601', x.Id, GetDate(), 1 FROM Usuario AS x LEFT JOIN Pessoa AS Pe ON Pe.Nome = 'EMILY GABRIELI BUENO CORDEIRO DE PAULA' AND Pe.temp = '90929601' WHERE x.Id = 1 AND Pe.Id IS null;
INSERT INTO Usuario (Pessoa, UsuarioInclusao, DataInclusao, Ativo) SELECT Pe.Id, x.Id, GetDate(), 1 FROM Usuario AS x INNER JOIN Pessoa AS Pe ON Pe.Nome = 'EMILY GABRIELI BUENO CORDEIRO DE PAULA' AND Pe.temp = '90929601' LEFT JOIN Usuario AS Us ON Us.Pessoa = Pe.Id WHERE x.Id = 1 AND Us.Id IS null;
INSERT INTO PessoaEscola (Pessoa, Escola, Matricula, CriacaoUsuario, CriacaoData, Ativo) SELECT Pe.Id, 2377, '90929601', x.Id, GetDate(), 1 FROM Usuario AS x INNER JOIN Pessoa AS Pe ON Pe.Nome = 'EMILY GABRIELI BUENO CORDEIRO DE PAULA' AND Pe.temp = '90929601' INNER JOIN Usuario AS Us ON Us.Pessoa = Pe.Id LEFT JOIN PessoaEscola AS PeEs ON PeEs.Pessoa = Pe.Id AND PeEs.Escola = 2377 AND PeEs.Matricula = Pe.temp WHERE x.Id = 1 AND PeEs.Id IS null;
INSERT INTO PessoaEscolaAcesso (PessoaEscola, PerfilAcesso, temp, CriacaoUsuario, CriacaoData, Ativo) SELECT PeEs.Id, 1, '90929601', x.Id, GetDate(), 1 FROM Usuario AS x INNER JOIN Pessoa AS Pe ON Pe.Nome = 'EMILY GABRIELI BUENO CORDEIRO DE PAULA' AND Pe.temp = '90929601' INNER JOIN Usuario AS Us ON Us.Pessoa = Pe.Id INNER JOIN PessoaEscola AS PeEs ON PeEs.Pessoa = Pe.Id AND PeEs.Escola = 2377 AND PeEs.Matricula = Pe.temp LEFT JOIN PessoaEscolaAcesso AS PeEsAc ON PeEsAc.PessoaEscola = PeEs.Id AND PeEsAc.temp = Pe.temp AND PeEsAc.PerfilAcesso = 1 WHERE x.Id = 1 AND PeEsAc.Id IS null;
INSERT INTO AlunoEscola (AlunoEscola_key, Matricula, AnoLetivo, Turma, Status) SELECT PeEsAc.Id, '90929601', 2026, 297935, 'Matriculado' FROM Usuario AS x INNER JOIN Pessoa AS Pe ON Pe.Nome = 'EMILY GABRIELI BUENO CORDEIRO DE PAULA' AND Pe.temp = '90929601' INNER JOIN Usuario AS Us ON Us.Pessoa = Pe.Id INNER JOIN PessoaEscola AS PeEs ON PeEs.Pessoa = Pe.Id AND PeEs.Escola = 2377 AND PeEs.Matricula = Pe.temp INNER JOIN PessoaEscolaAcesso AS PeEsAc ON PeEsAc.PessoaEscola = PeEs.Id AND PeEsAc.temp = Pe.temp AND PeEsAc.PerfilAcesso = 1 LEFT JOIN AlunoEscola AS AlEs ON AlEs.AlunoEscola_key = PeEsAc.Id WHERE x.Id = 1 AND AlEs.AlunoEscola_key IS null;