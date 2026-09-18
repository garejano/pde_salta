# Testes E2E — EFC-6292: FichaIndividual (document-builder)

```gherkin
Feature: Ficha Individual do Aluno

  Background:
    Given que o usuário possui acesso ao módulo de documentos pedagógicos da rede

  Scenario: Visualizar ficha completa de aluno com dados em múltiplos componentes
    Given que um aluno possui notas registradas em componentes curriculares regulares e diversificados
    When o usuário acessa a ficha individual do aluno
    Then o documento exibe as notas de cada disciplina por etapa e avaliação para cada componente preenchido
    And a frequência percentual, o resultado final e as observações do aluno são apresentados
    And a legenda de siglas de avaliação está presente no documento

  Scenario: Componentes sem registros não aparecem na ficha
    Given que um aluno possui notas apenas no componente curricular regular
    When o usuário acessa a ficha individual do aluno
    Then somente o componente regular é exibido
    And componentes sem disciplinas registradas não aparecem no documento

  Scenario: Ficha de aluno com disciplinas em dependência
    Given que um aluno possui disciplinas cursadas em regime de dependência
    When o usuário acessa a ficha individual do aluno
    Then o componente de dependência é exibido com as respectivas disciplinas e notas
    And os demais componentes também são exibidos normalmente

  Scenario: Versão resumida da ficha individual
    Given que existe um aluno com dados registrados em múltiplos componentes
    When o usuário acessa a versão resumida da ficha individual
    Then o documento apresenta as informações essenciais do aluno em estrutura condensada

  Scenario: Ficha com grade de notas extensa é distribuída entre páginas
    Given que um aluno possui registros em muitas disciplinas com diversas etapas e avaliações
    When o usuário acessa a ficha individual do aluno
    Then todas as disciplinas e avaliações são exibidas de forma legível
    And o conteúdo é distribuído entre páginas sem que nenhuma informação seja cortada ou omitida

  Scenario: Exportar a ficha individual como PDF
    Given que o usuário está visualizando a ficha individual de um aluno
    When o usuário solicita a exportação em PDF
    Then um arquivo PDF é gerado contendo o conteúdo completo da ficha
    And o PDF apresenta cabeçalho identificando a rede e rodapé em todas as páginas

  Scenario: Ficha de aluno sem nenhum registro
    Given que um aluno não possui notas registradas em nenhum componente
    When o usuário acessa a ficha individual do aluno
    Then o documento é exibido sem componentes curriculares
    And as informações de frequência e resultado final refletem a ausência de registros
```
