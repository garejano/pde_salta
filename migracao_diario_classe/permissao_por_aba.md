base:./readme.md

## Contexto

A tela de Diário de Classe usa `<app-diario-de-classe-tab-navigator>` com duas abas:
- **Relatórios** → `diario-de-classe/listar`
- **Configuração** → `diario-de-classe/configurar`

A aba "Configuração" deve ser visível apenas para usuários com a permissão `DiarioDeClasseConfiguracao = 24`.

## Permissões (Funcionalidade.cs)

```csharp
public const int DiarioDeClasse = 203;           // base — já no controller
public const int DiarioDeClasseConfiguracao = 24; // aba Configuração
```

## Padrão de referência

`LancamentoFrequencia/GetPermissoesAbas` — idêntico para frequência.

## Arquivos criados/alterados

### Backend (`c:\projects\estrutura-pedagogica\backend\`)

| Ação | Arquivo |
|------|---------|
| CRIAR | `EstruturaPedagogica.Domain/DTO/DiarioDeClasse/PermissoesAbasResponse.cs` |
| CRIAR | `EstruturaPedagogica.Domain.Services/DiarioDeClasse/Interfaces/IPermissoesAbasService.cs` |
| CRIAR | `EstruturaPedagogica.Domain.Services/DiarioDeClasse/PermissoesAbasService.cs` |
| EDITAR | `EstruturaPedagogica.Api/Controllers/DiarioDeClasseController.cs` — novo método `GetPermissoesAbas` |
| CRIAR | `EstruturaPedagogica.Test/Integration/Scenarios/DiarioDeClasse/PermissoesAbasServiceTests.cs` |

Endpoint: `GET /api/diariodeclasse/permissoes-abas`

O serviço é registrado automaticamente via `AddImplementations(typeof(IBaseService))`.

### Frontend (`c:\projects\estrutura-pedagogica\frontend\src\app\features\diario-de-classe\`)

| Ação | Arquivo |
|------|---------|
| EDITAR | `models/diario-de-classe.model.ts` — nova interface `PermissoesAbasResponse` |
| EDITAR | `services/filtro-diario-de-classe.service.ts` — signal `possuiConfiguracao` + `getPermissoesAbas()` + `setPermissoesAbas()` |
| EDITAR | `diario-de-classe-tab-navigator/diario-de-classe-tab-navigator.component.ts` — tabs via `computed()` condicional |
| EDITAR | `diario-de-classe.component.ts` — `ngOnInit` dispara `getPermissoesAbas()` |

## Testes

3 cenários em `PermissoesAbasServiceTests.cs`:
1. Sem acesso → ambas as flags `false`
2. Só DiarioDeClasse (203) → `PossuiDiarioDeClasse=true`, `PossuiConfiguracao=false`
3. Ambas (203 + 24) → ambas `true`
