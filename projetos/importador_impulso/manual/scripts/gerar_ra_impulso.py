"""
Gera os scripts SQL para cadastrar RAs dos alunos Impulso — genérico, um ciclo por vez.

Cada ciclo (card Jira) tem sua própria pasta em
projetos/importador_impulso/manual/<CARD>/ com a planilha e os arquivos gerados.
Ver projetos/importador_impulso/manual/guide.md para o processo completo.

Uso:
    python gerar_ra_impulso.py --excel "manual/EFC-6732/Turmas Impulso (ENEM2)_EFC_6732.xlsx" \
        --sheet "ALUNOS NOVOS - ENEM3" --ra-start 90929601 --env producao

    # Ou com uma lista já consolidada (escola,nome,turma) — usar quando a planilha
    # tem mais de uma aba de alunos com layouts diferentes (ex.: aba de transferidos):
    python gerar_ra_impulso.py --alunos-csv "manual/EFC-6732/alunos_consolidado.csv" \
        --ra-start 90929601 --env producao

--env filtra o CSV de IDs por ambiente (homolog, homologacao, producao).
CSV de IDs (--ids-csv) gerado por resolve_ids_ra_impulso.sql; se omitido, detecta
automaticamente o mais recente em <diretório do --excel/--alunos-csv>/*_to_ra_manual_*.csv.
Saída (--out): por padrão, ra_alunos_impulso.sql na mesma pasta do input.

Nota: este script ainda faz só a etapa final de geração (sem validação prévia nem
orquestração guiada) — isso está sendo construído incrementalmente, ver
projetos/importador_impulso/cli-development.md.
"""

import argparse
import os
import sys

from impulso_core import (
    ANO_LETIVO,
    carregar_mapping_csv,
    encontrar_csv,
    gerar_inserts,
    ler_alunos_csv,
    ler_alunos_excel,
    normalize_escola,
    normalize_turma,
)


def main():
    parser = argparse.ArgumentParser(description="Gera SQL de cadastro de RAs Impulso (um ciclo por vez)")
    parser.add_argument("--excel", metavar="ARQUIVO",
                        help="Planilha .xlsx com a aba de alunos (Escola | Nome | Turma)")
    parser.add_argument("--sheet", default="ALUNOS NOVOS",
                        help="Nome da aba a ler no --excel (default: 'ALUNOS NOVOS')")
    parser.add_argument("--alunos-csv", metavar="ARQUIVO",
                        help="Alternativa ao --excel/--sheet: CSV consolidado com colunas escola,nome,turma "
                             "(usar quando a planilha do ciclo tem múltiplas abas de alunos com layouts diferentes)")
    parser.add_argument("--ra-start", type=int, required=True,
                        help="Próximo RA a usar (obtido da Query 2 de resolve_ids_ra_impulso.sql)")
    parser.add_argument("--ids-csv", metavar="ARQUIVO",
                        help="CSV de IDs gerado por resolve_ids_ra_impulso.sql (Query 1)")
    parser.add_argument("--env", metavar="ENV",
                        help="Filtra auto-detecção do --ids-csv por ambiente (homolog, homologacao, producao)")
    parser.add_argument("--out", metavar="ARQUIVO",
                        help="Caminho do SQL gerado (default: ra_alunos_impulso.sql na pasta do input)")
    args = parser.parse_args()

    if not args.excel and not args.alunos_csv:
        print("ERRO: informe --excel (+ --sheet) ou --alunos-csv")
        sys.exit(1)

    if args.excel and os.path.splitext(args.excel)[1].lower() not in (".xlsx", ".xlsm", ".xltx", ".xltm"):
        print(f"ERRO: --excel espera um arquivo Excel (.xlsx), mas recebeu {args.excel!r}")
        print("  Se esse é um CSV consolidado (colunas escola,nome,turma), use --alunos-csv em vez de --excel.")
        sys.exit(1)

    input_path = args.alunos_csv or args.excel
    input_dir  = os.path.dirname(os.path.abspath(input_path))

    # --- localizar CSV de IDs ---
    ids_csv_path = args.ids_csv
    if not ids_csv_path:
        ids_csv_path = encontrar_csv(input_dir, args.env)
        if not ids_csv_path:
            print(f"ERRO: nenhum CSV de IDs encontrado em {input_dir}/*_to_ra_manual_*.csv")
            print("  Rode resolve_ids_ra_impulso.sql e exporte o resultado nessa pasta.")
            sys.exit(1)

    env_detectado = "producao" if "producao" in os.path.basename(ids_csv_path) else "homolog"
    print(f"Input:       {input_path}")
    print(f"CSV de IDs:  {ids_csv_path}")
    print(f"Ambiente:    {env_detectado}")
    print(f"RA inicial:  {args.ra_start}")

    mapping = carregar_mapping_csv(ids_csv_path)
    print(f"Mapeamentos carregados do CSV: {len(mapping)}")

    alunos, avisos = ler_alunos_csv(args.alunos_csv) if args.alunos_csv else ler_alunos_excel(args.excel, args.sheet)
    for aviso in avisos:
        print(f"AVISO (linha {aviso['linha']}): {aviso['nome']!r} ignorado — {aviso['motivo']}")
    print(f"Alunos no input: {len(alunos)}")

    ra = args.ra_start
    output = []
    nao_mapeados = []
    escola_atual = None
    output_sql = args.out or os.path.join(input_dir, "ra_alunos_impulso.sql")

    output.append("-- ============================================================")
    output.append("-- Script gerado por gerar_ra_impulso.py")
    output.append(f"-- Ambiente: {env_detectado}  |  CSV de IDs: {os.path.basename(ids_csv_path)}")
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

    with open(output_sql, "w", encoding="utf-8") as f:
        f.write("\n".join(output))

    total_ok = len(alunos) - len(nao_mapeados)
    print(f"Mapeados:     {total_ok} / {len(alunos)}")
    print(f"Nao mapeados: {len(nao_mapeados)}")
    print(f"RAs usados:   {args.ra_start} -> {ra - 1}")
    print(f"SQL gerado:   {output_sql}")

    if nao_mapeados:
        print("\nNAO MAPEADOS:")
        for escola_raw, nome, turma_raw, key in nao_mapeados:
            print(f"  [{escola_raw}] {turma_raw!r} -> chave: {key}")
        sys.exit(1)


if __name__ == "__main__":
    main()
