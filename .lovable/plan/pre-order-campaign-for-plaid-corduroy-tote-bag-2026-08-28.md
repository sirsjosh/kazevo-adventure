# Pre-order Campaign for Plaid Corduroy Tote Bag

## Recommendation: no Shopify app required

The campaign experience (countdown timer, pre-order badges, shipping-date messaging, deadline-based purchase gating, and early-bird pricing) can be built entirely in the frontend. The only Shopify-side change needed is the price setup for the early-bird discount.

Shopify has a built-in way to show a discount: set the variant's **Compare-at price** to the regular price and the variant's **Price** to the lower pre-order price. The storefront already reads `compareAtPrice` and renders "Save X%" badges.

## Campaign rules

- Product: **Kazevo Plaid Corduroy Tote Bag** (`/corduroy-tote-bag`, handle `飞泓跨境格子托特包高颜值大容量灯芯绒单肩包休闲旅行便携手提包`)
- Pre-order window: now until **30 September 2026, 23:59 Bangkok time (UTC+7)**
- Shipping promise: all orders ship **before 3 October 2026**
- Post-deadline: Add to Cart is disabled and a "Pre-order ended" message is shown
- Pricing: early-bird discount via Shopify compare-at/price (need regular and pre-order amounts)

## Shopify-side work

1. Remove the Plaid Corduroy Tote Bag from the frontend `SOLD_OUT_HANDLES` override so it becomes purchasable again.
2. In Shopify admin (or via API if authorized), set each variant's **Compare-at price** to the regular price and **Price** to the pre-order price.
3. After 30 September, either:
   - revert the price to regular, or
   - set inventory to 0 and disable "Continue selling when out of stock" so Shopify itself blocks new orders.

## Frontend work

1. **Add pre-order metadata to `src/lib/productContent.ts`**
   - Add an optional `preorder` block to `ProductPageContent`:
     - `deadline`: ISO timestamp for 30 September 2026 23:59:59+07:00
     - `shipsBy`: "3 October 2026"
     - `badgeText`: "Pre-order"
     - `closedMessage`: "Pre-order ended"
   - Apply it only to the `corduroy-tote-bag` entry.

2. **Create a `PreorderBanner` component**
   - Live countdown to the deadline (days / hours / minutes / seconds).
   - Shipping promise line: "Ships before 3 October 2026".
   - Early-bird badge when the variant is on sale.
   - Stops rendering or switches to "Pre-order ended" after the deadline.

3. **Update `src/components/ProductPageTemplate.tsx`**
   - Render the `PreorderBanner` when `content.preorder` exists.
   - After the deadline, disable the Add to Cart button and CTA button and show the closed message.
   - Keep the product visible (as requested for the sold-out state previously).

4. **Update `src/components/ProductCard.tsx`**
   - Show a "Pre-order" pill on the card image for the tote bag.
   - Disable the Add button after the deadline.

5. **Update `src/lib/stock.ts`**
   - Remove the Plaid Corduroy Tote Bag from `SOLD_OUT_HANDLES`.
   - Add an `isPreorderClosed(handle)` helper that checks the deadline for configured products.
   - Use it in product card and product page purchase gating.

## Open values needed before implementation

- Regular price for the Plaid Corduroy Tote Bag
- Early-bird pre-order price

Once those are provided, the Shopify price update and frontend build can be done in one turn.
