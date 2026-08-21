// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.linking.generated.LinkingSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code Linking}. Exposes functionality to JS via
 * {@code NativeModules.Linking}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Linking")
public class Linking extends LinkingSpec {

  public Linking(Context context) {
    super(context);
  }

  @LynxMethod
  public String getInitialURL() {
    return "";
  }

  @LynxMethod
  public boolean canOpenURL(String url) {
    return true;
  }

  @LynxMethod
  public void openURL(String url) {
  }

}
