ex: python manual/scripts/gerar_ra_impulso.py --alunos-csv "manual/EFC-6732/alunos_consolidado.csv" --ra-start 90929601 --env producao

# Importador de Alunos Impulso — Manual

Guia operacional completo para cadastrar Registros de Aluno (RA) dos alunos do programa Impulso.

Este é o **manual de referência**: o processo geral, os scripts e as regras que valem para qualquer ciclo. Cada ciclo (um card Jira) tem sua própria pasta em `manual/<CARD>/` com a planilha recebida, os arquivos gerados e um `guide.md` específico com as decisões e cuidados daquele ciclo — comece por lá se você já está no meio de uma importação. Ver [Estrutura de pastas](#estrutura-de-pastas).

---

## Contexto

Escolas públicas gerenciadas pela empresa utilizam nossos sistemas. Alunos dessas escolas que **não** são da nossa rede precisam de um RA cadastrado para usar a correção de redação (simulados ENEM/Impulso). O processo é recorrente — a cada novo ciclo, a PM envia uma planilha (geralmente via Slack → card Jira) e um desenvolvedor executa os scripts.

---

## Estrutura de pastas

```
projetos/importador_impulso/
  manual/
    guide.md                         ← este arquivo (processo geral)
    scripts/
      resolve_ids_ra_impulso.sql     ← registro vivo: mapeamento escola/turma → IDs, cresce a cada ciclo
      gerar_ra_impulso.py            ← gera o SQL de INSERT a partir do CSV de IDs + planilha/CSV de alunos
    <CARD>/                          ← uma pasta por card Jira que gerar RAs (ex.: EFC-6732)
      guide.md                       ← processo específico do ciclo: dados da planilha, decisões, pendências
      <planilha recebida>.xlsx
      <YYYY-MM-DD>_to_ra_manual_<env>.csv   ← saída da Query 1 de resolve_ids_ra_impulso.sql
      ra_alunos_impulso.sql          ← saída de gerar_ra_impulso.py — rodar no banco
```

> Ciclos anteriores ao EFC-6732 (mai/26 e jun/26/EFC-6517) ainda usam a convenção antiga (`ra_alunos_impulso/`, `_scripts/`) e não foram migrados — ver [Histórico de ciclos](#histórico-de-ciclos). A partir do EFC-6732, todo ciclo novo usa `manual/<CARD>/`.

---

## Fluxo resumido

```
Planilha do ciclo (manual/<CARD>/<planilha>.xlsx)
        │
        ▼
manual/scripts/resolve_ids_ra_impulso.sql   ← rodar em cada ambiente (homolog / produção)
        │
        ├─► Query 1: exportar como  manual/<CARD>/YYYY-MM-DD_to_ra_manual_<env>.csv
        └─► Query 2: anotar o  proximo_ra
        │
        ▼
python manual/scripts/gerar_ra_impulso.py --excel manual/<CARD>/<planilha>.xlsx \
    --sheet "<aba>" --ra-start <proximo_ra> --env <env>
        │
        ▼
manual/<CARD>/ra_alunos_impulso.sql   ← executar no banco
        │
        ▼
Lista final: Escola | Nome Aluno | RA | Turma
```

---

## Pré-requisitos

- Python 3.x com `openpyxl` instalado (`pip install openpyxl`)
- Acesso ao banco SQL Server (`belerofonte.eleva.local` / `ElevaPortalHomolog` ou produção)
- **MCP `sqlserver` só acessa homolog.** A execução em produção é sempre manual (rodar o `.sql` direto no banco de produção) — a IA nunca tem acesso via MCP a produção.
- Planilha do ciclo salva em `manual/<CARD>/`

---

## Passo a Passo

### Passo 1 — Criar a pasta do ciclo e posicionar a planilha

1. Criar `manual/<CARD>/` (ex.: `manual/EFC-6732/`), onde `<CARD>` é a chave do card Jira que pediu a importação.
2. Salvar a planilha recebida dentro dessa pasta.
3. Identificar a(s) aba(s) com alunos e suas colunas — **nem sempre é só uma aba "ALUNOS NOVOS" com 3 colunas**; já apareceram variações como abas com nome diferente por ciclo (`ALUNOS NOVOS - ENEM3`) e abas com layout diferente (`ALUNOS TRANSFERIDOS`, com coluna extra de escola de destino). Documentar o layout real no `guide.md` do ciclo antes de seguir.
4. Se houver mais de uma aba de alunos com layouts diferentes, consolidar tudo em um único CSV (`escola,nome,turma`) dentro da pasta do ciclo antes do Passo 4 — ver `--alunos-csv` no Passo 4.

---

### Passo 2 — Resolver IDs do banco

Abrir `manual/scripts/resolve_ids_ra_impulso.sql` e executar as **duas queries** no banco.

#### Query 1 — Mapeamento escola/turma → IDs

Retorna colunas: `escola_norm, turma_norm, escola_id, turma_id, turma_nome_banco`

- Exportar o resultado como CSV
- Nomear: `YYYY-MM-DD_to_ra_manual_homolog.csv` ou `_producao.csv`
- Salvar em `manual/<CARD>/`

> **Atenção:** rodar separadamente para cada ambiente. Os IDs de escola e turma podem ser diferentes entre homolog e produção. Nunca reutilizar o CSV de um ambiente no outro.

#### Query 2 — Próximo RA disponível

```sql
SELECT
    MAX(CAST(temp AS BIGINT))     AS ultimo_ra,
    MAX(CAST(temp AS BIGINT)) + 1 AS proximo_ra
FROM Pessoa
WHERE temp LIKE '909%'
  AND ISNUMERIC(temp) = 1;
```

Anotar o valor de `proximo_ra` — será passado para o script como `--ra-start`. Rodar essa query em **cada ambiente** separadamente (homolog e produção podem ter sequências diferentes).

---

### Passo 3 — Verificar o CSV

Antes de gerar o SQL, validar o CSV:

- **Número de linhas** deve bater com o número de combinações escola/turma distintas da planilha
- Se alguma linha estiver faltando → a turma não foi encontrada no banco → ver [Troubleshooting](#troubleshooting)

---

### Passo 4 — Gerar o SQL de INSERT

```powershell
cd c:\projects\pde_salta

# A partir de uma planilha com uma única aba de alunos
python projetos/importador_impulso/manual/scripts/gerar_ra_impulso.py `
    --excel "projetos/importador_impulso/manual/EFC-6732/Turmas Impulso (ENEM2)_EFC_6732.xlsx" `
    --sheet "ALUNOS NOVOS - ENEM3" `
    --ra-start 90929601 --env producao

# A partir de um CSV já consolidado (múltiplas abas com layouts diferentes)
python projetos/importador_impulso/manual/scripts/gerar_ra_impulso.py `
    --alunos-csv "projetos/importador_impulso/manual/EFC-6732/alunos_consolidado.csv" `
    --ra-start 90929601 --env producao
```

O CSV de IDs (`--ids-csv`) é detectado automaticamente na mesma pasta do input (`--excel`/`--alunos-csv`), filtrando por `--env`; passe `--ids-csv` explicitamente se houver ambiguidade. O SQL de saída (`--out`) por padrão vai para `ra_alunos_impulso.sql` na mesma pasta.

Saída esperada no terminal:

```
Input:       .../manual/EFC-6732/Turmas Impulso (ENEM2)_EFC_6732.xlsx
CSV de IDs:  .../manual/EFC-6732/2026-08-20_to_ra_manual_producao.csv
Ambiente:    producao
RA inicial:  90929601
Mapeamentos carregados do CSV: 55
Alunos no input: 153
Mapeados:     153 / 153
Nao mapeados: 0
RAs usados:   90929601 -> 90929753
SQL gerado:   .../manual/EFC-6732/ra_alunos_impulso.sql
```

Se `Nao mapeados > 0` → parar aqui e resolver antes de continuar (ver [Troubleshooting](#troubleshooting)).

---

### Passo 5 — Executar o SQL no banco

Rodar `manual/<CARD>/ra_alunos_impulso.sql` no banco-alvo.

As queries são **idempotentes** — podem ser reexecutadas sem duplicar registros.

> **Sugestão do Rodrigo (técnico que originou o processo manual):** executar coluna a coluna (todos os INSERTs de `Pessoa`, depois todos de `Usuario`, etc.) para facilitar debug em caso de erro.

> **Produção:** a IA não tem acesso MCP a produção — essa etapa é sempre executada manualmente pelo desenvolvedor.

---

### Passo 6 — Entregar a lista final

Após a execução, gerar a lista de confirmação:

```sql
SELECT
    e.Nome         AS Escola,
    p.Nome         AS Aluno,
    p.temp         AS RA,
    t.Nome         AS Turma
FROM Pessoa p
INNER JOIN PessoaEscola pe   ON pe.Pessoa = p.Id
INNER JOIN Escola e          ON e.Id = pe.Escola
INNER JOIN PessoaEscolaAcesso pea ON pea.PessoaEscola = pe.Id AND pea.temp = p.temp
INNER JOIN AlunoEscola ae    ON ae.AlunoEscola_key = pea.Id
INNER JOIN Turma t           ON t.Id = ae.Turma
WHERE p.temp BETWEEN '<ra_inicial>' AND '<ra_final>'
  AND ae.AnoLetivo = 2026
ORDER BY e.Nome, p.Nome;
```

Substituir `<ra_inicial>` e `<ra_final>` pelos valores informados pelo script no Passo 4.

---

## Schema do banco

```
Pessoa (Nome, temp = RA)
  └─ Usuario (Pessoa.Id)
       └─ PessoaEscola (Pessoa + Escola + Matricula = RA)
            └─ PessoaEscolaAcesso (PessoaEscola + PerfilAcesso=1 + temp=RA)
                 └─ AlunoEscola (AlunoEscola_key = PessoaEscolaAcesso.Id + Turma + AnoLetivo)
```

**Nota crítica:** `AlunoEscola.AlunoEscola_key` é FK para `PessoaEscolaAcesso.Id`, **não** para `Pessoa.Id`.

Cada aluno exige **5 INSERTs** nessa ordem. O script gera tudo automaticamente.

**Alunos que trocaram de escola parceira ("transferidos"):** decisão validada com o time (2026-08-20, EFC-6732) — tratar como **aluno novo, com tudo novo** (novo `Pessoa`/RA, direto na escola/turma atual). Não localizar o `Pessoa` antigo nem mexer no vínculo da escola de origem — isso elimina a necessidade de um fluxo de "transferência real" separado. Se um ciclo futuro exigir de fato uma transferência (reaproveitar RA existente), será preciso desenhar esse fluxo à parte; a coluna `AlunoEscola.TipoSaidaAluno` (FK) é a candidata natural para registrar o encerramento do vínculo antigo nesse cenário, mas não foi validada nem usada até hoje.

---

## Troubleshooting

### Alunos não mapeados (`Nao mapeados > 0`)

O script lista as chaves que não encontrou no CSV:
```
[ESCOLA X] 'Turma Y' -> chave: ('ESCOLA X', 'TURMA NORM')
```

**Causas e soluções:**

| Causa | Solução |
|-------|---------|
| Escola/turma nova não está em `resolve_ids_ra_impulso.sql` | Adicionar a linha nos VALUES e rerodar |
| CSV gerado do ambiente errado | Usar `--env producao` ou `--ids-csv` com o arquivo correto |
| Nome da turma diferente em produção | Ver seção abaixo |

### Turma com nome diferente em produção

Descobrir o nome correto:
```sql
SELECT t.Id, t.Nome
FROM Turma t
INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
INNER JOIN Escola e ON e.Id = es.Escola
WHERE e.Nome = 'NOME DA ESCOLA'
  AND es.AnoLetivo = 2026
  AND t.Nome LIKE '2%rie%'
ORDER BY t.Nome;
```

Atualizar a linha em `manual/scripts/resolve_ids_ra_impulso.sql`:
```sql
-- antes:
('ESCOLA X', 'chave_norm', 'ESCOLA X', N'Nome que não existe em produção'),

-- depois:
('ESCOLA X', 'chave_norm', 'ESCOLA X', N'Nome correto em produção'),
```

Rerodar: SQL → CSV → gerador.

---

## Adicionando novas escolas/turmas (todo ciclo novo)

Para cada combinação nova na planilha:

1. **Calcular as chaves normalizadas:**
   - `escola_norm`: nome em maiúsculo, sem acento, sem espaço no final
   - `turma_norm`: mesmo + substituir `º`/`ª`/`°` por `o`

2. **Descobrir o nome exato no banco:**
   ```sql
   SELECT e.Id, e.Nome FROM Escola e WHERE e.Nome LIKE '%NOME%';

   SELECT t.Id, t.Nome
   FROM Turma t
   INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie
   WHERE es.Escola = <id> AND es.AnoLetivo = 2026
     AND t.Nome LIKE '%parte%';
   ```

3. **Adicionar linha em `manual/scripts/resolve_ids_ra_impulso.sql`:**
   ```sql
   ('escola_norm', 'turma_norm', 'Nome no banco da Escola', N'Nome no banco da Turma'),
   ```
   Comentar com o ciclo que introduziu a linha (ex.: `-- Adicionado em EFC-6732`), para rastrear a origem de cada mapeamento.

4. Rerodar: SQL → CSV → gerador.

---

## Regras importantes

- **Nunca editar o CSV manualmente** — ele deve vir sempre do banco
- **Nunca hardcodar IDs** no script gerador — os IDs vêm exclusivamente do CSV
- CSV de homolog e produção podem ter IDs diferentes — nunca reutilizar um CSV de um ambiente no outro
- O CSV mais recente por ambiente é sempre o preferido (nome com prefixo `YYYY-MM-DD`)
- `manual/scripts/resolve_ids_ra_impulso.sql` é um **registro cumulativo** — mapeamentos de ciclos anteriores não são removidos, só se acrescenta
- **Sempre rodar a Query 2 (próximo RA) de novo, mesmo que outro ciclo já tenha "reservado" um RA anteriormente.** `gerar_ra_impulso.py` só verifica idempotência por (Nome + temp) — se `--ra-start` já pertence a outro `Pessoa` (nome diferente), o script **não detecta a colisão** e cria um segundo `Pessoa` com o mesmo RA. Isso aconteceu no EFC-6732 (2026-08-21): ciclo anterior (EFC-6517) tinha deixado um `ra_alunos_impulso_enem2.sql` parcial com RA 90929601 já usado, e o EFC-6732 foi rodado com o mesmo `--ra-start` sem reconsultar a Query 2 — ver correção em `manual/EFC-6732/corrigir_ra_duplicado.sql`. Antes de rodar `gerar_ra_impulso.py` em produção, sempre rodar a Query 2 fresca naquele ambiente, mesmo que já exista um valor "conhecido" de um ciclo anterior.

---

## Histórico de ciclos

| Ciclo | Card | RAs gerados | Onde estão os arquivos |
|-------|------|-------------|------------------------|
| mai/26 | — (anterior ao uso de cards) | 90929456 → 90929573 (118 alunos) | `ra_alunos_impulso/` (convenção antiga) |
| jun/26 | EFC-6517 | parcial / não commitado | `ra_alunos_impulso/` + `_scripts/` (convenção antiga, ciclo em aberto — não migrado) |
| ago/26 | EFC-6732 | 90929602 → 90929754 (153 alunos) | `manual/EFC-6732/` (nova convenção) — concluído, com 1 incidente de RA duplicado corrigido (ver seção "Regras importantes" acima) |
