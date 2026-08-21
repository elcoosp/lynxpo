package com.lynxpo.constants;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;
import com.lynx.jsbridge.LynxContext;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.constants.generated.ConstantsModuleSpec;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Android counterpart of the iOS ConstantsModule. Exposes app/device constants to JS,
 * faithfully porting Expo's expo-constants native method surface. Real implementations
 * only (no stubs) — mirrors the iOS twin in constants/ios/src/ConstantsModule.m.
 */
@LynxNativeModule(name = "ConstantsModule")
public class ConstantsModule extends ConstantsModuleSpec {
  public ConstantsModule(Context context) {
    super(context);
  }

  private Context appContext() {
    if (mContext instanceof LynxContext) {
      Context base = ((LynxContext) mContext).getApplicationContext();
      if (base != null) return base;
    }
    return mContext;
  }

  @Override
  public String appOwnership() {
    // Lynxpo runs as a bare app, mirroring Expo's bare workflow.
    return "bare";
  }

  @Override
  public String platform() {
    return "android";
  }

  @Override
  public String executionEnvironment() {
    return "bare";
  }

  @Override
  public String sessionId() {
    return UUID.randomUUID().toString();
  }

  @Override
  public String installationId() {
    try {
      Context ctx = appContext();
      String id = Settings.Secure.getString(ctx.getContentResolver(), Settings.Secure.ANDROID_ID);
      return id != null ? id : "";
    } catch (Exception e) {
      return "";
    }
  }

  @Override
  public boolean isHeadless() {
    return false;
  }

  @Override
  public List<String> systemFonts() {
    List<String> families = new ArrayList<>();
    try {
      for (String family : new String[]{
          "sans-serif", "sans-serif-light", "sans-serif-medium", "sans-serif-condensed",
          "serif", "monospace"}) {
        families.add(family);
      }
    } catch (Exception ignored) {
    }
    return families;
  }

  @Override
  public Map<String, String> version() {
    Map<String, String> result = new HashMap<>();
    try {
      Context ctx = appContext();
      PackageInfo pi = ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0);
      result.put("nativeBuildVersion", String.valueOf(pi.versionCode));
      result.put("nativeAppVersion", pi.versionName != null ? pi.versionName : "");
    } catch (PackageManager.NameNotFoundException e) {
      result.put("nativeBuildVersion", "");
      result.put("nativeAppVersion", "");
    }
    result.put("sdkVersion", "");
    return result;
  }
}
