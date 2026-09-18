# Análise — Erros no endpoint `POST /api/pdf` (16–17/07/2026)

## Metodologia

Dados coletados via CloudWatch Logs Insights (conta AWS `980106147241`, perfil `eleva-admin-eficientes-prd`), nos log groups:

- `/aws/estrutura-pedagogica/syslog` — logs de aplicação (`ILogger` do backend .NET)
- `/aws/estrutura-pedagogica/requests` — access log (nginx) de todas as requisições HTTP

Período analisado: últimos 30 dias (logs de aplicação) e últimos 14 dias (access log). Na prática, todos os erros encontrados estão concentrados em **16 e 17/07/2026**. Todos os horários abaixo em UTC, com o horário local (UTC-3) indicado entre parênteses.

## Resumo executivo

Foram identificadas **duas causas raiz distintas e não relacionadas** por trás dos erros do endpoint `/api/pdf` — e **apenas uma delas já está resolvida por commit já mesclado**:

| Causa raiz | Volume | Status |
|---|---|---|
| **A. Dependências de sistema do Chromium ausentes no host** | 67 de 78 erros (~86%) | ✅ Corrigida (commit `830c985c6`) |
| **B. Renderização lenta (~29s) causando desconexão do cliente/gateway** | 11 de 78 erros (~14%) | ⚠️ Sem correção confirmada — recorreu na última hora de dados coletados |

A troca para thumbnail de foto (`getPhotoUrl(..., true)`, commit `dc63f8c23`) **não tem relação com a causa A**, que é 86% do volume de erros e é agnóstica a página/feature. Ela é uma tentativa de mitigação da causa B — mas os dados **não confirmam que resolveu**, pelos motivos detalhados abaixo.

---

## Causa A — Dependências de sistema do Chromium ausentes (dominante, resolvida)

### Evidência

Nos logs de aplicação, 67 ocorrências do mesmo erro, restritas a 3 instâncias EC2 (`ip-172-17-81-187`, `ip-172-17-78-112`, `ip-172-17-84-252`), concentradas quase inteiramente entre **12:00–12:59 UTC (09:00–09:59 local) do dia 17/07**:

```
Microsoft.Playwright.PlaywrightException:
╔══════════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers.     ║
╚══════════════════════════════════════════════════════════╝
   at ...PdfBrowserService.InitBrowserAsync(...)
   at ...PdfBrowserService.CreatePageAsync()
   at ...GerarPdfService.RenderPageAsync(...)
```

No access log, essa falha aparece como `sta=400` com `tim=0.160` (resposta quase instantânea — o Chromium falha ao *iniciar*, nem chega a renderizar nada). Ocorreu em **ambas** as páginas que geram PDF (`lista-presenca` e `diario-de-classe/listar`) — confirmando que é um problema **de instância/infraestrutura, não de dado ou de feature específica**.

### Causa raiz real

`backend/BuildCfg/DeployScripts/after-install.sh` instalava as dependências de sistema do Chromium via `apt-get install`, mas:
1. Não rodava `apt-get update` antes — o índice de pacotes podia estar desatualizado/incompleto.
2. Faltava o pacote `libatspi2.0-0` na lista.

Instâncias provisionadas com essa versão do script tinham o Chromium inutilizável — **toda e qualquer geração de PDF que caísse nessas instâncias falhava 100% das vezes**, independente de turma, variante do carômetro ou conteúdo do HTML.

**Isso explica o sintoma original relatado ("só em algumas turmas"): não era a turma — era em qual instância do balanceamento a requisição caía.** Repetir a mesma turma podia "funcionar" simplesmente por cair em outra instância saudável.

### Correção

Commit `830c985c6` ("Hotfix - lib geracao pdf backend"), **09:44:37 local (12:44:37 UTC) de 17/07**:

```diff
+apt-get update
 apt-get install -y --no-install-recommends \
-    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
+    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libatspi2.0-0 libcups2 libdrm2 \
     ...
```

Os erros praticamente cessam já na hora seguinte (13:00 UTC): 35× 200 contra apenas 1× 400 residual, e zero ocorrências nas horas seguintes (14h–16h UTC).

---

## Causa B — Renderização lenta (~29s), desconexão do cliente (não resolvida)

### Evidência

