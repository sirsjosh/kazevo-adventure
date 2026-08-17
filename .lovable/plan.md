# Finish the Shopify customer sync with your Admin token

The capture code is already built and live on both points (popup + checkout page). The only missing piece is the Admin API token with `write_customers` — the current store token returns 401 on customer writes.

## Steps

1. You save the new Admin API access token as `SHOPIFY_ADMIN_API_TOKEN` through the secure secret form (I'll open it — never paste it in chat).
2. I run a live end-to-end test: sync a test email and confirm Shopify creates the customer with marketing consent and the `kazevo-popup` tag.
3. If the token works, I backfill existing subscribers from the database into Shopify as customers with consent, tagged by their original source (`kazevo-popup` or `kazevo-checkout`), skipping any already marked as synced.
4. Report back how many were created, updated, and skipped.

## Technical notes

- `syncEmailSubscriberToShopify` already reads `process.env['SHOPIFY_ADMIN_API_TOKEN']` first and falls back to `SHOPIFY_ACCESS_TOKEN`, so no code change is needed for the live path.
- Backfill: a one-off admin-only server function reading `public.email_subscribers` where `shopify_synced_at is null`, calling the existing `syncSubscriberToShopify` helper in batches, then stamping `shopify_synced_at`.
- Errors stay non-blocking and logged; nothing in the checkout or popup flow changes.

If the token still 401s, the app's custom app likely lacks the `write_customers` scope — I'll tell you exactly which scope is missing rather than guessing.
