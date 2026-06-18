# PROJECT BRIEF — `claude-design-premium`

## Documento oficial de execução para Claude Code

**Tipo:** README + PRD + Epic Plan + Growth Strategy + Build Spec  
**Versão:** 1.1  
**Data:** 14/jun/2026  
**Owner:** Alan Nicolas / @oalanicolas  
**Licença alvo:** MIT  
**Idioma dos artefatos públicos:** Inglês  
**Status:** Build-ready specification

---

# 0. Decisões finais do owner

Estas decisões substituem qualquer versão anterior do projeto.

## Nome canônico do repositório

```text
claude-design-premium
```

## Arquivo operacional central

```text
CLAUDE.md
```

Não criar `CLAUDE-ROUTER.md` como arquivo principal.  
Não usar `claude-design-skill-router` como nome do repo.  
Não posicionar o projeto como “apenas um router”.

O conceito de roteamento continua existindo, mas o produto público é **Claude Design Premium**: uma camada operacional de qualidade premium para Claude Design e Claude Code.

## Frase de posicionamento

```text
Premium UI operating layer for Claude Design & Claude Code.
```

## Mecanismo

```text
CLAUDE.md
  → routes document-backed .skill.md procedures
  → applies DESIGN.md + design-tokens.json
  → enforces premium UI craft, audits, polish, responsive checks, and accessibility review
  → reports what was applied, skipped, and recommended next
```

## Princípio central

```text
Premium is not a style. Premium is a repeatable operating procedure.
```

---

# 1. Como o Claude Code deve usar este documento

Este é o documento-fonte para construir o repositório inteiro. Leia tudo antes de criar arquivos.

Regras obrigatórias:

1. Construa na ordem dos Epics: **1 → 6**.
2. O arquivo central do repo é **`CLAUDE.md`**, com exatamente esse casing.
3. Não crie `CLAUDE-ROUTER.md` nem use esse nome em exemplos.
4. Todos os artefatos públicos do repo devem estar em **inglês**.
5. Este brief está em português, mas o repo final deve ser internacional.
6. Não invente métricas, depoimentos, números de stars, benchmarks ou resultados.
7. Onde faltar prova real, use placeholder explícito:

```html
<!-- TODO: attach real screenshot / measured result -->
```

8. Não coloque comandos de shell, scripts, URLs de rede ou instruções executáveis dentro de `CLAUDE.md` nem dentro dos arquivos `.skill.md`.
9. Cada `.skill.md` deve ter: `name`, `purpose`, `when to use`, `procedure`, `output contract`, `failure modes`, `example invocation`.
10. Toda claim forte no README precisa ter sustentação em exemplos, checklist ou limitation correspondente.
11. A copy pode usar “enforce”, mas deve explicar que o enforcement é **procedural and reviewable**, não determinístico.

---

# 2. Resumo executivo

Criar um repositório público chamado `claude-design-premium`.

O projeto entrega uma camada operacional em documentos para transformar Claude Design e Claude Code em parceiros mais consistentes de UI premium.

O problema: Claude Design e Claude Code podem gerar interfaces bonitas, mas sem uma camada operacional eles tendem a sofrer com:

- inconsistência de tokens;
- estética genérica de IA;
- excesso de cards, sombras, gradients e rounded corners;
- hierarquia visual fraca;
- responsividade tratada tarde demais;
- acessibilidade pulada;
- código Tailwind arbitrário;
- ausência de fase de polish;
- nenhuma transparência sobre quais critérios foram aplicados.

A solução: um arquivo central `CLAUDE.md` que roteia procedimentos reutilizáveis `.skill.md`, ancorados em `DESIGN.md` e `design-tokens.json`, para aplicar auditorias, polish, responsividade, acessibilidade, design-system consistency e disciplina de implementação.

Tese pública:

```text
Claude Design without an operating layer is taste roulette.
Claude Design Premium turns premium UI craft into reusable procedures.
```

