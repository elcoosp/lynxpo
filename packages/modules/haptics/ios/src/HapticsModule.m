// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "HapticsModule.h"
#import <UIKit/UIKit.h>

@implementation HapticsModule



+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"impactAsync" : NSStringFromSelector(@selector(impactAsync:)),
    @"notificationAsync" : NSStringFromSelector(@selector(notificationAsync:)),
    @"selectionAsync" : NSStringFromSelector(@selector(selectionAsync)),
  };
}

- (void)impactAsync:(int)style {
  UIImpactFeedbackStyle s = UIImpactFeedbackStyleLight;
  if (style == 1) s = UIImpactFeedbackStyleMedium;
  else if (style == 2) s = UIImpactFeedbackStyleHeavy;
  else if (style == 3) s = UIImpactFeedbackStyleRigid;
  else if (style == 4) s = UIImpactFeedbackStyleSoft;
  UIImpactFeedbackGenerator *gen = [[UIImpactFeedbackGenerator alloc] initWithStyle:s];
  [gen impactOccurred];
}

- (void)notificationAsync:(int)type {
  UINotificationFeedbackType t = UINotificationFeedbackTypeSuccess;
  if (type == 1) t = UINotificationFeedbackTypeWarning;
  else if (type == 2) t = UINotificationFeedbackTypeError;
  UINotificationFeedbackGenerator *gen = [[UINotificationFeedbackGenerator alloc] init];
  [gen notificationOccurred:t];
}

- (id)selectionAsync {
  UISelectionFeedbackGenerator *gen = [[UISelectionFeedbackGenerator alloc] init];
  [gen selectionChanged];
}

- (void)impactAsync:(NSInteger)style {
  @try { [self impactAsync:(int)style]; return nil; } @catch (NSException *e) { return nil; }
}
- (void)notificationAsync:(NSInteger)type {
  @try { [self notificationAsync:(int)type]; return nil; } @catch (NSException *e) { return nil; }
}
- (id)selectionAsync {

  @try { [self selectionAsync]; return nil; } @catch (NSException *e) { return nil; }
}

@end
