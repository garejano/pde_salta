# Configuração de Credenciais AWS — Projeto notas (local)

> Relevante para: qualquer desenvolvedor rodando o `notas` backend localmente.

## Como o projeto usa AWS

O `appsettings.json` do `Notas.Api` configura:

```json
{
  "AwsCredentialProfile": "eleva-developer-dev",
  "AwsRegion":            "us-east-1",
  "AwsSecretManagerKey":  "homologation/notas/parameters"
}
```

O app usa o **perfil nomeado `eleva-developer-dev`** para duas coisas:
1. Ler parâmetros do **AWS Secrets Manager** na inicialização
2. Assinar URLs pré-assinadas do **S3** em runtime (laudos médicos)

Se as credenciais do perfil expirarem, a geração de URLs do S3 falha com:
> `Credentials must be specified, cannot call method anonymously`

---

## Por que funcionou semana passada e parou agora?

Credenciais temporárias (SSO ou STS AssumeRole) têm TTL curto — tipicamente 8 h ou 24 h para SSO, e até 1 hora para STS. Quando expiram, o perfil fica inválido silenciosamente até ser renovado.

---

## Como renovar / configurar o perfil

### Opção 1 — AWS SSO (mais provável no projeto)

```bash
aws sso login --profile eleva-developer-dev
```

Se o perfil ainda não existir no seu `~/.aws/config`:

```ini
# ~/.aws/config
[profile eleva-developer-dev]
sso_start_url  = https://gruposaltaedu.awsapps.com/start
sso_region     = us-east-1
sso_account_id = <account-id>
sso_role_name  = <role-name>
region         = us-east-1
```

> Pedir `account-id` e `role-name` para o time de infraestrutura.

---

### Opção 2 — Credenciais de longa duração (Access Key + Secret)

```ini
# ~/.aws/credentials
[eleva-developer-dev]
aws_access_key_id     = AKIA...
aws_secret_access_key = ...
```

```ini
# ~/.aws/config
[profile eleva-developer-dev]
region = us-east-1
```

> Credenciais de longa duração não expiram por tempo, mas devem ser rotacionadas pelo time de infra.

---

### Opção 3 — Variáveis de ambiente (alternativa rápida)

Se não quiser mexer no `~/.aws/credentials`, exporte as variáveis antes de iniciar o backend:

```powershell
$env:AWS_PROFILE = "eleva-developer-dev"
# OU com chaves diretas:
$env:AWS_ACCESS_KEY_ID     = "AKIA..."
$env:AWS_SECRET_ACCESS_KEY = "..."
$env:AWS_DEFAULT_REGION    = "us-east-1"
```

---

## Como verificar se o perfil está funcionando

```bash
aws sts get-caller-identity --profile eleva-developer-dev
```

Resposta esperada (JSON com `UserId`, `Account`, `Arn`). Se retornar erro de credenciais, o perfil expirou ou não está configurado.

---

## Checklist rápido quando o erro aparecer

1. `aws sts get-caller-identity --profile eleva-developer-dev` → verifica se as credenciais são válidas
2. Se inválidas → `aws sso login --profile eleva-developer-dev` (ou renovar access key via console)
3. Reiniciar o backend após renovar
