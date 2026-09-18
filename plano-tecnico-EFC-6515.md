# Plano Técnico — EFC-6515

## Atividade

- **Chave:** EFC-6515
- **Título:** "Aplica-se a" — abrangência de escolas na Matriz Curricular
- **Tipo:** Story
- **Status:** Revisado com o tech lead (Rodrigo) — aguardando validação de produto

## Contexto

Hoje, ao incluir/editar uma disciplina na Matriz Curricular, a configuração vale implicitamente para **todas as escolas** da rede/segmento — não existe nenhuma forma de restringir a quais escolas aquela configuração se aplica. Os campos `todasAsEscolas`/`escolas[]` que já existem no `MatrizCurricularGetResponse` são **100% calculados em runtime** (join informativo contra `EscolaSerie`, feito em `RedeSerieDisciplinaRepository.GetEscolasPorRedeSerie`) — não há nada persistido, e nenhum endpoint de save aceita esse dado.

Esta feature adiciona um select "Aplica-se a" (Todas as escolas / Todas as escolas exceto as selecionadas / Apenas escolas selecionadas) logo abaixo de "Área do Conhecimento" no formulário de disciplina, com um multi-select de escolas condicional.

**Importante — todo o backend de Matriz Curricular é código deste mesmo branch** (`feature/EFC-6515`), ainda não mesclado a `master` (confirmado via `git diff master...HEAD`: controller, services, DTOs, repositórios e ~2000 linhas de teste são todos novos). Ou seja, as mudanças abaixo são ajustes a uma feature em desenvolvimento, não uma alteração de comportamento já em produção.

**Revisão com o tech lead mudou 3 decisões do plano original:**

1. `RedeSerieDisciplina` ganha flags booleanas persistidas (não um enum de 3 valores) — ver modelo de dados abaixo.
2. `RedeSerieDisciplina` **deixa de ser recriada (Disable+Insert) a cada save** e passa a ser **atualizada em lugar** (`Update()`) — hoje qualquer edição (ex.: renomear a disciplina) desabilita a linha antiga e insere uma nova, o que faria a tabela nova de escolas (`RedeSerieDisciplinaEscola`, com FK para `RedeSerieDisciplina.Id`) perder a referência a cada save trivial. Isso também precisa ser corrigido no **Configurador de Disciplinas**, porque ele escreve na **mesma tabela** `RedeSerieDisciplina` (confirmado lendo `ConfiguradorDisciplinas/SaveService.cs` — não é uma entidade separada por escola como se supôs inicialmente).
3. Carga horária total da série passa a poder variar por escola. **Decisão confirmada:** a listagem em tela (`GetParaMatriz`) continua exatamente como está hoje (sem mudança visual/de cálculo); só a **exportação Excel** passa a exibir uma linha por escola com o total real daquela escola.

## Modelo de dados — decisão final

`RedeSerieDisciplina` ganha **duas flags booleanas** (não um enum), para poder reconstruir exatamente qual das 3 opções da tela foi escolhida (confirmado como requisito — precisa "lembrar como foi digitado"):

| Campo | Tipo | Default | Significado |
|---|---|---|---|
| `TodasAsEscolas` | `bool` | `true` | `true` = aplica-se a todas as escolas da rede/segmento/série; ignora qualquer linha em `RedeSerieDisciplinaEscola` |
| `EscolasSaoExcecao` | `bool` | `false` | Só relevante quando `TodasAsEscolas == false`. `false` = `RedeSerieDisciplinaEscola` é a lista de escolas onde a disciplina **se aplica** ("Apenas escolas selecionadas"); `true` = `RedeSerieDisciplinaEscola` é a lista de escolas **excluídas** ("Todas as escolas exceto as selecionadas") |

Mapeamento com as 3 opções da tela:

| Opção na tela | `TodasAsEscolas` | `EscolasSaoExcecao` | `RedeSerieDisciplinaEscola` |
|---|---|---|---|
| Todas as escolas | `true` | — | vazia |
| Todas as escolas exceto as selecionadas | `false` | `true` | escolas excluídas |
| Apenas escolas selecionadas | `false` | `false` | escolas incluídas |

