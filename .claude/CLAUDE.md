# salta_brain — Contexto do Projeto

Este repositório é o **segundo cérebro** de trabalho dentro da empresa Salta. É um workspace pessoal de conhecimento, não um projeto de software deployável.

## Sobre o usuário

Desenvolvedor full-stack na Salta. Trabalha principalmente nos repositórios listados em `repository_map.md`.

## Estrutura do repositório

```
cards/           # Um diretório por card Jira (EFC-xxx/). Criado e atualizado pelo /jira_sync.
_EFC-xxx/        # Diretórios legados com anotações manuais de cards (preservar — não sobrescrever).
_scripts/        # Scripts gerados ou sugeridos durante conversas.
_archive/        # Arquivos arquivados / histórico.
frontend-maps/   # Mapas de frontends Angular gerados pelo /scan-frontend.
                 #   changelog.md → data do último scan por repositório.
                 #   <repo>-angular-map.md → estrutura comprimida do frontend (componentes, services, rotas, NgRx).
_pde/db_map/     # Mapa do banco de dados gerado por _scripts/db_map/run_all.py.
                 #   changelog.md → data da última extração.
                 #   schema/ → tables.yaml, relations.yaml, joins.yaml
                 #   domains/ → frequencia.md, avaliacao.md, academico.md, acesso.md
                 #   diagrams/ → erd.mmd e erd-<domínio>.mmd
repository_map.md  # Guia de repositórios em c:/projects/ — usado pela IA para localizar código.
```

## Regras para a IA

- **Scripts:** sempre que sugerir ou gerar um script, salvá-lo em `_scripts/<nome_do_script>`.
- **Cards Jira:** os arquivos em `cards/EFC-xxx/` são gerados pelo `/jira_sync` a partir do Jira (fonte de verdade). Nunca escrever de volta para o Jira.
- **Pastas com underscore** (`_EFC-xxx/`): contêm anotações manuais — preservar sempre, nunca sobrescrever sem confirmação explícita.

## Repositórios de código

- Caminho base: `c:/projects/`
- Detalhes de cada repositório: `repository_map.md`
- O `repository_map.md` serve como guia para a IA identificar em qual repositório uma descrição de card Jira deve ser implementada — incluindo stack, responsabilidade e palavras-chave típicas de cada repo.

## Comandos disponíveis

### Skills de projeto (contexto Salta)

| Comando | Descrição |
|---------|-----------|
| `/jira_sync` | Sincroniza cards abertos do Jira para `cards/` |
| `/repo_map` | Percorre `c:/projects/` e (re)gera `repository_map.md` |
| `/bench-scan-front` | Escaneia frontends Angular e atualiza `frontend-maps/` |
| `/criar-componente-doc` | Cria componente no document-builder |
| `/criar-filtro` | Cria um novo filtro |
| `/criar-teste-filtro` | Gera teste Playwright para um filtro a partir da sua `FilterConfig` |
| `/identificar-bug` | Identifica e documenta um bug |
| `/menu-item-sql` | Gera SQL de MenuItem |
| `/refatorar-angular` | Refatora módulo ou componente Angular |
| `/refatorar-shared-components` | Refatora para uso de shared components (estrutura-pedagogica) |
| `/refinar-feature` | Refina uma feature (épico/card Jira) |
| `/refinar-tech` | Cria plano técnico de implementação |
| `/run-tasks` | Executa lista de tarefas de um card |
| `/spdd-generate` | Gera SPDD |
| `/spdd-refine` | Refina SPDD |
| `/merge-check` | Detecta conflitos entre branch atual e `homolog`; gera relatório em `merge_checks/` |

### Skills gerais (Claude Code)

| Comando | Descrição |
|---------|-----------|
| `/code-review` | Revisa o diff atual — bugs, simplificações, eficiência |
| `/simplify` | Aplica limpezas de reuso, simplificação e eficiência no código alterado |
| `/security-review` | Revisa as mudanças pendentes sob a ótica de segurança |
| `/review` | Revisa um pull request |
| `/verify` | Roda a app e observa o comportamento para confirmar uma mudança |
| `/run` | Inicia a app e verifica uma mudança em execução real |
| `/deep-research` | Pesquisa multi-fonte com verificação adversarial e relatório citado |
| `/frontend-design` | Guia de design visual para UI nova ou reformulada |
| `/update-config` | Configura o harness via `settings.json` (hooks, permissões, env vars) |
| `/keybindings-help` | Customiza atalhos de teclado (`keybindings.json`) |
| `/fewer-permission-prompts` | Gera allowlist de ferramentas read-only para reduzir prompts |
| `/loop` | Executa um comando em intervalo recorrente |
| `/schedule` | Cria/gerencia cloud agents agendados (cron) |
| `/claude-api` | Referência da API Claude / Anthropic SDK |
| `/init` | Inicializa um novo `CLAUDE.md` com documentação do codebase |

