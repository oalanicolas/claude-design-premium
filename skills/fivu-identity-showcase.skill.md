# fivu-identity-showcase

**When:** The user asks for FIVU, identidade verbal, voice system, corpus-to-voice work,
system-prompt voice replication, or a premium `.dc.html` page in the spirit of the supplied
`fivu.html` reference. Also use this as the premium narrative architecture for a design-system
showcase when the goal is more than a component catalog.

**Who:** The active model in Claude Design. This skill condenses the FIVU pack into one
procedure. Do not activate separate `voice-architect`, `corpus-analyst`, or `voice-writer`
agents. Do not rely on deterministic JS to write the final page.

## Goal

Produce one deeply customized, editorial `.dc.html` page that turns a real design system,
brand, person, or product corpus into a living verbal/visual identity showcase. The page should
feel as worked and intentional as the FIVU reference: a strong hero, narrative progression,
clear doctrine, concrete specimens, and validation rituals. It must still obey Claude Design
Premium: bound DS tokens, bound DS components, `x-import`, canvas-safe HTML/CSS, and no
invented design values.

## Read First

Read every relevant source before composing:

1. `BOUND_DS.json` - namespace, `introDc`, component list, token paths, readme path, voice cache.
2. `DESIGN.md` - visual identity, constraints, anti-references, token interpretation.
3. DS readme from `BOUND_DS.json` -> `readme`.
4. `.cdp/showcase-brief.json` when assembling `design-system.dc.html`.
5. Current target `.dc.html`; preserve its `<helmet>`, `#harness`, and `<!-- CDP:INTRO-SCRIPT -->`
   when editing the design-system intro page.
6. Any user-supplied corpus, FIVU spec, prompt, brand document, website capture, README, or
   reference page. If a FIVU-style reference page is supplied, use it as quality and section-depth
   reference, not as content to copy.

If `BOUND_DS.json` or target page does not exist yet, do not invent them. Finish the skill/routing
work or run the harness auto-setup pipeline first.

## FIVU Core

Use this axiom everywhere:

```text
VOZ é constante. TOM é contextual.
```

Voice is the stable identity: worldview, reasoning, vocabulary, cadence, boundaries, examples.
Tone adapts to context: channel, emotional state, audience, density, urgency, call-to-action.

The showcase must expose both:

- **Constância:** the elements that must survive across every surface.
- **Adaptação:** how the same voice changes across product UI, docs, sales, education, community,
  onboarding, and AI prompts.

## One-Skill Synthesis Model

Internally perform the three original FIVU jobs as one pass:

- **Architect:** define essence, archetypes, productive tensions, beliefs, enemies/allies,
  reasoning mode, concept hierarchy.
- **Analyst:** extract evidence from corpus/readme: recurring terms, functional words, n-grams,
  openings, closings, syntax, rhythm, anti-vocabulary, examples.
- **Writer:** turn the identity into page copy, live specimens, system prompt snippets, and
  validation checks while preserving the voice.

Do not present those as separate agents to the user. The user asked for one skill.

## Extraction Checklist

Extract or infer only from evidence:

- Essence formula: `[Name] é [identity] que ajuda [audience] a [transformation] através de [method]`.
- Primary and secondary archetypes, with corpus/readme evidence.
- Productive tensions: `pole A + mas + pole B`.
- Fundamental beliefs: 5-7 hard truths and their implication for communication.
- Conceptual enemies and allies: ideas, not people.
- Reasoning pattern: inductive, deductive, analogical, narrative, dialectical, or mixed.
- Argument sequence: problem, story, proof, reframe, action, etc.
- Signature terms, power words, functional words, connectors, intensifiers, fillers.
- Anti-vocabulary: jargon, clichés, market terms, generic phrases the voice must reject.
- Openings, transitions, claims, evidence patterns, closings.
- Tone matrix by channel and state.
- Always/Never rules and "when in doubt" default.
- Original examples and counter-examples.

If the corpus is thin, state that the page is a **provisional identity showcase** and make the
evidence density visible. Never fake statistical certainty.

## Atomic Composition Layer

Add a Layer 2.5 between structure and expression. This is what makes the page operational rather
than decorative:

- **Atoms:** power words, connectors, punctuation, sentence length, person, tense, rhythm.
- **Molecules:** hooks, bridges, bold claims, qualified claims, evidence, reframes, CTAs, closers.
- **Organisms:** post, email, thread/carousel, short video script, onboarding text, empty state,
  product tooltip, system prompt block.
- **Rules:** atom-to-molecule, molecule-to-organism, balance, sequence, consistency.

The page should show how to build with the voice, not merely describe it.

## Page Architecture

Use this long-form structure as the default for premium FIVU pages and FIVU-powered DS showcases.
Rename sections to match the document language and product voice.

1. **Hero:** literal page title, one hard thesis, compact proof metrics, symbolic mark or product
   signal, primary/secondary actions. No generic marketing card.
