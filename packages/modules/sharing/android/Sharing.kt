package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-sharing`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-sharing` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Sharing` (registered via nmi).
 */
class Sharing(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun isAvailable(): Boolean {
    // ported from expo-sharing; runtime impl in explorer modules/Sharing.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun shareAsync(url: String): Unit {
    // ported from expo-sharing; runtime impl in explorer modules/Sharing.java
    throw NotImplementedError()
  }

}
