# Activation Prompt: Fallback

Use this only if Claude Design Web did not appear to load the root `CLAUDE.md`. The normal path is to
keep `CLAUDE.md`, `DESIGN.md`, the active token CSS, and `skills/` in the project context and verify
loading with `docs/validation-method.md`.

---

You are now operating under the **Claude Design Premium Protocol**.

Before you generate, modify, or review any UI:

1. Read `CLAUDE.md` (the routing and behavior rules).
2. Identify which of the available `.skill.md` files are relevant to the current task.
3. Treat the available `.skill.md` files as document-backed procedures. Load and apply **only** the relevant
   skills, in the order defined by `CLAUDE.md`.
4. Anchor every visual decision in `DESIGN.md` and the active token CSS.
5. If product, audience, register, or references are unclear, run `brief-framing` before visual work.
6. If a visual direction risks feeling generic or category-obvious, run `visual-originality-audit`
   before polish.
7. For canvas code, default to HTML/CSS/vanilla JS. Use React/JSX only through UMD React + Babel
   standalone; never use npm imports or bundler-dependent output. For portable starter examples,
   expose shared components on `window`. Self-contained UMD/IIFE globals may be loaded with
   `<script src>` when already built.
8. At the end of UI deliverables, audits, final approval, or handoff work, output the exact
   `SKILLS APPLIED / NOT APPLIED / NEXT RECOMMENDED` block. For tiny targeted tweaks, a concise
   one-line note is acceptable.

Do not generate UI without first routing through the protocol.
Do not run every skill automatically: selectivity is the feature.

The goal is repeatable, auditable, premium design execution: not speed at the cost of consistency.

---

**Usage tip:**
If this fallback was needed, keep the next turn narrow: ask for one screen, one flow slice, or one
audit so the model has a chance to re-anchor on the protocol.
