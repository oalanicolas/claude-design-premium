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

Pronto. O harness lê `_ds/`, gera `DESIGN.md`, personaliza os `*.dc.html` (comunicação + componentes do DS) e pergunta qual superfície desenhar primeiro.

**Não precisa** de npm, git, terminal nem scripts dentro do canvas.

---

## O que vem no pacote

| Item | Função |
|---|---|
| `CLAUDE.md` | Protocolo + auto-setup |
| `DESIGN.md` | Identidade visual (gerado no passo 4) |
| `skills/` | Auditorias, polish, handoff |
| `*.dc.html` | Templates de superfície |
| `scripts/` | Opcional — só fora do canvas |

O harness **não traz** `_ds/` — isso já está no seu projeto.

---

## Mais detalhes

- Limitações: [`LIMITATIONS.md`](LIMITATIONS.md)
- Runtime do canvas: [`docs/canvas-runtime.md`](docs/canvas-runtime.md)
- Versão antiga (greenfield): [`_archive/v1/`](_archive/v1/) — ignore se só quer o fluxo acima