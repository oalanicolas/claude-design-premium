#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];

function pass(name, detail = '') {
  checks.push({ ok: true, name, detail });
}

function fail(name, detail = '') {
  checks.push({ ok: false, name, detail });
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  try {
    return fs.readFileSync(path.join(root, rel), 'utf8');
  } catch {
    return '';
  }
}

function requireFile(rel) {
  exists(rel) ? pass(`exists: ${rel}`) : fail(`exists: ${rel}`, 'missing');
}

function walk(dir, files = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return files;
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist', 'build', '.next'].includes(ent.name)) continue;
    const rel = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(rel, files);
    else files.push(rel);
  }
  return files;
}

for (const rel of [
  'CLAUDE.md',
  'CLAUDE-DESIGN-SEED.md',
  'DESIGN.md.example',
  'design-tokens.json.example',
  'styles.css',
  'docs/canvas-core.md',
  'docs/native-claude-design-alignment.md',
  'scripts/generate-design-tokens.mjs',
  'scripts/detect-text-antipatterns.mjs',
  'starter-kit/static/tokens.css',
  'starter-kit/static/README.md',
  'templates/ds-base.js',
  'templates/page-base/index.html',
  'templates/landing/index.html',
  'templates/deck/index.html',
  'components/Botao.jsx',
  'components/Botao.d.ts',
  'components/Botao.html',
  'skills/text-integrity-audit.skill.md',
  'starter-kit/static/react-example/index.html',
  'starter-kit/static/react-example/component.jsx',
  'starter-kit/static/global-script-example/index.html',
  'starter-kit/static/global-script-example/widget.js',
]) {
  requireFile(rel);
}

const claude = read('CLAUDE.md');
claude.includes('CDP-CLAUDE-OK') ? pass('CLAUDE canary present') : fail('CLAUDE canary present');
/Literal routing table/i.test(claude) ? pass('literal routing table present') : fail('literal routing table present');
claude.includes('SKILLS APPLIED') && claude.includes('NEXT RECOMMENDED')
  ? pass('mandatory reporting block present')
  : fail('mandatory reporting block present');
!exists('CLAUDE-ROUTER.md') ? pass('no public CLAUDE-ROUTER.md') : fail('no public CLAUDE-ROUTER.md');

let tokens = null;
try {
  tokens = JSON.parse(read('design-tokens.json.example'));
  pass('design-tokens.json.example parses');
} catch (err) {
  fail('design-tokens.json.example parses', err.message);
}

if (tokens) {
  try {
    execFileSync(process.execPath, ['scripts/generate-design-tokens.mjs', '--check'], {
      cwd: root,
      stdio: 'pipe',
    });
    pass('design-tokens JSON generated from CSS token source');
  } catch (err) {
    fail('design-tokens JSON generated from CSS token source', String(err.stderr || err.message));
  }
}

const stalePatterns = [
  /USER-VERIFIED: it does not/,
  /localStorage\/sessionStorage availability is \*\*not confirmed\*\*/,
  /prebuilt bundle .*does \*\*not\*\* run/i,
  /bundled modules inside/i,
  /bundled files/i,
];
const staleHits = [];
for (const file of walk('.').filter((rel) => /\.(md|html|css|js|jsx|mjs)$/.test(rel) && rel !== 'scripts/validate-cdp.mjs')) {
  const text = read(file);
  for (const pattern of stalePatterns) {
    if (pattern.test(text)) staleHits.push(`${file}: ${pattern}`);
  }
}
staleHits.length ? fail('no stale runtime claims', staleHits.join('\n')) : pass('no stale runtime claims');

