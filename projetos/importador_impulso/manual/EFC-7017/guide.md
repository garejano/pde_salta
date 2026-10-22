# EFC-7017 — Guia do ciclo

## Arquivo da planilha

`Turmas Impulso (ENEM4)_EFC_7017.xlsx` (nesta pasta) — baixado do **anexo do próprio card Jira** (`Turmas Impulso .xlsx`, attachment `180269`), não de um link do Google Sheets como nos ciclos anteriores. Tem 11 abas (planilha reaproveitada entre ciclos); só a aba `ENEM 4` interessa para este ciclo (o card cita "Aba: ENEM4" — o nome real da aba no arquivo é `ENEM 4`, com espaço).

### Aba `ENEM 4`

Layout igual ao de ciclos anteriores — colunas `Escola | Nome do Aluno | Turma` (linha 1 = cabeçalho, linha 2 = exemplo padrão "SEGUIR O EXEMPLO" — mesmo aluno fictício "MARCOS FELLYPE DIAS DA SILVA" / ADAILE M LEITE usado nas abas `ALUNOS NOVOS - ENEM3` e `2408` da mesma planilha — excluído do `alunos_consolidado.csv`).

**66 linhas de dados → 65 reais (sem a linha-exemplo) → 64 após excluir 1 pendência (ver abaixo) → 63 no CSV final.**

Escolas envolvidas (13): CARMELO PERRONE, Dona Branca do N. M., GENÉSIO MORESCHI, Jardim Panorama, Jardim Universitário, Maria Pacheco, OURO VERDE, Olavo Bilac, Otalípio Pereira de Andrade, Papa João Paulo I, RODRIGUES ALVES, São Braz, jardm interlagos (typo na planilha, sem o "i" de "jardIm").

---

## Pendência levantada manualmente — requer decisão humana antes de prosseguir

**Aluna `SOPHIA OLINDA A. NOGUEIRA` (Jardim Panorama, 2ª Série A Regular)** — a planilha trouxe, na própria célula de turma, o texto `"2ª SERIE A REGULAR DUPLICIDADE DE RA"`. Isso indica que quem preencheu a planilha já sinalizou suspeita de RA duplicado para essa aluna.

**Ação tomada:** removida do `alunos_consolidado.csv` — **não** terá RA gerado neste ciclo até confirmação.

**Próximo passo (humano):** confirmar com a PM/escola se essa aluna já possui RA cadastrado antes de incluí-la (se sim, não cadastrar de novo; se for engano da planilha, adicionar de volta ao CSV e rodar o gerador para ela isoladamente).

---

## Resolução de IDs — 100% unmapeado neste ciclo (nenhuma combinação escola/turma pré-existia no registro)

Diferente de ciclos anteriores (que reaproveitavam a maioria das turmas já mapeadas), **nenhuma das 27 combinações escola/turma deste ciclo já estava em `resolve_ids_ra_impulso.sql`** — todas as 13 escolas são as mesmas de ciclos passados, mas a planilha trouxe formatos de turma diferentes (ex.: "Ano" em vez de "Série" para São Braz).

Processo usado:
1. `descobrir_ids_pendentes.sql` gerado para as 13 escolas (busca por nome aproximado).
2. Rodado em **homolog** via `rodar_descoberta_homolog.py` (novo script — usa pyodbc direto em vez do MCP, porque o resultado da query ampla passa do limite de tokens do MCP) → `candidatos_turmas_homolog.csv` (823 linhas).
3. `resolver_pendencias.py` cruzou as 27 pendências com os candidatos: **23 alta confiança, 4 para revisar, 1 sem candidato** (ver `values_alta_confianca.sql` para as 23 de alta confiança, já coladas no registro).
4. Os 5 casos restantes (4 revisar + 1 sem candidato) foram resolvidos manualmente, consultando o banco diretamente:
   - **Papa João Paulo I / "2ª Série Integral"** (24 alunos!) — a escola é 100% turno Integral; a planilha escreve "Integral" como se fosse o *tipo* da turma, mas no banco é o *turno*. Só existe 1 turma de 2ª série na escola (sem letra) → sem ambiguidade real, apesar do heurístico do resolver ter marcado como "tipo não encontrado".
   - **Olavo Bilac / "3ª Série A Integral"** — mesmo caso de turno×tipo; só existe 1 turma de 3ª série (letra A, turno I).
   - **Dona Branca do N. M. / "3ª Série A/D Regular"** — ambíguo por nome de turma porque `BRANCA DA MOTA FERNANDES` tem turmas idênticas (A/B/C/D - M) a `BRANCA DO N MIRANDA`. Resolvido pela abreviação do nome na planilha: "N. M." bate com "N Miranda", não com "da Mota Fernandes".
   - **Otalípio Pereira de Andrade** — escola nova no registro; nome completo no banco é `OTALIPIO P DE ANDRADE`. Só 1 turma de 3ª série Regular (A - M), sem ambiguidade.

Todos os 26 mapeamentos (21 alta confiança após remover 1 duplicata + 1 excluído por ser a pendência da Sophia + 5 manuais) foram adicionados a `resolve_ids_ra_impulso.sql` no bloco "Adicionado em out/26 — EFC-7017".

**Validado:** rodando `gerar_ra_impulso.py` com o CSV de IDs de **homolog**, os 63 alunos do `alunos_consolidado.csv` mapeiam **100%** (0 não mapeados).

---

## Status

- [x] Anexo do Jira baixado e salvo em `manual/EFC-7017/`
- [x] `alunos_consolidado.csv` gerado (63 alunos reais — 65 menos a linha-exemplo e menos a pendência de duplicidade de RA)
- [x] 26 combinações escola/turma novas adicionadas a `resolve_ids_ra_impulso.sql` e validadas em **homolog** (100% mapeado)
- [ ] **Pendência humana:** confirmar com a PM se `SOPHIA OLINDA A. NOGUEIRA` já tem RA (ver seção acima) — **ainda não resolvida, ela não está no lote gerado**
- [x] Query 1 rodada em **produção** (2026-10-09) — CSV `2026-10-09_to_ra_manual_producao.csv` (170 mapeamentos)
- [x] Query 2 rodada em **produção** (2026-10-09) — próximo RA: `90929792`
- [x] `gerar_ra_impulso.py` rodado com o CSV de produção → `ra_alunos_impulso.sql` (63 alunos, 100% mapeados, RAs `90929792`–`90929854`)
- [ ] SQL executado em produção (próximo passo — manual, ver abaixo)
- [x] Lista final de confirmação gerada: `lista_final_efc_7017.csv`

### Próximo passo

Executar `manual/EFC-7017/ra_alunos_impulso.sql` no banco de **produção** (idempotente — pode rodar de novo com segurança). Depois conferir a lista `lista_final_efc_7017.csv` e, se tudo certo, decidir o caso da Sophia Olinda (incluí-la depois exige novo `--ra-start`, não reaproveitar `90929855` sem reconsultar).
