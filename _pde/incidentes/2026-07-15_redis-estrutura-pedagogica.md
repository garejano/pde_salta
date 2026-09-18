# Incidente: erro de conexão Redis — estrutura-pedagogica (produção)

**Data:** 2026-07-15
**Ambiente:** production
**Log de origem:** `/aws/estrutura-pedagogica/syslog`
**Instância:** `i-0e0af49366919868e` (`ip-172-17-84-252`, t3a.micro, us-east-1a)
**Redis:** `production-portal-eleva-redis-cluster` (ElastiCache, cluster mode)

## Problema

Às 19:38 UTC, o backend do estrutura-pedagogica (via Hangfire.Pro.Redis) registrou dois erros em sequência:

1. **19:38:10** — `RedisConnectionException: ConnectTimeout` ao tentar conectar no cluster Redis (`clustercfg.production-portal-eleva-redis-cluster...:6379`). Hangfire tentou reconectar imediatamente (`ConnectLoop`).
2. **19:38:33** — `RedisServerException`: o node `production-portal-eleva-redis-cluster-0001-001`, responsável pelo hashslot 4420, não estava acessível no momento do heartbeat do servidor Hangfire (`ServerHeartbeatProcess`).

O Redis é usado pelo Hangfire como storage de jobs em background (filas, agendamentos, heartbeat de servidor). Durante a janela de instabilidade, o processamento desses jobs pode ter atrasado.

## Análise

Investigação feita via AWS CLI (profile `eleva-admin-eficientes-prd`, read-only) no ElastiCache, CloudWatch e EC2.

**Lado do Redis — descartado como causa:**
- Cluster `production-portal-eleva-redis-cluster`: status `available`, sem nenhum evento de failover, reboot ou manutenção nas últimas 24h (`describe-events`) — só o snapshot automático de rotina (~02h).
- Node `0001-001` (o do hashslot 4420): CPU, memória e conexões estáveis durante toda a janela (19:15–19:50 UTC). Nenhum sinal de esgotamento de recursos no servidor.
- Topologia: **cada shard tem apenas 1 node, sem réplica** (0001-001 em `us-east-1b`, 0002-001 em `us-east-1c`, 0003-001 em `us-east-1a`) — sem failover automático em caso de falha de um node.

**Lado da aplicação (EC2 `i-0e0af49366919868e`) — sinal notado, mas não conclusivo:**
- CPU da instância ficou em 61–68% entre 19:10 e 19:35 UTC, caindo para ~20% logo depois — janela que precede os erros.
- Status checks (instance/system) OK durante todo o período — instância não travou nem teve problema de infraestrutura.
- Instância em modo CPU "Unlimited" (créditos surplus subindo, não zerando) — não houve throttling forçado por esgotamento de crédito; a CPU alta foi carga real.
- Os contadores internos do StackExchange.Redis no stack trace (`WORKER: Busy=4, Free=32763`) mostram que o thread pool do .NET **não** estava saturado no momento exato da exceção — descarta thread-pool starvation clássica como causa direta.

**Correlação de CPU entre os incidentes do dia (15/07):**
- Pico de CPU: 19:10–19:30/35 UTC (61–68%), normalizando para ~20–23% a partir de 19:35.
- Erro de Redis (19:38:10 / 19:38:33): ocorre ~3 minutos após o fim do pico — proximidade temporal existe, mas fraca; não é uma sobreposição direta, apenas um resquício possível (ex.: fila de reconexão represada durante o pico).
- Os erros de PDF/SQL do mesmo dia (19:55–20:03 UTC, ver `2026-07-15_pdf-timeout-e-sql-timeout_estrutura-pedagogica.md`) aconteceram **20+ minutos depois**, com a CPU já normal (20–23%) havia muito tempo — ou seja, o pico de CPU **não** tem relação com aqueles erros. Isso reforça que o pico foi um evento pontual e localizado no tempo, não uma degradação sustentada do dia inteiro.

## Conclusão

Não há evidência de queda real do Redis nem de failover — o padrão observado é consistente com uma **falha transitória de rede/conectividade** entre a instância da app (`us-east-1a`) e o node Redis (`us-east-1b`), sem causa raiz visível nas métricas padrão do CloudWatch. A CPU elevada na app pouco
antes é uma coincidência temporal digna de nota, mas os contadores internos do próprio cliente Redis não a apontam como culpada direta.

O sistema se recuperou sozinho em segundos via retry automático do Hangfire. Impacto provável: atraso pontual no processamento de jobs em background, sem indisponibilidade prolongada.

**Ponto de atenção estrutural (independente deste incidente):** o cluster Redis de produção não tem réplica por shard. Qualquer instabilidade pontual de um node vira indisponibilidade total daquele shard, sem failover automático. Vale avaliar se isso é intencional para esse workload (Hangfire/cache) ou se merece revisão.

## O que mais poderia ser investigado

- **VPC Flow Logs** entre a subnet da instância EC2 e a subnet do ElastiCache no intervalo 19:35–19:40 UTC — único jeito de confirmar perda de pacotes/latência de rede real entre AZs.
- **AWS Health Dashboard / Personal Health Dashboard (PHD)** — verificar se houve algum evento de rede ou manutenção na região `us-east-1` reportado pela AWS nesse horário (requer plano de suporte Business/Enterprise).
- **Logs do próprio ElastiCache (slow log / engine log)**, se habilitados, para o node `0001-001` no horário exato.
- **Histórico de outras ocorrências desse mesmo erro** (grep no CloudWatch Logs Insights por `RedisConnectionException` ou `hashslot .* not reachable` nas últimas semanas) — para saber se é um evento isolado ou um padrão recorrente.
- **Correlação com deploys/scaling**: checar se houve deploy, restart do serviço ou evento de Auto Scaling Group na mesma janela, tanto na instância da app quanto em outras instâncias do cluster.
- **Métricas de outras instâncias da app** (se houver mais de uma atrás do load balancer) — para saber se o CPU elevado foi isolado nessa instância ou generalizado, o que ajudaria a diferenciar "app sob carga" de "rede instável para todos".
- **Revisão do `connectTimeout`** configurado na connection string do StackExchange.Redis — a própria exceção sugere aumentá-lo; hoje não sabemos qual valor está configurado.
- **Decisão sobre réplicas no ElastiCache**: avaliar custo x benefício de adicionar 1 réplica por shard para permitir failover automático, dado que a topologia atual expõe o Hangfire a indisponibilidade total do shard em qualquer blip de rede/node.
