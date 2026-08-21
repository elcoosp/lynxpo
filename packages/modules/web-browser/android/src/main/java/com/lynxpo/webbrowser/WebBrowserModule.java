// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.pm.PackageManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.webbrowser.generated.WebBrowserModuleSpec;

/**
 * Android counterpart of the iOS {@code WebBrowserModule}. Exposes web-browser availability to
 * JS via {@code NativeModules.WebBrowserModule}, faithfully porting the native method surface of
 * Expo's {@code expo-web-browser} (latest) module. Method names MUST match the iOS
 * methodLookup keys so the shared {@code @lynxpo/mods-web-browser} accessors resolve on both
 * platforms.
 */
@LynxNativeModule(name = "WebBrowserModule")
public class WebBrowserModule extends WebBrowserModuleSpec {

  public WebBrowserModule(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailable() {
    // A browser capable of handling ACTION_VIEW http(s) intents is effectively always
    // present on a real device; report availability accordingly.
    return true;
  }

  @LynxMethod
  public String initialURL() {
    return "";
  }
}
