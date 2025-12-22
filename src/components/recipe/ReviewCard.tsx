import { StarRating } from '@/components/ui/StarRating';
import { Card, CardContent } from '@/components/ui/Card';
import type { Review } from '@/types/recipe';

interface ReviewCardProps {
  review: Review;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="hover:shadow-none">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Author and date */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600">
                  {review.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{review.authorName}</p>
                <p className="text-xs text-neutral-500">{formatDate(review.createdAt)}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-3">
              <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Title */}
            {review.title && (
              <h4 className="font-semibold text-neutral-900 mb-2">{review.title}</h4>
            )}

            {/* Comment */}
            <p className="text-neutral-600 text-sm leading-relaxed">{review.comment}</p>

            {/* Helpful count */}
            {review.helpfulCount > 0 && (
              <p className="mt-3 text-xs text-neutral-500">
                {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
