import csv
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
csv.field_size_limit(2**31 - 1)

BASE = r"C:\projects\pde_salta\projetos\migracao_doc_ped\base_doc_ped_csv"
SCRATCH = r"C:\Users\gustavo.arejano\AppData\Local\Temp\claude\c--projects-pde-salta\27ec0da7-117d-414b-85c2-5b012dfe4840\scratchpad"
OUT_DIR = BASE + r"\output"
SCRIPTS_DIR = r"C:\projects\estrutura-pedagogica\backend\Scripts"

import os
os.makedirs(OUT_DIR, exist_ok=True)


def norm_ws(v):
    return re.sub(r"[ \t]{2,}", " ", (v or "")).strip()


def b(v):
    return (v or "").strip().lower() == "true"


def sql_bit(v):
    return "1" if b(v) else "0"


def sql_str(v):
    v = norm_ws(v)
    if not v:
        return "NULL"
    return "N'" + v.replace("'", "''") + "'"


# ---------------------------------------------------------------------------
# 1) Lookups pequenos (carregados inteiros em memória)
# ---------------------------------------------------------------------------

def load_native_hash_map(fn):
    m = {}
    with open(fn, encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f):
            m[r["Hash"].strip().lower()] = int(r["Id"])
    return m


native_rede = load_native_hash_map(SCRATCH + r"\rede_native.csv")
native_escola = load_native_hash_map(SCRATCH + r"\escola_native.csv")
native_serie = load_native_hash_map(SCRATCH + r"\serie_native.csv")

