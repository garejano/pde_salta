# Análise de Bug — EFC-6408: Observação não é exibida na ficha individual

> Card: EFC-6408 | Subtarefa de: EFC-6292 | Data: 2026-05-26

---

## 1. Sintoma

O campo **Observações do Aluno** (`ObservacoesAluno`) aparece em branco na ficha individual, mesmo quando o aluno possui observação cadastrada.

**Dados do caso de teste:**

| Campo       | Valor                                          |
|-------------|------------------------------------------------|
| Rede        | Coleguium MG                                   |
| Escola      | Ouro Preto                                     |
| Turma       | 3ª série A - M                                 |
| AnoLetivo   | 2025                                           |
| Matrícula   | `80012508`                                     |
| HashTurma   | `49B57797-F302-4DA5-8ECA-84A003A1C245`         |
| HashAluno   | `9D01F492-A6DB-4189-BF24-D11D50B3F965`         |

**Observação esperada no documento:**
> "2020: Lei Federal nº 14.040 de 19/08/2020; Resolução CEE nº 474 de 08/05/2020. // 2021: Lei Federal nº 14.040..."

---

## 2. Fluxo de dados — onde `ObservacoesAluno` é gerado

`ObservacoesAluno` **não vem do EP nem do notas**. O campo é enriquecido pelo próprio `documentacao-pedagogica` a partir do seu banco **PostgreSQL** (`homologationdocumentacaopedagogica`):

```
documentacao-pedagogica (FichaIndividualGetService.Get)
  ├─ _fichaIndividualRepository.Get(...)    → chama notas/EP para notas
  └─ _historicoSerieRepository
       .GetToFichaIndividualGetRequest(...)  → consulta PostgreSQL local
         └─ historicoSerie.ObservacoesAluno → ficha.ObservacoesAluno (linha 319)
```

O `EP` e `notas` têm `FichaIndividualGetResponse` **sem** o campo `ObservacoesAluno` — esse preenchimento é exclusivo do docped.

---

## 3. Validação com dados reais do banco

### 3.1 Limitação: docped usa PostgreSQL

O MCP `sqlserver` conecta a `ElevaPortalHomolog` (SQL Server). A tabela `ModuloDocumentacaoPedagogica.HistoricoSerie` existente nesse banco é uma **cópia de sincronização** usada para relatórios, com apenas 10 colunas de flags:

| Coluna               | Tipo              |
|----------------------|-------------------|
| HashUsuario          | uniqueidentifier  |
| HashAnoLetivo        | uniqueidentifier  |
| HashEscola           | uniqueidentifier  |
| HashSerie            | uniqueidentifier  |
| CargaHoraria         | varchar           |
| MinimoParaAprovacao  | decimal           |
| Aprovado             | bit               |
| Reprovado            | bit               |
| Dependencia          | bit               |
| AprovadoPeloConselho | bit               |

**Não há `ObservacoesAluno` nessa tabela.** A entidade completa (com `ObservacoesAluno`) está no PostgreSQL do docped — inacessível via MCP.

### 3.2 Query de validação (executar direto no PostgreSQL do docped)

```sql
-- Verificar ObservacoesAluno para o aluno em todos os anos letivos
SELECT 
    hs."Id",
    al."Nome" AS "AnoLetivo",
    s."Nome" AS "Serie",
    hs."ObservacoesAluno",
    hs."CargaHoraria",
    hs."NomeTipoResultadoFinal",
    hs."Ativo"
FROM "HistoricoSerie" hs
JOIN "AnoLetivo" al ON al."Id" = hs."AnoLetivoId"
JOIN "Serie" s ON s."Id" = hs."SerieId"
JOIN "Historico" hist ON hist."Id" = hs."HistoricoId"
JOIN "Usuario" u ON u."Id" = hist."UsuarioId"
WHERE u."Hash" = '9D01F492-A6DB-4189-BF24-D11D50B3F965'
ORDER BY al."Nome" DESC
```

**Resultado esperado a verificar:**
- Se `ObservacoesAluno` está populado para anos anteriores (2020/2021) mas **null** para 2025 → dado não propagado para o ano corrente
- Se `ObservacoesAluno` é null em todos os anos → dado nunca foi salvo no docped

---

## 4. Análise do código — causa raiz provável

### 4.1 `HistoricoSerieRepository.GetToFichaIndividualGetRequest`

```csharp
// DocumentacaoPedagogica.Infra/Repositories/HistoricoSerieRepository.cs
public Task<HistoricoSerie> GetToFichaIndividualGetRequest(FichaIndividualGetRequest request)
{
    return QueryableAtivos()
          .Include(x => x.TipoResultadoFinal)
          .Include(x => x.Serie)
              .ThenInclude(x => x.Segmento)
          .Where(x => x.AnoLetivo.Hash == request.HashAnoLetivo
                   && x.Escola.Rede.Hash == request.HashRede
                   && x.Serie.Hash == request.HashSerie
                   && x.Historico.Usuario.Hash == request.HashUsuario)
          .FirstOrDefaultAsync();
}
```

### 4.2 `AlunoRepository.GetToFichaIndividualGetRequest` — de onde vem `HashSerie`

