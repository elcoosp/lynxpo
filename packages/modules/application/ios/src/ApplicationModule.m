// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ApplicationModule.h"
#import <UIKit/UIKit.h>

@implementation ApplicationModule



#pragma mark - helpers

+ (NSDictionary *)infoPlist {
  return [NSBundle mainBundle].infoDictionary;
}

#pragma mark - LynxModule methods

- (id)applicationName {
  return [ApplicationModule infoPlist][@"CFBundleDisplayName"] ?: @"";
}

- (id)applicationId {
  return [ApplicationModule infoPlist][@"CFBundleIdentifier"] ?: @"";
}

- (id)nativeApplicationVersion {
  return [ApplicationModule infoPlist][@"CFBundleShortVersionString"] ?: @"";
}

- (id)nativeBuildVersion {
  return [ApplicationModule infoPlist][@"CFBundleVersion"] ?: @"";
}

- (NSString *)getIosIdForVendor {
  return [UIDevice currentDevice].identifierForVendor.UUIDString ?: @"";
}

- (id)getInstallationTime {
  // Mirror Expo: NSFileCreationDate of the Documents directory.
  NSArray<NSURL *> *docs =
      [NSFileManager.defaultManager URLsForDirectory:NSDocumentDirectory
                                           inDomains:NSUserDomainMask];
  if (docs.count == 0) return @(0);
  NSURL *url = docs.lastObject;
  NSError *error = nil;
  NSDictionary *attrs =
      [NSFileManager.defaultManager attributesOfItemAtPath:url.path error:&error];
  if (error) return @(0);
  NSDate *installDate = attrs[NSFileCreationDate];
  if (!installDate) return @(0);
  return @(installDate.timeIntervalSince1970 * 1000);
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"applicationId" : NSStringFromSelector(@selector(applicationId)),
    @"applicationName" : NSStringFromSelector(@selector(applicationName)),
    @"getInstallationTime" : NSStringFromSelector(@selector(getInstallationTime)),
    @"nativeApplicationVersion" : NSStringFromSelector(@selector(nativeApplicationVersion)),
    @"nativeBuildVersion" : NSStringFromSelector(@selector(nativeBuildVersion)),
  };
}
@end
