import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Gift, Loader2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCrossSellFor, type CrossSellPair } from "@/lib/productContent";
import { fetchShopifyProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import {
  formatUsd,
  getColorLabel,
  getVariantColorValue,
  getVariantDotColor,
} from "@/lib/variantImages";
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
  const [added, setAdded] = useState(false);
  const [picking, setPicking] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
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

  const variants = useMemo(
    () => product?.variants.edges.map((e) => e.node) ?? [],
    [product]
  );
  const singleVariant = variants.length === 1;

  const selected =
    variants.find((v) => v.id === selectedVariantId) ??
    (singleVariant ? variants[0] : undefined);

  // Display variant: chosen one, else first available (for price/image preview)
  const display = selected ?? variants.find((v) => v.availableForSale) ?? variants[0];

  if (!pair || dismissed || !product || !display) return null;

  const image = display.image?.url ?? product.images.edges[0]?.node.url;

  const handleAdd = async () => {
    if (!selected) return;
    setAdding(true);
    try {
      const img = selected.image?.url ?? image;
      await addItem({
        product: { node: product },
        variantId: selected.id,
        variantTitle: selected.title,
        price: selected.price,
        quantity: 1,
        selectedOptions: selected.selectedOptions,
        ...(img ? { imageUrl: img } : {}),
      });
      setAdded(true);
      if (layout === "panel") {
        setTimeout(() => {
          setDismissed(true);
          if (typeof window !== "undefined") sessionStorage.setItem(dismissKey, "1");
        }, 1200);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") sessionStorage.setItem(dismissKey, "1");
  };

  const swatches = (size: "sm" | "md") => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((v) => {
        const colorValue = getVariantColorValue(v.selectedOptions) ?? v.title;
        const isSelected = selected?.id === v.id;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => setSelectedVariantId(v.id)}
            disabled={!v.availableForSale}
            title={`${getColorLabel(colorValue)}${v.availableForSale ? "" : " — sold out"}`}
            aria-label={getColorLabel(colorValue)}
            aria-pressed={isSelected}
            className={[
              "rounded-full border-2 transition-all",
              size === "sm" ? "h-6 w-6" : "h-9 w-9",
              isSelected ? "border-foreground scale-110" : "border-border",
              v.availableForSale ? "hover:scale-110" : "opacity-40 cursor-not-allowed",
            ].join(" ")}
            style={{ backgroundColor: getVariantDotColor(colorValue) }}
          />
        );
      })}
    </div>
  );

  const selectedLabel = selected
    ? getColorLabel(getVariantColorValue(selected.selectedOptions) ?? selected.title)
    : null;

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
                {formatUsd(parseFloat(display.price.amount))} USD
              </p>

              {!singleVariant && (
                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium">
                    {selectedLabel ? `Colour: ${selectedLabel}` : "Choose a colour"}
                  </p>
                  {swatches("md")}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={handleAdd}
                  disabled={adding || !selected || !selected.availableForSale}
                  className="rounded-full px-6"
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : added ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added to cart
                    </>
                  ) : !selected ? (
                    "Choose a colour"
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

          {picking && !singleVariant && (
            <div className="mt-2">
              <p className="mb-1.5 text-xs text-muted-foreground">
                {selectedLabel ? `Colour: ${selectedLabel}` : "Pick a colour"}
              </p>
              {swatches("sm")}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold">
              {formatUsd(parseFloat(display.price.amount))} USD
            </span>
            {added ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5" />
                Added
              </span>
            ) : picking || singleVariant ? (
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={adding || !selected || !selected.availableForSale}
                className="h-8 rounded-full px-3 text-xs"
              >
                {adding ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : !selected ? (
                  "Pick a colour"
                ) : (
                  <>
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setPicking(true)}
                className="h-8 rounded-full px-3 text-xs"
              >
                {pair.cta}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
