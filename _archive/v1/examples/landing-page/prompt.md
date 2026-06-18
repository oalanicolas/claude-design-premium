# Example: Landing Page

A reproducible example of using the Claude Design Premium Protocol to generate a landing page.

## Setup

Loaded into Claude Design Web project context: `CLAUDE.md`, `DESIGN.md`,
`starter-kit/static/tokens.css` as the active greenfield token CSS, and all files in `skills/`. Use
`activation-prompt.md` only as fallback if the `CDP-CLAUDE-OK` canary fails.

## Prompt

```text
Create a premium landing page hero plus a single CTA section for [Product], a [one-line description]
aimed at [audience]. Anchor every decision in DESIGN.md and the CSS custom properties in
the active token CSS. Before generating, list which color, spacing, and typography tokens you will
use. Generate the hero and CTA only: I will refine before asking for more. Report which skills were
applied.
```

## Expected behavior

- `design-system-guardian` runs first and lists the tokens it will use.
- `visual-originality-audit` checks that the hero is not a generic SaaS/AI landing-page pattern.
- `ui-audit` checks hierarchy and the CTA prominence.
- `polish-phase` runs only after a direction exists.
- The response ends with the `SKILLS APPLIED / NOT APPLIED / NEXT RECOMMENDED` block.

See [`reporting-block.md`](reporting-block.md) for a sample reporting block and
[`screenshots/`](screenshots/) for visual proof.
