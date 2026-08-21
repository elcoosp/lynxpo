// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "TaskManagerSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `TaskManager`. Exposes native functionality to JS via
/// `NativeModules.TaskManager`, faithfully porting Expo's `expo-task-manager` native method surface.
@LynxNativeModule("TaskManager")
@interface TaskManager : NSObject <TaskManagerSpec>

- (BOOL)isTaskRegistered:(NSString *)taskName;
- (id)getRegisteredTasks;
- (void)unregisterTaskAsync:(NSString *)taskName;

@end

NS_ASSUME_NONNULL_END
