# Claude Design Premium Protocol

You operate inside **Claude Design Web** under a document-backed premium UI protocol.

Claude Design Web has a fixed, closed set of native product Skills. This starter does not install new
native Skills. Instead, this root `CLAUDE.md` acts as the bootstrap file, and the `.skill.md` files
are **documental procedures**: reusable operating instructions that you apply when relevant. Apply
only the procedures relevant to the current task. Do not run every procedure automatically.

## Core context

- `CLAUDE.md`: workflow, routing, and behavior rules (this file).
- `DESIGN.md`: visual identity, layout principles, and aesthetic constraints.
- `styles.css`: greenfield starter CSS facade for Claude Design's native compiler.
- `starter-kit/static/tokens.css`: greenfield starter token source for color, spacing, typography, radius, elevation, and motion in the canvas.
- Brownfield exports may instead use existing CSS entries such as `colors_and_type.css`; inspect `_ds_manifest.json.globalCssPaths` and preserve the existing token source.
- `design-tokens.json`: generated/reference token artifact for documentation and later handoff.
- `skills/*.skill.md`: document-backed procedures for design-system enforcement, audits, polish, implementation review, and final checks.
- `templates/<slug>/index.html`: optional native Claude Design template track for greenfield starter work.
- `components/*.jsx` + `components/*.d.ts`: optional native component examples exported for the compiler.
- `components/<Name>.html` or `preview/*.html`: native `@dsCard` specimens, depending on project shape.
- `starter-kit/static/`: optional static HTML/CSS/JS scaffold for the Claude Design Web canvas.
- `starter-kit/`: optional portable patterns for later Astro, Vite, or Next implementation.
- `CLAUDE-DESIGN-SEED.md`: optional one-shot bootstrap seed for an empty Claude Design Web canvas.

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

- Tokens: use the existing CSS token source. In this starter, that is root `styles.css` importing
  `starter-kit/static/tokens.css`; in brownfield exports, it is often `colors_and_type.css` or the CSS
  files listed in `_ds_manifest.json.globalCssPaths`.
- Templates: when using the greenfield template track, prefer `templates/<slug>/index.html` with
  `<!-- @template name="..." description="..." -->` near the top.
- Specimen cards: use `@dsCard`. Greenfield component examples can colocate sidecars such as
  `components/Botao.html`; brownfield exports often use `preview/*.html` and `ui_kits/*/index.html`.
- Components: when using namespace components, use `.jsx` + `.d.ts` files with named exports and let
  the compiler expose the generated namespace. Do not assume every export uses this path.
- Live proof: run Claude Design's native `check_design_system` when available.

Repo-side scripts are maintenance preflight only. They do not replace the native in-session check.

## Canvas runtime constraints

Claude Design Web is a static authoring and preview canvas for this workflow. Do not try to run git,
package installs, package scripts, lint, tests, Vite, Next, Astro, or any dev server inside the
canvas. Use direct HTML/CSS/browser JS first. Treat Astro, Vite, and Next as later handoff targets.
Do not use `starter-kit/index.js`, ESM imports/exports, npm packages, or bundler-dependent modules
inside the canvas. Self-contained UMD/IIFE globals may be loaded with `<script src>` if they were
built outside the canvas and expose their API on `window`.

React/JSX is allowed only as an in-browser escape hatch: fixed React/ReactDOM UMD script tags +
Babel standalone + `<script type="text/babel">`. Do not use npm imports or bundler-style module
graphs in the canvas. For portable starter examples, expose reusable components on `window`; in
observed Claude Design UI kits, Babel scripts may also share globals within the page. Prefer vanilla
JS unless real component state or interaction justifies React.

The `scripts/` directory contains local repo-side validation helpers. They are useful before handoff
or when maintaining this starter, but they do not run inside Claude Design Web.

When starting from an empty canvas, write the root `CLAUDE.md` first, then scaffold static files, then
ask opening questions before generating visual work. If a readable source starter folder is available,
replicate its real files instead of recreating code from memory.

## Token truth

- In greenfield projects created from this starter, `starter-kit/static/tokens.css` is the initial
  active source of token values.
- In brownfield Claude Design exports, do not impose `styles.css` as the token source. Use the
  existing CSS token file, commonly `colors_and_type.css`, and verify it against
  `_ds_manifest.json.globalCssPaths`.
- Static canvas pages must use CSS custom properties from the active token CSS file.
- Canvas CSS cannot import JSON. `design-tokens.json` exists for documentation and later
  Astro/Vite/Next handoff; it is generated from the active token CSS outside the canvas.
- When maintaining this repo, change `tokens.css` first, then run
  `node scripts/generate-design-tokens.mjs --write` outside Claude Design Web.

## Skill inventory

- `brief-framing`: classifies the surface, captures missing context, and prevents premature invention.
- `design-system-guardian`: checks `DESIGN.md` + active token CSS. Almost always first.
- `visual-originality-audit`: catches generic template reflexes and category clichés.
- `ui-audit`: hierarchy, composition, rhythm, clarity, IA, and empty/loading/error states.
- `polish-phase`: microcopy, alignment, subtle motion, and perceived premium quality.
- `text-integrity-audit`: checks UI copy, docs, prompts, reports, and public text for generic wording,
  weak voice, and banned typography.
- `mobile-first-audit`: responsive behavior, breakpoints, and touch targets.
- `accessibility-audit`: contrast, semantics, keyboard, focus, and reduced motion.

Handoff / code-phase skills (not part of the canvas design loop: see `docs/canvas-core.md`):

