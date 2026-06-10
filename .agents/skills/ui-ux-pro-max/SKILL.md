---
name: ui-ux-pro-max
description: AI-powered design intelligence toolkit. Searchable databases of UI styles, color palettes, font pairings, chart types, and UX best practices. Use when picking styles, palettes, typography, charts, or landing-page structure.
---

# UI/UX Pro Max (Antigravity Kit)

Imported draft of https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

This is a draft skill bundle. The upstream skill ships a Python CLI
(`src/ui-ux-pro-max/scripts/search.py`) plus CSV databases for:

- product types (SaaS, e-commerce, portfolio, ...)
- UI styles (glassmorphism, brutalism, minimalism, ...)
- typography pairings (with Google Fonts imports)
- color palettes by product type
- landing page structures and CTA strategies
- chart types and library recommendations
- UX best practices and anti-patterns

## Usage (after install)

```bash
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --domain <product|style|typography|color|landing|chart|ux>
python3 src/ui-ux-pro-max/scripts/search.py "<query>" --stack <react|nextjs|shadcn|...>
```

## Installing the full kit

The full data + scripts are not vendored here. To activate:

1. `npx uipro-cli init` in the project root, OR
2. Clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill and copy
   `src/ui-ux-pro-max/{data,scripts,templates}` into the project.

Then apply this draft from Settings → Skills.
