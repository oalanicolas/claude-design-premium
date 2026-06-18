# Validation Method

These are reproducible tests to confirm that root `CLAUDE.md` routing, native Claude Design hooks,
and document-backed procedures behave as intended.

> Note: results depend on the model and on context state. These tests check for **expected behavior**,
> not guaranteed determinism. See `LIMITATIONS.md`.

## Test 1: native design-system proof

Inside Claude Design, run the native design-system check after adding the starter files.

**Expected for the greenfield starter path:** `check_design_system` reports no issues, Claude Design
detects tokens from CSS, at least one native template appears from `templates/<slug>/index.html`, and
at least one component resolves in the design-system namespace.

For brownfield exports, the strongest proof may instead be a clean manifest with populated
`globalCssPaths`, `tokens`, and `cards` from the existing `preview/*.html` / `ui_kits/*` structure.

This is the strongest proof. Repo-side scripts are only preflight.

## Test 1B: root `CLAUDE.md` canary

Start a fresh Claude Design Web project with `CLAUDE.md` at the project root/context and explicitly
ask for bootstrap validation. The response should contain the built-in canary:

```text
CDP-CLAUDE-OK
```

**Pass:** the canary string appears. **Fail:** the root bootstrap may not have loaded; paste
`activation-prompt.md` as fallback and check that the files are still in project context. Do not ask
Claude to include the canary in every normal first response.

## Test 1C: seed bootstrap does not become visual reference

In an empty Claude Design Web canvas, attach `CLAUDE-DESIGN-SEED.md` and prompt:

```text
Use CLAUDE-DESIGN-SEED.md.
Create the root CLAUDE.md first, then scaffold the static design-system structure.
Do not generate the visual design yet.
After the structure exists, ask the opening questions.
```

**Expected:** Claude creates or proposes `CLAUDE.md`, `DESIGN.md`, `starter-kit/static/tokens.css`,
native `templates/`, optional component sidecars in `components/`, `skills/`, and a static HTML/CSS/JS scaffold
before generating any screen. It should explicitly avoid designing from the seed page itself.

## Test 1D: native template format

Open or ask Claude to inspect `templates/page-base/index.html`, `templates/landing/index.html`, and
`templates/deck/index.html`.

**Expected for this greenfield starter:** The first line uses
`<!-- @template name="..." description="..." -->`, styles are token-backed through root
`styles.css`, and the shared script is plain browser JS from `templates/ds-base.js` that loads
`styles.css` and `_ds_bundle.js`.

Brownfield Claude Design exports may not have `styles.css`. In those projects, validate against the
existing CSS graph from `_ds_manifest.json.globalCssPaths`, commonly `colors_and_type.css`.

## Test 1E: native component + specimen format

Open or ask Claude to inspect `components/Botao.jsx`, `components/Botao.d.ts`, and
`components/Botao.html`.

**Expected for this greenfield starter proof:** The component uses a named `export`, does not
manually assign `window.<Namespace>`, has a `.d.ts` contract, and the sidecar card contains an
`@dsCard` marker. The sidecar must not load raw `.jsx`; the current example keeps a static fallback
and can opportunistically read the generated namespace when the live environment provides it.

## Test 1F: optional React escape hatch

Open or ask Claude to inspect `starter-kit/static/react-example/`.

**Expected:** React is loaded through fixed UMD script tags, Babel standalone is loaded in-browser,
the component file uses no `import` or `export`, and the component is exposed on `window`.

## Test 1G: optional global script pattern

Open or ask Claude to inspect `starter-kit/static/global-script-example/`.

**Expected:** `index.html` loads `widget.js` with a plain `<script src>`, `widget.js` uses no
`import`, `export`, or `type="module"` pattern, and the script exposes `window.CDPGlobalWidget`.

## Test 1H: local deterministic validation

Outside Claude Design Web, from this repository root, run:

```bash
node scripts/context-signals.mjs
node scripts/generate-design-tokens.mjs --check
node scripts/detect-canvas-antipatterns.mjs starter-kit/static
node scripts/detect-text-antipatterns.mjs README.md docs skills
node scripts/detect-canvas-antipatterns.mjs templates
node scripts/validate-cdp.mjs
```

**Expected:** `context-signals.mjs` prints JSON, the token generator reports that JSON is in sync
with CSS, the detectors report no P1 findings for the static scaffold, native templates, and text
files, and `validate-cdp.mjs` exits cleanly.

The anti-pattern detector treats P1 findings as failing checks and P2 findings as review notes. Use
`--strict` when you want P2 findings to fail local preflight. Native `@dsCard` specimens are exempt
from public-page title/lang/viewport requirements because Claude Design uses the marker metadata for
the card preview.

The text detector uses the same severity model: P1 means hard voice/style bans; P2 means review.

## Test 2: skill routing

Keep `CLAUDE.md` and `skills/polish-phase.skill.md` in project context. Prompt:

```text
Polish this landing page and report which skills were applied.
```

**Expected:**

```text
SKILLS APPLIED:
- polish-phase: yes
```

The full reporting block is required for audits, deliverables, final approval, and handoff. Tiny
targeted tweaks may use a shorter note to reduce context noise.

## Test 2B: brief framing

Keep `CLAUDE.md` and `skills/brief-framing.skill.md` in project context. Prompt:

```text
Create a design system for my new product. I have not defined the audience or first surface yet.
```

**Expected:** Claude does not generate visuals immediately. It classifies or asks for the surface,
identifies blocking context, and reports `brief-framing` under `SKILLS APPLIED`.

## Test 2C: visual originality

Keep `CLAUDE.md` and `skills/visual-originality-audit.skill.md` in project context. Prompt:

```text
This landing page feels generic. Run the originality check before polish.
```

**Expected:** Claude identifies category clichés or says none were found, recommends targeted
changes, and reports `visual-originality-audit` under `SKILLS APPLIED`.

## Test 3: selective routing

With all skills available, prompt:

```text
Create three visual directions only. Do not write code.
```

**Expected:** `tailwind-audit` is not loaded for static canvas work and may be reported under NOT
APPLIED, e.g.:

```text
NOT APPLIED:
- tailwind-audit: no implementation code exists yet.
```

## Test 4: final approval gate

Prompt:

```text
Mark this screen as final.
```

**Expected:** Claude applies or recommends both:

- `mobile-first-audit`
- `accessibility-audit`

It must not declare the screen final without these two checks.

## Interpreting results

- All tests pass -> the protocol is loaded and routing selectively.
- Test 1 fails -> the root bootstrap is not in context; add `CLAUDE.md` again and use the activation prompt fallback.
- Tests 2-4 fail while Test 1 passes -> context pressure or prompt phrasing; reduce loaded skills and
  re-run (see the failure-mode note in `CLAUDE.md`).
