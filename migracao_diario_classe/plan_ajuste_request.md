# Plano: remover flags `Exibir*` de `DiarioDeClasseDocumentoRequest`

**Contexto:** [`ajuste_request_get.md`](./ajuste_request_get.md)  
**Repositório:** `estrutura-pedagogica`

---

## Tarefa 1 — `DiarioDeClasseDocumentoRequest.cs`

**Arquivo:** `backend/EstruturaPedagogica.Domain/DTO/DiarioDeClasse/DiarioDeClasseDocumentoRequest.cs`

**Remover** as linhas 18–21:

```csharp
// remover:
public bool ExibirNomeProfessor       { get; set; }
public bool ExibirFrequencia          { get; set; }
public bool ExibirConteudoMinistrado  { get; set; }
public bool ExibirRelatorioRendimento { get; set; }
```

**Resultado esperado:**

```csharp
public class DiarioDeClasseDocumentoRequest
{
   public Guid? HashAnoLetivo  { get; set; }
   public Guid? HashRede       { get; set; }
   public Guid? HashEscola     { get; set; }
   public Guid? HashSerie      { get; set; }
   public Guid? HashTurma      { get; set; }
   public Guid? HashDisciplina { get; set; }

   public DateTime DataInicio  { get; set; }
   public DateTime DataTermino { get; set; }
}
```

---

## Tarefa 2 — `DiarioDeClasseInternalGetRequest.cs`

**Arquivo:** `backend/EstruturaPedagogica.Domain/DTO/DiarioDeClasse/DiarioDeClasseInternalGetRequest.cs`

**Remover** as linhas 21–24:

```csharp
// remover:
public bool ExibirNomeProfessor       { get; set; }
public bool ExibirFrequencia          { get; set; }
public bool ExibirConteudoMinistrado  { get; set; }
public bool ExibirRelatorioRendimento { get; set; }
```

---

## Tarefa 3 — `GetDocumentoDiarioDeClasseService.cs`

**Arquivo:** `backend/EstruturaPedagogica.Domain.Services/DiarioDeClasse/GetDocumentoDiarioDeClasseService.cs`

São 3 ajustes pontuais:

### 3a — Nome do professor (linha 75)

**Antes:**
```csharp
result.Data.NomeProfessor = request.ExibirNomeProfessor
   ? await _professorTurmaDisciplinaRepository.GetNomeProfessorDaTurma(turmaId, disciplina.Id)
   : null;
```

**Depois:**
```csharp
result.Data.NomeProfessor = await _professorTurmaDisciplinaRepository.GetNomeProfessorDaTurma(turmaId, disciplina.Id);
```

### 3b — Grade de chamadas (linha 111)

**Antes:**
```csharp
var chamadas = request.ExibirFrequencia
   ? aulas.Select(aula =>
      {
         var freq = frequencias.FirstOrDefault(f =>
            f.PessoaId       == aluno.PessoaId
            && f.DataAula.Date == aula.DataAula.Date
            && f.TurnoId      == aula.TurnoId
            && (f.Tempo == aula.Tempo || f.Tempo == null));

         if (freq == null) return caracterPendencia;
         return freq.EhPresenca ? caracterPresenca : caracterFalta;
      }).ToList()
   : new List<string>();
```

**Depois** (remove o ternário, mantém só o `Select`):
```csharp
var chamadas = aulas.Select(aula =>
   {
      var freq = frequencias.FirstOrDefault(f =>
         f.PessoaId       == aluno.PessoaId
         && f.DataAula.Date == aula.DataAula.Date
         && f.TurnoId      == aula.TurnoId
         && (f.Tempo == aula.Tempo || f.Tempo == null));

      if (freq == null) return caracterPendencia;
      return freq.EhPresenca ? caracterPresenca : caracterFalta;
   }).ToList();
```

### 3c — Conteúdo ministrado (linha 134)

**Antes:**
```csharp
if (request.ExibirConteudoMinistrado)
{
   result.Data.Conteudos = await _conteudoRepository.GetParaDiarioClasse(
      request.HashTurma.Value, request.HashDisciplina.Value,
      request.DataInicio, request.DataTermino);
}
```

**Depois** (remove o `if`, sempre busca):
```csharp
result.Data.Conteudos = await _conteudoRepository.GetParaDiarioClasse(
   request.HashTurma.Value, request.HashDisciplina.Value,
   request.DataInicio, request.DataTermino);
```

