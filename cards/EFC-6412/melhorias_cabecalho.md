tema: document-builder
objetivo: analisar como funciona o componente de cabeçalho para planejar melhorias

repositorio: estrutura-pedagogica
tema: lista-presenca
documento que sera usado para testar o cabecalho alterado: lista-presenca diaria, semanal e mensal

---

## Localização dos documentos no código

| Tipo | Método | Arquivo |
|---|---|---|
| Diária | `buildDiaria()` | `frontend/src/app/features/lancamento-frequencia/lista-presenca/lista-presenca.component.ts` |
| Semanal | `buildSemanal()` | mesmo arquivo |
| Mensal | `buildMensal()` | mesmo arquivo |

O `headerData` de todos os três é construído em `buildBundle()` (mesmo arquivo):
```typescript
const headerData: DocHeaderData = { institutionName: item.turma.nomeEscola };
```
Atualmente só `institutionName` é preenchido.

---

## Como o cabeçalho funciona hoje — estrutura-pedagogica

### Componente
`frontend/src/shared/document-builder/components/doc-header/doc-header.component.*`

### Estrutura visual (flex row, 3 colunas)
```
[ logo 60×60 ] [ info central flex:1 ] [ brasão 60×60 (opcional) ]
```

- **Esquerda — logo:** `<img>` 60×60px, `object-fit: contain`. Se `logoUrl` for nulo renderiza placeholder. **Sem `*ngIf`** — logo sempre renderiza.
- **Centro — info institucional:** coluna flex com até 4 linhas:
  1. `institutionName` — bold 12px (único campo obrigatório)
  2. `addressLine` — `address - district - city/state`
  3. `contactLine` — `CEP: xxx | Telefone: xxx | CNPJ: xxx`
  4. `additionalInfo` — texto livre
- **Direita — brasão:** só renderiza se `showStateEmblem === true` E `stateEmblemUrl` preenchido.

### Interface `DocHeaderData` (atual)
```typescript
export interface DocHeaderData {
  institutionName: string      // obrigatório
  address?: string
  district?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  cnpj?: string
  additionalInfo?: string
  logoUrl?: string             // se ausente: placeholder
  stateEmblemUrl?: string
  showStateEmblem?: boolean
}
```

### Altura fixa
`DOC_HEADER_HEIGHT = 80` — usada pelo viewer para calcular espaço disponível na página.

---

## Análise do cabeçalho em documentacao-pedagogica

> **Nota:** o sistema de configuração descrito abaixo (por rede/escola) **não será adotado** em estrutura-pedagogica. A análise serve apenas para entender quais dados compõem um cabeçalho completo e como logo/brasão são tratados lá.

### Componente
`c:/projects/documentacao-pedagogica/frontend/src/app/gerador-documentos/doc-header/`

### Interface `DadosCabecalho`
```typescript
export interface DadosCabecalho {
  logo: string;           // URL do logo da rede
  escola: string;         // nome da escola
  endereco: string;
  bairro: string;
  cep: string;
  telefone: string;
  cnpj: string;
  info?: string;          // texto livre (campo "cabecalho" da escola)
  nomeMunicipio: string;
  uf: string;
  cidade: string;
  possuiCabecalho: boolean;   // escola tem cabeçalho customizado?
  incluirBrasao: boolean;     // exibir brasão?
  brasaoEstado: string;       // URL do brasão
}
```

### Estrutura visual (mesma ideia, dimensões ligeiramente diferentes)
```
[ logo 64×64 ] [ info central width:100% ] [ brasão 64×64 (se incluirBrasao) ]
```

- Logo: `<img width="64" [src]="info?.logo ? info?.logo : ''"` — condicional no `src`, mas a `div` sempre existe
- Nome da escola: font-size **16px** (maior que o atual 12px no estrutura-pedagogica)
- Endereço + contato: font-size 10px em linha única com `|` como separador
- Campo `info`: linha extra abaixo para texto livre da escola

