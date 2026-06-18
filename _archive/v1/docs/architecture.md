# Architecture

Claude Design Premium is built around one practical observation:

```text
Claude Design Web has native design-system rails,
and a project can layer CLAUDE.md routing on top of them.
```

This repository turns that behavior into a starter architecture.

## Runtime Assumption

Claude Design Web is treated as a static authoring canvas:

- no git operations;
- no package install;
- no Vite, Next, Astro, or other dev server;
- no framework build step inside the canvas.

The canvas output should work as direct HTML/CSS/JS first. Astro, Vite, and Next are handoff targets
after the design direction and component inventory are approved.

## Bootstrap Flow

```text
CLAUDE.md
  -> lightweight protocol loaded from the project root/context
  -> points to DESIGN.md and the active token CSS
  -> treats skills/*.skill.md as document-backed procedures, not installed native Skills
  -> classifies the surface before visual work when context is incomplete
  -> routes only the relevant procedures
  -> requires SKILLS APPLIED / NOT APPLIED / NEXT RECOMMENDED at delivery/audit checkpoints
```

Claude Design has a fixed native product-skill set. The `.skill.md` files here are not added to that
set. They are small, focused procedure documents that Claude can read and apply when `CLAUDE.md`
tells it to. This keeps the context selective while giving the project a repeatable operating layer.

## Empty Canvas Bootstrap

When a new Claude Design Web project starts empty, you may not be able to upload or start from a whole
folder. Use `CLAUDE-DESIGN-SEED.md` as the first attached document and instruct Claude to create the
root `CLAUDE.md` before any visual work.

The seed is not a visual reference. It is a first-turn bootstrap directive that says:

```text
Do not design from this page.
Create the project governance and static scaffold first.
Ask opening questions before inventing brand content.
```

If Claude can read an existing starter folder, use cross-project replication for code fidelity:
replicate the real files from the source project and use the seed only for governance and assembly
order.

## Why This Shape

- `CLAUDE.md` stays short because it is the bootstrap.
- `DESIGN.md` carries taste, brand rules, component philosophy, and prohibitions.
- In greenfield starter projects, `starter-kit/static/tokens.css` is the initial value source for
  colors, spacing, typography, radius, elevation, and motion in static canvas pages.
- In brownfield Claude Design exports, preserve the existing CSS graph from `_ds_manifest.json`
  (`colors_and_type.css`, `foundations.css`, or equivalent) instead of forcing the starter filename.
- `design-tokens.json` is generated from the active token CSS for documentation and later handoff.
- `templates/<slug>/index.html` uses the native Claude Design template track.
- `components/*.jsx` + `components/*.d.ts` demonstrate the native component contract.
- `components/<Name>.html` demonstrates `@dsCard` sidecar specimen cards.
- `skills/*.skill.md` holds repeatable checks: brief framing, system adherence, originality, UI audit,
  polish, mobile, accessibility, and code review.
- `starter-kit/static/` gives Claude a canvas-safe scaffold.
- `starter-kit/` gives Claude a modular vocabulary for later Astro, Vite, or Next implementation.

For the exact split between canvas context and repo distribution/handoff files, see
[`canvas-core.md`](canvas-core.md). For the native-hook de-para, see
[`native-claude-design-alignment.md`](native-claude-design-alignment.md).

## Validation

Validate live behavior per project with `docs/validation-method.md`. The most important proof is the
native `check_design_system` result inside Claude Design. `CDP-CLAUDE-OK` remains available as a
setup diagnostic, but it should not pollute every normal first response.

If root routing fails, use `activation-prompt.md` as a manual fallback and keep the next task narrow.
