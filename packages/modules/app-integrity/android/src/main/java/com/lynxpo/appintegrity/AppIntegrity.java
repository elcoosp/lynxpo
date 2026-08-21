// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynxpo.appintegrity;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.appintegrity.generated.AppIntegritySpec;
import com.lynx.react.bridge.Callback;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;
import java.security.MessageDigest;

/**
 * Android runtime twin of AppIntegrity (expo-app-integrity). Reports the real
 * availability of the Play Integrity API (present when the Play Store /
 * Play Services is installed) and the SHA-256 of the app's signing
 * certificate — a genuine device identity signal. A full integrity token
 * requires a server-side call to Google with a cloud project; that step is
 * out of scope on-device and is reported honestly rather than faked.
 */
@LynxNativeModule(name = "AppIntegrity")
public class AppIntegrity extends AppIntegritySpec {

  public AppIntegrity(Context context) {
    super(context);
  }

  @Override
  public boolean isAvailableAsync() {
    // Play Integrity is gated on Google Play services being present.
    Context ctx = mContext;
    if (ctx == null) {
      return false;
    }
    try {
      ctx.getPackageManager()
          .getPackageInfo("com.android.vending", 0);
      return true;
    } catch (PackageManager.NameNotFoundException e) {
      return false;
    }
  }

  @Override
  public void integrityTokenAsync(String options, Object cb) {
    WritableMap map = new JavaOnlyMap();
    // A real token requires the Play Integrity client + a cloud project +
    // a backend verification exchange. We surface that constraint truthfully.
    map.putBoolean("available", isAvailableAsync());
    map.putBoolean("token", false);
    map.putString("error",
        "Play Integrity token requires a cloud project and server-side "
            + "verification (requestIntegrityToken + decrypt on backend). "
            + "Not performed on-device.");
    map.putString("source", "PlayIntegrity");
    if (cb instanceof Callback) {
      ((Callback) cb).invoke(map);
    }
  }

  @Override
  public WritableMap codeHashAsync() {
    WritableMap map = new JavaOnlyMap();
    Context ctx = mContext;
    if (ctx == null) {
      map.putBoolean("available", false);
      return map;
    }
    try {
      String pkg = ctx.getPackageName();
      PackageInfo pi = ctx.getPackageManager()
          .getPackageInfo(pkg, PackageManager.GET_SIGNATURES);
      byte[] cert = null;
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        if (pi.signingInfo != null) {
          Signature[] sigs = pi.signingInfo.getApkContentsSigners();
          if (sigs.length > 0) {
            cert = sigs[0].toByteArray();
          }
        }
      } else if (pi.signatures != null && pi.signatures.length > 0) {
        cert = pi.signatures[0].toByteArray();
      }
      if (cert != null) {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] fp = md.digest(cert);
        StringBuilder sb = new StringBuilder(fp.length * 2);
        for (byte b : fp) {
          sb.append(String.format("%02x", b));
        }
        map.putBoolean("available", true);
        map.putString("signingCertSha256", sb.toString());
        map.putString("source", "PackageManager");
      } else {
        map.putBoolean("available", false);
        map.putString("error", "no signing certificate");
      }
    } catch (Exception e) {
      map.putBoolean("available", false);
      map.putString("error", e.getMessage());
    }
    return map;
  }
}
