// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynxpo.imagepicker;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

/** Hosts system pickers outside the Lynx view and forwards results to {@link ImagePickerModule}. */
public class ImagePickerProxyActivity extends Activity {
  private static final int REQUEST_PICK = 0x4C5A;
  private static final int REQUEST_CAMERA = 0x4C5B;
  private static final int REQUEST_PERMISSION = 0x4C5C;

  private String pendingPermission;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (savedInstanceState != null) return;
    Intent intent = getIntent();
    String[] permissions = intent.getStringArrayExtra(ImagePickerModule.EXTRA_REQUEST_PERMISSIONS);
    if (permissions != null && permissions.length > 0) {
      pendingPermission = permissions[0];
      ActivityCompat.requestPermissions(this, permissions, REQUEST_PERMISSION);
      return;
    }
    int action = intent.getIntExtra(ImagePickerModule.EXTRA_PICKER_ACTION, 0);
    if (action == ImagePickerModule.ACTION_CAMERA) {
      String uri = intent.getStringExtra(ImagePickerModule.EXTRA_CAMERA_URI);
      Intent capture = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
      if (uri != null) {
        capture.putExtra(MediaStore.EXTRA_OUTPUT, Uri.parse(uri));
        capture.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
      }
      try {
        startActivityForResult(capture, REQUEST_CAMERA);
      } catch (Exception e) {
        ImagePickerModule.rejectPicked(e.getMessage());
        finish();
      }
    } else if (action == ImagePickerModule.ACTION_LIBRARY) {
      Intent pick = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
      pick.setType("image/*");
      try {
        startActivityForResult(pick, REQUEST_PICK);
      } catch (Exception e) {
        ImagePickerModule.rejectPicked(e.getMessage());
        finish();
      }
    } else {
      finish();
    }
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQUEST_PERMISSION) {
      ImagePickerModule.resolvePermission(this, pendingPermission);
    } else if (requestCode == REQUEST_CAMERA) {
      if (resultCode == RESULT_OK) {
        ImagePickerModule.resolvePicked(ImagePickerModule.consumePendingCameraUri(), false);
      } else {
        ImagePickerModule.resolvePicked(null, true);
      }
    } else if (requestCode == REQUEST_PICK) {
      Uri uri = data != null ? data.getData() : null;
      ImagePickerModule.resolvePicked(uri, resultCode != RESULT_OK || uri == null);
    }
    finish();
  }

  @Override
  public void onRequestPermissionsResult(
      int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    if (requestCode == REQUEST_PERMISSION && pendingPermission != null) {
      ImagePickerModule.resolvePermission(this, pendingPermission);
    }
    finish();
  }
}
