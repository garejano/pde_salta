# Análise — Levar geração de PDF via Playwright para o repositório `frequencia`

> Base: `pdf_no_backend.md`, `pdf_no_backend_infra.md`, `pdf_no_backend_plano.md`, `pdf_no_backend_refinamento.md`, `analise-incidente-endpoint-pdf.md`, `_pde/incidentes/2026-07-15_*.md`, `_pde/incidentes/2026-07-28_*.md`
> Repositórios inspecionados: `estrutura-pedagogica` (implementação real, não só o plano) e `frequencia` (estado atual)

**Escopo confirmado:** só backend. Nenhuma mudança de frontend será feita. O endpoint de PDF em `frequencia` é um **serviço à parte**, desacoplado do domínio de Frequência (não depende de `Chamada`, `ListaPresenca` ou qualquer outra feature do módulo) — hoje ele só vive dentro do mesmo backend/deploy do `frequencia` por conveniência de infraestrutura, não porque pertence ao domínio. Isso já é como o código do `estrutura-pedagogica` está organizado (pasta `Pdf/` isolada, `GerarPdfService` só depende de `IPdfBrowserService` + `IHttpClientFactory` + `ILogger`, nada de domínio específico) — a mesma isolação deve valer em `frequencia`. Qualquer geração de PDF já existente no frontend de `frequencia` (client-side) é irrelevante para este trabalho e não entra nesta análise.

---

## 1. O que existe hoje em `estrutura-pedagogica` (implementação real, difere do plano original)

O plano original (`pdf_no_backend_plano.md`) evoluiu bastante depois de rodar em produção. O código atual em
`backend/EstruturaPedagogica.Domain.Services/Pdf/` é o que deve ser copiado como referência — **não o plano**:

| Arquivo | Papel |
|---|---|
| `Pdf/Interfaces/IPdfBrowserService.cs` | Contrato do gerenciador de `IBrowser` |
| `Pdf/PdfBrowserService.cs` | Singleton, `Lazy<Task<IBrowser>>` thread-safe, com **reset automático se o browser desconectar** (`browser.IsConnected`) e evento `Disconnected` logado |
| `Pdf/Interfaces/IGerarPdfService.cs` | Contrato do serviço de geração (herda `IBaseService`, `Transient`) |
| `Pdf/GerarPdfService.cs` | Gera 1 PDF (`GerarAsync`) ou N PDFs em um `.zip` (`GerarZipAsync`) |
| `Domain/DTO/Pdf/PdfRequest.cs`, `PdfZipRequest.cs`, `PdfGeracaoResult.cs` | DTOs |
| `Api/Controllers/PdfController.cs` | `POST /api/pdf` e `POST /api/pdf/zip` |
| `Core/Initialization/DependencyInjectionServices.cs` | Registro manual do singleton (não é auto-descoberto por herdar `IBaseService`) |

Diferenças importantes em relação ao plano de `pdf_no_backend_plano.md`:

- **Página com `Width`/`Height` explícitos em mm** (`210mm`/`297mm`), não `Format = PaperFormat.A4` + `Landscape` — evita comportamento inconsistente do Playwright ao combinar as duas opções.
- **Proxy de imagens via `page.RouteAsync`**: toda requisição de imagem é interceptada e buscada pelo próprio backend com `HttpClient` e timeout curto (8s), independente do timeout geral da página (30s). Se falhar, a rota é abortada (não trava o `NetworkIdle`) e a URL é reportada de volta ao frontend no header `X-Fotos-Com-Falha` — o frontend usa isso para tentar regenerar só essas fotos em thumbnail. **Este é o motivo real dos ajustes de foto** mencionados no incidente de 16–17/07 — não tem relação com a causa raiz dos erros 400/499 daquele dia.
- **Instrumentação pesada de eventos do Playwright**: `page.Crash`, `page.PageError`, `page.Console` (só `error`), `page.RequestFailed`, `page.Response` (status ≥ 400), `page.Dialog` (auto-dismiss). Tudo logado com o índice do documento (`logIndex`), útil quando há múltiplos documentos no fluxo de zip.
- **`GerarZipAsync`**: usado para gerar múltiplos documentos em lote num único `.zip`, reaproveitando `RenderPageAsync` por item.
- **Erro é sempre capturado e vira `ServiceResult` de falha** (nunca deixa exceção subir do serviço) — a exceção original vai só para o log, incluindo o valor de `PLAYWRIGHT_BROWSERS_PATH` no momento da falha (isso foi decisivo para diagnosticar os dois incidentes de infraestrutura abaixo).

