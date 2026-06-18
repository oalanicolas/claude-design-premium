# PROJECT BRIEF: claude-design-premium

## Current Decision

`claude-design-premium` is a starter kit for **Claude Design Web**.

Claude Design Web has a fixed native Skill set, but the workflow can use a root `CLAUDE.md` as a
bootstrap file. That file references `DESIGN.md`, the active token CSS, and `skills/*.skill.md`, so
Claude can apply repeatable document-backed procedures.

## Product Thesis

```text
Claude Design Web does not install Skills.
It can load CLAUDE.md.
CLAUDE.md can route document-backed procedures.
Therefore a project can have a portable design operating layer.
```

## Required Architecture

```text
CLAUDE.md
  -> bootstrap and routing rules
DESIGN.md
  -> visual identity, brand rules, component philosophy, prohibitions
starter-kit/static/tokens.css
  -> greenfield token source for colors, spacing, typography, radius, elevation, motion in the canvas
styles.css
  -> greenfield CSS facade consumed by the native design-system compiler
design-tokens.json
  -> generated/reference token artifact for documentation and handoff
skills/*.skill.md
  -> document-backed procedures: brief framing, system enforcement, originality, audits, polish, handoff
CLAUDE-DESIGN-SEED.md
  -> first-message bootstrap for empty Claude Design Web canvases
starter-kit/
  -> modular vocabulary for later Astro, Vite, or Next implementation
starter-kit/static/
  -> canvas-safe HTML/CSS/JS scaffold and CSS token source
examples/
  -> prompts, reporting blocks, screenshots or explicit TODO placeholders
```

## Non-Negotiables

1. Public positioning is Claude Design Web first.
2. The central file is `CLAUDE.md`, exactly uppercase.
3. Do not use `CLAUDE-ROUTER.md` as a public artifact.
4. Do not present the `.skill.md` files as installed native Skills.
5. `activation-prompt.md` is fallback only.
6. Claims must remain procedural and reviewable, not deterministic.
7. Real visual claims require artifacts; otherwise use explicit TODO placeholders.
8. Claude Design Web canvas work is static: no git, npm, dev server, framework build, lint, or tests.
9. `CLAUDE-DESIGN-SEED.md` must tell Claude not to design from the seed page itself.
10. New or unclear projects must run brief framing before visual invention.
11. Final visual work must check for generic category templates, not only token compliance.
12. Routing must use literal trigger -> READ rules, not vague "apply skills" language.
13. `CDP-CLAUDE-OK` is the concrete root-load canary.
14. `starter-kit/static/tokens.css` is the greenfield canvas token source for starter
    projects; brownfield Claude Design exports keep their existing CSS token source, commonly
    `colors_and_type.css`. `design-tokens.json` is generated from the active CSS source outside the
    canvas.
15. `starter-kit/index.js` and repo-style JSX component imports are handoff assets, not canvas runtime
    assets.
16. In-browser React/JSX is allowed only through UMD React + Babel standalone + `window` globals.
17. Self-contained UMD/IIFE global scripts may run in the canvas, but only as prebuilt browser
    scripts loaded by `<script src>`; the canvas does not build them.
18. Framework handoff is secondary and should stay modular: Astro for content/marketing, Vite for
   interactive apps, Next only when the project requires it.
19. `docs/canvas-core.md` defines the lean default canvas context; repo docs, scripts, examples,
    GitHub metadata, and framework components are not loaded into every session.
20. Full `SKILLS APPLIED` reporting is required for deliverables/audits/final/handoff, but tiny
    targeted tweaks may use a concise note to reduce context pressure.

## Definition of Done

- `CLAUDE.md` explains bootstrap + document-backed procedures.
- `CLAUDE.md` includes the `CDP-CLAUDE-OK` canary and literal trigger table.
- Skill inventory includes context framing and visual originality checks.
- Setup docs validate root loading with a canary.
- README and Playbook are Claude Design Web focused.
- Starter kit includes shell, nav, primitive components, and reusable page patterns.
- Starter kit includes a static canvas scaffold for empty Claude Design Web starts.
- Static canvas tokens exist as CSS custom properties in the active token CSS.
- Seed workflow explains how to bootstrap when a whole folder cannot be uploaded.
- Docs explain how to carry the output into Astro, Vite, or Next without locking the design phase to a
  framework too early.

The previous Claude Code-oriented build brief is archived in `docs/archive/`.
