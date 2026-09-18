#!/usr/bin/env python3
"""
Verifica o progresso da migracao de justificativas entre buckets S3, contando
quantos arquivos (e quantos bytes) existem na origem e no destino.

Script somente leitura (list-objects-v2) - pode ser rodado quantas vezes
quiser, em paralelo com o script de migracao (migrar_justificativas_s3.py)
rodando em outro terminal, sem interferir nele.

Uso (uma checagem so):
    python verificar_progresso_migracao.py --profile eleva-admin-eficientes-prd

Uso (fica checando de tempos em tempos ate terminar):
    python verificar_progresso_migracao.py --profile eleva-admin-eficientes-prd --watch --interval 60
"""

import argparse
import json
import subprocess
import sys
import time
from datetime import datetime

SOURCE_BUCKET = "production-frequencia-backend"
SOURCE_PREFIX = "justificativas"

DEST_BUCKET = "production-estrutura-pedagogica-backend"
DEST_PREFIX = "lancamento-frequencia-justificativas"

DEFAULT_REGION = "us-east-1"


def executar_aws(args):
    resultado = subprocess.run(["aws"] + args, capture_output=True, text=True)
    if resultado.returncode != 0:
        raise RuntimeError(resultado.stderr.strip())
    return resultado.stdout


def contar_objetos(bucket, prefixo, profile, region):
    """Pagina manualmente sobre list-objects-v2 e retorna (total_objetos, total_bytes)."""
    prefixo_normalizado = prefixo if prefixo.endswith("/") else prefixo + "/"

    total_objetos = 0
    total_bytes = 0
    starting_token = None

    while True:
        args = [
            "s3api", "list-objects-v2",
            "--bucket", bucket,
            "--prefix", prefixo_normalizado,
            "--profile", profile,
            "--region", region,
            "--max-items", "1000",
            "--output", "json",
        ]
        if starting_token:
            args += ["--starting-token", starting_token]

        saida = executar_aws(args)
        dados = json.loads(saida) if saida.strip() else {}

        contents = dados.get("Contents", [])
        total_objetos += len(contents)
        total_bytes += sum(item["Size"] for item in contents)

        if total_objetos and total_objetos % 5000 == 0:
            print(f"  ... {total_objetos} objetos contados ate agora em {bucket}/{prefixo_normalizado}")

        starting_token = dados.get("NextToken")
        if not starting_token:
            break

    return total_objetos, total_bytes


def formatar_bytes(n):
    valor = float(n)
    for unidade in ["B", "KB", "MB", "GB", "TB"]:
        if valor < 1024:
            return f"{valor:.1f} {unidade}"
        valor /= 1024
    return f"{valor:.1f} PB"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--profile", default="eleva-admin-eficientes-prd", help="Profile AWS a usar")
    parser.add_argument("--region", default=DEFAULT_REGION, help="Regiao AWS")
    parser.add_argument("--watch", action="store_true", help="Fica checando periodicamente ate a contagem do destino alcancar a origem")
    parser.add_argument("--interval", type=int, default=60, help="Intervalo em segundos entre checagens no modo --watch (default 60)")
    args = parser.parse_args()

    print(f"Contando arquivos na origem: s3://{SOURCE_BUCKET}/{SOURCE_PREFIX}/")
    total_origem, bytes_origem = contar_objetos(SOURCE_BUCKET, SOURCE_PREFIX, args.profile, args.region)
    print(f"Origem: {total_origem} arquivos, {formatar_bytes(bytes_origem)}\n")

    anterior_destino = None
    anterior_tempo = None

    try:
        while True:
            agora_str = datetime.now().strftime("%H:%M:%S")
            print(f"[{agora_str}] Contando arquivos no destino: s3://{DEST_BUCKET}/{DEST_PREFIX}/")
            total_destino, bytes_destino = contar_objetos(DEST_BUCKET, DEST_PREFIX, args.profile, args.region)

            percentual = (total_destino / total_origem * 100) if total_origem else 100.0
            faltam = max(total_origem - total_destino, 0)

            print(f"Destino: {total_destino}/{total_origem} arquivos ({percentual:.1f}%) | faltam {faltam} arquivo(s)")
            print(f"Tamanho copiado: {formatar_bytes(bytes_destino)} / {formatar_bytes(bytes_origem)}")

            agora = time.time()
            if anterior_destino is not None:
                delta_arquivos = total_destino - anterior_destino
                delta_tempo = agora - anterior_tempo
                if delta_arquivos > 0 and delta_tempo > 0:
                    taxa = delta_arquivos / delta_tempo
                    print(f"Taxa desde a ultima checagem: {taxa:.2f} arquivos/s")
                    if faltam > 0 and taxa > 0:
                        eta_min = (faltam / taxa) / 60
                        print(f"ETA estimado: ~{eta_min:.1f} min")
                elif delta_arquivos == 0:
                    print("Nenhum arquivo novo copiado desde a ultima checagem.")

            anterior_destino = total_destino
            anterior_tempo = agora

            if total_destino >= total_origem:
                print("\nMigracao parece completa (contagem do destino >= origem).")
                break

            if not args.watch:
                break

            print(f"\nProxima checagem em {args.interval}s (Ctrl+C para parar)...\n")
            time.sleep(args.interval)

    except KeyboardInterrupt:
        print("\nInterrompido pelo usuario.")
        sys.exit(0)


if __name__ == "__main__":
    main()
