<div align="center">
  <img src="docs/logo.png" alt="Lynxpo Logo" width="200"/>
  <p>
    <strong>lynxpo</strong> — A pnpm + Turborepo monorepo that ports Expo / React‑Native native APIs into <a href="https://lynxjs.org">Lynx</a>, so they run inside <strong>LynxExplorer</strong> — not the iOS Simulator or the Android‑via‑ADB Expo path.<br/>
    Each capability ships as a twin‑native module (Kotlin + Swift) wrapped by a React‑Lynx surface and exercised in a live playground.
  </p>
  <p>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D20.19-339933?style=flat-square&logo=node.js" alt="Node"/></a>
    <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-2.11.10-EF4444?style=flat-square&logo=turbo" alt="Turborepo"/></a>
    <a href="https://biomejs.dev"><img src="https://img.shields.io/badge/Biome-2.6.4-60A5FA?style=flat-square" alt="Biome"/></a>
    <a href="https://lynxjs.org"><img src="https://img.shields.io/badge/Lynx-Explorer-F7B500?style=flat-square" alt="Lynx"/></a>
    <a href="./packages/modules"><img src="https://img.shields.io/badge/modules-66-8B5CF6?style=flat-square" alt="Modules"/></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0-84C341?style=flat-square" alt="License"/></a>
    <a href="https://github.com/elcoosp/lynxpo/tree/main"><img src="https://img.shields.io/badge/branch-main-2EA043?style=flat-square" alt="Branch"/></a>
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
│   ├── modules/        # 66 native modules (mods-*) — twin Android + iOS, npm-publishable
│   ├── playground/     # React-Lynx app that demos every module on device
│   └── core/
│       └── core-kt/    # Android Kotlin core — native, non-npm
├── docs/
│   └── permissions/    # frozen Android/Apple permission reference data
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

### Toolchain

lynxpo uses the official Lynx toolchain only: `@lynx-js/rspeedy` (+ the
`react-rsbuild-plugin` / `qrcode-rsbuild-plugin`), `@lynx-js/autolink-codegen`
for library codegen, the Autolink host plugins (`org.lynxsdk.lynx.library-build`,
`cocoapods-lynx-library` gem) for consumption, and pre-built LynxExplorer as
the dev sandbox.

TypeScript is pinned to `6.0.x`: Rspeedy `0.18` supports `5.1.6 - 6.0.x`, and
TypeScript 7's native compiler no longer exposes the compiler API Rspeedy uses
at build time.

### Playground (`packages/playground`)

A React-Lynx app (`@lynxpo/playground`) that renders every module's API on a scrollable demo grid and as native LynxUI custom elements, so each port is verifiable on real hardware through LynxExplorer. It builds several entry points, each exercising a different slice of the surface:

- `main` — the full showcase (`ModsShowcase` + `CameraShowcase`)
- `hostshowcase` — the standalone-host dashboard, listing every module + method with on-device invocation
- `hostdemo`, `hostmin`, `hostsingle`, `hostsync` — progressively smaller host verification apps used to isolate engine/bridge behavior

## Getting started

Prerequisites:

