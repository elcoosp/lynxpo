// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "NavigationBar.h"
#import <Foundation/Foundation.h>

@implementation NavigationBar

- (void)setBackgroundColor:(NSString *)color {
  (void)color;
}

- (void)setButtonStyle:(NSString *)style {
  (void)style;
}

- (void)setVisibility:(BOOL)visible {
  (void)visible;
}

- (id)getVisibility {
  return @{ @"visible": @YES };
}

@end
