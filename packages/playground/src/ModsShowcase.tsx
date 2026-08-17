import { useCallback, useState } from '@lynx-js/react';
import {
  getGetNetworkStateAsync,
  useGetNetworkStateAsync,
} from '@lynxpo/mods-network';
import { useApplicationInfo } from './mods/applicationInfo.js';
import { batteryStateLabel, useBatteryInfo } from './mods/batteryInfo.js';
import { useBrightnessInfo } from './mods/brightnessInfo.js';
import { useCellularInfo } from './mods/cellularInfo.js';
import { useClipboardInfo } from './mods/clipboardInfo.js';
import { useDeviceInfo } from './mods/deviceInfo.js';
import { useHapticsInfo } from './mods/hapticsInfo.js';
import { useImagePickerInfo } from './mods/imagePickerInfo.js';
import { useKeepAwakeInfo } from './mods/keepAwakeInfo.js';
import { useLocalizationInfo } from './mods/localizationInfo.js';
import { useMailComposerInfo } from './mods/mailComposerInfo.js';
import { useNetworkInfo } from './mods/networkInfo.js';
import { useScreenOrientationInfo } from './mods/screenOrientationInfo.js';
import { useStoreReviewInfo } from './mods/storeReviewInfo.js';

interface Row {
  label: string;
  value: string;
}

function ModuleCard({
  title,
  source,
  icon,
  rows,
  actions,
}: {
  title: string;
  source: string;
  icon: string;
  rows: Row[];
  actions?: { label: string; onPress: () => void }[];
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
      {actions && actions.length > 0 && (
        <view className="Card__Actions">
          {actions.map((a, i) => (
            <view
              className="Card__Action"
              key={`${a.label}-${i}`}
              bindtap={a.onPress}
            >
              <text className="Card__ActionLabel">{a.label}</text>
            </view>
          ))}
        </view>
      )}
    </view>
  );
}

export function ModsShowcase() {
  const { info: device, error: deviceError } = useDeviceInfo();
  const { info: app, error: appError } = useApplicationInfo();
  const { info: battery, error: batteryError } = useBatteryInfo();
  const { info: localization, error: localizationError } =
    useLocalizationInfo();
  const { rows: brightnessRows, error: brightnessErr } = useBrightnessInfo();
  const { rows: cellularRows, error: cellularErr } = useCellularInfo();
  const { rows: hapticsRows, error: hapticsErr } = useHapticsInfo();
  const { rows: keepAwakeRows, error: keepAwakeErr } = useKeepAwakeInfo();
  const { rows: storeReviewRows, error: storeReviewErr } = useStoreReviewInfo();
  const { rows: mailComposerRows, error: mailComposerErr } =
    useMailComposerInfo();
  const { rows: networkRows, error: networkErr } = useNetworkInfo();
  const {
    value: networkAsync,
    loading: networkAsyncLoading,
    error: networkAsyncErr,
  } = useGetNetworkStateAsync();
  const { rows: screenOrientationRows, error: screenOrientationErr } =
    useScreenOrientationInfo();
  const {
    rows: clipboardRows,
    error: clipboardErr,
    actions: clipboardActions,
  } = useClipboardInfo();
  const {
    rows: imagePickerRows,
    error: imagePickerErr,
    actions: imagePickerActions,
  } = useImagePickerInfo();
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

  const localizationRows: Row[] = localization?.primaryLocale
    ? [
        {
          label: 'Language',
          value: localization.primaryLocale.languageTag ?? '—',
        },
        {
          label: 'Region',
          value: localization.primaryLocale.regionCode ?? '—',
        },
        {
          label: 'Currency',
          value:
            localization.primaryLocale.currencySymbol &&
            localization.primaryLocale.currencyCode
              ? `${localization.primaryLocale.currencySymbol} (${localization.primaryLocale.currencyCode})`
              : '—',
        },
        {
          label: 'Text direction',
          value: localization.primaryLocale.textDirection ?? '—',
        },
        {
          label: 'Measurement',
          value: localization.primaryLocale.measurementSystem ?? '—',
        },
        { label: 'Time zone', value: localization.timeZone ?? '—' },
        {
          label: '24-hour clock',
          value: localization.uses24hourClock ? 'Yes' : 'No',
        },
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

      <scroll-view className="Showcase__List" scroll-orientation="vertical">
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
        <ModuleCard
          title="Localization"
          source="expo-localization"
          icon="🌐"
          rows={
            localizationError
              ? [{ label: 'Error', value: localizationError.message }]
              : localizationRows
          }
        />
        <ModuleCard
          title="Brightness"
          source="expo-brightness"
          icon="💡"
          rows={
            brightnessErr
              ? [{ label: 'Error', value: brightnessErr.message }]
              : brightnessRows
          }
        />
        <ModuleCard
          title="Cellular"
          source="expo-cellular"
          icon="📶"
          rows={
            cellularErr
              ? [{ label: 'Error', value: cellularErr.message }]
              : cellularRows
          }
        />
        <ModuleCard
          title="Haptics"
          source="expo-haptics"
          icon="🔔"
          rows={
            hapticsErr
              ? [{ label: 'Error', value: hapticsErr.message }]
              : hapticsRows
          }
        />
        <ModuleCard
          title="Keep Awake"
          source="expo-keep-awake"
          icon="👁️"
          rows={
            keepAwakeErr
              ? [{ label: 'Error', value: keepAwakeErr.message }]
              : keepAwakeRows
          }
        />
        <ModuleCard
          title="Store Review"
          source="expo-store-review"
          icon="⭐"
          rows={
            storeReviewErr
              ? [{ label: 'Error', value: storeReviewErr.message }]
              : storeReviewRows
          }
        />
        <ModuleCard
          title="Mail Composer"
          source="expo-mail-composer"
          icon="✉️"
          rows={
            mailComposerErr
              ? [{ label: 'Error', value: mailComposerErr.message }]
              : mailComposerRows
          }
        />
        <ModuleCard
          title="Network"
          source="expo-network"
          icon="🌍"
          rows={
            networkErr
              ? [{ label: 'Error', value: networkErr.message }]
              : [
                  ...networkRows,
                  {
                    label: 'via Promise (async)',
                    value: networkAsyncErr
                      ? 'err'
                      : networkAsyncLoading
                        ? '…'
                        : networkAsync && networkAsync.isConnected
                          ? 'Yes'
                          : 'No',
                  },
                ]
          }
        />
        <ModuleCard
          title="Screen Orientation"
          source="expo-screen-orientation"
          icon="🔄"
          rows={
            screenOrientationErr
              ? [{ label: 'Error', value: screenOrientationErr.message }]
              : screenOrientationRows
          }
        />
        <ModuleCard
          title="Clipboard"
          source="expo-clipboard"
          icon="📋"
          rows={
            clipboardErr
              ? [{ label: 'Error', value: clipboardErr.message }]
              : clipboardRows
          }
          actions={clipboardActions}
        />
        <ModuleCard
          title="Image Picker"
          source="expo-image-picker"
          icon="🖼️"
          rows={
            imagePickerErr
              ? [{ label: 'Error', value: imagePickerErr.message }]
              : imagePickerRows
          }
          actions={imagePickerActions}
        />
        {batteryLevelPct !== null && (
          <view className="BatteryBar">
            <view
              className="BatteryBar__Fill"
              style={{ width: `${batteryLevelPct}%` }}
            />
          </view>
        )}
      </scroll-view>
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
