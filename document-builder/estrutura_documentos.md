# Documento genérico — evolução do document-builder para um Editor de Documentos

> **Escopo explícito:** este documento **não** propõe mexer na migração em andamento
> (`projetos/MigracaoDocPed`, ver `projetos/migracao_doc_ped/` no pde_salta) nem no modelo de
> configuração por Rede/Escola, que continua exatamente como está hoje. Isso é uma **evolução
> futura e independente**: pensar a estrutura de **Documento / Bloco / Editor** dentro do
> `document-builder` de forma genérica o suficiente para sustentar um editor de documentos de
> verdade — sem se prender de novo a "Rede/Escola" como os únicos consumidores possíveis. O vínculo
> com quem usa cada documento (Rede, Escola, ou outro) é uma decisão de integração posterior, fora
> do escopo desta análise.

## 1. Estado atual (contexto, não é o alvo desta mudança)

### 1.1 Configuração por Rede/Escola — mantém como está

`DocumentacaoPedagogica.ConfiguracaoRedeDocumentacaoPedagogica` (script:
`estrutura-pedagogica/backend/Scripts/documentacao-pedagogica-configuracoes-schema.sql`) é uma
única tabela, 1 linha por Rede, com ~50 colunas somando a configuração de 6 documentos diferentes
(Geral, Histórico, Ficha Individual, Ata, Livro de Matrícula, Certificado). `ConfiguracaoEscolaDocumentacaoPedagogica`
faz o mesmo para Cabeçalho/Assinatura por Escola. Ambas são 1:1 rígido (`UNIQUE(RedeId)`/
`UNIQUE(EscolaId)`).

Isso é citado aqui só como **contexto/motivação** — é o exemplo real de regra de negócio que a
estrutura genérica de Documento precisa conseguir expressar no futuro (cabeçalho, assinatura,
tabela de notas como blocos de um documento configurável). Não faz parte do escopo mudar esse
schema agora.

### 1.2 Motor de renderização (`document-builder`) — já é genérico

O `document-builder` (`shared/document-builder/`) já é desacoplado de qualquer consumidor: entende
só `DocumentConfig` + `DocumentEntry[]` (lista ordenada de `{ componentType, data }`, com
paginação/quebra automática). Os "blocos" já existem como componentes reais e independentes —
`DocHeaderComponent`, `DocSignatureComponent`, `DocTableComponent`, `DocWideTableComponent`,
`DocSectionComponent`, `DocInfoRowComponent`, `DocStatementComponent`, entre ~20 outros — cada um
com sua própria interface de dados (`DocHeaderData`, `SignatureConfig`, `DocTableData` etc.).

Esse motor **não precisa mudar**. O alvo desta proposta é a camada acima dele: como um documento é
definido (quais blocos, em que ordem, o que é configurável) e como isso vira dado persistido em vez
de código montado à mão por tela.

### 1.3 Já existe um protótipo do Editor — ponto de partida real

Em `estrutura-pedagogica/frontend/src/app/features/exemplos/document-editor/` já existe uma prova
de conceito do editor de documentos por blocos:

- `BlockRegistryService` — catálogo estático (`Record<BlockType, BlockDef>`) mapeando um tipo de
  bloco lógico (`header`, `section`, `statement`, `info-row`, `table`, `presenca-info`, `info-grid`)
  para seu componente Angular real do `document-builder`, ícone, categoria e `defaultData`.
- `EditorDocument { name, config: DocumentConfig, headerData, blocks: EditorBlock[] }` — um
  documento é literalmente uma lista ordenada de blocos com config própria.
- `EditorCanvasComponent`, `BlockLibraryComponent`, `BlockInspectorComponent`,
  `DocumentBuilderBlocksComponent` — canvas de montagem, biblioteca de blocos arrastáveis, painel de
  inspeção/edição de cada bloco.
- `DocumentImportService`/`fromEntries()` — converte um documento já renderizado de volta em blocos
  editáveis, se todos os componentes usados estiverem no catálogo.

Isso é o ponto de partida certo: o modelo "documento = lista de blocos configuráveis" já foi
validado na prática. O que falta para virar uma estrutura de produção:

- o catálogo de blocos é um objeto estático no código (`REGISTRY`) — sem persistência, sem
  possibilidade de existir um bloco novo sem deploy de frontend;
- `EditorDocument` não existe fora da sessão do editor — não há um `Documento` salvo/versionado no
  backend;
- os blocos do registry hoje só cobrem componentes **estruturais** (cabeçalho, tabela, seção,
  texto) — não há noção de bloco que carregue **regra de negócio própria** (ex.: um bloco "Tabela de
  Notas do Histórico" que sabe como se configurar: agrupar por área do conhecimento, ocultar
  resultados parciais, etc. — hoje isso é só um formulário solto, não um bloco do editor).

## 2. O que esta proposta cobre (e o que não cobre)

**Cobre:** como desenhar `Documento`, `Bloco` e o Editor de forma que:
- um documento novo (ex.: um tipo de atestado qualquer) possa ser definido sem mexer em schema;
- um bloco carregue tanto sua estrutura visual (o componente do `document-builder`) quanto seu
  **schema de configuração de negócio** (os campos que hoje são colunas soltas nas tabelas de
  Rede/Escola, mas generalizados por bloco);
- a estrutura não amarre, por construção, "quem configura o documento" a um tipo fixo de
  consumidor — isso deve ser um ponto de extensão claro, não uma FK cravada desde o início.

**Não cobre (fica para uma fase futura, fora deste documento):**
- Como `Documento` se conecta a Rede/Escola/outro consumidor concreto.
- Migrar dado das tabelas `ConfiguracaoRedeDocumentacaoPedagogica`/`ConfiguracaoEscolaDocumentacaoPedagogica`
  para o modelo novo.
- Qualquer mudança na migração em andamento (`projetos/MigracaoDocPed`).

## 3. Modelo proposto — Documento / Bloco / Editor

### 3.1 Entidades centrais (sem consumidor)

```
BlocoTipo             — catálogo persistido de tipos de bloco que o document-builder sabe renderizar
                         (hoje: BlockRegistryService.REGISTRY, estático no frontend)
                         chave (ex: "cabecalho", "assinatura", "tabela-notas-historico"),
                         componentRef (identifica o componente Angular do document-builder),
                         schemaConfig (shape esperado do `data` de configuração desse bloco),
                         categoria (estrutural | regra-de-negócio)

DocumentoTipo          — catálogo de documentos que o produto/dev disponibiliza
                         (ex: "Histórico Escolar", "Ata de Resultados Finais")
                         chave, nome, descrição

DocumentoTipoBloco     — quais blocos compõem um DocumentoTipo, em que ordem, e quais são
                         configuráveis (vs. fixos/estruturais, sem opção de mudar)
                         DocumentoTipoId, BlocoTipoId, ordem, configuravel (bool)

Documento              — uma instância concreta de um DocumentoTipo com valores de configuração
                         definidos (equivalente a um `EditorDocument` salvo/versionado)
                         DocumentoTipoId, nome, versao
                         *sem* campo de "dono"/consumidor nesta fase — ver seção 4

ConfiguracaoBloco      — 1 linha por (Documento, DocumentoTipoBloco), com o valor de configuração
                         daquele bloco nessa instância — ValoresJson (JSON salvo inteiro, decisão
                         confirmada — ver seção 5, item 4), validado pela aplicação contra o schemaConfig do
                         BlocoTipo correspondente antes de salvar
```

### 3.2 Separar "config de bloco" de "dado runtime" — a distinção mais importante

Um bloco como `DocTableData { columns, rows }` mistura dois conceitos diferentes:
- **Config** (parte do `Documento`/`ConfiguracaoBloco`): quais colunas existem, se agrupa por área
  do conhecimento, se oculta resultados parciais — decisões tomadas uma vez, na hora de configurar
  o documento.
- **Dado runtime** (não faz parte do `Documento`): as `rows` de fato — nome do aluno, notas — que só
  existem no momento de gerar o documento para um aluno/turma específico.

O modelo de `ConfiguracaoBloco` proposto cobre só a primeira parte. O pipeline de geração (hoje já
existe, por domínio, nos services .NET) continua responsável por casar a config do bloco com o dado
runtime e produzir o `DocumentEntry[]` final que o `document-builder` renderiza. Deixar esse
contrato explícito no desenho evita que o "bloco genérico" vire uma tentativa de generalizar
também a busca de dado — que é, e deve continuar sendo, específica de cada domínio (histórico,
frequência, notas).

**Refinamento confirmado com o time — nem todo bloco tem a mesma relação com dado runtime.** Na
prática, existem três categorias de bloco, não duas:

1. **Bloco de dado fixo do consumidor** — a maioria dos "documentos personalizados" é isso: o valor
   foi digitado uma vez na configuração (texto da lei/termo, nome dos signatários, flags de
   exibição) e é exatamente esse valor que aparece no documento gerado, sempre. Aqui `data` e
   `config` são a mesma coisa — não existe uma etapa de busca/distribuição em tempo de geração, só
   leitura do que já está salvo em `ConfiguracaoBloco`.
2. **Bloco de dado runtime via `DocumentoTipo`** — o valor varia por execução (por aluno/turma) e
   vem do fluxo descrito em 3.5 (o `DocumentoTipo` busca um DTO e distribui fatias entre os blocos)
   — ex.: a grade de notas do bloco `Tabela Histórico`.
3. **Bloco com fonte de dado própria** — alguns blocos sabem, por si só, de onde puxar o próprio
   dado, independente da configuração digitada e independente da distribuição central do
   `DocumentoTipo`. O exemplo natural é o **Cabeçalho**: os campos de nome/endereço/CNPJ da
   instituição não são digitados na configuração do documento nem vêm do DTO específico do
   Histórico/Ata/Certificado — o bloco Cabeçalho sabe puxar isso direto do cadastro de Escola
   (fonte única, reaproveitada por qualquer documento que use esse bloco).

