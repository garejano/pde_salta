# Plano de Implementação — Migração do Diário de Classe

**Card:** EFC-6443  
**Repositórios:** `estrutura-pedagogica` (backend + frontend), `documentacao-pedagogica` (fonte/consulta)

---

## Visão Geral das Fases

```
Fase 1 → Fundação do banco (entity + tabela)
Fase 2 → Backend: filtro e configuração
Fase 3 → Backend: endpoint principal do documento
Fase 4 → Frontend: filtro + tela principal
Fase 5 → Frontend: blocos do documento
Fase 6 → Frontend: montagem do documento + overlay
Fase 7 → Frontend: painel de configuração
Fase 8 → Roteamento, permissões e integração
Fase 9 → Migração de dados (homolog → prod)
```

Cada fase é entregável e testável de forma independente. As fases 4–7 podem ser desenvolvidas em paralelo com a 2–3 enquanto o backend é mockado.

---

## Fase 1 — Fundação do Banco

**Objetivo:** tabela `DiarioDeClasseConfiguracao` existindo no banco do `estrutura-pedagogica` com dados migrados de homolog.

**Repositório:** `estrutura-pedagogica` (backend)

### Passos

**1.1 — Criar a Entity**

Arquivo: `EstruturaPedagogica.Domain/Entities/DiarioDeClasseConfiguracao.cs`

```csharp
public class DiarioDeClasseConfiguracao : StatefulEntity
{
    public virtual Rede Rede { get; set; }
    public virtual int RedeId { get; set; }
    public virtual string CaracterParaIndicarPresenca { get; set; }
    public virtual string CaracterParaIndicarFalta { get; set; }
    public virtual string CaracterParaIndicarPendencia { get; set; }
    public virtual string CaracterParaIndicarTransferencia { get; set; }
    public virtual string CaracterParaIndicarNEE { get; set; }
    public virtual bool ExibirFrequencia { get; set; }
    public virtual bool ExibirConteudoMinistrado { get; set; }
    public virtual bool ExibirRelatorioRendimento { get; set; }
}
```

**1.2 — Criar o Mapping EF**

Arquivo: `EstruturaPedagogica.Infra/Mapping/Stateful/DiarioDeClasseConfiguracaoMap.cs`

Seguir o padrão de `ConfiguracaoPeriodoLetivoMap.cs` (já existente).

**1.3 — Registrar no ApplicationContext**

Arquivo: `EstruturaPedagogica.Infra/ApplicationContext.cs`

Adicionar `modelBuilder.ApplyConfiguration(new DiarioDeClasseConfiguracaoMap());`

**1.4 — Aplicar SQL de criação da tabela em homolog**

Usar o script do `db-migration.md` — seção "SQL — Criação da tabela".

**1.5 — Executar migração de dados em homolog**

Usar o script do `db-migration.md` — seção "SQL — Migração de dados" (Opção A ou B conforme topologia dos servidores).

**1.6 — Validar**
- `SELECT COUNT(*) FROM "DiarioDeClasseConfiguracao";` → deve bater com a contagem no doc-ped
- Spot check: pegar 2–3 redes e comparar os caracteres entre os bancos

**Entregável:** tabela criada e populada em homolog. ✓

---

## Fase 2 — Backend: Filtro e Configuração

**Objetivo:** endpoints de filtro e de configuração funcionando, testáveis via Swagger.

**Repositório:** `estrutura-pedagogica` (backend)

### 2.1 — DTOs

Criar em `EstruturaPedagogica.Domain/DTO/DiarioDeClasse/`:

```
DiarioDeClasseConfiguracaoResponse.cs
  → Hash, HashRede, NomeRede,
    CaracterParaIndicarPresenca/Falta/Pendencia/Transferencia/NEE,
    ExibirFrequencia, ExibirConteudoMinistrado, ExibirRelatorioRendimento

DiarioDeClasseConfiguracaoSaveRequest.cs
  → HashRede + todos os campos de caracteres e flags
```

### 2.2 — Interfaces e Services de configuração

Criar em `EstruturaPedagogica.Domain.Services/DiarioDeClasse/`:

```
Interfaces/
  IGetConfiguracaoDiarioDeClasseService.cs   → GetAll() / GetByHashRede(Guid)
  ISaveConfiguracaoDiarioDeClasseService.cs  → Save(request)

GetConfiguracaoDiarioDeClasseService.cs
SaveConfiguracaoDiarioDeClasseService.cs
```

Criar repositório: `EstruturaPedagogica.Infra/Repositories/DiarioDeClasse/DiarioDeClasseConfiguracaoRepository.cs`

