# Correct the four new product pages with the factory specs

The four pages are already live. The supplier sheets confirm some details, add real numbers, and contradict two claims I had to write generically. This updates the copy in `src/lib/productContent.ts` only — no layout or route changes.

## Corrections (things currently wrong or unverified)

**Canvas tote** — the factory sheet says single shoulder strap, magnetic snap closure, medium size, 300 g, one interior zip pocket, no divider.
- Remove the "laptop sits flat inside" FAQ — that sheet lists no laptop slot. The corduroy tote is the one with a laptop pocket.
- Soften "large-capacity" to accurate framing: medium-size tote, roomy for daily carry.
- Replace the crossbody-comfort claim with what's real: a single long shoulder strap the listing describes as shoulder/crossbody carry, magnetic snap top.

**Corduroy tote** — the sheet confirms a laptop slot, so that page keeps its laptop claim and gains the details it was missing.

## New facts to add to the spec tables and copy

**Transparent PVC Backpack** — PVC, waterproof, 280 g, large-capacity twin-strap travel backpack. Add weight and waterproof to specs; keep the honest PVC-care FAQ.

**Garment Storage Bag** — non-woven fabric, dust-proof and moisture-proof, 110 × 60 cm (200 g) and 152 × 60 cm (250 g). Use cases from the sheet: wardrobe storage, business travel, exhibition display, studio wardrobe. Business suits and formalwear are the stated fit. Keep the "not waterproof" honesty line — moisture-resistant is not rainproof.

**Plaid Corduroy Tote** — corduroy outer, polyester lining, 650 g, zip top, soft unstructured body with an interior divider. Interior: laptop slot, phone pocket, zip hidden pocket and a zip interlayer pocket; inner patch pocket. Two shoulder straps, horizontal square shape, large size, ten colourways. Add the pocket layout as a benefit card — it's the strongest differentiator against a plain canvas tote.

**Large-Capacity Canvas Tote** — canvas outer, polyester lining, 300 g, magnetic snap closure, topstitched detail, medium size, soft body, single shoulder strap, one interior zip pocket, seven colours, one size.

## Sourcing notes worth keeping in mind (not for the page)

These go in the internal notes file, not on the site: garment bag ships from Dongguan with 48h dispatch and a 33% repurchase rate; corduroy tote ships from Yiwu on a ~25-day lead time at higher unit cost; canvas tote from Baoding, 48h dispatch, 3-piece minimum. The corduroy tote's long lead time is the one to watch if it starts selling.

## What stays the same

Routes, layout, gallery, reviews, JSON-LD, sitemap entries and homepage links are already in place and unchanged. Prices and colour names still come live from Shopify.
