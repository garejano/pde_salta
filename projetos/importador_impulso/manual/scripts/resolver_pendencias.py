"""
Cruza os candidatos de Escola/Turma retornados por descobrir_ids_pendentes.sql
(exportados para CSV) com as pendências de mapeamento detectadas por
validacao.py, e propõe a linha VALUES pronta pra colar em
resolve_ids_ra_impulso.sql — com um score de confiança por proposta.

Por que não é só "string mais parecida": a planilha costuma vir com turma
abreviada ("3ºB") enquanto o banco guarda o nome completo ("3ª Série Regular
B - M") — comparar as strings inteiras dá similaridade baixa mesmo quando é
claramente a turma certa. Em vez disso, extraímos uma assinatura de cada lado
(número da série, letra da turma, tipo — regular/técnico/integral/etc.,
turno) e comparamos campo a campo, contando só os campos que a planilha
realmente informou (não penaliza por informação que a planilha nunca teve
como dar, tipo o turno).

Não decide sozinho: matches de baixa confiança, ambíguos (mais de um
candidato empatado no topo) ou sem nenhum candidato ficam separados para
revisão manual — nunca misturados com os de alta confiança.

Uso (de qualquer diretório):
    python manual/scripts/resolver_pendencias.py \
        --alunos-csv manual/EFC-6732/alunos_consolidado.csv \
        --candidatos-csv manual/EFC-6732/candidatos_turmas_producao.csv

Ver projetos/importador_impulso/cli-development.md.
"""

import argparse
import csv
import difflib
import os
import re
from collections import defaultdict

import impulso_core
import mapping_registry

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
_REGISTRO_DEFAULT = os.path.join(_SCRIPT_DIR, "resolve_ids_ra_impulso.sql")

# Grupos de sinônimos/abreviações -> rótulo canônico. "TEC" (abreviação comum
# na planilha) e "TECNINCO" (erro de digitação visto em ciclos anteriores)
# precisam cair no mesmo rótulo que "TECNICO" do nome completo no banco.
# Um texto pode ter MAIS DE UM rótulo ao mesmo tempo (ex.: "Técnico ADM" tem
# TECNICO e ADM juntos) — por isso _tipos() retorna um conjunto, não um só
# valor. Sem isso, "Técnico ADM A" e "Técnico A" (sem ADM) ficavam
# indistinguíveis (só o primeiro rótulo encontrado "vencia"), gerando
# ambiguidade que na real seria resolvível.
_TIPO_GRUPOS = {
    "TECNICO":   ["TECNINCO", "TECNICO", "TEC"],
    "INTEGRAL":  ["INTEGRAL"],
    "REGULAR":   ["REGULAR"],
    "ALIMENTOS": ["ALIMENTOS"],
    "ADM":       ["ADM"],
    "AGRO":      ["AGRO"],
    "LGG":       ["LGG"],
}
_PESOS_ASSINATURA = {"numero": 0.5, "letra": 0.5}


def _tipos(texto_norm):
    return frozenset(
        canonico for canonico, variantes in _TIPO_GRUPOS.items()
        if any(v in texto_norm for v in variantes)
    )


def _assinatura(texto_norm):
    """Extrai (número da série, letra da turma, tipos, turno) de um texto já
    normalizado (normalize_turma). numero/letra/turno podem vir None se não
    aparecerem no texto; tipos é sempre um frozenset (pode ser vazio)."""
    tokens = re.findall(r"[A-Z0-9]+", texto_norm)
    numero = next((t for t in tokens if t.isdigit()), None)
    tipos = _tipos(texto_norm)
    m_turno = re.search(r"-\s*([A-Z])\s*$", texto_norm)
    turno = m_turno.group(1) if m_turno else None
    letras = [t for t in tokens if len(t) == 1 and t.isalpha() and t != turno]
    letra = letras[-1] if letras else None
    return {"numero": numero, "tipos": tipos, "turno": turno, "letra": letra}


def _score_assinatura(alvo_sig, cand_sig):
    """Só considera campos que o ALVO (texto da planilha) conseguiu extrair —
    não penaliza candidato por campo que a planilha nunca informou. `tipos` é
    tratado à parte (ver melhor_match, é filtro obrigatório, não peso) —
    aqui só pontua número/letra/turno."""
    campos = [c for c in _PESOS_ASSINATURA if alvo_sig.get(c) is not None]
    if not campos:
        return None  # nada extraído do texto da planilha — usar fallback
    total = sum(_PESOS_ASSINATURA[c] for c in campos)
    acertos = sum(_PESOS_ASSINATURA[c] for c in campos if cand_sig.get(c) == alvo_sig.get(c))
    return acertos / total


