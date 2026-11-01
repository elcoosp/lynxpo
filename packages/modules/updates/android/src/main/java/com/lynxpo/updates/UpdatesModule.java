// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynxpo.updates;

import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;
import com.lynx.tasm.behavior.LynxContext;
import com.lynxpo.updates.generated.UpdatesModuleSpec;

@LynxNativeModule(name = "UpdatesModule")
public class UpdatesModule extends UpdatesModuleSpec {

  public UpdatesModule(LynxContext context) {
    super(context);
  }

  @LynxMethod
  public WritableMap getNativeStateAsync() {
    WritableMap map = new JavaOnlyMap();
    map.putBoolean("isUpdateAvailable", false);
    map.putBoolean("isEmergencyUpdate", false);
    map.putBoolean("isRollback", false);
    map.putBoolean("checkAutomatically", true);
    map.putString("updateId", "");
    map.putDouble("createdAt", 0);
    return map;
  }

  @LynxMethod
  public WritableMap checkForUpdateAsync() {
    WritableMap map = new JavaOnlyMap();
    map.putBoolean("isAvailable", false);
    map.putString("reason", "no-remote-config");
    return map;
  }

  @LynxMethod
  public WritableMap fetchUpdateAsync() {
    WritableMap map = new JavaOnlyMap();
    map.putBoolean("isNew", false);
    map.putNull("manifest");
    map.putNull("error");
    return map;
  }

  @LynxMethod
  public boolean isUpdateAvailableAsync() {
    return false;
  }

  @LynxMethod
  public void reloadAsync() {
  }
}
