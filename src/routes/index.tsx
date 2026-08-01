import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Feather,
  ShieldCheck,
  Sparkles,
  Mountain,
  ArrowRight,
  Instagram,
  Youtube,
  Twitter,
  ShoppingBag,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";

import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import {
  colorDotMap,
  colorNameMap,
  fallbackVariantImage,
  getVariantImage,
} from "@/lib/variantImages";
import { useCartStore } from "@/stores/cartStore";

import purple from "@/assets/purple.jpg.asset.json";
import detail1 from "@/assets/detail-1.jpg.asset.json";
import detail2 from "@/assets/detail-2.jpg.asset.json";
import detail3 from "@/assets/detail-3.jpg.asset.json";
import detail4 from "@/assets/detail-4.jpg.asset.json";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "kazevo by solarah — 190g Ultralight Adventure Backpacks" },
      {
        name: "description",
        content:
          "kazevo by solarah makes 190g ultralight, weather-resistant nylon backpacks in vivid colorways. Ergonomic arc straps, 18L capacity, built for trail days.",
      },
      { property: "og:title", content: "kazevo by solarah — 190g Ultralight Adventure Backpacks" },
      {
        property: "og:description",
        content:
          "kazevo by solarah makes 190g ultralight, weather-resistant nylon backpacks in vivid colorways. Ergonomic arc straps, 18L capacity, built for trail days.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://kazevo-adventure-launch.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://kazevo-adventure-launch.lovable.app/" },
      { rel: "preload", as: "image", href: purple.url, fetchpriority: "high" },
    ],
  }),
  loader: async () => {
    const products = await fetchShopifyProducts("*", 50);
    return { products };
  },
  component: Landing,
});

// color maps live in @/lib/variantImages


const features = [
  {
    icon: Feather,
    title: "Ultra-Lightweight",
    body: "A feather-light 190g frame you forget you're wearing — packs down to the size of a fist.",
    tone: "bg-grape/10 text-grape",
  },
  {
    icon: Sparkles,
    title: "Ergonomic Comfort",
    body: "Arc-shaped shoulder straps follow your body line and spread load across the shoulders.",
    tone: "bg-sunset/15 text-sunset",
  },
  {
    icon: ShieldCheck,
    title: "Durable Nylon",
    body: "Weather-resistant premium ripstop nylon that shrugs off rain, grit and long seasons.",
    tone: "bg-mint/25 text-accent-foreground",
  },
];

function useSmoothScroll(duration = 900) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const start = window.scrollY;
      const headerOffset = 88;
      const end = el.getBoundingClientRect().top + start - headerOffset;
      const startTime = performance.now();
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + (end - start) * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [duration]);
}

const specs = [
  ["Material", "Premium ripstop nylon, DWR coated"],
  ["Weight", "190 g"],
  ["Capacity", "18 L"],
  ["Dimensions", "43 × 25 × 16 cm"],
  ["Straps", "Arc-shaped breathable mesh"],
  ["Pockets", "Main, front zip, dual side mesh"],
  ["Packability", "Folds into internal pocket"],
  ["Colorways", "6 dopamine variants"],
];

