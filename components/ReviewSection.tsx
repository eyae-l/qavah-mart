'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Review, User } from '@/types';
import RatingDisplay from './RatingDisplay';
import RatingDistribution from './RatingDistribution';
import ReviewList from './ReviewList';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/contexts/ToastContext';

// Dynamic import for ReviewForm (only loaded when needed)
const ReviewForm = dynamic(() => import('./ReviewForm'), {
  loading: () => (
    <div className="space-y-4">
      <div className="h-10 bg-neutral-100 rounded animate-pulse"></div>
      <div className="h-32 bg-neutral-100 rounded animate-pulse"></div>
      <div className="h-10 bg-neutral-100 rounded animate-pulse"></div>
    </div>
  ),
});

export interface ReviewSectionProps {
  productId: string;
  sellerId: string;
  reviews: Review[];
  users: User[];
  averageRating: number;
}

/**
 * ReviewSection Component
 * 
 * Client component that handles review display and submission:
 * - Shows rating summary and distribution
 * - Displays review list
 * - Provides "Write a Review" button for authenticated users
 * - Handles review submission with API integration
 * - Prevents duplicate reviews
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export default function ReviewSection({
  productId,
  sellerId,
  reviews: initialReviews,
  users,
  averageRating: initialAverageRating,
}: ReviewSectionProps) {
  const { user, isAuthenticated } = useUser();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user has already reviewed this product
  const userHasReviewed = user ? reviews.some(r => r.userId === user.id) : false;

  // Handle review submission
  const handleReviewSubmit = async (reviewData: { rating: number; title: string; comment: string }) => {
    if (!user) {
      showToast('Please log in to submit a review', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        showToast('Please log in to submit a review', 'error');
        setShowReviewForm(false);
        return;
      }

      // Submit review to API
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          ...reviewData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit review');
      }

      const newReview = await response.json();

      // Add new review to the list
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);

      // Recalculate average rating
      const newAverage = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
      setAverageRating(newAverage);

      // Close form and show success message
      setShowReviewForm(false);
      showToast('Review submitted successfully!', 'success');
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to submit review. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle review form cancel
  const handleReviewCancel = () => {
    setShowReviewForm(false);
  };

  return (
    <section className="border-t border-neutral-200 pt-12 mb-12" aria-labelledby="reviews-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="reviews-heading" className="text-2xl font-bold text-neutral-900">
          Customer Reviews
        </h2>
        
        {/* Write Review Button */}
        {isAuthenticated && !userHasReviewed && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && user && (
        <div className="mb-8 p-6 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Write Your Review
          </h3>
          <ReviewForm
            productId={productId}
            sellerId={sellerId}
            userId={user.id}
            onSubmit={handleReviewSubmit}
            onCancel={handleReviewCancel}
          />
        </div>
      )}

      {/* User Already Reviewed Message */}
      {isAuthenticated && userHasReviewed && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            You have already reviewed this product. Thank you for your feedback!
          </p>
        </div>
      )}

      {/* Not Authenticated Message */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <p className="text-sm text-neutral-700">
            Please{' '}
            <a href="/user/login" className="text-primary-600 hover:text-primary-700 font-medium">
              log in
            </a>
            {' '}to write a review.
          </p>
        </div>
      )}
      
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Rating Summary */}
          <aside className="lg:col-span-1" aria-labelledby="rating-summary-heading">
            <h3 id="rating-summary-heading" className="sr-only">Rating Summary</h3>
            <div className="bg-neutral-50 rounded-lg p-6">
              {/* Average Rating */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-neutral-900 mb-2" aria-label={`Average rating: ${averageRating.toFixed(1)} out of 5`}>
                  {averageRating.toFixed(1)}
                </div>
                <RatingDisplay
                  rating={averageRating}
                  reviewCount={reviews.length}
                  size="large"
                />
                <p className="text-sm text-neutral-600 mt-2">
                  Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
              
              {/* Rating Distribution */}
              <div className="border-t border-neutral-200 pt-6">
                <h4 className="text-sm font-semibold text-neutral-900 mb-4">
                  Rating Breakdown
                </h4>
                <RatingDistribution reviews={reviews} />
              </div>
            </div>
          </aside>
          
          {/* Right Column - Review List */}
          <div className="lg:col-span-2">
            <ReviewList
              reviews={reviews}
              users={users}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <p className="text-neutral-600 mb-4">
            No reviews yet for this product.
          </p>
          <p className="text-sm text-neutral-500">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </section>
  );
}
