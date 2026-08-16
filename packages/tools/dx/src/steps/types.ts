// Regenerate TypeScript bindings for native Kotlin modules via ktts.
// ktts runs as an rspeedy unplugin (pluginKotlinToTS) driven by
// packages/playground/lynx.config.ts kotlinPath->tsPath mappings, so invoking
// the playground build regenerates mods/*/src/index.ts.
import { pnpmRun, resolveRepoRoot } from '../exec.js';

export async function dxTypes(): Promise<void> {
  const root = resolveRepoRoot();
  await pnpmRun(['--filter', '@lynxpo/playground', 'build'], { cwd: root });
  console.log('types: ktts regenerated TS bindings for native modules');
}
