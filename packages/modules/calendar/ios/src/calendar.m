// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Calendar.h"
#import <Foundation/Foundation.h>
#import <EventKit/EventKit.h>

@implementation Calendar

+ (NSString *)name {
 return @"Calendar";
}

- (id)getCalendars {
  EKEventStore *store = [[EKEventStore alloc] init];
  NSMutableArray *result = [NSMutableArray array];
  for (EKCalendar *cal in [store calendarsForEntityType:EKEntityTypeEvent]) {
    [result addObject:@{ @"id": cal.calendarIdentifier ?: @"",
                          @"title": cal.title ?: @"",
                          @"allowsModifications": @(cal.allowsContentModifications) }];
  }
  return result;
}

- (id)getEvents:(NSString *)startDate endDate:(NSString *)endDate {
  (void)startDate;
  (void)endDate;
  return @[];
}

- (id)requestPermissions {
  return @{ @"status": @"undetermined", @"granted": @NO };
}

- (id)getPermissions {
  return @{ @"status": @"undetermined", @"granted": @NO };
}

- (NSString *)createEvent:(NSString *)title startDate:(NSString *)startDate endDate:(NSString *)endDate {
  (void)title;
  (void)startDate;
  (void)endDate;
  return @"";
}

@end
