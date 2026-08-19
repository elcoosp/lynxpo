package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-speech`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-speech` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `SpeechModule`
 * (registered via nmi).
 */
class SpeechModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun isSpeaking(): Boolean {
    // ported from expo-speech; runtime impl in explorer modules/SpeechModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun supported(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun voices(): List<Map<String, String>> {
    throw NotImplementedError()
  }
}
