import { Star } from "lucide-react";

interface Review {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  author: string;
  verified: boolean;
  date: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= Math.round(rating)
              ? "fill-sunset text-sunset"
              : "text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

export function ProductReviews({ reviews, averageRating, reviewCount }: ProductReviewsProps) {
  if (reviewCount === 0) {
    return (
      <section className="mx-auto max-w-4xl px-5 pb-16 md:pb-24">
        <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Customer Reviews
        </h2>
        <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 pb-16 md:pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          Customer Reviews
        </h2>
        <div className="flex items-center gap-3">
          <StarRating rating={averageRating} />
          <span className="text-sm text-muted-foreground">
            {averageRating.toFixed(1)} out of 5 ({reviewCount}{" "}
            {reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-3xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{review.author}</p>
                {review.verified && (
                  <span className="inline-flex items-center rounded-full bg-mint/25 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    Verified buyer
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
            </div>
            <div className="mt-2">
              <StarRating rating={review.rating} />
            </div>
            {review.title && (
              <h3 className="mt-3 font-display text-lg font-bold">{review.title}</h3>
            )}
            {review.body && <p className="mt-2 text-muted-foreground">{review.body}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
