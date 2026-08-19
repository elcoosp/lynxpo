package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-navigation-bar`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-navigation-bar` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `NavigationBar` (registered via nmi).
 */
class NavigationBar(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun setBackgroundColor(color: String): Unit {
    // ported from expo-navigation-bar; runtime impl in explorer modules/NavigationBar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setButtonStyle(style: String): Unit {
    // ported from expo-navigation-bar; runtime impl in explorer modules/NavigationBar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun setVisibility(visible: Boolean): Unit {
    // ported from expo-navigation-bar; runtime impl in explorer modules/NavigationBar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getVisibility(): Map<String, Any> {
    // ported from expo-navigation-bar; runtime impl in explorer modules/NavigationBar.java
    throw NotImplementedError()
  }

}
