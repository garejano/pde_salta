# Tarefas — EFC-6547 (Aba Anamnese — Painel do Aluno)

## Adendo 2 — Motor genérico `form-section-builder` + migração da Anamnese real (2026-08-25 a 2026-08-27)

**Ver `EFC-6547.status-form-section-builder.md` (mesma pasta) pro resumo completo** — segunda onda
de trabalho, depois de tudo abaixo (T1-T9 + adendo de repetíveis) já estar implementado e em uso.
Resumo de uma linha: construído um motor de formulário genérico e reutilizável
(`shared/form-section-builder/`), validado numa demo com dados reais, e a aba real de Anamnese foi
migrada pra usá-lo — substituindo `PerguntaRepetivelComponent`/`anamnese-widgets.util.ts`/
`AnamneseAccordionComponent` (removidos). Também resolveu o Ponto 5 (campo "Irmão(ã) na Rede" —
componente customizado somente leitura) e corrigiu um gap real no backend (condicionais por
resposta Sim/Não nunca eram expostas pro frontend). **Status: implementado e testado
manualmente pelo usuário, funcionando.**

## Adendo — Perguntas repetíveis (fora do plano original, pendência da T7 resolvida)

**O que foi feito (2026-08-19):** implementado suporte genérico a `Pergunta.RepetivelPeloUsuario` — pendência explicitamente deixada de fora na T7. Descoberto que "Nascimento:" **já existia no cadastro** (minha investigação inicial foi incompleta — só buscava `Texto LIKE '%Irm%'`, que não pega "Nascimento:"); nenhum script SQL foi necessário, o dado já suportava a cadeia completa `Outro(a) Irmão(ã) → Sexo → Nascimento`.

**Mecanismo:** cadeia via `PerguntaVersaoAnamnese.PerguntaAgrupada` (cada nível aponta pro anterior, não todos pra raiz); múltiplas instâncias = múltiplas cadeias paralelas de `AnamnesePessoaResposta`, ligadas por `AnamnesePessoaRespostaAgrupadaId` (raiz→sub1→sub2), replicando exatamente `AnamneseVirtualManager.SalvarResposta`/`GetPerguntasAgrupadas` do legado (investigado via subagente).

**Backend:** `PerguntaAnamneseResponse` (+`Repetivel`, `HashPerguntaAgrupadora`, `Instancias`), novo `InstanciaCampoAnamneseResponse`, `RespostaAnamneseRequest` (+`InstanciaIndice`). `AnamneseGetService.FundirCadeiasRepetiveis` (nova) monta as instâncias andando a cadeia via dicionário de respostas ativas. `AnamneseSaveService.InserirRespostasEmCadeia` (nova) insere de baixo pra cima (profundidade decrescente), item a item (não em lote, precisa do Id gerado pra encadear) — a inativação em massa já existente não precisou de ajuste. `AnamnesePercentualCalculator` ajustado pra considerar `Instancias.Any(...)` como "respondida".

**Generalização confirmada:** query recursiva no banco real achou mais 2 cadeias repetíveis além de "Outro(a) Irmão(ã)" — "Especialidade→Nome do profissional→Telefone→Celular→Consultório" (profundidade 5) e "Escola e/ou creche anterior→de(mês/ano)→até" (profundidade 3, **esta é `Obrigatoria=true, Condicional=false`** — a única que afeta o cálculo de percentual). A implementação percorre a cadeia dinamicamente (sem profundidade fixa), cobrindo todos os casos.

**Frontend:** lógica de resolução de widget extraída para `anamnese-widgets.util.ts` (compartilhada entre `AnamneseTabComponent` e o componente novo). Novo componente dedicado `PerguntaRepetivelComponent` (`pergunta-repetivel/`) — N linhas (uma por instância), campos lado a lado, "+"/remover (mínimo 1 linha sempre visível), `FormControl`s soltos por célula (sem `formControlName`, mesmo princípio já usado no resto da aba), emitindo o array de instâncias pro `control` do pai a cada mudança. Instâncias 100% vazias não são enviadas no save (higiene de dado, decisão da execução).

`dotnet build`: 0 erros. `tsc --noEmit`: mesma baseline de erros pré-existentes (nenhum novo, confirmado via `git stash`).

**Ainda não validado visualmente em navegador** — só build/typecheck.

> Gerado a partir de `EFC-6547.tech.md`. Plano completo em `cards/EFC-6547/EFC-6547.tech.md`.

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

## Pendências (aguardando resposta do usuário)

> Levantadas na execução de T1. Preencher "Resposta:" em cada item — as tarefas seguintes (T4, T7) dependem dessas decisões.

### P1 — Filtro de seções por Perfil de Acesso (`GrupoPerguntaPerfilAcesso`)

O legado (`portal-atlas`) filtra os grupos/seções da Anamnese exibidos não só pelo segmento (Regular/Infantil), mas também pelo perfil de acesso do usuário logado (`validarGrupoPorPerfilAcesso=true`, `AnamneseVirtualManager.cs:825-834`). Essa entidade (`GrupoPerguntaPerfilAcesso`) **não está portada** para `estrutura-pedagogica`. O RBAC novo (`podeVisualizarAnamnese`/`podeEditarAnamnese`) é binário, sem esse nível de granularidade por seção.

**Pergunta:** replicar esse filtro por perfil na nova aba (precisaria portar a entidade + lógica), ou descartar deliberadamente (todo usuário com `podeVisualizarAnamnese` vê todas as seções do segmento)?

**Investigação complementar (2026-08-19):** `PerfilAcesso` já existe em `estrutura-pedagogica` (`Domain/Entities/Base/PerfilAcesso.cs`, mapeamento reduzido) e `PessoaEscolaAcesso.PerfilAcessoId` também já existe como FK. Porém **não existe hoje nenhum service que resolva "qual é o `PessoaEscolaAcesso`/`PerfilAcessoId` do usuário logado nesta escola"** — o RBAC real do repositório roda inteiramente sobre `FuncionalidadeEnum` + `IUsuarioAcessoRepository.GetAnyByEscolaFuncionalidadeUsuarioAutenticado` (mesmo mecanismo que já resolve `PodeVisualizarAnamnese`/`PodeEditarAnamnese`), nunca sobre `PerfilAcesso`. `IUsuarioAutenticadoRepository` só expõe o Id da pessoa logada, sem escola/perfil. Ou seja: replicar o filtro exigiria criar **duas coisas novas** — a entidade `GrupoPerguntaPerfilAcesso` (simples, tabela já existe) **e** a resolução do `PerfilAcesso` do usuário logado (inexistente, fora do padrão convencionado no repo). Isso reforça a opção de **descartar** o filtro, a menos que haja requisito de produto explícito para replicá-lo.

