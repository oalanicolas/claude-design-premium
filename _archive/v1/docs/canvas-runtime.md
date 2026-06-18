# Claude Design Web Canvas Runtime

How the Claude Design Web preview actually executes code, and what that means for this starter kit.
Treat the canvas as a **static authoring and preview bench**, not a repo runtime.

> **Evidence tiers:** `[OFFICIAL]` Anthropic announcement/docs · `[SECONDARY]` reputable independent
> coverage / hands-on reports · `[INFERENCE]` reasoned from the Claude Artifacts sandbox model ·
> `[USER-VERIFIED]` confirmed by direct testing in Claude Design · `[AGENT-OBSERVED]` confirmed by
> repeated operation inside Claude Design sessions. Anything outside these tiers is marked uncertain.
> The Claude Design space is full of fabricated specifics, so claims here are scoped to what survived
> verification.

## Honesty note (read first)

Anthropic has **not** published a runtime-level spec for the Claude Design canvas. The closest
documented analog is the **Claude Artifacts** sandbox, which the canvas appears to inherit. The runtime
facts below are therefore best-available `[SECONDARY]`/`[INFERENCE]`, corroborated by direct testing: not an official Claude Design contract. Re-verify per project with `validation-method.md`.

## What works inside the canvas

- **Static HTML**, rendered directly. `[SECONDARY]`
- **Linked CSS** (`<link rel="stylesheet">`) and **CSS custom properties**. `[SECONDARY]`
- **Vanilla browser JavaScript** (plain `<script>`, DOM APIs, IIFEs). `[SECONDARY]`
- **Self-contained UMD/IIFE/global browser scripts** loaded with `<script src>` and exposing
  `window.X`, if the file was built outside the canvas and does not contain ESM internals,
  `import.meta`, npm package resolution, or brittle relative path assumptions. `[AGENT-OBSERVED]`
- **React/JSX in-browser** when loaded through fixed React/ReactDOM UMD scripts plus Babel
  standalone and `<script type="text/babel">`. Use `window` globals for portable starter examples;
  observed Claude Design UI kits may also share Babel globals within a page. `[USER-VERIFIED]`
- **Direct manipulation** of files Claude Design creates in the project. `[SECONDARY]`
- **Native design-system hooks** such as CSS token extraction, `templates/<slug>/index.html`,
  `@dsCard` specimen cards, component namespace registration, and `check_design_system` validation.
  `[USER-VERIFIED]`
- **Reading inputs**: text prompts, image/screenshot uploads, document uploads (DOCX, PPTX, XLSX),
  pointing Claude at a codebase, and a **web capture** tool that grabs elements from a live site.
  `[OFFICIAL]`
- **Reading/replicating** an accessible reference project or folder the user provides. `[OFFICIAL:   "point Claude at your codebase"; exact path syntax unverified]`

## What does NOT run inside the canvas

- `git init` / `git clone` / commits / branches / any repo operation. `[INFERENCE + USER-VERIFIED]`
- `npm install`, package scripts, lint, tests, or build commands. `[INFERENCE + USER-VERIFIED]`
- `vite dev`, `next dev`, `astro dev`, or any local dev server. `[INFERENCE + USER-VERIFIED]`
- **Bundler-dependent output** that still contains ESM imports, `import.meta`, bare specifiers, npm
  package resolution, Node assumptions, or path assumptions that resolve differently from the HTML
  document. `[AGENT-OBSERVED]`
- **ES module imports / bare specifiers / bundler imports.** `import React from 'react'` and
  `import { X } from './x.jsx'` do not resolve as a normal repo module graph. `[SECONDARY]`
- **Repo-style JSX/React component imports as the scaffold runtime.** The kit's `.jsx` files and
  `starter-kit/index.js` are repo-source for the external build, never a canvas runtime path.
  `[USER-VERIFIED]`
- npm package imports or any path that needs Node resolution at preview time. `[INFERENCE]`

## Why ESM imports fail, and when global bundles work

The preview is iframe-based and does not provide a Node/bundler module graph. Bare specifiers such as
`react`, repo-style imports such as `./Component.jsx`, and package-resolution assumptions do not
become browser-ready automatically. Each `<script type="text/babel">` is transpiled in its own scope,
so separate JSX files do not share `import`/`export`. To share code between scripts, attach
components or helpers to `window`. `[USER-VERIFIED]`

Consequences for this kit:

1. A self-contained UMD/IIFE/global script loaded by `<script src>` can work in the canvas when it
   exposes `window.<Namespace>` and contains no internal ESM, `import.meta`, npm resolution, or
   wrong relative-path assumptions. See `starter-kit/static/global-script-example/`.
2. A generated bundle fails when it still expects a module graph, dev server, import map, package
   resolver, or asset paths that differ from the HTML document location.
3. The starter kit's React `.jsx` files (with `import`s) target the **external repo build**
   (Astro/Vite/Next) only.
4. In-browser JSX works as an escape hatch, but it must follow the UMD+Babel pattern. See
   `starter-kit/static/react-example/`. The default kit still authors plain HTML/CSS/vanilla JS
   because that path is lighter and migrates cleanly afterward.

## Recommended authoring pattern (canvas-safe)

Author canvas output as **static HTML + CSS custom properties + vanilla JS**: the only reliably
low-friction path, and the one that migrates cleanly to any framework later. Use React/JSX only when
stateful interaction makes it worth the extra runtime.

- **Tokens** -> CSS custom properties in the active token CSS (see Token runtime below).
- **Native templates** -> `templates/<slug>/index.html` with
  `<!-- @template name="..." description="..." -->` when the design system should expose starter
  templates in Claude Design.