**Resolução de "a disciplina X se aplica à escola Y?"** (usada na Fase 6, exportação):
```
TodasAsEscolas == true
   → aplica-se a todas as escolas que ofertam a série
TodasAsEscolas == false && EscolasSaoExcecao == false
   → aplica-se somente às escolas em RedeSerieDisciplinaEscola
TodasAsEscolas == false && EscolasSaoExcecao == true
   → aplica-se a todas as escolas que ofertam a série, EXCETO as em RedeSerieDisciplinaEscola
```

## Contexto do Repositório (lido por completo nesta revisão)

**`SaveMatrizCurricularService.cs`** (405 linhas, já existente no branch):
- `SaveNew` **exige** que a disciplina já esteja configurada (via Configurador de Disciplinas) em todas as séries do request — não cria `RedeSerieDisciplina` do zero, só marca `ParteDaMatrizCurricular = true` numa linha que já existe. Ou seja, ao chegar em `SaveMatrizCurricularService`, a linha de `RedeSerieDisciplina` **sempre existe** — a mudança para `Update()` em vez de Disable+Insert não precisa lidar com o caso "não existe ainda".
- `SalvarSeriesNaMatrizAsync` hoje monta `paraDesabilitar`/`paraInserir` e chama `Disable()` antes de `Insert()`. Em `Update`, séries removidas do request também passam por Disable+Insert-de-clone (`ParteDaMatrizCurricular=false`, `OcultarNaMatrizCurricular=true` numa **nova** linha ativa).
- `RecalcularTotaisPorSerieAsync` (chamado por `SaveNew`, `Update` e também usado por `RemoverMatrizCurricularService`) já faz **Update in-place** da linha `CargaHoraria` com `TotalDaSerie=true` (soma de todas as `CargaHoraria` ativas daquele `RedeSerieId`, sem qualquer noção de escola) — esse método **não precisa mudar** (decisão confirmada: listagem em tela fica igual).
- `TotalDaSerie` só é consumido em 2 lugares no sistema todo: a própria listagem da Matriz (`GetParaMatriz`) e a exportação Excel (`ExportarMatrizCurricularService`/`GetParaExport`) — nenhum outro módulo (boletim, diário de classe, relatórios de professor) depende disso. Raio de impacto contido.

**`ConfiguradorDisciplinas/SaveService.cs`** (já existente, **fora** deste branch — é código de `master`):
- Opera sobre a **mesma** `RedeSerieDisciplina`, não sobre `EscolaSerieDisciplina` (essa é uma entidade não relacionada, usada em frentes/Classroom, sem nenhum campo de matriz/carga horária — a suposição inicial de que Configurador de Disciplinas "já é por escola" estava errada).
- Hoje já tem uma lógica híbrida: se a configuração geral mudou (`ConfiguracaoFoiAlterada` — nome, flags de avaliação, etc.), desabilita **todas** as `RedeSerieDisciplina` da disciplina e insere todas de novo; se não mudou, só ajusta a diferença de séries (`RedeSerieIdList`) via Disable/Insert pontual. Essa é a segunda escrita na mesma tabela que precisa parar de recriar linhas por completo quando só um campo simples muda — caso contrário `RedeSerieDisciplinaEscola` perde a referência (FK) toda vez que o nome da disciplina é alterado por lá.

**Padrão de referência para lista de escolas versionada (`EscolaGerencialEscola`)**: usa diff (desabilita só o que saiu da seleção, insere só o que entrou, preserva o resto) — esse é o padrão certo para `RedeSerieDisciplinaEscola` **agora que o pai (`RedeSerieDisciplina`) passa a ser estável** (não recriado a cada save). Achei inicialmente que deveria copiar o padrão "desabilita tudo + insere tudo" do próprio `RedeSerieDisciplina`/`CargaHoraria`, mas isso só fazia sentido enquanto o pai também era recriado a cada save — com a mudança para `Update()`, o padrão de diff é o correto e evita churn desnecessário de histórico.

