import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const distDir = path.resolve(process.cwd(), 'packages/playground/dist');
const hasDist = fs.existsSync(distDir);

const expectedBundles = [
  'main.lynx.bundle',
  'hostdemo.lynx.bundle',
  'hostmin.lynx.bundle',
  'hostsingle.lynx.bundle',
  'hostsync.lynx.bundle',
  'hostshowcase.lynx.bundle',
];

describe.skipIf(!hasDist)('built playground artifacts', () => {
  it('emits every configured entry bundle', () => {
    for (const bundle of expectedBundles) {
      const file = path.join(distDir, bundle);
      expect(fs.existsSync(file), bundle).toBe(true);
      expect(fs.statSync(file).size, bundle).toBeGreaterThan(1024);
    }
  });

  it('emits an AndroidManifest with the expected package and permissions', () => {
    const manifestPath = path.join(distDir, 'AndroidManifest.xml');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = fs.readFileSync(manifestPath, 'utf-8');
    expect(manifest).toContain('package="com.lynxpo.app"');
    expect(manifest).toContain(
      '<uses-permission android:name="android.permission.ACCESS_BLOBS_ACROSS_USERS" />',
    );
    expect(manifest).not.toContain('{{permissions}}');
  });

  it('embeds native module references in the main bundle', () => {
    const text = fs
      .readFileSync(path.join(distDir, 'main.lynx.bundle'))
      .toString('utf-8');
    for (const moduleName of [
      'DeviceModule',
      'BatteryModule',
      'AppIntegrity',
    ]) {
      expect(text, moduleName).toContain(moduleName);
    }
  });
});
