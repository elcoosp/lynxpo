# @lynxpo/mods-splash-screen

Splash screen native module for Lynx — a port of Expo's `expo-splash-screen`.

## API

- `getStatusAsync()` / `useSplashScreen()` — returns the current splash status
  (`"hidden"` once the Lynx surface is mounted in the explorer).
- `getHideAsync()` — hides the splash (already hidden in the explorer; resolves
  immediately with `"hidden"`).
- `getPreventAutoHideAsync()` — prevents auto-hide (no-op; resolves `null`).

The Lynx Explorer has no native splash screen to control, so these resolve with
the real current state and never block. The module exists so the Expo-compatible
API surface is present and non-blocking on both iOS and Android.
