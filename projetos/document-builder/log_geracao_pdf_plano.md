# Plano Técnico — Log de Geração de Documento (document-builder)

> Spec de origem: `document-builder/log_geracao_pdf.md` + `log_geracao_pdf_refinamento.md`
> Repositório: `estrutura-pedagogica` (branch local `feature/LogGeracaoDoc`)
> Card Jira: nenhum ainda — ao abrir, mover o script SQL de `_scripts/` para `cards/<EFC-xxx>/sql/`
> **Status: implementado.** Este documento descreve o que foi efetivamente construído.

---

## Contexto

Padrões confirmados no backend (`backend/EstruturaPedagogica.*`, ver `backend/README.md`):

- Camadas: `Api` (Controllers) → `Domain.Services` (Service, interface em `Domain.Services/{Feature}/Interfaces/`) → `Domain` (Entity, DTO, interface de Repository) → `Infra` (implementação do Repository + `ApplicationContext` + `Mapping/` Fluent API).
- Entidades de auditoria herdam `StatefulEntity` (`Id`, `Hash`, `Ativo`, `DataInclusao`/`UsuarioInclusao`, `DataUltimaAlteracao`/`UsuarioUltimaAlteracao`, `DataInativacao`/`UsuarioInativacao`) — preenchidas automaticamente pelo `Repository<T>` genérico via `IUsuarioAutenticadoRepository.IdUsuarioAutenticado` em `Insert`/`Update`/`Disable` (checagem `entity is IBaseStateEntity`).
- Existe também `LogOperacoesEntity`/`ILogOperacoesEntity` (log "puro", sem soft-delete) — **não usado aqui** porque não implementa `IBaseStateEntity`, então o `Repository<T>.Insert()` genérico não preenche `UsuarioInclusao`/`DataInclusao` automaticamente para ele. `StatefulEntity` é o caminho testado (mesmo usado por `LogErrosPrevia`, o precedente real de "log" no repo).
- Sem EF Migrations — schema via script SQL manual em `backend/Scripts/`.
- Convenção de coluna de FK: nome da entidade relacionada **sem sufixo `Id`** no banco (`Escola`, `Rede`), mas a propriedade C# na entidade usa sufixo `Id` (`EscolaId`) + navegação (`Escola`) — mapeado via `.HasColumnName(...)`.
- Escola/Rede não vêm de contexto de sessão — chegam por request (`hashEscola`, `hashRede`) e são resolvidos para `Id` via `GetIdByHash` (método de `IRepositoryGetByHash<T>`, já implementado em `IEscolaRepository`/`IRedeRepository`).
- Sem `[Authorize]` nativo no projeto — controllers usam `[RequiredAuthorization((int)FuncionalidadeEnum.X)]`; para um endpoint transversal (sem uma única `Funcionalidade` dona), usa-se `[RequiredAuthorization]` sem argumento — precedente real: `ConfiguradorPeriodosLetivosController`.
- Registro de Service/Repository no DI é automático por convenção (`IBaseService`/`IBaseRepository`) — sem registro manual em `DependencyInjectionServices.cs`.

---

## Fase 1 — Script SQL

**Status: tabela criada e em uso** (confirmado pelo usuário rodando `SELECT * FROM LogGeracaoDocumento` contra o banco real).

**Arquivo:** `backend/Scripts/criar-tabela-log-geracao-documento.sql` (cópia em `_scripts/` no salta_brain) — **consolidado** para refletir o estado final da tabela (todas as colunas já corretas), depois que a modelagem evoluiu em rodadas sucessivas (ver histórico abaixo). Serve para provisionar a tabela do zero em um ambiente novo.

