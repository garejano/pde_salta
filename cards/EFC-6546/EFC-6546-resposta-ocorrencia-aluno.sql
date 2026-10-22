-- EFC-6546: Correção de bug reportado em produção (2026-10-05, Slack) — a pergunta do Norteador do
-- Motivo "Comportamento Inadequado" ("ii. Qual o comportamento inadequado que levou ao atendimento?")
-- aparecia sempre desabilitada. Causa: TipoQuestaoAtendimento = Ocorrencias (9) nunca tinha opções
-- estáticas cadastradas (pergunta.opcoes vinha sempre vazio do backend) nem opções carregadas
-- dinamicamente.
--
-- Confirmado contra o comportamento original do monolito legado portal-atlas
-- (AtendimentoPainelManager/FormularioAtendimentoResposta.RespostaOcorrencia,
-- Eleva.Portal/PainelAluno):
--   1) as opções são o CATÁLOGO de Ocorrências cadastradas para a combinação Rede/Série/Ano Letivo
--      (tabela Ocorrencia — mesma fonte usada pelo dropdown "Nova Ocorrência" em
--      OcorrenciasGetService.GetOpcoes), não as ocorrências já registradas do aluno (AlunoOcorrencia);
--   2) é SELEÇÃO ÚNICA (um <select> comum no legado, sem multiple="multiple") — por isso o campo é
--      escalar direto na linha-pai (FormularioAtendimentoResposta), igual a RespostaBit/RespostaTexto/
--      RespostaInteiro, e não um registro filho em FormularioAtendimentoRespostaOpcao (que é o padrão
--      usado para perguntas de seleção MÚLTIPLA, como Disciplinas do Aluno).

ALTER TABLE [dbo].[FormularioAtendimentoResposta]
    ADD [RespostaOcorrencia] INT NULL;

ALTER TABLE [dbo].[FormularioAtendimentoResposta]
    ADD CONSTRAINT [FK_FormularioAtendimentoResposta.RespostaOcorrencia]
    FOREIGN KEY ([RespostaOcorrencia]) REFERENCES [dbo].[Ocorrencia] ([Id]);

-- Verificação pós-execução:
-- SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
-- WHERE TABLE_NAME = 'FormularioAtendimentoResposta' AND COLUMN_NAME = 'RespostaOcorrencia';

-- Rollback, se necessário:
-- ALTER TABLE [dbo].[FormularioAtendimentoResposta] DROP CONSTRAINT [FK_FormularioAtendimentoResposta.RespostaOcorrencia];
-- ALTER TABLE [dbo].[FormularioAtendimentoResposta] DROP COLUMN [RespostaOcorrencia];
