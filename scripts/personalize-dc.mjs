#!/usr/bin/env node
/**
 * personalize-dc.mjs
 *
 * Bootstrap seam after intro DC materialization. Scaffold copy and structure are fully
 * written by intro-dc.mjs (INTRO_* placeholders + prompt script). This hook stays so
 * bootstrap-harness.mjs can add post-materialize steps without reshaping the pipeline.
 */
import fs from 'node:fs';
import path from 'node:path';
import { introDcFilename } from './intro-dc.mjs';

export function personalizeIntroDc(binding, voice, cwd = process.cwd()) {
  const rel = binding.introDc || introDcFilename(voice.language);
  const exists = fs.existsSync(path.join(cwd, rel));
  return { personalized: 0, targets: exists ? 1 : 0, filename: rel };
}
