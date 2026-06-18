# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-06-14

### Changed

- Repositioned the project around Claude Design Web only.
- Renamed the operating file to `CLAUDE.md` to match the root bootstrap behavior validated in Claude
  Design Web.
- Reframed `.skill.md` files as document-backed procedures: not installed native Skills, but procedures routed
  by `CLAUDE.md`.
- Replaced implicit routing language with literal trigger -> READ rules in `CLAUDE.md`.
- Added the concrete `CDP-CLAUDE-OK` canary for root-load validation.
- Clarified that `starter-kit/index.js` and repo-style JSX modules are handoff assets, while
  in-browser React/JSX is allowed only through UMD React + Babel standalone.
- Clarified that self-contained UMD/IIFE global scripts can be loaded in the canvas, while
  bundler-dependent output remains a handoff/runtime concern.
- Moved `activation-prompt.md` to fallback status instead of the primary activation path.
- Replaced Claude Code setup with framework handoff guidance for Astro, Vite, and Next.
- Scoped the reporting block to deliverables, audits, final approval, and handoff so micro-tweaks do
  not add unnecessary context noise.
- Clarified `tailwind-audit` as an external implementation/handoff skill, not a normal canvas skill.
- Made `starter-kit/static/tokens.css` the greenfield canvas token source and changed
  `design-tokens.json.example` into a generated/reference artifact.
- Added root `styles.css` as the native design-system compiler entry.
- Corrected native templates to use `@template name="..." description="..."` and `ds-base.js`
  loading root `styles.css` plus `_ds_bundle.js`.
- Corrected `components/Botao.jsx` to use a named export and moved the `@dsCard` sidecar to
  `components/Botao.html`.
- Recalibrated `detect-canvas-antipatterns.mjs` after live-canvas testing: fixed negative tracking
  and transition parsing, split P1/P2 behavior, added review snippets and `--strict`, lowered noisy
  aesthetic tells to review notes, improved focus detection, ignored full pill radii, and exempted
  native `@dsCard` specimens from public-page title/lang/viewport requirements.
- Replaced the generic Inter + sky blue + zinc starter palette with a more opinionated, canvas-safe
  default token set.

### Added

- `docs/architecture.md` explaining the `CLAUDE.md` bootstrap architecture.
- `CLAUDE-DESIGN-SEED.md` for empty Claude Design Web canvas bootstrap without folder upload, git, or
  dev-server assumptions.
- `docs/canvas-runtime.md` documenting the static canvas contract and hybrid seed + cross-project
  replication flow.
- `docs/canvas-core.md` documenting the lean Claude Design Web context set versus repository
  distribution/handoff files.
- `docs/legacy-claude-design-exports.md` documenting the older Claude Design export shape built
  around `colors_and_type.css`, `preview/*.html` cards, and UI kits rather than native components.
- Brownfield guidance that keeps `colors_and_type.css` / `_ds_manifest.json.globalCssPaths` as token
  authority instead of forcing a root `styles.css` source-of-truth migration.
- `docs/framework-handoff.md` for post-design modularization.
- `starter-kit/` with portable tokens, static canvas scaffolds, components, patterns, and
  Astro/Vite/Next adapters.
- `starter-kit/static/tokens.css` as the greenfield CSS custom-property token source for static canvas
  output.
- `starter-kit/static/react-example/` as an optional canvas-safe React/JSX escape hatch.
- `starter-kit/static/global-script-example/` as an optional canvas-safe global script pattern.
- `scripts/generate-design-tokens.mjs` to generate/check `design-tokens.json.example` from
  `starter-kit/static/tokens.css`.
- `scripts/context-signals.mjs`, `scripts/detect-canvas-antipatterns.mjs`, and
  `scripts/validate-cdp.mjs` as deterministic repo-side maintenance checks.
- Stronger mobile, accessibility, polish, and layout skill procedures inspired by the deterministic
  + judgment split in Impeccable, without copying its engine or command system.
- `skills/brief-framing.skill.md` to classify surface type and capture blocking context before visual
  work.
- `skills/visual-originality-audit.skill.md` to catch generic template reflexes before
  polish.

## [0.1.0] - 2026-06-14

### Added

- Initial release of claude-design-premium (previously positioned as claude-design-skill-router). A document-backed premium UI operating layer.
- Central operating file (`CLAUDE.md`) with selective routing logic and mandatory reporting.
- Six foundational skills:
  - `design-system-guardian.skill.md`
  - `ui-audit.skill.md`
  - `polish-phase.skill.md`
  - `tailwind-audit.skill.md`
  - `mobile-first-audit.skill.md`
  - `accessibility-audit.skill.md`
- Strong example `DESIGN.md.example` and `design-tokens.json.example`.
- Activation prompt and supporting templates (`templates/CLAUDE.template.md`,
  `templates/design-md.template.md`, `templates/design-tokens.template.json`,
  `templates/new-skill.skill.md`).
- `PLAYBOOK.md`, `PROMPTS-LIBRARY.md`, `LIMITATIONS.md`, `SECURITY.md`.
- Docs: `how-it-works.md`, `claude-design-setup.md`, `framework-handoff.md`, `validation-method.md`,
  `skill-authoring-guide.md`.
- Examples for landing page, SaaS dashboard, and design system (with explicit TODO placeholders where
  visual proof is not yet attached).
- Contribution infrastructure (`CONTRIBUTING.md`, issue templates, PR template).
- English `README.md` and `README.pt-BR.md`.
- MIT License.

### Notes

This is the foundational release. The focus is on a tight, high-signal core rather than a large library of skills. Future versions will add curated skill packs and more examples with visual proof.

**Definition of Done for v0.1.0** was met:
- Central file is `CLAUDE.md`, selective and under ~150 lines. No `CLAUDE-ROUTER.md`.
- Every skill has Name, Purpose, When to use, Procedure, Output contract, Failure modes, Example invocation.
- All copy-paste artifacts are inert (natural language only; no shell, network, or credential handling).
- "Enforce" is documented as procedural and reviewable, not deterministic.
- Language contract respected: strong claims backed by structure that enables proof.
- No invented metrics or testimonials.