- **Portable fallback templates** -> `starter-kit/static/templates/*.html` when you only need static
  files outside the native template track.
- **Behavior** -> small vanilla scripts like `starter-kit/static/assets/js/boot.js` (IIFE, DOM only,
  no imports), with data in a `window` global like `assets/config/site.js`.
- **Optional global script** -> `starter-kit/static/global-script-example/` for a self-contained
  `window.X` pattern.
- **React escape hatch** -> `starter-kit/static/react-example/` for UMD React + Babel standalone +
  `window` globals.

Use Claude Design Web for: authoring the static system, previewing HTML/CSS/JS, validating visual
direction / responsiveness / accessibility heuristics, and extracting a reusable component inventory.
For design-system proof, prefer the native `check_design_system` gate over repo-side scripts.

Move to an **external repo** for: Astro/Vite/Next implementation, package management, lint/tests/CI,
build gates, and real accessibility/performance validation. The real build never lives in the canvas.

## Network and storage

The Artifacts sandbox enforces a **strict Content Security Policy** that limits and controls network
access (an allowlist, to prevent data exfiltration), and sandboxed-iframe JS cannot escape or disable
that CSP. `[SECONDARY]` Practical rule: do **not** rely on arbitrary external URLs or CDNs in canvas
output; treat outbound network as restricted. `localStorage` is available in observed Claude Design
sessions, but persistence/reset behavior can vary, so wrap storage access in `try/catch` and do not
make critical design data depend on it. `[AGENT-OBSERVED]`

## Inputs and reading a source folder

- Confirmed inputs: text, image/screenshot upload, document upload (DOCX/PPTX/XLSX), codebase
  pointing, and web capture. `[OFFICIAL]`
- Pointing at a codebase: Claude reads real tokens, colors, typography, component patterns, and
  spacing at the code level; onboarding can build a reusable team design system from codebase + design
  files, and later projects reuse it automatically. `[OFFICIAL]`
- For this kit's bootstrap, **cross-project replication** relies on that documented "point Claude at
  your codebase/files" capability. A community-claimed `/projects/<id>/` path-access syntax **did not
  verify**: rely on the capability, not on an exact path format. `[UNCERTAIN]`

## Exports and handoff

- Export targets: standalone **HTML**, **ZIP**, **PDF**, **PPTX**, **Canva**, and an internal **URL
  share**. `[OFFICIAL/SECONDARY]`
- Handoff: when a design is ready to build, Claude packages everything into a **handoff bundle** you
  pass to **Claude Code** with a single instruction. Claude Design itself does not implement the
  production build. `[OFFICIAL]`
- Refuted: handoff is **not** done by passing a URL pointing at the prototype's files. `[killed 0-2]`

## Bootstrap pattern (empty canvas)

An empty Claude Design Web project cannot start from an uploaded folder, so:

- **Seed file**: attach `CLAUDE-DESIGN-SEED.md` and ask Claude to create the structure (write root
  `CLAUDE.md` first, then the static scaffold, then ask opening questions).
- **Cross-project replication**: point Claude at a readable source starter project/folder and ask it
  to replicate the real files (do not reinterpret from memory).
- **Hybrid (strongest)**: the seed gives the governance/brain; the source project gives the proven
  files.

## Token runtime

- In this starter's greenfield scaffold, `starter-kit/static/tokens.css` is the initial active token
  source for the canvas.
- In brownfield Claude Design exports, use the existing CSS token source instead, commonly
  `colors_and_type.css` or the files listed in `_ds_manifest.json.globalCssPaths`.
- The canvas **cannot import JSON into CSS**, so static pages consume CSS custom properties from
  the active token CSS file.
- `design-tokens.json` is a generated/reference artifact for documentation and Astro/Vite/Next
  handoff. Outside the canvas, regenerate it from CSS with
  `node scripts/generate-design-tokens.mjs --write`.

## Access

Claude Design is a paid-plan research preview (Pro / Max / Team / Enterprise via the Claude web app;
Pro from $20/mo). Free users do not have it. `[OFFICIAL/SECONDARY]`

## Uncertain / deliberately not asserted

- Whether the canvas is *literally* the Artifacts iframe (same CSP and CDN allowlist): used as the
  best available model, not confirmed.
- Exact allowed-CDN list, storage persistence/reset behavior, and the model version powering Claude
  Design.
- Specific usage/metering numbers (e.g. "exhausted in N minutes / N prompts"): unverified; do not
  quote.

## Sources

- `[OFFICIAL]` Anthropic: Claude Design announcement: https://www.anthropic.com/news/claude-design-anthropic-labs
- `[SECONDARY]` Pragmatic Engineer: How Anthropic built Artifacts (iframe sandbox + CSP): https://newsletter.pragmaticengineer.com/p/how-anthropic-built-artifacts
- `[SECONDARY]` Simon Willison: sandboxed iframe cannot escape a meta CSP: https://simonwillison.net/2026/Apr/3/test-csp-iframe-escape/
- `[SECONDARY]` MacStories: hands-on with the Claude Design preview: https://www.macstories.net/stories/hands-on-with-anthropic-labs-claude-design-preview/
- `[SECONDARY]` Anima / Muz.li / UX Pilot: feature, export, and access coverage (corroborating).
- `[COMMUNITY: used cautiously]` Runtime notes (no ES modules; per-script Babel scope; share via
  `window`): https://gist.github.com/hqman/f46d5479a5b663c282c94faa8be866de
