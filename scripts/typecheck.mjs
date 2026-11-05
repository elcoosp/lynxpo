#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const tsc = path.join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'tsc.cmd' : 'tsc',
);

const projectFiles = [];

const playground = path.join(root, 'packages/playground/tsconfig.json');
if (fs.existsSync(playground)) projectFiles.push(playground);

const modulesDir = path.join(root, 'packages/modules');
for (const entry of fs.readdirSync(modulesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  for (const file of ['tsconfig.json', 'tsconfig.test.json']) {
    const tsconfig = path.join(modulesDir, entry.name, file);
    if (fs.existsSync(tsconfig)) projectFiles.push(tsconfig);
  }
}

projectFiles.sort();

if (projectFiles.length === 0) {
  console.error('typecheck: no tsconfig.json files found');
  process.exit(1);
}

let failed = 0;
for (const project of projectFiles) {
  const relative = path.relative(root, project);
  const result = spawnSync(tsc, ['-p', relative, '--pretty', 'false'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    console.error(`typecheck: FAILED ${relative}`);
    failed += 1;
  }
}

if (failed > 0) {
  console.error(
    `typecheck: ${failed}/${projectFiles.length} project(s) failed`,
  );
  process.exit(1);
}

console.log(`typecheck: ${projectFiles.length} project(s) passed`);