Essa distinção importa para o desenho do `BlocoTipo`: além do `schemaConfig` (categoria 1) e do
contrato de dado esperado via distribuição (categoria 2), um `BlocoTipo` pode declarar que **é
autossuficiente** — tem sua própria fonte de dado embutida (categoria 3) e não depende nem da
config digitada nem da distribuição do `DocumentoTipo` para essa parte.

### 3.3 Blocos de regra de negócio (o que falta em relação ao protótipo atual)

O protótipo hoje só tem blocos "estruturais" (cabeçalho, tabela genérica, texto). Para a estrutura
sustentar de fato regra de negócio como a de Histórico/Ata/Certificado, um `BlocoTipo` precisa poder
representar algo como "Tabela de Notas do Histórico" — que não é uma tabela genérica configurável
por colunas quaisquer, mas um bloco com um `schemaConfig` próprio (ex.: `agruparPorAreaConhecimento:
bool`, `ocultarResultadosParciais: bool`, `exibirCargaHoraria: bool`) e uma lógica de montagem
própria por trás (que sabe transformar essa config + o dado runtime em um `DocTableData`/
`DocWideTableData` para o `document-builder`).

Isso é o que faz o catálogo deixar de ser só "componentes visuais reutilizáveis" (o que já existe)
e passar a ser "unidades de negócio configuráveis" (o que a migração atual resolve hoje com colunas
soltas, e que esta estrutura deveria conseguir expressar de forma genérica).

### 3.4 Fluxo de criação de bloco — quem cria, quando, como fica disponível

Confirmado com o time: o catálogo cresce **por necessidade de negócio, sempre via produto/dev**,
não por autoatendimento de usuário final em runtime. O fluxo é:

1. Produto/dev identifica que um documento precisa de algo que o catálogo atual não cobre — ex.:
   o Certificado de Conclusão precisa de um cabeçalho com layout/campos diferentes do cabeçalho
   padrão já usado no Histórico e na Ficha Individual.
2. Em vez de generalizar o `BlocoTipo` "Cabeçalho" existente para aceitar todas as variações
   possíveis, cria-se um **novo** `BlocoTipo` — ex.: `cabecalho-certificado` — com seu próprio
   componente (ou reaproveitando o componente Angular existente, se só a config muda) e seu próprio
   `schemaConfig`. É um registro novo no catálogo, feito por dev, via deploy/migration — não uma
   ação de configuração em runtime.
3. A partir desse registro, o bloco passa a aparecer na biblioteca de blocos do editor
   (`BlockLibraryComponent`) para **qualquer** `DocumentoTipo` sendo montado — nasceu da necessidade
   do Certificado, mas fica disponível pra qualquer documento futuro que precise do mesmo layout de
   cabeçalho, sem retrabalho.

Consequência prática para o modelo: **é normal e esperado ter blocos parecidos, mas distintos**, no
catálogo (`cabecalho`, `cabecalho-certificado`, futuramente talvez `cabecalho-ata`) em vez de um
único bloco "Cabeçalho" genérico tentando cobrir todo caso de uso via flags de configuração. Isso
evita o problema atual (uma tabela larga com dezenas de colunas condicionais) se repetir dentro do
próprio `schemaConfig` de um bloco só. A decisão de "criar bloco novo" vs. "adicionar campo de
config a um bloco existente" fica a critério de quem implementa, caso a caso — sem regra rígida
além de "se a variação for específica de negócio o suficiente para justificar, vira bloco próprio".

### 3.5 Fluxo de dado runtime — quem busca, quem distribui, quem consome

> Este fluxo cobre a **categoria 2** de bloco (ver 3.2) — dado que varia por execução e é
> distribuído centralmente pelo `DocumentoTipo`. Blocos de dado fixo (categoria 1) não passam por
> aqui — só leem o que já está salvo em `ConfiguracaoBloco`. Blocos autossuficientes (categoria 3,
> ex.: Cabeçalho) também não passam por aqui — têm sua própria fonte de dado, independente da
> distribuição central.

Confirmado com o time, usando o Histórico como exemplo concreto: cada `DocumentoTipo` tem sua
própria fonte de dado, definida por dev — hoje isso já existe como um endpoint por domínio (ex.:
algo equivalente a um `dadosHistorico`, análogo ao que já existe em `HistoricoAlunoController`),
devolvendo um DTO específico daquele documento. **Isso não muda** — o modelo genérico não tenta
unificar como cada domínio busca dado, só formaliza onde essa busca se encaixa no fluxo do
`Documento`:

1. **Busca** — o `DocumentoTipo` sabe qual endpoint chamar e qual é o shape do DTO de retorno (ex.:
   um `HistoricoDocumentoDTO`). Código de dev, específico daquele domínio, igual já é hoje.
2. **Distribuição** — o `DocumentoTipo` sabe como repartir esse DTO entre os blocos que o compõem:
   os dados de identificação do aluno vão para o bloco de ficha/cabeçalho, a grade de notas vai
   para o bloco `Tabela Histórico`, etc.
3. **Consumo** — cada bloco (ex.: `Tabela Histórico`) já sabe, por definição, que fatia de dado
   espera receber, e como combiná-la com sua própria config (agrupar por área do conhecimento,
   ocultar resultados parciais etc.) para virar o `data` final que o `document-builder` renderiza —
   é exatamente como os componentes `Doc*Component` já funcionam hoje (recebem `data` via
   `@Input`); o "fatiar e entregar" vira uma etapa explícita do fluxo do `DocumentoTipo`, em vez de
   código solto espalhado por tela como é hoje.

Resumindo o que foi confirmado: **a configuração do documento (`DocumentoTipo`) sabe a URL que
busca o dado, sabe o shape do DTO, e sabe distribuir os dados para os blocos.** Cada bloco continua
"cego" em relação à origem do dado — só sabe interpretar a fatia que chegou junto com sua própria
config — o que preserva o motor de renderização (`document-builder`) exatamente como está hoje.

Detalhe de implementação ainda em aberto (não bloqueia o desenho): se a etapa de "distribuição"
(DTO → fatia por bloco) roda no backend (endpoint já devolve o dado pré-fatiado por bloco) ou no
frontend (um serviço por `DocumentoTipo` que recebe o DTO cru e distribui) — decisão de
implementação, não de modelo.

### 3.6 Mapeamento de blocos existentes por documento (levantamento direto no código)

Levantamento feito lendo os componentes reais que já geram documento via `document-builder`
(`turmas/certificado-conclusao`, `ficha-individual`, `diario-de-classe/listar`) e os modelos de
exemplo do editor-protótipo (`exemplos/documents/modelos/`). Serve pra calibrar o desenho de
`BlocoTipo` com dado real, não hipotético.

