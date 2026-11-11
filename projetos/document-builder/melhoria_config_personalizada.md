repositorio:estrutura-pedagogica
alvo: document-builder

objetivo: alguns documentos podem ter um "painel de confguracao personalizado" como eh o caso do carometro
que pode mudar o tipo de card que sera visualizado no documento.

atualmente isso esta sendo feito com app-doc-carometro-variant-picker mas ele so exibe e mostra a selecao dos cards.
ele deve ser mantido, mas deve ser criado um componente para a configuracao do documento carometro.

app-doc-caromentro-config-panel
esse componente vai dentro do template leftPanelCarometroTpl
no inicio deve ter um bloco para configurar a quantidade de colunas doc-carometro-grid usa para distribuir as colunas
tem uma variavel COLS, quero que  essa variavel possar ser editada pelo usuario e reflita no documento

apos esse bloco vem o app-doc-carometro-variant-picker que exibe a lista de cards para selecao (esse componente nao precisa de scroll interno)
o scroll deve ser no app-doc-carometro-config-panel

nesse config-panel deve ser possivel configurar:
- gap entre as colunas
- altura das variantes dos cards
- visibilidade dos elementos (nome do aluno, ra, responsavel, telefone,email)
  - deve ser possivel dar toggle nesses elementos, entenda a altura de cada um desses elementos para entender se eh possivel calcular a altura de cada variante de card ao vivo




esse componente C:\projects\estrutura-pedagogica\frontend\src\shared\document-builder\components\doc-carometro-grid
