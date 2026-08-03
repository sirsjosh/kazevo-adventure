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

/**
 * Advanced matching — re-inits the pixel with hashed-on-Meta's-side user data.
 * This is what raises the "event match quality" score in Ads Manager.
 */
export function setAdvancedMatching(data: { em?: string; fn?: string; ln?: string }) {
  if (typeof window === "undefined" || !window.fbq) return;
  const payload: Record<string, unknown> = {};
  if (data.em) payload["em"] = data.em.trim().toLowerCase();
  if (data.fn) payload["fn"] = data.fn.trim().toLowerCase();
  if (data.ln) payload["ln"] = data.ln.trim().toLowerCase();

  if (Object.keys(payload).length === 0) return;
  window.fbq("init", PIXEL_ID, payload);
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
