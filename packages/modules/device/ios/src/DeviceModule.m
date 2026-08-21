// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "DeviceModule.h"
#import <sys/sysctl.h>
#import <sys/utsname.h>
#import <UIKit/UIKit.h>

@implementation DeviceModule

#pragma mark - helpers

+ (NSString *)machineModel {
  struct utsname systemInfo;
  uname(&systemInfo);
  return [NSString stringWithCString:systemInfo.machine
                            encoding:NSUTF8StringEncoding];
}

+ (NSString *)osBuildVersion {
  NSDictionary *systemVersion =
      [NSDictionary dictionaryWithContentsOfFile:
                      @"/System/Library/CoreServices/SystemVersion.plist"];
  return systemVersion[@"ProductBuildVersion"];
}

#pragma mark - DeviceModuleSpec methods

- (BOOL)isDevice {
  NSString *machine = [DeviceModule machineModel];
  BOOL isSimulator = [machine hasPrefix:@"x86_64"] ||
      [machine hasPrefix:@"arm64"] || [machine hasPrefix:@"Apple"];
  return !isSimulator;
}

- (NSString *)brand {
  return @"Apple";
}

- (NSString *)manufacturer {
  return @"Apple";
}

- (NSString *)modelName {
  return [DeviceModule machineModel];
}

- (NSString *)designName {
  return [DeviceModule machineModel];
}

- (NSString *)productName {
  return [DeviceModule machineModel];
}

- (double)deviceYearClass {
  NSString *machine = [DeviceModule machineModel];
  if ([machine hasPrefix:@"iPhone"]) {
    NSInteger gen = [[[machine componentsSeparatedByString:@","]
        lastObject] integerValue];
    return 2007 + (gen > 0 ? gen : 0) + (gen >= 17 ? 18 : 0);
  }
  return 0;
}

- (double)totalMemory {
  return (double)[NSProcessInfo processInfo].physicalMemory;
}

- (double)deviceType {
  // 1 = PHONE (mirrors Android DeviceType.PHONE)
  return 1;
}

- (NSString *)osName {
  return @"iOS";
}

- (NSString *)osVersion {
  return [UIDevice currentDevice].systemVersion;
}

- (NSString *)osBuildId {
  return [DeviceModule osBuildVersion] ?: @"";
}

- (NSString *)osInternalBuildId {
  return @"";
}

- (NSString *)osBuildFingerprint {
  return @"";
}

- (double)platformApiLevel {
  NSString *version = [UIDevice currentDevice].systemVersion;
  return [[[version componentsSeparatedByString:@"."] firstObject] doubleValue];
}

- (NSString *)deviceName {
  return [UIDevice currentDevice].name;
}

@end
