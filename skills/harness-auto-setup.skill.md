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

## Procedure (canvas — execute script pipeline)

Per [`docs/script-pipeline.md`](../docs/script-pipeline.md) and [`docs/canvas-runtime.md`](../docs/canvas-runtime.md):
Claude Design supports JavaScript. **Read and execute** each script's logic against project files —
do not skip scripts or hand-wave their outputs. No `git`, `npm`, or `node` shell — apply the JS
algorithms directly. Local `node scripts/*.mjs` mirrors the same contract for maintainers.

### Phase 0 — Context signals

Execute `scripts/context-signals.mjs` logic first. If `harness.needsAutoSetup` is false and binding
is valid, skip to the user's message (report scripts applied).

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

**Write `BOUND_DS.json`** with the binding object above plus `version: 1`, `configured: true`, and a
`voice` object (tagline, heroHeadline, heroSubhead, badge, ctaPrimary, ctaSecondary, themeLabel,
surfaces, areaSuffix, searchPlaceholder, logoPath, footerNote, docTitle, docLead, deckCoverHeadline,
deckCoverSubhead, welcomeEyebrow, welcomeHeadline, welcomeSubhead, closingEyebrow, closingHeadline).
Derive `voice` from DS readme + manifest — mirror `scripts/extract-ds-voice.mjs` logic.

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

### Phase 4 — Patch + personalize templates

For **every** `*.dc.html`, apply **technical binding** then **voice + DS personalization**:

**4a — Technical binding**

1. Replace `{{DS_HELMET_BLOCK}}` with the helmet inner content from Phase 3 (indented).
2. Replace all `{{BOUND_DS_ROOT}}`, `{{BOUND_DS_NAMESPACE}}`, `{{BOUND_DS_NAME}}`,
   `{{BOUND_DS_COMPONENT_COUNT}}` with binding values.

**4b — Communication placeholders** (from `voice` / readme)

Replace every voice placeholder with project-specific copy:

| Placeholder | Source |
|---|---|
| `{{BOUND_DS_BADGE}}` | Short tagline chip from readme |
| `{{BOUND_DS_HERO_HEADLINE}}` | Hero title with one `<em>` accent word |
| `{{BOUND_DS_HERO_SUBHEAD}}` | Product description in brand voice |
| `{{BOUND_DS_CTA_PRIMARY}}` / `{{BOUND_DS_CTA_SECONDARY}}` | CTAs from readme voice |
| `{{BOUND_DS_THEME_LABEL}}` | `NOITE · DARK` or `DIA · LIGHT` from readme default theme |
| `{{BOUND_DS_WELCOME_*}}` | AppShell demo hero — product voice, not Academia filler |
| `{{BOUND_DS_AREA_SUFFIX}}` / `{{BOUND_DS_SEARCH_PLACEHOLDER}}` | First surface + search hint |
| `{{BOUND_DS_DECK_COVER_*}}` / `{{BOUND_DS_CLOSING_*}}` | Deck capa + encerramento |
| `{{BOUND_DS_DOC_TITLE}}` / `{{BOUND_DS_DOC_LEAD}}` | Doc masthead |
| `{{BOUND_DS_LOGO_PATH}}` | Logo from DS assets or `assets/logo-gold.svg` |
| `{{BOUND_DS_FOOTER_NOTE}}` | Footer line (© + optional Secured by) |

**4c — DS-aware structure** (mirror `scripts/personalize-dc.mjs`)

1. **Regenerate** `<!-- CDP:SURFACES -->` in `Landing.dc.html` from readme bullet surfaces.
2. **Regenerate** `<!-- CDP:NAV-LINKS -->` from the same surfaces.
3. **Regenerate** `// CDP:APP-NAV` items in `AppShell.dc.html` script from surfaces + icons.
4. **Remove** blocks wrapped in `<!-- CDP:REQUIRES:ComponentName -->` when that component is
   **not** in `components` (e.g. drop `BookCard` shelf if manifest has no BookCard).
5. **Prune** `Starter.dc.html` gallery cards whose `CardTitle` names a component missing from manifest.
6. Set `theme.default` in each DC script props to `voice.themeDefault`.

Do not delete template DCs (`AppShell`, `Landing`, `Deck`, `Doc`) — personalize in place.
Never leave Academia/Lendária demo copy when the bound DS is a different product.

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
## SCRIPTS APPLIED
- context-signals: [yes/no]
- detect-bound-ds: [yes/no]
- extract-ds-voice: [yes/no]
- bootstrap-harness: [yes/no]
- personalize-dc: [yes/no]

## HARNESS AUTO-SETUP
- DS detected: [name] (`[root]`)
- Namespace: [namespace]
- Components: [count] — [comma-separated list]
- Files written: BOUND_DS.json, styles.css, ds-helmet.snippet.html, DESIGN.md
- Files patched: [N] *.dc.html (binding + voice + component pruning)
- DESIGN.md: synthesized from [readme? tokens? cards?]
- Blockers: [none | list]

## READY
O harness está configurado. [Respond to user message or ask first-surface question.]
```

Do not output the full SKILLS APPLIED block on setup-only turns unless UI was also delivered.

## Failure modes

- **Skipping setup on a greeting:** User says "oi" but harness is unbound. -> Run setup first anyway.
- **Skipping scripts:** Canvas executes `scripts/*.mjs` by reading and applying their JS logic. ->
  Run pipeline steps 0–4 in order per `docs/script-pipeline.md`.
- **Asking user to run shell/npm:** No `node`/`npm`/`git` shell in canvas. -> Execute script algorithms
  directly; write file outputs.
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