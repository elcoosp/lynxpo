    // Copyright 2026 The Lynxpo Authors. All rights reserved.
    // Licensed under the Apache License Version 2.0 that can be found in the
    // LICENSE file in the root directory of this source tree.

    #import "LinkPreviewModule.h"

    @implementation LinkPreviewModule

    - (id)generateLinkPreviewAsync:(NSString *)url {
  if (@available(iOS 13.0, *)) {
    // Best-effort synchronous summary; full async LPMetadataProvider fetch
    // is network-dependent and returned via the deprecated promise API.
    return @{ @"url": url ?: @"", @"title": url ?: @"", @"description": [NSNull null],
              @"images": @[] };
  }
  return @{ @"url": url ?: @"" };
}

    #pragma mark - LynxModule protocol

    + (NSDictionary<NSString *, NSString *> *)methodLookup {
      return @{
    @"generateLinkPreviewAsync" : NSStringFromSelector(@selector(generateLinkPreviewAsync:)),
      };
    }
    @end

