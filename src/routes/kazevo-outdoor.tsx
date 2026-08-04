import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CloudRain,
  Laptop,
  Loader2,
  Lock,
  Mountain,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wind,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";
import { LifestyleMarquee } from "@/components/LifestyleMarquee";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import {
  formatUsd,
  getColorLabel,
  getVariantColorValue,
  getVariantDotColor,
} from "@/lib/variantImages";
import { useCartStore } from "@/stores/cartStore";
import { trackViewContent } from "@/lib/meta-pixel";

import outdoor1 from "@/assets/outdoor-1.jpg.asset.json";
import outdoor2 from "@/assets/outdoor-2.jpg.asset.json";

const SITE_URL = "https://kazevo.store";
const PAGE_URL = `${SITE_URL}/kazevo-outdoor`;
const OUTDOOR_HANDLE =
  "彩色多巴胺户外运动包女大容量轻便休闲旅行书包防泼水登山双肩包";
const TITLE = "kazevo Outdoor Backpack | Lightweight 500g Hiking & Travel Pack";
const DESCRIPTION =
  "The kazevo Outdoor Backpack: water-repellent nylon, breathable back panel, laptop sleeve and anti-theft pocket in a 500g colour-block pack for hiking, travel and campus. Free worldwide shipping.";

const SHOPIFY_SHOTS = [
  "https://cdn.shopify.com/s/files/1/0744/5200/9121/files/6076E9C5-C593-4AC3-91F7-B800AB5737EC.jpg?v=1785843583",
  "https://cdn.shopify.com/s/files/1/0744/5200/9121/files/83E44F7D-FC8D-4D21-956C-4154F218379C.jpg?v=1785843581",
  "https://cdn.shopify.com/s/files/1/0744/5200/9121/files/40C6E91A-F14E-45E6-B11A-E1CD487D4BC5.jpg?v=1785843582",
  "https://cdn.shopify.com/s/files/1/0744/5200/9121/files/5A450FB8-0A2A-4C7E-92F0-7C060E3D6E99.jpg?v=1785843580",
];

const lifestyleShots = [
  { src: outdoor1.url, alt: "Hiker in a forest wearing a colour-block kazevo Outdoor Backpack" },
  { src: SHOPIFY_SHOTS[0]!, alt: "kazevo Outdoor Backpack in light green" },
  { src: outdoor2.url, alt: "Woman on a mountain ridge carrying a kazevo Outdoor Backpack" },
  { src: SHOPIFY_SHOTS[1]!, alt: "kazevo Outdoor Backpack in mixed colourway" },
  { src: SHOPIFY_SHOTS[2]!, alt: "kazevo Outdoor Backpack in light blue" },
  { src: SHOPIFY_SHOTS[3]!, alt: "kazevo Outdoor Backpack in pink" },
];

const benefits = [
  {
    icon: CloudRain,
    title: "Water-repellent shell",
    body: "Coated nylon sheds trail drizzle, spilled coffee and sudden showers so your layers and electronics stay dry.",
    tone: "bg-grape/10 text-grape",
  },
  {
    icon: Wind,
    title: "Breathable back panel",
    body: "A ventilated back and padded shoulder straps keep air moving on long climbs and warm commutes.",
    tone: "bg-sunset/15 text-sunset",
  },
  {
    icon: ShieldCheck,
    title: "Abrasion-resistant build",
    body: "Reinforced contrast stitching and hard-wearing nylon handle rock scrapes, luggage racks and daily overpacking.",
    tone: "bg-mint/25 text-accent-foreground",
  },
  {
    icon: Lock,
    title: "Anti-theft pocket",
    body: "A concealed zip pocket sits against your back for a passport, phone or wallet in crowded stations and trailheads.",
    tone: "bg-grape/10 text-grape",
  },
  {
    icon: Laptop,
    title: "Organised inside",
    body: "Padded laptop sleeve, camera slot, phone pocket, hidden zip pocket and a zipped divider — everything has its place.",
    tone: "bg-sunset/15 text-sunset",
  },
  {
    icon: Truck,
    title: "Free worldwide shipping",
    body: "Ships free anywhere, with 7-day no-questions returns if the fit isn't right.",
    tone: "bg-mint/25 text-accent-foreground",
  },
];

