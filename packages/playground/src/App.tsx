import { useCallback, useEffect, useState } from '@lynx-js/react';

import './App.css';
import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';
import { useDeviceInfo } from './mods/deviceInfo.js';

/**
 * Dev-only diagnostic: verifies the in-engine "network" Node-API addon is
 * wired up (built via the engine CMake, aligned with the upstream addon
 * model). `requireNodeAddon` is a @LynxMethod on the module registered as
 * "LynxNodeAPI". Rendered only in development builds so it never ships in
 * production UI.
 */
function AddonCheck() {
  const [addonResult, setAddonResult] = useState<string>('(addon not loaded)');

  useEffect(() => {
    try {
      const mod = NativeModules.LynxNodeAPI;
      if (!mod || typeof mod.requireNodeAddon !== 'function') {
        setAddonResult('LynxNodeAPI.requireNodeAddon not available');
        return;
      }
      mod.requireNodeAddon('network');
      const exports = __lynx_node_addon_exports__['network'];
      const result = exports
        ? (exports.foo as () => unknown)()
        : '(no exports)';
      setAddonResult(`network addon: ${result}`);
    } catch (e) {
      const err = e as Error;
      setAddonResult(`addon error: ${err.message ?? String(e)}`);
      console.error('[addon] error', err.stack ?? String(e));
    }
  }, []);

  return <text className="Description">{addonResult}</text>;
}

export function App() {
  const [alterLogo, setAlterLogo] = useState(false);

  useEffect(() => {
    console.info('Hello, ReactLynx');
  }, []);

  const onTap = useCallback(() => {
    'background only';
    setAlterLogo(!alterLogo);
  }, [alterLogo]);

  const { info, loading, error } = useDeviceInfo();

  const requestPermission = () => {
    const permModule = NativeModules.NativePermissionsModule;
    if (!permModule) {
      console.warn(
        'NativePermissionsModule is not available in this Lynx engine build; permission request skipped.',
      );
      return;
    }
    // Qualified form with a string-literal permission so the
    // android-permissions build plugin can detect it and inject it into
    // AndroidManifest.xml. The detector matches the fully-qualified
    // `NativeModules.NativePermissionsModule.requestPermission("<literal>")` call.
    NativeModules.NativePermissionsModule.requestPermission(
      'android.permission.ACCESS_BLOBS_ACROSS_USERS',
      'demo request',
    );
    permModule.requestLocationPermission();
  };

  return (
    <view>
      <view className="Background" />
      <view className="App">
        <view className="Banner">
          <view className="Logo" bindtap={requestPermission}>
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

          <text className="Description">
            {loading
              ? 'Loading device info…'
              : error
                ? `Device info error: ${error.message}`
                : JSON.stringify(info, null, 2)}
          </text>
          {import.meta.env.DEV ? <AddonCheck /> : null}
        </view>
        <view style={{ flex: 1 }}></view>
      </view>
    </view>
  );
}
