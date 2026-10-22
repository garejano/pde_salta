# Criar Filtro

> **Skill multi-repositório** — este workspace (`pde_salta`) cobre vários projetos.  
> O primeiro passo obrigatório é identificar o repositório-alvo em `repository_map.md`
> e carregar o mapa de frontend correspondente antes de qualquer exploração de código.

Quando o usuário pedir para "Crie", "Implemente" ou "Adicione" um filtro para uma funcionalidade, siga este processo.

---

## Inputs esperados

Antes de iniciar, confirme que você possui todas as informações abaixo. Se alguma estiver faltando, pergunte ao usuário **antes** de criar qualquer arquivo:

- **Repositório-alvo** — se o usuário não informar, derive a partir das palavras-chave do card usando `repository_map.md`.
- **Funcionalidade** — nome da funcionalidade em PascalCase (ex.: `ConfiguradorFrentes`). Deve corresponder a um valor do enum `Funcionalidade` do projeto (quando existir).
- **Passos do filtro** — lista ordenada dos campos que compõem o filtro (ex.: `Rede → Escola → Série → Turma`). Cada passo corresponde a um valor do enum de filtro e a um método no repositório.
- **Entidade-base** — entidade C# de ponto de partida para o `GetQueryable` do repositório. O repositório herda da classe base de repositório do projeto usando essa entidade.
- **Regras adicionais** *(opcional)* — restrições específicas que devem ser aplicadas no `GetQueryable` base. Se não houver, informe explicitamente.

---

## Processo

### 0. Identificação do repositório e exploração prévia

**0.1 — Identificar o repositório-alvo**

Leia `repository_map.md` e localize o repositório com base nas palavras-chave do card/funcionalidade.  
Anote:
- `REPO_PATH` — caminho base (ex.: `c:/projects/estrutura-pedagogica`)
- `REPO_STACK` — stack do repositório (ex.: `.NET 8 · Angular 20 · SQL Server`)
- `FRONTEND_MAP` — caminho do mapa Angular em `frontend-maps/<repo>-angular-map.md` (se existir)

**0.2 — Carregar o mapa de frontend (se disponível)**

Antes de explorar arquivos individuais:
1. Verifique se existe `frontend-maps/<repo>-angular-map.md`
2. Cheque `frontend-maps/changelog.md` — se o mapa tiver mais de 30 dias, avise o usuário e sugira `/bench-scan-front`
3. Carregue o mapa para entender a estrutura de features, services e rotas existentes

**0.3 — Explorar diretórios de destino**

Explore as pastas do repositório-alvo para identificar os **namespaces e convenções exatos** usados em arquivos existentes:

- Backend:
  - `{REPO_PATH}/backend/{Projeto}.Domain/DTO/{Funcionalidade}/` (ou equivalente)
  - `{REPO_PATH}/backend/{Projeto}.Domain/Enums/{Funcionalidade}/`
  - `{REPO_PATH}/backend/{Projeto}.Domain/Interfaces/Filters/`
  - `{REPO_PATH}/backend/{Projeto}.Infra/Repositories/Filters/`
  - `{REPO_PATH}/backend/{Projeto}.Domain.Services/{Funcionalidade}/`
  - `{REPO_PATH}/backend/{Projeto}.Api/Controllers/`
- Frontend (derive o path do mapa carregado ou explore `frontend/src/app/features/`):
  - Feature da funcionalidade e seus services

> ⚠️ **Não assuma convenções do `estrutura-pedagogica` em outros repositórios.**  
> Cada projeto pode usar nomes distintos para `BaseResponse`, `QueryableAtivos`, `IBaseRepository`, `ServiceResult`, etc.  
> Sempre derive de arquivos existentes no mesmo diretório.

**0.4 — Inventariar artefatos existentes**

Para cada artefato da lista abaixo, verifique se já existe no repositório-alvo:
- Enum de passos de filtro (`Filter{Funcionalidade}Enum` ou equivalente)
- DTO de requisição (`{Funcionalidade}FilterRequest` ou equivalente)
- Interface e implementação do repositório de filtro
- Interface e implementação do serviço de filtro
- Interface e implementação do serviço de validação
- Controller da funcionalidade
- Módulo/pasta de feature no frontend
- Service de filtro Angular
- Configuração de filtro Angular
- Componente de página com filtro

