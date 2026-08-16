import { describe, expect, it } from 'vitest';
import { isJava11 } from '../src/env.js';
import { run } from '../src/exec.js';

describe('run()', () => {
  it('resolves with code 0 and stdout for a successful command', async () => {
    const res = await run('node', ['-e', 'process.stdout.write("hi")'], {
      inherit: false,
    });
    expect(res.code).toBe(0);
    expect(res.stdout).toBe('hi');
  });

  it('rejects on non-zero exit when throwOnError is true', async () => {
    await expect(
      run('node', ['-e', 'process.exit(3)'], { inherit: false }),
    ).rejects.toThrow(/3/);
  });

  it('does not throw on non-zero when throwOnError is false', async () => {
    const res = await run('node', ['-e', 'process.exit(3)'], {
      inherit: false,
      throwOnError: false,
    });
    expect(res.code).toBe(3);
  });
});

describe('isJava11()', () => {
  it('detects major version 11', () => {
    expect(isJava11('11.0.32')).toBe(true);
    expect(isJava11('11')).toBe(true);
  });
  it('rejects other versions and null', () => {
    expect(isJava11('21.0.1')).toBe(false);
    expect(isJava11(null)).toBe(false);
  });
});
