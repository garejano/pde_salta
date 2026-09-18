#!/usr/bin/env python3
"""
scan_angular.py — Escaneia projeto Angular e gera angular-map.md no salta_brain.

Uso:
    python scan_angular.py estrutura-pedagogica
    python scan_angular.py c:/projects/notas/frontend
    python scan_angular.py --all
    python scan_angular.py --list
"""
from __future__ import annotations

import re
import sys
import argparse
from pathlib import Path
from datetime import date
from dataclasses import dataclass, field
from typing import Optional

sys.path.insert(0, str(Path(__file__).parent))
from salta_config import (
    ANGULAR_FRONTENDS,
    FRONTEND_MAPS_DIR,
    FRONTEND_CHANGELOG,
    REPOSITORY_MAP,
    SCAN_IGNORE_DIRS,
    STALE_SCAN_DAYS,
)

# ---------------------------------------------------------------------------
# Estruturas de dados
# ---------------------------------------------------------------------------

@dataclass
class ComponentInfo:
    name: str
    selector: str
    file_rel: str
    feature: str
    inputs: list[tuple[str, str]] = field(default_factory=list)
    outputs: list[str] = field(default_factory=list)
    injected: list[str] = field(default_factory=list)

@dataclass
class ServiceInfo:
    name: str
    file_rel: str
    feature: str
    provided_in: str = "root"
    injected: list[str] = field(default_factory=list)
    public_methods: list[str] = field(default_factory=list)

@dataclass
class ModuleInfo:
    name: str
    file_rel: str
    declarations: list[str] = field(default_factory=list)
    imports: list[str] = field(default_factory=list)
    exports: list[str] = field(default_factory=list)
    providers: list[str] = field(default_factory=list)

@dataclass
class RouteEntry:
    path_val: str          # string literal ou "path.X" (computed)
    component: str = ""
    lazy_module: str = ""  # nome do módulo/feature lazy-loaded
    guards: list[str] = field(default_factory=list)

@dataclass
class NgRxFeature:
    name: str
    actions: list[str] = field(default_factory=list)
    selectors: list[str] = field(default_factory=list)
    effects: list[str] = field(default_factory=list)

@dataclass
class ModelInfo:
    name: str
    kind: str   # "interface" ou "type"
    file_rel: str
    fields: list[str] = field(default_factory=list)

# ---------------------------------------------------------------------------
# Padrões regex
# ---------------------------------------------------------------------------

# Detectores de tipo de arquivo
RE_HAS_COMPONENT  = re.compile(r'@Component\s*\(')
RE_HAS_INJECTABLE = re.compile(r'@Injectable\s*\(')
RE_HAS_NGMODULE   = re.compile(r'@NgModule\s*\(')

# Decorator properties
RE_SELECTOR    = re.compile(r"selector\s*:\s*['\"]([^'\"]+)['\"]")
RE_PROVIDED_IN = re.compile(r"providedIn\s*:\s*['\"]([^'\"]+)['\"]")

# Class name
RE_CLASS_NAME = re.compile(r"(?:export\s+)?(?:abstract\s+)?class\s+(\w+)")

# Inputs: @Input() name: Type  e  @Input('alias') name: Type
RE_INPUT_DECORATOR = re.compile(
    r"@Input\s*\([^)]*\)\s*(?:readonly\s+)?(\w+)\s*[!?]?\s*:\s*([\w<>\[\]|,\s.]+?)(?:\s*[;=\n])",
    re.MULTILINE,
)
# Angular 17+ input signals: name = input<Type>(...)
RE_INPUT_SIGNAL = re.compile(r"(\w+)\s*=\s*input(?:Required)?(?:<[^>]+>)?\s*\(")

# Outputs
RE_OUTPUT_DECORATOR = re.compile(r"@Output\s*\([^)]*\)\s*(?:readonly\s+)?(\w+)")
RE_OUTPUT_SIGNAL    = re.compile(r"(\w+)\s*=\s*output(?:<[^>]+>)?\s*\(")

