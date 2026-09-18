"""
salta_config.py — configuração compartilhada para scripts Python do salta_brain.

Importe assim em qualquer script em _scripts/:
    from salta_config import SALTA_BRAIN, ANGULAR_FRONTENDS, FRONTEND_MAPS_DIR

Não precisa de pip install — usa apenas stdlib do Python.
"""

import json as _json
from pathlib import Path

# ---------------------------------------------------------------------------
# Caminhos base
# ---------------------------------------------------------------------------

# Raiz do salta_brain (pasta pai deste arquivo)
SALTA_BRAIN: Path = Path(__file__).resolve().parent.parent

# Base de todos os projetos (c:/projects)
PROJECTS_BASE: Path = SALTA_BRAIN.parent

# ---------------------------------------------------------------------------
# Diretórios dentro do salta_brain
# ---------------------------------------------------------------------------

FRONTEND_MAPS_DIR: Path = SALTA_BRAIN / "frontend-maps"
SCRIPTS_DIR:       Path = SALTA_BRAIN / "_scripts"
CARDS_DIR:         Path = SALTA_BRAIN / "cards"
ARCHIVE_DIR:       Path = SALTA_BRAIN / "_archive"

# ---------------------------------------------------------------------------
# Arquivos de saída/índice
# ---------------------------------------------------------------------------

REPOSITORY_MAP:      Path = SALTA_BRAIN / "_inbox" / "repository_map.md"
FRONTEND_CHANGELOG:  Path = FRONTEND_MAPS_DIR / "changelog.md"

# ---------------------------------------------------------------------------
# db_map — mapa do banco para consumo da IA
# ---------------------------------------------------------------------------

DB_MAP_DIR:          Path = SALTA_BRAIN / "_pde" / "db_map"
DB_MAP_SCHEMA_DIR:   Path = DB_MAP_DIR / "schema"
DB_MAP_DOMAINS_DIR:  Path = DB_MAP_DIR / "domains"
DB_MAP_DIAGRAMS_DIR: Path = DB_MAP_DIR / "diagrams"
DB_MAP_CHANGELOG:    Path = DB_MAP_DIR / "changelog.md"

# Configuração SQL Server — lida do claude_desktop_config.json (mesmo que o MCP usa).
# Override via variáveis de ambiente SALTA_DB_*.
def _load_mcp_sqlserver_env() -> dict[str, str]:
    """Lê as env vars do MCP sqlserver do claude_desktop_config.json."""
    cfg_path = Path.home() / "AppData" / "Roaming" / "Claude" / "claude_desktop_config.json"
    try:
        cfg = _json.loads(cfg_path.read_text(encoding="utf-8"))
        return cfg.get("mcpServers", {}).get("sqlserver", {}).get("env", {})
    except Exception:
        return {}

_mcp_env = _load_mcp_sqlserver_env()

import os as _os
SQLSERVER_HOST:     str = _os.getenv("SALTA_DB_SERVER",   _mcp_env.get("SQLSERVER_HOST",     "localhost"))
SQLSERVER_DATABASE: str = _os.getenv("SALTA_DB_NAME",     _mcp_env.get("SQLSERVER_DATABASE", "ElevaPortalHomolog"))
SQLSERVER_USER:     str = _os.getenv("SALTA_DB_USER",     _mcp_env.get("SQLSERVER_USER",     ""))
SQLSERVER_PASSWORD: str = _os.getenv("SALTA_DB_PASSWORD", _mcp_env.get("SQLSERVER_PASSWORD", ""))
SQLSERVER_DRIVER:   str = _os.getenv("SALTA_DB_DRIVER",   "ODBC Driver 17 for SQL Server")
SQLSERVER_ENCRYPT:  str = _mcp_env.get("SQLSERVER_ENCRYPT",    "false")
SQLSERVER_TRUST_CERT: str = _mcp_env.get("SQLSERVER_TRUST_CERT", "false")

# Dias antes de o db_map ser considerado stale
STALE_DB_MAP_DAYS: int = 30

# Mapeamento nome_tabela (substring) → domínio
DOMAIN_KEYWORDS: dict[str, list[str]] = {
    # frequencia tem prioridade sobre academico para tabelas como AlunoFalta
    "frequencia": ["FREQUEN", "AULA", "CHAMADA", "PRESENCA", "FALTA", "LANCAMENTO"],
    "avaliacao":  ["AVALIA", "NOTA", "BIMESTRE", "RUBRICA", "CONCEITO"],
    "academico":  ["ALUNO", "MATRICULA", "TURMA", "ESCOLA", "SERIE", "ANOLETIVO", "ANO_LETIVO"],
    "acesso":     ["PESSOA", "ACESSO", "USUARIO", "LOGIN", "PERFIL", "PERMISSAO"],
}

# ---------------------------------------------------------------------------
# Frontends Angular conhecidos
# key   = nome do repositório (igual à entrada em repository_map.md)
# value = caminho para a pasta raiz do frontend Angular (onde tsconfig.json fica)
# ---------------------------------------------------------------------------

ANGULAR_FRONTENDS: dict[str, Path] = {
    "atlas":                           PROJECTS_BASE / "atlas"                    / "frontend",
    "estrutura-pedagogica":            PROJECTS_BASE / "estrutura-pedagogica"     / "frontend",
    "notas":                           PROJECTS_BASE / "notas"                    / "frontend",
    "documentacao-pedagogica":         PROJECTS_BASE / "documentacao-pedagogica"  / "frontend",
    "documentacao-pedagogica-diario":  PROJECTS_BASE / "documentacao-pedagogica"  / "frontend-diario-classe",
    "aulas-comportamento":             PROJECTS_BASE / "aulas"                    / "frontend-comportamento",
    "aulas-consulta":                  PROJECTS_BASE / "aulas"                    / "frontend-consulta-aulas",
    "frequencia":                      PROJECTS_BASE / "frequencia"               / "frontend",
}

# ---------------------------------------------------------------------------
# Configurações gerais
# ---------------------------------------------------------------------------

# Dias antes de o mapa ser considerado stale (o command sugere reescan)
STALE_SCAN_DAYS: int = 30

# Extensões de arquivo varridas pelo scanner Angular
ANGULAR_EXTENSIONS: tuple[str, ...] = (".ts",)

# Pastas ignoradas durante o scan
SCAN_IGNORE_DIRS: set[str] = {
    "node_modules", ".angular", "dist", "coverage",
    ".git", "__pycache__", ".cache",
}
