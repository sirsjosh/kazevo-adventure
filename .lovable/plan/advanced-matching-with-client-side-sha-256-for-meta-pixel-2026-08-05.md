# Advanced Matching with client-side SHA-256 for Meta Pixel

Today the pixel is initialised in an inline script in the root layout with no user data, and `setAdvancedMatching` in `src/lib/meta-pixel.ts` sends raw (lowercased) email to Meta. This change hashes all identity fields in the browser before they ever leave the page, and routes every init through one helper.

## What changes

### 1. Hashing + `initPixel` in the pixel module (`src/lib/meta-pixel.ts`)

- Add `sha256Hex(value)` using `crypto.subtle.digest("SHA-256", ...)`, returning lowercase hex. Falls back to skipping the field if `crypto.subtle` is unavailable (non-HTTPS contexts).
- Add a normaliser per Meta's rules before hashing: trim, lowercase, strip whitespace; phone reduced to digits (E.164-style, no `+`); zip trimmed/lowercased; country as 2-letter lowercase code.
- Add `initPixel(userData?)` — async, accepts any subset of the standard keys `em, ph, fn, ln, ct, st, zp, country`, hashes each present value, then calls `window.fbq('init', pixelId, hashedUserData)`.
- Rewrite `setAdvancedMatching` to delegate to `initPixel` so the discount popup now sends a hashed email instead of a raw one. It keeps its current call signature so `DiscountPopup` needs no change.

### 2. Root layout initialisation (`src/routes/__root.tsx`)

- The inline script keeps only the fbq bootstrap loader (defining `window.fbq` and injecting `fbevents.js`) — the `init` and `PageView` calls move out of it, because hashing is async and must finish first.
- A small client component (`MetaPixelTracker`, already mounted) runs on mount: builds an optional `userData` object, awaits `initPixel(userData)`, then immediately fires `fbq('track', 'PageView')`. Route-change PageViews continue as they do now.
- The `userData` object sits in one clearly marked block in `MetaPixelTracker` with a comment showing where to plug in a logged-in user's email/phone/name — currently it reads a known-customer record from `localStorage` (written when someone submits the discount popup email) and is otherwise empty.

### 3. Remember the visitor's email

- When the discount popup captures an email, store it alongside the existing claim flag so later page loads can initialise the pixel with matching data from the very first event, not just the session where the email was typed.

## Notes

- Meta expects SHA-256 hex for advanced matching; sending hashed values is equivalent for match quality and safer for privacy.
- No server/database changes; no visual changes to the site.