## Scripts utilitários (`_scripts/`)

Scripts Python e PowerShell prontos para uso. Todos os scripts Python importam `salta_config.py` para obter caminhos e credenciais — não precisa configurar nada além do que já está no `claude_desktop_config.json`.

### `scan_angular.py` — geração de mapas Angular

Escaneia um frontend Angular e gera `frontend-maps/<repo>-angular-map.md`. Invocado internamente pelo `/bench-scan-front`.

```powershell
python _scripts/scan_angular.py estrutura-pedagogica   # repo conhecido
python _scripts/scan_angular.py c:/projects/notas/frontend  # caminho direto
python _scripts/scan_angular.py --all                  # todos os frontends conhecidos
python _scripts/scan_angular.py --list                 # lista repos configurados
```

Repos conhecidos estão em `salta_config.py → ANGULAR_FRONTENDS`.

### `bench_scan_frontend.py` — benchmark de contexto

Compara dois flows via Claude Code CLI (`claude -p`): **Flow A** (usa mapa Angular pré-gerado) vs **Flow B** (explora o frontend diretamente). Útil para medir ROI dos mapas. Relatório salvo em `_benchmark/runs/<timestamp>_results.md`.

```powershell
python _scripts/bench_scan_frontend.py
python _scripts/bench_scan_frontend.py --repo estrutura-pedagogica
python _scripts/bench_scan_frontend.py --flow a   # só Flow A
python _scripts/bench_scan_frontend.py --model claude-sonnet-4-6
```

### `refat_shared_components/analyze_shared_usage.py` — cobertura de shared components

Analisa o HTML do `estrutura-pedagogica` e reporta quais elementos crus poderiam ser substituídos por shared/dynamic components. Saída em `_scripts/refat_shared_components/output/`.

### `migrar_diario_configuracao.py` — migração de configuração do diário

Migra `DiarioClasseConfiguracao` do PostgreSQL (`documentacao-pedagogica`) para SQL Server (`estrutura-pedagogica`). Requer `pip install pyodbc psycopg2-binary` e variáveis `DOCPED_*` configuradas.

```powershell
python _scripts/migrar_diario_configuracao.py           # dry-run
python _scripts/migrar_diario_configuracao.py --commit  # executa inserção
```

### `gerar_ra_impulso.py` — geração de RAs (Impulso)

Lê CSV de IDs + planilha/CSV de alunos e gera o SQL para cadastrar Registros de Aluno. Um ciclo (card Jira) por vez — ver `projetos/importador_impulso/manual/guide.md` para o processo completo e `manual/<CARD>/` para os arquivos de cada ciclo.

```powershell
python projetos/importador_impulso/manual/scripts/gerar_ra_impulso.py --excel "projetos/importador_impulso/manual/EFC-6732/<planilha>.xlsx" --sheet "ALUNOS NOVOS - ENEM3" --ra-start 90929601 --env producao
```

### `jira-env.ps1` — credenciais Jira

Define `JIRA_BASE_URL`, `JIRA_USER` e `JIRA_API_TOKEN` na sessão PowerShell atual. Necessário para scripts que chamam a API do Jira diretamente.

```powershell
. _scripts\jira-env.ps1   # dot-source para exportar para a sessão
```

### `salta_config.py` — módulo de configuração compartilhada

Não é executado diretamente — importado pelos outros scripts. Expõe: caminhos (`SALTA_BRAIN`, `PROJECTS_BASE`, `DB_MAP_DIR`, `FRONTEND_MAPS_DIR`), credenciais SQL Server lidas do `claude_desktop_config.json`, e `ANGULAR_FRONTENDS` (dict repo → path). Ao criar um novo script em `_scripts/`, importar daqui em vez de hardcodar caminhos.

---

## db_map — mapa do banco para a IA

