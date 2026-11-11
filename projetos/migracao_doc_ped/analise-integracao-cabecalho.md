# Análise: integração das configurações de Cabeçalho com `DocHeaderComponent`

Repositório: `estrutura-pedagogica`, branch `EFC-7144` (commit `1a21a210d`, 2026-11-05).

## Pergunta

As configurações de cabeçalho coletadas nos novos painéis (`possuiCabecalho`, `infoAdic`,
`infoAdicTexto` em `doc-escola-cabecalho-comum` + `doc-historico-config-panel` e equivalentes)
estão de fato integradas ao componente de preview `doc-header.component.ts`
(`DocHeaderData` → `DocHeaderComponent`)?

## Conclusão

**Não.** Os painéis de configuração salvam esses campos no backend, mas **nada no fluxo de preview
lê esses valores ou os traduz em `DocHeaderData`**. O cabeçalho mostrado no preview é um placeholder
fixo, desconectado do formulário.

## Evidência

### 1. O painel de config não emite nada que vire cabeçalho

`doc-historico-config-panel.component.ts` (e os 4 painéis irmãos — ficha/ata/livro/certificado,
mesmo padrão) só expõe dois outputs:

```ts
@Output() valoresChange = new EventEmitter<HistoricoValores>();
@Output() save = new EventEmitter<HistoricoValores>();
```

Não existe nenhum `@Output() configChange: DocumentConfig` nem `@Output() headerDataChange: DocHeaderData`
vindo desse painel. `possuiCabecalho`/`infoAdic`/`infoAdicTexto` são apenas campos do `FormGroup`,
inclusos em `valoresAtuais()` e emitidos junto com todo o resto de `HistoricoValores` — tratados
exatamente como qualquer outro campo de conteúdo (ex.: `exibirFiliacao`), sem efeito especial de
"isso é o cabeçalho do documento".

### 2. O template do overlay nem conecta `valoresChange`

Em `documento-personalizacao-overlay.component.html`:

```html
<app-doc-historico-config-panel
    [valores]="historicoValores"
    ...
    (save)="salvarHistorico($event)"
></app-doc-historico-config-panel>
```

Só `(save)` está ligado — `(valoresChange)` (que dispararia a cada tecla digitada) **não está
bindado em nenhum lugar**. Ou seja, nem mesmo o conteúdo textual do painel chega a re-renderizar o
preview em tempo real; só existe reatividade para o painel direito de "Configuração da página"
(`app-document-config-panel` → `onConfigChange`), que trata só orientação/margem/fonte, não cabeçalho.

### 3. O preview usa um cabeçalho hardcoded, nunca atualizado

`documento-personalizacao-overlay.component.ts`:

```ts
const HEADER_PLACEHOLDER: DocHeaderData = {
  institutionName: "Instituição de Ensino",
};
...
private buildDocuments(doc: DocumentoRedeCard): DocumentBundle[] {
  return [{
    config: { ...this.activeConfig },
    headerData: HEADER_PLACEHOLDER,
    label: doc.titulo,
    entries: [
      { componentType: DocTitleComponent, data: { title: doc.titulo } },
      { componentType: DocTextComponent, data: { label: "Descrição", value: doc.descricao } },
    ],
  }];
}
```

`buildDocuments()` roda uma vez em `ngOnChanges` (troca de documento) e nunca mais. `onConfigChange`
(o único handler que re-monta `documents`) faz `{...b, config: {...b.config, ...newConfig}}` —
**preserva o `headerData` original**, então mesmo a reatividade que existe (painel de página) nunca
toca o cabeçalho. O corpo do preview também é mock puro (título do card + descrição), não o layout
real do documento (grade de notas, assinaturas etc.) — isso é consistente com os commits serem
WIP e os painéis terem sido preenchidos de campos antes do preview em si.

Resultado prático: **ligar/desligar "Possui cabeçalho" ou editar "Informações adicionais" no painel
não muda nada no preview.** O texto "Instituição de Ensino" aparece sempre, independente do form.

### 4. O cabeçalho real (`DocHeaderComponent`) funciona — só que em outro fluxo, não conectado a este

Existe uma integração **correta e funcional** entre configuração de cabeçalho e `DocHeaderComponent`,
só que em código legado/paralelo, não tocado por esta migração:

- `historico-escolar-document.builder.ts` → `buildHistoricoHeaderData(cab: CabecalhoDocumentoResponse)`
  mapeia a resposta real do backend (nome da rede/escola, endereço, cidade, UF, CEP, telefone, CNPJ,
  informações adicionais, logo, brasão) para `DocHeaderData`, usado na geração real do Histórico
  Escolar (`historico-escolar.component.ts`).
