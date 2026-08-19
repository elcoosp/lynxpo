package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-linking`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-linking` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Linking` (registered via nmi).
 */
class Linking(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getInitialURL(): String {
    // ported from expo-linking; runtime impl in explorer modules/Linking.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun canOpenURL(url: String): Boolean {
    // ported from expo-linking; runtime impl in explorer modules/Linking.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun openURL(url: String): Unit {
    // ported from expo-linking; runtime impl in explorer modules/Linking.java
    throw NotImplementedError()
  }

}
