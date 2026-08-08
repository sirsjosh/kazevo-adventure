import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  captureClickIds,
  initPixel,
  isTrackingEnabled,
  readKnownUser,
  trackPageView,
  type PixelUserData,
} from "@/lib/meta-pixel";

export function MetaPixelTracker() {
  const router = useRouter();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !isTrackingEnabled()) return;
    lastPathRef.current = window.location.pathname;

    // Persist fbclid / _fbp / _fbc so they can be forwarded to Shopify checkout.
    captureClickIds();

    // ─────────────────────────────────────────────────────────────
    // Advanced matching: pass whatever you know about the visitor.
    // Supported keys: em, ph, fn, ln, ct, st, zp, country, external_id.
    // Values are trimmed, normalised and SHA-256 hashed in the browser
    // before they are sent to Meta. A stable anonymous external_id is
    // added automatically.
    //
    //   const userData: PixelUserData = {
    //     em: user.email,
    //     ph: user.phone,
    //     fn: user.firstName,
    //     ...
    //   };
    // ─────────────────────────────────────────────────────────────
    const userData: PixelUserData = { ...readKnownUser() };

    void initPixel(userData).then(() => {
      trackPageView();
    });


    const unsubscribe = router.subscribe("onResolved", () => {
      const path = window.location.pathname;
      if (path !== lastPathRef.current) {
        lastPathRef.current = path;
        trackPageView();
      }
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}
