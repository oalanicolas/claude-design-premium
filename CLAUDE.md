# Claude Design Premium Protocol

You operate inside **Claude Design Web** under a document-backed premium UI protocol.

Runtime contract: [`docs/canvas-runtime.md`](docs/canvas-runtime.md) · Honest limits: [`LIMITATIONS.md`](LIMITATIONS.md)

Claude Design Web has a fixed, closed set of native product Skills. This starter does not install new
native Skills. Instead, this root `CLAUDE.md` acts as the bootstrap file, and the `.skill.md` files
are **documental procedures**: reusable operating instructions that you apply when relevant. Apply
only the procedures relevant to the current task — **except** `harness-auto-setup`, which always
runs first when the harness is unconfigured (see below).

## Auto-bootstrap gate (HIGHEST PRIORITY — runs before everything)

**On every new conversation, before interpreting the user's message**, check whether the harness
needs setup. If yes, run `skills/harness-auto-setup.skill.md` **immediately and completely** — do
not ask permission, do not tell the user to run scripts, do not wait for a magic keyword.

### Setup needed when ANY of these is true

- `styles.css` contains `UNBOUND`
- `BOUND_DS.json` is missing or has no `namespace`
- `DESIGN.md` contains `CDP:UNCONFIGURED` or §1 template filler (`Describe the product's visual register`)
- Any `*.dc.html` contains `{{DS_HELMET_BLOCK}}` or `{{BOUND_DS_`

### Setup complete when ALL of these pass

- `BOUND_DS.json` exists with `namespace`, `root`, `components`, `globalCssPaths`
- `DESIGN.md` names the real product/DS and has no stub phrases
- `styles.css` re-exports the bound DS (`@import` lines, no `UNBOUND`)
- All `*.dc.html` helmets are patched (zero `{{` placeholders)

### What auto-setup must do (inside the canvas — no shell)

1. **Inventory** the project root — list files, find `_ds/<bundle>/`
2. **Read** `_ds_manifest.json`, DS readme, sample token CSS, existing DCs
3. **Write** `BOUND_DS.json`, `styles.css`, `ds-helmet.snippet.html`
4. **Patch** every `*.dc.html` — replace `{{DS_HELMET_BLOCK}}` and all `{{BOUND_DS_*}}`
5. **Synthesize** a full `DESIGN.md` from readme + manifest + tokens (replace template entirely)
6. **Prune** `Starter.dc.html` gallery to components that exist in the manifest
7. **Report** with the `HARNESS AUTO-SETUP` block (see skill), then answer the user's message

If the user only said "oi", "olá", or anything vague, finish setup and ask: *qual é a primeira
superfície que você quer desenhar?*

Inside the canvas, **you are the bootstrap** — write the files yourself. Do not ask the user to run
shell commands. Outside the canvas, `scripts/*.mjs` can mirror the same binding (Node built-ins
only — see § Deterministic local scripts).

**Never skip auto-setup** because the user's message sounds unrelated. Greetings, typos, one-word
prompts, **`GO`**, `activation-prompt.md`, and "começa" all trigger setup when the harness is unbound.

### Activation flow (human)

After uploading this harness to a Claude Design project that already has `_ds/`:

1. User asks Claude to copy upload files → project root (keep `_ds/`).
2. User opens a **new tab** and sends **`GO`** (or any message — auto-setup still runs if unbound).
3. Harness auto-configures, then asks for the first surface to design.

## Core context

- `CLAUDE.md`: workflow, routing, and behavior rules (this file).
- `_ds/<bundle>/`: the design system folder **provided by the host project** (not shipped with the
  harness). Its `_ds_manifest.json`, token CSS, `styles.css`, and `_ds_bundle.js` are the runtime
  source of truth.
- `BOUND_DS.json`: optional **generated cache** (from `node scripts/bootstrap-harness.mjs`). If
  missing, read `_ds/*/_ds_manifest.json` directly on every UI task.
- `DESIGN.md`: visual identity, layout principles, and aesthetic constraints — the *interpretive*
  layer for the bound DS. When it disagrees with token CSS, the CSS wins — flag the mismatch.
