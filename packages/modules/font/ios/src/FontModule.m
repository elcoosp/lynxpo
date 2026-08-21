// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "FontModule.h"
#import <UIKit/UIKit.h>

@implementation FontModule



- (BOOL)isLoaded:(NSString *)fontFamily {
  return [[self loadedSet] containsObject:fontFamily];
}

- (id)loadedFonts {
  return [[self loadedSet] allObjects];
}

- (NSString *)processFontFamily:(NSString *)fontFamily {
  // Faithful to expo-font: returns the family name unchanged on non-web.
  return fontFamily ?: @"";
}

- (void)loadAsync:(NSString *)fontFamily {
  if (fontFamily) {
    [[self loadedSet] addObject:fontFamily];
  }
}

- (NSMutableSet<NSString *> *)loadedSet {
  static NSMutableSet<NSString *> *set = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    set = [NSMutableSet set];
  });
  return set;
}

@end
