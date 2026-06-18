# Claude Design Premium Protocol

You operate inside **Claude Design Web** under a document-backed premium UI protocol.

Runtime contract: [`docs/canvas-runtime.md`](docs/canvas-runtime.md) · Script pipeline:
[`docs/script-pipeline.md`](docs/script-pipeline.md) · Honest limits: [`LIMITATIONS.md`](LIMITATIONS.md)

Claude Design Web has a fixed, closed set of native product Skills. This starter does not install new
native Skills. Instead, this root `CLAUDE.md` acts as the bootstrap file, and the `.skill.md` files
are **documental procedures**: reusable operating instructions that you apply when relevant. Apply
only the procedures relevant to the current task  -  **except** `harness-auto-setup`, which always
runs first when the harness is unconfigured (see below).

## Auto-bootstrap gate (HIGHEST PRIORITY  -  runs before everything)

**On every new conversation, before interpreting the user's message**, check whether the harness
needs setup. If yes, run `scripts/context-signals.mjs` logic, then
`skills/harness-auto-setup.skill.md` **immediately and completely**  -  do not ask permission, do not
wait for a magic keyword. Execute the script pipeline in
[`docs/script-pipeline.md`](docs/script-pipeline.md), not a hand-waved summary.

### Setup needed when ANY of these is true

- `styles.css` contains `UNBOUND`
- `BOUND_DS.json` is missing or has no `namespace`
- `DESIGN.md` contains `CDP:UNCONFIGURED` or §1 template filler (`Describe the product's visual register`)
- Any root `*.dc.html` contains `{{DS_HELMET_BLOCK}}` or `{{BOUND_DS_`
- `BOUND_DS.json` is stale or out of sync with the live DS (`bindingSchemaStale` / `bindingOutOfSync` in `context-signals`)

### Setup complete when ALL of these pass

- `BOUND_DS.json` exists with `hostMode`, `bindingSource`, `namespace`, `root`, `components`, `globalCssPaths` and matches live DS detection
- `DESIGN.md` names the real product/DS and has no stub phrases
- `styles.css` re-exports the bound DS (`@import` lines, no `UNBOUND`)
- All `*.dc.html` helmets are patched (zero `{{` placeholders)

### What auto-setup must do (canvas  -  execute script pipeline)

Follow [`docs/script-pipeline.md`](docs/script-pipeline.md) steps 0 - 4 in order:

1. **`context-signals.mjs`**  -  inventory health; confirm `needsAutoSetup`
2. **`detect-bound-ds.mjs`** - resolve binding (`builder` root or `consumer` `_ds/<bundle>/`)
3. **`extract-ds-voice.mjs`**  -  derive communication/voice from DS readme
4. **`bootstrap-harness.mjs`**  -  write `BOUND_DS.json`, `styles.css`, `ds-helmet.snippet.html`; materialize design-system DC scaffold + `.cdp/showcase-brief.json`
5. **`personalize-dc.mjs`**  -  bootstrap seam (no-op today; scaffold is fully written in step 4)
6. **Synthesize** full `DESIGN.md` (skill Phase 5)
7. **Report** `HARNESS AUTO-SETUP` + `SCRIPTS APPLIED`, then answer the user's message

If the user only said "oi", "olá", or anything vague, finish setup and ask: *qual é a primeira
superfície que você quer desenhar?*

Inside the canvas, **read and execute** `scripts/*.mjs`  -  apply their JavaScript logic to project
files and write outputs. Do not ask the user to run shell commands. Local `node scripts/*.mjs` mirrors
the same logic for maintainers (see § Deterministic script pipeline).

**Never skip auto-setup** because the user's message sounds unrelated. Greetings, typos, one-word
prompts, **`GO`**, `activation-prompt.md`, and "começa" all trigger setup when the harness is unbound.

### Activation flow (human)

Same harness, two host projects:

**Consumer** (app/landing/deck consuming an exported DS):

1. Upload ZIP to a Claude Design project that already has `_ds/<bundle>/`.
2. Copy harness files -> project root (keep `_ds/`).
3. New tab -> **`GO`**.

**Builder** (Design System project under construction):