### 2.3 — Controller de configuração

Arquivo: `EstruturaPedagogica.Api/Controllers/DiarioDeClasse/DiarioDeClasseConfiguracaoController.cs`

```
[Route("api/diariodeclasse/configuracao")]
[RequiredAuthorization(Funcionalidade.DiarioDeClasse)]

GET  /                        → GetAll() — redes acessíveis ao usuário
GET  /{hashRede}              → GetByHashRede(hashRede)
POST /save                    → Save(request)
```

### 2.4 — Enum de Funcionalidade

Adicionar `DiarioDeClasse` e `DiarioDeClasse_Configuracao` no enum `Funcionalidade` do domínio (espelhar o que existe em doc-ped).

### 2.5 — Endpoints de filtro específicos do diário

Os endpoints gerais (ano letivo, rede, escola, série, turma) **já existem** em `FiltroFrequenciaService` — o frontend vai reutilizá-los.

Criar apenas o que é específico do diário:

Arquivo: `EstruturaPedagogica.Api/Controllers/DiarioDeClasse/DiarioDeClasseFiltroController.cs`

```
[Route("api/diariodeclasse/filtro")]

POST /disciplinas   → disciplinas de uma turma no ano letivo
                      (input: hashTurma + hashAnoLetivo)
```

> Verificar se `FiltroFrequenciaService.disciplinas` já atende — se sim, reutilizar sem criar novo endpoint.

**Entregável:** GET/POST em `/configuracao` e `/filtro/disciplinas` respondendo via Swagger. ✓

---

## Fase 3 — Backend: Endpoint Principal do Documento

**Objetivo:** `POST /api/diariodeclasse/get-documento` retornando todos os dados necessários para montar o documento.

**Repositório:** `estrutura-pedagogica` (backend)

> Esta é a fase mais complexa — envolve queries em múltiplas tabelas.

### 3.1 — DTOs do documento

Criar em `EstruturaPedagogica.Domain/DTO/DiarioDeClasse/`:

```
DiarioDeClasseDocumentoRequest.cs
  → HashAnoLetivo, HashRede, HashEscola, HashSerie, HashTurma, HashDisciplina (Guid?)
    DataInicio, DataTermino (DateTime)
    ExibirNomeProfessor, ExibirFrequencia,
    ExibirConteudoMinistrado, ExibirRelatorioRendimento (bool)

DiarioDeClasseDocumentoResponse.cs        → envelope principal
  → Cabecalho: CabecalhoDocumentoResponse  (reutilizar o já existente de ListaPresenca)
    NomeProfessor, Disciplina, Turma, NomeEtapa
    AulasPrevistas, AulasDadas
    ConfiguracaoDiario: DiarioDeClasseCaracterResponse
    Aulas: List<DiarioDeClasseAulaResponse>
    Alunos: List<DiarioDeClasseAlunoResponse>
    Conteudos: List<DiarioDeClasseConteudoResponse>
    RelatorioRendimento: DiarioDeClasseRendimentoResponse

DiarioDeClasseCaracterResponse.cs
  → os 5 caracteres (presença, falta, pendência, transferência, NEE)

DiarioDeClasseAulaResponse.cs
  → Hash, DataAula, Descricao

DiarioDeClasseAlunoResponse.cs
  → HashAluno, NomeAluno, Matricula, Status
    Chamadas: List<string>  — uma entrada por aula, na mesma ordem de Aulas[]

DiarioDeClasseConteudoResponse.cs
  → DataAula, Conteudo, Atividades

DiarioDeClasseRendimentoResponse.cs
  → Etapas: List<EtapaResponse>
    Alunos: List<RendimentoAlunoResponse>
```

### 3.2 — Serviço do documento

Arquivo: `EstruturaPedagogica.Domain.Services/DiarioDeClasse/GetDocumentoDiarioDeClasseService.cs`

Responsabilidades do serviço:
1. Buscar configuração de caracteres da rede (`DiarioDeClasseConfiguracao`)
2. Buscar cabeçalho da escola (reutilizar lógica de `CabecalhoDocumentoResponse`)
3. Buscar aulas do período (`DataInicio`–`DataTermino`) para a turma/disciplina
4. Buscar alunos da turma com as chamadas de cada aula
5. Buscar conteúdos ministrados (se `ExibirConteudoMinistrado`)
6. Buscar relatório de rendimento (se `ExibirRelatorioRendimento`)

> **Ponto de atenção:** verificar em quais tabelas do banco do `estrutura-pedagogica` vivem os dados de chamada (`AlunoFrequencia`?) e de conteúdo ministrado. Consultar `db_map` antes de escrever as queries.