# Constructor injection: private/public/protected varName: ClassName
RE_CTOR_INJECT = re.compile(
    r"(?:private|protected|public|readonly)\s+(\w+)\s*:\s*(\w+)"
)
# inject() function: varName = inject(ClassName)
RE_INJECT_FN = re.compile(r"(\w+)\s*=\s*inject\s*\(\s*(\w+)\s*\)")

# Public methods (excludes lifecycle hooks and private-convention _names)
RE_PUBLIC_METHOD = re.compile(
    r"^\s*(?:public\s+)?(?!ngOn|ngAfter|ngDo|ngDestroy|constructor\b|get\s|set\s|_)"
    r"([a-z]\w+)\s*\([^)]*\)\s*(?::\s*[\w<>\[\]|,\s.]+?)?\s*\{",
    re.MULTILINE,
)
LIFECYCLE_HOOKS = {
    "ngOnInit", "ngOnDestroy", "ngOnChanges", "ngAfterViewInit",
    "ngAfterContentInit", "ngAfterViewChecked", "ngAfterContentChecked",
    "ngDoCheck",
}

# NgRx
RE_NGRX_ACTION   = re.compile(r"createAction\s*\(\s*['\"]([^'\"]+)['\"]")
RE_NGRX_SELECTOR = re.compile(r"export\s+const\s+(\w+)\s*=\s*createSelector")
RE_NGRX_EFFECT   = re.compile(r"export\s+const\s+(\w+\$)\s*=\s*createEffect")

# Interfaces e types
RE_INTERFACE = re.compile(
    r"export\s+interface\s+(\w+)(?:\s+extends\s+[\w<>,\s]+)?\s*\{([^}]*)\}",
    re.DOTALL,
)
RE_TYPE_OBJ = re.compile(
    r"export\s+type\s+(\w+)\s*=\s*\{([^}]*)\}",
    re.DOTALL,
)
RE_FIELD = re.compile(
    r"^\s+(\w+)\s*[?!]?\s*:\s*([\w<>\[\]|,\s.]+?)\s*;",
    re.MULTILINE,
)

# Rotas — string literal
RE_ROUTE_STR = re.compile(r"\bpath\s*:\s*['\"]([^'\"]*)['\"]")
# Rotas — computed (path.X ou path.X.Y)
RE_ROUTE_REF = re.compile(r"\bpath\s*:\s*(path\.\w+(?:\.\w+)?)")
# Component associado à rota
RE_ROUTE_COMPONENT = re.compile(r"\bcomponent\s*:\s*(\w+Component|\w+Page)")
# Lazy load — extrai nome de feature do caminho do import
RE_LAZY_IMPORT = re.compile(r"import\(['\"]([^'\"]+)['\"]")
# Guards
RE_GUARD = re.compile(r"\b(\w+Guard)\b")

# Environment URLs
RE_ENV_URL = re.compile(
    r"(?:apiUrl|baseUrl|url|apiBase|backendUrl|endpoint)\s*:\s*['\"]([^'\"]+)['\"]",
)

# ---------------------------------------------------------------------------
# Utilitários
# ---------------------------------------------------------------------------

def get_feature(path: Path, frontend_root: Path) -> str:
    """Deriva feature a partir da estrutura src/app/features/<feature>/..."""
    try:
        parts = path.relative_to(frontend_root).parts
    except ValueError:
        return "root"

    # Padrão primário: .../features/<feature>/...
    if "features" in parts:
        idx = list(parts).index("features")
        if len(parts) > idx + 1:
            return parts[idx + 1]

    # Fallback: pasta logo após 'app'
    if "app" in parts:
        idx = list(parts).index("app")
        if len(parts) > idx + 2:
            return parts[idx + 1]

    # Fallback: pasta pai do arquivo
    return parts[-2] if len(parts) > 1 else "root"


def extract_decorator_body(content: str, decorator: str) -> Optional[str]:
    """Extrai o conteúdo de @Decorator({...}) lidando com chaves aninhadas."""
    marker = f"@{decorator}("
    start = content.find(marker)
    if start == -1:
        return None
    paren_start = start + len(marker) - 1
    depth = 0
    for i in range(paren_start, len(content)):
        if content[i] == "(":
            depth += 1
        elif content[i] == ")":
            depth -= 1
            if depth == 0:
                return content[paren_start + 1 : i]
    return None


