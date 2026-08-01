import { useEffect, useState } from "react";
import { Check, Copy, Gift, X } from "lucide-react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";

const DISCOUNT_CODE = "Kazevo10";
const STORAGE_KEY = "kazevo_discount_claimed";

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Please enter your email" })
  .email({ message: "That doesn't look like a valid email" })
  .max(254, { message: "Email is too long" });

export function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [copied, setCopied] = useState(false);
  const cartItems = useCartStore((s) => s.items);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY)) setStatus("done");
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setError(null);
    setStatus("saving");

    const { error: insertError } = await supabase.from("email_subscribers").insert({
      email: parsed.data.toLowerCase(),
      source: cartItems.length > 0 ? "discount_popup_with_cart" : "discount_popup",
      discount_code: DISCOUNT_CODE,
    });

    // Duplicate email is fine — they still get their code.
    if (insertError && insertError.code !== "23505") {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
      return;
    }

    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, "1");
    setStatus("done");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      {/* Floating hovering badge */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Get 10% off your order"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[var(--grape)] px-4 py-3 text-sm font-bold text-white shadow-[var(--shadow-pop)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sunset)] sm:px-5"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[var(--grape)] opacity-20" />
        <Gift className="h-4 w-4" aria-hidden="true" />
        10% OFF
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discount-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-background p-7 shadow-[var(--shadow-pop)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-x-0 top-0 h-2"
              style={{ background: "var(--gradient-dopamine)" }}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {status === "done" ? (
              <div className="pt-3 text-center">
                <h2 id="discount-title" className="font-display text-3xl font-extrabold text-foreground">
                  Here's your 10% off
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Paste this code at checkout to save on your kazevo pack.
                </p>
                <button
                  type="button"
                  onClick={copyCode}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--grape)] bg-[color-mix(in_oklab,var(--grape)_8%,transparent)] px-4 py-4 text-2xl font-extrabold tracking-widest text-[var(--grape)] transition-colors hover:bg-[color-mix(in_oklab,var(--grape)_14%,transparent)]"
                >
                  {DISCOUNT_CODE}
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
                <p className="mt-2 text-xs text-muted-foreground">
                  {copied ? "Copied to clipboard" : "Tap the code to copy it"}
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 w-full rounded-full bg-[var(--grape)] px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  Keep shopping
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="pt-3">
                <h2 id="discount-title" className="font-display text-3xl font-extrabold text-foreground">
                  Take 10% off
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Drop your email and we'll unlock your discount code instantly — plus early access to
                  new kazevo colorways.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  maxLength={254}
                  autoComplete="email"
                  aria-label="Email address"
                  className="mt-5 w-full rounded-full border border-input bg-background px-5 py-3 text-sm text-foreground outline-none focus:border-[var(--grape)]"
                />
                {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="mt-4 w-full rounded-full px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--gradient-dopamine)" }}
                >
                  {status === "saving" ? "Unlocking…" : "Get my code"}
                </button>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  No spam. Unsubscribe any time.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
