// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "CalendarSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Calendar`. Exposes native functionality to JS via
/// `NativeModules.Calendar`, faithfully porting Expo's `expo-calendar` native method surface.
@LynxNativeModule("Calendar")
@interface Calendar : NSObject <CalendarSpec>

- (id)getCalendars;
- (id)getEvents:(NSString *)startDate endDate:(NSString *)endDate;
- (id)requestPermissions;
- (id)getPermissions;
- (NSString *)createEvent:(NSString *)title startDate:(NSString *)startDate endDate:(NSString *)endDate;

@end

NS_ASSUME_NONNULL_END