**Resposta:** Descartar o filtro por perfil por hora — usar apenas `podeVisualizarAnamnese` (RBAC binário já existente), sem portar `GrupoPerguntaPerfilAcesso`/resolução de `PerfilAcesso`. Mais simples; revisitar se produto exigir granularidade por perfil no futuro.

---

### P2 — Card/branch do fix "campo irmão obrigatório mesmo sem irmãos"

Não foi encontrada nenhuma evidência local (commit, branch, anotação) de que esse bug está sendo corrigido por outro time — só a menção no card Jira EFC-6547, sem número de card/branch associado.

**Pergunta:** qual é o card Jira (ou branch) desse fix, para eu confirmar que a T4/T7 não sobrepõe a correção em andamento?

**Resposta:** Fora de escopo — não trataremos do bug "irmão obrigatório mesmo sem irmãos" nesta entrega. Sem coordenação necessária com outro time; T4/T7 não precisam se preocupar com isso.

---

### P3 — Uso real de `VersaoAnamnesePadrao`

Existe uma tabela `VersaoAnamnesePadrao` (Segmento + TipoRede → VersaoAnamnese, `_pde/db_map/schema/tables.yaml:13492-13505`) sem uso confirmado dentro de `AnamneseVirtualManager.cs` — pode ser um mecanismo de fallback usado em outro fluxo (cadastro/rematrícula) fora do caminho já investigado.

**Pergunta:** essa tabela precisa ser considerada na resolução da versão da Anamnese (T3/T4), ou é legado morto/fora do escopo desta entrega?

**Resposta:** Desconsiderar `VersaoAnamnesePadrao` neste desenvolvimento — resolução da versão via `RedeSerieVersaoAnamnese` apenas, sem essa tabela.

---

### P4 — Mecanismo de inserção da opção "Falecido(a)" (CA-22)

Não existe tela de cadastro de `OpcaoRespostaAnamnese` no legado — é tabela de dados simples. Recomendação da investigação: script SQL versionado em `cards/EFC-6547/sql/`.

**Pergunta:** aprova essa abordagem (script SQL de dado, sem tela de cadastro), ou há outro mecanismo de carga de dados de referência da Anamnese que devo seguir em vez disso?

**Resposta:** Aprovado — script SQL versionado em `cards/EFC-6547/sql/`, inserindo a opção "Falecido(a)" nas perguntas de relação com mãe/pai.

**Resposta:**

---

## Tarefas

## T1 — Validação de bugs conhecidos e dados de referência

**O que fazer:** Investigar a causa do bug "percentual 100% com dados em branco ao abrir", verificar o andamento do fix de "campo irmão obrigatório mesmo sem irmãos" em outro time, confirmar que a segmentação Regular/Infantil resolve corretamente via `RedeSerieVersaoAnamnese`, e decidir como cadastrar a opção "Falecido(a)" (CA-22).

**Contexto:** Fase 1 do plano técnico (`EFC-6547.tech.md`), infraestrutura/pré-requisito — nenhum código de produto deve ser alterado nesta tarefa, é investigação e checagem.
- Bug do percentual: comparar contra `AnamneseVirtualManager.CalcularPercentualRespondidoAnamnesePessoa` (portal-atlas) — suspeita de divisão por zero silenciosa ou truncamento incorreto (`Decimal.ToInt32`) quando não há perguntas obrigatórias/não-condicionais para a versão do aluno.
- Bug do "irmão obrigatório": provavelmente ligado a `PerguntaAnamnese.RepetivelPeloUsuario` — não há CA associado, é apenas para não sobrepor trabalho de outro time.
- Confirmar que `RedeSerieVersaoAnamnese` resolve a `VersaoAnamnese` correta (Regular = 4 seções / Infantil = 7 seções) para séries de teste reais.
- CA-22 ("Falecido(a)"): decidir se a nova opção em `OpcaoRespostaAnamnese` é inserida via script SQL de dados (`_scripts/`) ou via tela de cadastro do Atlas — é dado, não schema.

**Pronto quando:** Cada um dos 4 pontos acima tem uma conclusão registrada (causa raiz do bug de percentual; status do fix do "irmão obrigatório" e se há conflito; confirmação da segmentação; decisão de como inserir "Falecido(a)").

**Status:** concluída

**Notas de execução (2026-08-19):**

1. **Bug do percentual "100% com dados em branco":** causa raiz confirmada por leitura de `AnamneseVirtualManager.CalcularPercentualRespondidoAnamnesePessoa` (portal-atlas, linhas 407-447) — **não é divisão por zero** (`decimal 0m/0m` lançaria `DivideByZeroException`, não retornaria 100 silenciosamente). A causa real é a **dessincronia entre dois campos de percentual**: `AnamnesePessoa.PercentualRespondido` (recalculado a cada save/leitura) vs. `AlunoEscola.PercentualAnamnese` (cache lido sem recálculo pela listagem do Painel do Aluno, `ListagemPainelAlunoService.cs:100`). Confirmado que **hoje nenhum código de produção em `estrutura-pedagogica` escreve em `AlunoEscola.PercentualAnamnese`** (só aparece em fixture de teste) — reforça que a Fase 4 do plano técnico (`AtualizarPercentualAnamnese` na mesma transação do save) é requisito obrigatório, não hipótese.
2. **Bug "irmão obrigatório mesmo sem irmãos":** mecânica provável identificada (`TipoPerguntaEnum.Irmao_Na_Rede`, `PerguntaAnamnese.RepetivelPeloUsuario`, já portado em `estrutura-pedagogica`) — o backend legado não bloqueia save por campo obrigatório vazio, então o bug (se existe) é de UI/UX, não de validação server-side. **Não encontrada nenhuma evidência local (commits/branches/anotações) de correção em andamento por outro time** — só a menção no próprio card Jira, sem número de card/branch associado. Recomendação: perguntar diretamente ao Jira/outro time o número do card antes de tocar em `RepetivelPeloUsuario` ou nas perguntas do grupo "Família" ligadas a `Irmao_Na_Rede`.
3. **Segmentação Regular/Infantil:** confirmado por código (`RedeSerieVersaoAnamnese` → `VersaoAnamnese` → grupos via `PerguntaVersaoAnamnese`), mas **sem garantia de unicidade documentada** (schema/db_map não lista índice único de `RedeSerieVersaoAnamnese` ativa por série). **Achado novo, fora do escopo do card original:** o legado também filtra seções visíveis por `PerfilAcesso` do usuário logado (`GrupoPerguntaPerfilAcesso`, via `validarGrupoPorPerfilAcesso=true` em `AnamneseVirtualManager.cs:825-834`) — essa entidade **não está portada** em `estrutura-pedagogica`. Existe ainda uma tabela `VersaoAnamnesePadrao` (Segmento+TipoRede→VersaoAnamnese, `_pde/db_map/schema/tables.yaml:13492-13505`) cujo uso não foi confirmado como ativo. **Decisão pendente com produto:** replicar o filtro por perfil de acesso na nova aba ou descartá-lo deliberadamente (RBAC novo é binário: visualizar/editar).
4. **Cadastro de "Falecido(a)" (CA-22):** não existe tela/CRUD de `OpcaoRespostaAnamnese` no legado — é tabela de dados simples (`PerguntaAnamneseId`, `Nome`, `Unica`, `Ordem`). Recomendação: script SQL versionado em `cards/EFC-6547/sql/` (padrão do workspace), inserindo a opção nas perguntas de relação com mãe/pai — sem necessidade de tela de cadastro.