- Node.js `>=20.19` (the root allows `>=18`; the playground build requires `20.19+`)
- pnpm `12.16.1` (enforced via `packageManager`)
- A pre-built [LynxExplorer](https://lynxjs.org/guide/start/quick-start.html) for live verification (no native toolchain required — see below)

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

### Dev sandbox (no native toolchain required)

1. `pnpm dev` — rspeedy prints a QR code and a bundle URL.
2. Get LynxExplorer **pre-built** (official quick start):
   - iOS Simulator: download `LynxExplorer-arm64.app.tar.gz` (or x86_64) from
     the Lynx GitHub Releases, then
     `mkdir -p LynxExplorer-arm64.app && tar -zxf LynxExplorer-arm64.app.tar.gz -C LynxExplorer-arm64.app`
     and drag the `.app` into the Simulator.
   - Android: install the pre-built APK from the same GitHub Release
     (or the community Play Store build).
   - HarmonyOS: `hdc install lynx_explorer-default-unsigned.hap`.
3. Paste the bundle URL into Explorer ("Enter Card URL") — or scan the QR.
   The playground's QR schema adds `?fullscreen=true&enable_napi_addon=true`,
   which keeps working with the pre-built app (it is how the iOS launcher
   spins up the background Node-API runtime).
4. For in-repo host testing (registry + your modules): `pnpm host:ios` —
   LynxpoHost is this repo's own, checkout-free host app.

Version discipline: keep Explorer, pods, and Maven artifacts on the **same
minor** (4.2.0) — bundles must match the host engine version (`engineVersion`);
pinning one line in `Podfile` + `libs.versions.toml` + choosing the matching
Explorer release is the whole rule.

## Command mapping (former `lynxpo` CLI)

The legacy `lynxpo` DX CLI has been removed in favour of the official Lynx
tooling:

| Was | Now |
| --- | --- |
| `lynxpo perms` | Data is frozen under `docs/permissions/`; no regeneration step exists |
| `lynxpo types` | `npx lynx-autolink-codegen` inside a module (reads `lynx.lib.json` + `types/`) |
| `lynxpo build` | `pnpm build` (turbo → rslib/rspeedy) |
| `lynxpo inject` | Nothing — autolink reads `node_modules` |
| `lynxpo ios`/`android` | `pnpm dev` → scan the QR with pre-built LynxExplorer ([quick start](https://lynxjs.org/guide/start/quick-start.html)) |
| `lynxpo doctor` | Removed with the vendored engine tree |

### Host app helpers

- `pnpm host:bundle:copy` — copy the built `hostshowcase` bundle into LynxpoHost.
- `pnpm host:ios` — copy the bundle and build/run LynxpoHost in the iOS Simulator.

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
- Native twins are discovered through **Lynx Autolink**: host plugins scan
  installed npm packages for `lynx.lib.json`, so no install-time copy step is
  needed.
- TS bindings and native specs are generated by **`@lynx-js/autolink-codegen`**
  from `types/index.d.ts` into `src/generated/` (the official TS-first flow).
- Every module declares `@lynx-js/react` as a peer dependency (and
  `@lynx-js/types` for development); many set `"lynx": { "mainThread": "true" }`
  so the module runs on the UI thread.

### A typical module's API surface

Each module exposes a paired `getX` / `useX` accessor per native method. For
async methods (`Promise` in Kotlin), the generated hook returns
`{ value, loading, error }`; for sync getters it returns the raw value. This is
why consumers consistently write:

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

Tooling: **Biome 2** for lint/format, **Turborepo 2** for task orchestration, **Rspeedy / Rsbuild** for the playground, **rslib** for module builds.

## Adding a module

1. Scaffold `packages/modules/<name>` with the twin-native layout above.
2. Implement the Kotlin module (`android/`) and Objective-C module (`ios/`); describe the surface in `lynx.lib.json`.
3. Run `npx lynx-autolink-codegen` to generate the TS bindings, then write the React-Lynx surface in `src/index.ts`.
4. Add a demo entry to the playground so it is verifiable in LynxExplorer.
5. Run `pnpm --filter @lynxpo/playground dev` to exercise it live; hosts pick up the twins through autolink (`lynx.lib.json`).

> **Tip:** If the module needs a permission, add it to `playground/perms-doc/perms.json` and reference it via `NativeModules.NativePermissionsModule.requestPermission("<literal>")` — the `android-permissions` plugin detects the fully-qualified call during the build and injects the `<uses-permission>` entry into the generated `AndroidManifest.xml`.

## Links

- Repository: https://github.com/elcoosp/lynxpo
- Lynx: https://lynxjs.org
- LynxExplorer quick start: https://lynxjs.org/guide/start/quick-start.html
- Expo modules (the surface being ported): https://docs.expo.dev/modules/
