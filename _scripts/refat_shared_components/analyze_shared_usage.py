#!/usr/bin/env python3
"""
analyze_shared_usage.py

Analisa o frontend de estrutura-pedagogica e gera dois relatórios:
  output/shared_usage.md        — quais telas/components usam cada componente shared
  output/raw_html_candidates.md — telas com HTML cru que poderiam usar shared components
  output/catalog.json           — catálogo de seletores (usado pela skill de refatoração)

Uso:
  cd C:/projects/pde_salta/_scripts/refat_shared_components
  python analyze_shared_usage.py
"""

import re
import json
import sys
from pathlib import Path
from collections import defaultdict

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from salta_config import ANGULAR_FRONTENDS, SCRIPTS_DIR

FRONTEND_SRC = ANGULAR_FRONTENDS["estrutura-pedagogica"] / "src"
OUTPUT_DIR = SCRIPTS_DIR / "refat_shared_components" / "output"

SHARED_COMPONENTS_DIR = FRONTEND_SRC / "shared" / "components"
DYNAMIC_COMPONENTS_DIR = FRONTEND_SRC / "shared" / "dynamic-components"

SCAN_ROOTS = [
    FRONTEND_SRC / "app",
    FRONTEND_SRC / "portal-modulo",
]

# (regex no template, sugestão de componente, caminho do componente)
RAW_HTML_PATTERNS = [
    (
        r"<button\b",
        "app-button",
        "shared/components/button",
    ),
    (
        r"<input[^>]+type=[\"']date[\"']",
        "date-field (standalone) / app-date-field (reactive)",
        "shared/components/date-field | shared/dynamic-components/date-field",
    ),
    (
        r"<input[^>]+type=[\"']text[\"']",
        "text-field",
        "shared/dynamic-components/text-field",
    ),
    (
        r"<input[^>]+type=[\"']number[\"']",
        "app-number-field",
        "shared/dynamic-components/number-field",
    ),
    (
        r"<input[^>]+type=[\"']time[\"']",
        "app-time-field",
        "shared/dynamic-components/time-field",
    ),
    (
        r"<input[^>]+type=[\"']checkbox[\"']",
        "app-checkbox",
        "shared/dynamic-components/checkbox",
    ),
    (
        r"<input[^>]+type=[\"']radio[\"']",
        "app-radio-field",
        "shared/dynamic-components/radio-field",
    ),
    (
        r"<textarea\b",
        "app-textarea-field",
        "shared/dynamic-components/textarea-field",
    ),
    (
        r"<select\b",
        "single-select (standalone) / app-select-field (reactive)",
        "shared/components/select-field | shared/dynamic-components/select-field",
    ),
]


def extract_selector(ts_path: Path) -> str | None:
    try:
        content = ts_path.read_text(encoding="utf-8", errors="ignore")
        m = re.search(r"selector:\s*['\"]([^'\"]+)['\"]", content)
        return m.group(1) if m else None
    except Exception:
        return None


def build_catalog() -> dict:
    """Extrai selector, classe e caminho de todos os shared/dynamic components."""
    catalog = {}
    for base_dir, category in [
        (SHARED_COMPONENTS_DIR, "shared"),
        (DYNAMIC_COMPONENTS_DIR, "dynamic"),
    ]:
        if not base_dir.exists():
            print(f"  AVISO: diretório não encontrado: {base_dir}")
            continue
        for ts_file in sorted(base_dir.rglob("*.component.ts")):
            selector = extract_selector(ts_file)
            if selector:
                catalog[selector] = {
                    "file": ts_file.relative_to(FRONTEND_SRC).as_posix(),
                    "category": category,
                    "folder": ts_file.parent.name,
                }
    return catalog


