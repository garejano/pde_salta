# Análise — Fluxo de Lançamento de Frequência (estrutura-pedagogica)

> Gerado em: 2026-10-29
> Repositório analisado: `estrutura-pedagogica` (módulo `lancamento-frequencia`, frontend + backend)
> Escopo: leitura de código-fonte (controllers, services, repositories, enums, entidades) e testes de integração/e2e/unit. Nenhum arquivo do repositório foi alterado.

> Nota: cards sobre "lançamento de frequência" pertencem a este módulo dentro de `estrutura-pedagogica`, **não** ao repositório separado `frequencia` (ver `MEMORY.md` → `project_lancamento_frequencia_repo`).

---

## 1. Fluxo ponta a ponta

### Entrada do usuário
Rota `/lancamento-frequencia` (lazy, protegida por `authGuard`), registrada em `src/app/app-routing.module.ts:38-42`. Árvore de rotas (`frontend/src/app/features/lancamento-frequencia/lancamento-frequencia.routes.ts:8-29`):

- `/lancamento-frequencia` → `FrequenciaComponent` (shell de abas), filhos:
  - `listar` (default) — listagem/filtro de turmas
  - `justificativa` — gestão de justificativas de falta
  - `lista-presenca` (lazy) — geração de listas de presença/carômetro
- `/lancamento-frequencia/lancamento` → `LancamentoFrequenciaComponent`, fora do shell (tela cheia de chamada).

`FrequenciaComponent` chama `GET /lancamentofrequencia/permissoes-abas` → `PermissoesAbasController` → `PermissoesAbasService.Get`, que consulta 3 `UsuarioAcesso` distintos (funcionalidades 101, 68, 69, sem escopo de escola) para decidir quais abas o `frequencia-tab-navigator` exibe.

### Aba "Frequência" (listagem)
`ListarComponent` roda um filtro em cascata **Data → Rede → Escola → Série/Turma → Status**, cada passo chamando `POST /lancamentofrequencia/filter-{redes,escolas,series,turmas}` → `FilterController` → `FilterService.Filter(request, passo)` → `ValidacaoService.ValidarRequest` (preenche `EscolasDoUsuario`, `PossuiVisaoCoordenacao`, `PossuiJustificarFaltas`) → `FilterLancamentoFrequenciaRepository.GetRedes/Escolas/Series/Turmas`.

Ao aplicar o filtro, chama `POST /lancamentofrequencia/get-eventos` → `GetEventosService.Get` (o service mais complexo do módulo — ver seção 2), que devolve turmas/tempos com status agregado. O toggle "apenas minhas turmas" é client-side.

Clicar em "Lançar"/"Ver/Editar" resolve o `hashAulaEvento` do tempo mais crítico já iniciado, grava um `ListaFrequenciaStore` em `RouteStateService` e navega para `/lancamento-frequencia/lancamento`.

### Tela de chamada
`LancamentoFrequenciaComponent.ngOnInit` lê o store (se ausente, volta à listagem). Chama `GET /lancamentofrequencia/get-chamada/{hashAulaEvento}` → `GetChamadaService.Get`, que valida acesso/janela de horário via `ValidacaoChamadaService.ValidarEvento` e retorna a lista de alunos com estado atual de frequência/justificativa/saída antecipada.

Cada clique num botão de frequência dispara `POST /lancamentofrequencia/save-chamada` (fila de até 5 concorrentes no frontend) → `SaveChamadaService.Save`, dentro de `_unitOfWork.Execute(...)` (transação) no controller.

### Aba "Justificativa"
Lista alunos ausentes via `POST /lancamentofrequencia/get-alunos-ausentes` → `GetAlunosAusentesService.Get` (exige `PossuiVisaoCoordenacao`). Criar/editar/remover justificativa chama `create-justificativa`/`update-justificativa`/`disable-justificativa` → `SaveJustificativaService`/`DisableJustificativaService`, todos transacionais e restritos à funcionalidade `LancamentoFrequencia_JustificarFaltas`.

### Aba "Lista de Presença"
`GetTurmasListaPresencaService`/`GetAlunosListaPresencaService`/`GetAlunosCarometroService` alimentam a geração de documentos (lista diária/semanal/mensal e carômetro) via `document-builder` compartilhado — puramente leitura, sem gravação.

### Saída antecipada
Formulário inline na chamada chama `save-saida-antecipada`/`disable-saida-antecipada` → `SaidaAntecipadaService`.

---

## 2. Regras de negócio

