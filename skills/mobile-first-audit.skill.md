# mobile-first-audit.skill.md

## Name

Mobile-First Audit

## Purpose

Treat mobile as the primary experience and verify that layouts stack logically, touch targets are
adequate, and there is no horizontal overflow: a required gate before any screen is marked final.

## When to use

- Before marking any screen or component as complete.
- After desktop/layout work is done.
- As one of the final gates before production handoff.

## Procedure

1. **Context, not scaling**: Identify the source and target context: phone, tablet, desktop,
   touch/pointer/keyboard, portrait/landscape, quick-glance vs focused-use. Mobile adaptation is not
   desktop scaled down.
2. **Breakpoints & stacking**: Check the layout across `320px`, `375px`, `430px`, `768px`, `1024px`,
   and `1440px`. Verify it stacks logically (single column where appropriate) and that breakpoints
   improve the experience rather than just "fixing" desktop. Prefer content-driven breakpoints.
3. **Touch targets & interaction**: Interactive elements have a minimum 44×44px touch target, with
   adequate spacing between tappable elements. No required action may depend on hover. Use
   `@media (hover: hover)` / `@media (pointer: coarse)` when behavior differs by input method.
4. **Overflow & scrolling**: No horizontal overflow on mobile; no `width: 100vw` traps; long content
   wraps naturally; scroll areas are reachable; flex/grid children use `min-width: 0` where needed.
5. **Navigation, modals & drawers**: Nav behavior, modals, and drawers work and remain reachable on
   small screens. Bottom sheets or full-screen flows may be better than desktop dropdowns.
6. **Hierarchy on mobile**: Primary actions and information stay prominent when stacked; secondary
   information can collapse or reorder, but core functionality is not hidden.
7. **Safe areas & viewport**: HTML includes a viewport meta tag; fixed bottom/top UI accounts for
   `env(safe-area-inset-*)` when needed.
8. **Responsive media & performance**: Images have stable dimensions/aspect ratios; heavy media is
   lazy-loaded when appropriate; complex sections use progressive disclosure on mobile.
9. **Repo-side preflight**: Outside Claude Design Web (plain Node, built-ins only, no npm), when static
   files are available, run `node scripts/detect-canvas-antipatterns.mjs <path>` to catch deterministic mobile risks such as
   missing viewport meta, large fixed widths, `100vw` overflow traps, and viewport-based font sizing.

## Output contract

Explicit list of mobile issues found, recommended fixes (with suggested responsive classes or
structural changes), the exact viewport/input contexts considered, and a clear statement: passes
mobile audit, or the blockers that remain.

## Failure modes

- **Desktop-first thinking:** Auditing mobile as an afterthought. -> Treat mobile as primary.
- **Ignoring real device constraints:** Not considering thumb reach, one-handed use, or `< 360px`.
- **False "mobile ready":** Declaring it mobile-friendly without checking the stacked layout. -> Be rigorous.
- **Scaling instead of adapting:** Keeping desktop IA and just shrinking type/columns. -> Re-plan
  navigation, hierarchy, and disclosure for touch/mobile use.
- **Clean script equals pass:** Treating a deterministic detector as proof. -> Use it as preflight;
  still inspect the actual layout.

## Example invocation

```text
Run mobile-first-audit on this screen across 320-1440px. Report overflow, tap-target, and stacking
issues, then state pass or blockers.
```
