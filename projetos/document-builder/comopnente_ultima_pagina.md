quando a ultima pagina de um documento contem somente a assiatura, deve ter a opcao de incluir um componente DocLastPageInfo


na config do documento adicionar lastPageComponent do type DocumentEntry
se a config incluir o componente e a ultima pagina do documento contiver apenas assinatura esse componente entra na pagina em entries 

novo componente a ser criado com o skill criar-component-doc:

visualmente eh uma tabela padrao
hedaer que ocupa a tabela toda
apenas 1 coluna 
nessa coluna podem ter items internos: (4 colunas internas nesse td)
<div>
  <b>{{label}}></b><span>{{value}}</span>
</div>

esses items sao definidos por data.fields[
{label:"xx",value:"xx"},
{label:"xx",value:"xx"},
]
