// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>
#import <AuthenticationServices/AuthenticationServices.h>

@interface AppleAuthentication () <LynxModule, ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding>
@property (nonatomic, copy) LynxCallbackBlock pendingResolve;
@property (nonatomic, copy) LynxCallbackBlock pendingReject;
@end

@implementation AppleAuthentication

+ (NSString *)name {
  return @"AppleAuthentication";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"credentialAsync" : @"credentialAsync:",
    @"credentialStateAsync" : @"credentialStateAsync:",
  };
}

- (BOOL)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  if (@available(iOS 13.0, *)) {
    resolve(@(YES));
  } else {
    resolve(@(NO));
  }
  return YES;
}

- (NSDictionary *)credentialAsync:(NSString *)options resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  if (@available(iOS 13.0, *)) {
    ASAuthorizationAppleIDProvider *provider = [[ASAuthorizationAppleIDProvider alloc] init];
    ASAuthorizationAppleIDRequest *request = [provider createRequest];
    request.requestedScopes = @[ASAuthorizationScopeFullName, ASAuthorizationScopeEmail];
    ASAuthorizationController *controller =
        [[ASAuthorizationController alloc] initWithAuthorizationRequests:@[request]];
    self.pendingResolve = resolve;
    self.pendingReject = reject;
    controller.delegate = self;
    controller.presentationContextProvider = self;
    [controller performRequests];
    return YES;
  }
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(NO);
  result[@"error"] = @"Sign in with Apple requires iOS 13+.";
  resolve(result);
  return YES;
}

- (NSString *)credentialStateAsync:(NSString *)user resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  if (@available(iOS 13.0, *)) {
    ASAuthorizationAppleIDProvider *provider = [[ASAuthorizationAppleIDProvider alloc] init];
    [provider getCredentialStateForUserID:user completion:^(ASAuthorizationAppleIDCredentialState state, NSError * _Nullable error) {
      NSString *stateStr = @"unknown";
      if (state == ASAuthorizationAppleIDCredentialStateAuthorized) stateStr = @"authorized";
      else if (state == ASAuthorizationAppleIDCredentialStateRevoked) stateStr = @"revoked";
      else if (state == ASAuthorizationAppleIDCredentialStateNotFound) stateStr = @"notFound";
      resolve(stateStr);
    }];
    return YES;
  }
  resolve(@"unsupported");
  return YES;
}

#pragma mark - ASAuthorizationControllerDelegate

- (void)authorizationController:(ASAuthorizationController *)controller
   didCompleteWithAuthorization:(ASAuthorization *)authorization API_AVAILABLE(ios(13.0)) {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ([authorization.credential isKindOfClass:[ASAuthorizationAppleIDCredential class]]) {
    ASAuthorizationAppleIDCredential *cred = (ASAuthorizationAppleIDCredential *)authorization.credential;
    result[@"available"] = @(YES);
    result[@"user"] = cred.user;
    result[@"email"] = cred.email ?: @"" ;
    result[@"state"] = cred.state ?: @"";
    result[@"identityToken"] = cred.identityToken
        ? [[NSString alloc] initWithData:cred.identityToken encoding:NSUTF8StringEncoding] : @"";
    result[@"source"] = @"AuthenticationServices";
  } else {
    result[@"available"] = @(NO);
    result[@"error"] = @"unexpected credential type";
  }
  if (self.pendingResolve) self.pendingResolve(result);
}

- (void)authorizationController:(ASAuthorizationController *)controller
           didCompleteWithError:(NSError *)error API_AVAILABLE(ios(13.0)) {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(NO);
  result[@"error"] = error.localizedDescription;
  if (self.pendingResolve) self.pendingResolve(result);
}

#pragma mark - ASAuthorizationControllerPresentationContextProviding

- (ASPresentationAnchor)presentationAnchorForAuthorizationController:(ASAuthorizationController *)controller API_AVAILABLE(ios(13.0)) {
  return [UIApplication sharedApplication].keyWindow;
}

@end
