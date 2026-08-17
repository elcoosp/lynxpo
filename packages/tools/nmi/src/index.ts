// FIXME: override package declaration to match explorer (or user-app name)

import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface ProjectConfig {
  type: 'explorer' | 'user-app';
  android: {
    modulesPath: string;
    buildGradlePath: string;
    adapterFiles: string[];
  };
  ios: {
    modulesPath: string;
    initFiles: string[];
  };
}

interface ModuleInstallerConfig {
  /** Force monorepo vs standalone detection. When omitted, auto-detected. */
  monorepo?: boolean;
  projectType?: 'explorer' | 'user-app';
  androidConfig?: {
    moduleSource?: string;
    modulesPath?: string;
    adapterFiles?: string[];
    buildGradlePath?: string; // Path to the target build.gradle file
  };
  iosConfig?: {
    moduleSource?: string;
    modulesPath?: string;
    initFiles?: string[];
  };
  typingsPath?: string;
}

/**
 * Detects the project configuration based on directory structure
 */
function detectProjectConfig(workspaceRoot: string): ProjectConfig {
  // Check for explorer project. In this monorepo the explorer lives at
  // packages/playground/src/lynx/explorer; support both that and a
  // standalone layout rooted at src/lynx/explorer.
  const candidateRoots = [
    'packages/playground/src/lynx/explorer',
    'src/lynx/explorer',
  ];
  let explorerRoot: string | null = null;
  for (const candidate of candidateRoots) {
    const androidExplorerPath = path.join(
      workspaceRoot,
      `${candidate}/android/lynx_explorer`,
    );
    const iosExplorerPath = path.join(
      workspaceRoot,
      `${candidate}/darwin/ios/lynx_explorer`,
    );
    if (fs.existsSync(androidExplorerPath) && fs.existsSync(iosExplorerPath)) {
      explorerRoot = candidate;
      break;
    }
  }
  if (explorerRoot) {
    return {
      type: 'explorer',
      android: {
        modulesPath:
          explorerRoot +
          '/android/lynx_explorer/src/main/java/com/lynx/explorer/modules',
        buildGradlePath: `${explorerRoot}/android/lynx_explorer/build.gradle`,
        adapterFiles: ['LynxModuleAdapter.kt', 'LynxModuleAdapter.java'],
      },
      ios: {
        modulesPath: `${explorerRoot}/darwin/ios/lynx_explorer/LynxExplorer/modules`,
        // The iOS modules are plain ObjC LynxModules registered in
        // LynxViewShellViewController.m (not the Swift init files).
        initFiles: [
          explorerRoot +
            '/darwin/ios/lynx_explorer/LynxExplorer/LynxViewShellViewController.m',
        ],
      },
    };
  }

  // Detect user-app by finding Application.kt with initLynxEnv()
  const androidUserAppPath = findUserAppAndroidConfig(workspaceRoot);
  if (androidUserAppPath) {
    return {
      type: 'user-app',
      android: {
        modulesPath: path.join(
          androidUserAppPath?.appDir as string,
          'src/main/java',
          androidUserAppPath?.packagePath as string,
          'modules',
        ),
        buildGradlePath: path.join(
          androidUserAppPath?.projectDir as string,
          'app/build.gradle',
        ),
        adapterFiles: [],
      },
      ios: {
        // iOS detection logic can be added similarly
        modulesPath: 'ios/YourApp/modules',
        initFiles: [],
      },
    };
  }

  throw new Error(
    'Unable to detect project type (explorer or user-app). Please check project structure.',
  );
}

/**
 * Finds the Android configuration for a user app project
 */
function findUserAppAndroidConfig(
  workspaceRoot: string,
): { projectDir: string; appDir: string; packagePath: string } | null {
  const androidDir = path.join(workspaceRoot, 'android');
  if (!fs.existsSync(androidDir)) return null;

  // Look for Kotlin projects (e.g., 'android/KotlinMyApp')
  const kotlinProjects = fs
    .readdirSync(androidDir)
    .filter((dir) => dir.startsWith('Kotlin'))
    .map((dir) => path.join(androidDir, dir));

  for (const projectDir of kotlinProjects) {
    const appDir = path.join(projectDir, 'app');
    const javaBase = path.join(appDir, 'src/main/java');
    if (!fs.existsSync(javaBase)) continue;

    // Search for Application.kt files - simulating glob behavior
    const applicationFiles = findFiles(javaBase, (file) =>
      file.endsWith('Application.kt'),
    );

    for (const appFile of applicationFiles) {
      const content = fs.readFileSync(appFile, 'utf8');
      if (content.includes('fun initLynxEnv()')) {
        // Extract package name from file
        const packageMatch = content.match(/package\s+([^\s]+)/);
        if (packageMatch) {
          const packagePath = packageMatch[1].replace(/\./g, '/');
          return { projectDir, appDir, packagePath };
        }
      }
    }
  }
  return null;
}

/**
 * Find files recursively that match a filter function
 */
