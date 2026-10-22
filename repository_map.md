# Repository Map

> Gerado em: 2026-04-28  
> Base: `c:/projects/`

---

## atlas

**Stack:** .NET 6 · Entity Framework Core · Angular · SQL Server · Caddy (proxy reverso)  
**Responsabilidade:** Sistema central de gestão do portal Eleva (`GestaoMaster`) — hub que agrega e roteia os módulos pedagógicos.  
**Palavras-chave de cards:** GestaoMaster, Configurador, gestão, relatório, portal, hub, módulo, integração central  
**Remote:** https://github.com/gruposaltaedu/atlas  
**Run/Build:** `npm run atlas` *(inicia o proxy Caddy que serve backend + frontend)*
**Frontend Map:** [`frontend-maps/atlas-angular-map.md`](frontend-maps/atlas-angular-map.md) *(escaneado em: 2026-07-30)*

O projeto tem um `backend/` com projetos C# (`GestaoMaster.Api`, `GestaoMaster.Application`, `GestaoMaster.Domain`) e um `frontend/` Angular compilado para `wwwroot`. O namespace `GestaoMaster` é o identificador principal no código.

---

## aulas

**Stack:** .NET 6 · Entity Framework Core · Angular · SQL Server  
**Responsabilidade:** Gerenciamento de aulas — consulta de aulas e lançamento de comportamento de alunos.  
**Palavras-chave de cards:** Aula, Comportamento, ConsultaAulas, LancamentoComportamento, cronograma, presença em aula  
**Remote:** https://github.com/gruposaltaedu/aulas  

Possui dois frontends Angular independentes: `frontend-comportamento` (lançamento de comportamento) e `frontend-consulta-aulas` (consulta de aulas). Backend em `backend/` com estrutura `Aulas.Api`, `Aulas.Domain`, `Aulas.Domain.Services`.

---

## barramento-pedagogico

**Stack:** .NET 8 · Entity Framework Core · SQL Server  
**Responsabilidade:** Barramento de integração entre módulos pedagógicos — recebe e distribui eventos/mensagens entre os sistemas.  
**Palavras-chave de cards:** Barramento, integração, evento, mensagem, sincronização entre módulos, BarramentoPedagogico  
**Remote:** https://github.com/gruposaltaedu/barramento-pedagogico  

Estrutura completa de camadas: `BarramentoPedagogico.Api`, `Domain`, `Domain.Services`, `Infra`, `Extensions`, `Test`. Inclui solução `BarramentoPedagogico.sln`.

---

## documentacao-pedagogica

**Stack:** .NET 8 · Entity Framework Core · Angular 20 · **PostgreSQL (banco próprio)** · Hangfire · AWS (Secrets Manager, S3)
**Responsabilidade:** Gestão de documentação pedagógica — Ficha Individual, Diário de Classe, Histórico de Séries, Resultado Final, Ata de Resultados Finais, Certificados e Atestados.
**Palavras-chave de cards:** DocumentacaoPedagogica, FichaIndividual, DiarioClasse, Histórico, ResultadoFinal, Ata, Certificado, Atestado, impressão, geração PDF, sincronização, importação
**Remote:** https://github.com/gruposaltaedu/documentacao-pedagogica.git
**Run/Build:** `dotnet run --project backend/DocumentacaoPedagogica.Api` (backend) / `ng build --watch` (frontend ou frontend-diario-classe)
**Frontend Map:** [`frontend-maps/documentacao-pedagogica-angular-map.md`](frontend-maps/documentacao-pedagogica-angular-map.md) *(escaneado em: 2026-07-30)*

> ⚠️ **Banco separado do SQL Server compartilhado.** Usa PostgreSQL próprio (`homologationdocumentacaopedagogica`) em AWS RDS — **não é o `ElevaPortalHomolog`**. O MCP `sqlserver` não acessa esse banco. Tabelas como `HistoricoSerie` (com `ObservacoesAluno`), `Historico`, `Usuario`, `Aluno` existem nesse PostgreSQL com schema próprio. No `ElevaPortalHomolog` há apenas cópias de sincronização em `ModuloDocumentacaoPedagogica` (10 colunas, sem dados operacionais completos).

