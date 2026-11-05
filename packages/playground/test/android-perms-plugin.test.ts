import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { androidPermissionsPlugin } from '../src/plugins/android-perms.ts';

type Hooks = {
  modify?: (config: { plugins?: unknown[] }) => { plugins?: unknown[] };
  afterBuild?: () => void;
};

function setupPlugin(options?: Parameters<typeof androidPermissionsPlugin>[0]) {
  const plugin = androidPermissionsPlugin(options);
  const hooks: Hooks = {};
  const api = {
    context: { distPath: path.join(process.cwd(), 'dist') },
    modifyRspackConfig(cb: Hooks['modify']) {
      hooks.modify = cb;
    },
    onAfterBuild(cb: () => void) {
      hooks.afterBuild = cb;
    },
  };
  plugin.setup(api as never);
  return hooks;
}

let cwd: string;
let original: string;

beforeEach(() => {
  original = process.cwd();
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'lynxpo-perms-'));
  process.chdir(cwd);
});

afterEach(() => {
  process.chdir(original);
  fs.rmSync(cwd, { recursive: true, force: true });
});

function writeManifest(value: unknown) {
  fs.mkdirSync(path.join(cwd, 'perms-doc'), { recursive: true });
  fs.writeFileSync(
    path.join(cwd, 'perms-doc/perms.json'),
    typeof value === 'string' ? value : JSON.stringify(value),
  );
}

const normalPermission = {
  constantValue: 'android.permission.INTERNET',
  protectionLevel: ['normal'],
  categories: [],
  required: { autoInject: true, conditions: [] },
};

describe('androidPermissionsPlugin', () => {
  it('registers the AST plugin and writes the manifest after build', () => {
    writeManifest({ permissions: [normalPermission] });
    const hooks = setupPlugin();

    expect(hooks.modify?.({})).toEqual({ plugins: [expect.anything()] });
    const config = { plugins: [{}] };
    expect(hooks.modify?.(config).plugins).toHaveLength(2);

    hooks.afterBuild?.();
    const output = fs.readFileSync(path.join(cwd, 'dist/AndroidManifest.xml'), {
      encoding: 'utf-8',
    });
    expect(output).toContain('package="com.lynxpo.app"');
    expect(output).toContain(
      '<uses-permission android:name="android.permission.INTERNET" />',
    );
  });

  it('honours a custom package id', () => {
    writeManifest({ permissions: [] });
    const hooks = setupPlugin({ packageId: 'com.example.test' });
    hooks.afterBuild?.();
    const output = fs.readFileSync(path.join(cwd, 'dist/AndroidManifest.xml'), {
      encoding: 'utf-8',
    });
    expect(output).toContain('package="com.example.test"');
    expect(output).toContain('No permissions requested');
  });

  it('fails loudly when the manifest is missing', () => {
    const hooks = setupPlugin();
    expect(() => hooks.afterBuild?.()).toThrow(/Cannot read permissions/);
  });

  it('fails loudly when the manifest is not JSON', () => {
    writeManifest('{ nope');
    const hooks = setupPlugin();
    expect(() => hooks.afterBuild?.()).toThrow(/is not valid JSON/);
  });

  it('fails loudly when the permissions array is missing', () => {
    writeManifest({ nope: true });
    const hooks = setupPlugin();
    expect(() => hooks.afterBuild?.()).toThrow(/must contain a "permissions"/);
  });
});
