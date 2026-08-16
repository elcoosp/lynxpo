// import {INativeModules} from "@lynx-js/types"
declare let NativeModules: {
  NativePermissionsModule: import('./mods/permissions.js').NativePermissionsModule;

  NativeDeviceModule: import('@lynxpo/mods-device').NativeDeviceModule;

  DeviceModule: import('@lynxpo/mods-device').DeviceModule;
};
