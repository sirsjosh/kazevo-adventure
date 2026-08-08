import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Feather,
  ShieldCheck,
  
  ArrowRight,
  Instagram,
  Facebook,
  ShoppingBag,
  Play,
  Truck,
  Dumbbell,
  Palette,
  Globe,
  PiggyBank,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/CartButton";

import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { formatUsd, getVariantImage } from "@/lib/variantImages";

import { trackViewContent } from "@/lib/meta-pixel";

import outdoor2 from "@/assets/outdoor-2.jpg.asset.json";
import logoAsset from "@/assets/kazevo-logo.png.asset.json";
import ctaClip from "@/assets/cta-clip.mp4.asset.json";
import ctaPoster from "@/assets/cta-poster.jpg.asset.json";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "kazevo — Bags for Every Journey | Ultralight Backpacks" },
      {
        name: "description",
        content:
          "From daily commutes to weekend adventures – find the perfect kazevo bag for every occasion. Premium, ultralight backpacks with free worldwide shipping.",
      },
      { property: "og:title", content: "kazevo — Bags for Every Journey" },
      {
        property: "og:description",
        content:
          "From daily commutes to weekend adventures – find the perfect kazevo bag for every occasion. Free worldwide shipping.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://kazevo.store/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://kazevo.store/" },
      { rel: "preload", as: "image", href: outdoor2.url, fetchpriority: "high" },

    ],
  }),
  loader: async () => {
    try {
      const products = await fetchShopifyProducts("*", 50);
      return { products };
    } catch (err) {
      console.error("Shopify products fetch failed:", err);
      return { products: [] };
    }
  },
  errorComponent: () => null,
  component: Landing,
});

// color maps live in @/lib/variantImages