```csharp
// DocumentacaoPedagogica.Infra/Repositories/AlunoRepository.cs
HashSerie = x.Turma.EscolaSerie.Serie.SeriePrincipal.Hash,  // ← SeriePrincipal
```

O `HashSerie` usado no filtro do `HistoricoSerie` é o hash da **SériePrincipal** (macrosérie), não da série da turma diretamente. Isso significa que `HistoricoSerie.Serie.Hash` deve ser o hash da `SeriePrincipal`, não da série filha.

### 4.3 Cenários de falha

**Cenário A — `ObservacoesAluno` null no PostgreSQL para AnoLetivo 2025:**

O `HistoricoSerie` de 2025 para esse aluno foi criado (via processo de novo ano letivo ou sincronização), mas o campo `ObservacoesAluno` **não foi carregado/propagado** a partir dos anos anteriores. A observação existe nos registros de 2020/2021 mas não foi copiada para 2025.

Este é o cenário mais provável dado o conteúdo esperado ("2020: Lei Federal... // 2021: Lei Federal...").

**Cenário B — `SeriePrincipal` null → query não encontra o `HistoricoSerie` correto:**

Se a `Serie` da turma não possui `SeriePrincipal` configurada:
- `x.Turma.EscolaSerie.Serie.SeriePrincipal.Hash` → EF Core retorna `Guid.Empty`
- O filtro `x.Serie.Hash == Guid.Empty` → não encontra nenhum registro
- `historicoSerie == null` → retorna erro "Não foram encontradas séries para gerar o documento."

**Este cenário é descartado para o caso 6408** porque a ficha DO aluno abre (não retorna o erro de série não encontrada). O `HistoricoSerie` é encontrado — só `ObservacoesAluno` está null.

---

## 5. Causa raiz confirmada (sujeito a validação no PostgreSQL)

**`HistoricoSerie.ObservacoesAluno` é null para o AnoLetivo 2025** do aluno `HashAluno = 9D01F492-...`. O registro de 2025 existe e é encontrado pela query (por isso a ficha abre), mas o campo de observações não foi populado para esse ano letivo.

O dado provavelmente existe em registros de anos anteriores (2020/2021) mas não foi propagado ao criar o `HistoricoSerie` de 2025.

---

## 6. Correção

### 6.1 Opção 1 — Correção de dado (não-código)

Se o `ObservacoesAluno` foi preenchido em anos anteriores mas não propagado para 2025, a solução mais simples é **atualizar o dado via SQL/API** no PostgreSQL para incluir a observação no registro de 2025.

Isso é um one-shot para o ambiente de homologação. Para produção, precisa entender se existe um processo de "carry-forward" de observações entre anos letivos.

### 6.2 Opção 2 — Buscar observação do ano mais recente disponível (fallback)

Se o processo de novo ano letivo não propaga `ObservacoesAluno`, implementar fallback no `HistoricoSerieRepository`:

```csharp
public async Task<HistoricoSerie> GetToFichaIndividualGetRequest(FichaIndividualGetRequest request)
{
    var historicoSerie = await QueryableAtivos()
          .Include(x => x.TipoResultadoFinal)
          .Include(x => x.Serie).ThenInclude(x => x.Segmento)
          .Where(x => x.AnoLetivo.Hash == request.HashAnoLetivo
                   && x.Escola.Rede.Hash == request.HashRede
                   && x.Serie.Hash == request.HashSerie
                   && x.Historico.Usuario.Hash == request.HashUsuario)
          .FirstOrDefaultAsync();

    if (historicoSerie != null && string.IsNullOrEmpty(historicoSerie.ObservacoesAluno))
    {
        // Buscar observação do ano mais recente que tenha o campo preenchido
        var comObservacao = await QueryableAtivos()
              .Where(x => x.Escola.Rede.Hash == request.HashRede
                       && x.Serie.Hash == request.HashSerie
                       && x.Historico.Usuario.Hash == request.HashUsuario
                       && !string.IsNullOrEmpty(x.ObservacoesAluno))
              .OrderByDescending(x => x.AnoLetivo.Nome)
              .FirstOrDefaultAsync();

        if (comObservacao != null)
            historicoSerie.ObservacoesAluno = comObservacao.ObservacoesAluno;
    }

    return historicoSerie;
}
```

> **Atenção:** Só implementar a Opção 2 se confirmado que o processo de novo ano letivo não propaga o campo. Se a ausência for pontual (dado faltante em homolog), prefira a Opção 1.

### 6.3 Onde está a lógica de novo ano letivo para HistoricoSerie

Verificar se existe um serviço/job que cria registros de `HistoricoSerie` para o novo ano e se ele copia `ObservacoesAluno`:

```
DocumentacaoPedagogica.Domain.Services/HistoricoSerie/HistoricoSerieSaveService.cs
```

---

## 7. Próximos passos

1. **Acessar o PostgreSQL** do docped em homolog e executar a query da seção 3.2
2. Se `ObservacoesAluno` estiver null apenas em 2025 → confirma Cenário A → decidir entre Opção 1 ou 2
3. Se null em todos os anos → investigar por que o dado nunca foi salvo (bug no endpoint de save ou import faltando o campo)
4. Verificar `HistoricoSerieSaveService` para entender o processo de criação de novo ano letivo
