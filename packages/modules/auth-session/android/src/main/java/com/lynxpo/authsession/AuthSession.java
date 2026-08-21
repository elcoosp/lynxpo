// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.authsession.generated.AuthSessionSpec;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;

/**
 * Android runtime twin of AuthSession (expo-auth-session). Exposes the real
 * redirect URI computation (reverse DNS of the bundle id + the
 * expo-auth-session callback path) and discovery of which OAuth providers can
 * be handled by an installed native app (Google / Facebook) via
 * PackageManager.queryIntentActivities.
 */
@LynxNativeModule(name = "AuthSession")
public class AuthSession extends AuthSessionSpec {

  public AuthSession(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    return mContext != null;
  }

  @LynxMethod
  public String redirectUriAsync() {
    Context ctx = mContext;
    if (ctx == null) {
      return "";
    }
    String pkg = ctx.getPackageName();
    String reversed = new StringBuilder(pkg).reverse().toString();
    return "com." + reversed + "://expo-auth-session";
  }

  @LynxMethod
  public WritableMap providerInfoAsync() {
    WritableMap map = new JavaOnlyMap();
    Context ctx = mContext;
    if (ctx == null) {
      map.putBoolean("available", false);
      return map;
    }
    PackageManager pm = ctx.getPackageManager();
    boolean google = false;
    boolean facebook = false;
    try {
      // Google sign-in app exposes this activity.
      google = pm.getPackageInfo("com.google.android.gms", 0) != null;
    } catch (PackageManager.NameNotFoundException e) {
      google = false;
    }
    try {
      facebook = pm.getPackageInfo("com.facebook.katana", 0) != null;
    } catch (PackageManager.NameNotFoundException e) {
      facebook = false;
    }
    map.putBoolean("available", true);
    map.putBoolean("google", google);
    map.putBoolean("facebook", facebook);
    map.putString("scheme", redirectUriAsync());
    map.putString("source", "PackageManager");
    return map;
  }
}
