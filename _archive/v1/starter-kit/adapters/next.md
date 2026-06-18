# Next Adapter

Use Next only when the project needs SSR, SEO-heavy React routes, existing Next conventions, or a
team-standard deployment path.

## Mapping

- `MarketingNav.jsx` and `Hero.jsx` -> server components when static.
- Interactive controls -> client components with explicit `"use client"`.
- `AppShell.jsx` -> app router layout when the shell applies across a route group.
- `static/tokens.css` -> import from the root layout (provides the `--cds-*` variables the components use).

## Prompt

```text
Convert this approved Claude Design direction into a Next app-router plan.
Separate static server components from interactive client components.
Preserve the starter-kit component names and token names.
Do not introduce SSR-specific complexity unless it serves the product.
```
