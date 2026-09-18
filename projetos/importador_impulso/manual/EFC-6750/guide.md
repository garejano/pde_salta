# EFC-6750 — Guia do ciclo (Turmas Impulso ENEM2, aba 24/08)

> Processo geral, scripts e troubleshooting: [`../guide.md`](../guide.md). Este arquivo cobre só o que é específico deste ciclo.

Card: https://gruposalta.atlassian.net/browse/EFC-6750 (ver `cards/EFC-6750/EFC-6750.md` para o texto sincronizado do Jira).

---

## O que este ciclo pede

Criação de RA Impulso/Enem a partir da planilha [Turmas Impulso (ENEM2).xlsx](https://docs.google.com/spreadsheets/d/1nFnBV-gSyYxljKv6N-AbUeBwcDA-uFrl/edit?gid=1360827836#gid=1360827836), aba **`24/08`**.

Ainda não há mais detalhes do card além do link — layout da aba, nº de alunos e escolas envolvidas serão preenchidos aqui assim que a planilha for baixada e inspecionada (Passo 1 do processo geral).

> **Atenção:** existe um arquivo `Turmas Impulso (ENEM2).xlsx` solto em `ra_alunos_impulso/` (convenção antiga, raiz do repo), datado de 29/06 — **anterior** à criação deste card (26/08) e à aba `24/08`. Não usar esse arquivo como fonte deste ciclo; baixar a planilha atual do Google Sheets acima e salvar nesta pasta.

---

## Arquivo da planilha

`Turmas Impulso (ENEM2).xlsx` (nesta pasta). Tem 7 abas: `ALUNOS NOVOS - ENEM3`, `ALUNOS TRANSFERIDOS`, `2408`, `RAs 2606`, `RAs 2108`, `Todos`, `RAs`. Só a aba `2408` interessa para este ciclo (o card cita "aba 24/08" — o nome real da aba no arquivo é `2408`, sem barra).

### Aba `2408`

Layout igual ao de ciclos anteriores — colunas `Escola | Nome do Aluno | Turma` (linha 1 = cabeçalho, linha 2 = exemplo "Seguir este modelo", ignorar). **28 alunos, 8 escolas.**

> Passar `--sheet "2408"` para o `gerar_ra_impulso.py`.

Escolas envolvidas: ALGACYR M MAEDER, BRASÍLIO ITIBIRÉ, Edithe, IEDA BAGGIO MAYER, MARILIS, Nossa Senhora da Salete, ORIONE, PROTÁSIO DE CARVALHO.

---

## Antes de gerar o SQL — dados para não fazer coisa errada

- Não confundir com as abas `ALUNOS NOVOS - ENEM3` / `ALUNOS TRANSFERIDOS` do mesmo arquivo — essas já foram processadas no ciclo EFC-6732 e não fazem parte deste ciclo.
- **Linha 2 da aba `2408` é exemplo/template** ("Seguir este modelo", aluno "MARCOS FELLYPE DIAS DA SILVA" em ADAILE M LEITE) — não é aluno real. O script não pula essa linha sozinho (só ignora o cabeçalho). Por isso, usar `manual/EFC-6750/alunos_consolidado.csv` (já gerado sem essa linha) em vez de `--excel`/`--sheet` direto.
- 14 combinações escola/turma novas foram adicionadas em `manual/scripts/resolve_ids_ra_impulso.sql` (bloco "EFC-6750", 2026-08-27) e validadas contra homolog — a maioria são turmas de 2ª série que ainda não existiam no registro.
- **3 alunos ficaram pendentes** (turma não localizada no banco, sem mapeamento seguro):
  - Beatriz Mazon Gziboski (Nossa Senhora da Salete) — planilha diz "2ª Série Técnico em ADM - M"; banco só tem "2ª Série Técnico A - M" para essa escola/série. Decisão: não mapear até confirmar com a PM se é a mesma turma.
  - Tayna Dal' Pra Good e Isaque Amaral da Rocha Zanardo (ALGACYR M MAEDER) — planilha diz "2ª Série Regular B - Integral"; banco não tem turma B de 2ª série regular nessa escola (só A). Decisão: não mapear até confirmar.
- Rodar a Query 2 (próximo RA) **fresca** em cada ambiente antes de gerar o SQL — não reaproveitar `--ra-start` de ciclos anteriores (ver regra crítica em `../guide.md`).

---

## Status

- [x] Planilha (aba `2408`) baixada e salva em `manual/EFC-6750/`
- [x] Query 1 rodada em produção (2026-08-27) — CSV `2026-08-27_to_ra_manual_producao.csv`, gerado **antes** das 14 linhas novas no registro (precisa rerodar)
- [x] Query 2 rodada em produção (2026-08-27) — próximo RA: `90929755`
- [x] 1ª tentativa de `gerar_ra_impulso.py` — 0/29 mapeados (todas as combinações escola/turma novas, ainda não registradas)
- [x] 14 combinações novas adicionadas a `resolve_ids_ra_impulso.sql` e validadas em homolog
- [x] `alunos_consolidado.csv` gerado (28 alunos reais, sem a linha-exemplo)
- [x] Query 1 rerodada em produção (2026-08-27) — CSV `2026-08-27_to_ra_manual_producao-1787830598020.csv` (140 linhas, com as 14 novas). CSV anterior (126 linhas) renomeado para `OBSOLETO_ids_producao_2026-08-27_pre_14linhas.csv` — **não usar**; o nome com timestamp ordena alfabeticamente antes de `...producao.csv`, então a auto-detecção do script pegaria o arquivo errado se ambos ficassem com o padrão `*_to_ra_manual_*.csv`.
- [x] `gerar_ra_impulso.py --alunos-csv "EFC-6750/alunos_consolidado.csv" --ids-csv "EFC-6750/2026-08-27_to_ra_manual_producao-1787830598020.csv" --ra-start 90929755 --env producao` executado — **25/28 mapeados**, RAs `90929755` → `90929779`, `ra_alunos_impulso.sql` gerado (125 INSERTs, 5 por aluno)
- [ ] Confirmar com a PM as 3 pendências antes de fechar o ciclo (não entraram no SQL gerado):
  - Beatriz Mazon Gziboski (Nossa Senhora da Salete) — turma "Técnico em ADM" não bate com "Técnico A" do banco
  - Tayna Dal' Pra Good e Isaque Amaral da Rocha Zanardo (ALGACYR M MAEDER) — turma "2ª Série Regular B" não existe no banco para essa escola
- [ ] SQL executado em produção
- [ ] Lista final de confirmação entregue
