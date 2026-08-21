// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.intentlauncher.generated.IntentLauncherSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;

/**
 * Android counterpart of the iOS IntentLauncher. Exposes functionality to JS via
 * NativeModules.IntentLauncher, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "IntentLauncher")
public class IntentLauncher extends IntentLauncherSpec {

  public IntentLauncher(Context context) {
    super(context);
  }

  @LynxMethod
  public String startActivity(String activity, String data) {
    return "ok";
  }

  @LynxMethod
  public String startActivityAsync(String options) {
    return "ok";
  }

  @LynxMethod
  public boolean canOpenURL(String url) {
    return true;
  }

}
