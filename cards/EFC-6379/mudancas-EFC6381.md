# Mudanças EFC-6381 — Decisão do PO (2026-06-08)

## O que mudou

O PO definiu que a lista de necessidades **não usa CIDs** — é uma lista curada e fixada pela equipe pedagógica. Dois itens (TEA e TEAp) têm **subitens obrigatórios**: o usuário não pode salvar apenas "TEA", deve escolher o nível (Nível 1, 2 ou 3). O mesmo vale para TEAp (Dislexia, Discalculia, Disgrafia, Disortografia).

---

## Impacto nos scripts SQL

### `01_create_TipoTranstorno.sql` — **atualizado**

Adicionados dois campos à tabela:

| Campo    | Tipo    | Descrição |
|----------|---------|-----------|
| `ParentId` | INT NULL | FK self-referencing para o item pai. NULL = item raiz. |
| `Ordem`  | INT NOT NULL DEFAULT 0 | Ordenação para exibição no frontend. |

A constraint `UQ_TipoTranstorno_Codigo` se mantém — cada subitem tem código próprio (ex: `TEA-N1`, `TEAP-DIS`).

### `03_seed_TipoTranstorno.sql` — **reescrito**

Seed anterior (CIDs) descartado. Novo seed em 3 passos:
1. Insere os 14 itens raiz (ParentId = NULL)
2. Insere subitens de TEA (TEA-N1, TEA-N2, TEA-N3) com ParentId = Id do TEA
3. Insere subitens de TEAp (TEAP-DIS, TEAP-DCA, TEAP-DGF, TEAP-DOT) com ParentId = Id do TEAp

### `02_alter_AlunoNecessidadesEspeciais.sql` — **sem mudança**

A coluna `[TipoTranstorno] INT NULL` continua igual. O FK sempre aponta para o item mais específico selecionado (o subitem, quando houver). Não há mudança de estrutura.

---

## Impacto no backend

### Entidade `TipoTranstorno.cs`

```csharp
public class TipoTranstorno : StatefulEntity
{
    public virtual string Codigo { get; set; }
    public virtual string Descricao { get; set; }
    public virtual int? ParentId { get; set; }
    public virtual int Ordem { get; set; }

    // navigation
    public virtual TipoTranstorno Parent { get; set; }
    public virtual ICollection<TipoTranstorno> Subitens { get; set; }
}
```

### Mapping `TipoTranstornoMap.cs`

```csharp
HasOptional(x => x.Parent).WithMany(x => x.Subitens).HasForeignKey(x => x.ParentId);
```

### DTO `TipoTranstornoResponse.cs`

```csharp
public class TipoTranstornoResponse
{
    public int Id { get; set; }
    public string Codigo { get; set; }
    public string Descricao { get; set; }
    public List<TipoTranstornoResponse> Subitens { get; set; }
}
```

### Endpoint `GET /tipo-transtorno`

Retorna **apenas itens raiz** com `Subitens` preenchidos. A query deve:
- Filtrar `ParentId IS NULL`
- Fazer eager load de `Subitens` ordenado por `Ordem`

```csharp
// no repositório
return QueryableAtivos()
    .Where(x => x.ParentId == null)
    .OrderBy(x => x.Ordem)
    .Include(x => x.Subitens.Where(s => s.Ativo).OrderBy(s => s.Ordem))
    .ToList();
```

> Projeto `notas` usa **EF Core 8** (`Microsoft.EntityFrameworkCore` 8.0.22) — filtered includes são suportados nativamente.

---

## Impacto no frontend

### Comportamento do campo "tipo de transtorno"

O frontend recebe a lista em formato de árvore. A lógica de exibição:

```
se item selecionado tem Subitens.length > 0
  → exibir segundo select "Subtipo" com os subitens
  → salvar TipoTranstornoId = subitem selecionado (NÃO o pai)
  → campo "Subtipo" é obrigatório
senão
  → salvar TipoTranstornoId = item selecionado diretamente
```

O campo `TipoTranstornoOutro` (texto livre) só aparece quando `Codigo === 'OUTROS'`.

### Template sugerido (`edicao-nee.component.html`)

```html
<!-- Select principal -->
<mat-select formControlName="tipoTranstorno" (selectionChange)="onTipoTranstornoChange($event)">
  <mat-option *ngFor="let tipo of tiposTranstorno" [value]="tipo">
    {{ tipo.descricao }}
  </mat-option>
</mat-select>

<!-- Select de subtipo — aparece quando o pai tem subitens -->
<mat-select *ngIf="subtiposDisponiveis.length > 0" formControlName="subtipo">
  <mat-option *ngFor="let sub of subtiposDisponiveis" [value]="sub.id">
    {{ sub.descricao }}
  </mat-option>
</mat-select>

<!-- Texto livre — aparece apenas para OUTROS -->
<mat-form-field *ngIf="tipoTranstornoSelecionado?.codigo === 'OUTROS'">
  <input matInput formControlName="tipoTranstornoOutro" placeholder="Descreva a necessidade">
</mat-form-field>
```

### Lógica no componente (`edicao-nee.component.ts`)

```typescript
tiposTranstorno: TipoTranstornoResponse[] = [];
subtiposDisponiveis: TipoTranstornoResponse[] = [];
tipoTranstornoSelecionado: TipoTranstornoResponse | null = null;

onTipoTranstornoChange(tipo: TipoTranstornoResponse): void {
  this.tipoTranstornoSelecionado = tipo;
  this.subtiposDisponiveis = tipo.subitens ?? [];
  this.form.patchValue({ subtipo: null, tipoTranstornoOutro: null });

  // se tem subitens, o TipoTranstornoId real virá do subtipo
  // se não tem, salvar o próprio id do pai
  if (this.subtiposDisponiveis.length === 0) {
    this.form.patchValue({ tipoTranstornoId: tipo.id });
  }
}

onSubtipoChange(subtipoId: number): void {
  this.form.patchValue({ tipoTranstornoId: subtipoId });
}
```

### Retrocompatibilidade (registros com `Diagnostico` legado)

Não muda — se `TipoTranstornoId = null`, exibir `Diagnostico` como somente-leitura (definido no plano original).

Para registros com `TipoTranstornoId` preenchido mas `ParentId != null` (subitem), ao carregar o formulário:
1. Buscar o item pelo id
2. Se `parentId != null`, pré-selecionar o pai no primeiro select e o subitem no segundo

---

## Resumo de arquivos a criar/alterar

| Arquivo | Ação |
|---------|------|
| `cards/EFC-6379/sql/01_create_TipoTranstorno.sql` | Atualizado — `ParentId` + `Ordem` |
| `cards/EFC-6379/sql/03_seed_TipoTranstorno.sql` | Reescrito — lista PO com subitens |
| `Notas.Domain/Entities/Base/TipoTranstorno.cs` | Adicionar `ParentId`, `Ordem`, `Parent`, `Subitens` |
| `Notas.Infra/Mapping/Base/TipoTranstornoMap.cs` | Mapear self-referencing FK |
| `Notas.Domain/DTO/TipoTranstorno/TipoTranstornoResponse.cs` | Adicionar `List<TipoTranstornoResponse> Subitens` |
| `TipoTranstornoRepository.cs` (ou serviço) | Query: raiz com eager load de subitens, ordenado por `Ordem` |
| `edicao-nee.component.ts` + template | Lógica de dois selects condicionais |