const features = [
  {
    icon: Dumbbell,
    title: "Premium Quality",
    body: "Durable materials built to last.",
    tone: "bg-grape/10 text-grape",
  },
  {
    icon: Palette,
    title: "Stylish Designs",
    body: "Modern designs for every style.",
    tone: "bg-sunset/15 text-sunset",
  },
  {
    icon: Globe,
    title: "Versatile Collections",
    body: "Bags for every occasion.",
    tone: "bg-mint/25 text-accent-foreground",
  },
  {
    icon: PiggyBank,
    title: "Affordable Prices",
    body: "Quality bags at accessible prices.",
    tone: "bg-secondary/15 text-secondary-foreground",
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

const MINI_HANDLE =
  "unilulu轻量户外徒步登山背包男女2026新款撞色多巴胺旅行双肩包";
const OUTDOOR_HANDLE =
  "彩色多巴胺户外运动包女大容量轻便休闲旅行书包防泼水登山双肩包";
const SLING_HANDLE = "篮球包篮球袋双肩单肩袋子排球足球背包网兜袋球网兜训练包收纳包";



function Landing() {
  const { products: loaderProducts } = Route.useLoaderData() as { products: ShopifyProduct[] };
  const [products, setProducts] = useState<ShopifyProduct[]>(loaderProducts);

  // Prices/variants can change in Shopify after this page was rendered/cached,
  // so always refresh from the Storefront API on the client.
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

  const [ctaPlaying, setCtaPlaying] = useState(false);
  const ctaVideoRef = useRef<HTMLVideoElement>(null);
  const firstVariant = variants[0];

  // No ViewContent here: the homepage is a catalog, not a product view.
  // ViewContent fires on the individual product routes.





  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <img
              src={logoAsset.url}
              alt="kazevo by solarah logo"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-xl object-cover"
            />
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
        <section className="relative isolate overflow-hidden">
          <img
            src={outdoor2.url}
            alt="Adventurer on a mountain ridge wearing a kazevo backpack"
            fetchPriority="high"
            width={1600}
            height={1200}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-ink/65" />
          <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-dopamine)] opacity-40 mix-blend-overlay" />

          <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:py-36">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground backdrop-blur">
              kazevo by solarah
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-black leading-[0.95] tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
              Bags for Every Journey
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/85">
              From daily commutes to weekend adventures – find the perfect bag for every occasion.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-pop)] transition-transform hover:scale-105"
              >
                Shop Now <ArrowRight size={18} />
              </a>
              <a
                href="#why-kazevo"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 bg-primary-foreground/10 px-8 py-4 text-base font-semibold text-primary-foreground backdrop-blur transition-transform hover:scale-105"
              >
                Why Kazevo?
              </a>
            </div>
            <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-primary-foreground/80">
              <li className="inline-flex items-center gap-2">
                <Truck size={16} /> Free worldwide shipping
              </li>
              <li className="inline-flex items-center gap-2">
                <Feather size={16} /> Ultralight builds
              </li>
              <li className="inline-flex items-center gap-2">
                <ShieldCheck size={16} /> Secure checkout
              </li>
            </ul>
          </div>
        </section>

        {/* Why Kazevo */}
        <section id="why-kazevo" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
              Our difference
            </span>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
              Why Kazevo?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Four reasons thousands of adventurers, students and commuters carry kazevo.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <article
                key={f.title}
                className="group rounded-3xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-pop)]"
              >
                <span
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${f.tone}`}
                >
                  <f.icon size={28} />
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold leading-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </section>


        {/* Shop grid */}
        <section id="shop" className="bg-muted/60 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                  Shop the collection
                </span>
                <h2 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-4xl">
                  Backpacks for every adventure
                </h2>
                <p className="mt-3 max-w-lg text-muted-foreground">
                  Explore our lineup of ultralight, durable packs. Free worldwide shipping on every
                  order.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
                {products.length} {products.length === 1 ? "product" : "products"}
              </span>
            </div>

            {products.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(({ node }) => {
                  const productVariants = node.variants.edges.map((edge) => edge.node);
                  const firstOptions = productVariants[0]?.selectedOptions ?? [];
                  const isMini = node.handle === MINI_HANDLE;
                  const image = isMini
                    ? getVariantImage(firstOptions)
                    : (node.images.edges[0]?.node.url ?? getVariantImage(firstOptions));
                  const colorOption = node.options.find(
                    (option) => option.name.toLowerCase() === "color" || option.name.toLowerCase() === "colour",
                  );
                  const colorCount = colorOption?.values.length ?? 0;
                  const inStock = productVariants.some((variant) => variant.availableForSale);
                  const isOutdoor = node.handle === OUTDOOR_HANDLE;
                  const isSling = node.handle === SLING_HANDLE;
                  const title = isMini
                    ? "kazevo Mini"
                    : isOutdoor
                      ? "kazevo Outdoor Backpack"
                      : isSling
                        ? "kazevo + Michael Rose Sling Bag"
                        : node.title;
                  const linkProps = isMini
                    ? ({ to: "/kazevo-mini" } as const)
                    : isOutdoor
                      ? ({ to: "/kazevo-outdoor" } as const)
                      : isSling
                        ? ({ to: "/kazevo-sling" } as const)
                        : ({ to: "/product/$handle", params: { handle: node.handle } } as const);

                  return (
                    <article
                      key={node.id}
                      className="group flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-pop)]"
                    >
                      <Link
                        {...linkProps}
                        className="relative block aspect-[4/5] overflow-hidden bg-muted"
                      >
                        <img
                          src={image}
                          alt={`${title} backpack`}
                          width={1200}
                          height={1500}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {colorCount > 1 && (
                          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                            {colorCount} colors
                          </span>
                        )}
                        {!inStock && (
                          <span className="absolute right-4 top-4 rounded-full bg-foreground/85 px-3 py-1 text-xs font-semibold text-background">
                            Sold out
                          </span>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col p-5">
                        <Link {...linkProps} className="min-w-0">
                          <h3 className="font-display text-xl font-extrabold leading-tight transition-colors hover:text-primary">
                            {title}
                          </h3>
                        </Link>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground">
                          {isMini ? "190g · 18L junior size · ages 5–10" : node.description?.slice(0, 90)}
                        </p>
                        <div className="mt-5 flex items-center justify-between gap-3">
                          <span className="font-display text-2xl font-black">
                            {formatUsd(parseFloat(node.priceRange.minVariantPrice.amount))}
                          </span>
                          <Button asChild size="sm" className="rounded-full">
                            <Link {...linkProps}>
                              <ShoppingBag className="mr-1.5 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <h3 className="font-display text-2xl font-black tracking-tight">
                  No products found
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Your store is connected but has no products yet. Tell me what product you'd like
                  to add and I'll create it for you.
                </p>
              </div>
            )}
          </div>
        </section>




        {/* Value strip */}
        <section id="why-kazevo-strip" className="mx-auto max-w-6xl px-5 pb-4 pt-16 md:pt-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Ultralight design", "Packs that disappear on your back."],
              ["Weather-ready", "DWR-coated nylon shrugs off rain and spills."],
              ["Smart storage", "Pockets where you actually need them."],
              ["Free shipping", "Worldwide delivery on every order."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-3xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <h3 className="font-display text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>




        {/* CTA band */}
        <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink">
            <video
              ref={ctaVideoRef}
              src={ctaClip.url}
              poster={ctaPoster.url}
              playsInline
              preload="none"
              controls={ctaPlaying}
              onPlay={() => setCtaPlaying(true)}
              onPause={() => setCtaPlaying(false)}
              onEnded={() => setCtaPlaying(false)}
              className="absolute inset-0 h-full w-full object-cover"
              aria-label="kazevo backpacks in action"
            />
            <div
              className={`absolute inset-0 bg-[image:var(--gradient-dopamine)] mix-blend-multiply transition-opacity ${
                ctaPlaying ? "pointer-events-none opacity-0" : "opacity-60"
              }`}
            />

            <div
              className={`relative px-7 py-20 text-center md:py-28 ${
                ctaPlaying ? "pointer-events-none opacity-0" : "opacity-100"
              } transition-opacity`}
            >
              <h2 className="font-display text-4xl font-black tracking-tight text-primary-foreground sm:text-5xl">
                Pack light. Go far.
              </h2>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#shop"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 font-semibold text-background transition-transform hover:scale-105"
                >
                  Shop Now <ArrowRight size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => ctaVideoRef.current?.play()}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 bg-primary-foreground/10 px-8 py-4 font-semibold text-primary-foreground backdrop-blur transition-transform hover:scale-105"
                >
                  <Play size={18} /> Play video
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="font-display text-lg font-black lowercase text-foreground">
              kazevo by solarah
            </span>
            <a className="hover:text-foreground" href="/#shop">
              Shop
            </a>
            <a className="hover:text-foreground" href="/kazevo-outdoor">
              kazevo Outdoor
            </a>
            <a className="hover:text-foreground" href="/kazevo-mini">
              kazevo Mini
            </a>
            <a className="hover:text-foreground" href="/kazevo-sling">
              Michael Rose Sling
            </a>
            <a className="hover:text-foreground" href="/shipping">
              Shipping
            </a>
            <a className="hover:text-foreground" href="/refund-policy">
              Refund Policy
            </a>
            <a className="hover:text-foreground" href="/terms">
              Terms
            </a>
            <a className="hover:text-foreground" href="/legal">
              Legal
            </a>
            <a className="hover:text-foreground" href="/contact">
              Contact
            </a>

          </div>
          <div className="flex shrink-0 gap-3">
            <a
              href="https://www.instagram.com/kazevoadventures/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="kazevo on Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61592887435083"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="kazevo on Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>
        <p className="pb-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} kazevo by solarah. Built for the light and fast.
        </p>
      </footer>
    </div>
  );
}
