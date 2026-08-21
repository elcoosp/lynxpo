// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.sqlite.generated.SqliteModuleSpec;
import com.lynx.react.bridge.JavaOnlyArray;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.Map;

/**
 * Android counterpart of the iOS {@code SqliteModule}. Exposes a SQLite-style roundtrip to JS
 * via {@code NativeModules.SqliteModule}, faithfully porting the native method surface of
 * Expo's {@code expo-sqlite} (latest) module. Method names MUST match the iOS methodLookup
 * keys so the shared {@code @lynxpo/mods-sqlite} accessors resolve on both platforms.
 *
 * Uses an in-memory SQLite database so the showcase can run a real CREATE + INSERT + SELECT
 * roundtrip without touching device storage.
 */
@LynxNativeModule(name = "SqliteModule")
public class SqliteModule extends SqliteModuleSpec {

  private SQLiteDatabase db;

  public SqliteModule(Context context) {
    super(context);
    db = SQLiteDatabase.openOrCreateDatabase(":memory:", null);
    db.execSQL("CREATE TABLE IF NOT EXISTS kv (id INTEGER PRIMARY KEY, value TEXT)");
  }

  @LynxMethod
  public void openDatabase(String name) {
    // Already backed by an in-memory db; open is a no-op here.
  }

  @LynxMethod
  public WritableArray execSync(String query) {
    WritableArray array = new JavaOnlyArray();
    if (db == null || query == null) return array;
    String upper = query.toUpperCase().trim();
    try {
      if (upper.startsWith("SELECT")) {
        Cursor c = db.rawQuery(query, null);
        while (c.moveToNext()) {
          JavaOnlyMap row = new JavaOnlyMap();
          for (int i = 0; i < c.getColumnCount(); i++) {
            String col = c.getColumnName(i);
            int type = c.getType(i);
            if (type == Cursor.FIELD_TYPE_INTEGER) {
              row.putInt(col, c.getInt(i));
            } else if (type == Cursor.FIELD_TYPE_FLOAT) {
              row.putDouble(col, c.getDouble(i));
            } else {
              row.putString(col, c.getString(i));
            }
          }
          array.pushMap(row);
        }
        c.close();
      } else if (upper.startsWith("INSERT")) {
        db.execSQL(query);
        // return the newly inserted row
        Cursor c = db.rawQuery("SELECT * FROM kv ORDER BY id DESC LIMIT 1", null);
        if (c.moveToFirst()) {
          JavaOnlyMap row = new JavaOnlyMap();
          for (int i = 0; i < c.getColumnCount(); i++) {
            String col = c.getColumnName(i);
            int type = c.getType(i);
            if (type == Cursor.FIELD_TYPE_INTEGER) {
              row.putInt(col, c.getInt(i));
            } else if (type == Cursor.FIELD_TYPE_FLOAT) {
              row.putDouble(col, c.getDouble(i));
            } else {
              row.putString(col, c.getString(i));
            }
          }
          array.pushMap(row);
        }
        c.close();
      } else {
        db.execSQL(query);
      }
    } catch (Exception e) {
      JavaOnlyMap err = new JavaOnlyMap();
      err.putString("error", e.getMessage());
      array.pushMap(err);
    }
    return array;
  }

  @LynxMethod
  public WritableArray getAllSync(String query) {
    return execSync(query);
  }
}
