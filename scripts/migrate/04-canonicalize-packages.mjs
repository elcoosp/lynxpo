#!/usr/bin/env node
/**
 * Normalize every @lynxpo/mods-* package for npm publishing:
 *  - strip nmi/ktts workspace devDeps + hooks (idempotent)
 *  - peer-out @lynx-js/react, dev-only @lynx-js/types
 *  - ship lynx.lib.json + native twins in files (official autolink layout)
 *  - add license/repository/keywords/sideEffects, bump 0.0.0 -> 0.1.0
 */
import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const REPO_URL = 'git+https://github.com/elcoosp/lynxpo.git';
const modulesDir = join(process.cwd(), 'packages/modules');
const rootLicense = join(process.cwd(), 'LICENSE');
const report = [];

for (const name of readdirSync(modulesDir)) {
  const dir = join(modulesDir, name);
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.name?.startsWith('@lynxpo/mods-')) continue;

  // --- idempotent relic strip (safe even if 01/02 were skipped)
  delete pkg.scripts?.postinstall;
  if (pkg.devDependencies) {
    delete pkg.devDependencies['@lynxpo/tools-nmi'];
    delete pkg.devDependencies['@lynxpo/plugins-ktts'];
  }

  // --- runtime deps -> peer + dev (all 66 have exactly the two lynx deps)
  const hadReact = Boolean(pkg.dependencies?.['@lynx-js/react']);
  delete pkg.dependencies;
  pkg.peerDependencies = hadReact
    ? { '@lynx-js/react': '>=0.126.0 <1' }
    : undefined;
  if (!pkg.peerDependencies) delete pkg.peerDependencies;
  pkg.devDependencies = {
    ...(pkg.devDependencies ?? {}),
    ...(hadReact ? { '@lynx-js/react': '^0.126.0' } : {}),
    '@lynx-js/types': '^4.0.0',
  };

  // --- files: official autolink layout (manifest + twins + types + dist)
  const files = new Set(['dist', 'lynx.lib.json', 'types']);
  for (const twin of ['android', 'ios']) {
    if (existsSync(join(dir, twin))) files.add(twin);
  }
  pkg.files = [...files].sort();

  // --- metadata
  if (pkg.version === '0.0.0') pkg.version = '0.1.0';
  pkg.license = 'Apache-2.0';
  pkg.sideEffects = false;
  pkg.repository = {
    type: 'git',
    url: REPO_URL,
    directory: `packages/modules/${name}`,
  };
  pkg.bugs = { url: 'https://github.com/elcoosp/lynxpo/issues' };
  pkg.homepage = `https://github.com/elcoosp/lynxpo/tree/main/packages/modules/${name}#readme`;
  pkg.keywords = [
    ...new Set(['lynx', 'lynxjs', 'react-lynx', 'autolink', 'expo', name]),
  ].sort();
  pkg.exports = {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.js',
      require: './dist/cjs/index.cjs',
    },
  };

  // LICENSE must sit inside the package dir to land in the tarball
  if (existsSync(rootLicense)) copyFileSync(rootLicense, join(dir, 'LICENSE'));

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  report.push(`${pkg.name}@${pkg.version}  files=[${pkg.files.join(',')}]`);
}
console.log(report.join('\n'));