### Permissões e escopo
- Todo o controller exige a funcionalidade **101 `LancamentoFrequencia`** (`LancamentoFrequenciaController.cs:17`).
- `get-alunos-ausentes` exige adicionalmente **68 `LancamentoFrequencia_VisaoCoordenacao`**.
- `create/update/disable-justificativa` exigem **69 `LancamentoFrequencia_JustificarFaltas`**.
- Permissões de escopo fino (`PossuiVisaoCoordenacao`, `PossuiJustificarFaltas`) são avaliadas **na escola do filtro**, nunca globalmente — ter o acesso em outra escola não libera a escola atual.
- Sem visão de coordenação: usuário só vê/lança frequência em turmas onde tem `ProfessorTurmaDisciplina` — para eventos com disciplina, o vínculo precisa casar turma+disciplina; para eventos sem disciplina (chamada "por dia"), basta vínculo na turma.

### Janela de tempo para lançar chamada
- Só se aplica a eventos **com disciplina** (chamada "Por Aula"): `DataInicio > DateTime.Now + MinutosAntecedenciaChamada` bloqueia com *"Aguarde o início da aula para realizar a chamada."*. Eventos "Por Dia"/"Por Turno" não têm essa restrição.
- Datas nunca anteriores a `AnoMinimoFrequencia` (2018) nem futuras, em qualquer fluxo.

### Justificativa "congela" o lançamento
Regra central do módulo:
- Justificativa vigente na data (`DataInicial <= data <= DataFinal`) conta **automaticamente como falta confirmada**, mesmo sem lançamento físico — exceto no próprio evento onde a falta de origem foi confirmada.
- `SaveChamadaService.Save` **bloqueia qualquer alteração** de chamada (marcar, desmarcar, trocar tipo) enquanto há justificativa vigente: *"Aluno possui justificativa de falta vigente nesta data; a frequência está congelada. Remova a justificativa para alterar."*
- No frontend, os botões de marcação e a opção de saída antecipada somem do card do aluno quando há justificativa vigente.

### Upsert e replicação de chamada (`SaveChamadaService.ProcessarUpsert`)
- Sem lançamento prévio → insere e, se o tipo **não é atraso**, replica para os demais eventos da mesma turma/data ainda sem frequência, com `Confirmada=false` (lançamento "herdado", exige confirmação manual).
- Mesmo tipo, não confirmado → apenas confirma (sem duplicar).
- Tipo diferente → desativa o antigo, insere o novo, replica se não for atraso.
- Mesmo tipo já confirmado → idempotente, nada muda.
- **Atraso nunca replica** — é tratado como pontual ao evento.
- Concorrência: índice único em `AlunoFrequencia` (pessoa+escola+data+turno+tempo); violação retorna *"A frequência deste aluno foi registrada por outro lançamento ao mesmo tempo. Recarregue a chamada e tente novamente."*
- Cache de faltas/atrasos (`IFaltasAtrasosCache`) é invalidado exatamente uma vez por operação efetiva, chave `(pessoaId, ano)`.

### Status agregado do evento (`GetEventosService.CalcularStatus`)
Prioridade do mais crítico ao mais completo:
`PossuiPendencia` (misto lançado/não lançado) > `PendenteLancamento` (ninguém lançado) > `PendenteConfirmacao` (todos lançados, algum não confirmado) > `LancadoPorCompleto`.

Justificativa conta como "lançado e confirmado" mesmo sem frequência física. Agregação "Por Aula" usa o status de menor `Ordem` entre os tempos da turma; "Por Dia"/"Por Turno" são exibidos individualmente.

### Saída antecipada (`SaidaAntecipadaService`)
- Exige `evento.PossuiFrequencia = true`; se o evento tem `Tempo` (chamada por aula), `HoraSaida` deve estar dentro de `DataInicio`–`DataTermino` do evento.
- Nova saída **substitui** (desativa) a anterior do mesmo dia, não acumula.
- **Efeito cascata**: registrar saída antecipada num tempo converte automaticamente todas as presenças/atrasos não confirmados em tempos **posteriores** do mesmo turno/dia em falta confirmada (`RegistrarFaltasPosteriores`) — quem sai mais cedo falta ao restante do turno.
- Frontend só oferece a opção a alunos presentes/atrasados, sem justificativa e sem saída já registrada em tempo anterior.

### Justificativa de falta (`SaveJustificativaService` / `ValidacaoJustificativaService`)
- Só é possível justificar uma falta **já lançada** na data — *"Aluno não possui falta registrada na data informada."*
- Não permite sobreposição de período já justificado — *"Aluno já possui justificativa de falta para o período informado."*
- `DataFinal >= DataAula`; descrição obrigatória, 1–1000 caracteres (reflete coluna `varchar(1000)`).
- Anexo opcional — se presente, exige nome (≤250 chars) e base64; extensão na allowlist (config `ExtensoesPermitidasJustificativasFalta`: jpg, jpeg, png, doc, docx, pdf); tamanho ≤ `TamanhoMaximoAnexoJustificativasFalta` (8 MB).
- **Falha de upload no S3 nunca bloqueia a operação** — a justificativa é salva sem anexo e retorna aviso textual; erro real é só logado. Em ambiente sem bucket S3 configurado (`HasS3Bucket = false`), o anexo é marcado presente sem upload real.
- `Update` detecta ausência de mudanças reais e recusa ("Não existem alterações a serem realizadas."); não edita a entidade existente — **desativa e cria uma nova** (histórico de substituição); reaproveita anexo quando `ArquivoAlterado = false`.
- `Disable` exige especificamente a funcionalidade 69 (`ehInativacao = true`), diferente do `Get` que exige só a 101.
- Aluno "inativo sem `DataCancelamento`" é tratado como "não matriculado" em todos os fluxos de frequência/justificativa/lista de presença — regra de integridade consistente em todo o módulo.

