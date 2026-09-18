# Plano de Implementação — CA-04 (Semanal) e CA-05 (Mensal)

> Card: [EFC-6412](https://gruposalta.atlassian.net/browse/EFC-6412) — Documento diário/semanal/mensal  
> Repositório: `c:/projects/frequencia`  
> Componente: `frontend/src/app/lista-presenca/lista-presenca.component.ts`

---

## Estado Atual

Os três templates já existem e estão wired na lógica do componente. O tipo é selecionado via `app-select-field` no footer e roteado por `modelosImpressoes[tipoListaSelecionada]`.

| Tipo | Template | Colunas | Orientação | Situação |
|------|----------|---------|------------|----------|
| Diária | `templates/presenca.ts` | N°, RA, Nome, Assinatura | Portrait A4 | Funcional — modelo base |
| Semanal | `templates/semanal.ts` | N°, RA, Nome, SEG–SÁB (6) | Landscape A4 | Estrutura pronta — toggle Sábado a implementar |
| Mensal | `templates/mensal.ts` | N°, RA, Nome, 1–31 | Landscape A3 | Estrutura pronta — gaps de dados |

---

## CA-04 — Lista de Presença Semanal

**Estrutura do template está pronta** (larguras confirmadas: `.linhaNome = 320px`, `.linhaRA = 50px`). Há código a escrever: toggle de Sábado e arquitetura de configurações por tipo de documento.

### Nova Funcionalidade: Configurações por Tipo de Documento

O usuário precisa conseguir ajustar parâmetros do documento **antes de imprimir**, sem trocar de tipo. O caso concreto para semanal: mostrar ou não a coluna de Sábado.

**Design proposto:**

Adicionar ao componente um objeto `configDocumento` por tipo:

```typescript
configDocumento = {
  semanal: { incluirSabado: true },
  mensal:  { /* futuro: mes/ano selecionável */ },
  diaria:  {}
};
```

Na UI (dentro do `app-footer-salvar`, visível apenas quando o tipo correspondente estiver selecionado), exibir os controles desse tipo. Ex: um toggle "Incluir Sábado" quando `tipoListaSelecionada === 'semanal'`.

No `geraHTML()`, usar `configDocumento[tipoListaSelecionada]` para:
- Ajustar `columnFill` dinamicamente (5 ou 6 para semanal)
- Remover a `<td>SÁB</td>` do cabeçalho quando desabilitado

**Impacto no template `semanal.ts`:**
- Adicionar placeholder `@colunaSabado` no `<tr>` de cabeçalho, que o componente substitui por `<td>SÁB</td>` ou `''` conforme a config

### Checklist

- [x] Larguras de coluna confirmadas (`.linhaNome = 320px`, `.linhaRA = 50px`)
- [ ] Implementar `configDocumento` no componente com `incluirSabado` para semanal
- [ ] Adicionar toggle "Incluir Sábado" na UI (visível apenas no tipo semanal)
- [ ] Ajustar `semanal.ts`: substituir `<td>SÁB</td>` por placeholder `@colunaSabado`
- [ ] Ajustar `geraHTML()`: calcular `columnFill` dinamicamente (5 ou 6) e injetar `@colunaSabado`
- [ ] Validar layout visual contra o Figma (`node-id=1164-52039`)
- [ ] Testar fluxo: tipo Semanal com e sem Sábado → verificar PDF
- [ ] Confirmar paginação com muitos alunos (`limitePrimeiraPagina: 15`, `limite: 17`)

---

## CA-05 — Lista de Presença Mensal

**Gap principal:** o cabeçalho do template tem `Mês: / Ano:` estático. Mês e ano não são injetados dinamicamente.

### 1. Adicionar placeholders ao template (`templates/mensal.ts`, linha 88–90)

```diff
- <td style="text-align: left;">
-     <strong>Mês:</strong> / <strong>Ano:</strong>
- </td>
+ <td style="text-align: left;">
+     <strong>Mês:</strong> @mes / <strong>Ano:</strong> @ano
+ </td>
```

### 2. Injetar mês e ano no `geraHTML()` (`lista-presenca.component.ts`, linha ~203)

Após as substituições de `@rede`, `@escola`, `@turma`:

```typescript
const agora = new Date();
const mes = agora.toLocaleString('pt-BR', { month: 'long' });
const ano = agora.getFullYear().toString();

element = element.replace('@mes', mes.charAt(0).toUpperCase() + mes.slice(1));
element = element.replace('@ano', ano);
```

### 3. Remover artefatos de desenvolvimento

Antes do merge para produção:

- Remover método `testarDocumentoMensal()` (componente, linha 355–381)
- Remover import `mock_lista_mensal` (linha 29)
- Deletar arquivo `mock_mensal.ts`

### Checklist

- [ ] Aplicar as alterações acima
- [ ] Validar layout visual contra o Figma
- [ ] Testar fluxo completo: selecionar turmas → tipo Mensal → Imprimir → verificar cabeçalho com mês/ano corretos
- [ ] Confirmar renderização em A3 landscape (31 colunas — tabela larga)
- [ ] Remover artefatos de desenvolvimento antes do merge

---

## Decisão em Aberto — CA-03 (Diária)

O CA-03 especifica **"colunas de marcação manual por aula do dia"**, mas o template atual (`presenca.ts`) tem uma única coluna "Assinatura".

**Opções:**
1. **Manter Assinatura** — mais simples, útil para chamada com assinatura manual. Não está alinhado com o CA literalmente.
2. **Colunas por Aula** — requer que o backend retorne o número de aulas do dia para cada turma. Maior esforço.

**Ação:** definir com PO antes de fechar o card se o CA-03 precisa ser atualizado ou se a diária precisa ser modificada.

---

## Arquivos Envolvidos

```
frontend/src/app/lista-presenca/
├── lista-presenca.component.ts      # configDocumento{}; geraHTML() — @colunaSabado, columnFill dinâmico, @mes/@ano; remover testarDocumentoMensal()
├── lista-presenca.component.html    # toggle "Incluir Sábado" (visível quando tipo = semanal)
├── templates/
│   ├── semanal.ts                   # substituir <td>SÁB</td> por placeholder @colunaSabado
│   └── mensal.ts                    # adicionar @mes/@ano no cabeçalho
└── mock_mensal.ts                   # deletar após validação
```
