"""
Roda um arquivo .sql de descoberta (padrão descobrir_ids_pendentes.sql) direto
contra ElevaPortalHomolog via pyodbc e grava o resultado como CSV — usado
quando o resultado é grande demais para passar pelo MCP sqlserver (limite de
tokens da ferramenta).

So funciona em HOMOLOG (credenciais mcp.readonly, mesmas do MCP). Producao
continua sendo sempre manual (rodar o .sql direto no banco, fora da IA).

Uso:
    python rodar_descoberta_homolog.py --sql ../EFC-7017/descobrir_ids_pendentes.sql \
        --out ../EFC-7017/candidatos_turmas_homolog.csv
"""

import argparse
import csv
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "_scripts"))
import pyodbc
from salta_config import (
    SQLSERVER_DATABASE,
    SQLSERVER_DRIVER,
    SQLSERVER_HOST,
    SQLSERVER_PASSWORD,
    SQLSERVER_TRUST_CERT,
    SQLSERVER_USER,
)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sql", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    with open(args.sql, encoding="utf-8") as f:
        query = f.read()

    conn_str = (
        f"DRIVER={{{SQLSERVER_DRIVER}}};"
        f"SERVER={SQLSERVER_HOST};DATABASE={SQLSERVER_DATABASE};"
        f"UID={SQLSERVER_USER};PWD={SQLSERVER_PASSWORD};"
        f"TrustServerCertificate={'yes' if SQLSERVER_TRUST_CERT.lower() in ('true','yes','1') else 'no'};"
    )
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    cursor.execute(query)
    colunas = [c[0] for c in cursor.description]
    linhas = cursor.fetchall()
    conn.close()

    with open(args.out, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(colunas)
        for linha in linhas:
            w.writerow(list(linha))

    print(f"{len(linhas)} linhas gravadas em {args.out}")


if __name__ == "__main__":
    main()
