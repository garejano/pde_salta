# Filtros — Diário de Classe com Frequência Registrada

Filtros válidos para testar o endpoint `GET /diariodeclasse/get-documento` com frequência real lançada no banco.

---

## Como usar

Todos os cenários abaixo usam:
- `hashAnoLetivo`: `ea3695ab-f17b-4905-8034-b8c2a0495c06` (2026)
- `dataInicio`: `2026-05-01`
- `dataTermino`: `2026-06-16`

Caracteres configurados para ambas as redes encontradas:

| Campo | Valor |
|-------|-------|
| `CaracterParaIndicarPresenca` | `.` |
| `CaracterParaIndicarFalta` | `F` |
| `CaracterParaIndicarTransferencia` | `T` |
| `CaracterParaIndicarNEE` | *(vazio)* |
| `CaracterParaIndicarPendencia` | `NULL` → fallback código: `-` |

> Alunos sem chamada lançada aparecem como `-` (pendência com valor `null` no banco).

---

## Cenário 1 — Coleguium MG / Castelo / 3º ano A - M

**Contexto:**
- Rede: Coleguium MG
- Escola: Castelo
- Turma: 3º ano A - M
- Turno: Manhã (Turno 1)
- Frequências confirmadas: aulas com `Turno = 1`

### 1a — Inglês 1

```json
{
  "hashAnoLetivo": "ea3695ab-f17b-4905-8034-b8c2a0495c06",
  "hashRede":      "98cd62e1-0350-4db8-9181-420ba0eee1fc",
  "hashEscola":    "bb23c91d-4cb9-429f-9a82-8b4b81e6806d",
  "hashSerie":     "81dc599d-98eb-4659-bbb1-5b6854c8192f",
  "hashTurma":     "80d82e29-8887-44a5-8905-010224f5e449",
  "hashDisciplina":"25438910-a11e-4cae-aa8f-d6bd16a2bb5c",
  "dataInicio":    "2026-05-01",
  "dataTermino":   "2026-06-16",
  "exibirNomeProfessor":        true,
  "exibirFrequencia":           true,
  "exibirConteudoMinistrado":   true,
  "exibirRelatorioRendimento":  true
}
```

### 1b — Matemática 1

```json
{
  "hashAnoLetivo": "ea3695ab-f17b-4905-8034-b8c2a0495c06",
  "hashRede":      "98cd62e1-0350-4db8-9181-420ba0eee1fc",
  "hashEscola":    "bb23c91d-4cb9-429f-9a82-8b4b81e6806d",
  "hashSerie":     "81dc599d-98eb-4659-bbb1-5b6854c8192f",
  "hashTurma":     "80d82e29-8887-44a5-8905-010224f5e449",
  "hashDisciplina":"ad698bf8-97af-49d1-a100-73847ba77a65",
  "dataInicio":    "2026-05-01",
  "dataTermino":   "2026-06-16",
  "exibirNomeProfessor":        true,
  "exibirFrequencia":           true,
  "exibirConteudoMinistrado":   true,
  "exibirRelatorioRendimento":  true
}
```

### 1c — Ciências 1

```json
{
  "hashAnoLetivo": "ea3695ab-f17b-4905-8034-b8c2a0495c06",
  "hashRede":      "98cd62e1-0350-4db8-9181-420ba0eee1fc",
  "hashEscola":    "bb23c91d-4cb9-429f-9a82-8b4b81e6806d",
  "hashSerie":     "81dc599d-98eb-4659-bbb1-5b6854c8192f",
  "hashTurma":     "80d82e29-8887-44a5-8905-010224f5e449",
  "hashDisciplina":"f5a68ab3-a7c0-47bf-9f7b-e925e993e7c8",
  "dataInicio":    "2026-05-01",
  "dataTermino":   "2026-06-16",
  "exibirNomeProfessor":        true,
  "exibirFrequencia":           true,
  "exibirConteudoMinistrado":   true,
  "exibirRelatorioRendimento":  true
}
```

---

## Cenário 2 — Anglo Alante SP / São José dos Campos / Extensivo A - M

