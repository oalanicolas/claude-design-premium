#!/usr/bin/env node
/**
 * synthesize-design-md.mjs
 *
 * Deterministic DESIGN.md synthesis - mirrors harness-auto-setup Phase 5.
 * Source priority: readme > manifest > token CSS > voice defaults.
 * When readme and tokens disagree, tokens win (noted inline).
 */
import fs from 'node:fs';
import path from 'node:path';
import { extractDsTokens } from './extract-ds-tokens.mjs';

function read(cwd, rel) {
  try {
    return fs.readFileSync(path.join(cwd, rel), 'utf8');
  } catch {
    return '';
  }
}

function extractBullets(readmeText, heading) {
  const re = new RegExp(`##\\s+${heading}[\\s\\S]*?(?=\\n##\\s|$)`, 'i');
  const section = readmeText.match(re)?.[0] ?? '';
  const bullets = [];
  for (const m of section.matchAll(/^\s*[-*]\s+(.+)$/gm)) {
    bullets.push(m[1].trim());
  }
  return bullets.slice(0, 8);
}

function extractAntiReferences(readmeText) {
  const negatives = [];

  for (const m of readmeText.matchAll(/\*\*\s*(no\s+[^*]+?)\s*\*\*/gi)) {
    const series = m[1]
      .split(/,\s*no\s+/i)
      .map((item, index) => (index === 0 ? item : `no ${item}`));
    for (const item of series) negatives.push(item.trim());
  }

  for (const m of readmeText.matchAll(/^\s*[-*]\s+(No\s+.+)$/gmi)) {
    negatives.push(m[1].trim());
  }

  for (const m of readmeText.matchAll(/\*\*Don't\*\*[\s\S]*?(?=\n##|\n\*\*Do\*\*|$)/gi)) {
    for (const b of m[0].matchAll(/^\s*[-*]\s+(.+)$/gm)) negatives.push(b[1].trim());
  }

  return [...new Set(negatives)]
    .map((item) => plainAsciiPunctuation(item.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()))
    .map((item) => item.replace(/^no\s+/i, 'No '))
    .slice(0, 6);
}

function listAsMarkdown(items, fallback) {
  if (!items.length) return fallback;
  return items.map((item) => `- ${item}`).join('\n');
}

function tokenList(vars, fallback) {
  if (!vars?.length) return fallback;
  return vars.map((v) => `\`${v}\``).join(', ');
}

function plainAsciiPunctuation(text) {
  return text
    .replaceAll('—', ' - ')
    .replaceAll('–', ' - ')
    .replaceAll('→', '->')
    .replaceAll('…', '...')
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replaceAll('‘', "'")
    .replaceAll('’', "'");
}

/**
 * @param {object} binding
 * @param {object} voice
 * @param {string} [cwd]
 * @param {object} [tokenSummary]
 */
export function synthesizeDesignMd(binding, voice, cwd = process.cwd(), tokenSummary = null) {
  if (!binding?.namespace || !binding?.name) {
    throw new Error('BOUND_DS missing namespace or name; cannot synthesize DESIGN.md');
  }

  const tokens = tokenSummary ?? extractDsTokens(binding, cwd);
  const readmeText = binding.readme ? read(cwd, binding.readme) : '';
  const name = binding.name;
  const ns = binding.namespace;
  const components = binding.components ?? [];
  const cards = (binding.cardMeta ?? []).map((c) => c.name ?? c.path ?? String(c));
  const surfaces = voice.surfaces?.length
    ? voice.surfaces
    : ['Brand', 'Product', 'System'];

  const themeNote =
    tokens.themeDefault && voice.themeDefault !== tokens.themeDefault
      ? `> **Token mismatch:** readme implies \`${voice.themeDefault}\` default; token CSS suggests \`${tokens.themeDefault}\`. **CSS wins** - use token theme.\n\n`
      : '';

  const antiRefs = extractAntiReferences(readmeText);
  const doBullets = extractBullets(readmeText, 'Do');
  const dontBullets = extractBullets(readmeText, "Don't");

  const defaultDos = [
    `Compose \`${ns}.*\` components via \`<x-import>\`; load the bundle once in \`<helmet>\`.`,
    'Use `var(--*)` tokens for every visual decision.',
    'Match product voice from this file and the bound DS readme.',
    'Run `design-system-guardian` before generating or changing UI.',
  ];

  const defaultDonts = [
    'Invent colors, type sizes, spacing, or radii outside the token graph.',
    'Restyle raw HTML to imitate bound components.',
    'Copy patterns from a different design system.',
    'Stack conflicting navigation layers on one screen.',
  ];

  const lines = [
    `# DESIGN.md - ${name}`,
    '',
    `> Active visual constraint for **${name}** (\`${binding.hostMode ?? 'consumer'}\` host). Synthesized by \`scripts/synthesize-design-md.mjs\`.`,
    `> Token **values** live in \`${binding.root}\` (re-exported by root \`styles.css\`). This file is the interpretive layer.`,
    `> When this file disagrees with token CSS, **the CSS wins** - flag mismatches inline, then proceed with tokens.`,
    '',
    themeNote.trimEnd(),
    `Read \`BOUND_DS.json\` for machine binding (\`namespace\`: \`${ns}\`, \`${components.length}\` components).`,
    binding.readme ? `Readme: \`${binding.readme}\`.` : '',
    '',
    '---',
    '',
    '## 1. Design Philosophy',
    '',
    voice.tagline ? `**Tagline:** ${voice.tagline}` : `Design system for **${name}**.`,
    voice.productDescription ? `\n${voice.productDescription}` : '',
    '',
    '**Surface registers**',
    `- **Brand** - marketing, heroes, campaigns, editorial (${surfaces[0] ?? 'landing'})`,
    `- **Product** - app UI, dashboards, workflows (${surfaces[1] ?? 'app'})`,
    `- **System** - specimens, tokens, documentation, this harness`,
    '',
    '**Anti-references** (do not drift into):',
    listAsMarkdown(
      antiRefs.length ? antiRefs : ['Generic SaaS gradients', 'Off-brand card grids', 'Invented metrics and filler copy'],
      '- Generic SaaS gradients',
    ),
    '',
    '---',
    '',
    '## 2. Core Principles',
    '',
    '### Hierarchy & Scanning',
    'Primary action and headline visible within 3 seconds. Type roles: display (headings), UI (sans), data (mono) per token fonts.',
    '',
    '### Spacing & Rhythm',
    `Use the bound token scale only. Sample spacing/radius tokens: ${tokenList(tokens.spacing, '`--spacing-*`, `--radius-*`')}.`,
    '',
    '### Components',
    `Namespace \`${ns}\`. Compose bound components - never recreate markup. Inventory: ${components.slice(0, 12).join(', ')}${components.length > 12 ? `, +${components.length - 12} more` : ''}.`,
    '',
    '### Responsiveness',
    'Mobile-first; touch targets ≥ 44px. Document shell/nav collapse per surface.',
    '',
    '### Accessibility',
    'Respect contrast from token CSS. Run accessibility audit before final; never claim certification.',
    '',
    '---',
    '',
    '## 3. Visual Language',
    '',
    `Ground decisions in: ${(tokens.cssPathsSampled ?? binding.globalCssPaths ?? []).map((p) => `\`${p}\``).join(', ') || 'bound DS token CSS'}.`,
    '',
    '### Color',
    `Semantic tokens: ${tokenList(tokens.colors, '`--background`, `--foreground`, `--primary`, `--border`')}. Never invent hexes when tokens exist.`,
    '',
    '### Typography',
    `Font roles: ${tokenList(tokens.fonts, '`--font-sans`, `--font-serif`, `--font-mono`, `--font-display`')}. Use size tokens only.`,
    '',
    '### Elevation & Depth',
    'Shadows and hairlines per bound DS. No glows or effects the readme forbids.',
    '',
    '### Corner radii',
    'Per `--radius-*` scale. Do not invent radii outside the system.',
    '',
    '### Motion',
    `Duration/easing: ${tokenList(tokens.motion, '`--duration-*`, easing tokens from effects CSS')}. Respect \`prefers-reduced-motion\`.`,
    '',
    '### Iconography',
    binding.iconLibrary?.type === 'iconoir'
      ? `**Iconoir** via CDN. Use \`${binding.iconLibrary.classPrefix ?? 'iconoir-'}\` classes through the bundled Icon component.`
      : 'Follow the bound DS icon convention. No emoji in product UI unless the DS allows it.',
    '',
    '---',
    '',
    '## 4. Do / Don\'t',
    '',
    '**Do**',
    listAsMarkdown(doBullets.length ? doBullets : defaultDos, `- ${defaultDos[0]}`),
    '',
    "**Don't**",
    listAsMarkdown(dontBullets.length ? dontBullets : defaultDonts, `- ${defaultDonts[0]}`),
    '',
    '---',
    '',
    '## 5. Component Philosophy',
    '',
    `All components mount from \`${ns}\` after loading \`${binding.bundle}\`.`,
    '',
    'Major inventory:',
    ...components.slice(0, 20).map((c) => `- **${c}** - use manifest/readme voice; see the assembled design-system DC (\`${binding.introDc ?? 'design-system.dc.html'}\`) when present.`),
    components.length > 20 ? `- *+${components.length - 20} additional components in \`BOUND_DS.json\`.*` : '',
    cards.length ? `\nSpecimen cards: ${cards.map(plainAsciiPunctuation).join(', ')}.` : '',
    '',
    '---',
    '',
    '## 6. Reusable Patterns',
    '',
    'Preserve named patterns through to code handoff:',
    '- Section headers / heroes',
    '- App shell / navigation',
    '- Cards / lists / empty states',
    '- Data display / status chips',
    surfaces.length
      ? `\nSurfaces from readme: ${surfaces.map((s) => `**${s}**`).join(', ')}.`
      : '',
    '',
    '---',
    '',
    '## 7. Framework Handoff',
    '',
    '- **Astro** - marketing, editorial, mostly-static content',
    '- **Vite** - interactive app/dashboard prototypes',
    '- **Next** - SSR / SEO-heavy routes / team conventions',
    '',
    'Produce a framework-neutral component inventory first (`skills/framework-handoff.skill.md`); target a framework only after canvas direction is approved.',
    '',
  ];

  return `${plainAsciiPunctuation(lines.filter((l) => l !== undefined).join('\n'))}\n`;
}

/**
 * @param {object} binding
 * @param {object} voice
 * @param {string} [cwd]
 */
export function writeDesignMd(binding, voice, cwd = process.cwd()) {
  const content = synthesizeDesignMd(binding, voice, cwd);
  fs.writeFileSync(path.join(cwd, 'DESIGN.md'), content);
  return content;
}

import { pathToFileURL } from 'node:url';

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  const bindingPath = path.join(process.cwd(), 'BOUND_DS.json');
  if (!fs.existsSync(bindingPath)) {
    process.stderr.write('BOUND_DS.json missing - run bootstrap-harness.mjs first.\n');
    process.exit(3);
  }
  const binding = JSON.parse(fs.readFileSync(bindingPath, 'utf8'));
  const voice = binding.voice ?? {};
  writeDesignMd(binding, voice);
  process.stdout.write(`Wrote DESIGN.md for ${binding.name}\n`);
}