One-liner para GitHub:

```text
Premium UI operating layer for Claude Design & Claude Code. Use CLAUDE.md to orchestrate .skill.md procedures, DESIGN.md and tokens for design-system enforcement, UI audits, polish, responsive checks and accessibility review.
```

Disclaimer obrigatório:

```text
Unofficial community workflow. Not affiliated with Anthropic.
```

---

# 3. Nome, posicionamento e SEO

## Nome do repo

```text
claude-design-premium
```

## Pattern name

```text
Claude Design Premium Protocol
```

## Mechanism name

```text
document-backed skill routing
```

## Slogan

```text
Repeatable premium taste for Claude Design.
```

## Subtítulo do README

```text
Premium UI operating layer for Claude Design & Claude Code.
```

## Descrição GitHub

```text
Premium UI operating layer for Claude Design & Claude Code. Use CLAUDE.md to orchestrate .skill.md docs, DESIGN.md and tokens for UI audits, polish, responsive checks and accessibility.
```

## Topics sugeridos

```text
claude
claude-design
claude-code
claude-skills
agent-skills
premium-ui
design-system
design-tokens
prompt-engineering
context-engineering
tailwindcss
shadcn-ui
frontend-ai
ai-ui
ux-audit
accessibility
responsive-design
```

## Não usar como posicionamento

Não usar no README principal:

- “zero slop” como promessa técnica;
- “god tier”;
- “o repo definitivo”;
- “garante UI production-ready”;
- “substitui designer”;
- “substitui Skills nativas”;
- “instala Skills dentro do Claude Design”.

Pode usar uma linguagem forte, mas sustentada por mecanismo, exemplos e limitações.

---

# 4. Contrato de linguagem e claims

## Pode afirmar

| Claim | Formulação permitida | Prova necessária |
|---|---|---|
| Design-system enforcement | “Enforces your DESIGN.md and tokens through explicit review procedures.” | `examples/design-system/` + skill checklist |
| Token consistency | “Checks generated UI against design-tokens.json.” | `design-system-guardian.skill.md` + example output |
| UI audit | “Runs reusable UI audit procedures.” | `ui-audit.skill.md` + router output |
| Polish phase | “Adds a repeatable polish phase.” | `polish-phase.skill.md` + example output |
| Mobile-first review | “Requires mobile-first review before final approval.” | `mobile-first-audit.skill.md` |
| Accessibility review | “Requires accessibility review before final approval.” | `accessibility-audit.skill.md` + limitations |
| Transparent reporting | “Reports SKILLS APPLIED, NOT APPLIED and NEXT RECOMMENDED.” | `router-output.md` examples |

## Como explicar “enforce”

Usar esta explicação no README ou em `LIMITATIONS.md`:

```text
In this repo, “enforce” means procedural enforcement: Claude is explicitly instructed to check against CLAUDE.md, DESIGN.md, design-tokens.json and relevant skill documents, then report what it applied or skipped. This is reviewable guidance, not deterministic policy enforcement. Human review is still required.
```

## Proibido

Não afirmar:

- “tested and working today” sem prova visual real;
- “production-ready” sem checklist e caveat;
- “WCAG compliant” sem teste real;
- “performance optimized” sem medição;
- “works automatically every time”;
- métricas não medidas;
- depoimentos não reais;
- screenshots inexistentes.

---

# 5. PRD — requisitos do produto

## 5.1 Usuários-alvo

1. **Founders e PMs** prototipando no Claude Design.
2. **Frontend developers** usando Claude Code em repos reais.
3. **Designers** usando Claude como parceiro de direção visual.
4. **Agências** que precisam repetir padrões premium por cliente.
5. **Times SaaS** com design system existente.

## 5.2 Problemas que o repo resolve

