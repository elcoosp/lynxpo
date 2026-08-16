import { useCallback, useEffect, useState } from '@lynx-js/react';

import './App.css';
import {
  useBrand,
  useDeviceType,
  useDeviceYearClass,
  useIsDevice,
  useManufacturer,
  useModelName,
  useOsName,
  useOsVersion,
  usePlatformApiLevel,
  useTotalMemory,
} from '@lynxpo/mods-device';
import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';

export function App() {
  const [alterLogo, setAlterLogo] = useState(false);

  useEffect(() => {
    console.info('Hello, ReactLynx');
  }, []);

  const onTap = useCallback(() => {
    'background only';
    setAlterLogo(!alterLogo);
  }, [alterLogo]);

  // Phase 1 verification: the in-engine "network" Node-API addon (built via the
  // engine CMake, aligned with the upstream addon model). requireNodeAddon is a
  // @LynxMethod on the module registered as "LynxNodeAPI".
  const [addonResult, setAddonResult] = useState<string>('(addon not loaded)');
  useEffect(() => {
    try {
      // @ts-expect-error - NativeModules.LynxNodeAPI is provided by the addon loader.
      const mod = NativeModules.LynxNodeAPI;
      if (!mod || typeof mod.requireNodeAddon !== 'function') {
        setAddonResult('LynxNodeAPI.requireNodeAddon not available');
        return;
      }
      mod.requireNodeAddon('network');
      // @ts-expect-error - global populated by the loader after requireNodeAddon
      const exports = __lynx_node_addon_exports__['network'];
      const result = exports ? exports.foo() : '(no exports)';
      setAddonResult(`network addon: ${result}`);
      console.info('[addon] requireNodeAddon(network) ->', result);
    } catch (e) {
      const err = e as any;
      setAddonResult(
        `addon error: ${err && err.message ? err.message : String(e)}`,
      );
      console.error('[addon] error', err && err.stack ? err.stack : String(e));
    }
  }, []);

  const brand = useBrand();
  const dyc = useDeviceYearClass();
  const manufacturer = useManufacturer();
  const modelName = useModelName();
  const isDevice = useIsDevice();
  const totalMemory = useTotalMemory();
  const deviceType = useDeviceType();
  const osName = useOsName();
  const osVersion = useOsVersion();
  const deviceYearClass = useDeviceYearClass();
  const platformApiLevel = usePlatformApiLevel();
  const getPerm = () => {
    const permModule = NativeModules.NativePermissionsModule;
    if (permModule) {
      const camPerm = permModule.requestLocationPermission();
      console.log(camPerm);
      permModule.requestPermission(
        'android.permission.ACCESS_BLOBS_ACROSS_USERS',
        'because',
      );
    } else {
      console.warn(
        'NativePermissionsModule is not available in this Lynx engine build; permission request skipped.',
      );
    }
  };

  return (
    <view>
      <view className="Background" />
      <view className="App">
        <view className="Banner">
          <view className="Logo" bindtap={getPerm}>
            {alterLogo ? (
              <image src={reactLynxLogo} className="Logo--react" />
            ) : (
              <image src={lynxLogo} className="Logo--lynx" />
            )}
          </view>
          <text className="Title">React</text>
          <text className="Subtitle">on Lynx</text>
        </view>
        <view className="Content">
          <image src={arrow} className="Arrow" />

          <text className="Description">Device infos</text>
          <text className="Description">
            {JSON.stringify(
              {
                brand,
                dyc,
                manufacturer,
                modelName,
                deviceYearClass,
                totalMemory,
                deviceType,
                osName,
                osVersion,
                platformApiLevel,
                isDevice,
              },
              null,
              2,
            )}
          </text>
          <text className="Description">{addonResult}</text>
        </view>
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  );
}
