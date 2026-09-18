# Critérios de Aceite — EFC-6417

- CA-01: Endpoint POST /lancamentofrequencia/lista-presenca/get-turmas implementado no LancamentoFrequenciaController, recebendo { hashRede, hashEscola, hashSeries[], hashTurmas[] } e retornando { possuiVisaoCoordenacao, turmas[] }.
- CA-02: Professor sem permissão ampla recebe apenas as turmas às quais está alocado; usuário com permissão ampla recebe todas as turmas da escola.
- CA-03: O campo possuiVisaoCoordenacao é true quando o usuário possui permissão ampla, false caso contrário.
- CA-04: Endpoint POST /lancamentofrequencia/lista-presenca/get-alunos implementado no mesmo controller, recebendo { hashTurmas[] } e retornando array de { turma, alunos[] }, com cada aluno contendo { hashPessoa, nomePessoa, matricula, numeroOrdem }.
- CA-05: Apenas turmas que o usuário tem permissão de visualizar são retornadas em get-alunos.
- CA-06: Alunos são ordenados por numeroOrdem e incluem apenas matrículas ativas.
- CA-07: A lógica de controle de acesso reutiliza o mesmo mecanismo já existente nos demais endpoints de frequência do LancamentoFrequenciaController.
