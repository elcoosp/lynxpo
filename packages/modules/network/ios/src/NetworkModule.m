// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "NetworkModule.h"
#import <UIKit/UIKit.h>
#import <ifaddrs.h>
#import <arpa/inet.h>
#import <netinet/in.h>
#import <SystemConfiguration/SystemConfiguration.h>

@implementation NetworkModule



- (NSString *)getIpAddress {
  NSString *address = nil;
  struct ifaddrs *interfaces = NULL;
  if (getifaddrs(&interfaces) == 0) {
    struct ifaddrs *ifa = interfaces;
    while (ifa != NULL) {
      if (ifa->ifa_addr->sa_family == AF_INET) {
        NSString *name = [NSString stringWithUTF8String:ifa->ifa_name];
        if (![name isEqualToString:@"lo0"]) {
          address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)ifa->ifa_addr)->sin_addr)];
          break;
        }
      }
      ifa = ifa->ifa_next;
    }
    freeifaddrs(interfaces);
  }
  return address;
}

- (id)getNetworkState {
  BOOL connected = NO;
  // Use a simple reachability-style check via a socket.
  const char *host = "www.apple.com";
  BOOL reachable = NO;
  SCNetworkReachabilityRef reach = SCNetworkReachabilityCreateWithName(NULL, host);
  if (reach) {
    SCNetworkReachabilityFlags flags;
    if (SCNetworkReachabilityGetFlags(reach, &flags)) {
      reachable = (flags & kSCNetworkReachabilityFlagsReachable) &&
                 !(flags & kSCNetworkReachabilityFlagsConnectionRequired);
    }
    CFRelease(reach);
  }
  connected = reachable;
  return @{
    @"isConnected" : @(connected),
    @"isInternetReachable" : @(connected),
    @"type" : @(connected ? 1 : 0),
    @"isWifiEnabled" : @(connected),
  };
}

- (id)getIpAddressAsync {

  @try { return [self getIpAddress]; } @catch (NSException *e) { return nil; }
}
- (id)getNetworkStateAsync {

  @try { return [self getNetworkState]; } @catch (NSException *e) { return nil; }
}
- (void)addListener:(NSString *)eventName {
  // The LynxPo playground showcase reads values via the *Async promise APIs,
  // not via native events, so listener registration is a safe no-op here.
}
- (void)removeListeners:(double)count {}



#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"addListener" : NSStringFromSelector(@selector(addListener)),
    @"getIpAddress" : NSStringFromSelector(@selector(getIpAddress)),
    @"getIpAddressAsync" : NSStringFromSelector(@selector(getIpAddressAsync)),
    @"getNetworkState" : NSStringFromSelector(@selector(getNetworkState)),
    @"getNetworkStateAsync" : NSStringFromSelector(@selector(getNetworkStateAsync)),
    @"removeListeners" : NSStringFromSelector(@selector(removeListeners)),
  };
}
@end
