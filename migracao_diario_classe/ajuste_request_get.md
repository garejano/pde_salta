# Ajuste: remover flags `Exibir*` do request de documento

**Repositório:** `estrutura-pedagogica`  
**Card:** EFC-6443  
**Status:** pendente de implementação

---

## Contexto

O endpoint `POST /api/diariodeclasse/get-documento` recebe `DiarioDeClasseDocumentoRequest`, que hoje carrega 4 flags booleanas:

```csharp
public bool ExibirNomeProfessor       { get; set; }
public bool ExibirFrequencia          { get; set; }
public bool ExibirConteudoMinistrado  { get; set; }
public bool ExibirRelatorioRendimento { get; set; }
```

Essas flags controlam atualmente **o que o backend busca e retorna**. O frontend as envia com base no estado local `this.secoes` e as usa novamente para decidir o que renderizar em `buildBundle()`.

## Decisão de design

A responsabilidade de exibir ou não um bloco do documento passa a ser **exclusivamente do frontend** (via painel "Personalizar documento"). O backend passa a retornar sempre todos os dados disponíveis.

As flags `exibirFrequencia`, `exibirConteudoMinistrado` e `exibirRelatorioRendimento` **continuam existindo na configuração da rede** (`DiarioDeClasseConfiguracaoResponse` / entity `DiarioDeClasseConfiguracao`) — são os **defaults por rede**, carregados na abertura da tela e usados para inicializar `this.secoes` no frontend. Elas não saem do DTO de configuração.

## O que muda

| Camada | Arquivo | Mudança |
|--------|---------|---------|
| Backend DTO | `DiarioDeClasseDocumentoRequest.cs` | remover os 4 campos `Exibir*` |
| Backend DTO interno | `DiarioDeClasseInternalGetRequest.cs` | remover os 4 campos `Exibir*` |
| Backend service | `GetDocumentoDiarioDeClasseService.cs` | remover condicionais; sempre buscar todos os dados |
| Frontend model | `models/diario-de-classe.model.ts` | remover os 4 campos da interface |
| Frontend component | `listar/listar.component.ts` | remover 4 campos de `buildRequest()` |
| Frontend storage | `services/diario-documento-storage.service.ts` | remover flags do cache key |

## O que NÃO muda

- `this.secoes` no componente — continua controlando a renderização em `buildBundle()`.
- As condicionais em `buildBundle()` (linhas 249, 263, 278, 291, 299 de `listar.component.ts`) — permanecem intactas.
- Os campos `Exibir*` nos DTOs de **configuração** (`DiarioDeClasseConfiguracaoResponse`, `DiarioDeClasseConfiguracaoSaveRequest`, entity `DiarioDeClasseConfiguracao`).

## Plano detalhado

→ [`plan_ajuste_request.md`](./plan_ajuste_request.md)
