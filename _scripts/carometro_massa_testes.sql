/*
  Massa de Testes — Carômetro (lista-presença)
  Repositório: estrutura-pedagogica
  Rota: lancamento-frequencia/lista-presenca

  Regra de exibição do responsável no card do aluno:
    1. Responsável Pedagógico  → exibe dados do pedagógico  (label "Responsável pedagógico")
    2. Sem pedagógico          → fallback para financeiro    (label "Responsável financeiro")
    3. Sem nenhum              → exibe "N/A"

  Origem do dado no banco: AlunoEscola.ResponsavelPedagogicoPessoa / .ResponsavelFinanceiroPessoa
  View de consulta: ViewAlunoContato (colunas NomePedagogico, NomeFinanceiro)
*/

/* ======================================================================
   SEÇÃO 1 — CANDIDATOS NATURAIS (já existem no banco, não precisam de UPDATE)
   ====================================================================== */

/*
  CASO 1 — Sem responsável pedagógico, COM responsável financeiro
  -----------------------------------------------------------------------
  AlunoEscola_key : 5613379
  Matrícula       : 26452291
  Escola Id/Hash  : 120 / E23BB4D1-9BF3-4982-8687-74CF6BFC19CA
  Turma           : "1ª série A - M"
  Turma Hash      : BF5D01C5-90E2-49B8-8156-1BF126A9441C
  Série Id        : 2
  Status          : Matriculado
*/
SELECT
    IdAlunoEscola, NomeAluno, Matricula, NomeTurma,
    NomePedagogico, TelefoneCelularPedagogico, EmailPedagogico,
    NomeFinanceiro, TelefoneCelularFinanceiro, EmailFinanceiro,
    StatusAluno
FROM ViewAlunoContato
WHERE IdAlunoEscola = 5613379
  AND IdAnoLetivo   = 2026;

/*
  CASO 2 — SEM responsável pedagógico E SEM responsável financeiro
  -----------------------------------------------------------------------
  AlunoEscola_key : 5651729
  Matrícula       : 26455216
  Escola Id/Hash  : 95 / 10EBF7DF-4242-4242-90F4-99501415B863
  Turma           : "8º ano B - M"
  Turma Hash      : 1F4B401B-083B-43BD-AEE1-09A1A4FCE77B
  Série Id        : 21
  Status          : Matriculado
*/
SELECT
    IdAlunoEscola, NomeAluno, Matricula, NomeTurma,
    NomePedagogico, TelefoneCelularPedagogico, EmailPedagogico,
    NomeFinanceiro, TelefoneCelularFinanceiro, EmailFinanceiro,
    StatusAluno
FROM ViewAlunoContato
WHERE IdAlunoEscola = 5651729
  AND IdAnoLetivo   = 2026;

/*
  BASELINE — Aluno com AMBOS os responsáveis (referência)
  -----------------------------------------------------------------------
  AlunoEscola_key              : 5563219
  Matrícula                    : 19213739
  Escola Id/Hash               : 202 / 316198D7-536D-445E-B8D0-101B463A8039
  Turma                        : "9º ano B - M"
  Turma Hash                   : 14D20648-04DE-4153-A684-D6E97967638E
  Série Id                     : 22
  ResponsavelPedagogicoPessoa  : 396976
  ResponsavelFinanceiroPessoa  : 221681
  Status                       : Matriculado
*/
SELECT
    IdAlunoEscola, NomeAluno, Matricula, NomeTurma,
    NomePedagogico, TelefoneCelularPedagogico, EmailPedagogico,
    NomeFinanceiro, TelefoneCelularFinanceiro, EmailFinanceiro,
    StatusAluno
FROM ViewAlunoContato
WHERE IdAlunoEscola = 5563219
  AND IdAnoLetivo   = 2026;


/* ======================================================================
   SEÇÃO 2 — QUERIES DE VALIDAÇÃO GENÉRICA
   Verificar estado atual de qualquer aluno antes/depois de alteração
   ====================================================================== */

SELECT
    ae.AlunoEscola_key,
    ae.Matricula,
    ae.Status,
    ae.ResponsavelPedagogicoPessoa,
    ae.ResponsavelFinanceiroPessoa
FROM AlunoEscola ae
WHERE ae.AlunoEscola_key = 5563219;  -- trocar pelo key desejado


/* ======================================================================
   SEÇÃO 3 — ALTERAÇÃO DE RESPONSÁVEL (usar aluno BASELINE: key 5563219)
   Executar no banco de homologação apenas.
   ====================================================================== */

/* --- 3A. Simular CASO 1: remover pedagógico, manter financeiro --- */

-- Antes: anotar estado original
SELECT AlunoEscola_key, ResponsavelPedagogicoPessoa, ResponsavelFinanceiroPessoa
FROM AlunoEscola
WHERE AlunoEscola_key = 5563219;

-- Alterar
UPDATE AlunoEscola
SET ResponsavelPedagogicoPessoa = NULL
WHERE AlunoEscola_key = 5563219;

-- Validar resultado na view
SELECT IdAlunoEscola, NomeAluno, NomePedagogico, NomeFinanceiro
FROM ViewAlunoContato
WHERE IdAlunoEscola = 5563219 AND IdAnoLetivo = 2026;

-- Reverter (restaurar valor original)
UPDATE AlunoEscola
SET ResponsavelPedagogicoPessoa = 396976
WHERE AlunoEscola_key = 5563219;


/* --- 3B. Simular CASO 2: remover ambos os responsáveis --- */

-- Antes: anotar estado original
SELECT AlunoEscola_key, ResponsavelPedagogicoPessoa, ResponsavelFinanceiroPessoa
FROM AlunoEscola
WHERE AlunoEscola_key = 5563219;

-- Alterar
UPDATE AlunoEscola
SET ResponsavelPedagogicoPessoa = NULL,
    ResponsavelFinanceiroPessoa  = NULL
WHERE AlunoEscola_key = 5563219;

-- Validar resultado na view
SELECT IdAlunoEscola, NomeAluno, NomePedagogico, NomeFinanceiro
FROM ViewAlunoContato
WHERE IdAlunoEscola = 5563219 AND IdAnoLetivo = 2026;

-- Reverter (restaurar valores originais)
UPDATE AlunoEscola
SET ResponsavelPedagogicoPessoa = 396976,
    ResponsavelFinanceiroPessoa  = 221681
WHERE AlunoEscola_key = 5563219;


/* ======================================================================
   SEÇÃO 4 — ALTERAR RESPONSÁVEL DE QUALQUER ALUNO (template genérico)
   ====================================================================== */

-- Definir responsável pedagógico
UPDATE AlunoEscola
SET ResponsavelPedagogicoPessoa = {IdPessoa}   -- ex: 396976
WHERE AlunoEscola_key = {AlunoEscola_key};

-- Remover responsável pedagógico
UPDATE AlunoEscola
SET ResponsavelPedagogicoPessoa = NULL
WHERE AlunoEscola_key = {AlunoEscola_key};

-- Definir responsável financeiro
UPDATE AlunoEscola
SET ResponsavelFinanceiroPessoa = {IdPessoa}
WHERE AlunoEscola_key = {AlunoEscola_key};

-- Remover responsável financeiro
UPDATE AlunoEscola
SET ResponsavelFinanceiroPessoa = NULL
WHERE AlunoEscola_key = {AlunoEscola_key};
