// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Calendar.h"
#import <Foundation/Foundation.h>

@implementation Calendar

+ (NSString *)name {
 return @"Calendar";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getCalendars" : NSStringFromSelector(@selector(getCalendars)),
  @"getEvents" : NSStringFromSelector(@selector(getEventsWithStartDate:(NSString *)startDate endDate:(NSString *)endDate)),
  @"requestPermissions" : NSStringFromSelector(@selector(requestPermissions)),
  @"getPermissions" : NSStringFromSelector(@selector(getPermissions)),
  @"createEvent" : NSStringFromSelector(@selector(createEventWithTitle:(NSString *)title startDate:(NSString *)startDate endDate:(NSString *)endDate)),
 };
}

- (NSArray *)getCalendars {
 return @[];
}

- (NSArray *)getEventsWithStartDate:(NSString *)startDate endDate:(NSString *)endDate {
 return @[];
}

- (NSDictionary *)requestPermissions {
 return @{ @"status": @"undetermined", @"granted": @NO };
}

- (NSDictionary *)getPermissions {
 return @{ @"status": @"undetermined", @"granted": @NO };
}

- (NSString *)createEventWithTitle:(NSString *)title startDate:(NSString *)startDate endDate:(NSString *)endDate {
 return @"";
}

@end
