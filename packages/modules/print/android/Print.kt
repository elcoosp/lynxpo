package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-print`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-print` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Print` (registered via nmi).
 */
class Print(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun printAsync(uri: String): Unit {
    // ported from expo-print; runtime impl in explorer modules/Print.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun selectPrinter(): Map<String, Any> {
    // ported from expo-print; runtime impl in explorer modules/Print.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun isAvailable(): Boolean {
    // ported from expo-print; runtime impl in explorer modules/Print.java
    throw NotImplementedError()
  }

}
