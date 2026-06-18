# Claude Design Premium

Document-backed harness for **Claude Design Web** — DS-agnostic, auto-setup on first message,
audits, and handoff.

> Community workflow · unofficial · not affiliated with Anthropic.

[🇧🇷 Português](README.pt-BR.md)

---

## How to use (4 steps)

### 1. Download

[Download this repo as ZIP](https://github.com/oalanicolas/claude-design-premium/archive/refs/heads/main.zip)
(Code → Download ZIP).

### 2. Upload to Claude Design

In your Claude Design Web project (which already has its design system under `_ds/`), upload the ZIP
or extracted folder to the project's **upload** area.

### 3. Promote to project root

In the same session, ask Claude:

```text
Copy all files from the upload folder to the project root.
Do not delete the existing _ds/ folder.
```

### 4. New tab → GO

Open a **new chat/tab** in the same project and send only:

```text
GO
```

The harness detects unconfigured state, reads `_ds/`, writes `DESIGN.md`, `BOUND_DS.json`,
`styles.css`, patches templates, and asks what surface to design first.

No npm, git, or shell scripts required inside the canvas.

---

## Package contents

| File / folder | Role |
|---|---|
| `CLAUDE.md` | Protocol, routing, auto-setup |
| `DESIGN.md` | Template — replaced by auto-setup on first session |
| `skills/` | Procedures (audits, polish, handoff…) |
| `Starter.dc.html` | Live guide + component gallery + ready prompts |
| `AppShell`, `Landing`, `Deck`, `Doc` | Surface templates |
| `scripts/` | Maintenance **outside** canvas (Node built-ins, no npm) |

The harness does **not** ship `_ds/` — that already lives in your Claude Design project.

---

## Local scripts (optional, outside canvas)

```bash
node scripts/context-signals.mjs
node scripts/bootstrap-harness.mjs
node scripts/detect-canvas-antipatterns.mjs .
```

Zero npm dependencies. See [`LIMITATIONS.md`](LIMITATIONS.md) and
[`docs/canvas-runtime.md`](docs/canvas-runtime.md).

---

## Previous version (greenfield)

The greenfield starter (`starter-kit/`, `templates/`, `components/`) is archived at
[`_archive/v1/`](_archive/v1/).