#!/usr/bin/env node
/** Remove the ktts plugin from every module rslib.config.ts. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const modulesDir = join(process.cwd(), 'packages/modules');
let changed = 0;

for (const name of readdirSync(modulesDir)) {
  const cfgPath = join(modulesDir, name, 'rslib.config.ts');
  if (!existsSync(cfgPath)) continue;
  let src = readFileSync(cfgPath, 'utf8');
  const before = src;

  // Drop the import …
  src = src.replace(/import \{ pluginKotlinToTS \} from '@lynxpo\/plugins-ktts';\n/, '');
  // … and the whole plugins: [ pluginKotlinToTS({ … }) ] block (balanced braces).
  const start = src.indexOf('  plugins: [');
  if (start !== -1) {
    let depth = 0;
    let i = src.indexOf('[', start);
    for (; i < src.length; i++) {
      if (src[i] === '[') depth++;
      else if (src[i] === ']') {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
    }
    src = src.slice(0, start) + src.slice(i).replace(/^\s*,?\n/, '\n');
  }

  if (src !== before) {
    writeFileSync(cfgPath, src);
    changed++;
  }
}
console.log(`rewrote ${changed} rslib configs (ktts removed)`);
