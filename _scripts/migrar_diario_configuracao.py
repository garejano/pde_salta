"""
migrar_diario_configuracao.py
Migra DiarioClasseConfiguracao do banco PostgreSQL (documentacao-pedagogica)
para DiarioDeClasseConfiguracao no SQL Server (ElevaPortalHomolog / estrutura-pedagogica).

Pré-requisitos:
    pip install pyodbc psycopg2-binary

Configurar a conexão PostgreSQL via variáveis de ambiente antes de rodar:
    $env:DOCPED_HOST     = "host-do-banco"
    $env:DOCPED_DB       = "nome-do-banco"
    $env:DOCPED_USER     = "usuario"
    $env:DOCPED_PASSWORD = "senha"
    $env:DOCPED_PORT     = "5432"   # opcional, padrão 5432

Conexão SQL Server: lida automaticamente de claude_desktop_config.json
(mesmo padrão usado pelo db_map e MCP sqlserver).

Uso:
    python migrar_diario_configuracao.py          # dry-run (apenas exibe o que faria)
    python migrar_diario_configuracao.py --commit  # executa a inserção
"""

import os
import sys
import pyodbc
import psycopg2
import psycopg2.extras
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuração — SQL Server via salta_config.py
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).resolve().parent))
from salta_config import (
    SQLSERVER_HOST, SQLSERVER_DATABASE, SQLSERVER_USER,
    SQLSERVER_PASSWORD, SQLSERVER_DRIVER, SQLSERVER_TRUST_CERT,
)

# ---------------------------------------------------------------------------
# Configuração — PostgreSQL via env vars
# ---------------------------------------------------------------------------
PG_HOST     = os.getenv("DOCPED_HOST", "")
PG_DB       = os.getenv("DOCPED_DB",   "")
PG_USER     = os.getenv("DOCPED_USER", "")
PG_PASSWORD = os.getenv("DOCPED_PASSWORD", "")
PG_PORT     = int(os.getenv("DOCPED_PORT", "5432"))

# ID do usuário sistema usado em UsuarioInclusao nas linhas migradas
SISTEMA_USUARIO_ID = 1

# ---------------------------------------------------------------------------
# Query — exportar de doc-ped PostgreSQL
# ---------------------------------------------------------------------------
SQL_EXPORT = """
SELECT
    dc."Hash"                            AS hash,
    dc."Ativo"                           AS ativo,
    dc."DataInclusao"                    AS data_inclusao,
    dc."DataUltimaAlteracao"             AS data_ultima_alteracao,
    dc."CaracterParaIndicarPresenca"     AS caract_presenca,
    dc."CaracterParaIndicarFalta"        AS caract_falta,
    dc."CaracterParaIndicarTransferencia" AS caract_transferencia,
    dc."CaracterParaIndicarNEE"          AS caract_nee,
    dc."CaracterParaIndicarPendencia"    AS caract_pendencia,
    dc."ExibirFrequencia"                AS exibir_freq,
    dc."ExibirConteudoMinistrado"        AS exibir_conteudo,
    dc."ExibirRelatorioRendimento"       AS exibir_rendimento,
    r."HashOrigem"                       AS rede_hash   -- Hash da Rede no estrutura-pedagogica
FROM "DiarioClasseConfiguracao" dc
INNER JOIN "Rede" r ON r."Id" = dc."Rede"
WHERE dc."Ativo" = TRUE
  AND r."HashOrigem" IS NOT NULL
ORDER BY dc."DataInclusao"
"""

# ---------------------------------------------------------------------------
# Query — inserir no SQL Server (sem sobrescrever registros existentes)
# ---------------------------------------------------------------------------
SQL_IMPORT = """
MERGE [dbo].[DiarioDeClasseConfiguracao] AS target
USING (SELECT CAST(:hash AS UNIQUEIDENTIFIER) AS Hash) AS src ON target.Hash = src.Hash
WHEN NOT MATCHED THEN
    INSERT (
        Hash,
        Ativo,
        DataInclusao,
        UsuarioInclusao,
        DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca,
        CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia,
        CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia,
        ExibirConteudoMinistrado,
        ExibirRelatorioRendimento
    )
    VALUES (
        CAST(:hash AS UNIQUEIDENTIFIER),
        :ativo,
        :data_inclusao,
        :usuario_inclusao,
        :data_ultima_alteracao,
        :rede_id,
        :caract_presenca,
        :caract_falta,
        :caract_transferencia,
        :caract_nee,
        :caract_pendencia,
        :exibir_freq,
        :exibir_conteudo,
        :exibir_rendimento
    );
"""

# pyodbc usa ? como placeholder, não :nome — monta query posicional
SQL_GET_REDE_ID  = "SELECT Id FROM [dbo].[Rede] WHERE Hash = CAST(? AS UNIQUEIDENTIFIER) AND Ativo = 1"

