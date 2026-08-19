package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-media-library`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-media-library` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `MediaLibraryModule`
 * (registered via nmi).
 */
class MediaLibraryModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun permissionsAsync(): Map<String, Any> {
    // ported from expo-media-library; runtime impl in explorer modules/MediaLibraryModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestPermission(): Unit {
    // runtime impl in explorer modules/MediaLibraryModule.java (delegates to host activity)
    throw NotImplementedError()
  }

  @LynxMethod
  fun albumsAsync(): List<Map<String, Any>> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun assetsAsync(): Map<String, Any> {
    throw NotImplementedError()
  }
}
