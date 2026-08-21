# @lynxpo/mods-env-info

Environment info native module for Lynx — a port of Expo's `expo-env-info`.

## API

- `getIsRunningOnDevice()` / `useIsRunningOnDevice()` — `true` when running on a
  physical device, `false` on a simulator/emulator.
- `getInstallTime()` / `useInstallTime()` — app install time as epoch millis.
- `getEnvInfo()` / `useEnvInfo()` — a map with `isRunningOnDevice`, `installTime`,
  `osName`, `osVersion`, `appVersion`, `appId`.

## Platforms

- iOS: `EnvInfoModule` (`ios/EnvInfoModule.{h,m}`)
- Android: `EnvInfoModule` (`android/EnvInfoModule.kt`)
