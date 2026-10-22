-- EFC-6546: Rollback do desenho ABANDONADO do campo "Ocorrencias" do Norteador.
--
-- Contexto: a primeira versão da correção modelou a resposta como seleção MÚLTIPLA, com um
-- registro filho em FormularioAtendimentoRespostaOpcao (RespostaOcorrencia -> Ocorrencia), no
-- mesmo padrão de RespostaDisciplinaAluno. Comparando com o comportamento original do monolito
-- legado (portal-atlas), descobrimos que esse tipo de pergunta é SELEÇÃO ÚNICA (um <select> comum,
-- sem multiple="multiple") e a resposta fica como campo escalar direto na linha-pai
-- (FormularioAtendimentoResposta.RespostaOcorrencia) — não um registro filho.
--
-- O desenho correto já foi aplicado via EFC-6546-resposta-ocorrencia-aluno.sql (coluna em
-- FormularioAtendimentoResposta). Este script remove a coluna/FK órfã criada pelo desenho anterior
-- em FormularioAtendimentoRespostaOpcao, que o código não usa mais.
--
-- ATENÇÃO: em homolog, há 4 linhas com valor preenchido nessa coluna (dados de teste da janela em
-- que o desenho multi-seleção esteve ativo) — serão perdidas ao rodar este script. Confirmado que
-- é dado de teste, não produção (nenhum fluxo em produção chegou a usar esse desenho).
--
-- Verificação recomendada antes de rodar (opcional, só para registro):
-- SELECT * FROM [dbo].[FormularioAtendimentoRespostaOpcao] WHERE RespostaOcorrencia IS NOT NULL;

ALTER TABLE [dbo].[FormularioAtendimentoRespostaOpcao]
    DROP CONSTRAINT [FK_FormularioAtendimentoRespostaOpcao.RespostaOcorrencia];

ALTER TABLE [dbo].[FormularioAtendimentoRespostaOpcao]
    DROP COLUMN [RespostaOcorrencia];

-- Verificação pós-execução — deve retornar 0 linhas:
-- SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
-- WHERE TABLE_NAME = 'FormularioAtendimentoRespostaOpcao' AND COLUMN_NAME = 'RespostaOcorrencia';
