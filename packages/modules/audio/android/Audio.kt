package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-audio`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-audio` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Audio` (registered via nmi).
 */
class Audio(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getStatus(): Map<String, Any> {
    // ported from expo-audio; runtime impl in explorer modules/Audio.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun play(): Unit {
    // ported from expo-audio; runtime impl in explorer modules/Audio.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun pause(): Unit {
    // ported from expo-audio; runtime impl in explorer modules/Audio.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setVolume(volume: Double): Unit {
    // ported from expo-audio; runtime impl in explorer modules/Audio.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setIsLooping(looping: Boolean): Unit {
    // ported from expo-audio; runtime impl in explorer modules/Audio.java
    throw NotImplementedError()
  }

}
