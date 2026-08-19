package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-appearance`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-appearance` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Appearance` (registered via nmi).
 */
class Appearance(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getColorScheme(): String {
    // ported from expo-appearance; runtime impl in explorer modules/Appearance.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setColorScheme(scheme: String): Unit {
    // ported from expo-appearance; runtime impl in explorer modules/Appearance.java
    throw NotImplementedError()
  }

}
