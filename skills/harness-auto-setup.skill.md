# harness-auto-setup.skill.md

## Name

Harness Auto-Setup

## Purpose

On the first interaction in Claude Design Web, automatically analyze the host canvas folder,
discover the bound design system, write all binding artifacts, synthesize a real `DESIGN.md`,
and patch every unbound template  -  without asking the user to run scripts or confirm each step.

## When to use (mandatory)

Run **before interpreting the user's message** when ANY setup signal is true:

- `styles.css` contains `UNBOUND`
- `BOUND_DS.json` is missing or lacks a `namespace` field
- `DESIGN.md` contains `CDP:UNCONFIGURED` or §1 template filler (`Describe the product's visual register`)
- Any root `*.dc.html` still contains `{{DS_HELMET_BLOCK}}` or `{{BOUND_DS_`
- `context-signals` reports `bindingSchemaStale` or `bindingOutOfSync`

Skip only when **all** pass:

- `BOUND_DS.json` exists with `hostMode`, `bindingSource`, valid `namespace`, `root`, `globalCssPaths`, `components`, and matches live DS detection
- `DESIGN.md` is populated with project-specific philosophy (not template stubs)
- `styles.css` has `@import` lines pointing at the bound DS
- All `*.dc.html` helmets are patched (no `{{` placeholders)

## Procedure (canvas  -  execute script pipeline)

Per [`docs/script-pipeline.md`](../docs/script-pipeline.md) and [`docs/canvas-runtime.md`](../docs/canvas-runtime.md):
Claude Design supports JavaScript. **Read and execute** each script's logic against project files  -
do not skip scripts or hand-wave their outputs. No `git`, `npm`, or `node` shell  -  apply the JS
algorithms directly. Local `node scripts/*.mjs` mirrors the same contract for maintainers.

### Phase 0  -  Context signals

Execute `scripts/context-signals.mjs` logic first. If `harness.needsAutoSetup` is false and binding
is valid, skip to the user's message (report scripts applied).

### Phase 1  -  Repository inventory + host mode

Execute `scripts/detect-bound-ds.mjs` logic (`detectHostDs`). Two valid hosts:

**Builder** (`hostMode: builder`): `./_ds_manifest.json` + `./_ds_bundle.js` at project root (DS
under construction). `root` is `.`.

**Consumer** (`hostMode: consumer`): `./_ds/<bundle>/` with manifest + bundle (app using exported DS).

If neither: stop and explain both shapes. If consumer has multiple bundles: default alphabetical,
persist `selectedBundle`, note alternates  -  do not block on silence.

### Phase 2  -  Design system discovery

Read from `binding.root` (`.` or `_ds/<bundle>/`):

1. `_ds_manifest.json`  -  `namespace`, `globalCssPaths`, `components`, `cards` (specimens)
2. `readme.md` / `README.md`  -  brand, voice, philosophy, anti-patterns
3. Token CSS from `globalCssPaths` (paths relative to `binding.root`)
4. `_ds_bundle.js`  -  chrome selectors, icon library hints

Build binding object (mirror script output):

- `hostMode`  -  `builder` | `consumer`
- `bindingSource`  -  `native-root` | `exported-bundle`
- `name`  -  from readme heading or folder/namespace
- `root`  -  `.` or `_ds/<bundle>/`
- `bundle`  -  `_ds_bundle.js` (project-relative path)
- `manifest`  -  `_ds_manifest.json` (project-relative path)
- `namespace`  -  from manifest
- `components`  -  component names from manifest
- `componentCount`  -  length of components
- `globalCssPaths`  -  from manifest
- `readme`  -  path if found
- `iconLibrary`  -  `{ type: "iconoir", cdn: "..." }` if Icon component or iconoir refs exist; else `{ type: "none" }`
- `chromeSelectors`  -  detected chrome classes to suppress in DC helmets
- `configuredAt`  -  ISO timestamp

### Phase 3  -  Write binding artifacts

**Write `BOUND_DS.json`** with the binding object above plus `version: 2` (binding cache format), `configured: true`, and a
slim `voice` object: `language`, `themeDefault`, `themeLabel`, `tagline`, `productDescription`,
`surfaces`, `badge`, `logoPath`. Do **not** embed the full manifest token array in the binding cache
(use `tokenCount` + read manifest/CSS on demand). Derive `voice` from DS readme + token CSS  -  mirror
`scripts/extract-ds-voice.mjs` and `scripts/extract-ds-tokens.mjs` logic.

**Write `styles.css`**  -  header comment + one `@import` per `globalCssPaths` entry:

```css
/* consumer: paths prefixed with binding.root */
@import "_ds/<bundle>/tokens/fonts.css";
/* builder: paths relative to root (.) */
@import "tokens/fonts.css";
/* ... one @import per globalCssPaths entry via ds-paths importPath() */
```

**Write `ds-helmet.snippet.html`**  -  copy-paste block:

- `<link rel="stylesheet">` for each `globalCssPaths` entry (prefixed with `root`)
- Icon CDN link if `iconLibrary.cdn` exists
- `<script src="[bundle]">`
- `<style>[chromeSelectors]{display:none !important;}</style>` if chrome detected

### Phase 4  -  Materialize design-system DC (scaffold only)

Materialize **one** page from `scripts/templates/intro.dc.html` (not surface templates).
**JS writes scaffold + brief only** - the active model assembles the full vitrine in Phase 4d.

1. Detect document language from `CLAUDE.md`, README, `DESIGN.md`, and DS readme
   (`scripts/intro-dc.mjs` -> `detectDocLanguage`).
2. Choose filename: `design-system.dc.html` for every language.
3. Remove legacy surface DCs if present (`Landing`, `AppShell`, `Deck`, `Doc`, `Starter`).
4. Write `docLanguage` and `introDc` on `BOUND_DS.json`.

For the design-system DC scaffold, mirror `scripts/intro-dc.mjs` materialization:

**4a  -  Technical + intro copy**

1. Replace `{{DS_HELMET_BLOCK}}` with the helmet inner content from Phase 3 (indented).
2. Replace `{{INTRO_HTML_LANG}}`, `{{INTRO_PAGE_TITLE}}`, `{{INTRO_SYSTEM_HTML}}` via `introCopy()`.
3. Replace `{{BOUND_DS_NAMESPACE}}` in scaffold x-import paths.
4. Inject prompt markup at `<!-- CDP:PROMPTS -->` and localized `DCLogic` at `<!-- CDP:INTRO-SCRIPT -->`.
5. **Do not assemble the component showcase here.** Keep `<!-- CDP:SHOWCASE:PENDING -->` for Phase 4d.

**4b  -  personalize-dc seam**

Mirror `scripts/personalize-dc.mjs` (no-op today). Report in `SCRIPTS APPLIED`; do not reintroduce
legacy `{{BOUND_DS_*}}` voice placeholders or `CDP:REQUIRES` pruning.

**4c  -  Write showcase brief**

Mirror `scripts/showcase-brief.mjs`: write `.cdp/showcase-brief.json` with manifest inventory,
voice, and assembly contract. Set `showcaseAssembled: false` on `BOUND_DS.json`.

### Phase 4d  -  Model assembles showcase (mandatory before UI deliverables)

If `design-system.dc.html` contains `<!-- CDP:SHOWCASE:PENDING -->`, read
`skills/assemble-design-system-showcase.skill.md` and **assemble the full vitrine** in the same
session. This step is for the active model (Opus/Sonnet/etc.) - not deterministic JS.

### Phase 5  -  Synthesize `DESIGN.md`

**Mandatory.** Mirror `scripts/synthesize-design-md.mjs` exactly (read the script, apply its output
shape). Do not leave the template stub in place.

Source priority: readme -> manifest -> token CSS (`extract-ds-tokens`) -> voice defaults.

Required: all 7 sections filled, header names the real DS, no `CDP:UNCONFIGURED`, no
`Describe the product's visual register` filler.

When readme and tokens disagree, **tokens win**  -  note mismatches inline (see `CLAUDE.md` § Token truth).

### Phase 6  -  Verify & report

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
- Host mode: [builder | consumer]
- DS detected: [name] (`[root]`)
- Namespace: [namespace]
- Components: [count]  -  [comma-separated list]
- Files written: BOUND_DS.json, styles.css, ds-helmet.snippet.html, DESIGN.md
- Design-system DC: [introDc filename] ([docLanguage], showcaseAssembled: [true/false])
- DESIGN.md: synthesized from [readme? tokens? cards?]
- Blockers: [none | list]

## READY
O harness está configurado. [Respond to user message or ask first-surface question.]
```

Do not output the full SKILLS APPLIED block on setup-only turns unless UI was also delivered.

## Failure modes

- **Skipping setup on a greeting:** User says "oi" but harness is unbound. -> Run setup first anyway.
- **Skipping scripts:** Canvas executes `scripts/*.mjs` by reading and applying their JS logic. ->
  Run pipeline steps 0 - 4 in order per `docs/script-pipeline.md`.
- **Asking user to run shell/npm:** No `node`/`npm`/`git` shell in canvas. -> Execute script algorithms
  directly; write file outputs.
- **Template DESIGN.md left in place:** §1 still says "Describe...". -> Phase 5 is mandatory.
- **Specimen shows missing components:** page lists a component not in manifest. -> Regenerate from
  manifest and prune missing entries.
- **Inventing tokens:** DESIGN.md must reference real `var(--*)` from token CSS, not guesses.
- **Hard-coding a previous project's DS:** Always read _ds/ in *this* folder.

## Example trigger

User's first message in an unbound harness:

```text
GO
```

Also triggers on `oi`, `olá`, or any first message when unbound.

Expected: full auto-setup runs silently, then responds with HARNESS AUTO-SETUP report + "O que você quer desenhar primeiro?"