### Lições de produção que **precisam** ser replicadas na infra do `frequencia` (não são opcionais)

Três incidentes reais, documentados em `_pde/incidentes/`:

1. **`2026-07-17` (Causa A do `analise-incidente-endpoint-pdf.md`)** — `after-install.sh` instalava dependências do Chromium via `apt-get install` sem rodar `apt-get update` antes, e faltava `libatspi2.0-0`. 86% dos erros do período vieram disso — falha "Host system is missing dependencies to run browsers", agnóstica a página/conteúdo, dependia só de em qual instância a requisição caía.
2. **`2026-07-28`** — Ao atualizar o NuGet `Microsoft.Playwright` (1.52.0 → 1.61.0), o binário exigido mudou de `chromium` para `chromium` **+** `chrome-headless-shell` (um executável separado desde o Playwright 1.45, usado quando `Headless = true` é passado sem canal explícito — que é exatamente como o `PdfBrowserService` inicializa). O `after-install.sh` só instalava `chromium`, então `chrome-headless-shell` ficou ausente em todas as instâncias após o deploy — falha só apareceu em runtime, em produção.
3. **`2026-07-15`** — Timeouts de 30s em `SetContentAsync(..., WaitUntilState.NetworkIdle)`, correlacionados (não confirmados) com lentidão do SQL Server on-prem — se o HTML depende de chamadas à própria API/banco, uma consulta lenta atrasa o `NetworkIdle` e estoura o timeout. Há também uma hipótese em aberto de **contenção do `IBrowser` singleton** sob carga concorrente (várias gerações de PDF disputando o mesmo processo Chromium por instância).

O `after-install.sh` **atual** de `estrutura-pedagogica` já incorpora as correções dos itens 1 e 2:
```bash
apt-get update
apt-get install -y --no-install-recommends \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libatspi2.0-0 libcups2 libdrm2 \
    libdbus-1-3 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
    python3-pip

if [ -f /var/www/html/playwright.sh ]; then
    chmod +x /var/www/html/playwright.sh
    PLAYWRIGHT_BROWSERS_PATH=/var/ms-playwright /var/www/html/playwright.sh install chromium chromium-headless-shell
else
    pip3 install playwright==1.61.0
    PLAYWRIGHT_BROWSERS_PATH=/var/ms-playwright python3 -m playwright install chromium chromium-headless-shell
fi

if ! find /var/ms-playwright -type f -name "chrome-headless-shell" | grep -q .; then
    echo "ERRO: chrome-headless-shell não encontrado em /var/ms-playwright após a instalação do Playwright." >&2
    exit 1
fi
```

---

## 2. O que existe hoje em `frequencia`

> O frontend do `frequencia` (`lista-presenca.component.ts`) tem uma geração de PDF client-side própria, via `html2pdf.js` — **irrelevante para este trabalho e desconsiderada nesta análise**. O endpoint novo é um serviço à parte, sem relação com esse fluxo existente; não há integração entre os dois neste momento (§4).

