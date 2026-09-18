# CLI de Importação de RA Impulso — Plano de Desenvolvimento

> Documento vivo. Atualizar a lista de tarefas ao final da seção conforme o CLI evolui — não é um plano fechado, é o registro da ideia refinada + progresso.

---

## 1. Contexto e motivação

Hoje o processo de gerar RA para alunos Impulso (ver [`manual/guide.md`](manual/guide.md)) é manual em vários pontos onde a IA (ou o próprio dev) precisa: ler a planilha, normalizar nomes de escola/turma, cruzar com o registro de mapeamentos (`manual/scripts/resolve_ids_ra_impulso.sql`), identificar o que está faltando, e só depois disso rodar o `gerar_ra_impulso.py`. Isso já foi feito "no braço" (por IA em conversa) nos ciclos EFC-6517 e EFC-6732, mas é repetitivo e propenso a erro humano (nome de escola digitado errado, esquecer de checar os dois ambientes, etc.).

**Objetivo:** um CLI Python que vira o único ponto de entrada do processo — o usuário roda o mesmo comando repetidamente, o CLI diz exatamente qual é o próximo passo (incluindo os passos que só o humano pode fazer, como rodar uma query no SSMS), até chegar no SQL de INSERT final.

---

## 2. Ideia refinada — fluxo do CLI

### Princípio: sem estado escondido, o CLI deriva "onde estamos" a partir dos arquivos na pasta do ciclo

Cada execução do comando:
1. Lê a pasta do ciclo (`manual/<CARD>/`).
2. Roda todas as validações possíveis com o que já existe em disco.
3. Se houver **pendência de dados** → escreve/atualiza `manual/<CARD>/pendencia_importacao_<CARD>.md` e para, com saída não-zero. O usuário lê o arquivo, resolve, roda o comando de novo.
4. Se os dados estão OK mas falta um artefato que só o humano pode gerar (ex.: CSV de IDs de um ambiente) → o CLI imprime **instruções exatas** do que fazer (qual query rodar, onde salvar o resultado) e para.
5. Se tudo que precisa já existe → gera o SQL final de INSERT e imprime os próximos passos (executar no banco, rodar a query de conferência).

Ou seja: **o comando nunca trava esperando input interativo durante a parte manual** — ele sempre devolve o controle pro usuário com uma instrução clara, e confia que o usuário vai rodar o comando de novo depois de fazer a parte manual. Isso bate com o jeito que o usuário descreveu o fluxo.

### Diagrama de estados

```
[planilha/CSV de alunos]
        │
        ▼
  (1) VALIDAÇÃO DE DADOS ─── pendência? ──► pendencia_importacao_<CARD>.md ──► FIM (usuário resolve, roda de novo)
        │ não
        ▼
  (2) RESOLUÇÃO DE IDs (por ambiente escolhido)
        │
        ├─ falta CSV de IDs do ambiente? ──► imprime a Query 1 (já com só as linhas novas) + onde salvar ──► FIM
        │
        ├─ CSV existe mas tem aluno "não mapeado" nele? ──► adiciona ao pendencia_importacao_<CARD>.md ──► FIM
        │
        └─ falta RA inicial? ──► imprime a Query 2 + pede pra rodar de novo passando --ra-start ──► FIM
        │ tudo ok
        ▼
  (3) GERAÇÃO DO SQL FINAL
        │
        ▼
  manual/<CARD>/ra_alunos_impulso.sql + instruções de execução (Passo 5/6 do guide.md)
```

### Comando

Evoluir o `gerar_ra_impulso.py` atual (hoje só faz a etapa 3) para ser o orquestrador das 3 etapas. A lógica de geração de INSERT que já existe e funciona **não muda** — só passa a ser chamada pelo orquestrador como último passo, depois que as etapas 1 e 2 passam.

```powershell
python manual/scripts/gerar_ra_impulso.py --card EFC-6732 --alunos-csv manual/EFC-6732/alunos_consolidado.csv --env producao
# ou, ciclo com aba única:
python manual/scripts/gerar_ra_impulso.py --card EFC-6732 --excel "manual/EFC-6732/Turmas Impulso (ENEM2)_EFC_6732.xlsx" --sheet "ALUNOS NOVOS - ENEM3" --env producao
```

