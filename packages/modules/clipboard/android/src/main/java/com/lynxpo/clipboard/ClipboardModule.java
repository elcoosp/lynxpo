// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.clipboard.generated.ClipboardModuleSpec;
import com.lynx.jsbridge.Promise;

/**
 * Android counterpart of the iOS {@code ClipboardModule}. Exposes clipboard
 * access to JS via {@code NativeModules.ClipboardModule}, faithfully porting
 * the native method surface of Expo's {@code expo-clipboard} (latest) module.
 * Method names MUST match the iOS methodLookup keys so the shared {@code
 * @lynxpo/mods-clipboard} accessors resolve on both platforms.
 *
 * <p>The image/URL members and change-event surface of expo-clipboard are
 * intentionally omitted — image handling and async event observation exceed
 * this module's synchronous contract.
 */
@LynxNativeModule(name = "ClipboardModule")
public class ClipboardModule extends ClipboardModuleSpec {

  public ClipboardModule(Context context) {
    super(context);
  }

  @LynxMethod
  public String getString() {
    ClipboardManager cm = clipboardManager();
    if (cm == null || cm.getPrimaryClip() == null
        || cm.getPrimaryClip().getItemCount() == 0) {
      return null;
    }
    CharSequence text = cm.getPrimaryClip().getItemAt(0).getText();
    return text != null ? text.toString() : null;
  }

  @LynxMethod
  public void setString(String text) {
    ClipboardManager cm = clipboardManager();
    if (cm == null) {
      return;
    }
    ClipData clip = ClipData.newPlainText(null, text);
    cm.setPrimaryClip(clip);
  }

  @LynxMethod
  public boolean hasString() {
    ClipboardManager cm = clipboardManager();
    return cm != null && cm.getPrimaryClip() != null
        && cm.getPrimaryClip().getItemCount() > 0
        && cm.getPrimaryClip().getItemAt(0).getText() != null;
  }

  private ClipboardManager clipboardManager() {
    return (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
  }

  @LynxMethod
  public void getStringAsync(final Promise promise) {
    try { promise.resolve(getString()); } catch (Exception e) { promise.reject("ERR_CLIPBOARD", e.getMessage()); }
  }
  @LynxMethod
  public void setStringAsync(String text, final Promise promise) {
    try { setString(text); promise.resolve(null); } catch (Exception e) { promise.reject("ERR_CLIPBOARD", e.getMessage()); }
  }
  @LynxMethod
  public void hasStringAsync(final Promise promise) {
    try { promise.resolve(hasString()); } catch (Exception e) { promise.reject("ERR_CLIPBOARD", e.getMessage()); }
  }
}
