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

import { Button } from "@/components/ui/button";
import { getVariantImage } from "@/lib/variantImages";
import { trackInitiateCheckout } from "@/lib/meta-pixel";
import { useCartStore } from "@/stores/cartStore";


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
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const isSyncing = useCartStore((s) => s.isSyncing);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
    0
  );
  const currency = items[0]?.price.currencyCode ?? "USD";

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (!url) return;

    trackInitiateCheckout({
      content_ids: items.map((i) => i.variantId),
      content_name: items[0]?.product.node.title ?? "kazevo backpack",
      content_type: "product",
      currency: items[0]?.price.currencyCode ?? "USD",
      value: subtotal,
      num_items: totalItems,
    });

    window.open(url, "_blank");
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
          {totalItems === 0
            ? "Your cart is empty — pick a colorway to get started."
            : `${totalItems} item${totalItems !== 1 ? "s" : ""} ready to ship.`}
        </p>

        {items.length === 0 ? (
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
                        alt={`${item.product.node.title} — ${item.selectedOptions
                          .map((o) => o.value)
                          .join(", ")}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h2 className="font-display text-lg font-black leading-snug">
                        {item.product.node.title}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.selectedOptions.map((o) => o.value).join(" • ")}
                      </p>
                      <p className="mt-3 font-display text-xl font-black">
                        {item.price.currencyCode}{" "}
                        {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
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
                  <dd className="font-semibold">
                    {currency} {subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Shipping &amp; taxes</dt>
                  <dd className="text-muted-foreground">Calculated at payment</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                <span className="font-display text-lg font-black">Total</span>
                <span className="font-display text-2xl font-black">
                  {currency} {subtotal.toFixed(2)}
                </span>
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
                Payment is completed on Shopify&apos;s secure checkout.
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