```sql
CREATE TABLE [dbo].[LogGeracaoDocumento] (
    [Id]                     INT IDENTITY(1,1)   NOT NULL,
    [Hash]                   UNIQUEIDENTIFIER    NOT NULL DEFAULT NEWID(),
    [Ativo]                  BIT                 NOT NULL DEFAULT 1,
    [DataInclusao]           DATETIME            NOT NULL,
    [UsuarioInclusao]        INT                 NULL,
    [DataUltimaAlteracao]    DATETIME            NULL,
    [UsuarioUltimaAlteracao] INT                 NULL,
    [DataInativacao]         DATETIME            NULL,
    [UsuarioInativacao]      INT                 NULL,
    [NomeDocumento]          VARCHAR(200)        NOT NULL,
    [TipoGeracao]            TINYINT             NOT NULL, -- 1 = Impressao, 2 = Pdf
    [Sucesso]                BIT                 NOT NULL DEFAULT 1, -- geração no backend concluiu com sucesso?
    [Metadados]              NVARCHAR(MAX)       NULL,
    [Escola]                 INT                 NULL,
    [Rede]                   INT                 NULL,
    [AnoLetivo]              INT                 NULL,
    [Pessoa]                 INT                 NULL, -- aluno
    CONSTRAINT [PK_LogGeracaoDocumento] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_LogGeracaoDocumento_Hash] UNIQUE ([Hash]),
    CONSTRAINT [FK_LogGeracaoDocumento_Escola] FOREIGN KEY ([Escola]) REFERENCES [dbo].[Escola] ([Id]),
    CONSTRAINT [FK_LogGeracaoDocumento_Rede] FOREIGN KEY ([Rede]) REFERENCES [dbo].[Rede] ([Id]),
    CONSTRAINT [FK_LogGeracaoDocumento_AnoLetivo] FOREIGN KEY ([AnoLetivo]) REFERENCES [dbo].[AnoLetivo] ([Id]),
    CONSTRAINT [FK_LogGeracaoDocumento_Pessoa] FOREIGN KEY ([Pessoa]) REFERENCES [dbo].[Pessoa] ([Id])
);

CREATE INDEX [IX_LogGeracaoDocumento_Escola_DataInclusao] ON [dbo].[LogGeracaoDocumento] ([Escola], [DataInclusao]);
```

Schema `dbo` confirmado (mappings de `Escola`/`Rede` não usam `.ToTable(schema:)`, logo caem no schema padrão). **Sem vínculo com Turma** — removido do escopo por decisão do usuário (escola + rede já bastam).

### Histórico de modelagem (scripts incrementais já aplicados)

A tabela real foi criada com o schema original (Escola/Rede obrigatórias, sem AnoLetivo/Pessoa/Sucesso) e evoluiu via os scripts abaixo, aplicados nessa ordem contra o ambiente já existente. Eles permanecem no repo como registro do que foi de fato executado — o `criar-tabela-*.sql` acima é que reflete o estado final, para quem for provisionar do zero.

**`backend/Scripts/alterar-tabela-log-geracao-documento-anoletivo-aluno.sql`** — `Escola`/`Rede` passam a permitir `NULL`; adiciona `AnoLetivo` (`dbo.AnoLetivo`) e `Pessoa` (`dbo.Pessoa`, representando o aluno) como FKs opcionais:
```sql
ALTER TABLE [dbo].[LogGeracaoDocumento] ALTER COLUMN [Escola] INT NULL;
ALTER TABLE [dbo].[LogGeracaoDocumento] ALTER COLUMN [Rede] INT NULL;

ALTER TABLE [dbo].[LogGeracaoDocumento] ADD [AnoLetivo] INT NULL;
ALTER TABLE [dbo].[LogGeracaoDocumento] ADD [Pessoa] INT NULL;

ALTER TABLE [dbo].[LogGeracaoDocumento]
    ADD CONSTRAINT [FK_LogGeracaoDocumento_AnoLetivo] FOREIGN KEY ([AnoLetivo]) REFERENCES [dbo].[AnoLetivo] ([Id]);

ALTER TABLE [dbo].[LogGeracaoDocumento]
    ADD CONSTRAINT [FK_LogGeracaoDocumento_Pessoa] FOREIGN KEY ([Pessoa]) REFERENCES [dbo].[Pessoa] ([Id]);
```
Convenções confirmadas: `AnoLetivo` é `BaseEntity` (sem soft-delete, tabela `dbo.AnoLetivo`, `Id` = o próprio ano); `Pessoa` é `BaseEntity` (`dbo.Pessoa`). Ambas expõem `IRepositoryGetByHash<T>` (logo `GetIdByHash`), mesmo mecanismo já usado para Escola/Rede. Convenção de coluna mantida: FK para `Pessoa` usa nome de coluna `Pessoa` (não `Aluno`) — confirmado em `AlunoFaltasMap`/`AlunoFrequenciaMap`, que fazem o mesmo (`PessoaId` → coluna `Pessoa`).