- **Nenhum código de PDF no backend** (`grep Pdf` no backend não retorna nada além de assets estáticos do wwwroot compilado).
- **Infra do backend é idêntica à do `estrutura-pedagogica`**: mesmo padrão de deploy (AWS CodeDeploy, EC2 Linux, systemd `backend`, `appspec.yml` com os mesmos 5 hooks, `after-install.sh` hoje **vazio** — só tem o `export PATH`). `.csproj` já tem `RuntimeIdentifiers: win-x64;linux-x64` tanto no `Frequencia.Api` quanto no `Frequencia.Domain.Services`.
- **`services.AddHttpClient()`** já está registrado em `Startup.cs:55` — o `IHttpClientFactory` necessário para o proxy de imagens (igual ao `GerarPdfService` de `estrutura-pedagogica`) **já está disponível**, não precisa ser adicionado.
- Padrões de arquitetura são equivalentes: `IBaseService` (marker vazio, auto-registrado como `Transient` via reflection em `AddServices()`), `ServiceResult<T>` (mesmíssima API: `.WithError()`, `.IsSuccess`, `.Data`), `CustomController.Result(ServiceResult)`, `RequiredAuthorizationAttribute` (mesma lógica de filtro, só troca `IElevaIdGetService`/`IAutenticacaoService` por `IElevaIdGetFacade`/`IUsuarioAuthFacade`).
- `Frequencia.Domain/DTO/` segue a mesma convenção de pastas por feature (`DTO/ListaPresenca/`, `DTO/Chamada/` etc.) — uma pasta `DTO/Pdf/` se encaixa naturalmente.

---

## 3. Mudanças necessárias no backend do `frequencia`

Mapeamento direto, arquivo a arquivo, do que existe em `estrutura-pedagogica`:

### 3.1 Novos arquivos

| Novo arquivo em `frequencia` | Espelha (em `estrutura-pedagogica`) | Observações |
|---|---|---|
| `Frequencia.Domain/DTO/Pdf/PdfRequest.cs` | `EstruturaPedagogica.Domain/DTO/Pdf/PdfRequest.cs` | Idêntico — `Html` + `Orientation` |
| `Frequencia.Domain/DTO/Pdf/PdfGeracaoResult.cs` | idem | `Bytes` + `FotosComFalha` |
| ~~`Frequencia.Domain/DTO/Pdf/PdfZipRequest.cs`~~ | idem | **Não portar nesta etapa** — decidido, sem uso no momento (ver §5) |
| `Frequencia.Domain.Services/Pdf/Interfaces/IPdfBrowserService.cs` | idem | Idêntico |
| `Frequencia.Domain.Services/Pdf/PdfBrowserService.cs` | idem | Idêntico, trocando `EstruturaPedagogica.*` por `Frequencia.*` nos usings/namespace |
| `Frequencia.Domain.Services/Pdf/Interfaces/IGerarPdfService.cs` | idem | Idêntico (herda `IBaseService`) |
| `Frequencia.Domain.Services/Pdf/GerarPdfService.cs` | idem | Idêntico — injeta `IPdfBrowserService`, `IHttpClientFactory` (já disponível), `ILogger` |
| `Frequencia.Api/Controllers/PdfController.cs` | idem | Troca `[RequiredAuthorization]` sem argumentos (`estrutura-pedagogica` também não passa `Funcionalidade` aqui) — manter igual: qualquer usuário autenticado |

### 3.2 Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `Frequencia.Domain.Services/Frequencia.Domain.Services.csproj` | Adicionar `<PackageReference Include="Microsoft.Playwright" Version="1.61.0" />` — **versão fixa, deliberadamente pinada** (mesma do `estrutura-pedagogica` hoje), para evitar atualizações desconhecidas do pacote e repetir o incidente de 28/07 (ver §5) |
| `Frequencia.Domain.Services/Core/Initialization/DependencyInjectionServices.cs` | Adicionar `services.AddSingleton<IPdfBrowserService, PdfBrowserService>();` após `AddServices()`/`AddValidators()` — **registro manual obrigatório**, pois `PdfBrowserService` não herda `IBaseService` de propósito (não pode ser `Transient`) |
| `BuildCfg/DeployScripts/after-install.sh` | Copiar o script já corrigido do `estrutura-pedagogica` (seção 1) — inclui `apt-get update`, `libatspi2.0-0`, instalação de `chromium` + `chromium-headless-shell`, fallback `pip3` e verificação pós-instalação com `exit 1` |
| Secret `production/frequencia/parameters` e `homologation/frequencia/parameters` (Secrets Manager, `us-east-1`) | Adicionar `"Playwright": { "BrowsersPath": "/var/ms-playwright" }` — mesmo path usado no `estrutura-pedagogica` (isolado por instância, não há conflito) |

