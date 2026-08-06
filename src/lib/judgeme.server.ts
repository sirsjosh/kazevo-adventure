export interface JudgeMeReview {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  reviewer: { name: string } | null;
  verified: string | boolean | null;
  created_at: string;
}

export interface ProductReviewsData {
  reviews: Array<{
    id: number;
    title: string | null;
    body: string;
    rating: number;
    author: string;
    verified: boolean;
    date: string;
  }>;
  averageRating: number;
  reviewCount: number;
}

const JUDGE_ME_API_BASE = "https://api.judge.me/api/v1";

export async function fetchJudgeMeReviewsByHandle(
  shopDomain: string,
  apiToken: string,
  handle: string
): Promise<ProductReviewsData> {
  const empty = { reviews: [], averageRating: 0, reviewCount: 0 };

  if (!shopDomain || !apiToken || !handle) return empty;

  const params = new URLSearchParams({
    shop_domain: shopDomain,
    api_token: apiToken,
    handle,
    per_page: "50",
    page: "1",
  });

  let signal: AbortSignal | undefined;
  try {
    signal = AbortSignal.timeout(8000);
  } catch {
    signal = undefined;
  }

  const fetchInit: RequestInit = signal ? { signal } : {};

  try {
    const response = await fetch(
      `${JUDGE_ME_API_BASE}/reviews?${params.toString()}`,
      fetchInit
    );

    if (!response.ok) {
      console.error(`Judge.me API error: ${response.status}`);
      return empty;
    }

    const data = (await response.json()) as { reviews?: JudgeMeReview[] } | null;
    if (!data || !Array.isArray(data.reviews)) return empty;

    const reviews = data.reviews.map((review) => ({
      id: review.id,
      title: review.title,
      body: review.body,
      rating: review.rating,
      author: review.reviewer?.name ?? "Anonymous",
      verified: review.verified === "buyer" || review.verified === true,
      date: review.created_at,
    }));

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;

    return {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount,
    };
  } catch (err) {
    console.error("Judge.me fetch failed:", err);
    return empty;
  }
}
