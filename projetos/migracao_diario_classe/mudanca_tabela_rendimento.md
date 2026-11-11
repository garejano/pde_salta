base:./readme.md
base de contexto: todo documentos em ../migracao_diario_classe/*

---- versao antiga

repositorio de onde a feature foi copiada: documentacao-pedagogica
path: c:/projects/documentacao-pedagogica
frontend do diario de classe: c:/projects/documentacao-pedagogica/frontend-diario-classe

componente em que inicia os dados do documento diario de classe:
c:/projects/documentacao-pedagogica/frontend-diario-classe/src/app/pages/relatorio/listar-relatorio/listar-relatorio.component.ts


nesse repositorio a tabela gerada de 'rendimento' gerada no documento tem essa estrutura:


a estrutura visual da tabela abaixo eh a referencia que DEVE ser usada na tabela de rendimento do diario de classe

+----+-----------+---------------+-------------------------------+-------------------------------+-------------------------------+------------------+
| Nº | Matrícula | Aluno         |         1º Bimestre           |         2º Bimestre           |         3º Bimestre           |      Final       |
|    |           |               +------+------+----------+-------+------+------+----------+-------+------+------+----------+-------+------------------+
|    |           |               | Av1  | Av2  | Trabalho| Média | Av1  | Av2  | Trabalho| Média | Av1  | Av2  | Trabalho| Média | Situação         |
|    |           |               | /10  | /10  |   /10    |       | /10  | /10  |   /10    |       | /10  | /10  |   /10    |       |                  |
+----+-----------+---------------+------+------+----------+-------+------+------+----------+-------+------+------+----------+-------+------------------+
| 1  | 2026001   | João da Silva | 8,0  | 7,5  |   9,0    |  8,2  | 7,0  | 8,5  |   9,5    |  8,3  | 9,0  | 8,0  |  10,0    |  9,0  | Aprovado         |
| 2  | 2026002   | Maria Oliveira| 9,5  | 9,0  |  10,0    |  9,5  | 8,5  | 9,0  |   9,0    |  8,8  | 7,5  | 8,0  |   8,5    |  8,0  | Aprovado         |
+----+-----------+---------------+------+------+----------+-------+------+------+----------+-------+------+------+----------+-------+------------------+


- obs: acima de Av1,Av2, Trabalho,Media. tem um cabecalho 1 Bimestre


---- nova versao

a nova versao usa o componente DocGridRendimentoComponent como ponto inicial da criacao da tabela no documento


na nova versao essa mesma tabela tem essa estrutura:

+----+---------------------------+-----------+-----------+-------+-------+---------------+
| Nº | Aluno                     | Ativ. 1   | Ativ. 2   | Prova | Média | Situação      |
+----+---------------------------+-----------+-----------+-------+-------+---------------+
| 10 | João Victor Araújo        | 4.0       | 5.0       | 5.0   | 4.8   | Recuperação   |
| 11 | Karen Beatriz Ribeiro     | 7.0       | 7.5       | 7.2   | 7.2   | Aprovado      |
| 12 | Lucas Fernandes Dias      | 6.0       | 6.5       | 6.8   | 6.5   | Aprovado      |
| 13 | Mariana Campos Vieira     | 9.0       | 9.0       | 9.5   | 9.2   | Aprovado      |
| 14 | Nathan Borges Freitas     | 5.5       | 6.0       | 5.5   | 5.7   | Recuperação   |
| 15 | Olívia Pinto Azevedo      | 8.0       | 8.5       | 8.0   | 8.2   | Aprovado      |
| 16 | Pedro Augusto Moreira     | 7.5       | 7.0       | 7.5   | 7.3   | Aprovado      |
| 17 | Renata Cavalcante         | 6.5       | 7.0       | 6.8   | 6.8   | Aprovado      |
| 18 | Samuel Correia Teixeira   | 8.5       | 8.0       | 8.8   | 8.5   | Aprovado      |
| 19 | Tatiane Lopes Barbosa     | 9.5       | 10.0      | 9.5   | 9.7   | Aprovado      |
| 20 | Ulisses Miranda Cunha     | 5.0       | 5.5       | 5.2   | 5.2   | Recuperação   |
| 21 | Vanessa Duarte Machado    | 7.0       | 7.5       | 7.0   | 7.2   | Aprovado      |
| 22 | Wagner Ramos Nascimento   | 8.0       | 8.5       | 8.2   | 8.2   | Aprovado      |
| 23 | Yasmin Oliveira Campos    | 6.0       | 6.5       | 6.5   | 6.3   | Aprovado      |
| 24 | Zara Lima Pereira         | 9.0       | 9.5       | 9.0   | 9.2   | Aprovado      |
+----+---------------------------+-----------+-----------+-------+-------+---------------+


Sem o 'cabecalho' das avaliacoes.




Objetivos:
analisar a estrutura dos dados montados em documentacao-pedagogica
- entender se precisa adaptar o que foi migrado para estrutura-pedagogica

- garantir que a estrutura de montagem de tabelas que se dividem consegue compartar a forma como precisa ser exibida a tabela de rendimento

existe a rota http://localhost:4200/exemplos/diario-classe no estrutura-pedagogica que deve ser usada para implementar a nova tabela.

- valide o bakcend se precisa de ajuste
- crie mocks dos dados apos validar o back para que eu teste na tela de exemplos
- garante que o que ja existe no fluxo de tabelas do document-builder nao seja quebrado e se mantenha funcional pois eh usado em varios outros documentos
- se ncessario crie um componente de tabela separado que implementa o que eh necessario
- como prioridade, se possivel adaptar o componente DocGridRendimentoComponent e DocWideTableComponent para supoirtar a feature dos headers da tabela
