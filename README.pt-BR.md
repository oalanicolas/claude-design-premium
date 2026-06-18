# Claude Design Premium

Harness documentado para **Claude Design Web** — design system agnóstico, auto-configuração na
primeira mensagem, auditorias e handoff.

> Comunidade · não oficial · sem afiliação com a Anthropic.

[🇺🇸 English](README.md)

---

## Como usar (4 passos)

### 1. Baixar

[Baixe este repositório como ZIP](https://github.com/oalanicolas/claude-design-premium/archive/refs/heads/main.zip)
(Code → Download ZIP).

### 2. Enviar para o Claude Design

No seu projeto Claude Design Web (que já tem o design system em `_ds/`), faça upload do ZIP ou da
pasta extraída para a área de **upload** do projeto.

### 3. Subir para a raiz

Na mesma sessão, peça ao Claude:

```text
Copie todos os arquivos da pasta de upload para a raiz principal do projeto.
Não apague a pasta _ds/ que já existe.
```

### 4. Nova guia → GO

Abra uma **nova conversa/guia** no mesmo projeto e envie apenas:

```text
GO
```

O harness detecta que está desconfigurado, lê `_ds/`, gera `DESIGN.md`, `BOUND_DS.json`,
`styles.css`, patcheia os templates e pergunta qual superfície desenhar primeiro.

Pronto. Não precisa de npm, git, nem scripts dentro do canvas.

---

## O que vem no pacote

| Arquivo / pasta | Função |
|---|---|
| `CLAUDE.md` | Protocolo, roteamento, auto-setup |
| `DESIGN.md` | Template — substituído pelo auto-setup na primeira sessão |
| `skills/` | Procedimentos (auditorias, polish, handoff…) |
| `Starter.dc.html` | Guia vivo + galeria de componentes + prompts prontos |
| `AppShell`, `Landing`, `Deck`, `Doc` | Templates de superfície |
| `scripts/` | Manutenção **fora** do canvas (Node built-ins, sem npm) |

O harness **não inclui** `_ds/` — isso já vive no seu projeto Claude Design.

---

## Scripts locais (opcional, fora do canvas)

```bash
node scripts/context-signals.mjs
node scripts/bootstrap-harness.mjs
node scripts/detect-canvas-antipatterns.mjs .
```

Zero dependências npm. Detalhes em [`LIMITATIONS.md`](LIMITATIONS.md) e
[`docs/canvas-runtime.md`](docs/canvas-runtime.md).

---

## Versão anterior (greenfield)

O starter greenfield (`starter-kit/`, `templates/`, `components/`) foi arquivado em
[`_archive/v1/`](_archive/v1/).