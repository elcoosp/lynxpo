package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-constants`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-constants` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `ConstantsModule`
 * (registered via nmi).
 */
class ConstantsModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun appOwnership(): String {
    // ported from expo-constants; runtime impl in explorer modules/ConstantsModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun platform(): String {
    throw NotImplementedError()
  }

  @LynxMethod
  fun executionEnvironment(): String {
    throw NotImplementedError()
  }

  @LynxMethod
  fun sessionId(): String {
    throw NotImplementedError()
  }

  @LynxMethod
  fun installationId(): String {
    throw NotImplementedError()
  }

  @LynxMethod
  fun isHeadless(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun systemFonts(): List<String> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun version(): Map<String, String> {
    throw NotImplementedError()
  }
}
