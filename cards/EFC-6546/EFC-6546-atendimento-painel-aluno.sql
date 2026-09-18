-- EFC-6546: Redesenho da aba Atendimento do Painel do Aluno
-- Adiciona campos em Atendimento (Nome do Profissional para Atendimento ao
-- Profissional de Saúde Particular; separa a intenção de e-mail no salvamento
-- da auditoria do que foi de fato enviado).
-- Referências: dbo.Atendimento
--
-- NOTA: [PermiteResponsavel], [ResponsavelEhOpcional] e [PermiteEspecialista] em
-- dbo.TipoPublicoAtendido JÁ EXISTEM no banco (confirmado via db_map/schema/tables.yaml) — a
-- suposição original de que faltavam (por analogia ao legado portal-atlas) estava errada. O
-- ALTER TABLE que os adicionava foi removido deste script; a entidade/mapping em C#
-- (TipoPublicoAtendido.cs/TipoPublicoAtendidoMap.cs) já usa esses nomes por convenção, sem
-- necessidade de qualquer alteração.

ALTER TABLE [dbo].[Atendimento]
    ADD [NomeProfissional]                 VARCHAR(250) NULL,
        [EnviarEmailResponsavelPedagogico]  BIT          NOT NULL DEFAULT 1,
        [EnviarEmailResponsavelFinanceiro]  BIT          NOT NULL DEFAULT 0,
        [EmailEnviadoResponsavelPedagogico] BIT          NOT NULL DEFAULT 0,
        [EmailEnviadoResponsavelFinanceiro] BIT          NOT NULL DEFAULT 0;

-- Migra a intenção histórica de DeveEnviarEmail para o novo campo de auditoria:
-- os registros existentes foram salvos antes da distinção RP/RF, então assume-se
-- o destinatário padrão do formulário (Responsável Pedagógico) para preservar a
-- indicação de "e-mail enviado" nos cards já cadastrados (CA-26).
UPDATE [dbo].[Atendimento]
   SET [EmailEnviadoResponsavelPedagogico] = 1
 WHERE [DeveEnviarEmail] = 1;

ALTER TABLE [dbo].[Atendimento]
    DROP COLUMN [DeveEnviarEmail];