Arquivo de repositório: `EstruturaPedagogica.Infra/Repositories/DiarioDeClasse/DiarioDeClasseRepository.cs`

### 3.3 — Controller

Arquivo: `EstruturaPedagogica.Api/Controllers/DiarioDeClasse/DiarioDeClasseController.cs`

```
[Route("api/diariodeclasse")]
[RequiredAuthorization(Funcionalidade.DiarioDeClasse)]

POST /get-documento   → GetDocumentoDiarioDeClasse(request)
```

### 3.4 — Teste de fumaça

Executar a query via Swagger com filtro válido de homolog. Validar:
- Chamadas dos alunos batem com o que o doc-ped retorna para o mesmo filtro
- Conteúdos e rendimento presentes quando solicitados

**Entregável:** endpoint respondendo com dados reais de homolog. ✓

---

## Fase 4 — Frontend: Filtro e Tela Principal

**Objetivo:** usuário consegue selecionar filtros e ver o botão "Gerar documento".

**Repositório:** `estrutura-pedagogica` (frontend)

### 4.1 — Criar a feature

```
frontend/src/app/features/diario-de-classe/
  diario-de-classe.module.ts
  diario-de-classe.routes.ts
```

### 4.2 — Service de filtro

Arquivo: `services/filtro-diario-de-classe.service.ts`

Métodos: `anosLetivos`, `redes`, `escolas`, `series`, `turmas`, `disciplinas`

> Os métodos `anosLetivos`, `redes`, `escolas`, `series`, `turmas` já existem em `FiltroFrequenciaService` — avaliar se é possível injetar esse service diretamente no `FiltroComponent`, como é feito em `lista-presenca.component.ts` (que injeta `FiltroFrequenciaService`). Se o serviço for o mesmo, não criar duplicata.

### 4.3 — FilterConfig declarativo

Arquivo: `filtro-diario-de-classe.ts`

Campos: Rede → Escola → Série → Turma → Disciplina + Date range (dataInicio / dataTermino).

> Os campos de data não são suportados nativamente pelo `FiltroComponent` declarativo. Verificar se há suporte a `FieldType.DateRange` no `filtro.models.ts` do `estrutura-pedagogica`. Se não houver, os campos de data ficam fora do `FilterConfig` e são adicionados diretamente no template do `listar.component`.

### 4.4 — Tela principal

Arquivo: `listar/listar.component.ts`

Comportamento:
1. Renderiza `<app-filtro>` com `filterConfig = filtroListaDiario`
2. Ao aplicar filtro, mostra botão "Gerar Diário"
3. Ao clicar, chama `diario-de-classe.service.ts` → `getDocumento(request)` → abre overlay do documento

> Nesta fase o service pode retornar um mock (`useMock = true`) enquanto a Fase 3 não estiver pronta.

**Entregável:** tela navegável com filtro funcional (mesmo que o documento ainda não renderize). ✓

---

## Fase 5 — Frontend: Blocos do Documento

**Objetivo:** os três novos `DocumentEntry` components existindo e renderizando dados de mock.

**Repositório:** `estrutura-pedagogica` (frontend)

Cada bloco é um componente standalone registrável no `DocumentBuilderModule`.

### 5.1 — `DocGridDiarioComponent`

Arquivo: `doc-blocks/doc-grid-diario/doc-grid-diario.component.ts`

- `@Input() data: DocGridDiarioData` com:
  - `alunos: DiarioDeClasseAlunoResponse[]`
  - `aulas: DiarioDeClasseAulaResponse[]`
  - `configuracao: DiarioDeClasseCaracterResponse`
- Renderiza matriz datas × alunos com os caracteres de chamada
- Migrar lógica visual de `DocGridDiarioClasseComponent` do doc-ped
- Implementar `Injeta: ElementRef` para medição de altura (padrão do document-builder)

### 5.2 — `DocGridConteudoComponent`

Arquivo: `doc-blocks/doc-grid-conteudo/doc-grid-conteudo.component.ts`

- `@Input() data: DocGridConteudoData` com:
  - `conteudos: DiarioDeClasseConteudoResponse[]`
- Renderiza tabela data / conteúdo / atividades
- Migrar lógica de `DocGridConteudosDiarioClasseComponent`

### 5.3 — `DocGridRendimentoComponent`

Arquivo: `doc-blocks/doc-grid-rendimento/doc-grid-rendimento.component.ts`

- `@Input() data: DocGridRendimentoData` com:
  - `etapas`, `alunos`, `configuracao`
