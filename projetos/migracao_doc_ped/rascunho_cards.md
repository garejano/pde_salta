# Rascunho de cards — Migração Documentação Pedagógica

> Descrições a nível de produto, para colar direto no Jira. Cada card abaixo assume um Épico
> "Migração Documentação Pedagógica" como pai. Contexto técnico completo em
> [`readme.md`](readme.md), [`frontend.md`](frontend.md), [`backend.md`](backend.md) e
> `cards/*.md` — usar como referência de implementação, não copiar para o Jira.

## Resumo do Épico — Migração Documentação Pedagógica

**Contexto / motivação**
O sistema **Documentação Pedagógica** hoje vive em um portal e banco de dados separados
(`documentacao-pedagogica`), fora do Portal Eleva principal. Isso obriga o usuário a alternar
entre dois sistemas para tarefas do dia a dia: configurar como os documentos oficiais da rede/
escola devem ser gerados, consultar e editar o histórico escolar dos alunos, e emitir os
documentos oficiais (Histórico/Ficha Individual, Ata de Resultados Finais, Certificado de
Conclusão, Livro de Matrícula). Além do atrito de navegação, manter dois sistemas/bancos
separados para o mesmo domínio de dados (rede, escola, aluno, turma) gera duplicação de cadastro e
risco de inconsistência entre eles.

**Objetivo**
Migrar as funcionalidades de Documentação Pedagógica para dentro do **Portal Eleva**
(`estrutura-pedagogica`), unificando os dois produtos em um só. Ao final do épico, o usuário deixa
de precisar acessar o sistema separado: toda a configuração de documentos, edição de histórico do
aluno e emissão de documentos oficiais passa a ficar dentro do Portal Eleva, na aba
**Documentação Pedagógica** (sub-abas Alunos / Turmas / Configurações), reaproveitando o cadastro
de rede/escola/aluno/turma que o Portal já possui — sem duplicar dado.

**Escopo (cards deste épico)**
1. Configurações (Documentos da Rede, Fundamentação, Configurações da Escola)
2. Aba de Turmas (filtro + lista)
3. Aba de Alunos (edição de dados, fundamentação, observações)
4. Edição do Histórico do Aluno (séries e resultado final)
5. Documentos da Turma (Ata de Resultados Finais e Livro de Matrícula)
6. Documentos do Aluno (Ficha Individual e Certificado de Conclusão)

**Fora de escopo deste épico**
- **Diário de Classe** — já existe e é funcional dentro do Portal Eleva (`features/diario-de-classe`);
  não faz parte desta migração.
- **Edição de dados cadastrais do aluno** (nome, CPF, RG, nacionalidade, filiação) — esses dados
  já são mantidos em outro fluxo do Portal Eleva; a migração reaproveita esse cadastro em vez de
  duplicá-lo.
- Desligamento/descontinuação do sistema antigo — este épico entrega a funcionalidade equivalente
  dentro do Portal Eleva; a decisão de aposentar o sistema `documentacao-pedagogica` é um passo
  posterior, dependente da adoção.

**Critério de sucesso**
O usuário consegue, sem sair do Portal Eleva: configurar rede/escola/fundamentação legal, buscar e
editar o histórico de um aluno, e emitir os quatro documentos oficiais (Ficha Individual, Ata de
Resultados Finais, Certificado de Conclusão, Livro de Matrícula) com o mesmo resultado que obtinha
no sistema Documentação Pedagógica separado.

---

## Parte 1

### Card 1 — Configurações (Documentos da Rede, Fundamentação, Configurações da Escola)

**Contexto**
Antes de emitir qualquer documento (histórico, ata, certificado, livro de matrícula), a rede e a
escola precisam configurar como esses documentos devem se comportar e ser exibidos: quais seções
aparecem, textos padrão, brasões, molduras, fundamentação legal aplicável etc. Hoje isso é feito
no sistema separado de Documentação Pedagógica; este card traz essa configuração para dentro do
Portal Eleva.

**Descrição**
Criar, dentro da aba **Documentação Pedagógica > Configurações**, a tela de configuração por rede
e por escola, permitindo que o usuário:

- Selecione uma rede e configure, por documento, como ele deve ser gerado:
  - **Geral**: nomenclatura de séries usada nos documentos, exibição de notas, status "aprovado
    pelo conselho", entre outras opções gerais.
  - **Histórico Escolar**: opções de exibição (brasão, observações, agrupamento por área do
    conhecimento, ocultar resultados parciais, etc.).
  - **Ficha Individual**: opções específicas de exibição da ficha.
  - **Ata de Resultados Finais**: opções de exibição (código INEP, frequência, resultado
    abreviado, etc.).
  - **Certificado de Conclusão**: define se a rede emite certificado, tipo de certificado (por
    segmento ou por série), brasões (esquerda/centro/direita), moldura e cor, texto da lei/termo.
  - **Livro de Matrícula**: opções de exibição (RA, código INEP, ordenação por data de matrícula,
    agrupamento por segmento).
- Cadastre e edite as **fundamentações legais** aplicáveis à rede (base legal citada nos
  documentos oficiais).