**`backend/Scripts/alterar-tabela-log-geracao-documento-sucesso.sql`** — adiciona `Sucesso`, para diferenciar geração no backend concluída com sucesso de falha:
```sql
ALTER TABLE [dbo].[LogGeracaoDocumento] ADD [Sucesso] BIT NOT NULL CONSTRAINT [DF_LogGeracaoDocumento_Sucesso] DEFAULT 1;
```

---

## Fase 2 — Enum

**Arquivo:** `backend/EstruturaPedagogica.Domain/Enums/LogGeracaoDocumento/TipoGeracaoDocumentoEnum.cs`

```csharp
namespace EstruturaPedagogica.Domain.Enums.LogGeracaoDocumento
{
   public enum TipoGeracaoDocumentoEnum
   {
      Impressao = 1,
      Pdf = 2,
   }
}
```

---

## Fase 3 — Entity + Mapping

**Arquivo:** `backend/EstruturaPedagogica.Domain/Entities/Stateful/LogGeracaoDocumento.cs`

```csharp
[ExcludeFromCodeCoverage]
public class LogGeracaoDocumento : StatefulEntity
{
   public virtual string NomeDocumento { get; set; }
   public virtual TipoGeracaoDocumentoEnum TipoGeracao { get; set; }
   public virtual bool Sucesso { get; set; }
   public virtual int? EscolaId { get; set; }
   public virtual Escola Escola { get; set; }
   public virtual int? RedeId { get; set; }
   public virtual Rede Rede { get; set; }
   public virtual int? AnoLetivoId { get; set; }
   public virtual AnoLetivo AnoLetivo { get; set; }
   public virtual int? PessoaId { get; set; }
   public virtual Pessoa Pessoa { get; set; }
   public virtual string Metadados { get; set; }
}
```

Todas as FKs são opcionais (`int?`) — `Escola`/`Rede` deixaram de ser obrigatórias na mesma rodada em que `AnoLetivo`/`Pessoa` foram adicionadas.

**Arquivo:** `backend/EstruturaPedagogica.Infra/Mapping/Stateful/LogGeracaoDocumentoMap.cs` — `IEntityMap<LogGeracaoDocumento>`, `builder.IsStatefulEntity()`, FKs via `.Property(x => x.EscolaId).HasColumnName("Escola")` + `.HasOne(x => x.Escola).WithMany()` (sem coleção reversa em `Escola`/`Rede` — deliberado: ninguém vai navegar `Escola.LogGeracaoDocumentos`, e adicionar essa coleção só para seguir a convenção padrão do `criar-entidade` teria custo de churn em duas entidades centrais sem benefício real).

**Arquivo:** `backend/EstruturaPedagogica.Test/Integration/Fixtures/Entities/LogGeracaoDocumentoFixture.cs` — segue o padrão `Faker<T>` com `EscolaFixture.Gerar()`/`RedeFixture.Gerar()` como default das relações obrigatórias.

---

## Fase 4 — DTO de Request

**Arquivo:** `backend/EstruturaPedagogica.Domain/DTO/LogGeracaoDocumento/LogGeracaoDocumentoRequest.cs`

