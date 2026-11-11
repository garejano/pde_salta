# Plano Técnico — Geração de PDF no Backend (document-builder)

> Gerado em: 2026-06-22  
> Spec de origem: `document-builder/pdf_no_backend.md`  
> Repositório: `estrutura-pedagogica`

---

## Contexto

O módulo `document-builder` do frontend de `estrutura-pedagogica` gera PDFs 100% no cliente (html2canvas + jsPDF). Em máquinas com pouco recurso, a tela trava com mais de 2 páginas. A solução é mover a geração para o backend usando Microsoft Playwright (Chromium headless): o frontend serializa o HTML do documento com estilos embutidos e faz POST para um novo endpoint `/api/pdf`, que retorna o PDF como `application/pdf`.

---

## Fases

### Fase 1 — Infraestrutura de Browser _(PdfBrowserService Singleton)_

**Arquivos:**

- `backend/EstruturaPedagogica.Domain.Services/EstruturaPedagogica.Domain.Services.csproj` — adicionar:
  ```xml
  <PackageReference Include="Microsoft.Playwright" Version="1.52.0" />
  ```

- `backend/EstruturaPedagogica.Domain.Services/Pdf/Interfaces/IPdfBrowserService.cs`:
  ```csharp
  public interface IPdfBrowserService
  {
      Task<IPage> CreatePageAsync();
  }
  ```

- `backend/EstruturaPedagogica.Domain.Services/Pdf/PdfBrowserService.cs`:
  - **NÃO herda `IBaseService`** — não será auto-descoberto
  - `Lazy<Task<IBrowser>>` para inicialização lazy do Chromium na primeira requisição
  - `CreatePageAsync()` → `browser.NewPageAsync()` — cada requisição recebe uma `IPage` isolada
  - `IBrowser` nunca é fechado (reaproveitado entre requisições)

  ```csharp
  public class PdfBrowserService(ILogger<PdfBrowserService> logger) : IPdfBrowserService
  {
      private readonly Lazy<Task<IBrowser>> _browser = new(InitBrowserAsync);

      private static async Task<IBrowser> InitBrowserAsync()
      {
          var playwright = await Playwright.CreateAsync();
          return await playwright.Chromium.LaunchAsync(new() { Headless = true });
      }

      public async Task<IPage> CreatePageAsync()
      {
          var browser = await _browser.Value;
          return await browser.NewPageAsync();
      }
  }
  ```

- `backend/EstruturaPedagogica.Domain.Services/Core/Initialization/DependencyInjectionServices.cs` — adicionar registro manual após `services.AddServices()`:
  ```csharp
  services.AddSingleton<IPdfBrowserService, PdfBrowserService>();
  ```

---

### Fase 2 — DTO + GerarPdfService

**Arquivos:**

- `backend/EstruturaPedagogica.Domain/DTO/Pdf/PdfRequest.cs`:
  ```csharp
  public class PdfRequest
  {
      public string Html { get; set; } = string.Empty;
      public string Orientation { get; set; } = "portrait"; // "portrait" | "landscape"
  }
  ```

- `backend/EstruturaPedagogica.Domain.Services/Pdf/Interfaces/IGerarPdfService.cs`:
  ```csharp
  public interface IGerarPdfService : IBaseService
  {
      Task<ServiceResult<byte[]>> GerarAsync(PdfRequest request);
  }
  ```

- `backend/EstruturaPedagogica.Domain.Services/Pdf/GerarPdfService.cs`:
  - Primary constructor injetando `IPdfBrowserService` e `ILogger<GerarPdfService>`
  - Herda `IBaseService` → auto-registrado como `Transient`
  - Validação: `Html` não pode ser vazio
  - `Stopwatch` para logar tempo de geração
  - `IPage` sempre fechada no `finally`

  ```csharp
  public class GerarPdfService(IPdfBrowserService browserService, ILogger<GerarPdfService> logger) : IGerarPdfService
  {
      public async Task<ServiceResult<byte[]>> GerarAsync(PdfRequest request)
      {
          if (string.IsNullOrWhiteSpace(request.Html))
              return ServiceResult<byte[]>.Failure("HTML não pode ser vazio.");

          var sw = Stopwatch.StartNew();
          var page = await browserService.CreatePageAsync();
          try
          {
              await page.SetDefaultTimeoutAsync(30_000);
              await page.SetContentAsync(request.Html, new() { WaitUntil = WaitUntilState.NetworkIdle });
              var pdf = await page.PdfAsync(new()
              {
                  Format = PaperFormat.A4,
                  PrintBackground = true,
                  Landscape = string.Equals(request.Orientation, "landscape", StringComparison.OrdinalIgnoreCase)
              });
              sw.Stop();
              logger.LogInformation("PDF gerado em {ElapsedMs}ms", sw.ElapsedMilliseconds);
              return ServiceResult<byte[]>.Success(pdf);
          }
          finally
          {
              await page.CloseAsync();
          }
      }
  }
  ```

---

### Fase 3 — PdfController

**Arquivo a criar:**
`backend/EstruturaPedagogica.Api/Controllers/PdfController.cs`

```csharp
[ApiController]
[Authorize]  // qualquer usuário autenticado — document-builder é transversal a várias features
[Route("api/[controller]")]
[ExcludeFromCodeCoverage]
public class PdfController : CustomController
{
    [HttpPost]
    public async Task<IActionResult> GerarPdf(
        [FromServices] IGerarPdfService service,
        [FromBody] PdfRequest request)
    {
        var result = await service.GerarAsync(request);
        if (!result.IsSuccess)
            return Result(result);
        return File(result.Data!, "application/pdf", "documento.pdf");
    }
}
```