| Documento | Status no código | Blocos (`document-builder`) usados | Observações relevantes |
|---|---|---|---|
| **Diário de Classe** | ✅ Real, em produção (`diario-de-classe/listar`) | `DocHeaderComponent` (cabeçalho), `DocInfoRowComponent` (identificação — repetida via `nextHeaderEntries` nas páginas seguintes), `DocGridDiarioComponent` (grade de chamada/presença), `DocInfoFrequenciaComponent` (resumo de aulas previstas/dadas), `DocGridConteudoComponent` (conteúdo ministrado), `DocGridRendimentoComponent` (notas/rendimento), `DocLastPageInfoComponent` (ficha de identificação na última página) | **Já é o exemplo mais maduro do padrão "bloco específico de negócio"**: 3 grids diferentes (`DocGridDiarioComponent`, `DocGridConteudoComponent`, `DocGridRendimentoComponent`) em vez de um `DocTableComponent` genérico — cada um sabe formatar seu próprio tipo de dado. Seções ligam/desligam por config (`secoes.exibirFrequencia` etc.) exatamente como um `DocumentoTipoBloco.configuravel` faria. O Cabeçalho aqui **não é autossuficiente** — vem como um campo `cabecalho` dentro do mesmo DTO principal (`DiarioDeClasseDocumentoResponse`), ou seja, é categoria 2 (distribuído pelo `DocumentoTipo`), não categoria 3. |
| **Ficha Individual** | ✅ Real, em produção (`features/ficha-individual`) | `DocHeaderComponent`, `DocInfoRowComponent` (identificação, turma, legenda, resumo), `DocSectionComponent` (título de cada escopo: Regular/Diversificado/Itinerário/Dependência), `DocWideTableComponent` (grade de notas por escopo), `DocStatementComponent` (observações), Assinatura (`SignatureConfig`) | Único documento hoje com `DocWideTableComponent` usado do jeito "pretendido" (grade de disciplinas × etapas que pode ter muitas colunas). Ainda com dado mockado (`MOCK_HEADER_DATA`, `MOCK_REQUEST`) — backend real não plugado (ver `migracao_doc_ped/backend.md`). |
| **Certificado de Conclusão** | ✅ Real, em produção (`documentacao-pedagogica/turmas/certificado-conclusao`) | `DocStatementComponent` (**"cabeçalho institucional" escrito à mão** — República/Estado/Secretaria — e também o texto do certificado, texto de observações), `DocInfoRowComponent` (posição dos 3 brasões, dados de conclusão/registro, carga horária total), `DocSectionComponent` (nome + endereço da escola, funcionando como um mini-cabeçalho substituto), `DocWideTableComponent` (disciplinas, parte diversificada) | **Achado mais relevante para a proposta**: este documento **não usa `DocHeaderComponent`** (`header.show: false` no `DocumentConfig`) — o "cabeçalho" dele é hoje uma composição manual de `DocStatement` + `DocSection`, escrita em TypeScript, porque o layout institucional do certificado (texto centralizado "REPÚBLICA FEDERATIVA...") é genuinamente diferente do cabeçalho com logo/endereço usado no Diário/Ficha. **Isso é exatamente o caso de uso do fluxo descrito em 3.4** — um `BlocoTipo` "Cabeçalho Certificado" resolveria isso como bloco configurável de primeira classe, em vez de código específico dentro do componente da tela. Também não usa `frame` (moldura) ainda, embora a UI original do Certificado (`design/01-configuracoes-ui-atual.md`) preveja 4 opções de moldura e o `DocumentConfig.frame`/`FrameConfig` já suportem isso — e o protótipo do editor já demonstra esse uso (ver linha abaixo). |
| **Histórico Escolar** | 🟡 Só protótipo (`exemplos/documents/modelos/historico-escolar.modelo.ts`) — **sem componente real de impressão no código ainda** | `DocHeaderComponent`, `DocSectionComponent` (Identificação, Trajetória, Complementar), `DocInfoRowComponent` (dados pessoais, filiação), `DocTableComponent` (tabela de disciplinas — **não** `DocWideTableComponent`), `DocStatementComponent` (base legal), Assinatura | O protótipo usa `DocTableComponent` simples para a grade de disciplinas; dado que a Ficha Individual (documento irmão, mesmo domínio) precisa de `DocWideTableComponent` para o mesmo tipo de grade (muitas colunas por etapa), é provável que o Histórico real também precise — vale não fixar `DocTableComponent` como certo só porque é o que o protótipo usa hoje. |
| **Certificado de Conclusão (protótipo)** | 🟡 Protótipo separado (`exemplos/documents/modelos/certificado-conclusao.modelo.ts`), **diverge do componente real** | `DocHeaderComponent` (usa o cabeçalho padrão, ao contrário da versão real!), `DocSectionComponent` (título, nome do egresso), `DocStatementComponent` (texto de certificação, continuação, base legal), `DocInfoRowComponent` (dados do curso), `frame` (moldura dourada) | Vale notar a **divergência entre o protótipo do editor e a implementação real**: o protótipo assume cabeçalho padrão + moldura; a versão em produção não usa nenhum dos dois (cabeçalho falso via texto, sem moldura). É um sinal de que o protótipo ainda não foi validado contra o caso de uso real — bom primeiro alvo se/quando a Fase 3 (bloco de regra de negócio) for atacada. |
| **Ata de Resultados Finais** | ⛔ Não implementado (nem real, nem protótipo) — só a UI de configuração existe (`design/01-configuracoes-ui-atual.md`) | — | Blocos prováveis, por inferência da UI de configuração: Cabeçalho, uma tabela de resultado por aluno/disciplina (`DocWideTableComponent`, dado o volume de colunas disciplina × aluno), `DocStatementComponent` para o campo "Complemento", Assinatura (até 4 signatários: secretário, diretor, professor inspetor, coordenador — já cabe em `SignatoryConfig[]`). |
| **Livro de Matrícula** | ⛔ Não implementado (nem real, nem protótipo) | — | Blocos prováveis: Cabeçalho, uma tabela de alunos matriculados (`DocTableComponent` ou `DocWideTableComponent`, a depender do nº de colunas — RA/RA digital/código Inep são poucas colunas, provavelmente `DocTableComponent` basta). Sem seção de Assinatura na UI original. |
| *(fora do escopo de Documentação Pedagógica, mas mesmo catálogo)* "Ata de Reunião" (`exemplos/documents/modelos/ata-reuniao.modelo.ts`) | 🟡 Protótipo | `DocSectionComponent`, `DocInfoRowComponent`, `DocTableComponent` (lista de participantes), `DocStatementComponent` (pauta, deliberações), Assinatura | **Não confundir com a Ata de Resultados Finais** — é um documento de negócio diferente (ata de reunião pedagógica/conselho de classe como evento, não o registro de resultado final de disciplina por aluno), só reaproveita nome parecido. Bom exemplo, ainda assim, de como os mesmos blocos estruturais (`Section`/`InfoRow`/`Table`/`Statement`) servem documentos de domínios bem diferentes — evidência a favor do catálogo genérico. |
| **Lista de Presença** (diária/semanal/mensal) — `lancamento-frequencia/lista-presenca` | ✅ Real, em produção | `DocHeaderComponent`, `DocPresencaInfoComponent` (info da turma, repetida via `nextHeaderEntries`), `DocTableComponent` (diária: Nº/RA/Nome/Assinatura; semanal: + colunas Seg–Sáb), `DocWideTableComponent` (mensal: 31 colunas, uma por dia, `fixedColumns: 3`) | **Um único componente gera 3 variantes de documento** (diária/semanal/mensal) trocando só a tabela central — cada variante já hoje seria um `DocumentoTipo` distinto no modelo proposto, compartilhando o bloco `Cabeçalho`/`Info da turma` e divergindo só na tabela. Evidência real de que "documentos parecidos, blocos centrais diferentes" já é o padrão natural do domínio. |
| **Carômetro** — mesmo componente (`lista-presenca`) + protótipo (`exemplos/carometro-exemplo`) | ✅ Real, em produção | `DocHeaderComponent`, `DocCarometroInfoComponent` (**variante própria do info de turma**, distinta do `DocPresencaInfoComponent` usado nas listas de presença), `DocCarometroGridComponent` (grid de fotos configurável: variante de card, colunas, espaçamento, altura, visibilidade de campos) | **Achado mais importante desta rodada — já existe um precedente real e funcional de `ConfiguracaoBloco`.** `CarometroConfiguracaoService` (`get()`/`save()`/`restaurarPadrao()`) persiste no backend exatamente a configuração de **um bloco específico** (`quantidadeColunas`, `espacamento`, `alturaCard`, `formatoCard`, `exibirNomeAluno`, `exibirRA`, `exibirResponsavel`, `exibirTelefone`, `exibirEmail`), reaplicada toda vez que o usuário gera um novo Carômetro — e já existe até um painel de edição dedicado a esse bloco (`DocCarometroConfigPanelComponent`/`DocCarometroVariantPickerComponent`, ver 1.2). Isso é literalmente a categoria 1 (dado fixo, salvo, sem busca em tempo de geração) da seção 3.2, implementada ad-hoc para um bloco só. **Generalizar `ConfiguracaoBloco` é, na prática, pegar esse padrão que já existe e funciona para o Carômetro, e disponibilizá-lo para qualquer bloco novo sem reescrever um service+painel dedicado toda vez.** Único ponto de atenção: hoje essa config é persistida por usuário logado (não por Rede/Escola/Documento) — outro precedente real de escopo de configuração além de Rede/Escola, relevante para a seção 4 (ponto de extensão para consumidor). |

**Correção ao modelo da seção 3.2, à luz deste levantamento**: a categoria 3 ("bloco autossuficiente",
usando Cabeçalho como exemplo) é hoje **aspiracional, não observada na prática**. O único caso real
de Cabeçalho em produção (Diário de Classe, Lista de Presença, Carômetro) entrega o dado como um
campo `cabecalho` dentro do mesmo DTO principal do documento — ou seja, é categoria 2 (distribuído
pelo `DocumentoTipo`), só que meramente estruturado como um sub-objeto. Vale manter a categoria 3
no desenho como possibilidade (pode fazer sentido para o Cabeçalho vir de uma fonte 100%
compartilhada entre documentos, sem duplicar a busca em cada `DocumentoTipo`), mas sem tratar como
algo já validado — é uma decisão de implementação a testar quando houver mais de um documento
reaproveitando literalmente o mesmo Cabeçalho.

**Confirmação da categoria 1, com precedente real**: o Carômetro (ver linha da tabela acima) já é
um caso real e funcional de bloco de dado fixo/config, persistido e reaplicado — validando que o
modelo de `ConfiguracaoBloco` não é só teoria, é a generalização de algo que já existe hoje para um
bloco só.

### 3.7 A galeria `/exemplos/documents` já fecha o loop Documento → Editor (em protótipo)

Além do `document-editor`, existe uma segunda tela de protótipo, `/exemplos/documents`
(`DocumentsComponent`), organizada em duas categorias:

- **`samples`** (14 itens) — testes de engenharia do motor (quebra de página, `DocWideTableComponent`
  com muitas colunas, 1000 linhas, debug) — não são documentos de negócio, são stress tests.
- **`modelos`** (8 itens) — mockups de documentos de negócio reais: além dos 3 já cobertos em 3.6
  (Histórico Escolar, Certificado de Conclusão, Ata de Reunião), há **Boletim Escolar**, **Declaração
  de Matrícula**, **Plano de Aula**, **Relatório Pedagógico** e **Comunicado aos Pais** — nenhum
  deles parte do escopo da Documentação Pedagógica (não estão entre os 6 documentos da migração
  atual), mas todos compostos com os mesmos 4 blocos básicos (`DocSectionComponent`,
  `DocInfoRowComponent`, `DocStatementComponent`, `DocTableComponent`) — evidência de que o catálogo
  genérico já serve documentos escolares de outros domínios, não só os da Documentação Pedagógica.

**Achado mais importante desta tela**: `DocumentsComponent.openInEditor()` já implementa, em
protótipo, o loop completo que esta proposta formaliza — pega qualquer amostra da galeria, converte
via `BlockRegistryService.fromEntries()` num `EditorDocument`, "estaciona" esse documento via
`DocumentImportService.stage()` e navega para `/exemplos/document-editor`, onde ele abre pronto para
edição por blocos. Isso já é, na prática, **"Documento existente → abrir no editor"** — só falta a
metade que a Fase 2 (seção 6) propõe: persistir esse `EditorDocument` de verdade, em vez de só
transportá-lo entre duas telas do frontend via um serviço em memória (`stage()` é efêmero — perdido
a um refresh de página).

## 4. Ponto de extensão para consumidor (design, não implementação)

A única coisa que esta fase precisa garantir é **não fechar a porta**: `Documento` e
`ConfiguracaoBloco` não devem ter nenhuma referência hardcoded a Rede/Escola, nem assumir 1:1 com um
único dono. Formas possíveis de conectar depois (a decidir quando chegar a hora, não agora):
- Um consumidor referencia um ou mais `Documento` diretamente (tabela de junção específica por tipo
  de consumidor, ex. `RedeDocumento`, `EscolaDocumento` — mais rígido, mais simples).
- Um vínculo genérico `TipoConsumidor + ConsumidorId → DocumentoId` (mais flexível, perde
  integridade referencial de FK).
- Cascata de herança (Escola herda config de Rede, campo a campo) — só relevante se/quando o
  vínculo acima existir.

Nenhuma dessas decisões precisa ser tomada agora — só evitar desenhar `Documento`/`BlocoTipo`/
`ConfiguracaoBloco` de um jeito que as inviabilize.

