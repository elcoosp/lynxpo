// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.standardwebcrypto.generated.StandardWebCryptoSpec;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

/**
 * Android runtime twin of StandardWebCrypto (expo-standard-web-crypto).
 * Real implementations of the subset of Web Crypto we expose:
 *  - random bytes via SecureRandom
 *  - SHA digests via MessageDigest
 */
@LynxNativeModule(name = "StandardWebCrypto")
public class StandardWebCrypto extends StandardWebCryptoSpec {

  public StandardWebCrypto(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    // Web Crypto primitives are available on every Android API level.
    return true;
  }

  @LynxMethod
  public String randomBytesAsync(String length) {
    int n;
    try {
      n = Integer.parseInt(length == null ? "0" : length.trim());
    } catch (NumberFormatException e) {
      n = 0;
    }
    if (n <= 0) {
      return "";
    }
    byte[] bytes = new byte[n];
    new SecureRandom().nextBytes(bytes);
    StringBuilder sb = new StringBuilder(n * 2);
    for (byte b : bytes) {
      sb.append(String.format("%02x", b));
    }
    return sb.toString();
  }

  @LynxMethod
  public String digestAsync(String algorithm, String data) {
    if (data == null) {
      return "";
    }
    // Map Web Crypto alg names to MessageDigest names.
    String alg = "SHA-256";
    if (algorithm != null) {
      String a = algorithm.toUpperCase();
      if (a.contains("SHA-1") || a.equals("SHA1")) {
        alg = "SHA-1";
      } else if (a.contains("SHA-256")) {
        alg = "SHA-256";
      } else if (a.contains("SHA-384")) {
        alg = "SHA-384";
      } else if (a.contains("SHA-512")) {
        alg = "SHA-512";
      } else if (a.contains("MD5")) {
        alg = "MD5";
      }
    }
    try {
      MessageDigest md = MessageDigest.getInstance(alg);
      byte[] digest = md.digest(data.getBytes("UTF-8"));
      StringBuilder sb = new StringBuilder(digest.length * 2);
      for (byte b : digest) {
        sb.append(String.format("%02x", b));
      }
      return sb.toString();
    } catch (NoSuchAlgorithmException | java.io.UnsupportedEncodingException e) {
      return "";
    }
  }
}
