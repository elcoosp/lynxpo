// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import <UIKit/UIKit.h>
#import "AppleAuthentication.h"

@interface AppleAuthentication ()
@property (nonatomic, copy) LynxCallbackBlock pendingCb;
@end

@implementation AppleAuthentication

- (BOOL)isAvailableAsync {
  BOOL available = NO;
  if (@available(iOS 13.0, *)) {
    available = YES;
  }
  return available;
}

- (void)credentialAsync:(NSString *)options cb:(id)cb {
  if (@available(iOS 13.0, *)) {
    self.pendingCb = (LynxCallbackBlock)cb;
    ASAuthorizationAppleIDProvider *provider = [[ASAuthorizationAppleIDProvider alloc] init];
    ASAuthorizationAppleIDRequest *request = [provider createRequest];
    request.requestedScopes = @[ASAuthorizationScopeFullName, ASAuthorizationScopeEmail];
    ASAuthorizationController *controller =
        [[ASAuthorizationController alloc] initWithAuthorizationRequests:@[request]];
    controller.delegate = self;
    controller.presentationContextProvider = self;
    [controller performRequests];
    return;
  }
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(NO);
  result[@"error"] = @"Sign in with Apple requires iOS 13+.";
  if (cb) ((LynxCallbackBlock)cb)(result);
}

- (void)credentialStateAsync:(NSString *)user cb:(id)cb {
  if (@available(iOS 13.0, *)) {
    ASAuthorizationAppleIDProvider *provider = [[ASAuthorizationAppleIDProvider alloc] init];
    [provider getCredentialStateForUserID:user completion:^(ASAuthorizationAppleIDProviderCredentialState state, NSError * _Nullable error) {
      NSString *stateStr = @"unknown";
      if (state == ASAuthorizationAppleIDProviderCredentialAuthorized) stateStr = @"authorized";
      else if (state == ASAuthorizationAppleIDProviderCredentialRevoked) stateStr = @"revoked";
      else if (state == ASAuthorizationAppleIDProviderCredentialNotFound) stateStr = @"notFound";
      if (cb) ((LynxCallbackBlock)cb)(stateStr);
    }];
    return;
  }
  if (cb) ((LynxCallbackBlock)cb)(@"unsupported");
}

#pragma mark - ASAuthorizationControllerDelegate

- (void)authorizationController:(ASAuthorizationController *)controller
   didCompleteWithAuthorization:(id)authorization API_AVAILABLE(ios(13.0)) {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ([authorization isKindOfClass:[ASAuthorizationAppleIDCredential class]]) {
    ASAuthorizationAppleIDCredential *cred = (ASAuthorizationAppleIDCredential *)authorization;
    result[@"available"] = @(YES);
    result[@"user"] = cred.user;
    result[@"email"] = cred.email ?: @"";
    result[@"state"] = cred.state ?: @"";
    result[@"identityToken"] = cred.identityToken
        ? [[NSString alloc] initWithData:cred.identityToken encoding:NSUTF8StringEncoding] : @"";
    result[@"source"] = @"AuthenticationServices";
  } else {
    result[@"available"] = @(NO);
    result[@"error"] = @"unexpected credential type";
  }
  if (self.pendingCb) self.pendingCb(result);
  self.pendingCb = nil;
}

- (void)authorizationController:(ASAuthorizationController *)controller
           didCompleteWithError:(NSError *)error API_AVAILABLE(ios(13.0)) {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(NO);
  result[@"error"] = error.localizedDescription;
  if (self.pendingCb) self.pendingCb(result);
  self.pendingCb = nil;
}

#pragma mark - ASAuthorizationControllerPresentationContextProviding

- (ASPresentationAnchor)presentationAnchorForAuthorizationController:(ASAuthorizationController *)controller API_AVAILABLE(ios(13.0)) {
  return [UIApplication sharedApplication].keyWindow;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"credentialAsync" : NSStringFromSelector(@selector(credentialAsync:cb:)),
    @"credentialStateAsync" : NSStringFromSelector(@selector(credentialStateAsync:cb:)),
    @"isAvailableAsync" : NSStringFromSelector(@selector(isAvailableAsync)),
  };
}
@end
