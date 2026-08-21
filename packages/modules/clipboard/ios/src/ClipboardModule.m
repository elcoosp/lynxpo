// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ClipboardModule.h"
#import <UIKit/UIKit.h>

@implementation ClipboardModule



+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getString" : NSStringFromSelector(@selector(getString)),
    @"setString" : NSStringFromSelector(@selector(setString:)),
    @"hasString" : NSStringFromSelector(@selector(hasString)),
    // Async variants (required by the generated TS wrappers).
    @"getStringAsync" : NSStringFromSelector(@selector(getStringAsync:reject:)),
    @"setStringAsync" : NSStringFromSelector(@selector(setStringAsync:reject:)),
    @"hasStringAsync" : NSStringFromSelector(@selector(hasStringAsync:reject:)),
  };
}

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
- (void)setStringAsync:(NSString *)text {
  @try { [self setString:text]; return nil; } @catch (NSException *e) { return nil; }
}
- (id)hasStringAsync {

  @try { return @([self hasString]); } @catch (NSException *e) { return nil; }
}

@end
