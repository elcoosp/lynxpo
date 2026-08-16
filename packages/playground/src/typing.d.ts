import type { NativeModules as INativeModules } from '@lynx-js/types';
import type { DeviceModule } from '@lynxpo/mods-device';

/** Shape of the native permissions module registered as `NativePermissionsModule`. */
export interface NativePermissionsModule {
  requestPermission(permission: string, reason?: string): void;
  requestLocationPermission(): void;
}

declare global {
  /**
   * The Lynx engine injects the native bridge as a global `NativeModules`
   * object at runtime. Every accessor is optional because a given engine
   * build may not register every module — callers must null-check.
   */
  // eslint-disable-next-line no-var
  var NativeModules: {
    NativePermissionsModule?: NativePermissionsModule;
    NativeDeviceModule?: DeviceModule;
    DeviceModule?: DeviceModule;
    LynxNodeAPI?: {
      requireNodeAddon(name: string): void;
    };
  } & INativeModules;

  /**
   * Populated by the Node-API addon loader after `requireNodeAddon(name)`
   * is called. Keyed by addon name.
   */
  // eslint-disable-next-line no-var
  var __lynx_node_addon_exports__: Record<string, Record<string, unknown>>;
}
