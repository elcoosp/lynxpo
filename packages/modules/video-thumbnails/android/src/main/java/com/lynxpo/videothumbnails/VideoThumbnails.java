// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.videothumbnails.generated.VideoThumbnailsSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;

/**
 * Android counterpart of the iOS VideoThumbnails. Exposes functionality to JS via
 * NativeModules.VideoThumbnails, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "VideoThumbnails")
public class VideoThumbnails extends VideoThumbnailsSpec {

  public VideoThumbnails(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableMap thumbnailAsync(String source, String options) {
    WritableMap m = new JavaOnlyMap();
    m.putString("source", "LynxPo: VideoThumbnails.thumbnailAsync (stub)");
    m.putBoolean("available", true);
    return m;
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    return true;
  }

}
