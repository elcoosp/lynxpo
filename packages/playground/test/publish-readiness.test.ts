/**
 * Publish-readiness gate for every @lynxpo/mods-* package.
 *
 * Every module is meant to ship to npm (publishConfig.access = public) and be
 * consumed through Lynx Autolink, so each manifest must carry complete,
 * self-consistent metadata and the files it advertises must exist:
 *   - package.json: identity, entry points, exports map, publishable files,
 *     repository/bugs/homepage, keywords, peer dependency on @lynx-js/react
 *   - lynx.lib.json: autolink manifest with android + ios platforms
 *   - a CocoaPods podspec for the iOS twin
 *   - a LICENSE copy so it lands in the tarball
 *   - a build (dist/) when the package has been built in this checkout
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);
const modulesDir = path.join(rootDir, 'packages/modules');

const modules = fs
  .readdirSync(modulesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const readJson = (file: string): Record<string, unknown> =>
  JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;

describe('publish readiness', () => {
  it('has module directories to audit', () => {
    expect(modules.length).toBeGreaterThan(0);
  });

  for (const name of modules) {
    describe(name, () => {
      const dir = path.join(modulesDir, name);
      const pkg = readJson(path.join(dir, 'package.json')) as {
        name: string;
        version: string;
        description: string;
        license: string;
        author: string;
        main: string;
        module: string;
        types: string;
        exports: Record<string, Record<string, string>>;
        files: string[];
        publishConfig: Record<string, string>;
        sideEffects: boolean;
        repository: { type: string; url: string; directory: string };
        bugs: { url: string };
        homepage: string;
        keywords: string[];
        peerDependencies?: Record<string, string>;
        private?: boolean;
      };

      it('declares complete npm identity', () => {
        expect(pkg.name, 'name').toBe(`@lynxpo/mods-${name}`);
        expect(pkg.version, 'version').toMatch(/^\d+\.\d+\.\d+/);
        expect(pkg.description?.length ?? 0, 'description').toBeGreaterThan(0);
        expect(pkg.license, 'license').toBe('Apache-2.0');
        expect(pkg.author?.length ?? 0, 'author').toBeGreaterThan(0);
        expect(pkg.private ?? false, 'private').toBe(false);
      });

      it('declares consistent entry points', () => {
        expect(pkg.main).toBe('./dist/cjs/index.cjs');
        expect(pkg.module).toBe('./dist/index.js');
        expect(pkg.types).toBe('./dist/index.d.ts');
        expect(pkg.exports?.['.']).toEqual({
          types: './dist/index.d.ts',
          import: './dist/index.js',
          require: './dist/cjs/index.cjs',
        });
      });

      it('ships every file the autolink layout requires', () => {
        const files = pkg.files ?? [];
        for (const required of ['dist', 'lynx.lib.json', 'types']) {
          expect(files, `files[] includes ${required}`).toContain(required);
        }
        for (const twin of ['android', 'ios']) {
          if (fs.existsSync(path.join(dir, twin))) {
            expect(files, `files[] includes twin ${twin}`).toContain(twin);
          }
        }
        expect(pkg.publishConfig?.access, 'publishConfig.access').toBe(
          'public',
        );
      });

      it('points repository, bugs and homepage at this repo', () => {
        expect(pkg.repository).toEqual({
          type: 'git',
          url: 'git+https://github.com/elcoosp/lynxpo.git',
          directory: `packages/modules/${name}`,
        });
        expect(pkg.bugs?.url).toBe('https://github.com/elcoosp/lynxpo/issues');
        expect(pkg.homepage).toBe(
          `https://github.com/elcoosp/lynxpo/tree/main/packages/modules/${name}#readme`,
        );
      });

      it('declares searchable keywords and a lynx peer dependency', () => {
        expect(pkg.keywords?.length, 'keywords').toBeGreaterThan(0);
        expect(pkg.keywords, 'keywords include lynx').toContain('lynx');
        expect(
          pkg.peerDependencies?.['@lynx-js/react'],
          'peerDependencies["@lynx-js/react"]',
        ).toBeTypeOf('string');
      });

      it('has a valid lynx.lib.json autolink manifest', () => {
        const lib = readJson(path.join(dir, 'lynx.lib.json')) as {
          name: string;
          platforms: {
            android: { packageName: string; sourceDir: string };
            ios: { sourceDir: string };
          };
        };
        expect(lib.platforms?.android?.packageName).toMatch(
          /^com\.lynxpo\.[a-z0-9]+$/,
        );
        expect(lib.platforms?.android?.sourceDir ?? 'android').toBe('android');
        expect(lib.platforms?.ios?.sourceDir ?? 'ios').toBe('ios');
      });

      it('ships one iOS podspec and a LICENSE copy', () => {
        const iosDir = path.join(dir, 'ios');
        const podspecs = fs.existsSync(iosDir)
          ? fs.readdirSync(iosDir).filter((f) => f.endsWith('.podspec'))
          : [];
        expect(podspecs.length, 'one .podspec in ios/').toBe(1);
        expect(
          fs.existsSync(path.join(dir, 'LICENSE')),
          'LICENSE in package dir',
        ).toBe(true);
      });

      it('keeps the built dist in sync with the manifest when built', () => {
        const distDir = path.join(dir, 'dist');
        if (!fs.existsSync(distDir)) return; // not built in this checkout
        expect(
          fs.existsSync(path.join(distDir, 'index.js')),
          'dist/index.js (esm)',
        ).toBe(true);
        expect(
          fs.existsSync(path.join(distDir, 'cjs', 'index.cjs')),
          'dist/cjs/index.cjs',
        ).toBe(true);
        expect(
          fs.existsSync(path.join(distDir, 'index.d.ts')),
          'dist/index.d.ts',
        ).toBe(true);
      });
    });
  }

  it('pins the workspace toolchain at the root', () => {
    const root = readJson(path.join(rootDir, 'package.json')) as {
      name: string;
      private: boolean;
      engines: { node: string };
      packageManager: string;
    };
    expect(root.name).toBe('@lynxpo/root');
    expect(root.private).toBe(true);
    expect(root.engines?.node).toBeTypeOf('string');
    expect(root.packageManager, 'packageManager pins pnpm').toMatch(
      /^pnpm@\d+\.\d+\.\d+$/,
    );
  });
});
