import { resolve } from 'node:path';
import { resolveRepoRoot, run } from '../exec.js';

/**
 * Inject native modules into the Lynx Explorer shell (Android + iOS).
 * nmi reads process.cwd() as the workspace root and auto-detects
 * src/lynx/explorer, so it MUST run from the repo root. We call its built
 * CJS entry directly (the workspace bin may be unlinked if install aborted).
 */
export async function dxInject(): Promise<void> {
  const root = resolveRepoRoot();
  const nmi = resolve(root, 'packages/tools/nmi/dist/cjs/index.cjs');
  await run('node', [nmi], { cwd: root });
  console.log('inject: native modules installed into Lynx Explorer');
}
