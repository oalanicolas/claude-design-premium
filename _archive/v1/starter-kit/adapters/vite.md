# Vite Adapter

Use Vite when the approved Claude Design output is an app prototype, dashboard, internal tool, or
logged-in experience with rich client-side interaction.

## Mapping

- `AppShell.jsx` -> top-level route shell.
- `DashboardFrame.jsx` -> dashboard page pattern.
- `Button.jsx`, `Card.jsx`, `SectionHeader.jsx` -> shared React primitives.
- `static/tokens.css` -> import once in `src/main.jsx` or `src/index.css` (provides the `--cds-*` variables the components use).

## Prompt

```text
Convert this approved Claude Design direction into a Vite React module plan.
Use AppShell for the logged-in structure and keep dashboard sections as reusable patterns.
Preserve the starter-kit component names and token names.
```
