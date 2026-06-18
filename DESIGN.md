# DESIGN.md — Bound Design System

<!-- CDP:UNCONFIGURED — harness-auto-setup will replace this file on first session -->

> Active visual constraint for this project. Every screen, component, deck, and document
> must be grounded here. The runtime source of truth for token **values** is the bound
> design system at `BOUND_DS.json` → `root` (re-exported by root `styles.css`). This file is
> the *interpretive* layer: what the tokens mean and how to compose them. When the two
> disagree, the CSS tokens win — flag the mismatch.

Read `BOUND_DS.json` for the machine binding (`namespace`, `components`, `globalCssPaths`).
Read the bound DS readme at `BOUND_DS.json` → `readme` (if present) for brand fundamentals,
voice, and component philosophy specific to this design system.

---

## 1. Design Philosophy

Describe the product's visual register here. Before generating UI, synthesize from:

- The bound DS readme (`BOUND_DS.json` → `readme`)
- User brief and references
- `skills/brief-framing.skill.md` output

Identify which surfaces you are designing:

- **Brand surfaces** — marketing, heroes, campaigns, editorial openers
- **Product surfaces** — app UI, dashboards, workflows, settings
- **System surfaces** — specimens, tokens, documentation, this harness

List explicit **anti-references**: generic SaaS gradients, off-brand patterns, or anything
the bound DS readme forbids.

---

## 2. Core Principles

### Hierarchy & Scanning
How should a screen scan? Which type roles carry meaning vs. data vs. UI chrome?

### Spacing & Rhythm
Base unit, content max-widths, and how sections breathe. Use tokens from the bound DS only.

### Components
Compose **bound DS components** (namespace from `BOUND_DS.json`) — never recreate or
restyle raw markup to look like them. See `BOUND_DS.json` → `components` for inventory.

### Responsiveness
Mobile-first intent; touch targets ≥ 44px. Document shell/nav collapse behavior if relevant.

### Accessibility
Respect contrast rules from the bound DS. Run the accessibility audit before final; never
claim certification.

---

## 3. Visual Language

Ground every decision in the bound DS token CSS (`BOUND_DS.json` → `globalCssPaths`).

### Color
Semantic tokens (`--background`, `--foreground`, `--primary`, `--border`, etc.) and brand rules.
Never invent hexes when tokens exist.

### Typography
Font roles, scale, casing system. Use `var(--font-*)` and size tokens only.

### Elevation & Depth
Shadows, hairlines, borders — per the bound DS. No glows or effects the DS forbids.

### Corner radii
Per token scale. Do not invent radii outside the system.

### Motion
Duration, easing, entrance patterns. Respect `prefers-reduced-motion`.

### Iconography
Follow the bound DS convention. If `BOUND_DS.json` → `iconLibrary.type` is `iconoir`, load the
CDN listed there and use `iconoir-*` classes. Never emoji in product UI unless the DS allows it.

---

## 4. Do / Don't

**Do**
- Compose bound components; load the DS bundle once in `<helmet>` (see `CLAUDE.md` § Building).
- Use `var(--*)` tokens for every visual decision.
- Match product voice and locale from the brief and DS readme.
- Run `design-system-guardian` before generating or changing UI.

**Don't**
- Invent colors, type sizes, spacing, or radii outside the tokens.
- Restyle raw HTML to imitate bound components.
- Copy patterns from a *different* design system bundled with another project.
- Stack conflicting navigation layers on one screen.

---

## 5. Component Philosophy

Namespace from `BOUND_DS.json` → `namespace`. For voice, variants, and composition rules, read:

1. `BOUND_DS.json` → `components`
2. Bound DS readme and specimen cards (`_ds_manifest.json` → `cards`)
3. `Starter.dc.html` — live gallery for this binding

Document any project-specific component usage notes below as they crystallize:

<!-- Project-specific component notes go here -->

---

## 6. Reusable Patterns

Named pieces to preserve through to code. Extract from the bound DS readme, approved screens,
and `skills/framework-handoff.skill.md` inventory:

- Section headers / heroes
- App shell / navigation
- Cards / lists / empty states
- Data display / status chips

<!-- Project-specific patterns go here -->

---

## 7. Framework Handoff

Preferred handoff target chosen per surface:

- **Astro** — marketing, editorial, mostly-static content
- **Vite** — interactive app/dashboard prototypes
- **Next** — SSR / SEO-heavy routes / team conventions

Produce a framework-neutral component inventory first (see `skills/framework-handoff.skill.md`);
only target a framework after the canvas direction is approved.