### 3.3 Sem mudança necessária

- `services.AddHttpClient()` — já existe.
- `IBaseService`, `ServiceResult<T>`, `CustomController`, `RequiredAuthorizationAttribute` — já existem e são equivalentes.
- `appspec.yml`, `before-install.sh`, `application-start.sh` — mesmo padrão do `estrutura-pedagogica`, nenhuma mudança precisa.
- Timeout do Kestrel para o body do HTML — mesmo cuidado do plano original (`MaxRequestBodySize`), mas nenhuma configuração customizada foi encontrada em `estrutura-pedagogica`; se não foi necessário lá, não deve ser aqui.

---

## 4. Frontend do próprio `frequencia` — fora de escopo

Confirmado: **nenhuma mudança de frontend agora**, em nenhuma tela ou fluxo existente. O endpoint fica pronto e testável isoladamente (Swagger/Postman), mas nada no `frequencia` passa a chamá-lo neste momento — a integração com algum consumidor (frontend do `frequencia` ou de outro módulo) é decisão futura, fora deste card.

Implicação prática: como não há consumidor real ainda, não há como validar o contrato do `PdfRequest`/`Orientation` contra um caso de uso concreto do `frequencia` — a validação fica restrita a chamadas manuais de teste (ex.: HTML de exemplo via Swagger), replicando o que o `estrutura-pedagogica` já expõe.

---

## 5. Pontos em aberto / decisões do time

- **Fluxo de zip (`GerarZipAsync`/`PdfZipRequest`) — decidido: não portar.** Não há uso para múltiplos documentos em um único `.zip` no momento. Mantido de fora desta primeira etapa (evita código morto); adicionar só se/quando surgir um caso de uso real.
- **Fotos com falha (`X-Fotos-Com-Falha`)**: como não há frontend consumindo o endpoint ainda (§4), o header não tem nenhum consumidor real hoje — mas **o mecanismo de proxy de imagem com timeout de 8s do `GerarPdfService` deve ser portado de qualquer forma**, independente do header, porque é o que evita que uma imagem lenta/indisponível no HTML recebido trave o `NetworkIdle` até o timeout de 30s (a causa exata do incidente de 15/07). Manter o header por paridade e observabilidade (log já reporta as URLs com falha), sem depender de nenhum consumidor para ter valor.
- **Versão do Playwright — decidido: fixar em `1.61.0` exata, sem range/wildcard.** Objetivo explícito: evitar atualizações desconhecidas/automáticas do pacote (`Version="1.61.0"` no `PackageReference` já é exata por padrão do NuGet — não usar `"1.61.*"` ou similar). Bumps futuros devem ser deliberados e sempre acompanhados da atualização correspondente do `after-install.sh` (instalação explícita do binário `chromium-headless-shell` compatível) — é exatamente a falta dessa disciplina que causou o incidente de 28/07 no `estrutura-pedagogica`. Como os dois repositórios têm deploys independentes, não há acoplamento automático entre eles — só o risco de divergir silenciosamente se não for revisado.
- **Contenção do browser singleton sob carga concorrente — decidido: manter 1 instância de `IBrowser` por instância EC2, por enquanto.** Mesmo padrão do `estrutura-pedagogica` (que tem essa mesma limitação hoje, com hipótese em aberto e não confirmada de contenção sob carga — incidente de 15/07, "Causa B"). Como o `frequencia` roda em processo/instância própria (Chromium não compartilhado com `estrutura-pedagogica`), começa isolado do histórico de incidentes daquele repositório. Refatorar para um pool de instâncias de browser é uma melhoria futura em aberto, a considerar só se o volume de geração de PDF no `frequencia` crescer a ponto de justificar — não é necessário nesta implementação.

