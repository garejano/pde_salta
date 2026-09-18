"""
Parser do registro de mapeamentos escola/turma -> nomes no banco
(manual/scripts/resolve_ids_ra_impulso.sql). Só extrai as tuplas do VALUES —
não conecta no banco, não executa nada.

Cada tupla no arquivo é: (escola_norm, turma_norm, escola_db, turma_db)
- escola_norm / turma_norm: chave normalizada (normalize_escola/normalize_turma
  em impulso_core.py), usada para casar com a planilha do ciclo.
- escola_db / turma_db: nome exato esperado no banco — usado pela Query 1
  do próprio .sql para resolver os IDs via JOIN (Escola/EscolaSerie/Turma).

Isso é o registro "por nome", cumulativo entre ciclos e independente de
ambiente — diferente do CSV de IDs (gerar via impulso_core.carregar_mapping_csv),
que é por ambiente (homolog/produção têm IDs diferentes).

Ver projetos/importador_impulso/cli-development.md, seção 6.
"""

import os
import re

# Bloco entre "FROM (VALUES" e ") AS t(...)" — onde ficam as tuplas.
_VALUES_BLOCK_RE = re.compile(r"FROM\s*\(\s*VALUES(.*?)\)\s*AS\s+\w+\s*\(", re.IGNORECASE | re.DOTALL)

# Uma tupla ('a', 'b', 'c', N'd') — aceita espaços/quebras de linha entre os
# elementos e o prefixo N opcional (nvarchar) só no 4º campo, como usado no
# arquivo. Comentários (-- ...) entre tuplas simplesmente não casam o padrão
# e são ignorados.
_TUPLE_RE = re.compile(
    r"\(\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*N?'((?:[^']|'')*)'\s*\)"
)


class MappingEntry:
    __slots__ = ("escola_norm", "turma_norm", "escola_db", "turma_db")

    def __init__(self, escola_norm, turma_norm, escola_db, turma_db):
        self.escola_norm = escola_norm
        self.turma_norm = turma_norm
        self.escola_db = escola_db
        self.turma_db = turma_db

    @property
    def key(self):
        return (self.escola_norm, self.turma_norm)

    def __repr__(self):
        return f"MappingEntry({self.key!r} -> {self.escola_db!r}, {self.turma_db!r})"


def _unescape(s):
    return s.replace("''", "'")


def carregar_registro(caminho_sql):
    """Retorna a lista de MappingEntry na ordem em que aparecem no arquivo
    (pode ter chaves repetidas — cada ciclo só acrescenta linhas)."""
    with open(caminho_sql, encoding="utf-8") as f:
        texto = f.read()

    bloco = _VALUES_BLOCK_RE.search(texto)
    if not bloco:
        raise ValueError(f"Não encontrei o bloco 'FROM (VALUES ... ) AS t(...)' em {caminho_sql}")
    corpo = bloco.group(1)

    entradas = []
    for m in _TUPLE_RE.finditer(corpo):
        escola_norm, turma_norm, escola_db, turma_db = (_unescape(g).strip() for g in m.groups())
        entradas.append(MappingEntry(escola_norm, turma_norm, escola_db, turma_db))
    return entradas


def carregar_mapa(caminho_sql):
    """Retorna {(escola_norm, turma_norm): MappingEntry}. Se uma chave
    aparecer mais de uma vez no arquivo, a última ocorrência vence (mesmo
    comportamento do dict literal que o script já usava antes)."""
    mapa = {}
    for entrada in carregar_registro(caminho_sql):
        mapa[entrada.key] = entrada
    return mapa


if __name__ == "__main__":
    import sys

    caminho = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "resolve_ids_ra_impulso.sql"
    )
    mapa = carregar_mapa(caminho)
    print(f"{len(mapa)} combinações escola/turma registradas em {caminho}")
