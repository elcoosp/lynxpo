// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "HostAppDelegate.h"
#import "HostViewController.h"
#import "HostTemplateProvider.h"
#import <Lynx/LynxEnv.h>
#import <Lynx/LynxConfig.h>

@implementation HostAppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary<UIApplicationLaunchOptionsKey, id> *)launchOptions {
  // Mirror the Explorer's setupLynxEnv: build a LynxConfig backed by a local
  // template provider and hand it to LynxEnv so that
  // [LynxEnv sharedInstance].config.templateProvider is valid when the
  // LynxView loads a template. Without this the provider is nil and the
  // runtime crashes inside -[LynxTemplateRender processUrl:].
  LynxConfig *globalConfig = [[LynxConfig alloc] initWithProvider:[HostTemplateProvider new]];
  [[LynxEnv sharedInstance] prepareConfig:globalConfig];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.rootViewController = [[HostViewController alloc] init];
  self.window.backgroundColor = [UIColor whiteColor];
  [self.window makeKeyAndVisible];
  return YES;
}

@end
