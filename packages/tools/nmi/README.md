# 💡 About the project

Native module installer for [Lynx](https://lynxjs.org)

## ✨ Features

- Install native modules into [Lynx Explorer](https://lynxjs.org/guide/start/quick-start.html)
- Automatic Module Discovery: The script now automatically discovers all module files in the source directories instead of hardcoding specific module names.
- Configurable Paths: All paths are now configurable through a central configuration object, making it easy to adapt to different project structures.
- Unified Interface: A single function handles both Android and iOS module installation with platform-specific logic abstracted away.

## 🎉 Getting started

### How to Use the Script

To install all native modules:

```bash
pnpx @lynxpo/tools-nmi /path/to/explorer
```

To use programmatically with custom configuration:

```ts
import { installNativeModules } from './native-module-installer';
installNativeModules({
  explorerDir: '/path/to/explorer',
  moduleSources: ['src/custom-android', 'src/custom-ios'],
  androidConfig: {
    modulesPath: 'custom/android/path'
  }
});
```

The script will:

- Discover all modules in the source directories
- Copy them to the appropriate target directories
- Register them in the respective adapter files
- Provide instructions for manual steps if needed (e.g., adding files to Xcode)

## 📋 Installation

```sh
npm add @lynxpo/tools-nmi
```

```sh
pnpm add @lynxpo/tools-nmi
```

```sh
yarn add @lynxpo/tools-nmi
```

```sh
deno add npm:@lynxpo/tools-nmi
```

## 🔧 Usage

See getting started.

## 🚀 Roadmap

- Testing

## 💻 Contributing

Any contributions you make are **greatly appreciated**.

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.
