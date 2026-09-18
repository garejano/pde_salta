# Analisar Conflitos de Merge

Detecta conflitos potenciais entre o branch atual e `homolog`, analisa o histórico e gera um relatório de ação em `merge_checks/`.

---

## Uso

```
/merge-check <caminho-do-repo>
```

**Exemplos:**
```
/merge-check c:/projects/estrutura-pedagogica
/merge-check c:/projects/documentacao-pedagogica
```

O argumento é o caminho absoluto do repositório a analisar. O branch de **destino é sempre `homolog`**.

---

## Restrições absolutas

- **Nunca commitar** nada em nenhum branch.
- **Nunca alterar `homolog`** (nem fazer checkout, nem merge real, nem push).
- **Nunca alterar o código** do repositório analisado.
- Apenas `git fetch` é permitido como operação remota — não `git pull`.

---

## Processo

### 1. Validar o repositório

Verificar se `<caminho-do-repo>` existe e é um repositório git:

```powershell
cd <caminho-do-repo>
git rev-parse --show-toplevel
```

Se não for um repositório git válido: informar o usuário e encerrar.

Capturar:
- **Nome do repo:** basename do diretório (`Split-Path -Leaf`)
- **Branch atual:** `git rev-parse --abbrev-ref HEAD`
- **Branch de destino:** sempre `homolog`

Se o branch atual for `homolog` ou `main`: avisar o usuário que o merge-check é feito a partir de um branch de feature/tarefa, e encerrar.

---

### 2. Garantir estado atualizado dos branches (só fetch, nunca pull)

```powershell
git fetch origin
```

Capturar o resultado. Se `origin/homolog` não existir após o fetch: informar e encerrar.

Verificar se o branch atual tem remote tracking. Se tiver, verificar se está atrás do remote:

```powershell
git rev-list --count HEAD..origin/<branch-atual>
```

Se o valor for > 0: registrar no relatório como aviso — "branch local está N commits atrás do remoto; o check foi feito com o estado local".

---

### 3. Detectar conflitos (dry-run — zero alterações no working tree)

Encontrar o ancestral comum:

```powershell
git merge-base HEAD origin/homolog
```

Executar o merge simulado **sem tocar em nenhum arquivo**:

```powershell
git merge-tree <merge-base> HEAD origin/homolog
```

Capturar a saída completa. A presença de `<<<<<<< `, `=======`, `>>>>>>> ` na saída indica conflito.

Para cada arquivo em conflito: extrair o bloco de conflito completo da saída do `merge-tree`.

---

### 4. Coletar contexto dos arquivos em conflito

Para cada arquivo em conflito, executar os comandos abaixo **sem alterar nada**:

**a) Histórico do arquivo no branch atual (commits que tocaram o arquivo e não estão em homolog):**
```powershell
git log --oneline origin/homolog..HEAD -- <arquivo>
```

**b) Histórico do arquivo em homolog (commits que tocaram o arquivo e não estão no branch atual):**
```powershell
git log --oneline HEAD..origin/homolog -- <arquivo>
```

**c) Quem alterou cada linha do arquivo em conflito no branch atual:**
```powershell
git log -5 --oneline -- <arquivo>
```

**d) Diferença entre o branch atual e homolog para o arquivo:**
```powershell
git diff origin/homolog -- <arquivo>
```

---

### 5. Coletar contexto geral dos branches

**Commits do branch atual que ainda não estão em homolog:**
```powershell
git log --oneline origin/homolog..HEAD
```

**Commits de homolog que o branch atual ainda não tem:**
```powershell
git log --oneline HEAD..origin/homolog
```

**Resumo de arquivos divergentes:**
```powershell
git diff --name-status origin/homolog...HEAD
```

---

### 6. Analisar e classificar cada conflito

Para cada arquivo em conflito, classificar a **causa provável**:

| Padrão | Causa provável |
|--------|---------------|
| Mesmas linhas editadas de formas diferentes | Edição concorrente — requer resolução manual |
| Bloco adicionado num lado, removido no outro | Deleção vs. modificação — investigar intenção |
| Bloco idêntico presente nos dois lados | Merge paralelo — provavelmente auto-resolvível |
| Import/using / header adicionado nos dois lados | Adição paralela — frequentemente auto-resolvível |

