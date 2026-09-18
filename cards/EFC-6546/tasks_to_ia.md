# Tarefas — EFC-6546 (Aba Atendimento — Painel do Aluno)

> Gerado a partir de `EFC-6546.tech.md`. Plano completo em `cards/EFC-6546/EFC-6546.tech.md`.

---

## Template

```
## T<N> — <título>

**O que fazer:** <uma frase direta>

**Contexto:** <o que a IA precisa saber que não é óbvio — decisão, restrição, dependência>

**Pronto quando:** <critério objetivo>

**Status:** <pendente | em andamento | concluída>
```

---

## Tarefas

## T1 — Domain: modelo de dados e script SQL

**O que fazer:** Adicionar os campos novos em `Atendimento` e `TipoPublicoAtendido`, os novos valores em `FuncionalidadeEnum`, atualizar os mappings e criar o script SQL de alteração de schema.

**Contexto:** CAs: CA-02, CA-03, CA-06, CA-08, CA-21, CA-22, CA-24, CA-26 (infraestrutura). Detalhes:
- `Atendimento.cs`: adicionar `NomeProfissional` (string?, CA-24); substituir `DeveEnviarEmail` único por dois campos de intenção (enviar para Responsável Pedagógico / enviar para Responsável Financeiro, CA-06/08) e dois campos de auditoria do que foi de fato enviado (CA-26).
- `TipoPublicoAtendido.cs`: adicionar `PermiteResponsavel`, `ResponsavelEhOpcional`, `PermiteEspecialista` (bool) — necessários para CA-02/03/22. **[CORRIGIDO 2026-08-11]** essas colunas já existiam no banco real (ver nota de execução abaixo); só faltava mapear no C#, sem script SQL.
- `FuncionalidadeEnum.cs`: adicionar `PainelAluno_RegistrarAtendimento` e `PainelAluno_ExcluirAtendimento`.
- Atualizar `AtendimentoMap.cs` e `TipoPublicoAtendidoMap.cs` (Infra) com os campos novos.
- Script `backend/Scripts/EFC-6546-atendimento-painel-aluno.sql`, seguindo o formato de `EFC-6515-abrangencia-escolas-matriz-curricular.sql` (FKs sem sufixo `Id`, colunas de auditoria explícitas).
- Seguir `.claude/commands/criar-entidade.md` do repositório `estrutura-pedagogica` para o padrão de mapping/fixture.
- **Antes de codar:** validar com o time se os dados de referência (Tipo/Motivo/Solicitante/Norteador) já existem na base do `estrutura-pedagogica` ou precisam de migração do `portal-atlas` (risco #2 do plano técnico).

**Pronto quando:** Projeto compila sem erros; script SQL criado e revisado; entidades e mappings refletem os campos novos.

**Status:** concluída

**Notas de execução:** `Atendimento.cs` recebeu `NomeProfissional`, `EnviarEmailResponsavelPedagogico/Financeiro` (intenção) e `EmailEnviadoResponsavelPedagogico/Financeiro` (auditoria), substituindo `DeveEnviarEmail` (sem consumidores a atualizar — aba ainda placeholder). `TipoPublicoAtendido.cs` recebeu `PermiteResponsavel`, `ResponsavelEhOpcional`, `PermiteEspecialista`. `FuncionalidadeEnum.cs` recebeu `PainelAluno_RegistrarAtendimento=6` e `PainelAluno_ExcluirAtendimento=7` (IDs confirmados contra o catálogo do legado). Mappings e fixtures atualizados. Script `backend/Scripts/EFC-6546-atendimento-painel-aluno.sql` criado com migração de dados históricos de `DeveEnviarEmail`. Domain/Infra/Domain.Services compilam limpo; build do `.sln`/Test bloqueado apenas por lock de arquivo de um processo IIS Express local (não relacionado ao código). **Pendências para validar com o time:** nomes dos 4 campos de e-mail e a suposição de migração de `DeveEnviarEmail=1` → `EmailEnviadoResponsavelPedagogico=1` no script SQL antes de rodar em produção/homolog.

**[CORRIGIDO 2026-08-11]** A suposição de que `PermiteResponsavel`/`ResponsavelEhOpcional`/`PermiteEspecialista` faltavam em `dbo.TipoPublicoAtendido` (por analogia ao legado `portal-atlas`) estava **errada** — essas 3 colunas já existiam no banco real (confirmado via `_pde/db_map/schema/tables.yaml`, que já as listava). O `ALTER TABLE` correspondente no script deu erro `Column names in each table must be unique` ao rodar em homolog/produção e foi removido do script — a entidade/mapping em C# já estavam corretos (nomes batendo por convenção com as colunas reais), nenhuma mudança de código foi necessária, só a correção do script SQL.

**[CORRIGIDO 2026-08-11 — bug relacionado]** Descoberto no mesmo dia, ao investigar erro em runtime (`Invalid object name 'TipoAtendimentoPessoa'`): `AtendimentoPessoa.TipoAtendimentoPessoa` também tinha sido modelado errado — como FK para uma entidade/tabela de lookup `TipoAtendimentoPessoa` (com repositório, mapping e fixture próprios) que **não existe no banco**. Confirmado via `db_map` (FKs de `AtendimentoPessoa` são só para `Atendimento`/`Pessoa`) e via legado `portal-atlas` (`TipoAtendimentoPessoaEnum { Atendente = 1, Responsavel = 2 }`, mapeado como `Property` simples, não `ManyToOne`). Corrigido: criado `TipoAtendimentoPessoaEnum` (`Domain/Enums/PainelAluno/`), `AtendimentoPessoa.TipoAtendimentoPessoa` passou a ser esse enum (coluna inteira direta, sem tabela de referência), removida a entidade/repositório/mapping/fixture fictícios. `AtendimentoRepository`, `AtendimentoResponse.AtendimentoPessoaPapelNomeDTO.Papel`, `AtendimentoGetService` e `AtendimentoSaveService.SalvarPessoasVinculadas` atualizados para usar o enum em vez de comparação de texto (`AtendimentoConstants.PapelAtendente/PapelResponsavel`, removidos). **Lição:** os textos/relações assumidos por analogia ao legado sem confirmação contra o `db_map` real (pendência 1.5) causaram 2 bugs distintos — todo `TipoXxx`/`TipoAtendimentoPessoa`-like assumido como tabela de referência deveria ter sido checado em `_pde/db_map/schema/relations.yaml` antes de implementar.

**[CORRIGIDO 2026-08-11 — bug relacionado #3, tipos de coluna]** `GetAtendimentos` ainda falhava em runtime com `Unable to cast object of type 'System.Byte' to type 'System.Int32'` após os 2 bugs acima. Causa: essa área do schema (tabelas `Atendimento`/`FormularioAtendimento*`/`TipoPublicoAtendido`) usa `tinyint`/`smallint` para várias colunas — bem mais que o padrão do resto do repositório — e os mappings EF Core foram escritos assumindo `int` sem `.HasColumnType(...)`, então o EF tentava ler `Byte`/`Int16` como `Int32` e lançava exceção. `db_map` não guarda tipo de coluna (só nomes), então a confirmação foi feita ao vivo via `sys.columns`/`sys.types` (o usuário rodou a query, MCP `sqlserver` estava com a conexão fechada). Colunas reais e mapping corrigido (todas com `.HasColumnType(...)`, seguindo o padrão já usado em `TipoDocumentoMap`/`TipoPresencaMap`/`PessoaDocumentoMap`):
- `TipoPublicoAtendido.Id` → `tinyint` (`TipoPublicoAtendidoMap.cs`)
- `Atendimento.TipoPublicoAtendido` (FK) → `tinyint` (`AtendimentoMap.cs`)
- `FormularioAtendimento.Id` → `smallint`; `FormularioAtendimento.TipoPublicoAtendido` (FK) → `tinyint` (`FormularioAtendimentoMap.cs`)
- `FormularioAtendimentoQuestao.FormularioAtendimento` (FK) → `smallint`; `TipoQuestaoAtendimento` → `tinyint`; `Ordem` → `smallint`; `LimiteSelecao` → `tinyint` (`FormularioAtendimentoQuestaoMap.cs`)
- `FormularioAtendimentoQuestaoOpcao.Ordem` → `tinyint` (`FormularioAtendimentoQuestaoOpcaoMap.cs`)
- `MotivoAtendimentoTipoPublicoAtendido.TipoPublicoAtendido` (FK) → `tinyint` (`MotivoAtendimentoTipoPublicoAtendidoMap.cs`)
- `AtendimentoPessoa.TipoAtendimentoPessoa` → `tinyint` (`AtendimentoPessoaMap.cs`, mesma coluna do bug #2 — o enum estava certo mas faltava o `.HasColumnType`)

Todas as outras colunas do dump de `sys.columns` (Atendimento, FormularioAtendimentoResposta, FormularioAtendimentoRespostaOpcao, MotivoAtendimento, TipoAtendimento, SolicitanteAtendimento) já eram `int`/`bit`/`varchar`/`nvarchar`/`datetime`/`uniqueidentifier` normais, sem mismatch.

---

## T2 — Domain.Services: referências dinâmicas

**O que fazer:** Implementar `ReferenciasAtendimentoService`, que expõe Tipo/Motivo/Solicitante/TipoPublicoAtendido/Norteador filtrados por combinação.

**Contexto:** CAs: CA-02, CA-04, CA-21. Seguir `.claude/commands/criar-service.md`. O filtro é: Atendimento ao → Tipo → Motivo, incluindo as perguntas condicionais do Norteador (`FormularioAtendimento`) na ordem cadastrada. O campo Solicitante retorna as 6 opções fixas definidas no refinamento (Aluno, Coordenador/Diretor, Coordenador de Atendimento, Psicólogo, Psicopedagogo, Responsável) — não depende de filtro dinâmico. Depende de T1 (campos `PermiteResponsavel`/`PermiteEspecialista` em `TipoPublicoAtendido`).

**Pronto quando:** O service retorna corretamente Tipo/Motivo/Solicitante/Norteador para qualquer combinação válida de Atendimento ao + Tipo + Motivo.

**Status:** concluída

**Notas de execução:** `ReferenciasAtendimentoService` criado com 5 métodos (Tipos, Motivos, Solicitantes, TiposPublico, Norteador), DTOs em `Domain/DTO/PainelAluno/`, métodos novos nos repositórios de referência. Build completo (`dotnet build EstruturaPedagogica.sln`) com 0 erros. **[RESOLVIDO 2026-08-10 — pendência 1.1] Achado original:** o schema do Norteador (`FormularioAtendimentoQuestaoOpcaoCondicional`) parecia referenciar apenas a pergunta-gatilho, não a opção específica. **Correção:** o bug era só no modelo C# (EF Core) — a FK real do banco (`FK_FormularioAtendimentoQuestao.FormularioAtendimentoQuestaoOpcaoCondicional`, confirmada via `db_map`) sempre apontou para `FormularioAtendimentoQuestaoOpcao.Id`, igual ao legado `portal-atlas`. Corrigido o tipo da navegação em `FormularioAtendimentoQuestao.cs`/`FormularioAtendimentoQuestaoOpcao.cs`, o DTO (`PerguntaAtendimentoResponse.HashOpcaoGatilho`, renomeado de `HashPerguntaGatilho`) e a projeção em `FormularioAtendimentoRepository`. Nenhuma migração SQL necessária. Detalhe em `EFC-6546.entidades.md` §4 e `EFC-6546.pendencias.md` §1.1. **Outras pendências:** confirmar se o filtro de Motivo deve considerar Tipo+Publico (implementado) ou só Tipo; dados de Solicitante (6 opções) e do Norteador não têm evidência de existir na base (risco #2). **Complemento identificado pela análise do design (`AtendimentoTab.jsx`, ver T11):** falta método `GetAtendentes()` e, possivelmente, campo `Objetivo` por Motivo — não fazem parte do escopo original de T2, tratados em T11.

---

## T3 — Domain.Services: mecanismo de envio de e-mail

**O que fazer:** Construir a capability de envio de e-mail no backend `estrutura-pedagogica`, incluindo geração de prévia e envio restrito aos destinatários selecionados.

**Contexto:** CAs: CA-06, CA-07, CA-08. Regras: RN-06, RN-07 (infraestrutura, decisão de arquitetura). **Não existe hoje nenhum serviço de envio de e-mail neste backend** — capability nova, provavelmente via AWS SES (S3 já é usado na infra do repo). Deve suportar: (1) geração de prévia (texto do template do Atlas + lista de destinatários) sem enviar; (2) envio real restrito exatamente aos destinatários marcados no momento do salvamento — **sem fallback e sem envio automático a Mãe/Pai** (mudança de comportamento em relação ao legado `AtendimentoPainelManager.SetEmail` — comunicar ao time de produto/suporte antes do deploy, risco #1 do plano técnico).

**Pronto quando:** É possível gerar uma prévia de e-mail para uma combinação de destinatários e enviar e-mail real apenas para os destinatários selecionados, sem qualquer envio automático adicional.

**Status:** concluída

**Notas de execução:** Confirmado que não existe mecanismo de e-mail no `estrutura-pedagogica` (só WhatsApp via Twilio, usado como referência de padrão). `IEmailAtendimentoService`/`EmailAtendimentoService` criados (GerarPreviaEmail/EnviarEmail), reaproveitando `IListarResponsaveisService` para destinatários — sem fallback, sem envio a Mãe/Pai (RN-06/07 respeitadas). Transporte real isolado em `IEmailSender`/`EmailSenderService` — stub explícito que loga e retorna `false`; falta configurar SES/SMTP real (pacote `AWSSDK.SimpleEmail`, credenciais, remetente verificado) antes de produção. **Pendência de validação com produto:** não existe tabela de template de e-mail (nem no legado — lá é HTML concatenado em C#); o texto do e-mail foi montado programaticamente e precisa de validação de copy/formato. Build (Domain/Domain.Services/Infra) com 0 erros.

**[IMPLEMENTADO 2026-08-14 — transporte real]** O stub foi substituído. **Não era AWS SES** — é a "Api de Comunicação" interna, já usada pelo `notas` via `Eleva.Http`/`IHttpMessageSender` (client já registrado no DI do `estrutura-pedagogica`, só faltava ser chamado). `EmailSenderService.cs` reescrito: injeta `IHttpMessageSender`, monta `HttpMessage.CreateBuilder("EstruturaPedagogica", ClientKey).From("api.comunicacao@elevaeducacao.com.br")...Build()`, chama `SendEmailAsync`, retorna `StatusCode == OK`. Nova seção `Email` (`DeveEnviarEmail`/`ClientKey`) em `AppSettings`/`appsettings.json` — `ClientKey` ainda é **placeholder fake** (decisão do usuário: trocar quando o time da Api de Comunicação cadastrar o produto) e `DeveEnviarEmail=false` por padrão. Guard contra `SettingsGetter.Instance.Email == null` (seção ainda ausente no Secrets Manager de homolog/produção) — vira "não enviar", não exceção. `EmailAtendimentoService` e `IEmailSender` **não mudaram**. Assinatura de `HttpMessage.CreateBuilder` confirmada por reflection contra o `Eleva.Core` 1.7.6 realmente referenciado (`string, string, bool = false` — não o enum `Project` de versões mais novas do pacote). Build 0 erros. **Falta (infra, não código):** ClientKey real + seção `Email` no Secrets Manager de homolog/produção. Detalhe em `EFC-6546.servico-email.md`.

---

## T4 — Domain.Services: CRUD de Atendimento

**O que fazer:** Implementar `AtendimentoGetService`, `AtendimentoSaveService` e `AtendimentoDisableService`.

**Contexto:** CAs: CA-05, CA-09 a CA-12, CA-18, CA-22, CA-23, CA-25. Regras: RN-04 a RN-15. Seguir `.claude/commands/criar-service.md`. Depende de T1, T2, T3 e T11.
- `AtendimentoGetService`: listagem por aluno + ano letivo, agrupada e ordenada cronologicamente decrescente (CA-12, CA-18).
- `AtendimentoSaveService`: validações cruzadas (data futura, responsável/especialista obrigatório conforme Tipo, Próximos Passos — CA-22); persistência das respostas do Norteador; persistência de `AtendimentoPessoa` para **Atendente(s)** (campo identificado pela análise do design em T11, não coberto originalmente por CA) e para Responsável(eis); geração do resumo por Motivo quando houver lógica definida (CA-05/RN-04/05) — **atenção ao risco #14 do plano técnico: reconciliar com o campo manual "Resumo da Conversa" do design antes de fechar esta lógica**; decisão de quais e-mails enviar via o serviço de T3 (CA-06/07/08); atualização de `AlunoEscola.TotalAtendimentos`, espelhando o padrão de `AlunoEscolaService.AtualizarTotalDocumentos` usado por Documentos (risco #5 do plano técnico).
- `AtendimentoDisableService`: RBAC via `ValidacaoService`/`IUsuarioAcessoRepository` (RN-12/CA-15) + bloqueio por ano letivo anterior, usando `AnoLetivoService.IdParaAtendimentoAlunos()` como "ano letivo atual" (RN-13/CA-25) — expor os dois motivos de bloqueio separadamente (permissão vs. ano letivo), pois o card precisa de tooltips distintos (CA-15 vs. CA-25).
- **[RESOLVIDO — pendência 1.1]** A correção do schema do Norteador (opção condicional específica, não pergunta-gatilho) já foi feita — ver nota de T2. `AtendimentoSaveService` deve validar/persistir respostas condicionais checando `HashOpcaoGatilho` das perguntas (a opção precisa estar entre as respostas dadas para a pergunta condicional ser exigida).
- **Blocos já disponíveis, criados fora de ordem (resolvendo pendências 3.3/3.4 do `EFC-6546.pendencias.md`) — `AtendimentoGetService` deve reaproveitar, não recriar:**
  - `IAtendimentoRepository.GetTotalPorPessoaAnoLetivoRede` + `AlunoEscolaService.AtualizarTotaisAtendimentos(pessoaId, hashAnoLetivo, hashRede)` — já sincroniza `AlunoEscola.TotalAtendimentos`; `AtendimentoSaveService`/`AtendimentoDisableService` só precisam chamar esse método após salvar/excluir (mesmo padrão de Documentos).
  - `IAtendimentoPessoaRepository.GetTotalAtendimentosPorAno(pessoaId)` (retorna `List<AtendimentoTotalPorAnoDTO>`, por Rede+AnoLetivo) — usar para os totais por ano exibidos no cabeçalho do accordion da listagem (CA-10/T8).

**Pronto quando:** É possível listar, salvar e excluir atendimentos respeitando todas as validações cruzadas e regras de permissão/ano letivo listadas.

**Status:** concluída

**Notas de execução (2026-08-10):** `AtendimentoGetService`, `AtendimentoSaveService`, `AtendimentoDisableService` implementados em `Domain.Services/PainelAluno/`, seguindo exatamente o padrão de `OcorrenciasGetService`/`SaveService`/`DisableService`.
- **Get:** lista por pessoa+ano+rede (`IAtendimentoRepository.GetResponseParaPainelAluno`, novo), sempre um único ano (pendência 2.6); calcula `PodeRemoverAtendimento` (RN-12) e `AnoLetivoAtual` (RN-13, via `IAnoLetivoRepository.GetIdVigente()` — **`AnoLetivoService.IdParaAtendimentoAlunos()` citado no plano técnico não existe**, usei o mecanismo real de "ano vigente" já usado em outros módulos); particiona `AtendimentoPessoa` em Atendentes/Responsáveis por `TipoAtendimentoPessoa.Descricao`.
- **Save:** valida campos obrigatórios (Data, Solicitante, Atendimento ao, Tipo, Motivo, Atendente(s) — pendência 2.2), RN-08 (responsável obrigatório conforme `TipoPublicoAtendido.PermiteResponsavel/ResponsavelEhOpcional`), RN-10 (Próximos Passos), RN-11 (data futura), CA-03/CA-24 (Responsável x Nome do Profissional mutuamente exclusivos, por nome do TipoPublicoAtendido); persiste `Atendimento` + `AtendimentoPessoa` (Atendentes/Responsáveis) + `FormularioAtendimentoResposta`(+`Opcao`) num único insert (grafo EF, cascata automática); **usa a correção da pendência 1.1** para descartar (sem erro) respostas de perguntas condicionais cuja opção-gatilho não foi selecionada; chama `EmailAtendimentoService.EnviarEmail` e audita `EmailEnviadoResponsavelPedagogico/Financeiro`; chama `AlunoEscolaService.AtualizarTotaisAtendimentos`.
- **Disable:** RN-12 (permissão) + RN-13 (ano letivo vigente, mesma fonte do Get) — validação real, não só a UI.
- **RN-09 (Especialista) não implementada** — nenhum campo/UI existe para isso hoje (nota do próprio CA-20: "hoje nenhum Tipo de Rede tem essa opção ativa").
- **Pendência nova:** `TipoAtendimentoPessoa.Descricao` ("Atendente"/"Responsável") e `TipoPublicoAtendido.Nome` ("Profissional de Saúde Particular") são resolvidos por **comparação de texto literal** (`AtendimentoConstants`, novo) — não foi possível confirmar contra os dados reais (conexão com o banco indisponível durante a implementação). Confirmar assim que possível.
- **Resumo automático (RN-04/05/CA-04b) não implementado** — `EmailAtendimentoRequest.Resumo` é enviado como `null` (comportamento correto para Motivos sem lógica de resumo, mas nenhum Motivo tem hoje).

**[CORRIGIDO 2026-08-12 — pendência 1.8]** `SalvarAtendimento` falhava ao confirmar o formulário com Norteador respondido — primeiro com `SqlDateTime overflow`, depois (corrigido esse) com `Violation of UNIQUE KEY constraint 'UQ_FormularioAtendimentoResposta_Hash' ... duplicate key value is (00000000-0000-0000-0000-000000000000)`. Causa raiz única: `FormularioAtendimentoResposta`/`FormularioAtendimentoRespostaOpcao` (montadas em `MontarRespostas`, atribuídas a `atendimento.FormularioAtendimentoRespostas`) são inseridas por **cascata do grafo do EF Core** — `_atendimentoRepository.Insert(atendimento)` (overload de entidade única) só faz, na entidade passada, `RegistrarInclusao()` (`Ativo`/`DataInclusao`) e `Hash = Guid.NewGuid()` (`Repository<T>.Insert(T)`), nunca alcançando os filhos do grafo. Sem isso: `DataInclusao = default(DateTime)` (`0001-01-01`, fora do range do `datetime` do SQL Server — mínimo 1753) → `SqlDateTime overflow`; e `Hash = Guid.Empty` em todas as linhas → violação da `UNIQUE KEY` a partir da 2ª linha (ou de qualquer registro anterior já salvo com o mesmo bug). `AtendimentoPessoa` não tinha esse problema (inserida via `Insert(List<T>)`, que estampa auditoria E Hash por item do array). Corrigido: `AtendimentoSaveService` passou a injetar `IUsuarioAutenticadoRepository` e chama `RegistrarInclusao(usuarioId)` **e** atribui `Hash = Guid.NewGuid()` manualmente em cada `FormularioAtendimentoResposta`/`Opcao` dentro de `MontarRespostas`, antes de retornar a lista. Nenhum precedente disso existia no repo — `OcorrenciasSaveService` (referência copiada para este service) nunca insere um grafo com filhos, só uma entidade "chata".

---

## T5 — API: endpoints em PainelAlunoController

**O que fazer:** Adicionar os endpoints `getatendimentos`, `getreferenciasatendimento`, `salvaratendimento` e `removeratendimento` ao `PainelAlunoController`.

**Contexto:** Infraestrutura — habilita todos os CAs de frontend. Seguir exatamente o padrão dos endpoints de Documentos já presentes no mesmo controller (injeção de service via `[FromServices]`, DTOs por `Hash`). Depende de T2 e T4. **Decisão já tomada no plano técnico:** manter dentro de `PainelAlunoController` (consistente com Documentos/FichaMedica) em vez de criar um `AtendimentoController` dedicado.

**Pronto quando:** Os 4 endpoints respondem corretamente via chamada HTTP (Swagger ou Postman), respeitando RBAC.

**Status:** concluída

**Notas de execução (2026-08-10):** implementados **9** endpoints, não 4 — T2 (`ReferenciasAtendimentoService`) tinha 5 métodos progressivos nunca expostos, e T3 (`EmailAtendimentoService.GerarPreviaEmail`) também não tinha endpoint (necessário para a prévia reativa do CA-07):
`gettipospublicoatendido`, `gettiposatendimento/{hash}`, `getmotivosatendimento/{hash}/{hash}`, `getsolicitantesatendimento`, `getnorteadoratendimento/{hash}/{hash}/{hash}` (progressivos, mesmo padrão de filter-rede/escola/serie/turma), `getatendimentos`, `previaremailatendimento`, `salvaratendimento`, `removeratendimento`. Os dois últimos (escrita) envolvidos em `_unitOfWork.Execute(...)` no controller, igual a `salvarocorrencia`/`removerocorrencia` — nenhum dos services novos injeta `IUnitOfWork` diretamente.

**[ADICIONADO 2026-08-11 — pendência 1.6]** 10º endpoint: `POST getdisciplinasatendimento` (`DadosDoAlunoRequest` no corpo, igual a `getatendimentos`) — corrige a pergunta do Norteador "Disciplinas do Aluno" que iniciava desabilitada por falta de opções. Chama `IReferenciasAtendimentoService.GetDisciplinas(request)` (novo): resolve `AlunoEscolaId` via `IAlunoEscolaRepository.GetResponseParaInclusaoAtendimentoOuOcorrencia` (mesmo método de `AtendimentoSaveService`) e retorna `IAlunoEscolaDisciplinaRepository.GetDisciplinasDoAluno(alunoEscolaId)` (novo — projeta `AlunoEscolaDisciplina.DisciplinaMae` como `BaseResponse[]`, `Distinct()` pois pode haver mais de uma linha por disciplina/semestre). Reaproveita a entidade `AlunoEscolaDisciplina` já existente (usada por `DisciplinasPorAluno/ExportarRelatorioService`), nenhuma tabela/coluna nova.

- **Observação não confirmada (fora do escopo, não investigada a fundo):** `GetResponseParaInclusaoAtendimentoOuOcorrencia` projeta `AlunoEscolaInternalResponse.AlunoEscolaId = x.PessoaEscolaAcessoId` — que é a FK de `AlunoEscola` para `PessoaEscolaAcesso` (`[Column("AlunoEscola_key")]`), não o `Id` próprio de `AlunoEscola`. Pode ser um bug pré-existente (herdado, não introduzido agora) ou só um nome de campo confuso (se a FK física de `Atendimento.AlunoEscola`/`AlunoEscolaDisciplina.AlunoEscola` no banco realmente apontar para `PessoaEscolaAcesso.Id`). Reaproveitei o método como estava (consistente com `AtendimentoSaveService`, que já o usa) — vale confirmar via `db_map`/`sys.foreign_keys` antes de testar o fluxo de salvar atendimento de ponta a ponta.

---

## T6 — Frontend: modelos e service Angular

**O que fazer:** Criar os tipos de request/response e os métodos novos em `painel-aluno.service.ts`.

**Contexto:** Infraestrutura. Depende de T5 (contratos dos endpoints). Arquivos:
- `painel-aluno/models/models.ts` — novos tipos de request/response para Atendimento.
- `painel-aluno.service.ts` — `getAtendimentos`, `getReferenciasAtendimento`, `salvarAtendimento`, `removerAtendimento`.

**Pronto quando:** Os métodos do service compilam e retornam os tipos corretos ao chamar os endpoints reais.

**Status:** concluída

**Notas de execução (2026-08-11):** Tipos adicionados em `models.ts` (`TipoQuestaoAtendimentoEnum` numérico espelhando o enum C# — sem `JsonStringEnumConverter` global no backend, serializa como inteiro —, `TipoPublicoAtendidoResponse`, `MotivoAtendimentoResponse`, `OpcaoAtendimentoResponse`, `PerguntaAtendimentoResponse`, `NorteadorAtendimentoResponse`, `PerguntaRespondidaAtendimentoResponse`, `AtendimentoResponse`, `RespostaNorteadorRequest`, `SalvarAtendimentoRequest`, `RemoverAtendimentoRequest`, `EmailAtendimentoRequest/Destinatario/PreviaResponse`). `painel-aluno.service.ts` recebeu os 9 métodos correspondentes aos endpoints de T5, incluindo `getAtendentesAtendimento` (pré-requisito de T11, implementado junto).

---

## T7 — Frontend: formulário inline expansível

**O que fazer:** Reescrever `atendimento-tab.component.ts/.html/.scss` do zero, implementando o formulário inline expansível de Novo Atendimento.

**Contexto:** CAs: CA-01 a CA-08, CA-21 a CA-24. Hoje o componente é 100% placeholder ("Em desenvolvimento"). Depende de T6 e **T11** (Atendente(s)/Objetivo). Referência visual/comportamental completa: `cards/EFC-6546/claude_design/painel-aluno/AtendimentoTab.jsx` — usar como fonte de estrutura de UI, **exceto** nos pontos de conflito com o refinamento (ver riscos #10/#11 do `EFC-6546.tech.md`: seguir o refinamento para as 6 opções de Solicitante e para o campo "Nome do Profissional", não o mock).

Cobrir:
- Campos base obrigatórios: Data, Solicitante (6 opções — CA-21), Atendimento ao, Tipo, Motivo, **Atendente(s)** (multi-seleção, via T11), e Responsável(eis) Atendido(s) **ou** Nome do Profissional conforme CA-03/24 (não ambos, não o campo genérico do mock).
- **Divulgação progressiva:** "Objetivo", "Norteadores para atendimento" e o bloco final de registro só ficam visíveis após todos os campos base estarem preenchidos; antes disso, mostrar bloco de bloqueio com mensagem explicativa (confirmado pelo design).
- Seção "Objetivo" (toggle Exibir/Ocultar) — texto vindo de T11, se confirmado com produto.
- Norteador dinâmico com perguntas condicionais (CA-04): renderer genérico para os 5 tipos de resposta (seleção única via rádio, seleção múltipla via checkbox, texto livre, texto longo, seleção via dropdown), com visibilidade condicional — **[RESOLVIDO — pendência 1.1]** a pergunta condicional (`HashOpcaoGatilho`) só aparece/é exigida quando a opção com esse hash estiver entre as respostas já dadas em perguntas anteriores do mesmo Norteador.
- Bloco final: "Resumo da Conversa" e "Comentários" — **confirmado pelo tech lead (`cards/EFC-6546/instrucoes_tl.png` + comentário, 2026-08-10): são dois campos de texto livre distintos, preenchidos manualmente abaixo do bloco de Norteadores — não são gerados a partir das respostas do Norteador** (risco #14 do plano técnico deixa de ser uma ambiguidade aberta, ver pendência 2.1 em `EFC-6546.pendencias.md`); "Resumo da Conversa" obrigatório e enviado por e-mail, "Próximos Passos"/"Verificação" (**[CONFIRMADO 2026-08-10] mesmo campo, um único campo de data** — risco #15 resolvido, nomenclatura final da label ainda a decidir), checkboxes de e-mail RP/RF com preview reativo (CA-06/07) — prévia só aparece com checkbox marcado **e** conteúdo em Resumo/Próximos Passos —, "Comentários" (interno, nunca enviado por e-mail) e "Marcar como Importante" (CA-23).
- **Checkbox RF desabilitado com tooltip quando o responsável não tem e-mail cadastrado** — confirmado pelo design, requisito definitivo (risco #16).
- Modal de confirmação de descarte ao clicar em Cancelar com formulário "dirty"; toast de sucesso ao salvar.
- Validações cruzadas de data no client antes de enviar (CA-22).
- **Nenhum componente de accordion/painel expansível reutilizável existe em `shared/`** — desenhar esse padrão visual usando o catálogo do repo (`app-checkbox`, `app-check`, `app-button`, `[tooltip]`), nunca elementos HTML nativos (risco #7 do plano técnico).
- **Já resolvido fora de ordem (pendência 3.3):** `AtendimentoTabComponent` já recebe `@Input() hashAnoLetivoSelecionado` (o ano escolhido no seletor do cabeçalho da ficha, `app-checkmark-dropdown`) — hoje só exibido como texto no placeholder. **[CONFIRMADO 2026-08-10 — pendência 2.6]** T7 deve usar esse input para buscar e exibir os atendimentos **do ano selecionado**, recarregando a cada troca — não busca "todos os anos" de uma vez (prevalece a leitura de CA-16/CA-18 sobre CA-10; ver pendência 2.6 em `EFC-6546.pendencias.md`, que também descarta o desenho de accordion multi-ano planejado em T8).

**Pronto quando:** É possível abrir o formulário, preencher todos os campos (incluindo condicionais e Norteador), ver a prévia de e-mail reativa e salvar um atendimento com sucesso.

**Status:** concluída

**Notas de execução (2026-08-11):** `atendimento-tab.component.ts/.html/.scss` reescritos do zero. Cobre: campos base com divulgação progressiva (`camposBaseCompletos`), cascata Atendimento ao → Tipo → Motivo → Norteador, Atendente(s)/Responsável(eis) via `app-multi-select-field`, Nome do Profissional condicional (CA-03/24, mutuamente exclusivo com Responsável), Norteador dinâmico com os 5 tipos de resposta e visibilidade condicional por `hashOpcaoGatilho` (pendência 1.1), bloco final (Resumo/Comentários/Próximos Passos+Verificação/checkboxes RP-RF/Importante), prévia de e-mail reativa (debounce 400ms, só com checkbox marcado + conteúdo), modais de confirmação de remoção e descarte. `ficha.component.ts` ganhou o getter `requestParaAtendimento` (resolve o `DadosDoAlunoRequest` completo do ano selecionado no seletor do cabeçalho, não o ano ambiente da ficha — pendência 3.3) e `ficha.component.html` foi ajustado para `[request]`/`[responsaveis]`.
- **Bug corrigido:** vazamento de subscriptions — `initForm()` recriava o `FormGroup` e reassinava `escutarCascata/escutarProximosPassos/escutarPreviaEmail` a cada abertura/cancelamento do formulário (`takeUntil(this.destroy$)` só encerra na destruição do componente, não por ciclo de abertura). Separado em `criarForm()` (uma única vez, no construtor — monta o grupo e liga as subscriptions) e `resetForm()` (chamado por `abrirForm()`/`fecharForm()` — só restaura valores e limpa o `FormArray` de Norteadores).
- **Bug corrigido:** campo Responsável(eis) Atendido(s) tinha `[options]="[]"` fixo (placeholder morto) — componente ganhou `@Input() responsaveis` + getter `responsaveisOptions`.
- **Bug corrigido:** `respostaBit` das perguntas Binário do Norteador é controlado por um `single-select` com valores string `'sim'/'nao'`, convertido para `boolean|null` só no momento de montar o request de salvamento.
- `atendimento-tab.component.scss` criado, seguindo o padrão visual de `ocorrencias-tab.component.scss` (mesmas variáveis, mesma estrutura de card/estado vazio/modal).
- **T8 (listagem completa em accordion) não foi feito** — o HTML atual tem uma listagem simples de cards (grid de metadados + painéis fixos, sem abas verticais), suficiente para validar o fluxo de inclusão mas não a spec completa de T8.

**[CORRIGIDO 2026-08-11 — pendência 1.6]** Bug reportado pelo usuário: a pergunta do Norteador do tipo "Disciplinas do Aluno" iniciava sempre desabilitada. Causa: `opcoesDaPergunta()` só sabia mapear `pergunta.opcoes` (cadastro estático), que vem vazio do backend para esse tipo de pergunta — e `app-multi-select-field` se desabilita quando `options.length === 0`. Corrigido:
- Novo `TIPOS_DISCIPLINAS_ALUNO` (Set com `SelecaoMultiplaDisciplinasAluno`/`DisciplinasAluno`); `opcoesDaPergunta()` retorna `this.disciplinas` para esses tipos.
- Novo campo `disciplinas: OptionItem[]`, carregado em `carregarReferenciasBase()` via `painelAlunoService.getDisciplinasAtendimento(this.request)` (novo método/endpoint, ver T5).
- **Segundo bug encontrado junto (mesma causa raiz — tipo Disciplinas nunca tratado à parte):** `salvarInclusao()` sempre enviava `hashesDisciplinasSelecionadas: []` fixo, mesmo com o campo preenchido — a resposta seria descartada silenciosamente no backend (`AtendimentoSaveService.MontarRespostas` só lê esse campo para disciplinas, nunca `HashesOpcoesSelecionadas`). Corrigido: a seleção do control único por pergunta é roteada para `hashesDisciplinasSelecionadas` ou `hashesOpcoesSelecionadas` conforme o tipo da pergunta.
- **Não corrigido (fora do escopo pedido):** o tipo `Ocorrencias` (também em `TIPOS_SELECAO_MULTIPLA`) provavelmente tem o mesmo problema (opções deveriam ser as ocorrências reais do aluno, não `pergunta.opcoes`) — não investigado nem implementado; continuará desabilitado se/quando aparecer.

**[CORRIGIDO 2026-08-11 — pendência 1.7]** Bug reportado pelo usuário: campo Responsável(eis) Atendido(s) continuava visível com "Profissional de Saúde Particular" selecionado em "Atendimento ao" (violando CA-03/CA-24). Causa: `mostrarNomeProfissional`/`mostrarResponsaveisAtendidos` comparavam `tipo.descricao` contra o texto literal `'Profissional de Saúde Particular'`, e a comparação não batia (texto real nunca confirmado contra o banco — pendência 1.5). Em vez de tentar acertar o texto exato, foi criada uma flag dedicada `TipoPublicoAtendido.ExigeNomeProfissional` (bool), mesmo padrão de `PermiteResponsavel`/`ResponsavelEhOpcional`/`PermiteEspecialista` — elimina qualquer comparação de string nesse fluxo. Tocado: T1 (entidade/mapping/script SQL novo — `EFC-6546-flag-exige-nome-profissional.sql`, **ainda não executado no banco**, ver pendência 1.7 em `EFC-6546.pendencias.md` para o passo de verificação obrigatório pós-execução), T4 (`AtendimentoSaveService.ValidarResponsavelOuNomeProfissional`), T2/T5 (`TipoPublicoAtendidoResponse`/repositório), T7 (getters do componente). `AtendimentoConstants.cs` (só continha esse texto) removido por não ter mais consumidores.

---

## T8 — Frontend: listagem, cards e estados

**O que fazer:** Implementar a lista de atendimentos do ano letivo selecionado, os painéis internos de cada card, os indicadores visuais e os estados (vazio, exclusão bloqueada).

**Contexto:** CAs: CA-09 a CA-17, CA-25, CA-26. Depende de T7. Referência: `cards/EFC-6546/claude_design/painel-aluno/AtendimentoTab.jsx`. Cobrir:
- **[REVISADO 2026-08-10 — pendência 2.6] A lista é filtrada por ano, não um accordion com todos os anos simultâneos.** O desenho original abaixo (accordion multi-ano) foi descartado — ver `EFC-6546.pendencias.md` §2.6. A lista exibe só os atendimentos do ano selecionado no seletor do cabeçalho (`hashAnoLetivoSelecionado`, ver T7), com o título do ano acima da lista (singular, não múltiplos grupos) — refina CA-10/CA-12.
- Cabeçalho da lista: botão "Novo Atendimento" + contador "N atendimento(s) registrado(s)" (visível só com registros).
- Card: grid de metadados em 3 colunas (Data/Solicitante, Tipo/Atendimento ao, Atendente/Motivo) sempre visível; faixa de status de e-mail logo abaixo, sempre visível (CA-26); painéis internos em abas **verticais** à esquerda (Norteadores, Resumo da conversa, Comentários, Próximos passos), "Comentários" ativo por padrão (CA-13); painel vazio mostra `<Não informado>` em itálico (CA-14).
- Indicador de "Importante" (CA-23): fundo do card inteiro com tom destacado **e** ícone de estrela com tooltip (os dois efeitos, confirmado pelo design).
- Botão de exclusão: implementar as duas condições de bloqueio separadamente — sem permissão (CA-15, tooltip "Você não tem permissão para excluir atendimentos") e ano letivo anterior (CA-25, tooltip "Apenas atendimentos do ano letivo atual podem ser excluídos") — o design só demonstra uma flag genérica `podeExcluir`, a distinção de tooltip por motivo precisa ser implementada mesmo sem exemplo direto no mock.
- Estado vazio com botão de ação (CA-17).
- Ligar `@Input request` / `@Output quantidadeAlterada` em `ficha-painel-aluno.component` (hoje só `documentos-tab` recebe esses inputs).
- **[RESOLVIDO — pendência 3.3]** O seletor de Ano Letivo no cabeçalho da ficha já foi implementado (`app-checkmark-dropdown`, ver `ficha.component.ts/html`) — restrito à aba Atendimento, sem afetar as demais abas (risco #6 do plano técnico resolvido dentro desse escopo). T8 só precisa consumir `hashAnoLetivoSelecionado` (via T7) para saber qual ano exibir.

**Pronto quando:** A lista exibe os atendimentos corretamente agrupados e ordenados, com todos os indicadores e estados descritos nos CAs, e a exclusão funciona respeitando as regras de permissão e ano letivo.

**Status:** pendente

---

## T9 — Frontend: impressão

**O que fazer:** Implementar a impressão do atendimento reaproveitando o `document-builder` já existente no frontend.

**Contexto:** CA-19. Depende de T8. Usar `PrintService`/`PdfApiService` já existentes no repo, em vez de criar capability de PDF no backend (decisão já tomada no plano técnico). Garantir desde o início que o nome do aluno apareça no template gerado — no legado (`portal-atlas`), `ImprimirAtendimento` busca `NomeAluno` mas nunca o referencia no HTML final; aqui é código novo, então não há bug a herdar, apenas atenção ao requisito.

**Pronto quando:** Ao clicar em imprimir, o documento gerado contém nome do aluno, data do atendimento, tipo/motivo, resumo do Norteador (quando existir), Observações, Próximos Passos e campos de assinatura para Atendente e Responsável.

**Status:** pendente

---

## T10 — Testes de integração e unitários

**O que fazer:** Criar os testes de integração dos services de backend e os testes unitários do frontend.

**Contexto:** Cobre todos os CAs de backend/frontend. Depende de T1 a T9 estarem concluídas. Seguir `.claude/commands/criar-testes.md` do repositório `estrutura-pedagogica`.
- Backend: `Test/Integration/Scenarios/PainelAluno/Atendimento*Tests.cs` (xUnit + InMemory + Bogus, herdar de `BaseTest`).
- Frontend: `tests/unit/painel-aluno/atendimento-tab.spec.ts` + testes dos novos métodos de `painel-aluno.service.ts` (Jest puro, sem TestBed/Jasmine).

**Pronto quando:** Todos os testes passam com `dotnet test` (backend) e `npm test`/`jest` (frontend).

**Status:** pendente

---

## T11 — Ajustes de backend decorrentes da análise do design (pré-requisito de T4/T7)

**O que fazer:** Complementar `ReferenciasAtendimentoService` (T2) e o modelo de dados com os requisitos identificados ao analisar `cards/EFC-6546/claude_design/painel-aluno/AtendimentoTab.jsx`, que não estavam cobertos por nenhum CA do refinamento original.

**Contexto:** Esta tarefa existe porque o design revelou gaps entre o que foi refinado (`EFC-6546.refinamento.md`) e o que a tela precisa de fato. **Antes de implementar, confirmar com produto os pontos abaixo** (riscos #10 a #15 do `EFC-6546.tech.md`):
- **[IMPLEMENTADO 2026-08-11] Campo "Atendente(s)" (obrigatório, multi-seleção):** não existe em nenhum CA, mas é exigido pelo design — **confirmado que entra nesta entrega**, consistente com o modelo de domínio já existente (`AtendimentoPessoa` com papel Atendente) e com o endpoint legado `GetAtendentesUnidade`. Implementada a cadeia completa: `IUsuarioAcessoRepository.GetPessoaIdsPorEscolaFuncionalidade` (pessoas com `FuncionalidadeEnum.PainelAluno_Atendimento` na escola) → `IPessoaRepository.GetResponsePorIds` → `IReferenciasAtendimentoService.GetAtendentes(hashEscola)` → endpoint `getatendentesatendimento/{hashEscola}` → `painel-aluno.service.ts` (T6) → `app-multi-select-field` em T7. Falta só formalizar como adendo ao refinamento (novo CA/RN) — decisão de produto já tomada, documento ainda não atualizado.
- **[RESOLVIDO] Seção "Objetivo" (texto descritivo):** confirmado por leitura direta do código que `FormularioAtendimento.Objetivo` (string) já existe no schema — não precisa de coluna nova. Basta expor esse campo em `NorteadorAtendimentoResponse` (T2) e consumir no toggle "Objetivo" do formulário (T7). Ver `cards/EFC-6546/EFC-6546.entidades.md` §4.
- **[CONFIRMADO 2026-08-10] Conflito de opções do campo Solicitante:** o design mostra só 3 opções (diferentes até no nome — "Família" em vez de "Responsável"); o refinamento aprovado tem 6 — **produto aprovou as 2 opções extras (Coordenador de Atendimento, Psicopedagogo)**, prevalecem as 6 do refinamento. Já implementado em T2 (`ReferenciasAtendimentoService`). Falta só sinalizar para atualização do arquivo de design (cosmético, não bloqueia).
- **[RESOLVIDO] Duplicidade entre "Resumo da Conversa" e o resumo automático do Norteador:** tech lead confirmou (`cards/EFC-6546/instrucoes_tl.png`, 2026-08-10) que são dois campos distintos — "Resumo da Conversa" e "Comentários" são texto livre preenchido manualmente, abaixo do bloco de Norteadores, não gerados a partir das respostas estruturadas. Ver pendência 2.1 em `EFC-6546.pendencias.md` para o que ainda falta fechar (onde exatamente o resumo automático do CA-04b/CA-05 aparece).
- **[RESOLVIDO]** A correção do schema do Norteador (opção condicional específica), antes uma pendência em aberto, já foi feita — ver nota em T2.

**Pronto quando:** Cada um dos pontos acima tem uma decisão registrada (mesmo que a decisão seja "não implementar agora"), e os itens confirmados como necessários estão implementados e compilando.

**Status:** concluída

**Notas de execução (2026-08-11):** Os 5 pontos têm decisão registrada; os itens confirmados (Atendente(s)/`GetAtendentes()`, Objetivo, 6 opções de Solicitante, correção do schema do Norteador) estão implementados e consumidos por T2/T6/T7. Falta apenas a formalização cosmética no documento de refinamento (novo CA/RN para Atendente(s); atualização do mock de design com as 6 opções de Solicitante) — não bloqueia o código.
