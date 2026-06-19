#!/usr/bin/env node
/**
 * file-snapshot.test.mjs
 *
 * Unit tests for the shared I/O kernel (safeRead, readJson, isPathInsideRoot,
 * FileSnapshot). Dependency-free: node:test + node:assert only, matching the
 * harness "node built-ins, no npm" constraint. Run: node --test scripts/
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { FileSnapshot, safeRead, readJson, isPathInsideRoot } from './file-snapshot.mjs';

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-kernel-'));
}

test('safeRead returns file contents when present', () => {
  const root = tmpRoot();
  fs.writeFileSync(path.join(root, 'a.txt'), 'hello');
  assert.equal(safeRead(root, 'a.txt'), 'hello');
});

test('safeRead returns empty string when file is missing', () => {
  const root = tmpRoot();
  assert.equal(safeRead(root, 'nope.txt'), '');
});

test('readJson parses valid JSON relative to root', () => {
  const root = tmpRoot();
  fs.writeFileSync(path.join(root, 'd.json'), JSON.stringify({ n: 1, s: 'x' }));
  assert.deepEqual(readJson(root, 'd.json'), { n: 1, s: 'x' });
});

test('readJson throws with file context on missing file', () => {
  const root = tmpRoot();
  assert.throws(() => readJson(root, 'missing.json'), /Failed to parse missing\.json/);
});

test('readJson throws with file context on malformed JSON', () => {
  const root = tmpRoot();
  fs.writeFileSync(path.join(root, 'bad.json'), '{ not json');
  assert.throws(() => readJson(root, 'bad.json'), /Failed to parse bad\.json/);
});

test('isPathInsideRoot accepts the root itself and nested paths', () => {
  const root = tmpRoot();
  assert.equal(isPathInsideRoot(root, '.'), true);
  assert.equal(isPathInsideRoot(root, 'sub/file.txt'), true);
});

test('isPathInsideRoot rejects parent-escaping and absolute-outside paths', () => {
  const root = tmpRoot();
  assert.equal(isPathInsideRoot(root, '../escape'), false);
  assert.equal(isPathInsideRoot(root, '/etc/passwd'), false);
});

test('FileSnapshot.restore reverts a mutated file to its captured content', () => {
  const root = tmpRoot();
  fs.writeFileSync(path.join(root, 'f.txt'), 'original');
  const snap = new FileSnapshot();
  snap.capture(root, ['f.txt']);
  fs.writeFileSync(path.join(root, 'f.txt'), 'mutated');
  snap.restore(root);
  assert.equal(fs.readFileSync(path.join(root, 'f.txt'), 'utf8'), 'original');
});

test('FileSnapshot.restore removes files that did not exist at capture', () => {
  const root = tmpRoot();
  const snap = new FileSnapshot();
  snap.capture(root, ['new.txt']);
  fs.writeFileSync(path.join(root, 'new.txt'), 'created');
  snap.restore(root);
  assert.equal(fs.existsSync(path.join(root, 'new.txt')), false);
});

test('FileSnapshot.apply rolls back all changes when fn throws', () => {
  const root = tmpRoot();
  fs.writeFileSync(path.join(root, 'g.txt'), 'before');
  const snap = new FileSnapshot();
  snap.capture(root, ['g.txt']);
  assert.throws(() =>
    snap.apply(root, () => {
      fs.writeFileSync(path.join(root, 'g.txt'), 'after');
      throw new Error('boom');
    }),
  );
  assert.equal(fs.readFileSync(path.join(root, 'g.txt'), 'utf8'), 'before');
});

test('FileSnapshot.capture is idempotent and size tracks unique paths', () => {
  const root = tmpRoot();
  fs.writeFileSync(path.join(root, 'h.txt'), 'v1');
  const snap = new FileSnapshot();
  snap.capture(root, ['h.txt']);
  // Re-capturing after a write must NOT overwrite the original snapshot.
  fs.writeFileSync(path.join(root, 'h.txt'), 'v2');
  snap.capture(root, ['h.txt']);
  assert.equal(snap.size, 1);
  snap.restore(root);
  assert.equal(fs.readFileSync(path.join(root, 'h.txt'), 'utf8'), 'v1');
});