### Sistema de configuração de rede/escola — **não usar**
Doc-ped tem telas admin onde rede/escola configuram:
- `mostrarCabecalho` / `possuiCabecalho` — ligar/desligar cabeçalho
- `cabecalho` (texto livre) — info extra
- `incluirBrasao` — toggle na rede
- `utilizaBrasaoDoPais` / `utilizaBrasaoUnesco` — variantes do brasão
- `caminhoArquivoLogo` — upload da logo da rede
- `caminhoArquivoBrasao` — upload do brasão da escola

Esses dados chegam via endpoint `/impressao/dadoscabecalho` que agrega escola + rede em `DadosCabecalho`.

**Não reproduzir esse sistema.** Em estrutura-pedagogica os dados de logo/brasão virão via `DocHeaderData` preenchido no momento de geração do documento.

---

## Plano para o novo cabeçalho — estrutura-pedagogica

### Layout visual pretendido
```
[ logo 60×60 ] [ linha1: NOME_REDE | NOME_ESCOLA           ]
               [ linha2: Rua, Nº - Bairro - Cidade/UF | CEP | Tel ]
               [ linha3: CNPJ: xx.xxx.xxx/xxxx-xx           ]
               [ linha4: <Mantenedora — se existir>         ]
```
Logo: `Rede.CaminhoArquivoLogo` (só renderiza se preenchido). Brasão: desabilitado por hora.

---

## Backend — serviço `DadosCabecalhoDocumento`

### Origem dos dados (confirmado via SQL em ElevaPortalHomolog)

| Campo do cabeçalho | Tabela | Coluna | Observação |
|---|---|---|---|
| Logo | `Rede` | `CaminhoArquivoLogo` varchar(250) | logo da rede |
| Brasão | `Estado` | `CaminhoArquivoBrasao` varchar(200) | por estado (desabilitado por hora) |
| Nome da rede | `Rede` | `Nome` | linha 1 — parte esquerda |
| Nome da escola | `Escola` | `Nome` | linha 1 — parte direita |
| Endereço | `Escola` | `Rua`, `Numero`, `Bairro` | montado no service |
| Cidade | `Escola` | `NomeCidade` varchar(200) | já denormalizado |
| UF | `Estado` | `Sigla` nvarchar(2) | via `Escola.Estado → Estado.Id` |
| CEP | `Escola` | `Cep` varchar(9) | |
| Telefone | `Escola` | `Telefone` varchar(20) | |
| CNPJ | `Escola` | `CnpjEscola` varchar(20) | linha 3 |
| Informações adicionais | `Escola` | `Mantenedora` varchar(250) | linha 4 (opcional) |

**Joins:**
- `Escola.Rede` (int) → `Rede.Id`
- `Escola.Estado` (int) → `Estado.Id` (LEFT JOIN — pode ser nulo)

### DTO `CabecalhoDocumentoResponse`
DTO reutilizável — pode compor o response de qualquer documento do sistema.

```csharp
// EstruturaPedagogica.Domain/DTO/Documentos/CabecalhoDocumentoResponse.cs
public class CabecalhoDocumentoResponse
{
    public string NomeRede   { get; set; }
    public string NomeEscola { get; set; }
    public string LogoUrl    { get; set; }   // Rede.CaminhoArquivoLogo
    public string BrasaoUrl  { get; set; }   // Estado.CaminhoArquivoBrasao
    public string Endereco   { get; set; }   // "Rua, Numero - Bairro" (montado)
    public string Cidade     { get; set; }   // NomeCidade
    public string UF         { get; set; }   // Estado.Sigla
    public string Cep        { get; set; }
    public string Telefone   { get; set; }
    public string CNPJ       { get; set; }   // CnpjEscola
    public string InformacoesAdicionais { get; set; }  // Mantenedora
}
```

### Serviço `GetCabecalhoDocumentoService`
- **Input:** `Guid hashEscola`
- **Localização:** `EstruturaPedagogica.Domain.Services/Documentos/GetCabecalhoDocumentoService.cs`
- **Interface:** `IGetCabecalhoDocumentoService`

