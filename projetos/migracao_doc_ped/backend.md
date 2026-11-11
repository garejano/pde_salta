# Backend — plano de migração

> Ver [`readme.md`](readme.md) para contexto geral e achados. Este documento cobre só a parte
> de backend: o modelo Hash/HashOrigem, o que precisa migrar e o que não precisa.

## Arquitetura de origem

`documentacao-pedagogica/backend` — .NET 8, Clean Architecture, banco **PostgreSQL** próprio:

```
DocumentacaoPedagogica.Api              — Controllers
DocumentacaoPedagogica.Application      — casos de uso (ImportacaoHistoricoSerie, ImportacaoResultadoFinal, Impressao, Sync, Usuario)
DocumentacaoPedagogica.Domain           — Entities, DTO, Enum, Interfaces
DocumentacaoPedagogica.Domain.Services  — regras de negócio, um diretório por domínio
DocumentacaoPedagogica.Infra            — repositórios EF Core, mappings, migrations
DocumentacaoPedagogica.Extensions
```

`estrutura-pedagogica/backend` segue a mesma divisão em camadas, banco **SQL Server** (o banco
principal do portal). Ver `estrutura-pedagogica/README.md`.

## O modelo Hash / HashOrigem (por que isso importa)

- `BaseEntity` (doc-ped): `Id` (int) + `Hash` (Guid) — identificador local, dentro do banco do
  doc-ped.
- `ExternalEntity : BaseEntity` (doc-ped): adiciona `HashOrigem` (Guid) — o Hash da mesma
  entidade **no banco principal** (o banco que `estrutura-pedagogica` usa), além de
  `Ativo`/`DataInclusao`/`DataInativacao`.
- Entidades que estendem `ExternalEntity` no doc-ped: `Aluno`, `Turma`, `Escola`,
  `EscolaAnoLetivo`, `EscolaSerie`, `EscolaSerieDisciplina`, `EscolaExterna`, `Rede`,
  `AnoLetivo`, `Disciplina`, `DisciplinaPadrao`, `Segmento`, `Serie`, `AreaConhecimento`,
  `TipoComponenteCurricular`, `Municipio`, `Estado`, `Pais`, `Usuario`, `Turno`, `Funcionalidade`,
  `PerfilAcesso`, `SerieNomenclaturaPorRede`, entre outras — a lista completa de entidades está
  em `DocumentacaoPedagogica.Domain/Entities/`.
- **Confirmado**: `Escola`, `EscolaAnoLetivo`, `AnoLetivo`, `AreaConhecimento`, `Estado`,
  `Disciplina`, `PerfilAcesso`, `Funcionalidade` já existem como entidades nativas em
  `EstruturaPedagogica.Domain/Entities/Base/` no destino.

**Conclusão:** o doc-ped mantém uma **cópia local sincronizada** ("cache" via `Sync`/
`Barramento`/`FilaSyncAluno`/`LogSync`) de entidades que já são canônicas no banco principal.
Migrar essas entidades para `estrutura-pedagogica` seria duplicar dado que já existe lá — a
integração correta é resolver `HashOrigem` (doc-ped) → `Hash` (estrutura-pedagogica) e usar as
entidades nativas do destino diretamente, sem trazer o mecanismo de sync do doc-ped junto.

## O que **não** migra

| Domínio de origem (`Domain.Services/`) | Motivo |
|---|---|
| `Aluno`, `Escola`, `EscolaAnoLetivo`, `EscolaExterna`, `EscolaSerie`, `Rede`, `Serie`, `Segmento`, `Municipio`, `Estado`, `Pais`, `AreaConhecimento`, `TipoComponenteCurricular`, `Turma` | Espelhos de entidades já nativas em `estrutura-pedagogica` (ver acima) |
| `Usuario`, `UsuarioAcesso`, `UsuarioPerfilEscola`, `PerfilAcesso`, `Funcionalidade`, `LogFuncionalidade` | Auth/perfis já resolvidos pela infra de `estrutura-pedagogica` |
| `Sync`, `Barramento` | Mecanismo de sincronização do banco próprio do doc-ped — deixa de existir se as entidades passam a ser nativas |
| `Impressao` (genérico) | Vira `shared/document-builder` no frontend; no backend, cada domínio expõe seu próprio endpoint de dados (sem motor central de impressão) |

## Achado: existe um schema legado "His*" no banco principal — não reaproveitar

Antes de desenhar o schema do Card 1, foi confirmado (via query real, não só leitura de schema)
que o banco principal já tem uma dúzia de tabelas `His*` que mapeiam quase 1:1 os conceitos de
Histórico Escolar do doc-ped: `HisHistorico`, `HisHistoricoAnoLetivo`, `HisFundamentacaoLegal`,
`HisResultadoFinal`, `HisSerie`, `HisEscola`, `HisEscolaComp`/`HisEscolaCompDisc`,
`HisDisciplina`, `HisAnoLetivo`, `HisCargaHoraria`, `HisNucleoComum`, `HisHistoricoNotas` — e
até tabelas-ponte explícitas ligando ao modelo atual: `SerieHisSerie`, `DisciplinaHisDisciplina`.

