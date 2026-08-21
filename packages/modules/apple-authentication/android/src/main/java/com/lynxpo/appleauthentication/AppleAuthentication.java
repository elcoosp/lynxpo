// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.appleauthentication.generated.AppleAuthenticationSpec;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;

/**
 * Android runtime twin of AppleAuthentication (expo-apple-authentication).
 * Sign in with Apple is an iOS-only capability with no Android equivalent, so
 * the Android twin reports that honestly instead of returning fake data.
 * The real implementation lives in the iOS twin (AppleAuthentication.m).
 */
@LynxNativeModule(name = "AppleAuthentication")
public class AppleAuthentication extends AppleAuthenticationSpec {

  public AppleAuthentication(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    // No Apple identity platform on Android.
    return false;
  }

  @LynxMethod
  public WritableMap credentialAsync(String options) {
    WritableMap map = new JavaOnlyMap();
    map.putBoolean("available", false);
    map.putString("error", "Sign in with Apple is only available on iOS.");
    map.putString("source", "android-unsupported");
    return map;
  }

  @LynxMethod
  public String credentialStateAsync(String user) {
    return "unsupported";
  }
}
