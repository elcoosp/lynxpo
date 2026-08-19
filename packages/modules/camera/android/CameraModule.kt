package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-camera`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-camera` (latest)
 * native module surface, extended with the live-preview control surface used by the
 * `CameraPreview` custom Lynx UI component (faithful to Expo `CameraView` runtime
 * behavior: start/stop a real camera session, flip the lens, toggle the torch, and pull
 * the current preview frame). The runtime twin lives in the Lynx Explorer as `CameraModule`
 * (registered via nmi).
 */
class CameraModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun cameraPermissionsAsync(): Map<String, Any> {
    // ported from expo-camera; runtime impl in explorer modules/CameraModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestCameraPermission(): Unit {
    // runtime impl in explorer modules/CameraModule.java (delegates to host activity)
    throw NotImplementedError()
  }

  @LynxMethod
  fun microphonePermissionsAsync(): Map<String, Any> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun availableCameraTypes(): List<String> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun availableVideoCodecs(): List<String> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun startCamera(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun stopCamera(): Unit {
    throw NotImplementedError()
  }

  @LynxMethod
  fun flipCamera(): Unit {
    throw NotImplementedError()
  }

  @LynxMethod
  fun setTorch(enabled: Boolean): Unit {
    throw NotImplementedError()
  }

  @LynxMethod
  fun isTorchAvailable(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun captureFrame(): String {
    throw NotImplementedError()
  }
}
