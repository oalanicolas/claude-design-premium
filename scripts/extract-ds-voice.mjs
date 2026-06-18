#!/usr/bin/env node
/**
 * extract-ds-voice.mjs
 *
 * Derives communication + product voice from a bound DS readme and manifest.
 * Used by bootstrap-harness.mjs and mirrored by harness-auto-setup in the canvas.
 */
import fs from 'node:fs';
import path from 'node:path';

const SURFACE_ICONS = ['book', 'graduation-cap', 'brain', 'group', 'bookmark', 'settings'];

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
  for (const m of readmeText.matchAll(/^\s*-\s*\*\*([^*]+)\*\*\s*[—–-]/gm)) {
    const name = m[1].trim();
    if (!surfaces.includes(name)) surfaces.push(name);
  }
  return surfaces.slice(0, 5);
}

function normalizeLogoPath(binding, logoPath) {
  if (!logoPath) return `${binding.root}/assets/logo-gold.svg`;
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
    for (const name of ['logo-gold.svg', 'logo.svg', 'logo-academialendaria.svg', 'favicon.png']) {
      if (fs.existsSync(path.join(assetsDir, name))) {
        return `${binding.root}/assets/${name}`.replace(/\\/g, '/');
      }
    }
  }

  return `${binding.root}/assets/logo-gold.svg`;
}