function Landing() {
  const { products } = Route.useLoaderData() as { products: ShopifyProduct[] };
  const product = products[0];
  const variants = product?.node.variants.edges.map((edge) => edge.node) ?? [];

  const [active, setActive] = useState(0);
  const selectedVariant = variants[active];

  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const showcaseImage = useMemo(() => {
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
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mountain size={18} />
            </span>
            <span className="font-display text-xl font-black tracking-tight lowercase">
              kazevo by solarah
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="#shop"
              className="hidden shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 sm:inline-flex"
            >
              Shop Now
            </a>
            <CartButton />
          </div>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                New · 18L Ultralight
              </span>
              <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                kazevo: <span className="text-primary">190g</span> of Pure{" "}
                <span className="text-sunset-deep">Adventure</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                Ultra-lightweight performance built for people who move fast. Ripstop nylon,
                arc-shaped straps, and colorways loud enough for the summit selfie.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#shop"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-pop)] transition-transform hover:scale-105"
                >
                  Shop Now <ArrowRight size={18} />
                </a>
                <a
                  href="#specs"
                  className="rounded-full border border-border px-7 py-3.5 text-base font-semibold transition-colors hover:bg-muted"
                >
                  See the specs
                </a>
              </div>
              <dl className="mt-10 grid max-w-sm grid-cols-3 gap-4 text-center">
                {[
                  ["190g", "Weight"],
                  ["18L", "Capacity"],
                  ["6", "Colorways"],
                ].map(([v, k]) => (
                  <div key={k} className="rounded-2xl bg-muted px-2 py-3">
                    <dt className="font-display text-2xl font-black">{v}</dt>
                    <dd className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <div className="absolute inset-4 rounded-[3rem] bg-[image:var(--gradient-dopamine)] opacity-80 blur-2xl" />
              <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2.5rem] bg-card">
                <img
                  src={purple.url}
                  alt="kazevo 190g ultralight backpack in deep purple"
                  fetchPriority="high"
                  width={1200}
                  height={1200}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="max-w-xl font-display text-3xl font-black tracking-tight sm:text-4xl">
            Engineered light. Built loud.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.title}
                className="rounded-3xl border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${f.tone}`}>
                  <f.icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Product showcase */}
        <section id="shop" className="bg-muted/60 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
            {product ? (
              <>
                <div className="order-2 md:order-1">
                  <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
                    Pick your dopamine hit
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    {product.node.description}
                  </p>
                  <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Colorway
                  </p>
                  <p className="mt-1 font-display text-2xl font-extrabold">
                    {selectedVariant
                      ? colorNameMap[
                          selectedVariant.selectedOptions.find((o) =>
                            /color|colour|颜色/i.test(o.name)
                          )?.value ?? ""
                        ] || selectedVariant.title
                      : "Select a color"}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {variants.map((variant, i) => {
                      const colorValue = variant.selectedOptions.find((o) =>
                        /color|colour|颜色/i.test(o.name)
                      )?.value;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          aria-label={colorNameMap[colorValue ?? ""] || variant.title}
                          aria-pressed={i === active}
                          onClick={() => setActive(i)}
                          className={`h-11 w-11 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                            i === active ? "border-foreground scale-110" : "border-border"
                          }`}
                          style={{
                            backgroundColor: colorDotMap[colorValue ?? ""] || "oklch(0.7 0.05 300)",
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-6">
                    <span className="font-display text-3xl font-black">
                      {selectedVariant
                        ? `${selectedVariant.price.currencyCode} ${parseFloat(selectedVariant.price.amount).toFixed(2)}`
                        : `${product.node.priceRange.minVariantPrice.currencyCode} ${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}`}
                    </span>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isLoading || !selectedVariant?.availableForSale}
                    className="mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 h-auto text-base font-semibold shadow-[var(--shadow-pop)] transition-transform hover:scale-105"
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
                </div>
                <div className="order-1 aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-card md:order-2">
                  <img
                    key={showcaseImage}
                    src={showcaseImage}
                    alt={
                      selectedVariant
                        ? `kazevo backpack in ${colorNameMap[selectedVariant.selectedOptions.find((o) => /color|colour|颜色/i.test(o.name))?.value ?? ""] || selectedVariant.title}`
                        : "kazevo backpack"
                    }
                    width={1200}
                    height={1200}
                    loading="lazy"
                    className="h-full w-full object-cover transition-opacity duration-500"
                  />
                </div>
              </>
            ) : (
              <div className="order-2 md:order-1 md:col-span-2 text-center py-16">
                <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
                  No products found
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Your Shopify store is connected but has no products yet. Tell me what product
                  you'd like to add and I'll create it for you.
                </p>
              </div>
            )}
          </div>
        </section>


        {/* Specs */}
        <section id="specs" className="mx-auto max-w-4xl px-5 py-16 md:py-24">
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

        {/* Detail gallery */}
        <section id="gallery" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { src: detail1.url, alt: "Runner wearing a lime kazevo backpack by the water" },
              { src: detail2.url, alt: "Breathable mesh back panel and adjustable webbing straps" },
              { src: detail3.url, alt: "Grab handle and colorful cord pulls on the top panel" },
              { src: detail4.url, alt: "Side mesh pocket with cord pulls and charm keyring" },
            ].map((img) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                width={750}
                height={700}
                loading="lazy"
                className="h-64 w-full rounded-3xl bg-muted object-cover sm:h-72"
              />
            ))}
          </div>
        </section>


        {/* CTA band */}
        <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <div className="rounded-[2.5rem] bg-[image:var(--gradient-dopamine)] px-7 py-14 text-center">
            <h2 className="font-display text-3xl font-black tracking-tight text-primary-foreground sm:text-4xl">
              190 grams. Zero excuses.
            </h2>
            <a
              href="#shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 font-semibold text-background transition-transform hover:scale-105"
            >
              Shop Now <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="font-display text-lg font-black lowercase text-foreground">
              kazevo by solarah
            </span>
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
          <div className="flex shrink-0 gap-3">
            {[Instagram, Youtube, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#top"
                aria-label="kazevo social"
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <p className="pb-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} kazevo by solarah. Built for the light and fast.
        </p>
      </footer>
    </div>
  );
}