- `cabecalho-documento.model.ts` → `buildDocHeaderData(...)`, mesma lógica, reaproveitada por
  Diário de Classe, Lançamento de Frequência, Ocorrências e Atendimento do Painel do Aluno.

Esses dois builders são **equivalentes entre si** (mesmo mapeamento campo a campo) mas **não têm
nenhuma relação com os novos painéis de configuração** (`doc-historico-config-panel` etc.) — são
alimentados por um endpoint que busca os dados institucionais da escola (cadastro real), não pelo
JSON de configuração (`ValoresJson`) que os novos painéis salvam.

### 5. Gap à parte, independente da integração: campo "Bairro" nunca é populado

`DocHeaderData.district` existe e é usado em `doc-header.component.ts`:

```ts
get addressLine(): string {
  const parts = [this.data.address, this.data.district, ...].filter(Boolean);
  ...
}
```

Mas **nenhum dos dois builders** (`buildDocHeaderData`, `buildHistoricoHeaderData`) preenche
`district` — os dois `CabecalhoDocumentoResponse` (o compartilhado em
`cabecalho-documento.model.ts` e o local de `historico-escolar.model.ts`) não têm campo de bairro.
O HANDOFF (seção 4.2, "Identificação da unidade") lista Bairro como um dos campos cadastrados —
então, mesmo fora do escopo desta pergunta, o bairro cadastrado na escola (se existir) nunca chega
ao cabeçalho impresso hoje, em nenhum dos dois fluxos.

## Resumo

| Camada | Estado |
|---|---|
| Formulário de config (`possuiCabecalho`/`infoAdic`/`infoAdicTexto`) | Existe, salva no backend |
| Emissão de evento do painel pro overlay | Só `(save)`; `(valoresChange)` não é escutado |
| Overlay → `DocumentConfig`/`DocHeaderData` do preview | Não existe — `headerData` é fixo (`HEADER_PLACEHOLDER`) |
| `DocHeaderComponent` recebendo dados reais de configuração | Não acontece neste fluxo |
| `DocHeaderComponent` recebendo dados reais de escola (fluxo legado) | Funciona (`buildHistoricoHeaderData`/`buildDocHeaderData`), mas é outro pipeline, não ligado aos novos painéis |
| Campo "Bairro" (`district`) ponta a ponta | Nunca populado em nenhum dos dois fluxos |

## Pergunta 2: ignorando a ligação no código, os dados salvos são estruturalmente suficientes?

Reformulação do usuário: não importa se o código já liga uma coisa na outra hoje — o que importa é
se o que é **salvo** para rede e escola **contém o necessário** para montar um `DocHeaderData`
fielmente, caso alguém escreva esse mapeamento depois.

**Resposta: majoritariamente sim, os dados já existem espalhados pelas tabelas certas — mas há
3 gaps/ambiguidades reais que bloqueiam um mapeamento 1:1 limpo.**

### De onde viria cada campo de `DocHeaderData`

| `DocHeaderData` | Fonte hoje | Existe? |
|---|---|---|
| `institutionName` | `EscolaAnoLetivoDocumentacaoPedagogica.NomeOficial` | Sim |
| `address` | `EscolaAnoLetivoDocumentacaoPedagogica.Endereco` | Sim |
| `district` (bairro) | `EscolaAnoLetivoDocumentacaoPedagogica.Bairro` | Sim — ao contrário do que eu disse na Pergunta 1: bairro **existe** no cadastro, só não é carregado pelos builders legados (`buildDocHeaderData`/`buildHistoricoHeaderData`), que usam um `CabecalhoDocumentoResponse` mais pobre sem esse campo |
| `city` | `EscolaAnoLetivoDocumentacaoPedagogica.Cidade` | Sim |
| `state` (UF) | **Não existe** na tela "Identificação da unidade" | **Gap** — UF só existe em `Escola.EstadoId` (cadastro raiz da escola, tela diferente), não é editável nem lido por essa configuração |
| `zipCode` | `EscolaAnoLetivoDocumentacaoPedagogica.CEP` | Sim |
| `phone` | `EscolaAnoLetivoDocumentacaoPedagogica.Telefone` | Sim |
| `cnpj` | `EscolaAnoLetivoDocumentacaoPedagogica.CNPJ` | Sim |
| `additionalInfo` | `EscolaDocumentoConfiguracao` → `InfoAdic`/`InfoAdicTexto` (quando `InfoAdic = true`) | Sim |
| `logoUrl` | `Escola.CaminhoArquivoLogo` (cadastro raiz, não a tela de config) | Sim, mas em outra tabela |
| `stateEmblemUrl`/`showStateEmblem` | `RedeDocumentoConfiguracao` (`HistoricoValores.incluirBrasao`/`utilizaBrasaoDoPais`/`utilizaBrasaoUnesco`) | Sim, mas **nenhum builder hoje lê isso** — ambos hardcodam `showStateEmblem: false` |
| mostrar/ocultar o bloco inteiro (`DocumentConfig.header.show`) | `EscolaDocumentoConfiguracao.PossuiCabecalho` (há também `MostrarCabecalho`, redundante/ambíguo — ver abaixo) | Sim, com ambiguidade |