**Isso é um sistema de Histórico Escolar anterior/legado — não é para ser reaproveitado.**
Confirmado por consulta direta:
- `HisFundamentacaoLegal`: 26 linhas, última inclusão em **2022-04-25** — congelado.
- `HisHistoricoAnoLetivo` (o equivalente a `HistoricoSerie`): última inclusão em
  **2025-09-22** — parou de receber detalhe por ano letivo há quase um ano.
- `HisHistorico` (o registro "pai" por aluno) ainda recebe uma inclusão esporádica (última em
  2026-07-14), mas em ritmo de poucas por mês — consistente com algum gatilho/sync residual de
  matrícula, não com uso ativo do módulo.

Conclusão: o schema `His*` foi o Histórico Escolar de um sistema anterior, superado pelo
PostgreSQL próprio do `documentacao-pedagogica` (provavelmente por volta de set/2025). Não usar
essas tabelas como base para o Card 1/2 — construir schema novo, como já estava planejado abaixo.

## O que migra (entidades e domínios próprios do doc-ped)

Sem equivalente hoje em `estrutura-pedagogica` — precisam de entidade, service e controller
novos no destino:

| Domínio | Entidades | Card |
|---|---|---|
| Fundamentação Legal | `FundamentacaoLegal` (Card 1, schema já criado), `HistoricoFundamentacao` (Card 2, schema já criado) | 1, 2 |
| Histórico do Aluno | `Historico`, `HistoricoSerie` — **schema já criado** (`Scripts/documentacao-pedagogica-historico-aluno-schema.sql`) | 2 |
| Registro de Certificado | **confirmado**: colunas em `Historico` (`NumeroRegistroCertificado`/`FolhaRegistroCertificado`/`LivroRegistroCertificado`) — sem tabela própria, igual ao doc-ped original | 2 |
| Observações do Histórico | **confirmado**: colunas em `Historico` (`ObservacoesFundamental`/`ObservacoesMedio`/`ObservacoesCertificado`) — sem tabela própria | 2 |
| Resultado por disciplina (histórico de série) | `ResultadoFinal` + lookups próprios `TipoResultadoFinal`/`TipoComponenteCurricular` (sem native equivalente — ver nota no script) — **somente leitura por enquanto**, edição fica para depois (frontend também já cortou esse escopo) | 2 |
| Editar Informações (dados pessoais do aluno) | **fora de escopo por enquanto** — os campos já existem na tabela nativa `Pessoa` (confirmado via db_map), não devem virar tabela própria; precisa de investigação separada do caminho nativo de edição de Pessoa antes de implementar | 2 |
| Certificado de Conclusão | **implementado**: `ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica` (Card 1, config) + leitura agregada de `ResultadoFinal`/`Historico` (Card 3, sem tabela própria) | 1, 3 |
| Ficha Individual (config de rede) | Campos de config já cobertos por `ConfiguracaoRedeDocumentacaoPedagogica` (Card 1). Geração do documento em si **não migrada** — `features/ficha-individual` já existente é reaproveitada, sem tocar no backend dela | 1, 3 |
| Ata de Resultados Finais (config de rede) | **implementado**: `TurmaObservacaoAtaResultadosFinais` (Card 3, observação editável) + campos de config em `ConfiguracaoRedeDocumentacaoPedagogica` (Card 1) — sem `TurmaObservacoesAtaResultadosFinais`/`RedeAtaResultadosFinais` como entidades separadas, foram consolidadas | 1, 3 |
| Livro de Matrícula (config de rede) | **implementado**: campos de config em `ConfiguracaoRedeDocumentacaoPedagogica` (Card 1), sem tabela própria — leitura agregada (Card 3) | 1, 3 |
| Resultado Final | **implementado**: `ResultadoFinal`, `TipoResultadoFinal`, `TipoComponenteCurricular` (Card 2) — sem `TipoResultadoFinalRede` (mapeamento tipo×rede foi cortado do escopo, tipo é global) | 2, 3 |
| Diário de Classe (config) | `DiarioClasseConfiguracao` | 4 — **bloqueado**, ver `readme.md` |
| Importação | `ImportacaoHistoricoSerie(Linha)`, `ImportacaoResultadoFinal(Linha)` | *(fora dos 4 cards — avaliar se vira tela ou script administrativo)* |
| Brasão | `Brasao` | 1 (usado nos documentos/certificados) |

> Os nomes marcados "confirmar" precisam de leitura direta dos Controllers/DTOs correspondentes
> em `DocumentacaoPedagogica.Api/Controllers/` no momento de implementar o card — este documento
> é um mapa de orientação, não substitui olhar o código-fonte da tela específica.

## Schema próprio: `DocumentacaoPedagogica` (não `dbo`)

Todas as 12 tabelas dos 3 cards vivem no schema SQL Server **`DocumentacaoPedagogica`**, não em
`dbo` — separa claramente o que é novo desta migração do restante do banco principal. Os 3
scripts criam o schema de forma idempotente (`IF NOT EXISTS ... CREATE SCHEMA`), então podem
rodar em qualquer ordem. Tabelas nativas referenciadas (Rede, Escola, Usuario, Pessoa, Serie,
AnoLetivo, Turma, AreaConhecimento) continuam em `dbo`, sempre qualificadas explicitamente
(`dbo.Rede`, etc.) nos scripts.

