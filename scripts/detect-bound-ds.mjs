#!/usr/bin/env node
/**
 * detect-bound-ds.mjs (detect-host-ds)
 *
 * Discovers the active design system in two host modes:
 * - builder: DS project root (_ds_manifest.json + _ds_bundle.js at ./)
 * - consumer: exported bundle under ./_ds/<bundle>/
 */
import fs from 'node:fs';
import path from 'node:path';
import { safeRead, readJson } from './file-snapshot.mjs';

const DS_DIR = '_ds';
const MANIFEST = '_ds_manifest.json';
const BUNDLE = '_ds_bundle.js';

const DEFAULT_CHROME_SELECTORS = ['.es-nav', '.fx-rail', '.as-overlay'];

function exists(root, rel) {
  return fs.existsSync(path.join(root, rel));
}

function posix(rel) {
  return rel.replace(/\\/g, '/');
}

function listConsumerCandidates(root) {
  const abs = path.join(root, DS_DIR);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((ent) => ent.isDirectory())
    .map((ent) => path.join(DS_DIR, ent.name))
    .filter(
      (rel) =>
        exists(root, path.join(rel, MANIFEST)) && exists(root, path.join(rel, BUNDLE)),
    );
}

function hasBuilderRootFiles(root) {
  return exists(root, MANIFEST) && exists(root, BUNDLE);
}

function humanNameFromFolder(folderName) {
  const base = folderName.replace(
    /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    '',
  );
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

function nameFromReadme(readmeText) {
  const heading = readmeText.match(/^#\s+(.+)/m)?.[1]?.trim();
  if (!heading) return null;
  return heading.replace(/\s*[—–-]\s*v?\d.*$/i, '').trim();
}

function humanNameFromNamespace(namespace) {
  if (!namespace) return 'Design System';
  const base = namespace.replace(/_[0-9a-f]+$/i, '').replace(/DesignSystem$/i, '');
  return base
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim() || 'Design System';
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
    return new RegExp(
      `["'\`]${cls}["'\`]|className\\s*[:=]\\s*["'\`][^"'\`]*\\b${cls}\\b`,
    ).test(bundleText);
  });
  return found.length ? found : DEFAULT_CHROME_SELECTORS;
}

function findReadme(root, dsRoot) {
  for (const name of ['readme.md', 'README.md', 'Readme.md']) {
    const rel = dsRoot === '.' ? name : path.join(dsRoot, name);
    if (exists(root, rel)) return posix(rel);
  }
  return null;
}

function tokenDirFromPaths(globalCssPaths = []) {
  const first = globalCssPaths.find((p) => p.includes('/'));
  if (!first) return null;
  return path.posix.dirname(first);
}

function loadExistingBinding(root) {
  if (!exists(root, 'BOUND_DS.json')) return null;
  try {
    return readJson(root, 'BOUND_DS.json');
  } catch {
    return null;
  }
}

/**
 * @param {string[]} candidates
 * @param {{ bundleFlag?: string, existingBinding?: object }} [opts]
 */
export function resolveDsCandidate(candidates, opts = {}) {
  if (!candidates.length) {
    return { ok: false, error: 'no_candidates' };
  }

  if (candidates.length === 1) {
    return { ok: true, root: candidates[0], multiBundle: false, selectedBy: 'single' };
  }

  const { bundleFlag, existingBinding } = opts;

  if (bundleFlag) {
    const match = candidates.find(
      (c) => c === bundleFlag || c.endsWith(`/${bundleFlag}`) || c.includes(bundleFlag),
    );
    if (match) {
      return { ok: true, root: match, multiBundle: true, selectedBy: 'flag' };
    }
    return { ok: false, error: 'bundle_flag_not_found', candidates };
  }

  const cachedRoot = existingBinding?.root ?? existingBinding?.selectedBundle;
  if (cachedRoot && candidates.includes(cachedRoot)) {
    return { ok: true, root: cachedRoot, multiBundle: true, selectedBy: 'cache' };
  }

  const sorted = [...candidates].sort();
  return {
    ok: true,
    root: sorted[0],
    multiBundle: true,
    selectedBy: 'alphabetical',
    warning: `Multiple DS bundles under ${DS_DIR}/; defaulting to ${sorted[0]}. Pass --bundle <folder> or set BOUND_DS.json → root.`,
    alternates: sorted.slice(1),
  };
}