`--ra-start` deixa de ser obrigatório no primeiro comando: só é pedido quando o CLI já chegou na etapa 3 e ainda não foi informado (o CLI avisa e o usuário roda de novo com `--ra-start <N>`).

---

## 3. Escopo da v1 (decidido em 2026-08-20)

- **100% manual em relação ao banco** — o CLI **nunca conecta no SQL Server**. Ele só gera a query a rodar e diz onde salvar o CSV; a execução em homolog e produção é sempre feita pelo usuário (SSMS/DBeaver/MCP em conversa com a IA). Automatizar a conexão (ex.: via `pyodbc`, como o `migrar_diario_configuracao.py` já faz para homolog) fica para uma fase futura, se fizer sentido.
- **Sem consolidação automática de múltiplas abas** — a v1 só lê uma aba (`--excel` + `--sheet`) ou um CSV já consolidado (`--alunos-csv`, colunas `escola,nome,turma`), igual ao `gerar_ra_impulso.py` atual. Consolidar abas com layouts diferentes (como `ALUNOS NOVOS` + `ALUNOS TRANSFERIDOS` do EFC-6732) continua sendo um passo manual/assistido por IA antes de rodar o CLI. Pode virar uma fase futura.

---

## 4. Validações (etapa 1)

Rodadas sobre a lista de alunos já carregada (via `--excel`/`--sheet` ou `--alunos-csv`):

| # | Regra | Tipo | Ação |
|---|-------|------|------|
| 1 | Linha sem nome, escola ou turma | Bloqueante | Lista no pendência; aluno fica de fora até corrigir |
| 2 | Nome de aluno duplicado no input | Aviso | Lista no pendência como aviso (pode ser aluno repetido de propósito — turmas diferentes — ou erro de digitação); não bloqueia geração |
| 3 | Combinação escola/turma sem entrada em `resolve_ids_ra_impulso.sql` (nível nome, independente de ambiente) | Bloqueante | Lista no pendência com a chave normalizada e o texto exato a adicionar no `VALUES` |
| 4 | Combinação existe no registro (regra 3 passou) mas não aparece no CSV de IDs do ambiente escolhido | Bloqueante | Lista no pendência — pode ser porque a Query 1 não rodou ainda nesse ambiente, ou porque o nome da turma no banco daquele ambiente é diferente (ver seção de troubleshooting do guide.md) |

Regras 3 e 4 exigem um parser de `resolve_ids_ra_impulso.sql` que extrai as tuplas do `VALUES` (regex simples, formato é consistente) — ver Arquitetura.

---

## 5. Formato de `pendencia_importacao_<CARD>.md`

Reescrito do zero a cada execução (não é um log acumulativo — reflete o estado atual). Estrutura:

```markdown
# Pendências de importação — <CARD>

Gerado em: <timestamp>
Execução: `gerar_ra_impulso.py --card <CARD> ...`

## Bloqueantes (resolver antes de continuar)

### Escola/turma sem mapeamento (3 casos)

- [ ] `CARMELO PERRONE` / `3a SERIE A - M` (aluno: HEITOR BUENO ADIALA)
      → Descobrir o nome exato da escola/turma no banco e adicionar em
        `manual/scripts/resolve_ids_ra_impulso.sql`:
        SELECT e.Id, e.Nome FROM Escola e WHERE e.Nome LIKE '%CARMELO PERRONE%';
        ...
        Depois: ('CARMELO PERRONE', '3a SERIE A - M', 'NOME EXATO NO BANCO', N'NOME EXATO DA TURMA'),

### Sem ID no CSV do ambiente `producao` (1 caso)
...

## Avisos (não bloqueiam, mas confira)

### Nomes duplicados no input (1 caso)
...
```

Cada item já vem com o comando/linha pronta para copiar — o objetivo é que resolver a pendência seja "copiar, rodar, colar resultado, editar uma linha", não descobrir do zero o que fazer (isso já é o trabalho hoje feito manualmente/via IA, e é o que mais queremos eliminar).

---

## 6. Arquitetura de código

