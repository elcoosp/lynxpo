To refactor the module to auto-detect the project type (explorer vs user-app) instead of requiring `explorerDir`, follow these steps:

### 1. **Add Project Type Detection**

Create a function to determine if the project is an explorer or user-app by checking for specific files/directories.

typescript

Copy

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

function detectProjectConfig(workspaceRoot: string): ProjectConfig {
    // Check for explorer project
    const androidExplorerPath = path.join(workspaceRoot, 'android/lynx_explorer');
    const iosExplorerPath = path.join(workspaceRoot, 'ios/lynx_explorer');

    if (fs.existsSync(androidExplorerPath) && fs.existsSync(iosExplorerPath)) {
        return {
            type: 'explorer',
            android: {
                modulesPath: 'android/lynx_explorer/src/main/java/com/lynx/explorer/modules',
                buildGradlePath: 'android/lynx_explorer/build.gradle',
                adapterFiles: ['LynxModuleAdapter.kt', 'LynxModuleAdapter.java']
            },
            ios: {
                modulesPath: 'ios/lynx_explorer/LynxExplorer/modules',
                initFiles: [
                    'ios/lynx_explorer/LynxExplorer/LynxInitProcessor.swift',
                    'ios/lynx_explorer/LynxExplorer/AppDelegate.swift'
                ]
            }
        };
    }

    // Detect user-app by finding Application.kt with initLynxEnv()
    const androidUserAppPath = findUserAppAndroidConfig(workspaceRoot);
    if (androidUserAppPath) {
        return {
            type: 'user-app',
            android: {
                modulesPath: path.join(androidUserAppPath.appDir, 'src/main/java', androidUserAppPath.packagePath, 'modules'),
                buildGradlePath: path.join(androidUserAppPath.projectDir, 'app/build.gradle'),
                adapterFiles: []
            },
            ios: { // iOS detection logic can be added similarly
                modulesPath: 'ios/YourApp/modules',
                initFiles: []
            }
        };
    }

    throw new Error('Unable to detect project type (explorer or user-app)');
}

function findUserAppAndroidConfig(workspaceRoot: string): { projectDir: string; appDir: string; packagePath: string } | null {
    const androidDir = path.join(workspaceRoot, 'android');
    if (!fs.existsSync(androidDir)) return null;

    // Look for Kotlin projects (e.g., 'android/KotlinMyApp')
    const kotlinProjects = fs.readdirSync(androidDir)
        .filter(dir => dir.startsWith('Kotlin'))
        .map(dir => path.join(androidDir, dir));

    for (const projectDir of kotlinProjects) {
        const appDir = path.join(projectDir, 'app');
        const javaBase = path.join(appDir, 'src/main/java');
        if (!fs.existsSync(javaBase)) continue;

        // Search for Application.kt files
        const applicationFiles = glob.sync(`${javaBase}/**/*Application.kt`);
        for (const appFile of applicationFiles) {
            const content = fs.readFileSync(appFile, 'utf8');
            if (content.includes('fun initLynxEnv()')) {
                // Extract package name from file
                const packageMatch = content.match(/packages+([^s]+)/);
                if (packageMatch) {
                    const packagePath = packageMatch[1].replace(/./g, '/');
                    return { projectDir, appDir, packagePath };
                }
            }
        }
    }
    return null;
}

### 2. **Update `ModuleInstallerConfig` and Defaults**

Remove `explorerDir` and use detected paths:

typescript

Copy

interface ModuleInstallerConfig {
    // Removed explorerDir
    androidConfig?: {
        // ... other props
    };
    iosConfig?: {
        // ... other props
    };
    typingsPath?: string;
}

// In installNativeModules():
const projectConfig = detectProjectConfig(workspaceRoot);
const resolvedExplorerDir = workspaceRoot; // Root is now workspace

const defaultConfig = {
    androidConfig: {
        ...projectConfig.android,
        ...config.androidConfig,
    },
    iosConfig: {
        ...projectConfig.ios,
        ...config.iosConfig,
    },
    typingsPath: config.typingsPath || 'typing.d.ts',
};

### 3. **Adjust Path Resolution**

Replace all `config.explorerDir` references with `workspaceRoot` and use `projectConfig` paths:

typescript

Copy

// Before:
androidModulesDir = path.resolve(config.explorerDir, androidConfig.modulesPath);

// After:
androidModulesDir = path.resolve(workspaceRoot, androidConfig.modulesPath);

### 4. **Update iOS Detection (if needed)**

Add similar logic for iOS by checking for `AppDelegate.swift` containing initialization code.

### 5. **Remove `explorerDir` from CLI**

Update the main function to omit `explorerDir`:

typescript

Copy

const main = () => {
    installNativeModules({
        typingsPath: process.argv[2] ?? 'src/typing.d.ts',
    });
};

### Key Changes:

- **Project Detection:** Automatically determines paths based on the presence of explorer files or user-app structure.

- **Dynamic Paths:** Uses detected project structure to set modules/build paths instead of hardcoded values.

- **Error Handling:** Throws clear errors if the project type can’t be detected.


This refactoring removes the need for manual `explorerDir` configuration and makes the module adaptable to different project structures.