```csharp
public class LogGeracaoDocumentoRequest
{
   public string NomeDocumento { get; set; }
   public TipoGeracaoDocumentoEnum TipoGeracao { get; set; }
   public bool Sucesso { get; set; } = true;
   public Guid? HashEscola { get; set; }
   public Guid? HashRede { get; set; }
   public Guid? HashAnoLetivo { get; set; }
   public Guid? HashPessoa { get; set; }
   public string Metadados { get; set; }
}
```

Todos os hashes agora são opcionais (`Guid?`) — o frontend pode omitir qualquer um deles.

---

## Fase 5 — Repository

**Arquivo:** `backend/EstruturaPedagogica.Domain/Interfaces/Stateful/ILogGeracaoDocumentoRepository.cs`

```csharp
public interface ILogGeracaoDocumentoRepository :
    IBaseRepository
  , IRepositoryInsert<LogGeracaoDocumento>
  , IRepositoryGet<LogGeracaoDocumento>
{
}
```

**Arquivo:** `backend/EstruturaPedagogica.Infra/Repositories/Stateful/LogGeracaoDocumentoRepository.cs` — corpo vazio, herda `Repository<LogGeracaoDocumento>`. Mesmo padrão de `ILogErrosPreviaRepository` (o precedente real de "log" no repo): `Insert` + `Get`, sem `Update`/`Disable`/`GetByHash` — é um log imutável, ninguém referencia uma linha por hash.

---

## Fase 6 — Service

**Arquivo:** `backend/EstruturaPedagogica.Domain.Services/LogGeracaoDocumento/Interfaces/ILogGeracaoDocumentoService.cs`

```csharp
public interface ILogGeracaoDocumentoService : IBaseService
{
   Task<ServiceResult<bool>> Registrar(LogGeracaoDocumentoRequest request);
}
```

**Arquivo:** `backend/EstruturaPedagogica.Domain.Services/LogGeracaoDocumento/LogGeracaoDocumentoService.cs`

```csharp
public class LogGeracaoDocumentoService(
   ILogGeracaoDocumentoRepository _logGeracaoDocumentoRepository,
   IEscolaRepository _escolaRepository,
   IRedeRepository _redeRepository,
   IAnoLetivoRepository _anoLetivoRepository,
   IPessoaRepository _pessoaRepository) : ILogGeracaoDocumentoService
{
   private static ServiceResult<bool> ValidarRequest(LogGeracaoDocumentoRequest request)
   {
      ServiceResult<bool> result = new();
      if (request == null) { return result.WithError(DefaultMessages.RequisicaoNula); }
      if (string.IsNullOrWhiteSpace(request.NomeDocumento)) { result.AddError("Informe o nome do documento."); }
      return result;
   }

   private static async Task<(int? Id, bool NaoEncontrado)> ResolverIdOpcional(Guid? hash, Func<Guid, Task<int>> getIdByHash)
   {
      if (!hash.HasValue || hash.Value == Guid.Empty) { return (null, false); }
      var id = await getIdByHash(hash.Value);
      return id == 0 ? (null, true) : (id, false);
   }

   public async Task<ServiceResult<bool>> Registrar(LogGeracaoDocumentoRequest request)
   {
      var result = ValidarRequest(request);
      if (!result.IsSuccess) { return result; }

      var (escolaId, escolaNaoEncontrada) = await ResolverIdOpcional(request.HashEscola, h => _escolaRepository.GetIdByHash(h));
      if (escolaNaoEncontrada) { return result.WithError("Escola não encontrada."); }

      var (redeId, redeNaoEncontrada) = await ResolverIdOpcional(request.HashRede, h => _redeRepository.GetIdByHash(h));
      if (redeNaoEncontrada) { return result.WithError("Rede não encontrada."); }

      var (anoLetivoId, anoLetivoNaoEncontrado) = await ResolverIdOpcional(request.HashAnoLetivo, h => _anoLetivoRepository.GetIdByHash(h));
      if (anoLetivoNaoEncontrado) { return result.WithError("Ano letivo não encontrado."); }

      var (pessoaId, pessoaNaoEncontrada) = await ResolverIdOpcional(request.HashPessoa, h => _pessoaRepository.GetIdByHash(h));
      if (pessoaNaoEncontrada) { return result.WithError("Aluno não encontrado."); }

      await _logGeracaoDocumentoRepository.Insert(new Entities.LogGeracaoDocumento
      {
         NomeDocumento = request.NomeDocumento,
         TipoGeracao = request.TipoGeracao,
         Sucesso = request.Sucesso,
         EscolaId = escolaId,
         RedeId = redeId,
         AnoLetivoId = anoLetivoId,
         PessoaId = pessoaId,
         Metadados = request.Metadados
      });

      result.Data = true;
      return result;
   }
}
```

