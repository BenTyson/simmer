'use client';

import { useState } from 'react';
import { StarInput } from '@/components/ui/StarInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  recipeId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ recipeId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!authorName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/recipes/${recipeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName.trim(),
          rating,
          title: title.trim() || null,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      // Success
      setIsSuccess(true);
      setRating(0);
      setAuthorName('');
      setTitle('');
      setComment('');
      onReviewSubmitted?.();

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-800 mb-1">Thank you!</h3>
          <p className="text-green-600">Your review has been submitted.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <StarInput value={rating} onChange={setRating} />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-neutral-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="authorName"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="John Doe"
              maxLength={100}
            />
          </div>

          {/* Title (optional) */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Review Title <span className="text-neutral-400">(optional)</span>
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Great recipe!"
              maxLength={200}
            />
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-1">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think of this recipe?"
              rows={4}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
            />
            <p className="mt-1 text-xs text-neutral-500">
              {comment.length}/10 minimum characters
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
