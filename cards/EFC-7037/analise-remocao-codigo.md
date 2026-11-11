# Análise de Remoção de Código — EFC-7037

> Pesquisa realizada em `c:/projects/portal-atlas`. Evidência concreta (path:linha) para cada classificação. "Seguro remover" significa: nenhum consumidor encontrado fora da própria pasta-alvo, em todo o repositório (grep por namespace completo + grep por nomes de classe sem prefixo de namespace).

## Correções pós-execução do item 2 (2026-10-13)

Durante a execução do passo 2 da "Ordem sugerida de execução" (extração/realocação de dependências), duas descobertas corrigiram esta análise:

1. **`WelcomeController.GetDesempenho()`/`GetAvaliacoes(FiltroWelcomeAluno)`** (fora das 5 pastas-alvo!) chamavam diretamente `Domain.PainelAluno.FichaManager.GetDesempenho`/`GetAvaliacoes`, usados pela Home do aluno (`app/viewmodels/Home/welcomeAlunos.js`, rotas `Home_Aluno`/`Home_AlunoSE` em `shell.js:1101-1105`). Isso não tinha sido identificado antes. **Confirmado com o usuário: essa Home do aluno no monolito já está morta/substituída** por `estrutura-pedagogica`.
   - **Correção intermediária:** a primeira tentativa de remover esses 2 métodos quebrou outro consumidor não mapeado: `app/viewmodels/Home/welcomeProfessor.js` também chamava `serviceWelcome.GetDesempenho()`/`GetAvaliacoes(...)`, dentro de um bloco `//#region Home do Aluno` (linhas 441-867 do arquivo original) disparado só para usuários com permissão `Home_AlunoSE` (linha 289-291 do `activate()`). A remoção foi revertida, confirmada com o usuário como também morta, e refeita incluindo esse bloco. **Achado extra que comprova que já estava morto:** esse mesmo bloco de `activate()` também chamava `GetAcessosCanalEleva()`, `GetVolumesPlad()`, `GetNotasAluno()`, `GetFrequenciaAluno()`, `GetComportamentosAluno()` — nenhuma dessas funções JS **nunca existiu** em `welcomeProfessor.js` (nem antes das minhas mudanças) — ou seja, esse trecho já daria `ReferenceError` em runtime para qualquer usuário que caísse nele, há bastante tempo. `GetAtualidade()` (a única que existia) só chamava um endpoint que no backend sempre foi um stub (`return Json(false, ...)`), então removê-la não tem efeito funcional.
   - Resultado final: `WelcomeController.cs` sem `GetDesempenho`/`GetAvaliacoes`/`using` órfão; `welcomeProfessor.js` sem o `#region Home do Aluno` (removidas 427 linhas) e sem o trigger em `activate()`; `app/viewmodels/Home/welcomeAlunos.js` e `app/views/Home/welcomeAlunos.html` substituídos por um stub vazio (a rota `Home_Aluno`/`Home_AlunoSE` continua resolvendo, só não renderiza nada) — a pendência de JS morto mencionada antes está resolvida.
   - Consequência: `PainelAluno/Services/FichaManager.cs` não tem mais nenhum consumidor fora de `PainelAluno_FichaController` (ele próprio candidato à remoção) — `FichaManager.cs` agora é **100% seguro remover**, não apenas parcialmente como a Seção 1 original sugeria (a entrada `DadosAlunoDTO`/`LogUpdateDadosPessoais`/`LogUpdateFotoPessoa` antes listada como "exige extração" deixa de ser necessária, pelo mesmo motivo).
2. **Restrição de ferramental:** `Generated/Domain.cs` (o facade estático `Domain.<Namespace>.<Classe>` usado em todo o código) é gerado por template T4 (`Domain.tt`, "Perlink DDD Generator") — não é código editável à mão com segurança sem o Visual Studio para rodar o "Run Custom Tool". Por isso, **`ViewAlunoParaPainel`/`ViewAlunoParaPainelRepository`/`ViewAlunoParaPainelMap`, `PessoaDocumento`/`PessoaDocumentoDTO`/`PessoaDocumentoRepository`, `TipoDocumentoRepository`, `GrupoDocumento`/`GrupoDocumentoRepository` e `DocumentoManager` foram DEIXADOS NO LUGAR** (decisão do usuário) em vez de movidos para um módulo neutro como a Seção 1 original recomendava. Esses nomes continuam expostos via `Domain.PainelAluno.*` e isso é intencional e permanente — quando a Seção 1 (remoção do Painel do Aluno legado) for executada, a pasta `PainelAluno` **não pode ser apagada por inteiro**: precisa sobreviver como um módulo reduzido contendo só essas 5 classes/famílias (usadas por Home de Enfermaria, Relatório de Status Covid, Ocorrência de Alunos, Medicamentos/Enfermaria, e `EstruturaEscolar.DTOManager`).
3. **Novo arquivo descoberto:** `Eleva.Portal.Web/Controllers/RelatoriosAtendimentosController.cs` (sem prefixo `PainelAluno_`, não estava na Seção 1 original) chama apenas `Domain.PainelAluno.RelatoriosService` — é mais um controller "órfão de prefixo" como `ControleAtendimentoController.cs` e `ProximosPassos_AtendimentoController.cs`, candidato a entrar na lista de "seguro remover" da Seção 1 junto com `PainelAluno/Services/RelatoriosService.cs` quando essa seção for executada.

### O que foi executado nesta passada (item 2 revisado)

