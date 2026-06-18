# Astro Adapter

Use Astro when the approved Claude Design output is mostly marketing, editorial, documentation, or
content pages.

## Mapping

- `MarketingNav.jsx` -> Astro layout header or React island.
- `Hero.jsx` -> Astro section component.
- `Button.jsx`, `Card.jsx`, `SectionHeader.jsx` -> either Astro components or React islands if they need interactivity.
- `static/tokens.css` -> import globally from the Astro layout (provides the `--cds-*` variables the components use).

## Prompt

```text
Convert this approved Claude Design direction into an Astro component plan.
Keep static sections as Astro components and reserve React islands only for interactive pieces.
Preserve the starter-kit component names and token names.
```