---

## 3. Enums

### `FilterLancamentoFrequenciaEnum`
| Valor | Nome | Significado |
|---|---|---|
| 1 | FilterRede | Passo "selecionar rede" do filtro em cascata |
| 2 | FilterEscola | Passo "selecionar escola" |
| 3 | FilterSerie | Passo "selecionar série" |
| 4 | FilterTurma | Passo "selecionar turma" |
| 5 | GetEventos | Passo final — busca eventos/turmas para chamada |

Controla obrigatoriedade progressiva de campos e quais `Where`s a query de turmas aplica.

### `StatusLancamentoFrequenciaEnum`
| Valor | Nome | Significado |
|---|---|---|
| 1 | PendenteLancamento | Nenhum aluno esperado tem lançamento/justificativa |
| 2 | PossuiPendencia | Mistura de alunos lançados e não lançados |
| 3 | PendenteConfirmacao | Todos lançados, algum não confirmado |
| 4 | LancadoPorCompleto | Todos lançados e confirmados (ou turma vazia) |

Os registros reais ficam na tabela `StatusLancamentoFrequencia` (cacheada 1h); o Id do enum deve bater com o Id do registro ao montar as flags do DTO.

### `TipoChamada` (entidade base, não enum — constantes fixas)
`PorDia = 1`, `PorTurno = 2`, `PorAula = 3` — define a granularidade de lançamento por turma via `ConfiguracaoPeriodoLetivo.TipoChamadaId`.

### `TipoFrequencia` (tabela base, dinâmica — não enum hardcoded)
Flags `EhPresenca`/`EhAtraso`/`EhFalta`; frontend itera a lista vinda do backend sem assumir quantidade fixa de tipos.

---

## 4. Entidades e tabelas envolvidas

- **`StatusLancamentoFrequencia`** (base): `Descricao`, `DescricaoTooltip`, `Ordem` (define criticidade), `Ativo`.
- **`AulaEvento`** (stateful): `TurmaId` (FK Turma), `FrenteId`/Disciplina (FK Frente, opcional), `TurnoId` (FK Turno), `Tempo` (int opcional — presente = aula "por tempo"), `Semestre`, `DataInicio`/`DataTermino`, `PossuiFrequencia`, `DiaLetivoExtraId`. Representa uma ocorrência de aula/período letivo — conceito **acadêmico**, não evento de mensageria/barramento (confirmado: não há integração com fila/HTTP externo associada).
- **`AlunoFrequencia`** (stateful): `PessoaId`, `EscolaId`, `TurnoId`, `TipoFrequenciaId`, `DataAula`, `Tempo` (opcional), `Confirmada`, `UsuarioConfirmacaoId`, `DataConfirmacao`. Chave lógica única: (PessoaId, EscolaId, DataAula, TurnoId, Tempo), protegida por índice único no banco.
- **`AlunoJustificativaFalta`** (stateful): `PessoaId`, `Descricao` (≤1000), `DataInicial`/`DataFinal`, `PossuiAnexo`, `NomeAnexoOriginal` (≤250), `NomeAnexoGerado` (Guid), `ExtensaoAnexo`.
- **`AlunoSaidaAntecipada`** (stateful): `PessoaId`, `EscolaId`, `TurnoId`, `DataAula`, `HoraSaida` (time), `Justificativa` (≤500).
- **`TipoFrequencia`** (base): `Descricao`, `Ordem`, `EhPresenca`, `EhAtraso`, `EhFalta`.
- **`AlunoEscola`**: `AlunoEscola_key` → `PessoaEscolaAcesso.Id` → `PessoaEscola.PessoaId` → `Pessoa`.
- **`AlunoEscolaDisciplina`**: liga `AlunoEscola` a `DisciplinaMae`, com `Semestre`/`TodosOsSemestres` — determina se o aluno aparece em eventos de um semestre específico ou em todos.
- **`Turma` → `EscolaSerie` → `Escola` → `Rede`**; `EscolaSerie.Serie.Segmento.PossuiAula` filtra séries elegíveis à frequência; `ConfiguracaoPeriodoLetivo` (por `EscolaSerieId`) define `TipoChamadaId`.
- **`ProfessorTurmaDisciplina`**: vínculo professor↔turma↔disciplina, base da checagem de alocação quando não há visão de coordenação.

