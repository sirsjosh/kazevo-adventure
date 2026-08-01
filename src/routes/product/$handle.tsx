import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Loader2, ShoppingBag, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchShopifyProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/product/$handle")({
  head: ({ match }) => ({
    meta: [
      { title: `${match.params.handle} — kazevo by solarah` },
      {
        name: "description",
        content: "Shop the kazevo ultralight backpack collection.",
      },
      { property: "og:title", content: `${match.params.handle} — kazevo by solarah` },
      {
        property: "og:description",
        content: "Shop the kazevo ultralight backpack collection.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ params }) => {
    const product = await fetchShopifyProductByHandle(params.handle);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: ShopifyProduct["node"] };
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const variants = product.variants.edges.map((edge) => edge.node);
  const options = product.options;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const option of options) {
      initial[option.name] = option.values[0] ?? "";
    }
    return initial;
  });

  const selectedVariant = useMemo(() => {
    return variants.find((variant) =>
      variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value
      )
    );
  }, [variants, selectedOptions]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const mainImage = product.images.edges[0]?.node;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="/" className="flex min-w-0 items-center gap-2">
            <span className="font-display text-xl font-black tracking-tight lowercase">
              kazevo by solarah
            </span>
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </a>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-3xl bg-muted">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.altText ?? product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6">
              <span className="font-display text-3xl font-black">
                {selectedVariant
                  ? `${selectedVariant.price.currencyCode} ${parseFloat(selectedVariant.price.amount).toFixed(2)}`
                  : `${product.priceRange.minVariantPrice.currencyCode} ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`}
              </span>
            </div>

            <div className="mt-8 space-y-6">
              {options.map((option) => (
                <div key={option.name}>
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {option.name}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isActive = selectedOptions[option.name] === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:bg-muted"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || !selectedVariant?.availableForSale}
                size="lg"
                className="rounded-full px-8"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              {!selectedVariant?.availableForSale && (
                <span className="text-sm font-medium text-muted-foreground">
                  Out of stock
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
