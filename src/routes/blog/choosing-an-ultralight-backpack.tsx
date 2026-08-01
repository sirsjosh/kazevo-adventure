import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mountain } from "lucide-react";

import { CartButton } from "@/components/CartButton";

const SITE_URL = "https://kazevo-adventure-launch.lovable.app";
const URL = `${SITE_URL}/blog/choosing-an-ultralight-backpack`;
const TITLE = "How to Choose an Ultralight Backpack (2026 Guide) — kazevo by solarah";
const DESCRIPTION =
  "A practical guide to choosing an ultralight backpack: how weight, denier, capacity and suspension trade off, and how to pick the right pack for your hikes.";

export const Route = createFileRoute("/blog/choosing-an-ultralight-backpack")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to Choose an Ultralight Backpack",
          description: DESCRIPTION,
          url: URL,
          author: { "@type": "Organization", name: "kazevo by solarah" },
          publisher: { "@type": "Organization", name: "kazevo by solarah" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "How to Choose an Ultralight Backpack", item: URL },
          ],
        }),
      },
    ],
  }),
  component: Guide,
});

const sections = [
  {
    h: "1. Start with the weight you actually carry",
    p: [
      "An ultralight backpack is not just a light pack — it is a pack matched to a light load. Frameless designs like the 190g kazevo carry beautifully up to roughly 7–8 kg. Past that, the load starts riding on your shoulders instead of being spread across your back, and comfort falls off fast.",
      "Weigh your base kit (everything except food and water) before you shop. Under 6 kg, a frameless ultralight pack is the obvious answer. Above 10 kg, you want a framed pack and the extra 600–1200g that comes with it.",
    ],
  },
  {
    h: "2. Denier, coatings and what durability really costs",
    p: [
      "Fabric weight is measured in denier (D). A 20D ripstop nylon shell is featherlight and packs to the size of a fist; 70D or 210D is noticeably tougher against granite and scree but adds hundreds of grams. Silicone or PU coatings add water resistance at a small weight penalty.",
      "The honest trade-off: every gram you strip out is a gram of abrasion resistance you give up somewhere. Ultralight packs reward hikers who set their pack down rather than drag it, and who stay on trail more often than they bushwhack.",
    ],
  },
  {
    h: "3. Capacity: 18L, 30L or 50L?",
    p: [
      "18–20L is the day-hike and fastpacking sweet spot — water, layers, food, a shell and a first-aid kit, nothing more. 30–40L covers overnight trips with compact sleep gear. 50L+ is multi-day and winter territory, and almost always needs a frame.",
      "Buying bigger 'just in case' is the most common mistake. Extra volume gets filled, and filled volume gets carried. Size the pack to the trip you do most often.",
    ],
  },
  {
    h: "4. Suspension, straps and load transfer",
    p: [
      "On a frameless pack the harness does all the work. Look for contoured arc straps that follow your collarbone, breathable spacer mesh on the back panel, and a sternum strap you can slide. A soft hip belt helps stabilise the load even when it is not transferring much weight.",
      "Pack shape matters as much as strap padding: keep dense items high and close to your spine, and use soft layers as the padding between your back and the load.",
    ],
  },
  {
    h: "5. Packability and everyday use",
    p: [
      "The best ultralight backpacks compress into their own pocket, which makes them useful as a summit pack, a travel daypack or a stowaway second bag. If a pack cannot fold down small, most of its ultralight advantage disappears once you are off the trail.",
    ],
  },
  {
    h: "6. A quick checklist before you buy",
    p: [
      "Weigh your base kit. Match capacity to your most frequent trip. Choose a denier that fits your terrain. Check the harness geometry, not just the padding. Confirm the pack folds down small. And check the empty weight against the load rating — a 190g pack rated for 8 kg is a very different tool from a 1.2 kg pack rated for 20 kg.",
    ],
  },
];

function Guide() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-black tracking-tight">
              kazevo <span className="text-muted-foreground">by solarah</span>
            </span>
          </Link>
          <CartButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to kazevo
        </Link>

        <h1 className="mt-6 font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          How to choose an <span className="text-sunset-deep">ultralight backpack</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Weight, durability and capacity pull against each other. Here is how to decide which one
          to prioritise — and how to find the best hiking backpack for the trails you actually walk.
        </p>

        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-2xl font-extrabold tracking-tight">{s.h}</h2>
              {s.p.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-3 leading-relaxed text-foreground/80">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-[image:var(--gradient-dopamine)] p-8 text-center">
          <h2 className="font-display text-2xl font-black tracking-tight text-white">
            190g. 18L. Built for the light-and-fast day.
          </h2>
          <p className="mt-2 text-white/90">
            See the kazevo ultralight pack in all six colorways.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-background px-7 py-3 text-base font-semibold text-foreground transition-transform hover:scale-105"
          >
            Shop kazevo
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} kazevo by solarah
      </footer>
    </div>
  );
}