def scan_templates(catalog: dict):
    """
    Percorre todos os templates das SCAN_ROOTS.
    Retorna:
      usage_map:      seletor → [caminho do template]
      raw_candidates: caminho do template → [ocorrências de HTML cru]
    """
    usage_map: dict[str, list[str]] = defaultdict(list)
    raw_candidates: dict[str, list[dict]] = defaultdict(list)

    for root in SCAN_ROOTS:
        if not root.exists():
            continue
        for html_file in sorted(root.rglob("*.html")):
            rel = html_file.relative_to(FRONTEND_SRC).as_posix()
            try:
                content = html_file.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            lines = content.splitlines()

            # Uso de shared components
            for selector in catalog:
                if re.search(rf"<{re.escape(selector)}[\s>/]", content):
                    usage_map[selector].append(rel)

            # HTML cru substituível
            for pattern, suggestion, component_path in RAW_HTML_PATTERNS:
                for i, line in enumerate(lines, 1):
                    if re.search(pattern, line, re.IGNORECASE):
                        raw_candidates[rel].append(
                            {
                                "suggestion": suggestion,
                                "component": component_path,
                                "line": i,
                                "snippet": line.strip()[:120],
                            }
                        )

    return usage_map, raw_candidates


def render_usage_report(catalog: dict, usage_map: dict) -> str:
    total = len(catalog)
    unused = sum(1 for s in catalog if not usage_map.get(s))
    out = [
        "# Uso dos Shared Components\n",
        f"Seletores catalogados: **{total}** | Sem uso detectado: **{unused}**\n",
    ]

    for category_label, cat_key in [
        ("shared/components", "shared"),
        ("shared/dynamic-components", "dynamic"),
    ]:
        out.append(f"\n## {category_label}\n")
        for selector, info in sorted(catalog.items(), key=lambda x: x[0]):
            if info["category"] != cat_key:
                continue
            usages = sorted(usage_map.get(selector, []))
            out.append(f"### `<{selector}>` — `{info['folder']}`")
            if usages:
                out.append(f"Usado em **{len(usages)}** template(s):")
                for u in usages:
                    out.append(f"  - `{u}`")
            else:
                out.append("  _(não encontrado em nenhum template)_")
            out.append("")

    return "\n".join(out)


def render_candidates_report(raw_candidates: dict) -> str:
    if not raw_candidates:
        return "# Candidatos à Refatoração\n\nNenhum HTML cru encontrado.\n"

    summary: dict[str, int] = defaultdict(int)
    for findings in raw_candidates.values():
        for f in findings:
            summary[f["suggestion"]] += 1

    out = [
        "# Candidatos à Refatoração — HTML Cru → Shared Components\n",
        f"Templates com HTML substituível: **{len(raw_candidates)}**\n",
        "## Resumo por padrão\n",
    ]
    for suggestion, count in sorted(summary.items(), key=lambda x: -x[1]):
        out.append(f"- `{suggestion}`: {count} ocorrência(s)")

    out.append("\n## Detalhe por template\n")
    for template, findings in sorted(raw_candidates.items()):
        out.append(f"### `{template}`\n")
        for f in findings:
            out.append(
                f"  - linha **{f['line']}**: substituir por `<{f['suggestion']}>` "
                f"(`{f['component']}`)"
            )
            out.append("    ```html")
            out.append(f"    {f['snippet']}")
            out.append("    ```")
        out.append("")

    return "\n".join(out)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Catalogando shared/dynamic components...")
    catalog = build_catalog()
    print(f"  {len(catalog)} seletores encontrados")

    print("Varrendo templates...")
    usage_map, raw_candidates = scan_templates(catalog)
    total_usages = sum(len(v) for v in usage_map.values())
    print(f"  {total_usages} referências a shared components encontradas")
    print(f"  {len(raw_candidates)} templates com HTML substituível")

    (OUTPUT_DIR / "shared_usage.md").write_text(
        render_usage_report(catalog, usage_map), encoding="utf-8"
    )
    (OUTPUT_DIR / "raw_html_candidates.md").write_text(
        render_candidates_report(raw_candidates), encoding="utf-8"
    )

    catalog_with_usages = {
        selector: {**info, "usages": usage_map.get(selector, [])}
        for selector, info in catalog.items()
    }
    (OUTPUT_DIR / "catalog.json").write_text(
        json.dumps(catalog_with_usages, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"\nSaída gerada em: {OUTPUT_DIR.resolve()}")
    print("  - shared_usage.md")
    print("  - raw_html_candidates.md")
    print("  - catalog.json")


if __name__ == "__main__":
    main()
