# Kazevo Outdoor Backpack product page

Build a dedicated page for the second Shopify product ("Kzevo Outdoor Backpack", $19.99, colors: light green, mixed, light blue, pink), styled like `/kazevo-mini`, with a scrolling lifestyle gallery using the two uploaded adult hiking photos.

## Page: `/kazevo-outdoor`

Same structure and design language as the Mini page:

- Hero with product image, title, price from Shopify, color swatches, add-to-cart (live variant IDs), free worldwide shipping badge.
- Benefit cards written for adults/outdoor use, from the supplier data: water-repellent, breathable back panel, abrasion-resistant, anti-theft pocket, shock-absorbing, load-reducing straps.
- Scrolling lifestyle marquee (`LifestyleMarquee`) using the two uploaded hiking photos plus the product's Shopify photos so the strip has enough frames to loop smoothly.
- Specs table translated from the supplier sheet:
  - Material: nylon shell, polyester lining
  - Dimensions: 42 x 26 x 13 cm
  - Weight: 500 g
  - Closure: zipper
  - Interior: hidden zip pocket, phone pocket, zip divider pocket, laptop sleeve, camera sleeve
  - Features: water-repellent, breathable, abrasion-resistant, anti-theft, shock-absorbing, load-reducing
  - Style: colour-block contrast stitching, 2026 season
  - Best for: travel, hiking, commuting, campus
- FAQ block with `FAQPage` JSON-LD + `Product` JSON-LD.
- Route-level `head()` with unique title/description/OG tags and the product image as `og:image`.
- Meta Pixel `ViewContent` on load and `AddToCart` on add, matching the Mini page.

## Wiring

- Homepage grid: route this product's card to `/kazevo-outdoor` instead of the generic `/product/$handle` (same handle-matching approach already used for the Mini).
- Add `/kazevo-outdoor` to `sitemap.xml`.
- Footer/nav: add it alongside the Mini link.

## Technical notes

- The two uploaded photos are uploaded via the assets CLI to `src/assets/outdoor-1.jpg` / `outdoor-2.jpg` pointers and imported.
- Variant data, price and availability come live from the Storefront API by handle (`彩色多巴胺户外运动包女大容量轻便休闲旅行书包防泼水登山双肩包`), no hardcoded prices.
- Colour swatch dots for light green / mixed / light blue / pink are added to `src/lib/variantImages.ts`.
- Product images come from Shopify; variant-specific imagery is used when the variant name matches an image, otherwise the first product image.

## Note

The supplier page prices (¥18.70–21.70) are wholesale; the page shows your Shopify retail price of $19.99. Tell me if the retail price should change.
