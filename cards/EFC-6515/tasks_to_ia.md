# Tarefas — EFC-6515 (Matriz Curricular)

> Gerado a partir de `EFC-6515.tech.md`. Plano completo em `cards/EFC-6515/EFC-6515.tech.md`.

---

## T1 — Infraestrutura de Domain

**O que fazer:** Criar todos os DTOs, enums e interfaces necessários para a feature Matriz Curricular, e adicionar a constante `MatrizCurricular = 49` em `Funcionalidade.cs`.

**Contexto:** Nenhuma coluna nova no banco — os campos já existem em `RedeSerieDisciplina` e `CargaHoraria`. Esta fase não toca em Infra nem em Domain.Services; apenas declara os contratos que as fases seguintes implementarão. Arquivos a criar/modificar em `EstruturaPedagogica.Domain`:
- `Entities/Base/Funcionalidade.cs` — adicionar `public const int MatrizCurricular = 49;`
- `Enums/MatrizCurricular/FilterMatrizCurricularEnum.cs` — `FilterAno = 1, FilterRede = 2, FilterSegmento = 3, GetLista = 4`
- `DTO/MatrizCurricular/MatrizCurricularFilterRequest.cs` — `HashAnoLetivo`, `HashRede`, `HashSegmento` (Guid?); propriedades internas com `[JsonIgnore]`
- `DTO/MatrizCurricular/MatrizCurricularGetResponse.cs` — por disciplina: `HashDisciplina`, `NomeDisciplina`, `NomeDocumentosOficiais`, `AreaConhecimentoNome`, `EhEnriquecimentoCurricular`, lista de séries (`HashRedeSerie`, `NomeSerie`, `NomeNaMatriz`), flag `NomeVariaPorSerie`
- `DTO/MatrizCurricular/MatrizCurricularSaveRequest.cs` — `HashAnoLetivo`, `HashRede`, `HashSegmento`, `HashDisciplina`, `AreaConhecimentoId`, `EhEnriquecimentoCurricular`, `List<MatrizCurricularSerieSaveItem>` (com `HashRedeSerie`, `NomeDocumentosOficiais`, `CargaEmMinutos`, `CargaFormatada`)
- `DTO/MatrizCurricular/MatrizCurricularExport.cs` — colunas: NomeDisciplina, NomeNaMatriz, AreaConhecimento, Serie, EhEnriquecimentoCurricular, CargaHoraria, TotalSerie
- `Interfaces/Filters/IFilterMatrizCurricularRepository.cs` — `GetAnosLetivos`, `GetRedes`, `GetSegmentos`, `GetRedeSeries`, `GetRedeSerieId`
- `Interfaces/Stateful/IRedeSerieDisciplinaRepository.cs` — adicionar: `GetParaMatriz`, `GetDisciplinasDisponiveisParaMatriz`, `GetNomeDocumentosOficiaisRepetido`
- `Interfaces/Stateful/ICargaHorariaRepository.cs` — adicionar: `GetByRedeSerieIds`, `GetTotaisPorSerie`, `GetParaExport`

**Pronto quando:** Projeto compila sem erros após a criação de todos os arquivos listados.

**Status:** concluída

---

## T2 — Filtro _(seguir command `criar-filtro`)_

**O que fazer:** Implementar o filtro da Matriz Curricular end-to-end (repositório, serviço, validação, controller, Angular), seguindo rigorosamente o command `.claude/commands/criar-filtro.md` do repositório `estrutura-pedagogica`.

**Contexto:** Diferença crítica em relação ao Configurador de Disciplinas: o terceiro passo do filtro é `Segmento` (com `PossuiDocumentacaoPedagogica = true`), não `Agrupamento`; ano mínimo é 2015 (não 2024). Arquivos a criar:
- `EstruturaPedagogica.Infra/Repositories/Filters/FilterMatrizCurricularRepository.cs` — herda `Repository<RedeSerie>`, restrição `x.Serie.Segmento.PossuiDocumentacaoPedagogica == true`, ano `>= 2015`
- `EstruturaPedagogica.Domain.Services/MatrizCurricular/FilterService.cs` + `IFilterService.cs`
- `EstruturaPedagogica.Domain.Services/MatrizCurricular/ValidacaoService.cs` + `IValidacaoService.cs` — usa `GetRedeIdByFuncionalidadeUsuarioAutenticado(Funcionalidade.MatrizCurricular)`
- `EstruturaPedagogica.Api/Controllers/MatrizCurricularController.cs` — `[RequiredAuthorization(Funcionalidade.MatrizCurricular)]`, endpoints de filtro
- `frontend/.../features/matriz-curricular/services/matriz-curricular.service.ts`
- `frontend/.../features/matriz-curricular/listar/filtro-lista-matriz-curricular.ts` — `FilterConfig` com Ano Letivo (selectFirst), Rede, Segmento
- `frontend/.../features/matriz-curricular/listar/listar-matriz-curricular.component.ts/.html/.scss` — filtro funcional, listagem vazia por ora
- `frontend/.../features/matriz-curricular/matriz-curricular.routes.ts`
- `frontend/.../app-routing.module.ts` — rota lazy-load

