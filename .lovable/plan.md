# Add the 40oz insulated tumbler as an upsell-only product

The new "40oz Insulated Tumbler with Handle – 304 Stainless Steel" joins the pencil case, sports thermos and gradient bottle as an accessory that only ever appears inside the "Complete the kit" upsell blocks — never as a browsable product page, never in the homepage grid, and never reachable at its Chinese handle URL.

## What gets added

A fourth accessory entry ("tumbler") with:
- Name shown live from Shopify: 40oz Insulated Tumbler with Handle – 304 Stainless Steel
- Pitch: something like "40oz double-wall 304 stainless — 6–12 hours cold, straw lid and a handle that fits the car holder."

Because it is registered as an accessory handle, the existing guard automatically blocks `/product/<handle>` and keeps it off the catalog, same as the other three.

## Where it shows up

Colour picker in the upsell card already works for multi-variant accessories, so shoppers can pick from the eight colours (coffee, white, cream, mint green, light gray, pink, apricot, off-white) before adding.

Placement rules (best match first):
- Outdoor / commuter packs (`/kazevo-outdoor`, `/outdoor-hiking-backpack`, `/large-capacity-backpack`, `/kazevo-sling`): tumbler after the thermos — bigger, car-friendly option.
- Party cooler (`/insulated-drinks-tote`): tumbler alongside the thermos — natural pairing.
- Bottle sling (`/denim-water-bottle-bag`): keep bottle/thermos only; a 40oz 800g tumbler doesn't fit that sling.
- School and kids packs: not added — too heavy for a child's bag.
- Default (unmapped handles): thermos, bottle, tumbler.

## Colour swatches

Add dot colours for the shades not yet mapped: `coffee`, `white`, `off-white`, `apricot`, `pink`, `mint green` (existing entries already cover `cream` and `light gray`), so the swatch row renders true colours instead of a fallback grey.

## One thing to flag

In Shopify this product's compare-at price (2.67) is lower than the price (15.00). Anywhere the storefront shows a strikethrough "was" price, that would read as a price increase. Recommend clearing the compare-at price on this product — I can do that as part of the change if you want.

## Technical notes

- `src/lib/productContent.ts`: extend the `AccessoryUpsell["id"]` union with `"tumbler"`, append the entry with handle `跨境40oz二代大容量手柄车载冰霸杯304不锈钢保温杯汽车杯吸管杯`, and update `accessoryMatchesByPath` plus `defaultAccessoryIds` per the placement rules above.
- `src/lib/variantImages.ts`: add the missing colour values to the dot-colour map.
- No changes to `AccessoryUpsell.tsx`, the cart store, or Shopify helpers — the existing component handles multi-variant accessories and the accessory-handle guard already blocks the product page.
