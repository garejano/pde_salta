import csv
import re

BASE = r"C:\projects\pde_salta\projetos\migracao_doc_ped\base_doc_ped_csv"
SCRATCH = r"C:\Users\gustavo.arejano\AppData\Local\Temp\claude\c--projects-pde-salta\03ab7226-5d74-40bf-9d04-94b06ea0ee8d\scratchpad"
NATIVE_REDE_CSV = SCRATCH + r"\rede_native.csv"
NATIVE_ESCOLA_CSV = SCRATCH + r"\escola_native.csv"
NATIVE_SERIE_CSV = SCRATCH + r"\serie_native.csv"
OUT = r"c:\projects\estrutura-pedagogica\backend\Scripts\documentacao-pedagogica-configuracoes-seed-dados.sql"

def read_csv(name):
    with open(f"{BASE}\\{name}", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))

def b(v):
    return "1" if v.strip().lower() == "true" else "0"

def s(v):
    # Alguns campos de texto do doc-ped vêm com dezenas/centenas de espaços/tabs consecutivos
    # (artefato de exportação, ex.: Id 860 de fundamentacao_legal.csv, que chega a ~4000
    # caracteres de puro espaçamento e estoura NVARCHAR(2000)) — colapsar para 1 espaço não
    # perde conteúdo real, só a formatação espúria.
    v = re.sub(r"[ \t]{2,}", " ", (v or "")).strip()
    if not v:
        return "NULL"
    return "N'" + v.replace("'", "''") + "'"

