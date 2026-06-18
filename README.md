# Claude Design Premium

Harness for **Claude Design Web**. Detects your project's design system (`_ds/`), self-configures,
and guides premium UI work.

> Community workflow · unofficial · not affiliated with Anthropic.

[🇧🇷 Português](README.pt-BR.md)

---

## How to use

### 1. Download

[Download the ZIP](https://github.com/oalanicolas/claude-design-premium/archive/refs/heads/main.zip) (Code → Download ZIP).

### 2. Upload to Claude Design

In your Claude Design project (which **already has** `_ds/` with your design system), upload the ZIP.

### 3. Promote to project root

In the same chat, ask Claude:

```text
Copy all files from the upload folder to the project root.
Do not delete the existing _ds/ folder.
```

### 4. New tab → GO

Open a **new tab** in the same project and send:

```text
GO
```

Done. The harness reads `_ds/`, generates `DESIGN.md`, personalizes `*.dc.html` (voice + DS components), and asks what surface to design first.

**No** npm, git, terminal, or scripts required inside the canvas.

---

## Package contents

| Item | Role |
|---|---|
| `CLAUDE.md` | Protocol + auto-setup |
| `DESIGN.md` | Visual identity (generated in step 4) |
| `skills/` | Audits, polish, handoff |
| `*.dc.html` | Surface templates |
| `scripts/` | Optional — outside canvas only |

The harness does **not** ship `_ds/` — that already lives in your project.

---

## More details

- Limitations: [`LIMITATIONS.md`](LIMITATIONS.md)
- Canvas runtime: [`docs/canvas-runtime.md`](docs/canvas-runtime.md)
- Old version (greenfield): [`_archive/v1/`](_archive/v1/) — ignore if you only need the flow above