Possui dois frontends Angular: `frontend/` (documentação pedagógica) e `frontend-diario-classe/`. Backend com estrutura `DocumentacaoPedagogica.Api`, `Application`, `Domain`, `Domain.Services`, `Infra`, `Extensions`, `Test`. Banco PostgreSQL gerenciado via EF Migrations. Integra-se com: `estrutura-pedagogica` (FichaIndividual, sync), `frequencia` (chamadas), `barramento-pedagogico` (sync via Hangfire). Chamadas HTTP externas via `ApiRepository` (`WebRequest`) com `SettingsGetter.Instance.<Modulo>.ApiUrl`.

---

## documentacao-pedagogica-infra

**Stack:** AWS (Infrastructure as Code — scripts de configuração de ambiente)  
**Responsabilidade:** Configuração e provisionamento da infraestrutura AWS dos módulos pedagógicos (ambientes de homologação e produção).  
**Palavras-chave de cards:** infra, AWS, deploy, ambiente, homologação, produção, pipeline, CI/CD  
**Remote:** https://github.com/gruposaltaedu/documentacao-pedagogica-infra  

Contém pasta `aws/` com configurações de infra. Sem código de aplicação — apenas artefatos de infraestrutura.

---

## eleva-sts-token

**Stack:** Python 3 · boto3 (AWS SDK)  
**Responsabilidade:** Script utilitário para gerar tokens STS temporários da AWS via autenticação Active Directory, dando acesso às contas AWS da Eleva.  
**Palavras-chave de cards:** AWS, token, STS, credenciais, autenticação, AD, acesso cloud  
**Remote:** https://github.com/gruposaltaedu/eleva-sts-token  
**Run/Build:** `python eleva-token-3.py`

Ferramenta de desenvolvedor — não é um módulo pedagógico. Usado para obter credenciais temporárias de acesso à AWS.

---

## estrutura-pedagogica

**Stack:** .NET 8 · Entity Framework Core · Angular 20 (standalone) · Bootstrap 4 · SQL Server  
**Responsabilidade:** Gestão da estrutura pedagógica — Redes, Séries, Disciplinas, Etapas, Turmas, Alocação de Professores, Configurações de Avaliação.  
**Palavras-chave de cards:** EstruturaPedagogica, Rede, Serie, Disciplina, Etapa, Turma, AlocacaoProfessores, EstruturaAvaliacao, Configurador, configuração de avaliação, grade  
**Remote:** https://github.com/gruposaltaedu/estrutura-pedagogica.git  
**Run/Build:** `dotnet run --project backend/EstruturaPedagogica.Api` / `cd frontend && ng serve`  
**Skills:** `analisar-pr`, `criar-entidade`, `criar-exportacao`, `criar-filtro`, `criar-service`, `criar-testes`, `executar-plano`, `identificar-bug`, `merge-branch`, `planejar-implementacao`, `refinar-feature`
**Frontend Map:** [`frontend-maps/estrutura-pedagogica-angular-map.md`](frontend-maps/estrutura-pedagogica-angular-map.md) *(escaneado em: 2026-07-30)*

Frontend Angular compilado para `backend/EstruturaPedagogica.Api/wwwroot`. Banco sem EF Migrations — schema gerenciado via scripts SQL manuais (ver `scripts-db-pedagogico`). Possui `CLAUDE.md` e `Docs/` por feature.

---

## frequencia

**Stack:** .NET 8 · Entity Framework Core · Angular · SQL Server  
**Responsabilidade:** Registro e gestão de frequência escolar — lançamento de faltas, atrasos e justificativas por aluno e aula.  
**Palavras-chave de cards:** Frequencia, Falta, Atraso, Presença, Justificativa, frequência diária, abono  
**Remote:** https://github.com/gruposaltaedu/frequencia  
**Run/Build:** `npm run dev` (frontend) + IIS Local (backend em `https://localhost/Frequencia`)
**Frontend Map:** [`frontend-maps/frequencia-angular-map.md`](frontend-maps/frequencia-angular-map.md) *(escaneado em: 2026-07-30)*

Autenticação via cookies do Portal (ElevaId). Backend com estrutura `Frequencia.Api`, `Application`, `Domain`, `Infra`.