## 5. Dúvidas e riscos a resolver com o time

1. ~~**Quem edita o catálogo?**~~ **Resolvido** (ver 3.4): produto/dev, por necessidade de negócio,
   via deploy/migration — não é autoatendimento de usuário final em runtime. Uma vez registrado, o
   bloco fica disponível pra qualquer documento montado no editor.
2. ~~**Onde mora a lógica de montagem de um bloco de negócio?**~~ **Resolvido (fluxo)** — ver 3.5:
   o `DocumentoTipo` sabe a URL/endpoint que busca o dado, sabe o DTO de retorno, e sabe distribuir
   os dados entre os blocos; cada bloco só sabe interpretar a fatia que recebe + sua própria
   config. Fica em aberto só o detalhe de implementação (a distribuição roda no back, entregando
   dado já fatiado por bloco, ou no front, com um serviço por `DocumentoTipo`) — não muda o modelo.
3. ~~**Granularidade dos blocos.**~~ **Resolvido** (ver 3.4): criar um `BlocoTipo` novo e
   específico (ex. `cabecalho-certificado`) sempre que a variação for de negócio o suficiente, em
   vez de generalizar um bloco existente para cobrir todo caso via flags — decisão caso a caso, sem
   regra rígida. Ainda vale, na prática, ir mapeando documento por documento (Histórico, Ata,
   Certificado...) pra ir identificando esses blocos conforme aparecem, não de uma vez.