const specs = [
  ["Material", "Nylon shell, polyester lining"],
  ["Weight", "500 g"],
  ["Dimensions", "42 × 26 × 13 cm"],
  ["Closure", "Zipper"],
  ["Interior", "Hidden zip pocket, phone pocket, zip divider, laptop sleeve, camera sleeve"],
  ["Features", "Water-repellent, breathable, abrasion-resistant, anti-theft, shock-absorbing, load-reducing"],
  ["Style", "Colour-block with contrast stitching, 2026 season"],
  ["Best for", "Travel, hiking, commuting, campus"],
  ["Colorways", "Light green, mixed, light blue, pink"],
];

const faqs = [
  {
    q: "Will a laptop fit?",
    a: "Yes — the padded internal sleeve takes most 14-inch laptops and slim 15-inch models, plus a tablet in the divider pocket.",
  },
  {
    q: "Is it waterproof?",
    a: "The nylon shell is water-repellent and shrugs off rain, splashes and spills. For sustained heavy rain we still recommend a rain cover.",
  },
  {
    q: "How much does it hold?",
    a: "At 42 × 26 × 13 cm it comfortably carries a laptop, a change of clothes, a camera and a water bottle — enough for a day hike or a weekend away.",
  },
  {
    q: "How do I clean it?",
    a: "Wipe with a damp cloth and mild soap, then air dry. Avoid machine washing to preserve the water-repellent coating.",
  },
];

export const Route = createFileRoute("/kazevo-outdoor")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "product" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: SHOPIFY_SHOTS[0]! },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SHOPIFY_SHOTS[0]! },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
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
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    color: typeof search["color"] === "string" ? (search["color"] as string) : undefined,
  }),
  loader: async () => {
    try {
      const products = await fetchShopifyProducts("*", 50);
      return { products };
    } catch (err) {
      console.error("Shopify products fetch failed:", err);
      return { products: [] as ShopifyProduct[] };
    }
  },
  errorComponent: () => null,
  component: KazevoOutdoorPage,
});

function KazevoOutdoorPage() {
  const { products: loaderProducts } = Route.useLoaderData() as { products: ShopifyProduct[] };
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

  const product = products.find((p) => p.node.handle === OUTDOOR_HANDLE);
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
      currency: "USD",
      value: parseFloat(selectedVariant.price.amount),
    });
  }, [product, selectedVariant]);

  const heroImage = useMemo(() => {
    return (
      selectedVariant?.image?.url ??
      product?.node.images.edges[active]?.node.url ??
      product?.node.images.edges[0]?.node.url ??
      SHOPIFY_SHOTS[0]!
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
    : "Select a color";

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
                  alt={`kazevo Outdoor Backpack in ${colorLabel}`}
                  fetchPriority="high"
                  width={1200}
                  height={1600}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
              </div>
            </div>

            <div className="order-2 md:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                Outdoor · Travel · Campus
              </span>
              <h1 className="mt-5 font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                kazevo <span className="text-primary">Outdoor</span>{" "}
                <span className="text-sunset-deep">Backpack</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                A 500g water-repellent colour-block pack with a breathable back panel, padded
                laptop sleeve and a hidden anti-theft pocket — built for trails, flights and
                everything between.
              </p>

              <div className="mt-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Color
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
                  "Water-repellent nylon shell",
                  "Breathable, load-reducing straps",
                  "Padded laptop & camera sleeves",
                  "Hidden anti-theft back pocket",
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
              Built for the way you actually travel
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Weather protection, smart storage and all-day comfort in one lightweight
              colour-block pack.
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
              Trails, cities, everything between
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Forest paths, mountain ridges, morning commutes — one pack that keeps up.
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
                Light pack. Long days.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-primary-foreground/85">
                Free worldwide shipping on every kazevo Outdoor Backpack.
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
          <Link className="hover:text-foreground" to="/kazevo-mini">
            kazevo Mini
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
