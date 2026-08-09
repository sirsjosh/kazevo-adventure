# Dedicated product pages for the published catalog

## What's live right now

I checked the storefront directly. Ten products are published to the online sales channel:

| Product | Has a dedicated page? |
|---|---|
| Kazevo mini | Yes — /kazevo-mini |
| Kzevo Outdoor Backpack | Yes — /kazevo-outdoor |
| kazevo x Michael Rose sports sling bag | Yes — /kazevo-sling |
| kazevo Football-Shaped hand Bag | No |
| kazevo Retro Soft Leather Backpack | No |
| kazevo Functional School Backpack | No |
| kazevo Jiumeiso Backpack | No |
| kazevo Color-Block Kids Backpack | No |
| kazevo Ultra-Light Kids Backpack | No |
| kazevo Crossbody Waist Bag – Japanese Style | No |

The other names in your list (Football Fan Leather Crossbody, Multi-Layer Pencil Case, Sports Thermos, Gradient Water Bottle, Boge Wade School Backpack, Denim Water Bottle Bag, Mini Crossbody Bag, Dopamine Crossbody Chest Bag, Large-Capacity Backpack, Outdoor Hiking Backpack) are not published to a sales channel, so they get no page. Publish them and I'll add their pages in a follow-up.

## What I'll build

Seven new product pages, one per unpublished-page product above, at clean English URLs:

- /football-bag
- /retro-leather-backpack
- /functional-school-backpack
- /jiumeiso-backpack
- /color-block-kids-backpack
- /ultra-light-kids-backpack
- /crossbody-waist-bag

Each page keeps the same look and structure as /kazevo-sling:

- Sticky header with logo + cart, hero with product gallery and live Shopify price
- Color swatch selector wired to the real Shopify variants, add-to-cart, out-of-stock state
- Three to four benefit cards written from the supplier specs you pasted (translated into English marketing copy — e.g. PU shell / 23×15×16 cm / 360 g for the football bag, Oxford waterproof / arc straps for the kids backpacks)
- A technical specs table (material, lining, weight, dimensions, capacity, closure, season) built from the same source data
- FAQ block with FAQPage structured data
- Judge.me reviews section + aggregateRating in the Product JSON-LD
- Unique head() metadata: title, description, og:title/description, og:image from the Shopify product image, canonical

Image galleries use the product photos already on the Shopify products — no scrolling lifestyle marquee for these, since we don't have lifestyle photography for them yet. Send me photos for any product and I'll add a marquee like the Mini and Sling pages have.

## Site wiring

- Homepage grid: route each of these products to its dedicated page instead of the generic /product/$handle fallback
- Footer shop links: add the new pages (grouped so the list stays readable)
- sitemap.xml: add all seven paths
- Color swatch dots: add the new colorways (棕色/白色/黑色/牛仔蓝/粉色, 黄色/黑色/棕色, 粉+绿 etc.) to the swatch color map with English labels

## Technical notes

- To avoid seven near-identical 500-line files, I'll extract the shared page shell into `src/components/ProductPageTemplate.tsx` plus a `src/lib/productContent.ts` data file holding per-product copy (benefits, specs rows, FAQ, SEO strings, handle). Each route file then stays small: loader fetches the Shopify product by handle plus Judge.me reviews, and renders the template with its content entry.
- Existing /kazevo-mini, /kazevo-outdoor and /kazevo-sling are left untouched so nothing regresses.
- Prices and availability stay live from the Storefront API; nothing is hardcoded.
