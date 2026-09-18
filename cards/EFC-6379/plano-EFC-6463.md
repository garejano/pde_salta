# Plano Técnico — EFC-6463

> Gerado em: 2026-06-12 | Repositório: `notas`

---

## Causa Raiz

**Arquivo:** `detalhes-nee.component.html` — linhas 176-182  
**Contexto:** `edicao-nee.component.ts` — `preencherCampoTipoTranstorno()` (linhas 200-227) — comportamento secundário a verificar.

---

### Problema principal — detalhes-nee.component.html

O template exibe `tipoTranstornoOutro` apenas quando `!aluno.tipoTranstorno`:

```html
<span *ngIf="aluno.tipoTranstorno">
    {{ aluno.tipoTranstorno.codigo }} — {{ aluno.tipoTranstorno.descricao }}
</span>
<span *ngIf="!aluno.tipoTranstorno && aluno.tipoTranstornoOutro">
    {{ aluno.tipoTranstornoOutro }}
</span>
```

Quando o usuário seleciona OUTROS e salva:
- Backend salva `TipoTranstornoId = <id do OUTROS>` e `TipoTranstornoOutro = "Dislalia"`
- GET retorna `tipoTranstorno = { id, codigo: 'OUTROS', descricao: 'Outros' }` e `tipoTranstornoOutro = "Dislalia"`
- No template: `aluno.tipoTranstorno` **é verdadeiro** → primeiro `<span>` exibe "OUTROS — Outros"
- `!aluno.tipoTranstorno` é **falso** → segundo `<span>` NUNCA é renderizado
- Resultado: o texto "Dislalia" nunca aparece na tela de detalhes

**Esta é a causa exata do "não aparece após salvamento"** — o usuário salva, é redirecionado para `Nee.Detalhes` via `voltar()`, e a descrição digitada não é exibida em lugar nenhum.

---

### Comportamento secundário — formulário de edição

O fix do EFC-6448 está aplicado corretamente (`preencherCampoTipoTranstorno` seta o valor primeiro na linha 201). O formulário de edição deve exibir o texto ao reabrir. Verificar em homolog antes de fechar.

Mecanismo atual:
1. `tipoTranstornoOutro.setValue(aluno.tipoTranstornoOutro, { emitEvent: false })` — valor no model
2. `tipoTranstornoPaiId.setValue(OUTROS.id, { emitEvent: false })` — sem emissão de evento
3. `tipoTranstornoSelecionadoEhOutros()` → true → campo renderizado com valor correto via `[formControl]`

Se o formulário ainda não exibir, verificar a seção "Diagnóstico" abaixo.

---

## Fix

### Fix 1 — `detalhes-nee.component.html` (obrigatório)

**Arquivo:** `notas/frontend/src/app/pages/necessidades-educacionais-especiais/detalhes-nee/detalhes-nee.component.html`

**Trecho atual (linhas ~176-182):**
```html
<div class="details-item" *ngIf="aluno.condicaoMedica">
    <span class="detalhes-titulo">Tipo de transtorno:</span>
    <span *ngIf="aluno.tipoTranstorno">
        {{ aluno.tipoTranstorno.codigo }} — {{ aluno.tipoTranstorno.descricao }}
    </span>
    <span *ngIf="!aluno.tipoTranstorno && aluno.tipoTranstornoOutro">
        {{ aluno.tipoTranstornoOutro }}
    </span>
    <span *ngIf="!aluno.tipoTranstorno && !aluno.tipoTranstornoOutro">Não informado</span>
</div>
```

