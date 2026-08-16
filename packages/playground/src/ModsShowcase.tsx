import { useCallback, useState } from '@lynx-js/react';
import { useApplicationInfo } from './mods/applicationInfo.js';
import { batteryStateLabel, useBatteryInfo } from './mods/batteryInfo.js';
import { useDeviceInfo } from './mods/deviceInfo.js';

interface Row {
  label: string;
  value: string;
}

function ModuleCard({
  title,
  source,
  icon,
  rows,
}: {
  title: string;
  source: string;
  icon: string;
  rows: Row[];
}) {
  return (
    <view className="Card">
      <view className="Card__Header">
        <text className="Card__Icon">{icon}</text>
        <view className="Card__Heading">
          <text className="Card__Title">{title}</text>
          <text className="Card__Source">ports {source}</text>
        </view>
      </view>
      <view className="Card__Body">
        {rows.map((r, i) => (
          <view className="Row" key={`${r.label}-${i}`}>
            <text className="Row__Label">{r.label}</text>
            <text className="Row__Value">{r.value}</text>
          </view>
        ))}
      </view>
    </view>
  );
}

export function ModsShowcase() {
  const { info: device, error: deviceError } = useDeviceInfo();
  const { info: app, error: appError } = useApplicationInfo();
  const { info: battery, error: batteryError } = useBatteryInfo();
  const [alterLogo, setAlterLogo] = useState(false);

  const onTap = useCallback(() => {
    'background only';
    setAlterLogo(!alterLogo);
  }, [alterLogo]);

  const deviceRows: Row[] = device
    ? [
        { label: 'Brand', value: device.brand ?? '—' },
        { label: 'Model', value: device.modelName ?? '—' },
        {
          label: 'OS',
          value: `${device.osName ?? '—'} ${device.osVersion ?? '—'}`,
        },
        { label: 'API level', value: String(device.platformApiLevel ?? '—') },
        { label: 'Total memory', value: formatBytes(device.totalMemory) },
        { label: 'Device type', value: deviceTypeLabel(device.deviceType) },
      ]
    : [];

  const appRows: Row[] = app
    ? [
        { label: 'Application', value: app.applicationName ?? '—' },
        { label: 'Bundle id', value: app.applicationId ?? '—' },
        { label: 'Version', value: app.nativeApplicationVersion ?? '—' },
        { label: 'Build', value: app.nativeBuildVersion ?? '—' },
        { label: 'Android id', value: app.androidId ?? '—' },
      ]
    : [];

  const batteryLevelPct =
    battery && battery.batteryLevel >= 0
      ? Math.round(battery.batteryLevel * 100)
      : null;

  const batteryRows: Row[] = battery
    ? [
        {
          label: 'Level',
          value: batteryLevelPct !== null ? `${batteryLevelPct}%` : 'Unknown',
        },
        { label: 'State', value: batteryStateLabel(battery.batteryState) },
        { label: 'Low power mode', value: battery.lowPowerMode ? 'On' : 'Off' },
      ]
    : [];

  return (
    <view className="Showcase">
      <view className="Showcase__Header">
        <text className="Showcase__Title">LynxPo</text>
        <text className="Showcase__Subtitle">Native modules on Lynx</text>
        <text className="Showcase__Note">
          Each card ports an Expo module at native API parity — same method
          surface, same values, reused implementation.
        </text>
      </view>

      <view className="Showcase__List">
        <ModuleCard
          title="Device"
          source="expo-device"
          icon="📱"
          rows={
            deviceError
              ? [{ label: 'Error', value: deviceError.message }]
              : deviceRows
          }
        />
        <ModuleCard
          title="Application"
          source="expo-application"
          icon="📦"
          rows={
            appError ? [{ label: 'Error', value: appError.message }] : appRows
          }
        />
        <ModuleCard
          title="Battery"
          source="expo-battery"
          icon="🔋"
          rows={
            batteryError
              ? [{ label: 'Error', value: batteryError.message }]
              : [
                  ...batteryRows,
                  {
                    label: 'Optimization',
                    value: battery?.batteryOptimizationEnabled ? 'On' : 'Off',
                  },
                ]
          }
        />
        {batteryLevelPct !== null && (
          <view className="BatteryBar">
            <view
              className="BatteryBar__Fill"
              style={{ width: `${batteryLevelPct}%` }}
            />
          </view>
        )}
      </view>
    </view>
  );
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—';
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)} GB`;
}

function deviceTypeLabel(type?: number): string {
  const labels = ['Unknown', 'Phone', 'Tablet', 'Desktop', 'TV'];
  return (type !== undefined && labels[type]) || 'Unknown';
}
