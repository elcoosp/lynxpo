// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SpeechModule.h"
#import <AVFoundation/AVFoundation.h>

@implementation SpeechModule



+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isSpeaking" : NSStringFromSelector(@selector(isSpeaking)),
    @"supported" : NSStringFromSelector(@selector(supported)),
    @"voices" : NSStringFromSelector(@selector(voices)),
  };
}

- (BOOL)isSpeaking {
  return [AVSpeechSynthesizer.sharedSpeechSynthesizer isSpeaking];
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
