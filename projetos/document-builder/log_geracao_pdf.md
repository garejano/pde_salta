repositorio: estrutura-pedagogica


base: ./*

o document-builder eh um gerador de documento em tela para o usuario ver e o usuario pode apertar dois botoes imprimit/salvar pdf

objetivo: ter um log salvo no banco para cnseguir identificar qual documento foi gerado sabendo
- usuario que gerou
- nome do documento
- hora
- rede
- escola
- etc...
- impressao direta ou pdf


- crie o script para geracao da tabela
- fluxo no backend, uma nova Controller (LogGeracaoDocumento), Service , Repository como os padroes definidos nos skill/commandos do repositorio estrutura-pedagogica