**Riscos novos identificados (fora do plano técnico original, avaliar com produto antes da Fase 4/7):** filtro de seções por `PerfilAcesso` do legado não portado; card/branch do fix "irmão obrigatório" não localizado localmente.

---

## T2 — Domain: DTOs e contratos

**O que fazer:** Criar os DTOs de request/response da Anamnese em `Domain/DTO/PainelAluno/`.

**Contexto:** Fase 2 do plano técnico — infraestrutura, suporta CA-01, CA-02, CA-15. Seguir a nomenclatura de `AtendimentoResponse.cs`/`SalvarAtendimentoRequest.cs`. Nenhuma entidade nova — todas as tabelas/entidades (`AnamnesePessoa`, `VersaoAnamnese`, `PerguntaVersaoAnamnese`, `GrupoPerguntaAnamnese`, `OpcaoRespostaAnamnese`, `PerguntaAnamneseCondicionalOpcaoResposta`, `RedeSerieVersaoAnamnese`, `TipoRespostaAnamneseEnum`) já existem em Domain/Infra. Criar: `AnamneseResponse.cs`, `GrupoAnamneseResponse.cs`, `PerguntaAnamneseResponse.cs`, `OpcaoAnamneseResponse.cs`, `SalvarAnamneseRequest.cs`, `RespostaAnamneseRequest.cs`. Depende de T1 (decisão sobre CA-22 pode afetar `OpcaoAnamneseResponse`).

**Pronto quando:** Projeto compila sem erros com os DTOs novos.

**Status:** concluída

**Notas de execução (2026-08-19):** 6 DTOs criados em `backend/EstruturaPedagogica.Domain/DTO/PainelAluno/`: `AnamneseResponse` (`PercentualRespondido` + `Grupos`), `GrupoAnamneseResponse` (`Hash`/`Nome`/`AwesomeIcon`/`Ordem`/`Perguntas`), `PerguntaAnamneseResponse` (definição + resposta atual combinadas numa só classe — diferente de Atendimento, pois Anamnese é registro único editável por aluno, não log de eventos imutável), `OpcaoAnamneseResponse`, `SalvarAnamneseRequest` (estende `DadosDoAlunoRequest`, mesmo padrão de `SalvarAtendimentoRequest`), `RespostaAnamneseRequest`. `dotnet build` do `EstruturaPedagogica.Domain`: 0 erros.

**Decisões tomadas sem precedente exato em Atendimento (a confirmar em T4/T7):**
- `RespostaNumerica` é `decimal?` (não `RespostaInteiro`/`int?` como em Atendimento) — segue o tipo real de `AnamnesePessoaResposta.RespostaNumerica`.
- Adicionado `HashAlunoEscolaMesmoResponsavel` (`Guid?`) para suportar `TipoRespostaAnamneseEnum.AlunoComMesmoResponsavel` (sem isso esse tipo de resposta não teria como ser representado).
- **Não incluídos:** `InformacaoAdicional`, `SufixoResposta`, `MascaraResposta`, `MultiplaSelecaoResposta`, `RepetivelPeloUsuario` (em `PerguntaAnamnese`) e `EhNecessidadeEspecial` (em `OpcaoRespostaAnamnese`) — campos reais que provavelmente importam para a renderização do frontend (T7), mas ficaram fora do escopo literal desta tarefa. **Avaliar na T7** se algum deles precisa ser adicionado aos DTOs (ex.: `RepetivelPeloUsuario` é relevante para "Outro(a) Irmão(a)"/especialistas com botão "+", mesmo com o bug relacionado fora de escopo).
- `HashOpcaoGatilho` simplificado para um único `Guid?` (igual Atendimento) — o modelo real (`PerguntaAnamneseCondicionalOpcaoResposta`) é mais rico (suporta gatilho por pergunta binária e por "opção diferente de", não só "opção igual a"). Pode precisar de DTO mais rico na T3/T4 se essa riqueza for necessária.

---

## T3 — Domain: repositórios (interfaces + Infra)

**O que fazer:** Adicionar métodos de query em `IAnamnesePessoaRepository`, `IAnamnesePessoaRespostaRepository`, `IAnamnesePessoaRespostaOpcaoRepository`, `IPerguntaVersaoAnamneseRepository`, `IRedeSerieVersaoAnamneseRepository` (e implementações Infra correspondentes).

