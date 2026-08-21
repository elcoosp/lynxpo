// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.sms.generated.SmsSpec;
import com.lynx.react.bridge.ReadableArray;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code Sms}. Exposes functionality to JS via
 * {@code NativeModules.Sms}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Sms")
public class Sms extends SmsSpec {

  public Sms(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailable() {
    return true;
  }

  @LynxMethod
  public void sendSMS(ReadableArray addresses, String message) {
  }

}
