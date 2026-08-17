import { detectCountryFn } from "./market.functions";


export const COUNTRY_COOKIE = "kazevo_country";
export const DEFAULT_COUNTRY = "US";

export interface Market {
  code: string;
  label: string;
  currency: string;
  locale: string;
  flag: string;
}

/**
 * Only countries covered by an ACTIVE Shopify market may be listed here.
 * Shopify silently falls back to the US market for any other country, which
 * makes prices look broken. Verified active: US, CA, AU, SG.
 */
export const SUPPORTED_MARKETS: Market[] = [
  { code: "US", label: "United States", currency: "USD", locale: "en-US", flag: "🇺🇸" },
  { code: "CA", label: "Canada", currency: "CAD", locale: "en-CA", flag: "🇨🇦" },
  { code: "AU", label: "Australia", currency: "AUD", locale: "en-AU", flag: "🇦🇺" },
  { code: "SG", label: "Singapore", currency: "SGD", locale: "en-SG", flag: "🇸🇬" },
];

const MARKET_BY_CODE = new Map(SUPPORTED_MARKETS.map((m) => [m.code, m]));

export function getMarketByCode(code?: string | null): Market {
  return MARKET_BY_CODE.get(code?.toUpperCase() ?? "") ?? MARKET_BY_CODE.get(DEFAULT_COUNTRY)!;
}

export function isSupportedCountry(code?: string | null): boolean {
  return MARKET_BY_CODE.has(code?.toUpperCase() ?? "");
}

/**
 * Isomorphic country detection.
 * On the server it reads request headers/cookies; on the client it reads the
 * cookie/localStorage directly instead of issuing an RPC call, so a failed
 * network request can never blank out a route loader.
 */
export async function detectCountry(): Promise<string> {
  if (typeof window !== "undefined") return readClientCountry();
  try {
    return await detectCountryFn();
  } catch {
    return DEFAULT_COUNTRY;
  }
}


export function readClientCountry(): string {
  if (typeof window === "undefined") return DEFAULT_COUNTRY;
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COUNTRY_COOKIE}=`))
      ?.split("=")[1];
    if (cookie && MARKET_BY_CODE.has(cookie.toUpperCase())) {
      return cookie.toUpperCase();
    }
  } catch {
    /* cookies disabled */
  }
  return DEFAULT_COUNTRY;
}

export function writeClientCountry(code: string) {
  if (typeof window === "undefined") return;
  try {
    const upper = code.toUpperCase();
    document.cookie = `${COUNTRY_COOKIE}=${upper}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    window.localStorage.setItem(COUNTRY_COOKIE, upper);
  } catch {
    /* storage unavailable */
  }
}

export function getBrowserCountry(): string {
  if (typeof window === "undefined") return DEFAULT_COUNTRY;
  try {
    const saved = window.localStorage.getItem(COUNTRY_COOKIE);
    if (saved && MARKET_BY_CODE.has(saved.toUpperCase())) {
      return saved.toUpperCase();
    }
    const lang = navigator.language?.toLowerCase();
    if (lang) {
      const fromLang = parseAcceptLanguage(lang);
      if (fromLang) return fromLang;
    }
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_COUNTRY;
}
