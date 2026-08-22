// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LocalizationModule.h"
#import <UIKit/UIKit.h>

@implementation LocalizationModule



#pragma mark - helpers

+ (NSString *)unicodeCalendarIdentifier:(NSCalendar *)calendar {
  // Maps iOS calendar identifiers to BCP 47 calendar types (per Expo).
  NSDictionary<NSString *, NSString *> *map = @{
    NSCalendarIdentifierBuddhist : @"buddhist",
    NSCalendarIdentifierChinese : @"chinese",
    NSCalendarIdentifierCoptic : @"coptic",
    NSCalendarIdentifierEthiopicAmeteAlem : @"ethioaa",
    NSCalendarIdentifierEthiopicAmeteMihret : @"ethiopic",
    NSCalendarIdentifierGregorian : @"gregory",
    NSCalendarIdentifierHebrew : @"hebrew",
    NSCalendarIdentifierIndian : @"indian",
    NSCalendarIdentifierIslamic : @"islamic",
    NSCalendarIdentifierIslamicCivil : @"islamic-civil",
    NSCalendarIdentifierIslamicTabular : @"islamic-tbla",
    NSCalendarIdentifierIslamicUmmAlQura : @"islamic-umalqura",
    NSCalendarIdentifierJapanese : @"japanese",
    NSCalendarIdentifierPersian : @"persian",
    NSCalendarIdentifierRepublicOfChina : @"roc",
    NSCalendarIdentifierISO8601 : @"iso8601",
  };
  NSString *mapped = map[calendar.calendarIdentifier];
  return mapped ?: @"iso8601";
}

+ (NSString *)measurementSystemForLocale:(NSLocale *)locale {
  // `NSLocale.measurementSystem` is only available on iOS 16+, but the Explorer
  // deployment target is iOS 12. `usesMetricSystem` has always been available and
  // is sufficient to map to the Expo BCP-47 values ("metric" / "us").
  return locale.usesMetricSystem ? @"metric" : @"us";
}

+ (NSString *)temperatureUnit {
  NSMeasurementFormatter *formatter = [[NSMeasurementFormatter alloc] init];
  formatter.locale = NSLocale.currentLocale;
  NSMeasurement *temperature =
      [[NSMeasurement alloc] initWithDoubleValue:0 unit:[NSUnitTemperature celsius]];
  NSString *formatted = [formatter stringFromMeasurement:temperature];
  if (formatted.length == 0) {
    return nil;
  }
  unichar unitChar = [formatted characterAtIndex:formatted.length - 1];
  return unitChar == 'F' ? @"fahrenheit" : @"celsius";
}

+ (BOOL)uses24HourClock {
  NSString *dateFormat =
      [NSDateFormatter dateFormatFromTemplate:@"j" options:0 locale:NSLocale.currentLocale];
  return [dateFormat rangeOfString:@"a"].location == NSNotFound;
}

#pragma mark - LynxModule methods

- (id)getLocales {
  NSLocale *userSettingsLocale = NSLocale.currentLocale;
  NSArray<NSString *> *preferred =
      NSLocale.preferredLanguages.count > 0
          ? NSLocale.preferredLanguages
          : @[ NSLocale.currentLocale.localeIdentifier ];

  NSMutableArray<NSDictionary *> *result = [NSMutableArray array];
  for (NSString *languageTag in preferred) {
    NSLocale *languageLocale = [[NSLocale alloc] initWithLocaleIdentifier:languageTag];
    NSMutableDictionary *entry = [NSMutableDictionary dictionary];
    entry[@"languageTag"] = languageTag;
    entry[@"languageCode"] = languageLocale.languageCode ?: [NSNull null];
    entry[@"languageScriptCode"] = languageLocale.scriptCode ?: [NSNull null];
    entry[@"languageRegionCode"] = languageLocale.countryCode ?: [NSNull null];
    entry[@"regionCode"] = userSettingsLocale.countryCode ?: [NSNull null];
    entry[@"textDirection"] =
        ([NSLocale characterDirectionForLanguage:languageTag] == NSLocaleLanguageDirectionRightToLeft)
            ? @"rtl"
            : @"ltr";
    entry[@"decimalSeparator"] = userSettingsLocale.decimalSeparator ?: [NSNull null];
    entry[@"digitGroupingSeparator"] = userSettingsLocale.groupingSeparator ?: [NSNull null];
    entry[@"measurementSystem"] =
        [LocalizationModule measurementSystemForLocale:userSettingsLocale];
    entry[@"currencyCode"] = userSettingsLocale.currencyCode ?: [NSNull null];
    entry[@"currencySymbol"] = userSettingsLocale.currencySymbol ?: [NSNull null];
    entry[@"languageCurrencyCode"] = languageLocale.currencyCode ?: [NSNull null];
    entry[@"languageCurrencySymbol"] = languageLocale.currencySymbol ?: [NSNull null];
    entry[@"temperatureUnit"] = [LocalizationModule temperatureUnit] ?: [NSNull null];
    [result addObject:entry];
  }
  return result;
}

- (id)getCalendars {
  NSCalendar *calendar = NSCalendar.currentCalendar;
  return @[ @{
    @"calendar" : [LocalizationModule unicodeCalendarIdentifier:calendar],
    @"timeZone" : calendar.timeZone.name,
    @"uses24hourClock" : @([LocalizationModule uses24HourClock]),
    @"firstWeekday" : @(calendar.firstWeekday),
  } ];
}



#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getCalendars" : NSStringFromSelector(@selector(getCalendars)),
    @"getLocales" : NSStringFromSelector(@selector(getLocales)),
  };
}
@end
