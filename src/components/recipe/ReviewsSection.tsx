'use client';

import { useState } from 'react';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';

interface ReviewsSectionProps {
  recipeId: string;
  avgRating: number | null;
  reviewCount: number;
}

export function ReviewsSection({ recipeId, avgRating, reviewCount }: ReviewsSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    // Trigger a refresh of the reviews list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <section className="mt-12 pt-8 border-t border-neutral-200">
      <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
        Reviews
      </h2>

      {/* Review Form */}
      <div className="mb-8">
        <ReviewForm recipeId={recipeId} onReviewSubmitted={handleReviewSubmitted} />
      </div>

      {/* Reviews List */}
      <ReviewList
        recipeId={recipeId}
        avgRating={avgRating}
        reviewCount={reviewCount}
        refreshTrigger={refreshTrigger}
      />
    </section>
  );
}
