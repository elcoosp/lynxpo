    // Copyright 2026 The Lynxpo Authors. All rights reserved.
    // Licensed under the Apache License Version 2.0 that can be found in the
    // LICENSE file in the root directory of this source tree.

    #import "UpdatesModule.h"

    @implementation UpdatesModule

    - (id)getNativeStateAsync {
  return @{ @"isUpdateAvailable": @NO, @"isEmergencyUpdate": @NO,
            @"isRollback": @NO, @"checkAutomatically": @YES,
            @"updateId": @"", @"createdAt": @0 };
}
- (id)checkForUpdateAsync {
  return @{ @"isAvailable": @NO, @"reason": @"no-remote-config" };
}
- (id)fetchUpdateAsync {
  return @{ @"isNew": @NO, @"manifest": [NSNull null], @"error": [NSNull null] };
}
- (id)isUpdateAvailableAsync { return @NO; }
- (void)reloadAsync { /* no-op: host reloads via its own mechanism */ }

    #pragma mark - LynxModule protocol

    + (NSDictionary<NSString *, NSString *> *)methodLookup {
      return @{
    @"getNativeStateAsync" : NSStringFromSelector(@selector(getNativeStateAsync)),
@"checkForUpdateAsync" : NSStringFromSelector(@selector(checkForUpdateAsync)),
@"fetchUpdateAsync" : NSStringFromSelector(@selector(fetchUpdateAsync)),
@"isUpdateAvailableAsync" : NSStringFromSelector(@selector(isUpdateAvailableAsync)),
@"reloadAsync" : NSStringFromSelector(@selector(reloadAsync)),
      };
    }
    @end

