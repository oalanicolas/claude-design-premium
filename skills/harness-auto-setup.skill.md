# harness-auto-setup.skill.md

## Name

Harness Auto-Setup

## Purpose

On the first interaction in Claude Design Web, automatically analyze the host canvas folder,
discover the bound design system, write all binding artifacts, synthesize a real `DESIGN.md`,
and patch every unbound template — without asking the user to run scripts or confirm each step.

## When to use (mandatory)

Run **before interpreting the user's message** when ANY setup signal is true:

- `styles.css` contains `UNBOUND`
- `BOUND_DS.json` is missing or lacks a `namespace` field
- `DESIGN.md` contains `CDP:UNCONFIGURED` or §1 template filler (`Describe the product's visual register`)
- Any `*.dc.html` still contains `{{DS_HELMET_BLOCK}}` or `{{BOUND_DS_`

Skip only when **all** pass:

- `BOUND_DS.json` exists with valid `namespace`, `root`, `globalCssPaths`, `components`
- `DESIGN.md` is populated with project-specific philosophy (not template stubs)
- `styles.css` has `@import` lines pointing at the bound DS
- All `*.dc.html` helmets are patched (no `{{` placeholders)

## Procedure (canvas-safe — write files, no shell)

Per [`docs/canvas-runtime.md`](../docs/canvas-runtime.md):
the canvas cannot run `git`, `npm install`, package scripts, or shell. It **can** read and write
project files. Auto-setup uses file writes only — not `node scripts/bootstrap-harness.mjs` (that
mirror exists for local maintenance outside the canvas; Node built-ins only, no npm packages).

### Phase 1 — Repository inventory

1. List every file and folder at the project root.
2. Note existing `*.dc.html`, `skills/`, `scripts/`, `styles.css`, `DESIGN.md`, `BOUND_DS.json`.
3. Locate `./_ds/` — expect exactly one bundle subfolder containing `_ds_manifest.json` and
   `_ds_bundle.js`. If zero: stop setup, tell user the host folder must include `_ds/<bundle>/`.
   If multiple: ask which bundle to bind before continuing.

### Phase 2 — Design system discovery

Read, in order:

1. `_ds/<bundle>/_ds_manifest.json` — `namespace`, `globalCssPaths`, `components`, `cards`, `templates`
2. `_ds/<bundle>/readme.md` or `README.md` (if present) — brand, voice, philosophy, anti-patterns
3. First 2–3 token CSS files from `globalCssPaths` — sample colors, typography, spacing tokens
4. Skim `_ds_bundle.js` for chrome class names (`.es-nav`, `.fx-rail`, etc.) and icon library hints

Build a mental binding object:

- `name` — human name from folder (e.g. `academia-ds-uuid` → "Academia DS")
- `root` — `_ds/<bundle>/`
- `bundle` — `_ds/<bundle>/_ds_bundle.js`
- `manifest` — `_ds/<bundle>/_ds_manifest.json`
- `namespace` — from manifest
- `components` — component names from manifest
- `componentCount` — length of components
- `globalCssPaths` — from manifest
- `readme` — path if found
- `iconLibrary` — `{ type: "iconoir", cdn: "..." }` if Icon component or iconoir refs exist; else `{ type: "none" }`
- `chromeSelectors` — detected chrome classes to suppress in DC helmets
- `configuredAt` — ISO timestamp

### Phase 3 — Write binding artifacts

**Write `BOUND_DS.json`** with the binding object above plus `version: 1` and `configured: true`.

**Write `styles.css`** — header comment + one `@import` per `globalCssPaths` entry:

```css
@import "_ds/<bundle>/tokens/fonts.css";
/* ... every path from globalCssPaths ... */
```

**Write `ds-helmet.snippet.html`** — copy-paste block:

- `<link rel="stylesheet">` for each `globalCssPaths` entry (prefixed with `root`)
- Icon CDN link if `iconLibrary.cdn` exists
- `<script src="[bundle]">`
- `<style>[chromeSelectors]{display:none !important;}</style>` if chrome detected

