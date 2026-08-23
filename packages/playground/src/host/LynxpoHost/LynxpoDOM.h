// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxUI.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface LynxpoDOMView : UIView
@property(nonatomic, strong) WKWebView *web;
@end

@interface LynxpoDOM : LynxUI
@end

NS_ASSUME_NONNULL_END