function buildBindingFromDsRoot(root, dsRoot, manifest, bundleText, extra = {}) {
  const folderName = dsRoot === '.' ? 'project-root' : path.basename(dsRoot);
  const manifestPath = dsRoot === '.' ? MANIFEST : path.join(dsRoot, MANIFEST);
  const bundlePath = dsRoot === '.' ? BUNDLE : path.join(dsRoot, BUNDLE);
  const readmePath = findReadme(root, dsRoot);
  const readmeText = readmePath ? safeRead(root, readmePath) : '';
  const globalCssPaths = manifest.globalCssPaths ?? [];
  const components = (manifest.components ?? []).map((c) => c.name);
  const componentMeta = (manifest.components ?? []).map((c) => ({
    name: c.name,
    sourcePath: c.sourcePath ?? null,
    group: c.sourcePath?.split('/')?.[1] ?? null,
  }));

  const name =
    nameFromReadme(readmeText) ||
    humanNameFromFolder(folderName === 'project-root' ? 'ds' : folderName) ||
    humanNameFromNamespace(manifest.namespace);

  return {
    version: 2,
    detectedAt: new Date().toISOString(),
    name,
    folder: folderName,
    root: posix(dsRoot),
    bundle: posix(bundlePath),
    manifest: posix(manifestPath),
    namespace: manifest.namespace,
    components,
    componentCount: components.length,
    globalCssPaths,
    tokenDir: tokenDirFromPaths(globalCssPaths),
    readme: readmePath,
    iconLibrary: detectIconLibrary(manifest, bundleText),
    chromeSelectors: detectChromeSelectors(bundleText),
    cardMeta: (manifest.cards ?? []).map((c) =>
      typeof c === 'string'
        ? { name: c }
        : {
            name: c.name ?? c.path ?? 'Specimen',
            path: c.path ?? null,
            group: c.group ?? null,
            subtitle: c.subtitle ?? null,
            viewport: c.viewport ?? null,
          },
    ),
    componentMeta,
    startingPoints: (manifest.startingPoints ?? []).map((s) => ({
      name: s.name ?? s.path ?? 'Starting point',
      path: s.path ?? null,
      previewPath: s.previewPath ?? null,
      kind: s.kind ?? null,
      section: s.section ?? null,
      subtitle: s.subtitle ?? null,
      viewport: s.viewport ?? null,
    })),
    tokenCount: (manifest.tokens ?? []).length,
    themes: manifest.themes ?? [],
    brandFonts: manifest.brandFonts ?? [],
    selectedBundle: posix(dsRoot),
    ...extra,
  };
}

function detectBuilderHost(root, existingBinding) {
  if (!hasBuilderRootFiles(root)) return null;

  let manifest;
  try {
    manifest = readJson(root, MANIFEST);
  } catch (err) {
    return { ok: false, error: err.message, hostMode: 'builder', candidates: [] };
  }
  const bundleText = safeRead(root, BUNDLE);

  if (!manifest?.namespace) {
    return {
      ok: false,
      error: `${MANIFEST} at project root is missing a namespace field.`,
      hostMode: 'builder',
      candidates: [],
    };
  }

  const binding = buildBindingFromDsRoot(root, '.', manifest, bundleText, {
    hostMode: 'builder',
    bindingSource: 'native-root',
    selectionMethod: existingBinding?.hostMode === 'builder' ? 'cache' : 'native-root',
  });

  return { ok: true, binding, hostMode: 'builder', candidates: ['.'], warning: null };
}

