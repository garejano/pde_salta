# EFC-6732 — Guia do ciclo (Simulado ENEM 3, ago/26)

> Processo geral, scripts e troubleshooting: [`../guide.md`](../guide.md). Este arquivo cobre só o que é específico deste ciclo.

Card: https://gruposalta.atlassian.net/browse/EFC-6732 (ver `cards/EFC-6732/EFC-6732.md` para o texto sincronizado do Jira).

---

## O que este ciclo pede

Simulado ENEM 3, aplicado nas próximas segundas-feiras. Duas necessidades na mesma planilha:

1. Alunos sem RA/matrícula (aba `ALUNOS NOVOS - ENEM3`).
2. Alunos que trocaram de escola parceira (aba `ALUNOS TRANSFERIDOS`) — precisam estar com a escola/turma certa no sistema antes do simulado, senão dá erro na emissão do Cartão Resposta (CR) e na entrega de resultado.

**Decisão validada com o time (2026-08-20): tratar os dois casos igual — os alunos "transferidos" são cadastrados como aluno novo, com tudo novo (novo RA), diretamente na escola/turma atual.** Não é preciso localizar o `Pessoa` antigo nem mexer no vínculo da escola de origem. Ver nota em `../guide.md#schema-do-banco`.

Isso significa que **não existem duas frentes de trabalho** — é um único processo de criação de RA, só que consolidando duas abas da planilha antes de rodar o gerador.

---

## Arquivo da planilha

`Turmas Impulso (ENEM2)_EFC_6732.xlsx` (nesta pasta). Tem 5 abas: `ALUNOS NOVOS - ENEM3`, `ALUNOS TRANSFERIDOS`, `RAs 2606`, `Todos`, `RAs`. Só as duas primeiras interessam para gerar RA.

### Aba `ALUNOS NOVOS - ENEM3`

Layout igual ao de ciclos anteriores — colunas `Escola | Nome do Aluno | Turma` (linha 1 = cabeçalho, linha 2 = exemplo a ignorar). **147 alunos, 20 escolas.**

> Atenção: o nome da aba mudou de `ALUNOS NOVOS` (ciclo EFC-6517) para `ALUNOS NOVOS - ENEM3` neste ciclo — passar `--sheet "ALUNOS NOVOS - ENEM3"` para o `gerar_ra_impulso.py`, não o default.

### Aba `ALUNOS TRANSFERIDOS`

Layout **diferente**: colunas `ESCOLA DE ORIGEM | NOME COMPLETO DO ALUNO | TURMA | ESCOLA ATUAL` (linha 1 = cabeçalho, linha 2 = exemplo a ignorar). **6 alunos.**

A coluna `TURMA` já está no formato/turma da **escola de destino** (`ESCOLA ATUAL`), confirmado cruzando com nomes de turma já mapeados em `resolve_ids_ra_impulso.sql` (ex.: "2A" em OLAVO BILAC bate com o mapeamento existente). Para esses 6 alunos, o `escola` a usar no processo de criação de RA é a coluna `ESCOLA ATUAL`, **não** `ESCOLA DE ORIGEM`.

Dados completos (para conferência, já traduzidos para o formato `escola,nome,turma` que o gerador espera):

| Escola (= ESCOLA ATUAL) | Aluno | Turma |
|---|---|---|
| CARMELO PERRONE | HEITOR BUENO ADIALA | 3ª Série Regular A - M |
| OLAVO BILAC | PHABLO RAFAEL SOARES LOPES | 2A |
| IEDA BAGGIO | Adriel Willian da Silva Filho | 3ºB |
| ZUMBI DOS PALMARES | Ana Clara Mendes da Anunciação | 2ª Série Regular A - I |
| Marilis Faria Pirotelli | Kimberlly Nicolly Tractes da Luz | 3ª Série Regular A - M |
| Teotonio Vilela | NATÁLIA RAUCH DE OLIVEIRA PEREIRA | 2ª Série Regular A - M |

(Escola de origem de cada um, só para referência/auditoria — não usada no cadastro: IEDA BAGGIO MAYER, UNIDADE POLO, ELEODORO, BANDEIRANTES, ELEODORO, EDITHE, respectivamente.)

---

## Antes de gerar o SQL — dados para não fazer coisa errada

