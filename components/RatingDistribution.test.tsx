import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RatingDistribution from './RatingDistribution';
import { Review } from '@/types';

// Helper function to create mock reviews
const createMockReview = (rating: number, id: string): Review => ({
  id,
  productId: 'product-1',
  userId: `user-${id}`,
  sellerId: 'seller-1',
  rating,
  title: `Review ${id}`,
  comment: `This is review ${id}`,
  createdAt: new Date(),
  helpful: 0,
  verified: true,
});

describe('RatingDistribution', () => {
  describe('Display', () => {
    it('renders all 5 rating levels', () => {
      const reviews: Review[] = [
        createMockReview(5, '1'),
        createMockReview(4, '2'),
      ];

      render(<RatingDistribution reviews={reviews} />);

      // Check that all 5 buttons are rendered (one for each rating level)
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
      
      // Verify rating labels are present
      expect(buttons[0]).toHaveTextContent('5');
      expect(buttons[1]).toHaveTextContent('4');
      expect(buttons[2]).toHaveTextContent('3');
      expect(buttons[3]).toHaveTextContent('2');
      expect(buttons[4]).toHaveTextContent('1');
    });

    it('displays correct counts for each rating level', () => {
      const reviews: Review[] = [
        createMockReview(5, '1'),
        createMockReview(5, '2'),
        createMockReview(5, '3'),
        createMockReview(4, '4'),
        createMockReview(4, '5'),
        createMockReview(3, '6'),
      ];

      render(<RatingDistribution reviews={reviews} />);

      const buttons = screen.getAllByRole('button');
      
      // 5-star: 3 reviews
      expect(buttons[0]).toHaveTextContent('3');
      // 4-star: 2 reviews
      expect(buttons[1]).toHaveTextContent('2');
      // 3-star: 1 review
      expect(buttons[2]).toHaveTextContent('1');
      // 2-star: 0 reviews
      expect(buttons[3]).toHaveTextContent('0');
      // 1-star: 0 reviews
      expect(buttons[4]).toHaveTextContent('0');
    });

    it('handles empty reviews array', () => {
      render(<RatingDistribution reviews={[]} />);

      const buttons = screen.getAllByRole('button');
      
      // All counts should be 0
      buttons.forEach(button => {
        expect(button).toHaveTextContent('0');
      });
    });

    it('displays star icons for each rating level', () => {
      const reviews: Review[] = [createMockReview(5, '1')];

      const { container } = render(<RatingDistribution reviews={reviews} />);

      // Check for star SVG elements (5 rating levels = 5 stars)
      const stars = container.querySelectorAll('svg');
      expect(stars.length).toBe(5);
    });
  });

  describe('Percentage Calculation', () => {
    it('calculates correct percentages for rating distribution', () => {
      const reviews: Review[] = [
        createMockReview(5, '1'),
        createMockReview(5, '2'),
        createMockReview(4, '3'),
        createMockReview(3, '4'),
      ];

      const { container } = render(<RatingDistribution reviews={reviews} />);

      const bars = container.querySelectorAll('[style*="width"]');
      
      // 5-star: 2/4 = 50%
      expect(bars[0]).toHaveStyle({ width: '50%' });
      // 4-star: 1/4 = 25%
      expect(bars[1]).toHaveStyle({ width: '25%' });
      // 3-star: 1/4 = 25%
      expect(bars[2]).toHaveStyle({ width: '25%' });
      // 2-star: 0/4 = 0%
      expect(bars[3]).toHaveStyle({ width: '0%' });
      // 1-star: 0/4 = 0%
      expect(bars[4]).toHaveStyle({ width: '0%' });
    });

    it('handles 100% for single rating', () => {
      const reviews: Review[] = [
        createMockReview(5, '1'),
        createMockReview(5, '2'),
        createMockReview(5, '3'),
      ];

      const { container } = render(<RatingDistribution reviews={reviews} />);

      const bars = container.querySelectorAll('[style*="width"]');
      
      // 5-star: 3/3 = 100%
      expect(bars[0]).toHaveStyle({ width: '100%' });
    });

    it('rounds ratings to nearest integer for distribution', () => {
      const reviews: Review[] = [
        createMockReview(4.7, '1'), // rounds to 5
        createMockReview(4.3, '2'), // rounds to 4
        createMockReview(3.5, '3'), // rounds to 4
      ];

      render(<RatingDistribution reviews={reviews} />);

      const buttons = screen.getAllByRole('button');
      
      // 5-star: 1 review (4.7 rounded)
      expect(buttons[0]).toHaveTextContent('1');
      // 4-star: 2 reviews (4.3 and 3.5 rounded)
      expect(buttons[1]).toHaveTextContent('2');
    });
  });

  describe('Interactive Filtering', () => {
    it('calls onFilterByRating when rating is clicked', () => {
      const mockOnFilter = jest.fn();
      const reviews: Review[] = [
        createMockReview(5, '1'),
        createMockReview(4, '2'),
      ];

      render(
        <RatingDistribution
          reviews={reviews}
          onFilterByRating={mockOnFilter}
        />
      );

      const buttons = screen.getAllByRole('button');
      
      // Click 5-star rating
      fireEvent.click(buttons[0]);
      expect(mockOnFilter).toHaveBeenCalledWith(5);
    });

    it('toggles filter when same rating is clicked twice', () => {
      const mockOnFilter = jest.fn();
      const reviews: Review[] = [createMockReview(5, '1')];

      render(
        <RatingDistribution
          reviews={reviews}
          onFilterByRating={mockOnFilter}
          selectedRating={5}
        />
      );

      const buttons = screen.getAllByRole('button');
      
      // Click already selected 5-star rating
      fireEvent.click(buttons[0]);
      expect(mockOnFilter).toHaveBeenCalledWith(null);
    });

    it('highlights selected rating', () => {
      const reviews: Review[] = [
        createMockReview(5, '1'),
        createMockReview(4, '2'),
      ];

      render(
        <RatingDistribution
          reviews={reviews}
          onFilterByRating={jest.fn()}
          selectedRating={5}
        />
      );

      const buttons = screen.getAllByRole('button');
      
      // 5-star button should have selected styling
      expect(buttons[0]).toHaveClass('bg-primary-50');
      // Other buttons should not
      expect(buttons[1]).not.toHaveClass('bg-primary-50');
    });

    it('does not call onFilterByRating when not provided', () => {
      const reviews: Review[] = [createMockReview(5, '1')];

      render(<RatingDistribution reviews={reviews} />);

      const buttons = screen.getAllByRole('button');
      
      // Should not throw error when clicked
      expect(() => fireEvent.click(buttons[0])).not.toThrow();
    });

    it('disables buttons when onFilterByRating is not provided', () => {
      const reviews: Review[] = [createMockReview(5, '1')];

      render(<RatingDistribution reviews={reviews} />);

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('enables buttons when onFilterByRating is provided', () => {
      const reviews: Review[] = [createMockReview(5, '1')];

      render(
        <RatingDistribution
          reviews={reviews}
          onFilterByRating={jest.fn()}
        />
      );

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Visual Styling', () => {
    it('applies hover effect when interactive', () => {
      const reviews: Review[] = [createMockReview(5, '1')];

      render(
        <RatingDistribution
          reviews={reviews}
          onFilterByRating={jest.fn()}
        />
      );

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toHaveClass('hover:bg-neutral-50');
      });
    });

    it('does not apply hover effect when not interactive', () => {
      const reviews: Review[] = [createMockReview(5, '1')];

      render(<RatingDistribution reviews={reviews} />);

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).not.toHaveClass('hover:bg-neutral-50');
      });
    });

    it('uses brown theme colors', () => {
      const reviews: Review[] = [createMockReview(5, '1')];

      const { container } = render(
        <RatingDistribution
          reviews={reviews}
          onFilterByRating={jest.fn()}
          selectedRating={5}
        />
      );

      // Check for primary color classes (brown theme)
      expect(container.querySelector('.bg-primary-50')).toBeInTheDocument();
      expect(container.querySelector('.bg-primary-600')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single review', () => {
      const reviews: Review[] = [createMockReview(5, '1')];

      render(<RatingDistribution reviews={reviews} />);

      const buttons = screen.getAllByRole('button');
      
      // Only 5-star should have count of 1
      expect(buttons[0]).toHaveTextContent('1');
      expect(buttons[1]).toHaveTextContent('0');
      expect(buttons[2]).toHaveTextContent('0');
      expect(buttons[3]).toHaveTextContent('0');
      expect(buttons[4]).toHaveTextContent('0');
    });

    it('handles large number of reviews', () => {
      const reviews: Review[] = Array.from({ length: 1000 }, (_, i) =>
        createMockReview((i % 5) + 1, `review-${i}`)
      );

      render(<RatingDistribution reviews={reviews} />);

      const buttons = screen.getAllByRole('button');
      
      // Each rating should have 200 reviews (1000 / 5)
      buttons.forEach(button => {
        expect(button).toHaveTextContent('200');
      });
    });

    it('handles all reviews with same rating', () => {
      const reviews: Review[] = [
        createMockReview(3, '1'),
        createMockReview(3, '2'),
        createMockReview(3, '3'),
      ];

      const { container } = render(<RatingDistribution reviews={reviews} />);

      const bars = container.querySelectorAll('[style*="width"]');
      
      // Only 3-star (index 2) should have 100%
      expect(bars[2]).toHaveStyle({ width: '100%' });
      expect(bars[0]).toHaveStyle({ width: '0%' });
      expect(bars[1]).toHaveStyle({ width: '0%' });
      expect(bars[3]).toHaveStyle({ width: '0%' });
      expect(bars[4]).toHaveStyle({ width: '0%' });
    });
  });
});
