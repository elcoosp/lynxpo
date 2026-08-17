package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-brightness`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-brightness` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `BrightnessModule`
 * (registered via nmi).
 */
class BrightnessModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getBrightness(): Float {
    // ported from expo-brightness; runtime impl in explorer modules/BrightnessModule.java
    throw NotImplementedError()
  }

  
  @LynxMethod
  fun getSystemBrightness(): Float {
    // ported from expo-brightness; runtime impl in explorer modules/BrightnessModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun isUsingSystemBrightness(): Boolean {
    // ported from expo-brightness; runtime impl in explorer modules/BrightnessModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getSystemBrightnessMode(): Int {
    // ported from expo-brightness; runtime impl in explorer modules/BrightnessModule.java
    throw NotImplementedError()
  }
  @LynxMethod
  fun getBrightnessAsync(p: Promise<String>) {}
  @LynxMethod
  fun setBrightnessAsync(value: Double, p: Promise<Unit>) {}
  @LynxMethod
  fun getSystemBrightnessAsync(p: Promise<String>) {}
  @LynxMethod
  fun isUsingSystemBrightnessAsync(p: Promise<Boolean>) {}
  @LynxMethod
  fun getSystemBrightnessModeAsync(p: Promise<Int>) {}
  @LynxMethod
  fun addListener(eventName: String): Unit {}
  @LynxMethod
  fun removeListeners(count: Int): Unit {}
}
