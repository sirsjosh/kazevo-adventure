import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

import {
  fetchJudgeMeReviewsByHandle,
  type ProductReviewsData,
} from "./judgeme.server";

export const getProductReviews = createServerFn({ method: "GET" })
  .inputValidator((data: { handle: string }) => data)
  .handler(async ({ data }): Promise<ProductReviewsData> => {
    const shopDomain = process.env["SHOPIFY_STORE_PERMANENT_DOMAIN"];
    const apiToken = process.env["JUDGE_ME_API_TOKEN"];

    if (!shopDomain || !apiToken) {
      return { reviews: [], averageRating: 0, reviewCount: 0 };
    }

    const result = await fetchJudgeMeReviewsByHandle(shopDomain, apiToken, data.handle);

    setResponseHeader("Cache-Control", "public, max-age=60");

    return result;
  });