### Gaps reais (bloqueiam um mapeamento correto, não é só "falta ligar")

1. **UF (estado) não está na tela de configuração.** `EscolaAnoLetivoDocumentacaoPedagogica` (a
   entidade por trás de "Identificação da unidade", seção 4.2 do handoff) não tem coluna de UF —
   só `Escola.EstadoId`, que é cadastro raiz da escola, editado em outro lugar do sistema. Pra
   montar `DocHeaderData.state` a partir da config salva seria preciso um join extra com `Escola`,
   não só ler o que foi salvo nesta tela.

2. **Dois toggles de "possui cabeçalho" com propósito sobreposto.** `ConfiguracaoEscolaModel` tem
   `mostrarCabecalho` **e** `possuiCabecalho` como campos distintos, mais um terceiro campo de texto
   livre `cabecalho: string` sem rótulo correspondente no HTML do painel atual (`doc-escola-cabecalho-comum.component.html`
   só expõe `possuiCabecalho`/`infoAdic`/`infoAdicTexto` — `mostrarCabecalho` e `cabecalho` não
   aparecem em nenhum template que eu encontrei, parecem campos órfãos/legados mantidos só pra não
   zerar no save). Pra um mapeamento ser inequívoco, é preciso decidir qual desses é a fonte de
   verdade pra `DocumentConfig.header.show`.

3. **`nomeExibicao` conflita com uma decisão de design já registrada.** O handoff (seção 4, nota
   final) diz explicitamente: *"Removido do protótipo: 'Nome da instituição no documento'
   (personalizar o nome por escola) ... o nome vem do cadastro da unidade."* Mas o código atual
   ainda tem `nomeExibicao`/`NomeExibicao` como campo editável e persistido em
   `ConfiguracaoEscolaModel`/`EscolaDocumentoConfiguracao`. Se o mapeamento usar `NomeOficial` (como
   a tabela "Identificação da unidade" indica), `nomeExibicao` fica um campo morto; se usar
   `nomeExibicao`, contraria a decisão já tomada no handoff. Precisa de uma decisão explícita antes
   de implementar.

4. **Escopo "por documento" ainda não existe no backend.** O handoff lista "Possui cabeçalho" como
   campo de escopo Escola **por documento** (seção 4). Hoje `EscolaDocumentoConfiguracao` replica o
   mesmo `ValoresJson` pra todos os `TipoDocumento` (ver `SalvarConfiguracaoEscolaDocPedService.cs`,
   comentário já existente no código) — então, estruturalmente, não dá pra ter "cabeçalho ligado no
   Histórico e desligado no Certificado" ainda. Qualquer mapeamento herdaria essa limitação: o
   cabeçalho seria igual em todos os 5 documentos até essa parte do backend mudar.

### Conclusão da Pergunta 2

Os dados **de conteúdo** (nome oficial, endereço, bairro, cidade, CEP, telefone, CNPJ, informações
adicionais, logo, brasão) já estão todos persistidos em algum lugar certo — não falta criar coluna
nem tabela nova pra maioria dos campos. O que falta, pra um mapeamento config → `DocHeaderData`
fazer sentido e refletir fielmente o que foi salvo, é resolver 4 decisões/gaps acima (UF ausente na
tela, dois toggles de cabeçalho sobrepostos, `nomeExibicao` conflitando com o handoff, e escopo por
documento ainda não existir) — não é um trabalho de "só plugar o backend no preview", tem
ambiguidade de modelo de dados por trás.

## Pergunta 3: fonte de verdade real — `CabecalhoDocumentoService`/`GetCabecalhoDocumento`

O usuário apontou a fonte de verdade correta, que eu não tinha visto na Pergunta 2:
`backend/EstruturaPedagogica.Domain.Services/PainelAluno/CabecalhoDocumentoService.cs` →
`IEscolaRepository.GetCabecalhoDocumento(hashEscola)` (`EscolaRepository.cs:248`). Isso muda — e
confirma — boa parte da análise anterior.

