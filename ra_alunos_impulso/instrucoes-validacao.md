# Instruções: Geração de RA Impulso ENEM2 (Homolog → Produção)

## Arquivos

| Arquivo | Para que serve |
|---------|---------------|
| `_scripts/resolve_ids_ra_impulso.sql` | Roda no banco → exportar como CSV |
| `_scripts/YYYY-MM-DD_to_ra_manual_homolog.csv` | CSV gerado a partir do homolog |
| `_scripts/YYYY-MM-DD_to_ra_manual_producao.csv` | CSV gerado a partir da produção |
| `_scripts/gerar_ra_impulso_enem2.py` | Lê o CSV + planilha → gera o SQL de INSERT |
| `_scripts/ra_alunos_impulso_enem2.sql` | SQL de INSERT gerado — rodar no banco |

---

## Fluxo completo

```
                ┌─────────────────────────────────────┐
                │  resolve_ids_ra_impulso.sql          │
                │  (rodar em cada ambiente)            │
                └────────────┬────────────────────────┘
                             │ exportar resultado (Query 1)
                             ▼
              YYYY-MM-DD_to_ra_manual_<env>.csv
                             │
                             ▼
              gerar_ra_impulso_enem2.py
              --ra-start <ProximoRA da Query 2>
              --env homolog | producao
                             │
                             ▼
              ra_alunos_impulso_enem2.sql  ──► rodar no banco
```

---

## Passo a Passo

### 1. Rodar o SQL de resolução no banco

Abrir `_scripts/resolve_ids_ra_impulso.sql` e executar as **duas queries**:

**Query 1** (retorna o mapeamento escola/turma → IDs):
- Exportar resultado como CSV
- Nomear: `YYYY-MM-DD_to_ra_manual_homolog.csv` ou `_producao.csv`
- Salvar em `_scripts/`

**Query 2** (retorna o próximo RA):
- Anotar o valor de `proximo_ra` — será usado como `--ra-start`

### 2. Gerar o SQL de INSERT

```powershell
cd c:\projects\pde_salta

# Usando homolog
python _scripts/gerar_ra_impulso_enem2.py --ra-start <ProximoRA> --env homolog

# Usando produção
python _scripts/gerar_ra_impulso_enem2.py --ra-start <ProximoRA> --env producao

# Passando o CSV diretamente
python _scripts/gerar_ra_impulso_enem2.py --ra-start 90929456 --csv _scripts/2026-05-28_to_ra_manual_producao.csv
```

O script:
- Detecta automaticamente o CSV mais recente que casa com `--env`
- Lê os IDs do CSV (escola_id e turma_id vêm do banco, não hardcoded)
- Gera `_scripts/ra_alunos_impulso_enem2.sql`

### 3. Verificar a saída

O script imprime no terminal:
```
CSV:         _scripts/2026-05-28_to_ra_manual_homolog.csv
Ambiente:    homolog
RA inicial:  90929456
Mapeamentos carregados do CSV: 52
Alunos na planilha: 118
Mapeados:     118 / 118
Nao mapeados: 0
RAs usados:   90929456 -> 90929573
SQL gerado:   _scripts/ra_alunos_impulso_enem2.sql
```

Se `Nao mapeados > 0`, ver seção **Troubleshooting** abaixo.

### 4. Executar o SQL no banco

Rodar `_scripts/ra_alunos_impulso_enem2.sql`. As queries são idempotentes.

---

## Troubleshooting: alunos não mapeados

O script lista as chaves normalizadas que não encontrou no CSV, ex:
```
[ESCOLA X] 'Turma Y' -> chave: ('ESCOLA X', 'TURMA NORM')
```

**Causas possíveis:**

| Causa | Solução |
|-------|---------|
| Escola/turma nova na planilha sem linha no SQL | Adicionar a linha em `resolve_ids_ra_impulso.sql` e reger o CSV |
| CSV gerado do ambiente errado | Usar `--env producao` ou `--csv` com o arquivo correto |
| Turma com nome diferente em produção | Ver seção abaixo |

