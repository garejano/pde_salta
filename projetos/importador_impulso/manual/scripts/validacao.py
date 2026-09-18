"""
Validações do processo de importação de RA Impulso — roda sobre a lista de
alunos já carregada (impulso_core.ler_alunos_excel/ler_alunos_csv) e o
registro de mapeamentos (mapping_registry). Produz um RelatorioValidacao,
que pendencia_writer.py sabe renderizar em markdown.

4 regras (ver projetos/importador_impulso/cli-development.md, seção 4):
  1. linha_incompleta      — aluno sem escola/nome/turma (bloqueante)
  2. nome_duplicado        — mesmo nome aparece mais de uma vez (aviso)
  3. mapeamento_faltante   — escola/turma sem entrada em resolve_ids_ra_impulso.sql (bloqueante)
  4. id_nao_resolvido      — mapeado por nome, mas sem ID no CSV do ambiente (bloqueante)

A regra 4 só roda se um CSV de IDs foi informado — a ausência total do CSV
(Query 1 ainda não rodou nesse ambiente) não é uma pendência de dados, é um
artefato faltante tratado na etapa de orquestração (Fase 2), não aqui.
"""

import os
from collections import Counter

from impulso_core import carregar_mapping_csv, normalize_escola, normalize_turma
import mapping_registry


class RelatorioValidacao:
    def __init__(self):
        self.bloqueantes = []  # lista de grupos {"tipo", "titulo", "itens"}
        self.avisos = []

    @property
    def tem_bloqueantes(self):
        return any(g["itens"] for g in self.bloqueantes)


def _grupo(tipo, titulo, itens):
    return {"tipo": tipo, "titulo": titulo, "itens": itens}


def validar_linhas_incompletas(avisos_leitura):
    itens = [
        f"{a['nome'] or '(sem nome)'} (linha {a['linha']}) — {a['motivo']}"
        for a in avisos_leitura
    ]
    return _grupo(
        "linha_incompleta",
        "Linhas incompletas (aluno ignorado até corrigir na planilha/CSV)",
        itens,
    )


def validar_nomes_duplicados(alunos):
    contagem = Counter(nome.strip().upper() for _, nome, _ in alunos)
    duplicados = sorted(nome for nome, qtd in contagem.items() if qtd > 1)
    itens = [f"'{nome}' aparece {contagem[nome]}x no input — confirmar se são alunos diferentes ou duplicidade" for nome in duplicados]
    return _grupo("nome_duplicado", "Nomes duplicados no input", itens)


def validar_mapeamento_nomes(alunos, registro_path):
    """Retorna (grupo, mapa_nomes) — mapa_nomes é reaproveitado pela regra 4."""
    mapa_nomes = mapping_registry.carregar_mapa(registro_path)
    faltantes = {}
    for escola_raw, nome, turma_raw in alunos:
        key = (normalize_escola(escola_raw), normalize_turma(turma_raw))
        if key not in mapa_nomes:
            info = faltantes.setdefault(key, {"escola_raw": escola_raw, "turma_raw": turma_raw, "alunos": []})
            info["alunos"].append(nome)

    itens = []
    for (escola_norm, turma_norm), info in sorted(faltantes.items()):
        alunos_str = ", ".join(info["alunos"][:3])
        if len(info["alunos"]) > 3:
            alunos_str += f", ... (+{len(info['alunos']) - 3})"
        busca = escola_norm.split(",")[0].strip()  # nomes longos vêm com sufixo tipo ", C E-EF M"
        itens.append(
            f"`{info['escola_raw']}` / `{info['turma_raw']}` "
            f"(chave normalizada: ('{escola_norm}', '{turma_norm}')) "
            f"— {len(info['alunos'])} aluno(s): {alunos_str}\n"
            f"  Descobrir o nome exato no banco:\n"
            f"    SELECT e.Id, e.Nome FROM Escola e WHERE e.Nome LIKE '%{busca}%';\n"
            f"    SELECT t.Id, t.Nome FROM Turma t INNER JOIN EscolaSerie es ON es.Id = t.EscolaSerie "
            f"WHERE es.Escola = <id> AND es.AnoLetivo = 2026 AND t.Nome LIKE '%...%';\n"
            f"  Depois adicionar em manual/scripts/resolve_ids_ra_impulso.sql:\n"
            f"    ('{escola_norm}', '{turma_norm}', 'NOME EXATO NO BANCO', N'NOME EXATO DA TURMA'),"
        )
    return _grupo("mapeamento_faltante", "Escola/turma sem mapeamento em resolve_ids_ra_impulso.sql", itens), mapa_nomes


def validar_ids_csv(alunos, mapa_nomes, ids_csv_path, env=None):
    """None se não há CSV pra checar ainda (ver docstring do módulo) — nesse
    caso não entra no relatório de pendências de dados."""
    if not ids_csv_path:
        return None

    mapping_ids = carregar_mapping_csv(ids_csv_path)
    faltantes = {}
    for escola_raw, nome, turma_raw in alunos:
        key = (normalize_escola(escola_raw), normalize_turma(turma_raw))
        if key in mapa_nomes and key not in mapping_ids:
            faltantes.setdefault(key, []).append(nome)

    ambiente = env or os.path.basename(ids_csv_path)
    itens = []
    for key, nomes in sorted(faltantes.items()):
        nomes_str = ", ".join(nomes[:3])
        if len(nomes) > 3:
            nomes_str += f", ... (+{len(nomes) - 3})"
        itens.append(
            f"`{key[0]}` / `{key[1]}` — {len(nomes)} aluno(s) sem ID no CSV de {ambiente} "
            f"({os.path.basename(ids_csv_path)}): {nomes_str}. "
            f"Causa provável: nome da turma diferente no banco desse ambiente, ou a Query 1 não incluiu essa "
            f"combinação — ver 'Turma com nome diferente em produção' no guide.md."
        )
    return _grupo("id_nao_resolvido", f"Mapeado por nome, mas sem ID no CSV ({ambiente})", itens)


def validar(alunos, avisos_leitura, registro_path, ids_csv_path=None, env=None):
    relatorio = RelatorioValidacao()

    relatorio.bloqueantes.append(validar_linhas_incompletas(avisos_leitura))

    grupo_mapeamento, mapa_nomes = validar_mapeamento_nomes(alunos, registro_path)
    relatorio.bloqueantes.append(grupo_mapeamento)

    grupo_ids = validar_ids_csv(alunos, mapa_nomes, ids_csv_path, env)
    if grupo_ids is not None:
        relatorio.bloqueantes.append(grupo_ids)

    relatorio.avisos.append(validar_nomes_duplicados(alunos))

    return relatorio