- Claude gera UI visualmente agradável, mas inconsistente.
- Prompts longos viram ruído e não escalam.
- O usuário não sabe quais critérios Claude aplicou.
- Claude pula mobile, accessibility e polish se não forem explicitamente exigidos.
- Claude pode inventar tokens e classes arbitrárias.
- Claude pode fazer UI “premium-looking” mas fraca para produção.

## 5.3 Proposta de valor

`claude-design-premium` transforma gosto visual em procedimento reutilizável:

1. `CLAUDE.md` define regras de roteamento e comportamento.
2. `DESIGN.md` define estética, princípios e sistema visual.
3. `design-tokens.json` define a fonte de verdade de tokens.
4. `.skill.md` define procedimentos específicos.
5. Claude aplica apenas os procedimentos relevantes.
6. Claude reporta o que aplicou, o que pulou e o que recomenda a seguir.

## 5.4 Requisitos funcionais

- **RF1:** Criar `CLAUDE.md` como arquivo central.
- **RF2:** Criar 6 arquivos `.skill.md` autocontidos.
- **RF3:** Criar `DESIGN.md.example` forte, opinativo e útil.
- **RF4:** Criar `design-tokens.json.example` funcional.
- **RF5:** Criar `activation-prompt.md`.
- **RF6:** Criar `README.md` com quickstart claro.
- **RF7:** Criar `LIMITATIONS.md` com caveats fortes.
- **RF8:** Criar `SECURITY.md` obrigatório.
- **RF9:** Criar exemplos reproduzíveis em `examples/`.
- **RF10:** Criar templates para novas skills.
- **RF11:** Criar issue templates e PR template.
- **RF12:** Criar `docs/validation-method.md` para testar carregamento e roteamento.

## 5.5 Requisitos não funcionais

- Arquivos coláveis são inertes.
- Roteamento seletivo, não aplicação total.
- Repo é copy-paste first.
- Cada arquivo deve funcionar isoladamente.
- `CLAUDE.md` deve ter menos de aproximadamente 150 linhas.
- Cada skill deve ser lida em menos de 2 minutos.
- O README deve permitir primeiro teste em menos de 2 minutos.
- Sem dependências, sem backend, sem CLI na v0.1.0.

## 5.6 Fora de escopo v0.1.0

- CLI.
- Instalação nativa de Skills.
- Marketplace.
- App web.
- Benchmarks.
- Automação de screenshots.
- Declarações de conformidade legal, WCAG ou performance.
- Biblioteca infinita de skills.

---

# 6. Arquitetura do repositório

Estrutura final alvo:

```text
claude-design-premium/
├── README.md
├── README.pt-BR.md
├── CLAUDE.md
├── DESIGN.md.example
├── design-tokens.json.example
├── activation-prompt.md
├── PLAYBOOK.md
├── PROMPTS-LIBRARY.md
├── LIMITATIONS.md
├── SECURITY.md
├── CHANGELOG.md
├── LICENSE
├── CONTRIBUTING.md
├── .gitignore
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── skill_request.md
│   │   └── example_submission.md
│   └── pull_request_template.md
├── skills/
│   ├── design-system-guardian.skill.md
│   ├── ui-audit.skill.md
│   ├── polish-phase.skill.md
│   ├── tailwind-audit.skill.md
│   ├── mobile-first-audit.skill.md
│   └── accessibility-audit.skill.md
├── templates/
│   ├── new-skill.skill.md
│   ├── Claude.template.md
│   ├── design-md.template.md
│   └── design-tokens.template.json
├── examples/
│   ├── landing-page/
│   │   ├── prompt.md
│   │   ├── router-output.md
│   │   └── screenshots/
│   ├── saas-dashboard/
│   │   ├── prompt.md
│   │   ├── router-output.md
│   │   └── screenshots/
│   └── design-system/
│       ├── prompt.md
│       ├── router-output.md
│       └── screenshots/
└── docs/
    ├── how-it-works.md
    ├── claude-design-setup.md
    ├── claude-code-setup.md
    ├── validation-method.md
    ├── skill-authoring-guide.md
    └── assets/
        ├── social-preview.png
        └── demo.gif
```