`ResolverIdOpcional` centraliza a regra "hash não informado → mantém null; hash informado mas não resolve → erro específico" para as 4 FKs opcionais. Nota de namespace: dentro de `EstruturaPedagogica.Domain.Services.LogGeracaoDocumento`, o nome `LogGeracaoDocumento` colide com o namespace — a entidade é referenciada como `Entities.LogGeracaoDocumento` (resolve via namespace ancestral comum, sem precisar de `using` extra), mesmo truque usado em `CargoPagamentoService.cs` (`Entities.CargoPagamento`).

---

## Fase 7 — Controller

**Arquivo:** `backend/EstruturaPedagogica.Api/Controllers/LogGeracaoDocumentoController.cs`

```csharp
[ApiController]
[RequiredAuthorization]
[Route("api/[controller]")]
[ExcludeFromCodeCoverage]
public class LogGeracaoDocumentoController : CustomController
{
   [HttpPost]
   [ApiExplorerSettings(IgnoreApi = false)]
   public async Task<IActionResult> Registrar([FromServices] ILogGeracaoDocumentoService service, [FromBody] LogGeracaoDocumentoRequest request)
   {
      return Result(await service.Registrar(request));
   }
}
```

Rota efetiva: `POST /api/LogGeracaoDocumento`. **Atenção:** roteamento ASP.NET Core é case-insensitive, mas não ignora hífens — `/log-geracao-documento` (kebab-case) **não** bate com o template `api/[controller]` (que gera literalmente `LogGeracaoDocumento`, sem hífen). O frontend chama `/loggeracaodocumento` (tudo minúsculo, sem hífen) — ver Fase 8.

---

## Fase 8 — Frontend: log dentro do próprio document-builder (não nos componentes de feature)

**Decisão de arquitetura (mudou durante a implementação):** inicialmente o plano previa chamar o log manualmente em cada componente de feature (`listar.component.ts`, `lista-presenca.component.ts`, `ficha-individual.component.ts`) logo após `viewer.print()`/`.save()`. O usuário redirecionou: **quem deve logar é o próprio document-builder**, controlado por uma flag na configuração do documento — não quem o consome. Motivo: evita esquecer de plugar o log em cada tela nova que usar o document-builder, e evita triplicar a mesma lógica.

**`models/document-config.ts`** — dois campos novos em `DocumentConfig`:
```ts
/** Quando true, registra um log de auditoria (usuário, escola, rede, hora) ao imprimir ou salvar PDF. */
logEnabled?: boolean
/** Contexto opcional para o log de auditoria — hashes ausentes ficam null no log (ex.: telas de exemplo/teste sem escola/rede reais). */
auditContext?: { hashEscola?: string; hashRede?: string }
```
`auditContext` (e seus campos internos) são opcionais — dá pra ligar `logEnabled: true` sozinho, sem escola/rede, para telas de exemplo/protótipo (ver Fase 10).

