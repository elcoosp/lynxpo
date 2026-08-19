import { useCallback, useState } from '@lynx-js/react';
import {
  getGetNetworkStateAsync,
  useGetNetworkStateAsync,
} from '@lynxpo/mods-network';
import { CameraShowcase } from './CameraShowcase.js';
import { useAppearanceInfo } from './mods/appearanceInfo.js';
import { useApplicationInfo } from './mods/applicationInfo.js';
import { useAudioInfo } from './mods/audioInfo.js';
import { useBackgroundFetchInfo } from './mods/backgroundFetchInfo.js';
import { batteryStateLabel, useBatteryInfo } from './mods/batteryInfo.js';
import { useBrightnessInfo } from './mods/brightnessInfo.js';
import { useCalendarInfo } from './mods/calendarInfo.js';
import { useCameraInfo } from './mods/cameraInfo.js';
import { useCellularInfo } from './mods/cellularInfo.js';
import { useClipboardInfo } from './mods/clipboardInfo.js';
import { useConstantsInfo } from './mods/constantsInfo.js';
import { useContactsInfo } from './mods/contactsInfo.js';
import { useCryptoInfo } from './mods/cryptoInfo.js';
import { useDeviceInfo } from './mods/deviceInfo.js';
import { useFileSystemInfo } from './mods/fileSystemInfo.js';
import { useFontInfo } from './mods/fontInfo.js';
import { useHapticsInfo } from './mods/hapticsInfo.js';
import { useImageInfo } from './mods/imageInfo.js';
import { useImagePickerInfo } from './mods/imagePickerInfo.js';
import { useKeepAwakeInfo } from './mods/keepAwakeInfo.js';
import { useLinkingInfo } from './mods/linkingInfo.js';
import { useLocalAuthenticationInfo } from './mods/localAuthenticationInfo.js';
import { useLocalizationInfo } from './mods/localizationInfo.js';
import { useLocationInfo } from './mods/locationInfo.js';
import { useMailComposerInfo } from './mods/mailComposerInfo.js';
import { useMediaLibraryInfo } from './mods/mediaLibraryInfo.js';
import { useMusicLibraryInfo } from './mods/musicLibraryInfo.js';
import { useNavigationBarInfo } from './mods/navigationBarInfo.js';
import { useNetworkInfo } from './mods/networkInfo.js';
import { useNotificationsInfo } from './mods/notificationsInfo.js';
import { usePrintInfo } from './mods/printInfo.js';
import { useScreenOrientationInfo } from './mods/screenOrientationInfo.js';
import { useSecureStoreInfo } from './mods/secureStoreInfo.js';
import { useSensorsInfo } from './mods/sensorsInfo.js';
import { useSharingInfo } from './mods/sharingInfo.js';
import { useSmsInfo } from './mods/smsInfo.js';
import { useSpeechInfo } from './mods/speechInfo.js';
import { useSqliteInfo } from './mods/sqliteInfo.js';
import { useStatusBarInfo } from './mods/statusBarInfo.js';
import { useStoreReviewInfo } from './mods/storeReviewInfo.js';
import { useSystemUiInfo } from './mods/systemUiInfo.js';
import { useTaskManagerInfo } from './mods/taskManagerInfo.js';
import { useTrackingTransparencyInfo } from './mods/trackingTransparencyInfo.js';
import { useVideoInfo } from './mods/videoInfo.js';
import { useWebBrowserInfo } from './mods/webBrowserInfo.js';

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
  const { rows: cryptoRows, error: cryptoErr } = useCryptoInfo();
  const { rows: localAuthRows, error: localAuthErr } =
    useLocalAuthenticationInfo();
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
  const { rows: sensorsRows, error: sensorsErr } = useSensorsInfo();
  const { rows: secureStoreRows, error: secureStoreErr } = useSecureStoreInfo();
  const { rows: fileSystemRows, error: fileSystemErr } = useFileSystemInfo();
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
  const { rows: constantsRows, error: constantsErr } = useConstantsInfo();
  const {
    rows: fontRows,
    error: fontErr,
    actions: fontActions,
  } = useFontInfo();
  const {
    rows: locationRows,
    error: locationErr,
    actions: locationActions,
  } = useLocationInfo();
  const {
    rows: mediaLibraryRows,
    error: mediaLibraryErr,
    actions: mediaLibraryActions,
  } = useMediaLibraryInfo();
  const {
    rows: contactsRows,
    error: contactsErr,
    actions: contactsActions,
  } = useContactsInfo();
  const { rows: speechRows, error: speechErr } = useSpeechInfo();
  const { rows: webBrowserRows, error: webBrowserErr } = useWebBrowserInfo();
  const { rows: sqliteRows, error: sqliteErr } = useSqliteInfo();
  const {
    rows: cameraRows,
    error: cameraErr,
    actions: cameraActions,
  } = useCameraInfo();
  const {
    rows: notificationsRows,
    error: notificationsErr,
    actions: notificationsActions,
  } = useNotificationsInfo();
  const { rows: imageRows, error: imageErr } = useImageInfo();
  const { rows: videoRows, error: videoErr } = useVideoInfo();
  const { rows: audioRows, error: audioErr } = useAudioInfo();
  const {
    rows: calendarRows,
    error: calendarErr,
    actions: calendarActions,
  } = useCalendarInfo();
  const { rows: sharingRows, error: sharingErr } = useSharingInfo();
  const { rows: printRows, error: printErr } = usePrintInfo();
  const { rows: smsRows, error: smsErr } = useSmsInfo();
  const { rows: navigationBarRows, error: navigationBarErr } =
    useNavigationBarInfo();
  const { rows: statusBarRows, error: statusBarErr } = useStatusBarInfo();
  const { rows: systemUiRows, error: systemUiErr } = useSystemUiInfo();
  const { rows: appearanceRows, error: appearanceErr } = useAppearanceInfo();
  const { rows: taskManagerRows, error: taskManagerErr } = useTaskManagerInfo();
  const { rows: backgroundFetchRows, error: backgroundFetchErr } =
    useBackgroundFetchInfo();
  const { rows: linkingRows, error: linkingErr } = useLinkingInfo();
  const {
    rows: trackingTransparencyRows,
    error: trackingTransparencyErr,
    actions: trackingTransparencyActions,
  } = useTrackingTransparencyInfo();
  const {
    rows: musicLibraryRows,
    error: musicLibraryErr,
    actions: musicLibraryActions,
  } = useMusicLibraryInfo();
  const [alterLogo, setAlterLogo] = useState(false);
  const [page, setPage] = useState<'list' | 'camera'>('list');

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
          // batteryLevel is -1 when unknown (e.g. iOS Simulator, which has no
          // physical battery). Report "Unavailable" rather than a fake %.
          value:
            batteryLevelPct !== null ? `${batteryLevelPct}%` : 'Unavailable',
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

  return page === 'list' ? (
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
          title="Crypto"
          source="expo-crypto"
          icon="🔐"
          rows={
            cryptoErr
              ? [{ label: 'Error', value: cryptoErr.message }]
              : cryptoRows
          }
        />
        <ModuleCard
          title="Local Authentication"
          source="expo-local-authentication"
          icon="🔏"
          rows={
            localAuthErr
              ? [{ label: 'Error', value: localAuthErr.message }]
              : localAuthRows
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
          title="Sensors"
          source="expo-sensors"
          icon="🧭"
          rows={
            sensorsErr
              ? [{ label: 'Error', value: sensorsErr.message }]
              : sensorsRows
          }
        />
        <ModuleCard
          title="Secure Store"
          source="expo-secure-store"
          icon="🛡️"
          rows={
            secureStoreErr
              ? [{ label: 'Error', value: secureStoreErr.message }]
              : secureStoreRows
          }
        />
        <ModuleCard
          title="File System"
          source="expo-file-system"
          icon="🗂️"
          rows={
            fileSystemErr
              ? [{ label: 'Error', value: fileSystemErr.message }]
              : fileSystemRows
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
        <ModuleCard
          title="Constants"
          source="expo-constants"
          icon="📐"
          rows={
            constantsErr
              ? [{ label: 'Error', value: constantsErr.message }]
              : constantsRows
          }
        />
        <ModuleCard
          title="Font"
          source="expo-font"
          icon="🔤"
          rows={
            fontErr ? [{ label: 'Error', value: fontErr.message }] : fontRows
          }
          actions={fontActions}
        />
        <ModuleCard
          title="Location"
          source="expo-location"
          icon="📍"
          rows={
            locationErr
              ? [{ label: 'Error', value: locationErr.message }]
              : locationRows
          }
          actions={locationActions}
        />
        <ModuleCard
          title="Media Library"
          source="expo-media-library"
          icon="🖼️"
          rows={
            mediaLibraryErr
              ? [{ label: 'Error', value: mediaLibraryErr.message }]
              : mediaLibraryRows
          }
          actions={mediaLibraryActions}
        />
        <ModuleCard
          title="Contacts"
          source="expo-contacts"
          icon="👥"
          rows={
            contactsErr
              ? [{ label: 'Error', value: contactsErr.message }]
              : contactsRows
          }
          actions={contactsActions}
        />
        <ModuleCard
          title="Speech"
          source="expo-speech"
          icon="🗣️"
          rows={
            speechErr
              ? [{ label: 'Error', value: speechErr.message }]
              : speechRows
          }
        />
        <ModuleCard
          title="Web Browser"
          source="expo-web-browser"
          icon="🌐"
          rows={
            webBrowserErr
              ? [{ label: 'Error', value: webBrowserErr.message }]
              : webBrowserRows
          }
        />
        <ModuleCard
          title="SQLite"
          source="expo-sqlite"
          icon="🗄️"
          rows={
            sqliteErr
              ? [{ label: 'Error', value: sqliteErr.message }]
              : sqliteRows
          }
        />
        <ModuleCard
          title="Camera"
          source="expo-camera"
          icon="📷"
          rows={
            cameraErr
              ? [{ label: 'Error', value: cameraErr.message }]
              : cameraRows
          }
          actions={[
            {
              label: 'Open live preview →',
              onPress: () => setPage('camera'),
            },
            ...cameraActions,
          ]}
        />
        <ModuleCard
          title="Notifications"
          source="expo-notifications"
          icon="🔔"
          rows={
            notificationsErr
              ? [{ label: 'Error', value: notificationsErr.message }]
              : notificationsRows
          }
          actions={notificationsActions}
        />
        <ModuleCard
          title="Image"
          source="expo-image"
          icon="🖼️"
          rows={
            imageErr ? [{ label: 'Error', value: imageErr.message }] : imageRows
          }
        />
        <ModuleCard
          title="Video"
          source="expo-video"
          icon="🎬"
          rows={
            videoErr ? [{ label: 'Error', value: videoErr.message }] : videoRows
          }
        />
        <ModuleCard
          title="Audio"
          source="expo-audio"
          icon="🔊"
          rows={
            audioErr ? [{ label: 'Error', value: audioErr.message }] : audioRows
          }
        />
        <ModuleCard
          title="Calendar"
          source="expo-calendar"
          icon="📅"
          rows={
            calendarErr
              ? [{ label: 'Error', value: calendarErr.message }]
              : calendarRows
          }
          actions={calendarActions}
        />
        <ModuleCard
          title="Sharing"
          source="expo-sharing"
          icon="📤"
          rows={
            sharingErr
              ? [{ label: 'Error', value: sharingErr.message }]
              : sharingRows
          }
        />
        <ModuleCard
          title="Print"
          source="expo-print"
          icon="🖨️"
          rows={
            printErr ? [{ label: 'Error', value: printErr.message }] : printRows
          }
        />
        <ModuleCard
          title="SMS"
          source="expo-sms"
          icon="💬"
          rows={smsErr ? [{ label: 'Error', value: smsErr.message }] : smsRows}
        />
        <ModuleCard
          title="Navigation Bar"
          source="expo-navigation-bar"
          icon="🧭"
          rows={
            navigationBarErr
              ? [{ label: 'Error', value: navigationBarErr.message }]
              : navigationBarRows
          }
        />
        <ModuleCard
          title="Status Bar"
          source="expo-status-bar"
          icon="📶"
          rows={
            statusBarErr
              ? [{ label: 'Error', value: statusBarErr.message }]
              : statusBarRows
          }
        />
        <ModuleCard
          title="System UI"
          source="expo-system-ui"
          icon="🎨"
          rows={
            systemUiErr
              ? [{ label: 'Error', value: systemUiErr.message }]
              : systemUiRows
          }
        />
        <ModuleCard
          title="Appearance"
          source="expo-appearance"
          icon="🌓"
          rows={
            appearanceErr
              ? [{ label: 'Error', value: appearanceErr.message }]
              : appearanceRows
          }
        />
        <ModuleCard
          title="Task Manager"
          source="expo-task-manager"
          icon="🗂️"
          rows={
            taskManagerErr
              ? [{ label: 'Error', value: taskManagerErr.message }]
              : taskManagerRows
          }
        />
        <ModuleCard
          title="Background Fetch"
          source="expo-background-fetch"
          icon="🔄"
          rows={
            backgroundFetchErr
              ? [{ label: 'Error', value: backgroundFetchErr.message }]
              : backgroundFetchRows
          }
        />
        <ModuleCard
          title="Linking"
          source="expo-linking"
          icon="🔗"
          rows={
            linkingErr
              ? [{ label: 'Error', value: linkingErr.message }]
              : linkingRows
          }
        />
        <ModuleCard
          title="Tracking Transparency"
          source="expo-tracking-transparency"
          icon="🛡️"
          rows={
            trackingTransparencyErr
              ? [{ label: 'Error', value: trackingTransparencyErr.message }]
              : trackingTransparencyRows
          }
          actions={trackingTransparencyActions}
        />
        <ModuleCard
          title="Music Library"
          source="expo-music-library"
          icon="🎵"
          rows={
            musicLibraryErr
              ? [{ label: 'Error', value: musicLibraryErr.message }]
              : musicLibraryRows
          }
          actions={musicLibraryActions}
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
  ) : (
    <CameraShowcase onBack={() => setPage('list')} />
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
