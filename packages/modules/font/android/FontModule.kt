package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-font`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-font` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `FontModule`
 * (registered via nmi).
 */
class FontModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun isLoaded(fontFamily: String): Boolean {
    // ported from expo-font; runtime impl in explorer modules/FontModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun loadedFonts(): List<String> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun processFontFamily(fontFamily: String): String {
    throw NotImplementedError()
  }

  @LynxMethod
  fun loadAsync(fontFamily: String): Unit {
    throw NotImplementedError()
  }
}