### Phase 4 — Patch templates

For **every** `*.dc.html`:

1. Replace `{{DS_HELMET_BLOCK}}` with the helmet inner content from Phase 3 (indented).
2. Replace all `{{BOUND_DS_ROOT}}`, `{{BOUND_DS_NAMESPACE}}`, `{{BOUND_DS_NAME}}`,
   `{{BOUND_DS_COMPONENT_COUNT}}` with binding values.
3. In `Starter.dc.html` only: remove or comment out component gallery cards for components
   **not** in `components` list. Keep prompts generic (reference namespace, not a fixed DS name).

Do not delete template DCs (`AppShell`, `Landing`, `Deck`, `Doc`) — only patch bindings.

### Phase 5 — Synthesize `DESIGN.md`

Replace the template `DESIGN.md` entirely. Source priority:

1. DS `readme.md` (brand, voice, philosophy, do/don't)
2. `_ds_manifest.json` (components, cards, templates)
3. Token CSS samples (color roles, type scale, radii, motion)
4. Existing project DCs if they contain approved direction

Required sections (all filled — no stub phrases):

1. **Design Philosophy** — product name, surface registers (brand/product/system), anti-references
2. **Core Principles** — hierarchy, spacing, components, responsiveness, accessibility
3. **Visual Language** — color, typography, elevation, radii, motion, iconography (with token names)
4. **Do / Don't** — specific to this DS (from readme + tokens)
5. **Component Philosophy** — namespace + voice per major component in inventory
6. **Reusable Patterns** — named patterns from readme/cards (shell, heroes, cards, etc.)
7. **Framework Handoff** — default targets per surface type

Header must name the actual product/DS (not "Bound Design System" template title).
Remove the `<!-- CDP:UNCONFIGURED -->` marker when writing the new file.

When readme and tokens disagree, **tokens win** — note mismatches inline.

### Phase 6 — Verify & report

1. Re-read `BOUND_DS.json` and confirm no `{{` placeholders remain in DCs.
2. Run native `check_design_system` if available.
3. Output the setup report (see Output contract) **before** addressing the user's original message.
4. If the user's message was only a greeting or vague, end with one blocking question: what is the
   first surface to design?

## Output contract

After setup, output:

```markdown
## HARNESS AUTO-SETUP
- DS detected: [name] (`[root]`)
- Namespace: [namespace]
- Components: [count] — [comma-separated list]
- Files written: BOUND_DS.json, styles.css, ds-helmet.snippet.html, DESIGN.md
- Files patched: [N] *.dc.html
- DESIGN.md: synthesized from [readme? tokens? cards?]
- Blockers: [none | list]

## READY
O harness está configurado. [Respond to user message or ask first-surface question.]
```

Do not output the full SKILLS APPLIED block on setup-only turns unless UI was also delivered.

## Failure modes

- **Skipping setup on a greeting:** User says "oi" but harness is unbound. -> Run setup first anyway.
- **Asking user to run shell/npm:** Canvas has no shell and no `npm install`. -> Write files in canvas.
  `node scripts/*.mjs` is valid only outside the canvas (built-ins only, per upstream LIMITATIONS.md).
- **Template DESIGN.md left in place:** §1 still says "Describe...". -> Phase 5 is mandatory.
- **Gallery shows missing components:** BookCard in Starter but not in manifest. -> Prune gallery.
- **Inventing tokens:** DESIGN.md must reference real `var(--*)` from token CSS, not guesses.
- **Hard-coding a previous project's DS:** Always read _ds/ in *this* folder.

## Example trigger

User's first message in an unbound harness:

```text
GO
```

Also triggers on `oi`, `olá`, or any first message when unbound.

Expected: full auto-setup runs silently, then responds with HARNESS AUTO-SETUP report + "O que você quer desenhar primeiro?"