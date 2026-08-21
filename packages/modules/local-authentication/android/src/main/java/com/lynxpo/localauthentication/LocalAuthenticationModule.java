// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.app.KeyguardManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.localauthentication.generated.LocalAuthenticationModuleSpec;
import com.lynx.jsbridge.Promise;
import com.lynx.react.bridge.JavaOnlyMap;
import java.lang.reflect.Method;

/**
 * Android counterpart of the iOS {@code LocalAuthenticationModule}. Exposes
 * device biometric/auth state to JS via {@code NativeModules.LocalAuthenticationModule},
 * faithfully porting the native method surface of Expo's
 * {@code expo-local-authentication} (latest) module.
 *
 * Biometric detection is performed via reflection against
 * {@code android.hardware.fingerprint.FingerprintManager} because the Explorer
 * build's effective compile {@code android.jar} predates API 23 and does not
 * expose that package at compile time. Runtime detection still works on devices
 * running API 23+. {@link KeyguardManager} (available on all supported levels)
 * backs the device-secure / enrolled-level fallback. Method names MUST match
 * the iOS {@code methodLookup} keys and the shared
 * {@code @lynxpo/mods-local-authentication} accessors.
 */
@LynxNativeModule(name = "LocalAuthenticationModule")
public class LocalAuthenticationModule extends LocalAuthenticationModuleSpec {

  private static final String FINGERPRINT_FEATURE = "android.hardware.fingerprint";
  private static final String FACE_FEATURE = "android.hardware.face";

  public LocalAuthenticationModule(Context context) {
    super(context);
  }

  private Object getFingerprintManager() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return null;
    }
    try {
      Class<?> fmClass = Class.forName("android.hardware.fingerprint.FingerprintManager");
      return mContext.getSystemService(fmClass);
    } catch (Exception e) {
      return null;
    }
  }

  private boolean callBoolean(Object target, String method) {
    if (target == null) {
      return false;
    }
    try {
      Method m = target.getClass().getMethod(method);
      Object result = m.invoke(target);
      return result instanceof Boolean && (Boolean) result;
    } catch (Exception e) {
      return false;
    }
  }

  private boolean isDeviceSecure() {
    KeyguardManager km = (KeyguardManager) mContext.getSystemService(Context.KEYGUARD_SERVICE);
    return km != null && km.isDeviceSecure();
  }

  @LynxMethod
  public boolean hasHardware() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return false;
    }
    Object fm = getFingerprintManager();
    if (fm != null && callBoolean(fm, "isHardwareDetected")) {
      return true;
    }
    // Feature flag as a fallback (string literal avoids missing compile-time constant).
    return mContext.getPackageManager().hasSystemFeature(FINGERPRINT_FEATURE)
        || mContext.getPackageManager().hasSystemFeature(FACE_FEATURE);
  }

  @LynxMethod
  public boolean isEnrolled() {
    Object fm = getFingerprintManager();
    return callBoolean(fm, "hasEnrolledFingerprints");
  }

  @LynxMethod
  public String getEnrolledLevel() {
    if (isEnrolled()) {
      return "STRONG";
    }
    if (isDeviceSecure()) {
      return "WEAK";
    }
    return "NONE";
  }

  @LynxMethod
  public String supportedAuthenticationTypes() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return "";
    }
    PackageManager pm = mContext.getPackageManager();
    StringBuilder sb = new StringBuilder();
    if (pm.hasSystemFeature(FINGERPRINT_FEATURE)) {
      sb.append("FINGERPRINT");
    }
    if (Build.VERSION.SDK_INT >= 29 && pm.hasSystemFeature(FACE_FEATURE)) {
      if (sb.length() > 0) {
        sb.append(",");
      }
      sb.append("FACE");
    }
    return sb.toString();
  }

  @LynxMethod
  public void hasHardwareAsync(final Promise promise) {
    try {
      promise.resolve(hasHardware());
    } catch (Exception e) {
      promise.reject("ERR_LA", e.getMessage());
    }
  }

  @LynxMethod
  public void isEnrolledAsync(final Promise promise) {
    try {
      promise.resolve(isEnrolled());
    } catch (Exception e) {
      promise.reject("ERR_LA", e.getMessage());
    }
  }

  @LynxMethod
  public void getEnrolledLevelAsync(final Promise promise) {
    try {
      promise.resolve(getEnrolledLevel());
    } catch (Exception e) {
      promise.reject("ERR_LA", e.getMessage());
    }
  }

  @LynxMethod
  public void supportedAuthenticationTypesAsync(final Promise promise) {
    try {
      promise.resolve(supportedAuthenticationTypes());
    } catch (Exception e) {
      promise.reject("ERR_LA", e.getMessage());
    }
  }

  @LynxMethod
  public void authenticateAsync(final String prompt, final Promise promise) {
    // Interactive biometric prompt requires android.hardware.fingerprint at
    // compile time, which the Explorer build's android.jar does not expose.
    // Return a structured, non-crashing result so the JS surface stays honest.
    JavaOnlyMap map = new JavaOnlyMap();
    map.putBoolean("success", false);
    map.putString("error", "Interactive authentication unavailable in this build");
    map.putString("warning", "");
    promise.resolve(map);
  }
}
