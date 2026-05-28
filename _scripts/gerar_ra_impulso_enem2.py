"""
Gera os scripts SQL para cadastrar RAs dos alunos Impulso (ENEM2).

Uso (pode rodar de qualquer diretório):
    python _scripts/gerar_ra_impulso_enem2.py --ra-start 90929456
    python _scripts/gerar_ra_impulso_enem2.py --ra-start 90929456 --env homolog
    python _scripts/gerar_ra_impulso_enem2.py --ra-start 90929456 --env producao
    python _scripts/gerar_ra_impulso_enem2.py --ra-start 90929456 --csv _scripts/2026-05-28_to_ra_manual_producao.csv

--env aceita: homolog, homologacao, producao, producao
Sem --csv: detecta automaticamente o mais recente em _scripts/*_to_ra_manual_*.csv

Saída: _scripts/ra_alunos_impulso_enem2.sql
"""

import argparse
import csv
import glob
import os
import re
import sys

# Todos os paths são relativos à raiz do projeto (um nível acima de _scripts/)
_SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))
_ROOT        = os.path.dirname(_SCRIPT_DIR)

EXCEL_PATH  = os.path.join(_ROOT, "ra_alunos_impulso", "Turmas Impulso (ENEM2).xlsx")
OUTPUT_SQL  = os.path.join(_SCRIPT_DIR, "ra_alunos_impulso_enem2.sql")
SCRIPTS_DIR = _SCRIPT_DIR

ANO_LETIVO         = 2026
ADMIN_USUARIO_ID   = 1
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
# Carregamento do CSV de IDs
# ---------------------------------------------------------------------------
_ENV_ALIAS = {
    "homolog":     "homolog",
    "homologacao": "homolog",
    "producao":    "producao",
    "producao":    "producao",
}

def encontrar_csv(env_filtro=None):
    padrao = os.path.join(SCRIPTS_DIR, "*_to_ra_manual_*.csv")
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
# Leitura da planilha
# ---------------------------------------------------------------------------
def ler_alunos():
    import openpyxl
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
    ws = wb["ALUNOS NOVOS"]
    alunos = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        escola, nome, turma = row[0], row[1], row[2]
        if nome:
            alunos.append((escola, nome.strip(), turma))
    return alunos


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Gera SQL de cadastro de RAs Impulso ENEM2")
    parser.add_argument("--ra-start", type=int, required=True,
                        help="Próximo RA a usar (obtido de resolve_ids_ra_impulso.sql)")
    parser.add_argument("--csv", metavar="ARQUIVO",
                        help="CSV de IDs gerado por resolve_ids_ra_impulso.sql")
    parser.add_argument("--env", metavar="ENV",
                        help="Filtra auto-detecção do CSV por ambiente (homolog, homologacao, producao)")
    args = parser.parse_args()

    # --- localizar CSV ---
    csv_path = args.csv
    if not csv_path:
        csv_path = encontrar_csv(args.env)
        if not csv_path:
            print("ERRO: nenhum CSV encontrado em _scripts/*_to_ra_manual_*.csv")
            print("  Rode _scripts/resolve_ids_ra_impulso.sql e exporte o resultado.")
            sys.exit(1)

    env_detectado = "producao" if "producao" in os.path.basename(csv_path) else "homolog"
    print(f"CSV:         {csv_path}")
    print(f"Ambiente:    {env_detectado}")
    print(f"RA inicial:  {args.ra_start}")

    mapping = carregar_mapping_csv(csv_path)
    print(f"Mapeamentos carregados do CSV: {len(mapping)}")

    alunos = ler_alunos()
    print(f"Alunos na planilha: {len(alunos)}")

    ra = args.ra_start
    output = []
    nao_mapeados = []
    escola_atual = None

    output.append("-- ============================================================")
    output.append("-- Script gerado por gerar_ra_impulso_enem2.py")
    output.append(f"-- Ambiente: {env_detectado}  |  CSV: {os.path.basename(csv_path)}")
    output.append(f"-- AnoLetivo: {ANO_LETIVO}  |  RA inicial: {args.ra_start}")
    output.append("-- Queries idempotentes — podem ser reexecutadas com segurança")
    output.append("-- ============================================================")

    for escola_raw, nome, turma_raw in alunos:
        escola_norm = normalize_escola(escola_raw)
        turma_norm  = normalize_turma(turma_raw)
        key = (escola_norm, turma_norm)

        match = mapping.get(key)
        if match is None:
            nao_mapeados.append((escola_raw, nome, turma_raw, key))
            output.append(f"\n-- [NAO MAPEADO] {escola_raw!r} | {nome!r} | {turma_raw!r}")
            output.append(f"--   chave: {key}")
            continue

        escola_id, turma_id, turma_nome = match

        if escola_raw != escola_atual:
            output.append(f"\n\n-- --------------------------------------------------------")
            output.append(f"-- Escola: {escola_raw}  (Id={escola_id})")
            output.append(f"-- --------------------------------------------------------")
            escola_atual = escola_raw

        ra_str = str(ra)
        output.append(f"\n-- {nome} | RA: {ra_str} | {turma_nome} (Id={turma_id})")
        for stmt in gerar_inserts(nome, ra_str, escola_id, turma_id):
            output.append(stmt)
        ra += 1

    if nao_mapeados:
        output.append("\n\n-- ============================================================")
        output.append(f"-- NAO MAPEADOS ({len(nao_mapeados)}) — verificar CSV ou planilha")
        output.append("-- ============================================================")
        for escola_raw, nome, turma_raw, key in nao_mapeados:
            output.append(f"-- [{escola_raw}] {nome!r} | turma: {turma_raw!r}")
            output.append(f"--   chave normalizada: {key}")

    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write("\n".join(output))

    total_ok = len(alunos) - len(nao_mapeados)
    print(f"Mapeados:     {total_ok} / {len(alunos)}")
    print(f"Nao mapeados: {len(nao_mapeados)}")
    print(f"RAs usados:   {args.ra_start} -> {ra - 1}")
    print(f"SQL gerado:   {OUTPUT_SQL}")

    if nao_mapeados:
        print("\nNAO MAPEADOS:")
        for escola_raw, nome, turma_raw, key in nao_mapeados:
            print(f"  [{escola_raw}] {turma_raw!r} -> chave: {key}")
        sys.exit(1)


if __name__ == "__main__":
    main()
