import * as fs from 'fs';
import * as path from 'path';

interface ModuleInstallerConfig {
    explorerDir: string;
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
 * Main function to discover and install all native modules
 */
export function installNativeModules(config: ModuleInstallerConfig): void {
    // Determine if we're being called from a monorepo or standalone project
    const initCwd = process.env.INIT_CWD as string
    const isMonorepo = initCwd.includes('packages/');
    // Find the workspace root (if in monorepo)
    const workspaceRoot = isMonorepo ? findWorkspaceRoot(initCwd) : initCwd;

    console.log(`Running in ${isMonorepo ? 'monorepo' : 'standalone project'} mode`);
    console.log(`Workspace root: ${workspaceRoot}`);
    console.log(`Current directory: ${initCwd}`);

    // Resolve explorer directory - this is where modules will be installed
    const resolvedExplorerDir = path.isAbsolute(config.explorerDir)
        ? config.explorerDir
        : path.resolve(workspaceRoot, config.explorerDir);

    console.log(`Resolved explorer directory: ${resolvedExplorerDir}`);

    // Check if the explorer directory exists before proceeding
    if (!fs.existsSync(resolvedExplorerDir)) {
        console.error(`Explorer directory not found: ${resolvedExplorerDir}`);
        console.error('Please check the path provided to the installer.');

        // List the available directories to help with debugging
        const parentDir = path.dirname(resolvedExplorerDir);
        if (fs.existsSync(parentDir)) {
            console.error('Available directories:');
            fs.readdirSync(parentDir).forEach(dir => {
                console.error(`- ${dir}`);
            });
        }

        return;
    }

    const defaultConfig: ModuleInstallerConfig = {
        explorerDir: resolvedExplorerDir,
        androidConfig: {
            moduleSource: 'android',
            modulesPath: 'android/lynx_explorer/src/main/java/com/lynx/explorer/modules',
            adapterFiles: ['LynxModuleAdapter.kt', 'LynxModuleAdapter.java'],
            buildGradlePath: 'android/lynx_explorer/build.gradle',
            ...config.androidConfig,
        },
        iosConfig: {
            moduleSource: 'ios',
            modulesPath: 'ios/lynx_explorer/LynxExplorer/modules',
            initFiles: [
                'ios/lynx_explorer/LynxExplorer/LynxInitProcessor.swift',
                'ios/lynx_explorer/LynxExplorer/AppDelegate.swift',
            ],
            ...config.iosConfig,
        },
        typingsPath: config.typingsPath || 'typing.d.ts',
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
        let e = error as { message: string };
        console.error(`Error reading package.json: ${e.message}`);
    }

    // Discover all modules for each platform
    const androidModules = discoverModules(
        path.resolve(packageDir, defaultConfig.androidConfig?.moduleSource as string),
        '.kt',
    );
    const iosModules = discoverModules(
        path.resolve(packageDir, defaultConfig.iosConfig?.moduleSource as string),
        '.swift',
    );

    // Discover build.gradle file in the Android source directory
    const androidSourceDir = path.resolve(packageDir, defaultConfig.androidConfig?.moduleSource as string);
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
            defaultConfig.explorerDir,
            defaultConfig.androidConfig?.modulesPath as string,
        );

