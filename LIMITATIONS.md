# LIMITATIONS: Honest Assessment

This section exists because we believe transparency builds trust faster than over-promising.

## What This Protocol Actually Does

The Claude Design Premium Protocol is a **context engineering pattern**. It works by:

- Using root `CLAUDE.md` as the lightweight Claude Design Web bootstrap.
- Loading relevant `.skill.md` documents into the model's context as document-backed procedures.
- Using clear routing rules and checkpoint reporting for deliverables, audits, final approval, and
  handoff.
- Anchoring generation in `DESIGN.md` + the bound DS token CSS under `_ds/` (or
  `starter-kit/static/tokens.css` in archived greenfield v1).

It **influences** model behavior through high-signal instructions and selective loading. It does **not** compile, sandbox, or runtime-enforce anything.

## What It Does NOT Do

- It does not guarantee that every output will perfectly follow your design system.
- It does not replace proper design system governance, component libraries, or design tokens in code.
- It does not run git, package installs, package scripts, lint, tests, builds, Vite, Next, Astro, or
  any dev server inside Claude Design Web.
- It does not run `starter-kit/index.js`, ESM imports/exports, npm package imports, or
  bundler-dependent modules inside Claude Design Web. Those are handoff assets for a real repo.
- It can load self-contained UMD/IIFE-style global scripts via `<script src>` when they expose API on
  `window`, but it cannot build them.
- It does not provide a Node/bundler React environment. React/JSX only works through in-browser UMD
  React + Babel standalone patterns.
- It does not certify accessibility or legal compliance. The accessibility skill is a **review checklist**, not a compliance engine.
- It does not prevent the model from hallucinating tokens or ignoring instructions when context pressure is high.
- It does not work equally well with every model or every prompt style. Results vary.
- It does not install new native Skills inside Claude Design Web. Claude Design has a fixed product
  Skill set; `.skill.md` files are document-backed procedures, not product Skills.
- Its deterministic scripts are repo-side maintenance helpers. Claude Design Web itself does not run
  them; use them before handoff or while maintaining the starter locally. They must remain
  dependency-free JavaScript using Node built-ins only.

## Known Weaknesses

1. **Context Window Pressure**  
   Loading too many skills + a large `DESIGN.md` can cause the model to start ignoring parts of the instructions. The protocol is designed to be selective precisely because of this.

2. **"Enforce" Is Procedural, Not Deterministic**  
   We use the word "enforce" because the goal is strong, repeatable application of the design system. In this repo, "enforce" means **procedural enforcement**: Claude is explicitly instructed to check against `CLAUDE.md`, `DESIGN.md`, `starter-kit/static/tokens.css`, `design-tokens.json`, and the relevant skill documents, then report what it applied or skipped. This is reviewable guidance, not deterministic policy enforcement. Human review is still required. The reporting block exists to make deviations visible.

3. **Depends on Model Cooperation**  
   If the underlying model is in a bad state (high temperature, poor reasoning that day, or very long conversation), the protocol's effectiveness decreases. It is not magic.

4. **Mobile and Accessibility Still Require Human Judgment**  
   The audits are rigorous checklists, but they are still performed by an LLM. Real devices, real keyboards, and real assistive technology testing remain necessary.

5. **Canvas Runtime Is Static**  
   The Claude Design Web canvas is treated as an HTML/CSS/browser-JS preview surface. Framework
   migration is a later repo step, not something the canvas executes directly.

6. **Generated JSON Can Drift If Not Regenerated**  
   The canvas consumes `starter-kit/static/tokens.css`; `design-tokens.json` is generated from it for
   documentation and handoff. If token CSS changes without regenerating the JSON outside the canvas,
   handoff docs can drift. `node scripts/validate-cdp.mjs` catches this in repo maintenance.

7. **Native Bundle Contamination**  
   Claude Design's native design-system compiler can bundle all project JavaScript into
   `_ds_bundle.js`, not only the registered components. A design-system project should contain only
   tokens, components, component sidecars, native templates, and small system helpers. Mixing site/app
   runtime code, games, page loaders, analytics, or heavy feature scripts into the same design-system
   project can make every consumer load that code. Keep the design system in its own clean project;
   the site/app should consume it.

## When Not to Use This

- When you need guaranteed, machine-enforceable design system compliance (use a proper component library + linting instead).
- When you're doing rapid exploratory UI work and the overhead of routing feels counterproductive.
- When working with models that have very small context windows.

## Our Stance

We would rather have fewer users who understand exactly what they're getting than many users who feel misled. The protocol is a powerful pattern for teams that want **repeatable taste** and are willing to participate in the process (reviewing the reporting block, maintaining their `DESIGN.md`, curating skills).

If this doesn't match your expectations, that's okay. There are other approaches.

We document these limitations with the same energy we document the features because long-term credibility matters more than short-term stars.
