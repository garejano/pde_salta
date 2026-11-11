# Query — Dados Válidos para Geração do Diário de Classe

## Filtros por Configuração de Caracteres (2026)

Dados extraídos em 2026-06-17. Use para testar cenários com configuração de caracteres específica.

> **Data sugerida:** use `2026-02-01` → `2026-06-15` para ter chamadas já lançadas no período.

### Cenário 1 — `P / F / - / T / N` (único cadastrado)

| Filtro | Valor |
|--------|-------|
| **Rede** | Alfa |
| **Escola** | Campo Mourão |
| **Série** | 8º Ano Regular |
| **Turma** | 8º ano A - M |
| **Disciplina** | Ciências 1 |

| Caráter | Valor |
|---------|-------|
| Presença | `P` |
| Falta | `F` |
| Pendência | `-` |
| Transferência | `T` |
| NEE | `N` |

```json
{
  "hashAnoLetivo":  "EA3695AB-F17B-4905-8034-B8C2A0495C06",
  "hashRede":       "CD72B088-2FDA-4600-9F08-C452E107A091",
  "hashEscola":     "58A5552C-00B6-4DF0-A021-73B111C232FD",
  "hashSerie":      "01EA6C70-5CF0-40BB-8DAD-E20FF562CE10",
  "hashTurma":      "971D071A-38C5-41EE-81AB-8B9AB9B418EE",
  "hashDisciplina": "A693C2BA-31FC-4576-B2E3-03BC1F6B9A8C",
  "dataInicio":     "2026-02-01",
  "dataTermino":    "2026-06-15",
  "exibirNomeProfessor": true,
  "exibirFrequencia": true,
  "exibirConteudoMinistrado": true,
  "exibirRelatorioRendimento": true
}
```

> **Nota:** É o único conjunto de caracteres cadastrado em `DiarioDeClasseConfiguracao` no banco atual.
> Para testar variações (ex: `✓/✗/-/T/N`) é necessário inserir configurações adicionais via script SQL.

---

## Exemplos Concretos — 5 Redes Diferentes (2026)

Dados extraídos em 2026-06-15. Use a seleção do filtro na coluna "O que selecionar" e o payload JSON para testar o endpoint.

> **Data sugerida:** use `2026-02-01` → `2026-06-15` para ter chamadas já lançadas no período.

---

### 1. Rede Ábaco — São Bernardo do Campo 1

| Campo | Valor |
|-------|-------|
| **Rede** | Ábaco |
| **Escola** | São Bernardo do Campo 1 |
| **Série** | 1º Ano Regular |
| **Turma** | 1º ano C - T |
| **Disciplina** | Língua Portuguesa 1 |

```json
{
  "hashAnoLetivo":  "EA3695AB-F17B-4905-8034-B8C2A0495C06",
  "hashRede":       "A43C39F2-91B7-4425-8921-1849090C1804",
  "hashEscola":     "33CA2B94-D04C-43F8-B5DD-1DCBD6D80163",
  "hashSerie":      "F8CD9E79-125D-48CE-950F-C38DEAF2F967",
  "hashTurma":      "B0356545-DD1F-4EE2-9ACA-A88E130FF68B",
  "hashDisciplina": "F12DEEBF-04C9-4E2C-A25A-A2A4D22D33AE",
  "dataInicio":     "2026-02-01",
  "dataTermino":    "2026-06-15",
  "exibirNomeProfessor": true,
  "exibirFrequencia": true,
  "exibirConteudoMinistrado": true,
  "exibirRelatorioRendimento": true
}
```

---

### 2. Rede Alfa — Campinas

| Campo | Valor |
|-------|-------|
| **Rede** | Alfa |
| **Escola** | Campinas |
| **Série** | 4º Ano Bilíngue |
| **Turma** | 4º ano bilíngue A - T |
| **Disciplina** | Regente 1 |

```json
{
  "hashAnoLetivo":  "EA3695AB-F17B-4905-8034-B8C2A0495C06",
  "hashRede":       "CD72B088-2FDA-4600-9F08-C452E107A091",
  "hashEscola":     "7B16E4CF-C2E7-42CB-BABC-95F60D3E1E25",
  "hashSerie":      "CAC71269-6BFF-4F2D-8971-B2A6A3F3BEF7",
  "hashTurma":      "E343A4FB-5128-4453-8319-801780D08537",
  "hashDisciplina": "96A27D75-1401-46A2-B482-C6413F9EA161",
  "dataInicio":     "2026-02-01",
  "dataTermino":    "2026-06-15",
  "exibirNomeProfessor": true,
  "exibirFrequencia": true,
  "exibirConteudoMinistrado": true,
  "exibirRelatorioRendimento": true
}
```

