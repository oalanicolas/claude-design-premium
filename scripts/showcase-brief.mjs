#!/usr/bin/env node
/**
 * showcase-brief.mjs
 *
 * Structured facts for the active model to assemble design-system.dc.html.
 * Bootstrap writes this; JS does NOT render the full showcase — the model does.
 */
import fs from 'node:fs';
import path from 'node:path';
import { safeRead, readJson } from './file-snapshot.mjs';

const BRIEF_PATH = '.cdp/showcase-brief.json';
const CONTRACT_VERSION = 1;

function loadManifest(cwd, binding) {
  try {
    return readJson(cwd, binding.manifest);
  } catch {
    return null;
  }
}

function slug(name) {
  return String(name)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase();
}

function componentGroup(name, sourcePath = '') {
  if (sourcePath.includes('/brand/')) return 'brand';
  if (sourcePath.includes('/forms/')) return 'forms';
  if (sourcePath.includes('/display/')) return 'display';
  if (sourcePath.includes('/core/')) return 'core';
  if (/BookCard|SectionHeader/.test(name)) return 'brand';
  if (/Input|Textarea|Label|Switch|Checkbox/.test(name)) return 'forms';
  if (/Alert|Avatar|Progress|StatChip|Tabs/.test(name)) return 'display';
  return 'core';
}

function pickTokens(tokens, limit = 40) {
  return (tokens ?? [])
    .filter((t) => t?.name && !t.scope)
    .slice(0, limit)
    .map((t) => ({
      name: t.name,
      value: t.value,
      kind: t.kind,
      definedIn: t.definedIn,
    }));
}

/**
 * @param {object} binding
 * @param {object} voice
 * @param {string} [cwd]
 */
export function buildShowcaseBrief(binding, voice = {}, cwd = process.cwd()) {
  const manifest = loadManifest(cwd, binding);
  const components = (binding.components ?? []).map((name) => {
    const meta = (binding.componentMeta ?? manifest?.components ?? []).find(
      (c) => (c.name ?? c) === name,
    );
    const sourcePath = meta?.sourcePath ?? '';
    return {
      name,
      sourcePath,
      group: componentGroup(name, sourcePath),
      anchor: `comp-${slug(name)}`,
    };
  });

  return {
    contractVersion: CONTRACT_VERSION,
    assembledBy: 'model',
    generatedAt: new Date().toISOString(),
    bindingFingerprint: {
      namespace: binding.namespace,
      componentCount: binding.componentCount,
      configuredAt: binding.configuredAt ?? null,
      manifest: binding.manifest,
    },
    targetFile: binding.introDc ?? 'design-system.dc.html',
    language: voice.language ?? binding.docLanguage ?? 'pt-BR',
    designSystem: {
      name: binding.name,
      namespace: binding.namespace,
      root: binding.root,
      bundle: binding.bundle,
      globalCssPaths: binding.globalCssPaths ?? [],
      readme: binding.readme,
    },
    voice: {
      tagline: voice.tagline,
      productDescription: voice.productDescription,
      surfaces: voice.surfaces ?? [],
      themeDefault: voice.themeDefault,
      themeLabel: voice.themeLabel,
      logoPath: voice.logoPath,
      badge: voice.badge,
    },
    inventory: {
      components,
      tokens: pickTokens(manifest?.tokens, 60),
      cards: binding.cardMeta ?? manifest?.cards ?? [],
      startingPoints: binding.startingPoints ?? manifest?.startingPoints ?? [],
      brandFonts: binding.brandFonts ?? manifest?.brandFonts ?? [],
    },
    assembly: {
      marker: 'CDP:SHOWCASE:PENDING',
      replaceBetween: ['<!-- CDP:SHOWCASE:PENDING -->', '<!-- /CDP:SHOWCASE:PENDING -->'],
      onComplete: {
        removeMarker: true,
        setAttribute: { selector: '.cdp-ds', name: 'data-cdp-showcase', value: 'assembled' },
        bindingField: 'showcaseAssembled',
      },
      requiredSections: [
        { id: 'identidade', purpose: 'Brand, logo, tagline, product surfaces from voice/readme' },
        { id: 'fundamentos', purpose: 'Live token swatches from manifest/CSS — colors, type, spacing, motion' },
        { id: 'componentes', purpose: 'Every manifest component with live x-import specimens and variants' },
        { id: 'specimens', purpose: 'Manifest cards/startingPoints when present' },
      ],
      rules: [
        'Compose only via x-import from the bound namespace — never imitate components with raw HTML.',
        'Copy and section order must reflect THIS product (readme + DESIGN.md), not a generic template.',
        'Side nav or index with anchors to every section and every component.',
        'Each component block: name, source path, description in product voice, live demo.',
        'Use var(--*) tokens from bound CSS; do not invent hex values.',
        'After assembly, delete the CDP:SHOWCASE:PENDING block entirely.',
      ],

    },
  };
}

export function writeShowcaseBrief(binding, voice, cwd = process.cwd()) {
  const brief = buildShowcaseBrief(binding, voice, cwd);
  const dir = path.join(cwd, '.cdp');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(cwd, BRIEF_PATH), `${JSON.stringify(brief, null, 2)}\n`);
  return { path: BRIEF_PATH, brief };
}

export function showcaseNeedsAssembly(cwd = process.cwd(), binding = null) {
  const introRel = binding?.introDc ?? 'design-system.dc.html';
  const introPath = path.join(cwd, introRel);
  if (!fs.existsSync(introPath)) return true;
  const html = safeRead(cwd, introRel);
  if (html.includes('<!-- CDP:SHOWCASE:PENDING -->')) return true;
  if (!html.includes('data-cdp-showcase="assembled"')) return true;
  if (binding?.showcaseAssembled !== true) {
    const briefPath = path.join(cwd, BRIEF_PATH);
    if (!fs.existsSync(briefPath)) return true;
  }
  return false;
}

export const SHOWCASE_BRIEF_PATH = BRIEF_PATH;