SQL_INSERT = """
IF NOT EXISTS (SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] WHERE Hash = CAST(? AS UNIQUEIDENTIFIER))
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
        Hash, Ativo, DataInclusao, UsuarioInclusao, DataUltimaAlteracao,
        Rede,
        CaracterParaIndicarPresenca, CaracterParaIndicarFalta,
        CaracterParaIndicarTransferencia, CaracterParaIndicarNEE,
        CaracterParaIndicarPendencia,
        ExibirFrequencia, ExibirConteudoMinistrado, ExibirRelatorioRendimento
    ) VALUES (
        CAST(? AS UNIQUEIDENTIFIER), ?, ?, ?, ?,
        ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
    )
END
"""


def connect_sqlserver():
    conn_str = (
        f"DRIVER={{{SQLSERVER_DRIVER}}};"
        f"SERVER={SQLSERVER_HOST};"
        f"DATABASE={SQLSERVER_DATABASE};"
        f"UID={SQLSERVER_USER};"
        f"PWD={SQLSERVER_PASSWORD};"
        f"TrustServerCertificate={'yes' if SQLSERVER_TRUST_CERT.lower() in ('true','yes','1') else 'no'};"
    )
    return pyodbc.connect(conn_str)


def connect_postgres():
    return psycopg2.connect(
        host=PG_HOST, dbname=PG_DB, user=PG_USER,
        password=PG_PASSWORD, port=PG_PORT,
        cursor_factory=psycopg2.extras.RealDictCursor,
    )


def validate_env():
    missing = [k for k, v in {
        "DOCPED_HOST": PG_HOST, "DOCPED_DB": PG_DB,
        "DOCPED_USER": PG_USER, "DOCPED_PASSWORD": PG_PASSWORD,
    }.items() if not v]
    if missing:
        print(f"[ERRO] Variáveis de ambiente não configuradas: {', '.join(missing)}")
        print("       Configure-as antes de rodar o script.")
        sys.exit(1)
    if not SQLSERVER_HOST or not SQLSERVER_USER:
        print("[ERRO] Conexão SQL Server não configurada. Verifique claude_desktop_config.json.")
        sys.exit(1)


def run(commit: bool):
    validate_env()

    print(f"\n{'[DRY-RUN]' if not commit else '[COMMIT]'} Migração DiarioClasseConfiguracao")
    print(f"  Fonte: PostgreSQL {PG_HOST}/{PG_DB}")
    print(f"  Destino: SQL Server {SQLSERVER_HOST}/{SQLSERVER_DATABASE}\n")

    # 1. Ler de PostgreSQL
    pg_conn = connect_postgres()
    pg_cur  = pg_conn.cursor()
    pg_cur.execute(SQL_EXPORT)
    rows = pg_cur.fetchall()
    pg_cur.close()
    pg_conn.close()
    print(f"  {len(rows)} configurações encontradas no doc-ped.\n")

    if not rows:
        print("  Nenhum registro para migrar. Encerrando.")
        return

    # 2. Processar cada linha
    ss_conn = connect_sqlserver()
    ss_cur  = ss_conn.cursor()

    inserted = 0
    skipped  = 0
    errors   = []

    for row in rows:
        rede_hash = str(row["rede_hash"])

        # Resolver Rede.Id no SQL Server
        ss_cur.execute(SQL_GET_REDE_ID, rede_hash)
        rede_row = ss_cur.fetchone()
        if not rede_row:
            msg = f"  [SKIP] Rede não encontrada no SQL Server para Hash={rede_hash}"
            print(msg)
            errors.append(msg)
            skipped += 1
            continue

        rede_id = rede_row[0]
        hash_str = str(row["hash"])

        print(f"  {'[INSERT]' if commit else '[dry-run]'} Hash={hash_str}  RedeId={rede_id}")

        if commit:
            ss_cur.execute(SQL_INSERT, (
                hash_str,               # IF NOT EXISTS check
                hash_str,               # Hash
                1 if row["ativo"] else 0,
                row["data_inclusao"],
                SISTEMA_USUARIO_ID,
                row["data_ultima_alteracao"],
                rede_id,
                row["caract_presenca"],
                row["caract_falta"],
                row["caract_transferencia"],
                row["caract_nee"],
                row["caract_pendencia"],
                1 if row["exibir_freq"] else 0,
                1 if row["exibir_conteudo"] else 0,
                1 if row["exibir_rendimento"] else 0,
            ))

        inserted += 1

    if commit:
        ss_conn.commit()
        print(f"\n  ✔ {inserted} inseridos, {skipped} ignorados (rede não encontrada).")
    else:
        print(f"\n  [DRY-RUN] {inserted} seriam inseridos, {skipped} seriam ignorados.")
        print("  Execute com --commit para aplicar.")

    if errors:
        print("\n  Redes sem correspondência no SQL Server:")
        for e in errors:
            print(f"    {e}")

    ss_cur.close()
    ss_conn.close()


if __name__ == "__main__":
    commit = "--commit" in sys.argv
    run(commit)
