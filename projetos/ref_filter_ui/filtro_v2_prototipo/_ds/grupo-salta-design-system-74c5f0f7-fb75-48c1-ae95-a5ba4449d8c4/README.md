# Gabarito Design System

> **Brand:** **Grupo Salta** (parent) · Eleva is one of Salta's products. The Salta logo is a green stacked-triangle mark + "grupo salta" wordmark. The Eleva logo (teal→green "cords" mark) is a product-level mark that lives inside this same system. **Figma sources (both attached as `.fig` virtual filesystems):**
>
> - *Gabarito | Componentes - v02* — master component library
> - *Gabarito | Design tokens - v02* — color / type / spacing / shadow / border / motion / opacity / grid tokens **Jira:** [gruposalta.atlassian.net/browse/DES-1873](https://gruposalta.atlassian.net/browse/DES-1873) **Coda:** [coda.io/d/\_dKBYlGftOiX/Componentes_su3yN](https://coda.io/d/_dKBYlGftOiX/Componentes_su3yN) The UI is written in **Portuguese (Brazil)**. Copy in this design system preserves original PT strings where they appear; new copy follows the same register.

---

## 1. What is Eleva?

Eleva is the digital product suite of **Grupo Salta**, a Brazilian education group. The file title — *"Gabarito | Componentes"* — translates as *"Template | Components"*, and this Figma is the **master component library** powering Eleva's student/school portal. The file is maintained by the Salta design team and cross-referenced from Jira tickets and Coda specs.

The library covers a full administrative portal: student record cards, class rosters, attendance, uploads, modals, alerts, toasts, navigation (headers, menus, breadcrumbs), and form primitives. The mascot / logo mark is an **abstract teal→green "E"** built from three interlocking "cord" strokes, rendered as a gradient.

### Products represented in this file

| Surface | Notes |
| --- | --- |
| **Eleva Portal (web, desktop-first)** | Primary product. Dense record-management UI for schools. Grids from 1366–1920. |
| **Eleva Portal (responsive / iPhone SE)** | Mobile variations exist in Header/ and Cards/. |
| The library is **product-agnostic at the primitive level** — buttons, inputs etc. are shared across surfaces. |  |

---

## 2. Index

| File | Purpose |
| --- | --- |
| `README.md` | this file |
| `SKILL.md` | Agent Skills entry point |
| `colors_and_type.css` | All CSS variables (color, type, radii, shadows, motion) + utility classes |
| `assets/` | Logos, logo mark SVG, icon references |
| `fonts/` | Archivo TTFs (full family — Normal + Condensed + SemiCondensed + ExtraCondensed + Expanded + SemiExpanded widths). Nunito / Inter / Inconsolata still loaded from Google Fonts. |
| `preview/` | Design System tab cards (colors, type, components, etc.) |
| `ui_kits/portal/` | Eleva Portal UI kit — interactive recreation with components (student list, student card, modal edit flow, toast) |
| `assets/grupo-salta-logo.png` | **Grupo Salta** parent logo (provided by user) |
| `assets/eleva-logo-mark.svg` | Eleva product logo mark (from Figma) |

---

## 3. Content fundamentals

**Language**: Portuguese (Brazil). Short, direct, system-voice.

**Tone**: Administrative, neutral-professional. The product is used by school staff and students; copy avoids slang, avoids exclamation points, avoids "we"/"você" hand-holding. Labels are nouns, actions are imperative verbs (*Salvar*, *Cancelar*, *Editar*, *Gerar link*).

**Casing**: Sentence case for buttons and labels ("Gerar link de anamnese"), **not** title case, **never** ALL CAPS. Page titles and section headers use the same sentence case at larger sizes.

**Person**: Third-person or imperative. Very rarely "você"; almost never "nós".

**Emoji**: **Not used.** The Figma has zero emoji in production strings; icons do the semantic work instead.

**Unicode symbols**: Only standard punctuation. No arrows, bullets, or decorative glyphs in strings.

**Examples pulled from the file**

- *"1 ano A — Militar"*  (class label; em-dash separator)
- *"Gerar link de anamnese"*  (button action; infinitive verb)
- *"Faltas 3 · Atrasos 2"*  (compact stat chip, middot separator)
- *"Ficha do aluno"*  (section title — noun phrase)
- *"E-mail: wandinho.uchiha12@gmail.com.br · Nascimento: 26/06/2010"* (record metadata, inline labels with colon + middot divider)
- Date format: **DD/MM/AAAA**, and time *"12/02/2022 às 13:30"* (note the word "às", not a dash).

**Don't-do list**

- No emoji
- No exclamation points in UI
- No "🎉", "✨", "→", "•" as text
- No title-case buttons
- No first-person ("we / our / I")

---

## 4. Visual foundations

### Colors

The palette has **three axes**:

1. **Brand gradient** — teal `#30B7BE` → green `#39D881`. Used **only** inside the logo mark and a small number of hero surfaces. **Never** used as a button background.
2. **Primary indigo `#242CC2`** — THE action color. Every filled button, every focus ring, every "selected"/"active" state uses it. Ghost and outline buttons use its text color on white.
3. **Semantic accents** — magenta `#9D0364` (counter badges, alerts), purple `#774BB0` / `#693B5A`, orange `#E65637`, amber `#FFAC30`, success green `#28975A`, info/error in standard slots.
4. **Neutrals** are warm-neutral grays, top of scale `#0F0F10` (near-black, not pure black for text), baseline border `#C3C8D1`, surface-subtle `#F8F9FB`.

### Type

- **Archivo** (local TTFs, full family — 400/500/600/700/800/900 + italics, plus Condensed / SemiCondensed / ExtraCondensed / Expanded / SemiExpanded widths). Display, headings, button text.
- **Nunito** (Regular / Bold / Italic, Google Fonts) — body copy, list items, table cells.
- **Inter** — small UI chrome fallback.
- **Inconsolata** — code snippets.

**Named type tokens** (from `/Fonts/Fonte` in the design-tokens Figma):

| Token | Font · Size/LH · Weight |
| --- | --- |
| `$font-display1` | Archivo SemiBold · 56/64 |
| `$font-display2` | Archivo SemiBold · 48/60 |
| `$font-title1` | Archivo SemiBold · 40/56 |
| `$font-title2` | Archivo SemiBold · 32/48 |
| `$font-title3` | Archivo SemiBold · 24/32 |
| `$font-title4` | Archivo SemiBold · 18/22 |
| `$font-medium` / `-bold` / `-italic` | Nunito · 24/32 |
| `$font-text` / `-bold` / `-italic` / `-underline` | Nunito · 16/24 |
| `$font-text-small` · ditto | Nunito · 14/24 |
| `$font-description` · ditto | Nunito · 12/20 |
| `$font-button1` | Archivo Bold · 16/16 |
| `$font-button2` | Archivo Bold · 14/14 |
| `$font-button3` | Archivo · 14/14 |

### Spacing

4-point grid. Tokens `$spacing-2` (4px) through `$spacing-14` (80px): `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 72 · 80`. Component inner padding is almost always `8 16` (buttons, inputs) or `16` (cards).

### Corner radius & border width

Radii (`$border-radius-0..5`): `0 · 4 · 8 ★ · 12 · 16 · 32`. `$border-radius-pill` = 999. Widths (`$border-width-0..4`): `0 · 1 ★ · 2 · 3 · 4`. **8px** is the workhorse — buttons, inputs, cards, modals. **999 (capsule)** is tags only.

### Shadows — 12-token system

Direction × size matrix, all over base color `rgba(0, 23, 31, 0.15)`:

- **Down** (`$shadow-down-{small,medium,large,xlarge}`) — default lift for cards/toasts/dropdowns.
- **Center** (`$shadow-center-*`) — ambient surround for floating elements, modals.
- **Up** (`$shadow-up-*`) — bottom sheets, sticky bars at screen bottom.

Opacity: **`$opacity-level-*`** = semiopaque (0.80) · intense (0.64) · medium (0.32) · light (0.16) · semitransparent (0.08).

### Backgrounds

- Default page background: pure **white**.
- Secondary surfaces: `#F8F9FB` (--ink-50) or `#F2F2F2`.
- **No gradients** on UI surfaces except the logo mark itself.
- **No full-bleed imagery** in the component library; product screens place photography inside rounded cards (`8px` radius, clipped).
- **No repeating patterns or textures**.

### Borders

Hairline 1px is standard. Default border `#C3C8D1`. On focus/active the border switches to indigo `#242CC2` (full color, 1px). Disabled borders drop to `#EBEDF1`.

### Hover / press / focus

- **Hover**: darken (e.g. `#242CC2` → `#1E258F`) OR surface background shift to `#EBEDF1`. No opacity trickery.
- **Press**: darker step again (`#191F88`); no transform, no scale.
- **Focus**: 3px indigo ring at 24% alpha, plus 1px solid indigo border.
- **Disabled**: `#ADB2BA` text on `#EBEDF1` fill.

### Animation — 7 named motion tokens

| Token | Duration | Easing |
| --- | --- | --- |
| `$motion-fast-1` | 80ms | ease-out |
| `$motion-fast-2` | 120ms | ease-out |
| `$motion-moderate-1` | 160ms | ease-out |
| `$motion-moderate-2` | 240ms | ease-out |
| `$linear-moderate-2` | 240ms | linear |
| `$motion-slow-1` | 400ms | ease-out |
| `$motion-slow-2` | 720ms | ease-out |

Ease-out curve is `cubic-bezier(0.16, 1, 0.3, 1)`. No bounces, no spring overshoot. Toasts use `$linear-moderate-2` for the time-bar.

### Iconography

Material-style monoline icons, 24×24, stroke-based ("Outlined" variant dominant — you see "StyleOutlined1..57" in the Figma). Individual icon SVGs live in `/Button/external/StyleOutlined/` etc. A few filled variants exist ("StyleFilled36"). **All icons are SVG, never emoji, never unicode.** For this design system we substitute with **Material Symbols Outlined** from Google Fonts CDN — same metaphors, same 24px grid. See `ICONOGRAPHY` section below.

### Layout rules — grid breakpoints

| Breakpoint | Range | Cols | Margin | Gutter | Container |
| --- | --- | --- | --- | --- | --- |
| **bp-1** · celular retrato | 0 – 575 | 4 | 24 | 16 | Fluid 100% |
| **bp-2** · tablet retrato | 576 – 991 | 12 | 24 | 16 | Fluid 100% |
| **bp-2** · tablet paisagem | 992 – 1365 | 12 | 24 | 16 | Fluid 100% |
| **bp-3** · desktop | 1366 – 1439 | 12 | 32 | 24 | Fluid 100% |
| **bp-3** · desktop grande | 1440+ | 12 | 32 | 24 | **Fixo** |

Fixed header, scrolling body. No sticky side panels. Cards: title (Archivo) → meta row (Nunito small) → body (Nunito) → actions right-aligned.

### Transparency / blur

Not used. No backdrop-filter. No translucent overlays except modal scrim (standard `rgba(0,0,0,0.5)` assumed).

### Imagery vibe

Warm, natural, student portraits when present. Low count (a handful of reused avatars across 99+ instances).

---

## 5. Iconography

**Source of truth (Figma):** \~60 Material-style outlined icons mastered as `StyleOutlined{n}.jsx` under `/external-shared/`. A handful of filled variants (`StyleFilled36`, `StyleRound7`) also exist but the outlined set dominates.

**Conventions**

- 24×24 grid, 1.5–2px stroke, rounded caps.
- Always rendered in `currentColor` so color is controlled by the parent.
- Paired with text labels in buttons; icon-only buttons exist as a separate pattern ("Icon button" / 40×40 / same radii as buttons).

**This design system ships icons via CDN** — we use **Material Symbols Outlined** (Google Fonts) which matches the visual DNA of the Figma set 1:1. Usage:

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

<span class="material-symbols-outlined">star</span>
```

Common mappings used in the Figma: `star_outline`, `notifications`, `perm_identity`, `expand_less`, `expand_more`, `cancel`, `close`, `school`, `sentiment_very_satisfied`, `search`, `menu`, `arrow_forward`, `arrow_back`, `edit`, `delete`, `download`, `upload`, `check`, `error`, `warning`, `info`.

**Emoji**: not used. **Unicode decorative chars**: not used.

---

## 6. Caveats

- **Archivo is now fully local** — the user uploaded the entire Archivo family (Normal / Condensed / SemiCondensed / ExtraCondensed / Expanded / SemiExpanded, all weights + italics). The Google Fonts Archivo import was removed; `@font-face` in `colors_and_type.css` points at local TTFs.
- **Nunito, Inter, Inconsolata** are still loaded from Google Fonts (not uploaded). If you want them local too, drop them in `fonts/` and I'll swap the imports.
- **Icons are substituted** with Material Symbols Outlined over CDN rather than extracting the \~60 individual SVGs from the Figma. The visual match is extremely close (same Material system) but if you want the exact outlines from the file, say the word and I'll copy the SVGs into `assets/icons/`.
- **Complex Figma effects** (gradient on the logo mark was trivial; nothing else uses gradients) are faithfully reproduced. No NOISE or diamond-gradient primitives were needed.
- **Cards page is 770 frames of explorations** — I inspected masters and exemplar frames, not every permutation. If you want a specific card pattern reproduced exactly, point me at the frame.
