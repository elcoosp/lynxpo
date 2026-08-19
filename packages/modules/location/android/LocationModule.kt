package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-location`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-location` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `LocationModule`
 * (registered via nmi).
 */
class LocationModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun providerStatus(): Map<String, Boolean> {
    // ported from expo-location; runtime impl in explorer modules/LocationModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun permissionsAsync(): Map<String, Any> {
    // ported from expo-location; runtime impl in explorer modules/LocationModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestPermission(): Unit {
    // runtime impl in explorer modules/LocationModule.java (delegates to host activity)
    throw NotImplementedError()
  }

  @LynxMethod
  fun currentPositionAsync(): Map<String, Double> {
    throw NotImplementedError()
  }
}
