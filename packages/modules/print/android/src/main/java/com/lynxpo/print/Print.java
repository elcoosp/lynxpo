// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.print.generated.PrintSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code Print}. Exposes functionality to JS via
 * {@code NativeModules.Print}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Print")
public class Print extends PrintSpec {

  public Print(Context context) {
    super(context);
  }

  @LynxMethod
  public void printAsync(String uri) {
  }

  @LynxMethod
  public WritableMap selectPrinter() {
    WritableMap m = new JavaOnlyMap();
    m.putString("name", "");
    m.putBoolean("isAvailable", false);
    return m;
  }

  @LynxMethod
  public boolean isAvailable() {
    return true;
  }

}
