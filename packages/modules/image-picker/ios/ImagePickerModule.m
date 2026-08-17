// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ImagePickerModule.h"
#import <UIKit/UIKit.h>

@implementation ImagePickerModule

+ (NSString *)name {
  return @"ImagePickerModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getCameraPermissions" : NSStringFromSelector(@selector(getCameraPermissions)),
    @"getMediaLibraryPermissions" : NSStringFromSelector(@selector(getMediaLibraryPermissions)),
  };
}

- (NSDictionary *)permissionStatus:(NSString *)usage {
  // iOS does not expose synchronous permission checks; reflect "undetermined".
  return @{
    @"status" : @"undetermined",
    @"granted" : @NO,
    @"canAskAgain" : @YES,
    @"expires" : @"never",
  };
}

- (NSDictionary *)getCameraPermissions {
  return [self permissionStatus:@"camera"];
}

- (NSDictionary *)getMediaLibraryPermissions {
  return [self permissionStatus:@"photos"];
}

- (void)getCameraPermissionsAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getCameraPermissions]); } @catch (NSException *e) { reject(e.reason); }
}
- (void)getMediaLibraryPermissionsAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getMediaLibraryPermissions]); } @catch (NSException *e) { reject(e.reason); }
}
- (void)launchImageLibraryAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getMediaLibraryPermissions]); } @catch (NSException *e) { reject(e.reason); }
}
- (void)launchCameraAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getCameraPermissions]); } @catch (NSException *e) { reject(e.reason); }
}

@end