        if (androidModules.length > 0) {
            if (!fs.existsSync(androidModulesDir)) {
                console.error(`Android modules directory not found: ${androidModulesDir}`);
                console.error('Available directories in explorer:');
                fs.readdirSync(defaultConfig.explorerDir).forEach(dir => {
                    console.error(`- ${dir}`);
                });
            } else {
                console.log(`Android modules will be installed to: ${androidModulesDir}`);
                installAndroidModules(androidModules, defaultConfig);

                // Process build.gradle if it exists
                if (hasBuildGradle) {
                    const targetBuildGradlePath = path.resolve(
                        defaultConfig.explorerDir,
                        defaultConfig.androidConfig?.buildGradlePath as string
                    );
                    processBuildGradle(buildGradlePath, targetBuildGradlePath, packageName);
                }
            }
        }
    } catch (error) {
        let e = error as { message: string }
        console.error(`Error validating Android modules directory: ${e.message}`);
    }

    try {
        iosModulesDir = path.resolve(
            defaultConfig.explorerDir,
            defaultConfig.iosConfig?.modulesPath as string,
        );

        if (iosModules.length > 0) {
            if (!fs.existsSync(iosModulesDir)) {
                console.error(`iOS modules directory not found: ${iosModulesDir}`);
            } else {
                console.log(`iOS modules will be installed to: ${iosModulesDir}`);
                installIOSModules(iosModules, defaultConfig);
            }
        }
    } catch (error) {
        let e = error as { message: string }
        console.error(`Error validating iOS modules directory: ${e.message}`);
    }

    // Update typing.d.ts with discovered modules
    const allModules = [...extractModuleNames(androidModules), ...extractModuleNames(iosModules)];
    if (allModules.length > 0 && packageName) {
        try {
            updateTypingDefinitions(allModules, defaultConfig.typingsPath as string, packageName, initCwd);
        } catch (error) {
            let e = error as { message: string }
            console.error(`Error updating typing definitions: ${e.message}`);
        }
    }
}

/**
 * Processes the module's build.gradle file and integrates it with the target build.gradle
 */