const activeTextFiles = walk('.').filter((rel) => {
  if (!/\.(md|html|txt)$/.test(rel)) return false;
  if (rel.startsWith('docs/archive/')) return false;
  return true;
});
const bannedVoiceChars = [
  [0x2014, 'U+2014 em dash'],
  [0x2013, 'U+2013 en dash'],
  [0x2192, 'U+2192 right arrow'],
  [0x2026, 'U+2026 ellipsis'],
  [0x201c, 'U+201C left double quote'],
  [0x201d, 'U+201D right double quote'],
  [0x2018, 'U+2018 left single quote'],
  [0x2019, 'U+2019 right single quote'],
];
const escapedVoiceLabels = [
  ['AI', 'slo' + 'p'].join(' '),
  ['anti', 'slo' + 'p'].join('-'),
  ['AI', 'looking'].join('-'),
  ['generic', 'AI'].join(' '),
].map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const bannedVoicePhrases = [
  new RegExp(`\\b(?:${escapedVoiceLabels.join('|')})\\b`, 'i'),
];
const voiceHits = [];
for (const file of activeTextFiles) {
  const text = read(file);
  for (const [codePoint, label] of bannedVoiceChars) {
    if (text.includes(String.fromCodePoint(codePoint))) voiceHits.push(`${file}: ${label}`);
  }
  for (const pattern of bannedVoicePhrases) {
    if (pattern.test(text)) voiceHits.push(`${file}: ${pattern}`);
  }
}
voiceHits.length
  ? fail('active docs avoid generated-text tells', voiceHits.join('\n'))
  : pass('active docs avoid generated-text tells');

const externalImportHits = [];
for (const file of walk('scripts').filter((rel) => /\.(js|mjs)$/.test(rel))) {
  const text = read(file);
  const importRe = /(?:from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\))/g;
  let match;
  while ((match = importRe.exec(text))) {
    const spec = match[1] || match[2] || match[3];
    if (!spec.startsWith('node:') && !spec.startsWith('./') && !spec.startsWith('../')) {
      externalImportHits.push(`${file}: ${spec}`);
    }
  }
}
externalImportHits.length
  ? fail('scripts use no external npm packages', externalImportHits.join('\n'))
  : pass('scripts use no external npm packages');

const reactHtml = read('starter-kit/static/react-example/index.html');
const reactJsx = read('starter-kit/static/react-example/component.jsx');
const reactChecks = [
  ['React UMD script', reactHtml.includes('react@18.3.1/umd/react.development.js')],
  ['React UMD SRI', reactHtml.includes('sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L')],
  ['ReactDOM UMD script', reactHtml.includes('react-dom@18.3.1/umd/react-dom.development.js')],
  ['ReactDOM UMD SRI', reactHtml.includes('sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm')],
  ['Babel standalone script', reactHtml.includes('@babel/standalone@7.24.7/babel.min.js')],
  ['SRI attributes', reactHtml.includes('integrity="sha384-')],
  ['text/babel script', reactHtml.includes('type="text/babel"')],
  ['component exposes window', reactJsx.includes('Object.assign(window')],
  ['component has no import/export', !/\b(import|export)\b/.test(reactJsx)],
];
for (const [name, ok] of reactChecks) ok ? pass(`react example: ${name}`) : fail(`react example: ${name}`);

const globalHtml = read('starter-kit/static/global-script-example/index.html');
const globalJs = read('starter-kit/static/global-script-example/widget.js');
const globalChecks = [
  ['plain script src', globalHtml.includes('<script src="./widget.js"></script>')],
  ['exposes window namespace', globalJs.includes('window.CDPGlobalWidget')],
  ['has no import/export', !/\b(import|export)\b/.test(globalJs)],
  ['has no import.meta', !/import\.meta/.test(globalJs)],
];
for (const [name, ok] of globalChecks) ok ? pass(`global script example: ${name}`) : fail(`global script example: ${name}`);

for (const slug of ['page-base', 'landing', 'deck']) {
  const rel = `templates/${slug}/index.html`;
  const firstLine = read(rel).split(/\r?\n/)[0]?.trim();
  /^<!-- @template name="[^"]+" description="[^"]+" -->$/.test(firstLine)
    ? pass(`native template marker: ${rel}`)
    : fail(`native template marker: ${rel}`, firstLine || 'missing name/description marker');
  !read(rel).includes('starter-kit/static/styles.css')
    ? pass(`native template uses ds-base: ${rel}`)
    : fail(`native template uses ds-base: ${rel}`, 'template links starter-kit/static/styles.css directly');
}

const botao = read('components/Botao.jsx');
const botaoChecks = [
  ['component exports named function', /\bexport\s+function\s+Botao\b/.test(botao)],
  ['component has no imports', !/\bimport\b/.test(botao)],
  ['component does not assign window', !/\bwindow\b/.test(botao)],
];
for (const [name, ok] of botaoChecks) ok ? pass(`native component example: ${name}`) : fail(`native component example: ${name}`);

