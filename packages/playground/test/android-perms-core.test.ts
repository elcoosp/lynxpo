import { describe, expect, it } from 'vitest';
import {
  type AstNode,
  defaultOptions,
  detectPermissionRequest,
  type Options,
  renderManifest,
  renderPermissions,
  resolvePermissions,
} from '../src/plugins/android-perms-core.ts';
import type {
  PermissionInfo,
  PermissionsManifest,
} from '../src/plugins/permissionsManifest.ts';

const perm = (
  constantValue: string,
  overrides: Partial<PermissionInfo> = {},
): PermissionInfo => ({
  name: constantValue,
  description: '',
  deprecated: false,
  replacement: null,
  protectionLevel: ['dangerous'],
  minSdk: 1,
  maxSdk: null,
  required: { autoInject: false, conditions: [] },
  categories: [],
  constantValue,
  ...overrides,
});

const manifest = (permissions: PermissionInfo[]): PermissionsManifest => ({
  permissions,
});

const callNode = (values: {
  moduleName?: string;
  methodName?: string;
  argumentType?: string;
  argumentValue?: unknown;
  argCount?: number;
  objectType?: string;
}): AstNode => {
  const {
    moduleName = 'NativePermissionsModule',
    methodName = 'requestPermission',
    argumentType = 'Literal',
    argumentValue = 'android.permission.CAMERA',
    argCount = 1,
    objectType = 'Identifier',
  } = values;
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      property: { type: 'Identifier', name: methodName },
      object: {
        type: 'MemberExpression',
        object: { type: objectType, name: 'NativeModules' },
        property: { type: 'Identifier', name: moduleName },
      },
    },
    arguments: Array.from({ length: argCount }, (_, index) => ({
      type: index === 0 ? argumentType : 'Literal',
      value: index === 0 ? argumentValue : undefined,
    })),
  };
};

describe('renderPermissions', () => {
  it('renders a comment when there are no permissions', () => {
    expect(renderPermissions([])).toBe(
      '    <!-- No permissions requested. -->\n',
    );
  });

  it('renders maxSdkVersion only when present', () => {
    const rendered = renderPermissions([
      perm('android.permission.CAMERA'),
      perm('android.permission.READ_PHONE_STATE', { maxSdk: 32 }),
    ]);
    expect(rendered).toContain(
      '    <uses-permission android:name="android.permission.CAMERA" />',
    );
    expect(rendered).toContain(
      '    <uses-permission android:name="android.permission.READ_PHONE_STATE" android:maxSdkVersion="32" />',
    );
  });
});

describe('renderManifest', () => {
  it('injects package id and permissions', () => {
    const rendered = renderManifest('com.example.app', [
      perm('android.permission.CAMERA'),
    ]);
    expect(rendered).toContain('package="com.example.app"');
    expect(rendered).toContain('android.permission.CAMERA');
    expect(rendered).not.toContain('{{permissions}}');
  });
});

describe('detectPermissionRequest', () => {
  it('detects a fully-qualified literal request', () => {
    expect(detectPermissionRequest(callNode({}))).toBe(
      'android.permission.CAMERA',
    );
  });

  it('ignores non-call nodes', () => {
    expect(detectPermissionRequest({ type: 'Identifier' })).toBeNull();
  });

  it('ignores calls with a different method name', () => {
    expect(
      detectPermissionRequest(callNode({ methodName: 'somethingElse' })),
    ).toBeNull();
  });

  it('ignores calls on a different native module', () => {
    expect(
      detectPermissionRequest(callNode({ moduleName: 'OtherModule' })),
    ).toBeNull();
  });

  it('ignores calls without arguments', () => {
    expect(detectPermissionRequest(callNode({ argCount: 0 }))).toBeNull();
  });

  it('ignores non-literal arguments', () => {
    expect(
      detectPermissionRequest(
        callNode({ argumentType: 'Identifier', argumentValue: undefined }),
      ),
    ).toBeNull();
  });

  it('ignores non-identifier callees', () => {
    expect(
      detectPermissionRequest(callNode({ objectType: 'MemberExpression' })),
    ).toBeNull();
  });
});

