-- EFC-6546: Redesenho da aba Atendimento do Painel do Aluno
-- Adiciona uma flag dedicada em TipoPublicoAtendido para decidir quando o formulário exige o
-- campo "Nome do Profissional" (texto livre) em vez de "Responsável(eis) Atendido(s)" — CA-03/CA-24.
-- Substitui a comparação de texto contra [Nome] (AtendimentoConstants.TipoPublicoAtendidoProfissionalDeSaudeParticular
-- no backend / TIPO_PUBLICO_PROFISSIONAL_SAUDE_PARTICULAR no frontend), que se mostrou frágil: bug
-- relatado em produção (2026-08-11) — o campo Responsável(eis) Atendido(s) continuava visível mesmo
-- com "Profissional de Saúde Particular" selecionado, indicando que a comparação de string não bate
-- exatamente com o texto real cadastrado (espaço/acentuação/variação de cadastro).

ALTER TABLE [dbo].[TipoPublicoAtendido]
    ADD [ExigeNomeProfissional] BIT NOT NULL DEFAULT 0;

-- Melhor esforço: marca a linha "Profissional de Saúde Particular" pelo texto atual do cadastro.
-- IMPORTANTE — verificação obrigatória após rodar este UPDATE (ver query abaixo): deve haver
-- EXATAMENTE 1 linha com ExigeNomeProfissional = 1, e essa linha deve ser a de "Profissional de
-- Saúde Particular". Se vier 0 ou mais de 1 linha, o texto do WHERE abaixo não bate com o
-- cadastro real — corrigir manualmente por [Id] (UPDATE ... WHERE Id = <id correto>) antes de
-- considerar esta migração concluída.
UPDATE [dbo].[TipoPublicoAtendido]
   SET [ExigeNomeProfissional] = 1
 WHERE [Nome] = 'Profissional de Saúde Particular';

-- Verificação obrigatória pós-execução:
-- SELECT Id, Nome, ExigeNomeProfissional FROM [dbo].[TipoPublicoAtendido];
