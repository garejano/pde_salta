# Resumo — Editor de Documentos genérico (evolução futura, não amarrada à migração atual)

## Importante: escopo

Isso **não** mexe na migração de Documentação Pedagógica em andamento nem no modelo de
configuração por Rede/Escola — esse continua exatamente como está. É uma evolução futura e
independente, focada só em uma pergunta: **como estruturar Documento/Bloco/Editor dentro do
`document-builder` para que ele consiga expressar regra de negócio real**, sem se prender de novo
a "Rede/Escola" como os únicos consumidores possíveis. Quem vai usar cada documento (Rede, Escola,
outra coisa) fica para uma decisão posterior.

## O que já existe hoje

- O motor que renderiza documentos (`document-builder`) já é genérico — trabalha com uma lista de
  blocos (`DocumentEntry[]`), cada um um componente independente (Cabeçalho, Tabela, Assinatura,
  etc.).
- Já existe, em uma área de protótipos do `estrutura-pedagogica`
  (`features/exemplos/document-editor`), um **editor visual funcional**: arrasta blocos, monta um
  documento, configura cada bloco. Usa os mesmos componentes reais de produção.

O que falta para virar estrutura de produção:
- o catálogo de blocos hoje é só um objeto fixo no código do frontend — sem persistência, sem
  como existir um bloco novo sem deploy;
- um documento montado no editor não é salvo em lugar nenhum — vive só na sessão;
- os blocos hoje são só "estruturais" (cabeçalho, tabela genérica). Não existe ainda um bloco que
  carregue **regra de negócio própria** — por exemplo, uma "Tabela de Notas do Histórico" que sabe
  se configurar (agrupar por área do conhecimento, ocultar resultados parciais etc.), em vez de ser
  só um formulário solto como é hoje.

## A proposta

Formalizar três conceitos como catálogo persistido, sem amarrar a nenhum consumidor:

- **BlocoTipo** — cada tipo de bloco que o editor sabe montar, com seu componente visual e o
  schema da configuração de negócio que ele aceita.
- **DocumentoTipo** — um documento é uma sequência ordenada de blocos.
- **Documento** — uma instância configurada de um `DocumentoTipo`, salva de verdade (não só na
  memória do editor).

Ponto-chave do desenho: separar **config do bloco** (decisão tomada uma vez, ex. "agrupar por área
do conhecimento") de **dado runtime** (preenchido na hora de gerar o documento pra um aluno/turma
específico) — o modelo genérico cobre só a primeira parte; a busca de dado continua sendo
responsabilidade específica de cada domínio, como já é hoje.

A estrutura deve simplesmente **não fechar a porta** para um vínculo com consumidor no futuro (não
hardcodar Rede/Escola em lugar nenhum) — decidir como esse vínculo funciona fica para depois.

## Como o catálogo cresce

Produto/dev cria um bloco novo sempre que a regra de negócio pedir — por exemplo, se o Certificado
de Conclusão precisa de um cabeçalho diferente do cabeçalho padrão, cria-se um bloco específico
("Cabeçalho Certificado"), em vez de forçar o cabeçalho genérico a cobrir todos os casos via
flags de configuração. A partir do momento em que esse bloco é registrado no catálogo (via
deploy/migration, não em runtime), ele fica disponível na biblioteca de blocos do editor para
**qualquer** documento — nasceu de uma necessidade específica, mas não fica preso a ela. É esperado
e saudável ter blocos parecidos, mas distintos, no catálogo (`cabecalho`, `cabecalho-certificado`
etc.) em vez de um único bloco genérico tentando cobrir tudo.

## Caminho sugerido (em paralelo à migração atual, sem depender dela)

1. Persistir o catálogo que já existe no protótipo (`BlocoTipo`/`DocumentoTipo` como tabelas
   reais, em vez de objeto fixo no código).
2. Dar a `Documento` existência própria — salvar/carregar/versionar um documento configurado,
   ainda sem vínculo a nenhum consumidor.
