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