### 3d — Relatório de rendimento (linha 142)

**Antes:**
```csharp
if (request.ExibirRelatorioRendimento
    && request.HashAnoLetivo.HasValue
    && redeId > 0
    && request.HashSerie.HasValue)
```

**Depois** (remove apenas a flag, mantém as outras condições):
```csharp
if (request.HashAnoLetivo.HasValue
    && redeId > 0
    && request.HashSerie.HasValue)
```

---

## Tarefa 4 — `diario-de-classe.model.ts`

**Arquivo:** `frontend/src/app/features/diario-de-classe/models/diario-de-classe.model.ts`

**Remover** as linhas 10–13 da interface `DiarioDeClasseDocumentoRequest`:

```ts
// remover:
exibirNomeProfessor:       boolean;
exibirFrequencia:          boolean;
exibirConteudoMinistrado:  boolean;
exibirRelatorioRendimento: boolean;
```

**Resultado esperado:**

```ts
export interface DiarioDeClasseDocumentoRequest {
  hashAnoLetivo:  string | null;
  hashRede:       string | null;
  hashEscola:     string | null;
  hashSerie:      string | null;
  hashTurma:      string | null;
  hashDisciplina: string | null;
  dataInicio:     string;
  dataTermino:    string;
}
```

---

## Tarefa 5 — `listar.component.ts`

**Arquivo:** `frontend/src/app/features/diario-de-classe/listar/listar.component.ts`

**Remover** as linhas 153–156 do método `buildRequest()`:

```ts
// remover:
exibirNomeProfessor: this.secoes.exibirNomeProfessor,
exibirFrequencia: this.secoes.exibirFrequencia,
exibirConteudoMinistrado: this.secoes.exibirConteudoMinistrado,
exibirRelatorioRendimento: this.secoes.exibirRelatorioRendimento,
```

**Resultado esperado:**

```ts
private buildRequest(fv: any): DiarioDeClasseDocumentoRequest {
  return {
    hashAnoLetivo: fv.hashAnoLetivo || null,
    hashRede: fv.hashRede || null,
    hashEscola: fv.hashEscola || null,
    hashSerie: fv.hashSerie || null,
    hashTurma: fv.hashTurma || null,
    hashDisciplina: fv.hashDisciplina || null,
    dataInicio: fv.dataInicio,
    dataTermino: fv.dataTermino,
  };
}
```

> As condicionais em `buildBundle()` (linhas 249, 263, 278, 291, 299) **não mudam** — continuam usando `this.secoes` para controlar a renderização.

---

## Tarefa 6 — `diario-documento-storage.service.ts`

**Arquivo:** `frontend/src/app/features/diario-de-classe/services/diario-documento-storage.service.ts`

**Antes** (método `buildRequestKey`, linhas 80–91):
```ts
private buildRequestKey(req: DiarioDeClasseDocumentoRequest): string {
  const {
    hashAnoLetivo, hashRede, hashEscola, hashSerie, hashTurma, hashDisciplina,
    dataInicio, dataTermino,
    exibirNomeProfessor, exibirFrequencia, exibirConteudoMinistrado, exibirRelatorioRendimento,
  } = req;
  return JSON.stringify({
    hashAnoLetivo, hashRede, hashEscola, hashSerie, hashTurma, hashDisciplina,
    dataInicio, dataTermino,
    exibirNomeProfessor, exibirFrequencia, exibirConteudoMinistrado, exibirRelatorioRendimento,
  });
}
```

**Depois** (remove as 4 flags do destructuring e do objeto):
```ts
private buildRequestKey(req: DiarioDeClasseDocumentoRequest): string {
  const {
    hashAnoLetivo, hashRede, hashEscola, hashSerie, hashTurma, hashDisciplina,
    dataInicio, dataTermino,
  } = req;
  return JSON.stringify({
    hashAnoLetivo, hashRede, hashEscola, hashSerie, hashTurma, hashDisciplina,
    dataInicio, dataTermino,
  });
}
```

> **Nota:** documentos em cache gerados antes desta mudança terão `requestKey` incompatível com os novos — serão ignorados (não encontrados por `findByRequest`) e expirarão naturalmente pelo TTL de 2h.

---

## Ordem de execução

```
1 → 2 → 3 → build backend → 4 → 5 → 6 → build frontend
```

Backend e frontend podem ser feitos em paralelo após as tarefas 1–2 e 4, respectivamente.
