# Merge Check — estrutura-pedagogica | projetos/DiarioDeClasse → homolog

> Gerado em: 2026-06-19 10:52
> Fetch realizado em: 2026-06-19 10:52

## Resultado

**Status:** COM CONFLITOS ⚠️

**Branch origem:** `projetos/DiarioDeClasse`
**Branch destino:** `homolog`
**Ancestral comum:** `c316330308499b28376f7b2e55a825e86036db4b`
**Commits a enviar para homolog:** 30
**Commits de homolog que o branch ainda não tem:** 508

> ⚠️ **Atenção crítica:** o branch está **508 commits atrás de homolog**. Homolog avançou significativamente com múltiplos merges de outros projetos (NovoLancamentoFrequencia, Q2-PED, Q3-PED, ConfiguradorDisciplinas, AlocacaoProfessoresMonitores, ConfiguradorFrentes, DiaLetivoExtra, LancamentoEventos e outros). O cenário de merge direto é viável — veja a seção de ação recomendada.

---

## Arquivos em conflito (13)

### 1. `backend/EstruturaPedagogica.Domain/Interfaces/Base/IDisciplinaRepository.cs`

**Dificuldade estimada:** média
**Causa provável:** adição paralela de métodos — intenções diferentes, não sobrepostas

**Branch adiciona:**
```csharp
Task<Guid> GetHashDisciplinaMae(Guid hashDisciplina);
```

**Homolog adiciona** (feature ConfiguradorDisciplinas / ConfiguradorFrentes):
```csharp
Task<List<BaseResponse>> GetParaConfiguradorDisciplinas(
   Guid hashRede,
   List<int> redesDoUsuario,
   List<int> disciplinasConfiguradas);

Task<int> GetIdParaConfiguradorDisciplina(ConfiguradorDisciplinasSaveRequest request);

Task<Disciplina> GetFrentePorHashERede(Guid hashFrente, int redeId);
```

**Histórico no branch:** `8615833c4 EFC-6443`
**Histórico em homolog:** `0de2bbf8b configurador-frentes (1a versão)`, `dd9413e6b Refatoração backend`

**Ação sugerida:** Manter **todos os métodos de ambos os lados** na interface. São métodos de propósitos distintos sem sobreposição. Adicionar os métodos do branch antes ou depois dos métodos do homolog — sem risco de quebra.

---

### 2. `backend/EstruturaPedagogica.Domain/Interfaces/Stateful/IAlunoFrequenciaRepository.cs`

**Dificuldade estimada:** média
**Causa provável:** adição paralela de métodos — painel do aluno (homolog) vs. diário de classe (branch)

**Branch adiciona:**
```csharp
Task<List<AlunoFrequenciaBulkResponse>> GetBulkParaDiarioClasse(
   int escolaId, DateTime dataInicio, DateTime dataFim, List<int> pessoaIds);
```

**Homolog adiciona** (feature NovoLancamentoFrequencia):
```csharp
Task<List<AlunoFrequenciaParaPainelResponse>> GetFaltasAtrasosPorPessoa(int pessoaId, int anoLetivo);
Task<int> CountFaltasPorPessoa(int pessoaId, int anoLetivo);
Task<int> CountAtrasosPorPessoa(int pessoaId, int anoLetivo);
Task<Dictionary<int, (int Faltas, int Atrasos)>> GetContadoresPorPessoas(List<int> pessoaIds, int anoLetivo);
Task<Dictionary<int, List<AlunoFrequenciaParaPainelResponse>>> GetFaltasAtrasosPorPessoas(List<int> pessoaIds, int anoLetivo);
```

**Histórico no branch:** `c40eb921f WIP`
**Histórico em homolog:** `fe32c5139 Reapply NovoLancamentoFrequencia`, `70e7af08c Merge NovoLancamentoFrequencia`

**Ação sugerida:** Manter **todos os métodos de ambos os lados**. Adições paralelas independentes.

---

### 3. `backend/EstruturaPedagogica.Domain/Interfaces/Stateful/IAlunoSaidaAntecipadaRepository.cs`

**Dificuldade estimada:** média
**Causa provável:** adição paralela de métodos — diário de classe (branch) vs. painel do aluno (homolog)

**Branch adiciona:**
```csharp
Task<List<AlunoSaidaAntecipadaBulkResponse>> GetBulkParaDiarioClasse(
   List<int> aulaEventoIds, List<int> pessoaIds);
```

