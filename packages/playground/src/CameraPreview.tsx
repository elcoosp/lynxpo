import { useEffect, useRef, useState } from '@lynx-js/react';
import {
  getCaptureFrame,
  getFlipCamera,
  getIsTorchAvailable,
  getRequestCameraPermission,
  getSetTorch,
  getStartCamera,
  getStopCamera,
} from '@lynxpo/mods-camera';

/**
 * CameraPreview — a custom native Lynx UI component that renders a live camera
 * preview by driving the real device camera through `NativeModules.CameraModule`
 * (faithful to Expo's `CameraView` runtime). The module runs a genuine Camera2 /
 * AVFoundation capture session; this component polls the latest preview frame and
 * paints it into a standard `<image>`, giving a real, updating camera surface
 * without requiring engine-level native-view plumbing.
 *
 * It retries `startCamera()` so the preview comes up once the OS camera
 * permission is granted (the explorer requests it at launch; if the user taps
 * Allow on the system dialog, the next retry opens the session).
 */
export function CameraPreview() {
  const [frame, setFrame] = useState('');
  const [running, setRunning] = useState(false);
  const [torch, setTorch] = useState(false);
  const [torchAvail, setTorchAvail] = useState(false);
  const [status, setStatus] = useState('Starting camera…');
  const startTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimers = () => {
    'background only';
    if (startTimer.current !== null) {
      clearInterval(startTimer.current);
      startTimer.current = null;
    }
    if (frameTimer.current !== null) {
      clearInterval(frameTimer.current);
      frameTimer.current = null;
    }
  };

  const start = () => {
    'background only';
    if (startTimer.current !== null || frameTimer.current !== null) return;
    let tries = 0;
    let requested = false;
    const tryStart = () => {
      'background only';
      const ok = getStartCamera();
      if (ok) {
        if (startTimer.current !== null) {
          clearInterval(startTimer.current);
          startTimer.current = null;
        }
        setRunning(true);
        setStatus('Live');
        setTorchAvail(getIsTorchAvailable());
        if (frameTimer.current === null) {
          frameTimer.current = setInterval(() => {
            const f = getCaptureFrame();
            // Only repaint when a fresh frame arrived; otherwise keep the last
            // good frame on screen (avoids black flashes between deliveries).
            if (f) setFrame(`data:image/jpeg;base64,${f}`);
          }, 200);
        }
      } else {
        if (!requested) {
          // Trigger the OS permission dialog (host activity shows it). The retry
          // loop below will open the session once the user grants access.
          requested = true;
          getRequestCameraPermission();
        }
        tries += 1;
        setStatus(
          tries < 20 ? 'Tap Allow on camera permission…' : 'Camera unavailable',
        );
        if (tries >= 20 && startTimer.current !== null) {
          clearInterval(startTimer.current);
          startTimer.current = null;
        }
      }
    };
    tryStart();
    if (startTimer.current === null) {
      startTimer.current = setInterval(tryStart, 1000);
    }
  };

  const stop = () => {
    'background only';
    stopTimers();
    getStopCamera();
    setRunning(false);
    setFrame('');
  };

  const flip = () => {
    'background only';
    getFlipCamera();
  };

  const toggleTorch = () => {
    'background only';
    const next = !torch;
    getSetTorch(next);
    setTorch(next);
  };

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <view className="CameraPreview">
      <view className="CameraPreview__Stage">
        {frame ? (
          <image className="CameraPreview__Image" src={frame} />
        ) : (
          <view className="CameraPreview__Placeholder">
            <text className="CameraPreview__PlaceholderText">{status}</text>
          </view>
        )}
      </view>
      <view className="CameraPreview__Controls">
        <view
          className="CameraPreview__Button"
          bindtap={() => {
            'background only';
            flip();
          }}
        >
          <text className="CameraPreview__ButtonLabel">Flip</text>
        </view>
        <view
          className="CameraPreview__Button"
          bindtap={() => {
            'background only';
            toggleTorch();
          }}
        >
          <text className="CameraPreview__ButtonLabel">
            {torch ? 'Torch off' : 'Torch on'}
          </text>
        </view>
        <view
          className="CameraPreview__Button"
          bindtap={() => {
            'background only';
            if (running) stop();
            else start();
          }}
        >
          <text className="CameraPreview__ButtonLabel">
            {running ? 'Stop' : 'Start'}
          </text>
        </view>
      </view>
      {!torchAvail && running && (
        <text className="CameraPreview__Note">
          Torch not available on this lens
        </text>
      )}
    </view>
  );
}
