import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  initPixel,
  readKnownUser,
  trackPageView,
  type PixelUserData,
} from "@/lib/meta-pixel";

export function MetaPixelTracker() {
  const router = useRouter();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastPathRef.current = window.location.pathname;

    // ─────────────────────────────────────────────────────────────
    // Advanced matching: pass whatever you know about the visitor.
    // Supported keys: em, ph, fn, ln, ct, st, zp, country.
    // Values are trimmed, normalised and SHA-256 hashed in the browser
    // before they are sent to Meta.
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