---

### 3. Rede Anglo Alante GO — Ápice EF

| Campo | Valor |
|-------|-------|
| **Rede** | Anglo Alante GO |
| **Escola** | Ápice - EF |
| **Série** | 1º Ano Regular |
| **Turma** | 1º ano B - T |
| **Disciplina** | Regente 1 |

```json
{
  "hashAnoLetivo":  "EA3695AB-F17B-4905-8034-B8C2A0495C06",
  "hashRede":       "6319C489-F64E-4B97-A91B-7B44E2AB59FF",
  "hashEscola":     "8368A0B3-9A5A-4F48-98E0-5D01E1F72CD4",
  "hashSerie":      "F8CD9E79-125D-48CE-950F-C38DEAF2F967",
  "hashTurma":      "8F8242FB-8000-4C0C-8503-88A753F63711",
  "hashDisciplina": "F69298C5-C7F4-47AF-8E19-8111C00BAD09",
  "dataInicio":     "2026-02-01",
  "dataTermino":    "2026-06-15",
  "exibirNomeProfessor": true,
  "exibirFrequencia": true,
  "exibirConteudoMinistrado": true,
  "exibirRelatorioRendimento": true
}
```

---

### 4. Rede Anglo Alante SP — Butantã

| Campo | Valor |
|-------|-------|
| **Rede** | Anglo Alante SP |
| **Escola** | Butantã |
| **Série** | Infantil 2 Regular |
| **Turma** | Infantil 2 A - M |
| **Disciplina** | Regente 1 |

```json
{
  "hashAnoLetivo":  "EA3695AB-F17B-4905-8034-B8C2A0495C06",
  "hashRede":       "7F9E9798-3D78-44F6-8338-8D0C4495B641",
  "hashEscola":     "E91B145D-EBD4-4E1C-8BC8-BA07DB5FBA30",
  "hashSerie":      "8BD8A3FD-0A12-427D-AF38-0CEF83F5A09B",
  "hashTurma":      "A29472AC-EDAB-4C37-95B6-14189173B933",
  "hashDisciplina": "D598E87C-F642-4E59-BEA5-A242D73D4BD2",
  "dataInicio":     "2026-02-01",
  "dataTermino":    "2026-06-15",
  "exibirNomeProfessor": true,
  "exibirFrequencia": true,
  "exibirConteudoMinistrado": true,
  "exibirRelatorioRendimento": true
}
```

---

### 5. Rede Coleguium MG — Gutierrez EI

| Campo | Valor |
|-------|-------|
| **Rede** | Coleguium MG |
| **Escola** | Gutierrez - EI |
| **Série** | Infantil 1 Regular |
| **Turma** | Infantil 1 A - T |
| **Disciplina** | Regente 1 |

```json
{
  "hashAnoLetivo":  "EA3695AB-F17B-4905-8034-B8C2A0495C06",
  "hashRede":       "98CD62E1-0350-4DB8-9181-420BA0EEE1FC",
  "hashEscola":     "0037BC03-DF8B-45B3-88C0-FE9025EF0A27",
  "hashSerie":      "AD4ACC8E-CF49-48EF-90FA-A48819EFE7E8",
  "hashTurma":      "B48F4567-2FCD-4CDF-B3B9-DA016D8199F8",
  "hashDisciplina": "62F9204A-C7C0-449E-9CEA-910B56CD09A9",
  "dataInicio":     "2026-02-01",
  "dataTermino":    "2026-06-15",
  "exibirNomeProfessor": true,
  "exibirFrequencia": true,
  "exibirConteudoMinistrado": true,
  "exibirRelatorioRendimento": true
}
```

---

## Contexto

O endpoint `POST api/diariodeclasse/get-documento` requer uma combinação válida de
**Turma + Disciplina + Intervalo de datas** que atenda às seguintes condições:

| Condição | Tabela | Filtro |
|----------|--------|--------|
| Professor ativo na turma | `ProfessorTurmaDisciplina` | `DataInativacao IS NULL` e `NaoPossuiAula = 0` |
| Segmento com aula | `Segmento` | `PossuiAula = 1` |
| Aulas registradas no período | `AulaEvento` | `PossuiFrequencia = 1` e `DataInativacao IS NULL` |
| Alunos matriculados | `AlunoEscola` | `DataCancelamento IS NULL` |
| Chamada lançada (dado rico) | `AlunoFrequencia` | ver Query 2 |

