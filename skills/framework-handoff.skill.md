# framework-handoff.skill.md

## Name

Framework Handoff

## Purpose

Turn an approved Claude Design Web direction into a reusable component and pattern inventory that can
move cleanly to Astro, Vite, or Next without locking the design phase to a framework too early.

## When to use

- After the visual direction has been approved.
- When the user asks to componentize, modularize, export, or prepare for Astro, Vite, or Next.
- Before handing a design to implementation.
- When repeated navigation, shell, card, hero, dashboard, or section patterns appear in a design.

## Procedure

1. Confirm the visual direction is approved; if not, recommend `ui-audit` or `polish-phase` first.
2. Read `BOUND_DS.json` → `components` and `DESIGN.md` §5-6. Extract a component inventory from the
   bound namespace and any named patterns documented in the project.
3. Map each component to its source tokens: color, spacing, typography, radius, elevation, and motion.
4. Separate framework-neutral anatomy from framework-specific implementation notes.
5. Recommend the target only when the product surface makes it clear:
   Astro for marketing/content, Vite for interactive apps, Next for SSR/team constraints.
6. Preserve accessibility and mobile blockers as handoff notes; do not hide them as "implementation
   details".

## Output contract

Produce a handoff inventory with:

- Components and patterns to extract.
- Props/content slots each component needs.
- Token dependencies.
- Target-framework recommendation with rationale.
- Remaining mobile/accessibility blockers.
- A short next prompt the user can paste into Claude Design Web.

Do not generate a full app unless explicitly asked.

## Failure modes

- **Framework lock-in too early:** Choosing Next/Astro/Vite before the design is approved. -> Keep the
  first pass framework-neutral.
- **One-off page sections:** Treating repeated elements as custom layout each time. -> Extract named
  components and patterns.
- **Token drift during handoff:** Replacing approved tokens with framework defaults. -> Map every
  extracted piece back to the active token CSS and optional generated token JSON.
- **Ignoring blockers:** Pushing mobile or accessibility issues downstream silently. -> List blockers
  explicitly.

## Example invocation

```text
Run framework-handoff on this approved dashboard. Extract reusable pieces using the bound DS
component and pattern names from BOUND_DS.json and DESIGN.md §6, recommend Astro/Vite/Next only if
appropriate, and list token dependencies and remaining blockers.
```