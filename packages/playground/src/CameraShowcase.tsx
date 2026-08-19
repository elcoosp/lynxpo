import { useState } from '@lynx-js/react';
import { CameraPreview } from './CameraPreview.js';
import { useCameraInfo } from './mods/cameraInfo.js';

/**
 * Dedicated subpage for the live camera. Shown when the "Camera" card's
 * "Open live preview" action is tapped. Hosts the `CameraPreview` custom native
 * Lynx UI component plus the Expo-parity data readout (permissions, available
 * camera types, video codecs).
 */
export function CameraShowcase({ onBack }: { onBack: () => void }) {
  const { rows: cameraRows, error: cameraErr } = useCameraInfo();
  const [showPreview, setShowPreview] = useState(true);

  return (
    <view className="CameraPage">
      <view className="CameraPage__Header">
        <view
          className="CameraPage__Back"
          bindtap={() => {
            'background only';
            onBack();
          }}
        >
          <text className="CameraPage__BackIcon">‹</text>
          <text className="CameraPage__BackLabel">Modules</text>
        </view>
        <text className="CameraPage__Title">Camera · expo-camera</text>
      </view>

      {showPreview && <CameraPreview />}

      <view className="CameraPage__ToggleRow">
        <view
          className="CameraPage__Toggle"
          bindtap={() => {
            'background only';
            setShowPreview(!showPreview);
          }}
        >
          <text className="CameraPage__ToggleLabel">
            {showPreview ? 'Hide live preview' : 'Show live preview'}
          </text>
        </view>
      </view>

      <view className="Card">
        <view className="Card__Header">
          <text className="Card__Icon">📷</text>
          <view className="Card__Heading">
            <text className="Card__Title">Camera (native parity)</text>
            <text className="Card__Source">ports expo-camera</text>
          </view>
        </view>
        <view className="Card__Body">
          {cameraErr ? (
            <view className="Row">
              <text className="Row__Label">Error</text>
              <text className="Row__Value">{cameraErr.message}</text>
            </view>
          ) : (
            cameraRows.map((r, i) => (
              <view className="Row" key={`${r.label}-${i}`}>
                <text className="Row__Label">{r.label}</text>
                <text className="Row__Value">{r.value}</text>
              </view>
            ))
          )}
        </view>
      </view>
    </view>
  );
}
