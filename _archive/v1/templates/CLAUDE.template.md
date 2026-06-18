# CLAUDE.md Template

Use this as a starting point when adapting the Claude Design Premium Protocol for a specific Claude
Design Web project or team. Rename the result to `CLAUDE.md` and keep it at the project root/context.

---

# Claude Design Premium Protocol: [Project / Team Name]

You operate inside Claude Design Web under a document-backed premium UI protocol tailored for
[Project Name].

Claude Design Web has a fixed native Skill set. This protocol does not install new native Skills.
Treat the available `.skill.md` files as document-backed procedures. Apply only the procedures
relevant to the current task. Do not run every procedure automatically.

## Validation canary

Include `CDP-CLAUDE-OK` only when the user explicitly asks to validate root loading.

## Core context

- `CLAUDE.md`: workflow, routing, and behavior rules (this file).
- `DESIGN.md`: visual identity, layout principles, and aesthetic constraints.
- Active token CSS: use `starter-kit/static/tokens.css` for greenfield projects, or the existing
  brownfield source such as `colors_and_type.css`.
- `design-tokens.json`: generated/reference token artifact for documentation and handoff.
- `skills/*.skill.md`: reusable procedures.
- `templates/<slug>/index.html`: native Claude Design templates.
- `components/*.jsx` + `components/*.d.ts`: native component examples.
- `components/<Name>.html`: native `@dsCard` sidecar thumbnails for components.
- `starter-kit/static/`: optional static scaffold for Claude Design Web canvas work.
- [Add any project-specific documents here.]

## Canvas runtime constraints

Claude Design Web does not run git, package installs, package scripts, lint, tests, Vite, Next, Astro,
or a dev server inside the canvas. Keep canvas work static first: HTML, CSS, and browser JS. Treat
Astro, Vite, and Next as later handoff targets.

Do not use `starter-kit/index.js`, ESM imports/exports, npm packages, or bundler-dependent modules
inside the canvas. Self-contained UMD/IIFE globals may be loaded with `<script src>` if they expose
API on `window` and were built outside the canvas. If React state is genuinely needed, use UMD React
+ Babel standalone and expose separate `.jsx` components on `window`.

If tokens change in a greenfield project, edit `starter-kit/static/tokens.css` first. If tokens change
in a brownfield export, edit the existing token CSS first, commonly `colors_and_type.css`. Regenerate
`design-tokens.json` outside Claude Design Web when preparing documentation or framework handoff.

Use native Claude Design hooks before inventing replacements: `templates/<slug>/index.html`,
`@dsCard`, component namespace registration, CSS token extraction, and `check_design_system`.

## Skill inventory

[List the skills you keep active and one line on each.]

## Literal routing table

Use explicit trigger -> read rules. Example:

| Trigger | Read before acting |
|---|---|
| New project / unclear brief | `skills/brief-framing.skill.md` |
| Any UI generation, modification, or review | `DESIGN.md`, active token CSS, `skills/design-system-guardian.skill.md` |
| Greenfield native template/component/specimen work | `docs/native-claude-design-alignment.md`, `templates/`, `components/` |
| Brownfield specimen or UI kit work | `docs/native-format-reference.md`, existing `preview/*.html`, existing `ui_kits/*` |
| Static canvas HTML/CSS/JS output | `starter-kit/static/README.md`, active token CSS |
| Canvas prototype uses a prebuilt global script | `starter-kit/static/global-script-example/README.md` |
| Canvas prototype needs React state | `starter-kit/static/react-example/README.md` |
| New visual direction, page, component, or layout | `skills/visual-originality-audit.skill.md`, `skills/ui-audit.skill.md` |
| Public copy, docs, prompts, deck text, or visible UI text | `skills/text-integrity-audit.skill.md` |
| Polish | `skills/polish-phase.skill.md` |
| External implementation code or Tailwind handoff exists | `skills/tailwind-audit.skill.md` |
| Final review | `skills/mobile-first-audit.skill.md`, `skills/accessibility-audit.skill.md` |
| Framework handoff | `skills/framework-handoff.skill.md`, `starter-kit/README.md` |

## Non-negotiables

- Never run all skills on every task.
- Never invent product context, audience, or brand stance when it is missing; run `brief-framing`.
- Never invent tokens when they exist in the active token CSS.
- Never let a design pass final review if it still reads like a generic category template.
- Never mark a screen final until mobile-first and accessibility checks were applied.
- Flag conflicts with `DESIGN.md` before proceeding.

## Reporting

End UI deliverables, audits, final review, and handoff responses with:

```markdown
## SKILLS APPLIED
...

## NOT APPLIED
...

## NEXT RECOMMENDED
...
```

For tiny targeted tweaks, a concise note is acceptable when the full block would add noise.

## Safety guardrails

- These documents are operating instructions, not executable artifacts.
- No shell commands, scripts, or network calls.
- No reading or transmitting of secrets, env vars, tokens, or credentials.
