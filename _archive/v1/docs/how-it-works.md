# How It Works: The Mechanism

This document explains the actual mechanism behind the protocol so you can use it effectively in
Claude Design Web and debug when it does not behave as expected.

## Core Idea

Large language models are highly sensitive to **what is in context** and **how instructions are structured**. Claude Design Web has native design-system hooks and a fixed native skill set, so the protocol uses document-backed routing only for project-specific procedures:

1. Put a small, high-signal bootstrap file at the project root (`CLAUDE.md`).
2. Make a curated set of documental procedures (`skills/*.skill.md`) available.
3. Use literal trigger -> READ rules so the model knows exactly which files to load for each task.
4. Require a transparent report at delivery, audit, final approval, and handoff checkpoints.

## Why Selectivity Matters

If you load every skill on every task, two bad things happen:

- Context becomes noisy -> the model starts ignoring instructions.
- The model treats all skills as equally important -> important constraints get diluted.

By making routing **selective**, we keep signal high and make application deliberate.

## The Reporting Block

The `SKILLS APPLIED / NOT APPLIED / NEXT RECOMMENDED` block is not decorative. Use it at delivery,
audit, final approval, and handoff checkpoints. It serves three purposes:

1. **Transparency**: You can see exactly what the model decided to apply.
2. **Accountability**: It makes it obvious when the model skipped something important.
3. **Continuous improvement**: The `NEXT RECOMMENDED` often surfaces missing skills or weak areas in your current setup.

## Relationship with Claude Design Web

Claude Design Web has its own product behavior and does not install new project Skills from this
starter. The observed working pattern is:

- `CLAUDE.md` lives at the root of the project context.
- It points Claude to `DESIGN.md`, the active token CSS, and `skills/*.skill.md`.
- The `.skill.md` files behave like procedural modules: not installed native Skills, but available for
  Claude to read, apply, and report.
- Native design-system hooks handle templates, specimen cards, components, token extraction, and live
  `check_design_system` validation.

The canvas is treated as a static authoring surface. The starter should generate or replicate direct
HTML/CSS/browser JS first, then hand off to Astro, Vite, or Next later from a real repo.
For greenfield projects created from this starter, `starter-kit/static/tokens.css` is the canvas token
source Claude can actually consume. For brownfield Claude Design exports, preserve the existing CSS
token source, commonly `colors_and_type.css`, and verify it against `_ds_manifest.json.globalCssPaths`.
`design-tokens.json` is generated/reference material for documentation and later framework handoff.

When a whole starter folder cannot be uploaded into a new canvas, `CLAUDE-DESIGN-SEED.md` gives the
first-turn assembly order: write root `CLAUDE.md`, scaffold static files, ask opening questions, then
design. If a source folder is readable, cross-project replication should copy the real files instead
of recreating them from memory.

Two skills keep this from becoming a generic template factory:

- `brief-framing` runs before visual invention when product, audience, surface, or references are
  underspecified.
- `visual-originality-audit` checks whether the result has a defensible point of view instead of
  merely avoiding token violations.
- `text-integrity-audit` checks whether UI copy, docs, prompts, and public text have a real job,
  project voice, and clean syntax instead of generic generated wording.

Use `docs/validation-method.md` for proof. The canary is only a root-loading diagnostic; the stronger
proof is `check_design_system` plus native templates/components resolving.

## Why "Enforce" Is Procedural

When this repo uses words like "enforce", it means procedural pressure: explicit context, selective
procedures, and reporting. It does not mean deterministic runtime policy enforcement.

Being honest about the mechanism (see `LIMITATIONS.md`) while still aiming for high standards is what makes the pattern credible over time.
