#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { detectHostDs } from './detect-bound-ds.mjs';
import {
  bindingDrifted,
  bindingSchemaStale,
  loadCachedBinding,
} from './binding-drift.mjs';
import { listKnownIntroFiles } from './intro-dc.mjs';
import { showcaseNeedsAssembly } from './showcase-brief.mjs';
import { safeRead } from './file-snapshot.mjs';

const root = process.cwd();

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

const read = (rel) => safeRead(root, rel);

const SKIP_DIRS = new Set(['node_modules', '.git', '_archive', 'scripts/templates']);

function walk(dir, files = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return files;
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const rel = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (rel === 'scripts/templates' || rel.startsWith('scripts/templates/')) continue;
      walk(rel, files);
    } else files.push(rel);
  }
  return files;
}

function listRootDcFiles() {
  return walk('.').filter(
    (f) => f.endsWith('.dc.html') && !f.startsWith('scripts/'),
  );
}

const claude = read('CLAUDE.md');
const design = read('DESIGN.md');
const bound = read('BOUND_DS.json');
const skillFiles = walk('skills').filter((file) => file.endsWith('.skill.md'));
const dcFiles = listRootDcFiles();
const dsDetection = detectHostDs(root);
const cachedBinding = loadCachedBinding(root);
const detectedBinding = dsDetection.binding ?? null;
const schemaStale = bindingSchemaStale(cachedBinding);
const bindingOutOfSync = bindingDrifted(cachedBinding, detectedBinding);

const signals = {
  protocol: {
    hasClaude: exists('CLAUDE.md'),
    hasCanary: claude.includes('CDP-CLAUDE-OK'),
    hasLiteralRoutingTable: /Literal routing table/i.test(claude),
    hasMandatoryReporting: claude.includes('SKILLS APPLIED') && claude.includes('NOT APPLIED'),
    referencesBoundDs: claude.includes('BOUND_DS.json'),
    // Generic: a bound CLAUDE.md hardcodes a concrete _ds/<bundle-id> path.
    // The agnostic template references _ds/<bundle>/ as a placeholder only.
    isAgnostic: !/_ds\/[a-z0-9][a-z0-9-]*\//i.test(claude),
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
    hostMode: dsDetection.hostMode ?? dsDetection.binding?.hostMode ?? null,
    dsName: dsDetection.binding?.name ?? null,
    dsNamespace: dsDetection.binding?.namespace ?? null,
    dsComponentCount: dsDetection.binding?.componentCount ?? 0,
    dsError: dsDetection.ok ? null : dsDetection.error,
    builderReady: exists('_ds_manifest.json') && exists('_ds_bundle.js'),
    consumerReady: dsDetection.candidates?.some((c) => c.startsWith('_ds/')) ?? false,
  },
  design: {
    hasDesignMd: exists('DESIGN.md'),
    referencesBoundDs: design.includes('BOUND_DS.json') || design.includes('{{BOUND_DS'),
    // Generic: agnostic = still the unconfigured template (no concrete DS bound),
    // or a bound _ds/<bundle-id> path is present. No business names hardcoded.
    isAgnostic:
      design.includes('CDP:UNCONFIGURED') ||
      /Describe the product's visual register/i.test(design) ||
      !/_ds\/[a-z0-9][a-z0-9-]*\//i.test(design),
    needsAutoSetup: design.includes('CDP:UNCONFIGURED') || /Describe the product's visual register/i.test(design),
  },
  harness: {
    needsAutoSetup:
      read('styles.css').includes('UNBOUND') ||
      !exists('BOUND_DS.json') ||
      schemaStale ||
      bindingOutOfSync ||
      design.includes('CDP:UNCONFIGURED') ||
      listRootDcFiles().some((f) => {
        const t = read(f);
        return t.includes('{{DS_HELMET_BLOCK}}') || t.includes('{{INTRO_');
      }) ||
      (cachedBinding?.introDc && !exists(cachedBinding.introDc)),
    bindingSchemaStale: schemaStale,
    bindingOutOfSync,
  },
  canvas: {
    dcCount: dcFiles.length,
    introDc: cachedBinding?.introDc ?? null,
    hasIntroDc: listKnownIntroFiles().some((f) => exists(f)),
    needsShowcaseAssembly: showcaseNeedsAssembly(root, cachedBinding),
    hasShowcaseBrief: exists('.cdp/showcase-brief.json'),
    hasRootStyles: exists('styles.css'),
    stylesGenerated: read('styles.css').includes('bootstrap-harness.mjs'),
    stylesUnbound: read('styles.css').includes('UNBOUND'),
  },
  maintenance: {
    hasDetectHostDs: exists('scripts/detect-bound-ds.mjs'),
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
        '# builder: root manifest+bundle OR consumer: ./_ds/<bundle>/ then bootstrap',
        'node scripts/detect-canvas-antipatterns.mjs .',
      ],
};

process.stdout.write(`${JSON.stringify(signals, null, 2)}\n`);