// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynxpo.quickactions;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.drawable.Icon;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynx.react.bridge.JavaOnlyArray;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.WritableMap;
import com.lynx.tasm.behavior.LynxContext;
import com.lynxpo.quickactions.generated.QuickActionsModuleSpec;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

@LynxNativeModule(name = "QuickActionsModule")
public class QuickActionsModule extends QuickActionsModuleSpec {

  private final SharedPreferences prefs;

  public QuickActionsModule(LynxContext context) {
    super(context);
    prefs = mContext.getSharedPreferences("lynxpo_quick_actions", Context.MODE_PRIVATE);
  }

  @LynxMethod
  public WritableArray getShortcutItemsAsync() {
    WritableArray out = new JavaOnlyArray();
    ShortcutManager manager =
        (ShortcutManager) mContext.getSystemService(Context.SHORTCUT_SERVICE);
    if (manager == null) {
      return out;
    }
    for (ShortcutInfo info : manager.getDynamicShortcuts()) {
      WritableMap item = new JavaOnlyMap();
      item.putString("type", info.getId());
      item.putString("title", info.getShortLabel() == null ? "" : info.getShortLabel().toString());
      item.putString("subtitle", info.getLongLabel() == null ? "" : info.getLongLabel().toString());
      out.pushMap(item);
    }
    return out;
  }

  @LynxMethod
  public void setShortcutItemsAsync(String items) {
    ShortcutManager manager =
        (ShortcutManager) mContext.getSystemService(Context.SHORTCUT_SERVICE);
    if (manager == null) {
      return;
    }
    List<ShortcutInfo> shortcuts = new ArrayList<>();
    try {
      JSONArray array = new JSONArray(items == null ? "[]" : items);
      for (int i = 0; i < array.length(); i++) {
        JSONObject item = array.getJSONObject(i);
        String type = item.optString("type", "shortcut-" + i);
        String title = item.optString("title", type);
        shortcuts.add(new ShortcutInfo.Builder(mContext, type)
            .setShortLabel(title)
            .setLongLabel(title)
            .setIcon(Icon.createWithResource(mContext.getPackageName(), android.R.drawable.ic_menu_compass))
            .build());
      }
    } catch (Exception ignored) {
      return;
    }
    manager.setDynamicShortcuts(shortcuts);
  }

  @LynxMethod
  public void clearShortcutItemsAsync() {
    ShortcutManager manager =
        (ShortcutManager) mContext.getSystemService(Context.SHORTCUT_SERVICE);
    if (manager != null) {
      manager.removeAllDynamicShortcuts();
    }
    prefs.edit().remove("initialAction").apply();
  }

  @LynxMethod
  public WritableMap initialActionAsync() {
    String raw = prefs.getString("initialAction", null);
    if (raw == null) {
      return null;
    }
    try {
      JSONObject json = new JSONObject(raw);
      WritableMap out = new JavaOnlyMap();
      out.putString("type", json.optString("type", ""));
      out.putString("title", json.optString("title", ""));
      out.putString("subtitle", json.optString("subtitle", ""));
      return out;
    } catch (Exception ignored) {
      return null;
    }
  }
}
