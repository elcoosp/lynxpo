// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynxpo.linkpreview;

import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynx.react.bridge.JavaOnlyArray;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;
import com.lynx.tasm.behavior.LynxContext;
import com.lynxpo.linkpreview.generated.LinkPreviewModuleSpec;

@LynxNativeModule(name = "LinkPreviewModule")
public class LinkPreviewModule extends LinkPreviewModuleSpec {

  public LinkPreviewModule(LynxContext context) {
    super(context);
  }

  @LynxMethod
  public WritableMap generateLinkPreviewAsync(String url) {
    WritableMap map = new JavaOnlyMap();
    String safeUrl = url == null ? "" : url;
    map.putString("url", safeUrl);
    map.putString("title", safeUrl);
    map.putNull("description");
    map.putArray("images", new JavaOnlyArray());
    return map;
  }
}
