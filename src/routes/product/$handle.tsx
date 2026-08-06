import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Loader2, ShoppingBag, ArrowLeft, Mountain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";
import { ProductReviews } from "@/components/ProductReviews";
import { getProductReviews } from "@/lib/judgeme.functions";
import type { ProductReviewsData } from "@/lib/judgeme.server";
import { fetchShopifyProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { formatUsd, getVariantImage } from "@/lib/variantImages";
import { useCartStore } from "@/stores/cartStore";

const SITE_URL = "https://kazevo-adventure-launch.lovable.app";

export const Route = createFileRoute("/product/$handle")({
  head: ({ match, loaderData }) => {
    const product = (loaderData as { product: ShopifyProduct["node"] } | undefined)?.product;
    const reviews = (loaderData as { reviews?: ProductReviewsData } | undefined)?.reviews;
    const title = product ? `${product.title} — kazevo by solarah` : "Product — kazevo by solarah";
    const raw = (product?.description ?? "").replace(/\s+/g, " ").trim();
    const description =
      raw.length >= 50
        ? raw.slice(0, 158)
        : `${raw ? `${raw} ` : ""}kazevo by solarah: 190g ultralight, weather-resistant nylon backpacks with ergonomic arc straps and 18L capacity.`.slice(
            0,
            158,
          );
    const url = `${SITE_URL}/product/${match.params.handle}`;
    const image = product?.images.edges[0]?.node.url;

    const productLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product?.title,
      description: raw || description,
      image: product?.images.edges.map((e) => e.node.url),
      brand: { "@type": "Brand", name: "kazevo by solarah" },
      url,
      offers: {
        "@type": "Offer",
        price: product?.priceRange.minVariantPrice.amount,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url,
      },
    };

    if (reviews && reviews.reviewCount > 0) {
      productLd["aggregateRating"] = {
        "@type": "AggregateRating",
        ratingValue: String(reviews.averageRating),
        reviewCount: String(reviews.reviewCount),
      };
    }

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: product
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(productLd),
            },
          ]
        : [],
    };
  },
  loader: async ({ params }) => {
    const product = await fetchShopifyProductByHandle(params.handle);
    if (!product) throw notFound();
    const reviews = await getProductReviews({ data: { handle: params.handle } });
    return { product, reviews };
  },
  component: ProductDetail,
});


function ProductDetail() {
  const { product, reviews } = Route.useLoaderData() as {
    product: ShopifyProduct["node"];
    reviews: ProductReviewsData;
  };
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
      imageUrl: getVariantImage(selectedVariant.selectedOptions),
    });
  };

  const mainImage = product.images.edges[0]?.node;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mountain size={18} />
            </span>
            <span className="font-display text-xl font-black tracking-tight lowercase">
              kazevo by solarah
            </span>
          </a>
          <CartButton />
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
                  ? `${formatUsd(parseFloat(selectedVariant.price.amount))} USD`
                  : `${formatUsd(parseFloat(product.priceRange.minVariantPrice.amount))} USD`}
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

        <ProductReviews
          reviews={reviews.reviews}
          averageRating={reviews.averageRating}
          reviewCount={reviews.reviewCount}
        />
      </main>
    </div>
  );
}
