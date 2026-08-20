// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "DeviceModule.h"
#import <sys/sysctl.h>
#import <sys/utsname.h>
#import <UIKit/UIKit.h>

@implementation DeviceModule

+ (NSString *)name {
  return @"DeviceModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isDevice" : NSStringFromSelector(@selector(isDevice)),
    @"brand" : NSStringFromSelector(@selector(brand)),
    @"manufacturer" : NSStringFromSelector(@selector(manufacturer)),
    @"modelName" : NSStringFromSelector(@selector(modelName)),
    @"designName" : NSStringFromSelector(@selector(designName)),
    @"productName" : NSStringFromSelector(@selector(productName)),
    @"deviceYearClass" : NSStringFromSelector(@selector(deviceYearClass)),
    @"totalMemory" : NSStringFromSelector(@selector(totalMemory)),
    @"deviceType" : NSStringFromSelector(@selector(deviceType)),
    @"supportedCpuArchitectures" :
        NSStringFromSelector(@selector(supportedCpuArchitectures)),
    @"osName" : NSStringFromSelector(@selector(osName)),
    @"osVersion" : NSStringFromSelector(@selector(osVersion)),
    @"osBuildId" : NSStringFromSelector(@selector(osBuildId)),
    @"osInternalBuildId" : NSStringFromSelector(@selector(osInternalBuildId)),
    @"osBuildFingerprint" : NSStringFromSelector(@selector(osBuildFingerprint)),
    @"platformApiLevel" : NSStringFromSelector(@selector(platformApiLevel)),
    @"deviceName" : NSStringFromSelector(@selector(deviceName)),
  };
}

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

#pragma mark - LynxModule methods

- (NSNumber *)isDevice {
  // iOS simulators report a machine model starting with "x86_64" / "arm64" /
  // "Apple". A real device reports e.g. "iPhone17,4".
  NSString *machine = [DeviceModule machineModel];
  BOOL isSimulator = [machine hasPrefix:@"x86_64"] ||
      [machine hasPrefix:@"arm64"] || [machine hasPrefix:@"Apple"];
  return @(!isSimulator);
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

- (NSNumber *)deviceYearClass {
  // Approximate device-year class from the marketing device family.
  NSString *machine = [DeviceModule machineModel];
  if ([machine hasPrefix:@"iPhone"]) {
    NSInteger gen = [[[machine componentsSeparatedByString:@","] lastObject]
        integerValue];
    // iPhone 17,x -> ~2025 class (rough mapping for the demo).
    return @(2007 + (gen > 0 ? (gen / 1) : 0) + (gen >= 17 ? 18 : 0));
  }
  return @(0);
}

- (NSNumber *)totalMemory {
  return @([NSProcessInfo processInfo].physicalMemory);
}

- (NSNumber *)deviceType {
  // 1 = PHONE (mirrors Android DeviceType.PHONE)
  return @(1);
}

- (NSArray<NSString *> *)supportedCpuArchitectures {
  return @[ @"arm64" ];
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

- (NSNumber *)platformApiLevel {
  // iOS major version as the "API level" analogue.
  NSString *version = [UIDevice currentDevice].systemVersion;
  return @([[[version componentsSeparatedByString:@"."] firstObject]
      integerValue]);
}

- (NSString *)deviceName {
  return [UIDevice currentDevice].name;
}

@end
