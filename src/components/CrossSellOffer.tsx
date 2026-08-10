import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Gift, Loader2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCrossSellFor, type CrossSellPair } from "@/lib/productContent";
import { fetchShopifyProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { formatUsd } from "@/lib/variantImages";
import { useCartStore } from "@/stores/cartStore";

interface CrossSellOfferProps {
  /** Handles currently in play (cart items or the current product page) */
  handles: string[];
  /** "panel" = compact card for cart drawer / checkout aside, "section" = full product-page block */
  layout?: "panel" | "section";
}

export function CrossSellOffer({ handles, layout = "panel" }: CrossSellOfferProps) {
  const pair: CrossSellPair | null = getCrossSellFor(handles);
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const dismissKey = pair ? `kazevo-crosssell-dismissed:${pair.partnerHandle}` : "";

  useEffect(() => {
    if (!pair) return;
    if (typeof window !== "undefined" && sessionStorage.getItem(dismissKey) === "1") {
      setDismissed(true);
      return;
    }
    let cancelled = false;
    fetchShopifyProductByHandle(pair.partnerHandle)
      .then((node) => {
        if (!cancelled) setProduct(node);
      })
      .catch((err) => console.error("Cross-sell product fetch failed:", err));
    return () => {
      cancelled = true;
    };
  }, [pair?.partnerHandle, dismissKey]);

  if (!pair || dismissed || !product) return null;

  const variant =
    product.variants.edges.map((e) => e.node).find((v) => v.availableForSale) ??
    product.variants.edges[0]?.node;
  if (!variant) return null;

  const image = variant.image?.url ?? product.images.edges[0]?.node.url;

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addItem({
        product: { node: product },
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions,
        ...(image ? { imageUrl: image } : {}),
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") sessionStorage.setItem(dismissKey, "1");
  };

  if (layout === "section") {
    return (
      <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <div className="overflow-hidden rounded-[2.5rem] border border-sunset/30 bg-sunset/5">
          <div className="grid gap-6 p-6 sm:grid-cols-[220px_1fr] sm:items-center sm:p-8">
            <Link
              to={pair.partnerPath}
              className="block aspect-square overflow-hidden rounded-3xl bg-card"
            >
              {image && (
                <img
                  src={image}
                  alt={pair.partnerName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              )}
            </Link>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sunset/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sunset-deep">
                <Gift className="h-3.5 w-3.5" />
                Perfect pair
              </span>
              <h2 className="mt-4 font-display text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                {pair.headline}
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">{pair.body}</p>
              <p className="mt-4 font-display text-xl font-black">
                {formatUsd(parseFloat(variant.price.amount))} USD
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={handleAdd}
                  disabled={adding || !variant.availableForSale}
                  className="rounded-full px-6"
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {pair.cta}
                    </>
                  )}
                </Button>
                <Button asChild variant="outline" className="rounded-full px-6">
                  <Link to={pair.partnerPath}>View product</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="relative rounded-2xl border border-sunset/30 bg-sunset/5 p-4">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss offer"
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex gap-3">
        <Link
          to={pair.partnerPath}
          className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-card"
        >
          {image && (
            <img
              src={image}
              alt={pair.partnerName}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </Link>
        <div className="min-w-0 flex-1 pr-4">
          <p className="font-display text-sm font-black leading-snug">{pair.headline}</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{pair.body}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">
              {formatUsd(parseFloat(variant.price.amount))} USD
            </span>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={adding || !variant.availableForSale}
              className="h-8 rounded-full px-3 text-xs"
            >
              {adding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  {pair.cta}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
