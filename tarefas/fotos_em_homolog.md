repo: estrutura-pedagogica
objetivo: fotos do carometro devem funcionar no ambiente de homologacao


por definicoes tecnicas as fotos dos alunos, mesmo com a url delas, nao funciona no ambiente de homolog,
mas para alguns testes temos um processo que funciona:


processo:
Autenticar no Salto ID de homolog (ambiente normal de desenvolvimento)Abrir uma segunda aba e autenticar no Salto ID de produçãoPegar o pseudo token de produção (do local storage)Substituir esse pseudo token no local storage do ambiente de homolog/devCom isso, o link montado pelo frontend apontará para o Picture Service de produção e retornará a foto


- entender como o frontend salva o obejtivo no local storage
- o login eh feito pelo monolito  que fica repositorio 'portal' e vive no storage que os outros modulo como o estrtura pedagogica usa para ter os dados de login do usuario

analise esse fluxo, contrua uma base de conhecimento que pela descricao do processo um QA consegue seguir essses passos pra ter a foto funcionando em homolog

se necessario crie scripts javascript que roda no console e pega/altera os dados necessarios
crie uma documentacao para guardar tudo