**0.5 — Apresentar plano e aguardar confirmação**

Liste explicitamente o que será **criado** e o que será **reaproveitado**.  
Se existirem dúvidas sobre a entidade-base, relações ou regras específicas, pergunte ao usuário.

**Aguarde confirmação do usuário antes de criar qualquer arquivo.**

---

### 1. Enum de passos — `Domain/Enums/{Funcionalidade}/Filter{Funcionalidade}Enum.cs`

- Um valor por passo do filtro, numerados a partir de 1, em ordem crescente
- O último valor deve ser o passo de uso da listagem (ex.: `GetLista = N`)
- A lógica de `GetQueryable` usa comparações `passo > FilterEnum.PassoX` para acumular filtros

```csharp
public enum Filter{Funcionalidade}Enum
{
   FilterPasso1 = 1,
   FilterPasso2 = 2,
   // ...
   GetLista = N
}
```

---

### 2. DTO de requisição — `Domain/DTO/{Funcionalidade}/{Funcionalidade}FilterRequest.cs`

- Uma propriedade por passo do filtro, usando `Guid?` para selects simples ou `List<Guid>` para multi-selects
- Propriedades de uso interno (preenchidas pelo `ValidacaoService`, não serializadas pelo frontend) devem ter `[JsonIgnore]`:
  - `List<int> EscolasDoUsuario` — quando o filtro exigir controle de acesso por escola
  - `bool PossuiVisaoCoordenacao` — quando o filtro tiver visões distintas por perfil
- Omita propriedades de uso interno que não forem aplicáveis à funcionalidade

---

### 3. Interface do repositório — `Domain/Interfaces/Filters/IFilter{Funcionalidade}Repository.cs`

- Herda a interface base de repositório do projeto (inspecione arquivos existentes em `Domain/Interfaces/Filters/` para determinar o nome correto)
- Um método `Task<List<{TipoResposta}>> Get{Passo}(...)` por passo do filtro, recebendo `({Funcionalidade}FilterRequest request, Filter{Funcionalidade}Enum passo)`
- Não adicione métodos além dos passos definidos

---

### 4. Implementação do repositório — `Infra/Repositories/Filters/Filter{Funcionalidade}Repository.cs`

- Use primary constructor do C# 12
- Herda a classe base de repositório do projeto e implementa `IFilter{Funcionalidade}Repository`
- Método privado `GetQueryable(request, passo)`:
  - Começa com o método de query de ativos do projeto (ex.: `QueryableAtivos()` — verifique o nome exato em outros repositórios do mesmo projeto) aplicando as restrições invariantes
  - **Os filtros são sequenciais por padrão:** cada passo inclui todos os filtros dos passos anteriores. Para cada passo acima do primeiro, adiciona `if (passo > FilterEnum.PassoX) query = query.Where(...)`. Filtros opcionais acrescentam a condição `&& request.HashX.HasValue` (ou `.Count > 0` para listas) antes de aplicar o `Where`
  - Aplica as regras adicionais informadas pelo usuário
- Um método público por passo: cada um chama `GetQueryable` e projeta para o tipo de resposta do projeto com `Hash` e `Descricao`; aplique `Distinct()` e `OrderBy` conforme a semântica do dado
- Adicione `<summary>` em cada método público e no `GetQueryable`

---

### 5. Interface do serviço — `Domain.Services/{Funcionalidade}/Interfaces/IFilterService.cs`

- Herda a interface base de serviço do projeto (verifique o nome exato)
- Método `Task<{ServiceResult}<List<{TipoResposta}>>> Filter({Funcionalidade}FilterRequest request, Filter{Funcionalidade}Enum passo)`
- Adicione métodos adicionais apenas se forem necessários para a funcionalidade

---

### 6. Implementação do serviço — `Domain.Services/{Funcionalidade}/FilterService.cs`

> **Se o repositório-alvo for `estrutura-pedagogica`** e o skill `criar-service` estiver disponível em `.claude/commands/criar-service.md`, execute-o como subagente passando os parâmetros abaixo.  
> **Para outros repositórios**, implemente diretamente seguindo o padrão de serviços existentes no projeto.

