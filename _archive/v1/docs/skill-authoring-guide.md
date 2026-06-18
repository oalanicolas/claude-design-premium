# Skill Authoring Guide

This guide explains how to write a good `.skill.md` so it routes cleanly under `CLAUDE.md` and actually
reduces design inconsistency.

## A skill is a procedure, not a personality

A skill is a small, reusable operating procedure for one responsibility. It is loaded into context only
when relevant, executed, and reported. It is **not** a place for executable commands, URLs, or
credentials (see `SECURITY.md`).

## Required structure (seven sections)

Every skill must contain these sections, in this order:

1. **Name**: Human-readable name.
2. **Purpose**: One or two sentences: what this keeps consistent or improves, and why it matters.
3. **When to use**: Specific task types or situations that should trigger it.
4. **Procedure**: A numbered, repeatable checklist.
5. **Output contract**: What the model must produce or report after running it.
6. **Failure modes**: Realistic ways it goes wrong, each with a correction.
7. **Example invocation**: A short, concrete prompt a user would paste to trigger it.

Use `templates/new-skill.skill.md` as the starting point.

## Quality bar

- **One responsibility.** If a skill does two unrelated things, split it.
- **Readable in under two minutes.** Long skills add context pressure and get ignored.
- **Selective by design.** State clearly when it should *not* run, so the protocol can report it under
  NOT APPLIED.
- **Anchored to tokens.** Tie checks back to the active token CSS and `DESIGN.md` instead of generic
  taste statements.
- **Honest failure modes.** Describe what actually goes wrong and the concrete correction.

## How routing picks up a new skill

`CLAUDE.md` routes with literal trigger -> READ rows. When you add a skill:

1. Decide which task types it belongs to (visual generation, code implementation, final approval).
2. Add it to the skill inventory and the relevant trigger row in your `CLAUDE.md`
   (or `templates/CLAUDE.template.md` for a team variant).
3. Keep the total set small. Many shallow skills dilute signal; a few sharp ones do not.

## Testing your skill

Use `validation-method.md`:

- Confirm it appears under SKILLS APPLIED when relevant.
- Confirm it appears under NOT APPLIED when it should be skipped.
- Confirm it does not silently take over responses where another skill should lead.

## Claims and evidence

If your skill claims an improvement, back it with an example in `examples/` (prompt + reporting block,
and a real screenshot when you have one). Never assert a result without the artifact; use a
`<!-- TODO: attach real screenshot / measured result -->` placeholder where proof is missing.