function processBuildGradle(sourcePath: string, targetPath: string, packageName: string): void {
    if (!fs.existsSync(targetPath)) {
        console.error(`Target build.gradle not found: ${targetPath}`);
        return;
    }

    try {
        console.log(`Processing build.gradle from ${sourcePath}`);
        console.log(`Target build.gradle: ${targetPath}`);

        // Copy the module build.gradle to a location in the explorer project
        const moduleGradleFileName = `${packageName.replace(/[@/]/g, '_')}_module.gradle`;
        const relativeModulePath = path.relative(
            path.dirname(targetPath),
            path.join(path.dirname(targetPath), moduleGradleFileName)
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
            console.log(`Module build.gradle is already applied in the target build.gradle`);
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
        console.log(`Updated ${targetPath} to apply module build.gradle configuration`);

    } catch (error) {
        let e = error as { message: string };
        console.error(`Error processing build.gradle: ${e.message}`);
    }
}

/**
 * Extracts module names from file paths
 */
function extractModuleNames(moduleFiles: string[]): string[] {
    return moduleFiles.map(file => path.basename(file, path.extname(file)));
}

/**
 * Updates typing.d.ts to include the discovered modules
 */
function updateTypingDefinitions(moduleNames: string[], typingsPath: string, packageName: string, initCwd: string): void {
    // Find typing.d.ts
    const typingsFile = path.isAbsolute(typingsPath)
        ? typingsPath
        : path.resolve(initCwd, typingsPath);

    console.log(`Looking for typing definitions file: ${typingsFile}`);

    let typingsContent = '';

    // Check if the file exists
    if (fs.existsSync(typingsFile)) {
        typingsContent = fs.readFileSync(typingsFile, 'utf8');
        console.log(`Found existing typing.d.ts file`);
    } else {
        // Create a basic typing.d.ts file
        typingsContent = '// Generated typing definitions\n\n';
        console.log(`Creating new typing.d.ts file at ${typingsFile}`);
    }

    // Check if NativeModules declaration exists
    if (typingsContent.includes('declare let NativeModules:')) {
        // Update existing NativeModules declaration
        console.log('Updating existing NativeModules declaration');

        // Find where the NativeModules declaration block ends
        const nativeModulesStart = typingsContent.indexOf('declare let NativeModules:');
        const openBracePos = typingsContent.indexOf('{', nativeModulesStart);
        const closeBracePos = findMatchingCloseBrace(typingsContent, openBracePos);

        if (closeBracePos !== -1) {
            // Check which modules are already defined
            const existingContent = typingsContent.substring(openBracePos + 1, closeBracePos).trim();
            const newModuleEntries = moduleNames
                .filter(name => !existingContent.includes(`${name}:`))
                .map(name => `  ${name}: import('${packageName}').${name}`)
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
            console.error('Could not find matching closing brace for NativeModules declaration');
        }
    } else {
        // Create new NativeModules declaration
        console.log('Creating new NativeModules declaration');

        const moduleEntries = moduleNames
            .map(name => `  ${name}: import('${packageName}').${name}`)
            .join(';\n');

        const newDeclaration = `
declare let NativeModules: {
${moduleEntries};
}
`;

        typingsContent += newDeclaration;
        fs.writeFileSync(typingsFile, typingsContent);
        console.log(`Created NativeModules declaration with ${moduleNames.length} module(s)`);
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
                    fs.readFileSync(path.join(currentDir, 'package.json'), 'utf8')
                );

                // If this package.json has workspaces, it's the workspace root
                if (packageJson.workspaces) {
                    return currentDir;
                }
            } catch (e) {
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
): void {
    const modulesDir = path.resolve(
        config.explorerDir,
        config.androidConfig?.modulesPath as string,
    );

    if (!fs.existsSync(modulesDir)) {
        throw new Error(`Android modules directory not found: ${modulesDir}`);
    }

    // Find adapter file
    let adapterFile = null;
    let isKotlin = false;

    for (const adapterName of config.androidConfig?.adapterFiles as string[]) {
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
 * Installs all discovered iOS modules
 */
function installIOSModules(
    moduleFiles: string[],
    config: ModuleInstallerConfig,
): void {
    const modulesDir = path.resolve(
        config.explorerDir,
        config.iosConfig?.modulesPath as string,
    );

    if (!fs.existsSync(modulesDir)) {
        throw new Error(`iOS modules directory not found: ${modulesDir}`);
    }

    // Find iOS init file
    let initProcessorFile = null;

    for (const initFile of config.iosConfig?.initFiles as string[]) {
        const potentialFile = path.resolve(config.explorerDir, initFile);
        if (fs.existsSync(potentialFile)) {
            initProcessorFile = potentialFile;
            break;
        }
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

        // Register the module if init file was found
        if (initProcessorFile) {
            let processorContent = fs.readFileSync(initProcessorFile, 'utf8');

            // Check if module is already registered
            if (!processorContent.includes(moduleName)) {
                processorContent = registerIOSModule(processorContent, moduleName);
                fs.writeFileSync(initProcessorFile, processorContent);
                console.log(`Registered ${moduleName} in Swift init file`);
            } else {
                console.log(
                    `Module ${moduleName} already registered in Swift init file`,
                );
            }
        } else {
            console.log('⚠️ Could not find Swift init file to register the modules.');
            console.log(
                'Please manually register the modules in your Swift init file:',
            );

            for (const moduleFile of moduleFiles) {
                const moduleName = path.basename(moduleFile, path.extname(moduleFile));
                console.log(`globalConfig.register(moduleClass: ${moduleName}.self)`);
            }
        }
    }

    // Xcode project modification instructions
    console.log(
        '\nIMPORTANT: You need to add the module files to your Xcode project:',
    );
    console.log('1. Open your Lynx Explorer Xcode project');
    console.log('2. Right-click on the "modules" group in the project navigator');
    console.log('3. Select "Add Files to [project name]..."');
    console.log('4. Navigate to and select the module files:');

    for (const moduleFile of moduleFiles) {
        console.log(`   - ${path.basename(moduleFile)}`);
    }

    console.log('5. Click "Add"');
}

/**
 * Registers a module in the iOS init file
 */
function registerIOSModule(
    processorContent: string,
    moduleName: string,
): string {
    // Look for setupLynxEnv function or similar
    const setupFunctionRegex = /func setup(?:LynxEnv|Modules|Environment)/;
    const match = setupFunctionRegex.exec(processorContent);

    if (!match) {
        throw new Error(
            'Could not find a suitable location to register the module.',
        );
    }

    // Find the function body
    const funcStartPos = match.index;
    const funcBodyStartPos = processorContent.indexOf('{', funcStartPos) + 1;

    // Insert the registration line
    const registrationCode = `\n        globalConfig.register(moduleClass: ${moduleName}.self)`;
    return (
        processorContent.substring(0, funcBodyStartPos) +
        registrationCode +
        processorContent.substring(funcBodyStartPos)
    );
}

// If this script is run directly (not imported)
const main = () => {
    const args = process.argv.slice(2);


    installNativeModules({
        explorerDir: args[0] ?? "src/lynx/explorer",
        typingsPath: args[1] ?? 'src/typing.d.ts',
    });
};

main();