- `tailwind-audit`: class quality and token adherence. Only when Tailwind/code exists (needs a build, so it runs in the repo, not the canvas).
- `framework-handoff`: component inventory and Astro/Vite/Next handoff planning after the canvas direction is approved.

## Literal routing table

Before acting, match the user's request to the first relevant triggers below and READ the listed
files. Do not assume `DESIGN.md`, the active token CSS, generated token JSON, or
`.skill.md` files are already in working context unless you have read them in the current task.

| Trigger | Read before acting | Required behavior |
|---|---|---|
| Bootstrap validation explicitly requested | `CLAUDE.md`, `docs/validation-method.md` | Include `CDP-CLAUDE-OK` once and state whether routing appears loaded. |
| Empty canvas bootstrap or seed attached | `CLAUDE-DESIGN-SEED.md` | Create `CLAUDE.md`, `DESIGN.md`, `starter-kit/static/tokens.css`, native `templates/`, optional `components/` sidecars, and `skills/` before visual design. |
| Existing/brownfield Claude Design export | `docs/legacy-claude-design-exports.md`, `_ds_manifest.json`, existing root CSS files such as `colors_and_type.css` | Preserve the existing CSS token source and `preview/*.html` cards. Do not introduce `styles.css` as token source unless the user explicitly asks for a migration facade. |
| New project, unclear audience, unclear brand, unclear first surface, or reference files without instructions | `skills/brief-framing.skill.md` | Classify the surface and ask only blocking questions before visual generation. |
| Any UI generation, modification, or review | `DESIGN.md`, active token CSS (`starter-kit/static/tokens.css` or brownfield `colors_and_type.css`), `skills/design-system-guardian.skill.md` | Anchor visual decisions in documented principles and CSS token values. |
| Static canvas HTML/CSS/JS output | `starter-kit/static/README.md`, active token CSS | Use CSS custom properties; do not import JSON, npm packages, ESM modules, or bundler-dependent files. |
| Greenfield native template requested | `docs/native-claude-design-alignment.md`, `templates/<slug>/index.html`, `templates/ds-base.js` | Use the starter's `templates/<slug>/index.html` pattern and verify it with `check_design_system` when available. |
| Greenfield namespace component requested | `docs/native-claude-design-alignment.md`, `components/Botao.jsx`, `components/Botao.d.ts`, `components/Botao.html` | Use named exports; do not assign namespaces manually; keep the `@dsCard` thumbnail beside the component. |
| Legacy specimen or UI kit requested | `docs/native-format-reference.md`, existing `preview/*.html`, existing `ui_kits/*` | Preserve the observed brownfield pattern; do not convert it to templates/components unless asked. |
| Canvas prototype needs React state/interaction | `starter-kit/static/react-example/README.md` | Use only UMD React + Babel standalone + `window` globals; no imports, exports, npm, or bundler. |
| Canvas prototype uses a prebuilt global script | `starter-kit/static/global-script-example/README.md` | Use only self-contained UMD/IIFE-style globals loaded by `<script src>`; no ESM internals or package resolution. |
| New page, major layout, visual direction, landing page, dashboard, app shell, design system specimen, or component | `skills/visual-originality-audit.skill.md`, `skills/ui-audit.skill.md` | Check originality and UI quality before polish. |
| Public copy, docs, prompt library, README, skill text, deck text, or visible UI text | `DESIGN.md`, `skills/text-integrity-audit.skill.md` | Check text job, voice source, specificity, punctuation, and generic wording before final. |
| Existing approved direction that needs refinement | `skills/polish-phase.skill.md` | Refine without redesigning the structure. |
| External implementation code or Tailwind handoff exists | `skills/tailwind-audit.skill.md` | Audit classes only outside the canvas/static-design loop. |
| Mobile readiness or final review | `skills/mobile-first-audit.skill.md` | Check responsive behavior before final. |
| Accessibility readiness or final review | `skills/accessibility-audit.skill.md` | Check accessibility and include the no-certification disclaimer. |
| Componentization, modularization, export, Astro, Vite, Next, or handoff | `skills/framework-handoff.skill.md`, `starter-kit/README.md` | Produce a framework-neutral inventory first; target Astro/Vite/Next only after canvas design is approved. |

Never invent tokens when the active token CSS provides them. Never mark a screen or component final
until both mobile-first and accessibility checks were applied. If a task conflicts with `DESIGN.md`,
the generated token JSON, or the active token CSS, flag the conflict before proceeding.

## What "enforce" means here

Enforcement is **procedural and reviewable**, not deterministic. You are explicitly instructed to
check the work against `CLAUDE.md`, `DESIGN.md`, the active token CSS, optional generated token JSON,
and the relevant procedures, then report what you applied or skipped. Human review is still required.

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
  `design-tokens.json`, `templates/`, `components/`, and `starter-kit/static/` are read as
  instructions/markup/browser artifacts, never package scripts.
- Never run shell commands, package installs, or network calls from inside the canvas. A skill may
  reference an optional repo-side script (e.g. `scripts/detect-canvas-antipatterns.mjs`); those run
  only outside the canvas, in your repo, when you choose to.
- Do not read, request, or transmit secrets, environment variables, tokens, or credentials.
- Do not send project data to external services.

## Failure-mode awareness

If a very large `DESIGN.md` or many skills are loaded at once, context pressure rises and instructions
may be ignored. In that case: keep only the most relevant skills loaded, prioritize
`design-system-guardian` + one audit skill per turn, and never silently drop the reporting block on a delivery or audit.

This protocol exists to create **repeatable, auditable, premium design execution**: not to make the
model do everything at once. Selectivity is the feature.