1. **Consolidar as duas abas antes de rodar `gerar_ra_impulso.py`.** ✅ Feito — `alunos_consolidado.csv` nesta pasta, colunas `escola,nome,turma`: as 147 linhas de `ALUNOS NOVOS - ENEM3` + as 6 linhas de `ALUNOS TRANSFERIDOS` usando `ESCOLA ATUAL` como `escola`. Total: **153 alunos**.
2. **A planilha deste ciclo usa turma em formato diferente dos ciclos anteriores** — já bem parecido com o nome final do banco (com `º`/`ª`, ex.: `2ª Série Regular A - M`), em vez das abreviações usadas em mai/jun (`2A`, `2o SERIE REGULAR A`). Por isso **quase nada do registro atual em `resolve_ids_ra_impulso.sql` bate** com este ciclo, mesmo pra escolas que já apareceram antes. **Não é só `CARMELO PERRONE`** — a validação real (ver abaixo) achou **55 combinações escola/turma sem mapeamento**, cobrindo a maioria das 20 escolas de `ALUNOS NOVOS - ENEM3` e mais `IEDA BAGGIO`/`Marilis Faria Pirotelli` da aba de transferidos.
3. **Relatório de pendências gerado:** [`pendencia_importacao_EFC-6732.md`](pendencia_importacao_EFC-6732.md) (gerado pelo CLI em desenvolvimento — ver `../../cli-development.md`). Lista as 55 combinações faltantes, mais 2 nomes duplicados a conferir — um deles suspeito de erro real na planilha: `BECKER SANTIAGO GONZALEZ DE SEGNORIBUS` aparece em **duas escolas diferentes** (GENÉSIO MORESCHI e Maria Luiza F. Pacheco), provável copy-paste errado.

   **Fluxo pra resolver as 55 combinações (2 passos, em vez de descobrir cada uma no olho):**
   1. Rodar [`descobrir_ids_pendentes.sql`](descobrir_ids_pendentes.sql) em produção (uma única query) e exportar o resultado inteiro como `manual/EFC-6732/candidatos_turmas_producao.csv`.
   2. Rodar `python manual/scripts/resolver_pendencias.py --alunos-csv manual/EFC-6732/alunos_consolidado.csv --candidatos-csv manual/EFC-6732/candidatos_turmas_producao.csv` — cruza automaticamente e imprime 3 grupos: **alta confiança** (linha `VALUES` pronta pra colar, só conferir por cima), **revisar** (ambíguo ou tipo pedido — regular/técnico/etc. — não encontrado nos candidatos) e **sem candidato** (escola não achada na busca, pode ser nome muito diferente ou escola realmente nova).
   3. Colar as linhas de alta confiança em `manual/scripts/resolve_ids_ra_impulso.sql`, revisar as demais manualmente com o CSV de candidatos em mãos.
4. **Não confundir com o ciclo do EFC-6517 (jun/26).** Há trabalho não commitado desse ciclo anterior em `_scripts/` (`ra_alunos_impulso_enem2.sql` parcial, RA 90929601 em diante) — **é um ciclo diferente**, não misturar os RAs nem os arquivos. O `--ra-start` deste ciclo deve vir de uma nova consulta da Query 2 em produção/homolog, não reaproveitar o 90929601 do EFC-6517 sem checar se ele já foi consumido.
5. **Nomes de aluno com acento:** ao inspecionar a planilha via terminal/console, caracteres acentuados podem aparecer corrompidos (`�`) — isso é só exibição no console (encoding), o conteúdo real do arquivo está correto. Não "corrigir" nomes com base no que aparece no terminal.
6. **Produção:** a IA não tem acesso MCP a produção — a Query 1/2 em produção e a execução final do `ra_alunos_impulso.sql` em produção são sempre manuais (rodadas por você).

---

## Status

- [x] Planilha recebida e analisada (147 + 6 alunos)
- [x] Decisão de tratar "transferidos" como "novos" validada com o time
- [x] CSV consolidado (`alunos_consolidado.csv`) gerado
- [x] Validação de dados rodada — 55 combinações escola/turma sem mapeamento + 2 nomes duplicados a conferir (ver `pendencia_importacao_EFC-6732.md`)
- [x] `descobrir_ids_pendentes.sql` rodado em produção, exportado (`candidatos_turmas_producao.csv.csv`)
- [x] `resolver_pendencias.py` rodado: **48/55 alta confiança**, 0 sem candidato, 7 pra revisar manualmente (ver [`propostas_resolver_pendencias.txt`](propostas_resolver_pendencias.txt)) — durante a validação achei e corrigi 2 bugs reais de scoring (tipo como filtro obrigatório em vez de peso; tipo multi-rótulo; turno também como filtro obrigatório — sem isso `ZUMBI DOS PALMARES / 2ª Série Regular A - I` teria sido aceito como "alta confiança" sugerindo turno M mesmo a escola não tendo turno I)
- [x] **48 linhas de alta confiança já coladas em `manual/scripts/resolve_ids_ra_impulso.sql`** (seção "Adicionado em ago/26 — EFC-6732"). Registro agora tem 118 combinações (era 70). `pendencia_importacao_EFC-6732.md` regenerado — caiu de 55 para **7 pendências reais**:
  - `Gaspar Dutra / 3º LGG` — tipo "LGG" não existe entre as turmas da escola, melhor aproximação incerta
  - `Teotonio Vilela / 3°A` — ambíguo entre Regular/Técnico/Técnico ADM, planilha não diz o tipo
  - `Teotonio Vilela / 2°Alimentos` — tipo "Alimentos" não encontrado
  - `ZUMBI DOS PALMARES / 2ª Série Regular A - I` — turno "I" não existe nessa escola (só tem M e T) — provável erro na planilha, confirmar com a PM
  - `JARDIM PANORAMA / 2C` e `BRANCA DA MOTA FERNANDES / 3A` e `/3B` — só acharam turmas de apoio (`AEE`, `PAC`, `TREINO1BM`), a turma regular real pode ter nome bem diferente nessas escolas — vale checar direto no banco com um LIKE mais aberto
