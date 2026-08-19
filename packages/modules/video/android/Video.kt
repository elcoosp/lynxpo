package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-video`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-video` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Video` (registered via nmi).
 */
class Video(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getStatus(): Map<String, Any> {
    // ported from expo-video; runtime impl in explorer modules/Video.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun play(): Unit {
    // ported from expo-video; runtime impl in explorer modules/Video.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun pause(): Unit {
    // ported from expo-video; runtime impl in explorer modules/Video.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setVolume(volume: Double): Unit {
    // ported from expo-video; runtime impl in explorer modules/Video.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setMuted(muted: Boolean): Unit {
    // ported from expo-video; runtime impl in explorer modules/Video.java
    throw NotImplementedError()
  }

}
