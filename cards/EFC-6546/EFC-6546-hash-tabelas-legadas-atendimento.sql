-- EFC-6546: Redesenho da aba Atendimento do Painel do Aluno
-- Adiciona a coluna [Hash] (padrão BaseEntity/StatefulEntity do estrutura-pedagogica) nas
-- tabelas legadas do módulo de Atendimento que nunca a tiveram — confirmado ausente via
-- sys.columns em 2026-08-11 (ver cards/EFC-6546/EFC-6546.problema-hash-tabelas-legadas.md).
-- Sem essa coluna, GetSolicitantesAtendimento/GetTiposAtendimento/GetMotivosAtendimento/
-- GetNorteadorAtendimento e todo o fluxo de salvaratendimento falham com
-- "Invalid column name 'Hash'", pois as entidades C# (BaseEntity/StatefulEntity) sempre
-- esperam essa coluna.
--
-- DEFAULT NEWID() preenche automaticamente um Hash único para cada linha já existente no
-- momento do ALTER TABLE — nenhuma etapa manual de backfill é necessária.
--
-- Tabelas SEM Hash corrigidas aqui: SolicitanteAtendimento, MotivoAtendimento,
-- TipoAtendimento, MotivoAtendimentoTipoPublicoAtendido, FormularioAtendimento,
-- FormularioAtendimentoQuestao, FormularioAtendimentoQuestaoOpcao,
-- FormularioAtendimentoResposta, FormularioAtendimentoRespostaOpcao, AtendimentoPessoa.
-- (Atendimento e TipoPublicoAtendido já têm Hash — não são tocadas por este script.)

ALTER TABLE [dbo].[SolicitanteAtendimento] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_SolicitanteAtendimento_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[MotivoAtendimento] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_MotivoAtendimento_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[TipoAtendimento] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_TipoAtendimento_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[MotivoAtendimentoTipoPublicoAtendido] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_MotivoAtendimentoTipoPublicoAtendido_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[FormularioAtendimento] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_FormularioAtendimento_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[FormularioAtendimentoQuestao] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_FormularioAtendimentoQuestao_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[FormularioAtendimentoQuestaoOpcao] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_FormularioAtendimentoQuestaoOpcao_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[FormularioAtendimentoResposta] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_FormularioAtendimentoResposta_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[FormularioAtendimentoRespostaOpcao] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_FormularioAtendimentoRespostaOpcao_Hash] UNIQUE ([Hash]);

ALTER TABLE [dbo].[AtendimentoPessoa] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_AtendimentoPessoa_Hash] UNIQUE ([Hash]);
