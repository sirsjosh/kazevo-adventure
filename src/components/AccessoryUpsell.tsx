import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, PackagePlus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAccessoryUpsells, type AccessoryUpsell as Accessory } from "@/lib/productContent";
import { fetchShopifyProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import {
  formatUsd,
  getColorLabel,
  getVariantColorValue,
  getVariantDotColor,
} from "@/lib/variantImages";
import { useCartStore } from "@/stores/cartStore";

interface AccessoryUpsellProps {
  /** Handles currently in play (cart items or the current product page) */
  handles: string[];
  /** "panel" = compact list for cart drawer / checkout aside, "section" = product-page block */
  layout?: "panel" | "section";
}

export function AccessoryUpsell({ handles, layout = "panel" }: AccessoryUpsellProps) {
  const accessories = useMemo(() => getAccessoryUpsells(handles), [handles.join("|")]);

  if (accessories.length === 0) return null;

  if (layout === "section") {
    return (
      <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
        <div className="rounded-[2.5rem] border border-border bg-card p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <PackagePlus className="h-3.5 w-3.5" />
            Complete the kit
          </span>
          <h2 className="mt-4 font-display text-2xl font-black leading-tight tracking-tight sm:text-3xl">
            Add the bits that go inside
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {accessories.length === 1
              ? "The one extra that actually belongs in this bag — ships in the same box, free worldwide."
              : "Hand-picked extras for this bag — they ship in the same box, free worldwide."}
          </p>
          <div className={`mt-6 grid gap-4 ${accessories.length === 1 ? "sm:max-w-sm" : accessories.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {accessories.map((a) => (
              <AccessoryCard key={a.id} accessory={a} layout="section" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <PackagePlus className="h-3.5 w-3.5" />
        Complete the kit
      </p>
      <div className="mt-3 space-y-3">
        {accessories.map((a) => (
          <AccessoryCard key={a.id} accessory={a} layout="panel" />
        ))}
      </div>
    </div>
  );
}

function AccessoryCard({
  accessory,
  layout,
}: {
  accessory: Accessory;
  layout: "panel" | "section";
}) {
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [picking, setPicking] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let cancelled = false;
    fetchShopifyProductByHandle(accessory.handle)
      .then((node) => {
        if (!cancelled) setProduct(node);
      })
      .catch((err) => console.error("Accessory fetch failed:", err));
    return () => {
      cancelled = true;
    };
  }, [accessory.handle]);

  const variants = useMemo(
    () => product?.variants.edges.map((e) => e.node) ?? [],
    [product],
  );
  const singleVariant = variants.length === 1;
  const selected =
    variants.find((v) => v.id === selectedVariantId) ??
    (singleVariant ? variants[0] : undefined);
  const display = selected ?? variants.find((v) => v.availableForSale) ?? variants[0];

  if (!product || !display) return null;

  const image = display.image?.url ?? product.images.edges[0]?.node.url;
  const selectedLabel = selected
    ? getColorLabel(getVariantColorValue(selected.selectedOptions) ?? selected.title)
    : null;

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
    } finally {
      setAdding(false);
    }
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
              size === "sm" ? "h-6 w-6" : "h-8 w-8",
              isSelected ? "border-foreground scale-110" : "border-border",
              v.availableForSale ? "hover:scale-110" : "opacity-40 cursor-not-allowed",
            ].join(" ")}
            style={{ backgroundColor: getVariantDotColor(colorValue) }}
          />
        );
      })}
    </div>
  );

  const price = formatUsd(parseFloat(display.price.amount));

  if (layout === "section") {
    return (
      <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-background">
        <div className="aspect-square overflow-hidden bg-muted">
          {image && (
            <img src={image} alt={accessory.name} loading="lazy" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="font-display text-base font-black leading-snug">{accessory.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{accessory.pitch}</p>
          {!singleVariant && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs text-muted-foreground">
                {selectedLabel ? `Colour: ${selectedLabel}` : "Choose a colour"}
              </p>
              {swatches("md")}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="font-display text-lg font-black">{price}</span>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={adding || !selected || !selected.availableForSale}
              className="rounded-full px-4"
            >
              {adding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : added ? (
                <>
                  <Check className="mr-1.5 h-4 w-4" />
                  Added
                </>
              ) : !selected ? (
                "Choose a colour"
              ) : (
                <>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-card">
        {image && (
          <img src={image} alt={accessory.name} loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{accessory.name}</p>
        <p className="line-clamp-1 text-xs text-muted-foreground">{accessory.pitch}</p>

        {picking && !singleVariant && (
          <div className="mt-2">
            <p className="mb-1.5 text-xs text-muted-foreground">
              {selectedLabel ? `Colour: ${selectedLabel}` : "Pick a colour"}
            </p>
            {swatches("sm")}
          </div>
        )}

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{price}</span>
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
                "Add"
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPicking(true)}
              className="h-8 rounded-full px-3 text-xs"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