- Configure dados específicos por **escola**: nome de exibição, cabeçalho, assinaturas
  (secretaria, diretor, coordenador, professor inspetor) que aparecem nos documentos emitidos por
  aquela unidade.

**Escopo**
- Tela de seleção de rede + hub de configuração com as seções acima.
- Cadastro/edição de fundamentação legal por rede.
- Configuração por escola (cabeçalho e assinaturas).

**Fora de escopo (não incluído neste card)**
- Upload de imagem de brasão — assume-se que a imagem já está cadastrada em outro fluxo; o upload
  em si pode virar um card próprio se for necessário.
- Emissão dos documentos em si (Histórico, Ata, Certificado, Livro de Matrícula) — coberto pelos
  cards "Documentos da Turma" e "Documentos do Aluno".

**Critérios de aceite**
- Usuário consegue selecionar uma rede e visualizar/editar todas as seções de configuração
  listadas acima.
- Usuário consegue cadastrar, editar e inativar uma fundamentação legal vinculada à rede.
- Usuário consegue configurar cabeçalho e assinaturas de uma escola específica.
- Configurações salvas refletem corretamente nos documentos emitidos (validado em conjunto com os
  cards de Documentos).

---

### Card 2 — Aba de Turmas (filtro + lista)

**Contexto**
É o ponto de entrada para os documentos gerados por turma (Ata de Resultados Finais e Livro de
Matrícula). Hoje o usuário precisa entrar no sistema separado de Documentação Pedagógica para
localizar a turma antes de emitir esses documentos.

**Descrição**
Criar, dentro da aba **Documentação Pedagógica > Turmas**, a tela de listagem de turmas com
filtro (por rede, escola, ano letivo, série/segmento), permitindo que o usuário localize
rapidamente a turma desejada e, a partir dela, acesse os documentos daquela turma.

**Escopo**
- Tela de filtro + lista de turmas.
- Navegação da turma selecionada para os documentos (card "Documentos da Turma").

**Fora de escopo (não incluído neste card)**
- Geração dos documentos em si — coberto pelo card "Documentos da Turma" (Parte 2).
- Cadastro/edição de turma — turma já é gerenciada em outra área do Portal Eleva; aqui é somente
  consulta.

**Critérios de aceite**
- Usuário consegue filtrar turmas por rede, escola, ano letivo e série/segmento.
- Usuário consegue selecionar uma turma da lista e navegar para a tela de documentos daquela
  turma.

---

### Card 3 — Aba de Alunos (edição de dados, fundamentação, observações)

**Contexto**
É o ponto de entrada para o histórico do aluno. Hoje, buscar um aluno e editar seus dados
complementares (fundamentação aplicada, observações, registro de certificado) exige acessar o
sistema separado de Documentação Pedagógica.

**Descrição**
Criar, dentro da aba **Documentação Pedagógica > Alunos**, a busca/listagem de alunos e o hub de
edição com as seguintes sub-telas:

- **Dados do aluno**: visualização dos dados cadastrais do aluno (nome, documentos, filiação —
  reaproveitando o cadastro que já existe no Portal Eleva, sem duplicar informação).
- **Fundamentação legal do aluno**: seleção de quais fundamentações legais (cadastradas no Card 1)
  se aplicam a este aluno específico.
- **Observações**: registro de observações livres por ano letivo (fundamental/médio), que podem
  aparecer nos documentos emitidos.
- **Registro de certificado**: número, folha e livro de registro do certificado de conclusão do
  aluno.

**Escopo**
- Busca/listagem de alunos com filtro.
- Sub-telas de fundamentação, observações e registro de certificado (edição completa).
- Sub-tela de dados do aluno (visualização; edição fica fora de escopo — ver abaixo).

**Fora de escopo (não incluído neste card)**
- **Edição** de dados cadastrais do aluno (nome, CPF, RG, nacionalidade, filiação) — esses dados
  já são editados em outro fluxo do Portal Eleva; precisa de uma investigação própria (fora deste
  card) para decidir se essa tela redireciona para o fluxo existente ou é descontinuada.
- Histórico de séries cursadas e resultado final por disciplina — coberto pelo card "Edição do
  Histórico do Aluno".
- Emissão de Ficha Individual / Certificado de Conclusão — coberto pelo card "Documentos do
  Aluno" (Parte 2).

**Critérios de aceite**
- Usuário consegue buscar um aluno por nome/critério de filtro.
- Usuário consegue visualizar os dados cadastrais do aluno selecionado.
- Usuário consegue vincular/desvincular fundamentações legais ao aluno.
- Usuário consegue registrar observações por ano letivo.
- Usuário consegue registrar número/folha/livro do certificado do aluno.

---

### Card 4 — Edição do Histórico do Aluno

**Contexto**
É a parte mais crítica do histórico escolar: o registro, série a série, do resultado final do
aluno em cada componente curricular, usado tanto para consulta quanto para gerar a Ficha
Individual e a Ata de Resultados Finais. Por ser mais complexo (grade de disciplinas, carga
horária, resultado por componente curricular), foi destacado da "Aba de Alunos" em card próprio.

