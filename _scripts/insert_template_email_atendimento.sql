-- Cadastra o template de e-mail de "Registro de Atendimento" (Painel do Aluno / estrutura-pedagogica)
-- em Notas.TemplateEmail, vinculado à Funcionalidade 276 ("Painel do Aluno - Atendimento - Envio de
-- Email", já existente em dbo.Funcionalidade).
--
-- Mesmo mecanismo já usado por Ocorrência (Notas.TemplateEmail.Id = 3, Funcionalidade = 277) --
-- EmailAtendimentoService (backend) e AtendimentoEmailPreviaService (front) buscam este template e
-- substituem os placeholders [Chave] pelos dados do atendimento. Layout provisório (mesmo estilo do
-- template de Ocorrência já em produção); trocar só o conteúdo do @Template quando o design definitivo
-- chegar -- não requer alteração de código em nenhum dos dois lados.
--
-- Só 3 placeholders: [Campos] é o corpo <tr> da tabela rótulo/valor (Aluno, RA, Turma, Data,
-- Solicitante, Atendimento ao, Tipo, Motivo, Atendente(s), e opcionalmente Profissional/
-- Responsável(eis) Atendido(s)/Importante) -- mesma lista usada no documento impresso do atendimento
-- (AtendimentoImpressaoComponent / atendimento-campos.ts), pra não divergir entre e-mail e impressão.
-- [SecaoProximosPassos] e [ResumoDaConversa] são texto livre (título + parágrafo), montados à parte.
--
-- Rodar manualmente (usuário mcp.readonly do MCP é somente leitura). Rodar primeiro em
-- ElevaPortalHomolog para validar o e-mail de teste antes de aplicar em produção.

DECLARE @UsuarioId INT = 0;               -- SUBSTITUIR pelo Id do usuário responsável pela inclusão (dbo.Usuario)
DECLARE @FuncionalidadeAtendimentoEnvioEmail INT = 276;

IF EXISTS (SELECT 1 FROM Notas.TemplateEmail WHERE Funcionalidade = @FuncionalidadeAtendimentoEnvioEmail)
BEGIN
   RAISERROR('Já existe um template cadastrado para a Funcionalidade 276 (Atendimento - Envio de Email). Nada foi inserido.', 16, 1);
   RETURN;
END

DECLARE @Template VARCHAR(MAX) = '<html>
  <body>
    <table style="border: 0; width: 700px; background: #fff; padding:10px; border:5px solid #dddddd;">
      <tr>
        <td>
          <p style="font: 16px arial, verdana; color: #6d6d6d; text-align: left;">
            Registro de Atendimento
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <table style="font: 14px arial, verdana; color: #6d6d6d; width:100%; border-collapse:collapse;">
            [Campos]
          </table>
        </td>
      </tr>
      <tr>
        <td>
          [SecaoProximosPassos]
          <p style="font: 16px arial, verdana; color: #6d6d6d; text-align: left;">
            <strong>Resumo da Conversa</strong><br />
            [ResumoDaConversa]
          </p>
        </td>
      </tr>
      <tr style="background: #f1f2f6;">
        <td>
          <p style="font: 12px arial, verdana; color: #6d6d6d; text-align: center; padding:15px; margin-bottom:0;">
            Este é um e-mail automático, favor não responder.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>';

INSERT INTO Notas.TemplateEmail (Hash, Template, Ativo, UsuarioInclusao, DataInclusao, Funcionalidade)
VALUES (NEWID(), @Template, 1, @UsuarioId, GETDATE(), @FuncionalidadeAtendimentoEnvioEmail);