**Homolog adiciona** (feature NovoLancamentoFrequencia):
```csharp
Task<List<SaidaAntecipadaParaPainelResponse>> GetParaDetalheAluno(int pessoaId, int anoLetivo);
Task<int> CountPorPessoa(int pessoaId, int anoLetivo);
Task<Dictionary<int, int>> GetCountsPorPessoas(List<int> pessoaIds, int anoLetivo);
Task<Dictionary<int, List<SaidaAntecipadaParaPainelResponse>>> GetParaDetalheAlunos(List<int> pessoaIds, int anoLetivo);
```

**Histórico no branch:** `f25b71cef Caracter para representar SaidaAntecipada`
**Histórico em homolog:** `fe32c5139 Reapply NovoLancamentoFrequencia`

**Ação sugerida:** Manter **todos os métodos de ambos os lados**.

---

### 4. `backend/EstruturaPedagogica.Domain/Interfaces/Stateful/IAulaEventoRepository.cs`

**Dificuldade estimada:** média (2 blocos de conflito)
**Causa provável:** adição paralela — imports de namespaces distintos + métodos de propósitos distintos

**Conflito 1 — imports:**

Branch usa:
```csharp
using EstruturaPedagogica.Domain.DTO.DiarioDeClasse;
```

Homolog usa:
```csharp
using EstruturaPedagogica.Domain.DTO.AlunoFrequencia;
using EstruturaPedagogica.Domain.DTO.DiaLetivoExtra;
```

**Ação:** Manter **todos os três usings**.

**Conflito 2 — métodos:**

Branch adiciona:
```csharp
Task<List<AulaEventoParaDiarioClasseResponse>> GetParaDiarioClasse(
   int turmaId, int disciplinaId,
   DateTime dataInicio, DateTime dataFim);
```

Homolog adiciona (Q2-PED / DiaLetivoExtra / NovoLancamentoFrequencia):
```csharp
Task<List<AulaEventoParaPainelResponse>> GetParaPainelAluno(int turmaId, int anoLetivo);
Task<Dictionary<int, List<AulaEventoParaPainelResponse>>> GetParaPainelAlunoLote(List<int> turmaIds, int anoLetivo);
Task<List<DiaLetivoExtraTurmaRaw>> GetTurmasPorDiasLetivosExtras(List<int> diaLetivoExtraIds);
Task<List<AulaEventoFormularioRaw>> GetAulaEventosParaEdicaoDiaLetivoExtra(int diaLetivoExtraId);
Task<List<TurmaDisciplinaRaw>> GetDisciplinasPorTurmaNaData(DateTime data, List<int> turmaIds);
Task<List<int>> GetTurmasComAulaDiaInteiroNaData(DateTime data, List<int> turmaIds);
```

**Histórico no branch:** `c40eb921f WIP`
**Histórico em homolog:** múltiplos commits de DiaLetivoExtra/EFC-6411/NovoLancamentoFrequencia

**Ação:** Manter **todos os métodos de ambos os lados**. Adições independentes.

---

### 5. `backend/EstruturaPedagogica.Domain/Interfaces/Stateful/IProfessorTurmaDisciplinaRepository.cs`

**Dificuldade estimada:** média
**Causa provável:** adição paralela de métodos

**Branch adiciona:**
```csharp
Task<string> GetNomeProfessorDaTurma(int turmaId, int disciplinaId);
```

**Homolog adiciona** (AlocacaoProfessoresMonitores / NovoLancamentoFrequencia):
```csharp
Task<List<int>> GetTurmaIdParaLancamentoFrequencia(LancamentoFrequenciaFilterRequest request, List<int> escolasDoUsuario);
Task<List<AlocacaoProfissionalItem>> GetMaisRecenteParaAlocacao(int turmaId, List<int> disciplinaIds);
Task<List<AlocacaoProfissionalItem>> GetParaExportacao(List<int> turmaIds, List<int> disciplinaIds);
Task<ProfessorTurmaDisciplina> GetPorTurmaDisciplina(int turmaId, int disciplinaId);
Task DetachAndDisable(ProfessorTurmaDisciplina entity);
```

**Histórico no branch:** `c40eb921f WIP`
**Histórico em homolog:** `91ed680be AlocacaoProfessoresMonitores`, `70e7af08c NovoLancamentoFrequencia`, `44f9c7660`, `5228a30b9`, `e7d98f659`

**Ação:** Manter **todos os métodos de ambos os lados**.

