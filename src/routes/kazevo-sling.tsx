import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CircleDot,
  Droplets,
  Loader2,
  Mountain,
  Repeat,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";
import { CountrySelector } from "@/components/CountrySelector";
import { LifestyleMarquee } from "@/components/LifestyleMarquee";
import { ProductReviews } from "@/components/ProductReviews";
import { getProductReviews } from "@/lib/judgeme.functions";
import type { ProductReviewsData } from "@/lib/judgeme.server";
import { detectCountry } from "@/lib/market";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { formatMoney, getColorLabel, getVariantColorValue, getVariantDotColor } from "@/lib/variantImages";
import { useCartStore } from "@/stores/cartStore";
import { trackViewContent } from "@/lib/meta-pixel";
import { useMarket } from "@/components/MarketProvider";

import sling1 from "@/assets/sling-1.jpg.asset.json";
import sling2 from "@/assets/sling-2.jpg.asset.json";
import sling3 from "@/assets/sling-3.jpg.asset.json";
import sling4 from "@/assets/sling-4.jpg.asset.json";
import sling5 from "@/assets/sling-5.jpg.asset.json";
import sling6 from "@/assets/sling-6.jpg.asset.json";

const SITE_URL = "https://kazevo.store";
const PAGE_URL = `${SITE_URL}/kazevo-sling`;
const SLING_HANDLE = "篮球包篮球袋双肩单肩袋子排球足球背包网兜袋球网兜训练包收纳包";
const TITLE = "kazevo + Michael Rose Sports Sling Bag | Basketball Ball Bag";
const DESCRIPTION =
  "The kazevo + Michael Rose sports sling bag: durable Oxford ball bag for basketball, volleyball and football, with mesh side pocket, adjustable strap and single- or double-strap wear. Free worldwide shipping.";
const FALLBACK_IMAGE =
  "https://cdn.shopify.com/s/files/1/0744/5200/9121/files/F23D7891-BA82-4ABE-832F-A647FAF0EEF1.jpg?v=1786169122";

const lifestyleShots = [
  { src: sling1.url, alt: "Player walking off court with a black kazevo Michael Rose sling ball bag" },
  { src: sling2.url, alt: "Basketball player carrying the kazevo Michael Rose sling bag over one shoulder" },
  { src: sling3.url, alt: "Blue kazevo Michael Rose sling ball bag worn crossbody on a school court" },
  { src: sling4.url, alt: "Commuter wearing the black sling ball bag with a water bottle in the mesh pocket" },
  { src: sling5.url, alt: "Cyclist riding with the kazevo Michael Rose bag worn as a double-strap backpack" },
  { src: sling6.url, alt: "Street style shot of the kazevo Michael Rose sports sling bag" },
];

const benefits = [
  {
    icon: CircleDot,
    title: "Shaped for the ball",
    body: "A round, structured Oxford shell holds a size-7 basketball, volleyball or football without squashing your other kit.",
    tone: "bg-grape/10 text-grape",
  },
  {
    icon: Repeat,
    title: "Sling or backpack",
    body: "Wear it crossbody on one shoulder or clip the strap for a two-strap carry — same bag, two ways to move.",
    tone: "bg-sunset/15 text-sunset",
  },
  {
    icon: ShieldCheck,
    title: "Tough Oxford fabric",
    body: "Hard-wearing Oxford cloth with heavy-duty zips takes gym floors, gravel courts and the back of the team bus.",
    tone: "bg-mint/25 text-accent-foreground",
  },
  {
    icon: Droplets,
    title: "Mesh side pocket",
    body: "An open mesh pocket holds a water bottle or a pump so your drink never sits against sweaty kit.",
    tone: "bg-grape/10 text-grape",
  },
  {
    icon: Check,
    title: "Name-personalised",
    body: "The Michael Rose edition carries a printed name panel — easy to spot in a pile of identical team bags.",
    tone: "bg-sunset/15 text-sunset",
  },
  {
    icon: Truck,
    title: "Free worldwide shipping",
    body: "Ships free anywhere, with 7-day no-questions returns if it isn't the right fit.",
    tone: "bg-mint/25 text-accent-foreground",
  },
];

const specs = [
  ["Material", "Oxford cloth"],
  ["Fits", "Basketball, volleyball or football (size 5–7)"],
  ["Carry", "Single-shoulder sling or double-strap backpack"],
  ["Closure", "Curved zipper around the shell"],
  ["Pockets", "Main ball compartment, mesh side pocket"],
  ["Strap", "Adjustable, detachable shoulder strap"],
  ["Weight", "~1 kg packed"],
  ["Colorways", "Black, Blue, Red — single or double sling"],
  ["Best for", "Training, match days, school sport, commuting"],
];

const faqs = [
  {
    q: "Will a full-size basketball fit?",
    a: "Yes — the round compartment is built around a size-7 basketball, and it works just as well for volleyballs and footballs.",
  },
  {
    q: "What's the difference between single and double sling?",
    a: "Single sling wears crossbody over one shoulder. The double-sling version adds a second strap so you can carry it like a small backpack when your hands are full.",
  },
  {
    q: "Can I carry anything besides the ball?",
    a: "The mesh side pocket takes a water bottle or pump, and there's room around the ball for a rolled jersey, socks and a pair of grips.",
  },
  {
    q: "How do I clean it?",
    a: "Wipe the Oxford shell with a damp cloth and mild soap, then air dry. Skip the machine wash so the shape and print stay sharp.",
  },
];

