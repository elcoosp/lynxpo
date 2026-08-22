// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "HostTemplateProvider.h"

@implementation HostTemplateProvider

- (void)loadTemplateWithUrl:(NSString *)url
                 onComplete:(LynxTemplateLoadBlock)callback {
  if (callback == nil) {
    return;
  }

  // Accept either a bare name ("host.lynx.bundle") or a file:// URL.
  NSString *resourceName = url;
  if ([resourceName hasPrefix:@"file://"]) {
    resourceName = [resourceName lastPathComponent];
  }
  NSString *baseName = [resourceName stringByDeletingPathExtension];
  NSString *extension = [resourceName pathExtension];

  NSString *path = [[NSBundle mainBundle] pathForResource:baseName ofType:extension];
  if (path == nil) {
    // Fall back to the default host bundle name.
    path = [[NSBundle mainBundle] pathForResource:@"host.lynx" ofType:@"bundle"];
  }

  NSError *error = nil;
  NSData *data = nil;
  if (path != nil) {
    data = [NSData dataWithContentsOfFile:path options:0 error:&error];
  }

  if (data == nil) {
    NSString *description =
        [NSString stringWithFormat:@"HostTemplateProvider: cannot load template '%@' (path=%@)",
                                   url, path];
    error = [NSError errorWithDomain:@"org.lynxpo.host"
                                 code:404
                             userInfo:@{NSLocalizedDescriptionKey : description}];
  }

  callback(data, error);
}

@end