```
manual/scripts/
  gerar_ra_impulso.py        ← CLI entry point / orquestrador (etapas 1→2→3)
  impulso_core.py            ← extraído do gerar_ra_impulso.py atual: normalize_escola,
                                normalize_turma, carregar_mapping_csv, gerar_inserts,
                                ler_alunos_excel, ler_alunos_csv (reaproveitado sem mudanças de lógica)
  mapping_registry.py        ← novo: parseia resolve_ids_ra_impulso.sql (regex sobre o VALUES),
                                expõe {(escola_norm, turma_norm): (escola_db, turma_db)}
  validacao.py                ← novo: roda as regras da seção 4, retorna lista de pendências tipadas
  pendencia_writer.py         ← novo: renderiza a lista de pendências no formato da seção 5
```

- **Reuso, não duplicação:** a lógica de geração de INSERT que já existe e está testada (`gerar_inserts`, `carregar_mapping_csv`, normalização) só é movida para `impulso_core.py`, não reescrita.
- **`mapping_registry.py`** é o único lugar que sabe como ler o `.sql`. Se um dia o registro migrar para um formato estruturado (YAML/CSV), só esse módulo muda.
- Nenhuma dependência nova além de `openpyxl` (já em uso).

---

## 7. Lista de tarefas

### Fase 1 — Validação + relatório de pendências (sem tocar na geração final) ✅ concluída em 2026-08-20
- [x] Extrair `normalize_escola`, `normalize_turma`, `carregar_mapping_csv`, `gerar_inserts`, `ler_alunos_excel`, `ler_alunos_csv` de `gerar_ra_impulso.py` para `impulso_core.py` (as duas funções de leitura também passaram a retornar os avisos de linha incompleta, antes só impressos e descartados — necessário pra regra 1)
- [x] Implementar `mapping_registry.py` (parser do `VALUES` de `resolve_ids_ra_impulso.sql` via regex; validado contra o arquivo real — 70/70 tuplas, confere com `grep -c "^\s*('"`)
- [x] Implementar `validacao.py` com as 4 regras da seção 4 (regra 4 só roda se um `--ids-csv` foi informado — ausência total do CSV é tratada na Fase 2, não é pendência de dados)
- [x] Implementar `pendencia_writer.py` (gera o `.md` da seção 5)
- [x] Testar com o input real do EFC-6732 (147 + 6 alunos, consolidados em `manual/EFC-6732/alunos_consolidado.csv`) — resultado real, não simulado: **55 combinações escola/turma sem mapeamento** (muito mais do que a análise manual tinha identificado — a planilha deste ciclo usa turma já quase no formato do banco, com `º`/`ª`, diferente das abreviações dos ciclos anteriores, então quase nada do registro atual bate) e **2 nomes duplicados**, um deles genuinamente suspeito (`BECKER SANTIAGO GONZALEZ DE SEGNORIBUS` aparece em duas escolas diferentes — provável erro de copy-paste na planilha, não pego na análise manual anterior). Relatório real gravado em `manual/EFC-6732/pendencia_importacao_EFC-6732.md`.

### Extra (fora do plano original, criado sob demanda ao usar a Fase 1 no EFC-6732 real)

Ao usar a Fase 1 de verdade no EFC-6732, o passo "descobrir o nome exato no banco" pra cada uma das 55 combinações pendentes seria muito manual (21 escolas, cada uma exigindo login no banco e comparação visual). Dois scripts novos resolvem isso:

