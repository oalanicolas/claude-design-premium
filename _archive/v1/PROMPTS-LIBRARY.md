# Prompts Library

Copy-paste prompts that work well with the Claude Design Premium Protocol. They assume root
`CLAUDE.md`, `DESIGN.md`, an active token CSS file, and your `skills/` are available in Claude
Design Web.
If the root bootstrap did not load, use `activation-prompt.md` first.

Most prompts ask Claude to report the `SKILLS APPLIED / NOT APPLIED / NEXT RECOMMENDED` block, so you
can see what was actually applied. For fine one-line tweaks, keep the response lighter. Replace
anything in `[brackets]`.

## Bootstrap an empty Claude Design Web canvas

Use this when you cannot start from a folder and are attaching `CLAUDE-DESIGN-SEED.md` in the first
message:

```text
Use CLAUDE-DESIGN-SEED.md.
Create the root CLAUDE.md first, then scaffold the static design-system structure.
Include the CDP-CLAUDE-OK canary in the new CLAUDE.md.
Treat starter-kit/static/tokens.css as the canvas token source for this new greenfield project.
Do not generate the visual design yet.
After the structure exists, ask the opening questions.
```

If Claude can read this starter project as a source folder, add:

```text
Read the referenced source project as the source starter.
Replicate its real files where possible instead of recreating code from memory.
Use the seed only for governance and assembly order.
```

## Frame the brief before design

```text
Run brief-framing before generating UI.
Classify the surface as brand, product, or system.
List the audience, primary job-to-be-done, references to obey or avoid, and blocking gaps.
Ask only the questions that materially change the design.
```

## Generate a new screen

```text
Create a premium [screen type] for [product, audience]. Anchor every decision in DESIGN.md and the
tokens. Before generating, list which color, spacing, and typography tokens you will use. Generate the
main view only: I will refine before asking for more. Report which skills were applied.
```

## Check originality before polish

```text
Run visual-originality-audit on this direction.
Identify generic template reflexes, category clichés, and second-order clichés.
Recommend targeted changes that make the design more ownable without hurting usability.
```

## Apply / check the design system (anti-drift)

```text
Use my design system in everything. Before generating, identify the active token CSS, then list which
tokens and components from that CSS and DESIGN.md you will apply on this screen. If something is not
covered, ask instead of inventing it. Report which skills were applied.
```

## UI audit (no redesign)

```text
Run ui-audit on the previous output. Report what works, the specific issues with locations, and fixes
tied to the tokens. Do not redesign the screen.
```

## Polish pass (small changes only)

```text
Run polish-phase on the approved screen. Refine microcopy, alignment, button hierarchy, and add subtle
motion using the motion tokens. Keep the structure identical and list exactly what you changed.
```

## Text integrity review

```text
Run text-integrity-audit on this text. Identify generic wording, weak voice, overclaiming, repeated
sentence shapes, recap reflexes, and banned typography. Return the revised text and list the issues
you fixed.
```

## Fine refinement (do not regenerate)

```text
Targeted tweaks only, do not rebuild the screen: [e.g. raise CTA contrast, tighten hero spacing, swap
the heading weight]. Keep everything else identical.
```

## Mobile-first review

```text
Run mobile-first-audit across 320px, 375px, 430px, 768px, 1024px, and 1440px. Report overflow,
tap-target, and stacking issues, then state pass or blockers.
```

## Accessibility review

```text
Run accessibility-audit on this screen. Cover contrast, semantics, keyboard, focus, forms, motion, and
screen-reader clarity. List blockers with fixes and include the no-WCAG-claim disclaimer.
```

## Code implementation review (outside the canvas)

```text
Here is the implementation. Run design-system-guardian then tailwind-audit, mobile-first-audit, and
accessibility-audit. List token violations and arbitrary values with line numbers and corrected
classes. Do not rewrite the whole file.
```

## Final approval gate

```text
I want to mark this screen as final. Apply the final-approval routing: design-system-guardian,
polish-phase, mobile-first-audit, accessibility-audit. Do not declare it final until mobile and
accessibility checks have run. Report the result.
```

## Tip

For fine adjustments (one color, one spacing value, one label), prefer the "fine refinement" prompt or
direct edits over regenerating the whole screen: regeneration is the expensive path and the one most
likely to drift from the design system.
