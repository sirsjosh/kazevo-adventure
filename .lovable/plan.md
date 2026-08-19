# Four new product pages, positioned against the competition

Add dedicated, conversion-focused pages for the four newest published products:

1. Kazevo Transparent PVC Backpack — `/clear-pvc-backpack`
2. Kazevo Non-Woven Garment Storage Bag — `/garment-storage-bag`
3. Kazevo Plaid Corduroy Tote Bag — `/corduroy-tote-bag`
4. Kazevo Large Capacity Canvas Tote Bag — `/canvas-tote-bag`

Each page reuses the existing product page layout already used by the football bag, hiking backpack and drinks tote — hero with price and buy button, benefit cards, spec table, image gallery, FAQ, Judge.me reviews, accessory upsells, and a closing CTA. Prices, names, images and stock come live from Shopify, so nothing is hardcoded.

## Competitor angles baked into the copy

Research is saved for Vorspack and Lazebox; Bagstellar and ZHMO notes are still pending from you.

**Clear PVC backpack (vs Vorspack, $17.99–$23.98, 4.5 stars, 19k ratings)**
Their reviews complain about PVC cracking after ~3 months, plastic smell, and zippers failing with grit. Our page leads on the same wins they get credit for (0.5mm-class PVC, wide padded straps, reinforced strap stitching, laptop fit, side bottle pockets, stadium/security clear-bag compliance) and answers the failure modes head-on in the FAQ instead of pretending they don't exist.

**Garment storage bag (vs Lazebox, $9.99–$19.99, 4.4 stars)**
Their weak points are thin material, seams tearing under shoe weight, and "waterproof" claims that aren't true. Our copy is honest — dust-proof and breathable for closet and travel, with clear guidance on what it is and isn't built for — and highlights the clear window, ID label, accessory pockets, fold-flat carry and hanger opening.

**Both totes** — angles finalised once the Bagstellar and ZHMO notes land.

## Positioning

Competitor sets cluster at $10–$25 for garment bags and $14–$25 for clear backpacks, with premium options at $35–$55. We present Kazevo in the upper-value band: better-than-budget build, clearly stated dimensions and load limits, free worldwide shipping and 7-day returns as the trust closer. Actual prices stay whatever you set in Shopify.

## Copy rules

- Benefit-driven headline, scannable bullets, no filler paragraphs.
- Every spec (material, dimensions, capacity, weight, compartments, colourways) taken from the supplier sheets you paste — nothing invented.
- Use cases written for the buyer: stadium and school clear-bag policies, work security checks, travel and closet garment storage, campus and grocery totes.
- No fabricated reviews or ratings; only real Judge.me reviews render.

## Technical notes

- Add four entries to `src/lib/productContent.ts` (path, Shopify handle, headline, bullets, benefits, specs, FAQs, SEO fields, gallery images).
- Add four thin routes under `src/routes/` following the existing template pattern, each with its own `head()` (title, description, og/twitter tags, Product + FAQ JSON-LD).
- Register the Chinese Shopify handles in `handleToPath` so `/product/<chinese-handle>` 301-redirects to the English URL.
- Add the four pages to `sitemap.xml` and link them from the homepage catalog grid.

## What I need before building

- Supplier specs and images for all four products.
- The Bagstellar and ZHMO competitor notes.
