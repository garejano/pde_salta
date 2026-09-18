# Healthcheck de PDF — frequencia

## Objetivo

Alguns repositórios possuem endpoints de healthcheck checados por smoketests na AWS (deploy gate + monitoramento externo). Exemplos: `documentacao-pedagogica` e `estrutura-pedagogica`.

O `frequencia` expõe um endpoint de geração de PDF (`POST /api/Pdf`) consumido por outros módulos (ex.: `estrutura-pedagogica`, `documentacao-pedagogica`). Objetivo: adicionar um healthcheck que valide o funcionamento real do serviço de PDF (Playwright/Chromium), para que quem consome `/api/Pdf` tenha uma forma barata de confirmar que o serviço está funcional — e para que o próprio deploy do `frequencia` falhe cedo se o Chromium não estiver operacional.

## Análise dos repositórios de referência

Ambos `documentacao-pedagogica` e `estrutura-pedagogica` (e o próprio `frequencia`, que **já** tem a base) seguem o mesmo padrão:

- `Controllers/Core/HealthController.cs` — `[AllowAnonymous]`, `[ExcludeFromCodeCoverage]`
- `Domain.Services/Core/HealthCheck/{IHealthCheckService,HealthCheckService}.cs`
- Cada check retorna `ServiceResult` (sucesso = sem erros); o controller usa `Result(...)` para mapear em HTTP status

Endpoints comuns aos três repositórios:

| Rota | Propósito |
|---|---|
| `GET /healthcheck` | Ping puro, sempre 200 |
| `GET /healthcheck/deploy` | Gate de deploy — só executa checks reais em produção (`CheckDeploy` retorna sucesso vazio fora de produção) |
| `GET /api/health/database` | Testa conexão com o banco (`IUsuarioRepository.GetAny()`) |
| `GET /api/health/saltaid` | Testa `IElevaIdRepository.GetApplicationToken()` — falha aqui **não** deve derrubar o deploy (é outro sistema, não um recurso próprio) |
| `GET /api/health/hangfire` | `JobStorage.Current.GetMonitoringApi().GetStatistics()`, só se `UseHangfire` |

Checks específicos por repositório (integrações cross-módulo, mesmo padrão: `IXxxRepository.HealthCheck()` faz uma chamada HTTP ao módulo remoto):

- `documentacao-pedagogica`: `barramentopedagogico`, `frequencia`, `notas`, `estruturapedagogica`
- `frequencia`: `barramento-pedagogico`
- `estrutura-pedagogica`: `twilio` — **este é o padrão mais próximo do que precisamos para o PDF.**

### O caso Twilio (estrutura-pedagogica) como modelo

`CheckTwilio()` não dispara um envio real a cada chamada de healthcheck (teria custo e side-effect por requisição). Em vez disso, consulta o resultado do **último teste automático** já executado (`ExisteRemetenteAtivoComFalhaNoUltimoTeste()`). Ausência de teste não é considerada falha.

Para o PDF, o cálculo de custo é diferente: abrir uma página no Chromium headless já em memória (singleton) é rápido e não tem custo externo — não precisamos do padrão assíncrono/cacheado do Twilio. Um check síncrono e direto é viável a cada chamada.

### Deploy gate (`validate-service.sh`)

Idêntico em `frequencia` e `estrutura-pedagogica`:

```bash
for i in $(seq 60); do
  http_response=$(curl -s -o response.txt -w "%{http_code}" http://localhost/healthcheck/deploy)
  [ $http_response -eq 200 ] && break
  sleep 4
done
# exit 1 se nunca retornar 200 → bloqueia o deploy
```

Ou seja: **tudo que entrar em `CheckDeploy()` passa a ser um gate de deploy real**, checado até 60x (4 min) após o deploy, na instância local.

## Por que isso importa agora (incidentes reais)

- **`_pde/incidentes/2026-07-28_playwright-headless-shell-ausente_estrutura-pedagogica.md`**: após um bump de versão do `Microsoft.Playwright` (1.52.0 → 1.61.0), o binário `chrome-headless-shell` não ficou presente em `/var/ms-playwright` após o `after-install.sh` — falha silenciosa no deploy, só visível quando a aplicação tentou lançar o browser **em produção**, gerando 376 erros em ~15 min na fleet inteira. A correção foi tornar a instalação do `after-install.sh` explícita e falhar o deploy se o binário não existir em disco — mas isso só cobre a *instalação*, não o *lançamento em runtime* do Chromium.
- **`_pde/incidentes/2026-07-15_pdf-timeout-e-sql-timeout_estrutura-pedagogica.md`**: timeouts de `RenderPageAsync` (`networkidle` nunca atingido em 30s), hipótese líder ligada a lentidão do SQL Server on-prem/rede afetando recursos carregados pela página renderizada — não é algo que um healthcheck simples de "o browser abre" cobre, mas reforça que geração de PDF tem falhas reais e recorrentes em produção que hoje só aparecem no runtime de um usuário real.