---

## 5. Casos de borda e tratamentos de erro notáveis

- **Concorrência**: violação de índice único em `AlunoFrequencia` (lançamento simultâneo por duas sessões) é capturada e vira mensagem amigável tanto em `SaveChamadaService` quanto em `SaidaAntecipadaService.RegistrarFaltasPosteriores`.
- **Antecedência de chamada só para eventos com disciplina** — "Por Dia"/"Por Turno" sempre liberados.
- **`GetParaChamada` vs `GetParaSaidaAntecipada`**: o primeiro só retorna eventos com `DataInicio.Date <= hoje` e `PossuiFrequencia = true`; o segundo não filtra por data (permite registrar saída antecipada retroativa) — validação de `PossuiFrequencia` é manual no service.
- **Upload de anexo tolerante a falha** (S3): nunca bloqueia `create`/`update` de justificativa; falha é só avisada e logada.
- **Replicação evita duplicidade** quando múltiplos `AulaEvento` compartilham turno/tempo com disciplinas diferentes (query com `Distinct`, pois `AlunoFrequencia` não distingue disciplina).
- **Frontend**: navegação/voltar bloqueados durante qualquer ação pendente (salvando frequência, justificativa ou saída antecipada).
- **Inconsistência de UI identificada**: hint "Máx. 8 MB" exibido na tela de chamada (`lancamento.component.html:427`) não bate com o limite real de validação de **5 MB** usado no código do componente (`lancamento.component.ts:617`) — o limite de negócio real do backend é 8 MB (`TamanhoMaximoAnexoJustificativasFalta`). Vale reportar/corrigir.
- **Componente morto identificado**: `JustificativaModalComponent` (`lancamento/justificativa-modal/`) tem lógica completa e testes próprios, mas não é referenciado por nenhum componente ativo — a tela de chamada usa formulário inline, não esse modal.

---

## 6. O que os testes revelam

- **Testes de integração backend** (16 arquivos, ~8100 linhas) confirmam exaustivamente as regras acima e revelam refinamentos não óbvios: granularidade de `PossuiAlocacao` por (turma, disciplina, evento do dia); justificativa encerrada antes da data consultada **não** gera falta automática (janela estritamente respeitada); responsável pedagógico tem prioridade sobre financeiro no carômetro; `GetAlunosAusentesService`/`GetTurmasListaPresenca` exigem visão de coordenação ou alocação de professor conforme o caso.
- **Testes e2e/unit frontend** (13 specs e2e + 4 specs unit) confirmam: clique no mesmo tipo já marcado desmarca; seletor de tempo escolhe o pior status entre tempos já iniciados; fila de salvamento com teto de 5 concorrentes; mensagens exatas de toast/aviso; dois bugs de regressão documentados no filtro (reseleção de rede única, comparação de data default); testes "modo real" rodam contra homolog com critérios de seleção de massa documentados em `tests/regressao/lancamento-frequencia/DADOS.md`.

---

## 7. Principais arquivos de referência

**Backend**
- Controller: `backend/EstruturaPedagogica.Api/Controllers/LancamentoFrequenciaController.cs`
- Services: `backend/EstruturaPedagogica.Domain.Services/LancamentoFrequencia/*.cs` (16 arquivos)
- Validações: `ValidacaoService.cs`, `ValidacaoChamadaService.cs`, `ValidacaoJustificativaService.cs`
- Enums: `backend/EstruturaPedagogica.Domain/Enums/LancamentoFrequencia/{FilterLancamentoFrequenciaEnum,StatusLancamentoFrequenciaEnum}.cs`
- Mappings/Repos: `backend/EstruturaPedagogica.Infra/Mapping/.../{AulaEventoMap,AlunoFrequenciaMap,AlunoJustificativaFaltaMap,AlunoSaidaAntecipadaMap,TipoFrequenciaMap,StatusLancamentoFrequenciaMap}.cs`
- Testes: `backend/EstruturaPedagogica.Test/Integration/Scenarios/LancamentoFrequencia/*.cs` (16 arquivos)

**Frontend**
- `frontend/src/app/features/lancamento-frequencia/**` (rotas, componentes, services, models.ts)
- Testes: `frontend/tests/{e2e,unit,regressao}/lancamento-frequencia/**`

---

## 8. Achados para follow-up (não é regra de negócio, é inconsistência de código)

1. Hint de "Máx. 8 MB" vs. validação real de 5 MB no frontend para anexo de justificativa (`lancamento.component.html:427` vs `lancamento.component.ts:617`).
2. `JustificativaModalComponent` parece código morto — não referenciado por nenhum componente ativo, mas mantido com testes próprios.
