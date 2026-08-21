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

- (id)getCellularGenerationAsync {

  @try { return @([self getCellularGeneration]); } @catch (NSException *e) { return nil; }
}
- (id)getIsoCountryCodeAsync {

  @try { return [self getIsoCountryCode]; } @catch (NSException *e) { return nil; }
}
- (id)getCarrierNameAsync {

  @try { return [self getCarrierName]; } @catch (NSException *e) { return nil; }
}
- (id)getMobileCountryCodeAsync {

  @try { return [self getMobileCountryCode]; } @catch (NSException *e) { return nil; }
}
- (id)getMobileNetworkCodeAsync {

  @try { return [self getMobileNetworkCode]; } @catch (NSException *e) { return nil; }
}

@end
