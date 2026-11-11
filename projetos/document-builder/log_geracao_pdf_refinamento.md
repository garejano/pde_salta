# Refinamento: Log de Geração de Documento (document-builder)

## Contexto

O `document-builder` (lib em `frontend/src/shared/document-builder/`, repositório `estrutura-pedagogica`) monta documentos em tela e permite ao usuário **Imprimir** ou **Salvar PDF** através do `print-overlay.component`, que delega para `PrintService.print()`/`PrintService.save()`. Hoje nenhuma dessas ações fica registrada — não é possível auditar quem gerou qual documento, quando, em qual escola/rede, nem se foi impressão direta ou PDF.

## Problema

Não existe rastreabilidade da geração de documentos pedagógicos. Em caso de dúvida ou incidente (documento com dado incorreto, uso indevido, contestação de escola), não há como responder "quem gerou isso e quando".

## Objetivo

Registrar no banco, a cada geração de documento (impressão ou PDF), um log de auditoria com: usuário, nome/tipo do documento, data/hora, rede, escola e o meio de geração (impressão direta ou PDF). Expor isso via um novo fluxo backend (Controller/Service/Repository) em `estrutura-pedagogica`, seguindo os padrões já estabelecidos no repositório (ver `backend/README.md`).

## Escopo

### Backend — `estrutura-pedagogica` (C#)

- Nova tabela `LogGeracaoDocumento` (schema manual via script SQL, sem EF Migrations — convenção do repo).
- Entidade `LogGeracaoDocumento : StatefulEntity` — reaproveita `DataInclusao`/`UsuarioInclusao` (preenchidos automaticamente pelo `Repository<T>` a partir do usuário autenticado) como "quem gerou" e "quando".
- Campos próprios do domínio: nome do documento, tipo de geração (`Impressao` | `Pdf`), **se a geração teve sucesso (`Sucesso`)**, escola, rede, ano letivo, aluno (Pessoa), e um campo `Metadados` (JSON livre) para contexto adicional futuro. **Sem vínculo com Turma** — decisão explícita do usuário (escola + rede já são suficientes). **Todas as FKs são opcionais** (`Escola`/`Rede` passaram a permitir `NULL` na mesma rodada em que `AnoLetivo`/`Pessoa` foram adicionadas) — o log se adapta ao que cada tipo de documento tem disponível no momento da geração.
- `ILogGeracaoDocumentoRepository` / `LogGeracaoDocumentoRepository` — apenas inserção (não é uma entidade editável/desativável pelo usuário).
- `ILogGeracaoDocumentoService` / `LogGeracaoDocumentoService` — resolve os hashes opcionais recebidos do frontend (`hashEscola`/`hashRede`/`hashAnoLetivo`/`hashPessoa`) para os IDs internos antes de persistir; hash ausente vira `null`, hash presente mas inexistente vira erro.
- `LogGeracaoDocumentoController` — `POST /api/LogGeracaoDocumento` (frontend chama `/loggeracaodocumento`, sem hífen — roteamento ASP.NET Core não faz kebab-case automático), `[RequiredAuthorization]` sem funcionalidade específica (uso transversal a várias features, mesma linha adotada para o `PdfController` hipotético em `pdf_no_backend_plano.md`).
- Testes de integração (`LogGeracaoDocumentoServiceTests`) cobrindo os 8 cenários do `Registrar` — criados seguindo o comando `criar-testes` do repo, ainda não confirmados via `dotnet test` (IIS local/Visual Studio bloqueando os DLLs no momento).

### Frontend — `estrutura-pedagogica` (Angular)

**Decisão de arquitetura (corrigida durante a implementação):** o log é responsabilidade do próprio `document-builder`, não de cada componente de feature que o consome. Um componente de feature não deveria precisar lembrar de chamar um endpoint de log manualmente toda vez que usa o document-builder — isso é fácil de esquecer e duplica lógica em cada tela.

