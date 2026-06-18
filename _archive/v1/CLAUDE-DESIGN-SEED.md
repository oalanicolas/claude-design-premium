# SEED · Claude Design Premium Bootstrap

> Attach this file in the first message of an empty Claude Design Web project and say:
>
> ```text
> Use this seed. First create the project structure and root CLAUDE.md. Do not design from this page.
> ```

This is a bootstrap instruction, not a visual reference. The goal is to make Claude Design Web create
the same operating structure that a folder-based starter would provide, without requiring git, a dev
server, or uploading a folder.

## Non-Negotiables

1. Do **not** create a design system from this seed page's appearance.
2. Use this seed to create files and governance first.
3. Write root `CLAUDE.md` before generating screens.
4. Claude Design has a fixed native Skill set; this starter does not install new native Skills.
   Treat `.skill.md` files as document-backed procedures.
5. Do not run git, npm, Vite, Next, Astro, lint, tests, or any dev server inside Claude Design Web.
6. The default canvas preview is static: HTML/CSS/vanilla JS directly.
7. React/JSX is allowed only as an in-browser escape hatch: React/ReactDOM UMD scripts + Babel
   standalone + `<script type="text/babel">`, no npm imports and no bundler module graph. For
   portable starter examples, expose reusable pieces on `window`.
8. If the user gives access to an existing project/folder, read it and replicate the real files instead
   of recreating code from memory.
9. In a new greenfield scaffold, treat `starter-kit/static/tokens.css` as the canvas token source;
   CSS uses custom properties, not JSON imports. `design-tokens.json` is a generated/reference
   artifact for later handoff.
10. Ask opening questions before inventing brand content.

## Order of Assembly

Follow this order exactly:

1. Create root `CLAUDE.md` using the governance section below.
2. Create `DESIGN.md`, `starter-kit/static/tokens.css`, and a matching `design-tokens.json`
   reference.
3. Create native Claude Design design-system rails:
   - `templates/page-base/index.html`
   - `templates/landing/index.html`
   - `templates/deck/index.html`
   - `templates/ds-base.js`
   - optionally `components/Botao.jsx` + `components/Botao.d.ts` + `components/Botao.html`
     with an `@dsCard` sidecar marker
4. Create `skills/` with the documented procedure files.
5. Create a static canvas fallback scaffold under `starter-kit/static/`:
   - `starter-kit/static/styles.css`
   - `starter-kit/static/tokens.css`
   - `starter-kit/static/assets/config/site.js`
   - `starter-kit/static/assets/js/boot.js`
   - optionally `starter-kit/static/global-script-example/` when the project needs a prebuilt global
     script pattern
   - optionally `starter-kit/static/react-example/` when the project needs a stateful React prototype
6. If a source starter folder is readable, copy/replicate its real files into the new project.
7. Ask the opening questions.
8. Only then generate the first screen, component, or design system specimen.

## Governance Target for `CLAUDE.md`

Write a concise `CLAUDE.md` with these rules:

- You operate inside Claude Design Web.
- Include `CDP-CLAUDE-OK` only when the user asks to validate root loading.
- Claude Design Web has a fixed native Skill set; this starter does not install new native Skills.
- `.skill.md` files are document-backed procedures, not product Skills.
- Use native Claude Design hooks first: `templates/<slug>/index.html`, `@dsCard`, component
  namespace registration, CSS token extraction, and `check_design_system`.
- Always anchor UI decisions in `DESIGN.md` and the active token CSS.
- Treat `design-tokens.json` as generated/reference material for documentation and handoff.
- Do not use `starter-kit/index.js`, ESM imports/exports, npm packages, or bundler-dependent modules
  inside the canvas.
- Self-contained UMD/IIFE globals may be loaded with `<script src>` if they expose API on `window`
  and were built outside the canvas.
- If React is needed in the canvas, use only `starter-kit/static/react-example/` style:
  React/ReactDOM UMD + Babel standalone + `window` globals.
- Use a literal routing table:
  - WHEN brief/context is unclear -> READ `skills/brief-framing.skill.md`.
  - WHEN creating/modifying/reviewing UI -> READ `DESIGN.md`, active token CSS,
    `skills/design-system-guardian.skill.md`.
  - WHEN writing static canvas HTML/CSS/JS -> READ `starter-kit/static/README.md`,
    active token CSS.
  - WHEN creating native templates/components/specimens -> READ
    `docs/native-claude-design-alignment.md`.
  - WHEN using a prebuilt global script in the canvas -> READ
    `starter-kit/static/global-script-example/README.md`.
  - WHEN React state is required in the canvas -> READ `starter-kit/static/react-example/README.md`.
  - WHEN generating a page/component/layout -> READ `skills/visual-originality-audit.skill.md`,
    `skills/ui-audit.skill.md`.
  - WHEN writing or reviewing public text, UI copy, prompts, docs, deck text, or skill text -> READ
    `skills/text-integrity-audit.skill.md`.
  - WHEN polishing -> READ `skills/polish-phase.skill.md`.
  - WHEN finalizing -> READ `skills/mobile-first-audit.skill.md`,
    `skills/accessibility-audit.skill.md`.
  - WHEN handoff/modularizing -> READ `skills/framework-handoff.skill.md`, `starter-kit/README.md`.
- Never invent tokens when token values exist.
- Never mark a screen final before mobile and accessibility checks.
- End UI deliverables, audits, final approval passes, and handoff work with:

```markdown
## SKILLS APPLIED
- [skill name]: [yes/no]: [brief reason]

## NOT APPLIED
- [skill name]: [why skipped or not relevant]

## NEXT RECOMMENDED
- [one skill or action]
```

For tiny targeted tweaks, a concise one-line note is acceptable when the full block would add noise.

## Static Canvas Scaffold

The first scaffold must work as static files in Claude Design Web. It must not require:

- `vite dev`
- `next dev`
- `astro dev`
- package install
- git clone
- filesystem scripts

Use plain linked CSS and JS. Keep framework conversion as a later handoff step.

## Opening Questions

Ask these before inventing content:

1. What is the product or brand name?
2. What audience is this design system for?
3. What surface should come first: marketing, app shell, dashboard, deck, content site, or system
   specimen?
4. Is this primarily a brand, product, or system surface?
5. What visual references should be obeyed, translated, or avoided?
6. Is the later implementation target Astro, Vite, Next, or undecided?

## Cross-Project Replication Prompt

If the user provides a readable source project or folder, use this instruction:

```text
Read the referenced source project as the source starter.
Replicate its file structure and static loader files exactly where possible.
Do not reinterpret the code from memory.
Use this seed only for governance and assembly order.
```

## First User Prompt Template

```text
Use CLAUDE-DESIGN-SEED.md.
Create the root CLAUDE.md first, then scaffold the static design-system structure.
Include CDP-CLAUDE-OK in CLAUDE.md and treat starter-kit/static/tokens.css as the token source for
this new greenfield scaffold.
Create native templates under templates/<slug>/index.html before static fallback templates.
Do not generate the visual design yet.
After the structure exists, ask the opening questions.
```
