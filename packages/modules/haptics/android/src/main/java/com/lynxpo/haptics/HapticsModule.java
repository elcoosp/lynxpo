// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.haptics.generated.HapticsModuleSpec;
import com.lynx.jsbridge.Promise;

/**
 * Android counterpart of the iOS {@code HapticsModule}. Exposes haptic feedback
 * to JS via {@code NativeModules.HapticsModule}, faithfully porting the native
 * method surface of Expo's {@code expo-haptics} (latest) module. Method names
 * MUST match the iOS methodLookup keys so the shared {@code @lynxpo/mods-
 * haptics} accessors resolve on both platforms.
 *
 * <p>Expo wraps these in async TS helpers; the underlying native calls are
 * synchronous commands, so they are exposed here as synchronous {@link
 * LynxMethod}s.
 */
@LynxNativeModule(name = "HapticsModule")
public class HapticsModule extends HapticsModuleSpec {

  // Feedback style enums mirror Expo's HapticsFeedbackType / ImpactStyle.
  private static final int IMPACT_LIGHT = 0;
  private static final int IMPACT_MEDIUM = 1;
  private static final int IMPACT_HEAVY = 2;
  private static final int IMPACT_RIGID = 3;
  private static final int IMPACT_SOFT = 4;

  private static final int NOTIFICATION_SUCCESS = 0;
  private static final int NOTIFICATION_WARNING = 1;
  private static final int NOTIFICATION_ERROR = 2;

  public HapticsModule(Context context) {
    super(context);
  }

  @LynxMethod
  public void impactAsync(int style) {
    Vibrator vibrator = vibrator();
    if (vibrator == null) {
      return;
    }
    long duration;
    int amplitude;
    switch (style) {
      case IMPACT_LIGHT:
        duration = 20;
        amplitude = 60;
        break;
      case IMPACT_MEDIUM:
        duration = 35;
        amplitude = 120;
        break;
      case IMPACT_HEAVY:
        duration = 50;
        amplitude = 255;
        break;
      case IMPACT_RIGID:
        duration = 20;
        amplitude = 255;
        break;
      case IMPACT_SOFT:
        duration = 40;
        amplitude = 80;
        break;
      default:
        duration = 20;
        amplitude = 120;
        break;
    }
    vibrate(vibrator, duration, amplitude);
  }

  @LynxMethod
  public void notificationAsync(int type) {
    Vibrator vibrator = vibrator();
    if (vibrator == null) {
      return;
    }
    switch (type) {
      case NOTIFICATION_SUCCESS:
        vibrate(vibrator, new long[] {0, 30, 60, 30}, -1);
        break;
      case NOTIFICATION_WARNING:
        vibrate(vibrator, new long[] {0, 30, 60, 30, 60, 30}, -1);
        break;
      case NOTIFICATION_ERROR:
        vibrate(vibrator, new long[] {0, 40, 50, 40, 50, 40}, -1);
        break;
      default:
        vibrate(vibrator, 30, 120);
        break;
    }
  }

  @LynxMethod
  public void selectionAsync() {
    Vibrator vibrator = vibrator();
    if (vibrator == null) {
      return;
    }
    vibrate(vibrator, 15, 40);
  }

  private Vibrator vibrator() {
    return (Vibrator) mContext.getSystemService(Context.VIBRATOR_SERVICE);
  }

  private void vibrate(Vibrator vibrator, long duration, int amplitude) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      vibrator.vibrate(VibrationEffect.createOneShot(duration, amplitude));
    } else {
      // method deprecated in API 26
      vibrator.vibrate(duration);
    }
  }

  private void vibrate(Vibrator vibrator, long[] pattern, int repeat) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      vibrator.vibrate(VibrationEffect.createWaveform(pattern, repeat));
    } else {
      vibrator.vibrate(pattern, repeat);
    }
  }

  @LynxMethod
  public void impactAsync(int style, final Promise promise) {
    try { impactAsync(style); promise.resolve(null); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void notificationAsync(int type, final Promise promise) {
    try { notificationAsync(type); promise.resolve(null); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void selectionAsync(final Promise promise) {
    try { selectionAsync(); promise.resolve(null); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
}
