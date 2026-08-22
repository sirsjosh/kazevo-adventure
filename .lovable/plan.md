# Install Shopify Flow for Kazevo

## Recommendation

Yes — install Shopify Flow. It is free on your current Shopify plan and plugs directly into the customer-tagging work the storefront already does. The biggest win is turning the `kazevo-popup` and `kazevo-checkout` tags into automated actions inside Shopify.

## What Shopify Flow will replace or improve

- Manual customer segmentation after popups / checkout.
- Delayed or missed review requests after purchase.
- Invisible low-stock situations that delay fulfillment.
- One-off thank-you / post-purchase messaging.

## Priority Flows to build (in order)

### 1. Tag customers by source (already in progress)

Trigger: Customer created.
Action: If tags contain `kazevo-popup`, add tag `popup-lead`; if `kazevo-checkout`, add tag `checkout-lead`.
Purpose: Makes segments visible in Shopify admin and other apps without relying on raw tags alone.

### 2. Judge.me review request timing

Trigger: Order fulfilled / Fulfilled (not paid), 7 days after fulfillment.
Action: Use Judge.me connector (if available) to send a review request, or tag order `review-requested` so Judge.me can trigger it.
Purpose: Ensures real buyers get review prompts while the product is still in use.

### 3. Low-stock / reorder alert

Trigger: Inventory quantity changed, quantity <= 10.
Action: Send internal email / Slack notification to reorder the product.
Purpose: Prevents stockouts on high-converting pages.

### 4. Welcome back / abandoned browse for tagged leads

Trigger: Customer created with tag `kazevo-popup` or `kazevo-checkout`, no order after 3 days.
Action: Add customer tag `nurture-sequence` for use by email/Meta audiences.
Purpose: Surfaces warm leads for remarketing.

### 5. Post-purchase thank-you + cross-sell tag

Trigger: Order created.
Condition: Product contains specific handles (e.g., `kazevo-mini`, `kazevo-outdoor`).
Action: Tag customer with `bought-mini`, `bought-outdoor`, etc., for future cross-sell campaigns.
Purpose: Feeds later upsells and lookalike audiences.

## Code changes (if any)

The storefront already writes customer tags via `syncSubscriberToShopify`. We may standardize the tags slightly so Flow conditions are easier to match:

- Keep `kazevo-popup` and `kazevo-checkout` as primary tags.
- Optionally add a second normalized tag: `kazevo-lead` to both sources.

No other frontend changes are required; Flow is configured inside Shopify admin.

## Verification

- Create a test customer through the popup or checkout.
- Confirm the customer appears in Shopify with the expected tags.
- Turn on one Flow at a time and check the run history for errors.

## Out of scope

- Replacing the existing email-capture code with Flow.
- Building custom Flow connectors (use native connectors only).
- Modifying checkout or storefront logic unless tag standardization is approved.
