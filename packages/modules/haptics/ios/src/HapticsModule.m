// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "HapticsModule.h"
#import <UIKit/UIKit.h>

@implementation HapticsModule

- (id)impactAsync:(double)style {
  @try {
    UIImpactFeedbackStyle s = UIImpactFeedbackStyleLight;
    if (style == 1) s = UIImpactFeedbackStyleMedium;
    else if (style == 2) s = UIImpactFeedbackStyleHeavy;
    else if (style == 3) s = UIImpactFeedbackStyleRigid;
    else if (style == 4) s = UIImpactFeedbackStyleSoft;
    UIImpactFeedbackGenerator *gen = [[UIImpactFeedbackGenerator alloc] initWithStyle:s];
    [gen impactOccurred];
    return nil;
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)notificationAsync:(double)type {
  @try {
    UINotificationFeedbackType t = UINotificationFeedbackTypeSuccess;
    if (type == 1) t = UINotificationFeedbackTypeWarning;
    else if (type == 2) t = UINotificationFeedbackTypeError;
    UINotificationFeedbackGenerator *gen = [[UINotificationFeedbackGenerator alloc] init];
    [gen notificationOccurred:t];
    return nil;
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)selectionAsync {
  @try {
    UISelectionFeedbackGenerator *gen = [[UISelectionFeedbackGenerator alloc] init];
    [gen selectionChanged];
    return nil;
  } @catch (NSException *e) {
    return nil;
  }
}

@end
