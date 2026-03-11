/**
 * Unit Tests for CartIcon Component
 * Requirements: Shopping Cart Feature - Requirement 6
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartIcon } from './CartIcon';
import { useCart } from '@/contexts/CartContext';

// Mock the CartContext
jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('CartIcon', () => {
  const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render cart icon', () => {
      mockUseCart.mockReturnValue({
        itemCount: 0,
        isLoading: false,
      } as any);

      render(<CartIcon />);
      
      const link = screen.getByRole('link', { name: /shopping cart/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/cart');
    });

    it('should render with custom className', () => {
      mockUseCart.mockReturnValue({
        itemCount: 0,
        isLoading: false,
      } as any);

      const { container } = render(<CartIcon className="custom-class" />);
      const link = container.querySelector('a');
      expect(link).toHaveClass('custom-class');
    });

    it('should have correct aria-label with item count', () => {
      mockUseCart.mockReturnValue({
        itemCount: 5,
        isLoading: false,
      } as any);

      render(<CartIcon />);
      
      const link = screen.getByRole('link', { name: 'Shopping cart with 5 items' });
      expect(link).toBeInTheDocument();
    });
  });

  describe('Badge Display', () => {
    it('should not show badge when cart is empty', () => {
      mockUseCart.mockReturnValue({
        itemCount: 0,
        isLoading: false,
      } as any);

      render(<CartIcon />);
      
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should show badge with item count when cart has items', () => {
      mockUseCart.mockReturnValue({
        itemCount: 3,
        isLoading: false,
      } as any);

      render(<CartIcon />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should show "99+" when item count exceeds 99', () => {
      mockUseCart.mockReturnValue({
        itemCount: 150,
        isLoading: false,
      } as any);

      render(<CartIcon />);
      
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('should show exact count for 99 items', () => {
      mockUseCart.mockReturnValue({
        itemCount: 99,
        isLoading: false,
      } as any);

      render(<CartIcon />);
      
      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('should not show badge when loading', () => {
      mockUseCart.mockReturnValue({
        itemCount: 5,
        isLoading: true,
      } as any);

      render(<CartIcon />);
      
      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should hide badge during loading even with items', () => {
      mockUseCart.mockReturnValue({
        itemCount: 10,
        isLoading: true,
      } as any);

      render(<CartIcon />);
      
      expect(screen.queryByText('10')).not.toBeInTheDocument();
    });

    it('should show badge after loading completes', () => {
      const { rerender } = render(<CartIcon />);
      
      mockUseCart.mockReturnValue({
        itemCount: 7,
        isLoading: true,
      } as any);
      rerender(<CartIcon />);
      expect(screen.queryByText('7')).not.toBeInTheDocument();

      mockUseCart.mockReturnValue({
        itemCount: 7,
        isLoading: false,
      } as any);
      rerender(<CartIcon />);
      expect(screen.getByText('7')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper link role', () => {
      mockUseCart.mockReturnValue({
        itemCount: 0,
        isLoading: false,
      } as any);

      render(<CartIcon />);
      
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('should update aria-label based on item count', () => {
      mockUseCart.mockReturnValue({
        itemCount: 1,
        isLoading: false,
      } as any);

      const { rerender } = render(<CartIcon />);
      expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Shopping cart with 1 items');

      mockUseCart.mockReturnValue({
        itemCount: 10,
        isLoading: false,
      } as any);
      rerender(<CartIcon />);
      expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Shopping cart with 10 items');
    });
  });
});
