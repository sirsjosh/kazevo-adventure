# Plan: Automatic Market & Currency Switching for Shopify Markets

## Goal
Make the site automatically detect the shopper's country, show prices in their local Shopify market currency, and let them override the country with a manual selector. Keep the existing cart and checkout flow intact.

## Current State
- `src/lib/shopify.ts` calls the Storefront API without any `country` or `buyerIdentity` localization parameters, so every visitor sees the store's default currency.
- `src/stores/cartStore.ts` hardcodes Meta Pixel currency as `"USD"` and creates carts without a buyer country.
- `src/routes/index.tsx` fetches products once on load and refreshes client-side, but never passes a country.
- There is no country/currency selector in the UI.

## What Will Change

### 1. Country detection & persistence
- Create `src/lib/market.ts` with:
  - A list of supported Shopify market countries and their display labels/currencies.
  - A server function `detectCountry()` that reads `CF-IPCountry` / `Cloudflare-IPCountry` / `Accept-Language` headers and returns a country code.
  - A client helper to read/write the selected country from a cookie (`kazevo_country`) so SSR and client agree.
- Default fallback to `"US"` when detection fails.

### 2. Storefront API localization
- Update `src/lib/shopify.ts`:
  - Add an optional `countryCode` argument to `storefrontApiRequest`, `fetchShopifyProducts`, `fetchShopifyProductByHandle`, and cart mutations.
  - Pass `country: $countryCode` to `products` and `product` queries.
  - Pass `buyerIdentity: { countryCode: $countryCode }` to `cartCreate` so the checkout currency matches the browsing currency.
  - Add `Accept-Language` header based on the country code.

### 3. Market context & selector
- Create `src/components/CountrySelector.tsx`: a small dropdown in the header that shows the current country flag/label and lets the shopper pick another supported market.
- Create a lightweight `MarketProvider` in `src/routes/__root.tsx` (or a new `src/components/MarketProvider.tsx`) that:
  - Reads the detected country from the loader.
  - Stores the shopper's override in a cookie.
  - Exposes `countryCode` and `setCountryCode` to child components.
- Add the selector to the sticky header in `src/routes/index.tsx` and to `src/routes/__root.tsx` so it is available on product pages.

### 4. Wire country into data fetching
- `src/routes/index.tsx`: pass `countryCode` to `fetchShopifyProducts` in both loader and client-side refresh.
- `src/routes/product/$handle.tsx`, `src/routes/kazevo-mini.tsx`, `src/routes/kazevo-outdoor.tsx`, `src/routes/kazevo-sling.tsx`, and other dedicated product routes: pass `countryCode` to `fetchShopifyProductByHandle`.
- `src/components/ProductPageTemplate.tsx`: accept `countryCode` and use it for Shopify queries.

### 5. Cart & checkout currency consistency
- Update `src/stores/cartStore.ts`:
  - Read the current `countryCode` from the market context/cookie when creating or adding to a cart.
  - Use the variant's returned `currencyCode` for Meta Pixel events instead of hardcoded `"USD"`.
  - When the shopper changes country, invalidate the existing Shopify cart (currency cannot switch mid-cart) and clear local cart state so a new cart is created in the new currency.

### 6. Price formatting
- Update `src/lib/variantImages.ts` `formatUsd` (or add a new `formatMoney` helper) to format amounts using the currency code returned by Shopify, e.g. `Intl.NumberFormat(locale, { style: 'currency', currency })`.
- Replace all hardcoded USD formatting in product cards and product pages with the new helper.

## Files to Modify
- `src/lib/shopify.ts`
- `src/lib/market.ts` (new)
- `src/lib/variantImages.ts`
- `src/stores/cartStore.ts`
- `src/components/CountrySelector.tsx` (new)
- `src/components/MarketProvider.tsx` (new, or inline in `__root.tsx`)
- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/product/$handle.tsx`
- `src/routes/kazevo-mini.tsx`
- `src/routes/kazevo-outdoor.tsx`
- `src/routes/kazevo-sling.tsx`
- Other dedicated product routes that fetch Shopify data

## Verification
- Visit the preview from different country contexts (or override the cookie) and confirm prices/currency update.
- Add a product to cart, change country, and confirm the cart resets and the new cart uses the new currency.
- Confirm checkout URL opens in the selected market currency.