3. Modelar o primeiro bloco de regra de negócio real (ex.: Tabela de Notas do Histórico), para
   validar que o modelo aguenta regra de negócio e não só blocos estruturais.
4. (Futuro, fora desta fase) decidir como Rede/Escola/outro consumidor se conecta a `Documento`.

## Como o dado chega até os blocos — três categorias, não uma só

A maior parte de um "documento personalizado" é, na prática, **dado fixo do consumidor**: valores
digitados uma vez na configuração (texto da lei/termo, nome dos signatários, flags de exibição) e
que aparecem exatamente assim em todo documento gerado — aqui não existe busca em tempo de geração,
o bloco só lê o que já está salvo.

Uma segunda categoria é **dado que varia por execução** (por aluno/turma) — ex.: a grade de notas do
Histórico. Aqui, cada `DocumentoTipo` continua com sua própria fonte de dado, definida por dev, como
já é hoje (um endpoint por domínio, ex. algo equivalente a um `dadosHistorico`, devolvendo um DTO
específico) — só que agora isso vira uma etapa explícita e sempre no mesmo formato: o documento sabe
a URL, sabe o DTO, e sabe distribuir esse DTO entre os blocos que o compõem.

E existe uma terceira categoria: **blocos autossuficientes**, que sabem sozinhos de onde puxar seu
próprio dado, sem depender nem da config digitada nem da distribuição do documento. O exemplo
natural é o **Cabeçalho** — nome/endereço/CNPJ da instituição não são digitados nem vêm do DTO do
Histórico/Ata/Certificado, o bloco Cabeçalho sabe puxar isso direto do cadastro de Escola, e
qualquer documento que use esse bloco reaproveita a mesma fonte.

Em todos os casos, o bloco continua "cego" quanto a detalhes fora da sua própria responsabilidade —
o que muda é só onde ele busca (config salva, distribuição do documento, ou fonte própria). Isso
preserva o motor de renderização (`document-builder`) exatamente como funciona hoje.

## Achado real que confirma a necessidade: o Certificado de Conclusão já "burla" o Cabeçalho

