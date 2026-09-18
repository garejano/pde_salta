# EFC-6367 — Saída Antecipada

## Contexto

O sistema de Lançamento de Frequência já permite registrar a presença dos alunos (Presente, Atrasado ou Ausente). No entanto, não existe hoje mecanismo para registrar que um aluno saiu mais cedo da escola durante o dia letivo. Essa lacuna impede o controle de custódia e segurança do aluno quando a saída não gera registro automático na catraca.

## User Story Principal

Como coordenador, quero registrar manualmente a saída antecipada de um aluno — informando horário e motivo — para manter o registro de custódia e segurança independentemente de dados da catraca.

## Critérios de Aceite

**CA-01 — Exibição da opção no card**
- O card do aluno exibe o link "↗ Registrar saída antecipada" somente quando o aluno possui status Presente ou Atrasado.
- Alunos sem marcação ou com status Ausente não exibem essa opção.

**CA-02 — Abertura do formulário inline**
- Ao clicar em "Registrar saída antecipada", o card expande exibindo um formulário com:
  - Label "→ Saída antecipada"
  - Campo Hora de saída (obrigatório), formato HH:MM, com ícone de relógio
  - Campo Justificativa (opcional), com placeholder "Ex: quem liberou, motivo da saída etc..."
  - Botões Cancelar e Salvar
- O botão Salvar permanece desabilitado até que o campo Hora de saída esteja preenchido.
- Somente um card por vez pode ter o formulário aberto.

**CA-03 — Cancelamento**
- Ao clicar em Cancelar, o formulário fecha sem salvar e o card retorna ao estado anterior.

**CA-04 — Salvamento do registro**
- Após salvar, o card retorna à visualização padrão dos botões de frequência.
- Abaixo dos botões, o card passa a exibir:
  - "→ Saída antecipada · HH:MM" com link Editar à direita
  - Texto da justificativa logo abaixo (quando preenchida)
- O status de frequência do aluno (Presente ou Atrasado) não é alterado.
- Um ícone de relógio fica visível no canto superior direito do card como indicador da saída registrada.

**CA-05 — Edição do registro**
- Ao clicar em Editar, o formulário reabre pré-preenchido com hora e justificativa registradas.
- Todos os campos são editáveis.
- Cancelar descarta as alterações e restaura os dados originais.
- Salvar atualiza o registro e retorna o card com os dados atualizados.

**CA-06 — Exclusão do registro**
- O formulário de edição oferece a opção de remover o registro de saída antecipada.
- Um modal de confirmação é exibido antes de executar a remoção.
- Após confirmar, o card retorna ao estado pós-marcação sem saída registrada (link "↗ Registrar saída antecipada" reaparece).

**CA-07 — Histórico do aluno**
- Os registros de saída antecipada ficam associados ao aluno com: data, hora de saída e justificativa.

## Regras de Negócio

| Status do aluno | Opção "Registrar saída antecipada" |
|---|---|
| Sem marcação | Não exibe |
| Ausente | Não exibe |
| Presente | Exibe |
| Atrasado | Exibe |

## Complementos Técnicos

- **Validação do horário de saída:** para escolas com lançamento por aula/tempo, o horário informado deve ser validado como pertencente ao intervalo do evento de aula em que a saída está sendo registrada.
- **Listagem/Relatório de saídas antecipadas:** o escopo de consulta por escola e período ainda está em aberto — avaliar se deve compor o módulo de Frequência ou o módulo de Relatórios. Esse escopo não está contemplado nesta US e deve ser tratado em atividade separada.
