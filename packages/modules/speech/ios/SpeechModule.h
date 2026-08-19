// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `SpeechModule`. Exposes speech synthesis to JS via
/// `NativeModules.SpeechModule`, faithfully porting Expo's `expo-speech` native
/// method surface.
@interface SpeechModule : NSObject <LynxModule>

- (BOOL)isSpeaking;
- (BOOL)supported;
- (NSArray<NSDictionary<NSString *, NSString *> *> *)voices;
@end

NS_ASSUME_NONNULL_END
