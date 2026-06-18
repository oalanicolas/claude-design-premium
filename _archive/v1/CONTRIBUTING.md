# Contributing to Claude Design Premium

We welcome contributions that improve the protocol, add high-quality skills, or provide better
examples. This is an unofficial community workflow: not affiliated with Anthropic.

## How to Contribute a New Skill

The bar for a new skill is intentionally high. A good skill is:

- Focused on one clear responsibility.
- Has a precise `When to use` section.
- Contains a repeatable `Procedure`.
- Defines a clear `Output contract`.
- Documents realistic `Failure modes`.
- Includes an `Example invocation`.

### Contribution process (5 steps)

1. Copy `templates/new-skill.skill.md`.
2. Rename it to `your-skill-name.skill.md` and place it in `skills/`.
3. Fill in all seven sections honestly: `Name`, `Purpose`, `When to use`, `Procedure`,
   `Output contract`, `Failure modes`, `Example invocation`.
4. Keep it inert: no shell commands, no network calls, no credential handling.
5. Open a Pull Request with title: `New skill: your-skill-name`.

We review for clarity, selectivity, and whether the skill meaningfully reduces design inconsistency.

## Other Ways to Contribute

- **Improve existing skills**: Tighter checklists, more honest failure modes.
- **Submit a DESIGN.md**: Share a real design system document (anonymized if needed) that works well
  with the protocol.
- **Submit before/after examples**: Visual proof that the protocol improved output quality. Use the
  example issue template; never claim a result as real without the artifact.
- **Request a skill**: Use the `skill_request` issue template if you have a recurring pain point that
  has no skill yet.
- **Improve documentation**: Especially `docs/`, `PLAYBOOK.md`, or `LIMITATIONS.md`.

## Language and Claims

- Public-facing canonical files should be in English unless they are explicitly localized mirrors such
  as `README.pt-BR.md`.
- No invented metrics, testimonials, benchmarks, or screenshots.
- Keep the writing plain. Do not use typographic shortcuts such as U+2014, U+2013, U+2192, U+2026,
  curly quotes, or vague generated-output labels in active docs. Use commas, colons, periods, ASCII
  arrows in code blocks, and specific descriptions instead.
- Where proof is missing, use an explicit placeholder:
  `<!-- TODO: attach real screenshot / measured result -->`.
- Strong claims must be backed by an example, checklist, or limitation.

## Code of Conduct

- Be precise. Vague skills create more problems than they solve.
- Prefer honesty over hype. If a skill only helps in certain contexts, say so.
- Remember that the protocol is a **pattern**, not magic. It influences the model through context: it
  does not compile or enforce at runtime. Enforcement here is procedural and reviewable.

Thank you for helping make premium design execution more repeatable.
