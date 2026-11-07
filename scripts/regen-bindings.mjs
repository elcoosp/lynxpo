#!/usr/bin/env node
/**
 * Regenerate every module's autolink bindings with the pinned
 * @lynx-js/autolink-codegen, then normalize the output layout:
 *   - cli writes TS bindings to <module>/generated/*.ts
 *     -> move to <module>/src/generated/ (checked-in location)
 *   - android/ios outputs already land at the checked-in paths
 * Idempotent; safe to re-run.
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const root = path.resolve(import.meta.dirname, '..');
const modulesDir = path.join(root, 'packages/modules');
const cli = path.join(
  root,
  'node_modules/@lynx-js/autolink-codegen/dist/cli.js',
);

if (!fs.existsSync(cli)) {
  console.error(`regen-bindings: missing ${path.relative(root, cli)}`);
  process.exit(1);
}

const modules = fs
  .readdirSync(modulesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) =>
    fs.existsSync(path.join(modulesDir, entry.name, 'lynx.lib.json')),
  )
  .map((entry) => entry.name)
  .sort();

const failures = [];

async function regen(name) {
  const dir = path.join(modulesDir, name);
  try {
    await execFileAsync(process.execPath, [cli, '--root', dir], {
      cwd: dir,
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (error) {
    failures.push(`${name}: codegen failed\n${error.stderr || error.message}`);
    return;
  }
  // Normalize TS binding location: <module>/generated -> <module>/src/generated
  const temp = path.join(dir, 'generated');
  if (fs.existsSync(temp)) {
    const target = path.join(dir, 'src/generated');
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(temp, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      fs.renameSync(path.join(temp, entry.name), path.join(target, entry.name));
    }
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

const concurrency = 2;
let index = 0;
const workers = Array.from(
  { length: Math.min(concurrency, modules.length) },
  async () => {
    while (index < modules.length) {
      const name = modules[index];
      index += 1;
      await regen(name);
    }
  },
);
await Promise.all(workers);

if (failures.length > 0) {
  console.error(`regen-bindings: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`regen-bindings: regenerated ${modules.length} module(s)`);
