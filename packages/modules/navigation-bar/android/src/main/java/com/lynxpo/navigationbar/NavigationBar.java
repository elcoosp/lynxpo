// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.navigationbar.generated.NavigationBarSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code NavigationBar}. Exposes functionality to JS via
 * {@code NativeModules.NavigationBar}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "NavigationBar")
public class NavigationBar extends NavigationBarSpec {

  public NavigationBar(Context context) {
    super(context);
  }

  @LynxMethod
  public void setBackgroundColor(String color) {
  }

  @LynxMethod
  public void setButtonStyle(String style) {
  }

  @LynxMethod
  public void setVisibility(Boolean visible) {
  }

  @LynxMethod
  public WritableMap getVisibility() {
    WritableMap m = new JavaOnlyMap();
    m.putBoolean("visible", true);
    return m;
  }

}
