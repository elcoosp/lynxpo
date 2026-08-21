// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.application.generated.ApplicationModuleSpec;

/**
 * Android counterpart of the iOS {@code ApplicationModule}. Exposes app metadata
 * to JS via {@code NativeModules.ApplicationModule}, faithfully porting the
 * native method surface of Expo's {@code expo-application} (v57) module. Method
 * names MUST match the iOS methodLookup keys so the shared
 * {@code @lynxpo/mods-application} accessors resolve on both platforms.
 *
 * <p>Expo wraps several of these in async TS helpers; the underlying native
 * calls are synchronous, so they are exposed here as synchronous {@link
 * LynxMethod}s (returning the raw value, e.g. install time as epoch ms).
 */
@LynxNativeModule(name = "ApplicationModule")
public class ApplicationModule extends ApplicationModuleSpec {

  public ApplicationModule(Context context) {
    super(context);
  }

  @LynxMethod
  public String applicationName() {
    try {
      return (String) mContext.getPackageManager().getApplicationLabel(
          mContext.getPackageManager().getApplicationInfo(mContext.getPackageName(), 0));
    } catch (Exception ignored) {
      return "";
    }
  }

  @LynxMethod
  public String applicationId() {
    return mContext.getPackageName();
  }

  @LynxMethod
  public String nativeApplicationVersion() {
    try {
      PackageInfo info =
          mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
      return info.versionName;
    } catch (Exception ignored) {
      return "";
    }
  }

  @LynxMethod
  public String nativeBuildVersion() {
    try {
      PackageInfo info =
          mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
      return String.valueOf(getLongVersionCode(info));
    } catch (Exception ignored) {
      return "";
    }
  }

  @LynxMethod
  public String androidId() {
    return Settings.Secure.getString(mContext.getContentResolver(), Settings.Secure.ANDROID_ID);
  }

  @LynxMethod
  public double getInstallationTime() {
    try {
      PackageInfo info =
          mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
      return info.firstInstallTime;
    } catch (Exception ignored) {
      return 0d;
    }
  }

  @LynxMethod
  public double getLastUpdateTime() {
    try {
      PackageInfo info =
          mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
      return info.lastUpdateTime;
    } catch (Exception ignored) {
      return 0d;
    }
  }

  private long getLongVersionCode(PackageInfo info) {
    // versionCode is deprecated above API 28 but resolvable at every SDK level
    // this engine compiles against; nativeBuildVersion is the version code as a
    // string, mirroring Expo's `expo-application` (v57) semantics.
    return info.versionCode;
  }
}
