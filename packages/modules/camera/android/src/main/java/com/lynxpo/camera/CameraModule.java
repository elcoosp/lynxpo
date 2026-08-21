// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageFormat;
import android.graphics.Matrix;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureRequest;
import android.media.Image;
import android.media.ImageReader;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Base64;
import android.util.Size;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.camera.generated.CameraModuleSpec;
import com.lynx.react.bridge.JavaOnlyArray;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.WritableMap;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Semaphore;

/**
 * Android counterpart of the iOS {@code CameraModule}. Exposes camera availability + live-preview
 * control to JS via {@code NativeModules.CameraModule}, faithfully porting the native method
 * surface of Expo's {@code expo-camera} (latest) module, including the CameraView-style
 * start/stop/flip/torch/captureFrame control surface used by the {@code CameraPreview} custom
 * Lynx UI component.
 *
 * The preview is captured into an {@link ImageReader}; {@link #captureFrame()} returns a base64
 * JPEG of the latest frame so the React-Lynx component can render a genuine, updating camera
 * image through a normal {@code <image>} without requiring engine-level native-view plumbing.
 */
@LynxNativeModule(name = "CameraModule")
public class CameraModule extends CameraModuleSpec {

  private final CameraManager cameraManager;
  private CameraDevice cameraDevice;
  private CameraCaptureSession captureSession;
  private ImageReader imageReader;
  private HandlerThread backgroundThread;
  private Handler backgroundHandler;
  private final Semaphore cameraOpenCloseLock = new Semaphore(1);
  private String currentCameraId;
  private boolean facingFront = false;
  private final Object frameLock = new Object();
  private byte[] latestJpeg;

  public CameraModule(Context context) {
    super(context);
    cameraManager = (CameraManager) mContext.getSystemService(Context.CAMERA_SERVICE);
  }

  private boolean hasCameraPermission() {
    return mContext.checkSelfPermission(android.Manifest.permission.CAMERA)
        == PackageManager.PERMISSION_GRANTED;
  }

  @LynxMethod
  public WritableMap cameraPermissionsAsync() {
    boolean granted = hasCameraPermission();
    WritableMap map = new JavaOnlyMap();
    map.putString("status", granted ? "granted" : "undetermined");
    map.putBoolean("granted", granted);
    map.putBoolean("canAskAgain", !granted);
    return map;
  }

  @LynxMethod
  public WritableMap microphonePermissionsAsync() {
    boolean granted = mContext.checkSelfPermission(android.Manifest.permission.RECORD_AUDIO)
        == PackageManager.PERMISSION_GRANTED;
    WritableMap map = new JavaOnlyMap();
    map.putString("status", granted ? "granted" : "undetermined");
    map.putBoolean("granted", granted);
    map.putBoolean("canAskAgain", !granted);
    return map;
  }

  /**
   * Asks the host activity to present the system CAMERA permission dialog. The actual
   * {@code requestPermissions} call must happen from an Activity; the explorer constructs
   * this module with the activity context, so we cast and delegate. Once the user grants,
   * {@code CameraPreview} retries {@code startCamera()} and the session opens.
   */
  @LynxMethod
  public void requestCameraPermission() {
    if (hasCameraPermission()) return;
    if (mContext instanceof androidx.appcompat.app.AppCompatActivity) {
      androidx.appcompat.app.AppCompatActivity activity =
          (androidx.appcompat.app.AppCompatActivity) mContext;
      androidx.core.app.ActivityCompat.requestPermissions(
          activity,
          new String[] {android.Manifest.permission.CAMERA},
          CAMERA_PERMISSION_REQUEST_CODE);
    }
  }

  private static final int CAMERA_PERMISSION_REQUEST_CODE = 2001;

  @LynxMethod
  public WritableArray availableCameraTypes() {
    WritableArray array = new JavaOnlyArray();
    try {
      for (String id : cameraManager.getCameraIdList()) {
        Integer facing = cameraManager.getCameraCharacteristics(id)
            .get(CameraCharacteristics.LENS_FACING);
        if (facing != null) {
          if (facing == CameraCharacteristics.LENS_FACING_FRONT) array.pushString("front");
          else if (facing == CameraCharacteristics.LENS_FACING_BACK) array.pushString("back");
        }
      }
    } catch (CameraAccessException | SecurityException ignored) {
      // fall through
    }
    return array;
  }

  @LynxMethod
  public WritableArray availableVideoCodecs() {
    WritableArray array = new JavaOnlyArray();
    array.pushString("avc");
    array.pushString("hevc");
    array.pushString("jpeg");
    return array;
  }

  @LynxMethod
  public boolean startCamera() {
    if (cameraDevice != null && captureSession != null) return true;
    if (!hasCameraPermission()) return false;
    try {
      startBackgroundThread();
      String cameraId = pickCameraId();
      if (cameraId == null) return false;
      currentCameraId = cameraId;
      cameraManager.openCamera(cameraId, new CameraDevice.StateCallback() {
        @Override
        public void onOpened(CameraDevice device) {
          cameraOpenCloseLock.release();
          cameraDevice = device;
          createCaptureSession();
        }

        @Override
        public void onDisconnected(CameraDevice device) {
          cameraOpenCloseLock.release();
          device.close();
          cameraDevice = null;
        }

        @Override
        public void onError(CameraDevice device, int error) {
          cameraOpenCloseLock.release();
          device.close();
          cameraDevice = null;
        }
      }, backgroundHandler);
      cameraOpenCloseLock.acquire();
      return cameraDevice != null;
    } catch (CameraAccessException | SecurityException | InterruptedException e) {
      return false;
    }
  }

