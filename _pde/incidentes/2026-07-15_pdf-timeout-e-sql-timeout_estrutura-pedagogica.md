# Incidente: timeouts de geração de PDF (Playwright) e SQL Server — estrutura-pedagogica (produção)

**Data:** 2026-07-15
**Ambiente:** production
**Log de origem:** `/aws/estrutura-pedagogica/syslog`
**Instância:** `i-0e0af49366919868e` (`ip-172-17-84-252`, t3a.micro, us-east-1a)

## Problema

Três alertas em sequência, entre 19:55 e 20:03 UTC (16:55–17:03 horário local):

1. **19:55:58 UTC** — `System.TimeoutException: Timeout 30000ms exceeded` em `GerarPdfService.RenderPageAsync` (`Pdf/GerarPdfService.cs:91`). Playwright travou em "setting frame content, waiting until `networkidle`".
2. **19:56:00 UTC** — mesmo erro, ~2s depois (segunda tentativa/segunda página).
3. **20:02:32 UTC** — mesmo erro de novo, ~7 minutos depois.
4. **20:02:46 UTC** — logo em seguida, um erro diferente: `Microsoft.Data.SqlClient.SqlException: Execution Timeout Expired` durante `AutenticacaoService.CriarNovaSessao` (falha ao criar sessão de login de um usuário) — a query via Entity Framework não completou a tempo.

O erro de PDF já havia ocorrido nesse mesmo dia (ver também `2026-07-15_redis-estrutura-pedagogica.md`, incidente às 19:38 UTC, não relacionado a este). Aqui, o padrão de repetição em 7 minutos indica que **não é um evento isolado**.

## Análise

Investigação via AWS CLI (profile `eleva-admin-eficientes-prd`, read-only).

**Descartado: recurso da instância EC2.**
- CPU da instância ficou estável em ~20–23% durante toda a janela (19:45–20:10 UTC) — sem pico, ao contrário do incidente de Redis das 19:38 (que teve CPU 61–68%). Rede (in/out) também sem anomalia.
- Isso descarta CPU/rede da própria instância como causa nos dois erros deste incidente.

**Correlação de CPU com o incidente de Redis do mesmo dia (19:38 UTC):**
- O único pico de CPU do dia nessa instância foi entre 19:10 e 19:30/35 UTC (61–68%), documentado em `2026-07-15_redis-estrutura-pedagogica.md`.
- Os erros deste incidente (19:55:58, 19:56:00, 20:02:32, 20:02:46) ocorreram **20 a 27 minutos depois** desse pico já ter normalizado, com a CPU consistentemente em 20–23% durante toda a janela.
- Conclusão: **não há relação entre o pico de CPU das 19:10–19:30 e os timeouts de PDF/SQL.** Isso reforça a hipótese de que a causa aqui é externa à instância (banco de dados on-prem ou rede até ele), e não um problema de recurso compartilhado entre os três incidentes do dia.

## Investigação de latência de rede (VPN / Direct Connect / Transit Gateway)

A conectividade da VPC da app (`vpc-08e1df656f0f5f673`, us-east-1) até a rede on-prem não passa por VPN Gateway nem Direct Connect diretamente visíveis nesta conta — ela sai por dois **Transit Gateway attachments**:

- `tgw-attach-01d807b91627b2cd5` → TGW `tgw-069610709ad87beef` (conta dona: `449628033691`) — rotas para as faixas on-prem (`10.0.0.0/8`, `10.201.x`, `172.17-23.x` etc.) — **este é o attachment realmente usado** (tráfego constante).
- `tgw-attach-0c48cc841ec79b460` → TGW `tgw-0ed6d529385a0d5a8` (conta dona: `849716003911`) — rotas para `172.28.0.0/16` e `172.202.0.0/16` — **tráfego zerado** na janela analisada, não é o caminho relevante para o SQL Server.