---

### 6. `backend/EstruturaPedagogica.Infra/Repositories/Base/DisciplinaRepository.cs`

**Dificuldade estimada:** média
**Causa provável:** implementações paralelas de métodos distintos na mesma classe

**Branch implementa:** `GetHashDisciplinaMae(Guid hashDisciplina)` — retorna hash da disciplina mãe via EF.

**Homolog implementa:** `GetParaConfiguradorDisciplinas(...)`, `GetIdParaConfiguradorDisciplina(...)`, `GetFrentePorHashERede(...)` — queries para o configurador de frentes/disciplinas.

**Histórico no branch:** `8615833c4 EFC-6443`
**Histórico em homolog:** `0de2bbf8b configurador-frentes`, `dd9413e6b Refatoração backend`

**Ação:** Manter **ambas as implementações**. As implementações do branch devem ser inseridas no arquivo ao lado das implementações do homolog — sem sobreposição de lógica.

---

### 7. `backend/EstruturaPedagogica.Infra/Repositories/Stateful/AlunoSaidaAntecipadaRepository.cs`

**Dificuldade estimada:** média
**Causa provável:** implementações paralelas de métodos distintos

**Branch implementa:** `GetBulkParaDiarioClasse(List<int> aulaEventoIds, List<int> pessoaIds)` — query otimizada para bulk no diário.

**Homolog implementa:** `GetParaDetalheAluno`, `CountPorPessoa`, `GetCountsPorPessoas`, `GetParaDetalheAlunos` — queries para o painel do aluno (NovoLancamentoFrequencia).

**Histórico no branch:** `f25b71cef Caracter para representar SaidaAntecipada`
**Histórico em homolog:** `fe32c5139 Reapply NovoLancamentoFrequencia`

**Ação:** Manter **ambas as implementações**. São métodos de domínios distintos na mesma repository.

---

### 8. `backend/EstruturaPedagogica.Infra/Repositories/Stateful/AulaEventoRepository.cs`

**Dificuldade estimada:** média
**Causa provável:** implementações paralelas de métodos distintos

**Branch implementa:** métodos para o diário de classe (GetParaDiarioClasse, etc.).

**Homolog implementa:** `GetParaPainelAluno`, `GetParaPainelAlunoLote` (e mais) para o painel do aluno e dias letivos extras.

**Histórico no branch:** `c40eb921f WIP`
**Histórico em homolog:** múltiplos commits de DiaLetivoExtra/EFC-6411/NovoLancamentoFrequencia/e5df2ddf9

**Ação:** Manter **ambas as implementações**.

---

### 9. `backend/EstruturaPedagogica.Infra/Repositories/Stateful/ProfessorTurmaDisciplinaRepository.cs`

**Dificuldade estimada:** média
**Causa provável:** implementações paralelas de métodos distintos

**Branch implementa:** `GetNomeProfessorDaTurma(int turmaId, int disciplinaId)`.

**Homolog implementa:** `GetTurmaIdParaLancamentoFrequencia`, `GetMaisRecenteParaAlocacao`, `GetParaExportacao`, `GetPorTurmaDisciplina`, `DetachAndDisable` (AlocacaoProfessoresMonitores).

**Histórico no branch:** `c40eb921f WIP`
**Histórico em homolog:** `bed6d313f Demais ajustes`, `91ed680be AlocacaoProfessoresMonitores`, múltiplos

**Ação:** Manter **ambas as implementações**.

---

### 10. `frontend/src/app/app-routing.module.ts`

**Dificuldade estimada:** média
**Causa provável:** adição paralela de rotas lazy — branch adiciona a rota do diário, homolog adiciona várias outras

**Branch adiciona:**
```ts
{
  path: "diario-de-classe",
  loadChildren: () =>
    import("./features/diario-de-classe/diario-de-classe.routes").then(
      (r) => r.DIARIO_DE_CLASSE_ROUTES,
    ),
}
```

**Homolog adiciona** (múltiplos projetos):
```ts
{ path: "liberacao-boletins", loadChildren: () => import("./features/liberacao-boletins/...") },
{ path: "dia-letivo-extra",   loadChildren: () => import("./features/dia-letivo-extra/...") },
{ path: path.ConfiguradorDisciplinas.Base, loadChildren: () => import("./features/configurador-disciplinas/...") },
{ path: path.AlocacaoProfessoresMonitores.Base, loadChildren: () => import("./features/alocacao-professores-monitores/...") },
{ path: path.ConfiguradorFrentes.Base, loadChildren: () => import("./features/configurador-frentes/...") },
```

