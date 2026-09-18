# Solução das Subtasks de Ajuste — EFC-6381

> Gerado em: 2026-06-11 | Repositório: `notas`

---

## EFC-6447 — Subitens aparecem no primeiro select / segundo select não abre

### Causa raiz: dados incorretos no banco

O repositório `TipoTranstornoRepository.cs` (`Where(x => x.ParentId == null)`) está correto. O problema é que os subitens (TEA-N1, TEA-N2, TEA-N3, TEAP-DIS, etc.) foram inseridos com `ParentId = NULL` no banco — possivelmente porque o script `03_seed_TipoTranstorno.sql` foi aplicado antes do `05_alter_TipoTranstorno_add_hierarquia.sql` (que adiciona a coluna `ParentId`), ou porque uma versão anterior do seed não setava `ParentId`.

Com todos os itens tendo `ParentId = NULL`, o repositório retorna tudo como raiz. Para TEA/TEAp, `pai.subitens` fica vazio e o segundo select nunca aparece.

### Fix: script de correção de dados (sem mudança de código)

```sql
-- 1. Limpar dados incorretos (preserva outros campos do NEE)
-- cards/EFC-6379/sql/04_clean_TipoTranstorno.sql

-- 2. Recarregar com hierarquia correta
-- cards/EFC-6379/sql/03_seed_TipoTranstorno.sql
```

⚠️ O script `04` zera `TipoTranstorno` e `TipoTranstornoOutro` em todos os registros NEE — aceitável em homolog.  
Para produção: criar script de UPDATE que seta `ParentId` sem deletar dados.

---

## EFC-6448 — Descrição do tipo "Outros" não aparece após salvamento

### Causa raiz: ordem de operações em `preencherCampoTipoTranstorno`

Em `edicao-nee.component.ts` (linha 197–222), para registros com tipo=OUTROS a sequência é:
1. `tipoTranstornoPaiId.setValue(X, { emitEvent: false })` — sem emit, mas valor definido
2. `tipoTranstornoOutro.setValidators(required)`
3. `tipoTranstornoOutro.updateValueAndValidity()` ← **sem** `{ emitEvent: false }` → emite `valueChanges` com valor `null`, dispara change detection → Angular cria o `app-text-field` via `*ngIf` chamando `writeValue(null)`
4. Só então, linha 222: `tipoTranstornoOutro.setValue(texto)`

O campo é criado com `null` antes do valor ser definido, podendo resultar em exibição vazia.

### Fix: `edicao-nee.component.ts`

Mover `setValue(tipoTranstornoOutro)` para o **início** do método, antes de qualquer setter:

```typescript
private preencherCampoTipoTranstorno(): void {
  // Definir valor ANTES de qualquer emissão
  this.formulario.get('tipoTranstornoOutro').setValue(
    this.aluno?.tipoTranstornoOutro ?? null,
    { emitEvent: false }
  );

  if (this.aluno?.tipoTranstorno) {
    const paiId = this.aluno.tipoTranstorno.parentId ?? this.aluno.tipoTranstorno.id;
    const pai = this.tiposTranstorno.find(t => t.id === paiId);
    this.subtiposDisponiveis = pai?.subitens ?? [];
    this.formulario.get('tipoTranstornoPaiId').setValue(paiId, { emitEvent: false });
    this.formulario.get('tipoTranstornoId').setValue(this.aluno.tipoTranstorno.id, { emitEvent: false });
    if (this.subtiposDisponiveis.length > 0) {
      this.formulario.get('tipoTranstornoId').setValidators(Validators.required);
      this.formulario.get('tipoTranstornoId').updateValueAndValidity({ emitEvent: false });
    }
    if (pai?.codigo === 'OUTROS') {
      this.formulario.get('tipoTranstornoOutro').setValidators(Validators.required);
      this.formulario.get('tipoTranstornoOutro').updateValueAndValidity({ emitEvent: false }); // ← add
    }
  } else if (this.aluno?.tipoTranstornoOutro) {
    const outros = this.tiposTranstorno.find(t => t.codigo === 'OUTROS');
    if (outros) {
      this.formulario.get('tipoTranstornoPaiId').setValue(outros.id, { emitEvent: false });
      this.formulario.get('tipoTranstornoId').setValue(outros.id, { emitEvent: false });
      this.formulario.get('tipoTranstornoOutro').setValidators(Validators.required);
      this.formulario.get('tipoTranstornoOutro').updateValueAndValidity({ emitEvent: false }); // ← add
    }
  }
  // REMOVER a antiga linha 222 (movida para o início)
}
```

**Arquivo**: `notas/frontend/.../edicao-nee/edicao-nee.component.ts`

---

## EFC-6449 — Campo diagnóstico editável em casos legados

### Causa raiz: condição de somente leitura não implementada

A especificação da EFC-6381 define: "exibir `Diagnostico` (legado) como somente-leitura se `TipoTranstornoId = null`." O template exibe um `<small>` com o diagnóstico anterior como referência (linha 59-61), mas o `app-text-field` principal continua editável.

