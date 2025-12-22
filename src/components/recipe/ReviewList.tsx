'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import type { Review } from '@/types/recipe';

interface ReviewListProps {
  recipeId: string;
  avgRating: number | null;
  reviewCount: number;
  refreshTrigger?: number;
}

type SortOption = 'recent' | 'rating' | 'helpful';

const PAGE_SIZE = 5;

export function ReviewList({ recipeId, avgRating, reviewCount, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [sort, setSort] = useState<SortOption>('recent');
  const [totalCount, setTotalCount] = useState(reviewCount);

  const fetchReviews = useCallback(async (offset: number = 0, reset: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/recipes/${recipeId}/reviews?sort=${sort}&limit=${PAGE_SIZE}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      const newReviews = data.reviews as Review[];
      setTotalCount(data.totalCount);

      if (reset) {
        setReviews(newReviews);
      } else {
        setReviews((prev) => [...prev, ...newReviews]);
      }

      setHasMore(offset + newReviews.length < data.totalCount);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [recipeId, sort]);

  // Initial load and sort change
  useEffect(() => {
    fetchReviews(0, true);
  }, [fetchReviews, refreshTrigger]);

  const handleLoadMore = () => {
    fetchReviews(reviews.length);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setReviews([]);
  };

  if (totalCount === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {avgRating !== null && (
            <>
              <span className="text-3xl font-bold text-neutral-900">{avgRating.toFixed(1)}</span>
              <div>
                <StarRating rating={avgRating} size="md" />
                <p className="text-sm text-neutral-500 mt-0.5">
                  {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Sort options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Loading state */}
      {isLoading && reviews.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-neutral-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-200" />
                  <div className="h-4 w-24 bg-neutral-200 rounded" />
                </div>
                <div className="h-4 w-20 bg-neutral-200 rounded mb-3" />
                <div className="h-4 w-full bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-3/4 bg-neutral-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasMore && !isLoading && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={handleLoadMore}>
            Load more reviews
          </Button>
        </div>
      )}

      {isLoading && reviews.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" disabled isLoading>
            Loading...
          </Button>
        </div>
      )}
    </div>
  );
}
