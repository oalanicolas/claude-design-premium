# Claude Design Premium

Harness for **Claude Design Web**. Works in **two host modes**: consume an exported DS (`_ds/`) or
build a design system at the project root (`_ds_manifest.json` + tokens). Self-configures and guides
premium UI work.

> Community workflow · unofficial · not affiliated with Anthropic.

[🇧🇷 Português](README.pt-BR.md)

---

## How to use

### 1. Download

[Download the ZIP](https://github.com/oalanicolas/claude-design-premium/archive/refs/heads/main.zip) (Code -> Download ZIP).

### 2. Upload to Claude Design

Upload the ZIP to your Claude Design project:

- **Consumer**  -  app/landing that already has `_ds/<bundle>/`
- **Builder**  -  design system project with `_ds_manifest.json` at the root

### 3. Promote to project root

In the same chat, ask Claude:

```text
Copy all files from the upload folder to the project root.
Keep the existing design system files (_ds/ or root manifest + tokens).
```

### 4. New tab -> GO

Open a **new tab** in the same project and send:

```text
GO
```

Done. Auto-setup detects **builder** or **consumer** mode, generates `DESIGN.md`, materializes
`design-system.dc.html`, and asks what to design first.

**No** npm, git, or terminal required. `scripts/*.mjs` **run inside the canvas**  -  Claude reads and
applies their JavaScript logic (paired with skills in the correct order).

---

## Package contents

| Item | Role |
|---|---|
| `CLAUDE.md` | Protocol, routing, scripts -> skills order |
| `DESIGN.md` | Visual identity (generated in step 4) |
| `skills/` | Audits, polish, handoff (paired with scripts) |
| `scripts/` | Deterministic JS pipeline  -  **harness foundation in canvas** |
| `design-system.dc.html` | Bootstrap scaffold + harness prompts; full showcase assembled by the model (`assemble-design-system-showcase`) |
| `support.js` | Browser runtime for DCs |

Order: [`docs/script-pipeline.md`](docs/script-pipeline.md)

The harness does **not** ship a design system  -  it binds to yours (root manifest or `_ds/` export).

---

## More details

- End-to-end workflow: [`PLAYBOOK.md`](PLAYBOOK.md)
- Script + skill pipeline: [`docs/script-pipeline.md`](docs/script-pipeline.md)
- Framework handoff: [`docs/adapters/`](docs/adapters/)
- Limitations: [`LIMITATIONS.md`](LIMITATIONS.md)
- Canvas runtime: [`docs/canvas-runtime.md`](docs/canvas-runtime.md)
- Legacy exports: [`docs/legacy-claude-design-exports.md`](docs/legacy-claude-design-exports.md)
