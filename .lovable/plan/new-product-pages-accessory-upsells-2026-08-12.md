# New product pages + accessory upsells

## What's in the store today

Checked the live store: 20 published products. 16 already have dedicated English pages. Four bags are published with no page yet, and the three accessories you named are published too.

**Needs a page (4):**
- kazevo Boge Wade School Backpack → `/boge-wade-school-backpack`
- kazevo Denim Water Bottle Bag → `/denim-water-bottle-bag`
- kazevo Dopamine Crossbody Chest Bag → `/dopamine-chest-bag`
- kazevo Large-Capacity Backpack → `/large-capacity-backpack`

**Upsell only, no page (3):** Multi-Layer Pencil Case, One-Touch Sports Thermos, Large-Capacity Gradient Water Bottle.

## The four new pages

Each uses the existing product page template, so they match the pages already live: hero with live Shopify price and colour swatches, add-to-cart, benefit cards, "closer look" slider, specs table, FAQ, Judge.me reviews, SEO meta and product schema. Copy is written in English from the supplier specs:

- **Boge Wade School Backpack** — nylon, 350 g, under 20 L, two compartments, curved shoulder straps, green/blue colour-block, fits an 8" tablet. Angle: candy-colour commuter/school pack that stays light.
- **Denim Water Bottle Bag** — Oxford fabric, 200 g, upright square shape, zip close, phone slot, illustrator-collab denim prints (Bichon, Cat). Angle: tiny hands-free bottle + phone carrier for hikes and days out.
- **Dopamine Crossbody Chest Bag** — nylon, 200 g, zip, phone and card pockets, blue/white/black. Angle: minimal chest bag for running errands, travel and trails.
- **Large-Capacity Backpack** — polyester, 280 g, under 20 L, two compartments, curved straps, Wisteria (random charm) and Beeswax Yellow. Angle: light large-capacity commuter with an outdoorsy look.

Colour dot swatches get added for every new colourway (green+blue, denim prints, wisteria, beeswax yellow, etc.) so the selectors render properly. Each page is added to the homepage shop grid, the footer, and the sitemap.

## Accessory upsells

The three accessories become add-ons rather than destinations:

- A new **"Complete the kit"** add-on row appears on backpack and school-bag product pages, and in the cart drawer and checkout — showing the pencil case, thermos and water bottle with live price and image from the store.
- Same behaviour as the football cross-sell: tap the accessory, pick a colour first, then add to cart. Nothing is added before a colour is chosen.
- Single-variant accessories add in one tap.
- They stay out of the homepage grid and out of the sitemap, and their Shopify URLs won't be linked from the site, so they only surface as upsells.

## Technical notes

- `src/lib/productContent.ts`: four new entries in `productPages` (path, Shopify handle, copy, specs, FAQs, SEO, fallback image); `handleToPath` picks them up automatically so the Chinese handles 301 to the English routes.
- New `accessoryUpsells` list in the same file (handle + short pitch), plus a helper to decide when to show it.
- New route files under `src/routes/` rendering `ProductPageTemplate`, matching the existing pages.
- Extend `CrossSellOffer` (or a sibling `AccessoryUpsell` component reusing its colour-pick flow) to render a multi-item add-on row; mount it in `ProductPageTemplate`, `CartDrawer` and `/checkout`.
- Add colour dot entries in `src/lib/variantImages.ts`.
- Homepage grid array in `src/routes/index.tsx` and the sitemap entries pick up the new pages; accessory handles are filtered out of the dynamic sitemap product loop.
