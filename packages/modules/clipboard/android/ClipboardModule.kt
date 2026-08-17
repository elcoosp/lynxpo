package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-clipboard`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-clipboard` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `ClipboardModule`
 * (registered via nmi).
 */
class ClipboardModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getString(): String? {
    // ported from expo-clipboard; runtime impl in explorer modules/ClipboardModule.java
    throw NotImplementedError()
  }

  
  @LynxMethod
  fun hasString(): Boolean {
    // ported from expo-clipboard; runtime impl in explorer modules/ClipboardModule.java
    throw NotImplementedError()
  }
  @LynxMethod
  fun getStringAsync(p: Promise<String>) {}
  @LynxMethod
  fun setStringAsync(text: String, p: Promise<Unit>) {}
  @LynxMethod
  fun hasStringAsync(p: Promise<Boolean>) {}
}