> **Convenção de FKs:** neste banco, vários campos de FK não têm o sufixo `Id`.
> Exemplos: `Turma.EscolaSerie`, `EscolaSerie.Escola`, `Escola.Rede`, `EscolaSerie.Serie`,
> `EscolaSerie.AnoLetivo`, `AulaEvento.Turma`, `AulaEvento.Disciplina`,
> `ProfessorTurmaDisciplina.Turma`, `ProfessorTurmaDisciplina.Disciplina`,
> `AlunoFrequencia.Escola`, `AlunoFrequencia.Pessoa`.

---

## Query 1 — Seed: Combinações com Aulas e Alunos Ativos

Retorna as TOP 10 combinações válidas do ano letivo vigente, ordenadas por número de aulas.
Os valores retornados são usados diretamente no payload do endpoint.

```sql
SELECT TOP 10
    t.Hash                              AS HashTurma,
    t.Nome                              AS NomeTurma,
    e.Hash                              AS HashEscola,
    e.Nome                              AS NomeEscola,
    r.Hash                              AS HashRede,
    r.Nome                              AS NomeRede,
    al.Id                               AS AnoLetivo,
    al.Hash                             AS HashAnoLetivo,
    s.Hash                              AS HashSerie,
    s.Nome                              AS NomeSerie,
    d.Hash                              AS HashDisciplina,
    d.Nome                              AS NomeDisciplina,
    COUNT(DISTINCT ae.Id)               AS TotalAulas,
    MIN(CAST(ae.DataInicio AS DATE))    AS DataInicio,
    MAX(CAST(ae.DataInicio AS DATE))    AS DataTermino,
    COUNT(DISTINCT a.AlunoEscola_key)   AS TotalAlunos
FROM ProfessorTurmaDisciplina ptd
JOIN Turma       t   ON t.Id   = ptd.Turma
JOIN EscolaSerie es  ON es.Id  = t.EscolaSerie
JOIN Escola      e   ON e.Id   = es.Escola
JOIN Rede        r   ON r.Id   = e.Rede
JOIN AnoLetivo   al  ON al.Id  = es.AnoLetivo
JOIN Serie       s   ON s.Id   = es.Serie
JOIN Segmento    seg ON seg.Id = s.Segmento
JOIN Disciplina  d   ON d.Id   = ptd.Disciplina
-- Aulas do professor nesta turma/disciplina
JOIN AulaEvento  ae  ON ae.Turma      = t.Id
                    AND ae.Disciplina  = ptd.Disciplina
                    AND ae.DataInativacao IS NULL
                    AND ae.PossuiFrequencia = 1
-- Alunos ativos na turma
JOIN AlunoEscola a   ON a.Turma           = t.Id
                    AND a.DataCancelamento IS NULL
WHERE ptd.DataInativacao IS NULL
  AND ptd.NaoPossuiAula  = 0
  AND seg.PossuiAula     = 1
  AND al.Vigente         = 1       -- ano letivo corrente
GROUP BY
    t.Hash,  t.Nome,
    e.Hash,  e.Nome,
    r.Hash,  r.Nome,
    al.Id,   al.Hash,
    s.Hash,  s.Nome,
    d.Hash,  d.Nome
HAVING COUNT(DISTINCT ae.Id) >= 5  -- ao menos 5 aulas no ano
ORDER BY COUNT(DISTINCT ae.Id) DESC;
```

---

## Query 2 — Verificar Chamadas Lançadas

Confirma que há registros de `AlunoFrequencia` para uma combinação da Query 1.
Substitua os valores de `@HashTurma` e `@HashDisciplina` pelos retornados acima.

> **Chave de correlação AulaEvento ↔ AlunoFrequencia:**
> `AulaEvento.Turno = AlunoFrequencia.Turno` e `AulaEvento.TurmaTempo = AlunoFrequencia.Tempo`