No lado do C#, cada `Map` (`Infra/Mapping/Stateful/*.cs`) declara o schema explicitamente via
`builder.ToTable("NomeDaTabela", schema: "DocumentacaoPedagogica")` — mesmo padrão já usado por
outras tabelas de schema não-`dbo` no projeto (`TOTVS`, `Aula`, `Folha`, `AnamneseVirtual`, etc.
— ver `ComentarioComportamentoMap.cs` como referência). Sem essa linha, o EF tentaria mapear para
`dbo.NomeDaTabela` e a query falharia contra o schema real.

## Card 1 (Configurações) — schema criado

Script: `estrutura-pedagogica/backend/Scripts/documentacao-pedagogica-configuracoes-schema.sql`
(ainda **não executado** — só o arquivo, para revisão/execução manual). Tabelas (todas em
`DocumentacaoPedagogica.*`):

- `ConfiguracaoRedeDocumentacaoPedagogica` (1:1 por Rede — geral/histórico/ficha/ata/livro)
- `ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica` (1:1 com a config de rede)
- `ConfiguracaoRedeSerieNomenclatura` (1:N — nomenclatura de série por rede)
- `ConfiguracaoEscolaDocumentacaoPedagogica` (1:1 por Escola)
- `FundamentacaoLegal` (1:N por Rede)

Todas seguem a convenção `StatefulEntity` do `estrutura-pedagogica` (Id/Hash/Ativo/DataInclusao/
DataUltimaAlteracao/DataInativacao/Usuario\*) — não o padrão `Hash`+`HashOrigem` do doc-ped, que
não se aplica aqui (essas tabelas não espelham dado de outro lugar, são novas).

## Decisão de arquitetura (2026-10-23) — normalizar configuração por tipo de documento

**Regras definidas pelo usuário, a valer a partir de agora para o Card 1** (o schema abaixo já
rodou em homolog com o desenho antigo — ver "Migração do schema já rodado" mais abaixo):

1. Sem alterações nas entidades nativas `Rede` e `Escola` — continua valendo o que já era regra
   (ver "O que não migra"), só reafirmando no contexto desta mudança.
2. Uma tabela `TipoDocumento` (lookup) indicando os tipos de documento existentes.
3. Uma tabela cruzando Rede (ou Escola) × Documento com as configurações pertinentes de cada
   combinação — em vez de colunas fixas por documento numa tabela larga.

Isso **antecipa a Fase 4** do modelo genérico Documento/Bloco desenhado em
`document-builder/estrutura_documentos.md` (que já previa `DocumentoTipo` + uma tabela de junção
tipo `RedeDocumento`/`EscolaDocumento`, seção 4) — só que lá estava marcado como evolução futura,
independente, só depois das Fases 1–3 provarem o modelo. Decisão tomada em 2026-10-23: puxar só a
parte Rede/Escola × Documento pra agora, aplicada ao Card 1, sem esperar o resto do modelo genérico
(catálogo de blocos, editor, `ConfiguracaoBloco`) — ver nota de escopo atualizada em
`estrutura_documentos.md` seção 9.

### Schema atual (rodado) vs. schema novo (a implementar)

| Tabela atual | O que muda |
|---|---|
| `ConfiguracaoRedeDocumentacaoPedagogica` (1 linha por Rede, ~30 colunas somando Geral + Histórico + Ficha + Ata + Livro) | Encolhe para só as 4 colunas de **Geral** (`ExibirTituloCentralizadoNoDocumento`, `NotasComUmaCasaDecimal`, `StatusAprovadoPeloConselho`, `ExibirAlunosApenasNaTurmaMaisRecente`) + `RedeId` — "Geral" não é config de um documento específico, não entra no cruzamento. As colunas de Histórico/Ficha/Ata/Livro saem daqui. |
| `ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica` (1:1 com a config de rede) | Absorvida — Certificado de Conclusão passa a ser só mais um `TipoDocumento`, sua config vira uma linha em `RedeDocumentoConfiguracao` como qualquer outro documento, tabela própria é removida. |
| `ConfiguracaoRedeSerieNomenclatura` (1:N série por rede) | Não muda — nomenclatura de série não é config "por documento", é por rede/série. |
| `ConfiguracaoEscolaDocumentacaoPedagogica` (1:1 por Escola — Cabeçalho/Assinatura) | Absorvida — mesma lógica do Certificado: cada documento passa a ter sua própria linha em `EscolaDocumentoConfiguracao`, tabela própria é removida. Ver "Decisão confirmada" abaixo. |
| `FundamentacaoLegal` (1:N por rede) | Não muda. |

### Schema novo proposto

```
TipoDocumento                    — lookup, catálogo fixo dos documentos desta migração
   Id, Hash, Chave (ex: "historico", "ficha-individual", "ata-resultados-finais",
   "certificado-conclusao", "livro-matricula"), Nome, Ativo

RedeDocumentoConfiguracao        — 1 linha por (Rede, TipoDocumento)
   Id, Hash, RedeId, TipoDocumentoId, ValoresJson, + colunas de auditoria StatefulEntity
   UNIQUE(RedeId, TipoDocumentoId)

EscolaDocumentoConfiguracao      — 1 linha por (Escola, TipoDocumento)
   Id, Hash, EscolaId, TipoDocumentoId, ValoresJson, + colunas de auditoria StatefulEntity
   UNIQUE(EscolaId, TipoDocumentoId)
```

