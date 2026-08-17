import { createServerFn } from "@tanstack/react-start";
import {
  getRequestHeader,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";

export const COUNTRY_COOKIE = "kazevo_country";
export const DEFAULT_COUNTRY = "US";

export interface Market {
  code: string;
  label: string;
  currency: string;
  locale: string;
  flag: string;
}

export const SUPPORTED_MARKETS: Market[] = [
  { code: "US", label: "United States", currency: "USD", locale: "en-US", flag: "🇺🇸" },
  { code: "CA", label: "Canada", currency: "CAD", locale: "en-CA", flag: "🇨🇦" },
  { code: "GB", label: "United Kingdom", currency: "GBP", locale: "en-GB", flag: "🇬🇧" },
  { code: "AU", label: "Australia", currency: "AUD", locale: "en-AU", flag: "🇦🇺" },
  { code: "DE", label: "Germany", currency: "EUR", locale: "de-DE", flag: "🇩🇪" },
  { code: "FR", label: "France", currency: "EUR", locale: "fr-FR", flag: "🇫🇷" },
  { code: "IT", label: "Italy", currency: "EUR", locale: "it-IT", flag: "🇮🇹" },
  { code: "ES", label: "Spain", currency: "EUR", locale: "es-ES", flag: "🇪🇸" },
  { code: "NL", label: "Netherlands", currency: "EUR", locale: "nl-NL", flag: "🇳🇱" },
  { code: "JP", label: "Japan", currency: "JPY", locale: "ja-JP", flag: "🇯🇵" },
  { code: "KR", label: "South Korea", currency: "KRW", locale: "ko-KR", flag: "🇰🇷" },
  { code: "SG", label: "Singapore", currency: "SGD", locale: "en-SG", flag: "🇸🇬" },
  { code: "HK", label: "Hong Kong", currency: "HKD", locale: "en-HK", flag: "🇭🇰" },
  { code: "AE", label: "United Arab Emirates", currency: "AED", locale: "en-AE", flag: "🇦🇪" },
  { code: "SA", label: "Saudi Arabia", currency: "SAR", locale: "ar-SA", flag: "🇸🇦" },
  { code: "BR", label: "Brazil", currency: "BRL", locale: "pt-BR", flag: "🇧🇷" },
  { code: "MX", label: "Mexico", currency: "MXN", locale: "es-MX", flag: "🇲🇽" },
  { code: "IN", label: "India", currency: "INR", locale: "en-IN", flag: "🇮🇳" },
];

const MARKET_BY_CODE = new Map(SUPPORTED_MARKETS.map((m) => [m.code, m]));

export function getMarketByCode(code?: string | null): Market {
  return MARKET_BY_CODE.get(code?.toUpperCase() ?? "") ?? MARKET_BY_CODE.get(DEFAULT_COUNTRY)!;
}

function parseAcceptLanguage(header?: string | null): string | null {
  if (!header) return null;
  const first = header.split(",")[0]?.trim();
  if (!first) return null;
  const lang = first.split(";")[0]?.trim().toLowerCase();
  if (!lang) return null;
  // Map common language prefixes to a default country.
  const map: Record<string, string> = {
    "en": "US",
    "en-gb": "GB",
    "en-ca": "CA",
    "en-au": "AU",
    "de": "DE",
    "fr": "FR",
    "it": "IT",
    "es": "ES",
    "nl": "NL",
    "ja": "JP",
    "ko": "KR",
    "pt": "BR",
    "pt-br": "BR",
    "ar": "AE",
    "hi": "IN",
  };
  return map[lang] ?? null;
}

function detectFromHeaders(): string {
  const cfCountry = getRequestHeader("cf-ipcountry") || getRequestHeader("cloudflare-ipcountry");
  if (cfCountry && cfCountry !== "XX" && MARKET_BY_CODE.has(cfCountry.toUpperCase())) {
    return cfCountry.toUpperCase();
  }
  const acceptLang = parseAcceptLanguage(getRequestHeader("accept-language"));
  if (acceptLang && MARKET_BY_CODE.has(acceptLang)) {
    return acceptLang;
  }
  return DEFAULT_COUNTRY;
}

export const detectCountry = createServerFn({ method: "GET" }).handler(async () => {
  const cookie = getCookie(COUNTRY_COOKIE);
  if (cookie && MARKET_BY_CODE.has(cookie.toUpperCase())) {
    return cookie.toUpperCase();
  }
  const detected = detectFromHeaders();
  setCookie(COUNTRY_COOKIE, detected, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
  });
  return detected;
});

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
