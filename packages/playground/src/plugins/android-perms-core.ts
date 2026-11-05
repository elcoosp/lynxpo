import type {
  PermissionInfo,
  PermissionsManifest,
} from './permissionsManifest.js';

export type AstNode = {
  type: string;
  callee?: {
    type: string;
    property?: { type: string; name?: string };
    object?: {
      type: string;
      object?: { type: string; name?: string };
      property?: { type: string; name?: string };
    };
  };
  arguments?: Array<{ type: string; value?: unknown }>;
};

export interface Options {
  /** Android application package id written into the generated manifest. */
  packageId: string;
  injectionRules: {
    autoAdd: {
      protectionLevels: string[];
      categories: string[];
    };
    conditionalAdd: {
      protectionLevels: string[];
      prompt: string;
      validation: string;
    };
    deprecationHandling: {
      action: string;
      logLevel: string;
      failBuild: boolean;
    };
  };
}

export const defaultOptions: Options = {
  packageId: 'com.lynxpo.app',
  injectionRules: {
    autoAdd: {
      // `normal` permissions are granted at install time and safe to auto-inject.
      protectionLevels: ['normal'],
      categories: [],
    },
    conditionalAdd: {
      protectionLevels: [],
      prompt: '',
      validation: '',
    },
    deprecationHandling: {
      action: 'warn',
      logLevel: 'warning',
      failBuild: false,
    },
  },
};

export const MANIFEST_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="{{packageId}}">

{{permissions}}
    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <!-- Activities, services, etc. are injected by the Android build. -->
    </application>

</manifest>`;

/** Renders the <uses-permission> entries for the given permissions. */
export function renderPermissions(permissions: PermissionInfo[]): string {
  if (permissions.length === 0) {
    return '    <!-- No permissions requested. -->\n';
  }
  return `${permissions
    .map((perm) => {
      const maxSdk = perm.maxSdk
        ? ` android:maxSdkVersion="${perm.maxSdk}"`
        : '';
      return `    <uses-permission android:name="${perm.constantValue}"${maxSdk} />`;
    })
    .join('\n')}\n`;
}

/** Renders a complete AndroidManifest.xml from the resolved permissions. */
export function renderManifest(
  packageId: string,
  permissions: PermissionInfo[],
): string {
  return MANIFEST_TEMPLATE.replace('{{packageId}}', packageId).replace(
    '{{permissions}}',
    renderPermissions(permissions),
  );
}

/**
 * Detects `NativeModules.NativePermissionsModule.requestPermission("<literal>")`
 * calls in the AST and returns the permission name, or `null` when the node is
 * not a matching call. The unplugin-ast traversal visits CallExpressions (so
 * the qualified form is detectable) but not VariableDeclarators, so the call
 * must use the fully-qualified module path.
 */
export function detectPermissionRequest(node: AstNode): string | null {
  if (node.type !== 'CallExpression') return null;
  const callee = node.callee;
  if (
    callee?.type === 'MemberExpression' &&
    callee.property?.type === 'Identifier' &&
    callee.property.name === 'requestPermission' &&
    callee.object?.type === 'MemberExpression' &&
    callee.object.object?.type === 'Identifier' &&
    callee.object.object.name === 'NativeModules' &&
    callee.object.property?.type === 'Identifier' &&
    callee.object.property.name === 'NativePermissionsModule' &&
    node.arguments &&
    node.arguments.length > 0 &&
    node.arguments[0].type === 'Literal' &&
    typeof node.arguments[0].value === 'string'
  ) {
    return node.arguments[0].value;
  }
  return null;
}

/** Resolves the final permission set from detected requests + manifest metadata. */
export function resolvePermissions(
  detectedPermissions: Set<string>,
  manifest: PermissionsManifest,
  options: Options,
): PermissionInfo[] {
  const permissionMap = new Map<string, PermissionInfo>();
  for (const permInfo of manifest.permissions) {
    permissionMap.set(permInfo.constantValue, permInfo);
  }

  const required = new Map<string, PermissionInfo>();
  const addPermission = (perm: PermissionInfo) => {
    required.set(perm.constantValue, perm);
  };

  // 1. Permissions explicitly requested in code.
  for (const permName of detectedPermissions) {
    const permInfo = permissionMap.get(permName);
    if (!permInfo) {
      continue;
    }
    if (permInfo.deprecated && permInfo.replacement) {
      const replacement = permissionMap.get(permInfo.replacement);
      if (
        replacement &&
        options.injectionRules.deprecationHandling.action === 'replace'
      ) {
        addPermission(replacement);
      } else {
        addPermission(permInfo);
      }
    } else {
      addPermission(permInfo);
    }
  }

  // 2. Permissions flagged for auto-injection by protection level / category.
  for (const permInfo of manifest.permissions) {
    if (required.has(permInfo.constantValue)) continue;
    const levelMatch = permInfo.protectionLevel.some((level) =>
      options.injectionRules.autoAdd.protectionLevels.includes(level),
    );
    const categoryMatch = permInfo.categories.some((category) =>
      options.injectionRules.autoAdd.categories.includes(category),
    );
    if (permInfo.required.autoInject && (levelMatch || categoryMatch)) {
      addPermission(permInfo);
    }
  }

  return [...required.values()];
}
