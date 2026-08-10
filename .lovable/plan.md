# Football pair cross-sell ("one for him, one for her")

Pair the two football bags so each one offers the other as a one-tap add-on.

## The pairing

| In cart / on page | Upsell shown | Copy |
| --- | --- | --- |
| kazevo Football-Shaped Hand Bag | kazevo Football Fan Leather Crossbody Bag | "Buying one for you? Get one for your man." — full-grain crazy-horse leather, same football spirit |
| kazevo Football Fan Leather Crossbody Bag | kazevo Football-Shaped Hand Bag | "Something for your lady? The football hand bag is the match." — statement evening piece in the same shape |

## Where it appears

1. **Cart drawer** — when a matching item is in the cart, a compact offer card sits above the total: product image, name, live price, one line of persuasive copy, and an "Add to cart" button that adds the default variant instantly without leaving the drawer. Dismissible; stays dismissed for the session.
2. **Checkout page** — same offer card in the summary column, so it's the last thing seen before paying.
3. **Product page** — a "Perfect pair" section near the bottom of `/football-bag` and `/football-fan-leather-crossbody` with the partner product, its price, the same copy angle, and buttons for "Add to cart" and "View product".

Card styling follows the existing dopamine palette (orange accent, rounded card, no hardcoded colors) and never blocks or interrupts checkout.

## Technical notes

- Add a `crossSell` pairing map in `src/lib/productContent.ts` keyed by product handle: partner handle, partner route path, headline, and body copy.
- New `src/components/CrossSellOffer.tsx`: takes a handle (or cart items), fetches the partner product via the existing `fetchShopifyProducts` helper, renders the card, and calls `useCartStore.addItem` with the partner's first available variant — real Shopify cart lines, no fake products.
- Dismissal state in component-local state plus `sessionStorage`; nothing persisted to the cart store.
- Render it in `src/components/CartDrawer.tsx` (above the totals block), in the summary aside of `src/routes/checkout.tsx`, and from `src/components/ProductPageTemplate.tsx` when the current content has a `crossSell` entry.
- Fire a Meta Pixel `AddToCart` through the existing `trackAddToCart` path (already handled inside the cart store) so tracking stays consistent.
- If the partner product isn't returned by Shopify, the card renders nothing.
