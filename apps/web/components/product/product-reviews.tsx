import { Star } from 'lucide-react';
import { Review } from '@unitree/types';

interface ProductReviewsProps {
  reviews?: Review[];
  avgRating?: number;
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < Math.round(rating) ? 'fill-primary text-primary' : 'text-muted'}`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ reviews = [], avgRating }: ProductReviewsProps) {
  if (!reviews.length) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Avis clients</h2>
        {avgRating && (
          <div className="flex items-center gap-2">
            <Stars rating={avgRating} size="md" />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} sur 5 ({reviews.length} avis)
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{review.authorName}</p>
                {review.verified && (
                  <span className="text-[10px] text-green-500 font-medium">Achat vérifié</span>
                )}
              </div>
              <Stars rating={review.rating} />
            </div>

            {review.title && (
              <p className="text-sm font-medium">{review.title}</p>
            )}
            {review.body && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{review.body}</p>
            )}

            <p className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
