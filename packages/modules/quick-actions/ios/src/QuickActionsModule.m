    // Copyright 2026 The Lynxpo Authors. All rights reserved.
    // Licensed under the Apache License Version 2.0 that can be found in the
    // LICENSE file in the root directory of this source tree.

    #import "QuickActionsModule.h"

    @implementation QuickActionsModule

    - (id)getShortcutItemsAsync {
  NSArray<UIApplicationShortcutItem *> *items = UIApplication.sharedApplication.shortcutItems;
  NSMutableArray *out = [NSMutableArray array];
  for (UIApplicationShortcutItem *it in items) {
    [out addObject:@{ @"type": it.type ?: @"", @"title": it.localizedTitle ?: @"",
                       @"subtitle": it.localizedSubtitle ?: @"",
                       @"userInfo": it.userInfo ?: [NSNull null] }];
  }
  return out;
}
- (void)setShortcutItemsAsync:(NSArray *)items {
  NSMutableArray *out = [NSMutableArray array];
  for (NSDictionary *d in items) {
    NSString *type = d[@"type"] ?: @"";
    NSString *title = d[@"title"] ?: @"";
    UIApplicationShortcutItem *it = [[UIApplicationShortcutItem alloc] initWithType:type localizedTitle:title];
    if (it) [out addObject:it];
  }
  UIApplication.sharedApplication.shortcutItems = out;
}
- (void)clearShortcutItemsAsync { UIApplication.sharedApplication.shortcutItems = nil; }
- (id)initialActionAsync {
  NSUserDefaults *d = NSUserDefaults.standardUserDefaults;
  NSDictionary *a = [d objectForKey:@"lynxpo_qa_initial"];
  return a ?: [NSNull null];
}

    #pragma mark - LynxModule protocol

    + (NSDictionary<NSString *, NSString *> *)methodLookup {
      return @{
    @"getShortcutItemsAsync" : NSStringFromSelector(@selector(getShortcutItemsAsync)),
@"setShortcutItemsAsync" : NSStringFromSelector(@selector(setShortcutItemsAsync:)),
@"clearShortcutItemsAsync" : NSStringFromSelector(@selector(clearShortcutItemsAsync)),
@"initialActionAsync" : NSStringFromSelector(@selector(initialActionAsync)),
      };
    }
    @end