Registro legado = `aluno.diagnostico != null && aluno.tipoTranstorno == null`.

### Fix: `edicao-nee.component.ts` — desabilitar controle para legados

Em `updateFormValues()`, após `this.formulario.get('diagnostico').setValue(...)`:

```typescript
if (this.aluno.diagnostico && !this.aluno.tipoTranstorno) {
  this.formulario.get('diagnostico').disable();
}
```

`save()` usa `formulario.getRawValue()` (linha 282), que inclui controles desabilitados — o valor legado é preservado no envio sem perda de dados.

**Arquivo**: `notas/frontend/.../edicao-nee/edicao-nee.component.ts`

---

## EFC-6450 — Erro ao exportar dados NEE

### Causa raiz: migração não aplicada + export desatualizado

A query `NecessidadesEspeciaisExport_Get.sql` referencia `AlNeEs.TipoMediacao` no SELECT e GROUP BY. Se o script `02_alter_AlunoNecessidadesEspeciais.sql` não foi aplicado no ambiente atual, a query falha com `Invalid column name 'TipoMediacao'`.

Além disso, o export não expõe os novos campos de tipação (CA-05 da EFC-6381).

### Fix em 3 partes

**1. Verificar/aplicar migração**

```sql
-- Verificar se colunas existem:
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'AlunoNecessidadesEspeciais'
  AND COLUMN_NAME IN ('TipoMediacao', 'TipoTranstorno', 'TipoTranstornoOutro', 'PossuiLaudoStatus');

-- Se não existirem, aplicar:
-- cards/EFC-6379/sql/02_alter_AlunoNecessidadesEspeciais.sql
```

**2. Atualizar `NecessidadesEspeciaisExport_Get.sql`**

```sql
-- Após o LEFT JOIN AlunoNecessidadesEspeciais, adicionar:
LEFT JOIN TipoTranstorno AS TipoTr ON TipoTr.Id = AlNeEs.TipoTranstorno

-- Adicionar no SELECT:
, ISNULL(TipoTr.Codigo + ' — ' + TipoTr.Descricao, AlNeEs.Diagnostico) AS TipoTranstornoExibicao
, AlNeEs.TipoTranstornoOutro                                             AS TipoTranstornoOutro
, CASE WHEN AlNeEs.PossuiLaudoStatus = 1 THEN 'Sim'
       WHEN AlNeEs.PossuiLaudoStatus = 0 THEN 'Não'
       WHEN AlNeEs.PossuiLaudoStatus = 2 THEN 'Em Avaliação'
       ELSE 'Não informado'
  END                                                                    AS PossuiLaudo

-- Adicionar no GROUP BY:
, TipoTr.Codigo, TipoTr.Descricao
, AlNeEs.TipoTranstornoOutro
, AlNeEs.PossuiLaudoStatus
```

**3. Atualizar DTO e Service**

`NecessidadeEducacionaisEspecificasExportResponse.cs`:
```csharp
public string TipoTranstornoExibicao { get; set; }
public string TipoTranstornoOutro { get; set; }
public string PossuiLaudo { get; set; }
```

`NeeGetRelatorioExportService.cs` — `GetDataTableExport()`:
```csharp
dataTable.Columns.Add("Tipo de Transtorno", typeof(string));
dataTable.Columns.Add("Observação (Outros)", typeof(string));
dataTable.Columns.Add("Possui Laudo", typeof(string));

// No foreach (após TipoMediacao):
item.TipoTranstornoExibicao,
item.TipoTranstornoOutro,
item.PossuiLaudo,
```

---

## Ordem de Execução

| # | Ação | Tipo |
|---|------|------|
| 1 | Verificar e aplicar `02_alter_AlunoNecessidadesEspeciais.sql` se necessário | SQL/homolog |
| 2 | Executar `04_clean_TipoTranstorno.sql` | SQL/homolog |
| 3 | Executar `03_seed_TipoTranstorno.sql` | SQL/homolog |
| 4 | Corrigir `edicao-nee.component.ts` (EFC-6448 + EFC-6449) | Frontend |
| 5 | Corrigir SQL + DTO + Service de exportação (EFC-6450) | Backend |

---

## Checklist de Verificação

- [ ] **EFC-6447**: Abrir form NEE → selecionar TEA → segundo select aparece com "TEA Nível 1/2/3"
- [ ] **EFC-6447**: Selecionar TEAp → segundo select aparece com "Dislexia / Discalculia / Disgrafia / Disortografia"
- [ ] **EFC-6448**: Criar NEE com OUTROS + texto descritivo → salvar → reabrir → texto aparece preenchido
- [ ] **EFC-6449**: Abrir NEE de aluno legado (tem `diagnostico`, sem `tipoTranstorno`) → campo diagnóstico não é editável
- [ ] **EFC-6450**: Clicar "Exportar" na tela NEE → Excel gerado sem erro, com colunas "Tipo de Transtorno", "Observação (Outros)", "Possui Laudo"