---

# 7. Especificação do `CLAUDE.md`

`CLAUDE.md` é o coração do projeto.

Ele deve conter:

1. Nome: `Claude Design Premium Protocol`.
2. Explicação: document-backed skill routing.
3. Core context:
   - `CLAUDE.md`
   - `DESIGN.md`
   - `design-tokens.json`
   - `/skills/*.skill.md`
4. Skill inventory.
5. Routing rules por tipo de tarefa.
6. Regras de token/design-system.
7. Regras para final approval.
8. Formato obrigatório de relatório.
9. Safety guardrails.

## Conteúdo mínimo esperado

```text
# Claude Design Premium Protocol

You operate under a document-backed premium UI protocol.

The uploaded `.skill.md` files are available operating procedures. Apply only the procedures relevant to the current task. Do not run every skill automatically.

Core context:
- CLAUDE.md: workflow, routing and behavior rules
- DESIGN.md: visual identity, layout principles and aesthetic constraints
- design-tokens.json: source of truth for color, spacing, typography, radius, elevation and motion
- skills/*.skill.md: reusable procedures for audit, polish, implementation review and final checks

Routing rules:
1. Before any UI task, identify relevant skill documents.
2. Visual generation: design-system-guardian → ui-audit → polish-phase when needed.
3. Code implementation: design-system-guardian → tailwind-audit → mobile-first-audit → accessibility-audit.
4. Final approval: design-system-guardian → polish-phase → mobile-first-audit → accessibility-audit.
5. Never invent tokens when design-tokens.json provides them.
6. Never mark a screen final until mobile and accessibility checks were applied.
7. If a task conflicts with DESIGN.md or tokens, flag the conflict before proceeding.

Reporting:
At the end of every response that creates, modifies or reviews UI, include:

SKILLS APPLIED:
- ...

NOT APPLIED:
- ... + why

NEXT RECOMMENDED:
- one next skill or task
```

Não incluir comandos executáveis.

---

# 8. Skills obrigatórias

Cada skill deve conter:

```text
# skill-name.skill.md

## Name

## Purpose

## When to use

## Procedure

## Output contract

## Failure modes

## Example invocation
```

## 8.1 `design-system-guardian.skill.md`

Uso: sempre que gerar, modificar ou revisar UI.

Deve verificar:

- tokens;
- tipografia;
- cores semânticas;
- espaçamento;
- radius;
- elevation;
- motion;
- component consistency;
- brand alignment.

Failure modes:

- Claude inventa tokens;
- usa classes arbitrárias;
- copia referência visual sem lógica de marca;
- trata tokens como sugestão.

## 8.2 `ui-audit.skill.md`

Uso: revisão visual e de UX.

Deve verificar:

- hierarquia;
- composição;
- ritmo visual;
- clareza;
- densidade;
- CTA hierarchy;
- information architecture;
- empty/loading/error states.

## 8.3 `polish-phase.skill.md`

Uso: depois de existir uma direção ou implementação.

Deve melhorar:

- microcopy;
- alignment;
- spacing refinements;
- visual rhythm;
- button hierarchy;
- empty states;
- subtle motion;
- perceived premium quality.

Não deve redesenhar tudo.

## 8.4 `tailwind-audit.skill.md`

Uso: apenas quando há código.

Deve verificar:

- arbitrary values;
- duplicated utility patterns;
- token violations;
- fragile breakpoints;
- CSS sprawl;
- unnecessary wrappers;
- monolithic components.

## 8.5 `mobile-first-audit.skill.md`

Uso: antes de qualquer tela ser considerada final.

Deve verificar:

- 320px;
- 375px;
- 430px;
- 768px;
- 1024px;
- 1440px;
- tap targets;
- horizontal overflow;
- nav behavior;
- stacking;
- modals/drawers.