**Contexto:**
- Rede: Anglo Alante SP
- Escola: São José dos Campos
- Turma: Extensivo A - M
- Turno: Manhã (Turno 1)
- Frequências confirmadas: aulas com `Turno = 1`

### 2a — Biologia A

```json
{
  "hashAnoLetivo": "ea3695ab-f17b-4905-8034-b8c2a0495c06",
  "hashRede":      "7f9e9798-3d78-44f6-8338-8d0c4495b641",
  "hashEscola":    "09f6be93-17de-40f8-a3ab-2edc591a311b",
  "hashSerie":     "f39c981d-886c-45d5-ad94-773190135a82",
  "hashTurma":     "53c2a579-bbb5-4f1b-908a-f65bf71e613a",
  "hashDisciplina":"2eb6e741-270e-49ba-97e2-51323bd3d700",
  "dataInicio":    "2026-05-01",
  "dataTermino":   "2026-06-16",
  "exibirNomeProfessor":        true,
  "exibirFrequencia":           true,
  "exibirConteudoMinistrado":   true,
  "exibirRelatorioRendimento":  true
}
```

### 2b — Física A

```json
{
  "hashAnoLetivo": "ea3695ab-f17b-4905-8034-b8c2a0495c06",
  "hashRede":      "7f9e9798-3d78-44f6-8338-8d0c4495b641",
  "hashEscola":    "09f6be93-17de-40f8-a3ab-2edc591a311b",
  "hashSerie":     "f39c981d-886c-45d5-ad94-773190135a82",
  "hashTurma":     "53c2a579-bbb5-4f1b-908a-f65bf71e613a",
  "hashDisciplina":"c3b4d3bf-56f6-4dca-bc27-e32021827207",
  "dataInicio":    "2026-05-01",
  "dataTermino":   "2026-06-16",
  "exibirNomeProfessor":        true,
  "exibirFrequencia":           true,
  "exibirConteudoMinistrado":   true,
  "exibirRelatorioRendimento":  true
}
```

---

## O que esperar na resposta

| Situação | Caractere exibido |
|----------|-------------------|
| Chamada lançada — presença | `.` |
| Chamada lançada — falta | `F` |
| Chamada lançada — transferência | `T` |
| Sem lançamento (pendente) | `-` *(fallback — `CaracterParaIndicarPendencia` é NULL no banco)* |

> **Nota:** O `-` de pendência não é um bug. A configuração da rede no SQL Server está com `CaracterParaIndicarPendencia = NULL`.
> Para exibir outro caractere (ex: `N`), atualizar a coluna no banco:
> ```sql
> UPDATE DiarioDeClasseConfiguracao
> SET CaracterParaIndicarPendencia = 'N'
> WHERE Rede IN (
>     SELECT Id FROM Rede WHERE Hash IN (
>         '98cd62e1-0350-4db8-9181-420ba0eee1fc',
>         '7f9e9798-3d78-44f6-8338-8d0c4495b641'
>     )
> )
> ```

---

## Query de verificação — frequências dos alunos dessas turmas

```sql
-- Verifica se os alunos das turmas têm frequência no período
SELECT pe.Pessoa AS PessoaId, ae2.DataAula, ae2.Turno, ae2.Tempo, ae2.TipoFrequencia
FROM AlunoEscola ae
JOIN PessoaEscolaAcesso pea ON pea.Id = ae.[AlunoEscola_key]
JOIN PessoaEscola pe ON pe.Id = pea.PessoaEscola
JOIN AlunoFrequencia ae2 ON ae2.Pessoa = pe.Pessoa
    AND ae2.DataAula >= '2026-05-01'
    AND ae2.DataAula <= '2026-06-16'
    AND ae2.Ativo = 1
WHERE ae.Turma = (SELECT Id FROM Turma WHERE Hash = '80d82e29-8887-44a5-8905-010224f5e449')
  AND ae.DataCancelamentoTratada IS NULL
ORDER BY ae2.DataAula, pe.Pessoa
```
