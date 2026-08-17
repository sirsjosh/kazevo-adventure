# Send email subscribers to Shopify automatically

Yes. Every time someone submits the discount popup, we can create (or update) that person as a customer in your Shopify store with email-marketing consent, so they land in Shopify's Customers list and any Shopify/Klaviyo/Mailchimp flows connected to it.

## How it will work

```text
Popup submit -> save to Lovable Cloud (as today)
             -> server function -> Shopify Admin API -> customer created
                                                       + accepts marketing
                                                       + tag "kazevo-popup"
```

- The popup keeps working exactly as it does now (email stored, discount code shown). Shopify sync happens in the background, so a Shopify hiccup never blocks the customer from getting their code.
- If the email already exists in Shopify, we update that customer's marketing consent instead of creating a duplicate.
- Existing subscribers already in the database can be pushed to Shopify in a one-time backfill run if you want them included.

## What I need from you

Shopify's storefront token can't write customers, so this needs an Admin API token:

1. In your Shopify admin: Settings > Apps and sales channels > Develop apps > Create an app.
2. Give it the Admin API scopes `write_customers` and `read_customers`.
3. Install it and copy the Admin API access token.
4. I'll ask for it through the secure secret form (never paste it in chat).

## Technical notes

- New server function `src/lib/shopify-customers.functions.ts` calling the Shopify Admin GraphQL API (`2025-07`) with `customerCreate`, falling back to `customerEmailMarketingConsentUpdate` when the customer already exists.
- Token read inside the handler from `process.env['SHOPIFY_ADMIN_API_TOKEN']`; store domain reused from the existing constant.
- `src/components/DiscountPopup.tsx` calls the function after the database insert, fire-and-forget with errors logged only.
- Add `shopify_synced_at timestamptz` to `public.email_subscribers` so we can tell which records reached Shopify and retry the rest.
- Marketing consent is recorded as `SUBSCRIBED` with `consentCollectedFrom: OTHER` — the popup copy should state signup means marketing emails.
