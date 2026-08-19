package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-system-ui`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-system-ui` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `SystemUi` (registered via nmi).
 */
class SystemUi(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getBackgroundColor(): String {
    // ported from expo-system-ui; runtime impl in explorer modules/SystemUi.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setBackgroundColor(color: String): Unit {
    // ported from expo-system-ui; runtime impl in explorer modules/SystemUi.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setStatusBarBackgroundColor(color: String): Unit {
    // ported from expo-system-ui; runtime impl in explorer modules/SystemUi.java
    throw NotImplementedError()
  }

}
