#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const cssPath = path.join(root, 'starter-kit/static/tokens.css');
const jsonPath = path.join(root, 'design-tokens.json.example');

function parseCssVars(css) {
  const vars = new Map();
  const declarationRe = /--(cds-[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = declarationRe.exec(css))) {
    vars.set(match[1], match[2].trim());
  }
  return vars;
}

function buildResolver(vars) {
  function resolve(name, seen = new Set()) {
    if (!vars.has(name)) {
      throw new Error(`Missing CSS variable --${name}`);
    }

    const value = vars.get(name);
    const ref = value.match(/^var\(--([a-z0-9-]+)\)$/i);
    if (!ref) return value;

    if (seen.has(name)) {
      throw new Error(`Circular CSS variable reference: ${[...seen, name].join(' -> ')}`);
    }

    seen.add(name);
    return resolve(ref[1], seen);
  }

  return resolve;
}

function buildTokens(vars) {
  const get = buildResolver(vars);
  const scale = (prefix, keys) =>
    Object.fromEntries(keys.map((key) => [key, get(`${prefix}-${key}`)]));

  return {
    $schema: 'https://json.schemastore.org/design-tokens.json',
    name: 'Claude Design Premium Starter Tokens (Example)',
    version: '0.2.0',
    description:
      'Generated from starter-kit/static/tokens.css. CSS is the canonical canvas token source; regenerate this JSON after token edits.',

    color: {
      base: {
        white: get('cds-color-base-white'),
        black: get('cds-color-base-black'),
        gray: scale('cds-color-gray', ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
      },
      semantic: {
        primary: scale('cds-color-primary', ['50', '100', '500', '600', '700']),
        success: scale('cds-color-success', ['50', '500', '600']),
        warning: scale('cds-color-warning', ['50', '500', '600']),
        destructive: scale('cds-color-destructive', ['50', '500', '600']),
      },
      surface: {
        background: get('cds-color-surface-background'),
        card: get('cds-color-surface-card'),
        elevated: get('cds-color-surface-elevated'),
        muted: get('cds-color-surface-muted'),
      },
      text: {
        primary: get('cds-color-text-primary'),
        secondary: get('cds-color-text-secondary'),
        muted: get('cds-color-text-muted'),
        inverse: get('cds-color-text-inverse'),
      },
    },

    spacing: {
      scale: {
        0: '0px',
        ...scale('cds-space', ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24']),
      },
    },

    typography: {
      fontFamily: {
        sans: get('cds-font-sans'),
        display: get('cds-font-display'),
        mono: get('cds-font-mono'),
      },
      fontSize: scale('cds-font-size', ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']),
      fontWeight: scale('cds-font-weight', ['normal', 'medium', 'semibold', 'bold']),
      lineHeight: scale('cds-line-height', ['tight', 'normal', 'relaxed']),
      letterSpacing: scale('cds-letter-spacing', ['tight', 'normal', 'wide']),
    },

    radius: {
      none: '0px',
      ...scale('cds-radius', ['sm', 'md', 'lg', 'xl', 'full']),
    },

    elevation: scale('cds-elevation', ['none', 'sm', 'md', 'lg', 'xl']),

    motion: {
      duration: {
        fast: get('cds-motion-fast'),
        normal: get('cds-motion-normal'),
        slow: get('cds-motion-slow'),
      },
      easing: {
        default: get('cds-ease-default'),
        in: get('cds-ease-in'),
        out: get('cds-ease-out'),
        inOut: get('cds-ease-in-out'),
      },
    },

    breakpoint: scale('cds-breakpoint', ['sm', 'md', 'lg', 'xl']),

    component: {
      button: {
        height: scale('cds-component-button-height', ['sm', 'md', 'lg']),
        radius: get('cds-component-button-radius'),
        fontWeight: get('cds-component-button-font-weight'),
        letterSpacing: get('cds-component-button-letter-spacing'),
      },
      card: {
        radius: get('cds-component-card-radius'),
        border: get('cds-component-card-border'),
        padding: get('cds-component-card-padding'),
      },
      shell: {
        sidebarWidth: get('cds-component-shell-sidebar-width'),
        topbarHeight: get('cds-component-shell-topbar-height'),
        contentMaxWidth: get('cds-component-shell-content-max-width'),
      },
    },
  };
}

function renderTokens() {
  const css = fs.readFileSync(cssPath, 'utf8');
  const vars = parseCssVars(css);
  return `${JSON.stringify(buildTokens(vars), null, 2)}\n`;
}

const output = renderTokens();
const mode = process.argv[2] || '--print';

if (mode === '--write') {
  fs.writeFileSync(jsonPath, output);
  process.stdout.write(`Wrote ${path.relative(root, jsonPath)} from ${path.relative(root, cssPath)}\n`);
} else if (mode === '--check') {
  const current = fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath, 'utf8') : '';
  if (current !== output) {
    process.stderr.write(
      `design-tokens.json.example is out of date. Run: node scripts/generate-design-tokens.mjs --write\n`,
    );
    process.exit(1);
  }
  process.stdout.write('design-tokens.json.example is in sync with starter-kit/static/tokens.css\n');
} else if (mode === '--print') {
  process.stdout.write(output);
} else {
  process.stderr.write('Usage: node scripts/generate-design-tokens.mjs [--print|--write|--check]\n');
  process.exit(1);
}