---

## Se a turma tiver nome diferente em produção

O SQL de resolução (`resolve_ids_ra_impulso.sql`) junta pelo **nome exato** da turma no banco.
Se em produção uma turma tiver nome diferente, ela não vai aparecer no CSV e o aluno ficará como não mapeado.

**Como corrigir:**

1. Identificar qual é o nome correto em produção:

```sql
SELECT t.Id, t.Nome
FROM Turma t
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
INNER JOIN Escola e ON e.Id = es.Escola
WHERE e.Nome = 'NOME DA ESCOLA'
  AND es.AnoLetivo = 2026
  AND t.Nome LIKE '2%rie%'   -- ajustar o filtro
ORDER BY t.Nome
```

2. Atualizar a linha correspondente no `resolve_ids_ra_impulso.sql`:

```sql
-- antes:
('ESCOLA X', 'chave_norm', 'ESCOLA X', N'2ª Série Regular A - M'),

-- depois (com o nome correto de produção):
('ESCOLA X', 'chave_norm', 'ESCOLA X', N'Nome Correto Em Producao'),
```

3. Rerodar o SQL → exportar CSV → rerodar o gerador.

---

## Instruções para a IA

> Esta seção descreve como a IA deve agir quando o usuário trouxer resultados
> de produção ou relatar alunos não mapeados.

### Cenário A — Usuário cola resultado do SQL de resolução

O resultado da Query 1 tem colunas:
`escola_norm, turma_norm, escola_id, turma_id, turma_nome_banco`

A IA deve:
1. Comparar a contagem de linhas retornadas com o esperado (52 linhas)
2. Identificar linhas faltando (escola/turma que não deu match no JOIN)
3. Para cada linha faltando: perguntar o nome correto da turma no ambiente
4. Atualizar `resolve_ids_ra_impulso.sql` com o nome correto
5. Orientar o usuário a rerodar o SQL e exportar novo CSV

### Cenário B — Usuário relata "Nao mapeados: N"

A saída do script mostra as chaves normalizadas que faltaram no CSV, ex:
```
[UNIDADE POLO] '2ª Série Regular' -> chave: ('UNIDADE POLO', '2o SERIE REGULAR')
```

A IA deve:
1. Verificar se essa chave existe no `resolve_ids_ra_impulso.sql` (nos VALUES)
2. Se existe → o JOIN falhou → o nome da turma no banco é diferente
3. Ajudar a descobrir o nome correto via query (ver query acima)
4. Atualizar o SQL e orientar reexecução

### Cenário C — Usuário quer adicionar novas escolas/turmas

Para cada nova combinação (escola_planilha, turma_planilha):

1. Descobrir a chave normalizada:
   - `escola_norm`: nome em caixa alta sem acento, sem espaço no final
   - `turma_norm`: mesma regra + substituir `º`/`ª`/`°` por `o`

2. Descobrir o nome exato da escola e turma no banco:

```sql
SELECT e.Id, e.Nome FROM Escola e WHERE e.Nome LIKE '%NOME%'

SELECT t.Id, t.Nome
FROM Turma t
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
WHERE es.Escola = <id> AND es.AnoLetivo = 2026
  AND t.Nome LIKE '%parte%'
```

3. Adicionar linha no VALUES do `resolve_ids_ra_impulso.sql`:
```sql
('escola_norm', 'turma_norm', 'Nome no banco Escola', N'Nome no banco Turma'),
```

4. Rerodar SQL → exportar CSV → rerodar gerador.

### Regras gerais para a IA

- **Nunca editar o CSV manualmente** — ele deve vir sempre do banco
- **Nunca hardcodar IDs** no gerador — os IDs vêm exclusivamente do CSV
- Se `--ra-start` for omitido, pedir ao usuário que rode a Query 2 do SQL e informe o `proximo_ra`
- O CSV mais recente por ambiente é sempre o preferido (ordem alfabética do nome = ordem cronológica)
- CSV de homolog e produção podem ter IDs diferentes — nunca reutilizar um CSV de um ambiente no outro
