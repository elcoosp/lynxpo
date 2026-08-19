// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import android.content.Context
import android.content.pm.PackageManager
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android counterpart of AuthSession (expo-auth-session). Real redirect URI
 * computation (reverse-DNS bundle id) and OAuth provider discovery.
 */
class AuthSession(context: Context) : LynxModule(context) {

  @LynxMethod
  fun isAvailableAsync(): Boolean = context != null

  @LynxMethod
  fun redirectUriAsync(): String {
    val pkg = context?.packageName ?: ""
    val reversed = pkg.split(".").reversed().joinToString(".")
    return "com.$reversed://expo-auth-session"
  }

  @LynxMethod
  fun providerInfoAsync(): Map<String, Any> {
    val ctx = context ?: return mapOf("available" to false)
    val pm = ctx.packageManager
    val google = try {
      pm.getPackageInfo("com.google.android.gms", 0) != null
    } catch (e: PackageManager.NameNotFoundException) {
      false
    }
    val facebook = try {
      pm.getPackageInfo("com.facebook.katana", 0) != null
    } catch (e: PackageManager.NameNotFoundException) {
      false
    }
    return mapOf(
      "available" to true,
      "google" to google,
      "facebook" to facebook,
      "scheme" to redirectUriAsync(),
      "source" to "PackageManager",
    )
  }
}
