// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ClipboardModule.h"
#import <UIKit/UIKit.h>

@implementation ClipboardModule



- (NSString *)getString {
  UIPasteboard *pb = UIPasteboard.generalPasteboard;
  return pb.string ?: @"";
}

- (void)setString:(NSString *)text {
  UIPasteboard.generalPasteboard.string = text;
}

- (BOOL)hasString {
  return UIPasteboard.generalPasteboard.string.length > 0;
}

- (id)getStringAsync {

  @try { return [self getString]; } @catch (NSException *e) { return nil; }
}
- (id)setStringAsync:(NSString *)text {
  @try { [self setString:text]; return nil; } @catch (NSException *e) { return nil; }
}
- (id)hasStringAsync {

  @try { return @([self hasString]); } @catch (NSException *e) { return nil; }
}

@end