Classificar a **dificuldade estimada de resolução**:
- `baixa` — conflito trivial (imports duplicados, whitespace, comentários)
- `media` — mesmo trecho editado com intenções compatíveis
- `alta` — lógica de negócio divergente; exige entendimento de ambas as mudanças

---

### 7. Montar o relatório

Estrutura do arquivo de saída:

```markdown
# Merge Check — <repo> | <branch-atual> → homolog

> Gerado em: <YYYY-MM-DD HH:mm>
> Fetch realizado em: <YYYY-MM-DD HH:mm>

## Resultado

**Status:** <SEM CONFLITOS ✅ | COM CONFLITOS ⚠️>

**Branch origem:** `<branch-atual>`
**Branch destino:** `homolog`
**Ancestral comum:** `<hash>`
**Commits a enviar para homolog:** <N>
**Commits de homolog que o branch ainda não tem:** <N>

<Se o branch local estiver atrás do remoto, adicionar aviso aqui.>

---

## Arquivos em conflito (<N>)

<Se não houver conflitos: "Nenhum conflito detectado — merge pode ser feito diretamente.">

### `<caminho/do/arquivo>`

**Dificuldade estimada:** <baixa | media | alta>
**Causa provável:** <descrição>

**Bloco em conflito:**
```
<<<<<<< HEAD (branch-atual)
<conteúdo do branch atual>
=======
<conteúdo de homolog>
>>>>>>> origin/homolog
```

**Histórico no branch atual:**
- <hash> <mensagem>

**Histórico em homolog:**
- <hash> <mensagem>

**Ação sugerida:**
<Instrução específica para este arquivo — ver seção de ações abaixo>

---

<repetir para cada arquivo em conflito>

## Resumo de arquivos divergentes (sem conflito)

<lista de arquivos que diferem mas não conflitam — apenas informativos>

## Ação recomendada

<Uma das opções abaixo, com justificativa baseada na análise:>

### Opção A — Rebase no homolog antes do merge _(recomendada se homolog avançou muito)_
1. `git fetch origin`
2. `git rebase origin/homolog`
3. Resolver os conflitos listados acima em cada arquivo
4. `git rebase --continue`
5. Abrir o PR / solicitar merge para homolog

### Opção B — Merge direto e resolver conflitos no PR _(se poucos conflitos e equipe prefere merge commits)_
1. Solicitar o merge para homolog via PR
2. Resolver os conflitos listados acima diretamente na interface do GitHub/GitLab

### Opção C — Aguardar _(se homolog está instável ou tem mudanças não finalizadas)_
<descrever o que está pendente em homolog que seria conflitante>

---

## Comandos úteis para resolução

```powershell
# Ver diff completo de um arquivo específico
git diff origin/homolog -- <arquivo>

# Verificar quem fez o quê num trecho
git log -p --follow -- <arquivo>

# Após resolver manualmente, continuar rebase
git add <arquivo>
git rebase --continue
```

## Notas

<Observações adicionais relevantes — ex: arquivo gerado (não editar manualmente), arquivo de migration (ordem importa), etc.>
```

---

### 8. Salvar o relatório

Salvar em:

```
c:/projects/pde_salta/merge_checks/<repo>_<branch-origem>_homolog_<YYYY-MM-DD>.md
```

- Substituir `/` e caracteres especiais no nome do branch por `-`
- Se já existir um arquivo com o mesmo nome (mesmo dia): sobrescrever, pois é uma re-execução
- Criar o diretório `merge_checks/` se não existir

Após salvar, informar ao usuário:
- Caminho do arquivo gerado
- Status resumido (sem conflitos / N conflitos encontrados)
- A ação recomendada em uma linha

---

## O que **não** fazer

- Não executar `git merge`, `git pull`, `git checkout homolog`, `git push` ou `git commit`.
- Não usar `git merge --no-commit` (altera o working tree mesmo sem commitar).
- Não modificar nenhum arquivo do repositório analisado.
- Não inventar conflitos — basear-se exclusivamente na saída do `git merge-tree`.
- Não sugerir "aceitar o lado deles/nosso" sem entender o contexto — verificar o histórico antes de recomendar.
- Não omitir arquivos em conflito do relatório, mesmo os de dificuldade baixa.
