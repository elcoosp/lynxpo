#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const denied = [
  /^AGPL/i,
  /^GPL/i,
  /^SSPL/i,
  /^EUPL/i,
  /^OSL/i,
  /^CPAL/i,
  /^Commons-Clause/i,
];

let raw;
try {
  raw = execFileSync(pnpm, ['-r', 'licenses', 'list', '--prod', '--json'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
} catch (error) {
  console.error(
    `check-licenses: failed to list licenses\n${error.stdout || error.message}`,
  );
  process.exit(1);
}

const licenses = JSON.parse(raw);
const violations = [];

for (const [license, packages] of Object.entries(licenses)) {
  if (!denied.some((pattern) => pattern.test(license))) continue;
  for (const pkg of packages) {
    violations.push(
      `${pkg.name}@${pkg.versions.join(',')} uses disallowed license ${license}`,
    );
  }
}

const unknown = licenses.Unknown ?? [];

if (violations.length > 0) {
  console.error(`check-licenses: ${violations.length} violation(s)`);
  for (const violation of violations) console.error(`  - ${violation}`);
  process.exit(1);
}

const counts = Object.entries(licenses)
  .map(([license, packages]) => `${license}: ${packages.length}`)
  .sort();
console.log(`check-licenses: ${counts.join(', ')}`);
if (unknown.length > 0) {
  console.warn(
    `check-licenses: warning - ${unknown.length} package(s) missing license metadata: ${unknown
      .map((pkg) => pkg.name)
      .join(', ')}`,
  );
}