`ValoresJson` (não colunas tipadas por campo) pela mesma razão já decidida em
`estrutura_documentos.md` (seção 5, item 4) para `ConfiguracaoBloco`: cada documento tem um shape de
config totalmente diferente (Histórico tem ~15 flags, Livro tem 5, Certificado tem texto livre de
lei/termo) — colunas tipadas numa tabela cruzada geraria a mesma tabela larga com dezenas de colunas
majoritariamente nulas que este refactor está tentando eliminar, só que uma linha por documento em
vez de uma coluna por documento. A aplicação valida o shape esperado por `TipoDocumento` antes de
salvar; o banco não valida estrutura interna do JSON (mesmo trade-off já aceito lá).

### Decisão confirmada (2026-10-23): `ConfiguracaoEscolaDocumentacaoPedagogica` também vira Escola × Documento

Confirmado pelo usuário: `EscolaDocumentoConfiguracao` é criada, espelhando `RedeDocumentoConfiguracao`
(mesma estrutura, `ValoresJson`, `UNIQUE(EscolaId, TipoDocumentoId)`). A tabela
`ConfiguracaoEscolaDocumentacaoPedagogica` atual (Cabeçalho/Assinatura, hoje compartilhada entre
todos os documentos) é removida — cada documento passa a ter sua própria linha, mesmo que a
migração inicial (ver abaixo) replique o mesmo valor em todas por não existir hoje diferenciação.

**Decidido (2026-10-23)**: `NomeExibicao` entra no `ValoresJson` por documento, por hora — mesmo
tratamento dos demais campos da tabela atual (replicado por `TipoDocumento` na migração inicial, sem
diferenciação de uso). Não vira coluna própria de `EscolaDocumentoConfiguracao` neste momento;
revisitar só se aparecer necessidade real de ele divergir por documento.

### Migração do dado já rodado (não é re-seed do zero)

Card 1 já tem esse schema **rodado em homolog com seed de produção migrado**
(`ConfiguracaoRedeDocumentacaoPedagogica` + `ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica`
+ `ConfiguracaoEscolaDocumentacaoPedagogica` populadas via `gen_seed.py`). O refactor precisa de um
script de **migração de dado** (ler as colunas atuais — de rede e de escola — e gerar as linhas
correspondentes de `RedeDocumentoConfiguracao`/`EscolaDocumentoConfiguracao` com `ValoresJson`
montado a partir delas, replicando o mesmo valor de escola para cada `TipoDocumento` aplicável), não
um novo seed a partir dos CSVs originais — o dado de produção já migrado é a fonte, não o doc-ped
original de novo.

### Implementação (2026-10-23) — concluída

Backend e frontend reescritos contra o desenho acima, no branch `projetos/MigracaoDocPed`:

- **Schema**: 3 scripts novos em `estrutura-pedagogica/backend/Scripts/` —
  `documentacao-pedagogica-configuracoes-tipo-documento-schema.sql` (cria `TipoDocumento`,
  `RedeDocumentoConfiguracao`, `EscolaDocumentoConfiguracao`, seed do catálogo de 5 tipos),
  `...-migrar-dados.sql` (lê as colunas/tabelas atuais e popula as novas, idempotente) e
  `...-limpeza.sql` (dropa as colunas/tabelas antigas — **só rodar depois** de confirmar a migração
  de dado e o deploy do backend novo). **Nenhum dos 3 foi executado ainda** — só os arquivos, para
  revisão/execução manual (mesma convenção dos scripts anteriores do Card 1).
- **Backend**: entidades `TipoDocumentoDocPed`/`RedeDocumentoConfiguracao`/`EscolaDocumentoConfiguracao`
  (renomeado para `TipoDocumentoDocPed` — colisão de nome com um `TipoDocumento` pré-existente de
  Painel do Aluno, achado durante a implementação); `ConfiguracaoRedeDocumentacaoPedagogica` trimada
  pra só Geral; `ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica`/
  `ConfiguracaoEscolaDocumentacaoPedagogica` removidas. Os 5 services de salvar por documento da
  Rede viraram 1 (`SalvarConfiguracaoRedeDocumentoService`, recebe `TipoDocumento` + `Valores` JSON);
  `GetConfiguracaoRedeDocPedService`/`GetConfiguracaoEscolaDocPedService`/
  `SalvarConfiguracaoEscolaDocPedService` e os 3 `TurmaDocumento` services que liam Certificado/Ata/
  Livro (`GetAtaResultadosFinaisService`, `GetCertificadoConclusaoService`, `GetLivroMatriculaService`)
  foram adaptados pra ler as tabelas normalizadas. Controller: os 5 `POST rede/{historico,ficha,ata,
  livro-matricula,certificado-conclusao}` viraram 1 `POST rede/documento`.
- **Frontend**: contrato também mudou (decisão do usuário) — `ConfiguracaoRedeResponse.documentos:
  ConfiguracaoRedeDocumentoResponse[]` substitui os ~30 campos soltos + `configuracaoCertificadoConclusao`;
  `ConfiguracaoRedeService` ganhou `salvarDocumento(hashRede, tipoDocumento, valores)` no lugar dos 5
  `update*`; `rede-documentos-tab.component.ts` lê/grava via essa lista genérica. Escola manteve o
  contrato (`ConfiguracaoEscolaDocPedGetResponse`/`SaveRequest` sem mudança de shape) — só a
  persistência por baixo mudou, sem necessidade de UI por documento (nenhum caso de uso hoje precisa).
