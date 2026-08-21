// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.trackingtransparency.generated.TrackingTransparencySpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;

/**
 * Android counterpart of the iOS {@code TrackingTransparency}. Exposes functionality to JS via
 * {@code NativeModules.TrackingTransparency}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "TrackingTransparency")
public class TrackingTransparency extends TrackingTransparencySpec {

  private boolean authorized = false;

  public TrackingTransparency(Context context) {
    super(context);
  }

  @LynxMethod
  public String getAuthorizationStatus() {
    return authorized ? "authorized" : "notDetermined";
  }

  @LynxMethod
  public String requestAuthorization() {
    authorized = true;
    return "authorized";
  }

}
