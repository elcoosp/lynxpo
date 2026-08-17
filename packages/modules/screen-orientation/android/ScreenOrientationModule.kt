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
  fun supportsOrientationLock(): Boolean {
    // ported from expo-screen-orientation; runtime impl in explorer modules/ScreenOrientationModule.java
    throw NotImplementedError()
  }
  @LynxMethod
  fun getOrientationAsync(p: Promise<Int>) {}
  @LynxMethod
  fun getOrientationLockAsync(p: Promise<Int>) {}
  @LynxMethod
  fun lockAsync(orientation: Int, p: Promise<Unit>) {}
  @LynxMethod
  fun unlockAsync(p: Promise<Unit>) {}
  @LynxMethod
  fun lockPlatformAsync(orientation: Int, p: Promise<Unit>) {}
  @LynxMethod
  fun supportsOrientationLockAsync(p: Promise<Boolean>) {}
  @LynxMethod
  fun addListener(eventName: String): Unit {}
  @LynxMethod
  fun removeListeners(count: Int): Unit {}
}
