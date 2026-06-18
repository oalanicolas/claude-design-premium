# Framework Handoff

Claude Design Premium starts in Claude Design Web. Framework work comes later, after the visual
direction is approved and the design has been broken into reusable pieces.

Inside Claude Design Web, keep the working artifact static: HTML, CSS, and browser JS. Do not rely on
`vite dev`, `next dev`, `astro dev`, package installs, or framework build behavior in the canvas.
`starter-kit/index.js` and repo-style JSX component modules are handoff assets for a real repo, not
canvas runtime files. Canvas React prototypes must use the separate UMD+Babel pattern in
`starter-kit/static/react-example/`.

## Default Targets

Use the target that matches the product surface:

| Target | Best for | Notes |
|---|---|---|
| Astro | Marketing sites, editorial pages, docs, mostly static content | Keep interactive islands small and deliberate. |
| Vite | App prototypes, dashboards, logged-in tools, rich interaction | Fastest path for interactive UI iteration. |
| Next | SSR, SEO-heavy React apps, existing Next teams | Use only when the project really needs its routing/rendering model. |

## Handoff Shape

Ask Claude Design Web to extract the approved design into these pieces before moving to a framework:

```text
Extract this design into a reusable implementation plan.
Use the starter-kit names where possible:
- layouts: AppShell, MarketingLayout
- navigation: MarketingNav, AppNav
- primitives: Button, Card, SectionHeader
- patterns: Hero, DashboardFrame
- tokens: colors, spacing, typography, radius, motion
Keep framework-specific assumptions out of the first pass.
Report which skills were applied.
```

## Recommended Sequence

1. Approve the visual direction in Claude Design Web.
2. Run `design-system-guardian`, `mobile-first-audit`, and `accessibility-audit`.
3. Ask for a component/pattern inventory.
4. Pick Astro, Vite, or Next.
5. Map the inventory to the framework using `starter-kit/adapters/`.

The starter kit is intentionally framework-light. It should make handoff easier without locking the
design system to one implementation stack too early.