**Histórico no branch:** `af48943f4 WIP - Base front`
**Histórico em homolog:** múltiplos (EFC-6219, EFC-6305, ConfiguradorDisciplinas, AlocacaoProfessoresMonitores, ConfiguradorFrentes)

**Ação:** Manter **todas as rotas de ambos os lados**. O registro de rotas é aditivo — cada entry é independente. Inserir a entrada do diário de classe junto com as demais.

---

### 11. `frontend/src/shared/components/listbox-transfer/listbox-transfer.component.ts`

**Dificuldade estimada:** média
**Causa provável:** adição paralela de métodos com nomes diferentes para operações similares

**Branch adiciona:**
```ts
selectAll(): void { ... }  // seleciona todos para a direita
clearAll(): void { ... }   // devolve tudo para a esquerda
```

**Homolog adiciona** (EFC-6444):
```ts
moveAll(from: 'left' | 'right'): void { ... }  // move todos de um lado para o outro
```

**Histórico no branch:** `23bf70f21 listbox - selectAll/clearAll`
**Histórico em homolog:** `fac630c83 EFC-6444`, `70e7af08c Merge NovoLancamentoFrequencia`

**Ação:** Verificar se `selectAll/clearAll` e `moveAll` são semanticamente equivalentes ou complementares. Se `moveAll('left')` faz o mesmo que `clearAll()` e `moveAll('right')` faz o mesmo que `selectAll()`, discutir com o time qual API manter. Se têm comportamentos distintos (ex: `selectAll` move por referência e `moveAll` faz cópia), manter ambos. **Esta é a única situação que pode exigir decisão de produto/time antes de resolver.**

---

### 12. `frontend/src/shared/filtro/filtro/filtro.component.scss`

**Dificuldade estimada:** baixa
**Causa provável:** ajustes de estilo paralelos no mesmo bloco CSS

**Conflito 1 — bloco `.filter-container` (ou equivalente):**

| Propriedade | Branch | Homolog |
|------------|--------|---------|
| `box-shadow` | `0 1px 8px rgba(0, 0, 0, 0.06)` | `0px 0px 8px rgba(0, 23, 31, 0.2)` |
| `border` | `1px solid $neutral-l2` | _(ausente)_ |

**Conflito 2 — bloco `.content-filter`:**

| Propriedade | Branch | Homolog |
|------------|--------|---------|
| `margin-top` | _(ausente)_ | `16px` |

**Histórico no branch:** `ce3bb27cb`, `1eb4fed70`, `26ef6d52d`
**Histórico em homolog:** `fa74dbd15 EFC-6429`, `55378c0a0`, `fac630c83 EFC-6444`

**Ação:** Estilo é uma decisão visual — optar por qual versão fica melhor no contexto atual do filtro do diário. Sugestão: manter o `border` e o `box-shadow` mais suave do branch (mais moderno), e adicionar o `margin-top: 16px` do homolog se o espaçamento fizer sentido.

---

### 13. `frontend/src/shared/services/pathing.service.ts`

**Dificuldade estimada:** média
**Causa provável:** adição paralela de entradas no objeto de rotas

**Branch adiciona:**
```ts
DiarioDeClasse: {
  Base: 'diario-de-classe',
  Listar: 'listar',
  Configurar: 'configurar',
}
```

**Homolog adiciona** (ConfiguradorFrentes / AlocacaoProfessoresMonitores):
```ts
AlocacaoProfessoresMonitores: {
  Base: "alocacao-professores-monitores",
  Listar: "listar",
  Detalhe: "detalhe",
},
ConfiguradorFrentes: {
  Base: "configurador-frentes",
  Listar: "listar",
},
```

**Histórico no branch:** `26ef6d52d`, `af48943f4`
**Histórico em homolog:** `0cc34c36d`, `91ed680be`, `4b0c63140`, `d7209a2d3`, múltiplos

**Ação:** Manter **todas as entradas de ambos os lados**. São chaves independentes no mesmo objeto.

---

## Resumo de arquivos divergentes (sem conflito)

Além dos 13 arquivos em conflito, há **156 arquivos** que diferem entre os branches mas sem conflito — são arquivos adicionados exclusivamente no branch (DTOs, services e controllers do DiarioDeClasse) ou exclusivamente em homolog (features de outros projetos). Esses arquivos serão mesclados automaticamente pelo git.