**Frontend — já existe:**
- `frontend/src/app/features/matriz-curricular/formulario-matriz/formulario-matriz.component.ts/.html` — side-panel, `FormGroup` com `hashDisciplina`/`hashAreaConhecimento`/`ehEnriquecimentoCurricular` + array `serieItems`. Usa `single-select` (não `app-select-field`) para Disciplina/Área do Conhecimento.
- `frontend/src/app/features/matriz-curricular/models/models.ts` — `todasAsEscolas`/`escolas[]` hoje só no `GetResponse` (derivado); nada em `SaveRequest`/`UpdateRequest`.
- `app-multi-select-field` já usado diretamente (fora do `<filtro>`) em `movimentacao-pedagogica/alteracao-carga-detalhes/`.
- Nenhum endpoint `filter-escolas` existe ainda para Matriz Curricular; padrão a seguir é `POST /{modulo}/filter-escolas` (ex.: `filtro-liberacao-boletins.service.ts` → `/liberacaoboletim/filter-escolas`).

## Fases

### Fase 1 — Backend: `RedeSerieDisciplina` para de ser recriada a cada save

**Status:** concluída

- `RedeSerieDisciplina.cs`: adicionar `public virtual bool TodasAsEscolas { get; set; } = true;` e `public virtual bool EscolasSaoExcecao { get; set; }`. Mapear em `RedeSerieDisciplinaMap.cs` (`builder.Property(x => x.TodasAsEscolas).IsRequired();` / idem para `EscolasSaoExcecao`).
- **`SaveMatrizCurricularService.SalvarSeriesNaMatrizAsync`**: trocar Disable+Insert por `Update()` direto nas entidades já buscadas em `existentesPorSerie` (sempre existem, por causa da validação já existente que exige configuração prévia). Setar os campos direto na entidade existente (`NomeDocumentosOficiais`, `AreaConhecimentoId`, `EhEnriquecimentoCurricular`, `ParteDaMatrizCurricular=true`, `OcultarNaMatrizCurricular=false`, `TodasAsEscolas`, `EscolasSaoExcecao`) e chamar `_redeSerieDisciplinaRepository.Update(paraAtualizar)` uma vez, em lote.
- Séries removidas do request (fluxo `Update`): mesma troca — `existente.ParteDaMatrizCurricular = false; existente.OcultarNaMatrizCurricular = true;` e `Update()` em lote, sem Disable/Insert-de-clone.
- **`RemoverMatrizCurricularService`**: mesma troca (`ParteDaMatrizCurricular = false` via `Update()` em vez de Disable+Insert).
- **`ConfiguradorDisciplinas/SaveService.cs`**: quando `ConfiguracaoFoiAlterada` é `true`, trocar o "desabilita todas + insere todas" por `Update()` de cada `RedeSerieDisciplina` existente com os campos novos. Manter Insert **só** para `RedeSerieId` genuinamente novos (disciplina configurada numa série que não tinha antes) e Disable **só** para associações realmente removidas (série tirada da configuração) — isso já é o comportamento atual para o caso "sem alteração geral", só precisa deixar de recriar tudo no caso "com alteração geral".
- **Efeito colateral esperado nos testes já existentes**: `SaveMatrizCurricularServiceTests.cs` tem pelo menos 1 teste (`Update_Retorna_Sucesso_E_Atualiza_Disciplina_Na_Matriz`) que verifica explicitamente que a linha antiga fica `Ativo=false` — isso muda para `Ativo` permanecer `true` com `Id` estável. A maioria dos outros testes já busca pelo estado final via filtros (`Ativo`+campos), não por identidade de `Id`, então devem continuar passando sem alteração.

---

### Fase 2 — Backend: tabela `RedeSerieDisciplinaEscola` (versionada por diff)

**Status:** concluída

