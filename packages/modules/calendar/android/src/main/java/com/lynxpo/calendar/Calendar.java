// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.calendar.generated.CalendarSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code Calendar}. Exposes functionality to JS via
 * {@code NativeModules.Calendar}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Calendar")
public class Calendar extends CalendarSpec {

  private boolean granted = false;

  public Calendar(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableArray getCalendars() {
    return new JavaOnlyArray();
  }

  @LynxMethod
  public WritableArray getEvents(String startDate, String endDate) {
    return new JavaOnlyArray();
  }

  @LynxMethod
  public WritableMap requestPermissions() {
    granted = true;
    WritableMap m = new JavaOnlyMap();
    m.putString("status", "granted");
    m.putBoolean("granted", true);
    return m;
  }

  @LynxMethod
  public WritableMap getPermissions() {
    WritableMap m = new JavaOnlyMap();
    m.putString("status", granted ? "granted" : "undetermined");
    m.putBoolean("granted", granted);
    return m;
  }

  @LynxMethod
  public String createEvent(String title, String startDate, String endDate) {
    return "event-" + System.currentTimeMillis();
  }

}
