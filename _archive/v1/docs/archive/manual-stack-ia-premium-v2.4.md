# Manual de Boas Práticas — Layouts Premium com IA

*Versão 2.4 · jun/2026 · stress-test crítico + correções verificadas em fonte primária + ponte para o starter-kit*
*Feito para um dev que prefere evidência a hype. Onde a evidência é fraca, está marcado.*

> **Mudança na v2.4:** adicionada §11 (ponte para o pacote operacional / starter-kit). O kit é um conjunto de arquivos separado — este manual apenas o referencia, mantendo a separação entre "documento para pensar" e "arquivos para a máquina executar".
> **Mudanças na v2.3 (correções de evidência):**
> - **§2 corrigida na fonte primária.** O README do Impeccable (release Skill 3.1.1, mai/2026) foi lido diretamente: o Impeccable **constrói sobre** a `frontend-design` oficial e a credita (NOTICE.md). **NÃO há a alegação de "conflito que anula" que versões anteriores deste manual afirmavam** — essa afirmação veio de resumo de terceiro e estava errada. Correção registrada abaixo.
> - **§5.2** atualizada com o aumento de limites do Claude Code (mai/2026) — *atribuído à fonte citada, não verificado por mim*.
> - **§1** shadcn/Base UI: status movido de "não verificado" para "confirmado por terceiros" — *ainda não validei na doc oficial; trate como provável*.
> - **§3.2/§7** valor do Three.js corrigido (~350–490kb, não ~140kb).
> - **§8.5** adicionado padrão W3C DTCG.
> - Estatística "61% dos SOTD usam 3D" marcada como não verificada na §7.
> - **v2.2:** §10 (Alternativas). **v2.1:** §8 (Tokens) e §9 (Testes/CI/CD); reforço da §7.

---

## Princípio zero — o que este manual promete (e o que não promete)

A ferramenta te leva a **"premium consistente"**, não a Awwwards. Ela elimina os *tells* de slop, força tipografia decente e gera componentes sólidos. O salto de "bom" para "excepcional" continua sendo **taste humano** — nenhuma ferramenta aqui resolve isso.

> Regra-síntese: **humano como diretor de arte, IA como executor rápido — nunca o contrário.** Nenhum caso documentado mostrou fluxo confiável "briefing → deploy sem intervenção". Quem produz em nível premium consistente dedica tempo significativo a revisão e polimento manual.

A IA eleva o **piso**, você é responsável pelo **teto**.

---

## 1. Framework base — escolha por função, não por hábito

A pergunta não é "Next ou Vite". É: **isto precisa ser server-rendered?**

| Tipo de projeto | Escolha | Por quê |
|---|---|---|
| Dashboard, SaaS logado, app interno, ferramenta | **Vite + React Router** | SEO irrelevante; HMR quase instantâneo acelera o loop; sem a complexidade de RSC onde código animado quebra |
| Landing pública / marketing / página que precisa rankear | **Next.js** | SSR/SSG real, first paint rápido, indexação |
| Conteúdo majoritariamente estático com ilhas de interação | **Astro** | Melhor performance que os dois para esse caso |

**Por que Vite é o default para iteração com IA:** frontend é ciclo rápido (gera → vê → ajusta, dezenas de vezes/hora). HMR instantâneo reduz atrito real e conversa direto com o problema de rate limit (§5): loop local mais rápido = menos turnos de agente desperdiçados. O App Router do Next traz RSC, divisão `"use client"`/server e caching agressivo — **exatamente onde Aceternity/Motion quebram** (forçam `"use client"`). Numa SPA Vite, essa dor some.

**Componentes base:** `shadcn/ui` para a casca de aplicação. Peça quase incontestada.
> **Status shadcn/Base UI (v2.3):** material de auditoria afirma que, desde jan/2026, o `npx shadcn create` permite escolher entre **Radix UI** e **Base UI** (da MUI), com Radix permanecendo suportado (sem migração forçada) e guias de migração gradual componente-a-componente. **Eu não validei isso na doc oficial do shadcn** — então trate como **provável, não confirmado por mim**. De qualquer modo, a ação é a mesma: antes de gerar componentes, confirme qual primitiva seu projeto usa e diga isso à IA, para evitar estrutura incompatível. *(evidência: auditoria de terceiro citando changelog jan/2026 — não verificada por fonte primária aqui)*

