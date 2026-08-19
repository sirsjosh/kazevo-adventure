import { createFileRoute } from "@tanstack/react-router";

import { ProductPageTemplate } from "@/components/ProductPageTemplate";
import { getProductReviews } from "@/lib/judgeme.functions";
import type { ProductReviewsData } from "@/lib/judgeme.server";
import { buildProductHead, productPages } from "@/lib/productContent";
import { detectCountry } from "@/lib/market";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";

const content = productPages["clear-pvc-backpack"];

export const Route = createFileRoute("/clear-pvc-backpack")({
  head: ({ loaderData }) =>
    buildProductHead(
      content,
      (loaderData as { reviews?: ProductReviewsData } | undefined)?.reviews,
    ),
  loader: async () => {
    try {
      const countryCode = await detectCountry();
      const products = await fetchShopifyProducts("*", 50, countryCode);
      const reviews = await getProductReviews({ data: { handle: content.handle } });
      return { products, reviews, countryCode };
    } catch (err) {
      console.error("Shopify products fetch failed:", err);
      return {
        products: [] as ShopifyProduct[],
        reviews: { reviews: [], averageRating: 0, reviewCount: 0 } as ProductReviewsData,
      };
    }
  },
  errorComponent: () => null,
  component: ProductRoutePage,
});

function ProductRoutePage() {
  const { products, reviews } = Route.useLoaderData() as {
    products: ShopifyProduct[];
    reviews: ProductReviewsData;
  };
  return <ProductPageTemplate content={content} products={products} reviews={reviews} />;
}
