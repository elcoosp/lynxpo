/**
 * Data-integrity tests for the frozen Android/Apple permission reference
 * (docs/permissions/) and the playground build-time permission source
 * (packages/playground/perms-doc/perms.json) consumed by the
 * android-permissions rsbuild plugin.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);
const docsPermsDir = path.join(rootDir, 'docs', 'permissions');
const playgroundPermsPath = path.join(
  rootDir,
  'packages/playground/perms-doc/perms.json',
);

interface PermissionEntry {
  name: string;
  description: string;
  deprecated: boolean;
  replacement: string | null;
  protectionLevel?: string[];
  minSdk?: number;
  maxSdk?: number | null;
  constantValue?: string;
  categories?: string[];
  required?: { autoInject?: boolean; conditions?: unknown[] };
}

const readJson = (file: string): unknown =>
  JSON.parse(fs.readFileSync(file, 'utf8'));

describe('docs/permissions reference data', () => {
  const { permissions } = readJson(path.join(docsPermsDir, 'perms.json')) as {
    permissions: PermissionEntry[];
  };

  it('contains a non-empty permission catalogue', () => {
    expect(permissions.length).toBeGreaterThan(100);
  });

  it('uses unique permission names', () => {
    const names = permissions.map((entry) => entry.name);
    expect(new Set(names).size, 'duplicate names').toBe(names.length);
  });

  it('types every entry correctly', () => {
    for (const entry of permissions) {
      expect(entry.name, 'name').toMatch(/^[A-Z0-9_]+$/);
      expect(typeof entry.description, `${entry.name} description`).toBe(
        'string',
      );
      expect(
        entry.description.length,
        `${entry.name} description`,
      ).toBeGreaterThan(0);
      expect(typeof entry.deprecated, `${entry.name} deprecated`).toBe(
        'boolean',
      );
      if (entry.protectionLevel !== undefined) {
        expect(
          Array.isArray(entry.protectionLevel),
          `${entry.name} protectionLevel`,
        ).toBe(true);
      }
    }
  });

  it('uses namespaced Android permission constants where present', () => {
    for (const entry of permissions) {
      if (entry.constantValue === undefined) continue;
      // android.permission.* plus platform namespaces such as
      // com.android.voicemail.permission.ADD_VOICEMAIL
      expect(entry.constantValue, `${entry.name} constantValue`).toMatch(
        /^([a-z][a-z0-9_]*\.)+[A-Z][A-Z0-9_]*$/,
      );
    }
  });

  it('documents every deprecated entry with a replacement or a note', () => {
    for (const entry of permissions) {
      if (!entry.deprecated) continue;
      const documented =
        entry.replacement !== null || /deprecat/i.test(entry.description);
      expect(documented, `${entry.name} deprecation details`).toBe(true);
    }
  });
});

describe('playground build-time permission source', () => {
  const { permissions } = readJson(playgroundPermsPath) as {
    permissions: PermissionEntry[];
  };

  it('is a non-empty catalogue the plugin can consume', () => {
    expect(permissions.length).toBeGreaterThan(0);
  });

  it('types entries with the fields the injection rules read', () => {
    for (const entry of permissions) {
      expect(entry.name).toMatch(/^[A-Z0-9_]+$/);
      expect(
        Array.isArray(entry.protectionLevel),
        `${entry.name} protectionLevel`,
      ).toBe(true);
      expect(entry.required, `${entry.name} required`).toBeTypeOf('object');
      expect(
        typeof entry.required?.autoInject,
        `${entry.name} required.autoInject`,
      ).toBe('boolean');
    }
  });

  it('declares the blob permission the Android manifest smoke test expects', () => {
    const blobs = permissions.find(
      (entry) => entry.name === 'ACCESS_BLOBS_ACROSS_USERS',
    );
    expect(blobs).toBeDefined();
    expect(blobs?.required?.autoInject).toBe(true);
  });
});

describe('docs/permissions supporting assets', () => {
  it('keeps the unified maps and plugin source in place', () => {
    for (const file of [
      'perms-unified.ts',
      'perms-unified-id-map.md',
      'perms-unified-cat-map.md',
      'raw-perms-android-doc.md',
      'raw-perms-ios-doc.md',
      'README.md',
    ]) {
      expect(
        fs.existsSync(path.join(docsPermsDir, file)),
        `${file} exists`,
      ).toBe(true);
    }
  });

  it('exports the PermissionInfo contract the unified catalogue uses', () => {
    const unified = fs.readFileSync(
      path.join(docsPermsDir, 'perms-unified.ts'),
      'utf8',
    );
    expect(unified).toContain('export interface PermissionInfo');
    expect(unified).toContain('usageDescriptionKey');
    expect(unified).toContain('constantValue');
  });
});
