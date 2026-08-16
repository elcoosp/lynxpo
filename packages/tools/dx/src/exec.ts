import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface RunOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  /** Kill after this many ms. */
  timeoutMs?: number;
  /** When false, do not throw on non-zero exit (default true). */
  throwOnError?: boolean;
  /** Echo combined output to the parent's stdout/stderr (default true). */
  inherit?: boolean;
}

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

/**
 * Run a command, streaming output to the parent terminal by default.
 * Resolves with { code, stdout, stderr }; rejects only when throwOnError
 * is true and the process exits non-zero (or is killed by timeout).
 */
export function run(
  cmd: string,
  args: string[] = [],
  opts: RunOptions = {},
): Promise<RunResult> {
  const { cwd, env, timeoutMs, throwOnError = true, inherit = true } = opts;

  // Corepack refuses to auto-download toolchains interactively; never prompt.
  const mergedEnv: NodeJS.ProcessEnv = {
    ...process.env,
    COREPACK_ENABLE_DOWNLOAD_PROMPT: '0',
    ...env,
  };

  return new Promise<RunResult>((resolvePromise, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      env: mergedEnv,
      stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    if (!inherit) {
      child.stdout?.on('data', (d) => (stdout += d.toString()));
      child.stderr?.on('data', (d) => (stderr += d.toString()));
    }

    let timer: NodeJS.Timeout | undefined;
    if (timeoutMs && timeoutMs > 0) {
      timer = setTimeout(() => {
        child.kill('SIGKILL');
        const msg = `Command timed out after ${timeoutMs}ms: ${cmd} ${args.join(' ')}`;
        if (throwOnError) reject(new Error(msg));
        else resolvePromise({ code: 124, stdout, stderr });
      }, timeoutMs);
    }

    child.on('error', (err) => {
      if (timer) clearTimeout(timer);
      if (throwOnError) reject(err);
      else resolvePromise({ code: 127, stdout, stderr });
    });

    child.on('close', (code) => {
      if (timer) clearTimeout(timer);
      const result: RunResult = { code: code ?? 0, stdout, stderr };
      if (code && code !== 0 && throwOnError) {
        reject(
          new Error(
            `Command failed (${code}): ${cmd} ${args.join(' ')}\n${stderr || stdout}`,
          ),
        );
      } else {
        resolvePromise(result);
      }
    });
  });
}

/** Locate the workspace root (the dir containing pnpm-workspace.yaml). */
export function resolveRepoRoot(from: string = process.cwd()): string {
  let dir = from;
  // Walk up until we find pnpm-workspace.yaml.
  for (let i = 0; i < 20; i++) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: assume cwd is already the repo root (all dx steps run from there).
  return from;
}

/** Absolute path to the nested engine tree. */
export function engineRoot(repoRoot: string): string {
  return resolve(repoRoot, 'packages/playground/src/lynx');
}

/** Resolve a workspace-local bin (node_modules/.bin/<name>). */
export function binPath(repoRoot: string, name: string): string {
  return resolve(repoRoot, 'node_modules/.bin', name);
}

/**
 * Run pnpm via corepack so the workspace/engine `packageManager` pin (e.g. pnpm
 * 7.33.6 inside the nested engine repo vs 11.x at the repo root) is honored per
 * cwd, instead of whatever `pnpm` happens to be first on PATH.
 */
export async function pnpmRun(
  args: string[],
  opts: RunOptions = {},
): Promise<RunResult> {
  return run('corepack', ['pnpm', ...args], opts);
}