function findFiles(
  dir: string,
  filterFn: (filename: string) => boolean,
): string[] {
  const results: string[] = [];

  function traverse(currentDir: string) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (filterFn(file)) {
        results.push(fullPath);
      }
    }
  }

  traverse(dir);
  return results;
}

/**
 * Main function to discover and install all native modules
 */
export function installNativeModules(config: ModuleInstallerConfig = {}): void {
  // Determine if we're being called from a monorepo or standalone project.
  // Prefer an explicit config flag; otherwise fall back to a heuristic on
  // INIT_CWD (presence of a "packages/" segment in a pnpm-style workspace).
  const initCwd = (process.env.INIT_CWD as string) ?? process.cwd();
  const isMonorepo = config.monorepo ?? initCwd.includes('packages/');
  // Find the workspace root (if in monorepo)
  const workspaceRoot = isMonorepo ? findWorkspaceRoot(initCwd) : initCwd;

  console.log(
    `Running in ${isMonorepo ? 'monorepo' : 'standalone project'} mode`,
  );
  console.log(`Workspace root: ${workspaceRoot}`);
  console.log(`Current directory: ${initCwd}`);

  // Auto-detect project configuration
  let projectConfig: ProjectConfig;

  try {
    projectConfig = detectProjectConfig(workspaceRoot);
    console.log(`Detected project type: ${projectConfig.type}`);
  } catch (error) {
    const e = error as { message: string };
    console.error(`Error: ${e.message}`);
    console.error(
      'Please check your project structure or provide explicit configuration.',
    );

    // List the available directories to help with debugging
    console.error('Available directories at workspace root:');
    fs.readdirSync(workspaceRoot).forEach((dir) => {
      console.error(`- ${dir}`);
    });

    return;
  }

  const defaultConfig: ModuleInstallerConfig = {
    androidConfig: {
      moduleSource: 'android',
      modulesPath: projectConfig.android.modulesPath,
      adapterFiles: projectConfig.android.adapterFiles,
      buildGradlePath: projectConfig.android.buildGradlePath,
      ...config.androidConfig,
    },
    iosConfig: {
      moduleSource: 'ios',
      modulesPath: projectConfig.ios.modulesPath,
      initFiles: projectConfig.ios.initFiles,
      ...config.iosConfig,
    },
    projectType: projectConfig.type,
    // In a monorepo the playground owns its typing.d.ts (it uses
    // `declare global`), so point nmi at that file. nmi will then skip it
    // (see updateTypingDefinitions) instead of creating a stray root file.
    typingsPath:
      config.typingsPath ||
      (isMonorepo ? 'packages/playground/src/typing.d.ts' : 'typing.d.ts'),
  };

  // Find current package directory (where the modules are located)
  const packageDir = findPackageDir(process.cwd());
  console.log(`Package directory: ${packageDir}`);

  // Get the package name from package.json
  let packageName = '';
  try {
    const packageJsonPath = path.join(packageDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageName = packageJson.name;
      console.log(`Package name: ${packageName}`);
    }
  } catch (error) {
    const e = error as { message: string };
    console.error(`Error reading package.json: ${e.message}`);
  }

  // Discover all modules for each platform
  const androidModules = discoverModules(
    path.resolve(
      packageDir,
      defaultConfig.androidConfig?.moduleSource as string,
    ),
    '.kt',
  );
  // iOS modules are checked in under packages/modules/<name>/ios/ (one ObjC
  // .m/.h pair per ported Expo module). Discover them workspace-wide rather
  // than from a single cwd/ios dir (which doesn't exist in this layout).
  const iosModules = collectIosModuleFiles(workspaceRoot);

  // Discover build.gradle file in the Android source directory
  const androidSourceDir = path.resolve(
    packageDir,
    defaultConfig.androidConfig?.moduleSource as string,
  );
  const buildGradlePath = path.join(androidSourceDir, 'build.gradle');
  const hasBuildGradle = fs.existsSync(buildGradlePath);

  console.log(
    `Discovered ${androidModules.length} Android modules and ${iosModules.length} iOS modules` +
      (hasBuildGradle ? ` with build.gradle configuration` : ''),
  );

  // Validate destination paths before attempting to install
  let androidModulesDir = null;
  let iosModulesDir = null;

  try {
    androidModulesDir = path.resolve(
      workspaceRoot,
      defaultConfig.androidConfig?.modulesPath as string,
    );

    if (androidModules.length > 0) {
      let androidDirReady = true;
      if (!fs.existsSync(androidModulesDir)) {
        // Create modules directory if it doesn't exist
        try {
          fs.mkdirSync(androidModulesDir, { recursive: true });
          console.log(
            `Created Android modules directory: ${androidModulesDir}`,
          );
        } catch (error) {
          console.error(
            `Failed to create Android modules directory: ${androidModulesDir}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          androidDirReady = false;
        }
      }

      if (!androidDirReady) {
        console.error(
          'Skipping Android module installation (target directory unavailable).',
        );
      } else {
        console.log(
          `Android modules will be installed to: ${androidModulesDir}`,
        );

        if (projectConfig.type === 'explorer') {
          installAndroidModules(androidModules, defaultConfig, workspaceRoot);
        } else {
          installUserAppAndroidModules(
            androidModules,
            defaultConfig,
            workspaceRoot,
          );
        }

        // Process build.gradle if it exists
        if (hasBuildGradle) {
          const targetBuildGradlePath = path.resolve(
            workspaceRoot,
            defaultConfig.androidConfig?.buildGradlePath as string,
          );
          processBuildGradle(
            buildGradlePath,
            targetBuildGradlePath,
            packageName,
          );
        }
      }
    }
  } catch (error) {
    const e = error as { message: string };
    console.error(`Error processing Android modules: ${e.message}`);
  }

  try {
    iosModulesDir = path.resolve(
      workspaceRoot,
      defaultConfig.iosConfig?.modulesPath as string,
    );

    if (iosModules.length > 0) {
      if (!fs.existsSync(iosModulesDir)) {
        // Create modules directory if it doesn't exist
        try {
          fs.mkdirSync(iosModulesDir, { recursive: true });
          console.log(`Created iOS modules directory: ${iosModulesDir}`);
        } catch {
          console.error(
            `Failed to create iOS modules directory: ${iosModulesDir}`,
          );
        }
      }

      console.log(`iOS modules will be installed to: ${iosModulesDir}`);

      if (projectConfig.type === 'explorer') {
        installIOSModules(iosModules, defaultConfig, workspaceRoot);
      } else {
        installUserAppIOSModules(iosModules, defaultConfig, workspaceRoot);
      }
    }
  } catch (error) {
    const e = error as { message: string };
    console.error(`Error processing iOS modules: ${e.message}`);
  }

  // Update typing.d.ts with discovered modules
  const allModules = [
    ...extractModuleNames(androidModules),
    ...extractModuleNames(iosModules),
  ];
  if (allModules.length > 0 && packageName) {
    try {
      updateTypingDefinitions(
        allModules,
        defaultConfig.typingsPath as string,
        packageName,
        initCwd,
      );
    } catch (error) {
      const e = error as { message: string };
      console.error(`Error updating typing definitions: ${e.message}`);
    }
  }
}

/**
 * Install Android modules in user-app mode
 */
function installUserAppAndroidModules(
  moduleFiles: string[],
  config: ModuleInstallerConfig,
  workspaceRoot: string,
): void {
  const modulesDir = path.resolve(
    workspaceRoot,
    config.androidConfig?.modulesPath as string,
  );

  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }

  // Process each module
  for (const moduleFile of moduleFiles) {
    const moduleName = path.basename(moduleFile, path.extname(moduleFile));
    const targetFile = path.resolve(
      modulesDir,
      `${moduleName}${path.extname(moduleFile)}`,
    );

    // Copy the module file
    fs.copyFileSync(moduleFile, targetFile);
    console.log(`Copied ${moduleName} to ${targetFile}`);
  }

  console.log(
    '\nIMPORTANT: You need to manually register these modules in your Application class:',
  );
  for (const moduleFile of moduleFiles) {
    const moduleName = path.basename(moduleFile, path.extname(moduleFile));
    console.log(
      `LynxEnv.inst().registerModule("${moduleName}", ${moduleName}::class.java)`,
    );
  }
}

/**
 * Processes the module's build.gradle file and integrates it with the target build.gradle
 */
function processBuildGradle(
  sourcePath: string,
  targetPath: string,
  packageName: string,
): void {
  if (!fs.existsSync(targetPath)) {
    console.error(`Target build.gradle not found: ${targetPath}`);
    return;
  }

  try {
    console.log(`Processing build.gradle from ${sourcePath}`);
    console.log(`Target build.gradle: ${targetPath}`);

    // Back up the target before mutating it, so we can roll back on failure.
    const backupPath = `${targetPath}.nmi.bak`;
    fs.copyFileSync(targetPath, backupPath);

    // Copy the module build.gradle to a location in the explorer project
    const moduleGradleFileName = `${packageName.replace(/[@/]/g, '_')}_module.gradle`;
    const relativeModulePath = path.relative(
      path.dirname(targetPath),
      path.join(path.dirname(targetPath), moduleGradleFileName),
    );

    // Copy the source build.gradle to the explorer's Android directory
    const targetDirPath = path.dirname(targetPath);
    const moduleGradlePath = path.join(targetDirPath, moduleGradleFileName);
    fs.copyFileSync(sourcePath, moduleGradlePath);
    console.log(`Copied module build.gradle to ${moduleGradlePath}`);

    // Read the target build.gradle
    let targetGradleContent = fs.readFileSync(targetPath, 'utf8');

    // Check if the module gradle is already applied
    if (targetGradleContent.includes(`apply from: '${relativeModulePath}'`)) {
      console.log(
        `Module build.gradle is already applied in the target build.gradle`,
      );
      fs.rmSync(backupPath, { force: true });
      return;
    }

    // Add apply from directive to the target build.gradle
    const applyFromLine = `\n// Apply gradle configuration from ${packageName} module\napply from: '${relativeModulePath}'\n`;

    // Find a good place to insert the apply from directive (after all other apply statements)
    const lastApplyIndex = targetGradleContent.lastIndexOf('apply ');
    if (lastApplyIndex !== -1) {
      // Find the end of the line containing the last apply
      const endOfLineIndex = targetGradleContent.indexOf('\n', lastApplyIndex);
      if (endOfLineIndex !== -1) {
        // Insert after this line
        targetGradleContent =
          targetGradleContent.substring(0, endOfLineIndex + 1) +
          applyFromLine +
          targetGradleContent.substring(endOfLineIndex + 1);
      } else {
        // If we can't find the end of line, just append
        targetGradleContent += applyFromLine;
      }
    } else {
      // If no apply statements, insert at the beginning of the file
      targetGradleContent = applyFromLine + targetGradleContent;
    }

    // Write the updated build.gradle
    fs.writeFileSync(targetPath, targetGradleContent);
    console.log(
      `Updated ${targetPath} to apply module build.gradle configuration`,
    );
    fs.rmSync(backupPath, { force: true });
  } catch (error) {
    // Roll back the target build.gradle from the backup if we mutated it.
    const backupPath = `${targetPath}.nmi.bak`;
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, targetPath);
      fs.rmSync(backupPath, { force: true });
      console.error(`Rolled back ${targetPath} from backup after failure.`);
    }
    const e = error as { message: string };
    console.error(`Error processing build.gradle: ${e.message}`);
  }
}

/**
 * Extracts module names from file paths
 */
function extractModuleNames(moduleFiles: string[]): string[] {
  return moduleFiles.map((file) => path.basename(file, path.extname(file)));
}

/**
 * Updates typing.d.ts to include the discovered modules
 */
function updateTypingDefinitions(
  moduleNames: string[],
  typingsPath: string,
  packageName: string,
  initCwd: string,
): void {
  // Find typing.d.ts
  const typingsFile = path.isAbsolute(typingsPath)
    ? typingsPath
    : path.resolve(initCwd, typingsPath);

  console.log(`Looking for typing definitions file: ${typingsFile}`);

  // Never create a stray typing.d.ts (e.g. at the repo root when run from a
  // monorepo). The playground maintains its own typings; leave absent files
  // alone.
  if (!fs.existsSync(typingsFile)) {
    console.log(
      `Skipping typing.d.ts update: ${typingsFile} does not exist ` +
        `(typings are managed by the consuming package).`,
    );
    return;
  }

  const typingsContent = fs.readFileSync(typingsFile, 'utf8');

  // Only manage the simple `declare let NativeModules:` form. The playground's
  // typing.d.ts uses `declare global { var NativeModules: ... }` and is
  // maintained separately, so it must not be clobbered.
  if (!typingsContent.includes('declare let NativeModules:')) {
    console.log(
      'Skipping typing.d.ts update (typings managed via `declare global`).',
    );
    return;
  }
  // Update existing NativeModules declaration
  console.log('Updating existing NativeModules declaration');

  // Find where the NativeModules declaration block ends
  const nativeModulesStart = typingsContent.indexOf(
    'declare let NativeModules:',
  );
  const openBracePos = typingsContent.indexOf('{', nativeModulesStart);
  const closeBracePos = findMatchingCloseBrace(typingsContent, openBracePos);

  if (closeBracePos !== -1) {
    // Check which modules are already defined
    const existingContent = typingsContent
      .substring(openBracePos + 1, closeBracePos)
      .trim();
    const newModuleEntries = moduleNames
      .filter((name) => !existingContent.includes(`${name}:`))
      .map((name) => `  ${name}: import('${packageName}').${name}`)
      .join(';\n');

    if (newModuleEntries) {
      // Add new module entries before the closing brace
      const separator = existingContent.length > 0 ? ';\n' : '';
      const updatedContent =
        typingsContent.substring(0, closeBracePos).trim() +
        (separator + '\n' + newModuleEntries + ';\n') +
        typingsContent.substring(closeBracePos);

      fs.writeFileSync(typingsFile, updatedContent);
      console.log(`Updated typing.d.ts with ${moduleNames.length} module(s)`);
    } else {
      console.log('All modules are already defined in typing.d.ts');
    }
  } else {
    console.error(
      'Could not find matching closing brace for NativeModules declaration',
    );
  }
}

/**
 * Find the position of the matching closing brace
 */
function findMatchingCloseBrace(content: string, openBracePos: number): number {
  let braceCount = 1;
  let pos = openBracePos + 1;

  while (pos < content.length && braceCount > 0) {
    const char = content[pos];
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    pos++;
  }

  return braceCount === 0 ? pos - 1 : -1;
}

/**
 * Finds the workspace root directory in a monorepo
 */
function findWorkspaceRoot(startDir: string): string {
  let currentDir = startDir;

  // Navigate up until we find a package.json or reach the file system root
  while (true) {
    // Check if this is a workspace root
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(path.join(currentDir, 'package.json'), 'utf8'),
        );

        // If this package.json has workspaces, it's the workspace root
        if (packageJson.workspaces) {
          return currentDir;
        }
      } catch (_e) {
        // Continue if we can't parse package.json
      }
    }

    // Move up one directory
    const parentDir = path.dirname(currentDir);

    // If we've reached the file system root, stop
    if (parentDir === currentDir) {
      // Fall back to starting directory if we can't find a workspace root
      return startDir;
    }

    currentDir = parentDir;
  }
}

