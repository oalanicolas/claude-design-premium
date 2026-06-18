# Claude Design Premium

Harness para **Claude Design Web**. Funciona em **dois modos**: consumir um DS exportado (`_ds/`) ou
construir um design system na raiz do projeto (`_ds_manifest.json` + tokens). Configura sozinho e guia
a criação de interfaces.

> Comunidade · não oficial · sem afiliação com a Anthropic.

[🇺🇸 English](README.md)

---

## Como usar

### 1. Baixar

[Baixe o ZIP](https://github.com/oalanicolas/claude-design-premium/archive/refs/heads/main.zip) (Code -> Download ZIP).

### 2. Enviar no Claude Design

Faça upload do ZIP no seu projeto Claude Design:

- **Consumer**  -  app/landing que já tem `_ds/<bundle>/`
- **Builder**  -  projeto de design system com `_ds_manifest.json` na raiz

### 3. Subir para a raiz

Na mesma conversa, peça ao Claude:

```text
Copie todos os arquivos da pasta de upload para a raiz do projeto.
Mantenha o design system existente (_ds/ ou manifest + tokens na raiz).
```

### 4. Nova guia -> GO

Abra uma **nova guia** no mesmo projeto e envie:

```text
GO
```

Pronto. O auto-setup detecta **builder** ou **consumer**, gera `DESIGN.md`, materializa
`design-system.dc.html` e pergunta qual superfície desenhar primeiro.

**Não precisa** de npm, git nem terminal. Os `scripts/*.mjs` rodam **dentro do canvas**  -  Claude lê e
aplica a lógica JavaScript (pareado com as skills na ordem certa).

---

## O que vem no pacote

| Item | Função |
|---|---|
| `CLAUDE.md` | Protocolo, roteamento, ordem scripts -> skills |
| `DESIGN.md` | Identidade visual (gerado no passo 4) |
| `skills/` | Auditorias, polish, handoff (pareadas com scripts) |
| `scripts/` | Pipeline determinístico JS  -  **base do harness no canvas** |
| `design-system.dc.html` | Scaffold do bootstrap + prompts do harness; vitrine completa montada pelo modelo (`assemble-design-system-showcase`) |
| `support.js` | Runtime browser dos DCs |

Ordem: [`docs/script-pipeline.md`](docs/script-pipeline.md)

O harness **não traz** `_ds/`  -  isso já está no seu projeto.

---

## Mais detalhes

- Fluxo ponta a ponta: [`PLAYBOOK.md`](PLAYBOOK.md)
- Pipeline scripts + skills: [`docs/script-pipeline.md`](docs/script-pipeline.md)
- Handoff de frameworks: [`docs/adapters/`](docs/adapters/)
- Limitações: [`LIMITATIONS.md`](LIMITATIONS.md)
- Runtime do canvas: [`docs/canvas-runtime.md`](docs/canvas-runtime.md)
- Exports legados: [`docs/legacy-claude-design-exports.md`](docs/legacy-claude-design-exports.md)