- [x] **`alunos_consolidado.csv` separado em 2 arquivos** (2026-08-20): 141 alunos já resolvidos + `alunos_pendentes.csv` com os 12 pendentes (colunas `motivo_pendencia`, `sugestao_turma_banco`, `sugestao_turma_id`) — repassado pra Emanuela Hardt (PM) confirmar a turma certa.
- [x] **Respostas da Emanuela (2026-08-20)** — todas as 7 pendências confirmadas:
  - Gaspar Dutra, Teotonio Vilela (3°A e 2°Alimentos), Zumbi dos Palmares → seguir a `sugestao_turma_banco` (confirmado sem alteração)
  - Jardim Panorama `2C` → **3ª Série Regular C - M** — corrigido: sugestão automática era `PAC` (turma de apoio), errada
  - Branca da Mota Fernandes `3A` → **3ª Série Regular A - M** (sugestão automática era `AEE`, errada)
  - Branca da Mota Fernandes `3B` → **3ª Série Regular B - M** (sugestão automática era `TREINO1BM`, errada)
  - As 3 correções (Jardim Panorama e as 2 do Branca da Mota) confirmam que o aviso do script estava certo em desconfiar — turmas de apoio (`PAC`/`AEE`/`TREINO1BM`) não eram a resposta.
- [x] **As 7 combinações adicionadas em `manual/scripts/resolve_ids_ra_impulso.sql`** (seção "Adicionado em ago/26 — EFC-6732, confirmado por Emanuela Hardt"). Registro agora com **125 combinações** (era 70 antes do ciclo).
- [x] `alunos_pendentes.csv` reincorporado — `alunos_consolidado.csv` de volta a **153 alunos**, todos resolvidos.
- [x] Validação final rodada: **0 pendências bloqueantes** (`pendencia_importacao_EFC-6732.md` regenerado, só resta o aviso de nomes duplicados).
- [x] Nomes duplicados conferidos (`BECKER SANTIAGO GONZALEZ DE SEGNORIBUS` em 2 escolas — provável erro na planilha, sem impacto bloqueante)
- [x] Query 1 rodada de novo em produção com o registro atualizado, `ra_alunos_impulso.sql` gerado e **executado em produção**
- [x] **Incidente (2026-08-21): RA duplicado — resolvido.** `gerar_ra_impulso.py` foi rodado com `--ra-start 90929601`, mas esse RA já pertencia a um aluno do ciclo EFC-6517 (EMILY GABRIELI BUENO CORDEIRO DE PAULA). O script só verifica idempotência por (Nome + temp), não por temp isolado — então criou um segundo `Pessoa` com o mesmo RA em vez de detectar a colisão. Corrigido via [`corrigir_ra_duplicado.sql`](corrigir_ra_duplicado.sql): o aluno do EFC-6732 (só ele, o único afetado) foi movido para o RA livre `90929754`. `COMMIT` executado e confirmado em produção (Passo 4 do script — sem RA duplicado remanescente, cadeia das 4 tabelas consistente, EMILY intocada). Faixa final do ciclo: **90929602 → 90929754** (153 alunos, contígua).
- [x] Query de conferência pós-correção rodada — sem RA duplicado remanescente.
- [x] Lista final entregue (Escola | Nome Aluno | RA | Turma) — [`lista_final_efc_6732.sql`](lista_final_efc_6732.sql), faixa `90929602`–`90929754`, repassada para Emanuela Hardt (PM).

**Ciclo concluído (2026-08-21).**
