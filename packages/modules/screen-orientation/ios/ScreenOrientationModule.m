// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ScreenOrientationModule.h"
#import <UIKit/UIKit.h>

@implementation ScreenOrientationModule

+ (NSString *)name {
  return @"ScreenOrientationModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getOrientation" : NSStringFromSelector(@selector(getOrientation)),
    @"getOrientationLock" : NSStringFromSelector(@selector(getOrientationLock)),
    @"lock" : NSStringFromSelector(@selector(lock:)),
    @"lockPlatform" : NSStringFromSelector(@selector(lockPlatform:)),
    @"supportsOrientationLock" : NSStringFromSelector(@selector(supportsOrientationLock)),
  };
}

- (int)getOrientation {
  // Prefer the window scene's *presented* interface orientation, which is
  // reliable on the simulator and reflects what's actually on screen.
  // UIDevice.orientation is often UIDeviceOrientationUnknown until a rotation
  // event fires, so only fall back to it when the scene reports nothing.
  int sceneOrientation = 0;
  if (@available(iOS 13.0, *)) {
    UIWindowScene *scene =
        (UIWindowScene *)[UIApplication.sharedApplication connectedScenes]
            .allObjects.firstObject;
    if (scene) {
      UIInterfaceOrientation o = scene.interfaceOrientation;
      if (o == UIInterfaceOrientationPortrait) sceneOrientation = 1;
      else if (o == UIInterfaceOrientationPortraitUpsideDown)
        sceneOrientation = 2;
      else if (o == UIInterfaceOrientationLandscapeLeft)
        sceneOrientation = 3;
      else if (o == UIInterfaceOrientationLandscapeRight)
        sceneOrientation = 4;
    }
  }
  if (sceneOrientation != 0) return sceneOrientation;
  UIDeviceOrientation dev = UIDevice.currentDevice.orientation;
  switch (dev) {
    case UIDeviceOrientationPortrait: return 1;
    case UIDeviceOrientationPortraitUpsideDown: return 2;
    case UIDeviceOrientationLandscapeLeft: return 3;
    case UIDeviceOrientationLandscapeRight: return 4;
    default: return 1;  // upright/portrait is the default posture
  }
}

- (int)getOrientationLock {
  // iOS does not enforce a global orientation lock (it is per view
  // controller), so the device is effectively in the "Sensor"/unlocked state.
  // Index 4 maps to "Sensor" in the showcase UI (0=Unknown,1=Portrait,
  // 2=Landscape,3=All,4=Sensor); returning 8 (a raw SENSOR constant) was out
  // of range and rendered as "-".
  return 4;
}

- (void)lock:(int)orientation {
  UIInterfaceOrientation o = UIInterfaceOrientationPortrait;
  if (orientation == 3) o = UIInterfaceOrientationLandscapeLeft;
  else if (orientation == 4) o = UIInterfaceOrientationLandscapeRight;
  else if (orientation == 2) o = UIInterfaceOrientationPortraitUpsideDown;
  if (@available(iOS 16.0, *)) {
    UIWindowScene *scene = (UIWindowScene *)[UIApplication.sharedApplication connectedScenes].allObjects.firstObject;
    if (scene) {
      [scene requestGeometryUpdateWithPreferences:[[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:1 << o]
                                    errorHandler:^(NSError *e){ (void)e; }];
    }
  } else {
    [[UIDevice currentDevice] setValue:@(o) forKey:@"orientation"];
  }
}

- (void)lockPlatform:(int)orientationLock {
  // Platform lock not directly mappable on iOS; no-op.
}

- (BOOL)supportsOrientationLock {
  return NO;
}

- (void)getOrientationAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve(@([self getOrientation])); } @catch (NSException *e) { reject(e.reason); }
}
- (void)getOrientationLockAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve(@([self getOrientationLock])); } @catch (NSException *e) { reject(e.reason); }
}
- (void)lockAsync:(NSInteger)orientation resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { [self lock:orientation]; resolve(nil); } @catch (NSException *e) { reject(e.reason); }
}
- (void)unlockAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { [self lock:0]; resolve(nil); } @catch (NSException *e) { reject(e.reason); }
}
- (void)lockPlatformAsync:(NSArray<NSNumber *> *)orientations resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { [self lockPlatform:[orientations.firstObject integerValue]]; resolve(nil); } @catch (NSException *e) { reject(e.reason); }
}
- (void)supportsOrientationLockAsync:(NSInteger)orientationLock resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve(@([self supportsOrientationLock])); } @catch (NSException *e) { reject(e.reason); }
}
- (void)addListener:(NSString *)eventName {
  // The LynxPo playground showcase reads values via the *Async promise APIs,
  // not via native events, so listener registration is a safe no-op here.
}
- (void)removeListeners:(NSInteger)count {}

@end
