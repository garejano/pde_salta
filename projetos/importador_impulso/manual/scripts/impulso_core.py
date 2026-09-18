"""
Núcleo reaproveitável do importador de RA Impulso: normalização de nomes,
leitura de alunos (Excel/CSV), carregamento do CSV de IDs e geração dos
INSERTs SQL. Usado por gerar_ra_impulso.py e pelos módulos novos do CLI
(mapping_registry.py, validacao.py, pendencia_writer.py).

Ver projetos/importador_impulso/manual/guide.md para o processo completo e
projetos/importador_impulso/cli-development.md para o plano do CLI.
"""

import csv
import glob
import os
import re

ANO_LETIVO          = 2026
ADMIN_USUARIO_ID    = 1
PERFIL_ACESSO_ALUNO = 1


# ---------------------------------------------------------------------------
# Normalização (deve ser idêntica à usada ao gerar o CSV via SQL)
# ---------------------------------------------------------------------------
def normalize_escola(nome):
    if nome is None:
        return ""
    s = nome.strip().upper()
    for orig, rep in [
        ("Á","A"),("Â","A"),("Ã","A"),("À","A"),
        ("É","E"),("Ê","E"),("È","E"),
        ("Í","I"),("Î","I"),
        ("Ó","O"),("Ô","O"),("Õ","O"),
        ("Ú","U"),("Û","U"),
        ("Ç","C"),
    ]:
        s = s.replace(orig, rep)
    return s.rstrip()


def normalize_turma(turma):
    if turma is None:
        return ""
    s = turma.strip().upper()
    for orig, rep in [
        ("Á","A"),("Â","A"),("Ã","A"),("À","A"),
        ("É","E"),("Ê","E"),("È","E"),
        ("Í","I"),("Î","I"),
        ("Ó","O"),("Ô","O"),("Õ","O"),
        ("Ú","U"),("Û","U"),
        ("Ç","C"),
        # todos os símbolos ordinais/grau → o
        ("º","o"),("ª","o"),("°","o"),
    ]:
        s = s.replace(orig, rep)
    return re.sub(r'\s+', ' ', s).strip()


# ---------------------------------------------------------------------------
# Carregamento do CSV de IDs (saída da Query 1 de resolve_ids_ra_impulso.sql)
# ---------------------------------------------------------------------------
_ENV_ALIAS = {
    "homolog":     "homolog",
    "homologacao": "homolog",
    "producao":    "producao",
}


def encontrar_csv(diretorio, env_filtro=None):
    padrao = os.path.join(diretorio, "*_to_ra_manual_*.csv")
    candidatos = sorted(glob.glob(padrao))          # ordem alfabética = cronológica pelo prefixo YYYY-MM-DD
    if env_filtro:
        token = _ENV_ALIAS.get(env_filtro, env_filtro)  # normaliza alias
        candidatos = [c for c in candidatos if token in os.path.basename(c)]
    if not candidatos:
        return None
    return candidatos[-1]                            # mais recente