Um healthcheck de PDF standalone (`api/health/pdf`, fora do gate de deploy) dá visibilidade contínua e barata para quem consome `/api/Pdf` — cobre a classe de incidente de 28/07 (browser não lança) e sinaliza indisponibilidade também na classe de incidente de 15/07, mesmo sem preveni-la.

## O que já existe no `frequencia`

`frequencia` já tem a base completa do padrão (`HealthController`, `IHealthCheckService`/`HealthCheckService` com `CheckDeploy`, `CheckDatabase`, `CheckSaltaId`, `CheckHangfire`, `CheckBarramentoPedagogico`). **Falta apenas o check de PDF.**

Stack de geração de PDF relevante:

- `Frequencia.Api/Controllers/PdfController.cs` — `POST /api/Pdf`, `[AllowAnonymous]` (chamado por outros módulos, sem sessão do domínio Frequência)
- `Frequencia.Domain.Services/Pdf/GerarPdfService.cs` — orquestra a geração via Playwright
- `Frequencia.Domain.Services/Pdf/PdfBrowserService.cs` (`IPdfBrowserService`) — **Singleton**, mantém 1 `IBrowser` (Chromium headless) vivo por instância; `CreatePageAsync()` reutiliza o browser (relançando se desconectado) e abre uma nova `IPage`

## Plano de implementação

### 1. `IHealthCheckService` / `HealthCheckService` — novo `CheckPdf()`

Injetar `IPdfBrowserService` (já é Singleton, injeção em serviço Transient é seguro) e validar que o Chromium consegue abrir e fechar uma página — sem renderizar HTML nem gerar PDF de verdade (evita custo/latência desnecessários a cada chamada de healthcheck):

```csharp
public async Task<ServiceResult> CheckPdf()
{
   ServiceResult result = new();

   try
   {
      var page = await _pdfBrowserService.CreatePageAsync();
      await page.CloseAsync();
   }
   catch (Exception)
   {
      result.AddError("Ocorreu um erro ao tentar inicializar o serviço de geração de PDF (Chromium/Playwright).");
   }

   return result;
}
```

Isso cobre exatamente a classe do incidente de 28/07 (binário do Chromium ausente/incompatível) — é o mesmo `CreatePageAsync()` que falhava em produção.

### 2. `HealthController` — novo endpoint

Seguir o padrão das rotas existentes (`saltaid`, `hangfire`, `barramento-pedagogico`):

```csharp
[HttpGet("api/[controller]/pdf")]
[ApiExplorerSettings(IgnoreApi = false)]
public async Task<IActionResult> CheckPdf([FromServices] IHealthCheckService service)
{
   return Result(await service.CheckPdf());
}
```

Rota final: `GET /api/health/pdf` — consumível externamente por quem chama `/api/Pdf` (ex.: `estrutura-pedagogica`, `documentacao-pedagogica`) para validar disponibilidade antes/independente de uma geração real.

### 3. `CheckPdf()` fica fora do `CheckDeploy()` — decisão

`CheckPdf()` **não** entra na cadeia de `CheckDeploy()`. Fica só como endpoint standalone (`api/health/pdf`), no mesmo grupo de `CheckSaltaId`/`CheckBarramentoPedagogico` — checks que existem para monitoramento/consumo externo, mas não bloqueiam deploy.

Motivo: bloquear o deploy nesse ponto arriscaria falso-positivo por cold start do Chromium singleton (primeira inicialização do browser pode ser lenta e não é indicativo real de indisponibilidade) e tornaria `validate-service.sh` mais frágil sem necessidade — o cenário do incidente de 28/07 (binário ausente após instalação) já tem sua própria salvaguarda no `after-install.sh`, que falha o deploy na etapa de instalação antes mesmo do healthcheck rodar.

### 4. Fora de escopo desta mudança

- **Não** replicar o padrão assíncrono/cacheado do Twilio (teste periódico + consulta do último resultado) — desnecessário aqui, pois abrir/fechar uma página no Chromium já em memória é uma operação local e barata, sem custo externo por chamada.
- **Não** cobre o incidente de 15/07 (timeout de rede/SQL durante o render de um HTML real) — esse cenário depende de conteúdo/dados externos que um healthcheck sintético não reproduz fielmente. Ficaria coberto apenas indiretamente pelo `CheckDatabase()` já existente.

## Checklist de tarefas

- [ ] `IHealthCheckService`: adicionar `Task<ServiceResult> CheckPdf()`
- [ ] `HealthCheckService`: injetar `IPdfBrowserService`, implementar `CheckPdf()`
- [ ] `HealthController`: adicionar `GET api/health/pdf` (endpoint standalone, fora do `CheckDeploy()`)
- [ ] Testes: cobrir `CheckPdf()` com um mock de `IPdfBrowserService` que lança exceção (cenário "Chromium ausente") e um que retorna página normalmente
