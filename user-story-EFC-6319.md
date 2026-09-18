# EFC-6319 — Lista de Presença

## Contexto

O módulo de Frequência já centraliza o lançamento e o acompanhamento da presença dos alunos na tela de Lançamento de Frequência. No entanto, não existe hoje uma aba ou funcionalidade que permita gerar documentos físicos — lista de presença e carômetro — para uso em sala de aula ou arquivo. Professores e coordenadores precisam desses documentos para controle manual de chamada e identificação visual dos alunos da turma.

## User Story Principal

Como professor ou coordenador, quero selecionar turmas e gerar listas de presença ou carômetros para impressão, para ter documentos físicos disponíveis para controle de chamada em sala e identificação visual dos alunos.

## Critérios de Aceite

**CA-01 — Filtro da aba Lista de Presença**
- A aba possui filtro em cascata com os campos: Rede → Escola → Série (opcional) → Turma (opcional)
- Rede e Escola são obrigatórios; Série e Turma são opcionais e permitem múltipla seleção
- Cada campo só é habilitado após o anterior ser preenchido
- Alterar um campo anterior limpa e atualiza as opções dos campos seguintes
- O filtro não persiste ao navegar para outras abas da tela
- Professor sem permissão ampla visualiza apenas as turmas às quais está alocado; coordenador com permissão ampla visualiza todas as turmas da escola

**CA-02 — Listagem de turmas**
- Após aplicar o filtro, as turmas são exibidas agrupadas por escola, com as informações: Série, Turno, nome da Turma e quantidade de alunos
- É possível selecionar turmas individualmente ou todas de uma vez
- A opção de geração de documentos só fica disponível quando ao menos uma turma estiver selecionada

**CA-03 — Lista de presença diária**
- O documento gerado reúne todas as turmas selecionadas, cada uma em sua própria seção
- Para cada turma: nome e RA dos alunos, com colunas de marcação manual por aula do dia

**CA-04 — Lista de presença semanal**
- O documento gerado reúne todas as turmas selecionadas, cada uma em sua própria seção
- Para cada turma: nome e RA dos alunos, com colunas de marcação manual por dia da semana

**CA-05 — Lista de presença mensal**
- O documento gerado reúne todas as turmas selecionadas, cada uma em sua própria seção
- Para cada turma: nome e RA dos alunos, com colunas de marcação manual por dia do mês

**CA-06 — Carômetro**
- O documento gerado reúne todas as turmas selecionadas, cada uma identificada em sua própria seção
- Cabeçalho do documento: nome da escola, endereço, CNPJ e dados da entidade mantenedora
- Cada aluno é exibido com: foto, nome completo, RA, nome do responsável pedagógico com telefone e e-mail, e nome do responsável financeiro com telefone e e-mail
- Alunos dispostos em grade de 3 colunas por página
- Rodapé com numeração de páginas
- O documento é disponibilizado para download e impressão

## Regras de Negócio

| Perfil | Visibilidade de turmas |
|---|---|
| Professor sem permissão ampla | Apenas turmas às quais está alocado |
| Coordenador sem permissão ampla | Apenas turmas às quais está alocado |
| Professor com permissão ampla | Todas as turmas da escola |
| Coordenador com permissão ampla | Todas as turmas da escola |

## Complementos Técnicos

- **Geração dos documentos:** o backend não possui biblioteca de PDF — a abordagem precisa ser definida antes da implementação. As opções são: (a) biblioteca server-side (ex.: QuestPDF) gerando o arquivo para download; ou (b) HTML renderizado no frontend para impressão via `window.print()`. A decisão impacta a arquitetura dos endpoints.
- **Dados do carômetro — cabeçalho:** verificar se endereço, CNPJ e dados da entidade mantenedora estão disponíveis na entidade `Escola` ou se precisam ser buscados em outra entidade antes de definir o modelo de dados do endpoint.
- **Permissão de acesso:** definir se a aba reutiliza a funcionalidade existente (`LancamentoFrequencia = 101`) ou se será criada uma nova constante de funcionalidade específica para Lista de Presença.
