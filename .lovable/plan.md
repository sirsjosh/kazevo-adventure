# Let shoppers pick a color in the upsell

Right now the cross-sell "Add to cart" button silently adds the first available variant. Instead, the offer should let people choose a colour before it goes in the cart.

## Behaviour

**Product page ("Perfect pair" section)**
- Show colour swatches for the partner product under the price, using the same dot swatches as the main product page.
- No colour is preselected. The add button reads "Choose a colour" and is disabled until one is picked, then becomes the normal CTA.
- Picking a colour swaps the shown image and price to that variant, and marks sold-out colours as unavailable.

**Cart drawer and checkout panel (compact card)**
- The button opens the colour choices inline inside the card instead of adding immediately.
- Small swatch row appears with the colour name on select; a confirm "Add" button completes it.
- After adding, the card shows a brief "Added" state and then hides for the session.

If the partner product has only one variant, skip the picker and add straight away.

## Technical notes

- Update `src/components/CrossSellOffer.tsx`: hold `selectedVariantId` state, derive the variant list from `product.variants.edges`, and reuse `getVariantColorValue`, `getColorLabel`, `getVariantDotColor` from `@/lib/variantImages`.
- Image/price shown comes from the selected variant, falling back to the product's first image.
- `addItem` is called with the selected variant only; disabled while none is chosen or the variant is unavailable.
- Panel layout gets a `picking` boolean to toggle the swatch row; dismissal via `sessionStorage` stays as is.
- No changes to the cart store, Shopify helpers, or pixel tracking.
