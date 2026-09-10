<div align="center">
  <img src="docs/logo.png" alt="Lynxpo Logo" width="200"/>
  <p>
    <strong>lynxpo</strong> — A pnpm + Turborepo monorepo that ports Expo / React‑Native native APIs into <a href="https://lynxjs.org">Lynx</a>, so they run inside <strong>LynxExplorer</strong> — not the iOS Simulator or the Android‑via‑ADB Expo path.<br/>
    Each capability ships as a twin‑native module (Kotlin + Swift) wrapped by a React‑Lynx surface and exercised in a live playground.
  </p>
  <p>
    <a href="https://pnpm.io"><img src="https://img.shields.io/badge/pnpm-11.17.0-FFC43D?style=for-the-badge&logo=pnpm" alt="pnpm"/></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D20.19-339933?style=for-the-badge&logo=node.js" alt="Node"/></a>
    <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-2.4.4-EF4444?style=for-the-badge&logo=turbo" alt="Turborepo"/></a>
    <a href="https://biomejs.dev"><img src="https://img.shields.io/badge/Biome-2.0-60A5FA?style=for-the-badge" alt="Biome"/></a>
    <a href="https://lynxjs.org"><img src="https://img.shields.io/badge/Lynx-Explorer-F7B500?style=for-the-badge" alt="Lynx"/></a>
    <a href="./packages/modules"><img src="https://img.shields.io/badge/modules-66-8B5CF6?style=for-the-badge" alt="Modules"/></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-000000?style=for-the-badge" alt="License"/></a>
    <a href="https://github.com/elcoosp/lynxpo/tree/main"><img src="https://img.shields.io/badge/branch-main-2EA043?style=for-the-badge" alt="Branch"/></a>
  </p>
</div>

---

# lynxpo

## Why lynxpo

Lynx renders React-Lynx on a dual-threaded engine (UI thread + a JS/Lynx thread). Expo's native modules are built for the React-Native bridge, so they are not available to a Lynx app out of the box. lynxpo re-implements those surfaces as real native modules for Lynx — Kotlin on Android, Objective-C / Swift on iOS — and exposes them through a typed React-Lynx API. The result is a single `pnpm` workspace where an Expo-style API (`expo-camera`, `expo-sqlite`, `expo-secure-store`, …) maps to a `@lynxpo/mods-*` package you can drop into a Lynx app and verify live in LynxExplorer.

> **Note:** Every module is a genuine port, not a stub. Where an Expo capability is iOS‑only (Sign in with Apple, Live Photos), the Android twin reports that honestly; where a backend needs a cloud project (Play Integrity tokens), the module says so rather than returning fake data.

## Repository layout

```
lynxpo/
├── packages/
│   ├── modules/        # 66 native modules (mods-*) — twin Android + iOS
│   ├── playground/     # React-Lynx app that demos every module on device
│   ├── tools/          # aps, nmi, dx — codegen + dev ergonomics
│   └── plugins/        # ktts, style-dict-rsbuild-plugin
├── pnpm-workspace.yaml
├── turbo.json
└── biome.json
```

### Modules (`packages/modules`)

66 native modules under the `@lynxpo/mods-*` scope. Each is a real Expo-API port with Kotlin and Objective-C twins. Highlights, grouped by surface:

- **Device & system** — device, battery, brightness, cellular, application, appearance, constants, font, screen-orientation, screen-capture, system-ui, status-bar, navigation-bar, keep-awake, haptics, sensors
- **Media** — camera, image, image-picker, image-manipulator, video, video-thumbnails, audio, live-photo, media-library, music-library, speech, splash-screen
- **Storage & data** — file-system, secure-store, sqlite, asset, blob, crypto, standard-web-crypto, network, network-addons
- **Identity & platform** — apple-authentication, local-authentication, app-integrity, auth-session, tracking-transparency
- **Communication & sharing** — linking, intent-launcher, sms, mail-composer, sharing, print, web-browser, store-review, notifications, quick-actions, receive-sharing, updates, link-preview
- **User data** — contacts, calendar, health, location, document-picker, background-fetch, background-task, task-manager, env-info, localization
- **Expo DOM** — the native `<lynxpo-dom>` LynxUI host view (added on the `v2` branch) that hosts a live WKWebView DOM surface inside Lynx

### Native UI components