def extract_array_items(text: str, key: str) -> list[str]:
    """Extrai identificadores PascalCase de uma propriedade array no body de um decorator."""
    pat = re.compile(
        rf"{key}\s*:\s*\[([^\[\]]*(?:\[[^\[\]]*\][^\[\]]*)*)\]", re.DOTALL
    )
    m = pat.search(text)
    if not m:
        return []
    return re.findall(r"\b([A-Z]\w+)\b", m.group(1))


def get_class_name(content: str) -> Optional[str]:
    m = RE_CLASS_NAME.search(content)
    return m.group(1) if m else None


def collect_injected(content: str) -> list[str]:
    """Retorna nomes de tipos injetados via constructor ou inject()."""
    result: set[str] = set()
    for _, typename in RE_CTOR_INJECT.findall(content):
        if typename[0].isupper():
            result.add(typename)
    for _, typename in RE_INJECT_FN.findall(content):
        if typename[0].isupper():
            result.add(typename)
    return sorted(result)


def walk_ts_files(root: Path) -> list[Path]:
    files = []
    for path in root.rglob("*.ts"):
        if any(part in SCAN_IGNORE_DIRS for part in path.parts):
            continue
        if path.stem.endswith(".spec"):
            continue
        files.append(path)
    return sorted(files)


def file_rel(path: Path, frontend_root: Path) -> str:
    try:
        return str(path.relative_to(frontend_root)).replace("\\", "/")
    except ValueError:
        return str(path)


# ---------------------------------------------------------------------------
# Parsers
# ---------------------------------------------------------------------------

def parse_component(
    content: str, path: Path, frontend_root: Path
) -> Optional[ComponentInfo]:
    body = extract_decorator_body(content, "Component")
    if body is None:
        return None
    name = get_class_name(content)
    if not name:
        return None

    sel_m = RE_SELECTOR.search(body)
    selector = sel_m.group(1) if sel_m else ""

    inputs = [
        (m.group(1), m.group(2).strip())
        for m in RE_INPUT_DECORATOR.finditer(content)
    ]
    inputs += [(m.group(1), "signal") for m in RE_INPUT_SIGNAL.finditer(content)]

    outputs = [m.group(1) for m in RE_OUTPUT_DECORATOR.finditer(content)]
    outputs += [m.group(1) for m in RE_OUTPUT_SIGNAL.finditer(content)]

    return ComponentInfo(
        name=name,
        selector=selector,
        file_rel=file_rel(path, frontend_root),
        feature=get_feature(path, frontend_root),
        inputs=inputs[:8],
        outputs=outputs[:6],
        injected=collect_injected(content)[:6],
    )


def parse_service(
    content: str, path: Path, frontend_root: Path
) -> Optional[ServiceInfo]:
    body = extract_decorator_body(content, "Injectable")
    if body is None:
        return None
    name = get_class_name(content)
    if not name:
        return None

    prov_m = RE_PROVIDED_IN.search(body)
    provided_in = prov_m.group(1) if prov_m else "none"

    methods = [
        m.group(1)
        for m in RE_PUBLIC_METHOD.finditer(content)
        if m.group(1) not in LIFECYCLE_HOOKS
    ]

    return ServiceInfo(
        name=name,
        file_rel=file_rel(path, frontend_root),
        feature=get_feature(path, frontend_root),
        provided_in=provided_in,
        injected=collect_injected(content)[:5],
        public_methods=methods[:8],
    )


def parse_module(
    content: str, path: Path, frontend_root: Path
) -> Optional[ModuleInfo]:
    body = extract_decorator_body(content, "NgModule")
    if body is None:
        return None
    name = get_class_name(content)
    if not name:
        return None

    return ModuleInfo(
        name=name,
        file_rel=file_rel(path, frontend_root),
        declarations=extract_array_items(body, "declarations"),
        imports=extract_array_items(body, "imports"),
        exports=extract_array_items(body, "exports"),
        providers=extract_array_items(body, "providers"),
    )


