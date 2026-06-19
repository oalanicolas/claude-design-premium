#!/usr/bin/env node
/**
 * extract-ds-tokens.mjs
 *
 * Samples token CSS from the bound DS for DESIGN.md synthesis and voice fallbacks.
 */
import { importPath } from './ds-paths.mjs';
import { safeRead } from './file-snapshot.mjs';

function uniqueSorted(items) {
  return [...new Set(items)].sort();
}

function pickVars(text, patterns, limit = 12) {
  const found = [];
  for (const m of text.matchAll(/--([a-z0-9-]+)/gi)) {
    const name = `--${m[1]}`;
    if (patterns.some((re) => re.test(name))) found.push(name);
    if (found.length >= limit) break;
  }
  return uniqueSorted(found);
}

function detectThemeFromCss(cssText) {
  if (/\.light\b|data-theme\s*=\s*["']light["']/i.test(cssText)) return 'light';
  if (/dark.*default|default.*dark|hsl\(0\s+0%\s+[0-9]+%\)/i.test(cssText)) return 'dark';
  return null;
}

/**
 * @param {object} binding
 * @param {string} [cwd]
 */
export function extractDsTokens(binding, cwd = process.cwd()) {
  const paths = (binding.globalCssPaths ?? []).slice(0, 4);
  let corpus = '';
  let found = 0;

  for (const rel of paths) {
    const content = safeRead(cwd, importPath(binding, rel));
    if (content) found += 1;
    corpus += `${content}\n`;
  }

  if (!found) {
    const listed = paths.length ? paths.join(', ') : '(none listed)';
    process.stderr.write(`Warning: no token CSS found in: ${listed}\n`);
  }

  const allVars = uniqueSorted([...corpus.matchAll(/--([a-z0-9-]+)/gi)].map((m) => `--${m[1]}`));

  const colors = pickVars(corpus, [/^--(?:background|foreground|primary|secondary|muted|accent|border|destructive|card|hairline)/]);
  const fonts = pickVars(corpus, [/^--font-/]);
  const spacing = pickVars(corpus, [/^--(?:spacing|space|size|gap|padding|margin|radius)/, /^--radius/]);
  const motion = pickVars(corpus, [/^--(?:duration|ease|transition|motion)/]);

  const themeFromCss = detectThemeFromCss(corpus);

  return {
    cssPathsSampled: paths,
    tokenCssFilesFound: found,
    varCount: allVars.length,
    colors: colors.length ? colors : allVars.filter((v) => /color|background|foreground|primary|hairline|border/.test(v)).slice(0, 10),
    fonts: fonts.length ? fonts : allVars.filter((v) => v.startsWith('--font-')).slice(0, 6),
    spacing: spacing.length ? spacing : allVars.filter((v) => /spacing|radius|gap/.test(v)).slice(0, 8),
    motion: motion.length ? motion : allVars.filter((v) => /duration|ease|transition/.test(v)).slice(0, 6),
    themeDefault: themeFromCss,
    sampleVars: allVars.slice(0, 24),
  };
}

/**
 * Merge token hints into voice when readme is thin.
 * @param {object} voice
 * @param {ReturnType<typeof extractDsTokens>} tokens
 */
export function applyTokenHintsToVoice(voice, tokens) {
  if (!tokens.themeDefault) return voice;

  if (!voice._readmeHadTheme && tokens.themeDefault === 'light') {
    voice.themeDefault = 'light';
    voice.themeLabel = 'DIA · LIGHT';
  } else if (!voice._readmeHadTheme && tokens.themeDefault === 'dark') {
    voice.themeDefault = 'dark';
    voice.themeLabel = 'NOITE · DARK';
  }

  return voice;
}
