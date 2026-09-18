repositorio: estrutura-pedagogica
objeto: filtro (módulo shared)

README do módulo: `frontend/src/shared/filtro/README.md`

---

Resumo: o filtro é um componente que, a partir de uma `FilterConfig`, renderiza dinamicamente os
campos informados pelo dev (Select, MultiSelect, Date, Text, Toggle, Checkbox, Radio) e controla
o fluxo entre eles — dependências em cascata, persistência em localStorage com TTL e validação
de campos obrigatórios.


## Tarefas

obs: ao ler a tarefa, refine ele, apos executar marque ela como concluida

1. [x] campos FilterType.Date sao componentes do filtro que nao ficam desabilitados caso um item do [dependency_list] esta invalido
analise como implementar esse fluxo de fixar desabilitado caso um item do dependency_list esteja invalido. 
se possivel para todos os tipos de componentes que o filtro pode utlizar

2. [x] os campos do tipo FilterType.Date aceitam min e max para definir os limites de data, porem esse min e max pode varia com o ano letivo selecionado no filtro

- precisa de uma fluxo que permita que um campo do filtro possa atualizar outro campo
- esse mecanismo precisa ser generico e nao quebrar o que ja funciona
exemplo de uso com base na configuracao filtro-diario-de-classe.ts
Ao selecionar ano letivo, libera o campo de rede para seguir baixando seus dados
e tbm rodar um metodo que atualize o min max dos campos dataInicio e dataTermino
o ideal eh que isso fique junto ao form que o filtro controla, para deixar os eventos em um padrao

planeje a solucao

