# Canvas Core

This repository has two layers:

1. **Canvas core**: files that should be available to Claude Design Web during design work.
2. **Distribution / handoff layer**: files that make the repository useful on GitHub or in an
   external Astro/Vite/Next implementation, but should not be loaded into every canvas session.

Keeping this split explicit prevents context pressure from turning the protocol into noise.

## Load This In Claude Design Web

Use this set for a serious Claude Design project:

- `CLAUDE.md`
- `DESIGN.md` created from `DESIGN.md.example`
- `styles.css` at the project root
- `starter-kit/static/tokens.css`
- `design-tokens.json` generated/reference artifact when needed for handoff
- `templates/page-base/index.html`, `templates/landing/index.html`, or `templates/deck/index.html`
  when native Claude Design templates should appear in the template picker
- `components/Botao.jsx` + `components/Botao.d.ts` + `components/Botao.html` when proving the
  native component contract and `@dsCard` sidecar specimen
- `skills/brief-framing.skill.md`
- `skills/design-system-guardian.skill.md`
- `skills/visual-originality-audit.skill.md`
- `skills/text-integrity-audit.skill.md`
- `skills/ui-audit.skill.md`
- `skills/polish-phase.skill.md`
- `skills/mobile-first-audit.skill.md`
- `skills/accessibility-audit.skill.md`

For a brownfield Claude Design export, start from the existing export shape instead:

- `CLAUDE.md` or `SKILL.md` if present
- `README.md` / `DESIGN.md` if present
- `_ds_manifest.json` for `globalCssPaths`, cards, tokens, fonts, and themes
- existing token CSS, commonly `colors_and_type.css`
- `preview/*.html` `@dsCard` specimens
- relevant `ui_kits/<name>/` folders

Use `starter-kit/static/` when the project needs real canvas-safe scaffold files:

- `starter-kit/static/styles.css`
- `starter-kit/static/assets/config/site.js`
- `starter-kit/static/assets/js/boot.js`
- `starter-kit/static/global-script-example/` when a self-contained `window.X` script pattern is needed
- `starter-kit/static/react-example/` only when stateful React/JSX is justified

Prefer the root `templates/<slug>/index.html` native template track when the goal is to prove or
consume a Claude Design design system. Keep `starter-kit/static/templates/*.html` only as portable
static fallback examples.

For legacy Claude Design exports, do not promote `styles.css` to the token source by default. The
existing CSS graph, often `colors_and_type.css`, is the source until the user explicitly asks for a
migration facade. See [`legacy-claude-design-exports.md`](legacy-claude-design-exports.md) before
reorganizing those projects.

Use `CLAUDE-DESIGN-SEED.md` only for first-turn bootstrap in an empty canvas. It is not a visual
reference and does not need to remain prominent after `CLAUDE.md` exists.

## Keep Out Of Default Canvas Context

These files are useful, but they are not part of the normal canvas working set:

- `README.md`, `README.pt-BR.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE`
- `.github/`
- `examples/`
- most of `docs/`, except the specific doc being discussed
- `scripts/` local validation helpers
- `starter-kit/components/`, `starter-kit/patterns/`, `starter-kit/adapters/`, `starter-kit/index.js`
- `skills/tailwind-audit.skill.md` unless reviewing external implementation code
- `skills/framework-handoff.skill.md` unless the canvas direction is approved and ready to package

The files above are for documentation, publishing, repo maintenance, or later implementation. Loading
all of them into Claude Design Web makes the model less selective.

## Practical Rule

For exploration and iteration, keep context narrow:

```text
CLAUDE.md + DESIGN.md + active token CSS
+ native template/component files only when needed
+ design-system-guardian
+ one relevant audit skill
```

For final approval, add:

```text
polish-phase + mobile-first-audit + accessibility-audit
```

For handoff, add:

```text
framework-handoff + starter-kit/README.md
```

For external code review, add:

```text
tailwind-audit
```