**Pronto quando:** É possível acessar a tela de Matriz Curricular, aplicar filtro e receber resposta do backend (listagem vazia ainda é aceitável).

**Status:** concluída

---

## T3 — Listagem de disciplinas

**O que fazer:** Implementar a listagem de disciplinas da Matriz Curricular com agrupamento por disciplina, busca client-side e retorno dos dados auxiliares junto ao filtro.

**Contexto:** CAs cobertos: CA-02, CA-03, CA-04, CA-05, CA-06. Arquivos a modificar/criar:
- `RedeSerieDisciplinaRepository.cs` — adicionar `GetParaMatriz`: filtra `ParteDaMatrizCurricular = true`, `OcultarNaMatrizCurricular = false`, agrupa por disciplina com lista de séries e seus `NomeDocumentosOficiais`; detecta variação de nome entre séries
- `CargaHorariaRepository.cs` — adicionar `GetTotaisPorSerie`: retorna totais (`TotalDaSerie = true`) por `RedeSerieId`
- `Domain.Services/MatrizCurricular/GetDisciplinasService.cs` + interface — orquestra `GetParaMatriz` + `GetTotaisPorSerie`; inclui dados auxiliares (áreas do conhecimento, séries) na resposta
- Controller — endpoint `get-disciplinas-configuradas`
- `listar-matriz-curricular.component.html` — tabela completa: nome interno, nome na Matriz (primeiro + badge "outros" se `NomeVariaPorSerie`), área do conhecimento, séries como tags, check enriquecimento, check carga, botão editar; busca e paginação client-side

**Pronto quando:** Após aplicar o filtro, a listagem exibe as disciplinas da Matriz com todos os campos descritos no CA-02 e a busca client-side funciona.

**Status:** concluída

---

## T4 — Inclusão (side-panel)

**O que fazer:** Implementar o fluxo completo de inclusão de disciplinas na Matriz Curricular — backend (busca de disciplinas disponíveis + SaveNew) e frontend (side-panel de inclusão).

**Contexto:** CAs cobertos: CA-06, CA-07, CA-08, CA-09, CA-10, CA-11, CA-12, CA-13, CA-14. Seguir convenções de `.claude/commands/criar-service.md`. Pontos críticos:
- `GetDisciplinasDisponiveisParaMatriz`: disciplinas mãe não arquivadas; exclui visíveis (`ParteDaMatrizCurricular = true` e `OcultarNaMatrizCurricular = false`); inclui ocultas/removidas (CA-08, CA-19)
- `SaveNew`: Disable+Insert em `RedeSerieDisciplina` com `ParteDaMatrizCurricular = true`, `PossuiAvaliacoesRegulares = false`, `PossuiAvaliacoesDiversificadas = false` (CA-14); aplicar `StringExtensions.RemoverEspacosExtras()` no nome; verificar unicidade de `NomeDocumentosOficiais` por série (CA-17); Disable+Insert em `CargaHoraria` por série + persistir total
- Side-panel Angular: dropdown de disciplinas mãe (CA-08), pré-seleção de todas as séries com nome padrão (CA-09), toggle enriquecimento curricular off padrão (CA-10), atalho "aplicar a todas" (CA-12), aviso sobre ausência de avaliações (CA-13), validação de ao menos uma série (CA-11)

**Pronto quando:** É possível incluir uma nova disciplina na Matriz, ela aparece na listagem com os dados informados, e a tentativa de salvar com nome duplicado por série retorna erro.

**Status:** concluída

---

## T5 — Edição (side-panel)

**O que fazer:** Implementar o fluxo de edição de disciplinas na Matriz Curricular — backend (SaveUpdate + CargaHorariaParser) e frontend (side-panel de edição).

**Contexto:** CAs cobertos: CA-15, CA-16, CA-17, CA-19, CA-20, CA-21, CA-22. Pontos críticos:
- `SaveUpdate`: disciplina não trocável (recebe `HashRedeSerieDisciplina`); rejeitar sem alteração; mesma lógica Disable+Insert; recalcular e persistir total da série
- `CargaHorariaParser` (novo, em `EstruturaPedagogica.Extensions/`): parse dos 3 formatos (inteiro, hh:mm, decimal com `,`/`.`) para minutos; formatação reversa mantendo o formato original digitado
- Side-panel Angular: sem dropdown de disciplina (exibe nome fixo); botão salvar habilitado apenas com `dirty`; campos de carga com parsing dos 3 formatos; total da série recalculado em tempo real em hh:MM