---

## 6. Resumo executivo (ordem sugerida de implementação)

1. ✅ `Frequencia.Domain.Services.csproj` → adicionado `Microsoft.Playwright 1.61.0`.
2. ✅ Criado `DTO/Pdf/PdfRequest.cs` e `DTO/Pdf/PdfGeracaoResult.cs` em `Frequencia.Domain`.
3. ✅ Criado `Pdf/Interfaces/IPdfBrowserService.cs` e `Pdf/PdfBrowserService.cs` em `Frequencia.Domain.Services` (cópia adaptada).
4. ✅ Criado `Pdf/Interfaces/IGerarPdfService.cs` e `Pdf/GerarPdfService.cs` — só `GerarAsync` (sem `GerarZipAsync`, decidido não portar), com o proxy de imagem via `RouteAsync` (timeout de 8s) e a instrumentação de eventos do Playwright, ambos portados integralmente.
5. ✅ Registrado o singleton em `Frequencia.Domain.Services/Core/Initialization/DependencyInjectionServices.cs`.
6. ✅ Criado `Frequencia.Api/Controllers/PdfController.cs` com `POST /api/pdf`.
7. ✅ Atualizado `BuildCfg/DeployScripts/after-install.sh` com o script já corrigido do `estrutura-pedagogica`.
8. ⏳ **Pendente — ação manual do time**: adicionar `Playwright.BrowsersPath` nos secrets de homolog/produção do `frequencia` no AWS Secrets Manager. Não executado por este agente (write em AWS produção/homolog exige ação humana) — passo a passo documentado em **§7**.
9. ⏳ **Pendente**: testar `POST /api/pdf` isolado (Swagger), sem nenhuma integração de frontend — depende do deploy com o secret do item 8 aplicado. Escopo termina aqui.

Todos os arquivos de código (itens 1–7) já foram criados/modificados no repositório `frequencia` local.

---

## 7. Secrets Manager — mudanças necessárias em `frequencia` (ação manual, não executada)

`PdfBrowserService.InitBrowserAsync` lê `config["Playwright:BrowsersPath"]` no startup (com fallback para `/var/ms-playwright` se a chave não existir — ver `PdfBrowserService.cs`). Para alinhar com o `estrutura-pedagogica` e deixar o valor explícito na configuração (em vez de depender do fallback hardcoded), é preciso adicionar a chave `Playwright` nos dois secrets do `frequencia`, no mesmo nível das chaves já existentes (`AwsSecretManagerKey` aponta para o nome do secret, não é uma chave dentro dele — as chaves reais hoje são coisas como `Database`, `Hangfire` etc., lidas via `SettingsGetter.Instance`).

> Este agente é somente-leitura na AWS por regra do projeto — os comandos abaixo são para o time executar manualmente, não foram rodados.

### Homologação

**Secret:** `homologation/frequencia/parameters` (`us-east-1`) — mesmo secret referenciado em `BuildCfg/BackendConfigs/appsettings-homologation.json` (`AwsSecretManagerKey`).

Adicionar ao JSON do secret:
```json
"Playwright": {
    "BrowsersPath": "/var/ms-playwright"
}
```

```bash
# 1. Baixar o valor atual do secret
aws secretsmanager get-secret-value \
    --secret-id "homologation/frequencia/parameters" \
    --region us-east-1 \
    --profile eleva-admin-eficientes-hml \
    --query SecretString --output text > /tmp/secret-frequencia-hml.json

# 2. Editar o arquivo baixado, adicionando a chave "Playwright" (ver JSON acima)
# 3. Publicar a nova versão do secret
aws secretsmanager put-secret-value \
    --secret-id "homologation/frequencia/parameters" \
    --region us-east-1 \
    --profile eleva-admin-eficientes-hml \
    --secret-string file:///tmp/secret-frequencia-hml.json
```

