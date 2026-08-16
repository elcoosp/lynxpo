package com.lynx.explorer.modules

import android.content.Context
import android.icu.util.LocaleData
import android.icu.util.ULocale
import android.os.Build
import android.text.TextUtils
import android.text.format.DateFormat
import android.util.LayoutDirection
import androidx.core.os.LocaleListCompat
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import java.text.DecimalFormatSymbols
import java.util.*

/**
 * Android source-of-truth for the `@lynxpo/mods-localization` package. The ktts
 * plugin reads this file and generates `src/index.ts` (the `getX`/`useX`
 * accessors). Method names mirror Expo's `expo-localization` (latest) native
 * module surface, reusing its implementation logic. The runtime twin of this
 * module lives in the Lynx Explorer as `LocalizationModule` (registered via
 * nmi).
 */
class LocalizationModule(private val context: Context) : LynxModule(context) {
  @LynxMethod
  fun getLocales(): List<Map<String, Any?>> {
    val locales = mutableListOf<Map<String, Any?>>()
    val localeList = LocaleListCompat.getDefault()
    for (i in 0 until localeList.size()) {
      val locale = localeList[i] ?: continue
      try {
        val symbols = DecimalFormatSymbols.getInstance(locale)
        val entry = mutableMapOf<String, Any?>(
          "languageTag" to locale.toLanguageTag(),
          "regionCode" to getRegionCode(locale),
          "languageRegionCode" to getCountryCode(locale),
          "textDirection" to if (TextUtils.getLayoutDirectionFromLocale(locale) == LayoutDirection.RTL) "rtl" else "ltr",
          "languageCode" to locale.language,
          "languageScriptCode" to locale.script.ifEmpty { null },
          "decimalSeparator" to symbols.decimalSeparator.toString(),
          "digitGroupingSeparator" to symbols.groupingSeparator.toString(),
          "measurementSystem" to getMeasurementSystem(locale),
          "temperatureUnit" to getTemperatureUnit(locale),
        )
        entry.putAll(getCurrencyProperties(locale))
        locales.add(entry)
      } catch (_: Exception) {
        // skip problematic locale, mirroring Expo
      }
    }
    return locales
  }

  @LynxMethod
  fun getCalendars(): List<Map<String, Any?>> {
    val calendar = mutableMapOf<String, Any?>(
      "calendar" to getCalendarType(),
      "uses24hourClock" to DateFormat.is24HourFormat(context),
      "firstWeekday" to Calendar.getInstance().firstDayOfWeek,
      "timeZone" to Calendar.getInstance().timeZone.id,
    )
    return listOf(calendar)
  }

  private fun getCurrencyProperties(locale: Locale): Map<String, Any?> = try {
    val currency = Currency.getInstance(locale)
    mapOf(
      "currencyCode" to currency.currencyCode,
      "currencySymbol" to currency.getSymbol(locale),
      "languageCurrencyCode" to currency.currencyCode,
      "languageCurrencySymbol" to currency.getSymbol(locale),
    )
  } catch (_: Exception) {
    mapOf(
      "currencyCode" to null,
      "currencySymbol" to null,
      "languageCurrencyCode" to null,
      "languageCurrencySymbol" to null,
    )
  }

  private fun getMeasurementSystem(locale: Locale): String {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      when (LocaleData.getMeasurementSystem(ULocale.forLocale(locale))) {
        LocaleData.MeasurementSystem.UK -> "uk"
        LocaleData.MeasurementSystem.US -> "us"
        else -> "metric"
      }
    } else {
      val region = getRegionCode(locale)
      if (region == "uk") "uk" else if (USES_IMPERIAL.contains(region)) "us" else "metric"
    }
  }

  private fun getCountryCode(locale: Locale): String? {
    val country = locale.country
    return if (TextUtils.isEmpty(country)) null else country
  }

  private fun getRegionCode(locale: Locale): String? {
    val miuiRegion = getSystemProperty("ro.miui.region")
    return if (miuiRegion.isNullOrEmpty()) getCountryCode(locale) else miuiRegion
  }

  private fun getTemperatureUnit(locale: Locale): String? {
    val region = getRegionCode(locale) ?: return null
    return if (USES_FAHRENHEIT.contains(region)) "fahrenheit" else "celsius"
  }

  private fun getSystemProperty(key: String): String? = try {
    val sp = Class.forName("android.os.SystemProperties")
    val get = sp.getMethod("get", String::class.java.primitiveType ?: String::class.java)
    get.invoke(sp, key) as? String
  } catch (_: Exception) {
    null
  }

  private fun getCalendarType(): String {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Calendar.getInstance().calendarType.toString()
    } else {
      "gregory"
    }
  }

  companion object {
    private val USES_IMPERIAL = listOf("US", "LR", "MM")
    private val USES_FAHRENHEIT = listOf(
      "AG", "BZ", "VG", "FM", "MH", "MS", "KN", "BS", "CY", "TC",
      "US", "LR", "PW", "KY",
    )
  }
}
