// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.view.WindowManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.keepawake.generated.KeepAwakeModuleSpec;
import com.lynx.jsbridge.Promise;

/**
 * Android counterpart of the iOS {@code KeepAwakeModule}. Exposes screen-keep
 * to JS via {@code NativeModules.KeepAwakeModule}, faithfully porting the
 * native method surface of Expo's {@code expo-keep-awake} (latest) module.
 * Method names MUST match the iOS methodLookup keys so the shared {@code
 * @lynxpo/mods-keep-awake} accessors resolve on both platforms.
 *
 * <p>Expo wraps these in async TS helpers; the underlying native calls are
 * synchronous commands, so they are exposed here as synchronous {@link
 * LynxMethod}s.
 */
@LynxNativeModule(name = "KeepAwakeModule")
public class KeepAwakeModule extends KeepAwakeModuleSpec {

  private boolean activated = false;

  public KeepAwakeModule(Context context) {
    super(context);
  }

  @LynxMethod
  public void activate() {
    activated = true;
    applyFlag(true);
  }

  @LynxMethod
  public void deactivate() {
    activated = false;
    applyFlag(false);
  }

  @LynxMethod
  public boolean isActivated() {
    return activated;
  }

  private void applyFlag(boolean keepOn) {
    android.app.Activity activity = getActivity();
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(() -> {
      if (keepOn) {
        activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      } else {
        activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      }
    });
  }

  private android.app.Activity getActivity() {
    if (mContext instanceof android.app.Activity) {
      return (android.app.Activity) mContext;
    }
    return null;
  }

  @LynxMethod
  public void activateAsync(final Promise promise) {
    try { activate(); promise.resolve(null); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void deactivateAsync(final Promise promise) {
    try { deactivate(); promise.resolve(null); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void isActivatedAsync(final Promise promise) {
    try { promise.resolve(isActivated()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
}
