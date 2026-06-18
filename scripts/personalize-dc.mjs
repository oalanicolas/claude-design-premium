#!/usr/bin/env node
/**
 * personalize-dc.mjs
 *
 * Personalizes *.dc.html with DS voice + component-aware pruning after bootstrap.
 */
import fs from 'node:fs';
import path from 'node:path';
import { voiceToPlaceholderMap } from './extract-ds-voice.mjs';

function walk(dir, files = [], root = process.cwd()) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return files;
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const rel = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(rel, files, root);
    else files.push(rel);
  }
  return files;
}

function applyVoicePlaceholders(text, voice) {
  let out = text;
  const map = voiceToPlaceholderMap(voice);
  for (const [key, value] of Object.entries(map)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

function pruneRequiresBlocks(text, components) {
  const set = new Set(components);
  return text.replace(
    /<!-- CDP:REQUIRES:(\w+) -->[\s\S]*?<!-- \/CDP:REQUIRES:\1 -->/g,
    (block, name) => {
      if (!set.has(name)) return '';
      return block
        .replace(/<!-- CDP:REQUIRES:\w+ -->\n?/g, '')
        .replace(/\n?<!-- \/CDP:REQUIRES:\w+ -->/g, '');
    },
  );
}

function pruneGalleryCards(text, components) {
  const set = new Set(components);
  return text.replace(
    /<!-- CDP:GALLERY:(\w+) -->[\s\S]*?<!-- \/CDP:GALLERY:\1 -->/g,
    (block, name) => {
      if (!set.has(name)) return '';
      return block
        .replace(/<!-- CDP:GALLERY:\w+ -->\n?/g, '')
        .replace(/\n?<!-- \/CDP:GALLERY:\w+ -->/g, '');
    },
  );
}

const GALLERY_COMPONENTS = [
  'Button',
  'Badge',
  'Icon',
  'Input',
  'Textarea',
  'Label',
  'Switch',
  'Checkbox',
  'Alert',
  'Avatar',
  'Progress',
  'Tabs',
  'StatChip',
  'SectionHeader',
  'BookCard',
  'Card',
];

function pruneStarterGalleryByTitle(text, components) {
  const set = new Set(components);
  let out = text;
  for (const name of GALLERY_COMPONENTS) {
    if (set.has(name)) continue;
    const re = new RegExp(
      String.raw`\s*<x-import component-from-global-scope="\{\{BOUND_DS_NAMESPACE\}\}\.Card"[\s\S]*?<x-import[^>]*CardTitle[^>]*>${name}</x-import>[\s\S]*?</x-import>\s*</x-import>`,
      'g',
    );
    out = out.replace(re, '');
  }
  return out;
}

function buildSurfacesGrid(voice, namespace) {
  const items = voice.surfaces.slice(0, 4);
  return items
    .map((surface, i) => {
      const icon = voice.surfaceIcons?.[i] || 'star';
      const blurb =
        voice.language === 'en'
          ? `Explore ${surface} with ${namespace} components.`
          : `Explore ${surface} com os componentes de ${namespace}.`;
      return `      <div style="background:var(--background);padding:40px 32px;display:flex;flex-direction:column;gap:16px;">
        <i class="iconoir-${icon}" aria-hidden="true" style="font-size:30px;color:var(--primary);"></i>
        <h3 style="font-family:var(--font-serif);font-weight:400;font-size:var(--font-size-2xl);margin:0;line-height:1.1;">${surface}</h3>
        <p style="font-size:var(--font-size-base);color:var(--muted-foreground);line-height:1.55;margin:0;">${blurb}</p>
      </div>`;
    })
    .join('\n');
}

function buildNavLinks(voice) {
  return voice.surfaces
    .slice(0, 4)
    .map((surface) => `        <a href="#" style="color:inherit;text-decoration:none;">${surface}</a>`)
    .join('\n');
}

function buildAppNavItems(voice) {
  const icons = voice.surfaceIcons || [];
  return voice.surfaces
    .slice(0, 5)
    .map((label, i) => {
      const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const icon = icons[i] || 'star';
      return `      { id: '${id}', label: '${label}', icon: '${icon}' },`;
    })
    .join('\n');
}

function injectAppNav(text, voice) {
  const items = buildAppNavItems(voice);
  return text.replace(
    /\/\/ CDP:APP-NAV[\s\S]*?\/\/ \/CDP:APP-NAV/,
    `// CDP:APP-NAV\n${items}\n      // /CDP:APP-NAV`,
  );
}

function injectSurfaces(text, voice, namespace) {
  const grid = buildSurfacesGrid(voice, namespace);
  return text.replace(
    /<!-- CDP:SURFACES -->[\s\S]*?<!-- \/CDP:SURFACES -->/,
    `<!-- CDP:SURFACES -->\n${grid}\n      <!-- /CDP:SURFACES -->`,
  );
}

function injectNavLinks(text, voice) {
  const links = buildNavLinks(voice);
  return text.replace(
    /<!-- CDP:NAV-LINKS -->[\s\S]*?<!-- \/CDP:NAV-LINKS -->/,
    `<!-- CDP:NAV-LINKS -->\n${links}\n      <!-- /CDP:NAV-LINKS -->`,
  );
}

function setThemeDefault(text, voice) {
  return text.replace(
    /"default":"(?:dark|light)"/g,
    `"default":"${voice.themeDefault}"`,
  );
}

export function personalizeDcContent(text, binding, voice) {
  let out = text;
  out = applyVoicePlaceholders(out, voice);
  out = pruneRequiresBlocks(out, binding.components);
  out = pruneGalleryCards(out, binding.components);
  if (out.includes('Biblioteca de Componentes')) out = pruneStarterGalleryByTitle(out, binding.components);
  out = injectSurfaces(out, voice, binding.namespace);
  out = injectNavLinks(out, voice);
  if (out.includes('// CDP:APP-NAV')) out = injectAppNav(out, voice);
  out = setThemeDefault(out, voice);
  return out;
}

export function personalizeDcFiles(binding, voice, cwd = process.cwd()) {
  const targets = walk('.', [], cwd).filter((f) => f.endsWith('.dc.html'));
  let personalized = 0;

  for (const rel of targets) {
    const abs = path.join(cwd, rel);
    const before = fs.readFileSync(abs, 'utf8');
    const after = personalizeDcContent(before, binding, voice);
    if (after !== before) {
      fs.writeFileSync(abs, after);
      personalized += 1;
    }
  }

  return { personalized, targets: targets.length };
}