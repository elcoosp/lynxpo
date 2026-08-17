// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ClipboardModule.h"
#import <UIKit/UIKit.h>

@implementation ClipboardModule

+ (NSString *)name {
  return @"ClipboardModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getString" : NSStringFromSelector(@selector(getString)),
    @"setString" : NSStringFromSelector(@selector(setString:)),
    @"hasString" : NSStringFromSelector(@selector(hasString)),
    // Async variants (required by the generated TS wrappers).
    @"getStringAsync" : NSStringFromSelector(@selector(getStringAsync:resolve:reject:)),
    @"setStringAsync" : NSStringFromSelector(@selector(setStringAsync:resolve:reject:)),
    @"hasStringAsync" : NSStringFromSelector(@selector(hasStringAsync:resolve:reject:)),
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

- (void)getStringAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve([self getString]); } @catch (NSException *e) { reject(e.reason); }
}
- (void)setStringAsync:(NSString *)text resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { [self setString:text]; resolve(nil); } @catch (NSException *e) { reject(e.reason); }
}
- (void)hasStringAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve(@([self hasString])); } @catch (NSException *e) { reject(e.reason); }
}

@end