const botaoCard = read('components/Botao.html');
botaoCard.includes('@dsCard') && botaoCard.includes('name="Botao"')
  ? pass('native dsCard sidecar marker: components/Botao.html')
  : fail('native dsCard sidecar marker: components/Botao.html');
!/\.jsx(['"]|\b)/.test(botaoCard)
  ? pass('native dsCard sidecar does not load raw JSX')
  : fail('native dsCard sidecar does not load raw JSX');
botaoCard.includes('react@18.3.1') && botaoCard.includes('_ds_bundle.js') && botaoCard.includes('Object.values(window)')
  ? pass('native dsCard sidecar waits for compiled namespace')
  : fail('native dsCard sidecar waits for compiled namespace');

const rootStyles = read('styles.css');
rootStyles.includes('starter-kit/static/tokens.css') && rootStyles.includes('starter-kit/static/styles.css')
  ? pass('root styles.css imports token and static CSS')
  : fail('root styles.css imports token and static CSS');

const dsBase = read('templates/ds-base.js');
dsBase.includes('/styles.css') && dsBase.includes('/_ds_bundle.js') && !dsBase.includes('data-cdp-brand')
  ? pass('ds-base loads native styles and bundle')
  : fail('ds-base loads native styles and bundle');

for (const rel of [
  'scripts/generate-design-tokens.mjs',
  'scripts/detect-text-antipatterns.mjs',
  'templates/ds-base.js',
  'starter-kit/static/assets/js/boot.js',
  'starter-kit/static/assets/config/site.js',
  'starter-kit/static/global-script-example/widget.js',
]) {
  try {
    execFileSync(process.execPath, ['--check', rel], { cwd: root, stdio: 'pipe' });
    pass(`node --check ${rel}`);
  } catch (err) {
    fail(`node --check ${rel}`, String(err.stderr || err.message));
  }
}

const mdMissing = [];
for (const file of walk('.').filter((rel) => rel.endsWith('.md'))) {
  const text = read(file);
  const re = /\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/g;
  let match;
  while ((match = re.exec(text))) {
    let target = match[1].split('#')[0].trim().replace(/^<|>$/g, '');
    if (!target || target.startsWith('app://')) continue;
    const resolved = path.resolve(root, path.dirname(file), target);
    if (!fs.existsSync(resolved)) mdMissing.push(`${file} -> ${match[1]}`);
  }
}
mdMissing.length ? fail('markdown internal links resolve', mdMissing.join('\n')) : pass('markdown internal links resolve');

const dsStores = walk('.').filter((rel) => path.basename(rel) === '.DS_Store');
dsStores.length ? fail('no .DS_Store files', dsStores.join(', ')) : pass('no .DS_Store files');

try {
  execFileSync(process.execPath, ['scripts/detect-canvas-antipatterns.mjs', 'starter-kit/static'], {
    cwd: root,
    stdio: 'pipe',
  });
  pass('canvas anti-pattern detector clean');
} catch (err) {
  fail('canvas anti-pattern detector clean', String(err.stdout || err.stderr || err.message));
}

try {
  execFileSync(process.execPath, ['scripts/detect-canvas-antipatterns.mjs', 'templates'], {
    cwd: root,
    stdio: 'pipe',
  });
  pass('native template anti-pattern detector clean');
} catch (err) {
  fail('native template anti-pattern detector clean', String(err.stdout || err.stderr || err.message));
}

try {
  execFileSync(process.execPath, ['scripts/detect-text-antipatterns.mjs', 'README.md', 'README.pt-BR.md', 'CLAUDE.md', 'docs', 'skills', 'templates', 'examples'], {
    cwd: root,
    stdio: 'pipe',
  });
  pass('text anti-pattern detector has no P1 findings');
} catch (err) {
  fail('text anti-pattern detector has no P1 findings', String(err.stdout || err.stderr || err.message));
}

const failed = checks.filter((check) => !check.ok);
for (const check of checks) {
  process.stdout.write(`${check.ok ? 'ok' : 'FAIL'} - ${check.name}${check.detail ? `\n  ${check.detail}` : ''}\n`);
}

if (failed.length) {
  process.stderr.write(`\n${failed.length} validation check(s) failed.\n`);
  process.exit(1);
}

process.stdout.write(`\nAll ${checks.length} validation checks passed.\n`);
