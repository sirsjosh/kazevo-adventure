declare global {
  interface Window {
    fbq?: (
      event: "track" | "trackCustom" | "init" | "config",
      name: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string },
    ) => void;
  }
}

const PIXEL_ID = "1382896033791262";

/** Hosts allowed to report into the Meta dataset. Previews stay out of it. */
const TRACKING_HOSTS = ["kazevo.store", "www.kazevo.store"];

export function getPixelId(): string {
  return PIXEL_ID;
}

/** True only on the production storefront — keeps preview domains out of the dataset. */
export function isTrackingEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return TRACKING_HOSTS.includes(window.location.hostname);
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
  external_id?: string;
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
    case "external_id":
      return raw.trim();
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

/* ------------------------------------------------------------------ */
/* Identity: stable anonymous external_id                              */
/* ------------------------------------------------------------------ */

const EXTERNAL_ID_KEY = "kazevo_external_id";

export function getExternalId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const existing = window.localStorage.getItem(EXTERNAL_ID_KEY);
    if (existing) return existing;
    const id =
      window.crypto?.randomUUID?.() ??
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(EXTERNAL_ID_KEY, id);
    return id;
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Click IDs — captured on landing, forwarded to Shopify checkout      */
/* ------------------------------------------------------------------ */

const CLICK_IDS_KEY = "kazevo_click_ids";

export type ClickIds = { fbclid?: string; fbp?: string; fbc?: string };

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : undefined;
}

/** Reads fbclid from the URL and the _fbp/_fbc cookies, persisting what it finds. */
export function captureClickIds(): ClickIds {
  if (typeof window === "undefined") return {};
  const next: ClickIds = { ...readClickIds() };
  const fromUrl = new URLSearchParams(window.location.search).get("fbclid");
  const fbp = readCookie("_fbp");
  const fbc = readCookie("_fbc");
  if (fromUrl) next.fbclid = fromUrl;
  if (fbp) next.fbp = fbp;
  if (fbc) next.fbc = fbc;
  try {
    window.localStorage.setItem(CLICK_IDS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  return next;
}

export function readClickIds(): ClickIds {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CLICK_IDS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ClickIds;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/* ------------------------------------------------------------------ */
/* Event IDs — required for pixel ↔ CAPI deduplication                 */
/* ------------------------------------------------------------------ */

export function newEventId(): string {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

const CHECKOUT_EVENT_ID_KEY = "kazevo_checkout_event_id";

export function rememberCheckoutEventId(eventId: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CHECKOUT_EVENT_ID_KEY, eventId);
  } catch {
    /* storage unavailable */
  }
}

export function readCheckoutEventId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    return window.sessionStorage.getItem(CHECKOUT_EVENT_ID_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Content IDs                                                         */
/* ------------------------------------------------------------------ */

/** Shopify CAPI reports numeric IDs — strip the gid:// prefix so both sides match. */
export function numericId(gid: string): string {
  const parts = gid.split("/");
  return parts[parts.length - 1] ?? gid;
}

export type ContentLine = { id: string; quantity: number; item_price: number };

/* ------------------------------------------------------------------ */
/* Init + tracking                                                     */
/* ------------------------------------------------------------------ */

/**
 * Initialise the pixel with optional advanced matching. All identity values are
 * SHA-256 hashed client-side before they are handed to Meta.
 */
export async function initPixel(userData?: PixelUserData) {
  if (!isTrackingEnabled() || !window.fbq) return;
  const merged: PixelUserData = {
    ...readKnownUser(),
    ...userData,
    external_id: userData?.external_id ?? getExternalId(),
  };
  const hashed = await hashUserData(merged);
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
  eventId?: string,
) {
  if (!isTrackingEnabled() || !window.fbq) return;
  window.fbq("track", event, params, { eventID: eventId ?? newEventId() });
}

export function trackCustom(event: string, params?: Record<string, unknown>) {
  if (!isTrackingEnabled() || !window.fbq) return;
  window.fbq("trackCustom", event, params, { eventID: newEventId() });
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
  contents?: ContentLine[];
}) {
  trackEvent("AddToCart", {
    ...params,
    content_ids: params.content_ids.map(numericId),
    contents:
      params.contents ??
      params.content_ids.map((id) => ({
        id: numericId(id),
        quantity: params.quantity ?? 1,
        item_price: params.value / (params.quantity ?? 1),
      })),
    num_items: params.quantity ?? 1,
  });
}

export function trackInitiateCheckout(
  params: {
    content_ids: string[];
    content_name: string;
    content_type: "product";
    currency: string;
    value: number;
    num_items: number;
    contents?: ContentLine[];
  },
  eventId?: string,
) {
  trackEvent(
    "InitiateCheckout",
    {
      ...params,
      content_ids: params.content_ids.map(numericId),
      contents: params.contents,
    },
    eventId,
  );
}

export function trackViewContent(params: {
  content_ids: string[];
  content_name: string;
  content_type: "product";
  currency: string;
  value: number;
  contents?: ContentLine[];
}) {
  trackEvent("ViewContent", {
    ...params,
    content_ids: params.content_ids.map(numericId),
    contents:
      params.contents ??
      params.content_ids.map((id) => ({
        id: numericId(id),
        quantity: 1,
        item_price: params.value,
      })),
  });
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