- `styles.css`: root canvas entry that **re-exports the bound DS token graph**. Ships UNBOUND
  (empty); populated by `scripts/bootstrap-harness.mjs` after `_ds/` is present. Never put token
  values here — edit them in the bound DS.
- `ds-helmet.snippet.html`: generated copy-paste `<helmet>` block (after bootstrap). Before bootstrap,
  use `{{DS_HELMET_BLOCK}}` in DC templates or build from `_ds_manifest.json` → `globalCssPaths`.
- `Starter.dc.html`: working reference DC that loads the bundle and composes real DS components. It
  doubles as the **team guide** (pt-BR) — live component gallery, prompt catalogue, and load-failure
  fallback. Copy its `<helmet>` block when starting new work.
- `skills/*.skill.md`: document-backed procedures for design-system enforcement, audits, polish,
  implementation review, and final checks.
- `scripts/*.mjs`: deterministic local helpers — **dependency-free** (`node:fs`, `node:path` only, no
  npm packages). Useful outside Claude Design Web for maintenance; the canvas does not execute shell.

## Binding discovery

This harness ships **without** a pre-bound design system. The host folder must contain
`./_ds/<bundle>/`.

**First session:** auto-bootstrap (above) handles discovery and writes all artifacts. You do not
need a separate binding step if setup already ran.

**After setup**, resolve the active DS from `BOUND_DS.json` (cache). Manifest wins if they differ.
If `_ds/` changed mid-session, re-run `harness-auto-setup`.

Never hard-code a DS path or namespace from memory or from a previous project.

### Deterministic local scripts (outside canvas only)

