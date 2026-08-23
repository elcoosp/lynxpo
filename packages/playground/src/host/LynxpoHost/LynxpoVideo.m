// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoVideo.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import <AVFoundation/AVFoundation.h>

@interface LynxpoVideoView : UIView
@property(nonatomic, strong) AVPlayer *player;
@property(nonatomic, strong) AVPlayerLayer *playerLayer;
@end

@implementation LynxpoVideoView
- (instancetype)init {
  self = [super init];
  if (self) {
    _player = [[AVPlayer alloc] init];
    _playerLayer = [AVPlayerLayer playerLayerWithPlayer:_player];
    _playerLayer.frame = self.bounds;
    _playerLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    _playerLayer.backgroundColor = [UIColor blackColor].CGColor;
    [self.layer addSublayer:_playerLayer];
  }
  return self;
}
- (void)layoutSubviews { [super layoutSubviews]; _playerLayer.frame = self.bounds; }
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; _playerLayer.frame = self.bounds; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; _playerLayer.frame = self.bounds; }
@end

@implementation LynxpoVideo
- (UIView *)createView { return [[LynxpoVideoView alloc] init]; }
LYNX_PROP_SETTER("source", setSource, NSString *) {
  LynxpoVideoView *v = (LynxpoVideoView *)self.view;
  if (!value.length) { [v.player pause]; v.player = [[AVPlayer alloc] init]; v.playerLayer.player = v.player; return; }
  NSURL *url = nil;
  if ([value hasPrefix:@"http://"] || [value hasPrefix:@"https://"] || [value hasPrefix:@"file://"]) {
    url = [NSURL URLWithString:value];
  } else if ([value hasPrefix:@"/"]) {
    url = [NSURL fileURLWithPath:value];
  } else {
    // bare name -> look up in the host app bundle (e.g. "sample.mp4")
    NSString *path = [[NSBundle mainBundle] pathForResource:[value stringByDeletingPathExtension] ofType:value.pathExtension];
    if (path) url = [NSURL fileURLWithPath:path];
  }
  if (url) { v.player = [AVPlayer playerWithURL:url]; v.playerLayer.player = v.player; [v.player play]; }
}
LYNX_PROP_SETTER("muted", setMuted, BOOL) { ((LynxpoVideoView *)self.view).player.muted = value; }
LYNX_PROP_SETTER("loop", setLoop, BOOL) {
  AVPlayer *p = ((LynxpoVideoView *)self.view).player;
  if (value) p.actionAtItemEnd = AVPlayerActionAtItemEndNone;
}
LYNX_LAZY_REGISTER_UI("lynxpo-video")
@end
