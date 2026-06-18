# assemble-design-system-showcase

**When:** After bootstrap, when `design-system.dc.html` still contains `<!-- CDP:SHOWCASE:PENDING -->`, or when `context-signals` reports `needsShowcaseAssembly: true`.

**Who:** The active model in the canvas (Opus, Sonnet, or any model running under `CLAUDE.md`). This is **not** a Node script job - JS only writes the scaffold and brief.

## Goal

Replace the pending block with a **fully customized** design-system vitrine - composed with the bound DS runtime (`x-import`, real tokens, real components). Follow `assembly.requiredSections` and `assembly.rules` in the brief.

When the user wants a richer page in the style of a FIVU/identity-system showcase, read
`skills/fivu-identity-showcase.skill.md` and use its long-form architecture to shape the vitrine.
This keeps the output model-authored, corpus-aware, and editorial instead of a generic component
catalog.

## Read first (mandatory)

1. `.cdp/showcase-brief.json` - inventory, assembly contract, rules
2. `BOUND_DS.json` - namespace, `introDc`, component list
3. `DESIGN.md` - visual identity and constraints
4. DS `readme` (path in `BOUND_DS.json`)
5. `design-system.dc.html` - current scaffold; **preserve** hero metrics and harness prompts section
6. `skills/fivu-identity-showcase.skill.md` when the requested showcase should feel like a premium
   identity/verbal-system page rather than a compact component inventory

## Assembly steps

1. Open `design-system.dc.html` and locate:
   ```html
   <!-- CDP:SHOWCASE:PENDING -->
   ...
   <!-- /CDP:SHOWCASE:PENDING -->
   ```
2. **Delete** that entire block and insert the customized showcase **between** the hero and `#harness`.
3. Set `data-cdp-showcase="assembled"` on `.cdp-ds` (replace `pending`).
4. Build sections tailored to **this** product (order and copy from readme/DESIGN.md, not a fixed template):
   - **Identidade** - logo, tagline, surfaces, voice
   - **Fundamentos** - color swatches (`var(--*)`), typography scale, spacing, radius, motion
   - **Componentes** - **every** component in `inventory.components` with live `x-import` specimens and variants where applicable
   - **Specimens** - manifest cards/startingPoints when present
   If applying the FIVU skill, weave these required sections into the FIVU flow: hero, fundamento,
   premissa, diagnóstico, arquitetura, sistema de voz, fronteira, régua, tom, forja da frase,
   artefatos, validação, and final thesis.
5. Add side nav or index with anchors to every section and every component (`id="comp-{slug}"`).
6. Use only `{{BOUND_DS_NAMESPACE}}.ComponentName` via `x-import` - never raw HTML imitating components.
7. Update `BOUND_DS.json`: `"showcaseAssembled": true`.
8. Run `design-system-guardian` mentally against `DESIGN.md` + tokens before finishing.

## Quality gates

- [ ] All manifest components have a visible live specimen
- [ ] Token swatches use real `var(--*)` from bound CSS
- [ ] Copy is in product voice (readme), not generic harness text
- [ ] No `<!-- CDP:SHOWCASE:PENDING -->` remains
- [ ] Harness `#harness` section and `<!-- CDP:INTRO-SCRIPT -->` untouched
- [ ] `check_design_system` when available

## Report block

```markdown
## SHOWCASE ASSEMBLED
- Target: [introDc path]
- Components shown: [n]/[total]
- Sections: [list]
- Customization source: [readme / DESIGN.md highlights]
- showcaseAssembled: true
```