def carregar_candidatos(caminho_csv):
    """Retorna {escola_planilha: [(escola_id, escola_nome, turma_id, turma_nome), ...]}
    a partir do CSV exportado de descobrir_ids_pendentes.sql."""
    candidatos = defaultdict(list)
    with open(caminho_csv, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            candidatos[row["EscolaPlanilha"]].append(
                (row["EscolaId"], row["EscolaNome"], row["TurmaId"], row["TurmaNome"])
            )
    return candidatos


def melhor_match(turma_raw, candidatos_da_escola):
    """Retorna (melhor_candidato, score, empatados, motivo_revisar).

    `tipos` (regular/técnico/integral/... — pode ser mais de um ao mesmo
    tempo) e `turno` são tratados como FILTROS, não como peso: se a
    planilha especifica um tipo e/ou turno, só candidatos que batem exatamente
    entram na disputa de score por número/letra. Sem isso:
    - "acertar número+letra mas errar o tipo" (ex.: pedir Técnico A e sugerir
      Regular A só porque a letra bateu) ficava com score alto demais;
    - "acertar número+letra mas errar o turno" (ex.: pedir turno I — Integral
      — numa escola que só tem M/T e sugerir turno M) também ficava alto
      demais (0.78, passando o limiar padrão) — achado testando com CSV real
      de produção (ZUMBI DOS PALMARES pedia "- I" e a escola não tem turno I
      em nenhuma turma).

    Se NENHUM candidato bate o tipo e/ou turno pedido, `motivo_revisar`
    explica por quê e o item deve ir pra revisão manual mesmo que o score
    entre os candidatos que sobraram pareça alto.

    empatados é a lista completa de candidatos empatados no topo — se tiver
    mais de um, é ambíguo e não deve ser tratado como confiável mesmo com
    score alto.
    """
    if not candidatos_da_escola:
        return None, 0.0, [], None

    alvo = impulso_core.normalize_turma(turma_raw)
    alvo_sig = _assinatura(alvo)

    candidatos_sig = []
    for candidato in candidatos_da_escola:
        cand_norm = impulso_core.normalize_turma(candidato[3])
        candidatos_sig.append((candidato, _assinatura(cand_norm), cand_norm))

    considerados = candidatos_sig
    motivo_revisar = None

    tipos_alvo = alvo_sig["tipos"]
    if tipos_alvo:
        # candidato precisa ter TODOS os rótulos pedidos (ex.: pediu {TECNICO, ADM},
        # só {TECNICO} sozinho não serve — é isso que desambigua "Técnico" vs "Técnico ADM")
        com_tipo_certo = [c for c in considerados if tipos_alvo.issubset(c[1]["tipos"])]
        if com_tipo_certo:
            considerados = com_tipo_certo
        else:
            motivo_revisar = f"tipo pedido ({', '.join(sorted(tipos_alvo))}) não existe em nenhuma turma dessa escola"

    turno_alvo = alvo_sig["turno"]
    if turno_alvo is not None and motivo_revisar is None:
        com_turno_certo = [c for c in considerados if c[1]["turno"] == turno_alvo]
        if com_turno_certo:
            considerados = com_turno_certo
        else:
            motivo_revisar = f"turno pedido ({turno_alvo}) não existe em nenhuma turma dessa escola"

    pontuados = []
    for candidato, cand_sig, cand_norm in considerados:
        score = _score_assinatura(alvo_sig, cand_sig)
        if score is None:  # fallback: nada extraído do texto da planilha, usa similaridade de string
            score = difflib.SequenceMatcher(None, alvo, cand_norm).ratio()
        pontuados.append((candidato, score))

    melhor_score = max(s for _, s in pontuados)
    empatados = [c for c, s in pontuados if s == melhor_score]
    return empatados[0], melhor_score, empatados, motivo_revisar


def levantar_pendencias(alunos, mapa_nomes):
    """Uma pendência por combinação (escola_raw, turma_raw) distinta que
    ainda não está no registro — com a contagem de alunos afetados."""
    pendentes = {}
    for escola_raw, nome, turma_raw in alunos:
        key = (impulso_core.normalize_escola(escola_raw), impulso_core.normalize_turma(turma_raw))
        if key in mapa_nomes:
            continue
        chave_grupo = (escola_raw, turma_raw)
        pendentes.setdefault(chave_grupo, {"key": key, "qtd": 0})
        pendentes[chave_grupo]["qtd"] += 1
    return [
        {"escola_raw": er, "turma_raw": tr, "key": info["key"], "qtd": info["qtd"]}
        for (er, tr), info in pendentes.items()
    ]


def propor(pendencias, candidatos_por_escola):
    propostas = []
    for p in pendencias:
        candidatos = candidatos_por_escola.get(p["escola_raw"], [])
        match, score, empatados, motivo_revisar = melhor_match(p["turma_raw"], candidatos)
        ambiguo = len(empatados) > 1 and score > 0
        propostas.append({
            **p, "match": match, "score": score, "ambiguo": ambiguo,
            "empatados": empatados, "motivo_revisar": motivo_revisar,
        })
    return propostas


def linha_values(escola_norm, turma_norm, escola_nome, turma_nome):
    return f"    ('{escola_norm}', '{turma_norm}', '{escola_nome}', N'{turma_nome}'),"


def classificar(propostas, limiar_confianca):
    altas, revisar, sem_candidato = [], [], []
    for p in propostas:
        if p["match"] is None:
            sem_candidato.append(p)
        elif p["ambiguo"] or p["motivo_revisar"] or p["score"] < limiar_confianca:
            revisar.append(p)
        else:
            altas.append(p)
    return altas, revisar, sem_candidato


def _imprimir_grupo(titulo, itens, ordenar_por_score=False):
    print(f"\n{titulo} ({len(itens)}):")
    if not itens:
        print("  (nenhum)")
        return
    ordenados = sorted(itens, key=lambda i: -i["score"]) if ordenar_por_score else itens
    for item in ordenados:
        escola_norm, turma_norm = item["key"]
        if item["match"] is None:
            print(f"  -- {item['escola_raw']!r} / {item['turma_raw']!r} ({item['qtd']} aluno(s)) "
                  f"-- NENHUM CANDIDATO no CSV pra essa escola")
            continue
        _, escola_nome, turma_id, turma_nome = item["match"]
        if item["motivo_revisar"]:
            print(f"  -- {item['escola_raw']!r} / {item['turma_raw']!r} ({item['qtd']} aluno(s)) "
                  f"-- {item['motivo_revisar'].upper()} — "
                  f"melhor aproximação (NAO confiável): {turma_nome!r} (TurmaId={turma_id})")
            continue
        if item["ambiguo"]:
            candidatos_str = ", ".join(f"{c[3]!r} (Id={c[2]})" for c in item["empatados"])
            print(f"  -- {item['escola_raw']!r} / {item['turma_raw']!r} ({item['qtd']} aluno(s)) "
                  f"-- AMBIGUO, {len(item['empatados'])} candidatos empatados (score={item['score']:.2f}): {candidatos_str}")
            continue
        print(f"  -- {item['escola_raw']!r} / {item['turma_raw']!r} ({item['qtd']} aluno(s), score={item['score']:.2f}) "
              f"-> candidato: {turma_nome!r} (TurmaId={turma_id})")
        print(linha_values(escola_norm, turma_norm, escola_nome, turma_nome))


def main():
    parser = argparse.ArgumentParser(
        description="Propõe VALUES para resolve_ids_ra_impulso.sql cruzando pendências com candidatos exportados do banco"
    )
    parser.add_argument("--alunos-csv", required=True, help="CSV consolidado de alunos (escola,nome,turma)")
    parser.add_argument("--registro", default=_REGISTRO_DEFAULT,
                        help="resolve_ids_ra_impulso.sql atual (default: manual/scripts/resolve_ids_ra_impulso.sql)")
    parser.add_argument("--candidatos-csv", required=True,
                        help="CSV exportado da query de descobrir_ids_pendentes.sql "
                             "(EscolaPlanilha,EscolaId,EscolaNome,TurmaId,TurmaNome)")
    parser.add_argument("--limiar", type=float, default=0.75,
                        help="Score mínimo (0-1) para considerar 'alta confiança' (default: 0.75)")
    args = parser.parse_args()

    alunos, _avisos = impulso_core.ler_alunos_csv(args.alunos_csv)
    mapa_nomes = mapping_registry.carregar_mapa(args.registro)
    candidatos_por_escola = carregar_candidatos(args.candidatos_csv)

    pendencias = levantar_pendencias(alunos, mapa_nomes)
    propostas = propor(pendencias, candidatos_por_escola)
    altas, revisar, sem_candidato = classificar(propostas, args.limiar)

    print(f"Pendências: {len(propostas)}  |  Alta confiança: {len(altas)}  |  "
          f"Revisar: {len(revisar)}  |  Sem candidato: {len(sem_candidato)}")

    _imprimir_grupo("ALTA CONFIANÇA — pode colar direto (revisar por cima antes)", altas)
    _imprimir_grupo("REVISAR — ambíguo ou score baixo, conferir manualmente", revisar, ordenar_por_score=True)
    _imprimir_grupo("SEM CANDIDATO — nada retornado pra essa escola no CSV", sem_candidato)


if __name__ == "__main__":
    main()
