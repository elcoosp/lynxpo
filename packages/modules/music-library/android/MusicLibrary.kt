package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-music-library`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-music-library` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `MusicLibrary` (registered via nmi).
 */
class MusicLibrary(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getAlbums(): List<Map<String, Any>> {
    // ported from expo-music-library; runtime impl in explorer modules/MusicLibrary.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getSongs(albumId: String): List<Map<String, Any>> {
    // ported from expo-music-library; runtime impl in explorer modules/MusicLibrary.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestPermissions(): Map<String, Any> {
    // ported from expo-music-library; runtime impl in explorer modules/MusicLibrary.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getPermissions(): Map<String, Any> {
    // ported from expo-music-library; runtime impl in explorer modules/MusicLibrary.java
    throw NotImplementedError()
  }

}
