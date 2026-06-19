#!/usr/bin/env node
/**
 * ds-paths.test.mjs
 *
 * Unit tests for host-mode path resolution (builder root "." vs consumer
 * _ds/<bundle>). Dependency-free: node:test + node:assert only.
 * Run: node --test scripts/ds-paths.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { isBuilderBinding, assetHref, bundleHref, importPath } from './ds-paths.mjs';

test('isBuilderBinding is true for hostMode builder', () => {
  assert.equal(isBuilderBinding({ hostMode: 'builder' }), true);
});

test('isBuilderBinding is true for root "." and native-root source', () => {
  assert.equal(isBuilderBinding({ root: '.' }), true);
  assert.equal(isBuilderBinding({ bindingSource: 'native-root' }), true);
});

test('isBuilderBinding is false for a consumer binding', () => {
  assert.equal(
    isBuilderBinding({ hostMode: 'consumer', root: '_ds/acme', bindingSource: 'exported' }),
    false,
  );
});

test('assetHref returns the bare path for builder root', () => {
  assert.equal(assetHref({ root: '.' }, 'tokens/colors.css'), 'tokens/colors.css');
  assert.equal(assetHref({}, 'tokens/colors.css'), 'tokens/colors.css');
});

test('assetHref prefixes the consumer bundle root', () => {
  assert.equal(
    assetHref({ root: '_ds/acme' }, 'tokens/colors.css'),
    '_ds/acme/tokens/colors.css',
  );
});

test('assetHref normalizes Windows backslashes to POSIX', () => {
  assert.equal(
    assetHref({ root: '_ds/acme' }, 'tokens\\colors.css'),
    '_ds/acme/tokens/colors.css',
  );
});

test('bundleHref normalizes the project-relative bundle path', () => {
  assert.equal(bundleHref({ bundle: '_ds\\acme\\_ds_bundle.js' }), '_ds/acme/_ds_bundle.js');
  assert.equal(bundleHref({ bundle: '_ds_bundle.js' }), '_ds_bundle.js');
});

test('importPath matches assetHref for both host modes', () => {
  const builder = { root: '.' };
  const consumer = { root: '_ds/acme' };
  assert.equal(importPath(builder, 'a/b.css'), assetHref(builder, 'a/b.css'));
  assert.equal(importPath(consumer, 'a/b.css'), assetHref(consumer, 'a/b.css'));
});