Parâmetros do serviço:
- **NomeService:** `Filter`
- **TipoRetorno:** `List<{TipoResposta}>`
- **Dependências:** `IFilter{Funcionalidade}Repository`, `IValidacaoService`
- **Métodos públicos:** `Task<{ServiceResult}<List<{TipoResposta}>>> Filter({Funcionalidade}FilterRequest request, Filter{Funcionalidade}Enum passo)`
- **Lógica:** chamar `_validacaoService.ValidarRequest(request, passo)`, verificar `IsSuccess`, usar `switch (passo)` para delegar ao método correto do repositório, aplicar mensagem de filtro vazio quando `result.Data.Count == 0`

---

### 7. Interface do serviço de validação — `Domain.Services/{Funcionalidade}/Interfaces/IValidacaoService.cs`

- Herda a interface base de serviço do projeto
- Método `Task<{ServiceResult}<bool>> ValidarRequest({Funcionalidade}FilterRequest request, Filter{Funcionalidade}Enum passo)`

---

### 8. Implementação do serviço de validação — `Domain.Services/{Funcionalidade}/ValidacaoService.cs`

> Mesma regra do passo 6 — use `criar-service` se estiver em `estrutura-pedagogica`, caso contrário implemente diretamente.

Parâmetros:
- **NomeService:** `Validacao`
- **TipoRetorno:** `bool`
- **Dependências:** repositório de acesso de usuário do projeto (verifique o nome exato)
- **Lógica:** validar dados obrigatórios por passo, obter escolas do usuário, preencher `request.EscolasDoUsuario` e `request.PossuiVisaoCoordenacao`; extrair `ValidarDadosInformados`, `GetEscolasDoUsuario` e `PossuiVisaoCoordenacao` como métodos privados

---

### 9. Controller — `Api/Controllers/{Funcionalidade}Controller.cs`

- Atributos de autorização e cobertura conforme padrão do projeto (inspecione outros controllers)
- Um endpoint `[HttpPost("filter-{passo}")]` por passo, com `[FromServices] IFilterService service` e `[FromBody] {Funcionalidade}FilterRequest request`
- Cada endpoint chama `service.Filter(request, Filter{Funcionalidade}Enum.{Passo})`

---

### 10. Configuração de filtro Angular — `features/{funcionalidade-kebab}/listar/filtro-{funcionalidade-kebab}.ts`

> Antes de criar, verifique no mapa `frontend-maps/<repo>-angular-map.md` qual componente de filtro o projeto usa e quais são as interfaces de configuração disponíveis.

- Exporte `const filtro{Funcionalidade}: FilterConfig` (ou equivalente do projeto)
- Um item de configuração por passo do filtro, usando os tipos de campo disponíveis no projeto
- **`showSearchField: true` é o padrão** — omita ou defina `false` apenas se explicitamente especificado
- **`showSelectTag: true` é o padrão para campos Select e MultiSelect** — sempre defina `tagOptions` com ícone Material adequado ao campo
- **`watch_list` e `dependency_list` seguem a ordem sequencial dos passos:** cada campo observa o campo imediatamente anterior. Campos obrigatórios entram em `dependency_list`; campos opcionais não entram em `dependency_list`
- `searchPlaceholder` deve descrever os campos pesquisáveis na listagem

---

### 11. Service de filtro Angular — `features/{funcionalidade-kebab}/services/filtro-{funcionalidade-kebab}.service.ts`

- `@Injectable({ providedIn: 'root' })`
- Um método por passo do filtro, chamando o cliente HTTP do projeto para `/{funcionalidade-kebab}/filter-{passo}`
- Método privado `sanitize(req)` que retorna um objeto tipado com todos os campos do request, aplicando defaults seguros (`null` para Guids, `[]` para listas)

---

### 12. Página de listagem — `features/{funcionalidade-kebab}/listar/listar.component.ts` e `.html`

A página é criada apenas com o filtro. O método de aplicação do filtro fica com corpo vazio, aguardando implementação posterior.

**Componente (`.ts`):**
- `standalone: true`
- Importa os módulos necessários conforme padrão do projeto (verifique outros componentes de listagem)
- Referência ao componente de filtro via `@ViewChild`
- `aplicarFiltro()`: **não implementa a listagem** — deixe comentário `// TODO: implementar carregamento`
- `resetList()`, `changeFilterStatus()` — mesma estrutura dos demais componentes de listagem do projeto

