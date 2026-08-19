package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-web-browser`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-web-browser` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `WebBrowserModule`
 * (registered via nmi).
 */
class WebBrowserModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun isAvailable(): Boolean {
    // ported from expo-web-browser; runtime impl in explorer modules/WebBrowserModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun initialURL(): String {
    throw NotImplementedError()
  }
}
