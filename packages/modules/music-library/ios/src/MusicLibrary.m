// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "MusicLibrary.h"
#import <Foundation/Foundation.h>

@implementation MusicLibrary

- (id)getAlbums {
  return @[];
}

- (id)getSongs:(NSString *)albumId {
  (void)albumId;
  return @[];
}

- (id)requestPermissions {
  return @{ @"status": @"undetermined", @"granted": @NO };
}

- (id)getPermissions {
  return @{ @"status": @"undetermined", @"granted": @NO };
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getAlbums" : NSStringFromSelector(@selector(getAlbums)),
    @"getPermissions" : NSStringFromSelector(@selector(getPermissions)),
    @"getSongs" : NSStringFromSelector(@selector(getSongs)),
    @"requestPermissions" : NSStringFromSelector(@selector(requestPermissions)),
  };
}
@end
