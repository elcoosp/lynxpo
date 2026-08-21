// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.provider.Settings;
import android.view.WindowManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.brightness.generated.BrightnessModuleSpec;
import com.lynx.jsbridge.Promise;

/**
 * Android counterpart of the iOS {@code BrightnessModule}. Exposes screen
 * brightness to JS via {@code NativeModules.BrightnessModule}, faithfully
 * porting the native method surface of Expo's {@code expo-brightness} (latest)
 * module. Method names MUST match the iOS methodLookup keys so the shared
 * {@code @lynxpo/mods-brightness} accessors resolve on both platforms.
 *
 * <p>The event/permission surface of expo-brightness is intentionally omitted —
 * it requires an async event bridge beyond this module's synchronous contract.
 */
@LynxNativeModule(name = "BrightnessModule")
public class BrightnessModule extends BrightnessModuleSpec {

  public BrightnessModule(android.content.Context context) {
    super(context);
  }

  @LynxMethod
  public float getBrightness() {
    WindowManager.LayoutParams lp = currentAttributes();
    if (lp == null) {
      return getSystemBrightness();
    }
    if (lp.screenBrightness == WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE) {
      return getSystemBrightness();
    }
    return lp.screenBrightness;
  }

  @LynxMethod
  public void setBrightness(float brightnessValue) {
    WindowManager.LayoutParams lp = currentAttributes();
    if (lp == null) {
      return;
    }
    lp.screenBrightness = brightnessValue;
    applyAttributes(lp);
  }

  @LynxMethod
  public float getSystemBrightness() {
    try {
      int mode = Settings.System.getInt(
          mContext.getContentResolver(), Settings.System.SCREEN_BRIGHTNESS_MODE);
      if (mode == Settings.System.SCREEN_BRIGHTNESS_MODE_AUTOMATIC) {
        float adj = Settings.System.getFloat(
            mContext.getContentResolver(), "screen_auto_brightness_adj");
        return (adj + 1.0f) / 2;
      }
      int brightness = Settings.System.getInt(
          mContext.getContentResolver(), Settings.System.SCREEN_BRIGHTNESS);
      return (brightness - 1) / 254f;
    } catch (Settings.SettingNotFoundException e) {
      return 0.5f;
    }
  }

  @LynxMethod
  public boolean isUsingSystemBrightness() {
    WindowManager.LayoutParams lp = currentAttributes();
    return lp != null
        && lp.screenBrightness == WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
  }

  @LynxMethod
  public int getSystemBrightnessMode() {
    try {
      int mode = Settings.System.getInt(
          mContext.getContentResolver(), Settings.System.SCREEN_BRIGHTNESS_MODE);
      return mode == Settings.System.SCREEN_BRIGHTNESS_MODE_AUTOMATIC ? 1 : 2;
    } catch (Settings.SettingNotFoundException e) {
      return 0;
    }
  }

  private WindowManager.LayoutParams currentAttributes() {
    android.app.Activity activity = getActivity();
    if (activity == null) {
      return null;
    }
    return activity.getWindow().getAttributes();
  }

  private void applyAttributes(WindowManager.LayoutParams lp) {
    android.app.Activity activity = getActivity();
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(() -> activity.getWindow().setAttributes(lp));
  }

  private android.app.Activity getActivity() {
    if (mContext instanceof android.app.Activity) {
      return (android.app.Activity) mContext;
    }
    return null;
  }

  @LynxMethod
  public void getBrightnessAsync(final Promise promise) {
    try { promise.resolve(getBrightness()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void setBrightnessAsync(double value, final Promise promise) {
    try { setBrightness((float) value); promise.resolve(null); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void getSystemBrightnessAsync(final Promise promise) {
    try { promise.resolve(getSystemBrightness()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void isUsingSystemBrightnessAsync(final Promise promise) {
    try { promise.resolve(isUsingSystemBrightness()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void getSystemBrightnessModeAsync(final Promise promise) {
    try { promise.resolve(getSystemBrightnessMode()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void addListener(String eventName) { startBrightnessObserver(eventName); }
  @LynxMethod
  public void removeListeners(int count) { stopBrightnessObserver(); }

  private android.database.ContentObserver mBrightnessObserver;
  private String mBrightnessEventName;
  private void emitBrightness() {
    if (mBrightnessEventName == null || mBrightnessObserver == null) return;
    com.lynx.tasm.behavior.LynxContext ctx = (com.lynx.tasm.behavior.LynxContext) mContext;
    com.lynx.react.bridge.JavaOnlyArray params = new com.lynx.react.bridge.JavaOnlyArray();
    params.add(getBrightness());
    ctx.sendGlobalEvent(mBrightnessEventName, params);
  }
  private void startBrightnessObserver(String eventName) {
    mBrightnessEventName = eventName;
    final android.net.Uri uri = android.provider.Settings.System.getUriFor(android.provider.Settings.System.SCREEN_BRIGHTNESS);
    mBrightnessObserver = new android.database.ContentObserver(new android.os.Handler(android.os.Looper.getMainLooper())) {
      @Override public void onChange(boolean selfChange) { emitBrightness(); }
    };
    mContext.getContentResolver().registerContentObserver(uri, true, mBrightnessObserver);
    emitBrightness();
  }
  private void stopBrightnessObserver() {
    if (mBrightnessObserver != null) mContext.getContentResolver().unregisterContentObserver(mBrightnessObserver);
    mBrightnessObserver = null; mBrightnessEventName = null;
  }
}