- [x] `descobrir_ids_pendentes.sql` (gerado, não é genérico ainda — ver Fase 2) — uma única query (`UNION ALL`) que, para cada escola pendente, busca por nome parecido e lista **todas** as turmas de 2026 dela. Pensado pra rodar uma vez e exportar o resultado inteiro como um CSV só.
- [x] `resolver_pendencias.py` — cruza esse CSV exportado com as pendências (via `validacao`/`mapping_registry`) e propõe a linha `VALUES` pronta, com uma assinatura estrutural (número da série, letra da turma, tipo — regular/técnico/integral/etc., turno) em vez de comparar as strings inteiras (que dá similaridade baixa mesmo quando é a turma certa, porque a planilha vem abreviada — "3ºB" — e o banco guarda o nome completo — "3ª Série Regular B - M"). `tipo` é tratado como **filtro obrigatório** quando a planilha o informa (não como só mais um peso) — sem isso, um teste sintético mostrou que "acertar número+letra mas errar o tipo" (sugerir Regular A quando o pedido era Técnico A) ficava com score alto demais. Classifica em 3 baldes: alta confiança, revisar (ambíguo/tipo não encontrado/score baixo) e sem candidato.
- [ ] Generalizar `descobrir_ids_pendentes.sql` pra virar parte do orquestrador da Fase 2 (hoje é gerado ad-hoc por escola pendente, não é reutilizável ciclo a ciclo sem regerar)
- [x] Testado `resolver_pendencias.py` com o CSV real de produção do EFC-6732 — resultado final: **48/55 alta confiança, 0 sem candidato, 7 pra revisar**. Três bugs reais de scoring achados e corrigidos rodando de ponta a ponta (não só com dado sintético):
  1. Tipo tratado como peso em vez de filtro obrigatório — dava confiança alta demais pra tipo errado (ex.: sugerir Regular A quando pedia Técnico A).
  2. Tipo detectado como rótulo único perdia informação quando o texto tinha dois qualificadores ao mesmo tempo ("Técnico ADM" virava só "Técnico") — corrigido pra detecção multi-rótulo (conjunto de tipos, exige subconjunto completo no candidato).
  3. Turno tratado como peso (0.1-0.2) em vez de filtro — `ZUMBI DOS PALMARES / 2ª Série Regular A - I` (a escola não tem turno I, só M e T) chegou a score 0.78 e seria aceito como "alta confiança" sugerindo turno M errado, só achado ao rodar contra o CSV real de produção. Turno virou filtro obrigatório igual tipo.
  Os 7 que sobraram são ambiguidade genuína (planilha não informa o tipo), turno pedido que realmente não existe na escola (parece erro de planilha, não do script), ou a turma esperada não existe com esse formato de nome no banco — não são falhas do script, são casos que realmente precisam de decisão humana.
- [x] **Usado de verdade no EFC-6732**: as 48 linhas de alta confiança já foram coladas em `resolve_ids_ra_impulso.sql` (registro foi de 70 para 118 combinações).

### Fase 2 — Orquestração completa (guiar até o SQL final)
- [ ] Reescrever `gerar_ra_impulso.py` como orquestrador: roda validação → se limpo, checa CSV de IDs do ambiente → se limpo, checa `--ra-start` → se tudo ok, chama a geração final (lógica já existente)
- [ ] Mensagens de "próximo passo" para cada ponto de parada manual (qual query rodar, onde salvar o CSV, como rodar de novo)
- [ ] Suporte a `--card` (deriva pasta `manual/<CARD>/` automaticamente em vez de exigir caminhos completos em toda flag)

### Fase 3 — Polimento (só depois da Fase 1+2 validadas em um ciclo real)
- [ ] Reset explícito de pendências resolvidas manualmente sem re-rodar tudo (ex.: `--recheck`)
- [ ] Testes automatizados (pytest) para `validacao.py` e `mapping_registry.py` com fixtures baseadas nos casos reais do EFC-6517/EFC-6732
- [ ] Avaliar se vale a pena automatizar a Query 1/2 em homolog via `pyodbc` (fora de escopo da v1, decidido em 2026-08-20 — só revisitar se o passo manual continuar sendo o maior gargalo)
- [ ] Avaliar consolidação automática de múltiplas abas com layouts diferentes (fora de escopo da v1)

---

## 8. Decisões registradas

| Data | Decisão | Motivo |
|------|---------|--------|
| 2026-08-20 | v1 não conecta no banco — 100% manual (usuário roda query, cola CSV) | Mais simples de implementar e testar primeiro; automação fica pra depois se o gargalo persistir |
| 2026-08-20 | v1 não consolida múltiplas abas automaticamente | Reduz escopo inicial; caso do EFC-6732 já tem `--alunos-csv` como via manual de consolidação |
| 2026-08-20 | Lógica de geração de INSERT existente é reaproveitada, não reescrita | Já testada em ciclos reais (mai/26, jun/26) — risco de regressão se reescrita do zero |
