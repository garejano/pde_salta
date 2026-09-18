# EFC-6799 — Guia do ciclo (Turmas Impulso ENEM2, aba 02/09)

> Processo geral, scripts e troubleshooting: [`../guide.md`](../guide.md). Este arquivo cobre só o que é específico deste ciclo.

Card: https://gruposalta.atlassian.net/browse/EFC-6799 (ver `cards/EFC-6799/EFC-6799.md` para o texto sincronizado do Jira).

---

## O que este ciclo pede

Criação de RA Impulso/Enem a partir da planilha [Turmas Impulso (ENEM2).xlsx](https://docs.google.com/spreadsheets/d/1nFnBV-gSyYxljKv6N-AbUeBwcDA-uFrl/edit?gid=1360827836#gid=1360827836), aba **`02/09`**.

Ainda não há mais detalhes do card além do link — layout da aba, nº de alunos e escolas envolvidas serão preenchidos aqui assim que a planilha for baixada e inspecionada (Passo 1 do processo geral).

---

## Arquivo da planilha

`Turmas Impulso (ENEM2).xlsx` (nesta pasta). Tem 9 abas: `ALUNOS NOVOS - ENEM3`, `ALUNOS TRANSFERIDOS`, `2408`, `0209`, `RAs 2408`, `RAs 2606`, `RAs 2108`, `Todos`, `RAs`. Só a aba `0209` interessa para este ciclo (o card cita "aba 02/09" — o nome real da aba no arquivo é `0209`, sem barra).

### Aba `0209`

Layout igual ao de ciclos anteriores — colunas `Escola | Nome do Aluno | Turma` (linha 1 = cabeçalho, linha 2 = exemplo "seguir exemplo", ignorar — mesmo aluno fictício "YASMIN DE OLIVEIRA VIANA" / BRASÍLIO ITIBIRÊ usado no ciclo EFC-6750). **9 alunos, 5 escolas.**

> Passar `--sheet "0209"` (ou usar `alunos_consolidado.csv` já sem a linha-exemplo).

Escolas envolvidas: DIRCE DE AGUIAR MAIA, ELEODORO EBANO PEREIRA, GENÉSIO MORESCHI, MARIA MONTESSORI, ZUMBI DOS PALMARES.

---

## Antes de gerar o SQL — dados para não fazer coisa errada

- Linha 2 é a linha-exemplo padrão da planilha ("seguir exemplo") — excluída do `alunos_consolidado.csv`.
- 3 combinações escola/turma novas adicionadas a `manual/scripts/resolve_ids_ra_impulso.sql` (bloco "EFC-6799", validadas em homolog):
  - GENÉSIO MORESCHI / "2ª Série Regular C" → turma C - N (única opção no banco)
  - DIRCE DE AGUIAR MAIA / "2° Séria Integral A" (typo "Séria" na planilha) → escola já existia no registro como "DIRCE DE A MAIA" (abreviado); esse ciclo grafou por extenso — nova linha de escola_norm
  - ELEODORO EBANO PEREIRA / Carlos Alfonzo Peres Toledo: planilha dizia "Regular C- Integral", mas a escola não tem nenhuma turma "Integral" (só M/N) — corrigido para "Regular C - M" com confirmação do usuário
- As outras 6 combinações (ELEODORO 2ª A-M, ZUMBI 2ª A-M, MARIA MONTESSORI 3A ×2) já estavam mapeadas de ciclos anteriores.

---

## Status

- [x] Planilha (aba `0209`) baixada e salva em `manual/EFC-6799/`
- [x] 3 combinações escola/turma novas adicionadas a `resolve_ids_ra_impulso.sql` e validadas em homolog
- [x] `alunos_consolidado.csv` gerado (9 alunos reais, sem a linha-exemplo)
- [x] Query 1 rodada em produção (2026-09-11) — CSV `2026-09-11_to_ra_manual_producao.csv`
- [x] Query 2 rodada em produção (2026-09-11) — próximo RA: `90929783`
- [x] CSV validado
- [x] `gerar_ra_impulso.py` executado — **9/9 mapeados**, RAs `90929783` → `90929791`, `ra_alunos_impulso.sql` gerado
- [ ] SQL executado em produção
- [ ] Lista final de confirmação entregue
