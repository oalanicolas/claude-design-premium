#!/usr/bin/env node
/**
 * intro-dc.mjs
 *
 * Single harness design-system page (not a surface template). Materialized on bootstrap
 * as design-system.dc.html. The page copy is localized, but the filename stays
 * conventional across languages.
 *
 * Uses .dc.html because Claude Design requires the Design Component runtime
 * (<x-dc>, <helmet>, x-import, DCLogic) — plain .html would not mount the DS bundle.
 */
import fs from 'node:fs';
import path from 'node:path';
import { writeShowcaseBrief, showcaseNeedsAssembly } from './showcase-brief.mjs';

export const INTRO_TEMPLATE = 'scripts/templates/intro.dc.html';

export const INTRO_FILENAMES = {
  'pt-BR': 'design-system.dc.html',
  en: 'design-system.dc.html',
};

/** @deprecated legacy surface templates + old starter name */
export const LEGACY_DC_FILES = [
  'Starter.dc.html',
  'Landing.dc.html',
  'AppShell.dc.html',
  'Deck.dc.html',
  'Doc.dc.html',
];

export function introDcFilename(language) {
  return INTRO_FILENAMES[language === 'en' ? 'en' : 'pt-BR'];
}

export function listKnownIntroFiles() {
  return [...new Set([
    ...Object.values(INTRO_FILENAMES),
    'sistema-de-design.dc.html',
    'comece-por-aqui.dc.html',
    'start-here.dc.html',
    'intro.dc.html',
  ])];
}

function read(cwd, rel) {
  try {
    return fs.readFileSync(path.join(cwd, rel), 'utf8');
  } catch {
    return '';
  }
}

function scoreLanguage(text, lang) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  if (lang === 'pt-BR') {
    let score = 0;
    if (/pt-BR|português brasileiro|portuguese \(brazil\)/i.test(text)) score += 8;
    if (/você|não|como|para|entrega|roteamento|ancore|comece|guia|prompts úteis/i.test(lower)) score += 2;
    if (/[ãõçáéíóúâêô]/i.test(text)) score += 3;
    if (/README\.pt-BR/i.test(text)) score += 4;
    return score;
  }
  let score = 0;
  if (/\ben-US\b|\benglish\b/i.test(text) && !/pt-BR/i.test(text)) score += 6;
  if (/\bthe harness\b|\bget started\b|\brouting table\b|\bdesign system guardian\b/i.test(lower)) score += 2;
  if (/you |your |before acting|read before/i.test(lower)) score += 1;
  return score;
}

/**
 * Detect document language from harness prose + DS readme (not UI component names).
 * @param {string} [cwd]
 * @param {object} [opts]
 * @param {string} [opts.readmePath]
 * @param {string} [opts.fallback]
 */
export function detectDocLanguage(cwd = process.cwd(), opts = {}) {
  const corpus = [
    read(cwd, 'CLAUDE.md'),
    read(cwd, 'README.md'),
    read(cwd, 'README.pt-BR.md'),
    read(cwd, 'DESIGN.md'),
    opts.readmePath ? read(cwd, opts.readmePath) : '',
    read(cwd, 'skills/harness-auto-setup.skill.md'),
  ].join('\n');

  const pt = scoreLanguage(corpus, 'pt-BR');
  const en = scoreLanguage(corpus, 'en');
  if (en > pt + 2) return 'en';
  if (pt > en) return 'pt-BR';
  return opts.fallback === 'en' ? 'en' : 'pt-BR';
}

function introCopy(language, binding, voice = binding.voice ?? {}) {
  const name = binding.name;
  const l = labels(language);
  const shared = {
    INTRO_PAGE_TITLE: `${l.pageTitlePrefix} - ${name}`,
    INTRO_SYSTEM_HTML: renderShowcaseScaffold(language, binding, voice),
  };
  if (language === 'en') {
    return { INTRO_HTML_LANG: 'en', ...shared };
  }
  return { INTRO_HTML_LANG: 'pt-BR', ...shared };
}

