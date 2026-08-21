// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.storereview.generated.StoreReviewModuleSpec;
import com.lynx.jsbridge.Promise;

/**
 * Android counterpart of the iOS {@code StoreReviewModule}. Exposes store
 * review to JS via {@code NativeModules.StoreReviewModule}, faithfully porting
 * the native method surface of Expo's {@code expo-store-review} (latest)
 * module. Method names MUST match the iOS methodLookup keys so the shared
 * {@code @lynxpo/mods-store-review} accessors resolve on both platforms.
 */
@LynxNativeModule(name = "StoreReviewModule")
public class StoreReviewModule extends StoreReviewModuleSpec {

  public StoreReviewModule(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailable() {
    return isPlayStoreInstalled();
  }

  @LynxMethod
  public void requestReview() {
    if (!isPlayStoreInstalled()) {
      return;
    }
    String packageName = mContext.getPackageName();
    try {
      Intent intent = new Intent(Intent.ACTION_VIEW,
          Uri.parse("market://details?id=" + packageName));
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      mContext.startActivity(intent);
    } catch (android.content.ActivityNotFoundException e) {
      // Fall back to the web Play Store if the app isn't installed.
      Intent intent = new Intent(Intent.ACTION_VIEW,
          Uri.parse("https://play.google.com/store/apps/details?id=" + packageName));
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      mContext.startActivity(intent);
    }
  }

  private boolean isPlayStoreInstalled() {
    PackageManager pm = mContext.getPackageManager();
    try {
      pm.getPackageInfo("com.android.vending", 0);
      return true;
    } catch (PackageManager.NameNotFoundException e) {
      return false;
    }
  }

  @LynxMethod
  public void isAvailableAsync(final Promise promise) {
    try { promise.resolve(isAvailable()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void requestReviewAsync(final Promise promise) {
    try { requestReview(); promise.resolve(null); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
}
