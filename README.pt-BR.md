# Claude Design Premium

Harness para **Claude Design Web**. Detecta o design system do projeto (`_ds/`), configura sozinho e guia a criação de interfaces.

> Comunidade · não oficial · sem afiliação com a Anthropic.

[🇺🇸 English](README.md)

---

## Como usar

### 1. Baixar

[Baixe o ZIP](https://github.com/oalanicolas/claude-design-premium/archive/refs/heads/main.zip) (Code → Download ZIP).

### 2. Enviar no Claude Design

No seu projeto Claude Design (que **já tem** a pasta `_ds/` com o design system), faça upload do ZIP.

### 3. Subir para a raiz

Na mesma conversa, peça ao Claude:

```text
Copie todos os arquivos da pasta de upload para a raiz do projeto.
Não apague a pasta _ds/.
```

### 4. Nova guia → GO

Abra uma **nova guia** no mesmo projeto e envie:

```text
GO
```

Pronto. O harness executa o pipeline de scripts + skills: lê `_ds/`, gera `DESIGN.md`, personaliza os
`*.dc.html` e pergunta qual superfície desenhar primeiro.

**Não precisa** de npm, git nem terminal. Os `scripts/*.mjs` rodam **dentro do canvas** — Claude lê e
aplica a lógica JavaScript (pareado com as skills na ordem certa).

---

## O que vem no pacote

| Item | Função |
|---|---|
| `CLAUDE.md` | Protocolo, roteamento, ordem scripts → skills |
| `DESIGN.md` | Identidade visual (gerado no passo 4) |
| `skills/` | Auditorias, polish, handoff (pareadas com scripts) |
| `scripts/` | Pipeline determinístico JS — **base do harness no canvas** |
| `*.dc.html` | Templates de superfície |
| `support.js`, `deck-stage.js` | Runtime browser dos DCs |

Ordem: [`docs/script-pipeline.md`](docs/script-pipeline.md)

O harness **não traz** `_ds/` — isso já está no seu projeto.

---

## Mais detalhes

- Pipeline scripts + skills: [`docs/script-pipeline.md`](docs/script-pipeline.md)
- Limitações: [`LIMITATIONS.md`](LIMITATIONS.md)
- Runtime do canvas: [`docs/canvas-runtime.md`](docs/canvas-runtime.md)
- Versão antiga (greenfield): [`_archive/v1/`](_archive/v1/)