**Contexto:** Fase 3 do plano técnico — infraestrutura. Hoje esses repositórios só têm CRUD genérico herdado. `IPerguntaVersaoAnamneseRepository` deve projetar grupos/perguntas/opções de uma `VersaoAnamnese` via `.Select()` (substitui a view SQL `ViewPerguntaVersaoAnamneseComRespostas` do portal-atlas — aqui é composição em C#, não view). Depende de T2 (DTOs de retorno).

**Pronto quando:** Os métodos novos retornam os dados esperados para uma versão/aluno de teste.

**Status:** concluída

**Notas de execução (2026-08-19):** 5 métodos implementados (interface + Infra), `dotnet build` de `EstruturaPedagogica.Infra`: 0 erros.
1. `IRedeSerieVersaoAnamneseRepository.GetVersaoAnamneseIdPorRedeSerie(int redeSerieId) : Task<int?>`
2. `IPerguntaVersaoAnamneseRepository.GetGruposPorVersao(int idVersaoAnamnese) : Task<List<GrupoAnamneseResponse>>` — projeção `.Select()` sem `.Include()`, agrupamento em memória após query única.
3. `IAnamnesePessoaRepository.GetPorPessoaVersao(int pessoaId, int versaoAnamneseId) : Task<AnamnesePessoa>`
4. `IAnamnesePessoaRespostaRepository.GetAtivasPorAnamnesePessoa(int idAnamnesePessoa) : Task<List<AnamnesePessoaResposta>>`
5. `IAnamnesePessoaRespostaOpcaoRepository.GetAtivasPorAnamnesePessoa(int idAnamnesePessoa) : Task<List<AnamnesePessoaRespostaOpcao>>`

**Ajustes vs. assinatura sugerida (confirmados por leitura das entidades reais):**
- **#1** recebe `redeSerieId`, não `serieId` — `RedeSerieVersaoAnamnese.RedeSerieId` é FK direta para `RedeSerie` (entidade própria, chave Rede+Serie+Agrupamento+AnoLetivo), não para `Serie`. **Resolver `RedeSerieId` a partir do `AlunoEscola`/`EscolaSerie` do aluno (join via `Escola.Rede`) fica para a T4 (service)** — não é responsabilidade do repositório.
- **#3** recebe `pessoaId` + `versaoAnamneseId`, não `alunoEscolaId`/`anoLetivoId` — `AnamnesePessoa` só tem `PessoaId`+`VersaoAnamneseId`, sem vínculo direto a `AlunoEscola`/`AnoLetivo`.
- **`HashOpcaoGatilho` (item #2):** projetado só a partir do gatilho "opção igual a" (`OpcaoRespostaIgual`) — o modelo real (`PerguntaAnamneseCondicionalOpcaoResposta`) também suporta gatilho por pergunta binária e "opção diferente de", que **não são representáveis** com o DTO atual (`Guid? HashOpcaoGatilho` único). Mesma limitação já registrada em T2 — avaliar em T7 se algum CA precisa desses outros dois formatos de gatilho.

**Observação para T4:** a resolução `AlunoEscola → EscolaSerie → Escola → Rede → RedeSerie → VersaoAnamnese` (cadeia completa para ir de um aluno até sua versão de Anamnese) ainda não existe em nenhuma camada — precisa ser montada no `AnamneseGetService`/`AnamneseSaveService`.

---

## T4 — Domain.Services: leitura, gravação e percentual

**O que fazer:** Implementar `AnamneseGetService`, `AnamneseSaveService` e o método `AlunoEscolaService.AtualizarPercentualAnamnese(...)`.

**Contexto:** Fase 4 do plano técnico — CA-01, CA-15, CA-16, CA-19. Seguir `.claude/commands/criar-service.md`. Depende de T1 (causa raiz do bug de percentual), T2, T3.
- `AnamneseGetService`: resolve `VersaoAnamnese` por série do aluno, monta grupos/perguntas/opções com respostas salvas, calcula percentual (perguntas não-condicionais + obrigatórias, respondidas/total, truncado — replicar fielmente a fórmula do portal-atlas), aplica `PodeVisualizarAnamnese`.
- `AnamneseSaveService`: aplica `PodeEditarAnamnese`; persiste via Insert/Update/Disable; **replica a lógica de diff do portal-atlas** — toda resposta ativa no banco cuja pergunta não veio mais no payload de save é inativada (é o mecanismo real de limpar campo condicional ao desmarcar o gatilho); recalcula percentual e persiste em `AnamnesePessoa.PercentualRespondido`.
- `AlunoEscolaService.AtualizarPercentualAnamnese`: análogo a `AtualizarTotaisAtendimentos`, grava `AlunoEscola.PercentualAnamnese` na mesma transação do save — os dois campos de percentual precisam ficar sincronizados.

**Pronto quando:** É possível buscar e salvar a anamnese de um aluno de teste, com percentual calculado corretamente em ambos os campos e RBAC respeitado.

**Status:** concluída

**Notas de execução (2026-08-19):** `dotnet build EstruturaPedagogica.sln`: 0 erros.

**Criados:** `AnamneseGetService`/`IAnamneseGetService`, `AnamneseSaveService`/`IAnamneseSaveService`, `AnamnesePercentualCalculator` (helper `static`, não service DI — cálculo puro compartilhado entre Get/Save).
**Alterados:** `AlunoEscolaInternalResponse` (+`RedeSerieId`/`Hash`), `IAlunoEscolaRepository`/`AlunoEscolaRepository` (+`GetResponseParaAnamnese`, `GetPorHashesParaAnamnese`, `GetPorIdsParaAnamnese`), `IAlunoEscolaService`/`AlunoEscolaService` (+`AtualizarPercentualAnamnese`, replica `AtualizarTotaisAtendimentos`: só atualiza quem mudou, `Update(List<T>)` em lote), `SalvarAnamneseRequest` (+ campos internos `[JsonIgnore]` `PessoaId`/`AlunoEscolaId`/`VersaoAnamneseId`).

**Cadeia aluno→VersaoAnamnese resolvida:** `AlunoEscola.TurmaId → Turma.EscolaSerieId → EscolaSerie (Rede/Serie/Agrupamento/AnoLetivo) → RedeSerie (mesmos 4 ints) → RedeSerieVersaoAnamnese.VersaoAnamneseId`, numa única query correlacionada dentro de `GetResponseParaAnamnese` (sem `.Include()`). `RedeSerieId == 0`/sem versão vinculada é tratado como "série sem Anamnese configurada" (resposta vazia no Get, erro amigável no Save), não como erro de sistema.

**Diff/inativação:** a cada save, TODAS as respostas ativas são inativadas (`Disable`, em lote) e uma linha nova é inserida para cada pergunta presente no payload — pergunta ausente (campo condicional oculto no frontend) simplesmente não é reinserida, o que already resolve "limpar o valor antigo". Insert sempre via overload `List<T>` (estampa auditoria/Hash por item), nunca via grafo aninhado — evita repetir o bug de produção já visto em `AtendimentoSaveService`.

**Achado de correção:** `AlunoEscolaMap.cs` mapeia `AlunoEscola` com `IsStatefulEntity(hasId: false, hasState: false)` — os métodos CRUD genéricos (`Get`/`GetByHash`) não funcionam nessa entidade (propriedade `Ativo` é ignorada no mapping). Os métodos novos usam `QueryableValidos()` do próprio repositório em vez da base genérica.

**Decisões sem precedente exato (a confirmar):**
- **[AJUSTADO 2026-08-19]** `AnamneseSaveService.Save` foi alterado para retornar `ServiceResult<AnamneseResponse>` (decisão do usuário — opção 2, evitar round-trip extra do frontend), diferente do padrão `ServiceResult<bool>` de `AtendimentoSaveService`/`OcorrenciasSaveService`. Implementado injetando `IAnamneseGetService` no `AnamneseSaveService` e chamando `GetDoAluno(request)` (via `SalvarAnamneseRequest : DadosDoAlunoRequest`) após persistir, reaproveitando toda a lógica de fusão de respostas/cálculo de percentual do Get em vez de duplicá-la. `dotnet build EstruturaPedagogica.sln`: 0 erros.
- `AtualizarPercentualAnamnese` recebe o percentual já calculado como parâmetro (não recalcula internamente) — evita duplicar a resolução aluno→versão dentro de `AlunoEscolaService`.
- Resposta com `HashPergunta` que não bate com nenhuma pergunta da versão do aluno é **erro de validação bloqueante** ("Pergunta inválida"), não descartada silenciosamente (diferente de Atendimento).
- Percentual com zero perguntas elegíveis (obrigatórias e não-condicionais) retorna **0**, não 100 — caso de borda não especificado no card.
- Disable+Insert ocorre em toda pergunta do payload mesmo sem mudança de valor (gera histórico extra a cada save) — trade-off aceito por simplicidade/robustez.

---

## T5 — API: endpoints em PainelAlunoController

**O que fazer:** Adicionar os endpoints `GetAnamnese` e `SalvarAnamnese` ao `PainelAlunoController`.

**Contexto:** Fase 5 do plano técnico — CA-01, CA-15, CA-16, CA-17. Mesmo controller dos demais (padrão dos endpoints de Atendimento), `[FromServices]` para os novos services, `/// <summary>` obrigatório. Depende de T4.

**Pronto quando:** Os 2 endpoints respondem corretamente via chamada HTTP, respeitando RBAC.

**Status:** concluída

**Notas de execução (2026-08-19):** Endpoints `getanamnese` (POST, `DadosDoAlunoRequest`) e `salvaranamnese` (POST, `SalvarAnamneseRequest`, dentro de `_unitOfWork.Execute`, mesmo padrão de `salvaratendimento`) adicionados em `PainelAlunoController.cs`, com `/// <summary>` e `[ApiExplorerSettings(IgnoreApi = false)]`. Nenhum `using` novo necessário (namespaces já importados via Atendimento). `dotnet build EstruturaPedagogica.Api`: 0 erros, 0 avisos.

---

## T6 — Frontend: componente de accordion novo

**O que fazer:** Criar o componente de accordion da Anamnese (seção com título, ícone, contador "1 de N", expand/collapse independente por seção).

**Contexto:** Fase 6 do plano técnico — CA-03, CA-20. Não existe shared/dynamic accordion no design system (Atendimento usa HTML/CSS cru, decisão deliberada de não seguir esse padrão aqui). Avaliar `mat-accordion` (se Angular Material já é dependência do projeto) vs. custom. Primeira seção expandida por padrão, demais recolhidas.

**Pronto quando:** O componente renderiza N seções dinâmicas com título/ícone/contador, primeira aberta por padrão, e permite expandir/recolher livremente.

**Status:** concluída

**Notas de execução (2026-08-19):** `AnamneseAccordionComponent` (`app-anamnese-accordion`) criado em `frontend/src/app/features/painel-aluno/ficha/tabs/anamnese-tab/anamnese-accordion/`. `@Input() secoes` (ordena por `ordem` no setter); conteúdo de cada seção via content projection (`<ng-template let-secao let-index="index" #secaoTemplate>`, resolvido por `@ContentChild(TemplateRef)` + `*ngTemplateOutlet` — T7 vai plugar o formulário real). Estado de expansão via `CdkAccordion`/`CdkAccordionItem` (`@angular/cdk/accordion`, já dependência do projeto — não precisou instalar nada), com `multi` (todas as seções podem ficar abertas simultaneamente, conforme CA-03: "usuário pode expandir/recolher qualquer seção livremente"). Primeira seção (`i === 0`, já ordenada) começa expandida. `npx tsc --noEmit`: sem erros nos arquivos novos (não rodou `ng build` completo, respeitando preferência já registrada do usuário de não rodar build/lint/test).

**Achado importante (contradiz uma premissa do plano técnico):** já existe um componente compartilhado `AccordionComponent`/`AccordionGroupComponent` em `frontend/src/shared/components/accordion/` (`app-accordion`, NgModule-based via `SharedModule`, usado hoje em `componentes-showcase`). A afirmação original de que "não existe nenhum shared/dynamic accordion component" estava incorreta — porém esse componente é um primitivo de item único (`title` como `string` simples, `expanded`/`expandedToggle` como input/output controlados externamente, sem slot de cabeçalho projetável) — **não suporta ícone nem contador de posição no cabeçalho sem modificação**, e o estado de "qual está aberta" teria que ser gerenciado manualmente pelo componente pai via `*ngFor`. Decisão tomada (pela execução, não pelo usuário ainda): **não alterar o componente compartilhado** (evita blast radius em outras telas que já o usam) e manter o `AnamneseAccordionComponent` dedicado, espelhando o padrão visual dele (chevron `material-icons-outlined`, transição via `grid-template-rows`) para consistência.

**Ponto de atenção para T7/T8:** `fa-icon` (usado para o ícone de cada seção, `GrupoAnamneseResponse.AwesomeIcon`) depende de ícones pré-registrados na `FaIconLibrary` (hoje só tem `faCircleInfo`/`faInfo` registrados no `SharedModule`) — qualquer `awesomeIcon` vindo do backend que não esteja registrado **falha silenciosamente** (sem erro visível, só warning no console). Será necessário registrar os ícones reais dos grupos de Anamnese (ou usar `iconPacks`) antes de ir para produção.

**[RESOLVIDO 2026-08-19]** Valores reais de `AwesomeIcon` confirmados via query direta em `AnamneseVirtual.GrupoPergunta` (portal-atlas) — vêm como classe CSS completa (`"fas fa-users"`), não como nome isolado. Registrados em `shared.module.ts` (`faUsers`, `faTableTennis`, `faChalkboardTeacher`, `faChild`, `faBed`, `faUtensils`, `faBrain`, `faToiletPaper`, `faComment` — 9 ícones cobrindo os 11 grupos, "Família"/"Família e Histórico" e "Comportamento" repetem ícone entre segmentos). Adicionado `AnamneseAccordionComponent.parseIcon()` para converter `"fas fa-users"` → `['fas', 'users']` (formato exigido pelo `[icon]` do `fa-icon`) — o binding original (`['fas', secao.awesomeIcon]`) quebraria com o valor real. `npx tsc --noEmit`: sem erros. **Pendência residual anotada para validação final:** confirmar visualmente (rodando a app) que os 9 ícones renderizam corretamente nas 11 seções reais, já que essa verificação não foi feita em navegador nesta etapa.

**[BUG CORRIGIDO 2026-08-19 — reportado pelo usuário em runtime]** `NG0100 ExpressionChangedAfterItHasBeenCheckedError` em `anamnese-accordion.component.html:7` (`[class.anamnese-accordion__item--open]="item.expanded"`, valor mudando de `false` para `true` depois do check). Causa: ler `item.expanded` (propriedade exportada do `CdkAccordionItem`, `#item="cdkAccordionItem"`) diretamente no binding de classe do próprio elemento host do `cdk-accordion-item` corre risco de reentrância — a diretiva pode atualizar esse valor internamente após o binding já ter sido checado no mesmo ciclo. Corrigido substituindo toda leitura de `item.expanded` no template por um `Set<string>` de hashes expandidos mantido pelo próprio `AnamneseAccordionComponent` (`estaExpandida(hash)`), sincronizado via `(expandedChange)="onExpandedChange(secao.hash, $event)"` (evento, não leitura direta) — inicializado com a primeira seção no setter de `secoes`. `item.toggle()` continua disparado pelo clique do cabeçalho, agora só como gatilho; a leitura de estado para exibição nunca mais lê `item.expanded` diretamente. `npx tsc --noEmit`: sem erros.

**Nota — erro não relacionado reportado junto:** o mesmo log trouxe um NG0100 em `dados-pessoais-aluno.component.html:24` (`DadosPessoaisAlunoComponent`) — componente fora do escopo desta aba/card, não tocado por nenhuma fase do EFC-6547. Não corrigido (fora de escopo); reportar separadamente se for perseguir.

---

## T7 — Frontend: formulário por segmento e campos condicionais

**O que fazer:** Implementar `anamnese-tab.component.ts/.html/.scss` (hoje placeholder), consumindo os grupos/perguntas do backend e usando o accordion de T6.

**Contexto:** Fase 7 do plano técnico — CA-02, CA-04 a CA-14, CA-22. Depende de T5 e T6.
- `FormGroup` único criado uma vez, populado dinamicamente a partir da resposta de `GetAnamnese` — variação Regular/Infantil vem inteiramente do backend, não hardcoded no componente.
- Mapear `TipoRespostaAnamneseEnum` para os campos de formulário genéricos do design system (mesmo padrão de resolução por tipo usado em Atendimento para os Norteadores).
- Campos condicionais: exibir/ocultar via lógica equivalente a `perguntaVisivel()` — **crítico:** ao ocultar, remover o controle do payload de save (não só do template), pois o backend limpa por ausência no payload.
- CA-22: opção "Falecido(a)" só precisa aparecer na lista de opções, sem lógica de condicional adicional.

**Pronto quando:** O formulário completo (Regular e Infantil) renderiza, aceita preenchimento e respeita os campos condicionais (exibição e remoção do payload).

**Status:** concluída

**Notas de execução (2026-08-19):**

**Alteração pontual no backend (pré-requisito descoberto nesta fase):** `PerguntaAnamneseResponse.MultiplaSelecaoResposta` (bool) adicionado ao DTO e à projeção de `PerguntaVersaoAnamneseRepository.GetGruposPorVersao` — o `TipoRespostaAnamneseEnum` não distingue seleção única vs múltipla para `Sexo`/`ListaOpcoes` (diferente de Atendimento, que tem enums separados); a distinção real vem desse campo da entidade, omitido na T2. `dotnet build EstruturaPedagogica.Api`: 0 erros.

**Frontend:** tipos e métodos de service adicionados adiantados (`models.ts`, `painel-aluno.service.ts: getAnamnese/salvarAnamnese`) — parte do que a T8 também cobre, necessário aqui para o componente buscar/salvar dados reais; T8 agora foca só em RBAC/erro inline/toast/troca de ano letivo reativa (ver nota na própria T8). `anamnese-tab.component.ts/.html/.scss` implementado: `FormArray respostas` único (nunca recriado), achatando `grupos.flatMap(perguntas)`, `Map<hash, índice>` para lookup; `perguntasDoGrupo(hashGrupo)` resolve o casamento com o accordion (T6) sem alterar o componente de accordion. `perguntaVisivel()` replica exatamente `AtendimentoTabComponent.perguntaVisivel()`; `salvar()` filtra o payload por esse mesmo método antes de montar o request — campo condicional oculto não é enviado. `npx tsc --noEmit`: sem erros novos.

**Pendências explícitas registradas (fora de escopo desta fase, para acompanhamento):**
- **Perguntas repetíveis** (`PerguntaAnamnese.RepetivelPeloUsuario` — "Outro(a) Irmão(a)" com "+", múltiplos especialistas) — não exposto no DTO, renderizado como instância única. Requer modelagem de múltiplas respostas por pergunta — extensão de escopo real, não coberta.
- **`AlunoComMesmoResponsavel`** — sem componente de seleção de aluno no design system; renderizado como `app-select-field` com opções vazias (placeholder).
- Sem máscara real para `Telefone`/`Celular`/`Mascara` (campo de texto simples).

**[ATUALIZADO 2026-08-19 — alinhamento com design encontrado]** Localizado `cards/EFC-6546/claude_design/painel-aluno/AnamneseTab.jsx` (mock de design não vinculado ao card até então). Reimplementado o mapeamento de widgets para seguir o mock: `SimNao` e `Sexo`/`ListaOpcoes` de seleção única com ≤8 opções → **radio inline** (antes: `app-select-field`); `Sexo`/`ListaOpcoes` de seleção múltipla → **checkboxes inline** (antes: `app-multi-select-field`, que também tinha o bug de recorte pelo `overflow` do accordion). Dropdown nativo mantido só para seleção única com >8 opções (caso de Disciplina) e para `DisciplinasAluno`/`AlunoComMesmoResponsavel` (inalterados, fora de escopo). `npx tsc --noEmit`: sem erros novos.

**Decisão registrada:** existe um componente pronto `app-radio-field` (`shared/dynamic-components/radio-field/`) que **não foi usado** — ele espera o control com valor escalar (`[value]="opt.hash"` via `[formControl]` nativo), mas `hashesOpcoesSelecionadas` é sempre array nesta implementação (inclusive para seleção única, correção deliberada de um bug de pré-seleção que também afeta o dropdown de Disciplina — resposta única salva não vinha marcada ao carregar, pois o control é populado como array mas `app-select-field` esperava escalar). Usar `app-radio-field` exigiria diferenciar o formato do control por tipo de pergunta em `criarGrupoResposta()`/`salvar()`, fora do escopo pedido nesta rodada — radio/checkbox foram implementados manualmente (`[checked]`/`(change)`) para manter os dois formatos consistentes entre si.

**Pendência não resolvida (não foi pedida nesta rodada, mantida em aberto):** "Irmão(ã) na Rede" no mock é um campo **desabilitado**, com lista somente-leitura de irmãos identificados automaticamente na Rede — não implementado; continua tratado como pergunta editável normal (agora como radio, mas com a mesma semântica de antes).

---

## T8 — Frontend: persistência, permissões, erro inline, toast e ano letivo

**O que fazer:** Ligar o formulário ao backend — carregamento, salvamento, RBAC, erro inline, toast e recarga por troca de ano letivo.

**Contexto:** Fase 8 do plano técnico — CA-16, CA-17, CA-18, CA-19, CA-21. Depende de T7.
- `painel-aluno.service.ts`: `getAnamnese`/`salvarAnamnese`. `models.ts`: tipos novos (`podeVisualizarAnamnese`/`podeEditarAnamnese` já existem, sem alteração).
- `ficha.component.html:160`: passar `[request]` (e inputs equivalentes ao padrão de `atendimento-tab`) para `<app-anamnese-tab>`.
- `@Input request` + `ngOnChanges` + `Subject trocaRequest$` + `takeUntil` para cancelar requests obsoletos na troca de Ano Letivo (CA-19).
- Botão "Salvar Anamnese" condicionado a `podeEditarAnamnese` (CA-17).
- **Erro inline (CA-18) é tratamento novo** — não reaproveitar o padrão genérico de Atendimento (sem inline por campo); manter o `FormGroup` intacto em caso de erro.
- Sucesso: toast (CA-21) + atualização do indicador de percentual (CA-01/CA-16) com o valor retornado pelo save.

**Pronto quando:** É possível carregar, editar, salvar (com sucesso e com erro simulado) e trocar de ano letivo, respeitando permissões e sem perda de dados em erro.

**Status:** concluída

**Notas de execução (2026-08-19):**
- **`[request]` na ficha:** usa `requestBase` (não `requestParaAtendimento`) — `requestBase` é recalculado em `atualizarRequestBase()` a partir do `hashAnoLetivo` corrente da ficha (CA-19: "ano letivo do cabeçalho"); `requestParaAtendimento`/`requestOcorrencias` são movidos por um seletor de ano-turma **restrito** a essas duas abas (Documentos já opta por não usar esse seletor e também usa `requestBase` — Anamnese segue o mesmo padrão).
- **`trocaRequest$`:** adicionado, `.next()` no início de `ngOnChanges`, `takeUntil(trocaRequest$)` nas 3 chamadas HTTP (`getAnamnese`, `salvarAnamnese`, `getDisciplinasAtendimento`) — mesmo padrão de `AtendimentoTabComponent`.
- **Gating (CA-17):** `get podeEditarAnamnese()` via `PainelAlunoStateService`; bloco `.form-acoes` (botão Salvar) só renderiza com `*ngIf="podeEditarAnamnese"` — botão **removido do DOM**, não só desabilitado; campos do formulário continuam visíveis/navegáveis sem a permissão (sem modo leitura separado, conforme o card).
- **Erro inline (CA-18):** `erroSalvar` (string, limpo no início de cada `salvar()`), setado via `extrairMensagemErro()` (mesmo helper de `OcorrenciasTabComponent`, já que `HandleApiError` no backend expõe array de erros com `.message`); `aplicarAnamnese()`/`respostas.clear()` **nunca** chamados no caminho de erro — formulário permanece intacto. Exibido no template com classe `.form-erro` (mesmo padrão visual de `ocorrencias-tab.component.scss`).
- **Toast (CA-21):** `NotificationService.showSuccess(result.message || 'Anamnese salva com sucesso.')` no `next` de sucesso, após `aplicarAnamnese`.
- `npx tsc --noEmit`: sem erros novos.

**[BUG CORRIGIDO 2026-08-19 — reportado pelo usuário em runtime]** `GetAnamnese` falhava com `Unable to cast object of type 'System.Int16' to type 'System.Int32'`. Causa raiz: mesma classe de bug já documentada na feature irmã Atendimento (`EFC-6546`) — colunas `smallint`/`tinyint` do schema `AnamneseVirtual` mapeadas como `int` no EF Core sem `.HasColumnType(...)`. Confirmado via `sys.columns`/`sys.types` (MCP `sqlserver`, `execute_query` — consulta de dado/metadado, não exploração de schema via `describe_table`):
- `VersaoAnamnese.Id` → `smallint` (`VersaoAnamneseMap.cs`)
- `AnamnesePessoa.VersaoAnamnese` (FK) → `smallint` (`AnamnesePessoaMap.cs`)
- `PerguntaVersaoAnamnese.VersaoAnamnese` (FK) e `Ordem` → `smallint` (`PerguntaVersaoAnamneseMap.cs`)
- `RedeSerieVersaoAnamnese.VersaoAnamnese` (FK) → `smallint` (`RedeSerieVersaoAnamneseMap.cs`)
- `GrupoPergunta.Ordem` → `tinyint` (`GrupoPerguntaAnamneseMap.cs`)

Todas as 5 corrigidas com `.HasColumnType("smallint"|"tinyint")`. Verificado (via `sys.columns`) que `OpcaoRespostaAnamnese`, `PerguntaAnamnese`, `AnamnesePessoaResposta`, `AnamnesePessoaRespostaOpcao`, `PerguntaAnamneseCondicionalOpcaoResposta`, `Disciplina`, `AlunoEscola` e a cadeia `RedeSerie/EscolaSerie/Escola/Rede/Serie/Agrupamento/AnoLetivo/Turma` (colunas usadas pela nossa query) não têm outros mismatches — só `Rede.IdRedeGestaoEleva` e `Turma.Alunos/Condicao` são `smallint`/`tinyint`, mas não são tocados pela cadeia da Anamnese, fora de escopo. `dotnet build EstruturaPedagogica.Infra`: 0 erros. Build da API não confirmado neste momento — `.dll` bloqueado pelo processo local do backend do usuário (mesmo padrão de lock de IIS Express já visto em EFC-6546); usuário precisa reiniciar o processo local para recompilar e validar em runtime.

**[BUG CORRIGIDO 2026-08-19 #2 — reportado pelo usuário em runtime]** Após reiniciar o backend, `GetAnamnese` passou a falhar com `Invalid column name 'Hash'` (4x) e `Invalid column name 'PerguntaAnamnese'` (1x). Causa raiz, confirmada via `sys.columns` num dump completo do schema `AnamneseVirtual`: **quase todas as tabelas legadas desse schema nunca tiveram coluna `Hash`** — mesma causa raiz já resolvida em EFC-6546 (`GrupoPergunta`, `OpcaoResposta`, `Pergunta`, `PerguntaCondicionalOpcaoResposta`, `PerguntaTipoPergunta`, `PerguntaVersaoAnamnese`, `PerguntaVersaoAnamneseTipoPergunta`, `TipoPergunta`, `VersaoAnamnese`, `RedeSerieVersaoAnamnese`, `AnamnesePessoaRespostaOpcao` — 11 tabelas; só `AnamnesePessoa`, `AnamnesePessoaResposta`, `PerguntaVersaoAnamneseTipoPerguntaOpcaoResposta` e `VersaoAnamnesePadrao` já tinham `Hash`). Os mappings C# (`IsBaseEntity()`/`IsStatefulEntity()`, default `hasHash: true`) sempre esperam essa coluna.

Além disso, achado um segundo bug real de nome de coluna (a causa do "Invalid column name 'PerguntaAnamnese'"): `OpcaoRespostaAnamneseMap.cs` e `PerguntaAnamneseTipoPerguntaMap.cs` usavam `.HasColumnName("PerguntaAnamnese")`/`"TipoPerguntaAnamnese"` para as FKs — a coluna real (tabelas `OpcaoResposta`/`PerguntaTipoPergunta`) é só `"Pergunta"`/`"TipoPergunta"` (sem o sufixo "Anamnese", que só existe no nome da classe C#, não no banco). Também corrigido `PerguntaAnamnese.TipoResposta` (coluna real `tinyint`, mesma classe de bug de cast do `#1`).

**Correção aplicada, seguindo exatamente o precedente de `EFC-6546-hash-tabelas-legadas-atendimento.sql`:**
- Script `cards/EFC-6547/EFC-6547-hash-tabelas-anamnese.sql` (repositório `pde_salta`) — `ALTER TABLE ... ADD [Hash] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID()` + `UNIQUE` constraint nas 11 tabelas, preenchendo automaticamente um Hash único por linha já existente (sem etapa manual de backfill). **Ainda não executado — precisa ser rodado pelo usuário/DBA em homolog/produção antes do `GetAnamnese` funcionar.**
- `OpcaoRespostaAnamneseMap.cs`, `PerguntaAnamneseTipoPerguntaMap.cs`: nomes de coluna corrigidos.
- `PerguntaAnamneseMap.cs`: `TipoResposta` com `.HasColumnType("tinyint")`.
- Nenhum mapping foi alterado para `hasHash: false` — optou-se por seguir o padrão já estabelecido (adicionar a coluna via script a todas as tabelas do módulo, não usar workaround de código), consistente com EFC-6546.

`dotnet build EstruturaPedagogica.Infra`: 0 erros. **Ainda não validado em runtime** — depende da execução do script SQL.

---

## T9 — Testes de integração e E2E

**O que fazer:** Criar os testes de integração backend e os testes E2E Playwright do frontend.

**Contexto:** Fase 9 do plano técnico — cobre todos os CAs, última fase. Depende de T1 a T8 concluídas. Seguir `.claude/commands/criar-testes.md`.
- Backend: `AnamneseGetServiceTests.cs`, `AnamneseSaveServiceTests.cs` em `Test/Integration/Scenarios/PainelAluno/`, reaproveitando fixtures já existentes (`AnamnesePessoaFixture`, `AnamnesePessoaRespostaFixture`, `GrupoPerguntaAnamneseFixture`, `PerguntaVersaoAnamneseFixture`, `RedeSerieVersaoAnamneseFixture` etc.). Cenários mínimos: percentual correto (incl. borda de zero perguntas obrigatórias), RBAC visualizar/editar, diff de inativação de resposta condicional, segmento Regular vs Infantil.
- Frontend: `tests/e2e/painel-aluno/ficha-anamnese.spec.ts`, seguindo `ficha-atendimento.spec.ts`/`permissoes.spec.ts` como modelo, estendendo `helpers.ts`/`mocks.ts`.
- Aguardar aprovação dos cenários de teste antes de criar os arquivos.

**Pronto quando:** Todos os testes passam com `dotnet test` (backend) e `npx playwright test` (frontend E2E).

**Status:** em andamento (backend concluído; E2E frontend ainda pendente)

**Notas de execução — backend (2026-08-19):** Cenários aprovados pelo usuário antes da criação (27 testes). Criados `AnamneseGetServiceTests.cs` (10 testes) e `AnamneseSaveServiceTests.cs` (15 testes) em `Test/Integration/Scenarios/PainelAluno/`; complementado `AlunoEscolaServiceTests.cs` com `#region AtualizarPercentualAnamnese` (2 testes), reaproveitando `CriarCenarioBase()`/`SeedDatabase` já existentes. `dotnet build EstruturaPedagogica.Test`: 0 erros. `dotnet test` (filtro nas 3 classes): **42 passed, 0 failed**, sem necessidade de correção após a primeira rodada. Nenhum bug de produção encontrado durante a escrita.

**Achado relevante (não é bug, é detalhe do grafo de teste):** o `GerarGrafoBase()` precisa compartilhar o mesmo objeto `Agrupamento` (por referência) entre `EscolaSerieFixture` e `RedeSerieFixture` — cada fixture gera um `Agrupamento` aleatório próprio se não for passado explicitamente, e a resolução de `RedeSerie` em `GetResponseParaAnamnese` casa por `RedeId+SerieId+AgrupamentoId+AnoLetivoId` — sem isso, todo teste "com versão configurada" se comportaria silenciosamente como o cenário "série sem versão".

**Falta:** E2E Playwright (`tests/e2e/painel-aluno/ficha-anamnese.spec.ts`) — não solicitado nesta rodada.
