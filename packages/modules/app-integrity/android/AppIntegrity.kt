// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import android.content.Context
import android.content.pm.PackageManager
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import java.security.MessageDigest

/**
 * Android counterpart (source-of-truth types for ktts) of AppIntegrity
 * (expo-app-integrity). The runtime behavior lives in the .java twin; this
 * mirrors it in Kotlin so the generated TS surface matches.
 */
class AppIntegrity(context: Context) : LynxModule(context) {

  @LynxMethod
  fun isAvailableAsync(): Boolean {
    return try {
      context.packageManager.getPackageInfo("com.android.vending", 0)
      true
    } catch (e: PackageManager.NameNotFoundException) {
      false
    }
  }

  @LynxMethod
  fun integrityTokenAsync(options: String): Map<String, Any> {
    val available = isAvailableAsync()
    return mapOf(
      "available" to available,
      "token" to false,
      "error" to "Play Integrity token requires a cloud project and server-side " +
        "verification (requestIntegrityToken + decrypt on backend). Not performed on-device.",
      "source" to "PlayIntegrity",
    )
  }

  @LynxMethod
  fun codeHashAsync(): Map<String, Any> {
    return try {
      val pkg = context.packageName
      val pi = context.packageManager.getPackageInfo(pkg, PackageManager.GET_SIGNATURES)
      val cert = pi.signatures?.firstOrNull()?.toByteArray()
      if (cert != null) {
        val fp = MessageDigest.getInstance("SHA-256").digest(cert)
        val hex = fp.joinToString("") { "%02x".format(it) }
        mapOf("available" to true, "signingCertSha256" to hex, "source" to "PackageManager")
      } else {
        mapOf("available" to false, "error" to "no signing certificate")
      }
    } catch (e: Exception) {
      mapOf("available" to false, "error" to (e.message ?: "unknown"))
    }
  }
}