1. Upload ZIP to the DS project root (already has `_ds_manifest.json` + `_ds_bundle.js` + tokens).
2. Copy harness files -> project root (do not nest the DS inside `_ds/`).
3. New tab -> **`GO`**.

Auto-setup detects `hostMode` (`builder` | `consumer`) and writes the same artifacts in both cases.

## Core context

- `CLAUDE.md`: workflow, routing, and behavior rules (this file).
- **Host DS** (not shipped with the harness):
  - **Builder:** `_ds_manifest.json`, `_ds_bundle.js`, token CSS at project root (`hostMode: builder`).
  - **Consumer:** same files under `_ds/<bundle>/` (`hostMode: consumer`).
- `BOUND_DS.json`: **generated cache** from bootstrap (`hostMode`, `bindingSource`, component inventory,
  `tokenCount`, slim `voice`). Full token values stay in manifest/CSS - not duplicated in the binding cache.
  If missing, run auto-setup or read manifest from the detected host path.
- `DESIGN.md`: visual identity, layout principles, and aesthetic constraints - the *interpretive*
  layer for the bound DS. When it disagrees with token CSS, the CSS wins - flag the mismatch.
- `styles.css`: root canvas entry that **re-exports the bound DS token graph**. Ships UNBOUND in the
  ZIP; populated by bootstrap after the host DS is present. Never put token values here - edit them in
  the bound DS.
- `ds-helmet.snippet.html`: generated copy-paste `<helmet>` block (after bootstrap). Before bootstrap,
  use `{{DS_HELMET_BLOCK}}` in DC templates or build from `_ds_manifest.json` -> `globalCssPaths`.
- **Design-system DC** (`design-system.dc.html`): bootstrap writes **scaffold +** `.cdp/showcase-brief.json`
  from `scripts/templates/intro.dc.html`. The **active model** assembles the full customized vitrine
  (`skills/assemble-design-system-showcase.skill.md`) - JS binds helmet/metrics/prompts; the model composes
  tokens, specimens, and every component in product voice. Copy its `<helmet>` block when starting deliverables.
- `skills/*.skill.md`: document-backed procedures for design-system enforcement, audits, polish,
  implementation review, and final checks.
- `scripts/*.mjs`: **deterministic JavaScript pipeline**  -  dependency-free (`node:fs`, `node:path`
  only, no npm). Claude reads and executes their logic in the canvas; skills pair with them in a fixed
  order ([`docs/script-pipeline.md`](docs/script-pipeline.md)). `support.js` is browser runtime for DC
  previews; `scripts/*.mjs` are the harness brain.

## Binding discovery (dual host mode)

`BOUND_DS.json` includes `hostMode` and `bindingSource`:

| `hostMode` | When | `root` | Detection |
|---|---|---|---|
| `builder` | DS project with compiled manifest + bundle at root | `.` | `./_ds_manifest.json` + `./_ds_bundle.js` |
| `consumer` | App consuming an exported bundle | `_ds/<bundle>/` | manifest + bundle under `_ds/` |

**Auto-detection order:** cached `hostMode` in `BOUND_DS.json` -> builder root -> consumer `_ds/`.
Scripts: `node scripts/detect-bound-ds.mjs` (alias `detectHostDs`).

**First session:** auto-bootstrap writes all artifacts. **After setup**, resolve from `BOUND_DS.json`.
Re-run `harness-auto-setup` when manifest, `_ds/`, or token files change.

Never hard-code a DS path or namespace from memory or from a previous project.

### Deterministic script pipeline (canvas-first)

See [`docs/script-pipeline.md`](docs/script-pipeline.md). **In the canvas:** read each relevant
`scripts/*.mjs` and execute its logic against project files  -  same contract as skills. **Locally:**
`node scripts/<name>.mjs` for identical output.

```text
context-signals -> detect-bound-ds -> extract-ds-voice -> bootstrap-harness -> personalize-dc (seam)
  -> [model: assemble-design-system-showcase when pending]
  -> check_design_system -> design-system-guardian -> audits (+ detect-* scripts)
```

