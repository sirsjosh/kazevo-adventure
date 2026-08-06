import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Backpack,
  Check,
  Feather,
  Loader2,
  Mountain,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";
import { LifestyleMarquee } from "@/components/LifestyleMarquee";
import { ProductReviews } from "@/components/ProductReviews";
import { getProductReviews } from "@/lib/judgeme.functions";
import type { ProductReviewsData } from "@/lib/judgeme.server";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import {
  fallbackVariantImage,
  formatUsd,
  getColorLabel,
  getVariantColorName,
  getVariantColorValue,
  getVariantDotColor,
  getVariantImage,
} from "@/lib/variantImages";
import { useCartStore } from "@/stores/cartStore";
import { trackViewContent } from "@/lib/meta-pixel";

import purple from "@/assets/purple.jpg.asset.json";
import kid1 from "@/assets/kid-1.jpg.asset.json";
import kid2 from "@/assets/kid-2.jpg.asset.json";
import kid3 from "@/assets/kid-3.jpg.asset.json";
import kid4 from "@/assets/kid-4.jpg.asset.json";
import kid5 from "@/assets/kid-5.jpg.asset.json";

const SITE_URL = "https://kazevo.store";
const PAGE_URL = `${SITE_URL}/kazevo-mini`;
const TITLE = "kazevo Mini Backpack for Kids 5–10 | 190g Ultralight";
const DESCRIPTION =
  "The kazevo Mini is a 190g, 18L school backpack for kids 5–10. Arc straps for small shoulders, playground-proof 20D nylon, six dopamine colors, free worldwide shipping.";

const lifestyleShots = [
  { src: kid2.url, alt: "Schoolgirl carrying books and wearing a kazevo Mini backpack" },
  { src: kid4.url, alt: "Girl walking down a school hallway with a kazevo Mini backpack" },
  { src: kid1.url, alt: "Boy walking to school wearing a colourful kazevo Mini backpack" },
  { src: kid5.url, alt: "Young girl in dungarees smiling with a kazevo Mini backpack" },
  { src: kid3.url, alt: "Schoolboy cheering with a kazevo Mini backpack on his shoulder" },
];

const benefits = [
  {
    icon: Feather,
    title: "Kinder on growing backs",
    body: "At 190g the empty pack weighs less than a juice box, so almost all of the load your child carries is their own books — not the bag.",
    tone: "bg-grape/10 text-grape",
  },
  {
    icon: Sparkles,
    title: "Arc straps for small shoulders",
    body: "Curved, breathable mesh straps follow a child's frame instead of sliding off it. No digging in, no constant re-adjusting on the school run.",
    tone: "bg-sunset/15 text-sunset",
  },
  {
    icon: ShieldCheck,
    title: "Survives real school life",
    body: "20D ripstop nylon with a DWR coating wipes clean after mud, spilled juice and playground scrapes. Rain showers roll straight off.",
    tone: "bg-mint/25 text-accent-foreground",
  },
  {
    icon: Ruler,
    title: "Sized for ages 5–10",
    body: "A 44 × 27 × 15 cm mini silhouette holds an A4 folder, lunch box and water bottle without swamping a small back.",
    tone: "bg-grape/10 text-grape",
  },
  {
    icon: Backpack,
    title: "Packs away to nothing",
    body: "Folds into its own internal pocket — perfect as a spare bag for holidays, sports kit or grandparent weekends.",
    tone: "bg-sunset/15 text-sunset",
  },
  {
    icon: Truck,
    title: "Free worldwide shipping",
    body: "Every kazevo Mini ships free, worldwide, with a straightforward refund policy if the fit isn't right.",
    tone: "bg-mint/25 text-accent-foreground",
  },
];

const specs = [
  ["Material", "20D ripstop nylon, DWR coated"],
  ["Weight", "190 g"],
  ["Capacity", "18L (Junior Size)"],
  ["Dimensions", "44 × 27 × 15 cm (Mini Silhouette)"],
  ["Straps", "Arc-shaped breathable mesh, sized for kids"],
  ["Pockets", "Main, front zip, dual side mesh (bottle-friendly)"],
  ["Packability", "Folds into internal pocket"],
  ["Ages", "5–10 years"],
  ["Colorways", "6 dopamine variants"],
];

