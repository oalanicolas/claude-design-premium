# Starter Kit

This folder gives Claude Design Web a modular vocabulary for designs that should later become Astro,
Vite, or Next implementations.

Use it after the visual direction is approved, or include it from the start when you want Claude to
think in reusable pieces.

## Contents

| Path | Purpose |
|---|---|
| `static/` | Canvas-safe HTML/CSS/JS scaffold for Claude Design Web. |
| `static/global-script-example/` | Optional self-contained `window.X` script pattern, no ESM. |
| `static/react-example/` | Optional React/JSX escape hatch using UMD React + Babel, no build step. |
| `static/tokens.css` | Canonical CSS custom-property token source (`--cds-*`) for the canvas. |
| `components/Button.jsx` | Primary, secondary, ghost, link, and icon buttons. |
| `components/Card.jsx` | Surface, header, content, and footer primitives. |
| `components/SectionHeader.jsx` | Reusable section title with eyebrow and action. |
| `components/MarketingLayout.jsx` | Landing-page layout wrapper. |
| `components/MarketingNav.jsx` | Landing-page/topbar navigation pattern. |
| `components/AppShell.jsx` | Logged-in app shell with sidebar and topbar slots. |
| `patterns/Hero.jsx` | Marketing hero pattern. |
| `patterns/DashboardFrame.jsx` | Dashboard/KPI/table layout pattern. |
| `adapters/*.md` | Notes for moving the same system to Astro, Vite, or Next. |

## Canvas vs Handoff

Use `static/` inside Claude Design Web. Do not use `index.js`, ESM imports/exports, npm packages, or
bundler-dependent modules in the canvas. Self-contained UMD/IIFE globals may be loaded by
`<script src>` if they expose API on `window` and were built outside the canvas.

React/JSX can run in the canvas only through the `static/react-example/` pattern: fixed UMD scripts,
Babel standalone, `type="text/babel"`, and components exposed on `window`. Keep vanilla JS as the
default.

Use `index.js`, `components/`, and `patterns/` only after handoff to a real repo with Astro, Vite, or
Next.

## Claude Design Prompt

```text
Use starter-kit as the modular vocabulary for this design.
Name reusable pieces after the starter-kit files where possible:
Button, Card, SectionHeader, MarketingNav, AppShell, Hero, DashboardFrame.
Keep framework-specific assumptions out of the first design pass.
Report which skills were applied.
```

For an empty Claude Design Web canvas, start with `static/` and the seed flow:

```text
Use CLAUDE-DESIGN-SEED.md first.
Create root CLAUDE.md and the static scaffold before generating the visual design.
Keep the preview as plain HTML/CSS/browser JS.
```

## Design Rules

- Start from `DESIGN.md` and `static/tokens.css`; `design-tokens.json` is generated later for
  documentation and framework handoff.
- When token values change, edit `static/tokens.css` first, then regenerate
  `design-tokens.json.example` outside the canvas with `node scripts/generate-design-tokens.mjs --write`.
- Keep `static/` free of framework-only imports, package assumptions, and dev-server requirements.
- Use `static/global-script-example/` when the canvas needs a prebuilt global browser script pattern.
- Use `static/react-example/` only when the canvas prototype needs stateful React interaction.
- Prefer semantic components over one-off sections.
- Extract navigation, shell, cards, hero, and dashboard frames before handoff.
- Keep Astro/Vite/Next differences in adapters, not in the design vocabulary.