  private String pickCameraId() throws CameraAccessException {
    String wantedFacing = facingFront
        ? String.valueOf(CameraCharacteristics.LENS_FACING_FRONT)
        : String.valueOf(CameraCharacteristics.LENS_FACING_BACK);
    for (String id : cameraManager.getCameraIdList()) {
      Integer facing = cameraManager.getCameraCharacteristics(id)
          .get(CameraCharacteristics.LENS_FACING);
      if (facing != null && String.valueOf(facing).equals(wantedFacing)) return id;
    }
    // fall back to any camera
    String[] ids = cameraManager.getCameraIdList();
    return ids.length > 0 ? ids[0] : null;
  }

  private void createCaptureSession() {
    if (cameraDevice == null) return;
    try {
      Size size = new Size(640, 480);
      // Use JPEG output so the camera hardware delivers ready-encoded frames;
      // avoids a manual YUV->JPEG conversion (which produced green garbage).
      imageReader = ImageReader.newInstance(size.getWidth(), size.getHeight(),
          ImageFormat.JPEG, 2);
      imageReader.setOnImageAvailableListener(reader -> {
        Image image = null;
        try {
          image = reader.acquireLatestImage();
          if (image != null) {
            ByteBuffer buffer = image.getPlanes()[0].getBuffer();
            byte[] jpeg = new byte[buffer.remaining()];
            buffer.get(jpeg);
            synchronized (frameLock) {
              latestJpeg = jpeg;
            }
            image.close();
          }
        } catch (Exception ignored) {
          if (image != null) image.close();
        }
      }, backgroundHandler);

      cameraDevice.createCaptureSession(
          java.util.Collections.singletonList(imageReader.getSurface()),
          new CameraCaptureSession.StateCallback() {
            @Override
            public void onConfigured(CameraCaptureSession session) {
              if (cameraDevice == null) return;
              captureSession = session;
              try {
                CaptureRequest.Builder builder =
                    cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
                builder.addTarget(imageReader.getSurface());
                session.setRepeatingRequest(builder.build(), null, backgroundHandler);
              } catch (CameraAccessException ignored) {
                // ignore
              }
            }

            @Override
            public void onConfigureFailed(CameraCaptureSession session) {
              // ignore
            }
          }, backgroundHandler);
    } catch (CameraAccessException ignored) {
      // ignore
    }
  }

  @LynxMethod
  public void stopCamera() {
    try {
      if (captureSession != null) {
        captureSession.abortCaptures();
        captureSession.close();
        captureSession = null;
      }
    } catch (CameraAccessException | IllegalStateException ignored) {
      // ignore
    }
    if (cameraDevice != null) {
      cameraDevice.close();
      cameraDevice = null;
    }
    if (imageReader != null) {
      imageReader.close();
      imageReader = null;
    }
    stopBackgroundThread();
    synchronized (frameLock) {
      latestJpeg = null;
    }
  }

  @LynxMethod
  public void flipCamera() {
    facingFront = !facingFront;
    if (cameraDevice != null) {
      boolean wasRunning = captureSession != null;
      stopCamera();
      if (wasRunning) startCamera();
    }
  }

  @LynxMethod
  public void setTorch(boolean enabled) {
    // Flash/torch on preview requires a repeating request with FLASH_MODE_TORCH.
    if (cameraDevice == null || captureSession == null) return;
    try {
      CaptureRequest.Builder builder =
          cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
      builder.addTarget(imageReader.getSurface());
      builder.set(CaptureRequest.FLASH_MODE,
          enabled ? CaptureRequest.FLASH_MODE_TORCH : CaptureRequest.FLASH_MODE_OFF);
      captureSession.setRepeatingRequest(builder.build(), null, backgroundHandler);
    } catch (CameraAccessException | IllegalStateException ignored) {
      // ignore
    }
  }

  @LynxMethod
  public boolean isTorchAvailable() {
    if (currentCameraId == null) return false;
    try {
      Boolean available = cameraManager.getCameraCharacteristics(currentCameraId)
          .get(CameraCharacteristics.FLASH_INFO_AVAILABLE);
      return Boolean.TRUE.equals(available);
    } catch (CameraAccessException | SecurityException e) {
      return false;
    }
  }

  @LynxMethod
  public String captureFrame() {
    synchronized (frameLock) {
      // Return the most recent frame; the onImageAvailable listener keeps this
      // fresh, so even between deliveries we hand back the last good JPEG
      // (avoids blank/black flashes on the JS <image>).
      if (latestJpeg == null) return "";
      return Base64.encodeToString(latestJpeg, Base64.NO_WRAP);
    }
  }

  private void startBackgroundThread() {
    if (backgroundThread == null) {
      backgroundThread = new HandlerThread("lynxpo-camera");
      backgroundThread.start();
      backgroundHandler = new Handler(backgroundThread.getLooper());
    }
  }

  private void stopBackgroundThread() {
    if (backgroundThread != null) {
      backgroundThread.quitSafely();
      try {
        backgroundThread.join(500);
      } catch (InterruptedException e) {
        // ignore
      }
      backgroundThread = null;
      backgroundHandler = null;
    }
  }
}