**Trecho corrigido:**
```html
<div class="details-item" *ngIf="aluno.condicaoMedica">
    <span class="detalhes-titulo">Tipo de transtorno:</span>
    <span *ngIf="aluno.tipoTranstorno && aluno.tipoTranstorno.codigo !== 'OUTROS'">
        {{ aluno.tipoTranstorno.codigo }} — {{ aluno.tipoTranstorno.descricao }}
    </span>
    <span *ngIf="aluno.tipoTranstorno?.codigo === 'OUTROS' || (!aluno.tipoTranstorno && aluno.tipoTranstornoOutro)">
        {{ aluno.tipoTranstornoOutro || 'Não especificado' }}
    </span>
    <span *ngIf="!aluno.tipoTranstorno && !aluno.tipoTranstornoOutro">Não informado</span>
</div>
```

**Comportamentos cobertos pelo fix:**

| Cenário | Antes | Depois |
|---------|-------|--------|
| OUTROS selecionado com texto "Dislalia" | Exibe "OUTROS — Outros" (texto perdido) | Exibe "Dislalia" ✓ |
| OUTROS sem texto (campo vazio) | Exibe "OUTROS — Outros" | Exibe "Não especificado" ✓ |
| Legado: `tipoTranstorno=null`, `tipoTranstornoOutro="texto"` | Exibe "texto" | Exibe "texto" ✓ (sem regressão) |
| Qualquer outro transtorno (ex: TDAH) | Exibe "TDAH — Transtorno do Déficit..." | Exibe "TDAH — Transtorno do Déficit..." ✓ (sem regressão) |
| Sem transtorno informado | Exibe "Não informado" | Exibe "Não informado" ✓ (sem regressão) |

---

## Checklist de Verificação

### Fluxo completo (criar NEE com OUTROS)
- [ ] Abrir formulário NEE de aluno sem NEE cadastrado
- [ ] Selecionar "OUTROS" no tipo de transtorno
- [ ] Preencher campo de texto (ex: "Dislalia")
- [ ] Salvar → tela de detalhes abre
- [ ] **Na tela de detalhes:** campo "Tipo de transtorno" exibe "Dislalia" ✓

### Fluxo de edição (reabrir NEE com OUTROS)
- [ ] Abrir formulário de edição de NEE que já tem OUTROS + texto
- [ ] Campo "tipo de transtorno" = OUTROS selecionado
- [ ] Campo de texto aparece preenchido com o valor salvo ✓
- [ ] Salvar sem alteração → tela de detalhes ainda exibe o texto ✓

### Sem regressão
- [ ] Abrir NEE com TDAH (transtorno sem subitens): detalhes exibe "TDAH — Transtorno do Déficit..."
- [ ] Abrir NEE com TEA Nível 1 (com subitem): detalhes exibe corretamente
- [ ] Abrir NEE legado (campo `Diagnostico`, sem `tipoTranstorno`): detalhes exibe texto legado

---

## Diagnóstico (se o formulário de edição também não exibir)

Caso o formulário de edição (`edicao-nee.component.ts`) também não exiba `tipoTranstornoOutro` após salvar e reabrir, verificar no browser:

**1. Verificar payload de save (aba Network):**
```
POST /necessidadeseducativasespeciais/...
Payload: { tipoTranstornoId: <id>, tipoTranstornoOutro: "Dislalia", ... }
```
Se `tipoTranstornoOutro` vier como `null` ou ausente → bug no envio do formulário.

**2. Verificar resposta do GET (aba Network):**
```
Response: { tipoTranstorno: { id, codigo: "OUTROS" }, tipoTranstornoOutro: "Dislalia" }
```
Se `tipoTranstornoOutro` vier como `null` → bug no backend (salvar ou retornar).

**3. Verificar form control no console:**
```typescript
// No devtools, após carregarDados():
component.formulario.get('tipoTranstornoOutro').value
// Esperado: "Dislalia"
```
Se for `null` → algum event chain sobrescreveu o valor após `preencherCampoTipoTranstorno()`.

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `detalhes-nee/detalhes-nee.component.html` | Corrigir condição de exibição de `tipoTranstornoOutro` para OUTROS |

Nenhuma alteração de backend necessária — o dado está sendo salvo e retornado corretamente.