- **Testes**: os 5 testes de save por documento da Rede viraram 1
  (`SalvarConfiguracaoRedeDocumentoServiceTests.cs`); os demais cenários afetados (Get de Rede/Escola,
  Save de Escola, os 3 Get de `TurmaDocumento`) foram reescritos contra o schema novo. Suíte completa
  do backend (5595 testes) passando, sem regressão. Build de backend e frontend sem erros.

**Status em homolog (2026-10-27)**: `...-tipo-documento-schema.sql` e `...-migrar-dados.sql` já
rodaram e foram validados por contagem (`TipoDocumento`=5, `RedeDocumentoConfiguracao`=165 = 41
redes×4 + 1 certificado, `EscolaDocumentoConfiguracao`=1375 = 275 escolas×5 — bate exato com as
tabelas de origem, que continuam intactas). `...-limpeza.sql` **ainda não rodou** — só depois do
deploy do backend novo (código local ainda não commitado/deployado nesta data).

### `AnoLetivoId` em `EscolaDocumentoConfiguracao` (2026-10-27)

Pré-requisito de schema pro novo design do editor de Configurações (ver
`novo_design/analise-tecnica.md`, item 1) — lá o escopo "Escola" é por Escola + Ano Letivo, não só
Escola. Novo script
`documentacao-pedagogica-escola-documento-configuracao-adicionar-ano-letivo.sql` (**não executado
ainda**): adiciona `AnoLetivoId INT NULL` (FK `dbo.AnoLetivo`) e troca a constraint única por 2
índices filtrados — um pra linha "default" (`AnoLetivoId IS NULL`, vale pra todos os anos, é o
comportamento de hoje) e um pra override por ano específico (`AnoLetivoId IS NOT NULL`).

Só o schema + entidade foram adicionados nesta rodada — `GetConfiguracaoEscolaDocPedService`,
`SalvarConfiguracaoEscolaDocPedService` e os 2 `TurmaDocumento` services que leem assinaturas da
escola (`GetAtaResultadosFinaisService`, `GetLivroMatriculaService`) foram ajustados só pra filtrar
explicitamente `AnoLetivoId == null` (preserva o comportamento atual, sem regressão). **Não
implementado ainda**: seletor de ano letivo na UI, lógica de override por ano no save, resolução
do ano letivo vigente da turma nos services de `TurmaDocumento` — isso fica para quando o editor do
Histórico Escolar (próximo passo do novo design) for implementado de fato.

**Pendente**: rodar os 2 scripts ainda não executados (`...-adicionar-ano-letivo.sql` e
`...-limpeza.sql`, nessa ordem relativa não importa entre si, mas ambos depois do deploy do backend
atualizado) em homolog.

## Card 2 (Histórico do Aluno) — implementado

Schema: `estrutura-pedagogica/backend/Scripts/documentacao-pedagogica-historico-aluno-schema.sql`
(não executado). Tabelas: `Historico`, `HistoricoSerie`, `HistoricoFundamentacao`,
`ResultadoFinal`, `TipoResultadoFinal`, `TipoComponenteCurricular` (lookups próprios — sem
equivalente nativo). C# completo (entidades/mappings/repositórios/DTOs/services/controller)
seguindo o padrão do Card 1.

**Correção importante feita depois da implementação inicial**: `Historico` referenciava o aluno
por `UsuarioId`/`Usuario` (copiado literalmente do doc-ped). Corrigido para `PessoaId`/`Pessoa`
(nativa) — é essa a convenção usada em todo o resto do `estrutura-pedagogica` para "o aluno"
(`ComentarioComportamento`, `LancamentoComportamento`, toda a infra de roster de turma). `Usuario`
nativo é a conta de login/portal, que nem todo aluno tem.

"Editar Informações" (dados pessoais do aluno) ficou **fora de escopo** — os campos já existem em
`Pessoa` nativa; editar isso deve reaproveitar o caminho nativo existente, não uma tabela
paralela. Precisa de investigação própria antes de implementar.

## Card 3 (Turma & Geração de Documentos) — implementado

Schema: `estrutura-pedagogica/backend/Scripts/documentacao-pedagogica-turma-documentos-schema.sql`
(não executado) — só 1 tabela nova, `TurmaObservacaoAtaResultadosFinais` (observação editável por
turma/ano letivo da Ata de Resultados Finais). Livro de Matrícula, Ata e Certificado de Conclusão
são leitura agregada: roster de turma nativo (`IAlunoEscolaRepository`, `Pessoa`), config do
Card 1 (`ConfiguracaoRedeDocumentacaoPedagogica`/`...CertificadoConclusao...`) e histórico do
Card 2 (`Historico`/`HistoricoSerie`/`ResultadoFinal`, sempre via `PessoaId`/Hash da Pessoa).

