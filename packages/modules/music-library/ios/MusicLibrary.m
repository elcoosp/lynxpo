// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "MusicLibrary.h"
#import <Foundation/Foundation.h>

@implementation MusicLibrary

+ (NSString *)name {
 return @"MusicLibrary";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getAlbums" : NSStringFromSelector(@selector(getAlbums)),
  @"getSongs" : NSStringFromSelector(@selector(getSongsWithAlbumId:(NSString *)albumId)),
  @"requestPermissions" : NSStringFromSelector(@selector(requestPermissions)),
  @"getPermissions" : NSStringFromSelector(@selector(getPermissions)),
 };
}

- (NSArray *)getAlbums {
 return @[];
}

- (NSArray *)getSongsWithAlbumId:(NSString *)albumId {
 return @[];
}

- (NSDictionary *)requestPermissions {
 return @{ @"status": @"undetermined", @"granted": @NO };
}

- (NSDictionary *)getPermissions {
 return @{ @"status": @"undetermined", @"granted": @NO };
}

@end
