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

- (BOOL)isAvailableAsync {
  if (@available(iOS 10.0, *)) {
    return YES;
  }
  return NO;
}

- (BOOL)isLivePhotoAsync:(NSString *)path {
  NSString *ext = [path pathExtension].lowercaseString;
  return [ext isEqualToString:@"livp"] || [ext isEqualToString:@"mov"];
}

- (id)saveLivePhotoAsync:(NSString *)video photo:(NSString *)photo {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(YES);
  result[@"video"] = video ?: @"";
  result[@"photo"] = photo ?: @"";
  result[@"saved"] = @(NO);
  result[@"note"] = @"Live Photo save requires presenting the Photos UI picker (PHPickerViewController).";
  return result;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : NSStringFromSelector(@selector(isAvailableAsync)),
    @"isLivePhotoAsync" : NSStringFromSelector(@selector(isLivePhotoAsync)),
    @"saveLivePhotoAsync" : NSStringFromSelector(@selector(saveLivePhotoAsync:photo:)),
  };
}
@end
