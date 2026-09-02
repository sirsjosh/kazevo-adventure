# Unlock the Purchase Button for the Plaid Corduroy Tote Bag

## Goal
Make the Add to Cart / buy button for the Plaid Corduroy Tote Bag clickable during the pre-order campaign (until 30 September 2026), even if Shopify reports the variant as unavailable or out of stock.

## Current state
- The pre-order campaign config already exists (`src/lib/stock.ts` → `PREORDER_CONFIGS`, deadline 2026-09-30, ships by 3 October 2026).
- The tote is no longer in `SOLD_OUT_HANDLES`, so `isSoldOut` does not block it.
- The remaining blocker is the Shopify `availableForSale` check, which disables the button in `src/components/ProductCard.tsx`, `src/components/ProductPageTemplate.tsx`, and `src/routes/product/$handle.tsx` when Shopify inventory/availability is off.

## Changes

1. **`src/lib/stock.ts`** — add a helper, e.g. `isPreorderActive(handle)`, that returns true when a product has a `PREORDER_CONFIGS` entry and the deadline has not passed.

2. **`src/components/ProductCard.tsx`** — for products with an active pre-order, ignore `selectedVariant.availableForSale` when enabling/disabling the Add button. Keep blocking on `isPreorderClosed` after the deadline.

3. **`src/components/ProductPageTemplate.tsx`** — same change: during the active pre-order window, the Add to Cart and CTA buttons stay enabled regardless of Shopify availability; after the deadline they stay disabled with the "Pre-order ended" message.

4. **`src/routes/product/$handle.tsx`** — same change for the generic product page so the tote is purchasable there too while the pre-order is open.

## Notes
- No Shopify admin or app changes needed; this only removes the frontend availability gate for pre-order products.
- After 30 September the existing `isPreorderClosed` logic automatically locks the button again.
- If Shopify checkout itself blocks the order due to zero inventory, the fix would then be on the Shopify side (inventory quantity or "continue selling when out of stock"), which I can handle via the Shopify API if authorized.
