# Capture subscriber + checkout emails into Shopify

Two sources of customer data flow into Shopify as customers with marketing consent:

1. Discount popup signups (already being built).
2. People who reach the `/checkout` page — whether or not they complete the purchase.

Important context: payment happens on Shopify's own hosted checkout, so once a shopper types their email there, Shopify already records them (order or abandoned checkout). The gap is shoppers who reach *our* checkout page and never type anything on Shopify's. So we capture the email on our page, before handing off.

## What changes on the checkout page

- Add an email field above the "Pay securely" button: "Email — for your order updates" with a short note that we'll also send occasional offers.
- On checkout click:
  - The email is saved to the subscriber list and pushed to Shopify as a customer with marketing consent, tagged `kazevo-checkout`.
  - The email is appended to the Shopify checkout URL so their address is prefilled — meaning if they abandon on Shopify's side, it becomes a real abandoned checkout Shopify can recover.
- If the field is empty, checkout still proceeds; we never block the sale. Only a valid email is captured.
- If the shopper already gave an email through the popup, the field is prefilled from local storage so they don't retype it.

## Tagging so you can tell sources apart in Shopify

- `kazevo-popup` — discount popup signup
- `kazevo-checkout` — reached checkout page (bought or not)
- Existing customers get the new tag added and consent refreshed; no duplicates.

## Technical notes

- Server function `syncEmailSubscriberToShopify` (in progress) takes `email` + `source`, calls Shopify Admin GraphQL `2025-07` `customerCreate`, falls back to lookup + `customerEmailMarketingConsentUpdate` + `tagsAdd` when the email already exists.
- Uses the existing project Shopify admin token from the environment (`SHOPIFY_ADMIN_API_TOKEN`, falling back to `SHOPIFY_ACCESS_TOKEN`); if the token lacks `write_customers`, I'll report back and ask you to create a custom app token.
- Migration: add `shopify_synced_at timestamptz` to `public.email_subscribers` (fixes the current build error) and allow the `checkout_page` source value.
- Insert of the checkout email uses the existing anon INSERT policy; the sync + `shopify_synced_at` update happen server-side with the service-role client.
- Checkout URL prefill: append `checkout[email]` to the Shopify checkout URL in `formatCheckoutUrl` usage from `src/routes/checkout.tsx`; also feed the email into Meta advanced matching, same as the popup does.
- Failures are logged only — never block checkout or the discount code.
