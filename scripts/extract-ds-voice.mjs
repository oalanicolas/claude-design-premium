#!/usr/bin/env node
/**
 * extract-ds-voice.mjs
 *
 * Derives communication voice from a bound DS readme (slim subset for binding + showcase brief).
 * Used by bootstrap-harness.mjs and mirrored by harness-auto-setup in the canvas.
 */
import fs from 'node:fs';
import path from 'node:path';
import { applyTokenHintsToVoice, extractDsTokens } from './extract-ds-tokens.mjs';
import { detectDocLanguage } from './intro-dc.mjs';

function read(root, rel) {
  try {
    return fs.readFileSync(path.join(root, rel), 'utf8');
  } catch {
    return '';
  }
}

function firstMatch(text, patterns) {
  for (const re of patterns) {
    const m = text.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return '';
}

function extractSurfaces(readmeText) {
  const surfaces = [];
  const intro = readmeText.split(/\n---\n/)[0] ?? readmeText;
  for (const m of intro.matchAll(/^\s*-\s*\*\*([^*]+)\*\*\s*[—–-]/gm)) {
    const name = m[1].trim();
    if (!surfaces.includes(name)) surfaces.push(name);
  }
  return surfaces.slice(0, 5);
}

function normalizeLogoPath(binding, logoPath) {
  if (!logoPath) return null;
  const normalized = logoPath.replace(/\\/g, '/');
  if (normalized.startsWith(`${binding.root}/`)) return normalized;
  if (normalized.startsWith('_ds/')) return normalized;
  if (normalized.startsWith('assets/')) return `${binding.root}/${normalized}`;
  return `${binding.root}/assets/${normalized}`;
}

function extractLogoPath(binding, readmeText, cwd) {
  const fromReadme = firstMatch(readmeText, [
    /`([^`]+\.(?:svg|png))`[^.\n]*(?:logo|wordmark|favicon)/i,
    /(?:logo|wordmark)[^`]*`([^`]+\.(?:svg|png))`/i,
  ]);
  if (fromReadme) return normalizeLogoPath(binding, fromReadme);

  const assetsDir = path.join(cwd, binding.root, 'assets');
  if (fs.existsSync(assetsDir)) {
    // Prefer explicit logo files, then fall back to any svg/png in assets/.
    const preferred = ['logo.svg', 'logo.png', 'logo-mark.svg', 'brand.svg', 'favicon.svg', 'favicon.png'];
    for (const name of preferred) {
      if (fs.existsSync(path.join(assetsDir, name))) {
        return `${binding.root}/assets/${name}`.replace(/\\/g, '/');
      }
    }
    const found = fs
      .readdirSync(assetsDir)
      .find((f) => /^(logo|brand|mark|icon)[\w-]*\.(svg|png)$/i.test(f));
    if (found) return `${binding.root}/assets/${found}`.replace(/\\/g, '/');
  }

  return null;
}

function applyDefaults(voice, binding) {
  const name = binding.name;

  if (!voice.tagline) voice.tagline = `Design system para ${name}.`;
  if (!voice.productDescription) {
    voice.productDescription = `Plataforma guiada pelo design system ${name}.`;
  }
  if (!voice.badge) voice.badge = name;
  if (!voice.surfaces.length) {
    voice.surfaces =
      voice.language === 'en' ? ['Home', 'Product', 'Settings'] : ['Início', 'Produto', 'Configurações'];
  }

  return voice;
}

export function extractDsVoice(binding, cwd = process.cwd()) {
  const readmeText = binding.readme ? read(cwd, binding.readme) : '';
  const readmeHadTheme = /light.*default|dark.*default|dark mode is the default/i.test(readmeText);

  const voice = {
    language: detectDocLanguage(cwd, { readmePath: binding.readme }),
    themeDefault: /light.*default/i.test(readmeText) ? 'light' : 'dark',
    themeLabel: /light.*default/i.test(readmeText) ? 'DIA · LIGHT' : 'NOITE · DARK',
    tagline: firstMatch(readmeText, [/^>\s*["']?(.+?)["']?\s*$/m]),
    productDescription: firstMatch(readmeText, [
      /^Design system for \*\*[^*]+\*\*[^,]*,\s*([^\n.]+)/im,
      /^Design system for \*\*[^*]+\*\*[^.]*\.([^\n]+)/im,
      /^>?\s*([A-Z][^\n]{20,120}\.)\s*$/m,
    ]),
    surfaces: extractSurfaces(readmeText),
    badge: firstMatch(readmeText, [
      /Taglines[^:]*:\s*["']([^"']+)["']/i,
      /almost mystical:\s*["']([^"']+)["']/i,
    ]),
    logoPath: extractLogoPath(binding, readmeText, cwd),
  };

  applyDefaults(voice, binding);

  voice._readmeHadTheme = readmeHadTheme;
  const tokens = extractDsTokens(binding, cwd);
  applyTokenHintsToVoice(voice, tokens);
  delete voice._readmeHadTheme;

  return voice;
}