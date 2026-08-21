// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SpeechModule.h"
#import <AVFoundation/AVFoundation.h>

@implementation SpeechModule



- (BOOL)isSpeaking {
  // No module-scoped AVSpeechSynthesizer instance is retained here, so there is no
  // in-flight utterance to report. Mirrors the Android twin (also NO at module scope).
  return NO;
}

- (BOOL)supported {
  return YES;
}

- (NSArray<NSDictionary<NSString *, NSString *> *> *)voices {
  NSMutableArray *voices = [NSMutableArray array];
  for (AVSpeechSynthesisVoice *voice in [AVSpeechSynthesisVoice speechVoices]) {
    [voices addObject:@{
      @"name" : voice.name ?: @"",
      @"identifier" : voice.identifier ?: @"",
      @"language" : voice.language ?: @"",
    }];
  }
  return voices;
}

@end
