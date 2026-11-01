// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynxpo.receivesharing;

import android.content.Context;
import android.content.SharedPreferences;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynx.react.bridge.JavaOnlyArray;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;
import com.lynx.tasm.behavior.LynxContext;
import com.lynxpo.receivesharing.generated.ReceiveSharingModuleSpec;
import org.json.JSONArray;
import org.json.JSONObject;

@LynxNativeModule(name = "ReceiveSharingModule")
public class ReceiveSharingModule extends ReceiveSharingModuleSpec {

  private final SharedPreferences prefs;

  public ReceiveSharingModule(LynxContext context) {
    super(context);
    prefs = mContext.getSharedPreferences("lynxpo_receive_sharing", Context.MODE_PRIVATE);
  }

  @LynxMethod
  public WritableMap getInitialIntentAsync() {
    String raw = prefs.getString("intent", null);
    if (raw == null) {
      return null;
    }
    try {
      JSONObject json = new JSONObject(raw);
      WritableMap out = new JavaOnlyMap();
      out.putString("action", json.optString("action", ""));
      out.putString("type", json.optString("type", ""));
      out.putString("text", json.optString("text", ""));
      out.putString("url", json.optString("url", ""));
      JSONArray files = json.optJSONArray("files");
      JavaOnlyArray array = new JavaOnlyArray();
      if (files != null) {
        for (int i = 0; i < files.length(); i++) {
          array.pushString(files.optString(i, ""));
        }
      }
      out.putArray("files", array);
      return out;
    } catch (Exception ignored) {
      return null;
    }
  }

  @LynxMethod
  public boolean hasIntentAsync() {
    return prefs.contains("intent");
  }

  @LynxMethod
  public void addListener(String event) {
  }
}
