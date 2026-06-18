#!/usr/bin/env node
/**
 * detect-bound-ds.mjs
 *
 * Discovers the bound design system under ./_ds/ and returns a machine-readable
 * binding object. Works with any Claude Design export that ships _ds_manifest.json
 * and _ds_bundle.js (Academia, Forja, future DS bundles).
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const DS_DIR = '_ds';

const DEFAULT_CHROME_SELECTORS = [
  '.es-nav',
  '.fx-rail',
  '.as-overlay',
];

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

function readJson(rel) {
  try {
    return JSON.parse(read(rel));
  } catch {
    return null;
  }
}

function listDsCandidates() {
  const abs = path.join(root, DS_DIR);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((ent) => ent.isDirectory())
    .map((ent) => path.join(DS_DIR, ent.name))
    .filter((rel) => exists(path.join(rel, '_ds_manifest.json')) && exists(path.join(rel, '_ds_bundle.js')));
}

function humanNameFromFolder(folderName) {
  const base = folderName.replace(/-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, '');
  return base
    .split('-')
    .filter(Boolean)
    .map((part, i, arr) => {
      const lower = part.toLowerCase();
      if (lower === 'ds' && i === arr.length - 1) return 'DS';
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function detectIconLibrary(manifest, bundleText) {
  const usesIconoir =
    /iconoir/i.test(bundleText) ||
    manifest.components?.some((c) => c.name === 'Icon');

  if (usesIconoir) {
    return {
      type: 'iconoir',
      cdn: 'https://cdn.jsdelivr.net/npm/iconoir@7.11.0/css/iconoir.css',
      classPrefix: 'iconoir-',
    };
  }

  return { type: 'none', cdn: null, classPrefix: null };
}

function detectChromeSelectors(bundleText) {
  const found = DEFAULT_CHROME_SELECTORS.filter((sel) => {
    const cls = sel.replace(/^\./, '');
    return new RegExp(`["'\`]${cls}["'\`]|className\\s*[:=]\\s*["'\`][^"'\`]*\\b${cls}\\b`).test(bundleText);
  });
  return found.length ? found : DEFAULT_CHROME_SELECTORS;
}

function findReadme(dsRoot) {
  for (const name of ['readme.md', 'README.md', 'Readme.md']) {
    const rel = path.join(dsRoot, name);
    if (exists(rel)) return rel;
  }
  return null;
}

function tokenDirFromPaths(globalCssPaths = []) {
  const first = globalCssPaths.find((p) => p.includes('/'));
  if (!first) return null;
  return path.posix.dirname(first);
}

export function detectBoundDs(cwd = root) {
  const prev = process.cwd();
  process.chdir(cwd);
  try {
    const candidates = listDsCandidates();
    if (!candidates.length) {
      return {
        ok: false,
        error: `No bound design system found under ${DS_DIR}/. Expected one folder with _ds_manifest.json and _ds_bundle.js.`,
        candidates: [],
      };
    }

    if (candidates.length > 1) {
      return {
        ok: false,
        error: `Multiple design systems found under ${DS_DIR}/. Keep exactly one bound DS folder.`,
        candidates,
      };
    }

    const dsRoot = candidates[0];
    const folderName = path.basename(dsRoot);
    const manifestPath = path.join(dsRoot, '_ds_manifest.json');
    const bundlePath = path.join(dsRoot, '_ds_bundle.js');
    const manifest = readJson(manifestPath);
    const bundleText = read(bundlePath);

    if (!manifest?.namespace) {
      return {
        ok: false,
        error: `${manifestPath} is missing a namespace field.`,
        candidates,
      };
    }

    const globalCssPaths = manifest.globalCssPaths ?? [];
    const components = (manifest.components ?? []).map((c) => c.name);
    const readmePath = findReadme(dsRoot);
    const iconLibrary = detectIconLibrary(manifest, bundleText);
    const chromeSelectors = detectChromeSelectors(bundleText);

    const binding = {
      version: 1,
      detectedAt: new Date().toISOString(),
      name: humanNameFromFolder(folderName),
      folder: folderName,
      root: dsRoot.replace(/\\/g, '/'),
      bundle: bundlePath.replace(/\\/g, '/'),
      manifest: manifestPath.replace(/\\/g, '/'),
      namespace: manifest.namespace,
      components,
      componentCount: components.length,
      globalCssPaths,
      tokenDir: tokenDirFromPaths(globalCssPaths),
      readme: readmePath ? readmePath.replace(/\\/g, '/') : null,
      iconLibrary,
      chromeSelectors,
      cards: (manifest.cards ?? []).map((c) => c.name),
      templates: (manifest.templates ?? []).map((t) => t.name),
    };

    return { ok: true, binding, candidates };
  } finally {
    process.chdir(prev);
  }
}

import { pathToFileURL } from 'node:url';

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const result = detectBoundDs();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.ok ? 0 : 1);
}