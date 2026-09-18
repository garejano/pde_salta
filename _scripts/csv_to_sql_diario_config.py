"""
csv_to_sql_diario_config.py
Lê o CSV gerado por diario_config_export.sql e produz um script SQL
com todos os INSERTs para o SQL Server (ElevaPortalHomolog / estrutura-pedagogica).

Uso:
    python csv_to_sql_diario_config.py                          # lê diario_config_export.csv no dir atual
    python csv_to_sql_diario_config.py --csv outro_arquivo.csv  # CSV customizado
    python csv_to_sql_diario_config.py --out inserts.sql        # nome do arquivo de saída customizado

Saída padrão: diario_config_inserts.sql (criado no mesmo diretório do script)
"""

import csv
import sys
import argparse
from pathlib import Path
from datetime import datetime

# ID do usuário sistema usado em UsuarioInclusao
SISTEMA_USUARIO_ID = 1097334

HEADER = """\
-- =============================================================================
-- diario_config_inserts.sql
-- Gerado por csv_to_sql_diario_config.py em {gerado_em}
-- Origem: {csv_path}
--
-- Cada bloco usa IF NOT EXISTS para não sobrescrever registros já migrados.
-- A coluna Rede é resolvida via subquery pelo HashOrigem da Rede.
--
-- Como rodar:
--   No SQL Server Management Studio: abrir e executar (F5)
--   Via sqlcmd: sqlcmd -S HOST -U USER -P PASS -d ElevaPortalHomolog -i diario_config_inserts.sql
-- =============================================================================

SET NOCOUNT ON;
"""

INSERT_TEMPLATE = """\
-- [{idx}] Hash={hash}  Rede={rede_hash_origem}
IF NOT EXISTS (
    SELECT 1 FROM [dbo].[DiarioDeClasseConfiguracao] dcc
    JOIN [dbo].[Rede] r ON r.Id = dcc.Rede
    WHERE dcc.Hash = CAST('{hash}' AS UNIQUEIDENTIFIER)
       OR r.Hash   = CAST('{rede_hash_origem}' AS UNIQUEIDENTIFIER)
)
BEGIN
    INSERT INTO [dbo].[DiarioDeClasseConfiguracao] (
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
    SELECT
        CAST('{hash}' AS UNIQUEIDENTIFIER),
        {ativo},
        '{data_inclusao}',
        {usuario_inclusao},
        '{data_ultima_alteracao}',
        r.Id,
        '{caract_presenca}',
        '{caract_falta}',
        '{caract_transferencia}',
        '{caract_nee}',
        {caract_pendencia_sql},
        {exibir_freq},
        {exibir_conteudo},
        {exibir_rendimento}
    FROM [dbo].[Rede] r
    WHERE r.Hash = CAST('{rede_hash_origem}' AS UNIQUEIDENTIFIER)
      AND r.Ativo = 1;

    IF @@ROWCOUNT = 0
        PRINT 'AVISO [{idx}]: Rede não encontrada no SQL Server para Hash={rede_hash_origem}. Linha ignorada.';
    ELSE
        PRINT 'INSERT [{idx}]: Hash={hash}';
END
ELSE
    PRINT 'SKIP [{idx}]: Hash={hash} ou Rede={rede_hash_origem} já existe.';
"""

FOOTER = """\
PRINT '---';
PRINT 'Migração concluída.';
"""


def build_insert(idx: int, row: dict) -> str:
    pendencia = row["caract_pendencia"].strip()
    caract_pendencia_sql = f"'{pendencia}'" if pendencia else "NULL"

    return INSERT_TEMPLATE.format(
        idx=idx,
        hash=row["hash"].strip().upper(),
        rede_hash_origem=row["rede_hash_origem"].strip().upper(),
        ativo=int(row["ativo"]),
        data_inclusao=row["data_inclusao"].strip(),
        usuario_inclusao=SISTEMA_USUARIO_ID,
        data_ultima_alteracao=row["data_ultima_alteracao"].strip(),
        caract_presenca=row["caract_presenca"].strip(),
        caract_falta=row["caract_falta"].strip(),
        caract_transferencia=row["caract_transferencia"].strip(),
        caract_nee=row["caract_nee"].strip(),
        caract_pendencia_sql=caract_pendencia_sql,
        exibir_freq=int(row["exibir_freq"]),
        exibir_conteudo=int(row["exibir_conteudo"]),
        exibir_rendimento=int(row["exibir_rendimento"]),
    )


def main():
    parser = argparse.ArgumentParser(description="Converte CSV exportado do doc-ped em script SQL para SQL Server.")
    parser.add_argument("--csv", default="diario_config_export.csv", help="Caminho do CSV de entrada")
    parser.add_argument("--out", default="diario_config_inserts.sql", help="Caminho do SQL de saída")
    args = parser.parse_args()

    csv_path = Path(args.csv)
    out_path = Path(args.out)

    if not csv_path.exists():
        print(f"[ERRO] Arquivo CSV não encontrado: {csv_path}")
        print("       Execute diario_config_export.sql no banco doc-ped primeiro.")
        sys.exit(1)

    rows = []
    with csv_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    if not rows:
        print("[AVISO] CSV está vazio. Nenhum INSERT gerado.")
        sys.exit(0)

    print(f"  {len(rows)} linhas lidas de {csv_path}")

    with out_path.open("w", encoding="utf-8") as f:
        f.write(HEADER.format(
            gerado_em=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            csv_path=csv_path.resolve(),
        ))
        for idx, row in enumerate(rows, start=1):
            f.write(build_insert(idx, row))
        f.write(FOOTER)

    print(f"  Script gerado: {out_path.resolve()}")
    print(f"  {len(rows)} INSERTs escritos.")


if __name__ == "__main__":
    main()
