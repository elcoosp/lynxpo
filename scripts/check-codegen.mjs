#!/usr/bin/env node
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
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

const ignored = new Set([
  'node_modules',
  'dist',
  'build',
  'Pods',
  '.turbo',
  '.gradle',
  '.git',
  'coverage',
  '.DS_Store',
]);

function shouldCopy(source) {
  return !ignored.has(path.basename(source));
}

function findGeneratedDirs(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.name === 'generated') out.push(full);
    findGeneratedDirs(full, out);
  }
  return out;
}

function generatedDirs(pkg) {
  const dirs = [
    path.join(pkg, 'src/generated'),
    path.join(pkg, 'ios/src/generated'),
    ...findGeneratedDirs(path.join(pkg, 'android')),
  ];
  return [...new Set(dirs)].filter((dir) => fs.existsSync(dir));
}

function filesIn(dir) {
  const files = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else files.push(full);
    }
  };
  if (fs.existsSync(dir)) visit(dir);
  return files;
}

const modules = fs
  .readdirSync(modulesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) => fs.existsSync(path.join(modulesDir, entry.name, 'types')))
  .map((entry) => entry.name)
  .sort();

if (!fs.existsSync(cli)) {
  console.error(`check-codegen: missing ${path.relative(root, cli)}`);
  process.exit(1);
}

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lynxpo-codegen-'));
const failures = [];
const unsupported = [];

function sameContent(a, b, relative) {
  if (relative.endsWith('.ts')) {
    // Checked-in specs are formatted by Biome; compare ignoring whitespace,
    // the trailing commas Biome adds to wrapped declarations, and the quote
    // style Biome rewrites on generated string literals (double -> single).
    const normalize = (value) =>
      value
        .replace(/\s+/g, '')
        .replace(/["']/g, '')
        .replace(/,([)\]])/g, '$1');
    return (
      normalize(fs.readFileSync(a, 'utf8')) ===
      normalize(fs.readFileSync(b, 'utf8'))
    );
  }
  return fs.readFileSync(a).equals(fs.readFileSync(b));
}

async function checkModule(name) {
  const source = path.join(modulesDir, name);
  const target = path.join(tmpRoot, name);
  fs.cpSync(source, target, { recursive: true, filter: shouldCopy });

  const dirsInSource = generatedDirs(source);
  const dirsInTarget = generatedDirs(target);
  for (const dir of dirsInTarget) fs.rmSync(dir, { recursive: true });
  fs.rmSync(path.join(target, 'generated'), { recursive: true, force: true });

  try {
    await execFileAsync(process.execPath, [cli, '--root', target], {
      cwd: target,
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (error) {
    const message = error.stderr || error.message || '';
    if (message.includes('Unsupported type')) {
      unsupported.push(name);
      return;
    }
    failures.push(`${name}: codegen failed\n${message}`);
    return;
  }

  const expected = new Map();
  for (const dir of dirsInSource) {
    for (const file of filesIn(dir)) {
      expected.set(path.relative(source, file), file);
    }
  }

  const produced = new Map();
  for (const dir of generatedDirs(target)) {
    for (const file of filesIn(dir)) {
      produced.set(path.relative(target, file), file);
    }
  }
  for (const file of filesIn(path.join(target, 'generated'))) {
    produced.set(path.join('src/generated', path.basename(file)), file);
  }

  for (const [relative, generatedFile] of produced) {
    const checkedIn = path.join(source, relative);
    if (!fs.existsSync(checkedIn)) {
      failures.push(`${name}: missing ${relative}`);
      continue;
    }
    if (!sameContent(generatedFile, checkedIn, relative)) {
      failures.push(`${name}: drifted ${relative}`);
    }
  }

  for (const [relative] of expected) {
    if (!produced.has(relative)) {
      failures.push(`${name}: stale ${relative}`);
    }
  }
}

async function run() {
  const concurrency = 4;
  let index = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, modules.length) },
    async () => {
      while (index < modules.length) {
        const name = modules[index];
        index += 1;
        await checkModule(name);
      }
    },
  );
  await Promise.all(workers);
}

await run();
fs.rmSync(tmpRoot, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(
    `check-codegen: ${failures.length} issue(s) across ${modules.length} module(s)`,
  );
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

const checked = modules.length - unsupported.length;
console.log(`check-codegen: ${checked} module(s) up to date`);
if (unsupported.length > 0) {
  console.warn(
    `check-codegen: skipped ${unsupported.length} module(s) with input types ` +
      `the pinned generator cannot express (migrate them to @lynx-js/autolink-codegen 0.6):`,
  );
  console.warn(`  ${unsupported.sort().join(', ')}`);
}
