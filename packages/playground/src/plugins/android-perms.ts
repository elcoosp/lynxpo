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
} from './parseMarkdownToPermissionsManifest.js';

interface Options {
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
  injectionRules: {
    autoAdd: {
      protectionLevels: [],
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
export function androidPermissionsPlugin(
  options = defaultOptions,
): RsbuildPlugin {
  // Set of detected permission names
  const detectedPermissions = new Set<string>();
  const isTargetNode = (n: Node): n is CallExpression =>
    n.type === 'CallExpression';
  // Custom transformer for detecting permission requests using ESQuery
  const PermissionRequestDetector = (): Transformer => ({
    // Match all nodes
    transform(node: Node, code, context) {
      if (isTargetNode(node)) {
        // This targets: NativeModules.NativePermissionsModule.requestPermission(stringLiteral)
        if (node.callee.type === 'MemberExpression') {
          const callee = node.callee;
          if (
            callee.property.type === 'Identifier' &&
            callee.property.name === 'requestPermission' &&
            callee.object.type === 'MemberExpression' &&
            callee.object.object.type === 'Identifier' &&
            callee.object.object.name === 'NativeModules' &&
            callee.object.property.type === 'Identifier' &&
            callee.object.property.name === 'NativePermissionsModule' &&
            node.arguments[0].type === 'StringLiteral'
          ) {
            const permissionName = (node.arguments[0] as StringLiteral).value;
            detectedPermissions.add(permissionName);
            logger.info(
              `Found permission request "${permissionName}" in ${context.id}`,
            );

            // Don't modify the AST, just return the original node
            return undefined;
          }
        }
      }
    },
  });

  // Parse the perms.json file
  const parseManifestPerms = (): PermissionsManifest => {
    try {
      const manifestPath = path.resolve(process.cwd(), 'perms-doc/perms.json');
      const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
      return JSON.parse(manifestContent) as PermissionsManifest;
    } catch (error) {
      logger.error('Failed to parse perms.json:', error);
      return {
        permissions: [],
      };
    }
  };

  // Create the AST unplugin with our custom transformer
  const astPlugin = AST({
    include: [/\.(ts|tsx)$/],
    parserOptions: {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    },
    transformer: [PermissionRequestDetector()],
  });

  // Return the Rsbuild plugin
  return {
    name: 'android-permissions-plugin',

    setup(api) {
      // Modify the Rspack config to include our AST plugin
      api.modifyRspackConfig((config) => {
        // Add the AST plugin to the configuration
        config.plugins = config.plugins || [];
        config.plugins.push(astPlugin);
        return config;
      });

      // Generate AndroidManifest.xml after build
      api.onAfterBuild(() => {
        const manifest = parseManifestPerms();
        const permissionMap = new Map<string, PermissionInfo>();

        // Create a map for lookup
        manifest.permissions.forEach((permInfo) => {
          permissionMap.set(permInfo.constantValue, permInfo);
        });

        // Create AndroidManifest.xml with required permissions
        const requiredPermissions: PermissionInfo[] = [];

        // Process detected permissions
        for (const permName of detectedPermissions) {
          const permInfo = permissionMap.get(permName);

          if (permInfo) {
            // Handle deprecated permissions according to build config
            if (permInfo.deprecated && permInfo.replacement) {
              const replacementInfo = permissionMap.get(permInfo.replacement);

              if (replacementInfo) {
                const action =
                  options.injectionRules.deprecationHandling.action;

                if (action === 'replace') {
                  logger.warn(
                    `Permission ${permName} is deprecated. Using ${permInfo.replacement} instead.`,
                  );
                  requiredPermissions.push(replacementInfo);
                } else {
                  // Keep the original but warn
                  logger.warn(
                    `Permission ${permName} is deprecated but kept as requested.`,
                  );
                  requiredPermissions.push(permInfo);
                }
              } else {
                logger.warn(
                  `Permission ${permName} is deprecated but replacement ${permInfo.replacement} not found.`,
                );
                requiredPermissions.push(permInfo);
              }
            } else {
              requiredPermissions.push(permInfo);
            }
          } else {
            logger.error(`Unknown permission requested: ${permName}`);
          }
        }

        manifest.permissions.forEach((permInfo) => {
          // Skip if already included
          if (requiredPermissions.some((p) => p.name === permInfo.name)) {
            return;
          }

          // Check if it should be auto-injected
          if (
            permInfo.required.autoInject &&
            options.injectionRules.autoAdd.protectionLevels.includes(
              permInfo.protectionLevel[0],
            )
          ) {
            requiredPermissions.push(permInfo);
          }
        });

        // Generate the AndroidManifest.xml content
        let manifestContent = '<?xml version="1.0" encoding="utf-8"?>\n';
        manifestContent +=
          '<manifest xmlns:android="http://schemas.android.com/apk/res/android"\n';
        manifestContent += '    package="com.example.app">\n\n';

        // Add permissions
        requiredPermissions.forEach((permInfo) => {
          const maxSdkAttribute = permInfo.maxSdk
            ? ` android:maxSdkVersion="${permInfo.maxSdk}"`
            : '';
          manifestContent += `    <uses-permission android:name="${permInfo.constantValue}"${maxSdkAttribute} />\n`;
        });

        manifestContent += '\n    <application\n';
        manifestContent += '        android:allowBackup="true"\n';
        manifestContent += '        android:icon="@mipmap/ic_launcher"\n';
        manifestContent += '        android:label="@string/app_name"\n';
        manifestContent +=
          '        android:roundIcon="@mipmap/ic_launcher_round"\n';
        manifestContent += '        android:supportsRtl="true"\n';
        manifestContent += '        android:theme="@style/AppTheme">\n';
        manifestContent +=
          '        <!-- Activities, services, etc. would go here -->\n';
        manifestContent += '    </application>\n\n';
        manifestContent += '</manifest>';

        // Write the AndroidManifest.xml file
        const outputPath = path.resolve(
          api.context.distPath,
          'AndroidManifest.xml',
        );
        try {
          fs.writeFileSync(outputPath, manifestContent);
          logger.info(
            `Generated AndroidManifest.xml with ${requiredPermissions.length} permissions at: ${outputPath}`,
          );
        } catch (error) {
          logger.error('Failed to write AndroidManifest.xml:', error);
        }
      });
    },
  };
}
