#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const derived = path.join(
  root,
  'packages/playground/src/host/build/Build/Products/Debug-iphonesimulator',
);
const app = path.join(derived, 'LynxpoHost.app');
const executable = path.join(app, 'LynxpoHost');
const infoPlist = path.join(app, 'Info.plist');
const embeddedBundle = path.join(app, 'host.lynx.bundle');
const sourceBundle = path.join(
  root,
  'packages/playground/dist/hostshowcase.lynx.bundle',
);

const failures = [];

if (!fs.existsSync(app)) failures.push(`missing app bundle: ${app}`);
if (!fs.existsSync(executable)) failures.push('missing app executable');
if (!fs.existsSync(infoPlist)) failures.push('missing Info.plist');
if (!fs.existsSync(embeddedBundle)) failures.push('missing host.lynx.bundle');

if (
  fs.existsSync(embeddedBundle) &&
  fs.existsSync(sourceBundle) &&
  !fs.readFileSync(embeddedBundle).equals(fs.readFileSync(sourceBundle))
) {
  failures.push(
    'embedded host.lynx.bundle does not match packages/playground/dist/hostshowcase.lynx.bundle',
  );
}

if (failures.length > 0) {
  console.error(`verify-ios-build: ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

const size = fs.statSync(embeddedBundle).size;
console.log(
  `verify-ios-build: LynxpoHost.app OK (host.lynx.bundle ${size} bytes)`,
);
