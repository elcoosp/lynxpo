import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ARG_DEFAULTS, ARG_TYPES } from '../src/mods-args.ts';
import { METHOD_COUNT, MODULE_COUNT, MODULES } from '../src/mods-registry.ts';

describe('mods registry', () => {
  it('keeps the exported counts in sync', () => {
    expect(MODULE_COUNT).toBe(MODULES.length);
    expect(METHOD_COUNT).toBe(
      MODULES.reduce((sum, mod) => sum + mod.methods.length, 0),
    );
  });

  it('has unique package, name and key entries', () => {
    const pkgs = new Set<string>();
    const names = new Set<string>();
    const keys = new Set<string>();
    for (const mod of MODULES) {
      expect(pkgs.has(mod.pkg), `duplicate pkg ${mod.pkg}`).toBe(false);
      expect(names.has(mod.name), `duplicate name ${mod.name}`).toBe(false);
      expect(keys.has(mod.key), `duplicate key ${mod.key}`).toBe(false);
      pkgs.add(mod.pkg);
      names.add(mod.name);
      keys.add(mod.key);
    }
  });

  it('has a non-empty label and at least one method per module', () => {
    for (const mod of MODULES) {
      expect(mod.label.length, `${mod.pkg} label`).toBeGreaterThan(0);
      expect(mod.methods.length, `${mod.pkg} methods`).toBeGreaterThan(0);
    }
  });

  it('has unique method names within each module', () => {
    for (const mod of MODULES) {
      const methods = mod.methods.map((method) => method.name);
      expect(new Set(methods).size, `${mod.pkg} duplicate methods`).toBe(
        methods.length,
      );
    }
  });

  it('points at real workspace packages', () => {
    const modulesDir = path.resolve(process.cwd(), 'packages/modules');
    for (const mod of MODULES) {
      const packageJson = path.join(modulesDir, mod.pkg, 'package.json');
      expect(fs.existsSync(packageJson), `${mod.pkg} package.json`).toBe(true);
    }
  });
});

describe('mods args', () => {
  const methodNames = new Set(
    MODULES.flatMap((mod) => mod.methods.map((method) => method.name)),
  );

  it('has matching arg types and defaults for every method', () => {
    for (const [method, types] of Object.entries(ARG_TYPES)) {
      expect(ARG_DEFAULTS[method], `${method} defaults`).toBeDefined();
      expect(ARG_DEFAULTS[method].length, `${method} arity`).toBe(types.length);
    }
  });

  it('does not define defaults without types', () => {
    for (const method of Object.keys(ARG_DEFAULTS)) {
      expect(ARG_TYPES[method], `${method} types`).toBeDefined();
    }
  });

  it('only defines args for methods that exist in the registry', () => {
    for (const method of Object.keys(ARG_TYPES)) {
      expect(methodNames.has(method), `${method} missing from registry`).toBe(
        true,
      );
    }
  });

  it('uses defaults compatible with the declared arg type', () => {
    for (const [method, types] of Object.entries(ARG_TYPES)) {
      types.forEach((type, index) => {
        const value = ARG_DEFAULTS[method][index];
        if (type === 'number') {
          expect(typeof value, `${method}[${index}]`).toBe('number');
        } else if (type === 'boolean') {
          expect(typeof value, `${method}[${index}]`).toBe('boolean');
        } else if (type === 'string') {
          expect(
            value === null || typeof value === 'string',
            `${method}[${index}]`,
          ).toBe(true);
        }
      });
    }
  });
});
