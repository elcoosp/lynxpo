package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-cellular`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-cellular` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `CellularModule`
 * (registered via nmi).
 */
class CellularModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getCellularGeneration(): Int {
    // ported from expo-cellular; runtime impl in explorer modules/CellularModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getIsoCountryCode(): String? {
    // ported from expo-cellular; runtime impl in explorer modules/CellularModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getCarrierName(): String? {
    // ported from expo-cellular; runtime impl in explorer modules/CellularModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getMobileCountryCode(): String? {
    // ported from expo-cellular; runtime impl in explorer modules/CellularModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getMobileNetworkCode(): String? {
    // ported from expo-cellular; runtime impl in explorer modules/CellularModule.java
    throw NotImplementedError()
  }

}
