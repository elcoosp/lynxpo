    // Copyright 2026 The Lynxpo Authors. All rights reserved.
    // Licensed under the Apache License Version 2.0 that can be found in the
    // LICENSE file in the root directory of this source tree.

    #import "ReceiveSharingModule.h"

    @implementation ReceiveSharingModule

    - (id)getInitialIntentAsync {
  NSUserDefaults *d = NSUserDefaults.standardUserDefaults;
  NSDictionary *i = [d objectForKey:@"lynxpo_share_intent"];
  return i ?: [NSNull null];
}
- (id)hasIntentAsync { return @NO; }
- (void)addListener:(NSString *)event { /* registered; delivered via NSUserDefaults bridge */ }

    #pragma mark - LynxModule protocol

    + (NSDictionary<NSString *, NSString *> *)methodLookup {
      return @{
    @"getInitialIntentAsync" : NSStringFromSelector(@selector(getInitialIntentAsync)),
@"hasIntentAsync" : NSStringFromSelector(@selector(hasIntentAsync)),
@"addListener" : NSStringFromSelector(@selector(addListener:)),
      };
    }
    @end

