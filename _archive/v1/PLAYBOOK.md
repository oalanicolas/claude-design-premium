# PLAYBOOK: End-to-End Workflow

This document describes the recommended way to use the protocol in Claude Design Web projects.

## 1. Initial Setup (one time)

### If Claude can read the starter folder

1. Put `CLAUDE.md` at the root of the Claude Design Web project context.
2. Add `DESIGN.md.example` (rename to `DESIGN.md`), `starter-kit/static/tokens.css`, and the
   `skills/` folder. Add `design-tokens.json.example` only as the generated/reference handoff
   artifact when useful.
   Use `docs/canvas-core.md` to keep the canvas context lean.
3. Ask Claude to replicate real starter files when it can read this project folder. Do not ask it to
   recreate code from memory when a source folder is available.
4. Keep `starter-kit/static/` available for canvas-safe HTML/CSS/JS scaffolds. In greenfield
   projects, `starter-kit/static/tokens.css` can be the active token source; in brownfield exports,
   preserve the existing token CSS such as `colors_and_type.css`.
5. Keep `starter-kit/` available when you want Claude to produce modular patterns that can later move to Astro, Vite, or Next.
6. Run the canary in `docs/validation-method.md` once. Use `activation-prompt.md` only if the root `CLAUDE.md` did not load.
7. Start with the core document-backed procedures.

### If the project starts from an empty canvas

1. Attach `CLAUDE-DESIGN-SEED.md` in the first message.
2. Tell Claude to create root `CLAUDE.md` first and scaffold the static design-system structure before
   any visual design.
3. Use the seed's opening questions before inventing brand content.
4. Run the canary in `docs/validation-method.md` once. Use `activation-prompt.md` only if the root `CLAUDE.md` did not load.
5. Start with the core document-backed procedures.

Claude Design Web is the static authoring bench. Do not ask it to run git, npm, package scripts,
Vite, Next, Astro, lint, tests, or a dev server inside the canvas.
Do not ask it to use `starter-kit/index.js`, ESM imports/exports, npm packages, or
bundler-dependent modules in the canvas; those are handoff assets for a real repo. A self-contained
UMD/IIFE global script can be loaded with `<script src>` if it was built outside the canvas. If React
state is genuinely needed, use the `starter-kit/static/react-example/` UMD+Babel pattern.

Outside the canvas, use deterministic repo checks while maintaining this starter:

```bash
node scripts/context-signals.mjs
node scripts/generate-design-tokens.mjs --check
node scripts/detect-canvas-antipatterns.mjs starter-kit/static
node scripts/detect-text-antipatterns.mjs README.md docs skills
node scripts/validate-cdp.mjs
```

Those scripts are dependency-free JavaScript using Node built-ins only. Do not add npm packages for
starter validation.

## 2. Daily Workflow

### For new screen / major feature

1. Describe the task in Claude Design Web.
2. If product, audience, surface, or references are unclear, run `brief-framing` first.
3. Ask for one screen or one flow slice at a time.
4. The protocol should:
   - Run `design-system-guardian`
   - Run `visual-originality-audit` when the work is visual, brand-facing, or at risk of generic output
   - Run `ui-audit`
   - Run `polish-phase` (if direction exists)
5. Review the `SKILLS APPLIED` block on deliverables/audits. For tiny tweaks, a shorter note is fine.
6. Iterate with inline comments for targeted fixes and chat for structural changes.

### For modularization / framework handoff

1. After the visual direction is approved, ask Claude Design to extract reusable pieces: shell, nav, cards, buttons, sections, and patterns.
2. Run `framework-handoff` and use `starter-kit/` naming where possible: `AppShell`, `MarketingNav`, `Button`, `Card`, `SectionHeader`, `Hero`, `DashboardFrame`.
3. If the work is still inside Claude Design Web, keep the implementation static and use
   `starter-kit/static/` patterns.
4. If external implementation code exists, run: `design-system-guardian` -> `tailwind-audit` ->
   `mobile-first-audit` -> `accessibility-audit`.
5. Choose an adapter path:
   - Astro for marketing/content-heavy sites.
   - Vite for interactive app prototypes.
   - Next only when SSR, routing conventions, or team constraints require it.

### For polish & final review

1. Explicitly ask for `polish-phase`.
2. Run `visual-originality-audit` if the screen still feels templated or category-obvious.
3. Run `text-integrity-audit` if the work includes visible UI copy, docs, deck text, prompts, or
   public-facing text.
4. Follow with `mobile-first-audit` + `accessibility-audit`.
5. Do not mark a screen "done" until these have passed.

## 3. Maintaining the System

- When you update the active token CSS, regenerate `design-tokens.json.example` outside the canvas
  if you keep JSON for docs/handoff, and re-run affected screens through `design-system-guardian`.
- When you update protocol/runtime docs or static examples, run `node scripts/validate-cdp.mjs`
  outside the canvas.
- When you create a new component pattern, consider whether it justifies a new skill or just belongs in `DESIGN.md`.
- Review the `NEXT RECOMMENDED` suggestions from the protocol: they often point to missing skills or weak areas in your current system.

## 4. Team Usage

- Keep one project-governing `CLAUDE.md`, one `DESIGN.md`, and one active token CSS graph in the repo.
- Encourage team members to submit skills via PR when they develop repeatable processes.
- Use the reporting block in code reviews: "Did the accessibility-audit actually run?"

The protocol works best when treated as **shared infrastructure** rather than a personal prompting trick.
