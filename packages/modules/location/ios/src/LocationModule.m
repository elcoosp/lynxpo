// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LocationModule.h"
#import <CoreLocation/CoreLocation.h>

@implementation LocationModule



- (id)providerStatus {
  CLLocationManager *mgr = [[CLLocationManager alloc] init];
  BOOL servicesEnabled = [CLLocationManager locationServicesEnabled];
  BOOL authorized = ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusAuthorizedWhenInUse ||
                     [CLLocationManager authorizationStatus] == kCLAuthorizationStatusAuthorizedAlways);
  return @{
    @"locationServicesEnabled" : @(servicesEnabled),
    @"gpsAvailable" : @(servicesEnabled),
    @"networkAvailable" : @(servicesEnabled),
    @"authorized" : @(authorized),
  };
}

- (id)permissionsAsync {
  CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
  BOOL granted = (status == kCLAuthorizationStatusAuthorizedWhenInUse ||
                  status == kCLAuthorizationStatusAuthorizedAlways);
  NSString *statusStr = granted ? @"granted" : (status == kCLAuthorizationStatusDenied ? @"denied" : @"undetermined");
  return @{
    @"status" : statusStr,
    @"granted" : @(granted),
    @"canAskAgain" : @(status != kCLAuthorizationStatusDenied),
  };
}

- (void)requestPermission {
  CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
  if (status == kCLAuthorizationStatusAuthorizedWhenInUse ||
      status == kCLAuthorizationStatusAuthorizedAlways) return;
  CLLocationManager *mgr = [[CLLocationManager alloc] init];
  [mgr requestWhenInUseAuthorization];
}

- (id)currentPositionAsync {
  CLLocationManager *mgr = [[CLLocationManager alloc] init];
  if ([CLLocationManager authorizationStatus] != kCLAuthorizationStatusAuthorizedWhenInUse &&
      [CLLocationManager authorizationStatus] != kCLAuthorizationStatusAuthorizedAlways) {
    return @{ @"latitude" : @(0), @"longitude" : @(0), @"accuracy" : @(-1) };
  }
  CLLocation *loc = mgr.location;
  if (!loc) {
    return @{ @"latitude" : @(0), @"longitude" : @(0), @"accuracy" : @(-1) };
  }
  return @{
    @"latitude" : @(loc.coordinate.latitude),
    @"longitude" : @(loc.coordinate.longitude),
    @"accuracy" : @(loc.horizontalAccuracy),
  };
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"currentPositionAsync" : NSStringFromSelector(@selector(currentPositionAsync)),
    @"permissionsAsync" : NSStringFromSelector(@selector(permissionsAsync)),
    @"providerStatus" : NSStringFromSelector(@selector(providerStatus)),
    @"requestPermission" : NSStringFromSelector(@selector(requestPermission)),
  };
}
@end
