import { useCallback, useEffect, useState } from '@lynx-js/react';

import './App.css';
import { ModsShowcase } from './ModsShowcase.js';

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
      // The addon global is only defined when the "network" addon actually
      // loaded (built via the engine CMake). On platforms where it isn't
      // wired up (e.g. iOS Explorer without the addon), skip gracefully
      // instead of throwing a ReferenceError into the diagnostic banner.
      const exports =
        typeof __lynx_node_addon_exports__ !== 'undefined'
          ? __lynx_node_addon_exports__['network']
          : undefined;
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

  return <text className="Hint">{addonResult}</text>;
}

export function App() {
  const onTap = useCallback(() => {
    'background only';
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
  }, []);

  return (
    <view className="Screen" bindtap={onTap}>
      <view className="Screen__Inner">
        <ModsShowcase />
        {import.meta.env.DEV ? <AddonCheck /> : null}
      </view>
    </view>
  );
}