def parse_routes(content: str) -> list[RouteEntry]:
    """
    Extrai rotas de arquivos *-routing.module.ts e *.routes.ts.
    Divide o conteúdo em blocos { } e tenta extrair path + componente/lazy.
    """
    routes: list[RouteEntry] = []
    seen: set[str] = set()

    # Quebra o conteúdo em blocos delimitados por chaves de nível 1
    blocks: list[str] = []
    depth = 0
    buf_start = -1
    for i, ch in enumerate(content):
        if ch == "{":
            if depth == 0:
                buf_start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and buf_start != -1:
                blocks.append(content[buf_start : i + 1])
                buf_start = -1

    for block in blocks:
        # Precisa ter 'path:'
        if "path" not in block:
            continue

        # Tenta extrair path — string literal primeiro, depois computed
        path_val = ""
        str_m = RE_ROUTE_STR.search(block)
        ref_m = RE_ROUTE_REF.search(block)
        if str_m:
            path_val = str_m.group(1)
        elif ref_m:
            path_val = ref_m.group(1)

        if not path_val or path_val in seen:
            continue
        seen.add(path_val)

        comp_m = RE_ROUTE_COMPONENT.search(block)
        component = comp_m.group(1) if comp_m else ""

        lazy_module = ""
        lazy_m = RE_LAZY_IMPORT.search(block)
        if lazy_m:
            # Extrai nome legível do caminho: ./features/periodo-letivo/... → periodo-letivo
            import_path = lazy_m.group(1)
            parts = [p for p in import_path.replace("\\", "/").split("/") if p not in (".", "..")]
            # Pega a segunda parte significativa (geralmente o nome da feature)
            lazy_module = parts[-2] if len(parts) >= 2 else parts[-1] if parts else ""

        guards = RE_GUARD.findall(block)

        routes.append(
            RouteEntry(
                path_val=path_val,
                component=component,
                lazy_module=lazy_module,
                guards=list(dict.fromkeys(guards)),  # deduplica mantendo ordem
            )
        )

    return routes


def parse_ngrx(content: str) -> dict[str, list[str]]:
    return {
        "actions":   RE_NGRX_ACTION.findall(content),
        "selectors": RE_NGRX_SELECTOR.findall(content),
        "effects":   RE_NGRX_EFFECT.findall(content),
    }


def parse_models(
    content: str, path: Path, frontend_root: Path
) -> list[ModelInfo]:
    models: list[ModelInfo] = []
    for pattern, kind in ((RE_INTERFACE, "interface"), (RE_TYPE_OBJ, "type")):
        for m in pattern.finditer(content):
            name, body = m.group(1), m.group(2)
            fields = [
                f"{fm.group(1)}: {fm.group(2).strip()}"
                for fm in RE_FIELD.finditer(body)
            ]
            models.append(
                ModelInfo(
                    name=name,
                    kind=kind,
                    file_rel=file_rel(path, frontend_root),
                    fields=fields[:8],
                )
            )
    return models


# ---------------------------------------------------------------------------
# Renderer
# ---------------------------------------------------------------------------

def _trunc(items: list, n: int) -> str:
    shown = items[:n]
    tail = f"... +{len(items) - n}" if len(items) > n else ""
    return ", ".join(str(x) for x in shown) + (f", {tail}" if tail else "")