## 8.6 `accessibility-audit.skill.md`

Uso: antes de finalização ou produção.

Deve verificar:

- semantic structure;
- headings;
- keyboard navigation;
- focus states;
- contrast;
- form labels;
- ARIA;
- reduced motion;
- screen-reader clarity.

Aviso obrigatório:

```text
Do not claim WCAG compliance without real implementation testing.
```

---

# 9. Epics e tasks

## EPIC 1 — Core protocol and source of truth

- [ ] T1.1 Criar `CLAUDE.md` conforme especificação.
- [ ] T1.2 Criar `DESIGN.md.example` forte e opinativo.
- [ ] T1.3 Criar `design-tokens.json.example` funcional.
- [ ] T1.4 Criar `activation-prompt.md`.
- [ ] T1.5 Criar `docs/validation-method.md`.

## EPIC 2 — Six premium UI skills

- [ ] T2.1 Criar `skills/design-system-guardian.skill.md`.
- [ ] T2.2 Criar `skills/ui-audit.skill.md`.
- [ ] T2.3 Criar `skills/polish-phase.skill.md`.
- [ ] T2.4 Criar `skills/tailwind-audit.skill.md`.
- [ ] T2.5 Criar `skills/mobile-first-audit.skill.md`.
- [ ] T2.6 Criar `skills/accessibility-audit.skill.md`.

## EPIC 3 — Templates and contribution loop

- [ ] T3.1 Criar `templates/new-skill.skill.md`.
- [ ] T3.2 Criar `templates/Claude.template.md`.
- [ ] T3.3 Criar `templates/design-md.template.md`.
- [ ] T3.4 Criar `templates/design-tokens.template.json`.
- [ ] T3.5 Criar `CONTRIBUTING.md`.
- [ ] T3.6 Criar issue templates e PR template.

## EPIC 4 — Support documentation

- [ ] T4.1 Criar `docs/how-it-works.md`.
- [ ] T4.2 Criar `docs/claude-design-setup.md`.
- [ ] T4.3 Criar `docs/claude-code-setup.md`.
- [ ] T4.4 Criar `docs/skill-authoring-guide.md`.
- [ ] T4.5 Criar `PLAYBOOK.md`.
- [ ] T4.6 Criar `PROMPTS-LIBRARY.md`.
- [ ] T4.7 Criar `LIMITATIONS.md`.
- [ ] T4.8 Criar `SECURITY.md`.
- [ ] T4.9 Criar `CHANGELOG.md`.

## EPIC 5 — Examples and evidence

- [ ] T5.1 Criar `examples/landing-page/` com `prompt.md`, `router-output.md`, `screenshots/`.
- [ ] T5.2 Criar `examples/saas-dashboard/` com `prompt.md`, `router-output.md`, `screenshots/`.
- [ ] T5.3 Criar `examples/design-system/` com `prompt.md`, `router-output.md`, `screenshots/`.
- [ ] T5.4 Onde não houver prova visual real, inserir TODO explícito.
- [ ] T5.5 Não afirmar resultado real sem artefato correspondente.

## EPIC 6 — README and release packaging

- [ ] T6.1 Criar `README.md`.
- [ ] T6.2 Criar `README.pt-BR.md`.
- [ ] T6.3 Criar `LICENSE` MIT.
- [ ] T6.4 Criar `.gitignore`.
- [ ] T6.5 Conferir contrato de claims.
- [ ] T6.6 Conferir segurança dos arquivos coláveis.
- [ ] T6.7 Criar checklist de release em `CHANGELOG.md`.

---

# 10. README — ordem recomendada

`README.md` deve seguir esta ordem:

