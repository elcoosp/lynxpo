import { resolve } from 'node:path';
import { pnpmRun, resolveRepoRoot, run } from '../exec.js';

/**
 * Regenerate Android/Apple permission manifests via the aps scraper.
 * aps is built with rslib first (it ships as TypeScript, no prebuilt dist),
 * then its emitted entry is run. This is a best-effort step: aps is a
 * network scraper and its bundling/build can fail independently, so a failure
 * here warns rather than aborting the rest of the dx flow.
 */
export async function dxPerms(): Promise<void> {
  const root = resolveRepoRoot();
  const apsDir = resolve(root, 'packages/tools/aps');
  try {
    await pnpmRun(['--filter', '@lynxpo/tools-aps', 'build'], { cwd: root });
    const apsEntry = resolve(apsDir, 'dist/index.js');
    await run('node', [apsEntry], { cwd: apsDir });
    console.log('perms: regenerated permission manifests');
  } catch (err) {
    console.warn(
      `\n! dx perms skipped: ${(err as Error).message}\n` +
        '  (aps is a network scraper; build/run can fail offline. Re-run manually if needed.)',
    );
  }
}