Reaproveitado bastante infra nativa já existente: `IAlunoEscolaRepository.GetAlunosPorTurmaAtivos`,
`IEscolaRepository.GetCabecalhoDocumento`, e o padrão de resolução turma→roster→documento já usado
de verdade em `GetDocumentoDiarioDeClasseService` (Diário de Classe). Foi necessário adicionar
`ITurmaRepository.GetParaDocumento` (Segmento/Turno/AnoLetivo não vinham no método existente
`GetParaDiarioClasse`) e `IAlunoEscolaRepository.GetAlunosPorTurmaParaLivroMatricula`.

**Campos nativos não localizados** (deixados `null`, documentados no código, não inventados):
RG, Nacionalidade, Naturalidade, SexoEnum, Endereço em `Pessoa` (existem na tabela SQL mas não
estão mapeados na entidade EF `Pessoa` — mapear isso é uma decisão própria, não tomada aqui); RA
Digital e Código Inep do aluno (não localizados em nenhuma tabela nativa acessível); data de
conclusão do certificado (sem fonte nativa clara).

## Estratégia de implementação

1. Não recriar schema do zero: usar `_pde/db_map/` (regra do projeto — `db_map` antes de MCP)
   para confirmar quais tabelas equivalentes já existem no banco principal antes de desenhar uma
   entidade nova.
2. Toda entidade nova migrada carrega uma referência ao dado principal via `Hash`/`Id` nativo do
   `estrutura-pedagogica` (equivalente ao antigo `HashOrigem`) — não recriar um `Hash` próprio
   duplicado. Confirmado na prática: "o aluno" em qualquer entidade nova é sempre `PessoaId`
   (nativa `Pessoa`), nunca `UsuarioId` (ver correção no Card 2 abaixo).
3. Scripts de schema em SQL manual — na prática, ficaram em
   `estrutura-pedagogica/backend/Scripts/documentacao-pedagogica-*.sql` (convenção já usada nesse
   repositório para scripts de schema, ver outros arquivos na mesma pasta), não em
   `pde_salta/cards/<KEY>/sql/` (essa convenção é para cards Jira individuais no `pde_salta`, não
   se aplica a um projeto de migração como este). Nenhum dos 3 scripts foi executado ainda.
4. Seguir a ordem dos cards do frontend (`frontend.md`) — o backend de cada card só precisa
   existir quando o mock daquele card for substituído por integração real. **Concluído para os
   Cards 1, 2 e 3** — falta só plugar o frontend nos endpoints (ver `frontend.md`).
5. Todo o C# novo segue o padrão do domínio `DiasSemAula` já existente (Controller com
   `[RequiredAuthorization]` + `IUnitOfWork` para escrita, um `Domain.Service` por ação,
   `Repository<TEntity>` genérico, `StatefulEntity`, `ServiceResult<T>`, DI automática por
   convenção de nomes `IXService`/`XRepository` — sem registro manual em `Program.cs`/
   `Startup.cs`). Ver os controllers já implementados como referência direta para o próximo card
   que precisar de backend: `ConfiguracaoDocumentacaoPedagogicaController.cs`,
   `HistoricoAlunoController.cs`, `TurmaDocumentoController.cs`.

## Bug corrigido: services e repositórios não registrados no DI (afetava os 3 cards)

Duas variantes do mesmo problema, ambas descobertas rodando a aplicação de verdade (nenhuma dá
erro de compilação — só em runtime):

1. **Services**: nenhuma das 29 interfaces de
   `Domain.Services/DocumentacaoPedagogica/**/Interfaces/*.cs` (Cards 1, 2 e 3) estendia
   `IBaseService` — é exatamente essa herança que `AddImplementations`/`GetNoAbstractTypes` usa
   para decidir o que registrar automaticamente (ver `DiasSemAula`:
   `ISalvarDiasSemAulaService : IBaseService`). Corrigido em lote (`using
   EstruturaPedagogica.Domain.Services.Core;` + `: IBaseService` na declaração de cada uma).
2. **Repositórios**: mesma causa, uma camada abaixo. As 12 interfaces de repositório dos Cards 1/2/3
   (`Domain/Interfaces/Stateful/I*Repository.cs` — Configuração de Rede/Escola/Certificado/
   SérieNomenclatura, FundamentacaoLegal, Historico, HistoricoSerie, HistoricoFundamentacao,
   ResultadoFinal, TipoResultadoFinal, TipoComponenteCurricular, TurmaObservacaoAtaResultadosFinais)
   estendiam só `IRepository<T>` — que **não** estende `IBaseRepository` (confirmado lendo
   `IRepository<T>` e comparando com `IDiaSemAulaTipoRepository`, que lista `IBaseRepository`
   explicitamente ao lado de `IRepositoryInsert<T>` etc.). Sem isso, o container falha ao ativar
   qualquer service que dependa desses repositórios
   (`Unable to resolve service for type 'I...Repository'`). Corrigido em lote — todas passaram a
   estender `IRepository<T>, IBaseRepository` explicitamente.

**Regra para qualquer repositório/service novo deste projeto daqui pra frente**: a interface
**sempre** precisa estender `IBaseService` (services) ou incluir `IBaseRepository` explicitamente
na lista de herança (repositórios, já que `IRepository<T>` sozinho não é suficiente) — sem isso o
DI não registra nada e só quebra em runtime, nunca em build.

