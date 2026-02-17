'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { ReviewFormData } from '@/types';

export interface ReviewFormProps {
  productId: string;
  sellerId: string;
  userId: string;
  onSubmit: (review: ReviewFormData) => void;
  onCancel: () => void;
}

/**
 * ReviewForm Component
 * 
 * Implements review submission form with:
 * - Rating selector (1-5 stars)
 * - Title and comment text inputs
 * - Form validation
 * - Character count for comment
 * 
 * Requirements: 7.1
 */
export default function ReviewForm({
  productId,
  sellerId,
  userId,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxCommentLength = 1000;
  const minCommentLength = 10;

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!title.trim()) {
      newErrors.title = 'Please enter a title for your review';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please enter your review';
    } else if (comment.trim().length < minCommentLength) {
      newErrors.comment = `Review must be at least ${minCommentLength} characters`;
    } else if (comment.trim().length > maxCommentLength) {
      newErrors.comment = `Review must be less than ${maxCommentLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: ReviewFormData = {
        rating,
        title: title.trim(),
        comment: comment.trim(),
      };

      await onSubmit(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle rating click
  const handleRatingClick = (value: number) => {
    setRating(value);
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating Selector */}
      <div>
        <label className="block text-sm font-medium text-neutral-900 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRatingClick(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              aria-label={`Rate ${value} stars`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  value <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-neutral-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-neutral-600">
              {rating} {rating === 1 ? 'star' : 'stars'}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      {/* Review Title */}
      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-neutral-900 mb-2">
          Review Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="review-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors({ ...errors, title: '' });
            }
          }}
          placeholder="Summarize your experience"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.title ? 'border-red-500' : 'border-neutral-300'
          }`}
          maxLength={100}
        />
        <div className="mt-1 flex justify-between items-center">
          {errors.title ? (
            <p className="text-sm text-red-600">{errors.title}</p>
          ) : (
            <p className="text-sm text-neutral-500">
              Give your review a short, descriptive title
            </p>
          )}
          <span className="text-xs text-neutral-400">{title.length}/100</span>
        </div>
      </div>

      {/* Review Comment */}
      <div>
        <label htmlFor="review-comment" className="block text-sm font-medium text-neutral-900 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (errors.comment) {
              setErrors({ ...errors, comment: '' });
            }
          }}
          placeholder="Share your experience with this product..."
          rows={6}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
            errors.comment ? 'border-red-500' : 'border-neutral-300'
          }`}
          maxLength={maxCommentLength}
        />
        <div className="mt-1 flex justify-between items-center">
          {errors.comment ? (
            <p className="text-sm text-red-600">{errors.comment}</p>
          ) : (
            <p className="text-sm text-neutral-500">
              Minimum {minCommentLength} characters
            </p>
          )}
          <span className={`text-xs ${
            comment.length > maxCommentLength * 0.9 ? 'text-orange-500' : 'text-neutral-400'
          }`}>
            {comment.length}/{maxCommentLength}
          </span>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