function escapeForScript(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function labels(language) {
  if (language === 'en') {
    return {
      pageTitlePrefix: 'Design System',
      eyebrow: 'Bound design system',
      heroTitle: 'Everything this system exposes.',
      heroLead:
        'Scaffold from bootstrap — the active model assembles the full customized showcase from manifest, tokens, and readme. Inspect what this product actually exposes before designing new screens.',
      components: 'Components',
      tokens: 'Tokens',
      fonts: 'Fonts',
      cards: 'Specimens',
      theme: 'Theme',
      harnessEyebrow: 'Harness operation',
      harnessTitle: 'Prompts for creating deliverables',
      introFooter: 'Generated from the detected design system. If this page looks thin, the source manifest or readme is thin.',
      assemblyPendingTitle: 'Showcase pending assembly',
      assemblyPendingLead:
        'Bootstrap wrote the scaffold and `.cdp/showcase-brief.json`. The active model must assemble the full design-system page from the real manifest, tokens, and readme — customized for this product, not a generic JS dump.',
      assemblyPendingAction: 'Run `assemble-design-system-showcase` (see CLAUDE.md routing).',
    };
  }

  return {
    pageTitlePrefix: 'Sistema de Design',
    eyebrow: 'Design system vinculado',
    heroTitle: 'Tudo que este sistema expõe.',
    heroLead:
      'Scaffold do bootstrap — o modelo ativo monta a vitrine completa e customizada a partir do manifesto, tokens e readme. Use isto para enxergar o que este produto realmente expõe antes de desenhar novas telas.',
    components: 'Componentes',
    tokens: 'Tokens',
    fonts: 'Fontes',
    cards: 'Specimens',
    theme: 'Tema',
    harnessEyebrow: 'Operação do harness',
    harnessTitle: 'Prompts para criar entregáveis',
    introFooter: 'Gerado a partir do design system detectado. Se esta página parecer pobre, o manifesto ou readme de origem está pobre.',
    assemblyPendingTitle: 'Vitrine pendente de montagem',
    assemblyPendingLead:
      'O bootstrap gravou o scaffold e `.cdp/showcase-brief.json`. O modelo ativo deve montar a página completa do design system a partir do manifesto, tokens e readme reais — customizada para este produto, não um dump genérico de JS.',
    assemblyPendingAction: 'Rode `assemble-design-system-showcase` (ver roteamento no CLAUDE.md).',
  };
}

function renderMetricPlaceholder(label, value) {
  return `<x-import component-from-global-scope="{{BOUND_DS_NAMESPACE}}.StatChip" label="${escapeHtml(label)}" value="${escapeHtml(String(value))}" hint-size="auto,28px"></x-import>`;
}

/** Bootstrap scaffold only — full showcase is assembled by the model (see showcase-brief.mjs). */
function renderShowcaseScaffold(language, binding, voice) {
  const l = labels(language);
  const tokenCount = binding.tokenCount ?? binding.tokens?.length ?? 0;
  const fontCount = binding.brandFonts?.length ?? 0;
  const cardCount = binding.cardMeta?.length ?? 0;
  const themeLabel = voice.themeLabel ?? (voice.themeDefault === 'light' ? 'DIA · LIGHT' : 'NOITE · DARK');
  const logo = voice.logoPath
    ? `<img src="${escapeHtml(voice.logoPath)}" alt="" style="width:42px;height:42px;object-fit:contain;">`
    : '';

  return `<div class="cdp-ds" data-cdp-showcase="pending">
  <main class="cdp-main">
    <header class="cdp-hero">
      <div class="cdp-brandline">${logo}<span>${escapeHtml(binding.name)}</span></div>
      <p class="cdp-kicker">${escapeHtml(l.eyebrow)}</p>
      <h1>${escapeHtml(l.heroTitle)}</h1>
      <p>${escapeHtml(l.heroLead)}</p>
      <div class="cdp-metrics">
        ${renderMetricPlaceholder(l.components, binding.componentCount ?? binding.components?.length ?? 0)}
        ${renderMetricPlaceholder(l.tokens, tokenCount)}
        ${renderMetricPlaceholder(l.fonts, fontCount)}
        ${renderMetricPlaceholder(l.cards, cardCount)}
        ${renderMetricPlaceholder(l.theme, themeLabel)}
      </div>
    </header>

    <!-- CDP:SHOWCASE:PENDING -->
    <section id="showcase-pending" class="cdp-section">
      <x-import component-from-global-scope="{{BOUND_DS_NAMESPACE}}.SectionHeader" eyebrow="Harness" title="${escapeHtml(l.assemblyPendingTitle)}" hint-size="100%,72px"></x-import>
      <p class="cdp-note">${escapeHtml(l.assemblyPendingLead)}</p>
      <p class="cdp-note"><strong>${escapeHtml(l.assemblyPendingAction)}</strong></p>
      <p class="cdp-note">${escapeHtml(l.introFooter)}</p>
    </section>
    <!-- /CDP:SHOWCASE:PENDING -->

    <section id="harness" class="cdp-section">
      <x-import component-from-global-scope="{{BOUND_DS_NAMESPACE}}.SectionHeader" eyebrow="${escapeHtml(l.harnessEyebrow)}" title="${escapeHtml(l.harnessTitle)}" hint-size="100%,72px"></x-import>
      <!-- CDP:PROMPTS -->
    </section>
  </main>
</div>`;
}

function loadManifest(cwd, binding) {
  try {
    return JSON.parse(read(cwd, binding.manifest));
  } catch {
    return null;
  }
}

function enrichBindingFromManifest(binding, cwd, voice) {
  const manifest = loadManifest(cwd, binding);
  return {
    ...binding,
    voice,
    tokenCount: binding.tokenCount ?? manifest?.tokens?.length ?? 0,
    componentMeta:
      binding.componentMeta ??
      (manifest?.components ?? []).map((c) => ({
        name: c.name ?? c,
        sourcePath: c.sourcePath,
      })),
    cardMeta: binding.cardMeta ?? manifest?.cards ?? [],
    startingPoints: binding.startingPoints ?? manifest?.startingPoints ?? [],
    brandFonts: binding.brandFonts ?? manifest?.brandFonts ?? [],
  };
}

function buildPromptDefs(language, binding) {
  const ns = binding.namespace;
  const name = binding.name;
  const introFile = introDcFilename(language);

  if (language === 'en') {
    return [
      {
        key: 'novo',
        tag: '01 - NEW DELIVERABLE',
        title: 'Start a new screen, deck, or doc',
        desc: 'Create a fresh Name.dc.html for each deliverable. Copy the helmet block from this intro page.',
        prompt: `Create a new [Name].dc.html for [what you need]. Load the ${name} bundle in <helmet> (copy the block from ${introFile}) and compose ${ns} components - do not recreate raw HTML imitating them. Anchor every decision in DESIGN.md and tokens. Ship only the main view first; I will refine before asking for more. Report which skills were applied.`,
      },
      {
        key: 'brief',
        tag: '02 - FRAME THE BRIEF',
        title: 'Define the brief before designing',
        desc: 'When audience, brand, or surface is still unclear. Prevents invented context.',
        prompt:
          'Run brief-framing before generating UI. Classify the surface as brand, product, or system. List audience, primary job-to-be-done, references to follow or avoid, and blocking gaps. Ask only what materially changes the design.',
      },
      {
        key: 'orig',
        tag: '03 - ORIGINALITY',
        title: 'Catch cliches before polish',
        desc: 'Flags generic template reflexes and category cliches before they become habit.',
        prompt:
          'Run visual-originality-audit on this direction. Point out generic template reflexes, category cliches, and second-order cliches. Recommend targeted changes that make the design more authored without hurting usability.',
      },
      {
        key: 'ds',
        tag: '04 - DS ANTI-DRIFT',
        title: `Enforce ${name}`,
        desc: 'Guardrail: everything comes from bound tokens and namespace components.',
        prompt: `Use the bound design system everywhere. Before generating, read BOUND_DS.json and list which tokens (globalCssPaths) and which ${ns} components you will apply on this screen per DESIGN.md. Load the bundle and compose components - never restyle raw HTML to mimic them. If something is missing, ask instead of inventing.`,
      },
      {
        key: 'ui',
        tag: '05 - UI AUDIT',
        title: 'Review hierarchy and composition',
        desc: 'UI critique without redesign: what works, localized issues, token-bound fixes.',
        prompt:
          'Run ui-audit on the previous output. Point out what works, specific problems with location, and fixes tied to tokens. Do not redesign the screen.',
      },
      {
        key: 'polish',
        tag: '06 - POLISH',
        title: 'Refine without changing structure',
        desc: 'Final quality pass: microcopy, alignment, hierarchy, subtle motion.',
        prompt:
          'Run polish-phase on the approved screen. Refine microcopy, alignment, button hierarchy, and add subtle motion using motion tokens. Keep structure identical and list exactly what changed.',
      },
      {
        key: 'texto',
        tag: '07 - TEXT INTEGRITY',
        title: 'Audit copy voice',
        desc: 'Product voice check: generic language, hype, banned typography.',
        prompt:
          'Run text-integrity-audit on this text. Point out generic language, weak voice, hype, repeated sentence shapes, recap reflex, and banned typography. Return revised text and list fixes.',
      },
      {
        key: 'mobile',
        tag: '08 - MOBILE REVIEW',
        title: 'Test breakpoints',
        desc: 'Responsive behavior 320px-1440px: overflow, touch targets, stacking.',
        prompt:
          'Run mobile-first-audit at 320px, 375px, 430px, 768px, 1024px, and 1440px. Report overflow, touch targets, and stacking issues, then say approved or list blockers.',
      },
      {
        key: 'a11y',
        tag: '09 - ACCESSIBILITY',
        title: 'Cover contrast, focus, keyboard',
        desc: 'Accessibility checklist with explicit non-certification disclaimer.',
        prompt:
          'Run accessibility-audit on this screen. Cover contrast, semantics, keyboard, focus, forms, motion, and screen-reader clarity. List blockers with fixes and include the non-WCAG-certification disclaimer.',
      },
      {
        key: 'fino',
        tag: '10 - TARGETED TWEAK',
        title: 'Change one thing only',
        desc: 'Single adjustment without regenerating the whole screen (common drift path).',
        prompt:
          'Targeted tweaks only, do not rebuild the screen: [e.g. increase CTA contrast, tighten hero spacing, change title weight]. Keep everything else identical.',
      },
      {
        key: 'codigo',
        tag: '11 - CODE REVIEW',
        title: 'Audit implementation (outside canvas)',
        desc: 'When Tailwind/code exists: token violations and arbitrary values with line numbers.',
        prompt:
          'Here is the implementation. Run design-system-guardian, then tailwind-audit, mobile-first-audit, and accessibility-audit. List token violations and arbitrary values with line numbers and corrected classes. Do not rewrite the entire file.',
      },
      {
        key: 'final',
        tag: '12 - FINAL APPROVAL',
        title: 'Mark a screen as final',
        desc: 'Exit gate: guardian, polish, mobile, and accessibility before declaring done.',
        prompt:
          'I want to mark this screen as final. Apply the final approval routing: design-system-guardian, polish-phase, mobile-first-audit, accessibility-audit. Do not declare final until mobile and accessibility have run. Report the outcome.',
      },
    ];
  }

  return [
      {
        key: 'novo',
        tag: '01 - NOVO ENTREGAVEL',
        title: 'Começar uma nova tela, deck ou doc',
        desc: 'Crie um Nome.dc.html novo para cada entrega. Copie o bloco helmet desta pagina.',
        prompt: `Crie um novo [Nome].dc.html para [o que você precisa]. Carregue o bundle do ${name} no <helmet> (copie o bloco de ${introFile}) e componha os componentes do namespace ${ns} - não recrie HTML cru imitando-os. Ancore cada decisão no DESIGN.md e nos tokens. Gere só a visão principal; eu refino antes de pedir mais. Reporte quais skills foram aplicadas.`,
      },
      {
        key: 'brief',
        tag: '02 - ENQUADRAR O BRIEF',
        title: 'Definir o brief antes de desenhar',
        desc: 'Quando público, marca ou superfície ainda não estão claros. Evita inventar contexto.',
        prompt:
          'Rode brief-framing antes de gerar UI. Classifique a superfície como brand, product ou system. Liste o público, o trabalho-a-ser-feito principal, referências a seguir ou evitar, e as lacunas que travam a decisão. Pergunte só o que muda materialmente o design.',
      },
      {
        key: 'orig',
        tag: '03 - ORIGINALIDADE',
        title: 'Checar clichês antes de polir',
        desc: 'Pega reflexos genéricos de template e clichês de categoria antes que virem padrão.',
        prompt:
          'Rode visual-originality-audit nesta direção. Aponte reflexos genéricos de template, clichês de categoria e clichês de segunda ordem. Recomende mudanças pontuais que tornem o design mais autoral sem prejudicar a usabilidade.',
      },
      {
        key: 'ds',
        tag: '04 - ANTI-DRIFT DO DS',
        title: `Forçar o uso do ${name}`,
        desc: 'Trava contra deriva: tudo sai dos tokens e dos componentes do namespace.',
        prompt: `Use o design system bound em tudo. Antes de gerar, leia BOUND_DS.json e liste quais tokens (globalCssPaths) e quais componentes do namespace ${ns} você vai aplicar nesta tela, conforme o DESIGN.md. Carregue o bundle e componha os componentes - nunca restilize HTML cru para imitá-los. Se algo não estiver coberto, pergunte em vez de inventar.`,
      },
      {
        key: 'ui',
        tag: '05 - AUDITORIA DE UI',
        title: 'Revisar hierarquia e composição',
        desc: 'Crítica de UI sem redesenhar: o que funciona, problemas com localização, correções nos tokens.',
        prompt:
        'Rode ui-audit na saída anterior. Aponte o que funciona, os problemas específicos com sua localização, e correções amarradas aos tokens. Não redesenhe a tela.',
      },
      {
        key: 'polish',
        tag: '06 - POLIMENTO',
        title: 'Refinar sem mudar a estrutura',
        desc: 'Passe final de qualidade: microcopy, alinhamento, hierarquia e motion sutil.',
        prompt:
        'Rode polish-phase na tela aprovada. Refine microcopy, alinhamento, hierarquia de botões e adicione motion sutil usando os tokens de movimento. Mantenha a estrutura idêntica e liste exatamente o que mudou.',
      },
      {
        key: 'texto',
        tag: '07 - INTEGRIDADE DE TEXTO',
        title: 'Auditar a copy',
        desc: 'Voz de produto: caça linguagem genérica, exagero e tipografia proibida.',
        prompt:
        'Rode text-integrity-audit neste texto. Aponte linguagem genérica, voz fraca, exagero, formas de frase repetidas, reflexo de recapitulação e tipografia proibida. Devolva o texto revisado e liste os problemas corrigidos.',
      },
      {
        key: 'mobile',
        tag: '08 - REVISÃO MOBILE',
        title: 'Testar nos breakpoints',
        desc: 'Comportamento responsivo de 320px a 1440px: overflow, alvos de toque, empilhamento.',
      prompt:
        'Rode mobile-first-audit em 320px, 375px, 430px, 768px, 1024px e 1440px. Reporte overflow, alvos de toque e problemas de empilhamento, depois diga aprovado ou os bloqueios.',
    },
      {
        key: 'a11y',
        tag: '09 - ACESSIBILIDADE',
        title: 'Cobrir contraste, foco e teclado',
        desc: 'Checagem de acessibilidade com aviso explícito de não-certificação WCAG.',
        prompt:
          'Rode accessibility-audit nesta tela. Cubra contraste, semântica, teclado, foco, formulários, movimento e clareza para leitor de tela. Liste bloqueios com correções e inclua o aviso de não-certificação WCAG.',
      },
      {
        key: 'fino',
        tag: '10 - AJUSTE FINO',
        title: 'Mexer em uma coisa só',
        desc: 'Para um único retoque - sem regenerar a tela inteira (caminho que mais causa deriva).',
        prompt:
          'Apenas ajustes pontuais, não reconstrua a tela: [ex.: aumentar o contraste do CTA, apertar o espaçamento do hero, trocar o peso do título]. Mantenha todo o resto idêntico.',
      },
      {
        key: 'codigo',
        tag: '11 - REVISÃO DE CÓDIGO',
        title: 'Auditar a implementação (fora do canvas)',
        desc: 'Quando já existe código/Tailwind: violações de token e valores arbitrários com linha.',
        prompt:
          'Aqui está a implementação. Rode design-system-guardian, depois tailwind-audit, mobile-first-audit e accessibility-audit. Liste violações de token e valores arbitrários com números de linha e as classes corrigidas. Não reescreva o arquivo inteiro.',
      },
      {
        key: 'final',
        tag: '12 - APROVAÇÃO FINAL',
        title: 'Marcar uma tela como final',
        desc: 'Portão de saída: roda guardian, polimento, mobile e acessibilidade antes de declarar final.',
        prompt:
          'Quero marcar esta tela como final. Aplique o roteamento de aprovação final: design-system-guardian, polish-phase, mobile-first-audit, accessibility-audit. Não declare final até mobile e acessibilidade terem rodado. Reporte o resultado.',
      },
  ];
}

function buildIntroScript(language, binding) {
  const defs = buildPromptDefs(language, binding);
  const copiedLabel = language === 'en' ? 'Copied' : 'Copiado';
  const copyLabel = language === 'en' ? 'Copy' : 'Copiar';

  const defsJson = defs
    .map((d) => {
      return `      { key: '${d.key}', tag: '${escapeForScript(d.tag)}', title: '${escapeForScript(d.title)}',
        desc: '${escapeForScript(d.desc)}',
        prompt: '${escapeForScript(d.prompt)}' }`;
    })
    .join(',\n');

  return `<script type="text/x-dc" data-dc-script data-props="{&quot;$preview&quot;:{&quot;width&quot;:1040,&quot;height&quot;:1100}}">
class Component extends DCLogic {
  state = { copiedKey: null };

  componentWillUnmount() { clearTimeout(this._t); }

  _fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
  }

  _copy(key, text) {
    let async = false;
    try {
      const p = navigator.clipboard && navigator.clipboard.writeText(text);
      if (p && p.then) {
        async = true;
        p.catch(() => this._fallbackCopy(text));
      }
    } catch (e) {}
    if (!async) this._fallbackCopy(text);
    clearTimeout(this._t);
    this.setState({ copiedKey: key });
    this._t = setTimeout(() => this.setState({ copiedKey: null }), 1600);
  }

  renderVals() {
    const defs = [
${defsJson}
    ];

    const prompts = defs.map(d => ({
      ...d,
      copyLabel: this.state.copiedKey === d.key ? '${copiedLabel}' : '${copyLabel}',
      okClass: this.state.copiedKey === d.key ? 'ok' : '',
      onCopy: () => this._copy(d.key, d.prompt),
    }));

    return { prompts };
  }
}
</script>`;
}

export function applyIntroCopy(text, language, binding, voice = binding.voice ?? {}) {
  const copy = introCopy(language, binding, voice);
  let out = text;
  for (const [key, value] of Object.entries(copy)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

function renderPromptsBlock(language) {
  const lead =
    language === 'en'
      ? 'Copy a prompt only after inspecting the design system above. Replace <code style="font-family:var(--font-mono);font-size:0.85em;color:var(--foreground);">[brackets]</code> and keep every deliverable anchored to the tokens and components shown here.'
      : 'Copie um prompt só depois de inspecionar o design system acima. Troque o que está entre <code style="font-family:var(--font-mono);font-size:0.85em;color:var(--foreground);">[colchetes]</code> e mantenha cada entrega ancorada nos tokens e componentes mostrados aqui.';

  return `<p class="cdp-note">${lead}</p>
        <div class="cdp-prompts">
          <sc-for list="{{ prompts }}" as="item" hint-placeholder-count="6">
            <div class="cdp-prompt-item">
              <div class="cdp-prompt-head">
                <span style="flex-shrink:0;width:44px;height:44px;display:grid;place-items:center;border:1px solid var(--hairline-strong);border-radius:var(--radius-base);"><i class="iconoir-sparks" aria-hidden="true" style="font-size:20px;color:var(--primary);"></i></span>
                <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;">
                  <span class="cdp-kicker">{{ item.tag }}</span>
                  <p class="cdp-prompt-title">{{ item.title }}</p>
                  <p class="cdp-prompt-desc">{{ item.desc }}</p>
                </div>
              </div>
              <div class="al-md" style="--reading-size:15px;">
                <pre data-lang="prompt" style="margin:0;"><button type="button" class="md-copy {{ item.okClass }}" onClick="{{ item.onCopy }}" style="min-height:32px;"><i class="iconoir-copy" aria-hidden="true" style="font-size:12px;"></i>{{ item.copyLabel }}</button><code style="white-space:pre-wrap;word-break:break-word;">{{ item.prompt }}</code></pre>
              </div>
            </div>
          </sc-for>
        </div>`;
}

export function injectPromptsBlock(text) {
  const block = renderPromptsBlock('pt-BR');
  if (text.includes('<!-- CDP:PROMPTS -->')) {
    return text.replace('<!-- CDP:PROMPTS -->', block);
  }
  return text;
}

export function injectIntroScript(text, language, binding, voice) {
  const script = buildIntroScript(language, binding);
  if (text.includes('<!-- CDP:INTRO-SCRIPT -->')) {
    return text.replace(/<!-- CDP:INTRO-SCRIPT -->[\s\S]*?<!-- \/CDP:INTRO-SCRIPT -->/, script);
  }
  return text.replace(/<script type="text\/x-dc"[\s\S]*?<\/script>\s*(?=<\/body>)/, `${script}\n`);
}

export function removeLegacyDcFiles(cwd = process.cwd()) {
  const removed = [];
  for (const name of [...LEGACY_DC_FILES, ...listKnownIntroFiles()]) {
    const abs = path.join(cwd, name);
    if (fs.existsSync(abs)) {
      fs.rmSync(abs, { force: true });
      removed.push(name);
    }
  }
  return removed;
}

/**
 * Materialize the single design-system DC scaffold from template + binding + voice.
 * @returns {{ filename: string, removed: string[] }}
 */
export function materializeIntroDc({ binding, voice, cwd = process.cwd(), patchFn }) {
  const language = voice.language || detectDocLanguage(cwd, { readmePath: binding.readme });
  const filename = introDcFilename(language);
  const templatePath = path.join(cwd, INTRO_TEMPLATE);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing intro template: ${INTRO_TEMPLATE}`);
  }

  const enrichedBinding = enrichBindingFromManifest(binding, cwd, voice);

  let content = fs.readFileSync(templatePath, 'utf8');
  content = applyIntroCopy(content, language, enrichedBinding, voice);
  content = injectPromptsBlock(content);
  content = injectIntroScript(content, language, enrichedBinding, voice);
  if (typeof patchFn === 'function') {
    content = patchFn(content);
  }
  content = content.replace(
    /value="NOITE · DARK"/g,
    `value="${voice.themeLabel ?? (language === 'en' ? 'NIGHT - DARK' : 'NOITE - DARK')}"`,
  );

  const removed = removeLegacyDcFiles(cwd);
  const outPath = path.join(cwd, filename);
  fs.writeFileSync(outPath, content);
  writeShowcaseBrief({ ...enrichedBinding, introDc: filename, showcaseAssembled: false }, voice, cwd);

  return { filename, language, removed, showcasePending: true };
}

export { showcaseNeedsAssembly };

export function listRootIntroDcFiles(cwd = process.cwd()) {
  return listKnownIntroFiles().filter((name) => fs.existsSync(path.join(cwd, name)));
}

export function introNeedsMaterialize(cwd = process.cwd(), cachedBinding = null, voice = null) {
  const language =
    voice?.language ||
    cachedBinding?.docLanguage ||
    detectDocLanguage(cwd, { readmePath: cachedBinding?.readme });
  const expected = introDcFilename(language);
  const rootIntros = listRootIntroDcFiles(cwd);
  if (!rootIntros.length) return true;
  if (!rootIntros.includes(expected)) return true;
  if (LEGACY_DC_FILES.some((f) => fs.existsSync(path.join(cwd, f)))) return true;
  const content = read(cwd, expected);
  if (content.includes('{{DS_HELMET_BLOCK}}') || content.includes('{{BOUND_DS_')) return true;
  if (content.includes('{{INTRO_')) return true;
  if (content.includes('{{SHOWCASE_')) return true;
  if (!content.includes('class="cdp-ds"')) return true;
  if (content.includes('<!-- CDP:SHOWCASE:PENDING -->')) return false;
  if (!content.includes('data-cdp-showcase="assembled"')) return true;
  return false;
}
