import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Feather,
  Layers,
  Loader2,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";
import { ProductReviews } from "@/components/ProductReviews";
import type { ProductReviewsData } from "@/lib/judgeme.server";
import type { ProductPageContent } from "@/lib/productContent";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { formatUsd, getColorLabel, getVariantColorValue, getVariantDotColor } from "@/lib/variantImages";
import { trackViewContent } from "@/lib/meta-pixel";
import { useCartStore } from "@/stores/cartStore";
import logo from "@/assets/kazevo-logo.png.asset.json";

const benefitIcons = [Feather, ShieldCheck, Layers, Palette, Sparkles, Truck];
const benefitTones = [
  "bg-grape/10 text-grape",
  "bg-sunset/15 text-sunset",
  "bg-mint/25 text-accent-foreground",
];

interface ProductPageTemplateProps {
  content: ProductPageContent;
  products: ShopifyProduct[];
  reviews: ProductReviewsData;
}

export function ProductPageTemplate({
  content,
  products: loaderProducts,
  reviews,
}: ProductPageTemplateProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(loaderProducts);

  useEffect(() => {
    let cancelled = false;
    fetchShopifyProducts("*", 50)
      .then((fresh) => {
        if (!cancelled && fresh.length > 0) setProducts(fresh);
      })
      .catch((err) => console.error("Shopify products refresh failed:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const product = products.find((p) => p.node.handle === content.handle);
  const variants = product?.node.variants.edges.map((edge) => edge.node) ?? [];
  const [active, setActive] = useState(0);
  const selectedVariant = variants[active];

  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const viewContentSent = useRef(false);
  useEffect(() => {
    if (viewContentSent.current || !product || !selectedVariant) return;
    viewContentSent.current = true;
    trackViewContent({
      content_ids: [selectedVariant.id],
      content_name: product.node.title,
      content_type: "product",
      currency: "USD",
      value: parseFloat(selectedVariant.price.amount),
    });
  }, [product, selectedVariant]);

  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollGallery = (dir: number) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const galleryImages = useMemo(
    () => product?.node.images.edges.map((e) => e.node.url) ?? [],
    [product],
  );

  const heroImage =
    selectedVariant?.image?.url ??
    galleryImages[active] ??
    galleryImages[0] ??
    content.fallbackImage;

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
      imageUrl: heroImage,
    });
  };

  const colorLabel = selectedVariant
    ? getColorLabel(getVariantColorValue(selectedVariant.selectedOptions)) || selectedVariant.title
    : "Select a style";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src={logo.url}
              alt="kazevo by solarah"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-xl object-cover"
            />
            <span className="font-display text-xl font-black tracking-tight lowercase">
              kazevo by solarah
            </span>
          </Link>
          <CartButton />
        </nav>
      </header>

      <main>
        {/* Product hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:py-20">
            <div className="order-1 md:order-2">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2.5rem] bg-card">
                <img
                  key={heroImage}
                  src={heroImage}
                  alt={`${content.name} in ${colorLabel}`}
                  fetchPriority="high"
                  width={1200}
                  height={1600}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
              </div>
            </div>

            <div className="order-2 md:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                {content.eyebrow}
              </span>
              <h1 className="mt-5 font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                {content.headline[0]} <span className="text-primary">{content.headline[1]}</span>{" "}
                <span className="text-sunset-deep">{content.headline[2]}</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">{content.intro}</p>

              {variants.length > 0 && (
                <div className="mt-7">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Style
                  </p>
                  <p className="mt-1 font-display text-2xl font-extrabold capitalize">
                    {colorLabel}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {variants.map((variant, i) => {
                      const colorValue = getVariantColorValue(variant.selectedOptions);
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          aria-label={getColorLabel(colorValue) || variant.title}
                          aria-pressed={i === active}
                          onClick={() => setActive(i)}
                          className={`h-11 w-11 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                            i === active ? "border-foreground scale-110" : "border-border"
                          }`}
                          style={{ backgroundColor: getVariantDotColor(colorValue) }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {product ? (
                <>
                  <div className="mt-6 flex flex-wrap items-baseline gap-3">
                    <span className="font-display text-3xl font-black">
                      {selectedVariant
                        ? `${formatUsd(parseFloat(selectedVariant.price.amount))} USD`
                        : `${formatUsd(parseFloat(product.node.priceRange.minVariantPrice.amount))} USD`}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/25 px-3 py-1 text-xs font-semibold text-accent-foreground">
                      <Truck size={14} /> Free worldwide shipping
                    </span>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isLoading || !selectedVariant?.availableForSale}
                    className="mt-7 inline-flex h-auto w-full items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold shadow-[var(--shadow-pop)] transition-transform hover:scale-[1.02] sm:w-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  {!selectedVariant?.availableForSale && (
                    <p className="mt-3 text-sm font-medium text-muted-foreground">Out of stock</p>
                  )}
                </>
              ) : (
                <p className="mt-6 text-muted-foreground">
                  Pricing is loading — refresh in a moment if it doesn't appear.
                </p>
              )}

              <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {content.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-muted/60 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-xl font-display text-3xl font-black tracking-tight sm:text-4xl">
              {content.benefitsHeading}
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">{content.benefitsSub}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.benefits.map((b, i) => {
                const Icon = benefitIcons[i % benefitIcons.length]!;
                return (
                  <article
                    key={b.title}
                    className="rounded-3xl border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${benefitTones[i % benefitTones.length]}`}
                      >
                        <Icon size={22} />
                      </span>
                      <h3 className="font-display text-lg font-extrabold leading-tight">
                        {b.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-muted-foreground">{b.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery */}
        {galleryImages.length > 1 && (
          <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
                Closer look
              </h2>
              <div className="hidden gap-2 sm:flex">
                <button
                  type="button"
                  aria-label="Previous images"
                  onClick={() => scrollGallery(-1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card transition-transform hover:scale-105"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next images"
                  onClick={() => scrollGallery(1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card transition-transform hover:scale-105"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div
              ref={galleryRef}
              className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {galleryImages.map((url, i) => (
                <div
                  key={url}
                  className="w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl bg-muted sm:w-[46%] lg:w-[31%]"
                >
                  <img
                    src={url}
                    alt={`${content.name} detail ${i + 1}`}
                    width={900}
                    height={900}
                    loading="lazy"
                    className="aspect-square h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Specs */}
        <section className="mx-auto max-w-4xl px-5 pb-16 md:pb-24">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Technical specs
          </h2>
          <div className="mt-8 overflow-hidden rounded-3xl border border-border">
            <table className="w-full text-left text-sm sm:text-base">
              <tbody>
                {content.specs.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-muted/50" : "bg-card"}>
                    <th scope="row" className="w-2/5 px-5 py-4 font-semibold">
                      {k}
                    </th>
                    <td className="px-5 py-4 text-muted-foreground">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reviews */}
        <ProductReviews
          reviews={reviews.reviews}
          averageRating={reviews.averageRating}
          reviewCount={reviews.reviewCount}
        />

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-5 pb-16 md:pb-24">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.faqs.map((f) => (
              <article key={f.q} className="rounded-3xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-extrabold leading-tight">{f.q}</h3>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-7 py-16 text-center md:py-20">
            <div className="absolute inset-0 bg-[image:var(--gradient-dopamine)] opacity-60" />
            <div className="relative">
              <h2 className="font-display text-3xl font-black tracking-tight text-primary-foreground sm:text-4xl">
                {content.ctaHeadline}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-primary-foreground/85">{content.ctaSub}</p>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isLoading || !selectedVariant?.availableForSale}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 font-semibold text-background transition-transform hover:scale-105 disabled:opacity-60"
              >
                Add to Cart <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-10 text-sm text-muted-foreground">
          <Link to="/" className="font-display text-lg font-black lowercase text-foreground">
            kazevo by solarah
          </Link>
          <a className="hover:text-foreground" href="/#shop">
            Shop all
          </a>
          <a className="hover:text-foreground" href="/shipping">
            Shipping Policy
          </a>
          <a className="hover:text-foreground" href="/refund-policy">
            Refund Policy
          </a>
          <a className="hover:text-foreground" href="/terms">
            Terms of Service
          </a>
          <a className="hover:text-foreground" href="/legal">
            Legal Notice
          </a>
          <a className="hover:text-foreground" href="/contact">
            Contact
          </a>
        </div>
        <p className="pb-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} kazevo by solarah. Built for the light and fast.
        </p>
      </footer>
    </div>
  );
}