### Produção

**Secret:** `production/frequencia/parameters` (`us-east-1`) — referenciado em `appsettings-production.json`.

Mesma adição:
```json
"Playwright": {
    "BrowsersPath": "/var/ms-playwright"
}
```

```bash
aws secretsmanager get-secret-value \
    --secret-id "production/frequencia/parameters" \
    --region us-east-1 \
    --profile eleva-admin-eficientes-prd \
    --query SecretString --output text > /tmp/secret-frequencia-prd.json

# Editar o arquivo adicionando a chave "Playwright", depois:
aws secretsmanager put-secret-value \
    --secret-id "production/frequencia/parameters" \
    --region us-east-1 \
    --profile eleva-admin-eficientes-prd \
    --secret-string file:///tmp/secret-frequencia-prd.json
```

### Observações

- **Path igual ao do `estrutura-pedagogica` (`/var/ms-playwright`)** — sem conflito: cada repositório roda em suas próprias instâncias EC2, com seu próprio filesystem. Não há recurso compartilhado entre os dois secrets/deploys.
- **Sem a chave, o serviço ainda funciona** — `PdfBrowserService` já tem fallback hardcoded para `/var/ms-playwright` (mesmo valor). Adicionar a chave no secret é sobre deixar explícito e auditável na configuração, igual ao `estrutura-pedagogica`, não é bloqueante para o Chromium encontrar o path certo.
- **O que de fato é bloqueante**: o binário `chrome-headless-shell` existir em `/var/ms-playwright` no host — isso é resolvido pelo `after-install.sh` já atualizado (item 7 do checklist), não pelo secret.
- Depois de atualizar o secret, é necessário um novo deploy (ou reciclo da instância) para a aplicação carregar o valor — `IConfiguration` só relê o Secrets Manager no startup.

---

## 8. Frontend do `estrutura-pedagogica` — redirecionado para o backend do `frequencia`

Implementado. O `document-builder` (módulo do frontend de `estrutura-pedagogica`) passa a chamar o backend do `frequencia` para gerar PDF único, em vez do próprio backend de `estrutura-pedagogica`.

### O que foi encontrado

Os environments do frontend de `estrutura-pedagogica` (`environment.ts`, `.prod.ts`, `.homolog.ts`, `.hot.ts`, `.hot-homolog.ts`) **já tinham** `apiFrequenciaUrl` e `frequenciaKey` configurados, nos 5 arquivos, apontando para o backend do `frequencia` (ex.: prod `https://atlasedu.com.br/frequencia/api`) — provisionado antecipadamente, sem uso até agora (`grep` não encontrava nenhum consumidor). Isso já resolveu a URL/chave por ambiente sem precisar tocar nos environments.

O padrão já existente no repo para chamar uma API de outro módulo é uma subclasse de `ApiClient` sobrescrevendo `baseUrl` (ex.: `ProcessamentoBoletimApiClient` → `Constants.API_PROCESSADOR_BOLETIM`, hoje também sem uso real). `PdfApiService` não seguiu esse padrão de herança porque **precisa dos dois destinos ao mesmo tempo**: `gerar()` (PDF único) vai para `frequencia`, `gerarZip()` (múltiplos documentos em `.zip`) continua no próprio `estrutura-pedagogica` — impossível com uma única `baseUrl` herdada (ver decisão abaixo).

### Mudanças aplicadas

