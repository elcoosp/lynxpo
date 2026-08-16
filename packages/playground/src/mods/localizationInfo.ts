import { useEffect, useState } from '@lynx-js/react';
import { getGetCalendars, getGetLocales } from '@lynxpo/mods-localization';

export interface LocalizationInfo {
  primaryLocale: {
    languageTag?: string;
    languageCode?: string;
    regionCode?: string;
    textDirection?: string;
    currencyCode?: string;
    currencySymbol?: string;
    measurementSystem?: string;
    temperatureUnit?: string;
    decimalSeparator?: string;
  } | null;
  timeZone?: string;
  uses24hourClock?: boolean;
  localeCount: number;
}

/**
 * Fetches localization fields in a single synchronous pass over the native
 * bridge. Returns a typed snapshot plus explicit loading/error state. Faithful
 * port of Expo's `expo-localization` (latest) native surface.
 */
export function useLocalizationInfo(): {
  info: LocalizationInfo | null;
  loading: boolean;
  error: Error | null;
} {
  const [info, setInfo] = useState<LocalizationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const locales = getGetLocales() || [];
      const calendars = getGetCalendars() || [];
      const primary =
        (locales[0] as Record<string, unknown> | undefined) ?? null;
      const calendar =
        (calendars[0] as Record<string, unknown> | undefined) ?? null;
      setInfo({
        primaryLocale: primary
          ? {
              languageTag: primary.languageTag as string | undefined,
              languageCode: primary.languageCode as string | undefined,
              regionCode: primary.regionCode as string | undefined,
              textDirection: primary.textDirection as string | undefined,
              currencyCode: primary.currencyCode as string | undefined,
              currencySymbol: primary.currencySymbol as string | undefined,
              measurementSystem: primary.measurementSystem as
                | string
                | undefined,
              temperatureUnit: primary.temperatureUnit as string | undefined,
              decimalSeparator: primary.decimalSeparator as string | undefined,
            }
          : null,
        timeZone: calendar?.timeZone as string | undefined,
        uses24hourClock: calendar?.uses24hourClock as boolean | undefined,
        localeCount: locales.length,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { info, loading, error };
}
