import { getRequestHeader, getCookie, setCookie } from "@tanstack/react-start/server";
import { COUNTRY_COOKIE, DEFAULT_COUNTRY, isSupportedCountry } from "./market";

function parseAcceptLanguage(header?: string | null): string | null {
  if (!header) return null;
  const first = header.split(",")[0]?.trim();
  if (!first) return null;
  const lang = first.split(";")[0]?.trim().toLowerCase();
  if (!lang) return null;
  const map: Record<string, string> = {
    en: "US",
    "en-gb": "GB",
    "en-ca": "CA",
    "en-au": "AU",
    de: "DE",
    fr: "FR",
    it: "IT",
    es: "ES",
    nl: "NL",
    ja: "JP",
    ko: "KR",
    pt: "BR",
    "pt-br": "BR",
    ar: "AE",
    hi: "IN",
  };
  return map[lang] ?? null;
}

export function detectCountryFromRequest(): string {
  try {
    const cookie = getCookie(COUNTRY_COOKIE);
    if (cookie && isSupportedCountry(cookie)) return cookie.toUpperCase();

    const cfCountry =
      getRequestHeader("cf-ipcountry") || getRequestHeader("cloudflare-ipcountry");
    let detected = DEFAULT_COUNTRY;
    if (cfCountry && cfCountry !== "XX" && isSupportedCountry(cfCountry)) {
      detected = cfCountry.toUpperCase();
    } else {
      const fromLang = parseAcceptLanguage(getRequestHeader("accept-language"));
      if (fromLang && isSupportedCountry(fromLang)) detected = fromLang;
    }

    setCookie(COUNTRY_COOKIE, detected, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: process.env["NODE_ENV"] === "production",
    });
    return detected;
  } catch {
    return DEFAULT_COUNTRY;
  }
}
