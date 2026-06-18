#!/usr/bin/env node
/**
 * unbind-harness.mjs
 *
 * Resets harness binding artifacts to agnostic template state.
 * Does NOT delete ./_ds/ (host project data).
 *
 * Usage:
 *   node scripts/unbind-harness.mjs
 *   node scripts/unbind-harness.mjs --dry-run
 *
 * Exit codes: 0 success · 1 failure (rolled back) · 2 no-op · 3 arg error
 */
import fs from 'node:fs';
import path from 'node:path';
import { FileSnapshot } from './file-snapshot.mjs';
import { removeLegacyDcFiles } from './intro-dc.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const GENERATED = ['BOUND_DS.json', 'ds-helmet.snippet.html'];

const UNBOUND_STYLES = `/* =============================================================================
   styles.css - root canvas token entry (UNBOUND)

   This harness ships without a bound design system. After the host DS is present:

   Builder: ./_ds_manifest.json + ./_ds_bundle.js at project root
   Consumer: ./_ds/<bundle>/ with the same files

   Run: node scripts/bootstrap-harness.mjs

   Until then, Claude reads manifest globalCssPaths at runtime.
   Do NOT add token values here - edit them in the bound DS.
   ============================================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
`;

const HELMET_PLACEHOLDER = '  {{DS_HELMET_BLOCK}}\n';

function walk(dir, files = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return files;
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const rel = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(rel, files);
    else files.push(rel);
  }
  return files;
}

function listRootDcFiles() {
  return walk('.').filter((f) => f.endsWith('.dc.html') && !f.startsWith('scripts/'));
}

function loadBinding() {
  const abs = path.join(root, 'BOUND_DS.json');
  if (!fs.existsSync(abs)) return null;
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch {
    return null;
  }
}

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildDynamicPatterns(binding) {
  const patterns = [];

  if (binding?.root) {
    patterns.push([new RegExp(escapeRe(binding.root), 'g'), '{{BOUND_DS_ROOT}}']);
  }

  if (binding?.namespace) {
    patterns.push([
      new RegExp(`\\b${escapeRe(binding.namespace)}\\b`, 'g'),
      '{{BOUND_DS_NAMESPACE}}',
    ]);
  }

  if (binding?.name) {
    patterns.push([new RegExp(escapeRe(binding.name), 'g'), '{{BOUND_DS_NAME}}']);
  }

  if (binding?.componentCount != null) {
    patterns.push([
      new RegExp(`value="${binding.componentCount}"`, 'g'),
      'value="{{BOUND_DS_COMPONENT_COUNT}}"',
    ]);
  }

  if (binding?.voice?.logoPath) {
    patterns.push([
      new RegExp(escapeRe(binding.voice.logoPath), 'g'),
      '{{BOUND_DS_LOGO_PATH}}',
    ]);
  }

  return patterns;
}

function resetHelmet(content) {
  return content.replace(
    /<helmet>[\s\S]*?<\/helmet>/,
    `<helmet>\n${HELMET_PLACEHOLDER}</helmet>`,
  );
}

function applyUnbindPatterns(text, binding) {
  let out = text;
  for (const [re, rep] of buildDynamicPatterns(binding)) {
    out = out.replace(re, rep);
  }
  return out;
}

function restoreDesignTemplate() {
  const templatePath = path.join(root, 'scripts/templates/design-md.template.md');
  if (fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, path.join(root, 'DESIGN.md'));
    return;
  }

  const unconfigured = `# DESIGN.md - Bound Design System

<!-- CDP:UNCONFIGURED - harness-auto-setup will replace this file on first session -->

> Template stub. Run node scripts/bootstrap-harness.mjs after ./_ds/ is present.
`;
  fs.writeFileSync(path.join(root, 'DESIGN.md'), unconfigured);
}

function isAlreadyUnbound() {
  const stylesUnbound = fs.existsSync(path.join(root, 'styles.css')) &&
    fs.readFileSync(path.join(root, 'styles.css'), 'utf8').includes('UNBOUND');
  const noBoundJson = !fs.existsSync(path.join(root, 'BOUND_DS.json'));
  const designStub = fs.existsSync(path.join(root, 'DESIGN.md')) &&
    fs.readFileSync(path.join(root, 'DESIGN.md'), 'utf8').includes('CDP:UNCONFIGURED');

  return stylesUnbound && noBoundJson && designStub;
}

function collectSnapshotPaths() {
  const paths = ['styles.css', 'DESIGN.md', ...GENERATED];
  for (const rel of listRootDcFiles()) paths.push(rel);
  return paths;
}

function main() {
  if (isAlreadyUnbound()) {
    process.stdout.write('No-op: harness already unbound.\n');
    process.exit(2);
  }

  const binding = loadBinding();
  const dcFiles = listRootDcFiles();

  if (dryRun) {
    process.stdout.write(
      [
        '[dry-run] Would reset harness to unbound state.',
        '  would remove: BOUND_DS.json, ds-helmet.snippet.html',
        '  would reset: styles.css, DESIGN.md',
        `  would remove intro/legacy DCs: ${dcFiles.length ? dcFiles.join(', ') : '(none)'}`,
        '  would keep: _ds/ (not touched)',
        '  next bootstrap materializes intro from scripts/templates/intro.dc.html',
      ].join('\n') + '\n',
    );
    process.exit(0);
  }

  const snapshot = new FileSnapshot();
  snapshot.capture(root, collectSnapshotPaths());

  try {
    snapshot.apply(root, () => {
      for (const file of GENERATED) {
        const abs = path.join(root, file);
        if (fs.existsSync(abs)) fs.rmSync(abs, { force: true });
      }

      fs.writeFileSync(path.join(root, 'styles.css'), UNBOUND_STYLES);
      restoreDesignTemplate();

      removeLegacyDcFiles(root);

      process.stdout.write(
        [
          'Harness reset to unbound agnostic state.',
          '  removed: BOUND_DS.json, ds-helmet.snippet.html',
          `  reset: styles.css, DESIGN.md, ${dcFiles.length} *.dc.html`,
          '  kept: _ds/ (host project data preserved)',
          '  next: node scripts/bootstrap-harness.mjs',
        ].join('\n') + '\n',
      );
    });
  } catch (err) {
    process.stderr.write(`Unbind failed (rolled back): ${err.message}\n`);
    process.exit(1);
  }
}

main();