# docped Escola.Id -> native dbo.Escola.Id (via HashOrigem)
escola_native_id = {}
with open(BASE + r"\escola.csv", encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        h = r["HashOrigem"].strip().lower()
        if h in native_escola:
            escola_native_id[r["Id"]] = native_escola[h]

# docped Serie.Id -> native dbo.Serie.Id (via HashOrigem)
serie_native_id = {}
with open(BASE + r"\serie.csv", encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        h = r["HashOrigem"].strip().lower()
        if h in native_serie:
            serie_native_id[r["Id"]] = native_serie[h]

print(f"escola_native_id: {len(escola_native_id)} resolvidos")
print(f"serie_native_id: {len(serie_native_id)} resolvidos")

# docped AnoLetivo.Id -> native dbo.AnoLetivo.Id (== Nome, o ano em si)
anoletivo_native_id = {}
with open(BASE + r"\ano_letivo.csv", encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        anoletivo_native_id[r["Id"]] = int(r["Nome"])
print(f"anoletivo_native_id: {len(anoletivo_native_id)} carregados")

# docped EscolaExterna.Id -> Nome (texto livre, sem resolução nativa)
escola_externa_nome = {}
with open(BASE + r"\escola_externa.csv", encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        escola_externa_nome[r["Id"]] = r["Nome"]
print(f"escola_externa_nome: {len(escola_externa_nome)} carregados")

# docped TipoResultadoFinal.Id -> Sigla (chave natural pro JOIN no resolve final)
tipo_resultado_final_sigla = {}
tipo_resultado_final_rows = []
with open(BASE + r"\tipo_resultado_final.csv", encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        tipo_resultado_final_sigla[r["Id"]] = r["Sigla"]
        tipo_resultado_final_rows.append(r)
print(f"tipo_resultado_final: {len(tipo_resultado_final_rows)} linhas")

# docped FundamentacaoLegal.Id -> destino FundamentacaoLegal.Id
# A inserção do Card 1 seguiu a ordem exata de fundamentacao_legal.csv (sem reordenar),
# gerando Ids sequenciais 119..337 (219 linhas, confirmado via SELECT). Mapeamento posicional.
fundamentacao_legal_destino_id = {}
with open(BASE + r"\fundamentacao_legal.csv", encoding="utf-8-sig", newline="") as f:
    fl_rows = list(csv.DictReader(f))
FL_FIRST_ID = 119
FL_LAST_ID = 337
assert len(fl_rows) == (FL_LAST_ID - FL_FIRST_ID + 1), \
    f"fundamentacao_legal.csv tem {len(fl_rows)} linhas, esperado {FL_LAST_ID - FL_FIRST_ID + 1}"
for i, r in enumerate(fl_rows):
    fundamentacao_legal_destino_id[r["Id"]] = FL_FIRST_ID + i
print(f"fundamentacao_legal_destino_id: {len(fundamentacao_legal_destino_id)} mapeados (119..337)")

print("--- lookups pequenos OK ---")

# ---------------------------------------------------------------------------
# 2) Historico — carrega tudo (341K linhas, ~65MB, cabe em memória)
# ---------------------------------------------------------------------------
with open(BASE + r"\historico.csv", encoding="utf-8-sig", newline="") as f:
    historico_rows = list(csv.DictReader(f))
print(f"historico.csv: {len(historico_rows)} linhas")

needed_usuario_ids = {r["Usuario"] for r in historico_rows}
print(f"UsuarioId distintos referenciados: {len(needed_usuario_ids)}")

# docped Usuario.Id -> HashOrigem (só os referenciados por historico.csv)
usuario_hashorigem = {}
with open(BASE + r"\usuario.csv", encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        if r["Id"] in needed_usuario_ids and r["HashOrigem"].strip():
            usuario_hashorigem[r["Id"]] = r["HashOrigem"].strip().lower()
print(f"usuario.csv: {len(usuario_hashorigem)} de {len(needed_usuario_ids)} resolveram HashOrigem")

needed_hashes = set(usuario_hashorigem.values())

# native dbo.Usuario.Hash -> PessoaId (só os hashes que precisamos, filtrado em streaming)
hash_to_pessoa = {}
with open(BASE + r"\usuario_nativo.csv", encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        h = r["Hash"].strip().lower()
        if h in needed_hashes:
            hash_to_pessoa[h] = int(r["Pessoa"])
print(f"usuario_nativo.csv: {len(hash_to_pessoa)} de {len(needed_hashes)} hashes resolvidos contra dbo.Usuario")

# docped UsuarioId -> native PessoaId
usuario_pessoa_id = {
    uid: hash_to_pessoa[h]
    for uid, h in usuario_hashorigem.items()
    if h in hash_to_pessoa
}
print(f"usuario_pessoa_id: {len(usuario_pessoa_id)} usuarios resolvidos até PessoaId nativo")

print("--- resolução de Usuario/Pessoa OK ---")

# ---------------------------------------------------------------------------
# 3) Historico -> historico_import.csv (pronto pra importar direto via DBeaver)
#    + docped_historico_id -> PessoaId (usado pelos staging de HistoricoSerie/Fundamentacao)
# ---------------------------------------------------------------------------
historico_id_to_pessoa = {}
seen_pessoa_ids = set()
dup_pessoa = 0
sem_pessoa = 0

HIST_COLS = ["PessoaId", "Ativo", "ObservacoesFundamental", "ObservacoesMedio",
             "ObservacoesCertificado", "NumeroRegistroCertificado",
             "FolhaRegistroCertificado", "LivroRegistroCertificado"]

with open(OUT_DIR + r"\historico_import.csv", "w", encoding="utf-8-sig", newline="") as out:
    w = csv.writer(out)
    w.writerow(HIST_COLS)
    for r in historico_rows:
        pessoa_id = usuario_pessoa_id.get(r["Usuario"])
        if pessoa_id is None:
            sem_pessoa += 1
            continue
        if pessoa_id in seen_pessoa_ids:
            # Historico.PessoaId é UNIQUE no destino — dois Usuario do doc-ped resolvendo pra
            # mesma Pessoa nativa não pode virar duas linhas. Mantém a primeira, descarta o resto.
            dup_pessoa += 1
            continue
        seen_pessoa_ids.add(pessoa_id)
        historico_id_to_pessoa[r["Id"]] = pessoa_id
        w.writerow([
            pessoa_id,
            "1" if b(r["Ativo"]) else "0",
            norm_ws(r["ObservacoesFundamental"]),
            norm_ws(r["ObservacoesMedio"]),
            norm_ws(r["ObservacoesCertificado"]),
            norm_ws(r["NumeroRegistroCertificado"]),
            norm_ws(r["FolhaRegistroCertificado"]),
            norm_ws(r["LivroRegistroCertificado"]),
        ])

print(f"historico_import.csv: {len(historico_id_to_pessoa)} linhas escritas")
print(f"  sem PessoaId resolvido: {sem_pessoa}")
print(f"  PessoaId duplicado (descartado): {dup_pessoa}")

# libera memória do historico_rows (não precisa mais, só do mapa historico_id_to_pessoa)
del historico_rows

# ---------------------------------------------------------------------------
# 4) HistoricoSerie -> historico_serie_staging.csv (streaming, ~1.19M linhas)
#    Carrega HistoricoId por PessoaId (resolvido no INSERT...SELECT final, não aqui).
# ---------------------------------------------------------------------------
def opt_int(v):
    v = (v or "").strip()
    return v if v else ""


HS_COLS = ["PessoaId", "SerieId", "AnoLetivoId", "EscolaId", "NomeEscolaExterna",
           "CursadoNoEleva", "SiglaTipoResultadoFinal", "DiasLetivos", "CargaHoraria",
           "CargaHorariaCalculada", "TotalPresenca", "PercentualFrequencia",
           "MinimoParaAprovacao", "ObservacoesAluno", "Ativo"]

hs_total = 0
hs_written = 0
hs_sem_historico = 0
hs_sem_serie = 0
hs_sem_anoletivo = 0

with open(BASE + r"\historico_serie.csv", encoding="utf-8-sig", newline="") as f, \
     open(OUT_DIR + r"\historico_serie_staging.csv", "w", encoding="utf-8-sig", newline="") as out:
    r = csv.DictReader(f)
    w = csv.writer(out)
    w.writerow(HS_COLS)

    for row in r:
        hs_total += 1
        if hs_total % 200000 == 0:
            print(f"  historico_serie: {hs_total} lidas, {hs_written} escritas", flush=True)

        pessoa_id = historico_id_to_pessoa.get(row["Historico"])
        if pessoa_id is None:
            hs_sem_historico += 1
            continue

        serie_id = serie_native_id.get(row["Serie"])
        if serie_id is None:
            hs_sem_serie += 1
            continue

        ano_letivo_id = anoletivo_native_id.get(row["AnoLetivo"])
        if ano_letivo_id is None:
            hs_sem_anoletivo += 1
            continue

        escola_id = escola_native_id.get(row["Escola"], "") if row["Escola"].strip() else ""
        nome_escola_externa = escola_externa_nome.get(row["EscolaExterna"], "") if row["EscolaExterna"].strip() else ""
        sigla_tipo_resultado = tipo_resultado_final_sigla.get(row["TipoResultadoFinal"], "") if row["TipoResultadoFinal"].strip() else ""

        w.writerow([
            pessoa_id,
            serie_id,
            ano_letivo_id,
            escola_id,
            norm_ws(nome_escola_externa),
            "1" if b(row["CursadoNoEleva"]) else "0",
            sigla_tipo_resultado,
            opt_int(row["DiasLetivos"]),
            norm_ws(row["CargaHoraria"]),
            "1" if b(row["CargaHorariaCalculada"]) else "0",
            opt_int(row["TotalPresenca"]),
            norm_ws(row["PercentualFrequencia"]),
            norm_ws(row["MinimoParaAprovacao"]),
            norm_ws(row["ObservacoesAluno"]),
            "1" if b(row["Ativo"]) else "0",
        ])
        hs_written += 1

print(f"historico_serie_staging.csv: {hs_written} de {hs_total} linhas escritas")
print(f"  sem Historico resolvido: {hs_sem_historico}")
print(f"  sem Serie resolvida: {hs_sem_serie}")
print(f"  sem AnoLetivo resolvido: {hs_sem_anoletivo}")

# ---------------------------------------------------------------------------
# 5) HistoricoFundamentacao -> historico_fundamentacao_staging.csv (~20K linhas)
# ---------------------------------------------------------------------------
HF_COLS = ["PessoaId", "FundamentacaoLegalId", "Ativo"]

hf_total = 0
hf_written = 0
hf_sem_historico = 0
hf_sem_fundamentacao = 0

with open(BASE + r"\historico_funcamentacao.csv", encoding="utf-8-sig", newline="") as f, \
     open(OUT_DIR + r"\historico_fundamentacao_staging.csv", "w", encoding="utf-8-sig", newline="") as out:
    r = csv.DictReader(f)
    w = csv.writer(out)
    w.writerow(HF_COLS)

    for row in r:
        hf_total += 1
        pessoa_id = historico_id_to_pessoa.get(row["Historico"])
        if pessoa_id is None:
            hf_sem_historico += 1
            continue

        fundamentacao_id = fundamentacao_legal_destino_id.get(row["FundamentacaoLegal"])
        if fundamentacao_id is None:
            hf_sem_fundamentacao += 1
            continue

        w.writerow([pessoa_id, fundamentacao_id, "1" if b(row["Ativo"]) else "0"])
        hf_written += 1

print(f"historico_fundamentacao_staging.csv: {hf_written} de {hf_total} linhas escritas")
print(f"  sem Historico resolvido: {hf_sem_historico}")
print(f"  sem FundamentacaoLegal resolvida: {hf_sem_fundamentacao}")

# ---------------------------------------------------------------------------
# 6) TipoResultadoFinal — script pequeno de INSERT (estilo Card 1)
# ---------------------------------------------------------------------------
trf_lines = []
trf_lines.append("-- Migração documentacao-pedagogica → estrutura-pedagogica — Card 2 (Histórico do Aluno)")
trf_lines.append("-- Seed de TipoResultadoFinal — tabela de apoio nova, poucas linhas (lookup global).")
trf_lines.append("-- Gerado a partir de tipo_resultado_final.csv. Rodar ANTES do resolve de HistoricoSerie")
trf_lines.append("-- (documentacao-pedagogica-historico-aluno-seed-resolve.sql), que faz JOIN por Sigla.")
trf_lines.append("--")
trf_lines.append("-- Rodar depois de documentacao-pedagogica-historico-aluno-schema.sql.")
trf_lines.append("")
trf_lines.append("INSERT INTO DocumentacaoPedagogica.TipoResultadoFinal (Nome, Sigla, Aprovado, Reprovado, Dependencia)")
trf_lines.append("VALUES")
trf_value_lines = []
for r in tipo_resultado_final_rows:
    vals = [sql_str(r["Nome"]), sql_str(r["Sigla"]), sql_bit(r["Aprovado"]), sql_bit(r["Reprovado"]), sql_bit(r["Dependencia"])]
    trf_value_lines.append((f"({', '.join(vals)})", r["Nome"]))
trf_sql_lines = []
for i, (tup, nome) in enumerate(trf_value_lines):
    # separador (",": mais linhas vindo | ";": última linha) fica ANTES do comentário "--",
    # senão o "--" engole tudo até o fim da linha, incluindo o separador.
    sep = "," if i < len(trf_value_lines) - 1 else ";"
    trf_sql_lines.append(f"   {tup}{sep}  -- {nome}")
trf_lines.append("\n".join(trf_sql_lines))
trf_lines.append("GO")
trf_lines.append("")

with open(SCRIPTS_DIR + r"\documentacao-pedagogica-historico-aluno-seed-tiporesultadofinal.sql", "w", encoding="utf-8-sig") as f:
    f.write("\n".join(trf_lines))
print(f"wrote documentacao-pedagogica-historico-aluno-seed-tiporesultadofinal.sql ({len(tipo_resultado_final_rows)} linhas)")

print()
print("=== RESUMO ===")
print(f"Historico:              {len(historico_id_to_pessoa)} linhas -> historico_import.csv")
print(f"HistoricoSerie:         {hs_written} linhas -> historico_serie_staging.csv")
print(f"HistoricoFundamentacao: {hf_written} linhas -> historico_fundamentacao_staging.csv")
print(f"TipoResultadoFinal:     {len(tipo_resultado_final_rows)} linhas -> seed-tiporesultadofinal.sql")
