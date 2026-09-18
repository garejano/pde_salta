alvo: qlqr repositorio.

objetivo: desenvolvedor deve ler o report de merge_check e enteder quais acoes deve tomar antes de fazer o merge de fato.

problema: no fluxo de trabalho do meu time, apos implementarmos uma tarefa no codigo, fazemos merge dele par homolog para passar para teste
porem em alguns casos, diferentes desenvolvedos mudam coisas no mesmo codigo/arquivo.

o classico conflito de merge.

preciso que seja criada uma skill que apartir do branch que estou selecionado, ver se vai dar conflito quando homolog receber esse branch

entender os conflitos, o historico deles e sugerir a melhor acao.

deve ser criado um arquivo md em pde_salta/merge_checks/reponame_origem_destino_date.md com a analise


- garantir que homolog esta em sua versao mais atualizada
- garantir que o branch atual esta com com todo codigo atualizado

o skill nao pode:
- commitar
- alterar homolog
- alterar codigo