**Correção pós-implementação:** o script original criou as colunas de auditoria com sufixo `Id` (`UsuarioInclusaoId`/`UsuarioUltimaAlteracaoId`/`UsuarioInativacaoId`), mas o EF Core (`MapperExtensions.HasState`, aplicado por `builder.IsStatefulEntity()`) mapeia essas propriedades para colunas **sem** sufixo — mesmo padrão de todas as demais entidades Stateful. Isso causava `Invalid column name 'UsuarioInativacao'` etc. no update. Corrigido via `cards/EFC-6515/sql/fix-colunas-auditoria-rede-serie-disciplina-escola.sql` (rename das 3 colunas). O script abaixo já está com os nomes corretos para quem for rodar em outro ambiente.

- Nova entidade `Domain/Entities/Stateful/RedeSerieDisciplinaEscola.cs` (StatefulEntity): FKs `RedeSerieDisciplinaId`/`EscolaId`, seguindo a convenção de nomes de coluna do irmão `RedeSerieDisciplina`/`CargaHoraria` (sem sufixo `Id` no `HasColumnName`). Navegação reversa `List<RedeSerieDisciplinaEscola>` em `RedeSerieDisciplina.cs` e `Escola.cs`.
- `Infra/Mapping/Stateful/RedeSerieDisciplinaEscolaMap.cs` + `Domain/Interfaces/IRedeSerieDisciplinaEscolaRepository.cs` + `Infra/Repositories/Stateful/RedeSerieDisciplinaEscolaRepository.cs`, com `GetByRedeSerieDisciplinaIds(List<int>)` (resto genérico via `Repository<T>`).
- Script SQL manual (sem EF Migrations — rodar à parte, conferindo nomes físicos exatos contra o banco antes):
  ```sql
  CREATE TABLE RedeSerieDisciplinaEscola (
     Id INT IDENTITY(1,1) PRIMARY KEY,
     Hash UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
     RedeSerieDisciplina INT NOT NULL FOREIGN KEY REFERENCES RedeSerieDisciplina(Id),
     Escola INT NOT NULL FOREIGN KEY REFERENCES Escola(Id),
     Ativo BIT NOT NULL DEFAULT 1,
     DataInclusao DATETIME NOT NULL DEFAULT GETDATE(),
     UsuarioInclusao INT NULL,
     DataUltimaAlteracao DATETIME NULL,
     UsuarioUltimaAlteracao INT NULL,
     DataInativacao DATETIME NULL,
     UsuarioInativacao INT NULL
  );

  ALTER TABLE RedeSerieDisciplina ADD TodasAsEscolas BIT NOT NULL DEFAULT 1;
  ALTER TABLE RedeSerieDisciplina ADD EscolasSaoExcecao BIT NOT NULL DEFAULT 0;
  ```
- **`SaveMatrizCurricularService`**: depois de atualizar os campos de `RedeSerieDisciplina` (Fase 1), resolver `escolaIds` a partir de `request.HashEscolas`. Para cada `RedeSerieDisciplina` afetada, buscar `RedeSerieDisciplinaEscola` ativas (`GetByRedeSerieDisciplinaIds`) e aplicar **diff** contra a lista requisitada (padrão `EscolaGerencialEscola`: `Disable()` só as que saíram, `Insert()` só as que entraram, preserva o resto). Quando `TodasAsEscolas == true`, a lista requisitada é sempre vazia (desabilita tudo que existir).

---

### Fase 3 — Backend: validação e endpoint de escolas

**Status:** concluída

- `ValidacaoMatrizCurricularService`: se `TodasAsEscolas == false`, `HashEscolas` não pode ser vazio; todos os hashes devem resolver a escolas ativas da rede/segmento da requisição.
- Novo método `GetEscolas(MatrizCurricularFilterRequest)` em `IFilterMatrizCurricularService`/`FilterMatrizCurricularService`, reaproveitando a resolução de `RedeSerieId`s já usada pelos outros filtros e a mesma junção com `EscolaSerie` usada em `GetEscolasPorRedeSerie` (mas retornando todas as escolas da rede/segmento/ano que ofertam alguma série do filtro, não só as já vinculadas a uma disciplina). Controller: `POST /matrizcurricular/filter-escolas`.