function deriveHeroHeadline(name, tagline) {
  const words = tagline.split(/\s+/).filter(Boolean);
  if (words.length >= 3) {
    const accent = words[words.length - 1].replace(/[.,"']/g, '');
    const lead = words.slice(0, -1).join(' ');
    return `${lead} <em>${accent}.</em>`;
  }
  return `Construa com <em>${name}.</em>`;
}

function applyDefaults(voice, binding, readmeText = '') {
  const name = binding.name;

  if (!voice.tagline) voice.tagline = `Design system para ${name}.`;
  if (!voice.productDescription) {
    voice.productDescription = `Plataforma guiada pelo design system ${name}.`;
  }
  if (!voice.badge) voice.badge = name;
  if (!voice.heroHeadline) voice.heroHeadline = deriveHeroHeadline(name, voice.tagline);
  if (!voice.heroSubhead) voice.heroSubhead = voice.productDescription;
  if (!voice.ctaPrimary) voice.ctaPrimary = voice.language === 'en' ? 'Get started' : 'Começar agora';
  if (!voice.ctaSecondary) voice.ctaSecondary = voice.language === 'en' ? 'Learn more' : 'Saiba mais';
  if (!voice.closingEyebrow) {
    voice.closingEyebrow = voice.language === 'en' ? 'Start now' : 'Comece hoje';
  }
  if (!voice.closingHeadline) voice.closingHeadline = deriveHeroHeadline(name, voice.tagline);
  if (!voice.deckCoverHeadline) voice.deckCoverHeadline = voice.heroHeadline;
  if (!voice.deckCoverSubhead) voice.deckCoverSubhead = voice.tagline;
  if (!voice.welcomeEyebrow) {
    voice.welcomeEyebrow = voice.surfaces[0] || (voice.language === 'en' ? 'Dashboard' : 'Início');
  }
  if (!voice.welcomeHeadline) {
    voice.welcomeHeadline =
      voice.language === 'en' ? `Welcome to <em>${name}.</em>` : `Bem-vindo ao <em>${name}.</em>`;
  }
  if (!voice.welcomeSubhead) {
    voice.welcomeSubhead =
      voice.language === 'en'
        ? 'Replace this demo content with your delivery.'
        : 'Substitua este conteúdo demo pela sua entrega.';
  }
  if (!voice.docTitle) {
    voice.docTitle =
      voice.language === 'en'
        ? `Product direction for <em>${name}.</em>`
        : `Direção de produto para <em>${name}.</em>`;
  }
  if (!voice.docLead) voice.docLead = voice.productDescription;
  if (!voice.areaSuffix) {
    const first = voice.surfaces[0] || name;
    voice.areaSuffix = first.toUpperCase();
  }
  if (!voice.searchPlaceholder) {
    voice.searchPlaceholder =
      voice.language === 'en' ? `Search ${name}…` : `Buscar em ${name}…`;
  }
  const securedBy = firstMatch(readmeText, [/Secured by ([A-Za-z]+)/i]);
  if (!voice.footerNote) {
    voice.footerNote = securedBy
      ? `© 2026 ${name} · SECURED BY ${securedBy.toUpperCase()}`
      : `© 2026 ${name}`;
  }
  if (!voice.surfaces.length) {
    voice.surfaces =
      voice.language === 'en' ? ['Home', 'Product', 'Settings'] : ['Início', 'Produto', 'Configurações'];
  }

  voice.surfaceIcons = voice.surfaces.map((_, i) => SURFACE_ICONS[i] || 'star');
  return voice;
}

export function extractDsVoice(binding, cwd = process.cwd()) {
  const readmeText = binding.readme ? read(cwd, binding.readme) : '';

  const voice = {
    language: /english/i.test(readmeText) && !/pt-BR|português brasileiro/i.test(readmeText) ? 'en' : 'pt-BR',
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
    ctaPrimary: firstMatch(readmeText, [
      /imperative[^:]*:\s*["']([^"']+)["']/i,
      /CTA[^:]*:\s*["']([^"']+)["']/i,
    ]),
    ctaSecondary: '',
    heroHeadline: '',
    heroSubhead: '',
    closingEyebrow: '',
    closingHeadline: '',
    deckCoverHeadline: '',
    deckCoverSubhead: '',
    welcomeEyebrow: '',
    welcomeHeadline: '',
    welcomeSubhead: '',
    docTitle: '',
    docLead: '',
    areaSuffix: '',
    searchPlaceholder: '',
    footerNote: '',
    logoPath: extractLogoPath(binding, readmeText, cwd),
  };

  return applyDefaults(voice, binding, readmeText);
}

export const VOICE_PLACEHOLDERS = [
  'BOUND_DS_BADGE',
  'BOUND_DS_HERO_HEADLINE',
  'BOUND_DS_HERO_SUBHEAD',
  'BOUND_DS_CTA_PRIMARY',
  'BOUND_DS_CTA_SECONDARY',
  'BOUND_DS_THEME_LABEL',
  'BOUND_DS_AREA_SUFFIX',
  'BOUND_DS_SEARCH_PLACEHOLDER',
  'BOUND_DS_WELCOME_EYEBROW',
  'BOUND_DS_WELCOME_HEADLINE',
  'BOUND_DS_WELCOME_SUBHEAD',
  'BOUND_DS_CLOSING_EYEBROW',
  'BOUND_DS_CLOSING_HEADLINE',
  'BOUND_DS_DECK_COVER_HEADLINE',
  'BOUND_DS_DECK_COVER_SUBHEAD',
  'BOUND_DS_DOC_TITLE',
  'BOUND_DS_DOC_LEAD',
  'BOUND_DS_FOOTER_NOTE',
  'BOUND_DS_LOGO_PATH',
];

export function voiceToPlaceholderMap(voice) {
  return {
    BOUND_DS_BADGE: voice.badge,
    BOUND_DS_HERO_HEADLINE: voice.heroHeadline,
    BOUND_DS_HERO_SUBHEAD: voice.heroSubhead,
    BOUND_DS_CTA_PRIMARY: voice.ctaPrimary,
    BOUND_DS_CTA_SECONDARY: voice.ctaSecondary,
    BOUND_DS_THEME_LABEL: voice.themeLabel,
    BOUND_DS_AREA_SUFFIX: voice.areaSuffix,
    BOUND_DS_SEARCH_PLACEHOLDER: voice.searchPlaceholder,
    BOUND_DS_WELCOME_EYEBROW: voice.welcomeEyebrow,
    BOUND_DS_WELCOME_HEADLINE: voice.welcomeHeadline,
    BOUND_DS_WELCOME_SUBHEAD: voice.welcomeSubhead,
    BOUND_DS_CLOSING_EYEBROW: voice.closingEyebrow,
    BOUND_DS_CLOSING_HEADLINE: voice.closingHeadline,
    BOUND_DS_DECK_COVER_HEADLINE: voice.deckCoverHeadline,
    BOUND_DS_DECK_COVER_SUBHEAD: voice.deckCoverSubhead,
    BOUND_DS_DOC_TITLE: voice.docTitle,
    BOUND_DS_DOC_LEAD: voice.docLead,
    BOUND_DS_FOOTER_NOTE: voice.footerNote,
    BOUND_DS_LOGO_PATH: voice.logoPath,
  };
}