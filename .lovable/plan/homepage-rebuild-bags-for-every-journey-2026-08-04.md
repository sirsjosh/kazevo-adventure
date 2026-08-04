# Homepage rebuild — "Bags for Every Journey"

Rework the homepage into a bold, modern ecommerce storefront using your copy, keeping the live Shopify catalog wiring intact.

## New page flow

1. **Full-bleed hero**
   - Lifestyle background image (existing hiking/outdoor shot) with a dark dopamine gradient overlay for text contrast.
   - Headline: "Bags for Every Journey"
   - Subheadline: "From daily commutes to weekend adventures – find the perfect bag for every occasion."
   - Primary CTA: "Shop Now →" pointing at the shop grid, plus a secondary "Browse collections" link.
   - Small trust strip under the CTAs: free worldwide shipping · ultralight · secure checkout.

2. **Why Kazevo — 4 columns**
   - Section title "Why Kazevo?"
   - Four cards, each with a big colour-blocked icon tile (Lucide icons matched to your emoji intent: Dumbbell/ShieldCheck, Palette, Globe, PiggyBank/Tag) and a distinct accent colour per card.
     - Premium Quality — Durable materials built to last
     - Stylish Designs — Modern designs for every style
     - Versatile Collections — Bags for every occasion
     - Affordable Prices — Quality bags at accessible prices
   - Responsive: 1 col mobile, 2 col tablet, 4 col desktop.

3. **Shop grid (kept, upgraded)**
   - Same live Shopify product listing and routing to /kazevo-mini, /kazevo-outdoor, /product/$handle.
   - Card polish: image zoom on hover, price, colour count chip, sold-out badge, "View product" button.

4. **Lifestyle marquee** — kept, retitled "Kazevo in the wild".

5. **Value/CTA band** — keeps the existing video CTA block with headline "Pack light. Go far."

6. **Footer** — unchanged.

## Removed / replaced

- Old split hero with the purple product photo, the 190g/20D stat trio, and the "Built light. Built to move." 3-feature section — replaced by the new hero and the 4-column "Why Kazevo?".
- The "Less weight. More freedom." brand-promise block is folded into the new sections to avoid repetition.

## Technical notes

- Only `src/routes/index.tsx` changes; product data, cart, and Meta Pixel logic stay as-is.
- Icons via lucide-react (no emoji glyphs, for consistent cross-platform rendering) — say the word if you'd rather keep literal emoji.
- Colours use existing semantic tokens (grape, sunset, mint, accent) — no hardcoded hex.
- Head meta title/description updated to match "Bags for Every Journey".
- Note: there is no `/products` route in the app; "Shop Now" will scroll to the on-page shop grid (`#shop`). If you want a standalone `/products` catalog page instead, I can add one.
