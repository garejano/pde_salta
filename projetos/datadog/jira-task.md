# [estrutura-pedagogica] Enriquecer instrumentação do Datadog RUM com dados de usuário

## Contexto

O Datadog RUM já está habilitado no frontend de `estrutura-pedagogica` (`main.ts`), mas hoje só coleta dados anônimos de navegação/erro. Não há `setUser`/`setContext` configurados, então não é possível segmentar eventos por marca/rede, escola, perfil ou tipo de usuário (aluno x responsável). O ambiente (`env`) também está fixo como `'prod'`, independente de onde a aplicação está rodando.

## Objetivo

Enriquecer os eventos do Datadog RUM com dados do usuário logado, permitindo segmentar por marca/rede, escola e tipo de perfil, e corrigir o `env` para refletir o ambiente real.

## Escopo

1. Ajustar `env` do `datadogRum.init` para usar o ambiente real da aplicação (`environment.stage` ou equivalente) em vez do valor fixo `'prod'`.
2. Chamar `datadogRum.setUser(...)` após o login, com `Id`/`Hash`, `Nome` e `Email` do usuário autenticado.
3. Chamar `setContext`/`setGlobalContext` com marca/rede, escola e perfil ativo — atualizado também quando o usuário troca de perfil.
4. Diferenciar aluno x responsável no contexto enviado.
5. Revisar `sessionReplaySampleRate` por ambiente (reduzir/desligar fora de produção) por questão de custo.

## Critérios de aceite

- [x] Eventos do Datadog em homolog/dev aparecem com `env` correspondente ao ambiente real (não sempre `prod`).
- [x] Sessões no Datadog RUM mostram usuário identificado (nome/email/id) após login.
- [x] Eventos podem ser filtrados por marca/rede, escola, perfil e tipo de usuário (aluno/responsável/outro) no Datadog.
- [x] `sessionReplaySampleRate` revisado por ambiente (0% fora de produção).

> Implementado em `frontend/src/main.ts` e `frontend/src/portal-modulo/shared/services/usuario.service.ts` (`enviarDadosParaDatadog`). Classificação aluno/responsável usa igualdade exata de `NomePerfil` (`'Aluno'` / `'Responsável'`), confirmada via consulta em `PerfilAcesso` — ver `projetos/datadog/readme.md` seção 3.
>
> Pendente: verificação manual no Datadog RUM Explorer após deploy em homolog (ver `readme.md`, seção "Verificação" do plano técnico).

## Referências

- Doc de análise: `projetos/datadog/readme.md`
- [Datadog RUM — Advanced Configuration](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/advanced_configuration/?lib_src=npm&rum_browser_sdk_version=gte_6_4_0&tab=webpack)
