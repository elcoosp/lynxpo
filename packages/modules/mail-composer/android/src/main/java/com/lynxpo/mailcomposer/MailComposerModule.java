// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.mailcomposer.generated.MailComposerModuleSpec;
import com.lynx.jsbridge.Promise;
import com.lynx.react.bridge.JavaOnlyArray;
import java.util.ArrayList;
import java.util.List;

/**
 * Android counterpart of the iOS {@code MailComposerModule}. Exposes mail
 * composition to JS via {@code NativeModules.MailComposerModule}, faithfully
 * porting the native method surface of Expo's {@code expo-mail-composer}
 * (latest) module. Method names MUST match the iOS methodLookup keys so the
 * shared {@code @lynxpo/mods-mail-composer} accessors resolve on both
 * platforms.
 */
@LynxNativeModule(name = "MailComposerModule")
public class MailComposerModule extends MailComposerModuleSpec {

  public MailComposerModule(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailable() {
    Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.fromParts("mailto", "", null));
    PackageManager pm = mContext.getPackageManager();
    return intent.resolveActivity(pm) != null;
  }

  @LynxMethod
  public JavaOnlyArray getClients() {
    JavaOnlyArray clients = new JavaOnlyArray();
    Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.fromParts("mailto", "", null));
    PackageManager pm = mContext.getPackageManager();
    List<ResolveInfo> resolveInfos =
        pm.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
    for (ResolveInfo info : resolveInfos) {
      clients.pushString(info.activityInfo.packageName);
    }
    return clients;
  }

  @LynxMethod
  public void compose(String subject, String body, String recipients) {
    Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.fromParts("mailto", "", null));
    if (recipients != null && !recipients.isEmpty()) {
      intent.putExtra(Intent.EXTRA_EMAIL, recipients.split(","));
    }
    if (subject != null) {
      intent.putExtra(Intent.EXTRA_SUBJECT, subject);
    }
    if (body != null) {
      intent.putExtra(Intent.EXTRA_TEXT, body);
    }
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    mContext.startActivity(intent);
  }

  @LynxMethod
  public void isAvailableAsync(final Promise promise) {
    try {
      promise.resolve(isAvailable());
    } catch (Exception e) {
      promise.reject("ERROR", e.getMessage());
    }
  }

  @LynxMethod
  public void getClientsAsync(final Promise promise) {
    try {
      promise.resolve(getClients());
    } catch (Exception e) {
      promise.reject("ERROR", e.getMessage());
    }
  }

  @LynxMethod
  public void composeAsync(String subject, String body, String recipients, final Promise promise) {
    try {
      compose(subject, body, recipients);
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject("ERROR", e.getMessage());
    }
  }
}
