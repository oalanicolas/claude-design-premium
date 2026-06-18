# text-integrity-audit.skill.md

## Name

Text Integrity Audit

## Purpose

Prevent generic generated wording from entering UI copy, documentation, prompts, reports, and public
project text. This skill checks whether the text has a clear job, project-specific voice, clean
syntax, and plain punctuation before it is treated as final.

## When to use

- Before delivering or approving public docs, README copy, prompt libraries, setup instructions, or
  skill files.
- Before finalizing visible UI text: headings, buttons, empty states, onboarding, form helper text,
  deck copy, landing-page copy, and dashboard microcopy.
- When text sounds inflated, templated, overly symmetrical, or detached from `DESIGN.md`.
- After `visual-originality-audit` when the visual direction is acceptable but the words still feel
  generic.
- Before handoff when copy will be carried into Astro, Vite, Next, slides, docs, or standalone HTML.

## Procedure

1. **Identify the text job**: State whether the text is UI label, microcopy, documentation, marketing
   copy, deck copy, audit report, or prompt instruction. Judge it by that job, not by generic polish.
2. **Load voice context**: Read `DESIGN.md`, relevant product context, and any existing copy samples.
   If no voice exists, flag the gap instead of inventing a fake voice.
3. **First sentence test**: The opening must start with substance. Remove acknowledgments, throat
   clearing, broad claims, and "in this section" style framing unless the format truly needs it.
4. **Last sentence test**: The ending should land a decision, next action, or concrete implication.
   Avoid reflexive recaps unless the user explicitly asked for a summary.
5. **Specificity pass**: Replace abstract praise with concrete nouns, constraints, stakes, numbers,
   examples, or product behavior. If a sentence could fit any SaaS, course, dashboard, or portfolio,
   rewrite it.
6. **Syntax variation pass**: Mix sentence length and paragraph shape. Avoid repeated claim-support-
   wrap paragraphs, repeated three-part lists, and repeated "not X but Y" constructions.
7. **Punctuation and typography pass**: Use plain ASCII punctuation in active project docs. Avoid
   typographic shortcuts banned by `CONTRIBUTING.md`. Use colons, commas, periods, and simple
   parentheses instead.
8. **UI copy pass**: For product surfaces, prefer direct labels and task language. Avoid decorative
   verbs, vague benefit claims, cute empty states, and buttons that do not describe the action.
9. **Documentation pass**: Keep claims procedural and evidence-scoped. Do not promise determinism,
   compliance, production readiness, performance, or native behavior without a validation path.
10. **Repo-side preflight**: Outside Claude Design Web (plain Node, built-ins only, no npm), when files
    are available, run `node scripts/detect-text-antipatterns.mjs <path>` for deterministic P1 checks and P2 review
    notes. Use `--strict` only when you want P2 findings to fail local preflight. Do not claim Claude
    Design Web ran this script.

## Output contract

Produce:

- Text verdict: `pass`, `revise`, or `block`.
- Job and audience of the text.
- Voice sources checked.
- Specific issues found, with location or quoted short fragment.
- Concrete rewrites for the highest-impact issues.
- Any missing voice context that should be added to `DESIGN.md` or project docs.
- Repo-side preflight result if the script was run.

For simple text edits, return the revised text plus a short note on what changed. For audits, include
the full verdict and issue list.

## Failure modes

- **Surface-only cleanup:** Fixing punctuation while leaving generic claims intact. -> Rewrite the
  idea, not just the sentence.
- **Voice cosplay:** Inventing personality without source samples. -> Ask for samples or anchor to
  `DESIGN.md`.
- **Overwriting useful clarity:** Making UI labels clever at the cost of usability. -> Keep labels
  direct on product surfaces.
- **Blacklist tunnel vision:** Passing text only because no banned phrase appears. -> Check structure,
  specificity, and paragraph rhythm.
- **False certainty:** Calling text final after a script passes. -> Treat scripts as preflight, then
  apply judgment.

## Example invocation

```text
Run text-integrity-audit on this README section. Remove generic generated wording, keep the claims
evidence-scoped, and return the revised text plus the issues you fixed.
```