- `DocumentConfig` ganhou dois campos: `logEnabled?: boolean` e `auditContext?: { hashEscola?: string; hashRede?: string }` — ambos os campos internos de `auditContext` são opcionais, então dá pra logar sem escola/rede (útil para telas de exemplo/protótipo).
- `DocumentViewerComponent.print()`/`.save()` chamam um método privado `registrarLogGeracao(cfg, tipoGeracao, sucesso)` — só executa se `cfg.logEnabled` estiver presente (`auditContext` é opcional). Quando a geração é via backend (`useBackend`, chamada real de PDF que pode falhar), o log acontece **nos dois casos**: sucesso (`sucesso: true`, dentro do `try`) e falha (`sucesso: false`, no `catch`, antes de relançar o erro). Quando a geração é no frontend (html2canvas, sem chamada de rede), continua só logando no sucesso, como antes.
- Novo `LogGeracaoDocumentoApiService` (em `shared/document-builder/services/`) faz o `POST /loggeracaodocumento` via `ApiClient`, fire-and-forget (`subscribe` sem `await`, erro só logado no console — nunca bloqueia a entrega do documento).
- Cada feature que quiser auditoria só precisa setar `logEnabled: true` (e opcionalmente `auditContext: { hashEscola, hashRede }`) na config do documento que já monta hoje — sem outra mudança nos componentes de feature. Ativado em: `listar.component.ts` e `lista-presenca.component.ts` (com `auditContext`), e `exemplos/carometro-exemplo.component.ts` (sem `auditContext`, tela de teste/exemplo sem escola/rede reais). `ficha-individual.component.ts` continua sem alteração.

## Critérios de Aceite

- [x] Toda geração de documento (impressão ou PDF) via document-builder com `logEnabled: true` + `auditContext` grava uma linha em `LogGeracaoDocumento`.
- [x] O log registra: usuário (via `UsuarioInclusao`, preenchido automaticamente), nome do documento, data/hora (`DataInclusao`), escola, rede, tipo de geração (impressão/PDF) e se a geração teve sucesso.
- [x] Geração via backend (Playwright) registra o log tanto no sucesso quanto na falha da chamada de PDF, com `Sucesso` refletindo o resultado real.
- [x] Falha ao gravar o log não impede a impressão/geração do PDF (chamada fire-and-forget, sem bloquear o fluxo principal).
- [x] Endpoint acessível por qualquer usuário autenticado, sem exigir uma `Funcionalidade` específica cadastrada.
- [x] `diario-de-classe/listar.component.ts` e `lancamento-frequencia/lista-presenca.component.ts` ligam `logEnabled: true` + `auditContext` nas configs reais que montam.
- [x] `exemplos/carometro-exemplo.component.ts` liga `logEnabled: true` sem `auditContext` (tela de teste sem escola/rede reais) — confirma que o log funciona mesmo sem contexto institucional.

## Fora do Escopo

- `ficha-individual.component.ts` continua de fora — ainda usa dados mockados (`MOCK_REQUEST`), então não faz sentido logar hashes falsos.
- Tela de consulta/relatório dos logs (fica para um card futuro, quando houver demanda concreta de uso desses dados).
- Retentativa automática caso a chamada de log falhe no frontend.
- Auditoria de outras ações do document-builder além de "gerar" (ex.: abrir/visualizar sem imprimir).

## Dependências Técnicas

- Script SQL de criação de `LogGeracaoDocumento` (`criar-tabela-log-geracao-documento.sql`, consolidado com todas as colunas), aplicado manualmente, sem EF Migration. Os dois scripts incrementais (`alterar-tabela-log-geracao-documento-anoletivo-aluno.sql`, `alterar-tabela-log-geracao-documento-sucesso.sql`) permanecem no repo como registro do que foi de fato executado contra o ambiente já existente.
- Resolução de `hashEscola`/`hashRede`/`hashAnoLetivo`/`hashPessoa` → `Id` já existe via `IRepositoryGetByHash<T>` (`IEscolaRepository`, `IRedeRepository`, `IAnoLetivoRepository`, `IPessoaRepository`) — reaproveitado, não recriado.

## Notas de Implementação

- Ver plano técnico detalhado em `document-builder/log_geracao_pdf_plano.md`.
- Este documento ainda não está associado a um card Jira — ao abrir o card, mover o script SQL para `cards/<EFC-xxx>/sql/` conforme convenção do `salta_brain`.
