package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-image-picker`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-image-picker` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `ImagePickerModule`
 * (registered via nmi).
 */
class ImagePickerModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getCameraPermissions(): Map<String, Any> {
    // ported from expo-image-picker; runtime impl in explorer modules/ImagePickerModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getMediaLibraryPermissions(): Map<String, Any> {
    // ported from expo-image-picker; runtime impl in explorer modules/ImagePickerModule.java
    throw NotImplementedError()
  }
  @LynxMethod
  fun getCameraPermissionsAsync(p: Promise<Any>) {}
  @LynxMethod
  fun getMediaLibraryPermissionsAsync(p: Promise<Any>) {}
  @LynxMethod
  fun launchImageLibraryAsync(p: Promise<Any>) {}
  @LynxMethod
  fun launchCameraAsync(p: Promise<Any>) {}
}
