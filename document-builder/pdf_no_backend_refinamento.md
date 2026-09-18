# Refinamento: Geração de PDF no Backend (document-builder)

## Contexto

O `document-builder` é o módulo do frontend de `estrutura-pedagogica` responsável por construir, exibir e exportar documentos em PDF. Atualmente, toda a geração ocorre no browser — o que trava a tela em notebooks ao renderizar documentos com mais de 2 páginas.

A proposta é mover a geração para o backend C# usando **Microsoft Playwright** (Chromium Headless), mantendo o frontend como coordenador do fluxo.

---

## Problema

- Geração de PDF no browser é custosa e bloqueia a thread principal.
- Documentos com mais de 2 páginas causam travamento em máquinas com hardware limitado.
- Não há fallback para cenários pesados.

---

## Objetivo

Implementar no backend de `estrutura-pedagogica` um endpoint de geração de PDF via Playwright, e adaptar o frontend para rotear a geração corretamente conforme a configuração de cada documento.

---

## Escopo

### Backend — `estrutura-pedagogica` (C#)

- **`PdfService`**: serviço responsável por abrir uma `Page` do Playwright e gerar o PDF.
  - Manter **uma única instância de `IBrowser`** ativa (singleton/singleton-scoped), criando apenas novas `IPage` por requisição — evita overhead de abrir/fechar Chromium a cada geração.
  - Usar `page.SetContentAsync(html)` para carregar o conteúdo recebido.
  - Usar `page.PdfAsync()` para gerar o PDF.
  - Suportar orientação: **retrato ou paisagem** (passado pelo frontend).
  - Configurações fixas: `Format = A4`, `PrintBackground = true`.
  - Registrar log com tempo total de geração (para análise de performance).

- **Endpoint**: `POST /api/pdf`
  - Input (DTO):
    ```json
    {
      "html": "<string>",
      "landscape": false
    }
    ```
  - Output: arquivo PDF (`Content-Type: application/pdf`).

### Frontend — `estrutura-pedagogica` (Angular)

- Cada documento possui uma **configuração** (`document-builder config`). Adicionar à configuração:
  - `gerarNoBackend: boolean` — força geração no backend independente do número de páginas.
  - `limiteDePagensParaBackend: number | null` — se o documento tiver mais de X páginas, roteia automaticamente para o backend; `null` desativa o limite.

- O fluxo de geração deve verificar essas flags antes de decidir onde gerar:
  1. `gerarNoBackend === true` → backend.
  2. `limiteDePagensParaBackend !== null && páginas > limite` → backend.
  3. Caso contrário → geração local (comportamento atual).

---

## Critérios de Aceite

- [ ] `POST /api/pdf` recebe HTML + orientação e retorna PDF válido.
- [ ] PDF gerado em A4 com backgrounds habilitados.
- [ ] Orientação retrato/paisagem refletida corretamente no PDF.
- [ ] Instância do browser reutilizada entre requisições (sem overhead de cold start por chamada).
- [ ] Log de tempo de geração registrado no backend.
- [ ] Configuração `gerarNoBackend` no document-builder funciona: ao ativar, geração é delegada ao backend.
- [ ] Configuração `limiteDePagensParaBackend` funciona: ao ultrapassar o limite, geração é delegada automaticamente.
- [ ] Geração local continua funcionando para documentos sem as flags ativas.

---

## Fora do Escopo

- Fila/processamento assíncrono (geração é síncrona por ora).
- Armazenamento do PDF gerado (retorno direto, sem persistência).
- Autenticação/autorização específica para o endpoint (segue o padrão já existente na API).

---

## Dependências Técnicas

- Pacote NuGet: `Microsoft.Playwright`
- Chromium instalado no ambiente de deploy (via `playwright install chromium`).
- Verificar se o servidor de homologação/produção permite processo headless.

---

## Notas de Implementação

- O HTML enviado pelo frontend já contém estilos inline (comportamento atual do document-builder) — o backend não precisa resolver assets externos.
- Avaliar se `WaitUntilState.NetworkIdle` ou `Load` é o estado mais adequado no `SetContentAsync` para garantir que fontes/imagens embutidas estejam prontas antes do PDF.
