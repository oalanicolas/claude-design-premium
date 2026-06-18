#!/usr/bin/env node
/**
 * test-builder-bootstrap.mjs
 *
 * CI fixture: verifies builder-mode bootstrap on a temp project with DS at root.
 * Uses fixtures/builder-ds/ (committed). Exit 0 on success, 1 on failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const harnessRoot = path.resolve(__dirname, '..');
const fixtureRoot = path.join(harnessRoot, 'fixtures/builder-ds');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, ent.name);
    const to = path.join(dest, ent.name);
    if (ent.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function main() {
  if (!fs.existsSync(fixtureRoot)) {
    console.error('FAIL: fixtures/builder-ds/ is missing.');
    process.exit(1);
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-builder-'));

  try {
    copyDir(path.join(harnessRoot, 'scripts'), path.join(tmp, 'scripts'));
    fs.copyFileSync(
      path.join(harnessRoot, 'scripts/templates/design-md.template.md'),
      path.join(tmp, 'DESIGN.md'),
    );
    fs.copyFileSync(path.join(harnessRoot, 'CLAUDE.md'), path.join(tmp, 'CLAUDE.md'));
    copyDir(fixtureRoot, tmp);

    const run = spawnSync('node', ['scripts/bootstrap-harness.mjs', '--mode', 'builder'], {
      cwd: tmp,
      encoding: 'utf8',
    });

    if (run.status !== 0) {
      console.error(run.stdout);
      console.error(run.stderr);
      throw new Error(`bootstrap exited ${run.status}`);
    }

    const bound = JSON.parse(fs.readFileSync(path.join(tmp, 'BOUND_DS.json'), 'utf8'));
    if (bound.hostMode !== 'builder') {
      throw new Error(`expected hostMode builder, got ${bound.hostMode}`);
    }
    if (bound.root !== '.') {
      throw new Error(`expected root ".", got ${bound.root}`);
    }
    if (!bound.introDc || !fs.existsSync(path.join(tmp, bound.introDc))) {
      throw new Error(`design-system DC missing: ${bound.introDc}`);
    }

    const design = fs.readFileSync(path.join(tmp, 'DESIGN.md'), 'utf8');
    if (design.includes('CDP:UNCONFIGURED')) {
      throw new Error('DESIGN.md still unconfigured after builder bootstrap');
    }

    const intro = fs.readFileSync(path.join(tmp, bound.introDc), 'utf8');
    if (intro.includes('{{BOUND_DS') || intro.includes('{{INTRO_')) {
      throw new Error(`${bound.introDc} still has placeholders`);
    }

    console.log('builder bootstrap: OK');
    console.log(`  hostMode: ${bound.hostMode}`);
    console.log(`  namespace: ${bound.namespace}`);
    console.log(`  components: ${bound.componentCount}`);
    console.log(`  intro: ${bound.introDc} (${bound.docLanguage})`);
  } catch (err) {
    console.error(`builder bootstrap: FAIL - ${err.message}`);
    process.exit(1);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

main();