4. ~~**JSON de config x tipagem/validação.**~~ **Decidido**: `ConfiguracaoBloco.ValoresJson` é um
   JSON salvo inteiro por bloco (não colunas tipadas por campo) — mais simples de evoluir (um
   `BlocoTipo` novo, ou um campo novo num `BlocoTipo` existente, não exige alteração de schema) e
   condizente com o resto do modelo (cada bloco já tem seu próprio `schemaConfig` para validar a
   forma esperada, aplicação/API responsável por validar contra esse schema antes de salvar — o
   banco não valida estrutura interna do JSON). Trade-off aceito conscientemente: perde-se
   validação em nível de banco e facilidade de query direta sobre campos específicos (ex.: "quantas
   redes usam brasão da Unesco?" exigiria ler o JSON, não uma coluna) — aceitável dado que consultas
   analíticas sobre configuração não são um caso de uso frequente hoje.
5. **Versionamento de `Documento`.** Se a config de um `BlocoTipo` muda de shape (ex.: um campo novo
   de configuração), documentos já salvos com o shape antigo precisam de estratégia de migração —
   vale decidir isso no desenho do schema de `ConfiguracaoBloco`, não depois.

## 6. Caminho de evolução sugerido

Todas as fases abaixo são independentes da migração Rede/Escola em andamento — podem começar a
qualquer momento, em paralelo, sem depender dela terminar.

- **Fase 1 — persistir o catálogo que já existe no protótipo.** Criar `BlocoTipo`/`DocumentoTipo`
  como tabelas reais, espelhando o que já está hardcoded em `BlockRegistryService`. Sem mudar quem
  edita (continua sendo dev via migration/seed), só troca "objeto TS" por "fonte de verdade
  persistida". Baixo risco, não afeta nada em produção hoje.
- **Fase 2 — dar a `Documento` existência própria.** Hoje um `EditorDocument` só existe na memória
  do editor (`features/exemplos/document-editor`). Criar a entidade `Documento` + `ConfiguracaoBloco`
  no backend, permitindo salvar/carregar/versionar um documento configurado — ainda sem nenhum
  vínculo a consumidor, testável isoladamente com os blocos estruturais que já existem.
- **Fase 3 — adicionar o primeiro bloco de regra de negócio real.** Pegar um caso concreto (ex.:
  "Tabela de Notas do Histórico") e modelar como `BlocoTipo` com `schemaConfig` próprio + lógica de
  montagem, validando que o modelo aguenta regra de negócio e não só blocos estruturais.
- **Fase 4 (fora de escopo aqui) — decidir a integração com consumidor.** Só depois das fases
  acima provarem o modelo, decidir como Rede/Escola/outro consumidor se conecta a `Documento` — e
  nesse momento avaliar se/quando migrar o schema atual ou fazer os dois modelos conviverem.

## 7. Boas práticas recomendadas já hoje (sem esperar as fases da seção 6)

Levantamento das seções 3.6/3.7 expôs uma série de atritos concretos na estrutura atual do
`document-builder` que **não dependem de nenhuma mudança de schema/backend** — são convenções de
código que tornam mais fácil (e mais seguro) criar um documento ou bloco novo hoje, e que também
reduzem o custo de migrar para o modelo das seções 3–6 quando chegar a hora.

### 7.1 Separar "config" de "dado runtime" dentro da própria interface do bloco

Achado concreto: `DocGridDiarioData` (`document-config.ts`) mistura `aulas`/`alunos` (dado runtime,
muda a cada geração) com `configuracao` (decisão de negócio — quais caracteres usar pra
presença/falta/pendência etc., categoria 1 da seção 3.2) dentro da mesma interface, sem nenhuma
distinção estrutural entre os dois. Um developer olhando a interface não tem como saber, só pelo
tipo, o que é "isso muda por execução" vs "isso é config que o usuário decide uma vez".

**Recomendação**: para todo bloco novo, separar explicitamente em dois tipos —
`XxxConfig` (o que futuramente vira `ConfiguracaoBloco`) e `XxxRuntimeData` (o que vem do DTO do
documento) — mesmo que hoje os dois continuem sendo passados juntos como um único `@Input data`. O
ganho é didático agora (o nome do tipo já documenta a natureza do campo) e reduz o retrabalho de
quando a Fase 3 (seção 6) precisar separar isso de verdade em tabelas diferentes.

### 7.2 Extrair a montagem de `DocumentEntry[]` do componente Angular para um "assembler" dedicado

Achado concreto: `buildEntries()`/`buildBundle()` em `certificado-conclusao.component.ts`,
`ficha-individual.component.ts`, `diario-de-classe/listar.component.ts` e
`lista-presenca.component.ts` são métodos privados, dentro do componente de tela, cada um
reinventando sua própria lógica de "DTO → lista de blocos". Isso mistura estado de UI (overlay,
loading, filtro) com a lógica de negócio "como este documento é composto" — difícil de testar
isoladamente e impossível de reaproveitar fora daquela tela específica.

**Recomendação**: extrair essa lógica para uma classe/service dedicado por documento (ex.:
`CertificadoConclusaoAssembler`, injetável, com um único método `build(dto): DocumentEntry[]`), sem
depender de nada do Angular Component. Isso já adianta, na prática, a separação descrita em 3.5
("distribuição" como etapa própria) — só que hoje vivendo inteiramente no frontend, sem esperar
nenhum backend novo. Também vira testável com um teste unitário simples (dado um DTO fixo, o
assembler sempre produz o mesmo `DocumentEntry[]`).

### 7.3 Eliminar duplicação de mapeamento de Cabeçalho

Achado concreto: `buildHeaderData(cab: CabecalhoDocumentoResponse | null): DocHeaderData` está
**copiado quase byte-a-byte** em `diario-de-classe/listar/listar.component.ts` e
`lancamento-frequencia/lista-presenca/lista-presenca.component.ts` — mesmo shape de origem
(`CabecalhoDocumentoResponse`), mesmo mapeamento, dois lugares.

**Recomendação**: extrair um util/mapper único (ex.: `mapCabecalhoToDocHeaderData()`) para dentro do
`document-builder` ou de um módulo compartilhado, já que `CabecalhoDocumentoResponse → DocHeaderData`
é claramente um contrato recorrente entre domínios (Diário, Lista de Presença, Carômetro, e
provavelmente qualquer documento futuro que também precise de Cabeçalho). Reduz duplicação agora e
é exatamente o tipo de mapeamento que a categoria 3 (bloco autossuficiente, seção 3.2) formalizaria
mais tarde — só que já pode virar uma função pura reaproveitada, sem esperar isso.

### 7.4 Manter o catálogo do editor (`BlockRegistryService`) sincronizado com os blocos reais

Achado concreto: o `REGISTRY` do `BlockRegistryService` (protótipo do editor) cobre só 7 tipos de
bloco (`header`, `section`, `statement`, `info-row`, `table`, `presenca-info`, `info-grid`) — menos
de um terço dos ~25 componentes `Doc*Component` que já existem e já são usados em produção
(`DocWideTableComponent`, `DocSignatureComponent`, `DocCarometroGridComponent`,
`DocGridDiarioComponent`, `DocGridConteudoComponent`, `DocGridRendimentoComponent`,
`DocLastPageInfoComponent`, `DocInfoFrequenciaComponent`, entre outros, ficam de fora). Isso não é
um bug hoje (o editor é só protótipo), mas é uma dívida que cresce a cada bloco novo criado sem
entrada correspondente no registry.

**Recomendação**: tratar "registrar no `BlockRegistryService`" como parte do "Definition of Done"
de todo bloco novo em `document-builder/components/`, junto com o código do componente — mesmo
antes de qualquer persistência em backend (Fase 1). Evita que o catálogo do editor fique cada vez
mais desatualizado em relação à realidade, o que mina a credibilidade do protótipo como ponto de
partida real.

### 7.5 Organizar `document-builder/components/` por natureza do bloco, não tudo plano numa pasta

Achado concreto: hoje todos os ~30 componentes (genéricos como `doc-table`, `doc-section`,
`doc-statement` e específicos de um documento como `doc-carometro-grid`, `doc-grid-diario`,
`doc-info-frequencia`) vivem lado a lado, sem distinção, em
`shared/document-builder/components/*`. Um developer procurando "já existe um bloco parecido com o
que eu preciso?" precisa ler os ~30 nomes de pasta pra descobrir.

**Recomendação**: separar em duas áreas — `components/core/` (blocos genéricos, reutilizáveis por
qualquer documento: `Section`, `Table`, `WideTable`, `Statement`, `InfoRow`, `Header`, `Signature`)
e `components/blocos-especificos/` (ou por domínio: `components/frequencia/`,
`components/carometro/`) para os blocos nascidos de uma necessidade pontual (ver fluxo da seção
3.4). Isso torna visível, só pela estrutura de pastas, a distinção "bloco de catálogo geral" vs
"bloco de negócio específico" que a proposta inteira depende — sem exigir nenhuma mudança de
schema, só reorganização de arquivo.

### 7.6 Tipar a criação de `DocumentEntry` para eliminar `as XyzData` manual

Achado concreto: todo `buildEntries`/`buildBundle` levantado na seção 3.6 usa o padrão
`{ componentType: DocXComponent, data: { ... } as DocXData }` — um type assertion manual, repetido
dezenas de vezes, sem nenhuma garantia do compilador de que `componentType` e o shape de `data`
realmente combinam (`as` silencia o TypeScript, não valida).

**Recomendação**: expor, junto de cada `Doc*Component`, uma pequena factory tipada (ex.:
`docTable(data: DocTableData): DocumentEntry`) que amarra `componentType` + `data` num só lugar, com
o tipo inferido em vez de assertado. Reduz o risco de um `as DocTableData` esconder um campo errado
(ex.: confundir `DocTableData` com `DocWideTableData`, que têm formas parecidas mas não idênticas) e
melhora autocomplete pra quem está montando um documento novo.

### 7.7 Formalizar a convenção de nomes de DTO de documento

Achado concreto: os DTOs que alimentam cada documento já seguem, informalmente, um padrão —
`DiarioDeClasseDocumentoResponse`, `CertificadoConclusaoDocumentoResponse`,
`ListaPresencaDocumentoTurmaData`, `CarometroDocumentoTurmaData` — todos com sufixo
`Documento...Response`/`...Data`. Isso já é, na prática, o "contrato de dado" descrito na seção 3.5,
só que nunca foi escrito como regra.

**Recomendação**: documentar essa convenção explicitamente (ex.: num `README` do
`document-builder` ou no `CLAUDE.md` do `estrutura-pedagogica`) — `<NomeDoDocumento>DocumentoResponse`
para o retorno da busca de dado, `<NomeDoDocumento>DocumentoRequest` para o filtro/request — para
que todo documento novo siga o mesmo padrão sem precisar copiar de um exemplo existente por
convenção tácita.

### 7.8 Usar a galeria `/exemplos/documents` como vitrine obrigatória de todo bloco/documento novo

Achado concreto: a galeria (seção 3.7) já existe e já faz exatamente o papel de catálogo visual —
mas hoje alguns blocos reais em produção (`DocCarometroGridComponent`, `DocGridDiarioComponent` etc.)
não têm nenhuma entrada lá, só aparecem dentro das telas de produção que os usam.

**Recomendação**: exigir que todo bloco novo (e toda variação relevante de um documento) ganhe uma
entrada de exemplo na galeria como parte do PR que o introduz — isso mantém o catálogo visual
sempre atualizado e dá a outros developers um lugar único pra ver "o que já existe" antes de criar
algo parecido do zero. Custo baixo, já que reaproveita a infraestrutura de
`DocumentSample`/`DocumentoModeloSample` que já existe.

### 7.9 Um contrato explícito (`IDocumento`) para o ciclo de vida de um documento

As seções 7.1–7.2 recomendam separar "config de dado" e "extrair a montagem do componente
Angular" — mas sem um contrato formal, cada developer resolve isso de um jeito diferente (foi
exatamente o que aconteceu: `certificado-conclusao.component.ts`, `ficha-individual.component.ts`,
`diario-de-classe/listar.component.ts` e `lista-presenca.component.ts` reinventam, cada um à sua
maneira, "buscar dado → montar config → montar entries → abrir overlay → reagir a mudança →
imprimir/salvar"). Uma interface `IDocumento` formaliza essa forma comum, deixando explícito o que
**varia por documento** (a interface) e o que é **sempre igual** (o runtime que a implementa).

```typescript
// document-builder/contracts/documento.contract.ts

import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { DocumentConfig } from '../models/document-config';
import { DocumentEntry } from '../models/layout.models';

/**
 * Contrato que todo documento (Certificado, Histórico, Carômetro, ...) implementa.
 * Não é o componente Angular da tela — é a peça que sabe "de onde vem o dado, como vira
 * blocos, como reage a mudança de config". O componente Angular só cuida de UI (filtro,
 * overlay, loading) e delega tudo isso a uma implementação de IDocumento via DocumentoRuntime
 * (ver abaixo). Métodos sem "?" são obrigatórios; com "?" só fazem sentido pra documentos que
 * têm configuração ao vivo (ex.: Carômetro, Diário).
 */
export interface IDocumento<TFiltro, TDto> {
  /** Nome estável — vira base do nome de arquivo (print/save) e label de log. */
  readonly chave: string;

  /**
   * Busca o dado runtime (categoria 2, seção 3.2). Único método que sabe qual endpoint chamar
   * e qual DTO esperar — nunca monta bloco aqui, só busca.
   */
  carregarDados(filtro: TFiltro): Observable<TDto>;

  /**
   * Monta a DocumentConfig inicial a partir do DTO (orientação, cabeçalho, assinatura, moldura).
   * Separado de construirEntries porque config e blocos mudam em momentos diferentes do ciclo
   * de vida (ver reagirAMudancaDeConfig).
   */
  construirConfig(dto: TDto): DocumentConfig;

  /**
   * "Distribuição" (seção 3.5) — reparte o DTO entre os blocos do documento e produz o
   * DocumentEntry[] que o document-builder efetivamente renderiza.
   */
  construirEntries(dto: TDto): DocumentEntry[];

  /** Nome de arquivo final — normalmente depende do dado (aluno, turma, data). */
  nomeArquivo(dto: TDto): string;

  /**
   * Reage a uma mudança na config GERAL do documento (orientação/margem/fonte, vindo do
   * DocumentConfigPanelComponent). Só documentos com esse painel habilitado precisam implementar.
   */
  reagirAMudancaDeConfig?(configAtual: DocumentConfig, novaConfig: DocumentConfig, dto: TDto): DocumentConfig;

  /**
   * Reage a uma mudança na config de UM bloco específico (ex.: nº de colunas do Carômetro,
   * caracteres de presença/falta do Diário). Só o(s) bloco(s) identificados por `blocoAlvo`
   * devem ser afetados — o resto dos entries permanece igual.
   */
  reagirAMudancaDeBloco?(entries: DocumentEntry[], blocoAlvo: Type<unknown>, patch: unknown): DocumentEntry[];
}

/** Estados possíveis do ciclo de vida — mapeiam 1:1 pro que hoje é feito com flags soltas
 *  (`loading`, `showOverlay`) espalhadas em cada componente. */
export type EstadoDocumento = 'ocioso' | 'carregando' | 'pronto' | 'atualizando' | 'erro';

/**
 * Runtime genérico e único — implementa o ciclo de vida comum (carregar → montar → exibir →
 * reagir → imprimir/salvar → fechar) chamando os hooks de uma IDocumento específica. Um
 * developer criando um documento novo só escreve a IDocumento; nunca reimplementa este runtime.
 */
export class DocumentoRuntime<TFiltro, TDto> {
  estado: EstadoDocumento = 'ocioso';
  config?: DocumentConfig;
  entries: DocumentEntry[] = [];
  private dtoAtual?: TDto;

  constructor(
    private documento: IDocumento<TFiltro, TDto>,
    private viewer: () => import('../components/document-viewer/document-viewer.component').DocumentViewerComponent | undefined,
  ) {}

  /** "Quando iniciar" — chamado pela tela ao aplicar um filtro/selecionar um registro. */
  abrir(filtro: TFiltro): void {
    this.estado = 'carregando';
    this.documento.carregarDados(filtro).subscribe({
      next: dto => {
        this.dtoAtual = dto;
        this.config = this.documento.construirConfig(dto);
        this.entries = this.documento.construirEntries(dto);
        this.estado = 'pronto';
        // "Quando passar pro document-builder renderizar": só depois que config+entries existem.
        queueMicrotask(() => this.viewer()?.init());
      },
      error: () => { this.estado = 'erro'; },
    });
  }

  /** Config geral mudou (painel de orientação/margem/fonte). */
  aoConfigMudar(novaConfig: DocumentConfig): void {
    if (!this.documento.reagirAMudancaDeConfig || !this.dtoAtual) { this.config = novaConfig; }
    else { this.config = this.documento.reagirAMudancaDeConfig(this.config!, novaConfig, this.dtoAtual); }
    this.estado = 'atualizando';
    this.viewer()?.reload(this.config);
    this.estado = 'pronto';
  }

  /** Um bloco específico mudou sua config ao vivo (ex.: variante do Carômetro). */
  aoBlocoMudar(blocoAlvo: Type<unknown>, patch: unknown): void {
    if (!this.documento.reagirAMudancaDeBloco) { return; }
    this.entries = this.documento.reagirAMudancaDeBloco(this.entries, blocoAlvo, patch);
    this.viewer()?.reload();
  }

  imprimir(): void { if (this.dtoAtual) { this.viewer()?.print(this.documento.nomeArquivo(this.dtoAtual)); } }
  salvar(): void { if (this.dtoAtual) { this.viewer()?.save(this.documento.nomeArquivo(this.dtoAtual)); } }
  fechar(): void { this.estado = 'ocioso'; this.entries = []; this.config = undefined; this.dtoAtual = undefined; }
}
```

**Exemplo concreto — Certificado de Conclusão reescrito sobre esse contrato** (comparar com o
`certificado-conclusao.component.ts` real, seção 3.6):

```typescript
// documentacao-pedagogica/turmas/certificado-conclusao/certificado-conclusao.documento.ts

export class CertificadoConclusaoDocumento implements IDocumento<string, CertificadoConclusaoDocumentoResponse> {
  readonly chave = 'certificado-conclusao';

  constructor(private service: CertificadoConclusaoService) {}

  carregarDados(hashAluno: string) {
    return this.service.get(hashAluno);
  }

  construirConfig(dto: CertificadoConclusaoDocumentoResponse): DocumentConfig {
    return {
      orientation: 'portrait',
      header: { show: false },   // ver achado 3.6 — Certificado não usa o Cabeçalho padrão
      footer: { show: false },
      signature: { show: true, city: dto.dadosEscolaAtual.cidade, signatories: dto.assinaturas.map(a => ({ role: a.funcao, name: a.nome })) },
      componentGap: 10,
    };
  }

  construirEntries(dto: CertificadoConclusaoDocumentoResponse): DocumentEntry[] {
    // mesma lógica de buildEntries() já existente — só movida pra cá, sem viver mais no componente.
    return [ /* ... */ ];
  }

  nomeArquivo(dto: CertificadoConclusaoDocumentoResponse): string {
    return `certificado-conclusao-${dto.dadosAluno.nomeAluno}`;
  }

  // Sem reagirAMudancaDeConfig / reagirAMudancaDeBloco — Certificado não tem config ao vivo hoje.
}
```

**O componente Angular encolhe para só UI**, delegando tudo o mais ao runtime:

```typescript
export class CertificadoConclusaoComponent {
  @ViewChild('viewer') viewerRef?: DocumentViewerComponent;
  readonly runtime = new DocumentoRuntime(
    new CertificadoConclusaoDocumento(this.service),
    () => this.viewerRef,
  );

  gerarCertificado(hashAluno: string): void { this.runtime.abrir(hashAluno); }
  imprimir(): void { this.runtime.imprimir(); }
  salvar(): void { this.runtime.salvar(); }
}
```

**Por que isso importa para o resto da proposta**: `IDocumento.construirConfig` +
`IDocumento.construirEntries` são, literalmente, a implementação hoje-no-frontend do que a Fase 3
(seção 6) propõe formalizar como dado persistido — `construirConfig` é onde a categoria 1 (config
fixa) e o `ConfiguracaoBloco` futuro se encontram, `construirEntries` é onde a "distribuição" da
seção 3.5 acontece de fato. Escrever esse contrato agora não é trabalho perdido se/quando o modelo
genérico avançar — é o mesmo código, só que hoje vivendo inteiramente no frontend, e mais fácil de
testar unitariamente do que a versão atual (lógica presa dentro de um componente Angular com
`ViewChild`, `overlay`, `loading`).

### 7.10 `IGenericDocument` — o caso degenerado de `IDocumento` para documentos criados pelo usuário

`IDocumento` (7.9) é para documentos com **regra de negócio própria escrita por dev** — Certificado,
Histórico, Diário: cada um sabe buscar seu dado e tem lógica específica de distribuição. Mas a
proposta inteira (seções 3–6) também cobre o outro caso: um documento **montado por um usuário no
editor de blocos**, só arrastando e configurando — sem nenhuma linha de código nova. É exatamente o
que o protótipo já faz hoje com `EditorDocument` (`{ name, config, headerData, blocks }`, ver 1.3).

`IGenericDocument` formaliza esse caso como dado puro, sem lógica:

```typescript
// document-builder/contracts/documento-generico.contract.ts

/** Um documento inteiramente definido por dado — o que o editor de blocos produz e salva. */
export interface IGenericDocument {
  id: string;                 // identidade do Documento salvo (Fase 2, seção 6)
  documentoTipoId?: string;   // opcional: se nasceu de um DocumentoTipo do catálogo (Fase 1)
  nome: string;
  config: DocumentConfig;
  headerData?: DocHeaderData;
  blocos: BlocoInstancia[];   // lista ORDENADA — equivalente a EditorDocument.blocks hoje
}

export interface BlocoInstancia {
  id: string;        // instância única dentro deste documento (permite repetir o mesmo BlocoTipo)
  tipo: BlockType;   // chave no catálogo (hoje: BlockRegistryService.REGISTRY)
  config: unknown;   // ConfiguracaoBloco.ValoresJson — validado contra o schemaConfig do BlocoTipo
  label?: string;    // nome customizado dado pelo usuário no editor
}
```

**O ponto central: `IGenericDocument` não é uma interface concorrente a `IDocumento` — é o caso
degenerado dela.** Um documento genérico não precisa buscar dado (o `filtro` já É o dado — o usuário
configurou tudo no editor) e não precisa de lógica de distribuição (é só mapear cada
`BlocoInstancia` pro componente do catálogo). Isso significa que o mesmo `DocumentoRuntime` de 7.9
já sabe renderizar um `IGenericDocument`, sem nenhum código de estado novo — só uma implementação
trivial de `IDocumento`:

```typescript
export class DocumentoGenerico implements IDocumento<IGenericDocument, IGenericDocument> {
  readonly chave = 'documento-generico';
  constructor(private registry: BlockRegistryService) {}

  // O "filtro" já é o dado — nada pra buscar, só devolver.
  carregarDados(doc: IGenericDocument) { return of(doc); }

  construirConfig(doc: IGenericDocument): DocumentConfig { return doc.config; }

  construirEntries(doc: IGenericDocument): DocumentEntry[] {
    return doc.blocos.map(b => {
      const def = this.registry.get(b.tipo);
      return { name: b.label ?? def.label, componentType: def.componentType, data: b.config };
    });
  }

  nomeArquivo(doc: IGenericDocument): string { return doc.nome; }
}
```

Essa relação (`IGenericDocument` = `IDocumento` sem `carregarDados` de verdade e sem lógica própria
em `construirEntries`) é o que deixa claro, em código, a fronteira da seção 3.2: **um documento só
pode ser 100% genérico (criado pelo usuário, sem dev envolvido) se todos os seus blocos forem
categoria 1** (config fixa, sem busca em tempo de geração). No momento em que um bloco precisa de
dado runtime (categoria 2, ex.: grade de notas) ou de fonte própria (categoria 3, ex.: Cabeçalho
buscando da Escola), o documento deixa de caber em `IGenericDocument` puro e precisa de uma
`IDocumento` de verdade — com um `carregarDados`/`construirEntries` escritos por dev — para
resolver aquele bloco específico antes de entregar ao `document-builder`. Essa é, na prática, a
régua que decide se um documento novo pode nascer **inteiramente no editor, sem card de dev**, ou
se precisa de implementação própria.

### 7.11 `IBlocoDefinicao` — dar ao catálogo de blocos uma função de montagem própria, reaproveitável

`IDocumento.construirEntries` (7.9) hoje concentra **duas responsabilidades diferentes**: decidir
quais blocos entram no documento e em que ordem (isso é, de fato, específico do documento), e saber
como transformar config+dado num `DocXData` (isso é lógica **do bloco**, não do documento — mas
hoje vive duplicada dentro de cada `buildEntries`). O achado da seção 3.6 confirma isso na prática:
`DocInfoRowComponent` é usado por Certificado, Ficha Individual, Histórico, Boletim, Declaração,
Plano de Aula — cada um monta seu próprio `fields: [...]` do zero, sem nenhum reaproveitamento,
mesmo quando o "tipo" de informação é parecido (dados de identificação do aluno, por exemplo).

`BlockRegistryService.REGISTRY` (protótipo) já é um passo nessa direção, mas só guarda
`defaultData` estático — não uma função de montagem. Formalizar isso como interface:

```typescript
export interface IBlocoDefinicao<TConfig = unknown, TDadoRuntime = void, TComponentData = unknown> {
  readonly tipo: BlockType;
  readonly label: string;
  readonly icon: string;
  readonly categoria: 'identification' | 'content' | 'data';
  readonly componentType: Type<unknown>;
  readonly configPadrao: TConfig;
  /** true se este bloco depende de dado runtime (categoria 2/3, seção 3.2) além da config. */
  readonly precisaDeDadoRuntime: boolean;
  /** Combina config + dado runtime (quando houver) no shape que o componente espera em [data]. */
  montar(config: TConfig, dado?: TDadoRuntime): TComponentData;
}
```

Com isso, `IDocumento.construirEntries` deixa de conter lógica de montagem — vira só a
"distribuição" pura da seção 3.5 (quais blocos, em que ordem, qual fatia do DTO cada um recebe):

```typescript
construirEntries(dto: CertificadoConclusaoDocumentoResponse): DocumentEntry[] {
  return [
    dadosDoCursoBloco.montar(configDadosDoCurso, dto.escolas),   // lógica de montagem vive no bloco
    disciplinasBloco.montar(configDisciplinas, dto.disciplinas), // reaproveitável por outro documento
    // ...
  ];
}
```

Ganho concreto: a lógica de "como formatar dados de curso/disciplinas/identificação num bloco"
passa a viver **uma vez**, no `IBlocoDefinicao`, em vez de reimplementada a cada novo documento que
usa o mesmo tipo de bloco.

### 7.12 `IConfiguracaoBlocoStore` — generalizar a persistência de config de bloco (já existe um precedente real)

A seção 3.6 já identificou que o Carômetro tem, hoje, um precedente real e funcional de
`ConfiguracaoBloco`: `CarometroConfiguracaoService.get()`/`save()`/`restaurarPadrao()`. Esse shape é
genérico o suficiente para virar um contrato reaproveitável por qualquer bloco que precise de
config persistida e editável ao vivo — sem esperar a Fase 1/2 da seção 6:

```typescript
export interface IConfiguracaoBlocoStore<TConfig> {
  carregar(): Observable<TConfig | null>;
  salvar(config: TConfig): Observable<void>;
  restaurarPadrao(): Observable<void>;
}
```

O ponto importante: **o escopo da configuração (por usuário logado, por Rede, por Escola, por
Documento) fica escondido atrás da interface** — `CarometroConfiguracaoService` já implementa esse
contrato hoje com escopo por usuário; uma implementação futura com escopo por Rede/Escola (quando a
Fase 4 da seção 6 decidir isso) satisfaz o mesmo contrato sem que o bloco ou o editor precisem saber
a diferença. Qualquer bloco novo que precise de "salvar a config que o usuário ajustou" ganha esse
comportamento reaproveitando a interface, em vez de escrever um service com 3 métodos do zero a
cada vez (como foi feito para o Carômetro).

### 7.13 `IBlocoConfigEditor` — contrato padrão para o painel de edição de um bloco

Achado concreto: o Carômetro já tem sua própria UI de configuração ao vivo
(`DocCarometroConfigPanelComponent`, `DocCarometroVariantPickerComponent`) — construída
especificamente pra ele, fora de qualquer contrato compartilhado. O protótipo do editor
(`BlockInspectorComponent`) também edita config de bloco, mas de forma genérica (formulário
baseado em schema, presumivelmente). Não existe hoje uma ponte entre os dois — um bloco com UI de
config rica e específica (como o Carômetro) não tem como se "encaixar" no inspector genérico do
editor.

```typescript
export interface IBlocoConfigEditor<TConfig> {
  config: TConfig;
  configChange: EventEmitter<TConfig>;
}
```

Se todo componente de edição de config de bloco (do genérico, tipo formulário, ao específico, tipo
`DocCarometroConfigPanelComponent`) implementar esse contrato mínimo (`@Input config` +
`@Output configChange`), o `BlockInspectorComponent` do editor pode hospedar **qualquer** editor de
bloco dinamicamente (via `ComponentType` registrado junto do `IBlocoDefinicao` em 7.11), em vez de
cada bloco com config rica precisar viver fora do editor genérico, numa tela própria, como acontece
hoje com o Carômetro.

### 7.14 Refinamento de `IDocumento` — dado já em mãos, e o caso em lote

O desenho de `IDocumento`/`DocumentoRuntime` em 7.9 assumiu que o próprio `IDocumento` sempre busca
seu dado (`carregarDados(filtro)`). Revendo os exemplos reais mapeados na seção 3.6, **isso não é o
que acontece na prática hoje**: em todo componente real (`certificado-conclusao.component.ts`,
`ficha-individual.component.ts`, `diario-de-classe/listar.component.ts`,
`lista-presenca.component.ts`), **é a tela quem busca o dado** através do seu próprio service e
filtro — o "documento" só entra depois, já com o DTO em mãos, pra virar `DocumentEntry[]`. Buscar
dado dentro do `IDocumento` é um caso que também deveria existir (documentos mais autocontidos), mas
não pode ser o único caminho.

Existe também um segundo padrão real, já mapeado: **renderizar vários documentos de uma vez**.
`DocumentViewerComponent` já aceita, hoje, tanto um único `{config, entries, headerData}` quanto uma
lista — `@Input documents: DocumentBundle[]` — usado em dois lugares reais:

- `documents.component.ts` (`MultiDocumentSample`) — ex.: `multiHistoricoTurma`, 3 históricos de
  alunos diferentes de uma mesma turma, renderizados juntos num único PDF, cada um com numeração de
  página independente.
- `lista-presenca.component.ts` (Carômetro) — `this.documents = data.map(item =>
  this.buildCarometro(item))`: uma turma pode virar várias listas selecionadas, cada uma um
  `DocumentBundle` próprio, todas entregues de uma vez ao viewer.

Isso é exatamente o cenário descrito: carregar o histórico de uma lista de alunos e renderizar todos
dentro do mesmo `document-builder`. **Ambos os achados (dado já em mãos + renderização em lote)
levam ao mesmo ajuste**: `carregarDados` devia ser **opcional** em `IDocumento`, e o `DocumentoRuntime`
precisa de dois pontos de entrada — um pra "já tenho o dado, só renderiza" e outro pra "aqui está uma
lista, renderiza todos juntos" — além do que já existia (buscar via filtro).

```typescript
export interface IDocumento<TFiltro, TDto> {
  readonly chave: string;

  /** Opcional — só documentos autocontidos implementam. Quando ausente, quem chama o runtime já
   *  tem o(s) DTO(s) em mãos (o caso mais comum hoje) e entrega direto via renderizar()/renderizarLote(). */
  carregarDados?(filtro: TFiltro): Observable<TDto>;

  construirConfig(dto: TDto): DocumentConfig;
  construirEntries(dto: TDto): DocumentEntry[];
  /** Opcional — nem todo documento tem Cabeçalho (ver achado do Certificado, seção 3.6). */
  construirHeaderData?(dto: TDto): DocHeaderData;
  nomeArquivo(dto: TDto): string;
  /** Rótulo por item — usado no modo lote pra identificar cada DocumentBundle na lista. */
  rotulo?(dto: TDto): string;

  reagirAMudancaDeConfig?(configAtual: DocumentConfig, novaConfig: DocumentConfig, dto: TDto): DocumentConfig;
  reagirAMudancaDeBloco?(entries: DocumentEntry[], blocoAlvo: Type<unknown>, patch: unknown): DocumentEntry[];
}
```

```typescript
export class DocumentoRuntime<TFiltro, TDto> {
  // ... estado igual a 7.9 (estado, config, entries) ...
  bundles: DocumentBundle[] = [];   // novo — usado só no modo lote

  /** Caso mais comum hoje: a tela já buscou o dado (com seu próprio service/filtro) e só
   *  repassa pra virar bloco + renderizar. Não depende de IDocumento.carregarDados. */
  renderizar(dto: TDto): void {
    this.dtoAtual = dto;
    this.config = this.documento.construirConfig(dto);
    this.entries = this.documento.construirEntries(dto);
    this.estado = 'pronto';
    queueMicrotask(() => this.viewer()?.init());
  }

  /** Runtime busca o dado via IDocumento.carregarDados — só pra documentos autocontidos. */
  abrir(filtro: TFiltro): void {
    if (!this.documento.carregarDados) { throw new Error(`${this.documento.chave} não busca o próprio dado — use renderizar(dto).`); }
    this.estado = 'carregando';
    this.documento.carregarDados(filtro).subscribe({
      next: dto => this.renderizar(dto),
      error: () => { this.estado = 'erro'; },
    });
  }

  /** Lote: N dtos (ex.: histórico de uma lista de alunos) → N bundles, todos entregues juntos
   *  ao viewer — mesmo padrão já usado hoje pelo Carômetro e por MultiDocumentSample. */
  renderizarLote(dtos: TDto[]): void {
    this.bundles = dtos.map(dto => ({
      config: this.documento.construirConfig(dto),
      headerData: this.documento.construirHeaderData?.(dto),
      entries: this.documento.construirEntries(dto),
      label: this.documento.rotulo?.(dto),
    }));
    this.estado = 'pronto';
    queueMicrotask(() => this.viewer()?.init());
  }
}
```

Com isso, o exemplo do Certificado em 7.9 não muda (continua chamando `runtime.abrir(hashAluno)`,
já que o `service.get()` está dentro do `carregarDados` da própria `CertificadoConclusaoDocumento`).
Já um caso como "histórico de uma lista de alunos selecionados" usaria o mesmo
`HistoricoEscolarDocumento` (implementando só `construirConfig`/`construirEntries`, sem
`carregarDados` — a tela já buscou a lista via seu próprio filtro de turma) chamado assim:

```typescript
// A tela já tem `alunos: HistoricoDto[]` (buscado pelo seu próprio filtro de turma/ano letivo).
this.runtime.renderizarLote(this.alunos);
```

## 8. Segurança — integridade do PDF gerado a partir do que está renderizado em tela

Ponto levantado pelo time, confirmado como real ao ler o pipeline de geração de PDF: hoje **não há
nenhuma garantia de que o PDF final reflete o dado real do banco**, porque a geração parte do que
está renderizado no navegador — território do próprio usuário.

### 8.1 O risco, confirmado no código

- `PrintService` (`shared/document-builder/services/print.service.ts`) — as estratégias `frontend`
  (`html2canvas`/`html-to-image`, **hoje o default de `DocumentConfig.pdfStrategy`**) literalmente
  tiram um "screenshot" do DOM ao vivo e viram PDF. **Certificado de Conclusão e Ficha Individual —
  os dois documentos com mais valor legal do domínio — usam esse default hoje** (nenhum dos dois
  define `pdfStrategy` explicitamente, ver 3.6). Diário de Classe e Lista de Presença/Carômetro já
  usam `pdfStrategy: 'backend'`.
- `pdfStrategy: 'backend'` **não é tão seguro quanto o nome sugere**: `PdfApiService.gerar(html,
  orientation)` + `buildSelfContainedHtml()` (`pdf-api.service.ts`) enviam o **`outerHTML` já
  renderizado no browser** pro servidor, que só rasteriza esse HTML via Playwright/Chromium — sem
  re-consultar o banco, sem revalidar nada. O servidor confia cegamente no HTML que o cliente
  mandou.
- Conclusão: **nas duas estratégias, o valor que vira PDF é o que está no DOM/estado Angular no
  momento da geração** — que o próprio usuário controla (DevTools, extensão de browser, ou
  interceptando a chamada de rede antes do POST). Um aluno pode alterar uma nota, um resultado
  final, ou o texto de um certificado no DOM e gerar um PDF "oficial", com o timbre da escola,
  refletindo o dado fraudado — nenhuma das duas estratégias percebe.
- A autenticação que já existe no endpoint de PDF (`x-api-key` em `frequenciaHttpOptions`) autentica
  **quem está chamando** (a aplicação), não **o conteúdo** — não mitiga esse risco especificamente.

### 8.2 A correção de fundo: documento protegido não pode confiar em HTML/dado vindo do cliente

Regra proposta: para todo documento marcado como protegido, **o PDF final só pode ser produzido a
partir de dado buscado (ou verificado) pelo próprio servidor no momento da geração** — nunca do
`outerHTML` ou do estado do componente Angular. Isso implica que, para esses documentos:
- `pdfStrategy: 'frontend'` (html2canvas/html-to-image) nunca é aceitável.
- `pdfStrategy: 'backend'` **como existe hoje** (rasterizar o HTML do cliente sem revalidar) também
  não é suficiente — precisa de um modo novo, que não aceite HTML do cliente como fonte de verdade.

### 8.3 `protectDocument` — módulo separado (concordo que faz sentido isolar, dado o custo real)

```typescript
/** Um IDocumento marcado como protegido declara só a REFERÊNCIA necessária pra o servidor
 *  re-buscar o dado sozinho — nunca os valores protegidos em si. */
export interface IDocumentoProtegido<TReferencia> {
  readonly protegido: true;
  obterReferencia(dto: unknown): TReferencia;   // ex.: { hashAluno, anoLetivo, tipoDocumento }
}
```

`DocumentoRuntime.imprimir()`/`salvar()` (7.9) checam `documento.protegido` — se verdadeiro, o
fluxo não passa pelo `PrintService`/`PdfApiService` de hoje, e sim por um serviço à parte
(`ProtectDocumentService`, por exemplo) que:

1. Envia ao backend **só a referência** (`{documentoChave, referencia}`) — nunca HTML, nunca os
   valores de negócio.
2. O servidor re-busca o dado atual através do **mesmo service de domínio que já alimenta a
   tela** (fonte única de verdade — sem duplicar regra de busca).
3. O servidor re-monta e renderiza o documento (via SSR do mesmo template, ou uma reimplementação
   da montagem como template server-side) e devolve o PDF já pronto.

**Custo real, sem maquiar**: isso exige que a lógica de "montar o documento" também rode (ou seja
espelhada) no servidor — não é trivial, e é exatamente por isso que faz sentido isolar como módulo
à parte, opt-in por documento, em vez de mudar o pipeline inteiro de uma vez.

#### 8.3.1 Mecânica concreta — as duas formas óbvias de fazer isso, e por que só uma funciona

Duas formas naturais de imaginar esse "servidor re-busca e re-renderiza" — vale destrinchar as
duas, porque só uma é realmente segura.

**Forma 1 — "no primeiro render já manda o HTML pro servidor, e usa esse guardado na hora de
imprimir".** Não funciona: o envio ao servidor continua sendo **disparado pelo próprio navegador do
usuário**, só que mais cedo. A linha do tempo do ataque não muda de lugar, só de forma:

```
T0 — backend responde o fetch inicial (DTO)
T1 — Angular monta o DOM a partir do DTO
T2 — front serializa o HTML e manda pro servidor "guardar"   ← a ideia proposta
T3 — usuário clica "Imprimir" → servidor usa o HTML guardado em T2
```

Um atacante com proxy local ou breakpoint de debugger não precisa esperar o usuário chegar em T3 —
ele intercepta ou reescreve o dado **em T0 ou entre T0 e T1** (antes do DOM existir, ou antes do
`buildEntries` rodar). O que é "guardado" em T2 já nasce fraudado, e o servidor confia nele do
mesmo jeito que confiaria no HTML mandado em T3. Mandar mais cedo não adianta — o problema nunca
foi *quando* o navegador manda o dado, é o fato de ser **o navegador quem manda**.

**Forma 2 — "o backend substitui, dentro do HTML recebido, os valores por dados válidos".** Essa é
mais próxima de funcionar (o servidor deixa de confiar cegamente e passa a impor o valor certo),
mas tem uma armadilha real que precisa ser resolvida com cuidado: como a geração de PDF hoje
**rasteriza visualmente** a página (html2canvas / Playwright tirando um "print" do resultado final),
substituir só o texto de um nó específico não basta — nada impede o HTML enviado pelo cliente de
sobrepor visualmente esse nó com outro elemento (`position: absolute`, `z-index`, uma `div` branca
por cima) mostrando um valor fraudado, que fica visualmente por cima do valor correto que o servidor
inseriu por baixo. O ataque não edita o valor — edita o que está *visualmente na frente* dele.

Pra Forma 2 funcionar de verdade, o servidor precisaria: (a) validar rigorosamente que só existem
exatamente os marcadores esperados no HTML recebido (sem duplicatas, sem elementos extras na região
protegida), e (b) renderizar a região protegida **isolada de qualquer CSS vindo do cliente** — não
dá pra confiar em "substituir o texto e deixar o resto do HTML como está", porque "o resto do HTML"
inclui o poder de reposicionar/esconder/sobrepor. Isso é possível, mas é sutil o suficiente pra
valer a pena considerar a Forma 3 abaixo em vez disso.

**Forma 3 (decidida com o time) — o servidor renderiza a região protegida inteira, sozinho, sem
receber HTML nenhum do cliente para ela.** Dado que o `pdfStrategy: 'backend'` já existe e já usa
Playwright/Chromium no servidor (ver 8.1), a forma mais simples e mais segura de implementar isso
**sem duplicar a lógica de template em duas linguagens** é fazer o próprio Playwright, do lado do
servidor, **navegar para uma rota de impressão confiável** dentro do próprio app Angular — os
mesmos componentes do `document-builder` já usados na tela, só que abertos numa sessão controlada
pelo servidor, não pelo navegador do aluno:

```
1. Usuário clica "Imprimir/Salvar" num documento protegido.
2. Front manda só a referência: { documentoChave: 'certificado-conclusao', hashAluno, anoLetivo }
   — nunca HTML, nunca os valores de nota/resultado.
3. Backend abre uma instância própria do Playwright, autenticada como serviço (não como o aluno),
   e navega para uma rota interna, ex.: /impressao/certificado-conclusao/{hashAluno}/{anoLetivo}
4. Essa rota é o MESMO componente Angular de sempre — mas, ao carregar, busca o dado direto do
   backend (chamada servidor→servidor, o aluno nunca participa dessa requisição).
5. O Playwright do servidor tira o "print" dessa página — que reflete só o que o PRÓPRIO servidor
   pediu e recebeu, nunca o navegador do aluno.
6. PDF devolvido ao usuário.
```

Vantagem real: **não precisa reimplementar o template em duas linguagens/camadas** — reaproveita os
mesmos componentes `Doc*Component` do `document-builder` já existentes, só trocando quem está
"sentado no navegador" que os renderiza (um Playwright do servidor, não a sessão do aluno). O custo
fica concentrado em construir essa rota de impressão interna e a chamada de dado servidor→servidor
— não em duplicar toda a lógica de montagem de documento em outro lugar.

#### 8.3.2 Ponto que não pode ficar em aberto: proteger a própria rota de impressão

Se a rota `/impressao/certificado-conclusao/{hashAluno}/{anoLetivo}` for só mais uma rota pública do
app, ela abre um problema novo: **qualquer um poderia trocar o `hashAluno` na URL e imprimir o
documento de outro aluno** — não é mais tamper de dado, virou um problema de autorização. Ela não
pode ser "a mesma rota que o aluno acessa", só que aberta pelo servidor — precisa de um limite de
confiança próprio. Duas formas de resolver, complementares:

- **Isolamento de rede**: a rota só é alcançável de dentro da própria infraestrutura do backend
  (rede interna/VPC, não exposta publicamente) — o Playwright do servidor e o app rodam no mesmo
  perímetro de confiança; o navegador do aluno nunca tem como chegar nela, não importa a URL.
- **Token de uso único, gerado pelo servidor**: se a rota precisar viver no mesmo domínio público
  (mais simples de operar), o backend gera, no momento em que recebe o pedido de "gerar PDF
  protegido", um token de curtíssima duração e uso único, vinculado a
  `{documentoChave, hashAluno, anoLetivo}` — só esse token (nunca o `hashAluno` sozinho) autoriza a
  rota de impressão a devolver dado, e ele nunca chega ao navegador do aluno (é gerado e consumido
  inteiramente entre backend e o Playwright do próprio backend).

Sem um desses dois, a "correção" da 8.4 trocaria um problema de integridade por um de autorização —
vale tratar isso como parte não-opcional da implementação, não um detalhe posterior.

### 8.4 Alternativa mais leve — assinatura HMAC dos campos protegidos

Quando o custo do server-side rendering completo (8.4) não for viável de imediato, uma defesa em
profundidade mais barata: no momento em que o backend entrega o DTO original pra tela, ele também
calcula e devolve uma **assinatura HMAC** (chave secreta só do servidor) sobre os campos marcados
como protegidos + identificador do registro + uma expiração curta. Na hora de gerar o PDF, o cliente
reenvia esses campos junto da assinatura; o servidor recalcula o HMAC e só aceita renderizar se
bater — qualquer alteração de valor no meio do caminho invalida a assinatura.

- **Resposta direta ao "se for performático"**: HMAC-SHA256 custa microssegundos, não tem impacto
  de performance perceptível — é, de fato, a forma certa de usar "criptografia" nesse problema (não
  pra esconder o dado, pra provar que ele não foi alterado desde que o servidor o emitiu).
- **Limitação honesta**: isso prova "esse valor específico foi o que o servidor emitiu", não que o
  valor ainda é o mais atual do banco — se a nota mudar depois da assinatura ser emitida, o PDF pode
  sair desatualizado (não fraudado, só potencialmente stale). Aceitável como trade-off consciente
  para documentos de risco médio; inferior à opção 8.4 para os de maior valor legal (Certificado,
  Histórico), onde vale pagar o custo do re-fetch completo.

### 8.5 Escopo recomendado — nem todo documento precisa disso

- Marcar `protegido: true` só onde há valor legal/oficial de fato: **Histórico Escolar, Boletim,
  Certificado de Conclusão, Ata de Resultados Finais, Declaração de Matrícula**.
- Documentos sem esse risco (Comunicado, Plano de Aula, Relatório Pedagógico interno) não precisam
  do custo de `protectDocument` — continuam no pipeline atual sem mudança.
- **Correção de curto prazo, independente da solução completa**: hoje Certificado de Conclusão e
  Ficha Individual usam o `pdfStrategy` default (`'frontend'`, o mais exposto). Trocar isso pra
  `pdfStrategy: 'backend'` já é uma mitigação de baixo custo e imediata — **mas não resolve o
  problema de fundo** (o backend hoje só rasteriza o HTML recebido, sem revalidar). É um remendo
  enquanto a solução de verdade (8.3/8.4) não é implementada, não um substituto pra ela.

## 9. Fora de escopo (explícito)

- Qualquer alteração na migração em andamento (`projetos/MigracaoDocPed`) ou no schema
  `ConfiguracaoRedeDocumentacaoPedagogica`/`ConfiguracaoEscolaDocumentacaoPedagogica`.
- Upload/gestão de imagem de brasão.
- O pipeline de geração de PDF/impressão (`PrintService`, `LayoutEngineService`) — já é genérico e
  não precisa mudar para suportar este modelo.
- Diário de Classe — config própria (`DiarioClasseConfiguracao`), resolvida à parte.