export const Route = createFileRoute("/kazevo-sling")({
  head: ({ loaderData }) => {
    const reviews = (loaderData as { reviews?: ProductReviewsData } | undefined)?.reviews;
    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ];

    if (reviews && reviews.reviewCount > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "kazevo + Michael Rose sports sling bag",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(reviews.averageRating),
            reviewCount: String(reviews.reviewCount),
          },
        }),
      });
    }

    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "product" },
        { property: "og:url", content: PAGE_URL },
        { property: "og:image", content: FALLBACK_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: FALLBACK_IMAGE },
      ],
      links: [{ rel: "canonical", href: PAGE_URL }],
      scripts,
    };
  },
  validateSearch: (search: Record<string, unknown>) => ({
    color: typeof search["color"] === "string" ? (search["color"] as string) : undefined,
  }),
  loader: async () => {
    try {
      const countryCode = await detectCountry();
      const products = await fetchShopifyProducts("*", 50, countryCode);
      const reviews = await getProductReviews({ data: { handle: SLING_HANDLE } });
      return { products, reviews, countryCode };
    } catch (err) {
      console.error("Shopify products fetch failed:", err);
      return {
        products: [] as ShopifyProduct[],
        reviews: { reviews: [], averageRating: 0, reviewCount: 0 } as ProductReviewsData,
        countryCode: "US",
      };
    }
  },
  errorComponent: () => null,
  component: KazevoSlingPage,
});

function KazevoSlingPage() {
  const { products: loaderProducts, reviews } = Route.useLoaderData() as {
    products: ShopifyProduct[];
    reviews: ProductReviewsData;
  };
  const { countryCode, market } = useMarket();
  const [products, setProducts] = useState<ShopifyProduct[]>(loaderProducts);

  useEffect(() => {
    let cancelled = false;
    fetchShopifyProducts("*", 50, countryCode)
      .then((fresh) => {
        if (!cancelled && fresh.length > 0) setProducts(fresh);
      })
      .catch((err) => console.error("Shopify products refresh failed:", err));
    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  const product = products.find((p) => p.node.handle === SLING_HANDLE);
  const variants = product?.node.variants.edges.map((edge) => edge.node) ?? [];
  const { color } = Route.useSearch();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!color || variants.length === 0) return;
    const index = variants.findIndex(
      (v) => getVariantColorValue(v.selectedOptions)?.toLowerCase() === color.toLowerCase(),
    );
    if (index >= 0) setActive(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, variants.length]);

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
      currency: selectedVariant.price.currencyCode,
      value: parseFloat(selectedVariant.price.amount),
    });
  }, [product, selectedVariant]);

  const heroImage = useMemo(() => {
    return (
      selectedVariant?.image?.url ??
      product?.node.images.edges[active]?.node.url ??
      product?.node.images.edges[0]?.node.url ??
      FALLBACK_IMAGE
    );
  }, [selectedVariant, product, active]);

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
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mountain size={18} />
            </span>
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
                  alt={`kazevo + Michael Rose sports sling bag in ${colorLabel}`}
                  fetchPriority="high"
                  width={1200}
                  height={1600}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
              </div>
            </div>

            <div className="order-2 md:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                Basketball · Volleyball · Football
              </span>
              <h1 className="mt-5 font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                kazevo <span className="text-primary">+ Michael Rose</span>{" "}
                <span className="text-sunset-deep">sling bag</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                A round Oxford ball bag that carries your basketball, bottle and kit in one grab —
                worn crossbody or as a two-strap pack, with your name on the shell.
              </p>

              <div className="mt-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Style
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold capitalize">{colorLabel}</p>
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
                {[
                  "Fits a size-7 basketball",
                  "Sling or double-strap carry",
                  "Mesh bottle pocket",
                  "Durable Oxford cloth",
                ].map((item) => (
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
              One bag from warm-up to walk home
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Ball, bottle and kit in a shell that's built for court floors, bike rides and school
              corridors.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <article
                  key={b.title}
                  className="rounded-3xl border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${b.tone}`}
                    >
                      <b.icon size={22} />
                    </span>
                    <h3 className="font-display text-lg font-extrabold leading-tight">{b.title}</h3>
                  </div>
                  <p className="mt-4 text-muted-foreground">{b.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Lifestyle */}
        <section className="overflow-hidden py-16 md:py-24">
          <div className="mx-auto mb-8 max-w-6xl px-5">
            <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
              Courtside, curbside, everywhere
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Worn one strap or two — on the court, on the bike, on the way to practice.
            </p>
          </div>
          <div className="relative">
            <LifestyleMarquee shots={lifestyleShots} />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
          </div>
        </section>

        {/* Specs */}
        <section className="mx-auto max-w-4xl px-5 pb-16 md:pb-24">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Technical specs
          </h2>
          <div className="mt-8 overflow-hidden rounded-3xl border border-border">
            <table className="w-full text-left text-sm sm:text-base">
              <tbody>
                {specs.map(([k, v], i) => (
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
            {faqs.map((f) => (
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
                Grab the ball. Go.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-primary-foreground/85">
                Free worldwide shipping on every kazevo + Michael Rose sling bag.
              </p>
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
          <Link className="hover:text-foreground" to="/kazevo-mini" search={{ color: undefined }}>
            kazevo Mini
          </Link>
          <Link className="hover:text-foreground" to="/kazevo-outdoor" search={{ color: undefined }}>
            kazevo Outdoor
          </Link>
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
