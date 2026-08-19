// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>
#import <Photos/Photos.h>
#import <PhotosUI/PhotosUI.h>

@interface LivePhoto () <LynxModule>
@end

@implementation LivePhoto

+ (NSString *)name {
  return @"LivePhoto";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"isLivePhotoAsync" : @"isLivePhotoAsync:",
    @"saveLivePhotoAsync" : @"saveLivePhotoAsync:photo:",
  };
}

- (BOOL)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  // PHLivePhoto is iOS 9.1+; saving to the Photos library requires authorization.
  if (@available(iOS 9.1, *)) {
    resolve(@(YES));
  } else {
    resolve(@(NO));
  }
  return YES;
}

- (BOOL)isLivePhotoAsync:(NSString *)path resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  BOOL isLive = NO;
  NSString *ext = [path.pathExtension.lowercaseString copy];
  if ([ext isEqualToString:@"mov"]) {
    // A .mov that is part of a Live Photo pair is identified by the companion
    // .heic; standalone we treat a mov alongside a same-named heic as a live photo.
    NSString *heic = [[path stringByDeletingPathExtension] stringByAppendingPathExtension:@"heic"];
    isLive = [[NSFileManager defaultManager] fileExistsAtPath:heic];
  } else if ([ext isEqualToString:@"heic"]) {
    NSString *mov = [[path stringByDeletingPathExtension] stringByAppendingPathExtension:@"mov"];
    isLive = [[NSFileManager defaultManager] fileExistsAtPath:mov];
  }
  resolve(@(isLive));
  return YES;
}

- (BOOL)saveLivePhotoAsync:(NSString *)video photo:(NSString *)photo resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  if (@available(iOS 10.0, *)) {
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
      if (status != PHAuthorizationStatusAuthorized) {
        resolve(@(NO));
        return;
      }
      [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
        if (@available(iOS 10.0, *)) {
          [PHLivePhotoCreationRequest creationRequestForAsset]
              .addResourceWithType:PHAssetResourceTypePhoto
                             fileURL:[NSURL fileURLWithPath:photo]
                            options:nil];
          [[PHLivePhotoCreationRequest creationRequestForAsset]
              addResourceWithType:PHAssetResourceTypePairedVideo
                           fileURL:[NSURL fileURLWithPath:video]
                          options:nil];
        }
      } completionHandler:^(BOOL success, NSError * _Nullable error) {
        resolve(@(success));
      }];
    }];
    return YES;
  }
  resolve(@(NO));
  return YES;
}

@end