---

## 2. Skills de design — escolha UMA, não empilhe

> **CORREÇÃO (v2.3, fonte primária lida diretamente).** Versões anteriores deste manual afirmavam "não empilhe, as skills colidem e se anulam". **Isso estava errado.** O README do Impeccable (release Skill 3.1.1, mai/2026) diz que o Impeccable **é construído sobre** a `frontend-design` oficial da Anthropic — *"Impeccable started from there"* — e a credita formalmente no NOTICE.md. Não existe a alegação de "conflito que anula". *(evidência: README oficial pbakaus/impeccable, verificado)*

**O que de fato fazer:** instale o Impeccable (ele já incorpora e estende a base oficial — 1 skill, 23 comandos via `/impeccable`, 7 arquivos de referência: typography, color, motion, spatial, interaction, responsive, ux-writing). Não há necessidade de manter a skill oficial rodando em paralelo, mas **também não há evidência de que rodá-las juntas cause dano** — o repositório simplesmente trata o Impeccable como o pacote standalone. O único problema de configuração documentado é de **ativação/instalação** (a skill não aparecer no autocomplete até reiniciar a ferramenta), não de conflito semântico. *Teste se os comandos aparecem no seu ambiente; é isso que importa.*

**Sobre o Impeccable, sem ilusão:** continua sendo um *linter de estética*, não motor de gosto. Eleva o piso (mata Inter-pra-tudo, gradiente roxo, card-em-card, bounce easing — anti-patterns que ele lista explicitamente), mas adotá-lo é adotar a estética codificada pelo autor. Defaults não são leis — saiba quando quebrá-los. Você continua responsável por contexto, trade-offs e consistência entre páginas. Comandos como `/impeccable delight`, `/animate`, `/typeset`, `/audit`, `/critique`, `/polish` existem e são reais. *(evidência: README oficial, verificado)*

**Cuidado com skills fantasma.** Circulam listas com `3d-shader`, `awwwards-aesthetic`, `motion-master`, `frontend-design-pro`. **Trate qualquer skill não verificada como inexistente até confirmar o repositório.** *(evidência: material promocional não verificável)*

---

## 3. Animação e motion

### 3.1 Acessibilidade é GATE obrigatório
No Motion (ex-Framer Motion), respeitar `prefers-reduced-motion` é **opt-in**. O default do `MotionConfig` é `'never'`. **Código gerado por IA nasce com acessibilidade de movimento quebrada se ninguém forçar a config.**
- Force `<MotionConfig reducedMotion="user">` na raiz, ou `useReducedMotion` nos componentes animados.
- **Rejeite qualquer código/PR que omita isso.** *(evidência: doc oficial)*

