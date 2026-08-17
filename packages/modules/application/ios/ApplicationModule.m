// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ApplicationModule.h"
#import <UIKit/UIKit.h>

@implementation ApplicationModule

+ (NSString *)name {
  return @"ApplicationModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"applicationName" : NSStringFromSelector(@selector(applicationName)),
    @"applicationId" : NSStringFromSelector(@selector(applicationId)),
    @"nativeApplicationVersion" : NSStringFromSelector(@selector(nativeApplicationVersion)),
    @"nativeBuildVersion" : NSStringFromSelector(@selector(nativeBuildVersion)),
    @"getIosIdForVendor" : NSStringFromSelector(@selector(getIosIdForVendor)),
    @"getInstallationTime" : NSStringFromSelector(@selector(getInstallationTime)),
  };
}

#pragma mark - helpers

+ (NSDictionary *)infoPlist {
  return [NSBundle mainBundle].infoDictionary;
}

#pragma mark - LynxModule methods

- (NSString *)applicationName {
  return [ApplicationModule infoPlist][@"CFBundleDisplayName"] ?: @"";
}

- (NSString *)applicationId {
  return [ApplicationModule infoPlist][@"CFBundleIdentifier"] ?: @"";
}

- (NSString *)nativeApplicationVersion {
  return [ApplicationModule infoPlist][@"CFBundleShortVersionString"] ?: @"";
}

- (NSString *)nativeBuildVersion {
  return [ApplicationModule infoPlist][@"CFBundleVersion"] ?: @"";
}

- (NSString *)getIosIdForVendor {
  return [UIDevice currentDevice].identifierForVendor.UUIDString ?: @"";
}

- (NSNumber *)getInstallationTime {
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

@end
