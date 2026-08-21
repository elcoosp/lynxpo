// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "KeepAwakeModule.h"
#import <UIKit/UIKit.h>

@implementation KeepAwakeModule



- (id)activate {
  [UIApplication.sharedApplication setIdleTimerDisabled:YES];
}

- (id)deactivate {
  [UIApplication.sharedApplication setIdleTimerDisabled:NO];
}

- (BOOL)isActivated {
  return UIApplication.sharedApplication.isIdleTimerDisabled;
}

- (id)activateAsync {

  @try { [self activate]; return nil; } @catch (NSException *e) { return nil; }
}
- (id)deactivateAsync {

  @try { [self deactivate]; return nil; } @catch (NSException *e) { return nil; }
}
- (id)isActivatedAsync {

  @try { return @([self isActivated]); } @catch (NSException *e) { return nil; }
}

@end