### O que o código realmente faz

`GetCabecalhoDocumento` é chamado por **todo** gerador de documento real do sistema:
`GetHistoricoEscolarService`, `GetCertificadoConclusaoService`, `GetAtaResultadosFinaisService`,
`GetLivroMatriculaService`, `GetDocumentoDiarioDeClasseService`, `GetAlunosListaPresencaService`,
`GetAlunosCarometroService` — é, de fato, a única fonte de dado de cabeçalho em todo o sistema.

```csharp
public Task<CabecalhoDocumentoResponse> GetCabecalhoDocumento(Guid hashEscola)
{
   return QueryableAtivos()
      .Where(x => x.Hash == hashEscola)
      .Select(x => new CabecalhoDocumentoResponse
      {
         NomeRede   = x.Rede.Nome,
         NomeEscola = x.Nome,
         LogoUrl    = x.Rede.CaminhoArquivoLogo,
         BrasaoUrl  = x.Estado.CaminhoArquivoBrasao,
         Endereco   = x.Rua == null ? null : x.Rua + (x.Numero != null ? ", " + x.Numero : "") + (x.Bairro != null ? " - " + x.Bairro : ""),
         Cidade     = x.NomeCidade,
         UF         = x.Estado.Sigla,
         Cep        = x.Cep,
         Telefone   = x.Telefone,
         CNPJ       = x.CNPJ,
         InformacoesAdicionais = x.RazaoSocial,
      })
      .FirstOrDefaultAsync();
}
```

Isso **corrige** dois pontos da Pergunta 2:

- **UF existe**, sim — só não vem da tela "Identificação da unidade", vem de `Escola.Estado.Sigla`
  (cadastro raiz da escola, tela fora do módulo Documentação Pedagógica).
- **Bairro não é campo separado** no `DocHeaderData`/`CabecalhoDocumentoResponse` porque já vem
  **embutido dentro de `Endereco`** (`Rua + Número + " - " + Bairro`), não como campo próprio. Não é
  um dado faltando, é só concatenado — então `DocHeaderData.district` (que o componente suporta
  separadamente) nunca é usado por nenhum fluxo real, porque a fonte nunca separa os dois.

### O achado mais importante: duas fontes de identificação da escola, só uma é lida de verdade

A tela "Configurações da escola → Identificação da unidade" (seção 4.2 do handoff, entidade
`EscolaAnoLetivoDocumentacaoPedagogica`, editável por `SalvarEscolaAnoLetivoDocPedService`) **não é
lida por nenhum gerador de documento**. Busquei todos os usos de
`EscolaAnoLetivoDocumentacaoPedagogica` no backend: só aparece em
`SalvarEscolaAnoLetivoDocPedService` (grava) e `ListarEscolaAnoLetivoDocPedService` (lista pra tela
de config) — nenhum `Get*DocumentoService` a referencia.

Ou seja: **hoje existem dois cadastros de endereço/CNPJ/telefone da escola, e o que o usuário edita
em "Identificação da unidade" (Documentação Pedagógica) não afeta nenhum documento impresso.** O que
sai no papel vem sempre do cadastro raiz (`Escola.Rua/Numero/Bairro/NomeCidade/Cep/Telefone/CNPJ`,
tela fora deste módulo). Isso não é um gap de modelagem — é uma tela nova que ainda não foi
conectada à fonte real (ou que vai substituí-la, e isso ainda não aconteceu).

### `InformacoesAdicionais` é outro campo, não o que a nova config edita

`GetCabecalhoDocumento` preenche `InformacoesAdicionais = x.RazaoSocial` (razão social da escola,
sempre, sem configuração). O campo novo do painel (`InfoAdic`/`InfoAdicTexto`, pensado pra
decreto/parecer/credenciamento, seção 4.1 do handoff) é **outro conceito, numa tabela diferente**
(`EscolaDocumentoConfiguracao`), e não tem relação nenhuma com esse `InformacoesAdicionais` do
cabeçalho real. Se algum dia isso for unificado, alguém vai ter que decidir: o texto impresso
continua sendo a Razão Social, passa a ser o texto do painel, ou os dois (um substituindo o outro
condicionalmente)?

### `PossuiCabecalho`/`MostrarCabecalho`/`InfoAdic` não são lidos em lugar nenhum

Em `GetHistoricoEscolarService.cs` (e as cópias idênticas em `GetAtaResultadosFinaisService`/
`GetLivroMatriculaService`), a config de Escola é desserializada numa classe **privada e estreita**:

