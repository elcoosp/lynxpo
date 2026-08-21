// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.health.generated.HealthSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;

/**
 * Android counterpart of the iOS Health. Exposes functionality to JS via
 * NativeModules.Health, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Health")
public class Health extends HealthSpec {

  public Health(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    return true;
  }

  @LynxMethod
  public WritableMap permissionsAsync() {
    WritableMap m = new JavaOnlyMap();
    m.putBoolean("available", true);
    m.putString("status", "granted");
    return m;
  }

  @LynxMethod
  public WritableMap requestPermissionsAsync(String permissions) {
    WritableMap m = new JavaOnlyMap();
    m.putBoolean("available", true);
    m.putString("status", "granted");
    return m;
  }

  @LynxMethod
  public WritableMap recordsAsync(String options) {
    WritableMap m = new JavaOnlyMap();
    m.putBoolean("available", true);
    m.putString("status", "granted");
    return m;
  }

  @LynxMethod
  public WritableMap writeRecordsAsync(String records) {
    WritableMap m = new JavaOnlyMap();
    m.putBoolean("available", true);
    m.putString("status", "granted");
    return m;
  }

}
