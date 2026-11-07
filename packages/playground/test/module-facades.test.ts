/**
 * Facade contract tests for every @lynxpo/mods-* package.
 *
 * The registry (src/mods-registry.ts) is the source of truth for each module's
 * native module name (`key`) and callable methods. Facades expose a native
 * method under one of two styles:
 *   - getter style:  `get<Method>` (e.g. `getIsDevice` -> `isDevice`)
 *   - direct style:  the bare native method name (e.g. `getItemAsync`,
 *     used when the native name already reads well: `getAccelerometer`,
 *     `writeAsStringAsync`)
 *
 * Invariants enforced here, for all 66 modules:
 *   1. Every registry method is reachable through the facade and forwards a
 *      call to the registered native method name.
 *   2. Every facade `get*` export maps back to a registered native method.
 *   3. Every `use*` hook has a `get*` partner to delegate to.
 *   4. The registry covers every published module directory.
 *
 * The checked-in generated bindings are loaded for real; the Lynx runtime
 * global `NativeModules` is replaced with a recording proxy and the React
 * hooks are stubbed so the delegation logic runs in plain Node.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { MODULES } from '../src/mods-registry.ts';

vi.mock('@lynx-js/react', () => {
  const effects: Array<() => void> = [];
  return {
    useEffect: (effect: () => void) => effects.push(effect),
    useState: (initial: unknown) => [initial, () => {}],
    __flushEffects: effects,
  };
});

const playgroundDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const modulesDir = path.resolve(playgroundDir, '../modules');

type Recorder = ReturnType<typeof vi.fn>;
const recorded = new Map<string, Recorder>();

function recorderFor(key: string): Recorder {
  let fn = recorded.get(key);
  if (!fn) {
    fn = vi.fn(() => `${key}:ok`);
    recorded.set(key, fn);
  }
  return fn;
}

beforeAll(() => {
  const moduleProxy = (moduleName: string) =>
    new Proxy(
      {},
      {
        get: (_target, method) =>
          recorderFor(`${moduleName}.${String(method)}`),
      },
    );
  (globalThis as Record<string, unknown>).NativeModules = new Proxy(
    {},
    { get: (_target, moduleName) => moduleProxy(String(moduleName)) },
  );
});

const cap = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const decap = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

/**
 * Facade exports that intentionally do not call the native module:
 * `supportedCpuArchitectures` needs an array mapping the pinned codegen
 * cannot express yet (see packages/modules/device/src/index.ts).
 */
const NO_NATIVE_CALL = new Set(['device.getSupportedCpuArchitectures']);

function loadModule(pkg: string) {
  const entry = path.join(modulesDir, pkg, 'src/index.ts');
  return import(pathToFileURL(entry).href);
}

describe('module facades', () => {
  for (const mod of MODULES) {
    describe(mod.pkg, () => {
      let facade: Record<string, unknown>;

      beforeAll(async () => {
        facade = (await loadModule(mod.pkg)) as Record<string, unknown>;
      });

      it('exposes every registered method in getter or direct style', () => {
        for (const method of mod.methods) {
          const asGetter = facade[`get${cap(method.name)}`];
          const asDirect = facade[method.name];
          expect(
            asGetter ?? asDirect,
            `${mod.pkg}: no export for native method ${method.name}`,
          ).toBeTypeOf('function');
        }
      });

      it('forwards every registered method to the native module', () => {
        for (const method of mod.methods) {
          const nativeKey = `${mod.key}.${method.name}`;
          const exportName = facade[`get${cap(method.name)}`]
            ? `get${cap(method.name)}`
            : method.name;
          if (NO_NATIVE_CALL.has(`${mod.pkg}.${exportName}`)) continue;
          recorded.get(nativeKey)?.mockClear();
          (facade[exportName] as (...args: unknown[]) => unknown)();
          expect(
            recorded.get(nativeKey)?.mock.calls.length,
            `${mod.pkg}.${exportName} -> ${nativeKey}`,
          ).toBe(1);
        }
      });

      it('maps every get* export back to a registered native method', () => {
        const registered = new Set(mod.methods.map((m) => m.name));
        for (const name of Object.keys(facade)) {
          if (!/^get[A-Z]/.test(name)) continue;
          if (NO_NATIVE_CALL.has(`${mod.pkg}.${name}`)) continue;
          // getter style: getIsDevice -> isDevice; direct style keeps the
          // native name as-is (getItemAsync -> getItemAsync).
          const candidates = [decap(name.slice(3)), name];
          expect(
            candidates.some((candidate) => registered.has(candidate)),
            `${mod.pkg}.${name} maps to none of ${JSON.stringify(candidates)}`,
          ).toBe(true);
        }
      });

      it('gives every use* hook a get* partner', () => {
        for (const name of Object.keys(facade)) {
          if (!/^use[A-Z]/.test(name)) continue;
          expect(
            facade[`get${name.slice(3)}`],
            `${mod.pkg}.${name} partner`,
          ).toBeTypeOf('function');
        }
      });
    });
  }

  it('covers every published module directory in the registry', () => {
    const onDisk = fs
      .readdirSync(modulesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(MODULES.map((mod) => mod.pkg).sort()).toEqual(onDisk);
  });
});
