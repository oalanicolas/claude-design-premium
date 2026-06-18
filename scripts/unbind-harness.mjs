#!/usr/bin/env node
/**
 * unbind-harness.mjs
 *
 * Resets the harness to 100% agnostic template state:
 * - Removes ./_ds/, BOUND_DS.json, ds-helmet.snippet.html
 * - Restores placeholders in *.dc.html
 * - Resets styles.css to unbound stub
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const GENERATED = ['BOUND_DS.json', 'ds-helmet.snippet.html'];

const BOUND_PATTERNS = [
  [/_ds\/[a-z0-9-]+(?:-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?/gi, '{{BOUND_DS_ROOT}}'],
  [/\bLendRIADesignSystem_[A-Za-z0-9]+\b/g, '{{BOUND_DS_NAMESPACE}}'],
  [/\bForjaLendRIADesignSystem[A-Za-z0-9_]+\b/g, '{{BOUND_DS_NAMESPACE}}'],
  [/\bAcademia DS\b/g, '{{BOUND_DS_NAME}}'],
  [/\bAcademia Ds\b/g, '{{BOUND_DS_NAME}}'],
  [/\bForja DS\b/g, '{{BOUND_DS_NAME}}'],
];

const UNBOUND_STYLES = `/* =============================================================================
   styles.css — root canvas token entry (UNBOUND)

   This harness ships without a design system. After placing exactly one ./_ds/
   bundle in this folder, run:

     node scripts/bootstrap-harness.mjs

   Until then, Claude reads _ds/*/_ds_manifest.json → globalCssPaths at runtime.
   Do NOT add token values here — edit them in the bound DS.
   ============================================================================= */
`;

const HELMET_PLACEHOLDER = '  {{DS_HELMET_BLOCK}}\n';

function rmrf(rel) {
  const abs = path.join(root, rel);
  if (fs.existsSync(abs)) fs.rmSync(abs, { recursive: true, force: true });
}

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

function resetHelmet(content) {
  return content.replace(/<helmet>[\s\S]*?<\/helmet>/, `<helmet>\n${HELMET_PLACEHOLDER}</helmet>`);
}

function applyUnbindPatterns(text) {
  let out = text;
  for (const [re, rep] of BOUND_PATTERNS) {
    out = out.replace(re, rep);
  }
  out = out.replace(/value="21"/g, 'value="{{BOUND_DS_COMPONENT_COUNT}}"');
  out = out.replace(/Academia DSOS/g, '{{BOUND_DS_NAME}}');
  out = out.replace(/do Academia DS/g, 'do {{BOUND_DS_NAME}}');
  out = out.replace(/Forçar o uso do Academia DS/g, 'Forçar o uso do {{BOUND_DS_NAME}}');
  out = out.replace(/Use o Academia DS/g, 'Use o {{BOUND_DS_NAME}}');
  out = out.replace(/Entrar na Academia/g, 'Começar agora');
  return out;
}

function main() {
  rmrf('_ds');
  for (const file of GENERATED) rmrf(file);

  fs.writeFileSync(path.join(root, 'styles.css'), UNBOUND_STYLES);

  const dcFiles = walk('.').filter((f) => f.endsWith('.dc.html'));
  for (const rel of dcFiles) {
    const abs = path.join(root, rel);
    let content = fs.readFileSync(abs, 'utf8');
    content = resetHelmet(content);
    content = applyUnbindPatterns(content);
    fs.writeFileSync(abs, content);
  }

  process.stdout.write(
    [
      'Harness reset to unbound agnostic state.',
      '  removed: _ds/, BOUND_DS.json, ds-helmet.snippet.html',
      `  reset: styles.css, ${dcFiles.length} *.dc.html`,
      '  next: copy ./_ds/ into this folder, then run node scripts/bootstrap-harness.mjs',
    ].join('\n') + '\n',
  );
}

main();