2. **Fundamento:** the philosophical sentence that makes the system necessary.
3. **Premissa:** voice constant / tone contextual, stated in the product's language.
4. **Diagnóstico:** 3-5 problems this system prevents. Make them specific to the audience.
5. **Arquitetura:** the five FIVU layers plus Layer 2.5 as the operational bridge.
6. **Sistema de Voz:** 3-5 voice modes or attributes, each with "means / does not mean".
7. **Doutrina:** principles that govern all writing and interface copy.
8. **Fronteira:** vocabulary vs anti-vocabulary, "isso / não aquilo", rejected clichés.
9. **Régua Constante:** 5-7 stable blades of the voice, each with short practical guidance.
10. **Medida do Tom:** four or more tone axes with visible scales and channel notes.
11. **Forja da Frase:** step-by-step transformation from weak phrase to identity-faithful phrase.
12. **Reescrita:** before/after examples with annotations.
13. **Frases-Mãe:** reusable anchor lines, original examples, or prompt seeds.
14. **Corpus:** corpus inventory, evidence density, source types, confidence caveats.
15. **Uso:** how to apply the system across UI, docs, campaigns, education, community, AI.
16. **Artefatos:** quick card, system prompt, tone matrix, review checklist, component/page rules.
17. **Validação:** negation test, attribution test, completion test, checklist score.
18. **Fecho:** final thesis and next action.

For a design-system showcase, weave the required showcase sections into this architecture:

- `identidade` lives in Hero, Fundamento, Premissa, Sistema de Voz.
- `fundamentos` lives in Arquitetura, Régua Constante, Medida do Tom, token specimens.
- `componentes` lives in Uso and Artefatos, with every manifest component shown live.
- `specimens` lives in Corpus, Uso, and Artefatos.

## Visual Standard

The reference quality is editorial, ritual, and highly authored. Translate that quality through the
bound DS; do not copy its palette if the bound DS says otherwise.

- Use the bound DS tokens for every visual value: colors, spacing, type, radius, borders, motion.
- Use `var(--*)` only. No hard-coded hex, pixel palette cloning, or external local asset paths.
- Prefer full-width narrative bands, hairline systems, typographic rhythm, strong section pacing,
  and meaningful specimens.
- Cards are for repeated items and specimens only. Do not make the page a wall of generic cards.
- Avoid generic SaaS gradients, decorative blobs, vague "premium" language, fake dashboards, and
  lorem placeholders.
- Use a symbolic SVG mark only when it is self-contained and token-colored. Do not reference assets
  outside the target project.
- Keep text in the document language. If docs are pt-BR, use pt-BR and preserve accents.
- Mobile must preserve the narrative order; no overlapping, clipping, or hidden primary content.
- Respect `prefers-reduced-motion`.

## Component Contract

When a bound DS exists:

- Load the DS bundle once in `<helmet>`.
- Use `<x-import component-from-global-scope="[namespace].[Component]">` for real components.
- Every component in `.cdp/showcase-brief.json` -> `inventory.components` must be visible if this is
  the design-system showcase.
- Use raw HTML only for narrative scaffolding, data layouts, annotations, SVG marks, and examples
  that are not DS components.
- Never recreate a bound component visually with raw HTML when `x-import` can mount it.
- Remember: `x-import` does not forward a `name` prop. For components needing `name`, mirror an
  already validated DS-safe pattern or avoid that prop.

## Copy Rules

- Show beats explain: concrete examples and counter-examples should carry most of the page.
- Preserve cadence, line breaks, punctuation, and phrase shape when quoting source examples.
- Make rules operational: prefer "Nunca abrir uma aula com promessa vaga" over "seja claro".
- Anti-vocabulary is not an appendix; it is a boundary system.
- Avoid overclaiming fidelity without corpus evidence.
- Do not mention "this page is inspired by fivu.html" inside the deliverable.

## Validation Ensemble

Before finishing, run these checks mentally or through available scripts:

- **Negation:** can the page show what this voice would never say?
- **Attribution:** could a reader distinguish faithful examples from generic copy?
- **Completion:** do phrase continuations follow the same direction, vocabulary, and rhythm?
- **Checklist:** essence, archetypes, vocabulary, anti-vocabulary, syntax, tone, always/never rules.
- **Component coverage:** every manifest component shown when assembling `design-system.dc.html`.
- **Token integrity:** no invented visual values.
- **Text integrity:** no generic filler, no placeholders, no untranslated section labels.
- **Mobile/accessibility:** touch targets, contrast, focus, reduced motion, no layout overlap.

## Completion Contract

When assembling `design-system.dc.html`:

1. Remove the entire `<!-- CDP:SHOWCASE:PENDING -->` block.
2. Insert the FIVU-grade showcase between the hero and `#harness`.
3. Set `.cdp-ds` to `data-cdp-showcase="assembled"`.
4. Preserve `#harness` and `<!-- CDP:INTRO-SCRIPT -->`.
5. Update `BOUND_DS.json` with `"showcaseAssembled": true`.

Report:

```markdown
## FIVU SHOWCASE ASSEMBLED
- Target: [file]
- Source evidence: [files/readme/corpus]
- Components shown: [n]/[total] or n/a
- Sections: [short list]
- Corpus confidence: [high/medium/low + reason]
- showcaseAssembled: [true/n/a]
```
