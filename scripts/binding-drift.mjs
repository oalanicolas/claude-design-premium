#!/usr/bin/env node
/**
 * binding-drift.mjs
 *
 * Compares cached BOUND_DS.json against a freshly detected binding.
 */
import fs from 'node:fs';
import path from 'node:path';
import { readJson } from './file-snapshot.mjs';

const MIN_BINDING_VERSION = 2;

export function loadCachedBinding(root = process.cwd()) {
  const abs = path.join(root, 'BOUND_DS.json');
  if (!fs.existsSync(abs)) return null;
  try {
    return readJson(root, 'BOUND_DS.json');
  } catch {
    return null;
  }
}

export function bindingSchemaStale(cached) {
  if (!cached) return false;
  return (
    !cached.hostMode ||
    !cached.bindingSource ||
    (cached.version ?? 1) < MIN_BINDING_VERSION
  );
}

function sortedKey(values) {
  return [...(values ?? [])].map(String).sort().join('\0');
}

export function bindingDrifted(cached, detected) {
  if (!detected) return false;
  if (!cached) return true;
  if (bindingSchemaStale(cached)) return true;

  const scalarFields = [
    'namespace',
    'root',
    'hostMode',
    'bindingSource',
    'bundle',
    'manifest',
  ];

  for (const key of scalarFields) {
    if ((cached[key] ?? null) !== (detected[key] ?? null)) return true;
  }

  if (sortedKey(cached.globalCssPaths) !== sortedKey(detected.globalCssPaths)) {
    return true;
  }

  if (sortedKey(cached.components) !== sortedKey(detected.components)) {
    return true;
  }

  return false;
}
