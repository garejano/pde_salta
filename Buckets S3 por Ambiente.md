# Buckets S3 por Ambiente

Referência rápida dos buckets S3 utilizados pela aplicação **Estrutura Pedagógica**, e de onde vem a configuração do bucket em cada ambiente.

## Buckets

| Ambiente | Bucket | URL | Região |
|---|---|---|---|
| Homologação | `homologation-estrutura-pedagogica-backend` | https://homologation-estrutura-pedagogica-backend.s3.amazonaws.com | us-east-1 |
| Produção | `production-estrutura-pedagogica-backend` | https://production-estrutura-pedagogica-backend.s3.amazonaws.com | us-east-1 |

Verificados via `aws s3api head-bucket` (profiles `eleva-admin-eficientes-hml` e `eleva-admin-eficientes-prd`) em 2026-07-06.

## De onde vem o valor do bucket

O código sempre lê `SettingsGetter.Instance.S3Bucket.Name` (`S3FileUploadService.cs`), mas a origem desse valor depende de `IsLocalhost` (`ConfigureCommons.cs`):

- **`IsLocalhost: true`** (execução local/homolog local) — as settings vêm do próprio `EstruturaPedagogica.Api/appsettings.json` do repositório, seção `Project.S3Bucket`.
- **`IsLocalhost: false`** (ambientes deployados) — as settings vêm do **AWS Secrets Manager**, na chave definida em `AwsSecretManagerKey`. Os arquivos em `BuildCfg/BackendConfigs/` só definem essa chave por ambiente:
  - `appsettings-development.json` → `development/estrutura-pedagogica/parameters`
  - `appsettings-homologation.json` → `homologation/estrutura-pedagogica/parameters`
  - `appsettings-production.json` → `production/estrutura-pedagogica/parameters`

O nome do bucket de produção **não está no repositório** — só existe dentro do secret `production/estrutura-pedagogica/parameters` (região `us-east-1`).

### Consultar o secret de produção

```bash
aws secretsmanager get-secret-value \
  --secret-id production/estrutura-pedagogica/parameters \
  --region us-east-1 \
  --profile eleva-admin-eficientes-prd \
  --query SecretString --output text
```

## Uso no código — Justificativa de Falta

`SaveJustificativaService.cs` faz upload do anexo da justificativa de falta para o bucket configurado, dentro da pasta definida em `Produto.Frequencia.PastaJustificativasFalta`:

- Pasta: `lancamento-frequencia-justificativas` (igual em homologação e produção)
- Caminho final do objeto: `lancamento-frequencia-justificativas/{guid}.{extensao}`
- Exemplo em produção: `s3://production-estrutura-pedagogica-backend/lancamento-frequencia-justificativas/{guid}.pdf`

Serviços envolvidos: `IS3FileUploadService` (upload), `IS3DownloadFileService` (verificação de acesso pós-upload), `IS3GetPreSignedUrlService` (geração de URL para consulta do anexo).