1. Title + one-liner.
2. Unofficial disclaimer.
3. GIF/screenshot placeholder.
4. Problem: Claude Design without an operating layer is taste roulette.
5. Solution: Claude Design Premium Protocol.
6. Quick Start.
7. How it works.
8. Included files.
9. Included skills.
10. Example workflows.
11. Why “enforce”?
12. Limitations.
13. Contributing.
14. License.

## Abertura sugerida

```markdown
# Claude Design Premium 🧠✨

**Premium UI operating layer for Claude Design & Claude Code.**

Use `CLAUDE.md` to orchestrate document-backed `.skill.md` procedures over `DESIGN.md` and `design-tokens.json`, so Claude applies repeatable UI procedures: design-system enforcement, visual audits, polish passes, responsive checks, accessibility review, and Tailwind discipline.

> Unofficial community workflow. Not affiliated with Anthropic.

Claude Design can create impressive prototypes, but without an operating layer it may drift into generic layouts, inconsistent tokens, weak responsiveness, skipped accessibility, and shallow polish.

Claude Design Premium turns premium UI craft into a repeatable procedure.
```

## Quick Start sugerido

```markdown
## Quick Start

1. Create a new Claude Design project.
2. Upload:
   - `CLAUDE.md`
   - `DESIGN.md.example`
   - `design-tokens.json.example`
   - all files inside `/skills`
3. Paste the contents of `activation-prompt.md`.
4. Ask Claude Design:

```text
Create a premium SaaS dashboard for a fintech analytics product.
Use Claude Design Premium and report which skills were applied.
```

5. Check the final `SKILLS APPLIED`, `NOT APPLIED`, and `NEXT RECOMMENDED` report.
```

---

# 11. Growth strategy

## 11.1 Objetivo

Fazer o repo ser percebido como o padrão prático para transformar Claude Design em um sistema mais consistente de UI premium.

Não vender como pack de prompts. Vender como **operating layer**.

## 11.2 Frase que viaja

```text
Claude Design without an operating layer is taste roulette.
Claude Design Premium gives you repeatable premium taste.
```

## 11.3 Funil de adoção

1. **Descoberta:** X, LinkedIn, Reddit, newsletters, comunidades Claude.
2. **Entendimento:** README mostra a dor em 5 segundos.
3. **Aha:** usuário sobe arquivos e vê `SKILLS APPLIED`.
4. **Retenção:** usuário adapta `DESIGN.md` e cria novas skills.
5. **Contribuição:** usuário submete skill, example ou before/after.

## 11.4 Assets de growth

Criar placeholders:

- `docs/assets/social-preview.png`
- `docs/assets/demo.gif`

Não afirmar que existem screenshots reais se forem placeholders.

## 11.5 Launch plan

### Pré-launch

- Criar 3 exemplos mínimos.
- Gerar pelo menos 1 screenshot real.
- Gerar 1 GIF curto.
- Validar `CLAUDE.md` em Claude Design com teste canary.
- Revisar segurança.

### Dia 0

- Publicar GitHub repo.
- Criar release `v0.1.0`.
- Publicar thread X com GIF.
- Publicar Reddit r/ClaudeAI e r/ClaudeCode focando no mecanismo.
- Publicar LinkedIn post para designers/devs.

### Semana 1

- Responder issues.
- Aceitar skills da comunidade.
- Publicar mini demo Loom/YouTube.
- Criar pack futuro: landing pages.

## 11.6 Future packs

Não lançar no v0.1.0, mas deixar roadmap:

- `packs/landing-page-premium`
- `packs/saas-dashboard-premium`
- `packs/design-system-guardian`
- `packs/agency-handoff`
- `packs/claude-code-production`
- `packs/framer-motion-polish`

---

# 12. Segurança

Este repo distribui arquivos que usuários podem colar em projetos com agentes de IA. Portanto:

