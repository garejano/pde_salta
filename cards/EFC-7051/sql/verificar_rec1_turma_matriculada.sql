-- EFC-7051 — verifica se a turma matriculada (vínculo atual) do aluno tem
-- a REC1 (1ª recuperação) preenchida por disciplina. Útil para confirmar se
-- a MTF1 (pós-recuperação) deveria mesmo existir para aquele aluno.
--
-- Troque '25428629' pela matrícula (RA) desejada.

SELECT a.Matricula AS RA, a.Status, t.NomeTurma, t.IdEscolaSerie,
       av.NomeDisciplinaMae, av.SiglaTipoAvaliacao, n.Nota, n.DataUltimaAtualizacao
FROM rel.BaseDeAlunos a
JOIN rel.BaseDeTurmas t ON t.Id = a.BaseDeTurmas
JOIN rel.BaseDeNotas n ON n.BaseDeAlunos = a.Id
JOIN rel.BaseDeAvaliacoes av ON av.Id = n.BaseDeAvaliacoes
WHERE a.Matricula = '25428629'
  AND a.Status = 'Matriculado'          -- só a turma atual (vínculo matriculado), ignora vínculos antigos/transferidos
  AND av.SiglaTipoAvaliacao = 'REC1'
ORDER BY av.NomeDisciplinaMae;