def render_map(
    repo_name: str,
    frontend_root: Path,
    components: list[ComponentInfo],
    services: list[ServiceInfo],
    modules: list[ModuleInfo],
    routes: list[RouteEntry],
    ngrx: dict[str, NgRxFeature],
    models: list[ModelInfo],
    env_urls: list[str],
) -> str:
    today = date.today().isoformat()
    lines = [
        f"# Angular Map — {repo_name}",
        f"> Gerado em: {today}  ",
        f"> Fonte: `{frontend_root}`",
        "",
    ]

    # --- Módulos ---
    if modules:
        lines += ["## Módulos", ""]
        for m in sorted(modules, key=lambda x: x.name):
            parts = [f"**{m.name}**"]
            if m.declarations:
                parts.append(f"declara: [{_trunc(m.declarations, 5)}]")
            if m.imports:
                parts.append(f"importa: [{_trunc(m.imports, 5)}]")
            if m.exports:
                parts.append(f"exporta: [{_trunc(m.exports, 4)}]")
            lines.append("- " + " · ".join(parts))
        lines.append("")

    # --- Rotas ---
    if routes:
        lines += ["## Rotas", ""]
        for r in routes:
            if r.component:
                target = r.component
            elif r.lazy_module:
                target = f"{r.lazy_module} *(lazy)*"
            else:
                target = "?"
            guard_str = f" `[{', '.join(r.guards)}]`" if r.guards else ""
            lines.append(f"- `{r.path_val}` → {target}{guard_str}")
        lines.append("")

    # --- Componentes por feature ---
    if components:
        lines += ["## Componentes", ""]
        by_feature: dict[str, list[ComponentInfo]] = {}
        for c in components:
            by_feature.setdefault(c.feature, []).append(c)
        for feat in sorted(by_feature):
            lines.append(f"### {feat}")
            for c in sorted(by_feature[feat], key=lambda x: x.name):
                sel = f" `{c.selector}`" if c.selector else ""
                lines.append(f"- **{c.name}**{sel}")
                if c.inputs:
                    inp_str = ", ".join(
                        f"{n}: {t}" for n, t in c.inputs[:4]
                    ) + (f"... +{len(c.inputs)-4}" if len(c.inputs) > 4 else "")
                    lines.append(f"  - @Input: {inp_str}")
                if c.outputs:
                    lines.append(f"  - @Output: {_trunc(c.outputs, 4)}")
                if c.injected:
                    lines.append(f"  - Injeta: {_trunc(c.injected, 5)}")
            lines.append("")

    # --- Services por feature ---
    if services:
        lines += ["## Services", ""]
        by_feature = {}
        for s in services:
            by_feature.setdefault(s.feature, []).append(s)
        for feat in sorted(by_feature):
            lines.append(f"### {feat}")
            for s in sorted(by_feature[feat], key=lambda x: x.name):
                lines.append(f"- **{s.name}** ({s.provided_in})")
                if s.injected:
                    lines.append(f"  - Injeta: {_trunc(s.injected, 4)}")
                if s.public_methods:
                    lines.append(f"  - Métodos: {_trunc(s.public_methods, 6)}")
            lines.append("")

    # --- NgRx ---
    if ngrx:
        lines += ["## NgRx", ""]
        for feat_name in sorted(ngrx):
            f = ngrx[feat_name]
            lines.append(f"### feature: {feat_name}")
            if f.actions:
                lines.append(f"- Actions: {_trunc(f.actions, 6)}")
            if f.selectors:
                lines.append(f"- Selectors: {_trunc(f.selectors, 6)}")
            if f.effects:
                lines.append(f"- Effects: {_trunc(f.effects, 6)}")
            lines.append("")

    # --- Models ---
    if models:
        lines += ["## Models", ""]
        # Deduplica por nome (um model pode aparecer em múltiplos arquivos via re-export)
        seen_names: set[str] = set()
        for m in sorted(models, key=lambda x: x.name):
            if m.name in seen_names:
                continue
            seen_names.add(m.name)
            fields_str = _trunc(m.fields, 5) if m.fields else ""
            suffix = f": {fields_str}" if fields_str else ""
            lines.append(f"- **{m.name}** ({m.kind}){suffix}")
        lines.append("")

    # --- Environment URLs ---
    if env_urls:
        lines += ["## URLs de ambiente", ""]
        for url in sorted(set(env_urls)):
            lines.append(f"- `{url}`")
        lines.append("")

    # --- Rodapé com stats ---
    lines += [
        "---",
        f"*{len(components)} componentes · "
        f"{len(services)} services · "
        f"{len(modules)} módulos · "
        f"{len(models)} models · "
        f"{len(routes)} rotas*",
    ]

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Pós-processamento: changelog e repository_map
# ---------------------------------------------------------------------------

