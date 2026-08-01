import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Feather,
  ShieldCheck,
  Sparkles,
  Mountain,
  ArrowRight,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";

import purple from "@/assets/purple.jpg.asset.json";
import orange from "@/assets/orange.jpg.asset.json";
import mint from "@/assets/mint.jpg.asset.json";
import lavender from "@/assets/lavender.jpg.asset.json";
import lime from "@/assets/lime.jpg.asset.json";
import black from "@/assets/black.jpg.asset.json";
import life1 from "@/assets/life-1.jpg";
import life2 from "@/assets/life-2.jpg";
import life3 from "@/assets/life-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "kazevo — 190g Ultralight Adventure Backpacks" },
      {
        name: "description",
        content:
          "kazevo makes 190g ultralight, weather-resistant nylon backpacks in five vivid colorways. Ergonomic arc straps, 18L capacity, built for trail days.",
      },
      { property: "og:title", content: "kazevo — 190g of Pure Adventure" },
      {
        property: "og:description",
        content:
          "Ultralight 190g nylon backpacks with arc-shaped straps and dopamine colorways. Shop the kazevo pack.",
      },
    ],
  }),
  component: Landing,
});

const variants = [
  { name: "Deep Purple", img: purple.url, dot: "oklch(0.62 0.19 300)" },
  { name: "Vibrant Orange", img: orange.url, dot: "oklch(0.75 0.17 75)" },
  { name: "Deep Green", img: mint.url, dot: "oklch(0.85 0.13 172)" },
  { name: "Light Green", img: lime.url, dot: "oklch(0.87 0.2 122)" },
  { name: "Lilac Bloom", img: lavender.url, dot: "oklch(0.78 0.11 300)" },
  { name: "Classic Black", img: black.url, dot: "oklch(0.25 0.02 285)" },
];

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

const specs = [
  ["Material", "Premium ripstop nylon, DWR coated"],
  ["Weight", "190 g"],
  ["Capacity", "18 L"],
  ["Dimensions", "43 × 25 × 16 cm"],
  ["Straps", "Arc-shaped breathable mesh"],
  ["Pockets", "Main, front zip, dual side mesh"],
  ["Packability", "Folds into internal pocket"],
  ["Colorways", "5 dopamine variants"],
];

function Landing() {
  const [active, setActive] = useState(0);
  const variant = variants[active]!;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex sm:justify-between">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Mountain size={18} />
            </span>
            <span className="truncate font-display text-xl font-black tracking-tight lowercase">
              kazevo
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-foreground" href="#colors">
              Colors
            </a>
            <a className="transition-colors hover:text-foreground" href="#specs">
              Specs
            </a>
            <a className="transition-colors hover:text-foreground" href="#gallery">
              Trail
            </a>
          </div>
          <a
            href="#colors"
            className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Shop Now
          </a>
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
                <span className="text-secondary">Adventure</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                Ultra-lightweight performance built for people who move fast. Ripstop nylon,
                arc-shaped straps, and colorways loud enough for the summit selfie.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#colors"
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
                  ["5", "Colorways"],
                ].map(([v, k]) => (
                  <div key={k} className="rounded-2xl bg-muted px-2 py-3">
                    <dt className="font-display text-2xl font-black">{v}</dt>
                    <dd className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <div className="absolute inset-6 rounded-[3rem] bg-[image:var(--gradient-dopamine)] opacity-90" />
              <img
                src={purple.url}
                alt="kazevo 190g ultralight backpack in deep purple"
                width={1200}
                height={1200}
                className="relative mx-auto w-full max-w-md rounded-[2.5rem] object-cover mix-blend-multiply"
              />
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
        <section id="colors" className="bg-muted/60 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
                Pick your dopamine hit
              </h2>
              <p className="mt-3 text-muted-foreground">
                Five color-blocked variants, each with contrast webbing, mesh side pockets and the
                signature cord-pull cluster.
              </p>
              <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Colorway
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold">{variant.name}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {variants.map((v, i) => (
                  <button
                    key={v.name}
                    type="button"
                    aria-label={v.name}
                    aria-pressed={i === active}
                    onClick={() => setActive(i)}
                    className={`h-11 w-11 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      i === active ? "border-foreground scale-110" : "border-border"
                    }`}
                    style={{ backgroundColor: v.dot }}
                  />
                ))}
              </div>
              <a
                href="#specs"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-pop)] transition-transform hover:scale-105"
              >
                Shop {variant.name} <ArrowRight size={18} />
              </a>
            </div>
            <div className="order-1 rounded-[2.5rem] bg-card p-4 md:order-2">
              <img
                key={variant.img}
                src={variant.img}
                alt={`kazevo backpack in ${variant.name}`}
                width={1200}
                height={1200}
                loading="lazy"
                className="w-full rounded-[2rem] object-cover"
              />
            </div>
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

        {/* Gallery */}
        <section id="gallery" className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            Out there, every weekend
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <img
              src={life1}
              alt="Hiker running a ridge at sunset with a kazevo pack"
              width={1024}
              height={1280}
              loading="lazy"
              className="h-72 w-full rounded-3xl object-cover md:row-span-2 md:h-full"
            />
            <img
              src={life2}
              alt="Two friends hiking an alpine meadow"
              width={1024}
              height={768}
              loading="lazy"
              className="h-56 w-full rounded-3xl object-cover md:col-span-2"
            />
            <img
              src={life3}
              alt="Close-up of colorful backpack straps and cord pulls"
              width={1024}
              height={768}
              loading="lazy"
              className="h-56 w-full rounded-3xl object-cover md:col-span-2"
            />
          </div>
        </section>

        {/* CTA band */}
        <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
          <div className="rounded-[2.5rem] bg-[image:var(--gradient-dopamine)] px-7 py-14 text-center">
            <h2 className="font-display text-3xl font-black tracking-tight text-primary-foreground sm:text-4xl">
              190 grams. Zero excuses.
            </h2>
            <a
              href="#colors"
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
              kazevo
            </span>
            <a className="hover:text-foreground" href="#features">
              Features
            </a>
            <a className="hover:text-foreground" href="#colors">
              Colors
            </a>
            <a className="hover:text-foreground" href="#specs">
              Specs
            </a>
            <a className="hover:text-foreground" href="#gallery">
              Trail
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
          © {new Date().getFullYear()} kazevo. Built for the light and fast.
        </p>
      </footer>
    </div>
  );
}
