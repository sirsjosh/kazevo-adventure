# Meta Pixel + CAPI audit and fix plan

## What the audit found in the code

Confirmed by reading the tracking code (`src/lib/meta-pixel.ts`, `src/components/MetaPixelTracker.tsx`, `src/routes/__root.tsx`, `src/stores/cartStore.ts`, `src/routes/checkout.tsx`, product routes, `src/lib/shopify.ts`).

**Critical**

1. **No `eventID` anywhere.** Every browser event fires without an event ID, so nothing sent by Shopify's server-side Conversions API can be deduplicated against the browser pixel. This alone caps coverage and inflates/duplicates counts.
2. **`fbclid` / `fbp` are dropped at checkout.** `formatCheckoutUrl` rewrites the checkout host to `bsctke-ju.myshopify.com` and only appends `channel=online_store`. Because checkout is on a different domain than kazevo.store, the `_fbp` / `_fbc` cookies set on kazevo.store are never seen by Shopify, and the click ID is not forwarded in the URL. Shopify's CAPI therefore sends Purchase/AddPaymentInfo with weak identity and no link back to browser events.
3. **The pixel fires on every preview domain.** There is no host guard, so every `id-preview-*.lovable.app` load reports into dataset 1382896033791262 — that is the source of the 43 connected websites and a large share of the low-quality traffic.

**High**

4. **No ViewContent on `/product/$handle`.** The generic product route fires nothing; only mini/outdoor/sling do.
5. **Homepage fires ViewContent** for an arbitrary first variant. A catalog page is not a product view — this dilutes ViewContent quality (matches the 6.1/10 score).
6. **AddToCart / ViewContent / InitiateCheckout carry no customer identity.** Advanced matching only ever runs at init, and only if the visitor previously submitted the discount popup. No `external_id`, no persistent anonymous ID.
7. **Events omit `contents`** (`[{id, quantity, item_price}]`), which Meta uses for catalog matching alongside `content_ids`.

**Medium**

8. Content IDs are Shopify **variant GIDs** (`gid://shopify/ProductVariant/…`). Shopify's CAPI reports numeric IDs, so browser and server events describe different products even once dedupe is fixed.
9. `AddPaymentInfo` staleness is a Shopify-checkout-side signal, not a Lovable one — it only fires when a shopper reaches payment. Six days stale means either little checkout traffic or Data Sharing is not at Maximum.

## What I will change

### 1. Event IDs and deduplication
- Add `newEventId()` to `src/lib/meta-pixel.ts` (crypto.randomUUID) and pass `{ eventID }` as the fourth argument to every `fbq('track', …)` call.
- Persist the event ID for checkout in `sessionStorage` so the Shopify-side Purchase can be matched by Meta's dedupe window where possible.

### 2. Stop leaking `fbclid` / `fbp` into the void
- Read `fbclid` from the landing URL and the `_fbp` / `_fbc` cookies, store them, and append them to the Shopify checkout URL as query params in `formatCheckoutUrl` so Shopify's CAPI can attribute the session.
- Keep the existing host rewrite and `channel=online_store` behaviour intact.

### 3. Only track on production
- Gate pixel bootstrap and all `track` calls behind a host check: fire only on `kazevo.store` (and `www.`). Preview/localhost becomes a no-op, which stops new preview domains attaching to the dataset.

### 4. Better identity on every event
- Generate a stable anonymous `external_id` in localStorage, hashed with the existing SHA-256 helper, and include it in advanced matching at init.
- Re-run `initPixel` with the known email whenever it becomes available, before subsequent events.

### 5. Fix event coverage and payloads
- Add ViewContent to `/product/$handle`.
- Remove the homepage ViewContent (keep the page clean; catalog views are not product views).
- Add `contents: [{ id, quantity, item_price }]` plus `num_items` to AddToCart, InitiateCheckout and ViewContent.
- Use the numeric Shopify variant ID for `content_ids` so browser and Shopify server events line up.

## What I cannot change from code (you must do these in dashboards)

- **Remove the 43 preview domains**: Events Manager → dataset 1382896033791262 → Settings → Connected websites/domains. The host guard prevents new ones; existing entries need manual removal.
- **Shopify Data Sharing = Maximum**: Shopify admin → Sales channels → Facebook & Instagram → Settings → Data sharing. This is what turns on server-side AddToCart / InitiateCheckout / AddPaymentInfo / Purchase.
- **Verify server events**: Events Manager → Test Events, expect "Browser • Server" once both sides fire with matching event IDs.
- **AddPaymentInfo** will resume as soon as real shoppers reach the payment step with Maximum sharing on; nothing in this codebase emits it.

## Priority order

1. Host guard (stops the dataset pollution feeding the 4.4 score)
2. Event IDs + fbclid/fbp forwarding (unlocks dedupe and CAPI coverage)
3. Shopify Data Sharing → Maximum (your action)
4. external_id + consistent identity on every event (raises EMQ on AddToCart / ViewContent / InitiateCheckout)
5. Payload fixes: `contents`, numeric IDs, ViewContent on `/product/$handle`, drop homepage ViewContent
6. Remove preview domains in Events Manager (your action)

## Optional follow-up (not in this plan)

A first-party Conversions API endpoint in this app (`/api/public/meta-capi`) that mirrors ViewContent / AddToCart / InitiateCheckout server-side with IP, user agent and hashed identity. That would push coverage well past 75% for the pre-checkout events Shopify never sees. It needs a Meta system-user access token stored as a secret — say the word and I will add it as a second phase.
