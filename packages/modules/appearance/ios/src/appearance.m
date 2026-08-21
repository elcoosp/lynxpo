// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Appearance.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@implementation Appearance



- (NSString *)getColorScheme {
  if (@available(iOS 13.0, *)) {
    UIUserInterfaceStyle style =
        UIApplication.sharedApplication.windows.firstObject.traitCollection.userInterfaceStyle;
    return (style == UIUserInterfaceStyleDark) ? @"dark" : @"light";
  }
  return @"light";
}

- (void)setColorScheme:(NSString *)scheme {
  // LynxPo playground: appearance is read from the system; setting is a safe no-op
  // on the simulator but kept for API parity with Expo.
  (void)scheme;
}

@end