**`services/log-geracao-documento-api.service.ts`** (novo) — segue o padrão real do repo (`PdfApiService`), estende `ApiClient` em vez de injetar `HttpClient` direto:
```ts
@Injectable({ providedIn: 'root' })
export class LogGeracaoDocumentoApiService extends ApiClient {
  registrar(payload: LogGeracaoDocumentoPayload): void {
    this.post('/loggeracaodocumento', payload).subscribe({
      error: err => console.error('Falha ao registrar log de geração de documento', err),
    })
  }
}
```
Rota `/loggeracaodocumento` (sem hífen) — precisa bater com o template `api/[controller]` do `LogGeracaoDocumentoController`, que não usa kebab-case (ver Fase 7).

**`components/document-viewer/document-viewer.component.ts`** — `LogGeracaoDocumentoApiService` injetado no construtor; `print()` e `save()` chamam, logo após o sucesso da geração (dentro do `try`, antes do `finally` que libera a captura):
```ts
private registrarLogGeracao(cfg: DocumentConfig, tipoGeracao: 1 | 2, sucesso: boolean = true): void {
  if (!cfg.logEnabled) return;
  this.logGeracaoDocumentoApiService.registrar({
    nomeDocumento: cfg.title ?? 'documento',
    tipoGeracao,
    sucesso,
    hashEscola: cfg.auditContext?.hashEscola,
    hashRede: cfg.auditContext?.hashRede,
  });
}
```
`print()` chama com `tipoGeracao = 1` (Impressão), `save()` com `2` (Pdf). Fire-and-forget (`subscribe` sem `await`) — falha no log nunca bloqueia a entrega do documento. Guard só checa `logEnabled` — `auditContext` ausente vira `hashEscola`/`hashRede` `undefined` no payload (JSON omite as chaves), e o backend já aceita ambos ausentes.

