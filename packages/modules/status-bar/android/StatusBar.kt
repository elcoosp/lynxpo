package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-status-bar`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-status-bar` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `StatusBar` (registered via nmi).
 */
class StatusBar(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun setStyle(style: String): Unit {
    // ported from expo-status-bar; runtime impl in explorer modules/StatusBar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setHidden(hidden: Boolean): Unit {
    // ported from expo-status-bar; runtime impl in explorer modules/StatusBar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setNetworkActivityIndicatorVisible(visible: Boolean): Unit {
    // ported from expo-status-bar; runtime impl in explorer modules/StatusBar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setBackgroundColor(color: String): Unit {
    // ported from expo-status-bar; runtime impl in explorer modules/StatusBar.java
    throw NotImplementedError()
  }

}