**Template (`.html`):**
- Título da página
- Componente de filtro com bindings de configuração, loading, submit e reset
- Corpo da listagem vazio (apenas `<!-- TODO: implementar listagem -->`)

---

### 13. Rotas — `features/{funcionalidade-kebab}/{funcionalidade-kebab}.routes.ts`

- Se o arquivo de rotas já existir, adicione apenas a rota `listar` apontando para o componente criado
- Se não existir, crie o arquivo com a rota `listar`

---

### 14. Testes de integração

Siga o padrão de testes do projeto-alvo (procure por `Docs/` ou `README` dentro da pasta de testes).

**Estrutura esperada:**
- Herda a classe base de teste do projeto
- Mocka `IValidacaoService` — nunca implementado diretamente nos testes de `FilterService`
- Registra `IFilter{Funcionalidade}Repository`, `Filter{Funcionalidade}Repository`, `IFilterService` e `FilterService` como `AddTransient`

**Cenários obrigatórios:**

*Testes de Validação:*
- `Filter_ValidacaoFalha_PropagaErros` — mock de `ValidacaoService` retornando erro, verifica propagação
- `Filter_SemResultados_RetornaMensagemFiltroVazio` — banco vazio, verifica mensagem de filtro vazio

*Testes de Sucesso:*
- Um teste por passo do filtro verificando `IsSuccess` e `Data` não vazio
- Se houver lógica de visão diferenciada por perfil, adicione cenários separados
- Se o filtro acumular passos anteriores, adicione teste de filtragem negativa

*Métodos Auxiliares:*
- Helper que configura o mock de `ValidacaoService` para sucesso
- Helper que monta o grafo de entidades necessário para os testes
- Helper `SeedDatabase` conforme padrão do projeto

---

## Saída esperada

Ao final, liste todos os arquivos criados e modificados:

**Backend criados:**
- `Domain/DTO/{Funcionalidade}/{Funcionalidade}FilterRequest.cs`
- `Domain/Enums/{Funcionalidade}/Filter{Funcionalidade}Enum.cs`
- `Domain/Interfaces/Filters/IFilter{Funcionalidade}Repository.cs`
- `Infra/Repositories/Filters/Filter{Funcionalidade}Repository.cs`
- `Domain.Services/{Funcionalidade}/Interfaces/IFilterService.cs`
- `Domain.Services/{Funcionalidade}/FilterService.cs`
- `Domain.Services/{Funcionalidade}/Interfaces/IValidacaoService.cs`
- `Domain.Services/{Funcionalidade}/ValidacaoService.cs`
- `Api/Controllers/{Funcionalidade}Controller.cs` *(criado ou modificado)*

**Frontend criados:**
- `features/{funcionalidade-kebab}/listar/filtro-{funcionalidade-kebab}.ts`
- `features/{funcionalidade-kebab}/services/filtro-{funcionalidade-kebab}.service.ts`
- `features/{funcionalidade-kebab}/listar/listar.component.ts`
- `features/{funcionalidade-kebab}/listar/listar.component.html`
- `features/{funcionalidade-kebab}/listar/listar.component.scss`
- `features/{funcionalidade-kebab}/{funcionalidade-kebab}.routes.ts` *(criado ou modificado)*

**Testes criados:**
- `Test/Integration/Scenarios/{Funcionalidade}/FilterServiceTests.cs`

---

## O que **não** fazer

- Não criar qualquer arquivo sem ter o repositório-alvo, a funcionalidade, os passos e a entidade-base confirmados
- Não assumir namespaces ou convenções do `estrutura-pedagogica` em outros repositórios — derive sempre a partir de arquivos existentes no repositório-alvo
- Não registrar manualmente o repositório ou os serviços no container de DI sem verificar se o projeto usa autodiscovery
- Não implementar a lógica de listagem na página — ela deve ficar vazia, aguardando implementação posterior
- Não criar Controller separado se já existir um para a funcionalidade — adicione apenas os endpoints de filtro no existente
- Não mockar repositórios nos testes — registre como `AddTransient`
- Não criar testes antes de todos os demais artefatos estarem implementados
- Não usar o MCP `sqlserver` para explorar schema — use `_pde/db_map/` conforme as regras do CLAUDE.md
- Não ignorar o mapa de frontend em `frontend-maps/` antes de explorar arquivos individuais