**Ajuste (Fase 1c):** quando `useBackend` é verdadeiro (geração via Playwright no backend), a chamada `pdfApiService.gerar(...)` pode falhar — e até então esse caminho de erro não gerava log nenhum. Agora o branch `useBackend` fica dentro de um `try/catch` próprio: sucesso loga `sucesso: true`, falha loga `sucesso: false` e **relança o erro** (`throw err`) para não quebrar o tratamento de erro já existente em quem chama `viewer.print()`/`.save()` (ex.: `lista-presenca`'s `executarComRegeneracaoDeFotos`, que depende de capturar a exceção para tentar regenerar fotos). O caminho de geração no frontend (`printService.print/save`, sem `useBackend`) continua sem esse `try/catch` — só loga no sucesso, como antes; a exigência do usuário foi específica para "quando o documento é gerado no backend".

**Ativado em duas features** (rodada seguinte, a pedido do usuário):

- **`diario-de-classe/listar.component.ts`**: `hashEscola`/`hashRede` da request de filtro (`fv.hashEscola`/`fv.hashRede`) guardados em campos privados (`currentHashEscola`/`currentHashRede`) no momento em que `gerarDocumento()` monta o request; para reabrir um card já gerado (`visualizarDocumento`), os hashes são recuperados fazendo `JSON.parse(card.requestKey)` (a chave já serializa esses campos, não precisou mudar o `DiarioDocumentoStorageService`). `buildBundle()` seta `logEnabled: true` + `auditContext` só quando ambos os hashes estão presentes.
- **`lancamento-frequencia/lista-presenca.component.ts`**: `hashRede` vem do filtro (`getTurmas()` → `request.hashRede`, guardado em `currentHashRede`); `hashEscola` vem **por turma** (`item.turma.hashEscola`, já existente em `ListaPresencaTurmaResponse`) — como cada `DocumentBundle` já é por turma (`buildDiaria`/`buildSemanal`/`buildMensal`/`buildCarometro` recebem `item: ListaPresencaDocumentoTurmaData`), cada bundle loga a escola certa mesmo com múltiplas turmas/escolas selecionadas ao mesmo tempo. Ressalva: `DocumentViewerComponent.activeConfig` só olha `documents[0].config` para decisões como `pdfStrategy`/orientação — então numa geração multi-turma, só a config (e portanto o log) do **primeiro** bundle realmente dispara; é uma limitação pré-existente do viewer para várias decisões de config, não algo introduzido aqui.

### Fase 11 — Auditoria: todos os documentos reais (fora de `exemplos/`) com log ativo e nome correto

Levantamento de todos os consumidores de `<app-document-viewer>`/`DocumentViewerComponent` no repo (8 arquivos): 5 estão em `features/exemplos/` (fora de escopo desta auditoria) e 3 são features reais — os 3 abaixo. Nenhum deles tinha `title` configurado até esta rodada, então `nomeDocumento` no log caía sempre no fallback genérico `'documento'` (`cfg.title ?? 'documento'`). Corrigido:

- **`diario-de-classe/listar.component.ts`** — `title: 'Diário de Classe'` adicionado à config única do `buildBundle`.
- **`lancamento-frequencia/lista-presenca.component.ts`** — cada um dos 4 tipos de documento ganhou seu próprio `title`: `'Lista de Presença Diária'` (`buildDiaria`), `'Lista de Presença Semanal'` (`buildSemanal`), `'Lista de Presença Mensal'` (`buildMensal`), `'Carômetro'` (`buildCarometro`).
- **`ficha-individual.component.ts`** — `title: 'Ficha Individual'` + `logEnabled: true` na `BASE_CONFIG`, **sem** `auditContext` (a tela ainda usa `MOCK_REQUEST`, sem escola/rede reais). Antes dessa rodada, essa feature tinha sido deixada de fora por causa dos hashes mockados — mas como `auditContext` é opcional desde a Fase 10, dá pra ligar o log sem enviar nenhum hash falso: quando a tela for ligada a uma seleção real de aluno, só falta adicionar o `auditContext` com os hashes reais.

Resultado: **todos os 3 documentos reais fora de `exemplos/` agora logam com `logEnabled: true` e um `title` correto e distinguível** — `diario-de-classe` e `lista-presenca` também com `auditContext` (escola/rede reais); `ficha-individual` sem `auditContext` por enquanto (mock).

### Fase 12 — Removida a condicional de "só habilita log se hashEscola/hashRede existirem"

`listar.component.ts` e as 4 configs de `lista-presenca.component.ts` tinham `logEnabled`/`auditContext` atrás de um spread condicional (`...(hashEscola && hashRede ? {...} : {})`). Removido a pedido do usuário: como `Escola`/`Rede` já são colunas nuláveis no banco (Fase 1b) e `auditContext` já é opcional na config (Fase 10), não havia necessidade de gatear — `logEnabled: true` e `auditContext` agora são sempre setados, com `hashEscola`/`hashRede` como `string | undefined` (`?? undefined` só para satisfazer o tipo, já que os campos internos do componente são `string | null`). Se o hash realmente não existir no momento da geração, o log é gravado com a FK correspondente `null`, exatamente como o backend já suporta.

### Fase 10 — Ativado em `exemplos/carometro-exemplo`

`frontend/src/app/features/exemplos/carometro-exemplo/carometro-exemplo.component.ts` é uma tela de exemplo/teste do document-builder (dados 100% mockados — `MOCK_ALUNOS`, `HEADER_DATA` fake, sem escola/rede reais). Diferente de `ficha-individual`, aqui o pedido foi para logar mesmo sem contexto real, o que só foi possível depois de tornar `auditContext` totalmente opcional (ver acima): `BASE_CONFIG` ganhou `title: 'Carômetro (Exemplo)'` + `logEnabled: true`, sem `auditContext` — o log é gravado com `hashEscola`/`hashRede` ausentes (o backend já aceita isso desde a Fase 1b).

---

## Fase 9 — Testes de integração (backend)

Seguindo o comando `criar-testes` (seção .NET) do próprio repo `estrutura-pedagogica`, criado `backend/EstruturaPedagogica.Test/Integration/Scenarios/LogGeracaoDocumento/LogGeracaoDocumentoServiceTests.cs` com 8 cenários cobrindo `Registrar`:

- `RequestNulo`, `NomeDocumentoVazio` (validação)
- `EscolaInformadaMasNaoEncontrada`, `RedeInformadaMasNaoEncontrada`, `AnoLetivoInformadoMasNaoEncontrado`, `PessoaInformadaMasNaoEncontrada` (hash fornecido não resolve)
- `SemEscolaRedeAnoLetivoPessoa_RegistraLogComCamposNulos` (nenhum hash informado → sucesso com FKs null; também verifica `Sucesso = true` por default)
- `SucessoFalso_RegistraLogComSucessoFalso` (request com `Sucesso = false` → persiste `Sucesso = false`)
- `RequestValido_RegistraLogComSucesso` (todas as 4 FKs resolvidas e persistidas corretamente, `Sucesso = true`)

Segue o padrão canônico da doc (`GetRequiredService` no construtor, `SeedDatabase` via `dbContext.AddAsync`, `UsuarioAutenticadoRepository` mockado, repositórios reais via `AddTransient`). **Não foi possível confirmar com `dotnet build`/`dotnet test`** — o build trava em `MSB3027`/`MSB3021` porque os DLLs de `Api`/`Domain.Services`/`Infra`/`Domain` estavam bloqueados pelo IIS local (`w3wp.exe`) e/ou Visual Studio (`devenv.exe`) rodando a solution. Zero `error CS` no log — só falha na etapa de cópia do projeto `Api` (que `EstruturaPedagogica.Test` referencia transitivamente). Revisão estática feita linha a linha contra as interfaces reais (`IRepositoryGet<T>.Get()`, `DefaultMessages.RequisicaoNula`, construtores de `EscolaRepository`/`RedeRepository`/`AnoLetivoRepository`/`PessoaRepository`).

---

## Restrições e Riscos

| Risco | Mitigação |
|---|---|
| Nenhuma feature envia `HashAnoLetivo`/`HashPessoa` ainda | Backend já aceita; frontend (`diario-de-classe`, `lista-presenca`) só envia `hashEscola`/`hashRede` por ora — expandir quando fizer sentido |
| Chamada de log falha e trava o botão de imprimir/salvar | `subscribe` sem `await`, dentro do `try` — erro é só logado no console, `finally` sempre libera a captura |
| Volume de linhas cresce indefinidamente (log sem expurgo) | Fora de escopo por ora — revisar se necessário após uso real |
| `Metadados` livre (JSON sem schema) dificultar consulta futura | Aceitável — é só para contexto extra, não para relatórios estruturados |
| Testes de integração não confirmados via `dotnet build`/`dotnet test` (ambiente com IIS/VS local bloqueando DLLs) | Rodar manualmente quando IIS local e Visual Studio estiverem fechados: `dotnet build backend/EstruturaPedagogica.Test && dotnet test backend/EstruturaPedagogica.Test --filter "FullyQualifiedName~LogGeracaoDocumentoServiceTests" --no-build` |

---

## Verificação

1. Scripts SQL rodados em ambiente real — **feito** (tabela confirmada via `SELECT * FROM LogGeracaoDocumento`).
2. `POST /api/LogGeracaoDocumento` (chamado pelo frontend como `/loggeracaodocumento`) com um payload válido → linha inserida, `DataInclusao`/`UsuarioInclusao` preenchidos automaticamente. **Não verificado por mim diretamente** — sem acesso a logs/DB ao vivo nesta sessão.
3. Payload com algum hash informado mas inexistente → erro específico, nenhuma linha inserida. **Pendente de verificação.**
4. Payload sem `hashEscola`/`hashRede`/`hashAnoLetivo`/`hashPessoa` → sucesso, linha inserida com as 4 FKs null (caso de `carometro-exemplo`, Fase 10). **Pendente de verificação.**
5. `dotnet test --filter LogGeracaoDocumentoServiceTests` passando — **pendente**, aguardando IIS local/VS liberarem os DLLs.