`packages/playground` also ships a set of **custom LynxUI native views** that mirror Expo UI surfaces, registered on the host app:

| Tag | Ported from | Backing |
| --- | --- | --- |
| `<linear-gradient>` | expo-linear-gradient | `CAGradientLayer` |
| `<blur-view>` | expo-blur | `UIVisualEffectView` (Core-Image gaussian fallback) |
| `<symbols>` | expo-symbols | SF Symbols via `UIImage(systemName:)` |
| `<checkbox>` | expo-checkbox | drawn box + checkmark / system switch |
| `<mesh-gradient>` | expo-mesh-gradient | `MeshGradient` (iOS 18+) or static fallback |
| `<glass-effect>` | expo-glass-effect | `UIGlassEffect` (iOS 26) or thin material |
| `<image>` | expo-image | `UIImage` from base64 / remote / SF Symbol |
| `<video>` | expo-video | `AVPlayerLayer` |
| `<gl-view>` | expo-gl | Metal-backed `CAMetalLayer` (animated) |
| `<camera-view>` | expo-camera | `AVCaptureVideoPreviewLayer` |
| `<ui-button>` | expo-ui subset | real `UIButton` with `press` event |
| `<widget-card>` | expo-widgets subset | rounded card with tap dispatch |
| `<lynxpo-dom>` | expo-dom | `WKWebView` DOM surface |

### Tools (`packages/tools`)

| Package | Bin | Purpose |
| --- | --- | --- |
| `@lynxpo/tools-dx` | `lynxpo` | Unified local dev experience — perms, types, build, inject, ios, android, doctor |
| `@lynxpo/tools-nmi` | `lynxpo-nmi` | Native Module Installer: discovers and registers module twins into Lynx Explorer (Android + iOS) |
| `@lynxpo/tools-aps` | — | Android / Apple permission scraper — generates the permission manifests the playground consumes |

### Plugins (`packages/plugins`)

- `@lynxpo/plugins-ktts` — generates user-facing TypeScript bindings from a Kotlin native module (`pluginKotlinToTS`), used by the playground build.
- `@lynxpo/style-dict-rsbuild-plugin` — style-dictionary Rsbuild plugin.

### Playground (`packages/playground`)

A React-Lynx app (`@lynxpo/playground`) that renders every module's API on a scrollable demo grid and as native LynxUI custom elements, so each port is verifiable on real hardware through LynxExplorer. It builds several entry points, each exercising a different slice of the surface:

- `main` — the full showcase (`ModsShowcase` + `CameraShowcase`)
- `hostshowcase` — the standalone-host dashboard, listing every module + method with on-device invocation
- `hostdemo`, `hostmin`, `hostsingle`, `hostsync` — progressively smaller host verification apps used to isolate engine/bridge behavior

## Getting started

Prerequisites:

- Node.js `>=20.19` (the root allows `>=18`; the playground build requires `20.19+`)
- pnpm `11.17.0` (enforced via `packageManager`)
- [LynxExplorer](https://lynxjs.org/guide/start/quick-start.html) on a device or simulator for live verification

Install and build:

```bash
pnpm install
pnpm build        # turbo run build — builds every module + playground
```

Run the playground dev server (pinned to port **3100** so it never collides with the Metro/RN bundlers on 8081–8083 or the other vite/rsbuild servers on 3000/3001):

```bash
pnpm --filter @lynxpo/playground dev
```

Scan the QR code printed in the terminal with LynxExplorer. The playground appends `?fullscreen=true&enable_napi_addon=true` to the URL:

> **Important:** `fullscreen` opens the page full-screen, and `enable_napi_addon=true` spins up the iOS background runtime that loads the Node-API addon. Without it, iOS renders every module value as `—` while Android (which enables the addon by default) populates them.

## The `lynxpo` CLI

The DX tool (`@lynxpo/tools-dx`) ships a single `lynxpo` binary with these commands:

| Command | What it does |
| --- | --- |
| `lynxpo perms` | Regenerate permission manifests (aps) |
| `lynxpo types` | Regenerate TypeScript bindings for native modules (ktts) |
| `lynxpo build` | Build the playground bundle and inject native modules |
| `lynxpo inject` | Inject native modules into Lynx Explorer (nmi) |
| `lynxpo ios` | Build, install, launch, and screenshot on the iOS simulator |
| `lynxpo android` | Build, install, launch, and screenshot on the Android emulator |
| `lynxpo doctor` | Environment preflight check |

Run it straight from the repo root (it resolves to `packages/tools/dx/dist/index.js`):

```bash
pnpm dx            # equivalent to node packages/tools/dx/dist/index.js
pnpm dx doctor     # environment report before you start
```

### Environment notes

- **Android** requires Java 11 (`JAVA_HOME=~/jdk11/Contents/Home`). `dx doctor` fails fast if the wrong JDK is active. The Gradle task is scoped to `assembleWithoutSparklingNoasanDebug` to keep the native build's disk footprint small.
- **iOS** requires Xcode and a booted simulator (`xcrun simctl list devices booted`). `dx ios` runs `bundle_install.sh`, builds with `xcodebuild`, installs, launches, and screenshots in one step.
- **Physical Android devices** are preferred over emulators when attached: `dx android` wires an `adb reverse tcp:8137` tunnel so the device reaches the local bundle server over USB rather than the LAN.

## Anatomy of a module

Every `packages/modules/<name>` is a twin-native package:

```
mods-<name>/
├── src/             # React-Lynx surface (index.ts) + generated bindings
├── android/         # Kotlin native module (build.gradle, src/)
├── ios/             # Objective-C native module (.podspec, src/)
├── types/           # generated TS types
├── dist/            # rslib build output (cjs/esm/d.ts)
├── lynx.lib.json    # Lynx library manifest
├── rslib.config.ts  # rslib build config
└── package.json
```

Key conventions (from the real package manifests):

- Built with **rslib** (`rslib build`), emitting CJS + ESM + `.d.ts` under `dist/` with `publishConfig.access: public`.
- Native twins are registered into Lynx Explorer via a `postinstall` hook that runs the **nmi** installer, so a plain `pnpm install` wires the Kotlin/Swift sources for you.
- TS bindings for the Kotlin side are generated by the **ktts** plugin.
- Every module declares `@lynx-js/react` and `@lynx-js/types` as dependencies; many set `"lynx": { "mainThread": "true" }` so the module runs on the UI thread.

### A typical module's API surface

The ktts generator produces a paired `getX` / `useX` accessor for each `@LynxMethod`. For async methods (`Promise` in Kotlin), the generated hook returns `{ value, loading, error }`; for sync getters it returns the raw value. This is why consumers consistently write:

```tsx
import { useCameraPermissionsAsync, getStartCamera } from '@lynxpo/mods-camera';

function Demo() {
  const { value, loading, error } = useCameraPermissionsAsync();
  return <text>{value?.status ?? '—'}</text>;
}
```

## Quality & build pipeline

Root scripts (Turborepo-orchestrated):

```bash
pnpm build        # turbo run build
pnpm check        # turbo run check   (biome check --write, topo order)
pnpm lint         # turbo run lint
pnpm fmt          # turbo run fmt     (biome format --write)
pnpm test         # turbo run test
pnpm test:cov     # turbo run test:cov
pnpm test:watch   # turbo run test:watch (persistent)
```

Tooling: **Biome 2** for lint/format, **Turborepo 2** for task orchestration, **Rspeedy / Rsbuild** for the playground, **rslib** for module builds, **Playwright** for the aps scraper's smoke tests and the style-dict plugin.

## Adding a module

1. Scaffold `packages/modules/<name>` with the twin-native layout above.
2. Implement the Kotlin module (`android/`) and Objective-C module (`ios/`); describe the surface in `lynx.lib.json`.
3. Run `pnpm dx types` to generate the TS bindings, then write the React-Lynx surface in `src/index.ts`.
4. Add a demo entry to the playground so it is verifiable in LynxExplorer.
5. `pnpm dx inject` registers the twins; `pnpm --filter @lynxpo/playground dev` exercises it live.

> **Tip:** If the module needs a permission, add it to `playground/perms-doc/perms.json` and reference it via `NativeModules.NativePermissionsModule.requestPermission("<literal>")` — the `android-permissions` plugin detects the fully-qualified call during the build and injects the `<uses-permission>` entry into the generated `AndroidManifest.xml`.

## Links

- Repository: https://github.com/elcoosp/lynxpo
- Lynx: https://lynxjs.org
- LynxExplorer quick start: https://lynxjs.org/guide/start/quick-start.html
- Expo modules (the surface being ported): https://docs.expo.dev/modules/
