import type { CallExpression, Node, StringLiteral } from '@babel/types';
import { logger } from '@lynx-js/rspeedy';
import type { RsbuildPlugin } from '@rsbuild/core';
import fs from 'fs';
import path from 'path';
import type { Transformer } from 'unplugin-ast';
import AST from 'unplugin-ast/rspack';
import type {
  PermissionInfo,
  PermissionsManifest,
} from './permissionsManifest.js';

interface Options {
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

const defaultOptions: Options = {
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

const MANIFEST_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
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
function renderPermissions(permissions: PermissionInfo[]): string {
  if (permissions.length === 0) {
    return '    <!-- No permissions requested. -->\n';
  }
  return (
    permissions
      .map((perm) => {
        const maxSdk = perm.maxSdk
          ? ` android:maxSdkVersion="${perm.maxSdk}"`
          : '';
        return `    <uses-permission android:name="${perm.constantValue}"${maxSdk} />`;
      })
      .join('\n') + '\n'
  );
}

/** Renders a complete AndroidManifest.xml from the resolved permissions. */
function renderManifest(
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
 * calls in the AST and records the permission name. The unplugin-ast traversal
 * visits CallExpressions (so the qualified form is detectable) but not
 * VariableDeclarators, so the call must use the fully-qualified module path.
 * Returns false (no AST mutation).
 */
function detectPermissionRequest(
  node: Node,
  detectedPermissions: Set<string>,
  contextId: string,
): boolean {
  if (node.type !== 'CallExpression') return false;
  const callee = node.callee;
  if (
    callee.type === 'MemberExpression' &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'requestPermission' &&
    callee.object.type === 'MemberExpression' &&
    callee.object.object.type === 'Identifier' &&
    callee.object.object.name === 'NativeModules' &&
    callee.object.property.type === 'Identifier' &&
    callee.object.property.name === 'NativePermissionsModule' &&
    node.arguments.length > 0 &&
    node.arguments[0].type === 'StringLiteral'
  ) {
    const permissionName = (node.arguments[0] as StringLiteral).value;
    detectedPermissions.add(permissionName);
    logger.info(`Found permission request "${permissionName}" in ${contextId}`);
  }
  return false;
}

/** Loads and validates the permissions manifest. Fails loud — never silently empty. */
function loadManifest(): PermissionsManifest {
  const manifestPath = path.resolve(process.cwd(), 'perms-doc/perms.json');
  let raw: string;
  try {
    raw = fs.readFileSync(manifestPath, 'utf-8');
  } catch (error) {
    throw new Error(
      `Cannot read permissions manifest at ${manifestPath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  let parsed: PermissionsManifest;
  try {
    parsed = JSON.parse(raw) as PermissionsManifest;
  } catch (error) {
    throw new Error(
      `Permissions manifest ${manifestPath} is not valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!parsed || !Array.isArray(parsed.permissions)) {
    throw new Error(
      `Permissions manifest ${manifestPath} must contain a "permissions" array.`,
    );
  }
  return parsed;
}

/** Resolves the final permission set from detected requests + manifest metadata. */
function resolvePermissions(
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
      logger.error(`Unknown permission requested: ${permName}`);
      continue;
    }
    if (permInfo.deprecated && permInfo.replacement) {
      const replacement = permissionMap.get(permInfo.replacement);
      if (
        replacement &&
        options.injectionRules.deprecationHandling.action === 'replace'
      ) {
        logger.warn(
          `Permission ${permName} is deprecated. Using ${permInfo.replacement} instead.`,
        );
        addPermission(replacement);
      } else {
        if (options.injectionRules.deprecationHandling.action === 'replace') {
          logger.warn(
            `Permission ${permName} is deprecated but replacement ${permInfo.replacement} not found; keeping original.`,
          );
        }
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

export function androidPermissionsPlugin(
  options: Partial<Options> = {},
): RsbuildPlugin {
  const resolvedOptions: Options = {
    ...defaultOptions,
    ...options,
    injectionRules: {
      ...defaultOptions.injectionRules,
      ...options.injectionRules,
    },
  };

  const detectedPermissions = new Set<string>();
  const detector: Transformer = {
    onNode: () => true,
    transform(node: Node) {
      detectPermissionRequest(node, detectedPermissions, 'build');
      return undefined;
    },
  };

  return {
    name: 'android-permissions-plugin',

    setup(api) {
      // Detect permission requests during the build via an AST transformer.
      const astPlugin = AST({
        include: [/\.(ts|tsx)$/],
        parserOptions: {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
        },
        transformer: [detector],
      });

      api.modifyRspackConfig((config) => {
        config.plugins = config.plugins || [];
        config.plugins.push(astPlugin);
        return config;
      });

      // Generate AndroidManifest.xml after build.
      api.onAfterBuild(() => {
        const manifest = loadManifest();
        const requiredPermissions = resolvePermissions(
          detectedPermissions,
          manifest,
          resolvedOptions,
        );

        const outputPath = path.resolve(
          api.context.distPath,
          'AndroidManifest.xml',
        );
        try {
          fs.writeFileSync(
            outputPath,
            renderManifest(resolvedOptions.packageId, requiredPermissions),
          );
          logger.info(
            `Generated AndroidManifest.xml with ${requiredPermissions.length} permission(s) at: ${outputPath}`,
          );
        } catch (error) {
          logger.error('Failed to write AndroidManifest.xml:', error);
          throw error;
        }
      });
    },
  };
}