- `FiltroPainel.cs` e `FiltroRelatorio.cs` movidos de `PainelAluno/Filtros/` para `EstruturaEscolar/Filtros/` (namespace `Eleva.Portal.EstruturaEscolar.Filtros`, mesmo padrão já usado por `PainelProfessorFiltro.cs` nessa pasta). `using` atualizado em ~30 arquivos consumidores (dentro e fora de `PainelAluno`); 4 `using` mortos removidos (`PainelProfessor/IFichaManager.cs`, `PainelProfessor/IDesempenhoPoaService.cs`, `PainelAluno/DTO/ServicoDTO.cs`, `AnamneseVirtual/ILinkAnamneseManager.cs`); 6 arquivos que usam `FiltroControleAtendimento`/`FiltroProximosPassosAtendimento` (que permanecem em `PainelAluno.Filtros`) não foram tocados. `.csproj` atualizado (entradas movidas de `PainelAluno\Filtros\*` para `EstruturaEscolar\Filtros\*`).
- `WelcomeController.cs`: removidos os métodos `GetDesempenho()`/`GetAvaliacoes(FiltroWelcomeAluno)` (dead code confirmado) e o `using` órfão.
- `welcomeProfessor.js`: removido o `#region Home do Aluno` inteiro (427 linhas) e o trigger correspondente em `activate()` — dead code confirmado, com evidência independente (chamava funções JS que nunca existiram no arquivo).
- `welcomeAlunos.js`/`welcomeAlunos.html`: substituídos por stub vazio (rota continua existindo, sem conteúdo) — pedido explícito do usuário.
- **`FuncionalidadeEnum.Home_AlunoSE` removido por inteiro** (confirmado pelo usuário: "era de um sistema que não existe mais"). Já estava sinalizado em `FuncionalidadeEnum.cs` dentro do `#region Descontinuadas - Remover código legado` (junto com `Boletim_ConfiguracaoLancamentoNotaEE`/`Boletim_LancamentoNotaEE`, ainda não removidos). Removido de: o enum (`FuncionalidadeEnum.cs`), a rota em `shell.js:1104-1106` (`Home_AlunoSE` → `WelcomeAlunos`), o ternário residual em `welcomeProfessor.js` (`self.DemaisPerfis`), e das listas `[Permissao(new[] {...})]` de 14 controllers/services genéricos onde aparecia como um item entre vários (WelcomeController, UsuariosController, UsuarioVisualizouCampanhaController, TipoQuestaoController, TipoRecorrenciaController, TipoAvaliacaoController, PesquisaDeOpiniaoController, NotificacaoController, MaterialDigitalController, FuncionalidadeController ×5, FotoUsuarioController, ElevaIdController, CampanhasController, PoliticaDeControleDeAcessoService). **Não tocado:** a tabela `Funcionalidade` no banco (linha com esse Id/nome) e eventuais vínculos em `PerfilAcesso` — isso é remoção de dado, segue a regra do projeto de scripts `.sql` manuais, fora do escopo desta sessão.
- **Não executado** (por decisão do usuário, ver restrição #2 acima): mover `ViewAlunoParaPainel*`/`PessoaDocumento*`/`TipoDocumentoRepository`/`GrupoDocumento*`/`DocumentoManager`. Também não foi necessário desacoplar `LogUpdateDadosPessoais`/`LogUpdateFotoPessoa` de `DadosAlunoDTO` (ver achado #1 — ficou obsoleto).

## Correções pós-execução dos passos 3 e 4 (2026-10-13)

### Passo 3 — Controllers de Anamnese: backend concluído, frontend adiado

Executado com segurança:
- Removidos `PainelAluno_AnamneseController.cs`, `PainelMedico_AnamneseController.cs`, `PainelPsicopedagogico_AnamneseController.cs` (+ entradas no `.csproj`).
- Removidos de `AnamneseVirtualManager.cs`/`IAnamneseVirtualManager.cs` os 3 overloads mortos de `GetAnamnesePessoa` (`FiltroPainel`/`FiltroPainelMedico`/`FiltroPainelPsicopedagogico`) e os 2 métodos privados auxiliares (`Guid,Guid,int,int` e `Guid,Guid,Guid,int`) que só esses overloads chamavam. O overload `GetAnamnesePessoa(FiltroAnamnese)` (usado por Ficha Médica, Especialista e o link público de anamnese) e `GetAnamnesePessoa(AlunoEscola)` ficaram intactos, com seu próprio helper privado (`int,int,int,int`) preservado.
- **Achado:** `PainelMedicoAnamneseManager.cs`/`IPainelMedicoAnamneseManager.cs` já são código 100% morto — nenhum chamador real em lugar nenhum do repositório (só a própria definição, o `.csproj` e o facade `Generated/Domain.cs`). Não removidos por estarem expostos no facade T4 (mesma restrição do passo 2) — ficam para quando alguém rodar o Visual Studio para regenerar `Domain.tt`.

**Não executado (frontend):** a remoção da aba "Anamnese" dentro de `Painel.js` (PainelAluno), `PainelMedico.js` e `index.js` (Psicopedagógico) foi **investigada e adiada**. Ao contrário do `welcomeProfessor.js` (onde a região morta era 100% isolada), aqui há acoplamento real:
- Em `Painel.js`, a região `//#region Manutenção` (depois do `#endregion` da Anamnese) é 100% anamnese também (`SetRespostasAnamnese`, chama `serviceAnamnese.SetRespostas`) — o marcador está mal posicionado.
- Linha 1271 de `Painel.js`: `GetEspecialistas(GetAnamnesePessoa)` — a aba "Especialistas" (feature ativa, `EspecialistaPessoaService`) usa `GetAnamnesePessoa` como callback.
- Linha 1185 de `Painel.js`: `self.grupos([]);` dentro da função genérica de reset ao trocar de aluno — usada por **todas** as abas do painel, não só Anamnese.
- `Painel.html` tem a Anamnese espalhada em pelo menos 4 lugares (botão de aba, conteúdo da aba, checkbox de filtro "Anamnese pendente" na busca, badge de status numa listagem) — não é um bloco único.

Como `Painel.js`/`Painel.html`, `PainelMedico.js` e `index.js` já estão programados para remoção total nos passos 7, 6 e 5 (respectivamente), essa cirurgia parcial foi adiada para quando o arquivo inteiro for removido — nesse momento o acoplamento deixa de importar. Os 3 arquivos de serviço (`PainelAluno.Anamnese.js`, `PainelMedico.Anamnese.js`, `PainelPsicopedagogico.Anamnese.js`) **não foram apagados** pelo mesmo motivo: ainda são importados pelo `define([...])` desses arquivos grandes, e apagá-los agora quebraria a página inteira (RequireJS), não só a aba.

### Passo 4 — `PainelMedico_FichaController`: executado com escopo reduzido

**Correção importante em relação ao texto original do passo 4:** o plano dizia para remover `FiltroPainelMedico` junto com o controller. Isso está **errado** — `FiltroPainelMedico` (em `Enfermaria/Filtros/`) é usado extensivamente por `AtendimentoEnfermariaManager.cs`/`IAtendimentoEnfermariaManager.cs` (toda a feature de Atendimento da Enfermaria) e pelos controllers `PainelMedico_BuscaController`, `PainelMedico_AtendimentoController`, `Relatorio_EnfermariaController` — todos ainda vivos, só removidos no **passo 6** (Enfermaria). A Seção 2 original deste documento já tinha essa ressalva certa ("pode ser removida junto com a Seção 4"); o passo 4 da lista de execução estava simplificado/errado.

Executado:
- Removido `PainelMedico_FichaController.cs` (+ entrada no `.csproj`) — único consumidor do método abaixo.
- Removido `FichaMedicaManager.GetFichaMedicaEnfermaria(FiltroPainelMedico filtro)` + a declaração em `IFichaMedicaManager.cs` + o campo `perfisPermitidosEnfermaria` (ficou órfão, só esse método usava).
- **`FiltroPainelMedico` NÃO foi tocado** — fica para o passo 6, junto com o resto de `Enfermaria`.
- `PainelMedico.Ficha.js` (serviço JS, 1 método só) **não foi apagado**, mesmo motivo do passo 3: ainda importado pelo `define([...])` de `PainelMedico.js`.

### Passo 5 — Painel Psicopedagógico: removido por inteiro (backend + frontend)

**Decisão de processo confirmada com o usuário antes de executar:** classes expostas pelo facade T4 (`Domain.<Namespace>.<Classe>`, gerado por `Domain.tt`) **podem ser apagadas** junto com a feature — a branch fica sem compilar até alguém rodar "Run Custom Tool" no `Domain.tt` pelo Visual Studio, o que é esperado/normal para esse tipo de mudança nesse projeto. Isso vale para os passos 5, 6 e 7 daqui pra frente.

Executado:
- Apagada a pasta inteira `Eleva.Portal/PainelPsicopedagogico/` (8 arquivos: DTO, Filtros, NHMapping, Repositories, Services, a entidade raiz) + `PainelPsicopedagogico_BuscaController.cs` + entradas nos dois `.csproj`.
- Apagado o frontend: `app/viewmodels/PainelPsicopedagogico/index.js`, `app/views/PainelPsicopedagogico/index.html`, `app/services/PainelPsicopedagogico.Busca.js`, `app/services/PainelPsicopedagogico.Anamnese.js` (este último já estava pendente do passo 3). Nenhuma referência em `shell.js` (painel é acessado via MenuItem/permissão, não rota fixa).
- **Entrelaçamento encontrado e tratado** (mesmo padrão dos passos anteriores — permissões e overloads compartilhados com código que sobrevive):
  - `RedeService.ListarIdsParaPainelPsicopedagogico()` / `IRedeService` — exclusivo do `BuscaManager` apagado → removido.
  - `PerfilAcessoService.ListarIdsParaPainelPsicopedagogico()` / `IPerfilAcessoService` — idem → removido.
  - `PerfilAcessoService.ListarIdsParaPainelPsicopedagogico_Anamnese()` — **mantido**: usado por `AnamneseVirtualManager.ValidarAlunoComResponsavelAutenticado` (motor que sobrevive) e pela própria `PainelMedicoAnamneseManager` (já morta). `FuncionalidadeEnum.PainelPsicopedagogico_Anamnese`/`_Busca` também mantidos por serem referenciados por esses métodos.
  - `PerfilAcessoService.ListarIdsParaPainelPsicopedagogicoEAnamnese()` — **mantido**: usado por `PainelAluno/Services/DocumentoManager.cs`, que sobrevive (infra compartilhada de documentos).
  - `AnamneseVirtual/Services/PainelMedicoAnamneseManager.cs`/`IPainelMedicoAnamneseManager.cs` (já identificados como 100% mortos no passo 3, mantidos por estarem no facade) — removido só o overload `GetAnamnesePessoa(FiltroPainelPsicopedagogico filtro)`, que passaria a referenciar um tipo inexistente e quebraria a compilação; o resto da classe morta continua lá.
  - `AnamneseVirtual/Services/ILinkAnamneseManager.cs` — `using Eleva.Portal.PainelPsicopedagogico.Filtros;` era import morto, removido.
- **Pendência explícita para o usuário:** rodar "Run Custom Tool" no `Domain.tt` (Visual Studio) antes de buildar — o facade ainda referencia `Domain.PainelPsicopedagogico.BuscaManager`/`IBuscaManager`, que não existem mais.

### Passo 6 — Enfermaria + resto do Painel Médico: removido por inteiro, com 1 exceção cirúrgica

Antes de apagar, mandei uma investigação completa (igual à análise original) sobre os 84 arquivos de `Enfermaria/**` + o que sobrava do Painel Médico, porque a essa altura já era claro que "pasta isolada" raramente é verdade nesse código. Achado principal, novo em relação à análise original:

**`MedicamentosRegistroController.cs` não podia ser removido por inteiro.** A classe inteira tem `[Permissao(MedicamentosPrescritos_Registro, Home_Enfermaria)]`, e a action `GetDocumento` (baixa o anexo do medicamento) não tem override de permissão própria — ou seja, herda `Home_Enfermaria` também, e é chamada pela **Home da Enfermaria** (`welcomeEnfermaria.js:227`, feature ativa). As outras 4 actions (`GetAlunos`, `GetMedicamentos`, `SetMedicamento`, `CancelarMedicamento`) têm permissão própria exclusiva de Enfermaria e foram removidas.

Executado:
- **Backend:** apagada a pasta `Eleva.Portal/Enfermaria/` inteira (84 arquivos) **exceto** `MedicamentoPrescrito.cs` + `NHMappings/MedicamentoPrescritoMap.cs` + `NHMappings/MedicamentoPrescritoHorarioMap.cs` — essas 3 sobrevivem porque `MedicamentoPrescritoHorario` (entidade aninhada no mesmo arquivo que `MedicamentoPrescrito`) é a base da query de `WelcomeManager.GetMedicamentosDaSemana` (Home da Enfermaria). `MedicamentoPrescritoManager.cs`/`IMedicamentoPrescritoManager.cs` (o *service*, diferente da entidade) não tinha consumidor fora do escopo removido — foi apagado normalmente.
- Removidos os 6 controllers restantes: `AtendimentosEnfermariaController`, `AvaliacaoEnfermariaController`, `ProcedimentoEnfermariaController`, `Relatorio_EnfermariaController`, `PainelMedico_BuscaController`, `PainelMedico_AtendimentoController`.
- `MedicamentosRegistroController.cs` **reduzido** para só a action `GetDocumento` (removidas as outras 4 + os `using` de `Enfermaria.Filtros`/`Enfermaria.DTO` que ficaram órfãos).
- Métodos de permissão órfãos removidos (confirmado via grep de cada um antes de apagar): `PerfilAcessoService.ListarIdsParaPainelMedicoEBaseDeDadosEnfermaria()`, `ListarIdsParaPainelMedico_Ficha()` (já tinha ficado sem consumidor desde o passo 4), `ListarIdsParaMedicamentosRegistro()`; `RedeService.ListarIdsParaPainelMedico()`. **Mantidos** (usados por código que sobrevive): `ListarIdsParaPainelMedico_Anamnese()` (usado por `AnamneseVirtualManager`), `ListarIdsParaHomeEnfermaria()` (Home da Enfermaria, nos dois serviços).
- `IInformacaoSaidaManager.cs`: removido `using Eleva.Portal.Enfermaria.Filtros;` morto (confirmado, nenhum tipo do namespace usado na interface).
- **Frontend:** apagados `PainelMedico.js`/`.html`, os 4 serviços `PainelMedico.*.js`, `ConfiguracaoEnfermaria/**` (5 arquivos + views), `RelatoriosEnfermaria/**` (2 arquivos + views), os 4 services (`AtendimentosEnfermaria.js`, `Relatorio.Enfermaria.js`, `service.avaliacaoEnfermaria.js`, `service.procedimentoEnfermaria.js`), e o viewmodel/view de `Medicamentos.Registro` (a tela de registro em si). `app/services/Medicamentos.Registro.js` **reduzido** para só `GetDocumento` (usado por `welcomeEnfermaria.js`), mesma lógica do controller.
- `welcomeEnfermaria.js`/`.html` e a rota `Home_Enfermaria` em `shell.js` **não foram tocados** — confirmado que são a única ponte sobrevivente.
- **Pendência:** rodar "Run Custom Tool" no `Domain.tt` — o facade ainda referencia várias classes de Enfermaria que não existem mais.

### Passo 7 — Painel do Aluno legado: removido, mantendo um módulo reduzido de infra compartilhada

Maior e mais arriscado passo (151 arquivos originais em `PainelAluno/`). Mandei uma investigação completa antes de apagar, que confirmou o "manter no lugar" original (`ViewAlunoParaPainel*`, `PessoaDocumento*`, `TipoDocumentoRepository`, `GrupoDocumento*`, `DocumentoManager`) e achou mais um caso:

**`TipoAtendimento` (entidade) precisa sobreviver** — é FK real de `MetasDeAtendimento/MetaAtendimentoTipoAtendimento.cs` (`public virtual TipoAtendimento TipoAtendimento { get; set; }`). Diferente dos outros casos, aqui só a entidade + seu mapeamento NHibernate (`NHMapping/TipoAtendimentoMap.cs`) precisavam ficar — `TipoAtendimentoRepository`/`ITipoAtendimentoRepository` e `TipoAtendimentoPorTipoRede` (entidade relacionada) não tinham nenhum consumidor fora do próprio painel e foram removidos junto com o resto.

**No frontend, achado novo:** `app/viewmodels/PainelAluno/Boletim.js` + `app/views/PainelAluno/Boletim.html` (um modal de visualização de boletim) são usados por `ConselhoDeClasse/Listagem.js` (feature ativa) — `require("viewmodels/PainelAluno/Boletim")`. Ficaram.

Executado:
- **Backend:** de 151 arquivos em `Eleva.Portal/PainelAluno/`, mantidos 24 (os 19 já conhecidos + `TipoAtendimento.cs` + `NHMapping/TipoAtendimentoMap.cs`), removidos 127 — incluindo `FichaManager.cs` (confirmado 100% morto desde o passo 2), `BuscaManager`, `AtendimentoPainelManager`, `AtrasosFaltasManager`, `ControleAtendimentoManager`, `ProximosPassosAtendimentoManager`, `RelatoriosService`, `DTOManager` (o de `PainelAluno`, não confundir com o de `EstruturaEscolar`), `FaltasEAtrasosStore`, toda a família de entidades/DTO/Map/Repository de Atendimento/Formulário/Solicitante/MotivoAtendimento/TipoPublicoAtendido, e os 2 filtros (`FiltroControleAtendimento`, `FiltroProximosPassosAtendimento`).
- Removidos os 9 controllers restantes: `PainelAluno_AtendimentoController`, `PainelAluno_BuscaController`, `PainelAluno_DocumentoController`, `PainelAluno_FaltasController`, `PainelAluno_FichaController`, `PainelAluno_OcorrenciaController`, `ControleAtendimentoController`, `ProximosPassos_AtendimentoController`, `RelatoriosAtendimentosController`.
- Métodos de permissão órfãos removidos (confirmados via grep individual, mesmo padrão dos passos 5/6): `PerfilAcessoService.ListarIdsParaPainelAluno_Atendimento()`, `ListarIdsParaPainelAluno_ExcluirAtendimento()`. **Mantidos** (usados por código que sobrevive): `ListarIdsParaPainelAluno_Anamnese()`, `_Anamnese_Editar()`, `_Psicopedagogico_Medico_Anamnese()` (todos usados por `AnamneseVirtualManager`), `ListarIdsParaPainelAluno_Ocorrencia()`/`_ExcluirOcorrencia()` (usados por `OcorrenciaAlunos/LancamentoManager`, feature ativa), `ListarIdsParaPainelAluno_Documento()`/`_InativarDocumento()`/`ListarIdsParaPainelAlunoEAnamnese()` (usados por `DocumentoManager`, que sobrevive).
- **Frontend:** de 7 viewmodels/views em `PainelAluno/`, mantido só `Boletim.js`/`.html`. Removidos `Painel.js`/`.html` (o painel principal, com os vazamentos encontrados no passo 3 — `GetEspecialistas(GetAnamnesePessoa)` e `self.grupos([]);` — que agora não importam mais, o arquivo inteiro sumiu), `DadosPessoais`, `EditarFichaMedicaExcelencia`, `IFrame`, `Laudo`, `Ocorrencia` (viewmodels + views), e os 7 serviços `PainelAluno.*.js` (Anamnese, Atendimento, Busca, Documento, Faltas, Ficha, Ocorrencia).
- `.csproj` de ambos os projetos atualizado (backend: 149→24 entradas de `PainelAluno`; web: controllers e frontend removidos, `Boletim.js`/`.html` preservados).
- **Pendência:** rodar "Run Custom Tool" no `Domain.tt` — última leva de classes que o facade ainda referencia e não existem mais.

**Resultado final:** `Eleva.Portal/PainelAluno/` deixa de ser "o Painel do Aluno" e passa a ser um módulo de 24 arquivos de infraestrutura compartilhada (documentos genéricos + a view base de aluno/turma + a entidade `TipoAtendimento`), reaproveitado por Status Covid, Ocorrência de Alunos, Anamnese Virtual, Home da Enfermaria, Medicamentos e `MetasDeAtendimento`.

### Passo 8 — Limpeza do `shell.js`/`shell.html`: escopo maior que o previsto

O texto original do passo 8 previa só remover `CssPainelAluno`/`ExibirCssPainelAluno` e a checagem de permissão `PainelAluno_Atendimento_ProximosPassos`. Ao investigar essa última, descobri que ela não era uma checagem isolada — era a porta de entrada de um **widget inteiro de notificação "Próximos Passos"** na barra de navegação principal (sino/badge, dropdown com lista, link "Ver Tudo"), cujo backend inteiro (`ProximosPassos_AtendimentoController`, `ProximosPassosAtendimentoManager`) já tinha sido removido no passo 7. Deixar só a checagem de permissão teria esquecido o resto do widget órfão (a function, a chamada ao serviço, a página inteira "Ver Tudo").

Executado:
- `shell.js`: removidos `CssPainelAluno` (observable), `ExibirCssPainelAluno` (função), e a linha `self.CssPainelAluno(false);` dentro de `ExibirCssRegular` (que sobrevive). Removida a região inteira "Próximos Passos" (`ProximoPassoAtendimentoModel`, `self.proximosPassosAtendimento`, `numeroProximosPassosAtendimentoBadge`, `GetProximosPassosUsuarioLogado` — incluindo a checagem de permissão original —, `AcessarProximosPassosAtendimento`), preservando `RedirecionaUsuario` (função genérica que, por coincidência de código legado, estava dentro da mesma região mas é usada em outro lugar do `activate()`). Removidas as 2 chamadas órfãs (`self.proximosPassosAtendimento([]);` no reset de logout, `GetProximosPassosUsuarioLogado();` no fluxo de login) e a dependência `serviceProximosPassosAtendimento` do `define([...])`.
- `shell.html`: removido o bloco `<!-- ko if: CssPainelAluno() -->` (6 links de CSS do painel) e o bloco inteiro do widget "Próximos Passos" na navbar (ícone, badge, dropdown, "Ver Tudo").
- Removida a página standalone `app/viewmodels/ProximosPassosAtendimento/index.js` + `app/views/.../index.html` (o destino do link "Ver Tudo" — backend já não existia) e o service `app/services/ProximosPassosAtendimento.js`, que ficou sem nenhum consumidor.
- Verificado com `node --check` que `shell.js` continua sintaticamente válido após as edições.
- **Pendência:** regenerar `Domain.tt` (cumulativa de todos os passos).

## 1. Painel do Aluno legado

### Seguro remover (bulk)
Toda a árvore abaixo, **exceto** as classes listadas em "Exige extração":
- `Eleva.Portal/PainelAluno/**` (151 arquivos: entidades, `DTO/`, `Enum/`, `Filtros/`, `NHMapping/`, `Repositories/`, `Services/`)
- `Eleva.Portal.Web/Controllers/PainelAluno_AnamneseController.cs`
- `Eleva.Portal.Web/Controllers/PainelAluno_AtendimentoController.cs`
- `Eleva.Portal.Web/Controllers/PainelAluno_DocumentoController.cs`
- `Eleva.Portal.Web/Controllers/PainelAluno_FaltasController.cs`
- `Eleva.Portal.Web/Controllers/PainelAluno_FichaController.cs`
- `Eleva.Portal.Web/Controllers/PainelAluno_OcorrenciaController.cs`
- `Eleva.Portal.Web/Controllers/PainelAluno_BuscaController.cs`
- `Eleva.Portal.Web/Controllers/ControleAtendimentoController.cs` — **não segue o prefixo `PainelAluno_`, mas é 100% do Painel do Aluno**: só chama `Domain.PainelAluno.ControleAtendimentoManager` (`ControleAtendimentoController.cs:20,32,44,56,68`), permissão `FuncionalidadeEnum.RelatorioControleAtendimento`.
- `Eleva.Portal.Web/Controllers/ProximosPassos_AtendimentoController.cs` — idem: só chama `Domain.PainelAluno.ProximosPassosAtendimentoManager` (`:19,31,43,55,67`), permissão `PainelAluno_Atendimento_ProximosPassos`.
- `Eleva.Portal.Web/app/viewmodels/PainelAluno/**`, `app/views/PainelAluno/**`, services `PainelAluno.*.js`

### Exige extração/preservação
| Classe | Motivo | Quem usa (path:linha) |
|---|---|---|
| `ViewAlunoParaPainel`, `ViewAlunoParaPainelRepository`, `ViewAlunoParaPainelMap` | Utilitário de conversão de turma reaproveitado fora do Painel do Aluno | `Welcome/Services/WelcomeManager.cs:426` (Home Enfermaria); `EstruturaEscolar/Services/DTOManager.cs:1512` (`ConverterParaTurmaDTO`) |
| `PessoaDocumento`, `PessoaDocumentoDTO`, `PessoaDocumentoRepository`, `TipoDocumentoRepository`, `TipoDocumentoEnum.LaudoCovid19`, `GrupoDocumento(Repository)`, `DocumentoManager` | Infra genérica de "documento anexado a uma pessoa", reaproveitada por 2 features ativas e não relacionadas | `RelatorioStatusCovid/Services/StatusCovidManager.cs:203,224,246,306,311,334,336,386` + `Eleva.Portal.Web/Controllers/StatusCovid19Controller.cs` (laudo Covid-19); `Eleva.Portal.Web/Controllers/MedicamentosRegistroController.cs:46` (`Domain.PainelAluno.DocumentoManager.GetDocumentoDownload`, anexo de medicamento na Enfermaria) |
| `FiltroPainel` (em `PainelAluno/Filtros/`) | Filtro genérico rede/escola/série/turma/aluno, virou filtro "oficial" de outra feature ativa | `OcorrenciaAlunos/Services/LancamentoManager.cs:53,88,175,207,229` (5 métodos públicos); também usado internamente por `LogFiltro/Services/LogFiltroPainelAlunoService.cs:11` (este, por sua vez, é exclusivo do Painel do Aluno — ver abaixo) |
| `FiltroRelatorio` (em `PainelAluno/Filtros/`) | Reaproveitado como filtro de relatório financeiro | `Financeiro/Services/RelatorioFinanceiroService.cs:30` (`ListarEscolas(FiltroRelatorio filtro)`) |
| `TipoAtendimento` (entidade) | FK real de outra entidade de domínio (`[GenerateDomain]`, acoplamento de banco) | `MetasDeAtendimento/MetaAtendimentoTipoAtendimento.cs:22` (`public virtual TipoAtendimento TipoAtendimento { get; set; }`) — **confirmar se a feature `MetasDeAtendimento` ainda está ativa antes de decidir**; não foi encontrado controller nem viewmodel SPA para `MetasDeAtendimento` neste repo (ver nota abaixo) |
| `DadosAlunoDTO` | Único consumidor é o próprio `PainelAluno/Services/FichaManager.cs:123,133` (`new LogUpdateDadosPessoais(dto, idPessoa, idRede)` / `new LogUpdateFotoPessoa(...)`), mas as entidades de log **sobrevivem** (são histórico persistido) e seus construtores (`LogDeOperacoes/LogUpdateDadosPessoais.cs:17,44`, `LogUpdateFotoPessoa.cs:16,30`) são tipados com `DadosAlunoDTO` | Não é uso externo ativo — é um **pequeno refactor obrigatório**: ao apagar `PainelAluno/Services/FichaManager.cs`, editar `LogUpdateDadosPessoais.cs`/`LogUpdateFotoPessoa.cs` para remover o overload de construtor que recebe `DadosAlunoDTO` (ou substituí-lo por campos primitivos), só então apagar `DadosAlunoDTO.cs` |
| `using Eleva.Portal.PainelAluno.Filtros;` em `PainelProfessor/Services/IFichaManager.cs:2`, `IDesempenhoPoaService.cs:2` | **Import morto** — nenhuma classe de `PainelAluno.Filtros` é de fato referenciada nesses arquivos (usam `FiltroPainelProfessor`, que é de outro namespace) | Seguro remover a linha `using`, nenhum impacto funcional |
| `using Eleva.Portal.PainelAluno;` em `AcessoResultadoBimestral/Services/AcessoResultadoBimestralManager.cs:14` | **Provável import morto** — nenhuma classe raiz de `PainelAluno` (`ViewAlunoParaPainel`, `TipoAtendimento`, etc.) foi encontrada em uso no arquivo | Confirmar com o compilador (warning de using não usado) antes de apagar a pasta |

**Nota:** não foi encontrado controller MVC nem viewmodel SPA para `MetasDeAtendimento` no repositório — só a entidade `MetaAtendimentoTipoAtendimento.cs`. Pode já ser código morto por si só, mas isso está **fora do escopo de PainelAluno** — não decidir sobre `TipoAtendimento` sem antes investigar separadamente se `MetasDeAtendimento` está mesmo ativo (tabela consultada em algum relatório?).

---

## 2. Painel Médico

Não existe pasta própria `Eleva.Portal/PainelMedico/`. O backend de "Painel Médico" vive misturado dentro de `Eleva.Portal/Enfermaria/` (ver Seção 4: `DTO/AlunoParaPainelMedicoDTO.cs`, `Filtros/FiltroPainelMedico.cs`). Esta seção cobre apenas os artefatos exclusivos da casca "Painel Médico".

### Seguro remover
- `Eleva.Portal.Web/Controllers/PainelMedico_AnamneseController.cs` — thin wrapper sobre `Domain.AnamneseVirtual.AnamneseVirtualManager` (confirmado: só delega, não tem lógica própria)
- `Eleva.Portal.Web/Controllers/PainelMedico_AtendimentoController.cs`
- `Eleva.Portal.Web/Controllers/PainelMedico_BuscaController.cs`
- `Eleva.Portal.Web/Controllers/PainelMedico_FichaController.cs` — delega para `Domain.FichaAluno.FichaMedicaManager.GetFichaMedicaEnfermaria(filtro)` (`PainelMedico_FichaController.cs:15`)
- `app/viewmodels/PainelMedico/**`, `app/views/PainelMedico/**`, services `PainelMedico.*.js`

### Exige extração/ação de acompanhamento
- `FichaAluno/Services/FichaMedicaManager.cs:207` — o método `GetFichaMedicaEnfermaria(Enfermaria.Filtros.FiltroPainelMedico filtro)` fica **morto** depois que `PainelMedico_FichaController` for removido. `FichaMedicaManager` em si **sobrevive** (feature própria e ativa — ver Seção 5), mas este método específico deve ser apagado como limpeza complementar, não uma pasta inteira.
- `FiltroPainelMedico` (em `Enfermaria/Filtros/`) — usado por `PainelMedico_AnamneseController.cs:30`, `PainelMedico_FichaController.cs:13` e por `FichaMedicaManager.cs:207`. Uma vez removidos os 2 controllers e o método morto do `FichaMedicaManager`, esta classe fica sem uso e pode ser removida junto com a Seção 4 (Enfermaria).

---

## 3. Painel Psicopedagógico

### Seguro remover
- `Eleva.Portal/PainelPsicopedagogico/**` (8 arquivos: `DTO/AlunoParaPainelPsicopedagogicoDTO.cs`, `Filtros/FiltroPainelPsicopedagogico.cs`, `NHMapping/ViewAlunoParaPainelPsicopedagogicoMap.cs`, `Repositories/*ViewAlunoParaPainelPsicopedagogicoRepository.cs`, `Services/*BuscaManager.cs`, `ViewAlunoParaPainelPsicopedagogico.cs`) — nenhuma referência externa encontrada fora da própria pasta e dos 2 controllers abaixo.
- `Eleva.Portal.Web/Controllers/PainelPsicopedagogico_AnamneseController.cs` — thin wrapper sobre `AnamneseVirtualManager`, mas **também** chama `Domain.PainelAluno.DocumentoManager` em 6 métodos (`:93,105,118,133,151,159`) para anexos da anamnese. Isso não impede a remoção do controller (o `DocumentoManager` sobrevive por outros motivos — Seção 1), só não remover `DocumentoManager` junto.
- `Eleva.Portal.Web/Controllers/PainelPsicopedagogico_BuscaController.cs`
- `app/viewmodels/PainelPsicopedagogico/**`, `app/views/PainelPsicopedagogico/**`, services `PainelPsicopedagogico.*.js`

### Exige extração
Nenhuma — esta é a família mais isolada das 5 áreas-alvo.

### Incerto
- Nada identificado como incerto nesta área.

---

## 4. Enfermaria

### Seguro remover (bulk)
Toda a árvore abaixo, **exceto** `FiltroPainelMedico` (ver Seção 2) e as classes listadas abaixo:
- `Eleva.Portal/Enfermaria/**` (101 arquivos)
- `Eleva.Portal.Web/Controllers/AtendimentosEnfermariaController.cs`
- `Eleva.Portal.Web/Controllers/AvaliacaoEnfermariaController.cs`
- `Eleva.Portal.Web/Controllers/ProcedimentoEnfermariaController.cs`
- `Eleva.Portal.Web/Controllers/Relatorio_EnfermariaController.cs`
- `Eleva.Portal.Web/Controllers/MedicamentosRegistroController.cs` — **exceto a linha 46** (ver abaixo)
- `app/viewmodels/ConfiguracaoEnfermaria/**`, `app/viewmodels/RelatoriosEnfermaria/**`, `app/views/**Enfermaria**`, services `AtendimentosEnfermaria.js`, `Relatorio.Enfermaria.js`, `service.avaliacaoEnfermaria.js`, `service.procedimentoEnfermaria.js`

### Exige extração/preservação
| Classe/linha | Motivo | Quem usa |
|---|---|---|
| `Domain.Enfermaria.MedicamentoPrescritoHorarioRepository` | Usado pela Home da Enfermaria (widget de welcome, feature ativa e separada) | `Welcome/Services/WelcomeManager.cs:183` (`GetMedicamentosDaSemana`) |
| `MedicamentosRegistroController.cs:46` | Chama `Domain.PainelAluno.DocumentoManager.GetDocumentoDownload` — não é Enfermaria usando algo de fora que precisa ser preservado, é o inverso: esta linha específica do controller **de Enfermaria** depende do `DocumentoManager` do Painel do Aluno (que sobrevive por outros motivos, Seção 1). Não remover esta linha isoladamente — ela continua funcionando normalmente após a limpeza, desde que `DocumentoManager` seja preservado |
| `FiltroPainelMedico` | Ver Seção 2 — usado por `FichaMedicaManager.cs:207` (método a ser removido) e pelos 2 controllers `PainelMedico_*` já descontinuados | — |

### Incerto
- `InformacaoDeSaida/Services/IInformacaoSaidaManager.cs:6` tem `using Eleva.Portal.Enfermaria.Filtros;`, mas nenhuma assinatura do arquivo usa classes de `Enfermaria.Filtros` (todos os parâmetros são `FiltroInformacaoSaida*`, próprio namespace). **Provável import morto** — confirmar com o compilador antes de contar como dependência real.

---

## 5. AnamneseVirtual / LinkAnamnese

**Resultado principal: o backend de `AnamneseVirtual` (Pergunta, GrupoPergunta, VersaoAnamnese, `AnamneseVirtualManager`, `AnamneseRespostaMapeadaManager`, `AnamnesePessoa*`, views `ViewAlunoAnamnese`/`ViewPerguntaVersaoAnamnese*`) é um motor de formulário genérico reaproveitado por pelo menos duas features ativas e totalmente alheias ao Painel do Aluno/Médico/Psicopedagógico.** Ele **não pode ser removido** — só a casca de UI específica desses 3 painéis.

### Exige extração/preservação (praticamente toda a pasta)
- `FichaAluno/Services/FichaMedicaManager.cs` (feature própria e ativa — Ficha Médica, controller `FichaMedicaController.cs`, distinto de `PainelMedico_FichaController`/`PainelAluno_FichaController`) depende fortemente de `AnamneseVirtual.AnamneseVirtualManager`/`AnamneseRespostaMapeadaManager` em 9 pontos: `FichaMedicaManager.cs:135,151,152,261,269,270,291,423,433,434`
- `Especialista/Services/EspecialistaPessoaService.cs` (feature própria e ativa — diretório de especialistas) depende de `AnamneseVirtual.AnamneseVirtualManager` e `AnamnesePessoaRespostaRepository` em ~17 pontos (`:27,119,120,122,131,140,148,168,169,173,181,193,194,195,227,235,236,237,308,309,310`), usando `TipoPerguntaEnum.Especialidade/Nome_Profissional/Telefone_Profissional/Celular_Profissional/Consultorio/Possui_Especialista` — ou seja, o motor de perguntas do AnamneseVirtual é a espinha dorsal desta feature
- `Imagem/Services/FotoPessoaBarramentoService.cs:24,46` e `Imagem/Repositories/FotoPessoaRepository.cs:77,85` usam `FotoAlunoBarramentoDTO`/`FotoAlunoMatriculaBarramentoDTO`, que fisicamente moram em `AnamneseVirtual/DTO/` só por acidente histórico — nada a ver com anamnese, mas reforça que a pasta inteira precisa sobreviver
- **Conclusão prática:** manter toda `Eleva.Portal/AnamneseVirtual/**`, `Eleva.Portal.Web/Controllers/AnamneseVirtualController.cs` e `LinkAnamneseController.cs`, `app/viewmodels/AnamneseVirtual/**`, `app/viewmodels/LinkAnamnese/**`

### Seguro remover (apenas a casca específica dos 3 painéis legados)
- `Eleva.Portal.Web/Controllers/PainelAluno_AnamneseController.cs` — thin wrapper confirmado (só delega para `AnamneseVirtualManager`/`AnamneseRespostaMapeadaManager`)
- `Eleva.Portal.Web/Controllers/PainelMedico_AnamneseController.cs` — thin wrapper confirmado
- `Eleva.Portal.Web/Controllers/PainelPsicopedagogico_AnamneseController.cs` — thin wrapper confirmado (também chama `PainelAluno.DocumentoManager`, que sobrevive)
- As telas SPA de Anamnese dentro de `app/viewmodels/PainelAluno/`, `PainelMedico/`, `PainelPsicopedagogico/` (já cobertas nas seções 1–3)

### Pergunta do card já resolvida com evidência
"Anamnese" dentro do Painel do Aluno/Médico/Psicopedagógico **não é código duplicado do motor** — é uma **UI alternativa** (3 controllers finos) sobre o mesmo motor que o link público (`LinkAnamneseController`/`AnamneseVirtualController`) e que a Ficha Médica/Especialista usam. Remover a UI dos 3 painéis é seguro; remover o motor quebraria 2 features ativas e o link público.

---

## 6. Referências de roteamento/menu a limpar (shell.js e afins)

| Linha | Referência | Ação |
|---|---|---|
| `app/viewmodels/shell.js:1110-1111` | `self.PossuiPermissao('Home_Enfermaria')` → `CriarRotaHome('viewmodels/Home/WelcomeEnfermaria', 'Home_Enfermaria')` | **Manter** — a Home de Enfermaria é uma feature ativa separada (ver `Welcome/Services/WelcomeManager.cs`); não remover esta rota |
| `app/viewmodels/shell.js:806` | `if (!self.PossuiPermissao('PainelAluno_Atendimento_ProximosPassos')) { return; }` | Remover junto com a limpeza de `ProximosPassosAtendimentoManager`/`ProximosPassos_AtendimentoController` (Seção 1) |
| `app/viewmodels/shell.js:663-675` | `self.CssRegular`, `self.CssPainelAluno` (observable), `self.ExibirCssRegular`/`self.ExibirCssPainelAluno` (funções) | `CssPainelAluno` e `ExibirCssPainelAluno` são exclusivos — único chamador é `app/viewmodels/PainelAluno/Painel.js`. Remover o observable `CssPainelAluno`, a função `ExibirCssPainelAluno`, e a linha `self.CssPainelAluno(false)` dentro de `ExibirCssRegular` (shell.js:666). **Manter** `CssRegular`/`ExibirCssRegular` (usados por todo o resto do portal) |
| `app/viewmodels/shell.js:640,830` | `self.visaoAnamnese` (observable) e seu uso em `DeveExibirBarraSuperior` | **Manter** — pertence exclusivamente ao fluxo de preenchimento de Anamnese via link público; confirmado via `login.js:24,71` (`self.visaoAnamnese = window.shell.visaoAnamnese`) e `app/viewmodels/AnamneseVirtual/Questionario.js:89` (`window.shell.visaoAnamnese() === true`). **Não tem relação com PainelAluno/PainelMedico/PainelPsicopedagogico** |

Nenhuma outra referência a `PainelAluno`/`PainelMedico`/`PainelPsicopedagogico`/`Enfermaria` foi encontrada em `shell.js` além das listadas acima.

---

## 7. Tabelas/views candidatas a sinalização

O `_pde/db_map` (`schema/tables.yaml`, `schema/views.yaml`) **não é um inventário de uso em produção** — é só schema/relações. Ele confirma a existência das seguintes tabelas/views ligadas às 5 áreas, mas **nenhuma validação de uso real (`COUNT(*)` em homolog/produção) foi feita** — isso é passo de validação posterior, fora do escopo desta análise de código:

- `views.yaml`: `ViewAlunoAnamnese` (:2452), `ViewAlunoParaPainel` (:4474), `ViewAlunoParaPainelPsicopedagogico` (:4615), `ViewBoletimAtendimentoEnfermaria` (:7010), `ViewMotivoAtendimentoFormulario` (:14152)
- `tables.yaml`: família `Anamnese*` (`AnamnesePessoa`, `AnamnesePessoaResposta`, `AnamnesePessoaRespostaOpcao` — :847-884, todas com FK para `VersaoAnamnese`/`PerguntaVersaoAnamnese`, que **sobrevivem** por serem do motor compartilhado), família `AtendimentoEnfermaria*` (:1020-1156), `PainelAluno` e `PainelAlunoTrocaAlunoEscola` (:8807,8816) — **nomes de tabela não mapeados para nenhuma classe C# encontrada nesta pesquisa**, exigem investigação adicional (podem ser tabelas órfãs de uma versão ainda mais antiga, ou usadas via SQL direto/relatório fora do código NHibernate mapeado)

**Importante:** como quase todas as views/entidades de `ViewAlunoParaPainel` e `AnamnesePessoa*`/`PerguntaVersaoAnamnese*` continuam em uso (Seções 1 e 5), **nenhuma tabela da família Anamnese pode ser sinalizada para remoção** — apenas as tabelas exclusivas de Enfermaria/PainelPsicopedagogico (ex. `AtendimentoEnfermaria*`, `ViewBoletimAtendimentoEnfermaria`, `ViewAlunoParaPainelPsicopedagogico`) são candidatas reais, após remoção do código.

---

## 8. Ordem sugerida de execução

1. **Validar com o PO** (CA-07 do refinamento): Painel Médico e Painel Psicopedagógico entram no escopo? (Recomendação desta análise: sim, mesma família de telas legadas.) Confirmar também se `MetasDeAtendimento` ainda está ativo (nenhum controller/viewmodel encontrado — pode já ser código morto à parte).
2. **Extrair/realocar antes de tocar em PainelAluno** — ✅ **executado em 2026-10-13**, com revisão:
   - ✅ `FiltroPainel` e `FiltroRelatorio` movidos para `EstruturaEscolar/Filtros/` (namespace `Eleva.Portal.EstruturaEscolar.Filtros`), ~30 consumidores atualizados.
   - ✅ `WelcomeController.GetDesempenho`/`GetAvaliacoes` removidos (dead code confirmado — Home do aluno já substituída) — isso tornou `FichaManager.cs` 100% removível, eliminando a necessidade do passo seguinte.
   - ~~Editar `LogUpdateDadosPessoais.cs`/`LogUpdateFotoPessoa.cs` para não depender mais de `DadosAlunoDTO`~~ — obsoleto, ver acima.
   - ❌ **Não executado, por restrição de ferramental (ver "Correções pós-execução" no topo deste documento):** mover `PessoaDocumento`/`PessoaDocumentoDTO`/`DocumentoManager`/`TipoDocumentoRepository`/`GrupoDocumentoRepository` e `ViewAlunoParaPainel`/`ViewAlunoParaPainelRepository`. Essas classes ficam **permanentemente** em `PainelAluno` — o passo 7 abaixo precisa ser ajustado para não apagar a pasta inteira.
3. **Remover os 3 controllers de Anamnese** — ✅ **backend executado em 2026-10-13** (controllers + overloads mortos de `AnamneseVirtualManager`). ⏸ **Frontend adiado** (remoção da aba "Anamnese" em `Painel.js`/`PainelMedico.js`/`index.js` e dos serviços `*.Anamnese.js`) — acoplamento real encontrado (ver "Correções pós-execução dos passos 3 e 4"), fica para quando os arquivos inteiros forem removidos nos passos 5/6/7.
4. **Remover `PainelMedico_FichaController`** — ✅ **executado em 2026-10-13**, com correção: **`FiltroPainelMedico` NÃO foi removido** (ainda usado por toda a feature de Atendimento da Enfermaria — `AtendimentoEnfermariaManager`, `PainelMedico_BuscaController`, `PainelMedico_AtendimentoController`, `Relatorio_EnfermariaController`); fica para o passo 6. `PainelMedico.Ficha.js` também não foi apagado, mesmo motivo do passo 3.
5. **Remover Painel Psicopedagógico** — ✅ **executado em 2026-10-13**, backend e frontend por inteiro numa passada só (ver "Correções pós-execução dos passos 3 e 4"). Pendência: regenerar `Domain.tt` no Visual Studio antes de buildar.
6. **Remover Enfermaria** — ✅ **executado em 2026-10-13**, backend e frontend por inteiro, mais o que tinha sido adiado dos passos 3/4 (`FiltroPainelMedico`, `PainelMedico.js` e seus serviços). Achado novo: `MedicamentosRegistroController`/`Medicamentos.Registro.js` tiveram que ser reduzidos (não apagados por inteiro) — a action `GetDocumento` é usada pela Home da Enfermaria. Ver "Correções pós-execução" para detalhes. Pendência: regenerar `Domain.tt`.
7. **Remover Painel do Aluno legado** — ✅ **executado em 2026-10-13**. 151→24 arquivos em `PainelAluno/` (ver "Correções pós-execução" para a lista completa e o achado novo de `TipoAtendimento`/`Boletim.js`). Pendência: regenerar `Domain.tt`.
8. **Limpar `shell.js`/`shell.html`** — ✅ **executado em 2026-10-13**, escopo maior que o previsto: a checagem de permissão era a porta de entrada de um widget de notificação inteiro ("Próximos Passos"), já órfão desde o passo 7. Ver "Correções pós-execução" para detalhes. `Home_Enfermaria` e `visaoAnamnese` **não foram tocados**, confirmado. (A limpeza de `welcomeAlunos.js`/`Home_AlunoSE` já tinha sido feita nos passos 2/2.5.)
9. **Validação em homolog/produção** (fora do escopo desta análise): `COUNT(*)` nas tabelas/views exclusivas de Enfermaria/PainelPsicopedagogico antes de sinalizar remoção de banco; investigar `PainelAluno`/`PainelAlunoTrocaAlunoEscola` (tabelas sem classe C# mapeada encontrada).

## Correção pós-execução — achado do Bugbot no PR (2026-10-14)

O item 3 da seção "Correções pós-execução do item 2" classificou `RelatoriosAtendimentosController.cs` como "chama apenas `Domain.PainelAluno.RelatoriosService`" — **incorreto**. O arquivo misturava dois conjuntos de endpoints sem relação entre si:

- **Morto** (dependia de `Domain.PainelAluno.RelatoriosService`, já removido): `BuscarDadosDoUsuario`, `ListarRedesRP`, `ListarAnosLetivos`, `ListarEscolas`, `ListarSeries`, `ListarRelatorioTotal`, `ListarRelatorioAtendimentos*`, `ListarRelatorioOcorrencias`, `GetRelatorio*`. Único consumidor: `app/viewmodels/RelatoriosAtendimentos/ListagemRP.js` + `service.relatoriosAtendimentos.js`, sem nenhuma rota registrada em `shell.js`/views — tela órfã, confirmado via grep em todo `Eleva.Portal.Web/app`.
- **Vivo** (chama `Domain.PowerBI.HomeServices`/`Domain.EstruturaEscolar.RedeRepository`, sem relação com PainelAluno): `GetReport`, `IndicadorCecor`, `IndicadorDesempenhoCecor`, `IndicadorDevolutivaAvaliacaoDigital`, `BuscarEscolaAutenticada`, `BuscaRedeAutenticada`. Consumido por `app/services/PowerBI.js`, usado por `Home/welcome.js` e 4 helpers em `Indicadores/*.js`.

A remoção original apagou o controller inteiro, quebrando os embeds de Power BI do dashboard e dos indicadores. Correção: controller restaurado só com os métodos de Power BI; os arquivos órfãos da tela RP (`service.relatoriosAtendimentos.js`, `viewmodels/RelatoriosAtendimentos/`, `views/RelatoriosAtendimentos/`) foram removidos para completar a limpeza. Build validado limpo após o ajuste.

## Correção pós-execução — segundo achado do Bugbot no PR (2026-10-14)

`ControleAtendimentoController.cs` (também "órfão de prefixo", dependia só de `Domain.PainelAluno.ControleAtendimentoManager`) foi apagado corretamente, mas a tela front-end que o consumia — `app/viewmodels/RelatorioControleAtendimento/`, `app/services/RelatorioControleAtendimento.js`, `app/views/RelatorioControleAtendimento/` — vive numa pasta própria fora de `PainelAluno/` e não tinha sido varrida.

Diferente do caso do Power BI, aqui não havia mistura de responsabilidades (o controller era 100% dependente do serviço morto). Verificação no banco (homolog, `ElevaPortalHomolog`) antes de decidir:
- `MenuItem.Id = 230` ("Controle de Atendimento") existe e está ativo, apontando para `Funcionalidade.Id = 225`.
- `PerfilAcessoFuncionalidade` não tem **nenhuma linha** para `Funcionalidade = 225` — nenhum perfil de acesso tem a tela habilitada hoje.

Decisão do usuário: remover por completo. Executado:
- Apagados os 3 arquivos front-end órfãos + entradas no `.csproj`.
- Removido `FuncionalidadeEnum.RelatorioControleAtendimento = 225` (sem nenhum outro consumidor no código, confirmado via grep).
- Script `cards/EFC-7037/EFC-7037-desativar-menu-controle-atendimento.sql` criado para desativar (soft-delete, `Ativo = 0`) `MenuItem.Id = 230` e `Funcionalidade.Id = 225` no banco — **execução manual**, fora do escopo de automação. **Renomeado depois para `EFC-7037-desativar-menus-orfaos.sql`** quando mais 2 itens foram encontrados (ver seção seguinte).

Build validado limpo após o ajuste.

## Resposta à revisão de PR #409 (Claude Code, 2026-10-26) — 3 bloqueadores

PR revisado por um comando de validação (duas passagens, a segunda com viés de escalada) voltou **Bloqueado**, com 3 achados. Todos investigados e corrigidos:

1. **Regressão real — Home do Professor quebrava para todos os professores.** `welcomeProfessor.js:423`, dentro de `filtro()`, ainda lia `self.idVolumeSelecionado()` — observable que só existia no bloco "Home do Aluno" já removido (ver "Correções pós-execução do item 2"). Isso lançava `TypeError` dentro de `filtro()`, chamada por `GetCiclos`/`GetLancamentoNotas`/`GetDesempenhoNaPoa` — o erro interrompia o callback e os quadros de desempenho/ciclos/calendário na Home do Professor ficavam vazios. **Corrigido:** linha removida. Também removidas `AdicionarContagemTabela`/`SubtrairContagemTabela`/`AdicionarFrequenciaMobile`/`SubtrairFrequenciaMobile` — mesmas funções mortas, referenciavam `extratoCompletoComportamento`/`extratoCompletoFrequencia`/`frequenciaPorCiclo` (também só existiam no bloco removido); confirmado via grep que `welcomeProfessor.html` não chama nenhuma delas.
2. **Risco de deploy — toggle da Home pode cair desligado sem URL, causando loop de recarga.** O `buildspec.yml` sobrescreve os `Web.*.config` com o conteúdo de um segredo do AWS Secrets Manager durante o build; se as chaves `HomeAluno.Habilitada.Toggle`/`HomeAluno.UrlRedirecionamento` não estiverem nesse segredo (homolog e produção), o deploy droparia as chaves novas do repositório — toggle desligado + URL vazia faria `shell.js` rodar `window.location.href = ""`, recarregando a própria página em loop para todo usuário com `Home_Aluno`. **Corrigido no código:** `shell.js` agora tem `if (window.ambienteTemHome || !window.urlHomeReal)` — se a URL vier vazia (por qualquer motivo, incluindo a chave ausente no segredo), cai no fallback local em vez de redirecionar para `""`. **Pendente, fora do código:** alguém com acesso à AWS precisa confirmar/adicionar as duas chaves nos segredos de homologação e produção antes do deploy — não é uma ação que a IA executa (regra do projeto: AWS somente leitura).
3. **Itens de menu órfãos no banco.** `MenuItem` é montado a partir do banco, não só do código — 3 itens ativos apontavam para viewmodels/controllers já removidos: `Id 35` ("Próximos Passos" → `ProximosPassosAtendimento/index`, Funcionalidade 236, **11 perfis de acesso habilitados** — o mais urgente, usuários reais acessam), `Id 217` ("Alunos - Atendimentos e Comprometimento" → `RelatoriosAtendimentos/ListagemRP`, Funcionalidade 41, 0 perfis), `Id 230` (já identificado antes, Controle de Atendimento, 0 perfis). Confirmado em homolog via `PerfilAcessoFuncionalidade`. **Script estendido:** `EFC-7037-desativar-menus-orfaos.sql` agora desativa os 3 MenuItems + 3 Funcionalidades — execução manual, conferir os IDs equivalentes em produção antes de rodar (podem divergir de homolog).

Build revalidado limpo após as correções de JS/shell.js.
