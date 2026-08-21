// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.crypto.generated.CryptoModuleSpec;
import com.lynx.jsbridge.Promise;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Locale;
import java.util.UUID;

/**
 * Android counterpart of the iOS {@code CryptoModule}. Exposes cryptographic
 * primitives to JS via {@code NativeModules.CryptoModule}, faithfully porting
 * the native method surface of Expo's {@code expo-crypto} (latest) module.
 * Method names MUST match the iOS {@code methodLookup} keys so the shared
 * {@code @lynxpo/mods-crypto} accessors resolve on both platforms.
 */
@LynxNativeModule(name = "CryptoModule")
public class CryptoModule extends CryptoModuleSpec {

  public CryptoModule(Context context) {
    super(context);
  }

  @LynxMethod
  public String digestString(String algorithm, String data, String encoding) {
    try {
      MessageDigest md = MessageDigest.getInstance(toJcaAlgorithm(algorithm));
      byte[] digest = md.digest(data.getBytes("UTF-8"));
      if ("BASE64".equalsIgnoreCase(encoding)) {
        return android.util.Base64.encodeToString(digest, android.util.Base64.NO_WRAP);
      }
      return toHex(digest); // default HEX
    } catch (Exception e) {
      return null;
    }
  }

  @LynxMethod
  public String getRandomBytes(int byteCount) {
    if (byteCount <= 0 || byteCount > 1024) {
      return null;
    }
    byte[] bytes = new byte[byteCount];
    new SecureRandom().nextBytes(bytes);
    return android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP);
  }

  @LynxMethod
  public String randomUUID() {
    return UUID.randomUUID().toString();
  }

  @LynxMethod
  public void digestStringAsync(final String algorithm, final String data, final String encoding,
      final Promise promise) {
    try {
      String result = digestString(algorithm, data, encoding);
      if (result != null) {
        promise.resolve(result);
      } else {
        promise.reject("ERR_CRYPTO", "Unsupported algorithm: " + algorithm);
      }
    } catch (Exception e) {
      promise.reject("ERR_CRYPTO", e.getMessage());
    }
  }

  @LynxMethod
  public void getRandomBytesAsync(final int byteCount, final Promise promise) {
    try {
      String result = getRandomBytes(byteCount);
      if (result != null) {
        promise.resolve(result);
      } else {
        promise.reject("ERR_CRYPTO", "byteCount must be in range 1..1024");
      }
    } catch (Exception e) {
      promise.reject("ERR_CRYPTO", e.getMessage());
    }
  }

  private static String toJcaAlgorithm(String algorithm) throws NoSuchAlgorithmException {
    if (algorithm == null) {
      throw new NoSuchAlgorithmException("null");
    }
    switch (algorithm.toUpperCase(Locale.ROOT)) {
      case "SHA1":
        return "SHA-1";
      case "SHA256":
        return "SHA-256";
      case "SHA384":
        return "SHA-384";
      case "SHA512":
        return "SHA-512";
      case "MD5":
        return "MD5";
      default:
        throw new NoSuchAlgorithmException(algorithm);
    }
  }

  private static String toHex(byte[] bytes) {
    StringBuilder sb = new StringBuilder(bytes.length * 2);
    for (byte b : bytes) {
      sb.append(String.format(Locale.ROOT, "%02x", b));
    }
    return sb.toString();
  }
}
