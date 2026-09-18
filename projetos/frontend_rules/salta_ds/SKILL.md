---
name: eleva-design
description: Use this skill to generate well-branded interfaces and assets for Eleva (the Grupo Salta student portal), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# eleva-design

Read the `README.md` file within this skill, and explore the other available files.

This skill contains:

- `README.md` — company context, content fundamentals (PT-BR voice), visual foundations, iconography rules, caveats.
- `colors_and_type.css` — every CSS var you need (color, type, spacing, radii, shadow, motion) + utility classes.
- `assets/` — logo mark SVG and other brand assets.
- `preview/` — reference cards used by the Design System tab.
- `ui_kits/portal/` — a working interactive recreation of the Eleva Portal with reusable JSX components.

## How to use

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files the user can view. If working on production code, you can read the rules here and use the tokens in `colors_and_type.css` to become an expert in designing with this brand.

Always:
- Import `colors_and_type.css` at the top of any HTML you make.
- Load **Material Symbols Outlined** from Google Fonts for iconography.
- Use **Nunito** for body, **Archivo** for headings/buttons, **Inter** for UI labels (Factor A substitute), **Inconsolata** for code.
- Primary action color is **indigo `#242CC2`**. The teal→green gradient is reserved for the logo mark.
- Copy is **Portuguese (Brazil)**, sentence-case, no emoji, no exclamation points.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a couple of clarifying questions about audience and surface, and act as an expert Eleva designer who outputs HTML artifacts _or_ production code, depending on the need.
