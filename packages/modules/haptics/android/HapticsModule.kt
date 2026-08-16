package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-haptics`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-haptics` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `HapticsModule`
 * (registered via nmi).
 */
class HapticsModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun impactAsync(): Unit {
    // ported from expo-haptics; runtime impl in explorer modules/HapticsModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun notificationAsync(): Unit {
    // ported from expo-haptics; runtime impl in explorer modules/HapticsModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun selectionAsync(): Unit {
    // ported from expo-haptics; runtime impl in explorer modules/HapticsModule.java
    throw NotImplementedError()
  }

}
