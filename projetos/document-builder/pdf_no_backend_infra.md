# Infra — Geração de PDF no Backend (Playwright)

> Gerado em: 2026-06-22  
> Verificado ao vivo via AWS CLI (Secrets Manager us-east-1)

---

## Cenário atual

| Item | Valor |
|---|---|
| **Runtime** | EC2 Linux — `.NET 8` como serviço **systemd** (`backend`) |
| **Deploy** | AWS CodeDeploy — hooks bash em `backend/BuildCfg/DeployScripts/` |
| **Build** | `dotnet publish -r linux-x64 --self-contained` |
| **Config runtime** | AWS Secrets Manager — lido no startup da aplicação |
| **Proxy** | nginx |

---

## O que precisa ser feito — 2 passos

---

### Passo 1 — `after-install.sh` (instalar Chromium no servidor)

**Arquivo:** `backend/BuildCfg/DeployScripts/after-install.sh`

O arquivo hoje está assim:
```bash
#!/bin/bash

export PATH="/snap/bin:$PATH"
```

Adicionar após o `export PATH`:

```bash
#!/bin/bash

export PATH="/snap/bin:$PATH"

# Dependências de sistema do Chromium headless
apt-get install -y --no-install-recommends \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libdbus-1-3 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2

# Instala Chromium via Playwright (idempotente — pula se a versão já estiver em /var/ms-playwright)
export PLAYWRIGHT_BROWSERS_PATH=/var/ms-playwright
chmod +x /var/www/html/playwright.sh
/var/www/html/playwright.sh install chromium
```

> **Por que `/var/ms-playwright`:** acessível pelo serviço systemd independente do usuário; persiste entre deploys (Chromium ~150MB não é baixado toda vez — o Playwright verifica a versão antes de baixar).

> **`playwright.sh`:** gerado automaticamente pelo NuGet `Microsoft.Playwright` no `dotnet publish`. Estará em `/var/www/html/playwright.sh` após o CodeDeploy copiar os artefatos para `/var/www/html`.

---

### Passo 2 — Secrets Manager (expor o path para o .NET)

Adicionar a chave `Playwright` nos dois secrets abaixo. O `PdfBrowserService` lê essa config no startup e seta `PLAYWRIGHT_BROWSERS_PATH` antes de inicializar o Chromium.

#### Homolog

**Secret:** `homologation/estrutura-pedagogica/parameters` (us-east-1)

Adicionar no JSON do secret (no mesmo nível de `Database`, `Produto`, etc.):

```json
"Playwright": {
    "BrowsersPath": "/var/ms-playwright"
}
```

**Via AWS CLI:**
```bash
# 1. Pegar o valor atual
aws secretsmanager get-secret-value \
    --secret-id "homologation/estrutura-pedagogica/parameters" \
    --region us-east-1 \
    --profile eleva-admin-eficientes-hml \
    --query SecretString --output text > /tmp/secret-hml.json

# 2. Editar o arquivo adicionando a chave "Playwright"
# 3. Atualizar o secret
aws secretsmanager put-secret-value \
    --secret-id "homologation/estrutura-pedagogica/parameters" \
    --region us-east-1 \
    --profile eleva-admin-eficientes-hml \
    --secret-string file:///tmp/secret-hml.json
```

#### Produção

**Secret:** `production/estrutura-pedagogica/parameters` (us-east-1)

Mesma adição:
```json
"Playwright": {
    "BrowsersPath": "/var/ms-playwright"
}
```

**Via AWS CLI:**
```bash
aws secretsmanager get-secret-value \
    --secret-id "production/estrutura-pedagogica/parameters" \
    --region us-east-1 \
    --profile eleva-admin-eficientes-prd \
    --query SecretString --output text > /tmp/secret-prd.json

# Editar e atualizar
aws secretsmanager put-secret-value \
    --secret-id "production/estrutura-pedagogica/parameters" \
    --region us-east-1 \
    --profile eleva-admin-eficientes-prd \
    --secret-string file:///tmp/secret-prd.json
```

---

## O que NÃO precisa ser alterado

- `before-install.sh` — só para o serviço e limpa `/var/www/html`, sem mudança necessária
- `application-start.sh` — reinicia o systemd e carrega `environment.txt`, sem mudança
- `appsettings-homologation.json` / `appsettings-production.json` — config vem do Secrets Manager
- `appspec.yml` — hooks já cobrem o fluxo, timeout de 300s suficiente para baixar o Chromium

---

## Observações

- **Chromium ~150MB** — o download ocorre apenas na primeira vez ou quando a versão do Playwright muda. Com a EC2 em us-east-1, o download via S3 da AWS é rápido.
- **Timeout CodeDeploy** — `after-install.sh` tem 300s. O `apt-get` + download do Chromium ficam bem dentro desse limite.
- **Primeira requisição após deploy** — o `PdfBrowserService` sobe o Chromium na primeira chamada (lazy). Pode levar ~2–3s extras nessa requisição.
- **Versão do Playwright** — o `playwright.sh install` instala exatamente a versão de Chromium compatível com o NuGet `Microsoft.Playwright 1.52.0`. Se o NuGet for atualizado, o Chromium será rebaixado automaticamente no próximo deploy.
