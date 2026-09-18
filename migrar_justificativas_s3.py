#!/usr/bin/env python3
"""
Migra os anexos de justificativa de falta do bucket antigo para o novo bucket S3,
usando a AWS CLI (aws s3 sync) para a copia e aws s3api list-objects-v2 para validar
que todos os arquivos foram copiados corretamente (mesma contagem e mesmo tamanho).

Nao apaga nada na origem. So copia e valida.

Uso:
    python migrar_justificativas_s3.py --profile eleva-admin-eficientes-prd

Requisitos:
    - AWS CLI v2 instalada e configurada (credenciais ja geradas via eleva-token-3.py)
    - O profile informado precisa ter permissao de leitura no bucket de origem
      e leitura/escrita no bucket de destino
"""

import argparse
import json
import logging
import subprocess
import sys
from datetime import datetime

SOURCE_BUCKET = "production-frequencia-backend"
SOURCE_PREFIX = "justificativas"

DEST_BUCKET = "production-estrutura-pedagogica-backend"
DEST_PREFIX = "lancamento-frequencia-justificativas"

DEFAULT_REGION = "us-east-1"


def setup_logging():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_filename = f"migracao_justificativas_{timestamp}.log"

    logger = logging.getLogger("migracao")
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s", "%Y-%m-%d %H:%M:%S")

    file_handler = logging.FileHandler(log_filename, encoding="utf-8")
    file_handler.setFormatter(formatter)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger, log_filename


def run_aws_cli(args, logger):
    comando = ["aws"] + args
    resultado = subprocess.run(comando, capture_output=True, text=True)

    if resultado.returncode != 0:
        logger.error("Falha ao executar: %s", " ".join(comando))
        logger.error("stderr: %s", resultado.stderr.strip())
        raise RuntimeError(f"Comando aws cli falhou: {' '.join(comando)}")

    return resultado.stdout


def listar_objetos(bucket, prefixo, profile, region, logger):
    """Retorna um dict {chave_relativa: tamanho_em_bytes} de todos os objetos sob o prefixo."""
    prefixo_normalizado = prefixo if prefixo.endswith("/") else prefixo + "/"

    saida = run_aws_cli(
        [
            "s3api", "list-objects-v2",
            "--bucket", bucket,
            "--prefix", prefixo_normalizado,
            "--profile", profile,
            "--region", region,
            "--output", "json",
        ],
        logger,
    )

    dados = json.loads(saida) if saida.strip() else {}
    objetos = {}

    for item in dados.get("Contents", []):
        chave_completa = item["Key"]
        if chave_completa == prefixo_normalizado:
            continue  # marcador de "pasta" vazio, sem conteudo real

        chave_relativa = chave_completa[len(prefixo_normalizado):]
        objetos[chave_relativa] = item["Size"]

    return objetos


def copiar_arquivos(source_profile, dest_profile, region, logger):
    origem = f"s3://{SOURCE_BUCKET}/{SOURCE_PREFIX}/"
    destino = f"s3://{DEST_BUCKET}/{DEST_PREFIX}/"

    logger.info("Iniciando copia de %s para %s", origem, destino)

    args = [
        "s3", "sync", origem, destino,
        "--source-region", region,
        "--region", region,
    ]

    if source_profile == dest_profile:
        args += ["--profile", source_profile]
    else:
        # Contas/roles diferentes para origem e destino nao sao suportadas
        # diretamente pelo "aws s3 sync" com um unico profile.
        raise RuntimeError(
            "source-profile e dest-profile diferentes: 'aws s3 sync' precisa de um "
            "unico profile com acesso aos dois buckets. Copie arquivo a arquivo "
            "(aws s3 cp) se as contas forem diferentes."
        )

    saida = run_aws_cli(args, logger)
    for linha in saida.splitlines():
        logger.info(linha)

    logger.info("Copia finalizada.")


def validar_copia(objetos_origem, objetos_destino, logger):
    faltando = []
    tamanho_diferente = []
    extras_no_destino = []

    for chave, tamanho_origem in objetos_origem.items():
        if chave not in objetos_destino:
            faltando.append(chave)
        elif objetos_destino[chave] != tamanho_origem:
            tamanho_diferente.append((chave, tamanho_origem, objetos_destino[chave]))

    for chave in objetos_destino:
        if chave not in objetos_origem:
            extras_no_destino.append(chave)

    total_origem = len(objetos_origem)
    total_ok = total_origem - len(faltando) - len(tamanho_diferente)

    logger.info("=" * 60)
    logger.info("RESUMO DA VALIDACAO")
    logger.info("=" * 60)
    logger.info("Arquivos na origem: %d", total_origem)
    logger.info("Arquivos no destino: %d", len(objetos_destino))
    logger.info("Copiados corretamente (mesmo tamanho): %d", total_ok)
    logger.info("Faltando no destino: %d", len(faltando))
    logger.info("Com tamanho divergente: %d", len(tamanho_diferente))
    logger.info("Extras no destino (nao existem na origem): %d", len(extras_no_destino))

    if faltando:
        logger.warning("Arquivos FALTANDO no destino:")
        for chave in faltando:
            logger.warning("  - %s", chave)

    if tamanho_diferente:
        logger.warning("Arquivos com TAMANHO DIVERGENTE:")
        for chave, tam_origem, tam_destino in tamanho_diferente:
            logger.warning("  - %s (origem=%d bytes, destino=%d bytes)", chave, tam_origem, tam_destino)

    if extras_no_destino:
        logger.info("Arquivos extras no destino (informativo, nao bloqueia validacao):")
        for chave in extras_no_destino:
            logger.info("  - %s", chave)

    sucesso = not faltando and not tamanho_diferente
    logger.info("=" * 60)
    logger.info("RESULTADO: %s", "SUCESSO" if sucesso else "FALHA")
    logger.info("=" * 60)

    return sucesso


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--profile", default="eleva-admin-eficientes-prd", help="Profile AWS a usar (origem e destino)")
    parser.add_argument("--region", default=DEFAULT_REGION, help="Regiao AWS")
    parser.add_argument("--skip-copy", action="store_true", help="Pula a etapa de copia e so executa a validacao")
    args = parser.parse_args()

    logger, log_filename = setup_logging()
    logger.info("Log desta execucao: %s", log_filename)
    logger.info("Origem: s3://%s/%s/", SOURCE_BUCKET, SOURCE_PREFIX)
    logger.info("Destino: s3://%s/%s/", DEST_BUCKET, DEST_PREFIX)
    logger.info("Profile: %s | Regiao: %s", args.profile, args.region)

    try:
        if not args.skip_copy:
            copiar_arquivos(args.profile, args.profile, args.region, logger)
        else:
            logger.info("Etapa de copia pulada (--skip-copy). Validando estado atual.")

        logger.info("Listando arquivos na origem...")
        objetos_origem = listar_objetos(SOURCE_BUCKET, SOURCE_PREFIX, args.profile, args.region, logger)

        logger.info("Listando arquivos no destino...")
        objetos_destino = listar_objetos(DEST_BUCKET, DEST_PREFIX, args.profile, args.region, logger)

        sucesso = validar_copia(objetos_origem, objetos_destino, logger)

    except Exception as erro:
        logger.error("Migracao interrompida por erro: %s", erro)
        sys.exit(1)

    sys.exit(0 if sucesso else 1)


if __name__ == "__main__":
    main()
