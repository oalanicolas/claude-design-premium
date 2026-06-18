# Validation Method

Reproducible tests to confirm that root `CLAUDE.md` routing, native Claude Design hooks, and
document-backed procedures behave as intended.

> Results depend on the model and context state. These tests check **expected behavior**, not
> guaranteed determinism. See [`LIMITATIONS.md`](../LIMITATIONS.md).

## Test 1: native design-system proof

Inside Claude Design, run the native design-system check after binding the harness.

**Expected:** `check_design_system` reports no issues when the DS is complete; manifest has populated
`globalCssPaths`, `tokens`, and `cards`; components resolve in the design-system namespace.

Harness `scripts/*.mjs` are deterministic preflight **inside the canvas** (Claude executes their JS
logic). See [`script-pipeline.md`](script-pipeline.md).

## Test 1B: root `CLAUDE.md` canary

Start a fresh Claude Design Web project with `CLAUDE.md` at the project root and ask for bootstrap
validation. The response should contain:

```text
CDP-CLAUDE-OK
```

**Pass:** canary appears. **Fail:** root bootstrap may not have loaded; use `activation-prompt.md`
as fallback.

## Test 1H: local deterministic validation (gates vs advisory)

From the repository root:

```bash
# Gates (must pass in CI)
node --check scripts/*.mjs
node scripts/test-builder-bootstrap.mjs
node scripts/context-signals.mjs
node scripts/bootstrap-harness.mjs --check

# Advisory (visible in CI, non-blocking today)
node scripts/detect-canvas-antipatterns.mjs *.dc.html
node scripts/detect-text-antipatterns.mjs CLAUDE.md DESIGN.md skills
```

**Gate expectations:**

- `context-signals.mjs` emits valid JSON.
- On a configured maintainer checkout: `harness.needsAutoSetup` is `false`, `canvas.dcCount` is `1`
  (`design-system.dc.html` only).
- `test-builder-bootstrap.mjs` passes using `fixtures/builder-ds/`.

**Advisory expectations:**

- `detect-canvas-antipatterns` on root `*.dc.html` should report **zero P1** before release.
- `detect-text-antipatterns` may still flag Unicode arrows/dashes in protocol tables; treat as copy
  debt, not a functional failure, until normalized.

P1 = deterministic correctness or hard bans. P2 = review notes. Use `--strict` to fail on P2 locally.

## Test 1I: harness script pipeline (canvas)

In a Claude Design project with the host DS present, send `GO` in a new tab.

**Expected:**

1. Claude executes `context-signals` logic and reports `SCRIPTS APPLIED`.
2. Pipeline runs per [`script-pipeline.md`](script-pipeline.md): detect-bound-ds -> extract-ds-voice
   -> bootstrap-harness -> personalize-dc (seam).
3. `BOUND_DS.json`, `styles.css`, `DESIGN.md` written; design-system DC materialized (no `{{INTRO_`
   or `{{DS_HELMET_BLOCK}}` placeholders left).
4. Response includes `HARNESS AUTO-SETUP` and asks for the first surface.

**Fail:** Claude tells the user to run shell commands in the canvas, or skips scripts entirely.

## Test 1J: binding refresh on DS drift

After changing manifest components, token paths, or namespace in the host DS:

```bash
node scripts/bootstrap-harness.mjs
```

**Expected:** bootstrap re-binds (not `No-op`) and updates `BOUND_DS.json`, `styles.css`, and
`DESIGN.md` to match the live DS.

**Fail:** `No-op` while `context-signals` reports `bindingOutOfSync: true`.

## Test 2: routing table

Ask for a new landing page.

**Expected:** Claude reads `BOUND_DS.json`, `DESIGN.md`, bound token CSS, runs
`design-system-guardian`, and ends with a `SKILLS APPLIED` block.

## Test 3: audit pairing

Ask for a final review of a DC.

**Expected:** `detect-canvas-antipatterns` logic runs before mobile/accessibility judgment; reporting
block lists scripts and skills applied.
