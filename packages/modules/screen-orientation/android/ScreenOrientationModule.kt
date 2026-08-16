package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-screen-orientation`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-screen-orientation` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `ScreenOrientationModule`
 * (registered via nmi).
 */
class ScreenOrientationModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getOrientation(): Int {
    // ported from expo-screen-orientation; runtime impl in explorer modules/ScreenOrientationModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getOrientationLock(): Int {
    // ported from expo-screen-orientation; runtime impl in explorer modules/ScreenOrientationModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun lock(): Unit {
    // ported from expo-screen-orientation; runtime impl in explorer modules/ScreenOrientationModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun lockPlatform(): Unit {
    // ported from expo-screen-orientation; runtime impl in explorer modules/ScreenOrientationModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun supportsOrientationLock(): Boolean {
    // ported from expo-screen-orientation; runtime impl in explorer modules/ScreenOrientationModule.java
    throw NotImplementedError()
  }

}
