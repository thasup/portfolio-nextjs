/**
 * CapitalOS - Formatting Utilities
 * 
 * Provides locale-aware formatting for:
 * - Numbers and currency
 * - Dates
 * - Percentages
 * 
 * Uses user preferences from settings.
 */

import { fromSatangs, type Satangs } from "./schemas";
import type { SUPPORTED_CURRENCIES, SupportedCurrency } from "./fx-rates";

/**
 * User formatting preferences
 */
export interface FormatterPreferences {
  numberFormat: string; // BCP 47 locale (e.g., "en-US", "th-TH")
  dateFormat: string; // Format string (e.g., "YYYY-MM-DD", "DD/MM/YYYY")
  preferredCurrency: SupportedCurrency;
  theme: "dark" | "light";
}

/**
 * Default formatter preferences
 */
export const DEFAULT_PREFERENCES: FormatterPreferences = {
  numberFormat: "en-US",
  dateFormat: "DD/MM/YYYY",
  preferredCurrency: "THB",
  theme: "dark",
};

/**
 * Format a number according to locale preferences
 * 
 * @param value - Number to format
 * @param locale - BCP 47 locale code (e.g., "en-US", "th-TH")
 * @param options - Intl.NumberFormat options
 */
export function formatNumber(
  value: number,
  locale = "en-US",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format currency amount
 * 
 * @param satangs - Amount in satangs (or other cent-based currency)
 * @param currency - Currency code
 * @param locale - BCP 47 locale code
 */
export function formatCurrency(
  satangs: Satangs | number,
  currency: SupportedCurrency = "THB",
  locale = "en-US"
): string {
  const amount = typeof satangs === "bigint" ? fromSatangs(satangs) : satangs / 100;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format currency amount in compact form (K, M, B notation)
 * 
 * @param satangs - Amount in satangs
 * @param currency - Currency code
 * @param locale - BCP 47 locale code
 */
export function formatCompactCurrency(
  satangs: Satangs | number,
  currency: SupportedCurrency = "THB",
  locale = "en-US"
): string {
  const amount = typeof satangs === "bigint" ? fromSatangs(satangs) : satangs / 100;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Format percentage
 * 
 * @param value - Percentage value (0.15 = 15%)
 * @param locale - BCP 47 locale code
 * @param decimals - Number of decimal places
 */
export function formatPercentage(
  value: number,
  locale = "en-US",
  decimals = 2
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Date format templates
 */
export const DATE_FORMATS = {
  "YYYY-MM-DD": { pattern: /(\d{4})-(\d{2})-(\d{2})/, order: [0, 1, 2] },
  "DD/MM/YYYY": { pattern: /(\d{2})\/(\d{2})\/(\d{4})/, order: [2, 1, 0] },
  "MM/DD/YYYY": { pattern: /(\d{2})\/(\d{2})\/(\d{4})/, order: [2, 0, 1] },
  "DD.MM.YYYY": { pattern: /(\d{2})\.(\d{2})\.(\d{4})/, order: [2, 1, 0] },
} as const;

export type DateFormatString = keyof typeof DATE_FORMATS;

/**
 * Format date according to user preference
 * 
 * @param date - Date to format
 * @param format - Date format string
 */
export function formatDate(
  date: Date | string,
  format: DateFormatString = "YYYY-MM-DD"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "DD.MM.YYYY":
      return `${day}.${month}.${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Format date with locale-aware formatting
 * 
 * @param date - Date to format
 * @param locale - BCP 47 locale code
 * @param options - Intl.DateTimeFormat options
 */
export function formatDateLocale(
  date: Date | string,
  locale = "en-US",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options,
  }).format(d);
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 months")
 * 
 * @param date - Date to format
 * @param locale - BCP 47 locale code
 */
export function formatRelativeTime(
  date: Date | string,
  locale = "en-US"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffDays) < 1) {
    return rtf.format(Math.round(diffMs / (1000 * 60 * 60)), "hour");
  } else if (Math.abs(diffDays) < 7) {
    return rtf.format(diffDays, "day");
  } else if (Math.abs(diffDays) < 30) {
    return rtf.format(Math.round(diffDays / 7), "week");
  } else if (Math.abs(diffDays) < 365) {
    return rtf.format(Math.round(diffDays / 30), "month");
  } else {
    return rtf.format(Math.round(diffDays / 365), "year");
  }
}

/**
 * Parse date from formatted string
 * 
 * @param dateStr - Formatted date string
 * @param format - Expected format
 * @returns Date object or null if invalid
 */
export function parseDate(
  dateStr: string,
  format: DateFormatString = "YYYY-MM-DD"
): Date | null {
  const formatConfig = DATE_FORMATS[format];
  const match = dateStr.match(formatConfig.pattern);

  if (!match) return null;

  const [, ...parts] = match;
  const [year, month, day] = formatConfig.order.map((i) => parseInt(parts[i], 10));

  const date = new Date(year, month - 1, day);
  
  // Validate the date
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Format number with sign prefix (+/-)
 * 
 * @param value - Number to format
 * @param locale - BCP 47 locale code
 */
export function formatNumberWithSign(
  value: number,
  locale = "en-US"
): string {
  const formatted = formatNumber(Math.abs(value), locale);
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

/**
 * Format large numbers in abbreviated form
 * 
 * @param value - Number to format
 * @param locale - BCP 47 locale code
 */
export function formatCompactNumber(
  value: number,
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Get locale-specific decimal and thousands separators
 * 
 * @param locale - BCP 47 locale code
 */
export function getNumberFormatSeparators(locale = "en-US"): {
  decimal: string;
  thousands: string;
} {
  const formatted = new Intl.NumberFormat(locale).format(1234.5);
  
  // Extract separators from formatted number
  const decimal = formatted.match(/[.,]/)?.[0] || ".";
  const thousands = formatted.includes(",") ? "," : formatted.includes(".") ? "." : "";

  return { decimal, thousands };
}

/**
 * Supported locales for number formatting
 */
export const SUPPORTED_LOCALES = {
  "en-US": { name: "English (US)", sample: "1,234.56" },
  "th-TH": { name: "Thai (Thailand)", sample: "1,234.56" },
  "en-GB": { name: "English (UK)", sample: "1,234.56" },
  "de-DE": { name: "German (Germany)", sample: "1.234,56" },
  "fr-FR": { name: "French (France)", sample: "1 234,56" },
  "ja-JP": { name: "Japanese (Japan)", sample: "1,234.56" },
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

/**
 * Validate if locale is supported
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale in SUPPORTED_LOCALES;
}