---

### Fase 4 — Frontend: PdfApiService + Serialização HTML

**Arquivo a criar:**
`frontend/src/shared/document-builder/services/pdf-api.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class PdfApiService {
  constructor(private http: HttpClient) {}

  gerar(html: string, orientation: 'portrait' | 'landscape'): Observable<Blob> {
    return this.http.post('/api/pdf', { html, orientation }, { responseType: 'blob' });
  }
}
```

**Função utilitária de serialização HTML** (pode ser uma função pura no mesmo arquivo ou em `utils/`):

```typescript
export function buildSelfContainedHtml(
  elements: HTMLElement[],
  orientation: 'portrait' | 'landscape'
): string {
  // Angular injeta estilos scoped como <style> no document.head
  // Os outerHTML dos elementos preservam os atributos [_ngcontent-xxx], então o CSS aplica corretamente
  const styles = Array.from(document.querySelectorAll('style'))
    .map(s => s.outerHTML)
    .join('\n');

  const pagesHtml = elements.map(el => el.outerHTML).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  ${styles}
</head>
<body style="margin:0;padding:0">
  ${pagesHtml}
</body>
</html>`;
}
```

---

### Fase 5 — Frontend: DocumentConfig + DocumentViewerComponent

**Arquivo a modificar:**
`frontend/src/shared/document-builder/models/document-config.ts`

Adicionar ao `DocumentConfig`:
```typescript
/** 'backend' força Playwright; 'frontend' mantém html2canvas. Default: 'frontend'. */
pdfStrategy?: 'frontend' | 'backend'

/** Se informado e o documento tiver mais páginas que este valor, usa backend automaticamente. */
maxPagesForFrontendPdf?: number
```

**Arquivo a modificar:**
`frontend/src/shared/document-builder/components/document-viewer/document-viewer.component.ts`

1. Injetar `PdfApiService`
2. Modificar `save()` para rotear com base na estratégia:

```typescript
async save(fileName?: string): Promise<void> {
  const { elements, cfg, overlay } = this.prepareCapture();
  await yieldToBrowser();
  const onProgress: PrintProgressFn = p => DocumentViewerComponent.updateLoadingText(overlay, p);

  const useBackend =
    cfg.pdfStrategy === 'backend' ||
    (cfg.maxPagesForFrontendPdf != null && elements.length > cfg.maxPagesForFrontendPdf);

  try {
    if (useBackend) {
      const html = buildSelfContainedHtml(elements, cfg.orientation);
      const blob = await firstValueFrom(this.pdfApiService.gerar(html, cfg.orientation));
      // usar helper de download existente no projeto, ou criar:
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName ?? cfg.title ?? 'documento'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      await this.printService.save(elements, fileName ?? cfg.title ?? 'documento', cfg.pdfQuality, cfg.printStrategy, onProgress);
    }
  } finally {
    this.releaseCapture(elements, overlay);
  }
}
```

---

### Fase 6 — CI/CD: Instalação do Chromium no Servidor

Após publicar o backend, o Playwright precisa do Chromium instalado na máquina:

```bash
# No Dockerfile ou script de deploy
dotnet tool install -g Microsoft.Playwright.CLI
playwright install chromium
```

Se for IIS (Windows): executar uma vez no servidor como administração, ou incluir no script de publicação.

> Este é o passo de maior risco operacional — confirmar com DevOps onde e como executar.

---

## Restrições e Riscos

| Risco | Mitigação |
|---|---|
| Chromium não instalado no servidor | Incluir `playwright install chromium` no pipeline de deploy |
| `PdfBrowserService` Singleton não registrado → `InvalidOperationException` em runtime | Registro manual explícito em `DependencyInjectionServices.cs` (não heredar `IBaseService`) |
| `IPage` não fechada → leak de memória | `await page.CloseAsync()` sempre no `finally` |
| Fontes ausentes no servidor (Google Fonts via CDN) | Chromium headless não resolve CDN externos — verificar se fontes do document-builder estão embutidas ou disponíveis no servidor |
| HTML grande com imagens base64 | Verificar `MaxRequestBodySize` do Kestrel (padrão 30MB) |
| Estilos externos (`/assets/`) não carregam no headless | A abordagem de `document.querySelectorAll('style')` cobre apenas `<style>` inline — suficiente para Angular |
| `IBrowser` crash → singleton inválido | Melhoria futura: health-check + reinit lazy após falha |

---

## Verificação

1. **Backend:**
   - Executar `playwright install chromium` localmente
   - POST `/api/pdf` via Swagger com `{ "html": "<h1>Teste</h1>", "orientation": "portrait" }`
   - Resposta: `application/pdf` com conteúdo correto

2. **Frontend — estratégia manual:**
   - Configurar `pdfStrategy: 'backend'` no `DocumentConfig` de um documento
   - Clicar "Salvar PDF" → verificar aba Network: POST `/api/pdf` com HTML no body
   - Download do PDF com estilos corretos

3. **Frontend — roteamento automático:**
   - Configurar `maxPagesForFrontendPdf: 2`, abrir documento com 3+ páginas
   - Deve usar backend automaticamente sem configuração adicional
