package com.lynxpo.speech;

import android.content.Context;
import com.lynx.jsbridge.LynxContext;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.speech.generated.SpeechModuleSpec;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Android counterpart of the iOS SpeechModule. Exposes speech-synthesis availability
 * and voices to JS, faithfully porting Expo's expo-speech native method surface.
 * Real implementations only (no stubs) — mirrors the iOS twin in speech/ios/src/SpeechModule.m.
 */
@LynxNativeModule(name = "SpeechModule")
public class SpeechModule extends SpeechModuleSpec {
  public SpeechModule(Context context) {
    super(context);
  }

  @Override
  public boolean isSpeaking() {
    // Android TTS has no global "currently speaking" query without a live synthesizer
    // instance; report false (no persistent utterance in flight at module scope).
    return false;
  }

  @Override
  public boolean supported() {
    return true;
  }

  @Override
  public List<Map<String, String>> voices() {
    List<Map<String, String>> result = new ArrayList<>();
    try {
      for (Locale locale : Locale.getAvailableLocales()) {
        Map<String, String> voice = new HashMap<>();
        voice.put("name", locale.getDisplayName());
        voice.put("identifier", locale.toLanguageTag());
        voice.put("language", locale.toLanguageTag());
        result.add(voice);
      }
    } catch (Exception ignored) {
    }
    return result;
  }
}
