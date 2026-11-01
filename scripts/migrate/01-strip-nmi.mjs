#!/usr/bin/env node
/** Strip the nmi postinstall hook and devDependency from every module. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const modulesDir = join(process.cwd(), 'packages/modules');
let touched = 0;

for (const name of readdirSync(modulesDir)) {
  const pkgPath = join(modulesDir, name, 'package.json');
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

  delete pkg.scripts?.postinstall;
  if (pkg.devDependencies) delete pkg.devDependencies['@lynxpo/tools-nmi'];

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  touched++;
}
console.log(`stripped nmi hooks from ${touched} packages`);
