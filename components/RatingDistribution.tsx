'use client';

import { Review } from '@/types';

export interface RatingDistributionProps {
  reviews: Review[];
  onFilterByRating?: (rating: number | null) => void;
  selectedRating?: number | null;
}

/**
 * RatingDistribution Component
 * 
 * Displays rating breakdown with percentage bars:
 * - Shows count for each rating level (5-star to 1-star)
 * - Displays percentage bars for visual representation
 * - Interactive filtering by rating level
 * 
 * Requirements: 7.2
 */
export default function RatingDistribution({
  reviews,
  onFilterByRating,
  selectedRating = null,
}: RatingDistributionProps) {
  // Calculate rating distribution
  const distribution = reviews.reduce((acc, review) => {
    const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<1 | 2 | 3 | 4 | 5, number>);

  const totalReviews = reviews.length;

  // Get count for each rating level
  const getRatingCount = (rating: number): number => {
    return distribution[rating as 1 | 2 | 3 | 4 | 5] || 0;
  };

  // Calculate percentage for each rating level
  const getRatingPercentage = (rating: number): number => {
    if (totalReviews === 0) return 0;
    return (getRatingCount(rating) / totalReviews) * 100;
  };

  // Handle rating filter click
  const handleRatingClick = (rating: number) => {
    if (!onFilterByRating) return;
    
    // Toggle: if already selected, clear filter; otherwise set new filter
    if (selectedRating === rating) {
      onFilterByRating(null);
    } else {
      onFilterByRating(rating);
    }
  };

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = getRatingCount(rating);
        const percentage = getRatingPercentage(rating);
        const isSelected = selectedRating === rating;
        const isInteractive = onFilterByRating !== undefined;

        return (
          <button
            key={rating}
            onClick={() => handleRatingClick(rating)}
            disabled={!isInteractive}
            className={`w-full flex items-center gap-3 text-sm ${
              isInteractive ? 'cursor-pointer hover:bg-neutral-50' : 'cursor-default'
            } ${isSelected ? 'bg-primary-50' : ''} p-2 rounded transition-colors`}
          >
            {/* Rating label */}
            <span className="flex items-center gap-1 w-12 text-neutral-700">
              <span className="font-medium">{rating}</span>
              <svg
                className="w-3 h-3 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>

            {/* Percentage bar */}
            <div className="flex-1 h-4 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  isSelected ? 'bg-primary-600' : 'bg-primary-500'
                } transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Count */}
            <span className="w-12 text-right text-neutral-600">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
