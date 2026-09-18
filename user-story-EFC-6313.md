# User Story — EFC-6313: Aba para Lançamento de Justificativas

## Contexto

O sistema já possui um fluxo de justificativas acessível dentro da chamada individual de cada turma. Contudo, não existe uma visão consolidada que permita ao coordenador gerenciar justificativas de todas as turmas em um único lugar. A aba de Justificativa preenche essa lacuna, oferecendo uma interface dedicada à gestão centralizada de justificativas de ausência, com duas views alternáveis (Cards e Tabela) e formulários inline — sem necessidade de abrir cada chamada individualmente.

---

## User Story Principal

Como coordenador, quero acessar uma aba dedicada de justificativas com visão em Cards e Tabela, para que eu possa registrar, editar e remover justificativas de ausência de alunos de todas as turmas de forma centralizada, sem precisar entrar em cada chamada individualmente.

---

## Critérios de Aceite

### Filtro

- CA-01: Os campos do filtro seguem a ordem obrigatória: Data → Rede → Escola → Série (opcional) → Turma (opcional), sem campo de Status.
- CA-02: Data, Rede e Escola são obrigatórios; cada campo só é habilitado após o anterior ser preenchido.
- CA-03: O filtro de data é iniciado com a data atual; datas futuras e anteriores a 01/01/2018 não são permitidas.
- CA-04: Os chips de Rede e Escola são exibidos no topo do filtro e podem ser removidos individualmente.
- CA-05: O filtro não persiste ao navegar para outras abas.

### Toggle Cards / Tabela

- CA-06: A toolbar exibe o toggle Cards/Tabela e o contador total de alunos com ausência em todas as turmas filtradas (não o número de turmas).
- CA-07: A alternância entre views não perde o estado de justificativas já salvas na sessão.
- CA-08: Quando não há turmas com ausências para os filtros aplicados, ambas as views exibem estado vazio com mensagem informativa.

### View Cards — acordeões por turma

- CA-09: Cada turma com ausências é representada por um acordeão contendo: nome da turma, quantidade de alunos com ausência e contador de ausências justificadas.
- CA-10: O primeiro acordeão é expandido por padrão; o header do acordeão expandido tem fundo azul claro (cor primária light).
- CA-11: Os cards dos alunos exibem: avatar com iniciais, nome, RA e tag de status da justificativa ("Ausência justificada" em azul ou "Ausência não justificada" em vermelho).
- CA-12: Os cards não exibem botões de Presente/Atrasado/Ausente — apenas o controle de justificativa.
- CA-13: Turmas sem ausências não aparecem na listagem.

### View Tabela — lista consolidada

- CA-14: A tabela consolida todos os alunos com ausência de todas as turmas filtradas em uma listagem plana, com colunas: Nome, RA, Turma, Status e ação.
- CA-15: Ao clicar em "Justificar" ou "Editar justificativa" em uma linha, o formulário é expandido inline abaixo da linha com fundo azul claro; apenas um formulário pode estar aberto por vez na tabela.
- CA-16: Após salvar, a tag de status da linha é atualizada imediatamente, sem recarregar a página.
- CA-17: A tabela tem scroll horizontal em viewports menores que 700px.

### Registro de justificativa

- CA-18: O formulário (criação e edição) contém: Início (obrigatório), Fim (obrigatório), Motivo (obrigatório, mínimo 3 caracteres) e upload de arquivo (opcional); os campos Início e Fim são exibidos lado a lado.
- CA-19: O botão "Salvar" fica desabilitado até todos os campos obrigatórios estarem preenchidos.
- CA-20: Fim não pode ser anterior ao Início; a validação ocorre em tempo real.
- CA-21: Apenas um formulário pode estar aberto por vez: por turma na view Cards e globalmente na view Tabela.
- CA-22: Após salvar, o card/linha exibe a tag "Ausência justificada" em azul e o botão muda para "Editar justificativa".

### Edição de justificativa

- CA-23: O formulário de edição abre pré-preenchido com todos os dados atuais; todos os campos são editáveis, incluindo substituição do arquivo.
- CA-24: Cancelar a edição descarta as alterações e restaura os dados originais.

### Remoção de justificativa

- CA-25: Um modal de confirmação é exibido antes da remoção, deixando explícito que a ação não apaga as faltas registradas — apenas desbloqueia a edição dos lançamentos.
- CA-26: Após confirmar, os lançamentos no intervalo coberto pela justificativa voltam a ser editáveis imediatamente.
- CA-27: Enquanto a justificativa estiver ativa, qualquer tentativa de alterar o status de ausente para outro tipo é bloqueada com indicação visual.

### Job diário de consolidação de faltas

- CA-28: Um processo automático, executado diariamente de forma assíncrona, verifica para cada justificativa cujo período cobre a data de execução e para cada evento de aula elegível do aluno se já existe registro de frequência.
- CA-29: Se não existir registro, o processo cria um com tipo "falta" e marcado como confirmado; se já existir, mantém sem alteração.
- CA-30: O processo é idempotente; registros gerados não são removidos caso a justificativa seja editada ou excluída após o job executar.
- CA-31: Justificativas para períodos futuros ficam pendentes até o job executar na data correspondente.

---

## Complementos Técnicos

- **Permissões:** leitura usa funcionalidade `LancamentoFrequencia` (101); escrita e remoção usam `LancamentoFrequencia_JustificarFaltas` (69).
- **Backend:** os endpoints `get-justificativa`, `create-justificativa`, `update-justificativa` e `disable-justificativa` já estão implementados no `LancamentoFrequenciaController`. É necessário um novo endpoint que retorne alunos com ausência agrupados por turma para a visão da aba — a visão atual opera por `hashAulaEvento` individual e não atende à listagem consolidada.
- **Frontend:** `listar.component.ts` já declara `tab: 'frequencia' | 'justificativa'` e as rotas da tab, mas a aba Justificativa não tem conteúdo implementado. O `JustificativaModalComponent` existente encapsula a lógica de formulário em modal e deve ser adaptado ou complementado para suportar o formulário inline exigido nesta aba. O filtro da aba Justificativa é diferente do filtro da aba Frequência: não contém o campo Status.
