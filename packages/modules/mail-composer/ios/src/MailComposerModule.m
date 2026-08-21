// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "MailComposerModule.h"
#import <UIKit/UIKit.h>

@implementation MailComposerModule



- (BOOL)isAvailable {
  return [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"mailto:"]];
}

- (id)getClients {
  return @[];
}

- (void)compose:(NSString *)subject body:(NSString *)body recipients:(NSArray<NSString *> *)recipients {
  NSMutableString *url = [NSMutableString stringWithString:@"mailto:"];
  if (recipients.count > 0) {
    url = [NSMutableString stringWithFormat:@"mailto:%@", [recipients componentsJoinedByString:@","]];
  }
  NSMutableArray *parts = [NSMutableArray array];
  if (subject.length > 0) [parts addObject:[NSString stringWithFormat:@"subject=%@", subject]];
  if (body.length > 0) [parts addObject:[NSString stringWithFormat:@"body=%@", body]];
  if (parts.count > 0) {
    [url appendFormat:@"?%@", [parts componentsJoinedByString:@"&"]];
  }
  NSString *encoded = [url stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:encoded] options:@{} completionHandler:nil];
}

- (id)isAvailableAsync {

  @try { return @([self isAvailable]); } @catch (NSException *e) { return nil; }
}
- (id)getClientsAsync {

  @try { return [self getClients]; } @catch (NSException *e) { return nil; }
}
- (void)composeAsync:(NSString *)subject body:(NSString *)body recipients:(NSArray<NSString *> *)recipients {
  @try { [self compose:subject body:body recipients:recipients]; } @catch (NSException *e) {}
}

@end