---

### Fase 4 — Backend: DTOs e leitura

**Status:** concluída

- `MatrizCurricularSaveRequest`/`UpdateRequest`: adicionar `bool TodasAsEscolas = true`, `bool EscolasSaoExcecao`, `List<Guid> HashEscolas`.
- `MatrizCurricularGetResponse`: adicionar `bool TodasAsEscolas`, `bool EscolasSaoExcecao`, `List<BaseResponse> EscolasSelecionadas` — **sem alterar** os campos `TodasAsEscolas`/`Escolas` já calculados usados pela listagem/tags hoje (avaliar renome se colidir — provavelmente o campo calculado existente vira redundante com o novo persistido e pode ser removido nesta mesma fase, já que passam a significar a mesma coisa; decidir durante a implementação, olhando para quem consome cada um na listagem).
- `GetDisciplinasMatrizCurricularService` (`GetConfiguradas`/`GetParaEdicao`): preencher os 3 campos novos a partir do `RedeSerieDisciplina` ativo e `RedeSerieDisciplinaEscolaRepository.GetByRedeSerieDisciplinaIds` + join para `Escola.Hash`/`Nome`.

---

### Fase 5 — Frontend: modelo, serviço e formulário

**Status:** concluída

- `models.ts`: `export type ModoAplicacaoEscola = 'TodasAsEscolas' | 'TodasAsEscolasExcetoSelecionadas' | 'ApenasEscolasSelecionadas';` (representação interna do formulário — mapeada para os 2 booleans do backend só na hora de montar o payload). Adicionar em `SaveRequest`/`UpdateRequest`: `todasAsEscolas: boolean`, `escolasSaoExcecao: boolean`, `hashEscolas: string[]`. Em `GetResponse`: os mesmos + `escolasSelecionadas: ResponseModel[]`.
- `matriz-curricular.service.ts`: novo `filterEscolas(request: MatrizCurricularFilterRequest)` → `POST /matrizcurricular/filter-escolas`.
- `formulario-matriz.component.ts`:
  - `modoAplicacaoOptions: SelectOption[]` fixo (3 itens, rótulos: "Todas as escolas" / "Todas as escolas exceto as selecionadas" / "Apenas escolas selecionadas").
  - `escolasDisponiveis: ResponseModel[]`, carregado via `filterEscolas(filterRequest)` em `startIncluir`/`startEditar`.
  - `form`: adicionar `modoAplicacaoEscola: ['TodasAsEscolas']`, `hashEscolas: [[]]` (controles internos, tipo `ModoAplicacaoEscola`/`string[]`).
  - `get exigeSelecaoEscolas(): boolean` → `form.get('modoAplicacaoEscola')?.value !== 'TodasAsEscolas'`.
  - `modoAplicacaoEscola.valueChanges`: ao voltar para `'TodasAsEscolas'`, `hashEscolas.setValue([])`.
  - `startEditar`: reconstruir `modoAplicacaoEscola` a partir da resposta —
    ```ts
    modoAplicacaoEscola = data.todasAsEscolas
      ? 'TodasAsEscolas'
      : (data.escolasSaoExcecao ? 'TodasAsEscolasExcetoSelecionadas' : 'ApenasEscolasSelecionadas');
    hashEscolas = data.escolasSelecionadas.map(e => e.hash);
    ```
    guardar originais para `isDirty`.
  - Payload de save (`saveInclusao`/`saveEdicao`) — mapear a representação interna para os campos do backend:
    ```ts
    const modo = this.form.get('modoAplicacaoEscola')!.value;
    todasAsEscolas: modo === 'TodasAsEscolas',
    escolasSaoExcecao: modo === 'TodasAsEscolasExcetoSelecionadas',
    hashEscolas: modo === 'TodasAsEscolas' ? [] : this.form.get('hashEscolas')!.value,
    ```
  - `isDirty`: comparar `modoAplicacaoEscola` e `hashEscolas` (ordenar antes de comparar arrays) contra os originais.
