# Incidente: `chrome-headless-shell` ausente após deploy — estrutura-pedagogica (produção)

**Data:** 2026-07-28
**Ambiente:** production
**Log de origem:** `/aws/estrutura-pedagogica/syslog`
**Instâncias afetadas:** `i-0489c4e59501f5d35`, `i-0e0af49366919868e`, `i-089689d2a9a204916`, `i-0b8d26f977718a175` (fleet inteira, não isolado)

## Problema

A partir de **13:58 UTC (10:58 local)**, todas as instâncias de backend passaram a falhar na geração de PDF com:

```
Microsoft.Playwright.PlaywrightException: Executable doesn't exist at
/var/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell
```

376 ocorrências entre 13:58–14:13 UTC (consultado via CloudWatch Logs Insights, profile `eleva-admin-eficientes-prd`, read-only). Diferente do incidente de 17/07 (`2026-07-15_pdf-timeout-e-sql-timeout...`/análise do endpoint PDF), aqui o Playwright nem inicializa — o binário simplesmente não existe no disco.

## Análise

**Correlação com deploy:** o primeiro erro (13:58:12 UTC) ocorre ~14 minutos após o merge de produção:

```
63ab4c64d 2026-07-28 10:44:20 -0300  Merge branch 'release/2026.07.28'
```

`release/2026.07.28` é **o primeiro release de produção desde `release/2026.07.22`** — ou seja, é a primeira vez que vai para produção o commit `1cf5c8346` (23/07/2026), que atualizou:

```diff
- <PackageReference Include="Microsoft.Playwright" Version="1.52.0" />
+ <PackageReference Include="Microsoft.Playwright" Version="1.61.0" />
```

**Causa raiz:** `PdfBrowserService.InitBrowserAsync` (linha 30) chama `playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true })` sem especificar canal. Desde o Playwright 1.45, o modo headless "clássico" (`Headless = true` sem canal) usa um binário separado do Chromium completo — o `chrome-headless-shell` — distribuído como browser independente.

O script `backend/BuildCfg/DeployScripts/after-install.sh` só executava:

```sh
PLAYWRIGHT_BROWSERS_PATH=/var/ms-playwright /var/www/html/playwright.sh install chromium
```

Na troca de versão (1.52.0 → 1.61.0), a revisão exigida do Chromium/headless-shell mudou (`chromium_headless_shell-1228`). Nas 4 instâncias que passaram pelo deploy de hoje, esse binário não ficou presente após a instalação — falha silenciosa no `after-install.sh` (sem `set -e`, sem verificação pós-instalação), só visível quando a aplicação tentou lançar o browser em runtime, em produção.

Mesma classe de problema do incidente de 17/07 (`Causa A`: dependências do Chromium ausentes após deploy, corrigido no commit `830c985c6`) — desta vez o gap está na garantia de que o binário headless-shell (e não só o Chromium completo) é instalado e existe de fato após o `after-install.sh` rodar.

## Correção aplicada

`backend/BuildCfg/DeployScripts/after-install.sh`:

1. Instalação explícita de `chromium` **e** `chromium-headless-shell` (em vez de depender do comportamento default de `install chromium`, que já mudou de versão para versão do Playwright).
2. Fallback pip3 atualizado de `playwright==1.52.0` para `1.61.0`, alinhado ao csproj.
3. Verificação pós-instalação: o script agora falha (`exit 1`) se `chrome-headless-shell` não existir em `/var/ms-playwright` após a instalação — transforma uma falha silenciosa em runtime de produção em falha visível no próprio deploy.

## O que mais poderia ser investigado

- **Espaço em disco nas instâncias** (t3a.micro) — instalar `chromium` + `chromium-headless-shell` juntos quase dobra o volume baixado; não descartado que a instalação do headless-shell tenha falhado por falta de espaço após o download do Chromium completo. Não verificado nesta investigação (seria necessário acesso via SSM à instância).
- **Processo de release**: confirmar por que não houve nenhum release de produção entre 22/07 e 28/07 — se isso for incomum, pode valer revisar a cadência de release para não acumular várias mudanças de infraestrutura (como bump de versão de pacote) em um único deploy, dificultando isolar a causa quando algo quebra.
- **CodeDeploy/lifecycle hooks**: confirmar se falhas em `after-install.sh` (agora com `exit 1` na verificação) de fato bloqueiam o deploy e disparam rollback automático, ou se é necessário configurar isso explicitamente no `appspec.yml`.
