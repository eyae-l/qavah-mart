/**
 * Unit Tests for AddToCartButton Component
 * Requirements: Shopping Cart Feature - Requirement 1
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddToCartButton } from './AddToCartButton';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

// Mock the contexts
jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: jest.fn(),
}));

describe('AddToCartButton', () => {
  const mockAddItem = jest.fn();
  const mockHasItem = jest.fn();
  const mockShowToast = jest.fn();

  const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
  const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

  const defaultProps = {
    productId: 'product-1',
    productTitle: 'Test Product',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockUseCart.mockReturnValue({
      addItem: mockAddItem,
      hasItem: mockHasItem,
    } as any);

    mockUseToast.mockReturnValue({
      showToast: mockShowToast,
    } as any);

    mockAddItem.mockResolvedValue(undefined);
    mockHasItem.mockReturnValue(false);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render button with "Add to Cart" text', () => {
      render(<AddToCartButton {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<AddToCartButton {...defaultProps} className="custom-class" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should show "Add Another" when item is already in cart', () => {
      mockHasItem.mockReturnValue(true);
      
      render(<AddToCartButton {...defaultProps} />);
      
      expect(screen.getByText('Add Another')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<AddToCartButton {...defaultProps} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Add to Cart Functionality', () => {
    it('should call addItem when button clicked', async () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith('product-1', 1);
      });
    });

    it('should show success toast after adding item', async () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Test Product added to cart', 'success');
      });
    });

    it('should not call addItem when disabled', async () => {
      render(<AddToCartButton {...defaultProps} disabled={true} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockAddItem).not.toHaveBeenCalled();
      });
    });

    it('should not call addItem multiple times during operation', async () => {
      mockAddItem.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during add operation', async () => {
      mockAddItem.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(screen.getByText('Adding...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalled();
      });
    });

    it('should disable button during loading', async () => {
      mockAddItem.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(button).toBeDisabled();
      
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalled();
      });
    });
  });

  describe('Success State', () => {
    it('should show success state after adding item', async () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Added to Cart!')).toBeInTheDocument();
      });
    });

    it('should reset to normal state after 2 seconds', async () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Added to Cart!')).toBeInTheDocument();
      });
      
      // Fast-forward 2 seconds and wait for state update
      jest.advanceTimersByTime(2000);
      
      await waitFor(() => {
        expect(screen.queryByText('Added to Cart!')).not.toBeInTheDocument();
      });
      
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('should apply success styling when just added', async () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveClass('bg-green-600');
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error toast when add fails', async () => {
      mockAddItem.mockRejectedValue(new Error('Network error'));
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Failed to add item to cart', 'error');
      });
    });

    it('should not show success state when add fails', async () => {
      mockAddItem.mockRejectedValue(new Error('Network error'));
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Failed to add item to cart', 'error');
      });
      
      expect(screen.queryByText('Added to Cart!')).not.toBeInTheDocument();
    });

    it('should re-enable button after error', async () => {
      mockAddItem.mockRejectedValue(new Error('Network error'));
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Failed to add item to cart', 'error');
      });
      
      expect(button).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label when item not in cart', () => {
      mockHasItem.mockReturnValue(false);
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      expect(button).toBeInTheDocument();
    });

    it('should have proper aria-label when item in cart', () => {
      mockHasItem.mockReturnValue(true);
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: /add another to cart/i });
      expect(button).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Visual States', () => {
    it('should show shopping cart icon in default state', () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('should show check icon in success state', async () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Added to Cart!')).toBeInTheDocument();
      });
    });

    it('should show spinner during loading', async () => {
      mockAddItem.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      
      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalled();
      });
    });
  });

  describe('Touch Interaction', () => {
    it('should have touch-manipulation class for mobile', () => {
      render(<AddToCartButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('touch-manipulation');
    });
  });
});
