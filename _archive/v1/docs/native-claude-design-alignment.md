# Native Claude Design Alignment

This document separates what Claude Design already provides from what this starter adds.

The practical rule:

```text
Use native Claude Design hooks first.
Add document-backed procedures only where the project needs its own taste, rules, or handoff logic.
```

## What Is Native Vs Project-Authored

| Layer | Claude Design native hook | This starter contributes |
|---|---|---|
| Project bootstrap | Root `CLAUDE.md` can be kept in project context and read every turn. | Routing rules, operating constraints, and project-specific procedure selection. |
| Native Skills | A fixed, closed set of Claude Design skills exists in the product. | No new native Skills. `.skill.md` files are document-backed procedures, not product Skills. |
| Tokens | The design-system compiler extracts tokens from the CSS graph it sees. In greenfield projects this can be root `styles.css`; in brownfield exports it is often `colors_and_type.css` or the files in `_ds_manifest.json.globalCssPaths`. | Root `styles.css` is only this starter's greenfield facade. Generated JSON is only for docs/handoff. |
| Templates | `templates/<slug>/index.html` with `<!-- @template name="..." description="..." -->` can appear as native templates. | `templates/page-base/`, `templates/landing/`, and `templates/deck/` as starter templates. |
| Specimen cards | `@dsCard` sidecar cards can appear in the Design System panel. | Example card under `components/Botao.html`, next to its `.jsx` and `.d.ts`. |
| Components | Exported component files can resolve into the generated design-system namespace when they follow the native contract. | Example `components/Botao.jsx` + `components/Botao.d.ts` + `components/Botao.html`, with named export and no manual namespace assignment. |
| Live validation | `check_design_system` is the native in-session gate. | Local scripts are maintenance preflight only; they do not replace the live gate. |
| Chrome / app shell | No project-specific chrome is provided by default. | Data-driven chrome patterns can remain project-authored when needed. |

Untouched legacy exports may not have root `styles.css`, templates, or native components. They often
use `colors_and_type.css` plus many `preview/*.html` `@dsCard` specimens instead. See
[`legacy-claude-design-exports.md`](legacy-claude-design-exports.md) before treating those projects as
broken.

## Native Skills Boundary

Claude Design does not let this starter install new native Skills. Treat the product skill list as
fixed. The observed/user-validated native skill set includes items such as:

- Animated video
- Interactive prototype
- Make a deck
- Make a doc
- Make tweakable
- Claude API in prototypes
- Frontend design
- Wireframe
- Export PPTX
- Create design system
- Save as PDF
- Save as standalone HTML
- Send to Canva
- Handoff to Claude Code

The files in `skills/*.skill.md` should therefore never be described as installed Skills. They are
small procedure documents routed by `CLAUDE.md`.

## De-Para: Old Starter Pattern To Native Pattern

| Old / weaker pattern | Native-aligned pattern | Status |
|---|---|---|
| `design-tokens.json` as runtime token truth | Active CSS custom-property token file as canvas source; JSON generated from CSS for docs/handoff | Keep generated JSON, not as runtime source |
| `starter-kit/static/templates/*.html` as invented template system | `templates/<slug>/index.html` with `<!-- @template name="..." description="..." -->` | Use native format |
| Repo-side validation as proof | `check_design_system` in Claude Design as proof; repo scripts as local preflight | Reframed |
| Mandatory first-response canary | Canary as setup diagnostic only | Reframed |
| Full reporting for every UI response | Checkpoint reporting for deliverables/audits/final/handoff | Reframed |
| `.skill.md` as if they were platform Skills | `.skill.md` as document-backed procedures | Keep, but name honestly |
| No root CSS entry in a greenfield starter | Root `styles.css` importing token and static CSS files | Greenfield convenience only |
| Brownfield export with `colors_and_type.css` | Keep the existing CSS token source and read `_ds_manifest.json.globalCssPaths` | Do not normalize by default |

## Proof Signals

To prove this starter is operating on the greenfield native track inside Claude Design, use these
signals:

1. `check_design_system` returns no issues.
2. At least one `templates/<slug>/index.html` template appears in the native template picker.
3. At least one component resolves in the design-system namespace.
4. Its `@dsCard` sidecar appears as the component thumbnail/specimen.

For a brownfield export, proof may look different: populated `cards[]`, `tokens[]`, `globalCssPaths[]`,
and valid `preview/*.html` / `ui_kits/*` entries may be the relevant native signals.

The local command `node scripts/validate-cdp.mjs` checks that the files needed for the greenfield
signals are
present and internally coherent, but it cannot prove the live Claude Design compiler accepted them.
Run the native check in Claude Design for that.

## Component Card Precision

For a component-specific starter proof, keep the `@dsCard` HTML beside the component it previews:

```text
components/Botao.jsx
components/Botao.d.ts
components/Botao.html
```

Do not put the component card in a separate `cards/` folder for this greenfield proof. Do not load
`Botao.jsx` directly from the card. `Botao.jsx` must use a named export; do not assign
`window.<Namespace>` by hand. Treat `_ds_bundle.js` as compiler-generated. Do not build authored card
behavior around manually loading it unless the current live project and `check_design_system` prove
that path is expected.

This is not the only valid `@dsCard` shape. Legacy and larger design systems can use group cards,
foundation cards, full-page cards, deck cards, or UI-kit cards. The hard contract is the `@dsCard`
marker and the generated manifest entry, not a one-card-per-component folder rule.

## Bundle Contamination Rule

Claude Design's native compiler can bundle all project JavaScript into `_ds_bundle.js`, not just the
registered component files. Keep a design-system project clean: tokens, components, component cards,
native templates, and small system helpers only. Put site/app runtime code in the consuming project,
not in the design-system source.

## What Remains Authored

The project-authored value is not the existence of tokens, templates, or validation hooks. Those are
native rails. The authored value is:

- the token values and visual stance;
- the `DESIGN.md` taste contract;
- the routing discipline in `CLAUDE.md`;
- the document-backed procedures in `skills/`;
- any project-specific chrome, data model, or content architecture.
