# Judge.me Reviews Integration Plan

Add real Judge.me product reviews to every product page on the kazevo storefront.

## 1. Judge.me Setup on Shopify

Before any code changes, configure Judge.me in the Shopify admin:

- Install the **Judge.me Product Reviews** app from the Shopify App Store.
- Complete onboarding so it is attached to the store (`bsctke-ju.myshopify.com`).
- Enable review collection (email requests after purchase) so real reviews begin accumulating.
- In Judge.me settings, locate the **API Token** (or Private API Token). This is required for server-side fetching.
- Store the token securely via Lovable Secrets as `JUDGE_ME_API_TOKEN` so it is available to server functions.

No fake or generated review content will be created. The UI will only display data returned by Judge.me; an empty state will show when no reviews exist.

## 2. Server-Side Judge.me Client

Create a thin, server-only wrapper that calls Judge.me’s REST API.

- File: `src/lib/judgeme.server.ts`
- Responsibilities:
  - Read `JUDGE_ME_API_TOKEN` and the Shopify shop domain from environment variables inside handlers.
  - Provide `fetchJudgeMeReviews(shopifyProductId: string)` and `fetchJudgeMeReviewsByHandle(handle: string)`.
  - Call Judge.me endpoints such as `/api/v1/reviews` with the public token and `shop_domain`/`product_handle` params.
  - Map the response to a stable DTO: `{ rating: number; author: string; body: string; date: string; verified: boolean; title?: string }[]` plus `averageRating` and `reviewCount`.
  - Return typed fallback `{ reviews: [], averageRating: 0, reviewCount: 0 }` on any failure so the page never crashes.

## 3. Server Function for Product Pages

Create a client-safe server function that pages can import.

- File: `src/lib/judgeme.functions.ts`
- Export `getProductReviews(productHandle: string)` using `createServerFn({ method: "GET" })`.
- The handler calls the server-only helper from `src/lib/judgeme.server.ts` and returns the DTO.
- Keep the file a thin wrapper — no runtime helpers at module scope.

## 4. Reviews UI Component

Build a reusable, theme-matching reviews block.

- File: `src/components/ProductReviews.tsx`
- Props: `reviews`, `averageRating`, `reviewCount`.
- Visual design:
  - Star rating display using filled/empty stars.
  - Average score and total count headline.
  - Review cards: author, date, star rating, optional title, review body.
  - Empty state: "No reviews yet. Be the first to review this product."
- Accessibility: proper `aria-label` on star ratings, semantic list markup.
- No hardcoded colors — use theme tokens (grape, sunset, mint, foreground, muted-foreground, card, border).

## 5. Integrate Reviews Into All Product Pages

Add the reviews block to every product detail route:

- `src/routes/kazevo-mini.tsx`
- `src/routes/kazevo-outdoor.tsx`
- `src/routes/product/$handle.tsx`

For each route:
- Call `getProductReviews(productHandle)` from the route `loader`.
- Pass the result to `<ProductReviews />` near the bottom of the page, above the FAQ or footer.
- Update route `head()` JSON-LD to include `aggregateRating` (schema.org) when `reviewCount > 0`.

## 6. Structured Data & SEO

When reviews exist:
- Inject `aggregateRating` into the existing Product JSON-LD:
  ```json
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "<average>",
    "reviewCount": "<count>"
  }
  ```
- Keep `reviewCount` and `averageRating` server-rendered so SEO crawlers see them.

## 7. Caching & Performance

- Add a short cache header inside the server function (`setResponseHeader("Cache-Control", "public, max-age=60")`) so repeated page loads do not hammer Judge.me.
- Reviews are non-critical, so render them below the fold without blocking the hero/add-to-cart.

## 8. Testing

- Verify Judge.me token is saved in project secrets.
- Confirm reviews load on `/kazevo-mini`, `/kazevo-outdoor`, and a generic `/product/$handle` route.
- Confirm empty state renders when no reviews exist.
- Validate Product JSON-LD includes `aggregateRating` only when reviews are present.
- Run a production build to ensure the server function and client component split correctly.
