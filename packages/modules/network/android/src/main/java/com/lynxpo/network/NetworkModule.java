// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.LinkAddress;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Build;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.network.generated.NetworkModuleSpec;
import com.lynx.jsbridge.Promise;
import com.lynx.jsbridge.Arguments;
import com.lynx.react.bridge.WritableMap;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Enumeration;

/**
 * Android counterpart of the iOS {@code NetworkModule}. Exposes network state to
 * JS via {@code NativeModules.NetworkModule}, faithfully porting the native
 * method surface of Expo's {@code expo-network} (latest) module. Method names
 * MUST match the iOS methodLookup keys so the shared {@code @lynxpo/mods-
 * network} accessors resolve on both platforms.
 *
 * <p>The event/subscription surface of expo-network is intentionally omitted —
 * it requires an async event bridge beyond this module's synchronous contract.
 */
@LynxNativeModule(name = "NetworkModule")
public class NetworkModule extends NetworkModuleSpec {

  public NetworkModule(Context context) {
    super(context);
  }

  @LynxMethod
  public String getIpAddress() {
    try {
      Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();
      while (interfaces.hasMoreElements()) {
        NetworkInterface nif = interfaces.nextElement();
        if (nif.isLoopback() || !nif.isUp()) {
          continue;
        }
        Enumeration<InetAddress> addresses = nif.getInetAddresses();
        while (addresses.hasMoreElements()) {
          InetAddress addr = addresses.nextElement();
          if (addr instanceof Inet4Address && !addr.isLoopbackAddress()) {
            return addr.getHostAddress();
          }
        }
      }
    } catch (Exception ignored) {
      // fall through to connectivity-manager path
    }
    return null;
  }

  @LynxMethod
  public WritableMap getNetworkState() {
    WritableMap state = Arguments.createMap();
    ConnectivityManager cm =
        (ConnectivityManager) mContext.getSystemService(Context.CONNECTIVITY_SERVICE);
    if (cm == null) {
      state.putBoolean("isConnected", false);
      state.putBoolean("isInternetReachable", false);
      state.putInt("type", 0); // UNKNOWN
      state.putBoolean("isWifiEnabled", false);
      return state;
    }
    NetworkCapabilities caps = null;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      Network network = cm.getActiveNetwork();
      caps = network != null ? cm.getNetworkCapabilities(network) : null;
    }
    boolean connected = caps != null;
    state.putBoolean("isConnected", connected);
    state.putBoolean("isInternetReachable", connected);
    if (caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
      state.putInt("type", 1); // WIFI
    } else if (caps != null && caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
      state.putInt("type", 2); // CELLULAR
    } else {
      state.putInt("type", 0); // UNKNOWN
    }
    boolean wifiEnabled = false;
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
      // method deprecated but safe to call below Q
      wifiEnabled = cm.getNetworkInfo(ConnectivityManager.TYPE_WIFI) != null
          && cm.getNetworkInfo(ConnectivityManager.TYPE_WIFI).isConnectedOrConnecting();
    }
    state.putBoolean("isWifiEnabled", wifiEnabled);
    return state;
  }

  @LynxMethod
  public void getIpAddressAsync(final Promise promise) {
    try { promise.resolve(getIpAddress()); } catch (Exception e) { promise.reject("ERROR", e.getMessage()); }
  }
  @LynxMethod
  public void getNetworkStateAsync(final Promise promise) {
    try { promise.resolve(getNetworkState()); } catch (Exception e) { promise.reject("ERROR", e.getMessage()); }
  }
  @LynxMethod
  public void addListener(String eventName) { startNetworkObserver(eventName); }
  @LynxMethod
  public void removeListeners(int count) { stopNetworkObserver(); }

  private android.net.ConnectivityManager.NetworkCallback mNetCallback;
  private String mNetEventName;
  private void emitNetwork() {
    if (mNetEventName == null) return;
    com.lynx.tasm.behavior.LynxContext ctx = (com.lynx.tasm.behavior.LynxContext) mContext;
    com.lynx.react.bridge.JavaOnlyArray params = new com.lynx.react.bridge.JavaOnlyArray();
    params.add(getNetworkState());
    ctx.sendGlobalEvent(mNetEventName, params);
  }
  private void startNetworkObserver(String eventName) {
    mNetEventName = eventName;
    android.net.ConnectivityManager cm = (android.net.ConnectivityManager) mContext.getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
    mNetCallback = new android.net.ConnectivityManager.NetworkCallback() {
      @Override public void onAvailable(android.net.Network n) { emitNetwork(); }
      @Override public void onLost(android.net.Network n) { emitNetwork(); }
    };
    try { cm.registerDefaultNetworkCallback(mNetCallback); } catch (Exception ignored) {}
    emitNetwork();
  }
  private void stopNetworkObserver() {
    if (mNetCallback != null) {
      android.net.ConnectivityManager cm = (android.net.ConnectivityManager) mContext.getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
      try { cm.unregisterNetworkCallback(mNetCallback); } catch (Exception ignored) {}
    }
    mNetCallback = null; mNetEventName = null;
  }
}
