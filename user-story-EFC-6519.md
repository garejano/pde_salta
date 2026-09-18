# User Story — EFC-6519

## Contexto

O Atlas já possui o Configurador de Disciplinas como referência de padrão visual e de interação para configurações pedagógicas. A funcionalidade de Tipos de Avaliação existe no domínio, mas ainda não conta com uma interface de configuração acessível ao usuário — os cadastros automáticos ocorrem de forma interna e os tipos manuais não têm tela dedicada. Esta atividade entrega a tela de Cadastro de Tipos de Avaliação, dentro do escopo do Configurador de Avaliações, permitindo que o usuário gerencie os tipos disponíveis por ano letivo e rede.

## User Story

**Como** configurador pedagógico,
**quero** gerenciar os tipos de avaliação por ano letivo e rede,
**para que** as avaliações disponíveis reflitam as regras de cada rede em cada período letivo.

## Critérios de Aceite

**CA-01 — Filtro de acesso**
- Para consultar os tipos de avaliação, o usuário informa Ano Letivo e Rede (ambos obrigatórios); pode também filtrar por "Em Uso" (Sim/Não), que é opcional.
- O Ano Letivo disponível para seleção é: até março, o ano anterior e o corrente; a partir de abril, somente o ano corrente em diante.
- O botão para aplicar o filtro só é habilitado quando Ano Letivo e Rede estiverem preenchidos.

**CA-02 — Listagem de tipos de avaliação**
- Ao aplicar o filtro, o sistema exibe os tipos de avaliação cadastrados para o ano letivo e rede selecionados, com as colunas: Sigla, Nome, Em Uso, Opcional, Bônus ou Desconto e uma ação para visualizar/editar.
- O tipo automático "Bolsão" nunca aparece na listagem. Os demais tipos automáticos (Média, Total, Situação, Falta de Etapa) aparecem, mas não podem ser editados nem removidos pelo usuário — as ações ficam desabilitadas com uma mensagem explicando que é um tipo automático.
- As colunas Em Uso e Opcional são exibidas como indicadores visuais de sim/não, no mesmo padrão do Configurador de Disciplinas.
- A coluna Bônus ou Desconto mostra uma etiqueta com um dos valores: Bônus anual, Bônus de etapa, Desconto anual ou Desconto de etapa; quando nenhuma dessas opções se aplica, a coluna fica vazia.
- A busca por texto e a navegação entre páginas de resultado ocorrem sobre os dados já carregados pelo filtro (frontend).

**CA-03 — Criação de tipo de avaliação**
- O usuário pode criar um novo tipo de avaliação preenchendo Sigla, Nome, se é Opcional e se representa Bônus ou Desconto.
- Não é permitido cadastrar um tipo com Nome ou Sigla já usados por outro tipo (incluindo os automáticos) no mesmo ano letivo e rede.
- O botão de salvar só é habilitado quando todos os dados obrigatórios estiverem preenchidos corretamente.
- É possível marcar a opção "Continuar cadastrando": quando marcada, ao salvar com sucesso o formulário é limpo e permanece aberto para um novo cadastro; quando desmarcada, o formulário é fechado após salvar.
- Ao salvar com sucesso, o novo tipo passa a aparecer na listagem.

**CA-04 — Edição de tipo de avaliação**
- O usuário pode abrir um tipo de avaliação existente (não automático) para edição, com os dados atuais já preenchidos.
- As mesmas regras de Nome e Sigla únicos valem na edição.
- O botão de salvar só é habilitado quando houver alguma alteração em relação aos dados originais.
- Após salvar, os dados exibidos na listagem são atualizados imediatamente.

**CA-05 — Remoção de tipo de avaliação**
- Cada tipo de avaliação (não automático) tem uma ação de remoção.
- Se o tipo estiver em uso, a remoção fica bloqueada e uma mensagem explica o motivo.
- Se não estiver em uso, o sistema pede confirmação antes de remover.
- Um tipo removido deixa de estar disponível para uso, mas seu histórico é preservado (inativação, não exclusão física).

**CA-06 — Consulta de usos**
- Quando um tipo estiver em uso, a listagem indica isso de forma clicável.
- Ao clicar, o usuário vê onde aquele tipo está sendo usado, identificado pelos agrupamentos e escopos de avaliação correspondentes.

**CA-07 — Exportação**
- O usuário pode exportar a listagem de tipos de avaliação filtrada para um arquivo.

## Complementos Técnicos

- Nome da tela/serviço: `CadastroTiposAvaliacao`.
- A tela usa a funcionalidade `ConfiguradorAvaliacoes` (Id 250), que controla o acesso a um conjunto mais amplo de funções do configurador — sem funcionalidade própria para este cadastro. Esta constante ainda não existe em `Funcionalidade.cs` e precisa ser adicionada.
- Nome e Sigla devem ser sanitizados antes de salvar (excesso de espaços, quebras de linha etc.) usando o método existente em `StringExtensions` (avaliar `HigienizarTexto` vs `RemoverEspacosExtras`).
- A validação de conflito de nome/sigla é tratada no backend.
- A entidade base para o repositório de filtro é a própria `TipoAvaliacao`.
- "Em uso" é determinado pela existência de `EstruturaAvaliacao` vinculada ao `TipoAvaliacao`.
- O modal de usos exibe `Agrupamento.Nome` e `EstruturaAvaliacaoEscopo.Nome` das `EstruturaAvaliacao` vinculadas.
- A remoção é realizada via `Disable` (inativação do registro).
- Referência de padrão visual e de interação: Configurador de Disciplinas (`frontend/src/app/features/configurador-disciplinas/`, `Api/Controllers/ConfiguradorDisciplinasController.cs`).

## Links

- Jira: https://gruposalta.atlassian.net/browse/EFC-6519
- Epic pai: EFC-6531 — Cadastros pedagógicos
