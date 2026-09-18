-- EFC-6547: Redesenho da aba Anamnese do Painel do Aluno
-- Adiciona a coluna [Hash] (padrão BaseEntity/StatefulEntity do estrutura-pedagogica) nas
-- tabelas legadas do módulo AnamneseVirtual que nunca a tiveram — confirmado ausente via
-- sys.columns em 2026-08-19. Mesma causa raiz e mesma correção já aplicada em EFC-6546
-- (ver EFC-6546-hash-tabelas-legadas-atendimento.sql): sem essa coluna, GetAnamnese falha
-- com "Invalid column name 'Hash'", pois as entidades C# (BaseEntity/StatefulEntity) sempre
-- esperam essa coluna.
--
-- DEFAULT NEWID() preenche automaticamente um Hash único para cada linha já existente no
-- momento do ALTER TABLE — nenhuma etapa manual de backfill é necessária.
--
-- Tabelas SEM Hash corrigidas aqui (schema AnamneseVirtual): GrupoPergunta, OpcaoResposta,
-- Pergunta, PerguntaCondicionalOpcaoResposta, PerguntaTipoPergunta, PerguntaVersaoAnamnese,
-- PerguntaVersaoAnamneseTipoPergunta, TipoPergunta, VersaoAnamnese, RedeSerieVersaoAnamnese,
-- AnamnesePessoaRespostaOpcao.
-- (AnamnesePessoa, AnamnesePessoaResposta, PerguntaVersaoAnamneseTipoPerguntaOpcaoResposta e
-- VersaoAnamnesePadrao já têm Hash — não são tocadas por este script.)

ALTER TABLE [AnamneseVirtual].[GrupoPergunta] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_GrupoPergunta_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[OpcaoResposta] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_OpcaoResposta_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[Pergunta] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_Pergunta_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[PerguntaCondicionalOpcaoResposta] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_PerguntaCondicionalOpcaoResposta_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[PerguntaTipoPergunta] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_PerguntaTipoPergunta_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[PerguntaVersaoAnamnese] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_PerguntaVersaoAnamnese_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[PerguntaVersaoAnamneseTipoPergunta] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_PerguntaVersaoAnamneseTipoPergunta_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[TipoPergunta] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_TipoPergunta_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[VersaoAnamnese] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_VersaoAnamnese_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[RedeSerieVersaoAnamnese] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_RedeSerieVersaoAnamnese_Hash] UNIQUE ([Hash]);

ALTER TABLE [AnamneseVirtual].[AnamnesePessoaRespostaOpcao] ADD
    [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    CONSTRAINT [UQ_AnamnesePessoaRespostaOpcao_Hash] UNIQUE ([Hash]);