```csharp
public async Task<CabecalhoDocumentoResponse> GetByHashEscola(Guid hashEscola)
{
    return await _escolaRepository.GetCabecalhoDocumento(hashEscola);
}
```

### Repositório — método `GetCabecalhoDocumento`
Adicionar em `EscolaRepository` (ou `CabecalhoDocumentoRepository` se preferir separar).

A entidade `Escola` não tem `Rua`, `CnpjEscola`, `Mantenedora` etc. mapeados → usar projeção direta no `.Select()`:

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
            Endereco   = (x.Rua != null
                ? x.Rua + (x.Numero != null ? ", " + x.Numero : "")
                    + (x.Bairro != null ? " - " + x.Bairro : "")
                : null),
            Cidade   = x.NomeCidade,
            UF       = x.Estado.Sigla,
            Cep      = x.Cep,
            Telefone = x.Telefone,
            CNPJ     = x.CnpjEscola,
            InformacoesAdicionais = x.Mantenedora,
        })
        .FirstOrDefaultAsync();
}
```

Para que o `.Select()` acesse `Rede` e `Estado`, as navigation properties precisam existir na entidade `Escola`. Hoje já existe `virtual Rede Rede`. Falta adicionar `virtual Estado Estado` + mapear os campos escalares (`Rua`, `CnpjEscola`, `Mantenedora` etc.) na entidade — só como propriedades, sem migration (já existem na tabela).

### Integração com lista de presença
O `CabecalhoDocumentoResponse` deve ser incluído em `ListaPresencaDocumentoTurmaData`:

```csharp
public class ListaPresencaDocumentoTurmaData
{
    public ListaPresencaTurmaItem Turma { get; set; }
    public List<ListaPresencaAlunoResponse> Alunos { get; set; }
    public CabecalhoDocumentoResponse Cabecalho { get; set; }  // novo
}
```

O service `GetAlunosListaPresencaService` (chamado pelo endpoint `lista-presenca/get-alunos`) já busca as turmas por hash — basta, para cada turma, chamar `GetCabecalhoDocumento(hashEscola)`. Como todas as turmas de uma chamada pertencem à mesma escola, uma única consulta resolve todas.

---

## Componente `doc-header` — correções necessárias

1. **Logo sem `*ngIf`** — placeholder aparece quando sem URL. Corrigir:
   ```html
   <div class="logo-area" *ngIf="data.logoUrl">
     <img class="logo-img" [src]="data.logoUrl" />
   </div>
   ```

2. **`DOC_HEADER_HEIGHT = 80`** — rever após testes com 4 linhas reais. Estimativa: nome(14px) + endereço(13px) + CNPJ(13px) + mantenedora(13px) + padding(16px) ≈ 69px → provavelmente 80 suficiente, mas validar.

3. **Nome da escola em 12px** — doc-ped usa 16px. Avaliar aumentar para 13-14px.

---

## Como o frontend usa `CabecalhoDocumentoResponse`

No `buildBundle()` de `lista-presenca.component.ts`, substituir o `headerData` fixo:

```typescript
// antes:
const headerData: DocHeaderData = { institutionName: item.turma.nomeEscola };

// depois (item.cabecalho = CabecalhoDocumentoResponse):
const cab = item.cabecalho;
const headerData: DocHeaderData = {
  institutionName: cab.nomeRede && cab.nomeEscola
    ? `${cab.nomeRede} | ${cab.nomeEscola}`
    : (cab.nomeEscola ?? item.turma.nomeEscola),
  address:         cab.endereco ?? undefined,
  city:            cab.cidade ?? undefined,
  state:           cab.uf ?? undefined,
  zipCode:         cab.cep ?? undefined,
  phone:           cab.telefone ?? undefined,
  cnpj:            cab.cnpj ?? undefined,
  additionalInfo:  cab.informacoesAdicionais ?? undefined,
  logoUrl:         cab.logoUrl ?? undefined,
  stateEmblemUrl:  cab.brasaoUrl ?? undefined,
  showStateEmblem: false,   // ativar quando validado
};
```
