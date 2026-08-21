// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.sensors.generated.SensorsModuleSpec;
import com.lynx.jsbridge.Promise;
import com.lynx.react.bridge.JavaOnlyMap;

/**
 * Android counterpart of the iOS {@code SensorsModule}. Exposes raw motion
 * sensor readings to JS via {@code NativeModules.SensorsModule}, faithfully
 * porting the native method surface of Expo's {@code expo-sensors} (latest)
 * module. Method names MUST match the iOS {@code methodLookup} keys so the
 * shared {@code @lynxpo/mods-sensors} accessors resolve on both platforms.
 *
 * <p>Sensor APIs ({@code SensorManager}, {@code Sensor.TYPE_ACCELEROMETER},
 * {@code Sensor.TYPE_GYROSCOPE}) live in {@code android.hardware} since API 1,
 * so they are available on every supported compile level — no reflection or
 * API23+ symbols required. Each reading is sampled synchronously on demand
 * (single-frame poll), which is the faithful native primitive expo-sensors
 * builds its async subscriptions on.
 */
@LynxNativeModule(name = "SensorsModule")
public class SensorsModule extends SensorsModuleSpec {

  public SensorsModule(Context context) {
    super(context);
  }

  private SensorManager getSensorManager() {
    return (SensorManager) mContext.getSystemService(Context.SENSOR_SERVICE);
  }

  private JavaOnlyMap sampleSensor(int sensorType) {
    JavaOnlyMap result = new JavaOnlyMap();
    result.putDouble("x", 0d);
    result.putDouble("y", 0d);
    result.putDouble("z", 0d);
    SensorManager sm = getSensorManager();
    if (sm == null) {
      return result;
    }
    Sensor sensor = sm.getDefaultSensor(sensorType);
    if (sensor == null) {
      return result;
    }
    // Single-frame synchronous poll: register, wait one loop for the first
    // event, then unregister. SensorManager delivers on the looper thread.
    final Object[] sample = new Object[1];
    SensorEventListener listener =
        new SensorEventListener() {
          @Override
          public void onSensorChanged(SensorEvent event) {
            synchronized (sample) {
              if (sample[0] == null && event != null && event.values.length >= 3) {
                JavaOnlyMap m = new JavaOnlyMap();
                m.putDouble("x", (double) event.values[0]);
                m.putDouble("y", (double) event.values[1]);
                m.putDouble("z", (double) event.values[2]);
                sample[0] = m;
                synchronized (sample) {
                  sample.notifyAll();
                }
              }
            }
          }

          @Override
          public void onAccuracyChanged(Sensor sensor, int accuracy) {}
        };
    try {
      sm.registerListener(listener, sensor, SensorManager.SENSOR_DELAY_NORMAL);
      synchronized (sample) {
        if (sample[0] == null) {
          sample.wait(200);
        }
      }
    } catch (Exception ignored) {
      // sensor polling is best-effort; fall back to zeros
    } finally {
      try {
        sm.unregisterListener(listener);
      } catch (Exception ignored) {
      }
    }
    if (sample[0] instanceof JavaOnlyMap) {
      return (JavaOnlyMap) sample[0];
    }
    return result;
  }

  @LynxMethod
  public JavaOnlyMap getAccelerometer() {
    return sampleSensor(Sensor.TYPE_ACCELEROMETER);
  }

  @LynxMethod
  public JavaOnlyMap getGyroscope() {
    return sampleSensor(Sensor.TYPE_GYROSCOPE);
  }

  @LynxMethod
  public boolean isAvailable() {
    SensorManager sm = getSensorManager();
    if (sm == null) {
      return false;
    }
    return sm.getDefaultSensor(Sensor.TYPE_ACCELEROMETER) != null
        || sm.getDefaultSensor(Sensor.TYPE_GYROSCOPE) != null;
  }

  @LynxMethod
  public void getAccelerometerAsync(final Promise promise) {
    try {
      promise.resolve(getAccelerometer());
    } catch (Exception e) {
      promise.reject("ERR_SENSORS", e.getMessage());
    }
  }

  @LynxMethod
  public void getGyroscopeAsync(final Promise promise) {
    try {
      promise.resolve(getGyroscope());
    } catch (Exception e) {
      promise.reject("ERR_SENSORS", e.getMessage());
    }
  }

  @LynxMethod
  public void isAvailableAsync(final Promise promise) {
    try {
      promise.resolve(isAvailable());
    } catch (Exception e) {
      promise.reject("ERR_SENSORS", e.getMessage());
    }
  }
}