```bash
node scripts/context-signals.mjs          # health signals (JSON)
node scripts/bootstrap-harness.mjs        # bind + personalize + synthesize DESIGN.md
node scripts/synthesize-design-md.mjs     # DESIGN.md only (after BOUND_DS.json exists)
node scripts/unbind-harness.mjs          # reset harness state (keeps _ds/)
node scripts/detect-canvas-antipatterns.mjs .
node scripts/detect-text-antipatterns.mjs CLAUDE.md DESIGN.md skills *.dc.html
```

Inside the canvas, `harness-auto-setup` mirrors the same pipeline by reading and applying
`scripts/bootstrap-harness.mjs`, `scripts/synthesize-design-md.mjs`, and related `.mjs` logic
(file writes only  -  no shell).

## Validation canary

Use this exact token only when the user is validating whether the root file loaded:

```text
CDP-CLAUDE-OK
```

Do not add it to every normal first response. In projects where root loading is already proven, the
canary is a diagnostic, not a ritual.

## Native Claude Design hooks

Use native Claude Design hooks before inventing replacements, while preserving the shape of the
current project:

- Tokens: use the bound DS token CSS listed in `BOUND_DS.json` -> `globalCssPaths` (re-exported by
  root `styles.css`). Never invent token values.
- Components: compose bound DS components by loading `BOUND_DS.json` -> `bundle` once in `<helmet>`
  and mounting from `BOUND_DS.json` -> `namespace`. Never recreate or restyle raw HTML to imitate them.
- Specimen cards: the bound DS ships its specimens; the Design System tab reads `_ds_manifest.json`.
- Live proof: run Claude Design's native `check_design_system` when available.

`scripts/*.mjs` are deterministic preflight **inside the canvas** (Claude executes their JS logic).
They complement  -  not replace  -  native `check_design_system`.

## Canvas runtime constraints