11 requisições com `sta=499` (nginx: cliente/gateway fechou a conexão antes do servidor responder) e `tim` entre 28.90s e 29.00s — bem próximo do teto que o navegador/gateway tolera, mas **antes** do nosso próprio timeout interno do Playwright (`SetDefaultTimeout(30_000)`, 30s) disparar. Há também respostas `200` legítimas na mesma faixa de tempo (24–28s), confirmando que a geração *consegue* terminar perto desse limite — não é sempre uma falha, é uma corrida contra o relógio.

Duas rajadas distintas:

| Quando (UTC / local) | Qtde | Página |
|---|---|---|
| 2026-07-16 19:51–19:56 (16:51–16:56 local) | 7 | `lista-presenca` (4×) e `diario-de-classe/listar` (3×) |
| 2026-07-17 17:02–17:14 (14:02–14:14 local) | 4 | `lista-presenca` (4×) |

### Por que a explicação "fotos grandes no carômetro" é insuficiente

O padrão apareceu **também em `diario-de-classe/listar`**, uma página que não usa o grid de fotos do carômetro. Isso indica que a lentidão não é (só) sobre o tamanho da foto sendo baixada pelo Playwright — é mais provável que seja **contenção de recurso compartilhado**: `PdfBrowserService` mantém **um único `IBrowser` (Chromium) por instância, como singleton**; toda requisição concorrente de geração de PDF (de qualquer feature) abre uma nova `Page` nesse mesmo processo de navegador. Sob carga concorrente na mesma instância, todas as renderizações competem pelo mesmo processo Chromium e podem desacelerar juntas, aproximando-se do teto de 30s independente do conteúdo específico do HTML.

A rajada de 17/07 14:02–14:14 local ocorre bem próxima ao commit/merge do ajuste de thumbnail (`dc63f8c23` às 14:06:45, merge `37edf4026` às 14:07:16) — **mas o deploy do build de frontend leva alguns minutos após o merge**, então não dá para concluir com os dados disponíveis se essas 4 ocorrências já rodavam com o build novo no ar ou ainda com o antigo. **Não há, portanto, confirmação de que o ajuste de thumbnail eliminou esse padrão** — só há ausência de novos eventos nos poucos minutos finais da janela coletada, o que não é evidência suficiente.

### Recomendação para investigar melhor no futuro

1. Monitorar novas ocorrências de `sta=499` em `/aws/estrutura-pedagogica/requests` para `/api/pdf` nos próximos dias, especialmente em `diario-de-classe/listar` (onde fotos não deveriam ser fator).
2. Se o padrão persistir mesmo sem fotos grandes envolvidas, investigar contenção do `IBrowser` singleton em `PdfBrowserService.cs` sob concorrência (ex.: pool de browsers, ou browser por contexto isolado, ao invés de um único browser compartilhado por instância).
3 Considerar logar no `GerarPdfService` o tempo decorrido até cada etapa (`SetContentAsync` vs `PdfAsync`) para diferenciar "lento pra carregar recursos" de "lento pra imprimir", já que hoje só o tempo total é visível no access log.

---

## Linha do tempo consolidada (17/07/2026, horário local UTC-3)

| Hora | Evento |
|---|---|
| 09:44 | Commit `830c985c6` — corrige dependências do Chromium no `after-install.sh` |
| 09:00–09:59 | Rajada de 66× erro 400 (Causa A) nas instâncias com deploy desatualizado |
| ~10:00 em diante | Erros da Causa A cessam (novo deploy já propagado) |
| 11:36 | Commit `d1f28c54f` — Carômetro gerando pelo backend |
| 12:43 | Commit `199944b3` — logging detalhado de erros do Playwright em `GerarPdfService`/`PdfBrowserService` |
| 14:06–14:07 | Commit `dc63f8c23` — thumbnail de foto + (depois revertida) opção de embutir imagem |
| 14:02–14:14 | 4× erro 499 (Causa B) — janela ambígua em relação ao deploy do commit acima |

## Conclusão

A percepção de que "o ajuste do thumb resolveu, parou de dar erro" provavelmente reflete a **Causa A** parando de ocorrer — mas essa foi corrigida por um commit de infraestrutura (`830c985c6`) **feito e propagado horas antes** do ajuste de thumbnail, e não tem relação com fotos. A Causa A também é responsável pela grande maioria (86%) dos erros observados.

A Causa B (renderização lenta) é o problema real que o ajuste de thumbnail mirava, é bem menos frequente (14% dos erros) e **não há evidência conclusiva nos dados de que foi eliminada** — inclusive há indício (ocorrência em página sem fotos) de que a causa raiz possa ser contenção do browser compartilhado, não o tamanho da imagem em si.
