# Judge.me Review-Request Status Check

Goal: Give the store owner a quick, code-based way to verify whether Judge.me review requests are producing reviews, since the Judge.me public API does not expose a direct "sent emails" log.

## Research Finding

The Judge.me REST API (v1) has these relevant endpoints:
- `GET /api/v1/reviews` — lists published reviews (already used by the storefront).
- `POST /api/v1/orders/send_manual_review_request` — triggers a manual review request email.
- `GET /api/v1/products/-1` — resolves a Shopify handle to an internal Judge.me product id.

There is **no public endpoint** that returns review-request email history or a "sent" flag. The authoritative place for that is the Judge.me app dashboard inside Shopify admin (Review Requests / Requests History).

## What We Can Build Instead

A lightweight status check that acts as a proxy:
- Pull the latest Judge.me reviews for each product (or all products).
- Surface review count, average rating, first review date, and most recent review date.
- If reviews exist and are recent, review requests are almost certainly being sent and customers are responding.
- If no reviews exist, requests may not be sent, customers may be ignoring them, or the product has no orders yet.

## Implementation

### 1. Server function: fetch review status

File: `src/lib/judgeme.functions.ts`

Add `getJudgeMeReviewStatus({ data: { handle?: string } })`:
- Reuses the existing `fetchJudgeMeReviewsByHandle` helper.
- If no `handle` is provided, call the Judge.me `/reviews` endpoint without a product filter to get store-wide reviews.
- Returns a typed DTO:
  ```ts
  {
    handle?: string;
    reviewCount: number;
    averageRating: number;
    firstReviewDate: string | null;
    lastReviewDate: string | null;
    reviews: Array<{ id; author; rating; date; title?; body? }>;
  }
  ```
- On any API failure, return the same shape with zeros/nulls so the UI never crashes.
- Set `Cache-Control: public, max-age=300` (5 minutes) because this is public, non-personal data.

### 2. New server-only helper for store-wide reviews

File: `src/lib/judgeme.server.ts`

Add `fetchJudgeMeStoreReviews(shopDomain, apiToken)`:
- Calls `GET https://api.judge.me/api/v1/reviews?shop_domain=...&api_token=...&per_page=50&page=1`.
- Maps the response to the same review DTO used by `fetchJudgeMeReviewsByHandle`.
- Returns the same `{ reviews, averageRating, reviewCount }` shape.

### 3. Admin/status UI route

File: `src/routes/admin/review-status.tsx`

Create a simple, read-only status page:
- Loader calls `getJudgeMeReviewStatus({ data: {} })` for store-wide data.
- Displays:
  - Total published reviews
  - Average rating
  - Date of first review
  - Date of most recent review
  - A short table of the 10 most recent reviews (product handle, author, rating, date)
- Add a note: “This shows published reviews, not the Judge.me email send log. For exact send history, open the Judge.me app in Shopify admin.”
- Keep the route unauthenticated for now (it only reads public review data), but guard it if it later includes order counts or PII.

### 4. Optional per-product status on existing product pages

File: `src/components/ProductReviews.tsx` (or `ProductPageTemplate.tsx`)

- The product page already loads reviews. No extra work is needed there; the presence of reviews on the page is the per-product signal.

## Out of Scope

- Fetching Shopify order counts to compare against reviews. The Shopify connection currently has no valid admin token, and the Storefront API cannot read orders.
- Building a custom email-send log. Judge.me owns that data; the public API does not expose it.
- Automatically triggering manual review requests. That requires order IDs and email addresses and is better handled inside the Judge.me dashboard.

## Verification

- Typecheck passes (`bunx tsc --noEmit`).
- Build passes.
- The `/admin/review-status` page loads and shows the latest review data.
- If no reviews exist, the page shows a clear empty state instead of an error.