Exemplos de arquivos do branch que entrarão no homolog:
- `backend/.../DiarioDeClasse/` — controllers, services, interfaces, DTOs
- `frontend/.../diario-de-classe/` — componentes, rotas, serviços do diário

---

## Ação recomendada

### Opção recomendada — Merge de homolog no branch + resolução local

Com 508 commits de diferença, **rebase é impraticável**. A abordagem mais segura é mergear homolog no seu branch, resolver os conflitos localmente e então solicitar o merge:

```powershell
# 1. Garantir que o fetch já foi feito (já foi — o check fez isso)
# 2. No seu branch projetos/DiarioDeClasse, mergear homolog:
git merge origin/homolog

# 3. O git abrirá os 13 arquivos em conflito. Para cada um:
#    - Manter AMBOS os lados (ver ações individuais acima)
#    - Exceções: listbox-transfer.component.ts (verificar semântica) e filtro.component.scss (escolha visual)
git add <arquivo-resolvido>

# 4. Quando todos os conflitos estiverem resolvidos:
git merge --continue
# (o git pedirá uma mensagem de commit para o merge commit — pode usar a gerada automaticamente)

# 5. Push do branch atualizado:
git push origin projetos/DiarioDeClasse

# 6. Abrir/atualizar o PR para homolog
```

> **Por que não rebase?** Com 30 commits de WIP no branch e 508 em homolog, o rebase repetiria cada commit do branch sobre o topo de homolog, potencialmente causando conflitos em cada passo. O merge commit é mais seguro e preserva o histórico sem reescrever os SHA dos commits existentes.

### Ordem de resolução sugerida

Resolver nesta ordem para minimizar erros de compilação intermediários:

1. **`pathing.service.ts`** — adicionar as entradas; sem lógica de negócio
2. **`app-routing.module.ts`** — adicionar a rota do diário; sem lógica de negócio
3. **`filtro.component.scss`** — escolha visual; sem impacto funcional
4. **`IAlunoFrequenciaRepository.cs`** + **`IAlunoSaidaAntecipadaRepository.cs`** + **`IAulaEventoRepository.cs`** + **`IProfessorTurmaDisciplinaRepository.cs`** + **`IDisciplinaRepository.cs`** — interfaces: adicionar os métodos do branch
5. **`DisciplinaRepository.cs`** + **`AlunoSaidaAntecipadaRepository.cs`** + **`AulaEventoRepository.cs`** + **`ProfessorTurmaDisciplinaRepository.cs`** — implementações: adicionar os métodos do branch
6. **`listbox-transfer.component.ts`** — verificar semântica de `selectAll/clearAll` vs `moveAll` antes de resolver

---

## Comandos úteis para resolução

```powershell
# Ver diff completo de um arquivo específico durante a resolução
git diff HEAD origin/homolog -- backend/.../IDisciplinaRepository.cs

# Verificar o que cada commit de homolog fez num arquivo específico
git log -p origin/homolog..HEAD -- <arquivo>

# Ver o arquivo como está em homolog (sem tocar no working tree)
git show origin/homolog:<caminho/relativo/ao/arquivo>

# Ver o arquivo como está no branch atual
git show HEAD:<caminho/relativo/ao/arquivo>

# Após resolver manualmente cada arquivo:
git add <arquivo>

# Quando todos resolvidos, finalizar o merge:
git merge --continue

# Se quiser abortar e voltar ao estado original:
git merge --abort
```

## Notas

- **Todos os 13 conflitos são aditivos** (cada lado adiciona métodos/rotas/paths distintos) — com exceção do `listbox-transfer.component.ts` que pode exigir alinhamento de API com o time, e `filtro.component.scss` que exige decisão visual.
- **Nenhum conflito envolve lógica de negócio sobreposta** — os dois lados modificam o mesmo arquivo por razões diferentes, não implementam a mesma coisa de jeitos diferentes.
- O branch `projetos/DiarioDeClasse` adiciona uma feature completa (Diário de Classe) enquanto homolog recebeu várias outras features em paralelo (NovoLancamentoFrequencia, DiaLetivoExtra, ConfiguradorDisciplinas, ConfiguradorFrentes, AlocacaoProfessoresMonitores, LancamentoEventos).
- Após o merge, recomenda-se fazer o build local e rodar os testes de integração antes de abrir o PR.