Os Transit Gateways pertencem a contas AWS diferentes (provavelmente uma conta de rede/hub compartilhada) — não há visibilidade direta dos túneis VPN/Direct Connect do lado de lá a partir deste profile. Foram encontradas conexões VPN em `sa-east-1`, mas elas pertencem a outras VPCs (`vpc-0496525fb4bd2d483`, `vpc-65f3ce02`), não relacionadas a este incidente.

**O que foi possível medir:** as métricas `AWS/TransitGateway` do lado do attachment (visíveis mesmo com o TGW sendo de outra conta):

- **Nenhum drop de pacote** (`PacketDropCountBlackhole`, `PacketDropCountNoRoute`, `PacketDropCountTTLExpired`) em toda a janela 19:10–20:05 UTC, nos dois attachments — descarta problema de roteamento nesse trecho.
- **Pico de tráfego isolado e muito acentuado às 20:01:00–20:02:00 UTC**: `PacketsIn` saltou de ~30 mil/min (baseline) para **298.665** (~10x) e `BytesIn` saltou de ~3 MB/min para **380 MB em 1 minuto** (~115x o normal). Voltou ao normal já no minuto seguinte (20:02:00–20:03:00).
- Esse pico ocorre **30–75 segundos antes** do timeout de PDF das 20:02:32 e do timeout de SQL das 20:02:46 — a correlação temporal é forte.
- **Esse mesmo pico não aparece nem perto dos dois primeiros timeouts de PDF (19:55:58 e 19:56:00)** — tráfego nessa janela estava normal (~29–32 mil pacotes/min). Também não aparece perto do incidente de Redis (19:30–19:41 UTC, tráfego normal).

**Interpretação:** há uma correlação forte e específica entre o pico de tráfego e **apenas o terceiro evento** (PDF das 20:02:32 + SQL das 20:02:46) — um volume de dados ~115x acima do normal atravessando o mesmo caminho de rede usado para chegar ao banco on-prem, momentos antes de dois timeouts distintos, é uma coincidência improvável. Isso é mais consistente com saturação momentânea de banda/latência nesse link do que com o banco de dados em si.

Já os dois primeiros timeouts de PDF (19:55:58 / 19:56:00) **continuam sem explicação nas métricas de infraestrutura** — nem CPU, nem rede no TGW mostram qualquer anomalia. A causa desses dois provavelmente está no lado do banco (lock, query lenta) ou na própria requisição/conteúdo sendo renderizado, não na infraestrutura de rede/instância.

**Limitações:** essa métrica é no nível do attachment da VPC inteira, não isolada por instância ou por IP de origem/destino — não dá para confirmar que o pico de tráfego foi gerado pela própria app ou pelo SQL Server especificamente. Para confirmar a origem/destino exatos, seria necessário habilitar e consultar **VPC Flow Logs** para essa subnet/ENI nesse minuto exato.

**Banco de dados — fora do escopo de visibilidade AWS.**
- O SQL Server de produção do estrutura-pedagogica não está no RDS desta conta AWS (`describe-db-instances` não retorna nenhuma instância correspondente — os RDS existentes são de outros produtos/Aurora PostgreSQL). Conforme documentado no projeto, o SQL Server roda on-premise (`belerofonte.eleva.local` é o host usado no ambiente de homolog; produção deve usar host equivalente on-prem).
- Isso significa que **não é possível confirmar via CloudWatch** se o SQL Server estava sob carga, bloqueado (lock/blocking) ou com problema de rede na janela do incidente — precisaria de monitoramento direto do SQL Server on-prem (Perfmon, `sys.dm_exec_requests`, `sys.dm_os_wait_stats`, Extended Events) ou do time de infra responsável por ele.

**Hipótese de causa raiz (não confirmada, mas coerente com os sintomas):**

Os dois sintomas — Playwright travando em `networkidle` e SQL Server dando `Execution Timeout` — são consistentes com uma **lentidão ou instabilidade no SQL Server on-prem (ou no caminho de rede até ele)** nessa janela:

- O timeout de SQL é direto: uma query de login não completou em tempo.
- O timeout do Playwright é indireto, mas plausível: `RenderPageAsync` usa `SetContentAsync` (HTML já montado em memória) e espera `networkidle` — ou seja, aguarda que **todas as requisições de rede disparadas pela página parem** por um tempo. Se o HTML renderizado contém imagens, gráficos ou dados carregados via chamadas para a própria API do backend (que por sua vez consulta o SQL Server), uma consulta lenta no banco faria essas requisições demorarem, e o `networkidle` nunca seria atingido dentro dos 30s.

Ou seja: **CPU/rede da instância estão descartados; o ponto em comum mais provável é o banco de dados**, mas isso não foi confirmado diretamente — falta acesso a métricas do SQL Server em si.

## Conclusão

- Instância EC2 saudável durante todo o incidente (CPU, rede) — descarta problema de recurso local.
- Padrão de repetição (3x em 7 min) indica instabilidade real, não um evento isolado de rede.
- Hipótese líder: lentidão/instabilidade no SQL Server on-prem (ou na rede até ele) nessa janela, afetando tanto queries diretas (timeout de login) quanto indiretamente a geração de PDF (se o HTML renderizado depende de dados vindos da API/banco).
- Essa hipótese **não pôde ser confirmada** com as ferramentas disponíveis nesta conta AWS, pois o banco de produção não está hospedado aqui.

## O que mais poderia ser investigado

- **Monitoramento do SQL Server on-prem** na janela 19:55–20:03 UTC: `sys.dm_exec_requests` / `sys.dm_os_wait_stats` para identificar queries bloqueadas ou esperas anômalas (locks, I/O, rede); Perfmon do host (CPU, disco, memória) nesse mesmo horário.
- **VPC Flow Logs da subnet/ENI da instância** para o minuto 20:01–20:02 UTC — prioridade alta agora: já confirmamos um pico de ~380 MB/min no Transit Gateway attachment que leva ao on-prem, mas não sabemos a origem/destino exatos. Flow Logs revelariam se foi tráfego da própria app (ex.: um payload grande sendo enviado/recebido) ou de outro recurso na mesma VPC.
- **Time de rede/infra responsável pelo Transit Gateway** (contas `449628033691` / `849716003911`, prováveis contas de rede/hub) — pedir visão do lado deles: túneis VPN/Direct Connect, latência e se algum outro workload gerou esse pico de tráfego às 20:01 UTC.
- **Confirmar o que o HTML da PDF realmente carrega**: revisar `GerarPdfService.RenderPageAsync` e o template usado para saber se ele faz chamadas de rede (imagens externas, fontes de CDN, chamadas à própria API) durante a renderização — isso decide se a hipótese "banco lento → networkidle nunca dispara" é plausível ou se a causa é outra (ex.: recurso externo específico travando).
- **Correlacionar com outras instâncias/usuários**: verificar se outras requisições de login ou geração de PDF na mesma janela também falharam, ou se foi isolado a essas poucas tentativas — ajuda a diferenciar "banco geral lento" de "uma sessão específica travada".
- **Configuração de timeout do EF Core / SqlCommand**: qual o `CommandTimeout` configurado hoje, e se aumentar/monitorar isso é uma mitigação razoável enquanto a causa raiz no banco não é resolvida.
- **Verificar se há relação com o incidente de Redis das 19:38 UTC** (mesmo dia, mesma instância, arquivo `2026-07-15_redis-estrutura-pedagogica.md`) — mesmo com ~17 min de diferença, vale checar se há um padrão maior de instabilidade na infraestrutura de produção nesse dia.
- **Histórico recorrente**: buscar nos logs (CloudWatch Logs Insights, se acessível) quantas vezes `"Erro ao gerar PDF"` ou `"networkidle"` e `"Execution Timeout Expired"` já ocorreram nas últimas semanas — para saber se isso é um padrão crônico ou uma anomalia pontual desse dia.
