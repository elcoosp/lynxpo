// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "CellularModule.h"
#import <UIKit/UIKit.h>

// NOTE: CoreTelephony (CTTelephonyNetworkInfo/CTCarrier) is deprecated and not
// linked into this Explorer build. On the iOS Simulator carrier info is
// unavailable regardless, so we return safe "unknown" values. The showcase
// reads these via the *Async promise APIs and degrades gracefully.

@implementation CellularModule

+ (NSString *)name {
  return @"CellularModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getCellularGeneration" : NSStringFromSelector(@selector(getCellularGeneration)),
    @"getIsoCountryCode" : NSStringFromSelector(@selector(getIsoCountryCode)),
    @"getCarrierName" : NSStringFromSelector(@selector(getCarrierName)),
    @"getMobileCountryCode" : NSStringFromSelector(@selector(getMobileCountryCode)),
    @"getMobileNetworkCode" : NSStringFromSelector(@selector(getMobileNetworkCode)),
  };
}

- (int)getCellularGeneration {
  // Unknown on the simulator / without CoreTelephony.
  return 0;
}

- (NSString *)getIsoCountryCode {
  return nil;
}

- (NSString *)getCarrierName {
  return nil;
}

- (NSString *)getMobileCountryCode {
  return nil;
}

- (NSString *)getMobileNetworkCode {
  return nil;
}

- (void)getCellularGenerationAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve(@([self getCellularGeneration])); } @catch (NSException *e) { reject(e.reason); }
}
- (void)getIsoCountryCodeAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getIsoCountryCode]); } @catch (NSException *e) { reject(e.reason); }
}
- (void)getCarrierNameAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getCarrierName]); } @catch (NSException *e) { reject(e.reason); }
}
- (void)getMobileCountryCodeAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getMobileCountryCode]); } @catch (NSException *e) { reject(e.reason); }
}
- (void)getMobileNetworkCodeAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getMobileNetworkCode]); } @catch (NSException *e) { reject(e.reason); }
}

@end