- `formulario-matriz.component.html`: logo abaixo do `single-select` de "Área do Conhecimento" (dentro de `.identificacao-box`):
  ```html
  <single-select
      [label]="'Aplica-se a'"
      [options]="modoAplicacaoOptions"
      [control]="form.get('modoAplicacaoEscola')"
  ></single-select>

  <app-multi-select-field
      *ngIf="exigeSelecaoEscolas"
      [control]="form.get('hashEscolas')"
      [options]="escolasDisponiveis"
      [placeholder]="'Selecione as escolas'"
  ></app-multi-select-field>
  ```

---

### Fase 6 — Backend: exportação Excel com total por escola

**Status:** concluída

- Escopo confirmado: **só a exportação muda** — a listagem em tela (`GetParaMatriz`) e `RecalcularTotaisPorSerieAsync`/`CargaHoraria` **não são alterados**. O cálculo por escola é feito só na hora de exportar, sem persistir nada novo em `CargaHoraria`.
- `ExportarMatrizCurricularService`/`GetParaExport`: para cada série exportada, resolver a lista real de escolas aplicáveis por disciplina (regra da seção "Modelo de dados" acima, usando `TodasAsEscolas`/`EscolasSaoExcecao`/`RedeSerieDisciplinaEscola`), calcular o total de CH de cada escola somando só as disciplinas que se aplicam a ela, e emitir **uma linha por escola** (em vez de uma linha por série) na planilha, com o total daquela escola específica. Escolas sem nenhuma disciplina restrita continuam com o mesmo total de hoje.

---

### Fase 7 — Testes de integração (backend)

**Status:** pendente

- Reescrever os testes de `SaveMatrizCurricularServiceTests`/`RemoverMatrizCurricularServiceTests` que hoje verificam `Ativo=false` da linha antiga após update — passam a verificar `Id` estável + campos atualizados via `Update()`.
- Novos cenários: salvar com "Apenas escolas selecionadas" (2 escolas) → `get-para-edicao` retorna `TodasAsEscolas=false`, `EscolasSaoExcecao=false`, as 2 escolas; salvar com "Todas exceto selecionadas" → `EscolasSaoExcecao=true` persistido e recuperado corretamente; alternar entre os 3 modos em saves sucessivos → `RedeSerieDisciplinaEscola` reflete diff correto (sem duplicar/perder linhas); validação de `HashEscolas` vazio/hash de escola de outra rede.
- Novo teste em `ConfiguradorDisciplinas` cobrindo que uma edição simples (ex.: mudar `NomeExibicao`) mantém o `Id` de `RedeSerieDisciplina` estável (não recria a linha).
- Novo teste de exportação: série com uma disciplina restrita a 1 escola entre 3 → Excel gerado com totais diferentes por escola.

## Verificação

1. Backend: `dotnet test EstruturaPedagogica.Test --filter "FullyQualifiedName~MatrizCurricular"` e `--filter "FullyQualifiedName~ConfiguradorDisciplinas"`.
2. Frontend: `ng serve` local, Matriz Curricular → Incluir/editar disciplina → confirmar select "Aplica-se a" abaixo de Área do Conhecimento, multi-select só aparece nos 2 modos que exigem escola, e que salvar/reabrir em modo Editar preserva exatamente o modo escolhido (inclusive distinguindo "exceto" de "apenas").
3. Rodar o script SQL manualmente contra o banco de desenvolvimento antes de testar o fluxo ponta-a-ponta (tabela nova + colunas novas não existem ainda).
4. Exportar a planilha de uma rede/segmento com pelo menos uma disciplina restrita a escolas específicas e conferir visualmente que os totais por escola batem com o esperado.