**Pronto quando:** É possível editar nome, área do conhecimento, enriquecimento curricular e carga horária de uma disciplina existente na Matriz; o total da série atualiza em tempo real; o botão salvar permanece desabilitado sem alterações.

**Status:** concluída

---

## T6 — Remoção da Matriz

**O que fazer:** Implementar a remoção de uma disciplina (ou série) da Matriz Curricular sem afetar o Configurador de Disciplinas.

**Contexto:** CA coberto: CA-18. O `RemoverService` deve fazer Disable na `RedeSerieDisciplina` com `ParteDaMatrizCurricular = true` e inserir novo registro com `ParteDaMatrizCurricular = false`, preservando `PossuiAvaliacoesRegulares` e `PossuiAvaliacoesDiversificadas` intactos. Deve também Disable nas `CargaHoraria` correspondentes e recalcular o total da série. **Não deve alterar** nenhuma `EscolaSerieDisciplina` ou turma. Adicionar botão/confirmação de remoção no componente de edição Angular.

**Pronto quando:** Ao remover uma disciplina da Matriz, ela some da listagem mas permanece ativa com suas parametrizações no Configurador de Disciplinas.

**Status:** concluída

---

## T7 — Exportação _(seguir command `criar-exportacao`)_

**O que fazer:** Implementar a exportação dos dados da Matriz Curricular em `.xlsx`, seguindo rigorosamente o command `.claude/commands/criar-exportacao.md` do repositório `estrutura-pedagogica`.

**Contexto:** CA coberto: CA-23. Linha por combinação Série × Disciplina. Colunas: NomeDisciplina, NomeNaMatriz (NomeDocumentosOficiais), AreaConhecimento, Serie, EhEnriquecimentoCurricular, CargaHoraria, TotalSerie. Arquivo: `Matriz_Curricular.xlsx`, aba `"Matriz Curricular"`. Adicionar método `GetParaExport` em `RedeSerieDisciplinaRepository` e `CargaHorariaRepository`; criar `ExportarMatrizCurricularService`; endpoint `export` no controller; botão de exportação no componente de listagem Angular.

**Pronto quando:** Ao clicar em exportar, é gerado um arquivo `.xlsx` com uma linha por Série × Disciplina e os dados corretos.

**Status:** concluída

---

## T8 — Script SQL (Funcionalidade + MenuItem)

**O que fazer:** Criar os scripts SQL para inserir a Funcionalidade `MatrizCurricular` (Id=49) e o MenuItem correspondente no banco de dados.

**Contexto:** Infraestrutura — sem CA associado. Nenhuma coluna nova é necessária (campos já existem). Apenas insert em `Funcionalidade` e `MenuItem`. Usar a skill `/menu-item-sql` para gerar o script do MenuItem. Gravar os scripts em `cards/EFC-6515/sql/`. **Atenção:** verificar antes da execução se o Id=49 já está em uso no banco de produção.

**Pronto quando:** Scripts SQL criados em `cards/EFC-6515/sql/add-funcionalidade-matriz-curricular.sql` e `cards/EFC-6515/sql/add-menu-item-matriz-curricular.sql`.

**Status:** concluída

---

## T9 — Testes de integração

**O que fazer:** Criar os testes de integração para todos os serviços da Matriz Curricular, seguindo `.claude/commands/criar-testes.md` do repositório `estrutura-pedagogica`.

**Contexto:** Herdar de `BaseTest`, usar `AddInMemoryDbContext()`, criar fixtures em `Test/Integration/Fixtures/Entities/MatrizCurricularFixtures.cs`. Arquivos a criar em `EstruturaPedagogica.Test/Integration/Scenarios/MatrizCurricular/`:
- `FilterServiceTests.cs` — filtro com `PossuiDocumentacaoPedagogica`, ano mínimo 2015, validação de acesso
- `GetDisciplinasServiceTests.cs` — filtragem de `OcultarNaMatrizCurricular`, agrupamento, flag `NomeVariaPorSerie`
- `SaveServiceTests.cs` — SaveNew (PossuiAvaliacoesRegulares=false, carga por série, total), Update (Disable+Insert preservando campos do Configurador), unicidade de NomeDocumentosOficiais por série
- `RemoverServiceTests.cs` — remoção sem afetar registros do Configurador
- `ExportarServiceTests.cs` — linha por Série × Disciplina, valores corretos de carga e total

**Pronto quando:** Todos os testes passam com `dotnet test`.

**Status:** concluída