def update_changelog(repo_name: str, map_file: Path) -> None:
    today = date.today().isoformat()
    link = f"[angular-map]({map_file.name})"
    new_row = f"| {repo_name} | {today} | {link} |"

    content = FRONTEND_CHANGELOG.read_text(encoding="utf-8")

    # Remove placeholder inicial
    content = re.sub(
        r"\| \*\(nenhum scan executado ainda\)\*.*\n?", "", content
    )

    row_pat = re.compile(
        rf"^\| {re.escape(repo_name)} \|.*$", re.MULTILINE
    )
    if row_pat.search(content):
        content = row_pat.sub(new_row, content)
    else:
        # Append após a última linha de tabela
        last_row = list(re.finditer(r"^\|.+\|$", content, re.MULTILINE))
        if last_row:
            insert = last_row[-1].end()
            content = content[:insert] + "\n" + new_row + content[insert:]
        else:
            content = content.rstrip() + "\n" + new_row + "\n"

    FRONTEND_CHANGELOG.write_text(content, encoding="utf-8")


def update_repository_map(repo_name: str, map_file: Path) -> None:
    if not REPOSITORY_MAP.exists():
        print(f"  [SKIP] repository_map.md não encontrado em {REPOSITORY_MAP} — pulando atualização")
        return
    today = date.today().isoformat()
    rel_path = f"frontend-maps/{map_file.name}"
    field_line = (
        f"**Frontend Map:** "
        f"[`{rel_path}`]({rel_path}) "
        f"*(escaneado em: {today})*"
    )

    content = REPOSITORY_MAP.read_text(encoding="utf-8")

    # Verifica se a seção existe
    sec_m = re.search(
        rf"^## {re.escape(repo_name)}\s*$", content, re.MULTILINE
    )
    if not sec_m:
        return

    # Substitui campo existente ou insere após o último campo **...**:
    existing = re.compile(r"^\*\*Frontend Map:\*\*.*$", re.MULTILINE)
    # Encontra a seção (entre o ## e o próximo ---)
    sec_start = sec_m.start()
    sep_pos = content.find("\n---", sec_start)
    if sep_pos == -1:
        return
    section = content[sec_start:sep_pos]

    if existing.search(section):
        new_section = existing.sub(field_line, section)
    else:
        # Insere após o último campo **Xxx:**
        last_field = None
        # Formato real: **FieldName:** valor (colon está DENTRO do bold, antes do **)
        for fm in re.finditer(r"^\*\*[^*]+:\*\*.*$", section, re.MULTILINE):
            last_field = fm
        if last_field:
            ins = sec_start + last_field.end()
            content = content[:ins] + "\n" + field_line + content[ins:]
        else:
            # Fallback: insere na segunda linha da seção
            eol = content.index("\n", sec_start)
            content = content[:eol + 1] + field_line + "\n" + content[eol + 1:]
        REPOSITORY_MAP.write_text(content, encoding="utf-8")
        return

    content = content[:sec_start] + new_section + content[sec_start + len(section):]
    REPOSITORY_MAP.write_text(content, encoding="utf-8")


# ---------------------------------------------------------------------------
# Motor principal
# ---------------------------------------------------------------------------