## Endpoints de listagem plugados (Cards 1/2/3) — sessão 2026-09-03

Além dos endpoints de leitura/escrita já documentados por card, foram implementados e plugados
os endpoints de **listagem** que faltavam pra cada aba funcionar de ponta a ponta (filtro + lista
→ hub). Padrão comum aos três: `filter-anosletivos` (GET), `filter-redes` (GET),
`filter-escolas`/`filter-series` (POST, cascata), e o endpoint principal de listagem (POST).

### Card 1 — `GET configuracaodocumentacaopedagogica/escolas/{hashRede}`

`IListarEscolasDocPedService` — lista as escolas de uma rede pra seção "Escolas da rede" do hub
de Configurações. Critério **replicado fielmente do doc-ped original**
(`EscolaSerieRepository.GetForConfiguracaoEscola`): parte de `EscolaSerie` ativa na rede (não de
`Escola` direto — só entram escolas com pelo menos uma série/turma cadastrada), e exclui
`EhLegado`. No lado nativo, `EhLegado` **é** a coluna `Escola.Arquivada` — só está renomeada no
mapeamento EF (`EscolaMap.cs`: `builder.Property(x => x.Arquivada).HasColumnName("EhLegado")`).
Filtro adicional só desta migração (não existia no doc-ped): `!EhCentralDaRede`.

Implementação usa `IEscolaSerieRepository.GetEscolaIdsAtivosPorRede(int redeId)` (projeção só de
`EscolaId`) + `IEscolaRepository.GetParaListagemDocPed(List<int> escolaIds)` (projeção com
`Estado.Sigla` pro campo UF). **Bug real encontrado e corrigido durante a implementação**: o
`Get(predicate)` genérico de `IEscolaSerieRepository` materializa a entidade `EscolaSerie`
inteira, e há linhas no banco com `AgrupamentoId` nulo apesar da coluna EF ser `int`
não-anulável — quebra o EF Core ao tentar ler. Corrigido projetando só o campo necessário direto
na query (mesmo padrão que todo o resto do repositório já usava, só esse método novo tinha
fugido do padrão).

### Card 3 — `TurmaDocumentoController` (aba Turmas — filtro + listagem)

Não existia NENHUM endpoint de listagem de turma antes desta sessão — só os de documento
(Ata/Livro/Certificado, que dependem de uma turma já selecionada). Adicionados:
`filter-anosletivos`, `filter-redes`, `filter-escolas`, `filter-series`, `POST listar`.

- `IListarTurmasDocPedService` → `ITurmaRepository.GetParaListagemDocPed(anoLetivoId, escolaId,
  serieId?)` — projeção direta (mesmo cuidado do bug acima, não materializa `Turma` inteira).
- `AtaResultadosFinaisDisponivel` = `!AnoLetivo.Vigente` (proxy de "ano letivo concluído",
  batendo com o tooltip que já existia no frontend — **interpretação própria, sem spec
  explícita**).
- `PossuiFichaIndividual` fica sempre `true` — a Ficha Individual reaproveita a feature já
  existente, sem critério de disponibilidade próprio ainda.
- Escopo desta leva: só a listagem. Documentos da turma continuam mockados no frontend por
  decisão do usuário (card à parte — EFC-6786).

### Card 2 — `HistoricoAlunoController` (aba Alunos — filtro + busca + hub)

Também não existia listagem/busca de aluno nem um "get aluno completo" antes desta sessão — só os
endpoints de sub-tela (fundamentação/observações/certificado/histórico-série, que já assumiam um
aluno escolhido). Adicionados: os 4 de filtro + `POST listar` + `GET aluno/{hashAluno}`.

- `IListarAlunosDocPedService` → `IAlunoEscolaRepository.GetParaListagemDocPed(anoLetivoId,
  escolaId, serieId?, busca)` — busca por nome (`Pessoa.Nome`/`NomeSocial`) ou matrícula
  (`AlunoEscola.Matricula`), partindo de `Turma.EscolaSerie` (o aluno não é filtrado direto por
  turma na tela, só por Rede/Escola/Série/AnoLetivo).
- `IGetAlunoDocPedService` → `IAlunoEscolaRepository.GetParaEdicaoDocPed(hashAluno)` (pega a
  matrícula mais recente do aluno, sem precisar de ano letivo pré-selecionado) + reaproveita
  `IHistoricoSerieRepository.GetPorAluno`/`IHistoricoFundamentacaoRepository.GetPorAluno` (já
  existiam) pra popular séries e fundamentações do hub.
- `Uf` resolvido via novo `IEscolaRepository.GetSiglaEstadoByHashEscola` (mesmo fix de UF que
  Card 1) — usado tanto na listagem quanto no `GetConfiguracaoEscolaDocPedService` do Card 1.
- Campos sem fonte nativa (RG, foto, RA Digital, Código Inep, Nacionalidade, Naturalidade, UF do
  aluno, Endereço, SexoEnum, conclusão de segmento) ficam `null`/`false` — mesma lacuna já
  documentada no Card 3, não é bug novo.

## Bug real encontrado: contrato de request desalinhado entre frontend e backend (Card 2)

Ao plugar o frontend do Card 2 nos endpoints de salvar (`observacoes`, `registro-certificado`,
`fundamentacao`, todos já implementados de sessões anteriores), descobri que os modelos TS
**nunca bateram** com os DTOs C# reais:

