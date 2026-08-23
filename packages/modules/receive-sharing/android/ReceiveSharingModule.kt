package com.lynxpo.receivesharing

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-receive-sharing`. The ktts plugin
 * reads this file and generates `src/index.ts`. Method names mirror Expo's
 * `expo-receive-sharing-intent` native module surface. Runtime twin lives in
 * the Lynx Explorer.
 */
class ReceiveSharingModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getInitialIntentAsync(): Map<String, Any>? { throw NotImplementedError() }

  @LynxMethod
  fun hasIntentAsync(): Boolean { throw NotImplementedError() }
}