- Renderiza notas por aluno/coluna/etapa
- Migrar lógica de `DocGridRelatorioRendimentoComponent`

### 5.4 — Registrar os blocos no `DocumentBuilderModule`

Adicionar os três componentes como `DocumentEntry` válidos (seguir o padrão dos blocos já existentes como `DocTableComponent`, `DocWideTableComponent`).

**Entregável:** três componentes renderizando com mock data. ✓

---

## Fase 6 — Frontend: Montagem do Documento e Overlay

**Objetivo:** documento completo abrindo no overlay de impressão com dados reais.

**Repositório:** `estrutura-pedagogica` (frontend)

### 6.1 — Service principal

Arquivo: `services/diario-de-classe.service.ts`

```typescript
getDocumento(request: DiarioDeClasseDocumentoRequest):
  Observable<ServiceResult<DiarioDeClasseDocumentoResponse>>
  // POST api/diariodeclasse/get-documento

getConfiguracoes(): Observable<ServiceResult<DiarioDeClasseConfiguracaoResponse[]>>
  // GET api/diariodeclasse/configuracao

saveConfiguracao(req: DiarioDeClasseConfiguracaoSaveRequest):
  Observable<ServiceResult<DiarioDeClasseConfiguracaoResponse>>
  // POST api/diariodeclasse/configuracao/save
```

### 6.2 — Montagem do `DocumentBundle`

No `listar.component.ts` (ou em `documento/documento.component.ts` se extraído):

```typescript
private buildBundle(data: DiarioDeClasseDocumentoResponse): DocumentBundle {
  const entries: DocumentEntry[] = [];

  // Cabeçalho info da turma — reutiliza DocPresencaInfoComponent
  entries.push({ componentType: DocPresencaInfoComponent, data: {...} });

  // Grade de frequência (condicional)
  if (data.exibirFrequencia) {
    entries.push({ componentType: DocGridDiarioComponent,
                   data: { alunos: data.alunos, aulas: data.aulas,
                           configuracao: data.configuracaoDiario } });
  }

  // Grade de conteúdo (condicional)
  if (data.exibirConteudoMinistrado) {
    entries.push({ componentType: DocGridConteudoComponent,
                   data: { conteudos: data.conteudos } });
  }

  // Relatório de rendimento (condicional)
  if (data.exibirRelatorioRendimento) {
    entries.push({ componentType: DocGridRendimentoComponent,
                   data: { ...data.relatorioRendimento,
                           configuracao: data.configuracaoDiario } });
  }

  // Assinatura
  entries.push({ componentType: DocSignatureComponent, data: { signatories: [...] } });

  return {
    config: { orientation: 'landscape', header: { show: true, onAllPages: false },
              footer: { show: true }, componentGap: 8 },
    headerData: this.buildHeaderData(data.cabecalho),
    label: `${data.turma} — ${data.disciplina}`,
    entries,
  };
}
```

### 6.3 — Overlay com `DocumentViewerComponent`

Seguir exatamente o padrão de `lista-presenca.component.ts`:
- `@ViewChild('viewer') viewer?: DocumentViewerComponent`
- `showOverlay`, `documents`, `activeConfig`
- `onConfigChange()`, `fecharOverlay()`, `imprimir()`, `salvarPdf()`
- Nome do arquivo PDF: `diario-NOMEREDE-NOMETURMA-dd_mm_yyyy`

**Entregável:** documento abrindo com dados reais, imprimível e exportável como PDF. ✓

---

## Fase 7 — Frontend: Painel de Configuração

**Objetivo:** usuário com perfil de coordenação consegue editar os caracteres da rede dentro do painel "Personalizar documento".

**Repositório:** `estrutura-pedagogica` (frontend)

### 7.1 — Componente de configuração

Arquivo: `configuracao/configuracao.component.ts`

- Carrega configuração da rede atual via `diario-de-classe.service.ts`
- Exibe campos para cada um dos 5 caracteres + 3 flags de exibição
- Botão "Salvar" → `saveConfiguracao()` → feedback de sucesso/erro
- Após salvar, emite evento para recarregar o documento

### 7.2 — Integrar ao painel de overlay

No componente do documento (onde está o `DocumentViewerComponent`), adicionar o `ConfiguracaoComponent` dentro do painel lateral de personalização, visível apenas para quem tem `Funcionalidade.DiarioDeClasse_Configuracao`.

> Padrão de referência: como o carômetro exibe controles de variante/colunas dentro do `DocumentCarouselOverlayComponent`.

**Entregável:** coordenador altera caracteres no painel, salva, e o documento recarrega com os novos valores. ✓

