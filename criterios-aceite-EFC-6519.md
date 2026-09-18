# Critérios de Aceite — EFC-6519

**CA-01 — Filtro de acesso**
- O filtro possui três campos: Ano Letivo (obrigatório, seleção única), Rede (obrigatória, seleção única) e Em Uso (opcional; valores: Sim / Não).
- O campo Ano Letivo exibe o ano anterior até março inclusive; a partir de abril, exibe somente o ano corrente em diante.
- O botão de aplicar filtro só fica habilitado quando Ano Letivo e Rede estiverem preenchidos.

**CA-02 — Listagem de tipos de avaliação**
- Após aplicar o filtro, o sistema exibe os tipos de avaliação do ano/rede selecionados.
- A listagem contém as colunas: Sigla, Nome, Em Uso, Opcional, Bônus ou Desconto e ação Ver/Editar.
- O tipo automático bolsão não aparece na listagem. Os demais tipos automáticos (média, total, situação, falta de etapa) são exibidos na listagem, mas os botões de editar e remover ficam desabilitados, com o tooltip "Esse é um tipo automático e não pode ser alterado".
- Em Uso e Opcional são exibidos como ícones de check (preenchido = verdadeiro / vazio = falso), no mesmo padrão visual do Configurador de Disciplinas.
- A coluna Bônus ou Desconto exibe uma tag/badge com um dos quatro valores: Bônus anual, Bônus de etapa, Desconto anual ou Desconto de etapa. Se nenhuma dessas categorias for aplicável, a coluna fica vazia.
- Busca textual e paginação são realizadas no frontend sobre os dados já carregados.

**CA-03 — Criação de tipo de avaliação**
- O usuário pode criar um novo tipo acionando o botão correspondente, que abre um modal com formulário.
- O formulário contém: Sigla, Nome, Opcional e Bônus/Desconto.
- Não é permitido cadastrar um tipo com nome ou sigla já existente para o mesmo ano letivo e rede — a verificação inclui os tipos automáticos.
- O botão Salvar permanece desabilitado enquanto o formulário não tiver dados válidos.
- O modal exibe um checkbox "Continuar cadastrando" ao lado dos botões Salvar e Cancelar. Quando marcado, ao salvar com sucesso, os campos são limpos e o modal permanece aberto para uma nova inclusão; quando desmarcado, o comportamento padrão é mantido (modal fecha após salvar).
- Após salvar com sucesso, o novo tipo aparece na listagem.

**CA-04 — Edição de tipo de avaliação**
- O usuário pode editar um tipo existente pelo botão Ver/Editar na linha, que abre o mesmo modal com os dados atuais preenchidos.
- As mesmas regras de unicidade de nome e sigla se aplicam na edição.
- O botão Salvar permanece desabilitado enquanto não houver alteração em relação ao estado original.
- A edição atualiza o registro existente diretamente, sem inativação ou recriação.

**CA-05 — Remoção de tipo de avaliação**
- A listagem exibe um botão de remoção por linha.
- Se o tipo estiver em uso, o botão fica desabilitado com tooltip explicativo do motivo.
- Se não estiver em uso, ao acionar a remoção o sistema exibe uma confirmação antes de prosseguir.
- A remoção inativa o registro (não o exclui fisicamente).

**CA-06 — Consulta de usos**
- Quando um tipo estiver em uso, a coluna Em Uso exibe, além do ícone de check, uma indicação clicável.
- Ao acionar essa indicação, um modal lista os agrupamentos e escopos que utilizam aquele tipo, apresentados como tags/badges.

**CA-07 — Exportação**
- O usuário pode exportar a listagem filtrada.