```sql
DECLARE @HashTurma      UNIQUEIDENTIFIER = '00000000-0000-0000-0000-000000000000';
DECLARE @HashDisciplina UNIQUEIDENTIFIER = '00000000-0000-0000-0000-000000000000';
DECLARE @DataInicio     DATE             = '2026-03-01';
DECLARE @DataTermino    DATE             = '2026-06-15';

SELECT
    CAST(ae.DataInicio AS DATE)                        AS DataAula,
    ae.Turno                                           AS TurnoId,
    ae.TurmaTempo                                      AS Tempo,
    COUNT(DISTINCT af.Pessoa)                          AS AlunosMarcados,
    SUM(CASE WHEN tf.EhFalta = 0 THEN 1 ELSE 0 END)   AS Presencas,
    SUM(CASE WHEN tf.EhFalta = 1 THEN 1 ELSE 0 END)   AS Faltas
FROM AulaEvento ae
JOIN Turma       t  ON t.Id    = ae.Turma
JOIN EscolaSerie es ON es.Id   = t.EscolaSerie
JOIN Escola      e  ON e.Id    = es.Escola
JOIN Disciplina  d  ON d.Id    = ae.Disciplina
LEFT JOIN AlunoFrequencia af ON af.Escola  = e.Id
                             AND af.DataAula = CAST(ae.DataInicio AS DATE)
                             AND af.Turno    = ae.Turno
                             AND af.Tempo    = ae.TurmaTempo
                             AND af.DataInativacao IS NULL
LEFT JOIN TipoFrequencia tf ON tf.Id = af.TipoFrequencia
WHERE t.Hash = @HashTurma
  AND d.Hash = @HashDisciplina
  AND CAST(ae.DataInicio AS DATE) BETWEEN @DataInicio AND @DataTermino
  AND ae.DataInativacao   IS NULL
  AND ae.PossuiFrequencia = 1
GROUP BY
    CAST(ae.DataInicio AS DATE),
    ae.Turno,
    ae.TurmaTempo
ORDER BY CAST(ae.DataInicio AS DATE);
```

**Critério de qualidade:** linhas com `AlunosMarcados > 0` indicam chamadas efetivamente lançadas.

---

## Query 3 — Alunos Ativos na Turma

Útil para conferir se os alunos que aparecem no documento batem com os do banco.

```sql
DECLARE @HashTurma UNIQUEIDENTIFIER = '00000000-0000-0000-0000-000000000000';

SELECT
    p.Nome                              AS NomeAluno,
    ISNULL(p.NomeSocial, p.Nome)        AS NomeExibicao,
    ae2.Matricula                       AS RA,
    ae2.DataMatricula,
    ae2.DataCancelamento
FROM AlunoEscola ae2
JOIN PessoaEscolaAcesso pea ON pea.Id         = ae2.AlunoEscola_key
JOIN PessoaEscola       pe  ON pe.Id          = pea.PessoaEscola
JOIN Pessoa             p   ON p.Id           = pe.Pessoa
JOIN Turma              t   ON t.Id           = ae2.Turma
WHERE t.Hash              = @HashTurma
  AND ae2.DataCancelamento IS NULL
ORDER BY ISNULL(p.NomeSocial, p.Nome);
```

---

## Payload de Exemplo

Após executar a Query 1, substitua os valores abaixo pelos da linha escolhida:

```json
POST api/diariodeclasse/get-documento
{
  "hashAnoLetivo":  "<HashAnoLetivo>",
  "hashRede":       "<HashRede>",
  "hashEscola":     "<HashEscola>",
  "hashSerie":      "<HashSerie>",
  "hashTurma":      "<HashTurma>",
  "hashDisciplina": "<HashDisciplina>",
  "dataInicio":     "<DataInicio>",
  "dataTermino":    "<DataTermino>",
  "exibirNomeProfessor":      true,
  "exibirFrequencia":         true,
  "exibirConteudoMinistrado": true,
  "exibirRelatorioRendimento": true
}
```

> **Obs.:** `hashAnoLetivo`, `hashRede` e `hashSerie` são necessários apenas quando
> `exibirRelatorioRendimento = true`. Para os demais cenários, somente
> `hashTurma`, `hashEscola` e `hashDisciplina` são obrigatórios.

---

## Referências de implementação

| O quê | Onde |
|-------|------|
| Service que usa estes dados | `estrutura-pedagogica/backend/…/DiarioDeClasse/GetDocumentoDiarioDeClasseService.cs` |
| Repository de aulas | `estrutura-pedagogica/backend/…/Repositories/Stateful/AulaEventoRepository.cs` → `GetParaDiarioClasse` |
| Repository de frequência bulk | `estrutura-pedagogica/backend/…/Repositories/Stateful/AlunoFrequenciaRepository.cs` → `GetBulkParaDiarioClasse` |
| Repository de alunos | `estrutura-pedagogica/backend/…/Repositories/Base/AlunoEscolaRepository.cs` → `GetAlunosPorTurmaAtivos` |
| Filtro de turmas/disciplinas | `estrutura-pedagogica/backend/…/Repositories/Filters/FilterDiarioDeClasseRepository.cs` |