Aligned with upstream [`docs/canvas-runtime.md`](https://github.com/oalanicolas/claude-design-premium/blob/main/docs/canvas-runtime.md).

**Works in canvas:** static HTML/CSS, CSS custom properties, vanilla JS, self-contained UMD/IIFE
globals via `<script src>`, native DS hooks (`_ds_manifest.json`, `check_design_system`), reading and
**writing project files** (including auto-setup).

**Does NOT work in canvas:** `git`, `npm install`, package scripts, lint, tests, builds, dev servers
(Vite/Next/Astro), ESM imports/bare specifiers, bundler-dependent modules, shell execution.

**Scripts nuance:** Claude Design supports JavaScript. `scripts/*.mjs` **run in the canvas** when
Claude reads and applies their logic to project files. There is no `node` shell in the canvas  -  execute
the script algorithms directly. `node scripts/*.mjs` is the local mirror for maintainers.

React/JSX only as in-browser escape hatch (UMD React + Babel + `window` globals). Prefer vanilla JS.

When starting from an empty canvas, write the root `CLAUDE.md` first, then scaffold static files, then
ask opening questions before generating visual work. If a readable source starter folder is available,
replicate its real files instead of recreating code from memory.

## Token truth

- The active token source is the bound DS: `BOUND_DS.json` -> `globalCssPaths` (+ its `styles.css`),
  re-exported by root `styles.css`. This is the single source of truth in the canvas.
- Every color, spacing, type, radius, elevation, and motion value must be a `var(--*)` token from
  that graph. Never invent values; never hard-code hexes the tokens already define.
- To change a token value, edit the file under the bound DS token directory  -  not root `styles.css`
  (a re-export) and not `DESIGN.md` (interpretation only).
- Canvas CSS cannot import JSON; there is no JSON token runtime. The DS CSS is authoritative.

### When `DESIGN.md` disagrees with token CSS

1. **Proceed with token CSS** for all visual values (colors, spacing, type, radii, motion).
2. **Flag the mismatch** in your response and add an inline note in `DESIGN.md` at the conflicting
   section (e.g. `> Token mismatch: readme says light default; CSS is dark-first.`).
3. **Re-synthesize `DESIGN.md`** when the conflict is structural (theme default, font roles, major
   do/don't). Mirror `scripts/synthesize-design-md.mjs` (canvas) or run
   `node scripts/synthesize-design-md.mjs` outside the canvas. Do not block UI work for a single
   interpretive sentence; block only when tokens are missing or invented.

## Placeholder inventory (design-system DC)

Replaced during bootstrap materialization (`scripts/intro-dc.mjs` + `scripts/bootstrap-harness.mjs`):

| Placeholder | Source |
|---|---|
| `{{DS_HELMET_BLOCK}}` | Generated helmet: CSS links + bundle script + chrome suppress |
| `{{BOUND_DS_NAMESPACE}}` | `BOUND_DS.json` -> `namespace` (in scaffold x-import paths) |
| `{{INTRO_HTML_LANG}}` | Detected doc language |
| `{{INTRO_PAGE_TITLE}}` | Localized page title |
| `{{INTRO_SYSTEM_HTML}}` | Scaffold HTML from `renderShowcaseScaffold()` |

Voice for copy lives in `BOUND_DS.json` -> `voice` (slim: tagline, productDescription, surfaces,
theme, logoPath, badge) and in `.cdp/showcase-brief.json` for showcase assembly.

## Structure markers (DC blocks)

| Marker | File | Behavior |
|---|---|---|
| `<!-- CDP:INTRO-SCRIPT -->` | design-system DC | Replaced with localized prompt `DCLogic` script |
| `<!-- CDP:PROMPTS -->` | design-system DC scaffold | Injected prompt list markup |
| `<!-- CDP:SHOWCASE:PENDING -->` | design-system DC scaffold | Replaced by the active model (`assemble-design-system-showcase`), not JS |

Do not hand-edit markers expecting them to persist across re-setup; edit readme or generator logic instead.

## Building in this project

Every deliverable is a **Design Component** (`Name.dc.html`). To use the bound DS, load its bundle
once at the top of the template, then mount components from the namespace. Copy the `<helmet>` block
from `design-system.dc.html` (`BOUND_DS.json` -> `introDc`) or `ds-helmet.snippet.html`:

    <helmet>
      <!-- CSS paths from BOUND_DS.json -> globalCssPaths -->
      <link rel="stylesheet" href="[BOUND_DS.root]/tokens/fonts.css">
      ...
      <script src="[BOUND_DS.bundle]"></script>
      <!-- Suppress bundle-injected site chrome if BOUND_DS.json lists chromeSelectors -->
      <style>[chromeSelectors]{display:none !important;}</style>
    </helmet>

Then mount:
`<x-import component-from-global-scope="[BOUND_DS.namespace].Button" hint-size="auto,40px">Label</x-import>`.

Read `BOUND_DS.json` -> `components` for the full component inventory. Read the bound DS readme
(`BOUND_DS.json` -> `readme`) for component voice, variants, and brand-specific patterns.

**Gotcha:** `x-import` treats `name` as a reserved attribute (it aliases the export name), so it is
NOT forwarded as a prop. Components that take a `name` prop (e.g. `Icon`, `Avatar`) cannot receive
`name` through `x-import`. For those cases, read the assembled `design-system.dc.html` specimen and
mirror the DS-safe pattern used there. Every other component is fine through `x-import`.

## Skill inventory

- `harness-auto-setup`: **mandatory on first turn** when harness is unbound  -  inventories repo,
  discovers `_ds/`, writes binding artifacts, synthesizes `DESIGN.md`, patches all DC templates.
- `brief-framing`: classifies the surface, captures missing context, and prevents premature invention.
- `design-system-guardian`: checks `DESIGN.md` + active token CSS. Almost always first.
- `visual-originality-audit`: catches generic template reflexes and category clichés.
- `ui-audit`: hierarchy, composition, rhythm, clarity, IA, and empty/loading/error states.
- `polish-phase`: microcopy, alignment, subtle motion, and perceived premium quality.
- `text-integrity-audit`: checks UI copy, docs, prompts, reports, and public text for generic wording,
  weak voice, and banned typography.
- `fivu-identity-showcase`: condenses FIVU voice/corpus/system-prompt work into one procedure for
  premium identity pages and FIVU-grade design-system showcases.
- `mobile-first-audit`: responsive behavior, breakpoints, and touch targets.
- `accessibility-audit`: contrast, semantics, keyboard, focus, and reduced motion.

Handoff / code-phase skills (not part of the canvas design loop):

- `tailwind-audit`: class quality and token adherence. Only when Tailwind/code exists (needs a build, so it runs in the repo, not the canvas).
- `framework-handoff`: component inventory and Astro/Vite/Next handoff planning after the canvas direction is approved.

## Literal routing table

Before acting, match the user's request to the first relevant triggers below and READ the listed
files. Do not assume `BOUND_DS.json`, `DESIGN.md`, the bound DS token CSS, or `.skill.md` files are
already in working context unless you have read them in the current task.

| Trigger | Read before acting | Required behavior |
|---|---|---|
| **Start of session / before major work** | `scripts/context-signals.mjs`, `docs/script-pipeline.md` | Execute context-signals logic; report `SCRIPTS APPLIED`. If `needsAutoSetup`, continue to harness-auto-setup. If `needsShowcaseAssembly`, run assemble-design-system-showcase **before** other UI work. |
| **Showcase pending** (`CDP:SHOWCASE:PENDING`, `needsShowcaseAssembly`) | `.cdp/showcase-brief.json`, `BOUND_DS.json`, `DESIGN.md`, DS readme, `skills/assemble-design-system-showcase.skill.md`, `skills/fivu-identity-showcase.skill.md` | Model assembles the full `design-system.dc.html` vitrine - customized per product. For premium narrative/showcase pages, use the FIVU architecture so the result is a worked identity system, not a generic component catalog. JS does not replace this step. |
| FIVU, identidade verbal, voice system, corpus, system prompt de voz, página como a referência FIVU | `skills/fivu-identity-showcase.skill.md`, `BOUND_DS.json` when present, `DESIGN.md`, DS readme, supplied corpus/reference files | Use the single FIVU skill to synthesize voice, tone, corpus evidence, examples, anti-vocabulary, artifacts, and validation into one premium `.dc.html` page or identity spec. Do not split into multiple agents or generate the final page by JS. |
| **Any message when harness is unconfigured** (`GO`, greeting, anything) | `docs/script-pipeline.md`, `skills/harness-auto-setup.skill.md`, `scripts/detect-bound-ds.mjs`, `scripts/extract-ds-voice.mjs`, `scripts/bootstrap-harness.mjs`, `scripts/personalize-dc.mjs` | Run full script pipeline steps 0 - 4 **before** anything else; write all artifacts; synthesize DESIGN.md; report `HARNESS AUTO-SETUP` + `SCRIPTS APPLIED`. |
| Bootstrap validation explicitly requested | `CLAUDE.md`, `scripts/context-signals.mjs` | Include `CDP-CLAUDE-OK` once; execute context-signals; state whether routing + script pipeline appear loaded. |
| New project, unclear audience/brand/first surface, or reference files without instructions | `skills/brief-framing.skill.md`, `BOUND_DS.json`, `DESIGN.md` | Classify the surface and ask only blocking questions before visual generation. |
| Any UI generation, modification, or review | `BOUND_DS.json`, `DESIGN.md`, bound DS token CSS, `scripts/context-signals.mjs`, `skills/design-system-guardian.skill.md` | Run context-signals if not run this session; anchor in DESIGN.md + tokens; run `check_design_system` when available. |
| Starting a new deliverable (screen, deck, doc, prototype) | `design-system.dc.html` (`BOUND_DS.json` -> `introDc`), `ds-helmet.snippet.html`, `DESIGN.md` | Create a new `Name.dc.html`; copy the `<helmet>` block from the design-system page or snippet. |
| Static / plain-CSS canvas output | bound DS token CSS (via root `styles.css`) | Use `var(--*)` tokens only; no JSON import, npm, ESM, or bundler. |
| Canvas prototype needs React state/interaction | `CLAUDE.md` § Canvas runtime constraints | DCs already render React; for escape-hatch pages use UMD React + Babel + `window` globals only. |
| New page, major layout, visual direction, landing, dashboard, app shell, specimen, or component | `scripts/detect-canvas-antipatterns.mjs`, `skills/visual-originality-audit.skill.md`, `skills/ui-audit.skill.md` | Execute detect-canvas-antipatterns on targets **first**; then originality + UI audits. |
| Public copy, docs, prompt library, README, skill text, deck/UI text | `scripts/detect-text-antipatterns.mjs`, `DESIGN.md`, `skills/text-integrity-audit.skill.md` | Execute detect-text-antipatterns **first**; then text-integrity judgment. |
| Existing approved direction that needs refinement | `skills/polish-phase.skill.md` | Refine without redesigning the structure. |
| External implementation code or Tailwind handoff exists | `skills/tailwind-audit.skill.md` | Audit classes only outside the canvas/static-design loop. |
| Mobile readiness or final review | `scripts/detect-canvas-antipatterns.mjs`, `skills/mobile-first-audit.skill.md` | Execute detect-canvas-antipatterns on targets **first**; then mobile-first judgment. |
| Accessibility readiness or final review | `scripts/detect-canvas-antipatterns.mjs`, `skills/accessibility-audit.skill.md` | Execute detect-canvas-antipatterns on targets **first**; include no-certification disclaimer. |
| Componentization, export, Astro, Vite, Next, or handoff | `skills/framework-handoff.skill.md` | Produce a framework-neutral inventory first; target a framework only after canvas direction is approved. |
| DS binding missing or `_ds/` changed | `docs/script-pipeline.md`, `skills/harness-auto-setup.skill.md` | Re-run script pipeline steps 0 - 4 in canvas. |
| Final approval / mark screen done | `scripts/context-signals.mjs`, `scripts/detect-canvas-antipatterns.mjs`, `scripts/detect-text-antipatterns.mjs` | context-signals + antipattern scripts before declaring final. |

Never invent tokens when the bound DS tokens provide them. Never mark a screen or component final
until both mobile-first and accessibility checks were applied. If a task conflicts with `DESIGN.md`
or the bound DS tokens, follow § Token truth (CSS wins, flag, re-synthesize when structural).

## What "enforce" means here

Enforcement is **procedural and reviewable**, not deterministic. You are explicitly instructed to
check the work against `CLAUDE.md`, `BOUND_DS.json`, `DESIGN.md`, the bound DS tokens, and the
relevant procedures, then report what you applied or skipped. Human review is still required.

## Reporting

Output the block below at the end of responses that **deliver or review** UI: a new screen, a major
layout/direction change, an explicit audit/review, or a final/handoff step:

```markdown
## SCRIPTS APPLIED
- [script name]: [yes/no]: [brief result]

## SKILLS APPLIED
- [skill name]: [yes/no]: [brief reason]

## NOT APPLIED
- [script or skill name]: [why skipped]

## NEXT RECOMMENDED
- [one script, skill, or action that would improve the result further]
```

For small iterative microadjustments (one tweak: a color, a spacing value, a label), skip the full
block and add a single line noting what changed and any check you skipped. This keeps iteration fast
and avoids the context-pressure noise of a full report on every turn. Never silently drop the block on
a delivery or audit: there it is the transparency mechanism that makes the protocol trustworthy.

## Safety guardrails

- Inside Claude Design Web, `scripts/*.mjs` are **executed as JavaScript logic** against project
  files  -  the same foundation that pairs with skills ([`docs/script-pipeline.md`](docs/script-pipeline.md)).
  `.skill.md` files are procedural; scripts are deterministic preflight. Report both in `SCRIPTS APPLIED`.
- Never run shell commands (`node`, `git`, `npm`), package installs, or network calls from inside the
  canvas. **Do** read and apply `scripts/*.mjs` algorithms directly. Local `node scripts/...` is for
  maintainers outside the canvas  -  do not confuse that with in-canvas script execution.
- Do not read, request, or transmit secrets, environment variables, tokens, or credentials.
- Do not send project data to external services.

## Failure-mode awareness

If a very large `DESIGN.md` or many skills are loaded at once, context pressure rises and instructions
may be ignored. In that case: keep only the most relevant skills loaded, prioritize
`design-system-guardian` + one audit skill per turn, and never silently drop the reporting block on a delivery or audit.

This protocol exists to create **repeatable, auditable, premium design execution**: not to make the
model do everything at once. Selectivity is the feature.