Mapeei os blocos que cada documento já usa hoje (Diário de Classe e Ficha Individual são reais/em
produção; Histórico Escolar só existe como protótipo; Ata de Resultados Finais e Livro de
Matrícula ainda não têm nenhuma implementação). O achado mais importante: o **Certificado de
Conclusão real não usa o bloco padrão de Cabeçalho** — o layout institucional dele ("REPÚBLICA
FEDERATIVA DO BRASIL...") é diferente do cabeçalho com logo/endereço usado no Diário e na Ficha, e
hoje isso é resolvido escrevendo esse texto à mão, direto no componente TypeScript da tela, em vez
de ser um bloco configurável. É exatamente o caso de uso do "Cabeçalho Certificado" — a estrutura
proposta resolveria isso como um bloco de catálogo de primeira classe, em vez de código específico
escondido numa tela.

Também achei uma divergência interessante: o protótipo do editor para o Certificado (área de
exemplos) assume cabeçalho padrão + moldura dourada — diferente da versão real, que não usa nenhum
dos dois. Sinal de que o protótipo ainda não foi validado contra o caso de uso de verdade.

## Outro achado: o loop "Documento → Editor" já existe, só falta persistir

Existe uma segunda tela de protótipo (`/exemplos/documents`) com uma galeria de exemplos — 8
mockups de documentos de negócio (Histórico Escolar, Certificado de Conclusão, Ata de Reunião,
Boletim Escolar, Declaração de Matrícula, Plano de Aula, Relatório Pedagógico, Comunicado aos
Pais) e 14 testes técnicos do motor de renderização. Um botão dessa galeria já faz exatamente o
fluxo "abrir um documento existente no editor de blocos" — só que hoje isso é efêmero (perdido a um
refresh de página), porque o documento nunca é salvo de verdade, só passado de uma tela para outra
em memória. É mais uma confirmação de que a Fase 2 (dar a `Documento` existência salva) é o passo
que falta, não uma reformulação do que já existe.

## Decisão: config de cada bloco é um JSON salvo inteiro

A configuração de cada bloco (`ConfiguracaoBloco`) fica salva como um JSON único por bloco, em vez
de uma coluna por campo. É mais simples de evoluir — um bloco novo, ou um campo novo num bloco já
existente, não exige alterar schema de banco. O trade-off aceito: perde-se validação de estrutura em
nível de banco (fica a cargo da aplicação, contra o schema de config que cada bloco já declara) e
fica mais difícil consultar um campo específico direto no banco (ex.: "quantas redes usam brasão da
Unesco?" exigiria ler o JSON) — aceitável porque esse tipo de consulta analítica não é um caso de
uso frequente hoje.

## Boas práticas que dá pra adotar já, sem esperar as fases acima

O mapeamento de código real expôs alguns atritos concretos que não dependem de nenhuma mudança de
banco/backend — são só convenção de código, e já reduzem o custo de migrar pro modelo genérico
quando chegar a hora:

- **Separar config de dado runtime na própria interface do bloco** (hoje `DocGridDiarioData`
  mistura os dois sem distinção nenhuma).
- **Tirar a montagem de blocos de dentro do componente Angular** (`buildEntries`/`buildBundle`
  hoje são métodos privados de tela) e colocar num "assembler" dedicado e testável por documento.
- **Eliminar duplicação** — o mapeamento de Cabeçalho (`buildHeaderData`) está copiado
  quase idêntico em dois componentes diferentes (Diário e Lista de Presença).
- **Manter o catálogo do editor sincronizado** — hoje ele cobre só 7 dos ~25 blocos reais que já
  existem em produção; tratar isso como parte do "pronto" de todo bloco novo.
- **Organizar as pastas de blocos por natureza** (genérico vs específico de um documento), em vez
  de tudo plano na mesma pasta.
- **Tipar a criação de blocos** em vez de usar `as XyzData` manual (hoje repetido em toda tela).
- **Formalizar a convenção de nome dos DTOs de documento** (`<Documento>DocumentoResponse`/
  `Request`) — já seguida informalmente, só nunca escrita como regra.
- **Usar a galeria de exemplos como vitrine obrigatória** de todo bloco/documento novo, pra manter
  um catálogo visual sempre atualizado.

## Dois contratos de código: `IDocumento` e `IGenericDocument`

Pra formalizar isso em código (sem esperar nenhuma das fases futuras), a análise completa propõe
dois contratos complementares:

- **`IDocumento<TFiltro, TDto>`** — para documentos com regra de negócio própria, escrita por dev
  (Certificado, Histórico, Diário): define de onde vem o dado, como monta a config, como distribui
  o dado entre os blocos, e como reagir quando o usuário muda a config geral ou a config de um
  bloco específico. Um runtime único e genérico (`DocumentoRuntime`) implementa o ciclo de vida
  (carregar → montar → exibir → reagir → imprimir/salvar) chamando essa interface — quem cria um
  documento novo só escreve a interface, nunca reimplementa o ciclo de vida.
- **`IGenericDocument`** — para documentos montados por um usuário no editor de blocos, sem
  nenhuma linha de código nova (é a formalização do `EditorDocument` que já existe no protótipo).
  Na prática, é o **caso degenerado** de `IDocumento`: não precisa buscar dado (o que o usuário
  configurou no editor já é o dado) nem tem lógica própria de distribuição (só mapeia cada bloco
  pro componente do catálogo). Isso deixa clara uma régua prática: um documento só pode nascer
  inteiramente no editor, sem card de dev, se todos os seus blocos forem de config fixa. No
  momento em que um bloco precisa buscar dado em tempo de geração (ex.: grade de notas), o
  documento passa a exigir uma `IDocumento` de verdade, escrita por dev.

## Mais três camadas que também se beneficiam de um contrato

Além de `IDocumento`/`IGenericDocument`, o mapeamento apontou três outros pontos do fluxo que hoje
não têm contrato nenhum e acabam gerando código duplicado ou soluções isoladas:

- **`IBlocoDefinicao`** — hoje a lógica de "como montar os dados de um bloco" vive duplicada dentro
  de cada documento que usa aquele bloco (ex.: vários documentos remontam do zero um bloco de
  "dados de identificação" parecido). Dar ao catálogo de blocos uma função de montagem própria
  (`montar(config, dado)`) tira essa lógica do documento e deixa reaproveitável por qualquer um que
  use o mesmo bloco.
- **`IConfiguracaoBlocoStore`** — o Carômetro já tem, hoje, um service real de
  `carregar/salvar/restaurar padrão` para sua própria config. Generalizar isso como contrato deixa
  qualquer bloco novo com config persistida sem precisar escrever esse service do zero — e esconde
  atrás da interface se o escopo é por usuário, Rede, Escola ou o que vier depois.
- **`IBlocoConfigEditor`** — o Carômetro também já tem sua própria tela de configuração ao vivo,
  construída à parte, sem contrato com o editor de blocos genérico. Um contrato mínimo
  (`config` + `configChange`) deixaria qualquer painel de configuração — genérico ou específico —
  plugável no mesmo inspector do editor.

## Refinamento: dado já em mãos, e renderizar vários de uma vez

Revendo os exemplos reais, `IDocumento` buscar seu próprio dado (`carregarDados`) **não é o caso
mais comum hoje** — na prática, é a tela que busca o dado (com seu próprio filtro/service) e só
repassa já pronto pra virar bloco e renderizar. Por isso `carregarDados` virou **opcional**, e o
runtime ganhou dois pontos de entrada: `renderizar(dto)` (dado já em mãos — o caso mais comum) e
`abrir(filtro)` (só quando o documento realmente busca sozinho).

Também formalizei o caso de **renderizar vários documentos de uma vez** — ex.: carregar o
histórico de uma lista inteira de alunos e gerar todos juntos. Isso já existe hoje de verdade (o
Carômetro já faz isso: uma turma vira várias listas, cada uma seu próprio documento, todas
entregues juntas pro `document-builder`) — só formalizei como um método `renderizarLote(dtos[])`
que reaproveita a mesma `IDocumento`, sem precisar de nenhuma interface nova.

## Achado de segurança real: o PDF hoje confia no que está na tela

Ponto levantado pelo time e confirmado lendo o pipeline de geração de PDF: **hoje não existe
nenhuma garantia de que o PDF final reflete o dado real do banco.** As duas estratégias de geração
usadas hoje (`pdfStrategy: 'frontend'`, o default — usado justamente pelo **Certificado de
Conclusão e pela Ficha Individual**, os dois documentos com mais valor legal do domínio — e
`pdfStrategy: 'backend'`, usado por Diário e Lista de Presença) têm o mesmo problema de fundo: o
valor que vira PDF é o que está no DOM/estado do Angular no momento da geração — território do
próprio usuário. `'backend'` não é tão seguro quanto o nome sugere: ele só manda o HTML já
renderizado no navegador pro servidor rasterizar, sem revalidar nada contra o banco. Um aluno com
DevTools aberto pode, em teoria, alterar uma nota ou um resultado final no DOM antes de gerar o
PDF, e nada hoje percebe isso.

A correção de fundo: documento marcado como protegido não pode confiar em HTML/dado vindo do
cliente — o PDF precisa ser gerado a partir de dado que o próprio servidor re-busca (ou
re-verifica) no momento da geração, nunca do que está renderizado na tela.

Proposta (isolada como módulo `protectDocument`, dado o custo real de implementar):
- **Solução completa**: documento protegido manda só uma referência (ex.: hash do aluno + ano
  letivo) pro servidor — nunca HTML, nunca os valores de negócio. O servidor re-busca o dado
  sozinho e re-renderiza. Custo real: exige que a montagem do documento também rode no servidor —
  por isso faz sentido isolar isso como algo opcional, só para os documentos que realmente
  precisam (Histórico, Boletim, Certificado, Ata, Declaração de Matrícula).
- **Alternativa mais leve**: assinar (HMAC) os campos protegidos no momento em que o servidor
  entrega o dado original pra tela; na hora de gerar o PDF, reenviar os campos + a assinatura — o
  servidor só aceita se a assinatura bater. Isso sim é um uso real e barato de "criptografia" aqui
  (microssegundos, sem custo de performance) — mas prova só que o valor não foi alterado, não que
  ainda é o mais atual do banco.
- **Mitigação imediata, de baixo custo**: trocar Certificado e Ficha Individual pra
  `pdfStrategy: 'backend'` já reduz a exposição mais óbvia — mas não resolve o problema de fundo,
  é só um remendo até a solução de verdade existir.

## Como o "servidor re-busca e re-renderiza" (8.3) funcionaria na prática

Duas formas óbvias de imaginar isso — só uma funciona:

- **"Manda o HTML pro servidor logo no primeiro render, usa esse guardado na hora de imprimir"** —
  não resolve, pela mesma razão de sempre: quem dispara esse envio continua sendo o navegador do
  próprio usuário. Um atacante com proxy ou debugger intercepta o dado *antes* desse envio
  acontecer (entre o servidor mandar o dado original e o Angular montar a tela) — o que fica
  "guardado" já nasce fraudado.
- **"O backend substitui, dentro do HTML recebido, os valores por dados válidos"** — mais perto de
  funcionar, mas tem uma armadilha real: como a geração de PDF hoje tira um "print" visual da
  página, nada impede o HTML do cliente de sobrepor visualmente o valor correto com um `div`
  fraudado por cima (`position: absolute`). Só funciona se o servidor isolar completamente a região
  protegida de qualquer CSS vindo do cliente — viável, mas exige cuidado real.

**Decidido com o time**: o servidor renderiza a região protegida inteira, sozinho, sem receber HTML
nenhum do cliente pra ela. Como o `pdfStrategy: 'backend'` já usa Playwright no servidor hoje, o
jeito mais simples de fazer isso sem duplicar o template em duas linguagens é o próprio Playwright
do servidor **navegar pra uma rota de impressão interna**, dentro do mesmo app Angular — os mesmos
componentes de sempre, só que abertos numa sessão controlada pelo servidor (que busca o dado
sozinho), nunca pelo navegador do aluno. O aluno manda só uma referência (hash do aluno + ano
letivo) — nunca HTML, nunca os valores de nota. Isso reaproveita toda a lógica de montagem que já
existe, sem reimplementar template em outro lugar.

**Ponto que não pode ficar em aberto**: essa rota de impressão não pode ser só mais uma rota
pública — senão trocar o `hashAluno` na URL vira um jeito de imprimir o documento de outro aluno
(trocaria um problema de integridade por um de autorização). Precisa ou (a) viver isolada na rede
interna do backend, inalcançável pelo navegador do aluno, ou (b) ser destravada só por um token de
uso único que o próprio backend gera e consome, sem nunca passar pelo navegador do aluno.

## Perguntas em aberto para o time

- Vale a pena mapear, documento por documento (Histórico, Ata, Certificado...), quais partes já são
  genéricas o suficiente para virar bloco e quais são específicas demais para forçar?
- A etapa de "distribuir o DTO entre os blocos" roda no backend (endpoint já entrega o dado
  pré-fatiado) ou no frontend (um serviço por documento que recebe o DTO cru e distribui)? Detalhe
  de implementação, não muda o modelo.

Análise completa (achados técnicos, modelo de dados detalhado, riscos): `estrutura_documentos.md`
nesta mesma pasta.
