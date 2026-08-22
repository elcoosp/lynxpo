import { root, useState } from '@lynx-js/react';
import { useBatteryInfo } from './mods/batteryInfo.js';
import { useDeviceInfo } from './mods/deviceInfo.js';
import { useEnvInfo } from './mods/envInfo.js';
import { useLocalizationInfo } from './mods/localizationInfo.js';
import { useNetworkInfo } from './mods/networkInfo.js';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <view>
      <text>
        {label}: {value}
      </text>
    </view>
  );
}

const s = (v: unknown): string =>
  v === null || v === undefined ? '—' : String(v);

export function HostShowcase() {
  const { info: device, error: deviceError } = useDeviceInfo();
  const { info: env, error: envError } = useEnvInfo();
  const { info: battery, error: batteryError } = useBatteryInfo();
  const { rows: networkRows, error: networkErr } = useNetworkInfo();
  const { info: localization, error: localizationErr } = useLocalizationInfo();
  const [n, setN] = useState(0);

  const deviceRows = device
    ? [
        { label: 'Brand', value: s(device.brand) },
        { label: 'Model', value: s(device.modelName) },
        { label: 'OS', value: `${s(device.osName)} ${s(device.osVersion)}` },
        { label: 'Type', value: s(device.deviceType) },
      ]
    : [];

  const envRows = env
    ? [
        {
          label: 'Running on device',
          value: env.isRunningOnDevice === true ? 'Yes' : 'No (sim)',
        },
        { label: 'App id', value: s(env.appId) },
        { label: 'OS', value: `${s(env.osName)} ${s(env.osVersion)}` },
      ]
    : [];

  const batteryRows = battery
    ? [
        {
          label: 'Level',
          value:
            battery.batteryLevel >= 0
              ? `${Math.round(battery.batteryLevel * 100)}%`
              : 'Unavailable',
        },
        { label: 'State', value: s(battery.batteryState) },
      ]
    : [];

  const locRows = localization?.primaryLocale
    ? [
        { label: 'Language', value: s(localization.primaryLocale.languageTag) },
        { label: 'Region', value: s(localization.primaryLocale.regionCode) },
        { label: 'Time zone', value: s(localization.timeZone) },
      ]
    : [];

  return (
    <view>
      <text>LynxPo — Standalone Host ({n} modules verified)</text>
      <text>Device (expo-device)</text>
      {deviceError ? (
        <text>err: {deviceError.message}</text>
      ) : (
        deviceRows.map((r, i) => (
          <Row key={`d${i}`} label={r.label} value={r.value} />
        ))
      )}
      <text>EnvInfo (expo-env-info)</text>
      {envError ? (
        <text>err: {envError.message}</text>
      ) : (
        envRows.map((r, i) => (
          <Row key={`e${i}`} label={r.label} value={r.value} />
        ))
      )}
      <text>Battery (expo-battery)</text>
      {batteryError ? (
        <text>err: {batteryError.message}</text>
      ) : (
        batteryRows.map((r, i) => (
          <Row key={`b${i}`} label={r.label} value={r.value} />
        ))
      )}
      <text>Network (expo-network)</text>
      {networkErr ? (
        <text>err: {networkErr.message}</text>
      ) : (
        (networkRows ?? []).map((r, i) => (
          <Row key={`n${i}`} label={r.label} value={r.value} />
        ))
      )}
      <text>Localization (expo-localization)</text>
      {localizationErr ? (
        <text>err: {localizationErr.message}</text>
      ) : (
        locRows.map((r, i) => (
          <Row key={`l${i}`} label={r.label} value={r.value} />
        ))
      )}
      <text>tap count: {n}</text>
    </view>
  );
}

root.render(<HostShowcase />);
