#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { detectBoundDs } from './detect-bound-ds.mjs';

const root = process.cwd();

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

const claude = read('CLAUDE.md');
const design = read('DESIGN.md');
const bound = read('BOUND_DS.json');
const skillFiles = walk('skills').filter((file) => file.endsWith('.skill.md'));
const dcFiles = walk('.').filter((file) => file.endsWith('.dc.html'));
const dsDetection = detectBoundDs(root);

const signals = {
  protocol: {
    hasClaude: exists('CLAUDE.md'),
    hasCanary: claude.includes('CDP-CLAUDE-OK'),
    hasLiteralRoutingTable: /Literal routing table/i.test(claude),
    hasMandatoryReporting: claude.includes('SKILLS APPLIED') && claude.includes('NOT APPLIED'),
    referencesBoundDs: claude.includes('BOUND_DS.json'),
    isAgnostic: !/academia-ds-460d36aa/i.test(claude),
    skillCount: skillFiles.length,
  },
  binding: {
    hasBoundJson: exists('BOUND_DS.json'),
    boundJsonParses: (() => {
      try {
        JSON.parse(bound);
        return true;
      } catch {
        return false;
      }
    })(),
    hasHelmetSnippet: exists('ds-helmet.snippet.html'),
    dsDetected: dsDetection.ok,
    dsName: dsDetection.binding?.name ?? null,
    dsNamespace: dsDetection.binding?.namespace ?? null,
    dsComponentCount: dsDetection.binding?.componentCount ?? 0,
    dsError: dsDetection.ok ? null : dsDetection.error,
  },
  design: {
    hasDesignMd: exists('DESIGN.md'),
    referencesBoundDs: design.includes('BOUND_DS.json') || design.includes('{{BOUND_DS'),
    isAgnostic: !/Academia Lendária|Lendár\[IA\]/i.test(design),
    needsAutoSetup: design.includes('CDP:UNCONFIGURED') || /Describe the product's visual register/i.test(design),
  },
  harness: {
    needsAutoSetup:
      read('styles.css').includes('UNBOUND') ||
      !exists('BOUND_DS.json') ||
      design.includes('CDP:UNCONFIGURED') ||
      walk('.').some((f) => f.endsWith('.dc.html') && read(f).includes('{{DS_HELMET_BLOCK}}')),
  },
  canvas: {
    dcCount: dcFiles.length,
    hasStarter: exists('Starter.dc.html'),
    hasRootStyles: exists('styles.css'),
    stylesGenerated: read('styles.css').includes('bootstrap-harness.mjs'),
    stylesUnbound: read('styles.css').includes('UNBOUND'),
  },
  maintenance: {
    hasDetectBoundDs: exists('scripts/detect-bound-ds.mjs'),
    hasBootstrap: exists('scripts/bootstrap-harness.mjs'),
    hasUnbind: exists('scripts/unbind-harness.mjs'),
    hasCanvasAntipatterns: exists('scripts/detect-canvas-antipatterns.mjs'),
    hasTextAntipatterns: exists('scripts/detect-text-antipatterns.mjs'),
  },
  scriptPipeline: [
    'context-signals.mjs',
    'detect-bound-ds.mjs',
    'extract-ds-voice.mjs',
    'bootstrap-harness.mjs',
    'personalize-dc.mjs',
    'check_design_system (native)',
    'design-system-guardian.skill.md',
    'detect-canvas-antipatterns.mjs (+ audit skills)',
    'detect-text-antipatterns.mjs (+ text-integrity-audit)',
  ],
  docs: 'docs/script-pipeline.md',
  recommendedChecks: dsDetection.ok
    ? [
        'node scripts/bootstrap-harness.mjs --check',
        'node scripts/detect-canvas-antipatterns.mjs .',
        'node scripts/detect-text-antipatterns.mjs CLAUDE.md DESIGN.md skills',
      ]
    : [
        'node scripts/unbind-harness.mjs  # only if resetting',
        '# add ./_ds/<bundle>/ then: node scripts/bootstrap-harness.mjs',
        'node scripts/detect-canvas-antipatterns.mjs .',
      ],
};

process.stdout.write(`${JSON.stringify(signals, null, 2)}\n`);