native = {}
with open(NATIVE_REDE_CSV, encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        native[r["Hash"].strip().lower()] = int(r["Id"])

rede_rows = read_csv("rede.csv")
cert_rows = read_csv("rede_certificado_conclusao.csv")
fl_rows = read_csv("fundamentacao_legal.csv")
brasao_rows = read_csv("brasao.csv")
tipo_cert_rows = read_csv("tipo_certificado_conclusao.csv")
escola_rows = read_csv("escola.csv")
serie_rows_csv = read_csv("serie.csv")
serie_nomenclatura_rows = read_csv("serie_nomenclatura_por_rede.csv")

brasao_nome = {r["Id"]: r["Nome"].strip().lower() for r in brasao_rows}
tipo_cert_nome = {r["Id"]: r["Nome"].strip() for r in tipo_cert_rows}

# docped Rede.Id -> native dbo.Rede.Id
rede_native_id = {}
for r in rede_rows:
    h = r["HashOrigem"].strip().lower()
    rede_native_id[r["Id"]] = native[h]

native_escola = {}
with open(NATIVE_ESCOLA_CSV, encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        native_escola[r["Hash"].strip().lower()] = int(r["Id"])

native_serie = {}
with open(NATIVE_SERIE_CSV, encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        native_serie[r["Hash"].strip().lower()] = int(r["Id"])

# docped Escola.Id -> native dbo.Escola.Id (only for HashOrigem that resolved)
escola_native_id = {}
escola_unresolved = []
for r in escola_rows:
    h = r["HashOrigem"].strip().lower()
    if h in native_escola:
        escola_native_id[r["Id"]] = native_escola[h]
    else:
        escola_unresolved.append(r)

# docped Serie.Id -> native dbo.Serie.Id
serie_native_id = {}
for r in serie_rows_csv:
    h = r["HashOrigem"].strip().lower()
    serie_native_id[r["Id"]] = native_serie[h]

lines = []
lines.append("-- Migração documentacao-pedagogica → estrutura-pedagogica — seed de dados (Card 1)")
lines.append("-- Gerado a partir dos CSVs em projetos/migracao_doc_ped/base_doc_ped_csv (pde_salta).")
lines.append("-- Fonte: doc-ped.Rede / RedeCertificadoConclusao / FundamentacaoLegal / Escola / Serie / SerieNomenclaturaPorRede.")
lines.append("-- 41 redes com configuração cadastrada no doc-ped (das 67 redes nativas existentes, só essas 41 têm HashOrigem em rede.csv);")
lines.append(f"-- {len(escola_native_id)} de {len(escola_rows)} escolas resolvidas contra dbo.Escola nativo; todas as {len(serie_rows_csv)} séries de serie.csv resolvidas contra dbo.Serie nativo.")
lines.append("--")
lines.append("-- Rodar depois de documentacao-pedagogica-configuracoes-schema.sql.")
lines.append("--")
lines.append("-- Convenções:")
lines.append("--  * RedeId/EscolaId/SerieId são resolvidos via HashOrigem (doc-ped) -> Hash nativo, já traduzidos para o Id nativo literal abaixo.")
lines.append("--  * Hash das novas linhas usa o DEFAULT NEWID() da tabela — não reaproveita o Hash do doc-ped.")
lines.append("--  * UsuarioInclusao/UsuarioUltimaAlteracao/UsuarioInativacao ficam NULL — os valores do doc-ped são Usuario.Id de outra base e não têm correspondência garantida aqui.")
lines.append("--  * ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica.ConfiguracaoRedeDocumentacaoPedagogicaId e ConfiguracaoRedeSerieNomenclatura.ConfiguracaoRedeDocumentacaoPedagogicaId são resolvidos por subquery (via RedeId), não por Id literal — evita depender da ordem/numeração dos INSERTs acima.")
lines.append("--")
lines.append("-- NÃO incluído nesta leva:")
lines.append(f"--  * {len(escola_unresolved)} linhas de escola.csv sem Escola nativa correspondente (Hash não encontrado em dbo.Escola) — ver comentário antes do INSERT de ConfiguracaoEscolaDocumentacaoPedagogica.")
lines.append("")

# ---------------------------------------------------------------------------
# 1) ConfiguracaoRedeDocumentacaoPedagogica
# ---------------------------------------------------------------------------
lines.append("-- ============================================================================")
lines.append(f"-- ConfiguracaoRedeDocumentacaoPedagogica ({len(rede_rows)} redes)")
lines.append("-- ============================================================================")

cols = [
    "RedeId",
    "ExibirTituloCentralizadoNoDocumento", "NotasComUmaCasaDecimal", "StatusAprovadoPeloConselho",
    "ExibirAlunosApenasNaTurmaMaisRecente",
    "IncluirBrasao", "UtilizaBrasaoUnesco", "UtilizaBrasaoDoPais", "PossuiObservacao", "Observacao",
    "PossuiCertificadoConclusao", "NomeTipoCertificadoConclusao", "OcultarResultadosParciais",
    "AgruparFundamentacaoLegalNoCertificado", "DocumentoSeparadoPorSegmento", "RealcarImpressao",
    "DeveAgruparPorAreaDoConhecimento", "ExibirMinimoAprovacaoHistorico",
    "ExibirItinerarioSeparadamenteNoDocumento", "ExibirCargaHorariaTotalEM",
    "ExibirRegistroPublicacaoEnsinoMedio",
    "FichaIndividualResumida", "OcultarResultadosParciaisFichaIndividual",
    "ExibirCargaHorariaFichaIndividual", "ExibirRaDigitalFichaIndividual",
    "AtaDeResultadosPorSerie", "ExibirCodigoINEPNaAtaDeResultadosFinais",
    "ExibirRADigitalNaAtaDeResultadosFinais", "ExibirCargaHorariaPorDisciplina",
    "ExibirTransferidoComoResultado", "ExibirFrequenciaNaAtaDeResultadosFinais",
    "ExibirResultadoFinalAbreviadoNaAtaDeResultadosFinais",
    "ExibirApenasAlunosAtivosNaAtaDeResultadosFinais", "ComplementoAta",
    "OrdemDataMatriculaLivroMatricula", "AgruparPorSegmentoLivroMatricula",
    "ExibirRaLivroMatricula", "ExibirRaDigitalLivroMatricula", "ExibirCodigoINEPLivroMatricula",
]
lines.append(f"INSERT INTO DocumentacaoPedagogica.ConfiguracaoRedeDocumentacaoPedagogica ({', '.join(cols)})")
lines.append("VALUES")
value_lines = []
for r in rede_rows:
    tipo_cert = tipo_cert_nome.get(r["TipoCertificadoConclusao"].strip(), "") if r["TipoCertificadoConclusao"].strip() else ""
    vals = [
        str(rede_native_id[r["Id"]]),
        b(r["ExibirTituloCentralizadoNoDocumento"]), b(r["NotasComUmaCasaDecimal"]), b(r["StatusAprovadoPeloConselho"]),
        b(r["ExibirAlunosApenasNaTurmaMaisRecente"]),
        b(r["IncluirBrasao"]), b(r["UtilizaBrasaoUnesco"]), b(r["UtilizaBrasaoDoPais"]), b(r["PossuiObservacao"]), s(r["Observacao"]),
        b(r["PossuiCertificadoConclusao"]), s(tipo_cert), b(r["OcultarResultadosParciais"]),
        b(r["AgruparFundamentacaoLegalNoCertificado"]), b(r["DocumentoSeparadoPorSegmento"]), b(r["RealcarImpressao"]),
        b(r["DeveAgruparPorAreaDoConhecimento"]), b(r["ExibirMinimoAprovacaoHistorico"]),
        b(r["ExibirItinerarioSeparadamenteNoDocumento"]), b(r["ExibirCargaHorariaTotalEM"]),
        b(r["ExibirRegistroPublicacaoEnsinoMedio"]),
        b(r["FichaIndividualResumida"]), b(r["OcultarResultadosParciaisFichaIndividual"]),
        b(r["ExibirCargaHorariaFichaIndividual"]), b(r["ExibirRaDigitalFichaIndividual"]),
        b(r["AtaDeResultadosPorSerie"]), b(r["ExibirCodigoINEPNaAtaDeResultadosFinais"]),
        b(r["ExibirRADigitalNaAtaDeResultadosFinais"]), b(r["ExibirCargaHorariaPorDisciplina"]),
        b(r["ExibirTransferidoComoResultadoNaAtaDeResultadosFinais"]), b(r["ExibirFrequenciaNaAtaDeResultadosFinais"]),
        b(r["ExibirResultadoFinalAbreviadoNaAtaDeResultadosFinais"]),
        b(r["ExibirApenasAlunosAtivosNaAtaDeResultadosFinais"]), s(r["Complemento"]),
        b(r["OrdemDataMatriculaLivroMatricula"]), b(r["AgruparPorSegmentoLivroMatricula"]),
        b(r["ExibirRaLivroMatricula"]), b(r["ExibirRaDigitalLivroMatricula"]), b(r["ExibirCodigoINEPLivroMatricula"]),
    ]
    value_lines.append((f"({', '.join(vals)})", r['Nome']))
sql_lines = []
for i, (tup, name) in enumerate(value_lines):
    sep = "," if i < len(value_lines) - 1 else ""
    sql_lines.append(f"   {tup}{sep}  -- {name}")
lines.append("\n".join(sql_lines) + ";")
lines.append("GO")
lines.append("")

# ---------------------------------------------------------------------------
# 2) ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica
# ---------------------------------------------------------------------------
lines.append("-- ============================================================================")
lines.append(f"-- ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica ({len(cert_rows)} redes)")
lines.append("-- ============================================================================")
cert_cols = [
    "ConfiguracaoRedeDocumentacaoPedagogicaId",
    "TipoBrasaoEsquerda", "TipoBrasaoCentro", "TipoBrasaoDireita",
    "LeiTermo", "PossuiMolduraLinhas", "PossuiMolduraLinear", "MolduraCor",
    "AgruparPorAreaConnhecimento", "ExibirInformacoesDeRegistro", "ExibirMinutosEmCH",
    "ExibirNomeResponsaveis", "ExibirCPF", "ExibirDisciplinasEmDuasColunas",
    "ExibirAssinaturaFrenteSecretaria", "Complemento",
]
lines.append(f"INSERT INTO DocumentacaoPedagogica.ConfiguracaoCertificadoConclusaoDocumentacaoPedagogica ({', '.join(cert_cols)})")
lines.append("VALUES")
cert_value_lines = []
for r in cert_rows:
    native_rede_id = rede_native_id[r["Rede"]]
    subquery = f"(SELECT Id FROM DocumentacaoPedagogica.ConfiguracaoRedeDocumentacaoPedagogica WHERE RedeId = {native_rede_id})"
    def brasao(v):
        v = v.strip()
        return s(brasao_nome[v]) if v else "NULL"
    vals = [
        subquery,
        brasao(r["BrasaoEsquerda"]), brasao(r["BrasaoCentro"]), brasao(r["BrasaoDireita"]),
        s(r["LeiTermo"]), b(r["PossuiMolduraLinhas"]), b(r["PossuiMolduraLinear"]), s(r["MolduraCor"]),
        b(r["AgruparPorAreaConnhecimento"]), b(r["ExibirInformacoesDeRegistro"]), b(r["ExibirMinutosEmCH"]),
        b(r["ExibirNomeResponsaveis"]), b(r["ExibirCPF"]), b(r["ExibirDisciplinasEmDuasColunas"]),
        b(r["ExibirAssinaturaFrenteSecretaria"]), s(r["Complemento"]),
    ]
    rede_nome = next((rr["Nome"] for rr in rede_rows if rr["Id"] == r["Rede"]), "?")
    cert_value_lines.append((f"({', '.join(vals)})", rede_nome))
cert_sql_lines = []
for i, (tup, name) in enumerate(cert_value_lines):
    sep = "," if i < len(cert_value_lines) - 1 else ""
    cert_sql_lines.append(f"   {tup}{sep}  -- {name}")
lines.append("\n".join(cert_sql_lines) + ";")
lines.append("GO")
lines.append("")

# ---------------------------------------------------------------------------
# 3) FundamentacaoLegal
# ---------------------------------------------------------------------------
lines.append("-- ============================================================================")
lines.append(f"-- FundamentacaoLegal ({len(fl_rows)} linhas)")
lines.append("-- ============================================================================")
lines.append("INSERT INTO DocumentacaoPedagogica.FundamentacaoLegal (RedeId, Descricao, Ativo)")
lines.append("VALUES")
fl_value_lines = []
for r in fl_rows:
    native_rede_id = rede_native_id[r["Rede"]]
    vals = [str(native_rede_id), s(r["Descricao"]), b(r["Ativo"])]
    fl_value_lines.append(f"   ({', '.join(vals)})")
lines.append(",\n".join(fl_value_lines) + ";")
lines.append("GO")
lines.append("")

# ---------------------------------------------------------------------------
# 4) ConfiguracaoEscolaDocumentacaoPedagogica
# ---------------------------------------------------------------------------
lines.append("-- ============================================================================")
lines.append(f"-- ConfiguracaoEscolaDocumentacaoPedagogica ({len(escola_native_id)} escolas)")
if escola_unresolved:
    lines.append("--")
    lines.append(f"-- {len(escola_unresolved)} escolas do escola.csv NÃO entraram — Hash não encontrado em dbo.Escola nativo:")
    for r in escola_unresolved:
        lines.append(f"--   Id={r['Id']} Nome='{r['Nome']}' HashOrigem={r['HashOrigem']}")
lines.append("-- ============================================================================")
escola_cols = [
    "EscolaId", "NomeExibicao", "MostrarCabecalho", "PossuiCabecalho", "Cabecalho",
    "PossuiAssinaturaSecretaria", "AssinaturaSecretaria", "PossuiAssinaturaDiretor", "AssinaturaDiretor",
    "PossuiAssinaturaProfInspetor", "AssinaturaProfInspetor", "PossuiAssinaturaCoordenador",
    "AssinaturaCoordenadorEnsinoFundamental", "AssinaturaCoordenadorEnsinoMedio",
    "AssinaturaEmTodasAsFolhas", "CargaHorariaPorDisciplina", "ExibirFiliacao", "Ativo",
]
lines.append(f"INSERT INTO DocumentacaoPedagogica.ConfiguracaoEscolaDocumentacaoPedagogica ({', '.join(escola_cols)})")
lines.append("VALUES")
escola_value_lines = []
for r in escola_rows:
    if r["Id"] not in escola_native_id:
        continue
    vals = [
        str(escola_native_id[r["Id"]]), s(r["NomeExibicao"]), b(r["MostrarCabecalho"]), b(r["PossuiCabecalho"]), s(r["Cabecalho"]),
        b(r["PossuiAssinaturaSecretaria"]), s(r["AssinaturaSecretaria"]), b(r["PossuiAssinaturaDiretor"]), s(r["AssinaturaDiretor"]),
        b(r["PossuiAssinaturaProfInspetor"]), s(r["AssinaturaProfInspetor"]), b(r["PossuiAssinaturaCoordenador"]),
        s(r["AssinaturaCoordenadorEnsinoFundamental"]), s(r["AssinaturaCoordenadorEnsinoMedio"]),
        b(r["AssinaturaEmTodasAsFolhas"]), b(r["CargaHorariaPorDisciplina"]), b(r["ExibirFiliacao"]), b(r["Ativo"]),
    ]
    escola_value_lines.append((f"({', '.join(vals)})", r["Nome"]))
escola_sql_lines = []
for i, (tup, name) in enumerate(escola_value_lines):
    sep = "," if i < len(escola_value_lines) - 1 else ""
    escola_sql_lines.append(f"   {tup}{sep}  -- {name}")
lines.append("\n".join(escola_sql_lines) + ";")
lines.append("GO")
lines.append("")

# ---------------------------------------------------------------------------
# 5) ConfiguracaoRedeSerieNomenclatura
# ---------------------------------------------------------------------------
lines.append("-- ============================================================================")
lines.append(f"-- ConfiguracaoRedeSerieNomenclatura ({len(serie_nomenclatura_rows)} linhas)")
lines.append("-- ============================================================================")
lines.append("INSERT INTO DocumentacaoPedagogica.ConfiguracaoRedeSerieNomenclatura (ConfiguracaoRedeDocumentacaoPedagogicaId, SerieId, Nomenclatura)")
lines.append("VALUES")
sn_value_lines = []
for r in serie_nomenclatura_rows:
    native_rede_id = rede_native_id[r["Rede"]]
    subquery = f"(SELECT Id FROM DocumentacaoPedagogica.ConfiguracaoRedeDocumentacaoPedagogica WHERE RedeId = {native_rede_id})"
    native_serie_id = serie_native_id[r["Serie"]]
    vals = [subquery, str(native_serie_id), s(r["Nomenclatura"])]
    sn_value_lines.append(f"   ({', '.join(vals)})")
lines.append(",\n".join(sn_value_lines) + ";")
lines.append("GO")
lines.append("")

with open(OUT, "w", encoding="utf-8-sig") as f:
    f.write("\n".join(lines))

print("wrote", OUT)
print("rede rows:", len(rede_rows), "cert rows:", len(cert_rows), "fl rows:", len(fl_rows))
print("escola resolved:", len(escola_native_id), "escola unresolved:", len(escola_unresolved))
print("serie nomenclatura rows:", len(serie_nomenclatura_rows))