def carregar_mapping_csv(caminho_csv):
    mapping = {}
    linhas_invalidas = []
    with open(caminho_csv, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            try:
                escola_norm = row["escola_norm"].strip()
                turma_norm  = row["turma_norm"].strip()
                escola_id   = int(row["escola_id"])
                turma_id    = int(row["turma_id"])
                turma_nome  = row["turma_nome_banco"].strip()
                mapping[(escola_norm, turma_norm)] = (escola_id, turma_id, turma_nome)
            except (KeyError, ValueError) as e:
                linhas_invalidas.append((i, str(e), row))
    if linhas_invalidas:
        print("AVISO: linhas ignoradas no CSV:")
        for linha, erro, row in linhas_invalidas:
            print(f"  linha {linha}: {erro} — {row}")
    return mapping


# ---------------------------------------------------------------------------
# Geração de INSERTs
# ---------------------------------------------------------------------------
def escape_sql(s):
    return s.replace("'", "''")


def gerar_inserts(nome, ra_str, escola_id, turma_id):
    n = escape_sql(nome)
    return [
        (f"INSERT INTO Pessoa (Nome, temp, CriacaoUsuario, CriacaoData, Ativo) "
         f"SELECT '{n}', '{ra_str}', x.Id, GetDate(), 1 "
         f"FROM Usuario AS x "
         f"LEFT JOIN Pessoa AS Pe ON Pe.Nome = '{n}' AND Pe.temp = '{ra_str}' "
         f"WHERE x.Id = {ADMIN_USUARIO_ID} AND Pe.Id IS null;"),

        (f"INSERT INTO Usuario (Pessoa, UsuarioInclusao, DataInclusao, Ativo) "
         f"SELECT Pe.Id, x.Id, GetDate(), 1 "
         f"FROM Usuario AS x "
         f"INNER JOIN Pessoa AS Pe ON Pe.Nome = '{n}' AND Pe.temp = '{ra_str}' "
         f"LEFT JOIN Usuario AS Us ON Us.Pessoa = Pe.Id "
         f"WHERE x.Id = {ADMIN_USUARIO_ID} AND Us.Id IS null;"),

        (f"INSERT INTO PessoaEscola (Pessoa, Escola, Matricula, CriacaoUsuario, CriacaoData, Ativo) "
         f"SELECT Pe.Id, {escola_id}, '{ra_str}', x.Id, GetDate(), 1 "
         f"FROM Usuario AS x "
         f"INNER JOIN Pessoa AS Pe ON Pe.Nome = '{n}' AND Pe.temp = '{ra_str}' "
         f"INNER JOIN Usuario AS Us ON Us.Pessoa = Pe.Id "
         f"LEFT JOIN PessoaEscola AS PeEs ON PeEs.Pessoa = Pe.Id AND PeEs.Escola = {escola_id} AND PeEs.Matricula = Pe.temp "
         f"WHERE x.Id = {ADMIN_USUARIO_ID} AND PeEs.Id IS null;"),

        (f"INSERT INTO PessoaEscolaAcesso (PessoaEscola, PerfilAcesso, temp, CriacaoUsuario, CriacaoData, Ativo) "
         f"SELECT PeEs.Id, {PERFIL_ACESSO_ALUNO}, '{ra_str}', x.Id, GetDate(), 1 "
         f"FROM Usuario AS x "
         f"INNER JOIN Pessoa AS Pe ON Pe.Nome = '{n}' AND Pe.temp = '{ra_str}' "
         f"INNER JOIN Usuario AS Us ON Us.Pessoa = Pe.Id "
         f"INNER JOIN PessoaEscola AS PeEs ON PeEs.Pessoa = Pe.Id AND PeEs.Escola = {escola_id} AND PeEs.Matricula = Pe.temp "
         f"LEFT JOIN PessoaEscolaAcesso AS PeEsAc ON PeEsAc.PessoaEscola = PeEs.Id AND PeEsAc.temp = Pe.temp AND PeEsAc.PerfilAcesso = {PERFIL_ACESSO_ALUNO} "
         f"WHERE x.Id = {ADMIN_USUARIO_ID} AND PeEsAc.Id IS null;"),

        (f"INSERT INTO AlunoEscola (AlunoEscola_key, Matricula, AnoLetivo, Turma, Status) "
         f"SELECT PeEsAc.Id, '{ra_str}', {ANO_LETIVO}, {turma_id}, 'Matriculado' "
         f"FROM Usuario AS x "
         f"INNER JOIN Pessoa AS Pe ON Pe.Nome = '{n}' AND Pe.temp = '{ra_str}' "
         f"INNER JOIN Usuario AS Us ON Us.Pessoa = Pe.Id "
         f"INNER JOIN PessoaEscola AS PeEs ON PeEs.Pessoa = Pe.Id AND PeEs.Escola = {escola_id} AND PeEs.Matricula = Pe.temp "
         f"INNER JOIN PessoaEscolaAcesso AS PeEsAc ON PeEsAc.PessoaEscola = PeEs.Id AND PeEsAc.temp = Pe.temp AND PeEsAc.PerfilAcesso = {PERFIL_ACESSO_ALUNO} "
         f"LEFT JOIN AlunoEscola AS AlEs ON AlEs.AlunoEscola_key = PeEsAc.Id "
         f"WHERE x.Id = {ADMIN_USUARIO_ID} AND AlEs.AlunoEscola_key IS null;"),
    ]


# ---------------------------------------------------------------------------
# Leitura dos alunos — de uma planilha (Excel) ou de um CSV já consolidado
# Layout esperado, em ambos os casos: Escola | Nome do Aluno | Turma
# ---------------------------------------------------------------------------
def ler_alunos_excel(excel_path, sheet_name):
    """Retorna (alunos, avisos). alunos: lista de (escola, nome, turma).
    avisos: linhas ignoradas por falta de escola/nome/turma, uma por dict
    {"linha": numero_da_linha_na_planilha, "nome": str|None, "motivo": str}."""
    import openpyxl
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    ws = wb[sheet_name]
    alunos = []
    avisos = []
    escola_atual = None
    for numero_linha, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        escola, nome, turma = row[0], row[1], row[2]
        if escola:
            escola_atual = str(escola).strip()
        if not nome:
            continue
        nome = nome.strip()
        if not escola_atual:
            avisos.append({"linha": numero_linha, "nome": nome, "motivo": "sem escola (preencher na planilha)"})
            continue
        if not turma:
            avisos.append({"linha": numero_linha, "nome": nome, "motivo": f"sem turma (escola: {escola_atual})"})
            continue
        alunos.append((escola_atual, nome, turma))
    return alunos, avisos


def ler_alunos_csv(csv_path):
    """Retorna (alunos, avisos) — mesmo formato de ler_alunos_excel."""
    alunos = []
    avisos = []
    with open(csv_path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for numero_linha, row in enumerate(reader, start=2):
            escola = (row.get("escola") or "").strip()
            nome   = (row.get("nome") or "").strip()
            turma  = (row.get("turma") or "").strip()
            if not (escola and nome and turma):
                faltando = [campo for campo, valor in [("escola", escola), ("nome", nome), ("turma", turma)] if not valor]
                avisos.append({"linha": numero_linha, "nome": nome or None, "motivo": f"faltando: {', '.join(faltando)}"})
                continue
            alunos.append((escola, nome, turma))
    return alunos, avisos
