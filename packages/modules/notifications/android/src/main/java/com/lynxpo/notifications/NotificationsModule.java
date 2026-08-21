// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.notifications.generated.NotificationsModuleSpec;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;

/**
 * Android counterpart of the iOS {@code NotificationsModule}. Exposes notification availability to
 * JS via {@code NativeModules.NotificationsModule}, faithfully porting the native method surface
 * of Expo's {@code expo-notifications} (latest) module. Method names MUST match the iOS
 * methodLookup keys so the shared {@code @lynxpo/mods-notifications} accessors resolve on both
 * platforms.
 *
 * Note: a real device push token requires Firebase Messaging which is not wired in this explorer;
 * we report registration state and permission status, which is the faithful data surface for the
 * showcase.
 */
@LynxNativeModule(name = "NotificationsModule")
public class NotificationsModule extends NotificationsModuleSpec {

  public NotificationsModule(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableMap permissionsAsync() {
    boolean granted = Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU
        || mContext.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
            == PackageManager.PERMISSION_GRANTED;
    WritableMap map = new JavaOnlyMap();
    map.putString("status", granted ? "granted" : "undetermined");
    map.putBoolean("granted", granted);
    map.putBoolean("canAskAgain", !granted);
    return map;
  }

  /**
   * Asks the host activity to present the system notification-permission dialog. The explorer
   * constructs this module with the activity context, so we cast and delegate.
   */
  @LynxMethod
  public void requestPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
        && mContext instanceof androidx.appcompat.app.AppCompatActivity) {
      androidx.appcompat.app.AppCompatActivity activity =
          (androidx.appcompat.app.AppCompatActivity) mContext;
      androidx.core.app.ActivityCompat.requestPermissions(
          activity,
          new String[] { android.Manifest.permission.POST_NOTIFICATIONS },
          NOTIFICATIONS_PERMISSION_REQUEST_CODE);
    }
  }

  private static final int NOTIFICATIONS_PERMISSION_REQUEST_CODE = 2005;

  @LynxMethod
  public boolean isDeviceRegisteredForRemoteMessages() {
    // Firebase is not wired in this explorer; registration is reported as not-yet-done.
    return false;
  }

  @LynxMethod
  public int badgeCountAsync() {
    return 0;
  }

  @LynxMethod
  public WritableMap devicePushTokenAsync() {
    WritableMap map = new JavaOnlyMap();
    map.putString("data", "");
    return map;
  }
}