const faqs = [
  {
    q: "Will it fit an A4 school folder?",
    a: "Yes. The 44 × 27 cm main compartment takes A4 folders, exercise books, a lunch box and a change of clothes with room to spare.",
  },
  {
    q: "Is it suitable for a 5-year-old?",
    a: "It is. The arc straps adjust down to small frames and the empty pack is only 190g, so even the youngest explorers carry almost nothing extra.",
  },
  {
    q: "Is it waterproof?",
    a: "The 20D nylon is DWR coated and weather-resistant — it shrugs off showers and spills. For a full downpour we'd still recommend a rain cover.",
  },
  {
    q: "How do I clean it?",
    a: "Wipe with a damp cloth and mild soap, then air dry. No machine washing needed for everyday mud and crumbs.",
  },
];

export const Route = createFileRoute("/kazevo-mini")({
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
          name: "kazevo Mini Backpack",
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
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: PAGE_URL },
        { rel: "preload", as: "image", href: purple.url, fetchpriority: "high" },
      ],
      scripts,
    };
  },
  validateSearch: (search: Record<string, unknown>) => ({
    color: typeof search["color"] === "string" ? (search["color"] as string) : undefined,
  }),
  loader: async () => {
    try {
      const products = await fetchShopifyProducts("*", 50);
      const handle = products[0]?.node.handle;
      const reviews = handle
        ? await getProductReviews({ data: { handle } })
        : { reviews: [], averageRating: 0, reviewCount: 0 };
      return { products, reviews };
    } catch (err) {
      console.error("Shopify products fetch failed:", err);
      return {
        products: [] as ShopifyProduct[],
        reviews: { reviews: [], averageRating: 0, reviewCount: 0 } as ProductReviewsData,
      };
    }
  },
  errorComponent: () => null,
  component: KazevoMiniPage,
});

function KazevoMiniPage() {
  const { products: loaderProducts, reviews } = Route.useLoaderData() as {
    products: ShopifyProduct[];
    reviews: ProductReviewsData;
  };
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

  const product = products[0];
  const variants = product?.node.variants.edges.map((edge) => edge.node) ?? [];
  const { color } = Route.useSearch();
  const [active, setActive] = useState(0);

  // Preselect the colorway chosen on the homepage grid.
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
      currency: "USD",
      value: parseFloat(selectedVariant.price.amount),
    });
  }, [product, selectedVariant]);

  const heroImage = useMemo(() => {
    if (!selectedVariant) return fallbackVariantImage;
    return getVariantImage(selectedVariant.selectedOptions);
  }, [selectedVariant]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
      imageUrl: getVariantImage(selectedVariant.selectedOptions),
    });
  };

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
                  alt={
                    selectedVariant
                      ? `kazevo Mini kids school backpack in ${getVariantColorName(selectedVariant.selectedOptions) || selectedVariant.title}`
                      : "kazevo Mini kids school backpack"
                  }
                  fetchPriority="high"
                  width={1200}
                  height={1600}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
              </div>
            </div>

            <div className="order-2 md:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                Junior 18L · Ages 5–10
              </span>
              <h1 className="mt-5 font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                kazevo Mini <span className="text-primary">Backpack</span> for{" "}
                <span className="text-sunset-deep">school-age kids</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                A premium 190g, 18L pack built for small shoulders — light enough for a five-year-old,
                tough enough for five years of school runs.
              </p>

              <div className="mt-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Color
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold">
                  {selectedVariant
                    ? getVariantColorName(selectedVariant.selectedOptions) || selectedVariant.title
                    : "Select a color"}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {variants.map((variant, i) => {
                    const colorValue = variant.selectedOptions.find((o) =>
                      /color|colour|颜色/i.test(o.name),
                    )?.value;
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
                  "190g — lighter than a juice box",
                  "Arc straps for small shoulders",
                  "18L junior size, fits A4 folders",
                  "Weather-resistant 20D nylon",
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

        {/* Parent-focused benefits */}
        <section className="bg-muted/60 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-xl font-display text-3xl font-black tracking-tight sm:text-4xl">
              Why parents choose the kazevo Mini
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Ergonomics, durability and a price that makes sense — with colors your child will
              actually be excited to wear.
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
              From classroom to playground
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              School runs, park days, weekend trips — the Mini goes wherever their day does.
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

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-5 pb-16 md:pb-24">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Parent questions, answered
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
                190 grams. Big adventures.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-primary-foreground/85">
                Free worldwide shipping on every kazevo Mini.
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