- Os 3 `Save*Request` do backend (`HistoricoObservacoesSaveRequest`,
  `RegistroCertificadoSaveRequest`, `HistoricoFundamentacaoSaveRequest`) sempre esperaram
  `HashAluno` (hash da `Pessoa`) — os 3 `Save*Request` do frontend mandavam `hash`/`hashHistorico`
  (nenhum dos dois é o que o backend lê).
- `HistoricoFundamentacaoGetResponse` (`Hash`, `HashFundamentacaoLegal`, `Descricao`) — `Hash` é o
  hash da própria linha de vínculo (`HistoricoFundamentacao`), `HashFundamentacaoLegal` é a
  fundamentação referenciada. O frontend tinha os dois **invertidos**
  (`HistoricoFundamentacoesResponse.hash` era usado como se fosse a fundamentação).

Corrigido nos 3 modelos TS + nos 3 componentes de edição
(`historico-observacoes`/`editar-registro-certificado`/`editar-fundamentacao`). Não dava pra saber
sem testar em runtime — o TypeScript não pega esse tipo de mismatch (os campos existiam, só
apontavam pro conceito errado).

## Migração de dados — Card 1 (seed rodado) e Card 2 (em andamento)

**Card 1**: seed gerado a partir de CSVs exportados do doc-ped (`rede`, `escola`,
`rede_certificado_conclusao`, `fundamentacao_legal`, `serie_nomenclatura_por_rede`, `serie`,
`brasao`, `tipo_certificado_conclusao`) — script
`documentacao-pedagogica-configuracoes-seed-dados.sql`, **rodado com sucesso**. Gerador:
`projetos/migracao_doc_ped/scripts/gen_seed.py` (pde_salta).

**Card 2**: em andamento, escala completamente diferente (341K alunos, 1,19M séries cursadas,
15,1M notas — a parte de notas foi adiada por decisão do usuário). Detalhe completo — CSVs
necessários, estratégia (staging tables em vez de `INSERT...VALUES`, por causa do volume),
scripts gerados e o que falta rodar — está em `readme.md`, seção "Migração de dado histórico
(Card 2)". Gerador: `projetos/migracao_doc_ped/scripts/gen_historico_seed.py`.

Achado técnico relevante dessa migração: `Historico.PessoaId` (destino) é resolvido a partir de
`Usuario.HashOrigem` (doc-ped) → `dbo.Usuario.Hash` (nativo) → `dbo.Usuario.PessoaId` — só que a
tabela nativa `dbo.Usuario` tem 2,64 milhões de linhas, grande demais pra resolver via MCP em
lotes de hash (limite de ~90 hashes por query). Solução: pedir pro usuário exportar
`SELECT Id, Hash, Pessoa FROM dbo.Usuario` direto via DBeaver, e fazer o cruzamento inteiramente
em Python/local (streaming, sem carregar as 2,64M linhas de uma vez — filtra por hash já
enquanto lê o CSV).

## Pendências do backend

- ~~Nenhum script SQL foi executado~~ **resolvido** — os 3 scripts de schema (Cards 1/2/3) já
  rodaram contra o banco.
- ~~`FuncionalidadeEnum` com Ids provisórios~~ **resolvido** — o usuário passou 3 `Funcionalidade`
  reais já cadastradas no banco (produto 171, "Documentação Pedagógica"), reaproveitadas em vez de
  criar novas: `DocumentacaoPedagogicaConfiguracoes = 4` ("Configuração de Documento", Card 1),
  `DocumentacaoPedagogicaHistoricoAluno = 438` ("Acesso", Card 2),
  `DocumentacaoPedagogicaTurmaDocumentos = 412` ("Emitir Histórico", Card 3).
- **Migração de dado do Card 2 em andamento** — ver seção acima e `readme.md`.
- **Documentos da Turma/Aluno (Ata, Livro de Matrícula, Certificado, Ficha Individual) sem
  endpoint de listagem plugado no frontend ainda** — os endpoints já existem
  (`TurmaDocumentoController`), só o service Angular continua mockado; card à parte por decisão
  do usuário (EFC-6786/EFC-6787).
- **"Editar Informações" do aluno (Card 2) não implementado** — decisão deliberada, precisa
  investigar o caminho nativo de edição de `Pessoa` já existente no `estrutura-pedagogica` antes
  de fazer qualquer coisa aqui.
- **Edição de Histórico de Série (Card 2) não implementada** — card próprio (EFC-6785); hoje só
  existe leitura (via `GetAlunoDocPedService`, reaproveitando `IHistoricoSerieRepository`).
- **Campos não localizados nativamente** (Card 3): RG, Nacionalidade, Naturalidade, SexoEnum e
  Endereço existem na tabela SQL `Pessoa` mas não estão mapeados na entidade EF `Pessoa` atual;
  RA Digital, Código Inep do aluno e data de conclusão do certificado não têm fonte nativa clara
  identificada. Ficaram `null` nos responses, documentado no código — não foram inventados.
- **Mapeamento Tipo de Resultado × Rede** (`TipoResultadoFinalRede` no doc-ped original) não foi
  implementado — `TipoResultadoFinal` ficou global, não filtrado por rede.
