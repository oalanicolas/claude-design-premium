# Example: SaaS Dashboard

A reproducible example of using the Claude Design Premium Protocol to generate a SaaS dashboard.

## Setup

Loaded into Claude Design Web project context: `CLAUDE.md`, `DESIGN.md`,
`starter-kit/static/tokens.css` as the active greenfield token CSS, and all files in `skills/`. Use
`activation-prompt.md` only as fallback if the `CDP-CLAUDE-OK` canary fails.

## Prompt

```text
Create a premium SaaS dashboard for a fintech analytics product. Include a top nav, a KPI summary row,
and one primary data table with empty, loading, and error states. Anchor everything in DESIGN.md and
the active token CSS custom properties. Use Claude Design Premium and report which skills were
applied.
```

## Expected behavior

- `design-system-guardian` checks tokens and component consistency.
- `visual-originality-audit` checks that the dashboard does not become generic SaaS chrome.
- `ui-audit` checks information density, hierarchy, and the designed states.
- `mobile-first-audit` and `accessibility-audit` are recommended before marking anything final.
- The response ends with the `SKILLS APPLIED / NOT APPLIED / NEXT RECOMMENDED` block.

See [`reporting-block.md`](reporting-block.md) and [`screenshots/`](screenshots/).
