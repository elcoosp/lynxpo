// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ContactsModule.h"
#import <Contacts/Contacts.h>

@implementation ContactsModule



- (id)permissionsAsync {
  CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
  BOOL granted = (status == CNAuthorizationStatusAuthorized);
  NSString *statusStr = granted ? @"granted" : (status == CNAuthorizationStatusDenied ? @"denied" : @"undetermined");
  return @{ @"status" : statusStr, @"granted" : @(granted) };
}

- (void)requestPermission {
  CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
  if (status == CNAuthorizationStatusAuthorized) return;
  CNContactStore *store = [[CNContactStore alloc] init];
  [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError *error) {
    // The next permissionsAsync() call reflects the new status.
  }];
}

- (double)contactCount {
  CNContactStore *store = [[CNContactStore alloc] init];
  NSError *error = nil;
  NSArray *keys = @[ CNContactIdentifierKey ];
  CNContactFetchRequest *request = [[CNContactFetchRequest alloc] initWithKeysToFetch:keys];
  __block NSInteger count = 0;
  [store enumerateContactsWithFetchRequest:request error:&error usingBlock:^(CNContact * _Nonnull contact, BOOL * _Nonnull stop) {
    count++;
  }];
  return count;
}

- (double)containerCount {
  CNContactStore *store = [[CNContactStore alloc] init];
  NSError *error = nil;
  NSArray<CNContainer *> *containers = [store containersMatchingPredicate:nil error:&error];
  return containers ? containers.count : 0;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"contactCount" : NSStringFromSelector(@selector(contactCount)),
    @"containerCount" : NSStringFromSelector(@selector(containerCount)),
    @"permissionsAsync" : NSStringFromSelector(@selector(permissionsAsync)),
    @"requestPermission" : NSStringFromSelector(@selector(requestPermission)),
  };
}
@end