Per [upstream README](https://github.com/oalanicolas/claude-design-premium#deterministic-local-scripts):
these scripts use **Node built-ins only — no npm install, no packages**. They do not run inside
Claude Design Web; use them when maintaining the project locally.

```bash
node scripts/context-signals.mjs          # health signals (JSON)
node scripts/bootstrap-harness.mjs        # bind placeholders → _ds/
node scripts/unbind-harness.mjs          # reset to agnostic template
node scripts/detect-canvas-antipatterns.mjs .
node scripts/detect-text-antipatterns.mjs CLAUDE.md DESIGN.md skills
```

Inside the canvas, `harness-auto-setup` replaces `bootstrap-harness.mjs` by writing files directly.

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

- Tokens: use the bound DS token CSS listed in `BOUND_DS.json` → `globalCssPaths` (re-exported by
  root `styles.css`). Never invent token values.
- Components: compose bound DS components by loading `BOUND_DS.json` → `bundle` once in `<helmet>`
  and mounting from `BOUND_DS.json` → `namespace`. Never recreate or restyle raw HTML to imitate them.
- Specimen cards: the bound DS ships its specimens; the Design System tab reads `_ds_manifest.json`.
- Live proof: run Claude Design's native `check_design_system` when available.

Repo-side scripts are maintenance preflight only. They do not replace the native in-session check.

## Canvas runtime constraints

Aligned with upstream [`docs/canvas-runtime.md`](https://github.com/oalanicolas/claude-design-premium/blob/main/docs/canvas-runtime.md).

**Works in canvas:** static HTML/CSS, CSS custom properties, vanilla JS, self-contained UMD/IIFE
globals via `<script src>`, native DS hooks (`_ds_manifest.json`, `check_design_system`), reading and
**writing project files** (including auto-setup).

**Does NOT work in canvas:** `git`, `npm install`, package scripts, lint, tests, builds, dev servers
(Vite/Next/Astro), ESM imports/bare specifiers, bundler-dependent modules, shell execution.

**Scripts nuance:** `node scripts/*.mjs` works **outside** the canvas with plain Node (no npm packages).
It does **not** run inside Claude Design Web — there is no shell. Auto-setup is the in-canvas
equivalent: you read `_ds/` and write `BOUND_DS.json`, `styles.css`, `DESIGN.md`, and patch DCs.

React/JSX only as in-browser escape hatch (UMD React + Babel + `window` globals). Prefer vanilla JS.

When starting from an empty canvas, write the root `CLAUDE.md` first, then scaffold static files, then
ask opening questions before generating visual work. If a readable source starter folder is available,
replicate its real files instead of recreating code from memory.

## Token truth

- The active token source is the bound DS: `BOUND_DS.json` → `globalCssPaths` (+ its `styles.css`),
  re-exported by root `styles.css`. This is the single source of truth in the canvas.
- Every color, spacing, type, radius, elevation, and motion value must be a `var(--*)` token from
  that graph. Never invent values; never hard-code hexes the tokens already define.
- To change a token value, edit the file under the bound DS token directory — not root `styles.css`
  (a re-export) and not `DESIGN.md` (interpretation only).
- Canvas CSS cannot import JSON; there is no JSON token runtime. The DS CSS is authoritative.

## Building in this project

Every deliverable is a **Design Component** (`Name.dc.html`). To use the bound DS, load its bundle
once at the top of the template, then mount components from the namespace. Copy the `<helmet>` block
from `Starter.dc.html` or `ds-helmet.snippet.html`:

    <helmet>
      <!-- CSS paths from BOUND_DS.json → globalCssPaths -->
      <link rel="stylesheet" href="[BOUND_DS.root]/tokens/fonts.css">
      ...
      <script src="[BOUND_DS.bundle]"></script>
      <!-- Suppress bundle-injected site chrome if BOUND_DS.json lists chromeSelectors -->
      <style>[chromeSelectors]{display:none !important;}</style>
    </helmet>

Then mount:
`<x-import component-from-global-scope="[BOUND_DS.namespace].Button" hint-size="auto,40px">Label</x-import>`.

Read `BOUND_DS.json` → `components` for the full component inventory. Read the bound DS readme
(`BOUND_DS.json` → `readme`) for component voice, variants, and brand-specific patterns.

**Gotcha:** `x-import` treats `name` as a reserved attribute (it aliases the export name), so it is
NOT forwarded as a prop. Components that take a `name` prop (e.g. `Icon`, `Avatar`) cannot receive
`name` through `x-import`. Render those via DS output classes instead (see `Starter.dc.html` for the
pattern used with this DS). Every other component is fine through `x-import`.

## Skill inventory

- `harness-auto-setup`: **mandatory on first turn** when harness is unbound — inventories repo,
  discovers `_ds/`, writes binding artifacts, synthesizes `DESIGN.md`, patches all DC templates.
- `brief-framing`: classifies the surface, captures missing context, and prevents premature invention.
- `design-system-guardian`: checks `DESIGN.md` + active token CSS. Almost always first.
- `visual-originality-audit`: catches generic template reflexes and category clichés.
- `ui-audit`: hierarchy, composition, rhythm, clarity, IA, and empty/loading/error states.
- `polish-phase`: microcopy, alignment, subtle motion, and perceived premium quality.
- `text-integrity-audit`: checks UI copy, docs, prompts, reports, and public text for generic wording,
  weak voice, and banned typography.
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
| **Any message when harness is unconfigured** (`GO`, greeting, anything) | `skills/harness-auto-setup.skill.md` | Run full setup **before** anything else; write all files; synthesize DESIGN.md; patch DCs; report `HARNESS AUTO-SETUP`. |
| Bootstrap validation explicitly requested | `CLAUDE.md` | Include `CDP-CLAUDE-OK` once and state whether routing appears loaded. |
| New project, unclear audience/brand/first surface, or reference files without instructions | `skills/brief-framing.skill.md`, `BOUND_DS.json`, `DESIGN.md` | Classify the surface and ask only blocking questions before visual generation. |
| Any UI generation, modification, or review | `BOUND_DS.json`, `DESIGN.md`, bound DS token CSS, `skills/design-system-guardian.skill.md` | Anchor every decision in DESIGN.md + bound DS tokens; load `_ds_bundle.js` and compose namespace components — never restyle raw HTML to imitate them. |
| Starting a new deliverable (screen, deck, doc, prototype) | `Starter.dc.html`, `ds-helmet.snippet.html`, `DESIGN.md` | Build a `Name.dc.html` that loads the bundle in `<helmet>`; copy the load block from `Starter.dc.html`. |
| Static / plain-CSS canvas output | bound DS token CSS (via root `styles.css`) | Use `var(--*)` tokens only; no JSON import, npm, ESM, or bundler. |
| Canvas prototype needs React state/interaction | `CLAUDE.md` § Canvas runtime constraints | DCs already render React; for escape-hatch pages use UMD React + Babel + `window` globals only. |
| New page, major layout, visual direction, landing, dashboard, app shell, specimen, or component | `skills/visual-originality-audit.skill.md`, `skills/ui-audit.skill.md` | Check originality and UI quality before polish. |
| Public copy, docs, prompt library, README, skill text, deck/UI text | `DESIGN.md`, `skills/text-integrity-audit.skill.md` | Match product voice from DESIGN.md; check specificity, punctuation, and generic wording before final. |
| Existing approved direction that needs refinement | `skills/polish-phase.skill.md` | Refine without redesigning the structure. |
| External implementation code or Tailwind handoff exists | `skills/tailwind-audit.skill.md` | Audit classes only outside the canvas/static-design loop. |
| Mobile readiness or final review | `skills/mobile-first-audit.skill.md` | Check responsive behavior before final. |
| Accessibility readiness or final review | `skills/accessibility-audit.skill.md` | Check accessibility and include the no-certification disclaimer. |
| Componentization, export, Astro, Vite, Next, or handoff | `skills/framework-handoff.skill.md` | Produce a framework-neutral inventory first; target a framework only after canvas direction is approved. |
| DS binding missing or `_ds/` changed | `skills/harness-auto-setup.skill.md` | Re-run auto-setup in canvas (write files). Outside canvas: `node scripts/bootstrap-harness.mjs`. |

Never invent tokens when the bound DS tokens provide them. Never mark a screen or component final
until both mobile-first and accessibility checks were applied. If a task conflicts with `DESIGN.md`
or the bound DS tokens, flag the conflict before proceeding.

## What "enforce" means here

Enforcement is **procedural and reviewable**, not deterministic. You are explicitly instructed to
check the work against `CLAUDE.md`, `BOUND_DS.json`, `DESIGN.md`, the bound DS tokens, and the
relevant procedures, then report what you applied or skipped. Human review is still required.

## Reporting

Output the block below at the end of responses that **deliver or review** UI: a new screen, a major
layout/direction change, an explicit audit/review, or a final/handoff step:

```markdown
## SKILLS APPLIED
- [skill name]: [yes/no]: [brief reason]

## NOT APPLIED
- [skill name]: [why it was not relevant or was skipped]

## NEXT RECOMMENDED
- [one skill or action that would improve the result further]
```

For small iterative microadjustments (one tweak: a color, a spacing value, a label), skip the full
block and add a single line noting what changed and any check you skipped. This keeps iteration fast
and avoids the context-pressure noise of a full report on every turn. Never silently drop the block on
a delivery or audit: there it is the transparency mechanism that makes the protocol trustworthy.

## Safety guardrails

- Inside Claude Design Web nothing executes as shell code: this file, `.skill.md` files, `DESIGN.md`,
  `BOUND_DS.json`, the `_ds/` design system, and `scripts/*.mjs` are read as instructions/markup/browser
  artifacts, never package scripts.
- Never run shell commands, `npm install`, package scripts, or network calls from inside the canvas.
  Repo-side `scripts/*.mjs` are optional maintenance helpers (Node built-ins only, no npm packages);
  they run outside the canvas when a human maintainer chooses — never claim the canvas ran them.
- Do not read, request, or transmit secrets, environment variables, tokens, or credentials.
- Do not send project data to external services.

## Failure-mode awareness

If a very large `DESIGN.md` or many skills are loaded at once, context pressure rises and instructions
may be ignored. In that case: keep only the most relevant skills loaded, prioritize
`design-system-guardian` + one audit skill per turn, and never silently drop the reporting block on a delivery or audit.

This protocol exists to create **repeatable, auditable, premium design execution**: not to make the
model do everything at once. Selectivity is the feature.