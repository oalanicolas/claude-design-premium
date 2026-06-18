# visual-originality-audit.skill.md

## Name

Visual Originality Audit

## Purpose

Catch generic template reflexes before polish makes them harder to remove. This skill checks
whether the interface has a defensible visual point of view that follows the brief, instead of
defaulting to familiar SaaS, portfolio, dashboard, or landing-page templates.

## When to use

- After `design-system-guardian` and before `ui-audit` on new visual directions.
- Before polish on any design that feels safe, bland, overly templated, or category-obvious.
- When the user asks for premium, distinctive, editorial, expressive, bold, restrained, or original
  output.
- When adapting a reference design and the result risks becoming a copy or a generic remix.

## Procedure

1. **State the intended point of view**: In one sentence, say what should make this design feel like
   this product, not just this category.
2. **Run the category reflex test**: Ask whether the palette, layout, typography, and hero structure
   could have been guessed from the category alone. If yes, mark it as a blocker.
3. **Run the anti-reference test**: Check whether the design only avoids the obvious cliché but falls
   into a second cliché instead.
4. **Inspect repeated scaffold patterns**: Look for default hero + stats blocks, endless equal card grids,
   decorative gradient text, generic glass panels, overused tiny uppercase labels, arbitrary blobs,
   shallow dashboard chrome, or decorative motion with no job.
   **First:** execute `scripts/detect-canvas-antipatterns.mjs` logic on the target `*.dc.html` paths
   (read the script, apply its checks in the canvas). Treat findings as evidence, not as a full
   originality judgment. See [`docs/script-pipeline.md`](../docs/script-pipeline.md).
5. **Check brand/product fit**:
   - Brand surfaces may be more expressive, image-led, atmospheric, or editorial.
   - Product surfaces must stay operational, dense enough, calm enough, and easy to scan repeatedly.
   - System surfaces must prove repeatability through tokens, components, and states.
6. **Preserve useful clarity**: Do not make the UI weird just to be different. Originality must
   improve recognition, trust, hierarchy, or memorability.
7. **Recommend targeted changes**: Replace generic patterns with specific moves tied to the brief,
   tokens, content, audience, or product behavior.

## Output contract

Produce:

- Originality verdict: `distinctive`, `acceptable but safe`, or `generic/blocking`.
- The intended point of view.
- Category reflexes found.
- Second-order clichés found.
- Specific changes to make the design more ownable.
- One thing that should stay restrained to protect usability.

Do not rewrite the whole design unless the user explicitly asks for a redesign.

## Failure modes

- **Novelty for its own sake:** Making a design strange without improving the product. -> Tie every
  change to the brief or user task.
- **Taste-only critique:** Saying it feels generic without naming the pattern. -> Identify the exact
  reflex and replacement.
- **Copying references:** Treating a reference as a finished style to clone. -> Translate principles,
  not surface decoration.
- **Ignoring register:** Judging a dashboard like a campaign page, or a brand site like an admin UI.
  -> Apply the correct surface register.

## Example invocation

```text
Run visual-originality-audit on this landing page. Identify any generic template reflexes, propose
targeted replacements, and preserve anything that is already clear and useful.
```