describe('resolvePermissions', () => {
  const options: Options = defaultOptions;

  it('includes explicitly requested permissions', () => {
    const result = resolvePermissions(
      new Set(['android.permission.CAMERA']),
      manifest([perm('android.permission.CAMERA')]),
      options,
    );
    expect(result.map((p) => p.constantValue)).toEqual([
      'android.permission.CAMERA',
    ]);
  });

  it('ignores unknown requested permissions', () => {
    const result = resolvePermissions(
      new Set(['android.permission.UNKNOWN']),
      manifest([perm('android.permission.CAMERA')]),
      options,
    );
    expect(result).toEqual([]);
  });

  it('auto-injects normal permissions', () => {
    const result = resolvePermissions(
      new Set(),
      manifest([
        perm('android.permission.INTERNET', {
          protectionLevel: ['normal'],
          required: { autoInject: true, conditions: [] },
        }),
      ]),
      options,
    );
    expect(result.map((p) => p.constantValue)).toEqual([
      'android.permission.INTERNET',
    ]);
  });

  it('auto-injects by configured category', () => {
    const result = resolvePermissions(
      new Set(),
      manifest([
        perm('android.permission.POST_NOTIFICATIONS', {
          protectionLevel: ['dangerous'],
          categories: ['notifications'],
          required: { autoInject: true, conditions: [] },
        }),
      ]),
      {
        ...options,
        injectionRules: {
          ...options.injectionRules,
          autoAdd: { protectionLevels: [], categories: ['notifications'] },
        },
      },
    );
    expect(result.map((p) => p.constantValue)).toEqual([
      'android.permission.POST_NOTIFICATIONS',
    ]);
  });

  it('does not auto-inject when autoInject is false', () => {
    const result = resolvePermissions(
      new Set(),
      manifest([
        perm('android.permission.INTERNET', { protectionLevel: ['normal'] }),
      ]),
      options,
    );
    expect(result).toEqual([]);
  });

  it('does not duplicate permissions that are both detected and auto-injected', () => {
    const result = resolvePermissions(
      new Set(['android.permission.INTERNET']),
      manifest([
        perm('android.permission.INTERNET', {
          protectionLevel: ['normal'],
          required: { autoInject: true, conditions: [] },
        }),
      ]),
      options,
    );
    expect(result).toHaveLength(1);
  });

  it('replaces deprecated permissions when configured', () => {
    const result = resolvePermissions(
      new Set(['android.permission.OLD']),
      manifest([
        perm('android.permission.OLD', {
          deprecated: true,
          replacement: 'android.permission.NEW',
        }),
        perm('android.permission.NEW'),
      ]),
      {
        ...options,
        injectionRules: {
          ...options.injectionRules,
          deprecationHandling: {
            ...options.injectionRules.deprecationHandling,
            action: 'replace',
          },
        },
      },
    );
    expect(result.map((p) => p.constantValue)).toEqual([
      'android.permission.NEW',
    ]);
  });

  it('keeps deprecated permissions when replacement is missing', () => {
    const result = resolvePermissions(
      new Set(['android.permission.OLD']),
      manifest([
        perm('android.permission.OLD', {
          deprecated: true,
          replacement: 'android.permission.MISSING',
        }),
      ]),
      {
        ...options,
        injectionRules: {
          ...options.injectionRules,
          deprecationHandling: {
            ...options.injectionRules.deprecationHandling,
            action: 'replace',
          },
        },
      },
    );
    expect(result.map((p) => p.constantValue)).toEqual([
      'android.permission.OLD',
    ]);
  });

  it('keeps deprecated permissions when action is warn', () => {
    const result = resolvePermissions(
      new Set(['android.permission.OLD']),
      manifest([
        perm('android.permission.OLD', {
          deprecated: true,
          replacement: 'android.permission.NEW',
        }),
        perm('android.permission.NEW'),
      ]),
      options,
    );
    expect(result.map((p) => p.constantValue)).toEqual([
      'android.permission.OLD',
    ]);
  });
});
