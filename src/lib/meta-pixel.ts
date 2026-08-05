declare global {
  interface Window {
    fbq?: (
      event: "track" | "trackCustom" | "init" | "config",
      name: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

const PIXEL_ID = "1382896033791262";

export function getPixelId(): string {
  return PIXEL_ID;
}

/** Standard Meta advanced-matching keys. */
export type PixelUserData = {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  zp?: string;
  country?: string;
};

/** SHA-256 → lowercase hex, in the browser. Returns null when unavailable. */
export async function sha256Hex(value: string): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const subtle = window.crypto?.subtle;
  if (!subtle) return null;
  try {
    const bytes = new TextEncoder().encode(value);
    const digest = await subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

/** Meta's normalisation rules, applied before hashing. */
function normalize(key: keyof PixelUserData, raw: string): string {
  const value = raw.trim().toLowerCase();
  switch (key) {
    case "ph":
      return value.replace(/\D/g, "");
    case "zp":
      return value.replace(/\s/g, "");
    case "ct":
    case "st":
      return value.replace(/[^a-z]/g, "");
    case "country":
      return value.replace(/[^a-z]/g, "").slice(0, 2);
    default:
      return value;
  }
}

export async function hashUserData(userData: PixelUserData): Promise<Record<string, string>> {
  const hashed: Record<string, string> = {};
  for (const [key, raw] of Object.entries(userData) as [keyof PixelUserData, string | undefined][]) {
    if (!raw) continue;
    const normalized = normalize(key, raw);
    if (!normalized) continue;
    const digest = await sha256Hex(normalized);
    if (digest) hashed[key] = digest;
  }
  return hashed;
}

/**
 * Initialise the pixel with optional advanced matching. All identity values are
 * SHA-256 hashed client-side before they are handed to Meta.
 */
export async function initPixel(userData?: PixelUserData) {
  if (typeof window === "undefined" || !window.fbq) return;
  const hashed = userData ? await hashUserData(userData) : {};
  if (Object.keys(hashed).length > 0) {
    window.fbq("init", PIXEL_ID, hashed);
  } else {
    window.fbq("init", PIXEL_ID);
  }
}

/**
 * Re-init the pixel with hashed user data (advanced matching).
 * This is what raises the "event match quality" score in Ads Manager.
 */
export function setAdvancedMatching(data: PixelUserData) {
  void initPixel(data);
}

export function trackEvent(
  event: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params);
}

export function trackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("trackCustom", event, params);
}

export function trackPageView() {
  trackEvent("PageView");
}

export function trackAddToCart(params: {
  content_ids: string[];
  content_name: string;
  content_type: "product";
  currency: string;
  value: number;
  quantity?: number;
}) {
  trackEvent("AddToCart", params);
}

export function trackInitiateCheckout(params: {
  content_ids: string[];
  content_name: string;
  content_type: "product";
  currency: string;
  value: number;
  num_items: number;
}) {
  trackEvent("InitiateCheckout", params);
}

export function trackViewContent(params: {
  content_ids: string[];
  content_name: string;
  content_type: "product";
  currency: string;
  value: number;
}) {
  trackEvent("ViewContent", params);
}

export function trackLead(params?: { content_name?: string; value?: number; currency?: string }) {
  trackEvent("Lead", params);
}

/** localStorage key holding known-visitor identity for advanced matching. */
export const PIXEL_USER_STORAGE_KEY = "kazevo_pixel_user";

export function saveKnownUser(data: PixelUserData) {
  if (typeof window === "undefined") return;
  try {
    const existing = readKnownUser();
    window.localStorage.setItem(
      PIXEL_USER_STORAGE_KEY,
      JSON.stringify({ ...existing, ...data }),
    );
  } catch {
    /* storage unavailable */
  }
}

export function readKnownUser(): PixelUserData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PIXEL_USER_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PixelUserData;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}