```csharp
private class EscolaAssinaturasValores
{
   public bool PossuiAssinaturaDiretor { get; set; }
   public string AssinaturaDiretor { get; set; }
   public bool PossuiAssinaturaSecretaria { get; set; }
   public string AssinaturaSecretaria { get; set; }
   public bool PossuiAssinaturaProfInspetor { get; set; }
   public string AssinaturaProfInspetor { get; set; }
}
```

Só os campos de assinatura são extraídos do JSON salvo (`JsonSerializer.Deserialize` ignora o
resto). `PossuiCabecalho`, `MostrarCabecalho`, `Cabecalho`, `NomeExibicao`, `InfoAdic`,
`InfoAdicTexto`, `ExibirFiliacao`, `CargaHorariaPorDisciplina`, `AssinaturaEmTodasAsFolhas` **são
salvos pelo painel novo, mas nenhum gerador real os lê** — `response.Cabecalho = cabecalho` é
atribuído incondicionalmente, sem checar `PossuiCabecalho`. Hoje, desligar "Possui cabeçalho" no
painel não esconde o cabeçalho em nenhum PDF gerado de verdade.

### O padrão que o usuário descreveu já existe — e está certo

A frase "para montar um documento é necessário os dados dele e a configuração da rede/escola" **é
exatamente o que `GetHistoricoEscolarService.Get()` já faz**, linha a linha:

```csharp
cabecalho      = await _escolaRepository.GetCabecalhoDocumento(escola.Hash);               // dados do documento
configRede     = await _redeDocumentoRepository.GetFirst(x => x.RedeId == ... && x.TipoDocumentoId == tipoHistorico.Id);   // config da rede
valoresHistorico = JsonSerializer.Deserialize<HistoricoValores>(configRede.ValoresJson);    // mesmo shape usado pelos novos painéis
configEscola   = await _escolaDocumentoRepository.GetFirst(x => x.EscolaId == escola.Id && x.AnoLetivoId == null); // config da escola
valoresEscola  = JsonSerializer.Deserialize<EscolaAssinaturasValores>(configEscola.ValoresJson);
```

Isso já é produção — `HistoricoValores` é o mesmo modelo que os novos painéis
(`doc-historico-config-panel`) salvam. O que falta é só o **preview da tela nova** replicar esse
mesmo padrão (hoje ele não chama `GetCabecalhoDocumento` nem lê `PossuiCabecalho`/`InfoAdic` — usa
só o placeholder, ver Pergunta 1).

### Conclusão consolidada

| Camada | Fonte real | Consumida por documento real? | Consumida pelo preview novo? |
|---|---|---|---|
| Nome/endereço/cidade/UF/CEP/telefone/CNPJ/logo/brasão | `Escola`/`Rede`/`Estado` via `GetCabecalhoDocumento` | **Sim** (todos os documentos) | Não (placeholder fixo) |
| "Identificação da unidade" (`EscolaAnoLetivoDocumentacaoPedagogica`) | Tela nova de Documentação Pedagógica | **Não, nenhum** | Não |
| `PossuiCabecalho`/`MostrarCabecalho` (show/hide) | `EscolaDocumentoConfiguracao` (novo painel) | **Não** | Não |
| `InfoAdic`/`InfoAdicTexto` | `EscolaDocumentoConfiguracao` (novo painel) | **Não** (usa `RazaoSocial` fixo, outro campo) | Não |
| Brasão (`IncluirBrasao`/`UtilizaBrasaoDoPais`/`UtilizaBrasaoUnesco`) | `RedeDocumentoConfiguracao` (`HistoricoValores`) | Sim, o flag chega no response — mas só há 1 URL de brasão (`Estado.CaminhoArquivoBrasao`), sem asset separado pra país/Unesco | Não |
| Assinaturas (secretário/diretor/inspetor) | `EscolaDocumentoConfiguracao` | **Sim** | Não |

A arquitetura "dados do documento + config de rede/escola" já existe e funciona na geração real.
O trabalho que falta pra fechar a Pergunta 1 (preview refletir a config) é: (1) o preview chamar
`GetCabecalhoDocumento`/`CabecalhoDocumentoService` real pra escola selecionada, igual aos geradores
reais já fazem; (2) decidir se `PossuiCabecalho`/`InfoAdic`/`InfoAdicTexto` passam a ser lidos por
esses geradores (hoje não são, em nenhum documento) — sem isso, mesmo integrando o preview, o
comportamento do preview divergiria do PDF real gerado em produção.

## Considerações do usuário

_(preencher)_
