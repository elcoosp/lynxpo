import fs from 'node:fs';
import path from 'node:path';
import { logger } from '@lynx-js/rspeedy';
import type { RsbuildPlugin } from '@rsbuild/core';
import type { Transformer } from 'unplugin-ast';
import AST from 'unplugin-ast/rspack';
import {
  type AstNode,
  defaultOptions,
  detectPermissionRequest,
  type Options,
  renderManifest,
  resolvePermissions,
} from './android-perms-core.js';
import type { PermissionsManifest } from './permissionsManifest.js';

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
    transform(node) {
      const permissionName = detectPermissionRequest(node as AstNode);
      if (permissionName) {
        detectedPermissions.add(permissionName);
        logger.info(`Found permission request "${permissionName}" in build`);
      }
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
          fs.mkdirSync(api.context.distPath, { recursive: true });
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
