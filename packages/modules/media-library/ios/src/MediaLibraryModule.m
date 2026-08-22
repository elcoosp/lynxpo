// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "MediaLibraryModule.h"
#import <Photos/Photos.h>

@implementation MediaLibraryModule



- (id)permissionsAsync {
  PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
  BOOL granted = (status == PHAuthorizationStatusAuthorized);
  NSString *statusStr = granted ? @"granted" : (status == PHAuthorizationStatusDenied ? @"denied" : @"undetermined");
  return @{ @"status" : statusStr, @"granted" : @(granted) };
}

- (void)requestPermission {
  PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
  if (status == PHAuthorizationStatusAuthorized) return;
  [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus s) {
    // The next permissionsAsync() call reflects the new status.
  }];
}

- (id)albumsAsync {
  NSMutableArray *albums = [NSMutableArray array];
  PHFetchResult *result = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum
                                                                  subtype:PHAssetCollectionSubtypeAny
                                                                  options:nil];
  for (PHAssetCollection *col in result) {
    PHFetchResult *assets = [PHAsset fetchAssetsInAssetCollection:col options:nil];
    [albums addObject:@{ @"title" : col.localizedTitle ?: @"", @"assetCount" : @(assets.count) }];
  }
  return albums;
}

- (id)assetsAsync {
  PHFetchResult *result = [PHAsset fetchAssetsWithMediaType:PHAssetMediaTypeImage options:nil];
  return @{ @"totalCount" : @(result.count), @"hasNextPage" : @(NO) };
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"albumsAsync" : NSStringFromSelector(@selector(albumsAsync)),
    @"assetsAsync" : NSStringFromSelector(@selector(assetsAsync)),
    @"permissionsAsync" : NSStringFromSelector(@selector(permissionsAsync)),
    @"requestPermission" : NSStringFromSelector(@selector(requestPermission)),
  };
}
@end