| Arquivo | Mudança |
|---|---|
| `frontend/src/constants.ts` | Adicionado `API_FREQUENCIA_URL` (= `environment.apiFrequenciaUrl`) e `FREQUENCIA_KEY` (= `environment.frequenciaKey`) |
| `frontend/src/shared/document-builder/services/pdf-api.service.ts` | `gerar()` monta a URL explicitamente com `Constants.API_FREQUENCIA_URL` (em vez de `this.baseUrl`, que aponta para `estrutura-pedagogica`) e envia `x-api-key: Constants.FREQUENCIA_KEY` em vez da chave pública de `estrutura-pedagogica`. `gerarZip()` **não foi alterado** (ver decisão abaixo) |

Nenhuma mudança de rota/URL foi necessária em `PdfController` (nem em `estrutura-pedagogica`, nem em `frequencia`) — os dois expõem `POST /api/pdf` na mesma convenção.

### Decisão: `gerarZip()` (múltiplos documentos em `.zip`) não foi portado

`saveZip()` no `document-viewer.component.ts` (que usa `gerarZip()`) **não é usado atualmente** — confirmado com o time. Por isso `gerarZip()` foi deixado apontando para o próprio backend de `estrutura-pedagogica` (`${this.baseUrl}/pdf/zip`, inalterado), já que `frequencia` não tem endpoint de zip (decisão da §5) e portá-lo agora seria trabalho sem necessidade real. Se o zip vier a ser usado no futuro, decidir então entre portar o endpoint para `frequencia` ou manter esse fluxo específico em `estrutura-pedagogica`.

### Risco de autorização — resolvido: `PdfController` agora é `[AllowAnonymous]`

O `PdfController` de `frequencia` inicialmente usava `[RequiredAuthorization]` (qualquer usuário autenticado, sem `Funcionalidade` específica). Só que o filtro (`RequiredAuthorizationFilter`) tem uma trava **de nível de módulo**, não só de funcionalidade: quando não há sessão local em cache para o usuário (`AuthCurrentSession` falha), ele chama `AuthNewSession` no ElevaId — que **rejeita usuários sem acesso ao módulo de Frequência** (`"O usuário informado não possui acesso ao módulo de Frequência."`, 401). Um usuário de `estrutura-pedagogica` que nunca acessou o módulo de Frequência receberia 401 ao gerar PDF, mesmo autenticado normalmente em `estrutura-pedagogica` — o `document-builder` é transversal, sem garantia de que todo usuário tem perfil de Frequência.

**Decisão (confirmada): este fluxo de PDF fica sem controle de permissão.** `PdfController` foi trocado de `[RequiredAuthorization]` para `[AllowAnonymous]` — mesmo padrão já usado em outros controllers do `frequencia` (`ChamadaController`, `DiarioDeClasseController`, `PercentualFrequenciaController`, `Core/HealthController`). O filtro (`RequiredAuthorizationFilter.AllowAnonymousAccess`) pula toda a checagem de autenticação/autorização quando `[AllowAnonymous]` está presente — elimina o 401 de módulo por completo, para qualquer chamador (não só `estrutura-pedagogica`).

**Nota de segurança, não bloqueante**: o endpoint passa a aceitar qualquer requisição, sem autenticação — quem tiver a URL pode enviar HTML arbitrário para ser renderizado em PDF (consumo de CPU/memória do Chromium headless por requisição). Como é um serviço interno (não exposto publicamente fora da rede/CDN da Salta) e o CORS já era aberto (`AllowAnyOrigin`), o `x-api-key` enviado pelo frontend de `estrutura-pedagogica` (`Constants.FREQUENCIA_KEY`) continua sendo enviado mas **não é validado por nenhum código da aplicação** hoje (a definição em `Startup.cs` é só metadado de Swagger/AWS API Gateway) — se quiser alguma barreira mínima sem reintroduzir o problema de módulo, validar esse header no controller seria uma opção futura, não implementada agora.

### CORS

`frequencia` já tem CORS liberado para qualquer origem/método/header (`Startup.cs`, política `_defaultCorsPolicy`) — chamada cross-origin do frontend de `estrutura-pedagogica` não é bloqueada por isso.
