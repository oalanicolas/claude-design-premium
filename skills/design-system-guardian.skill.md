# design-system-guardian.skill.md

## Name

Design System Guardian

## Purpose

Keep every visual and code decision anchored to `DESIGN.md` and the active canvas CSS tokens so
generated UI stays consistent and on-brand instead of drifting into generic default aesthetics. This is
the foundation skill that almost every other skill builds on.

## When to use

- Before generating any new screen, component, or major layout change.
- When modifying existing UI.
- Whenever visual consistency with `DESIGN.md` and the token system is required.
- As the first skill in almost every UI-related workflow.

## Procedure

1. Read `BOUND_DS.json` to resolve the active binding: `root`, `namespace`, `globalCssPaths`,
   `components`, and `bundle`.
2. Load `DESIGN.md` and the bound DS token CSS as non-negotiable constraints. Build by loading
   `BOUND_DS.json` → `bundle` and composing `BOUND_DS.json` → `namespace` components.
3. Treat the bound DS token CSS as the runtime source of truth; there is no JSON token runtime in
   the canvas.
4. For every color decision, use a token from the active token CSS (prefer semantic tokens:
   `primary`, `destructive`, etc.).
5. For every spacing decision, use a value from the spacing scale.
6. For typography, respect the type scale, weights, and line heights defined in tokens.
7. For radius, elevation, and motion, use the defined token values exactly.
8. If static canvas CSS is being written, use CSS custom properties from the active token CSS; do not
   import or reference JSON directly from CSS.
9. If generated token JSON and the active token CSS disagree, treat the CSS as the canvas source of
   truth and flag that the JSON must be regenerated outside Claude Design Web.
10. Check component and brand alignment: does this match how the bound DS defines this component?
11. If a visual decision conflicts with `DESIGN.md` principles (e.g., introducing generic default chrome),
    flag the conflict explicitly before proceeding.
12. Never invent new colors, spacing values, or type sizes.
13. Outside Claude Design Web, maintainers may run dependency-free `scripts/*.mjs` helpers with plain
    Node (built-ins only, no npm packages — see upstream
    [claude-design-premium](https://github.com/oalanicolas/claude-design-premium)). Do not claim the
    canvas ran them.

## Output contract

- Every generated or modified UI element must reference the specific tokens or principles applied.
- Static canvas output must reference CSS custom properties from the active token CSS.
- If you deviate from tokens, state the reason clearly and propose updating the token file instead.

## Failure modes

- **Token invention:** Hard-coded colors or spacing when tokens exist. -> Correct and reference the token.
- **Generic aesthetic drift:** Layouts that feel like generic SaaS screens. -> Re-anchor in `DESIGN.md` §1-2.
- **Reference copying without brand logic:** Cloning a reference visually without applying the brand. -> Re-derive from `DESIGN.md` + bound DS readme.
- **Treating tokens as suggestions:** Using tokens loosely. -> Tokens are constraints, not hints.
- **Token edits in the wrong place:** Editing root `styles.css` (a re-export) or `DESIGN.md`
  (interpretation) to change a value. -> Edit the file under the bound DS token directory; that is the
  only runtime token source in the canvas.
- **Wrong DS binding:** Using a namespace or path from a different project. -> Re-read `BOUND_DS.json`.
- **Unverified local maintenance:** Editing protocol/runtime docs without re-checking references. ->
  Re-read the referenced files and run the `scripts/` linters outside the canvas.
- **Over-application:** Enforcing the whole system in one heavy response. -> Prioritize the 2-3 most critical constraints; note the rest.

## Example invocation

```text
Generate the pricing section. Apply design-system-guardian: list which color, spacing, and
typography tokens you will use before generating, and flag anything not covered by the tokens.
```