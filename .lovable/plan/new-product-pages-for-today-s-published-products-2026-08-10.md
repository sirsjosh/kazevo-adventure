# New product pages for today's published products

## What's actually published

I checked the live storefront. Of the products in your list, only three were published to sales channels today (Aug 10):

| Product | Published |
| --- | --- |
| kazevo Football Fan Leather Crossbody Bag | today 04:38 |
| kazevo Outdoor Hiking Backpack | today 04:44 |
| kazevo Mini Crossbody Bag | today 04:47 |

Everything else in your list is either already live with its own page (Football-Shaped Hand Bag, Retro Soft Leather Backpack, Functional School Backpack, Jiumeiso, Color-Block Kids, Ultra-Light Kids, Crossbody Waist Bag) or not yet visible on the storefront at all (Multi-Layer Pencil Case, One-Touch Sports Thermos, Gradient Water Bottle, Boge Wade School Backpack, Denim Water Bottle Bag, Dopamine Crossbody Chest Bag, Large-Capacity Backpack). I'll skip those unpublished ones — say the word once they're published and I'll add them.

## New pages

1. `/football-fan-leather-crossbody` — kazevo Football Fan Leather Crossbody Bag
   - Full-grain cowhide, crazy-horse leather finish, 450g, 31 x 14 x 13 cm, riveted retro detailing, colorways: black, vintage brown, crazy-horse brown, mocha brown, brown, amber grain.
2. `/outdoor-hiking-backpack` — kazevo Outdoor Hiking Backpack
   - Nylon shell, under 20L, 500g, curved shoulder straps, built for hiking/camping/cycling, colorways: purple-pink, pink-green, coffee-khaki.
3. `/mini-crossbody-bag` — kazevo Mini Crossbody Bag
   - Polyester, 120g, small horizontal square crossbody, phone + card pockets, single strap, colorways: pink, yellow, blue, grey.

Each page follows the exact same structure as the existing product pages: hero with live Shopify price, color swatches, add-to-cart, benefit cards, "Closer look" image slider, technical specs table, FAQ, and Judge.me reviews.

## Technical notes

- Add three entries to `src/lib/productContent.ts` keyed by their Shopify handles, with translated English marketing copy, benefit list, spec table rows, and FAQ items.
- Create three route files under `src/routes/` mirroring the existing pattern (loader fetching Shopify products + Judge.me reviews, `buildProductHead` for SEO, rendering `ProductPageTemplate`).
- Add color-dot entries in `src/lib/variantImages.ts` for the new colorways (vintage brown, crazy-horse brown, mocha brown, amber grain, purple-pink, pink-green, coffee-khaki, grey).
- Link the three new pages from the homepage shop grid and add them to `src/routes/sitemap[.]xml.ts`.
- Gallery images come from the Shopify product images, same as the other generated pages.
