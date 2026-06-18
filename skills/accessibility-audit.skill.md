# accessibility-audit.skill.md

## Name

Accessibility Audit

## Purpose

Review semantics, contrast, keyboard access, focus, forms, motion, and screen-reader clarity so
accessibility is treated as a baseline gate: while being explicit that this is a review, not a
compliance certification.

## When to use

- Before any screen or component is considered ready for final handoff.
- After mobile-first audit.
- When reviewing forms, interactive elements, or complex layouts.

## Procedure

1. **Contrast**: Text meets a minimum 4.5:1 ratio; non-text UI (icons, borders, focus indicators)
   meets 3:1.
2. **Semantic structure**: Proper heading hierarchy (`h1` -> `h2` ...); landmarks (`main`, `nav`,
   `section`) where appropriate; lists used correctly.
3. **Keyboard navigation**: All interactive elements reachable via keyboard; logical tab order;
   visible focus states that meet contrast requirements.
4. **Forms & inputs**: Every input has an associated visible label; errors are clearly associated
   with their field; required fields are indicated; ARIA used only when native semantics fall short.
5. **Motion & cognitive**: Respects `prefers-reduced-motion`; nothing flashes more than 3 times per
   second; complex interactions have clear instructions or can be simplified.
6. **Screen-reader considerations**: Alt text for meaningful images; ARIA labels for icon-only
   buttons or complex widgets; live regions for dynamic updates when applicable.
7. **Document basics**: HTML has `lang`, a meaningful `<title>`, viewport meta for mobile, and
   landmark structure (`main`, `nav`, `header`, `footer`) where appropriate.
8. **Repo-side preflight**: Outside Claude Design Web (plain Node, built-ins only, no npm), when static
   files are available, run `node scripts/detect-canvas-antipatterns.mjs <path>` to catch deterministic accessibility risks
   such as missing `lang`, missing title, images without `alt`, removed outlines, and missing reduced
   motion fallbacks.

## Output contract

Structured audit covering the six areas, specific issues with suggested fixes, and a clear statement:
"Passes baseline accessibility audit" or "Blockers remaining: [list]".

**Mandatory disclaimer:** Do not claim WCAG compliance without real implementation testing. This is a
design + code review. Real compliance requires manual testing with keyboard, screen readers, and
actual users.

## Failure modes

- **Superficial checks:** Only checking contrast. -> Cover all six areas.
- **Over-promising compliance:** Saying "this is accessible" without the disclaimer. -> Always include it.
- **Ignoring focus states:** Not checking visible focus indicators. -> Treat focus as first-class.
- **Automation overclaim:** A clean preflight is not accessibility compliance. -> Keep the
  no-certification disclaimer and require manual keyboard/screen-reader testing.

## Example invocation

```text
Run accessibility-audit on this form. Cover all six areas, list blockers with fixes, and include the
no-WCAG-claim disclaimer.
```