/**
 * Finds the current package directory (where modules are located)
 */
function findPackageDir(startDir: string): string {
  // If we're in a node_modules directory, find the package directory
  if (startDir.includes('node_modules')) {
    const parts = startDir.split('node_modules');
    // Get the directory after the last 'node_modules'
    let packagePath = parts[parts.length - 1];

    // Remove leading slash and take first directory
    packagePath = packagePath.replace(/^\//, '').split('/')[0];

    // If it's an org package, include the org
    if (packagePath.startsWith('@')) {
      const orgParts = parts[parts.length - 1].replace(/^\//, '').split('/');
      if (orgParts.length >= 2) {
        packagePath = `${orgParts[0]}/${orgParts[1]}`;
      }
    }

    // Locate the package directory
    return path.join(parts[0], 'node_modules', packagePath);
  }

  // If we're not in node_modules, return current directory
  return startDir;
}

/**
 * Discovers all module files in a directory
 */
function discoverModules(sourceDir: string, extension: string): string[] {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Source directory not found: ${sourceDir}`);
    return [];
  }

  return fs
    .readdirSync(sourceDir)
    .filter(
      (file) =>
        file.toLowerCase().endsWith(extension) && file.includes('Module'),
    )
    .map((file) => path.resolve(sourceDir, file));
}

/**
 * Installs all discovered Android modules
 */
function installAndroidModules(
  moduleFiles: string[],
  config: ModuleInstallerConfig,
  workspaceRoot: string,
): void {
  const modulesDir = path.resolve(
    workspaceRoot,
    config.androidConfig?.modulesPath as string,
  );

  if (!fs.existsSync(modulesDir)) {
    throw new Error(`Android modules directory not found: ${modulesDir}`);
  }

  // Find adapter file
  let adapterFile = null;
  let isKotlin = false;

  const adapterFiles = config.androidConfig?.adapterFiles ?? [];
  for (const adapterName of adapterFiles as string[]) {
    const potentialFile = path.resolve(modulesDir, adapterName);
    if (fs.existsSync(potentialFile)) {
      adapterFile = potentialFile;
      isKotlin = adapterName.endsWith('.kt');
      break;
    }
  }

  if (!adapterFile) {
    throw new Error('LynxModuleAdapter not found in either Java or Kotlin');
  }

  // Read the adapter file
  let adapterContent = fs.readFileSync(adapterFile, 'utf8');

  // Process each module
  for (const moduleFile of moduleFiles) {
    const moduleName = path.basename(moduleFile, path.extname(moduleFile));
    const targetFile = path.resolve(
      modulesDir,
      `${moduleName}${path.extname(moduleFile)}`,
    );

    // Copy the module file
    fs.copyFileSync(moduleFile, targetFile);
    console.log(`Copied ${moduleName} to ${targetFile}`);

    // Register module if not already registered
    if (!adapterContent.includes(moduleName)) {
      adapterContent = registerAndroidModule(
        adapterContent,
        moduleName,
        isKotlin,
      );
    } else {
      console.log(
        `Module ${moduleName} already registered in LynxModuleAdapter`,
      );
    }
  }

  // Write the modified adapter file
  fs.writeFileSync(adapterFile, adapterContent);
  console.log('Updated module registrations in LynxModuleAdapter');
}

/**
 * Registers a module in the Android adapter file
 */
function registerAndroidModule(
  adapterContent: string,
  moduleName: string,
  isKotlin: boolean,
): string {
  if (isKotlin) {
    // Handle Kotlin file

    // Add import if not already there
    if (
      !adapterContent.includes(`import com.lynx.explorer.modules.${moduleName}`)
    ) {
      const importPos = adapterContent.lastIndexOf('import');
      const importEndPos = adapterContent.indexOf('\n', importPos);
      adapterContent =
        adapterContent.substring(0, importEndPos) +
        `\nimport com.lynx.explorer.modules.${moduleName}` +
        adapterContent.substring(importEndPos);
    }

    // Add registration in init method
    const initMethodPos = adapterContent.indexOf('fun init(context: Context)');
    if (initMethodPos === -1) {
      throw new Error('init method not found in LynxModuleAdapter.kt');
    }

    const initBodyStartPos = adapterContent.indexOf('{', initMethodPos) + 1;
    const registrationCode = `\n    LynxEnv.inst().registerModule("${moduleName}", ${moduleName}::class.java)`;

    // Insert the registration code after the opening brace of the init method
    adapterContent =
      adapterContent.substring(0, initBodyStartPos) +
      registrationCode +
      adapterContent.substring(initBodyStartPos);
  } else {
    // Handle Java file

    // Add import if not already there
    if (
      !adapterContent.includes(
        `import com.lynx.explorer.modules.${moduleName};`,
      )
    ) {
      const importPos = adapterContent.lastIndexOf('import');
      const importEndPos = adapterContent.indexOf(';', importPos) + 1;
      adapterContent =
        adapterContent.substring(0, importEndPos) +
        `\nimport com.lynx.explorer.modules.${moduleName};` +
        adapterContent.substring(importEndPos);
    }

    // Add registration in Init method
    const initMethodPos = adapterContent.indexOf(
      'public void Init(Context context)',
    );
    if (initMethodPos === -1) {
      throw new Error('Init method not found in LynxModuleAdapter.java');
    }

    const initBodyStartPos = adapterContent.indexOf('{', initMethodPos) + 1;
    const registrationCode = `\n    LynxEnv.inst().registerModule("${moduleName}", ${moduleName}.class);`;

    // Insert the registration code after the opening brace of the Init method
    adapterContent =
      adapterContent.substring(0, initBodyStartPos) +
      registrationCode +
      adapterContent.substring(initBodyStartPos);
  }

  return adapterContent;
}
/**
 * Walks packages/modules/<name>/ios for checked-in ObjC module sources.
 */
function collectIosModuleFiles(workspaceRoot: string): string[] {
  const root = path.join(workspaceRoot, 'packages/modules');
  if (!fs.existsSync(root)) return [];
  const out: string[] = [];
  for (const name of fs.readdirSync(root)) {
    const iosDir = path.join(root, name, 'ios');
    if (!fs.existsSync(iosDir)) continue;
    for (const f of fs.readdirSync(iosDir)) {
      if (f.toLowerCase().endsWith('.m') && f.includes('Module')) {
        out.push(path.resolve(iosDir, f));
      }
    }
  }
  return out;
}

/**
 * Inserts `#import "XModule.h"` after the last existing #import line so the
 * module header sits with the other imports.
 */
function addModuleImport(content: string, moduleName: string): string {
  const importLine = `#import "${moduleName}.h"`;
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*#import\s/.test(lines[i])) lastImportIdx = i;
  }
  if (lastImportIdx === -1) return `${importLine}\n${content}`;
  lines.splice(lastImportIdx + 1, 0, importLine);
  return lines.join('\n');
}

function uuid24(): string {
  return crypto.randomUUID().replace(/-/g, '').toUpperCase().slice(0, 24);
}

/**
 * Adds the given module sources to the LynxExplorer Xcode target (mirrors the
 * manual DeviceModule wiring). Idempotent: skips modules already referenced.
 */
function ensureModulesInXcodeProject(
  pbxPath: string,
  moduleNames: string[],
): void {
  let txt = fs.readFileSync(pbxPath, 'utf8');
  const groupAnchor =
    '\t\t\t\t29593FF631FD44EEBD8E8E00 /* DeviceModule.m */,\n';
  const sourceAnchor =
    '\t\t\t\t40291E286388457AB37272AF /* DeviceModule.m in Sources */,\n';
  if (!txt.includes(groupAnchor) || !txt.includes(sourceAnchor)) {
    console.warn('Could not find pbxproj anchors; skipping module references.');
    return;
  }
  const buildFiles: string[] = [];
  const fileRefs: string[] = [];
  const groupChildren: string[] = [];
  const sources: string[] = [];
  let changed = false;
  for (const mod of moduleNames) {
    // `mod` already ends in "Module" (e.g. ApplicationModule); the source file
    // is `${mod}.m` / `${mod}.h`, so do NOT append another "Module".
    if (txt.includes(`${mod}.m in Sources`)) continue;
    const hRef = uuid24();
    const mRef = uuid24();
    const build = uuid24();
    buildFiles.push(
      `\t\t${build} /* ${mod}.m in Sources */ = {isa = PBXBuildFile; fileRef = ${mRef} /* ${mod}.m */; };`,
    );
    fileRefs.push(
      `\t\t${mRef} /* ${mod}.m */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.objc; path = ${mod}.m; sourceTree = "<group>"; };`,
    );
    fileRefs.push(
      `\t\t${hRef} /* ${mod}.h */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.h; path = ${mod}.h; sourceTree = "<group>"; };`,
    );
    groupChildren.push(`\t\t\t\t${hRef} /* ${mod}.h */,`);
    groupChildren.push(`\t\t\t\t${mRef} /* ${mod}.m */,`);
    sources.push(`\t\t\t\t${build} /* ${mod}.m in Sources */,`);
    changed = true;
  }
  if (!changed) {
    console.log('All modules already referenced in Xcode project.');
    return;
  }
  txt = txt.replace(
    '/* Begin PBXBuildFile section */',
    '/* Begin PBXBuildFile section */\n' + buildFiles.join('\n'),
  );
  txt = txt.replace(
    '/* Begin PBXFileReference section */',
    '/* Begin PBXFileReference section */\n' + fileRefs.join('\n'),
  );
  txt = txt.replace(groupAnchor, groupAnchor + groupChildren.join('\n') + '\n');
  txt = txt.replace(sourceAnchor, sourceAnchor + sources.join('\n') + '\n');
  fs.writeFileSync(pbxPath, txt);
  console.log('Added iOS modules to LynxExplorer Xcode target.');
}

/**
 * Links StoreKit.framework into the main LynxExplorer target (StoreReviewModule
 * needs it). Idempotent.
 */
function ensureStoreKitLinked(pbxPath: string): void {
  let txt = fs.readFileSync(pbxPath, 'utf8');
  const m = /(\w+) \/\* AVFoundation\.framework in Frameworks \*\//.exec(txt);
  const m2 = /(\w+) \/\* AVFoundation\.framework \*\//.exec(txt);
  if (!m || !m2) {
    console.warn(
      'Could not find AVFoundation anchor; skipping framework link.',
    );
    return;
  }
  const avBuild = m[1];
  const avRef = m2[1];

  const linkFramework = (framework: string): void => {
    const inFrameworks = `${framework}.framework in Frameworks`;
    if (txt.includes(inFrameworks)) {
      console.log(`${framework} already linked.`);
      return;
    }
    const build = uuid24();
    const ref = uuid24();
    txt = txt.replace(
      '/* Begin PBXBuildFile section */',
      `/* Begin PBXBuildFile section */\n\t\t${build} /* ${framework}.framework in Frameworks */ = {isa = PBXBuildFile; fileRef = ${ref} /* ${framework}.framework */; };`,
    );
    txt = txt.replace(
      '/* Begin PBXFileReference section */',
      `/* Begin PBXFileReference section */\n\t\t${ref} /* ${framework}.framework */ = {isa = PBXFileReference; lastKnownFileType = wrapper.framework; name = ${framework}.framework; path = System/Library/Frameworks/${framework}.framework; sourceTree = SDKROOT; };`,
    );
    txt = txt.replace(
      `\t\t\t\t${avRef} /* AVFoundation.framework */,\n`,
      `\t\t\t\t${avRef} /* AVFoundation.framework */,\n\t\t\t\t${ref} /* ${framework}.framework */,\n`,
    );
    txt = txt.replace(
      `\t\t\t\t${avBuild} /* AVFoundation.framework in Frameworks */,\n`,
      `\t\t\t\t${avBuild} /* AVFoundation.framework in Frameworks */,\n\t\t\t\t${build} /* ${framework}.framework in Frameworks */,\n`,
    );
    console.log(`Linked ${framework}.framework.`);
  };

  // StoreKit (required by StoreReview module) and Photos (required by the
  // image-picker module's PHPhotoLibrary usage).
  linkFramework('StoreKit');
  linkFramework('Photos');
  fs.writeFileSync(pbxPath, txt);
}

/**
 * Ensures the engine Info.plist declares NSPhotoLibraryUsageDescription,
 * which the image-picker module's PHPhotoLibrary authorization request needs.
 * The engine Info.plist is gitignored, so this must be applied on every run.
 */
function ensurePhotoLibraryUsage(plistPath: string): void {
  if (!fs.existsSync(plistPath)) return;
  let txt = fs.readFileSync(plistPath, 'utf8');
  if (txt.includes('NSPhotoLibraryUsageDescription')) {
    console.log('NSPhotoLibraryUsageDescription already present.');
    return;
  }
  const anchor = 'NSCameraUsageDescription';
  if (!txt.includes(anchor)) {
    console.warn(
      'NSCameraUsageDescription anchor missing; skipping photo usage injection.',
    );
    return;
  }
  const injection =
    '\t<key>NSPhotoLibraryUsageDescription</key>\n' +
    '\t<string>Lynx Explorer uses the photo library to pick images for the native module showcase.</string>\n';
  txt = txt.replace(
    /(<key>NSCameraUsageDescription<\/key>\s*<string>[^<]*<\/string>)/,
    `$1\n${injection}`,
  );
  fs.writeFileSync(plistPath, txt);
  console.log('Injected NSPhotoLibraryUsageDescription.');
}

/**
 * Installs all discovered iOS modules
 */
function installIOSModules(
  moduleFiles: string[],
  config: ModuleInstallerConfig,
  workspaceRoot: string,
): void {
  const modulesDir = path.resolve(
    workspaceRoot,
    config.iosConfig?.modulesPath as string,
  );

  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
    console.log(`Created iOS modules directory: ${modulesDir}`);
  }

  // Copy the module sources (.m and the paired .h) into the engine modules dir.
  for (const moduleFile of moduleFiles) {
    const ext = path.extname(moduleFile);
    const moduleName = path.basename(moduleFile, ext);
    const srcDir = path.dirname(moduleFile);
    for (const e of [ext, '.h']) {
      const src = path.join(srcDir, `${moduleName}${e}`);
      if (fs.existsSync(src)) {
        const targetFile = path.resolve(modulesDir, `${moduleName}${e}`);
        fs.copyFileSync(src, targetFile);
        console.log(`Copied ${moduleName}${e} to ${modulesDir}`);
      }
    }
  }

  const moduleNames = moduleFiles.map((f) => path.basename(f, path.extname(f)));

  // Wire the Xcode target so the copied sources actually compile.
  // The engine project lives at <explorer>/LynxExplorer.xcodeproj, i.e. the
  // "LynxExplorer/modules" suffix of modulesPath is swapped for the .xcodeproj.
  const pbxPath = modulesDir.replace(
    /\/LynxExplorer\/modules$/,
    '/LynxExplorer.xcodeproj/project.pbxproj',
  );
  if (fs.existsSync(pbxPath)) {
    ensureModulesInXcodeProject(pbxPath, moduleNames);
    ensureStoreKitLinked(pbxPath);
  } else {
    console.warn(
      `Xcode project not found at ${pbxPath}; skipping pbxproj edit.`,
    );
  }
  const plistPath = modulesDir.replace(
    /\/LynxExplorer\/modules$/,
    '/LynxExplorer/Info.plist',
  );
  ensurePhotoLibraryUsage(plistPath);

  // Register the modules in the explorer's view controller (ObjC).
  const projectType = config.projectType || 'user-app';
  if (projectType === 'explorer') {
    const initFiles = config.iosConfig?.initFiles ?? [];
    let initProcessorFile: string | null = null;
    for (const initFile of initFiles as string[]) {
      const potentialFile = path.resolve(workspaceRoot, initFile);
      if (fs.existsSync(potentialFile)) {
        initProcessorFile = potentialFile;
        break;
      }
    }
    if (initProcessorFile) {
      let content = fs.readFileSync(initProcessorFile, 'utf8');
      for (const moduleName of moduleNames) {
        if (!content.includes(`#import "${moduleName}.h"`)) {
          content = addModuleImport(content, moduleName);
          console.log(`Added #import "${moduleName}.h"`);
        }
        if (!content.includes(`registerModule:${moduleName}.class`)) {
          content = registerIOSModule(content, moduleName);
          console.log(
            `Registered ${moduleName} in LynxViewShellViewController.m`,
          );
        }
      }
      fs.writeFileSync(initProcessorFile, content);
    } else {
      console.warn(
        '⚠️ Could not find LynxViewShellViewController.m to register the modules.',
      );
    }
  } else {
    console.log(
      '\nIMPORTANT: manually register these modules in your ObjC initialization:',
    );
    for (const moduleName of moduleNames) {
      console.log(`[builder.config registerModule:${moduleName}.class];`);
    }
  }
}

/**
 * Install iOS modules in user-app mode
 */
function installUserAppIOSModules(
  moduleFiles: string[],
  config: ModuleInstallerConfig,
  workspaceRoot: string,
): void {
  const modulesDir = path.resolve(
    workspaceRoot,
    config.iosConfig?.modulesPath as string,
  );

  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir, { recursive: true });
  }

  // Process each module
  for (const moduleFile of moduleFiles) {
    const moduleName = path.basename(moduleFile, path.extname(moduleFile));
    const targetFile = path.resolve(
      modulesDir,
      `${moduleName}${path.extname(moduleFile)}`,
    );

    // Copy the module file
    fs.copyFileSync(moduleFile, targetFile);
    console.log(`Copied ${moduleName} to ${modulesDir}`);
  }

  console.log(
    '\nIMPORTANT: You need to manually register these modules in your Swift initialization:',
  );
  for (const moduleFile of moduleFiles) {
    const moduleName = path.basename(moduleFile, path.extname(moduleFile));
    console.log(`globalConfig.register(moduleClass: ${moduleName}.self)`);
  }

  // Xcode project modification instructions
  console.log(
    '\nIMPORTANT: You need to add the module files to your Xcode project:',
  );
  console.log('1. Open your Xcode project');
  console.log(
    '2. Right-click on the appropriate group in the project navigator',
  );
  console.log('3. Select "Add Files to [project name]..."');
  console.log('4. Navigate to and select the module files:');

  for (const moduleFile of moduleFiles) {
    console.log(`   - ${path.basename(moduleFile)}`);
  }

  console.log('5. Click "Add"');
}
/**
 * Registers a module in the explorer's ObjC view controller.
 * Anchors on the engine's own LynxNodeAPIModule registration (present on a
 * clean checkout) and inserts `[builder.config registerModule:XModule.class];`
 * right after it.
 */
function registerIOSModule(
  processorContent: string,
  moduleName: string,
): string {
  const anchor =
    '[builder.config registerModule:LynxNodeAPIModule.class param:self];';
  const idx = processorContent.indexOf(anchor);
  if (idx === -1) {
    throw new Error(
      'Could not find LynxNodeAPIModule registration anchor in LynxViewShellViewController.m',
    );
  }
  const insertPos = idx + anchor.length;
  const code = `\n    [builder.config registerModule:${moduleName}.class];`;
  return (
    processorContent.slice(0, insertPos) +
    code +
    processorContent.slice(insertPos)
  );
}

// If this script is run directly (not imported)
const main = () => {
  const args = process.argv.slice(2);

  // Only pass an explicit typingsPath if the caller provided one. When omitted,
  // installNativeModules falls back to a monorepo-aware default (the playground's
  // own typing.d.ts) and skips it — never creating a stray root file.
  installNativeModules({
    typingsPath: args[0],
  });
};

main();
