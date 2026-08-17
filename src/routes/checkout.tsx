import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Lock,
  Minus,
  Mountain,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccessoryUpsell } from "@/components/AccessoryUpsell";
import { CrossSellOffer } from "@/components/CrossSellOffer";
import { supabase } from "@/integrations/supabase/client";
import { formatUsd, getVariantColorName, getVariantImage } from "@/lib/variantImages";
import {
  trackInitiateCheckout,
  newEventId,
  numericId,
  rememberCheckoutEventId,
  saveKnownUser,
  setAdvancedMatching,
} from "@/lib/meta-pixel";
import { syncEmailSubscriberToShopify } from "@/lib/shopify-customers.functions";
import { useCartStore } from "@/stores/cartStore";

const checkoutEmailSchema = z.string().trim().email().max(254);


export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — kazevo by solarah" },
      {
        name: "description",
        content:
          "Review your kazevo 190g ultralight backpack order and complete your purchase through secure Shopify checkout.",
      },
      { property: "og:title", content: "Checkout — kazevo by solarah" },
      {
        property: "og:description",
        content:
          "Review your kazevo ultralight backpack order and pay securely with Shopify.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const [hydrated, setHydrated] = useState(
    () => useCartStore.persist?.hasHydrated?.() ?? false
  );
  useEffect(() => {
    if (useCartStore.persist?.hasHydrated?.()) {
      setHydrated(true);
      return;
    }
    const unsub = useCartStore.persist?.onFinishHydration?.(() => setHydrated(true));
    return () => unsub?.();
  }, []);

  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);

  const [email, setEmail] = useState("");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("kazevo_email");
      if (saved) setEmail(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
    0
  );


  const captureEmail = async (value: string) => {
    const parsed = checkoutEmailSchema.safeParse(value);
    if (!parsed.success) return null;
    const clean = parsed.data.toLowerCase();

    try {
      window.localStorage.setItem("kazevo_email", clean);
    } catch {
      /* storage unavailable */
    }

    // Hashed advanced matching for Meta, same as the popup does.
    saveKnownUser({ em: clean });
    setAdvancedMatching({ em: clean });

    const { error: insertError } = await supabase.from("email_subscribers").insert({
      email: clean,
      source: "checkout_page",
    });
    // 23505 = already subscribed, which is fine.
    if (insertError && insertError.code !== "23505") {
      console.error("Checkout email capture failed:", insertError);
    }

    void syncEmailSubscriberToShopify({
      data: { email: clean, source: "kazevo-checkout" },
    }).catch(() => undefined);

    return clean;
  };

  const handleCheckout = async () => {
    const url = getCheckoutUrl();
    if (!url) return;

    // Capture the shopper's email before handing off, so we keep them even
    // if they never finish on Shopify's hosted checkout.
    const captured = await captureEmail(email);

    let checkoutUrl = url;
    if (captured) {
      try {
        const parsedUrl = new URL(url);
        parsedUrl.searchParams.set("checkout[email]", captured);
        checkoutUrl = parsedUrl.toString();
      } catch {
        /* keep original url */
      }
    }

    // One event ID for this checkout, remembered so the server-side
    // (Shopify CAPI) counterpart can be deduplicated against it.
    const eventId = newEventId();
    rememberCheckoutEventId(eventId);

    trackInitiateCheckout(
      {
        content_ids: items.map((i) => i.variantId),
        content_name: items[0]?.product.node.title ?? "kazevo backpack",
        content_type: "product",
        currency: "USD",
        value: subtotal,
        num_items: totalItems,
        contents: items.map((i) => ({
          id: numericId(i.variantId),
          quantity: i.quantity,
          item_price: parseFloat(i.price.amount),
        })),
      },
      eventId,
    );

    window.open(checkoutUrl, "_blank");
  };


  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mountain size={18} />
            </span>
            <span className="font-display text-xl font-black tracking-tight lowercase">
              kazevo by solarah
            </span>
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Secure checkout
          </span>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Keep shopping
        </Link>

        <h1 className="mt-6 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Your order
        </h1>
        <p className="mt-3 text-muted-foreground">
          {!hydrated
            ? "Loading your cart…"
            : totalItems === 0
            ? "Your cart is empty — pick a colorway to get started."
            : `${totalItems} item${totalItems !== 1 ? "s" : ""} ready to ship.`}
        </p>

        {!hydrated ? (
          <div className="mt-12 rounded-3xl border border-border bg-card px-6 py-20 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading your cart…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-border bg-card px-6 py-20 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Nothing here yet.</p>
            <Button asChild className="mt-6 rounded-full px-8" size="lg">
              <Link to="/">Shop the pack</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <ul className="space-y-6">
              {items.map((item) => {
                const image =
                  item.imageUrl ?? getVariantImage(item.selectedOptions);
                return (
                  <li
                    key={item.variantId}
                    className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 sm:flex-row"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted sm:h-40 sm:w-40 sm:shrink-0">
                      <img
                        src={image}
                        alt={getVariantColorName(item.selectedOptions)}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h2 className="font-display text-lg font-black leading-snug">
                        {getVariantColorName(item.selectedOptions)}
                      </h2>
                      <p className="mt-3 font-display text-xl font-black">
                        {formatUsd(parseFloat(item.price.amount) * item.quantity)} USD
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                        <div className="flex items-center gap-1 rounded-full border border-border p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-black tracking-tight">Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatUsd(subtotal)} USD</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-semibold text-primary">Free</dd>
                </div>
              </dl>
              <div className="mt-5">
                <CrossSellOffer handles={items.map((i) => i.product.node.handle)} />
                <div className="mt-4">
                  <AccessoryUpsell handles={items.map((i) => i.product.node.handle)} />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                <span className="font-display text-lg font-black">Total</span>
                <span className="font-display text-2xl font-black">
                  {formatUsd(subtotal)} USD
                </span>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="checkout-email"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Email for order updates
                </label>
                <Input
                  id="checkout-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-11 rounded-full px-4"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  We&apos;ll send your order updates here — plus the occasional kazevo
                  offer. You can unsubscribe anytime.
                </p>
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="mt-6 w-full rounded-full"
                disabled={isLoading || isSyncing}
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Pay securely
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Free shipping on every order. Payment is completed on Shopify&apos;s
                secure checkout.
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
