import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/meta-pixel";

export function MetaPixelTracker() {
  const router = useRouter();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastPathRef.current = window.location.pathname;

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
