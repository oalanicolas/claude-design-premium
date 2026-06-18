# Static Canvas Starter

These files are designed for Claude Design Web's static preview environment. They do not require a
dev server, bundler, git, or package install.

Use this folder when Claude Design needs to scaffold a new project before any Astro, Vite, or Next
handoff.

## Files

| File | Purpose |
|---|---|
| `styles.css` | Static CSS facade. |
| `tokens.css` | Static token source for the canvas. |
| `assets/config/site.js` | Data-only site configuration. |
| `assets/js/boot.js` | Small browser boot script for shared chrome/data. |
| `templates/page-base.html` | Basic page shell. |
| `templates/landing.html` | Landing page shell. |
| `templates/deck.html` | Deck/presentation shell. |
| `global-script-example/` | Optional self-contained global script pattern using `window.X`. |
| `react-example/` | Optional React/JSX pattern using UMD scripts + Babel standalone. |

## Rule

Keep these files static. Framework migration happens later through `docs/framework-handoff.md`.
`tokens.css` is the canonical CSS custom-property token source for the canvas. The canvas cannot
import JSON into CSS; `design-tokens.json` is generated outside the canvas for documentation and
handoff.

Use React only through `react-example/` when real stateful interaction is needed. Do not use
`import`, `export`, `type="module"`, npm packages, or bundler-dependent output in the canvas.

Use `global-script-example/` when you need the allowed global-script shape: one self-contained file
loaded with `<script src>` and exposing API on `window`. The canvas can load that file, but it cannot
run the bundler that created it.
