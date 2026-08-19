// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import android.content.Context
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.security.SecureRandom
import kotlin.text.String.format

/**
 * Android counterpart of StandardWebCrypto (expo-standard-web-crypto).
 * Real SecureRandom output and SHA digests via MessageDigest.
 */
class StandardWebCrypto(context: Context) : LynxModule(context) {

  @LynxMethod
  fun isAvailableAsync(): Boolean = true

  @LynxMethod
  fun randomBytesAsync(length: String): String {
    val n = length.trim().toIntOrNull() ?: 0
    if (n <= 0) return ""
    val bytes = ByteArray(n)
    SecureRandom().nextBytes(bytes)
    return bytes.joinToString("") { "%02x".format(it) }
  }

  @LynxMethod
  fun digestAsync(algorithm: String, data: String): String {
    if (data.isEmpty()) return ""
    val alg = when {
      algorithm.contains("SHA-1", true) || algorithm.equals("SHA1", true) -> "SHA-1"
      algorithm.contains("SHA-384", true) -> "SHA-384"
      algorithm.contains("SHA-512", true) -> "SHA-512"
      algorithm.contains("MD5", true) -> "MD5"
      else -> "SHA-256"
    }
    return try {
      val md = MessageDigest.getInstance(alg)
      md.digest(data.toByteArray()).joinToString("") { "%02x".format(it) }
    } catch (e: NoSuchAlgorithmException) {
      ""
    }
  }
}