---

## notas

**Stack:** .NET 8 · Entity Framework Core · Angular 20 · SQL Server  
**Responsabilidade:** Lançamento e gestão de notas escolares por avaliação, disciplina e etapa.  
**Palavras-chave de cards:** Notas, Avaliacao, Lancamento, nota, conceito, média, disciplina, etapa, boletim (lançamento)  
**Remote:** https://github.com/gruposaltaedu/notas  
**Run/Build:** `dotnet run --project backend/Notas.Api` (backend) / `npm run start` (frontend dev com SSL) / `npm run dev` (frontend watch build)
**Frontend Map:** [`frontend-maps/notas-angular-map.md`](frontend-maps/notas-angular-map.md) *(escaneado em: 2026-07-30)*

Backend com estrutura `Notas.Api`, `Notas.Application`, `Notas.Domain`, `Notas.Domain.Services`, `Notas.Extensions`, `Notas.Infra`, `Notas.Test`. Frontend Angular em `frontend/`. Usa gitflow padrão com branches `develop`, `master`, `homolog`.

---

## portal-atlas

**Stack:** .NET Framework 4.6.1 · ASP.NET MVC · Knockout.js · SQL Server  
**Responsabilidade:** Portal web principal da Eleva — sistema legado que serve como hub de acesso para professores, coordenadores e responsáveis, autenticando via ElevaId.  
**Palavras-chave de cards:** Portal, Eleva.Portal, autenticação, ElevaId, sessão, usuário, login, diário, AcessoResultadoBimestral, BancoQuestoes, AvaliacaoPedagogica, AvaliacaoFormativa  
**Remote:** git@github.com:gruposaltaedu/portal-atlas  

Sistema legado com múltiplos módulos embutidos (subpastas em `Eleva.Portal/`: Acesso, Aula, AvaliacaoFormativa, AvaliacaoPedagogica, BancoQuestoes, Barramento, etc.). Os módulos .NET 8 dependem dos cookies de sessão gerados por este portal.

---

## processador-boletim

**Stack:** .NET 8 · Entity Framework Core · SQL Server · Hangfire  
**Responsabilidade:** Processamento assíncrono de boletins escolares e correção de cartões-resposta (provas objetivas), com jobs recorrentes via Hangfire.  
**Palavras-chave de cards:** Boletim, ProcessadorBoletim, CartaoResposta, Hangfire, processamento, cálculo de notas, arredondamento, Conselho de Classe, Recuperação, prova objetiva, PAS, somatório  
**Remote:** https://github.com/gruposaltaedu/processador-boletim  
**Run/Build:** `dotnet run --project backend/ProcessadorBoletim.Api`

Jobs principais: correção de cartões (a cada 5 min) e processamento de boletins (manual). Cada módulo tem `Docs/` com regras de negócio detalhadas.

---

## salta-playground

**Stack:** Angular 20 (standalone, CLI v20.1.5)  
**Responsabilidade:** Ambiente de prototipagem e experimentação de componentes Angular para o time Salta.  
**Palavras-chave de cards:** playground, protótipo, componente, experimento, spike, POC  
**Remote:** https://github.com/garejano/salta-playground  
**Run/Build:** `ng serve`

Repositório pessoal de experimentação — não é um sistema em produção.

---

## scripts-db-pedagogico

**Stack:** SQL Server (scripts `.sql` puros)  
**Responsabilidade:** Repositório centralizado de scripts SQL do banco pedagógico — views, triggers, functions, jobs agendados e scripts utilitários de manutenção.  
**Palavras-chave de cards:** SQL, View, Trigger, Function, Job, ViewConfiguradorAvaliacoes, ViewConfiguradorAvaliacaoesExportacao, ViewAlocacaoProfessores, Boletim, DocumentacaoPedagogica, ResultadoFinal, carga inicial, importação  
**Remote:** https://github.com/gruposaltaedu/scripts-db-pedagogico  

Organizado em pastas: `Views/`, `Triggers/`, `Function/`, `Jobs/`, `Processos manuais/`, `Scrips úteis/`. Alterações de schema que afetam `estrutura-pedagogica` ou outros módulos geralmente passam por aqui.

---