### 3.2 Bundle e performance
O componente `motion` vem com tudo (~34kb gzipped). Cai para ~4.6kb no render inicial **só** com `LazyMotion` + componente `m`.
- Force `LazyMotion` + `m` em vez de `motion`.
- Meça Core Web Vitals no mobile, throttling 4x CPU, p75: **LCP ≤ 2,5s · INP ≤ 200ms · CLS ≤ 0,1.** Se degradar, **corte efeitos antes do deploy.** *(evidência: doc oficial + thresholds Google)*
> ⚠️ **Three.js (referenciado na §7):** a build ESM completa, minificada e gzipped, fica em **~350–490kb** (não ~140kb como uma versão anterior do manual dizia). *(evidência: repositório oficial Three.js, PR #32244 jan/2026 — atribuído, não verificado por mim)* Reforça o ponto: qualquer prompt que peça Three.js **e** bundle <120kb é fisicamente impossível.

### 3.3 Qual biblioteca de motion
- **UI de app:** Motion. MIT, licença irrevogável.
- **Marketing com scroll/timeline complexo (50+ elementos):** considere **GSAP**. 100% grátis desde abril/2025 — toda a suite, incluindo ScrollTrigger, SplitText, MorphSVG e uso comercial — confirmado pelo anúncio do Webflow e pelo changelog do GSAP 3.13 (que também reduziu o SplitText em ~50% e melhorou acessibilidade). Superior nesse caso. Padrão: GSAP no marketing + Motion na app. *(evidência: anúncio Webflow abr/2025 + changelog GSAP 3.13 — atribuído)*

---

## 4. Bibliotecas de efeito (Aceternity / Magic UI) — tempero, não prato

Dependem fortemente de JS no client (forçam `"use client"`, conflitam com RSC). O uso excessivo virou estética **reconhecível de "feito por IA"** — spotlight, 3D card flips, animated beams nos mesmos lugares. Designers da YC alertam que isso **custa credibilidade**.

**Boa prática:** trate como tempero. **Máximo 1–2 efeitos pesados por página.** shadcn/ui carrega a casca; o efeito é pontual.

> ⚠️ **Lacuna honesta:** não há relato primário de alguém que removeu essas libs por arrependimento de bundle/jank. A crítica documentada é sobre *mesmice* e RSC/bundle. Trate "regret/removal" como **não comprovado.**

---

## 5. Workflow, rate limits e fallback

### 5.1 Claude Design — só rascunho, nunca entrega
Research preview com bugs (comentários inline somem, save errors no modo compacto, lag em repo grande) e **limite metered separado** que pode drenar cota semanal numa sessão.
- Use para: exploração visual rápida, wireframe descartável, handoff inicial.
- **Nunca** para entregável de cliente ou pixel-perfect enquanto for preview.
- Monorepo grande: linke subdiretórios. *(evidência: doc oficial + uso real)*

### 5.2 Rate limit do Claude Code — melhorou, mas mantenha plano B
Historicamente, a queixa nº1 **não era qualidade — era cota.** Frontend é iterativo (lint→fix→test gera 8–12 chamadas/min), contexto cresce a cada turno.
**Atualização (mai/2026):** material de auditoria reporta que a Anthropic **dobrou os limites da janela de 5h** para contas pagas e **aumentou os semanais em ~50%**, além de remover o throttle de horário de pico para Pro/Max. Isso reduz a probabilidade de interrupção em sessões típicas. *(evidência: atribuída a anúncio Anthropic 2026-05-06 — não verificada por mim)* Relatos anedóticos ainda apontam bloqueios ocasionais em projetos muito iterativos ou de contexto gigante.
- `.claudeignore` agressivo + escopo de arquivos restrito.
- Off-peak quando possível (menos crítico agora). *(evidência: uso real + anúncio atribuído)*

### 5.3 Fallback obrigatório (ainda vale, mesmo com limites maiores)
Você ainda pode bater em restrições inesperadas. Tenha **Codex ou Gemini CLI já configurado** e troque no meio de um ciclo de polish. A comunidade criou roteadores (ex.: `cc-switch`, `llm-router`) que alternam entre CLIs mantendo contexto. *(evidência: repositórios públicos + uso real anedótico — não verificados por mim)*

---

## 6. Como promptar de verdade (a parte que mais muda o resultado)

### 6.1 Snapshot antes do código
**Nunca peça código direto.** Peça descrição textual detalhada (posição, px, hex, espaçamento, 3 breakpoints, o que anima e em que ordem). Revise, ajuste, **só então** peça código. Relatos indicam que corta iterações pela metade. *(evidência: comunidade — magnitude não verificável)*

### 6.2 Banir adjetivos vagos
"Bonito/moderno/clean/profissional" = genérico. Troque por atributos mensuráveis:

| Em vez de | Use |
|---|---|
| "Moderno" | "Grid assimétrico, sem bordas duras, gradientes sutis" |
| "Clean" | "Máx. 3 cores, muito espaço negativo, sem ornamento" |
| "Elegante" | "Serifada display, paleta monocromática quente, transições suaves" |
| "Impactante" | "Tipografia display, alto contraste, animação de entrada marcante" |

**Truque:** peça à IA para traduzir seu adjetivo em 5 atributos mensuráveis *antes* de gerar.

### 6.3 Nomes de movimento estético como atalho
*"Swiss Design, mas paleta quente terrosa"*; *"Editorial NYT Magazine"*; *"Linear minimalism"*; *"Apple product page"*. O modelo conhece a estrutura e aplica seu desvio. *(evidência: comunidade)*

### 6.4 Design system como âncora (ver §8 para o detalhe completo)
Defina os tokens **antes**, instrua a IA a consultá-los antes de cada geração, e audite o output contra eles.

### 6.5 Section-by-section + review
Construa **uma seção por vez, aprovação antes da próxima.** Evita o monolito. Pergunta de ouro: *"isso pode ser decomposto em partes reutilizáveis?"*

### 6.6 Onde o Claude tropeça em responsividade
Bom: mobile-first quando instruído, breakpoints. Ruim (exige instrução): tipografia fluida (usa fixo em vez de `clamp()`); reorganização real em mobile (só empilha); imagens (esquece `sizes`); touch targets (ignora 44×44px mínimo). Inclua os quatro no prompt de revisão. *(evidência: comunidade convergente)*

### 6.7 Esqueleto de prompt que funciona
Vale mais que qualquer prompt copiado:
```
Papel: engenheiro frontend sênior + product designer
Projeto / público / páginas: [...]
Tom: [referência concreta — "como Linear/Vercel", não "moderno"]
Referência: [screenshots + DESIGN.md anexados]
Constraints: mobile+desktop, usar tokens anexados, dark mode primário
Processo: snapshot visual primeiro → aprovação → código section-by-section
Polish: audit explícito de hierarquia/contraste/affordance antes de finalizar
```
**Anexar screenshots + DESIGN.md é o maior multiplicador de qualidade** (consenso; a magnitude "3x" é anedótica). Reserve tempo real para a **fase de polish/audit**.

---

## 7. Anti-exemplo — como NÃO promptar (e a variante disfarçada)

Circula material prometendo Awwwards com prompts tipo *"God Mode: shader + Three.js + GSAP + custom cursor + Lenis + blend modes, E bundle <120kb, E Lighthouse 100/100, E 60fps guarantee, E WCAG AAA"*. **Isso é fisicamente incoerente:**
- Three.js sozinho fica em ~350–490kb (ESM completo, min+gzip) — "bundle <120kb" com Three.js é impossível. *(valor corrigido na v2.3; versão anterior dizia ~140kb)*
- "Lighthouse 100" *com* canvas/shader pesado no mobile não acontece sem cortar os efeitos que o prompt exige.
- "60fps guarantee" e "WCAG AAA" não são garantidos por prompt — são **medidos e conquistados**; AAA raramente é alvo realista para marketing animado.

**O padrão tóxico:** pedir o máximo de tudo ao mesmo tempo. Performance, riqueza visual e acessibilidade são **trade-offs conscientes**, não itens que se acumulam.

> ⚠️ **A variante mais perigosa: o God Mode disfarçado de sobriedade.** Existe material que adota o vocabulário deste manual ("restraint", "one big idea", "performance penaliza lag", "section by section") e mesmo assim te entrega um prompt final pedindo *"3D immersive + r3f + Three.js + Lighthouse 100 comments"*. Ele vem com estatísticas de precisão suspeita — ex.: **"61% dos SOTD usam 3D"** (origem não verificável, nenhuma fonte primária confirma), "replica 80-90% do uau factor", "Design 40% / Usability 30%" — todas sem fonte. Trate qualquer número sem fonte como anedótico. **Linguagem sóbria não valida conteúdo incoerente.** Se o prompt final ainda empilha o que a física não permite, é o mesmo God Mode com roupa nova — descarte.

> Sobre "nível Awwwards": teto improvável só com IA. Se for o alvo real, o gargalo é taste humano + provavelmente Figma-first + curadoria manual — não um prompt mais agressivo.

---

## 8. Design Tokens — single source of truth (a alavanca mais barata contra slop)

Tokens não são "coisa de Figma". São o mecanismo mais barato de eliminar grande parte do slop visual **antes** do primeiro código. Bem definidos, a IA para de inventar hex aleatório, espaçamento fora de escala e sombra genérica.

### 8.1 Estrutura em 3 camadas
1. **Primitive/base** → valores crus (hex, px)
2. **Semantic** → intenção (`primary`, `surface`, `text`, `accent`, `success`)
3. **Component** → variantes (`button-primary`, `card-elevated`)

Estrutura mínima viável:
```json
{
  "primitive": {
    "spacing": ["0","4px","8px","12px","16px","24px","32px","48px","64px","96px"],
    "radius": ["0","4px","8px","12px","20px"],
    "typography": { "scale": 1.25, "base": "16px" }
  },
  "semantic": {
    "colors": { "primary": "hsl(var(--primary))", "surface": "hsl(var(--surface))", "text": "hsl(var(--text))", "accent": "hsl(var(--accent))" },
    "radius": { "card": "8px", "button": "12px" }
  },
  "rules": [
    "Nunca use hex arbitrário ou p-[17px]",
    "Espaçamento sempre múltiplo da escala (8pt rhythm)",
    "Tipografia com ratio consistente (1.125 ou 1.25)",
    "Shadows e radius apenas dos tokens",
    "Priorize semantic tokens; reporte e corrija desvios"
  ]
}
```

### 8.2 Prompt de enforcement (cole no início de sessão importante)
```
Sistema permanente: você está ancorado aos arquivos design-tokens.json e
theme.config.ts anexados. Antes de qualquer decisão visual ou geração de
código, consulte-os.
Proibições absolutas: hex arbitrário, espaçamento fora da escala, classes
inventadas (text-[#...], rounded-3xl excessivo).
Use sempre semantic tokens. Se detectar desvio, corrija e mostre o diff.
```

### 8.3 Prompt de auditoria (após cada seção)
```
Audite o código contra design-tokens.json anexado.
Liste toda violação (mesmo pequena) + código corrigido.
Só marque OK se não houver nenhuma.
```

### 8.4 Limite documentado
Mesmo com instrução explícita, a IA às vezes gera classe arbitrária (`text-[#1a1a1a]`). **Exige revisão humana** — tokens reduzem o problema, não o eliminam.

### 8.5 Padrão W3C Design Tokens (DTCG)
Desde **out/2025** existe uma especificação estável do **W3C Design Tokens Community Group (DTCG)** — formato JSON padronizado e interoperável que permite os mesmos tokens trafegarem entre Figma (via plugins), Style Dictionary e código sem retrabalho manual. *(evidência: especificação DTCG — atribuída, não verificada por mim)*
- **Use DTCG** se o alvo é interoperabilidade real design↔código (time, escala, handoff profissional — o "teto").
- **JSON ad-hoc (§8.1) basta** para uso exclusivo com IA, sem ponte Figma.

### 8.6 Validação em camadas (escolha por projeto)
Tokens definidos não bastam: a IA ainda deriva em sessões longas. Escale a validação conforme o risco do projeto:
1. **Prompt de auditoria** após cada seção (baixo esforço — todo projeto).
2. **Regra persistente** no `CLAUDE.md` / skill que força consulta aos tokens (projetos médios/grandes).
3. **Validação multi-camada** (tokens + a11y + performance) antes de entrega a cliente.
4. **Tool-assisted + revisão humana** no deploy final.
Nenhuma camada elimina 100% do drift — a combinação que funciona é tokens + enforcement + auditoria frequente + julgamento humano final. "Set and forget" acumula inconsistência. *(evidência: prática de comunidade convergente)*

---

## 9. Testes, CI/CD e o teto de qualidade (o que o manual original não cobria)

O manual até a v2.0 parava no deploy individual e no QA manual. Para "premium consistente" **que escala** (time, ou muitos projetos), o piso de qualidade inclui automação:

- **Regressão visual:** Storybook + Chromatic (ou Percy) pega mudança visual não intencional que o olho deixa passar entre deploys.
- **CI de performance e bundle:** Lighthouse CI + `bundlesize` (ou `size-limit`) transformam o checklist de CWV num gate automático no PR, em vez de checagem manual que alguém esquece.
- **A11y linting:** `eslint-plugin-jsx-a11y` + axe no CI pega regressão de acessibilidade (incluindo o `reducedMotion` da §3.1) antes do merge.

Isso é o "próximo passo natural" depois que o fluxo manual estabiliza. Não é pré-requisito para começar — é o que separa "consigo fazer uma página premium" de "meu time produz páginas premium repetidamente sem regredir". *(evidência: prática padrão de engenharia frontend — não específica a IA)*

---

## 10. Alternativas — por que não escolhemos, e onde elas ganham

Toda escolha deste manual rejeitou opções viáveis. Documentar o *porquê* (e onde a alternativa de fato ganha) evita que a decisão vire dogma e dá o gatilho de quando reconsiderar.

### 10.1 Framework — por que não Next.js como default
- **Por que não (como default):** o App Router traz RSC, divisão `"use client"`/server e caching agressivo. Para app logado, isso é complexidade sem retorno — e é a categoria de atrito onde Motion/Aceternity quebram.
- **Onde Next ganha:** SSR/SSG real. Para landing pública, marketing, blog — qualquer coisa que vive de SEO e de first paint rápido para visitante frio — Next é a escolha certa, não a alternativa.
- **Gatilho de reconsideração:** o projeto precisa rankear no Google ou servir HTML pronto a visitante não-logado.

### 10.2 Build — por que não Webpack/CRA
- **Por que não:** Create React App está efetivamente morto e Webpack puro tem dev server lento, que mata o loop de iteração rápido (caro com rate limit).
- **Onde ganham:** projetos legados já em Webpack, ou necessidade de uma config de build muito específica que o Vite não cobre. Raro hoje.
- **Gatilho:** manutenção de codebase legado; não para projeto novo.

### 10.3 Motion — por que não GSAP para tudo (e por que não só Framer Motion)
- **Por que não GSAP como default de app:** é imperativo (timeline-based), menos idiomático em React para estado/transição de UI; integra menos naturalmente com o ciclo de render do React que o Motion (declarativo).
- **Onde GSAP ganha:** timeline complexa, scroll-driven denso (ScrollTrigger), cenas com 50+ elementos. É tecnicamente superior aí — e 100% grátis desde abril/2025.
- **Por que não só Framer Motion/Motion:** ele engasga em coreografias de scroll muito densas, onde o GSAP foi feito para brilhar.
- **Gatilho:** se a página é marketing com scroll narrativo pesado, leve para GSAP; se é UI de app, fique no Motion.

### 10.4 Componentes — por que não MUI / Chakra / Mantine
- **Por que não:** são bibliotecas "fechadas" (você importa o componente pronto e luta contra os defaults para customizar). shadcn/ui é copy-paste — você é dono do código e customiza sem brigar com a lib. Para "premium consistente", controle de código importa.
- **Onde ganham:** time que precisa de muito componente pronto rápido, com menos exigência estética (CRUD interno, admin, MVP funcional onde o visual é secundário). Mantine em especial tem cobertura enorme de componentes.
- **Gatilho:** velocidade de entrega de UI funcional > controle estético.

### 10.5 Bibliotecas de efeito — por que não viver de Aceternity/Magic UI
- **Por que não como base:** forçam `"use client"`, conflitam com RSC, e o uso excessivo cria o "look de IA" que custa credibilidade. Já são tratadas como tempero na §4.
- **Onde ganham:** o efeito pontual de hero, o "signature moment" único, quando usadas com parcimônia (1–2 por página). Aí entregam impacto que seria caro construir do zero.
- **Gatilho:** um efeito específico, intencional, a serviço da narrativa — não decoração espalhada.

### 10.6 Agente de código — por que Codex/Gemini são fallback, não principal
- **Por que não como principal:** o Claude Code vence na qualidade média de frontend/UI (dados de avaliação cega). Codex tem histórico de quebrar look-and-feel ao mexer em CSS.
- **Onde ganham:** **Codex** — specs grandes, trabalho assíncrono/batch via PR, e ~4x mais eficiência de token (estica a cota). **Gemini CLI** — alguns relatam limites mais generosos por preço. Ambos são o seu seguro contra o rate limit do Claude Code, que é a dor nº1.
- **Gatilho:** você bateu no limite no meio de um ciclo, ou tem uma spec fechada para rodar em lote sem supervisão fina.

### 10.7 Ferramenta de design — por que não Figma-first (ou só Claude Design)
- **Por que não Figma-first sempre:** para um dev que itera rápido com IA, montar tudo no Figma antes adiciona uma etapa manual que a geração de código pula.
- **Onde Figma ganha:** o **teto**. Trabalho que exige taste humano, precisão pixel/vetor, multiplayer de time e handoff sério ainda é Figma. Para "nível Awwwards", o caminho passa por aqui, não por prompt.
- **Por que não só Claude Design:** é research preview, instável, com cota separada que drena rápido — bom para rascunho, ruim para entrega.
- **Gatilho:** alvo é excepcional/cliente exigente → Figma; é exploração rápida descartável → Claude Design.

> **Princípio por trás de tudo isto:** nenhuma dessas alternativas é "ruim". Cada uma ganha num eixo específico (SEO, velocidade de entrega, coreografia de scroll, cota de token, teto de qualidade). A stack default deste manual otimiza para *um dev iterando rápido com IA buscando premium consistente* — mude o objetivo e a escolha certa muda junto.

---

## 11. Pacote operacional (starter-kit) — onde a teoria vira executável

Este manual é o documento de **raciocínio** (o porquê, com ressalvas e evidência marcada). O **starter-kit** é o documento de **execução** (o quê, imperativo, pronto para colar no projeto). São arquivos separados de propósito — não copie o conteúdo deles para cá; eles vivem na pasta `starter-kit/`.

### O que o kit contém e qual seção deste manual cada arquivo executa

| Arquivo do kit | Executa a seção | Função |
|---|---|---|
| `.claude/CLAUDE.md` | §2, §3, §4, §6 | Regras imperativas que o agente aplica em toda geração: stack fixa, proibições, gates, processo snapshot→aprovação→seção-a-seção→audit |
| `design-tokens.json` | §8 | Tokens em 3 camadas (primitive/semantic/component) + regras embutidas |
| `globals.css` | §8 | Variáveis CSS HSL para light/dark |
| `tailwind.config.js` | §8 | Liga os tokens ao Tailwind |
| `motion-provider.tsx` | §3.1, §3.2 | Gate de acessibilidade (`reducedMotion="user"`) + `LazyMotion strict` num único componente |
| `.claudeignore` | §5.2 | Reduz contexto lido pelo agente → economiza cota |
| `SETUP.md` | §1, §5.3 | Ordem de execução do projeto + lembrete de fallback de agente |

### Como usar os dois juntos
1. Leia o manual uma vez para entender os trade-offs (especialmente §7, §10 e as marcações de evidência).
2. Copie os arquivos do kit para a raiz do projeto.
3. Edite `design-tokens.json` e `globals.css` para a identidade do projeto.
4. Deixe o agente trabalhar sob as regras do `CLAUDE.md`. Volte ao manual quando precisar **decidir** algo (ex.: "uso GSAP aqui?" → §3.3 e §10.3), não para gerar código.

### Dois pontos do kit que dependem de fatos não verificados
O `SETUP.md` marca com `# CONFIRME` os passos cuja sintaxe depende de fatos que este manual ainda classifica como não verificados por fonte primária: a sintaxe atual do `npx shadcn` e a escolha Radix/Base UI (ver §1), e o método de instalação atual do Impeccable (ver §2). **Cheque a doc oficial antes de rodar esses dois** — o resto do kit é sólido.

---

## Checklist de QA visual (antes de cada deploy)

- [ ] Zero tells de slop (Inter genérica, gradiente roxo-azul, card-em-card, texto cinza em fundo colorido)
- [ ] `prefers-reduced-motion` respeitado de fato (`MotionConfig reducedMotion="user"` ou `useReducedMotion`)
- [ ] Componentes animados em `LazyMotion`
- [ ] Máximo 1–2 efeitos pesados por página
- [ ] LCP ≤ 2,5s · INP ≤ 200ms · CLS ≤ 0,1 (mobile, 4x throttle, p75)
- [ ] Uma única skill de design ativa
- [ ] Versão/primitiva do shadcn confirmada (Radix vs Base UI)
- [ ] Tipografia fluida (`clamp()`), touch targets ≥ 44px, imagens com `sizes`
- [ ] Tokens respeitados (sem classe arbitrária `text-[#...]`)
- [ ] Não parece "claramente feito por IA" para olho treinado
- [ ] Segundo agente configurado para o caso de rate limit
- [ ] (Se escala) regressão visual + Lighthouse CI + a11y lint no pipeline

---

## Caminho dourado (resumo operacional)

1. **Direção visual:** Figma-first para o teto, ou Claude Design só para wireframe descartável.
2. **Base:** Vite (app) ou Next/Astro (marketing/SEO) + Tailwind + shadcn/ui.
3. **Tokens:** defina os 3 níveis ANTES de gerar; enforcement + auditoria a cada seção (§8).
4. **Estética:** Impeccable ativado, skill oficial desativada.
5. **Efeito:** Aceternity/Magic UI, máx. 1–2 por página.
6. **Motion:** Motion com `LazyMotion` + `reducedMotion="user"` obrigatórios; GSAP para marketing complexo.
7. **Prompting:** snapshot→aprovação→código section-by-section; fase de polish dedicada.
8. **Execução:** Claude Code com `.claudeignore` estrito; Codex/Gemini CLI pronto como fallback.
9. **Escala:** regressão visual + CI de performance/a11y quando o fluxo manual estabilizar.

---

## O que este manual deliberadamente NÃO afirma
- Não há post-mortem primário de "brief→deploy→abandonei a stack". A evidência negativa é de análise de capacidade, não de fracasso em produção.
- "Instalei Aceternity e removi por arrependimento" não tem fonte primária.
- Codex vs Claude em frontend tem dados contraditórios; a vantagem do Claude é **na média**, não em todo caso.
- Métricas de comunidade ("3x qualidade", "61% dos SOTD", "80-90% do uau factor", contagens de upvote) são **anedóticas ou sem fonte** — a direção pode ser útil, o número não é confiável.
- A migração shadcn → Base UI e o aumento de limites do Claude Code (mai/2026) vêm de **auditoria de terceiro citada, não verificada por fonte primária aqui** — prováveis, confirme se forem críticos.
- **Retratação registrada (v2.3):** a alegação de "conflito entre Impeccable e a skill oficial" presente nas v1–v2.2 estava **errada** e foi corrigida na §2 após leitura direta do README. Lição que vale para todo este manual: um resumo de terceiro foi tratado como fonte primária — exatamente o erro que o manual prega contra. Onde uma afirmação importa para sua decisão, vá à fonte.
- Three.js, GSAP 3.13, DTCG e limites de maio são pós meu corte de conhecimento ou não verificados individualmente — atribuídos à fonte, não afirmados como verificados por mim.

Trate tudo como bem-fundado, não como lei fixa. Revalide o que muda rápido (limites, versões, preview).
