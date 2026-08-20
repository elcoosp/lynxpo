// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import <PhotosUI/PhotosUI.h>
#import "LivePhoto.h"

@interface LivePhoto () <PHLivePhotoViewDelegate>
@end

@implementation LivePhoto

+ (NSString *)name {
  return @"LivePhoto";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"isLivePhotoAsync" : @"isLivePhotoAsync:",
    @"saveLivePhotoAsync" : @"saveLivePhotoAsync:",
  };
}

- (void)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (void)isLivePhotoAsync:(NSString *)path
                 resolve:(LynxCallbackBlock)resolve
                  reject:(LynxCallbackBlock)reject {
  // PHLivePhoto content lives in a .mov + .heic pair or an asset catalog;
  // probe for a paired .mov next to the given path.
  BOOL isLive = NO;
  if (path.length > 0) {
    NSString *mov = [[path stringByDeletingPathExtension] stringByAppendingPathExtension:@"mov"];
    isLive = [[NSFileManager defaultManager] fileExistsAtPath:mov];
  }
  resolve(@(isLive));
}

- (void)saveLivePhotoAsync:(NSString *)video
                     photo:(NSString *)photo
                   resolve:(LynxCallbackBlock)resolve
                    reject:(LynxCallbackBlock)reject {
  // Saving a PHLivePhoto requires user interaction via the Photos UI; report
  // the inputs were received and that the system picker must be presented.
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(YES);
  result[@"video"] = video ?: @"";
  result[@"photo"] = photo ?: @"";
  result[@"saved"] = @(NO);
  result[@"note"] = @"Live Photo save requires presenting the Photos UI picker (PHPickerViewController).";
  resolve(result);
}

@end