---

## Fase 8 — Roteamento, Permissões e Integração

**Objetivo:** feature acessível pelo menu, com guard de permissão.

**Repositório:** `estrutura-pedagogica` (frontend + backend)

### 8.1 — Rota lazy-loaded

No `AppRoutingModule`:
```typescript
{ path: 'diario-de-classe', loadChildren: () =>
    import('./features/diario-de-classe/diario-de-classe.module')
    .then(m => m.DiarioDeClasseModule) }
```

Adicionar a rota ao enum `path` (arquivo de constantes de rotas do projeto).

### 8.2 — Guard de permissão

No `diario-de-classe.routes.ts`:
```typescript
{ path: '', component: ListarComponent, canActivate: [IsLoggedGuard, IsAllowed],
  data: { funcionalidade: Funcionalidade.DiarioDeClasse } }
```

### 8.3 — Item de menu

Adicionar entrada no menu lateral do portal apontando para a nova rota.

> Verificar se o menu é configurado via banco (tabela de menu) ou via código. Ajustar conforme o padrão do projeto.

### 8.4 — Smoke test completo end-to-end em homolog

1. Login com usuário professor → navegar para Diário de Classe
2. Selecionar filtro completo (rede, escola, série, turma, disciplina, período)
3. Gerar documento → verificar todas as seções (frequência, conteúdo, rendimento)
4. Imprimir / exportar PDF
5. Login com coordenador → editar caracteres no painel → salvar → verificar no documento

**Entregável:** feature completa e acessível em homolog. ✓

---

## Fase 9 — Migração de Dados em Produção

**Objetivo:** tabela de configuração populada em produção antes do deploy do código.

> A migration de dados deve acontecer **antes** do deploy da feature em prod, para que as configurações já existam quando os usuários acessarem pela primeira vez.

### Passos

**9.1 — Validação final em homolog**
- Confirmar que nenhuma rede ficou sem configuração após a migração
- Query de sanidade: `SELECT COUNT(*) FROM "DiarioDeClasseConfiguracao" WHERE "Ativo" = TRUE`

**9.2 — Janela de manutenção em produção**
- Aplicar `CREATE TABLE` em prod
- Executar script de migração de dados
- Validar contagem e spot check de 3–5 redes

**9.3 — Deploy do código**
- Backend: deploy do `estrutura-pedagogica` com os novos endpoints
- Frontend: deploy com a feature `diario-de-classe` habilitada

**9.4 — Smoke test em produção**
- Repetir o smoke test do passo 8.4 com dados reais de prod
- Monitorar logs por 15 minutos após deploy

**9.5 — Comunicar deprecação do diário antigo**
- O `frontend-diario-classe` em `documentacao-pedagogica` pode ser desativado/removido após confirmação de que o novo está funcionando
- Não remover ainda — deixar como fallback por pelo menos 1 sprint

**Entregável:** feature em produção, dados migrados, sem downtime. ✓

---

## Dependências entre Fases

```
Fase 1 ──────────────────────────────────────────────────── Fase 9
         \                                                    ↑
          Fase 2 ──→ Fase 3 ──────────────────────────────→  |
                               \                             |
          Fase 4 ──→ Fase 6 ──→ Fase 6 (integração real) ──→ Fase 8 ─→ Fase 9
         /         /
Fase 5 ─/─────────
         \
          Fase 7 ──→ Fase 8
```

Simplificado:
- **Fase 1** desbloqueada imediatamente
- **Fases 2, 4, 5** podem ser feitas em paralelo
- **Fase 3** depende de 1 + 2
- **Fase 6** depende de 3 + 4 + 5
- **Fase 7** depende de 2 + 4
- **Fase 8** depende de 6 + 7
- **Fase 9** depende de 8

---

## Checklist de Definição de Pronto por Fase

| Fase | Critérios |
|------|-----------|
| 1 | Tabela criada em homolog; dados migrados; contagem validada |
| 2 | Swagger de homolog responde GET `/configuracao` e POST `/configuracao/save` |
| 3 | Swagger retorna documento completo para um filtro válido de homolog |
| 4 | Filtro funcional no browser; todos os campos populam corretamente em cascata |
| 5 | Blocos renderizam dados de mock sem erros de layout no `DocumentViewer` |
| 6 | Documento abre com dados reais; PDF gerado sem erros |
| 7 | Salvar configuração via painel recarrega o documento corretamente |
| 8 | E2E completo em homolog com dois perfis (professor e coordenador) |
| 9 | Feature em prod; dados migrados; zero erros em prod por 15 min pós-deploy |
