repositorio: estrutura-pedagogica
rota frontend: lancamento-frequencia/lista-presenca
objetivo: entender como os dados para o documento 'carometro' na montagem do card do aluno sao tratados 

caso 1: aluno sem reponsavel pedagogico exibe os dados do responsavel financeiro
caso 2: aluno sem responsavel pedagogico e financeiro exibe campo vazio "N/A"

apartir do RA de um aluno quero saber como fazer ele exibir tanto o caso 1 como o caso 2 mudando os dados no banco
- crie querys que consigo fazer essa validacao
- queries para executar a alteracao de responsavel



esses casos serao testado por um QA, a ideia eh gerar uma massa de teses deterministica com base nos dados reais do banco via mcp sqlserver