function detectConsumerHost(root, options = {}) {
  const candidates = listConsumerCandidates(root);

  if (!candidates.length) {
    return null;
  }

  const existingBinding = options.existingBinding ?? loadExistingBinding(root);
  const resolved = resolveDsCandidate(candidates, {
    bundleFlag: options.bundleFlag,
    existingBinding,
  });

  if (!resolved.ok) {
    if (resolved.error === 'bundle_flag_not_found') {
      return {
        ok: false,
        error: `Bundle "${options.bundleFlag}" not found under ${DS_DIR}/.`,
        hostMode: 'consumer',
        candidates,
      };
    }
    return {
      ok: false,
      error: `No consumer bundle found under ${DS_DIR}/.`,
      hostMode: 'consumer',
      candidates,
    };
  }

  if (
    resolved.multiBundle &&
    !options.allowMulti &&
    !options.bundleFlag &&
    !existingBinding?.root
  ) {
    return {
      ok: false,
      error: `Multiple design systems found under ${DS_DIR}/. Pass --bundle <folder> or --allow-multi.`,
      hostMode: 'consumer',
      candidates: [...candidates].sort(),
    };
  }

  const dsRoot = resolved.root;
  let manifest;
  try {
    manifest = readJson(root, path.join(dsRoot, MANIFEST));
  } catch (err) {
    return { ok: false, error: err.message, hostMode: 'consumer', candidates };
  }
  const bundleText = safeRead(root, path.join(dsRoot, BUNDLE));

  if (!manifest?.namespace) {
    return {
      ok: false,
      error: `${path.join(dsRoot, MANIFEST)} is missing a namespace field.`,
      hostMode: 'consumer',
      candidates,
    };
  }

  const binding = buildBindingFromDsRoot(root, dsRoot, manifest, bundleText, {
    hostMode: 'consumer',
    bindingSource: 'exported-bundle',
    selectionMethod: resolved.selectedBy,
  });

  if (resolved.warning) binding.multiBundleWarning = resolved.warning;
  if (resolved.alternates?.length) binding.alternateBundles = resolved.alternates;

  return { ok: true, binding, hostMode: 'consumer', candidates, warning: resolved.warning };
}

/**
 * @param {string} [cwd]
 * @param {{ bundleFlag?: string, allowMulti?: boolean, mode?: 'builder'|'consumer'|'auto' }} [options]
 */
export function detectHostDs(cwd = process.cwd(), options = {}) {
  const mode = options.mode ?? 'auto';
  const existingBinding = loadExistingBinding(cwd);

  if (mode === 'builder') {
    const builder = detectBuilderHost(cwd, existingBinding);
    if (builder) return builder;
    return {
      ok: false,
      error: `Builder mode requires ${MANIFEST} and ${BUNDLE} at project root.`,
      hostMode: 'builder',
      candidates: [],
    };
  }

  if (mode === 'consumer') {
    const consumer = detectConsumerHost(cwd, { ...options, existingBinding });
    if (consumer) return consumer;
    return {
      ok: false,
      error: `Consumer mode requires ./_ds/<bundle>/ with ${MANIFEST} and ${BUNDLE}.`,
      hostMode: 'consumer',
      candidates: [],
    };
  }

  // auto: respect cached hostMode, else builder root wins, else consumer
  if (existingBinding?.hostMode === 'consumer') {
    const consumer = detectConsumerHost(cwd, { ...options, existingBinding });
    if (consumer?.ok) return consumer;
  }

  if (existingBinding?.hostMode === 'builder' || hasBuilderRootFiles(cwd)) {
    const builder = detectBuilderHost(cwd, existingBinding);
    if (builder?.ok) return builder;
    if (builder && !builder.ok) return builder;
  }

  const consumer = detectConsumerHost(cwd, { ...options, existingBinding });
  if (consumer) return consumer;

  return {
    ok: false,
    error:
      'No design system detected. Builder: place _ds_manifest.json + _ds_bundle.js at project root. Consumer: place ./_ds/<bundle>/ with the same files.',
    hostMode: null,
    candidates: [],
  };
}


import { pathToFileURL } from 'node:url';

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  const args = process.argv.slice(2);
  const bundleIdx = args.indexOf('--bundle');
  const bundleFlag = bundleIdx >= 0 ? args[bundleIdx + 1] : undefined;
  const allowMulti = args.includes('--allow-multi');
  const modeIdx = args.indexOf('--mode');
  const modeArg = modeIdx >= 0 ? args[modeIdx + 1] : 'auto';

  const result = detectHostDs(process.cwd(), {
    bundleFlag,
    allowMulti,
    mode: modeArg === 'builder' || modeArg === 'consumer' ? modeArg : 'auto',
  });

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.ok ? 0 : 1);
}