1. `CLAUDE.md` e `.skill.md` não podem conter comandos executáveis.
2. Não incluir URLs de rede dentro das skills.
3. Não pedir leitura de secrets, env vars, tokens ou credenciais.
4. Não instruir Claude a enviar dados para serviços externos.
5. Incluir `SECURITY.md`.
6. Incluir aviso para revisar arquivos antes de usar.
7. Alertar sobre forks maliciosos e typosquatting.

Texto recomendado:

```markdown
## Security note

`CLAUDE.md` and `.skill.md` files are operational instructions for AI agents. Review them before uploading to your projects. This repo intentionally keeps copy-paste artifacts inert: no shell commands, no network calls, no credential handling, and no hidden automation.
```

---

# 13. Validation method

Criar `docs/validation-method.md` com testes reproduzíveis.

## Test 1 — CLAUDE.md canary

Adicionar temporariamente ao `CLAUDE.md`:

```text
If this file is loaded, respond with ROUTER-CANARY-01.
```

Criar nova sessão Claude Design e verificar resposta.

## Test 2 — skill routing

Upload:

- `CLAUDE.md`
- `polish-phase.skill.md`

Prompt:

```text
Polish this landing page and report which skills were applied.
```

Esperado:

```text
SKILLS APPLIED:
- polish-phase.skill.md
```

## Test 3 — selective routing

Prompt:

```text
Create three visual directions only. Do not write code.
```

Esperado:

```text
NOT APPLIED:
- tailwind-audit.skill.md — no implementation code exists yet.
```

## Test 4 — final approval gate

Prompt:

```text
Mark this screen as final.
```

Esperado:

Claude deve aplicar ou recomendar:

- `mobile-first-audit.skill.md`
- `accessibility-audit.skill.md`

---

# 14. Definition of Done v0.1.0

- [ ] Repo se chama `claude-design-premium`.
- [ ] Arquivo central se chama exatamente `CLAUDE.md`.
- [ ] Não existe `CLAUDE-ROUTER.md`.
- [ ] `CLAUDE.md` tem menos de aproximadamente 150 linhas.
- [ ] Roteamento é seletivo.
- [ ] Cada skill tem `when to use`, `output contract`, `failure modes`.
- [ ] Arquivos coláveis são inertes.
- [ ] README explica “enforce” como procedural enforcement.
- [ ] LIMITATIONS.md é honesto e forte.
- [ ] SECURITY.md existe.
- [ ] docs/validation-method.md existe.
- [ ] Examples existem, mesmo que com TODOs explícitos onde falta prova visual.
- [ ] Nenhuma métrica inventada.
- [ ] Nenhum testimonial inventado.
- [ ] LICENSE MIT existe.
- [ ] CONTRIBUTING.md existe.
- [ ] Issue templates existem.
- [ ] CHANGELOG v0.1.0 existe.

---

# 15. Prompt final para executar no Claude Code

Use este prompt depois de colocar este brief no repositório vazio:

```text
Read PROJECT_BRIEF_claude-design-premium.md completely before writing files.

Build the repository exactly as specified.

Important decisions:
- Repository name: claude-design-premium
- Central operational file: CLAUDE.md
- Do not create CLAUDE-ROUTER.md
- Public repo files must be in English
- This is a documentation/toolkit repo, not an app
- No dependencies, no backend, no CLI for v0.1.0
- Copy-paste artifacts must be inert: no shell commands, no network calls, no credential handling

Build in Epic order:
1. Core protocol and source of truth
2. Six premium UI skills
3. Templates and contribution loop
4. Support documentation
5. Examples and evidence placeholders
6. README and release packaging

Do not invent screenshots, benchmarks, testimonials, metrics or usage claims.
Use explicit TODO placeholders where proof is missing.

After creating the files, run a QA pass against the Definition of Done and report what was created, what remains TODO, and any risk you found.
```

---

# 16. Final operating principle

```text
Premium UI is not a vibe prompt.
Premium UI is a governed workflow:
context → tokens → skill routing → audit → polish → mobile → accessibility → transparent report.
```

Fim do brief.
