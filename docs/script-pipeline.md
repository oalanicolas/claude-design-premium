# Script Pipeline (canvas + skills)

`scripts/*.mjs` are **dependency-free JavaScript** (`node:fs`, `node:path` only). They are the
deterministic foundation of this harness  -  not an optional extra for maintainers outside the canvas.

Claude Design Web supports JavaScript. Inside the canvas, Claude **reads and executes the logic** of
these scripts against project files (inventory, binding, voice extraction, antipattern scans). That
is the same execution model as `.skill.md` procedures: procedural, reviewable, file-backed.

`node scripts/<name>.mjs` remains valid **locally** for the same checks. Do not claim you ran `node`
inside the canvas when you applied the script logic by reading the file  -  report **script applied**
instead.

## Execution order (mandatory when relevant)

Run in this order. Skip only when the trigger does not apply.

| Step | Script | Pairs with | When |
|---|---|---|---|
| 0 | `context-signals.mjs` | auto-setup gate | Start of session, after setup, before final approval |
| 1 | `detect-bound-ds.mjs` (`detectHostDs`) | `harness-auto-setup` | Detect `builder` (root manifest) or `consumer` (`_ds/`) |
| 2 | `extract-ds-voice.mjs` | `harness-auto-setup` | During bootstrap  -  readme -> voice object |
| 3 | `bootstrap-harness.mjs` | `harness-auto-setup` | Harness unbound  -  technical placeholders |
| 4 | `personalize-dc.mjs` | `harness-auto-setup` | Bootstrap seam after step 3 (no-op; scaffold fully materialized in step 3) |
| 5 | native `check_design_system` | `design-system-guardian` | After binding; strongest DS proof |
| 6 | `detect-canvas-antipatterns.mjs` | `visual-originality-audit`, `ui-audit`, `mobile-first-audit`, `accessibility-audit` | Before polish/final on `*.dc.html` targets |
| 7 | `detect-text-antipatterns.mjs` | `text-integrity-audit` | Before final on copy-heavy deliverables |
|  -  | `unbind-harness.mjs` |  -  | Reset only  -  never during normal design work |

## Skill ↔ script pairing (dual-mode)

Skills provide judgment; scripts provide **measurable preflight**. Always run the script logic
**before** the paired skill when both apply:

```
context-signals -> harness-auto-setup (if needed) -> design-system-guardian
-> visual-originality-audit (+ detect-canvas-antipatterns)
-> ui-audit (+ detect-canvas-antipatterns)
-> polish-phase
-> text-integrity-audit (+ detect-text-antipatterns)
-> mobile-first-audit (+ detect-canvas-antipatterns)
-> accessibility-audit (+ detect-canvas-antipatterns)
```

## How to "run" a script in the canvas

1. **Read** the full `scripts/<name>.mjs` file.
2. **Apply** its algorithm to the current project files (same inputs/outputs the script would use).
3. **Report** findings in the delivery/audit block under `SCRIPTS APPLIED` (see `CLAUDE.md`).
4. If the script writes artifacts (`BOUND_DS.json`, patched DCs), **write those files**  -  do not
   only summarize.

Scripts do **not** require `npm install`, `git`, or a dev server. They are plain JS that operates on
files Claude Design already exposes in the project.

## Local mirror (optional)

From repo root, the same scripts produce identical JSON/text output:

```bash
node scripts/context-signals.mjs
node scripts/bootstrap-harness.mjs
node scripts/detect-canvas-antipatterns.mjs .
node scripts/detect-text-antipatterns.mjs CLAUDE.md DESIGN.md skills *.dc.html
```

Use local `node` for CI or maintainer preflight  -  not because the canvas cannot use the scripts.

## Shared modules (I/O kernel)

`file-snapshot.mjs` is the single source of truth for filesystem reads. Every
pipeline script imports from it instead of redefining its own helpers:

- `safeRead(root, rel)`  -  read a file, return `''` when missing.
- `readJson(root, rel)`  -  read + parse JSON, throw with file context on failure.
- `isPathInsideRoot(root, target)`  -  path containment guard for write targets.
- `FileSnapshot`  -  capture/restore for mutating scripts (rollback on error).

Path resolution for builder vs consumer host modes lives in `ds-paths.mjs`
(`assetHref`, `bundleHref`, `importPath`). When you need to read a file in a new
script, import from the kernel  -  do not re-implement a local `read()`.

Both kernel modules have dependency-free `node:test` suites
(`scripts/*.test.mjs`), run in CI via `node --test scripts/*.test.mjs`. The
builder bootstrap integration gate stays its own step
(`node scripts/test-builder-bootstrap.mjs`).
