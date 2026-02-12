import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewList from './ReviewList';
import { Review, User } from '@/types';

// Helper function to create mock review
const createMockReview = (overrides: Partial<Review> = {}): Review => ({
  id: 'review-1',
  productId: 'product-1',
  userId: 'user-1',
  sellerId: 'seller-1',
  rating: 5,
  title: 'Great product!',
  comment: 'This is an excellent product. Highly recommended.',
  createdAt: new Date('2024-01-15'),
  helpful: 5,
  verified: true,
  ...overrides,
});

// Helper function to create mock user
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  location: { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
  createdAt: new Date('2023-01-01'),
  isVerified: true,
  isSeller: false,
  ...overrides,
});

describe('ReviewList', () => {
  describe('Display', () => {
    it('renders review with user info, rating, and comment', () => {
      const review = createMockReview();
      const user = createMockUser();

      render(<ReviewList reviews={[review]} users={[user]} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Great product!')).toBeInTheDocument();
      expect(screen.getByText('This is an excellent product. Highly recommended.')).toBeInTheDocument();
    });

    it('displays verified purchase badge for verified reviews', () => {
      const review = createMockReview({ verified: true });

      render(<ReviewList reviews={[review]} />);

      expect(screen.getByText('Verified Purchase')).toBeInTheDocument();
    });

    it('does not display verified badge for unverified reviews', () => {
      const review = createMockReview({ verified: false });

      render(<ReviewList reviews={[review]} />);

      expect(screen.queryByText('Verified Purchase')).not.toBeInTheDocument();
    });

    it('displays review date in readable format', () => {
      const review = createMockReview({ createdAt: new Date('2024-01-15') });

      render(<ReviewList reviews={[review]} />);

      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    it('displays helpful count when greater than 0', () => {
      const review = createMockReview({ helpful: 10 });

      render(<ReviewList reviews={[review]} />);

      expect(screen.getByText(/Helpful \(10\)/)).toBeInTheDocument();
    });

    it('displays helpful button without count when 0', () => {
      const review = createMockReview({ helpful: 0 });

      render(<ReviewList reviews={[review]} />);

      expect(screen.getByText('Helpful')).toBeInTheDocument();
      expect(screen.queryByText(/\(0\)/)).not.toBeInTheDocument();
    });

    it('displays user initials when user info is available', () => {
      const review = createMockReview({ userId: 'user-123' });
      const user = createMockUser({ id: 'user-123', firstName: 'Jane', lastName: 'Doe' });

      render(<ReviewList reviews={[review]} users={[user]} />);

      expect(screen.getByText('JD')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('displays generic avatar when user info is not available', () => {
      const review = createMockReview();

      render(<ReviewList reviews={[review]} users={[]} />);

      expect(screen.getByText('U')).toBeInTheDocument();
      expect(screen.getByText('Anonymous User')).toBeInTheDocument();
    });

    it('displays multiple reviews', () => {
      const reviews = [
        createMockReview({ id: 'review-1', title: 'Review 1' }),
        createMockReview({ id: 'review-2', title: 'Review 2' }),
        createMockReview({ id: 'review-3', title: 'Review 3' }),
      ];

      render(<ReviewList reviews={reviews} />);

      expect(screen.getByText('Review 1')).toBeInTheDocument();
      expect(screen.getByText('Review 2')).toBeInTheDocument();
      expect(screen.getByText('Review 3')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state message when no reviews', () => {
      render(<ReviewList reviews={[]} />);

      expect(screen.getByText(/No reviews yet/)).toBeInTheDocument();
      expect(screen.getByText(/Be the first to review this product!/)).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('displays sort dropdown when onSortChange is provided', () => {
      const review = createMockReview();
      const mockOnSortChange = jest.fn();

      render(
        <ReviewList
          reviews={[review]}
          onSortChange={mockOnSortChange}
        />
      );

      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('does not display sort dropdown when onSortChange is not provided', () => {
      const review = createMockReview();

      render(<ReviewList reviews={[review]} />);

      expect(screen.queryByLabelText('Sort by:')).not.toBeInTheDocument();
    });

    it('calls onSortChange when sort option is changed', () => {
      const review = createMockReview();
      const mockOnSortChange = jest.fn();

      render(
        <ReviewList
          reviews={[review]}
          onSortChange={mockOnSortChange}
        />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'highest' } });

      expect(mockOnSortChange).toHaveBeenCalledWith('highest');
    });

    it('sorts reviews by most recent by default', () => {
      const reviews = [
        createMockReview({ id: 'review-1', title: 'Old Review', createdAt: new Date('2024-01-01') }),
        createMockReview({ id: 'review-2', title: 'New Review', createdAt: new Date('2024-01-15') }),
      ];

      render(<ReviewList reviews={reviews} sortBy="recent" />);

      const titles = screen.getAllByRole('heading', { level: 4 });
      expect(titles[0]).toHaveTextContent('New Review');
      expect(titles[1]).toHaveTextContent('Old Review');
    });

    it('sorts reviews by highest rated', () => {
      const reviews = [
        createMockReview({ id: 'review-1', title: 'Low Rating', rating: 2 }),
        createMockReview({ id: 'review-2', title: 'High Rating', rating: 5 }),
      ];

      render(<ReviewList reviews={reviews} sortBy="highest" />);

      const titles = screen.getAllByRole('heading', { level: 4 });
      expect(titles[0]).toHaveTextContent('High Rating');
      expect(titles[1]).toHaveTextContent('Low Rating');
    });

    it('sorts reviews by most helpful', () => {
      const reviews = [
        createMockReview({ id: 'review-1', title: 'Less Helpful', helpful: 2 }),
        createMockReview({ id: 'review-2', title: 'More Helpful', helpful: 10 }),
      ];

      render(<ReviewList reviews={reviews} sortBy="helpful" />);

      const titles = screen.getAllByRole('heading', { level: 4 });
      expect(titles[0]).toHaveTextContent('More Helpful');
      expect(titles[1]).toHaveTextContent('Less Helpful');
    });

    it('displays review count', () => {
      const reviews = [
        createMockReview({ id: 'review-1' }),
        createMockReview({ id: 'review-2' }),
        createMockReview({ id: 'review-3' }),
      ];

      render(
        <ReviewList
          reviews={reviews}
          onSortChange={jest.fn()}
        />
      );

      expect(screen.getByText('3 reviews')).toBeInTheDocument();
    });

    it('displays singular "review" for single review', () => {
      const review = createMockReview();

      render(
        <ReviewList
          reviews={[review]}
          onSortChange={jest.fn()}
        />
      );

      expect(screen.getByText('1 review')).toBeInTheDocument();
    });
  });

  describe('Helpful Button', () => {
    it('calls onHelpfulClick when helpful button is clicked', () => {
      const review = createMockReview({ id: 'review-123' });
      const mockOnHelpfulClick = jest.fn();

      render(
        <ReviewList
          reviews={[review]}
          onHelpfulClick={mockOnHelpfulClick}
        />
      );

      const helpfulButton = screen.getByRole('button', { name: /Helpful/ });
      fireEvent.click(helpfulButton);

      expect(mockOnHelpfulClick).toHaveBeenCalledWith('review-123');
    });

    it('disables helpful button when onHelpfulClick is not provided', () => {
      const review = createMockReview();

      render(<ReviewList reviews={[review]} />);

      const helpfulButton = screen.getByRole('button', { name: /Helpful/ });
      expect(helpfulButton).toBeDisabled();
    });

    it('enables helpful button when onHelpfulClick is provided', () => {
      const review = createMockReview();

      render(
        <ReviewList
          reviews={[review]}
          onHelpfulClick={jest.fn()}
        />
      );

      const helpfulButton = screen.getByRole('button', { name: /Helpful/ });
      expect(helpfulButton).not.toBeDisabled();
    });
  });

  describe('Pagination', () => {
    it('displays pagination when more than 10 reviews', () => {
      const reviews = Array.from({ length: 15 }, (_, i) =>
        createMockReview({ id: `review-${i}`, title: `Review ${i}` })
      );

      render(<ReviewList reviews={reviews} />);

      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('does not display pagination when 10 or fewer reviews', () => {
      const reviews = Array.from({ length: 10 }, (_, i) =>
        createMockReview({ id: `review-${i}`, title: `Review ${i}` })
      );

      render(<ReviewList reviews={reviews} />);

      expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });

    it('displays only first 10 reviews on first page', () => {
      const reviews = Array.from({ length: 15 }, (_, i) =>
        createMockReview({ 
          id: `review-${i}`, 
          title: `Review ${i}`,
          createdAt: new Date(2024, 0, i + 1) // Incrementing dates
        })
      );

      render(<ReviewList reviews={reviews} />);

      // Should show the 10 most recent reviews (Review 14 down to Review 5)
      expect(screen.getByText('Review 14')).toBeInTheDocument();
      expect(screen.getByText('Review 5')).toBeInTheDocument();
      // Review 4 and below should not be visible on first page
      expect(screen.queryByText('Review 4')).not.toBeInTheDocument();
      expect(screen.queryByText('Review 0')).not.toBeInTheDocument();
    });

    it('navigates to next page when Next button is clicked', () => {
      const reviews = Array.from({ length: 15 }, (_, i) =>
        createMockReview({ 
          id: `review-${i}`, 
          title: `Review ${i}`,
          createdAt: new Date(2024, 0, i + 1)
        })
      );

      render(<ReviewList reviews={reviews} />);

      const nextButton = screen.getByRole('button', { name: 'Next' });
      fireEvent.click(nextButton);

      // Should now show reviews from page 2
      expect(screen.getByText('Review 4')).toBeInTheDocument();
    });

    it('disables Previous button on first page', () => {
      const reviews = Array.from({ length: 15 }, (_, i) =>
        createMockReview({ id: `review-${i}` })
      );

      render(<ReviewList reviews={reviews} />);

      const prevButton = screen.getByRole('button', { name: 'Previous' });
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button on last page', () => {
      const reviews = Array.from({ length: 15 }, (_, i) =>
        createMockReview({ id: `review-${i}` })
      );

      render(<ReviewList reviews={reviews} />);

      // Go to last page
      const nextButton = screen.getByRole('button', { name: 'Next' });
      fireEvent.click(nextButton);

      expect(nextButton).toBeDisabled();
    });

    it('displays page numbers', () => {
      const reviews = Array.from({ length: 25 }, (_, i) =>
        createMockReview({ id: `review-${i}` })
      );

      render(<ReviewList reviews={reviews} />);

      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    });

    it('highlights current page', () => {
      const reviews = Array.from({ length: 25 }, (_, i) =>
        createMockReview({ id: `review-${i}` })
      );

      render(<ReviewList reviews={reviews} />);

      const page1Button = screen.getByRole('button', { name: '1' });
      expect(page1Button).toHaveClass('bg-primary-600');
    });

    it('navigates to specific page when page number is clicked', () => {
      const reviews = Array.from({ length: 25 }, (_, i) =>
        createMockReview({ 
          id: `review-${i}`, 
          title: `Review ${i}`,
          createdAt: new Date(2024, 0, i + 1)
        })
      );

      render(<ReviewList reviews={reviews} />);

      const page2Button = screen.getByRole('button', { name: '2' });
      fireEvent.click(page2Button);

      // Should show reviews from page 2
      expect(screen.getByText('Review 14')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles review without title', () => {
      const review = createMockReview({ title: '' });

      render(<ReviewList reviews={[review]} />);

      expect(screen.queryByRole('heading', { level: 4 })).not.toBeInTheDocument();
      expect(screen.getByText('This is an excellent product. Highly recommended.')).toBeInTheDocument();
    });

    it('handles very long comments', () => {
      const longComment = 'A'.repeat(1000);
      const review = createMockReview({ comment: longComment });

      render(<ReviewList reviews={[review]} />);

      expect(screen.getByText(longComment)).toBeInTheDocument();
    });

    it('handles reviews with same timestamp', () => {
      const sameDate = new Date('2024-01-15');
      const reviews = [
        createMockReview({ id: 'review-1', title: 'Review 1', createdAt: sameDate }),
        createMockReview({ id: 'review-2', title: 'Review 2', createdAt: sameDate }),
      ];

      render(<ReviewList reviews={reviews} sortBy="recent" />);

      expect(screen.getByText('Review 1')).toBeInTheDocument();
      expect(screen.getByText('Review 2')).toBeInTheDocument();
    });
  });
});
