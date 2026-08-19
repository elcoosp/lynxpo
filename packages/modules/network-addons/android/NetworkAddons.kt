// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import android.content.Context
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import java.net.URL
import java.security.MessageDigest
import java.security.cert.X509Certificate
import javax.net.ssl.HttpsURLConnection

/**
 * Android counterpart of NetworkAddons (expo-network-addons). Real TLS
 * certificate inspection via HttpsURLConnection.
 */
class NetworkAddons(context: Context) : LynxModule(context) {

  @LynxMethod
  fun isAvailableAsync(): Boolean = true

  @LynxMethod
  fun certificateInfoAsync(host: String): Map<String, Any> {
    if (host.isEmpty()) return mapOf("available" to false, "error" to "missing host")
    val target = if (!host.startsWith("http")) "https://$host" else host
    return try {
      val url = URL(target)
      val conn = url.openConnection() as HttpsURLConnection
      conn.connectTimeout = 5000
      conn.connect()
      val certs = conn.serverCertificates
      conn.disconnect()
      val x = certs.firstOrNull() as? X509Certificate
      if (x != null) {
        val fp = MessageDigest.getInstance("SHA-256").digest(x.encoded)
          .joinToString("") { "%02x".format(it) }
        mapOf(
          "available" to true,
          "subject" to x.subjectX500Principal.name,
          "issuer" to x.issuerX500Principal.name,
          "validFrom" to x.notBefore.toInstant().toString(),
          "validTo" to x.notAfter.toInstant().toString(),
          "fingerprintSha256" to fp,
          "source" to "HttpsURLConnection",
        )
      } else {
        mapOf("available" to false, "error" to "no certificate")
      }
    } catch (e: Exception) {
      mapOf("available" to false, "error" to (e.message ?: "error"))
    }
  }

  @LynxMethod
  fun addInterceptorAsync(name: String): Boolean = name.isNotEmpty()
}
