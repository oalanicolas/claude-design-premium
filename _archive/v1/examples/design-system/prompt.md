# Example: Design System

A reproducible example of using the Claude Design Premium Protocol to establish and apply a design
system across screens.

## Setup

Loaded into Claude Design Web project context: `CLAUDE.md`, `DESIGN.md`,
`starter-kit/static/tokens.css` as the active greenfield token CSS, and all files in `skills/`. Use
`activation-prompt.md` only as fallback if the `CDP-CLAUDE-OK` canary fails.

## Prompt

```text
Using DESIGN.md and the active token CSS, generate a small static component set (buttons, inputs,
cards) that demonstrates the system. Before generating, list the exact tokens each component uses.
Flag anything DESIGN.md does not cover instead of inventing it. Report which skills were applied.
```

## Expected behavior

- `design-system-guardian` leads and maps each component to specific tokens.
- It flags gaps in `DESIGN.md`/active token CSS rather than inventing values.
- Static CSS uses custom properties from the active token CSS.
- `visual-originality-audit` checks that the specimen does not become a generic component gallery.
- `ui-audit` checks consistency across the component set.
- The response ends with the `SKILLS APPLIED / NOT APPLIED / NEXT RECOMMENDED` block.

See [`reporting-block.md`](reporting-block.md) and [`screenshots/`](screenshots/).
