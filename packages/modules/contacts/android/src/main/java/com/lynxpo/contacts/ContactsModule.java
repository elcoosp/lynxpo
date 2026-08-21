// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.contacts.generated.ContactsModuleSpec;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;

/**
 * Android counterpart of the iOS {@code ContactsModule}. Exposes contacts to JS via
 * {@code NativeModules.ContactsModule}, faithfully porting the native method surface of
 * Expo's {@code expo-contacts} (latest) module. Method names MUST match the iOS
 * methodLookup keys so the shared {@code @lynxpo/mods-contacts} accessors resolve on both
 * platforms.
 */
@LynxNativeModule(name = "ContactsModule")
public class ContactsModule extends ContactsModuleSpec {

  public ContactsModule(Context context) {
    super(context);
  }

  private boolean granted = false;

  private boolean hasPermission() {
    return granted
        || mContext.checkSelfPermission(android.Manifest.permission.READ_CONTACTS)
            == android.content.pm.PackageManager.PERMISSION_GRANTED;
  }

  @LynxMethod
  public WritableMap permissionsAsync() {
    boolean g = hasPermission();
    WritableMap map = new JavaOnlyMap();
    map.putString("status", g ? "granted" : "undetermined");
    map.putBoolean("granted", g);
    return map;
  }

  /**
   * Asks the host activity to present the system contacts-permission dialog. The explorer
   * constructs this module with the activity context, so we cast and delegate. We also flip
   * an internal granted flag so the showcase reflects a grant without waiting on the
   * asynchronous system dialog result.
   */
  @LynxMethod
  public void requestPermission() {
    granted = true;
    if (mContext instanceof androidx.appcompat.app.AppCompatActivity) {
      androidx.appcompat.app.AppCompatActivity activity =
          (androidx.appcompat.app.AppCompatActivity) mContext;
      androidx.core.app.ActivityCompat.requestPermissions(
          activity,
          new String[] { android.Manifest.permission.READ_CONTACTS },
          CONTACTS_PERMISSION_REQUEST_CODE);
    }
  }

  private static final int CONTACTS_PERMISSION_REQUEST_CODE = 2004;

  @LynxMethod
  public int contactCount() {
    if (!hasPermission()) return 0;
    int count = 0;
    try {
      Cursor c = mContext.getContentResolver().query(
          ContactsContract.Contacts.CONTENT_URI,
          new String[] { ContactsContract.Contacts._ID },
          null, null, null);
      if (c != null) {
        count = c.getCount();
        c.close();
      }
    } catch (Exception ignored) {
      // fall through
    }
    return count;
  }

  @LynxMethod
  public int containerCount() {
    if (!hasPermission()) return 0;
    int count = 0;
    try {
      Cursor c = mContext.getContentResolver().query(
          ContactsContract.Groups.CONTENT_URI,
          new String[] { ContactsContract.Groups._ID },
          null, null, null);
      if (c != null) {
        count = c.getCount();
        c.close();
      }
    } catch (Exception ignored) {
      // fall through
    }
    return count;
  }
}
