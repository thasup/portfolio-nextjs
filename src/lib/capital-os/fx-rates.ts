/**
 * CapitalOS - Foreign Exchange Rate Service
 * 
 * Provides currency conversion with smart caching:
 * - Fetches rates only when stale (after day change)
 * - Caches rates in user settings
 * - Supports multiple currencies
 * - Uses CurrencyFreaks API
 */

import "server-only";
import { prisma } from "@/lib/db/prisma";

const CURRENCY_FREAKS_API_KEY = process.env.CURRENCY_FREAKS_TOKEN ?? "";
const CURRENCY_FREAKS_BASE_URL = "https://api.currencyfreaks.com/v2.0";

/**
 * FX rate map: currency code → rate against base currency
 */
export interface FXRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

/**
 * FX rate cache entry stored in settings
 */
interface FXRateCache {
  rates: FXRates;
  updatedAt: Date;
}

/**
 * Error thrown when FX rate API is not configured or fails
 */
export class FXRateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FXRateError";
  }
}

/**
 * Check if FX rates are stale (older than current UTC date)
 */
function areRatesStale(lastUpdate: Date | null): boolean {
  if (!lastUpdate) return true;

  const now = new Date();
  const lastUpdateDate = new Date(lastUpdate);
  
  // Compare UTC dates (YYYY-MM-DD)
  const nowUTC = now.toISOString().split('T')[0];
  const lastUTC = lastUpdateDate.toISOString().split('T')[0];
  
  return nowUTC !== lastUTC;
}

/**
 * Fetch latest FX rates from CurrencyFreaks API
 * @param baseCurrency - Base currency code (default: USD)
 * @param symbols - Target currency codes to fetch (default: THB, USD, EUR, GBP, JPY)
 */
async function fetchFXRates(
  baseCurrency = "USD",
  symbols = ["THB", "USD", "EUR", "GBP", "JPY"]
): Promise<FXRates> {
  if (!CURRENCY_FREAKS_API_KEY) {
    throw new FXRateError("CurrencyFreaks API key not configured");
  }

  const symbolsParam = symbols.join(",");
  const url = `${CURRENCY_FREAKS_BASE_URL}/rates/latest?apikey=${CURRENCY_FREAKS_API_KEY}&base=${baseCurrency}&symbols=${symbolsParam}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
    });

    if (!response.ok) {
      throw new FXRateError(
        `CurrencyFreaks API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      base: data.base,
      date: data.date,
      rates: data.rates,
    };
  } catch (error) {
    if (error instanceof FXRateError) throw error;

    console.error("[CapitalOS] Failed to fetch FX rates:", error);
    throw new FXRateError(
      `Failed to fetch FX rates: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get FX rates for a user with smart caching
 * - Returns cached rates if fresh (same UTC day)
 * - Fetches new rates if stale
 * - Stores new rates in user settings
 * 
 * @param userId - User ID
 * @param forceRefresh - Force fetch even if cache is fresh
 */
export async function getFXRates(
  userId: string,
  forceRefresh = false
): Promise<FXRates> {
  // Get user settings to check cache
  const settings = await prisma.capitalSettings.findUnique({
    where: { userId },
    select: {
      fxRatesUpdatedAt: true,
      preferredCurrency: true,
    },
  });

  // Check if we need to refresh
  const needsRefresh = forceRefresh || areRatesStale(settings?.fxRatesUpdatedAt || null);

  if (needsRefresh) {
    console.log("[CapitalOS] FX rates stale or force refresh, fetching new rates...");

    // Fetch fresh rates
    const freshRates = await fetchFXRates();

    // Update settings with new fetch timestamp
    await prisma.capitalSettings.upsert({
      where: { userId },
      update: {
        fxRatesUpdatedAt: new Date(),
      },
      create: {
        userId,
        fxRatesUpdatedAt: new Date(),
      },
    });

    return freshRates;
  }

  // Rates are fresh, fetch from API with cache
  console.log("[CapitalOS] Using cached FX rates from same day");
  return await fetchFXRates();
}

/**
 * Convert amount from one currency to another
 * 
 * @param amount - Amount in source currency
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param userId - User ID for cache lookup
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  userId: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rates = await getFXRates(userId);

  // If converting from base currency
  if (rates.base === fromCurrency) {
    const rate = rates.rates[toCurrency];
    if (!rate) {
      throw new FXRateError(`No rate available for ${toCurrency}`);
    }
    return amount * rate;
  }

  // If converting to base currency
  if (rates.base === toCurrency) {
    const rate = rates.rates[fromCurrency];
    if (!rate) {
      throw new FXRateError(`No rate available for ${fromCurrency}`);
    }
    return amount / rate;
  }

  // Converting between two non-base currencies
  const fromRate = rates.rates[fromCurrency];
  const toRate = rates.rates[toCurrency];

  if (!fromRate || !toRate) {
    throw new FXRateError(
      `No rates available for ${fromCurrency} or ${toCurrency}`
    );
  }

  // Convert through base currency: amount -> base -> target
  return (amount / fromRate) * toRate;
}

/**
 * Get exchange rate between two currencies
 * 
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param userId - User ID for cache lookup
 * @returns Exchange rate (1 unit of fromCurrency = X units of toCurrency)
 */
export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  userId: string
): Promise<number> {
  return await convertCurrency(1, fromCurrency, toCurrency, userId);
}

/**
 * Supported currencies with display names
 */
export const SUPPORTED_CURRENCIES = {
  THB: { name: "Thai Baht", symbol: "฿" },
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" },
  JPY: { name: "Japanese Yen", symbol: "¥" },
} as const;

export type SupportedCurrency = keyof typeof SUPPORTED_CURRENCIES;

/**
 * Validate currency code is supported
 */
export function isSupportedCurrency(code: string): code is SupportedCurrency {
  return code in SUPPORTED_CURRENCIES;
}
