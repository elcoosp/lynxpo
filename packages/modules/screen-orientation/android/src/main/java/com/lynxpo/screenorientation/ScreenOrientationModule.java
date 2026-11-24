// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import com.lynx.tasm.behavior.LynxContext;
import android.content.Context;
import android.content.pm.ActivityInfo;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.screenorientation.generated.ScreenOrientationModuleSpec;
import com.lynx.jsbridge.Promise;

/**
 * Android counterpart of the iOS {@code ScreenOrientationModule}. Exposes
 * screen orientation to JS via {@code NativeModules.ScreenOrientationModule},
 * faithfully porting the native method surface of Expo's {@code
 * expo-screen-orientation} (latest) module. Method names MUST match the iOS
 * methodLookup keys so the shared {@code @lynxpo/mods-screen-orientation}
 * accessors resolve on both platforms.
 */
@LynxNativeModule(name = "ScreenOrientationModule")
public class ScreenOrientationModule extends ScreenOrientationModuleSpec {

  // Orientation enum mirrors Expo's Orientation (UNKNOWN=0, PORTRAIT_UP=1,
  // PORTRAIT_DOWN=2, LANDSCAPE_LEFT=3, LANDSCAPE_RIGHT=4).
  public ScreenOrientationModule(LynxContext context) {
    super(context);
  }

  @LynxMethod
  public double getOrientation() {
    android.app.Activity activity = getActivity();
    if (activity == null) {
      return 0d; // UNKNOWN
    }
    int rotation = activity.getWindowManager().getDefaultDisplay().getRotation();
    int width = activity.getResources().getConfiguration().screenWidthDp;
    int height = activity.getResources().getConfiguration().screenHeightDp;
    boolean isNaturalPortrait = height >= width;
    switch (rotation) {
      case android.view.Surface.ROTATION_0:
        return isNaturalPortrait ? 1d : 4d; // PORTRAIT_UP or LANDSCAPE_RIGHT
      case android.view.Surface.ROTATION_90:
        return isNaturalPortrait ? 3d : 1d; // LANDSCAPE_LEFT or PORTRAIT_UP
      case android.view.Surface.ROTATION_180:
        return isNaturalPortrait ? 2d : 3d; // PORTRAIT_DOWN or LANDSCAPE_LEFT
      case android.view.Surface.ROTATION_270:
        return isNaturalPortrait ? 4d : 2d; // LANDSCAPE_RIGHT or PORTRAIT_DOWN
      default:
        return 0d; // UNKNOWN
    }
  }

  @LynxMethod
  public double getOrientationLock() {
    android.app.Activity activity = getActivity();
    if (activity == null) {
      return 0d; // UNKNOWN
    }
    int req = activity.getRequestedOrientation();
    switch (req) {
      case ActivityInfo.SCREEN_ORIENTATION_PORTRAIT:
        return 1d; // PORTRAIT_UP
      case ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE:
        return 3d; // LANDSCAPE_LEFT
      case ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR:
        return 7d; // ALL
      case ActivityInfo.SCREEN_ORIENTATION_SENSOR:
        return 8d; // SENSOR
      default:
        return 0d; // UNKNOWN
    }
  }

  @LynxMethod
  public void lock(double orientation) {
    android.app.Activity activity = getActivity();
    if (activity == null) {
      return;
    }
    activity.setRequestedOrientation(mapOrientation((int) orientation));
  }

  @LynxMethod
  public void lockPlatform(double orientationLock) {
    android.app.Activity activity = getActivity();
    if (activity == null) {
      return;
    }
    activity.setRequestedOrientation(mapOrientationLock((int) orientationLock));
  }

  @LynxMethod
  public boolean supportsOrientationLock() {
    return true;
  }

  private int mapOrientation(int orientation) {
    switch (orientation) {
      case 1:
        return ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
      case 2:
        return ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT;
      case 3:
        return ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
      case 4:
        return ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE;
      default:
        return ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED;
    }
  }

  private int mapOrientationLock(int lock) {
    switch (lock) {
      case 1:
      case 2:
        return ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
      case 3:
      case 4:
        return ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
      case 7:
        return ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR;
      case 8:
        return ActivityInfo.SCREEN_ORIENTATION_SENSOR;
      default:
        return ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED;
    }
  }

  private android.app.Activity getActivity() {
    if (mContext instanceof android.app.Activity) {
      return (android.app.Activity) mContext;
    }
    return null;
  }

  @LynxMethod
  public Object getOrientationAsync() {
    return getOrientation();
  }
  @LynxMethod
  public Object getOrientationLockAsync() {
    return getOrientationLock();
  }
  @LynxMethod
  public Object lockAsync(double orientation) {
    lock(orientation);
    return null;
  }
  @LynxMethod
  public Object unlockAsync() {
    lock(0d);
    return null;
  }
  @LynxMethod
  public Object lockPlatformAsync(double orientation) {
    lockPlatform(orientation);
    return null;
  }
  @LynxMethod
  public Object supportsOrientationLockAsync() {
    return supportsOrientationLock();
  }
  @LynxMethod
  public void addListener(String eventName) { startOrientationObserver(eventName); }
  @LynxMethod
  public void removeListeners(double count) { stopOrientationObserver(); }

  private android.view.OrientationEventListener mOriListener;
  private String mOriEventName;
  private void emitOrientation() {
    if (mOriEventName == null) return;
    com.lynx.tasm.behavior.LynxContext ctx = (com.lynx.tasm.behavior.LynxContext) mContext;
    com.lynx.react.bridge.JavaOnlyArray params = new com.lynx.react.bridge.JavaOnlyArray();
    params.add(getOrientation());
    ctx.sendGlobalEvent(mOriEventName, params);
  }
  private void startOrientationObserver(String eventName) {
    mOriEventName = eventName;
    mOriListener = new android.view.OrientationEventListener(mContext) {
      @Override public void onOrientationChanged(int o) { emitOrientation(); }
    };
    if (mOriListener.canDetectOrientation()) mOriListener.enable();
    emitOrientation();
  }
  private void stopOrientationObserver() {
    if (mOriListener != null) mOriListener.disable();
    mOriListener = null; mOriEventName = null;
  }
}
