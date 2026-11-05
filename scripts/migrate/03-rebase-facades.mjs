#!/usr/bin/env node
/**
 * Rebase ktts-shaped facades (9 modules) onto the official
 * @lynx-js/autolink-codegen output in src/generated/.
 * Before: import type {NativeModules as INativeModules} …;
 *         export interface X extends INativeModules {…};  NativeModules.X?.m?.()
 * After:  import { X } from './generated/X';              X?.m?.()
 * The interface block is removed — it would duplicate-identifier-collide with
 * the imported binding, and the binding already declares the full shape.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const modulesDir = join(process.cwd(), 'packages/modules');
const rebased = [];

for (const name of readdirSync(modulesDir)) {
  const indexPath = join(modulesDir, name, 'src/index.ts');
  if (!existsSync(indexPath)) continue;
  let src = readFileSync(indexPath, 'utf8');
  if (!/extends INativeModules/.test(src) || src.includes("from './generated/"))
    continue;

  // Module binding name as declared by the generated file (e.g. Appearance).
  const genDir = join(modulesDir, name, 'src/generated');
  const genFile = readdirSync(genDir).find((f) => f.endsWith('.ts'));
  if (!genFile) throw new Error(`${name}: no generated binding to rebase onto`);
  const binding = genFile.replace(/\.ts$/, '');
  const exportLine = readFileSync(join(genDir, genFile), 'utf8').match(
    /export const (\w+):/,
  )?.[1];
  if (exportLine !== binding)
    throw new Error(`${name}: unexpected export ${exportLine}`);

  // 1. drop the INativeModules type import and the interface block
  src = src.replace(
    /^import type \{ NativeModules as INativeModules \} from '@lynx-js\/types';\n/m,
    '',
  );
  src = src.replace(
    new RegExp(
      `export interface ${binding} extends INativeModules \\{[\\s\\S]*?\\n\\}\\n`,
    ),
    '',
  );
  // 2. import right after the last remaining import
  const imports = [...src.matchAll(/^import .*$/gm)];
  const lastImport = imports.at(-1)?.[0];
  src = src.replace(
    lastImport,
    `${lastImport}\nimport { ${binding} } from './generated/${binding}';`,
  );
  // 3. accessor swap
  src = src.replaceAll(`NativeModules.${binding}?.`, `${binding}?.`);
  if (src.includes('INativeModules'))
    throw new Error(`${name}: stale INativeModules reference`);

  writeFileSync(indexPath, src);
  rebased.push(name);
}
console.log(`rebased facades: ${rebased.join(', ') || '(none)'}`);
