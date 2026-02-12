'use client';

import { Review, User } from '@/types';
import RatingDisplay from './RatingDisplay';
import { ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface ReviewListProps {
  reviews: Review[];
  users?: User[];
  onHelpfulClick?: (reviewId: string) => void;
  sortBy?: 'recent' | 'highest' | 'helpful';
  onSortChange?: (sort: 'recent' | 'highest' | 'helpful') => void;
}

/**
 * ReviewList Component
 * 
 * Displays individual reviews with:
 * - User info, rating, and comment
 * - Review date and verified purchase badge
 * - "Helpful" button with count
 * - Review sorting (most recent, highest rated, most helpful)
 * - Pagination for large review lists
 * 
 * Requirements: 7.3
 */
export default function ReviewList({
  reviews,
  users = [],
  onHelpfulClick,
  sortBy = 'recent',
  onSortChange,
}: ReviewListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const reviewsPerPage = 10;

  // Set isClient to true after mount to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user info for a review
  const getUserInfo = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

  // Format date
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of reviews (check if window.scrollTo exists for test environment)
    if (isClient && typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 rounded-lg">
        <p className="text-neutral-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      {onSortChange && (
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <span className="text-sm text-neutral-600">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-reviews" className="text-sm text-neutral-600">
              Sort by:
            </label>
            <select
              id="sort-reviews"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'recent' | 'highest' | 'helpful')}
              className="text-sm border border-neutral-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {paginatedReviews.map((review) => {
          const user = getUserInfo(review.userId);
          
          return (
            <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-b-0">
              {/* User Info and Rating */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
                  </div>
                  
                  {/* User Name and Date */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">
                        {user ? `${user.firstName} ${user.lastName}` : 'Anonymous User'}
                      </span>
                      {review.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded border border-green-200">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <RatingDisplay rating={review.rating} showCount={false} size="small" />
              </div>

              {/* Review Title */}
              {review.title && (
                <h4 className="font-semibold text-neutral-900 mb-2">
                  {review.title}
                </h4>
              )}

              {/* Review Comment */}
              <p className="text-neutral-700 leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Helpful Button */}
              <button
                onClick={() => onHelpfulClick?.(review.id)}
                disabled={!onHelpfulClick}
                className={`flex items-center gap-2 text-sm ${
                  onHelpfulClick 
                    ? 'text-neutral-600 hover:text-primary-700 cursor-pointer' 
                    : 'text-neutral-400 cursor-default'
                } transition-colors`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>
                  Helpful {review.helpful > 0 && `(${review.helpful})`}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-neutral-200">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage = 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1);
              
              const showEllipsis = 
                (page === 2 && currentPage > 3) || 
                (page === totalPages - 1 && currentPage < totalPages - 2);

              if (showEllipsis) {
                return <span key={page} className="px-2 text-neutral-400">...</span>;
              }

              if (!showPage) {
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 text-sm font-medium rounded transition-colors ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
