// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ImagePickerModule.h"
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <Photos/Photos.h>

@interface ImagePickerModule () <UIImagePickerControllerDelegate,
                                 UINavigationControllerDelegate>
@property (nonatomic, copy) LynxCallbackBlock pendingResolve;
@end

@implementation ImagePickerModule

+ (NSString *)name {
  return @"ImagePickerModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getCameraPermissions" : NSStringFromSelector(@selector(getCameraPermissions)),
    @"getMediaLibraryPermissions" : NSStringFromSelector(@selector(getMediaLibraryPermissions)),
    // Async variants (required by the generated TS wrappers).
    @"getCameraPermissionsAsync" : NSStringFromSelector(@selector(getCameraPermissionsAsync:reject:)),
    @"getMediaLibraryPermissionsAsync" : NSStringFromSelector(@selector(getMediaLibraryPermissionsAsync:reject:)),
    @"launchImageLibraryAsync" : NSStringFromSelector(@selector(launchImageLibraryAsync:reject:)),
    @"launchCameraAsync" : NSStringFromSelector(@selector(launchCameraAsync:reject:)),
  };
}

#pragma mark - Status helpers

- (NSString *)cameraStatusString:(AVAuthorizationStatus)status {
  switch (status) {
    case AVAuthorizationStatusAuthorized: return @"granted";
    case AVAuthorizationStatusDenied: return @"denied";
    case AVAuthorizationStatusRestricted: return @"restricted";
    default: return @"undetermined";
  }
}

- (NSString *)photoStatusString:(PHAuthorizationStatus)status {
  switch (status) {
    case PHAuthorizationStatusAuthorized: return @"granted";
    case PHAuthorizationStatusDenied: return @"denied";
    case PHAuthorizationStatusRestricted: return @"restricted";
    default: break;
  }
  if (@available(iOS 14.0, *)) {
    if (status == PHAuthorizationStatusLimited) return @"limited";
  }
  return @"undetermined";
}

- (NSDictionary *)permissionDictWithStatus:(NSString *)status granted:(BOOL)granted {
  return @{
    @"status" : status,
    @"granted" : @(granted),
    @"canAskAgain" : @(!granted),
    @"expires" : @"never",
  };
}

- (UIViewController *)topViewController {
  UIViewController *root =
      UIApplication.sharedApplication.delegate.window.rootViewController;
  while (root.presentedViewController) {
    root = root.presentedViewController;
  }
  if ([root isKindOfClass:[UINavigationController class]]) {
    root = [(UINavigationController *)root topViewController];
  }
  return root;
}

#pragma mark - Sync getters (read live authorization state)

- (NSDictionary *)getCameraPermissions {
  AVAuthorizationStatus status =
      [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  BOOL granted = status == AVAuthorizationStatusAuthorized;
  return [self permissionDictWithStatus:[self cameraStatusString:status]
                                 granted:granted];
}

- (NSDictionary *)getMediaLibraryPermissions {
  PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
  BOOL granted = status == PHAuthorizationStatusAuthorized;
  if (@available(iOS 14.0, *)) {
    granted = granted || status == PHAuthorizationStatusLimited;
  }
  return [self permissionDictWithStatus:[self photoStatusString:status]
                                 granted:granted];
}

#pragma mark - Async permission requests (prompt iOS)

- (void)getCameraPermissionsAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo
                             completionHandler:^(BOOL granted) {
      AVAuthorizationStatus status =
          [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
      dispatch_async(dispatch_get_main_queue(), ^{
        resolve([self permissionDictWithStatus:[self cameraStatusString:status]
                                        granted:granted]);
      });
    }];
  } @catch (NSException *e) { reject(e.reason); }
}

- (void)getMediaLibraryPermissionsAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    void (^handle)(PHAuthorizationStatus) = ^(PHAuthorizationStatus status) {
      BOOL granted = status == PHAuthorizationStatusAuthorized;
      if (@available(iOS 14.0, *)) {
        granted = granted || status == PHAuthorizationStatusLimited;
      }
      dispatch_async(dispatch_get_main_queue(), ^{
        resolve([self permissionDictWithStatus:[self photoStatusString:status]
                                        granted:granted]);
      });
    };
    if (@available(iOS 14.0, *)) {
      [PHPhotoLibrary requestAuthorizationForAccessLevel:PHAccessLevelReadWrite
                                                 handler:handle];
    } else {
      [PHPhotoLibrary requestAuthorization:handle];
    }
  } @catch (NSException *e) { reject(e.reason); }
}

#pragma mark - Launch picker (functional, not a stub)

- (void)launchCameraAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    AVAuthorizationStatus status =
        [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if (status != AVAuthorizationStatusAuthorized ||
        ![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
      resolve([self getCameraPermissions]);
      return;
    }
    [self presentPickerWithSource:UIImagePickerControllerSourceTypeCamera resolve:resolve];
  } @catch (NSException *e) { reject(e.reason); }
}

- (void)launchImageLibraryAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
    BOOL hasAccess = status == PHAuthorizationStatusAuthorized;
    if (@available(iOS 14.0, *)) {
      hasAccess = hasAccess || status == PHAuthorizationStatusLimited;
    }
    if (!hasAccess) {
      resolve([self getMediaLibraryPermissions]);
      return;
    }
    [self presentPickerWithSource:UIImagePickerControllerSourceTypePhotoLibrary resolve:resolve];
  } @catch (NSException *e) { reject(e.reason); }
}

- (void)presentPickerWithSource:(UIImagePickerControllerSourceType)source
                        resolve:(LynxCallbackBlock)resolve {
  UIImagePickerController *picker = [[UIImagePickerController alloc] init];
  picker.sourceType = source;
  picker.delegate = self;
  picker.allowsEditing = NO;
  self.pendingResolve = resolve;
  [[self topViewController] presentViewController:picker animated:YES completion:nil];
}

- (NSString *)saveTempPNG:(UIImage *)image {
  if (!image) return nil;
  NSString *dir = NSTemporaryDirectory();
  NSString *path =
      [dir stringByAppendingPathComponent:
               [NSString stringWithFormat:@"lynxpo_picked_%@.png",
                                          [[NSUUID UUID] UUIDString]]];
  NSData *data = UIImagePNGRepresentation(image);
  if ([data writeToFile:path atomically:YES]) {
    return path;
  }
  return nil;
}

#pragma mark - UIImagePickerControllerDelegate

- (void)imagePickerController:(UIImagePickerController *)picker
    didFinishPickingMediaWithInfo:(NSDictionary<NSString *, id> *)info {
  UIImage *image = info[UIImagePickerControllerOriginalImage];
  NSString *uri = [self saveTempPNG:image];
  [picker dismissViewControllerAnimated:YES completion:nil];
  LynxCallbackBlock resolve = self.pendingResolve;
  self.pendingResolve = nil;
  if (resolve) {
    resolve(@{ @"cancelled" : @NO, @"uri" : (uri ?: [NSNull null]) });
  }
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
  [picker dismissViewControllerAnimated:YES completion:nil];
  LynxCallbackBlock resolve = self.pendingResolve;
  self.pendingResolve = nil;
  if (resolve) {
    resolve(@{ @"cancelled" : @YES });
  }
}

@end