**Descrição**
Dentro do hub de edição do aluno (Card 3), criar a tela de **histórico por série**, mostrando as
séries cursadas pelo aluno e, para cada uma, a grade de disciplinas com o resultado final
(aprovado/reprovado/etc.), carga horária e demais informações que compõem o histórico escolar
oficial do aluno.

**Escopo**
- Listagem das séries cursadas pelo aluno.
- Visualização da grade de disciplinas e resultado final por série (consulta).

**Fora de escopo (não incluído neste card)**
- **Edição** disciplina a disciplina do resultado final — nesta primeira entrega a grade é
  somente leitura; a edição fica registrada como pendência para um card futuro, caso o produto
  decida que é necessária dentro do Portal Eleva (hoje pode continuar sendo feita por outro meio,
  a confirmar com o time).
- Cadastro de escola externa em cascata (país/estado/cidade) para séries cursadas fora da rede —
  simplificado para um campo único de escola nesta entrega; cascata completa fica como possível
  refinamento futuro.

**Critérios de aceite**
- Usuário consegue visualizar todas as séries cursadas por um aluno, com o resultado final por
  disciplina de cada série.
- Usuário consegue visualizar a carga horária total e por disciplina.

---

## Parte 2

### Card 5 — Documentos da Turma (Ata de Resultados Finais e Livro de Matrícula)

**Contexto**
A partir da turma selecionada (Card 2), a escola precisa emitir dois documentos oficiais que
consolidam informações de todos os alunos da turma: a Ata de Resultados Finais (resultado de cada
aluno em cada componente curricular, usada para registro em conselho de classe) e o Livro de
Matrícula (registro oficial de matrícula de todos os alunos da turma).

**Descrição**
A partir da tela de turma (Card 2), permitir que o usuário:

- Gere e visualize a **Ata de Resultados Finais** da turma, com o resultado de cada aluno,
  respeitando as configurações definidas no Card 1 (exibir código INEP, frequência, resultado
  abreviado etc.), e registre uma **observação editável** por turma/ano letivo que aparece na ata.
- Gere e visualize o **Livro de Matrícula** da turma, com os alunos matriculados, respeitando as
  configurações definidas no Card 1 (RA, código INEP, ordenação por data de matrícula, agrupamento
  por segmento).
- Exporte/imprima ambos os documentos.

**Escopo**
- Geração e impressão da Ata de Resultados Finais por turma.
- Geração e impressão do Livro de Matrícula por turma.
- Edição de observação da Ata por turma/ano letivo.

**Fora de escopo (não incluído neste card)**
- Ficha Individual e Certificado de Conclusão (documentos por aluno) — coberto pelo card
  "Documentos do Aluno".
- Edição do resultado final disciplina a disciplina — depende do card "Edição do Histórico do
  Aluno" (que hoje também é somente leitura).

**Critérios de aceite**
- Usuário consegue gerar a Ata de Resultados Finais de uma turma, refletindo as configurações da
  rede (Card 1) e o resultado final de cada aluno (Card 4).
- Usuário consegue registrar uma observação na Ata e ela aparece no documento gerado.
- Usuário consegue gerar o Livro de Matrícula de uma turma, refletindo as configurações da rede.
- Ambos os documentos podem ser impressos/exportados.

---

### Card 6 — Documentos do Aluno (Ficha Individual e Certificado de Conclusão)

**Contexto**
A partir de um aluno específico (Card 3), a escola precisa emitir dois documentos oficiais
individuais: a Ficha Individual (histórico consolidado do aluno) e o Certificado de Conclusão
(documento emitido quando o aluno conclui um segmento/curso).

**Descrição**
A partir do hub do aluno (Card 3), permitir que o usuário:

- Gere e visualize a **Ficha Individual** do aluno, consolidando o histórico de séries (Card 4) e
  respeitando as configurações da rede (Card 1) — incluindo os diferentes escopos que podem
  aparecer (regular, diversificado, itinerário, dependência) e o percentual de frequência.
- Gere e visualize o **Certificado de Conclusão** do aluno (frente e verso), respeitando as
  configurações e fundamentação legal definidas no Card 1 (brasões, moldura, texto legal, tipo de
  certificado por segmento ou por série).
- Exporte/imprima ambos os documentos.

**Escopo**
- Geração e impressão da Ficha Individual por aluno.
- Geração e impressão do Certificado de Conclusão por aluno (tabela padrão de disciplinas).

**Fora de escopo (não incluído neste card)**
- Variante do Certificado de Conclusão com disciplinas **agrupadas por área do conhecimento** —
  fica registrada como possível refinamento futuro, a priorizar com o time caso alguma rede
  precise dessa variante.
- Ata de Resultados Finais e Livro de Matrícula (documentos por turma) — coberto pelo card
  "Documentos da Turma".

**Critérios de aceite**
- Usuário consegue gerar a Ficha Individual de um aluno, refletindo o histórico de séries e as
  configurações da rede.
- Usuário consegue gerar o Certificado de Conclusão de um aluno (frente e verso), refletindo
  brasões, moldura e texto legal configurados na rede.
- Ambos os documentos podem ser impressos/exportados.
