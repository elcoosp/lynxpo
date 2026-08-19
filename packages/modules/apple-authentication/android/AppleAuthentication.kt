// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import android.content.Context
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android counterpart of AppleAuthentication (expo-apple-authentication).
 * Sign in with Apple is iOS-only; the Android twin reports that honestly.
 * The real implementation lives in AppleAuthentication.m.
 */
class AppleAuthentication(context: Context) : LynxModule(context) {

  @LynxMethod
  fun isAvailableAsync(): Boolean = false

  @LynxMethod
  fun credentialAsync(options: String): Map<String, Any> = mapOf(
    "available" to false,
    "error" to "Sign in with Apple is only available on iOS.",
    "source" to "android-unsupported",
  )

  @LynxMethod
  fun credentialStateAsync(user: String): String = "unsupported"
}