def scan(repo_name: str, frontend_root: Path) -> None:
    src_root = frontend_root / "src"
    walk_root = src_root if src_root.exists() else frontend_root

    print(f"\nScanning [{repo_name}]: {frontend_root}")

    ts_files = walk_ts_files(walk_root)
    print(f"  {len(ts_files)} arquivos .ts encontrados")

    components: list[ComponentInfo] = []
    services:   list[ServiceInfo]   = []
    modules:    list[ModuleInfo]    = []
    routes:     list[RouteEntry]    = []
    ngrx_map:   dict[str, NgRxFeature] = {}
    models:     list[ModelInfo]     = []
    env_urls:   list[str]           = []

    for ts_file in ts_files:
        try:
            content = ts_file.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            print(f"  [WARN] Não foi possível ler {ts_file.name}: {e}")
            continue

        stem = ts_file.stem.lower()

        # Environment URLs
        if "environment" in stem:
            env_urls += RE_ENV_URL.findall(content)

        # Routing
        if "routing" in stem or stem.endswith(".routes"):
            routes += parse_routes(content)

        # Models / interfaces
        if any(tag in stem for tag in ("model", "models", "interface", "dto", "entity", "type")):
            models += parse_models(content, ts_file, frontend_root)

        # NgRx
        ngrx_found = parse_ngrx(content)
        if any(ngrx_found.values()):
            feat = get_feature(ts_file, frontend_root)
            if feat not in ngrx_map:
                ngrx_map[feat] = NgRxFeature(name=feat)
            ngrx_map[feat].actions   += ngrx_found["actions"]
            ngrx_map[feat].selectors += ngrx_found["selectors"]
            ngrx_map[feat].effects   += ngrx_found["effects"]

        # Decorated classes (mutuamente exclusivo — Component tem prioridade)
        if RE_HAS_COMPONENT.search(content):
            c = parse_component(content, ts_file, frontend_root)
            if c:
                components.append(c)
        elif RE_HAS_INJECTABLE.search(content):
            s = parse_service(content, ts_file, frontend_root)
            if s:
                services.append(s)
        elif RE_HAS_NGMODULE.search(content):
            m = parse_module(content, ts_file, frontend_root)
            if m:
                modules.append(m)

    # Remove features NgRx vazias
    ngrx = {k: v for k, v in ngrx_map.items() if v.actions or v.selectors or v.effects}

    print(
        f"  {len(components)} componentes  "
        f"{len(services)} services  "
        f"{len(modules)} módulos  "
        f"{len(models)} models  "
        f"{len(routes)} rotas"
    )

    # Gera e salva o mapa
    md = render_map(
        repo_name, frontend_root,
        components, services, modules, routes, ngrx, models, env_urls,
    )

    FRONTEND_MAPS_DIR.mkdir(parents=True, exist_ok=True)
    out_file = FRONTEND_MAPS_DIR / f"{repo_name}-angular-map.md"
    out_file.write_text(md, encoding="utf-8")
    print(f"  -> {out_file}")

    update_changelog(repo_name, out_file)
    update_repository_map(repo_name, out_file)
    print(f"  -> changelog.md e repository_map.md atualizados")


def resolve_target(arg: str) -> tuple[str, Path]:
    """Retorna (repo_name, frontend_root) a partir de nome configurado ou caminho direto."""
    if arg in ANGULAR_FRONTENDS:
        p = ANGULAR_FRONTENDS[arg]
        if not p.exists():
            raise FileNotFoundError(
                f"Caminho configurado não existe: {p}\n"
                f"Verifique ANGULAR_FRONTENDS em salta_config.py"
            )
        return arg, p
    p = Path(arg)
    if p.exists():
        # Deriva repo_name da pasta pai se o diretório se chamar 'frontend*'
        name = p.parent.name if p.name.startswith("frontend") else p.name
        return name, p
    raise ValueError(
        f"'{arg}' não é um repositório conhecido nem um caminho existente.\n"
        f"Repositórios conhecidos: {', '.join(ANGULAR_FRONTENDS)}"
    )


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Escaneia projeto Angular e gera angular-map.md no salta_brain.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
exemplos:
  python scan_angular.py estrutura-pedagogica
  python scan_angular.py c:/projects/notas/frontend
  python scan_angular.py --all
  python scan_angular.py --list
""",
    )
    parser.add_argument(
        "target",
        nargs="?",
        help="Nome do repo (ex: estrutura-pedagogica) ou caminho direto do frontend",
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Escaneia todos os frontends conhecidos em salta_config.ANGULAR_FRONTENDS",
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="Lista repositórios Angular conhecidos e verifica se os caminhos existem",
    )

    args = parser.parse_args()

    if args.list:
        print("Repositórios Angular em salta_config.ANGULAR_FRONTENDS:")
        for name, path in ANGULAR_FRONTENDS.items():
            ok = "✔" if path.exists() else "✗"
            print(f"  {ok} {name:<45} {path}")
        return

    if args.all:
        errors = []
        for name, path in ANGULAR_FRONTENDS.items():
            if path.exists():
                try:
                    scan(name, path)
                except Exception as e:
                    errors.append((name, e))
                    print(f"  [ERRO] {e}")
            else:
                print(f"\n[SKIP] {name} — caminho não existe: {path}")
        if errors:
            print(f"\n{len(errors)} repositório(s) com erro.")
        return

    if not args.target:
        parser.print_help()
        return

    try:
        repo_name, frontend_root = resolve_target(args.target)
        scan(repo_name, frontend_root)
    except (ValueError, FileNotFoundError) as e:
        print(f"Erro: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
