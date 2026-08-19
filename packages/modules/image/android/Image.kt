package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-image`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-image` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Image` (registered via nmi).
 */
class Image(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getCacheSize(): Double {
    // ported from expo-image; runtime impl in explorer modules/Image.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun clearCache(): Unit {
    // ported from expo-image; runtime impl in explorer modules/Image.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun prefetch(url: String): Boolean {
    // ported from expo-image; runtime impl in explorer modules/Image.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun isImageLoading(uri: String): Boolean {
    // ported from expo-image; runtime impl in explorer modules/Image.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun cancelLoading(uri: String): Unit {
    // ported from expo-image; runtime impl in explorer modules/Image.java
    throw NotImplementedError()
  }

}