O MCP `sqlserver` permite explorar o schema ao vivo, mas é caro em tokens. O pipeline correto é:

```
Banco (ElevaPortalHomolog) → _scripts/db_map/run_all.py → _pde/db_map/ → IA
```

**Conexão:** mesmos parâmetros do MCP — lidos automaticamente de `%APPDATA%\Claude\claude_desktop_config.json`.  
Servidor: `belerofonte.eleva.local` | Banco: `ElevaPortalHomolog` | Usuário: `mcp.readonly`

### Regra obrigatória: db_map primeiro, MCP depois

**Nunca usar o MCP `sqlserver` para explorar schema.** O MCP existe apenas para executar queries já construídas. O contexto de tabelas, colunas e joins deve ser obtido exclusivamente do db_map.

**Fluxo obrigatório para qualquer query:**

1. Checar `_pde/db_map/changelog.md` — se a extração for < 30 dias, o mapa está válido.
2. Carregar os arquivos relevantes **antes** de escrever qualquer SQL:
   - Query em um domínio: `domains/<dominio>.md` + `schema/joins.yaml`
   - Query cross-domínio: `schema/tables.yaml` + `schema/relations.yaml`
3. Construir a query com base no mapa carregado.
4. Só então usar o MCP `execute_query` para executar — e apenas para isso.

**O MCP `list_tables`, `describe_table`, `get_foreign_keys` e similares não devem ser usados** enquanto o db_map estiver atualizado. Usá-los é sinal de que o fluxo foi ignorado.

**Para gerar/atualizar o db_map:**
```powershell
pip install pyodbc pyyaml   # apenas na primeira vez
cd _scripts/db_map
python run_all.py
```

## AWS — regra obrigatória: somente leitura

Quando o usuário estiver autenticado na AWS CLI (qualquer profile, incluindo os de produção como `eleva-admin-eficientes-prd`), **toda consulta deve ser estritamente de leitura** (describe/list/get, CloudWatch, logs, etc.).

**Nunca executar comandos que criem, alterem ou removam recursos na AWS** — isso inclui, sem se limitar a: reboot/stop/start/terminate de instâncias, alteração de security groups, criação/deleção de qualquer recurso, mudança de configuração (parameter groups, scaling, etc.), e qualquer ação de escrita no ElastiCache, RDS, EC2 ou outro serviço.

Se uma investigação exigir uma ação de mudança (ex.: reiniciar um serviço, aplicar failover manual), **parar e perguntar ao usuário antes** — nunca executar por iniciativa própria.

## Schema do banco (ElevaPortalHomolog) — curiosidades

- **`AlunoEscola.AlunoEscola_key`** é FK para `PessoaEscolaAcesso.Id`, **não** para `Pessoa.Id`.  
  Para obter o hash do aluno: `AlunoEscola_key → PessoaEscolaAcesso.Id → PessoaEscolaAcesso.PessoaEscola → PessoaEscola.Pessoa → Pessoa.Hash`.
- **`AnoLetivo.Id`** = o próprio ano (ex: `2026`). O campo `Vigente = 1` indica o ano letivo corrente.  
  `AlunoEscola.AnoLetivo` armazena diretamente esse valor numérico (ex: `2026`).
- Tabelas sem sufixo `Id` nas FKs: `Turma.EscolaSerie`, `EscolaSerie.Escola`, `Escola.Rede`, `EscolaSerie.Serie`, `EscolaSerie.AnoLetivo` — todas são IDs diretos, sem o sufixo convencional.

## Frontend maps

Quando for ajudar com código de um frontend Angular:

1. Verificar se existe `frontend-maps/<repo>-angular-map.md`
2. Checar `frontend-maps/changelog.md` — se o mapa tiver mais de 30 dias, sugerir `/scan-frontend`
3. Carregar o mapa **antes** de explorar arquivos individuais — evita gastar contexto em leitura de diretórios

## Regra para geração de HTML (estrutura-pedagogica)

Ao gerar HTML para o repositório `estrutura-pedagogica`, **sempre priorizar os shared/dynamic components** no lugar de elementos HTML crus.

Catálogo completo de componentes e regras de substituição: `refat_components_estrutura_pedagogica.md`

Script de análise de cobertura: `_scripts/refat_shared_components/analyze_shared_usage.py`  
Skill de refatoração: `/refatorar-shared-components` (no contexto do repo `estrutura-pedagogica`)
