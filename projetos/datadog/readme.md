# Datadog RUM — Instrumentação em `estrutura-pedagogica`

**Repositório:** `estrutura-pedagogica` (frontend Angular)
**Objetivo:** entender como o Datadog RUM está implementado hoje e planejar a coleta de mais dados para identificar o usuário (marca/rede, escola, perfil, aluno vs. responsável).

---

## 1. Estado atual no código

- Inicialização em `frontend/src/main.ts`:
  ```ts
  datadogRum.init({
    applicationId: 'f27bcc1b-1cbc-43bf-a933-9411425bd054',
    clientToken: 'pubf5c77cf76ebe17b8fff95eae562ad708',
    site: 'datadoghq.com',
    service: 'estrutura-pedagogica',
    env: 'prod',              // fixo, independe do ambiente real
    version: '0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackResources: true,
    trackUserInteractions: true,
    trackLongTasks: true,
  });
  ```
- `app.module.ts` registra um `ErrorHandler` customizado (`DatadogErrorHandler`) que só encaminha exceções do Angular via `addAngularError` (`@datadog/browser-rum-angular`).
- **Não existe** nenhuma chamada a `setUser`, `setContext`, `setGlobalContext` ou `datadogRum.startView` no repositório hoje — o RUM roda "cego" quanto a quem é o usuário.
- Pacotes: `@datadog/browser-rum` e `@datadog/browser-rum-angular`, ambos `^7.4.0`.

## 2. Já existe um padrão equivalente para Google Analytics

`UsuarioService.enviarDadosPerfilGoogleAnalytics()` (`portal-modulo/shared/services/usuario.service.ts:194`) já faz exatamente o tipo de enriquecimento que queremos replicar no Datadog, disparado logo após o login (dentro de `getDadosDoUsuario`):

```ts
dataLayer.push({
  event: 'dimensao-GA4',
  marca: perfilAtivo.NomeRede,
  unidade: perfilAtivo.NomeEscola,
  serie: usuarioAutenticado.NomeSerie,
  perfil: perfilAtivo.NomePerfil,
});
```

Isso é um bom ponto de partida e um bom lugar para adicionar o equivalente em Datadog (`setUser`/`setContext`).

## 3. Dados disponíveis para instrumentação

De `UsuarioAutenticadoModel` (`usuario-autenticado.model.ts`):
- `Id`, `Hash`, `Nome`, `Email` — identifica o usuário.
- `NomeSerie`, `IdPerfilDeAcessoDoUsuario`, `IdPessoaEscolaAcesso`.
- `AcessosUsuario: AcessoUsuarioModel[]` — todos os perfis/vínculos do usuário.

De `AcessoUsuarioModel` (`acesso-usuario.model.ts`), por perfil ativo:
- `NomeRede` / `RedeHash` — marca/rede.
- `NomeEscola` / `EscolaHash` — escola.
- `NomePerfil` — tipo de perfil (ex.: Aluno, Responsável, Professor, Coordenador).
- `AlunoHash`, `TurmaHash` — presentes quando o perfil ativo está vinculado a um aluno/turma.

Ou seja, **todos os dados pedidos no objetivo já estão disponíveis no client** — falta só mapeá-los para o Datadog.

### Classificação aluno vs. responsável — confirmada via banco (`PerfilAcesso`)

Consulta em `PerfilAcesso` (`SELECT Id, Nome, EhPerfilFuncionario, ... FROM PerfilAcesso`) mostrou 97 perfis. Apenas 4 têm `EhPerfilFuncionario = false`: **"Aluno"** (Id 1), **"Responsável"** (Id 9), "Candidato Bolsão" (Id 16) e "Cecor IA" (Id 112) — os outros 93 são perfis de staff (Professor, Coordenação, Diretor, etc.).

**Atenção:** não dá para inferir por substring (`.includes('Responsável')`) — existem perfis de **staff** com "Responsável" no nome (`EhPerfilFuncionario = true`): `"BETA - Responsável"`, `"Responsável por Avaliação"`, `"Responsável por Disponibilidade de Horários"`. A classificação correta é por **igualdade exata** de `NomePerfil`:
- `NomePerfil === 'Aluno'` → aluno
- `NomePerfil === 'Responsável'` → responsável
- qualquer outro valor → outro (staff, candidato bolsão, etc.)

## 4. Perguntas em aberto do objetivo original — respondidas

- **"Entender como separar liga/desliga por ambiente e marcar o evento com o ambiente correto":**
  Hoje `env: 'prod'` está fixo em `main.ts`, independente de rodar em dev/homolog/produção. O projeto já tem `environment.stage` (`Development`, e equivalentes em `environment.homolog.ts` / `environment.prod.ts` / `environment.hot*.ts`) — dá para usar esse valor no lugar do literal fixo, e também decidir ali se o RUM deve iniciar ou não (ex.: não iniciar em `Development` local).

- **"Entender se existem níveis de monitoramento que podem ser ligados/desligados por custo":**
  Sim — os principais são:
  - `sessionSampleRate` (hoje 100%) — % de sessões monitoradas.
  - `sessionReplaySampleRate` (hoje 20%) — % de sessões com session replay (o que mais pesa em custo/armazenamento).
  - `trackResources`, `trackUserInteractions`, `trackLongTasks` — granularidade de coleta, mais barato de manter ligado.
  Vale considerar reduzir `sessionReplaySampleRate` (ou zerar) em ambientes não produtivos, mantendo `sessionSampleRate` alto para métricas de erro/performance sem o custo do replay.

## 5. Proposta de instrumentação — implementada

1. **Ambiente dinâmico:** `env: 'prod'` fixo trocado por `environment.stage` em `main.ts`. ✅
2. **`setUser`** chamado em `enviarDadosParaDatadog` (novo método em `usuario.service.ts`), no mesmo ponto onde já roda `enviarDadosPerfilGoogleAnalytics` (dentro de `getDadosDoUsuario`), usando `Hash`, `Nome`, `Email`. Esse método já é chamado tanto no login quanto em toda navegação guardada (`authGuard`) e após troca de perfil (que sempre recarrega a página), então não precisou de hooks adicionais. ✅
3. **`setGlobalContext`** com `{ rede, escola, perfil, tipoUsuario }`, derivado do `perfilAtivo`. ✅
4. **`tipoUsuario` (aluno vs. responsável):** confirmado via banco (`PerfilAcesso`) — igualdade exata de `NomePerfil` (`'Aluno'` / `'Responsável'` / `'outro'`). Ver seção 3. ✅
5. **`startView`:** não implementado — o RUM do Angular já rastreia navegação automaticamente via router.
6. **Sample rates por ambiente:** `sessionReplaySampleRate` vai a 0% fora de `Production`; `sessionSampleRate` continua 100% em todo lugar. ✅

## 6. Referências

- [Datadog RUM — Advanced Configuration (Browser SDK)](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/advanced_configuration/?lib_src=npm&rum_browser_sdk_version=gte_6_4_0&tab=webpack)
- `frontend/src/main.ts` — inicialização do RUM
- `frontend/src/app/app.module.ts` — `DatadogErrorHandler`
- `portal-modulo/shared/services/usuario.service.ts` — dados de usuário/perfil já disponíveis no client
